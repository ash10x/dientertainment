export default function FutureStatement() {
  return (
    <section className="relative bg-brand-black py-28 lg:py-40 overflow-hidden border-t border-white/5">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(229,0,25,0.10) 0%, transparent 65%)",
        }}
      />

      {/* Decorative vertical lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-white/[0.03]" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-white/[0.03]" />

      {/* Watermark */}
      <span
        className="font-display absolute inset-0 flex items-center justify-center leading-none text-white/[0.025] pointer-events-none select-none uppercase"
        style={{ fontSize: "clamp(120px, 22vw, 340px)" }}
        aria-hidden="true"
      >
        di
      </span>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-8 h-px bg-red" />
          <span className="text-red text-[10px] tracking-[0.4em] uppercase">
            The Future Is Now
          </span>
          <div className="w-8 h-px bg-red" />
        </div>

        {/* Main statement */}
        <h2 className="font-display uppercase leading-[0.88]">
          <span
            className="block text-brand-white"
            style={{ fontSize: "clamp(44px, 7.5vw, 116px)" }}
          >
            The future of
          </span>
          <span
            className="block text-red"
            style={{ fontSize: "clamp(44px, 7.5vw, 116px)" }}
          >
            marketing is AI.
          </span>
          <span
            className="block text-brand-white mt-2"
            style={{ fontSize: "clamp(44px, 7.5vw, 116px)" }}
          >
            The future starts
          </span>
          <span
            className="block text-brand-white"
            style={{ fontSize: "clamp(44px, 7.5vw, 116px)" }}
          >
            here.
          </span>
        </h2>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-14">
          <a
            href="/contact"
            className="bg-red text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 hover:bg-[#FF0022] transition-colors duration-300 flex items-center gap-2"
          >
            Start Today <span className="text-sm">→</span>
          </a>
          <a
            href="/#services"
            className="border border-white/20 text-brand-white/60 text-[11px] tracking-[0.22em] uppercase px-10 py-4 hover:border-white/45 hover:text-brand-white transition-all duration-300"
          >
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
}
