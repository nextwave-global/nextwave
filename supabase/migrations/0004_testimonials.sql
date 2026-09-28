-- ============================================
-- Testimonials
-- ============================================
create table if not exists public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text,
  email        text not null,
  quote        text not null,
  rating       integer not null default 5 check (rating between 1 and 5),
  event_id     text references public.events(id) on delete set null,
  status       text not null default 'pending'
               check (status in ('pending','approved','rejected')),
  is_featured  boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists testimonials_status_idx  on public.testimonials(status);
create index if not exists testimonials_created_idx on public.testimonials(created_at desc);
create unique index if not exists testimonials_email_unique on public.testimonials(lower(email));

-- updated_at trigger
drop trigger if exists testimonials_set_updated_at on public.testimonials;
create trigger testimonials_set_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

-- RLS: only approved rows readable via anon; all writes go through service role
alter table public.testimonials enable row level security;

drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read" on public.testimonials
  for select using (status = 'approved');

-- ============================================
-- Approved testimonials view (with event title)
-- ============================================
drop view if exists public.approved_testimonials;
create or replace view public.approved_testimonials as
select
  t.id,
  t.name,
  t.role,
  t.quote,
  t.rating,
  t.is_featured,
  t.created_at,
  t.event_id,
  e.title as event_title
from public.testimonials t
left join public.events e on e.id = t.event_id
where t.status = 'approved';
