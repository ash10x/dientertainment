import type { Metadata } from "next";
import { getTestimonials, getFeaturedTestimonial, getStatsByPage } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Testimonials — diEntertainment",
  description:
    "Real results, real clients. See what brands are saying about diEntertainment's AI-powered marketing services.",
};

const screenshots = [
  { id: "01", caption: "Campaign results — add screenshot" },
  { id: "02", caption: "Client metrics — add screenshot" },
  { id: "03", caption: "Social proof — add screenshot" },
  { id: "04", caption: "Analytics dashboard — add screenshot" },
  { id: "05", caption: "Before & after — add screenshot" },
  { id: "06", caption: "Client DM / review — add screenshot" },
];

export default async function TestimonialsPage() {
  const [reviews, featured, stats] = await Promise.all([
    getTestimonials(),
    getFeaturedTestimonial(),
    getStatsByPage("testimonials"),
  ]);

  return (
    <main className="bg-brand-black pt-16">

      {/* ─── HERO ─── */}
      <section className="relative border-b border-white/5 py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-150 h-150 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 80% 20%, rgba(229,0,25,0.08) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.35em] uppercase">
              Social Proof
            </span>
          </div>
          <h1 className="font-display uppercase leading-[0.88]">
            <span
              className="block text-brand-white"
              style={{ fontSize: "clamp(56px, 9vw, 140px)" }}
            >
              RESULTS.
            </span>
            <span
              className="block text-brand-white"
              style={{ fontSize: "clamp(56px, 9vw, 140px)" }}
            >
              REVIEWS.
            </span>
            <span
              className="block text-red"
              style={{ fontSize: "clamp(56px, 9vw, 140px)" }}
            >
              PROOF.
            </span>
          </h1>
          <p className="text-brand-white/40 text-lg leading-relaxed mt-8 max-w-md">
            Don&apos;t take our word for it. Here&apos;s what real clients say
            about working with diEntertainment.
          </p>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/5">
            {stats.map((s) => (
              <div key={s.statLabel} className="px-8 py-10 text-center">
                <div
                  className="font-display text-red leading-none mb-2"
                  style={{ fontSize: "clamp(40px, 5vw, 64px)" }}
                >
                  {s.statValue}
                </div>
                <div className="text-brand-white/30 text-[9px] tracking-[0.3em] uppercase">
                  {s.statLabel}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.35em] uppercase">
              Client Reviews
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {reviews.map((r) => (
              <div key={r.id} className="bg-brand-black p-8 lg:p-10 flex flex-col gap-6">
                {/* Service tag */}
                <span className="text-[9px] tracking-[0.28em] uppercase text-red/70 border border-red/20 px-3 py-1.5 w-fit">
                  {r.service}
                </span>

                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-red text-sm">★</span>
                  ))}
                </div>

                {/* Review text */}
                <blockquote className="text-brand-white/55 text-sm leading-relaxed flex-1">
                  &ldquo;{r.review}&rdquo;
                </blockquote>

                {/* Client */}
                <div className="pt-5 border-t border-white/6 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/6 border border-white/8 flex items-center justify-center shrink-0">
                    <span className="text-brand-white/20 text-[10px] font-display uppercase">
                      {r.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-brand-white/80 text-sm font-medium leading-tight">
                      {r.name}
                    </div>
                    <div className="text-brand-white/30 text-[10px] tracking-widest">
                      {r.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCREENSHOTS / RESULTS ─── */}
      <section className="bg-[#0D0D0D] py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.35em] uppercase">
              Screenshots & Results
            </span>
          </div>
          <h2
            className="font-display uppercase leading-[0.88] text-brand-white mb-16"
            style={{ fontSize: "clamp(36px, 5vw, 72px)" }}
          >
            The work
            <br />
            <span className="text-red">speaks for itself.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {screenshots.map((s) => (
              <div
                key={s.id}
                className="group relative aspect-4/3 bg-[#111111] border border-white/6 overflow-hidden flex flex-col items-center justify-center hover:border-red/30 transition-colors duration-300"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                  <div className="w-10 h-10 border border-white/12 flex items-center justify-center">
                    <span className="text-brand-white/20 text-xl">+</span>
                  </div>
                  <span className="text-brand-white/20 text-[10px] tracking-[0.2em] uppercase text-center">
                    {s.caption}
                  </span>
                  <span className="text-red/30 text-[9px] tracking-[0.2em] uppercase">
                    Replace with image
                  </span>
                </div>
                <span
                  className="font-display absolute bottom-3 right-4 text-white/4 leading-none pointer-events-none select-none"
                  style={{ fontSize: "clamp(48px, 6vw, 80px)" }}
                  aria-hidden="true"
                >
                  {s.id}
                </span>
              </div>
            ))}
          </div>

          <p className="text-brand-white/20 text-[10px] tracking-[0.2em] uppercase mt-8 text-center">
            Replace placeholder boxes with real client screenshots, results, and DMs
          </p>
        </div>
      </section>

      {/* ─── FEATURED PULLQUOTE ─── */}
      <section className="py-24 lg:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-4xl">
            <div className="w-8 h-px bg-red mb-10" />
            <blockquote
              className="font-display uppercase leading-[0.9] text-brand-white"
              style={{ fontSize: "clamp(32px, 4.5vw, 68px)" }}
            >
              &ldquo;{featured?.review ?? "Replace this with your most powerful client quote — the one that says it all."}&rdquo;
            </blockquote>
            <div className="mt-10 flex items-center gap-4">
              <div className="w-12 h-px bg-red" />
              <div>
                <div className="text-brand-white/70 text-sm">{featured?.name ?? "Client Name"}</div>
                <div className="text-brand-white/30 text-[10px] tracking-[0.2em] uppercase">{featured?.role ?? "Role, Company"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-red py-20 lg:py-28 relative overflow-hidden">
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
              Ready to get results?
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/contact"
              className="bg-brand-black text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 hover:bg-[#1A1A1A] transition-colors duration-300 flex items-center gap-2"
            >
              Start a Project <span>→</span>
            </a>
            <a
              href="/services/ai-video-creation"
              className="border border-white/35 text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              View Services
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
