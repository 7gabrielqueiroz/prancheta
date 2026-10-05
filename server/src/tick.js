// Tick de uma liga no servidor: carrega, processa o que está pendente e grava.
// Mesma sequência de NETCORE.tickOne (sem o reparo pontual da liga YNHWXS), sobre um Store em vez de RPCs.
import { NETCORE as NC } from '../../app/src/net/netcore.js';
import { SEASON, EVENTS } from '../../app/src/engine/index.js';
import { assembleState } from './league-state.js';

// Parte do motor: manutenção do servidor + tudo o que o relógio da liga já venceu. Muta S.
export function advance(S, { maxLoops = 8, budgetMs = 1500 } = {}) {
  try { EVENTS.dupClubFix(S); } catch (e) {}
  try { EVENTS.idleTick(S, Date.now()); } catch (e) {}
  try { EVENTS.admTick(S, Date.now()); } catch (e) {}
  const t1 = Date.now();
  let slots = 0, loops = 0;
  while (NC.need(S) && loops < maxLoops && (loops === 0 || Date.now() - t1 < budgetMs)) {
    const out = SEASON.process(S, 4); slots += out && out.slots ? out.slots.length : 0; loops++;
  }
  return { loops, slots, more: NC.need(S), nextAt: NC.nextAt(S) };
}

export async function tickLeague(store, ref, { maxLoops, budgetMs, holder } = {}) {
  const base = await store.load(ref);
  if (!base) return { ref, ok: false, why: 'missing' };
  const S = assembleState(base);
  const a = advance(S, { maxLoops, budgetMs });
  const r = await store.commit(ref, base, S, { holder, nextTickAt: a.nextAt });
  return { ref, ok: r.ok, changed: r.changed, ver: r.ver, ...a, S };
}
