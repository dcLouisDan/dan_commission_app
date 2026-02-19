-- Migration: File Tracking System

-- 1. Create Files Table
create table if not exists public.files (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  
  filename text not null,
  storage_path text not null, -- e.g. 'commissions/abc-123.png'
  bucket_id text not null,    -- e.g. 'reference-images'
  content_type text,          -- e.g. 'image/png'
  size_bytes bigint,
  metadata jsonb default '{}'::jsonb,
  is_public boolean default false,
  
  unique(bucket_id, storage_path)
);

-- 2. Create Polymorphic Pivot Table
create table if not exists public.file_relations (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now(),
  
  file_id uuid not null references public.files(id) on delete cascade,
  related_table text not null, -- e.g. 'commissions', 'portfolio_items'
  related_id uuid not null,    -- ID of the record in the related table
  relation_type text not null, -- e.g. 'reference', 'delivery', 'thumbnail'
  
  -- Prevent duplicate relations of the same type for the same file/record
  unique(file_id, related_table, related_id, relation_type)
);

-- 3. Indexes for performance
create index if not exists idx_files_bucket_path on public.files(bucket_id, storage_path);
create index if not exists idx_file_relations_related on public.file_relations(related_table, related_id);

-- 4. RLS for Files
alter table public.files enable row level security;
alter table public.file_relations enable row level security;

-- Admin: Full Access
create policy "Admins have full access to files"
  on public.files for all
  to authenticated
  using (true)
  with check (true);

create policy "Admins have full access to file_relations"
  on public.file_relations for all
  to authenticated
  using (true)
  with check (true);

-- Public: Select files if public or via relations (simplified for now)
create policy "Public can view public files"
  on public.files for select
  using (is_public = true);

-- 5. Trigger for updated_at (optional if we adds it later)
-- Note: Files are mostly immutable (upload once, delete when not needed)
