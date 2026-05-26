create table if not exists public.stripe_checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  user_id uuid not null references public.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_payment_intent_id text,
  plan_id text not null,
  credits integer not null check (credits > 0),
  amount_total integer not null check (amount_total >= 0),
  currency text not null,
  stripe_status text not null default 'open',
  payment_status text not null default 'unpaid',
  fulfilled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists stripe_checkout_sessions_user_id_created_at_idx
  on public.stripe_checkout_sessions (user_id, created_at desc);

create trigger set_stripe_checkout_sessions_updated_at
before update on public.stripe_checkout_sessions
for each row
execute function public.set_updated_at();
