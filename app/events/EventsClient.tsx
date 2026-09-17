"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { EventCard } from "@/components/EventCard";
import type { DbEvent } from "@/types/db";
import { computedStatus } from "@/lib/events";

type Filter = "all" | "upcoming" | "past";

export default function EventsClient({
  initialEvents,
}: {
  initialEvents: DbEvent[];
}) {
  const [events] = useState(initialEvents);
  const [filter, setFilter] = useState<Filter>("all");
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category));
    return ["all", ...Array.from(set).sort()];
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const s = computedStatus(e);
      if (filter === "upcoming" && s !== "upcoming" && s !== "live")
        return false;
      if (filter === "past" && s !== "past") return false;
      if (category !== "all" && e.category !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, filter, category, query]);

  const counts = useMemo(
    () => ({
      all: events.length,
      upcoming: events.filter((e) =>
        ["upcoming", "live"].includes(computedStatus(e)),
      ).length,
      past: events.filter((e) => computedStatus(e) === "past").length,
    }),
    [events],
  );

  return (
    <main className="min-h-screen bg-[#0d0d0d] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-10 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#c9a84c]/3 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 text-[#c9a84c] px-4 py-2 rounded-full border border-[#c9a84c]/20 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              All Events
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.05] mb-4 text-white">
            Events &amp; <span className="text-[#c9a84c]">Programs</span>
          </h1>
          <p className="text-[#b8b0a8] max-w-2xl mx-auto text-sm md:text-base">
            Everything we&apos;ve done, everything we&apos;re doing, everything
            that&apos;s next.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 sm:px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333333] p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white placeholder:text-[#7a7270] text-sm"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 bg-[#0d0d0d] border border-[#333333] rounded-xl focus:border-[#c9a84c] outline-none text-white text-sm"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All categories" : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#7a7270]" />
              {(["all", "upcoming", "past"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all touch-manipulation capitalize ${
                    filter === f
                      ? "bg-[#c9a84c] text-[#0d0d0d]"
                      : "bg-[#0d0d0d] text-[#b8b0a8] hover:bg-[#2a2a2a] border border-[#333333]"
                  }`}
                >
                  {f} <span className="opacity-60">({counts[f]})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#333333] max-w-md mx-auto">
                <Search className="w-12 h-12 text-[#7a7270] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  No events found
                </h3>
                <p className="text-sm text-[#7a7270]">
                  Try adjusting your filters.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
