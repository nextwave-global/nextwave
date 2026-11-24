import type {
  ApplicationTrack,
  ApplicationSegment,
  PaymentCapacity,
  OpenToPaid,
  ClassVibe,
} from "@/types/db";

export const TRACKS: {
  id: ApplicationTrack;
  emoji: string;
  label: string;
  desc: string;
}[] = [
  {
    id: "video_editing",
    emoji: "🎬",
    label: "Video Editing",
    desc: "Cut, color, and deliver scroll-stopping video.",
  },
  {
    id: "brand_design",
    emoji: "🎨",
    label: "Brand Design",
    desc: "Design logos, identities, and visuals that sell.",
  },
  {
    id: "social_media",
    emoji: "📱",
    label: "Social Media Management",
    desc: "Grow accounts, run pages, and manage content calendars.",
  },
  {
    id: "copywriting",
    emoji: "📝",
    label: "Copywriting & Lead Generation",
    desc: "Write words that convert and generate qualified leads.",
  },
];

export const TRACK_LABELS: Record<ApplicationTrack, string> = {
  video_editing: "Video Editing",
  brand_design: "Brand Design",
  social_media: "Social Media Management",
  copywriting: "Copywriting & Lead Gen",
};

export const SEGMENT_META: Record<
  ApplicationSegment,
  { label: string; color: string; emoji: string; desc: string }
> = {
  hot: {
    label: "Hot",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    emoji: "🔥",
    desc: "Ready to buy, has presence, earns already",
  },
  warm: {
    label: "Warm",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    emoji: "🌤️",
    desc: "Some signals, needs nudging",
  },
  curious: {
    label: "Curious",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    emoji: "❄️",
    desc: "Exploring, no buying signals yet",
  },
  sponsorship: {
    label: "Needs Sponsorship",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    emoji: "🤝",
    desc: "Flagged for financial aid",
  },
};

export const PAYMENT_LABELS: Record<PaymentCapacity, string> = {
  "1k-3k": "₦1,000 – ₦3,000",
  "3k-5k": "₦3,000 – ₦5,000",
  "5k-10k": "₦5,000 – ₦10,000",
  "10k_plus": "₦10,000+",
  sponsorship: "I need sponsorship",
};

export const OPEN_TO_PAID_LABELS: Record<OpenToPaid, string> = {
  yes: "Yes",
  no: "No",
  maybe: "Maybe",
};

export const CLASS_VIBE_LABELS: Record<ClassVibe, string> = {
  love_it: "I love it",
  wont_keep_up: "I won't keep up to it",
};

export function scoreColor(score: number): string {
  if (score >= 70) return "text-green-400";
  if (score >= 45) return "text-yellow-400";
  return "text-[#7a7270]";
}
