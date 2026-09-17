import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getEmailService } from "@/lib/resend";
import { formatEventDate } from "@/lib/events";

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, eventId } = await request.json();

    if (!fullName || !email || !eventId) {
      return NextResponse.json(
        { error: "Full name, email, and event ID are required" },
        { status: 400 },
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(fullName).trim();
    const cleanPhone = phone ? String(phone).trim() : null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Load event + derived status
    const { data: event, error: eventErr } = await supabaseAdmin
      .from("events_with_status")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventErr || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const status = event.computed_status as string;
    if (status === "past" || status === "cancelled" || status === "draft") {
      return NextResponse.json(
        { error: "Registration is not open for this event" },
        { status: 400 },
      );
    }

    if (event.registration_open === false) {
      return NextResponse.json(
        { error: "Registration is closed" },
        { status: 400 },
      );
    }

    if (event.registered >= event.capacity) {
      return NextResponse.json(
        { error: "Event is fully booked" },
        { status: 400 },
      );
    }

    // Duplicate check
    const { data: existing } = await supabaseAdmin
      .from("registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 400 },
      );
    }

    // Insert
    const { data: registration, error: insertErr } = await supabaseAdmin
      .from("registrations")
      .insert({
        full_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        event_id: eventId,
        status: "confirmed",
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    // Increment registered count
    await supabaseAdmin
      .from("events")
      .update({ registered: (event.registered ?? 0) + 1 })
      .eq("id", eventId);

    // Emails (non-blocking)
    const eventDateStr = formatEventDate(
      event.starts_at,
      event.timezone ?? undefined,
    );

    try {
      const emailService = getEmailService();

      await emailService.sendConfirmationEmail({
        email: registration.email,
        fullName: registration.full_name,
        eventTitle: event.title,
        eventDate: eventDateStr,
        eventVenue: event.venue,
        phone: registration.phone ?? undefined,
      });

      await emailService.sendAdminNotification({
        email: registration.email,
        fullName: registration.full_name,
        eventTitle: event.title,
        eventDate: eventDateStr,
        eventVenue: event.venue,
        phone: registration.phone ?? undefined,
      });
    } catch (err) {
      console.error("⚠️ Email sending failed:", err);
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
