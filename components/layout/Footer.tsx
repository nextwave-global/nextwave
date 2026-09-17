"use client";

import { SocialIcon } from "react-social-icons";
import {
  Mail,
  MapPin,
  ArrowUp,
  Sparkles,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0d0d0d] border-t border-[#333333] py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Two columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-10">
          {/* Column 1: Brand + socials */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 uppercase tracking-tighter text-white">
              Nextwave <span className="text-[#c9a84c]">Global</span>
            </h3>
            <p className="text-[#7a7270] max-w-sm mb-5 leading-relaxed text-sm">
              Equipping students with the knowledge, skills, and mindset to
              thrive academically and professionally.
            </p>
            <div className="flex gap-3">
              <SocialIcon
                url="https://www.linkedin.com/company/nextwave-g/"
                bgColor="#0077B5"
                fgColor="#FFFFFF"
                style={{ height: 40, width: 40 }}
                target="_blank"
                rel="noopener noreferrer"
              />
              <SocialIcon
                url="https://t.me/+NdjMKKMF6rNjNjBk"
                bgColor="#0088CC"
                fgColor="#FFFFFF"
                style={{ height: 40, width: 40 }}
                target="_blank"
                rel="noopener noreferrer"
              />
              <SocialIcon
                url="https://www.instagram.com/next_waveglobal/"
                bgColor="#E4405F"
                fgColor="#FFFFFF"
                style={{ height: 40, width: 40 }}
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
          </div>

          {/* Column 2: Connect */}
          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-[#c9a84c]">
              Connect With Us
            </h4>
            <ul className="space-y-3 text-sm text-[#7a7270]">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#c9a84c] shrink-0" />
                <a
                  href="mailto:nextwaveglobalinfo@gmail.com"
                  className="hover:text-[#c9a84c] transition break-all"
                >
                  nextwaveglobalinfo@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#c9a84c] shrink-0" />
                <span>Virtual &amp; Physical Events</span>
              </li>
              <li className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#c9a84c] shrink-0" />
                <span className="text-[#c9a84c] font-bold italic text-base">
                  Learn. Earn. Lead.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-[#c9a84c] shrink-0" />
                <Link
                  href="/academy"
                  className="hover:text-[#c9a84c] transition"
                >
                  Join the Academy Waitlist
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-[#c9a84c] shrink-0" />
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

        {/* Bottom bar */}
        <div className="border-t border-[#333333] pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-[#7a7270] uppercase tracking-widest text-center sm:text-left">
            © {new Date().getFullYear()} Nextwave Global. All Rights Reserved.
          </p>

          <div className="flex items-center justify-center sm:justify-end gap-5 text-xs font-semibold text-[#7a7270] uppercase tracking-widest">
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-[#c9a84c] transition"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("programs")}
              className="hover:text-[#c9a84c] transition"
            >
              Programs
            </button>
            <Link
              href="/academy"
              className="hover:text-[#c9a84c] transition"
            >
              Academy
            </Link>
            <Link
              href="/library"
              className="hover:text-[#c9a84c] transition"
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
              <ArrowUp className="w-4 h-4 text-[#b8b0a8]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
