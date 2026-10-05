-- PRANCHETA · o commit da liga passa a concluir comandos e registrar membros NA MESMA transação.
-- Sem isso, uma queda entre "gravar o estado" e "marcar o comando como feito" faria o comando ser aplicado duas vezes.
--
-- p_commands: [{ "id", "status" ('done'|'rejected'|'error'), "result", "error" }]
-- p_members:  [{ "user_id", "role", "desk_key", "club" }]  (entrada na liga / mesa nova)

drop function public.commit_league(uuid, text, bigint, text, jsonb, timestamptz);

create function public.commit_league(
  p_league uuid, p_holder text, p_expect bigint, p_world text, p_desks jsonb, p_next_tick_at timestamptz,
  p_commands jsonb default '[]'::jsonb, p_members jsonb default '[]'::jsonb
) returns jsonb
language plpgsql set search_path = '' as $$
declare
  v_ver  bigint;
  v_cur  bigint;
  v_n    integer;
  d      jsonb;
  v_out  jsonb := '{}'::jsonb;
begin
  -- 1) travas e checagens: nada é gravado antes de todas passarem
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

  -- todo comando que este commit conclui tem de estar pendente e ser desta liga
  select count(*) into v_n from (
    select 1 from public.commands c
    where c.id in (select (x->>'id')::uuid from jsonb_array_elements(coalesce(p_commands, '[]'::jsonb)) x)
      and c.league_id = p_league and c.status = 'pending'
    for update
  ) q;
  if v_n <> jsonb_array_length(coalesce(p_commands, '[]'::jsonb)) then
    return jsonb_build_object('ok', false, 'why', 'command');
  end if;

  -- 2) gravação
  if p_world is not null then
    update public.league_worlds set data = p_world, ver = ver + 1, updated_at = now()
      where league_id = p_league returning ver into v_ver;
  end if;

  for d in select * from jsonb_array_elements(coalesce(p_members, '[]'::jsonb)) loop
    insert into public.league_members as m (league_id, user_id, role, desk_key, club)
      values (p_league, (d->>'user_id')::uuid, coalesce(d->>'role', 'coach'), d->>'desk_key', d->>'club')
      on conflict (league_id, user_id) do update
        set role = excluded.role, desk_key = excluded.desk_key, club = excluded.club, removed_at = null;
  end loop;

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

  for d in select * from jsonb_array_elements(coalesce(p_commands, '[]'::jsonb)) loop
    update public.commands c set status = d->>'status', result = d->'result', error = d->>'error', processed_at = now()
      where c.id = (d->>'id')::uuid;   -- as linhas já estão travadas e conferidas acima
  end loop;

  update public.league_members m set last_seen_at = now()
    where m.league_id = p_league and m.user_id in (
      select c.user_id from public.commands c
      where c.id in (select (x->>'id')::uuid from jsonb_array_elements(coalesce(p_commands, '[]'::jsonb)) x));

  update public.leagues set world_ver = v_ver, next_tick_at = coalesce(p_next_tick_at, next_tick_at),
         last_tick_at = now(), error_count = 0, last_error = null, deferred_until = null
    where id = p_league;

  return jsonb_build_object('ok', true, 'ver', v_ver, 'desks', v_out);
end;
$$;

revoke all on function public.commit_league(uuid, text, bigint, text, jsonb, timestamptz, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.commit_league(uuid, text, bigint, text, jsonb, timestamptz, jsonb, jsonb) to service_role;
