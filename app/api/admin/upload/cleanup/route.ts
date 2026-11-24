import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const BUCKET = "event-images";

export async function POST(request: NextRequest) {
  try {
    const { paths } = await request.json();

    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json({ success: true, deleted: 0 });
    }

    const safe = paths
      .filter((p) => typeof p === "string" && p.length > 0)
      .filter((p) => !p.startsWith("/") && !p.includes(".."))
      .slice(0, 50);

    if (safe.length === 0) {
      return NextResponse.json({ success: true, deleted: 0 });
    }

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .remove(safe);

    if (error) throw error;

    return NextResponse.json({ success: true, deleted: safe.length });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Failed to clean up files" },
      { status: 500 },
    );
  }
}
