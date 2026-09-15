-- KORZH FAN / FAN GALLERY
-- Run this file once in Supabase SQL Editor.
-- Creates a public image bucket, fan photo records and storage RLS.

create table if not exists public.fan_photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text,
  external_url text,
  author_name text not null default 'Аноним',
  city text not null default '',
  caption text not null default '',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  constraint fan_photos_source_check check (storage_path is not null or external_url is not null)
);

create index if not exists fan_photos_status_created_idx on public.fan_photos(status, created_at desc);

alter table public.fan_photos enable row level security;

drop policy if exists fan_photos_public_read on public.fan_photos;
create policy fan_photos_public_read
on public.fan_photos for select to anon, authenticated
using (status = 'approved' or public.is_admin());

drop policy if exists fan_photos_public_insert on public.fan_photos;
create policy fan_photos_public_insert
on public.fan_photos for insert to anon, authenticated
with check (
  status = 'pending'
  and length(trim(author_name)) between 1 and 40
  and length(trim(city)) <= 60
  and length(trim(caption)) <= 180
  and ((storage_path is not null and external_url is null) or (storage_path is null and external_url is not null))
);

drop policy if exists fan_photos_admin_update on public.fan_photos;
create policy fan_photos_admin_update
on public.fan_photos for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists fan_photos_admin_delete on public.fan_photos;
create policy fan_photos_admin_delete
on public.fan_photos for delete to authenticated
using (public.is_admin());

grant select, insert on public.fan_photos to anon, authenticated;
grant update, delete on public.fan_photos to authenticated;

-- Public bucket: images are readable by URL, but uploads/deletes are controlled by RLS.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'fan-gallery',
  'fan-gallery',
  true,
  6291456,
  array['image/jpeg','image/png','image/webp','image/gif']::text[]
)
on conflict (id) do nothing;

drop policy if exists fan_gallery_public_read on storage.objects;
create policy fan_gallery_public_read
on storage.objects for select to public
using (bucket_id = 'fan-gallery');

drop policy if exists fan_gallery_public_upload on storage.objects;
create policy fan_gallery_public_upload
on storage.objects for insert to anon, authenticated
with check (
  bucket_id = 'fan-gallery'
  and (storage.foldername(name))[1] = 'uploads'
  and lower(storage.extension(name)) in ('jpg','jpeg','png','webp','gif')
);

drop policy if exists fan_gallery_admin_delete on storage.objects;
create policy fan_gallery_admin_delete
on storage.objects for delete to authenticated
using (bucket_id = 'fan-gallery' and public.is_admin());

-- Two visual examples for the page. They use the existing public photo archive,
-- so no external image is copied into the project repository.
insert into public.fan_photos (external_url, author_name, city, caption, status)
select 'https://maxkorzh.live/assets/cache_image/image/2025.08.09%20Max%20Korzh%20-%20PGE%20Narodowy%20-%20D.Wajda-16_600x0_90e.jpg', 'KORZH FAN', 'Варшава', 'Стадион. Люди. Свой вайб.', 'approved'
where not exists (select 1 from public.fan_photos where external_url like '%PGE%20Narodowy%20-%20D.Wajda-16%');

insert into public.fan_photos (external_url, author_name, city, caption, status)
select 'https://maxkorzh.live/assets/cache_image/image/photos/tallin_29.06.24/JR20240629MaxKorzh-138_600x0_5ff.jpeg', 'KORZH FAN', 'Таллин', 'Когда весь стадион поёт вместе.', 'approved'
where not exists (select 1 from public.fan_photos where external_url like '%tallin_29.06.24%');
