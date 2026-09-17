"use client";
import { useCountdown } from "@/hooks/useCountdown";

interface Props {
  target: string | null;
  compact?: boolean;
}

export function EventCountdown({ target, compact = false }: Props) {
  const c = useCountdown(target);
  if (c.isPast) return null;

  const cells = [
    { label: "Days", value: c.days },
    { label: "Hours", value: c.hours },
    { label: "Minutes", value: c.minutes },
    { label: "Seconds", value: c.seconds },
  ];

  if (compact) {
    return (
      <span className="text-xs font-semibold text-[#c9a84c] tabular-nums">
        {c.days}d {c.hours}h {c.minutes}m
      </span>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="bg-[#0d0d0d] border border-[#333333] rounded-lg p-2 text-center"
        >
          <div className="text-lg md:text-2xl font-bold text-[#c9a84c] tabular-nums">
            {String(cell.value).padStart(2, "0")}
          </div>
          <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-[#7a7270]">
            {cell.label}
          </div>
        </div>
      ))}
    </div>
  );
}
