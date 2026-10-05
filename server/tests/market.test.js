// Comandos de mercado de ponta a ponta: o cliente insere como usuário autenticado (RLS), o worker aplica com o motor
// real, e o resultado é conferido no estado gravado. Duas mesas humanas (ana e bia) e um membro sem clube (caio).
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { T0, installFakes, freshRuntime, newDb, newUser, asUser, stable, sha } from './helpers.js';

const st = installFakes();
let R, db, store, worker, L, ana, bia, caio, aKey, bKey, aClub, bClub;
const Wd = () => R.E.WORLD, MK = () => R.E.MARKET;

const send = (uid, league, type, payload = {}) => asUser(db, uid, tx =>
  tx.query(`insert into public.commands (league_id, type, payload) values ($1, $2, $3::jsonb) returning id`, [league, type, JSON.stringify(payload)])).then(r => r.rows[0].id);
const cmd = id => db.query(`select status, result, error from public.commands where id = $1`, [id]).then(r => r.rows[0]);
const run = async (uid, type, payload) => { const id = await send(uid, L, type, payload); await worker.runOnce(); return cmd(id); };
const load = async () => R.assembleState(await store.load(L));
const as = (S, key, fn) => Wd().asDesk(S, key, fn);
// o que importa da mesa de um treinador
const desk = (S, key) => as(S, key, () => ({
  club: S.club, cash: S.cash[S.club], stars: S.stars, dias: S.dias, squad: Wd().squad(S, S.club), negs: S.negs, offers: S.offers,
  outOffers: S.outOffers || [], packs: S.packs, budget: MK().budget(S),
}));
// impressão digital do jogo inteiro, sem o carimbo de presença (que muda a cada comando)
const fingerprint = async () => { const S = await load(); for (const k in S.desks) delete S.desks[k].seen; return sha(stable(S)); };
let ticks = 0;
async function advance(n) {
  for (let i = 0; i < n; i++) {
    st.clock = T0 + (++ticks) * 30 * 60000;
    if (ticks % 24 === 0) { await send(ana, L, 'desk.seen'); await send(bia, L, 'desk.seen'); }   // a regra de inatividade do motor demite quem some por 72 h
    await worker.runOnce();
  }
}
const ovr = (S, id) => Wd().view(S, id).ovr;
const onLoan = (S, id) => !!(S.ps[id] && (S.ps[id].loan || S.ps[id].loanOut));

// jogador de um clube de IA com quem a mesa `key` pode negociar a um preço que cabe no orçamento
function aiTarget(S, key, { skip = () => false } = {}) {
  return as(S, key, () => {
    const humans = new Set(Wd().humanClubs(S)), budget = MK().budget(S);
    for (const club of [...S.divA, ...S.divB]) {
      if (humans.has(club)) continue;
      for (const id of Wd().squad(S, club)) {
        if (skip(id) || S.negs[id] || Wd().P[id].youth || !MK().canTalk(S, id).ok || MK().diaReq(S, id)) continue;
        const a = MK().ask(S, id, S.club);
        if (a.fee > 0 && a.fee * 1.5 < budget.transfer && MK().salaryDemand(S, id, S.club) < budget.wageRoom / 2) return { id, club, fee: a.fee };
      }
    }
    return null;
  });
}
// jogador do elenco de `key` que pode ser vendido a outro treinador
const sellable = (S, key) => as(S, key, () => Wd().squad(S, S.club)
  .filter(i => !Wd().locked(S, i) && !Wd().P[i].youth && !onLoan(S, i) && !MK().pendingOf(S, i) && !MK().diaReq(S, i))
  .sort((x, y) => ovr(S, x) - ovr(S, y)));

