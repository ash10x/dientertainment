import type { Metadata } from "next";
import Link from "next/link";
import { getPackageBySlug, getAllPackageSlugs } from "@/lib/packages";
import BillingToggle from "./BillingToggle";
import BookingForm from "./BookingForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  return {
    title: `${pkg.name} — diEntertainment`,
    description:
      pkg.description ??
      `Explore the ${pkg.name} package from diEntertainment. Starting at ${pkg.monthlyPrice}.`,
  };
}

export async function generateStaticParams() {
  const slugs = await getAllPackageSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);

  return (
    <main className="bg-brand-black pt-17">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[80vh] bg-brand-black flex flex-col overflow-hidden">
        {/* Ambient glow */}
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
            maskImage:
              "radial-gradient(ellipse at center, transparent 40%, black 80%)",
          }}
        />

        {/* Decorative sort number */}
        <span
          className="font-display absolute bottom-0 right-4 lg:right-10 leading-[0.8] text-white/2.5 pointer-events-none select-none"
          style={{ fontSize: "clamp(180px, 28vw, 400px)" }}
          aria-hidden="true"
        >
          {String(pkg.sortOrder).padStart(2, "0")}
        </span>

        {/* Content pushed to bottom */}
        <div className="mt-auto max-w-7xl mx-auto px-6 lg:px-12 w-full pb-20 lg:pb-28">
          <Link
            href="/#packages"
            className="inline-flex items-center gap-2 text-brand-white/30 hover:text-red text-[10px] tracking-[0.28em] uppercase transition-colors duration-200 group mb-12"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
              ←
            </span>
            All Packages
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-6 h-px bg-red" />
            <span className="text-red text-[10px] tracking-[0.38em] uppercase">
              {pkg.category}
            </span>
          </div>

          <h1
            className="font-display uppercase leading-[0.87] text-brand-white mb-6"
            style={{ fontSize: "clamp(48px, 8vw, 120px)" }}
          >
            {pkg.name}
          </h1>

          {pkg.tagline && (
            <p className="text-brand-white/45 text-lg max-w-md leading-relaxed mb-10">
              {pkg.tagline}
            </p>
          )}

          {/* Billing toggle — client island */}
          <BillingToggle
            monthlyPrice={pkg.monthlyPrice}
            annualPrice={pkg.annualPrice}
            deposit={pkg.deposit}
            duration={pkg.duration}
          />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 bg-linear-to-b from-transparent to-red/55" />
      </section>

      {/* ─── FEATURE BREAKDOWN ─── */}
      {pkg.features.length > 0 && (
        <section className="bg-brand-black py-20 lg:py-28 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                What&apos;s Included
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
              {pkg.features.map((feature, i) => (
                <div
                  key={feature}
                  className="relative bg-brand-black p-7 group overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div className="flex items-start gap-4">
                    <span className="text-red/35 text-[10px] tracking-[0.32em] uppercase shrink-0 font-display mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-brand-white/70 text-sm leading-snug group-hover:text-brand-white transition-colors duration-200">
                      {feature}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Best For tags */}
            {pkg.bestFor && pkg.bestFor.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-px bg-white/15" />
                  <span className="text-brand-white/22 text-[9px] tracking-[0.38em] uppercase">
                    Best For
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pkg.bestFor.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] tracking-[0.15em] uppercase text-brand-white/32 border border-white/7 px-4 py-2 rounded-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── BOOKING FORM ─── */}
      <section className="bg-brand-black py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left — copy */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-px bg-red" />
                <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                  Book This Package
                </span>
              </div>
              <h2
                className="font-display uppercase leading-[0.87] text-brand-white mb-8"
                style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}
              >
                Let&apos;s get
                <br />
                <span className="text-red">started.</span>
              </h2>
              <p className="text-brand-white/40 text-sm leading-relaxed max-w-xs">
                Fill out the form and our team will follow up within 24 hours to
                confirm your booking and walk you through next steps.
              </p>

              {pkg.highlight && (
                <div className="mt-10 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
                  <span className="text-[9px] tracking-[0.3em] uppercase text-red">
                    Most Popular Package
                  </span>
                </div>
              )}
            </div>

            {/* Right — form */}
            <div>
              <BookingForm
                packageName={pkg.name}
                packagePrice={pkg.monthlyPrice}
                packageDeposit={pkg.deposit}
                service={pkg.category}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
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
              Not quite right?
            </span>
          </div>
          <h2
            className="font-display uppercase leading-[0.87] text-brand-white mb-9"
            style={{ fontSize: "clamp(40px, 6vw, 96px)" }}
          >
            Explore all
            <br />
            packages.
          </h2>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link
              href="/#packages"
              className="inline-flex items-center gap-2 bg-brand-black text-brand-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 rounded-xs hover:bg-[#1A1A1A] transition-all duration-300 hover:-translate-y-px"
            >
              View All Packages <span>→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/30 text-brand-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 rounded-xs hover:border-white hover:bg-white/8 transition-all duration-300 hover:-translate-y-px"
            >
              Custom Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
