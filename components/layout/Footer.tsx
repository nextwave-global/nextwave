"use client";

import { Mail, MapPin, ArrowUp, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SocialIconsRow } from "@/components/ui/SocialIcons";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSectionScroll = (id: string) => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0a0a0a] text-[#8e8e8e] border-t border-white/10 pt-14 pb-8 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/5">
          {/* Brand & Mission (Col 1: Span 5) */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-block text-xl md:text-2xl font-bold uppercase tracking-tight text-white hover:opacity-90 transition-opacity"
            >
              Nextwave <span className="text-[#c9a84c]">Global</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[#8e8e8e]">
              Equipping students with the knowledge, skills, and mindset to
              thrive academically and professionally.
            </p>
            <p className="text-xs uppercase tracking-widest text-[#c9a84c] font-semibold">
              Learn. Earn. Lead.
            </p>
            <div className="pt-2">
              <SocialIconsRow size={38} iconSize={16} />
            </div>
          </div>

          {/* Quick Navigation (Col 2: Span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleSectionScroll("about")}
                  className="hover:text-[#c9a84c] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSectionScroll("programs")}
                  className="hover:text-[#c9a84c] transition-colors"
                >
                  Programs &amp; Tracks
                </button>
              </li>
              <li>
                <Link
                  href="/academy"
                  className="hover:text-[#c9a84c] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Academy</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
                    Waitlist
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="hover:text-[#c9a84c] transition-colors"
                >
                  Resource Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (Col 3: Span 4) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                <a
                  href="mailto:nextwaveglobalinfo@gmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  nextwaveglobalinfo@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                <span>Virtual &amp; Physical Hubs Worldwide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Admin Portal & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-[#636363]">
          {/* Left: Copyright & Admin Portal */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2">
            <span>
              © {new Date().getFullYear()} Nextwave Global. All rights reserved.
            </span>
            <span className="hidden sm:inline text-white/10">•</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide text-[#8e8e8e] hover:text-[#c9a84c] bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-[#c9a84c]/20 transition-all duration-200"
            >
              <Lock className="w-3 h-3 text-[#c9a84c]/80" />
              <span>Admin Page</span>
            </Link>
          </div>

          {/* Right: Scroll to top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2 uppercase tracking-widest text-[#8e8e8e] hover:text-[#c9a84c] transition-colors"
            aria-label="Scroll to top"
          >
            <span>Back to top</span>
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-[#c9a84c]/40 group-hover:bg-[#c9a84c]/10 transition-colors">
              <ArrowUp className="w-3.5 h-3.5 text-white/70 group-hover:text-[#c9a84c] transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