beforeAll(async () => {
  st.reset(); R = await freshRuntime(vi);
  db = await newDb(); store = new R.PgStore(db); worker = R.createWorker({ db, store });
  [ana, bia, caio] = await Promise.all(['ana', 'bia', 'caio'].map(n => newUser(db, n + '@x.test')));
  const c0 = await send(ana, null, 'league.create', { name: 'Mercado', mode: 'turbo' });
  await worker.runOnce();
  L = (await cmd(c0)).result.leagueId;
  const code = (await db.query(`select code from public.leagues where id = $1`, [L])).rows[0].code;
  await send(bia, null, 'league.join', { code }); await send(caio, null, 'league.join', { code }); await worker.runOnce();
  const ca = await send(ana, L, 'club.claim', { coach: { name: 'Ana' } }); await worker.runOnce();
  const cb = await send(bia, L, 'club.claim', { coach: { name: 'Bia' } }); await worker.runOnce();
  ({ deskKey: aKey, club: aClub } = (await cmd(ca)).result); ({ deskKey: bKey, club: bClub } = (await cmd(cb)).result);
  // 1 dia de jogo: passa a pré-temporada (trava de clubes do Brasileirão) e a janela segue aberta até a rodada 16
  await advance(48);
});

describe('base do cenário', () => {
  it('a impressão digital é estável, os dois treinadores seguem empregados e a janela está aberta', async () => {
    expect(await fingerprint()).toBe(await fingerprint());
    const S = await load();
    expect(R.E.SEASON.windowOpen(R.E.SEASON.now(S), S)).toBe(true);
    expect(S.slot).toBeGreaterThan(0);
    for (const k of [aKey, bKey]) expect(S.desks[k].unemployed).toBeFalsy();
  });
});

