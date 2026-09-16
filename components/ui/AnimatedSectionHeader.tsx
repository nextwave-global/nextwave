"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  highlight?: string;
}

export function AnimatedSectionHeader({
  title,
  subtitle,
  icon,
  highlight,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-8 md:mb-16"
    >
      {icon && (
        <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest bg-[#c9a84c]/10 px-4 py-2 rounded-full mb-4 border border-[#c9a84c]/20">
          {icon}
          <span>{subtitle}</span>
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white">
        {title}
        {highlight && <span className="text-[#c9a84c]"> {highlight}</span>}
      </h2>
      {subtitle && !icon && (
        <p className="text-[#7a7270] max-w-2xl mx-auto text-sm md:text-base">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
