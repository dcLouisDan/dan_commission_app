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

-- Commissions Table
create table commissions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Client Info
  client_name text not null,
  client_email text not null,
  
  -- Commission Details
  commission_type text not null,
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

-- Index for Portal Lookup
create index idx_commissions_portal_slug on commissions(portal_slug);

-- CMS: Portfolio & Posts
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

-- Audit Logs
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

-- RLS (Row Level Security)
alter table commissions enable row level security;
alter table portfolio_items enable row level security;
alter table posts enable row level security;

-- PUBLIC READ (Portfolio/Posts)
create policy "Public can view published portfolio"
  on portfolio_items for select
  using (published_at is not null);

create policy "Public can view published posts"
  on posts for select
  using (is_published = true);
