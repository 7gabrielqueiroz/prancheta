// ===== TREINEIROS v3 · treino, evolução, idade e base =====
const TRAIN = (() => {
  const C = CORE, Wd = WORLD;
  const { R, hash, clamp } = C;
  const { P, ps, squad, age } = Wd;

  function ageF(a) { return a <= 18 ? 1.7 : a <= 20 ? 1.4 : a <= 23 ? 1.1 : a <= 26 ? 0.7 : a <= 29 ? 0.35 : 0.1; }
  function gainPerDay(S, id, intensity) {
    const s = ps(S, id), gap = s.pot - s.ovr;
    if (gap <= 0) return 0;
    return 0.09 * ageF(age(S, id)) * C.TRAINING[intensity].growth * gap / (gap + 4); // retorno decrescente
  }
  function grow(S, id, intensity, club) {
    const s = ps(S, id);
    const b = s.dvb > 0 ? Math.min(2, s.dvb) : 0; if (b) s.dvb = 0;   // v168: bônus de quem jogou oficial
    s.xp += gainPerDay(S, id, intensity) * (1 + b);
    while (s.xp >= 1 && s.ovr < s.pot) {
      s.xp -= 1; s.ovr++; s.mv = Math.round(s.mv * 1.12 / 100) * 100;
      if (club && Wd.isHuman(S, club)) {
        if (s.ovr >= 60 && [60, 70, 78, 85].includes(s.ovr)) EVENTS.news(S, { t: 'club', title: `${P[id].short} evolui e vira ${C.catOf(s.ovr).name}`, body: `Overall ${s.ovr}. Potencial estimado ${s.pot}.`, ids: [id], clubs: [club] });
      }
    }
  }
  // ---------- treino individual: 1 estrela, 10 dias do jogo, um jogador por vez ----------
  const PT_DAYS = 10;
  const ptFd = S => { try { return Math.floor(SEASON.fdAt(S, SEASON.now(S)) + 1e-6); } catch (e) { return 0; } };
  function ptPositions(S, id) {
    const p = P[id], s = ps(S, id), have = s.pos2 || [];
    if (!p || p.pos === 'GOL') return [];
    return Object.keys(C.POS_NAME).filter(x => x !== 'GOL' && x !== p.pos && !have.includes(x)).map(x => [x, C.fit(p.pos, x)]).filter(([, f]) => f >= 0.84 && f < 0.97).sort((a, b) => b[1] - a[1]).map(([x]) => x);
  }
  function ptStart(S, id, kind, pos) {
    if (S.ptrain && S.ptrain.s === S.season) return { ok: false, msg: `${P[S.ptrain.id] ? P[S.ptrain.id].short : 'Outro jogador'} já está em treino individual.` };
    if (Wd.ownerOf(S, id) !== S.club) return { ok: false, msg: 'Só dá pra treinar jogador do seu elenco.' };
    if ((S.stars || 0) < 1) return { ok: false, msg: 'Precisa de 1 estrela.' };
    const s = ps(S, id);
    if (kind === 'pos') { if ((s.pos2 || []).length >= 2) return { ok: false, msg: 'Ele já aprendeu 2 posições novas.' }; if (!ptPositions(S, id).includes(pos)) return { ok: false, msg: 'Escolha uma posição próxima da dele.' }; }
    if (kind === 'evo' && s.ovr >= s.pot) return { ok: false, msg: `${P[id].short} já chegou no teto do potencial.` };
    const fd = ptFd(S);
    S.stars -= 1;
    S.ptrain = { id, kind, pos: kind === 'pos' ? pos : null, fd0: fd, fd1: fd + PT_DAYS, s: S.season };
    return { ok: true, msg: kind === 'pos' ? `${P[id].short} começa a treinar de ${C.POS_NAME[pos]} · pronto em ${PT_DAYS} dias` : `${P[id].short} começa o treino de evolução · ${PT_DAYS} dias` };
  }
  function ptFinish(S) {
    const t = S.ptrain; if (!t) return;
    S.ptrain = null;   // (não usar delete: ptrain é campo da mesa do treinador, com getter no estado)
    const id = t.id; if (!P[id] || Wd.ownerOf(S, id) !== S.club) return;
    const s = ps(S, id);
    if (t.kind === 'pos') {
      s.pos2 = [...new Set([...(s.pos2 || []), t.pos])].slice(0, 2);
      EVENTS.news(S, { t: 'club', kick: 'Treino', title: `${P[id].short} aprende a jogar de ${C.POS_NAME[t.pos]}`, body: `Depois de ${PT_DAYS} dias de treino individual, ele rende como ${t.pos} quase como na posição de origem.`, ids: [id], clubs: [S.club], desk: S.__me, front: 70 });
    } else {
      let up = 0; if (s.ovr < s.pot) { s.ovr++; up = 1; s.mv = Math.round(s.mv * 1.12 / 100) * 100; }
      EVENTS.news(S, { t: 'club', kick: 'Treino', title: up ? `${P[id].short} sobe para ${s.ovr} de overall após treino individual` : `${P[id].short} conclui o treino individual`, body: up ? `Evolução acelerada nos ${PT_DAYS} dias e mais um ponto garantido no fim.` : 'Ele já estava no teto do potencial.', ids: [id], clubs: [S.club], desk: S.__me, front: 70 });
    }
  }
  function ptTick(S) {
    Wd.forDesks(S, () => { const t = S.ptrain; if (!t) return; if (t.s !== S.season || ptFd(S) >= t.fd1) ptFinish(S); });
    Wd.forDesks(S, () => { const t = S.romp; if (!t) return; if (t.s !== S.season || ptFd(S) >= t.fd1) rompFinish(S); });
  }
  // ---------- v169: romper o teto · jovem "Em ascensão", 2 estrelas, 15 dias; resultado pela média nos jogos oficiais do período ----------
  const ROMP_DAYS = 15, ROMP_COST = 2, ROMP_MIN = 2, ROMP_MAX = 6, POT_TOP = 92;
  function rompWhy(S, id) {
    const s = ps(S, id), fd = ptFd(S);
    if (Wd.ownerOf(S, id) !== S.club) return 'Só dá pra treinar jogador do seu elenco.';
    if (!(s.asc > fd)) return 'Só jogador na fase "Em ascensão".';
    if (age(S, id) > 23) return 'Só jogador de até 23 anos.';
    if (s.romS === S.season) return 'Ele já tentou romper o teto nesta temporada.';
    if ((s.romC || 0) >= ROMP_MAX || s.pot >= POT_TOP) return 'Ele já chegou ao limite de teto possível.';
    if (S.romp && S.romp.s === S.season) return `${P[S.romp.id] ? P[S.romp.id].short : 'Outro jogador'} já está tentando romper o teto.`;
    if ((S.stars || 0) < ROMP_COST) return `Precisa de ${ROMP_COST} estrelas.`;
    return null;
  }
  function rompStart(S, id) {
    const w = rompWhy(S, id); if (w) return { ok: false, msg: w };
    const fd = ptFd(S), s = ps(S, id);
    S.stars -= ROMP_COST;
    S.romp = { id, fd0: fd, fd1: fd + ROMP_DAYS, s: S.season };
    s.romp = { s: S.season, rt: [] }; s.romS = S.season;
    return { ok: true, msg: `${P[id].short} começa a tentar romper o teto · ${ROMP_DAYS} dias. Ele precisa jogar e jogar bem.` };
  }
  function rompResult(rt) {
    const n = rt.length, avg = n ? rt.reduce((a, b) => a + b, 0) / n : 0;
    return { n, avg, up: n < ROMP_MIN || avg < 6.5 ? 0 : avg >= 7.5 ? 3 : avg >= 7.0 ? 2 : 1 };
  }
  function rompFinish(S) {
    const t = S.romp; if (!t) return;
    S.romp = null;   // campo da mesa (getter): não usar delete
    const id = t.id; if (!P[id]) return;
    const s = ps(S, id), rt = (s.romp && s.romp.rt) || []; s.romp = null;
    if (Wd.ownerOf(S, id) !== S.club) return;
    const r = rompResult(rt), up = Math.max(0, Math.min(r.up, POT_TOP - s.pot, ROMP_MAX - (s.romC || 0)));
    const med = r.n ? r.avg.toFixed(1).replace('.', ',') : '—';
    if (up > 0) {
      s.pot += up; s.romC = (s.romC || 0) + up; s.mor = clamp(s.mor + 5, 0, 100);
      // v172: selo de carreira "Formador" · 2 tetos rompidos na mesma temporada
      try { const F = S.flags = S.flags || {}; F.romOk = F.romOk && F.romOk.s === S.season ? F.romOk : { s: S.season, n: 0 }; F.romOk.n++;
        S.badges = S.badges || []; const d = C.SELOS.find(x => x.k === 'formador');
        if (d && F.romOk.n >= 2 && !S.badges.some(b => b.kind === 'selo' && b.k === 'formador' && b.season === S.season)) { S.badges.push({ season: S.season, club: S.club, kind: 'selo', k: 'formador', label: d.label }); EVENTS.news(S, { t: 'trophy', title: `Novo selo para ${S.manager}: Formador`, body: `Rompeu o teto de ${F.romOk.n} jovens na temporada ${S.season}.`, clubs: [S.club], desk: S.__me, front: 80 }); } } catch (e) {}
      EVENTS.news(S, { t: 'club', kick: up >= 3 ? 'Rompeu o teto' : 'Teto maior', title: up >= 3 ? `${P[id].short} rompe o teto e já é tratado como joia` : `${P[id].short} amplia o teto após treino especial`, body: `Média ${med} (nota comparada com a do time) em ${r.n} jogo(s) oficial(is) nos ${ROMP_DAYS} dias. Potencial estimado sobe ${up} ponto(s), para ${s.pot}.`, ids: [id], clubs: [S.club], front: up >= 3 ? 90 : 76 });
    } else {
      s.mor = clamp(s.mor - 5, 0, 100);
      EVENTS.news(S, { t: 'club', kick: 'Treino', title: `${P[id].short} não consegue romper o teto`, body: r.n < ROMP_MIN ? `Jogou só ${r.n} jogo(s) oficial(is) nos ${ROMP_DAYS} dias (precisava de pelo menos ${ROMP_MIN}). As estrelas foram gastas.` : `Média ${med} no período (nota comparada com a do time), abaixo de 6,5. As estrelas foram gastas e ele sentiu o golpe.`, ids: [id], clubs: [S.club], desk: S.__me, front: 66 });
    }
  }
  function daily(S, d) {
    for (const c of Wd.brClubs(S)) {
      const inten = Wd.isHuman(S, c) ? Wd.asClub(S, c, () => S.training || 'normal') : 'normal';
      const pt = Wd.isHuman(S, c) ? Wd.asClub(S, c, () => S.ptrain) : null;
      for (const id of squad(S, c)) { grow(S, id, inten, c); if (pt && pt.id === id && pt.kind === 'evo') { grow(S, id, inten, c); grow(S, id, inten, c); } }
      for (const id of S.youth[c] || []) grow(S, id, inten, c);
      // moral: quem está encostado no banco reclama
      const sq = squad(S, c).slice().sort((a, b) => ps(S, b).ovr - ps(S, a).ovr);
      sq.slice(0, 14).forEach(id => { const s = ps(S, id); if (s.benchRun >= 3 && !(s.inj > 0)) s.mor = clamp(s.mor - 2, 0, 100); });
      // moral volta devagar pra média
      for (const id of sq) { const s = ps(S, id); s.mor += (62 - s.mor) * 0.04; }
    }
  }
  // v219: subiu um garoto, chega outro pra base (até 5 por temporada na Série A, 6 na B e 7 na C, contando a safra de 3)
  const YCAP = { A: 5, B: 6, C: 7 };
  const youthIntake = (S, club, season) => (S.youthLog || []).reduce((a, e) => a + (e[0] === season && e[1] === club ? e[2] : 0), 0);
  function youthRefill(S, club, season) {
    const cap = YCAP[Wd.divOf(S, club)]; if (!cap || youthIntake(S, club, season) >= cap) return null;
    const x = (S.youthLog || []).filter(e => e[0] === season && e[1] === club && e[3]).length + 1;
    const ids = Wd.youthNew(S, season, club, 1, x);   // v232: garoto real da lista do clube primeiro
    S.youth[club] = [...(S.youth[club] || []), ...ids]; for (const nid of ids) ps(S, nid);
    return ids[0];
  }
  function promote(S, club, id, season) {
    if (squad(S, club).length >= C.ECON.squadMax) return false;
    S.youth[club] = (S.youth[club] || []).filter(x => x !== id);
    Wd.move(S, id, club, true, { t: 'base' });
    const s = ps(S, id); s.sal = Math.max(s.sal, 30); s.ce = Math.max(s.ce, S.season + 3);
    const nw = youthRefill(S, club, season ?? S.season);
    if (nw && Wd.isHuman(S, club)) Wd.asClub(S, club, () => EVENTS.news(S, { t: 'club', title: `Base do ${club}: chega ${P[nw].name}`, body: `${P[nw].pos}, ${age(S, nw)} anos, overall ${ps(S, nw).ovr}. Toda vez que um garoto sobe, outro ganha a vaga na base (até ${YCAP[Wd.divOf(S, club)]} na temporada).`, ids: [nw], clubs: [club], desk: S.__me }));
    return true;
  }
  function seasonEnd(S) {
    const r = R(`age${S.seed}${S.season}`);
    for (const k in S.ps) {
      const id = +k, s = S.ps[id], o = Wd.ownerOf(S, id);
      if (!o || o === 'Aposentado') continue;
      const a = Wd.ageNext(S, id);
      let dec = 0;
      if (a >= 35) dec = 2 + Math.floor(r() * 3); else if (a >= 33) dec = 1 + Math.floor(r() * 3); else if (a >= 31) dec = Math.floor(r() * 3);
      if (dec) { s.ovr = Math.max(40, s.ovr - dec); s.pot = Math.min(s.pot, s.ovr); s.mv = Math.round(s.mv * Math.pow(1.12, -dec) / 100) * 100; }
      if (a >= 30) s.mv = Math.round(s.mv * 0.9 / 100) * 100;
      // aposentadoria: quem anunciou durante a temporada para agora; veterano livre e sem clube há muito tempo também
      if (s.retire === S.season || (o === 'Livre' && a >= 36 && r() < 0.6) || a >= 43) {
        const wasMine = Wd.isHuman(S, o), big = s.ovr >= 78 || (s.car && s.car.j >= 300);
        Wd.move(S, id, 'Aposentado');
        if (wasMine || big) EVENTS.news(S, { t: 'club', tag: 'retire', front: big ? 86 : 60, title: `${P[id].name} se despede do futebol`, body: `Aos ${a - 1} anos, faz o último jogo da carreira${o !== 'Livre' ? ` pelo ${o}` : ''}.`, ids: [id], clubs: o !== 'Livre' ? [o] : [] });
      }
    }
    // base: nova safra e promoções da IA
    for (const c of Wd.brClubs(S)) {
      const ids = Wd.youthNew(S, S.season + 1, c, 3);   // v232: garotos reais da lista do clube primeiro
      S.youth[c] = [...(S.youth[c] || []), ...ids];
      for (const id of ids) ps(S, id);
      if (!Wd.isHuman(S, c)) {
        const sq = squad(S, c);
        const yb = (S.youth[c] || []).slice().sort((a, b) => ps(S, b).ovr - ps(S, a).ovr);
        let need = Math.max(0, 25 - sq.length);
        for (const id of yb) { if (!need) break; if (age(S, id) >= 17) { promote(S, c, id, S.season + 1); need--; } }
        // base antiga demais sai
        S.youth[c] = (S.youth[c] || []).filter(id => { if (age(S, id) >= 21) { Wd.move(S, id, 'Livre'); S.free.push(id); return false; } return true; });
      }
    }
    Wd.forDesks(S, () => { if (!S.unemployed && S.youth[S.club] && S.youth[S.club].length) EVENTS.news(S, { t: 'club', title: `Nova safra da base do ${S.club}`, body: `${S.youth[S.club].length} jogadores na base. Veja em Elenco › Base.`, clubs: [S.club] }); });
    Wd.touch(S);
  }
  return { ROMP_DAYS, ROMP_COST, ROMP_MIN, rompWhy, rompStart, rompResult, PT_DAYS, ptPositions, ptStart, ptTick,  daily, promote, seasonEnd, gainPerDay, YCAP, youthIntake, youthRefill };
})();
