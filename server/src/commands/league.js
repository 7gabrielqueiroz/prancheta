// Comandos sem liga: criar uma liga e entrar numa pelo código. Rodam fora do lease (ainda não há liga, ou não mexem no estado de jogo).
// Não são atômicos com a conclusão do comando, então são IDEMPOTENTES: repetir depois de uma queda dá o mesmo resultado.
import { randomBytes } from 'node:crypto';
import { NETCORE as NC } from '../../../app/src/net/netcore.js';
import { WORLD as Wd, SEASON as SE, EVENTS as EV } from '../../../app/src/engine/index.js';
import { Reject } from './handlers.js';

const need = (cond, code, message) => { if (!cond) throw new Reject(code, message); };
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // sem 0/O e 1/I
const newCode = () => Array.from(randomBytes(6), b => CODE_CHARS[b % CODE_CHARS.length]).join('');
const DIVS = ['A', 'B', 'C'];
export const MAX_NEW_LEAGUES_PER_DAY = 3;

// A liga nasce com id = id do comando: se o worker cair depois de criar e antes de concluir, a repetição acha a liga pronta.
export async function createLeague({ db, store, cmd, engineVersion }) {
  const p = cmd.payload || {};
  const done = async () => {
    const L = (await db.query(`select id, code, name from public.leagues where id = $1::uuid`, [cmd.id])).rows[0];
    if (!L) return null;
    await db.query(`insert into public.league_members (league_id, user_id, role) values ($1::uuid, $2::uuid, 'coach') on conflict do nothing`, [L.id, cmd.user_id]);
    return { leagueId: L.id, code: L.code, name: L.name };
  };
  const existing = await done();
  if (existing) return existing;

  const name = String(p.name ?? '').trim().slice(0, 30) || 'Liga PRANCHETA';
  const mode = p.mode === 'turbo' ? 'turbo' : 'normal';
  const pick = p.pick === 'choice' ? 'choice' : 'draw';
  const divs = Array.isArray(p.divs) && p.divs.length ? DIVS.filter(d => p.divs.includes(d)) : DIVS;
  need(divs.length > 0, 'divs', 'Escolha ao menos uma divisão.');
  const n = (await db.query(`select count(*)::int as n from public.leagues where admin_user_id = $1::uuid and created_at > now() - interval '24 hours'`, [cmd.user_id])).rows[0].n;
  need(n < MAX_NEW_LEAGUES_PER_DAY, 'limit', `Limite de ${MAX_NEW_LEAGUES_PER_DAY} ligas novas a cada 24 horas. Tente de novo amanhã.`);

  Wd.resetCache();
  const S = Wd.newWorld({ now: Date.now(), mode });
  SE.setupSeason(S); S.lastT = S.seasonStart;
  S.league = { code: null, name, admin: null, divs, pick, solo: false };   // admin = chave da mesa do ADM, preenchida quando ele assume um clube
  S.msalt = randomBytes(16).toString('hex');
  EV.news(S, { t: 'club', title: `Começa a ${name}`, body: mode === 'turbo'
    ? `Modo Turbo: a temporada ${S.season} inteira em 7 dias reais, com 8 jogos por dia (8h às 23h30).`
    : `Modo Normal: a temporada ${S.season} dura 28 dias reais, com jogos às 12h e 18h.` });
  Wd.bindDesks(S);

  for (let i = 0; ; i++) {
    S.league.code = newCode();
    try {
      await store.create(S.league.code, S, { id: cmd.id, adminUserId: cmd.user_id, name, settings: { pick, divs }, nextTickAt: NC.nextAt(S), engineVersion });
      break;
    } catch (e) {
      if (i < 5 && /leagues_code_key/.test(String(e && e.message))) continue;   // código já usado: sorteia outro
      throw e;
    }
  }
  return done();
}

// Entrar pelo código: só cria o vínculo. O clube vem depois, com club.claim (que roda sob o lease da liga).
export async function joinLeague({ db, cmd }) {
  const code = String((cmd.payload || {}).code ?? '').trim().toUpperCase();
  need(/^[A-Z0-9]{6}$/.test(code), 'code', 'Código de liga inválido.');
  const L = (await db.query(`select id, code, name, status from public.leagues where code = $1`, [code])).rows[0];
  need(L && L.status === 'active', 'notfound', 'Não achei uma liga com esse código.');
  const m = (await db.query(`select removed_at from public.league_members where league_id = $1 and user_id = $2::uuid`, [L.id, cmd.user_id])).rows[0];
  need(!m || !m.removed_at, 'removed', 'Você foi removido desta liga. Fale com o ADM.');
  if (!m) await db.query(`insert into public.league_members (league_id, user_id, role) values ($1, $2::uuid, 'coach') on conflict do nothing`, [L.id, cmd.user_id]);
  return { leagueId: L.id, code: L.code, name: L.name, already: !!m };
}

export const globalHandlers = { 'league.create': createLeague, 'league.join': joinLeague };
