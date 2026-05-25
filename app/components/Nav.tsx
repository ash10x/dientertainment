const serviceDropdown = [
  { label: "Digital Marketing", href: "/services/digital-marketing" },
  { label: "News & Media", href: "/services/news-media" },
  { label: "Photo Production", href: "/services/photo-production" },
  { label: "Video Production", href: "/services/video-production" },
];

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-baseline gap-0 shrink-0">
          <span className="font-display text-[1.6rem] leading-none text-[#E50019]">di</span>
          <span className="font-display text-[1.6rem] leading-none text-[#F5F5F5] tracking-widest">ENTERTAINMENT</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="/#work"
            className="nav-link text-[11px] tracking-[0.25em] uppercase text-[#F5F5F5]/60 hover:text-[#F5F5F5] transition-colors duration-200"
          >
            Work
          </a>

          {/* Services with dropdown — CSS-only hover, no JS needed */}
          <div className="relative group/svc">
            <a
              href="/#services"
              className="nav-link text-[11px] tracking-[0.25em] uppercase text-[#F5F5F5]/60 hover:text-[#F5F5F5] transition-colors duration-200 flex items-center gap-1.5"
            >
              Services
              <span className="inline-block text-[8px] transition-transform duration-200 group-hover/svc:rotate-180">
                ▾
              </span>
            </a>

            {/*
              pt-4 maintains the hover target between the link and the panel
              so the mouse can travel down without losing the hover state.
            */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 invisible opacity-0 translate-y-2 group-hover/svc:visible group-hover/svc:opacity-100 group-hover/svc:translate-y-0 transition-all duration-200 z-50">
              <div
                className="bg-[#111111] border border-white/[0.08] min-w-[220px]"
                style={{ borderTop: "2px solid #E50019" }}
              >
                {serviceDropdown.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-5 py-3.5 text-[10px] tracking-[0.18em] uppercase text-[#F5F5F5]/55 hover:text-[#F5F5F5] hover:bg-white/[0.04] border-b border-white/[0.05] last:border-b-0 transition-all duration-150 group/item"
                  >
                    {item.label}
                    <span className="text-[#E50019] text-xs opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-150">
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a
            href="/#about"
            className="nav-link text-[11px] tracking-[0.25em] uppercase text-[#F5F5F5]/60 hover:text-[#F5F5F5] transition-colors duration-200"
          >
            About
          </a>
          <a
            href="/#contact"
            className="nav-link text-[11px] tracking-[0.25em] uppercase text-[#F5F5F5]/60 hover:text-[#F5F5F5] transition-colors duration-200"
          >
            Contact
          </a>
        </div>

        {/* CTA */}
        <a
          href="/contact"
          className="hidden md:flex items-center gap-2 bg-[#E50019] text-[#F5F5F5] text-[11px] tracking-[0.2em] uppercase px-6 py-3 hover:bg-[#FF0022] transition-colors duration-200 shrink-0"
        >
          Get Started
          <span className="text-sm">→</span>
        </a>

        {/* Mobile hamburger (visual only) */}
        <button className="md:hidden flex flex-col justify-center gap-[5px] p-2" aria-label="Menu">
          <span className="block w-6 h-px bg-[#F5F5F5]" />
          <span className="block w-4 h-px bg-[#F5F5F5]" />
          <span className="block w-6 h-px bg-[#F5F5F5]" />
        </button>
      </div>
    </nav>
  );
}