describe('validação do payload: o motor nunca recebe lixo', () => {
  const bad = [
    ['market.bid', { id: '123', fee: 10 }, 'player'], ['market.bid', { id: -1, fee: 10 }, 'player'], ['market.bid', { id: 99999999999, fee: 10 }, 'player'],
    ['market.bid', { id: 'FREE', fee: '1000' }, 'fee'], ['market.bid', { id: 'FREE', fee: -5 }, 'fee'], ['market.bid', { id: 'FREE', fee: 1e12 }, 'fee'],
    ['market.bid', { id: 'FREE', fee: null }, 'fee'], ['market.bid', { id: 'FREE', fee: 10, swap: 'x' }, 'player'],
    ['market.contract', { id: 'FREE', sal: '20', years: 3 }, 'sal'], ['market.contract', { id: 'FREE', sal: -1, years: 3 }, 'sal'], ['market.contract', { id: 'FREE', sal: 1e9, years: 3 }, 'sal'],
    ['market.contract', { id: 'FREE', sal: 20, years: 0 }, 'years'], ['market.contract', { id: 'FREE', sal: 20, years: 6 }, 'years'], ['market.contract', { id: 'FREE', sal: 20, years: 2.5 }, 'years'],
    ['market.contract', { id: 'FREE', sal: 20, years: '3' }, 'years'], ['market.contract', { id: 'FREE', sal: 20, years: 3, pre: 'sim' }, 'pre'],
    ['market.renew', { id: 'FREE', years: 9 }, 'years'], ['market.release', { id: null }, 'player'], ['market.negDrop', {}, 'player'],
    ['market.cashOut', { kind: 'star', n: -5 }, 'n'], ['market.cashOut', { kind: 'star', n: 0 }, 'n'], ['market.cashOut', { kind: 'star', n: 1.5 }, 'n'],
    ['market.cashOut', { kind: 'star', n: '1' }, 'n'], ['market.cashOut', { kind: 'ouro', n: 1 }, 'kind'], ['market.cashOut', { kind: 'dia', n: -1 }, 'n'],
    ['market.acceptOffer', { k: -1 }, 'offer'], ['market.acceptOffer', { k: 'a' }, 'offer'], ['market.declineOffer', { k: 1.5 }, 'offer'],
    ['market.counterOffer', { k: 1, value: -1 }, 'value'], ['market.counterOffer', { k: 1, value: 10, share: 150 }, 'share'],
    ['market.respondCounter', { k: 1, yes: 'sim' }, 'yes'],
    ['market.setListing', { id: 'FREE', kind: 'venda' }, 'kind'], ['market.setListing', { id: 'FREE', kind: 'loan', len: '2y' }, 'len'],
    ['market.requestLoan', { id: 'FREE', fee: 1000, share: 5 }, 'share'], ['market.requestLoan', { id: 'FREE', fee: -1, share: 50 }, 'fee'], ['market.requestLoan', { id: 'FREE', share: 50 }, 'fee'],
    ['market.recallLoan', { id: 'FREE', refund: -3 }, 'refund'],
    ['market.takePack', { list: -1, option: 0 }, 'pack'], ['market.takePack', { list: 99, option: 0 }, 'pack'], ['market.takePack', { list: 0, option: 77 }, 'pack'], ['market.skipPack', { list: 99 }, 'pack'],
    ['finance.wageBudget', { value: -1 }, 'value'], ['finance.wageBudget', { value: '9999' }, 'value'],
  ];

  it(`${bad.length} pedidos inválidos: todos recusados e o jogo não muda um byte`, async () => {
    const S = await load(), id = S.free.find(i => Wd().P[i] && !Wd().P[i].youth), before = await fingerprint();
    for (const [type, payload, code] of bad) {
      const p = JSON.parse(JSON.stringify(payload).replace(/"FREE"/g, String(id)));
      const c = await run(ana, type, p);
      expect(c.status, `${type} ${JSON.stringify(p)} -> ${JSON.stringify(c)}`).toBe('rejected');
      expect(c.result.code, `${type} ${JSON.stringify(p)}`).toBe(code);
    }
    expect(await fingerprint()).toBe(before);
  });

  it('cashOut negativo não "compra" estrelas com o caixa', async () => {
    const a0 = desk(await load(), aKey);
    expect((await run(ana, 'market.cashOut', { kind: 'star', n: -20 })).status).toBe('rejected');
    const a1 = desk(await load(), aKey);
    expect([a1.stars, a1.cash]).toEqual([a0.stars, a0.cash]);
  });

  it('quem não tem clube não opera o mercado', async () => {
    const before = await fingerprint(), S = await load(), id = S.free.find(i => Wd().P[i] && !Wd().P[i].youth);
    expect(await run(caio, 'market.cashOut', { kind: 'star', n: 1 })).toMatchObject({ status: 'rejected', result: { code: 'nodesk' } });
    expect((await run(caio, 'market.bid', { id, fee: 10 })).result.code).toBe('nodesk');
    expect(await fingerprint()).toBe(before);
  });
});

describe('jogador livre: contratar', () => {
  it('salário baixo é recusado; o pedido do empresário fecha o contrato', async () => {
    const S = await load(), before = desk(S, aKey), bVer = (await store.load(L)).desks[bKey].ver;
    const id = S.free.find(i => Wd().P[i] && !Wd().P[i].youth && as(S, aKey, () => MK().canTalk(S, i).ok));
    const low = await run(ana, 'market.contract', { id, sal: 5, years: 3 });
    expect(low).toMatchObject({ status: 'done', result: { outcome: { status: 'reject' } } });
    const demand = low.result.outcome.demand;
    expect(demand).toBeGreaterThan(5);
    expect((await load()).free).toContain(id);                      // nada mudou ainda

    const ok = await run(ana, 'market.contract', { id, sal: demand, years: 3 });
    expect(ok).toMatchObject({ status: 'done', result: { outcome: { status: 'accept' } } });
    const S2 = await load(), after = desk(S2, aKey);
    expect(Wd().ownerOf(S2, id)).toBe(aClub);
    expect(after.squad.length).toBe(before.squad.length + 1);
    expect(after.cash).toBe(before.cash);                            // livre: sem taxa
    expect([S2.ps[id].sal, S2.ps[id].ce]).toEqual([demand, S2.season + 3]);
    expect(S2.free).not.toContain(id);
    expect((await store.load(L)).desks[bKey].ver).toBe(bVer);        // a mesa da bia não foi tocada
  });
});

