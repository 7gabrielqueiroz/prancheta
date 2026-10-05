-- PRANCHETA · esquema inicial
-- Princípio: o cliente nunca grava estado de jogo. Ele lê o que as políticas permitem e envia COMANDOS;
-- só o servidor (worker, com a role de serviço) executa o motor e grava mundo, mesas e resultados.
--
-- Modelo híbrido (ver docs/PHASE2.md): identidade e permissões em tabelas relacionais com RLS;
-- estado do jogo como texto JSON versionado (o motor consome esse formato; `text` e não `jsonb`
-- porque jsonb reordena chaves e o motor itera objetos na ordem de inserção).

-- ---------------------------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------------------------

create table public.profiles (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  avatar       jsonb not null default '{}'::jsonb check (pg_column_size(avatar) <= 4096),
  created_at   timestamptz not null default now()
);

create table public.leagues (
  id             uuid primary key default gen_random_uuid(),
  code           text not null unique check (code ~ '^[A-Z0-9]{6}$'),
  name           text not null check (char_length(name) between 1 and 60),
  mode           text not null default 'normal' check (mode in ('normal', 'turbo')),
  status         text not null default 'active' check (status in ('active', 'archived')),
  admin_user_id  uuid not null references auth.users (id),
  settings       jsonb not null default '{}'::jsonb,
  world_ver      bigint not null default 0,          -- espelho de league_worlds.ver: linha pequena para o cliente assinar (Realtime)
  next_tick_at   timestamptz,                         -- próximo instante em que o motor precisa rodar
  created_at     timestamptz not null default now(),
  -- operação (o cliente não lê estas colunas; ver grants)
  engine_version text,
  lease_holder   text,
  lease_until    timestamptz,
  deferred_until timestamptz,
  error_count    integer not null default 0,
  last_error     text,
  last_tick_at   timestamptz
);
create index leagues_due_idx on public.leagues (next_tick_at) where status = 'active';

