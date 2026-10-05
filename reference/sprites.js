// ===== TREINEIROS v3 · pixel art: jogadores, escudos e bandeiras =====
const SPR = (() => {
  const C = CORE;
  const PATTERNS = { solid: 'Lisa', vstripes: 'Listras verticais', wide: 'Listras largas', pin: 'Risca de giz', hoops: 'Listras horizontais', hoops3: 'Três faixas', band: 'Faixa no peito', sash: 'Faixa diagonal', halves: 'Metades', chest: 'Peito contrastante' };
  function kitFor(S, club) {
    const base = WORLD.clubInfo(club);
    const o = S && S.kits && S.kits[club];
    if (!o) return base;
    const c = o.swap ? [base.c[1] || base.c[0], base.c[0], ...(base.c.slice(2))] : base.c;
    return { ...base, pat: o.pat, c };
  }
  function shirtColor(k, xx, yy) {
    const c = k.c, c2 = c[1] || c[0];
    switch (k.pat) {
      case 'vstripes': return c[Math.floor((xx - 2) / 2) % c.length];
      case 'wide': return Math.floor((xx - 2) / 3) % 2 ? c2 : c[0];
      case 'pin': return (xx - 1) % 3 === 0 ? c2 : c[0];
      case 'hoops': return c[Math.floor((yy - 10) / 2) % 2] || c[0];
      case 'hoops3': return c[Math.floor((yy - 10) / 2) % c.length];
      case 'band': return yy === 12 ? c2 : yy === 13 ? (c[2] || c2) : c[0];
      case 'sash': return (xx - 4) - (yy - 10) === 0 || (xx - 4) - (yy - 10) === 1 ? c2 : c[0];
      case 'halves': return xx < 8 ? c[0] : c2;
      case 'chest': return yy <= 11 ? c2 : c[0];
      default: return c[0];
    }
  }
  const SKIN = ['#F2C9A0', '#E3AF84', '#C98D60', '#A06843', '#76482C', '#55331F'];
  const HAIR = ['#17100A', '#2A1A0F', '#4A2F1B', '#7A5230', '#B88A4A', '#D9BE7E', '#8A3B1B'];
  const LIGHT = ['ALE', 'HOL', 'DIN', 'SUE', 'NOR', 'ING', 'ESC', 'IRL', 'POL', 'CRO', 'SER', 'RUS', 'UCR', 'SUI', 'AUT', 'TCH', 'ESL', 'ESQ', 'HUN', 'GEO', 'ISL', 'FIN'];
  const DARK = ['SEN', 'NGA', 'CIV', 'GAN', 'CAM', 'MLI', 'GUI', 'ANG', 'CPV', 'JAM', 'CON', 'GAB', 'BUR', 'TOG', 'BEN', 'ZAM', 'MOZ'];
  const pickW = (r, items, w) => C.pickW(items, w, r);
  // aparência medida nas fotos (id -> [pele 0-5, cabelo 0-6, barba 0/1/2, careca 0/1]); o resto é sorteado
  let LOOKS = {};
  const MOSTLY_LIGHT = ['ARG', 'URU', 'ESP', 'ITA', 'POR', 'CHI', 'PAR', 'MEX', 'GRE', 'TUR', 'ISR', 'BOS', 'MON', 'MKD', 'ALB', 'SVN', 'SVK', 'ROM', 'BUL', 'BEL'];
  // v233: sorteio mais perto da realidade pra quem não tem foto medida (Santiago Sosa saiu negro): Cone Sul quase sempre claro; andinos, pele média
  const SOUTH_LIGHT = ['ARG', 'URU', 'CHI', 'PAR'], ANDEAN = ['BOL', 'PER'];
  const LIGHT2 = ['ICE', 'NIR', 'LAT', 'LIT', 'EST', 'FAR', 'LUX', 'BUL'], DARK2 = ['DRC', 'GBS', 'GEQ', 'SIE', 'CEN', 'BDI', 'KEN', 'TAN', 'UGA', 'NIG', 'HAI', 'GAM'];
  function looks(p) {
    const r = C.R('look' + p.id);
    const M = LOOKS[p.id];
    if (M) {
      const [sk, hc, bd, bald] = M;
      const styles = sk >= 3 ? ['buzz', 'afro', 'short', 'twists', 'fade'] : ['short', 'buzz', 'quiff', 'long', 'fade', 'curly'];
      const style = bald ? 'bald' : styles[Math.floor(r() * styles.length)];
      const beard = bd === 9 ? (r() < (p.age0 > 26 ? 0.45 : 0.18) ? (r() < 0.5 ? 'full' : 'goatee') : 'none') : bd === 2 ? 'full' : bd === 1 ? 'goatee' : 'none';
      return { skin: SKIN[sk], hair: HAIR[hc], style, beard, sleeve: r() < 0.25 ? 'long' : 'short' };
    }
    let sw;
    if (LIGHT.includes(p.nat) || LIGHT2.includes(p.nat)) sw = [5, 3, 1, 0.3, 0.1, 0.05];
    else if (SOUTH_LIGHT.includes(p.nat)) sw = [4.5, 3, 0.6, 0.12, 0.02, 0.01];
    else if (ANDEAN.includes(p.nat)) sw = [1, 2.5, 3, 1, 0.2, 0.05];
    else if (MOSTLY_LIGHT.includes(p.nat)) sw = [2.5, 3, 1.6, 0.6, 0.25, 0.1];
    else if (DARK.includes(p.nat) || DARK2.includes(p.nat)) sw = [0.1, 0.2, 0.6, 2, 4, 3];
    else if (['JAP', 'COR', 'CHN'].includes(p.nat)) sw = [3, 3, 0.5, 0, 0, 0];
    else sw = [1.5, 2, 2, 1.8, 1.2, 0.8];
    const skin = pickW(r, [0, 1, 2, 3, 4, 5], sw);
    const hw = skin >= 3 ? [5, 3, 0.5, 0, 0, 0, 0] : skin >= 2 ? [3, 3, 2, 0.6, 0.2, 0.1, 0.1] : [1.2, 1.5, 2, 1.8, 1, 0.8, 0.4];
    const hair = pickW(r, [0, 1, 2, 3, 4, 5, 6], hw);
    const styles = skin >= 3 ? ['buzz', 'afro', 'short', 'bald', 'twists', 'fade'] : ['short', 'buzz', 'quiff', 'long', 'fade', 'bald', 'curly'];
    const style = styles[Math.floor(r() * styles.length)];
    const beard = r() < (p.age0 > 26 ? 0.45 : 0.18) ? (r() < 0.5 ? 'full' : 'goatee') : 'none';
    return { skin: SKIN[skin], hair: HAIR[hair], style, beard, sleeve: r() < 0.25 ? 'long' : 'short' };
  }
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = n >> 8 & 255, b = n & 255;
    r = Math.round(Math.min(255, r * f)); g = Math.round(Math.min(255, g * f)); b = Math.round(Math.min(255, b * f));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  const cache = new Map();
  function player(p, kit, gk) {
    const key = p.id + '|' + kit.pat + kit.c.join('') + (gk ? 'g' : '');
    if (cache.has(key)) return cache.get(key);
    const W = 16, H = 24;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const x = cv.getContext('2d');
    const px = (a, b, c) => { x.fillStyle = c; x.fillRect(a, b, 1, 1); };
    const rect = (a, b, w, h, c) => { x.fillStyle = c; x.fillRect(a, b, w, h); };
    const L = looks(p);
    let k = kit;
    if (gk) k = { pat: 'solid', c: [kit.c[0] === '#FFD200' ? '#6CB4EE' : '#FFD200'], tr: '#141414', sh: '#141414', so: '#141414' };
    const skinD = shade(L.skin, 0.82), OUT = '#0A0A0A';
    rect(3, 23, 10, 1, 'rgba(0,0,0,.28)');
    rect(4, 22, 3, 1, OUT); rect(9, 22, 3, 1, OUT);
    rect(5, 20, 2, 2, k.so); rect(9, 20, 2, 2, k.so);
    rect(5, 19, 2, 1, L.skin); rect(9, 19, 2, 1, L.skin);
    rect(4, 17, 8, 1, k.sh); rect(4, 18, 3, 1, k.sh); rect(9, 18, 3, 1, k.sh);
    for (let yy = 10; yy <= 16; yy++) for (let xx = 4; xx <= 11; xx++) px(xx, yy, shirtColor(k, xx, yy));
    for (const xx of [2, 3, 12, 13]) for (let yy = 10; yy <= 12; yy++) if (!((xx === 2 || xx === 13) && yy === 10)) px(xx, yy, shirtColor(k, xx <= 3 ? 4 : 11, yy));
    if (L.sleeve === 'long') { rect(2, 13, 1, 3, shirtColor(k, 4, 13)); rect(13, 13, 1, 3, shirtColor(k, 11, 13)); }
    else { rect(2, 13, 1, 3, L.skin); rect(13, 13, 1, 3, L.skin); }
    px(2, 16, gk ? '#F4F4F4' : L.skin); px(13, 16, gk ? '#F4F4F4' : L.skin);
    const collar = k.tr || shade(k.c[0], 0.7); px(7, 10, collar); px(8, 10, collar);
    rect(7, 9, 2, 1, skinD);
    rect(5, 2, 6, 7, L.skin); rect(4, 3, 8, 5, L.skin); px(3, 5, L.skin); px(12, 5, L.skin); rect(5, 8, 6, 1, skinD);
    px(6, 5, OUT); px(9, 5, OUT); rect(5, 4, 2, 1, L.hair); rect(9, 4, 2, 1, L.hair);
    rect(7, 7, 2, 1, shade(L.skin, 0.62));
    if (L.beard === 'full') { rect(4, 6, 1, 2, L.hair); rect(11, 6, 1, 2, L.hair); rect(5, 7, 2, 2, L.hair); rect(9, 7, 2, 2, L.hair); rect(7, 8, 2, 1, L.hair); }
    else if (L.beard === 'goatee') { rect(7, 8, 2, 1, L.hair); px(6, 7, L.hair); px(9, 7, L.hair); }
    const H_ = L.hair;
    switch (L.style) {
      case 'buzz': rect(5, 2, 6, 1, H_); px(4, 3, H_); px(11, 3, H_); break;
      case 'fade': rect(5, 1, 6, 2, H_); px(4, 3, H_); px(11, 3, H_); break;
      case 'short': rect(5, 1, 6, 2, H_); rect(4, 2, 1, 2, H_); rect(11, 2, 1, 2, H_); rect(5, 3, 2, 1, H_); break;
      case 'quiff': rect(5, 1, 6, 2, H_); rect(7, 0, 5, 1, H_); px(4, 3, H_); px(11, 3, H_); px(4, 2, H_); break;
      case 'long': rect(4, 1, 8, 2, H_); rect(3, 2, 1, 7, H_); rect(12, 2, 1, 7, H_); rect(4, 3, 1, 2, H_); rect(11, 3, 1, 2, H_); break;
      case 'afro': rect(4, 0, 8, 3, H_); rect(3, 1, 10, 2, H_); rect(3, 3, 1, 2, H_); rect(12, 3, 1, 2, H_); break;
      case 'twists': rect(4, 1, 8, 2, H_); for (const xx of [4, 6, 8, 10]) px(xx, 0, H_); rect(3, 2, 1, 4, H_); rect(12, 2, 1, 4, H_); break;
      case 'curly': rect(4, 1, 8, 2, H_); px(5, 0, H_); px(8, 0, H_); px(10, 0, H_); px(4, 3, H_); px(11, 3, H_); px(3, 2, H_); px(12, 2, H_); break;
      case 'bald': px(5, 2, shade(L.skin, 1.12)); px(6, 2, shade(L.skin, 1.12)); break;
    }
    const url = cv.toDataURL(); cache.set(key, url); return url;
  }

  // ---------- fonte 3x5 pra siglas ----------
  const F = { A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100',
    G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111', M: '101111111101101',
    N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
    U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010', Z: '111001010100111' };
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
  function lum(hex) { const n = parseInt(hex.slice(1), 16); return (0.3 * (n >> 16) + 0.59 * (n >> 8 & 255) + 0.11 * (n & 255)) / 255; }
  function crest(S, club) {
    const info = kitFor(S, club);
    const key = 'crest|' + club + info.c.join('');
    if (cache.has(key)) return cache.get(key);
    const W = 20, H = 22;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const x = cv.getContext('2d');
    const rows = []; // largura do escudo por linha
    for (let y = 0; y < H; y++) { let w = 18; if (y >= 13) w = Math.max(2, 18 - (y - 12) * 2); rows.push(w); }
    const c1 = info.c[0], c2 = info.c[1] && info.c[1] !== c1 ? info.c[1] : (lum(c1) > 0.6 ? '#141414' : '#F4F4F4');
    const style = C.hash(club) % 4;
    for (let y = 0; y < H; y++) {
      const w = rows[y], x0 = Math.floor((W - w) / 2);
      for (let i = 0; i < w; i++) {
        const xx = x0 + i;
        let col = c1;
        if (style === 0) col = Math.floor((xx - 1) / 3) % 2 ? c2 : c1;
        else if (style === 1) col = xx < W / 2 ? c1 : c2;
        else if (style === 2) col = (xx + y) % 8 < 4 ? c1 : c2;
        else col = y < 6 ? c2 : c1;
        x.fillStyle = col; x.fillRect(xx, y, 1, 1);
      }
      x.fillStyle = '#0A0A0A'; x.fillRect(x0, y, 1, 1); x.fillRect(x0 + w - 1, y, 1, 1);
    }
    x.fillStyle = '#0A0A0A'; x.fillRect(1, 0, 18, 1);
    // faixa central com a sigla
    const band = lum(c1) > 0.55 && lum(c2) > 0.55 ? '#141414' : '#F4F4F4';
    x.fillStyle = band; x.fillRect(2, 7, 16, 7);
    x.fillStyle = band === '#F4F4F4' ? '#141414' : '#F4F4F4';
    const sig = norm(info.sig || club).replace(/[^A-Z]/g, '').slice(0, 3);
    const tw = sig.length * 4 - 1, sx = Math.floor((W - tw) / 2);
    [...sig].forEach((ch, i) => { const g = F[ch]; if (!g) return; for (let j = 0; j < 15; j++) if (g[j] === '1') x.fillRect(sx + i * 4 + (j % 3), 8 + Math.floor(j / 3), 1, 1); });
    const url = cv.toDataURL(); cache.set(key, url); return url;
  }
  function flag(nat) {
    const key = 'flag|' + nat;
    if (cache.has(key)) return cache.get(key);
    const W = 12, H = 8;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const x = cv.getContext('2d');
    const f = C.FLAGS[nat] || ['h', '#8C90A6', '#B9BCCB', '#8C90A6'];
    const R_ = (a, b, w, h, c) => { x.fillStyle = c; x.fillRect(a, b, w, h); };
    const [type, ...cols] = f;
    const dot = cols.find(c => String(c).startsWith('dot:'));
    const cc = cols.filter(c => !String(c).startsWith('dot:'));
    switch (type) {
      case 'h': R_(0, 0, 12, 3, cc[0]); R_(0, 3, 12, 2, cc[1]); R_(0, 5, 12, 3, cc[2]); break;
      case 'hw': R_(0, 0, 12, 2, cc[0]); R_(0, 2, 12, 2, cc[1]); R_(0, 4, 12, 2, cc[2]); R_(0, 6, 12, 2, cc[3]); break;
      case 'h2': R_(0, 0, 12, 4, cc[0]); R_(0, 4, 12, 4, cc[1]); break;
      case 'v': R_(0, 0, 4, 8, cc[0]); R_(4, 0, 4, 8, cc[1]); R_(8, 0, 4, 8, cc[2]); break;
      case 'v2': R_(0, 0, 6, 8, cc[0]); R_(6, 0, 6, 8, cc[1]); break;
      case 'cross': R_(0, 0, 12, 8, cc[0]); R_(5, 0, 2, 8, cc[1]); R_(0, 3, 12, 2, cc[1]); break;
      case 'nordic': R_(0, 0, 12, 8, cc[0]); R_(3, 0, 2, 8, cc[1]); R_(0, 3, 12, 2, cc[1]); if (cc[2]) { R_(3.5, 0, 1, 8, cc[2]); R_(0, 3.5, 12, 1, cc[2]); } break;
      case 'x': R_(0, 0, 12, 8, cc[0]); x.fillStyle = cc[1]; for (let i = 0; i < 12; i++) { const y = Math.round(i * 7 / 11); x.fillRect(i, y, 1, 1); x.fillRect(i, 7 - y, 1, 1); } break;
      case 'circle': R_(0, 0, 12, 8, cc[0]); R_(5, 2, 2, 4, cc[1]); R_(4, 3, 4, 2, cc[1]); break;
      case 'stripes': for (let i = 0; i < 8; i++) R_(0, i, 12, 1, i % 2 ? cc[1] : cc[0]); R_(0, 0, 5, 4, cc[0]); R_(2, 0, 1, 4, cc[1]); R_(0, 1.5, 5, 1, cc[1]); break;
      case 'bra': R_(0, 0, 12, 8, '#009C3B'); x.fillStyle = '#FFDF00'; [[5, 1, 2], [3, 2, 6], [2, 3, 8], [2, 4, 8], [3, 5, 6], [5, 6, 2]].forEach(([a, b, w]) => x.fillRect(a, b, w, 1)); R_(5, 3, 2, 2, '#002776'); R_(4, 3.5, 4, 1, '#002776'); break;
      case 'uru': for (let i = 0; i < 8; i++) R_(0, i, 12, 1, i % 2 ? '#0038A8' : '#FFFFFF'); R_(0, 0, 5, 4, '#FFFFFF'); R_(1.5, 1, 2, 2, '#FCD116'); break;
      case 'chi': R_(0, 0, 12, 4, '#FFFFFF'); R_(0, 4, 12, 4, '#D52B1E'); R_(0, 0, 4, 4, '#0039A6'); R_(1.5, 1.5, 1, 1, '#FFFFFF'); break;
      case 'por': R_(0, 0, 5, 8, '#006600'); R_(5, 0, 7, 8, '#FF0000'); R_(4, 3, 2, 2, '#FFCC00'); break;
      case 'usa': for (let i = 0; i < 8; i++) R_(0, i, 12, 1, i % 2 ? '#FFFFFF' : '#B22234'); R_(0, 0, 5, 4, '#3C3B6E'); break;
    }
    if (dot) R_(5, 3, 2, 2, dot.slice(4));
    const url = cv.toDataURL(); cache.set(key, url); return url;
  }

  // ---------- treinador (avatar personalizável) ----------
  const COACH = {
    skin: SKIN,
    hairC: ['#17100A', '#4A2F1B', '#7A5230', '#D9BE7E', '#8A3B1B', '#9A9A9A', '#E2E2E2'],
    hair: { careca: 'Careca', raspado: 'Raspado', curto: 'Curto', topete: 'Topete', lateral: 'Repartido', black: 'Black power', longo: 'Longo', coque: 'Coque' },
    beard: { nenhuma: 'Sem barba', porfazer: 'Por fazer', bigode: 'Bigode', cavanhaque: 'Cavanhaque', cheia: 'Barba cheia' },
    outfit: { terno: 'Terno', agasalho: 'Agasalho', polo: 'Camisa polo', colete: 'Colete e gravata' },
    glasses: { nao: 'Sem óculos', sim: 'Óculos' },
  };
  const COACH_DEF = { skin: 1, hairC: 0, hair: 'curto', beard: 'porfazer', outfit: 'terno', glasses: 'nao' };
  function coach(av, club, opts = {}) {
    const a = { ...COACH_DEF, ...(av || {}) };
    const kit = club ? kitFor(opts.S || null, club) : { c: ['#2B2F3A', '#D8DCE6'] };
    const key = 'coach|' + JSON.stringify(a) + '|' + (club || '') + kit.c.join('');
    if (cache.has(key)) return cache.get(key);
    const W = 24, H = 30;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const x = cv.getContext('2d');
    const px = (p, q, c) => { x.fillStyle = c; x.fillRect(p, q, 1, 1); };
    const rect = (p, q, w, h, c) => { x.fillStyle = c; x.fillRect(p, q, w, h); };
    const sk = COACH.skin[a.skin] || SKIN[1], skD = shade(sk, 0.82), hc = COACH.hairC[a.hairC] || '#17100A', OUT = '#0A0A0A';
    let c0 = kit.c[0], c1 = kit.c[1] && kit.c[1] !== c0 ? kit.c[1] : (lum(c0) > 0.6 ? '#141414' : '#F4F4F4');
    if (a.outfit === 'terno' && lum(c0) > 0.75) { const t = c0; c0 = c1; c1 = t; }
    const c0D = shade(c0, 0.78), WHITE = '#F2F2F2';
    // tronco
    const torso = (col) => { rect(4, 17, 16, 1, col); rect(3, 18, 18, 1, col); rect(2, 19, 20, 11, col); };
    if (a.outfit === 'terno') {
      torso(c0); rect(9, 17, 6, 6, WHITE); px(9, 22, c0); px(14, 22, c0); rect(10, 23, 4, 1, c0);
      rect(11, 17, 2, 8, c1); px(11, 25, c1); px(12, 25, shade(c1, 0.8)); rect(11, 17, 2, 1, shade(c1, 0.8));
      rect(8, 18, 1, 6, c0D); rect(15, 18, 1, 6, c0D); rect(2, 25, 20, 1, c0D); px(12, 27, OUT); px(12, 29, OUT);
    } else if (a.outfit === 'agasalho') {
      torso(c0); rect(9, 16, 6, 2, c1); rect(11, 18, 2, 12, shade(c0, 1.25)); px(12, 19, '#C9CCD6');
      rect(2, 20, 1, 10, c1); rect(21, 20, 1, 10, c1); rect(4, 17, 1, 3, c1); rect(19, 17, 1, 3, c1); rect(2, 27, 20, 1, c0D);
    } else if (a.outfit === 'polo') {
      torso(c0); rect(8, 16, 3, 2, c1); rect(13, 16, 3, 2, c1); rect(11, 17, 2, 4, shade(c0, 0.85)); px(11, 18, WHITE); px(11, 20, WHITE);
      rect(2, 26, 3, 1, c1); rect(19, 26, 3, 1, c1);
    } else { // colete
      torso(WHITE); rect(6, 18, 12, 12, c0); rect(10, 17, 4, 5, WHITE); px(10, 22, c0); px(13, 22, c0);
      rect(11, 17, 2, 9, c1); rect(11, 17, 2, 1, shade(c1, 0.8)); rect(2, 20, 4, 10, '#E4E6EC'); rect(18, 20, 4, 10, '#E4E6EC'); px(12, 24, OUT); px(12, 27, OUT);
    }
    // escudo do clube no peito
    if (club && opts.crest !== false) {
      const k2 = kitFor(opts.S || null, club), s1 = k2.c[0], s2 = k2.c[1] && k2.c[1] !== s1 ? k2.c[1] : (lum(s1) > 0.6 ? '#141414' : '#F4F4F4');
      const bx = 15, by = 20, rim = lum(a.outfit === 'colete' ? c0 : c0) > 0.5 ? '#141414' : '#F4F4F4';
      rect(bx - 1, by - 1, 6, 6, rim); rect(bx, by + 5, 4, 1, rim); rect(bx + 1, by + 6, 2, 1, rim);
      rect(bx, by, 2, 5, s1); rect(bx + 2, by, 2, 5, s2); rect(bx, by, 4, 1, s2); px(bx + 1, by + 5, s1); px(bx + 2, by + 5, s2);
    }
    // pescoço e cabeça
    rect(10, 14, 4, 3, skD);
    rect(8, 4, 8, 11, sk); rect(7, 5, 10, 8, sk); px(6, 8, sk); px(6, 9, skD); px(17, 8, sk); px(17, 9, skD);
    rect(8, 14, 8, 1, skD);
    px(9, 9, OUT); px(14, 9, OUT); px(10, 9, '#FFFFFF'); px(13, 9, '#FFFFFF');
    rect(9, 7, 2, 1, hc); rect(13, 7, 2, 1, hc);
    rect(11, 10, 2, 2, skD); rect(10, 12, 4, 1, shade(sk, 0.6));
    // barba
    if (a.beard === 'cheia') { rect(7, 9, 1, 4, hc); rect(16, 9, 1, 4, hc); rect(8, 12, 2, 3, hc); rect(14, 12, 2, 3, hc); rect(10, 13, 4, 2, hc); rect(10, 11, 4, 1, hc); }
    else if (a.beard === 'cavanhaque') { rect(10, 11, 4, 1, hc); rect(10, 13, 4, 2, hc); px(9, 12, hc); px(14, 12, hc); }
    else if (a.beard === 'bigode') { rect(9, 11, 6, 1, hc); }
    else if (a.beard === 'porfazer') { x.globalAlpha = 0.35; rect(7, 10, 1, 3, hc); rect(16, 10, 1, 3, hc); rect(8, 12, 8, 3, hc); rect(10, 11, 4, 1, hc); x.globalAlpha = 1; rect(10, 12, 4, 1, shade(sk, 0.6)); }
    // cabelo
    const H_ = hc;
    switch (a.hair) {
      case 'raspado': x.globalAlpha = 0.55; rect(8, 3, 8, 2, H_); rect(7, 4, 1, 3, H_); rect(16, 4, 1, 3, H_); x.globalAlpha = 1; break;
      case 'curto': rect(8, 2, 8, 3, H_); rect(7, 3, 1, 4, H_); rect(16, 3, 1, 4, H_); rect(8, 5, 3, 1, H_); break;
      case 'topete': rect(8, 3, 8, 2, H_); rect(9, 1, 7, 2, H_); rect(11, 0, 4, 1, H_); rect(7, 4, 1, 3, H_); rect(16, 4, 1, 3, H_); break;
      case 'lateral': rect(7, 2, 10, 3, H_); rect(7, 5, 1, 2, H_); rect(16, 5, 1, 2, H_); rect(12, 5, 4, 1, H_); px(10, 2, shade(sk, 0.9)); px(10, 3, shade(sk, 0.9)); break;
      case 'black': rect(6, 0, 12, 5, H_); rect(5, 1, 14, 4, H_); rect(5, 5, 2, 3, H_); rect(17, 5, 2, 3, H_); break;
      case 'longo': rect(7, 2, 10, 3, H_); rect(6, 4, 2, 11, H_); rect(16, 4, 2, 11, H_); rect(8, 5, 2, 1, H_); break;
      case 'coque': rect(8, 2, 8, 3, H_); rect(7, 3, 1, 4, H_); rect(16, 3, 1, 4, H_); rect(10, 0, 4, 2, H_); break;
      case 'careca': px(9, 5, shade(sk, 1.12)); px(10, 4, shade(sk, 1.12)); rect(7, 6, 1, 2, H_); rect(16, 6, 1, 2, H_); break;
    }
    if (a.glasses === 'sim') { const g = '#1A1A1A'; rect(8, 8, 4, 1, g); rect(12, 8, 4, 1, g); rect(8, 10, 4, 1, g); rect(12, 10, 4, 1, g); px(8, 9, g); px(11, 9, g); px(12, 9, g); px(15, 9, g); px(7, 8, g); px(16, 8, g); }
    const url = cv.toDataURL(); cache.set(key, url); return url;
  }
  return { setLooks: m => { LOOKS = m || {}; cache.clear(); }, player, crest, flag, kitFor, coach, COACH, COACH_DEF, PATTERNS, clear: () => cache.clear() };
})();
