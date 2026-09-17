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
    <footer className="bg-[#0d0d0d] border-t border-[#333333] pt-12 pb-6 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
          <div>
            <Link href="/" className="inline-block">
              <h3 className="text-xl md:text-2xl font-bold mb-3 uppercase tracking-tighter text-white">
                Nextwave <span className="text-[#c9a84c]">Global</span>
              </h3>
            </Link>
            <p className="text-[#7a7270] max-w-sm mb-4 leading-relaxed text-sm">
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

          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-[#c9a84c]">
              Connect With Us
            </h4>
            <ul className="space-y-3 text-[#7a7270] text-sm font-medium">
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#c9a84c] shrink-0" />
                <a
                  href="mailto:nextwaveglobalinfo@gmail.com"
                  className="hover:text-[#c9a84c] transition break-all"
                >
                  nextwaveglobalinfo@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-[#c9a84c] shrink-0" />
                <span>Virtual & Physical Events</span>
              </li>
              <li className="flex items-center gap-3">
                <Sparkles size={16} className="text-[#c9a84c] shrink-0" />
                <span className="text-[#c9a84c] font-bold italic text-base">
                  Learn. Earn. Lead.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <GraduationCap size={16} className="text-[#c9a84c] shrink-0" />
                <Link
                  href="/academy"
                  className="hover:text-[#c9a84c] transition"
                >
                  Join the Academy Waitlist
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <BookOpen size={16} className="text-[#c9a84c] shrink-0" />
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

        <div className="pt-6 border-t border-[#333333] flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-semibold text-[#7a7270] uppercase tracking-widest text-center">
          <p>
            © {new Date().getFullYear()} Nextwave Global. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-[#c9a84c] transition touch-manipulation"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("programs")}
              className="hover:text-[#c9a84c] transition touch-manipulation"
            >
              Programs
            </button>
            <Link
              href="/academy"
              className="hover:text-[#c9a84c] transition touch-manipulation"
            >
              Academy
            </Link>
            <Link
              href="/library"
              className="hover:text-[#c9a84c] transition touch-manipulation"
            >
              Library
            </Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-2 bg-[#1a1a1a] hover:bg-[#c9a84c] rounded-full transition-colors touch-manipulation"
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
