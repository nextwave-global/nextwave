export interface DbEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  price: string;
  speakers: string[];
  status: string;
  image: string | null;
  capacity: number;
  registered: number;
  created_at: string;
  updated_at: string;
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
