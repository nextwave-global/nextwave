"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  TrendingUp,
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  GraduationCap,
  Rocket,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ACADEMY_URL =
  process.env.NEXT_PUBLIC_ACADEMY_URL ??
  "https://nextwave-academy-nine.vercel.app";

const PILLARS = [
  {
    title: "Learn",
    desc: "Structured courses in tech, business, and personal development.",
    icon: BookOpen,
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    title: "Earn",
    desc: "Turn your skills into income through freelancing, projects, and jobs.",
    icon: TrendingUp,
    color: "from-green-500/20 to-green-600/10",
  },
  {
    title: "Lead",
    desc: "Develop the leadership presence to influence teams and communities.",
    icon: Crown,
    color: "from-[#c9a84c]/20 to-[#c9a84c]/10",
  },
];
const TRACKS = [
  {
    title: "Tech & Product",
    desc: "Web dev, product thinking, AI tools, and shipping real projects.",
    icon: Rocket,
  },
  {
    title: "Business & Sales",
    desc: "Negotiation, monetization, freelancing, and building offers.",
    icon: TrendingUp,
  },
  {
    title: "Leadership",
    desc: "Communication, influence, and leading teams with clarity.",
    icon: Crown,
  },
  {
    title: "Personal Growth",
    desc: "Productivity, discipline, mindset, and financial intelligence.",
    icon: GraduationCap,
  },
];

export default function AcademyClient() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] overflow-x-hidden">
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#c9a84c]/3 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-full border border-green-500/30 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">
              We&apos;re Live
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.05] mb-6 text-white"
          >
            NextWave <span className="text-[#c9a84c]">Academy</span>
            <br />
            <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#b8b0a8]">
              Now open
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[#b8b0a8] mb-8 max-w-2xl mx-auto"
          >
            We&apos;ve evolved from events into a full academy. No waitlist —
            head straight to the academy and start learning today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <a
              href={ACADEMY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-full transition-all hover:shadow-lg hover:shadow-[#c9a84c]/25 active:scale-95 touch-manipulation min-h-[48px]"
            >
              <GraduationCap className="w-5 h-5" />
              Go to the Academy
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#7a7270]"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#c9a84c]" />
              Live courses
            </span>
            <span className="w-px h-4 bg-[#333333]" />
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#c9a84c]" />
              Global community
            </span>
            <span className="w-px h-4 bg-[#333333]" />
            <span className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#c9a84c]" />
              Certificates on completion
            </span>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Our <span className="text-[#c9a84c]">Mission</span> Continues
            </h2>
            <p className="text-[#7a7270] max-w-2xl mx-auto text-sm md:text-base">
              The same three pillars now in a structured academy format.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {PILLARS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-[#0d0d0d] rounded-2xl p-6 md:p-8 border border-[#333333] hover:border-[#c9a84c] transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <item.icon className="w-7 h-7 text-[#c9a84c]" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                  {item.title}
                </h3>
                <p className="text-[#7a7270] leading-relaxed text-sm md:text-base">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Curriculum Preview</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What You&apos;ll <span className="text-[#c9a84c]">Master</span>
            </h2>
            <p className="text-[#7a7270] mb-8 text-sm md:text-base">
              Four focused tracks designed to take you from curious to capable.
            </p>
            <div className="space-y-4">
              {TRACKS.map((track, i) => (
                <motion.div
                  key={track.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-4 bg-[#1a1a1a] border border-[#333333] rounded-xl p-5 hover:border-[#c9a84c]/50 transition-all"
                >
                  <div className="w-11 h-11 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                    <track.icon className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{track.title}</h4>
                    <p className="text-sm text-[#7a7270]">{track.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1a1a1a] border border-[#c9a84c]/30 rounded-2xl p-6 md:p-8 lg:sticky lg:top-24"
          >
            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/30 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                We&apos;re Live
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              The Academy is open
            </h3>
            <p className="text-sm text-[#7a7270] mb-6">
              No waitlist. No forms. Head straight to the academy and start
              learning.
            </p>
            <a
              href={ACADEMY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation active:scale-95"
            >
              Go to the Academy
              <ArrowRight className="w-5 h-5" />
            </a>
            <ul className="mt-6 space-y-2 text-xs text-[#7a7270]">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#c9a84c]" />
                Live courses &amp; tracks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#c9a84c]" />
                Free early-access pricing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#c9a84c]" />
                Certificates on completion
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 bg-[#1a1a1a]">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            In the meantime, explore what we&apos;ve built
          </h3>
          <p className="text-[#7a7270] mb-8 text-sm md:text-base">
            Browse our free resource library or revisit past programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/library"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-full transition-all touch-manipulation"
            >
              <BookOpen className="w-5 h-5" />
              Visit Library
            </Link>
            <Link
              href="/#programs"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0d0d0d] hover:bg-[#2a2a2a] text-white font-bold rounded-full border border-[#333333] hover:border-[#c9a84c] transition-all touch-manipulation"
            >
              See Past Programs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
