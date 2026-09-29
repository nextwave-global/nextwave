"use client";

import {
  Mail,
  MapPin,
  ArrowUp,
  Sparkles,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { SocialIconsRow } from "@/components/ui/SocialIcons";

export default function Footer() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0d0d0d] border-t border-[#333333] pt-10 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top: two columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
          {/* Brand + socials */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 uppercase tracking-tighter text-white">
              Nextwave <span className="text-[#c9a84c]">Global</span>
            </h3>
            <p className="text-[#7a7270] max-w-sm mb-5 leading-relaxed text-sm">
              Equipping students with the knowledge, skills, and mindset to
              thrive academically and professionally.
            </p>
            <SocialIconsRow size={40} iconSize={16} />
          </div>

          {/* Connect list */}
          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-[#c9a84c]">
              Connect With Us
            </h4>
            <ul className="space-y-3 text-sm text-[#7a7270]">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                <a
                  href="mailto:nextwaveglobalinfo@gmail.com"
                  className="hover:text-[#c9a84c] transition break-all"
                >
                  nextwaveglobalinfo@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                <span>Virtual &amp; Physical Events</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                <span className="text-[#c9a84c] font-bold italic text-base leading-none">
                  Learn. Earn. Lead.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <GraduationCap className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                <Link
                  href="/academy"
                  className="hover:text-[#c9a84c] transition"
                >
                  Join the Academy Waitlist
                </Link>
              </li>
              <li className="flex items-start gap-3">
                <BookOpen className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                <Link
                  href="/library"
                  className="hover:text-[#c9a84c] transition"
                >
                  Visit Our Library
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#333333] pt-6">
          {/* Bottom bar: stacked on mobile, single row on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Copyright */}
            <p className="text-[10px] sm:text-xs text-[#7a7270] uppercase tracking-widest text-center sm:text-left order-2 sm:order-1">
              © {new Date().getFullYear()} Nextwave Global. All Rights
              Reserved.
            </p>

            {/* Links + scroll-to-top */}
            <div className="order-1 sm:order-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[10px] sm:text-xs font-semibold text-[#7a7270] uppercase tracking-widest">
              <button
                onClick={() => scrollToSection("about")}
                className="hover:text-[#c9a84c] transition whitespace-nowrap"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("programs")}
                className="hover:text-[#c9a84c] transition whitespace-nowrap"
              >
                Programs
              </button>
              <Link
                href="/academy"
                className="hover:text-[#c9a84c] transition whitespace-nowrap"
              >
                Academy
              </Link>
              <Link
                href="/library"
                className="hover:text-[#c9a84c] transition whitespace-nowrap"
              >
                Library
              </Link>
              <button
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="p-2 bg-[#1a1a1a] hover:bg-[#c9a84c] rounded-full transition-colors shrink-0"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-3.5 h-3.5 text-[#b8b0a8]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
