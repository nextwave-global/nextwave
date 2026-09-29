"use client";

import {
  FaLinkedinIn,
  FaTelegram,
  FaInstagram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

export interface SocialLink {
  key: "linkedin" | "telegram" | "instagram" | "whatsapp" | "x";
  label: string;
  url: string;
  Icon: IconType;
  color: string; // brand color hex (no #)
  hoverBg: string; // tailwind hover bg class
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/nextwave-g/",
    Icon: FaLinkedinIn,
    color: "#0077B5",
    hoverBg: "hover:bg-[#0077B5]",
  },
  {
    key: "telegram",
    label: "Telegram",
    url: "https://t.me/+NdjMKKMF6rNjNjBk",
    Icon: FaTelegram,
    color: "#0088CC",
    hoverBg: "hover:bg-[#0088CC]",
  },
  {
    key: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/next_waveglobal/",
    Icon: FaInstagram,
    color: "#E4405F",
    hoverBg: "hover:bg-[#E4405F]",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    url: "https://wa.me/2348000000000",
    Icon: FaWhatsapp,
    color: "#25D366",
    hoverBg: "hover:bg-[#25D366]",
  },
  {
    key: "x",
    label: "X (Twitter)",
    url: "https://x.com/nextwaveglobal",
    Icon: FaXTwitter,
    color: "#000000",
    hoverBg: "hover:bg-white",
  },
];

/**
 * Rounded icon button — used in footer and anywhere else.
 */
export function SocialIconButton({
  link,
  size = 40,
  iconSize = 16,
}: {
  link: SocialLink;
  size?: number;
  iconSize?: number;
}) {
  const { Icon, url, label, color, hoverBg } = link;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 hover:text-[#0d0d0d] touch-manipulation ${hoverBg}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        color: "#ffffff",
      }}
    >
      <Icon size={iconSize} />
    </a>
  );
}

/**
 * Row of all social icons — plug anywhere.
 */
export function SocialIconsRow({
  size = 40,
  iconSize = 16,
  className = "",
}: {
  size?: number;
  iconSize?: number;
  className?: string;
}) {
  return (
    <div className={`flex gap-3 flex-wrap ${className}`}>
      {SOCIAL_LINKS.map((link) => (
        <SocialIconButton
          key={link.key}
          link={link}
          size={size}
          iconSize={iconSize}
        />
      ))}
    </div>
  );
}

/**
 * Small inline brand icon (for share buttons, speakers, etc.)
 */
export function BrandIcon({
  brand,
  className = "w-3.5 h-3.5",
}: {
  brand: "linkedin" | "x" | "whatsapp" | "telegram" | "instagram";
  className?: string;
}) {
  const map = {
    linkedin: FaLinkedinIn,
    x: FaXTwitter,
    whatsapp: FaWhatsapp,
    telegram: FaTelegram,
    instagram: FaInstagram,
  };
  const Icon = map[brand];
  return <Icon className={className} />;
}
