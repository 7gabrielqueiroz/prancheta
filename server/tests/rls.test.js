// Políticas de acesso: o que cada papel consegue ler e escrever, testado num Postgres de verdade (PGlite).
import { describe, it, expect, beforeAll } from 'vitest';
import { randomUUID } from 'node:crypto';
import { newDb, newUser, asUser } from './helpers.js';

const DENIED = /permission denied|row-level security/i;
let db, ana, bia, caio, dudu, L1, L2;

// L1: ana (ADM) e bia. L2: caio. dudu não está em liga nenhuma.
beforeAll(async () => {
  db = await newDb();
  [ana, bia, caio, dudu] = await Promise.all(['ana', 'bia', 'caio', 'dudu'].map(n => newUser(db, n + '@x.test')));
  const mk = (code, admin, desks) => db.query(
    `select public.create_league($1::uuid, $2, $3, 'normal', $4::uuid, '{}'::jsonb, $5, $6::jsonb, $7::jsonb, now(), 'test') as id`,
    [randomUUID(), code, 'Liga ' + code, admin, JSON.stringify({ season: 2026, seed: 1 }), JSON.stringify({ msalt: 'segredo-' + code }),
      JSON.stringify(desks.map(([key, user_id, club]) => ({ key, user_id, club, data: JSON.stringify({ club, tactics: 'de ' + key }) })))]);
  L1 = (await mk('AAAAAA', ana, [['d_ana', ana, 'Flamengo'], ['d_bia', bia, 'Palmeiras']])).rows[0].id;
  L2 = (await mk('BBBBBB', caio, [['d_caio', caio, 'Santos']])).rows[0].id;
});

describe('leitura', () => {
  it('anon não lê nada', async () => {
    for (const t of ['leagues', 'league_worlds', 'league_desks', 'league_members', 'commands', 'chat_messages', 'profiles', 'league_secrets'])
      await expect(asUser(db, null, tx => tx.query(`select 1 from public.${t}`), 'anon')).rejects.toThrow(DENIED);
  });

  it('membro lê a própria liga; quem está fora não vê a liga, o mundo nem os membros', async () => {
    const q = uid => asUser(db, uid, async tx => ({
      leagues: (await tx.query(`select code from public.leagues order by code`)).rows.map(r => r.code),
      worlds: (await tx.query(`select league_id from public.league_worlds`)).rows.length,
      members: (await tx.query(`select desk_key from public.league_members order by desk_key`)).rows.map(r => r.desk_key),
    }));
    expect(await q(ana)).toEqual({ leagues: ['AAAAAA'], worlds: 1, members: ['d_ana', 'd_bia'] });
    expect(await q(caio)).toEqual({ leagues: ['BBBBBB'], worlds: 1, members: ['d_caio'] });
    expect(await q(dudu)).toEqual({ leagues: [], worlds: 0, members: [] });
  });

  it('cada treinador lê só a própria mesa, nem a do colega de liga', async () => {
    const mine = uid => asUser(db, uid, async tx => (await tx.query(`select desk_key from public.league_desks`)).rows.map(r => r.desk_key));
    expect(await mine(ana)).toEqual(['d_ana']);
    expect(await mine(bia)).toEqual(['d_bia']);
    expect(await mine(dudu)).toEqual([]);
  });

  it('segredos da liga e colunas de operação são inacessíveis', async () => {
    await expect(asUser(db, ana, tx => tx.query(`select data from public.league_secrets`))).rejects.toThrow(DENIED);
    await expect(asUser(db, ana, tx => tx.query(`select lease_holder from public.leagues`))).rejects.toThrow(DENIED);
    await expect(asUser(db, ana, tx => tx.query(`select * from public.leagues`))).rejects.toThrow(DENIED);
    await expect(asUser(db, ana, tx => tx.query(`select 1 from public.tick_log`))).rejects.toThrow(DENIED);
  });

  it('membro removido perde o acesso', async () => {
    const eva = await newUser(db, 'eva@x.test');
    await db.query(`insert into public.league_members (league_id, user_id, role) values ($1, $2, 'spectator')`, [L1, eva]);
    const n = () => asUser(db, eva, async tx => (await tx.query(`select 1 from public.league_worlds`)).rows.length);
    expect(await n()).toBe(1);
    await db.query(`update public.league_members set removed_at = now() where league_id = $1 and user_id = $2`, [L1, eva]);
    expect(await n()).toBe(0);
  });
});

