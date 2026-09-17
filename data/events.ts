import { Event } from "@/types/events";

export const UPCOMING_EVENTS: Event[] = [
  {
    id: "build-with-break",
    title: "Build With Break 1.0",
    description:
      "Exams are over — but time is your most valuable asset. Learn how to use your break to build skills, not just level up in games.",
    category: "Earn",
    date: "September 18, 2026",
    time: "7:00 PM WAT",
    venue: "Virtual (WhatsApp Community)",
    price: "Free",
    speakers: [],
    status: "Upcoming",
    image: "/events/build_with_break.jpg",
  },
];

export const PAST_EVENTS: Event[] = [
  {
    id: "scholar-reboot",
    title: "Scholar Reboot",
    description:
      "A 2-day virtual event featuring real stories and practical strategies to reboot your academic journey.",
    category: "Learn",
    date: "October 18, 2025",
    time: "7:00 PM WAT",
    venue: "Virtual (WhatsApp Space)",
    price: "Free",
    speakers: [
      "Amoo Covenant",
      "Omotosho John",
      "Ogunsakin Tobiloba",
      "Adefuye Oreoluwa",
    ],
    status: "Past",
    image: "/events/scholars_reboot.jpg",
  },
  {
    id: "campus2linkedin",
    title: "Campus2LinkedIn",
    description:
      "A one-day free virtual event to help students build strong profiles, connections, and career visibility.",
    category: "Learn",
    date: "December 21, 2025",
    time: "7:00 PM WAT",
    venue: "Virtual",
    price: "Free",
    speakers: ["Okewoye Unique", "Bliss Eniobayan"],
    status: "Past",
    image: "/events/campus2linkedin.jpg",
  },
  {
    id: "breaking-into-tech",
    title: "Starting Tech with Limited Resources",
    description:
      "Learn what really matters in the beginning of your tech journey.",
    category: "Earn",
    date: "March 25, 2026",
    time: "8:00 PM WAT",
    venue: "Virtual (Telegram)",
    price: "Free",
    speakers: ["Temiloluwa Gboyega"],
    status: "Past",
    image: "/events/breaking_into_tech.jpg",
  },
  {
    id: "leadership-in-action",
    title: "Leadership In Action",
    description:
      "Building Influence, Creating Impact & Driving Growth as a Student.",
    category: "Lead",
    date: "July 18, 2026",
    time: "7:00 PM - 9:00 PM WAT",
    venue: "Virtual (Google Meet)",
    price: "Free",
    speakers: ["Dr. Bush", "Senator"],
    status: "Past",
    image: "/events/leadership.jpg",
  },
];

export const WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/CGacyht0SVp1YzwTnm3wjm?mode=gi_t";
