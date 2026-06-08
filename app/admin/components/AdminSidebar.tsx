"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/contact", label: "Contact", icon: "✉" },
  { href: "/admin/work", label: "Work Projects", icon: "◈" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "◉" },
  { href: "/admin/stats", label: "Site Stats", icon: "◎" },
  { href: "/admin/packages", label: "Packages", icon: "◫" },
  { href: "/admin/submissions", label: "Submissions", icon: "◻" },
  { href: "/admin/activity", label: "Activity Log", icon: "◑" },
  { href: "/admin/users", label: "Users", icon: "◯" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

interface AdminSidebarProps {
  user?: AdminUser | null;
  onClose?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function AdminSidebar({ user, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-60 h-full min-h-screen bg-[#0d0d0d] border-r border-white/8 flex flex-col">
      <div className="px-6 py-6 border-b border-white/8 flex items-center justify-between">
        <div>
          <span className="font-bebas text-xl tracking-widest text-[#E50019]">di</span>
          <span className="font-bebas text-xl tracking-widest text-white">ENTERTAINMENT</span>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Back Office</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden w-7 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded-md transition-colors text-lg"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ href, label, icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                active
                  ? "bg-[#E50019]/15 text-[#E50019] font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-white/8 space-y-1">
        {/* Signed-in user card */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/4 border border-white/6 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#E50019]/20 border border-[#E50019]/30 flex items-center justify-center text-[#E50019] text-xs font-bold shrink-0 select-none">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate leading-tight">{user.name}</p>
              <p className="text-[11px] text-white/40 truncate leading-tight mt-0.5 capitalize">{user.role}</p>
            </div>
          </div>
        )}

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="text-base leading-none">↗</span>
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/50 hover:text-[#E50019] hover:bg-[#E50019]/10 transition-colors"
        >
          <span className="text-base leading-none">⏻</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
