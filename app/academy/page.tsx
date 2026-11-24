import type { Metadata } from "next";
import AcademyClient from "./AcademyClient";

export const metadata: Metadata = {
  title: "NextWave Academy — Learn. Earn. Lead.",
  description:
    "The NextWave Academy is live. Start learning tech, business, leadership, and personal growth today — no waitlist.",
  keywords: [
    "NextWave Academy",
    "online academy",
    "student training",
    "tech skills",
    "leadership training",
  ],
  openGraph: {
    title: "NextWave Academy — Learn. Earn. Lead.",
    description: "The academy is live. Start learning today — no waitlist.",
    url: "/academy",
    images: [{ url: "/og-academy.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextWave Academy — Learn. Earn. Lead.",
    description: "The academy is live. Start learning today — no waitlist.",
    images: ["/og-academy.jpg"],
  },
  alternates: { canonical: "/academy" },
};

export default function AcademyPage() {
  return <AcademyClient />;
}
