"use client";

import { useState } from "react";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";

type Stat = { id: number; page: string; statValue: string; statLabel: string; sortOrder: number };

const PAGES = ["home", "work", "testimonials", "why-choose-us", "about", "services"];
const empty: Omit<Stat, "id"> = { page: PAGES[0], statValue: "", statLabel: "", sortOrder: 0 };

export default function StatsManager({ initialStats }: { initialStats: Stat[] }) {
  const [items, setItems] = useState(initialStats);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Stat | null>(null);
  const [form, setForm] = useState<Omit<Stat, "id">>(empty);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function openCreate() { setEditing(null); setForm(empty); setModalOpen(true); }
  function openEdit(s: Stat) { setEditing(s); setForm({ ...s }); setModalOpen(true); }
  function set(key: keyof typeof form, value: unknown) { setForm((f) => ({ ...f, [key]: value })); }

  const grouped = PAGES.reduce<Record<string, Stat[]>>((acc, p) => {
    acc[p] = items.filter((s) => s.page === p);
    return acc;
  }, {});

  async function handleSave() {
    setLoading(true);
    try {
      const url = editing ? `/api/admin/stats/${editing.id}` : "/api/admin/stats";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((prev) => editing ? prev.map((s) => s.id === editing.id ? data : s) : [...prev, data]);
      setModalOpen(false);
      setToast({ message: editing ? "Stat updated." : "Stat created.", type: "success" });
    } catch (e: unknown) {
      setToast({ message: e instanceof Error ? e.message : "Save failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this stat?")) return;
    const res = await fetch(`/api/admin/stats/${id}`, { method: "DELETE" });
    if (res.ok) { setItems((prev) => prev.filter((s) => s.id !== id)); setToast({ message: "Deleted.", type: "success" }); }
    else setToast({ message: "Delete failed.", type: "error" });
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E50019]/50 transition-colors";

  return (
    <>
      <div className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Site Stats</h1>
            <p className="text-white/40 text-sm mt-1">{items.length} stat{items.length !== 1 ? "s" : ""} across {PAGES.length} pages</p>
          </div>
          <button onClick={openCreate} className="bg-[#E50019] hover:bg-[#FF0022] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">+ Add Stat</button>
        </div>

        <div className="space-y-4">
          {PAGES.map((page) => {
            const pageStats = grouped[page];
            if (pageStats.length === 0) return null;
            return (
              <div key={page} className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/8 bg-white/3">
                  <span className="text-xs text-white/50 uppercase tracking-widest font-medium">{page}</span>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-80">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Value", "Label", "Order", ""].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs text-white/30 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pageStats.map((s) => (
                      <tr key={s.id} className="hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3 font-bold text-[#E50019]">{s.statValue}</td>
                        <td className="px-4 py-3 text-white/60">{s.statLabel}</td>
                        <td className="px-4 py-3 text-white/40">{s.sortOrder}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => openEdit(s)} className="text-xs text-white/50 hover:text-white px-2 py-1 rounded hover:bg-white/8 transition-colors">Edit</button>
                            <button onClick={() => handleDelete(s.id)} className="text-xs text-[#E50019]/60 hover:text-[#E50019] px-2 py-1 rounded hover:bg-[#E50019]/10 transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="bg-[#111] border border-white/8 rounded-xl px-4 py-10 text-center text-white/30 text-sm">No stats yet.</div>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Stat" : "New Stat"}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Page</label>
            <select value={form.page} onChange={(e) => set("page", e.target.value)} className={inputCls}>
              {PAGES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Value</label>
              <input type="text" value={form.statValue} onChange={(e) => set("statValue", e.target.value)} className={inputCls} placeholder="500+" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Label</label>
              <input type="text" value={form.statLabel} onChange={(e) => set("statLabel", e.target.value)} className={inputCls} placeholder="Brands Elevated" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} className={inputCls} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="px-4 py-2 text-sm bg-[#E50019] hover:bg-[#FF0022] disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
              {loading ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </>
  );
}
