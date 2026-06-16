import type { PackageRow } from "@/lib/queries";

export default function PhotoPackages({ packages }: { packages: PackageRow[] }) {
  return (
    <section className="bg-brand-black py-24 lg:py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-px bg-red" />
          <span className="text-red text-[10px] tracking-[0.35em] uppercase">
            Packages & Pricing
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2
            className="font-display uppercase leading-[0.88] text-brand-white"
            style={{ fontSize: "clamp(36px, 5vw, 76px)" }}
          >
            Choose your
            <br />
            <span className="text-red">V.I.P level.</span>
          </h2>
          <p className="text-brand-white/35 text-sm leading-relaxed max-w-xs md:text-right">
            Turnaround time for all edits: <span className="text-brand-white/60">1–3 business days.</span>
            <br />
            Deposit required to book. Any shoot outside Miami-Dade, Palm Beach &amp; Broward County subject to additional fees.
          </p>
        </div>

        <div className="flex flex-col gap-px bg-white/5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="relative bg-brand-black p-8 lg:p-10"
              style={
                pkg.highlight
                  ? { borderLeft: "3px solid #E50019" }
                  : { borderLeft: "3px solid transparent" }
              }
            >
              {pkg.highlight && (
                <span className="absolute top-8 right-8 text-[9px] tracking-[0.3em] uppercase text-red border border-red/30 px-3 py-1">
                  Most Popular
                </span>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-8 lg:gap-12 items-start">
                <div>
                  <div
                    className="font-display text-brand-white uppercase leading-none mb-3"
                    style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
                  >
                    {pkg.name}
                  </div>
                  {pkg.description && (
                    <p className="text-brand-white/40 text-sm leading-relaxed">
                      {pkg.description}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-red text-[9px] tracking-[0.3em] uppercase block mb-4">
                    Includes
                  </span>
                  <ul className="space-y-2.5">
                    {pkg.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-brand-white/55 leading-snug">
                        <span className="text-red mt-0.5 shrink-0 text-xs">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-4 lg:min-w-40">
                  <div className="lg:text-right">
                    <div
                      className="font-display text-brand-white leading-none"
                      style={{ fontSize: "clamp(36px, 4vw, 52px)" }}
                    >
                      {pkg.price}
                    </div>
                    {pkg.deposit && (
                      <div className="text-brand-white/30 text-[10px] tracking-[0.2em] uppercase mt-1">
                        Deposit: <span className="text-red/70">{pkg.deposit}</span>
                      </div>
                    )}
                  </div>
                  <a
                    href={`/contact?service=photo-production&package=${encodeURIComponent(pkg.name)}&price=${encodeURIComponent(pkg.price)}${pkg.deposit ? `&deposit=${encodeURIComponent(pkg.deposit)}` : ""}`}
                    className={`flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase px-6 py-3.5 rounded-xs transition-all duration-250 hover:-translate-y-px whitespace-nowrap ${
                      pkg.highlight
                        ? "bg-red text-brand-white hover:bg-[#FF001F] hover:shadow-[0_6px_20px_rgba(229,0,25,0.35)]"
                        : "border border-white/14 text-brand-white/65 hover:border-white/38 hover:text-brand-white"
                    }`}
                    style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
                  >
                    Book Now <span className="text-sm">→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-brand-white/20 text-[10px] tracking-[0.2em] uppercase mt-8 text-center">
          Payment via PayPal · Cash App · Zelle · All Electronic Payments
        </p>
      </div>
    </section>
  );
}
