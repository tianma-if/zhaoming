alter table public.users
  add column if not exists billing_customer_id text;

update public.users
set billing_customer_id = stripe_customer_id
where billing_customer_id is null
  and stripe_customer_id is not null;

create unique index if not exists users_billing_customer_id_idx
  on public.users (billing_customer_id)
  where billing_customer_id is not null;

create table if not exists public.billing_checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  session_id text not null unique,
  user_id uuid not null references public.users(id) on delete cascade,
  provider_customer_id text,
  provider_payment_reference_id text,
  plan_id text not null,
  credits integer not null check (credits > 0),
  amount_total integer not null check (amount_total >= 0),
  currency text not null,
  provider_status text not null default 'open',
  payment_status text not null default 'unpaid',
  fulfilled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.billing_checkout_sessions (
  provider,
  session_id,
  user_id,
  provider_customer_id,
  provider_payment_reference_id,
  plan_id,
  credits,
  amount_total,
  currency,
  provider_status,
  payment_status,
  fulfilled_at,
  created_at,
  updated_at
)
select
  'stripe',
  session_id,
  user_id,
  stripe_customer_id,
  stripe_payment_intent_id,
  plan_id,
  credits,
  amount_total,
  currency,
  stripe_status,
  payment_status,
  fulfilled_at,
  created_at,
  updated_at
from public.stripe_checkout_sessions
on conflict (session_id) do nothing;

create index if not exists billing_checkout_sessions_user_id_created_at_idx
  on public.billing_checkout_sessions (user_id, created_at desc);

create index if not exists billing_checkout_sessions_provider_created_at_idx
  on public.billing_checkout_sessions (provider, created_at desc);

drop trigger if exists set_billing_checkout_sessions_updated_at on public.billing_checkout_sessions;

create trigger set_billing_checkout_sessions_updated_at
before update on public.billing_checkout_sessions
for each row
execute function public.set_updated_at();
