// Comandos de liga: cada um valida o pedido e chama a MESMA função do motor que a interface antiga chamava
// no navegador, só que agora sobre o estado autoritativo e em nome da mesa de quem pediu.
//
// Contrato de um handler: (ctx) => resultado (objeto pequeno, vai para commands.result).
//   ctx = { S, payload, userId, member: { desk_key, role }, profile: { display_name, avatar } | null, isAdmin, out: { members: [] } }
// Recusa esperada (regra de jogo, pedido inválido): throw new Reject(codigo, 'mensagem para o usuário').
// Qualquer outra exceção é tratada como erro interno; em ambos os casos a mutação parcial é desfeita.
import { CORE, WORLD as Wd, SEASON as SE, MARKET as MK, EVENTS as EV } from '../../../app/src/engine/index.js';
import { Reject, need, isObj, has, deskOf } from './common.js';
import { marketHandlers } from './market.js';
export { Reject };

const newDeskKey = S => {
  for (;;) { const k = 'd' + Math.random().toString(36).slice(2, 11).padEnd(9, '0'); if (!S.desks[k]) return k; }
};

function coachProfile(payload, profile) {
  const c = isObj(payload.coach) ? payload.coach : {};
  const name = String(c.name ?? (profile && profile.display_name) ?? '').trim();
  need(name.length >= 1 && name.length <= 20, 'name', 'Informe o nome do treinador (até 20 caracteres).');
  const style = c.style ?? 'equilibrado';
  need(has(CORE.STYLES, style), 'style', 'Estilo de jogo inválido.');
  const avatar = isObj(c.avatar) ? c.avatar : ((profile && profile.avatar) || {});
  need(JSON.stringify(avatar).length <= 2000, 'avatar', 'Avatar inválido.');
  return { name, style, avatar };
}

