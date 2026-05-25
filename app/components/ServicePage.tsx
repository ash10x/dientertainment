export type Deliverable = {
  number: string;
  title: string;
  description: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type ServiceData = {
  number: string;
  slug: string;
  category: string;
  titleLines: string[];
  tagline: string;
  pullquote: string;
  description: string[];
  deliverables: Deliverable[];
  process: ProcessStep[];
  ctaHeadline: string;
};

export default function ServicePage({
  number,
  slug,
  category,
  titleLines,
  tagline,
  pullquote,
  description,
  deliverables,
  process,
  ctaHeadline,
}: ServiceData) {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative h-screen bg-[#0A0A0A] flex flex-col pt-16 overflow-hidden">
        {/* Ambient glow — top right */}
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 80% 15%, rgba(229,0,25,0.09) 0%, transparent 60%)",
          }}
        />

        {/* Back link */}
        <div className="absolute top-24 left-6 lg:left-12 z-10">
          <a
            href="/#services"
            className="flex items-center gap-2 text-[#F5F5F5]/35 hover:text-[#E50019] text-[10px] tracking-[0.28em] uppercase transition-colors duration-200"
          >
            ← Services
          </a>
        </div>

        {/* Giant decorative number */}
        <span
          className="font-display absolute bottom-0 right-4 lg:right-10 leading-[0.8] text-white/[0.025] pointer-events-none select-none"
          style={{ fontSize: "clamp(180px, 28vw, 400px)" }}
          aria-hidden="true"
        >
          {number}
        </span>

        {/* Content — pushed to bottom */}
        <div className="mt-auto max-w-7xl mx-auto px-6 lg:px-12 w-full pb-20 lg:pb-24">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-6 h-px bg-[#E50019]" />
            <span className="text-[#E50019] text-[10px] tracking-[0.35em] uppercase">
              {category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display uppercase leading-[0.88] text-[#F5F5F5] mb-10">
            {titleLines.map((line, i) => (
              <span
                key={i}
                className="block"
                style={{ fontSize: "clamp(56px, 9.5vw, 144px)" }}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Tagline + CTA */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="text-[#F5F5F5]/50 text-lg max-w-md leading-relaxed">
              {tagline}
            </p>
            <a
              href="/#contact"
              className="flex items-center gap-2 bg-[#E50019] text-[#F5F5F5] text-[11px] tracking-[0.22em] uppercase px-8 py-4 hover:bg-[#FF0022] transition-colors duration-300 shrink-0"
            >
              Start a Project <span className="text-sm">→</span>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent to-[#E50019]/60" />
      </section>

      {/* ─── OVERVIEW ─── */}
      <section className="bg-[#0A0A0A] py-24 lg:py-36 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-6 h-px bg-[#E50019]" />
            <span className="text-[#E50019] text-[10px] tracking-[0.35em] uppercase">
              What We Deliver
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
            {/* Pullquote */}
            <blockquote
              className="font-display uppercase leading-[0.9] text-[#F5F5F5]"
              style={{ fontSize: "clamp(30px, 3.8vw, 58px)" }}
            >
              &ldquo;{pullquote}&rdquo;
            </blockquote>

            {/* Description */}
            <div className="space-y-5">
              {description.map((para, i) => (
                <p
                  key={i}
                  className={`leading-relaxed ${
                    i === 0
                      ? "text-[#F5F5F5]/75 text-lg"
                      : "text-[#F5F5F5]/45"
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── DELIVERABLES ─── */}
      <section className="bg-[#0D0D0D] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-6 h-px bg-[#E50019]" />
            <span className="text-[#E50019] text-[10px] tracking-[0.35em] uppercase">
              What&apos;s Included
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
            {deliverables.map((d) => (
              <div
                key={d.number}
                className="service-card bg-[#0D0D0D] p-8 lg:p-10 group"
              >
                <div className="text-[#E50019] text-[10px] tracking-[0.3em] uppercase mb-5">
                  {d.number}
                </div>
                <h3
                  className="font-display text-[#F5F5F5] uppercase leading-none mb-4"
                  style={{ fontSize: "clamp(20px, 2vw, 28px)" }}
                >
                  {d.title}
                </h3>
                <p className="text-[#F5F5F5]/40 text-sm leading-relaxed">
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="bg-[#0A0A0A] py-24 lg:py-32 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-6 h-px bg-[#E50019]" />
            <span className="text-[#E50019] text-[10px] tracking-[0.35em] uppercase">
              The Process
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {process.map((step) => (
              <div key={step.number}>
                {/* Number row with accent line */}
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#E50019]/25">
                  <span className="font-display text-[#E50019] text-2xl leading-none">
                    {step.number}
                  </span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                <h3
                  className="font-display text-[#F5F5F5] uppercase leading-none mb-3"
                  style={{ fontSize: "clamp(18px, 1.8vw, 24px)" }}
                >
                  {step.title}
                </h3>
                <p className="text-[#F5F5F5]/40 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-[#E50019] py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
        {/* Watermark */}
        <span
          className="font-display absolute inset-0 flex items-center justify-center leading-none text-white/[0.05] pointer-events-none select-none uppercase"
          style={{ fontSize: "clamp(140px, 24vw, 360px)" }}
          aria-hidden="true"
        >
          di
        </span>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-6 h-px bg-white/40" />
            <span className="text-white/65 text-[10px] tracking-[0.35em] uppercase">
              Let&apos;s Get Started
            </span>
          </div>

          <h2
            className="font-display uppercase leading-[0.88] text-[#F5F5F5] mb-9 whitespace-pre-line"
            style={{ fontSize: "clamp(48px, 7.5vw, 116px)" }}
          >
            {ctaHeadline}
          </h2>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href={`/contact?service=${slug}`}
              className="bg-[#0A0A0A] text-[#F5F5F5] text-[11px] tracking-[0.22em] uppercase px-9 py-4 hover:bg-[#1A1A1A] transition-colors duration-300 flex items-center gap-2"
            >
              Start a Project <span>→</span>
            </a>
            <a
              href="/#services"
              className="border border-white/35 text-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              All Services
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
