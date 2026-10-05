// ===== TREINEIROS v3 · núcleo: utilitários, regras, catálogos =====
const CORE = (() => {
  // ---------- aleatoriedade determinística ----------
  function hash(str) {
    let h = 2166136261 >>> 0; str = String(str);
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  const R = (seed) => rng(hash(seed));
  function pickW(items, weights, r) {
    let tot = 0; for (const w of weights) tot += w;
    let x = r() * tot;
    for (let i = 0; i < items.length; i++) { x -= weights[i]; if (x <= 0) return items[i]; }
    return items[items.length - 1];
  }
  const pick = (arr, r) => arr[Math.floor(r() * arr.length)];
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  // rendimento pela condição física: 100 = 100%, 85 ≈ −2%, 70 ≈ −6%, 55 ≈ −11%, 40 ≈ −16%
  const condF = c => 1 - 0.35 * Math.pow(clamp(100 - c, 0, 100) / 100, 1.5);
  const r1k = x => Math.max(1000, Math.round(x / 1000) * 1000);
  const fmt = n => Math.round(n).toLocaleString('pt-BR');
  const fmtK = n => Math.abs(n) >= 1e6 ? (n / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + 'M' : Math.abs(n) >= 1000 ? Math.round(n / 1000).toLocaleString('pt-BR') + 'k' : String(Math.round(n));
  function shuffle(arr, r) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function gauss(r) { return (r() + r() + r() - 1.5) / 0.5; } // aprox. normal, desvio ~1

  // ---------- economia (T$) ----------
  const ECON = {
    mvPerEur: 0.0045,          // valor de mercado T$ = valor TM (€) × 0,0045
    salaryRate: 0.005,         // salário por dia = 0,5% do valor de mercado
    startCashRate: 0.3,        // caixa inicial = 30% do valor do elenco
    daysPerSeason: 27,
    homeShare: 0.9,            // renda de bilheteria: 90% mandante, 10% visitante
    matchBase: 1000, matchPerSquadValue: 0.0015,
    releaseRate: 0.5,
    starCash: 4000,            // 1 estrela vale T$ 4.000 no caixa
    diaCash: 60000,            // 1 diamante vale T$ 60.000 (menos que 20 estrelas)
    starsPerDia: 20,
    lockSlots: 14,             // meio turno sem poder ser negociado após chegar          // multa rescisória = 50% dos salários restantes
    squadMax: 45, squadMin: 18,
  };
  // valor de mercado a partir do overall/idade (jogadores sem valor no TM e gerados)
  function mvFromOvr(ovr, age) {
    const base = 60000 * Math.pow(1.12, ovr - 81);
    const am = age <= 19 ? 2.2 : age <= 21 ? 1.8 : age <= 23 ? 1.4 : age <= 26 ? 1.1 : age <= 28 ? 1 : age <= 30 ? 0.8 : age <= 32 ? 0.55 : 0.35;
    return Math.max(500, Math.round(base * am / 500) * 500);
  }

  // ---------- categorias ----------
  const CATS = [
    { k: 'dia', name: 'Diamante', min: 85, c: 'var(--c-dia)' },
    { k: 'our', name: 'Ouro', min: 78, c: 'var(--c-our)' },
    { k: 'pra', name: 'Prata', min: 70, c: 'var(--c-pra)' },
    { k: 'bro', name: 'Bronze', min: 60, c: 'var(--c-bro)' },
    { k: 'cob', name: 'Cobre', min: 0, c: 'var(--c-cob)' },
  ];
  const catOf = ovr => CATS.find(c => ovr >= c.min) || CATS[CATS.length - 1];   // v165: jogador sem nota (removido/aposentado) não derruba a tela
  // custo dos pacotes: [estrelas, diamantes]
  const PACK_COST = { dia: [5, 1], oe: [2, 1], our: [5, 0], pra: [3, 0], bro: [1, 0] };   // oe = Ouro Especial (Séries B e C): 2 estrelas + 1 Ouro
  // rotação diária: 5 treinadores, 4 pacotes (cobre fica só na base)
  const PACK_ROT = ['dia', 'our', 'pra', 'bro'];   // 1 pacote por dia de seg a qui (sex-dom é mercado); categoria gira a cada dia de pacote

  // ---------- posições ----------
  const POS_NAME = { GOL: 'Goleiro', ZAG: 'Zagueiro', LD: 'Lateral-Direito', LE: 'Lateral-Esquerdo', VOL: 'Volante',
    MC: 'Meia-Central', MEI: 'Meia-Atacante', ME: 'Meia-Esquerda', MD: 'Meia-Direita', PE: 'Ponta-Esquerda', PD: 'Ponta-Direita',
    CA: 'Centroavante', SA: 'Segundo Atacante', ADE: 'Ala-Esquerdo', ADD: 'Ala-Direito' };
  const SETOR_OF = { GOL: 'GOL', ZAG: 'DEF', LD: 'DEF', LE: 'DEF', ADE: 'DEF', ADD: 'DEF', VOL: 'MEI', MC: 'MEI', MEI: 'MEI',
    ME: 'MEI', MD: 'MEI', PE: 'ATA', PD: 'ATA', CA: 'ATA', SA: 'ATA' };
  const FORMATIONS = {
    '4-3-3': [['GOL', 50, 90], ['LE', 12, 70], ['ZAG', 36, 75], ['ZAG', 64, 75], ['LD', 88, 70], ['MC', 26, 49], ['VOL', 50, 56], ['MEI', 74, 49], ['PE', 15, 22], ['CA', 50, 15], ['PD', 85, 22]],
    '4-4-2': [['GOL', 50, 90], ['LE', 12, 70], ['ZAG', 36, 75], ['ZAG', 64, 75], ['LD', 88, 70], ['ME', 12, 45], ['VOL', 37, 52], ['MC', 63, 52], ['MD', 88, 45], ['CA', 36, 17], ['CA', 64, 17]],
    '4-4-1-1': [['GOL', 50, 90], ['LE', 12, 70], ['ZAG', 36, 75], ['ZAG', 64, 75], ['LD', 88, 70], ['ME', 12, 47], ['VOL', 37, 55], ['MC', 63, 55], ['MD', 88, 47], ['SA', 50, 31], ['CA', 50, 14]],
    '4-2-3-1': [['GOL', 50, 90], ['LE', 12, 70], ['ZAG', 36, 75], ['ZAG', 64, 75], ['LD', 88, 70], ['VOL', 36, 57], ['VOL', 64, 57], ['PE', 14, 34], ['MEI', 50, 37], ['PD', 86, 34], ['CA', 50, 13]],
    '4-1-4-1': [['GOL', 50, 90], ['LE', 12, 70], ['ZAG', 36, 75], ['ZAG', 64, 75], ['LD', 88, 70], ['VOL', 50, 60], ['PE', 12, 38], ['MC', 36, 44], ['MC', 64, 44], ['PD', 88, 38], ['CA', 50, 14]],
    '4-3-1-2': [['GOL', 50, 90], ['LE', 12, 70], ['ZAG', 36, 75], ['ZAG', 64, 75], ['LD', 88, 70], ['MC', 28, 54], ['VOL', 50, 60], ['MC', 72, 54], ['MEI', 50, 38], ['CA', 36, 17], ['CA', 64, 17]],
    '4-5-1': [['GOL', 50, 90], ['LE', 12, 70], ['ZAG', 36, 75], ['ZAG', 64, 75], ['LD', 88, 70], ['ME', 10, 44], ['VOL', 32, 56], ['MEI', 50, 42], ['VOL', 68, 56], ['MD', 90, 44], ['CA', 50, 15]],
    '3-5-2': [['GOL', 50, 90], ['ZAG', 26, 74], ['ZAG', 50, 77], ['ZAG', 74, 74], ['ADE', 9, 47], ['VOL', 34, 56], ['MEI', 50, 40], ['MC', 66, 56], ['ADD', 91, 47], ['CA', 36, 16], ['CA', 64, 16]],
    '3-4-3': [['GOL', 50, 90], ['ZAG', 26, 74], ['ZAG', 50, 77], ['ZAG', 74, 74], ['ADE', 10, 50], ['VOL', 37, 54], ['MC', 63, 54], ['ADD', 90, 50], ['PE', 16, 22], ['CA', 50, 15], ['PD', 84, 22]],
    '5-3-2': [['GOL', 50, 90], ['ADE', 8, 64], ['ZAG', 30, 76], ['ZAG', 50, 78], ['ZAG', 70, 76], ['ADD', 92, 64], ['MC', 28, 48], ['VOL', 50, 54], ['MC', 72, 48], ['CA', 36, 17], ['CA', 64, 17]],
  };
  const NEAR = [
    ['LD', 'LE', .94], ['VOL', 'MC', .95], ['MC', 'MEI', .95], ['VOL', 'ZAG', .86], ['LD', 'ZAG', .88], ['LE', 'ZAG', .88],
    ['PE', 'PD', .95], ['PE', 'ME', .96], ['PD', 'MD', .96], ['ME', 'MD', .94], ['MEI', 'SA', .94], ['CA', 'SA', .97],
    ['PE', 'MEI', .9], ['PD', 'MEI', .9], ['PE', 'CA', .88], ['PD', 'CA', .88], ['ME', 'MC', .92], ['MD', 'MC', .92],
    ['LE', 'ME', .88], ['LD', 'MD', .88], ['LE', 'PE', .84], ['LD', 'PD', .84],
    ['ADE', 'LE', .97], ['ADD', 'LD', .97], ['ADE', 'ME', .92], ['ADD', 'MD', .92], ['ADE', 'PE', .86], ['ADD', 'PD', .86], ['ADE', 'ADD', .92],
    ['ADE', 'LD', .9], ['ADD', 'LE', .9],
  ];
  const nearMap = {};
  for (const [a, b, v] of NEAR) { nearMap[a + b] = v; nearMap[b + a] = v; }
  // posição aprendida em treino individual: quase como a de origem
  function fitI(I, slot) { const f = fit(I.pos, slot); return I.pos2 && I.pos2.includes(slot) ? Math.max(f, 0.97) : f; }
  function fit(pPos, slot) {
    if (pPos === slot) return 1;
    const ps = SETOR_OF[pPos], ss = SETOR_OF[slot];
    if (ps === 'GOL' || ss === 'GOL') return 0.35;
    if (nearMap[pPos + slot]) return nearMap[pPos + slot];
    if (ps === ss) return 0.86;
    if ((ps === 'DEF' && ss === 'ATA') || (ps === 'ATA' && ss === 'DEF')) return 0.62;
    return 0.74;
  }

  // ---------- estilos de jogo (afetam a simulação e as estatísticas) ----------
  const STYLES = {
    equilibrado: { name: 'Equilibrado', desc: 'Sem exageros. Base pra comparar.', att: 0, mid: 0, def: 0, xgF: 1, xgA: 1, fat: 1, fouls: 1, poss: 0, shotQ: 1 },
    gegenpress: { name: 'Gegenpress', desc: 'Pressão alta logo após perder a bola. Mais chances pros dois lados, desgaste alto.', att: 2, mid: 2, def: 0, xgF: 1.12, xgA: 1.05, fat: 1.35, fouls: 1.3, poss: 4, shotQ: 1 },
    tikitaka: { name: 'Tiki-taka', desc: 'Posse e passes curtos. Menos finalizações, mais qualidade. Depende do meio-campo.', att: 0, mid: 4, def: 1, xgF: 1, xgA: 0.9, fat: 0.95, fouls: 0.85, poss: 12, shotQ: 1.25 },
    contra: { name: 'Contra-ataque', desc: 'Defende baixo e sai rápido. Rende mais contra quem tem a bola.', att: 2, mid: -2, def: 2, xgF: 0.95, xgA: 0.94, fat: 1, fouls: 1, poss: -10, shotQ: 1.15 },
    direto: { name: 'Jogo direto', desc: 'Bola longa no centroavante. Bom com atacante forte, pior com meio técnico.', att: 2, mid: -2, def: 0, xgF: 1.05, xgA: 1.02, fat: 1.05, fouls: 1.05, poss: -6, shotQ: 0.9 },
    pressao: { name: 'Pressão total', desc: 'Todo mundo no ataque. Pra buscar o resultado, deixa a defesa exposta.', att: 4, mid: 0, def: -4, xgF: 1.4, xgA: 1.35, fat: 1.3, fouls: 1.15, poss: 8, shotQ: 0.95 },
    pontas: { name: 'Jogo pelas pontas', desc: 'Amplitude, cruzamentos e 1x1 pelos lados. Rende com pontas e laterais fortes.', att: 0, mid: 0, def: 0, xgF: 1.05, xgA: 1.02, fat: 1.1, fouls: 1, poss: 2, shotQ: 0.95, wings: true },
    retranca: { name: 'Estacionar o ônibus', desc: 'Linhas baixas e fechadas. Segura resultado, quase não ataca.', att: -5, mid: 0, def: 5, xgF: 0.6, xgA: 0.66, fat: 0.9, fouls: 1.1, poss: -16, shotQ: 0.9 },
  };

  // ---------- clubes ----------
  // [sigla, padrão, cores, calção, meião, torcida(1-10)]
  const K = (sig, pat, c, sh, so, fan, extra = {}) => ({ sig, pat, c, sh, so, fan, ...extra });
  const W = '#F4F4F4', B = '#141414', RED = '#D0102C', GRN = '#0B6B3A', BLU = '#1B3F9A', YEL = '#FFD200', SKY = '#6CB4EE', NAVY = '#0B1F4B', WINE = '#7A1230';
  const CLUBS_A = {
    'Flamengo': K('FLA', 'hoops', [RED, B], W, B, 10), 'Palmeiras': K('PAL', 'solid', [GRN, W], W, GRN, 8),
    'Corinthians': K('COR', 'solid', [W, B], B, B, 9), 'São Paulo': K('SAO', 'band', [W, RED, B], W, W, 8),
    'Santos': K('SAN', 'solid', [W, B], W, W, 6), 'Fluminense': K('FLU', 'vstripes', [WINE, GRN, W], W, W, 6),
    'Botafogo': K('BOT', 'vstripes', [B, W], B, '#8A8A8A', 6), 'Vasco': K('VAS', 'sash', [W, B], B, B, 7),
    'Grêmio': K('GRE', 'vstripes', ['#1E8FD8', B, '#1E8FD8', W], B, W, 7), 'Internacional': K('INT', 'solid', ['#D8102C', W], W, '#D8102C', 7),
    'Cruzeiro': K('CRU', 'solid', [BLU, W], W, BLU, 7), 'Atlético-MG': K('CAM', 'vstripes', [W, B], B, B, 7),
    'Athletico-PR': K('CAP', 'hoops', [B, RED], B, B, 5), 'Bahia': K('BAH', 'band', [W, '#005CA9', RED], '#005CA9', W, 6),
    'Bragantino': K('RBB', 'band', [W, RED, W], W, RED, 3), 'Vitória': K('VIT', 'vstripes', [RED, B], W, B, 5),
    'Coritiba': K('CFC', 'band', [W, GRN, W], B, W, 4), 'Mirassol': K('MIR', 'solid', [YEL, GRN], GRN, YEL, 2),
    'Remo': K('REM', 'solid', [NAVY, W], NAVY, NAVY, 5), 'Chapecoense': K('CHA', 'solid', ['#0B8A3E', W], W, W, 3),
  };
  const CLUBS_REL = {
    'Sport': K('SPT', 'hoops', [RED, B], B, B, 5), 'Ceará': K('CEA', 'vstripes', [B, W], B, W, 5),
    'Fortaleza': K('FOR', 'hoops3', [RED, W, BLU], BLU, RED, 5), 'Juventude': K('JUV', 'vstripes', [GRN, W], W, W, 3),
  };
  // Série B com elencos gerados: [sigla, padrão, cores, calção, meião, torcida, força-alvo]
  const CLUBS_B_GEN = {
    'Goiás': K('GOI', 'solid', [GRN, W], W, GRN, 4, { lvl: 63 }), 'Novorizontino': K('NOV', 'solid', [YEL, B], B, YEL, 2, { lvl: 63 }),
    'CRB': K('CRB', 'hoops', [RED, W], W, RED, 3, { lvl: 61 }), 'Avaí': K('AVA', 'vstripes', ['#1B6FC2', W], W, '#1B6FC2', 3, { lvl: 61 }),
    'Criciúma': K('CRI', 'vstripes', [YEL, B], B, B, 3, { lvl: 62 }), 'Cuiabá': K('CUI', 'solid', [YEL, GRN], GRN, YEL, 2, { lvl: 62 }),
    'Atlético-GO': K('ACG', 'vstripes', [RED, B], B, RED, 3, { lvl: 62 }), 'Operário-PR': K('OPE', 'vstripes', [B, W], B, W, 2, { lvl: 60 }),
    'Vila Nova': K('VIL', 'solid', [RED, W], W, RED, 3, { lvl: 60 }), 'América-MG': K('AME', 'vstripes', [GRN, B], B, GRN, 3, { lvl: 62 }),
    'Ponte Preta': K('PON', 'sash', [W, B], B, W, 3, { lvl: 59 }), 'Botafogo-SP': K('BFS', 'vstripes', [RED, W], W, RED, 2, { lvl: 59 }),
    'Londrina': K('LON', 'solid', [SKY, W], W, SKY, 2, { lvl: 58 }), 'Náutico': K('NAU', 'vstripes', [RED, W], W, RED, 3, { lvl: 59 }),
    'Athletic': K('ATH', 'solid', [B, W], B, B, 1, { lvl: 57 }), 'São Bernardo': K('SBC', 'hoops', [YEL, B], B, YEL, 1, { lvl: 57 }),
  };
  // copas regionais: clubes que completam as vagas (elencos gerados, fictícios) · reg: NE, SSE (Sul-Sudeste), N, CO (Centro-Oeste + ES + TO)
  const ORG = '#FF7A00', GOLD = '#E0B000';
  const CLUBS_REG_GEN = {
    'ABC': K('ABC', 'solid', [W, B], B, W, 3, { lvl: 52, reg: 'NE' }), 'América-RN': K('AMR', 'solid', [RED, W], W, RED, 2, { lvl: 50, reg: 'NE' }),
    'CSA': K('CSA', 'hoops', [BLU, W], W, BLU, 3, { lvl: 52, reg: 'NE' }), 'Botafogo-PB': K('BPB', 'vstripes', [B, W], B, B, 2, { lvl: 52, reg: 'NE' }),
    'Treze': K('TRE', 'vstripes', [B, W], W, B, 2, { lvl: 49, reg: 'NE' }), 'Confiança': K('CON', 'solid', [BLU, W], W, BLU, 2, { lvl: 50, reg: 'NE' }),
    'Sampaio Corrêa': K('SAM', 'band', [GRN, YEL, RED], B, GRN, 3, { lvl: 51, reg: 'NE' }), 'Ferroviário': K('FER', 'hoops', [RED, B], B, RED, 2, { lvl: 50, reg: 'NE' }),
    'Altos': K('ALT', 'solid', [YEL, GRN], GRN, YEL, 1, { lvl: 48, reg: 'NE' }), 'Juazeirense': K('JUA', 'solid', [ORG, B], B, ORG, 1, { lvl: 48, reg: 'NE' }),
    'Sergipe': K('SER', 'vstripes', [RED, W], W, RED, 1, { lvl: 47, reg: 'NE' }), 'Moto Club': K('MOT', 'vstripes', [RED, B], B, RED, 2, { lvl: 48, reg: 'NE' }),
    'Tombense': K('TOM', 'solid', [RED, W], W, RED, 1, { lvl: 51, reg: 'SSE', off: 1 }), 'Caxias': K('CAX', 'solid', [WINE, W], W, WINE, 2, { lvl: 52, reg: 'SSE' }),
    'Cianorte': K('CIA', 'solid', [BLU, W], W, BLU, 1, { lvl: 49, reg: 'SSE' }), 'Volta Redonda': K('VOL', 'solid', [YEL, B], B, YEL, 1, { lvl: 53, reg: 'SSE' }),
    'Figueirense': K('FIG', 'vstripes', [B, W], B, B, 3, { lvl: 53, reg: 'SSE' }), 'Ituano': K('ITU', 'vstripes', [RED, B], B, RED, 1, { lvl: 53, reg: 'SSE' }),
    'Paysandu': K('PAY', 'vstripes', [SKY, W], W, SKY, 5, { lvl: 54, reg: 'N' }), 'Amazonas': K('AMZ', 'vstripes', [YEL, B], B, YEL, 2, { lvl: 53, reg: 'N' }),
    'Nacional-AM': K('NAM', 'solid', [BLU, W], W, BLU, 2, { lvl: 49, reg: 'N' }), 'Águia de Marabá': K('AGU', 'solid', [BLU, W], BLU, W, 1, { lvl: 50, reg: 'N' }),
    'Porto Velho': K('POV', 'solid', [RED, W], W, RED, 1, { lvl: 47, reg: 'N' }), 'GAS': K('GAS', 'solid', [GRN, W], W, GRN, 1, { lvl: 46, reg: 'N' }),
    'Trem': K('TRM', 'vstripes', [RED, W], W, RED, 1, { lvl: 46, reg: 'N' }), 'Independência-AC': K('IND', 'hoops', [GRN, W], W, GRN, 1, { lvl: 46, reg: 'N' }),
    'Anápolis': K('ANA', 'vstripes', [RED, W], W, RED, 1, { lvl: 50, reg: 'CO' }), 'Gama': K('GAM', 'solid', [GRN, W], W, GRN, 2, { lvl: 49, reg: 'CO' }),
    'Capital': K('CPT', 'solid', [GOLD, B], B, GOLD, 1, { lvl: 49, reg: 'CO' }), 'Operário-MS': K('OMS', 'vstripes', [B, W], B, B, 1, { lvl: 49, reg: 'CO' }),
    'Rio Branco-ES': K('RBE', 'vstripes', [B, W], W, B, 1, { lvl: 48, reg: 'CO', off: 1 }), 'Porto Vitória': K('PVT', 'solid', [BLU, YEL], BLU, YEL, 1, { lvl: 47, reg: 'CO', off: 1 }),
    'Araguaína': K('ARA', 'solid', [ORG, W], W, ORG, 1, { lvl: 48, reg: 'CO' }), 'Primavera': K('PRI', 'solid', [GRN, YEL], GRN, YEL, 1, { lvl: 48, reg: 'CO' }),
    // elencos reais (planilhas Série C/D 2026): substituem Tombense, Rio Branco-ES e Porto Vitória, que não têm elenco no Transfermarkt
    'Portuguesa': K('LUS', 'hoops', [RED, GRN], W, RED, 3, { lvl: 50, reg: 'SSE', add: 1 }), 'Brasiliense': K('BSE', 'solid', [YEL, GRN], GRN, YEL, 2, { lvl: 50, reg: 'CO', add: 1 }),
    'Luverdense': K('LUV', 'solid', [GRN, W], W, GRN, 1, { lvl: 49, reg: 'CO', add: 1 }),
    // Série C 2026 (elencos reais): clubes que não estavam nas copas regionais
    'Santa Cruz': K('STA', 'hoops3', [RED, B, W], B, B, 5, { lvl: 51, reg: 'NE', add: 1 }), 'Itabaiana': K('ITA', 'solid', [BLU, W], W, BLU, 1, { lvl: 51, reg: 'NE', add: 1 }),
    'Floresta': K('FLO', 'vstripes', [GRN, W], W, GRN, 1, { lvl: 51, reg: 'NE', add: 1 }), 'Maranhão': K('MAC', 'hoops3', [RED, W, BLU], BLU, RED, 2, { lvl: 51, reg: 'NE', add: 1 }),
    'Guarani': K('GUA', 'solid', [GRN, W], W, GRN, 4, { lvl: 51, reg: 'SSE', add: 1 }), 'Ferroviária': K('AFE', 'solid', [WINE, W], W, WINE, 2, { lvl: 51, reg: 'SSE', add: 1 }),
    'Inter de Limeira': K('INL', 'vstripes', [B, W], B, B, 2, { lvl: 51, reg: 'SSE', add: 1 }), 'Brusque': K('BRU', 'band', [YEL, RED, GRN], W, YEL, 2, { lvl: 51, reg: 'SSE', add: 1 }),
    'Barra': K('BAR', 'solid', [SKY, W], W, SKY, 1, { lvl: 51, reg: 'SSE', add: 1 }), 'Ypiranga': K('YPI', 'solid', [GRN, YEL], W, GRN, 1, { lvl: 51, reg: 'SSE', add: 1 }),
    'Maringá': K('MGA', 'solid', [BLU, W], W, BLU, 1, { lvl: 51, reg: 'SSE', add: 1 }),
  };
  // Série C 2026 (20 clubes reais) · temporadas seguintes: quem sobe e quem cai muda a lista
  const SERIE_C_2026 = ['Amazonas', 'Volta Redonda', 'Santa Cruz', 'Barra', 'Ferroviária', 'Figueirense', 'Paysandu', 'Caxias', 'Guarani', 'Itabaiana',
    'Brusque', 'Floresta', 'Confiança', 'Maranhão', 'Ypiranga', 'Inter de Limeira', 'Maringá', 'Ituano', 'Botafogo-PB', 'Anápolis'];
  // região dos clubes do jogo (Série A e B)
  // selos de treinador (estante na carreira). Missão Cumprida conta os objetivos cumpridos (kind 'obj').
  const SELOS = [
    { k: 'missao', label: 'Missão Cumprida', desc: 'Cumpriu o objetivo da diretoria na temporada.', col: '#5FF5D6' },
    { k: 'papa', label: 'Papa-Títulos', desc: 'Dois ou mais títulos na mesma temporada.', col: '#FFD84A' },
    { k: 'copeiro', label: 'Copeiro', desc: 'Duas ou mais copas na mesma temporada.', col: '#FF9A3C' },
    { k: 'leite', label: 'Tirou Leite de Pedra', desc: 'Terminou 5 ou mais posições acima do esperado pro elenco.', col: '#F3F4F8' },
    { k: 'salvador', label: 'Salvador da Pátria', desc: 'Assumiu na zona de rebaixamento (a partir da 10ª rodada) e salvou o clube.', col: '#F06B5F' },
    { k: 'rolo', label: 'Rolo Compressor', desc: 'Melhor ataque da divisão na temporada.', col: '#D7FF3A' },
    { k: 'muralha', label: 'Muralha', desc: 'Melhor defesa da divisão na temporada.', col: '#6FA8FF' },
    { k: 'acesso', label: 'Acesso', desc: 'Subiu de divisão (Série B → A ou Série C → B).', col: '#9B7BFF' },
    { k: 'formador', label: 'Formador', desc: 'Rompeu o teto de 2 ou mais jovens na mesma temporada.', col: '#9B7BFF' },
    { k: 'tipster', label: 'Tipster', desc: 'Mais acertos nos Palpites da liga na temporada.', col: '#FF9A3C' },
    { k: 'prim', label: 'Os Primordiais', desc: 'Esteve no Treineiros desde o começo e viu a chegada da v100.', col: '#F7A1EC', rare: 1 },
  ];
  // v205: fama do treinador (6 traços por temporada; fechou 6/6 na virada, ganha a tag)
  const FAMA_INFO = {
    form: { l: 'Revelador', i: 'revela', c: 'var(--mint)', d: 'Dá minutos de verdade pros jovens (até 23 anos).', how: 'Conta a fatia dos minutos do time jogada por jovens até 23 anos: com 3 jovens titulares na maior parte da temporada, fecha.' },
    proj: { l: 'Gestor', i: 'gestao', c: 'var(--blue)', d: 'Cuida do dinheiro: mercado no azul, folha controlada, salário em dia.', how: 'Vendeu mais do que comprou: 2 traços (empate: 1). Folha igual ou menor que a do início: 2 (até 10% maior: 1). Nenhum salário atrasado: 1. Caixa acima do início: 1.' },
    raca: { l: 'Raiz', i: 'raiz', c: 'var(--yellow)', d: 'Faz a casa pesar: rende mais em casa do que fora.', how: 'Compara os pontos por jogo em casa com a média do time na temporada. Não depende de ter time forte nem rival na série.' },
    camisa: { l: 'Decisivo', i: 'alvo', c: 'var(--coral)', d: 'Termina o campeonato acima do que o elenco indica.', how: 'Compara a posição na tabela com a posição esperada pelo valor do elenco (a mesma régua da meta da diretoria): igual vale 3 traços, cada posição acima +1. Campeão fecha os 6.' },
  };
  const CLUB_REGION = {
    NE: ['Bahia', 'Vitória', 'Sport', 'Ceará', 'Fortaleza', 'CRB', 'Náutico'],
    N: ['Remo'],
    CO: ['Goiás', 'Atlético-GO', 'Vila Nova', 'Cuiabá'],
    SSE: ['Grêmio', 'Internacional', 'Athletico-PR', 'Coritiba', 'Chapecoense', 'Juventude', 'Avaí', 'Criciúma', 'Operário-PR', 'Londrina',
      'Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Santos', 'Fluminense', 'Botafogo', 'Vasco', 'Cruzeiro', 'Atlético-MG', 'Bragantino', 'Mirassol',
      'Novorizontino', 'América-MG', 'Ponte Preta', 'Botafogo-SP', 'Athletic', 'São Bernardo'],
  };
  const regionOf = club => { const g = CLUBS_REG_GEN[club]; if (g) return g.reg; for (const r in CLUB_REGION) if (CLUB_REGION[r].includes(club)) return r; return null; };
  // estrangeiros com elenco gerado (a Argentina e a Colômbia usam elencos reais do TM)
  const CLUBS_F_GEN = {
    'Peñarol': K('PEÑ', 'vstripes', [YEL, B], B, YEL, 6, { lvl: 69, nat: 'URU' }), 'Nacional': K('NAC', 'solid', [W, BLU], BLU, W, 6, { lvl: 68, nat: 'URU' }),
    'Colo-Colo': K('COL', 'solid', [W, B], B, W, 6, { lvl: 67, nat: 'CHI' }), 'Universidad de Chile': K('UCH', 'solid', [BLU, W], W, BLU, 5, { lvl: 65, nat: 'CHI' }),
    'Olimpia': K('OLI', 'band', [W, B, W], B, W, 5, { lvl: 67, nat: 'PAR' }), 'Cerro Porteño': K('CCP', 'vstripes', [BLU, RED], BLU, BLU, 5, { lvl: 66, nat: 'PAR' }),
    'Libertad': K('LIB', 'vstripes', [B, W], B, B, 3, { lvl: 65, nat: 'PAR' }), 'LDU Quito': K('LDU', 'solid', [W, RED], W, W, 5, { lvl: 67, nat: 'EQU' }),
    'Independiente del Valle': K('IDV', 'vstripes', [B, BLU], B, B, 3, { lvl: 68, nat: 'EQU' }), 'Barcelona SC': K('BSC', 'solid', [YEL, B], B, YEL, 5, { lvl: 65, nat: 'EQU' }),
    'Universitario': K('UNI', 'solid', ['#F2E6C8', WINE], '#F2E6C8', '#F2E6C8', 5, { lvl: 64, nat: 'PER' }), 'Alianza Lima': K('ALI', 'vstripes', [NAVY, W], NAVY, NAVY, 5, { lvl: 63, nat: 'PER' }),
    'Sporting Cristal': K('SCR', 'solid', [SKY, W], W, SKY, 4, { lvl: 63, nat: 'PER' }), 'Bolívar': K('BOL', 'solid', [SKY, W], W, SKY, 4, { lvl: 62, nat: 'BOL' }),
    'The Strongest': K('TST', 'vstripes', [YEL, B], B, YEL, 4, { lvl: 61, nat: 'BOL' }),
  };
  // v209: Copa Intercontinental da FIFA. Clubes de fora da América do Sul (nomes reais, escudo gerado pelas cores; nada oficial).
  // ORDEM FIXA: o índice define os ids dos jogadores gerados (710000000 + 100 × índice). Só acrescentar no fim.
  // real: tem elenco real nos dados (completa o que faltar com gerados); senão o elenco é todo gerado.
  const INT_CLUBS = {
    'Paris Saint-Germain': K('PSG', 'band', [NAVY, RED, NAVY], NAVY, NAVY, 9, { conf: 'UEFA', nat: 'FRA', real: 1 }),
    'Deportivo Toluca': K('TOL', 'solid', [RED, W], W, RED, 7, { conf: 'CON', nat: 'MEX', real: 1 }),
    'Mamelodi Sundowns': K('MSU', 'solid', [YEL, GRN], GRN, YEL, 6, { conf: 'CAF', nat: 'RSA', lvl: 71, real: 1, wasGen: 1 }),
    'Al-Ahli Saudi': K('AHL', 'solid', [GRN, W], W, GRN, 6, { conf: 'AFC', nat: 'KSA', real: 1 }),
    'Auckland FC': K('AFC', 'solid', [NAVY, '#9FD6F2'], W, NAVY, 4, { conf: 'OFC', nat: 'NZL', lvl: 62, real: 1, wasGen: 1 }),
    'Real Madrid': K('RMA', 'solid', [W, '#C9A227'], W, W, 10, { conf: 'UEFA', nat: 'ESP', real: 1 }),
    'Bayern Munich': K('BAY', 'solid', [RED, W], RED, RED, 9, { conf: 'UEFA', nat: 'ALE', real: 1 }),
    'Manchester City': K('MCI', 'solid', [SKY, W], W, SKY, 9, { conf: 'UEFA', nat: 'ING', real: 1 }),
    'Liverpool': K('LIV', 'solid', [RED, W], RED, RED, 9, { conf: 'UEFA', nat: 'ING', real: 1 }),
    'Barcelona': K('BAR', 'vstripes', [WINE, NAVY], NAVY, NAVY, 9, { conf: 'UEFA', nat: 'ESP', real: 1 }),
    'Arsenal': K('ARS', 'solid', [RED, W], W, RED, 8, { conf: 'UEFA', nat: 'ING', real: 1 }),
    'Inter Milan': K('INT', 'vstripes', [BLU, B], B, B, 8, { conf: 'UEFA', nat: 'ITA', real: 1 }),
    'CD Cruz Azul': K('CAZ', 'solid', [BLU, W], BLU, BLU, 6, { conf: 'CON', nat: 'MEX', real: 1 }),
    'Monterrey': K('MTY', 'vstripes', [NAVY, W], NAVY, NAVY, 6, { conf: 'CON', nat: 'MEX', real: 1 }),
    'Tigres UANL': K('TIG', 'solid', [YEL, BLU], BLU, YEL, 6, { conf: 'CON', nat: 'MEX', real: 1 }),
    'Al Ahly': K('ALY', 'solid', [RED, W], W, RED, 7, { conf: 'CAF', nat: 'EGY', lvl: 72, real: 1, wasGen: 1 }),
    'Pyramids': K('PYR', 'solid', [NAVY, W], NAVY, NAVY, 5, { conf: 'CAF', nat: 'EGY', lvl: 70, real: 1, wasGen: 1 }),
    'Espérance de Tunis': K('EST', 'vstripes', [RED, YEL], RED, RED, 6, { conf: 'CAF', nat: 'TUN', lvl: 69, real: 1, wasGen: 1 }),
    'Al-Hilal Saudi': K('HIL', 'solid', [BLU, W], W, BLU, 8, { conf: 'AFC', nat: 'KSA', real: 1 }),
    'Al-Nassr': K('NAS', 'solid', [YEL, BLU], BLU, YEL, 8, { conf: 'AFC', nat: 'KSA', real: 1 }),
    'Zamalek': K('ZAM', 'band', [W, RED, W], W, W, 7, { conf: 'CAF', nat: 'EGY', real: 1 }),
    'Al-Ittihad': K('ITT', 'vstripes', [YEL, B], B, YEL, 8, { conf: 'AFC', nat: 'KSA', real: 1 }),
    'Al-Qadsiah Saudi': K('QAD', 'halves', [RED, YEL], RED, RED, 5, { conf: 'AFC', nat: 'KSA', real: 1 }),
  };
  // participantes reais de cada ano (o campeão da Libertadores é o do jogo). Anos sem lista: sorteio pela força entre os clubes da confederação.
  const INTER = {
    2026: { UEFA: 'Paris Saint-Germain', CON: 'Deportivo Toluca', AAP: { win: 'Mamelodi Sundowns', res: [['Al-Ahli Saudi', 'Auckland FC', 1, 0], ['Mamelodi Sundowns', 'Al-Ahli Saudi', 2, 0]] } },
  };
  const KITS_KNOWN = {
    'Boca Juniors': K('BOC', 'band', [NAVY, YEL, NAVY], NAVY, NAVY, 9), 'River Plate': K('RIV', 'sash', [W, RED], B, W, 9),
    'Racing': K('RAC', 'vstripes', [SKY, W], B, W, 6), 'Independiente': K('IND', 'solid', [RED, W], NAVY, RED, 6),
    'San Lorenzo': K('SLO', 'vstripes', [NAVY, RED], W, NAVY, 6), 'Estudiantes': K('EST', 'vstripes', [RED, W], B, RED, 5),
    'Vélez Sarsfield': K('VEL', 'solid', [W, BLU], W, W, 5), "Newell's": K('NOB', 'halves', [RED, B], B, B, 5),
    'Rosario Central': K('RCE', 'vstripes', [NAVY, YEL], NAVY, NAVY, 5), 'Talleres': K('TAL', 'vstripes', [NAVY, W], NAVY, NAVY, 5),
    'Lanús': K('LAN', 'solid', [WINE, W], WINE, WINE, 4), 'Huracán': K('HUR', 'solid', [W, RED], W, W, 4),
    'Argentinos Jrs': K('ARJ', 'solid', [RED, W], W, RED, 3), 'Atlético Nacional': K('NAL', 'vstripes', [GRN, W], W, GRN, 7),
    'Millonarios': K('MIL', 'solid', [BLU, W], W, BLU, 6), 'Junior': K('JUN', 'vstripes', [RED, W], BLU, W, 5),
    'América de Cali': K('AMC', 'solid', [RED, W], RED, RED, 6), 'Santa Fe': K('SFE', 'solid', [RED, W], W, RED, 5),
    'Deportivo Cali': K('DCA', 'solid', [GRN, W], W, GRN, 5), 'Once Caldas': K('ONC', 'solid', [W, B], B, W, 4),
    'Ind. Medellín': K('DIM', 'solid', [RED, BLU], BLU, RED, 5),
  };
  const DERBIES = [['Flamengo', 'Fluminense'], ['Flamengo', 'Vasco'], ['Flamengo', 'Botafogo'], ['Fluminense', 'Vasco'], ['Fluminense', 'Botafogo'], ['Vasco', 'Botafogo'],
    ['Palmeiras', 'Corinthians'], ['Palmeiras', 'São Paulo'], ['Palmeiras', 'Santos'], ['Corinthians', 'São Paulo'], ['Corinthians', 'Santos'], ['São Paulo', 'Santos'],
    ['Grêmio', 'Internacional'], ['Cruzeiro', 'Atlético-MG'], ['Bahia', 'Vitória'], ['Athletico-PR', 'Coritiba'], ['Ceará', 'Fortaleza'], ['Sport', 'Náutico'],
    ['Goiás', 'Atlético-GO'], ['Goiás', 'Vila Nova'], ['Atlético-GO', 'Vila Nova'], ['Remo', 'Paysandu'], ['Boca Juniors', 'River Plate'], ['Racing', 'Independiente'],
    ['Peñarol', 'Nacional'], ['Olimpia', 'Cerro Porteño'], ['Atlético Nacional', 'Millonarios'], ['Universitario', 'Alianza Lima'], ['Bolívar', 'The Strongest']];
  const derbySet = new Set(DERBIES.map(([a, b]) => [a, b].sort().join('|')));
  const isDerby = (a, b) => derbySet.has([a, b].sort().join('|'));

  // ---------- v200: DNA do clube (proposta Fable/Vini). Por enquanto só aparece na tela: não muda nada no jogo ----------
  // v251: DNA_MODE 'B' = os 4 C com par (principal + secundário, classificação do Vini no quadro); 'A' = DNA único (DNA_CLUBS). Pra voltar à A: trocar pra 'A'.
  const DNA_MODE = 'B';
  const DNA_TXT = {
    form: { A: ['Formador', 'Clube que se orgulha de revelar. Conta minuto de jogador jovem (até 23 anos) em jogo oficial.'], B: ['Celeiro', 'Clube que vive da base. Conta minuto de jogador jovem (até 23 anos) em jogo oficial.'] },
    proj: { A: ['Projeto', 'Clube de planejamento. Conta caixa crescendo, venda com lucro e folha sob controle.'], B: ['Caixa', 'Clube de contas em dia. Conta o caixa crescendo na temporada.'] },
    raca: { A: ['Raça', 'Clube de luta. Conta pontos em clássico e em casa.'], B: ['Caldeirão', 'Clube da arquibancada. Conta pontos em clássico e em casa.'] },
    camisa: { A: ['Camisa', 'Obrigação de estar no topo da própria série. Conta posição acima da esperada e fases de copa.'], B: ['Copa', 'Clube de taça. Conta pontos acima do esperado pro elenco e mata-mata e final de copa vencidos.'] },
  };
  const DNA_INFO = {
    form: { q: 'A base está jogando?', fama: 'Revelador', fi: 'revela', c: 'var(--mint)' },
    proj: { q: 'O clube ficou mais rico?', fama: 'Gestor', fi: 'gestao', c: 'var(--blue)' },
    raca: { q: 'Ganhamos os jogos que importam?', fama: 'Raiz', fi: 'raiz', c: 'var(--yellow)' },
    camisa: { q: 'Estamos onde devíamos estar?', fama: 'Decisivo', fi: 'alvo', c: 'var(--coral)' },
  };
  for (const k in DNA_INFO) { const [l, d] = DNA_TXT[k][DNA_MODE]; DNA_INFO[k].l = l; DNA_INFO[k].d = d; }
  // v251: Opção B — [principal, secundário] por clube (quadro ANPT2F4uotCew6nwAKSPEn, 04/10)
  const DNA_PAIR = {"Vila Nova": ["raca", "camisa"], "Cruzeiro": ["proj", "camisa"], "Grêmio": ["camisa", "raca"], "Botafogo-PB": ["raca", "camisa"], "São Bernardo": ["proj", "camisa"], "Operário-PR": ["proj", "raca"], "Atlético-MG": ["raca", "proj"], "Ferroviária": ["form", "proj"], "Floresta": ["proj", "camisa"], "Brusque": ["proj", "camisa"], "Sport": ["camisa", "raca"], "Flamengo": ["camisa", "raca"], "São Paulo": ["camisa", "form"], "Criciúma": ["camisa", "raca"], "Figueirense": ["raca", "camisa"], "Anápolis": ["camisa", "proj"], "Cuiabá": ["proj", "camisa"], "Botafogo-SP": ["form", "proj"], "Amazonas": ["proj", "camisa"], "Ceará": ["camisa", "raca"], "CRB": ["raca", "camisa"], "Internacional": ["camisa", "raca"], "Volta Redonda": ["form", "proj"], "Paysandu": ["raca", "camisa"], "Athletic": ["proj", "form"], "Goiás": ["form", "camisa"], "Mirassol": ["proj", "form"], "Athletico-PR": ["proj", "form"], "Vasco": ["raca", "form"], "Novorizontino": ["proj", "form"], "Ituano": ["form", "proj"], "Itabaiana": ["camisa", "raca"], "Fluminense": ["form", "camisa"], "Chapecoense": ["proj", "raca"], "Santos": ["form", "raca"], "Guarani": ["form", "camisa"], "Remo": ["raca", "camisa"], "Ponte Preta": ["form", "raca"], "Bragantino": ["proj", "form"], "Bahia": ["raca", "proj"], "Inter de Limeira": ["camisa", "form"], "Coritiba": ["form", "raca"], "Corinthians": ["raca", "camisa"], "Avaí": ["raca", "form"], "Fortaleza": ["raca", "proj"], "Maranhão": ["raca", "proj"], "Botafogo": ["proj", "camisa"], "Juventude": ["form", "proj"], "Barra": ["proj", "form"], "Maringá": ["proj", "form"], "Caxias": ["raca", "form"], "América-MG": ["form", "proj"], "Vitória": ["form", "raca"], "Ypiranga": ["camisa", "proj"], "Atlético-GO": ["form", "proj"], "Náutico": ["raca", "form"], "Palmeiras": ["camisa", "proj"], "Confiança": ["camisa", "proj"], "Santa Cruz": ["raca", "camisa"], "Londrina": ["form", "proj"]};
  const DNA_CLUBS = {
    camisa: ['Flamengo', 'Cruzeiro', 'Botafogo', 'Grêmio', 'Internacional', 'Sport', 'Goiás', 'Santa Cruz', 'Paysandu'],
    raca: ['Corinthians', 'Vasco', 'Atlético-MG', 'Vitória', 'Chapecoense', 'Remo', 'Ceará', 'CRB', 'Vila Nova', 'Náutico', 'Avaí', 'Caxias', 'Confiança', 'Botafogo-PB', 'Itabaiana', 'Maranhão'],
    form: ['Santos', 'Fluminense', 'São Paulo', 'Coritiba', 'América-MG', 'Ponte Preta', 'Botafogo-SP', 'Guarani', 'Ferroviária', 'Figueirense', 'Inter de Limeira', 'Volta Redonda'],
    proj: ['Palmeiras', 'Athletico-PR', 'Bragantino', 'Mirassol', 'Bahia', 'Fortaleza', 'Juventude', 'Novorizontino', 'Cuiabá', 'Operário-PR', 'Athletic', 'São Bernardo', 'Atlético-GO', 'Londrina', 'Criciúma', 'Amazonas', 'Barra', 'Brusque', 'Ituano', 'Maringá', 'Ypiranga', 'Floresta', 'Anápolis'],
  };
  const DNA_OF = {}; for (const k in DNA_CLUBS) for (const c of DNA_CLUBS[k]) DNA_OF[c] = k;
  const dnaOf = club => DNA_MODE === 'B' ? ((DNA_PAIR[club] || [])[0] || null) : (DNA_OF[club] || null);
  const dna2Of = club => DNA_MODE === 'B' ? ((DNA_PAIR[club] || [])[1] || null) : null;   // v251: secundário (só na B)

  // ---------- árbitros (nomes inventados) ----------
  // árbitros reais: quadro da CBF (competições nacionais) e da CONMEBOL (continentais). [nome, rigor 1-5, nível 1-5, país]
  const REFEREES = [
    ['Raphael Claus', 3, 5, 'BRA'], ['Wilton Pereira Sampaio', 4, 5, 'BRA'], ['Anderson Daronco', 4, 5, 'BRA'], ['Ramon Abatti Abel', 3, 4, 'BRA'], ['Bruno Arleu de Araújo', 3, 4, 'BRA'],
    ['Rafael Rodrigo Klein', 3, 4, 'BRA'], ['Braulio da Silva Machado', 4, 4, 'BRA'], ['Flávio Rodrigues de Souza', 3, 4, 'BRA'], ['Paulo César Zanovelli', 2, 3, 'BRA'], ['Savio Pereira Sampaio', 3, 4, 'BRA'],
    ['Luiz Flávio de Oliveira', 4, 3, 'BRA'], ['Rodrigo José Pereira de Lima', 3, 3, 'BRA'], ['Matheus Delgado Candançan', 3, 4, 'BRA'], ['Bruno Pereira Vasconcelos', 2, 3, 'BRA'], ['Wagner do Nascimento Magalhães', 4, 3, 'BRA'],
    ['Marcelo de Lima Henrique', 3, 3, 'BRA'], ['Davi de Oliveira Lacerda', 2, 3, 'BRA'], ['Igor Junio Benevenuto', 3, 3, 'BRA'], ['Lucas Paulo Torezin', 2, 3, 'BRA'], ['Felipe Fernandes de Lima', 3, 3, 'BRA'],
    ['Gustavo Ervino Bauermann', 3, 3, 'BRA'], ['Edina Alves Batista', 3, 4, 'BRA'], ['Jonathan Benkenstein Pinheiro', 2, 3, 'BRA'], ['Alex Gomes Stefano', 3, 3, 'BRA'],
    ['Wilmar Roldán', 4, 5, 'COL'], ['Jesús Valenzuela', 4, 4, 'VEN'], ['Facundo Tello', 3, 5, 'ARG'], ['Darío Herrera', 4, 4, 'ARG'], ['Andrés Matonte', 3, 4, 'URU'],
    ['Esteban Ostojich', 3, 5, 'URU'], ['Piero Maza', 4, 4, 'CHI'], ['Cristian Garay', 3, 3, 'CHI'], ['Kevin Ortega', 3, 4, 'PER'], ['Juan Gabriel Benítez', 4, 4, 'PAR'],
    ['Andrés Rojas', 3, 4, 'COL'], ['Gustavo Tejera', 3, 4, 'URU'], ['Guillermo Guerrero', 4, 3, 'EQU'], ['Yender Herrera', 3, 4, 'VEN'],
  ].map(([name, rigor, nivel, nat], i) => ({ id: i, name, rigor, nivel, nat }));

  // ---------- nomes gerados ----------
  const BR_F = ['João', 'Pedro', 'Lucas', 'Gabriel', 'Matheus', 'Rafael', 'Gustavo', 'Felipe', 'Bruno', 'Thiago', 'Vinícius', 'Caio', 'Diego', 'Rodrigo', 'André', 'Leonardo',
    'Marcelo', 'Eduardo', 'Henrique', 'Igor', 'Wesley', 'Yago', 'Kauã', 'Ryan', 'Davi', 'Luan', 'Erick', 'Alisson', 'Jonathan', 'Wellington', 'Everton', 'Renan', 'Rômulo',
    'Nathan', 'Samuel', 'Arthur', 'Heitor', 'Enzo', 'Otávio', 'Robson', 'Cleiton', 'Maicon', 'Talles', 'Kevin', 'Ruan', 'Luiz', 'Paulo', 'Guilherme', 'Murilo', 'Emerson'];
  const BR_L = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa', 'Ferreira', 'Almeida', 'Ribeiro', 'Carvalho', 'Gomes', 'Martins', 'Araújo', 'Rocha',
    'Barbosa', 'Cardoso', 'Teixeira', 'Moreira', 'Nunes', 'Mendes', 'Freitas', 'Dias', 'Pinto', 'Moura', 'Batista', 'Campos', 'Correia', 'Vieira', 'Monteiro', 'Cavalcanti',
    'Farias', 'Aguiar', 'Macedo', 'Brito', 'Sales', 'Queiroz', 'Paiva', 'Tavares', 'Xavier', 'Bezerra', 'Lopes', 'Rezende', 'Prates', 'Sampaio'];
  const ES_F = ['Juan', 'Carlos', 'Diego', 'Matías', 'Nicolás', 'Santiago', 'Sebastián', 'Facundo', 'Agustín', 'Lucas', 'Franco', 'Gonzalo', 'Joaquín', 'Rodrigo', 'Martín',
    'Andrés', 'Felipe', 'Jorge', 'Luis', 'Miguel', 'Cristian', 'Brian', 'Kevin', 'Emiliano', 'Tomás', 'Ignacio', 'Maximiliano', 'Julián', 'Fernando', 'Óscar'];
  const ES_L = ['González', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'Pérez', 'Gómez', 'Sánchez', 'Díaz', 'Álvarez', 'Romero', 'Torres', 'Ruiz', 'Ramírez', 'Flores',
    'Benítez', 'Acosta', 'Medina', 'Herrera', 'Suárez', 'Aguirre', 'Rojas', 'Castro', 'Vargas', 'Ortiz', 'Núñez', 'Cabrera', 'Morales', 'Ríos', 'Paredes', 'Valencia',
    'Mosquera', 'Quintero', 'Cáceres', 'Villalba'];
  const EN_F = ['James', 'Liam', 'Jack', 'Oliver', 'Noah', 'Ethan', 'Ryan', 'Callum', 'Logan', 'Max', 'Sam', 'Tyler', 'Jordan', 'Cameron', 'Harry', 'Ben'], EN_L = ['Smith', 'Brown', 'Wilson', 'Taylor', 'Walker', 'Clarke', 'Hughes', 'Turner', 'Mitchell', 'Reid', 'Scott', 'Young', 'Wright', 'Hall', 'Thompson', 'Bell'];
  const AR_F = ['Mohamed', 'Ahmed', 'Omar', 'Youssef', 'Karim', 'Hamza', 'Ali', 'Mahmoud', 'Tarek', 'Hassan', 'Khaled', 'Amr', 'Ziad', 'Saad', 'Fahad', 'Salem'], AR_L = ['Hassan', 'Ibrahim', 'El-Sayed', 'Mansour', 'Fathi', 'Saleh', 'Al-Harbi', 'Al-Qahtani', 'Ben Ali', 'Trabelsi', 'Hamdi', 'Nasser', 'Kamal', 'Farouk', 'Al-Shehri', 'Jaziri'];
  const ZA_F = ['Themba', 'Sipho', 'Thabo', 'Lebo', 'Teboho', 'Mothobi', 'Kabelo', 'Bongani', 'Lucky', 'Ronwen', 'Aubrey', 'Peter', 'Neo', 'Siyabonga', 'Tashreeq', 'Grant'], ZA_L = ['Zwane', 'Mokoena', 'Mvala', 'Kekana', 'Modiba', 'Ndlovu', 'Williams', 'Mudau', 'Sithole', 'Dlamini', 'Maseko', 'Nkosi', 'Morena', 'Shalulile', 'Coetzee', 'Allende'];
  const NAME_G = { NZL: [EN_F, EN_L], ING: [EN_F, EN_L], EGY: [AR_F, AR_L], TUN: [AR_F, AR_L], KSA: [AR_F, AR_L], RSA: [ZA_F, ZA_L] };
  function genName(r, nat) {
    if (NAME_G[nat]) { const [F, L] = NAME_G[nat], f = pick(F, r), l = pick(L, r); return { name: `${f} ${l}`, short: l }; }
    const es = nat && nat !== 'BRA';
    const f = pick(es ? ES_F : BR_F, r), l = pick(es ? ES_L : BR_L, r);
    let short = l;
    if (!es && r() < 0.28) short = r() < 0.5 ? f : f.replace(/o$|e$|a$/, '') + 'inho';
    return { name: `${f} ${l}`, short };
  }
  function coachName(r, nat) { const n = genName(r, nat); return n.name; }

  // ---------- disposição de jogar no Brasil (realismo nas negociações) ----------
  const LEAGUE_TIER = { 'Premier League': 5, 'LaLiga': 5, 'Serie A (ITA)': 5, 'Bundesliga': 5, 'Ligue 1': 4, 'Liga Portugal': 3.5, 'Eredivisie': 3.5,
    'Saudi Pro League': 3, 'Süper Lig': 3, 'Pro League (BEL)': 3, 'Premier Liga (RUS)': 3, 'MLS': 2.5, 'Liga MX': 2.5, 'Premier Liga (UCR)': 2.5,
    'Premiership (ESC)': 2.5, 'Super League (GRE)': 2.5, 'Bundesliga (AUT)': 2.5, 'Super League (SUI)': 2.5, 'Superliga (DIN)': 2.5,
    'Liga Argentina': 2, 'Liga Colombiana': 1.5, 'J1 League': 2, 'K League 1': 1.8, 'Brasileirão': 2.5, 'Brasileirão B': 1.5, 'Sem clube': 0 };
  // estádios reais dos clubes brasileiros: [nome, capacidade]
  const STADIUMS = {
    'Flamengo': ['Maracanã', 78838], 'Fluminense': ['Maracanã', 78838], 'Palmeiras': ['Allianz Parque', 43713], 'Corinthians': ['Neo Química Arena', 49205],
    'São Paulo': ['MorumBIS', 66795], 'Santos': ['Vila Belmiro', 16068], 'Botafogo': ['Nilton Santos', 44661], 'Vasco': ['São Januário', 21880],
    'Grêmio': ['Arena do Grêmio', 55662], 'Internacional': ['Beira-Rio', 50842], 'Cruzeiro': ['Mineirão', 61846], 'Atlético-MG': ['Arena MRV', 46000],
    'Athletico-PR': ['Ligga Arena', 42372], 'Bahia': ['Arena Fonte Nova', 47915], 'Bragantino': ['Nabi Abi Chedid', 17022], 'Vitória': ['Barradão', 30793],
    'Coritiba': ['Couto Pereira', 40502], 'Mirassol': ['Maião', 15000], 'Remo': ['Mangueirão', 53635], 'Chapecoense': ['Arena Condá', 20089],
    'Sport': ['Ilha do Retiro', 26418], 'Ceará': ['Castelão', 57876], 'Fortaleza': ['Castelão', 57876], 'Juventude': ['Alfredo Jaconi', 19924],
    'Goiás': ['Serrinha', 14450], 'Novorizontino': ['Jorge Ismael de Biasi', 16000], 'CRB': ['Rei Pelé', 17126], 'Avaí': ['Ressacada', 17826],
    'Criciúma': ['Heriberto Hülse', 19300], 'Cuiabá': ['Arena Pantanal', 44000], 'Atlético-GO': ['Antônio Accioly', 12500], 'Operário-PR': ['Germano Krüger', 10632],
    'Vila Nova': ['Onésio Brasileiro Alvarenga', 11788], 'América-MG': ['Independência', 23018], 'Ponte Preta': ['Moisés Lucarelli', 17728], 'Botafogo-SP': ['Santa Cruz', 29292],
    'Londrina': ['Estádio do Café', 31000], 'Náutico': ['Aflitos', 22856], 'Athletic': ['Joaquim Portugal', 6000], 'São Bernardo': ['Primeiro de Maio', 15159],
    'Santa Cruz': ['Arruda', 60044], 'Paysandu': ['Curuzu', 16200], 'Guarani': ['Brinco de Ouro', 29130], 'Figueirense': ['Orlando Scarpelli', 19584],
    'Ferroviária': ['Fonte Luminosa', 20000], 'Volta Redonda': ['Raulino de Oliveira', 18230], 'Caxias': ['Centenário', 22132], 'Ituano': ['Novelli Júnior', 18560],
    'Inter de Limeira': ['Limeirão', 18000], 'Confiança': ['Batistão', 15575], 'Botafogo-PB': ['Almeidão', 19000], 'Maringá': ['Willie Davids', 21000],
    'Ypiranga': ['Colosso da Lagoa', 22000], 'Floresta': ['Presidente Vargas', 20000], 'Maranhão': ['Castelão (MA)', 40000], 'Anápolis': ['Jonas Duarte', 13000],
  };
  const SOUTH_AM = ['ARG', 'URU', 'COL', 'PAR', 'CHI', 'EQU', 'PER', 'BOL', 'VEN'];

  // ---------- bandeiras (pixel) ----------
  const FLAGS = {
    BRA: ['bra'], ARG: ['h', '#74ACDF', '#FFFFFF', '#74ACDF', 'dot:#F6B40E'], URU: ['uru'], COL: ['hw', '#FCD116', '#FCD116', '#003893', '#CE1126'],
    PAR: ['h', '#D52B1E', '#FFFFFF', '#0038A8'], CHI: ['chi'], EQU: ['hw', '#FFDD00', '#FFDD00', '#034EA2', '#ED1C24'], PER: ['v', '#D91023', '#FFFFFF', '#D91023'],
    BOL: ['h', '#D52B1E', '#F9E300', '#007934'], VEN: ['h', '#FFCC00', '#00247D', '#CF142B'], POR: ['por'], ESP: ['hw', '#AA151B', '#F1BF00', '#F1BF00', '#AA151B'],
    FRA: ['v', '#0055A4', '#FFFFFF', '#EF4135'], KSA: ['h', '#006C35', '#006C35', '#006C35', 'dot:#FFFFFF'], EGY: ['h', '#CE1126', '#FFFFFF', '#000000', 'dot:#C09300'], TUN: ['circle', '#E70013', '#FFFFFF'], RSA: ['h', '#E03C31', '#007749', '#001489', 'dot:#FFB81C'], NZL: ['h', '#00247D', '#00247D', '#00247D', 'dot:#CC142B'], ALE: ['h', '#000000', '#DD0000', '#FFCE00'], ING: ['cross', '#FFFFFF', '#CE1124'], ITA: ['v', '#009246', '#FFFFFF', '#CE2B37'],
    HOL: ['h', '#AE1C28', '#FFFFFF', '#21468B'], BEL: ['v', '#000000', '#FDDA24', '#EF3340'], EUA: ['usa'], MEX: ['v', '#006847', '#FFFFFF', '#CE1126', 'dot:#8C5A2B'],
    JAP: ['circle', '#FFFFFF', '#BC002D'], COR: ['circle', '#FFFFFF', '#CD2E3A'], CRO: ['h', '#FF0000', '#FFFFFF', '#171796', 'dot:#FF0000'], SUI: ['cross', '#D52B1E', '#FFFFFF'],
    AUT: ['h', '#ED2939', '#FFFFFF', '#ED2939'], DIN: ['nordic', '#C8102E', '#FFFFFF'], SUE: ['nordic', '#006AA7', '#FECC00'], NOR: ['nordic', '#BA0C2F', '#FFFFFF', '#00205B'],
    POL: ['h2', '#FFFFFF', '#DC143C'], ESC: ['x', '#005EB8', '#FFFFFF'], GAL: ['h2', '#FFFFFF', '#00B140', 'dot:#C8102E'], IRL: ['v', '#169B62', '#FFFFFF', '#FF883E'],
    SER: ['h', '#C6363C', '#0C4076', '#FFFFFF'], TUR: ['circle', '#E30A17', '#FFFFFF'], GRE: ['stripes', '#0D5EAF', '#FFFFFF'], RUS: ['h', '#FFFFFF', '#0039A6', '#D52B1E'],
    UCR: ['h2', '#0057B7', '#FFD700'], MAR: ['circle', '#C1272D', '#006233'], SEN: ['v', '#00853F', '#FDEF42', '#E31B23'], NGA: ['v', '#008751', '#FFFFFF', '#008751'],
    CIV: ['v', '#F77F00', '#FFFFFF', '#009E60'], GAN: ['h', '#CE1126', '#FCD116', '#006B3F', 'dot:#000000'], CAM: ['v', '#007A5E', '#CE1126', '#FCD116'],
    EGI: ['h', '#CE1126', '#FFFFFF', '#000000'], ARL: ['v2', '#006233', '#FFFFFF', 'dot:#D21034'], ARA: ['h', '#006C35', '#006C35', '#006C35', 'dot:#FFFFFF'],
    AUS: ['circle', '#00008B', '#FFFFFF'], CAN: ['v', '#D80621', '#FFFFFF', '#D80621', 'dot:#D80621'], TCH: ['h2', '#FFFFFF', '#D7141A'], ROM: ['v', '#002B7F', '#FCD116', '#CE1126'],
    ANG: ['h2', '#CC092F', '#000000', 'dot:#FFCB00'], CPV: ['h', '#003893', '#FFFFFF', '#003893'], GEO: ['cross', '#FFFFFF', '#FF0000'], HUN: ['h', '#CE2939', '#FFFFFF', '#477050'],
    ESL: ['h', '#FFFFFF', '#0000FF', '#FF0000'], ESQ: ['h', '#FFFFFF', '#0B4EA2', '#EE1C25'], ISL: ['nordic', '#02529C', '#FFFFFF', '#DC1E35'], FIN: ['nordic', '#FFFFFF', '#002F6C'],
    MLI: ['v', '#14B53A', '#FCD116', '#CE1126'], GUI: ['v', '#CE1126', '#FCD116', '#009460'], JAM: ['x', '#009B3A', '#FED100'], ISR: ['h', '#FFFFFF', '#0038B8', '#FFFFFF'],
  };

  const TRAINING = {
    leve: { name: 'Leve', growth: 0.6, recover: 1.25, inj: 0.6 },
    normal: { name: 'Normal', growth: 1, recover: 1, inj: 1 },
    intenso: { name: 'Intenso', growth: 1.45, recover: 0.8, inj: 1.6 },
  };



  // treinadores brasileiros reais (assumem quando um treinador humano sai)
  const REAL_COACHES = {
    top: ['Tite', 'Dorival Júnior', 'Renato Gaúcho', 'Fernando Diniz', 'Rogério Ceni', 'Cuca', 'Filipe Luís', 'Mano Menezes', 'Luiz Felipe Scolari', 'Vanderlei Luxemburgo'],
    mid: ['Roger Machado', 'Jair Ventura', 'Thiago Carpini', 'Fábio Carille', 'Odair Hellmann', 'Maurício Barbieri', 'Zé Ricardo', 'Rafael Guanaes', 'Paulo Turra', 'Ney Franco', 'Eduardo Barroca'],
    low: ['Guto Ferreira', 'Enderson Moreira', 'Dado Cavalcanti', 'Claudinei Oliveira', 'Marquinhos Santos', 'Hélio dos Anjos', 'Umberto Louzer', 'Gilson Kleina', 'Lisca', 'Marcelo Fernandes', 'Argel Fucks', 'Jorginho'],
  };
  // ---------- lesões (duração em jogos do calendário; 1 jogo ≈ 5 dias da temporada) ----------
  // cat: mus = muscular, art = articular/ligamento, oss = óssea, cab = cabeça, con = contusão
  // inf: aceita infiltração; risk: chance base de agravar se jogar infiltrado
  const INJURIES = {
    pancada:    { n: 'Pancada no tornozelo', d: 'Contusão por choque. Dor e inchaço, sem lesão estrutural.', cat: 'con', sev: 1, min: 1, max: 2, inf: true, risk: 0.08 },
    contusao:   { n: 'Contusão na coxa', d: 'Pancada forte na coxa (tostão). Hematoma, sem ruptura.', cat: 'con', sev: 1, min: 1, max: 2, inf: true, risk: 0.08 },
    fadiga:     { n: 'Fadiga muscular', d: 'Sobrecarga por sequência de jogos. Precisa de descanso.', cat: 'mus', sev: 1, min: 1, max: 2, inf: true, risk: 0.18 },
    desconforto:{ n: 'Desconforto muscular', d: 'Dor na coxa sem lesão visível no exame. Prevenção.', cat: 'mus', sev: 1, min: 1, max: 2, inf: true, risk: 0.15 },
    entorse1:   { n: 'Entorse leve no tornozelo', d: 'Torção com estiramento ligamentar grau 1.', cat: 'art', sev: 1, min: 1, max: 3, inf: true, risk: 0.14 },
    concussao:  { n: 'Concussão', d: 'Choque de cabeça. Protocolo de concussão obrigatório.', cat: 'cab', sev: 1, min: 1, max: 2, inf: false, risk: 0 },
    posterior:  { n: 'Lesão no posterior da coxa', d: 'Estiramento muscular grau 2 nos isquiotibiais. Alta taxa de reincidência.', cat: 'mus', sev: 2, min: 4, max: 7, inf: true, risk: 0.42 },
    adutor:     { n: 'Lesão no adutor', d: 'Estiramento na virilha (adutor longo).', cat: 'mus', sev: 2, min: 3, max: 6, inf: true, risk: 0.34 },
    panturrilha:{ n: 'Lesão na panturrilha', d: 'Estiramento no gastrocnêmio/sóleo.', cat: 'mus', sev: 2, min: 3, max: 6, inf: true, risk: 0.34 },
    quadriceps: { n: 'Estiramento no quadríceps', d: 'Lesão muscular na parte da frente da coxa.', cat: 'mus', sev: 2, min: 3, max: 6, inf: true, risk: 0.32 },
    entorse:    { n: 'Entorse de tornozelo', d: 'Lesão ligamentar grau 2 no tornozelo.', cat: 'art', sev: 2, min: 2, max: 5, inf: true, risk: 0.26 },
    pubalgia:   { n: 'Pubalgia', d: 'Inflamação na região do púbis. Tende a voltar se não tratar.', cat: 'mus', sev: 2, min: 4, max: 9, inf: true, risk: 0.3 },
    ombro:      { n: 'Luxação no ombro', d: 'Ombro deslocado na queda. Imobilização e fortalecimento.', cat: 'art', sev: 2, min: 3, max: 7, inf: true, risk: 0.22 },
    colateral:  { n: 'Lesão no ligamento colateral do joelho', d: 'Entorse de joelho com lesão do LCM.', cat: 'art', sev: 2, min: 5, max: 9, inf: true, risk: 0.3 },
    menisco:    { n: 'Lesão no menisco', d: 'Precisa de artroscopia.', cat: 'art', sev: 2, min: 6, max: 12, inf: false, risk: 0 },
    face:       { n: 'Fratura no nariz', d: 'Fratura por choque. Volta com máscara de proteção.', cat: 'oss', sev: 2, min: 2, max: 4, inf: false, risk: 0 },
    tornozelo:  { n: 'Ruptura de ligamento do tornozelo', d: 'Lesão ligamentar grau 3. Cirurgia pode ser necessária.', cat: 'art', sev: 3, min: 8, max: 14, inf: false, risk: 0 },
    metatarso:  { n: 'Fratura no metatarso', d: 'Fratura por estresse no pé. Cirurgia com fixação.', cat: 'oss', sev: 3, min: 10, max: 16, inf: false, risk: 0 },
    perna:      { n: 'Fratura na perna', d: 'Fratura de tíbia/fíbula após entrada dura.', cat: 'oss', sev: 3, min: 22, max: 32, inf: false, risk: 0 },
    lca:        { n: 'Ruptura do LCA', d: 'Ligamento cruzado anterior rompido. Cirurgia e 7 a 9 meses de recuperação.', cat: 'art', sev: 3, min: 32, max: 45, inf: false, risk: 0 },
    aquiles:    { n: 'Ruptura do tendão de Aquiles', d: 'Tendão rompido. Cirurgia e longa reabilitação.', cat: 'mus', sev: 3, min: 30, max: 42, inf: false, risk: 0 },
  };
  const INJ_BY_SEV = { 1: ['pancada', 'contusao', 'fadiga', 'desconforto', 'entorse1', 'concussao'], 2: ['posterior', 'adutor', 'panturrilha', 'quadriceps', 'entorse', 'pubalgia', 'ombro', 'colateral', 'menisco', 'face'], 3: ['tornozelo', 'metatarso', 'perna', 'lca', 'aquiles'] };
  const INJ_W = { 1: [3, 2.5, 2, 3, 2.5, 0.8], 2: [3.5, 2.2, 2.2, 1.6, 2.4, 1.2, 0.7, 1, 0.8, 0.5], 3: [1.6, 1.4, 0.5, 1.4, 0.4] };
  // propensão a lesões (histórico real conhecido): >1 mais frágil, <1 mais resistente
  const FRAG = { 68290: 2.3, 77100: 1.7, 428791: 1.6, 167850: 1.5, 67920: 1.5, 114937: 1.4, 29241: 1.4, 620477: 1.4, 244275: 1.3, 248410: 1.3, 489893: 1.3,
    312294: 1.3, 103381: 1.3, 353108: 1.3, 52896: 1.2, 145707: 1.2, 79960: 1.2, 223560: 1.2, 565009: 1.2, 943837: 1.1, 102017: 1.1,
    80562: 0.6, 69400: 0.6, 22415: 0.5, 50144: 0.6, 54590: 0.8, 341705: 0.8, 364972: 0.8, 205041: 0.9 };
  function pickInjury(r, frag, last) {
    if (last && INJURIES[last] && INJURIES[last].cat === 'mus' && r() < 0.35 * Math.min(2, frag)) return last;   // reincidência
    const q = r(), p3 = 0.06 * frag, p2 = 0.3 + 0.08 * (frag - 1);
    const sev = q < p3 ? 3 : q < p3 + p2 ? 2 : 1;
    return pickW(INJ_BY_SEV[sev], INJ_W[sev], r);
  }
  return { fitI, condF, hash, rng, R, pickW, pick, clamp, r1k, fmt, fmtK, shuffle, gauss, ECON, mvFromOvr, CATS, catOf, PACK_COST, PACK_ROT, POS_NAME, SETOR_OF, FORMATIONS,
    DNA_INFO, DNA_CLUBS, dnaOf, dna2Of, DNA_MODE, DNA_PAIR, fit, SELOS, STYLES, CLUBS_A, CLUBS_REL, CLUBS_B_GEN, CLUBS_F_GEN, CLUBS_REG_GEN, SERIE_C_2026, CLUB_REGION, regionOf, KITS_KNOWN, isDerby, FAMA_INFO, INT_CLUBS, INTER, REFEREES, genName, coachName, LEAGUE_TIER, SOUTH_AM, STADIUMS, FLAGS, TRAINING, INJURIES, FRAG, pickInjury, REAL_COACHES };
})();