describe('escrita direta no estado de jogo é impossível para o cliente', () => {
  const tries = [
    [`update public.league_worlds set data = '{}'`],
    [`update public.league_desks set data = '{}'`],
    [`delete from public.league_desks`],
    [`update public.leagues set admin_user_id = auth.uid()`],
    [`update public.leagues set world_ver = 999`],
    [`insert into public.league_members (league_id, user_id) select id, auth.uid() from public.leagues`],
    [`update public.league_members set role = 'coach', club = 'Flamengo'`],
    [`delete from public.league_members`],
    [`insert into public.league_invites (league_id, code, created_by) select id, 'ABCDEFGH', auth.uid() from public.leagues`],
    [`update public.commands set status = 'done'`],
    [`delete from public.commands`],
    [`update public.chat_messages set body = 'x'`],
  ];
  for (const [sql] of tries) it(sql, async () => {
    await expect(asUser(db, ana, tx => tx.query(sql))).rejects.toThrow(DENIED);
  });

  it('funções do servidor não são executáveis pelo cliente', async () => {
    for (const call of [
      `public.commit_league('${L1}'::uuid, null, 1, '{}', '[]'::jsonb, null)`,
      `public.create_league(gen_random_uuid(), 'CCCCCC', 'x', 'normal', auth.uid(), '{}'::jsonb, '{}', '{}'::jsonb, '[]'::jsonb, null, null)`,
      `public.acquire_league_lease('${L1}'::uuid, 'eu', 60)`,
      `public.release_league_lease('${L1}'::uuid, 'eu')`,
      `public.finish_command(gen_random_uuid(), 'done', '{}'::jsonb, null)`,
      `public.leagues_with_work(10)`,
    ]) await expect(asUser(db, ana, tx => tx.query(`select ${call}`))).rejects.toThrow(DENIED);
  });
});

describe('comandos', () => {
  const send = (uid, league, type, extra = '') => asUser(db, uid, tx =>
    tx.query(`insert into public.commands (league_id, type, payload${extra ? ', ' + extra.split('=')[0] : ''}) values ($1, $2, '{}'::jsonb${extra ? ', ' + extra.split('=')[1] : ''}) returning user_id, status`, [league, type]));

  it('membro envia comando para a própria liga; entra como pendente e com o próprio usuário', async () => {
    const r = await send(ana, L1, 'tactics.set');
    expect(r.rows[0]).toEqual({ user_id: ana, status: 'pending' });
  });
  it('não envia para liga de que não participa', async () => {
    await expect(send(ana, L2, 'tactics.set')).rejects.toThrow(DENIED);
    await expect(send(dudu, L1, 'tactics.set')).rejects.toThrow(DENIED);
  });
  it('sem liga, só criar liga ou entrar por código', async () => {
    expect((await send(dudu, null, 'league.join')).rows[0].status).toBe('pending');
    expect((await send(dudu, null, 'league.create')).rows[0].status).toBe('pending');
    await expect(send(dudu, null, 'tactics.set')).rejects.toThrow(/check constraint|row-level security/i);
  });
  it('não escolhe status, resultado nem o usuário do comando', async () => {
    await expect(send(ana, L1, 'tactics.set', `status='done'`)).rejects.toThrow(DENIED);
    await expect(send(ana, L1, 'tactics.set', `result='{"ok":true}'::jsonb`)).rejects.toThrow(DENIED);
    await expect(send(ana, L1, 'tactics.set', `user_id='${bia}'::uuid`)).rejects.toThrow(DENIED);
  });
  it('cada um lê só os próprios comandos', async () => {
    const n = uid => asUser(db, uid, async tx => (await tx.query(`select distinct user_id from public.commands`)).rows.map(r => r.user_id));
    expect(await n(ana)).toEqual([ana]);
    expect(await n(bia)).toEqual([]);
  });
  it('limite de comandos pendentes por usuário', async () => {
    const u = await newUser(db, 'flood@x.test');
    for (let i = 0; i < 30; i++) await send(u, null, 'league.join');
    await expect(send(u, null, 'league.join')).rejects.toThrow(/muitos comandos pendentes/);
  });
  it('finish_command só conclui uma vez (idempotência)', async () => {
    const id = (await asUser(db, bia, tx => tx.query(`insert into public.commands (league_id, type) values ($1, 'tactics.set') returning id`, [L1]))).rows[0].id;
    const fin = () => db.query(`select public.finish_command($1::uuid, 'done', '{"ok":true}'::jsonb, null) as r`, [id]);
    expect((await fin()).rows[0].r).toBe(true);
    expect((await fin()).rows[0].r).toBe(false);
  });
});

