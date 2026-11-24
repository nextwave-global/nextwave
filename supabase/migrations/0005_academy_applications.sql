-- ============================================
-- Academy applications (lead qualification)
-- ============================================
create table if not exists public.academy_applications (
  id          uuid primary key default gen_random_uuid(),

  -- Track
  track       text not null
              check (track in ('video_editing','brand_design','social_media','copywriting')),

  -- Personal
  full_name   text not null,
  whatsapp    text not null,
  email       text not null,
  school      text not null,
  level       text not null,

  -- Online visibility
  has_linkedin      boolean not null default false,
  linkedin_url      text,
  is_social_active  boolean not null default false,
  has_prior_skill   boolean not null default false,
  prior_skill_name  text,
  earns_from_skill  boolean not null default false,

  -- Goals + intent
  goal                text not null,
  ready_to_commit     boolean not null default false,
  open_to_paid        text not null
                      check (open_to_paid in ('yes','no','maybe')),
  class_vibe          text not null
                      check (class_vibe in ('love_it','wont_keep_up')),

  -- Payment
  payment_capacity    text not null
                      check (payment_capacity in (
                        '1k-3k','3k-5k','5k-10k','10k_plus','sponsorship'
                      )),

  -- Scoring (auto-computed on insert)
  score           int not null default 0,
  segment         text not null default 'curious'
                  check (segment in ('hot','warm','curious','sponsorship')),
  needs_sponsorship boolean not null default false,

  -- Admin fields
  admin_notes     text,
  admin_status    text not null default 'new'
                  check (admin_status in ('new','contacted','qualified','rejected','enrolled')),
  contacted_at    timestamptz,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- One application per email
  unique (email)
);

create index if not exists academy_applications_track_idx    on public.academy_applications(track);
create index if not exists academy_applications_segment_idx  on public.academy_applications(segment);
create index if not exists academy_applications_sponsor_idx  on public.academy_applications(needs_sponsorship) where needs_sponsorship = true;
create index if not exists academy_applications_created_idx  on public.academy_applications(created_at desc);
create index if not exists academy_applications_score_idx    on public.academy_applications(score desc);

drop trigger if exists academy_applications_set_updated_at on public.academy_applications;
create trigger academy_applications_set_updated_at
  before update on public.academy_applications
  for each row execute function public.set_updated_at();

alter table public.academy_applications enable row level security;
-- No public read; only service role via API. 

-- ============================================
-- Scoring function (recomputed on insert/update)
-- ============================================
create or replace function public.compute_application_score()
returns trigger language plpgsql as $$
declare
  s int := 0;
begin
  -- LinkedIn presence: +20
  if new.has_linkedin then s := s + 20; end if;

  -- Active on social: +10
  if new.is_social_active then s := s + 10; end if;

  -- Prior skill: +10
  if new.has_prior_skill then s := s + 10; end if;

  -- Currently earns: +25
  if new.earns_from_skill then s := s + 25; end if;

  -- Ready to commit 4 weeks: +15
  if new.ready_to_commit then s := s + 15; end if;

  -- Open to paid: yes +20, maybe +10, no +0
  if new.open_to_paid = 'yes'   then s := s + 20;
  elsif new.open_to_paid = 'maybe' then s := s + 10;
  end if;

  -- Class vibe: love_it +10
  if new.class_vibe = 'love_it' then s := s + 10; end if;

  -- Payment capacity: scale 0-30
  case new.payment_capacity
    when '10k_plus'    then s := s + 30;
    when '5k-10k'      then s := s + 22;
    when '3k-5k'       then s := s + 14;
    when '1k-3k'       then s := s + 6;
    when 'sponsorship' then s := s + 0;
  end case;

  -- Cap at 100
  new.score := least(s, 100);

  -- Segment
  new.needs_sponsorship := (new.payment_capacity = 'sponsorship');

  if new.needs_sponsorship then
    new.segment := 'sponsorship';
  elsif new.score >= 70 then
    new.segment := 'hot';
  elsif new.score >= 45 then
    new.segment := 'warm';
  else
    new.segment := 'curious';
  end if;

  return new;
end $$;

drop trigger if exists academy_applications_score on public.academy_applications;
create trigger academy_applications_score
  before insert or update of
    has_linkedin, is_social_active, has_prior_skill, earns_from_skill,
    ready_to_commit, open_to_paid, class_vibe, payment_capacity
  on public.academy_applications
  for each row execute function public.compute_application_score();
