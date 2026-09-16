export interface Event {
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
  image?: string;
}

export interface FormData {
  fullName: string;
  email: string;
  eventId: string;
  phone?: string;
}
