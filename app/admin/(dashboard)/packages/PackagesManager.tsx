"use client";

import { useState } from "react";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";

type Package = {
  id: number;
  serviceSlug: string;
  name: string;
  price: string;
  deposit: string | null;
  description: string | null;
  duration: string | null;
  includes: string[];
  bestFor: string[] | null;
  highlight: boolean;
  sortOrder: number;
};

const SERVICES = [
  "ai-video-creation", "ai-image-generation", "photo-production",
  "video-production", "digital-marketing", "news-media", "script-writing",
];

const empty: Omit<Package, "id"> = {
  serviceSlug: SERVICES[0], name: "", price: "", deposit: null, description: null,
  duration: null, includes: [], bestFor: null, highlight: false, sortOrder: 0,
};

function toLines(arr: string[] | null) { return arr ? arr.join("\n") : ""; }
function fromLines(str: string) { return str.split("\n").map((s) => s.trim()).filter(Boolean); }

export default function PackagesManager({ initialPackages }: { initialPackages: Package[] }) {
  const [items, setItems] = useState(initialPackages);
  const [filterService, setFilterService] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState<Omit<Package, "id">>(empty);
  const [includesText, setIncludesText] = useState("");
  const [bestForText, setBestForText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setIncludesText("");
    setBestForText("");
    setModalOpen(true);
  }

  function openEdit(p: Package) {
    setEditing(p);
    setForm({ ...p });
    setIncludesText(toLines(p.includes));
    setBestForText(toLines(p.bestFor));
    setModalOpen(true);
  }

  function set(key: keyof typeof form, value: unknown) { setForm((f) => ({ ...f, [key]: value })); }

  async function handleSave() {
    setLoading(true);
    try {
      const payload = {
        ...form,
        includes: fromLines(includesText),
        bestFor: fromLines(bestForText),
      };
      const url = editing ? `/api/admin/packages/${editing.id}` : "/api/admin/packages";
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((prev) => editing ? prev.map((p) => p.id === editing.id ? data : p) : [...prev, data]);
      setModalOpen(false);
      setToast({ message: editing ? "Package updated." : "Package created.", type: "success" });
    } catch (e: unknown) {
      setToast({ message: e instanceof Error ? e.message : "Save failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this package?")) return;
    const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    if (res.ok) { setItems((prev) => prev.filter((p) => p.id !== id)); setToast({ message: "Deleted.", type: "success" }); }
    else setToast({ message: "Delete failed.", type: "error" });
  }

  const filtered = filterService === "all" ? items : items.filter((p) => p.serviceSlug === filterService);
  const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E50019]/50 transition-colors";

  return (
    <>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Packages</h1>
            <p className="text-white/40 text-sm mt-1">{items.length} package{items.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={openCreate} className="bg-[#E50019] hover:bg-[#FF0022] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">+ Add Package</button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => setFilterService("all")} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterService === "all" ? "bg-[#E50019] border-[#E50019] text-white" : "border-white/15 text-white/50 hover:text-white"}`}>All</button>
          {SERVICES.map((s) => (
            <button key={s} onClick={() => setFilterService(s)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterService === s ? "bg-[#E50019] border-[#E50019] text-white" : "border-white/15 text-white/50 hover:text-white"}`}>{s}</button>
          ))}
        </div>

        <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Name", "Service", "Price", "Deposit", "Highlight", "Order", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-widest font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-white/30">No packages found.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                  <td className="px-4 py-3 text-white/60 text-xs">{p.serviceSlug}</td>
                  <td className="px-4 py-3 text-white/60">{p.price}</td>
                  <td className="px-4 py-3 text-white/40">{p.deposit ?? "—"}</td>
                  <td className="px-4 py-3">
                    {p.highlight && <span className="text-xs bg-[#E50019]/15 text-[#E50019] px-2 py-0.5 rounded-full border border-[#E50019]/20">Popular</span>}
                  </td>
                  <td className="px-4 py-3 text-white/40">{p.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(p)} className="text-xs text-white/50 hover:text-white px-2 py-1 rounded hover:bg-white/8 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs text-[#E50019]/60 hover:text-[#E50019] px-2 py-1 rounded hover:bg-[#E50019]/10 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Package" : "New Package"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Service</label>
              <select value={form.serviceSlug} onChange={(e) => set("serviceSlug", e.target.value)} className={inputCls}>
                {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Name</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Starter Pack" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Price</label>
              <input type="text" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} placeholder="$500" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Deposit (optional)</label>
              <input type="text" value={form.deposit ?? ""} onChange={(e) => set("deposit", e.target.value || null)} className={inputCls} placeholder="$250" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Duration (optional)</label>
              <input type="text" value={form.duration ?? ""} onChange={(e) => set("duration", e.target.value || null)} className={inputCls} placeholder="1 day shoot" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Description (optional)</label>
            <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value || null)} rows={2} className={inputCls} placeholder="Package overview..." />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Includes (one per line)</label>
            <textarea value={includesText} onChange={(e) => setIncludesText(e.target.value)} rows={4} className={inputCls} placeholder={"5 edited photos\n2 hour session\nOnline gallery"} />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Best For (one per line, optional)</label>
            <textarea value={bestForText} onChange={(e) => setBestForText(e.target.value)} rows={3} className={inputCls} placeholder={"Startups\nSolo creators"} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="highlight" checked={form.highlight} onChange={(e) => set("highlight", e.target.checked)} className="w-4 h-4 accent-[#E50019]" />
            <label htmlFor="highlight" className="text-sm text-white/60">Mark as Most Popular</label>
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
