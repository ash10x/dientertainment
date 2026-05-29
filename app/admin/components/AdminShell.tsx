"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#0d0d0d] border-b border-white/8 flex items-center justify-between px-4 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-md hover:bg-white/8 transition-colors"
          aria-label="Open menu"
        >
          <span className="block w-5 h-0.5 bg-white/70 rounded" />
          <span className="block w-5 h-0.5 bg-white/70 rounded" />
          <span className="block w-3.5 h-0.5 bg-white/70 rounded" />
        </button>
        <div>
          <span className="font-bebas text-lg tracking-widest text-[#E50019]">di</span>
          <span className="font-bebas text-lg tracking-widest text-white">ENTERTAINMENT</span>
        </div>
        <div className="w-9" />
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:static md:flex md:flex-col transform transition-transform duration-200 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <AdminSidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main content — offset by mobile header height */}
      <main className="flex-1 min-w-0 overflow-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
