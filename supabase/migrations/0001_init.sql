-- Events
create table if not exists public.events (
  id           text primary key,
  title        text not null,
  description  text not null,
  category     text not null,
  date         text not null,
  time         text not null,
  venue        text not null,
  price        text not null default 'Free',
  speakers     jsonb not null default '[]'::jsonb,
  status       text not null default 'Upcoming',
  image        text,
  capacity     integer not null default 500,
  registered   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Registrations
create table if not exists public.registrations (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  email       text not null,
  phone       text,
  event_id    text not null references public.events(id) on delete cascade,
  status      text not null default 'confirmed'
              check (status in ('confirmed','cancelled','waitlisted')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (event_id, email)
);

create index if not exists registrations_event_id_idx on public.registrations(event_id);
create index if not exists registrations_status_idx   on public.registrations(status);
create index if not exists registrations_created_idx  on public.registrations(created_at desc);

-- Academy Waitlist
create table if not exists public.academy_waitlist (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  email       text not null unique,
  phone       text not null,
  interest    text not null default 'Not sure yet',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists academy_waitlist_created_idx on public.academy_waitlist(created_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at before update on public.events
  for each row execute function public.set_updated_at();

drop trigger if exists registrations_set_updated_at on public.registrations;
create trigger registrations_set_updated_at before update on public.registrations
  for each row execute function public.set_updated_at();

drop trigger if exists academy_waitlist_set_updated_at on public.academy_waitlist;
create trigger academy_waitlist_set_updated_at before update on public.academy_waitlist
  for each row execute function public.set_updated_at();

-- RLS
alter table public.events           enable row level security;
alter table public.registrations    enable row level security;
alter table public.academy_waitlist enable row level security;

drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
  for select using (true);

-- Seed
insert into public.events (id, title, description, category, date, time, venue, price, speakers, status, image, capacity, registered)
values
  ('scholar-reboot', 'Scholar Reboot',
   'A 2-day virtual event featuring real stories and practical strategies to reboot your academic journey.',
   'Learn', 'October 18, 2025', '7:00 PM WAT', 'Virtual (WhatsApp Space)', 'Free',
   '["Amoo Covenant","Omotosho John","Ogunsakin Tobiloba","Adefuye Oreoluwa"]'::jsonb,
   'Past', '/events/scholars_reboot.jpg', 500, 0),

  ('campus2linkedin', 'Campus2LinkedIn',
   'A one-day free virtual event to help students build strong profiles, connections, and career visibility.',
   'Learn', 'December 21, 2025', '7:00 PM WAT', 'Virtual', 'Free',
   '["Okewoye Unique","Bliss Eniobayan"]'::jsonb,
   'Past', '/events/campus2linkedin.jpg', 300, 0),

  ('breaking-into-tech', 'Starting Tech with Limited Resources',
   'Learn what really matters in the beginning of your tech journey.',
   'Earn', 'March 25, 2026', '8:00 PM WAT', 'Virtual (Telegram)', 'Free',
   '["Temiloluwa Gboyega"]'::jsonb,
   'Past', '/events/breaking_into_tech.jpg', 300, 0),

  ('leadership-in-action', 'Leadership In Action',
   'Building Influence, Creating Impact & Driving Growth as a Student.',
   'Lead', 'July 18, 2026', '7:00 PM - 9:00 PM WAT', 'Virtual (Google Meet)', 'Free',
   '["Dr. Bush","Senator"]'::jsonb,
   'Upcoming', '/events/leadership.jpg', 500, 0)
   (
  'build-with-break', 'Build With Break 1.0',
  'Exams are over — but time is your most valuable asset. Learn how to use your break to build skills, not just level up in games.',
  'Earn', 'September 18, 2026', '7:00 PM WAT', 'Virtual (WhatsApp Community)', 'Free',
  '[]'::jsonb, 'Upcoming', '/events/build-with-break.jpg', 500, 0
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  date = excluded.date,
  time = excluded.time,
  venue = excluded.venue,
  price = excluded.price,
  speakers = excluded.speakers,
  status = excluded.status,
  image = excluded.image,
  capacity = excluded.capacity;