do $$
begin
  if not exists (
    select 1
      from pg_type t
      join pg_namespace n on n.oid = t.typnamespace
     where n.nspname = 'public'
       and t.typname = 'subscription_plan'
  ) then
    create type public.subscription_plan as enum ('monthly', 'six_months');
  end if;
end $$;

do $$
declare
  existing_labels text[];
  target_labels text[] := array['pending', 'active', 'past_due', 'canceled', 'expired', 'refunded'];
  legacy_type_name text;
begin
  select array_agg(e.enumlabel order by e.enumsortorder)
    into existing_labels
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    join pg_enum e on e.enumtypid = t.oid
   where n.nspname = 'public'
     and t.typname = 'subscription_status'
   group by t.oid;

  if existing_labels is null then
    create type public.subscription_status as enum ('pending', 'active', 'past_due', 'canceled', 'expired', 'refunded');
  elsif existing_labels <> target_labels then
    if exists (
      select 1
        from information_schema.columns
       where table_schema = 'public'
         and table_name = 'subscriptions'
         and column_name = 'status'
         and udt_name = 'subscription_status'
    ) then
      alter table public.subscriptions alter column status drop default;
      alter table public.subscriptions alter column status type text using status::text;
    end if;

    legacy_type_name := 'subscription_status_legacy_' || to_char(clock_timestamp(), 'YYYYMMDDHH24MISSMS');
    execute format('alter type public.subscription_status rename to %I', legacy_type_name);
    create type public.subscription_status as enum ('pending', 'active', 'past_due', 'canceled', 'expired', 'refunded');

    if exists (
      select 1
        from information_schema.columns
       where table_schema = 'public'
         and table_name = 'subscriptions'
         and column_name = 'status'
         and data_type = 'text'
    ) then
      alter table public.subscriptions
        alter column status type public.subscription_status
        using (
          case
            when status in ('active', 'past_due', 'canceled', 'expired', 'refunded') then status
            else 'pending'
          end
        )::public.subscription_status;
    end if;
  end if;
end $$;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan public.subscription_plan not null,
  status public.subscription_status not null default 'pending',
  source text not null default 'web',
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  provider_payment_method_id text,
  amount_rub integer not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions
  add column if not exists plan public.subscription_plan,
  add column if not exists source text,
  add column if not exists provider_customer_id text,
  add column if not exists provider_payment_method_id text,
  add column if not exists amount_rub integer,
  add column if not exists cancel_at_period_end boolean;

do $$
begin
  if exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'subscriptions'
       and column_name = 'plan_id'
  ) and exists (
    select 1
      from information_schema.tables
     where table_schema = 'public'
       and table_name = 'subscription_plans'
  ) then
    update public.subscriptions s
       set plan = case
         when sp.code::text = 'six_month_15000_rub' then 'six_months'::public.subscription_plan
         else 'monthly'::public.subscription_plan
       end
      from public.subscription_plans sp
     where s.plan_id = sp.id
       and s.plan is null;
  end if;
end $$;

update public.subscriptions
   set plan = 'monthly'::public.subscription_plan
 where plan is null;

update public.subscriptions
   set source = 'web'
 where source is null;

update public.subscriptions
   set amount_rub = case
     when plan = 'six_months'::public.subscription_plan then 15000
     else 3000
   end
 where amount_rub is null;

update public.subscriptions
   set cancel_at_period_end = false
 where cancel_at_period_end is null;

alter table public.subscriptions
  alter column plan set not null,
  alter column status set default 'pending',
  alter column source set default 'web',
  alter column source set not null,
  alter column amount_rub set not null,
  alter column cancel_at_period_end set default false,
  alter column cancel_at_period_end set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

alter table public.subscriptions
  drop constraint if exists subscriptions_user_id_fkey;

alter table public.subscriptions
  add constraint subscriptions_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.subscriptions
  drop column if exists plan_id,
  drop column if exists auto_renew,
  drop column if exists canceled_at;

create table if not exists public.entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  product text not null default 'healthcoach_premium',
  active boolean not null default false,
  active_until timestamptz,
  source text not null default 'web',
  reason text,
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  event_type text not null,
  user_id uuid references auth.users(id) on delete set null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  raw_payload jsonb not null,
  processed_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create table if not exists public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null,
  provider_customer_id text,
  provider_payment_method_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
alter table public.entitlements enable row level security;
alter table public.payment_events enable row level security;
alter table public.billing_customers enable row level security;

drop policy if exists "Users can manage own rows" on public.subscriptions;
drop policy if exists "Authenticated users can read own subscriptions" on public.subscriptions;
drop policy if exists "Authenticated users can read own entitlement" on public.entitlements;
drop policy if exists "Authenticated users can read own billing customer" on public.billing_customers;

create policy "Authenticated users can read own subscriptions"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Authenticated users can read own entitlement"
  on public.entitlements
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Authenticated users can read own billing customer"
  on public.billing_customers
  for select
  to authenticated
  using (auth.uid() = user_id);

create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);

create index if not exists subscriptions_status_idx
  on public.subscriptions (status);

create index if not exists subscriptions_provider_subscription_id_idx
  on public.subscriptions (provider, provider_subscription_id);

create index if not exists entitlements_active_until_idx
  on public.entitlements (active_until);

create index if not exists payment_events_provider_event_id_idx
  on public.payment_events (provider, provider_event_id);
