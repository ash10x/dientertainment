import type { PackageRow } from "@/lib/queries";

export default function Packages({
  service = "",
  packages,
}: {
  service?: string;
  packages: PackageRow[];
}) {
  return (
    <section className="bg-brand-black py-24 lg:py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-px bg-red" />
          <span className="text-red text-[10px] tracking-[0.35em] uppercase">
            Packages & Pricing
          </span>
        </div>
        <h2
          className="font-display uppercase leading-[0.88] text-brand-white mb-16 lg:mb-20"
          style={{ fontSize: "clamp(36px, 5vw, 76px)" }}
        >
          Choose your
          <br />
          <span className="text-red">level.</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="relative flex flex-col bg-brand-black p-8 lg:p-10"
              style={
                pkg.highlight
                  ? { borderTop: "2px solid #E50019" }
                  : { borderTop: "2px solid transparent" }
              }
            >
              {pkg.highlight && (
                <span className="absolute top-0 right-8 -translate-y-full pb-2 text-[9px] tracking-[0.3em] uppercase text-red">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <span className="text-red/40 text-[10px] tracking-[0.3em] uppercase block mb-3">
                  {String(pkg.sortOrder).padStart(2, "0")}
                </span>
                <h3
                  className="font-display text-brand-white uppercase leading-none"
                  style={{ fontSize: "clamp(20px, 2vw, 28px)" }}
                >
                  {pkg.name}
                </h3>
              </div>

              <div className="mb-8 pb-8 border-b border-white/7">
                <span
                  className="font-display text-brand-white leading-none"
                  style={{ fontSize: "clamp(44px, 5vw, 64px)" }}
                >
                  {pkg.price}
                </span>
              </div>

              <div className="mb-8 flex-1">
                <span className="text-red text-[9px] tracking-[0.3em] uppercase block mb-4">
                  Includes
                </span>
                <ul className="space-y-3">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-brand-white/55 leading-snug">
                      <span className="text-red mt-0.5 shrink-0 text-xs">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {pkg.bestFor && pkg.bestFor.length > 0 && (
                <div className="mb-8">
                  <span className="text-brand-white/25 text-[9px] tracking-[0.3em] uppercase block mb-3">
                    Best For
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pkg.bestFor.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] tracking-[0.15em] uppercase text-brand-white/35 border border-white/8 px-3 py-1.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={`/contact?service=${encodeURIComponent(service)}&package=${encodeURIComponent(pkg.name)}&price=${encodeURIComponent(pkg.price)}`}
                className={`flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 transition-colors duration-200 ${
                  pkg.highlight
                    ? "bg-red text-brand-white hover:bg-[#FF0022]"
                    : "border border-white/15 text-brand-white/70 hover:border-white/40 hover:text-brand-white"
                }`}
              >
                Get Started <span className="text-sm">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
