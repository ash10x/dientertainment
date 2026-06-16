"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type ServiceLink = { label: string; href: string };

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [serviceDropdown, setServiceDropdown] = useState<ServiceLink[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    function checkAuth() {
      fetch("/api/admin/auth/me", { cache: "no-store" })
        .then((r) => r.json())
        .then((data) => setIsAdmin(!!data.user))
        .catch(() => setIsAdmin(false));
    }
    checkAuth();
    window.addEventListener("pageshow", checkAuth);

    fetch("/api/services")
      .then((r) => r.json())
      .then((data: { slug: string; title: string }[]) =>
        setServiceDropdown(data.map((s) => ({ label: s.title, href: `/services/${s.slug}` })))
      )
      .catch(() => {});

    return () => window.removeEventListener("pageshow", checkAuth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setMobileOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-brand-black/80 backdrop-blur-2xl border-b border-white/7 shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{
        WebkitBackdropFilter: scrolled
          ? "saturate(180%) blur(20px)"
          : undefined,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-17 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
          onClick={close}
        >
          <Image
            src="/icon.svg"
            alt=""
            width={32}
            height={32}
            className="w-9.5 h-9.5 transition-opacity duration-200 group-hover:opacity-75"
          />
          <span className="font-display leading-none text-[14px] tracking-[0.04em] uppercase">
            <span className="text-red">di</span>
            <span className="text-brand-white">Entertainment</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {[
            { label: "Home", href: "/" },
            { label: "Work", href: "/work" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link text-[11px] tracking-[0.24em] uppercase transition-colors duration-200 ${
                pathname === item.href
                  ? "text-brand-white"
                  : "text-brand-white/55 hover:text-brand-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Services dropdown — CSS-only hover */}
          <div className="relative group/svc">
            <button className="nav-link text-[11px] tracking-[0.24em] uppercase text-brand-white/55 hover:text-brand-white transition-colors duration-200 flex items-center gap-1.5 cursor-pointer bg-transparent border-0 p-0">
              Services
              <svg
                width="8"
                height="5"
                viewBox="0 0 8 5"
                fill="none"
                className="transition-transform duration-300 group-hover/svc:rotate-180"
              >
                <path
                  d="M1 1L4 4L7 1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Dropdown */}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 pt-5 invisible opacity-0 translate-y-2 group-hover/svc:visible group-hover/svc:opacity-100 group-hover/svc:translate-y-0 transition-all duration-250 z-50"
              style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
            >
              <div
                className="bg-[#111111]/95 backdrop-blur-xl border border-white/8 rounded-sm min-w-57.5 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
                style={{ borderTop: "1.5px solid #E50019" }}
              >
                {serviceDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-5 py-3.5 text-[10px] tracking-[0.18em] uppercase text-brand-white/50 hover:text-brand-white hover:bg-white/4 border-b border-white/5 last:border-b-0 transition-all duration-150 group/item"
                  >
                    {item.label}
                    <span className="text-red text-xs opacity-0 -translate-x-1.5 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {[
            { label: "About", href: "/about" },
            { label: "Testimonials", href: "/testimonials" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link text-[11px] tracking-[0.24em] uppercase transition-colors duration-200 ${
                pathname === item.href
                  ? "text-brand-white"
                  : "text-brand-white/55 hover:text-brand-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 border border-red/25 bg-red/7 hover:bg-red/14 hover:border-red/45 text-red text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-xs transition-all duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red shrink-0 animate-pulse" />
              Back Office
            </Link>
          )}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="hidden md:flex items-center gap-2 bg-red text-brand-white text-[11px] tracking-[0.2em] uppercase px-6 py-[11px] rounded-xs hover:bg-[#FF001F] transition-all duration-250 shrink-0 hover:shadow-[0_6px_20px_rgba(229,0,25,0.35)] hover:-translate-y-px"
          style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
        >
          Get Started
          <span className="text-sm">→</span>
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-1"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span
            className="block w-6 h-[1.5px] bg-brand-white transition-all duration-300 origin-center"
            style={
              mobileOpen
                ? { transform: "rotate(45deg) translateY(6.5px)" }
                : undefined
            }
          />
          <span
            className="block w-4 h-[1.5px] bg-brand-white transition-all duration-300 ml-auto"
            style={
              mobileOpen
                ? { opacity: 0, transform: "translateX(8px)" }
                : undefined
            }
          />
          <span
            className="block w-6 h-[1.5px] bg-brand-white transition-all duration-300 origin-center"
            style={
              mobileOpen
                ? { transform: "rotate(-45deg) translateY(-6.5px)" }
                : undefined
            }
          />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 bg-brand-black/96 backdrop-blur-2xl border-t border-white/6 ${
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
      >
        <div className="px-6 py-6 flex flex-col gap-0.5">
          <Link
            href="/"
            onClick={close}
            className="text-[11px] tracking-[0.24em] uppercase text-brand-white/55 hover:text-brand-white py-3.5 border-b border-white/6 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/work"
            onClick={close}
            className="text-[11px] tracking-[0.24em] uppercase text-brand-white/55 hover:text-brand-white py-3.5 border-b border-white/6 transition-colors duration-200"
          >
            Work
          </Link>

          {/* Mobile services accordion */}
          <div>
            <button
              onClick={() => setServicesOpen((o) => !o)}
              className="w-full flex items-center justify-between text-[11px] tracking-[0.24em] uppercase text-brand-white/55 hover:text-brand-white py-3.5 border-b border-white/6 transition-colors duration-200 bg-transparent"
            >
              Services
              <svg
                width="8"
                height="5"
                viewBox="0 0 8 5"
                fill="none"
                className={`transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="M1 1L4 4L7 1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${servicesOpen ? "max-h-80" : "max-h-0"}`}
              style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
            >
              {serviceDropdown.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="flex items-center gap-2.5 pl-5 py-3 text-[10px] tracking-[0.18em] uppercase text-brand-white/35 hover:text-brand-white border-b border-white/4 last:border-b-0 transition-colors duration-150"
                >
                  <span className="text-red text-xs">→</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {[
            { label: "About", href: "/about" },
            { label: "Testimonials", href: "/testimonials" },
            { label: "Contact", href: "/contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="text-[11px] tracking-[0.24em] uppercase text-brand-white/55 hover:text-brand-white py-3.5 border-b border-white/6 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={close}
              className="flex items-center gap-2 py-3.5 border-b border-white/6 transition-colors duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red shrink-0" />
              <span className="text-[11px] tracking-[0.24em] uppercase text-red">
                Back Office
              </span>
            </Link>
          )}

          <Link
            href="/contact"
            onClick={close}
            className="mt-5 flex items-center justify-center gap-2 bg-red text-brand-white text-[11px] tracking-[0.2em] uppercase px-6 py-4 rounded-xs hover:bg-[#FF001F] transition-colors duration-200"
          >
            Get Started
            <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
