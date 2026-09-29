import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getEmailService } from "@/lib/resend";
import { TRACK_LABELS } from "@/lib/applications";
import type { ApplicationTrack } from "@/types/db";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
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

const VALID_TRACKS: ApplicationTrack[] = [
  "video_editing",
  "brand_design",
  "social_media",
  "copywriting",
];

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();

    // --- Validate ---
    const required = [
      "track",
      "fullName",
      "whatsapp",
      "email",
      "school",
      "level",
      "goal",
      "openToPaid",
      "classVibe",
      "paymentCapacity",
    ];
    for (const key of required) {
      if (!body[key]) {
        return NextResponse.json(
          { error: `Missing field: ${key}` },
          { status: 400 },
        );
      }
    }

    if (!VALID_TRACKS.includes(body.track)) {
      return NextResponse.json({ error: "Invalid track" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (String(body.whatsapp).replace(/\D/g, "").length < 7) {
      return NextResponse.json(
        { error: "Invalid WhatsApp number" },
        { status: 400 },
      );
    }

    const cleanEmail = String(body.email).trim().toLowerCase();

    // Duplicate check
    const { data: existing } = await supabaseAdmin
      .from("academy_applications")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        duplicate: true,
        message: "You already applied! We'll reach out soon. 🎉",
      });
    }

    // --- Insert (score auto-computed by trigger) ---
    const { data: application, error } = await supabaseAdmin
      .from("academy_applications")
      .insert({
        track: body.track,
        full_name: String(body.fullName).trim(),
        whatsapp: String(body.whatsapp).trim(),
        email: cleanEmail,
        school: String(body.school).trim(),
        level: String(body.level).trim(),

        has_linkedin: !!body.hasLinkedin,
        linkedin_url: body.linkedinUrl ? String(body.linkedinUrl).trim() : null,
        is_social_active: !!body.isSocialActive,
        has_prior_skill: !!body.hasPriorSkill,
        prior_skill_name: body.priorSkillName
          ? String(body.priorSkillName).trim()
          : null,
        earns_from_skill: !!body.earnsFromSkill,

        goal: String(body.goal).trim(),
        ready_to_commit: !!body.readyToCommit,
        open_to_paid: body.openToPaid,
        class_vibe: body.classVibe,

        payment_capacity: body.paymentCapacity,
      })
      .select()
      .single();

    if (error) throw error;

    // --- Email (non-blocking) ---
    try {
      const emailService = getEmailService();
      const trackLabel = TRACK_LABELS[application.track as ApplicationTrack];

      await emailService.sendConfirmationEmail({
        email: application.email,
        fullName: application.full_name,
        eventTitle: `NextWave Academy — ${trackLabel} Class`,
        eventDate: "We'll confirm the date shortly",
        eventVenue: "Online (WhatsApp + Live Session)",
        phone: application.whatsapp,
      });
    } catch (err) {
      console.error("⚠️ Application email failed:", err);
    }

    return NextResponse.json({
      success: true,
      message:
        "Application received! Check your email and WhatsApp for next steps. 🚀",
      application: {
        id: application.id,
        track: application.track,
        segment: application.segment,
      },
    });
  } catch (error) {
    console.error("Academy application error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
