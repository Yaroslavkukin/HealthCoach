create table if not exists public.ai_chat_rate_limits (
  user_id uuid not null references auth.users(id) on delete cascade,
  window_name text not null check (window_name in ('hour', 'day')),
  window_start timestamptz not null,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, window_name, window_start)
);

create index if not exists ai_chat_rate_limits_updated_at_idx
  on public.ai_chat_rate_limits (updated_at desc);

alter table public.ai_chat_rate_limits enable row level security;

create or replace function public.consume_ai_chat_quota(
  p_user_id uuid,
  p_hour_start timestamptz,
  p_day_start timestamptz,
  p_hourly_limit integer,
  p_daily_limit integer
)
returns table(
  allowed boolean,
  reason text,
  hourly_count integer,
  daily_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hour_count integer;
  v_day_count integer;
begin
  if p_user_id is null or p_hourly_limit <= 0 or p_daily_limit <= 0 then
    return query select false, 'invalid_limits'::text, 0, 0;
    return;
  end if;

  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  select request_count
    into v_hour_count
    from public.ai_chat_rate_limits
    where user_id = p_user_id
      and window_name = 'hour'
      and window_start = p_hour_start
    for update;

  select request_count
    into v_day_count
    from public.ai_chat_rate_limits
    where user_id = p_user_id
      and window_name = 'day'
      and window_start = p_day_start
    for update;

  v_hour_count := coalesce(v_hour_count, 0);
  v_day_count := coalesce(v_day_count, 0);

  if v_hour_count >= p_hourly_limit then
    return query select false, 'hour'::text, v_hour_count, v_day_count;
    return;
  end if;

  if v_day_count >= p_daily_limit then
    return query select false, 'day'::text, v_hour_count, v_day_count;
    return;
  end if;

  insert into public.ai_chat_rate_limits (user_id, window_name, window_start, request_count)
  values (p_user_id, 'hour', p_hour_start, 1)
  on conflict (user_id, window_name, window_start)
  do update set
    request_count = public.ai_chat_rate_limits.request_count + 1,
    updated_at = now()
  returning request_count into v_hour_count;

  insert into public.ai_chat_rate_limits (user_id, window_name, window_start, request_count)
  values (p_user_id, 'day', p_day_start, 1)
  on conflict (user_id, window_name, window_start)
  do update set
    request_count = public.ai_chat_rate_limits.request_count + 1,
    updated_at = now()
  returning request_count into v_day_count;

  return query select true, null::text, v_hour_count, v_day_count;
end;
$$;

revoke all on function public.consume_ai_chat_quota(uuid, timestamptz, timestamptz, integer, integer) from public;
revoke all on function public.consume_ai_chat_quota(uuid, timestamptz, timestamptz, integer, integer) from anon;
revoke all on function public.consume_ai_chat_quota(uuid, timestamptz, timestamptz, integer, integer) from authenticated;
grant execute on function public.consume_ai_chat_quota(uuid, timestamptz, timestamptz, integer, integer) to service_role;
