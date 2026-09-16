"use client";
import Image from "next/image";
import { PROGRAMS } from "@/data/programs";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CalendarIcon, ClockIcon, LocationIcon } from "@/components/ui/Icons";
import { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  CheckCircle,
} from "lucide-react";

export default function Programs() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const checkScroll = () => {
    const c = scrollContainerRef.current;
    if (!c) return;
    setShowLeftArrow(c.scrollLeft > 20);
    setShowRightArrow(c.scrollLeft < c.scrollWidth - c.clientWidth - 20);
    const cardWidth = (c.children[0] as HTMLElement)?.clientWidth || 0;
    setActiveIndex(Math.round(c.scrollLeft / (cardWidth + 16)));
  };

  useEffect(() => {
    const c = scrollContainerRef.current;
    if (!c) return;
    c.addEventListener("scroll", checkScroll);
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => {
      c.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    const c = scrollContainerRef.current;
    if (!c) return;
    c.scrollBy({
      left: dir === "left" ? -c.clientWidth * 0.8 : c.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (i: number) => {
    const c = scrollContainerRef.current;
    if (!c) return;
    const cardWidth = (c.children[0] as HTMLElement)?.clientWidth || 0;
    c.scrollTo({ left: i * (cardWidth + 16), behavior: "smooth" });
  };

  const allPrograms = PROGRAMS.map((p) => ({ ...p, status: "Past" as const }));

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
            <span>Past Programs</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white">
            Completed <span className="text-[#c9a84c]">Programs</span>
          </h2>
          <p className="text-[#7a7270] mt-3 max-w-2xl mx-auto text-sm md:text-base">
            Explore our past initiatives that helped students learn, earn, and
            lead.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
            <div className="flex items-center gap-2 text-[#7a7270] text-xs">
              <div className="w-2 h-2 rounded-full bg-[#333333]" />
              <span>{allPrograms.length} Programs</span>
            </div>
            <div className="w-px h-4 bg-[#333333]" />
            <div className="flex items-center gap-2 text-[#7a7270] text-xs">
              <Users className="w-3.5 h-3.5 text-[#c9a84c]" />
              <span>Virtual & Physical</span>
            </div>
          </div>
        </div>

        <div className="relative">
          {!isMobile && showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a1a] hover:bg-[#c9a84c] text-[#b8b0a8] hover:text-[#0d0d0d] p-2.5 rounded-full transition-all border border-[#333333] hover:border-[#c9a84c] shadow-lg touch-manipulation"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {!isMobile && showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#1a1a1a] hover:bg-[#c9a84c] text-[#b8b0a8] hover:text-[#0d0d0d] p-2.5 rounded-full transition-all border border-[#333333] hover:border-[#c9a84c] shadow-lg touch-manipulation"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory py-4 scrollbar-custom"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#c9a84c #2a2a2a",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {allPrograms.map((item, index) => (
              <div
                key={item.title}
                className="w-[260px] sm:w-[280px] md:w-[300px] snap-center rounded-xl md:rounded-2xl border border-[#333333] bg-[#1a1a1a] overflow-hidden group flex-shrink-0 hover:border-[#c9a84c]/50 hover:shadow-2xl hover:shadow-[#c9a84c]/10 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  {item.image ? (
                    <>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 260px, 300px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/90 via-[#0d0d0d]/30 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-[#c9a84c]/30 to-[#c9a84c]/5">
                      📚
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#c9a84c] bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                      #{index + 1}
                    </span>
                    <StatusBadge status="Past" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#2a2a2a] text-[#7a7270] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#333333]">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Completed
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-white font-bold text-base mb-1.5 group-hover:text-[#c9a84c] transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[#7a7270] text-xs leading-relaxed mb-3 line-clamp-2">
                    {item.desc || "An initiative that helped students grow."}
                  </p>
                  <div className="space-y-1.5 text-xs border-t border-[#333333] pt-3">
                    <div className="flex items-center gap-2 text-[#b8b0a8]">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                      <span className="truncate">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#b8b0a8]">
                      <ClockIcon className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                      <span className="truncate">{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#b8b0a8]">
                      <LocationIcon className="w-3.5 h-3.5 text-[#c9a84c] shrink-0" />
                      <span className="truncate">{item.venue}</span>
                    </div>
                  </div>
                  <div className="w-full mt-3 py-2.5 bg-[#2a2a2a] text-[#7a7270] rounded-lg font-semibold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Program Completed
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isMobile && allPrograms.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {allPrograms.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 touch-manipulation ${activeIndex === index ? "w-5 bg-[#c9a84c]" : "w-1.5 bg-[#333333]"}`}
                  aria-label={`Go to program ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #c9a84c #1a1a1a;
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
