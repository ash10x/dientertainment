"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const serviceDropdown = [
  { label: "Digital Marketing", href: "/services/digital-marketing" },
  { label: "News & Media", href: "/services/news-media" },
  { label: "Photo Production", href: "/services/photo-production" },
  { label: "Video Production", href: "/services/video-production" },
  { label: "AI Video Creation", href: "/services/ai-video-creation" },
  { label: "AI Image Generation", href: "/services/ai-image-generation" },
  { label: "Script Writing", href: "/services/script-writing" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function checkAuth() {
      fetch("/api/admin/auth/me", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => setIsAdmin(!!data.user))
        .catch(() => setIsAdmin(false));
    }

    checkAuth();

    // pageshow fires on both fresh page load AND bfcache restores (browser back/forward
    // from a full-page navigation), ensuring the button re-appears correctly in all cases.
    window.addEventListener("pageshow", checkAuth);
    return () => window.removeEventListener("pageshow", checkAuth);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => setMobileOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-black/90 backdrop-blur-md border-b border-white/6">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-baseline gap-0 shrink-0"
          onClick={close}
        >
          <span className="font-display text-[1.6rem] leading-none text-red">
            di
          </span>
          <span className="font-display text-[1.6rem] leading-none text-brand-white tracking-widest">
            ENTERTAINMENT
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/"
            className="nav-link text-[11px] tracking-[0.25em] uppercase text-brand-white/60 hover:text-brand-white transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="/work"
            className="nav-link text-[11px] tracking-[0.25em] uppercase text-brand-white/60 hover:text-brand-white transition-colors duration-200"
          >
            Work
          </a>

          {/* Services with dropdown — CSS-only hover */}
          <div className="relative group/svc">
            <button className="nav-link text-[11px] tracking-[0.25em] uppercase text-brand-white/60 hover:text-brand-white transition-colors duration-200 flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0">
              Services
              <span className="inline-block text-[8px] transition-transform duration-200 group-hover/svc:rotate-180">
                ▾
              </span>
            </button>

            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 invisible opacity-0 translate-y-2 group-hover/svc:visible group-hover/svc:opacity-100 group-hover/svc:translate-y-0 transition-all duration-200 z-50">
              <div
                className="bg-[#111111] border border-white/8 min-w-[220px]"
                style={{ borderTop: "2px solid #E50019" }}
              >
                {serviceDropdown.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-5 py-3.5 text-[10px] tracking-[0.18em] uppercase text-brand-white/55 hover:text-brand-white hover:bg-white/4 border-b border-white/5 last:border-b-0 transition-all duration-150 group/item"
                  >
                    {item.label}
                    <span className="text-red text-xs opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-150">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a
            href="/about"
            className="nav-link text-[11px] tracking-[0.25em] uppercase text-brand-white/60 hover:text-brand-white transition-colors duration-200"
          >
            About
          </a>
          <a
            href="/testimonials"
            className="nav-link text-[11px] tracking-[0.25em] uppercase text-brand-white/60 hover:text-brand-white transition-colors duration-200"
          >
            Testimonials
          </a>
          <a
            href="/contact"
            className="nav-link text-[11px] tracking-[0.25em] uppercase text-brand-white/60 hover:text-brand-white transition-colors duration-200"
          >
            Contact
          </a>
          {isAdmin && (
            <a
              href="/admin"
              className="flex items-center gap-1.5 border border-red/30 bg-red/8 hover:bg-red/15 hover:border-red/50 text-red text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 transition-all duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red shrink-0" />
              Back Office
            </a>
          )}
        </div>

        {/* Desktop CTA */}
        <a
          href="/contact"
          className="hidden md:flex items-center gap-2 bg-red text-brand-white text-[11px] tracking-[0.2em] uppercase px-6 py-3 hover:bg-[#FF0022] transition-colors duration-200 shrink-0"
        >
          Get Started
          <span className="text-sm">→</span>
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 p-2"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span
            className="block w-6 h-px bg-brand-white transition-transform duration-200 origin-center"
            style={
              mobileOpen
                ? { transform: "rotate(45deg) translateY(7px)" }
                : undefined
            }
          />
          <span
            className="block w-4 h-px bg-brand-white transition-opacity duration-200"
            style={mobileOpen ? { opacity: 0 } : undefined}
          />
          <span
            className="block w-6 h-px bg-brand-white transition-transform duration-200 origin-center"
            style={
              mobileOpen
                ? { transform: "rotate(-45deg) translateY(-7px)" }
                : undefined
            }
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-brand-black border-t border-white/6 ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-1">
          <a
            href="/work"
            onClick={close}
            className="text-[11px] tracking-[0.25em] uppercase text-brand-white/60 hover:text-brand-white py-3 border-b border-white/6 transition-colors duration-200"
          >
            Work
          </a>

          {/* Mobile services accordion */}
          <div>
            <button
              onClick={() => setServicesOpen((o) => !o)}
              className="w-full flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-brand-white/60 hover:text-brand-white py-3 border-b border-white/6 transition-colors duration-200 bg-transparent"
            >
              Services
              <span
                className={`text-[8px] transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              >
                ▾
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${servicesOpen ? "max-h-64" : "max-h-0"}`}
            >
              {serviceDropdown.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="flex items-center gap-2 pl-4 py-2.5 text-[10px] tracking-[0.18em] uppercase text-brand-white/40 hover:text-brand-white border-b border-white/4 last:border-b-0 transition-colors duration-150"
                >
                  <span className="text-red text-xs">→</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <a
            href="/about"
            onClick={close}
            className="text-[11px] tracking-[0.25em] uppercase text-brand-white/60 hover:text-brand-white py-3 border-b border-white/6 transition-colors duration-200"
          >
            About
          </a>
          <a
            href="/testimonials"
            onClick={close}
            className="text-[11px] tracking-[0.25em] uppercase text-brand-white/60 hover:text-brand-white py-3 border-b border-white/6 transition-colors duration-200"
          >
            Testimonials
          </a>
          <a
            href="/contact"
            onClick={close}
            className="text-[11px] tracking-[0.25em] uppercase text-brand-white/60 hover:text-brand-white py-3 border-b border-white/6 transition-colors duration-200"
          >
            Contact
          </a>

          {isAdmin && (
            <a
              href="/admin"
              onClick={close}
              className="flex items-center gap-2 py-3 border-b border-white/6 transition-colors duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red shrink-0" />
              <span className="text-[11px] tracking-[0.25em] uppercase text-red">
                Back Office
              </span>
            </a>
          )}

          <a
            href="/contact"
            onClick={close}
            className="mt-4 flex items-center justify-center gap-2 bg-red text-brand-white text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-[#FF0022] transition-colors duration-200"
          >
            Get Started
            <span className="text-sm">→</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
