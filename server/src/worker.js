// Worker: única coisa que grava estado de jogo. Para cada liga com trabalho:
//   pega o lease -> carrega -> aplica os comandos pendentes em ordem -> avança o relógio do motor -> grava tudo numa transação.
// Se o commit falhar (conflito, lease perdido), nada é gravado e os comandos continuam pendentes para a próxima volta.
import { randomUUID } from 'node:crypto';
import { splitState, assembleState } from './league-state.js';
import { advance } from './tick.js';
import { handlers as leagueHandlers, Reject } from './commands/handlers.js';
import { globalHandlers } from './commands/league.js';

export const ENGINE_VERSION = 'prancheta-0.1';
const short = e => String((e && e.message) || e).slice(0, 300);

export function createWorker({ db, store, handlers = leagueHandlers, holder = 'w-' + randomUUID().slice(0, 8), leaseSeconds = 120, maxCommands = 50, log = () => {} }) {
  const finish = (id, status, result, error) =>
    db.query(`select public.finish_command($1::uuid, $2, $3::jsonb, $4)`, [id, status, result == null ? null : JSON.stringify(result), error ?? null]);

  // Comandos sem liga (criar liga, entrar por código).
  async function processGlobal(limit = 20) {
    const cmds = (await db.query(
      `select id, user_id, type, payload from public.commands where status = 'pending' and league_id is null order by created_at, id limit $1`, [limit])).rows;
    const out = [];
    for (const cmd of cmds) {
      try {
        const h = globalHandlers[cmd.type];
        if (!h) throw new Reject('unknown', 'Comando desconhecido.');
        const result = await h({ db, store, cmd, engineVersion: ENGINE_VERSION });
        await finish(cmd.id, 'done', result, null);
        out.push({ id: cmd.id, status: 'done' });
      } catch (e) {
        if (e.reject) await finish(cmd.id, 'rejected', { code: e.reject }, e.message);
        else { log('erro em comando global', cmd.type, e); await finish(cmd.id, 'error', null, short(e)); }
        out.push({ id: cmd.id, status: e.reject ? 'rejected' : 'error' });
      }
    }
    return out;
  }

  async function processLeague(leagueId) {
    const got = (await db.query(`select public.acquire_league_lease($1::uuid, $2, $3) as ok`, [leagueId, holder, leaseSeconds])).rows[0].ok;
    if (!got) return { leagueId, skipped: 'lease' };
    const t0 = performance.now();
    let report = { leagueId, ok: false }, failure = null;
    try {
      const base = await store.load(leagueId);
      if (!base) throw new Error('liga sem mundo');
      let S = assembleState(base);
      const members = new Map((await db.query(
        `select m.user_id, m.desk_key, m.role, p.display_name, p.avatar
           from public.league_members m left join public.profiles p on p.user_id = m.user_id
          where m.league_id = $1 and m.removed_at is null`, [leagueId])).rows.map(r => [r.user_id, r]));
      const cmds = (await db.query(
        `select id, user_id, type, payload from public.commands where league_id = $1 and status = 'pending' order by created_at, id limit $2`,
        [leagueId, maxCommands])).rows;

      const results = [], newMembers = [];
      // último estado bom, para desfazer a mutação parcial de um comando que falha no meio
      let good = cmds.length ? splitState(S) : null;
      const restore = () => assembleState({ w: good.w, secrets: good.secrets, desks: Object.fromEntries(Object.entries(good.desks).map(([k, str]) => [k, { str }])) });

      for (const cmd of cmds) {
        const member = members.get(cmd.user_id);
        const out = { members: [] };
        try {
          const h = handlers[cmd.type];
          if (!h) throw new Reject('unknown', 'Comando desconhecido.');
          if (!member) throw new Reject('member', 'Você não faz parte desta liga.');
          const result = h({
            S, payload: cmd.payload || {}, userId: cmd.user_id, member, out,
            profile: member.display_name ? { display_name: member.display_name, avatar: member.avatar } : null,
            isAdmin: base.adminUserId === cmd.user_id,
          }) ?? {};
          for (const m of out.members) { newMembers.push(m); members.set(m.user_id, { ...member, ...m }); }
          const key = members.get(cmd.user_id).desk_key;
          if (key && S.desks[key]) S.desks[key].seen = Date.now();   // atividade do treinador (regra de inatividade do motor)
          good = splitState(S);
          results.push({ id: cmd.id, status: 'done', result });
        } catch (e) {
          S = restore();
          if (e.reject) results.push({ id: cmd.id, status: 'rejected', result: { code: e.reject }, error: e.message });
          else { log('erro em comando', cmd.type, e); results.push({ id: cmd.id, status: 'error', result: null, error: short(e) }); }
        }
      }

      const a = advance(S);
      const r = await store.commit(leagueId, base, S, { holder, nextTickAt: a.nextAt, commands: results, members: newMembers });

      // o motor pode passar a administração adiante (ADM sumido): o banco acompanha
      const admKey = S.league && S.league.admin;
      const admUser = admKey && [...members.values()].find(m => m.desk_key === admKey);
      if (admUser && admUser.user_id !== base.adminUserId)
        await db.query(`update public.leagues set admin_user_id = $2::uuid where id = $1::uuid`, [leagueId, admUser.user_id]);

      report = { leagueId, ok: true, ver: r.ver, changed: r.changed, commands: results.map(x => ({ id: x.id, status: x.status })), loops: a.loops, slots: a.slots, more: a.more };
    } catch (e) {
      failure = e;
      report = { leagueId, ok: false, why: e.code === 'conflict' ? 'conflict:' + e.why : 'error', error: short(e) };
    } finally {
      // conflito não é defeito da liga: solta o lease sem castigo e tenta na próxima volta
      const penal = failure && failure.code !== 'conflict' ? short(failure) : null;
      await db.query(`select public.release_league_lease($1::uuid, $2, $3)`, [leagueId, holder, penal]);
      await db.query(
        `insert into public.tick_log (league_id, holder, ms, loops, slots, commands, ok, error) values ($1::uuid, $2, $3, $4, $5, $6, $7, $8)`,
        [leagueId, holder, Math.round(performance.now() - t0), report.loops ?? null, report.slots ?? null, report.commands ? report.commands.length : null, report.ok, report.ok ? null : report.error]);
    }
    return report;
  }

  // Uma volta: comandos globais e depois cada liga com trabalho.
  async function runOnce({ limit = 20 } = {}) {
    const global = await processGlobal();
    const ids = (await db.query(`select public.leagues_with_work($1) as id`, [limit])).rows.map(r => r.id);
    const leagues = [];
    for (const id of ids) leagues.push(await processLeague(id));
    return { global, leagues };
  }

  return { holder, runOnce, processGlobal, processLeague };
}
