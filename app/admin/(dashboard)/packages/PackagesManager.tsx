"use client";

import { useState } from "react";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";

type Package = {
  id: number;
  serviceSlug: string;
  name: string;
  tagline: string | null;
  price: string;
  deposit: string | null;
  description: string | null;
  duration: string | null;
  includes: string[];
  deliverables: string[] | null;
  addOns: string[] | null;
  processSteps: string[] | null;
  bestFor: string[] | null;
  heroVideoUrl: string | null;
  demoVideoUrls: string[] | null;
  aiTeamRoles: string[] | null;
  outcomeStats: string[] | null;
  highlight: boolean;
  sortOrder: number;
};

const empty: Omit<Package, "id"> = {
  serviceSlug: "", name: "", tagline: null, price: "", deposit: null, description: null,
  duration: null, includes: [], deliverables: null, addOns: null, processSteps: null,
  bestFor: null, heroVideoUrl: null, demoVideoUrls: null, aiTeamRoles: null,
  outcomeStats: null, highlight: false, sortOrder: 0,
};

function toLines(arr: string[] | null) { return arr ? arr.join("\n") : ""; }
function fromLines(str: string) { return str.split("\n").map((s) => s.trim()).filter(Boolean); }

export default function PackagesManager({
  initialPackages,
  services,
}: {
  initialPackages: Package[];
  services: { slug: string; title: string }[];
}) {
  const [items, setItems] = useState(initialPackages);
  const [filterService, setFilterService] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const [form, setForm] = useState<Omit<Package, "id">>(empty);
  const [includesText, setIncludesText] = useState("");
  const [deliverablesText, setDeliverablesText] = useState("");
  const [addOnsText, setAddOnsText] = useState("");
  const [processStepsText, setProcessStepsText] = useState("");
  const [bestForText, setBestForText] = useState("");
  const [demoVideoUrlsText, setDemoVideoUrlsText] = useState("");
  const [aiTeamRolesText, setAiTeamRolesText] = useState("");
  const [outcomeStatsText, setOutcomeStatsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setIncludesText("");
    setDeliverablesText("");
    setAddOnsText("");
    setProcessStepsText("");
    setBestForText("");
    setDemoVideoUrlsText("");
    setAiTeamRolesText("");
    setOutcomeStatsText("");
    setModalOpen(true);
  }

  function openEdit(p: Package) {
    setEditing(p);
    setForm({ ...p });
    setIncludesText(toLines(p.includes));
    setDeliverablesText(toLines(p.deliverables));
    setAddOnsText(toLines(p.addOns));
    setProcessStepsText(toLines(p.processSteps));
    setBestForText(toLines(p.bestFor));
    setDemoVideoUrlsText(toLines(p.demoVideoUrls));
    setAiTeamRolesText(toLines(p.aiTeamRoles));
    setOutcomeStatsText(toLines(p.outcomeStats));
    setModalOpen(true);
  }

  function set(key: keyof typeof form, value: unknown) { setForm((f) => ({ ...f, [key]: value })); }

  async function handleSave() {
    setLoading(true);
    try {
      const payload = {
        ...form,
        includes: fromLines(includesText),
        deliverables: fromLines(deliverablesText),
        addOns: fromLines(addOnsText),
        processSteps: fromLines(processStepsText),
        bestFor: fromLines(bestForText),
        demoVideoUrls: fromLines(demoVideoUrlsText),
        aiTeamRoles: fromLines(aiTeamRolesText),
        outcomeStats: fromLines(outcomeStatsText),
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

  const activeSlugs = new Set(services.map((s) => s.slug));
  const orphaned = items.filter((p) => !activeSlugs.has(p.serviceSlug));
  const filtered =
    filterService === "all"
      ? items
      : filterService === "__orphaned__"
      ? orphaned
      : items.filter((p) => p.serviceSlug === filterService);
  const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E50019]/50 transition-colors";

  return (
    <>
      <div className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Packages</h1>
            <p className="text-white/40 text-sm mt-1">{items.length} package{items.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={openCreate} className="bg-[#E50019] hover:bg-[#FF0022] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">+ Add Package</button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => setFilterService("all")} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterService === "all" ? "bg-[#E50019] border-[#E50019] text-white" : "border-white/15 text-white/50 hover:text-white"}`}>All</button>
          {services.map((s) => (
            <button key={s.slug} onClick={() => setFilterService(s.slug)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterService === s.slug ? "bg-[#E50019] border-[#E50019] text-white" : "border-white/15 text-white/50 hover:text-white"}`}>{s.title}</button>
          ))}
          {orphaned.length > 0 && (
            <button onClick={() => setFilterService("__orphaned__")} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filterService === "__orphaned__" ? "bg-yellow-600 border-yellow-600 text-white" : "border-yellow-600/40 text-yellow-500/70 hover:text-yellow-400"}`}>
              Unassigned ({orphaned.length})
            </button>
          )}
        </div>

        <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-155">
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
                  <td className="px-4 py-3 text-xs">
                    <span className={activeSlugs.has(p.serviceSlug) ? "text-white/60" : "text-yellow-500"}>
                      {p.serviceSlug}
                    </span>
                    {!activeSlugs.has(p.serviceSlug) && (
                      <span className="ml-2 text-[9px] tracking-widest uppercase bg-yellow-600/15 text-yellow-500 border border-yellow-600/25 px-1.5 py-0.5 rounded">
                        unassigned
                      </span>
                    )}
                  </td>
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
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Package" : "New Package"}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Service</label>
              <select value={form.serviceSlug} onChange={(e) => set("serviceSlug", e.target.value)} className={inputCls}>
                <option value="" disabled>Select a service...</option>
                {form.serviceSlug && !activeSlugs.has(form.serviceSlug) && (
                  <option value={form.serviceSlug} disabled>
                    ⚠ {form.serviceSlug} (removed — reassign)
                  </option>
                )}
                {services.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Name</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Starter Pack" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Price</label>
              <input type="text" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} placeholder="$500" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Deposit (optional)</label>
              <input type="text" value={form.deposit ?? ""} onChange={(e) => set("deposit", e.target.value || null)} className={inputCls} placeholder="$250" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Tagline (optional)</label>
            <input type="text" value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value || null)} className={inputCls} placeholder="A one-line hook for this package..." />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Description (optional)</label>
            <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value || null)} rows={2} className={inputCls} placeholder="Package overview..." />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">What&apos;s Included (one per line)</label>
            <textarea value={includesText} onChange={(e) => setIncludesText(e.target.value)} rows={4} className={inputCls} placeholder={"5 edited photos\n2 hour session\nOnline gallery"} />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Deliverables (one per line, optional)</label>
            <textarea value={deliverablesText} onChange={(e) => setDeliverablesText(e.target.value)} rows={3} className={inputCls} placeholder={"Final video files (MP4/MOV)\nRaw footage archive\nEditorial report"} />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Process Steps / Timeline (one per line, optional)</label>
            <textarea value={processStepsText} onChange={(e) => setProcessStepsText(e.target.value)} rows={4} className={inputCls} placeholder={"Week 1–2: Strategy & onboarding\nWeek 3–8: Content production\nWeek 9–12: Review, delivery & wrap"} />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Add-Ons / Upgrades (one per line, optional)</label>
            <textarea value={addOnsText} onChange={(e) => setAddOnsText(e.target.value)} rows={3} className={inputCls} placeholder={"Rush delivery (+$500)\nExtra revision round (+$250)"} />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Best For (one per line, optional)</label>
            <textarea value={bestForText} onChange={(e) => setBestForText(e.target.value)} rows={3} className={inputCls} placeholder={"Startups\nSolo creators"} />
          </div>
          <div className="border-t border-white/8 pt-4">
            <p className="text-xs text-white/25 uppercase tracking-widest mb-4">Premium Marketing Sections</p>
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Hero Video URL (optional)</label>
            <input type="text" value={form.heroVideoUrl ?? ""} onChange={(e) => set("heroVideoUrl", e.target.value || null)} className={inputCls} placeholder="https://youtube.com/watch?v=... or direct MP4 URL" />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Demo Video URLs (one per line, optional)</label>
            <textarea value={demoVideoUrlsText} onChange={(e) => setDemoVideoUrlsText(e.target.value)} rows={3} className={inputCls} placeholder={"https://youtube.com/watch?v=abc\nhttps://youtube.com/watch?v=xyz"} />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">AI Team Roles (one per line, optional)</label>
            <textarea value={aiTeamRolesText} onChange={(e) => setAiTeamRolesText(e.target.value)} rows={4} className={inputCls} placeholder={"DI AI\nCustomer Success\nSales Ambassador\nLifestyle Influencer"} />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Outcome Stats (one per line — VALUE|Label format, optional)</label>
            <textarea value={outcomeStatsText} onChange={(e) => setOutcomeStatsText(e.target.value)} rows={5} className={inputCls} placeholder={"10M+|Potential Brand Impressions\n320|Strategic Posts\n30|AI Videos\n50|Premium AI Images\n2|Exclusive AI Ambassadors"} />
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
