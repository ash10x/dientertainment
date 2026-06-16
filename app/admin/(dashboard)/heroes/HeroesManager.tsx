"use client";

import { useState } from "react";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import type { HeroRow } from "@/lib/queries";

const PAGE_LABELS: Record<string, string> = {
  home: "Home",
  about: "About",
  work: "Work / Portfolio",
  contact: "Contact",
};

export default function HeroesManager({ initialHeroes }: { initialHeroes: HeroRow[] }) {
  const [heroes, setHeroes] = useState(initialHeroes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HeroRow | null>(null);
  const [form, setForm] = useState<HeroRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function openEdit(hero: HeroRow) {
    setEditing(hero);
    setForm({ ...hero });
    setModalOpen(true);
  }

  function set<K extends keyof HeroRow>(key: K, value: HeroRow[K]) {
    setForm((f) => f ? { ...f, [key]: value } : f);
  }

  async function handleSave() {
    if (!form) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/heroes/${form.page}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHeroes((prev) => prev.map((h) => (h.page === form.page ? data : h)));
      setModalOpen(false);
      setToast({ message: "Hero content saved.", type: "success" });
    } catch (e: unknown) {
      setToast({ message: e instanceof Error ? e.message : "Save failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(page: string) {
    if (!confirm(`Reset "${PAGE_LABELS[page]}" hero to defaults?`)) return;
    const res = await fetch(`/api/admin/heroes/${page}`, { method: "DELETE" });
    if (res.ok) {
      const all = await fetch("/api/admin/heroes").then((r) => r.json());
      setHeroes(all);
      setToast({ message: "Reset to defaults.", type: "success" });
    } else {
      setToast({ message: "Reset failed.", type: "error" });
    }
  }

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E50019]/50 transition-colors";

  return (
    <>
      <div className="p-4 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Page Heroes</h1>
          <p className="text-white/40 text-sm mt-1">
            Manage headline content for each page&apos;s hero section.
          </p>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {["Page", "Eyebrow", "Heading", "Accent"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-widest font-medium"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {heroes.map((hero) => (
                  <tr key={hero.page} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-4 font-medium text-white whitespace-nowrap">
                      {PAGE_LABELS[hero.page] ?? hero.page}
                    </td>
                    <td className="px-4 py-4 text-white/40 text-xs max-w-[160px] truncate">
                      {hero.eyebrow}
                    </td>
                    <td className="px-4 py-4 text-white/60 text-xs font-display max-w-[200px] truncate">
                      {hero.heading.replace(/\n/g, " / ")}
                    </td>
                    <td className="px-4 py-4 text-[#E50019]/70 text-xs font-display max-w-[140px] truncate">
                      {hero.headingAccent ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(hero)}
                          className="text-xs text-white/50 hover:text-white px-2 py-1 rounded hover:bg-white/8 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleReset(hero.page)}
                          className="text-xs text-white/30 hover:text-white/60 px-2 py-1 rounded hover:bg-white/5 transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={modalOpen && form !== null}
        onClose={() => setModalOpen(false)}
        title={`Edit Hero — ${PAGE_LABELS[form?.page ?? ""] ?? form?.page}`}
      >
        {form && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                Eyebrow Label
              </label>
              <input
                type="text"
                value={form.eyebrow}
                onChange={(e) => set("eyebrow", e.target.value)}
                className={inputCls}
                placeholder="Digital Marketing · News & Media"
              />
              <p className="text-[10px] text-white/25 mt-1">Small uppercase label above the headline.</p>
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                Heading Lines
              </label>
              <textarea
                value={form.heading}
                onChange={(e) => set("heading", e.target.value)}
                rows={3}
                className={inputCls}
                placeholder={"We Create AI Content\nThat Makes Brands\nLook"}
              />
              <p className="text-[10px] text-white/25 mt-1">One line per row. Each line becomes a new line in the headline.</p>
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                Heading Accent <span className="text-[#E50019]/60">(red)</span>
              </label>
              <input
                type="text"
                value={form.headingAccent ?? ""}
                onChange={(e) => set("headingAccent", e.target.value || null)}
                className={inputCls}
                placeholder="Million Dollar."
              />
              <p className="text-[10px] text-white/25 mt-1">The highlighted red word or phrase at the end of the headline. Leave empty to omit.</p>
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                Body Text
              </label>
              <textarea
                value={form.body ?? ""}
                onChange={(e) => set("body", e.target.value || null)}
                rows={2}
                className={inputCls}
                placeholder="AI Videos. AI Commercials. AI Reels. AI Branding."
              />
            </div>

            {form.page === "home" && (
              <>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                    Secondary Body Text
                  </label>
                  <input
                    type="text"
                    value={form.bodySecondary ?? ""}
                    onChange={(e) => set("bodySecondary", e.target.value || null)}
                    className={inputCls}
                    placeholder="Luxury marketing powered by artificial intelligence."
                  />
                  <p className="text-[10px] text-white/25 mt-1">Shown below body text in smaller, dimmer style.</p>
                </div>

                <div className="border-t border-white/8 pt-4">
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">CTA Buttons</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                        Primary Label
                      </label>
                      <input
                        type="text"
                        value={form.ctaPrimaryLabel ?? ""}
                        onChange={(e) => set("ctaPrimaryLabel", e.target.value || null)}
                        className={inputCls}
                        placeholder="Start a Project"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                        Primary Link
                      </label>
                      <input
                        type="text"
                        value={form.ctaPrimaryHref ?? ""}
                        onChange={(e) => set("ctaPrimaryHref", e.target.value || null)}
                        className={inputCls}
                        placeholder="#contact"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                        Secondary Label
                      </label>
                      <input
                        type="text"
                        value={form.ctaSecondaryLabel ?? ""}
                        onChange={(e) => set("ctaSecondaryLabel", e.target.value || null)}
                        className={inputCls}
                        placeholder="View Our Work"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                        Secondary Link
                      </label>
                      <input
                        type="text"
                        value={form.ctaSecondaryHref ?? ""}
                        onChange={(e) => set("ctaSecondaryHref", e.target.value || null)}
                        className={inputCls}
                        placeholder="#work"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

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
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
      )}
    </>
  );
}
