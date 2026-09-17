export interface Program {
  title: string;
  desc: string;
  date: string;
  time: string;
  venue: string;
  status: "Upcoming" | "Past" | "Coming Soon";
  image?: string;
}

export const PROGRAMS: Program[] = [
  {
    title: "Leadership in Action",
    desc: "Building Influence, Creating Impact & Driving Growth as a Student.",
    date: "July 18, 2026",
    time: "7:00 PM - 9:00 PM WAT",
    venue: "Virtual (Google Meet)",
    status: "Coming Soon",
    image: "/events/leadership.jpg",
  },
  {
    title: "Scholar Reboot",
    desc: "Academic clarity and strategy for students aiming higher.",
    date: "18th October, 2025",
    time: "7:00 PM",
    venue: "Virtual Event",
    status: "Past",
    image: "/events/scholars_reboot.jpg",
  },
  {
    title: "Campus2LinkedIn",
    desc: "Professional networking and branding for global opportunities.",
    date: "21st December, 2025",
    time: "7:00 PM",
    venue: "Virtual Event",
    status: "Past",
    image: "/events/campus2linkedin.jpg",
  },
  {
    title: "Starting Tech with Limited Resources",
    desc: "Building, shipping, and learning what really matters in tech.",
    date: "25th March, 2026",
    time: "8:00 PM",
    venue: "Virtual Event",
    status: "Past",
    image: "/events/breaking_into_tech.jpg",
  },
];
