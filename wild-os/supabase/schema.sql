-- WILD OS Supabase Schema
-- Run in Supabase SQL Editor

create extension if not exists pgcrypto;

-- PROFILES
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  tier            text check (tier in ('T1','T2','T3')) default null,
  tier_expires_at timestamptz default null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- UNLOCK CODES
create table if not exists public.unlock_codes (
  id          uuid primary key default gen_random_uuid(),
  code_hash   text unique not null,
  tier        text not null check (tier in ('T1','T2','T3')),
  is_used     boolean default false,
  used_by     uuid references auth.users(id) default null,
  used_at     timestamptz default null,
  created_at  timestamptz default now()
);

create or replace function public.validate_and_consume_code(p_code_hash text, p_user_id uuid)
returns json language plpgsql security definer set search_path = ''
as $$
declare
  v_row public.unlock_codes%rowtype;
begin
  select * into v_row from public.unlock_codes where code_hash = p_code_hash and is_used = false limit 1;
  if not found then
    return json_build_object('success', false, 'error', 'Invalid or already used code');
  end if;
  update public.unlock_codes set is_used = true, used_by = p_user_id, used_at = now() where id = v_row.id;
  update public.profiles set tier = v_row.tier, updated_at = now() where id = p_user_id;
  return json_build_object('success', true, 'tier', v_row.tier);
end;
$$;

-- JOURNAL ENTRIES
create table if not exists public.journal_entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  title      text,
  content    text,
  mood       text,
  mood_tags  text[] default '{}',
  tags       text[] default '{}',
  lucidity   integer default 0 check (lucidity >= 0 and lucidity <= 10),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ATTEMPT LOGS
create table if not exists public.attempt_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  date         date not null default current_date,
  method       text,
  sleep_time   time,
  attempt_time time,
  atonia       boolean,
  hypnagogic   boolean,
  outcome      text check (outcome in ('failed','partial','full')),
  lucidity     integer default 0 check (lucidity >= 0 and lucidity <= 10),
  description  text,
  notes        text,
  created_at   timestamptz default now()
);

-- TRACKER DAYS
create table if not exists public.tracker_days (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  cycle_number integer not null default 1,
  day_number   integer not null check (day_number between 1 and 7),
  tasks        jsonb default '{}',
  notes        text,
  completed_at timestamptz,
  created_at   timestamptz default now(),
  unique(user_id, cycle_number, day_number)
);

-- SUPPLEMENT LOGS
create table if not exists public.supplement_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  supplement text not null,
  dose       text,
  time_taken time,
  notes      text,
  created_at timestamptz default now()
);

-- PROTOCOLS
create table if not exists public.protocols (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  steps      jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.profiles         enable row level security;
alter table public.unlock_codes     enable row level security;
alter table public.journal_entries  enable row level security;
alter table public.attempt_logs     enable row level security;
alter table public.tracker_days     enable row level security;
alter table public.supplement_logs  enable row level security;
alter table public.protocols        enable row level security;

create policy profiles_select    on public.profiles        for select using (auth.uid() = id);
create policy profiles_update    on public.profiles        for update using (auth.uid() = id);
create policy codes_no_select    on public.unlock_codes    for select using (false);
create policy journal_all        on public.journal_entries for all    using (auth.uid() = user_id);
create policy attempts_all       on public.attempt_logs    for all    using (auth.uid() = user_id);
create policy tracker_all        on public.tracker_days    for all    using (auth.uid() = user_id);
create policy supplements_all    on public.supplement_logs for all    using (auth.uid() = user_id);
create policy protocols_all      on public.protocols       for all    using (auth.uid() = user_id);

-- INDEXES
create index if not exists idx_journal_user     on public.journal_entries(user_id, created_at desc);
create index if not exists idx_attempts_user    on public.attempt_logs(user_id, date desc);
create index if not exists idx_tracker_user     on public.tracker_days(user_id, cycle_number, day_number);
create index if not exists idx_supplements_user on public.supplement_logs(user_id, created_at desc);
create index if not exists idx_protocols_user   on public.protocols(user_id, created_at desc);
