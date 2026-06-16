"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

interface NotificationItem {
  id: number;
  type: string;
  description: string;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  contact: "#3b82f6",
  booking: "#8b5cf6",
  work: "#10b981",
  service: "#f59e0b",
  package: "#f97316",
  testimonial: "#ec4899",
  stat: "#06b6d4",
  hero: "#84cc16",
  nav: "#6366f1",
  user: "#ef4444",
  setting: "#94a3b8",
  submission: "#3b82f6",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const pathname = usePathname();

  // Notifications
  const [notifCount, setNotifCount] = useState(0);
  const [notifItems, setNotifItems] = useState<NotificationItem[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    fetch("/api/admin/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null));
  }, [pathname]);

  const fetchNotifications = useCallback(() => {
    fetch("/api/admin/notifications")
      .then((r) => r.json())
      .then((d) => {
        setNotifCount(d.count ?? 0);
        setNotifItems(d.items ?? []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  function openNotifications() {
    setNotifOpen((v) => !v);
    if (!notifOpen && notifCount > 0) {
      fetch("/api/admin/notifications/read", { method: "POST" })
        .then(() => { setNotifCount(0); })
        .catch(() => {});
    }
  }

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
        {/* Bell on mobile */}
        <div ref={notifRef} className="relative">
          <button
            onClick={openNotifications}
            className="relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/8 transition-colors"
            aria-label="Notifications"
          >
            <BellIcon />
            {notifCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-[#E50019] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {notifCount > 99 ? "99+" : notifCount}
              </span>
            )}
          </button>
          {notifOpen && <NotifDropdown items={notifItems} />}
        </div>
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
        <AdminSidebar user={user} onClose={() => setOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto pt-14 md:pt-0">
        {/* Desktop top bar with bell */}
        <div className="hidden md:flex items-center justify-end h-12 px-6 border-b border-white/6 bg-[#0d0d0d]/80 sticky top-0 z-30 backdrop-blur-sm">
          <div ref={notifRef} className="relative">
            <button
              onClick={openNotifications}
              className="relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-white/8 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <BellIcon />
              {notifCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-[#E50019] text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {notifCount > 99 ? "99+" : notifCount}
                </span>
              )}
            </button>
            {notifOpen && <NotifDropdown items={notifItems} />}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function NotifDropdown({ items }: { items: NotificationItem[] }) {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-[#141414] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
      <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
        <span className="text-xs font-semibold text-white/60 tracking-widest uppercase">Notifications</span>
        {items.length === 0 && <span className="text-[10px] text-white/30">All caught up</span>}
      </div>
      <div className="max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <div className="py-8 text-center text-white/25 text-xs">No new notifications</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="px-4 py-3 border-b border-white/6 hover:bg-white/4 transition-colors">
              <div className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: TYPE_COLORS[item.type] ?? "#94a3b8" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white/80 leading-snug truncate">{item.description}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{timeAgo(item.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {items.length > 0 && (
        <div className="px-4 py-2.5 border-t border-white/8">
          <a href="/admin/activity" className="text-[10px] text-[#E50019] hover:text-[#E50019]/80 transition-colors tracking-wide">
            View all activity →
          </a>
        </div>
      )}
    </div>
  );
}
