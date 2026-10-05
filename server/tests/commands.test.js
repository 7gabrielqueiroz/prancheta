// Comandos de ponta a ponta: o cliente insere em `commands` como usuário autenticado (passando pelo RLS),
// o worker processa com o motor de verdade, e o cliente lê o resultado só pelo que as políticas deixam ver.
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { T0, installFakes, freshRuntime, newDb, newUser, asUser } from './helpers.js';

const st = installFakes();
let R, db, store, worker, ana, bia, caio, L, anaDesk, anaClub, biaClub;

const send = (uid, league, type, payload = {}) => asUser(db, uid, tx =>
  tx.query(`insert into public.commands (league_id, type, payload) values ($1, $2, $3::jsonb) returning id`, [league, type, JSON.stringify(payload)])).then(r => r.rows[0].id);
const cmd = id => db.query(`select status, result, error from public.commands where id = $1`, [id]).then(r => r.rows[0]);
const run = async (uid, league, type, payload) => { const id = await send(uid, league, type, payload); await worker.runOnce(); return cmd(id); };
// o que o usuário consegue ler: o mundo e a própria mesa
const view = uid => asUser(db, uid, async tx => {
  const w = (await tx.query(`select data from public.league_worlds where league_id = $1`, [L])).rows[0];
  const d = (await tx.query(`select desk_key, data from public.league_desks where league_id = $1`, [L])).rows;
  return { world: w ? JSON.parse(w.data) : null, desks: Object.fromEntries(d.map(r => [r.desk_key, JSON.parse(r.data)])) };
});
const state = async () => R.assembleState(await store.load(L));

beforeAll(async () => {
  st.reset(); R = await freshRuntime(vi);
  db = await newDb(); store = new R.PgStore(db); worker = R.createWorker({ db, store });
  [ana, bia, caio] = await Promise.all(['ana', 'bia', 'caio'].map(n => newUser(db, n + '@x.test')));
});

describe('criar liga e entrar', () => {
  it('league.create: cria o mundo, o segredo e o vínculo do criador como ADM', async () => {
    const c = await run(ana, null, 'league.create', { name: 'Liga Teste', mode: 'turbo' });
    expect(c.status).toBe('done');
    expect(c.result.code).toMatch(/^[A-Z2-9]{6}$/);
    L = c.result.leagueId;
    const v = await view(ana);
    expect(v.world.league).toMatchObject({ name: 'Liga Teste', pick: 'draw', code: c.result.code });
    expect(v.world.msalt).toBeUndefined();
    expect(Object.keys(v.desks)).toEqual([]);
    const sec = (await db.query(`select data from public.league_secrets where league_id = $1`, [L])).rows[0].data;
    expect(sec.msalt).toMatch(/^[0-9a-f]{32}$/);
    const lg = (await db.query(`select admin_user_id, mode, name from public.leagues where id = $1`, [L])).rows[0];
    expect(lg).toEqual({ admin_user_id: ana, mode: 'turbo', name: 'Liga Teste' });
  });

  it('league.create repetido depois de uma queda não cria outra liga', async () => {
    const id = (await db.query(`select id from public.commands where type = 'league.create'`)).rows[0].id;
    await db.query(`update public.commands set status = 'pending', result = null where id = $1`, [id]);
    await worker.runOnce();
    expect((await cmd(id)).result.leagueId).toBe(L);
    expect((await db.query(`select count(*)::int as n from public.leagues`)).rows[0].n).toBe(1);
  });

  it('club.claim: sorteia um clube, cria a mesa e marca o ADM no mundo', async () => {
    const c = await run(ana, L, 'club.claim', { coach: { name: 'Ana', style: 'tikitaka' } });
    expect(c.status).toBe('done');
    ({ club: anaClub, deskKey: anaDesk } = c.result);
    const v = await view(ana);
    expect(v.world.divA).toContain(anaClub);
    expect(v.desks[anaDesk]).toMatchObject({ club: anaClub, manager: 'Ana' });
    expect(v.desks[anaDesk].tactics.style).toBe('tikitaka');
    expect(v.world.league.admin).toBe(anaDesk);
    expect(v.world.coaches[anaClub]).toMatchObject({ name: 'Ana', user: true });
    const m = (await db.query(`select desk_key, club from public.league_members where league_id = $1 and user_id = $2`, [L, ana])).rows[0];
    expect(m).toEqual({ desk_key: anaDesk, club: anaClub });
  });

  it('league.join pelo código e club.claim: outro clube; cada um só vê a própria mesa', async () => {
    const code = (await db.query(`select code from public.leagues where id = $1`, [L])).rows[0].code;
    expect(await run(bia, null, 'league.join', { code: 'ZZZZZZ' })).toMatchObject({ status: 'rejected', result: { code: 'notfound' } });
    const j = await run(bia, null, 'league.join', { code: code.toLowerCase() });
    expect(j).toMatchObject({ status: 'done', result: { leagueId: L, already: false } });
    const c = await run(bia, L, 'club.claim', { coach: { name: 'Bia' } });
    expect(c.status).toBe('done');
    biaClub = c.result.club;
    expect(biaClub).not.toBe(anaClub);
    expect(Object.keys((await view(bia)).desks)).toEqual([c.result.deskKey]);
    expect(Object.keys((await view(ana)).desks)).toEqual([anaDesk]);
  });

  it('club.claim de novo devolve o mesmo clube; escolher clube em liga de sorteio é recusado', async () => {
    expect((await run(bia, L, 'club.claim', { coach: { name: 'Outra' } })).result).toMatchObject({ club: biaClub, already: true });
    await run(caio, null, 'league.join', { code: (await db.query(`select code from public.leagues where id = $1`, [L])).rows[0].code });
    const free = (await state()).divA.find(c => c !== anaClub && c !== biaClub);
    expect(await run(caio, L, 'club.claim', { coach: { name: 'Caio' }, want: free })).toMatchObject({ status: 'rejected', result: { code: 'pick' } });
    expect(await run(caio, L, 'club.claim', { coach: { name: '' } })).toMatchObject({ status: 'rejected', result: { code: 'name' } });
  });
});

