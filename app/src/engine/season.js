// Origem: reference/season.js (convertido na Fase 1). A partir da Fase 2 este arquivo é FONTE: edite aqui.
import { CORE } from './core.js';
import { WORLD } from './world.js';
import { SIM } from './match.js';
let EVENTS, MARKET, TRAIN;
export const __bind = d => { EVENTS = d.EVENTS; MARKET = d.MARKET; TRAIN = d.TRAIN; };
// ===== TREINEIROS v3 · temporada: calendário, competições, processamento =====
export const SEASON = (() => {
  // PRANCHETA: semente das partidas. S.msalt é um segredo que só o servidor tem (nunca vai ao cliente);
  // sem ele, quem lê o mundo (que traz S.seed) consegue simular a própria partida antes da hora.
  // Sem msalt o resultado é idêntico ao do motor original (golden master).
  const mseed = S => S.msalt ? S.msalt + '|' + S.seed : S.seed;
  const C = CORE, Wd = WORLD;
  const { R, hash, clamp, shuffle, r1k, FORMATIONS, fit, ECON, STYLES } = C;
  const { P, ps, squad, avail, age, view } = Wd;
  const DAY = 86400000, HOUR = 3600000;
  // ---- modos: Normal (28 dias reais, 2 jogos/dia) e Turbo ⚡ (7 dias reais, 8 jogos/dia) ----
  // No Turbo o "relógio esportivo" anda 4× mais rápido: 1 dia do jogo = 6 horas reais.
  // Tudo que conta dias (salários, mercado, eventos, pacotes, amistosos) usa o relógio esportivo,
  // e tudo que conta jogos (lesões, suspensões, empréstimos) já escala sozinho.
  const TURBO_H = [8, 10.5, 13, 15.5, 18, 20, 22, 23.5], TMUL = 4;
  const isTurbo = S => !!S && S.mode === 'turbo';
  const perDay = S => isTurbo(S) ? 8 : 2;
  const baseT = S => Wd.startOfDay(S.created);
  const sport = (S, t) => isTurbo(S) ? baseT(S) + (t - baseT(S)) * TMUL : t;
  const unsport = (S, ts) => isTurbo(S) ? baseT(S) + (ts - baseT(S)) / TMUL : ts;
  const sportDayStart = (S, d) => unsport(S, baseT(S) + d * DAY);
  const SLOTS = 56;   // 28 dias reais × 2 jogos (12h e 18h) = 4 ciclos de 7 dias
  const SPECIAL = { 0: ['SC', 1], 3: ['PL', 1], 6: ['PL', 2], 8: ['C', 1], 12: ['C', 2], 16: ['C', 3], 20: ['C', 4], 24: ['C', 5], 28: ['C', 6],
    10: ['CB', 1], 18: ['CB', 2], 30: ['CB', 3], 38: ['CB', 4], 46: ['CB', 5], 34: ['CK', 1], 42: ['CK', 2], 50: ['CK', 3], 55: ['CB', 6] };
  const CAL = []; { let md = 0; for (let k = 0; k < SLOTS; k++) { const s = SPECIAL[k]; CAL.push(s ? { k, type: s[0], md: s[1] } : { k, type: 'L', md: ++md }); } }
  // Cada janela ocupa duas rodadas de liga, sem tirar jogadores das copas.
  const CALLUPS = [21, 43];
  const SPECIAL_K = { CB5: 46 };
  const PRE_FROM = 28;
  const CB_STAGES = ['1ª fase', 'Oitavas', 'Quartas', 'Semifinal', 'Final (ida)', 'Final (volta)'];
  const CK_STAGES = ['Quartas', 'Semifinal', 'Final'];
  const COMP_NAME = { SC: 'Supercopa do Brasil', AMI: 'Amistoso', A: 'Série A', B: 'Série B', C: 'Série C', CB: 'Copa do Brasil', LIB: 'Libertadores', SUL: 'Sul-Americana', CONF: 'Conferência', PL: 'Pré-Libertadores', NE: 'Copa do Nordeste', SSE: 'Copa Sul-Sudeste', VER: 'Copa Verde', INT: 'Copa Intercontinental' };
  const PRIZE = {
    // v175: Série A mais plana, na régua do Brasileirão real (R$ 600 = T$ 1); 17º a 20º recebem um mínimo
    A: pos => [80, 76, 72, 68, 64, 60, 56, 52, 48, 44, 34, 32, 30, 29, 28, 27][pos - 1] * 1000 || 12000,
    B: pos => Math.max(4000, 30000 - (pos - 1) * 1400),
    C: pos => Math.max(2000, 14000 - (pos - 1) * 600),
    // v175: Copa do Brasil paga o total acumulado até a fase em que o clube parou (1ª fase, oitavas, quartas, semi, vice, campeão)
    CB: [3000, 6000, 10000, 18000, 33000, 78000],
    // continentais e regionais somam a cada fase (part + qf + sf + ru; campeão leva ch - ru a mais). Metade da proporção real.
    LIB: { part: 15000, qf: 12000, sf: 12000, ru: 30000, ch: 110000 }, SUL: { part: 8000, qf: 6000, sf: 6000, ru: 12000, ch: 30000 },
    CONF: { part: 4000, qf: 3000, sf: 4000, ru: 6000, ch: 14000 }, PL: 5000,
    NE: { part: 2500, qf: 2000, sf: 2500, ru: 3000, ch: 7000 }, SSE: { part: 2500, qf: 2000, sf: 2500, ru: 3000, ch: 7000 }, VER: { part: 2500, qf: 2000, sf: 2500, ru: 3000, ch: 7000 },
    QUAL: { LIB: 20000, PL: 10000, SUL: 8000, CONF: 4000 },
    INT: { part: 10000, win: 15000, ch: 60000 },   // v209: Intercontinental (por vitória; campeão leva ch a mais)
  };

  // v175: cota fixa da temporada (papel da TV e da cota da CBF), igual pra todos da divisão, em 4 parcelas ao longo da temporada
  // v183: Série A sem cota fixa. Só adiantamento de emergência (caixa negativo), em parcelas de 10 mil até 80 mil por temporada, devolvido nas viradas
  const COTA = { A: 40000, B: 20000, C: 30000 }, COTA_N = 4, COTA_FIX = { A: false, B: true, C: true }, ADV_KEEP = 14, ADV_N = 8;
  // v175: bônus de conquista (moedas pro treinador do clube campeão)
  const TITLE_BONUS = { REG: [4, 0], C: [5, 1], B: [6, 1], CONF: [6, 0], CB: [8, 1], SUL: [8, 1], A: [10, 1], LIB: [12, 1], INT: [12, 1] };
  function titleBonus(S, club, key, label) {
    const b = TITLE_BONUS[key]; if (!b || !club || !Wd.isHuman(S, club)) return;
    Wd.asClub(S, club, () => award(S, b[0], b[1], `bônus de conquista: ${label}`));
  }
  // v184: ajuda de emergência (parcela antecipada / adiantamento da TV) só pra gestão responsável. IA sempre recebe.
  // Treinador perde o direito se, na temporada, comprou mais do que vendeu ou aumentou a folha em mais de 10%.
  const HELP_PAY_UP = 1.10;
  function helpCheck(S, cl) {
    if (!Wd.isHuman(S, cl)) return { ok: true };
    const pay0 = S.cota && S.cota.pay0 && S.cota.pay0[cl], pay = Wd.payroll(S, cl);
    let net = 0; Wd.asClub(S, cl, () => { const f = S.fin || {}; net = (f.sold || 0) + (f.loanRefundIn || 0) - (f.spent || 0) - (f.loanRefundOut || 0); });
    const up = pay0 ? pay / pay0 : 1;
    if (net < 0) return { ok: false, net, up, why: `gastou T$ ${C.fmt(-net)} a mais do que arrecadou no mercado nesta temporada` };
    if (up > HELP_PAY_UP) return { ok: false, net, up, why: `aumentou a folha salarial em ${Math.round((up - 1) * 100)}% desde o início da temporada` };
    return { ok: true, net, up, pay0 };
  }
  function helpDenied(S, cl, div, h) {
    const d = dayAbs(S, now(S)); S.cota.deny = S.cota.deny || {};
    if (S.cota.deny[cl] != null && d - S.cota.deny[cl] < 3) return;   // no máximo 1 aviso a cada 3 dias
    S.cota.deny[cl] = d;
    const who = COTA_FIX[div] ? `A CBF, após revisão da ANRESF (Agência Nacional de Regulação e Sustentabilidade do Futebol), recusou antecipar a próxima parcela da cota da Série ${div}` : 'A TV, após revisão da ANRESF (Agência Nacional de Regulação e Sustentabilidade do Futebol), recusou adiantar as cotas';
    Wd.asClub(S, cl, () => EVENTS.news(S, { t: 'fin', front: 88, title: `ANRESF nega socorro ao ${cl}`, body: `${who}: o clube ${h.why}. Com o caixa negativo, os salários atrasam até o clube equilibrar as contas (vender jogadores ou reduzir a folha).`, clubs: [cl], desk: S.__me }));
  }
  function cotaTick(S) {
    if (!S.divA || !S.comp) return;
    if (!S.cota || S.cota.s !== S.season || typeof S.cota.p !== 'object') {
      // v176: liga que recebe a atualização já com a temporada encerrada não ganha a cota retroativa (começa na próxima)
      if (S.post && !S.cota) { const all = {}; for (const cl of [...S.divA, ...S.divB, ...(S.divC || [])]) all[cl] = COTA_N; S.cota = { s: S.season, p: all }; return; }
      S.cota = { s: S.season, p: {} };
    }
    S.cota.pay0 = S.cota.pay0 || {};
    for (const cl of Wd.brClubs(S)) if (S.cota.pay0[cl] == null && Wd.isHuman(S, cl)) S.cota.pay0[cl] = Wd.payroll(S, cl);   // folha de referência da temporada
    const due = Math.min(COTA_N, 1 + Math.floor((S.slot || 0) * COTA_N / SLOTS));
    for (const [div, list] of [['A', S.divA], ['B', S.divB], ['C', S.divC || []]]) for (const cl of list) {
      if (!isBR(S, cl)) continue;
      let n = S.cota.p[cl] || 0;
      if (!COTA_FIX[div]) {
        // Série A: só se o caixa ficar negativo, a TV adianta 10 mil (até 8× na temporada). Vira dívida, cobrada nas viradas de temporada
        if ((S.cash[cl] || 0) < 0 && n < ADV_N) { const h = helpCheck(S, cl); if (!h.ok) { helpDenied(S, cl, div, h); S.cota.p[cl] = n; continue; } }
        while (n < ADV_N && (S.cash[cl] || 0) < 0) {
          n++; const v = COTA[div] / COTA_N;
          S.cash[cl] = (S.cash[cl] || 0) + v;
          S.tvAdv = S.tvAdv || {}; S.tvAdv[cl] = (S.tvAdv[cl] || 0) + v; const dv = S.tvAdv[cl];
          if (Wd.isHuman(S, cl)) Wd.asClub(S, cl, () => { S.fin = S.fin || {}; S.fin.tvIn = (S.fin.tvIn || 0) + v; });
          if (Wd.isHuman(S, cl)) Wd.asClub(S, cl, () => { S.moneyIn = { d: dayAbs(S, now(S)), v, why: 'adiantamento das cotas de TV' }; EVENTS.news(S, { t: 'fin', title: `Cotas de TV adiantadas: + T$ ${C.fmt(v)}`, body: `O caixa ficou negativo e a TV adiantou T$ ${C.fmt(v)} pra não atrasar salário. É empréstimo: o valor sai do caixa na virada da temporada (dívida atual: T$ ${C.fmt(dv)}).`, clubs: [cl], desk: S.__me }); });
        }
        S.cota.p[cl] = n; continue;
      }
      // parcela no calendário; se o caixa ficou negativo, a CBF antecipa a próxima (ninguém atrasa salário por causa do calendário)
      let hOk = null;
      while (n < COTA_N && (n < due || ((S.cash[cl] || 0) < 0 && (hOk ?? (hOk = helpCheck(S, cl)).ok)))) {
        n++; const v = COTA[div] / COTA_N, early = n > due;
        S.cash[cl] = (S.cash[cl] || 0) + v;
        if (Wd.isHuman(S, cl)) Wd.asClub(S, cl, () => { S.seasonLog.prizes[`Cota da Série ${div}`] = (S.seasonLog.prizes[`Cota da Série ${div}`] || 0) + v; EVENTS.news(S, { t: 'fin', title: `Cota da temporada (${n}/${COTA_N})${early ? ' antecipada' : ''}: + T$ ${C.fmt(v)}`, body: early ? `O caixa ficou negativo e a CBF antecipou uma parcela da cota da Série ${div}. As próximas parcelas diminuem.` : `Parcela da cota da Série ${div}, paga igualmente a todos os clubes da divisão (direitos de TV e repasse da CBF).`, clubs: [cl], desk: S.__me }); });
        if (!early && (S.cash[cl] || 0) >= 0 && n >= due) break;
      }
      if (hOk && !hOk.ok && (S.cash[cl] || 0) < 0 && n < COTA_N) helpDenied(S, cl, div, hOk);
      S.cota.p[cl] = n;
    }
  }
  // v183: devolução do adiantamento da TV na virada. Nunca deixa o caixa abaixo de 14 dias de folha; o que não couber fica pra próxima
  function tvAdvPay(S) {
    for (const cl of Object.keys(S.tvAdv || {})) {
      const debt = S.tvAdv[cl]; if (!(debt > 0) || S.cash[cl] === undefined) { delete S.tvAdv[cl]; continue; }
      const room = Math.max(0, (S.cash[cl] || 0) - Wd.payroll(S, cl) * ADV_KEEP), pay = Math.min(debt, Math.floor(room / 1000) * 1000);
      if (pay > 0) { S.cash[cl] -= pay; S.tvAdv[cl] = debt - pay; if (Wd.isHuman(S, cl)) Wd.asClub(S, cl, () => { S.fin = S.fin || {}; S.fin.tvOut = (S.fin.tvOut || 0) + pay; }); }
      const left = S.tvAdv[cl];
      if (Wd.isHuman(S, cl)) Wd.asClub(S, cl, () => EVENTS.news(S, { t: 'fin', title: pay > 0 ? `${cl} devolve T$ ${C.fmt(pay)} das cotas de TV adiantadas` : `${cl} adia a devolução das cotas de TV`, body: left > 0 ? `${pay > 0 ? 'O caixa só comportava parte da dívida. ' : 'O caixa está curto e a TV aceitou esperar. '}Faltam T$ ${C.fmt(left)}, cobrados na próxima virada.` : 'Dívida com a TV quitada.', clubs: [cl], desk: S.__me }));
      if (!(left > 0)) delete S.tvAdv[cl];
    }
  }


  // ---------- tempo ----------
  // relógio do jogo: no teste online o dia passa mais rápido (speed = quantos "segundos de jogo" por segundo real)
  const virt = (S, t) => S.epoch && S.speed > 1 ? S.epoch + (t - S.epoch) * S.speed : t;
  // pausa (ADM): o relógio da liga congela até S.pause.until e depois continua de onde parou
  const spd = S => S.epoch && S.speed > 1 ? S.speed : 1;
  const paused = S => !!(S.pause && Date.now() < S.pause.until);
  const pauseExtra = S => S.pause && Date.now() >= S.pause.until ? -(S.pause.until - S.pause.from) * spd(S) : 0;
  const now = S => paused(S) ? S.pause.v : virt(S, Date.now()) + (S.off || 0) + pauseExtra(S);
  const toReal = (S, tv) => {
    if (paused(S)) return tv <= S.pause.v ? Date.now() : S.pause.until + (tv - S.pause.v) / spd(S);
    const off = (S.off || 0) + pauseExtra(S);
    return S.epoch && S.speed > 1 ? S.epoch + (tv - off - S.epoch) / S.speed : tv - off;
  };
  // pausa até que o próximo jogo aconteça no horário real escolhido
  function pauseUntilMatch(S, realAt) {
    foldPause(S);
    const v = now(S), nxK = Math.min(S.slot, SLOTS - 1), tNext = slotTime(S, nxK);
    const until = Math.round(realAt - Math.max(0, tNext - v) / spd(S));
    if (until <= Date.now()) return { ok: false, msg: 'Esse horário já passou para o próximo jogo.' };
    if (paused(S)) S.pause.until = until;          // já pausada: só remarca o horário (mantém o ponto congelado)
    else S.pause = { v, from: Date.now(), until };
    return { ok: true, until };
  }
  function resume(S) { if (S.pause) { S.pause.until = Math.min(S.pause.until, Date.now()); foldPause(S); } }
  function foldPause(S) { if (S.pause && Date.now() >= S.pause.until) { S.off = (S.off || 0) + pauseExtra(S); delete S.pause; } }
  const realMs = (S, ms) => ms / (S.speed > 1 ? S.speed : 1);
  const gridH = S => isTurbo(S) ? TURBO_H : (S.slotH || [12, 18]);
  // slotOff: a temporada pode começar no meio da grade do dia (logo após a pré-temporada)
  const slotTime = (S, k) => { const H = gridH(S), n = H.length, g = k + (S.slotOff || 0); return S.seasonStart + Math.floor(g / n) * DAY + H[g % n] * HOUR; };
  // data fictícia no calendário do jogo (fim de janeiro a início de dezembro)
  const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  // ---------- dias fictícios (calendário do jogo) ----------
  // cada rodada fica ~5,8 dias depois da anterior; a pré-temporada ocupa os 15 dias antes da rodada 0.
  // O descanso dos jogadores conta esses dias (igual no Normal e no Turbo).
  // calendário fictício com semanas de verdade: jogo de copa é "quarta-feira" (3 dias depois do anterior),
  // o jogo de liga logo depois vem 4 dias depois; as semanas só de liga ficam com o resto (total da temporada igual ao de antes)
  const FD_PER_K = 5.8, PRE_FD = 15, CUP_GAP = 3, POST_CUP_GAP = 4;
  const FDK = (() => {
    const isCup = k => CAL[k] && CAL[k].type !== 'L', n = CAL.length, total = Math.round((n - 1) * FD_PER_K);
    let fixed = 0, free = 0; for (let k = 1; k < n; k++) { if (isCup(k)) fixed += CUP_GAP; else if (isCup(k - 1)) fixed += POST_CUP_GAP; else free++; }
    const X = free ? (total - fixed) / free : FD_PER_K, out = [0];
    for (let k = 1; k < n; k++) out.push(out[k - 1] + (isCup(k) ? CUP_GAP : isCup(k - 1) ? POST_CUP_GAP : X));
    return out.map(Math.round);
  })();
  const fdOfSlot = k => k <= 0 ? Math.round(k * FD_PER_K) : k < FDK.length ? FDK[k] : FDK[FDK.length - 1] + Math.round((k - FDK.length + 1) * FD_PER_K);
  function fdAt(S, t) {
    const st0 = slotTime(S, 0), last = SLOTS - 1, stL = slotTime(S, last), avg = (stL - st0) / last;
    const Pp = S.prep && S.prep.season === S.season ? S.prep : null;
    if (t < st0) {
      if (Pp && t >= Pp.t0 && st0 > Pp.t0) return -PRE_FD + PRE_FD * (t - Pp.t0) / (st0 - Pp.t0);
      return -PRE_FD - (Pp ? Pp.t0 - t : st0 - t) / avg * FD_PER_K;
    }
    if (t >= stL) return fdOfSlot(last) + (t - stL) / avg * FD_PER_K;
    let lo = 0, hi = last;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (slotTime(S, m) <= t) lo = m; else hi = m; }
    const a = slotTime(S, lo), b = slotTime(S, hi);
    return fdOfSlot(lo) + (fdOfSlot(hi) - fdOfSlot(lo)) * (b > a ? (t - a) / (b - a) : 0);
  }
  // inverso: instante real (tempo do jogo) em que começa o dia fictício fd
  function tOfFd(S, fd) {
    const st0 = slotTime(S, 0), last = SLOTS - 1, stL = slotTime(S, last), avg = (stL - st0) / last;
    const Pp = S.prep && S.prep.season === S.season ? S.prep : null;
    if (fd < 0) { if (Pp && fd >= -PRE_FD) return Pp.t0 + (fd + PRE_FD) / PRE_FD * (st0 - Pp.t0); return st0 + fd / FD_PER_K * avg; }
    if (fd >= fdOfSlot(last)) return stL + (fd - fdOfSlot(last)) / FD_PER_K * avg;
    let k = 0; while (k < last && fdOfSlot(k + 1) <= fd) k++;
    const a = fdOfSlot(k), b = fdOfSlot(k + 1);
    return slotTime(S, k) + (slotTime(S, k + 1) - slotTime(S, k)) * (b > a ? (fd - a) / (b - a) : 0);
  }
  const fdBetween = (S, t0, t1) => t0 ? clamp(fdAt(S, t1) - fdAt(S, t0), 0, 60) : 6;
  function gameDate(S, k) { const d = new Date(S.season, 0, 25 + fdOfSlot(k)); return { d, txt: `${d.getDate()} ${MES[d.getMonth()]}` }; }
  // janela de transferências: toda semana, de sexta 18h a domingo 18h (horário real)
  // (horário de Brasília fixo, UTC−3, igual no servidor e nos celulares)
  const BRT = 3 * 3600000;
  // janelas por temporada (Normal e Turbo, proporcionais): pré-temporada + 1ª parte ABERTA (até o jogo 16),
  // meio FECHADA (16–31), janela curta de ajustes ABERTA (32–39), reta final FECHADA (40+) e encerramento fechado
  const WIN_K = [16, 32, 40];
  function windowOpen(t, S) {
    if (!S) { const d = new Date(t - BRT), w = d.getUTCDay(), h = d.getUTCHours() + d.getUTCMinutes() / 60; return (w === 5 && h >= 18) || w === 6 || (w === 0 && h < 18); }
    const [b1, b2, b3] = WIN_K.map(k => slotTime(S, k));
    return t < b1 || (t >= b2 && t < b3);
  }
  function windowInfo(S) {
    const t = now(S), [b1, b2, b3] = WIN_K.map(k => slotTime(S, k)), open = windowOpen(t, S);
    const until = open ? (t < b1 ? b1 : b3) : t < b2 ? b2 : null;
    const phase = open ? (t < b1 ? (S.slot === 0 ? 'pré-temporada' : 'janela principal') : 'janela de ajustes') : t < b2 ? 'meio da temporada' : 'reta final';
    return { open, until, left: until != null ? until - t : null, phase, bounds: [b1, b2, b3] };
  }
  // ---------- pré-temporada: 4h (Turbo) ou 16h (Normal) antes do 1º jogo, com 3 amistosos e a janela aberta ----------
  const PRE_H = S => isTurbo(S) ? 4 : 16, PREP_FR = [0.1875, 0.5, 0.8125];
  function planSeason(S, t) {
    const pre = PRE_H(S) * HOUR, t1 = t + pre, H = gridH(S);
    let sod = Wd.startOfDay(t1), g = H.findIndex(h => sod + h * HOUR >= t1);
    if (g < 0) { sod += DAY; g = 0; }
    S.seasonStart = sod; S.slotOff = g;
    S.prep = { season: S.season, t0: t, start: slotTime(S, 0), fr: PREP_FR.map(f => Math.round(t + pre * f)), done: [false, false, false] };
  }
  function prepTick(S, tNow) {
    const Pp = S.prep; if (!Pp || Pp.season !== S.season) return;
    for (let i = 0; i < 3; i++) {
      if (Pp.done[i] || Pp.fr[i] > tNow) continue;
      Pp.done[i] = true;
      if (S.slot > 0) continue;   // a temporada já começou (servidor parado): o amistoso é pulado
      Wd.forDesks(S, tok => {
        if (S.unemployed || !S.club) return;
        const r = C.rng(hash(`prep${S.seed}${S.season}${tok}${i}`));
        const pool = [...S.divA, ...S.divB, ...Wd.FOREIGN()].filter(c => c !== S.club && !Wd.isHuman(S, c));
        friendly(S, pool[Math.floor(r() * pool.length)], i !== 1, Pp.fr[i], i + 1);
      });
    }
  }
  const dayAbs = (S, t) => Math.floor((Wd.startOfDay(sport(S, t)) - baseT(S)) / DAY);

  // ---------- calendário da liga ----------
  function roundRobin(teams, seed) {
    const r = C.rng(seed), t = shuffle(teams, r), n = t.length, rounds = [], arr = t.slice();
    for (let k = 0; k < n - 1; k++) {
      const games = [];
      for (let i = 0; i < n / 2; i++) { const a = arr[i], b = arr[n - 1 - i]; games.push(k % 2 === 0 ? [a, b] : [b, a]); }
      rounds.push(games); arr.splice(1, 0, arr.pop());
    }
    return rounds.concat(rounds.map(g => g.map(([a, b]) => [b, a])));
  }
  const FIX = {};
  function leagueFix(S, div) {
    const list = Wd.divList(S, div);
    const key = `${S.seed}|${S.season}|${div}|${list.join(',')}`;   // seed na chave: o servidor processa várias ligas no mesmo processo
    return FIX[key] || (FIX[key] = roundRobin(list, hash(`${S.seed}|${S.season}|${div}`)));
  }
  const freshRow = () => ({ j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, form: [] });
  function freshTable(clubs) { const t = {}; for (const c of clubs) t[c] = freshRow(); return t; }
  function standings(table) {
    return Object.entries(table).map(([c, t]) => ({ c, ...t, pts: t.v * 3 + t.e, sg: t.gp - t.gc }))
      .sort((a, b) => b.pts - a.pts || b.v - a.v || b.sg - a.sg || b.gp - a.gp || a.c.localeCompare(b.c));
  }

  // ---------- força de clube (pra sorteios e classificação inicial) ----------
  function strength(S, club) {
    const t = aiTeam(S, club, true);
    return SIM.rate(SIM.mkTeam(t, id => info(S, id))).ovr;
  }
  function fragOf(S, id, a) { const s = S.ps[id]; a = a ?? age(S, id); return (C.FRAG[id] || 1) * (1 + Math.max(0, a - 30) * 0.04) * (1 + Math.min(3, (s && s.injN) || 0) * 0.12); }
  function info(S, id) { const s = view(S, id), a = age(S, id); return { ovr: s.ovr, pos: P[id].pos, pos2: s.pos2, cond: s.cond, mor: s.mor, form: s.form, age: a, frag: fragOf(S, id, a) }; }
  // ---------- departamento médico: infiltração ----------
  function importantMatch(S, f) {
    if (!f || f.pending) return null;
    if (f.comp === 'SC' || (f.comp === 'CB' && f.round >= 5) || f.stage === 3) return 'final';
    if (f.ko || f.comp === 'PL') return 'mata-mata';
    if (C.isDerby(f.h, f.a)) return 'clássico';
    if (['LIB', 'SUL', 'CONF', 'CB'].includes(f.comp)) return SEASON_COMP_NAME(f.comp);
    if (REGC.includes(f.comp) && f.ko && f.stage >= 2) return SEASON_COMP_NAME(f.comp);
    if (LEAGUES.includes(f.comp) && f.md >= 30) return 'reta final do campeonato';
    if (LEAGUES.includes(f.comp) && S.comp[f.comp]) {
      const tb = standings(S.comp[f.comp].table), ph = tb.findIndex(r => r.c === f.h) + 1, pa = tb.findIndex(r => r.c === f.a) + 1;
      if (Math.abs(ph - pa) <= 3 && (Math.max(ph, pa) <= 6 || Math.min(ph, pa) >= 15) && f.md >= 8) return 'confronto direto';
    }
    return null;
  }
  const SEASON_COMP_NAME = c => COMP_NAME[c];
  const LEAGUES = ['A', 'B', 'C'];
  function infilInfo(S, id) {
    const s = view(S, id);
    if (!(s.inj > 0)) return { ok: false, why: 'Jogador não está lesionado.' };
    const legacyGrave = /LCA|cruzado|ligamento|joelho|fratura|Aquiles|menisco|concuss/i.test(s.injT || '');
    const I = C.INJURIES[s.injK] || { inf: !legacyGrave && s.inj <= 3, risk: 0.25, n: s.injT };
    const nx = nextFixtureOf(S, S.club), imp = importantMatch(S, nx);
    const tot = s.injTot || s.inj;
    const risk = clamp((I.risk || 0.25) * (0.55 + s.inj / Math.max(1, tot)) * fragOf(S, id), 0.04, 0.9);
    if (!I.inf) return { ok: false, blocked: true, why: 'Esse tipo de lesão não permite infiltração.', risk };
    const nxs = nextFixtureOf(S, S.club);
    if (s.infilUsed != null && s.infilUsed === (s.injAt || 0) && !(nxs && s.infil === S.season * 100 + nxs.k)) return { ok: false, why: 'Já foi infiltrado nesta lesão. Agora é seguir o tratamento.', risk };
    if (s.inj > Math.max(2, Math.ceil(tot * 0.5))) return { ok: false, why: `Ainda cedo: infiltração só na reta final da recuperação (faltando até ${Math.max(2, Math.ceil(tot * 0.5))} jogos).`, risk };
    if (!nx || nx.pending) return { ok: false, why: 'Sem jogo marcado.', risk };
    if (!imp) return { ok: false, why: 'Só vale a pena em jogo importante (mata-mata, clássico, final, torneio continental, confronto direto ou reta final).', risk };
    if (s.infil === S.season * 100 + nx.k) return { ok: false, done: true, why: 'Infiltração já marcada para o próximo jogo.', risk, imp, nx };
    return { ok: true, risk, imp, nx };
  }
  function infiltrate(S, id) {
    const i = infilInfo(S, id); if (!i.ok) return { ok: false, msg: i.why };
    const s = ps(S, id); s.infil = S.season * 100 + i.nx.k; s.infilRisk = i.risk; s.infilUsed = s.injAt || 0;
    EVENTS.news(S, { t: 'injury', title: `${P[id].short} vai jogar infiltrado`, body: `O DM do ${S.club} aplica infiltração para o jogo contra o ${i.nx.h === S.club ? i.nx.a : i.nx.h} (${i.imp}). Risco de agravar: ${Math.round(i.risk * 100)}%.`, ids: [id], clubs: [S.club], desk: S.__me });
    return { ok: true, msg: `${P[id].short} liberado para o próximo jogo (risco ${Math.round(i.risk * 100)}%).` };
  }

  // ---------- escalações ----------
  function aiTac(S, club) {
    const t = S.aiTac && S.aiTac[club];
    if (t) return t;
    const h = hash(club + (S.coaches[club] ? S.coaches[club].name : ''));
    const forms = ['4-3-3', '4-2-3-1', '4-4-2', '4-1-4-1', '4-3-1-2', '3-5-2', '4-2-3-1', '4-3-3'];
    const styles = ['equilibrado', 'equilibrado', 'gegenpress', 'tikitaka', 'contra', 'direto', 'equilibrado', 'contra'];
    return { formation: forms[h % forms.length], style: styles[(h >> 4) % styles.length] };
  }
  function pickXI(S, ids, formation, ignoreCond) {
    const slots = FORMATIONS[formation];
    const used = new Set(), xi = new Array(slots.length).fill(null);
    const rar = { GOL: 0, LD: 1, LE: 1, ADE: 1, ADD: 1, CA: 2, ZAG: 3, VOL: 4, PE: 5, PD: 5, MEI: 6, MC: 7 };
    const order = slots.map((s, i) => i).sort((a, b) => (rar[slots[a][0]] ?? 8) - (rar[slots[b][0]] ?? 8));
    for (const i of order) {
      let best = null, bv = -1;
      for (const id of ids) {
        if (used.has(id)) continue;
        const s = view(S, id);
        // poupa pelo rendimento esperado, com um pouco de cautela a mais (cansaço acumula e aumenta o risco de lesão)
        const cp = ignoreCond ? 1 : Math.pow(C.condF(s.cond), 1.6) * (s.cond < 60 ? 0.93 : 1);
        const v = s.ovr * Wd.fitOf(S, id, slots[i][0]) * cp;
        if (v > bv) { bv = v; best = id; }
      }
      if (best != null) { xi[i] = best; used.add(best); }
    }
    return xi;
  }
  function benchOf(S, ids, xi) {
    const inXI = new Set(xi);
    const rest = ids.filter(id => !inXI.has(id)).sort((a, b) => view(S, b).ovr - view(S, a).ovr);
    const gk = rest.find(id => P[id].pos === 'GOL');
    const out = rest.filter(id => id !== gk).slice(0, 8);
    if (gk) out.push(gk);
    return out;
  }
  function availIds(S, club) { return squad(S, club).filter(id => avail(S, id)); }
  function lineupAvail(S, id) { const nx = nextFixtureOf(S, S.club); return Wd.availAt(S, id, nx && !nx.pending ? nx.k : (S.slot || 0)); }
  function aiTeam(S, club, ignoreCond) {
    const t = aiTac(S, club);
    const ids = ignoreCond ? squad(S, club) : availIds(S, club);
    const xi = pickXI(S, ids, t.formation, ignoreCond);
    return { club, formation: t.formation, style: t.style, xi, bench: benchOf(S, ids, xi), triggers: { losing60: 'pressao', lead2: hash(club) % 3 === 0 ? 'retranca' : '' } };
  }
  function userTeam(S) {
    const T = S.tactics, ids = squad(S, S.club).filter(id => S._nt != null ? avail(S, id) : lineupAvail(S, id)), okSet = new Set(ids);
    if (!FORMATIONS[T.formation]) T.formation = Object.keys(FORMATIONS)[0];   // v163: tática corrompida não trava a escalação
    if (!T.triggers || typeof T.triggers !== 'object') T.triggers = {};
    const slots = FORMATIONS[T.formation];
    let xi = (T.xi || []).slice(0, slots.length);
    while (xi.length < slots.length) xi.push(null);
    const seen = new Set();
    xi = xi.map(id => id != null && okSet.has(id) && !seen.has(id) && seen.add(id) ? id : null);
    if (xi.every(x => x == null)) xi = pickXI(S, ids, T.formation);   // nunca escalou: poupa os cansados como a IA
    else if (xi.some(x => x == null)) {
      xi.forEach((id, i) => { if (id == null) { const best = bestFor(S, ids.filter(x => !xi.includes(x)), slots[i][0]); xi[i] = best; } });
    }
    const inXI = new Set(xi);
    const bench = Array.isArray(T.bench) ? T.bench.filter(id => okSet.has(id) && !inXI.has(id)).slice(0, 9) : benchOf(S, ids, xi);
    // (v155: completar o banco só na escalação automática; quem tirou jogador do banco de propósito continua com menos)
    return { club: S.club, formation: T.formation, style: T.style, xi, bench, triggers: T.triggers, pk: T.pk != null ? T.pk : null };
  }
  function bestFor(S, ids, slot) {
    let best = null, bv = -1;
    for (const id of ids) { const s = view(S, id); const v = s.ovr * Wd.fitOf(S, id, slot) * (s.cond >= 70 ? 1 : 0.9); if (v > bv) { bv = v; best = id; } }
    return best;
  }
  const teamFor = (S, club) => Wd.isHuman(S, club) ? Wd.asClub(S, club, () => userTeam(S)) : aiTeam(S, club);

  // ---------- competições ----------
  function setupSeason(S) {
    if (!S.prep || S.prep.season !== S.season) planSeason(S, now(S));
    S.slot = S.firstSlot || 0; S.firstSlot = 0; S.played = {}; Wd.numbersTick(S);
    S.comp = { A: { table: freshTable(S.divA) }, B: { table: freshTable(S.divB) } };
    if (S.divC && S.divC.length) S.comp.C = { table: freshTable(S.divC) };
    try { const m = {}; for (const c of [...S.divA, ...S.divB, ...(S.divC || [])]) for (const id of squad(S, c)) { if (!P[id]) continue; let a = 99; try { a = age(S, id); } catch (e) {} if (a <= 22) m[id] = (S.ps[id] && S.ps[id].ovr) || P[id].ovr0 || 0; } S.ovrS = { s: S.season, m }; } catch (e) {}   // v270: base da Revelação do Ano
    // qualificação: temporada anterior ou força dos elencos no 1º ano
    if (!S.qual) {
      const ranked = S.divA.slice().sort((a, b) => strength(S, b) - strength(S, a));
      S.qual = { LIB: ranked.slice(0, 4), PL: ranked.slice(4, 8), SUL: ranked.slice(8, 12), CONF: ranked.slice(12, 16), plBR: 1 };   // v249
    }
    // estrangeiros por força
    const foreign = Wd.FOREIGN().map(c => ({ c, s: strength(S, c) })).sort((a, b) => b.s - a.s).map(x => x.c);
    const genF = Object.keys(C.CLUBS_F_GEN);
    const qF = (S.qualF || []).filter(c => foreign.includes(c));   // v209: campeão estrangeiro da Libertadores/Sul-Americana
    const PLq = S.qual.PL || [], nBR = S.qual.plBR ? Math.floor(PLq.length / 2) : 0, plRest = S.qual.plBR ? PLq.slice(nBR, PLq.length - nBR) : PLq;   // v249: pré entre brasileiros (1º x 4º, 2º x 3º)
    const plOpp = shuffle(genF.filter(c => !foreign.slice(0, 8).includes(c) && !qF.includes(c)), R(`plopp${S.seed}${S.season}`)).slice(0, Math.max(2, plRest.length));
    const pool = [...qF, ...foreign.filter(c => !plOpp.includes(c) && !qF.includes(c))];
    const sc = S.nextSuper || S.divA.slice().sort((a, b) => strength(S, b) - strength(S, a)).slice(0, 2);
    S.comp.SC = { teams: sc, champ: null };
    S.comp.PL = { ties: [...Array.from({ length: nBR }, (_, i) => ({ br: PLq[i], f: PLq[PLq.length - 1 - i], l1: null, l2: null, win: null, brv: 1 })), ...plRest.map((br, i) => ({ br, f: plOpp[i], l1: null, l2: null, win: null }))] };
    S.comp.foreign = { LIB: pool.slice(0, 12), SUL: pool.slice(12, 24), CONF: pool.slice(24, 36) };   // v249: 12 por copa (Conferência agora tem 4 brasileiros)
    // Copa do Brasil: Série A + 12 melhores da Série B
    const bBest = S.divB.slice().sort((a, b) => strength(S, b) - strength(S, a)).slice(0, 12);
    const cbTeams = shuffle([...S.divA, ...bBest], R(`cb${S.seed}${S.season}`));
    S.comp.CB = { teams: cbTeams, rounds: [pairUp(cbTeams, R(`cbr1${S.seed}${S.season}`))], res: [], stage: {} };
    setObjectives(S);
    Wd.forDesks(S, () => { S.fin = S.fin || {}; S.seasonLog = { prizes: {} }; balanceWallet(S); if (!S.unemployed && S.club) S.fin.cash0 = S.cash[S.club] || 0; });   // v184: cash0 = base do balanço
  }
  // ---------- objetivo da temporada (pelo valor do elenco) e diretoria ----------
  // ---------- objetivo premiado: 5 grupos cortados onde o valor do elenco dá um salto ----------
  const GORD = ['eli', 'top', 'sul', 'lut', 'aza'];
  const GNAME = { eli: 'Elite', top: 'Topo', sul: 'Sul', lut: 'Luta', aza: 'Azarão' };
  const META = {
    A: { eli: { max: 3, label: 'Top 3: brigar pelo título' }, top: { max: 8, label: 'Top 8: vaga na Libertadores' }, sul: { max: 12, label: 'Top 12: vaga na Sul-Americana' }, lut: { max: 16, label: 'Não cair' }, aza: { max: 16, pts: 40, label: 'Somar 40 pontos' } },
    B: { eli: { max: 4, label: 'Subir pra Série A' }, top: { max: 8, label: 'Top 8 da Série B' }, sul: { max: 12, label: 'Top 12 da Série B' }, lut: { max: 16, label: 'Não cair' }, aza: { max: 16, pts: 38, label: 'Somar 38 pontos' } },
    C: { eli: { max: 4, label: 'Subir pra Série B' }, top: { max: 8, label: 'Top 8 da Série C' }, sul: { max: 12, label: 'Top 12 da Série C' }, lut: { max: 16, label: 'Não cair pra Série D' }, aza: { max: 16, pts: 36, label: 'Somar 36 pontos' } },
  };
  // prêmios por grupo: a cada X pts acima do esperado, fuga do Z4 [★, 💎], fechamento [★, 💎], boia
  // v252 (teste): parafusos dos pilares. Clube de meta alta (eli = título, top = G4/G6) é cobrado pela camisa, não pelo elenco.
  const BIG = { eli: 1.5, top: 1.25 }, bigOf = S => { const o = S.obj && S.obj[S.club]; const g = o && (o.bg || o.g); return BIG[g] ? g : null; };
  const FANS_HOME = { eli: 48, top: 51 };   // patamar pra onde a torcida volta sozinha
  const OPR = { eli: { thr: 5, z4: [1, 0], fin: [3, 0] }, top: { thr: 4, z4: [1, 0], fin: [3, 0] }, sul: { thr: 3, z4: [2, 0], fin: [5, 0] }, lut: { thr: 2, z4: [2, 1], fin: [5, 1], boia: 1 }, aza: { thr: 2, z4: [2, 1], fin: [6, 2], boia: 1 } };
  const ET_EVERY = 5, BOIA_MD = 25, FRONT = 0.08;
  // quebras naturais (Jenks) em log do valor: minimiza a variação dentro de cada grupo
  function valueBreaks(vals, k) {
    const n = vals.length; k = Math.min(k, n); const v = vals.map(x => Math.log(Math.max(1, x)));
    const ps = [0], ps2 = [0]; v.forEach((x, i) => { ps.push(ps[i] + x); ps2.push(ps2[i] + x * x); });
    const sse = (i, j) => { const m = j - i, s1 = ps[j] - ps[i]; return ps2[j] - ps2[i] - s1 * s1 / m; };
    const dp = Array.from({ length: k + 1 }, () => Array(n + 1).fill(Infinity)), bk = Array.from({ length: k + 1 }, () => Array(n + 1).fill(0));
    dp[0][0] = 0;
    for (let g = 1; g <= k; g++) for (let j = g; j <= n; j++) for (let i = g - 1; i < j; i++) { const c = dp[g - 1][i] + sse(i, j); if (c < dp[g][j]) { dp[g][j] = c; bk[g][j] = i; } }
    const cuts = []; let j = n; for (let g = k; g > 0; g--) { cuts.unshift(j); j = bk[g][j]; }
    return cuts;   // fim (exclusivo) de cada grupo
  }
  function groupObjectives(S, list, div) {
    const arr = list.map(c => ({ c, v: (S.obj && S.obj[c] && S.obj[c].value) || Wd.squadValue(S, c) })).sort((a, b) => b.v - a.v);
    const cuts = valueBreaks(arr.map(x => x.v), GORD.length), out = {};
    let st = 0; cuts.forEach((end, gi) => { for (let i = st; i < end; i++) arr[i].g = GORD[gi]; st = end; });
    arr.forEach((x, i) => {
      // zona de fronteira: até 8% do primeiro clube do grupo de baixo -> recebe os prêmios de baixo (a meta não muda)
      const gi = GORD.indexOf(x.g), nxt = arr.find(y => GORD.indexOf(y.g) === gi + 1);
      const bg = nxt && x.v <= nxt.v * (1 + FRONT) ? nxt.g : x.g;
      out[x.c] = { ...META[div][x.g], div, rank: i + 1, value: x.v, g: x.g, bg };
    });
    return out;
  }
  function setObjectives(S) {
    S.obj = {};
    Object.assign(S.obj, groupObjectives(S, S.divA, 'A'), groupObjectives(S, S.divB, 'B'));
    if (S.divC && S.divC.length) Object.assign(S.obj, groupObjectives(S, S.divC, 'C'));
    S.objV = 2;
    if (S.board == null) S.board = 60;
  }
  // ligas que já estavam rodando: refaz os grupos com o valor registrado no início da temporada
  function migrateObjectives(S) {
    if (!S.obj || S.objV === 2 || !S.divA || !S.divB) return;
    const keep = S.obj; S.obj = {};
    Object.assign(S.obj, groupObjectives({ ...S, obj: keep }, S.divA, 'A'), groupObjectives({ ...S, obj: keep }, S.divB, 'B'));
    S.objV = 2;
    Wd.forDesks(S, () => { const o = S.obj[S.club]; if (!o || S.unemployed) return; EVENTS.news(S, { t: 'club', title: `Novo objetivo da diretoria: ${o.label}`, body: `O ${S.club} está no grupo ${GNAME[o.g]} (${o.rank}º maior elenco da Série ${o.div}). Cumprir a meta agora rende estrelas ao longo da temporada: veja em Objetivo premiado, no início.`, clubs: [S.club], front: 85, desk: S.__me }); });
  }
  const objMet = (o, pos, pts) => pos <= o.max || (o.pts != null && pts >= o.pts);
  // estado do objetivo premiado (por treinador, zera a cada temporada)
  function oprState(S) {
    if (!S.opr || S.opr.s !== S.season) S.opr = { s: S.season, et: 0, ok: [], dk: {}, paid: 0, zin: 0, zout: 0, fug: 0, fugD: 0, boia: 0, bchk: 0, last: 0 };
    return S.opr;
  }
  const oprAcc = R => Object.values(R.dk || {}).reduce((a, b) => a + b, 0);
  // situação agora: dentro da meta? quanto falta? (usado nas etapas e na tela)
  function oprStatus(S, club) {
    const o = S.obj && S.obj[club]; if (!o || !o.g || !S.comp || !S.comp[o.div]) return null;
    const tb = standings(S.comp[o.div].table), N = tb.length, row = tb.find(r => r.c === club); if (!row) return null;
    const pos = tb.indexOf(row) + 1, j = row.v + row.e + row.d, tot = (N - 1) * 2;
    const line = tb[o.max - 1], out1 = tb[o.max];   // último dentro da meta / primeiro fora
    let gap = pos <= o.max ? row.pts - (out1 ? out1.pts : 0) : (line ? line.pts : 0) - row.pts;   // dentro: folga; fora: quanto falta
    let ok = pos <= o.max, near = !ok && gap <= 3, pace = null;
    if (o.pts != null) { pace = j ? Math.round(row.pts * tot / j) : 0; if (!ok && j && pace >= o.pts - 3) { ok = pace >= o.pts; near = !ok; } }
    const safe = tb[N - 5], inZ = pos > N - 4, zgap = inZ && safe ? safe.pts - row.pts : 0;
    return { o, pos, j, tot, pts: row.pts, gap, ok, near, pace, inZ, zgap, N, P: OPR[o.bg || o.g] };
  }
  // roda depois de cada rodada do campeonato, para cada treinador
  function oprTick(S) {
    if (S.unemployed || !S.club) return;
    const st = oprStatus(S, S.club); if (!st) return;
    const R = oprState(S), { o, j, P } = st;
    if (!j || j === R.last) return;
    R.last = j;
    const my = x => EVENTS.news(S, { t: 'club', clubs: [S.club], desk: S.__me, ...x });
    // etapa (a cada 5 rodadas): dentro da meta ou a até 3 pts
    if (j % ET_EVERY === 0 && j / ET_EVERY > R.et) {
      R.et = j / ET_EVERY;
      if (st.ok || st.near) { R.ok.push(1); award(S, 1, 0, `etapa ${R.et} do objetivo cumprida (${o.label})`); }
      else { R.ok.push(0); my({ title: `Etapa ${R.et} do objetivo ficou pra trás`, body: `${S.club} em ${st.pos}º${o.pts != null ? `, no ritmo de ${st.pace} pontos` : ''}. Faltaram ${Math.max(1, st.gap - 3)} ponto(s) pra estrela. Próxima etapa na rodada ${j + ET_EVERY}.`, front: 45 }); }
    } else if (j % ET_EVERY === ET_EVERY - 1 && j + 1 < st.tot) {
      // aviso na véspera da etapa
      my({ title: st.ok ? `Etapa do objetivo na próxima rodada: ${S.club} dentro da meta` : st.near ? `Etapa do objetivo na próxima rodada: ${S.club} por um fio` : `Etapa do objetivo na próxima rodada: ${S.club} fora da meta`,
        body: st.ok ? `Mantendo a posição, vem +1 estrela.` : `Hoje em ${st.pos}º. ${st.near ? 'Está a até 3 pontos da meta: ainda vale a estrela.' : `Faltam ${st.gap - 3} ponto(s) pra entrar na faixa da estrela.`}`, front: 30 });
    }
    // acima do esperado
    const acc = oprAcc(R);
    while (acc - R.paid * P.thr >= P.thr) { R.paid++; award(S, 1, 0, `${R.paid * P.thr} pontos acima do esperado na temporada`); }
    // fuga do Z4: 2 rodadas dentro, depois 2 fora
    if (st.inZ) { R.zin = R.zout > 0 ? 1 : R.zin + 1; R.zout = 0; }
    else if (R.zin >= 2) {
      R.zout++;
      if (R.zout >= 2) {
        if (R.fug < 2) { R.fug++; const d = P.z4[1] && !R.fugD ? 1 : 0; if (d) R.fugD = 1; award(S, P.z4[0], d, 'fuga da zona de rebaixamento'); }
        R.zin = 0; R.zout = 0;
      }
    } else R.zin = 0;
    // boia (rodada 25): Luta/Azarão no Z4 com chance real
    if (P.boia && !R.bchk && j >= BOIA_MD) {
      R.bchk = 1;
      if (st.inZ && st.zgap <= 6 && !R.boia) { R.boia = 1; award(S, 0, 1, 'boia da diretoria: aposta na permanência'); my({ title: `Diretoria aposta tudo na permanência do ${S.club}`, body: `Na zona, a ${st.zgap} ponto(s) de sair. ${MARKET.isOuro(S) ? "O Ouro é pra trazer um reforço do Ouro Especial" : "O diamante é pra trazer um craque"} para a reta final.`, front: 90 }); }
    }
  }
  // ---------- três pilares: diretoria, torcida e grupo; sustentação e demissão ----------
  const fireMode = S => 'real';   // v142: todas as ligas no modo Realista (ultimato não cumprido = demissão)
  function plog(S, p, v, why) { if (!v) return; S.plog = [...(S.plog || []), { d: S.lastDay || 0, p, v: Math.round(v), why }].slice(-24); }
  function fansAdd(S, v, why) { S.fans = clamp((S.fans ?? 55) + v, 0, 100); plog(S, 'T', v, why); }
  function groupIdx(S) {
    const ids = squad(S, S.club).sort((a, b) => view(S, b).ovr - view(S, a).ovr).slice(0, 16);
    if (!ids.length) return 60;
    return Math.round(ids.reduce((a, id) => a + (view(S, id).mor ?? 60), 0) / ids.length);
  }
  // v201: faixa do DNA (só soma) por cima da diretoria/torcida/grupo de verdade; I usa o valor com a faixa
  function pillars(S) {
    const D0 = Math.round(S.board ?? 60), T0 = Math.round(S.fans ?? 55), G0 = groupIdx(S);
    const B = S.dnaB && S.dnaB.c === S.club && !S.unemployed ? S.dnaB : null, b = p => B ? Math.round(B[p] || 0) : 0;
    const D = Math.min(100, D0 + b('D')), T = Math.min(100, T0 + b('T')), G = Math.min(100, G0 + b('G'));
    return { D, T, G, I: Math.round(D * 0.6 + T * 0.4),   // v252: grupo saiu da nota (vale como trava: <20 perde o vestiário, ≥70 dá 2ª chance)
      D0, T0, G0, bD: D - D0, bT: T - T0, bG: G - G0, k: B ? B.k : (C.dnaOf ? C.dnaOf(S.club) : null), k2: C.dna2Of ? C.dna2Of(S.club) : null, sD: B ? Math.round(B.sD || 0) : 0, sT: B ? Math.round(B.sT || 0) : 0, sG: B ? Math.round(B.sG || 0) : 0, home: B ? DNA.home[B.k] : null };
  }
  // ---------- v201: DNA do clube nos pilares ----------
  // cada DNA tem um pilar da casa (teto maior). Tetos calibrados pra o máximo na sustentação ser igual (+10) em todo DNA.
  // a faixa cai 3% por rodada (precisa continuar entregando) e metade passa pra temporada seguinte.
  // tax: a régua do cargo sobe um pouco em clube com DNA (sem isso, só somar deixaria o jogo mais fácil). Calibrado em sim_dna.js.
  const DNA = { home: { form: 'G', proj: 'D', raca: 'T', camisa: 'D' }, cap: 8, hcap: { D: 12, T: 16, G: 16 }, decay: 0.97, tax: 0, w2: 0.5,   // v252: tax 0 — com os pilares apertados, a faixa do DNA é o fôlego
   
    form: 0.12, proj: 1.5, projStep: 0.015, raca: { hw: 1.4, hd: 0.4, dw: 2.8, dd: 0.8 }, camisa: { base: 0.25, per: 0.08, acc: 0.7, ko: 1, title: 3 } };
  function dnaState(S) {
    if (S.unemployed || !S.club) return null;
    const k = C.dnaOf ? C.dnaOf(S.club) : null; if (!k) return null;
    let B = S.dnaB;
    if (!B || B.c !== S.club) B = S.dnaB = { c: S.club, k, s: S.season, D: 0, T: 0, G: 0, ym: null, cb: null, tot: 0 };
    if (B.s !== S.season) { B.s = S.season; for (const p of ['D', 'T', 'G']) { B[p] = Math.round(B[p] * 5) / 10; if (B['s' + p]) B['s' + p] = Math.round(B['s' + p] * 5) / 10; } B.ym = null; B.cb = null; B.acc = null; B.tot = 0; }
    B.k = k; B.k2 = C.dna2Of ? C.dna2Of(S.club) : null; return B;   // v251: k2 = secundário (Opção B), vale DNA.w2
  }
  const dnaW = (B, x) => x === B.k ? 1 : x === B.k2 ? DNA.w2 : 0;
  function dnaGive(S, u, why, sec) {   // v254: sec = veio do secundário (guarda a parte em sD/sT/sG pra pintar na cor dele)
    const B = dnaState(S); if (!B || !(u > 0)) return 0;
    const h = DNA.home[B.k]; let got = 0;
    for (const p of ['D', 'T', 'G']) { const cap = p === h ? DNA.hcap[p] : DNA.cap, v = Math.min(cap, B[p] + u * cap / 16); got += v - B[p]; if (sec) B['s' + p] = Math.round(((B['s' + p] || 0) + v - B[p]) * 100) / 100; B[p] = Math.round(v * 100) / 100; }
    B.tot = Math.round((B.tot + u) * 100) / 100;
    if (why) B.last = { why, d: S.lastDay || 0 };
    return got;
  }
  // depois de cada rodada do campeonato (dentro do jobTick)
  function dnaRound(S, st) {
    const B = dnaState(S); if (!B) return;
    for (const p of ['D', 'T', 'G']) { B[p] = Math.round(B[p] * DNA.decay * 100) / 100; if (B['s' + p]) B['s' + p] = Math.min(B[p], Math.round(B['s' + p] * DNA.decay * 100) / 100); }
    if (dnaW(B, 'form')) { const w = dnaW(B, 'form');
      const ym = squad(S, S.club).filter(id => Wd.age(S, id) <= 23).reduce((a, id) => a + ((ps(S, id).st || {}).min || 0), 0);
      if (B.ym != null && ym > B.ym) { const n = (ym - B.ym) / 90; dnaGive(S, n * DNA.form * w, `${Math.round(ym - B.ym)} minutos de jovens na rodada`, w < 1); }
      B.ym = ym;
    }
    if (dnaW(B, 'proj')) { const w = dnaW(B, 'proj');
      const sv = Math.max(1, Wd.squadValue(S, S.club)), c0 = S.fin && S.fin.cash0 != null ? S.fin.cash0 : null;
      if (c0 != null) {
        const r = ((S.cash[S.club] || 0) - c0) / sv;
        if (B.cb == null) B.cb = r;
        else if (r >= B.cb + DNA.projStep) { const n = Math.floor((r - B.cb) / DNA.projStep); B.cb += n * DNA.projStep; dnaGive(S, n * DNA.proj * w, 'caixa do clube cresceu', w < 1); }
      }
    }
    if (dnaW(B, 'camisa')) { const w = dnaW(B, 'camisa');
      // rende acima do esperado pro elenco (mesma conta das estrelas) e/ou está dentro da meta
      const R = S.opr && S.opr.s === S.season ? S.opr : null, acc = R ? oprAcc(R) : null;
      if (acc != null) { if (B.acc != null && acc > B.acc) dnaGive(S, (acc - B.acc) * DNA.camisa.acc * w, 'pontos acima do esperado', w < 1); B.acc = acc; }
      if (C.DNA_MODE !== 'B' && st && st.j >= 5) { const m = st.o.max - st.pos; if (m >= 0) dnaGive(S, (DNA.camisa.base + DNA.camisa.per * Math.min(m, 5)) * w, `${st.pos}º, dentro da meta`, w < 1); }
    }
  }
  // depois de cada jogo oficial (junto da torcida)
  function dnaMatch(S, f, won, lost, home, derby) {
    const B = dnaState(S); if (!B) return;
    if (dnaW(B, 'raca')) { const w = dnaW(B, 'raca');
      const R = DNA.raca, u = derby ? (won ? R.dw : !lost ? R.dd : 0) : home && !f.neutral ? (won ? R.hw : !lost ? R.hd : 0) : 0;
      if (u) dnaGive(S, u * w, derby ? (won ? 'vitória no clássico' : 'empate no clássico') : won ? 'vitória em casa' : 'empate em casa', w < 1);
    }
    if (dnaW(B, 'camisa') && !LEAGUES.includes(f.comp) && won) { const w = dnaW(B, 'camisa');
      const fin = f.final || f.stage === 3 || f.comp === 'SC';
      if (f.ko || fin) dnaGive(S, (fin ? DNA.camisa.title : DNA.camisa.ko) * w, fin ? 'decisão vencida' : 'fase de copa vencida', w < 1);
    }
  }
  // torcida reage a cada jogo oficial do clube do treinador
  function fansAfter(S, f, res, club) {
    if (S.club !== club || f.comp === 'AMI') return;
    const home = f.h === club, my = home ? res.gh : res.ga, ot = home ? res.ga : res.gh, opp = home ? f.a : f.h;
    let won = my > ot, lost = my < ot;
    if (res.pens && my === ot) { won = home ? res.pens[0] > res.pens[1] : res.pens[1] > res.pens[0]; lost = !won; }
    const derby = C.isDerby(club, opp), ko = !!f.ko, fin = f.final || f.stage === 3 || f.comp === 'SC';
    let v = won ? 2.5 : lost ? -2.5 : (home ? -0.5 : 0.5);
    if (derby) v *= 1.6;
    if (ko && lost) v -= 3; if (fin && won) v += 5;
    if (Math.abs(my - ot) >= 3) v += won ? 2 : -2;
    const big = bigOf(S); if (big && v < 0) v *= 1.3;   // v252: torcida de clube grande sente mais a derrota
    if (big && ko && lost && Math.abs(my - ot) >= 3) { v -= 3; S.board = clamp((S.board ?? 60) - 4, 0, 100); plog(S, 'D', -4, `goleada sofrida no mata-mata contra o ${opp}`); }
    const T0 = S.fans ?? 55; v += ((FANS_HOME[big] ?? 55) - T0) * 0.08;   // volta devagar pro normal (clube grande: patamar mais baixo)
    const g = res.gate; if (home && g) { if (g.occ >= 0.97) v += 1; else if (['caro', 'abusivo'].includes(g.pm) && g.occ < 0.6) v -= 2; }
    const why = `${won ? 'vitória' : lost ? 'derrota' : 'empate'}${derby ? ' no clássico' : ''} contra o ${opp}`;
    fansAdd(S, Math.round(v * 10) / 10, why);
    try { dnaMatch(S, f, won, lost, home, derby); } catch (e) {}
  }
  // avaliação do cargo depois de cada rodada do campeonato
  function jobTick(S) {
    if (S.unemployed || !S.club) return;
    const mode = fireMode(S), st = oprStatus(S, S.club); if (!st) return;
    if (S.fans == null) S.fans = 55;
    let J = S.job;
    if (!J || J.club !== S.club || J.s !== S.season) J = S.job = { club: S.club, s: S.season, h0: J && J.club === S.club ? J.h0 : st.j, st: 'ok', ults: [], last: 0 };
    if (!J.v2) { J.v2 = 1; if (st.j > 0) J.h0 = Math.max(J.h0 ?? 0, st.j - 5); }   // v282: na chegada do DNA/pilares novos no meio da temporada, 3 rodadas de proteção (ninguém leva ultimato pela troca de regra)
    if (st.j === J.last) return; J.last = st.j;
    try { dnaRound(S, st); } catch (e) {}
    const Pl = pillars(S), my = x => EVENTS.news(S, { clubs: [S.club], desk: S.__me, ...x });
    // salário atrasado e torcida em fúria pesam toda rodada
    try { const ar = arrearsOf(S, S.club); if (ar && ar.days > 0) fansAdd(S, -1, 'salários atrasados'); } catch (e) {}
    if (Pl.T0 < 15) { S.board = clamp((S.board ?? 60) - 1, 0, 100); plog(S, 'D', -1, 'pressão da torcida'); if (!J.prot || st.j - J.prot >= 5) { J.prot = st.j; my({ t: 'club', title: `Protesto no CT do ${S.club}`, body: 'Torcedores cobram o técnico e a diretoria. A pressão chega ao presidente.', front: 80 }); } }
    if (mode === 'off') { J.st = 'ok'; return; }
    const turn = st.j <= Math.floor(st.tot / 2) ? 1 : 2;
    // ultimato em andamento
    if (J.ult) {
      const U = J.ult, got = st.pts - U.p0, played = st.j - U.j0;
      if (got >= U.need) {
        J.ult = null; J.st = 'ok'; S.board = clamp((S.board ?? 60) + 8, 0, 100); fansAdd(S, 5, 'ultimato cumprido'); plog(S, 'D', 8, 'ultimato cumprido');
        my({ t: 'club', title: `${S.manager} cumpre o ultimato e segue no ${S.club}`, body: `${got} pontos em ${played} jogo(s). A diretoria renova a confiança.`, front: 85 });
      } else if (played >= U.games) {
        J.ult = null;
        if (Pl.G0 >= 70 && !U.second) {
          J.ult = { j0: st.j, p0: st.pts, games: 3, need: U.need, second: true }; J.st = 'ult';
          my({ t: 'club', title: `O grupo fecha com ${S.manager}`, body: `Os jogadores pediram mais uma chance à diretoria. Novo prazo: ${U.need} pontos em 3 jogos.`, front: 90 });
        } else if (mode === 'real') { J.st = 'fired'; EVENTS.fire(S, `Ultimato não cumprido: ${got} de ${U.need} pontos.`); return; }
        else {
          const stars = Math.min(2, S.stars || 0), cut = Math.round(Wd.squadValue(S, S.club) * 0.04);
          S.stars = (S.stars || 0) - stars; S.cash[S.club] -= cut; S.board = 35; J.st = 'ok';
          my({ t: 'club', title: `Diretoria pune ${S.manager} após ultimato`, body: `Faltaram pontos (${got} de ${U.need}). ${stars ? `−${stars} estrela(s) e ` : ''}corte de T$ ${C.fmt(cut)} na verba. O técnico segue, sob desconfiança.`, front: 90 });
        }
      }
      return;
    }
    // protegido: começo de trabalho, dentro (ou perto) da meta, ou rendendo o esperado pro elenco que tem
    const R0 = S.opr && S.opr.s === S.season ? S.opr : null;
    const big = bigOf(S);   // v252: clube grande só fica protegido dentro da meta ou nas 8 primeiras rodadas
    const protectedNow = st.j - J.h0 < 8 || st.ok || (!big && (st.near || (R0 && oprAcc(R0) >= -2)));
    const prev = J.st;
    const tax = Pl.k ? DNA.tax : 0;
    if (Pl.I - tax >= 55 || protectedNow) J.st = 'ok';
    else if (Pl.I - tax >= 40 && Pl.G0 >= 20) J.st = 'risk';
    else if (!J.ults.includes(turn)) {
      const g = st.o.bg || st.o.g, need = ({ eli: 6, top: 6, sul: 5, lut: 4, aza: 4 }[g] || 5) + (Pl.I - tax < 30 ? 1 : 0);
      J.ult = { j0: st.j, p0: st.pts, games: 3, need }; J.ults.push(turn); J.st = 'ult';
      my({ t: 'club', title: `Ultimato: ${S.manager} tem 3 jogos no ${S.club}`, body: `${Pl.G0 < 20 ? 'O técnico perdeu o vestiário. ' : ''}A diretoria exige ${need} pontos nos próximos 3 jogos do campeonato.`, front: 95 });
      return;
    } else J.st = 'risk';
    if (J.st === 'risk' && prev !== 'risk') my({ t: 'club', title: `Cargo de ${S.manager} balança no ${S.club}`, body: `Diretoria ${Pl.D}, torcida ${Pl.T}, grupo ${Pl.G}. Resultados precisam aparecer.`, front: 75 });
  }
  // pontos esperados antes do jogo (campeonato), para medir quem rende acima do previsto
  function oprExpect(S, f, H, A, k) {
    if (!(f.comp === 'A' || f.comp === 'B')) return null;
    if (!Wd.isHuman(S, f.h) && !Wd.isHuman(S, f.a)) return null;
    try { const p = SIM.preview(H, A, id => info(S, id), !!f.neutral); return { h: 3 * p.pw + p.pd, a: 3 * p.pl + p.pd }; } catch (e) { return null; }
  }
  function oprAfter(S, f, res, ex, k) {
    if (!ex) return;
    for (const [c, my, ot, e] of [[f.h, res.gh, res.ga, ex.h], [f.a, res.ga, res.gh, ex.a]]) if (Wd.isHuman(S, c)) Wd.asClub(S, c, () => {
      if (S.club !== c) return;
      const R = oprState(S), pts = my > ot ? 3 : my === ot ? 1 : 0; R.dk[k] = Math.round((pts - e) * 100) / 100;
    });
  }
  // equilíbrio: quem briga embaixo ganha moedas extras pra usar nos pacotes
  // Série A: pelo grupo do elenco. Série B e C: sempre abaixo do pior da A (mais estrelas e diamantes; a C ainda mais)
  function balTier(o) {
    if (!o) return 'sul';
    const grp = o.bg || o.g;
    if (o.div === 'B' || o.div === 'C') { const n = !grp ? (o.max <= 4 ? 1 : o.max <= 8 ? 2 : 3) : grp === 'eli' || grp === 'top' ? 1 : grp === 'aza' ? 3 : 2; return o.div + n; }
    if (grp) return { eli: 'lib', top: 'lib', sul: 'sul', lut: 'mid', aza: 'rel' }[grp];
    return o.max <= 6 ? 'lib' : o.max <= 11 ? 'sul' : o.max <= 12 ? 'mid' : 'rel';
  }
  const BAL = { rel: { st: 3, di: 1, t: 'luta contra o rebaixamento' }, mid: { st: 0, di: 1, t: 'meio de tabela' }, sul: { st: 0, di: 0, t: 'briga por Sul-Americana' }, lib: { st: 0, di: -1, t: 'briga por Libertadores/título' },
    B1: { st: 4, di: 1, t: 'Série B, briga pelo acesso' }, B2: { st: 5, di: 2, t: 'Série B, meio de tabela' }, B3: { st: 6, di: 2, t: 'Série B, um dos menores elencos' },
    C1: { st: 6, di: 2, t: 'Série C, briga pelo acesso' }, C2: { st: 7, di: 2, t: 'Série C, meio de tabela' }, C3: { st: 8, di: 3, t: 'Série C, um dos menores elencos' } };
  const balGive = (b, first) => ({ st: b.st, di: first ? b.di : Math.max(0, b.di) });
  function balanceWallet(S) {
    S.balGiven = S.balGiven || {};
    if (S.balGiven[S.season] || S.unemployed) return;
    const tier = balTier(S.obj[S.club]), b = BAL[tier], first = !Object.keys(S.balGiven).length;
    S.balGiven[S.season] = tier; S.balFix = 107;
    const { di, st } = balGive(b, first);
    S.stars = (S.stars || 0) + st; S.dias = Math.max(0, (S.dias || 0) + di); wInAdd(S, st, di);
    if (!st && !di) return;
    const gw = MARKET.isOuro(S) ? 'Ouro' : `diamante${di > 1 ? 's' : ''}`;
    const parts = di < 0 ? 'começa sem o diamante inicial' : 'ganha ' + [st ? `${st} estrelas` : '', di > 0 ? `${di} ${gw}` : ''].filter(Boolean).join(' e ');
    EVENTS.news(S, { t: 'club', title: `Equilíbrio da liga: ${S.club} ${parts}`, body: `Pelo tamanho do elenco (${b.t}), a liga ajusta a carteira no início da temporada.`, clubs: [S.club], user: true });
  }
  // v107: correção da temporada em andamento (a Série B tinha sido tratada como se brigasse por Libertadores)
  function balanceFix(S) {
    Wd.forDesks(S, () => {
      if (S.balFix === 107 || !S.balGiven) return;
      const oldT = S.balGiven[S.season]; S.balFix = 107;
      if (!oldT || S.unemployed || !S.obj || !S.obj[S.club]) return;
      const newT = balTier(S.obj[S.club]); if (newT === oldT || !BAL[newT] || !BAL[oldT]) return;
      const first = Object.keys(S.balGiven).every(k => +k >= S.season);
      const a = balGive(BAL[oldT], first), b = balGive(BAL[newT], first), dSt = b.st - a.st, dDi = b.di - a.di;
      S.balGiven[S.season] = newT;
      if (dSt <= 0 && dDi <= 0) return;
      S.stars = (S.stars || 0) + Math.max(0, dSt); S.dias = Math.max(0, (S.dias || 0) + Math.max(0, dDi)); wInAdd(S, dSt, dDi);
      const parts = [dSt > 0 ? `${dSt} estrelas` : '', dDi > 0 ? `${dDi} ${MARKET.isOuro(S) ? 'Ouro' : `diamante${dDi > 1 ? 's' : ''}`}` : ''].filter(Boolean).join(' e ');
      EVENTS.news(S, { t: 'club', title: `Equilíbrio da liga corrigido: ${S.club} recebe ${parts}`, body: `O ajuste do início da temporada usou a régua da Série A (${BAL[oldT].t}). Clube da Série ${S.obj[S.club].div} vem abaixo do pior elenco da Série A, então a carteira foi refeita (${BAL[newT].t}).`, clubs: [S.club], user: true, front: 95 });
    });
  }
  function userPos(S) { const div = Wd.divOf(S, S.club) || 'B'; return S.comp[div] ? standings(S.comp[div].table).findIndex(r => r.c === S.club) + 1 : 0; }
  function boardRound(S) {
    const o = S.obj && S.obj[S.club]; if (!o || S.unemployed) return;
    const t = S.comp[o.div].table[S.club]; if (!t || t.j < 5) return;
    const pos = userPos(S), big = bigOf(S);
    if (big) {   // v252: clube grande sente a distância em pontos até a meta (até −3 por rodada)
      const st = oprStatus(S, S.club), gap = st ? st.gap : 0, ok = st ? st.ok : pos <= o.max;
      const v = ok ? Math.min(1.5, 0.3 + gap * 0.1) : -clamp((0.6 + gap * 0.12) * (BIG[big] / 1.25), 0.6, 3);
      S.board = clamp((S.board ?? 60) + v, 0, 100); return;
    }
    S.board = clamp((S.board ?? 60) + clamp((o.max - pos) * 0.35 + 0.3, -2, 2), 0, 100);
  }
  // pedido de verba: depende de confiança, momento esportivo, saúde financeira, necessidade e do que já entrou recentemente
  function askBudget(S) {
    const o = S.obj[S.club], pos = userPos(S), d = S.lastDay;
    if (S.boardAsk != null && d - S.boardAsk < 7) return { ok: false, msg: `A diretoria só volta a conversar em ${7 - (d - S.boardAsk)} dia(s).` };
    S.boardAsk = d;
    const sv = Wd.squadValue(S, S.club), cash = S.cash[S.club] || 0;
    const conf = clamp(((S.board ?? 60) - 30) / 60, 0, 1);
    const tj = (S.comp[o.div].table[S.club] || {}).j || 0;
    const sport = tj < 5 ? 0.85 : pos <= o.max ? 1 : pos <= o.max + 3 ? 0.55 : 0.25;
    const fin = cash < 0 ? 0.2 : cash > sv * 0.35 ? 0.45 : cash < sv * 0.05 ? 0.8 : 1;
    const recent = S.moneyIn && d - S.moneyIn.d < 12 ? 0.2 : 1;
    const given = (S.boardGiven || []).filter(x => d - x < 28).length, rep = Math.pow(0.35, given);
    const hurt = squad(S, S.club).filter(id => view(S, id).inj > 0).length, need = squad(S, S.club).length < 23 || hurt >= 4 ? 1.25 : 1;
    const chance = 0.6 * conf * sport * fin * recent * rep * need;
    const roll = C.rng(hash(`ask${S.seed}${d}${S.club}`))();
    if (roll < chance) {
      const v = r1k(sv * (0.012 + (S.board ?? 60) / 100 * 0.028));
      if (!isFinite(v) || v <= 0) return { ok: false, msg: 'A diretoria não conseguiu fechar a conta agora. Tente de novo mais tarde.' };   // v202: elenco com ficha quebrada dava T$ NaN e zerava o caixa (46DK9R)
      S.cash[S.club] += v; S.boardGiven = [...(S.boardGiven || []), d]; S.moneyIn = { d, v, why: 'diretoria' };
      EVENTS.news(S, { t: 'fin', title: `Diretoria do ${S.club} libera T$ ${C.fmt(v)} a mais`, body: `Confiança no trabalho de ${S.manager}: ${Math.round(S.board)}/100.`, clubs: [S.club] });
      return { ok: true, msg: `Aprovado! + T$ ${C.fmt(v)}` };
    }
    S.board = clamp(S.board - 3, 0, 100);
    const why = recent < 1 ? `O clube acabou de receber T$ ${C.fmt(S.moneyIn.v || 0)} (${S.moneyIn.why || 'receita extra'}). "Use esse dinheiro primeiro."`
      : given ? 'A diretoria já liberou verba há pouco tempo.'
      : fin < 0.5 && cash < 0 ? 'O clube está no vermelho. Não há de onde tirar.'
      : fin < 0.5 ? 'O caixa já está alto. A diretoria acha que dá pra se virar.'
      : sport < 0.8 ? `O time está abaixo do objetivo (${pos}º, meta ${o.max}º). Primeiro os resultados.`
      : conf < 0.5 ? 'A confiança no seu trabalho ainda é baixa.' : 'O presidente pediu paciência.';
    EVENTS.news(S, { t: 'club', title: `Diretoria nega reforço no orçamento do ${S.club}`, body: why, clubs: [S.club] });
    return { ok: false, msg: `Pedido negado. ${why}` };
  }
  // ---------- amistosos (precisam ser aceitos; máx. 5 por dia) ----------
  // 3 vitórias dentro dos 5 amistosos do dia (não precisam ser seguidas) = 1 estrela; 10 vitórias seguidas = 1 diamante
  function frResult(S, won) {
    const fr = friendsToday(S);
    if (won) fr.w = (fr.w || 0) + 1;
    if (won && fr.w >= 3 && !fr.star) { fr.star = 1; award(S, 1, 0, '3 vitórias em amistosos no dia'); }
    if (won) { S.fws = (S.fws || 0) + 1; if (S.fws === 10) award(S, 0, 1, '10 vitórias seguidas em amistosos'); } else S.fws = 0;
  }
  function friendsToday(S) { const d = dayAbs(S, now(S)); if (!S.fr || S.fr.day !== d) S.fr = { day: d, played: 0, invites: [] }; if (!S.fr) return { day: d, played: 0, invites: [] };   /* v203: sem mesa (ADM sem time) a gravação não pega: devolve um dia vazio (4CSNHH) */ if (S.fr.invites && S.fr.invites.some(i => !i || typeof i.club !== 'string' || !i.club)) S.fr.invites = S.fr.invites.filter(i => i && typeof i.club === 'string' && i.club); return S.fr; }   // v153: convite sem clube (liga com A e B lotadas de treinadores) quebrava a tela de amistoso
  function inviteFriendly(S, club) {
    const fr = friendsToday(S);
    if (fr.played >= 5) return { ok: false, msg: 'Limite de 5 amistosos por dia atingido.' };
    if (fr.invites.some(i => i.club === club && ['pending', 'accepted', 'incoming'].includes(i.status))) return { ok: false, msg: 'Já existe convite aberto com esse clube.' };
    if (Wd.isHuman(S, club)) {
      const me = S.club, man = S.manager;
      fr.invites.push({ club, status: 'pending', human: true, from: 'me' });
      Wd.asClub(S, club, () => { const f2 = friendsToday(S); f2.invites = f2.invites.filter(i => !(i.club === me && i.status === 'incoming')); f2.invites.push({ club: me, status: 'incoming', from: 'human', reply: `${man} te chamou pra um amistoso.` }); });
      return { ok: true, msg: `Convite enviado a ${S.coaches[club].name}. Ele precisa aceitar no jogo dele.` };
    }
    fr.invites.push({ club, status: 'pending', at: now(S) + (8000 + Math.floor(C.rng(hash(club + now(S)))() * 18000)) * (S.speed > 1 ? S.speed : 1), from: 'me' });
    return { ok: true, msg: `Convite enviado ao técnico do ${club}.` };
  }
  function resolveInvites(S) {
    const fr = friendsToday(S); let changed = false;
    for (const inv of fr.invites) {
      if (inv.status !== 'pending' || inv.human || now(S) < inv.at) continue;
      const nx = nextFixtureOf(S, inv.club);
      const hrs = nx && !nx.pending ? (slotTime(S, nx.k) - now(S)) / HOUR : 99;
      const xi = aiTeam(S, inv.club).xi.filter(Boolean);
      const cond = xi.reduce((a, id) => a + view(S, id).cond, 0) / Math.max(1, xi.length);
      const r = C.rng(hash(inv.club + inv.at));
      const p = 0.82 - (hrs < 8 ? 0.4 : 0) - (cond < 78 ? 0.3 : 0) + (C.isDerby(S.club, inv.club) ? 0.1 : 0);
      if (r() < p) { inv.status = 'accepted'; inv.reply = C.pick(['Topo! Vamos medir forças.', 'Bora, meu time precisa de ritmo.', 'Aceito. Só não vale reclamar depois.', 'Fechado. Quero ver teu time de perto.'], r); }
      else { inv.status = 'declined'; inv.reply = hrs < 8 ? 'Temos jogo oficial daqui a pouco. Fica pra próxima.' : cond < 78 ? 'Meu elenco está desgastado, hoje não dá.' : 'Agenda cheia hoje, obrigado pelo convite.'; }
      changed = true;
    }
    return changed;
  }
  function aiInvite(S, r) {
    const fr = friendsToday(S);
    if (r() < 0.35 && fr.invites.filter(i => i.from === 'ai').length < 2) {
      const L = [...S.divA, ...S.divB, ...(S.divC || [])].filter(x => x && x !== S.club && !Wd.isHuman(S, x)); if (!L.length) return;
      const c = C.pick(L, r);
      fr.invites.push({ club: c, status: 'incoming', from: 'ai', reply: C.pick(['Topa um amistoso hoje?', 'Quero testar meu time contra o seu.', 'Bora um jogo-treino?'], r) });
    }
  }
  function playFriendly(S, club) {
    const fr = friendsToday(S);
    if (fr.played >= 5) return { ok: false, msg: 'Limite de 5 amistosos por dia atingido.' };
    const inv = fr.invites.find(i => i.club === club && (i.status === 'accepted' || i.status === 'incoming'));
    if (!inv) return { ok: false, msg: 'O outro técnico ainda não aceitou.' };
    inv.status = 'played'; fr.played++;
    const res = friendly(S, club, inv.from === 'me');
    if (inv.from === 'human') {
      const me = S.club, lm = S.lastMatch;
      Wd.asClub(S, club, () => {
        const f2 = friendsToday(S), mine = f2.invites.find(i => i.club === me && i.status === 'pending' && i.human);
        if (mine) mine.status = 'played'; f2.played++;
        const home = lm.f.h === S.club, won = home ? res.gh > res.ga : res.ga > res.gh;
        frResult(S, won);
        S.lastMatch = JSON.parse(JSON.stringify(lm));
      });
    }
    return { ok: true };
  }
  function declineFriendly(S, club) {
    const fr = friendsToday(S), inv = fr.invites.find(i => i.club === club && i.status === 'incoming');
    if (inv) { inv.status = 'declined'; inv.reply = 'Você recusou.'; }
    if (inv && inv.from === 'human') { const me = S.club; Wd.asClub(S, club, () => { const f2 = friendsToday(S), m = f2.invites.find(i => i.club === me && i.human && i.status === 'pending'); if (m) { m.status = 'declined'; m.reply = 'Recusou o convite.'; } }); }
  }
  function pairUp(teams, r) { const t = shuffle(teams, r), out = []; for (let i = 0; i < t.length; i += 2) out.push(r() < 0.5 ? [t[i], t[i + 1]] : [t[i + 1], t[i]]); return out; }
  function setupContinental(S) {
    const pl = S.comp.PL.ties;
    if (!pl.every(t => t.win)) return;   // v182: nunca antes do 2º jogo da pré
    const winners = pl.map(t => t.win).filter(c => isBR(S, c)), losers = pl.map(t => t.win === t.br ? t.f : t.br).filter(c => isBR(S, c));   // v249: pré pode ser brasileiro x brasileiro
    const F = S.comp.foreign;
    const build = (key, br) => {
      const need = 16 - br.length, taken = new Set([...['LIB', 'SUL', 'CONF'].flatMap(k => S.comp[k] && S.comp[k].teams || []), ...pl.flatMap(t => [t.br, t.f])]);
      let fx = F[key].filter(c => !taken.has(c)).slice(0, need);
      if (fx.length < need) { const more = Wd.FOREIGN().filter(c => !taken.has(c) && !fx.includes(c) && !Object.values(F).some(l => l.includes(c))).map(c => ({ c, s: strength(S, c) })).sort((a, b) => b.s - a.s).map(x => x.c); fx = [...fx, ...more.slice(0, need - fx.length)]; }   // v249: sempre 16
      const teams = [...br, ...fx];
      // potes: brasileiros espalhados
      const r = R(`grp${key}${S.seed}${S.season}`);
      const sorted = teams.map(c => ({ c, s: strength(S, c) + (br.includes(c) ? 100 : 0) })).sort((a, b) => b.s - a.s).map(x => x.c);
      const groups = [[], [], [], []];
      for (let pot = 0; pot < 4; pot++) { const chunk = shuffle(sorted.slice(pot * 4, pot * 4 + 4), r); chunk.forEach((c, i) => groups[i].push(c)); }
      return { teams, groups, gt: freshTable(teams), ko: [], res: [], stage: {}, champ: null };
    };
    S.comp.LIB = build('LIB', [...S.qual.LIB, ...winners]);
    S.comp.SUL = build('SUL', [...S.qual.SUL, ...losers]);
    S.comp.CONF = build('CONF', S.qual.CONF);
    for (const k of ['LIB', 'SUL', 'CONF']) for (const c of S.comp[k].teams) if (isBR(S, c)) prize(S, c, PRIZE[k].part, `${COMP_NAME[k]}: participação`);
    try { setupRegional(S); } catch (e) {}
  }
  // copas: continentais + regionais (mesmo formato: 4 grupos de 4, quartas, semi e final nas mesmas datas)
  const INTL = ['LIB', 'SUL', 'CONF'], REGC = ['NE', 'SSE', 'VER'], CUPS = [...INTL, ...REGC];
  const REG_OF = { NE: 'NE', SSE: 'SSE', N: 'VER', CO: 'VER' };
  const regCupOf = club => REG_OF[C.regionOf ? C.regionOf(club) : null] || null;
  function setupRegional(S) {
    if (!C.CLUBS_REG_GEN) return;
    const intl = new Set(INTL.flatMap(k => S.comp[k] ? S.comp[k].teams : []));
    const idle = Wd.brClubs(S).filter(c => !intl.has(c));
    const val = c => Wd.squadValue(S, c);
    const regLvl = {}, lv = c => regLvl[c] ?? (regLvl[c] = Wd.squad(S, c).length >= 11 ? strength(S, c) : 0);   // força do elenco real
    const dPool = S.divC ? Wd.divD(S) : Object.entries(C.CLUBS_REG_GEN).filter(([n, k]) => !k.off && Wd.squad(S, n).length >= 14).map(([n]) => n);   // Série D
    const gen = reg => dPool.filter(n => C.regionOf(n) === reg).sort((a, b) => lv(b) - lv(a) || a.localeCompare(b));
    // vagas garantidas pra Série D (é por essas copas que a D sobe pra C): 1/4 do grupo
    const fill = (reg, n) => { const g = gen(reg), dMin = S.divC ? Math.min(Math.ceil(n / 4), g.length) : 0; const game = idle.filter(c => C.regionOf(c) === reg).sort((a, b) => val(b) - val(a)).slice(0, n - dMin); return [...game, ...g.slice(0, n - game.length)]; };
    const pots = (teams, ng, r) => {
      const sorted = teams.map(c => ({ c, s: strength(S, c) + (isBR(S, c) ? 100 : 0) })).sort((a, b) => b.s - a.s).map(x => x.c);
      const groups = Array.from({ length: ng }, () => []);
      for (let p = 0; p * ng < sorted.length; p++) shuffle(sorted.slice(p * ng, p * ng + ng), r).forEach((c, i) => groups[i].push(c));
      return groups;
    };
    const mk = (key, groups) => { const teams = groups.flat(); S.comp[key] = { teams, groups, gt: freshTable(teams), ko: [], res: [], stage: {}, champ: null, reg: true }; for (const c of teams) prize(S, c, PRIZE[key].part, `${COMP_NAME[key]}: participação`); };
    mk('NE', pots(fill('NE', 16), 4, R(`grpNE${S.seed}${S.season}`)));
    mk('SSE', pots(fill('SSE', 16), 4, R(`grpSSE${S.seed}${S.season}`)));
    // Copa Verde: grupos A e B do bloco Norte, C e D do Centro-Oeste; a final é Norte x Centro-Oeste
    mk('VER', [...pots(fill('N', 8), 2, R(`grpVN${S.seed}${S.season}`)), ...pots(fill('CO', 8), 2, R(`grpVC${S.seed}${S.season}`))]);
  }
  const GROUP_MD = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]], [[1, 0], [3, 2]], [[2, 0], [3, 1]], [[3, 0], [2, 1]]];
  const isBR = (S, c) => !!Wd.divOf(S, c);

  // jogos de um slot
  // ADM: anula a última rodada da liga (resultado errado) para ser jogada de novo.
  // Desfaz tabela, gols/assistências, sequências, ficha do treinador e notícias do jogo; a rodada volta a ficar pendente.
  function annulRound(S, k) {
    if (!CAL[k] || CAL[k].type !== 'L' || S.slot !== k + 1 || !S.played[k]) return { ok: false, msg: 'Só dá pra anular a última rodada jogada do Brasileirão.' };
    const ms = S.played[k];
    for (const m of ms) {
      const tbl = LEAGUES.includes(m.comp) && S.comp[m.comp] && S.comp[m.comp].table;
      const pure = m.gh > m.ga ? 'h' : m.gh < m.ga ? 'a' : 'd';
      if (tbl && tbl[m.h] && tbl[m.a]) {
        const th = tbl[m.h], ta = tbl[m.a];
        th.j = Math.max(0, th.j - 1); ta.j = Math.max(0, ta.j - 1);
        th.gp -= m.gh; th.gc -= m.ga; ta.gp -= m.ga; ta.gc -= m.gh;
        if (pure === 'h') { th.v--; ta.d--; } else if (pure === 'a') { ta.v--; th.d--; } else { th.e--; ta.e--; }
        th.form.pop(); ta.form.pop();
      }
      for (const [, , p, a] of m.g || []) {
        if (a === -2) continue;   // cartão vermelho
        const sp = S.ps[p]; if (sp && sp.st) { sp.st.g = Math.max(0, sp.st.g - 1); if (sp.stl) sp.stl.g = Math.max(0, sp.stl.g - 1); if (sp.stlD && sp.stlD[m.comp]) sp.stlD[m.comp].g = Math.max(0, sp.stlD[m.comp].g - 1); }
        const sa = a >= 0 && S.ps[a]; if (sa && sa.st) { sa.st.a = Math.max(0, sa.st.a - 1); if (sa.stl) sa.stl.a = Math.max(0, sa.stl.a - 1); if (sa.stlD && sa.stlD[m.comp]) sa.stlD[m.comp].a = Math.max(0, sa.stlD[m.comp].a - 1); }
      }
      for (const c of [m.h, m.a]) if (S.streak && S.streak[c]) S.streak[c] = S.streak[c].slice(0, -1);
      // ficha do treinador humano
      for (const [club, my, ot] of [[m.h, m.gh, m.ga], [m.a, m.ga, m.gh]]) if (Wd.isHuman(S, club)) Wd.asClub(S, club, () => {
        const cs = S.cst; if (!cs) return; const r = my > ot ? 'v' : my < ot ? 'd' : 'e';
        for (const o of [cs, cs.clubs && cs.clubs[club], cs.seasons && cs.seasons[S.season]]) if (o) { o.j = Math.max(0, o.j - 1); o[r] = Math.max(0, o[r] - 1); }
        cs.gp -= my; cs.gc -= ot; const se = cs.seasons && cs.seasons[S.season]; if (se) { se.gp -= my; se.gc -= ot; }
        if (S.lastMatch && S.lastMatch.k === k && S.lastMatch.season === S.season) S.lastMatch = null;
      });
    }
    delete S.played[k];
    S.news = S.news.filter(n => !(n.s === S.season && n.k === k && n.t === 'match'));
    S.slot = k;
    EVENTS.news(S, { t: 'club', title: `Rodada ${CAL[k].md} anulada: os jogos serão disputados de novo`, body: 'Um erro no calendário escalou os confrontos errados. A tabela voltou ao que era antes da rodada e os jogos certos acontecem em seguida.', front: 95 });
    Wd.touch(S);
    return { ok: true, msg: `Rodada ${CAL[k].md} anulada. Os jogos certos serão disputados em instantes.` };
  }
  function fixturesOf(S, k) {
    const cal = CAL[k], out = [];
    if (cal.type === 'L') {
      for (const div of LEAGUES) { if (Wd.divList(S, div).length < 2 || !S.comp || !S.comp[div]) continue; (leagueFix(S, div)[cal.md - 1] || []).forEach(([h, a]) => out.push({ comp: div, h, a, md: cal.md })); }
    } else if (cal.type === 'PL') {
      S.comp.PL.ties.forEach((t, i) => out.push(cal.md === 1 ? { comp: 'PL', h: t.f, a: t.br, tie: i, leg: 1 } : { comp: 'PL', h: t.br, a: t.f, tie: i, leg: 2, ko: true }));
    } else if (cal.type === 'SC') {
      const [a, b] = S.comp.SC.teams; out.push({ comp: 'SC', h: a, a: b, ko: true, neutral: true });
    } else if (cal.type === 'CB') {
      if (cal.md === 6) (S.comp.CB.rounds[4] || []).forEach(([h, a], i) => out.push({ comp: 'CB', h: a, a: h, round: 6, i, ko: true, leg: 2 }));
      else (S.comp.CB.rounds[cal.md - 1] || []).forEach(([h, a], i) => out.push({ comp: 'CB', h, a, round: cal.md, i, ko: cal.md < 5, leg: cal.md === 5 ? 1 : 0 }));
    } else if (cal.type === 'C') {
      // v182: só monta os grupos com a pré-Libertadores decidida (antes, olhar o futuro mandava os vencedores pra Sul-Americana)
      if (cal.md === 1 && !S.comp.LIB && S.comp.PL && S.comp.PL.ties.every(t => t.win)) setupContinental(S);
      for (const key of CUPS) {
        if (!S.comp[key]) continue;
        S.comp[key].groups.forEach((g, gi) => GROUP_MD[cal.md - 1].forEach(([x, y]) => out.push({ comp: key, h: g[x], a: g[y], group: gi, md: cal.md })));
      }
    } else if (cal.type === 'CK') {
      for (const key of CUPS) {
        if (!S.comp[key]) continue;
        const ko = S.comp[key].ko[cal.md - 1] || [];
        ko.forEach(([h, a], i) => out.push({ comp: key, h, a, ko: true, stage: cal.md, i, neutral: cal.md === 3 }));
      }
    }
    return out;
  }
  function nextFixtureOf(S, club) {
    for (let k = S.slot; k < SLOTS; k++) {
      const cal = CAL[k];
      if ((cal.type === 'C' && cal.md === 1 && !S.comp.LIB) || (cal.type === 'CK' && !(S.comp.LIB && S.comp.LIB.ko[cal.md - 1]))) {
        // ainda não definido
        const inComp = ['LIB', 'SUL', 'CONF'].some(key => (S.comp[key] ? S.comp[key].teams : [...(S.qual[key] || []), ...(key === 'LIB' || key === 'SUL' ? S.qual.PL : [])]).includes(club));
        if (inComp) return { k, pending: true, comp: 'LIB' };
        if (cal.type === 'C' && isBR(S, club) && regCupOf(club)) return { k, pending: true, comp: regCupOf(club) };
        continue;
      }
      const f = fixturesOf(S, k).find(x => x.h === club || x.a === club);
      if (f) return { k, ...f };
    }
    return null;
  }
  function clubSchedule(S, club) {
    const out = [];
    for (let k = 0; k < SLOTS; k++) {
      const cal = CAL[k];
      let f = null;
      if (k < S.slot) f = (S.played[k] || []).find(x => x.h === club || x.a === club);
      else {
        const known = !((cal.type === 'C' && !S.comp.LIB) || (cal.type === 'CK' && !(S.comp.LIB && S.comp.LIB.ko[cal.md - 1])) || (cal.type === 'CB' && !S.comp.CB.rounds[Math.min(cal.md, 5) - 1]));
        if (known) f = fixturesOf(S, k).find(x => x.h === club || x.a === club);
        else {
          const intl = ['LIB', 'SUL', 'CONF'].some(key => (S.comp[key] ? S.comp[key].teams : [...(S.qual[key] || []), ...(key === 'LIB' || key === 'SUL' ? S.qual.PL : [])]).includes(club));
          const rk = !intl && S.comp.LIB ? REGC.find(key => S.comp[key] && S.comp[key].teams.includes(club)) : !intl ? regCupOf(club) : null;
          f = { tbd: true, comp: cal.type === 'CB' ? 'CB' : rk || 'LIB' };
        }
      }
      if (f) out.push({ k, t: slotTime(S, k), ...f });
    }
    return out;
  }

  // ---------- processamento ----------
  // recuperação por intervalo entre jogos: quem jogou recupera ~15, quem foi poupado ~27 (volta perto de 100)
  // recuperação por dia fictício: a cada dia o jogador recupera uma fração do que falta (exponencial).
  // Base 24%/dia -> semana cheia (7+ dias) devolve ~85% ou mais; jogo de copa no meio (3 dias) só ~55%.
  // Jovem recupera mais rápido, veterano mais devagar; treino leve acelera, intenso atrasa; lesionado recupera menos.
  const REC_DAY = 0.24;   // ~85% do cansaço volta em 7 dias, ~55% em 3 (semana com jogo de copa)
  function recover(S, days) {
    if (!(days > 0)) return;
    const tm = {}; for (const d of Object.values(S.desks || {})) if (!d.unemployed) tm[d.club] = C.TRAINING[d.training || 'normal'].recover;
    for (const id in S.ps) {
      const s = S.ps[id]; if (s.cond >= 100) continue;
      const m = tm[Wd.ownerOf(S, +id)] || 1, a = age(S, +id);
      const af = a <= 23 ? 1.12 : a >= 34 ? 0.78 : a >= 31 ? 0.9 : 1;
      const q = clamp(REC_DAY * af * m * (s.inj > 0 ? 0.6 : 1), 0.01, 0.5);
      s.cond = Math.min(100, s.cond + (100 - s.cond) * (1 - Math.pow(1 - q, days)));
      if (s.cond > 99.5) s.cond = 100;
    }
  }
  // recuperação dia a dia: a cada virada de dia do calendário do jogo aplica os dias inteiros que passaram
  // (o total até o próximo jogo é o mesmo de antes; só fica visível aos poucos em vez de tudo no apito)
  function dayRecover(S, t) {
    if (!S.lastT || S.slot >= SLOTS || !(t > S.lastT)) return;
    let tb; try { tb = tOfFd(S, Math.floor(fdAt(S, t) + 1e-6)); } catch (e) { return; }
    if (!(tb > S.lastT) || tb > t) return;
    const d = fdBetween(S, S.lastT, tb);
    if (d < 0.5) return;
    recover(S, d); S.lastT = tb;
  }
  function tickSlot(S) {
    for (const id in S.ps) { const s = S.ps[id]; if (s.inj > 0) { s.inj--; if (s.inj <= 0) s.injEnd = S.season * 100 + (S.slot || 0); } if (s.away > 0) s.away--; if (s.ban > 0) s.ban--; }
  }
  // ---------- estádio, público e ingresso ----------
  function stadium(S, club) {
    const st = C.STADIUMS[club]; if (st) return { name: st[0], cap: st[1] };
    const fan = Wd.clubInfo(club).fan || 3;
    return { name: `Estádio do ${club}`, cap: 8000 + fan * 5000 };
  }
  const occBase = fan => 0.3 + Math.min(10, fan) * 0.055;          // ocupação de um jogo comum a preço normal
  const PRICE = { barato: 0.65, normal: 1, caro: 1.4, abusivo: 2 };
  // procura pelo jogo: fase do clube, tabela, importância, adversário
  // ---------- clima de jogo grande: o que faz a procura passar do estádio ----------
  // devolve um multiplicador de importância e os motivos (aparecem na tela de ingressos)
  function hypeOf(S, f, k) {
    const h = f.h, a = f.a, why = []; let x = 1;
    if (f.neutral || !S.trlog) return { x, why };
    const dq = id => { try { return MARKET.diaReq(S, id); } catch (e) { return null; } };
    const ovr = id => Wd.view(S, id).ovr;
    const sqH = Wd.squad(S, h), sqA = Wd.squad(S, a), inH = new Set(sqH), inA = new Set(sqA);
    // 1. efeito chegada: craque recém-contratado (Diamante enche mais; Messi/CR7 ainda mais)
    let best = 0, bId = null;
    for (let i = S.trlog.length - 1; i >= 0; i--) {
      const e = S.trlog[i]; if (e[0] !== S.season) break;
      if (e[4] !== h || e[6] === 'retorno' || !inH.has(e[2]) || k - e[1] > 6 || e[1] > k) continue;
      const q = dq(e[2]), v = q ? (q[1] >= 2 ? 1.5 : 1.35) : ovr(e[2]) >= 78 ? 1.12 : 1;
      if (v > best) { best = v; bId = e[2]; }
    }
    if (bId) { x *= best; why.push(best >= 1.35 ? `Chegada de ${P[bId].short}: todo mundo quer ver a estreia` : `Reforço novo: ${P[bId].short}`); }
    // 2. despedida: último jogo em casa do Diamante antes de acabar a passagem
    for (const id of sqH) {
      const l = S.ps[id] && S.ps[id].loan; if (!l || l.kind !== 'dia' || l.season !== S.season || k >= l.end) continue;
      let more = false; for (let j = k + 1; j < l.end && !more; j++) more = fixturesOf(S, j).some(g => g.h === h && !g.neutral);
      if (!more) { x *= 1.3; why.push(`Despedida de ${P[id].short} do ${h}`); break; }
    }
    // 3. estrela visitante
    let vis = 0, vId = null; for (const id of sqA) { const q = dq(id); if (q) { const v = q[1] >= 2 ? 1.25 : 1.15; if (v > vis) { vis = v; vId = id; } } }
    if (vId) { x *= vis; why.push(`${P[vId].short} em campo pelo ${a}`); }
    // 4a. reencontro: ex-jogador de peso do clube agora do outro lado
    for (let i = S.trlog.length - 1; i >= 0; i--) {
      const e = S.trlog[i]; if (e[3] !== h || !inA.has(e[2]) || (S.own[e[2]] ?? a) !== a || ovr(e[2]) < 76) continue;
      x *= 1.1; why.push(`Reencontro com ${P[e[2]].short}, ex-${h}`); break;
    }
    // 4b. sequência de vitórias
    const st = (S.streak && S.streak[h]) || ''; const m = st.match(/V+$/); const n = m ? m[0].length : 0;
    if (n >= 5) { x *= 1 + Math.min(8, n) * 0.025; why.push(`Sequência de ${n} vitórias`); }
    // 4c. rodada que pode decidir título, acesso, vaga ou rebaixamento
    if (LEAGUES.includes(f.comp) && S.comp && S.comp[f.comp]) {
      const tb = standings(S.comp[f.comp].table), N = tb.length, row = tb.find(r => r.c === h);
      if (row) {
        const rem = (N - 1) * 2 - (row.v + row.e + row.d);
        const lines = f.comp === 'A' ? [[1, 'pelo título'], [6, 'pela vaga na Libertadores'], [N - 4, 'contra o rebaixamento']] : [[1, 'pelo título'], [4, 'pelo acesso'], [N - 4, 'contra o rebaixamento']];
        if (rem >= 1 && rem <= 5) for (const [ln, lab] of lines) {
          const cut = tb[ln - 1], nxt = tb[ln]; if (!cut || !nxt) continue;
          const pos = tb.indexOf(row) + 1, gap = pos <= ln ? row.pts - nxt.pts : cut.pts - row.pts;
          if (gap <= 3 * rem && gap <= 6) { x *= 1.2; why.push(`Jogo decisivo na briga ${lab}`); break; }
        }
      }
    }
    return { x, why };
  }
  function demandOf(S, f, k) {
    const h = f.h, fan = Wd.clubInfo(h).fan || 3, st = (S.streak && S.streak[h]) || '';
    const last5 = st.slice(-5);
    let d = 1 + (last5.match(/V/g) || []).length * 0.05 - (last5.match(/D/g) || []).length * 0.06;
    const div = Wd.divOf(S, h);
    if (div && S.comp && S.comp[div] && S.slot >= 6) {
      const tb = standings(S.comp[div].table), pos = tb.findIndex(x => x.c === h) + 1, n = tb.length;
      if (pos && pos <= 4) d += 0.08; else if (pos > n - 4) d -= 0.06;
      if (S.obj && S.obj[h] && pos && pos > S.obj[h].max + 4) d -= 0.05;   // abaixo da expectativa
    }
    let imp = 1;
    if (C.isDerby(f.h, f.a)) imp *= 1.35;
    if (f.comp === 'CB') imp *= 1.1 + (f.round || 0) * 0.06;
    if (['LIB', 'SUL', 'CONF', 'PL'].includes(f.comp)) imp *= f.ko ? 1.3 + (f.stage || 0) * 0.08 : 1.12;
    if (REGC.includes(f.comp)) imp *= f.ko ? 1.1 + (f.stage || 0) * 0.08 : 0.95;
    if (f.final || /final/i.test(String(f.stageName || ''))) imp *= 1.4;
    const aw = Wd.clubInfo(f.a).fan || 3; if (aw >= 8) imp *= 1.12;
    try { const im = importantMatch(S, f); if (im && im !== 'clássico') imp *= 1.15; } catch (e) {}
    if (div && S.slot > 40 && !C.isDerby(f.h, f.a)) { const tb = standings(S.comp[div].table), pos = tb.findIndex(x => x.c === h) + 1; if (pos > 6 && pos < tb.length - 5) imp *= 0.9; }
    if (Wd.isHuman(S, h)) { const b = Wd.asClub(S, h, () => S.board ?? 60); d += (b - 60) / 400; }   // clima com a torcida/diretoria
    let hy = { x: 1, why: [] }; try { hy = hypeOf(S, f, k); } catch (e) {}
    imp *= hy.x;
    return { d: Math.max(0.4, d), imp, fan, why: hy.why, hx: hy.x };
  }
  function crowd(S, f, k, mult, preview) {
    const stad = stadium(S, f.h), cap = f.neutral ? Math.round(stad.cap * 0.9) : stad.cap;
    const { d, imp, fan, why, hx } = demandOf(S, f, k);
    const lvl = Wd.isHuman(S, f.h) ? (Wd.asClub(S, f.h, () => S.ticket) || 'normal') : 'normal';
    const pm = PRICE[lvl] || 1;
    // quanto mais importante o jogo e maior a torcida, menos o preço espanta
    const elast = clamp(1.25 - (imp - 1) * 0.9 - fan * 0.03, 0.35, 1.3) + (pm >= 2 ? 0.5 / Math.max(1, hx || 1) : 0);   // com craque/jogo histórico, o torcedor paga o que for
    const want = occBase(fan) * d * imp * Math.pow(pm, -elast);
    const noise = 1 + ((hash(`pub${S.seed}${S.season}${k}${f.h}`) % 100) / 100 - 0.5) * 0.08;
    const occ = clamp(want * noise, 0.08, 1);
    const dem = occBase(fan) * d * imp * noise;   // procura a preço normal, em fração da capacidade (pode passar de 1)
    const att = Math.round(cap * occ);
    // renda: calibrada pra que um jogo comum a preço normal renda o mesmo que antes
    const unit = matchRevenue(S, f.h) * mult * (f.neutral ? 0.8 : 1) / Math.max(1, cap * occBase(fan));
    const rev = Math.round(att * unit * pm);
    const price = Math.round((30 + fan * 8) * pm);   // preço médio de face (R$), só informativo
    const sold = occ >= 0.97;
    // caro/abusivo com casa cheia: a torcida pagou porque quis; não tem reclamação e ainda rende prestígio
    if (!preview && pm >= 1.4 && sold && !f.neutral && Wd.isHuman(S, f.h)) Wd.asClub(S, f.h, () => {
      if (!S.flags) S.flags = {};
      S.board = clamp((S.board ?? 60) + 1, 0, 100);
      if ((S.flags.soldNews || -9) < S.slot - 3) { S.flags.soldNews = S.slot; const r = C.rng(hash(`sold${S.seed}${S.season}${k}${f.h}`)); EVENTS.news(S, { t: 'club', title: C.pick([`Ingressos esgotados em minutos para ${f.h} x ${f.a}`, `Casa cheia a preço de ouro no ${stad.name}`, `Mesmo caros, ingressos para ${f.h} x ${f.a} acabam rápido`], r), body: `${C.fmt(att)} torcedores no ${stad.name}.${why && why.length ? ' ' + why[0] + '.' : ''} A diretoria comemora a bilheteria.`, clubs: [f.h], front: 60 }); }
      if (pm >= 2 && (S.flags.soldStar || -99) < S.slot - 6) { S.flags.soldStar = S.slot; award(S, 1, 0, `casa cheia com ingresso abusivo (${f.h} x ${f.a})`); }
    });
    if (!preview && pm >= 2 && !sold && Wd.isHuman(S, f.h)) Wd.asClub(S, f.h, () => { S.board = clamp((S.board ?? 60) - 2, 0, 100); if (!S.flags) S.flags = {}; if ((S.flags.ticketGripe || -9) < S.slot - 6) { S.flags.ticketGripe = S.slot; EVENTS.news(S, { t: 'club', title: `Parte da torcida do ${f.h} demonstra resistência aos valores dos ingressos`, body: `O ${stad.name} recebeu ${Math.round(occ * 100)}% da capacidade. Nas arquibancadas, faixas pediram ingressos mais acessíveis, e o assunto chegou à diretoria.`, clubs: [f.h], front: 70 }); } });
    // promoção (ingresso barato) em jogo especial vira notícia: clássico, decisão ou estreia de estrela
    if (!preview && lvl === 'barato' && !f.neutral && Wd.isHuman(S, f.h)) Wd.asClub(S, f.h, () => {
      let im = null; try { im = importantMatch(S, f); } catch (e) {}
      const deb = (why || []).find(w => /^Chegada de|^Reforço novo/.test(w));
      const kind = C.isDerby(f.h, f.a) ? 'classico' : im && im !== 'clássico' && im !== 'confronto direto' ? 'decisao' : deb ? 'estreia' : null;
      if (!kind) return;
      if (!S.flags) S.flags = {}; if ((S.flags.promoNews || -9) >= S.slot - 5) return; S.flags.promoNews = S.slot;
      const pc = Math.round(occ * 100), star = deb ? deb.replace(/^Chegada de |^Reforço novo: |: todo mundo quer ver a estreia$/g, '') : '';
      const r = C.rng(hash(`promo${S.seed}${S.season}${k}${f.h}`)), T = {
        classico: [[`Promoção para o clássico: ${f.h} x ${f.a} com ingresso popular`, `${pc}% de ocupação no ${stad.name}. A diretoria apostou em preço baixo pra lotar o clássico.`], [`Ingresso barato e festa no clássico contra o ${f.a}`, `A torcida do ${f.h} respondeu à promoção: ${C.fmt(att)} pessoas no ${stad.name}.`]],
        decisao: [[`${f.h} lança promoção para a decisão contra o ${f.a}`, `Com ingressos mais baratos, o ${stad.name} recebeu ${C.fmt(att)} torcedores (${pc}%).`], [`Preço popular na decisão: a torcida do ${f.h} abraça a promoção`, `Jogo grande, ingresso acessível: ${pc}% do ${stad.name} ocupado.`]],
        estreia: [[`Promoção para a estreia de ${star} no ${stad.name}`, `Ingresso popular pra ver o reforço: ${C.fmt(att)} pessoas (${pc}%).`], [`${f.h} baixa o ingresso e a torcida lota a estreia de ${star}`, `${pc}% de ocupação no ${stad.name} pra ver a nova contratação.`]],
      }[kind];
      const [title, body] = C.pick(T, r);
      EVENTS.news(S, { t: 'club', tag: 'promo', kick: 'Promoção', title, body, clubs: [f.h, f.a], front: 62 });
      if (occ >= 0.85) fansAdd(S, 2, 'promoção de ingresso em jogo especial');
    });
    if (!preview && !f.neutral && Wd.isHuman(S, f.h)) Wd.asClub(S, f.h, () => { const ch = S.flags && S.flags.tkChg; if (!ch || ch.to !== lvl) return; delete S.flags.tkChg; ticketReaction(S, f, ch, occ, stad); });
    return { att, cap, occ, rev, st: stad.name, price, pm: lvl, dem, why: why || [] };
  }
  // reação ao novo preço: aparece como notícia do universo do jogo, sem linguagem mecânica
  function ticketReaction(S, f, ch, occ, stad) {
    const ord = ['barato', 'normal', 'caro', 'abusivo'], up = ord.indexOf(ch.to) > ord.indexOf(ch.from);
    const r = C.rng(hash(`tkr${S.seed}${S.season}${S.slot}${f.h}`)), pk = a => a[Math.floor(r() * a.length)];
    const good = up ? occ >= 0.62 : occ >= 0.7;
    const T = up ? (good
      ? [['A nova política de preços teve boa aceitação entre os torcedores', `Mesmo com os novos valores, o ${stad.name} recebeu bom público (${Math.round(occ * 100)}%).`],
         ['Torcida do ' + f.h + ' abraça a nova tabela de ingressos', `A procura se manteve firme e a bilheteria agradece.`]]
      : [['O novo valor dos ingressos não teve a recepção esperada', `O ${stad.name} teve ${Math.round(occ * 100)}% de ocupação no primeiro jogo com a nova tabela.`],
         ['Parte da torcida demonstrou resistência aos novos preços', `Setores mais vazios no ${stad.name} (${Math.round(occ * 100)}% da capacidade). A diretoria acompanha a reação.`]])
      : (good
      ? [['A procura por ingressos respondeu positivamente aos novos valores', `O ${stad.name} recebeu ${Math.round(occ * 100)}% da capacidade com a tabela mais acessível.`],
         ['Ingressos mais acessíveis aproximam a torcida do ' + f.h, `Arquibancadas cheias: ${Math.round(occ * 100)}% de ocupação no ${stad.name}.`]]
      : [['Mesmo com ingressos mais acessíveis, a procura segue tímida', `O ${stad.name} teve ${Math.round(occ * 100)}% de ocupação. A fase do time pesa mais que o preço.`]]);
    const [title, body] = pk(T);
    EVENTS.news(S, { t: 'club', title, body, clubs: [f.h], desk: S.__me, front: 55 });
  }
  function matchRevenue(S, club) { const cl = Wd.clubInfo(club); return ECON.matchBase + Wd.squadValue(S, club) * ECON.matchPerSquadValue + (cl.fan || 3) * 300; }
  function prize(S, club, amount, why) {
    if (!isBR(S, club)) return;
    S.cash[club] = (S.cash[club] || 0) + amount;
    Wd.asClub(S, club, () => { S.seasonLog.prizes[why] = (S.seasonLog.prizes[why] || 0) + amount; EVENTS.news(S, { t: 'fin', title: `Premiação: ${why}`, body: `+ T$ ${C.fmt(amount)} no caixa.`, clubs: [club], desk: S.__me }); });
  }
  // árbitro: CBF nas competições nacionais, CONMEBOL nas continentais; evita repetir o mesmo árbitro no jogo seguinte de um clube
  function referee(S, k, i, f) {
    f = f || fixturesOf(S, k)[i] || {};
    const intl = ['LIB', 'SUL', 'CONF', 'PL'].includes(f.comp);
    const pool = C.REFEREES.filter(r => intl ? r.nat !== 'BRA' : r.nat === 'BRA');
    const last = S.refLast || {};
    let j = hash(`${S.seed}|${S.season}|${k}|${i}|${f.h}`) % pool.length;
    for (let t = 0; t < pool.length; t++) { const r = pool[(j + t) % pool.length]; if (r.id !== last[f.h] && r.id !== last[f.a]) return r; }
    return pool[j];
  }

  // A convocação anterior (jogos 18/42) também conta como janela já realizada na liga em andamento.
  const callDone = (S, k) => !!(S.callDone && (S.callDone[S.season + '-' + k] || S.callDone[S.season + '-' + ({ 21: 17, 43: 41 }[k])]));
  const markCall = (S, k) => { S.callDone = S.callDone || {}; for (const x in S.callDone) if (!x.startsWith(S.season + '-')) delete S.callDone[x]; S.callDone[S.season + '-' + k] = 1; };
  function callupEarly(S) {
    const k = S.slot; if (!CALLUPS.includes(k) || callDone(S, k) || !(k > 0 && S.played && S.played[k - 1])) return false;
    markCall(S, k); EVENTS.callups(S, k, 3); Wd.touch(S); return true;
  }
  function runSlot(S, k) {
    const t = slotTime(S, k);
    S._nt = t;
    recover(S, fdBetween(S, S.lastT, t));
    tickSlot(S);
    S.lastT = t;
    if (CALLUPS.includes(k) && !callDone(S, k)) { markCall(S, k); EVENTS.callups(S, k); }   // (liga antiga: se não foi anunciada antes, sai na hora, como era)
    const fx = fixturesOf(S, k);
    const played = [];
    fx.forEach((f, i) => {
      Wd.setGrp(Wd.grpOf(f.comp));
      const H = teamFor(S, f.h), A = teamFor(S, f.a);
      if (typeof globalThis !== 'undefined' && globalThis.__condHook) globalThis.__condHook(S, f, H, A);
      const isUser = Wd.isHuman(S, f.h) || Wd.isHuman(S, f.a);
      const ref = referee(S, k, i, f);
      S.refLast = S.refLast || {}; S.refLast[f.h] = ref.id; S.refLast[f.a] = ref.id;
      // v202: pré-Libertadores é decidida no agregado (pênaltis só com agregado empatado, logo abaixo). Antes o 2º jogo empatado ia pros
      // pênaltis dentro da partida e o vencedor no agregado aparecia como "derrota nos pênaltis" (6VVYL5, Botafogo)
      const injMult = [f.h, f.a].map(c => Wd.isHuman(S, c) ? Wd.asClub(S, c, () => C.TRAINING[S.training || 'normal'].inj) : 1);
      let occ0 = null; if (!f.neutral) { try { occ0 = crowd(S, f, k, 1, true).occ; } catch (e) {} }
      const exP = oprExpect(S, f, H, A, k);
      const res = SIM.simulate(H, A, { seed: hash(`${mseed(S)}|${S.season}|${k}|${i}|${f.h}`), info: id => info(S, id), referee: ref,
        detailed: isUser, knockout: !!f.ko && f.comp !== 'PL' && !(f.comp === 'CB' && f.leg === 2), neutral: !!f.neutral, injMult, crowd: occ0 });
      // final da Copa do Brasil: agregado
      if (f.comp === 'CB' && f.leg === 2) {
        const first = (S.played[SPECIAL_K.CB5] || []).find(m => m.h === f.a && m.a === f.h);
        const aggH = res.gh + (first ? first.ga : 0), aggA = res.ga + (first ? first.gh : 0);
        res.agg = [aggH, aggA];
        if (aggH === aggA) { const r = C.rng(hash('cbp' + k + i)); let a = 0, b = 0; for (let j = 0; j < 5; j++) { a += r() < 0.76; b += r() < 0.76; } while (a === b) { a += r() < 0.7; b += r() < 0.7; } res.pens = [a, b]; }
      }
      // 2º jogo da pré-Libertadores: agregado
      if (f.comp === 'PL' && f.leg === 2) {
        const tie = S.comp.PL.ties[f.tie];
        const aggBr = res.gh + tie.l1[1], aggF = res.ga + tie.l1[0];
        if (aggBr === aggF) { const r = C.rng(hash('plp' + k + i)); let a = 0, b = 0; for (let j = 0; j < 5; j++) { a += r() < 0.76; b += r() < 0.76; } while (a === b) { a += r() < 0.7; b += r() < 0.7; } res.pens = [a, b]; }
      }
      applyMatch(S, f, res, H, A, k, i);
      oprAfter(S, f, res, exP, k);
      played.push({ ...f, sk: k, pub: res.gate ? [res.gate.att, res.gate.cap] : undefined, gh: res.gh, ga: res.ga, pens: res.pens, agg: res.agg, ref: ref.id, mom: res.mom, st: res.st, styles: res.styles,
        g: (res.ev || []).filter(e => e.t === 'goal' || e.t === 'red' || e.t === 'red2').map(e => [e.m, e.s === 'h' ? 0 : 1, e.p, e.t === 'goal' ? (e.a ?? -1) : -2]) });
      for (const hc of [f.h, f.a]) if (Wd.isHuman(S, hc)) Wd.asClub(S, hc, () => { try { fansAfter(S, f, res, hc); } catch (e) {} });
      for (const hc of [f.h, f.a]) if (Wd.isHuman(S, hc)) Wd.asClub(S, hc, () => {
        S.lastMatch = { k, season: S.season, f, H: { club: H.club, xi: H.xi, formation: H.formation, style: H.style }, A: { club: A.club, xi: A.xi, formation: A.formation, style: A.style }, res: { gh: res.gh, ga: res.ga, pens: res.pens, ev: res.ev, st: res.st, pl: res.pl, mom: res.mom, styles: res.styles, formations: res.formations, gate: res.gate }, ref: ref.id, watched: false };
      });
    });
    // A contagem cai antes de cada partida. Depois do segundo desfalque sobra 1,
    // que já significa jogador liberado para a próxima data; limpe-o agora.
    for (const id in S.ps) if (S.ps[id].away === 1) S.ps[id].away = 0;
    S.played[k] = played;
    // infiltrados: quem jogou corre o risco de agravar
    const tag = S.season * 100 + k;
    for (const id in S.ps) {
      const s = S.ps[id]; if (s.infil !== tag) continue;
      if (lastPlayedIds.has(+id) && s.inj > 0) {
        const club = Wd.ownerOf(S, +id);
        if (C.rng(hash(`infil${id}${tag}`))() < (s.infilRisk || 0.25)) {
          const add = Math.round((s.injTot || s.inj) * 0.8) + 2;
          s.inj += add; s.injTot = s.inj; s.injT = (s.injT || 'Lesão').replace(/ \(agravada\)$/, '') + ' (agravada)';
          Wd.asClub(S, club, () => EVENTS.news(S, { t: 'injury', title: `Infiltração dá errado: ${P[id].short} agrava a lesão`, body: `Depois de jogar infiltrado, ${P[id].name} sentiu de novo. Agora são ${s.inj} jogos fora.`, ids: [+id], clubs: [club], front: 80 }));
        } else Wd.asClub(S, club, () => EVENTS.news(S, { t: 'injury', title: `Deu certo: ${P[id].short} joga infiltrado sem sentir`, body: `O DM segue o tratamento normalmente. Faltam ${s.inj} jogo(s) para a recuperação completa.`, ids: [+id], clubs: [club] }));
      }
      delete s.infil; delete s.infilRisk;
    }
    // suspensões cumpridas
    Wd.setGrp(null);
    const clubsPlayed = new Set(fx.flatMap(f => [f.h, f.a]));
    for (const f of fx) { const g = Wd.grpOf(f.comp) || 'L'; for (const c of [f.h, f.a]) for (const id of squad(S, c)) {
      const s = S.ps[id]; if (!s || lastPlayedIds.has(id)) continue;
      if (s.susC) { if (s.susC[g] > 0) { s.susC[g]--; if (!s.susC[g]) delete s.susC[g]; const v = Object.values(s.susC); s.sus = v.length ? Math.max(...v) : 0; if (!v.length) delete s.susC; } }
      else if (s.sus > 0) s.sus--; } }
    void clubsPlayed;
    lastPlayedIds.clear();
    postSlot(S, k);
    Wd.forDesks(S, () => settleBets(S, k));
    if (CAL[k].type === 'L') Wd.forDesks(S, () => { boardRound(S); try { oprTick(S); } catch (e) {} try { jobTick(S); } catch (e) {} });
    S.slot = k + 1;
    delete S._nt;
    Wd.touch(S);
  }
  const lastPlayedIds = new Set();
  // v168: jogar partida oficial acelera a evolução; nota boa acelera mais. Jovem em grande fase pode subir o potencial.
  const DEV = { on: true, k: 2, cap: 1.2, potOn: true, potN: 5, potAvg: 6.8, potAge: 23 };   // versão "forte" (simulada: jovem titular +0,85/temporada)
  function devBonus(rtAdj) { return rtAdj >= 6.5 ? Math.min(0.5, 0.25 + (rtAdj - 6.5) * (0.25 / 1.5)) : Math.max(0.05, 0.25 - (6.5 - rtAdj) * 0.15); }
  function devMatch(S, id, s, rtAdj, min, club) {
    s.dvb = Math.min(DEV.cap, (s.dvb || 0) + DEV.k * devBonus(rtAdj) * Math.min(1, min / 60));
    if (s.romp && s.romp.s === S.season) s.romp.rt.push(Math.round(rtAdj * 10) / 10);   // v169: jogos durante o "romper o teto" (nota comparada com a média do time no jogo: 6,5 = na média)
    if (!DEV.potOn || age(S, id) > DEV.potAge || s.pot >= 92) return;
    const L = s.dvr = (s.dvr || []).concat([Math.round(rtAdj * 10) / 10]).slice(-DEV.potN);
    if (L.length < DEV.potN || s.ascS === S.season) return;
    const avg = L.reduce((a, b) => a + b, 0) / L.length;
    if (avg < DEV.potAvg) return;
    // v169: grande fase vira o selo "Em ascensão" (20 dias): libera o treino "Romper o teto"
    let fd = 0; try { fd = Math.floor(fdAt(S, S._nt || now(S)) + 1e-6); } catch (e) {}
    s.asc = fd + 20; s.ascS = S.season; s.dvr = [];
    if (Wd.isHuman(S, club)) EVENTS.news(S, { t: 'club', kick: 'Em ascensão', title: `${P[id].short} é a sensação do ${club}`, body: `Média ${avg.toFixed(1).replace('.', ',')} nos últimos ${DEV.potN} jogos oficiais. Entrou na fase "Em ascensão" por 20 dias: dá pra tentar romper o teto dele em Elenco › Treino.`, ids: [id], clubs: [club], front: 72 });
  }
  // ficha do treinador humano (estatísticas da carreira)
  function coachRec(S, my, ot, opp, f) {
    const c = S.cst = S.cst || { j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, bigW: null, bigL: null, clubs: {}, seasons: {} };
    const k = my > ot ? 'v' : my < ot ? 'd' : 'e';
    const cl = c.clubs[S.club] = c.clubs[S.club] || { j: 0, v: 0, e: 0, d: 0, from: S.season, to: S.season };
    const se = c.seasons[S.season] = c.seasons[S.season] || { club: S.club, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0 };
    for (const o of [c, cl, se]) { o.j++; o[k]++; }
    c.gp += my; c.gc += ot; se.gp += my; se.gc += ot; cl.to = S.season; se.club = S.club;
    const txt = `${S.club} ${my}–${ot} ${opp} (${COMP_NAME[f.comp]} ${S.season})`, df = my - ot;
    if (df > 0 && (!c.bigW || df > c.bigW.df || (df === c.bigW.df && my > c.bigW.g))) c.bigW = { df, g: my, txt };
    if (df < 0 && (!c.bigL || -df > c.bigL.df)) c.bigL = { df: -df, txt };
  }

  function applyMatch(S, f, res, H, A, k, i) {
    const derby = C.isDerby(f.h, f.a);
    const result = res.gh > res.ga ? 'h' : res.gh < res.ga ? 'a' : (res.pens ? (res.pens[0] > res.pens[1] ? 'h' : 'a') : 'd');
    const pure = res.gh > res.ga ? 'h' : res.gh < res.ga ? 'a' : 'd';
    // capitão em campo: bem-humorado segura o vestiário (+1 de moral pros outros); insatisfeito contamina (−1)
    const capS = {}, capM = {};
    for (const sd of ['h', 'a']) { const on = Object.keys(res.pl).map(Number).filter(id => res.pl[id].side === sd); const c = Wd.captain ? Wd.captain(S, sd === 'h' ? f.h : f.a, on) : null; capS[sd] = c; const m = c != null ? ps(S, c).mor : 50; capM[sd] = m >= 70 ? 1 : m < 35 ? -1 : 0; }
    // troca de capitão (clube humano): o efeito sai uma vez só, no jogo, comparando com o capitão oficial do jogo anterior
    for (const club of [f.h, f.a]) {
      const t = Wd.deskOf(S, club), T = t && S.desks[t].tactics; if (!T) continue;
      if (T.capV !== 2) { T.capOff = T.cap != null ? T.cap : null; T.capV = 2; }   // regra nova: parte do capitão escolhido, sem punir ninguém na virada
      const side = club === f.h ? 'h' : 'a', onF = id => res.pl[id] && res.pl[id].side === side;
      const off = capS[side], prev = T.capOff;
      // pesa só quando o capitão anterior jogou este jogo sem a braçadeira (tirar a faixa de quem está em campo)
      if (T.cap != null && off === T.cap && prev != null && prev !== off && Wd.ownerOf(S, prev) === club && onF(prev)) {
        const big = Wd.leaderScore(S, prev) >= Wd.leaderScore(S, off) + 4, sp = ps(S, prev), so = ps(S, off);
        sp.mor = clamp(sp.mor - (big ? 8 : 4), 0, 100); so.mor = clamp(so.mor + 4, 0, 100);
        Wd.asDesk(S, t, () => EVENTS.news(S, { t: 'club', kick: 'Vestiário', title: big ? `${P[off].short} herda a braçadeira de ${P[prev].short} no ${club}` : `${P[off].short} é o novo capitão do ${club}`, body: `${big ? `A decisão pegou parte do elenco de surpresa. ${P[prev].short} não escondeu o incômodo` : `${P[prev].short} segue como referência no grupo`} (${P[prev].short} ${big ? '−8' : '−4'} de moral, ${P[off].short} +4).`, ids: [off, prev], clubs: [club] }));
      }
      T.capOff = T.cap != null ? T.cap : (onF(off) ? off : prev);
    }
    // v168: evolução por jogo oficial · nota comparada com a média do próprio time (time fraco não pune)
    const devAvg = {}; if (DEV.on) for (const sd of ['h', 'a']) { const L = Object.values(res.pl).filter(x => x.side === sd && x.min >= 30); devAvg[sd] = L.length ? L.reduce((a, x) => a + x.rt, 0) / L.length : 6.5; }
    for (const idS in res.pl) {
      const id = +idS, x = res.pl[id], s = ps(S, id);
      lastPlayedIds.add(id);
      if (DEV.on && x.min >= 30) { try { devMatch(S, id, s, 6.5 + (x.rt - devAvg[x.side]), x.min, Wd.ownerOf(S, id)); } catch (e) {} }
      s.cond = clamp(res.cond[id] ?? s.cond, 5, 100); s.lastP = S.season * 100 + k;
      const st = s.st; st.j++; st.min += x.min; st.g += x.g; st.a += x.a; st.rt += x.rt; st.yc += x.yc; st.rc += x.rc;
      if (LEAGUES.includes(f.comp)) { s.stl = s.stl || { j: 0, g: 0, a: 0, rt: 0, ga: 0, cs: 0 }; s.stl.j++; s.stl.g += x.g; s.stl.a += x.a; s.stl.rt += x.rt; }
      // v187: números do jogador POR campeonato (Série A/B/C) e pelo clube que defendia: estatística não muda se ele for vendido
      if (LEAGUES.includes(f.comp)) { s.stlD = s.stlD || {}; const d = s.stlD[f.comp] = s.stlD[f.comp] || { j: 0, g: 0, a: 0, rt: 0, ga: 0, cs: 0 }; d.j++; d.g += x.g; d.a += x.a; d.rt += x.rt; d.c = x.side === 'h' ? f.h : f.a; }
      // (v161: artilharia das copas é calculada dos jogos em S.played; S.cupSc não é mais usado)
      if (P[id].pos === 'GOL' && x.min >= 60) { const ga = x.side === 'h' ? res.ga : res.gh; st.ga += ga; if (!ga) st.cs++; if (s.stl && LEAGUES.includes(f.comp)) { s.stl.ga += ga; if (!ga) s.stl.cs++; } if (s.stlD && s.stlD[f.comp] && LEAGUES.includes(f.comp)) { s.stlD[f.comp].ga += ga; if (!ga) s.stlD[f.comp].cs++; } }
      s.form = Math.round((s.form * 0.6 + x.rt * 0.4) * 100) / 100;
      const mine = x.side === pure ? 1 : pure === 'd' ? 0 : -1;
      let dm = mine * 4 * (derby ? 2 : 1);
      if (x.rt >= 7.5) dm += 3; else if (x.rt <= 5.5) dm -= 3;
      if (Wd.fitOf(S, id, x.pos) < 0.9) dm -= 2;
      if (id !== capS[x.side]) dm += capM[x.side] || 0;
      s.mor = clamp(s.mor + dm, 0, 100);
      s.benchRun = 0;
      if (x.inj) {
        const r = C.rng(hash(`inj${id}${k}${S.season}`)), now = S.season * 100 + k;
        const recent = s.injK && s.injEnd != null && now - s.injEnd < 12 ? s.injK : null;
        const key = C.pickInjury(r, fragOf(S, id), recent), I = C.INJURIES[key];
        const n = I.min + Math.floor(r() * (I.max - I.min + 1));
        const rein = recent === key;
        s.inj = Math.max(s.inj || 0, n); s.injTot = s.inj; s.injK = key; s.injAt = now; s.injN = (s.injN || 0) + 1;
        s.injT = I.n + (rein ? ' (reincidência)' : '');
        EVENTS.injuryNews(S, id, s.inj, s.injT, Wd.ownerOf(S, id));
      }
      // cartões contam na competição do jogo (liga, Copa do Brasil, continentais, regionais)
      if (x.rc || x.yc) { const g = Wd.grpOf(f.comp) || 'L'; s.susC = s.susC || {}; s.ycC = s.ycC || {};
        if (s.sus > 0 && !Object.keys(s.susC).length) { s.susC.L = s.sus; }   // suspensão antiga: vale na liga
        if (x.rc) { s.susC[g] = x.yc >= 2 ? 1 : 2; delete s.ycC[g]; }
        else { s.ycC[g] = (s.ycC[g] || 0) + x.yc; if (s.ycC[g] >= 3) { s.susC[g] = 1; delete s.ycC[g]; } }
        const v = Object.values(s.susC); s.sus = v.length ? Math.max(...v) : 0; s.yc = s.ycC.L || 0;
        if (!v.length) delete s.susC; if (!Object.keys(s.ycC).length) delete s.ycC; }
      // valor de mercado reage ao desempenho
      const mvF = x.rt >= 8.5 ? 1.015 : x.rt >= 7.5 ? 1.007 : x.rt <= 5.2 ? 0.99 : x.rt <= 5.8 ? 0.997 : 1;
      s.mv = Math.max(500, Math.round(s.mv * mvF / 100) * 100);
    }
    // quem não jogou: sequência no banco
    for (const [T] of [[H], [A]]) if (isBR(S, T.club)) for (const id of squad(S, T.club)) if (!res.pl[id]) { const s = ps(S, id); if (s.inj > 0 || s.ban > 0 || Wd.susOf(s) > 0 || s.away > 0) continue; s.benchRun = (s.benchRun || 0) + 1; }   // lesionado/suspenso/convocado não conta como 'sem chance'
    // tabelas
    const upd = (tbl, h, a) => {
      if (!tbl[h] || !tbl[a]) return;
      const th = tbl[h], ta = tbl[a];
      th.j++; ta.j++; th.gp += res.gh; th.gc += res.ga; ta.gp += res.ga; ta.gc += res.gh;
      if (pure === 'h') { th.v++; ta.d++; th.form.push('V'); ta.form.push('D'); }
      else if (pure === 'a') { ta.v++; th.d++; th.form.push('D'); ta.form.push('V'); }
      else { th.e++; ta.e++; th.form.push('E'); ta.form.push('E'); }
      th.form = th.form.slice(-6); ta.form = ta.form.slice(-6);
    };
    for (const [club, my, ot, opp] of [[f.h, res.gh, res.ga, f.a], [f.a, res.ga, res.gh, f.h]]) if (Wd.isHuman(S, club)) Wd.asClub(S, club, () => coachRec(S, my, ot, opp, f));
    if (LEAGUES.includes(f.comp) && S.comp[f.comp]) upd(S.comp[f.comp].table, f.h, f.a);
    else if (CUPS.includes(f.comp) && !f.ko && S.comp[f.comp]) upd(S.comp[f.comp].gt, f.h, f.a);
    else if (f.comp === 'PL') { const tie = S.comp.PL.ties[f.tie]; if (f.leg === 1) tie.l1 = [res.gh, res.ga]; else { tie.l2 = [res.gh, res.ga]; const aggBr = res.gh + tie.l1[1], aggF = res.ga + tie.l1[0]; tie.win = aggBr > aggF ? tie.br : aggBr < aggF ? tie.f : (res.pens[0] > res.pens[1] ? tie.br : tie.f); tie.pens = res.pens; } }
    // forma do clube (sequências) para eventos
    for (const c of [f.h, f.a]) { S.streak = S.streak || {}; const w = (c === f.h ? 'h' : 'a'); const r_ = pure === w ? 'V' : pure === 'd' ? 'E' : 'D'; S.streak[c] = ((S.streak[c] || '') + r_).slice(-8); }
    // bilheteria 90/10: público (capacidade × procura × preço) × preço do ingresso
    const mult = f.comp === 'A' ? 1 : f.comp === 'B' ? 0.6 : f.comp === 'C' ? 0.4 : f.comp === 'CB' ? 1.2 : REGC.includes(f.comp) ? 0.8 : 1.5;
    const G = crowd(S, f, k, mult);
    const gate = G.rev;
    res.gate = { att: G.att, cap: G.cap, occ: G.occ, rev: G.rev, st: G.st, price: G.price, pm: G.pm };
    if (isBR(S, f.h)) S.cash[f.h] += Math.round(gate * (f.neutral ? 0.5 : ECON.homeShare));
    if (isBR(S, f.a)) S.cash[f.a] += Math.round(gate * (f.neutral ? 0.5 : 1 - ECON.homeShare));
    EVENTS.matchNews(S, f, res, result);
    for (const hc of [f.h, f.a]) if (Wd.isHuman(S, hc)) Wd.asClub(S, hc, () => {
      const mine = f.h === hc ? (f.neutral ? 0.5 : ECON.homeShare) : (f.neutral ? 0.5 : 1 - ECON.homeShare); S.fin.lastGate = Math.round(gate * mine); S.fin.gate = (S.fin.gate || 0) + Math.round(gate * mine);
      rewards(S, f, result === (f.h === hc ? 'h' : 'a'), derby);
    });
  }
  // estrelas e diamantes por sequência de vitórias oficiais
  // carteira: valor em estrelas (1 diamante/Ouro = starsPerDia estrelas) e registro do que entrou de forma legítima (auditoria)
  const wInAdd = (S, st, di) => { S.wIn = (S.wIn || 0) + Math.max(0, st || 0) + Math.max(0, di || 0) * C.ECON.starsPerDia; };
  function award(S, stars, dias, why) {
    S.stars = (S.stars || 0) + stars; S.dias = (S.dias || 0) + dias; wInAdd(S, stars, dias);
    S.gains = S.gains || []; S.gains.push({ stars, dias, why });
    EVENTS.news(S, { t: 'fin', title: `${stars ? `+${stars} estrela${stars > 1 ? 's' : ''}` : ''}${stars && dias ? ' e ' : ''}${dias ? `+${dias} ${MARKET.isOuro(S) ? 'Ouro' : 'diamante'}` : ''}: ${why}`, clubs: [S.club], reward: true, desk: S.__me });
  }
  function rewards(S, f, won, derby) {
    if (won) {
      S.ws = (S.ws || 0) + 1;
      if (S.ws === 3) award(S, 1, 0, '3 vitórias seguidas');
      if (S.ws === 6) award(S, 2, 0, '6 vitórias seguidas');
      if (S.ws === 10) award(S, 0, 1, '10 vitórias seguidas');
      if (derby) award(S, 1, 0, 'vitória em clássico');
    } else S.ws = 0;
  }
  // palpites da rodada
  function settleBets(S, k) {
    const key = `${S.season}-${k}`, b = S.bets && S.bets[key];
    if (!b) return;
    const ms = (S.played[k] || []);
    let ok = 0, n = 0;
    for (const [i, pick] of Object.entries(b.picks)) {
      const [h, a] = b.games[i]; const m = ms.find(x => x.h === h && x.a === a); if (!m) continue;
      n++; const r = m.gh > m.ga ? 'h' : m.gh < m.ga ? 'a' : 'd'; if (r === pick) ok++;
    }
    b.ok = ok; b.n = n; b.done = true;
    if (ok >= 10) award(S, 0, 1, `palpites: ${ok} acertos na rodada`);
    else if (ok >= 5) award(S, 1, 0, `palpites: ${ok} acertos na rodada`);
    else EVENTS.news(S, { t: 'club', title: `Palpites: ${ok} de ${n} acertos`, body: `Com 5 acertos você ganha 1 estrela; com 10, 1 ${MARKET.isOuro(S) ? 'Ouro' : 'diamante'}.`, clubs: [S.club], desk: S.__me });
  }
  // amistoso: joga agora, desgasta e lesiona, mas não mexe em cartões nem tabela
  function friendly(S, opp, home, tt, preN) {
    const t = tt ?? now(S);
    if (S.lastT && t > S.lastT) { recover(S, fdBetween(S, S.lastT, t)); S.lastT = t; } else if (!S.lastT) S.lastT = t;
    const [h, a] = home ? [S.club, opp] : [opp, S.club];
    Wd.setGrp('AMI'); const H = teamFor(S, h), A = teamFor(S, a); Wd.setGrp(null);
    const ref = C.REFEREES[hash(`ami${t}`) % 24];
    const res = SIM.simulate(H, A, { seed: hash(`ami|${mseed(S)}|${t}`), info: id => info(S, id), referee: ref, detailed: true, knockout: false });
    for (const idS in res.pl) {
      const id = +idS, x = res.pl[id], s = ps(S, id);
      // amistoso cansa menos que jogo oficial (70% do desgaste)
      if (res.cond[id] != null) s.cond = clamp(s.cond - Math.max(0, s.cond - res.cond[id]) * 0.7, 5, 100);
      s.form = Math.round((s.form * 0.85 + x.rt * 0.15) * 100) / 100;
      if (x.inj) { const r = C.rng(hash(`ainj${id}${t}`)); const n = r() < 0.75 ? 1 + Math.floor(r() * 3) : 4 + Math.floor(r() * 5); s.inj = n; s.injT = C.pick(['Pancada no tornozelo', 'Desconforto muscular', 'Estiramento na coxa'], r); EVENTS.injuryNews(S, id, n, s.injT + ' (amistoso)', Wd.ownerOf(S, id)); }
    }
    const won = home ? res.gh > res.ga : res.ga > res.gh;
    frResult(S, won);
    const f = { comp: 'AMI', h, a };
    if (preN) { if (!S.prepRes || S.prepRes.season !== S.season) S.prepRes = { season: S.season, list: [] }; S.prepRes.list[preN - 1] = { h, a, gh: res.gh, ga: res.ga }; }
    S.lastMatch = { pre: preN || undefined, k: S.slot, t, season: S.season, f, H: { club: h, xi: H.xi, formation: H.formation, style: H.style }, A: { club: a, xi: A.xi, formation: A.formation, style: A.style }, res: { gh: res.gh, ga: res.ga, pens: null, ev: res.ev, st: res.st, pl: res.pl, mom: res.mom, styles: res.styles, formations: res.formations }, ref: ref.id, watched: false, friendly: true };
    S._nt = t;
    try { EVENTS.highlights(S, { h, a, comp: 'AMI' }, { ...res, ev: res.ev || [] }, true, `${h} ${res.gh} × ${res.ga} ${a}`); } catch (e) {}
    if (preN) EVENTS.news(S, { t: 'match', front: 66, title: `Pré-temporada (${preN}/3): ${h} ${res.gh} × ${res.ga} ${a}`, body: preN < 3 ? 'Ainda dá tempo de mexer no elenco e na tática antes do próximo amistoso.' : 'Último teste antes da estreia oficial.', clubs: [S.club, opp], user: true });
    else EVENTS.news(S, { t: 'match', title: `Amistoso: ${h} ${res.gh} × ${res.ga} ${a}`, body: `Hoje: ${Math.min(3, (S.fr && S.fr.w) || 0)}/3 vitórias em ${(S.fr && S.fr.played) || 0}/5 amistosos${S.fr && S.fr.star ? ' · estrela garantida' : ''}. Sequência: ${S.fws} vitória(s) seguida(s).`, clubs: [S.club, opp], user: true });
    delete S._nt;
    Wd.touch(S);
    return res;
  }

  // depois do slot: sorteios e avanço de fases
  // copas mexem na confiança da diretoria (peso pelo tamanho da copa); título derruba ultimato
  const CUP_TIER = { LIB: 'big', CB: 'mid', SUL: 'mid', CONF: 'small', NE: 'small', SSE: 'small', VER: 'small', SC: 'small', PL: 'mid' };
  const CUP_FX = { big: { ch: 15, fin: 6, sf: 3, early: -6 }, mid: { ch: 12, fin: 5, sf: 3, early: -4 }, small: { ch: 6, fin: 2, sf: 1, early: -2 } };
  function cupBoard(S, club, comp, what) {
    if (!Wd.isHuman(S, club)) return;
    const tier = CUP_TIER[comp] || 'small', fx = CUP_FX[tier];
    const lbl = { ch: 'título', fin: 'chegou à final', sf: 'chegou à semifinal', early: 'eliminação precoce', sfL: 'caiu na semifinal', finL: 'perdeu a final' }[what];
    Wd.asClub(S, club, () => {
      if (S.club !== club) return;
      // v252: clube grande não ganha ponto só por chegar; perder a decisão custa (copa pequena pesa 40%)
      const big = bigOf(S), sc = tier === 'small' ? 0.4 : 1;
      let v = fx[what] || 0;
      if (big && what === 'sf') v = 0;
      else if (big && what === 'fin') v = Math.round(v * 0.4);
      else if (what === 'sfL') v = big ? Math.round(({ eli: -3, top: -2 })[big] * sc) : 0;
      else if (what === 'finL') v = big ? Math.round(({ eli: -5, top: -3 })[big] * sc) : 0;
      if (!v) return;
      S.board = clamp((S.board ?? 60) + v, 0, 100); plog(S, 'D', v, `${COMP_NAME[comp] || comp}: ${lbl}`);
      if (what === 'ch' && S.job && S.job.ult) { S.job.ult = null; S.job.st = 'ok'; EVENTS.news(S, { t: 'club', title: `Taça na mão: ${S.manager} deixa o ultimato pra trás`, body: `O título da ${COMP_NAME[comp] || comp} encerra a cobrança da diretoria.`, clubs: [club], desk: S.__me, front: 90 }); }
    });
  }
  function postSlot(S, k) {
    const cal = CAL[k];
    // sorteio das copas: sai logo depois do último jogo antes da 1ª rodada (a pré-Libertadores já terminou)
    try { const nx = CAL[k + 1]; if (nx && nx.type === 'C' && nx.md === 1 && !S.comp.LIB && S.comp.PL && S.comp.PL.ties.every(t => t.win)) setupContinental(S); } catch (e) {}
    if (cal.type === 'SC') {
      const m = S.played[k][0]; const win = m.gh > m.ga ? m.h : m.gh < m.ga ? m.a : (m.pens[0] > m.pens[1] ? m.h : m.a), lose = win === m.h ? m.a : m.h;
      S.comp.SC.champ = win; prize(S, win, 20000, 'Supercopa: campeão'); prize(S, lose, 8000, 'Supercopa: vice');
      EVENTS.news(S, { t: 'trophy', title: `${win} conquista a Supercopa do Brasil`, clubs: [win, lose], front: Wd.isHuman(S, win) ? 92 : 70 });
      Wd.asClub(S, win, () => { S.badges = S.badges || []; S.badges.push({ season: S.season, club: S.club, kind: 'trophy', label: 'Supercopa do Brasil' }); });
      cupBoard(S, win, 'SC', 'ch');
    }
    if (cal.type === 'CB' && cal.md === 5) return;
    if (cal.type === 'CB') {
      const rd = S.comp.CB.rounds[Math.min(cal.md, 5) - 1];
      const winners = S.played[k].filter(m => m.comp === 'CB').map(m => { const [x, y] = m.agg || [m.gh, m.ga]; return x > y ? m.h : x < y ? m.a : (m.pens[0] > m.pens[1] ? m.h : m.a); });
      if (cal.md === 6) { const w = winners[0], [h, a] = rd[0], l = w === h ? a : h; S.comp.CB.stage[l] = 4; S.comp.CB.vice = l; prize(S, l, PRIZE.CB[4], 'Copa do Brasil: vice'); S.comp.CB.champ = w; S.comp.CB.stage[w] = 5; cupBoard(S, l, 'CB', 'finL'); prize(S, w, PRIZE.CB[5], 'Copa do Brasil: campeão'); titleBonus(S, w, 'CB', 'título da Copa do Brasil'); EVENTS.news(S, { t: 'trophy', title: `${w} é campeão da Copa do Brasil`, clubs: [w], front: Wd.isHuman(S, w) ? 95 : 72 }); cupBoard(S, w, 'CB', 'ch'); return; }
      if (cal.md <= 2) rd.forEach(([h, a]) => { for (const c of [h, a]) if (!winners.includes(c)) cupBoard(S, c, 'CB', 'early'); });
      if (cal.md === 3) winners.forEach(c => cupBoard(S, c, 'CB', 'sf'));
      if (cal.md === 4) { winners.forEach(c => cupBoard(S, c, 'CB', 'fin')); rd.forEach(([h, a]) => { for (const c of [h, a]) if (!winners.includes(c)) cupBoard(S, c, 'CB', 'sfL'); }); }   // v252
      rd.forEach(([h, a]) => { for (const c of [h, a]) if (!winners.includes(c)) { S.comp.CB.stage[c] = cal.md - 1; prize(S, c, PRIZE.CB[cal.md - 1], `Copa do Brasil: ${CB_STAGES[cal.md - 1]}`); } });
      S.comp.CB.rounds.push(pairUp(winners, R(`cbr${cal.md + 1}${S.seed}${S.season}`)));
    }
    if (cal.type === 'PL' && cal.md === 2) {
      for (const t of S.comp.PL.ties) for (const c of [t.br, t.f]) { if (!isBR(S, c)) continue; const won = t.win === c, o = c === t.br ? t.f : t.br, duel = isBR(S, o);   // v249: os dois lados podem ser brasileiros
        if (!won) cupBoard(S, c, 'PL', 'early'); prize(S, c, PRIZE.PL, 'Pré-Libertadores');
        if (won || !duel) EVENTS.news(S, { t: 'match', title: won ? (duel ? `${c} elimina o ${o} e vai pra fase de grupos da Libertadores` : `${c} avança pra fase de grupos da Libertadores`) : `${c} cai na pré-Libertadores e vai pra Sul-Americana`, body: duel ? `Duelo brasileiro na pré: o ${o} segue na Sul-Americana.` : undefined, clubs: duel ? [c, o] : [c] }); }
    }
    if (cal.type === 'C' && cal.md === 6) {
      for (const key of CUPS) {
        const Cp = S.comp[key]; if (!Cp) continue;
        const rank = Cp.groups.map(g => standings(Object.fromEntries(g.map(c => [c, Cp.gt[c]]))).map(x => x.c));
        const qf = [[rank[0][0], rank[1][1]], [rank[1][0], rank[0][1]], [rank[2][0], rank[3][1]], [rank[3][0], rank[2][1]]];
        Cp.ko = [qf]; Cp.rank = rank;
        { const inQ = new Set(qf.flat()); for (const c of Cp.teams) if (!inQ.has(c)) cupBoard(S, c, key, 'early'); }
        for (const [a, b] of qf) for (const c of [a, b]) { Cp.stage[c] = 1; prize(S, c, PRIZE[key].qf, `${COMP_NAME[key]}: quartas`); }
      }
    }
    if (cal.type === 'CK') {
      for (const key of CUPS) {
        const Cp = S.comp[key]; if (!Cp) continue;
        const ms = S.played[k].filter(m => m.comp === key);
        const winners = ms.map(m => m.gh > m.ga ? m.h : m.gh < m.ga ? m.a : (m.pens[0] > m.pens[1] ? m.h : m.a));
        if (cal.md < 3) {
          const nx = []; for (let i = 0; i < winners.length; i += 2) nx.push([winners[i], winners[i + 1]]);
          Cp.ko.push(nx);
          for (const c of winners) { Cp.stage[c] = cal.md + 1; prize(S, c, cal.md === 1 ? PRIZE[key].sf : PRIZE[key].ru, `${COMP_NAME[key]}: ${cal.md === 1 ? 'semifinal' : 'final'}`); cupBoard(S, c, key, cal.md === 1 ? 'sf' : 'fin'); }
          if (cal.md === 2) for (const m of ms) for (const c of [m.h, m.a]) if (!winners.includes(c)) cupBoard(S, c, key, 'sfL');   // v252
        } else {
          Cp.champ = winners[0]; Cp.stage[winners[0]] = 4;
          for (const m of ms) for (const c of [m.h, m.a]) if (c !== winners[0]) cupBoard(S, c, key, 'finL');   // v252
          prize(S, winners[0], PRIZE[key].ch - PRIZE[key].ru, `${COMP_NAME[key]}: campeão`); cupBoard(S, winners[0], key, 'ch');
          EVENTS.news(S, { t: 'trophy', title: `${winners[0]} conquista a ${COMP_NAME[key]}`, clubs: [winners[0]], front: Wd.isHuman(S, winners[0]) ? 92 : REGC.includes(key) ? 40 : 70 });
          titleBonus(S, winners[0], REGC.includes(key) ? 'REG' : key, `título da ${COMP_NAME[key]}`);
        }
      }
    }
  }

  // ---------- laço principal ----------
  function process(S, limit = 200) {
    foldPause(S);
    try { cotaTick(S); } catch (e) { oops(S, 'cota da temporada', e); }
    try { repairBuys(S); } catch (e) { oops(S, 'recibo de compra', e); }   // v190
    MARKET.settlePending(S);   // apresenta os jogadores na abertura, antes do primeiro jogo da janela
    // Corrige estados salvos por versões antigas depois do segundo jogo da Data FIFA.
    for (const id in S.ps) if (S.ps[id].away === 1) S.ps[id].away = 0;
    try { migrateObjectives(S); } catch (e) {}
    try { serieCMig(S); } catch (e) { oops(S, 'Série C', e); }
    try { balanceFix(S); } catch (e) { oops(S, 'equilíbrio da liga', e); }
    try { repairTransfers(S); } catch (e) { oops(S, 'correção de transferências', e); }
    try { callupEarly(S); } catch (e) { oops(S, 'convocação', e); }
    prepTick(S, now(S));
    const out = { slots: [], userMatch: false, seasonEnded: false };
    let guard = 0;
    while (guard++ < limit) {
      if (S.slot >= SLOTS) {
        if (!S.post) { closeSeason(S); out.seasonClosed = true; }
        try { dailyUntil(S, now(S)); intTick(S); if (S.post) postDay(S, dayAbs(S, now(S))); } catch (e) { oops(S, 'Intercontinental', e); }   // v280: acabou a Intercontinental, a Premiação sai na hora certa
        if (canRoll(S)) { rollover(S); out.seasonEnded = true; continue; }
        break;
      }
      const t = slotTime(S, S.slot);
      const tNow = now(S);
      // dias que passaram antes do jogo
      dailyUntil(S, Math.min(t, tNow));
      if (t > tNow) break;
      const k = S.slot;
      const hadUser = fixturesOf(S, k).some(f => f.h === S.club || f.a === S.club);
      runSlot(S, k);
      try { clinchTick(S); } catch (e) { oops(S, 'título/acesso garantidos', e); }   // v236
      try { trophyTick(S); } catch (e) { oops(S, 'troféus na galeria', e); }   // v245
      try { callupEarly(S); } catch (e) { oops(S, 'convocação', e); }
      out.slots.push(k);
      if (hadUser) out.userMatch = true;
    }
    dailyUntil(S, now(S));
    dayRecover(S, now(S));
    try { EVENTS.fdTick(S); } catch (e) { oops(S, 'jornais e treinos', e); }
    try { healthTick(S); } catch (e) {}
    try { const nx = CAL[S.slot]; if (nx && nx.type === 'C' && nx.md === 1 && !S.comp.LIB && S.comp.PL && S.comp.PL.ties.every(t => t.win)) setupContinental(S); } catch (e) {}
    try { clinchTick(S); } catch (e) { oops(S, 'título/acesso garantidos', e); }   // v236: liga que já passou do ponto recebe agora
    try { trophyTick(S); } catch (e) { oops(S, 'troféus na galeria', e); }   // v245: liga que já tinha campeão recebe agora
    MARKET.settlePending(S);
    Wd.forDesks(S, () => resolveInvites(S));
    EVENTS.flush(S);
    return out;
  }
  // v236: título, acesso e rebaixamento garantidos antes do fim (matemática conservadora: só avisa quando nada mais muda, empate conta como "ainda dá")
  // Uma notícia por clube e situação na temporada (S.clinch). Liga que já passou do ponto recebe na próxima rodada processada.
  // v245: o troféu entra na galeria do treinador assim que o título é decidido (copa: na final; liga: quando ninguém mais alcança o líder).
  // Antes só entrava no apito final da temporada (closeSeason). A festa da taça continua na última rodada.
  const TROPHIES = [['A', 'Campeão da Série A'], ['B', 'Campeão da Série B'], ['C', 'Campeão da Série C'], ['CB', 'Copa do Brasil'], ['LIB', 'Libertadores'], ['SUL', 'Sul-Americana'], ['CONF', 'Conferência'], ['NE', 'Copa do Nordeste'], ['SSE', 'Copa Sul-Sudeste'], ['VER', 'Copa Verde']];
  function giveTrophy(S, club, label, season) {
    if (!club || !Wd.isHuman(S, club)) return false;
    let ok = false;
    Wd.asClub(S, club, () => { S.badges = S.badges || []; if (S.badges.some(b => b.kind === 'trophy' && b.label === label && b.season === season)) return; S.badges.push({ season, club, kind: 'trophy', label }); ok = true; });
    return ok;
  }
  function trophyTick(S) {
    if (!S.comp) return 0;
    const K = S.clinch && S.clinch.s === S.season ? S.clinch.k : {}; let n = 0;
    for (const [k, label] of TROPHIES) {
      let champ = null;
      if (k === 'A' || k === 'B' || k === 'C') { const key = Object.keys(K).find(x => x.startsWith(k + '|t|')); champ = key ? key.slice(4) : null; }
      else champ = S.comp[k] && S.comp[k].champ;
      if (champ && giveTrophy(S, champ, label, S.season)) n++;
    }
    return n;
  }
  function clinchTick(S) {
    if (!S.comp || S.post || S.slot >= SLOTS) return 0;
    if (!S.clinch || S.clinch.s !== S.season) S.clinch = { s: S.season, k: {} };
    const K = S.clinch.k; let n = 0;
    const once = (key, fn) => { if (K[key]) return; K[key] = 1; n++; fn(); };
    const ord = r => r === 1 ? '1 rodada' : `${r} rodadas`;
    for (const d of ['A', 'B', 'C']) {
      const comp = S.comp[d]; if (!comp || !comp.table) continue;
      const rows = standings(comp.table), N = rows.length; if (N < 8) continue;
      const total = 2 * (N - 1); if (!rows.every(r => r.j >= 1)) continue;
      const max = r => r.pts + 3 * Math.max(0, total - r.j), left = r => Math.max(0, total - r.j);
      const nm = d === 'A' ? 'brasileiro' : `da Série ${d}`;
      // título: o líder tem mais pontos do que qualquer outro consegue alcançar
      const L = rows[0];
      if (left(L) > 0 && rows.slice(1).every(r => max(r) < L.pts)) once(`${d}|t|${L.c}`, () => EVENTS.news(S, { t: 'trophy', front: d === 'A' ? 97 : 88, clubs: [L.c],
        title: `${L.c} é campeão ${nm} com ${ord(left(L))} de antecedência`, body: `Com ${L.pts} pontos, ninguém mais alcança. O troféu já está na galeria; a taça é levantada na última rodada.` }));
      // vagas pra cima (B e C: 4 sobem) e pra baixo (A e B: 4 caem; C: os que caem pra D)
      const up = d === 'A' ? 0 : 4;
      let dn = d === 'C' ? 0 : 4;
      if (d === 'C') { try { dn = Math.min(4, (pickUpD(S) || []).length); } catch (e) { dn = 0; } }
      if (d === 'B' && !(S.comp.C && S.divC && S.divC.length >= 8)) dn = 0;
      const to = { B: 'A', C: 'B' }[d], fall = { A: 'B', B: 'C', C: 'D' }[d];
      for (const r of rows) {
        const above = rows.filter(o => o !== r && max(o) >= r.pts).length;   // quem ainda pode terminar na frente (ou empatado)
        if (up && above < up && left(r) > 0) once(`${d}|u|${r.c}`, () => EVENTS.news(S, { t: 'club', front: 84, clubs: [r.c], title: `${r.c} garante o acesso à Série ${to}`, body: `Com ${r.pts} pontos e ${ord(left(r))} pela frente, já não sai dos ${up} primeiros da Série ${d}.` }));
        const sure = rows.filter(o => o !== r && o.pts > max(r)).length;   // quem já terminou na frente com certeza
        if (dn && sure >= N - dn && left(r) > 0) once(`${d}|d|${r.c}`, () => EVENTS.news(S, { t: 'club', front: 80, clubs: [r.c], title: `${r.c} está rebaixado para a Série ${fall}`, body: `Mesmo vencendo os ${left(r)} jogos que faltam, não sai da zona de rebaixamento da Série ${d}.` }));
      }
    }
    return n;
  }
  function dailyUntil(S, t) {
    const target = dayAbs(S, t);
    if (S.lastDay === undefined) S.lastDay = dayAbs(S, S.created) - 1;
    while (S.lastDay < target) { S.lastDay++; dayTick(S, S.lastDay); }
  }
  // ---------- salários atrasados: caixa negativo = folha não paga ----------
  // gravidade cresce com dias de atraso, tamanho da dívida e reincidência; pagar tudo encerra a crise, mas a fama de mau pagador demora a sumir
  function arrearsTick(S, d) {
    S.arrears = S.arrears || {};
    const r = C.rng(hash(`arr${S.seed}${d}`));
    for (const c of Wd.brClubs(S)) {
      const A = S.arrears[c] || (S.arrears[c] = { days: 0, owed: 0, count: 0, rep: 0, season: S.season });
      if (A.season !== S.season) { A.count = 0; A.season = S.season; }
      const pay = Wd.payroll(S, c) || 1, human = Wd.isHuman(S, c);
      if ((S.cash[c] || 0) >= 0) {
        if (A.days > 0) {
          EVENTS.news(S, { t: 'fin', title: `${c} coloca os salários em dia`, body: `Depois de ${A.days} dia(s) de atraso, o elenco recebeu. O ambiente melhora, mas a desconfiança fica por um tempo.`, clubs: [c], minor: !human });
          for (const id of Wd.squad(S, c)) Wd.ps(S, id).mor = clamp(Wd.ps(S, id).mor + 4, 0, 100);
        }
        A.days = 0; A.owed = 0; A.rep = Math.max(0, A.rep - 1);
        continue;
      }
      if (A.days === 0) A.count++;
      A.days++; A.owed = -S.cash[c]; A.rep = Math.min(30, A.rep + 2);
      const sev = (1 + 0.5 * (A.count - 1)) * (A.owed > pay * 6 ? 1.4 : 1), sq = Wd.squad(S, c);
      const drop = Math.round((A.days <= 1 ? 2 : A.days <= 3 ? 3 : 4) * sev);
      for (const id of sq) Wd.ps(S, id).mor = clamp(Wd.ps(S, id).mor - drop, 0, 100);
      const lead = sq.slice().sort((a, b) => (Wd.age(S, b) + Wd.view(S, b).ovr / 3) - (Wd.age(S, a) + Wd.view(S, a).ovr / 3))[0];
      if (A.days === 1 && (human || A.count > 1)) EVENTS.news(S, { t: 'fin', title: `${c} atrasa salários do elenco`, body: `Sem caixa para a folha (T$ ${C.fmt(pay)}/dia). Jogadores estranham e a moral cai.${A.count > 1 ? ' Não é a primeira vez nesta temporada.' : ''}`, clubs: [c], minor: !human });
      if (A.days === 3 && lead) {
        EVENTS.news(S, { t: 'press', title: `${Wd.P[lead].short} cobra a diretoria do ${c}: "Queremos receber"`, body: `Líder do elenco fala em nome do grupo. Dívida com os jogadores já passa de T$ ${C.fmt(A.owed)}.`, ids: [lead], clubs: [c], front: human ? 80 : 0, minor: !human });
        if (human) Wd.asClub(S, c, () => { S.board = clamp((S.board ?? 60) - 4, 0, 100); });
      }
      if (A.days >= 4 && human) Wd.asClub(S, c, () => { S.board = clamp((S.board ?? 60) - 2, 0, 100); });
      if (A.days === 4 || (A.days > 4 && A.days % 3 === 1)) {   // pedidos para sair
        const out = sq.filter(id => !Wd.ps(S, id).loan && Wd.view(S, id).ovr >= 68 && Wd.ps(S, id).wantOut !== S.season).sort((a, b) => Wd.view(S, b).ovr - Wd.view(S, a).ovr).slice(0, 2);
        for (const id of out) { const s2 = Wd.ps(S, id); s2.wantOut = S.season; s2.mor = Math.min(s2.mor, 30);
          EVENTS.news(S, { t: 'transfer', title: `${Wd.P[id].short} pede para deixar o ${c}`, body: `Com ${A.days} dias de salários atrasados, o jogador avisa que quer ser negociado e não pensa em renovar.`, ids: [id], clubs: [c], minor: !human }); }
      }
      if (A.days >= 6 && A.days % 2 === 0 && r() < 0.35 * sev) {   // atraso longo: rescisão na Justiça
        const cand = sq.filter(id => !Wd.ps(S, id).loan && Wd.view(S, id).mor < 40).sort((a, b) => Wd.view(S, b).sal - Wd.view(S, a).sal)[0];
        if (cand && sq.length > 18) { Wd.move(S, cand, 'Livre', false, { t: 'rescisao' }); S.free.push(cand);
          EVENTS.news(S, { t: 'transfer', title: `${Wd.P[cand].name} consegue rescisão na Justiça e deixa o ${c}`, body: `Motivo: ${A.days} dias de salários atrasados. O jogador está livre no mercado e o clube não recebe nada.`, ids: [cand], clubs: [c], front: human ? 90 : 0, minor: !human }); }
      }
    }
  }
  const arrearsOf = (S, c) => (S.arrears && S.arrears[c]) || null;
  function dayTick(S, d) {
    Wd.numbersTick(S);
    // salários (diários)
    for (const c of Wd.brClubs(S)) S.cash[c] = (S.cash[c] || 0) - Wd.payroll(S, c);
    try { cotaTick(S); } catch (e) {}   // v175: antecipa a cota de quem ficou negativo antes de cobrar atraso
    Wd.forDesks(S, () => { if (!S.unemployed) S.fin.wages = (S.fin.wages || 0) + Wd.payroll(S, S.club); });
    arrearsTick(S, d);
    TRAIN.daily(S, d);
    MARKET.daily(S, d);
    EVENTS.daily(S, d);
    try { auditTick(S, d); } catch (e) { oops(S, 'auditoria', e); }
    if (S.post) postDay(S, d);
    Wd.forDesks(S, t => { if (!S.unemployed) aiInvite(S, C.rng(hash(`inv${S.seed}${d}${t}`))); });
  }

  // ---------- fim de temporada ----------
  // 1) apito final do último jogo: competições concluídas, tabelas finais, campeões, rebaixados e classificados, prêmios em dinheiro
  // 2) dia seguinte: Encerramento (balanço, aposentadorias, contratos que vencem)
  // 3) Dia da Premiação (Melhor Jogador, Assistente, Treinador, Time da Temporada)
  // 4) Último dia livre: tudo continua consultável; a próxima temporada só começa quando a maioria apertar NOVA TEMPORADA
  const POST_PH = ['final', 'enc', 'prem', 'livre'];
  // v280: a Premiação vem DEPOIS da Intercontinental: o Dia da Premiação é o dia seguinte ao do jogo (no mínimo d0+2, como antes);
  // enquanto o jogo não acontece, a fase fica no Encerramento. Último dia livre = o dia depois da Premiação.
  function postPremDay(S) {
    const Pp = S.post; if (!Pp) return null; let pd = Pp.d0 + 2;
    try { const I = S.comp && S.comp.INT; if (I && I.season === Pp.season && I.games && I.games.length) { const g = I.games[I.games.length - 1]; if (g && g.t) pd = Math.max(pd, dayAbs(S, g.t) + 1); } } catch (e) {}
    return pd;
  }
  function postIdx(S, d) { const Pp = S.post; if (!Pp || d <= Pp.d0) return 0; const pd = postPremDay(S); let i = d < pd ? 1 : d < pd + 1 ? 2 : 3; if (i >= 2 && intPending(S)) i = 1; return i; }
  function postPhase(S) { if (!S.post) return null; return POST_PH[postIdx(S, dayAbs(S, now(S)))]; }
  function postStart(S, k) { const Pp = S.post; if (!Pp) return null; const pd = postPremDay(S); return sportDayStart(S, k <= 1 ? Pp.d0 + k : k === 2 ? pd : pd + 1); }
  function readyInfo(S) {
    const act = Object.entries(S.desks || {}).filter(([, d]) => !d.unemployed && d.club);
    const n = act.length, ok = act.filter(([, d]) => d.ready === S.season).length;
    const adm = S.league && S.desks && S.desks[S.league.admin];
    return { n, ok, need: Math.floor(n / 2) + 1, force: !!(adm && adm.forceNext === S.season), who: act.filter(([, d]) => d.ready === S.season).map(([t]) => t) };
  }
  function canRoll(S) {
    if (!S.post) return false;
    if (intPending(S)) return false;   // v268: a temporada só vira depois da Intercontinental
    const r = readyInfo(S);
    if (r.force) return true;
    return postPhase(S) === 'livre' && r.n > 0 && r.ok >= r.need;
  }
  // ---------- saúde da liga: checagens automáticas (boletim diário pro ADM) ----------
  function oops(S, where, e) {
    try { S.health = S.health || {}; const L = S.health.err = S.health.err || []; const msg = String((e && e.message) || e).slice(0, 160);
      const last = L[L.length - 1]; if (last && last.w === where && last.m === msg) { last.n = (last.n || 1) + 1; last.t = Date.now(); return; }
      L.push({ t: Date.now(), w: where, m: msg }); if (L.length > 30) L.splice(0, L.length - 30); } catch (x) {}
  }
  function health(S) {
    const out = [], add = (lvl, txt) => out.push({ l: lvl, x: txt });
    const P = Wd.P, t = now(S);
    // elencos
    for (const c of Wd.brClubs(S)) { const n = Wd.squad(S, c).length; if (n < ECON.squadMin) add('alto', `${c} com só ${n} jogadores no elenco (mínimo ${ECON.squadMin}).`); else if (n > ECON.squadMax) add('medio', `${c} com ${n} jogadores (máximo ${ECON.squadMax}).`); }
    // referências quebradas
    const bad = Object.keys(S.own || {}).filter(id => !P[id]); if (bad.length) add('alto', `${bad.length} jogador(es) no estado da liga que não existem mais na base.`);
    const freeOwned = (S.free || []).filter(id => P[id] && Wd.ownerOf(S, id) !== 'Livre'); if (freeOwned.length) add('baixo', `${freeOwned.length} jogador(es) na lista de livres mas com clube.`);
    // caixa
    for (const c in S.cash || {}) if (!Number.isFinite(S.cash[c])) add('alto', `Caixa inválido no ${c}.`);
    // jogos atrasados
    for (let k = 0; k < Math.min(S.slot || 0, SLOTS); k++) { try { if (fixturesOf(S, k).length && !(S.played && S.played[k])) { add('alto', `Jogos do dia ${k + 1} não aparecem como jogados.`); break; } } catch (e) { break; } }
    if (S.slot < SLOTS && slotTime(S, S.slot) < t - 3 * 3600000 && !paused(S)) add('alto', `Próximo jogo (dia ${S.slot + 1}) está atrasado há mais de 3 horas.`);
    for (const k of LEAGUES) { const tb = S.comp && S.comp[k] && S.comp[k].table; if (tb) for (const c in tb) if (!Number.isFinite(tb[c].v + tb[c].e + tb[c].d + tb[c].gp)) add('alto', `Tabela da Série ${k} com número inválido (${c}).`); }
    if ((S.pending || []).some(p => p.at < t - 3600000)) add('medio', 'Notícias agendadas que não saíram há mais de 1 hora.');
    // mesas dos treinadores
    let fd = null; try { fd = Math.floor(fdAt(S, t)); } catch (e) {}
    for (const tok in S.desks || {}) { const d = S.desks[tok]; if (!d) continue; const who = d.manager || tok;
      if (d.ptrain && (d.ptrain.s !== S.season || (fd != null && fd > d.ptrain.fd1 + 1))) add('alto', `Treino individual de ${who} passou do prazo e não terminou.`);
      if (!Number.isFinite(d.stars ?? 0) || (d.stars ?? 0) < 0) add('medio', `Estrelas inválidas na conta de ${who}.`);
      const xi = (d.tactics && d.tactics.xi) || []; const alien = xi.filter(id => id != null && Wd.ownerOf(S, id) !== d.club).length;
      if (!d.unemployed && alien > 3) add('baixo', `Escalação salva de ${who} tem ${alien} jogadores que não são do clube (o jogo completa sozinho).`);
    }
    // empréstimos vencidos
    let lo = 0; for (const id in S.ps || {}) { const x = S.ps[id].loanOut; if (x && (x.season < S.season || (x.end != null && (S.slot || 0) > x.end + 2))) lo++; } if (lo) add('medio', `${lo} empréstimo(s) passaram do prazo e não voltaram.`);
    { const al = ((S.audit && S.audit.al) || []).filter(x => x.s === S.season && (S.lastDay || 0) - x.d <= 1); if (al.length) add('medio', `${al.length} movimentação(ões) suspeita(s) nas últimas 24h: veja em Movimentações suspeitas.`); }
    const err = ((S.health && S.health.err) || []).filter(e => t - e.t < 26 * 3600000 || Date.now() - e.t < 26 * 3600000);
    for (const e of err) add('alto', `Erro no processamento (${e.w}${e.n > 1 ? `, ${e.n}×` : ''}): ${e.m}`);
    return out;
  }
  // ---------- auditoria financeira (ADM): movimentações suspeitas dos clubes com treinador ----------
  // Só alerta, não pune. Cada alerta: { k tipo, s temporada, d dia, c clube, w treinador, v valor, x texto, id jogador }
  const AUD_KIND = { caixa: 'Caixa que não fecha', revenda: 'Revenda com lucro alto', amigos: 'Negócio entre treinadores', idavolta: 'Ida e volta', pacote: 'Farm de pacote/livre', rapido: 'Caixa crescendo rápido', rico: 'Caixa muito acima da divisão', folha: 'Folha maior que a receita', reparo: 'Transferência corrigida', carteira: 'Carteira sem explicação', dupclube: 'Clube com 2 técnicos (corrigido)' };
  const K = v => `T$ ${C.fmt(Math.round(v))}`;
  function audAdd(S, key, al) {
    const A = S.audit; if (A.seen[key]) return; A.seen[key] = S.season;
    A.al.unshift({ t: Date.now(), s: S.season, d: S.lastDay || 0, k: S.slot || 0, ...al });
    if (A.al.length > 80) A.al.length = 80;
  }
  // transferência registrada no histórico que não ficou valendo (o jogador aparece de volta no clube de origem): corrige e avisa o ADM
  function repairTransfers(S) {
    S.audit = S.audit || { al: [], seen: {}, snap: {} }; S.audit.seen = S.audit.seen || {}; S.audit.al = S.audit.al || [];
    const L = (S.trlog || []).filter(e => e[0] === S.season), last = {};
    for (const e of L) last[e[2]] = e;
    let n = 0;
    for (const k in last) {
      const e = last[k], id = +k, from = e[3], to = e[4];
      if (!P[id] || !to || to === 'Aposentado' || from === 'Livre' || from === '?' || from === to) continue;
      const cur = Wd.ownerOf(S, id);
      if (cur === to || cur !== from) continue;
      if (MARKET.pendingOf && MARKET.pendingOf(S, id)) continue;
      // evidência do estado ANTES do reparo (pra investigar a causa depois)
      const v = S.ps[id] || {}, pick = o => o ? JSON.parse(JSON.stringify(o)) : null;
      const pair = L.filter(x => x !== e && x[1] === e[1] && (x[3] === to || x[4] === to || x[3] === from || x[4] === from)).map(x => ({ e: x, own: Wd.ownerOf(S, x[2]), ok: Wd.ownerOf(S, x[2]) === x[4] }));
      const ev = { at: Date.now(), d: S.lastDay || 0, k: S.slot || 0, id, name: P[id].name, entry: e.slice(), ownBefore: cur, inFree: (S.free || []).includes(id), num: S.nums && S.nums[id] ? S.nums[id].slice() : null,
        ps: { lock: v.lock, sal: v.sal, ce: v.ce, loan: pick(v.loan), loanOut: pick(v.loanOut), list: !!v.list }, cash: { [from]: Math.round(S.cash[from] || 0), [to]: Math.round(S.cash[to] || 0) }, pair };
      S.audit.ev = [ev, ...(S.audit.ev || [])].slice(0, 20);
      // mesmos passos de uma transferência (número de camisa, lista de livres), sem novo registro no histórico e sem mexer na trava
      Wd.move(S, id, to, true, { nolog: 1 });
      if (to === 'Livre' && !S.free.includes(id)) S.free.push(id);
      n++;
      const bad = pair.filter(p => !p.ok);
      audAdd(S, `reparo|${id}|${e[1]}`, { a: 'reparo', c: to === 'Livre' ? from : to, w: '', v: e[5] || 0, id, ev: 1,
        x: `Correção provisória: ${P[id].name} aparecia de volta no ${from}, mas o histórico registra ${e[6] === 'troca' ? 'a troca' : 'a transferência'} pro ${to} (jogo ${e[1]}). A propriedade foi corrigida; dinheiro, salário e contrato NÃO foram mexidos.${pair.length ? ` Outra parte da negociação: ${pair.map(p => `${P[p.e[2]] ? P[p.e[2]].short : p.e[2]} ${p.ok ? 'ok' : `divergente (está no ${p.own})`}`).join(', ')}.` : ''}${bad.length ? ' ATENÇÃO: a outra parte também diverge.' : ''} Estado anterior guardado pra investigação.` });
    }
    n += repairBuys(S);
    if (n) Wd.touch(S);
    return n;
  }
  // v190: compra registrada no recibo da mesa (S.buys) mas desfeita no mundo (jogador de volta ao clube antigo e sem registro no histórico)
  function repairBuys(S) {
    let n = 0; S.audit = S.audit || { al: [], seen: {}, snap: {} }; S.audit.al = S.audit.al || []; S.audit.seen = S.audit.seen || {};
    for (const [t, dk] of Object.entries(S.desks || {})) for (const b of (dk && dk.buys) || []) {
      if (!b || b.s !== S.season || b.fix || !P[b.id]) continue;
      if (Wd.ownerOf(S, b.id) !== b.from) continue;   // está no clube novo (ou já saiu de lá depois): nada a fazer
      if ((S.trlog || []).some(e => e[0] === S.season && e[2] === b.id && e[1] >= b.k)) continue;   // houve outra transferência registrada
      const ev = { at: Date.now(), d: S.lastDay || 0, k: S.slot || 0, id: b.id, name: P[b.id].name, buy: { ...b }, ownBefore: b.from, kind: 'recibo' };
      S.audit.ev = [ev, ...(S.audit.ev || [])].slice(0, 20);
      Wd.move(S, b.id, b.to, false, { t: 'compra', fee: b.fee });
      const s = Wd.ps(S, b.id); s.sal = b.sal; s.ce = b.ce;
      if (b.sw != null && P[b.sw] && Wd.ownerOf(S, b.sw) === b.to) Wd.move(S, b.sw, b.from, false, { t: 'troca', fee: 0 });
      b.fix = 1; n++;
      EVENTS.news(S, { t: 'transfer', title: `Contratação confirmada: ${P[b.id].name} é do ${b.to}`, body: `A transferência acertada no jogo ${b.k} tinha sido desfeita por uma falha de sincronização. Foi refeita nas mesmas condições (taxa já paga, salário T$ ${C.fmt(b.sal)}/dia até ${b.ce}).`, ids: [b.id], clubs: [b.to], desk: t });
      audAdd(S, `recibo|${b.id}|${b.k}`, { a: 'reparo', c: b.to, w: '', v: b.fee || 0, id: b.id, ev: 1, x: `Correção automática: ${P[b.id].name} tinha voltado pro ${b.from}, mas o recibo do treinador registra a compra no jogo ${b.k}. Refeita sem mexer no caixa.` });
    }
    if (n) Wd.touch(S);
    return n;
  }
  function auditTick(S, d) {
    const A = S.audit = S.audit || { al: [], seen: {}, snap: {} };
    A.snap = A.snap || {}; A.seen = A.seen || {}; A.al = A.al || [];
    try { repairTransfers(S); } catch (e) { oops(S, 'correção de transferências', e); }
    for (const k in A.seen) if (A.seen[k] < S.season - 1) delete A.seen[k];
    const humans = {}; for (const [t, dk] of Object.entries(S.desks || {})) if (dk && dk.club && !dk.unemployed) humans[dk.club] = { t, who: dk.manager || t, dk };
    // 1, 5, 6: caixa por dia (registro dos últimos 15 dias de cada treinador)
    for (const c in humans) {
      const { t, who, dk } = humans[c], f = dk.fin || {}, pz = Object.values((dk.seasonLog && dk.seasonLog.prizes) || {}).reduce((a, b) => a + b, 0);
      const cash = S.cash[c] || 0, inc = (f.gate || 0) + (f.sold || 0) + (f.cashout || 0) + (f.loanRefundIn || 0) + pz, out = (f.spent || 0) + (f.wages || 0) + (f.release || 0) + (f.loanRefundOut || 0);
      if (dk.wIn == null) dk.wIn = 0;   // começa o registro da carteira (a conferência vale do próximo dia em diante)
      const sv = Wd.squadValue(S, c) || 1, row = [d, Math.round(cash), Math.round(inc - out), Math.round(f.wages || 0), Math.round((f.gate || 0) + pz + (f.sold || 0)), Math.round((dk.stars || 0) + (dk.dias || 0) * C.ECON.starsPerDia), Math.round(dk.wIn || 0)];
      const H = (A.snap[t] && A.snap[t].c === c && A.snap[t].s === S.season) ? A.snap[t].h : [];
      const prev = H[H.length - 1];
      if (prev && d - prev[0] <= 2) {
        const un = (row[1] - prev[1]) - (row[2] - prev[2]);
        const ev = (S.news || []).some(n => n.s === S.season && n.d > prev[0] && n.d <= d && (n.clubs || []).includes(c) && (n.t === 'fin' || n.t === 'event' || n.t === 'transfer' || n.t === 'coach'));
        if (Math.abs(un) >= Math.max(8000, sv * 0.03) && !ev) audAdd(S, `caixa|${c}|${d}`, { a: 'caixa', c, w: who, v: un, x: `O caixa ${un > 0 ? 'subiu' : 'caiu'} ${K(Math.abs(un))} a mais do que explicam bilheteria, prêmios, vendas, compras e salários, e não houve evento financeiro no dia.` });
      }
      // carteira: estrelas/diamantes/Ouro que apareceram sem prêmio registrado (só compara registros que já têm a carteira)
      if (prev && prev.length >= 7 && dk.wIn != null) {
        const unW = (row[5] - prev[5]) - (row[6] - prev[6]);
        if (unW >= 5) { const K2 = C.ECON.starsPerDia, gem = MARKET.isOuroClub(S, c) ? 'Ouro' : 'diamante';
          audAdd(S, `carteira|${t}|${d}`, { a: 'carteira', c, w: who, v: unW, x: `A carteira subiu o equivalente a ${unW} estrelas sem prêmio registrado (agora: ${dk.stars || 0} estrelas e ${dk.dias || 0} ${gem}; 1 ${gem} = ${K2} estrelas).` }); }
      }
      H.push(row); while (H.length > 15) H.shift();
      A.snap[t] = { c, s: S.season, h: H };
      const w7 = H.find(x => x[0] >= d - 7) || H[0];
      if (w7 && w7 !== row) { const g = row[1] - w7[1]; if (g >= Math.max(40000, sv * 0.35)) audAdd(S, `rapido|${c}|${S.season}|${Math.floor(d / 7)}`, { a: 'rapido', c, w: who, v: g, x: `Ganhou ${K(g)} de caixa em ${d - w7[0]} dias (elenco vale ${K(sv)}).` }); }
      const w14 = H[0];
      if (w14 && d - w14[0] >= 10) { const wg = row[3] - w14[3], rv = row[4] - w14[4], dc = row[1] - w14[1];
        if (wg >= 5000 && wg > 1.8 * Math.max(1, rv) && dc >= 0) audAdd(S, `folha|${c}|${S.season}|${Math.floor(d / 14)}`, { a: 'folha', c, w: who, v: wg - rv, x: `Em ${d - w14[0]} dias pagou ${K(wg)} de salários e arrecadou só ${K(rv)}, mas o caixa não caiu (${dc >= 0 ? '+' : ''}${K(dc)}). O dinheiro veio de onde?` }); }
      const div = Wd.divOf(S, c); if (div) { const L = Wd.divList(S, div).map(x => S.cash[x] || 0).sort((a, b) => a - b), med = L[L.length >> 1] || 0;
        if (cash >= Math.max(3 * med, 1.2 * sv, 30000)) audAdd(S, `rico|${c}|${S.season}`, { a: 'rico', c, w: who, v: cash, x: `Caixa de ${K(cash)}: ${med > 0 ? `${(cash / med).toFixed(1)}× a mediana da Série ${div}` : 'muito acima da divisão'} e mais que o valor do elenco (${K(sv)}).` }); }
    }
    for (const t in A.snap) if (!S.desks || !S.desks[t]) delete A.snap[t];
    // 2, 3, 4: transferências da temporada
    const L = (S.trlog || []).filter(e => e[0] === S.season), isH = c => !!humans[c];
    L.forEach((e, i) => {
      const [, k, id, from, to, fee, ty] = e; if (!isH(from) && !isH(to)) return;
      const nm = P[id] ? P[id].short : 'jogador', mv = view(S, id).mv || 1;
      if (isH(from) && fee > 0 && ['compra', 'troca'].includes(ty)) {
        const b = L.slice(0, i).reverse().find(x => x[2] === id && x[4] === from);
        if (b) {
          if (['pacote', 'livre'].includes(b[6]) && fee >= (b[6] === 'pacote' ? 5000 : 10000)) audAdd(S, `pacote|${id}|${k}`, { a: 'pacote', c: from, w: humans[from].who, v: fee, id, x: `${nm} chegou ${b[6] === 'pacote' ? 'pelo pacote' : 'de graça (livre)'} no jogo ${b[1]} e foi vendido pro ${to} por ${K(fee)} no jogo ${k}.` });
          else if (b[5] > 0 && fee - b[5] >= Math.max(15000, b[5] * 0.5)) audAdd(S, `revenda|${id}|${k}`, { a: 'revenda', c: from, w: humans[from].who, v: fee - b[5], id, x: `${nm}: comprado por ${K(b[5])} (jogo ${b[1]}) e vendido pro ${to} por ${K(fee)} (jogo ${k}). Lucro de ${K(fee - b[5])}.` });
        }
      }
      const loan = ['emprestimo', 'retorno'].includes(ty);   // empréstimo: taxa de empréstimo não é preço de venda
      if (isH(from) && isH(to) && from !== to && !loan) {
        if (fee > 0 && (fee > mv * 1.5 || fee < mv * 0.5) && Math.abs(fee - mv) >= 3000) audAdd(S, `amigos|${id}|${k}`, { a: 'amigos', c: to, w: `${humans[from].who} → ${humans[to].who}`, v: fee - mv, id, x: `${nm} do ${from} pro ${to} por ${K(fee)}, com valor de mercado de ${K(mv)} (${fee > mv ? 'muito acima' : 'muito abaixo'}). Pode ser dinheiro passando de um clube pro outro.` });
        const back = L.slice(0, i).reverse().find(x => x[2] === id && x[3] === to && x[4] === from);
        if (back && !['emprestimo', 'retorno'].includes(back[6])) audAdd(S, `idavolta|${id}|${k}`, { a: 'idavolta', c: from, w: `${humans[from].who} ↔ ${humans[to].who}`, v: fee - (back[5] || 0), id, x: `${nm} foi do ${to} pro ${from} (jogo ${back[1]}, ${K(back[5] || 0)}) e voltou (jogo ${k}, ${K(fee)}).` });
      }
    });
  }
  // alertas antigos de negócio entre treinadores que eram empréstimo: some da lista
  const audLoan = (S, a) => ['amigos', 'idavolta'].includes(a.a) && a.id != null && (S.trlog || []).some(e => e[0] === a.s && e[1] === a.k && e[2] === a.id && ['emprestimo', 'retorno'].includes(e[6]));
  const auditOf = S => ((S.audit && S.audit.al) || []).filter(a => !audLoan(S, a)).map(a => ({ ...a, n: AUD_KIND[a.a] || a.a }));
  // boletim: uma vez por dia, a partir das 7h (Brasília)
  function healthTick(S) {
    const d = new Date(Date.now() - BRT), day = d.toISOString().slice(0, 10);
    S.health = S.health || {};
    if (S.health.day === day || d.getUTCHours() < 7) return;
    S.health.day = day; S.health.at = Date.now(); S.health.daily = health(S).slice(0, 25);
  }
  // acesso da Série D: o clube da D que foi mais longe em cada copa regional (Nordeste, Sul-Sudeste, bloco Norte e bloco Centro-Oeste da Copa Verde)
  function pickUpD(S) {
    const D = Wd.divD(S), inD = new Set(D), out = [];
    const score = (key, c) => {
      const X = S.comp[key]; if (!X) return -1;
      let st = 0; (X.ko || []).forEach((rd, i) => { if ((rd || []).some(p => p && (p[0] === c || p[1] === c))) st = i + 1; });
      if (X.champ === c) st = 4;
      const t = X.gt && X.gt[c], pts = t ? t.v * 3 + t.e : 0, sg = t ? t.gp - t.gc : 0;
      return st * 1000 + pts * 10 + sg;
    };
    const blocks = [['NE', 'NE', null], ['SSE', 'SSE', null], ['VER', 'N', [0, 1]], ['VER', 'CO', [2, 3]]];
    for (const [key, reg, gi] of blocks) {
      const X = S.comp[key];
      let cand = X ? (gi ? gi.flatMap(i => (X.groups && X.groups[i]) || []) : X.teams || []).filter(c => inD.has(c) && !out.includes(c)) : [];
      cand = cand.map(c => [c, score(key, c)]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(x => x[0]);
      let pick = cand[0];
      if (!pick) pick = D.filter(c => C.regionOf(c) === reg && !out.includes(c)).sort((a, b) => strength(S, b) - strength(S, a) || a.localeCompare(b))[0];
      if (!pick) pick = D.filter(c => !out.includes(c)).sort((a, b) => strength(S, b) - strength(S, a) || a.localeCompare(b))[0];
      if (pick) out.push(pick);
    }
    return out;
  }
  // ---------- v209: vagas continentais (uma vaga por clube; quem já está classificado repassa a vaga pro próximo da tabela) ----------
  // Libertadores: 1º–4º da Série A + campeões (brasileiros) da Libertadores, da Sul-Americana e da Copa do Brasil.
  // Pré-Libertadores: os 2 seguintes + vice da Copa do Brasil. Sul-Americana: 5 seguintes. Conferência: 5 seguintes.
  // A tabela usada é a Série A até o 16º (rebaixado não herda vaga); se acabar, segue pela Série B.
  // Serve pra virada (closeSeason) e pra tela (zonas da tabela durante a temporada, com os campeões já definidos).
  function cbVice(S) {
    const cb = S.comp && S.comp.CB; if (!cb || !cb.champ) return null;
    if (cb.vice) return cb.vice;
    const v = Object.entries(cb.stage || {}).find(([c, s]) => s === 4 && c !== cb.champ); return v ? v[0] : null;
  }
  // v249: vagas brasileiras FIXAS (pedido do Vini: Libertadores lotada de brasileiros e Série B indo pra Conferência pela tabela).
  // Libertadores: 4 diretas — campeões (Libertadores, Sul-Americana, Copa do Brasil) primeiro, o resto pela tabela.
  // Pré-Libertadores: 4 brasileiros em mata-mata entre eles (vice da Copa do Brasil tem prioridade); quem vence vai pra Libertadores, quem perde pra Sul-Americana.
  // Sul-Americana: 4 (+ os 2 que caem na Pré). Conferência: 4. Tabela só da Série A (16 primeiros); Série B só entra por título.
  function qualPlan(S, rowsA, rowsB) {
    const A = (rowsA || []).map(r => r.c || r), tbl = A.slice(0, 16), rank = c => { const i = A.indexOf(c); return i < 0 ? 99 : i; };
    const out = { LIB: [], PL: [], SUL: [], CONF: [], why: {}, pass: [], plBR: 1 }, used = new Set();
    const nxt = () => { const a = tbl.find(c => !used.has(c)); return a ? [a, 'pos'] : [null]; };
    const put = (k, c, why) => { if (!c || used.has(c)) return false; used.add(c); out[k].push(c); out.why[c] = why; return true; };
    const fill = (k, n) => { while (out[k].length < n) { const [c, w] = nxt(); if (!put(k, c, w)) break; } };
    const ch = k => { const c = S.comp && S.comp[k] && S.comp[k].champ; return c && isBR(S, c) ? c : null; };
    for (const k of ['LIB', 'SUL', 'CB']) { const c = ch(k); if (c) put('LIB', c, k); }
    fill('LIB', 4);
    { const v = cbVice(S); if (v && isBR(S, v)) put('PL', v, 'CBv'); }
    fill('PL', 4);
    for (const c of tbl.slice(0, 4)) if (out.PL.includes(c) && out.why[c] === 'pos') out.why[c] = 'dPL';   // estava no G4, mas a vaga direta ficou com um campeão
    out.PL.sort((a, b) => rank(a) - rank(b));   // cabeça de chave: melhor da tabela decide em casa
    fill('SUL', 4);
    fill('CONF', 4);
    return out;
  }
  const QUAL_WHY = { LIB: 'campeão da Libertadores', SUL: 'campeão da Sul-Americana', CB: 'campeão da Copa do Brasil', CBv: 'vice da Copa do Brasil' };
  // ---------- v209: Copa Intercontinental da FIFA (depois do apito final, nos dias de encerramento) ----------
  // O campeão da Libertadores (do jogo) faz o Dérbi das Américas contra o campeão da CONCACAF; quem vence pega o campeão
  // África-Ásia-Pacífico na Copa Challenger; o vencedor enfrenta o campeão europeu na final. Campo neutro, mata-mata.
  const INT_G = [['der', 'Dérbi das Américas', 1, 0.66], ['chal', 'Copa Challenger', 2, 0.54], ['fin', 'Final', 2, 0.875]];   // formato antigo (até a v267): [chave, nome, dia depois do apito final, hora (fração do dia)]
  // v268: a Intercontinental virou JOGO ÚNICO (como antigamente): campeão da Libertadores × campeão europeu, no dia do Encerramento,
  // num horário normal de jogo da liga (o último do dia; no Turbo, o primeiro da grade a partir do início do dia). A temporada só vira depois dele.
  function intTimeGrid(S, d) {
    const a = sportDayStart(S, d), b = sportDayStart(S, d + 1), H = gridH(S), j0 = Math.floor((a - S.seasonStart) / DAY) - 1, c = [];
    for (let j = j0; j <= j0 + 4; j++) for (const h of H) c.push(S.seasonStart + j * DAY + h * HOUR);
    c.sort((x, y) => x - y);
    const inDay = c.filter(t => t >= a && t < b);
    if (inDay.length) return isTurbo(S) ? inDay[0] : inDay[inDay.length - 1];
    return c.find(t => t >= a) || Math.round(a + (b - a) * 0.75);
  }
  function intOne(S, lib, uefa) { return [{ k: 'fin', t: intTimeGrid(S, S.post.d0 + 1), h: lib, a: uefa }]; }
  // jogo da Intercontinental ainda por jogar nesta virada de temporada (segura a NOVA TEMPORADA)
  function intPending(S) { const I = S.comp && S.comp.INT; return !!(I && S.post && I.season === S.post.season && !I.champ && (I.games || []).some(g => !g.win && !g.skip)); }
  function intNextT(S) { const I = S.comp && S.comp.INT; if (!intPending(S)) return null; const g = I.games.find(x => !x.win && !x.skip); return g ? g.t : null; }
  const INT_NAME = Object.fromEntries(INT_G.map(g => [g[0], g[1]]));
  function intTime(S, d, fr) { const a = sportDayStart(S, d), b = sportDayStart(S, d + 1); return Math.round(a + (b - a) * fr); }
  function intPick(S, conf, tag) {
    const L = Object.entries(C.INT_CLUBS || {}).filter(([, k]) => k.conf === conf).map(([n]) => n).filter(n => squad(S, n).length >= 12);
    if (!L.length) return null;
    const w = L.map(n => Math.pow(Math.max(1, strength(S, n) - 55), 2)), r = C.rng(hash(`int${tag}|${S.seed}|${S.season}`));
    let x = r() * w.reduce((a, b) => a + b, 0); for (let i = 0; i < L.length; i++) { x -= w[i]; if (x <= 0) return L[i]; } return L[L.length - 1];
  }
  function intSetup(S) {
    const lib = S.comp.LIB && S.comp.LIB.champ; if (!lib || !S.post || S.comp.INT) return;
    const fx = C.INTER && C.INTER[S.season];
    const ok12 = c => c && squad(S, c).length >= 12;   // v223: elenco real curto (comprado pela liga) dá lugar a outro
    const uefa = (fx && ok12(fx.UEFA) && fx.UEFA) || intPick(S, 'UEFA', 'u');
    if (!uefa) return;
    S.comp.INT = { season: S.season, lib, uefa, con: null, aap: null, one: 1, champ: null, games: intOne(S, lib, uefa) };
    const hum = Wd.isHuman(S, lib), g0 = S.comp.INT.games[0], dt = new Date(g0.t - 3 * 3600000);
    EVENTS.news(S, { t: 'trophy', front: hum ? 97 : 80, title: `${lib} vai disputar a Copa Intercontinental`, body: `Campeão da Libertadores, enfrenta o ${uefa} (campeão europeu) em jogo único, campo neutro, dia ${dt.getUTCDate()}/${dt.getUTCMonth() + 1} às ${String(dt.getUTCHours()).padStart(2, '0')}:${String(dt.getUTCMinutes()).padStart(2, '0')}. Quem vencer é campeão do mundo.${hum ? ' A escalação é a da sua tática atual.' : ''} A nova temporada só começa depois desse jogo.`, clubs: [lib, uefa], comp: 'INT' });
  }
  function intPlay(S, g, I) {
    if (g.k !== 'der' && !I.one) { const p = I.games[INT_G.findIndex(x => x[0] === g.k) - 1]; g.h = p && p.win; }   // v268: no jogo único o mandante é o campeão da Libertadores
    if (!g.h || !g.a) { g.skip = 1; return; }
    const t = g.t, f = { comp: 'INT', h: g.h, a: g.a, neutral: true, ko: true, stage: g.k };
    Wd.setGrp('INT'); const H = teamFor(S, g.h), A = teamFor(S, g.a); Wd.setGrp(null);
    const isUser = Wd.isHuman(S, g.h) || Wd.isHuman(S, g.a), ref = C.REFEREES[hash(`int${S.season}${g.k}`) % 24];
    const res = SIM.simulate(H, A, { seed: hash(`int|${mseed(S)}|${S.season}|${g.k}`), info: id => info(S, id), referee: ref, detailed: isUser, knockout: true, neutral: true });
    g.gh = res.gh; g.ga = res.ga; g.pens = res.pens || null;
    g.win = res.gh > res.ga ? g.h : res.gh < res.ga ? g.a : (res.pens && res.pens[0] > res.pens[1] ? g.h : g.a);
    g.g = (res.ev || []).filter(e => e.t === 'goal').map(e => [e.m, e.s === 'h' ? 0 : 1, e.p]);
    const lose = g.win === g.h ? g.a : g.h, nm = INT_NAME[g.k], sc = `${g.h} ${g.gh} × ${g.ga} ${g.a}${g.pens ? ` (${g.pens[0]} × ${g.pens[1]} nos pênaltis)` : ''}`;
    for (const c of [g.h, g.a]) if (Wd.isHuman(S, c)) Wd.asClub(S, c, () => {
      S.lastMatch = { k: S.slot, t, season: S.season, f, ref: ref.id, H: { club: H.club, xi: H.xi, formation: H.formation, style: H.style }, A: { club: A.club, xi: A.xi, formation: A.formation, style: A.style }, res: { gh: res.gh, ga: res.ga, pens: res.pens, ev: res.ev, st: res.st, pl: res.pl, mom: res.mom, styles: res.styles } };
      const my = c === g.h ? res.gh : res.ga, ot = c === g.h ? res.ga : res.gh; try { coachRec(S, my, ot, c === g.h ? g.a : g.h, f); } catch (e) {}
    });
    if (isUser) { S._nt = t; try { EVENTS.highlights(S, f, { ...res, ev: res.ev || [] }, true, sc); } catch (e) {} delete S._nt; }
    if (g.k === 'der' || I.one) prize(S, g.win, PRIZE.INT.part + PRIZE.INT.win, `Intercontinental: ${nm}`), prize(S, lose, PRIZE.INT.part, 'Intercontinental: participação');
    else prize(S, g.win, PRIZE.INT.win, `Intercontinental: ${nm}`);
    if (g.k === 'fin') {
      I.champ = g.win; prize(S, g.win, PRIZE.INT.ch, 'Intercontinental: campeão');
      titleBonus(S, g.win, 'INT', 'título da Copa Intercontinental');
      const h0 = S.history && S.history.find(h => h.season === I.season); if (h0) h0.INT = g.win;
      if (Wd.isHuman(S, g.win)) Wd.asClub(S, g.win, () => { S.badges = S.badges || []; if (!S.badges.some(b => b.kind === 'trophy' && b.label === 'Copa Intercontinental' && b.season === I.season)) S.badges.push({ season: I.season, club: g.win, kind: 'trophy', label: 'Copa Intercontinental' }); });
      if (isBR(S, g.win)) for (const id of squad(S, g.win)) { const s = ps(S, id); s.mv = Math.round(s.mv * 1.05); s.mor = clamp(s.mor + 10, 0, 100); }
      EVENTS.news(S, { t: 'trophy', front: isBR(S, g.win) ? 99 : 75, title: isBR(S, g.win) ? `${g.win} é campeão da Copa Intercontinental!` : `${g.win} vence a Copa Intercontinental`, body: `Final: ${sc}.`, clubs: [g.h, g.a], champ: isBR(S, g.win) ? { club: g.win, comp: 'INT' } : undefined, comp: 'INT' });
    } else EVENTS.news(S, { t: 'match', front: isUser ? 92 : 70, title: `Intercontinental · ${nm}: ${sc}`, body: g.win === I.lib || isBR(S, g.win) ? `${g.win} avança. Próximo: ${g.k === 'der' ? `Copa Challenger contra o ${I.aap.win}` : `final contra o ${I.uefa}`}.` : `${g.win} avança; o ${lose} se despede.`, clubs: [g.h, g.a], comp: 'INT' });
  }
  // joga o que já chegou na hora (force: tudo, usado na virada)
  function intTick(S, force) {
    const I = S.comp && S.comp.INT; if (!I || I.champ || I.season !== (S.post && S.post.season)) return false;
    if (!I.one && I.uefa && I.lib) { I.mtry = Date.now(); }   // v278: marca a tentativa (o servidor não insiste mais que 1 vez a cada 30 min)
    if (!I.one && I.uefa && I.lib) {   // v268: liga com as 3 partidas do formato antigo vira jogo único (v274: mesmo se já jogou o Dérbi/Challenger; só a final vale)
      const old = (I.games || []).filter(g => g.win); if (old.length) I.old = old;
      I.one = 1; I.con = null; I.aap = null; I.games = intOne(S, I.lib, I.uefa);
      { const g = I.games[0], H = gridH(S), t0 = now(S) + 30 * 60000; if (g.t < t0) {   // dia do Encerramento já passou: próximo horário da grade (com 30 min de aviso)
        const j0 = Math.floor((t0 - S.seasonStart) / DAY); let best = null; for (let j = j0; j <= j0 + 3 && best == null; j++) for (const h of H) { const t = S.seasonStart + j * DAY + h * HOUR; if (t >= t0 && (best == null || t < best)) best = t; }
        g.t = best || t0; } }
      const g0 = I.games[0], dt = new Date(g0.t - 3 * 3600000);
      EVENTS.news(S, { t: 'trophy', front: 85, title: `Copa Intercontinental: ${I.lib} × ${I.uefa} em jogo único`, body: `O Mundial agora é um jogo só: campeão da Libertadores contra o campeão europeu, campo neutro, dia ${dt.getUTCDate()}/${dt.getUTCMonth() + 1} às ${String(dt.getUTCHours()).padStart(2, '0')}:${String(dt.getUTCMinutes()).padStart(2, '0')}. A nova temporada só começa depois dele.`, clubs: [I.lib, I.uefa], comp: 'INT' });
      Wd.touch(S);
    }
    let n = 0;
    for (const g of I.games) { if (g.win || g.skip) continue; if (!force && now(S) < g.t) break; intPlay(S, g, I); n++; if (g.skip) break; }
    if (n) Wd.touch(S);
    return n > 0;
  }
  function closeSeason(S) {
    const A = standings(S.comp.A.table), B = standings(S.comp.B.table), Cc = S.comp.C && S.divC && S.divC.length ? standings(S.comp.C.table) : [];
    A.forEach((r, i) => prize(S, r.c, PRIZE.A(i + 1), `Série A: ${i + 1}º lugar`));
    B.forEach((r, i) => prize(S, r.c, PRIZE.B(i + 1), `Série B: ${i + 1}º lugar`));
    Cc.forEach((r, i) => prize(S, r.c, PRIZE.C(i + 1), `Série C: ${i + 1}º lugar`));
    titleBonus(S, A[0] && A[0].c, 'A', 'título brasileiro'); if (Cc[0]) titleBonus(S, Cc[0].c, 'C', 'título da Série C');
    const awards = EVENTS.awards(S, true);
    // v155: selo Tipster pra quem mais acertou os palpites na temporada (desempate: % de acerto, depois melhor rodada)
    { const rows = Object.entries(S.desks || {}).map(([t, d]) => { let ok = 0, n = 0, best = 0; for (const [key, b] of Object.entries(d.bets || {})) { if (!b || !b.done || !key.startsWith(S.season + '-')) continue; ok += b.ok || 0; n += b.n || 0; best = Math.max(best, b.ok || 0); } return { t, ok, pct: n ? ok / n : 0, best }; })
        .filter(x => x.ok > 0).sort((a, b) => b.ok - a.ok || b.pct - a.pct || b.best - a.best || (a.t < b.t ? -1 : 1));
      const tip = rows[0];
      if (tip) Wd.asDesk(S, tip.t, () => { const d = C.SELOS.find(x => x.k === 'tipster'); S.badges = S.badges || []; if (d && !S.badges.some(b => b.kind === 'selo' && b.k === 'tipster' && b.season === S.season)) { S.badges.push({ season: S.season, club: S.club, kind: 'selo', k: 'tipster', label: d.label }); EVENTS.news(S, { t: 'trophy', title: `Novo selo para ${S.manager}: Tipster`, body: `Ninguém acertou mais palpites na temporada ${S.season}: ${tip.ok} acertos.`, clubs: S.club ? [S.club] : [], desk: S.__me, front: 80 }); } }); }
    const humanPos = {};
    Wd.forDesks(S, () => {
    if (!S.unemployed && S.obj && S.obj[S.club]) {
      const o = S.obj[S.club], tbl = o.div === 'A' ? A : o.div === 'C' ? Cc : B, pos = tbl.findIndex(r => r.c === S.club) + 1, pts = (tbl[pos - 1] || {}).pts || 0;
      S.badges = S.badges || [];
      if (objMet(o, pos, pts)) {
        if (o.g) { const P = OPR[o.bg || o.g], ex = o.pts != null ? Math.floor(Math.max(0, pts - o.pts) / 3) : Math.max(0, o.max - pos); award(S, P.fin[0] + ex, P.fin[1], `objetivo cumprido: ${o.label}${ex ? ` (+${ex} por ir além)` : ''}`); }
        S.badges.push({ season: S.season, club: S.club, kind: 'obj', label: o.label, pos, div: o.div });
        S.board = clamp((S.board ?? 60) + 15, 0, 100);
        const v = r1k(Wd.squadValue(S, S.club) * (0.05 + S.board / 100 * 0.1));
        S.cash[S.club] += v;
        EVENTS.news(S, { t: 'trophy', title: `Objetivo cumprido: ${o.label}`, body: `${S.club} termina em ${pos}º. Selo na galeria de conquistas e T$ ${C.fmt(v)} a mais da diretoria.`, clubs: [S.club], front: 95 });
      } else {
        S.board = clamp((S.board ?? 60) - 15, 0, 100);
        EVENTS.news(S, { t: 'club', title: `Diretoria cobra: objetivo era "${o.label}"`, body: `${S.club} terminou em ${pos}º. Confiança em ${Math.round(S.board)}/100.`, clubs: [S.club] });
      }
      const titles = [['A', 'Campeão da Série A'], ['B', 'Campeão da Série B'], ['C', 'Campeão da Série C'], ['CB', 'Copa do Brasil'], ['LIB', 'Libertadores'], ['SUL', 'Sul-Americana'], ['CONF', 'Conferência'], ['NE', 'Copa do Nordeste'], ['SSE', 'Copa Sul-Sudeste'], ['VER', 'Copa Verde']];
      for (const [k, label] of titles) {
        const champ = k === 'A' ? A[0].c : k === 'B' ? B[0].c : k === 'C' ? (Cc[0] && Cc[0].c) : S.comp[k] && S.comp[k].champ;
        if (champ === S.club && !S.badges.some(b => b.kind === 'trophy' && b.label === label && b.season === S.season)) S.badges.push({ season: S.season, club: S.club, kind: 'trophy', label });   // v245: pode já ter entrado antes
      }
      // selos da temporada
      { const sel = [], add = k => { const d = C.SELOS.find(x => x.k === k); if (!d) return; S.badges.push({ season: S.season, club: S.club, kind: 'selo', k, label: d.label }); sel.push(d.label); };
        const tro = S.badges.filter(b => b.kind === 'trophy' && b.season === S.season && b.club === S.club);
        if (tro.length >= 2) add('papa');
        if (tro.filter(b => !/^Campeão da Série/.test(b.label)).length >= 2) add('copeiro');
        if (o.rank && o.rank - pos >= 5) add('leite');
        if (S.savior && S.savior.season === S.season && S.savior.club === S.club && pos <= tbl.length - 4) add('salvador');
        const me = tbl[pos - 1];
        if (me && me.gp > 0 && tbl.every(r => r.gp <= me.gp)) add('rolo');
        if (me && tbl.every(r => r.gc >= me.gc)) add('muralha');
        if ((o.div === 'B' || o.div === 'C') && pos <= 4) add('acesso');
        if (sel.length) EVENTS.news(S, { t: 'trophy', title: sel.length > 1 ? `Novos selos para ${S.manager}: ${sel.join(', ')}` : `Novo selo para ${S.manager}: ${sel[0]}`, body: 'Já está na estante de selos, na sua carreira.', clubs: [S.club], desk: S.__me, front: 90 });
        S.savior = null; }
      humanPos[S.club] = pos;
      S.hist = S.hist || []; S.hist.unshift({ season: S.season, club: S.club, div: o.div, pos, prizes: S.seasonLog.prizes });
    }
    });
    const plan = qualPlan(S, A, B), qual = { LIB: plan.LIB, PL: plan.PL, SUL: plan.SUL, CONF: plan.CONF, plBR: plan.plBR };
    // campeão estrangeiro da Libertadores/Sul-Americana: garante a Libertadores seguinte entre os estrangeiros
    const qualF = ['LIB', 'SUL'].map(k => S.comp[k] && S.comp[k].champ).filter(c => c && !isBR(S, c));
    { const tit = Object.entries(plan.why).filter(([, w]) => QUAL_WHY[w]).map(([c, w]) => `${c} (${QUAL_WHY[w]})`);
      const pas = Object.entries(plan.why).filter(([, w]) => w === 'dPL').map(([c]) => `${c} vai pra Pré-Libertadores (a vaga direta ficou com um campeão de copa)`);
      EVENTS.news(S, { t: 'club', front: 86, title: `Vagas continentais de ${S.season + 1}`, body: `Libertadores: ${qual.LIB.join(', ')}. Pré-Libertadores: ${qual.PL.join(', ')}. Sul-Americana: ${qual.SUL.join(', ')}. Conferência: ${qual.CONF.join(', ')}.${tit.length ? ` Vaga por título: ${tit.join(', ')}.` : ''}${pas.length ? ` ${pas.join('; ')}.` : ''} A Pré-Libertadores é mata-mata entre brasileiros: quem vence vai pra fase de grupos, quem perde vai pra Sul-Americana.`, clubs: [...qual.LIB, ...qual.PL] }); }
    for (const key of ['LIB', 'PL', 'SUL', 'CONF']) for (const c of qual[key]) prize(S, c, PRIZE.QUAL[key], `Classificação: ${COMP_NAME[key]} ${S.season + 1}`);
    const down = A.slice(16).map(r => r.c), up = B.slice(0, 4).map(r => r.c);
    // Série C (v107): 4 sobem pra B, os 4 últimos da B descem; os 4 últimos da C caem pra D e 4 da D (copas regionais) sobem
    let upC = [], downB = [], downC = [], upD = [];
    if (Cc.length >= 8) {
      upD = pickUpD(S); const n = Math.min(4, upD.length);
      upC = Cc.slice(0, 4).map(r => r.c); downB = B.slice(-4).map(r => r.c); downC = n ? Cc.slice(-n).map(r => r.c) : []; upD = upD.slice(0, n);
    }
    S.nextSuper = [A[0].c, S.comp.CB.champ && S.comp.CB.champ !== A[0].c ? S.comp.CB.champ : A[1].c];
    S.history.unshift({ season: S.season, A: A[0].c, B: B[0].c, C: Cc[0] ? Cc[0].c : undefined, upC, downB, downC, upD, tableC: Cc.map(r => [r.c, r.pts]), CB: S.comp.CB.champ, LIB: S.comp.LIB && S.comp.LIB.champ, SUL: S.comp.SUL && S.comp.SUL.champ, CONF: S.comp.CONF && S.comp.CONF.champ, NE: S.comp.NE && S.comp.NE.champ, SSE: S.comp.SSE && S.comp.SSE.champ, VER: S.comp.VER && S.comp.VER.champ,
      awards, humans: humanPos, down, up, tableA: A.map(r => [r.c, r.pts]), tableB: B.map(r => [r.c, r.pts]) });
    for (const champ of new Set([A[0].c, S.comp.CB.champ, S.comp.LIB && S.comp.LIB.champ])) if (champ && isBR(S, champ)) for (const id of squad(S, champ)) { const s = ps(S, id); s.mv = Math.round(s.mv * 1.08); s.mor = clamp(s.mor + 10, 0, 100); }
    EVENTS.news(S, { t: 'trophy', title: `${A[0].c} é campeão brasileiro ${S.season}`, body: `Sobem da Série B: ${up.join(', ')}. Caem: ${down.join(', ')}.`, clubs: [A[0].c], front: 99, champ: { club: A[0].c, comp: 'A' } });
    if (upC.length) {
      EVENTS.news(S, { t: 'trophy', title: `${B[0].c} é campeão da Série B ${S.season}`, body: `Sobem pra Série A: ${up.join(', ')}. Caem pra Série C: ${downB.join(', ')}.`, clubs: [B[0].c, ...downB], front: 90 });
      EVENTS.news(S, { t: 'trophy', title: `${Cc[0].c} é campeão da Série C ${S.season}`, body: `Sobem pra Série B: ${upC.join(', ')}. Caem pra Série D: ${downC.join(', ')}. Sobem da Série D (melhores das copas regionais): ${upD.join(', ')}.`, clubs: [...upC, ...downC], front: 88 });
    }
    S.post = { season: S.season, d0: dayAbs(S, slotTime(S, SLOTS - 1)), up, down, upC, downB, downC, upD, qual, qualF, qualWhy: plan.why, champA: A[0].c, champB: B[0].c, champC: Cc[0] ? Cc[0].c : null, awards };
    Wd.forDesks(S, () => { S.ready = null; S.forceNext = null; });
    try { intSetup(S); } catch (e) { oops(S, 'Intercontinental', e); }
  }
  // notícias de cada dia da fase de encerramento
  function postDay(S, d) {
    const Pp = S.post, ph = postIdx(S, d);   // v280: fases pela agenda (Premiação depois da Intercontinental); cada uma acontece uma vez, em ordem
    if (ph >= 1 && !Pp.encDone) {
      Pp.encDone = true;
      const h = S.history[0] || {};
      const champs = [['Série A', h.A], ['Série B', h.B], ['Copa do Brasil', h.CB], ['Libertadores', h.LIB], ['Sul-Americana', h.SUL], ['Conferência', h.CONF]].filter(x => x[1]).map(([l, c]) => `${l}: ${c}`).join(' · ');
      EVENTS.news(S, { t: 'club', title: `Encerramento da temporada ${Pp.season}`, body: `Campeões — ${champs}. Rebaixados: ${Pp.down.join(', ')}. Sobem: ${Pp.up.join(', ')}. Amanhã é o Dia da Premiação.`, front: 96, post: 'enc' });
      const ret = Object.keys(S.ps).filter(id => S.ps[id].retire === Pp.season && Wd.ownerOf(S, +id) !== 'Aposentado').map(Number);
      if (ret.length) EVENTS.news(S, { t: 'club', title: `${ret.length} jogador(es) se despedem dos gramados`, body: ret.slice(0, 12).map(id => `${P[id].name} (${Wd.ownerOf(S, id)}, ${age(S, id)} anos)`).join(', ') + '. As aposentadorias se oficializam na virada da temporada.', ids: ret.slice(0, 12) });
      Wd.forDesks(S, () => {
        if (S.unemployed || !S.club) return;
        const exp = squad(S, S.club).filter(id => { const s = S.ps[id]; return s && s.ce <= Pp.season && !s.loan && s.retire !== Pp.season; });
        if (exp.length) EVENTS.news(S, { t: 'transfer', title: `${exp.length} contrato(s) do ${S.club} terminam na virada`, body: `${exp.map(id => P[id].short).join(', ')}. Quem não renovar até a Nova Temporada sai livre no mercado.`, ids: exp, clubs: [S.club], desk: S.__me, front: 80 });
      });
    }
    if (ph >= 2 && !Pp.premDone) {
      Pp.premDone = true;
      EVENTS.news(S, { t: 'award', title: `Dia da Premiação ${Pp.season}`, body: 'Noite de gala: Bola de Ouro, Revelação do Ano, Chuteira, Garçom, Luva e Prancheta de Ouro e a Seleção da Temporada, das Séries C, B e A. Abra a cerimônia na tela principal.', front: 97, post: 'prem' });
      EVENTS.announceAwards(S, Pp.awards || {}, Pp.season);
    }
    if (ph >= 3 && !Pp.livreDone) {
      Pp.livreDone = true;
      EVENTS.news(S, { t: 'club', title: 'Último dia livre da temporada', body: 'Consulte tabelas, prêmios, finanças e elenco. A próxima temporada começa quando a maioria dos treinadores apertar NOVA TEMPORADA.', front: 60, post: 'livre' });
    }
  }
  // v187: artilharia / assistências de um campeonato a partir dos jogos disputados (S.played): o jogo é a fonte da verdade.
  // Quem foi vendido continua na lista, com o escudo do clube que defendia quando fez os gols.
  function leagueLeaders(S, comp, n = 10) {
    const T = {};
    for (const k in (S.played || {})) for (const m of S.played[k] || []) {
      if (m.comp !== comp || !m.g) continue;
      for (const e of m.g) {
        if (e[3] === -2) continue;   // cartão vermelho
        const club = e[1] === 0 ? m.h : m.a, sc = e[2], as = e[3];
        if (sc != null && P[sc]) { const t = T[sc] = T[sc] || { g: 0, a: 0, c: club }; t.g++; t.c = club; }
        if (as != null && as >= 0 && P[as]) { const t = T[as] = T[as] || { g: 0, a: 0, c: club }; t.a++; t.c = club; }
      }
    }
    const jOf = id => { const s = S.ps[id]; return (s && s.stlD && s.stlD[comp] && s.stlD[comp].j) || (s && s.stl && s.stl.j) || 0; };
    const rank = key => Object.keys(T).map(Number).filter(id => T[id][key] > 0)
      .sort((a, b) => T[b][key] - T[a][key] || jOf(a) - jOf(b) || T[b][key === 'g' ? 'a' : 'g'] - T[a][key === 'g' ? 'a' : 'g']).slice(0, n).map(id => [id, T[id].c, T[id][key]]);
    return { g: rank('g'), a: rank('a') };
  }
  // v187: números de liga de um jogador num campeonato (stlD); ligas antigas: cai pro stl se ele ainda estiver numa equipe dessa divisão
  function leagueStat(S, id, div) {
    const s = S.ps[id]; if (!s) return null;
    if (s.stlD) return s.stlD[div] || null;
    return s.stl && Wd.divOf(S, Wd.ownerOf(S, id)) === div ? { ...s.stl, c: Wd.ownerOf(S, id) } : null;
  }
  // arquivo compacto da temporada (Torneios › seletor de temporada)
  function archiveSeason(S) {
    const played = {};
    for (const k in S.played) played[k] = S.played[k].map(m => { const o = { h: m.h, a: m.a, gh: m.gh, ga: m.ga, comp: m.comp }; if (m.pens) o.pens = m.pens; if (m.agg) o.agg = m.agg; return o; });
    const L = { A: leagueLeaders(S, 'A'), B: leagueLeaders(S, 'B'), C: leagueLeaders(S, 'C') }, top = (div, key) => L[div][key];   // v187: dos jogos disputados (imutável)
    S.archive = S.archive || {};
    S.archive[S.season] = { seasonStart: S.seasonStart, comp: JSON.parse(JSON.stringify(S.comp)), played, divA: S.divA.slice(), divB: S.divB.slice(), divC: (S.divC || []).slice(), qual: S.qual,
      top: { A: { g: top('A', 'g'), a: top('A', 'a') }, B: { g: top('B', 'g'), a: top('B', 'a') }, C: { g: top('C', 'g'), a: top('C', 'a') } }, awards: S.post && S.post.awards };
    const keys = Object.keys(S.archive).map(Number).sort((a, b) => b - a);
    for (const k of keys.slice(6)) delete S.archive[k];     // guarda as 6 últimas
  }
  // v184: balanço da temporada (créditos e débitos) do clube do treinador, guardado na mesa e anunciado na virada
  function seasonBalance(S) {
    if (S.unemployed || !S.club) return;
    const f = S.fin || {}, pz = (S.seasonLog && S.seasonLog.prizes) || {};
    let cota = 0, prem = 0; for (const [k, v] of Object.entries(pz)) { if (/^Cota da Série/.test(k)) cota += v; else prem += v; }
    const cr = [['Bilheteria', f.gate || 0], ['Premiações', prem], ['Cota da CBF', cota], ['Vendas de jogadores', f.sold || 0], ['Estrelas/diamantes trocados', f.cashout || 0], ['Reembolso de empréstimos', f.loanRefundIn || 0], ['Adiantamento da TV', f.tvIn || 0]];
    const db = [['Salários', f.wages || 0], ['Contratações', f.spent || 0], ['Rescisões', f.release || 0], ['Devolução de empréstimos', f.loanRefundOut || 0], ['Devolução à TV', f.tvOut || 0]];
    const cash1 = S.cash[S.club] || 0, inT = cr.reduce((a, x) => a + x[1], 0), outT = db.reduce((a, x) => a + x[1], 0);
    const full = f.cash0 != null, other = full ? cash1 - f.cash0 - (inT - outT) : null;
    const recv = (f.gate || 0) + prem + cota + (other > 0 ? other : 0), wagePct = recv > 0 ? Math.round(100 * (f.wages || 0) / recv) : null, mkt = (f.sold || 0) - (f.spent || 0);
    const tips = [];
    if (wagePct != null) tips.push(wagePct > 85 ? `A folha consumiu ${wagePct}% das receitas do clube (sem contar vendas). Acima de 70% o caixa fica no limite.` : wagePct > 70 ? `A folha levou ${wagePct}% das receitas. Está no limite: clubes saudáveis ficam abaixo de 70%.` : `A folha levou ${wagePct}% das receitas: gestão saudável (abaixo de 70%).`);
    if (mkt < 0) tips.push(`No mercado, o clube gastou T$ ${C.fmt(-mkt)} a mais do que vendeu.`); else if (mkt > 0) tips.push(`No mercado, o clube arrecadou T$ ${C.fmt(mkt)} a mais do que gastou.`);
    const ar = arrearsOf(S, S.club); if (ar && ar.count) tips.push(`Houve ${ar.count} período(s) de salário atrasado nesta temporada.`);
    const B = { s: S.season, club: S.club, cash0: f.cash0 ?? null, cash1, cr: cr.filter(x => x[1]), db: db.filter(x => x[1]), other, tips };
    S.balancos = [B, ...(S.balancos || []).filter(x => x.s !== S.season)].slice(0, 3);
    const res = full ? cash1 - f.cash0 : inT - outT + (other || 0);
    EVENTS.news(S, { t: 'fin', front: 92, bal: S.season, title: `Balanço ${S.season} do ${S.club}: ${res >= 0 ? 'superávit' : 'déficit'} de T$ ${C.fmt(Math.abs(res))}`, body: `Receitas e despesas da temporada, linha por linha. ${tips[0] || ''}`, clubs: [S.club], desk: S.__me });
  }
  // ---------- v205: Fama do treinador ----------
  // 4 famas (Revelador, Gestor, Raiz, Decisivo). Cada uma tem 6 traços por temporada, do que o técnico fez no clube dele.
  // Fechou 6/6 na virada: ganha a tag. Máximo 2 ativas; a tag cai se passar uma temporada sem ser exercida. Ainda não mexe no jogo.
  const FAMA_K = ['form', 'proj', 'raca', 'camisa'], FAMA_MAX = 2;
  // início do técnico no clube nesta temporada: { k0: primeira data que conta, cash0, mk0, pay0 }
  function famaGuess(S) {
    const f = S.fin || {}, ch = S.coachLastChange && S.coachLastChange[S.club];
    if (ch && ch.season === S.season) return { s: S.season, club: S.club, m: 1, k0: SLOTS, cash0: null, mk0: 0, pay0: null };   // trocou de clube antes da v205: conta a partir da próxima
    let k0 = 0;
    if (S.joined && S.seasonStart && S.joined > slotTime(S, 0)) { k0 = SLOTS; for (let k = 0; k < SLOTS; k++) if (slotTime(S, k) >= S.joined) { k0 = k; break; } }
    return { s: S.season, club: S.club, m: 1, k0, cash0: k0 ? null : (f.cash0 ?? null), mk0: 0, pay0: null };
  }
  function famaCur(S) {
    if (S.unemployed || !S.club) return null;
    const c = S.fama && S.fama.cur, f = S.fin || {};
    const r = c && c.s === S.season && c.club === S.club ? c : famaGuess(S);
    return { k0: r.k0 || 0, cash0: r.m ? r.cash0 : (f.cash0 ?? null), mk0: r.mk0 || 0, pay0: r.pay0 ?? ((S.cota && S.cota.pay0 && S.cota.pay0[S.club]) || null) };   // folha de referência da cota (v184) quando não tem a nossa
  }
  // posição do elenco na divisão (força), pra comparar com a tabela
  function famaRank(S, club) {
    const div = Wd.divOf(S, club), cp = S.comp && S.comp[div]; if (!cp || !cp.table) return null;
    const tb = standings(cp.table), row = tb.find(r => r.c === club); if (!row) return null;
    const st = tb.map(r => [r.c, strength(S, r.c)]).sort((a, b) => b[1] - a[1]);
    const o = S.obj && S.obj[club], exp = o && o.div === div && o.rank ? o.rank : st.findIndex(x => x[0] === club) + 1;   // v253: mesma régua da meta (posição pelo valor do elenco)
    return { div, pos: tb.indexOf(row) + 1, exp, j: row.v + row.e + row.d, N: tb.length };
  }
  // números da temporada pro clube do técnico da mesa atual (S.__me)
  function famaStats(S) {
    const club = S.club, cur = famaCur(S); if (!cur) return null;
    const ids = squad(S, club), mn = id => ((S.ps[id] && S.ps[id].st) || {}).min || 0;
    const yng = ids.filter(id => age(S, id) <= 23), ymin = yng.reduce((a, id) => a + mn(id), 0), tmin = ids.reduce((a, id) => a + mn(id), 0);
    const yn = yng.filter(id => mn(id) > 0).length;
    let dW = 0, dJ = 0, hJ = 0, hP = 0, aJ = 0, aP = 0;
    for (const k in S.played || {}) for (const m of S.played[k] || []) {
      if (!m || m.comp === 'AMI' || m.gh == null || (m.h !== club && m.a !== club) || +k < cur.k0) continue;
      const home = m.h === club, my = home ? m.gh : m.ga, ot = home ? m.ga : m.gh, pts = my > ot ? 3 : my === ot ? 1 : 0;
      if (C.isDerby(m.h, m.a)) { dJ++; if (pts === 3) dW++; }
      if (m.neutral) continue;
      if (home) { hJ++; hP += pts; } else { aJ++; aP += pts; }
    }
    const f = S.fin || {}, cash = S.cash[club] || 0, ar = arrearsOf(S, club);
    const cashD = cur.cash0 != null ? Math.round(cash - cur.cash0) : null, mkt = Math.round((f.sold || 0) + (f.loanRefundIn || 0) - (f.spent || 0) - (f.loanRefundOut || 0) - (cur.mk0 || 0));   // mesma conta da ajuda de emergência
    let rk = null; try { rk = famaRank(S, club); } catch (e) {}
    return { club, k0: cur.k0, late: cur.k0 > 0 && cur.k0 < SLOTS, out: cur.k0 >= SLOTS, ymin, yn, tmin, share: tmin ? ymin / tmin : 0, dW, dJ, hJ, hP, aJ, aP,
      ratio: hJ >= 3 && aJ >= 3 ? (hP / hJ) / Math.max(0.1, (hP + aP) / (hJ + aJ)) : null,
      cashD, cash0: cur.cash0, mkt, pay: Wd.payroll(S, club), pay0: cur.pay0, arr: (ar && ar.count) || 0, rk };
  }
  // calibrado em 3 temporadas simuladas (~1 em 4 fecha cada uma; só Decisivo depende de ganhar)
  const FAMA_RULE = { form: 0.047, raca: 0.032 };   // form: 6 traços ≈ 28% dos minutos com jovens (3 titulares); raca: casa rende 19% acima da média do time
  function famaDots(k, x) {
    if (!x || x.out) return 0;
    const n = k === 'form' ? Math.floor(x.share / FAMA_RULE.form + 1e-9)
      : k === 'proj' ? (x.mkt > 0 ? 2 : x.mkt === 0 ? 1 : 0) + (x.pay0 == null ? 0 : x.pay <= x.pay0 ? 2 : x.pay <= x.pay0 * 1.1 ? 1 : 0) + (!x.arr ? 1 : 0) + (x.cashD != null && x.cashD >= 0 ? 1 : 0)
      : k === 'raca' ? (x.ratio == null ? 0 : Math.floor((x.ratio - 1) / FAMA_RULE.raca + 1e-9))
      : x.rk && x.rk.j ? (x.rk.pos === 1 ? 6 : 3 + (x.rk.exp - x.rk.pos)) : 0;
    return Math.max(0, Math.min(6, n || 0));
  }
  // na virada (mesa atual): quem fechou 6/6 ganha/renova; tag sem renovar cai; no máximo 2
  function famaSeason(S) {
    const F = S.fama = S.fama || { tags: [], hist: [] }; F.tags = F.tags || []; F.hist = F.hist || [];
    if (F.last === S.season) return; F.last = S.season;   // uma vez por virada
    const x = famaStats(S), won = x ? FAMA_K.filter(k => famaDots(k, x) >= 6) : [], s = S.season;
    const had = new Set(F.tags.map(t => t.k));
    for (const k of won) { const t = F.tags.find(t => t.k === k); if (t) { t.s = s; t.club = x.club; t.n = (t.n || 1) + 1; } else F.tags.push({ k, s, club: x.club, since: s, n: 1 }); }
    const lost = F.tags.filter(t => t.s < s).map(t => t.k);           // não exerceu nesta temporada
    F.tags = F.tags.filter(t => t.s >= s)
      .sort((a, b) => (had.has(b.k) - had.has(a.k)) || (a.since - b.since) || FAMA_K.indexOf(a.k) - FAMA_K.indexOf(b.k));
    const over = F.tags.slice(FAMA_MAX).map(t => t.k); F.tags = F.tags.slice(0, FAMA_MAX);   // máximo 2: renovadas primeiro
    const got = F.tags.filter(t => !had.has(t.k)).map(t => t.k);
    F.hist = [{ s, club: x ? x.club : null, d: x && !x.out ? Object.fromEntries(FAMA_K.map(k => [k, famaDots(k, x)])) : null, won }, ...F.hist.filter(h => h.s !== s)].slice(0, 8);
    delete F.cur;
    const list = a => a.map(k => C.FAMA_INFO[k].l).join(' e ');
    if (got.length) EVENTS.news(S, { t: 'coach', front: 91, title: `${S.manager} ganha fama de ${list(got)}`, body: `Fechou os 6 traços na temporada ${s} no ${x.club}. A fama fica no seu cartão de treinador e se renova se você repetir na próxima temporada.${over.length ? ` Também fechou ${list(over)}, mas valem no máximo ${FAMA_MAX} famas ao mesmo tempo.` : ''}`, clubs: [x.club], desk: S.__me });
    else if (over.length) EVENTS.news(S, { t: 'coach', title: `Fama de ${list(over)} fica de fora`, body: `Você fechou os 6 traços, mas já tem ${FAMA_MAX} famas renovadas e esse é o limite.`, clubs: x ? [x.club] : [], desk: S.__me });
    if (lost.length) EVENTS.news(S, { t: 'coach', title: `Fama perdida: ${list(lost)}`, body: `A fama de ${list(lost)} não foi renovada na temporada ${s}. Pra voltar a ter, é preciso fechar os 6 traços de novo.`, clubs: x ? [x.club] : [], desk: S.__me });
  }
  // início no clube (virada ou contratação no meio)
  function famaStart(S, mid) {
    if (S.unemployed || !S.club) return;
    const F = S.fama = S.fama || { tags: [], hist: [] }, f = S.fin || {};
    F.cur = mid ? { s: S.season, club: S.club, m: 1, k0: S.slot || 0, cash0: S.cash[S.club] || 0, mk0: (f.sold || 0) + (f.loanRefundIn || 0) - (f.spent || 0) - (f.loanRefundOut || 0), pay0: Wd.payroll(S, S.club) } : { s: S.season, club: S.club, k0: 0, pay0: Wd.payroll(S, S.club) };
  }
  function rollover(S) {
    const Pp = S.post || {};
    if (paused(S)) resume(S);   // v210: temporada nova nunca nasce com o relógio congelado (78DQ9J: ADM pausou no último dia livre e forçou a virada)
    try { Wd.forDesks(S, () => famaSeason(S)); } catch (e) { oops(S, 'fama da temporada', e); }   // v205: antes de zerar estatísticas e trocar divisões
    try { intTick(S, true); } catch (e) { oops(S, 'Intercontinental', e); }   // v209: ADM forçou a virada antes da final
    archiveSeason(S);
    const down = Pp.down || [], up = Pp.up || [];
    const upC = Pp.upC || [], downB = Pp.downB || [], downC = Pp.downC || [], upD = Pp.upD || [];
    S.divA = [...S.divA.filter(c => !down.includes(c)), ...up];
    S.divB = [...S.divB.filter(c => !up.includes(c) && !downB.includes(c)), ...down, ...upC];
    if (S.divC) {
      S.divC = [...S.divC.filter(c => !upC.includes(c) && !downC.includes(c)), ...downB, ...upD];
      // quem cai pra D e não é clube das copas regionais fica guardado na lista da D
      S.divDx = [...new Set([...(S.divDx || []), ...downC.filter(c => !(C.CLUBS_REG_GEN && C.CLUBS_REG_GEN[c]))])].filter(c => !upD.includes(c));
      for (const c of upD) promoteD(S, c);
    }
    if (Pp.qual) S.qual = Pp.qual;
    S.qualF = Pp.qualF || [];
    // treinador que subiu pra Série A: o Ouro vira diamante (2 pra 1)
    if (up.length) Wd.forDesks(S, () => { if (!S.unemployed && up.includes(S.club)) { try { MARKET.gemSwitch(S, true, S.club); } catch (e) { oops(S, 'Ouro → diamante', e); } } });
    { const hb = S.history && S.history[0]; if (hb && hb.B) titleBonus(S, hb.B, 'B', 'título da Série B'); }   // v175: pago já como clube da Série A (vira diamante, não Ouro)
    MARKET.seasonEnd(S);   // contratos, pré-contratos, dispensas
    TRAIN.seasonEnd(S);    // idade, declínio, aposentadorias, base
    try { const n = Wd.tmRoll(S); if (n) EVENTS.news(S, { t: 'club', title: 'Elencos atualizados com as transferências reais', body: `${n} jogadores que trocaram de clube na vida real chegam ao clube novo na temporada ${S.season + 1}. Jogador de elenco de treineiro não sai; quem ia pra clube de treineiro fica livre no mercado.` }); } catch (e) { oops(S, 'transferências reais', e); }   // v232
    try { MARKET.fillAll(S, true); } catch (e) { oops(S, 'reposição de elencos', e); }   // v219: elencos completos pra temporada nova
    for (const id in S.ps) { const s = S.ps[id]; s.car = s.car || { j: 0, g: 0, a: 0 }; s.car.j += s.st.j; s.car.g += s.st.g; s.car.a += s.st.a; s.st = { j: 0, g: 0, a: 0, rt: 0, yc: 0, rc: 0, min: 0, cs: 0, ga: 0 }; s.stl = null; delete s.stlD; s.yc = 0; s.sus = 0; delete s.susC; delete s.ycC; s.away = 0; s.asked = false; }
    try { Wd.forDesks(S, () => seasonBalance(S)); } catch (e) { oops(S, 'balanço da temporada', e); }
    delete S.cupSc;
    S.season++;
    S.played = {}; S.streak = {}; delete S.post;
    Wd.forDesks(S, () => { S.fin = {}; S.lastMatch = null; S.ready = null; S.forceNext = null; });
    setupSeason(S);
    Wd.forDesks(S, () => famaStart(S));
    try { EVENTS.tvDebtPay(S); } catch (e) {}
    try { tvAdvPay(S); } catch (e) { oops(S, 'devolução das cotas de TV', e); }
    // treinador cujo clube caiu pra Série D: sai do clube (a D não tem campeonato nacional) e recebe propostas
    if (downC.length) Wd.forDesks(S, () => { if (!S.unemployed && downC.includes(S.club)) { try { EVENTS.fire(S, `Com a queda pra Série D, o ${S.club} fica sem calendário nacional e a diretoria encerra o ciclo.`); } catch (e) { oops(S, 'queda pra Série D', e); } } });
    Wd.touch(S);
    EVENTS.news(S, { t: 'club', title: `Começa a temporada ${S.season}`, body: `${isTurbo(S) ? '⚡ Modo Turbo: 7 dias reais, 8 jogos por dia.' : 'Modo Normal: 28 dias reais.'} Primeiro jogo ${new Date(slotTime(S, 0) - BRT).getUTCDate()}/${new Date(slotTime(S, 0) - BRT).getUTCMonth() + 1}. Calendário com ${SLOTS} datas: Série A/B, Copa do Brasil e torneios continentais.`, front: 90 });
  }
  // clube que sobe da Série D: entra no sistema nacional (caixa, base, técnico) e o elenco é enxugado
  function promoteD(S, c) {
    const sq = squad(S, c).slice().sort((a, b) => view(S, b).ovr - view(S, a).ovr || a - b);
    for (const id of sq.slice(40).filter(x => !(S.ps[x] && (S.ps[x].loan || S.ps[x].loanOut)))) { S.own[id] = 'Livre'; if (!S.free.includes(id)) S.free.push(id); }
    if (!S.youth[c]) S.youth[c] = Wd.youthNew(S, S.season, c, 3);
    if (S.cash[c] == null) S.cash[c] = r1k(Wd.squadValue(S, c) * ECON.startCashRate);
    if (!S.coaches[c]) S.coaches[c] = { name: C.coachName(R('coach|' + S.seed + c), 'BRA'), since: S.season };
    Wd.touch(S);
  }
  // ---------- migração (v107): liga em andamento ganha a Série C ----------
  // Os 20 clubes entram agora; as rodadas que já passaram são simuladas no placar (sem estatística de jogador).
  function quickScore(S, h, a, sh, sa, seed) {
    const r = C.rng(seed), pois = l => { let k = 0, p = Math.exp(-l), t = p, u = r(); while (u > t && k < 9) { k++; p *= l / k; t += p; } return k; };
    const d = clamp((sh - sa) * 0.07, -1.1, 1.1);
    return [pois(clamp(1.35 + d + 0.2, 0.25, 3.2)), pois(clamp(1.1 - d, 0.2, 3))];
  }
  function serieCMig(S) {
    if (S.divC || !S.comp || !S.divA) return false;
    if (!Wd.serieCInit(S) || !S.divC.length) { S.divC = S.divC || []; return false; }
    S.comp.C = { table: freshTable(S.divC), q: {} };
    const sv = {}; for (const c of S.divC) sv[c] = strength(S, c);
    const upd = (tbl, h, a, gh, ga) => { const th = tbl[h], ta = tbl[a]; th.j++; ta.j++; th.gp += gh; th.gc += ga; ta.gp += ga; ta.gc += gh;
      if (gh > ga) { th.v++; ta.d++; th.form.push('V'); ta.form.push('D'); } else if (gh < ga) { ta.v++; th.d++; th.form.push('D'); ta.form.push('V'); } else { th.e++; ta.e++; th.form.push('E'); ta.form.push('E'); }
      th.form = th.form.slice(-6); ta.form = ta.form.slice(-6); };
    let n = 0;
    for (let k = 0; k < Math.min(S.slot || 0, SLOTS); k++) {
      const cal = CAL[k]; if (cal.type !== 'L') continue;
      const res = (leagueFix(S, 'C')[cal.md - 1] || []).map(([h, a]) => { const [gh, ga] = quickScore(S, h, a, sv[h], sv[a], hash(`qc|${S.seed}|${S.season}|${k}|${h}`)); upd(S.comp.C.table, h, a, gh, ga); return [h, a, gh, ga]; });
      S.comp.C.q[k] = res; n++;
    }
    if (S.obj) Object.assign(S.obj, groupObjectives(S, S.divC, 'C'));
    EVENTS.news(S, { t: 'club', title: 'A Série C chega ao Treineiros', body: `20 clubes com elencos reais disputam a terceira divisão: os 4 primeiros sobem pra Série B e os 4 últimos da B descem. Os 4 últimos da C caem pra Série D, e sobe o melhor clube da D em cada copa regional (Nordeste, Sul-Sudeste, Norte e Centro-Oeste).${n ? ` As ${n} rodadas que já tinham passado foram simuladas.` : ''}`, front: 94 });
    Wd.touch(S);
    return true;
  }
  const endSeason = S => { if (!S.post) closeSeason(S); rollover(S); };   // atalho (testes / ADM)

  return { BIG, bigOf, boardRound, cupBoard, fansAfter, jobTick, trophyTick, clinchTick, qualPlan, cbVice, QUAL_WHY, intSetup, intTick, intPlay, intPending, intNextT, postStart, postIdx, INT_G, INT_NAME, FAMA_K, FAMA_MAX, FAMA_RULE, famaRank, famaCur, famaStats, famaDots, famaSeason, famaStart, repairBuys, leagueLeaders, leagueStat, helpCheck, seasonBalance, tvAdvPay, COTA, COTA_FIX, DEV, callDone, callupEarly, repairTransfers, auditOf, AUD_KIND, auditTick, serieCMig, pickUpD, LEAGUES, health, oops, setupContinental, pillars, DNA, dnaRound, dnaMatch, dnaGive, fireMode, plog, fansAdd, CUPS, REGC, regCupOf, oprStatus, oprState, oprAcc, OPR, GNAME, GORD, ET_EVERY, BOIA_MD, objMet, annulRound, tOfFd, fdAt, fdOfSlot, REC_DAY, planSeason, prepTick, PRE_H, WIN_K, gridH, postPhase, readyInfo, canRoll, closeSeason, rollover, endSeason, archiveSeason, TURBO_H, isTurbo, perDay, sport, unsport, sportDayStart, stadium, crowd, PRICE, arrearsOf, paused, pauseUntilMatch, resume, foldPause, importantMatch, infilInfo, infiltrate, fragOf, virt, toReal, realMs, balanceWallet, balTier, BAL, gameDate, windowOpen, windowInfo, SLOTS, CAL, CALLUPS, PRE_FROM, CB_STAGES, CK_STAGES, COMP_NAME, PRIZE, now, slotTime, dayAbs, leagueFix, standings, strength, info, aiTac, aiTeam, userTeam, lineupAvail, teamFor,
    pickXI, setupSeason, fixturesOf, friendly, declineFriendly, award, inviteFriendly, resolveInvites, aiInvite, playFriendly, friendsToday, askBudget, userPos, setObjectives, nextFixtureOf, clubSchedule, process, isBR, matchRevenue, freshTable, prize, referee, GROUP_MD };
})();
