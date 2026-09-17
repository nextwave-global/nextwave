import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Radio } from "lucide-react";
import type { DbEvent } from "@/types/db";
import {
  computedStatus,
  statusLabel,
  statusColor,
  formatEventDate,
  formatEventRange,
  isRegistrationOpen,
} from "@/lib/events";

interface Props {
  event: DbEvent;
  variant?: "default" | "compact";
}

export function EventCard({ event, variant = "default" }: Props) {
  const status = computedStatus(event);
  const isPast = status === "past";
  const isLive = status === "live";
  const registrationOpen = isRegistrationOpen(event);
  const image = event.flyer_url || event.image;

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group flex flex-col bg-[#1a1a1a] border border-[#333333] rounded-2xl overflow-hidden transition-all ${
        isPast
          ? "opacity-70 hover:opacity-100 hover:border-[#555]"
          : "hover:border-[#c9a84c]/50 hover:shadow-2xl hover:shadow-[#c9a84c]/10 hover:-translate-y-1"
      }`}
    >
      <div
        className={`relative w-full overflow-hidden bg-[#0d0d0d] ${
          variant === "compact" ? "h-40" : "aspect-[4/3]"
        }`}
      >
        {image ? (
          <Image
            src={image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#c9a84c]/10 to-transparent text-5xl">
            📅
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/90 via-[#0d0d0d]/20 to-transparent" />

        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColor(status)} backdrop-blur-sm`}
          >
            {isLive && <Radio className="w-2.5 h-2.5 animate-pulse" />}
            {statusLabel(status)}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {event.category}
          </span>
        </div>

        <div className="absolute bottom-3 left-3">
          <span className="bg-[#c9a84c] text-[#0d0d0d] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {event.price}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#c9a84c] transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-[#7a7270] text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {event.description}
        </p>

        <div className="space-y-1.5 text-xs border-t border-[#333333] pt-3">
          <div className="flex items-center gap-2 text-[#b8b0a8]">
            <Calendar className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
            <span className="truncate">
              {formatEventDate(event.starts_at, event.timezone ?? undefined)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#b8b0a8]">
            <Clock className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
            <span className="truncate">
              {formatEventRange(
                event.starts_at,
                event.ends_at,
                event.timezone ?? undefined,
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#b8b0a8]">
            <MapPin className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#333333]">
          {isPast ? (
            <span className="inline-flex items-center gap-1.5 text-[#7a7270] text-xs font-semibold">
              View recap <ArrowRight className="w-3.5 h-3.5" />
            </span>
          ) : registrationOpen ? (
            <span className="inline-flex items-center gap-1.5 text-[#c9a84c] text-xs font-bold group-hover:gap-3 transition-all">
              Register now <ArrowRight className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[#7a7270] text-xs font-semibold">
              Registration closed
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
