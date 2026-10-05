// Tick do servidor sobre os dois Stores, com o motor de verdade.
// Oráculo: o tick de servidor do jogo original (NETCORE.tickOne). O que fica GRAVADO tem de ser igual byte a byte.
//
// Por que não comparar com o golden do motor puro (app/tests/golden)? Porque o servidor faz mais do que
// SEASON.process: marca desks.*.seen (inatividade) e atualiza health.at. O original também só faz isso no servidor.
import { describe, it, expect, vi } from 'vitest';
import { T0, installFakes, freshRuntime, storedDigest, newDb, newUser, asUser } from './helpers.js';

const st = installFakes();
const TICKS_PER_DAY = 48;

// Avança `days` dias (ticks de 30 min) e devolve a impressão digital do que está gravado ao fim de cada dia.
async function days(n, tick, stored) {
  const out = [];
  for (let i = 1; i <= n * TICKS_PER_DAY; i++) {
    st.clock = T0 + i * 30 * 60000;
    const r = await tick();
    expect(r.ok).toBe(true);
    if (i % TICKS_PER_DAY === 0) out.push(storedDigest(await stored()));
  }
  return out;
}

let oracle3;   // 3 dias pelo servidor original, calculado uma vez

describe('paridade com o tick de servidor original', () => {
  it('servidor original: 3 dias (referência) e é reprodutível', async () => {
    const once = async (code, n) => { st.reset(); const R = await freshRuntime(vi); const o = R.originalServer(code, R.world()); return days(n, o.tick, async () => o.stored()); };
    oracle3 = await once('ORIG01', 3);
    expect(new Set(oracle3).size).toBe(3);                    // o estado muda a cada dia
    expect(await once('ORIG02', 1)).toEqual(oracle3.slice(0, 1));   // segunda execução no mesmo processo dá o mesmo
  });

  it('MemoryStore: 3 dias gravam exatamente o mesmo que o original', async () => {
    st.reset(); const R = await freshRuntime(vi);
    const store = new R.MemoryStore(); await store.create('MEM001', R.world());
    expect(await days(3, () => R.tickLeague(store, 'MEM001'), () => store.load('MEM001'))).toEqual(oracle3);
  });

  it('PgStore (Postgres): 2 dias gravam exatamente o mesmo que o original', async () => {
    st.reset(); const R = await freshRuntime(vi);
    const db = await newDb();
    const users = await Promise.all([0, 1, 2].map(i => newUser(db, `tec${i}@x.test`)));
    const store = new R.PgStore(db);
    const S = R.world();
    await store.create('PGS001', S, { adminUserId: users[0], deskUsers: { tok0: users[0], tok1: users[1], tok2: users[2] }, name: 'Liga de teste' });
    expect(await days(2, () => R.tickLeague(store, 'PGS001'), () => store.load('PGS001'))).toEqual(oracle3.slice(0, 2));

    // espelhos mantidos pelo commit
    const L = (await db.query(`select id, world_ver, next_tick_at from public.leagues where code = 'PGS001'`)).rows[0];
    const W = (await db.query(`select ver from public.league_worlds where league_id = $1`, [L.id])).rows[0];
    expect(Number(L.world_ver)).toBe(Number(W.ver));
    expect(Number(W.ver)).toBeGreaterThan(1);
    expect(L.next_tick_at).not.toBeNull();
    const clubs = (await db.query(`select club from public.league_members where league_id = $1 order by desk_key`, [L.id])).rows;
    expect(clubs.map(c => c.club)).toEqual(S.divA.slice(0, 3));

    // o treinador 1 lê o mundo e só a própria mesa
    const seen = await asUser(db, users[1], async tx => ({
      world: JSON.parse((await tx.query(`select data from public.league_worlds`)).rows[0].data),
      desks: (await tx.query(`select desk_key from public.league_desks`)).rows.map(r => r.desk_key),
    }));
    expect(seen.desks).toEqual(['tok1']);
    expect(seen.world.desks).toBeUndefined();
    expect(seen.world.season).toBe(2026);
  });
});

describe('segredo de partida (msalt)', () => {
  it('muda os resultados, é reprodutível e nunca aparece no que o cliente pode ler', async () => {
    const day1 = async (code, msalt) => {
      st.reset(); const R = await freshRuntime(vi);
      const db = await newDb(); const u = await newUser(db, 'a@x.test');
      const store = new R.PgStore(db);
      await store.create(code, R.world({ coaches: 1, msalt }), { adminUserId: u, deskUsers: { tok0: u } });
      const [digest] = await days(1, () => R.tickLeague(store, code), () => store.load(code));
      const raw = (await db.query(`select w.data as world, s.data as secrets, (select string_agg(data, '') from public.league_desks) as desks
                                     from public.league_worlds w join public.league_secrets s using (league_id)`)).rows[0];
      return { digest, slot: JSON.parse(raw.world).slot, raw };
    };
    const none = await day1('SALT00', undefined);
    const a1 = await day1('SALT01', 'sal-a'), a2 = await day1('SALT02', 'sal-a'), b = await day1('SALT03', 'sal-b');
    expect(a1.slot).toBe(none.slot);                  // mesmo calendário
    expect(a1.digest).toBe(a2.digest);                // mesmo segredo => mesmo resultado
    expect(a1.digest).not.toBe(b.digest);             // segredo diferente => outro resultado
    expect(a1.digest).not.toBe(none.digest);
    expect(a1.raw.secrets).toEqual({ msalt: 'sal-a' });
    expect(none.raw.secrets).toEqual({});
    for (const text of [a1.raw.world, a1.raw.desks]) { expect(text).not.toContain('sal-a'); expect(text).not.toContain('msalt'); }
  });
});

describe('concorrência', () => {
  it('MemoryStore rejeita gravação com base velha', async () => {
    st.reset(); const R = await freshRuntime(vi); const { assembleState, ConflictError } = R;
    const store = new R.MemoryStore(); await store.create('MEM002', R.world({ seed: 7, coaches: 1 }));
    const a = await store.load('MEM002'), b = await store.load('MEM002');
    const A = assembleState(a); A.marca = 'a';
    expect((await store.commit('MEM002', a, A)).ok).toBe(true);
    const B = assembleState(b); B.marca = 'b';
    await expect(store.commit('MEM002', b, B)).rejects.toBeInstanceOf(ConflictError);
  });

  it('PgStore: dois workers na mesma base; o segundo commit é rejeitado e nada é gravado', async () => {
    st.reset(); const R = await freshRuntime(vi); const { assembleState } = R;
    const db = await newDb(); const u = await newUser(db, 'a@x.test');
    const store = new R.PgStore(db);
    await store.create('RACE01', R.world({ seed: 9, coaches: 1 }), { adminUserId: u, deskUsers: { tok0: u } });
    const a = await store.load('RACE01'), b = await store.load('RACE01');
    const A = assembleState(a); A.marca = 'a'; A.desks.tok0.stars = 99;
    expect(await store.commit('RACE01', a, A)).toMatchObject({ ok: true, changed: true, ver: 2 });
    const B = assembleState(b); B.marca = 'b';
    await expect(store.commit('RACE01', b, B)).rejects.toMatchObject({ code: 'conflict', why: 'world' });
    const now = assembleState(await store.load('RACE01'));
    expect([now.marca, now.desks.tok0.stars]).toEqual(['a', 99]);
    const c = await store.load('RACE01');   // sem mudança: não sobe versão
    expect(await store.commit('RACE01', c, assembleState(c))).toMatchObject({ ok: true, changed: false, ver: 2 });
  });
});
