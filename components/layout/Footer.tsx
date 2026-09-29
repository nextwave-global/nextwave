"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Loader2,
  ExternalLink,
  Star,
  Wallet,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import type { DbApplication } from "@/types/db";
import {
  TRACK_LABELS,
  SEGMENT_META,
  PAYMENT_LABELS,
  OPEN_TO_PAID_LABELS,
  CLASS_VIBE_LABELS,
  scoreColor,
} from "@/lib/applications";

type Filter = {
  track: string;
  segment: string;
  status: string;
  sponsorship: boolean;
  search: string;
};

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<DbApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filter>({
    track: "all",
    segment: "all",
    status: "all",
    sponsorship: false,
    search: "",
  });
  const [selected, setSelected] = useState<DbApplication | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.track !== "all") params.set("track", filters.track);
      if (filters.segment !== "all") params.set("segment", filters.segment);
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.sponsorship) params.set("sponsorship", "true");
      if (filters.search) params.set("search", filters.search);

      const r = await fetch(`/api/admin/applications?${params}`, {
        cache: "no-store",
      });
      const d = await r.json();
      setItems(d.applications ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.track, filters.segment, filters.status, filters.sponsorship]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  const updateStatus = async (id: string, admin_status: string) => {
    const r = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_status, mark_contacted: true }),
    });
    if (r.ok) {
      load();
      if (selected?.id === id)
        setSelected({ ...selected, admin_status: admin_status as any });
    }
  };

  const exportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "WhatsApp",
      "Track",
      "School",
      "Level",
      "Score",
      "Segment",
      "LinkedIn",
      "Earns",
      "Ready",
      "Open to Paid",
      "Class Vibe",
      "Payment",
      "Status",
      "Created",
    ];
    const rows = items.map((a) => [
      a.full_name,
      a.email,
      a.whatsapp,
      TRACK_LABELS[a.track],
      a.school,
      a.level,
      a.score,
      a.segment,
      a.linkedin_url ?? "no",
      a.earns_from_skill ? "yes" : "no",
      a.ready_to_commit ? "yes" : "no",
      a.open_to_paid,
      a.class_vibe,
      PAYMENT_LABELS[a.payment_capacity],
      a.admin_status,
      new Date(a.created_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applications-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <Link
              href="/admin"
              className="text-xs text-[#7a7270] hover:text-[#c9a84c]"
            >
              ← Back to dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white mt-1">Applications</h1>
            <p className="text-[#7a7270] mt-1">
              {items.length} leads · sorted by score
            </p>
          </div>
<<<<<<< HEAD
=======

          {/* Quick Navigation (Col 2: Span 3) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleSectionScroll("about")}
                  className="hover:text-[#c9a84c] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSectionScroll("programs")}
                  className="hover:text-[#c9a84c] transition-colors"
                >
                  Programs &amp; Tracks
                </button>
              </li>
              <li>
                <Link
                  href="/academy"
                  className="hover:text-[#c9a84c] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Academy</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
                    Waitlist
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="hover:text-[#c9a84c] transition-colors"
                >
                  Resource Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details (Col 3: Span 4) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                <a
                  href="mailto:nextwaveglobalinfo@gmail.com"
                  className="hover:text-white transition-colors break-all"
                >
                  nextwaveglobalinfo@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                <span>Virtual &amp; Worldwide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Admin & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs tracking-wider text-[#636363]">
            <span>
              © {new Date().getFullYear()} Nextwave Global. All rights reserved.
            </span>
            <span>•</span>
            <Link
              href="/admin"
              className="text-[#636363] hover:text-[#c9a84c] transition-colors text-[11px] uppercase tracking-widest"
            >
              Admin
            </Link>
          </div>

>>>>>>> 68839c0 (style: link admin page to footer)
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-[#0d0d0d] rounded-lg font-semibold"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270]" />
            <input
              type="text"
              placeholder="Search by name, email, or school..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d0d] border border-[#333333] rounded-lg focus:ring-2 focus:ring-[#c9a84c] outline-none text-white text-sm"
            />
          </div>
          <select
            value={filters.track}
            onChange={(e) => setFilters({ ...filters, track: e.target.value })}
            className="px-4 py-2.5 bg-[#0d0d0d] border border-[#333333] rounded-lg focus:ring-2 focus:ring-[#c9a84c] outline-none text-white text-sm"
          >
            <option value="all">All tracks</option>
            <option value="video_editing">Video Editing</option>
            <option value="brand_design">Brand Design</option>
            <option value="social_media">Social Media Management</option>
            <option value="copywriting">Copywriting</option>
          </select>
          <select
            value={filters.segment}
            onChange={(e) =>
              setFilters({ ...filters, segment: e.target.value })
            }
            className="px-4 py-2.5 bg-[#0d0d0d] border border-[#333333] rounded-lg focus:ring-2 focus:ring-[#c9a84c] outline-none text-white text-sm"
          >
            <option value="all">All segments</option>
            <option value="hot">🔥 Hot</option>
            <option value="warm">🌤️ Warm</option>
            <option value="curious">❄️ Curious</option>
            <option value="sponsorship">🤝 Sponsorship</option>
          </select>

          <div className="md:col-span-4 flex flex-wrap gap-2 items-center">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="px-4 py-2 bg-[#0d0d0d] border border-[#333333] rounded-lg text-white text-sm"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="rejected">Rejected</option>
              <option value="enrolled">Enrolled</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-[#b8b0a8] cursor-pointer">
              <input
                type="checkbox"
                checked={filters.sponsorship}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sponsorship: e.target.checked,
                  })
                }
              />
              Only needs sponsorship
            </label>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0d0d0d] border-b border-[#333333]">
                <tr>
                  {[
                    "Score",
                    "Name",
                    "Track",
                    "School",
                    "LinkedIn",
                    "Pays",
                    "Segment",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-[#7a7270] uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333333]">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-8 text-center">
                      <Loader2 className="w-5 h-5 animate-spin text-[#c9a84c] mx-auto" />
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-8 text-center text-[#7a7270]"
                    >
                      No applications yet
                    </td>
                  </tr>
                ) : (
                  items.map((a) => {
                    const meta = SEGMENT_META[a.segment];
                    return (
                      <tr
                        key={a.id}
                        className="hover:bg-[#2a2a2a] cursor-pointer"
                        onClick={() => setSelected(a)}
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`font-bold text-lg tabular-nums ${scoreColor(a.score)}`}
                          >
                            {a.score}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-white text-sm whitespace-nowrap">
                            {a.full_name}
                          </div>
                          <div className="text-xs text-[#7a7270] whitespace-nowrap">
                            {a.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#b8b0a8] whitespace-nowrap">
                          {TRACK_LABELS[a.track]}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#b8b0a8] max-w-[140px] truncate">
                          {a.school}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {a.linkedin_url ? (
                            <a
                              href={a.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[#0A66C2] hover:text-[#0A66C2]/80"
                            >
                              <FaLinkedin className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="text-[#7a7270] text-xs">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#b8b0a8] whitespace-nowrap">
                          {PAYMENT_LABELS[a.payment_capacity]}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${meta.color}`}
                          >
                            {meta.emoji} {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-[#b8b0a8] capitalize">
                            {a.admin_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <ExternalLink className="w-4 h-4 text-[#7a7270]" />
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

      {/* Drawer */}
      {selected && (
        <ApplicationDrawer
          application={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
}

function ApplicationDrawer({
  application,
  onClose,
  onUpdateStatus,
}: {
  application: DbApplication;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  const meta = SEGMENT_META[application.segment];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-[#1a1a1a] border-l border-[#333333] overflow-y-auto">
        <div className="p-6 border-b border-[#333333] sticky top-0 bg-[#1a1a1a] z-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${meta.color}`}
                >
                  {meta.emoji} {meta.label}
                </span>
                <span
                  className={`text-2xl font-bold tabular-nums ${scoreColor(application.score)}`}
                >
                  {application.score}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {application.full_name}
              </h2>
              <p className="text-sm text-[#7a7270]">{application.email}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#7a7270] hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <Section title="Personal">
            <Row label="WhatsApp">
              <a
                href={`https://wa.me/${application.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:underline"
              >
                {application.whatsapp}
              </a>
            </Row>
            <Row label="School">{application.school}</Row>
            <Row label="Level">{application.level}</Row>
            <Row label="Track">{TRACK_LABELS[application.track]}</Row>
          </Section>

          <Section title="Visibility & Experience">
            <Row label="LinkedIn">
              {application.linkedin_url ? (
                <a
                  href={application.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0A66C2] hover:underline break-all"
                >
                  {application.linkedin_url}
                </a>
              ) : (
                "No"
              )}
            </Row>
            <Row label="Socially active">
              {application.is_social_active ? "Yes" : "No"}
            </Row>
            <Row label="Prior skill">
              {application.has_prior_skill
                ? application.prior_skill_name || "Yes"
                : "No"}
            </Row>
            <Row label="Earns from skill">
              {application.earns_from_skill ? "Yes" : "No"}
            </Row>
          </Section>

          <Section title="Goals & Intent">
            <Row label="Goal">
              <span className="whitespace-pre-line">{application.goal}</span>
            </Row>
            <Row label="Ready to commit">
              {application.ready_to_commit ? "Yes" : "No"}
            </Row>
            <Row label="Open to paid">
              {OPEN_TO_PAID_LABELS[application.open_to_paid]}
            </Row>
            <Row label="Class vibe">
              {CLASS_VIBE_LABELS[application.class_vibe]}
            </Row>
          </Section>

          <Section title="Payment">
            <Row label="Capacity">
              <span className="inline-flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-[#c9a84c]" />
                {PAYMENT_LABELS[application.payment_capacity]}
              </span>
            </Row>
          </Section>

          <Section title="Admin">
            <div className="grid grid-cols-2 gap-2 mt-2">
              {(
                [
                  "new",
                  "contacted",
                  "qualified",
                  "enrolled",
                  "rejected",
                ] as const
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateStatus(application.id, s)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition border ${
                    application.admin_status === s
                      ? "bg-[#c9a84c] text-[#0d0d0d] border-[#c9a84c]"
                      : "bg-[#0d0d0d] text-[#b8b0a8] border-[#333333] hover:border-[#c9a84c]/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {application.contacted_at && (
              <p className="text-[11px] text-[#7a7270] mt-3">
                Last contacted:{" "}
                {new Date(application.contacted_at).toLocaleString()}
              </p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] mb-3">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <span className="text-[#7a7270]">{label}</span>
      <span className="text-white col-span-2">{children}</span>
    </div>
  );
}
