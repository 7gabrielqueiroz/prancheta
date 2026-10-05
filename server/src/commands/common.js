// Peças comuns dos comandos: recusa, validadores de payload e acesso à mesa do usuário.
// O cliente é hostil: nada que vem do payload chega ao motor sem passar por um destes validadores.
import { WORLD as Wd } from '../../../app/src/engine/index.js';

// Recusa esperada (pedido inválido ou regra violada). Vira commands.status = 'rejected'.
export class Reject extends Error {
  constructor(code, message) { super(message); this.reject = code; }
}
export const need = (cond, code, message) => { if (!cond) throw new Reject(code, message); };
export const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
export const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

// Mesa do usuário COM clube. Quem é espectador, não escolheu clube ou foi demitido não opera o clube.
export function deskOf(ctx) {
  const k = ctx.member && ctx.member.desk_key, d = k && ctx.S.desks[k];
  need(d, 'nodesk', 'Você ainda não tem clube nesta liga.');
  need(d.club && !d.unemployed, 'unemployed', 'Você está sem clube.');
  return k;
}

// Roda fn (a função do motor) em nome da mesa do usuário.
export const asMe = (ctx, fn) => Wd.asDesk(ctx.S, deskOf(ctx), fn);

// Id de jogador: inteiro que existe no banco de jogadores do motor.
export function playerId(v, what = 'Jogador') {
  need(Number.isInteger(v) && Wd.P[v], 'player', `${what} inválido.`);
  return v;
}
// Dinheiro (T$): número finito, >= 0, com teto. Devolve inteiro. NaN/Infinity/string/negativo são recusados.
export function money(v, { code = 'money', what = 'Valor', max = 1e10 } = {}) {
  need(typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max, code, `${what} inválido.`);
  return Math.round(v);
}
// Inteiro em [min, max].
export function intIn(v, min, max, { code = 'int', what = 'Valor' } = {}) {
  need(Number.isInteger(v) && v >= min && v <= max, code, `${what} inválido.`);
  return v;
}
export const oneOf = (v, list, code, what = 'Valor') => { need(list.includes(v), code, `${what} inválido.`); return v; };
