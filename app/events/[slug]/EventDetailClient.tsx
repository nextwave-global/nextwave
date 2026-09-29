"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Loader2,
  CheckCircle,
  Radio,
  MessageCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { EventCountdown } from "@/components/ui/EventCountdown";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { AddToCalendar } from "@/components/ui/AddToCalendar";
import { FlyerGallery } from "@/components/ui/FlyerGallery";
import { Speakers } from "@/components/ui/Speakers";
import type { DbEvent } from "@/types/db";
import {
  computedStatus,
  formatEventDate,
  formatEventRange,
  isRegistrationOpen,
  statusLabel,
  statusColor,
} from "@/lib/events";

export default function EventDetailClient({ event }: { event: DbEvent }) {
  const status = computedStatus(event);
  const regOpen = isRegistrationOpen(event);
  const seatsLeft = Math.max(0, event.capacity - event.registered);

  // Build flyer list: use flyers gallery, fall back to single flyer_url
  const flyers = (() => {
    if (event.flyers && event.flyers.length > 0) return event.flyers;
    const single = event.flyer_url || event.image;
    return single ? [single] : [];
  })();

  const speakers = event.speakers_data ?? [];

  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [submit, setSubmit] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmit("loading");
    setMessage("");
    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId: event.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setSubmit("success");
      setMessage(data.message || "You're registered! Check your email.");
      setForm({ fullName: "", email: "", phone: "" });
    } catch (err) {
      setSubmit("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] overflow-x-hidden">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 md:pt-28 pb-16">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-[#b8b0a8] hover:text-[#c9a84c] transition text-sm font-medium mb-6 touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4" /> All events
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: flyers + details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {flyers.length > 0 && (
              <div className="relative">
                <FlyerGallery images={flyers} alt={event.title} />
                <div className="absolute top-3 left-3 z-10">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${statusColor(status)} backdrop-blur-sm bg-black/40`}
                  >
                    {status === "live" && (
                      <Radio className="w-2.5 h-2.5 animate-pulse" />
                    )}
                    {statusLabel(status)}
                  </span>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="bg-[#c9a84c]/10 text-[#c9a84c] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {event.category}
                </span>
                {event.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#1a1a1a] text-[#7a7270] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#333333]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {event.title}
              </h1>
              {event.tagline && (
                <p className="text-[#c9a84c] font-medium text-base mb-3">
                  {event.tagline}
                </p>
              )}
              <p className="text-[#b8b0a8] leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Speakers */}
            {speakers.length > 0 && <Speakers speakers={speakers} />}

            {/* Details grid */}
            <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-5 grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#7a7270] font-semibold">
                    Date
                  </p>
                  <p className="text-sm text-white">
                    {formatEventDate(
                      event.starts_at,
                      event.timezone ?? undefined,
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#7a7270] font-semibold">
                    Time
                  </p>
                  <p className="text-sm text-white">
                    {formatEventRange(
                      event.starts_at,
                      event.ends_at,
                      event.timezone ?? undefined,
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#7a7270] font-semibold">
                    Venue
                  </p>
                  <p className="text-sm text-white">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[#c9a84c] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#7a7270] font-semibold">
                    Capacity
                  </p>
                  <p className="text-sm text-white">
                    {seatsLeft > 0
                      ? `${seatsLeft} of ${event.capacity} seats left`
                      : "Waitlist only"}
                  </p>
                </div>
              </div>
            </div>

            {event.starts_at && status === "upcoming" && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#7a7270] font-semibold mb-2">
                  Starts in
                </p>
                <EventCountdown target={event.starts_at} />
              </div>
            )}

            <div className="space-y-3">
              {status !== "past" && <AddToCalendar event={event} />}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#7a7270] font-semibold mb-2">
                  Share this event
                </p>
                <ShareButtons event={event} />
              </div>
            </div>
          </motion.div>

          {/* Right: registration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 lg:sticky lg:top-24 self-start"
          >
            <div className="bg-[#1a1a1a] border border-[#333333] rounded-2xl p-6">
              {submit === "success" ? (
                <div className="text-center py-6">
                  <div className="bg-[#c9a84c]/10 p-4 rounded-full inline-flex mb-4 border border-[#c9a84c]/20">
                    <CheckCircle className="w-10 h-10 text-[#c9a84c]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    You&apos;re in! 🎉
                  </h3>
                  <p className="text-sm text-[#b8b0a8] mb-6">{message}</p>
                  {event.whatsapp_url && (
                    <a
                      href={event.whatsapp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-full text-sm transition-all touch-manipulation"
                    >
                      <MessageCircle className="w-4 h-4" /> Join WhatsApp
                    </a>
                  )}
                </div>
              ) : !regOpen ? (
                <div className="text-center py-6">
                  <Users className="w-10 h-10 text-[#7a7270] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {status === "past" ? "Event Ended" : "Registration Closed"}
                  </h3>
                  <p className="text-sm text-[#b8b0a8] mb-6">
                    {status === "past"
                      ? "Browse other upcoming events."
                      : "Registration is not currently open."}
                  </p>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-full text-sm transition-all touch-manipulation"
                  >
                    All Events
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-green-500/20 text-green-400 border-green-500/30">
                      <Sparkles className="w-2.5 h-2.5" /> Open for registration
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Register Now
                  </h3>
                  <p className="text-sm text-[#7a7270] mb-6">
                    Free and takes less than a minute.
                  </p>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#b8b0a8] mb-1.5 uppercase tracking-wider">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={form.fullName}
                        onChange={onChange}
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
                        onChange={onChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white placeholder:text-[#7a7270] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#b8b0a8] mb-1.5 uppercase tracking-wider">
                        WhatsApp{" "}
                        <span className="text-[#7a7270] text-[10px] normal-case">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={onChange}
                        placeholder="+234 800 000 0000"
                        className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white placeholder:text-[#7a7270] text-sm"
                      />
                    </div>
                    {submit === "error" && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                        {message}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={submit === "loading"}
                      className="w-full py-4 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 touch-manipulation active:scale-95"
                    >
                      {submit === "loading" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>Complete Registration</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
