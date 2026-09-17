"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  LogOut,
} from "lucide-react";

interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  event: { id: string; title: string; date: string };
}
interface WaitlistEntry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  interest: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<"registrations" | "waitlist">("registrations");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchRegistrations();
  }, [statusFilter]);
  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const url = `/api/admin/registrations${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchWaitlist = async () => {
    try {
      const res = await fetch("/api/admin/waitlist");
      const data = await res.json();
      setWaitlist(data.entries || []);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm("Delete this registration?")) return;
    const res = await fetch(`/api/admin/registrations?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setRegistrations(registrations.filter((r) => r.id !== id));
      alert("Deleted");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete");
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/admin/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setRegistrations(
        registrations.map((r) =>
          r.id === id ? { ...r, status: newStatus } : r,
        ),
      );
      alert("Updated");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update");
    }
  };

  const exportCSV = () => {
    if (tab === "registrations") {
      const headers = ["Name", "Email", "Phone", "Event", "Date", "Status"];
      const rows = registrations.map((r) => [
        r.fullName,
        r.email,
        r.phone || "N/A",
        r.event.title,
        new Date(r.createdAt).toLocaleDateString(),
        r.status,
      ]);
      downloadCSV(
        [headers, ...rows],
        `registrations-${new Date().toISOString().split("T")[0]}.csv`,
      );
    } else {
      const headers = ["Name", "Email", "WhatsApp", "Interest", "Joined"];
      const rows = waitlist.map((w) => [
        w.full_name,
        w.email,
        w.phone,
        w.interest,
        new Date(w.created_at).toLocaleDateString(),
      ]);
      downloadCSV(
        [headers, ...rows],
        `academy-waitlist-${new Date().toISOString().split("T")[0]}.csv`,
      );
    }
  };

  const downloadCSV = (rows: (string | number)[][], filename: string) => {
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    window.location.href = "/admin/login";
  };

  const filtered = registrations.filter(
    (r) =>
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.event.title.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredWaitlist = waitlist.filter(
    (w) =>
      w.full_name.toLowerCase().includes(search.toLowerCase()) ||
      w.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-[#7a7270] mt-1">
              {tab === "registrations"
                ? `${registrations.length} registrations`
                : `${waitlist.length} on academy waitlist`}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[#c9a84c] text-[#0d0d0d] rounded-lg hover:bg-[#a8873a] transition font-semibold"
            >
              <Download size={18} />
              Export CSV
            </button>
            <Link
              href="/admin/events"
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-[#b8b0a8] border border-[#333333] rounded-lg hover:border-[#c9a84c] hover:text-[#c9a84c] transition"
            >
              Manage Events
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("registrations")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === "registrations" ? "bg-[#c9a84c] text-[#0d0d0d]" : "bg-[#1a1a1a] text-[#b8b0a8] border border-[#333333]"}`}
          >
            Registrations
          </button>
          <button
            onClick={() => setTab("waitlist")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === "waitlist" ? "bg-[#c9a84c] text-[#0d0d0d]" : "bg-[#1a1a1a] text-[#b8b0a8] border border-[#333333]"}`}
          >
            Academy Waitlist
          </button>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7270]"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0d0d0d] border border-[#333333] rounded-lg focus:ring-2 focus:ring-[#c9a84c] outline-none text-white"
              />
            </div>
            {tab === "registrations" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-[#0d0d0d] border border-[#333333] rounded-lg focus:ring-2 focus:ring-[#c9a84c] outline-none text-white"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="waitlisted">Waitlisted</option>
              </select>
            )}
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl border border-[#333333] overflow-hidden">
          <div className="overflow-x-auto">
            {tab === "registrations" ? (
              <table className="w-full">
                <thead className="bg-[#0d0d0d] border-b border-[#333333]">
                  <tr>
                    {[
                      "Name",
                      "Email",
                      "Phone",
                      "Event",
                      "Date",
                      "Status",
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-[#7a7270]"
                      >
                        No registrations found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((reg) => (
                      <tr
                        key={reg.id}
                        className="hover:bg-[#2a2a2a] transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                          {reg.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#b8b0a8]">
                          {reg.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#b8b0a8]">
                          {reg.phone || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {reg.event.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#b8b0a8]">
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${reg.status === "confirmed" ? "bg-green-500/20 text-green-400" : reg.status === "cancelled" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}
                          >
                            {reg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            {reg.status !== "confirmed" && (
                              <button
                                onClick={() =>
                                  updateStatus(reg.id, "confirmed")
                                }
                                className="p-1 text-green-400 hover:bg-green-500/20 rounded transition"
                                title="Confirm"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                            {reg.status !== "cancelled" && (
                              <button
                                onClick={() =>
                                  updateStatus(reg.id, "cancelled")
                                }
                                className="p-1 text-red-400 hover:bg-red-500/20 rounded transition"
                                title="Cancel"
                              >
                                <XCircle size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteRegistration(reg.id)}
                              className="p-1 text-[#7a7270] hover:text-red-400 hover:bg-red-500/20 rounded transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead className="bg-[#0d0d0d] border-b border-[#333333]">
                  <tr>
                    {["Name", "Email", "WhatsApp", "Interest", "Joined"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-medium text-[#7a7270] uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333333]">
                  {filteredWaitlist.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-[#7a7270]"
                      >
                        No waitlist entries yet
                      </td>
                    </tr>
                  ) : (
                    filteredWaitlist.map((w) => (
                      <tr key={w.id} className="hover:bg-[#2a2a2a] transition">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                          {w.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#b8b0a8]">
                          {w.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#b8b0a8]">
                          <a
                            href={`https://wa.me/${w.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#c9a84c] transition"
                          >
                            {w.phone}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#c9a84c]/20 text-[#c9a84c]">
                            {w.interest}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#b8b0a8]">
                          {new Date(w.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
