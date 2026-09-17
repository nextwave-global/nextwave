import type { DbEvent, EventStatus } from "@/types/db";

export const DEFAULT_TZ = "Africa/Lagos";

export function computedStatus(
  event: Pick<DbEvent, "starts_at" | "ends_at" | "override_status">,
): EventStatus {
  if (event.override_status) return event.override_status;
  if (!event.starts_at) return "draft";

  const now = Date.now();
  const start = new Date(event.starts_at).getTime();
  const end = event.ends_at
    ? new Date(event.ends_at).getTime()
    : start + 3 * 60 * 60 * 1000;

  if (now < start) return "upcoming";
  if (now >= start && now < end) return "live";
  return "past";
}

export function isRegistrationOpen(event: DbEvent): boolean {
  const status = computedStatus(event);
  if (status === "past" || status === "cancelled" || status === "draft")
    return false;
  if (!event.registration_open) return false;
  if (event.capacity > 0 && event.registered >= event.capacity) return false;
  return true;
}

export function formatEventDate(
  iso: string | null,
  timezone = DEFAULT_TZ,
): string {
  if (!iso) return "TBA";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  });
}

export function formatEventTime(
  iso: string | null,
  timezone = DEFAULT_TZ,
): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });
}

export function formatEventRange(
  start: string | null,
  end: string | null,
  timezone = DEFAULT_TZ,
): string {
  if (!start) return "TBA";
  const s = formatEventTime(start, timezone);
  if (!end) return s;
  const e = formatEventTime(end, timezone);
  return `${s} – ${e}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function googleCalendarUrl(event: DbEvent): string {
  if (!event.starts_at) return "";
  const start = new Date(event.starts_at);
  const end = event.ends_at
    ? new Date(event.ends_at)
    : new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: event.venue,
    dates: `${fmt(start)}/${fmt(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function icsDataUrl(event: DbEvent): string {
  if (!event.starts_at) return "";
  const start = new Date(event.starts_at);
  const end = event.ends_at
    ? new Date(event.ends_at)
    : new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NextWave Global//Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@nextwaveglobal`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${event.venue}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

export function statusLabel(status: EventStatus): string {
  switch (status) {
    case "upcoming":
      return "Upcoming";
    case "live":
      return "Live Now";
    case "past":
      return "Past";
    case "draft":
      return "Draft";
    case "cancelled":
      return "Cancelled";
  }
}

export function statusColor(status: EventStatus): string {
  switch (status) {
    case "upcoming":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "live":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "past":
      return "bg-[#2a2a2a] text-[#7a7270] border-[#333333]";
    case "draft":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "cancelled":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}

/**
 * Sort priority:
 *   1. FEATURED upcoming/live events (pinned first)
 *   2. Other live
 *   3. Other upcoming (soonest first)
 *   4. Draft
 *   5. Cancelled
 *   6. Past (most recent first)
 *
 * Featured only pins if the event is actually upcoming or live.
 * A featured PAST event sorts with other past events.
 */
export function sortEvents(events: DbEvent[]): DbEvent[] {
  const priority: Record<EventStatus, number> = {
    live: 0,
    upcoming: 1,
    draft: 2,
    cancelled: 3,
    past: 4,
  };

  return [...events].sort((a, b) => {
    const sa = computedStatus(a);
    const sb = computedStatus(b);

    // Featured upcoming/live events float to top
    const aIsActive = sa === "live" || sa === "upcoming";
    const bIsActive = sb === "live" || sb === "upcoming";
    const aFeatured = a.is_featured && aIsActive;
    const bFeatured = b.is_featured && bIsActive;

    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;

    // Then by status priority
    if (priority[sa] !== priority[sb]) return priority[sa] - priority[sb];

    // Within same status: upcoming ascending, past descending
    const da = a.starts_at ? new Date(a.starts_at).getTime() : 0;
    const db = b.starts_at ? new Date(b.starts_at).getTime() : 0;

    if (sa === "past") return db - da; // most recent past first
    return da - db; // soonest upcoming first
  });
}
