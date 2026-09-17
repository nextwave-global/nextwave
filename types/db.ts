export type EventStatus = "draft" | "upcoming" | "live" | "past" | "cancelled";

export interface DbEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string; // legacy human-readable
  time: string; // legacy human-readable
  venue: string;
  price: string;
  speakers: string[];
  status: string; // legacy — kept for backward compat
  image: string | null;
  capacity: number;
  registered: number;
  created_at: string;
  updated_at: string;

  // New automated fields
  starts_at: string | null;
  ends_at: string | null;
  timezone: string | null;
  flyer_url: string | null;
  is_featured: boolean;
  override_status: EventStatus | null;
  registration_open: boolean;
  tags: string[];
  whatsapp_url: string | null;
  updated_by: string | null;

  // From view
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