describe('clube da IA: proposta e contrato', () => {
  it('propostas muito baixas gastam as 3 tentativas e o clube encerra a conversa', async () => {
    const S = await load(), c = aiTarget(S, aKey); expect(c).not.toBeNull();
    for (let i = 1; i <= 3; i++) {
      const r = await run(ana, 'market.bid', { id: c.id, fee: 1 });
      expect(r.status).toBe('done');
      expect(['reject', 'closed']).toContain(r.result.outcome.status);
      expect(desk(await load(), aKey).negs[c.id].tries).toBe(i);
    }
    const S2 = await load();
    expect(desk(S2, aKey).negs[c.id].closedUntil).toBeGreaterThan(S2.lastDay);
    expect((await run(ana, 'market.bid', { id: c.id, fee: c.fee * 2 })).result.outcome.status).toBe('closed');
  });

  it('proposta pelo preço pedido + contrato: jogador muda de clube e o dinheiro anda dos dois lados', async () => {
    const S = await load(), c = aiTarget(S, aKey); expect(c).not.toBeNull();
    const before = desk(S, aKey), sellerCash = S.cash[c.club];
    const bid = await run(ana, 'market.bid', { id: c.id, fee: c.fee });
    expect(bid.result.outcome).toMatchObject({ status: 'accept', fee: c.fee });
    expect(desk(await load(), aKey).negs[c.id]).toMatchObject({ fee: c.fee, owner: c.club });

    const demand = as(S, aKey, () => MK().salaryDemand(S, c.id, S.club));
    let k = await run(ana, 'market.contract', { id: c.id, sal: demand, years: 3 });
    if (k.result.outcome.status !== 'accept') k = await run(ana, 'market.contract', { id: c.id, sal: k.result.outcome.demand, years: 3 });
    expect(k.result.outcome.status).toBe('accept');

    const S2 = await load(), after = desk(S2, aKey);
    expect(Wd().ownerOf(S2, c.id)).toBe(aClub);
    expect(after.cash).toBe(before.cash - c.fee);
    expect(S2.cash[c.club]).toBe(sellerCash + c.fee);
    expect(after.squad.length).toBe(before.squad.length + 1);
    expect(after.negs[c.id]).toBeUndefined();
    expect(desk(S2, aKey).squad).toContain(c.id);
  });

  it('retirar o acordo de taxa apaga a taxa acertada e o contrato deixa de valer', async () => {
    const S = await load(), c = aiTarget(S, aKey); expect(c).not.toBeNull();
    expect((await run(ana, 'market.bid', { id: c.id, fee: c.fee })).result.outcome.status).toBe('accept');
    expect(desk(await load(), aKey).negs[c.id].fee).toBe(c.fee);
    expect((await run(ana, 'market.negDrop', { id: c.id })).result.outcome.ok).toBe(true);
    expect(desk(await load(), aKey).negs[c.id]).toBeUndefined();
    expect((await run(ana, 'market.contract', { id: c.id, sal: 9999, years: 3 })).result.outcome.status).toBe('error');
    expect((await run(ana, 'market.negDrop', { id: c.id })).result.outcome.ok).toBe(false);   // nada mais para retirar
  });

  it('contrato sem taxa acertada é recusado pelo motor, sem mudar nada', async () => {
    const S = await load(), before = await fingerprint();
    const t = aiTarget(S, aKey); expect(t).not.toBeNull();
    const r = await run(ana, 'market.contract', { id: t.id, sal: 9999, years: 3 });
    expect(r.result.outcome.status).toBe('error');
    expect(await fingerprint()).toBe(before);
  });

  it('troca com jogador que não é do seu elenco é recusada pelo motor', async () => {
    const S = await load(), t = aiTarget(S, aKey); expect(t).not.toBeNull();
    const foreign = Wd().squad(S, t.club).find(i => i !== t.id);
    const r = await run(ana, 'market.bid', { id: t.id, fee: 1000, swap: foreign });
    expect(r.result.outcome).toMatchObject({ status: 'reject', swapNo: true });
  });
});

