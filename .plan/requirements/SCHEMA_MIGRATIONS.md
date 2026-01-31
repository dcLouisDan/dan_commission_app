# Schema Migrations

Run these commands in the Supabase SQL Editor to set up the database.

## 1. Setup & Extensions
```sql
-- Enable UUID generation
create extension if not exists "uuid-ossp";
```

## 2. Enums
```sql
create type commission_status as enum (
  'PENDING', 
  'IN_PROGRESS', 
  'IN_REVISION', 
  'AWAITING_FINAL_PAYMENT', -- Added this state for clarity
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
```

## 3. Tables

### Commissions Table
```sql
create table commissions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Client Info
  client_name text not null,
  client_email text not null,
  
  -- Commission Details
  commission_type text not null, -- e.g. "Bust", "Full Body"
  details text,
  reference_images jsonb default '[]'::jsonb,
  is_commercial boolean default false,
  priority_level text default 'STANDARD', -- STANDARD, RUSH, VIP
  internal_notes text, -- Admin private notes
  
  -- Financials
  base_price numeric,
  total_price numeric,
  amount_paid numeric default 0,
  -- balance_due is calculated in app or via generated column if PG version supports it easily, 
  -- but generally safer to compute in app logic to allow partial flexibility.
  -- For strictness: 
  -- balance_due numeric generated always as (total_price - amount_paid) stored,
  
  tax_amount numeric default 0, -- BIR Tax
  xendit_fee numeric default 0,
  net_earnings_php numeric default 0, -- Real income
  or_number text, -- Official Receipt Number
  
  -- Workflow
  revision_count integer default 0,
  status commission_status default 'PENDING',
  payment_status payment_status_enum default 'UNPAID',
  
  -- Access & Integrations
  portal_slug uuid default uuid_generate_v4(), -- public access key
  portal_accessed_at timestamptz,
  external_id text, -- Xendit Invoice ID
  payment_url text
);

-- Index for Portal Lookup
create index idx_commissions_portal_slug on commissions(portal_slug);
```

### CMS: Portfolio & Posts
```sql
create table portfolio_items (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  
  title text not null,
  image_url text not null,
  description text,
  tags text[] default array[]::text[],
  is_featured boolean default false,
  published_at timestamptz -- NULL = Draft
);

create table posts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  
  slug text unique not null,
  title text not null,
  content text, -- Markdown
  excerpt text,
  cover_image text,
  is_published boolean default false,
  published_at timestamptz
);
```

### Audit Logs
```sql
create table activity_logs (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  
  commission_id uuid references commissions(id) on delete set null,
  actor text default 'SYSTEM', -- 'ADMIN' or 'CLIENT' or 'SYSTEM'
  action text not null, -- e.g. 'STATUS_UPDATE'
  details jsonb -- e.g. { "from": "PENDING", "to": "IN_PROGRESS" }
);

create table webhooks_log (
  id uuid primary key default uuid_generate_v4(),
  received_at timestamptz default now(),
  event_type text,
  source text default 'XENDIT',
  payload jsonb,
  processed boolean default false
);
```

## 4. RLS (Row Level Security) - Initial Setup
```sql
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

-- ADMIN ACCESS (Needs to be replaced with actual User ID check in production)
-- For now, purely server-side service role key will bypass RLS.
-- This policy allows authenticated users (if you implemented Auth) to do everything.
-- create policy "Admin full access"
--   on commissions for all
--   using (auth.uid() = 'YOUR-ADMIN-UUID');
```
