// Separa e junta o estado da liga nos três pedaços que o banco guarda: mundo, mesas e segredos.
import { NETCORE as NC } from '../../app/src/net/netcore.js';

// Chaves do estado que nunca vão ao cliente. msalt entra na semente das partidas (ver engine/season.js).
export const SECRET_KEYS = ['msalt'];

export function splitState(S) {
  const secrets = {};
  for (const k of SECRET_KEYS) if (k in S) { secrets[k] = S[k]; delete S[k]; }
  try { const { w, desks } = NC.split(S); return { w, desks, secrets }; }
  finally { Object.assign(S, secrets); }
}

// base = { w, desks: { key: { ver, str } }, secrets }
export function assembleState(base) {
  const S = NC.assemble(base);
  Object.assign(S, base.secrets || {});
  return S;
}

export class ConflictError extends Error {
  constructor(why, detail) { super('conflict: ' + why + (detail ? ' ' + detail : '')); this.code = 'conflict'; this.why = why; }
}