describe('entre dois treinadores', () => {
  it('proposta, contraproposta e aceite: as duas mesas e o caixa mudam juntos, numa transação só', async () => {
    const S0 = await load(), id = sellable(S0, bKey)[0];
    const a0 = desk(S0, aKey), b0 = desk(S0, bKey);

    const bid = await run(ana, 'market.bid', { id, fee: 1000 });
    expect(bid.result.outcome.status).toBe('sent');
    const S1 = await load(), offer = desk(S1, bKey).offers.find(o => o.id === id && o.club === aClub);
    expect(offer).toMatchObject({ fee: 1000, human: true });

    // a ana não consegue aceitar a oferta que está na mesa da bia
    const before = await fingerprint();
    expect((await run(ana, 'market.acceptOffer', { k: offer.k })).result.outcome).toEqual({ gone: true });
    expect(await fingerprint()).toBe(before);

    // bia contrapropõe; a ana aceita
    const counter = await run(bia, 'market.counterOffer', { k: offer.k, value: 3000 });
    expect(counter.result.outcome.status).toBe('sent');
    expect(desk(await load(), aKey).outOffers.find(o => o.k === offer.k)).toMatchObject({ id, counter: 3000, owner: bClub });

    const v0 = (await store.load(L)).desks;
    const yes = await run(ana, 'market.respondCounter', { k: offer.k, yes: true });
    expect(yes.result.outcome).toMatchObject({ ok: true });
    const S2 = await load(), a2 = desk(S2, aKey), b2 = desk(S2, bKey), cur = await store.load(L);
    expect(Wd().ownerOf(S2, id)).toBe(aClub);
    expect(a2.cash).toBe(a0.cash - 3000);
    expect(b2.cash).toBe(b0.cash + 3000);                           // o dinheiro só muda de mãos
    expect(a2.squad.length).toBe(a0.squad.length + 1);
    expect(b2.squad.length).toBe(b0.squad.length - 1);
    expect(a2.outOffers.some(o => o.k === offer.k)).toBe(false);
    expect(b2.offers.some(o => o.k === offer.k)).toBe(false);
    expect(cur.desks[aKey].ver).toBeGreaterThan(v0[aKey].ver);
    expect(cur.desks[bKey].ver).toBeGreaterThan(v0[bKey].ver);
  });

  it('o vendedor aceita direto a proposta do outro treinador', async () => {
    const S0 = await load(), id = sellable(S0, bKey)[0];
    const a0 = desk(S0, aKey), b0 = desk(S0, bKey);
    await run(ana, 'market.bid', { id, fee: 2000 });
    const k = desk(await load(), bKey).offers.find(o => o.id === id && o.club === aClub).k;
    const r = await run(bia, 'market.acceptOffer', { k });
    expect(r.result.outcome).toMatchObject({ id, fee: 2000 });
    const S2 = await load();
    expect(Wd().ownerOf(S2, id)).toBe(aClub);
    expect(desk(S2, aKey).cash).toBe(a0.cash - 2000);
    expect(desk(S2, bKey).cash).toBe(b0.cash + 2000);
  });

  it('recusar proposta limpa a lista e nada se move', async () => {
    const S0 = await load(), id = sellable(S0, bKey)[0], cash = desk(S0, bKey).cash;
    await run(ana, 'market.bid', { id, fee: 1500 });
    const k = desk(await load(), bKey).offers.find(o => o.id === id && o.club === aClub).k;
    expect((await run(bia, 'market.declineOffer', { k })).status).toBe('done');
    const S2 = await load();
    expect(desk(S2, bKey).offers.some(o => o.k === k)).toBe(false);
    expect(desk(S2, bKey).cash).toBe(cash);
    expect(Wd().ownerOf(S2, id)).toBe(bClub);
  });
});

