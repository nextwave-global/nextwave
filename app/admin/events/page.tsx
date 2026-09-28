"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Star,
  ExternalLink,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import type { DbEvent, Speaker } from "@/types/db";
import { computedStatus, statusLabel, statusColor, slugify } from "@/lib/events";
import { ImageUpload } from "@/components/ui/ImageUpload";

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

const emptySpeaker = (): Speaker => ({
  name: "",
  title: "",
  bio: "",
  photo: "",
  socials: {},
});

export default function AdminEventsPage() {
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DbEvent | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/events", { cache: "no-store" });
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

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (e: DbEvent) => {
    setEditing(e);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const onSaved = () => {
    closeForm();
    load();
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <Link
              href="/admin"
              className="text-xs text-[#7a7270] hover:text-[#c9a84c]"
            >
              ← Back to dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Events
            </h1>
            <p className="text-[#7a7270] mt-1 text-sm">
              Status auto-updates based on date &amp; time.
            </p>
          </div>
          <button
            onClick={showForm ? closeForm : openNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] rounded-lg font-semibold text-sm"
          >
            {showForm ? (
              <>
                <X size={16} /> Close
              </>
            ) : (
              <>
                <Plus size={16} /> Add Event
              </>
            )}
          </button>
        </div>

        {showForm && (
          <EventForm initial={editing} onSaved={onSaved} onCancel={closeForm} />
        )}

        <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-[#0d0d0d] border-b border-[#333333]">
                <tr>
                  {[
                    "Title",
                    "Starts",
                    "Status",
                    "★",
                    "👥",
                    "🖼",
                    "Reg.",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-[#7a7270] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333333]">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#c9a84c]" />
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-[#7a7270] text-sm"
                    >
                      No events yet
                    </td>
                  </tr>
                ) : (
                  events.map((e) => {
                    const s = computedStatus(e);
                    return (
                      <tr key={e.id} className="hover:bg-[#2a2a2a]">
                        <td className="px-4 py-3">
                          <Link
                            href={`/events/${e.slug}`}
                            target="_blank"
                            className="font-medium text-white hover:text-[#c9a84c] flex items-center gap-1 text-sm"
                          >
                            {e.title}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#b8b0a8] whitespace-nowrap">
                          {e.starts_at
                            ? new Date(e.starts_at).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-medium border whitespace-nowrap ${statusColor(s)}`}
                          >
                            {statusLabel(s)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {e.is_featured ? (
                            <Star className="w-4 h-4 text-[#c9a84c] fill-[#c9a84c]" />
                          ) : (
                            <span className="text-[#7a7270]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#b8b0a8]">
                          {e.speakers_data?.length ?? 0}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#b8b0a8]">
                          {e.flyers?.length ?? (e.flyer_url ? 1 : 0)}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#b8b0a8] whitespace-nowrap">
                          {e.registered}/{e.capacity}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(e)}
                              className="p-1.5 text-[#7a7270] hover:text-[#c9a84c] hover:bg-[#c9a84c]/20 rounded transition touch-manipulation"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => del(e.id)}
                              className="p-1.5 text-[#7a7270] hover:text-red-400 hover:bg-red-500/20 rounded transition touch-manipulation"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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

interface FormProps {
  initial: DbEvent | null;
  onSaved: () => void;
  onCancel: () => void;
}

function EventForm({ initial, onSaved, onCancel }: FormProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    tagline: initial?.tagline ?? "",
    description: initial?.description ?? "",
    category: initial?.category ?? "Learn",
    starts_at: toLocalInput(initial?.starts_at ?? null),
    ends_at: toLocalInput(initial?.ends_at ?? null),
    venue: initial?.venue ?? "Virtual",
    price: initial?.price ?? "Free",
    capacity: initial?.capacity ?? 500,
    whatsapp_url: initial?.whatsapp_url ?? "",
    is_featured: initial?.is_featured ?? false,
    tags: (initial?.tags ?? []).join(", "),
    override_status: initial?.override_status ?? "",
  });

  const [flyers, setFlyers] = useState<string[]>(
    initial?.flyers && initial.flyers.length > 0
      ? initial.flyers
      : initial?.flyer_url
        ? [initial.flyer_url]
        : [],
  );

  const [speakers, setSpeakers] = useState<Speaker[]>(
    initial?.speakers_data && initial.speakers_data.length > 0
      ? initial.speakers_data
      : [],
  );

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // ===== Orphan tracking =====
  // Paths uploaded during this form session that aren't yet committed.
  // If the user cancels, we delete these from storage.
  const uploadedPaths = useRef<Set<string>>(new Set());
  const committed = useRef(false); // becomes true on successful save

  // Best-effort cleanup if the user closes the tab without saving
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (committed.current || uploadedPaths.current.size === 0) return;
      // sendBeacon is fire-and-forget; works during page unload
      const body = JSON.stringify({
        paths: Array.from(uploadedPaths.current),
      });
      navigator.sendBeacon?.(
        "/api/admin/upload/cleanup",
        new Blob([body], { type: "application/json" }),
      );
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const trackUploaded = (path: string) => {
    uploadedPaths.current.add(path);
  };

  const untrackRemoved = (path: string) => {
    // The user removed the image inside the form; don't try to clean it up later
    uploadedPaths.current.delete(path);
  };

  // ===== Flyers =====
  const addFlyer = () => setFlyers((f) => [...f, ""]);
  const removeFlyer = (i: number) =>
    setFlyers((f) => f.filter((_, idx) => idx !== i));
  const updateFlyer = (i: number, v: string) =>
    setFlyers((f) => f.map((x, idx) => (idx === i ? v : x)));

  // ===== Speakers =====
  const addSpeaker = () => setSpeakers((s) => [...s, emptySpeaker()]);
  const removeSpeaker = (i: number) =>
    setSpeakers((s) => s.filter((_, idx) => idx !== i));
  const updateSpeaker = (i: number, patch: Partial<Speaker>) =>
    setSpeakers((s) =>
      s.map((sp, idx) => (idx === i ? { ...sp, ...patch } : sp)),
    );

  // ===== Cleanup on cancel =====
  const handleCancel = async () => {
    const paths = Array.from(uploadedPaths.current);
    if (paths.length > 0) {
      try {
        await fetch("/api/admin/upload/cleanup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paths }),
        });
      } catch (e) {
        console.error("Cleanup failed (non-blocking):", e);
      }
      uploadedPaths.current.clear();
    }
    onCancel();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const cleanFlyers = flyers.map((f) => f.trim()).filter(Boolean);
      const primaryFlyer = cleanFlyers[0] || "";

      const r = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initial?.id,
          slug: initial?.slug,
          ...form,
          flyer_url: primaryFlyer,
          flyers: cleanFlyers,
          speakers_data: speakers.filter((s) => s.name.trim()),
          starts_at: new Date(form.starts_at).toISOString(),
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
          tags: form.tags
            ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
          override_status: form.override_status || null,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Failed");

      // Mark as committed BEFORE onSaved() unmounts us
      committed.current = true;
      onSaved();
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
  const previewSlug = form.title ? slugify(form.title) : "your-event-slug";

  return (
    <form
      onSubmit={submit}
      className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-4 sm:p-6 space-y-5"
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
          <label className={label}>Slug</label>
          <code className="block px-4 py-2 bg-[#0d0d0d] border border-[#333333] rounded-lg text-xs text-[#c9a84c] break-all">
            /events/{initial?.slug ?? previewSlug}
          </code>
        </div>

        <div className="md:col-span-2">
          <label className={label}>Tagline (optional)</label>
          <input
            className={field}
            placeholder="Ex: Make your break count"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </div>

        <div className="md:col-span-2">
          <label className={label}>Description</label>
          <textarea
            rows={4}
            className={field}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
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

        {/* ===== FLYERS ===== */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <label className={label} style={{ marginBottom: 0 }}>
              Flyers ({flyers.length})
            </label>
            <button
              type="button"
              onClick={addFlyer}
              className="text-xs text-[#c9a84c] hover:text-[#a8873a] font-semibold flex items-center gap-1 touch-manipulation"
            >
              <Plus size={14} /> Add flyer
            </button>
          </div>

          {flyers.length === 0 ? (
            <button
              type="button"
              onClick={addFlyer}
              className="w-full py-6 border-2 border-dashed border-[#333333] hover:border-[#c9a84c] rounded-lg text-[#7a7270] hover:text-[#c9a84c] transition-colors flex flex-col items-center gap-2 touch-manipulation"
            >
              <Plus size={20} />
              <span className="text-xs font-semibold">
                Add your first flyer
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {flyers.map((f, i) => (
                <div key={i} className="relative">
                  <ImageUpload
                    value={f}
                    onChange={(url) => updateFlyer(i, url)}
                    onUploaded={trackUploaded}
                    onRemoved={untrackRemoved}
                    folder="flyers"
                    aspect="portrait"
                  />
                  <button
                    type="button"
                    onClick={() => removeFlyer(i)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full touch-manipulation z-10"
                    title="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                  <p className="text-[9px] text-[#7a7270] text-center mt-1">
                    Flyer {i + 1}
                  </p>
                </div>
              ))}
            </div>
          )}
          <p className="text-[10px] text-[#7a7270] mt-2">
            First flyer is used on cards and social previews.
          </p>
        </div>

        {/* ===== SPEAKERS ===== */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <label className={label} style={{ marginBottom: 0 }}>
              Speakers ({speakers.length})
            </label>
            <button
              type="button"
              onClick={addSpeaker}
              className="text-xs text-[#c9a84c] hover:text-[#a8873a] font-semibold flex items-center gap-1 touch-manipulation"
            >
              <Plus size={14} /> Add speaker
            </button>
          </div>

          {speakers.length === 0 ? (
            <p className="text-xs text-[#7a7270] italic py-2">
              No speakers added. Optional.
            </p>
          ) : (
            <div className="space-y-4">
              {speakers.map((sp, i) => (
                <div
                  key={i}
                  className="bg-[#0d0d0d] border border-[#333333] rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#c9a84c]">
                      Speaker #{i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSpeaker(i)}
                      className="p-1 text-[#7a7270] hover:text-red-400 hover:bg-red-500/20 rounded transition touch-manipulation"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-[120px_1fr] gap-4">
                    <ImageUpload
                      value={sp.photo ?? ""}
                      onChange={(url) => updateSpeaker(i, { photo: url })}
                      onUploaded={trackUploaded}
                      onRemoved={untrackRemoved}
                      folder="speakers"
                      aspect="square"
                      label="Photo"
                    />

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-[#7a7270] font-semibold block mb-1">
                          Name *
                        </label>
                        <input
                          className={field}
                          value={sp.name}
                          onChange={(e) =>
                            updateSpeaker(i, { name: e.target.value })
                          }
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#7a7270] font-semibold block mb-1">
                          Title / Role
                        </label>
                        <input
                          className={field}
                          value={sp.title ?? ""}
                          onChange={(e) =>
                            updateSpeaker(i, { title: e.target.value })
                          }
                          placeholder="Ex: CEO at Company"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#7a7270] font-semibold block mb-1">
                      Bio
                    </label>
                    <textarea
                      rows={2}
                      className={field}
                      value={sp.bio ?? ""}
                      onChange={(e) =>
                        updateSpeaker(i, { bio: e.target.value })
                      }
                      placeholder="Short bio (1-2 sentences)"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {(["linkedin", "x", "whatsapp", "website"] as const).map(
                      (key) => (
                        <div key={key}>
                          <label className="text-[10px] text-[#7a7270] font-semibold block mb-1 capitalize">
                            {key === "x" ? "X (Twitter)" : key}
                          </label>
                          <input
                            className={field}
                            value={sp.socials?.[key] ?? ""}
                            onChange={(e) =>
                              updateSpeaker(i, {
                                socials: {
                                  ...(sp.socials || {}),
                                  [key]: e.target.value,
                                },
                              })
                            }
                            placeholder={
                              key === "linkedin"
                                ? "https://linkedin.com/in/..."
                                : key === "x"
                                  ? "https://x.com/..."
                                  : key === "whatsapp"
                                    ? "https://wa.me/..."
                                    : "https://..."
                            }
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className={label}>WhatsApp URL</label>
          <input
            className={field}
            value={form.whatsapp_url}
            onChange={(e) =>
              setForm({ ...form, whatsapp_url: e.target.value })
            }
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
          <label className={label}>Override Status</label>
          <select
            className={field}
            value={form.override_status}
            onChange={(e) =>
              setForm({ ...form, override_status: e.target.value })
            }
          >
            <option value="">Auto</option>
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
            className="w-4 h-4"
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

      <div className="flex gap-3 sticky bottom-0 bg-[#1a1a1a] pt-4 -mx-4 sm:-mx-6 px-4 sm:px-6 border-t border-[#333333]">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 sm:flex-none px-6 py-3 bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold rounded-lg disabled:opacity-50 touch-manipulation"
        >
          {saving ? "Saving..." : initial ? "Update Event" : "Create Event"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 sm:flex-none px-6 py-3 bg-[#0d0d0d] hover:bg-[#2a2a2a] text-[#b8b0a8] border border-[#333333] rounded-lg font-semibold touch-manipulation"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
