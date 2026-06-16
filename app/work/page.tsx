import type { Metadata } from "next";
import WorkGrid from "../components/WorkGrid";
import { getWorkProjects, getStatsByPage } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work — diEntertainment",
  description:
    "Selected projects across digital marketing, news & media, photo and video production.",
};

export default async function WorkPage() {
  const [projects, stats] = await Promise.all([
    getWorkProjects(),
    getStatsByPage("work"),
  ]);

  return (
    <main className="bg-brand-black pt-17">
      {/* ─── Hero ─── */}
      <section className="border-b border-white/5 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-24 items-end">
            {/* Left — headline */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-px bg-red" />
                <span className="text-red text-[10px] tracking-[0.35em] uppercase">
                  Portfolio
                </span>
              </div>
              <h1
                className="font-display uppercase leading-[0.88]"
                style={{ fontSize: "clamp(64px, 10vw, 152px)" }}
              >
                <span className="text-brand-white">Selected</span>
                <br />
                <span className="text-outline">Projects.</span>
              </h1>
              <p className="text-brand-white/40 text-sm leading-relaxed mt-8 max-w-sm">
                A selection of brand stories we&apos;ve helped tell — across
                digital marketing, media, and production.
              </p>
            </div>

            {/* Right — stats */}
            <div className="flex lg:flex-col gap-8 lg:gap-0 lg:divide-y lg:divide-white/6 lg:border lg:border-white/6 lg:min-w-40">
              {stats.map((s) => (
                <div key={s.statLabel} className="lg:px-8 lg:py-6 text-center">
                  <div
                    className="font-display text-red leading-none"
                    style={{ fontSize: "clamp(36px, 4vw, 52px)" }}
                  >
                    {s.statValue}
                  </div>
                  <div className="text-brand-white/30 text-[9px] tracking-[0.3em] uppercase mt-1">
                    {s.statLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Filterable grid ─── */}
      <WorkGrid projects={projects} />

      {/* ─── CTA ─── */}
      <section className="bg-red py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
        <span
          className="font-display absolute inset-0 flex items-center justify-center leading-none text-white/5 pointer-events-none select-none uppercase"
          style={{ fontSize: "clamp(140px, 24vw, 360px)" }}
          aria-hidden="true"
        >
          di
        </span>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="w-6 h-px bg-white/40" />
            <span className="text-white/65 text-[10px] tracking-[0.35em] uppercase">
              Ready?
            </span>
            <div className="w-6 h-px bg-white/40" />
          </div>
          <h2
            className="font-display uppercase leading-[0.88] text-brand-white mb-9"
            style={{ fontSize: "clamp(48px, 7.5vw, 116px)" }}
          >
            Your brand is
            <br />
            next.
          </h2>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-black text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 hover:bg-[#1A1A1A] transition-colors duration-300"
          >
            Start a Project <span className="text-sm">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