export const handlers = {
  ...marketHandlers,
  // Assume um clube: sorteio, escolha (se a liga permitir) ou código de vaga do ADM. Porta de claimClub/joinAs do original.
  'club.claim'(ctx) {
    const { S, payload, member } = ctx;
    if (member.desk_key && S.desks[member.desk_key]) return { club: S.desks[member.desk_key].club, deskKey: member.desk_key, already: true };
    need(member.role === 'coach', 'spectator', 'Espectador não assume clube.');
    const coach = coachProfile(payload, ctx.profile);
    const want = payload.want ?? null, vaga = payload.vaga ?? null;
    need(want === null || typeof want === 'string', 'want', 'Clube inválido.');
    let club;
    if (vaga !== null) {
      const V = want !== null ? Wd.vagas(S)[want] : null;
      need(V && V.h === vaga, 'vaga', 'Este código de vaga não vale mais (já foi usado, venceu ou o ADM cancelou). Peça outro ao ADM.');
      need(!Wd.humanClubs(S).includes(want), 'taken', `O ${want} já tem treinador. Peça outro código ao ADM.`);
      delete S.league.vag[want];
      club = want;
    } else {
      need(Wd.coachCount(S) < Wd.leagueCap(S), 'full', `Liga cheia: as ${Wd.leagueCap(S)} vagas de treinador estão ocupadas.`);
      if (want !== null) {
        need(Wd.leaguePick(S) === 'choice', 'pick', 'Nesta liga o clube é definido por sorteio.');
        need(Wd.choicePool(S).includes(want), 'taken', `O ${want} não está mais disponível. Escolha outro clube.`);
        club = want;
      } else {
        const pool = Wd.drawPool(S);
        need(pool.length > 0, 'full', 'Liga cheia: não sobrou clube livre nas divisões desta liga.');
        club = pool[Math.floor(Math.random() * pool.length)];
      }
    }
    const key = newDeskKey(S);
    Wd.addDesk(S, key, coach, club);
    Wd.asDesk(S, key, () => {
      SE.balanceWallet(S);
      MK.dailyPack(S, S.lastDay ?? SE.dayAbs(S, SE.now(S)));
      EV.news(S, { t: 'coach', title: `${coach.name} assume o ${club}`, body: `Novo treinador na liga. Estilo preferido: ${CORE.STYLES[coach.style].name}.`, clubs: [club], front: 90 });
    });
    if (ctx.isAdmin && S.league) S.league.admin = key;   // o motor identifica o ADM pela chave da mesa
    ctx.out.members.push({ user_id: ctx.userId, role: 'coach', desk_key: key, club });
    return { club, deskKey: key };
  },

  // Tática e escalação. Só os campos enviados mudam. O motor ainda saneia a escalação na hora do jogo (userTeam).
  'tactics.set'(ctx) {
    const { S, payload: p } = ctx;
    const key = deskOf(ctx), d = S.desks[key], T = d.tactics;
    const squad = new Set(Wd.squad(S, d.club));
    const mine = id => Number.isInteger(id) && squad.has(id);
    const next = {};

    if (has(p, 'formation')) { need(has(CORE.FORMATIONS, p.formation), 'formation', 'Formação inválida.'); next.formation = p.formation; }
    if (has(p, 'style')) { need(has(CORE.STYLES, p.style), 'style', 'Estilo de jogo inválido.'); next.style = p.style; }
    const formation = next.formation || T.formation, slots = CORE.FORMATIONS[formation];
    need(slots, 'formation', 'Formação inválida.');

    if (has(p, 'xi')) {
      need(Array.isArray(p.xi) && p.xi.length === slots.length, 'xi', `A escalação precisa de ${slots.length} posições.`);
      const ids = p.xi.filter(x => x !== null);
      need(ids.every(mine), 'xi', 'Há jogador na escalação que não é do seu elenco.');
      need(new Set(ids).size === ids.length, 'xi', 'Jogador repetido na escalação.');
      next.xi = p.xi.slice();
    } else if (next.formation && next.formation !== T.formation && Array.isArray(T.xi) && T.xi.length !== slots.length) {
      next.xi = [];   // mudou o número de posições: o motor monta a escalação automática
    }
    if (has(p, 'bench')) {
      need(p.bench === null || (Array.isArray(p.bench) && p.bench.length <= 9), 'bench', 'O banco tem no máximo 9 jogadores.');
      if (p.bench) {
        need(p.bench.every(mine), 'bench', 'Há jogador no banco que não é do seu elenco.');
        need(new Set(p.bench).size === p.bench.length, 'bench', 'Jogador repetido no banco.');
        const xi = new Set(next.xi || T.xi || []);
        need(p.bench.every(id => !xi.has(id)), 'bench', 'Titular não pode estar no banco.');
      }
      next.bench = p.bench ? p.bench.slice() : null;
    }
    for (const f of ['pk', 'cap', 'vice']) if (has(p, f)) {
      need(p[f] === null || mine(p[f]), f, 'Jogador inválido para a função.');
      next[f] = p[f];
    }
    if (has(p, 'auto')) { need(typeof p.auto === 'boolean', 'auto', 'Valor inválido.'); next.auto = p.auto; }
    if (has(p, 'triggers')) {
      need(isObj(p.triggers), 'triggers', 'Gatilhos inválidos.');
      const tr = {};
      for (const k of ['lead2', 'losing60', 'draw75']) {
        const style = p.triggers[k] ?? '', form = p.triggers[k + 'f'] ?? '';
        need(style === '' || has(CORE.STYLES, style), 'triggers', 'Estilo inválido num gatilho.');
        need(form === '' || has(CORE.FORMATIONS, form), 'triggers', 'Formação inválida num gatilho.');
        tr[k] = style; tr[k + 'f'] = form;
      }
      next.triggers = tr;
    }
    need(Object.keys(next).length > 0, 'empty', 'Nada para alterar.');
    Object.assign(T, next);
    return { tactics: { formation: T.formation, style: T.style } };
  },

  // Sinal de presença: a atividade do treinador é o que o motor usa para a regra de inatividade.
  // (Qualquer comando já marca presença; este existe para quem só abriu o jogo.)
  'desk.seen'(ctx) { deskOf(ctx); return {}; },
};
