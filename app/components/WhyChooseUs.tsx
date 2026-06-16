import { getStatsByPage } from "@/lib/queries";

const pillars = [
  {
    number: "01",
    title: "AI-Powered Marketing",
    description:
      "We use the latest generative AI models to produce visuals, videos, and campaigns that outperform traditional production at a fraction of the cost and timeline.",
  },
  {
    number: "02",
    title: "Luxury Visuals",
    description:
      "Every asset we produce is art-directed to a luxury standard. We don't generate and ship — we refine until every pixel communicates premium.",
  },
  {
    number: "03",
    title: "Fast Turnaround",
    description:
      "Traditional agencies take weeks. We deliver finished, broadcast-quality content in days — without compromising on quality or strategy.",
  },
  {
    number: "04",
    title: "Social Media Experience",
    description:
      "10+ years of experience building brand presence across Instagram, TikTok, YouTube, and beyond. We know what performs and we build for it.",
  },
  {
    number: "05",
    title: "Premium Branding",
    description:
      "From your first impression to your long-term identity, we engineer brand systems that make your business look like a million-dollar operation — every time.",
  },
];

export default async function WhyChooseUs() {
  const results = await getStatsByPage("why-choose-us");

  return (
    <>
      {/* ─── WHY CHOOSE US ─── */}
      <section className="bg-brand-black py-24 lg:py-36 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-red" />
                <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                  Why Choose Us
                </span>
              </div>
              <h2
                className="font-display uppercase leading-[0.87] text-brand-white"
                style={{ fontSize: "clamp(48px, 6.5vw, 100px)" }}
              >
                Built different.
                <br />
                <span className="text-red">Built better.</span>
              </h2>
            </div>
            <p className="text-brand-white/35 text-sm leading-relaxed max-w-xs md:text-right">
              Five reasons the brands that work with us don&apos;t go anywhere else.
            </p>
          </div>

          {/* Pillars grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {pillars.map((p, i) => (
              <div
                key={p.number}
                className={`service-card bg-brand-black p-8 lg:p-10 group relative overflow-hidden ${
                  i === 4 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="text-red/35 text-[10px] tracking-[0.32em] uppercase mb-5 font-display">
                  {p.number}
                </div>
                <h3
                  className="font-display text-brand-white uppercase leading-none mb-4 group-hover:text-brand-white transition-colors duration-200"
                  style={{ fontSize: "clamp(20px, 2vw, 28px)" }}
                >
                  {p.title}
                </h3>
                <p className="text-brand-white/38 text-sm leading-relaxed group-hover:text-brand-white/50 transition-colors duration-300">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BEFORE & AFTER ─── */}
      <section className="bg-surface-2 py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.38em] uppercase">
              Transformations
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <h2
              className="font-display uppercase leading-[0.87] text-brand-white"
              style={{ fontSize: "clamp(40px, 5.5vw, 84px)" }}
            >
              Before &amp; After
              <br />
              <span className="text-red">Branding.</span>
            </h2>
            <p className="text-brand-white/35 text-sm leading-relaxed max-w-xs md:text-right">
              People love transformations. Here&apos;s what we do to brands that trust us with their image.
            </p>
          </div>

          {/* Before/After pairs — placeholder slots */}
          <div className="flex flex-col gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
                {/* Before */}
                <div className="relative aspect-video bg-surface-1 flex flex-col items-center justify-center border border-white/6 group hover:border-white/12 transition-colors duration-300">
                  <div className="absolute top-4 left-4 text-[9px] tracking-[0.3em] uppercase text-brand-white/18 border border-white/8 px-3 py-1 rounded-xs">
                    Before
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border border-white/8 flex items-center justify-center rounded-xs">
                      <span className="text-brand-white/15 text-xl">+</span>
                    </div>
                    <span className="text-brand-white/15 text-[10px] tracking-[0.22em] uppercase">
                      Add before image
                    </span>
                  </div>
                  <span
                    className="font-display absolute bottom-3 right-4 text-white/3 leading-none pointer-events-none select-none"
                    style={{ fontSize: "clamp(48px, 8vw, 100px)" }}
                    aria-hidden="true"
                  >
                    0{n}
                  </span>
                </div>

                {/* After */}
                <div
                  className="relative aspect-video bg-surface-1 flex flex-col items-center justify-center border border-red/8 group hover:border-red/18 transition-colors duration-300"
                  style={{ borderTop: "2px solid #E50019" }}
                >
                  <div className="absolute top-4 left-4 text-[9px] tracking-[0.3em] uppercase text-red/45 border border-red/18 px-3 py-1 rounded-xs">
                    After
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border border-red/18 flex items-center justify-center rounded-xs">
                      <span className="text-red/28 text-xl">+</span>
                    </div>
                    <span className="text-brand-white/15 text-[10px] tracking-[0.22em] uppercase">
                      Add after image
                    </span>
                  </div>
                  <span className="absolute bottom-4 right-5 text-[9px] tracking-[0.22em] uppercase text-red/28">
                    diEntertainment →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-brand-white/15 text-[10px] tracking-[0.22em] uppercase mt-6 text-center">
            Replace placeholder slots with real client before &amp; after images
          </p>
        </div>
      </section>

      {/* ─── CLIENT RESULTS ─── */}
      <section className="bg-brand-black py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.38em] uppercase">
              Client Results
            </span>
          </div>
          <h2
            className="font-display uppercase leading-[0.87] text-brand-white mb-16"
            style={{ fontSize: "clamp(40px, 5.5vw, 84px)" }}
          >
            The numbers
            <br />
            <span className="text-red">don&apos;t lie.</span>
          </h2>

          {/* Stats row — from DB */}
          {results.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 mb-16">
              {results.map((r) => (
                <div key={r.statLabel} className="bg-brand-black px-8 py-10 text-center group">
                  <div
                    className="font-display text-red leading-none mb-2 group-hover:text-brand-white transition-colors duration-300"
                    style={{ fontSize: "clamp(44px, 6vw, 80px)" }}
                  >
                    {r.statValue}
                  </div>
                  <div className="text-brand-white/28 text-[9px] tracking-[0.3em] uppercase">
                    {r.statLabel}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Result screenshot placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Campaign analytics", "Client revenue growth", "Social reach metrics"].map((caption) => (
              <div
                key={caption}
                className="aspect-4/3 bg-surface-1 border border-white/6 flex flex-col items-center justify-center gap-3 hover:border-red/18 transition-colors duration-300 rounded-xs"
              >
                <div className="w-10 h-10 border border-white/8 flex items-center justify-center rounded-xs">
                  <span className="text-brand-white/15 text-xl">+</span>
                </div>
                <span className="text-brand-white/18 text-[10px] tracking-[0.22em] uppercase text-center px-6">
                  {caption}
                </span>
                <span className="text-red/22 text-[9px] tracking-[0.22em] uppercase">
                  Add screenshot
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 border-t border-white/5">
            <p className="text-brand-white/28 text-sm leading-relaxed max-w-md">
              Real numbers from real campaigns. Every result is owned by a brand that trusted diEntertainment with their marketing.
            </p>
            <a
              href="/testimonials"
              className="btn-secondary shrink-0"
            >
              View All Testimonials <span className="text-sm">→</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
