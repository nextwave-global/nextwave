"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Globe, MessageCircle } from "lucide-react";
import type { Speaker } from "@/types/db";

interface Props {
  speakers: Speaker[];
}

// Inline brand SVGs (lucide removed all brand icons)
const XIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export function Speakers({ speakers }: Props) {
  if (!speakers || speakers.length === 0) return null;

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-[#7a7270] font-semibold mb-3">
        {speakers.length === 1 ? "Speaker" : `Speakers (${speakers.length})`}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {speakers.map((s, i) => (
          <motion.div
            key={s.name + i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="bg-[#1a1a1a] border border-[#333333] rounded-xl p-4 flex gap-3 hover:border-[#c9a84c]/40 transition-all"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#0d0d0d] border border-[#333333] shrink-0">
              {s.photo ? (
                <Image
                  src={s.photo}
                  alt={s.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-6 h-6 text-[#7a7270]" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-white text-sm leading-tight truncate">
                {s.name}
              </h4>
              {s.title && (
                <p className="text-[11px] text-[#c9a84c] font-medium mt-0.5 line-clamp-2">
                  {s.title}
                </p>
              )}
              {s.bio && (
                <p className="text-[11px] text-[#7a7270] mt-1.5 line-clamp-2 leading-relaxed">
                  {s.bio}
                </p>
              )}

              {s.socials &&
                (s.socials.linkedin ||
                  s.socials.x ||
                  s.socials.whatsapp ||
                  s.socials.website) && (
                  <div className="flex items-center gap-1.5 mt-2">
                    {s.socials.linkedin && (
                      <a
                        href={s.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#7a7270] hover:text-[#0A66C2] transition-colors touch-manipulation"
                        aria-label={`${s.name} on LinkedIn`}
                      >
                        <LinkedInIcon />
                      </a>
                    )}
                    {s.socials.x && (
                      <a
                        href={s.socials.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#7a7270] hover:text-white transition-colors touch-manipulation"
                        aria-label={`${s.name} on X`}
                      >
                        <XIcon />
                      </a>
                    )}
                    {s.socials.whatsapp && (
                      <a
                        href={s.socials.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#7a7270] hover:text-[#25D366] transition-colors touch-manipulation"
                        aria-label={`${s.name} on WhatsApp`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {s.socials.website && (
                      <a
                        href={s.socials.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#7a7270] hover:text-[#c9a84c] transition-colors touch-manipulation"
                        aria-label={`${s.name} website`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
