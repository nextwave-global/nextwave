-- ============================================
-- Upgrade events table for automation
-- ============================================

alter table public.events
  add column if not exists slug        text unique,
  add column if not exists starts_at   timestamptz,
  add column if not exists ends_at     timestamptz,
  add column if not exists timezone    text default 'Africa/Lagos',
  add column if not exists flyer_url   text,
  add column if not exists is_featured boolean not null default false,
  add column if not exists override_status text
    check (override_status in ('draft','upcoming','live','past','cancelled')),
  add column if not exists registration_open boolean not null default true,
  add column if not exists tags        jsonb not null default '[]'::jsonb,
  add column if not exists whatsapp_url text,
  add column if not exists updated_by  text;

-- Backfill slug from id where null
update public.events
set slug = id
where slug is null;

-- Add not-null after backfill
alter table public.events
  alter column slug set not null;

-- Make starts_at not-null going forward (backfill from existing rows first)
-- We'll backfill manually for existing rows; new inserts must include it.
-- Skip not-null constraint for now to avoid breaking legacy rows.

create index if not exists events_starts_at_idx on public.events(starts_at desc);
create index if not exists events_status_idx    on public.events(status);
create index if not exists events_featured_idx  on public.events(is_featured) where is_featured = true;

-- ============================================
-- Derived status view (always correct, no cron needed)
-- ============================================
create or replace view public.events_with_status as
select
  e.*,
  case
    when e.override_status is not null then e.override_status
    when e.starts_at is null           then 'draft'
    when now() < e.starts_at           then 'upcoming'
    when e.ends_at is not null and now() between e.starts_at and e.ends_at then 'live'
    when now() >= coalesce(e.ends_at, e.starts_at + interval '3 hours') then 'past'
    else 'live'
  end as computed_status
from public.events e;

-- ============================================
-- Seed Build With Break with proper timestamps
-- ============================================
update public.events
set
  slug = 'build-with-break-1-0',
  starts_at = '2025-09-18 19:00:00+01',
  ends_at   = '2025-09-18 21:00:00+01',
  timezone  = 'Africa/Lagos',
  flyer_url = '/events/build-with-break.jpg',
  image     = '/events/build-with-break.jpg',
  is_featured = true,
  status    = 'Upcoming',
  whatsapp_url = 'https://chat.whatsapp.com/CGacyht0SVp1YzwTnm3wjm?mode=gi_t',
  tags      = '["break","skills","productivity"]'::jsonb
where id = 'build-with-break';

-- Backfill existing events with sensible timestamps
update public.events set
  starts_at = '2025-10-18 19:00:00+01',
  ends_at   = '2025-10-19 21:00:00+01',
  slug      = coalesce(slug, 'scholar-reboot')
where id = 'scholar-reboot' and starts_at is null;

update public.events set
  starts_at = '2025-12-21 19:00:00+01',
  ends_at   = '2025-12-21 21:00:00+01',
  slug      = coalesce(slug, 'campus2linkedin')
where id = 'campus2linkedin' and starts_at is null;

update public.events set
  starts_at = '2026-03-25 20:00:00+01',
  ends_at   = '2026-03-25 22:00:00+01',
  slug      = coalesce(slug, 'starting-tech-with-limited-resources')
where id = 'breaking-into-tech' and starts_at is null;

update public.events set
  starts_at = '2026-07-18 19:00:00+01',
  ends_at   = '2026-07-18 21:00:00+01',
  slug      = coalesce(slug, 'leadership-in-action')
where id = 'leadership-in-action' and starts_at is null;

-- Ensure only one featured event
create or replace function public.enforce_single_featured()
returns trigger language plpgsql as $$
begin
  if new.is_featured then
    update public.events set is_featured = false where id <> new.id and is_featured = true;
  end if;
  return new;
end $$;

drop trigger if exists events_single_featured on public.events;
create trigger events_single_featured
  before insert or update of is_featured on public.events
  for each row execute function public.enforce_single_featured();