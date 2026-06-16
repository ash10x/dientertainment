import Link from "next/link";
import { getWorkProjects } from "@/lib/queries";
import { CardMedia } from "./CardMedia";

type WorkProject = {
  id: number;
  slug: string;
  title: string;
  category: string;
  year: string;
  bg: string;
  accentColor: string;
  textLight: boolean;
  previewUrl: string | null;
};

export default async function Work() {
  let works: WorkProject[] = [];
  let totalCount = 0;

  try {
    const rows = await getWorkProjects();
    totalCount = rows.length;
    works = rows.length >= 4 ? rows.slice(0, 4) : rows;
  } catch {}

  if (works.length === 0) return null;

  const [w0, w1, w2, w3] = works;
  const previewCount = works.length;

  return (
    <section id="work" className="bg-brand-black py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-14 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                Selected Work
              </span>
            </div>
            <h2
              className="font-display uppercase leading-[0.87]"
              style={{ fontSize: "clamp(48px, 6.5vw, 100px)" }}
            >
              <span className="text-brand-white">Work that</span>
              <br />
              <span className="text-outline">speaks louder.</span>
            </h2>
          </div>
          <Link
            href="/work"
            className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-brand-white/35 hover:text-brand-white transition-colors duration-200 shrink-0 pb-2 group"
          >
            All Projects
            <span className="group-hover:translate-x-1 transition-transform duration-200 text-sm">→</span>
          </Link>
        </div>

        {/* Grid: feature + two stacked + wide bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Top-left: feature tall card */}
          {w0 && (
            <div
              className="work-card relative overflow-hidden cursor-pointer group min-h-140 rounded-xs"
              style={{ backgroundColor: w0.bg }}
            >
              {w0.previewUrl && (
                <>
                  <CardMedia url={w0.previewUrl} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/5 z-1" />
                </>
              )}
              <div
                className="absolute top-0 left-0 w-1 h-full z-10"
                style={{ backgroundColor: w0.accentColor }}
              />
              {!w0.previewUrl && (
                <span
                  className="font-display absolute top-6 left-8 leading-none pointer-events-none select-none text-white/6"
                  style={{ fontSize: "clamp(80px, 10vw, 140px)" }}
                >
                  {w0.slug}
                </span>
              )}
              <div className="absolute inset-0 bg-red/0 group-hover:bg-red/8 transition-all duration-500 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-2 group-hover:translate-y-0 transition-transform duration-400 z-20" style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}>
                <span className="text-white/45 text-[9px] tracking-[0.3em] uppercase block mb-1.5">
                  {w0.category} · {w0.year}
                </span>
                <h3 className="font-display text-white leading-tight uppercase" style={{ fontSize: "clamp(20px, 2.5vw, 32px)" }}>
                  {w0.title}
                </h3>
              </div>
            </div>
          )}

          {/* Top-right: two stacked cards */}
          <div className="flex flex-col gap-3">
            {[w1, w2].filter(Boolean).map((work) => (
              <div
                key={work.id}
                className="work-card relative overflow-hidden cursor-pointer group flex-1 min-h-68 rounded-xs"
                style={{ backgroundColor: work.bg }}
              >
                {work.previewUrl && (
                  <>
                    <CardMedia url={work.previewUrl} />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-1" />
                  </>
                )}
                {!work.previewUrl && (
                  <span
                    className="font-display absolute top-4 left-6 leading-none pointer-events-none select-none"
                    style={{
                      fontSize: "clamp(60px, 7vw, 100px)",
                      color: work.textLight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                    }}
                  >
                    {work.slug}
                  </span>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 z-10"
                  style={{ backgroundColor: work.accentColor }}
                />
                <div className="absolute inset-0 bg-red/0 group-hover:bg-red/10 transition-all duration-500 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 z-20" style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}>
                  <span
                    className="text-[9px] tracking-[0.3em] uppercase block mb-1"
                    style={{
                      color:
                        work.textLight || work.previewUrl
                          ? "rgba(255,255,255,0.45)"
                          : "rgba(0,0,0,0.35)",
                    }}
                  >
                    {work.category} · {work.year}
                  </span>
                  <h3
                    className="font-display uppercase leading-tight"
                    style={{
                      fontSize: "clamp(18px, 2vw, 26px)",
                      color:
                        work.textLight || work.previewUrl ? "#F5F5F5" : "#0A0A0A",
                    }}
                  >
                    {work.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom: wide card spanning both columns */}
          {w3 && (
            <div
              className="work-card relative overflow-hidden cursor-pointer group md:col-span-2 min-h-88 rounded-xs"
              style={{ backgroundColor: w3.bg }}
            >
              {w3.previewUrl && (
                <>
                  <CardMedia url={w3.previewUrl} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent z-1" />
                </>
              )}
              {!w3.previewUrl && (
                <span
                  className="font-display absolute top-6 left-8 leading-none pointer-events-none select-none text-white/5"
                  style={{ fontSize: "clamp(100px, 14vw, 200px)" }}
                >
                  {w3.slug}
                </span>
              )}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 z-10"
                style={{ backgroundColor: w3.accentColor }}
              />
              <div className="absolute inset-0 bg-red/0 group-hover:bg-red/8 transition-all duration-500 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-7 flex items-end justify-between translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 z-20" style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}>
                <div>
                  <span className="text-white/38 text-[9px] tracking-[0.3em] uppercase block mb-1.5">
                    {w3.category} · {w3.year}
                  </span>
                  <h3 className="font-display text-brand-white uppercase leading-tight" style={{ fontSize: "clamp(20px, 2.5vw, 32px)" }}>
                    {w3.title}
                  </h3>
                </div>
                <span className="text-red text-2xl group-hover:translate-x-1.5 transition-transform duration-300">
                  →
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-10 border-t border-white/5">
          <p className="text-brand-white/28 text-[10px] tracking-[0.25em] uppercase">
            Showing {previewCount} of {totalCount}+ projects
          </p>
          <Link href="/work" className="btn-secondary">
            View All Work <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
