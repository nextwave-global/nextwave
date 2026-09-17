"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, GraduationCap } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function Hero() {
  const [featured, setFeatured] = useState<{
    title: string;
    date: string;
    slug: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => {
        const events = d.events ?? [];
        const f =
          events.find((e: any) => e.is_featured) ??
          events.find((e: any) =>
            ["upcoming", "live"].includes(e.computed_status),
          );
        if (f) setFeatured({ title: f.title, date: f.date, slug: f.slug });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "NextWave Global",
            url: process.env.NEXT_PUBLIC_BASE_URL,
            logo: "/logo.png",
            sameAs: [
              "https://www.linkedin.com/company/nextwave-g/",
              "https://www.instagram.com/next_waveglobal/",
              "https://t.me/+NdjMKKMF6rNjNjBk",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              email: "nextwaveglobalinfo@gmail.com",
              contactType: "customer support",
            },
          }),
        }}
      />
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, #1a1a1a 0%, #0d0d0d 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#c9a84c]/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 py-12">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 bg-[#c9a84c]/10 text-[#c9a84c] px-4 py-2 rounded-full border border-[#c9a84c]/20 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Empowering Students Worldwide
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[1.05] mb-6"
          >
            <span className="text-white">LEARN.</span>
            <br className="sm:hidden" />
            <span className="text-[#c9a84c]">EARN.</span>
            <br className="sm:hidden" />
            <span className="text-white">LEAD.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-base sm:text-lg md:text-xl text-[#b8b0a8] mb-10 max-w-2xl mx-auto px-4"
          >
            NextWave Global empowers students to thrive beyond the classroom —
            and we&apos;re evolving into an academy.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap"
          >
            <Link
              href="/academy"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-full transition-all hover:shadow-lg hover:shadow-[#c9a84c]/25 active:scale-95 touch-manipulation min-h-[48px]"
            >
              <GraduationCap className="w-5 h-5" />
              Join the Academy
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-bold rounded-full transition-all border border-[#333333] hover:border-[#c9a84c] active:scale-95 touch-manipulation min-h-[48px]"
            >
              <BookOpen className="w-5 h-5 text-[#c9a84c]" />
              Visit Our Library
            </Link>
          </motion.div>
          {featured && (
            <motion.div variants={item} className="mt-6">
              <Link
                href={`/events/${featured.slug}`}
                className="inline-flex items-center gap-3 px-6 py-3 bg-transparent hover:bg-[#c9a84c]/10 text-[#c9a84c] font-semibold rounded-full border border-[#c9a84c]/40 hover:border-[#c9a84c] transition-all active:scale-95 touch-manipulation text-sm group"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="line-clamp-1">
                  {featured.title} — {featured.date}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}

          <motion.div
            variants={item}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#7a7270]"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Events
            </span>
            <span className="w-px h-4 bg-[#333333]" />
            <span>🎓 Free Certificates</span>
            <span className="w-px h-4 bg-[#333333]" />
            <span>🌍 Global Community</span>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
