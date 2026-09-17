import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getEmailService } from "@/lib/resend";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const { fullName, email, phone, interest } = await request.json();

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and WhatsApp number are required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (String(phone).replace(/\D/g, "").length < 7) {
      return NextResponse.json(
        { error: "Please enter a valid WhatsApp number with country code." },
        { status: 400 },
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(fullName).trim();
    const cleanPhone = String(phone).trim();
    const cleanInterest = interest || "Not sure yet";

    const { data: existing } = await supabaseAdmin
      .from("academy_waitlist")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You're already on the waitlist! We'll be in touch soon. 🎉",
      });
    }

    const { data: entry, error } = await supabaseAdmin
      .from("academy_waitlist")
      .insert({
        full_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        interest: cleanInterest,
      })
      .select()
      .single();

    if (error) throw error;

    try {
      const emailService = getEmailService();
      await emailService.sendAcademyWaitlistEmail({
        email: cleanEmail,
        fullName: cleanName,
        phone: cleanPhone,
        interest: cleanInterest,
      });
    } catch (err) {
      console.error("⚠️ Academy waitlist email failed:", err);
    }

    return NextResponse.json({
      success: true,
      message:
        "You're on the list! Check your email for confirmation. We'll reach out via WhatsApp soon. 🚀",
      entry: { id: entry.id, email: entry.email },
    });
  } catch (error) {
    console.error("Academy waitlist error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { count } = await supabaseAdmin
      .from("academy_waitlist")
      .select("*", { count: "exact", head: true });
    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
