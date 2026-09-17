import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getEmailService } from "@/lib/resend";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status)
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    const valid = ["confirmed", "cancelled", "waitlisted"];
    if (!valid.includes(status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const { data: registration, error } = await supabaseAdmin
      .from("registrations")
      .update({ status })
      .eq("id", id)
      .select(
        "id, full_name, email, phone, status, event_id, event:events(id,title,date,venue)",
      )
      .single();

    if (error || !registration) throw error ?? new Error("Not found");

    if (status === "confirmed" || status === "cancelled") {
      try {
        const emailService = getEmailService();
        await emailService.sendConfirmationEmail({
          email: registration.email,
          fullName: registration.full_name,
          eventTitle: (registration as any).event?.title ?? "Event",
          eventDate: (registration as any).event?.date ?? "",
          eventVenue: (registration as any).event?.venue ?? "",
        });
      } catch (err) {
        console.error("⚠️ Status email failed:", err);
      }
    }

    return NextResponse.json({
      success: true,
      registration,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error("Error updating registration status:", error);
    return NextResponse.json(
      { error: "Failed to update registration status" },
      { status: 500 },
    );
  }
}
