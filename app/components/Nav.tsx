const navLinks = ["Work", "Services", "About", "Contact"];

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-baseline gap-0 shrink-0">
          <span className="font-display text-[1.6rem] leading-none text-[#E50019]">
            di
          </span>
          <span className="font-display text-[1.6rem] leading-none text-[#F5F5F5] tracking-widest">
            ENTERTAINMENT
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="nav-link text-[11px] tracking-[0.25em] uppercase text-[#F5F5F5]/60 hover:text-[#F5F5F5] transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
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
