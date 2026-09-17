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
  return (
    <footer className="bg-[#0d0d0d] border-t border-[#262626] pt-12 pb-8 px-5 sm:px-8 text-neutral-300">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          {/* Brand Column */}
          <div className="md:col-span-6 space-y-4">
            <h3 className="text-2xl font-bold tracking-tight text-white uppercase">
              Nextwave <span className="text-[#c9a84c]">Global</span>
            </h3>
            <p className="text-sm text-[#8c8582] leading-relaxed max-w-sm">
              Equipping students with the knowledge, skills, and mindset to
              thrive academically and professionally.
            </p>

            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/10 px-3 py-1 text-xs font-semibold tracking-wider text-[#c9a84c]">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>LEARN. EARN. LEAD.</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <div className="rounded-full p-0.5 border border-[#0077b5]/30 bg-[#0077b5]/10 hover:bg-[#0077b5]/25 hover:border-[#0077b5] transition-all hover:scale-105">
                <SocialIcon
                  url="https://www.linkedin.com/company/nextwave-g/"
                  bgColor="#0077b5"
                  fgColor="#ffffff"
                  style={{ height: 34, width: 34 }}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>

              <div className="rounded-full p-0.5 border border-[#0088cc]/30 bg-[#0088cc]/10 hover:bg-[#0088cc]/25 hover:border-[#0088cc] transition-all hover:scale-105">
                <SocialIcon
                  url="https://t.me/+NdjMKKMF6rNjNjBk"
                  bgColor="#0088cc"
                  fgColor="#ffffff"
                  style={{ height: 34, width: 34 }}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>

              <div className="rounded-full p-0.5 border border-[#e4405f]/30 bg-[#e4405f]/10 hover:bg-[#e4405f]/25 hover:border-[#e4405f] transition-all hover:scale-105">
                <SocialIcon
                  url="https://www.instagram.com/next_waveglobal/"
                  bgColor="#e4405f"
                  fgColor="#ffffff"
                  style={{ height: 34, width: 34 }}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-[#8c8582]">
              <li>
                <Link
                  href="/academy"
                  className="flex items-center gap-2 hover:text-[#c9a84c] transition-colors py-1"
                >
                  <GraduationCap className="w-4 h-4 text-[#c9a84c] shrink-0" />
                  <span>Academy Waitlist</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="flex items-center gap-2 hover:text-[#c9a84c] transition-colors py-1"
                >
                  <BookOpen className="w-4 h-4 text-[#c9a84c] shrink-0" />
                  <span>Digital Library</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#c9a84c]">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-[#8c8582]">
              <li>
                <a
                  href="mailto:nextwaveglobalinfo@gmail.com"
                  className="flex items-start gap-2 hover:text-[#c9a84c] transition-colors py-1"
                >
                  <Mail className="w-4 h-4 text-[#c9a84c] mt-0.5 shrink-0" />
                  <span className="break-all">
                    nextwaveglobalinfo@gmail.com
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-2 py-1">
                <MapPin className="w-4 h-4 text-[#c9a84c] shrink-0" />
                <span>Virtual &amp; Physical Events</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#262626] pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-[#6b6462] tracking-wider text-center sm:text-left">
            © {new Date().getFullYear()} Nextwave Global. All Rights Reserved.
          </p>

          <div className="flex items-center justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-10 h-10 inline-flex items-center justify-center bg-[#171717] hover:bg-[#c9a84c] text-neutral-400 hover:text-black rounded-full transition-all border border-[#333333] cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
