// ===== TREINEIROS v3 · notícias e eventos =====
const EVENTS = (() => {
  const C = CORE, Wd = WORLD;
  const { R, hash, clamp, fmt } = C;
  const { P, ps, squad, age, view } = Wd;
  let NID = 0;

  function news(S, item) {
    let fd = null; try { fd = Math.floor(SEASON.fdAt(S, S._nt || SEASON.now(S)) + 1e-6); } catch (e) {}
    const n = { id: `${S.season}-${S.lastDay}-${(NID++) % 100000}-${Math.random().toString(36).slice(2, 8)}`, s: S.season, d: S.lastDay, k: S.slot, fd, ...item };
    S.news.unshift(n);
    if (S.news.length > 220) S.news.length = 220;
    // notificação de menções (imprensa): você, seu clube, seus jogadores
    if ((n.t === 'press' || n.t === 'event') && S.desks) {
      const origin = item.self ? S.__me : null, txt = `${n.title} ${n.body || ''}`;
      for (const tok in S.desks) {
        const dk = S.desks[tok]; if (!dk || dk.unemployed || tok === origin) continue;
        const mineP = (n.ids || []).find(id => id && Wd.ownerOf(S, id) === dk.club);
        const why = (dk.manager && txt.includes(dk.manager)) || (n.coachIds || []).includes(tok) ? 'Você foi citado'
          : mineP ? `Sobre ${P[mineP] ? P[mineP].short : 'seu jogador'}` : n.t !== 'coach' && (n.clubs || []).includes(dk.club) ? `Sobre o ${dk.club}` : null;
        if (!why) continue;
        dk.mentions = [{ id: n.id, t: n.title, b: n.body || '', w: why, read: false }, ...(dk.mentions || [])].slice(0, 30);
      }
    }
    return n;
  }
  const nm = id => P[id] ? P[id].short : '?';
  // ---------- crônica do jogo em linguagem natural ----------
  const FEM = new Set(['Chapecoense', 'Ponte Preta', 'Juventude', 'LDU Quito', 'Universidad de Chile']);
  const art = c => (FEM.has(c) ? 'a ' : 'o ') + c;
  function narrate(S, f, res, full) {
    const r = R(`nar${S.season}${S.slot}${f.h}${f.a}`);
    const H = f.h, A = f.a, gh = res.gh, ga = res.ga;
    const goals = res.ev.filter(e => e.t === 'goal');
    const name = (s) => s === 'h' ? H : A;
    // placar a cada gol e viradas
    let sh = 0, sa = 0, trailH = false, trailA = false;
    const steps = goals.map(g => { const before = [sh, sa]; g.s === 'h' ? sh++ : sa++; if (sh < sa) trailH = true; if (sa < sh) trailA = true; return { g, before, after: [sh, sa] }; });
    const winS = gh > ga ? 'h' : gh < ga ? 'a' : null;
    const W = winS && name(winS), L = winS && name(winS === 'h' ? 'a' : 'h');
    const w = Math.max(gh, ga), l = Math.min(gh, ga), margin = w - l;
    const virada = winS && (winS === 'h' ? trailH : trailA);
    const last = steps[steps.length - 1];
    const lastMin = last ? parseInt(last.g.m) + (String(last.g.m).includes('+') ? 5 : 0) : 0;
    const late = last && lastMin >= 85;
    const derby = C.isDerby(H, A);
    const pens = res.pens ? (res.pens[0] > res.pens[1] ? H : A) : null;
    const verbs = ['vence', 'bate', 'derrota', 'supera'];
    let title;
    if (!winS && pens) title = `${pens} ${f.comp === 'SC' || (f.comp === 'CB' && f.leg === 2) || f.stage === 3 ? 'é campeão' : 'avança'} nos pênaltis contra ${pens === H ? art(A) : art(H)}`;
    else if (!winS && gh === 0) title = C.pick([`${H} e ${A} ficam no 0 a 0`, `Sem gols entre ${H} e ${A}`], r);
    else if (!winS && late && last.after[0] === last.after[1]) title = `${name(last.g.s)} arranca o empate no fim contra ${art(name(last.g.s === 'h' ? 'a' : 'h'))}`;
    else if (!winS) title = `${H} e ${A} empatam em ${gh} a ${ga}`;
    else if (margin >= 3) title = C.pick([`${W} atropela ${art(L)}: ${w} a ${l}`, `Goleada: ${W} faz ${w} a ${l} n${art(L).slice(0, 1) === 'o' ? 'o' : 'a'} ${L}`], r);
    else if (virada) title = `${W} vira pra cima d${art(L).slice(0, 1)} ${L} e vence por ${w} a ${l}`;
    else if (late && margin === 1) title = `${W} vence ${art(L)} no fim com gol de ${P[last.g.p] ? P[last.g.p].short : '?'}`;
    else if (derby) title = `${W} leva a melhor no clássico contra ${art(L)}`;
    else title = `${W} ${C.pick(verbs, r)} ${art(L)} por ${w} a ${l}`;
    if (!full) return { title, body: goals.length ? `Gols: ${goals.map(g => `${nm(g.p)} (${g.m}')`).join(', ')}.` : '' };
    // resumo curto: quem marcou, expulsões e o destaque
    const nmP = id => P[id] ? P[id].short : '?';
    const TIMES = ['', '', 'duas vezes', 'três vezes', 'quatro vezes'];
    const scorers = side => {
      const c = new Map(); for (const g of goals) if (g.s === side) c.set(g.p, (c.get(g.p) || 0) + 1);
      const arr = [...c].map(([id, n]) => n > 1 ? `${nmP(id)} (${TIMES[n] || n + ' vezes'})` : nmP(id));
      return { txt: arr.length > 1 ? arr.slice(0, -1).join(', ') + ' e ' + arr[arr.length - 1] : arr[0] || '', many: arr.length > 1 };
    };
    const parts = [];
    if (winS) {
      const ws = scorers(winS), ls = scorers(winS === 'h' ? 'a' : 'h');
      parts.push(`${ws.txt} ${ws.many ? 'marcaram' : 'marcou'}${ls.txt ? `; ${ls.txt} ${ls.many ? 'descontaram' : 'descontou'}` : ''}.`);
    } else if (goals.length) {
      const hs = scorers('h'), as = scorers('a');
      parts.push(`${hs.txt} ${hs.many ? 'marcaram' : 'marcou'} pr${art(H).slice(0, 1)} ${H}; ${as.txt} pr${art(A).slice(0, 1)} ${A}.`);
    } else parts.push(C.pick(['Jogo truncado, com poucas chances.', 'Faltou pontaria dos dois lados.', 'Os goleiros foram os destaques.'], r));
    const reds = res.ev.filter(e => e.t === 'red' || e.t === 'red2');
    if (reds.length) parts.push(reds.length === 1 ? `${nmP(reds[0].p)} foi expulso aos ${String(reds[0].m).split('+')[0]}'.` : `${reds.length} expulsões no jogo.`);
    if (res.mom && P[res.mom]) parts.push(`Destaque: ${P[res.mom].short}, nota ${res.pl[res.mom].rt.toFixed(1)}.`);
    if (pens) parts.push(`Nos pênaltis, ${Math.max(...res.pens)} a ${Math.min(...res.pens)}.`);
    return { title, body: parts.join(' ') };
  }
  function matchNews(S, f, res, result) {
    const user = Wd.isHuman(S, f.h) || Wd.isHuman(S, f.a);
    const comp = SEASON.COMP_NAME[f.comp];
    const score = `${f.h} ${res.gh} × ${res.ga} ${f.a}${res.pens ? ` (${res.pens[0]}–${res.pens[1]} pên.)` : ''}`;
    const goals = res.ev.filter(e => e.t === 'goal');
    const hat = Object.entries(res.pl).filter(([, x]) => x.g >= 3).map(([id]) => +id);
    const derby = C.isDerby(f.h, f.a);
    if (user) {
      const n = narrate(S, f, res, true);
      news(S, { t: 'match', title: n.title, body: `${comp}. ${n.body}`, ids: [res.mom, ...goals.map(e => e.p), ...goals.map(e => e.a)].filter(Boolean), clubs: [f.h, f.a], user: true,
        front: 60 + (derby ? 15 : 0) + Math.abs(res.gh - res.ga) * 3 + (f.ko ? 8 : 0), score: [f.h, res.gh, res.ga, f.a], mom: res.mom });
    } else {
      const margin = Math.abs(res.gh - res.ga);
      const br = SEASON.isBR(S, f.h) || SEASON.isBR(S, f.a);
      const notable = derby || margin >= 3 || hat.length || (['LIB', 'SUL', 'CONF', 'CB'].includes(f.comp) && br && (f.ko || f.comp === 'LIB')) || (['NE', 'SSE', 'VER'].includes(f.comp) && br && f.ko && f.stage >= 2) || f.comp === 'PL' || f.comp === 'SC';
      if (notable && br) { const n = narrate(S, f, res, false); news(S, { t: 'match', title: n.title, body: `${comp}. ${n.body}`, ids: goals.map(e => e.p), clubs: [f.h, f.a], minor: f.comp === 'B' || f.comp === 'C' }); }
    }
    highlights(S, f, res, user, score);
    // alfinetada depois do clássico
    if (derby && res.gh !== res.ga) {
      const ws = res.gh > res.ga ? 'h' : 'a', win = ws === 'h' ? f.h : f.a, lose = ws === 'h' ? f.a : f.h;
      const cands = Object.entries(res.pl).filter(([, x]) => x.side === ws).sort((a, b) => (b[1].g * 2 + b[1].rt) - (a[1].g * 2 + a[1].rt));
      const r = R(`jab${S.season}${S.slot}${win}`);
      if (cands.length && r() < (user ? 0.85 : 0.35)) {
        const id = +cands[0][0];
        const q = C.pick([`A cidade tem dono.`, `Falaram muito a semana toda. Em campo a conversa foi outra.`, `Freguês é freguês, né?`, `Manda um abraço pra torcida do ${lose}.`, `Clássico não se joga, se ganha.`], r);
        news(S, { t: 'press', title: `${P[id].short} alfineta o ${lose}: "${q}"`, body: `Depois da vitória do ${win} no clássico, ${P[id].name} provocou o rival na saída do campo.`, ids: [id], clubs: [win, lose], front: user ? 82 : 50, minor: !user });
        if (Wd.isHuman(S, lose)) for (const pid of squad(S, lose)) ps(S, pid).mor = clamp(ps(S, pid).mor - 2, 0, 100);
      }
    }
  }
  // ---------- destaques individuais: hat-trick, poker, nota alta, paredão, expulsão decisiva ----------
  function highlights(S, f, res, user, score) {
    const out = [], cl = s => s === 'h' ? f.h : f.a, op = s => s === 'h' ? f.a : f.h;
    const r = R(`hl${S.season}${S.slot}${f.h}${f.a}`), nt = x => Math.min(10, x.rt).toFixed(1).replace('.', ',');
    for (const [idS, x] of Object.entries(res.pl)) {
      const id = +idS; if (!P[id]) continue;
      const c = cl(x.side), o = op(x.side), N = P[id].name, sh = P[id].short;
      if (x.g >= 3) {
        const T = x.g >= 5 ? [`Manita! ${N} marca cinco vezes`, `${sh} faz cinco e entra para a história do ${c}`]
          : x.g === 4 ? [`Poker de ${N}: quatro gols contra o ${o}`, `${sh} faz quatro e atropela o ${o}`]
          : [`Hat-trick de ${N}`, `${sh} faz três e decide para o ${c}`, `Noite de ${sh}: hat-trick contra o ${o}`];
        out.push({ sc: 90 + x.g * 12, kick: x.g >= 5 ? 'Manita' : x.g === 4 ? 'Poker' : 'Hat-trick', title: C.pick(T, r), body: `${x.g} gols em ${score}. Nota ${nt(x)}.`, id, c, o });
      } else if (P[id].pos === 'GOL' && x.min >= 80 && (x.sv >= 7 || (x.sv >= 5 && x.rt >= 8.8))) {
        out.push({ sc: 62 + x.sv * 3 + (x.rt >= 9 ? 12 : 0), kick: 'Paredão', title: C.pick([`Paredão: ${sh} faz ${x.sv} defesas e segura o ${c}`, `${sh} fecha o gol contra o ${o}`, `Noite de milagres: ${sh} para o ${o}`], r), body: `${x.sv} defesas em ${score}. Nota ${nt(x)}.`, id, c, o });
      } else if (x.rt >= 9 && x.min >= 60) {
        out.push({ sc: 58 + Math.round((x.rt - 9) * 20) + x.g * 6 + x.a * 4, kick: 'Craque do jogo', title: C.pick([`Show de ${sh}: nota ${nt(x)} contra o ${o}`, `${sh} brilha e comanda o ${c}`, `${N} dá espetáculo em ${score}`], r), body: `${x.g ? `${x.g} gol${x.g > 1 ? 's' : ''}` : ''}${x.g && x.a ? ' e ' : ''}${x.a ? `${x.a} assistência${x.a > 1 ? 's' : ''}` : ''}${x.g || x.a ? '. ' : ''}Nota ${nt(x)}.`, id, c, o });
      }
    }
    // expulsão que custou o jogo (antes dos 75')
    for (const e of res.ev || []) {
      if (e.t !== 'red' && e.t !== 'red2') continue;
      const m = parseInt(String(e.m), 10); if (!(m <= 75) || !P[e.p]) continue;
      const my = e.s === 'h' ? res.gh : res.ga, ot = e.s === 'h' ? res.ga : res.gh; if (my >= ot) continue;
      const c = cl(e.s), o = op(e.s), sh = P[e.p].short;
      out.push({ sc: 60 + (my + 1 === ot ? 10 : 0), kick: 'Expulsão', title: C.pick([`Expulsão de ${sh} custa caro ao ${c}`, `${sh} vê o vermelho e o ${c} perde para o ${o}`, `Vilão: ${sh} é expulso e complica o ${c}`], r), body: `Vermelho ${m <= 45 ? 'ainda no primeiro tempo' : `aos ${m} minutos`}. Com um a menos, o ${c} não segurou: ${score}.`, id: e.p, c, o });
    }
    out.sort((a, b) => b.sc - a.sc);
    const br = x => SEASON.isBR(S, x.c) || SEASON.isBR(S, x.o);
    let keep = user ? out.filter(x => Wd.isHuman(S, x.c) || Wd.isHuman(S, x.o) || x.sc >= 100) : out.filter(br).filter(x => x.sc >= 100 || (x.sc >= 70 && ['A', 'LIB', 'CB'].includes(f.comp))).slice(0, 1);
    // jogos sem treinador: no máximo 3 destaques por rodada (hat-trick ou mais sempre entra)
    if (!user) { const tag = `${S.season}-${S.slot}`; if (S._hl !== tag) { S._hl = tag; S._hln = 0; } keep = keep.filter(x => x.sc >= 100 || S._hln < 3); S._hln += keep.length; }
    for (const x of keep) news(S, { t: 'match', tag: 'star', kick: x.kick, title: x.title, body: x.body, ids: [x.id], clubs: [x.c, x.o], front: x.sc + (user ? 10 : 0), minor: !user && (f.comp === 'B' || f.comp === 'C') && x.sc < 100 });
  }
  // ---------- rumores de mercado: todo dia do calendário tem movimento nas redações ----------
  let rumCache = null;
  function rumorPool(S) {
    if (rumCache && rumCache.s === S.season && rumCache.seed === S.seed) return rumCache.ids;
    const ids = [];
    for (const k of Wd.nonYouth()) { const p = P[k]; if (p.gen) continue; const o = Wd.ownerOf(S, k); if (!o || o === 'Aposentado') continue; if ((S.ps[k] ? S.ps[k].ovr : p.ovr0) >= 76) ids.push(k); }
    rumCache = { s: S.season, seed: S.seed, ids }; return ids;
  }
  const strC = {};
  function plausible(S, id, c) {
    try {
      const v = view(S, id), MK = typeof MARKET !== 'undefined' ? MARKET : null;
      if (MK && MK.interest(S, id, c) < 45) return false;                                 // o jogador não aceitaria
      if ((S.cash[c] || 0) < v.mv * 0.8) return false;                                     // o clube não tem como pagar
      const key = `${S.season}|${S.slot}|${c}`, st = strC[key] ?? (strC[key] = SEASON.strength(S, c));
      return v.ovr <= st + 9;                                                              // craque muito acima do elenco não faz sentido
    } catch (e) { return false; }
  }
  function rumors(S, fd) {
    const r = R(`rum${S.seed}${S.season}${fd}`), pool = rumorPool(S), clubs = Wd.brClubs(S).filter(c => !Wd.isHuman(S, c));
    if (!pool.length || !clubs.length) return;
    const n = 1 + (r() < 0.45 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      // o rumor precisa ser plausível: mesmas regras que valem pra um treinador (o jogador toparia ir, o clube tem
      // dinheiro pra chegar perto do valor e o nível do jogador cabe no time)
      let id = null, o = null, c = null;
      for (let t = 0; t < 40 && c == null; t++) {
        const x = pool[Math.floor(r() * pool.length)], ox = Wd.ownerOf(S, x); if (!ox || ox === 'Aposentado' || Wd.isHuman(S, ox)) continue;
        const cand = clubs.filter(k => k !== ox); if (!cand.length) continue;
        const k = cand[Math.floor(r() * cand.length)];
        if (plausible(S, x, k)) { id = x; o = ox; c = k; }
      }
      if (c == null) continue;
      const v = view(S, id), cat = C.catOf(v.ovr), carta = `carta ${cat.name}`, pos = C.POS_NAME[P[id].pos] || P[id].pos, oo = o === 'Livre' ? 'sem clube' : `do ${o}`;
      const sh = P[id].short, val = C.fmt(Math.round(v.mv / 1000) * 1000), own = o === 'Livre' ? 'o estafe do jogador' : `o ${o}`;
      const T = [
        [`${c} observa situação de ${sh}`, `${pos}, ${age(S, id)} anos, overall ${v.ovr} (${carta}). Por enquanto, só monitoramento.`],
        [`${c} monitora ${sh} de perto`, `O ${pos} ${oo} (overall ${v.ovr}) está na lista curta do clube.`],
        [`${sh} está na lista do ${c}`, `Nome aprovado pela comissão técnica. ${carta[0].toUpperCase() + carta.slice(1)}, overall ${v.ovr}.`],
        [`Contatos iniciais entre ${c} e o estafe de ${sh}`, `Primeiras conversas sobre salário e tempo de contrato. Nada avançado ainda.`],
        [`${c} consulta condições de ${sh}`, `O clube quer saber quanto ${own} pede pelo ${pos} (overall ${v.ovr}).`],
        [`Conversas avançam entre ${c} e ${o === 'Livre' ? 'o estafe' : o} por ${sh}`, `Negociação em andamento, sem acordo ainda. Valor de mercado de T$ ${val}.`],
        [`${c} prepara proposta por ${sh}`, `A oferta deve ser apresentada nos próximos dias. ${pos}, overall ${v.ovr} (${carta}).`],
        [o === 'Livre' ? `${sh}, livre no mercado, é oferecido ao ${c}` : `${o} recusa primeira oferta do ${c} por ${sh}`, o === 'Livre' ? `Sem clube, o ${pos} (overall ${v.ovr}) procura um projeto. O ${c} avalia.` : `O ${o} só negocia pelo valor cheio. O ${c} estuda uma nova proposta.`],
        [`${sh} aprova a ideia de jogar no ${c}`, `Sinal verde do jogador. Agora o ${c} precisa chegar a um acordo com ${own}.`],
      ];
      const [title, body] = C.pick(T, r);
      news(S, { id: `rum-${S.season}-${fd}-${i}`, t: 'transfer', tag: 'rumor', by: 'fab', kick: 'Fabrizio Otomano', title, body, ids: [id], clubs: [c, o === 'Livre' ? null : o].filter(Boolean), front: 38 + Math.max(0, v.ovr - 76) * 3, fd });
    }
  }
  // ---------- especulação: jogadores da sua lista de observação viram assunto (nem sempre) ----------
  // observação (só no radar) · interesse (conversa aberta com o clube) · proposta (oferta feita de verdade)
  function watchRumors(S, fd) {
    Wd.forDesks(S, () => {
      if (S.unemployed || !S.watch || !S.watch.length) return;
      const r = R(`wr${S.seed}${S.season}${fd}${S.__me}`); S.rum = S.rum || {};
      const MK = typeof MARKET !== 'undefined' ? MARKET : null;
      if (r() > 0.1) return;   // em média uma especulação a cada ~10 dias por treinador (e só se tiver alguém interessante na lista)
      const ids = S.watch.slice().sort(() => r() - 0.5);
      for (const id of ids) {
        const o = Wd.ownerOf(S, id); if (!P[id] || !o || o === S.club || o === 'Aposentado') continue;
        const last = S.rum[id], lfd = last == null ? null : typeof last === 'object' ? last.fd : last; if (lfd != null && fd - lfd < 25) continue;
        const v = view(S, id); if (v.ovr < 66 && v.pot < 80) continue;
        // proposta = oferta feita de verdade; senão a imprensa escala: primeiro observação, depois interesse
        const prop = (S.outOffers || []).some(x => x.id === id) || !!(MK && MK.negState(S, id));
        const stage = prop ? 'proposta' : last && last.st && last.st !== 'observacao' ? 'interesse' : last && last.st === 'observacao' ? 'interesse' : 'observacao';
        if (r() > (stage === 'proposta' ? 0.9 : stage === 'interesse' ? 0.6 : 0.5)) continue;
        const c = S.club, sh = P[id].short, oo = o === 'Livre' ? 'sem clube' : `do ${o}`, pos = C.POS_NAME[P[id].pos] || P[id].pos;
        const T = {
          observacao: [[`${c} observa situação de ${sh}`, `O nome do ${pos} (overall ${v.ovr}) aparece nos relatórios do clube. Não há conversa com o ${o === 'Livre' ? 'estafe do jogador' : o}.`], [`${sh}, ${oo}, está no radar do ${c}`, `Por enquanto é só observação: o departamento de análise acompanha o ${pos} de ${age(S, id)} anos. Nada de contato oficial.`],
            [`${c} monitora ${sh}`, `O nome do ${pos} (overall ${v.ovr}) aparece nos relatórios do clube. Não há conversa com o ${o === 'Livre' ? 'estafe do jogador' : o}.`]],
          interesse: [[`${c} demonstra interesse em ${sh}`, `A diretoria já consultou a situação do ${pos} ${oo}. Ainda não houve proposta formal.`],
            [`${c} pergunta por ${sh} e o ${o === 'Livre' ? 'empresário' : o} escuta`, `Conversa inicial sobre valores e condições. Proposta oficial, só se o interesse avançar.`]],
          proposta: [[`${c} apresenta proposta formal por ${sh}`, `Oferta oficial na mesa ${o === 'Livre' ? 'do jogador' : `do ${o}`}. A imprensa já trata a negociação como avançada.`],
            [`Negociação quente: ${c} e ${o === 'Livre' ? sh : o} discutem valores`, `Houve proposta formal pelo ${pos}. Os dois lados ainda não chegaram a um acordo.`]],
        }[stage];
        const [title, body] = C.pick(T, r);
        S.rum[id] = { fd, st: stage };
        const s = ps(S, id); s.rum = { c, fd, st: stage };
        if (stage !== 'observacao' && o !== 'Livre' && SEASON.isBR && SEASON.isBR(S, o)) s.mor = clamp(s.mor - 2, 0, 100);   // balançado com a especulação
        news(S, { id: `rumw-${S.season}-${fd}-${id}`, t: 'transfer', tag: 'rumor', by: 'fab', kick: stage === 'proposta' ? 'Proposta' : stage === 'interesse' ? 'Interesse' : 'Especulação', title, body, ids: [id], clubs: [c, o === 'Livre' ? null : o].filter(Boolean), front: 44 + (stage === 'proposta' ? 20 : stage === 'interesse' ? 10 : 0) + Math.max(0, v.ovr - 74) * 2, fd });
        break;   // no máximo uma por treinador por dia
      }
      for (const k in S.rum) { const x = S.rum[k], xf = typeof x === 'object' ? x.fd : x; if (fd - xf > 90) delete S.rum[k]; }
    });
  }
  // ---------- Fabrizio Otomano: HERE WE GO nas negociações concluídas de jogadores Ouro e Diamante ----------
  function hwg(S, id, from, to, fee, t) {
    try {
      if (!P[id] || !to || to === 'Livre' || to === 'Aposentado' || from === to) return;
      const br = c => !!Wd.divOf(S, c); if (!br(to) && !br(from)) return;
      const v = view(S, id); if (v.ovr < 78) return;
      const cat = C.catOf(v.ovr).name, loan = t === 'emprestimo', free = t === 'livre' || from === 'Livre' || !from;
      const body = loan ? `Empréstimo acertado com o ${from}. ${P[id].short} (${cat}, overall ${v.ovr}) já se apresenta ao ${to}.`
        : free ? `Chega sem custo de transferência. ${cat}, overall ${v.ovr}. Contrato assinado, exames feitos.`
        : `Acordo total com o ${from}: T$ ${C.fmt(fee || 0)}. ${cat}, overall ${v.ovr}. Documentos assinados, exames marcados.`;
      news(S, { t: 'transfer', tag: 'hwg', by: 'fab', kick: 'HERE WE GO', title: `HERE WE GO! ${P[id].name}${loan ? ' emprestado ao' : ' no'} ${to}`, body, ids: [id], clubs: [to, br(from) ? from : null].filter(Boolean), front: 70 + (v.ovr >= 85 ? 40 : 15) });
    } catch (e) {}
  }
  function fdTick(S) {
    let cur; try { cur = Math.floor(SEASON.fdAt(S, SEASON.now(S)) + 1e-6); } catch (e) { return; }
    if (S.fdSeen == null || S.fdSeenS !== S.season || S.fdSeen > cur) { S.fdSeen = cur - 1; S.fdSeenS = S.season; }
    try { TRAIN.ptTick(S); } catch (e) { SEASON.oops && SEASON.oops(S, 'treino individual', e); }   // treino individual: confere sempre (não só na virada do dia)
    if (cur <= S.fdSeen) return;
    for (let d = Math.max(S.fdSeen + 1, cur - 2); d <= cur; d++) { try { rumors(S, d); } catch (e) { SEASON.oops && SEASON.oops(S, 'rumores', e); } try { watchRumors(S, d); } catch (e) { SEASON.oops && SEASON.oops(S, 'especulação', e); } }
    S.fdSeen = cur;
    // rumores velhos saem da pilha (não empurram notícia importante pra fora)
    S.news = S.news.filter(x => x.tag !== 'rumor' || x.s !== S.season || (x.fd != null && cur - x.fd <= 6));
  }
  function injuryNews(S, id, n, txt, club) {
    if (!Wd.isHuman(S, club) && view(S, id).ovr < 78) return;
    news(S, { t: 'injury', title: `${P[id].short} (${club}) se lesiona`, body: `${txt}. Desfalque por ${n} jogo${n > 1 ? 's' : ''}.`, ids: [id], clubs: [club] });
  }

  // ---------- convocações ----------
  // Seleção Brasileira: monta a estrutura do elenco primeiro (quantos por posição) e só depois escolhe os nomes
  const SEL_SHAPE = [['Goleiros', ['GOL'], 3], ['Laterais-direitos', ['LD'], 2], ['Laterais-esquerdos', ['LE'], 2], ['Zagueiros', ['ZAG'], 4],
    ['Volantes', ['VOL'], 3], ['Meias', ['MC', 'MEI', 'ME', 'MD'], 4], ['Pontas', ['PE', 'PD', 'SA'], 4], ['Centroavantes', ['CA'], 4]];
  function selecao(S, k, awayN = 2) {
    const r = R(`sel${S.seed}${S.season}${k}`);
    const prev = (S.selecao || [])[0], prevIds = new Set(prev ? prev.list.map(x => x.id) : []);
    const everIds = new Set((S.selecao || []).flatMap(c => c.list.map(x => x.id)));
    const all = Object.keys(P).map(Number).filter(id => P[id].nat === 'BRA' && !P[id].youth && !P[id].gen);
    const own = id => Wd.ownerOf(S, id);
    const cand = all.filter(id => { const o = own(id); if (!o || o === 'Aposentado' || o === 'Livre') return false; const v = view(S, id); return v.inj <= 0 && age(S, id) <= 37 && v.ovr >= 70; });
    const lt = id => { const o = own(id); return S.divA.includes(o) ? 2.5 : S.divB.includes(o) ? 1.5 : Wd.divOf(S, o) === 'C' ? 1 : (C.LEAGUE_TIER[P[id].liga] ?? 2); };
    const score = id => {
      const v = view(S, id), br = !!Wd.divOf(S, own(id));
      const form = br && v.stl && v.stl.j >= 3 ? (v.form - 6.5) * 4 : 0;          // fase recente (só medida no Brasil)
      const mins = br && v.stl ? Math.min(3, (v.stl.j || 0) / 4) - (v.benchRun >= 3 ? 2 : 0) : 0;   // minutos/importância no clube
      return v.ovr + form + mins + (lt(id) - 3) * 0.8 + (prevIds.has(id) ? 1.5 : 0) + (age(S, id) >= 34 ? -2 : 0) + (r() - 0.5) * 3;
    };
    const picked = [], clubCount = {}, taken = new Set(), out = [];
    for (const [grp, pos, n] of SEL_SHAPE) {
      const pool = cand.filter(id => pos.includes(P[id].pos) && !taken.has(id)).map(id => ({ id, s: score(id) })).sort((a, b) => b.s - a.s);
      const got = [];
      for (const x of pool) {
        if (got.length >= n) break;
        const c = own(x.id), sameClubPos = got.filter(y => own(y) === c).length;
        // mesmo clube na mesma posição (ex.: três centroavantes do mesmo time) só se a diferença for grande
        if (sameClubPos >= 1 && pool.find(y => !got.includes(y.id) && y.id !== x.id && own(y.id) !== c && y.s >= x.s - 4)) continue;
        if ((clubCount[c] || 0) >= 5) continue;
        got.push(x.id); clubCount[c] = (clubCount[c] || 0) + 1; taken.add(x.id);
      }
      for (const id of got) out.push({ id, g: grp, c: own(id), ovr: view(S, id).ovr });
    }
    const key = `${S.season}-${k}`;
    S.selecao = [{ key, season: S.season, k, list: out }, ...(S.selecao || [])].slice(0, 6);
    for (const x of out) { if (!!Wd.divOf(S, x.c)) { ps(S, x.id).away = awayN; picked.push(x.id); } }
    // o que é notícia: estreias, grandes ausências, clube com vários convocados, veterano de volta
    const title = `Seleção Brasileira: ${out.length} convocados para a Data FIFA`;
    const byClub = {}; for (const x of out) byClub[x.c] = (byClub[x.c] || 0) + 1;
    const topClub = Object.entries(byClub).sort((a, b) => b[1] - a[1])[0];
    const firsts = out.filter(x => !everIds.has(x.id) && (!!Wd.divOf(S, x.c)) && view(S, x.id).ovr >= 74);
    const star = all.filter(id => !taken.has(id) && view(S, id).inj <= 0 && own(id) && own(id) !== 'Aposentado').sort((a, b) => view(S, b).ovr - view(S, a).ovr)[0];
    const vets = out.filter(x => age(S, x.id) >= 33 && !prevIds.has(x.id) && prev);
    news(S, { t: 'callup', callup: key, front: 92, title, body: `Lista com ${out.filter(x => x.g === 'Goleiros').length} goleiros, ${out.filter(x => ['Laterais-direitos', 'Laterais-esquerdos', 'Zagueiros'].includes(x.g)).length} defensores, ${out.filter(x => ['Volantes', 'Meias'].includes(x.g)).length} meio-campistas e ${out.filter(x => ['Pontas', 'Centroavantes'].includes(x.g)).length} atacantes.${topClub && topClub[1] >= 3 ? ` O ${topClub[0]} é o clube com mais nomes (${topClub[1]}).` : ''}`, ids: out.slice(0, 6).map(x => x.id), clubs: [] });
    for (const x of firsts.slice(0, 3)) news(S, { t: 'callup', callup: key, title: `${P[x.id].name} é convocado pela primeira vez para a Seleção`, body: `O jogador do ${x.c} vive a melhor fase e ganha a chance.`, ids: [x.id], clubs: [x.c] });
    if (star && view(S, star).ovr >= 82) news(S, { t: 'callup', callup: key, title: `${P[star].name} fica fora da lista da Seleção`, body: `Ausência de peso: o técnico preferiu outras opções para a posição.`, ids: [star], clubs: [own(star)].filter(c => !!Wd.divOf(S, c)) });
    if (topClub && topClub[1] >= 4) news(S, { t: 'callup', callup: key, title: `${topClub[0]} tem ${topClub[1]} convocados na Seleção`, body: 'Reconhecimento ao bom momento do elenco.', clubs: [topClub[0]] });
    for (const x of vets.slice(0, 1)) news(S, { t: 'callup', callup: key, title: `Aos ${age(S, x.id)} anos, ${P[x.id].name} volta à Seleção`, body: `Experiência do veterano do ${x.c} pesou na escolha.`, ids: [x.id], clubs: [x.c] });
    return picked;
  }
  function callups(S, k, awayN = 2) {
    const r = R(`call${S.seed}${S.season}${k}`);
    const brazil = selecao(S, k, awayN);
    const NAT = { ARG: [2, 75], URU: [2, 74], COL: [2, 74], PAR: [1, 73], CHI: [1, 73], EQU: [1, 73], VEN: [1, 72], PER: [1, 72], BOL: [1, 70] };
    const picked = [];
    for (const [nat, [n, min]] of Object.entries(NAT)) {
      const pool = Wd.brClubs(S).flatMap(c => squad(S, c)).filter(id => P[id].nat === nat && view(S, id).ovr >= min && view(S, id).form >= 6.7 && view(S, id).inj <= 0)
        .sort((a, b) => (view(S, b).ovr + view(S, b).form * 3) - (view(S, a).ovr + view(S, a).form * 3));
      let took = 0;
      for (const id of pool) { if (took >= n) break; if (r() < 0.65) { ps(S, id).away = awayN; picked.push(id); took++; } }
    }
    { const ent = (S.selecao || []).find(c => c.key === `${S.season}-${k}`); if (ent) ent.ext = picked.filter(id => P[id].nat !== 'BRA').map(id => ({ id, c: Wd.ownerOf(S, id), nat: P[id].nat, ovr: view(S, id).ovr })); }   // estrangeiros dos clubes brasileiros
    // v204: convocação durante o "romper o teto" conta como um jogo com nota 7,0 (vs. time): reconhece o mérito em vez de tirar jogos dele
    for (const id of [...brazil, ...picked]) {
      const s = S.ps[id]; if (!s || !s.romp || s.romp.s !== S.season) continue;
      s.romp.cu = [...(s.romp.cu || []), s.romp.rt.length]; s.romp.rt.push(7);
      const c = Wd.ownerOf(S, id);
      if (Wd.isHuman(S, c)) Wd.asClub(S, c, () => news(S, { t: 'club', kick: 'Treino', title: `Convocação de ${P[id].short} conta pro romper o teto`, body: `Chamado pra Data FIFA no meio da tentativa: vale como um jogo com nota 7,0 na média.`, ids: [id], clubs: [c], desk: S.__me, front: 80 }));
    }
    const mineBR = brazil.filter(id => Wd.isHuman(S, Wd.ownerOf(S, id)));
    for (const id of mineBR) ps(S, id).mor = clamp(ps(S, id).mor + 10, 0, 100);
    if (!picked.length) return;
    const mine = picked.filter(id => Wd.isHuman(S, Wd.ownerOf(S, id)));
    news(S, { t: 'callup', minor: true, title: `Data FIFA: ${picked.length} estrangeiros de clubes brasileiros convocados`, body: `${mine.length ? `De clubes dos treinadores: ${mine.map(id => `${P[id].name} (${Wd.ownerOf(S, id)})`).join(', ')}, fora por até 2 jogos. ` : ''}Lista: ${picked.map(id => `${P[id].short} (${Wd.ownerOf(S, id)}, ${P[id].nat})`).join(', ')}.`, ids: picked, clubs: [S.club] });
    for (const id of mine) ps(S, id).mor = clamp(ps(S, id).mor + 8, 0, 100);
  }

  // ---------- eventos diários ----------
  function daily(S, d) {
    const r = R(`ev${S.seed}${d}`);
    const clubs = Wd.brClubs(S);
    S.events = S.events || {};
    roll(S, d, r, clubs, 'indisc'); roll(S, d, r, clubs, 'poker');
    rareEvents(S, d, r, clubs);
    comicEvents(S, d, r, clubs);
    mutiny(S, d, r);
    calendarGripe(S, d, r, clubs);
    retirements(S, d, r);
    // STJD: julga as denúncias por falas contra árbitros
    for (const cs of (S.stjd || []).filter(x => x.at <= d)) {
      if (r() < 0.2) news(S, { t: 'fin', tag: 'stjd', title: `STJD absolve ${cs.man} por falas contra ${cs.ref}`, body: 'O tribunal entendeu que a declaração, embora dura, ficou no campo da crítica.', clubs: [cs.club] });
      else { if (S.cash[cs.club] !== undefined) S.cash[cs.club] -= cs.amount; news(S, { t: 'fin', tag: 'stjd', front: 84, title: `STJD multa o ${cs.club} em T$ ${fmt(cs.amount)} por falas de ${cs.man}`, body: `Punição pelas declarações contra o árbitro ${cs.ref}. O valor sai do caixa do clube.`, clubs: [cs.club] }); }
    }
    if (S.stjd) S.stjd = S.stjd.filter(x => x.at > d);
    // cobrança na balada depois de atuação ruim
    const lastK = S.slot - 1;
    Wd.forDesks(S, tk => { if (S.unemployed) return;
    if (S.played && S.played[lastK] && !S.events['balada' + S.season + lastK + tk]) {
      S.events['balada' + S.season + lastK + tk] = 1;
      const lm = S.lastMatch && S.lastMatch.k === lastK ? S.lastMatch : null;
      if (lm) {
        const myS = lm.f.h === S.club ? 'h' : 'a', lost = myS === 'h' ? lm.res.gh < lm.res.ga : lm.res.ga < lm.res.gh;
        const bad = Object.entries(lm.res.pl).filter(([, x]) => x.side === myS && x.rt <= 5.2).map(([id]) => +id);
        if (lost && bad.length && r() < 0.05) {
          const id = C.pick(bad, r); ps(S, id).mor = clamp(ps(S, id).mor - 10, 0, 100);
          news(S, { t: 'event', title: `${P[id].short} é cobrado por torcedores em balada`, body: `Depois da derrota e de uma atuação ruim, o jogador foi abordado por um grupo de torcedores organizados. Clima pesado no ${S.club}.`, ids: [id], clubs: [S.club] });
        }
      }
    }
    });
    // invasão no CT depois de 4 derrotas seguidas
    for (const c of clubs) {
      const st = (S.streak || {})[c] || '';
      if (st.endsWith('DDDD') && !S.events[`ct${c}${S.season}${st.length}${d}`] && r() < 0.15) {
        S.events[`ct${c}${S.season}${st.length}${d}`] = 1;
        for (const id of squad(S, c)) ps(S, id).mor = clamp(ps(S, id).mor - 6, 0, 100);
        news(S, { t: 'event', title: `Torcida invade o CT do ${c}`, body: 'Após quatro derrotas seguidas, torcedores cobram elenco e comissão técnica. Treino foi interrompido.', clubs: [c] });
      }
    }
    // protesto leve pra você após 3 derrotas
    Wd.forDesks(S, tk => { if (S.unemployed) return;
    const my = (S.streak || {})[S.club] || '';
    if (my.endsWith('DDD') && !S.events[`prot${S.season}${my.length}${S.slot}${tk}`]) {
      S.events[`prot${S.season}${my.length}${S.slot}${tk}`] = 1;
      for (const id of squad(S, S.club)) ps(S, id).mor = clamp(ps(S, id).mor - 3, 0, 100);
      news(S, { t: 'event', title: `Faixas de protesto na porta do ${S.club}`, body: 'Três derrotas seguidas e a torcida cobra reação. Moral do elenco em queda.', clubs: [S.club] });
    }
    });
    // novo patrocinador master
    // (raro; mais provável pra quem está na zona de rebaixamento e com pouco caixa; no máx. 1 por clube por temporada)
    S.spons = S.spons || {};
    for (const c of clubs) if (r() < sponsP(S, c)) { sponsor(S, d, c); hit(S, 'spons'); }
    // SAF (raríssimo)
    for (const c of clubs) if (!Wd.REAL_SAF.has(c) && !S.saf[c] && r() < 0.0002) { safBuy(S, c); hit(S, 'saf'); }
    // bets proibidas (raríssimo, uma vez por temporada no máximo)
    roll(S, d, r, clubs, 'bets');
    for (const k of ['brutal', 'arabe', 'calote', 'cotas', 'penhora', 'heranca', 'show', 'vaquinha', 'audio']) roll(S, d, r, clubs, k);
    // pedido de aumento (artilheiro/garçom do seu time) e reclamações: por treinador
    Wd.forDesks(S, tk => { if (S.unemployed) return;
    S.flags = S.flags || {};
    if (S.slot >= 20 && !S.flags.raise) {
      const A = Wd.brClubs(S).flatMap(c => squad(S, c)).filter(id => S.ps[id] && S.ps[id].stl);
      const topG = A.slice().sort((a, b) => S.ps[b].stl.g - S.ps[a].stl.g).slice(0, 3);
      const topA = A.slice().sort((a, b) => S.ps[b].stl.a - S.ps[a].stl.a).slice(0, 3);
      const cand = [...new Set([...topG, ...topA])].filter(id => Wd.ownerOf(S, id) === S.club && !S.ps[id].asked);
      if (cand.length && r() < 0.3) {
        const id = cand[0]; S.ps[id].asked = true;
        const sal = Math.round(S.ps[id].sal * 1.3 / 10) * 10;
        const ab = MARKET.abroadOffer(S, id, 1.3 + r() * 0.3);
        S.flags.raise = { id, sal, abroad: ab };
        news(S, { t: 'club', title: `${P[id].short} pede aumento`, body: `Em alta no campeonato, quer T$ ${fmt(sal)}/dia. O ${ab.club} já demonstrou interesse e ofereceu T$ ${fmt(ab.fee)}. Decida no Clube.`, ids: [id], clubs: [S.club], action: 'raise', desk: S.__me });
      }
    }
    // jogador do seu elenco reclama publicamente de falta de chances
    for (const id of squad(S, S.club)) {
      const s = S.ps[id]; if (!s) continue;
      if ((s.benchRun || 0) >= 4 && Wd.avail(S, id) && s.mor < 45 && s.ovr >= 70 && !S.events[`reclama${id}${S.season}`] && r() < 0.25) {
        S.events[`reclama${id}${S.season}`] = 1;
        const q = C.pick([`Quero jogar. Não vim aqui pra ficar no banco.`, `Ninguém me explicou por que não estou jogando.`, `Treino forte todo dia e não tenho oportunidade. Vou conversar com meu empresário.`], r);
        for (const pid of squad(S, S.club)) ps(S, pid).mor = clamp(ps(S, pid).mor - 1, 0, 100);
        news(S, { t: 'press', title: `${P[id].short} reclama de ${S.manager}: "${q}"`, body: `Sem jogar há ${s.benchRun} partidas, o jogador do ${S.club} expôs a insatisfação. Clima pesa no vestiário.`, ids: [id], clubs: [S.club], front: 78 });
      }
    }
    });
    coachJobsTick(S, d);
    // provocação de treinador rival antes de clássico
    Wd.forDesks(S, () => { if (S.unemployed) return;
    const nx = SEASON.nextFixtureOf(S, S.club);
    if (nx && !nx.pending && nx.k - S.slot <= 2) {
      const opp = nx.h === S.club ? nx.a : nx.h;
      if (C.isDerby(S.club, opp) && !S.events[`prov${S.season}${nx.k}`] && r() < 0.5 && S.coaches[opp]) {
        S.events[`prov${S.season}${nx.k}`] = 1;
        const q = C.pick([`Clássico não se joga, se ganha. E vamos ganhar na casa deles.`, `O ${S.club} fala muito. Dentro de campo a conversa é outra.`, `Respeito o ${S.club}, mas nós somos melhores hoje.`], r);
        news(S, { t: 'press', title: `${S.coaches[opp].name} provoca antes do clássico`, body: `"${q}", disse o técnico do ${opp}.`, clubs: [opp, S.club] });
      }
    }
    });
  }

  // ---------- eventos raros (procedurais) ----------
  // Casos graves nunca são atribuídos a jogadores reais: só atingem atletas fictícios (gerados/base).
  const fict = id => P[id] && (P[id].gen || (P[id].youth && !P[id].real));   // v232: garoto real da base não é fictício
  // casos graves: fictícios do elenco ou garotos da base do clube (nunca jogador real)
  function fictOf(S, club, r, pred) { const ids = [...squad(S, club), ...((S.youth && S.youth[club]) || [])].filter(id => fict(id) && (!pred || pred(id))); return ids.length ? C.pick(ids, r) : null; }
  // casos leves: qualquer jogador do elenco (reais incluídos), mais provável entre reservas
  function anyOf(S, club, r) { const ids = squad(S, club).filter(id => !Wd.realMinor(S, id)); if (!ids.length) return null; const w = ids.map(id => 1 + ((view(S, id).benchRun || 0) >= 1 ? 1.5 : 0) + (age(S, id) < 24 ? 0.5 : 0)); return C.pickW(ids, w, r); }
  function smallClub(S, r) {   // clubes menores têm mais peso
    const cl = Wd.brClubs(S), w = cl.map(c => S.divB.includes(c) ? 3 : (S.obj && S.obj[c] && S.obj[c].rank > 12 ? 2 : 1));
    return C.pickW(cl, w, r);
  }
  const reserve = S0 => id => (view(S0, id).benchRun || 0) >= 1 || view(S0, id).ovr < 68;
  function colorName(hex) {
    const n = parseInt(String(hex).slice(1), 16), R_ = n >> 16, G = n >> 8 & 255, B = n & 255;
    if (R_ + G + B < 120) return 'preta'; if (R_ > 220 && G > 220 && B > 220) return 'branca';
    if (G > R_ && G > B) return 'verde'; if (B > R_ && B > G) return R_ > 150 ? 'roxa' : 'azul';
    if (R_ > 200 && G > 170) return 'amarela'; if (R_ > 180 && B > 150) return 'rosa'; return 'vermelha';
  }
  function ban(S, id, n, mor) { const s = ps(S, id); s.ban = Math.max(s.ban || 0, n); if (mor) s.mor = clamp(s.mor - mor, 0, 100); }
  function fine(S, id, club) { const s = ps(S, id), v = Math.round(s.sal * 20 / 100) * 100; if (S.cash[club] !== undefined) S.cash[club] += v; return v; }
  // ---------- eventos aleatórios: definição única (sorteio diário e "modo god" do ADM) ----------
  // run devolve true quando o evento aconteceu (há candidato). O sorteio diário testa p; o ADM dispara direto.
  const EVD = {
    indisc: { n: 'Afastado por indisciplina', p: 0.035, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs, r), id = anyOf(S, c, r); if (!id) return false;
      const s = ps(S, id); s.ban = 3 + Math.floor(r() * 3); s.mor = clamp(s.mor - 15, 0, 100);
      news(S, { t: 'event', title: `${c} afasta ${P[id].name} por indisciplina`, body: `Atraso e discussão com a comissão técnica. Fica fora de ${s.ban} jogos.`, ids: [id], clubs: [c] }); return true; } },
    poker: { n: 'Flagrado em mesa de pôquer', p: 0.02, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs, r), id = anyOf(S, c, r); if (!id) return false;
      ps(S, id).mor = clamp(ps(S, id).mor - 8, 0, 100);
      news(S, { t: 'event', title: `${P[id].short} é flagrado em mesa de pôquer na madrugada`, body: `Imagens circulam nas redes na véspera de jogo do ${c}. O clube diz que vai conversar com o atleta.`, ids: [id], clubs: [c] }); return true; } },
    apostas: { n: 'Esquema de apostas', p: 0.012, run: (S, d, r, clubs, G) => { const c = G ? C.pick(G, r) : smallClub(S, r), id = fictOf(S, c, r, reserve(S));
      if (!id || !once(S, `apo${id}`)) return false; const banned = r() < 0.3;
      if (banned) { Wd.move(S, id, 'Aposentado'); news(S, { t: 'event', title: `${P[id].name} é banido do futebol`, body: `Investigação comprova que o jogador do ${c} forçou cartões amarelos para um esquema de apostas. Banimento definitivo.`, ids: [id], clubs: [c], front: 90 }); }
      else { const n = 12 + Math.floor(r() * 10); ban(S, id, n, 30); news(S, { t: 'event', title: `${P[id].short} (${c}) é suspenso por envolvimento com apostas`, body: `Cartão amarelo suspeito levantou a investigação. Suspensão de ${n} jogos e multa.`, ids: [id], clubs: [c], front: 85 }); }
      for (const x of squad(S, c)) ps(S, x).mor = clamp(ps(S, x).mor - 4, 0, 100); return true; } },
    familia: { n: 'Falta ao jogo por festa de família', p: 0.045, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs, r), id = anyOf(S, c, r); if (!id) return false;
      ban(S, id, 1, 5); const v = fine(S, id, c); news(S, { t: 'event', title: `${P[id].short} falta ao jogo para ir a festa de família`, body: `O ${c} não liberou, mas o jogador viajou mesmo assim. Multa de T$ ${fmt(v)} e fora da próxima partida.`, ids: [id], clubs: [c] }); return true; } },
    viagem: { n: 'Viaja sem autorização', p: 0.015, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs, r), id = anyOf(S, c, r); if (!id) return false;
      ban(S, id, 3, 15); news(S, { t: 'event', title: `${P[id].short} viaja sem autorização e some por dias`, body: `O jogador do ${c} foi para o exterior sem avisar. Fica fora por 3 jogos e o clube estuda punição.`, ids: [id], clubs: [c] }); return true; } },
    foge: { n: 'Foge da concentração', p: 0.025, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs, r), id = anyOf(S, c, r); if (!id) return false;
      ban(S, id, 1, 8); news(S, { t: 'event', title: `${P[id].short} foge da concentração do ${c}`, body: 'Saiu de madrugada e está fora do próximo jogo. Comissão técnica irritada.', ids: [id], clubs: [c] }); return true; } },
    aniver: { n: 'Perde treino após aniversário', p: 0.035, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs, r), id = anyOf(S, c, r); if (!id) return false;
      ban(S, id, 1, 6); const v = fine(S, id, c); news(S, { t: 'event', title: `Depois da festa de aniversário, ${P[id].short} perde o treino`, body: `Não voltou a tempo para a atividade do ${c}. Multa de T$ ${fmt(v)} e afastado do próximo jogo.`, ids: [id], clubs: [c] }); return true; } },
    sequestro: { n: 'Inventa sequestro', p: 0.008, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs, r), id = fictOf(S, c, r); if (!id || !once(S, `seq${id}`)) return false;
      ban(S, id, 2, 20); const v = fine(S, id, c); news(S, { t: 'event', title: `Polícia desmente: ${P[id].short} inventou sequestro para justificar atraso`, body: `O jogador do ${c} perdeu a partida e agora responde internamente. Multa de T$ ${fmt(v)}. Torcida revoltada.`, ids: [id], clubs: [c], front: 88 }); return true; } },
    paraguai: { n: 'Detido no Paraguai', p: 0.008, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs, r), id = fictOf(S, c, r); if (!id || !once(S, `par${id}`)) return false;
      const n = 4 + Math.floor(r() * 5); ban(S, id, n, 20); news(S, { t: 'event', title: `${P[id].short} é detido no Paraguai por documentação falsa`, body: `Jogador do ${c} fica retido enquanto a situação é resolvida. Previsão: ${n} jogos fora.`, ids: [id], clubs: [c], front: 88 }); return true; } },
    doping: { n: 'Cai no antidoping', p: 0.01, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs, r), id = fictOf(S, c, r); if (!id || !once(S, `dop${id}`)) return false;
      ban(S, id, 3, 15); S.dop = S.dop || []; S.dop.push({ id, c, d: d + 4 });
      news(S, { t: 'event', title: `${P[id].short} (${c}) cai no antidoping`, body: 'Suspensão provisória enquanto o caso é julgado.', ids: [id], clubs: [c], front: 85 }); return true; } },
    motel: { n: 'Motel cercado por torcedores', one: 1, can: S => !S.events['motel' + S.season], p: (S, clubs) => 0.01 + motelBad(S, clubs).length * 0.004, run: (S, d, r, clubs, G) => {
      const bad = motelBad(S, clubs), c = G ? C.pick(G, r) : bad.length && r() < 0.8 ? C.pick(bad, r) : C.pick(clubs, r), id = fictOf(S, c, r); if (!id) return false;
      S.events['motel' + S.season] = 1; ps(S, id).mor = clamp(ps(S, id).mor - 12, 0, 100); for (const x of squad(S, c)) ps(S, x).mor = clamp(ps(S, x).mor - 3, 0, 100);
      news(S, { t: 'event', title: `Torcedores do ${c} cercam motel onde estava ${P[id].short}`, body: 'Com o time em má fase, a cobrança foi parar na porta do motel. Imprensa repercute e a diretoria promete multa.', ids: [id], clubs: [c], front: 86 }); return true; } },
    motelD: { n: 'Delegação se hospeda em motel', one: 1, can: S => !S.events['motelD' + S.season], p: 0.0003, run: (S, d, r, clubs, G) => { const c = G ? C.pick(G, r) : smallClub(S, r); S.events['motelD' + S.season] = 1;
      for (const x of squad(S, c)) ps(S, x).mor = clamp(ps(S, x).mor - 2, 0, 100);
      news(S, { t: 'event', title: `Sem hotel, delegação do ${c} se hospeda em motel`, body: 'Problema na reserva deixou o elenco sem opção na véspera do jogo. Fotos viralizam e a torcida não perdoa.', clubs: [c], front: 80 }); return true; } },
    chuteira: { n: 'Chuteira com a cor do rival', p: 0.02, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs, r), riv = clubs.filter(x => x !== c && C.isDerby(c, x)); if (!riv.length) return false;
      const rv = C.pick(riv, r), id = C.pick(squad(S, c).filter(x => !Wd.realMinor(S, x)), r), k = SPRITE_KIT(S, rv); if (!id || !k) return false;
      const cor = colorName(k); ps(S, id).mor = clamp(ps(S, id).mor - 4, 0, 100);
      news(S, { t: 'event', title: `${P[id].short} aparece com chuteira ${cor} no treino do ${c}`, body: `A cor lembra o ${rv}. Torcedores cobram nas redes e o jogador pede desculpas.`, ids: [id], clubs: [c] }); return true; } },
    tiroteio: { n: 'Tiroteio perto do CT', p: 0.012, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs, r);
      for (const x of squad(S, c)) { const s = ps(S, x); s.cond = Math.max(40, s.cond - 3); s.mor = clamp(s.mor - 2, 0, 100); }
      news(S, { t: 'event', title: `Tiroteio nas proximidades interrompe treino do ${c}`, body: 'Por segurança, a atividade foi cancelada e o elenco deixou o CT. A preparação para o próximo jogo foi prejudicada.', clubs: [c] }); return true; } },
    uniforme: { n: 'Técnico critica o uniforme', p: 0.015, run: (S, d, r, clubs, G) => { const c = C.pick(G || clubs.filter(x => !Wd.isHuman(S, x) && S.coaches[x]), r); if (!c) return false;
      const cor = C.pick(['rosa', 'dourado', 'lilás', 'cinza', 'laranja'], r);
      news(S, { t: 'press', title: `${S.coaches[c].name} critica o uniforme ${cor} do ${c}`, body: `"Não combina com a nossa história", disse o técnico. Torcida se divide e o patrocinador de material esportivo não gostou.`, clubs: [c] }); return true; } },
    comic: { n: 'Evento cômico (Inteira-Hora)', p: 0.5, god: (S, d, r, clubs, G) => comicEvents(S, d, r, G || clubs, true) },
    spons: { n: 'Novo patrocinador master', god: (S, d, r, clubs, G) => { const cand = (G || clubs).filter(c => S.spons[c] !== S.season); if (!cand.length) return false; sponsor(S, d, C.pick(cand, r)); return true; } },
    saf: { n: 'Clube vira SAF', god: (S, d, r, clubs, G) => { const cand = (G || clubs).filter(c => !Wd.REAL_SAF.has(c) && !S.saf[c]); if (!cand.length) return false; safBuy(S, C.pick(cand, r)); return true; } },
    safcrise: { n: 'Crise financeira grave (SAF ou associativo)', god: (S, d, r, clubs, G) => { S.safCrisis = S.safCrisis || {}; const cand = (G || clubs).filter(c => !S.safCrisis[c]); if (!cand.length) return false; safCrisis(S, d, r, C.pickW(cand, cand.map(c => crisisKind(S, c) === 'game' ? 4 : 1), r)); return true; } },
    bets: { n: 'Governo proíbe as bets', one: 1, can: S => !S.events['bets' + S.season], p: 0.0012, run: (S, d, r, clubs, G) => { S.events['bets' + S.season] = 1;
      for (const c of clubs) if (S.cash[c] > 0) S.cash[c] = Math.round(S.cash[c] * 0.75);
      news(S, { t: 'fin', title: 'Governo proíbe as bets no Brasil', body: 'Sem patrocínios de apostas, todos os clubes perdem 25% do orçamento da temporada.' }); return true; } },
    brutal: { n: 'Patrocínio da Brutal Models', one: 1, can: S => !S.events['brutal' + S.season], p: 0.008, run: (S, d, r, clubs, G) => {
      const cand = (G || clubs).filter(c => S.spons[c] !== S.season); if (!cand.length) return false;
      const c = G ? C.pick(cand, r) : C.pickW(cand, cand.map(x => fightW(S, x)), r), v = C.r1k(Wd.squadValue(S, c) * 0.1);
      S.events['brutal' + S.season] = 1; S.spons[c] = S.season; S.cash[c] += v;
      Wd.asClub(S, c, () => { S.moneyIn = { d, v, why: 'patrocínio master (Brutal Models)' }; SEASON.fansAdd(S, -4, 'patrocínio polêmico'); });
      news(S, { t: 'fin', tag: 'brutal', front: 84, title: `${c} fecha patrocínio master com o site de acompanhantes Brutal Models`, body: `Injeção de T$ ${fmt(v)} no caixa. Parte da torcida questiona a origem do dinheiro e protesta nas redes; a diretoria diz que "é tudo dentro da lei".`, clubs: [c] }); return true; } },
    arabe: { n: 'Investidor árabe compra SAF', one: 1, can: S => !S.events['arabe' + S.season], p: 0.005, run: (S, d, r, clubs, G) => {
      const cand = (G || clubs).filter(c => !Wd.REAL_SAF.has(c) && !S.saf[c]); if (!cand.length) return false;
      const c = G ? C.pick(cand, r) : C.pickW(cand, cand.map(x => poorW(S, x)), r), v = C.r1k(Wd.squadValue(S, c) * 0.5);
      S.events['arabe' + S.season] = 1; S.saf[c] = S.season; S.safHow = S.safHow || {}; S.safHow[c] = 'arabe'; S.cash[c] += v;
      Wd.asClub(S, c, () => { S.moneyIn = { d, v, why: 'investidor árabe (SAF)' }; SEASON.fansAdd(S, 6, 'SAF com investidor árabe'); });
      news(S, { t: 'fin', front: 90, title: `Investidor árabe compra a SAF do ${c}`, body: `Fundo do Golfo assume o futebol do clube e injeta T$ ${fmt(v)} de imediato. A torcida já sonha com reforços de peso.`, clubs: [c] }); return true; } },
    calote: { n: 'Patrocinador dá calote', p: 0.008, run: (S, d, r, clubs, G) => {
      const cand = (G || clubs).filter(c => !S.events[`calote${c}${S.season}`]); if (!cand.length) return false;
      const c = G ? C.pick(cand, r) : C.pickW(cand, cand.map(x => titleW(S, x)), r), v = C.r1k(Math.max(S.cash[c] || 0, Wd.squadValue(S, c) * 0.1) * 0.2);
      S.events[`calote${c}${S.season}`] = 1; S.cash[c] -= v;
      news(S, { t: 'fin', front: 82, title: `Patrocinador dá calote no ${c}, que vai à Justiça`, body: `A empresa não pagou os valores prometidos em contrato. O rombo é de T$ ${fmt(v)} (20% do orçamento) e o clube cobra na Justiça.`, clubs: [c] }); return true; } },
    cotas: { n: 'Clube antecipa cotas de TV', p: 0.01, run: (S, d, r, clubs, G) => {
      const cand = (G || clubs).filter(c => !(S.tvDebt || []).some(x => x.c === c)); if (!cand.length) return false;
      const c = G ? C.pick(cand, r) : C.pickW(cand, cand.map(x => poorW(S, x)), r), v = C.r1k(Wd.squadValue(S, c) * C.ECON.startCashRate * 0.25);
      S.tvDebt = S.tvDebt || []; S.tvDebt.push({ c, s: S.season + 1, v }); S.cash[c] += v;
      Wd.asClub(S, c, () => { S.moneyIn = { d, v, why: 'cotas de TV antecipadas' }; });
      news(S, { t: 'fin', title: `${c} antecipa cotas de TV da próxima temporada`, body: `Para aliviar o caixa, o clube recebe agora T$ ${fmt(v)} (25% do orçamento anual). O mesmo valor sai das receitas de ${S.season + 1}.`, clubs: [c] }); return true; } },
    penhora: { n: 'Justiça penhora renda do clube', p: 0.01, run: (S, d, r, clubs, G) => {
      const c = G ? C.pick(G, r) : C.pickW(clubs, clubs.map(x => poorW(S, x)), r), v = C.r1k(Wd.squadValue(S, c) * 0.04);
      S.cash[c] -= v;
      news(S, { t: 'fin', title: `Justiça do Trabalho penhora T$ ${fmt(v)} do ${c}`, body: 'Dívida antiga com ex-jogadores volta a assombrar. O valor foi bloqueado direto das receitas do clube.', clubs: [c] }); return true; } },
    heranca: { n: 'Torcedor deixa herança ao clube', p: 0.005, run: (S, d, r, clubs, G) => {
      const c = C.pick(G || clubs, r), v = C.r1k(Wd.squadValue(S, c) * 0.05); S.cash[c] += v;
      Wd.asClub(S, c, () => { S.moneyIn = { d, v, why: 'herança de torcedor' }; });
      news(S, { t: 'fin', title: `Torcedor fanático deixa herança de T$ ${fmt(v)} para o ${c}`, body: 'No testamento, um único pedido: "que o dinheiro vire gol". A família apoia a decisão.', clubs: [c] }); return true; } },
    show: { n: 'Show internacional no estádio', p: 0.01, run: (S, d, r, clubs, G) => {
      const c = G ? C.pick(G, r) : C.pickW(clubs, clubs.map(x => 0.5 + Wd.squadValue(S, x) / 300000), r), v = C.r1k(Wd.squadValue(S, c) * 0.03); S.cash[c] += v;
      Wd.asClub(S, c, () => { S.moneyIn = { d, v, why: 'aluguel do estádio para show' }; });
      news(S, { t: 'fin', title: `Estádio do ${c} recebe show internacional e rende T$ ${fmt(v)}`, body: 'Ingressos esgotados em minutos. O gramado sofreu com o palco, mas o caixa agradece.', clubs: [c] }); return true; } },
    vaquinha: { n: 'Vaquinha da torcida', p: (S, clubs) => clubs.some(c => S.arrears && S.arrears[c] && S.arrears[c].days > 0) ? 0.1 : 0, run: (S, d, r, clubs, G) => {
      const late = (G || clubs).filter(c => S.arrears && S.arrears[c] && S.arrears[c].days > 0), c = late.length ? C.pick(late, r) : G ? C.pick(G, r) : null; if (!c) return false;
      const v = C.r1k(Wd.squadValue(S, c) * 0.02); S.cash[c] += v;
      Wd.asClub(S, c, () => { S.moneyIn = { d, v, why: 'vaquinha da torcida' }; SEASON.fansAdd(S, 3, 'vaquinha da torcida'); });
      news(S, { t: 'fin', title: `Torcida do ${c} faz vaquinha e arrecada T$ ${fmt(v)}`, body: `${late.includes(c) ? 'Com salários atrasados, a torcida se mobilizou para ajudar a pagar o elenco. ' : ''}Campanha viralizou e teve doação até de ex-jogadores.`, clubs: [c] }); return true; } },
    audio: { n: 'Áudio vazado do vestiário', p: 0.012, run: (S, d, r, clubs, G) => {
      const c = G ? C.pick(G, r) : C.pickW(clubs, clubs.map(x => /DD$/.test((S.streak || {})[x] || '') ? 4 : 1), r);
      for (const x of squad(S, c)) ps(S, x).mor = clamp(ps(S, x).mor - 5, 0, 100);
      news(S, { t: 'press', front: 80, title: `Áudio vazado do vestiário do ${c} expõe racha no elenco`, body: 'Gravação com discussão entre jogadores circula nos grupos de torcedores. A diretoria fala em "caça ao traidor".', clubs: [c] }); return true; } },
  };
  const EV_ORDER = ['indisc', 'poker', 'familia', 'aniver', 'foge', 'chuteira', 'viagem', 'uniforme', 'apostas', 'tiroteio', 'doping', 'motel', 'sequestro', 'paraguai', 'motelD', 'comic', 'audio', 'spons', 'brutal', 'saf', 'arabe', 'safcrise', 'calote', 'cotas', 'penhora', 'heranca', 'show', 'vaquinha', 'bets'];
  // pesos: quem briga pra não cair · orçamento curto · quem briga pelo título
  const posOf = (S, c) => { const div = (Wd.divOf(S, c) || 'B'), tb = S.comp && S.comp[div] && S.comp[div].table; if (tb && S.slot >= 4) { const i = SEASON.standings(tb).findIndex(x => x.c === c); if (i >= 0) return { div, pos: i + 1, n: Object.keys(tb).length }; } const rk = S.obj && S.obj[c] ? S.obj[c].rank : 10; return { div, pos: rk, n: div === 'A' ? S.divA.length : S.divB.length }; };
  const fightW = (S, c) => { const o = posOf(S, c); return o.pos > o.n - 5 ? 5 : o.pos > o.n - 9 ? 2 : o.div === 'B' || o.div === 'C' ? 1.3 : 0.6; };
  const poorW = (S, c) => { const cr = (S.cash[c] || 0) / (Wd.squadValue(S, c) || 1); return cr < 0 ? 5 : cr < 0.1 ? 3 : cr < 0.25 ? 1.5 : 0.4; };
  const titleW = (S, c) => { const o = posOf(S, c); return o.div === 'A' && o.pos <= 4 ? 6 : o.div === 'A' && o.pos <= 8 ? 2 : 0.3; };
  // cotas de TV antecipadas: descontadas no começo da temporada seguinte
  function tvDebtPay(S) { const due = (S.tvDebt || []).filter(x => x.s <= S.season); S.tvDebt = (S.tvDebt || []).filter(x => x.s > S.season);
    for (const x of due) { if (S.cash[x.c] === undefined) continue; S.cash[x.c] -= x.v; news(S, { t: 'fin', title: `${x.c} começa ${S.season} sem T$ ${fmt(x.v)} das cotas de TV`, body: 'É o valor antecipado na temporada passada. O orçamento do ano começa mais curto.', clubs: [x.c] }); } }
  function once(S, k) { if (S.events[k]) return false; S.events[k] = 1; return true; }
  function hit(S, k) { S.evHit = S.evHit || {}; S.evHit[k] = S.season; }
  const motelBad = (S, clubs) => clubs.filter(c => ((S.streak || {})[c] || '').endsWith('DD'));
  function roll(S, d, r, clubs, k) {
    const e = EVD[k]; if (e.can && !e.can(S)) return;
    const p = typeof e.p === 'function' ? e.p(S, clubs) : e.p;
    if (r() < p && e.run(S, d, r, clubs)) hit(S, k);
  }
  function sponsP(S, c) {
    if (S.spons[c] === S.season) return 0;
    const div = (Wd.divOf(S, c) || 'B'), tb = S.comp && S.comp[div] && S.comp[div].table;
    let pos = 10;
    if (tb && S.slot >= 6) { const st = SEASON.standings(tb); pos = st.findIndex(x => x.c === c) + 1 || 10; }
    const n = Wd.divList(S, div).length;
    let p = pos > n - 4 ? 0.0033 : pos > n - 8 ? 0.0013 : pos > 6 ? 0.0005 : pos > 4 ? 0.00018 : 0.00004;
    const sv = Wd.squadValue(S, c) || 1, cr = (S.cash[c] || 0) / sv;
    p *= cr < 0 ? 2 : cr < 0.1 ? 1.4 : cr < 0.25 ? 1 : cr < 0.5 ? 0.45 : 0.08;
    return p;
  }
  function sponsor(S, d, c) {
    S.spons = S.spons || {}; S.spons[c] = S.season;
    const v = C.r1k(Wd.squadValue(S, c) * 0.08);
    S.cash[c] += v;
    Wd.asClub(S, c, () => { S.extraDia = 1; S.moneyIn = { d, v, why: 'novo patrocinador master' }; });
    news(S, { t: 'fin', title: `${c} fecha com novo patrocinador master`, body: `${(S.cash[c] - v) < Wd.squadValue(S, c) * 0.1 ? 'Em meio à crise, uma empresa aposta na recuperação do clube. ' : ''}Injeção de T$ ${fmt(v)}.${Wd.isHuman(S, c) ? ` Bônus: um pacote ${MARKET.isOuroClub(S, c) ? 'Ouro Especial' : 'Diamante'} extra liberado no Mercado.` : ''}`, clubs: [c] });
  }
  function safBuy(S, c) {
    S.saf[c] = S.season; S.safHow = S.safHow || {}; S.safHow[c] = 'fundo'; S.cash[c] = S.cash[c] > 0 ? S.cash[c] * 2 : S.cash[c] + C.r1k(Wd.squadValue(S, c) * 0.3);
    news(S, { t: 'fin', title: `${c} vira SAF e recebe investimento bilionário`, body: 'Saldo bancário dobra da noite pro dia.', clubs: [c] });
  }
  // crise financeira grave: vale pra todo clube. SAF real, SAF criada no jogo (dinheiro fácil, risco maior) ou associativo (gestão temerária)
  function crisisKind(S, c) { return S.saf && S.saf[c] ? 'game' : Wd.REAL_SAF.has(c) ? 'real' : 'assoc'; }
  function safOrigin(S, c) {
    if (S.safHow && S.safHow[c]) return S.safHow[c];
    return (S.news || []).some(n => n.title === `Investidor árabe compra a SAF do ${c}`) ? 'arabe' : 'fundo';
  }
  const CRISIS_P = { assoc: 0.0004, real: 0.0004, game: 0.0016 };   // por dia; a SAF criada no jogo tem 4× mais chance
  function crisisText(S, c, kind, extreme, r) {
    const pk = a => a[Math.floor(r() * a.length)];
    if (kind === 'real') return extreme ? [`${c} à beira da falência: investidor da SAF abandona o clube`, 'Dívidas explodem, elenco sem receber e risco real de falência. Jogadores pedem para sair.']
      : [`Crise na SAF do ${c}: salários atrasados`, 'Investidor atrasa aportes. Elenco insatisfeito e contratações travadas até a situação se resolver.'];
    if (kind === 'game') {
      const y = S.saf[c], arabe = safOrigin(S, c) === 'arabe';
      if (arabe) return extreme ? [`Fundo do Golfo abandona a SAF do ${c} e leva o dinheiro de volta`, `O investidor árabe que comprou o futebol do clube em ${y} desiste do projeto da noite pro dia. Contas bloqueadas, elenco sem receber e risco real de falência. Do jeito que veio, foi.`]
        : [`Investidor árabe congela os aportes na SAF do ${c}`, `O fundo do Golfo que chegou em ${y} prometendo reforços de peso atrasa os pagamentos e revê o projeto. Salários atrasados e contratações travadas.`];
      return extreme ? [`Fundo dono da SAF do ${c} é alvo de operação policial`, `O fundo que comprou o clube em ${y} e dobrou o caixa da noite pro dia tem as contas bloqueadas pela Justiça. Dinheiro fácil, saída fácil: elenco sem receber e risco real de falência.`]
        : [`Fundo que comprou a SAF do ${c} entra em recuperação judicial`, `O investimento bilionário de ${y} não era tudo aquilo. Os aportes param, os salários atrasam e as contratações ficam travadas.`];
    }
    return extreme ? pk([[`${c} à beira da falência: conselho aprova impeachment do presidente`, 'Auditoria encontra um rombo milionário e gestão temerária. Contas penhoradas, elenco sem receber e jogadores pedindo para sair.'],
        [`Rombo nas contas: ${c} decreta estado de calamidade financeira`, 'Dívidas escondidas pela diretoria vêm à tona. Salários atrasados, contas bloqueadas e risco real de falência.']])
      : pk([[`Crise financeira grave no ${c}: salários atrasados`, 'Auditoria aponta gestão temerária e dívidas acima do previsto. Elenco sem receber e contratações travadas até a situação se resolver.'],
        [`Conselho do ${c} abre processo de impeachment do presidente`, 'Denúncias de gestão temerária e contratos suspeitos. O caixa foi bloqueado, os salários atrasaram e as contratações estão travadas.'],
        [`${c} descobre dívida escondida pela diretoria anterior`, 'Bloqueios judiciais levam parte do caixa. Salários atrasados e contratações travadas até a situação se resolver.']]);
  }
  function safCrisis(S, d, r, c) {
    S.safCrisis = S.safCrisis || {};
    const kind = crisisKind(S, c), sv = Wd.squadValue(S, c), extreme = r() < (kind === 'game' ? 0.25 : 0.12);
    S.safCrisis[c] = { d, until: d + 18 + Math.floor(r() * 12), extreme, kind };
    S.cash[c] -= C.r1k(sv * (extreme ? 0.6 : 0.25));
    for (const x of squad(S, c)) ps(S, x).mor = clamp(ps(S, x).mor - (extreme ? 20 : 12), 0, 100);
    const [title, body] = crisisText(S, c, kind, extreme, r);
    news(S, { t: 'fin', title, body, clubs: [c], front: 92 });
    if (!Wd.isHuman(S, c)) {   // IA vende seus melhores para fazer caixa
      const best = squad(S, c).slice().sort((a, b) => view(S, b).ovr - view(S, a).ovr).slice(0, extreme ? 3 : 1);
      for (const id of best) { const v = Math.round(view(S, id).mv * 0.7 / 1000) * 1000; S.cash[c] += v; Wd.move(S, id, 'Livre', false, { t: 'rescisao', fee: v }); S.free.push(id);
        news(S, { t: 'transfer', title: `${P[id].name} rescinde com o ${c}`, body: 'Com salários atrasados, o jogador conseguiu a rescisão na Justiça e está livre no mercado.', ids: [id], clubs: [c], minor: true }); }
    }
  }
  // modo god (ADM): lista com o estado de cada evento nesta temporada e disparo manual
  function godList(S) { const h = S.evHit || {}; return EV_ORDER.map(k => ({ k, n: EVD[k].n, p: EVD[k].p, done: h[k] === S.season || (EVD[k].can ? !EVD[k].can(S) : false) })); }
  function godFire(S, k, seed) {
    const e = EVD[k]; if (!e) return { ok: false, msg: 'Evento desconhecido.' };
    S.events = S.events || {}; S.spons = S.spons || {}; S.saf = S.saf || {};
    if ((S.evHit || {})[k] === S.season || (e.can && !e.can(S))) return { ok: false, msg: 'Esse evento já aconteceu nesta temporada.' };
    const r = R(`god${S.seed}${k}${seed}`), d = S.lastDay || 0, clubs = Wd.brClubs(S), f = e.god || e.run;
    // foco nos clubes com treinador ativo na liga
    const G = [...new Set(Object.values(S.desks || {}).filter(x => x && x.club && !x.unemployed).map(x => x.club))].filter(c => clubs.includes(c));
    if (!G.length) return { ok: false, msg: 'Nenhum clube com treinador ativo.' };
    for (let i = 0; i < 30; i++) if (f(S, d, r, clubs, G)) { hit(S, k); return { ok: true, msg: `Disparado: ${e.n}` }; }
    return { ok: false, msg: 'Sem candidato para esse evento agora.' };
  }
  function rareEvents(S, d, r, clubs) {
    for (const k of ['apostas', 'familia', 'viagem', 'foge', 'aniver', 'sequestro', 'paraguai', 'doping']) roll(S, d, r, clubs, k);
    for (const x of (S.dop || []).filter(x => x.d <= d)) {
      if (r() < 0.4) news(S, { t: 'event', title: `${P[x.id].short} é absolvido no caso de doping`, body: 'Contaminação comprovada. Liberado para jogar.', ids: [x.id], clubs: [x.c] });
      else { const n = 10 + Math.floor(r() * 16); ban(S, x.id, n, 10); news(S, { t: 'event', title: `${P[x.id].short} pega ${n} jogos de suspensão por doping`, body: `Decisão do tribunal. O ${x.c} vai recorrer.`, ids: [x.id], clubs: [x.c] }); }
    }
    if (S.dop) S.dop = S.dop.filter(x => x.d > d);
    for (const k of ['motel', 'motelD', 'chuteira', 'tiroteio', 'uniforme']) roll(S, d, r, clubs, k);
    // crise na SAF
    for (const c of clubs) {
      const isSaf = Wd.REAL_SAF.has(c) || (S.saf && S.saf[c]);
      S.safCrisis = S.safCrisis || {};
      const cr = S.safCrisis[c];
      if (cr && d >= cr.until) { delete S.safCrisis[c]; const k = cr.kind || (isSaf ? 'real' : 'assoc');
        news(S, k === 'assoc' ? { t: 'fin', title: `${c} aprova plano de recuperação e sai da crise`, body: 'Nova diretoria renegocia as dívidas e coloca os salários em dia. O clube volta a respirar.', clubs: [c] }
          : { t: 'fin', title: `${c} encontra novo investidor e sai da crise`, body: 'Salários colocados em dia. O clube volta a respirar.', clubs: [c] }); continue; }
      void isSaf; if (cr || r() >= CRISIS_P[crisisKind(S, c)]) continue;
      safCrisis(S, d, r, c); hit(S, 'safcrise');
    }
  }
  // ---------- capitão lidera motim (só com crise de verdade) ----------
  const captainOfClub = (S, c) => Wd.captain(S, c, squad(S, c).filter(id => view(S, id).inj <= 0));
  function mutiny(S, d, r) {
    S.mutiny = S.mutiny || {};
    Wd.forDesks(S, tk => {
      if (S.unemployed) return;
      const c = S.club, st = (S.streak || {})[c] || '', last6 = st.slice(-6);
      const mt = S.mutiny[c]; if (mt && mt.season === S.season && (mt.real || mt.n >= 2 || d - mt.d < 12)) return;   // no máx. 2 por temporada, e só 1 motim de verdade
      const noWin = !/V/.test(last6) && last6.length >= 5, losses = (st.match(/D+$/) || [''])[0].length;
      const sq = squad(S, c), avgMor = sq.reduce((t, id) => t + view(S, id).mor, 0) / Math.max(1, sq.length);
      const div = (Wd.divOf(S, c) || 'B'), tb = S.comp && S.comp[div] ? SEASON.standings(S.comp[div].table) : [], pos = tb.findIndex(x => x.c === c) + 1;
      const below = S.obj && S.obj[c] && pos && pos > S.obj[c].max + 5;
      let heat = 0;
      if (noWin) heat += 2; if (losses >= 3) heat += 2; if (losses >= 4) heat += 1; if (avgMor < 42) heat += 2; if ((S.board ?? 60) < 35) heat += 1; if (below) heat += 1;
      const lm = S.lastMatch && S.lastMatch.season === S.season && !S.lastMatch.friendly ? S.lastMatch : null;
      if (lm) { const my = lm.f.h === c ? lm.res.gh : lm.res.ga, ot = lm.f.h === c ? lm.res.ga : lm.res.gh; if (ot - my >= 3) heat += 2; }
      if (heat < 5) return;
      const cap = captainOfClub(S, c); if (!cap) return;
      const cs = view(S, cap), lead = (cs.temper === 'temperamental' ? 1.4 : cs.temper === 'ambicioso' ? 1.2 : cs.temper === 'profissional' ? 0.7 : 1) * (cs.ovr >= 78 ? 1.3 : 1) * (age(S, cap) >= 30 ? 1.2 : 1);
      if (r() > 0.12 * (heat - 4) * lead) return;
      const support = sq.filter(id => id !== cap && view(S, id).mor < 50).length, real = support >= 5 && lead >= 1.1;
      S.mutiny[c] = { season: S.season, d, cap, real, n: (mt && mt.season === S.season ? mt.n : 0) + 1 };
      for (const id of sq) ps(S, id).mor = clamp(ps(S, id).mor - (real ? 6 : 3), 0, 100);
      S.board = clamp((S.board ?? 60) - (real ? 6 : 3), 0, 100);
      news(S, { t: 'club', tag: 'crisis', front: real ? 92 : 80, title: real ? `Motim no ${c}: ${P[cap].short} reúne o elenco e cobra ${S.manager}` : `Capitão ${P[cap].short} cobra ${S.manager} após a má fase do ${c}`,
        body: real ? `${support} jogadores apoiaram o capitão numa reunião sem a comissão técnica. A diretoria já sabe da crise e espera uma resposta do treinador.` : 'Conversa dura no vestiário. O grupo pede mudanças, mas o clima ainda é contornável.', ids: [cap], clubs: [c] });
    });
  }
  // ---------- clubes reclamam do calendário (sequência real de jogos) ----------
  function calendarGripe(S, d, r, clubs) {
    if (S.slot < 18) return;
    S.calGripe = S.calGripe || {};
    for (const c of clubs) {
      if (S.calGripe[c] === S.season) continue;
      let games = 0; const comps = new Set();
      for (let k = Math.max(0, S.slot - 8); k < S.slot; k++) for (const m of (S.played[k] || [])) if (m.h === c || m.a === c) { games++; comps.add(m.comp); }
      if (games < 8 || comps.size < 2 || (S.calCount && S.calCount.s === S.season && S.calCount.n >= 4)) continue;
      const sq = squad(S, c), tired = sq.filter(id => view(S, id).cond < 70).length, inj = sq.filter(id => view(S, id).inj > 0).length;
      const p = 0.04 + (games - 8) * 0.06 + (comps.size - 2) * 0.05 + tired * 0.008 + inj * 0.015;
      if (r() > p) continue;
      S.calGripe[c] = S.season; S.calCount = S.calCount && S.calCount.s === S.season ? { s: S.season, n: S.calCount.n + 1 } : { s: S.season, n: 1 };
      const human = Wd.isHuman(S, c), who = C.pick(['técnico', 'diretoria', 'capitão'], r);
      const whoName = who === 'técnico' ? (S.coaches[c] ? S.coaches[c].name : 'O técnico') : who === 'capitão' ? (P[captainOfClub(S, c)] || {}).short || 'O capitão' : `A diretoria do ${c}`;
      news(S, { t: 'press', tag: 'calendar', front: human ? 78 : 62, title: `${c} critica sequência de jogos e cobra mudanças no calendário`,
        body: `${whoName}${who === 'diretoria' ? '' : ` (${who})`} reclamou de ${games} jogos em poucos dias entre ${[...comps].map(x => SEASON.COMP_NAME[x]).join(', ')}. ${inj ? `${inj} jogador(es) no departamento médico. ` : ''}${tired ? `${tired} atletas com desgaste alto.` : ''}`, clubs: [c], minor: !human && games < 8 });
    }
  }
  // ---------- aposentadoria: veteranos anunciam durante a temporada e param no fim dela ----------
  function retirements(S, d, r) {
    if (S.slot < 34 || S.retAnnounced === S.season) return;
    S.retAnnounced = S.season;
    const teamGames = c => Math.max(1, Object.values(S.played || {}).flat().filter(m => m.h === c || m.a === c).length);
    for (const id of Wd.nonYouth()) {
      const p = P[id];
      const o = Wd.ownerOf(S, id); if (!o || o === 'Aposentado') continue;
      const a = Wd.ageNext(S, id), br = !!Wd.divOf(S, o); if (a < (br || o === 'Livre' ? 34 : 35)) continue;
      const v = view(S, id);
      let pr = a >= 41 ? 0.9 : a >= 40 ? 0.8 : a >= 39 ? 0.7 : a >= 38 ? 0.55 : a >= 37 ? 0.4 : a >= 36 ? 0.27 : a >= 35 ? 0.15 : 0.07;
      if (br && v.stl) { const share = (v.stl.j || 0) / teamGames(o); if (share < 0.25) pr *= 1.6; else if (share > 0.6 && v.form >= 6.9) pr *= 0.4; else if (share > 0.6) pr *= 0.7; }
      if (o === 'Livre') pr *= 1.7;
      if ((p.ovr0 || v.ovr) - v.ovr >= 6) pr *= 1.4;
      if (v.ovr >= 80) pr *= 0.6;
      if (r() > Math.min(0.95, pr)) continue;
      ps(S, id).retire = S.season;
      const big = Wd.isHuman(S, o) || (br && v.ovr >= 74) || v.ovr >= 82;
      if (big) news(S, { t: 'club', tag: 'retire', front: v.ovr >= 80 ? 88 : 72, title: `Aos ${a - 1} anos, ${p.name} anuncia que vai encerrar a carreira ao fim da temporada`,
        body: `${o !== 'Livre' ? `O ${o} confirmou a decisão. ` : ''}A despedida está prevista para o último jogo de ${S.season}.`, ids: [id], clubs: o !== 'Livre' && br ? [o] : [] });
    }
  }

  // ---------- eventos cômicos (alimentam o Inteira-Hora) ----------
  // sorteio diário com controle: intervalo mínimo por tipo, sem repetir clube em sequência, peso menor pro que saiu há pouco
  const COMIC = [
    { k: 'mascote', w: 1, club: true, t: c => [`Mascote do ${c} escorrega no gramado e vira meme`, 'O tombo antes do jogo rodou as redes e já tem remix com música de novela.'] },
    { k: 'nomeerrado', w: 1, t: (c, n) => [`${n} erra o nome do próprio clube em entrevista`, `Falou o nome do antigo time antes de corrigir. A torcida do ${c} levou na brincadeira… quase toda.`], mor: -1 },
    { k: 'onibus', w: 1, club: true, t: c => [`Ônibus do ${c} pega caminho errado e treino atrasa uma hora`, 'O GPS mandou a delegação para um bairro residencial. Moradores aproveitaram para pedir autógrafos.'] },
    { k: 'cachorro', w: 1, t: (c, n) => [`${n} leva o cachorro para o treino do ${c}`, 'O vira-lata roubou a cena, correu atrás da bola e ganhou até colete.'], mor: 2 },
    { k: 'selfie', w: 1, club: true, t: c => [`Torcedor invade treino do ${c} para pedir selfie e sai com camisa autografada`, 'Segurança demorou a agir; o elenco achou graça e posou para a foto.'] },
    { k: 'elevador', w: 1, t: (c, n) => [`${n} fica preso no elevador do hotel da concentração`, 'Passou 40 minutos trancado e foi resgatado pelos bombeiros. Garante que está pronto para jogar.'] },
    { k: 'pagode', w: 1, club: true, mor: 3, t: c => [`Pagode no vestiário do ${c} viraliza`, 'Vídeo com o elenco cantando depois do treino passou de um milhão de visualizações.'] },
    { k: 'promessa', w: 1, t: (c, n) => [`${n} promete raspar a cabeça se fizer gol no próximo jogo`, `A aposta com os companheiros do ${c} já tem até barbeiro escalado.`] },
    { k: 'reforcoerrado', w: 1, club: true, t: c => [`${c} anuncia reforço com foto de outro jogador e apaga o post`, 'O perfil oficial trocou a imagem do contratado por um homônimo. O print já está em todo lugar.'] },
    { k: 'patinete', w: 1, t: (c, n) => [`${n} chega ao CT de patinete elétrico`, 'Disse que era para fugir do trânsito. A comissão técnica pediu que ele use capacete.'] },
    { k: 'tatuagem', w: 1, t: (c, n) => [`${n} faz tatuagem do escudo do ${c}… com um detalhe errado`, 'O tatuador trocou a cor de uma estrela. O jogador diz que vai "customizar".'] },
    { k: 'galinha', w: 1, club: true, t: c => [`Galinha invade o treino do ${c}`, 'A ave atravessou o campo durante o coletivo e só foi capturada pelo roupeiro.'] },
    { k: 'celular', w: 1, t: (c, n) => [`${n} perde o celular no gramado e gandula devolve`, 'O aparelho caiu do bolso do agasalho no aquecimento. Recompensa: uma camisa de jogo.'] },
    { k: 'danca', w: 1, t: (c, n) => [`Dança de ${n} no aquecimento vira meme`, `O passinho foi parar em vídeos de outros clubes. No ${c}, virou comemoração oficial.`], mor: 2 },
    { k: 'churrasco', w: 1, club: true, t: c => [`Presidente do ${c} promete churrasco para o elenco se o time vencer`, 'A promessa foi feita em entrevista de rádio. O grupo já escolheu até o cardápio.'], mor: 2 },
    { k: 'uniformetroca', w: 1, club: true, t: c => [`${c} esquece uniforme reserva e treina com coletes de outra cor`, 'O roupeiro assumiu a culpa. O treino virou "amarelo contra laranja".'] },
    { k: 'aniversario', w: 1, t: (c, n) => [`${n} ganha bolo de aniversário na cara no CT`, 'A tradição do elenco foi cumprida com direito a ovo e farinha.'], mor: 2 },
    { k: 'gato', w: 1, club: true, t: c => [`Gato adota a arquibancada do ${c} e vira mascote não oficial`, 'O bichano aparece em todo treino. A torcida já pede que ele entre em campo com o time.'] },
    { k: 'hino', w: 1, t: (c, n) => [`${n} canta o hino do ${c} errado e pede desculpas`, 'Trocou uma estrofe inteira. Prometeu decorar até o próximo jogo em casa.'] },
    { k: 'superst', w: 1, t: (c, n) => [`${n} revela superstição: entra em campo com a meia do avesso`, 'Disse que não troca "de jeito nenhum" enquanto o time estiver vencendo.'] },
    { k: 'drone', w: 1, club: true, t: c => [`Drone sobrevoa treino fechado do ${c} e diretoria fala em espionagem`, 'O aparelho era de um youtuber local, que pediu desculpas em vídeo.'] },
    { k: 'caneta', w: 1, t: (c, n) => [`${n} leva caneta de roupeiro no treino e vira piada no grupo`, 'Os companheiros prometem cobrar a "multa" em churrasco.'] },
  ];
  function comicEvents(S, d, r, clubs, force) {
    S.comic = S.comic || { last: {}, lastClub: {}, n: 0 };
    const C0 = S.comic;
    if (!force && r() >= 0.5) return false;   // ~1 a cada 2 dias do jogo (≈14 por temporada), sempre variando
    const ok = COMIC.filter(e => !(C0.last[e.k] != null && d - C0.last[e.k] < 9));
    if (!ok.length) return false;
    const w = ok.map(e => e.w / (1 + (C0.n && C0.last[e.k] != null ? 1 : 0)));
    const e = C.pickW(ok, w, r);
    let c = null; for (let i = 0; i < 6 && (!c || (C0.lastClub[c] != null && d - C0.lastClub[c] < 3)); i++) c = C.pick(clubs, r);
    let id = null;
    if (!e.club) { id = anyOf(S, c, r); if (!id) return false; }
    const [title, body] = e.t(c, id ? P[id].short : null);
    if (e.mor) { if (id) ps(S, id).mor = clamp(ps(S, id).mor + e.mor * 2, 0, 100); else for (const x of squad(S, c)) ps(S, x).mor = clamp(ps(S, x).mor + e.mor, 0, 100); }
    C0.last[e.k] = d; C0.lastClub[c] = d; C0.n++;
    news(S, { t: 'event', tag: 'comic', title, body, ids: id ? [id] : [], clubs: [c] });
    if (!force) hit(S, 'comic');
    return true;
  }
  const SPRITE_KIT = (S, club) => { try { const k = SPR.kitFor(S, club); return k && k.c && k.c[0]; } catch (e) { return null; } };

  // ---------- prêmios anuais ----------
  // prêmios da temporada: calculados no apito final (estatísticas reais da temporada) e anunciados no Dia da Premiação
  // v270: premiação de gala — nomes próprios, 3 finalistas por prêmio, Revelação do Ano; Luva de Ouro só na Série A
  const AW_NAME = { cra: 'Bola de Ouro', gar: 'Garçom de Ouro', art: 'Chuteira de Ouro', gol: 'Luva de Ouro', tec: 'Prancheta de Ouro', xi: 'Seleção da Temporada', rev: 'Revelação do Ano' };
  function awards(S, quiet) {
    const out = {}, young = [];
    const awBadge = (club, label, season) => { try { const tok = club && Wd.deskOf(S, club); if (tok) Wd.asDesk(S, tok, () => { S.badges = S.badges || []; if (!S.badges.some(b => b.kind === 'award' && b.label === label && b.season === season)) S.badges.push({ season, club, kind: 'award', label }); }); } catch (e) {} };
    // v174: os mesmos prêmios nas Séries A, B e C (chaves da A sem sufixo; B e C com sufixo: craB, tecC...)
    for (const div of ['A', 'B', 'C']) {
      const clubs = S['div' + div] || [], tblRaw = S.comp && S.comp[div] && S.comp[div].table;
      if (!clubs.length || !tblRaw) continue;
      const sx = div === 'A' ? '' : div, dl = div === 'A' ? '' : ` · Série ${div}`;
      // v187: conta quem jogou ESTE campeonato, mesmo que já tenha sido vendido (números por campeonato em stlD)
      const SD = {}; for (const id in S.ps) { const v = SEASON.leagueStat(S, +id, div); if (v && v.j) SD[id] = v; }
      const pool = Object.keys(SD).map(Number).filter(id => P[id]);
      if (!pool.length) continue;
      const top = (arr, f, min = 0, n = 3) => arr.filter(id => SD[id].j >= min).sort((a, b) => f(b) - f(a) || a - b).slice(0, n);
      const maxJ = Math.max(1, ...pool.map(id => SD[id].j)), minJ = Math.max(3, Math.round(maxJ * 0.4));
      const st = id => SD[id], rt = id => st(id).j ? st(id).rt / st(id).j : 0;
      const line = id => `${st(id).j} jogos · ${st(id).g} gols · ${st(id).a} assist. · nota ${rt(id).toFixed(2)}`;
      const clubOf = id => (SD[id] && SD[id].c) || Wd.ownerOf(S, id);
      const give = (key, id, value, boost, fin, extra) => {
        if (!id) return; const s = ps(S, id), label = AW_NAME[key] + dl;
        s.mv = Math.round(s.mv * boost / 100) * 100; s.mor = clamp(s.mor + 10, 0, 100);
        out[key + sx] = { id, club: clubOf(id), value, label, line: line(id), boost, div, fin: fin || undefined, ...(extra || {}) };
        awBadge(clubOf(id), `${label}: ${P[id].short}`, S.season);
      };
      const finOf = (ids, val) => ids.map(id => ({ id, club: clubOf(id), value: val(id) }));
      // Bola de Ouro: nota média no campeonato + gols e assistências (mínimo de 40% dos jogos do mais assíduo)
      const fCra = id => rt(id) + st(id).g * 0.012 + st(id).a * 0.008, vCra = id => `nota média ${rt(id).toFixed(2)} · ${st(id).g} gols`;
      if (!sx) { const tc = top(pool, fCra, minJ); give('cra', tc[0], tc[0] && vCra(tc[0]), 1.25, finOf(tc, vCra)); }   // v272: Bola de Ouro, Chuteira e Garçom só na Série A
      // Chuteira e Garçom: contados dos jogos do campeonato (mesma lista da tela de Torneios)
      const LD = SEASON.leagueLeaders(S, div, 3), lg = LD.g[0], la = LD.a[0];
      for (const [id, c] of [...LD.g, ...LD.a].filter(Boolean)) if (!SD[id]) SD[id] = { j: 0, g: 0, a: 0, rt: 0, ga: 0, cs: 0, c };
      if (la && !sx) give('gar', la[0], `${la[2]} assistências`, 1.15, LD.a.map(([id, c, n]) => ({ id, club: c, value: `${n} assistências` })));
      if (lg && !sx) give('art', lg[0], `${lg[2]} gols`, 1.2, LD.g.map(([id, c, n]) => ({ id, club: c, value: `${n} gols` })));
      // Luva de Ouro (só Série A): menos gols sofridos por jogo + jogos sem sofrer gol
      if (!sx) { const fG = id => -st(id).ga / st(id).j + st(id).cs * 0.02, vG = id => `${(st(id).ga / st(id).j).toFixed(2)} gols sofridos por jogo · ${st(id).cs} sem sofrer gol`;
        const tg = top(pool.filter(id => P[id].pos === 'GOL'), fG, minJ); give('gol', tg[0], tg[0] && vG(tg[0]), 1.15, finOf(tg, vG)); }
      // Prancheta de Ouro: campanha acima do esperado pelo elenco + títulos
      const tbl = SEASON.standings(tblRaw), champs = ['CB', 'LIB', 'SUL', 'CONF'].map(k => S.comp[k] && S.comp[k].champ);
      const coachScore = (r, i) => { const rank = S.obj && S.obj[r.c] ? S.obj[r.c].rank : i + 1; return (rank - (i + 1)) * 2 + r.pts / Math.max(1, r.j) * 6 + (i === 0 ? 12 : 0) + champs.filter(c => c === r.c).length * 8; };
      const cbs = tbl.map((r, i) => ({ r, i, sc: coachScore(r, i) })).sort((x, y) => y.sc - x.sc).slice(0, 3);
      const coachName = c => { const tok = Wd.deskOf(S, c); return tok ? S.desks[tok].manager : (S.coaches[c] && S.coaches[c].name) || 'Treinador'; };
      const cVal = x => { const rank = S.obj && S.obj[x.r.c] ? S.obj[x.r.c].rank : null, tit = champs.filter(y => y === x.r.c).length + (x.i === 0 ? 1 : 0); return `${x.i + 1}º na Série ${div} com ${x.r.pts} pts${rank ? ` (elenco era o ${rank}º)` : ''}${tit ? ` · ${tit} título(s)` : ''}`; };
      const cb = cbs[0];
      if (cb) {
        const c = cb.r.c, tok = Wd.deskOf(S, c);
        out['tec' + sx] = { coach: coachName(c), tok, club: c, div, label: AW_NAME.tec + dl, value: cVal(cb), line: `${cb.r.v}V ${cb.r.e}E ${cb.r.d}D · ${Math.round(cb.r.pts / Math.max(1, cb.r.j * 3) * 100)}% de aproveitamento`,
          fin: cbs.map(x => ({ coach: coachName(x.r.c), tok: Wd.deskOf(S, x.r.c) || null, club: x.r.c, value: cVal(x) })) };
        if (tok) Wd.asDesk(S, tok, () => { S.badges = S.badges || []; S.badges.push({ season: S.season, club: c, kind: 'award', label: AW_NAME.tec + dl }); });
      }
      // Seleção da Temporada (4-3-3 pelas notas médias)
      const bySet = { GOL: 1, DEF: 4, MEI: 3, ATA: 3 }, used = new Set(), xi = [];
      for (const [set, n] of Object.entries(bySet)) {
        pool.filter(id => C.SETOR_OF[P[id].pos] === set && st(id).j >= minJ && !used.has(id)).sort((x, y) => rt(y) - rt(x)).slice(0, n)
          .forEach(id => { used.add(id); xi.push({ id, club: Wd.ownerOf(S, id), set, rt: +rt(id).toFixed(2) }); });
      }
      if (xi.length) out['xi' + sx] = { label: AW_NAME.xi + dl, div, xi, value: `nota média ${(xi.reduce((t, x) => t + x.rt, 0) / xi.length).toFixed(2)}` };
      // candidatos à Revelação do Ano (até 21 anos, jogou de verdade no campeonato)
      const minY = Math.max(5, Math.round(maxJ * 0.3)), O = S.ovrS && S.ovrS.s === S.season ? S.ovrS.m || {} : null;
      for (const id of pool) {
        if (st(id).j < minY || st(id).j === 0) continue; let a = 99; try { a = age(S, id); } catch (e) {} if (a > 21) continue;
        const cur = (S.ps[id] && S.ps[id].ovr) || P[id].ovr0 || 0, base = O && O[id] != null ? O[id] : (P[id].ovr0 || cur);
        const evo = clamp(cur - base, 0, 12), sc = rt(id) + st(id).g * 0.02 + st(id).a * 0.015 + evo * 0.12 + Math.min(1, st(id).j / maxJ) * 0.5 + (div === 'A' ? 0.25 : div === 'B' ? 0.1 : 0);
        young.push({ id, sc, div, a, evo, club: clubOf(id), j: st(id).j, g: st(id).g, as: st(id).a, r: rt(id) });
      }
    }
    // Revelação do Ano (uma só, das três séries): números no campeonato, evolução de overall na temporada, minutos e o nível da série
    young.sort((x, y) => y.sc - x.sc || x.id - y.id);
    const yv = y => `${y.a} anos · Série ${y.div}${y.evo ? ` · +${y.evo} de overall` : ''} · nota ${y.r.toFixed(2)}${y.g ? ` · ${y.g} gols` : ''}`;
    if (young[0]) { const y = young[0], s = ps(S, y.id);
      s.mv = Math.round(s.mv * 1.3 / 100) * 100; s.mor = clamp(s.mor + 10, 0, 100);
      out.rev = { id: y.id, club: y.club, div: y.div, label: AW_NAME.rev, value: yv(y), line: `${y.j} jogos · ${y.g} gols · ${y.as} assist. · nota ${y.r.toFixed(2)}`, boost: 1.3, fin: young.slice(0, 3).map(z => ({ id: z.id, club: z.club, value: yv(z) })) };
      awBadge(y.club, `${AW_NAME.rev}: ${P[y.id].short}`, S.season); }
    if (!quiet) announceAwards(S, out);
    return out;
  }
  function announceAwards(S, out, season) {
    const se = season || S.season;
    for (const k of Object.keys(out).filter(k => /^(cra|gar|art|gol|rev)/.test(k))) { const x = out[k]; if (!x || x.id == null) continue;
      news(S, { t: 'award', title: `${x.label} ${se}: ${P[x.id].name}`, body: `${x.club} · ${x.value}. Valor de mercado sobe ${Math.round((x.boost - 1) * 100)}%.`, ids: [x.id], clubs: [x.club], front: k === 'cra' ? 88 : k === 'rev' ? 60 : 0 }); }
    for (const k of Object.keys(out).filter(k => /^tec/.test(k))) { const t = out[k]; news(S, { t: 'award', title: `${t.label || 'Prancheta de Ouro'} ${se}: ${t.coach}`, body: `${t.club} · ${t.value}.`, clubs: [t.club], coachIds: t.tok ? [t.tok] : [], front: t.tok ? 90 : 0 }); }
    for (const k of Object.keys(out).filter(k => /^xi/.test(k))) { const t = out[k]; news(S, { t: 'award', title: `${t.label || 'Seleção da Temporada'} ${se}`, body: t.xi.map(x => `${P[x.id].short} (${x.club})`).join(', ') + '.', ids: t.xi.map(x => x.id), clubs: [...new Set(t.xi.map(x => x.club))] }); }
  }

  // Má fase é medida só nas partidas da liga; resultados de copa não entram na conta.
  function leagueForm(S, club, div, count = 6) {
    const form = [];
    for (let k = Math.min((S.slot || 0) - 1, SEASON.SLOTS - 1); k >= 0 && form.length < count; k--) {
      const m = (S.played && S.played[k] || []).find(x => x.comp === div && (x.h === club || x.a === club));
      if (!m) continue;
      const own = m.h === club ? m.gh : m.ga, rival = m.h === club ? m.ga : m.gh;
      form.push(own > rival ? 'V' : own < rival ? 'D' : 'E');
    }
    return form;
  }
  function startVacancy(S, club, d, name) {
    S.vacant = S.vacant || {};
    const interim = name || realCoach(S, club, `${S.season}-${d}-interino`);
    S.coaches[club] = { name: interim, since: S.season, interim: true };
    S.vacant[club] = { since: d, until: d + 5 + (hash(`${S.seed}|${S.season}|${d}|${club}|vaga`) % 3), season: S.season };
    if (S.aiTac) delete S.aiTac[club];
    return interim;
  }

  // ---------- perfil do treinador (coletivas) ----------
  // x: temperamento (−1 sereno … +1 explosivo) · y: comando (−1 protetor … +1 exigente) · o: postura (−1 pragmático … +1 ousado)
  const TONE_VEC = {
    confiante: [0, 0, 1], diplomatica: [-1, 0, 0], cautelosa: [-0.7, 0, -1], irritado: [1, 0.2, 0], agressiva: [1, 0.2, 0], provocador: [1, 0, 0.6],
    motivacional: [0.3, -0.7, 0.3], autocritico: [-0.3, -0.6, -0.3], protetor: [0, -1, 0], cobranca: [0.3, 1, 0], critica: [0.3, 1, 0], respeito: [-0.8, 0, -0.2],
    juiz: [0.6, 0, 0], juizatk: [1, 0, 0.2], juizbom: [-0.6, 0, 0], juizneu: [-0.4, 0, 0], gramado: [0.3, 0, -0.2], pubcobra: [0.3, 0.6, 0], pubentende: [-0.3, -0.6, 0]
  };
  const TPF_DECAY = 0.97, TPF_MIN = 15;
  const TPF_ARCH = {
    diplomata: { l: 'Diplomata', d: 'Sereno e protetor: administra vaidades e segura o ambiente.', c: 'var(--mint)', i: 'handshake' },
    gestor: { l: 'Gestor', d: 'Sereno e exigente: método, cobrança e resultado.', c: 'var(--blue)', i: 'tactic' },
    paizao: { l: 'Paizão', d: 'Intenso e protetor: veste a camisa junto com o elenco.', c: 'var(--yellow)', i: 'heart' },
    xerife: { l: 'Comandante', d: 'Intenso e exigente: sacode o grupo quando a coisa aperta.', c: 'var(--coral)', i: 'whistle' },
    equilibrado: { l: 'Equilibrado', d: 'Sem extremos: se adapta ao que o momento pede.', c: 'var(--stone)', i: 'user' }
  };
  function tpfEmpty() { return { x: 0, y: 0, o: 0, a: 0, w: 0, n: 0 }; }
  // primeira vez: parte das coletivas já respondidas (pressTones guarda a contagem recente de cada tom)
  function tpfSeed(d) {
    const T = tpfEmpty(), tn = d.pressTones || {};
    let tot = 0; for (const k in tn) if (TONE_VEC[k]) tot += tn[k];
    if (tot > 0) { for (const k in tn) { const v = TONE_VEC[k]; if (!v) continue; const w = tn[k]; T.x += v[0] * w; T.y += v[1] * w; T.o += v[2] * w; T.a += Math.hypot(v[0], v[1]) * w; T.w += w; }
      T.n = Math.max(Math.round(tot), Math.min(60, (d.pressUsed || []).length)); }
    return T;
  }
  function tpfAdd(S, k) {
    const v = TONE_VEC[k]; if (!v) return;
    const d = S.desks && S.desks[S.__me]; if (!d) return;
    const T = d.tpf || tpfSeed(d);
    for (const f of ['x', 'y', 'o', 'a', 'w']) T[f] = (T[f] || 0) * TPF_DECAY;
    T.x += v[0]; T.y += v[1]; T.o += v[2]; T.a += Math.hypot(v[0], v[1]); T.w += 1; T.n = (T.n || 0) + 1;
    d.tpf = T;
  }
  // leitura: posição no mapa, arquétipo e constância
  function coachProfile(d) {
    const T = (d && d.tpf) || (d ? tpfSeed(d) : tpfEmpty());
    if (!T.w) return { n: 0, x: 0, y: 0, o: 0, ready: false, arch: null, firm: 0 };
    const x = T.x / T.w, y = T.y / T.w, o = T.o / T.w, mag = Math.hypot(x, y), firm = T.a ? Math.min(1, mag / (T.a / T.w)) : 0;
    const arch = mag < 0.22 ? 'equilibrado' : x <= 0 ? (y <= 0 ? 'diplomata' : 'gestor') : (y <= 0 ? 'paizao' : 'xerife');
    return { n: T.n || 0, x, y, o, mag, firm, ready: (T.n || 0) >= TPF_MIN, arch, A: TPF_ARCH[arch], firmL: firm >= 0.6 ? 'perfil firme' : firm >= 0.35 ? 'perfil em definição' : 'perfil oscilante', ousL: o >= 0.25 ? 'Ousado' : o <= -0.25 ? 'Pragmático' : null };
  }
  function coachJobsTick(S, d) {
    if (S.coachJobsDay && S.coachJobsDay.season === S.season && S.coachJobsDay.d === d) return;
    S.coachJobsDay = { season: S.season, d };
    S.vacant = S.vacant || {};
    S.coachLastChange = S.coachLastChange || {};
    // Uma liga já em andamento pode ter interinos da versão anterior sem prazo de vaga.
    for (const c of [...(S.divA || []), ...(S.divB || [])]) {
      if (!Wd.isHuman(S, c) && S.coaches[c] && S.coaches[c].interim && !S.vacant[c])
        S.vacant[c] = { since: d, until: d + 5, season: S.season };
    }
    // Gravações antigas guardavam apenas o dia da demissão e deixavam o clube sem comandante.
    for (const [c, raw] of Object.entries(S.vacant)) {
      if (Wd.isHuman(S, c)) { delete S.vacant[c]; continue; }
      const v = typeof raw === 'number' ? { since: raw, until: raw + 5, season: S.season } : raw;
      if (!v || typeof v.until !== 'number') { delete S.vacant[c]; continue; }
      S.vacant[c] = v;
      if (!S.coaches[c] || !S.coaches[c].interim) {
        S.coaches[c] = { name: realCoach(S, c, `${d}-interino`), since: S.season, interim: true };
        if (S.aiTac) delete S.aiTac[c];
      }
      if (v.season !== S.season || d >= v.until) {
        const name = realCoach(S, c, `${S.season}-${d}-efetivo`);
        S.coaches[c] = { name, since: S.season };
        S.coachLastChange[c] = { season: S.season, d };
        delete S.vacant[c];
        if (S.aiTac) delete S.aiTac[c];
        news(S, { t: 'coach', title: `${c} anuncia ${name} como novo técnico`, body: 'O período de trabalho do interino terminou.', clubs: [c], minor: true });
      }
    }
    for (const div of ['B', 'A']) {
      const clubs = S[`div${div}`] || [], table = S.comp && S.comp[div] && S.comp[div].table;
      if (!table || Object.keys(S.vacant).filter(c => clubs.includes(c)).length >= (div === 'B' ? 3 : 2)) continue;
      const standings = SEASON.standings(table), candidates = [];
      for (const [i, row] of standings.entries()) {
        const c = row.c, last = S.coachLastChange[c];
        if (Wd.isHuman(S, c) || S.vacant[c] || !S.coaches[c] || S.coaches[c].interim || row.j < 7) continue;
        if (last && last.season === S.season && d - last.d < 10) continue;
        const form = leagueForm(S, c, div), wins = form.filter(x => x === 'V').length, losses = form.filter(x => x === 'D').length;
        if (form.length < 6 || wins > 1 || losses < 3) continue;
        const pos = i + 1, expected = S.obj && S.obj[c] && S.obj[c].rank;
        if (pos <= Math.floor(clubs.length / 2) && !(expected && pos >= expected + 4)) continue;
        const chance = Math.min(0.8, (div === 'B' ? 0.24 : 0.19) + (wins === 0 ? 0.17 : 0) + (losses >= 5 ? 0.14 : 0) + (pos > clubs.length - 4 ? 0.12 : 0));
        candidates.push({ c, chance, score: losses * 3 - wins * 2 + pos / 4 });
      }
      candidates.sort((a, b) => b.score - a.score);
      for (const { c, chance } of candidates) {
        if (R(`demissao|${S.seed}|${S.season}|${d}|${c}`)() >= chance) continue;
        const old = S.coaches[c].name;
        const interim = startVacancy(S, c, d);
        news(S, { t: 'coach', title: `${c} demite ${old} após má fase`, body: `${interim} assume interinamente. O clube abriu uma vaga e vai ouvir treinadores reais antes de contratar um substituto.`, clubs: [c], front: 80 });
        spreadVacancy(S, c, null);
        break; // no máximo uma demissão por divisão e por dia
      }
    }
  }
  // treinador brasileiro real plausível pro nível do clube (quando um humano sai)
  function realCoach(S, club, seed) {
    const inUse = new Set(Object.values(S.coaches || {}).filter(Boolean).map(c => c.name));
    const inA = S.divA.includes(club), rank = S.obj && S.obj[club] ? S.obj[club].rank : 10;
    const tier = inA && rank <= 8 ? 'top' : inA ? 'mid' : 'low';
    const order = tier === 'top' ? ['top', 'mid'] : tier === 'mid' ? ['mid', 'top', 'low'] : ['low', 'mid'];
    const r = R(`rc${club}${seed}`);
    for (const t of order) { const free = C.REAL_COACHES[t].filter(n => !inUse.has(n)); if (free.length) return C.pick(free, r); }
    return C.coachName(r, 'BRA');
  }
  // ---------- técnico: demissão e vagas ----------
  function resign(S) {
    const c = S.club;
    const name = realCoach(S, c, S.lastDay);
    startVacancy(S, c, S.lastDay || 0, name);
    S.unemployed = c;
    news(S, { t: 'coach', title: `${S.manager} pede demissão do ${c}`, body: `${name} assume interinamente o ${c}. ${S.manager} está no mercado.`, clubs: [c] });
    offersForFired(S, c); spreadVacancy(S, c);
  }
  // ADM sem time: deixa o clube (vira vaga) e segue só administrando a liga
  function becomeSpect(S) {
    const c = S.club && !S.unemployed ? S.club : null;
    if (c) { const name = realCoach(S, c, S.lastDay); startVacancy(S, c, S.lastDay || 0, name);
      news(S, { t: 'coach', title: `${S.manager} deixa o ${c} e segue só como ADM da liga`, body: `${name} assume interinamente. A vaga está aberta pra quem quiser.`, clubs: [c] }); spreadVacancy(S, c); }
    S.club = null; S.unemployed = 'ADM'; S.spect = 1; S.jobOffers = []; S.job = null;
  }
  // ---------- conserto: dois treinadores no mesmo clube (corrida no sorteio/proposta) — só o servidor aplica ----------
  // Fica quem está registrado como técnico do clube (ou quem entrou primeiro); o outro vai pra um clube livre da mesma divisão.
  function dupClubFix(S) {
    // treinador removido pelo dono (mesa apagada direto no banco): o clube volta pra um técnico da IA
    for (const [c, co] of Object.entries(S.coaches || {})) if (co && co.user && co.token && !(S.desks || {})[co.token]) { S.coaches[c] = { name: realCoach(S, c, `${S.season}-${S.lastDay}-orfao`), since: S.season }; if (S.aiTac) delete S.aiTac[c]; }
    const by = {};
    for (const [t, d] of Object.entries(S.desks || {})) if (d && d.club && !d.unemployed && !d.spect) (by[d.club] = by[d.club] || []).push(t);
    for (const [club, L] of Object.entries(by)) {
      if (L.length < 2) continue;
      const off = S.coaches[club] && S.coaches[club].token;
      L.sort((a, b) => (a === off ? -1 : b === off ? 1 : (S.desks[a].joined || 0) - (S.desks[b].joined || 0) || (a < b ? -1 : 1)));
      for (const t of L.slice(1)) {
        const dv = Wd.divOf(S, club), free = Wd.choicePool(S);
        const same = free.filter(c => Wd.divOf(S, c) === dv), pool = same.length ? same : free;
        const d = S.desks[t];
        if (!pool.length) { Wd.asDesk(S, t, () => { S.unemployed = club; S.job = { st: 'fired', club, why: 'dup' }; offersForFired(S, club); news(S, { t: 'coach', title: 'Clube já tinha técnico', body: `O ${club} já tinha outro treinador da liga. Você ficou sem clube: veja as propostas e vagas abertas.`, clubs: [club], desk: t }); }); continue; }
        const nc = pool[hash(`dup|${S.seed}|${t}|${club}`) % pool.length];
        d.club = nc; d.job = null; d.jobOffers = [];
        S.coaches[nc] = { name: d.manager, user: true, token: t, since: S.season };
        if (S.vacant) delete S.vacant[nc];
        if (S.coaches[club] && S.coaches[club].token !== L[0]) S.coaches[club] = { name: S.desks[L[0]].manager, user: true, token: L[0], since: S.season };
        Wd.asDesk(S, t, () => news(S, { t: 'coach', title: `Ajuste no sorteio: você agora comanda o ${nc}`, body: `Dois treinadores caíram no ${club} ao mesmo tempo e o clube ficou com quem chegou primeiro. Você foi realocado pro ${nc}, da Série ${Wd.divOf(S, nc) || dv}.`, clubs: [nc], desk: t }));
        S.audit = S.audit || { al: [], seen: {}, snap: {} }; S.audit.al = S.audit.al || [];
        S.audit.al.unshift({ t: Date.now(), s: S.season, d: S.lastDay || 0, k: S.slot || 0, a: 'dupclube', c: nc, w: d.manager, x: `${d.manager} estava no ${club} junto com ${S.desks[L[0]].manager}; foi realocado pro ${nc}.` });
      }
    }
  }
  // ---------- inatividade: 2 dias sem entrar = cargo balançando; 3 dias = demissão (só o servidor aplica) ----------
  const IDLE_WARN = 48 * 3600e3, IDLE_FIRE = 72 * 3600e3;
  // v147: liga Normal (28 dias) é mais lenta: 4 dias = aviso, 5 dias = demissão; Turbo segue 2 e 3 dias
  const idleLim = S => SEASON.isTurbo(S) ? { w: IDLE_WARN, f: IDLE_FIRE, wd: 2, fd: 3 } : { w: 96 * 3600e3, f: 120 * 3600e3, wd: 4, fd: 5 };
  function idleTick(S, now) {
    if (!S.desks || (SEASON.paused && SEASON.paused(S))) return;
    if (Wd.isSolo(S)) return;   // v185: Single Player não demite por abandono (ninguém vai pegar a vaga)
    const LIM = idleLim(S);
    for (const t of Object.keys(S.desks)) {
      const d = S.desks[t]; if (!d || d.spect || d.unemployed || !d.club) continue;
      if (d.seen == null) { d.seen = now; continue; }   // começa a contar a partir de agora
      const idle = now - d.seen, I = d.idle || {};
      if (idle >= LIM.f && I.fired !== d.seen) {
        Wd.asDesk(S, t, () => {
          const c = S.club, name = realCoach(S, c, S.lastDay);
          startVacancy(S, c, S.lastDay || 0, name);
          S.unemployed = c; S.job = { ...(S.job || {}), st: 'fired', club: c, why: 'idle' };
          news(S, { t: 'coach', title: `${c} demite ${S.manager} por abandono`, body: `O treinador ficou ${LIM.fd} dias sem aparecer. ${name} assume interinamente e a vaga está aberta pra quem quiser.`, clubs: [c], front: 85 });
          news(S, { t: 'coach', title: 'Você foi demitido por inatividade', body: `Foram ${LIM.fd} dias sem entrar no jogo. O ${c} contratou um interino. As propostas e vagas abertas estão na tela inicial.`, clubs: [c], desk: t });
          S.idle = { fired: d.seen, at: now, club: c };
          offersForFired(S, c); spreadVacancy(S, c);
        });
      } else if (idle >= LIM.w && idle < LIM.f && I.warn !== d.seen) {
        Wd.asDesk(S, t, () => {
          news(S, { t: 'coach', title: `Diretoria do ${S.club} cobra presença de ${S.manager}`, body: `O treinador está há ${LIM.wd} dias sem aparecer. Se passar de ${LIM.fd} dias, ele perde o cargo.`, clubs: [S.club] });
          news(S, { t: 'coach', title: 'Seu cargo está balançando', body: `Você está há ${LIM.wd} dias sem entrar. Se completar ${LIM.fd} dias, a diretoria vai te demitir por abandono.`, clubs: [S.club], desk: t });
          S.idle = { ...(S.idle || {}), warn: d.seen, at: now };
        });
      }
    }
  }
  // v221: ADM sumido: depois do mesmo prazo da demissão por abandono (Turbo 3 dias, Normal 5), a administração passa pro
  // treineiro mais antigo da liga que entrou nas últimas 48h. Só o servidor aplica (relógio real). O banco confirma quando o novo ADM abre o app.
  function admTick(S, now) {
    const L = S.league; if (!L || !L.admin || !S.desks || Wd.isSolo(S) || (SEASON.paused && SEASON.paused(S))) return;
    const a = S.desks[L.admin], LIM = idleLim(S);
    if (a && (a.seen == null || now - a.seen < LIM.f)) return;
    const cand = Object.entries(S.desks).filter(([t, d]) => t !== L.admin && d && d.seen && now - d.seen < 48 * 3600e3 && d.manager)
      .sort(([ta, x], [tb, y]) => (x.joined || 0) - (y.joined || 0) || (ta < tb ? -1 : 1));
    if (!cand.length) return;
    const [t, d] = cand[0], old = a ? a.manager : 'O ADM';
    L.admPrev = L.admin; L.admin = t; L.admAt = now; L.admWhy = 'auto';
    news(S, { t: 'coach', front: 90, title: `${d.manager} é o novo ADM da liga`, body: `${old} ficou ${LIM.fd} dias sem entrar. A administração passou pro treineiro mais antigo da liga em atividade.` });
    Wd.asDesk(S, t, () => news(S, { t: 'coach', front: 96, title: 'Você agora é o ADM da liga', body: `${old} ficou ${LIM.fd} dias sem entrar e a administração passou pra você, o treineiro mais antigo em atividade. O painel do ADM já está no seu menu: dá pra pausar, adiantar o relógio, reservar vagas e passar a administração pra outra pessoa.`, desk: t }));
  }
  // ---------- dança das cadeiras ----------
  // proposta de emprego (fica na mesa do treinador até assumir, recusar ou vencer)
  function offerJob(S, club, kind) {
    if (S.spect) return;   // ADM sem time não recebe propostas
    if (Wd.leagueDivs && !Wd.leagueDivs(S).includes(Wd.divOf(S, club))) return;   // só clubes das divisões abertas na liga
    if (Wd.vagas && Wd.vagas(S)[club]) return;   // vaga reservada pelo ADM (código de vaga)
    if (!club || Wd.isHuman(S, club) || club === S.club || !Wd.divOf(S, club)) return;   // Série D não tem vaga (sem calendário nacional)
    S.jobOffers = (S.jobOffers || []).filter(o => o.club !== club);
    S.jobOffers.push({ club, kind, s: S.season, exp: Math.min(SEASON.SLOTS - 1, (S.slot || 0) + (kind === 'vaga' ? 16 : 12)) });
    const div = (Wd.divOf(S, club) || 'B');
    news(S, { t: 'coach', title: `${club} quer ${S.manager}`, body: `${kind === 'vaga' ? `O clube da Série ${div} está sem técnico e fez uma proposta.` : `A diretoria da Série ${div} procurou ${S.manager} para comandar o time.`} A proposta está no início do app.`, clubs: [club], desk: S.__me, front: 88 });
  }
  function validOffers(S) { return (S.jobOffers || []).filter(o => o.s === S.season && (S.slot || 0) <= o.exp && !Wd.isHuman(S, o.club) && o.club !== S.club && (o.kind !== 'vaga' || !!(S.vacant && S.vacant[o.club]) || !!(S.coaches[o.club] && S.coaches[o.club].interim))); }
  // clube que ficou sem técnico humano: vira proposta para os outros treinadores da liga (desempregados ou em clube menor)
  function spreadVacancy(S, club, exclude = S.__me) {
    if (!Wd.divOf(S, club)) return;
    const val = Wd.squadValue(S, club), inA = S.divA.includes(club);
    Wd.forDesks(S, t => { if (t === exclude) return; if (S.unemployed) return offerJob(S, club, 'vaga'); const mine = S.divA.includes(S.club);
      if ((inA && !mine) || (inA === mine && Wd.squadValue(S, S.club) <= val * (inA ? 1 : 1.25))) offerJob(S, club, 'vaga'); });
  }
  // quem sai (demitido ou pedindo demissão) já recebe propostas da Série B, de preferência dos clubes de elenco real
  function offersForFired(S, from) {
    const free = c => !Wd.isHuman(S, c) && c !== from;
    const rel = Object.keys(C.CLUBS_REL || {}).filter(c => S.divB.includes(c) && free(c));
    const r = R(`jobs${S.seed}${S.season}${S.slot}${from}`), sh = a => a.map(x => [x, r()]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
    const pick = sh(rel).slice(0, 2);
    const others = S.divB.filter(c => free(c) && !pick.includes(c)).sort((a, b) => Wd.squadValue(S, b) - Wd.squadValue(S, a));
    for (const c of [...pick, ...others].slice(0, 3)) offerJob(S, c, 'proposta');
  }
  // demitido pela diretoria (modo Realista): mesmo fluxo do pedido de demissão
  function fire(S, why) {
    const c = S.club;
    const name = realCoach(S, c, S.lastDay);
    startVacancy(S, c, S.lastDay || 0, name);
    S.unemployed = c;
    news(S, { t: 'coach', title: `${c} demite ${S.manager}`, body: `${why || 'A diretoria perdeu a paciência.'} ${name} assume interinamente. ${S.manager} está no mercado.`, clubs: [c], front: 99 });
    offersForFired(S, c); spreadVacancy(S, c);
  }
  // aceitar proposta: sai do clube atual (se tiver) e assume o novo
  function acceptOffer(S, club) {
    if (!validOffers(S).some(o => o.club === club)) return { ok: false, msg: 'Esta proposta já não está disponível.' };
    if (Wd.isHuman(S, club)) return { ok: false, msg: 'Outro treinador já assumiu esse clube.' };
    const old = S.unemployed ? null : S.club;
    if (old) {
      const name = realCoach(S, old, (S.lastDay || 0) + 7);
      startVacancy(S, old, S.lastDay || 0, name);
      news(S, { t: 'coach', title: `${S.manager} deixa o ${old} e acerta com o ${club}`, body: `${name} assume o ${old} interinamente.`, clubs: [old, club], front: 92 });
    }
    takeJob(S, club);
    if (old) spreadVacancy(S, old);
    return { ok: true, msg: `Bem-vindo ao ${club}!` };
  }
  function vacancies(S) {
    const out = Object.keys(S.vacant || {}).filter(c => c !== S.unemployed);
    for (const c of Wd.brClubs(S)) if (S.coaches[c] && S.coaches[c].interim && c !== S.unemployed && !out.includes(c)) out.push(c);
    return out;
  }
  function takeJob(S, club) {
    const wasOuro = S.unemployed ? MARKET.isOuroClub(S, S.unemployed) : MARKET.isOuroClub(S, S.club);
    const from = S.unemployed, prevCoach = S.coaches[club] && !S.coaches[club].user && !S.coaches[club].interim ? S.coaches[club].name : null;
    { const div = (Wd.divOf(S, club) || 'B'), tb = S.comp && S.comp[div] ? SEASON.standings(S.comp[div].table) : null, i = tb ? tb.findIndex(r => r.c === club) : -1;
      S.savior = tb && i >= 0 && (tb[i].j || 0) >= 10 && i + 1 > tb.length - 4 ? { club, season: S.season, pos: i + 1 } : null; }
    S.club = club; S.unemployed = null;
    try { SEASON.famaStart(S, true); } catch (e) {}   // v205: fama conta a partir daqui
    S.jobOffers = []; S.job = null; S.opr = null; S.fans = 55; S.board = 60; S.plog = [];
    if (prevCoach) news(S, { t: 'coach', title: `${club} demite ${prevCoach} para contratar ${S.manager}`, clubs: [club], minor: true });
    void from;
    if (S.vacant) delete S.vacant[club];
    S.coaches[club] = { name: S.manager, user: true, token: S.__me, since: S.season };
    S.coachLastChange = S.coachLastChange || {};
    S.coachLastChange[club] = { season: S.season, d: S.lastDay || 0 };
    const t = SEASON.aiTac(S, club);
    S.tactics = { formation: t.formation, style: t.style, xi: [], triggers: S.tactics.triggers, auto: true };
    S.wageBudget = null; S.offers = []; S.negs = {};
    news(S, { t: 'coach', title: `${S.manager} é o novo técnico do ${club}`, clubs: [club] });
    try { MARKET.gemSwitch(S, wasOuro, club); } catch (e) {}
  }

  // respostas atrasadas (ex.: técnico rival rebate uma declaração sua)
  function schedule(S, item, delayMs) { S.pending = S.pending || []; S.pending.push({ at: SEASON.now(S) + delayMs * (S.speed > 1 ? S.speed : 1), item }); }
  function flush(S) {
    if (!S.pending || !S.pending.length) return false;
    const t = SEASON.now(S), due = S.pending.filter(p => p.at <= t);
    if (!due.length) return false;
    S.pending = S.pending.filter(p => p.at > t);
    for (const p of due) news(S, p.item);
    return true;
  }
  function rivalReply(S, club, tone) {
    const coach = S.coaches[club] ? S.coaches[club].name : `O técnico do ${club}`;
    const r = R(`rep${club}${S.lastDay}${tone}`);
    const q = tone === 'provocacao' || tone === 'polemica'
      ? C.pick([`Quem fala demais costuma perder em campo. A resposta a gente dá no gramado.`, `${S.manager} precisa se preocupar com o time dele.`, `Anotei tudo. Vou pregar no vestiário.`, `Não vou perder tempo respondendo. Nosso trabalho fala por si.`], r)
      : C.pick([`Respeito o ${S.club}, mas cada um cuida da sua casa.`, `Agradeço as palavras. Vai ser um grande jogo.`], r);
    schedule(S, { t: 'press', who: coach, title: `${coach} rebate ${S.manager}: "${q}"`, body: `O técnico do ${club} respondeu à declaração do comandante do ${S.club}.`, clubs: [club, S.club], front: 85 }, 25000);
  }

  return { admTick, idleLim, dupClubFix, becomeSpect, idleTick, IDLE_WARN, IDLE_FIRE, TONE_VEC, TPF_ARCH, TPF_MIN, tpfAdd, coachProfile, hwg, tvDebtPay, godList, godFire, fdTick, highlights, realCoach, coachJobsTick, news, matchNews, flush, schedule, rivalReply, injuryNews, callups, daily, awards, announceAwards, resign, fire, vacancies, takeJob, acceptOffer, validOffers, offerJob };
})();
