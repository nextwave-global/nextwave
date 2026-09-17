import type { Metadata } from "next";
import EventsClient from "./EventsClient";
import { getAllEvents } from "@/lib/events-server";

export const metadata: Metadata = {
  title: "Events | NextWave Global",
  description:
    "Browse upcoming and past events from NextWave Global. Register for free events that help students learn, earn, and lead.",
  openGraph: {
    title: "Events | NextWave Global",
    description: "Upcoming and past events from NextWave Global.",
    url: "/events",
  },
  alternates: { canonical: "/events" },
};

export const revalidate = 60; // ISR

export default async function EventsPage() {
  const events = await getAllEvents();
  return <EventsClient initialEvents={events} />;
}
