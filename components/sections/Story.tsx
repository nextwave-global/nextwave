"use client";
import { motion } from "framer-motion";
import { Quote, Sparkles } from "lucide-react";

export default function Story() {
  return (
    <section id="about" className="py-16 md:py-24 px-4 sm:px-6 bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Our Story</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Our <span className="text-[#c9a84c]">Origin</span>
          </h2>
          <p className="text-[#b8b0a8] mb-4 text-sm md:text-base leading-relaxed">
            NextWave Global started as a small WhatsApp group sharing personal
            development insights to help students grow holistically.
          </p>
          <p className="text-[#b8b0a8] text-sm md:text-base leading-relaxed">
            Seeing the impact of initiatives like Scholar Reboot inspired us to
            expand into a full academy.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#0d0d0d] p-6 md:p-8 rounded-2xl border border-[#c9a84c]/20 relative"
        >
          <Quote className="w-8 h-8 text-[#c9a84c]/30 absolute -top-3 -left-3" />
          <h4 className="font-bold text-lg md:text-xl text-white mb-3 italic">
            Inspiring a generation of students who are ready to lead.
          </h4>
          <p className="text-[#7a7270] text-sm">— NextWave Global Team</p>
        </motion.div>
      </div>
    </section>
  );
}
