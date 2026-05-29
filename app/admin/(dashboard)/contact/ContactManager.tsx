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

type Filter = "all" | "contact" | "booking";

export default function ContactManager({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const [items, setItems] = useState(initialSubmissions);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const filtered = items.filter((s) => {
    if (filter === "contact") return !s.packageName;
    if (filter === "booking") return !!s.packageName;
    return true;
  });

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

  function openReply(submission: Submission) {
    setSelected(submission);
    const defaultSubject = submission.packageName
      ? `Re: Your booking request — ${submission.packageName}`
      : `Re: Your inquiry — ${submission.service}`;
    setReplySubject(defaultSubject);
    setReplyMessage("");
    setReplyOpen(true);
  }

  async function handleSendReply() {
    if (!selected || !replySubject.trim() || !replyMessage.trim()) return;
    setReplying(true);
    try {
      const res = await fetch(`/api/admin/submissions/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: replySubject, message: replyMessage }),
      });
      if (res.ok) {
        setToast({ message: `Reply sent to ${selected.email}.`, type: "success" });
        setReplyOpen(false);
        setReplySubject("");
        setReplyMessage("");
      } else {
        const data = await res.json();
        setToast({ message: data.error ?? "Failed to send reply.", type: "error" });
      }
    } catch {
      setToast({ message: "Network error. Could not send reply.", type: "error" });
    } finally {
      setReplying(false);
    }
  }

  return (
    <>
      <div className="p-4 sm:p-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Contact &amp; Bookings</h1>
            <p className="text-white/40 text-sm mt-1">
              {filtered.length} {filter === "all" ? "total" : filter} submission{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 rounded-lg p-1 self-start sm:self-auto">
            {(["all", "contact", "booking"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${
                  filter === f ? "bg-[#E50019] text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-white/8">
                  {["Name", "Email", "Type", "Service / Package", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-widest font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-white/30">No submissions yet.</td>
                  </tr>
                ) : filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-white/3 transition-colors cursor-pointer"
                    onClick={() => setSelected(s)}
                  >
                    <td className="px-4 py-3 font-medium text-white">{s.fullName}</td>
                    <td className="px-4 py-3 text-white/60">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        s.packageName
                          ? "bg-green-500/10 text-green-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {s.packageName ? "Booking" : "Contact"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-xs">
                      {s.packageName ? `${s.packageName}` : s.service}
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openReply(s)}
                          className="text-xs text-white/50 hover:text-white px-2 py-1 rounded hover:bg-white/8 transition-colors"
                        >
                          Reply
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <Modal open={!!selected && !replyOpen} onClose={() => setSelected(null)} title="Submission Details">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Detail label="Full Name" value={selected.fullName} />
              <Detail label="Email" value={selected.email} />
              <Detail label="Phone" value={selected.phone} />
              {selected.socialHandle && <Detail label="Social Handle" value={selected.socialHandle} />}
              {selected.companyName && <Detail label="Company" value={selected.companyName} />}
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
              <button
                onClick={() => handleDelete(selected.id)}
                className="px-4 py-2 text-sm text-[#E50019] border border-[#E50019]/30 hover:bg-[#E50019]/10 rounded-lg transition-colors"
              >
                Delete
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => openReply(selected)}
                  className="px-4 py-2 text-sm text-white bg-[#E50019] hover:bg-[#c40015] rounded-lg transition-colors"
                >
                  Reply
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Reply modal */}
      <Modal open={replyOpen} onClose={() => setReplyOpen(false)} title={`Reply to ${selected?.fullName ?? ""}`}>
        {selected && (
          <div className="space-y-4">
            <div className="bg-white/4 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-white/50">
              To: <span className="text-white/80">{selected.email}</span>
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">Subject</label>
              <input
                type="text"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E50019]/50 transition-colors"
                placeholder="Subject line"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-1.5 block">Message</label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                rows={8}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E50019]/50 transition-colors resize-none"
                placeholder={`Hi ${selected.fullName},\n\nThank you for reaching out...`}
              />
            </div>
            <div className="flex justify-between pt-1">
              <button
                onClick={() => setReplyOpen(false)}
                className="px-4 py-2 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={replying || !replySubject.trim() || !replyMessage.trim()}
                className="px-5 py-2 text-sm font-medium text-white bg-[#E50019] hover:bg-[#c40015] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {replying ? "Sending…" : "Send Reply"}
              </button>
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
