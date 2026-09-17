import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const eventId = searchParams.get("eventId");

    let query = supabaseAdmin
      .from("registrations")
      .select(
        "id, full_name, email, phone, event_id, status, created_at, event:events(id,title,date)",
      )
      .order("created_at", { ascending: false });
    if (status) query = query.eq("status", status);
    if (eventId) query = query.eq("event_id", eventId);

    const { data, error } = await query;
    if (error) throw error;

    const registrations = (data ?? []).map((r: any) => ({
      id: r.id,
      fullName: r.full_name,
      email: r.email,
      phone: r.phone,
      status: r.status,
      createdAt: r.created_at,
      event: {
        id: r.event?.id ?? r.event_id,
        title: r.event?.title ?? "Unknown",
        date: r.event?.date ?? "",
      },
    }));

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { registrations: [], error: "Failed to fetch registrations" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Registration ID required" },
        { status: 400 },
      );

    const { data: reg, error: fetchErr } = await supabaseAdmin
      .from("registrations")
      .select("id, event_id")
      .eq("id", id)
      .single();
    if (fetchErr || !reg)
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 },
      );

    await supabaseAdmin.from("registrations").delete().eq("id", id);

    const { data: ev } = await supabaseAdmin
      .from("events")
      .select("registered")
      .eq("id", reg.event_id)
      .single();
    if (ev)
      await supabaseAdmin
        .from("events")
        .update({ registered: Math.max(0, (ev.registered ?? 0) - 1) })
        .eq("id", reg.event_id);

    return NextResponse.json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      { error: "Failed to delete registration" },
      { status: 500 },
    );
  }
}
