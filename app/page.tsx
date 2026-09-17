"use client";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Pillars from "@/components/sections/Pillars";
import Programs from "@/components/sections/Programs";
import Registration from "@/components/sections/Registration";
import Footer from "@/components/layout/Footer";
// import { EventPopupWrapper } from "@/components/ui/EventPopupWrapper"; 

export default function Home() {
  const handleRegister = (eventId: string) => {
    document
      .getElementById("register")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] overflow-x-hidden">
      <Navbar />
      <Hero />
      <Story />
      <Pillars />
      <Programs />
      <Registration />
      <Footer />
      {/* <EventPopupWrapper onRegister={handleRegister} /> */}
    </main>
  );
}
