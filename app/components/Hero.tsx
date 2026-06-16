export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-17 bg-brand-black overflow-hidden">
      {/* Layered ambient glows */}
      <div
        className="absolute bottom-0 left-0 w-175 h-175 pointer-events-none glow-pulse"
        style={{
          background:
            "radial-gradient(ellipse at 15% 80%, rgba(229,0,25,0.16) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-125 h-125 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 85% 10%, rgba(229,0,25,0.07) 0%, transparent 55%)",
          opacity: 0.8,
        }}
      />

      {/* Studio light streak — thin horizontal glow near top */}
      <div
        className="absolute top-32 left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(229,0,25,0.18) 30%, rgba(229,0,25,0.32) 50%, rgba(229,0,25,0.18) 70%, transparent 100%)",
          filter: "blur(1px)",
          opacity: 0.6,
        }}
      />

      {/* Grid overlay — very subtle */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, transparent 30%, black 75%)",
        }}
      />

      {/* Thin vertical accent line */}
      <div className="absolute top-0 right-24 w-px h-full bg-linear-to-b from-white/6 via-white/3 to-transparent" />

      {/* Corner label */}
      <span
        className="absolute top-32 right-10 font-display text-[9px] tracking-[0.4em] text-red/20 uppercase"
        style={{ writingMode: "vertical-rl" }}
      >
        diEntertainment · Since 2016
      </span>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-20 lg:py-28">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-8 h-px bg-red" />
          <span className="text-red text-[10px] tracking-[0.38em] uppercase">
            Digital Marketing · News & Media · AI Branding
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display uppercase leading-[0.86] tracking-tight mb-12 lg:mb-16">
          <span
            className="block text-brand-white"
            style={{ fontSize: "clamp(40px, 6.5vw, 96px)" }}
          >
            We Create AI Content
          </span>
          <span
            className="block text-brand-white"
            style={{ fontSize: "clamp(40px, 6.5vw, 96px)" }}
          >
            That Makes Brands
          </span>
          <span
            className="block"
            style={{ fontSize: "clamp(40px, 6.5vw, 96px)" }}
          >
            <span className="text-brand-white">Look </span>
            <span
              className="text-red"
              style={{
                textShadow: "0 0 80px rgba(229,0,25,0.25)",
              }}
            >
              Million Dollar.
            </span>
          </span>
        </h1>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-2">
            <p className="text-brand-white/70 text-base md:text-lg leading-relaxed">
              AI Videos. AI Commercials. AI Reels. AI Branding.
            </p>
            <p className="text-brand-white/35 text-sm md:text-base leading-relaxed">
              Luxury marketing powered by artificial intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="#work"
              className="btn-secondary"
            >
              View Our Work
            </a>
            <a
              href="#contact"
              className="btn-primary"
            >
              Start a Project <span>→</span>
            </a>
          </div>
        </div>

        {/* Stats teaser row */}
        <div className="flex items-center gap-8 lg:gap-12 mt-16 lg:mt-20 pt-10 border-t border-white/6">
          {[
            { value: "150+", label: "Brands" },
            { value: "500+", label: "Campaigns" },
            { value: "8+", label: "Years" },
            { value: "10M+", label: "Reached" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <span className="font-display text-brand-white leading-none" style={{ fontSize: "clamp(22px, 2.5vw, 34px)" }}>
                {s.value}
              </span>
              <span className="text-brand-white/30 text-[9px] tracking-[0.28em] uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decorations */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-6 lg:px-12">
        <span className="text-brand-white/20 text-[10px] tracking-[0.32em] uppercase">
          Scroll to explore
        </span>
        <span className="text-brand-white/20 text-[10px] tracking-[0.2em]">
          01 / 04
        </span>
      </div>

      {/* Scroll line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-14 scroll-line bg-linear-to-b from-transparent via-red/60 to-red" />
    </section>
  );
}
