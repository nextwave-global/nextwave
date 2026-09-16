"use client";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Crown } from "lucide-react";

const data = [
  {
    title: "Learn",
    desc: "Equip students with the knowledge, skills, and mindset to thrive.",
    icon: BookOpen,
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    title: "Earn",
    desc: "Help students monetize skills, access opportunities, and build independence.",
    icon: TrendingUp,
    color: "from-green-500/20 to-green-600/10",
  },
  {
    title: "Lead",
    desc: "Inspire leadership, initiative, and community impact among young people.",
    icon: Crown,
    color: "from-[#c9a84c]/20 to-[#c9a84c]/10",
  },
];

export default function Pillars() {
  return (
    <section id="pillars" className="py-16 md:py-24 px-4 sm:px-6 bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white">
            Our <span className="text-[#c9a84c]">Mission</span>
          </h2>
          <p className="text-[#7a7270] max-w-2xl mx-auto text-sm md:text-base">
            Three pillars that guide everything we do.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {data.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-[#333333] hover:border-[#c9a84c] transition-all"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <item.icon className="w-7 h-7 text-[#c9a84c]" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                {item.title}
              </h3>
              <p className="text-[#7a7270] leading-relaxed text-sm md:text-base">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