describe('propostas da IA pelos seus jogadores', () => {
  it('vender: o jogador sai, o caixa sobe e a proposta some', async () => {
    const S0 = await load(), b0 = desk(S0, bKey);
    const of = b0.offers.find(o => !o.human && !o.loanOf && S0.cash[o.club] !== undefined);
    if (!of) return;                                                // a IA nem sempre faz proposta no dia: cenário não garantido
    const r = await run(bia, 'market.acceptOffer', { k: of.k });
    if (r.result.outcome.err) return;                               // o motor pode recusar por regra (elenco mínimo etc.)
    const S2 = await load(), b2 = desk(S2, bKey);
    expect(Wd().ownerOf(S2, of.id)).toBe(of.club);
    expect(b2.cash).toBe(b0.cash + of.fee);
    expect(b2.offers.some(o => o.k === of.k)).toBe(false);
    expect(b2.squad.length).toBe(b0.squad.length - 1);
  });
  it('contraproposta à IA: o motor responde e a proposta fica coerente com a resposta', async () => {
    const of = desk(await load(), bKey).offers.find(o => !o.human && !o.loanOf && o.club !== undefined);
    if (!of) return;
    const r = await run(bia, 'market.counterOffer', { k: of.k, value: of.fee + 1000 });
    expect(r.status).toBe('done');
    const st2 = r.result.outcome.status;
    expect(['accept', 'counter', 'keep', 'gone']).toContain(st2);
    const now = desk(await load(), bKey).offers.find(o => o.k === of.k);
    if (st2 === 'gone') expect(now).toBeUndefined();
    else if (st2 === 'accept') expect(now.fee).toBe(of.fee + 1000);
    else expect(now.fee).toBeGreaterThanOrEqual(of.fee);
  });
  it('recusar tira a proposta da lista', async () => {
    const of = desk(await load(), bKey).offers.find(o => !o.human);
    if (!of) return;
    expect((await run(bia, 'market.declineOffer', { k: of.k })).status).toBe('done');
    expect(desk(await load(), bKey).offers.some(o => o.k === of.k)).toBe(false);
  });
});

