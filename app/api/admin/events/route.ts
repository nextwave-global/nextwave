import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { slugify } from "@/lib/events";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      starts_at,
      ends_at,
      venue,
      price,
      capacity,
      flyer_url,
      is_featured,
      whatsapp_url,
      tags,
      timezone,
      override_status,
      registration_open,
    } = body;

    if (!title || !starts_at) {
      return NextResponse.json(
        { error: "Title and starts_at are required" },
        { status: 400 },
      );
    }

    const slug = body.slug || slugify(title);
    const id = body.id || slug;

    const { data, error } = await supabaseAdmin
      .from("events")
      .upsert({
        id,
        slug,
        title,
        description: description ?? "",
        category: category ?? "Learn",
        date: new Date(starts_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        time: new Date(starts_at).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        starts_at,
        ends_at: ends_at ?? null,
        timezone: timezone ?? "Africa/Lagos",
        venue: venue ?? "TBA",
        price: price ?? "Free",
        capacity: capacity ?? 500,
        flyer_url: flyer_url ?? null,
        image: flyer_url ?? null,
        is_featured: is_featured ?? false,
        whatsapp_url: whatsapp_url ?? null,
        tags: tags ?? [],
        override_status: override_status ?? null,
        registration_open: registration_open ?? true,
        status: "Upcoming", // legacy column
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, event: data });
  } catch (error) {
    console.error("Admin create event error:", error);
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
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });

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
