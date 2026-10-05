// Armazenamento em memória com a mesma semântica do PgStore: mundo, mesas e segredos separados,
// cada linha com versão, gravação atômica com checagem otimista. Usado em testes e desenvolvimento.
import { splitState, ConflictError } from './league-state.js';
export { ConflictError };

export class MemoryStore {
  #leagues = new Map();   // code -> { ver, w, secrets, desks: Map<key,{ver,str}> }

  async create(code, S) {
    if (this.#leagues.has(code)) throw new Error('liga já existe: ' + code);
    const { w, desks, secrets } = splitState(S);
    this.#leagues.set(code, { ver: 1, w, secrets, desks: new Map(Object.entries(desks).map(([k, str]) => [k, { ver: 1, str }])) });
  }

  async load(code) {
    const L = this.#leagues.get(code); if (!L) return null;
    return { ver: L.ver, w: L.w, secrets: { ...L.secrets }, desks: Object.fromEntries([...L.desks].map(([k, d]) => [k, { ver: d.ver, str: d.str }])) };
  }

  // base = o que load() devolveu; S = estado novo. Grava só o que mudou; tudo ou nada.
  async commit(code, base, S) {
    const L = this.#leagues.get(code); if (!L) throw new ConflictError('missing');
    const now = splitState(S);
    if (L.ver !== base.ver) throw new ConflictError('world');
    for (const k of new Set([...Object.keys(now.desks), ...Object.keys(base.desks)])) {
      if ((L.desks.get(k)?.ver ?? 0) !== (base.desks[k]?.ver ?? 0)) throw new ConflictError('desk', k);
    }
    let changed = false;
    if (now.w !== L.w) { L.w = now.w; L.ver++; changed = true; }
    for (const [k, str] of Object.entries(now.desks)) {
      const cur = L.desks.get(k);
      if (!cur) { L.desks.set(k, { ver: 1, str }); changed = true; }
      else if (cur.str !== str) { cur.str = str; cur.ver++; changed = true; }
    }
    for (const k of Object.keys(base.desks)) if (!(k in now.desks)) { L.desks.delete(k); changed = true; }
    return { ok: true, changed, ver: L.ver };
  }
}
