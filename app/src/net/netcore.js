// Gerado por tools/convert-ui.mjs a partir de reference/netcore.js. Lógica inalterada.
import { WORLD, SEASON, EVENTS } from '../engine/index.js';
export const NETCORE = (() => {
  // ---------- codificação: gzip + base64 ----------
  function b64(u8) { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); }
  function unb64(str) { const bin = atob(str), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); return u8; }
  async function enc(str) {
    if (typeof CompressionStream === 'function') {
      try { const cs = new Blob([str]).stream().pipeThrough(new CompressionStream('gzip')); return { z: 'gz', d: b64(new Uint8Array(await new Response(cs).arrayBuffer())) }; } catch (e) {}
    }
    return { z: 'raw', d: str };
  }
  async function dec(z, d) {
    if (z === 'gz') { const ds = new Blob([unb64(d)]).stream().pipeThrough(new DecompressionStream('gzip')); return await new Response(ds).text(); }
    return d;
  }

  // ---------- igualdade, merge de 3 vias, diff/patch ----------
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  function eq(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (Array.isArray(a)) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (!eq(a[i], b[i])) return false; return true; }
    const ka = Object.keys(a), kb = Object.keys(b); if (ka.length !== kb.length) return false;
    for (const k of ka) if (!(k in b) || !eq(a[k], b[k])) return false; return true;
  }
  const keyOf = v => v && typeof v === 'object' ? (v.id != null ? 'i' + v.id : v.k != null ? 'k' + v.k : JSON.stringify(v)) : JSON.stringify(v);
  // v194: contadores de dinheiro/moedas: se os dois lados mudaram, soma as duas mudanças (antes valia só a minha e a do servidor sumia)
  const ADD = /^(cash\.[^.]+|(desks\.[^.]+\.)?(stars|dias|wIn|fin\.(?!cash0$)[^.]+))$/;
  function merge3(b, m, t, p = '') {
    if (eq(m, b)) return t;
    if (eq(t, b)) return m;
    if (typeof m === 'number' && typeof t === 'number' && typeof b === 'number' && ADD.test(p)) return Math.round((m + t - b) * 100) / 100;
    if (isObj(m) && isObj(t)) {
      const bb = isObj(b) ? b : {}, out = {};
      for (const k of new Set([...Object.keys(m), ...Object.keys(t)])) {
        const inM = k in m, inT = k in t, inB = k in bb;
        if (!inM && inB) { if (inT && !eq(t[k], bb[k])) out[k] = t[k]; continue; }   // eu apaguei
        if (!inT && inB) { if (inM && !eq(m[k], bb[k])) out[k] = m[k]; continue; }   // eles apagaram
        out[k] = !inM ? t[k] : !inT ? m[k] : merge3(bb[k], m[k], t[k], p ? p + '.' + k : k);
      }
      return out;
    }
    if (Array.isArray(m) && Array.isArray(t)) {  // conjunto: aplica o que eu tirei/pus sobre a versão deles
      const bArr = Array.isArray(b) ? b : [], bk = new Set(bArr.map(keyOf)), mk = new Set(m.map(keyOf));
      const removed = new Set(bArr.filter(x => !mk.has(keyOf(x))).map(keyOf));
      const added = m.filter(x => !bk.has(keyOf(x)));
      let out = t.filter(x => !removed.has(keyOf(x)));
      const tk = new Set(out.map(keyOf)), add = added.filter(x => !tk.has(keyOf(x)));
      const front = add.length && m.length && keyOf(m[0]) === keyOf(add[0]);
      out = front ? [...add, ...out] : [...out, ...add];
      return out;
    }
    return m;
  }
  // patch pequeno: {s: {chave: valor}, d: [chaves apagadas], o: {chave: sub-patch}} ou {v: valor inteiro}
  function diff(a, b) {
    if (eq(a, b)) return null;
    if (!isObj(a) || !isObj(b)) return { v: b };
    const p = {};
    for (const k of Object.keys(b)) {
      if (!(k in a)) (p.s || (p.s = {}))[k] = b[k];
      else if (!eq(a[k], b[k])) { if (isObj(a[k]) && isObj(b[k])) (p.o || (p.o = {}))[k] = diff(a[k], b[k]); else (p.s || (p.s = {}))[k] = b[k]; }
    }
    for (const k of Object.keys(a)) if (!(k in b)) (p.d || (p.d = [])).push(k);
    return p;
  }
  function patch(a, p) {
    if (!p) return a;
    if ('v' in p) return p.v;
    const out = isObj(a) ? { ...a } : {};
    if (p.d) for (const k of p.d) delete out[k];
    if (p.s) for (const k in p.s) out[k] = p.s[k];
    // v202: diferença por dentro de algo que eu não tenho = minha base não é a do servidor. Antes criava um objeto só com os campos
    // mudados (ficha de jogador pela metade). Agora falha e quem chamou baixa o mundo inteiro.
    if (p.o) for (const k in p.o) { if (!isObj(out[k])) throw new Error('patch base'); out[k] = patch(out[k], p.o[k]); }
    return out;
  }

  // ---------- mundo x mesas ----------
  // o mundo é salvo sem as mesas; cada técnico tem a sua linha
  function split(S) {
    const w = {}; for (const k of Object.keys(S)) if (k !== 'desks') w[k] = S[k];
    const desks = {}; for (const t of Object.keys(S.desks || {})) desks[t] = JSON.stringify(S.desks[t]);
    return { w: JSON.stringify(w), desks };
  }
  function join(wStr, desks) { const S = JSON.parse(wStr); S.desks = {}; for (const t in desks) S.desks[t] = JSON.parse(desks[t]); return S; }

  // ---------- relógio: precisa processar? quando é o próximo evento? ----------
  function need(S) {
    if (!S) return false;
    if (S.divA && !S.divC && S.comp) return true;
    try { const k = S.slot; if (SEASON.CALLUPS.includes(k) && !SEASON.callDone(S, k) && S.played && S.played[k - 1]) return true; } catch (e) {}   // Data FIFA: anunciar a lista logo depois do jogo anterior
    for (const d of Object.values(S.desks || {})) if (d && d.balGiven && d.balFix !== 107 && !d.unemployed) return true;   // v107: correção do equilíbrio da liga   // v107: liga antiga ainda sem Série C (migração no servidor)
    const t = SEASON.now(S);
    if (S.slot < SEASON.SLOTS && SEASON.slotTime(S, S.slot) <= t) return true;
    if (S.slot >= SEASON.SLOTS && (!S.post || SEASON.canRoll(S))) return true;
    try { const ti = SEASON.intNextT && SEASON.intNextT(S); if (ti != null && ti <= t) return true; } catch (e) {}   // v268: hora do jogo da Intercontinental
    try { const I = S.comp && S.comp.INT; if (I && !I.one && !I.champ && I.lib && I.uefa && S.post && I.season === S.post.season && !(I.mtry && Date.now() - I.mtry < 30 * 60000)) return true; } catch (e) {}   // v276: Intercontinental do formato antigo: processa já pra virar só a final; v278: no máximo 1 tentativa a cada 30 min (nunca prende o servidor nesta liga)
    if (S.prep && S.prep.season === S.season && S.prep.fr.some((x, i) => !S.prep.done[i] && x <= t)) return true;   // fim de temporada: espera os votos de NOVA TEMPORADA
    if (SEASON.dayAbs(S, t) > (S.lastDay ?? -1)) return true;
    if (SEASON.fdAt && S.slot < SEASON.SLOTS && S.fdSeenS === S.season && Math.floor(SEASON.fdAt(S, t) + 1e-6) > (S.fdSeen ?? 1e9)) return true;   // virou o dia no calendário do jogo: jornais novos
    if (S.pending && S.pending.some(p => p.at <= t)) return true;
    try { const fd = SEASON.fdAt ? Math.floor(SEASON.fdAt(S, t) + 1e-6) : null; for (const k in S.desks || {}) { const pt = S.desks[k] && S.desks[k].ptrain; if (pt && (pt.s !== S.season || (fd != null && fd >= pt.fd1))) return true; } } catch (e) {}   // treino individual vencido
    for (const d of Object.values(S.desks || {})) if (d.fr && d.fr.invites && d.fr.invites.some(i => i.status === 'pending' && !i.human && i.at <= t)) return true;
    return false;
  }
  // próximo instante (real, em ms) em que o servidor precisa rodar
  function nextAt(S) {
    if (!S) return null;
    if (need(S)) return Date.now();
    const cand = [];
    if (S.slot < SEASON.SLOTS) cand.push(SEASON.slotTime(S, S.slot));
    const t = SEASON.now(S), d = SEASON.dayAbs(S, t);
    for (let x = t + 60000, i = 0; i < 400; i++, x += 60000 * (S.speed > 1 ? S.speed : 1)) if (SEASON.dayAbs(S, x) > d) { cand.push(x); break; }
    for (const p of S.pending || []) cand.push(p.at);
    try { const ti = SEASON.intNextT && SEASON.intNextT(S); if (ti != null) cand.push(ti); } catch (e) {}
    if (SEASON.tOfFd && S.slot < SEASON.SLOTS && S.fdSeenS === S.season && S.fdSeen != null) cand.push(SEASON.tOfFd(S, S.fdSeen + 1) + 1000);
    if (S.prep && S.prep.season === S.season) S.prep.fr.forEach((x, i) => { if (!S.prep.done[i]) cand.push(x); });
    for (const dk of Object.values(S.desks || {})) for (const i of ((dk.fr && dk.fr.invites) || [])) if (i.status === 'pending' && !i.human && i.at) cand.push(i.at);
    if (!cand.length) return Date.now() + 10 * 60000;
    const v = Math.min(...cand);
    return Math.max(Date.now(), Math.round(SEASON.toReal(S, v)));
  }

  // ---------- servidor: processa as ligas com algo pendente ----------
  const CACHE = {}; let CACHE_KEEP = 2;
  async function loadLeague(rpc, code) {
    const v = await rpc('league_versions', { p_code: code });
    if (!v) return null;
    let c = CACHE[code];
    if (!c) { c = CACHE[code] = { ver: 0, w: null, desks: {} }; const ks = Object.keys(CACHE), keep = CACHE_KEEP; if (ks.length > keep) for (const k of ks.slice(0, ks.length - keep)) delete CACHE[k]; }   // v156: guarda no máximo 2 ligas (memória do servidor)
    if (c.ver !== v.ver || !c.w) {
      const r = await rpc('league_world_get', { p_code: code, p_have: c.w ? c.ver : null });
      let got = false;
      if (r.patch && r.from === c.ver) { try { c.w = JSON.stringify(patch(JSON.parse(c.w), JSON.parse(await dec(r.z, r.patch)))); c.ver = r.ver; got = true; } catch (e) {} }
      if (!got) { const f = r.data != null ? r : await rpc('league_world_get', { p_code: code, p_have: null }); c.w = await dec(f.z, f.data); c.ver = f.ver; }
    }
    const want = Object.keys(v.desks).filter(t => !c.desks[t] || c.desks[t].ver !== v.desks[t]);
    for (const t of Object.keys(c.desks)) if (!(t in v.desks)) delete c.desks[t];
    if (want.length) for (const row of await rpc('league_desks_get', { p_code: code, p_tokens: want })) c.desks[row.token] = { ver: row.ver, str: await dec(row.z, row.data) };
    return c;
  }
  // grava só o que mudou (mundo como patch + mundo inteiro; mesas alteradas), tudo numa transação
  async function commit(rpc, code, base, S, opts = {}) {
    const now = split(S);
    let world = null, pz = null, pd = null, wz = null;
    const same = (x, y) => x === y || (x && y && eq(JSON.parse(x), JSON.parse(y)));   // mesma coisa, só a ordem das chaves mudou
    if (!same(now.w, base.w)) {
      const e = await enc(now.w); world = e.d; wz = e.z;
      const p = diff(JSON.parse(base.w), JSON.parse(now.w)); const pe = await enc(JSON.stringify(p)); pd = pe.d; pz = pe.z;
      if (pz !== wz) pd = null;
    }
    const desks = [];
    for (const t of Object.keys(now.desks)) {
      const b = base.desks[t];
      if (!b || !same(b.str, now.desks[t])) { const e = await enc(now.desks[t]); desks.push({ token: t, expect: b ? b.ver : 0, z: e.z, data: e.d }); }
    }
    for (const t of Object.keys(base.desks)) if (!(t in now.desks)) desks.push({ token: t, expect: base.desks[t].ver, data: null });
    const na = nextAt(S);
    if (!world && !desks.length && !opts.server && !opts.nextAt) return { ok: true, same: true };
    const r = await rpc('league_commit', { p_code: code, p_expect: base.ver, p_z: wz || 'gz', p_world: world, p_patch: pd, p_desks: desks,
      p_next_at: na ? new Date(na).toISOString() : null, p_by: opts.by || 'app', p_server: !!opts.server, ...(opts.sec ? { p_sec: opts.sec } : {}) });
    if (r && r.ok) {
      // v202: só mesas gravadas (mundo não foi): a base continua na versão do mundo que eu tenho. Antes ganhava a versão nova do
      // servidor com o mundo velho, e a próxima gravação do mundo apagava o que outro tinha gravado (compra que volta, ficha pela metade)
      const nb = { ver: world ? r.ver : base.ver, w: now.w, desks: {} };
      for (const t of Object.keys(now.desks)) nb.desks[t] = { ver: (r.desks && r.desks[t] != null) ? r.desks[t] : base.desks[t].ver, str: now.desks[t] };
      return { ok: true, base: nb, changed: !!world || desks.length > 0 };
    }
    return { ok: false, why: r && r.why, r };
  }
  function assemble(c) {
    const d = {}; for (const t in c.desks) d[t] = c.desks[t].str;
    const S = join(c.w, d);
    WORLD.resetCache(); WORLD.migrate3(S); WORLD.bindDesks(S); WORLD.restoreYouth(S); WORLD.touch(S);
    return S;
  }
  // v285: reparo único da YNHWXS (autorizado pelo Vini, 05/10). O Avaí comprou Zeballos e Cristaldo (rodadas 34/35) num aparelho que não via o pré-contrato
  // do Ypiranga e do Floresta: os prés sumiram. Recoloca os dois (o jogador vai na virada, como pré-contrato normal) e devolve ao Avaí os T$ 46.000 que pagou.
  // Só roda na YNHWXS, antes da virada (S.post existe), uma vez só (S.fix.yn285), e só pros jogadores que ainda estão no Avaí sem pré.
  function fixYn285(S, code) {
    if (code !== 'YNHWXS' || !S || !S.post || (S.fix && S.fix.yn285)) return null;
    const Wd = WORLD, P = Wd.P, log = { at: Date.now(), ok: [], skip: [] };
    const inClub = (c, fn) => (Wd.isHuman(S, c) ? Wd.asClub(S, c, fn) : fn());   // asClub só roda com técnico no clube
    S.pre = S.pre || [];
    const want = [['Zeballos', 'Ypiranga', 280], ['Cristaldo', 'Floresta', 140]];
    for (const [nm, club, sal] of want) {
      const ids = Wd.squad(S, 'Avaí').filter(id => P[id] && P[id].short === nm);
      if (ids.length !== 1) { log.skip.push(`${nm}: ${ids.length} no Avaí`); continue; }
      const id = ids[0];
      if (S.pre.some(x => String(x.id) === String(id))) { log.skip.push(`${nm}: já tem pré`); continue; }
      S.pre.push({ id, club, sal, years: 2, from: 'Avaí', k: S.slot || 0, d: S.lastDay ?? 0, fix: 285 });
      log.ok.push(`${nm} → ${club}`);
      inClub(club, () => EVENTS.news(S, { t: 'transfer', title: `Pré-contrato de ${P[id].short} restabelecido`, body: `Uma falha de sincronização deixou o Avaí comprar ${P[id].name} sem ver o seu pré-contrato. O pré voltou a valer (T$ ${sal}/dia por 2 temporadas): ele chega ao ${club} na virada da temporada.`, ids: [id], clubs: [club], desk: S.__me }));
    }
    if (log.ok.length === want.length) {
      S.cash['Avaí'] = (S.cash['Avaí'] || 0) + 46000;
      inClub('Avaí', () => { if (S.fin && Wd.isHuman(S, 'Avaí')) S.fin.spent = Math.max(0, (S.fin.spent || 0) - 46000); EVENTS.news(S, { t: 'fin', title: 'Avaí recebe T$ 46.000 de volta', body: 'Zeballos e Cristaldo já tinham pré-contrato assinado com Ypiranga e Floresta quando foram comprados (uma falha de sincronização escondeu isso). Os pré-contratos valem: os dois jogam pelo Avaí até o fim desta temporada e saem na virada. O valor pago foi devolvido ao caixa.', clubs: ['Avaí'], desk: S.__me }); });
      log.cash = 46000;
    }
    S.fix = S.fix || {}; S.fix.yn285 = log;
    return log;
  }
  async function tickOne(rpc, code) {
    const t0 = Date.now();
    const c = await loadLeague(rpc, code);
    if (!c) return { code, err: 'missing' };
    const S = assemble(c);
    let slots = 0, loops = 0;
    // qual versão do motor o servidor está rodando (aparece no painel do ADM)
    try { const B = typeof ENGINE_BUILD !== 'undefined' ? ENGINE_BUILD : null; if (B != null && (!S.srvB || S.srvB.b !== B)) S.srvB = { b: B, at: Date.now() }; } catch (e) {}
    try { EVENTS.dupClubFix(S); } catch (e) {}   // dois treinadores no mesmo clube: realoca o que chegou depois
    try { EVENTS.idleTick(S, Date.now()); } catch (e) {}   // inatividade: só o servidor aplica (relógio real)
    try { EVENTS.admTick(S, Date.now()); } catch (e) {}   // v221: ADM sumido passa a administração
    try { fixYn285(S, code); } catch (e) {}   // v285: reparo único da YNHWXS (antes da virada)
    const t1 = Date.now();   // v151: o tempo de carregar a liga não come o tempo de jogar (antes: banco lento = 0 jogos processados)
    while (need(S) && loops < 8 && (loops === 0 || Date.now() - t1 < 1500)) { const out = SEASON.process(S, 4); slots += (out && out.slots ? out.slots.length : 0); loops++; }
    const more = need(S);   // calculado antes de qualquer espera (ligas rodam em paralelo; o motor tem cache global)
    const base = { ver: c.ver, w: c.w, desks: {} }; for (const t in c.desks) base.desks[t] = { ver: c.desks[t].ver, str: c.desks[t].str };
    const r = await commit(rpc, code, base, S, { server: true, by: 'server', nextAt: true });
    if (r.ok && r.base) { c.ver = r.base.ver; c.w = r.base.w; c.desks = r.base.desks; }
    else if (!r.ok) delete CACHE[code];
    return { code, ok: r.ok, why: r.why, loops, slots, more, ms: Date.now() - t0 };
  }
  async function serverTick(rpc, code, opts) {
    if (!code && !(opts && opts.noBeat)) { try { await rpc('league_beat', {}); } catch (e) {} }   // v158: o worker (Railway) bate no máximo a cada 50s   // sinal de vida pra todas as ligas (os celulares não precisam processar)
    // v150: campainha de um celular só processa se a liga estiver mesmo na hora (consulta leve antes de abrir a liga)
    if (code) { try { const v = await rpc('league_ver_lite', { p_code: code }); if (v && v.next && v.next > (v.now || Date.now()) + 2000) return { at: new Date().toISOString(), due: 0, leagues: [], skip: 'not_due' }; } catch (e) {} }
    // v151: só uma rodada geral por vez (se a anterior ainda está rodando, esta só marca o sinal de vida e sai)
    const holder = Math.random().toString(36).slice(2);
    if (!code) { try { const ok = await rpc('tick_lease', { p_holder: holder, p_sec: 40 }); if (ok === false) return { at: new Date().toISOString(), due: 0, leagues: [], skip: 'busy' }; } catch (e) {} }
    const codes = code ? [code] : (await rpc('league_due', {})) || [];
    const out = [], t0 = Date.now();
    // v147: até 3 ligas ao mesmo tempo (a maior parte do tempo é espera do banco), até 40 por chamada, parando antes de ~25s
    // v165: o servidor do Railway pode processar várias ligas ao mesmo tempo (opts.par); celular e função antiga seguem uma por vez
    const par = Math.max(1, Math.min(8, (opts && opts.par) || 1)), max = (opts && opts.max) || 15;
    CACHE_KEEP = Math.max(2, (opts && opts.cacheKeep) || par + 1);   // v195: o servidor do Railway guarda mais ligas (menos download do mundo inteiro)
    const list = codes.slice(0, code ? 1 : max); let i = 0;
    // v194: liga com erro (league_defer) sai da frente da fila por 3 min
    const worker = async () => { while (i < list.length && Date.now() - t0 < 25000) { const c = list[i++]; try { out.push(await tickOne(rpc, c)); } catch (e) { delete CACHE[c]; if (!code) { try { await rpc('league_defer', { p_code: c }); } catch (x) {} } out.push({ code: c, err: String(e && e.message || e) }); } } };
    await Promise.all(Array.from({ length: par }, worker));
    // aviso externo (healthchecks.io ou similar): pinga a cada rodada; "/fail" se sobrou muita liga na fila
    try { if (!code && typeof TR_HEALTH_URL !== 'undefined' && TR_HEALTH_URL) { const left = codes.length - out.length; await fetch(TR_HEALTH_URL + (left > 25 ? '/fail' : ''), { method: 'POST', body: `ligas na fila: ${codes.length}, processadas: ${out.length}, erros: ${out.filter(x => x.err).length}` }); } } catch (e) {}
    if (!code) { try { await rpc('tick_release', { p_holder: holder }); } catch (e) {} }
    return { at: new Date().toISOString(), due: codes.length, leagues: out };
  }

  return { enc, dec, eq, merge3, diff, patch, split, join, need, nextAt, commit, loadLeague, assemble, serverTick, tickOne, fixYn285 };
})();
