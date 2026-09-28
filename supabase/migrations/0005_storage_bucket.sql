-- Anyone can view images
create policy "Public read" on storage.objects for
select
    using (bucket_id = 'event-images');

-- Only service role can upload (our API uses it)
create policy "Service role write" on storage.objects for insert
with
    check (
        bucket_id = 'event-images'
        and auth.role () = 'service_role'
    );

create policy "Service role update" on storage.objects for
update using (
    bucket_id = 'event-images'
    and auth.role () = 'service_role'
);

create policy "Service role delete" on storage.objects for delete using (
    bucket_id = 'event-images'
    and auth.role () = 'service_role'
);