describe('tactics.set', () => {
  it('altera formação e estilo; o dono lê a mudança', async () => {
    expect(await run(ana, L, 'tactics.set', { formation: '4-4-2', style: 'contra' })).toMatchObject({ status: 'done', result: { tactics: { formation: '4-4-2', style: 'contra' } } });
    expect((await view(ana)).desks[anaDesk].tactics).toMatchObject({ formation: '4-4-2', style: 'contra' });
  });

  it('escalação válida é gravada; jogador de outro clube, repetido ou formação inexistente são recusados sem mudar nada', async () => {
    const S = await state(), Wd = R.E.WORLD;
    const mine = Wd.squad(S, anaClub), theirs = Wd.squad(S, biaClub);
    const xi = mine.slice(0, 11);
    expect((await run(ana, L, 'tactics.set', { xi, bench: mine.slice(11, 16), pk: xi[9] })).status).toBe('done');
    const before = (await view(ana)).desks[anaDesk].tactics;
    expect(before).toMatchObject({ xi, bench: mine.slice(11, 16), pk: xi[9] });

    const bad = [
      [{ xi: [theirs[0], ...xi.slice(1)] }, 'xi'],
      [{ xi: [xi[1], ...xi.slice(1)] }, 'xi'],
      [{ xi: xi.slice(0, 10) }, 'xi'],
      [{ bench: [xi[0]] }, 'bench'],
      [{ pk: theirs[0] }, 'pk'],
      [{ formation: '9-0-1' }, 'formation'],
      [{ style: 'catenaccio-total' }, 'style'],
      [{ triggers: { lead2: 'nao-existe' } }, 'triggers'],
      [{}, 'empty'],
    ];
    for (const [payload, code] of bad) expect(await run(ana, L, 'tactics.set', payload), JSON.stringify(payload)).toMatchObject({ status: 'rejected', result: { code } });
    expect((await view(ana)).desks[anaDesk].tactics).toEqual(before);
  });

  it('quem não tem mesa não altera tática; comando desconhecido é recusado', async () => {
    expect(await run(caio, L, 'tactics.set', { style: 'contra' })).toMatchObject({ status: 'rejected', result: { code: 'nodesk' } });
    expect(await run(ana, L, 'coisa.inexistente', {})).toMatchObject({ status: 'rejected', result: { code: 'unknown' } });
  });
});

