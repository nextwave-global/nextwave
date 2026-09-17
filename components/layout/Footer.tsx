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
    <footer className="bg-[#0d0d0d] border-t border-[#333333] pt-10 sm:pt-12 pb-6 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top grid: stacks on mobile, 2 cols from md */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-12">
          {/* Brand block */}
          <div className="text-left">
            <Link href="/" className="inline-block">
              <h3 className="text-xl md:text-2xl font-bold mb-3 uppercase tracking-tighter text-white">
                Nextwave <span className="text-[#c9a84c]">Global</span>
              </h3>
            </Link>
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
                className="hover:scale-110 transition-transform touch-manipulation"
              />
              <SocialIcon
                url="https://t.me/+NdjMKKMF6rNjNjBk"
                bgColor="#0088CC"
                fgColor="#FFFFFF"
                style={{ height: 40, width: 40 }}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform touch-manipulation"
              />
              <SocialIcon
                url="https://www.instagram.com/next_waveglobal/"
                bgColor="#E4405F"
                fgColor="#FFFFFF"
                style={{ height: 40, width: 40 }}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform touch-manipulation"
              />
            </div>
          </div>

          {/* Connect block */}
          <div className="text-left">
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-[#c9a84c]">
              Connect With Us
            </h4>
            <ul className="space-y-3 text-[#7a7270] text-sm font-medium">
              <li>
                <a
                  href="mailto:nextwaveglobalinfo@gmail.com"
                  className="flex items-start gap-3 hover:text-[#c9a84c] transition group"
                >
                  <Mail
                    size={16}
                    className="text-[#c9a84c] shrink-0 mt-0.5"
                  />
                  <span className="break-all group-hover:text-[#c9a84c]">
                    nextwaveglobalinfo@gmail.com
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  size={16}
                  className="text-[#c9a84c] shrink-0 mt-0.5"
                />
                <span>Virtual &amp; Physical Events</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles
                  size={16}
                  className="text-[#c9a84c] shrink-0 mt-0.5"
                />
                <span className="text-[#c9a84c] font-bold italic text-base leading-tight">
                  Learn. Earn. Lead.
                </span>
              </li>
              <li>
                <Link
                  href="/academy"
                  className="flex items-start gap-3 hover:text-[#c9a84c] transition group"
                >
                  <GraduationCap
                    size={16}
                    className="text-[#c9a84c] shrink-0 mt-0.5"
                  />
                  <span className="group-hover:text-[#c9a84c]">
                    Join the Academy Waitlist
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="flex items-start gap-3 hover:text-[#c9a84c] transition group"
                >
                  <BookOpen
                    size={16}
                    className="text-[#c9a84c] shrink-0 mt-0.5"
                  />
                  <span className="group-hover:text-[#c9a84c]">
                    Visit Our Library
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#333333] flex flex-col items-center gap-4 text-xs font-semibold text-[#7a7270] uppercase tracking-widest text-center">
          <p className="leading-relaxed">
            © {new Date().getFullYear()} Nextwave Global. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-[#c9a84c] transition touch-manipulation whitespace-nowrap"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("programs")}
              className="hover:text-[#c9a84c] transition touch-manipulation whitespace-nowrap"
            >
              Programs
            </button>
            <Link
              href="/academy"
              className="hover:text-[#c9a84c] transition touch-manipulation whitespace-nowrap"
            >
              Academy
            </Link>
            <Link
              href="/library"
              className="hover:text-[#c9a84c] transition touch-manipulation whitespace-nowrap"
            >
              Library
            </Link>
            <button
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="p-2 bg-[#1a1a1a] hover:bg-[#c9a84c] rounded-full transition-colors touch-manipulation shrink-0"
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