create table public.league_members (
  league_id    uuid not null references public.leagues (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  role         text not null default 'coach' check (role in ('coach', 'spectator')),
  desk_key     text check (desk_key ~ '^[a-z0-9_]{3,32}$'),   -- chave da mesa em S.desks; não é segredo
  club         text,                                          -- espelho de S.desks[desk_key].club, atualizado a cada commit
  joined_at    timestamptz not null default now(),
  last_seen_at timestamptz,
  removed_at   timestamptz,
  primary key (league_id, user_id)
);
create unique index league_members_desk_idx on public.league_members (league_id, desk_key) where desk_key is not null;
create index league_members_user_idx on public.league_members (user_id) where removed_at is null;

create table public.league_invites (
  id         uuid primary key default gen_random_uuid(),
  league_id  uuid not null references public.leagues (id) on delete cascade,
  code       text not null unique check (code ~ '^[A-Z0-9]{8,16}$'),
  club       text,                                   -- vaga reservada para um clube (opcional)
  role       text not null default 'coach' check (role in ('coach', 'spectator')),
  max_uses   integer not null default 1 check (max_uses between 1 and 100),
  uses       integer not null default 0,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

-- Mundo da liga: tudo menos as mesas e os segredos. Legível por qualquer membro.
create table public.league_worlds (
  league_id  uuid primary key references public.leagues (id) on delete cascade,
  ver        bigint not null default 1,
  data       text not null,
  updated_at timestamptz not null default now()
);

-- Segredos da liga (ex.: msalt, que entra na semente das partidas). NUNCA legível pelo cliente.
create table public.league_secrets (
  league_id uuid primary key references public.leagues (id) on delete cascade,
  data      jsonb not null default '{}'::jsonb
);

-- Mesa de cada treinador (tática, negociações, finanças pessoais). Legível só pelo dono.
create table public.league_desks (
  league_id  uuid not null references public.leagues (id) on delete cascade,
  desk_key   text not null,
  ver        bigint not null default 1,
  data       text not null,
  updated_at timestamptz not null default now(),
  primary key (league_id, desk_key)
);

-- Fila de comandos: única via de escrita do cliente sobre o jogo. `id` vem do cliente (idempotência).
create table public.commands (
  id           uuid primary key default gen_random_uuid(),
  league_id    uuid references public.leagues (id) on delete cascade,   -- null só para criar liga / entrar por código
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type         text not null check (type ~ '^[a-z]+(\.[a-zA-Z]+)+$' and char_length(type) <= 60),
  payload      jsonb not null default '{}'::jsonb check (pg_column_size(payload) <= 16384),
  status       text not null default 'pending' check (status in ('pending', 'done', 'rejected', 'error')),
  result       jsonb,
  error        text,
  created_at   timestamptz not null default now(),
  processed_at timestamptz,
  check (league_id is not null or type in ('league.create', 'league.join'))
);
create index commands_pending_league_idx on public.commands (league_id, created_at) where status = 'pending';
create index commands_pending_global_idx on public.commands (created_at) where status = 'pending' and league_id is null;
create index commands_user_idx on public.commands (user_id, created_at desc);

create table public.chat_messages (
  id         bigint generated always as identity primary key,
  league_id  uuid not null references public.leagues (id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  body       text not null check (char_length(btrim(body)) between 1 and 500),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index chat_messages_league_idx on public.chat_messages (league_id, id desc);

create table public.bug_reports (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  league_id  uuid references public.leagues (id) on delete set null,
  body       text not null check (char_length(btrim(body)) between 1 and 4000),
  context    jsonb not null default '{}'::jsonb check (pg_column_size(context) <= 16384),
  status     text not null default 'open' check (status in ('open', 'seen', 'closed')),
  created_at timestamptz not null default now()
);

create table public.tick_log (
  id        bigint generated always as identity primary key,
  league_id uuid not null references public.leagues (id) on delete cascade,
  at        timestamptz not null default now(),
  holder    text,
  ms        integer,
  loops     integer,
  slots     integer,
  commands  integer,
  ok        boolean not null,
  error     text
);
create index tick_log_league_idx on public.tick_log (league_id, at desc);

-- ---------------------------------------------------------------------------------------------
-- Funções auxiliares de política (SECURITY DEFINER para não recursar no RLS de league_members)
-- ---------------------------------------------------------------------------------------------

create function public.is_member(p_league uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.league_members m
    where m.league_id = p_league and m.user_id = (select auth.uid()) and m.removed_at is null
  );
$$;

create function public.my_desk_key(p_league uuid) returns text
language sql stable security definer set search_path = '' as $$
  select m.desk_key from public.league_members m
  where m.league_id = p_league and m.user_id = (select auth.uid()) and m.removed_at is null;
$$;

create function public.is_league_admin(p_league uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.leagues l where l.id = p_league and l.admin_user_id = (select auth.uid()));
$$;

create function public.shares_league_with(p_user uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.league_members a
    join public.league_members b on b.league_id = a.league_id
    where a.user_id = (select auth.uid()) and a.removed_at is null
      and b.user_id = p_user and b.removed_at is null
  );
$$;

-- ---------------------------------------------------------------------------------------------
-- Limites de uso (gatilhos)
-- ---------------------------------------------------------------------------------------------

create function public.commands_before_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.commands c where c.user_id = new.user_id and c.status = 'pending') >= 30 then
    raise exception 'muitos comandos pendentes' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger commands_before_insert before insert on public.commands
  for each row execute function public.commands_before_insert();

create function public.commands_after_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  perform pg_notify('prancheta_commands', coalesce(new.league_id::text, ''));
  return null;
end;
$$;
create trigger commands_after_insert after insert on public.commands
  for each row execute function public.commands_after_insert();

create function public.chat_before_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.chat_messages c
      where c.user_id = new.user_id and c.created_at > now() - interval '1 minute') >= 20 then
    raise exception 'muitas mensagens em pouco tempo' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger chat_before_insert before insert on public.chat_messages
  for each row execute function public.chat_before_insert();

-- ---------------------------------------------------------------------------------------------
-- RLS: liga tudo, tira todo privilégio padrão e concede só o mínimo
-- ---------------------------------------------------------------------------------------------

alter table public.profiles       enable row level security;
alter table public.leagues        enable row level security;
alter table public.league_members enable row level security;
alter table public.league_invites enable row level security;
alter table public.league_worlds  enable row level security;
alter table public.league_secrets enable row level security;
alter table public.league_desks   enable row level security;
alter table public.commands       enable row level security;
alter table public.chat_messages  enable row level security;
alter table public.bug_reports    enable row level security;
alter table public.tick_log       enable row level security;

revoke all on all tables    in schema public from public, anon, authenticated;
revoke all on all sequences in schema public from public, anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

grant usage on schema public to authenticated;
grant execute on function public.is_member(uuid), public.my_desk_key(uuid),
                          public.is_league_admin(uuid), public.shares_league_with(uuid) to authenticated;

-- profiles: vejo o meu e o de quem divide liga comigo; edito só o meu
grant select on public.profiles to authenticated;
grant insert (user_id, display_name, avatar) on public.profiles to authenticated;
grant update (display_name, avatar) on public.profiles to authenticated;
create policy profiles_select on public.profiles for select to authenticated
  using (user_id = (select auth.uid()) or public.shares_league_with(user_id));
create policy profiles_insert on public.profiles for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy profiles_update on public.profiles for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- leagues: membros leem as colunas públicas; ninguém escreve
grant select (id, code, name, mode, status, admin_user_id, settings, world_ver, next_tick_at, created_at)
  on public.leagues to authenticated;
create policy leagues_select on public.leagues for select to authenticated
  using (public.is_member(id));

-- league_members: membros veem quem está na liga
grant select on public.league_members to authenticated;
create policy league_members_select on public.league_members for select to authenticated
  using (public.is_member(league_id));

-- league_invites: só o ADM vê
grant select on public.league_invites to authenticated;
create policy league_invites_select on public.league_invites for select to authenticated
  using (public.is_league_admin(league_id));

-- league_worlds: membros leem
grant select on public.league_worlds to authenticated;
create policy league_worlds_select on public.league_worlds for select to authenticated
  using (public.is_member(league_id));

-- league_desks: só o dono lê a própria mesa
grant select on public.league_desks to authenticated;
create policy league_desks_select on public.league_desks for select to authenticated
  using (desk_key = public.my_desk_key(league_id));

-- league_secrets, tick_log: sem grant e sem política => inacessíveis ao cliente

-- commands: insiro os meus (só as colunas de pedido) e leio os meus
grant select on public.commands to authenticated;
grant insert (id, league_id, type, payload) on public.commands to authenticated;
create policy commands_select on public.commands for select to authenticated
  using (user_id = (select auth.uid()));
create policy commands_insert on public.commands for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pending' and result is null and error is null and processed_at is null
    and (
      (league_id is null and type in ('league.create', 'league.join'))
      or (league_id is not null and public.is_member(league_id))
    )
  );

-- chat: membros leem e escrevem na própria liga
grant select on public.chat_messages to authenticated;
grant insert (league_id, body) on public.chat_messages to authenticated;
create policy chat_select on public.chat_messages for select to authenticated
  using (public.is_member(league_id) and deleted_at is null);
create policy chat_insert on public.chat_messages for insert to authenticated
  with check (user_id = (select auth.uid()) and public.is_member(league_id) and deleted_at is null);

-- bug_reports: envio e leio os meus
grant select on public.bug_reports to authenticated;
grant insert (league_id, body, context) on public.bug_reports to authenticated;
create policy bug_reports_select on public.bug_reports for select to authenticated
  using (user_id = (select auth.uid()));
create policy bug_reports_insert on public.bug_reports for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'open'
              and (league_id is null or public.is_member(league_id)));

