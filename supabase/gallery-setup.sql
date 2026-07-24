-- Luvinski Gallery: database, public reads, owner-only writes, and image storage.
-- Safe to run more than once in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title varchar(48) not null check (char_length(title) between 1 and 48),
  description varchar(180) not null default '' check (char_length(description) <= 180),
  image_url text not null,
  storage_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_gallery_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gallery_items_updated_at on public.gallery_items;
create trigger gallery_items_updated_at
before update on public.gallery_items
for each row execute function public.set_gallery_updated_at();

alter table public.gallery_items enable row level security;

drop policy if exists "Public can read gallery" on public.gallery_items;
create policy "Public can read gallery"
on public.gallery_items for select
to anon, authenticated
using (true);

drop policy if exists "Owner can add gallery images" on public.gallery_items;
create policy "Owner can add gallery images"
on public.gallery_items for insert
to authenticated
with check ((select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com');

drop policy if exists "Owner can edit gallery images" on public.gallery_items;
create policy "Owner can edit gallery images"
on public.gallery_items for update
to authenticated
using ((select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com');

drop policy if exists "Owner can remove gallery images" on public.gallery_items;
create policy "Owner can remove gallery images"
on public.gallery_items for delete
to authenticated
using ((select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Owner can upload gallery files" on storage.objects;
create policy "Owner can upload gallery files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'gallery'
  and (select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com'
);

drop policy if exists "Owner can update gallery files" on storage.objects;
create policy "Owner can update gallery files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'gallery'
  and (select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com'
)
with check (
  bucket_id = 'gallery'
  and (select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com'
);

drop policy if exists "Owner can delete gallery files" on storage.objects;
create policy "Owner can delete gallery files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'gallery'
  and (select auth.jwt() ->> 'email') = 'dikshitaggarwal007@gmail.com'
);

insert into public.gallery_items (id, title, description, image_url, storage_path, sort_order)
values
  ('00000000-0000-4000-8000-000000000001', 'Island Light', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-01.webp', null, 10),
  ('00000000-0000-4000-8000-000000000002', 'After the Fire', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-02.webp', null, 20),
  ('00000000-0000-4000-8000-000000000003', 'An Unexpected Ally', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-03.webp', null, 30),
  ('00000000-0000-4000-8000-000000000004', 'Roads Between', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-04.webp', null, 40),
  ('00000000-0000-4000-8000-000000000005', 'A Complicated Room', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-05.webp', null, 50),
  ('00000000-0000-4000-8000-000000000006', 'Desert Transit', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-06.webp', null, 60),
  ('00000000-0000-4000-8000-000000000007', 'Negotiations', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-07.webp', null, 70),
  ('00000000-0000-4000-8000-000000000008', 'A New City', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-08.webp', null, 80),
  ('00000000-0000-4000-8000-000000000009', 'The Pearl', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-09.webp', null, 90),
  ('00000000-0000-4000-8000-000000000010', 'Open Water', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-10.webp', null, 100),
  ('00000000-0000-4000-8000-000000000011', 'Industrial Night', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-11.webp', null, 110),
  ('00000000-0000-4000-8000-000000000012', 'Midnight Run', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-12.webp', null, 120),
  ('00000000-0000-4000-8000-000000000013', 'Mountain Curve', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-13.webp', null, 130),
  ('00000000-0000-4000-8000-000000000014', 'Backstreet Detour', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-14.webp', null, 140),
  ('00000000-0000-4000-8000-000000000015', 'Golden Hour', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-15.webp', null, 150),
  ('00000000-0000-4000-8000-000000000016', 'The Long Way Home', 'A screenshot collected from games, experiments, characters, environments, and the visual moments worth keeping.', '/assets/portfolio/field-16.webp', null, 160)
on conflict (id) do nothing;
