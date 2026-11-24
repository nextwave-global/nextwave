export type EventStatus = "draft" | "upcoming" | "live" | "past" | "cancelled";

export interface Speaker {
  name: string;
  title?: string;
  bio?: string;
  photo?: string | null;
  socials?: {
    linkedin?: string;
    x?: string;
    whatsapp?: string;
    website?: string;
  };
}

export interface DbEvent {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string;
  category: string;

  // legacy human-readable (kept for emails and old clients)
  date: string;
  time: string;

  venue: string;
  price: string;
  status: string; // legacy
  image: string | null;

  capacity: number;
  registered: number;
  created_at: string;
  updated_at: string;

  // automated fields
  starts_at: string | null;
  ends_at: string | null;
  timezone: string | null;

  flyer_url: string | null;
  flyers: string[];
  speakers: string[];            // legacy: names only
  speakers_data: Speaker[];      // new: structured

  is_featured: boolean;
  override_status: EventStatus | null;
  registration_open: boolean;
  tags: string[];
  whatsapp_url: string | null;
  updated_by: string | null;

  // from view
  computed_status: EventStatus;
}

export interface DbRegistration {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  event_id: string;
  status: "confirmed" | "cancelled" | "waitlisted";
  created_at: string;
  updated_at: string;
}

export interface DbAcademyWaitlist {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  interest: string;
  created_at: string;
  updated_at: string;
}

export type ApplicationTrack =
  | "video_editing"
  | "brand_design"
  | "social_media"
  | "copywriting";

export type ApplicationSegment =
  | "hot"
  | "warm"
  | "curious"
  | "sponsorship";

export type ApplicationStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "rejected"
  | "enrolled";

export type PaymentCapacity =
  | "1k-3k"
  | "3k-5k"
  | "5k-10k"
  | "10k_plus"
  | "sponsorship";

export type OpenToPaid = "yes" | "no" | "maybe";
export type ClassVibe = "love_it" | "wont_keep_up";

export interface DbApplication {
  id: string;

  track: ApplicationTrack;

  full_name: string;
  whatsapp: string;
  email: string;
  school: string;
  level: string;

  has_linkedin: boolean;
  linkedin_url: string | null;
  is_social_active: boolean;
  has_prior_skill: boolean;
  prior_skill_name: string | null;
  earns_from_skill: boolean;

  goal: string;
  ready_to_commit: boolean;
  open_to_paid: OpenToPaid;
  class_vibe: ClassVibe;

  payment_capacity: PaymentCapacity;

  score: number;
  segment: ApplicationSegment;
  needs_sponsorship: boolean;

  admin_notes: string | null;
  admin_status: ApplicationStatus;
  contacted_at: string | null;

  created_at: string;
  updated_at: string;
}
