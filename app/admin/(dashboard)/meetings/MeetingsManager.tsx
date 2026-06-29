// app/admin/(dashboard)/meetings/MeetingsManager.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import type { MeetingStatus, MeetingType } from "@/types/meeting";
import { MEETING_TYPE_LABELS, MEETING_STATUS_LABELS } from "@/types/meeting";

interface MeetingRow {
  meeting: {
    id: number;
    bookingRef: string;
    meetingDate: string;
    meetingEndDate: string;
    timezone: string;
    durationMinutes: number;
    meetingType: string;
    status: string;
    meetingUrl: string | null;
    assignedTo: string | null;
    notes: string | null;
  };
  clientName: string | null;
  clientEmail: string | null;
  packageName: string | null;
}

interface Stats {
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-500/15 text-blue-400",
  confirmed: "bg-green-500/15 text-green-400",
  completed: "bg-white/10 text-white/50",
  cancelled: "bg-red/10 text-red",
  "no-show": "bg-yellow-500/10 text-yellow-400",
};

export default function MeetingsManager() {
  const [rows, setRows] = useState<MeetingRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<MeetingStatus>("scheduled");
  const [editNotes, setEditNotes] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/meetings?page=${page}&status=${filter}`);
      const data = await res.json();
      setRows(data.meetings ?? []);
      setTotal(data.total ?? 0);
      setStats(data.stats ?? null);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { fetchMeetings(); }, [fetchMeetings]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function openEdit(row: MeetingRow) {
    setEditId(row.meeting.id);
    setEditStatus(row.meeting.status as MeetingStatus);
    setEditNotes(row.meeting.notes ?? "");
    setEditUrl(row.meeting.meetingUrl ?? "");
  }

  async function saveEdit() {
    if (!editId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/meetings/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          notes: editNotes || null,
          meetingUrl: editUrl || null,
        }),
      });
      if (res.ok) {
        setEditId(null);
        showToast("Meeting updated.");
        fetchMeetings();
      } else {
        const errData = await res.json().catch(() => ({})) as { error?: string };
        showToast(errData.error ?? "Failed to save changes. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-4 sm:p-8">
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500/90 text-white text-sm px-4 py-2.5 rounded-lg z-50">
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Meetings</h1>
        <p className="text-white/40 text-sm mt-1">Manage scheduled calls and meetings.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Scheduled", value: stats.scheduled, color: "text-blue-400" },
            { label: "Confirmed", value: stats.confirmed, color: "text-green-400" },
            { label: "Completed", value: stats.completed, color: "text-white/60" },
            { label: "Cancelled", value: stats.cancelled, color: "text-red" },
            { label: "No Show", value: stats.noShow, color: "text-yellow-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-white/8 rounded-xl p-4">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "scheduled", "confirmed", "completed", "cancelled", "no-show"].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-3 py-1.5 text-xs rounded capitalize transition-colors ${
              filter === s
                ? "bg-white/15 text-white"
                : "text-white/40 hover:text-white hover:bg-white/8"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center text-white/30 text-sm">No meetings found.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {rows.map(({ meeting, clientName, clientEmail, packageName }) => (
              <div key={meeting.id} className="px-4 sm:px-6 py-4 flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium text-white">{clientName ?? "Unknown"}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[meeting.status] ?? ""}`}>
                      {MEETING_STATUS_LABELS[meeting.status as MeetingStatus] ?? meeting.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/40">{clientEmail}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {MEETING_TYPE_LABELS[meeting.meetingType as MeetingType] ?? meeting.meetingType}
                    {" · "}
                    {meeting.durationMinutes}min
                    {" · "}
                    {new Date(meeting.meetingDate).toLocaleDateString("en-US", {
                      timeZone: meeting.timezone,
                      month: "short", day: "numeric", year: "numeric",
                    })}
                    {" "}
                    {new Date(meeting.meetingDate).toLocaleTimeString("en-US", {
                      timeZone: meeting.timezone,
                      hour: "numeric", minute: "2-digit",
                    })}
                  </p>
                  <p className="text-[10px] text-red mt-0.5">{meeting.bookingRef}</p>
                  {packageName && (
                    <p className="text-[10px] text-white/25 mt-0.5">{packageName}</p>
                  )}
                </div>
                <button
                  onClick={() => openEdit({ meeting, clientName, clientEmail, packageName })}
                  className="text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded transition-colors shrink-0"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-end">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 text-xs text-white/40 hover:text-white disabled:opacity-30 border border-white/10 rounded transition-colors">
            ← Prev
          </button>
          <span className="px-3 py-1.5 text-xs text-white/40">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 text-xs text-white/40 hover:text-white disabled:opacity-30 border border-white/10 rounded transition-colors">
            Next →
          </button>
        </div>
      )}

      {/* Edit modal */}
      {editId !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/12 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-white">Update Meeting</h2>
            <div>
              <label className="block text-xs text-white/40 mb-1 uppercase tracking-widest">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as MeetingStatus)}
                className="w-full bg-[#1a1a1a] border border-white/12 text-white text-sm py-2.5 px-3 rounded-lg outline-none"
              >
                {["scheduled","confirmed","completed","cancelled","no-show"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1 uppercase tracking-widest">Meeting URL</label>
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#1a1a1a] border border-white/12 text-white text-sm py-2.5 px-3 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1 uppercase tracking-widest">Notes</label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/12 text-white text-sm py-2.5 px-3 rounded-lg outline-none resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex-1 bg-red text-white text-sm py-2.5 rounded-lg hover:bg-[#FF001F] disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={() => setEditId(null)}
                className="flex-1 border border-white/15 text-white/60 text-sm py-2.5 rounded-lg hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
