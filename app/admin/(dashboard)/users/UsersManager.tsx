"use client";

import { useState } from "react";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";

type User = { id: number; name: string; email: string; role: string; createdAt: Date };

type FormData = { name: string; email: string; password: string; role: string };
const empty: FormData = { name: "", email: "", password: "", role: "admin" };

export default function UsersManager({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function openCreate() { setEditing(null); setForm(empty); setModalOpen(true); }
  function openEdit(u: User) { setEditing(u); setForm({ name: u.name, email: u.email, password: "", role: u.role }); setModalOpen(true); }
  function set(key: keyof FormData, value: string) { setForm((f) => ({ ...f, [key]: value })); }

  async function handleSave() {
    if (!editing && !form.password) { setToast({ message: "Password is required for new users.", type: "error" }); return; }
    setLoading(true);
    try {
      const url = editing ? `/api/admin/users/${editing.id}` : "/api/admin/users";
      const body: Partial<FormData> = { name: form.name, email: form.email, role: form.role };
      if (form.password) body.password = form.password;
      const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((prev) => editing ? prev.map((u) => u.id === editing.id ? data : u) : [...prev, data]);
      setModalOpen(false);
      setToast({ message: editing ? "User updated." : "User created.", type: "success" });
    } catch (e: unknown) {
      setToast({ message: e instanceof Error ? e.message : "Save failed.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (users.length === 1) { setToast({ message: "Cannot delete the last admin user.", type: "error" }); return; }
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) { setUsers((prev) => prev.filter((u) => u.id !== id)); setToast({ message: "User deleted.", type: "success" }); }
    else setToast({ message: "Delete failed.", type: "error" });
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E50019]/50 transition-colors";
  const roleColor: Record<string, string> = { superadmin: "text-[#E50019] bg-[#E50019]/15 border-[#E50019]/20", admin: "text-blue-400 bg-blue-400/10 border-blue-400/20" };

  return (
    <>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Users</h1>
            <p className="text-white/40 text-sm mt-1">{users.length} user{users.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={openCreate} className="bg-[#E50019] hover:bg-[#FF0022] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">+ Add User</button>
        </div>

        <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {["Name", "Email", "Role", "Created", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-widest font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-white/30">No users.</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                  <td className="px-4 py-3 text-white/60">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${roleColor[u.role] ?? "text-white/40 bg-white/5 border-white/10"}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(u)} className="text-xs text-white/50 hover:text-white px-2 py-1 rounded hover:bg-white/8 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(u.id)} className="text-xs text-[#E50019]/60 hover:text-[#E50019] px-2 py-1 rounded hover:bg-[#E50019]/10 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit User" : "New Admin User"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="jane@example.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">
                {editing ? "New Password (leave blank to keep)" : "Password"}
              </label>
              <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} className={inputCls} placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-1.5">Role</label>
              <select value={form.role} onChange={(e) => set("role", e.target.value)} className={inputCls}>
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
            </div>
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
