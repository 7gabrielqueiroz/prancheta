// Processo do worker em produção. Uso: DATABASE_URL=... node src/main.js   (ver .env.example)
// Conecta direto no Postgres do Supabase (conexão de servidor: ignora RLS; nunca vai para o cliente).
import fs from 'node:fs';
import pg from 'pg';
import { WORLD } from '../../app/src/engine/index.js';
import { PgStore } from './store-pg.js';
import { createWorker } from './worker.js';

const url = process.env.DATABASE_URL;
if (!url) { console.error('Defina DATABASE_URL (string de conexão do Postgres do Supabase).'); process.exit(1); }
const intervalMs = Number(process.env.WORKER_INTERVAL_MS || 5000);

WORLD.init(JSON.parse(fs.readFileSync(new URL('../../app/public/data/players.json', import.meta.url), 'utf8')));

const pool = new pg.Pool({ connectionString: url, max: 4, ssl: { rejectUnauthorized: false } });
pool.on('error', e => console.error('[pg]', e.message));
const worker = createWorker({ db: pool, store: new PgStore(pool), log: (...a) => console.error('[worker]', ...a) });
console.log(`[worker] ${worker.holder} no ar; volta a cada ${intervalMs} ms`);

let stop = false, wake = null;
const sleep = ms => new Promise(r => { const t = setTimeout(r, ms); wake = () => { clearTimeout(t); r(); }; });

// Acorda na hora quando chega comando (LISTEN não funciona pelo pooler em modo transação; aí vale só o intervalo).
try {
  const lc = await pool.connect();
  lc.on('notification', () => wake && wake());
  lc.on('error', () => {});
  await lc.query('listen prancheta_commands');
} catch (e) { console.error('[worker] sem LISTEN, usando só o intervalo:', e.message); }

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { stop = true; wake && wake(); });

while (!stop) {
  try {
    const r = await worker.runOnce();
    const bad = r.leagues.filter(l => l.ok === false);
    if (r.global.length || r.leagues.some(l => l.changed) || bad.length)
      console.log(`[worker] comandos globais ${r.global.length} · ligas ${r.leagues.length} · com erro ${bad.length}`, bad.length ? JSON.stringify(bad) : '');
  } catch (e) { console.error('[worker] volta falhou:', e.message); }
  if (!stop) await sleep(intervalMs);
}
await pool.end();
console.log('[worker] encerrado');
