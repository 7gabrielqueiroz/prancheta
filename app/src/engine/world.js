// Origem: reference/world.js (convertido na Fase 1, lógica inalterada). A partir da Fase 2 este arquivo é FONTE: edite aqui.
import { CORE } from './core.js';
let SEASON, EVENTS;
export const __bind = d => { SEASON = d.SEASON; EVENTS = d.EVENTS; };
// ===== TREINEIROS v3 · mundo: jogadores, clubes, estado =====
export const WORLD = (() => {
  const C = CORE;
  const { R, hash, pick, clamp, gauss, ECON, mvFromOvr, SETOR_OF } = C;
  const BASE_SEASON = 2026;

  // ---------- registro estático ----------
  const P = {};      // id -> {id,name,short,club0,pos,setor,age0,nat,ovr0,liga,mvE,cy,gen}
  const CL = {};     // nome -> {name,sig,pat,c,sh,so,fan,div0,nat,lvl}
  let GEN_ID = 900000000;

  const EXCLUDE = new Set([340950]); // Diogo Jota (faleceu em 2025; o dataset ainda o lista como "sem clube")
  function addReal(rows, liga) {
    for (const r of rows) {
      const [id, name, short, club, pos, setor, age, nat, ovr, lg, mvK, cy, prev] = r;
      if (P[id] || EXCLUDE.has(id)) continue;
      P[id] = { id, name, short, club0: club, pos, setor, age0: age, nat, ovr0: ovr, liga: liga || lg, mvE: mvK * 1000, cy, gen: false };
      if (prev !== undefined) P[id].prev = prev;   // clube anterior (atualização de elenco 2026): usado na migração das ligas em andamento
    }
  }
  function genKit(name) {
    const cols = ['#D0102C', '#141414', '#F4F4F4', '#1B3F9A', '#0B6B3A', '#FFD200', '#6CB4EE', '#7A1230', '#FF7A00', '#5B2A86', '#0B1F4B'];
    const h = hash(name), r = C.rng(h);
    const c1 = cols[h % cols.length]; let c2 = cols[(h >> 5) % cols.length]; if (c2 === c1) c2 = '#F4F4F4';
    const pat = ['solid', 'solid', 'vstripes', 'hoops', 'band', 'halves'][Math.floor(r() * 6)];
    return { sig: name.replace(/[^A-Za-zÀ-ú]/g, '').slice(0, 3).toUpperCase(), pat, c: [c1, c2, c1], sh: r() < 0.5 ? c2 : '#F4F4F4', so: c1, fan: 3 };
  }
  function addClub(name, kit, div0, nat, lvl) { CL[name] = { name, ...kit, div0, nat: nat || 'BRA', lvl: lvl || kit.lvl || 0 }; }
  function clubInfo(name) { return CL[name] || (CL[name] = { name, ...genKit(name), div0: 'W', nat: '' }); }

  // ---------- jogadores gerados ----------
  const SQUAD_TEMPLATE = ['GOL', 'GOL', 'GOL', 'ZAG', 'ZAG', 'ZAG', 'ZAG', 'LD', 'LD', 'LE', 'LE', 'VOL', 'VOL', 'VOL', 'MC', 'MC', 'MEI', 'MEI', 'PE', 'PE', 'PD', 'PD', 'CA', 'CA', 'CA'];
  function genPlayer(r, club, pos, ovr, age, nat, liga, fixedId, legacy) {
    const id = fixedId || GEN_ID++;
    const n = C.genName(r, nat);
    P[id] = { id, name: n.name, short: n.short, club0: legacy ? 'Aposentado' : club, pos, setor: SETOR_OF[pos], age0: age, nat, ovr0: clamp(Math.round(ovr), 40, 88), liga, mvE: 0, cy: 0, gen: true };
    if (legacy) { P[id].legacy = 1; P[id].gclub = club; }
    return id;
  }
  // legacy: elencos gerados antigos (Série B e copas regionais), hoje substituídos por elencos reais.
  // Continuam existindo (mesmos ids) só pra ligas antigas não quebrarem, mas nascem aposentados.
  function genSquad(club, lvl, nat, liga, base, legacy) {
    const r = R('squad|' + club);
    SQUAD_TEMPLATE.forEach((pos, i) => {
      const starter = [0, 3, 4, 7, 9, 11, 14, 16, 18, 20, 22].includes(i);
      const ovr = lvl + (starter ? 2 : -4) + gauss(r) * 3.2;
      const age = Math.round(clamp(18 + r() * 16, 17, 35));
      genPlayer(r, club, pos, ovr, age, nat, liga, base ? base + i : undefined, legacy);
    });
  }
  // base: jovens gerados por clube e temporada (determinístico pela semente)
  function genYouth(seed, season, club, n, x, nReal) {   // x: reposição (v219) — sem x, igual ao de sempre (ids estáveis). nReal (v232): as primeiras vagas foram de garotos reais
    const xs = x ? `|x${x}` : '';
    const r = R(`youth|${seed}|${season}|${club}${xs}`);
    const lvl = (CL[club] && CL[club].div0 === 'A') ? 50 : 46;
    const ids = [];
    for (let i = nReal || 0; i < n; i++) {
      const pos = pick(['GOL', 'ZAG', 'ZAG', 'LD', 'LE', 'VOL', 'MC', 'MEI', 'PE', 'PD', 'CA', 'CA'], r);
      const age = 16 + Math.floor(r() * 3);
      const id = genPlayer(r, club, pos, lvl + gauss(r) * 4, age, 'BRA', 'Base', 800000000 + (hash(`y|${seed}|${season}|${club}${xs}|${i}`) % 99000000));
      P[id].youth = true; P[id].bornSeason = season; P[id].ageGen = age; P[id].age0 = age - (season - BASE_SEASON);
      ids.push(id);
    }
    return ids;
  }
  // v232: base real (planilhas Sub-20/Sub-17 do Transfermarkt). Cada vaga que abre na base puxa primeiro o próximo garoto real
  // da lista do clube (Sub-20 antes do Sub-17, maior valor primeiro); acabou a lista, gera como antes. O limite (3 por temporada +
  // reposição até 5/6/7) não muda. O ponteiro da lista fica no próprio youthLog: [temporada, clube, n, x, reais, ponteiro].
  const RY = {};   // clube -> ids reais da base, na ordem de chegada
  function realPick(S, club, season, n) {
    const L = RY[club] || [], out = [];
    let ptr = 0; for (const e of S.youthLog || []) if (e[1] === club && e[5] != null && e[5] > ptr) ptr = e[5];
    while (out.length < n && ptr < L.length) {
      const id = L[ptr++]; if (!P[id]) continue;
      const a = P[id].age0 + (season - BASE_SEASON);
      if (a < 15 || a > 20 || S.own[id] !== undefined) continue;   // fora da idade de base nessa temporada (15 a 20) ou já usado: pula
      out.push(id);
    }
    return { ids: out, ptr };
  }
  function youthNew(S, season, club, n, x) {
    const { ids, ptr } = realPick(S, club, season, n);
    const gen = genYouth(S.seed, season, club, n, x, ids.length);
    S.youthLog = S.youthLog || []; S.youthLog.push([season, club, n, x || 0, ids.length, ptr]);
    return [...ids, ...gen];
  }
  // jogador real menor de idade: fica fora de qualquer evento de indisciplina (só notícia esportiva)
  const realMinor = (S, id) => !!P[id] && !P[id].gen && !(P[id].youth && !P[id].real) && age(S, id) < 18;

  // ---------- potencial determinístico ----------
  function potential(id) {
    const p = P[id], r = R('pot|' + id);
    const age = p.ageGen ?? p.age0;
    const g = age <= 17 ? 10 + r() * 16 : age <= 18 ? 8 + r() * 14 : age <= 20 ? 5 + r() * 11 : age <= 22 ? 2 + r() * 8 : age <= 24 ? r() * 5 : age <= 27 ? r() * 2 : 0;
    return Math.min(94, Math.round(p.ovr0 + g));
  }

  // ---------- inicialização dos dados ----------
  // ---------- números de camisa ----------
  // real (quando a base tiver) > preferido da posição > número livre; nunca repete no mesmo elenco
  let REAL_NUM = {};
  const NUM_PREF = { GOL: [1, 12, 23, 31, 40], LD: [2, 13, 22], ZAG: [3, 4, 14, 15, 33, 44], LE: [6, 16, 26], VOL: [5, 15, 25, 35], MC: [8, 18, 28], MEI: [10, 20, 30], ME: [11, 17], MD: [7, 17], PE: [11, 17, 27], PD: [7, 17, 27], SA: [10, 20, 29], CA: [9, 19, 21, 99] };
  function shirt(S, id) { const e = S.nums && S.nums[id], o = ownerOf(S, id); return e && e[0] === o ? e[1] : null; }
  function assignNo(S, id, club) {
    S.nums = S.nums || {};
    const taken = new Set(squad(S, club).filter(x => x !== id).map(x => shirt(S, x)).filter(n => n != null));
    const real = REAL_NUM[id];
    let n = real && real > 0 && real < 100 && !taken.has(real) ? real : null;
    if (n == null) n = (NUM_PREF[P[id].pos] || []).find(x => !taken.has(x));
    if (n == null || (P[id].youth && !real)) { const young = age(S, id) <= 20; for (let x = young ? 25 : 13; x < 100; x++) if (!taken.has(x) && x !== 24) { n = x; break; } }
    S.nums[id] = [club, n]; return n;
  }
  // divisões nacionais: A, B e C (a Série D é o resto dos clubes brasileiros, que só joga as copas regionais)
  const brClubs = S => [...(S.divA || []), ...(S.divB || []), ...(S.divC || [])];
  const divOf = (S, c) => !c ? null : S.divA && S.divA.includes(c) ? 'A' : S.divB && S.divB.includes(c) ? 'B' : S.divC && S.divC.includes(c) ? 'C' : null;
  const divList = (S, d) => (d === 'A' ? S.divA : d === 'B' ? S.divB : d === 'C' ? S.divC : null) || [];
  function numbersTick(S) {
    // v2: numeração real da base (última camisa usada no clube). Ligas antigas renumeram uma vez.
    if (S.numV !== 2 && Object.keys(REAL_NUM).length) { S.nums = {}; S.numV = 2; }
    for (const c of brClubs(S)) {
      const miss = squad(S, c).filter(id => shirt(S, id) == null);
      if (!miss.length) continue;
      miss.sort((a, b) => (REAL_NUM[b] ? 1 : 0) - (REAL_NUM[a] ? 1 : 0) || view(S, b).ovr - view(S, a).ovr);
      for (const id of miss) assignNo(S, id, c);
    }
    if (S.nums) for (const id in S.nums) if (S.nums[id][0] !== ownerOf(S, +id)) delete S.nums[id];   // saiu do clube: libera o número
  }
  // v217: liga dos clubes gerados da Intercontinental, pelo país
  const LIGA_NAT = { RSA: 'Premiership (AFS)', EGY: 'Premier League (EGI)', TUN: 'Ligue 1 (TUN)', NZL: 'A-League', KSA: 'Saudi Pro League', MEX: 'Liga MX' };
  // v217: liga do clube atual (a mais comum entre os jogadores de origem do clube). O P[id].liga é a liga de origem e não muda quando o jogador troca de clube no jogo.
  let LIGA_C = null;
  function clubLiga(club) {
    if (!club || club === 'Livre' || club === 'Aposentado') return null;
    if (!LIGA_C) { const cnt = {}; for (const k in P) { const p = P[k]; if (!p.club0 || !p.liga) continue; const c = cnt[p.club0] = cnt[p.club0] || {}; c[p.liga] = (c[p.liga] || 0) + 1; }
      LIGA_C = {}; for (const cl in cnt) LIGA_C[cl] = Object.keys(cnt[cl]).sort((a, b) => cnt[cl][b] - cnt[cl][a])[0]; }
    return LIGA_C[club] || null;
  }
  // v229: vagas do molde de 25 que cada clube real da Intercontinental preenchia com gerados na v224 (ids 710000000 + 100×índice + j) e o nível usado.
  // CONGELADO: as ligas em andamento guardam esses ids (pré-contratos, pacotes, compras). Planilha nova NUNCA pode mudar isso (v226 apagou 76 e renomeou 13 → Mercado quebrava).
  // Clube real novo na lista: acrescentar aqui com j: [] (não ganha gerado).
  const INT_GEN_FREEZE = {
    "Paris Saint-Germain": { j: [2, 8, 12, 13, 17, 24], lvl: 83 },
    "Deportivo Toluca": { j: [0, 1, 2, 6, 8, 10, 12, 13, 15, 19, 21, 24], lvl: 72 },
    "Al-Ahli Saudi": { j: [1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 19], lvl: 77 },
    "Real Madrid": { j: [2, 12, 13, 19], lvl: 79 },
    "Bayern Munich": { j: [21, 24], lvl: 80 },
    "Manchester City": { j: [24], lvl: 83 },
    "Liverpool": { j: [13, 24], lvl: 82 },
    "Barcelona": { j: [10, 13, 24], lvl: 82 },
    "Arsenal": { j: [13], lvl: 84 },
    "Inter Milan": { j: [2, 12, 13, 16, 17, 18, 19, 20, 21], lvl: 80 },
    "CD Cruz Azul": { j: [2, 6, 7, 8, 10, 13, 17, 19, 20, 21, 24], lvl: 71 },
    "Monterrey": { j: [1, 2, 6, 9, 10, 12, 13, 15, 17, 23, 24], lvl: 71 },
    "Tigres UANL": { j: [0, 1, 2, 6, 8, 9, 10, 13, 15, 17, 18, 19, 22, 23, 24], lvl: 72 },
    "Al-Hilal Saudi": { j: [1, 2, 6, 8, 10, 12, 13, 15, 17, 19, 21], lvl: 79 },
    "Al-Nassr": { j: [1, 2, 5, 6, 8, 9, 10, 12, 13, 14, 15, 16, 17, 21, 23, 24], lvl: 78 },
    // v232: os 3 que não estavam congelados (a planilha nova muda os elencos deles); valores da v230
    "Zamalek": { j: [16, 17], lvl: 53 },
    "Al-Ittihad": { j: [], lvl: 61 },
    "Al-Qadsiah Saudi": { j: [8, 13, 17], lvl: 64 },
  };
  function init(RAW) {
    NYC++;
    REAL_NUM = RAW.nums || {};
    addReal(RAW.bra, 'Brasileirão'); addReal(RAW.rel, 'Brasileirão B'); addReal(RAW.b26 || [], 'Brasileirão B'); addReal(RAW.reg26 || [], 'Regional'); addReal(RAW.arg, 'Liga Argentina');
    addReal(RAW.col, 'Liga Colombiana'); addReal(RAW.intl); addReal(RAW.young); addReal(RAW.int26 || []);   // v225: elencos reais da Intercontinental (planilha do Vini)
    addReal(RAW.tm26 || []);   // v232: planilhas por bloco (out/2026): jogadores novos, id do Transfermarkt
    for (const [id, club, liga] of RAW.mv26 || []) { const p = P[id]; if (!p || p.club0 === club) continue; p.prev2 = p.club0; p.club0 = club; p.liga = liga; }   // v232: mudou de clube (ver tmMig)
    for (const r of RAW.tm26 || []) if (P[r[0]]) P[r[0]].n26 = P[r[0]].t26 = 1;
    for (const [id] of RAW.mv26 || []) if (P[id] && P[id].prev2 !== undefined) P[id].t26 = 1;
    for (const [n, k] of Object.entries(C.CLUBS_A)) addClub(n, k, 'A', 'BRA');
    for (const [n, k] of Object.entries(C.CLUBS_REL)) addClub(n, k, 'B', 'BRA');
    for (const [n, k] of Object.entries(C.CLUBS_B_GEN)) { addClub(n, k, 'B', 'BRA', k.lvl); genSquad(n, k.lvl, 'BRA', 'Brasileirão B', undefined, !!RAW.b26); }
    const realOf = n => { let c = 0; for (const k in P) if (P[k].club0 === n && !P[k].gen) c++; return c; };
    // v232: clube sul-americano que ganhou elenco real: o gerado antigo (mesmos ids) nasce aposentado; quem comprou mantém
    for (const [n, k] of Object.entries(C.CLUBS_F_GEN)) { addClub(n, k, 'F', k.nat, k.lvl); const g0 = GEN_ID, rl = realOf(n) >= 18; genSquad(n, k.lvl, k.nat, 'Liga ' + k.nat, undefined, rl); if (rl) for (let i = g0; i < GEN_ID; i++) if (P[i]) P[i].t26 = 1; }
    const argClubs = [...new Set(RAW.arg.map(r => r[3]))], colClubs = [...new Set(RAW.col.map(r => r[3]))];
    for (const n of argClubs) addClub(n, C.KITS_KNOWN[n] || genKit(n), 'F', 'ARG');
    for (const n of colClubs) addClub(n, C.KITS_KNOWN[n] || genKit(n), 'F', 'COL');
    // clubes das copas regionais: ids fixos (700000000 + 100 × índice), não mexem na numeração dos demais gerados
    Object.entries(C.CLUBS_REG_GEN || {}).forEach(([n, k], i) => { addClub(n, k, 'R', 'BRA', k.lvl); CL[n].reg = k.reg; if (k.off) CL[n].off = 1; if (!k.add) genSquad(n, k.lvl, 'BRA', 'Regional', 700000000 + i * 100, !!RAW.reg26); });
    for (const r of RAW.base26 || []) {   // v232: garotos reais da base (fora do elenco até chegarem na base de uma liga)
      const [id, name, short, club, pos, setor, ag, nat, ovr, , mvK, hasV] = r;
      if (P[id]) continue;
      P[id] = { id, name, short, club0: club, pos, setor, age0: ag, nat, ovr0: clamp(hasV ? ovr : ovr + (CL[club] && CL[club].div0 === 'A' ? 4 : 0), 40, 88), liga: 'Base', mvE: mvK * 1000, cy: 0, gen: false, youth: true, real: 1 };
      (RY[club] = RY[club] || []).push(id);
    }
    // v209: clubes da Copa Intercontinental (ids fixos 710000000 + 100 × índice). Elenco real completado com gerados até 25.
    Object.entries(C.INT_CLUBS || {}).forEach(([n, k], i) => {
      const base = 710000000 + i * 100;
      if (!k.real) { addClub(n, k, 'W', k.nat, k.lvl); genSquad(n, k.lvl, k.nat, LIGA_NAT[k.nat] || 'Exterior', base); return; }
      if (k.wasGen) genSquad(n, k.lvl || 70, k.nat, LIGA_NAT[k.nat] || 'Exterior', base, true);   // v225: o elenco gerado antigo (mesmos ids) nasce aposentado
      const mine = Object.values(P).filter(p => p.club0 === n && !p.gen), ovs = mine.map(p => p.ovr0).sort((a, b) => a - b);
      const lc = {}; for (const p of mine) lc[p.liga] = (lc[p.liga] || 0) + 1; const liga = Object.keys(lc).sort((a, b) => lc[b] - lc[a])[0] || LIGA_NAT[k.nat] || 'Exterior';
      const lvl = ovs.length ? ovs[Math.floor(ovs.length / 2)] - 2 : 68;
      addClub(n, k, 'W', k.nat, lvl);
      const have = {}; for (const p of mine) have[p.pos] = (have[p.pos] || 0) + 1;
      const fz = INT_GEN_FREEZE[n];   // v229: lista congelada (ver acima); clube sem entrada usa o elenco atual
      const r = R('squad|' + n);
      if (!k.wasGen) SQUAD_TEMPLATE.forEach((pos, j) => {   // (clube que era gerado já usou esses ids no genSquad acima)
        const ovr = (fz ? fz.lvl : lvl) - 3 + gauss(r) * 3, age = Math.round(clamp(19 + r() * 14, 18, 34));   // (o sorteio anda igual em todo j: mantém nomes/ids da v224)
        if (fz ? !fz.j.includes(j) : have[pos] > 0) { if (!fz) have[pos]--; return; }
        genPlayer(r, n, pos, ovr, age, k.nat, liga, base + j, true);   // v223: clube real não recebe jogador inventado (legado: nasce aposentado)
      });
    });
    return { argClubs, colClubs };
  }
  // sorteio de clube pra treinador novo: primeiro a Série A; cheia, a Série B; cheia, a Série C.
  // Em B e C saem primeiro os 4 elencos mais fortes (pela força do time titular); ocupados esses, qualquer um da divisão.
  // vaga reservada pelo ADM (código de vaga): fora do sorteio/escolha por 72h
  const VAG_MS = 72 * 3600e3;
  const vagas = (S, now) => { const V = (S && S.league && S.league.vag) || {}, t = now || Date.now(), out = {}; for (const c in V) if (V[c] && t - (V[c].at || 0) < VAG_MS) out[c] = V[c]; return out; };
  const takenSet = S => new Set([...humanClubs(S), ...Object.keys(vagas(S))]);
  // vagas de treinador da liga: só conta quem está empregado (demitido/desempregado não ocupa vaga)
  const coachCount = S => humanClubs(S).filter(Boolean).length;
  // v185: Single Player (com até 4 amigos): 5 treinadores no máximo, escolha entre os 60 clubes
  const SOLO_MAX = 4;   // v186: 4 contando o dono (Vini)
  const isSolo = S => !!(S && S.league && S.league.solo);
  const leagueCap = S => isSolo(S) ? SOLO_MAX : 20 * leagueDivs(S).length;
  const leagueFull = S => { if (coachCount(S) >= leagueCap(S)) return true; return (leaguePick(S) === 'choice' ? choicePool(S) : drawPool(S)).length === 0; };
  function drawPool(S) {
    const taken = takenSet(S), ok = leagueDivs(S);
    const a = ok.includes('A') ? S.divA.filter(c => !taken.has(c)) : []; if (a.length) return a;
    const force = c => { try { return SEASON.strength(S, c); } catch (e) { return squadValue(S, c) / 1e4; } };   // nota do time titular
    for (const [k, L] of [['B', S.divB], ['C', S.divC || []]]) {
      if (!ok.includes(k)) continue;
      const free = L.filter(c => !taken.has(c)); if (!free.length) continue;
      const f = {}; for (const c of L) f[c] = force(c);
      const top4 = L.slice().sort((x, y) => f[y] - f[x]).slice(0, 4).filter(c => !taken.has(c));
      return top4.length ? top4 : free;
    }
    return [];
  }
  // divisões com treinadores (escolhidas na criação da liga; ligas antigas: A, B e C) e forma de entrada (sorteio ou escolha)
  const leagueDivs = S => { const d = S && S.league && Array.isArray(S.league.divs) ? S.league.divs.filter(x => ['A', 'B', 'C'].includes(x)) : null; return d && d.length ? d : ['A', 'B', 'C']; };
  const leaguePick = S => (S && S.league && S.league.pick === 'choice') ? 'choice' : 'draw';
  // modo escolha: todos os clubes livres das divisões abertas
  const choicePool = S => { const taken = takenSet(S), ok = leagueDivs(S); return [['A', S.divA], ['B', S.divB], ['C', S.divC || []]].filter(([k]) => ok.includes(k)).flatMap(([, L]) => L.filter(c => !taken.has(c))); };
  const BR_A0 = () => Object.keys(C.CLUBS_A);
  const BR_B0 = () => [...Object.keys(C.CLUBS_REL), ...Object.keys(C.CLUBS_B_GEN)];
  const FOREIGN = () => Object.values(CL).filter(c => c.div0 === 'F').map(c => c.name);
  const REAL_SAF = new Set(['Botafogo', 'Cruzeiro', 'Vasco', 'Bahia', 'Atlético-MG', 'Coritiba', 'Bragantino']);

  // ---------- estado dinâmico do jogador ----------
  // idade muda no aniversário: cada jogador tem um dia do ano (fixo, pelo id); o calendário do jogo vai de 25/jan (jogo 1) até dezembro
  const bdayOf = id => 1 + (hash('bday|' + id) % 365);
  const gameDoy = S => 25 + (typeof SEASON !== 'undefined' && SEASON.fdOfSlot ? SEASON.fdOfSlot(Math.min(S.slot || 0, 55)) : Math.round(Math.min(S.slot || 0, 55) * 5.8));
  function age(S, id) { const b = bdayOf(id); return P[id].age0 + (S.season - BASE_SEASON) + (gameDoy(S) >= b ? 1 : 0) - (25 >= b ? 1 : 0); }
  // idade que o jogador terá no começo da próxima temporada
  function ageNext(S, id) { return P[id].age0 + (S.season + 1 - BASE_SEASON); }
  const DEF = {};
  // v200: ficha do jogador incompleta (só alguns campos, sem ovr/forma/estatística: visto em Z9R8S2, AJ42FV, 2CYPVW em 03/10)
  // quebrava a tela do jogador (s.form.toFixed) e a escalação. Completa só os campos que faltam (ou viraram null), com o padrão
  // determinístico do jogador; o que existe não muda. Idempotente: igual no servidor e no app.
  function heal(S, id, s) {
    if (s.ovr != null && s.form != null && s.st && s.mv != null && s.sal != null && s.pot != null && s.cond != null && s.mor != null && s.xp != null) return s;
    if (!P[id]) return s;
    const d = makeDefault(S, id);
    for (const k in d) if (s[k] == null) s[k] = d[k];
    return s;
  }
  function view(S, id) { const s = S.ps[id]; return s ? heal(S, id, s) : DEF[id] || (DEF[id] = makeDefault(S, id)); }
  function ps(S, id) {
    let s = S.ps[id];
    if (s) return heal(S, id, s);
    s = S.ps[id] = DEF[id] ? JSON.parse(JSON.stringify(DEF[id])) : makeDefault(S, id);
    delete DEF[id];
    return s;
  }
  function resetCache() { for (const k in DEF) delete DEF[k]; IDX = null; }
  function makeDefault(S, id) {
    let s;
    const p = P[id];
    const mv = p.mvE ? Math.max(500, Math.round(p.mvE * ECON.mvPerEur / 500) * 500) : mvFromOvr(p.ovr0, p.age0);
    const tier = C.LEAGUE_TIER[p.liga] ?? 2;
    const wageMult = p.liga === 'Saudi Pro League' ? 2.4 : p.liga === 'Süper Lig' ? 1.6 : tier >= 5 ? 1.8 : tier >= 4 ? 1.5 : tier >= 3 ? 1.3 : 1;
    const r = R('ps|' + id);
    let ce = p.cy && p.cy >= BASE_SEASON ? p.cy : BASE_SEASON + Math.floor(r() * 4);
    if (p.youth) ce = S.season + 3;
    s = {
      ovr: p.ovr0, pot: potential(id), mv, sal: Math.max(20, Math.round(mv * ECON.salaryRate * wageMult)), ce,
      cond: 100, mor: 60 + Math.floor(r() * 16), form: 6.5, inj: 0, injT: '', sus: 0, yc: 0, away: 0, ban: 0, xp: 0,
      temper: pick(['profissional', 'profissional', 'sensível', 'temperamental', 'ambicioso'], r),
      st: { j: 0, g: 0, a: 0, rt: 0, yc: 0, rc: 0, min: 0, cs: 0, ga: 0 }, benchRun: 0,
    };
    return s;
  }
  // suspensão vale só na competição em que foi aplicada (liga, Copa do Brasil, continentais, regionais, Supercopa)
  let GRP = null;
  const GRP_OF = { A: 'L', B: 'L', C: 'L', CB: 'CB', SC: 'SC', LIB: 'INT', SUL: 'INT', CONF: 'INT', PL: 'INT', NE: 'REG', SSE: 'REG', VER: 'REG', AMI: 'AMI' };
  const grpOf = comp => GRP_OF[comp] || null;
  const setGrp = g => { GRP = g; };
  const susOf = (s, g) => { if (!s) return 0; g = g === undefined ? GRP : g; if (s.susC) { const v = Object.values(s.susC); return g ? (s.susC[g] || 0) : (v.length ? Math.max(0, ...v) : 0); } return g === 'AMI' ? 0 : (s.sus || 0); };
  const avail = (S, id) => { const s = view(S, id); return (s.inj <= 0 || (s.infil && s.infil === S.season * 100 + (S.slot || 0))) && susOf(s) <= 0 && s.away <= 0 && s.ban <= 0; };
  // Para montar a escalação, considera as datas até o próximo jogo do clube.
  const availAt = (S, id, k) => { const s = view(S, id), steps = Math.max(1, k - (S.slot || 0) + 1);
    return (s.inj <= 0 || (s.infil && s.infil === S.season * 100 + (S.slot || 0))) && susOf(s) <= 0 && s.away <= steps && s.ban <= 0; };

  // ---------- posse (quem é dono de quem) ----------
  function ownerOf(S, id) {
    if (S.own[id] !== undefined) return S.own[id];
    const p = P[id];
    if (S.tmHold && p.t26) return p.prev2 !== undefined ? (p.prev2 === 'Sem clube' ? 'Livre' : p.prev2) : p.legacy ? p.gclub : 'Aposentado';   // v240: liga em andamento só muda na virada
    return p.youth ? null : p.club0 === 'Sem clube' ? 'Livre' : p.club0;
  }
  // v240: lista fixa dos jogadores que não são da base (a base é a única coisa que entra no P depois do init).
  // Os laços que percorriam o P inteiro (que cresce com os garotos de todas as ligas no servidor) usam esta lista.
  let NY = null, NYN = -1;
  const nonYouth = () => { if (!NY || NYN !== NYC) { NY = []; for (const k in P) if (!P[k].youth) NY.push(+k); NYN = NYC; } return NY; };
  let NYC = 0;   // muda quando entra jogador que não é da base (init)
  let IDX = null, IDX_V = -1, IDX_S = null;
  function index(S) { // clube -> [ids]  (exclui base e livres)
    if (IDX && IDX_S === S && IDX_V === S.ver) return IDX;
    IDX = {};
    for (const id of nonYouth()) {
      const o = ownerOf(S, id);
      if (!o || o === 'Livre' || o === 'Aposentado') continue;
      (IDX[o] = IDX[o] || []).push(id);
    }
    const mixed = new Set();   // garotos promovidos (base com dono): mesma ordem de antes (por id)
    for (const k in S.own) { const p = P[k]; if (!p || !p.youth) continue; const o = S.own[k]; if (!o || o === 'Livre' || o === 'Aposentado') continue; (IDX[o] = IDX[o] || []).push(+k); mixed.add(o); }
    for (const o of mixed) IDX[o].sort((a, b) => a - b);
    IDX_V = S.ver; IDX_S = S;
    return IDX;
  }
  const squad = (S, club) => index(S)[club] || [];
  // contador local de cache: não é salvo (antes ia junto e fazia cada sincronização virar uma versão nova da liga)
  const touch = S => { Object.defineProperty(S, 'ver', { value: (S.ver || 0) + 1, writable: true, enumerable: false, configurable: true }); };
  // histórico de transferências do universo: [temporada, jogo, id, de, para, taxa, tipo, dia]
  function move(S, id, to, noLock, tr) {
    const from = S.own[id] !== undefined ? S.own[id] : ownerOf(S, id);
    if (from !== to && to !== 'Aposentado' && from !== 'Aposentado' && !(tr && tr.nolog)) {
      const t = (tr && tr.t) || (to === 'Livre' ? 'dispensa' : from === 'Livre' ? 'livre' : 'compra');
      S.trlog = S.trlog || [];
      S.trlog.push([S.season, S.slot || 0, id, from || '?', to, Math.round((tr && tr.fee) || 0), t, S.lastDay ?? 0, ...(tr && tr.x ? [tr.x] : [])]);
      if (S.trlog.length > 6000) S.trlog.splice(0, S.trlog.length - 6000);
      if (['compra', 'livre', 'emprestimo', 'troca'].includes(t) && typeof EVENTS !== 'undefined' && EVENTS.hwg) EVENTS.hwg(S, id, from, to, (tr && tr.fee) || 0, t);
    }
    S.own[id] = to; if (to !== 'Livre') S.free = S.free.filter(x => x !== id);
    if (!noLock && to !== 'Livre' && to !== 'Aposentado') ps(S, id).lock = S.season * 100 + (S.slot || 0) + C.ECON.lockSlots;
    else if (to === 'Livre' && S.ps[id]) delete S.ps[id].lock;
    if (S.nums) { delete S.nums[id]; if (S.divA && divOf(S, to)) assignNo(S, id, to); }
    touch(S);
  }
  // jogador livre (sem clube) pode ser contratado na hora, mesmo que tenha chegado a outro clube há pouco
  const locked = (S, id) => ownerOf(S, id) !== 'Livre' && (view(S, id).lock || 0) > S.season * 100 + (S.slot || 0);
  const lockLeft = (S, id) => Math.max(0, (view(S, id).lock || 0) - (S.season * 100 + (S.slot || 0)));
  function squadValue(S, club) { return squad(S, club).reduce((t, id) => t + view(S, id).mv, 0); }
  function payroll(S, club) {
    let t = 0; for (const id of squad(S, club)) { const v = view(S, id); t += v.loanOut && v.loanOut.share ? Math.round(v.sal * v.loanOut.share / 100) : v.sal; }
    for (const id in S.ps) { const v = S.ps[id]; if (v.loanOut && v.loanOut.from === club && v.loanOut.share && v.loanOut.share < 100) t += Math.round(v.sal * (100 - v.loanOut.share) / 100); }
    return t;
  }

  // ---------- novo jogo ----------
  // horário de Brasília fixo (UTC−3): o servidor roda em UTC e precisa virar o dia junto com os celulares
  const BRT = 3 * 3600000;
  function startOfDay(t) { return Math.floor((t - BRT) / 86400000) * 86400000 + BRT; }
  // ---------- treinadores humanos: cada um tem uma "mesa" (desk) com o que é só dele ----------
  const DESK_KEYS = ['club', 'manager', 'avatar', 'tactics', 'training', 'stars', 'dias', 'ws', 'fws', 'bets', 'talks', 'offers', 'negs', 'packs', 'packSeen', 'extraDia',
    'wageBudget', 'lastMatch', 'board', 'boardAsk', 'chatPress', 'chatPressAt', 'badges', 'unemployed', 'fin', 'gains', 'flags', 'fr', 'balGiven', 'seasonLog', 'hist', 'joined', 'press', 'teamTalk', 'cst', 'mentions', 'outOffers', 'moneyIn', 'boardGiven', 'dmSeen', 'frSeen', 'pressSt', 'pressUsed', 'pressAns', 'pressTones', 'lineups', 'ticket', 'ready', 'forceNext', 'prof', 'prepRes', 'watch', 'opr', 'pressOC', 'fans', 'job', 'plog', 'jobOffers', 'rum', 'drawSeen', 'ptrain', 'romp', 'cbSeen', 'savior', 'balFix', 'tpf', 'wIn', 'seen', 'idle', 'spect', 'balancos', 'buys', 'dnaB', 'pressAud', 'fama'];
  function bindDesks(S) {
    if (!S.desks) S.desks = {};
    if (!Object.getOwnPropertyDescriptor(S, '__me')) Object.defineProperty(S, '__me', { value: null, writable: true, enumerable: false, configurable: true });
    for (const k of DESK_KEYS) {
      const d = Object.getOwnPropertyDescriptor(S, k);
      if (d && d.get) continue;
      if (d) delete S[k];
      Object.defineProperty(S, k, { get() { const x = S.desks[S.__me]; return x ? x[k] : undefined; }, set(v) { const x = S.desks[S.__me]; if (x) x[k] = v; }, enumerable: false, configurable: true });
    }
    return S;
  }
  const deskOf = (S, club) => { if (!club || !S.desks) return null; for (const t in S.desks) if (S.desks[t].club === club && !S.desks[t].unemployed) return t; return null; };
  const isHuman = (S, club) => !!deskOf(S, club);
  const humanClubs = S => Object.values(S.desks || {}).filter(d => !d.unemployed).map(d => d.club);
  function forDesks(S, fn) { const prev = S.__me; try { for (const t of Object.keys(S.desks || {})) { S.__me = t; fn(t); } } finally { S.__me = prev; } }
  function asDesk(S, token, fn) { if (!token || !S.desks[token]) return undefined; const prev = S.__me; S.__me = token; try { return fn(); } finally { S.__me = prev; } }
  const asClub = (S, club, fn) => asDesk(S, deskOf(S, club), fn);

  function newDesk(profile) {
    return { club: null, manager: profile.name || 'Treineiro', avatar: profile.avatar || {}, joined: Date.now(),
      tactics: { formation: '4-3-3', style: profile.style || 'equilibrado', xi: [], triggers: { lead2: 'retranca', losing60: 'pressao', losing60f: '', draw75: '' }, auto: true },
      training: 'normal', stars: 20, dias: 1, ws: 0, fws: 0, bets: {}, talks: {}, offers: [], negs: {}, packs: {}, packSeen: {}, extraDia: 0,
      wageBudget: null, lastMatch: null, board: 60, badges: [], unemployed: null, fin: {}, gains: [], flags: {}, fr: null, balGiven: {}, seasonLog: { prizes: {} }, hist: [] };
  }
  // mundo sem humanos; os treinadores entram depois (addDesk)
  function newWorld(opts) {
    const { now } = opts;
    const seed = opts.seed ?? (Math.floor(now) % 1e9);
    const S = { v: 4, seed, created: now, epoch: opts.epoch ?? now, speed: opts.speed || 1, slotH: opts.slotH || [12, 18], mode: opts.mode === 'turbo' ? 'turbo' : 'normal', off: 0, season: BASE_SEASON, ver: 0,
      ps: {}, own: {}, free: [], youth: {}, retired: [], realB: 1, tm26: 1, youthLog: [], news: [], pre: [], kits: {}, coaches: {}, cash: {}, saf: {}, history: [], hist: {}, events: {}, desks: {} };
    bindDesks(S);
    const sod = startOfDay(now);
    const h = new Date(now - BRT).getUTCHours() + new Date(now - BRT).getUTCMinutes() / 60;
    const first = S.mode === 'turbo' ? 8 : S.slotH[0];
    S.seasonStart = opts.speed > 1 ? sod + 86400000 : (h < first - 0.5 ? sod : sod + 86400000);
    S.divA = BR_A0(); S.divB = BR_B0();
    for (const c of [...S.divA, ...S.divB]) {
      S.youth[c] = youthNew(S, BASE_SEASON, c, 4);
      S.cash[c] = C.r1k(squadValue(S, c) * ECON.startCashRate);
      const r = R('coach|' + seed + c);
      S.coaches[c] = { name: C.coachName(r, 'BRA'), since: BASE_SEASON };
    }
    serieCInit(S);
    return S;
  }
  function addDesk(S, token, profile, club) {
    const d = newDesk(profile); d.club = club; S.desks[token] = d;
    if (club && S.cash) d.fama = { tags: [], hist: [], cur: { s: S.season, club, m: 1, k0: S.slot || 0, cash0: S.cash[club] || 0, mk0: 0, pay0: payroll(S, club) } };   // v205: fama conta a partir da chegada
    S.coaches[club] = { name: d.manager, user: true, token, since: S.season };
    return d;
  }
  // save antigo (v3, um jogador só) -> mesa 'local'
  // ---------- migração: elencos reais na Série B e nas copas regionais (v97) ----------
  // Os jogadores gerados antigos saem de circulação (aposentados). Quem estiver no elenco de um treinador
  // fica até o fim da temporada, se veio de outro clube; os gerados do próprio clube do treinador são trocados pelos reais.
  // Jogadores dos 4 clubes que já eram reais e mudaram de clube em 2026 só se mexem se não afetarem um treinador.
  const REG_RENAME = { 'Tombense': 'Portuguesa', 'Rio Branco-ES': 'Brasiliense', 'Porto Vitória': 'Luverdense' };
  function renameDeep(o, map, depth) {
    if (!o || typeof o !== 'object' || depth > 12) return o;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) { const v = o[i]; if (typeof v === 'string' && map[v]) o[i] = map[v]; else if (v && typeof v === 'object') renameDeep(v, map, depth + 1); } return o; }
    for (const k of Object.keys(o)) {
      let v = o[k];
      if (typeof v === 'string' && map[v]) v = o[k] = map[v]; else if (v && typeof v === 'object') renameDeep(v, map, depth + 1);
      if (map[k] && !(map[k] in o)) { o[map[k]] = o[k]; delete o[k]; }
    }
    return o;
  }
  function realMig(S) {
    if (!S || S.realB >= 1 || !S.own) return;
    const legacyOn = Object.values(P).some(p => p.legacy);
    if (!legacyOn) return;
    const humans = new Set(Object.values(S.desks || {}).filter(d => d && d.club && !d.unemployed).map(d => d.club));
    // clubes regionais sem elenco no Transfermarkt: trocados por outros da mesma região
    for (const k of Object.keys(S)) if (!['desks', 'ps', 'own', 'trlog'].includes(k)) renameDeep(S[k], REG_RENAME, 0);
    for (const k in P) {
      const p = P[k], id = +k;
      if (p.legacy) {
        const o = S.own[id]; if (o === undefined || o === 'Aposentado') continue;
        if (humans.has(o) && o !== p.gclub) { const s = ps(S, id); s.retire = S.season; continue; }   // comprado por um treinador: fica até o fim da temporada
        S.own[id] = 'Aposentado';
      } else if (p.prev !== undefined && S.own[id] === undefined) {
        const was = p.prev === 'Sem clube' ? 'Livre' : p.prev, now = p.club0 === 'Sem clube' ? 'Livre' : p.club0;
        if (humans.has(was) || humans.has(now)) S.own[id] = was;   // não mexe no elenco de quem tem treinador
      }
    }
    if (S.free) S.free = S.free.filter(id => !(P[id] && P[id].legacy));
    S.realB = 1; touch(S);
  }
  // ---------- v232: atualização da base com as planilhas por bloco (out/2026) ----------
  // Liga nova nasce atualizada (tm26 = 1 no newWorld). Liga em andamento:
  // - mudança que envolve clube brasileiro (de ou pra) espera a virada da temporada (tmPin); na virada só acontece se ninguém mexeu no jogador
  //   nessa liga, nunca tira jogador de clube de treineiro, e quem ia pra clube de treineiro fica livre;
  // - exterior → exterior muda na hora (como a v228);
  // - jogador novo vai direto pro clube da IA; se o clube tem treineiro, fica livre.
  const brz = c => !!c && !!CL[c] && CL[c].nat === 'BRA';
  const asOwn = c => c === 'Sem clube' ? 'Livre' : c;
  // v240 (pedido do Vini: nada muda no meio da temporada, nem os adversários das copas): liga em andamento fica com o mundo de antes
  // (S.tmHold: ownerOf devolve o clube antigo, os gerados sul-americanos continuam jogando e os novos ainda não existem) até a virada.
  function tmMig(S) {
    if (!S || S.tm26 || !S.own) return;
    S.tm26 = 1; S.tmHold = 1; touch(S);
  }
  // virada da temporada: aplica as mudanças que estavam esperando
  function tmRoll(S) {
    let n = 0;
    if (S.tmHold) {   // v240: solta a atualização na virada
      const hum = new Set(humanClubs(S)); S.free = S.free || []; S.trlog = S.trlog || [];
      for (const k in P) {
        const p = P[k], id = +k; if (!p.t26 || S.own[id] !== undefined) continue;   // mexeram nele nessa liga: fica como está
        const was = ownerOf(S, id), now = p.youth ? null : p.club0 === 'Sem clube' ? 'Livre' : p.club0;
        if (was === now) continue;
        if (hum.has(was)) { S.own[id] = was; continue; }                               // elenco de treineiro não perde jogador
        if (hum.has(now)) { S.own[id] = 'Livre'; if (!S.free.includes(id)) S.free.push(id); n++; continue; }   // ia pra clube de treineiro: fica livre
        if (p.prev2 !== undefined && was !== 'Aposentado' && now !== 'Aposentado') { S.trlog.push([S.season, S.slot || 0, id, was, now, 0, 'real', S.lastDay ?? 0]); n++; }
        if (now === 'Livre' && !S.free.includes(id)) S.free.push(id);
      }
      if (S.trlog.length > 6000) S.trlog.splice(0, S.trlog.length - 6000);
      delete S.tmHold; touch(S);
    }
    const pin = S.tmPin; if (!pin) return n;
    for (const k of Object.keys(pin)) {
      const id = +k, was = pin[k]; delete pin[k];
      if (!P[id] || S.own[id] !== was) continue;                    // mexeram nele nessa liga
      if (was !== 'Livre' && isHuman(S, was)) continue;              // elenco de treineiro não perde jogador
      const s = S.ps[id]; if (s && (s.loan || s.loanOut)) continue;
      const now = asOwn(P[id].club0), to = now !== 'Livre' && isHuman(S, now) ? 'Livre' : now;
      if (to === was) continue;
      move(S, id, to, true, { t: 'real' }); n++;
      if (to === 'Livre' && !S.free.includes(id)) S.free.push(id);
    }
    delete S.tmPin; touch(S);
    return n;
  }
  function migrate3(S) {
    // Estados antigos deixavam 1 após o último jogo perdido. Na próxima data,
    // esse jogador já pode ser escalado; limpa ao carregar o estado da liga.
    if (S.ps) for (const id in S.ps) if (S.ps[id].away === 1) S.ps[id].away = 0;
    // Convocações criadas antes da lista guardar estrangeiros mostravam apenas
    // quem ainda estava ausente. Recupera os nomes da notícia do próprio sorteio.
    for (const call of S.selecao || []) {
      if (call.ext != null) continue;
      const note = (S.news || []).find(n => n.s === call.season && n.k === call.k && n.t === 'callup' && n.minor && /^Data FIFA: \d+ estrangeiros de clubes brasileiros convocados/.test(n.title || ''));
      if (note) call.ext = (note.ids || []).filter(id => P[id] && P[id].nat !== 'BRA').map(id => ({ id, c: ownerOf(S, id), nat: P[id].nat, ovr: view(S, id).ovr }));
    }
    if (S.v !== 3) { bindDesks(S); try { realMig(S); } catch (e) {} try { tmMig(S); } catch (e) {} return S; }
    const d = {};
    for (const k of DESK_KEYS) if (k in S) { d[k] = S[k]; delete S[k]; }
    delete S.group;
    S.desks = { local: { ...newDesk({ name: d.manager }), ...d } };
    S.epoch = S.epoch ?? S.created; S.speed = S.speed || 1; S.slotH = S.slotH || [12, 18];
    S.v = 4; bindDesks(S); S.__me = 'local'; try { realMig(S); } catch (e) {} try { tmMig(S); } catch (e) {}
    if (S.coaches[d.club]) S.coaches[d.club].token = 'local';
    return S;
  }
  // ---------- Série C (v107): os 20 clubes reais entram no sistema de divisões ----------
  // Viram clubes "nacionais" (caixa, salários, base, mercado da IA). A Série D é o resto dos clubes brasileiros.
  const C_MAX = 40;   // elenco da planilha pode vir enorme: os excedentes (piores) saem livres
  function serieCInit(S) {
    if (S.divC) return false;
    const list = (C.SERIE_C_2026 || []).filter(c => CL[c] && squad(S, c).length >= 14 && !(S.divA || []).includes(c) && !(S.divB || []).includes(c));
    if (list.length % 2) list.pop();
    S.divC = list;
    S.youthLog = S.youthLog || []; S.youth = S.youth || {}; S.cash = S.cash || {}; S.coaches = S.coaches || {};
    for (const c of list) {
      const sq = squad(S, c).slice().sort((a, b) => view(S, b).ovr - view(S, a).ovr || a - b);
      for (const id of sq.slice(C_MAX).filter(x => !(S.ps[x] && (S.ps[x].loan || S.ps[x].loanOut)))) { S.own[id] = 'Livre'; if (!S.free.includes(id)) S.free.push(id); }
      if (!S.youth[c]) S.youth[c] = youthNew(S, S.season, c, 3);
      if (S.cash[c] == null) S.cash[c] = C.r1k(squadValue(S, c) * ECON.startCashRate);
      if (!S.coaches[c]) S.coaches[c] = { name: C.coachName(R('coach|' + S.seed + c), 'BRA'), since: S.season };
    }
    touch(S);
    return true;
  }
  // Série D: clubes brasileiros fora de A, B e C (pool das copas regionais e do acesso pra C)
  function divD(S) {
    const inN = new Set(brClubs(S)), out = [];
    for (const [n, k] of Object.entries(C.CLUBS_REG_GEN || {})) if (!k.off && !inN.has(n)) out.push(n);
    for (const n of (S.divDx || [])) if (!inN.has(n) && !out.includes(n)) out.push(n);   // ex-Série A/B que caíram até a D
    return out.filter(n => squad(S, n).length >= 14);
  }
  // compatível com o modo antigo (1 jogador local)
  function newGame(opts) {
    const S = newWorld(opts);
    addDesk(S, 'local', { name: opts.manager }, opts.club);
    S.__me = 'local';
    return S;
  }
  function fitOf(S, id, slot) { const s = S.ps[id]; return C.fitI({ pos: P[id].pos, pos2: s && s.pos2 }, slot); }
  // capitão e vice: escolha do técnico humano (tactics.cap/vice); sem escolha, o líder natural (overall + idade + jogos)
  function leaderScore(S, id) { const v = view(S, id), st = (S.ps[id] && S.ps[id].stl) || {}; return v.ovr + age(S, id) * 0.6 + (st.j || 0) * 0.3; }
  function captain(S, club, among) {
    const pool = (among || squad(S, club)).filter(id => id != null && ownerOf(S, id) === club);
    if (!pool.length) return null;
    const t = deskOf(S, club), T = t && S.desks[t] && S.desks[t].tactics;
    const lead = ids => ids.slice().sort((a, b) => leaderScore(S, b) - leaderScore(S, a))[0];
    // capitão escolhido (ou, no automático, o líder natural do elenco); se ele não estiver em campo, a faixa vai pro vice
    if (T) { const c = T.cap != null ? T.cap : lead(squad(S, club).filter(id => ownerOf(S, id) === club)); if (c != null && pool.includes(c)) return c; if (T.vice != null && pool.includes(T.vice)) return T.vice; }
    return lead(pool);
  }
  // recria os jovens gerados de temporadas anteriores (P não é salvo)
  function restoreYouth(S) { for (const [season, club, n, x, nr] of S.youthLog) genYouth(S.seed, season, club, n, x, nr); try { healYouth(S); } catch (e) {} }
  // v232 (chat de bugs): garoto da base (ou já promovido) cujo lote sumiu do youthLog (YNHWXS: Paysandu e Sport, reposição perdida na sincronização).
  // A geração é determinística: acha (temporada, clube, reposição) pelo id, recria o lote e devolve a linha do registro. Lote com garotos reais (nReal) é respeitado.
  function healYouth(S) {
    const miss = new Set();
    for (const c in S.youth || {}) for (const id of S.youth[c] || []) if (!P[id]) miss.add(+id);
    for (const id in S.own || {}) if (+id >= 800000000 && +id < 900000000 && !P[id]) miss.add(+id);
    if (!miss.size) return 0;
    const clubs = new Set([...Object.keys(S.youth || {}), ...brClubs(S)]); let n = 0;
    S.youthLog = S.youthLog || [];
    for (const season of [S.season, S.season - 1, S.season + 1, BASE_SEASON]) for (const club of clubs) for (let x = 0; x <= 12 && miss.size; x++) {
      const xs = x ? `|x${x}` : '';
      for (let i = 0; i < (x ? 1 : 4); i++) {
        const id = 800000000 + (hash(`y|${S.seed}|${season}|${club}${xs}|${i}`) % 99000000);
        if (!miss.has(id)) continue;
        const have = S.youthLog.find(e => e[0] === season && e[1] === club && (x ? e[3] === x : !e[3]));
        const cnt = x ? 1 : Math.max(i + 1, 3);
        if (!have) S.youthLog.push(x ? [season, club, 1, x] : [season, club, cnt]); else if (!x && have[2] < cnt) have[2] = cnt;
        genYouth(S.seed, season, club, x ? 1 : Math.max(cnt, have && !x ? have[2] : 0), x, have ? have[4] : undefined);
        miss.delete(id); n++;
      }
    }
    return n;
  }

  return { nonYouth, healYouth, youthNew, realMinor, tmRoll, RY, clubLiga, SOLO_MAX, isSolo, vagas, coachCount, leagueCap, leagueFull, leagueDivs, leaguePick, choicePool, brClubs, divOf, divList, serieCInit, divD, drawPool, fitOf, captain, leaderScore, grpOf, setGrp, susOf, ageNext, bdayOf, shirt, numbersTick, migrate3, DESK_KEYS, bindDesks, deskOf, isHuman, humanClubs, forDesks, asDesk, asClub, newDesk, newWorld, addDesk, P, CL, init, restoreYouth, view, resetCache, locked, lockLeft, clubInfo, genYouth, potential, ps, avail, availAt, age, ownerOf, index, squad, touch, move, squadValue, payroll, newGame,
    startOfDay, BASE_SEASON, BR_A0, BR_B0, FOREIGN, REAL_SAF, genSquad };
})();
