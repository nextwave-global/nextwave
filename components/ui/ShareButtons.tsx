"use client";
import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { FaWhatsapp, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";
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
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: event.title, text, url });
      } catch {
        /* user cancelled */
      }
    } else {
      copy();
    }
  };

  const wa = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
  const x = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const btn =
    "inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-xs font-semibold transition-all touch-manipulation";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={share}
        className={`${btn} text-[#b8b0a8] hover:text-[#c9a84c] hover:border-[#c9a84c]`}
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} text-[#b8b0a8] hover:text-[#25D366] hover:border-[#25D366]`}
      >
        <FaWhatsapp className="w-3.5 h-3.5" />
        WhatsApp
      </a>

      <a
        href={x}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} text-[#b8b0a8] hover:text-white hover:border-white`}
      >
        <FaXTwitter className="w-3.5 h-3.5" />
        X
      </a>

      <a
        href={li}
        target="_blank"
        rel="noopener noreferrer"
        className={`${btn} text-[#b8b0a8] hover:text-[#0A66C2] hover:border-[#0A66C2]`}
      >
        <FaLinkedinIn className="w-3.5 h-3.5" />
        LinkedIn
      </a>

      <button
        onClick={copy}
        className={`${btn} text-[#b8b0a8] hover:text-[#c9a84c] hover:border-[#c9a84c]`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-400" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
