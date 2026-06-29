import type { Metadata } from "next";
import Link from "next/link";
import WorkGrid from "../components/WorkGrid";
import { getWorkProjects, getStatsByPage, getPageHero } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Work — diEntertainment",
  description:
    "Selected projects across digital marketing, news & media, photo and video production.",
  openGraph: {
    title: "Work — diEntertainment",
    description:
      "Selected projects across digital marketing, news & media, photo and video production.",
    url: "/work",
  },
};

export default async function WorkPage() {
  const [projects, stats, hero] = await Promise.all([
    getWorkProjects(),
    getStatsByPage("work"),
    getPageHero("work"),
  ]);
  const headingLines = hero.heading.split("\n");

  const categories = Array.from(new Set(projects.map((p) => p.category))).sort();

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
                  {hero.eyebrow}
                </span>
              </div>
              <h1
                className="font-display uppercase leading-[0.88]"
                style={{ fontSize: "clamp(64px, 10vw, 152px)" }}
              >
                {headingLines.map((line, i) => (
                  <span key={i} className="text-brand-white block">{line}</span>
                ))}
                {hero.headingAccent && (
                  <span className="text-outline block">{hero.headingAccent}</span>
                )}
              </h1>
              {hero.body && (
                <p className="text-brand-white/40 text-sm leading-relaxed mt-8 max-w-sm">
                  {hero.body}
                </p>
              )}
            </div>

            {/* Right — stats */}
            <div className="flex flex-wrap lg:flex-col gap-6 lg:gap-0 lg:divide-y lg:divide-white/6 lg:border lg:border-white/6 lg:min-w-40">
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
      <WorkGrid projects={projects} categories={categories} />

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
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-black text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 rounded-xs hover:bg-[#1A1A1A] hover:-translate-y-px transition-all duration-300"
            style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
          >
            Start a Project <span className="text-sm">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
