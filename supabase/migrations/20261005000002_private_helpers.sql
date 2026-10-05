-- PRANCHETA · funções auxiliares de política saem do esquema exposto pela API.
-- Motivo: funções SECURITY DEFINER em `public` ficam chamáveis por /rest/v1/rpc (aviso 0029 do verificador do Supabase).
-- No esquema `private` elas continuam servindo às políticas, mas não são expostas como RPC.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated, service_role;

create function private.is_member(p_league uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.league_members m
    where m.league_id = p_league and m.user_id = (select auth.uid()) and m.removed_at is null
  );
$$;

create function private.my_desk_key(p_league uuid) returns text
language sql stable security definer set search_path = '' as $$
  select m.desk_key from public.league_members m
  where m.league_id = p_league and m.user_id = (select auth.uid()) and m.removed_at is null;
$$;

create function private.is_league_admin(p_league uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.leagues l where l.id = p_league and l.admin_user_id = (select auth.uid()));
$$;

create function private.shares_league_with(p_user uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.league_members a
    join public.league_members b on b.league_id = a.league_id
    where a.user_id = (select auth.uid()) and a.removed_at is null
      and b.user_id = p_user and b.removed_at is null
  );
$$;

revoke all on all functions in schema private from public, anon;
grant execute on all functions in schema private to authenticated, service_role;

alter policy profiles_select on public.profiles
  using (user_id = (select auth.uid()) or private.shares_league_with(user_id));
alter policy leagues_select on public.leagues
  using (private.is_member(id));
alter policy league_members_select on public.league_members
  using (private.is_member(league_id));
alter policy league_invites_select on public.league_invites
  using (private.is_league_admin(league_id));
alter policy league_worlds_select on public.league_worlds
  using (private.is_member(league_id));
alter policy league_desks_select on public.league_desks
  using (desk_key = private.my_desk_key(league_id));
alter policy commands_insert on public.commands
  with check (
    user_id = (select auth.uid())
    and status = 'pending' and result is null and error is null and processed_at is null
    and (
      (league_id is null and type in ('league.create', 'league.join'))
      or (league_id is not null and private.is_member(league_id))
    )
  );
alter policy chat_select on public.chat_messages
  using (private.is_member(league_id) and deleted_at is null);
alter policy chat_insert on public.chat_messages
  with check (user_id = (select auth.uid()) and private.is_member(league_id) and deleted_at is null);
alter policy bug_reports_insert on public.bug_reports
  with check (user_id = (select auth.uid()) and status = 'open'
              and (league_id is null or private.is_member(league_id)));

drop function public.is_member(uuid);
drop function public.my_desk_key(uuid);
drop function public.is_league_admin(uuid);
drop function public.shares_league_with(uuid);
