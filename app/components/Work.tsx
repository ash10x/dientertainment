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

const fallback: WorkProject[] = [
  {
    id: 0,
    slug: "01",
    title: "Alpha Tribe - Product Launch Campaign",
    category: "AI Branding",
    year: "2026",
    bg: "#111111",
    accentColor: "#E50019",
    textLight: true,
    previewUrl:
      "https://res.cloudinary.com/dzwn2lwdz/video/upload/v1780661931/alphatribe1_b3uvmq.mp4",
  },
  {
    id: 1,
    slug: "02",
    title: "The Aroma Circle - Premium Fragrance Series",
    category: "AI Videos",
    year: "2026",
    bg: "#E50019",
    accentColor: "#0A0A0A",
    textLight: true,
    previewUrl:
      "https://res.cloudinary.com/dzwn2lwdz/video/upload/v1780661434/aromacircle1_tl9vbj.mp4",
  },
  {
    id: 2,
    slug: "03",
    title: "ToYou Car Rentals",
    category: "AI Commercials",
    year: "2026",
    bg: "#F5F5F5",
    accentColor: "#E50019",
    textLight: false,
    previewUrl:
      "https://res.cloudinary.com/dzwn2lwdz/video/upload/v1780662315/WhatsApp_Video_2026-06-05_at_6.59.02_AM_3_g934cl.mp4",
  },
  {
    id: 3,
    slug: "04",
    title: "Industry News Editorial",
    category: "News & Media",
    year: "2024",
    bg: "#0F0F0F",
    accentColor: "#E50019",
    textLight: true,
    previewUrl: null,
  },
];


export default async function Work() {
  let works: WorkProject[] = fallback;
  try {
    const rows = await getWorkProjects();
    if (rows.length >= 4) works = rows.slice(0, 4);
    else if (rows.length > 0) works = rows;
  } catch {}

  const [w0, w1, w2, w3] = works;

  return (
    <section id="work" className="bg-brand-black py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-14 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.35em] uppercase">
                Selected Work
              </span>
            </div>
            <h2
              className="font-display uppercase leading-[0.88]"
              style={{ fontSize: "clamp(48px, 6.5vw, 100px)" }}
            >
              <span className="text-brand-white">Work that</span>
              <br />
              <span className="text-outline">speaks louder.</span>
            </h2>
          </div>
          <a
            href="/work"
            className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-brand-white/40 hover:text-brand-white transition-colors duration-200 shrink-0 pb-2"
          >
            All Projects <span>→</span>
          </a>
        </div>

        {/* Grid: feature + two stacked + wide bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top-left: feature tall card */}
          {w0 && (
            <div
              className="work-card relative overflow-hidden cursor-pointer group min-h-140"
              style={{ backgroundColor: w0.bg }}
            >
              {w0.previewUrl && (
                <>
                  <CardMedia url={w0.previewUrl} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-black/10 z-1" />
                </>
              )}
              {/* Accent strip */}
              <div
                className="absolute top-0 left-0 w-1 h-full z-10"
                style={{ backgroundColor: w0.accentColor }}
              />
              {/* Large bg number — only shown without preview */}
              {!w0.previewUrl && (
                <span
                  className="font-display absolute top-6 left-8 leading-none pointer-events-none select-none text-white/[0.07]"
                  style={{ fontSize: "clamp(80px, 10vw, 140px)" }}
                >
                  {w0.slug}
                </span>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-red/0 group-hover:bg-red/10 transition-all duration-500 z-10" />
              {/* Meta */}
              <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-2 group-hover:translate-y-0 transition-transform duration-400 z-20">
                <span className="text-white/50 text-[9px] tracking-[0.3em] uppercase block mb-1.5">
                  {w0.category} · {w0.year}
                </span>
                <h3 className="font-display text-white text-2xl lg:text-3xl tracking-wide uppercase">
                  {w0.title}
                </h3>
              </div>
            </div>
          )}

          {/* Top-right: two stacked cards */}
          <div className="flex flex-col gap-4">
            {[w1, w2].filter(Boolean).map((work) => (
              <div
                key={work.id}
                className="work-card relative overflow-hidden cursor-pointer group flex-1 min-h-70"
                style={{ backgroundColor: work.bg }}
              >
                {work.previewUrl && (
                  <>
                    <CardMedia url={work.previewUrl} />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-black/5 z-1" />
                  </>
                )}
                {!work.previewUrl && (
                  <span
                    className="font-display absolute top-4 left-6 leading-none pointer-events-none select-none opacity-10"
                    style={{
                      fontSize: "clamp(60px, 7vw, 100px)",
                      color: work.textLight ? "#FFFFFF" : "#0A0A0A",
                    }}
                  >
                    {work.slug}
                  </span>
                )}
                {/* Accent bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 z-10"
                  style={{ backgroundColor: work.accentColor }}
                />
                <div className="absolute inset-0 bg-red/0 group-hover:bg-red/12 transition-all duration-500 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 z-20">
                  <span
                    className="text-[9px] tracking-[0.3em] uppercase block mb-1"
                    style={{
                      color:
                        work.textLight || work.previewUrl
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(0,0,0,0.4)",
                    }}
                  >
                    {work.category} · {work.year}
                  </span>
                  <h3
                    className="font-display text-xl tracking-wide uppercase"
                    style={{
                      color:
                        work.textLight || work.previewUrl
                          ? "#F5F5F5"
                          : "#0A0A0A",
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
              className="work-card relative overflow-hidden cursor-pointer group md:col-span-2 min-h-90"
              style={{ backgroundColor: w3.bg }}
            >
              {w3.previewUrl && (
                <>
                  <CardMedia url={w3.previewUrl} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-black/10 z-1" />
                </>
              )}
              {!w3.previewUrl && (
                <span
                  className="font-display absolute top-6 left-8 leading-none pointer-events-none select-none text-white/6"
                  style={{ fontSize: "clamp(100px, 14vw, 200px)" }}
                >
                  {w3.slug}
                </span>
              )}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 z-10"
                style={{ backgroundColor: w3.accentColor }}
              />
              <div className="absolute inset-0 bg-red/0 group-hover:bg-red/10 transition-all duration-500 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-7 flex items-end justify-between translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 z-20">
                <div>
                  <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase block mb-1.5">
                    {w3.category} · {w3.year}
                  </span>
                  <h3 className="font-display text-brand-white text-2xl lg:text-3xl tracking-wide uppercase">
                    {w3.title}
                  </h3>
                </div>
                <span className="text-red text-2xl group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-10 border-t border-white/6">
          <p className="text-brand-white/30 text-[10px] tracking-[0.25em] uppercase">
            Showing 4 of 10+ projects
          </p>
          <a
            href="/work"
            className="flex items-center gap-2 border border-white/20 text-brand-white text-[11px] tracking-[0.22em] uppercase px-8 py-4 hover:border-red hover:text-red transition-all duration-300"
          >
            View All Work <span className="text-sm">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
