"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const groups = [
  {
    label: "Overview",
    links: [
      { href: "/admin", label: "Dashboard", exact: true, icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
          <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      )},
    ],
  },
  {
    label: "Content",
    links: [
      { href: "/admin/work", label: "Work Projects", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1" y="3" width="14" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1 6h14" stroke="currentColor" strokeWidth="1.3" />
          <path d="M5 6v7" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      )},
      { href: "/admin/services", label: "Services", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 4.5v3.5l2.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )},
      { href: "/admin/packages", label: "Packages", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1.5L14.5 5v6L8 14.5 1.5 11V5L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M8 1.5v13M1.5 5l6.5 3.5 6.5-3.5" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      )},
      { href: "/admin/heroes", label: "Page Heroes", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1" y="2" width="14" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1 7h14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5" />
          <path d="M4 10h5M4 12h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )},
    ],
  },
  {
    label: "Engagement",
    links: [
      { href: "/admin/testimonials", label: "Testimonials", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 5.5C3 4.12 4.12 3 5.5 3h5C11.88 3 13 4.12 13 5.5v3C13 9.88 11.88 11 10.5 11H9l-2 2v-2H5.5C4.12 11 3 9.88 3 8.5v-3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      )},
      { href: "/admin/submissions", label: "Submissions", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="12" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )},
      { href: "/admin/meetings", label: "Meetings", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="5" r="2" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="3" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="13" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1 14c0-2 .9-3 2-3.5M15 14c0-2-.9-3-2-3.5M5 14c0-2.5 1.3-4 3-4s3 1.5 3 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )},
      { href: "/admin/contact", label: "Contact", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1.5" y="3.5" width="13" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1.5 5l6.5 4.5L14.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      )},
    ],
  },
  {
    label: "Analytics",
    links: [
      { href: "/admin/stats", label: "Site Stats", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 12l3.5-4 3 2.5 3-5.5 2.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )},
      { href: "/admin/activity", label: "Activity Log", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )},
    ],
  },
  {
    label: "System",
    links: [
      { href: "/admin/availability", label: "Availability", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="12" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M2 6h12" stroke="currentColor" strokeWidth="1.3" />
          <path d="M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M5 9.5h2M9 9.5h2M5 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )},
      { href: "/admin/nav", label: "Navigation", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )},
      { href: "/admin/users", label: "Users", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M2 13c0-2.76 2.69-5 6-5s6 2.24 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )},
      { href: "/admin/settings", label: "Settings", icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.4 3.4l.85.85M11.75 11.75l.85.85M3.4 12.6l.85-.85M11.75 4.25l.85-.85" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      )},
    ],
  },
];

interface AdminUser { name: string; email: string; role: string }
interface AdminSidebarProps { user?: AdminUser | null; onClose?: () => void }

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function AdminSidebar({ user, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Start with all groups open
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.label, true]))
  );

  function toggleGroup(label: string) {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="w-60 h-full min-h-screen bg-[#0d0d0d] border-r border-white/8 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/8 flex items-center justify-between">
        <div>
          <span className="font-bebas text-xl tracking-widest text-[#E50019]">di</span>
          <span className="font-bebas text-xl tracking-widest text-white">ENTERTAINMENT</span>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Back Office</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden w-7 h-7 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded-md transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto" aria-label="Admin navigation">
        {groups.map((group) => {
          const groupActive = group.links.some((l) => isActive(l.href, (l as {exact?: boolean}).exact));
          const isOpen = open[group.label];

          return (
            <div key={group.label} className="mb-1">
              {/* Group header */}
              <button
                onClick={() => toggleGroup(group.label)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-150 cursor-pointer ${
                  groupActive && !isOpen
                    ? "text-[#E50019]/80"
                    : "text-white/28 hover:text-white/55"
                }`}
                aria-expanded={isOpen}
              >
                {group.label}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Group links */}
              <div
                className={`overflow-hidden transition-all duration-250 ${isOpen ? "max-h-96" : "max-h-0"}`}
                style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
              >
                <div className="space-y-0.5 pb-1">
                  {group.links.map(({ href, label, icon, ...rest }) => {
                    const exact = (rest as { exact?: boolean }).exact;
                    const active = isActive(href, exact);
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-150 ${
                          active
                            ? "bg-[#E50019]/15 text-[#E50019] font-medium"
                            : "text-white/45 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className={`shrink-0 ${active ? "text-[#E50019]" : "text-white/30"}`}>
                          {icon}
                        </span>
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/8 space-y-1">
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
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-white/45 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5.5 2.5H2a1 1 0 00-1 1V12a1 1 0 001 1h8.5a1 1 0 001-1V8.5M8.5 1.5h4m0 0v4m0-4L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm text-white/45 hover:text-[#E50019] hover:bg-[#E50019]/10 transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5 2H2.5A1.5 1.5 0 001 3.5v7A1.5 1.5 0 002.5 12H5M9.5 10l3-3-3-3M4 7h8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
