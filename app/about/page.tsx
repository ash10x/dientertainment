import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import { getStatsByPage, getActiveServices, getPageHero } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About — diEntertainment",
  description:
    "Built at the intersection of storytelling, strategy, and AI. Learn who we are, what drives us, and why the brands that work with us don't go anywhere else.",
};

const fallbackStats = [
  { statValue: "2016", statLabel: "Founded" },
  { statValue: "8+", statLabel: "Years Active" },
  { statValue: "150+", statLabel: "Brands Elevated" },
  { statValue: "10M+", statLabel: "Audience Reached" },
];

const values = [
  {
    number: "01",
    title: "Quality Over Everything",
    description:
      "We don't ship work we wouldn't be proud to put our name on. Every asset, every campaign, every frame is held to a luxury standard — no exceptions.",
  },
  {
    number: "02",
    title: "AI-First Thinking",
    description:
      "We were early to AI and we're staying ahead of it. We use the best generative models available to produce faster, smarter, and more original work than traditional agencies can.",
  },
  {
    number: "03",
    title: "Strategy Before Aesthetics",
    description:
      "Beautiful work that doesn't perform is a waste of budget. Every creative decision we make is grounded in strategy, audience insight, and measurable goals.",
  },
  {
    number: "04",
    title: "Speed Without Compromise",
    description:
      "Traditional agencies take weeks. We move in days — because the market doesn't wait, and neither should you.",
  },
  {
    number: "05",
    title: "Radical Transparency",
    description:
      "You always know what we're working on, why we're doing it, and what results it's producing. No black boxes. No fluff reports.",
  },
  {
    number: "06",
    title: "Built for the Long Game",
    description:
      "We're not here to run one campaign and disappear. We build brand systems that compound — growing stronger and more recognisable with every piece of content we produce.",
  },
];

