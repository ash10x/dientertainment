"use client";

import { useState } from "react";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";

type NavItem = {
  id: number;
  label: string;
  href: string;
  type: string;
  visible: boolean;
  openInNewTab: boolean;
  sortOrder: number;
};

const TYPE_OPTIONS = [
  { value: "link", label: "Regular Link" },
  { value: "services-dropdown", label: "Services Dropdown" },
  { value: "cta", label: "CTA Button" },
];

const empty: Omit<NavItem, "id"> = {
  label: "",
  href: "/",
  type: "link",
  visible: true,
  openInNewTab: false,
  sortOrder: 0,
};

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E50019]/50 transition-colors";

export default function NavManager({ initialItems }: { initialItems: NavItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<NavItem | null>(null);
  const [form, setForm] = useState<Omit<NavItem, "id">>(empty);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function openCreate() {
    setEditing(null);
    setForm({ ...empty, sortOrder: items.length * 10 });
    setModalOpen(true);
  }

  function openEdit(item: NavItem) {
    setEditing(item);
    setForm({ ...item });
    setModalOpen(true);
  }

  function set(key: keyof typeof form, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      const url = editing ? `/api/admin/nav/${editing.id}` : "/api/admin/nav";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((prev) =>
        editing ? prev.map((i) => (i.id === editing.id ? data : i)) : [...prev, data]
      );
      setModalOpen(false);
      setToast({ message: editing ? "Nav item updated." : "Nav item created.", type: "success" });
    } catch (e: unknown) {
      setToast({ message: e instanceof Error ? e.message : "Save failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this nav item?")) return;
    const res = await fetch(`/api/admin/nav/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setToast({ message: "Deleted.", type: "success" });
    } else {
      setToast({ message: "Delete failed.", type: "error" });
    }
  }

  async function toggleVisible(item: NavItem) {
    const updated = { ...item, visible: !item.visible };
    const res = await fetch(`/api/admin/nav/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const data = await res.json();
      setItems((prev) => prev.map((i) => (i.id === item.id ? data : i)));
    }
  }

  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <div className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Navigation</h1>
            <p className="text-white/40 text-sm mt-1">
              {items.length} item{items.length !== 1 ? "s" : ""} · controls the front-end nav bar
            </p>
          </div>
          <button
            onClick={openCreate}
            className="bg-[#E50019] hover:bg-[#FF0022] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            + Add Item
          </button>
        </div>

        {/* Live preview note */}
        <div className="mb-6 flex items-start gap-3 bg-white/3 border border-white/8 rounded-lg px-4 py-3">
          <span className="text-[#E50019] text-xs font-bold mt-px shrink-0 select-none">i</span>
          <p className="text-white/40 text-xs leading-relaxed">
            Changes take effect immediately on the live site. The <strong className="text-white/60">Services Dropdown</strong> type uses items from the Services table as its sub-links — no href needed.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#111] border border-white/8 rounded-xl px-4 py-12 text-center">
            <p className="text-white/30 text-sm mb-5">No nav items yet.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={async () => {
                  const res = await fetch("/api/admin/nav/seed", { method: "POST" });
                  const data = await res.json();
                  if (res.ok) { setItems(data); setToast({ message: "Default nav items created.", type: "success" }); }
                  else setToast({ message: data.error ?? "Seed failed.", type: "error" });
                }}
                className="bg-[#E50019] hover:bg-[#FF0022] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Setup Defaults
              </button>
              <button onClick={openCreate} className="text-white/50 hover:text-white text-sm border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-lg transition-colors cursor-pointer">+ Add manually</button>
            </div>
          </div>
        ) : (
          <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-130">
                <thead>
                  <tr className="border-b border-white/8">
                    {["Order", "Label", "Href", "Type", "Visible", "Actions"].map((h, i) => (
                      <th key={i} className={`px-4 py-3 text-xs text-white/40 uppercase tracking-widest font-medium ${h === "Actions" ? "text-right" : "text-left"}`}>{h === "Actions" ? "" : h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sorted.map((item) => (
                    <tr key={item.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-white/40 text-xs font-mono">{item.sortOrder}</td>
                      <td className="px-4 py-3 font-medium text-white">{item.label}</td>
                      <td className="px-4 py-3 text-white/40 text-xs font-mono">{item.href}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] tracking-[0.12em] uppercase font-medium border px-2.5 py-0.5 rounded-full ${
                          item.type === "cta"
                            ? "border-[#E50019]/40 text-[#E50019] bg-[#E50019]/12"
                            : item.type === "services-dropdown"
                            ? "border-sky-400/35 text-sky-400 bg-sky-400/10"
                            : "border-white/15 text-white/50"
                        }`}>
                          {item.type === "services-dropdown" ? "Services ▾" : item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleVisible(item)}
                          className={`w-11 h-6 rounded-full relative transition-colors duration-200 cursor-pointer flex-shrink-0 ${
                            item.visible ? "bg-[#E50019]" : "bg-white/15"
                          }`}
                          aria-label={item.visible ? "Hide item" : "Show item"}
                          aria-checked={item.visible}
                          role="switch"
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-transform duration-200 ${
                              item.visible ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => openEdit(item)}
                            className="text-xs text-white/50 hover:text-white px-2 py-1 rounded hover:bg-white/8 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-xs text-[#E50019]/60 hover:text-[#E50019] px-2 py-1 rounded hover:bg-[#E50019]/10 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Nav Item" : "New Nav Item"}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Label</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => set("label", e.target.value)}
                className={inputCls}
                placeholder="About"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className={inputCls}
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
              Href {form.type === "services-dropdown" && <span className="text-white/25 normal-case tracking-normal">(ignored for Services Dropdown)</span>}
            </label>
            <input
              type="text"
              value={form.href}
              onChange={(e) => set("href", e.target.value)}
              className={inputCls}
              placeholder="/about"
              disabled={form.type === "services-dropdown"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => set("sortOrder", Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) => set("visible", e.target.checked)}
                className="w-4 h-4 accent-[#E50019]"
              />
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Visible in navigation</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.openInNewTab}
                onChange={(e) => set("openInNewTab", e.target.checked)}
                className="w-4 h-4 accent-[#E50019]"
              />
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">Open in new tab</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 text-sm bg-[#E50019] hover:bg-[#FF0022] disabled:opacity-50 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              {loading ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </>
  );
}
