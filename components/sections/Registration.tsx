"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Users,
  MessageCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { UPCOMING_EVENTS, WHATSAPP_COMMUNITY_URL } from "@/data/events";
import { Event as NWEvent } from "@/types/events";

const upcoming = UPCOMING_EVENTS[0];

export default function Registration() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upcoming) return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId: upcoming.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setStatus("success");
      setMessage(data.message || "You're registered! Check your email.");
      setForm({ fullName: "", email: "", phone: "" });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  // Fallback if no upcoming events
  if (!upcoming) {
    return (
      <section
        id="register"
        className="py-12 md:py-24 px-4 sm:px-6 bg-[#0d0d0d]"
      >
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest bg-[#c9a84c]/10 px-4 py-2 rounded-full mb-4 border border-[#c9a84c]/20">
            <Sparkles size={14} />
            <span>Events</span>
          </div>
          <h2 className="text-2xl md:text-5xl font-bold mb-4 text-white">
            No Active <span className="text-[#c9a84c]">Events</span>
          </h2>
          <p className="text-[#7a7270] max-w-2xl mx-auto text-sm md:text-base">
            All events are complete. Check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="register"
      className="py-12 md:py-24 px-4 sm:px-6 bg-[#0d0d0d] relative overflow-hidden"
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest bg-[#c9a84c]/10 px-4 py-2 rounded-full mb-4 border border-[#c9a84c]/20">
            <Sparkles size={14} />
            <span>Upcoming Event</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white">
            Register <span className="text-[#c9a84c]">Now</span>
          </h2>
          <p className="text-[#7a7270] max-w-2xl mx-auto text-sm md:text-base">
            Secure your spot for our next live event.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Flyer + details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#333333] overflow-hidden hover:border-[#c9a84c]/50 transition-all"
          >
            {upcoming.image && (
              <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] bg-[#0d0d0d]">
                <Image
                  src={upcoming.image}
                  alt={upcoming.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute top-3 left-3 bg-green-500 text-[#0d0d0d] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0d0d0d] animate-pulse" />
                  Live Soon
                </div>
                <div className="absolute top-3 right-3 bg-[#c9a84c] text-[#0d0d0d] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Free
                </div>
              </div>
            )}

            <div className="p-5 md:p-6">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {upcoming.title}
              </h3>
              <p className="text-[#b8b0a8] text-sm leading-relaxed mb-5">
                {upcoming.description}
              </p>

              <div className="space-y-2.5 text-sm border-t border-[#333333] pt-4">
                <div className="flex items-center gap-3 text-[#b8b0a8]">
                  <Calendar size={16} className="text-[#c9a84c] shrink-0" />
                  <span>{upcoming.date}</span>
                </div>
                <div className="flex items-center gap-3 text-[#b8b0a8]">
                  <Clock size={16} className="text-[#c9a84c] shrink-0" />
                  <span>{upcoming.time}</span>
                </div>
                <div className="flex items-center gap-3 text-[#b8b0a8]">
                  <MapPin size={16} className="text-[#c9a84c] shrink-0" />
                  <span>{upcoming.venue}</span>
                </div>
                <div className="flex items-center gap-3 text-[#b8b0a8]">
                  <Users size={16} className="text-[#c9a84c] shrink-0" />
                  <span>Limited capacity — reserve early</span>
                </div>
              </div>

              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0d0d0d] hover:bg-[#2a2a2a] border border-[#333333] hover:border-[#c9a84c] text-[#c9a84c] font-semibold rounded-xl text-sm transition-all touch-manipulation active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                Join the WhatsApp Community
              </a>
            </div>
          </motion.div>

          {/* Registration form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#333333] p-6 md:p-8 lg:sticky lg:top-24"
          >
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="bg-[#c9a84c]/10 p-4 rounded-full inline-flex mb-4 border border-[#c9a84c]/20">
                  <CheckCircle className="w-10 h-10 text-[#c9a84c]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  You&apos;re registered! 🎉
                </h4>
                <p className="text-sm text-[#b8b0a8] mb-6">{message}</p>
                <a
                  href={WHATSAPP_COMMUNITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-full text-sm transition-all touch-manipulation"
                >
                  <MessageCircle className="w-4 h-4" />
                  Join WhatsApp Community
                </a>
              </div>
            ) : (
              <>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Reserve Your Spot
                </h3>
                <p className="text-sm text-[#7a7270] mb-6">
                  It&apos;s free. It takes 20 seconds.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#b8b0a8] mb-1.5 uppercase tracking-wider">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white placeholder:text-[#7a7270] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#b8b0a8] mb-1.5 uppercase tracking-wider">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white placeholder:text-[#7a7270] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#b8b0a8] mb-1.5 uppercase tracking-wider">
                      WhatsApp Number{" "}
                      <span className="text-[#7a7270] text-[10px] normal-case tracking-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                      className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white placeholder:text-[#7a7270] text-sm"
                    />
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
                        Registering...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-[#7a7270] text-center">
                    By registering, you agree to our Terms and Privacy Policy.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