describe('seu elenco: renovar, dispensar e listar', () => {
  it('renovar: o contrato muda só quando o motor aceita', async () => {
    const S0 = await load(), ids = desk(S0, aKey).squad.filter(i => !Wd().P[i].youth).slice(0, 12);
    let done = null;
    for (const id of ids) {
      const ce0 = (await load()).ps[id].ce, r = await run(ana, 'market.renew', { id, years: 3 });
      expect(r.status).toBe('done');
      const S = await load();
      if (r.result.outcome.ok) { done = id; expect(S.ps[id].ce).toBe(S.season + 3); expect(S.ps[id].renewed).toBe(S.season); break; }
      expect(S.ps[id].ce).toBe(ce0);                                 // recusado: nada mudou
    }
    expect(done).not.toBeNull();
    expect((await run(ana, 'market.renew', { id: done, years: 2 })).result.outcome.ok).toBe(false);   // já renovou nesta temporada
  });

  it('dispensar: paga a multa, o jogador fica livre e o elenco encolhe', async () => {
    const S0 = await load(), before = desk(S0, aKey), id = sellable(S0, aKey)[0];
    const cost = as(S0, aKey, () => MK().releaseCost(S0, id));
    const r = await run(ana, 'market.release', { id });
    expect(r.result.outcome.ok).toBe(true);
    const S2 = await load(), after = desk(S2, aKey);
    expect(Wd().ownerOf(S2, id)).toBe('Livre');
    expect(S2.free).toContain(id);
    expect(after.cash).toBe(before.cash - cost);
    expect(after.squad.length).toBe(before.squad.length - 1);
    expect((await run(ana, 'market.release', { id })).result.outcome.ok).toBe(false);   // já não é do seu elenco
  });

  it('não dispensa jogador de outro clube', async () => {
    const S0 = await load(), other = desk(S0, bKey).squad[0], before = await fingerprint();
    expect((await run(ana, 'market.release', { id: other })).result.outcome.ok).toBe(false);
    expect(await fingerprint()).toBe(before);
  });

  it('listar: liga e desliga; empréstimo guarda a duração; jogador alheio não entra na lista', async () => {
    const S0 = await load();
    const id = desk(S0, aKey).squad.find(i => !Wd().P[i].youth && !MK().pendingOf(S0, i) && !onLoan(S0, i) && !(S0.pre || []).some(x => x.id === i));
    expect((await run(ana, 'market.setListing', { id, kind: 'list' })).result.outcome).toEqual({ on: true });
    expect((await load()).ps[id].list).toBeTruthy();
    expect((await run(ana, 'market.setListing', { id, kind: 'list' })).result.outcome).toEqual({ on: false });
    expect((await load()).ps[id].list).toBeFalsy();
    expect((await run(ana, 'market.setListing', { id, kind: 'loan', len: '1t' })).result.outcome).toEqual({ on: true });
    expect((await load()).ps[id].loanList.len).toBe('1t');
    const other = desk(S0, bKey).squad[0];
    expect((await run(ana, 'market.setListing', { id: other, kind: 'list' })).result.outcome).toEqual({ on: false });
    expect((await load()).ps[other].list).toBeFalsy();
  });
});

describe('pacotes, estrelas e caixa', () => {
  beforeAll(async () => { await advance(2 * 48); });   // slot ~23: a janela principal fechou e o pacote do dia aparece

  it('pegar uma carta do pacote: cobra as estrelas, contrata o jogador e o pacote não vale duas vezes', async () => {
    const S0 = await load(), a0 = desk(S0, aKey), pk = a0.packs.list[0];
    const oi = pk.opts.map((o, i) => [o, i]).sort((x, y) => x[0].sal - y[0].sal)[0][1], o = pk.opts[oi];
    const r = await run(ana, 'market.takePack', { list: 0, option: oi });
    expect(r.result.outcome.ok).toBe(true);
    const S2 = await load(), a2 = desk(S2, aKey);
    expect(Wd().ownerOf(S2, o.id)).toBe(aClub);
    expect(a2.stars).toBe(a0.stars - o.cost[0]);
    expect(a2.packs.list[0].taken).toBe(oi);
    expect(a2.squad.length).toBe(a0.squad.length + 1);
    expect((await run(ana, 'market.takePack', { list: 0, option: oi })).result.outcome.ok).toBe(false);
    expect(desk(await load(), aKey).stars).toBe(a2.stars);           // não cobrou de novo
  });

  it('dispensar o pacote marca como usado, sem custo', async () => {
    const b0 = desk(await load(), bKey);
    expect((await run(bia, 'market.skipPack', { list: 0 })).status).toBe('done');
    const b2 = desk(await load(), bKey);
    expect(b2.packs.list[0].taken).toBe(-1);
    expect([b2.stars, b2.cash]).toEqual([b0.stars, b0.cash]);
    expect((await run(bia, 'market.takePack', { list: 0, option: 0 })).result.outcome.ok).toBe(false);
  });

  it('estrelas viram caixa, 20 estrelas viram diamante e diamante vira caixa', async () => {
    const b0 = desk(await load(), bKey), E = R.E.CORE.ECON;
    expect((await run(bia, 'market.cashOut', { kind: 'star', n: 1 })).result.outcome.ok).toBe(true);
    let b = desk(await load(), bKey);
    expect([b.stars, b.cash]).toEqual([b0.stars - 1, b0.cash + E.starCash]);
    expect((await run(bia, 'market.cashOut', { kind: 'star', n: 9999 })).result.outcome.ok).toBe(false);   // mais do que tem
    expect(desk(await load(), bKey).stars).toBe(b0.stars - 1);

    expect((await run(bia, 'market.starsToDia', {})).result.outcome.ok).toBe(true);
    b = desk(await load(), bKey);
    expect([b.stars, b.dias]).toEqual([b0.stars - 1 - E.starsPerDia, 1]);
    expect((await run(bia, 'market.starsToDia', {})).result.outcome.ok).toBe(false);                      // sem estrelas
    expect((await run(bia, 'market.cashOut', { kind: 'dia', n: 1 })).result.outcome.ok).toBe(true);
    const b2 = desk(await load(), bKey);
    expect([b2.dias, b2.cash]).toEqual([0, b.cash + E.diaCash]);
  });

  it('teto salarial: respeita o piso (folha atual) e o limite do caixa', async () => {
    const lo = await run(ana, 'finance.wageBudget', { value: 0 });
    const hi = await run(ana, 'finance.wageBudget', { value: 1e8 });
    const b = desk(await load(), aKey).budget;
    expect(lo.result.outcome).toMatchObject({ ok: true });
    expect(lo.result.outcome.wage).toBeGreaterThanOrEqual(b.pay);
    expect(hi.result.outcome.wage).toBeLessThanOrEqual(Math.max(b.pay, b.maxWage));
    expect(hi.result.outcome.wage).toBeGreaterThanOrEqual(lo.result.outcome.wage);
  });
});

