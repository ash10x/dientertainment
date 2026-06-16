"use client";

import { useState, useCallback } from "react";

type ActivityLog = {
  id: number;
  type: string;
  description: string;
  meta: string | null;
  ip: string | null;
  createdAt: Date;
};

const TYPE_META: Record<string, { color: string; dot: string; label: string }> = {
  contact:    { color: "text-blue-400 bg-blue-400/12 border-blue-400/30",     dot: "#3b82f6", label: "Contact"    },
  booking:    { color: "text-violet-400 bg-violet-400/12 border-violet-400/30", dot: "#8b5cf6", label: "Booking"   },
  work:       { color: "text-emerald-400 bg-emerald-400/12 border-emerald-400/30", dot: "#10b981", label: "Work"   },
  service:    { color: "text-amber-400 bg-amber-400/12 border-amber-400/30",   dot: "#f59e0b", label: "Service"    },
  package:    { color: "text-orange-400 bg-orange-400/12 border-orange-400/30", dot: "#f97316", label: "Package"  },
  testimonial:{ color: "text-pink-400 bg-pink-400/12 border-pink-400/30",      dot: "#ec4899", label: "Testimonial"},
  stat:       { color: "text-cyan-400 bg-cyan-400/12 border-cyan-400/30",      dot: "#06b6d4", label: "Stat"      },
  hero:       { color: "text-lime-400 bg-lime-400/12 border-lime-400/30",      dot: "#84cc16", label: "Hero"      },
  nav:        { color: "text-indigo-400 bg-indigo-400/12 border-indigo-400/30", dot: "#6366f1", label: "Nav"      },
  user:       { color: "text-red-400 bg-red-400/12 border-red-400/30",         dot: "#ef4444", label: "User"      },
  setting:    { color: "text-slate-400 bg-slate-400/12 border-slate-400/30",   dot: "#94a3b8", label: "Setting"   },
  submission: { color: "text-blue-400 bg-blue-400/12 border-blue-400/30",      dot: "#3b82f6", label: "Submission"},
};

function fallbackMeta(type: string) {
  return TYPE_META[type] ?? { color: "text-white/40 bg-white/8 border-white/15", dot: "#555", label: type };
}

function Badge({ type }: { type: string }) {
  const m = fallbackMeta(type);
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] tracking-widest uppercase font-semibold ${m.color}`}>
      {m.label}
    </span>
  );
}

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

const PAGE_SIZE = 50;

export default function ActivityManager({ initialLogs }: { initialLogs: ActivityLog[] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [view, setView] = useState<"feed" | "table">("feed");

  const allTypes = ["all", ...Array.from(new Set(logs.map((l) => l.type))).sort()];
  const filtered = filter === "all" ? logs : logs.filter((l) => l.type === filter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(0, page * PAGE_SIZE);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await fetch("/api/admin/activity");
      if (r.ok) setLogs(await r.json());
    } finally {
      setRefreshing(false);
    }
  }, []);

  async function clearOld() {
    if (!confirm("Delete activity logs older than 30 days?")) return;
    setClearing(true);
    try {
      await fetch("/api/admin/activity/clear", { method: "DELETE" });
      await refresh();
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Activity Log</h1>
          <p className="text-white/35 text-sm mt-1">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            {filter !== "all" && <span className="text-white/20"> · filtered by {filter}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex bg-white/6 rounded-lg p-0.5">
            <button
              onClick={() => setView("feed")}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors ${view === "feed" ? "bg-white/12 text-white" : "text-white/40 hover:text-white/70"}`}
            >
              Feed
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 rounded-md text-xs transition-colors ${view === "table" ? "bg-white/12 text-white" : "text-white/40 hover:text-white/70"}`}
            >
              Table
            </button>
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/6 hover:bg-white/12 text-white/50 hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Refresh"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={refreshing ? "animate-spin" : ""}>
              <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
          <button
            onClick={clearOld}
            disabled={clearing}
            className="px-3 h-8 rounded-lg bg-white/6 hover:bg-red-500/15 text-white/40 hover:text-red-400 text-xs transition-colors disabled:opacity-50 cursor-pointer border border-transparent hover:border-red-500/20"
          >
            Clear old
          </button>
        </div>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {allTypes.map((t) => (
          <button
            key={t}
            onClick={() => { setFilter(t); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-widest font-medium transition-colors cursor-pointer ${
              filter === t
                ? "bg-[#E50019] text-white"
                : "bg-white/6 text-white/40 hover:text-white hover:bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Feed view */}
      {view === "feed" && (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/6" />

          <div className="space-y-1">
            {paginated.length === 0 ? (
              <div className="py-16 text-center text-white/25 text-sm">No activity logged yet.</div>
            ) : (
              paginated.map((log) => {
                const m = fallbackMeta(log.type);
                return (
                  <div key={log.id} className="relative flex items-start gap-4 pl-10 py-3 group">
                    {/* Dot */}
                    <div
                      className="absolute left-3.5 top-4 w-2.5 h-2.5 rounded-full ring-2 ring-[#0A0A0A] flex-shrink-0 -translate-x-1/2"
                      style={{ backgroundColor: m.dot }}
                    />
                    <div className="flex-1 min-w-0 bg-white/3 hover:bg-white/5 border border-white/6 rounded-xl px-4 py-3 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge type={log.type} />
                          <span className="text-white/75 text-sm leading-snug">{log.description}</span>
                        </div>
                        <span className="text-white/25 text-[11px] whitespace-nowrap flex-shrink-0 mt-0.5" title={formatDate(log.createdAt)}>
                          {timeAgo(log.createdAt)}
                        </span>
                      </div>
                      {log.ip && (
                        <p className="mt-1.5 text-white/20 text-[10px] font-mono">{log.ip}</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Table view */}
      {view === "table" && (
        <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {["Type", "Description", "IP", "Date"].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-widest font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-white/30">No activity logged yet.</td>
                  </tr>
                ) : (
                  paginated.map((log) => (
                    <tr key={log.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap"><Badge type={log.type} /></td>
                      <td className="px-4 py-3 text-white/75 max-w-md">{log.description}</td>
                      <td className="px-4 py-3 text-white/30 text-xs font-mono whitespace-nowrap">{log.ip ?? "—"}</td>
                      <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">{formatDate(log.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Load more */}
      {page < totalPages && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2.5 bg-white/6 hover:bg-white/10 text-white/60 hover:text-white text-sm rounded-lg transition-colors cursor-pointer"
          >
            Load more ({filtered.length - page * PAGE_SIZE} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
