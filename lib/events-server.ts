import "server-only";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { DbEvent } from "@/types/db";
import { sortEvents, computedStatus } from "@/lib/events";

export async function getAllEvents(): Promise<DbEvent[]> {
  const { data, error } = await supabaseAdmin
    .from("events_with_status")
    .select("*");
  if (error) throw error;
  return sortEvents((data ?? []) as DbEvent[]);
}

export async function getFeaturedEvent(): Promise<DbEvent | null> {
  const { data, error } = await supabaseAdmin
    .from("events_with_status")
    .select("*")
    .eq("is_featured", true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as DbEvent) ?? null;
}

export async function getEventBySlug(slug: string): Promise<DbEvent | null> {
  const { data, error } = await supabaseAdmin
    .from("events_with_status")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as DbEvent) ?? null;
}

export async function getUpcomingEvents(): Promise<DbEvent[]> {
  const all = await getAllEvents();
  return all.filter((e) => {
    const s = computedStatus(e);
    return s === "upcoming" || s === "live";
  });
}

export async function getPastEvents(): Promise<DbEvent[]> {
  const all = await getAllEvents();
  return all.filter((e) => computedStatus(e) === "past");
}
