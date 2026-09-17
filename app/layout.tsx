import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    default: "NextWave Global - Learn, Earn, Lead",
    template: "%s | NextWave Global",
  },
  description:
    "Empowering students through events, mentorship, and career development.",
  keywords: [
    "NextWave Global",
    "student empowerment",
    "career development",
    "mentorship",
    "academy",
  ],
  openGraph: {
    title: "NextWave Global - Learn, Earn, Lead",
    description:
      "Empowering students through events, mentorship, and career development",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "NextWave Global",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextWave Global - Learn, Earn, Lead",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  category: "education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
