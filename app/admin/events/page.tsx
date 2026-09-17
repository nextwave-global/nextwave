"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Star, ExternalLink, Loader2 } from "lucide-react";
import type { DbEvent } from "@/types/db";
import { computedStatus, statusLabel, statusColor } from "@/lib/events";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/events");
      const d = await r.json();
      setEvents(d.events ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (id: string) => {
    if (!confirm("Delete this event and all its registrations?")) return;
    const r = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
    if (r.ok) load();
    else alert("Failed to delete");
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/admin"
              className="text-xs text-[#7a7270] hover:text-[#c9a84c]"
            >
              ← Back to dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white mt-1">Events</h1>
            <p className="text-[#7a7270] mt-1">
              Status auto-updates based on date & time.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] rounded-lg font-semibold"
          >
            <Plus size={18} /> {showForm ? "Close" : "Add Event"}
          </button>
        </div>

        {showForm && (
          <EventForm
            onCreated={() => {
              setShowForm(false);
              load();
            }}
          />
        )}

        <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0d0d0d] border-b border-[#333333]">
                <tr>
                  {[
                    "Title",
                    "Category",
                    "Starts",
                    "Status",
                    "Featured",
                    "Registered",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-[#7a7270] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333333]">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-[#7a7270]"
                    >
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-[#7a7270]"
                    >
                      No events yet
                    </td>
                  </tr>
                ) : (
                  events.map((e) => {
                    const s = computedStatus(e);
                    return (
                      <tr key={e.id} className="hover:bg-[#2a2a2a]">
                        <td className="px-6 py-4">
                          <Link
                            href={`/events/${e.slug}`}
                            target="_blank"
                            className="font-medium text-white hover:text-[#c9a84c] flex items-center gap-1"
                          >
                            {e.title}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#b8b0a8]">
                          {e.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#b8b0a8]">
                          {e.starts_at
                            ? new Date(e.starts_at).toLocaleString()
                            : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor(s)}`}
                          >
                            {statusLabel(s)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {e.is_featured ? (
                            <Star className="w-4 h-4 text-[#c9a84c] fill-[#c9a84c]" />
                          ) : (
                            <span className="text-[#7a7270]">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#b8b0a8]">
                          {e.registered}/{e.capacity}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => del(e.id)}
                            className="p-1 text-[#7a7270] hover:text-red-400 hover:bg-red-500/20 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Learn",
    starts_at: "",
    ends_at: "",
    venue: "Virtual",
    price: "Free",
    capacity: 500,
    flyer_url: "",
    whatsapp_url: "",
    is_featured: false,
    tags: "",
    override_status: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const r = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          starts_at: new Date(form.starts_at).toISOString(),
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
          tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
          override_status: form.override_status || null,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");
      onCreated();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  const field =
    "w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#333333] rounded-lg focus:ring-2 focus:ring-[#c9a84c] outline-none text-white text-sm";
  const label =
    "block text-xs font-semibold text-[#b8b0a8] mb-1.5 uppercase tracking-wider";

  return (
    <form
      onSubmit={submit}
      className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-6 space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={label}>Title *</label>
          <input
            required
            className={field}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className={label}>Description</label>
          <textarea
            rows={3}
            className={field}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Category</label>
          <select
            className={field}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option>Learn</option>
            <option>Earn</option>
            <option>Lead</option>
          </select>
        </div>
        <div>
          <label className={label}>Venue</label>
          <input
            className={field}
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Starts At *</label>
          <input
            required
            type="datetime-local"
            className={field}
            value={form.starts_at}
            onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Ends At</label>
          <input
            type="datetime-local"
            className={field}
            value={form.ends_at}
            onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Price</label>
          <input
            className={field}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Capacity</label>
          <input
            type="number"
            className={field}
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <label className={label}>Flyer URL</label>
          <input
            className={field}
            placeholder="/events/flyer.jpg"
            value={form.flyer_url}
            onChange={(e) => setForm({ ...form, flyer_url: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>WhatsApp URL</label>
          <input
            className={field}
            value={form.whatsapp_url}
            onChange={(e) => setForm({ ...form, whatsapp_url: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Tags (comma-separated)</label>
          <input
            className={field}
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Override Status (optional)</label>
          <select
            className={field}
            value={form.override_status}
            onChange={(e) =>
              setForm({ ...form, override_status: e.target.value })
            }
          >
            <option value="">Auto (based on dates)</option>
            <option value="draft">Draft</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="md:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            checked={form.is_featured}
            onChange={(e) =>
              setForm({ ...form, is_featured: e.target.checked })
            }
          />
          <label htmlFor="featured" className="text-sm text-[#b8b0a8]">
            Feature this event (hero + popup + home register)
          </label>
        </div>
      </div>
      {err && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {err}
        </div>
      )}
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-lg disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Event"}
      </button>
    </form>
  );
}
