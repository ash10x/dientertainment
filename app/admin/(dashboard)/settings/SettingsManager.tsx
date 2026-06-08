"use client";

import { useState } from "react";
import Toast from "../../components/Toast";

interface SettingsManagerProps {
  initial: Record<string, string>;
}

export default function SettingsManager({ initial }: SettingsManagerProps) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setToast({ message: "Settings saved.", type: "success" });
    } catch (e: unknown) {
      setToast({ message: e instanceof Error ? e.message : "Save failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="p-4 sm:p-8 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Site Settings</h1>
            <p className="text-white/40 text-sm mt-1">Business details and social media links</p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#E50019] hover:bg-[#FF0022] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="space-y-8">
          {/* Business Details */}
          <section className="bg-[#111] border border-white/8 rounded-xl p-6 space-y-5">
            <h2 className="text-xs text-white/40 uppercase tracking-widest">Business Details</h2>
            <Field label="Contact Email">
              <Input value={form.email ?? ""} onChange={(v) => set("email", v)} placeholder="hello@yourdomain.com" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Phone (display)">
                <Input value={form.phone_display ?? ""} onChange={(v) => set("phone_display", v)} placeholder="+1 (234) 567-8900" />
              </Field>
              <Field label="Phone (tel: link)">
                <Input value={form.phone ?? ""} onChange={(v) => set("phone", v)} placeholder="+12345678900" mono />
              </Field>
            </div>
          </section>

          {/* Social Media */}
          <section className="bg-[#111] border border-white/8 rounded-xl p-6 space-y-5">
            <h2 className="text-xs text-white/40 uppercase tracking-widest">Social Media</h2>
            <Field label="Instagram URL">
              <Input value={form.social_instagram ?? ""} onChange={(v) => set("social_instagram", v)} placeholder="https://instagram.com/yourhandle" />
            </Field>
            <Field label="Twitter / X URL">
              <Input value={form.social_twitter ?? ""} onChange={(v) => set("social_twitter", v)} placeholder="https://x.com/yourhandle" />
            </Field>
            <Field label="LinkedIn URL">
              <Input value={form.social_linkedin ?? ""} onChange={(v) => set("social_linkedin", v)} placeholder="https://linkedin.com/company/yourpage" />
            </Field>
            <Field label="YouTube URL">
              <Input value={form.social_youtube ?? ""} onChange={(v) => set("social_youtube", v)} placeholder="https://youtube.com/@yourchannel" />
            </Field>
            <Field label="TikTok URL">
              <Input value={form.social_tiktok ?? ""} onChange={(v) => set("social_tiktok", v)} placeholder="https://tiktok.com/@yourhandle" />
            </Field>
          </section>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </>
  );
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E50019]/50 transition-colors";

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
      className={`${inputCls}${mono ? " font-mono" : ""}`}
    />
  );
}
