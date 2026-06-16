import Link from "next/link";

export default function FutureStatement() {
  return (
    <section className="relative bg-brand-black py-28 lg:py-40 overflow-hidden border-t border-white/5">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none glow-pulse"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(229,0,25,0.11) 0%, transparent 60%)",
        }}
      />

      {/* Subtle vertical lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-linear-to-b from-transparent via-white/2.5 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-linear-to-b from-transparent via-white/2.5 to-transparent" />

      {/* Watermark */}
      <span
        className="font-display absolute inset-0 flex items-center justify-center leading-none text-white/2 pointer-events-none select-none uppercase"
        style={{ fontSize: "clamp(120px, 22vw, 340px)" }}
        aria-hidden="true"
      >
        di
      </span>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-8 h-px bg-red/60" />
          <span className="text-red text-[10px] tracking-[0.42em] uppercase">
            The Future Is Now
          </span>
          <div className="w-8 h-px bg-red/60" />
        </div>

        {/* Main statement */}
        <h2 className="font-display uppercase leading-[0.87]">
          <span
            className="block text-brand-white"
            style={{ fontSize: "clamp(44px, 7.5vw, 116px)" }}
          >
            The future of
          </span>
          <span
            className="block text-red"
            style={{
              fontSize: "clamp(44px, 7.5vw, 116px)",
              textShadow: "0 0 100px rgba(229,0,25,0.2)",
            }}
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-14">
          <Link href="/contact" className="btn-primary">
            Start Today <span>→</span>
          </Link>
          <a href="/#services" className="btn-secondary">
            Explore Services
          </a>
        </div>
      </div>
    </section>
  );
}