export default async function AboutPage() {
  let stats = fallbackStats;
  try {
    const dbStats = await getStatsByPage("about");
    if (dbStats.length > 0) stats = dbStats;
  } catch {}

  const [dbServices, hero] = await Promise.all([
    getActiveServices(),
    getPageHero("about"),
  ]);
  const services = dbServices.map((s) => ({ label: s.title, href: `/services/${s.slug}` }));
  const headingLines = hero.heading.split("\n");

  return (
    <>
      <main className="bg-brand-black pt-17">

        {/* ─── HERO ─── */}
        <section className="relative border-b border-white/5 py-24 lg:py-36 overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(229,0,25,0.07) 0%, transparent 60%)",
            }}
          />
          <span
            className="font-display absolute top-0 right-0 leading-none text-white/2.5 pointer-events-none select-none uppercase translate-x-8"
            style={{ fontSize: "clamp(140px, 22vw, 320px)" }}
            aria-hidden="true"
          >
            di
          </span>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                {hero.eyebrow}
              </span>
            </div>

            <h1
              className="font-display uppercase leading-[0.87] max-w-5xl"
              style={{ fontSize: "clamp(56px, 9vw, 140px)" }}
            >
              {headingLines.map((line, i) => (
                <span key={i} className="text-brand-white block">{line}</span>
              ))}
              {hero.headingAccent && (
                <span className="text-red block">{hero.headingAccent}</span>
              )}
            </h1>

            {hero.body && (
              <div className="mt-12 max-w-xl">
                <p className="text-brand-white/58 text-lg leading-relaxed">
                  {hero.body}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ─── STATS (from DB) ─── */}
        <section className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/5">
              {stats.map((s) => (
                <div key={s.statLabel} className="px-8 py-12 text-center group">
                  <div
                    className="font-display text-red leading-none mb-2 group-hover:text-brand-white transition-colors duration-300"
                    style={{ fontSize: "clamp(44px, 6vw, 80px)" }}
                  >
                    {s.statValue}
                  </div>
                  <div className="text-brand-white/28 text-[9px] tracking-[0.3em] uppercase">
                    {s.statLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── STORY ─── */}
        <section className="py-24 lg:py-36">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">
              {/* Left — sticky headline */}
              <div className="lg:sticky lg:top-32">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-6 h-px bg-red" />
                  <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                    Our Story
                  </span>
                </div>
                <h2
                  className="font-display uppercase leading-[0.87] text-brand-white"
                  style={{ fontSize: "clamp(44px, 6vw, 92px)" }}
                >
                  Where we
                  <br />
                  <span className="text-red">come from.</span>
                </h2>

                <div className="mt-12 border border-white/7 rounded-xs p-6 relative hover:border-white/12 transition-colors duration-300">
                  <div className="absolute -top-px left-6 w-10 h-px bg-red" />
                  <blockquote className="text-brand-white/52 text-sm leading-relaxed italic">
                    &ldquo;We don&apos;t make content for the algorithm. We make
                    content that builds brands people actually care about.&rdquo;
                  </blockquote>
                  <p className="text-red text-[10px] tracking-[0.28em] uppercase mt-4">
                    — diEntertainment
                  </p>
                </div>
              </div>

              {/* Right — story copy */}
              <div className="space-y-7">
                <p className="text-brand-white/75 text-lg leading-relaxed">
                  diEntertainment was founded in 2016 with a single belief: that great
                  storytelling is the most powerful marketing tool in existence.
                </p>
                <p className="text-brand-white/42 leading-relaxed">
                  What started as a media production company evolved into something
                  bigger — a full-service agency working at the intersection of
                  creativity, strategy, and technology. Over eight years, we&apos;ve
                  built a reputation for producing work that looks world-class and
                  performs in the real world.
                </p>
                <p className="text-brand-white/42 leading-relaxed">
                  When generative AI arrived, we were among the first agencies to
                  integrate it into our production pipeline. Not to cut corners — but
                  to do more, faster, without sacrificing the luxury standard our
                  clients expect. Today, AI is at the core of everything we build.
                </p>
                <p className="text-brand-white/42 leading-relaxed">
                  We work with startups, established brands, artists, and executives
                  who understand that in a crowded market, mediocre marketing is
                  invisible marketing. Our clients come to us because they want to be
                  the loudest, most polished voice in their space — and they stay
                  because we deliver.
                </p>

                <div className="pt-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-red text-[11px] tracking-[0.28em] uppercase hover:gap-4 transition-all duration-300 group"
                    style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
                  >
                    Work With Us
                    <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── VALUES ─── */}
        <section className="bg-surface-2 py-24 lg:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-red" />
                  <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                    What We Stand For
                  </span>
                </div>
                <h2
                  className="font-display uppercase leading-[0.87] text-brand-white"
                  style={{ fontSize: "clamp(44px, 6vw, 92px)" }}
                >
                  Our values.
                  <br />
                  <span className="text-red">Non-negotiable.</span>
                </h2>
              </div>
              <p className="text-brand-white/32 text-sm leading-relaxed max-w-xs md:text-right">
                Six principles that shape every decision we make — from the first
                brief to the final delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              {values.map((v) => (
                <div key={v.number} className="service-card bg-surface-2 p-8 lg:p-10 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="text-red/35 text-[10px] tracking-[0.32em] uppercase mb-5 font-display">
                    {v.number}
                  </div>
                  <h3
                    className="font-display text-brand-white uppercase leading-none mb-4"
                    style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-brand-white/38 text-sm leading-relaxed group-hover:text-brand-white/52 transition-colors duration-300">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHAT WE DO ─── */}
        <section className="py-24 lg:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-6 h-px bg-red" />
                  <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                    What We Do
                  </span>
                </div>
                <h2
                  className="font-display uppercase leading-[0.87] text-brand-white mb-8"
                  style={{ fontSize: "clamp(44px, 6vw, 92px)" }}
                >
                  {services.length > 0 ? `${services.length} services.` : "Our services."}
                  <br />
                  <span className="text-red">One vision.</span>
                </h2>
                <p className="text-brand-white/42 leading-relaxed max-w-sm">
                  Everything we offer is designed to work together — a complete
                  ecosystem for brands that want to dominate across every channel
                  and format.
                </p>
                <a
                  href="/#services"
                  className="inline-flex items-center gap-2 mt-8 text-red text-[11px] tracking-[0.28em] uppercase hover:gap-4 transition-all duration-300 group"
                  style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
                >
                  Explore Services
                  <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
              </div>

              <div className="grid grid-cols-1 gap-px bg-white/5">
                {services.map((s, i) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    className="bg-brand-black px-8 py-5 flex items-center justify-between group hover:bg-white/2 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-5">
                      <span className="text-red/32 text-[9px] tracking-[0.3em] font-display">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="font-display text-brand-white/65 uppercase group-hover:text-brand-white transition-colors duration-200"
                        style={{ fontSize: "clamp(16px, 1.8vw, 22px)" }}
                      >
                        {s.label}
                      </span>
                    </div>
                    <span className="text-red/0 group-hover:text-red/55 text-sm transition-colors duration-200">→</span>
                  </Link>
                ))}
              </div>
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
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-7">
              <div className="w-6 h-px bg-white/42" />
              <span className="text-white/62 text-[10px] tracking-[0.38em] uppercase">
                Ready to build something great?
              </span>
              <div className="w-6 h-px bg-white/42" />
            </div>
            <h2
              className="font-display uppercase leading-[0.87] text-brand-white mb-9"
              style={{ fontSize: "clamp(48px, 7.5vw, 116px)" }}
            >
              Your brand is
              <br />
              next.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-brand-black text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 rounded-xs hover:bg-[#1A1A1A] transition-all duration-300 hover:-translate-y-px"
                style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
              >
                Start a Project <span>→</span>
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 border border-white/32 text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 rounded-xs hover:border-white hover:bg-white/8 transition-all duration-300 hover:-translate-y-px"
                style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
              >
                View Our Work
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
