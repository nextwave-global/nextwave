"use client";
import { CalendarPlus, Download } from "lucide-react";
import { googleCalendarUrl, icsDataUrl } from "@/lib/events";
import type { DbEvent } from "@/types/db";

interface Props {
  event: DbEvent;
}

export function AddToCalendar({ event }: Props) {
  const g = googleCalendarUrl(event);
  const ics = icsDataUrl(event);
  if (!g) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={g}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] rounded-lg text-xs font-bold transition-all touch-manipulation"
      >
        <CalendarPlus className="w-3.5 h-3.5" />
        Add to Google Calendar
      </a>
      <a
        href={ics}
        download={`${event.slug}.ics`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333333] hover:border-[#c9a84c] text-[#b8b0a8] hover:text-[#c9a84c] rounded-lg text-xs font-semibold transition-all touch-manipulation"
      >
        <Download className="w-3.5 h-3.5" />
        Download .ics
      </a>
    </div>
  );
}
