"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed."); return; }
      router.push("/admin");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-bebas text-3xl tracking-widest">
            <span className="text-[#E50019]">di</span>
            <span className="text-white">ENTERTAINMENT</span>
          </p>
          <p className="text-white/40 text-sm mt-1 tracking-widest uppercase">Admin Back Office</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111] border border-white/8 rounded-xl p-8 space-y-5">
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E50019]/50 focus:bg-white/8 transition-colors"
              placeholder="admin@dientertainment.com"
            />
          </div>

          <div>
            <label className="block text-xs text-white/50 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#E50019]/50 focus:bg-white/8 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[#E50019] text-xs bg-[#E50019]/10 border border-[#E50019]/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E50019] hover:bg-[#FF0022] disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
