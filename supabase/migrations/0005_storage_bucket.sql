-- 1. Create the bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-images',
  'event-images',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Public read policy
drop policy if exists "Public read access" on storage.objects;
create policy "Public read access"
on storage.objects for select
using (bucket_id = 'event-images');

-- 3. Service role insert policy
drop policy if exists "Service role can upload" on storage.objects;
create policy "Service role can upload"
on storage.objects for insert
with check (bucket_id = 'event-images');

-- 4. Service role update policy
drop policy if exists "Service role can update" on storage.objects;
create policy "Service role can update"
on storage.objects for update
using (bucket_id = 'event-images');

-- 5. Service role delete policy
drop policy if exists "Service role can delete" on storage.objects;
create policy "Service role can delete"
on storage.objects for delete
using (bucket_id = 'event-images');