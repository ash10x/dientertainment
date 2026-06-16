import Packages from "./Packages";
import PhotoPackages from "./PhotoPackages";
import MarketingPackages from "./MarketingPackages";
import VideoPackages from "./VideoPackages";
import { getPackagesByService } from "@/lib/queries";

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
  packagesVariant?: "ai" | "photo" | "marketing" | "video";
};

export default async function ServicePage({
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
  packagesVariant,
}: ServiceData) {
  const pkgs = packagesVariant ? await getPackagesByService(slug) : [];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen bg-brand-black flex flex-col pt-17 overflow-hidden">
        {/* Ambient glow — top right */}
        <div
          className="absolute top-0 right-0 w-175 h-175 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 15%, rgba(229,0,25,0.09) 0%, transparent 60%)",
          }}
        />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at center, transparent 40%, black 80%)",
          }}
        />

        {/* Giant decorative number */}
        <span
          className="font-display absolute bottom-0 right-4 lg:right-10 leading-[0.8] text-white/2.5 pointer-events-none select-none"
          style={{ fontSize: "clamp(180px, 28vw, 400px)" }}
          aria-hidden="true"
        >
          {number}
        </span>

        {/* Content — pushed to bottom */}
        <div className="mt-auto max-w-7xl mx-auto px-6 lg:px-12 w-full pb-20 lg:pb-28">
          {/* Back link */}
          <a
            href="/#services"
            className="inline-flex items-center gap-2 text-brand-white/30 hover:text-red text-[10px] tracking-[0.28em] uppercase transition-colors duration-200 group mb-12"
            style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
            All Services
          </a>

          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.38em] uppercase">
              {category}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display uppercase leading-[0.87] text-brand-white mb-10">
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
            <p className="text-brand-white/45 text-lg max-w-md leading-relaxed">
              {tagline}
            </p>
            <a
              href={`/contact?service=${slug}`}
              className="btn-primary shrink-0"
            >
              Start a Project <span>→</span>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 scroll-line bg-linear-to-b from-transparent to-red/55" />
      </section>

      {/* ─── PACKAGES ─── */}
      {packagesVariant === "ai" && <Packages service={slug} packages={pkgs} />}
      {packagesVariant === "photo" && <PhotoPackages packages={pkgs} />}
      {packagesVariant === "marketing" && <MarketingPackages packages={pkgs} />}
      {packagesVariant === "video" && <VideoPackages packages={pkgs} />}

      {/* ─── OVERVIEW ─── */}
      <section className="bg-brand-black py-24 lg:py-36 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.38em] uppercase">
              What We Deliver
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
            {/* Pullquote */}
            <blockquote
              className="font-display uppercase leading-[0.9] text-brand-white"
              style={{ fontSize: "clamp(28px, 3.6vw, 56px)" }}
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
                      ? "text-brand-white/75 text-lg"
                      : "text-brand-white/42"
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
      <section className="bg-surface-2 py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.38em] uppercase">
              What&apos;s Included
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {deliverables.map((d) => (
              <div
                key={d.number}
                className="service-card bg-surface-2 p-8 lg:p-10 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="text-red text-[10px] tracking-[0.32em] uppercase mb-5 font-display">
                  {d.number}
                </div>
                <h3
                  className="font-display text-brand-white uppercase leading-none mb-4"
                  style={{ fontSize: "clamp(18px, 1.8vw, 26px)" }}
                >
                  {d.title}
                </h3>
                <p className="text-brand-white/38 text-sm leading-relaxed group-hover:text-brand-white/52 transition-colors duration-300">
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="bg-brand-black py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.38em] uppercase">
              The Process
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {process.map((step, i) => (
              <div key={step.number} className="group">
                {/* Number row */}
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-red/22">
                  <span className="font-display text-red leading-none" style={{ fontSize: "clamp(20px, 2vw, 28px)" }}>
                    {step.number}
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
                  {i < process.length - 1 && (
                    <span className="text-red/25 text-xs">→</span>
                  )}
                </div>
                <h3
                  className="font-display text-brand-white uppercase leading-none mb-3"
                  style={{ fontSize: "clamp(16px, 1.6vw, 22px)" }}
                >
                  {step.title}
                </h3>
                <p className="text-brand-white/38 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-red py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-white/25" />
        <span
          className="font-display absolute inset-0 flex items-center justify-center leading-none text-white/5 pointer-events-none select-none uppercase"
          style={{ fontSize: "clamp(140px, 24vw, 360px)" }}
          aria-hidden="true"
        >
          di
        </span>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex items-center gap-4 mb-7">
            <div className="w-6 h-px bg-white/45" />
            <span className="text-white/60 text-[10px] tracking-[0.38em] uppercase">
              Let&apos;s Get Started
            </span>
          </div>

          <h2
            className="font-display uppercase leading-[0.87] text-brand-white mb-9 whitespace-pre-line"
            style={{ fontSize: "clamp(48px, 7.5vw, 116px)" }}
          >
            {ctaHeadline}
          </h2>

          <div className="flex flex-col sm:flex-row items-start gap-3">
            <a
              href={`/contact?service=${slug}`}
              className="inline-flex items-center gap-2 bg-brand-black text-brand-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 rounded-xs hover:bg-[#1A1A1A] transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
              style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
            >
              Start a Project <span>→</span>
            </a>
            <a
              href="/#services"
              className="inline-flex items-center gap-2 border border-white/30 text-brand-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 rounded-xs hover:border-white hover:bg-white/8 transition-all duration-300 hover:-translate-y-px"
              style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
            >
              All Services
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
