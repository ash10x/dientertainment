import Link from "next/link";
import type { PackageRow } from "@/lib/queries";

export default function Packages({
  service = "",
  packages,
}: {
  service?: string;
  packages: PackageRow[];
}) {
  if (packages.length === 0) return null;

  return (
    <section className="bg-brand-black py-24 lg:py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-px bg-red" />
          <span className="text-red text-[10px] tracking-[0.38em] uppercase">
            Packages & Pricing
          </span>
        </div>
        <h2
          className="font-display uppercase leading-[0.87] text-brand-white mb-16 lg:mb-20"
          style={{ fontSize: "clamp(36px, 5vw, 76px)" }}
        >
          Choose your
          <br />
          <span className="text-red">level.</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="relative flex flex-col bg-brand-black p-8 lg:p-10 group transition-all duration-300"
              style={
                pkg.highlight
                  ? {
                      borderTop: "2px solid #E50019",
                      boxShadow: "inset 0 1px 0 rgba(229,0,25,0.12)",
                    }
                  : { borderTop: "2px solid transparent" }
              }
            >
              {/* Hover glow — stronger on highlight card */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                  pkg.highlight ? "bg-red/4" : "bg-white/2"
                }`}
              />
              {pkg.highlight && (
                <div className="absolute top-0 right-8 -translate-y-full flex items-center gap-1.5 pb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
                  <span className="text-[9px] tracking-[0.3em] uppercase text-red">Most Popular</span>
                </div>
              )}

              <div className="mb-6">
                <span className="text-red/35 text-[10px] tracking-[0.32em] uppercase block mb-3 font-display">
                  {String(pkg.sortOrder).padStart(2, "0")}
                </span>
                <h3
                  className="font-display text-brand-white uppercase leading-none"
                  style={{ fontSize: "clamp(20px, 2vw, 28px)" }}
                >
                  {pkg.name}
                </h3>
                {pkg.description && (
                  <p className="text-brand-white/40 text-sm leading-relaxed mt-2">
                    {pkg.description}
                  </p>
                )}
              </div>

              <div className="mb-8 pb-8 border-b border-white/7">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-display text-brand-white leading-none"
                    style={{ fontSize: "clamp(40px, 5vw, 60px)" }}
                  >
                    {pkg.price}
                  </span>
                  <span className="text-brand-white/30 text-[10px] tracking-[0.2em] uppercase">USD</span>
                </div>
                {pkg.deposit && (
                  <p className="text-brand-white/35 text-xs mt-1.5 tracking-wide">
                    Deposit: {pkg.deposit} <span className="text-brand-white/20 text-[9px] uppercase tracking-widest">USD</span>
                  </p>
                )}
                {pkg.duration && (
                  <span className="inline-block mt-3 text-[9px] tracking-[0.25em] uppercase text-brand-white/30 border border-white/8 px-3 py-1">
                    {pkg.duration}
                  </span>
                )}
              </div>

              <div className="mb-8 flex-1">
                <span className="text-red text-[9px] tracking-[0.32em] uppercase block mb-4">
                  Includes
                </span>
                <ul className="space-y-3">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-brand-white/50 leading-snug">
                      <span className="text-red mt-0.5 shrink-0 text-xs">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {pkg.bestFor && pkg.bestFor.length > 0 && (
                <div className="mb-8">
                  <span className="text-brand-white/22 text-[9px] tracking-[0.32em] uppercase block mb-3">
                    Best For
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pkg.bestFor.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] tracking-[0.15em] uppercase text-brand-white/32 border border-white/7 px-3 py-1.5 rounded-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={`/packages/${pkg.id}`}
                className={`relative flex items-center justify-center gap-2 text-[11px] tracking-[0.22em] uppercase px-6 py-4 rounded-xs transition-all duration-300 hover:-translate-y-px ${
                  pkg.highlight
                    ? "bg-red text-brand-white hover:bg-[#FF001F] hover:shadow-[0_8px_28px_rgba(229,0,25,0.4)]"
                    : "border border-white/14 text-brand-white/65 hover:border-white/38 hover:text-brand-white"
                }`}
                style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
              >
                Get Started <span className="text-sm">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
