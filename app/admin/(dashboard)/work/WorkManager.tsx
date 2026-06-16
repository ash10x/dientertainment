"use client";

import { useState } from "react";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";

type Project = {
  id: number;
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  outcome: string;
  bg: string;
  accentColor: string;
  textLight: boolean;
  sortOrder: number;
  previewUrl: string | null;
};

const empty: Omit<Project, "id"> = {
  slug: "", title: "", client: "", category: "", year: "",
  outcome: "", bg: "#1a1a1a", accentColor: "#E50019", textLight: true, sortOrder: 0, previewUrl: null,
};

interface WorkManagerProps { initialProjects: Project[] }

export default function WorkManager({ initialProjects }: WorkManagerProps) {
  const [projects, setProjects] = useState(initialProjects);
  const existingCategories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean))).sort();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(empty);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function openCreate() { setEditing(null); setForm(empty); setModalOpen(true); }
  function openEdit(p: Project) { setEditing(p); setForm({ ...p }); setModalOpen(true); }

  function set(key: keyof typeof form, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      const url = editing ? `/api/admin/work/${editing.id}` : "/api/admin/work";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProjects((prev) => editing ? prev.map((p) => p.id === editing.id ? data : p) : [...prev, data]);
      setModalOpen(false);
      setToast({ message: editing ? "Project updated." : "Project created.", type: "success" });
    } catch (e: unknown) {
      setToast({ message: e instanceof Error ? e.message : "Save failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/admin/work/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setToast({ message: "Project deleted.", type: "success" });
    } else {
      setToast({ message: "Delete failed.", type: "error" });
    }
  }

  return (
    <>
      <div className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Work Projects</h1>
            <p className="text-white/40 text-sm mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={openCreate} className="bg-[#E50019] hover:bg-[#FF0022] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
            + Add Project
          </button>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-155">
            <thead>
              <tr className="border-b border-white/8">
                {["Title", "Client", "Category", "Year", "Slug", "Order", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-widest font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-white/30">No projects yet.</td></tr>
              ) : projects.map((p) => (
                <tr key={p.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{p.title}</td>
                  <td className="px-4 py-3 text-white/60">{p.client}</td>
                  <td className="px-4 py-3 text-white/60 text-xs">{p.category}</td>
                  <td className="px-4 py-3 text-white/60">{p.year}</td>
                  <td className="px-4 py-3 text-white/40 text-xs font-mono">{p.slug}</td>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Project" : "New Project"}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title"><Input value={form.title} onChange={(v) => set("title", v)} placeholder="Brand Campaign" /></Field>
            <Field label="Client"><Input value={form.client} onChange={(v) => set("client", v)} placeholder="Client Name" /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Slug"><Input value={form.slug} onChange={(v) => set("slug", v)} placeholder="brand-campaign" mono /></Field>
            <Field label="Year"><Input value={form.year} onChange={(v) => set("year", v)} placeholder="2025" /></Field>
          </div>
          <Field label="Category">
            <>
              <input
                type="text"
                list="category-suggestions"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. AI Branding"
                className={inputCls}
              />
              <datalist id="category-suggestions">
                {existingCategories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </>
          </Field>
          <Field label="Outcome"><Input value={form.outcome} onChange={(v) => set("outcome", v)} placeholder="2M+ views in 30 days" /></Field>
          <Field label="Preview URL (image or video)">
            <Input value={form.previewUrl ?? ""} onChange={(v) => set("previewUrl", v || null)} placeholder="https://... (.jpg, .png, .mp4, .webm)" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Background Color"><Input value={form.bg} onChange={(v) => set("bg", v)} placeholder="#1a1a1a" mono /></Field>
            <Field label="Accent Color"><Input value={form.accentColor} onChange={(v) => set("accentColor", v)} placeholder="#E50019" mono /></Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Sort Order"><input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} className={inputCls} /></Field>
            <Field label="Light Text">
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="textLight" checked={form.textLight} onChange={(e) => set("textLight", e.target.checked)} className="w-4 h-4 accent-[#E50019]" />
                <label htmlFor="textLight" className="text-sm text-white/60">Use light text on card</label>
              </div>
            </Field>
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

const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E50019]/50 transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${inputCls} ${mono ? "font-mono" : ""}`}
    />
  );
}
