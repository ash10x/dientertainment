"use client";

import { useState } from "react";

type ActivityLog = {
  id: number;
  type: string;
  description: string;
  meta: string | null;
  ip: string | null;
  createdAt: Date;
};

const TYPE_COLORS: Record<string, string> = {
  contact: "text-blue-400 bg-blue-400/10",
  booking: "text-[#E50019] bg-[#E50019]/10",
};

function typeBadge(type: string) {
  const cls = TYPE_COLORS[type] ?? "text-white/50 bg-white/8";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] tracking-widest uppercase font-medium ${cls}`}>
      {type}
    </span>
  );
}

export default function ActivityManager({ initialLogs }: { initialLogs: ActivityLog[] }) {
  const [logs] = useState(initialLogs);
  const [filter, setFilter] = useState("all");

  const types = ["all", ...Array.from(new Set(logs.map((l) => l.type)))];
  const filtered = filter === "all" ? logs : logs.filter((l) => l.type === filter);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Activity Log</h1>
          <p className="text-white/40 text-sm mt-1">{filtered.length} event{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded text-xs uppercase tracking-widest transition-colors ${
                filter === t
                  ? "bg-[#E50019] text-white"
                  : "bg-white/8 text-white/50 hover:text-white hover:bg-white/12"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Type", "Description", "IP", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-widest font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-white/30">
                    No activity logged yet.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{typeBadge(log.type)}</td>
                    <td className="px-4 py-3 text-white/80 max-w-md">{log.description}</td>
                    <td className="px-4 py-3 text-white/30 text-xs font-mono whitespace-nowrap">
                      {log.ip ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
