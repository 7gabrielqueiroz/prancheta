// Gera o "golden master": roda o motor ORIGINAL (reference/*.js, scripts clássicos) num mundo fixo e grava checkpoints.
// Uso: node tools/golden-original.mjs  ->  tests/golden/season-turbo.json
import vm from 'node:vm'; import fs from 'node:fs'; import crypto from 'node:crypto'; import path from 'node:path';
const ref = new URL('../../reference/', import.meta.url);
const read = f => fs.readFileSync(new URL(f, ref), 'utf8');
const T0 = Date.UTC(2026, 6, 1, 12, 0, 0);
let clock = T0;
const FDate = class extends Date { constructor(...a) { a.length ? super(...a) : super(clock); } static now() { return clock; } };
let rnd = 123456789; const fixedRandom = () => ((rnd = (rnd * 1664525 + 1013904223) >>> 0) / 4294967296);
const ctx = vm.createContext({ console, Date: FDate, Math: Object.assign(Object.create(Math), { random: fixedRandom }), JSON, setTimeout, clearTimeout, TextEncoder, TextDecoder, Blob, atob, btoa });
const run = (code, name) => new vm.Script(code, { filename: name }).runInContext(ctx);
for (const n of ['core', 'world', 'match', 'season', 'train', 'market', 'events', 'sprites']) run(read(n + '.js'), n + '.js');
run(`const RAW = ${read('players-data.json')}; WORLD.init(RAW);`, 'raw');

export const stable = o => JSON.stringify(o, (k, v) => v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map(x => [x, v[x]])) : v);
const sha = s => crypto.createHash('sha1').update(s).digest('hex');
const out = { checkpoints: [] };
ctx.__out = out; ctx.__sha = sha; ctx.__stable = stable; ctx.__setClock = t => { clock = t; };
run(`
  const Wd = WORLD, SE = SEASON;
  const S = Wd.newWorld({ now: ${T0}, seed: 424242, mode: 'turbo' });
  SE.setupSeason(S); S.lastT = S.seasonStart;
  const clubs = S.divA.slice(0, 3);
  clubs.forEach((c, i) => Wd.addDesk(S, 'tok' + i, { name: 'Tec' + i }, c));
  Wd.bindDesks(S);
  globalThis.__S = S;
`, 'setup');
const days = +(process.argv[2] || 8), stepMin = 30;
const total = days * 24 * 60 / stepMin;
for (let i = 1; i <= total; i++) {
  clock = T0 + i * stepMin * 60000;
  run(`SEASON.process(__S, 200)`, 'tick');
  if (i % 48 === 0 || i === total) {
    const j = run(`__stable(__S)`, 'ck');
    out.checkpoints.push({ i, day: i / 48, slot: run('__S.slot'), season: run('__S.season'), size: j.length, sha: sha(j) });
  }
}
out.summary = JSON.parse(run(`JSON.stringify({ slot: __S.slot, season: __S.season, played: Object.keys(__S.played||{}).length, news: __S.news.length, top: (__S.divA||[]).slice(0,5) })`, 'sum'));
import { fileURLToPath } from 'node:url';
const dest = fileURLToPath(new URL('../tests/golden/season-turbo.json', import.meta.url));
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out.summary), out.checkpoints.length, 'checkpoints');
