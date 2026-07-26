-- Luvinski Mission Builder: structured pages, owner-only editing, public published reads, and image storage.
-- Run once after gallery-setup.sql. Safe to run again.

create extension if not exists pgcrypto;

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  slug varchar(56) not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name varchar(64) not null check (char_length(name) between 1 and 64),
  excerpt varchar(220) not null default '' check (char_length(excerpt) <= 220),
  cover_url text not null default '',
  cover_storage_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  hero jsonb not null default '{}'::jsonb check (jsonb_typeof(hero) = 'object'),
  blocks jsonb not null default '[]'::jsonb check (jsonb_typeof(blocks) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_mission_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists missions_updated_at on public.missions;
create trigger missions_updated_at before update on public.missions
for each row execute function public.set_mission_updated_at();

alter table public.missions enable row level security;

drop policy if exists "Public can read published missions" on public.missions;
create policy "Public can read published missions" on public.missions for select
to anon, authenticated using (status = 'published');

drop policy if exists "Owner can read all missions" on public.missions;
create policy "Owner can read all missions" on public.missions for select
to authenticated using ((select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com');

drop policy if exists "Owner can create missions" on public.missions;
create policy "Owner can create missions" on public.missions for insert
to authenticated with check ((select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com');

drop policy if exists "Owner can edit missions" on public.missions;
create policy "Owner can edit missions" on public.missions for update
to authenticated using ((select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com');

drop policy if exists "Owner can delete missions" on public.missions;
create policy "Owner can delete missions" on public.missions for delete
to authenticated using ((select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('missions', 'missions', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Owner can upload mission files" on storage.objects;
create policy "Owner can upload mission files" on storage.objects for insert to authenticated
with check (bucket_id = 'missions' and (select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com');

drop policy if exists "Owner can update mission files" on storage.objects;
create policy "Owner can update mission files" on storage.objects for update to authenticated
using (bucket_id = 'missions' and (select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com')
with check (bucket_id = 'missions' and (select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com');

drop policy if exists "Owner can delete mission files" on storage.objects;
create policy "Owner can delete mission files" on storage.objects for delete to authenticated
using (bucket_id = 'missions' and (select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com');

