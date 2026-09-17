"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react";
import type { DbEvent } from "@/types/db";
import { EventCard } from "@/components/EventCard";
import { computedStatus } from "@/lib/events";

export default function Programs() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onScroll = () => {
    const c = scrollRef.current;
    if (!c) return;
    setShowLeft(c.scrollLeft > 20);
    setShowRight(c.scrollLeft < c.scrollWidth - c.clientWidth - 20);
    const cw = (c.children[0] as HTMLElement)?.clientWidth || 0;
    setActiveIndex(Math.round(c.scrollLeft / (cw + 24)));
  };

  useEffect(() => {
    const c = scrollRef.current;
    if (!c) return;
    c.addEventListener("scroll", onScroll);
    onScroll();
    return () => c.removeEventListener("scroll", onScroll);
  }, [events]);

  const scroll = (dir: "left" | "right") => {
    const c = scrollRef.current;
    if (!c) return;
    c.scrollBy({
      left: dir === "left" ? -c.clientWidth * 0.8 : c.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (i: number) => {
    const c = scrollRef.current;
    if (!c) return;
    const cw = (c.children[0] as HTMLElement)?.clientWidth || 0;
    c.scrollTo({ left: i * (cw + 24), behavior: "smooth" });
  };

  const upcoming = events.filter((e) => {
    const s = computedStatus(e);
    return s === "upcoming" || s === "live";
  }).length;
  const past = events.filter((e) => computedStatus(e) === "past").length;

  // Show featured first
  const display = [...events].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return 0;
  });

  return (
    <section
      id="programs"
      className="py-12 md:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#0d0d0d]"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest bg-[#c9a84c]/10 px-4 py-2 rounded-full mb-4 border border-[#c9a84c]/20">
            <Sparkles className="w-4 h-4" />
            <span>Events &amp; Programs</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white">
            What&apos;s <span className="text-[#c9a84c]">Next</span> &amp;{" "}
            <span className="text-[#c9a84c]">Past</span>
          </h2>
          <p className="text-[#7a7270] mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Register for upcoming events or explore completed initiatives.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 text-[#7a7270] text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>{upcoming} Upcoming</span>
            </div>
            <div className="w-px h-4 bg-[#333333]" />
            <div className="flex items-center gap-2 text-[#7a7270] text-xs">
              <div className="w-2 h-2 rounded-full bg-[#333333]" />
              <span>{past} Completed</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-[300px] h-80 bg-[#1a1a1a] rounded-2xl animate-pulse flex-shrink-0"
              />
            ))}
          </div>
        ) : display.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#333333] max-w-md mx-auto">
              <Users className="w-12 h-12 text-[#7a7270] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">
                No events yet
              </h3>
              <p className="text-sm text-[#7a7270]">Check back soon.</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {!isMobile && showLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a1a] hover:bg-[#c9a84c] text-[#b8b0a8] hover:text-[#0d0d0d] p-2.5 rounded-full transition-all border border-[#333333] hover:border-[#c9a84c] shadow-lg touch-manipulation"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {!isMobile && showRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a1a] hover:bg-[#c9a84c] text-[#b8b0a8] hover:text-[#0d0d0d] p-2.5 rounded-full transition-all border border-[#333333] hover:border-[#c9a84c] shadow-lg touch-manipulation"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 scrollbar-custom"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#c9a84c #2a2a2a",
              }}
            >
              {display.map((event) => (
                <div
                  key={event.id}
                  className="w-[280px] sm:w-[300px] snap-center flex-shrink-0"
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>

            {isMobile && display.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {display.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    className={`h-1.5 rounded-full transition-all touch-manipulation ${activeIndex === i ? "w-5 bg-[#c9a84c]" : "w-1.5 bg-[#333333]"}`}
                    aria-label={`Go to event ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333333] hover:border-[#c9a84c] text-[#b8b0a8] hover:text-[#c9a84c] font-semibold rounded-full text-sm transition-all touch-manipulation"
          >
            View All Events <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-custom {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        .scrollbar-custom::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 10px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #c9a84c;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}
