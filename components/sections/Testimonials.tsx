"use client";

import { motion } from "framer-motion";
import { Quote, Star, Sparkles } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-16 md:py-24 px-4 sm:px-6 bg-[#0d0d0d] relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest bg-[#c9a84c]/10 px-4 py-2 rounded-full mb-4 border border-[#c9a84c]/20">
            <Sparkles className="w-4 h-4" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
            What Students Are <span className="text-[#c9a84c]">Saying</span>
          </h2>
          <p className="text-[#7a7270] max-w-2xl mx-auto text-sm md:text-base">
            Real stories from students who learned, earned, and led with us.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
              className="relative bg-[#1a1a1a] border border-[#333333] rounded-2xl p-6 hover:border-[#c9a84c]/40 hover:shadow-lg hover:shadow-[#c9a84c]/5 transition-all group"
            >
              {/* Quote mark */}
              <Quote className="w-8 h-8 text-[#c9a84c]/20 absolute top-5 right-5" />

              {/* Rating */}
              {t.rating && (
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5 text-[#c9a84c] fill-[#c9a84c]"
                    />
                  ))}
                </div>
              )}

              {/* Quote */}
              <p className="text-[#b8b0a8] text-sm leading-relaxed mb-5 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Divider */}
              <div className="border-t border-[#333333] pt-4 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                  <span className="text-[#c9a84c] font-bold text-xs">
                    {initials(t.name)}
                  </span>
                </div>

                {/* Meta */}
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm leading-tight truncate">
                    {t.name}
                  </p>
                  <p className="text-[#7a7270] text-xs leading-tight truncate">
                    {t.role}
                  </p>
                </div>
              </div>

              {/* Event tag */}
              {t.event && (
                <div className="absolute top-5 left-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c9a84c]/70">
                    {t.event}
                  </span>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
