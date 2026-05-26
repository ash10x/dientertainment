export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col justify-center pt-16 bg-[#0A0A0A] overflow-hidden">
      {/* Ambient red glow — bottom left */}
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(229,0,25,0.13) 0%, transparent 65%)",
        }}
      />

      {/* Thin vertical accent line */}
      <div className="absolute top-0 right-24 w-px h-full bg-white/[0.04]" />

      {/* Corner label */}
      <span
        className="absolute top-28 right-12 font-display text-[10px] tracking-[0.35em] text-[#E50019]/25 uppercase"
        style={{ writingMode: "vertical-rl" }}
      >
        diEntertainment · 2016
      </span>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-8 h-px bg-[#E50019]" />
          <span className="text-[#E50019] text-[10px] tracking-[0.35em] uppercase">
            AI Videos · AI Commercials · AI Branding
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display uppercase leading-[0.88] tracking-tight">
          <span
            className="block text-[#F5F5F5]"
            style={{ fontSize: "clamp(38px, 6vw, 90px)" }}
          >
            WE CREATE AI CONTENT
          </span>
          <span
            className="block text-[#F5F5F5]"
            style={{ fontSize: "clamp(38px, 6vw, 90px)" }}
          >
            THAT MAKES BRANDS
          </span>
          <span
            className="block"
            style={{ fontSize: "clamp(38px, 6vw, 90px)" }}
          >
            <span className="text-[#F5F5F5]">LOOK </span>
            <span className="text-[#E50019]">MILLION DOLLAR.</span>
          </span>
        </h1>

        {/* Bottom row — descriptor + CTAs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-12 lg:mt-16">
          <div>
            <p className="text-brand-white/70 text-base md:text-lg leading-relaxed">
              AI Videos. AI Commercials. AI Reels. AI Branding.
            </p>
            <p className="text-brand-white/40 text-base md:text-lg leading-relaxed">
              Luxury marketing powered by artificial intelligence.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="#work"
              className="border border-[#F5F5F5]/25 text-[#F5F5F5] text-[11px] tracking-[0.22em] uppercase px-8 py-4 hover:border-[#F5F5F5] transition-colors duration-300"
            >
              View Our Work
            </a>
            <a
              href="#contact"
              className="bg-[#E50019] text-[#F5F5F5] text-[11px] tracking-[0.22em] uppercase px-8 py-4 hover:bg-[#FF0022] transition-colors duration-300 flex items-center gap-2"
            >
              Start a Project <span className="text-sm">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-6 lg:px-12">
        <span className="text-[#F5F5F5]/25 text-[10px] tracking-[0.3em] uppercase">
          Scroll to explore
        </span>
        <span className="text-[#F5F5F5]/25 text-[10px] tracking-[0.2em]">
          01 / 04
        </span>
      </div>

      {/* Scroll line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-[#E50019]/50 to-[#E50019]" />
    </section>
  );
}
