create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references neon_auth."user"(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  auth_provider text not null default 'better_auth',
  locale text,
  timezone text,
  stripe_customer_id text unique,
  subscription_status text not null default 'free'
    check (subscription_status in ('free', 'trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  credits integer not null default 0 check (credits >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists users_subscription_status_idx
  on public.users (subscription_status);

create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create table if not exists public.divinations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  divination_type text not null
    check (divination_type in ('bazi', 'ziwei', 'qimen', 'meihua', 'liuyao', 'chenggu', 'custom')),
  subject_name text,
  birth_gregorian timestamptz,
  birth_lunar jsonb,
  gender text
    check (gender in ('male', 'female', 'other', 'unknown')),
  question text not null,
  input_params jsonb not null default '{}'::jsonb,
  chart_json jsonb not null default '{}'::jsonb,
  ai_result_markdown text,
  ai_model text,
  credits_consumed integer not null default 0 check (credits_consumed >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'failed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists divinations_user_id_created_at_idx
  on public.divinations (user_id, created_at desc);

create index if not exists divinations_chart_json_gin_idx
  on public.divinations using gin (chart_json);

create trigger set_divinations_updated_at
before update on public.divinations
for each row
execute function public.set_updated_at();

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  meta_description text,
  cover_image_url text,
  tags text[] not null default '{}',
  author_id uuid references public.users(id) on delete set null,
  source text not null default 'manual'
    check (source in ('manual', 'automation')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists posts_published_at_idx
  on public.posts (published_at desc);

create index if not exists posts_tags_gin_idx
  on public.posts using gin (tags);

create trigger set_posts_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();