describe('chat e perfil', () => {
  it('membro escreve e lê o chat da própria liga; quem está fora não', async () => {
    await asUser(db, ana, tx => tx.query(`insert into public.chat_messages (league_id, body) values ($1, 'bom jogo')`, [L1]));
    const read = uid => asUser(db, uid, async tx => (await tx.query(`select body from public.chat_messages`)).rows.length);
    expect(await read(bia)).toBe(1);
    expect(await read(caio)).toBe(0);
    await expect(asUser(db, caio, tx => tx.query(`insert into public.chat_messages (league_id, body) values ($1, 'oi')`, [L1]))).rejects.toThrow(DENIED);
    await expect(asUser(db, ana, tx => tx.query(`insert into public.chat_messages (league_id, body, user_id) values ($1, 'oi', $2)`, [L1, bia]))).rejects.toThrow(DENIED);
  });
  it('perfil: edito só o meu; vejo o de quem divide liga comigo', async () => {
    for (const [u, n] of [[ana, 'Ana'], [bia, 'Bia'], [caio, 'Caio']])
      await asUser(db, u, tx => tx.query(`insert into public.profiles (user_id, display_name) values ($1, $2)`, [u, n]));
    await expect(asUser(db, dudu, tx => tx.query(`insert into public.profiles (user_id, display_name) values ($1, 'Falso')`, [ana]))).rejects.toThrow(/row-level security|duplicate key/i);
    const see = uid => asUser(db, uid, async tx => (await tx.query(`select display_name from public.profiles order by 1`)).rows.map(r => r.display_name));
    expect(await see(ana)).toEqual(['Ana', 'Bia']);
    expect(await see(caio)).toEqual(['Caio']);
    const upd = await asUser(db, ana, tx => tx.query(`update public.profiles set display_name = 'Hackeado'`));
    expect(upd.affectedRows).toBe(1);   // só a própria linha
  });
});

describe('servidor: commit, versões e lease', () => {
  const commit = (expect_, world, desks = [], holder = null) =>
    db.query(`select public.commit_league($1::uuid, $2, $3, $4, $5::jsonb, null) as r`, [L2, holder, expect_, world, JSON.stringify(desks)]).then(r => r.rows[0].r);

  it('grava com a versão certa e rejeita base velha, sem gravar nada', async () => {
    const a = await commit(1, '{"v":2}', [{ key: 'd_caio', expect: 1, data: '{"club":"Santos","n":2}', club: 'Santos' }]);
    expect(a).toMatchObject({ ok: true, ver: 2, desks: { d_caio: 2 } });
    expect(await commit(1, '{"v":"velho"}')).toMatchObject({ ok: false, why: 'world', ver: 2 });
    // mundo certo, mesa velha: nada é gravado (nem o mundo)
    expect(await commit(2, '{"v":3}', [{ key: 'd_caio', expect: 1, data: '{}', club: null }])).toMatchObject({ ok: false, why: 'desk', key: 'd_caio' });
    const w = (await db.query(`select ver, data from public.league_worlds where league_id = $1`, [L2])).rows[0];
    expect([Number(w.ver), w.data]).toEqual([2, '{"v":2}']);
    expect(Number((await db.query(`select world_ver from public.leagues where id = $1`, [L2])).rows[0].world_ver)).toBe(2);
  });

  it('texto do mundo é devolvido byte a byte (ordem das chaves preservada)', async () => {
    const s = '{"z":1,"a":{"y":2,"b":[3,1,2]},"10":"x","2":"y"}';
    await commit(2, s);
    expect((await db.query(`select data from public.league_worlds where league_id = $1`, [L2])).rows[0].data).toBe(s);
  });

  it('lease: um por vez; commit com lease perdido é rejeitado', async () => {
    const acq = h => db.query(`select public.acquire_league_lease($1::uuid, $2, 60) as r`, [L2, h]).then(r => r.rows[0].r);
    expect(await acq('w1')).toBe(true);
    expect(await acq('w2')).toBe(false);
    expect(await acq('w1')).toBe(true);    // o próprio dono renova
    expect(await commit(3, '{"v":4}', [], 'w2')).toMatchObject({ ok: false, why: 'lease' });
    expect(await commit(3, '{"v":4}', [], 'w1')).toMatchObject({ ok: true, ver: 4 });
    // com erro, a liga sai da fila
    await db.query(`update public.leagues set next_tick_at = now() - interval '1 minute' where id = $1`, [L2]);
    await db.query(`select public.release_league_lease($1::uuid, 'w1', 'falhou')`, [L2]);
    const due = async () => (await db.query(`select public.leagues_with_work(10) as id`)).rows.map(r => r.id);
    expect(await due()).not.toContain(L2);
    await db.query(`update public.leagues set deferred_until = null where id = $1`, [L2]);
    expect(await due()).toContain(L2);
  });

  it('liga com comando pendente entra na fila mesmo sem tick vencido', async () => {
    await db.query(`update public.leagues set next_tick_at = now() + interval '1 day' where id = $1`, [L1]);
    await db.query(`update public.commands set status = 'done' where league_id = $1`, [L1]);
    const due = async () => (await db.query(`select public.leagues_with_work(10) as id`)).rows.map(r => r.id);
    expect(await due()).not.toContain(L1);
    await asUser(db, ana, tx => tx.query(`insert into public.commands (league_id, type) values ($1, 'tactics.set')`, [L1]));
    expect(await due()).toContain(L1);
  });
});
