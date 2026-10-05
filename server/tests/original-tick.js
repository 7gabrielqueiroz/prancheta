// Oráculo de teste: o tick de servidor do jogo ORIGINAL (NETCORE.tickOne, código inalterado),
// rodando sobre um banco falso em memória que responde às mesmas RPCs do Supabase antigo.
// Serve para provar que server/src/tick.js + Store produzem exatamente o mesmo estado.
import { NETCORE as NC } from '../../app/src/net/netcore.js';

export function originalServer(code, S) {
  const { w, desks } = NC.split(S);
  const L = { ver: 1, w, desks: Object.fromEntries(Object.entries(desks).map(([t, str]) => [t, { ver: 1, str }])) };
  const rpc = async (fn, a) => {
    if (fn === 'league_versions') return { ver: L.ver, desks: Object.fromEntries(Object.entries(L.desks).map(([t, d]) => [t, d.ver])) };
    if (fn === 'league_world_get') return { z: 'raw', data: L.w, ver: L.ver };
    if (fn === 'league_desks_get') return a.p_tokens.filter(t => L.desks[t]).map(t => ({ token: t, ver: L.desks[t].ver, z: 'raw', data: L.desks[t].str }));
    if (fn === 'league_commit') {
      if (a.p_expect !== L.ver) return { ok: false, why: 'world' };
      for (const d of a.p_desks) if ((L.desks[d.token]?.ver ?? 0) !== d.expect) return { ok: false, why: 'desk' };
      if (a.p_world != null) { L.w = await NC.dec(a.p_z, a.p_world); L.ver++; }
      const out = {};
      for (const d of a.p_desks) {
        if (d.data == null) { delete L.desks[d.token]; continue; }
        L.desks[d.token] = { ver: (L.desks[d.token]?.ver ?? 0) + 1, str: await NC.dec(d.z, d.data) };
        out[d.token] = L.desks[d.token].ver;
      }
      return { ok: true, ver: L.ver, desks: out };
    }
    throw new Error('rpc não simulada: ' + fn);
  };
  return {
    tick: () => NC.tickOne(rpc, code),
    stored: () => ({ w: L.w, desks: L.desks }),
  };
}
