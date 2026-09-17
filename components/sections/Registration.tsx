"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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
  Radio,
  ExternalLink,
} from "lucide-react";
import type { DbEvent } from "@/types/db";
import {
  computedStatus,
  formatEventDate,
  formatEventRange,
  isRegistrationOpen,
  statusLabel,
  statusColor,
} from "@/lib/events";
import { EventCountdown } from "@/components/ui/EventCountdown";
import { AddToCalendar } from "@/components/ui/AddToCalendar";
import { FlyerGallery } from "@/components/ui/FlyerGallery";
import { Speakers } from "@/components/ui/Speakers";

export default function Registration() {
  const [event, setEvent] = useState<DbEvent | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/events", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const events: DbEvent[] = d.events ?? [];
        const featured = events.find((e) => e.is_featured);
        const live = events.find((e) => computedStatus(e) === "live");
        const upcoming = events.find((e) => computedStatus(e) === "upcoming");
        setEvent(featured ?? live ?? upcoming ?? null);
      })
      .catch(console.error)
      .finally(() => setLoadingEvent(false));
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventId: event.id }),
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

  if (loadingEvent) {
    return (
      <section
        id="register"
        className="py-12 md:py-24 px-4 sm:px-6 bg-[#0d0d0d]"
      >
        <div className="max-w-6xl mx-auto flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c9a84c]" />
        </div>
      </section>
    );
  }

  if (!event) {
    return (
      <section
        id="register"
        className="py-12 md:py-24 px-4 sm:px-6 bg-[#0d0d0d]"
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest bg-[#c9a84c]/10 px-4 py-2 rounded-full mb-4 border border-[#c9a84c]/20">
            <Sparkles size={14} />
            <span>Events</span>
          </div>
          <h2 className="text-2xl md:text-5xl font-bold mb-4 text-white">
            No Active <span className="text-[#c9a84c]">Events</span>
          </h2>
          <p className="text-[#7a7270] max-w-2xl mx-auto text-sm md:text-base mb-6">
            Check back soon, or join the academy waitlist.
          </p>
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-full transition-all touch-manipulation"
          >
            Join Academy Waitlist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    );
  }

  const eStatus = computedStatus(event);
  const regOpen = isRegistrationOpen(event);
  const seatsLeft = Math.max(0, event.capacity - event.registered);
  const flyers = (() => {
    if (event.flyers && event.flyers.length > 0) return event.flyers;
    const single = event.flyer_url || event.image;
    return single ? [single] : [];
  })();

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
            {eStatus === "live" ? (
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <Sparkles size={14} />
            )}
            <span>{eStatus === "live" ? "Live Now" : "Featured Event"}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white">
            {eStatus === "live" ? "Join" : "Register"}{" "}
            <span className="text-[#c9a84c]">Now</span>
          </h2>
          <p className="text-[#7a7270] max-w-2xl mx-auto text-sm md:text-base">
            Secure your spot for our featured event.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#333333] overflow-hidden hover:border-[#c9a84c]/50 transition-all"
          >
            {flyers.length > 0 && (
              <div className="relative p-4 bg-[#0d0d0d]">
                <FlyerGallery images={flyers} alt={event.title} />
                <div className="absolute top-7 left-7 z-10">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${statusColor(eStatus)} backdrop-blur-sm bg-black/40`}
                  >
                    {eStatus === "live" && (
                      <Radio className="w-2.5 h-2.5 animate-pulse" />
                    )}
                    {statusLabel(eStatus)}
                  </span>
                </div>
                <div className="absolute top-7 right-7 z-10 bg-[#c9a84c] text-[#0d0d0d] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {event.price}
                </div>
              </div>
            )}

            <div className="p-5 md:p-6">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {event.title}
              </h3>
              {event.tagline && (
                <p className="text-[#c9a84c] text-sm font-medium mb-3">
                  {event.tagline}
                </p>
              )}
              <p className="text-[#b8b0a8] text-sm leading-relaxed mb-5 whitespace-pre-line">
                {event.description}
              </p>

              {event.speakers_data && event.speakers_data.length > 0 && (
                <div className="mb-5">
                  <Speakers speakers={event.speakers_data} />
                </div>
              )}

              <div className="space-y-2.5 text-sm border-t border-[#333333] pt-4">
                <div className="flex items-center gap-3 text-[#b8b0a8]">
                  <Calendar size={16} className="text-[#c9a84c] shrink-0" />
                  <span>
                    {formatEventDate(
                      event.starts_at,
                      event.timezone ?? undefined,
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[#b8b0a8]">
                  <Clock size={16} className="text-[#c9a84c] shrink-0" />
                  <span>
                    {formatEventRange(
                      event.starts_at,
                      event.ends_at,
                      event.timezone ?? undefined,
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[#b8b0a8]">
                  <MapPin size={16} className="text-[#c9a84c] shrink-0" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-3 text-[#b8b0a8]">
                  <Users size={16} className="text-[#c9a84c] shrink-0" />
                  <span>
                    {seatsLeft > 0
                      ? `${seatsLeft} seats left`
                      : "Waitlist only"}
                  </span>
                </div>
              </div>

              {event.starts_at && eStatus === "upcoming" && (
                <div className="mt-5">
                  <p className="text-[10px] uppercase tracking-wider text-[#7a7270] mb-2 font-semibold">
                    Starts in
                  </p>
                  <EventCountdown target={event.starts_at} />
                </div>
              )}

              <div className="mt-5 space-y-2">
                {eStatus !== "past" && <AddToCalendar event={event} />}
                {event.whatsapp_url && (
                  <a
                    href={event.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0d0d0d] hover:bg-[#2a2a2a] border border-[#333333] hover:border-[#c9a84c] text-[#c9a84c] font-semibold rounded-xl text-sm transition-all touch-manipulation active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Join the WhatsApp Channel
                  </a>
                )}
              </div>
            </div>
          </motion.div>

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
                <div className="flex flex-col gap-2 items-center">
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
                  <AddToCalendar event={event} />
                  <Link
                    href="/events"
                    className="text-xs text-[#c9a84c] hover:text-[#a8873a] font-semibold mt-2"
                  >
                    See all events →
                  </Link>
                </div>
              </div>
            ) : !regOpen ? (
              <div className="text-center py-8">
                <div className="bg-[#7a7270]/10 p-4 rounded-full inline-flex mb-4 border border-[#333333]">
                  <Users className="w-10 h-10 text-[#7a7270]" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  {eStatus === "past"
                    ? "Event Has Ended"
                    : "Registration Closed"}
                </h4>
                <p className="text-sm text-[#b8b0a8] mb-6">
                  {eStatus === "past"
                    ? "This event is in the past. Browse our upcoming events."
                    : "Registration is currently closed."}
                </p>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-full text-sm transition-all touch-manipulation"
                >
                  See All Events <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Reserve Your Spot
                </h3>
                <p className="text-sm text-[#7a7270] mb-6">
                  It&apos;s {event.price.toLowerCase()}. It takes 20 seconds.
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
                      WhatsApp Number{" "}
                      <span className="text-[#7a7270] text-[10px] normal-case tracking-normal">
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

        <div className="mt-8 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9a84c] hover:text-[#a8873a] transition"
          >
            View all events <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
