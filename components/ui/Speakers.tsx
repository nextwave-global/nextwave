"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Globe, MessageCircle } from "lucide-react";
import {
  FaLinkedinIn,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import type { Speaker } from "@/types/db";

interface Props {
  speakers: Speaker[];
}

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
                        aria-label={`${s.name} on LinkedIn`}
                        className="p-1 text-[#7a7270] hover:text-[#0A66C2] transition-colors touch-manipulation"
                      >
                        <FaLinkedinIn className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {s.socials.x && (
                      <a
                        href={s.socials.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${s.name} on X`}
                        className="p-1 text-[#7a7270] hover:text-white transition-colors touch-manipulation"
                      >
                        <FaXTwitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {s.socials.whatsapp && (
                      <a
                        href={s.socials.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${s.name} on WhatsApp`}
                        className="p-1 text-[#7a7270] hover:text-[#25D366] transition-colors touch-manipulation"
                      >
                        <FaWhatsapp className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {s.socials.website && (
                      <a
                        href={s.socials.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${s.name} website`}
                        className="p-1 text-[#7a7270] hover:text-[#c9a84c] transition-colors touch-manipulation"
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
