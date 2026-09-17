import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getEmailService } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, eventId } = await request.json();

    if (!fullName || !email || !eventId) {
      return NextResponse.json(
        { error: "Full name, email, and event ID are required" },
        { status: 400 },
      );
    }

    const { data: event, error: eventErr } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();
    if (eventErr || !event)
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    if (event.registered >= event.capacity)
      return NextResponse.json(
        { error: "Event is fully booked" },
        { status: 400 },
      );

    const { data: existing } = await supabaseAdmin
      .from("registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("email", email.toLowerCase())
      .maybeSingle();
    if (existing)
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 400 },
      );

    const { data: registration, error: insertErr } = await supabaseAdmin
      .from("registrations")
      .insert({
        full_name: fullName,
        email: email.toLowerCase(),
        phone: phone || null,
        event_id: eventId,
        status: "confirmed",
      })
      .select()
      .single();
    if (insertErr) throw insertErr;

    await supabaseAdmin
      .from("events")
      .update({ registered: event.registered + 1 })
      .eq("id", eventId);

    try {
      const emailService = getEmailService();
      await emailService.sendConfirmationEmail({
        email: registration.email,
        fullName: registration.full_name,
        eventTitle: event.title,
        eventDate: event.date,
        eventVenue: event.venue,
        phone: registration.phone ?? undefined,
      });
    } catch (err) {
      console.error("⚠️ Registration email failed:", err);
    }

    return NextResponse.json({
      success: true,
      registration,
      message: "Registration successful! Check your email for confirmation.",
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process registration",
      },
      { status: 500 },
    );
  }
}
