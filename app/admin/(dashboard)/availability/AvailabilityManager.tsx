// app/admin/(dashboard)/availability/AvailabilityManager.tsx
"use client";

import { useState, useEffect } from "react";

interface Rule {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  isActive: boolean;
}

interface Blackout {
  id: number;
  date: string;
  reason: string | null;
}

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export default function AvailabilityManager() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [blackouts, setBlackouts] = useState<Blackout[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [newBlackoutDate, setNewBlackoutDate] = useState("");
  const [newBlackoutReason, setNewBlackoutReason] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/admin/availability")
      .then((r) => r.json())
      .then((d: { rules?: Rule[]; blackouts?: Blackout[] }) => {
        setRules(d.rules ?? []);
        setBlackouts(d.blackouts ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function updateRule(rule: Rule) {
    setSaving(rule.id);
    await fetch("/api/admin/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-rule", ...rule }),
    });
    setSaving(null);
    showToast("Rule saved.");
  }

  function patchRule(id: number, patch: Partial<Rule>) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function addBlackout() {
    if (!newBlackoutDate) return;
    await fetch("/api/admin/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add-blackout", date: newBlackoutDate, reason: newBlackoutReason }),
    });
    const res = await fetch("/api/admin/availability");
    const d = await res.json() as { blackouts?: Blackout[] };
    setBlackouts(d.blackouts ?? []);
    setNewBlackoutDate("");
    setNewBlackoutReason("");
    showToast("Blackout date added.");
  }

  async function removeBlackout(id: number) {
    await fetch("/api/admin/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove-blackout", id }),
    });
    setBlackouts((prev) => prev.filter((b) => b.id !== id));
    showToast("Blackout date removed.");
  }

  if (loading) {
    return <div className="p-8 text-white/30 text-sm">Loading availability settings…</div>;
  }

  return (
    <div className="p-4 sm:p-8 space-y-8">
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500/90 text-white text-sm px-4 py-2.5 rounded-lg z-50">{toast}</div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Availability</h1>
        <p className="text-white/40 text-sm mt-1">Configure working hours and unavailable dates.</p>
      </div>

      {/* Working hours */}
      <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">Working Hours</h2>
          <p className="text-white/30 text-xs mt-1">All times are in Eastern Time (ET) business hours.</p>
        </div>
        <div className="divide-y divide-white/5">
          {rules.map((rule) => (
            <div key={rule.id} className="px-6 py-4 flex items-center gap-4 flex-wrap">
              <div className="w-24">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.isActive}
                    onChange={(e) => patchRule(rule.id, { isActive: e.target.checked })}
                    className="accent-red"
                  />
                  <span className="text-sm text-white">{DAY_NAMES[rule.dayOfWeek]}</span>
                </label>
              </div>
              {rule.isActive && (
                <>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="time"
                      value={rule.startTime}
                      onChange={(e) => patchRule(rule.id, { startTime: e.target.value })}
                      className="bg-[#1a1a1a] border border-white/12 rounded px-2 py-1 text-white text-xs"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      value={rule.endTime}
                      onChange={(e) => patchRule(rule.id, { endTime: e.target.value })}
                      className="bg-[#1a1a1a] border border-white/12 rounded px-2 py-1 text-white text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/30">
                    Break:
                    <input
                      type="time"
                      value={rule.breakStart ?? ""}
                      onChange={(e) => patchRule(rule.id, { breakStart: e.target.value || null })}
                      className="bg-[#1a1a1a] border border-white/12 rounded px-2 py-1 text-white"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      value={rule.breakEnd ?? ""}
                      onChange={(e) => patchRule(rule.id, { breakEnd: e.target.value || null })}
                      className="bg-[#1a1a1a] border border-white/12 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <button
                    onClick={() => updateRule(rule)}
                    disabled={saving === rule.id}
                    className="ml-auto text-xs px-3 py-1.5 border border-white/15 text-white/50 hover:text-white rounded transition-colors disabled:opacity-40"
                  >
                    {saving === rule.id ? "Saving…" : "Save"}
                  </button>
                </>
              )}
              {!rule.isActive && (
                <span className="text-xs text-white/20 ml-2">Unavailable</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blackout dates */}
      <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">Blackout Dates</h2>
          <p className="text-white/30 text-xs mt-1">Add holidays or any dates when you&apos;re unavailable.</p>
        </div>

        {/* Add new blackout */}
        <div className="px-6 py-4 border-b border-white/5 flex gap-3 flex-wrap items-end">
          <div>
            <label className="block text-xs text-white/30 mb-1">Date</label>
            <input
              type="date"
              value={newBlackoutDate}
              onChange={(e) => setNewBlackoutDate(e.target.value)}
              className="bg-[#1a1a1a] border border-white/12 rounded px-3 py-2 text-white text-sm"
            />
          </div>
          <div className="flex-1 min-w-32">
            <label className="block text-xs text-white/30 mb-1">Reason (optional)</label>
            <input
              type="text"
              value={newBlackoutReason}
              onChange={(e) => setNewBlackoutReason(e.target.value)}
              placeholder="Holiday, vacation, etc."
              className="w-full bg-[#1a1a1a] border border-white/12 rounded px-3 py-2 text-white text-sm"
            />
          </div>
          <button
            onClick={addBlackout}
            disabled={!newBlackoutDate}
            className="px-4 py-2 bg-red text-white text-sm rounded hover:bg-[#FF001F] disabled:opacity-40 transition-colors"
          >
            Add
          </button>
        </div>

        {blackouts.length === 0 ? (
          <p className="px-6 py-6 text-white/25 text-sm">No blackout dates.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {blackouts.map((b) => (
              <div key={b.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm text-white">{b.date}</span>
                  {b.reason && <span className="text-xs text-white/35 ml-3">{b.reason}</span>}
                </div>
                <button
                  onClick={() => removeBlackout(b.id)}
                  className="text-xs text-white/30 hover:text-red transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
