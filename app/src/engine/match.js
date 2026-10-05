// Origem: reference/match.js (convertido na Fase 1, lógica inalterada). A partir da Fase 2 este arquivo é FONTE: edite aqui.
import { CORE } from './core.js';
// ===== TREINEIROS v3 · simulação de partida =====
// Minuto a minuto: posse, finalizações, faltas, cartões (conforme o árbitro), lesões,
// desgaste, substituições automáticas e mudanças táticas pré-definidas (gatilhos).
export const SIM = (() => {
  const C = CORE;
  const { FORMATIONS, SETOR_OF, STYLES, fit, clamp, pickW } = C;
  const BASE_XG = 1.1, HOME = 1.16, AWAY = 0.88, K_ATT = 19, K_MID = 40;
  const RIGOR = [0.6, 0.8, 1, 1.25, 1.55];

  // info(id) -> {ovr, pos, cond, mor, form, age}
  function mkTeam(t, info) {
    const slots = FORMATIONS[t.formation];
    return {
      club: t.club, formation: t.formation, style: t.style || 'equilibrado', triggers: t.triggers || {}, fired: {},
      on: t.xi.map((id, i) => id == null ? null : { id, slot: slots[i][0], cond: info(id).cond }),
      bench: (t.bench || []).slice(), subs: 0, out: new Set(), info, pk: t.pk != null ? t.pk : null,
    };
  }
  // desgaste por minuto em campo (90 min no estilo Equilibrado ≈ 28 de condição)
  const DRAIN = 0.3;
  function effOf(T, pl) {
    const I = T.info(pl.id);
    const condF = C.condF(pl.cond);
    const morF = 0.95 + 0.1 * I.mor / 100;   // moral vale ±5%
    const formF = 1 + clamp(I.form - 6.5, -2, 2) * 0.012;
    return I.ovr * C.fitI(I, pl.slot) * condF * morF * formF;
  }
  function rate(T) {
    const acc = { GOL: [], DEF: [], MEI: [], ATA: [] };
    for (const [i, pl] of T.on.entries()) {
      const slot = FORMATIONS[T.formation][i][0];
      acc[SETOR_OF[slot]].push(pl ? effOf(T, pl) : 28);
    }
    const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 40;
    const r = { GOL: avg(acc.GOL), DEF: avg(acc.DEF), MEI: avg(acc.MEI), ATA: avg(acc.ATA) };
    const st = STYLES[T.style];
    let midB = st.mid;
    if (T.style === 'tikitaka') midB = clamp(4 * (r.MEI - 66) / 8, -3, 6);
    let attB = st.att;
    if (T.style === 'direto') attB = r.ATA >= r.MEI ? 2.5 : -1;
    if (T.style === 'pontas') {
      const W = [], O = [];
      for (const [i, pl] of T.on.entries()) { const sl = FORMATIONS[T.formation][i][0]; const v = pl ? effOf(T, pl) : 28; (['PE', 'PD', 'ME', 'MD', 'LE', 'LD', 'ADE', 'ADD'].includes(sl) ? W : O).push(v); }
      const a = x => x.length ? x.reduce((p, q) => p + q, 0) / x.length : 60;
      attB = W.length ? clamp((a(W) - a(O)) / 3 + 1.5, -2, 4.5) : -2;
    }
    r.att = 0.65 * r.ATA + 0.35 * r.MEI + attB;
    r.def = 0.6 * r.DEF + 0.25 * r.GOL + 0.15 * r.MEI + st.def;
    r.mid = r.MEI + midB;
    r.ovr = avg([...acc.GOL, ...acc.DEF, ...acc.MEI, ...acc.ATA]);
    return r;
  }
  // torcida: casa cheia empurra o time da casa; estádio vazio tira parte do fator casa
  const crowdPush = occ => occ == null ? 0 : clamp((occ - 0.7) * 0.12, -0.04, 0.036);
  function numbers(H, A, neutral, occ) {
    const rh = rate(H), ra = rate(A);
    const sh = STYLES[H.style], sa = STYLES[A.style];
    let poss = clamp(50 + (rh.mid - ra.mid) * 1.2 + sh.poss - sa.poss, 24, 76);
    const cp = neutral ? 0 : crowdPush(occ);
    const home = neutral ? 1 : HOME * (1 + cp), away = neutral ? 1 : AWAY * (1 - cp * 0.5);
    let xh = BASE_XG * home * Math.exp((rh.att - ra.def) / K_ATT + (rh.mid - ra.mid) / K_MID) * sh.xgF * sa.xgA;
    let xa = BASE_XG * away * Math.exp((ra.att - rh.def) / K_ATT + (ra.mid - rh.mid) / K_MID) * sa.xgF * sh.xgA;
    if (H.style === 'contra' && poss < 45) xh *= 1.12;
    if (A.style === 'contra' && poss > 55) xa *= 1.12;
    const redH = H.on.filter(x => !x).length, redA = A.on.filter(x => !x).length;
    return { rh, ra, poss, xh: clamp(xh, 0.12, 4.5), xa: clamp(xa, 0.12, 4.5), redH, redA };
  }
  // quem finaliza/marca
  function pickShooter(T, r, exclude) {
    const ids = [], w = [];
    T.on.forEach((pl, i) => {
      if (!pl || pl.id === exclude) return;
      const slot = FORMATIONS[T.formation][i][0];
      let base = { GOL: 0, DEF: 0.35, MEI: 1.4, ATA: 3.2 }[SETOR_OF[slot]];
      if (slot === 'CA') base = 4; if (slot === 'MEI' || slot === 'SA') base = 2.2;
      ids.push(pl.id); w.push(base * Math.pow(T.info(pl.id).ovr / 75, 2) + 0.001);
    });
    return pickW(ids, w, r);
  }
  function pickAssist(T, r, scorer) {
    const ids = [], w = [];
    T.on.forEach((pl, i) => {
      if (!pl || pl.id === scorer) return;
      const st = SETOR_OF[FORMATIONS[T.formation][i][0]];
      if (st === 'GOL') return;
      ids.push(pl.id); w.push({ DEF: 1, MEI: 3, ATA: 2 }[st] * T.info(pl.id).ovr / 75);
    });
    return ids.length ? pickW(ids, w, r) : null;
  }
  function anyOn(T, r) { const on = T.on.filter(Boolean); return on.length ? on[Math.floor(r() * on.length)] : null; }
  function gk(T) { return T.on[0] ? T.on[0].id : null; }

  // troca de formação no meio do jogo: reencaixa os 11 em campo
  function reshape(T, formation) {
    const slots = FORMATIONS[formation];
    const players = T.on.map((pl, i) => pl ? { ...pl } : null).filter(Boolean);
    const next = new Array(slots.length).fill(null), used = new Set();
    const order = slots.map((s, i) => i).sort((a, b) => (slots[a][0] === 'GOL' ? -1 : 0) - (slots[b][0] === 'GOL' ? -1 : 0));
    for (const i of order) {
      let best = null, bv = -1;
      for (const pl of players) { if (used.has(pl.id)) continue; const v = T.info(pl.id).ovr * C.fitI(T.info(pl.id), slots[i][0]); if (v > bv) { bv = v; best = pl; } }
      if (best) { used.add(best.id); next[i] = { ...best, slot: slots[i][0] }; }
    }
    // mantém o mesmo número de jogadores (expulsos continuam fora)
    T.formation = formation; T.on = next;
  }

  function simulate(home, away, opts) {
    const r = C.rng(opts.seed);
    const info = opts.info;
    const H = mkTeam(home, info), A = mkTeam(away, info);
    const ref = opts.referee || C.REFEREES[0];
    const rig = RIGOR[ref.rigor - 1];
    const ev = [];
    const pl = {}; // id -> {side,min,rt,g,a,yc,rc,inj,start,end,sv}
    const addPl = (T, s, p, m) => { pl[p.id] = pl[p.id] || { side: s, min: 0, rt: 6.0, g: 0, a: 0, yc: 0, rc: 0, inj: false, sv: 0, from: m, pos: p.slot }; };
    H.on.forEach(p => p && addPl(H, 'h', p, 0)); A.on.forEach(p => p && addPl(A, 'a', p, 0));
    const st = { poss: [0, 0], shots: [0, 0], sot: [0, 0], fouls: [0, 0], yc: [0, 0], rc: [0, 0], xg: [0, 0], corners: [0, 0] };
    let g = [0, 0];
    let N = numbers(H, A, opts.neutral, opts.crowd);
    const s1 = 1 + Math.floor(r() * 3), s2 = 2 + Math.floor(r() * 5);
    const minutes = [];
    for (let m = 1; m <= 45 + s1; m++) minutes.push({ m: Math.min(m, 45), x: Math.max(0, m - 45), half: 1 });
    for (let m = 46; m <= 90 + s2; m++) minutes.push({ m: Math.min(m, 90), x: Math.max(0, m - 90), half: 2 });
    const label = t => t.x ? `${t.m}+${t.x}` : `${t.m}`;
    const detailed = !!opts.detailed;
    const inj = opts.injMult || [1, 1];
    const log = (e) => ev.push(e);
    const recalc = () => { N = numbers(H, A, opts.neutral, opts.crowd); };

    function sub(T, s, outIdx, why, t) {
      if (T.subs >= 5 || !T.bench.length) return false;
      const out = T.on[outIdx]; if (!out) return false;
      const slot = FORMATIONS[T.formation][outIdx][0];
      let best = -1, bv = -1;
      // troca por cansaço: prefere quem está descansado no banco (não põe um cansado no lugar de outro)
      const fresh = why === 'cansaço' ? T.bench.filter(id => T.info(id).cond >= 70) : [];
      T.bench.forEach((id, j) => { const I = T.info(id); if (fresh.length && I.cond < 70) return; const v = I.ovr * C.fitI(I, slot) * C.condF(I.cond); if (v > bv) { bv = v; best = j; } });
      if (best < 0) return false;
      const inId = T.bench.splice(best, 1)[0];
      T.on[outIdx] = { id: inId, slot, cond: T.info(inId).cond };
      T.subs++;
      pl[out.id].end = t.m; T.out.add(out.id);
      addPl(T, s, T.on[outIdx], t.m); pl[inId].pos = slot;
      if (detailed) log({ m: label(t), t: 'sub', s, p: inId, o: out.id, why, slot: outIdx, f: T.formation });
      recalc();
      return true;
    }
    // expulsão: recompõe o time (goleiro reserva entra, ou alguém de linha vai pro gol; zagueiro expulso é reposto por quem está mais à frente)
    function afterRed(T, s, idx, t) {
      const slots = FORMATIONS[T.formation], sec = i => SETOR_OF[slots[i][0]], rank = { GOL: 0, DEF: 1, MEI: 2, ATA: 3 };
      const hole = slots[idx][0];
      if (sec(idx) === 'GOL') {
        const donors = T.on.map((p, i) => ({ p, i })).filter(o => o.p && sec(o.i) !== 'GOL')
          .sort((a, b) => rank[sec(b.i)] - rank[sec(a.i)] || effOf(T, a.p) - effOf(T, b.p));
        const d = donors[0]; if (!d) return;
        const gkB = T.bench.findIndex(id => T.info(id).pos === 'GOL');
        if (gkB >= 0 && T.subs < 5) {
          const inId = T.bench.splice(gkB, 1)[0];
          T.on[d.i] = null; T.out.add(d.p.id); pl[d.p.id].end = t.m;
          T.on[idx] = { id: inId, slot: 'GOL', cond: T.info(inId).cond }; T.subs++;
          addPl(T, s, T.on[idx], t.m); pl[inId].pos = 'GOL';
          log({ m: label(t), t: 'sub', s, p: inId, o: d.p.id, why: 'goleiro expulso', slot: idx, f: T.formation });
        } else {
          T.on[idx] = { ...d.p, slot: 'GOL' }; T.on[d.i] = null; pl[d.p.id].pos = 'GOL';
          log({ m: label(t), t: 'reorg', s, p: d.p.id, why: 'vai para o gol', slot: idx, f: T.formation });
        }
      } else if (sec(idx) === 'DEF' || sec(idx) === 'MEI') {
        const donors = T.on.map((p, i) => ({ p, i })).filter(o => o.p && rank[sec(o.i)] > rank[sec(idx)]);
        if (!donors.length) return;
        const d = donors.sort((a, b) => (T.info(b.p.id).ovr * C.fitI(T.info(b.p.id), hole) - rank[sec(b.i)] * 2) - (T.info(a.p.id).ovr * C.fitI(T.info(a.p.id), hole) - rank[sec(a.i)] * 2))[0];
        T.on[idx] = { ...d.p, slot: hole }; T.on[d.i] = null; pl[d.p.id].pos = hole;
        log({ m: label(t), t: 'reorg', s, p: d.p.id, why: `recua para ${hole}`, slot: idx, f: T.formation });
      }
    }
    // v199: formação nova deixou alguém fora do setor (ex.: 5-3-2 -> 4-3-1-2, sobra um zagueiro no meio):
    // se houver substituição e alguém do banco render mais naquela posição, troca
    function fixMisfits(T, s, t) {
      const slots = FORMATIONS[T.formation];
      const bad = T.on.map((p, i) => p ? { i, f: C.fitI(T.info(p.id), slots[i][0]) } : null).filter(x => x && x.f < 0.9 && slots[x.i][0] !== 'GOL').sort((a, b) => a.f - b.f);
      for (const { i } of bad) {
        if (T.subs >= 5 || !T.bench.length) break;
        const slot = slots[i][0], cur = T.on[i], curV = effOf(T, { ...cur, slot });
        const bestV = Math.max(...T.bench.map(id => { const I = T.info(id); return I.ovr * C.fitI(I, slot) * C.condF(I.cond); }));
        if (bestV > curV * 1.03) sub(T, s, i, 'mudança tática', t);
      }
    }
    function trigger(T, s, t, diff) {
      const tr = T.triggers; if (!tr) return;
      const fire = (k, style, formation, text) => {
        if (T.fired[k] || !style) return;
        T.fired[k] = true;
        const reshaped = formation && FORMATIONS[formation] && formation !== T.formation;
        if (reshaped) reshape(T, formation);
        T.style = style;
        log({ m: label(t), t: 'tactic', s, style, formation: T.formation, xi: T.on.map(p => p ? p.id : null), why: text });   // xi: quem ficou em cada posição (campinho)
        if (reshaped) fixMisfits(T, s, t);   // depois do registro da mudança: o campinho já está na formação nova quando a troca aparece
        recalc();
      };
      if (diff >= 2 && tr.lead2) fire('lead2', tr.lead2, tr.lead2f, 'vencendo por 2');
      if (t.m >= 60 && diff < 0 && tr.losing60) fire('losing60', tr.losing60, tr.losing60f, 'perdendo');
      if (t.m >= 75 && diff === 0 && tr.draw75) fire('draw75', tr.draw75, tr.draw75f, 'empate');
    }

    for (const t of minutes) {
      if (t.half === 2 && t.m === 46 && !t.x) {
        if (detailed) log({ m: '45', t: 'ht', s: '' });
      }
      const sides = [['h', H, A, 0], ['a', A, H, 1]];
      // gatilhos táticos
      trigger(H, 'h', t, g[0] - g[1]); trigger(A, 'a', t, g[1] - g[0]);
      st.poss[0] += N.poss; st.poss[1] += 100 - N.poss;
      for (const [s, T, O, k] of sides) {
        const S_ = STYLES[T.style];
        const xg = k === 0 ? N.xh : N.xa;
        const q = 0.105 * S_.shotQ;                  // xG médio por finalização
        const pShot = (xg / 93) / q;
        if (r() < pShot) {
          st.shots[k]++; st.xg[k] += q;
          const shooter = pickShooter(T, r);
          const scored = r() < q, annul = scored && r() < 0.07;
          if (annul) {
            // gol anulado pelo VAR (impedimento, mão ou falta no início da jogada)
            st.sot[k]++;
            log({ m: label(t), t: 'goal_off', s, p: shooter, why: C.pick(['impedimento', 'impedimento', 'toque de mão', 'falta no início da jogada'], r) });
          } else if (scored) {
            g[k]++; st.sot[k]++;
            const as = r() < 0.72 ? pickAssist(T, r, shooter) : null;
            pl[shooter].g++; pl[shooter].rt += SETOR_OF[pl[shooter].pos] === 'ATA' ? 1.0 : 1.25;
            if (as) { pl[as].a++; pl[as].rt += 0.65; }
            for (const x of T.on) if (x) pl[x.id].rt += 0.08;
            for (const x of O.on) if (x && ['GOL', 'DEF'].includes(SETOR_OF[x.slot])) pl[x.id].rt -= 0.18;
            const vq = r();
            log({ m: label(t), t: 'goal', s, p: shooter, a: as, ...(vq < 0.08 ? { v: 'chk' } : vq < 0.1 ? { v: 'late' } : {}) });
          } else if (r() < (0.36 - q) / (1 - q)) {
            st.sot[k]++;
            const keeper = gk(O);
            if (keeper) { pl[keeper].sv++; pl[keeper].rt += 0.22; }
            if (r() < 0.35) st.corners[k]++;
            if (detailed) log({ m: label(t), t: 'save', s, p: shooter, g: keeper });
          } else {
            if (r() < 0.25) st.corners[k]++;
            if (detailed && r() < 0.55) log({ m: label(t), t: 'miss', s, p: shooter });
          }
        }
        // pênaltis (às vezes via VAR) e checagens de VAR sem efeito
        if (r() < 0.0015) {
          let taker = pickShooter(T, r); const viaVar = r() < 0.3;
          if (T.pk != null && T.on.some(x => x && x.id === T.pk)) taker = T.pk;   // cobrador escolhido pelo treinador, se estiver em campo
          // quem comete: um defensor de linha adversário em campo (zagueiros e laterais pesam mais); perde nota
          let fouler = null; { const cand = O.on.map((x, i) => x && i > 0 ? { id: x.id, w: ({ DEF: 3, MEI: 1.2, ATA: 0.3 })[SETOR_OF[FORMATIONS[O.formation][i][0]]] || 1 } : null).filter(Boolean); let tw = cand.reduce((t, c) => t + c.w, 0) * r(); for (const c of cand) { tw -= c.w; if (tw <= 0) { fouler = c.id; break; } } if (fouler == null && cand.length) fouler = cand[0].id; }
          const fo = fouler != null ? { f: fouler } : {};
          if (viaVar && r() < 0.25) log({ m: label(t), t: 'var', k: 'pen_off', s, ...fo });           // VAR desmarca o pênalti
          else {
            if (fouler != null && pl[fouler]) pl[fouler].rt -= 0.5;
            st.shots[k]++; st.xg[k] += 0.76; const q2 = r();
            if (q2 < 0.76) { g[k]++; st.sot[k]++; pl[taker].g++; pl[taker].rt += 0.8; log({ m: label(t), t: 'goal', s, p: taker, a: null, pen: true, ...fo, ...(viaVar ? { v: 'pen' } : {}) }); }
            else if (q2 < 0.9) { st.sot[k]++; const keeper = gk(O); if (keeper) { pl[keeper].sv++; pl[keeper].rt += 0.6; } log({ m: label(t), t: 'save', s, p: taker, g: keeper, pen: true, ...fo, ...(viaVar ? { v: 'pen' } : {}) }); }
            else log({ m: label(t), t: 'miss', s, p: taker, pen: true, ...fo, ...(viaVar ? { v: 'pen' } : {}) });
          }
        } else if (detailed && r() < 0.0005) log({ m: label(t), t: 'var', k: 'hand', s });   // possível toque de mão, segue o jogo
        // faltas e cartões
        const possOpp = k === 0 ? 100 - N.poss : N.poss;
        if (r() < (12.5 / 93) * S_.fouls * (possOpp / 50)) {
          st.fouls[k]++;
          const f = anyOn(T, r);
          if (f) {
            if (r() < 0.0045 * rig) {
              st.rc[k]++; pl[f.id].rc++; pl[f.id].rt -= 1.6; pl[f.id].end = t.m;
              const ri = T.on.indexOf(f); T.on[ri] = null; T.out.add(f.id);
              log({ m: label(t), t: 'red', s, p: f.id, ...(r() < 0.18 ? { v: 'var' } : {}) }); afterRed(T, s, ri, t); recalc();
            } else if (r() < (pl[f.id].yc ? 0.065 : 0.178) * rig) {   // amarelado se segura: bem menos chance de levar o segundo
              st.yc[k]++; pl[f.id].yc++; pl[f.id].rt -= 0.3;
              if (pl[f.id].yc >= 2) {
                st.rc[k]++; pl[f.id].rc++; pl[f.id].rt -= 1.2; pl[f.id].end = t.m;
                const ri = T.on.indexOf(f); T.on[ri] = null; T.out.add(f.id);
                log({ m: label(t), t: 'red2', s, p: f.id }); afterRed(T, s, ri, t); recalc();
              } else if (detailed) log({ m: label(t), t: 'yellow', s, p: f.id, ...(r() < 0.03 ? { v: 'red_off' } : {}) });
            } else if (detailed && r() < 0.16) log({ m: label(t), t: 'foul', s, p: f.id });
          }
        }
        if (detailed && r() < 0.017) { const off = pickShooter(T, r); if (off != null) log({ m: label(t), t: 'offside', s, p: off }); }
        // desgaste e lesões
        for (let i = 0; i < T.on.length; i++) {
          const x = T.on[i]; if (!x) continue;
          const I = T.info(x.id);
          x.cond -= DRAIN * S_.fat * (I.age >= 31 ? 1.15 : I.age <= 21 ? 0.9 : 1);
          pl[x.id].min++;
          const pi = (0.00005 + (x.cond < 55 ? (55 - x.cond) * 0.000014 : 0)) * inj[k] * (I.frag || 1);
          if (r() < pi) {
            pl[x.id].inj = true; pl[x.id].end = t.m;
            log({ m: label(t), t: 'injury', s, p: x.id });
            if (!sub(T, s, i, 'lesão', t)) { T.on[i] = null; T.out.add(x.id); recalc(); }
          }
        }
      }
      // substituições por cansaço/rendimento
      if ([60, 70, 80].includes(t.m) && !t.x) {
        for (const [s, T] of [['h', H], ['a', A]]) {
          // quem entrou no decorrer do jogo quase nunca sai de novo por cansaço (só se estiver no limite, e raramente)
          const cands = T.on.map((x, i) => ({ x, i })).filter(({ x, i }) => x && i !== 0 && (!pl[x.id].from || (x.cond < 30 && r() < 0.2)))
            .map(o => ({ ...o, score: o.x.cond + (pl[o.x.id].rt - 6) * 8 })).sort((a, b) => a.score - b.score);
          let n = t.m === 60 ? 2 : t.m === 70 ? 2 : 1;
          for (const c of cands) { if (!n) break; if (c.x.cond < 62 || pl[c.x.id].rt < 5.6 || t.m === 80) { if (sub(T, s, c.i, 'cansaço', t)) n--; } }
        }
      }
    }
    // pênaltis em mata-mata
    let pens = null;
    if (opts.knockout && g[0] === g[1] && !opts.noPens) {
      let a = 0, b = 0;
      for (let i = 0; i < 5; i++) { if (r() < 0.76) a++; if (r() < 0.76) b++; }
      while (a === b) { const x = r() < 0.72, y = r() < 0.72; a += x; b += y; }
      pens = [a, b];
      log({ m: 'Pên.', t: 'pens', s: a > b ? 'h' : 'a', x: pens });
    }
    // notas finais
    const diff = g[0] - g[1];
    for (const id in pl) {
      const x = pl[id];
      const my = x.side === 'h' ? diff : -diff;
      x.rt += my > 0 ? 0.35 : my < 0 ? -0.35 : 0;
      if (SETOR_OF[x.pos] === 'GOL' || SETOR_OF[x.pos] === 'DEF') { const ga = x.side === 'h' ? g[1] : g[0]; if (ga === 0 && x.min >= 60) x.rt += 0.6; }
      x.rt += (r() - 0.5) * 0.8;
      x.rt = Math.round(clamp(x.rt, 3, 10) * 10) / 10;
      if (x.min === 0) x.min = 1;
    }
    const tot = st.poss[0] + st.poss[1];
    st.poss = [Math.round(100 * st.poss[0] / tot), 100 - Math.round(100 * st.poss[0] / tot)];
    st.xg = st.xg.map(v => Math.round(v * 100) / 100);
    const cond = {};
    for (const T of [H, A]) { for (const x of T.on) if (x) cond[x.id] = x.cond; }
    // quem saiu tem condição registrada no momento da saída (aprox.)
    for (const id in pl) if (cond[id] === undefined) cond[id] = Math.max(20, info(+id).cond - pl[id].min * DRAIN * 1.05);
    let mom = null, best = -1;
    for (const id in pl) if (pl[id].rt > best) { best = pl[id].rt; mom = +id; }
    return { gh: g[0], ga: g[1], pens, ev, st, pl, cond, mom, ref: ref.id, styles: [H.style, A.style], formations: [H.formation, A.formation] };
  }

  // força do time pra prévia e probabilidades
  function preview(home, away, info, neutral) {
    const H = mkTeam(home, info), A = mkTeam(away, info);
    const N = numbers(H, A, neutral);
    const pois = (k, l) => { let p = Math.exp(-l); for (let i = 1; i <= k; i++) p *= l / i; return p; };
    let w = 0, d = 0;
    for (let i = 0; i <= 9; i++) for (let j = 0; j <= 9; j++) { const p = pois(i, N.xh) * pois(j, N.xa); if (i > j) w += p; else if (i === j) d += p; }
    return { ...N, pw: w, pd: d, pl: 1 - w - d };
  }
  return { simulate, preview, rate, mkTeam };
})();
