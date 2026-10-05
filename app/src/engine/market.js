// Origem: reference/market.js (convertido na Fase 1, lógica inalterada). A partir da Fase 2 este arquivo é FONTE: edite aqui.
import { CORE } from './core.js';
import { WORLD } from './world.js';
import { SEASON } from './season.js';
import { TRAIN } from './train.js';
let EVENTS;
export const __bind = d => { EVENTS = d.EVENTS; };
// ===== TREINEIROS v3 · mercado: negociação realista, IA, pacotes, contratos =====
//
// Como negociações funcionam na vida real (e aqui):
// 1. Duas partes precisam dizer sim: o CLUBE dono (taxa de transferência) e o JOGADOR (salário, contrato, projeto).
// 2. O jogador pesa a liga onde está × a liga pra onde vai, idade/momento da carreira, nacionalidade (voltar pra casa),
//    tempo de jogo e prestígio do clube comprador. Um astro de 26 anos na Premier League não troca por Brasil por dinheiro;
//    um brasileiro de 32 anos na Europa ou um argentino do Boca, sim.
// 3. O clube vendedor pede mais pelo titular e muito mais pelo craque do time, menos por quem tem contrato acabando,
//    e cobra caro de rival direto. Clube endividado aceita menos.
// 4. Toda proposta tem resposta: aceite, contraproposta ou recusa. Recusas seguidas encerram a conversa por uns dias.
// 5. Contrato no último semestre: o jogador pode assinar pré-contrato de graça com outro clube.
export const MARKET = (() => {
  const C = CORE, Wd = WORLD;
  const { R, hash, clamp, r1k, ECON, FORMATIONS, fit } = C;
  const { P, ps, squad, age, view } = Wd;
  const DAY = 86400000;

  const divTier = (S, club) => S.divA.includes(club) ? 2.5 : S.divB.includes(club) ? 1.5 : S.divC && S.divC.includes(club) ? 1 : null;
  function playerTier(S, id) {
    const o = Wd.ownerOf(S, id);
    if (o === 'Livre') {   // sem clube facilita, mas o jogador mantém o patamar de carreira (estrangeiro de fora da AS não vira "fácil")
      const g = natGroup(P[id].nat); if (g === 'BRA' || g === 'SA') return 1.5;
      const ov = view(S, id).ovr, oT = ov >= 80 ? 4.5 : ov >= 76 ? 3.8 : ov >= 72 ? 3 : ov >= 68 ? 2.5 : 1.8, lt = C.LEAGUE_TIER[P[id].liga];
      return Math.max(1.5, lt ? (lt + oT) / 2 : oT);
    }
    const t = divTier(S, o);
    if (t != null) return t;
    return C.LEAGUE_TIER[P[id].liga] ?? 2;
  }
  function clubRep(S, club) {
    const cl = Wd.clubInfo(club);
    let rep = (cl.fan || 3) * 2 - 10;
    if (S.comp && S.comp.LIB && S.comp.LIB.teams.includes(club)) rep += 6;
    return rep;
  }
  // origem do jogador: pesa muito na disposição de jogar no Brasil
  const LUSO = new Set(['POR', 'ANG', 'CPV', 'MOZ', 'GNB', 'STP', 'TLS']);
  const ASIA = new Set(['JAP', 'COR', 'ARA', 'IRA', 'QAT', 'UZB', 'IND', 'CHN', 'SYR', 'JOR', 'PAL', 'TAJ', 'KAZ', 'BAN', 'AUS', 'IRQ', 'EAU', 'THA', 'VIE', 'NEW']);
  const NAM = new Set(['EUA', 'MEX', 'CAN', 'PAN', 'JAM', 'CRC', 'HON', 'HAI', 'CUR', 'SUR', 'ELS', 'GUA', 'TRI', 'DOM', 'PUE']);
  const AFR = new Set(['MAR', 'CIV', 'NGA', 'SEN', 'GAN', 'CAM', 'DRC', 'MLI', 'GUI', 'TUN', 'EGI', 'BUR', 'ARL', 'GAB', 'TOG', 'COM', 'ZIM', 'ZAM', 'BEN', 'CON', 'CHA', 'NIG', 'TAN', 'SIE', 'MAU', 'SOU', 'CEN', 'LIB', 'GAM', 'ERI', 'SUD']);
  function natGroup(nat) { return nat === 'BRA' ? 'BRA' : C.SOUTH_AM.includes(nat) ? 'SA' : LUSO.has(nat) ? 'LUSO' : ASIA.has(nat) ? 'ASIA' : NAM.has(nat) ? 'NAM' : AFR.has(nat) ? 'AFR' : 'EUR'; }
  function originAdj(S, id) {
    const p = P[id], a = age(S, id), g = natGroup(p.nat), lt = C.LEAGUE_TIER[p.liga] ?? 2;
    if (g === 'BRA' || g === 'SA') return 0;
    if (g === 'LUSO') return p.nat === 'POR' ? (a < 30 ? -10 : -2) : -4;          // fala português: bem mais aberto
    if (g === 'ASIA') return a >= 33 ? -26 : -40;                                   // adaptação, idioma e salário: raríssimo
    if (g === 'NAM') return a >= 30 ? -8 : -16;
    if (g === 'AFR') return a >= 30 ? -8 : -16;
    return a >= 33 ? -2 : a >= 30 ? -9 : -24 - (lt >= 4 ? 10 : 0);                 // europeu jovem/no auge: pouco interesse
  }
  // disposição do jogador em ir pro clube comprador (0-100)
  function interest(S, id, buyer) {
    const p = P[id], s = view(S, id), a = age(S, id);
    const pt = playerTier(S, id), bt = divTier(S, buyer) ?? 2;
    const abroad = pt !== 2.5 && pt !== 1.5 && Wd.ownerOf(S, id) !== 'Livre';
    let sc = 50 + (bt - pt) * 18;
    if (p.nat === 'BRA') sc += abroad ? 25 : 5;
    else if (C.SOUTH_AM.includes(p.nat)) sc += 12;
    else if (['POR', 'ANG', 'CPV', 'MOZ'].includes(p.nat)) sc += 8;
    if (a >= 33) sc += 18; else if (a >= 31) sc += 12; else if (a >= 29) sc += 5;
    else if (pt >= 4) sc -= a <= 21 ? 6 : 12;
    sc -= Math.max(0, s.ovr - 80) * 2.2;
    if ((s.benchRun || 0) >= 4 || s.mor < 35) sc += 10;
    sc += clubRep(S, buyer);
    sc += originAdj(S, id);
    const o = Wd.ownerOf(S, id);
    if (o === 'Livre') { const g = natGroup(p.nat); sc += g === 'BRA' || g === 'SA' ? 15 : g === 'LUSO' ? 8 : 4; }
    // clubes do mesmo patamar: sem motivo forte (salário, vaga, projeto), jogador de clube grande não troca por outro igual
    if (divTier(S, o) && divTier(S, buyer)) {
      const ro = clubRep(S, o) + (S.divA.includes(o) ? 4 : 0), rb = clubRep(S, buyer) + (S.divA.includes(buyer) ? 4 : 0);
      const titular = (s.benchRun || 0) < 2 && s.mor >= 45;
      if (rb <= ro + 2) sc -= 10 + (titular ? 10 : 0) + Math.max(0, ro - rb) * 1.5;
      else sc += Math.min(8, (rb - ro) * 1.2);
      if (C.isDerby(o, buyer)) sc -= 25;   // rival: jogador teme a torcida
    }
    // Arábia Saudita e Turquia: salários muito acima do que o futebol brasileiro paga (veteranos 34+ topam voltar)
    if (abroad && P[id].liga === 'Saudi Pro League') sc -= a >= 34 ? 4 : 32;
    if (abroad && P[id].liga === 'Süper Lig') sc -= a >= 34 ? 2 : 17;
    if (a >= 34 && abroad && (p.nat === 'BRA' || C.SOUTH_AM.includes(p.nat))) sc += 8;
    if (s.ce <= S.season) sc += 6;
    const ar = S.arrears && S.arrears[buyer];   // fama de mau pagador afasta reforços
    if (ar) sc -= Math.min(30, ar.rep + (ar.days > 0 ? 8 : 0));
    return clamp(Math.round(sc), 0, 100);
  }
  const interestLabel = sc => sc >= 65 ? 'Alto' : sc >= 45 ? 'Médio' : sc >= 25 ? 'Baixo' : 'Nenhum';

  // preço pedido pelo dono
  // ---------- preço mínimo pelo nível ----------
  // o valor de mercado real despenca com a idade, mas o overall continua alto: o clube não vende um 80 a preço de banana
  const FLOOR_AGE = a => a <= 30 ? 1 : a <= 32 ? 0.85 : a <= 33 ? 0.75 : a <= 34 ? 0.65 : a <= 36 ? 0.55 : 0.45;
  const ovrFloor = (ovr, a) => ovr < 70 ? 0 : 60000 * Math.pow(1.12, ovr - 81) * FLOOR_AGE(a);
  // ligas ricas: jogador não troca salário alto por menos; clube rico não precisa vender titular
  const RICH_WAGE = { 'Saudi Pro League': 1.5, 'MLS': 1.3, 'Premier League': 1.3, 'LaLiga': 1.2, 'Serie A (ITA)': 1.2, 'Bundesliga': 1.2, 'Ligue 1': 1.15 };
  const RICH_CLUB_LEAGUES = new Set(['Saudi Pro League', 'Premier League', 'LaLiga', 'Serie A (ITA)', 'Bundesliga', 'Ligue 1']);
  const starterCache = new Map();
  function isForeignStarter(S, id, o) {
    const key = `${S.seed}|${o}|${S.season}|${S.lastDay}`;
    let set = starterCache.get(key);
    if (!set) { if (starterCache.size > 400) starterCache.clear(); set = new Set(squad(S, o).sort((a, b) => view(S, b).ovr - view(S, a).ovr).slice(0, 11)); starterCache.set(key, set); }
    return set.has(id);
  }
  const curFd = S => { try { return Math.floor(SEASON.fdAt(S, SEASON.now(S)) + 1e-6); } catch (e) { return (S.slot || 0) * 6; } };
  // gigantes europeus (caçam jovens de potencial alto) e árabes ricos (craques no auge): pagam acima do valor
  const EU_GIANTS = ['Real Madrid', 'Barcelona', 'Manchester City', 'Manchester United', 'Liverpool', 'Arsenal', 'Chelsea', 'Bayern Munich', 'Paris Saint-Germain', 'Juventus', 'Inter Milan', 'Milan', 'Atlético de Madrid', 'Borussia Dortmund'];
  const ARAB_RICH = ['Al-Hilal Saudi', 'Al-Nassr', 'Al-Ittihad', 'Al-Ahli Saudi'];
  const hotYoung = (S, id) => age(S, id) <= 21 && view(S, id).pot >= 82 && view(S, id).ovr >= 64;
  // concorrência: jogador cobiçado tem outro clube na briga (estável dentro da semana fictícia)
  function rivalFor(S, id, buyer) {
    const o = Wd.ownerOf(S, id); if (!o || o === 'Livre' || Wd.isHuman(S, o) || !inBR(S, o)) return null;
    const v = view(S, id), young = hotYoung(S, id); if (v.ovr < 77 && !young) return null;
    const wk = Math.floor(curFd(S) / 7), h = hash(`riv${id}${S.season}${wk}`);
    if (h % 100 >= 30) return null;
    if (young && h % 3 === 0) return EU_GIANTS[h % EU_GIANTS.length];
    const pool = [...S.divA].filter(c => c !== o && c !== buyer && !Wd.isHuman(S, c) && (S.cash[c] || 0) > v.mv * 0.8);
    return pool.length ? pool[h % pool.length] : null;
  }
  function ask(S, id, buyer) {
    const o = Wd.ownerOf(S, id), s = view(S, id);
    const why = [];
    if (o === 'Livre') return { fee: 0, why: ['Jogador sem clube'] };
    let f = s.mv;
    // só pra quem joga fora do Brasileirão; lenda (Diamante) é negócio relâmpago: sem piso e sem trava de clube rico
    const abroad = !Wd.divOf(S, o);
    if (abroad) { const fl = ovrFloor(s.ovr, age(S, id)); if (fl > f * 1.05) { f = fl; why.push('preço mínimo pelo nível'); } }
    const sl = s.ce - S.season;
    const cf = sl <= 0 ? 0.55 : sl === 1 ? 0.85 : 1;
    if (cf < 1) why.push(sl <= 0 ? 'contrato acabando' : 'contrato curto');
    if (Wd.clubInfo(o).div0 === 'W' || !Wd.CL[o] || (!Wd.divOf(S, o))) {
      const t = C.LEAGUE_TIER[P[id].liga] ?? 2;
      const m = t >= 4 ? 1.35 : t >= 3 ? 1.2 : 1.05;
      if (m > 1.1) why.push('liga forte');
      f *= m;
      if (RICH_CLUB_LEAGUES.has(P[id].liga) && !s.list && isForeignStarter(S, id, o)) { f *= 1.8; why.push('titular de clube rico'); }
    } else {
      const xi = SEASON.aiTeam(S, o, true).xi.filter(Boolean);
      const rank = xi.slice().sort((a, b) => view(S, b).ovr - view(S, a).ovr).indexOf(id);
      if (rank === 0 && s.ovr >= 75) { f *= 1.6; why.push('craque do time'); }
      else if (rank >= 0 && rank < 3) { f *= 1.35; why.push('um dos melhores do elenco'); }
      else if (rank >= 0) { f *= 1.15; why.push('titular'); }
      else f *= 0.95;
      if (buyer && C.isDerby(o, buyer)) { f *= 1.6; why.push('venda pra rival: torcida pressiona'); }
      else if (buyer && divTier(S, buyer) && clubRep(S, buyer) <= clubRep(S, o) + 2 && S.divA.includes(o)) { f *= 1.15; why.push('não fortalece concorrente direto'); }
      if ((S.cash[o] || 0) < 0) { f *= 0.85; why.push('clube precisa de dinheiro'); }
    }
    if (s.list) { f *= 0.8; why.push('está na lista de transferências'); }
    if (buyer) {
      const rum = S.ps[id] && S.ps[id].rum, fdn = curFd(S);
      if (rum && rum.c === buyer && fdn - rum.fd <= 10) { f *= 1.05; why.push('especulação na imprensa encareceu'); }
      const rv = rivalFor(S, id, buyer); if (rv) { f *= 1.12; why.push(`${rv} também quer: disputa pelo jogador`); }
    }
    f *= cf;
    const j = 1 + ((hash(`${id}|${S.season}|${S.lastDay}`) % 100) / 100 - 0.5) * 0.08;
    return { fee: r1k(f * j) - 1, why };
  }
  // ---------- troca ----------
  const SET_NEED = { GOL: 3, DEF: 8, MEI: 8, ATA: 6 };
  function swapValue(S, sid, club) {
    if (sid == null || Wd.ownerOf(S, sid) !== S.club) return { ok: false, why: 'Esse jogador não é do seu elenco.' };
    if (pendingOf(S, sid)) return { ok: false, why: 'Esse jogador já faz parte de um acordo fechado para a próxima janela.' };
    { const pc = preOf(S, sid); if (pc) return { ok: false, why: `${P[sid].short} já assinou pré-contrato com o ${pc.club} e sai de graça no fim da temporada. Não entra em troca.` }; }   // v261: brecha (2CYPVW: Depay com pré do Santos foi na troca do Corinthians)
    const s = view(S, sid), a = age(S, sid);
    if (S.ps[sid] && (S.ps[sid].loan || S.ps[sid].loanOut)) return { ok: false, why: 'Jogador emprestado não entra em troca.' };
    if (Wd.locked(S, sid)) return { ok: false, why: `${P[sid].short} chegou há pouco e não pode ser negociado ainda.` };
    if (Wd.isHuman(S, club)) return { ok: true, human: true, credit: 0, why: `O técnico do ${club} decide se aceita ${P[sid].short} na troca` };
    const str = SEASON.strength(S, club), set = C.SETOR_OF[P[sid].pos] || 'MEI';
    const have = squad(S, club).filter(x => C.SETOR_OF[P[x].pos] === set).length, need = have < (SET_NEED[set] || 7);
    if (squad(S, club).length >= ECON.squadMax) return { ok: false, why: `O ${club} está com elenco cheio e não aceita jogador na troca.` };
    if (s.ovr < str - 6) return { ok: false, why: `O ${club} não se interessa por ${P[sid].short}: não melhora o elenco deles.` };
    if (a >= 34) return { ok: false, why: `O ${club} não quer ${P[sid].short} na troca por causa da idade.` };
    const fit = clamp(0.55 + (s.ovr - str) * 0.04 + (need ? 0.15 : 0) - (a >= 31 ? 0.15 : 0), 0.35, 1);
    return { ok: true, credit: r1k(s.mv * fit), fit, need, why: need ? `O ${club} precisa de ${set === 'GOL' ? 'goleiro' : set === 'DEF' ? 'defensor' : set === 'MEI' ? 'meio-campista' : 'atacante'}` : `Encaixa no elenco do ${club}` };
  }
  function doSwap(S, sid, to, credit) {
    const s = ps(S, sid); delete s.list; delete s.loanList; s.ce = Math.max(s.ce, S.season + 2); s.benchRun = 0;
    Wd.move(S, sid, to, false, { t: 'troca', fee: credit || 0 });
    EVENTS.news(S, { t: 'transfer', title: `${P[sid].name} vai para o ${to} como parte da troca`, body: `Entrou na negociação avaliado em T$ ${C.fmt(credit || 0)}.`, ids: [sid], clubs: [S.club, to] });
  }
  // ---------- empréstimo a partir da lista ----------
  // empréstimo: taxa + divisão do salário. O dono compara o "pacote" (taxa + parte do salário que deixa de pagar no período)
  function loanDays(S, len) { const dl = daysLeft(S); return len === '6m' ? Math.max(5, Math.round(dl * Math.min(1, 28 / Math.max(1, SEASON.SLOTS - S.slot)))) : dl; }
  function loanBase(S, id) {
    const owner = Wd.ownerOf(S, id), ll = (S.ps[id] || {}).loanList || { len: '6m' };
    const abroad = !!ll.abroad && isAbroad(S, owner);
    // exterior: taxa mais cara; o dono paga até 30% do salário, e até 40% se ele for titular num clube menor (vitrine garantida)
    const share = abroad ? (showcase(S, id, S.club).starter && SEASON.strength(S, S.club) < 74 ? 60 : 70) : clamp(Math.round((0.5 + (view(S, id).ovr - SEASON.strength(S, owner)) * 0.02) * 100 / 10) * 10, 40, 100);
    const fee = r1k(view(S, id).mv * (abroad ? 0.08 : 0.05)), sal = view(S, id).sal, days = loanDays(S, ll.len);
    return { fee, share, sal, days, len: ll.len, abroad, value: fee + sal * share / 100 * days };
  }
  const loanValue = (b, fee, share) => fee + b.sal * share / 100 * b.days;
  function requestLoan(S, id, terms) {
    const owner = Wd.ownerOf(S, id), s = ps(S, id), ll = s.loanList;
    if (!ll || owner === S.club) return { ok: false, msg: 'Esse jogador não está disponível para empréstimo.' };
    if (s.loan || s.loanOut) return { ok: false, msg: 'Esse jogador já está emprestado.' };
    if (pendingOf(S, id)) return { ok: false, msg: 'Esse jogador já faz parte de um acordo fechado para a próxima janela.' };
    if (brLock(S, owner, S.club)) return { ok: false, msg: brLockMsg(owner) };
    { const dw = diaWhy(S, id); if (dw) return { ok: false, msg: dw }; }
    const isDia = !!diaReq(S, id);
    if (!SEASON.windowOpen(SEASON.now(S), S)) return { ok: false, msg: winMsg() };
    if (effSize(S, S.club) >= ECON.squadMax) return { ok: false, msg: `Elenco cheio (${ECON.squadMax}, contando quem chega e sai na janela).` };
    const base = loanBase(S, id);
    let share = base.share, fee = base.fee;
    if (terms) { share = clamp(Math.round(+terms.share / 10) * 10, 20, 100); fee = Math.max(0, Math.round(+terms.fee / 1000) * 1000); }
    const part = Math.round(view(S, id).sal * share / 100);
    const b = budget(S);
    if (part > b.wageRoom) return { ok: false, msg: `Sua parte do salário (T$ ${C.fmt(part)}/dia) estoura a folga salarial.` };
    if (fee > b.transfer) return { ok: false, msg: `A taxa de empréstimo (T$ ${C.fmt(fee)}) passa do orçamento.` };
    if (Wd.isHuman(S, owner)) {
      const me = S.club, k = hash(`lr${id}${me}${SEASON.now(S)}`);
      Wd.asClub(S, owner, () => { S.offers = S.offers.filter(o => !(o.id === id && o.club === me)); S.offers.push({ id, club: me, fee, exp: (S.lastDay ?? 0) + 2, k, loanOf: ll.len, share, human: true });
        EVENTS.news(S, { t: 'transfer', title: `${me} pede ${P[id].short} emprestado`, body: `Por ${LOAN_LEN[ll.len]}, pagando ${share}% do salário e taxa de T$ ${C.fmt(fee)}. Responda em Mercado › Propostas.`, ids: [id], clubs: [owner, me], desk: S.__me }); });
      return { ok: true, sent: true, msg: `Pedido enviado ao técnico do ${owner}.` };
    }
    if (interest(S, id, S.club) < 30) return { ok: false, msg: `${P[id].short} não quer ir para o ${S.club}.` };
    if (base.abroad && showcase(S, id, S.club).sc < 50) return { ok: false, msg: `O ${owner} quer que ele jogue: no ${S.club} ele não seria titular. Clubes onde ele tenha espaço levam vantagem.` };
    if (terms && !isDia) {
      const n = S.negs[id] = negState(S, id) || { season: S.season, tries: 0 };
      if (n.closedUntil && S.lastDay < n.closedUntil) return { ok: false, msg: `O ${owner} encerrou a conversa. Tente de novo em ${n.closedUntil - S.lastDay} dia(s).` };
      const mine = loanValue(base, fee, share), need = base.value;
      if (mine < need * 0.97) {
        n.loanT = (n.loanT || 0) + 1;
        if (n.loanT >= 3) { n.closedUntil = S.lastDay + 2; return { ok: false, status: 'closed', msg: `Terceira recusa. O ${owner} encerrou a conversa por 2 dias.` }; }
        const needFee = Math.max(0, r1k(need - base.sal * share / 100 * base.days));
        if (mine >= need * 0.8) return { ok: false, status: 'counter', fee: needFee, share, msg: `O ${owner} topa ${share}% do salário se a taxa for T$ ${C.fmt(needFee)}. Ou aumente a sua parte do salário.` };
        return { ok: false, status: 'reject', msg: `O ${owner} achou pouco: com ${share}% do salário, a taxa teria que ser de uns T$ ${C.fmt(needFee)}.` };
      }
    }
    const end = isDia ? Math.min(S.slot + 14, SEASON.SLOTS - 1) : ll.len === '6m' ? Math.min(S.slot + 28, SEASON.SLOTS - 1) : null;
    if (isDia) diaPay(S, id);
    s.loanOut = { from: owner, season: S.season, end, len: ll.len, share, fee, k0: S.slot, ...(base.abroad ? { abroad: true, j0: (s.st && s.st.j) || 0, opt: r1k(view(S, id).mv * 1.25) } : {}) };
    delete s.loanList; delete s.list;
    S.cash[S.club] -= fee; if (S.cash[owner] !== undefined) S.cash[owner] += fee; S.fin.spent = (S.fin.spent || 0) + fee;
    Wd.move(S, id, S.club, true, { t: 'emprestimo', fee, x: { sh: share, end, len: ll.len } });
    if (isDia) EVENTS.news(S, { t: 'transfer', front: 200, kick: 'Bomba', title: `${C.pick(BOMB, R('bl' + id + S.lastDay))} ${P[id].name} chega emprestado ao ${S.club}`, body: `Craque Diamante por 3 meses (14 jogos). Depois volta ao ${owner}.`, ids: [id], clubs: [S.club, owner] });
    else EVENTS.news(S, { t: 'transfer', title: `${P[id].short} chega emprestado ao ${S.club}`, body: `Por ${LOAN_LEN[ll.len]}. O ${S.club} paga ${share}% do salário; taxa de T$ ${C.fmt(fee)} ao ${owner}.${base.abroad ? ` Opção de compra de T$ ${C.fmt(s.loanOut.opt)}. O ${owner} quer vê-lo jogando: com pouca minutagem, pode pedir ele de volta.` : ''}`, ids: [id], clubs: [S.club, owner] });
    return { ok: true, msg: `${P[id].short} emprestado por ${isDia ? '3 meses (jogador Diamante)' : LOAN_LEN[ll.len]}!` };
  }
  // ---------- IA também anuncia jogadores (lista de transferências e empréstimo) ----------
  // ---------- empréstimo do exterior ----------
  // clubes de fora emprestam jovens com potencial sem espaço (até 23 anos) e veteranos encostados; titulares nunca.
  // O dono quer vitrine: aceita quando ele vai jogar. Clube pequeno onde ele seria titular leva vantagem (e o dono paga mais do salário).
  let BRC = null;   // clubes brasileiros fora das Séries A e B (regionais): não contam como exterior
  const brOther = c => { if (!BRC) { BRC = new Set(); for (const k in P) if (['Regional', 'Brasileirão', 'Brasileirão B', 'Base'].includes(P[k].liga) && P[k].club0) BRC.add(P[k].club0); } return BRC.has(c); };
  const isAbroad = (S, c) => !!c && c !== 'Livre' && c !== 'Aposentado' && !Wd.divOf(S, c) && !brOther(c);
  let abroadCache = null;
  function abroadPool(S) {
    if (abroadCache && abroadCache.s === S.season && abroadCache.seed === S.seed) return abroadCache.ids;
    const ids = []; for (const id of Wd.nonYouth()) { if (isAbroad(S, Wd.ownerOf(S, id))) ids.push(id); }
    abroadCache = { s: S.season, seed: S.seed, ids }; return ids;
  }
  function abroadLoanable(S, id) {
    const o = Wd.ownerOf(S, id); if (!isAbroad(S, o) || Wd.locked(S, id)) return false;
    const s = S.ps[id]; if (s && (s.loan || s.loanOut || s.list)) return false;
    const v = view(S, id), a = age(S, id), rank = squad(S, o).filter(x => view(S, x).ovr > v.ovr).length;
    if (rank < 11 || v.ovr >= 84) return false;                                    // titular / craque: nunca
    if (a <= 23 && v.pot >= v.ovr + 4) return true;                                 // jovem com potencial sem espaço
    return !EU_GIANTS.includes(o) && a >= 29 && rank >= 14;                          // veterano encostado (gigante europeu só empresta jovem)
  }
  function abroadListings(S, d, r) {
    let cur = 0;
    for (const id in S.ps) { const s = S.ps[id]; if (!s || !s.loanList || !s.loanList.abroad) continue;
      if (d - s.loanList.day > 14 || !isAbroad(S, Wd.ownerOf(S, +id))) delete s.loanList; else cur++; }
    const pool = abroadPool(S); if (!pool.length) return;
    for (let i = 0, tries = 0; i < 5 && cur < 30 && tries < 80; tries++) {
      const id = pool[Math.floor(r() * pool.length)]; if (!abroadLoanable(S, id)) continue;
      const s = ps(S, id); if (s.loanList) continue;
      s.loanList = { day: d, season: S.season, len: r() < 0.5 ? '6m' : '1t', ai: true, abroad: true }; i++; cur++;
    }
  }
  // vitrine: o clube de fora quer minutagem. Titular no seu time pesa mais que o tamanho do clube.
  function showcase(S, id, buyer) {
    const v = view(S, id), str = SEASON.strength(S, buyer), starter = v.ovr >= str - 1;
    let sc = 40 + (starter ? 30 : v.ovr >= str - 4 ? 5 : -25);
    if (S.divA.includes(buyer)) sc += 8;
    if (S.comp && ['LIB', 'SUL', 'CONF'].some(k => S.comp[k] && JSON.stringify(S.comp[k].groups || S.comp[k].teams || '').includes(`"${buyer}"`))) sc += 8;
    return { sc, starter };
  }
  function aiListings(S, d, r) {
    for (const c of Wd.brClubs(S)) {
      if (Wd.isHuman(S, c)) continue;
      const sq = squad(S, c);
      for (const id of sq) { const s = S.ps[id]; if (s && (s.list || s.loanList) && s.list?.ai !== false && (s.list || s.loanList).ai && d - (s.list || s.loanList).day > 12) { delete s.list; delete s.loanList; } }
      const cur = sq.filter(id => S.ps[id] && (S.ps[id].list || S.ps[id].loanList)).length;
      if (cur >= 3 || r() > 0.35) continue;
      const xi = new Set(SEASON.aiTeam(S, c, true).xi.filter(Boolean));
      const fringe = sq.filter(id => !xi.has(id) && !Wd.locked(S, id) && !(S.ps[id] && (S.ps[id].loan || S.ps[id].loanOut || S.ps[id].list || S.ps[id].loanList)));
      if (!fringe.length) continue;
      const id = fringe[Math.floor(r() * fringe.length)], s = ps(S, id), a = age(S, id);
      if (a <= 22) s.loanList = { day: d, season: S.season, len: r() < 0.6 ? '6m' : '1t', ai: true };
      else if (sq.length > 22 || a >= 30) s.list = { day: d, season: S.season, ai: true };
    }
  }
  function salaryDemand(S, id, buyer) {
    const s = view(S, id), sc = interest(S, id, buyer);
    const o = Wd.ownerOf(S, id), a = age(S, id), abroad = o && o !== 'Livre' && !Wd.divOf(S, o);
    const base = Math.max(s.sal, s.mv * ECON.salaryRate, abroad ? ovrFloor(s.ovr, a) * ECON.salaryRate : 0);
    const d = base * (1.1 + clamp((60 - sc) / 100, -0.1, 0.6));
    // quem está numa liga rica (e ainda no clube de lá) não aceita ganhar menos pra vir
    const rich = abroad ? (RICH_WAGE[P[id].liga] || 1) : 1;
    return Math.max(20, Math.round(Math.max(d, s.sal * rich) / 10) * 10);
  }

  // ---------- orçamento (barra salários × transferências) ----------
  function daysLeft(S) { return Math.max(5, Math.ceil((SEASON.sport(S, SEASON.slotTime(S, SEASON.SLOTS - 1)) - SEASON.sport(S, SEASON.now(S))) / DAY)); }
  function budget(S) {
    const pay = Wd.payroll(S, S.club) + pendingFor(S, S.club).reduce((t, x) => t + x.sal, 0), cash = S.cash[S.club] || 0, dl = daysLeft(S);
    if (S.wageBudget == null || S.wageBudget < pay) S.wageBudget = Math.max(pay, Math.round(pay * 1.1));
    const maxWage = Math.max(pay, Math.floor(Math.max(0, cash) / dl));
    S.wageBudget = Math.min(S.wageBudget, Math.max(pay, maxWage));
    const reserve = S.wageBudget * dl;
    const seasonLeft = Math.max(0, Math.ceil((SEASON.sport(S, SEASON.slotTime(S, SEASON.SLOTS - 1)) - SEASON.sport(S, SEASON.now(S))) / DAY));   // v247: dias reais até o fim (daysLeft tem piso de 5, é só pra reserva)
    return { cash, pay, wage: S.wageBudget, wageRoom: S.wageBudget - pay, transfer: Math.max(0, cash - reserve), reserve, daysLeft: dl, seasonLeft, cashDays: pay > 0 ? Math.max(0, Math.floor(cash / pay)) : null, maxWage };
  }

  // ---------- negociação do usuário ----------
  // v242: acordo de taxa com a IA vale NEG_DAYS dias do jogo (pedido do Kevin: proposta pendurada; e fechava a brecha de segurar taxa barata a temporada toda)
  const NEG_DAYS = 3;
  const negUntil = n => n && n.fee && n.fd != null ? n.fd + NEG_DAYS : null;
  const negExpired = (S, n) => { const u = negUntil(n); return u != null && (S.lastDay ?? 0) > u; };
  function negState(S, id) { const n = S.negs[id]; if (n && negExpired(S, n)) { delete S.negs[id]; return null; } return n && n.season === S.season ? n : null; }
  // v243: Retirar desfaz só o acordo/contraproposta; a contagem de recusas e o "encerrou a conversa por 2 dias" continuam valendo (antes Retirar zerava a trava)
  function negDrop(S, id) {
    const n = S.negs && S.negs[id];
    if (!n || !('fee' in n || n.counter)) return { ok: false, msg: 'Não há proposta acertada com esse jogador.' };
    for (const k of ['fee', 'swap', 'credit', 'owner', 'fd', 'counter']) delete n[k];
    if (!n.tries && !n.loanT && !n.closedUntil) delete S.negs[id];
    return { ok: true, msg: `Proposta por ${P[id] ? P[id].short : 'o jogador'} retirada.` };
  }
  // ---------- jogador Diamante (overall 85+) no mercado: mesma regra do pacote Diamante ----------
  // custa 5 estrelas + 1 diamante (Messi e Cristiano Ronaldo: 2 diamantes) e fica só 3 meses (14 jogos), depois volta à origem
  const DIA_ICONS = new Set([28003, 8198]);
  // lendas: veteranos consagrados que contam como Diamante mesmo abaixo de 85 (enquanto tiverem overall 72+)
  const LEGENDS = new Set([18922 /* Benzema */, 171424 /* Mahrez */, 207834 /* Bounou */, 200512 /* Mané */, 93128 /* Koulibaly */, 38253 /* Lewandowski */,
    125781 /* Griezmann */, 138927 /* Carvajal */, 74857 /* ter Stegen */, 88755 /* De Bruyne */, 27992 /* Modrić */, 59377 /* De Gea */, 17259 /* Neuer */,
    16306 /* Casemiro */, 91845 /* Son */, 58358 /* Thomas Müller */, 25557 /* Sergio Ramos */, 225083 /* Kanté */]);
  function isLegend(S, id) { return LEGENDS.has(id) && view(S, id).ovr >= 72; }
  function diaReq(S, id) { if (!P[id] || P[id].youth) return null; const ov = view(S, id).ovr; if (ov < 85 && !(LEGENDS.has(id) && ov >= 72)) return null; return [C.PACK_COST.dia[0], DIA_ICONS.has(id) ? 2 : C.PACK_COST.dia[1]]; }
  function diaWhy(S, id) {
    const r = diaReq(S, id); if (!r) return null;
    if (isOuro(S)) return `${P[id].short} é jogador Diamante: não vem pra Série ${Wd.divOf(S, S.club) || 'B'}. Na B e na C, a carta forte é o Ouro Especial.`;
    if ((S.stars || 0) >= r[0] && (S.dias || 0) >= r[1]) return null;
    return `${P[id].short} é jogador Diamante: só chega com ${r[0]} estrelas e ${r[1]} diamante${r[1] > 1 ? 's' : ''} (você tem ${S.stars || 0}★ e ${S.dias || 0} diamante${(S.dias || 0) === 1 ? '' : 's'}).`;
  }
  function diaPay(S, id) { const r = diaReq(S, id); if (!r) return; S.stars = (S.stars || 0) - r[0]; S.dias = (S.dias || 0) - r[1]; }
  // depois de chegar: passagem de 3 meses, sem renovação nem dispensa, e a imprensa em polvorosa
  function diaMark(S, id, from, sal0, ce0, how) {
    const s = ps(S, id), deal = diaDeal(S, id, 'dia'), r = R(`bombm${id}${S.lastDay}`);
    s.loan = { from: from || 'Livre', end: deal.end, sal0: sal0 != null ? sal0 : s.sal, season: S.season, kind: 'dia', mkt: how || 'compra' };
    if (ce0 != null) s.ce = ce0;
    s.lock = S.season * 100 + deal.end + 1;
    try { if (SEASON.fansAdd) SEASON.fansAdd(S, 4, `chegada de ${P[id].short}`); } catch (e) {}
    const n = P[id].name, c = S.club, fr = from && from !== 'Livre' ? `o ${from}` : 'o jogador, que estava sem clube,';
    const T = [
      [`${C.pick(BOMB, r)} ${n} é do ${c}`, `Negócio de mercado que parou o país. Passagem de 3 meses (${deal.until}) e depois ele volta para ${from && from !== 'Livre' ? `o ${from}` : 'o mercado'}.`],
      [`Mercado em chamas: ${c} anuncia ${n}`, `Aos ${age(S, id)} anos, ${P[id].short} topa o desafio. Contrato de 3 meses, com a torcida lotando o aeroporto.`],
      [`${n} no ${c}: a contratação que ninguém esperava`, `${fr[0].toUpperCase() + fr.slice(1)} fecha negócio relâmpago. Vínculo curto, de 3 meses, como manda a regra dos craques Diamante.`],
      [`Golpe de mercado: ${P[id].short} vai vestir a camisa do ${c}`, `Anúncio com vídeo, festa e fila na loja oficial. Ele fica 3 meses (${deal.until}).`],
    ];
    const [title, body] = C.pick(T, r);
    EVENTS.news(S, { t: 'transfer', front: 200, kick: 'Bomba', title, body, ids: [id], clubs: [c, from].filter(x => x && x !== 'Livre') });
  }
  // ---------- trava da pré-temporada ----------
  // antes da 1ª rodada, clube do Brasileirão sem técnico (IA) não compra nem vende pra outro clube do Brasileirão:
  // quem entra na liga mais tarde encontra o elenco inteiro. Exterior e jogadores livres seguem liberados.
  const inBR = (S, c) => !!c && (!!Wd.divOf(S, c));
  const preLockOn = S => S.slot === 0 && !S.post;
  function brLock(S, seller, buyer) { return preLockOn(S) && inBR(S, seller) && inBR(S, buyer) && seller !== buyer && (!Wd.isHuman(S, seller) || !Wd.isHuman(S, buyer)); }
  const brLockMsg = c => `Pré-temporada: o ${c} ainda está sem técnico e não negocia com clubes do Brasileirão até a 1ª rodada. Jogadores do exterior e livres estão liberados.`;
  // v192: jogador com pré-contrato assinado não muda de clube antes do fim da temporada (chega de graça ao clube do pré-contrato)
  const preOf = (S, id) => (S.pre || []).find(x => x.id === id) || null;
  function canTalk(S, id) {
    { const pc = preOf(S, id); if (pc && pc.club !== S.club) return { ok: false, why: `${P[id].short} já assinou pré-contrato com o ${pc.club} e chega lá no fim da temporada. Não negocia com mais ninguém.` }; }
    if (isLoan(S, id)) return { ok: false, why: 'Jogador emprestado não pode ser negociado em definitivo durante o empréstimo.' };
    { const o0 = Wd.ownerOf(S, id); if (brLock(S, o0, S.club)) return { ok: false, why: brLockMsg(o0), brLock: true }; }
    { const dw = diaWhy(S, id); if (dw) return { ok: false, why: dw, dia: true }; }
    const pd = pendingOf(S, id);
    if (pd) { const dest = pd.swap === id ? pd.from : pd.club; return { ok: false, why: dest === S.club ? `Acordo já fechado: ${P[id].short} se apresenta quando a janela abrir.` : `${P[id].short} já tem acordo fechado com o ${dest}.` }; }
    const n = negState(S, id);
    if (n && n.closedUntil && S.lastDay < n.closedUntil) return { ok: false, why: `${Wd.ownerOf(S, id)} encerrou a conversa. Tente de novo em ${n.closedUntil - S.lastDay} dia(s).` };
    if (Wd.locked(S, id)) return { ok: false, why: `${P[id].short} chegou há pouco ao ${Wd.ownerOf(S, id)}. Só pode ser negociado daqui a ${Wd.lockLeft(S, id)} jogo(s) (meio turno).` };
    const sc = interest(S, id, S.club);
    if (Wd.isHuman(S, Wd.ownerOf(S, id))) return { ok: true, interest: sc, human: true };
    if (sc < 25) return { ok: false, why: `${P[id].short} não tem interesse em jogar no ${S.club} neste momento.`, interest: sc };
    const o = Wd.ownerOf(S, id);
    if (o && S.cash[o] !== undefined && o !== S.club && squad(S, o).length <= 20) return { ok: false, why: `O ${o} está com elenco curto e não negocia agora.` };
    if (o && C.isDerby(o, S.club)) {
      const xi = SEASON.aiTeam(S, o, true).xi.filter(Boolean).sort((a, b) => view(S, b).ovr - view(S, a).ovr);
      if (xi.indexOf(id) >= 0 && xi.indexOf(id) < 4) return { ok: false, why: `A diretoria do ${o} se recusa a negociar um titular com o rival. A torcida não aceitaria.`, interest: sc };
    }
    return { ok: true, interest: sc };
  }
  const winMsg = () => 'Janela de transferências fechada nesta fase da temporada. O aviso no topo do Mercado mostra quando ela reabre.';
  function bid(S, id, fee, swapId) {
    const t = canTalk(S, id); if (!t.ok) return { status: 'closed', msg: t.why };
    { const o0 = Wd.ownerOf(S, id); if (foreignFloor(S, o0)) return { status: 'closed', msg: `O ${o0} não negocia: o elenco está no limite (${FOREIGN_MIN} jogadores).` }; }
    if (S.safCrisis && S.safCrisis[S.club]) return { status: 'closed', msg: 'Crise financeira: a diretoria travou as contratações até a situação se resolver.' };
    const owner = Wd.ownerOf(S, id);
    if (brLock(S, owner, S.club)) return { status: 'closed', msg: brLockMsg(owner) };
    if (swapId == null && effSize(S, S.club) >= ECON.squadMax) return { status: 'reject', msg: `Elenco cheio (${ECON.squadMax}, contando quem chega e sai na janela). Libere vaga ou inclua um jogador na troca.` };   // v231: também pra clube da IA (antes só avisava na hora do contrato)
    if (Wd.isHuman(S, owner)) {   // clube de outro treinador: vira proposta pra ele decidir
      const hs = swapId != null ? swapValue(S, swapId, owner) : null;
      if (hs && !hs.ok) return { status: 'reject', msg: hs.why, swapNo: true };
      if (!hs && fee <= 0) return { status: 'reject', msg: 'Ofereça algum valor ou inclua um jogador na troca.' };
      if (fee > budget(S).transfer) return { status: 'reject', msg: `A proposta passa do seu orçamento de compras (T$ ${C.fmt(budget(S).transfer)}).` };
      if (effSize(S, S.club) >= ECON.squadMax) return { status: 'reject', msg: `Elenco cheio (${ECON.squadMax}, contando quem chega e sai na janela).` };
      const me = S.club, k = hash(`h${id}${me}${SEASON.now(S)}`);
      Wd.asClub(S, owner, () => {
        S.offers.filter(o => o.id === id && o.club === me).forEach(o => Wd.asClub(S, me, () => { S.outOffers = (S.outOffers || []).filter(x => x.k !== o.k); }));
        S.offers = S.offers.filter(o => !(o.id === id && o.club === me));
        S.offers.push({ id, club: me, fee: Math.round(fee), exp: (S.lastDay ?? SEASON.dayAbs(S, SEASON.now(S))) + 2, k, human: true, ...(hs ? { swap: swapId } : {}) });
        EVENTS.news(S, { t: 'transfer', title: `${me} faz proposta por ${P[id].short}`, body: `Oferta ${fee ? `de T$ ${C.fmt(fee)}${hs ? ` + ${P[swapId].name} na troca` : ''}` : `de troca: ${P[swapId].name}`} do técnico ${S.coaches[me] ? S.coaches[me].name : ''}. Responda em Mercado › Propostas.`, ids: [id], clubs: [owner, me], desk: S.__me });
      });
      return { status: 'sent', msg: `Proposta ${fee ? `de T$ ${C.fmt(fee)}${hs ? ` + ${P[swapId].short} na troca` : ''}` : `de troca (${P[swapId].short})`} enviada a ${S.coaches[owner].name}. Ele decide se aceita.` };
    }
    const a = ask(S, id, S.club);
    const n = S.negs[id] = negState(S, id) || { season: S.season, tries: 0 };
    // troca: o jogador oferecido abate da taxa se interessar ao clube vendedor
    const sw = swapId != null ? swapValue(S, swapId, owner) : null;
    if (sw && !sw.ok) return { status: 'reject', msg: sw.why, swapNo: true };
    const credit = sw ? sw.credit : 0, need = Math.max(0, a.fee - credit);
    if (fee >= need) { n.fee = fee; n.swap = sw ? swapId : null; n.credit = credit; n.owner = owner; n.fd = S.lastDay ?? 0; return { status: 'accept', fee, msg: sw ? `${owner} aceitou ${P[swapId].short} na troca (abate T$ ${C.fmt(credit)})${fee ? ` + T$ ${C.fmt(fee)}` : ', sem pagar nada a mais'}. Agora é com o jogador.` : `${owner} aceitou T$ ${C.fmt(fee)}. Agora é com o jogador.` }; }
    if (fee >= need * 0.8) { n.counter = need; return { status: 'counter', ask: need, msg: `${owner} responde: ${sw ? `com ${P[swapId].short} na troca, ` : ''}por menos de T$ ${C.fmt(need)} não sai${a.why.length ? ` (${a.why.join(', ')})` : ''}.` }; }
    n.tries++;
    if (n.tries >= 3) { n.closedUntil = S.lastDay + 2; return { status: 'closed', msg: `Terceira recusa. ${Wd.ownerOf(S, id)} encerrou a negociação por 2 dias.` }; }
    return { status: 'reject', msg: `Recusada. ${Wd.ownerOf(S, id)} considera a proposta muito abaixo${a.why.length ? ` (${a.why.join(', ')})` : ''}. ${3 - n.tries} tentativa(s) restante(s).` };
  }
  // acordos fechados com a janela fechada: o jogador chega quando a janela abrir
  const pendingOf = (S, id) => (S.pendTr || []).find(x => x.id === id || x.swap === id) || null;
  // v231: tamanho do elenco na abertura da janela = atual + chegadas acordadas − saídas acordadas (troca é 1 por 1, não muda)
  const effSize = (S, club) => squad(S, club).length + (S.pendTr || []).reduce((n, x) => n + (x.swap == null ? (x.club === club ? 1 : 0) - (x.from === club ? 1 : 0) : 0), 0);
  function pendingFor(S, club) { return (S.pendTr || []).filter(x => x.club === club); }
  function settlePending(S) {
    if (!S.pendTr || !S.pendTr.length || !SEASON.windowOpen(SEASON.now(S), S)) return;
    const due = S.pendTr; S.pendTr = [];
    // v166: 4+ chegadas no mesmo clube viram "pacotão de reforços" (as notícias individuais ficam menores)
    const nBy = {}; for (const x of due) nBy[x.club] = (nBy[x.club] || 0) + 1;
    const pack = {};
    for (const [xi, x] of due.entries()) {
      const from = Wd.ownerOf(S, x.id);
      const outLater = due.slice(xi + 1).filter(y => y.swap == null && y.from === x.club && Wd.ownerOf(S, y.id) === x.club).length;   // v231: saídas acordadas que ainda vão ser processadas liberam vaga
      // v195: quem fechou o acordo ainda é o técnico do clube? (acordos antigos sem x.desk: qualquer técnico no clube)
      const deskOK = x.desk ? !!(S.desks[x.desk] && S.desks[x.desk].club === x.club && !S.desks[x.desk].unemployed) : Wd.isHuman(S, x.club);
      const inDesk = fn => deskOK && x.desk ? Wd.asDesk(S, x.desk, fn) : Wd.asClub(S, x.club, fn);
      const swapGone = x.swap != null && Wd.ownerOf(S, x.swap) !== x.club;   // v230: vale também pra troca com clube da IA
      const full = x.swap == null && squad(S, x.club).length - outLater >= ECON.squadMax;
      const short = x.human && x.swap == null && squad(S, x.from).length <= ECON.squadMin;
      const diaGone = x.dia && !deskOK;   // Diamante não fica em clube sem o técnico que o contratou
      // v286: só vale pra acordo fechado a partir da 286 (x.ck). Acordos antigos (Anápolis/YNHWXS) ficam como estão: decisão do Vini, não punir o técnico por falha nossa
      // v284: acordo com clube da IA só se concretiza se o jogador ainda topa o destino (mesma régua do canTalk); fecha a porta de acordos nascidos em estado inconsistente (Anápolis/YNHWXS)
      const noInt = x.ck && !x.human && from === x.from && from !== 'Livre' && !Wd.isHuman(S, from) && interest(S, x.id, x.club) < 25;
      // v194/v195: vale pra todo acordo: jogador que mudou de clube/se aposentou, elenco cheio, ou técnico saiu (Diamante) devolve a taxa
      if (from !== x.from || swapGone || full || short || diaGone || noInt) {
        if (S.cash[x.club] !== undefined) S.cash[x.club] += x.fee;
        const why = from !== x.from ? `${P[x.id].short} não está mais no ${x.from}` : noInt ? `${P[x.id].short} desistiu de vir: não tem interesse em jogar no ${x.club}` : swapGone ? `${P[x.swap].short}, que ia na troca, não está mais no ${x.club}` : full ? `O elenco do ${x.club} chegou ao limite de ${ECON.squadMax} jogadores` : short ? `O ${x.from} ficaria abaixo do mínimo de ${ECON.squadMin} jogadores` : `O técnico que fechou o acordo não está mais no ${x.club}`;
        const coins = () => { if (x.diaCost) { S.stars = (S.stars || 0) + x.diaCost[0]; S.dias = (S.dias || 0) + x.diaCost[1]; S.wIn = (S.wIn || 0) + x.diaCost[0] + x.diaCost[1] * C.ECON.starsPerDia; } };
        if (deskOK) inDesk(() => { S.fin.spent = Math.max(0, (S.fin.spent || 0) - x.fee); coins(); EVENTS.news(S, { t: 'transfer', title: `Acordo por ${P[x.id].short} cancelado`, body: `${why} na abertura da janela. O valor pago${x.diaCost ? ' e as moedas foram devolvidos' : ' foi devolvido'}.`, ids: [x.id, x.swap].filter(id => id != null), clubs: [x.club, x.from] }); });
        else { if (x.desk && S.desks[x.desk]) Wd.asDesk(S, x.desk, coins); EVENTS.news(S, { t: 'transfer', title: `Acordo por ${P[x.id].short} cancelado`, body: `${why} na abertura da janela. O ${x.club} recebeu a taxa de volta.`, ids: [x.id], clubs: [x.club, x.from], minor: true }); }
        continue;
      }
      if (from === 'Aposentado') continue;
      if (S.cash[from] !== undefined && from !== 'Livre') S.cash[from] += x.fee;
      const s = ps(S, x.id); s.sal = x.sal; s.ce = Math.max(x.ce, S.season + 1); s.mor = clamp(s.mor + 10, 0, 100); s.benchRun = 0;   // v195: contrato nunca vence antes da temporada seguinte
      Wd.move(S, x.id, x.club, false, { t: from === 'Livre' ? 'livre' : 'compra', fee: x.fee });
      (pack[x.club] = pack[x.club] || []).push({ id: x.id, fee: x.fee || 0 });
      if (x.human && x.swap != null) { ps(S, x.swap).ce = Math.max(view(S, x.swap).ce, S.season + 1); Wd.move(S, x.swap, x.from, false, { t: 'troca', fee: 0 }); }
      else if (x.swap != null) inDesk(() => doSwap(S, x.swap, x.from, x.credit));   // v230: troca com a IA sai agora, junto com a chegada
      if (x.human) Wd.asClub(S, x.from, () => { S.fin.sold = (S.fin.sold || 0) + x.fee; });
      if (x.dia) inDesk(() => diaMark(S, x.id, from, x.sal0, x.ce0));
      inDesk(() => { delete S.negs[x.id]; S.offers = S.offers.filter(o => o.id !== x.id); if (!x.dia) EVENTS.news(S, { t: 'transfer', title: `Janela aberta: ${P[x.id].name} se apresenta no ${x.club}`, body: `Acordo fechado em ${x.when}. ${x.fee ? `T$ ${C.fmt(x.fee)} pagos ao ${from}.` : 'Sem custo de transferência.'}${x.swap != null ? ` ${P[x.swap].short} vai ao ${x.from} na troca.` : ''} Salário de T$ ${C.fmt(x.sal)}/dia.`, ids: [x.id, x.swap].filter(id => id != null), clubs: [x.club, from], front: 80, ...(nBy[x.club] >= PACK_MIN ? { minor: true } : {}) }); });
    }
    for (const club in pack) if (pack[club].length >= PACK_MIN) { try { packNews(S, club, pack[club]); } catch (e) {} }
  }
  const PACK_MIN = 4;
  function packNews(S, club, L) {
    const ovr = id => view(S, id).ovr;
    L = L.filter(x => P[x.id]).sort((a, b) => ovr(b.id) - ovr(a.id) || b.fee - a.fee);
    if (L.length < PACK_MIN) return;
    const n = L.length, star = L[0], total = L.reduce((a, x) => a + x.fee, 0), sp = P[star.id], r = C.R('pack' + club + S.season + (S.lastDay || 0));
    const nm = id => P[id].short || P[id].name;
    const others = L.slice(1).map(x => nm(x.id)), list = others.length > 1 ? `${others.slice(0, -1).join(', ')} e ${others[others.length - 1]}` : others[0];
    const titles = [`${club} anuncia pacotão de reforços`, `Pacotão! ${club} apresenta ${n} reforços de uma vez`, `${club} abre a janela com ${n} contratações`,
      `Chegou o pacotão: ${club} confirma ${n} reforços`, `${club} renova o elenco com pacotão de ${n} nomes`, `${sp.name} lidera pacotão de ${n} reforços do ${club}`];
    const leads = [`Com a janela aberta, o ${club} oficializa ${n} contratações acertadas enquanto o mercado estava fechado.`,
      `O ${club} não esperou: ${n} reforços fechados antes da janela se apresentam de uma vez.`,
      `Torcida do ${club} ganha presente na abertura da janela: são ${n} caras novas no elenco.`];
    const body = `${C.pick(leads, r)} O destaque é ${sp.name} (${sp.pos}, ${ovr(star.id)} de overall)${star.fee ? `, que custou T$ ${C.fmt(star.fee)}` : ''}. Também chegam ${list}.${total ? ` Investimento total: T$ ${C.fmt(total)}.` : ''}`;
    EVENTS.news(S, { t: 'transfer', tag: 'pacotao', kick: 'Pacotão de reforços', title: C.pick(titles, C.R('pt' + club + S.season + n)), body, ids: L.map(x => x.id), clubs: [club], front: 96 });
  }
  function contract(S, id, sal, years, opts = {}) {
    if (isLoan(S, id)) return { status: 'closed', msg: 'Jogador emprestado não pode assinar contrato em definitivo durante o empréstimo.' };
    const dem = salaryDemand(S, id, S.club);
    const b = budget(S);
    const nRaw = S.negs && S.negs[id], expired = !opts.pre && nRaw && negExpired(S, nRaw) ? nRaw.fee : null;
    const fee = opts.pre ? 0 : (negState(S, id) || {}).fee ?? (Wd.ownerOf(S, id) === 'Livre' ? 0 : null);
    if (fee == null) return { status: 'error', msg: expired ? `O acordo de T$ ${C.fmt(expired)} venceu (${NEG_DAYS} dias). Acerte a taxa de novo com o clube.` : 'Acerte primeiro a taxa com o clube.' };
    // v194: a taxa foi acertada com um dono; se o jogador mudou de clube, ganhou pré-contrato/acordo com outro ou acabou de chegar, o acordo caiu
    if (!opts.pre) {
      const n0 = negState(S, id), own = Wd.ownerOf(S, id), pc = preOf(S, id), pd = pendingOf(S, id);
      const why = own !== 'Livre' && own !== S.club && Wd.isHuman(S, own) ? `${P[id].short} é do ${own}, que tem treinador: faça uma proposta pra ele decidir.`
        : n0 && !n0.owner && own !== 'Livre' ? `Esse acordo de taxa é antigo. Negocie a taxa de novo com o ${own}.`
        : n0 && n0.owner && own !== n0.owner ? `${P[id].short} não é mais do ${n0.owner} (agora: ${own}). O acordo de taxa caiu.`
        : pc && pc.club !== S.club ? `${P[id].short} assinou pré-contrato com o ${pc.club}.`
        : pd ? `${P[id].short} já tem acordo fechado com outro clube.`
        : own !== 'Livre' && own !== S.club && Wd.locked(S, id) ? `${P[id].short} acabou de chegar ao ${own} e não pode ser negociado agora.` : null;
      if (why) { delete S.negs[id]; return { status: 'closed', msg: why }; }
    }
    if (!opts.pre && brLock(S, Wd.ownerOf(S, id), S.club)) return { status: 'closed', msg: brLockMsg(Wd.ownerOf(S, id)) };
    const isDia = !!diaReq(S, id);
    if (isDia && opts.pre) return { status: 'closed', msg: `${P[id].short} é jogador Diamante e não assina pré-contrato.` };
    // v284: pré-contrato também confere o mundo atual na hora de assinar (antes só a tela conferia, e um aparelho velho assinava por cima do pré de outro técnico)
    if (opts.pre) {
      const pc = preOf(S, id), pd = pendingOf(S, id);
      const why = pc ? (pc.club === S.club ? `${P[id].short} já assinou pré-contrato com o ${S.club}.` : `${P[id].short} assinou pré-contrato com o ${pc.club}.`)
        : pd ? `${P[id].short} já tem acordo fechado com outro clube.`
        : !preEligible(S, id) ? `${P[id].short} não pode assinar pré-contrato agora (contrato não está vencendo ou o período de pré-contratos não começou).` : null;
      if (why) return { status: 'closed', msg: why };
    }
    { const dw = diaWhy(S, id); if (dw) return { status: 'budget', msg: dw }; }
    const closed = !opts.pre && Wd.ownerOf(S, id) !== 'Livre' && !SEASON.windowOpen(SEASON.now(S), S);
    { const ns0 = negState(S, id), sw0 = !opts.pre && ns0 && ns0.swap != null && Wd.ownerOf(S, ns0.swap) === S.club ? view(S, ns0.swap).sal : 0; if (sal > b.wageRoom + sw0) return { status: 'budget', msg: `Esse salário estoura o teto salarial (folga de T$ ${C.fmt(b.wageRoom + sw0)}/dia${sw0 ? ', contando o salário de quem vai na troca' : ''}). Ajuste a barra de orçamento em Finanças.` }; }
    if (!opts.pre && fee > b.transfer) return { status: 'budget', msg: `A taxa passa do orçamento de transferências (T$ ${C.fmt(b.transfer)}).` };
    const nSw = negState(S, id), swp = !opts.pre && nSw && nSw.swap != null && Wd.ownerOf(S, nSw.swap) === S.club ? nSw.swap : null;
    if (!opts.pre && !swp && effSize(S, S.club) >= ECON.squadMax) return { status: 'budget', msg: `Elenco cheio (${ECON.squadMax}, contando quem chega e sai na janela).` };
    const yrPref = age(S, id) >= 31 ? 2 : 4;
    // pedido arredondado pra cima (múltiplos de 5 até 3 dígitos, de 10 acima) — pagar o que o empresário pediu sempre fecha
    const need0 = dem * (years > yrPref ? 1.08 : 1), rs = need0 >= 100 ? 10 : 5, need = Math.ceil(need0 / rs) * rs;
    if (sal >= need) {
      if (opts.pre) {
        S.pre.push({ id, club: S.club, sal, years, from: Wd.ownerOf(S, id), k: S.slot || 0, d: S.lastDay ?? 0 });
        EVENTS.news(S, { t: 'transfer', title: `${P[id].short} assina pré-contrato com o ${S.club}`, body: `Chega de graça no fim da temporada. Salário T$ ${C.fmt(sal)}/dia por ${years} temporada(s).`, ids: [id], clubs: [S.club] });
      } else if (closed) {
        // janela fechada: acordo assinado, jogador chega na abertura. A taxa já sai do caixa (compromisso).
        const from = Wd.ownerOf(S, id), wi = SEASON.windowInfo(S);
        S.cash[S.club] -= fee; S.fin.spent = (S.fin.spent || 0) + fee;
        // v230: o jogador da troca também só sai na abertura da janela (antes ia na hora e o outro só chegava depois: Kevin/Botafogo, YNHWXS)
        if (isDia) diaPay(S, id);
        S.pendTr = S.pendTr || [];
        const whenTxt = SEASON.gameDate ? `${SEASON.gameDate(S, S.slot).txt}` : '';
        S.pendTr.push({ id, club: S.club, from, fee, sal, ce: S.season + years, at: wi.until || null, when: whenTxt, desk: S.__me, ck: 1, ...(swp ? { swap: swp, credit: nSw.credit || 0 } : {}), ...(isDia ? { dia: 1, diaCost: diaReq(S, id), sal0: view(S, id).sal, ce0: view(S, id).ce } : {}) });
        delete S.negs[id];
        EVENTS.news(S, { t: 'transfer', title: `${S.club} fecha acordo com ${P[id].name}`, body: `${fee ? `T$ ${C.fmt(fee)} ao ${from}` : 'Sem taxa'}. Com a janela fechada, o jogador se apresenta na abertura da janela${swp ? `, e ${P[swp].short} vai pro ${from} na troca nessa hora` : ''}. Salário de T$ ${C.fmt(sal)}/dia até ${S.season + years}.`, ids: swp ? [id, swp] : [id], clubs: [S.club, from] });
        return { status: 'accept', pending: true, msg: 'Acordo fechado! Ele chega quando a janela abrir.' };
      } else {
        const from = Wd.ownerOf(S, id);
        // v190: recibo da compra na mesa do treinador (linha separada do mundo): se a sincronização perder a transferência, o servidor refaz
        S.buys = [...(S.buys || []).filter(b => b.s === S.season).slice(-29), { id, from, to: S.club, fee, sal, ce: S.season + years, sw: swp || null, s: S.season, k: S.slot || 0, at: Date.now() }];
        S.cash[S.club] -= fee;
        if (S.cash[from] !== undefined) S.cash[from] += fee;
        if (swp) doSwap(S, swp, from, nSw.credit);
        const s = ps(S, id), sal0 = s.sal, ce0 = s.ce; s.sal = sal; s.ce = S.season + years; s.mor = clamp(s.mor + 10, 0, 100); s.benchRun = 0;
        Wd.move(S, id, S.club, false, { t: from === 'Livre' ? 'livre' : 'compra', fee });
        if (isDia) { diaPay(S, id); diaMark(S, id, from, sal0, ce0); }
        S.offers = S.offers.filter(o => o.id !== id);
        delete S.negs[id];
        S.fin.spent = (S.fin.spent || 0) + fee;
        if (!isDia) EVENTS.news(S, { t: 'transfer', title: `${S.club} contrata ${P[id].name}`, body: `${fee ? `T$ ${C.fmt(fee)} pagos ao ${from}` : 'Sem custo de transferência'}. Salário de T$ ${C.fmt(sal)}/dia até ${S.season + years}.`, ids: [id], clubs: [S.club, from] });
      }
      return { status: 'accept', msg: 'Contrato assinado!' };
    }
    if (sal >= need * 0.9) return { status: 'counter', demand: need, msg: `O empresário pede T$ ${C.fmt(need)}/dia.` };
    return { status: 'reject', demand: need, msg: `Proposta salarial recusada. Pedido: ~T$ ${C.fmt(need)}/dia.` };
  }

  // ---------- contratos do seu elenco ----------
  function renewTerms(S, id, years) {
    const s = ps(S, id), a = age(S, id);
    const perf = clamp((s.form - 6.3) / 2, -0.2, 0.5);
    const f = a <= 31 ? 1.1 + Math.max(0, perf) * 0.4 + (s.mv * ECON.salaryRate > s.sal ? 0.08 : 0) : 0.9 - Math.min(0.15, (a - 32) * 0.03);
    return { sal: Math.max(20, Math.round(s.sal * f / 10) * 10), years, up: a <= 31 };
  }
  function renew(S, id, years) {
    const s = ps(S, id);
    if (Wd.ownerOf(S, id) !== S.club) return { ok: false, msg: `${P[id].short} não está no seu elenco.` };
    if (s.loan || s.loanOut) return { ok: false, msg: s.loanOut ? `${P[id].short} pertence ao ${s.loanOut.from} e está no seu clube por empréstimo. Não pode renovar antes de uma compra definitiva.` : `${P[id].short} está emprestado e volta ao ${s.loan.from}.` };
    if (s.short === S.season) return { ok: false, msg: `${P[id].short} veio com contrato curto do pacote Diamante. Não renova.` };
    { const ar = S.arrears && S.arrears[S.club];
      if (ar && ar.days >= 2) return { ok: false, msg: `Com salários atrasados há ${ar.days} dia(s), ${P[id].short} se recusa a discutir renovação.` };
      if (s.wantOut === S.season) return { ok: false, msg: `${P[id].short} pediu para sair e não quer renovar.` }; }
    if (s.mor < 25) return { ok: false, msg: `${P[id].short} está insatisfeito (moral ${Math.round(s.mor)}) e não quer renovar agora.` };
    if (S.pre.some(x => x.id === id)) return { ok: false, msg: `${P[id].short} já assinou pré-contrato com outro clube.` };
    if (s.renewed === S.season) return { ok: false, msg: `${P[id].short} já renovou nesta temporada.` };
    const t = renewTerms(S, id, years);
    s.renewed = S.season;
    s.sal = t.sal; s.ce = S.season + years; s.mor = clamp(s.mor + 6, 0, 100);
    EVENTS.news(S, { t: 'club', title: `${P[id].short} renova até ${s.ce}`, body: `Novo salário: T$ ${C.fmt(t.sal)}/dia (${t.up ? 'aumento' : 'redução'}).`, ids: [id], clubs: [S.club] });
    return { ok: true, msg: 'Renovado!' };
  }
  function releaseCost(S, id) {
    const s = ps(S, id);
    const days = (s.ce - S.season) * ECON.daysPerSeason + daysLeft(S);
    return Math.round(s.sal * days * ECON.releaseRate / 100) * 100;
  }
  function release(S, id) {
    if (Wd.ownerOf(S, id) !== S.club) return { ok: false, msg: 'Jogador não está no seu elenco.' };
    if (isLoan(S, id)) return { ok: false, msg: 'Jogador emprestado não pode ser dispensado.' };
    if (pendingOf(S, id)) return { ok: false, msg: 'Jogador já incluído em acordo fechado para a próxima janela.' };
    if (effSize(S, S.club) <= ECON.squadMin) return { ok: false, msg: `Elenco no mínimo (${ECON.squadMin}, contando quem chega e sai na janela).` };
    const cost = releaseCost(S, id);
    S.cash[S.club] -= cost;
    Wd.move(S, id, 'Livre'); S.free.push(id);
    S.offers = S.offers.filter(o => o.id !== id);
    S.fin.release = (S.fin.release || 0) + cost;
    EVENTS.news(S, { t: 'transfer', title: `${S.club} dispensa ${P[id].name}`, body: `Multa rescisória de T$ ${C.fmt(cost)}. O jogador está livre no mercado.`, ids: [id], clubs: [S.club] });
    return { ok: true, msg: `Dispensado. Multa de T$ ${C.fmt(cost)}.` };
  }
  let ABROAD = null;
  function abroadClub(S, id) {
    if (!ABROAD) { ABROAD = [...new Set(Object.values(P).filter(p => !p.gen && ['Liga Portugal', 'Saudi Pro League', 'Süper Lig', 'MLS', 'Liga MX', 'Premier League', 'Serie A (ITA)', 'LaLiga', 'Ligue 1', 'Bundesliga'].includes(p.liga)).map(p => p.club0 + '|' + p.liga))]; }
    const o = view(S, id).ovr;
    const r = R(`ab${id}${S.lastDay}`);
    const tiers = o >= 80 ? ['Premier League', 'Serie A (ITA)', 'LaLiga', 'Saudi Pro League', 'Liga Portugal'] : o >= 72 ? ['Liga Portugal', 'Saudi Pro League', 'Süper Lig', 'MLS', 'Liga MX'] : ['MLS', 'Liga MX', 'Süper Lig'];
    const pool = ABROAD.filter(x => tiers.includes(x.split('|')[1]));
    return (pool.length ? C.pick(pool, r) : 'Clube do exterior|').split('|')[0];
  }
  // v167: proposta de outro técnico que não pôde ser fechada: o comprador fica sabendo (e ela sai da lista de enviadas)
  function tellBuyer(S, of, why, body) {
    try {
      if (!of || !of.human || !Wd.isHuman(S, of.club)) return;
      const seller = S.club, sh = P[of.id] ? P[of.id].short : 'o jogador';
      Wd.asClub(S, of.club, () => { S.outOffers = (S.outOffers || []).filter(x => x.k !== of.k);
        EVENTS.news(S, { t: 'transfer', kick: 'Negócio desfeito', title: `Negócio por ${sh} não saiu: ${why}`, body, ids: [of.id], clubs: [seller, of.club], desk: S.__me, front: 75 }); });
    } catch (e) {}
  }
  function acceptOffer(S, k) {
    const of = S.offers.find(o => o.k === k); if (!of) return null;
    { const pc = preOf(S, of.id); if (pc && pc.club !== of.club) return { err: `${P[of.id].short} já assinou pré-contrato com o ${pc.club}. Não pode ser vendido.` }; }
    if (isLoan(S, of.id)) return { err: 'Jogador já emprestado não pode ser vendido ou emprestado de novo.' };
    const closed = !SEASON.windowOpen(SEASON.now(S), S);
    if (closed && (!of.human || of.loanOf)) return { err: winMsg() };
    if (pendingOf(S, of.id) || (of.swap != null && pendingOf(S, of.swap))) return { err: 'Um dos jogadores já tem acordo fechado para a próxima janela.' };
    if (closed && of.human && (S.pre || []).some(x => x.id === of.id || x.id === of.swap)) return { err: 'Um dos jogadores já assinou pré-contrato com outro clube.' };
    if (Wd.ownerOf(S, of.id) !== S.club) { S.offers = S.offers.filter(o => o !== of); return null; }
    if (effSize(S, S.club) <= ECON.squadMin && of.swap == null) return { err: `Elenco no mínimo (${ECON.squadMin}).` };
    if (Wd.locked(S, of.id)) return { err: `${P[of.id].short} chegou há pouco e não pode sair ainda.` };
    if (of.human && of.swap != null) {
      const so = Wd.ownerOf(S, of.swap), sp = S.ps[of.swap] || {};
      if (so !== of.club || sp.loan || sp.loanOut) { S.offers = S.offers.filter(o => o !== of); tellBuyer(S, of, `${P[of.swap].short} não está mais disponível pra troca`, `O ${S.club} aceitou, mas o jogador que ia na troca não está mais disponível. A proposta foi cancelada.`); return { err: `${P[of.swap].short} não está mais disponível para a troca. Proposta cancelada.` }; }
    }
    const ofDia = of.human && !!diaReq(S, of.id);
    if (ofDia) { const dw = Wd.asClub(S, of.club, () => diaWhy(S, of.id)); if (dw) { S.offers = S.offers.filter(o => o !== of); tellBuyer(S, of, isOuroClub(S, of.club) ? 'jogador Diamante não vai pra sua divisão' : 'faltaram estrelas/diamantes', `O ${S.club} aceitou, mas ${isOuroClub(S, of.club) ? 'jogador Diamante só joga nas divisões de cima' : 'você não tem mais as moedas do pacote Diamante'}. A proposta foi cancelada.`); return { err: isOuroClub(S, of.club) ? `O ${of.club} está na Série ${Wd.divOf(S, of.club) || 'B'}: jogador Diamante não vai pra lá. Proposta cancelada.` : `O ${of.club} não tem mais estrelas/diamantes para um jogador Diamante. Proposta cancelada.` }; } }
    if (of.human) {
      if ((S.cash[of.club] || 0) < of.fee) { S.offers = S.offers.filter(o => o !== of); tellBuyer(S, of, 'faltou caixa', `O ${S.club} aceitou os T$ ${C.fmt(of.fee)}, mas seu clube não tem mais esse dinheiro em caixa. A proposta foi cancelada.`); return { err: `O ${of.club} não tem mais caixa pra essa compra.` }; }
      if (of.swap == null && effSize(S, of.club) >= ECON.squadMax) { S.offers = S.offers.filter(o => o !== of); tellBuyer(S, of, 'seu elenco está cheio', `O ${S.club} aceitou os T$ ${C.fmt(of.fee)}, mas seu elenco chegou ao limite de ${ECON.squadMax} jogadores (contando quem chega na janela). Libere vaga e faça nova proposta.`); return { err: `O elenco do ${of.club} está cheio.` }; }
    }
    if (closed && of.human) {
      if (ps(S, of.id).loan || ps(S, of.id).loanOut) return { err: 'Jogador emprestado não pode ser incluído em acordo futuro de compra.' };
      const seller = S.club, buyer = of.club, wi = SEASON.windowInfo(S);
      const s = view(S, of.id), diaCost = ofDia ? diaReq(S, of.id) : null;
      Wd.asClub(S, buyer, () => {
        S.cash[buyer] -= of.fee;
        S.fin.spent = (S.fin.spent || 0) + of.fee;
        S.outOffers = (S.outOffers || []).filter(x => x.k !== k);
        if (ofDia) diaPay(S, of.id);
      });
      S.pendTr = S.pendTr || [];
      S.pendTr.push({ id: of.id, club: buyer, from: seller, fee: of.fee, sal: s.sal, ce: s.ce, swap: of.swap ?? null,
        human: 1, desk: Wd.deskOf(S, buyer) || null, at: wi.until || null, when: SEASON.gameDate(S, S.slot).txt, ...(ofDia ? { dia: 1, diaCost, sal0: s.sal, ce0: s.ce } : {}) });
      S.offers = S.offers.filter(o => o.id !== of.id);
      EVENTS.news(S, { t: 'transfer', title: `${seller} e ${buyer} fecham acordo por ${P[of.id].short}`, body: `Taxa de T$ ${C.fmt(of.fee)} acertada e paga pelo ${buyer}.${of.swap != null ? ` ${P[of.swap].short} entra na troca.` : ''} Os jogadores mudam de clube quando a janela abrir.`, ids: [of.id, of.swap].filter(id => id != null), clubs: [seller, buyer] });
      return { ...of, pending: true };
    }
    if (of.loanOf) {
      if (effSize(S, of.club) >= ECON.squadMax) { if (of.human) { S.offers = S.offers.filter(o => o !== of); tellBuyer(S, of, 'seu elenco está cheio', `O ${S.club} aceitou os T$ ${C.fmt(of.fee)}, mas seu elenco está no limite de ${ECON.squadMax} jogadores. Libere vaga e faça nova proposta.`); } return { err: `O elenco do ${of.club} está cheio.` }; }
      if (Wd.isHuman(S, of.club)) {
        const b = Wd.asClub(S, of.club, () => budget(S));
        if (of.fee > b.transfer) return { err: `O ${of.club} não tem mais orçamento para a taxa de empréstimo.` };
        if (Math.round(view(S, of.id).sal * of.share / 100) > b.wageRoom) return { err: `A parte do salário estoura o teto do ${of.club}.` };
      }
      if (S.cash[of.club] !== undefined && S.cash[of.club] < of.fee) return { err: `O ${of.club} não tem mais caixa para a taxa de empréstimo.` };
      const s = ps(S, of.id), end = ofDia ? Math.min(S.slot + 14, SEASON.SLOTS - 1) : of.loanOf === '6m' ? Math.min(S.slot + 28, SEASON.SLOTS - 1) : null;
      if (ofDia) Wd.asClub(S, of.club, () => diaPay(S, of.id));
      if (S.cash[of.club] !== undefined) S.cash[of.club] -= of.fee;
      if (Wd.isHuman(S, of.club)) Wd.asClub(S, of.club, () => { S.fin.spent = (S.fin.spent || 0) + of.fee; S.outOffers = (S.outOffers || []).filter(x => x.k !== k); });
      s.loanOut = { from: S.club, season: S.season, end, len: of.loanOf, share: of.share, fee: of.fee, k0: S.slot };
      delete s.loanList; delete s.list;
      Wd.move(S, of.id, of.club, true, { t: 'emprestimo', fee: of.fee, x: { sh: of.share, end, len: of.loanOf } });
      S.cash[S.club] += of.fee;
      S.offers = S.offers.filter(o => o.id !== of.id);
      EVENTS.news(S, { t: 'transfer', title: `${P[of.id].short} é emprestado ao ${of.club}`, body: `Por ${LOAN_LEN[of.loanOf]}${end != null ? ` (até o jogo ${end + 1})` : ' (até o fim da temporada)'}. O ${of.club} paga ${of.share}% do salário; taxa de T$ ${C.fmt(of.fee)}.`, ids: [of.id], clubs: [S.club, of.club] });
      return { id: of.id, fee: of.fee, loan: true };
    }
    if (of.human) Wd.asClub(S, of.club, () => { S.outOffers = (S.outOffers || []).filter(x => x.k !== of.k); });
    const sal00 = view(S, of.id).sal, ce00 = view(S, of.id).ce;
    Wd.move(S, of.id, of.club, false, { t: 'compra', fee: of.fee });
    { const s0 = ps(S, of.id); delete s0.list; delete s0.loanList; }
    if (ofDia) { const seller = S.club; Wd.asClub(S, of.club, () => { diaPay(S, of.id); diaMark(S, of.id, seller, sal00, ce00); }); }
    S.cash[S.club] += of.fee;
    if (S.cash[of.club] !== undefined) S.cash[of.club] -= of.fee;
    S.offers = S.offers.filter(o => o.id !== of.id);
    S.fin.sold = (S.fin.sold || 0) + of.fee;
    // v194: venda direta entre treinadores entra no gasto do comprador e ganha recibo (o servidor refaz se a sincronização desfizer)
    if (of.human) { const seller = S.club, v1 = view(S, of.id); Wd.asClub(S, of.club, () => { S.fin = S.fin || {}; S.fin.spent = (S.fin.spent || 0) + of.fee;
      S.buys = [...(S.buys || []).filter(b => b.s === S.season).slice(-29), { id: of.id, from: seller, to: of.club, fee: of.fee, sal: v1.sal, ce: v1.ce, sw: of.swap != null ? of.swap : null, s: S.season, k: S.slot || 0, at: Date.now() }]; }); }
    if (of.human && of.swap != null) {
      const s1 = ps(S, of.swap); delete s1.list; delete s1.loanList; s1.benchRun = 0;
      Wd.move(S, of.swap, S.club, false, { t: 'troca', fee: 0 });
      EVENTS.news(S, { t: 'transfer', title: `Troca entre treinadores: ${P[of.id].short} vai ao ${of.club}, ${P[of.swap].short} vem ao ${S.club}`, body: `${of.fee ? `O ${S.club} ainda recebe T$ ${C.fmt(of.fee)}.` : 'Troca direta, sem dinheiro envolvido.'}`, ids: [of.id, of.swap], clubs: [S.club, of.club], front: 75 });
      return of;
    }
    EVENTS.news(S, { t: 'transfer', title: `${P[of.id].name} vendido ao ${of.club}`, body: `${S.club} recebe T$ ${C.fmt(of.fee)}.`, ids: [of.id], clubs: [S.club, of.club] });
    return of;
  }

  // ---------- pré-contratos ----------
  function preEligible(S, id) {
    const s = view(S, id), o = Wd.ownerOf(S, id);
    return !diaReq(S, id) && !isLoan(S, id) && !pendingOf(S, id) && S.slot >= SEASON.PRE_FROM && s.ce <= S.season && o && o !== S.club && o !== 'Livre' && o !== 'Aposentado' && !S.pre.some(x => x.id === id) && !P[id].youth;
  }

  // ---------- pacote do dia (rotação do grupo de 5, pago com estrelas/diamantes) ----------
  // rodízio: quem luta contra o rebaixamento começa a temporada pelo Diamante, meio de tabela pelo Ouro, Sul-Americana pela Prata, G5 pelo Bronze
  const TIER_OFF = { rel: 0, mid: 1, sul: 2, lib: 3 };
  const DAYMS = 86400000;
  // pacote só nos 4 dias sem mercado (segunda a quinta); sexta a domingo é janela de transferências
  const isPackDay = (S, d) => !SEASON.windowOpen(SEASON.sportDayStart(S, d) + (SEASON.isTurbo(S) ? 3 : 12) * 3600000 / (S.speed > 1 ? 1 : 1), S);
  // v274: depois do último jogo da temporada não tem pacote (Diamante/Ouro são empréstimos que voltam na virada); estrelas e diamantes ficam guardados
  const packOff = (S, d) => { try { return S.seasonStart != null && d > SEASON.dayAbs(S, SEASON.slotTime(S, SEASON.SLOTS - 1)); } catch (e) { return false; } };
  function packCat(S, d, club) {
    if (packOff(S, d)) return null;
    if (!isPackDay(S, d)) return null;
    const o = S.obj && S.obj[club], g = o && (o.bg || o.g);
    // B e C: mesmo rodízio de antes (defasagem pelo grupo do elenco), independente da carteira do equilíbrio
    const off = o && (o.div === 'B' || o.div === 'C') && g ? ({ eli: 3, top: 3, sul: 2, lut: 1, aza: 0 })[g] : (TIER_OFF[SEASON.balTier(o)] ?? 2);
    const d0 = SEASON.dayAbs(S, S.seasonStart);
    let n = 0;                                   // quantos dias de pacote desde o início da temporada
    if (d >= d0) { for (let x = d0; x < d; x++) if (isPackDay(S, x)) n++; }
    else { for (let x = d; x < d0; x++) if (isPackDay(S, x)) n--; }
    const L = C.PACK_ROT.length, k = C.PACK_ROT[((n + off) % L + L) % L];
    return k === 'dia' && isOuroClub(S, club) ? 'oe' : k;   // B e C: no dia do Diamante vem o Ouro Especial
  }
  const CAT_IDX = { dia: 0, oe: 1, our: 1, pra: 2, bro: 3 };
  // Séries B e C: sem Diamante. O "diamante" da carteira vale como Ouro (mesmo campo, S.dias) e compra o Ouro Especial
  const isOuroClub = (S, c) => !!c && Wd.divOf(S, c) !== 'A';
  const isOuro = S => !S.unemployed && isOuroClub(S, S.club);
  // troca de divisão do treinador: da B/C (ou D) pra A, cada 2 Ouro viram 1 diamante (o Ouro que sobra vira 10 estrelas); da A pra baixo, 1 pra 1
  function gemSwitch(S, fromOuro, toClub) {
    if (!fromOuro || isOuroClub(S, toClub)) return;
    const o = S.dias || 0; if (!o) return;
    const di = Math.floor(o / 2), st = (o % 2) * 10;
    S.dias = di; S.stars = (S.stars || 0) + st;
    EVENTS.news(S, { t: 'fin', title: `Na Série A, o Ouro vira diamante: ${o} Ouro → ${di} diamante${di === 1 ? '' : 's'}${st ? ` e ${st} estrelas` : ''}`, body: 'Cada 2 Ouro valem 1 diamante. Na Série A, o pacote do dia volta a ter o Diamante.', clubs: [toClub], desk: S.__me, front: 85 });
  }
  // clubes com técnico ativo na liga (os 40 amigos = Séries A e B). Pacote nunca tira jogador desses clubes.
  function humanClub(S, c) { return !!Wd.divOf(S, c) || Wd.isHuman(S, c); }
  // versão rápida pros laços sobre todos os jogadores: um Set montado uma vez por chamada (com 60 treinadores, o laço antigo pesava)
  const humanSet = S => new Set([...(S.divA || []), ...(S.divB || []), ...(S.divC || []), ...Wd.humanClubs(S)]);
  const SEEN_DAYS = 7;
  // Diamante: veteranos consagrados (35+) por 3 meses — nomes que chamam atenção numa passagem curta
  function vetPool(S, minAge) {
    const out = [], HC = humanSet(S);
    for (const id of Wd.nonYouth()) {
      const p = P[id]; if (p.gen) continue;
      const o = Wd.ownerOf(S, id);
      if (!o || o === S.club || o === 'Aposentado' || HC.has(o) || brLock(S, o, S.club) || Wd.locked(S, id) || pendingOf(S, id)) continue;
      const s = S.ps[id] || null, ovr = s ? s.ovr : p.ovr0;
      if (age(S, id) < minAge || ovr < 72) continue;
      out.push(id);
    }
    return out.sort((a, b) => view(S, b).ovr - view(S, a).ovr).slice(0, 36);
  }
  // jogador que já veio por Pacote Ouro/Diamante pra este clube nesta temporada não aparece de novo até a próxima
  const packedBefore = (S, id) => !!(S.packLog && S.packLog[S.club + '|' + id] === S.season);
  // plausibilidade de origem: peso no sorteio dos pacotes (brasileiros/sul-americanos/lusófonos/veteranos primeiro)
  function originW(S, id) {
    const g = natGroup(P[id].nat), a = age(S, id);
    const base = { BRA: 1, SA: 0.9, LUSO: 0.6, NAM: 0.25, AFR: 0.25, EUR: 0.18, ASIA: 0.05 }[g];
    return base * (g !== 'BRA' && g !== 'SA' && a >= 32 ? 2.2 : 1) * (0.5 + interest(S, id, S.club) / 100);
  }
  // ---------- v219: elencos que não acabam ----------
  // Clube do exterior não vende abaixo de 20. Clube do computador repõe o elenco: base primeiro, depois livres das posições que faltam.
  const FOREIGN_MIN = 20, FILL_START = 24, FILL_MIN = 20, HUMAN_MIN = 16;
  const floorClub = o => !!Wd.CL[o] && (Wd.CL[o].div0 === 'F' || !!(C.INT_CLUBS && C.INT_CLUBS[o] && !C.INT_CLUBS[o].real));   // v223: só elencos completos do jogo
  const foreignFloor = (S, o) => !!o && o !== 'Livre' && o !== 'Aposentado' && !Wd.divOf(S, o) && !Wd.isHuman(S, o) && floorClub(o) && squad(S, o).length <= FOREIGN_MIN;
  const POSG = { GOL: 'G', ZAG: 'D', LD: 'D', LE: 'D', VOL: 'M', MC: 'M', MEI: 'M', PE: 'A', PD: 'A', CA: 'A' }, NEEDG = { G: 3, D: 8, M: 7, A: 6 };
  let FREE0 = null;
  function freeCands(S) {
    if (!FREE0) { FREE0 = []; for (const k in P) if ((P[k].club0 === 'Sem clube' || P[k].prev2 === 'Sem clube') && !P[k].youth) FREE0.push(+k); }   // v240: livre de antes da atualização (liga em andamento)
    const out = new Set(); for (const id of [...(S.free || []), ...FREE0]) if (Wd.ownerOf(S, id) === 'Livre' && !preOf(S, id) && !pendingOf(S, id) && !Wd.locked(S, id)) out.add(id);
    return [...out];
  }
  function fillSquad(S, club, target, opts = {}) {
    let sq = squad(S, club); if (sq.length >= target) return 0;
    let n = 0;
    if (opts.youth !== false && S.youth && S.youth[club]) {
      const yb = S.youth[club].filter(id => age(S, id) >= 17).sort((a, b) => ps(S, b).ovr - ps(S, a).ovr);
      for (const id of yb) { if (squad(S, club).length >= target) break; if (TRAIN.promote(S, club, id, opts.season)) n++; }
      sq = squad(S, club);
    }
    let pool = opts.pool || freeCands(S); const lvl = opts.lvl ?? (Wd.divOf(S, club) ? SEASON.strength(S, club) : (Wd.CL[club] && Wd.CL[club].lvl) || 65);
    const signed = [];
    while (sq.length < target && pool.length) {
      const cnt = { G: 0, D: 0, M: 0, A: 0 }; for (const id of sq) cnt[POSG[P[id].pos] || 'M']++;
      const g = Object.keys(NEEDG).sort((a, b) => (cnt[a] - NEEDG[a]) - (cnt[b] - NEEDG[b]))[0];
      const pick = L => L.map(id => ({ id, o: view(S, id).ovr, a: age(S, id) })).filter(x => x.a <= 34 && x.o <= lvl + 2).sort((x, y) => Math.abs(x.o - (lvl - 4)) - Math.abs(y.o - (lvl - 4)) || x.a - y.a)[0];
      const c = pick(pool.filter(id => POSG[P[id].pos] === g)) || pick(pool);
      if (!c) break;
      Wd.move(S, c.id, club, false, { t: 'livre' }); const s = ps(S, c.id); s.sal = salaryDemand(S, c.id, club); s.ce = S.season + 1 + (hash(`fill${c.id}${S.season}`) % 2);
      S.free = (S.free || []).filter(x => x !== c.id); pool = pool.filter(x => x !== c.id); if (opts.pool) opts.pool.splice(opts.pool.indexOf(c.id), 1);
      signed.push(c.id); n++; sq = squad(S, club);
    }
    if (signed.length && Wd.divOf(S, club)) {
      const human = Wd.isHuman(S, club);
      const body = `${signed.map(id => `${P[id].short} (${P[id].pos}, ${view(S, id).ovr})`).join(', ')}. Estavam livres no mercado.${human ? ` A diretoria completou o elenco, que tinha caído pra menos de ${HUMAN_MIN} jogadores.` : ''}`;
      if (human) Wd.asClub(S, club, () => EVENTS.news(S, { t: 'transfer', front: 85, title: `${club} completa o elenco com ${signed.length} reforço${signed.length > 1 ? 's' : ''}`, body, ids: signed, clubs: [club], desk: S.__me }));
      else EVENTS.news(S, { t: 'transfer', title: `${club} contrata ${signed.length} jogador${signed.length > 1 ? 'es' : ''} livre${signed.length > 1 ? 's' : ''}`, body, ids: signed, clubs: [club], minor: true });
    }
    return n;
  }
  // virada (target 24) e todo dia (emergência: 20). Treineiro só é completado se cair abaixo de 16 (não dá pra jogar sem time).
  function fillAll(S, start) {
    let pool = null; const P0 = () => pool || (pool = freeCands(S)), seasonK = start ? S.season : undefined;
    for (const c of Wd.brClubs(S)) {
      const hum = Wd.isHuman(S, c), t = hum ? HUMAN_MIN : start ? FILL_START : FILL_MIN;
      if (squad(S, c).length < t) fillSquad(S, c, t, { pool: P0(), youth: !hum, season: seasonK });
    }
    if (start) for (const c of [...Wd.FOREIGN(), ...Object.keys(C.INT_CLUBS || {}).filter(c => !C.INT_CLUBS[c].real)]) if (squad(S, c).length < FOREIGN_MIN) fillSquad(S, c, FOREIGN_MIN, { pool: P0(), youth: false });
  }
  function packPool(S, key, opts = {}) { return packPool0(S, key, opts).filter(id => !foreignFloor(S, Wd.ownerOf(S, id))); }
  function packPool0(S, key, opts = {}) {
    const HC = humanSet(S);
    if (key === 'oe') {   // Ouro Especial: os melhores do Ouro (81 a 84)
      const seen = S.packSeen || {}, mk = (minI, ign) => { const out = []; for (const id of Wd.nonYouth()) { const p = P[id]; const o = Wd.ownerOf(S, id);
        if (!o || o === S.club || o === 'Aposentado' || HC.has(o) || brLock(S, o, S.club) || pendingOf(S, id) || Wd.locked(S, id) || packedBefore(S, id)) continue;
        const ovr = S.ps[id] ? S.ps[id].ovr : p.ovr0; if (ovr < 81 || ovr > 84) continue; if (diaReq(S, id)) continue;
        if (!ign && seen[id] != null && opts.day - seen[id] < SEEN_DAYS) continue;
        if (interest(S, id, S.club) < minI) continue; out.push(id); } return out; };
      // v145: na B e na C quase nenhum 81–84 de fora tem interesse; como é empréstimo curto bancado pela origem, a régua é bem mais baixa
      const dv = Wd.divOf(S, S.club), steps = dv === 'C' ? [15, 0] : dv === 'B' ? [25, 5] : [45, 30];
      let v = mk(steps[0], opts.ignoreSeen); if (v.length < 6) v = mk(steps[1], opts.ignoreSeen); if (v.length < 4) v = mk(Math.min(steps[1], 0), true); return v;
    }
    if (key === 'dia') { let v = vetPool(S, 35); if (v.length < 8) v = vetPool(S, 33); v = v.filter(id => !packedBefore(S, id)); const seen = S.packSeen || {}; const f = v.filter(id => opts.ignoreSeen || seen[id] == null || opts.day - seen[id] >= SEEN_DAYS); return f.length >= 4 ? f : v; }
    const ci = CAT_IDX[key], cat = C.CATS[ci], hi = ci === 0 ? 99 : C.CATS[ci - 1].min - 1;
    const minInt = key === 'dia' ? 10 : 45;   // diamante = golpe de sorte (empréstimo / contrato curto)
    const dvc = Wd.divOf(S, S.club), ourMin = dvc === 'C' ? 15 : dvc === 'B' ? 25 : 52;   // v145: Ouro na B/C (empréstimo de 6 meses) aceita interesse menor
    const seen = S.packSeen || {}, out = [];
    for (const id of Wd.nonYouth()) {
      const p = P[id];
      const o = Wd.ownerOf(S, id);
      if (!o || o === S.club || o === 'Aposentado' || HC.has(o) || brLock(S, o, S.club) || pendingOf(S, id)) continue;
      const s = S.ps[id] || null;
      const ovr = s ? s.ovr : p.ovr0;
      if (ovr < cat.min || ovr > hi) continue;
      if (ci > 0 && diaReq(S, id)) continue;   // lenda conta como Diamante: não aparece no pacote Ouro/Prata
      if (Wd.locked(S, id)) continue;
      if (!opts.ignoreSeen && seen[id] != null && opts.day - seen[id] < SEEN_DAYS) continue;
      if (packedBefore(S, id)) continue;
      if (interest(S, id, S.club) < (key === 'our' ? ourMin : minInt)) continue;
      out.push(id);
    }
    return out;
  }
  // Diamante: 3 meses (14 jogos = 7 dias no relógio acelerado), origem paga 90% do salário.
  // Ouro: empréstimo de 6 meses (28 jogos = 14 dias), sem compra definitiva.
  const LOAN = { dia: 14, oe: 14, our: 28 }, DIA_WAGE = 0.1;
  function diaDeal(S, id, key = 'dia') {
    const n = LOAN[key] || 14, end = Math.min(S.slot + n, SEASON.SLOTS - 1);
    return { kind: 'loan', label: key === 'dia' || key === 'oe' ? 'Empréstimo de 3 meses' : 'Empréstimo de 6 meses', until: `${end - S.slot} jogos · ${Math.ceil((end - S.slot) / SEASON.perDay(S))} dia(s)${SEASON.isTurbo(S) ? ' reais' : ''}`, end };
  }
  function pickPack(S, key, d, r, taken) {
    const full0 = packPool(S, key, { day: d });
    let pool = full0.filter(id => !taken.has(id));
    // v145: com muita gente na liga, se faltar nome o mesmo jogador pode aparecer pra mais de um treinador (quem pegar primeiro leva)
    if (pool.length < 4 && (key === 'our' || key === 'oe' || key === 'dia')) pool = [...pool, ...C.shuffle(full0.filter(id => taken.has(id)), r).slice(0, 4 - pool.length)];
    if (key === 'dia' || key === 'oe') {   // os mais famosos têm mais chance
      const out = [], w = pool.map(id => key === 'oe' ? originW(S, id) * (view(S, id).ovr - 79) : Math.pow(view(S, id).ovr - 68, 1.6));
      while (out.length < 4 && pool.length) { const id = C.pickW(pool, w, r), i = pool.indexOf(id); out.push(id); taken.add(id); pool.splice(i, 1); w.splice(i, 1); }
      return out;
    }
    if (pool.length < 4) pool = [...new Set([...pool, ...C.shuffle(packPool(S, key, { ignoreSeen: true }).filter(id => !taken.has(id)), r)])];
    const out = [], clubs = new Set();
    const order = [], w = pool.map(id => originW(S, id)), pl = pool.slice();
    while (pl.length && order.length < 24) { const id = C.pickW(pl, w, r), i = pl.indexOf(id); order.push(id); pl.splice(i, 1); w.splice(i, 1); }
    for (const id of order) {                // no máximo 1 jogador por clube no mesmo pacote
      const o = Wd.ownerOf(S, id);
      if (o !== 'Livre' && clubs.has(o)) continue;
      clubs.add(o); out.push(id); taken.add(id);
      if (out.length === 4) break;
    }
    return out;
  }
  // jogadores já oferecidos hoje a outros treinadores (cada um recebe um pacote diferente)
  function othersTaken(S, d) {
    const out = new Set(), me = S.desks && S.desks[S.__me];
    for (const t in S.desks || {}) { const x = S.desks[t]; if (x === me || !x.packs || x.packs.day !== d) continue; for (const pk of x.packs.list || []) for (const o of pk.opts || []) out.add(o.id); }
    return out;
  }
  function dailyPack(S, d, shared) {
    // pacote não acumula: o de ontem que ficou sem abrir some (inclusive o bônus Diamante do patrocinador)
    if (S.packs && S.packs.day != null && S.packs.day !== d && (S.packs.list || []).some(p => p.extra && p.taken == null)) S.extraDia = Math.max(0, (S.extraDia || 0) - 1);
    if ((S.extraDia || 0) > 1) S.extraDia = 1;
    if (packOff(S, d)) { S.packs = { day: d, rest: true, off: 'fim', list: [] }; return; }   // v274: fim de temporada, sem pacote (o bônus do patrocinador fica pra próxima)
    const hasDia = (S.dias || 0) >= 1;   // só quem tem diamante (ou Ouro, na B/C) recebe o pacote Diamante / Ouro Especial
    const cats = [packCat(S, d, S.club)].filter(Boolean).map(k => (k === 'dia' || k === 'oe') && !hasDia ? 'our' : k);
    if (S.extraDia > 0 && hasDia) cats.push(isOuro(S) ? 'oe' : 'dia');
    const r = R(`pack${S.seed}${d}|${S.club}|${S.__me}`);
    S.packSeen = S.packSeen || {};
    for (const id in S.packSeen) if (d - S.packSeen[id] >= SEEN_DAYS) delete S.packSeen[id];
    const taken = shared || othersTaken(S, d);
    S.packs = { day: d, rest: !packCat(S, d, S.club), list: cats.map((key, j) => {
      const ids = pickPack(S, key, d, r, taken);
      // v145: nunca pacote vazio — se ainda faltar, completa com os melhores da categoria de baixo, pelo preço dela
      const low = { dia: 'our', oe: 'our', our: 'pra', pra: 'bro' }[key], cat0 = {};
      if (ids.length < 4 && low) { const fill = pickPack(S, low, d, r, new Set([...taken, ...ids])).filter(id => !ids.includes(id)).sort((a, b) => view(S, b).ovr - view(S, a).ovr).slice(0, 4 - ids.length); fill.forEach(id => { ids.push(id); cat0[id] = low; taken.add && taken.add(id); }); }
      ids.forEach(id => { S.packSeen[id] = d; });
      const opts = ids.map(id => { const k2 = cat0[id] || key; return { id, cat: k2, cost: C.PACK_COST[k2], sal: k2 === 'dia' || k2 === 'oe' ? Math.max(10, Math.round(Math.max(view(S, id).sal, salaryDemand(S, id, S.club)) * DIA_WAGE / 10) * 10) : salaryDemand(S, id, S.club), deal: k2 === 'dia' || k2 === 'oe' || k2 === 'our' ? diaDeal(S, id, k2) : null }; });
      return { cat: key, opts, taken: null, extra: j > 0 || !packCat(S, d, S.club) };
    }) };
  }
  const BOMB = ['BOMBA!', 'GOLPE DE SORTE!', 'INACREDITÁVEL!', 'É SÉRIO!'];
  function takePack(S, li, oi) {
    const pk = S.packs.list[li]; if (!pk || pk.taken != null) return { ok: false, msg: 'Pacote já usado hoje.' };
    const o = pk.opts[oi]; if (!o) return { ok: false };
    const b = budget(S);
    const [cs, cd] = o.cost;
    if (effSize(S, S.club) >= ECON.squadMax) return { ok: false, msg: `Elenco cheio (${ECON.squadMax}, contando quem chega e sai na janela).` };
    if ((S.stars || 0) < cs || (S.dias || 0) < cd) return { ok: false, msg: `Faltam ${Math.max(0, cs - (S.stars || 0)) ? `${cs - (S.stars || 0)} estrela(s)` : ''}${Math.max(0, cd - (S.dias || 0)) ? ` ${cd - (S.dias || 0)} ${isOuro(S) ? 'Ouro' : 'diamante(s)'}` : ''}.` };
    if (o.sal > b.wageRoom) return { ok: false, msg: `Estoura o teto salarial (folga T$ ${C.fmt(b.wageRoom)}/dia). Ajuste em Finanças.` };
    const from = Wd.ownerOf(S, o.id);
    if (from && humanClub(S, from)) return { ok: false, msg: Wd.isHuman(S, from) ? `${P[o.id].short} já foi contratado pelo ${from}. Escolha outro do pacote.` : `${P[o.id].short} é de um clube com técnico ativo.` };
    // v194: confere antes de cobrar (antes cobrava as moedas e depois recusava)
    if (o.cat === 'oe' && !isOuro(S)) return { ok: false, msg: 'O Ouro Especial é só pra clubes das Séries B e C.' };
    if (o.cat === 'dia' && isOuro(S)) return { ok: false, msg: 'Jogador Diamante não vem pra Série B/C.' };
    S.stars -= cs; S.dias -= cd;
    pk.taken = oi;
    if (pk.extra) S.extraDia = Math.max(0, (S.extraDia || 0) - 1);
    const s = ps(S, o.id);
    if (o.cat === 'dia' || o.cat === 'oe' || o.cat === 'our') { S.packLog = S.packLog || {}; S.packLog[S.club + '|' + o.id] = S.season; }
    if (o.cat === 'dia' || o.cat === 'oe' || o.cat === 'our') {
      const deal = diaDeal(S, o.id, o.cat), r = R(`bomb${o.id}${S.lastDay}`);
      s.loan = { from: from || 'Livre', end: deal.end, sal0: s.sal, season: S.season, kind: o.cat };
      s.sal = o.sal;
      Wd.move(S, o.id, S.club, true, { t: o.cat === 'dia' ? 'diamante' : 'ouro' });
      const oe = o.cat === 'oe';
      s.lock = S.season * 100 + deal.end + 1;
      const n = P[o.id].name, c = S.club, fr = from && from !== 'Livre' ? `o ${from}` : 'o jogador, que estava sem clube,';
      const T = o.cat === 'dia' ? [
        [`Oportunidade de mercado: ${n} desembarca no ${c}`, `Negócio relâmpago. ${fr[0].toUpperCase() + fr.slice(1)} libera o craque por 3 meses e banca 90% do salário. O ${c} paga T$ ${C.fmt(o.sal)}/dia.`],
        [`${C.pick(BOMB, r)} ${n} é do ${c} por 3 meses`, `Uma grande oportunidade de mercado: o veterano chega para uma passagem curta. ${fr[0].toUpperCase() + fr.slice(1)} cobre 90% dos vencimentos.`],
        [`Golpe de mercado: ${c} anuncia ${n}`, `Aos ${age(S, o.id)} anos, ${P[o.id].short} topa o desafio de 3 meses. Salário quase todo pago ${from && from !== 'Livre' ? `pelo ${from}` : 'pelo empresário'}.`],
        [`${n} no ${c}: a contratação que ninguém esperava`, `Passagem de 3 meses com 90% do salário bancado pela origem. Torcida faz festa no aeroporto.`],
      ] : oe ? [
        [`Ouro Especial: ${n} chega ao ${c} por 3 meses`, `Reforço de peso para a Série ${Wd.divOf(S, c) || 'B'}. ${fr[0].toUpperCase() + fr.slice(1)} libera o jogador e banca 90% do salário. O ${c} paga T$ ${C.fmt(o.sal)}/dia.`],
        [`${c} surpreende e anuncia ${n}`, `Empréstimo de 3 meses com quase todo o salário pago pela origem. Dos melhores do mercado que topam jogar a Série ${Wd.divOf(S, c) || 'B'}.`],
        [`${P[o.id].short} é do ${c}: golpe de mercado na Série ${Wd.divOf(S, c) || 'B'}`, `Passagem curta, de 3 meses. ${fr[0].toUpperCase() + fr.slice(1)} cobre 90% dos vencimentos.`],
      ] : [
        [`${c} aproveita oportunidade de mercado e acerta empréstimo de ${n}`, `Vínculo de 6 meses, sem opção de compra. Salário de T$ ${C.fmt(o.sal)}/dia.`],
        [`Reforço por empréstimo: ${P[o.id].short} chega ao ${c}`, `${fr[0].toUpperCase() + fr.slice(1)} cede o jogador por meia temporada. Depois ele volta.`],
        [`${c} fecha empréstimo de ${n} até o meio da temporada`, `Oportunidade que apareceu no mercado. Seis meses de contrato e volta à origem no fim.`],
        [`Chegou: ${P[o.id].short} reforça o ${c} por 6 meses`, `Empréstimo acertado em poucas horas. A diretoria fala em "oportunidade que não dava pra deixar passar".`],
      ];
      const [title, body] = C.pick(T, r);
      EVENTS.news(S, { t: 'transfer', front: o.cat === 'dia' ? 200 : oe ? 160 : 120, kick: o.cat === 'dia' ? 'Bomba' : oe ? 'Ouro Especial' : undefined, title, body, ids: [o.id], clubs: [S.club, from].filter(x => x && x !== 'Livre') });
      return { ok: true, msg: `${P[o.id].short} é seu por ${o.cat === 'dia' || oe ? '3' : '6'} meses!` };
    }
    if (from && from !== 'Livre' && S.cash[from] !== undefined) S.cash[from] += Math.round(view(S, o.id).mv * 0.9);
    s.sal = o.sal; s.ce = S.season + 3;
    Wd.move(S, o.id, S.club, false, { t: 'pacote' });
    EVENTS.news(S, { t: 'transfer', title: `Pacote ${C.CATS[CAT_IDX[o.cat]].name}: ${P[o.id].name} chega ao ${S.club}`, body: `Custou ${cs} estrela(s)${cd ? ` e ${cd} ${isOuro(S) ? 'Ouro' : 'diamante'}` : ''}. Salário T$ ${C.fmt(o.sal)}/dia.`, ids: [o.id], clubs: [S.club] });
    return { ok: true, msg: `${P[o.id].short} contratado!` };
  }
  // devolve emprestados (no fim do prazo ou da temporada)
  function returnLoans(S, all) {
    for (const id of squad(S, S.club).slice()) {
      const s = S.ps[id]; if (!s || !s.loan) continue;
      if (!all && s.loan.season === S.season && S.slot < s.loan.end) continue;
      const from = s.loan.from, kind = s.loan.kind; s.sal = s.loan.sal0; delete s.loan;
      if (from === 'Livre') { Wd.move(S, id, 'Livre', false, { t: 'retorno' }); S.free.push(id); } else Wd.move(S, id, from, true, { t: 'retorno' });
      if (kind === 'dia' || kind === 'oe' || kind === 'our') {
        const q = C.pick([`Foi um sonho poder ajudar o ${S.club}. Vou levar esse período comigo para sempre.`, `Obrigado, torcida do ${S.club}. Vocês me fizeram sentir em casa desde o primeiro dia.`,
          `Foram poucos meses, mas intensos. O ${S.club} agora faz parte da minha história.`, `Saio com o coração cheio. Quem sabe um dia a gente se reencontra.`, `Vim para ajudar e saio feliz com o que construímos juntos. Força, ${S.club}!`], R(`bye${id}${S.slot}`));
        EVENTS.news(S, { t: 'transfer', title: `${P[id].short} se despede do ${S.club}: "${q}"`, body: `Fim do empréstimo: ${s.st.j} jogos e ${s.st.g} gols. ${from === 'Livre' ? 'Está livre no mercado.' : `Volta ao ${from}.`}`, ids: [id], clubs: [S.club], front: kind === 'dia' ? 90 : 70 });
        S.offers = S.offers.filter(o => o.id !== id);
        continue;
      }
      S.offers = S.offers.filter(o => o.id !== id);
      EVENTS.news(S, { t: 'transfer', title: `Fim do empréstimo: ${P[id].short} volta ao ${from}`, body: `Passagem de meia temporada pelo ${S.club}: ${s.st.j} jogos, ${s.st.g} gols.`, ids: [id], clubs: [S.club, from] });
    }
  }
  const isLoan = (S, id) => !!(S.ps[id] && (S.ps[id].loan || S.ps[id].loanOut));
  function skipPack(S, li) { const pk = S.packs.list[li]; if (pk && pk.taken == null) pk.taken = -1; if (pk && pk.extra) S.extraDia = Math.max(0, (S.extraDia || 0) - 1); }

  // ---------- estrelas e diamantes ----------
  function starsToDia(S) { if ((S.stars || 0) < ECON.starsPerDia) return { ok: false, msg: `Precisa de ${ECON.starsPerDia} estrelas.` }; S.stars -= ECON.starsPerDia; S.dias = (S.dias || 0) + 1; return { ok: true, msg: isOuro(S) ? `${ECON.starsPerDia} estrelas → 1 Ouro.` : `${ECON.starsPerDia} estrelas viraram 1 diamante.` }; }
  function cashOut(S, kind, n) {
    if (kind === 'star') { if ((S.stars || 0) < n) return { ok: false, msg: 'Estrelas insuficientes.' }; S.stars -= n; S.cash[S.club] += n * ECON.starCash; S.fin.cashout = (S.fin.cashout || 0) + n * ECON.starCash; return { ok: true, msg: `+ T$ ${C.fmt(n * ECON.starCash)} no caixa.` }; }
    if ((S.dias || 0) < n) return { ok: false, msg: isOuro(S) ? 'Ouro insuficiente.' : 'Diamantes insuficientes.' }; S.dias -= n; S.cash[S.club] += n * ECON.diaCash; S.fin.cashout = (S.fin.cashout || 0) + n * ECON.diaCash; return { ok: true, msg: `+ T$ ${C.fmt(n * ECON.diaCash)} no caixa.` };
  }

  // ---------- contraproposta a ofertas recebidas ----------
  function counterOffer(S, k, value, share) {
    const of = S.offers.find(o => o.k === k); if (!of) return { status: 'gone', msg: 'A proposta não está mais de pé.' };
    if (of.loanOf && !of.human && share != null) {
      if (!SEASON.windowOpen(SEASON.now(S), S)) return { status: 'keep', msg: winMsg() };
      const sal = view(S, of.id).sal, days = loanDays(S, of.loanOf), val = (f, sh) => f + sal * sh / 100 * days;
      const r = R(`clo${k}${of.tries || 0}`);
      const max = of.maxV || (of.maxV = val(of.fee, of.share) * (1.08 + r() * 0.27));
      const sh = clamp(Math.round(share / 10) * 10, of.share, 100), mine = val(value, sh);
      of.tries = (of.tries || 0) + 1;
      if (mine <= max) { of.fee = Math.round(value); of.share = sh; return { status: 'accept', msg: `${of.club} aceita: ${sh}% do salário e taxa de T$ ${C.fmt(value)}. Confirme o empréstimo.` }; }
      if (mine <= max * 1.15 && of.tries < 3) { of.share = sh; of.fee = Math.max(0, r1k(max - sal * sh / 100 * days)); return { status: 'counter', msg: `${of.club} aceita ${sh}% do salário, mas a taxa fica em T$ ${C.fmt(of.fee)}.` }; }
      if (r() < 0.5 || of.tries >= 3) { S.offers = S.offers.filter(o => o !== of); return { status: 'gone', msg: `${of.club} achou caro demais e desistiu do empréstimo.` }; }
      return { status: 'keep', msg: `${of.club} mantém a proposta original.` };
    }
    if (of.human) {   // entre técnicos humanos: a contraproposta vai pro comprador decidir
      if (value <= of.fee) return { status: 'keep', msg: 'A contraproposta precisa ser maior que a oferta recebida.' };
      of.counter = Math.round(value);
      const seller = S.club, buyer = of.club, k0 = of.k, id = of.id;
      Wd.asClub(S, buyer, () => {
        S.outOffers = (S.outOffers || []).filter(o => o.k !== k0);
        S.outOffers.push({ k: k0, id, owner: seller, fee: of.fee, counter: of.counter, exp: of.exp });
        EVENTS.news(S, { t: 'transfer', title: `${seller} pede T$ ${C.fmt(of.counter)} por ${P[id].short}`, body: `O técnico do ${seller} respondeu sua proposta de T$ ${C.fmt(of.fee)}. Aceite ou recuse em Mercado › Propostas.`, ids: [id], clubs: [seller, buyer], desk: S.__me, front: 85 });
      });
      return { status: 'sent', msg: `Contraproposta de T$ ${C.fmt(of.counter)} enviada ao técnico do ${buyer}.` };
    }
    if (!SEASON.windowOpen(SEASON.now(S), S)) return { status: 'keep', msg: winMsg() };
    const r = R(`co${k}${of.tries || 0}`);
    const max = of.max || (of.max = Math.round(of.fee * (1.08 + r() * 0.27) / 1000) * 1000);
    const cash = S.cash[of.club] !== undefined ? S.cash[of.club] * 0.8 : Infinity;
    const cap = Math.min(max, cash);
    of.tries = (of.tries || 0) + 1;
    if (value <= cap) { of.fee = Math.round(value); return { status: 'accept', msg: `${of.club} aceita pagar T$ ${C.fmt(value)}. Confirme a venda.` }; }
    if (value <= cap * 1.15 && of.tries < 3) { of.fee = Math.round(cap / 1000) * 1000 - 1; return { status: 'counter', msg: `${of.club} sobe a oferta pra T$ ${C.fmt(of.fee)}, mas não passa disso.` }; }
    if (r() < 0.5 || of.tries >= 3) { S.offers = S.offers.filter(o => o !== of); return { status: 'gone', msg: `${of.club} achou caro demais e desistiu.` }; }
    return { status: 'keep', msg: `${of.club} mantém os T$ ${C.fmt(of.fee)}.` };
  }

  function declineOffer(S, k) {
    const of = S.offers.find(o => o.k === k); S.offers = S.offers.filter(o => o.k !== k);
    if (of && of.human) { const seller = S.club; Wd.asClub(S, of.club, () => { S.outOffers = (S.outOffers || []).filter(x => x.k !== k); EVENTS.news(S, { t: 'transfer', title: `${seller} recusa sua proposta por ${P[of.id].short}`, body: `Oferta de T$ ${C.fmt(of.fee)} recusada.`, ids: [of.id], clubs: [seller, of.club], desk: S.__me }); }); }
  }
  // comprador responde a contraproposta de outro técnico humano
  function respondCounter(S, k, yes) {
    const out = (S.outOffers || []).find(o => o.k === k); if (!out) return { ok: false, msg: 'Negociação não encontrada.' };
    S.outOffers = S.outOffers.filter(o => o.k !== k);
    const buyer = S.club, owner = out.owner;
    if (!yes) {
      Wd.asClub(S, owner, () => { S.offers = S.offers.filter(o => o.k !== k); EVENTS.news(S, { t: 'transfer', title: `${buyer} recusa pagar T$ ${C.fmt(out.counter)} por ${P[out.id].short}`, body: 'Negociação encerrada.', ids: [out.id], clubs: [owner, buyer], desk: S.__me }); });
      return { ok: true, msg: 'Contraproposta recusada.' };
    }
    if (out.counter > budget(S).transfer) { S.outOffers.push(out); return { ok: false, msg: `Passa do seu orçamento de compras (T$ ${C.fmt(budget(S).transfer)}).` }; }
    const res = Wd.asClub(S, owner, () => {
      const of = S.offers.find(o => o.k === k); if (!of) return { err: 'A proposta não está mais de pé.' };
      const oldFee = of.fee, oldCounter = of.counter;
      of.fee = of.counter; delete of.counter;
      const accepted = acceptOffer(S, k);
      if (!accepted || accepted.err) { of.fee = oldFee; of.counter = oldCounter; }
      return accepted;
    });
    if (!res || res.err) { if (res && res.err !== 'A proposta não está mais de pé.') S.outOffers.push(out); return { ok: false, msg: (res && res.err) || 'O outro técnico já desfez a negociação.' }; }
    Wd.asClub(S, owner, () => EVENTS.news(S, { t: 'transfer', title: `${buyer} aceita a contraproposta por ${P[out.id].short}`, body: res.pending ? 'Acordo fechado: a transferência acontece na abertura da janela.' : 'Transferência concluída.', ids: [out.id], clubs: [owner, buyer], desk: S.__me }));
    return { ok: true, pending: !!res.pending, msg: res.pending ? `Acordo fechado por T$ ${C.fmt(res.fee)}. ${P[out.id].short} chega quando a janela abrir.` : `${P[out.id].short} contratado por T$ ${C.fmt(res.fee)}!` };
  }
  // ---------- IA ----------
  function aiBuy(S, club, r) {
    const t = SEASON.aiTac(S, club), slots = FORMATIONS[t.formation];
    const xi = SEASON.pickXI(S, squad(S, club), t.formation, true);
    let wi = 0, wv = 999;
    xi.forEach((id, i) => { const v = id ? view(S, id).ovr * fit(P[id].pos, slots[i][0]) : 0; if (v < wv) { wv = v; wi = i; } });
    const pos = slots[wi][0], cash = S.cash[club], reserve = Wd.payroll(S, club) * 30;
    if (cash < 5000 || cash < reserve) return;
    const cands = [];
    for (const id of Wd.nonYouth()) {
      const p = P[id];
      const o = Wd.ownerOf(S, id);
      if (!o || o === club || Wd.isHuman(S, o) || o === 'Aposentado') continue;
      if (brLock(S, o, club)) continue;
      const ovr = S.ps[id] ? S.ps[id].ovr : p.ovr0;
      if (ovr < wv + 3 || ovr > wv + 10 || fit(p.pos, pos) < 0.94) continue;
      if (Wd.locked(S, id) || pendingOf(S, id) || preOf(S, id) || isLoan(S, id)) continue;   // v194: nem emprestado
      if (S.cash[o] !== undefined && squad(S, o).length <= 22) continue;
      if (foreignFloor(S, o)) continue;   // v219: clube do exterior não fica sem elenco
      const sc = interest(S, id, club); if (sc < 40) continue;
      const g = natGroup(p.nat);
      if (g !== 'BRA') {   // limite realista de estrangeiros (e bem menos de fora da América do Sul)
        const sq = squad(S, club), fo = sq.filter(x => P[x].nat !== 'BRA').length, far = sq.filter(x => !['BRA', 'SA', 'LUSO'].includes(natGroup(P[x].nat))).length;
        if (fo >= 9 || (!['SA', 'LUSO'].includes(g) && far >= 3)) continue;
      }
      const fee = ask(S, id, club).fee;
      if (fee > cash * 0.6 || cash - fee < reserve) continue;   // v175: IA não compra se ficar sem 30 dias de folha em caixa
      cands.push({ id, o, fee, score: ovr - fee / 20000 + r() * 3 });
    }
    if (!cands.length) return;
    cands.sort((a, b) => b.score - a.score);
    const c = cands[0], s = ps(S, c.id);
    s.sal = salaryDemand(S, c.id, club); s.ce = S.season + 1 + Math.floor(r() * 3);
    S.cash[club] -= c.fee; if (S.cash[c.o] !== undefined) S.cash[c.o] += c.fee;
    Wd.move(S, c.id, club, false, { t: c.o === 'Livre' ? 'livre' : 'compra', fee: c.fee });
    EVENTS.news(S, { t: 'transfer', title: `${club} contrata ${P[c.id].name}`, body: `${c.o === 'Livre' ? 'Estava sem clube' : `Vem do ${c.o}`}${c.fee ? ` por T$ ${C.fmt(c.fee)}` : ''}. ${P[c.id].pos}, overall ${s.ovr}.`, ids: [c.id], clubs: [club, c.o] });
    if (squad(S, club).length > ECON.squadMax) {
      const worst = squad(S, club).filter(id => P[id].pos !== 'GOL').sort((a, b) => view(S, a).ovr - view(S, b).ovr)[0];
      Wd.move(S, worst, 'Livre'); S.free.push(worst);
      EVENTS.news(S, { t: 'transfer', title: `${club} dispensa ${P[worst].name}`, ids: [worst], clubs: [club], minor: true });
    }
  }
  function aiOffer(S, r) {
    S.offers = S.offers.filter(o => o.exp > S.lastDay && Wd.ownerOf(S, o.id) === S.club);
    if (S.offers.length >= 3 || squad(S, S.club).length <= ECON.squadMin) return;
    const clubs = Wd.brClubs(S).filter(c => !Wd.isHuman(S, c) && S.cash[c] > 20000 && !brLock(S, S.club, c));
    const c = C.pick(clubs, r); if (!c) return;
    const t = SEASON.aiTac(S, c), slots = FORMATIONS[t.formation], xi = SEASON.pickXI(S, squad(S, c), t.formation, true);
    const eff = xi.map((id, i) => id ? view(S, id).ovr * fit(P[id].pos, slots[i][0]) : 0);
    const targets = squad(S, S.club).filter(id => !S.offers.some(o => o.id === id) && !Wd.locked(S, id) && !isLoan(S, id) && !preOf(S, id)).map(id => {
      let gain = 0; slots.forEach(([pos], i) => { const g = ps(S, id).ovr * fit(P[id].pos, pos) - eff[i]; if (g > gain) gain = g; });
      return { id, gain };
    }).filter(x => x.gain >= 2 && interest(S, x.id, c) >= 45).sort((a, b) => b.gain - a.gain).slice(0, 4);
    if (!targets.length) return;
    const tg = C.pick(targets, r);
    const fee = r1k(ps(S, tg.id).mv * (0.9 + r() * 0.45)) - 1;
    if (fee > S.cash[c] * 0.7) return;
    S.offers.push({ id: tg.id, club: c, fee, exp: S.lastDay + 2, k: hash(`${tg.id}${c}${S.lastDay}`) });
    { const top = view(S, tg.id).ovr >= 78; EVENTS.news(S, { t: 'transfer', ...(top ? { by: 'fab', kick: 'Fabrizio Otomano' } : {}), title: top ? `${c} apresenta proposta formal por ${P[tg.id].short}` : `${c} faz proposta por ${P[tg.id].short}`, body: `Oferta de T$ ${C.fmt(fee)} ao ${S.club}. Responda em Mercado › Propostas.`, ids: [tg.id], clubs: [S.club, c] }); }
  }
  function abroadOffer(S, id, mult) {
    const club = abroadClub(S, id);
    const fee = r1k(ps(S, id).mv * mult) - 1;
    S.offers.push({ id, club, fee, exp: S.lastDay + 3, k: hash(`ab${id}${S.lastDay}`), abroad: true });
    return { club, fee };
  }
  // ---------- lista de transferências e empréstimo (jogadores do seu elenco) ----------
  function setListing(S, id, kind, len) {
    const s = ps(S, id);
    if (Wd.ownerOf(S, id) !== S.club || isLoan(S, id) || pendingOf(S, id)) return false;
    { const pc = preOf(S, id); if (pc) return { blocked: `${P[id].short} já assinou pré-contrato com o ${pc.club}: não vai pra lista.` }; }   // v261: brecha (pré-contrato era negociável pelo dono)
    if (kind === 'list') { if (s.list) delete s.list; else s.list = { day: S.lastDay ?? 0, season: S.season }; return !!s.list; }
    if (kind === 'loan') { if (s.loanList && (!len || s.loanList.len === len)) delete s.loanList; else s.loanList = { day: S.lastDay ?? 0, season: S.season, len: len || '6m' }; return !!s.loanList; }
  }
  const LOAN_LEN = { '6m': 'seis meses', '1t': 'uma temporada' };
  function listingOffers(S, d, r) {
    for (const id of squad(S, S.club)) {
      const s = S.ps[id]; if (!s || (!s.list && !s.loanList) || isLoan(S, id) || Wd.locked(S, id)) continue;
      if (S.offers.some(o => o.id === id && (o.listed || o.loanOf))) continue;
      const v = view(S, id), a = age(S, id);
      const days = Math.max(0, d - ((s.list || s.loanList).day || 0));
      // interesse do mercado: melhor jogador/mais jovem atrai mais; salário alto afasta
      const appeal = clamp(0.25 + (v.ovr - 65) * 0.02 + (a <= 25 ? 0.1 : a >= 32 ? -0.1 : 0) - (v.sal > v.mv * ECON.salaryRate * 1.5 ? 0.1 : 0) + Math.min(0.2, days * 0.03), 0.08, 0.7);
      if (r() >= appeal) continue;
      const br = Wd.brClubs(S).filter(c => c !== S.club && !brLock(S, S.club, c) && !Wd.isHuman(S, c) && (S.cash[c] || 0) > 0 && !(S.safCrisis && S.safCrisis[c]) && squad(S, c).length < ECON.squadMax && interest(S, id, c) >= 35);
      const abroadFirst = r() < (s.list ? 0.45 : 0.3);
      if (s.list) {
        // clube expôs o jogador: propostas abaixo do valor (piora com o tempo na lista e contrato curto)
        let m = 0.88 - Math.min(0.25, days * 0.025) + (a <= 24 ? 0.05 : a >= 31 ? -0.08 : 0) - (v.ce <= S.season ? 0.12 : 0) + (r() - 0.5) * 0.1;
        m = clamp(m, 0.45, 0.98);
        if (abroadFirst || !br.length) { const o = abroadOffer(S, id, m); S.offers[S.offers.length - 1].listed = true; EVENTS.news(S, { t: 'transfer', title: `${o.club} faz proposta por ${P[id].short}, que está na lista`, body: `Oferta de T$ ${C.fmt(o.fee)} (${Math.round(m * 100)}% do valor). Responda em Mercado › Propostas.`, ids: [id], clubs: [S.club], desk: S.__me }); }
        else {
          const c = br.sort((x, y) => (S.cash[y] || 0) - (S.cash[x] || 0))[Math.floor(r() * Math.min(4, br.length))];
          const fee = Math.min(r1k(v.mv * m) - 1, Math.max(1000, Math.round((S.cash[c] || 0) * 0.5 / 1000) * 1000));
          S.offers.push({ id, club: c, fee, exp: d + 2, k: hash(`ls${id}${c}${d}`), listed: true });
          EVENTS.news(S, { t: 'transfer', title: `${c} se interessa por ${P[id].short}, que está na lista`, body: `Oferta de T$ ${C.fmt(fee)}. Responda em Mercado › Propostas.`, ids: [id], clubs: [S.club, c], desk: S.__me });
        }
      } else {
        const len = s.loanList.len, club = abroadFirst || !br.length ? abroadClub(S, id) : br[Math.floor(r() * br.length)];
        const share = clamp(0.55 + r() * 0.45 - Math.min(0.2, days * 0.02), 0.4, 1);   // parte do salário que o outro clube assume
        const fee = r1k(v.mv * (len === '1t' ? 0.08 : 0.04) * share);
        S.offers.push({ id, club, fee, exp: d + 2, k: hash(`lo${id}${club}${d}`), loanOf: len, share: Math.round(share * 100), abroad: !br.includes(club) });
        EVENTS.news(S, { t: 'transfer', title: `${club} quer ${P[id].short} emprestado por ${LOAN_LEN[len]}`, body: `Paga ${Math.round(share * 100)}% do salário e taxa de T$ ${C.fmt(fee)}. Responda em Mercado › Propostas.`, ids: [id], clubs: [S.club], desk: S.__me });
      }
    }
  }
  // exterior: se ele joga pouco (menos de 40% dos jogos do clube), o dono chama de volta com a janela aberta
  function abroadRecalls(S) {
    if (!SEASON.windowOpen(SEASON.now(S), S)) return;
    for (const id in S.ps) {
      const s = S.ps[id], lo = s && s.loanOut; if (!lo || !lo.abroad || lo.season !== S.season) continue;
      const club = Wd.ownerOf(S, +id); let games = 0;
      for (let k = lo.k0; k < S.slot; k++) for (const m of (S.played[k] || [])) if (m.h === club || m.a === club) games++;
      if (games < 8 || ((s.st && s.st.j) || 0) - (lo.j0 || 0) >= games * 0.4) continue;
      const back = lo.from;
      s.loans = [...(s.loans || []), { club, from: back, season: lo.season, len: lo.len, fee: lo.fee || 0, share: lo.share, k0: lo.k0, k1: S.slot, recall: true }].slice(-6);
      delete s.loanOut; delete s.wagePart; Wd.move(S, +id, back, true, { t: 'retorno' });
      const n = { t: 'transfer', title: `${back} chama ${P[id].short} de volta`, body: `Com poucos minutos no ${club} (${((s.st && s.st.j) || 0) - (lo.j0 || 0)} jogos em ${games}), o clube encerrou o empréstimo antes do fim.`, ids: [+id], clubs: [club] };
      if (Wd.isHuman(S, club)) Wd.asClub(S, club, () => EVENTS.news(S, { ...n, desk: S.__me, front: 80 })); else EVENTS.news(S, { ...n, minor: true });
    }
  }
  function buyOption(S, id) {
    const s = ps(S, id), lo = s.loanOut;
    if (!lo || !lo.abroad || !lo.opt || Wd.ownerOf(S, id) !== S.club) return { ok: false, msg: 'Não há opção de compra para esse jogador.' };
    if (!SEASON.windowOpen(SEASON.now(S), S)) return { ok: false, msg: winMsg() };
    const b = budget(S); if (lo.opt > b.transfer) return { ok: false, msg: `A opção (T$ ${C.fmt(lo.opt)}) passa do orçamento de compras.` };
    const from = lo.from, fee = lo.opt;
    s.loans = [...(s.loans || []), { club: S.club, from, season: lo.season, len: lo.len, fee: lo.fee || 0, share: lo.share, k0: lo.k0, k1: S.slot, bought: fee }].slice(-6);
    delete s.loanOut; delete s.wagePart; s.ce = Math.max(s.ce || 0, S.season + 3);
    S.cash[S.club] -= fee; S.fin.spent = (S.fin.spent || 0) + fee;
    Wd.move(S, id, S.club, false, { t: 'compra', fee });
    EVENTS.news(S, { t: 'transfer', title: `${S.club} exerce a opção e compra ${P[id].short}`, body: `Pagou T$ ${C.fmt(fee)} ao ${from}. Contrato até ${s.ce}.`, ids: [id], clubs: [S.club, from] });
    return { ok: true, msg: `${P[id].short} comprado em definitivo!` };
  }
  // O clube dono do passe pode encerrar o empréstimo, devolvendo a parte da taxa
  // correspondente aos jogos que o tomador não terá mais com o atleta.
  function recallQuote(S, id) {
    const lo = S.ps[id] && S.ps[id].loanOut, borrower = Wd.ownerOf(S, id);
    if (!lo || lo.from !== S.club || borrower === S.club || borrower === 'Livre' || borrower === 'Aposentado') return { ok: false, msg: 'Não há empréstimo ativo deste jogador para chamar de volta.' };
    if (lo.season !== S.season) return { ok: false, msg: 'O prazo deste empréstimo já terminou.' };
    const start = Number.isFinite(lo.k0) ? lo.k0 : 0;
    const end = lo.end != null ? lo.end : SEASON.SLOTS;
    const total = Math.max(1, end - start), left = Math.max(0, end - Math.max(start, S.slot || 0));
    if (!left) return { ok: false, msg: 'O empréstimo já terminou; o jogador volta no próximo processamento.' };
    const fee = Math.max(0, Math.round(lo.fee || 0));
    return { ok: true, borrower, fee, refund: Math.round(fee * left / total), left, total };
  }
  function recallLoan(S, id, expectedRefund) {
    const q = recallQuote(S, id); if (!q.ok) return q;
    if (expectedRefund != null && q.refund !== expectedRefund) return { ok: false, msg: 'O prazo avançou e o reembolso mudou. Confira o novo valor antes de confirmar.' };
    const s = ps(S, id), lo = s.loanOut, lender = S.club;
    S.cash[lender] = (S.cash[lender] || 0) - q.refund;
    S.fin.loanRefundOut = (S.fin.loanRefundOut || 0) + q.refund;
    if (S.cash[q.borrower] !== undefined) S.cash[q.borrower] += q.refund;
    if (Wd.isHuman(S, q.borrower)) Wd.asClub(S, q.borrower, () => { S.fin.loanRefundIn = (S.fin.loanRefundIn || 0) + q.refund; });
    s.loans = [...(s.loans || []), { club: q.borrower, from: lender, season: lo.season, len: lo.len, fee: lo.fee || 0, share: lo.share, k0: lo.k0, k1: S.slot, recall: true, refund: q.refund }].slice(-6);
    delete s.loanOut; delete s.wagePart;
    Wd.move(S, id, lender, true, { t: 'retorno', x: { recall: true, refund: q.refund } });
    EVENTS.news(S, { t: 'transfer', title: `${lender} chama ${P[id].short} de volta`, body: `Empréstimo ao ${q.borrower} encerrado com ${q.left} de ${q.total} jogos restantes. O ${lender} devolve T$ ${C.fmt(q.refund)} da taxa ao ${q.borrower}.`, ids: [id], clubs: [lender, q.borrower], front: 60 });
    return { ok: true, refund: q.refund, msg: `${P[id].short} voltou ao ${lender}. T$ ${C.fmt(q.refund)} devolvidos ao ${q.borrower}.` };
  }
  // volta de quem foi emprestado (no fim do prazo ou da temporada)
  // v194: empréstimo (pacote/Diamante/Ouro) num clube que ficou sem treinador: devolve no prazo do mesmo jeito
  function returnOrphanLoans(S, all) {
    for (const id in S.ps) {
      const s = S.ps[id]; if (!s || !s.loan) continue;
      const club = Wd.ownerOf(S, +id); if (!club || Wd.isHuman(S, club)) continue;   // clube com treinador: returnLoans da mesa cuida
      if (!all && s.loan.season === S.season && S.slot < s.loan.end) continue;
      const from = s.loan.from; s.sal = s.loan.sal0; delete s.loan;
      if (from === 'Livre') { Wd.move(S, +id, 'Livre', false, { t: 'retorno' }); if (!S.free.includes(+id)) S.free.push(+id); } else Wd.move(S, +id, from, true, { t: 'retorno' });
    }
  }
  function returnLoanOuts(S, all) {
    for (const id in S.ps) {
      const s = S.ps[id]; if (!s.loanOut) continue;
      const lo = s.loanOut, over = all || S.season > lo.season || (lo.end != null && S.slot >= lo.end);
      if (!over) continue;
      const back = lo.from;
      s.loans = [...(s.loans || []), { club: Wd.ownerOf(S, +id), from: back, season: lo.season, len: lo.len, fee: lo.fee || 0, share: lo.share, k0: lo.k0, k1: S.slot }].slice(-6);
      delete s.loanOut; delete s.wagePart;
      if (Wd.isHuman(S, back)) {
        Wd.move(S, +id, back, true, { t: 'retorno' });
        Wd.asClub(S, back, () => EVENTS.news(S, { t: 'transfer', title: `${P[id].short} volta de empréstimo ao ${back}`, body: `Passagem pelo ${s.loans[s.loans.length - 1].club} encerrada. Ele já está à disposição.`, ids: [+id], clubs: [back], desk: S.__me }));
      } else Wd.move(S, +id, back, true, { t: 'retorno' });
    }
  }
  function bigBuyers(S, d, r) {
    const cand = { eu: [], ar: [] };
    for (const c of Wd.brClubs(S)) for (const id of squad(S, c)) {
      const s = S.ps[id]; if (!P[id] || P[id].youth || (s && (s.loan || s.loanOut)) || Wd.locked(S, id) || pendingOf(S, id) || diaReq(S, id) || preOf(S, id)) continue;
      if (hotYoung(S, id)) cand.eu.push(id);
      else { const a = age(S, id), v = view(S, id); if (a >= 24 && a <= 31 && v.ovr >= 78) cand.ar.push(id); }
    }
    const go = (list, clubs, pr, lo, hi, tag) => {
      if (!list.length || r() > pr) return;
      const id = list.sort((a, b) => view(S, b).pot - view(S, a).pot || view(S, b).ovr - view(S, a).ovr)[Math.floor(Math.pow(r(), 2) * Math.min(12, list.length))];
      const o = Wd.ownerOf(S, id), buyer = clubs[Math.floor(r() * clubs.length)], v = view(S, id);
      const fee = r1k(v.mv * (lo + r() * (hi - lo))) - 1, pct = Math.round(fee / v.mv * 100);
      if (Wd.isHuman(S, o)) {
        Wd.asClub(S, o, () => {
          if (S.offers.some(x => x.id === id && x.club === buyer)) return;
          S.offers.push({ id, club: buyer, fee, exp: d + 3, k: hash(`bb${id}${buyer}${d}`), abroad: true, giant: tag });
          EVENTS.news(S, { t: 'transfer', kick: tag === 'eu' ? 'Europa' : 'Arábia', front: 110, title: tag === 'eu' ? `${buyer} faz proposta milionária por ${P[id].short}` : `${buyer} abre os cofres por ${P[id].short}`, body: `Oferta de T$ ${C.fmt(fee)} (${pct}% do valor de mercado). ${tag === 'eu' ? `O clube europeu vê em ${P[id].short}, ${age(S, id)} anos, uma futura estrela.` : 'Salário de sheik e contrato longo.'} Responda em Mercado › Propostas.`, ids: [id], clubs: [o], desk: S.__me });
        });
        EVENTS.news(S, { t: 'transfer', tag: 'rumor', kick: 'Rumor', title: `${buyer} de olho em ${P[id].short}, do ${o}`, body: tag === 'eu' ? `Olheiros do clube acompanharam os últimos jogos. ${age(S, id)} anos e potencial de sobra.` : 'O fundo do clube já fez a primeira sondagem.', ids: [id], clubs: [o], front: 60 });
        return;
      }
      if (r() > 0.6) { EVENTS.news(S, { t: 'transfer', title: `${o} recusa proposta do ${buyer} por ${P[id].short}`, body: `Oferta de T$ ${C.fmt(fee)} (${pct}% do valor). O clube quer segurar a joia por mais uma temporada.`, ids: [id], clubs: [o], front: 70 }); return; }
      if (S.cash[o] !== undefined) S.cash[o] += fee;
      Wd.move(S, id, buyer, false, { t: 'compra', fee });
      EVENTS.news(S, { t: 'transfer', kick: 'Bomba', front: 120, title: `${P[id].name} vendido ao ${buyer} por T$ ${C.fmtK(fee)}`, body: `${o} fecha a venda por ${pct}% do valor de mercado. ${tag === 'eu' ? `Aos ${age(S, id)} anos, a joia vai pra Europa.` : 'Proposta irrecusável da Arábia.'}`, ids: [id], clubs: [o] });
    };
    go(cand.eu, EU_GIANTS, 0.22, 1.2, 1.7, 'eu');
    go(cand.ar, ARAB_RICH, 0.12, 1.35, 1.9, 'ar');
  }
  // disputa: outro clube cobre a proposta pelo seu jogador (leilão)
  function biddingWar(S, d, r) {
    const seen = new Set();
    for (const of of S.offers.slice()) {
      if (of.loanOf || of.human || seen.has(of.id) || of.exp <= d) continue; seen.add(of.id);
      const v = view(S, of.id); if (v.ovr < 70 && !hotYoung(S, of.id)) continue;
      const all = S.offers.filter(x => x.id === of.id && !x.loanOf); if (all.length >= 3 || r() > 0.28) continue;
      const top = all.reduce((a, b) => b.fee > a.fee ? b : a), cap = v.mv * 1.9;
      if (top.fee >= cap) continue;
      const young = hotYoung(S, of.id), taken = new Set(all.map(x => x.club));
      const pool = (young ? EU_GIANTS : v.ovr >= 78 ? [...ARAB_RICH, ...[...S.divA].filter(c => !Wd.isHuman(S, c) && c !== S.club && (S.cash[c] || 0) > top.fee * 1.2)] : Wd.brClubs(S).filter(c => !Wd.isHuman(S, c) && c !== S.club && (S.cash[c] || 0) > top.fee * 1.2)).filter(c => !taken.has(c));
      if (!pool.length) continue;
      const club = pool[Math.floor(r() * pool.length)], fee = Math.min(r1k(cap), r1k(top.fee * (1.06 + r() * 0.1)) - 1);
      const abroad = !inBR(S, club);
      S.offers.push({ id: of.id, club, fee, exp: d + 2, k: hash(`bw${of.id}${club}${d}`), abroad, war: true });
      all.forEach(x => { x.war = true; x.exp = Math.max(x.exp, d + 2); });
      EVENTS.news(S, { t: 'transfer', kick: 'Disputa', front: 95, title: `Leilão por ${P[of.id].short}: ${club} cobre a oferta do ${top.club}`, body: `Nova proposta de T$ ${C.fmt(fee)} (${Math.round(fee / v.mv * 100)}% do valor). ${all.length + 1} clubes na briga. Responda em Mercado › Propostas.`, ids: [of.id], clubs: [S.club, club], desk: S.__me });
    }
  }
  // v203: pré-contrato x venda em aparelhos diferentes ao mesmo tempo (YNHWXS, #150): o Floresta assinou o pré-contrato e, antes de
  // os aparelhos se acertarem, o Avaí comprou o jogador. Na virada o pré-contrato levava de graça um jogador que o Avaí pagou.
  // v284: inverte o desempate — O PRÉ-CONTRATO VENCE (Ypiranga/Floresta × Avaí, YNHWXS). A compra só escapa num aparelho com o mundo velho
  // (a 284 trava isso antes); se escapar, o jogador fica no comprador até a virada e vai pro clube do pré, com aviso pros dois. O pré não cai mais.
  function preCheck(S) {
    if (!S.pre || !S.pre.length) return;
    for (const pc of S.pre) {
      const o = Wd.ownerOf(S, pc.id);
      if (!P[pc.id] || o === 'Aposentado' || o === pc.club) continue;
      let moved = false;
      if (pc.from != null) moved = o !== pc.from;
      else {   // pré-contrato antigo (sem dono anotado): última transferência dele nesta temporada, depois do início dos pré-contratos
        const tl = (S.trlog || []).filter(e => e[2] === pc.id && e[0] === S.season && ['compra', 'troca', 'livre', 'pacote', 'ouro', 'diamante'].includes(e[6]));
        const e = tl[tl.length - 1]; moved = !!e && e[1] >= SEASON.PRE_FROM && e[4] === o;
        // se a notícia do pré-contrato ainda existe e é de depois da compra, o pré-contrato foi assinado com o dono novo: nada mudou
        if (moved) { const n = (S.news || []).find(x => x.s === S.season && (x.ids || []).includes(pc.id) && /assina pré-contrato com o/.test(x.title || '') && (x.title || '').endsWith(pc.club)); if (n && n.d != null && n.d >= (e[7] ?? 0)) moved = false; }
      }
      if (!moved) continue;
      const old = pc.from; pc.from = o;   // anota o dono novo: o aviso sai uma vez só
      EVENTS.news(S, { t: 'transfer', title: `${P[pc.id].short} muda de clube, mas o pré-contrato com o ${pc.club} segue valendo`, body: `O ${o} fechou a compra dele${old ? ` junto ao ${old}` : ''} sem enxergar o pré-contrato. Ele joga pelo ${o} até o fim da temporada e chega ao ${pc.club} na virada, de graça, como o pré-contrato manda.`, ids: [pc.id], clubs: [pc.club, o], front: 85 });
    }
  }
  function daily(S, d) {
    try { preCheck(S); } catch (e) {}
    settlePending(S);
    returnLoanOuts(S);
    try { abroadRecalls(S); } catch (e) { SEASON.oops && SEASON.oops(S, 'empréstimos do exterior', e); }
    Wd.forDesks(S, () => { if (!S.unemployed) returnLoans(S); });
    returnOrphanLoans(S);
    const r = R(`mkt${S.seed}${d}`);
    const open = SEASON.windowOpen(SEASON.sportDayStart(S, d) + (SEASON.isTurbo(S) ? 3 : 12) * 3600000, S);
    if (open) {
      // janela aberta (sábado e domingo): o mercado da IA ferve
      for (const c of Wd.brClubs(S)) if (!Wd.isHuman(S, c) && r() < 0.16) aiBuy(S, c, r);
      Wd.forDesks(S, () => { if (S.unemployed) return; if (r() < 0.7) aiOffer(S, r); if (r() < 0.5) aiOffer(S, r); });
      Wd.forDesks(S, () => { if (!S.unemployed) listingOffers(S, d, r); });
      bigBuyers(S, d, r);
      Wd.forDesks(S, () => { if (!S.unemployed) biddingWar(S, d, r); });
    }
    if (S.slot < SEASON.SLOTS) { aiListings(S, d, r); abroadListings(S, d, r); }
    try { fillAll(S, false); } catch (e) {}   // v219: ninguém fica sem elenco
    // IA contrata livres (lista gira)
    if (S.free.length && r() < 0.25) {
      const id = C.pick(S.free, r), c = C.pick(Wd.brClubs(S).filter(x => !Wd.isHuman(S, x)), r);
      if (id && c && squad(S, c).length < 28 && view(S, id).ovr >= SEASON.strength(S, c) - 8) {
        Wd.move(S, id, c, false, { t: 'livre' }); ps(S, id).sal = salaryDemand(S, id, c); ps(S, id).ce = S.season + 1;
        EVENTS.news(S, { t: 'transfer', title: `${c} acerta com ${P[id].name}`, body: 'Estava livre no mercado.', ids: [id], clubs: [c], minor: true });
      }
    }
    // pré-contratos da IA (inclusive com os seus jogadores em fim de contrato)
    if (S.slot >= SEASON.PRE_FROM) Wd.forDesks(S, () => {
      if (S.unemployed) return;
      for (const id of squad(S, S.club)) {
        const s = ps(S, id);
        if (!isLoan(S, id) && s.short !== S.season && s.ce <= S.season && !S.pre.some(x => x.id === id) && s.ovr >= 68 && r() < 0.06) {
          const c = C.pick(Wd.brClubs(S).filter(x => !Wd.isHuman(S, x)), r);
          if (!c) continue;   // v159: liga com A, B e C lotadas de treinadores não tem clube da IA pra levar o jogador (antes quebrava o dia inteiro)
          S.pre.push({ id, club: c, sal: salaryDemand(S, id, c), years: 2, from: S.club, k: S.slot || 0, d: S.lastDay ?? 0 });
          EVENTS.news(S, { t: 'transfer', title: `${P[id].short} assina pré-contrato com o ${c}`, body: `Sem renovação, ele sai de graça do ${S.club} no fim da temporada.`, ids: [id], clubs: [S.club, c] });
        }
      }
    });
    { const shared = new Set(); Wd.forDesks(S, () => { if (!S.unemployed) dailyPack(S, d, shared); }); }
  }
  function seasonEnd(S) {
    Wd.forDesks(S, () => { if (!S.unemployed) returnLoans(S, true); });
    returnOrphanLoans(S, true);
    returnLoanOuts(S, true);
    // pré-contratos executados
    try { preCheck(S); } catch (e) {}
    for (const pc of S.pre) {
      if (Wd.ownerOf(S, pc.id) === 'Aposentado') continue;
      const s = ps(S, pc.id); s.sal = pc.sal; s.ce = S.season + 1 + pc.years;
      Wd.move(S, pc.id, pc.club, false, { t: 'pre' });
      EVENTS.news(S, { t: 'transfer', title: `${P[pc.id].name} chega ao ${pc.club}`, body: 'Pré-contrato: transferência sem custo.', ids: [pc.id], clubs: [pc.club], minor: !Wd.isHuman(S, pc.club) });
    }
    const preIds = new Set(S.pre.map(x => x.id));
    S.pre = [];
    const r = R(`ctr${S.seed}${S.season}`), renewed = {};
    for (const c of Wd.brClubs(S)) {
      for (const id of squad(S, c)) {
        const s = ps(S, id);
        if (s.ce > S.season || preIds.has(id) || pendingOf(S, id)) continue;
        if (Wd.isHuman(S, c)) {
          // clube humano: a diretoria renova por 1 temporada quem tem até 32 anos (ninguém perde meio elenco na virada);
          // veteranos 33+ e quem pediu pra sair terminam o contrato
          if (age(S, id) < 33 && s.wantOut !== S.season) { s.ce = S.season + 1; s.sal = renewTerms(S, id, 1).sal; (renewed[c] = renewed[c] || []).push(id); continue; }
          Wd.move(S, id, 'Livre', false, { t: 'fim' }); S.free.push(id);
          EVENTS.news(S, { t: 'transfer', title: `${P[id].name} deixa o ${c}`, body: 'Contrato encerrado sem renovação. Está livre no mercado.', ids: [id], clubs: [c] });
        } else if (age(S, id) < 33 && r() < 0.7) { s.ce = S.season + 1 + Math.floor(r() * 3); s.sal = renewTerms(S, id, 2).sal; }
        else { Wd.move(S, id, 'Livre', false, { t: 'fim' }); S.free.push(id); }
      }
    }
    for (const [c, ids] of Object.entries(renewed)) EVENTS.news(S, { t: 'transfer', title: `Diretoria do ${c} renova ${ids.length} contrato(s) que venciam`, body: `Renovados por mais uma temporada: ${ids.map(id => P[id].short).join(', ')}.`, ids: ids.slice(0, 12), clubs: [c] });
    Wd.forDesks(S, () => { S.offers = []; S.negs = {}; });
  }

  return { NEG_DAYS, negUntil, negDrop, foreignFloor, fillSquad, fillAll, freeCands, FOREIGN_MIN, FILL_START, FILL_MIN, HUMAN_MIN, preCheck, returnOrphanLoans, isOuro, isOuroClub, gemSwitch, buyOption, isAbroad, loanBase, loanValue, rivalFor, EU_GIANTS, ARAB_RICH, bigBuyers, biddingWar, isLegend, brLock, diaReq, diaWhy, starsToDia, cashOut, counterOffer, interest, interestLabel, ask, salaryDemand, budget, daysLeft, canTalk, bid, contract, negState, renewTerms, renew, releaseCost, release,
    swapValue, requestLoan, pendingOf, pendingFor, settlePending, natGroup, acceptOffer, respondCounter, declineOffer, preEligible, packPool, pickPack, diaDeal, setListing, LOAN_LEN, isLoan, humanClub, returnLoans, recallQuote, recallLoan, dailyPack, takePack, skipPack, packCat, isPackDay, daily, seasonEnd, abroadOffer };
})();
