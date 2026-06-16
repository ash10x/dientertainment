"use client";

import { useState } from "react";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";

type Service = {
  id: number;
  slug: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  active: boolean;
  sortOrder: number;
};

const empty: Omit<Service, "id"> = {
  slug: "",
  number: "",
  title: "",
  description: "",
  tags: [],
  active: true,
  sortOrder: 0,
};

function toLines(arr: string[]) { return arr.join("\n"); }
function fromLines(str: string) { return str.split("\n").map((s) => s.trim()).filter(Boolean); }

export default function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [items, setItems] = useState(initialServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, "id">>(empty);
  const [tagsText, setTagsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setTagsText("");
    setModalOpen(true);
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({ ...s });
    setTagsText(toLines(s.tags));
    setModalOpen(true);
  }

  function set(key: keyof typeof form, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      const payload = { ...form, tags: fromLines(tagsText) };
      const url = editing ? `/api/admin/services/${editing.id}` : "/api/admin/services";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((prev) =>
        editing ? prev.map((s) => (s.id === editing.id ? data : s)) : [...prev, data]
      );
      setModalOpen(false);
      setToast({ message: editing ? "Service updated." : "Service created.", type: "success" });
    } catch (e: unknown) {
      setToast({ message: e instanceof Error ? e.message : "Save failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((s) => s.id !== id));
      setToast({ message: "Deleted.", type: "success" });
    } else {
      setToast({ message: "Delete failed.", type: "error" });
    }
  }

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E50019]/50 transition-colors";

  return (
    <>
      <div className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Services</h1>
            <p className="text-white/40 text-sm mt-1">
              {items.length} service{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="bg-[#E50019] hover:bg-[#FF0022] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            + Add Service
          </button>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-white/8">
                  {["#", "Title", "Slug", "Tags", "Status", "Order", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-widest font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-white/30">
                      No services yet. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  items.map((s) => (
                    <tr key={s.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-[#E50019]/60 text-xs font-display">{s.number}</td>
                      <td className="px-4 py-3 font-medium text-white">{s.title}</td>
                      <td className="px-4 py-3 text-white/40 text-xs font-mono">{s.slug}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {s.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {s.tags.length > 2 && (
                            <span className="text-[10px] text-white/25">+{s.tags.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            s.active
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-white/5 text-white/30 border-white/10"
                          }`}
                        >
                          {s.active ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/40">{s.sortOrder}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => openEdit(s)}
                            className="text-xs text-white/50 hover:text-white px-2 py-1 rounded hover:bg-white/8 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="text-xs text-[#E50019]/60 hover:text-[#E50019] px-2 py-1 rounded hover:bg-[#E50019]/10 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Service" : "New Service"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                Number
              </label>
              <input
                type="text"
                value={form.number}
                onChange={(e) => set("number", e.target.value)}
                className={inputCls}
                placeholder="01"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className={inputCls}
                placeholder="Digital Marketing"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
              Slug (URL path)
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              className={inputCls}
              placeholder="digital-marketing"
            />
            <p className="text-[10px] text-white/25 mt-1">
              Used in URL: /services/<span className="text-white/40">{form.slug || "your-slug"}</span>
            </p>
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={inputCls}
              placeholder="Strategic campaigns that dominate attention..."
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
              Tags (one per line)
            </label>
            <textarea
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              rows={4}
              className={inputCls}
              placeholder={"Social Media\nSEO\nPaid Ads\nAnalytics"}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                Sort Order
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => set("sortOrder", Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => set("active", e.target.checked)}
                  className="w-4 h-4 accent-[#E50019]"
                />
                <span className="text-sm text-white/60">Active (visible on site)</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 text-sm bg-[#E50019] hover:bg-[#FF0022] disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </>
  );
}
