import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';

const here = p => fileURLToPath(new URL(p, import.meta.url));
export const T0 = Date.UTC(2026, 6, 1, 12, 0, 0);
export const stable = o => JSON.stringify(o, (k, v) => v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map(x => [x, v[x]])) : v);
export const sha = s => crypto.createHash('sha1').update(s).digest('hex');
export const golden = () => JSON.parse(fs.readFileSync(here('../../app/tests/golden/season-turbo.json'), 'utf8'));

// Relógio e aleatório determinísticos: mesma configuração do golden master do motor (app/tools/golden-original.mjs)
export function installFakes() {
  let rnd = 123456789;
  const st = { clock: T0, reset() { st.clock = T0; rnd = 123456789; } };
  const RealDate = globalThis.__RealDate || (globalThis.__RealDate = Date);
  globalThis.Date = class extends RealDate { constructor(...a) { a.length ? super(...a) : super(st.clock); } static now() { return st.clock; } };
  Math.random = () => ((rnd = (rnd * 1664525 + 1013904223) >>> 0) / 4294967296);
  return st;
}

// O motor guarda estado global (banco de jogadores P, caches). Para um cenário ser reprodutível ele precisa de uma
// instância nova de todos os módulos: vi.resetModules() + imports dinâmicos. NÃO importe src/ estaticamente nos testes.
export async function freshRuntime(vi) {
  vi.resetModules();
  const E = await import('../../app/src/engine/index.js');
  E.WORLD.init(JSON.parse(fs.readFileSync(here('../../app/public/data/players.json'), 'utf8')));
  const [tick, mem, pg, ls, orig, wk, hd] = await Promise.all([
    import('../src/tick.js'), import('../src/store-memory.js'), import('../src/store-pg.js'), import('../src/league-state.js'), import('./original-tick.js'), import('../src/worker.js'), import('../src/commands/handlers.js')]);
  // Mesmo mundo do golden: liga turbo, seed 424242, treinadores nos primeiros clubes da Série A.
  const world = ({ seed = 424242, coaches = 3, msalt } = {}) => {
    const { WORLD: Wd, SEASON: SE } = E;
    const S = Wd.newWorld({ now: T0, seed, mode: 'turbo' });
    SE.setupSeason(S); S.lastT = S.seasonStart;
    S.divA.slice(0, coaches).forEach((c, i) => Wd.addDesk(S, 'tok' + i, { name: 'Tec' + i }, c));
    Wd.bindDesks(S);
    if (msalt) S.msalt = msalt;
    return S;
  };
  return { E, world, tickLeague: tick.tickLeague, MemoryStore: mem.MemoryStore, PgStore: pg.PgStore,
    assembleState: ls.assembleState, ConflictError: ls.ConflictError, originalServer: orig.originalServer,
    createWorker: wk.createWorker, handlers: hd.handlers, Reject: hd.Reject };
}

// Postgres em memória com o ambiente mínimo do Supabase + todas as migrations do projeto.
export async function newDb() {
  const db = new PGlite();
  await db.exec(fs.readFileSync(here('./supabase-shim.sql'), 'utf8'));
  const dir = here('../../supabase/migrations/');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()) await db.exec(fs.readFileSync(path.join(dir, f), 'utf8'));
  return db;
}

export async function newUser(db, email) {
  return (await db.query(`insert into auth.users (email) values ($1) returning id`, [email])).rows[0].id;
}

// Executa fn como um usuário autenticado (ou anon), numa transação: é assim que o PostgREST do Supabase roda cada pedido.
export function asUser(db, uid, fn, role = 'authenticated') {
  return db.transaction(async tx => {
    await tx.exec(`set local role ${role}`);
    await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(uid ? { sub: uid, role } : { role })]);
    return fn(tx);
  });
}

// Impressão digital do que está GRAVADO (texto do mundo + texto de cada mesa), byte a byte.
export const storedDigest = b => sha(b.w + '|' + Object.keys(b.desks).sort().map(k => k + '=' + b.desks[k].str).join('|'));
