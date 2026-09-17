"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Users,
  CheckCircle,
  Radio,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { DbEvent } from "@/types/db";
import {
  computedStatus,
  formatEventDate,
  formatEventRange,
} from "@/lib/events";
import { EventCountdown } from "@/components/ui/EventCountdown";

interface Props {
  onRegister?: (eventId: string) => void;
}

export function EventPopup({ onRegister }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [event, setEvent] = useState<DbEvent | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => {
        const events: DbEvent[] = d.events ?? [];
        const f =
          events.find((e) => e.is_featured) ??
          events.find((e) => computedStatus(e) === "upcoming");
        if (f) setEvent(f);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const seen = sessionStorage.getItem("hasSeenEventPopup");
    if (!seen && event) {
      const t = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(t);
    }
  }, [event]);

  const close = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenEventPopup", "true");
  };

  if (!event) return null;

  const status = computedStatus(event);
  const image = event.flyer_url || event.image;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-[380px] bg-[#1a1a1a] rounded-xl shadow-2xl overflow-hidden border border-[#333333] max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#c9a84c] to-[#a8873a] px-4 py-2.5 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2 text-[#0d0d0d]">
                  {status === "live" ? (
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span className="text-xs font-bold tracking-wide">
                    {status === "live" ? "Live Now" : "Upcoming Event"}
                  </span>
                </div>
                <button
                  onClick={close}
                  className="text-[#0d0d0d]/70 hover:text-[#0d0d0d] p-1 rounded-full hover:bg-[#0d0d0d]/10 touch-manipulation"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {image && (
                <div className="relative w-full aspect-[16/10] bg-[#0d0d0d]">
                  <Image
                    src={image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="380px"
                  />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                  <span className="bg-[#c9a84c]/10 text-[#c9a84c] text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    {event.category}
                  </span>
                  {event.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#0d0d0d] text-[#7a7270] text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <h3 className="font-bold text-base text-white leading-tight mb-1">
                  {event.title}
                </h3>
                <p className="text-[11px] text-[#7a7270] line-clamp-3 mb-2">
                  {event.description}
                </p>

                <div className="space-y-1 text-[10px] text-[#b8b0a8] mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-[#c9a84c]" />
                    <span>
                      {formatEventDate(
                        event.starts_at,
                        event.timezone ?? undefined,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#c9a84c]" />
                    <span>
                      {formatEventRange(
                        event.starts_at,
                        event.ends_at,
                        event.timezone ?? undefined,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#c9a84c]" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>

                {event.starts_at && status === "upcoming" && (
                  <div className="mb-3">
                    <EventCountdown target={event.starts_at} />
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[#333333]">
                  <div>
                    <p className="text-[8px] text-[#7a7270] uppercase tracking-wider">
                      Price
                    </p>
                    <p className="font-bold text-[#c9a84c] text-base">
                      {event.price}
                    </p>
                  </div>
                  <Link
                    href={`/events/${event.slug}`}
                    onClick={() => {
                      onRegister?.(event.id);
                      close();
                    }}
                    className="px-5 py-2 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-lg transition-all flex items-center gap-1.5 text-xs shadow-lg shadow-[#c9a84c]/25 touch-manipulation active:scale-95"
                  >
                    <span>Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="mt-2.5 pt-2.5 border-t border-[#333333] flex items-center justify-between">
                  <span className="flex items-center gap-0.5 text-[8px] text-green-400">
                    <CheckCircle className="w-2.5 h-2.5" /> Free entry
                  </span>
                  <span className="flex items-center gap-0.5 text-[8px] text-[#7a7270]">
                    <Users className="w-2.5 h-2.5" />
                    {Math.max(0, event.capacity - event.registered)} seats
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
