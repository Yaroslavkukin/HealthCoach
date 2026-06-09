create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create type gender_type as enum ('male', 'female', 'other', 'not_specified');
create type subscription_status as enum ('active', 'past_due', 'canceled', 'expired', 'trialing');
create type subscription_plan_code as enum ('monthly_3000_rub', 'six_month_15000_rub');
create type upload_status as enum ('uploaded', 'processing', 'extracted', 'failed', 'needs_review');
create type analysis_package_code as enum ('male_foundation', 'male_advanced', 'male_complete', 'female_foundation', 'female_complete', 'custom');
create type biomarker_status as enum ('low', 'normal', 'high', 'critical_low', 'critical_high', 'unknown');
create type health_system_code as enum ('hormonal', 'thyroid', 'metabolic', 'nutritional', 'stress_recovery', 'inflammation', 'energy', 'sleep', 'digestive');
create type recommendation_category as enum ('sleep', 'nutrition', 'physical_activity', 'stress_management', 'supplement', 'bee_product', 'blood_retest', 'medical_consultation', 'lifestyle', 'mental_practice');
create type recommendation_priority as enum ('low', 'medium', 'high', 'critical');
create type recommendation_confidence as enum ('low', 'medium', 'high');
create type stack_type as enum ('essential', 'complete');
create type task_status as enum ('pending', 'completed', 'skipped', 'missed');
create type ai_message_role as enum ('user', 'assistant', 'system');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  gender gender_type default 'not_specified',
  date_of_birth date,
  age integer,
  height_cm numeric(5,2),
  weight_kg numeric(5,2),
  country text,
  city text,
  timezone text,
  language text default 'ru',
  avatar_url text,
  onboarding_completed boolean default false,
  profile_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table user_delivery_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  country text,
  region text,
  city text,
  address_line_1 text,
  address_line_2 text,
  postal_code text,
  preferred_delivery_provider text,
  cdek_pickup_point_id text,
  cdek_pickup_point_address text,
  russian_post_office_id text,
  russian_post_office_address text,
  delivery_notes text,
  is_default boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table user_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  consent_type text not null,
  consent_version text,
  accepted boolean default true,
  accepted_at timestamptz default now(),
  ip_address text,
  user_agent text
);

create table subscription_plans (
  id uuid primary key default gen_random_uuid(),
  code subscription_plan_code unique not null,
  name text not null,
  price_rub integer not null,
  duration_months integer not null,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

insert into subscription_plans (code, name, price_rub, duration_months, description)
values
('monthly_3000_rub', 'Monthly Membership', 3000, 1, 'Full access to Health Coach for one month'),
('six_month_15000_rub', '6-Month Membership', 15000, 6, 'Full access to Health Coach for six months')
on conflict (code) do nothing;

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan_id uuid references subscription_plans(id),
  status subscription_status not null default 'active',
  provider text,
  provider_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  auto_renew boolean default false,
  canceled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  subscription_id uuid references subscriptions(id),
  provider text,
  provider_payment_id text,
  amount_rub integer not null,
  currency text default 'RUB',
  status text not null,
  paid_at timestamptz,
  receipt_url text,
  created_at timestamptz default now()
);

create table user_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  goal_code text not null,
  title text not null,
  description text,
  target_value text,
  duration_days integer,
  progress_percent numeric(5,2) default 0,
  status text default 'active',
  started_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table onboarding_checklist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  blood_analysis_completed boolean default false,
  braverman_completed boolean default false,
  lifestyle_completed boolean default false,
  nutrition_completed boolean default false,
  ai_profile_generated boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table blood_test_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  package_code analysis_package_code default 'custom',
  file_url text,
  file_name text,
  status upload_status default 'uploaded',
  uploaded_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table blood_test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  upload_id uuid references blood_test_uploads(id) on delete set null,
  lab_name text,
  collected_at timestamptz,
  reported_at timestamptz,
  raw_text text,
  ai_extraction_json jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table biomarker_catalog (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  system_code health_system_code,
  default_unit text,
  description text,
  created_at timestamptz default now()
);

create table biomarker_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  blood_test_result_id uuid references blood_test_results(id) on delete cascade,
  biomarker_id uuid references biomarker_catalog(id),
  biomarker_name text not null,
  value_numeric numeric,
  value_text text,
  unit text,
  reference_range text,
  status biomarker_status default 'unknown',
  ai_interpretation text,
  created_at timestamptz default now()
);

create table braverman_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  status text default 'completed',
  completed_at timestamptz default now(),
  created_at timestamptz default now()
);

create table braverman_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  assessment_id uuid references braverman_assessments(id) on delete cascade,
  dominant_profile text,
  possible_deficiencies jsonb,
  motivation_archetype text,
  raw_scores jsonb,
  ai_summary text,
  created_at timestamptz default now()
);

create table lifestyle_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  sleep_schedule jsonb,
  activity_level text,
  stress_level integer,
  work_type text,
  symptoms jsonb,
  free_text text,
  created_at timestamptz default now()
);

