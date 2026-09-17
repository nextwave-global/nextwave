import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug, getAllEvents } from "@/lib/events-server";
import EventDetailClient from "./EventDetailClient";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const events = await getAllEvents();
    return events.map((e) => ({ slug: e.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };

  const image = event.flyer_url || event.image || "/og-image.jpg";

  return {
    title: `${event.title} | NextWave Global`,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      url: `/events/${event.slug}`,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description.slice(0, 160),
      images: [image],
    },
    alternates: { canonical: `/events/${event.slug}` },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.starts_at,
    endDate: event.ends_at,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: event.whatsapp_url ?? process.env.NEXT_PUBLIC_BASE_URL,
    },
    image: event.flyer_url || event.image,
    organizer: {
      "@type": "Organization",
      name: "NextWave Global",
      url: process.env.NEXT_PUBLIC_BASE_URL,
    },
    offers: {
      "@type": "Offer",
      price: 0,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${event.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EventDetailClient event={event} />
    </>
  );
}