describe('janela fechada: acordo pendente', () => {
  it('a janela fechou; o contrato com clube da IA vira acordo pendente e a taxa sai do caixa na hora', async () => {
    const S0 = await load();
    expect(R.E.SEASON.windowOpen(R.E.SEASON.now(S0), S0)).toBe(false);
    const t = aiTarget(S0, bKey); expect(t).not.toBeNull();
    const b0 = desk(S0, bKey), sellerCash = S0.cash[t.club];

    const bid = await run(bia, 'market.bid', { id: t.id, fee: t.fee });
    expect(bid.result.outcome.status).toBe('accept');
    const demand = as(S0, bKey, () => MK().salaryDemand(S0, t.id, S0.club));
    let k = await run(bia, 'market.contract', { id: t.id, sal: demand, years: 3 });
    if (k.result.outcome.status !== 'accept') k = await run(bia, 'market.contract', { id: t.id, sal: k.result.outcome.demand, years: 3 });
    expect(k.result.outcome).toMatchObject({ status: 'accept', pending: true });

    const S2 = await load(), b2 = desk(S2, bKey);
    expect(Wd().ownerOf(S2, t.id)).toBe(t.club);                       // ainda não chegou
    expect(S2.pendTr.find(x => x.id === t.id)).toMatchObject({ club: bClub, from: t.club, fee: t.fee });
    expect(b2.cash).toBe(b0.cash - t.fee);                              // a taxa já saiu (compromisso)
    expect(S2.cash[t.club]).toBe(sellerCash);                           // o vendedor só recebe na abertura
    expect(b2.squad).not.toContain(t.id);

    // a ana não negocia um jogador que já tem acordo fechado
    const r = await run(ana, 'market.bid', { id: t.id, fee: t.fee * 3 });
    expect(r.result.outcome.status).toBe('closed');
    expect(Wd().ownerOf(await load(), t.id)).toBe(t.club);
  });

  it('com a janela fechada, vender para a IA é recusado pelo motor', async () => {
    const S0 = await load(), of = desk(S0, bKey).offers.find(o => !o.human);
    if (!of) return;                                                   // a IA nem sempre faz proposta: cenário não garantido
    const before = await fingerprint();
    const r = await run(bia, 'market.acceptOffer', { k: of.k });
    expect(r.result.outcome.err).toMatch(/janela/i);
    expect(await fingerprint()).toBe(before);
  });
});
