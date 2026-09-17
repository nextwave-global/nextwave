"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  TrendingUp,
  Crown,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  Mail,
  Phone,
  User,
  PenTool,
  Video,
  Palette,
  Share2,
  Rocket,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
    title: "Copywriting & Lead Generation",
    desc: "Write copy that converts and build systems that bring in qualified leads.",
    icon: PenTool,
  },
  {
    title: "Mobile Video Editing",
    desc: "Shoot, cut, and publish scroll-stopping videos entirely from your phone.",
    icon: Video,
  },
  {
    title: "Brand Designing",
    desc: "Create logos, visuals, and brand identities that stand out.",
    icon: Palette,
  },
  {
    title: "Social Media Management",
    desc: "Grow, schedule, and monetize social accounts for brands and clients.",
    icon: Share2,
  },
];
const INTERESTS = [
  "Copywriting & Lead Generation",
  "Mobile Video Editing",
  "Brand Designing",
  "Social Media Management",
  "Not sure yet",
];

export default function AcademyClient() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    interest: "Not sure yet",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/academy/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
      setMessage(data.message || "You're on the list!");
      setForm({ fullName: "", email: "", phone: "", interest: "Not sure yet" });
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Failed to join. Try again.",
      );
    }
  };

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
            className="inline-flex items-center gap-2 bg-[#c9a84c]/10 text-[#c9a84c] px-4 py-2 rounded-full border border-[#c9a84c]/20 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              A New Chapter
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
              Coming Soon
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[#b8b0a8] mb-10 max-w-2xl mx-auto"
          >
            We&apos;re evolving from events into a full academy. Join the
            waitlist to be the first to know when doors open.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#7a7270]"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#c9a84c]" />
              Free early access
            </span>
            <span className="w-px h-4 bg-[#333333]" />
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#c9a84c]" />
              Limited seats
            </span>
            <span className="w-px h-4 bg-[#333333]" />
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#c9a84c]" />
              Email + WhatsApp updates
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
              Four focused tracks — pick the one that fits you best.
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
            className="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-6 md:p-8 lg:sticky lg:top-24"
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 text-[#c9a84c] px-3 py-1.5 rounded-full border border-[#c9a84c]/20 mb-3">
                <Rocket className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Join the Waitlist
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Get Early Access
              </h3>
              <p className="text-sm text-[#7a7270]">
                Drop your details and we&apos;ll notify you first when the
                academy launches.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="bg-[#c9a84c]/10 p-4 rounded-full inline-flex mb-4 border border-[#c9a84c]/20">
                    <CheckCircle className="w-10 h-10 text-[#c9a84c]" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    You&apos;re on the list! 🎉
                  </h4>
                  <p className="text-sm text-[#b8b0a8] mb-6">{message}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-xs text-[#c9a84c] hover:text-[#a8873a] font-semibold transition-colors"
                  >
                    Add another person →
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[#b8b0a8] mb-1.5 uppercase tracking-wider">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270]"
                      />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full pl-9 pr-3 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white placeholder:text-[#7a7270] text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#b8b0a8] mb-1.5 uppercase tracking-wider">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270]"
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white placeholder:text-[#7a7270] text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#b8b0a8] mb-1.5 uppercase tracking-wider">
                      WhatsApp Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270]"
                      />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+234 800 000 0000"
                        className="w-full pl-9 pr-3 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white placeholder:text-[#7a7270] text-sm"
                      />
                    </div>
                    <p className="text-[10px] text-[#7a7270] mt-1.5">
                      Include your country code (e.g. +234, +1, +44)
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#b8b0a8] mb-1.5 uppercase tracking-wider">
                      I&apos;m most interested in
                    </label>
                    <select
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      className="w-full px-3 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white text-sm"
                    >
                      {INTERESTS.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                  {status === "error" && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                      {message}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-4 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 touch-manipulation active:scale-95"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join the Waitlist
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-[#7a7270] text-center">
                    We&apos;ll only use your info to contact you about the
                    academy. No spam.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
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