describe('robustez do worker', () => {
  it('comando que quebra no meio é desfeito e não derruba os seguintes', async () => {
    const w2 = R.createWorker({ db, store, handlers: { ...R.handlers,
      'test.boom'(ctx) { ctx.S.desks[ctx.member.desk_key].stars = 12345; ctx.S.marca = 'x'; throw new Error('boom'); } } });
    const a = await send(ana, L, 'test.boom'), b = await send(ana, L, 'tactics.set', { style: 'tikitaka' });
    await w2.runOnce();
    expect(await cmd(a)).toMatchObject({ status: 'error', error: 'boom' });
    expect((await cmd(b)).status).toBe('done');
    const v = await view(ana);
    expect(v.desks[anaDesk].stars).not.toBe(12345);
    expect(v.world.marca).toBeUndefined();
    expect(v.desks[anaDesk].tactics.style).toBe('tikitaka');
  });

  it('liga com lease de outro worker é pulada; o comando espera e é aplicado depois', async () => {
    await db.query(`select public.acquire_league_lease($1::uuid, 'outro', 60)`, [L]);
    const id = await send(ana, L, 'tactics.set', { style: 'direto' });
    await worker.runOnce();
    expect((await cmd(id)).status).toBe('pending');
    expect((await worker.processLeague(L)).skipped).toBe('lease');
    await db.query(`select public.release_league_lease($1::uuid, 'outro')`, [L]);
    await worker.runOnce();
    expect((await cmd(id)).status).toBe('done');
  });

  it('um comando já concluído não é aplicado de novo: o commit inteiro é recusado', async () => {
    const id = await send(ana, L, 'tactics.set', { style: 'contra' });
    const base = await store.load(L);
    await worker.runOnce();                                         // outro worker concluiu primeiro
    const S = R.assembleState(base); S.marca = 'duplicado';
    await expect(store.commit(L, base, S, { commands: [{ id, status: 'done', result: {} }] })).rejects.toMatchObject({ code: 'conflict' });
    const fresh = await store.load(L); const S2 = R.assembleState(fresh); S2.marca = 'duplicado';
    await expect(store.commit(L, fresh, S2, { commands: [{ id, status: 'done', result: {} }] })).rejects.toMatchObject({ code: 'conflict', why: 'command' });
    expect((await view(ana)).world.marca).toBeUndefined();
  });

  it('o relógio anda junto: um dia depois, as rodadas foram jogadas e a atividade do treinador ficou registrada', async () => {
    const before = (await view(ana)).world.slot || 0;
    for (let i = 1; i <= 48; i++) { st.clock = T0 + i * 30 * 60000; await worker.runOnce(); }
    const v = await view(ana);
    expect(v.world.slot).toBeGreaterThan(before);
    expect(typeof v.desks[anaDesk].seen).toBe('number');
    const log = (await db.query(`select count(*)::int as n, bool_and(ok) as ok from public.tick_log where league_id = $1`, [L])).rows[0];
    expect(log.n).toBeGreaterThan(40);
    expect((await db.query(`select count(*)::int as n from public.tick_log where league_id = $1 and not ok`, [L])).rows[0].n).toBe(0);
  });

  it('limite de ligas novas por usuário em 24 horas', async () => {
    // usuário novo, tudo no mesmo instante (o Postgres dos testes segue o relógio falso, que já andou um dia)
    const dudu = await newUser(db, 'dudu@x.test');
    for (const name of ['Primeira', 'Segunda', 'Terceira']) expect((await run(dudu, null, 'league.create', { name })).status).toBe('done');
    expect(await run(dudu, null, 'league.create', { name: 'Quarta' })).toMatchObject({ status: 'rejected', result: { code: 'limit' } });
    expect((await db.query(`select count(*)::int as n from public.leagues where admin_user_id = $1`, [dudu])).rows[0].n).toBe(3);
  });
});
