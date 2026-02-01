-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Enums
create type commission_status as enum (
  'PENDING', 
  'IN_PROGRESS', 
  'IN_REVISION', 
  'AWAITING_FINAL_PAYMENT', 
  'COMPLETED', 
  'EXPIRED', 
  'REFUNDED',
  'REJECTED'
);

create type payment_status_enum as enum (
  'UNPAID', 
  'DEPOSIT_PAID', 
  'FULLY_PAID'
);

-- Tables

-- 1. System Settings (Singleton Configuration)
create table system_settings (
  id integer primary key default 1 check (id = 1),
  tax_rate numeric default 0.08, -- 8%
  xendit_fee_percent numeric default 0.0,
  xendit_fee_fixed numeric default 0.0,
  commercial_multiplier numeric default 2.0,
  updated_at timestamptz default now()
);

-- Seed default settings
insert into system_settings (id) values (1) on conflict do nothing;

-- 2. Commission Tiers (Inventory)
create table commission_tiers (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  name text not null,
  description text,
  base_price numeric default 0,
  currency text default 'PHP',
  is_active boolean default true,
  slot_limit integer default 10,
  thumbnail_url text
);

-- 3. Commissions Table
create table commissions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Client Info
  client_name text not null,
  client_email text not null,
  
  -- Commission Details
  commission_type text not null, -- Snapshot of tier name
  tier_id uuid references commission_tiers(id) on delete set null, -- Optional link
  details text,
  reference_images jsonb default '[]'::jsonb,
  is_commercial boolean default false,
  priority_level text default 'STANDARD',
  internal_notes text,
  
  -- Financials
  base_price numeric,
  total_price numeric,
  amount_paid numeric default 0,
  tax_amount numeric default 0,
  xendit_fee numeric default 0,
  net_earnings_php numeric default 0,
  or_number text,
  
  -- Workflow
  revision_count integer default 0,
  status commission_status default 'PENDING',
  payment_status payment_status_enum default 'UNPAID',
  
  -- Access & Integrations
  portal_slug uuid default uuid_generate_v4(),
  portal_accessed_at timestamptz,
  external_id text,
  payment_url text
);

create index idx_commissions_portal_slug on commissions(portal_slug);

-- 4. CMS: Portfolio & Posts
create table portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  
  title text not null,
  image_url text not null,
  description text,
  tags text[] default array[]::text[],
  is_featured boolean default false,
  published_at timestamptz
);

create table posts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  
  slug text unique not null,
  title text not null,
  content text,
  excerpt text,
  cover_image text,
  is_published boolean default false,
  published_at timestamptz
);

-- 5. Audit Logs
create table activity_logs (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  
  commission_id uuid references commissions(id) on delete set null,
  actor text default 'SYSTEM',
  action text not null,
  details jsonb
);

create table webhooks_log (
  id uuid primary key default uuid_generate_v4(),
  received_at timestamptz default now(),
  event_type text,
  source text default 'XENDIT',
  payload jsonb,
  processed boolean default false
);

-- RLS
alter table commissions enable row level security;
alter table commission_tiers enable row level security;
alter table system_settings enable row level security;
alter table portfolio_items enable row level security;
alter table posts enable row level security;
alter table activity_logs enable row level security;
alter table webhooks_log enable row level security;

-- Policies

-- Admin Access (Policies for Logs)
-- Ideally, we check for a specific admin UUID or role. 
-- For now, we deny public access by default since no public policies exist for these tables.
-- Admin usage will likely use the SERVICE_ROLE key (bypasses RLS) or a specific policy if using client-side auth.

-- Example: Allow Admin Read-Only on Logs (if using client-side admin auth)
-- create policy "Admins can view activity logs"
--   on activity_logs for select
--   using (auth.uid() = 'admin_uuid_here');

-- Policies

-- Public Read Tiers
create policy "Public can view active tiers"
  on commission_tiers for select
  using (is_active = true);

-- Public Read Settings (for calculator)
create policy "Public can view settings"
  on system_settings for select
  using (true);

-- Public Read CMS
create policy "Public can view published portfolio"
  on portfolio_items for select
  using (published_at is not null);

create policy "Public can view published posts"
  on posts for select
  using (is_published = true);
