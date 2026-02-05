-- Migration Script: Update Schema to Latest Version
-- Run this in Supabase SQL Editor to apply latest changes.

-- 1. Create New Enums
create type priority_level_enum as enum (
  'STANDARD',
  'RUSH',
  'VIP'
);

-- 2. Create System Settings (Singleton)
create table if not exists system_settings (
  id integer primary key default 1 check (id = 1),
  tax_rate numeric default 0.08, -- 8%
  xendit_fee_percent numeric default 0.0,
  xendit_fee_fixed numeric default 0.0,
  commercial_multiplier numeric default 2.0,
  updated_at timestamptz default now()
);

-- Seed default settings
insert into system_settings (id) values (1) on conflict do nothing;

-- 3. Create Inventory Tables
create table if not exists commission_tiers (
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

create table if not exists commission_addons (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  title text not null,
  description text,
  price numeric default 0,
  is_active boolean default true
);

-- 4. Update Commissions Table
-- Add new columns
alter table commissions 
  add column if not exists tier_id uuid references commission_tiers(id) on delete set null,
  add column if not exists form_data jsonb default '{}'::jsonb;

-- Modify priority_level (Text -> Enum)
-- Note: If you have existing data, this might require a cast. 
-- Since default was 'STANDARD', it matches the enum value.
alter table commissions 
  alter column priority_level drop default;

alter table commissions 
  alter column priority_level type priority_level_enum 
  using priority_level::priority_level_enum;

alter table commissions 
  alter column priority_level set default 'STANDARD';

-- Drop deprecated column (Optional - if you want to keep data, rename it instead, but specific request was to replace)
-- alter table commissions drop column if exists details;

-- 5. Enable RLS on New Tables
alter table system_settings enable row level security;
alter table commission_tiers enable row level security;
alter table commission_addons enable row level security;

-- 6. Add Policies for New Tables

create policy "Public can view active addons"
  on commission_addons for select
  using (is_active = true);

-- ==========================================
-- NEWLY ADDED: Commission Tiers Matrix Pricing, Dual Currency, & Rush Multiplier
-- ==========================================

-- 1. Add rush_multiplier to system_settings
alter table system_settings 
  add column if not exists rush_multiplier numeric default 0.5,
  add column if not exists extra_character_multiplier numeric default 0.75;

-- 2. Add new matrix columns to commission_tiers
alter table commission_tiers 
  add column if not exists category text,
  add column if not exists variant text,
  add column if not exists price_php numeric default 0,
  add column if not exists price_usd numeric default 0;

-- 2. Add Unique Constraint to prevent duplicate category/variant pairs
-- Note: Ensure existing data doesn't violate this before running if applicable
alter table commission_tiers 
  add constraint commission_tiers_unique_category_variant unique (category, variant);

-- 3. Cleanup old columns (Optional)
-- alter table commission_tiers drop column if exists name;
-- alter table commission_tiers drop column if exists base_price;
-- alter table commission_tiers drop column if exists currency;

-- ==========================================
-- NEWLY ADDED: Commission Addons Dual Currency
-- ==========================================

-- 1. Add price_php and price_usd to commission_addons
alter table commission_addons
  add column if not exists price_php numeric default 0,
  add column if not exists price_usd numeric default 0;

-- 2. Cleanup old price column (Optional)
-- alter table commission_addons drop column if exists price;

-- 4. Re-apply Public Select Policy for Tiers
drop policy if exists "Public can view active tiers" on commission_tiers;
create policy "Public can view active tiers"
  on commission_tiers for select
  using (is_active = true);

