-- ============================================
-- Multi-speaker + multi-flyer support
-- ============================================

-- Speakers become structured objects instead of plain strings.
-- New shape: [{ name, title, bio, photo, socials: { linkedin, x, whatsapp } }]
-- Legacy `speakers` column (jsonb array of strings) stays for backward compat.
alter table public.events
  add column if not exists speakers_data jsonb not null default '[]'::jsonb;

-- Additional flyers gallery (main flyer stays in flyer_url for hero/cards)
alter table public.events
  add column if not exists flyers jsonb not null default '[]'::jsonb;

-- Optional: short tagline shown under title
alter table public.events
  add column if not exists tagline text;

-- Migrate existing string speakers → objects
update public.events
set speakers_data = (
  select coalesce(jsonb_agg(jsonb_build_object('name', s, 'title', '', 'bio', '', 'photo', null, 'socials', '{}'::jsonb)), '[]'::jsonb)
  from jsonb_array_elements_text(speakers) as s
)
where speakers_data = '[]'::jsonb and jsonb_array_length(speakers) > 0;

-- Backfill flyers: if flyer_url exists, seed the array with it (so gallery always has 1)
update public.events
set flyers = jsonb_build_array(flyer_url)
where flyer_url is not null and flyers = '[]'::jsonb;

-- Recreate the view so speakers_data + flyers are exposed
drop view if exists public.events_with_status;

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