-- ---------------------------------------------------------------------------------------------
-- Funções do servidor (worker). Sem EXECUTE para anon/authenticated.
-- ---------------------------------------------------------------------------------------------

-- Cria a liga inteira numa transação. p_desks: [{ "key", "user_id", "club", "data" }]
create function public.create_league(
  p_id uuid, p_code text, p_name text, p_mode text, p_admin uuid, p_settings jsonb,
  p_world text, p_secrets jsonb, p_desks jsonb, p_next_tick_at timestamptz, p_engine text
) returns uuid
language plpgsql set search_path = '' as $$
declare d jsonb;
begin
  insert into public.leagues (id, code, name, mode, admin_user_id, settings, world_ver, next_tick_at, engine_version)
    values (p_id, p_code, p_name, p_mode, p_admin, coalesce(p_settings, '{}'::jsonb), 1, p_next_tick_at, p_engine);
  insert into public.league_worlds (league_id, ver, data) values (p_id, 1, p_world);
  insert into public.league_secrets (league_id, data) values (p_id, coalesce(p_secrets, '{}'::jsonb));
  for d in select * from jsonb_array_elements(coalesce(p_desks, '[]'::jsonb)) loop
    insert into public.league_desks (league_id, desk_key, ver, data) values (p_id, d->>'key', 1, d->>'data');
    insert into public.league_members (league_id, user_id, role, desk_key, club)
      values (p_id, (d->>'user_id')::uuid, 'coach', d->>'key', d->>'club');
  end loop;
  return p_id;
end;
$$;

-- Grava o que mudou, tudo ou nada, com checagem otimista de versão.
-- p_world null = mundo não mudou. p_desks: [{ "key", "expect", "data" (null = apagar), "club" }]
-- p_holder não nulo = exige que o chamador ainda detenha o lease da liga.
create function public.commit_league(
  p_league uuid, p_holder text, p_expect bigint, p_world text, p_desks jsonb, p_next_tick_at timestamptz
) returns jsonb
language plpgsql set search_path = '' as $$
declare
  v_ver  bigint;
  v_cur  bigint;
  d      jsonb;
  v_out  jsonb := '{}'::jsonb;
