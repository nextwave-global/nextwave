import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const track = searchParams.get("track");
    const segment = searchParams.get("segment");
    const status = searchParams.get("status");
    const sponsorship = searchParams.get("sponsorship");
    const search = searchParams.get("search");

    let query = supabaseAdmin
      .from("academy_applications")
      .select("*")
      .order("score", { ascending: false })
      .order("created_at", { ascending: false });

    if (track && track !== "all") query = query.eq("track", track);
    if (segment && segment !== "all") query = query.eq("segment", segment);
    if (status && status !== "all") query = query.eq("admin_status", status);
    if (sponsorship === "true") query = query.eq("needs_sponsorship", true);
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,school.ilike.%${search}%`,
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ applications: data ?? [] });
  } catch (error) {
    console.error("Admin applications GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
