"use client";
import { useState } from "react";
import {
  Copy,
  Check,
  Share2,
  MessageCircle,
  Twitter,
  Linkedin,
} from "lucide-react";
import type { DbEvent } from "@/types/db";

interface Props {
  event: DbEvent;
}

export function ShareButtons({ event }: Props) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/events/${event.slug}`
      : "";
  const text = `${event.title} — ${event.date}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text, url });
      } catch {}
    } else {
      copy();
    }
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
  const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={share}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333333] hover:border-[#c9a84c] text-[#b8b0a8] hover:text-[#c9a84c] rounded-lg text-xs font-semibold transition-all touch-manipulation"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#0088CC]/20 border border-[#333333] hover:border-[#0088CC] text-[#b8b0a8] hover:text-[#0088CC] rounded-lg text-xs font-semibold transition-all touch-manipulation"
      >
        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
      </a>
      <a
        href={tw}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#1DA1F2]/20 border border-[#333333] hover:border-[#1DA1F2] text-[#b8b0a8] hover:text-[#1DA1F2] rounded-lg text-xs font-semibold transition-all touch-manipulation"
      >
        <Twitter className="w-3.5 h-3.5" /> X
      </a>
      <a
        href={li}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#0077B5]/20 border border-[#333333] hover:border-[#0077B5] text-[#b8b0a8] hover:text-[#0077B5] rounded-lg text-xs font-semibold transition-all touch-manipulation"
      >
        <Linkedin className="w-3.5 h-3.5" /> LinkedIn
      </a>
      <button
        onClick={copy}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333333] hover:border-[#c9a84c] text-[#b8b0a8] hover:text-[#c9a84c] rounded-lg text-xs font-semibold transition-all touch-manipulation"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-400" /> Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" /> Copy link
          </>
        )}
      </button>
    </div>
  );
}