begin
  select w.ver into v_ver from public.league_worlds w where w.league_id = p_league for update;
  if not found then return jsonb_build_object('ok', false, 'why', 'missing'); end if;

  if p_holder is not null and not exists (
    select 1 from public.leagues l where l.id = p_league and l.lease_holder = p_holder and l.lease_until > now()
  ) then
    return jsonb_build_object('ok', false, 'why', 'lease');
  end if;

  if v_ver <> p_expect then return jsonb_build_object('ok', false, 'why', 'world', 'ver', v_ver); end if;

  for d in select * from jsonb_array_elements(coalesce(p_desks, '[]'::jsonb)) loop
    v_cur := null;
    select k.ver into v_cur from public.league_desks k
      where k.league_id = p_league and k.desk_key = d->>'key' for update;
    if coalesce(v_cur, 0) <> coalesce((d->>'expect')::bigint, 0) then
      return jsonb_build_object('ok', false, 'why', 'desk', 'key', d->>'key', 'ver', coalesce(v_cur, 0));
    end if;
  end loop;

  if p_world is not null then
    update public.league_worlds set data = p_world, ver = ver + 1, updated_at = now()
      where league_id = p_league returning ver into v_ver;
  end if;

  for d in select * from jsonb_array_elements(coalesce(p_desks, '[]'::jsonb)) loop
    if d->'data' is null or jsonb_typeof(d->'data') = 'null' then
      delete from public.league_desks where league_id = p_league and desk_key = d->>'key';
    else
      insert into public.league_desks as k (league_id, desk_key, ver, data)
        values (p_league, d->>'key', 1, d->>'data')
        on conflict (league_id, desk_key) do update set data = excluded.data, ver = k.ver + 1, updated_at = now()
        returning k.ver into v_cur;
      v_out := v_out || jsonb_build_object(d->>'key', v_cur);
      update public.league_members m set club = d->>'club'
        where m.league_id = p_league and m.desk_key = d->>'key' and m.club is distinct from d->>'club';
    end if;
  end loop;

  update public.leagues set world_ver = v_ver, next_tick_at = coalesce(p_next_tick_at, next_tick_at),
         last_tick_at = now(), error_count = 0, last_error = null, deferred_until = null
    where id = p_league;

  return jsonb_build_object('ok', true, 'ver', v_ver, 'desks', v_out);
end;
$$;

-- Lease: uma execução por liga de cada vez.
create function public.acquire_league_lease(p_league uuid, p_holder text, p_seconds integer) returns boolean
language plpgsql set search_path = '' as $$
begin
  update public.leagues set lease_holder = p_holder, lease_until = now() + make_interval(secs => p_seconds)
    where id = p_league and (lease_until is null or lease_until < now() or lease_holder = p_holder);
  return found;
end;
$$;

-- Solta o lease. Com erro, a liga sai da fila por 3 minutos (não trava as outras).
create function public.release_league_lease(p_league uuid, p_holder text, p_error text default null) returns boolean
language plpgsql set search_path = '' as $$
begin
  update public.leagues set
      lease_holder = null, lease_until = null,
      error_count    = case when p_error is null then error_count else error_count + 1 end,
      last_error     = coalesce(p_error, last_error),
      deferred_until = case when p_error is null then deferred_until else now() + interval '3 minutes' end
    where id = p_league and lease_holder = p_holder;
  return found;
end;
$$;

-- Ligas com trabalho: tick vencido ou comando pendente; sem lease ativo e fora do castigo por erro.
create function public.leagues_with_work(p_limit integer) returns setof uuid
language sql stable set search_path = '' as $$
  select l.id from public.leagues l
  where l.status = 'active'
    and (l.lease_until is null or l.lease_until < now())
    and (l.deferred_until is null or l.deferred_until < now())
    and (
      l.next_tick_at <= now()
      or exists (select 1 from public.commands c where c.league_id = l.id and c.status = 'pending')
    )
  order by l.next_tick_at nulls last
  limit p_limit;
$$;

create function public.finish_command(p_id uuid, p_status text, p_result jsonb, p_error text) returns boolean
language plpgsql set search_path = '' as $$
begin
  update public.commands set status = p_status, result = p_result, error = p_error, processed_at = now()
    where id = p_id and status = 'pending';
  return found;
end;
$$;

revoke all on function
  public.create_league(uuid, text, text, text, uuid, jsonb, text, jsonb, jsonb, timestamptz, text),
  public.commit_league(uuid, text, bigint, text, jsonb, timestamptz),
  public.acquire_league_lease(uuid, text, integer),
  public.release_league_lease(uuid, text, text),
  public.leagues_with_work(integer),
  public.finish_command(uuid, text, jsonb, text),
  public.commands_before_insert(), public.commands_after_insert(), public.chat_before_insert()
from public, anon, authenticated;

grant execute on function
  public.create_league(uuid, text, text, text, uuid, jsonb, text, jsonb, jsonb, timestamptz, text),
  public.commit_league(uuid, text, bigint, text, jsonb, timestamptz),
  public.acquire_league_lease(uuid, text, integer),
  public.release_league_lease(uuid, text, text),
  public.leagues_with_work(integer),
  public.finish_command(uuid, text, jsonb, text)
to service_role;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
