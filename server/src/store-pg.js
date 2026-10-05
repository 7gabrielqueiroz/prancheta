// Armazenamento em Postgres (Supabase). `db` é qualquer cliente com query(sql, params) -> { rows }
// (pg.Pool em produção, PGlite nos testes). A atomicidade fica nas funções SQL create_league / commit_league.
import { randomUUID } from 'node:crypto';
import { splitState, ConflictError } from './league-state.js';
export { ConflictError };

const clubOf = (S, key) => (S.desks && S.desks[key] && S.desks[key].club) || null;
const iso = t => (t ? new Date(t).toISOString() : null);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class PgStore {
  constructor(db) { this.db = db; }

  // meta: { adminUserId, deskUsers: { [deskKey]: userId }, name?, settings?, nextTickAt?, engineVersion?, id? }
  async create(code, S, meta = {}) {
    const { w, desks, secrets } = splitState(S);
    const users = meta.deskUsers || {};
    const rows = Object.entries(desks).map(([key, data]) => {
      if (!users[key]) throw new Error('mesa sem usuário: ' + key);
      return { key, user_id: users[key], club: clubOf(S, key), data };
    });
    const id = meta.id || randomUUID();
    await this.db.query(
      `select public.create_league($1::uuid, $2::text, $3::text, $4::text, $5::uuid, $6::jsonb, $7::text, $8::jsonb, $9::jsonb, $10::timestamptz, $11::text)`,
      [id, code, meta.name || code, S.mode === 'turbo' ? 'turbo' : 'normal', meta.adminUserId, JSON.stringify(meta.settings || {}),
        w, JSON.stringify(secrets), JSON.stringify(rows), iso(meta.nextTickAt), meta.engineVersion || null]);
    return id;
  }

  // ref: código da liga (6 caracteres) ou id (uuid)
  async load(ref) {
    const r = await this.db.query(
      `select l.id, l.code, l.admin_user_id, w.ver, w.data, coalesce(s.data, '{}'::jsonb) as secrets
         from public.leagues l
         join public.league_worlds w on w.league_id = l.id
         left join public.league_secrets s on s.league_id = l.id
        where ${UUID.test(ref) ? 'l.id = $1::uuid' : 'l.code = $1'}`, [ref]);
    if (!r.rows.length) return null;
    const L = r.rows[0];
    const d = await this.db.query(`select desk_key, ver, data from public.league_desks where league_id = $1`, [L.id]);
    const desks = {}; for (const row of d.rows) desks[row.desk_key] = { ver: Number(row.ver), str: row.data };
    return { id: L.id, code: L.code, adminUserId: L.admin_user_id, ver: Number(L.ver), w: L.data, secrets: L.secrets, desks };
  }

  // opts: { holder? (exige lease), nextTickAt?, commands?: [{ id, status, result, error }], members?: [{ user_id, role, desk_key, club }] }
  // Tudo ou nada: estado, conclusão dos comandos e membros novos entram na mesma transação.
  async commit(ref, base, S, opts = {}) {
    const now = splitState(S);
    if (JSON.stringify(now.secrets) !== JSON.stringify(base.secrets || {})) throw new Error('segredos da liga não podem mudar num commit');
    const world = now.w !== base.w ? now.w : null;
    const desks = [];
    for (const [key, data] of Object.entries(now.desks)) {
      const b = base.desks[key];
      if (!b || b.str !== data) desks.push({ key, expect: b ? b.ver : 0, data, club: clubOf(S, key) });
    }
    for (const key of Object.keys(base.desks)) if (!(key in now.desks)) desks.push({ key, expect: base.desks[key].ver, data: null });
    const commands = opts.commands || [], members = opts.members || [];
    const r = await this.db.query(
      `select public.commit_league($1::uuid, $2::text, $3::bigint, $4::text, $5::jsonb, $6::timestamptz, $7::jsonb, $8::jsonb) as r`,
      [base.id, opts.holder || null, base.ver, world, JSON.stringify(desks), iso(opts.nextTickAt), JSON.stringify(commands), JSON.stringify(members)]);
    const out = r.rows[0].r;
    if (!out.ok) throw new ConflictError(out.why, out.key);
    return { ok: true, changed: !!world || desks.length > 0 || commands.length > 0 || members.length > 0, ver: Number(out.ver) };
  }
}