create table nutrition_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  typical_day_text text,
  sugar_intake text,
  processed_food_intake text,
  water_intake text,
  ai_nutrition_notes text,
  created_at timestamptz default now()
);

create table ai_health_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  overall_health_score numeric(5,2),
  energy_score numeric(5,2),
  mood_score numeric(5,2),
  motivation_score numeric(5,2),
  productivity_score numeric(5,2),
  confidence_score numeric(5,2),
  generated_json jsonb,
  generated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table health_system_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  ai_health_profile_id uuid references ai_health_profiles(id) on delete cascade,
  system_code health_system_code not null,
  score numeric(5,2),
  status text,
  explanation text,
  created_at timestamptz default now()
);

create table ai_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  ai_health_profile_id uuid references ai_health_profiles(id) on delete cascade,
  title text,
  current_limiting_factors jsonb,
  highest_impact_actions jsonb,
  expected_effects jsonb,
  safety_note text,
  created_at timestamptz default now()
);

create table recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  ai_health_profile_id uuid references ai_health_profiles(id) on delete set null,
  category recommendation_category not null,
  priority recommendation_priority default 'medium',
  confidence recommendation_confidence default 'medium',
  title text not null,
  reason text,
  expected_benefit text,
  safety_note text,
  status text default 'active',
  generated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table supplement_recommendations (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid references recommendations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  stack_type stack_type default 'essential',
  supplement_name text not null,
  dosage text,
  timing text,
  food_instruction text,
  compatibility_notes text,
  course_duration text,
  next_intake_at timestamptz,
  created_at timestamptz default now()
);

create table bee_product_recommendations (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid references recommendations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  product_name text not null,
  priority recommendation_priority default 'medium',
  how_to_use text,
  expected_benefit text,
  allergy_warning text,
  created_at timestamptz default now()
);

create table nutrition_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  ai_health_profile_id uuid references ai_health_profiles(id) on delete set null,
  plan_type text default 'essential',
  plan_json jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table action_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  ai_health_profile_id uuid references ai_health_profiles(id) on delete set null,
  title text,
  duration_days integer default 7,
  start_date date,
  end_date date,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table daily_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  action_plan_id uuid references action_plans(id) on delete cascade,
  task_date date not null,
  category recommendation_category,
  title text not null,
  instruction text,
  scheduled_time time,
  status task_status default 'pending',
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table progress_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  review_date date default current_date,
  energy_score integer,
  mood_score integer,
  motivation_score integer,
  productivity_score integer,
  sleep_score integer,
  symptoms_json jsonb,
  free_text text,
  ai_adjustments_json jsonb,
  created_at timestamptz default now()
);

create table ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references ai_chat_sessions(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role ai_message_role not null,
  content text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text,
  notification_type text,
  scheduled_at timestamptz,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table user_delivery_profiles enable row level security;
alter table user_consents enable row level security;
alter table subscriptions enable row level security;
alter table payments enable row level security;
alter table user_goals enable row level security;
alter table onboarding_checklist enable row level security;
alter table blood_test_uploads enable row level security;
alter table blood_test_results enable row level security;
alter table biomarker_results enable row level security;
alter table braverman_assessments enable row level security;
alter table braverman_results enable row level security;
alter table lifestyle_assessments enable row level security;
alter table nutrition_assessments enable row level security;
alter table ai_health_profiles enable row level security;
alter table health_system_scores enable row level security;
alter table ai_summaries enable row level security;
alter table recommendations enable row level security;
alter table supplement_recommendations enable row level security;
alter table bee_product_recommendations enable row level security;
alter table nutrition_plans enable row level security;
alter table action_plans enable row level security;
alter table daily_tasks enable row level security;
alter table progress_reviews enable row level security;
alter table ai_chat_sessions enable row level security;
alter table ai_chat_messages enable row level security;
alter table notifications enable row level security;

-- MVP RLS policy pattern. Expand per table if stricter policies are needed.
create policy "Users can manage own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);

-- Tables with user_id ownership.
do $$
declare
  t text;
begin
  foreach t in array array[
    'user_delivery_profiles','user_consents','subscriptions','payments','user_goals','onboarding_checklist',
    'blood_test_uploads','blood_test_results','biomarker_results','braverman_assessments','braverman_results',
    'lifestyle_assessments','nutrition_assessments','ai_health_profiles','health_system_scores','ai_summaries',
    'recommendations','supplement_recommendations','bee_product_recommendations','nutrition_plans','action_plans',
    'daily_tasks','progress_reviews','ai_chat_sessions','ai_chat_messages','notifications'
  ]
  loop
    execute format('create policy "Users can manage own rows" on %I for all using (auth.uid() = user_id) with check (auth.uid() = user_id);', t);
  end loop;
end $$;

create index idx_biomarker_results_user_created on biomarker_results(user_id, created_at desc);
create index idx_daily_tasks_user_date on daily_tasks(user_id, task_date);
create index idx_recommendations_user_category on recommendations(user_id, category);
create index idx_ai_health_profiles_user_generated on ai_health_profiles(user_id, generated_at desc);
