"use client";

import { useState } from "react";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";

type Submission = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  socialHandle: string | null;
  companyName: string | null;
  service: string;
  budget: string | null;
  packageName: string | null;
  packagePrice: string | null;
  packageDeposit: string | null;
  message: string;
  createdAt: Date;
};

export default function SubmissionsManager({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const [items, setItems] = useState(initialSubmissions);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Delete this submission?")) return;
    const res = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((s) => s.id !== id));
      if (selected?.id === id) setSelected(null);
      setToast({ message: "Submission deleted.", type: "success" });
    } else {
      setToast({ message: "Delete failed.", type: "error" });
    }
  }

  return (
    <>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Submissions</h1>
          <p className="text-white/40 text-sm mt-1">{items.length} contact & order submission{items.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Name", "Email", "Service", "Package", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-widest font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-white/30">No submissions yet.</td></tr>
              ) : items.map((s) => (
                <tr key={s.id} className="hover:bg-white/3 transition-colors cursor-pointer" onClick={() => setSelected(s)}>
                  <td className="px-4 py-3 font-medium text-white">{s.fullName}</td>
                  <td className="px-4 py-3 text-white/60">{s.email}</td>
                  <td className="px-4 py-3 text-white/60 text-xs">{s.service}</td>
                  <td className="px-4 py-3 text-white/40 text-xs">{s.packageName ?? "—"}</td>
                  <td className="px-4 py-3 text-white/40 text-xs">
                    {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleDelete(s.id)} className="text-xs text-[#E50019]/60 hover:text-[#E50019] px-2 py-1 rounded hover:bg-[#E50019]/10 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Submission Details">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Full Name" value={selected.fullName} />
              <Detail label="Email" value={selected.email} />
              <Detail label="Phone" value={selected.phone} />
              <Detail label="Social Handle" value={selected.socialHandle ?? "—"} />
              <Detail label="Company" value={selected.companyName ?? "—"} />
              <Detail label="Service" value={selected.service} />
              {selected.budget && <Detail label="Budget" value={selected.budget} />}
              {selected.packageName && <Detail label="Package" value={selected.packageName} />}
              {selected.packagePrice && <Detail label="Package Price" value={selected.packagePrice} />}
              {selected.packageDeposit && <Detail label="Deposit" value={selected.packageDeposit} />}
              <Detail label="Submitted" value={new Date(selected.createdAt).toLocaleString("en-US")} />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1.5">Message</p>
              <div className="bg-white/5 border border-white/8 rounded-lg px-3 py-3 text-sm text-white/70 whitespace-pre-wrap">{selected.message}</div>
            </div>
            <div className="flex justify-between pt-2">
              <button onClick={() => handleDelete(selected.id)} className="px-4 py-2 text-sm text-[#E50019] border border-[#E50019]/30 hover:bg-[#E50019]/10 rounded-lg transition-colors">Delete</button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}
