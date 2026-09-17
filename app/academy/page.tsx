import type { Metadata } from "next";
import AcademyClient from "./AcademyClient";

export const metadata: Metadata = {
  title: "NextWave Academy - Coming Soon",
  description:
    "NextWave Global is pivoting into an academy. Join the waitlist to learn, earn, and lead with hands-on training.",
  keywords: [
    "NextWave Academy",
    "online academy",
    "student training",
    "tech skills",
    "leadership training",
  ],
  openGraph: {
    title: "NextWave Academy - Coming Soon",
    description: "Join the waitlist. Learn. Earn. Lead.",
    url: "/academy",
    images: [{ url: "/og-academy.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextWave Academy - Coming Soon",
    description: "Join the waitlist. Learn. Earn. Lead.",
    images: ["/og-academy.jpg"],
  },
  alternates: { canonical: "/academy" },
};

export default function AcademyPage() {
  return <AcademyClient />;
}
