import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { slugify } from "@/lib/events";
import type { Speaker } from "@/types/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      tagline,
      description,
      category,
      starts_at,
      ends_at,
      venue,
      price,
      capacity,
      flyer_url,
      flyers,
      speakers_data,
      is_featured,
      whatsapp_url,
      tags,
      timezone,
      override_status,
      registration_open,
      slug: bodySlug,
    } = body;

    if (!title || !starts_at) {
      return NextResponse.json(
        { error: "Title and starts_at are required" },
        { status: 400 },
      );
    }

    const startDate = new Date(starts_at);
    const endDate = ends_at ? new Date(ends_at) : null;

    if (endDate && endDate <= startDate) {
      return NextResponse.json(
        { error: "ends_at must be after starts_at" },
        { status: 400 },
      );
    }

    // Normalize speakers → objects
    const normalizedSpeakers: Speaker[] = Array.isArray(speakers_data)
      ? speakers_data
          .filter((s: any) => s && (s.name || "").trim())
          .map((s: any) => ({
            name: String(s.name).trim(),
            title: s.title ? String(s.title).trim() : "",
            bio: s.bio ? String(s.bio).trim() : "",
            photo: s.photo || null,
            socials: s.socials || {},
          }))
      : [];

    // Normalize flyers array: strings only, no empty
    const normalizedFlyers: string[] = Array.isArray(flyers)
      ? flyers.map((f) => String(f).trim()).filter(Boolean)
      : flyer_url
        ? [flyer_url]
        : [];

    const primaryFlyer = flyer_url || normalizedFlyers[0] || null;

    const slug = bodySlug || slugify(title);
    const finalId = id || slug;

    const { data, error } = await supabaseAdmin
      .from("events")
      .upsert(
        {
          id: finalId,
          slug,
          title,
          tagline: tagline || null,
          description: description ?? "",
          category: category ?? "Learn",
          date: startDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          time: startDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          starts_at: startDate.toISOString(),
          ends_at: endDate ? endDate.toISOString() : null,
          timezone: timezone ?? "Africa/Lagos",
          venue: venue ?? "TBA",
          price: price ?? "Free",
          capacity: capacity ?? 500,
          flyer_url: primaryFlyer,
          image: primaryFlyer,
          flyers: normalizedFlyers,
          speakers_data: normalizedSpeakers,
          // legacy strings for backward compat
          speakers: normalizedSpeakers.map((s) => s.name),
          is_featured: is_featured ?? false,
          whatsapp_url: whatsapp_url || null,
          tags: Array.isArray(tags) ? tags : [],
          override_status: override_status || null,
          registration_open: registration_open ?? true,
          status: "Upcoming",
        },
        { onConflict: "id" },
      )
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, event: data });
  } catch (error) {
    console.error("Admin upsert event error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("events").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
