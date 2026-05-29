"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/work", label: "Work Projects", icon: "◈" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "◉" },
  { href: "/admin/stats", label: "Site Stats", icon: "◎" },
  { href: "/admin/packages", label: "Packages", icon: "◫" },
  { href: "/admin/submissions", label: "Submissions", icon: "◻" },
  { href: "/admin/users", label: "Users", icon: "◯" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-60 min-h-screen bg-[#0d0d0d] border-r border-white/8 flex flex-col">
      <div className="px-6 py-6 border-b border-white/8">
        <span className="font-bebas text-xl tracking-widest text-[#E50019]">di</span>
        <span className="font-bebas text-xl tracking-widest text-white">ENTERTAINMENT</span>
        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Back Office</p>
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

      <div className="px-3 py-4 border-t border-white/8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/50 hover:text-[#E50019] hover:bg-[#E50019]/10 transition-colors"
        >
          <span className="text-base leading-none">⏻</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
