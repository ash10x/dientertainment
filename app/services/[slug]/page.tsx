import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveServices, getPackagesByService } from "@/lib/queries";
import Packages from "@/app/components/Packages";
import Footer from "@/app/components/Footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const services = await getActiveServices();
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} — diEntertainment`,
    description: service.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [services, pkgs] = await Promise.all([
    getActiveServices(),
    getPackagesByService(slug),
  ]);
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
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
              maskImage: "radial-gradient(ellipse at center, transparent 40%, black 80%)",
            }}
          />

          {/* Giant decorative number */}
          <span
            className="font-display absolute bottom-0 right-4 lg:right-10 leading-[0.8] text-white/2.5 pointer-events-none select-none"
            style={{ fontSize: "clamp(180px, 28vw, 400px)" }}
            aria-hidden="true"
          >
            {service.number}
          </span>

          {/* Content pushed to bottom */}
          <div className="mt-auto max-w-7xl mx-auto px-6 lg:px-12 w-full pb-20 lg:pb-28">
            <a
              href="/#services"
              className="inline-flex items-center gap-2 text-brand-white/30 hover:text-red text-[10px] tracking-[0.28em] uppercase transition-colors duration-200 group mb-12"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
              All Services
            </a>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                {service.title}
              </span>
            </div>

            <h1
              className="font-display uppercase leading-[0.87] text-brand-white mb-10"
              style={{ fontSize: "clamp(56px, 9.5vw, 144px)" }}
            >
              {service.title}
            </h1>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <p className="text-brand-white/45 text-lg max-w-md leading-relaxed">
                {service.description}
              </p>
              <a href={`/contact?service=${slug}`} className="btn-primary shrink-0">
                Start a Project <span>→</span>
              </a>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-12 scroll-line bg-linear-to-b from-transparent to-red/55" />
        </section>

        {/* ─── TAGS / WHAT WE OFFER ─── */}
        {service.tags.length > 0 && (
          <section className="bg-brand-black py-20 lg:py-28 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-6 h-px bg-red" />
                <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                  What&apos;s Covered
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
                {service.tags.map((tag, i) => (
                  <div
                    key={tag}
                    className="service-card bg-brand-black p-8 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <div className="text-red/35 text-[10px] tracking-[0.32em] uppercase mb-4 font-display">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3
                      className="font-display text-brand-white uppercase leading-none group-hover:text-brand-white transition-colors duration-200"
                      style={{ fontSize: "clamp(16px, 1.8vw, 24px)" }}
                    >
                      {tag}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── PACKAGES ─── */}
        <Packages service={slug} packages={pkgs} />

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
              className="font-display uppercase leading-[0.87] text-brand-white mb-9"
              style={{ fontSize: "clamp(48px, 7.5vw, 116px)" }}
            >
              Ready to elevate
              <br />
              your brand?
            </h2>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <a
                href={`/contact?service=${slug}`}
                className="inline-flex items-center gap-2 bg-brand-black text-brand-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 rounded-xs hover:bg-[#1A1A1A] transition-all duration-300 hover:-translate-y-px"
              >
                Start a Project <span>→</span>
              </a>
              <a
                href="/#services"
                className="inline-flex items-center gap-2 border border-white/30 text-brand-white text-[11px] tracking-[0.22em] uppercase px-9 py-4 rounded-xs hover:border-white hover:bg-white/8 transition-all duration-300 hover:-translate-y-px"
              >
                All Services
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
