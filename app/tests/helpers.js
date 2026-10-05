import fs from 'node:fs'; import crypto from 'node:crypto';
export const T0 = Date.UTC(2026, 6, 1, 12, 0, 0);
export const stable = o => JSON.stringify(o, (k, v) => v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map(x => [x, v[x]])) : v);
export const sha = s => crypto.createHash('sha1').update(s).digest('hex');
export const loadRaw = () => JSON.parse(fs.readFileSync(new URL('../public/data/players.json', import.meta.url), 'utf8'));
// Relógio e aleatório determinísticos: mesma configuração do tools/golden-original.mjs
export function installFakes() {
  const state = { clock: T0 };
  let rnd = 123456789;
  const RealDate = Date;
  globalThis.Date = class extends RealDate { constructor(...a) { a.length ? super(...a) : super(state.clock); } static now() { return state.clock; } };
  Math.random = () => ((rnd = (rnd * 1664525 + 1013904223) >>> 0) / 4294967296);
  return state;
}
