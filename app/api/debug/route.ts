import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

type RecentRow = {
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  event: { title: string } | { title: string }[] | null;
};

export async function GET() {
  try {
    const { count: events } = await supabaseAdmin
      .from("events")
      .select("*", { count: "exact", head: true });
    const { count: registrations } = await supabaseAdmin
      .from("registrations")
      .select("*", { count: "exact", head: true });

    const { data: recent } = await supabaseAdmin
      .from("registrations")
      .select("full_name, email, status, created_at, event:events(title)")
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      database: "Supabase (Postgres)",
      counts: {
        events: events ?? 0,
        registrations: registrations ?? 0,
      },
      recentRegistrations: (recent ?? []).map((r: RecentRow) => {
        const ev = Array.isArray(r.event) ? r.event[0] : r.event;
        return {
          name: r.full_name,
          email: r.email,
          event: ev?.title ?? "-",
          status: r.status,
          createdAt: r.created_at,
        };
      }),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
