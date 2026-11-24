import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const BUCKET = "event-images";
const AGE_HOURS = 24;

export async function POST() {
  try {
    const { data: events, error: evErr } = await supabaseAdmin
      .from("events")
      .select("flyer_url, flyers, speakers_data");

    if (evErr) throw evErr;

    const referenced = new Set<string>();

    const extractPath = (url: string | null | undefined) => {
      if (!url) return;
      const marker = `/object/public/${BUCKET}/`;
      const idx = url.indexOf(marker);
      if (idx !== -1) {
        referenced.add(url.slice(idx + marker.length));
      }
    };

    for (const e of events ?? []) {
      extractPath(e.flyer_url);
      if (Array.isArray(e.flyers)) {
        for (const f of e.flyers) extractPath(f);
      }
      if (Array.isArray(e.speakers_data)) {
        for (const s of e.speakers_data) {
          if (s?.photo) extractPath(s.photo);
        }
      }
    }

    const orphans: string[] = [];
    const cutoff = Date.now() - AGE_HOURS * 3600 * 1000;

    for (const folder of ["flyers", "speakers"]) {
      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET)
        .list(folder, { limit: 1000 });
      if (error) continue;
      for (const f of data ?? []) {
        const path = `${folder}/${f.name}`;
        const createdAt = new Date(f.created_at ?? 0).getTime();
        if (createdAt < cutoff && !referenced.has(path)) {
          orphans.push(path);
        }
      }
    }

    if (orphans.length === 0) {
      return NextResponse.json({
        success: true,
        deleted: 0,
        message: "No orphans found",
      });
    }

    const { error: delErr } = await supabaseAdmin.storage
      .from(BUCKET)
      .remove(orphans);

    if (delErr) throw delErr;

    return NextResponse.json({
      success: true,
      deleted: orphans.length,
      paths: orphans,
    });
  } catch (error) {
    console.error("Sweep error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sweep failed" },
      { status: 500 },
    );
  }
}
