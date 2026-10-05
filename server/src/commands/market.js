// Comandos de mercado e finanças. Cada um valida o payload (common.js) e chama a MESMA função do motor
// que a interface antiga chamava no navegador, em nome da mesa de quem pediu.
//
// Convenção de resultado: o command termina 'done' com `result.outcome` = resposta do motor
// ({ status | ok, msg, ... }). Recusa do motor ("o clube não vende por isso") é resposta de jogo, não erro de pedido:
// ela pode ter mudado estado (ex.: contagem de recusas) e o cliente a mostra ao usuário. Só pedido inválido vira 'rejected'.
//
// Troca de dinheiro entre treinadores (bid/acceptOffer/respondCounter/recallLoan) mexe em duas mesas na mesma
// transação do commit; o motor faz isso com Wd.asClub, que aqui roda sobre o estado completo da liga.
import { MARKET as MK, WORLD as Wd, CORE } from '../../../app/src/engine/index.js';
import { need, isObj, has, asMe, deskOf, playerId, money, intIn, oneOf } from './common.js';

const outcome = r => ({ outcome: r == null ? { gone: true } : r });
const LISTING = ['list', 'loan'], LEN = ['6m', '1t'];

export const marketHandlers = {
  // Proposta por um jogador: clube da IA responde na hora (aceita, contrapropõe, recusa ou encerra a conversa);
  // clube de outro treinador recebe a proposta na mesa dele. swap = jogador do SEU elenco entrando na troca.
  'market.bid'(ctx) {
    const { payload: p } = ctx;
    const id = playerId(p.id), fee = money(p.fee, { code: 'fee', what: 'Valor da proposta' });
    const swap = p.swap == null ? null : playerId(p.swap, 'Jogador da troca');
    return outcome(asMe(ctx, () => MK.bid(ctx.S, id, fee, swap)));
  },

  // Contrato com o jogador. Exige a taxa já acertada (market.bid) ou jogador livre; pre = pré-contrato.
  'market.contract'(ctx) {
    const { payload: p } = ctx;
    const id = playerId(p.id), sal = money(p.sal, { code: 'sal', what: 'Salário', max: 1e8 });
    const years = intIn(p.years, 1, 5, { code: 'years', what: 'Duração do contrato' });
    need(p.pre === undefined || typeof p.pre === 'boolean', 'pre', 'Pedido inválido.');
    return outcome(asMe(ctx, () => MK.contract(ctx.S, id, sal, years, { pre: !!p.pre })));
  },

  // Desiste do acordo de taxa / contraproposta com a IA.
  'market.negDrop'(ctx) { const id = playerId(ctx.payload.id); return outcome(asMe(ctx, () => MK.negDrop(ctx.S, id))); },

  'market.renew'(ctx) {
    const id = playerId(ctx.payload.id), years = intIn(ctx.payload.years, 1, 5, { code: 'years', what: 'Duração do contrato' });
    return outcome(asMe(ctx, () => MK.renew(ctx.S, id, years)));
  },

  'market.release'(ctx) { const id = playerId(ctx.payload.id); return outcome(asMe(ctx, () => MK.release(ctx.S, id))); },

  // Lista de transferências ('list') ou de empréstimo ('loan', com duração).
  'market.setListing'(ctx) {
    const { payload: p } = ctx, id = playerId(p.id), kind = oneOf(p.kind, LISTING, 'kind', 'Tipo de lista');
    const len = p.len == null ? undefined : oneOf(p.len, LEN, 'len', 'Duração do empréstimo');
    const r = asMe(ctx, () => MK.setListing(ctx.S, id, kind, len));
    return { outcome: r && r.blocked ? { blocked: r.blocked } : { on: !!r } };
  },

  // Propostas recebidas por jogadores seus (de clubes da IA ou de outros treinadores).
  'market.acceptOffer'(ctx) {
    const k = intIn(ctx.payload.k, 0, Number.MAX_SAFE_INTEGER, { code: 'offer', what: 'Proposta' });
    return outcome(asMe(ctx, () => MK.acceptOffer(ctx.S, k)));
  },
  'market.declineOffer'(ctx) {
    const k = intIn(ctx.payload.k, 0, Number.MAX_SAFE_INTEGER, { code: 'offer', what: 'Proposta' });
    asMe(ctx, () => MK.declineOffer(ctx.S, k));
    return { outcome: { ok: true } };
  },
  'market.counterOffer'(ctx) {
    const { payload: p } = ctx;
    const k = intIn(p.k, 0, Number.MAX_SAFE_INTEGER, { code: 'offer', what: 'Proposta' });
    const value = money(p.value, { code: 'value', what: 'Contraproposta' });
    const share = p.share == null ? null : intIn(p.share, 0, 100, { code: 'share', what: 'Parte do salário' });
    return outcome(asMe(ctx, () => MK.counterOffer(ctx.S, k, value, share)));
  },
  // Comprador responde à contraproposta de outro treinador.
  'market.respondCounter'(ctx) {
    const { payload: p } = ctx;
    const k = intIn(p.k, 0, Number.MAX_SAFE_INTEGER, { code: 'offer', what: 'Proposta' });
    need(typeof p.yes === 'boolean', 'yes', 'Resposta inválida.');
    return outcome(asMe(ctx, () => MK.respondCounter(ctx.S, k, p.yes)));
  },

  // Empréstimo de jogador listado por outro clube. fee/share só se o usuário negocia os termos.
  'market.requestLoan'(ctx) {
    const { payload: p } = ctx, id = playerId(p.id);
    let terms;
    if (p.fee !== undefined || p.share !== undefined)
      terms = { fee: money(p.fee, { code: 'fee', what: 'Taxa de empréstimo' }), share: intIn(p.share, 20, 100, { code: 'share', what: 'Parte do salário' }) };
    return outcome(asMe(ctx, () => MK.requestLoan(ctx.S, id, terms)));
  },
  'market.buyOption'(ctx) { const id = playerId(ctx.payload.id); return outcome(asMe(ctx, () => MK.buyOption(ctx.S, id))); },
  // refund = valor mostrado ao usuário; o motor recusa se o prazo andou e o valor mudou.
  'market.recallLoan'(ctx) {
    const { payload: p } = ctx, id = playerId(p.id);
    const refund = p.refund == null ? null : money(p.refund, { code: 'refund', what: 'Reembolso' });
    return outcome(asMe(ctx, () => MK.recallLoan(ctx.S, id, refund)));
  },

  // Pacote do dia: list = qual pacote, option = qual carta.
  'market.takePack'(ctx) {
    const { payload: p } = ctx;
    const li = intIn(p.list, 0, 20, { code: 'pack', what: 'Pacote' }), oi = intIn(p.option, 0, 20, { code: 'pack', what: 'Carta' });
    return outcome(asMe(ctx, () => {
      const pk = ctx.S.packs && ctx.S.packs.list && ctx.S.packs.list[li];
      need(pk && pk.opts && pk.opts[oi], 'pack', 'Esse pacote não existe.');
      return MK.takePack(ctx.S, li, oi);
    }));
  },
  'market.skipPack'(ctx) {
    const li = intIn(ctx.payload.list, 0, 20, { code: 'pack', what: 'Pacote' });
    asMe(ctx, () => { need(ctx.S.packs && ctx.S.packs.list && ctx.S.packs.list[li], 'pack', 'Esse pacote não existe.'); MK.skipPack(ctx.S, li); });
    return { outcome: { ok: true } };
  },

  // Estrelas e diamantes viram caixa. n >= 1: quantidade negativa "compraria" estrelas com o caixa.
  'market.cashOut'(ctx) {
    const { payload: p } = ctx, kind = oneOf(p.kind, ['star', 'dia'], 'kind', 'Tipo');
    const n = intIn(p.n, 1, 100000, { code: 'n', what: 'Quantidade' });
    return outcome(asMe(ctx, () => MK.cashOut(ctx.S, kind, n)));
  },
  'market.starsToDia'(ctx) { return outcome(asMe(ctx, () => MK.starsToDia(ctx.S))); },

  // Teto salarial escolhido pelo treinador. O motor limita pelo caixa e piso pela folha atual.
  'finance.wageBudget'(ctx) {
    const v = money(ctx.payload.value, { code: 'value', what: 'Teto salarial', max: 1e8 });
    return outcome(asMe(ctx, () => {
      const b0 = MK.budget(ctx.S);
      ctx.S.wageBudget = Math.max(b0.pay, v);
      const b = MK.budget(ctx.S);
      return { ok: true, wage: b.wage, wageRoom: b.wageRoom };
    }));
  },
};
