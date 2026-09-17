"use client";
import { useState } from "react";
import Link from "next/link";
import { LIBRARY_ITEMS } from "@/data/library";
import {
  Search,
  BookOpen,
  Download,
  Eye,
  ArrowLeft,
  Sparkles,
  FileText,
  ChevronRight,
} from "lucide-react";

const getUniqueCategories = () => {
  const unique = new Set(LIBRARY_ITEMS.map((item) => item.category));
  return ["All", ...Array.from(unique).sort()];
};

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = LIBRARY_ITEMS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileId = (url: string) => url.match(/\/d\/([^\/]+)/)?.[1] ?? null;
  const getDownloadUrl = (url: string) => {
    const id = getFileId(url);
    return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
  };
  const getPreviewUrl = (url: string) => {
    const id = getFileId(url);
    return id ? `https://drive.google.com/file/d/${id}/preview` : url;
  };
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="bg-[#1a1a1a] border-b border-[#333333] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#b8b0a8] hover:text-[#c9a84c] transition-colors touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#c9a84c]" />
            <span className="text-white font-bold">Library</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest bg-[#c9a84c]/10 px-4 py-2 rounded-full mb-4 border border-[#c9a84c]/20">
            <Sparkles className="w-4 h-4" />
            <span>Resource Library</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Explore Our <span className="text-[#c9a84c]">Library</span>
          </h1>
          <p className="text-[#7a7270] max-w-2xl mx-auto text-sm md:text-base">
            Access free PDF resources, guides, and books to help you learn,
            earn, and lead.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-full border border-[#333333]">
            <FileText className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-sm text-[#b8b0a8]">
              {LIBRARY_ITEMS.length} PDF Resources Available
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270] w-4 h-4" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-xl focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none text-white placeholder:text-[#7a7270] text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 flex-wrap">
            {getUniqueCategories().map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${selectedCategory === cat ? "bg-[#c9a84c] text-[#0d0d0d]" : "bg-[#1a1a1a] text-[#b8b0a8] hover:bg-[#2a2a2a] border border-[#333333]"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-[#7a7270] mb-4">
          {filteredItems.length}{" "}
          {filteredItems.length === 1 ? "resource" : "resources"} found
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#333333] max-w-md mx-auto">
              <BookOpen className="w-12 h-12 text-[#7a7270] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">
                No Resources Found
              </h3>
              <p className="text-sm text-[#7a7270]">
                Try adjusting your search or filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-5 hover:border-[#c9a84c] hover:shadow-lg hover:shadow-[#c9a84c]/5 transition-all group flex flex-col min-h-[280px]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg border bg-red-500/20 text-red-400 border-red-500/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium text-[#7a7270] bg-[#0d0d0d] px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-1.5 group-hover:text-[#c9a84c] transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-[#7a7270] text-sm mb-4 line-clamp-2 flex-1">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#333333]">
                  <span className="text-[10px] text-[#7a7270]">
                    Added {formatDate(item.date)}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={getPreviewUrl(item.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#c9a84c] hover:text-[#a8873a] transition-colors touch-manipulation"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </a>
                    <span className="text-[#333333]">|</span>
                    <a
                      href={getDownloadUrl(item.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#c9a84c] hover:text-[#a8873a] transition-colors touch-manipulation"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-[#c9a84c]/20 max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-white mb-2">
              Can&apos;t find what you&apos;re looking for?
            </h3>
            <p className="text-[#7a7270] text-sm mb-4">
              Reach out and we&apos;ll help you find the resources you need.
            </p>
            <a
              href="mailto:nextwaveglobalinfo@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-full transition-all touch-manipulation active:scale-95"
            >
              Contact Us
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
