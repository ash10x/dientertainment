const packages = [
  {
    tier: "First Choice Marketing",
    price: "$15",
    highlight: false,
    includes: [
      "3 permanent posts on 1 page",
      "1 story",
    ],
    duration: "Permanent",
  },
  {
    tier: "Third Priority Marketing",
    price: "$49",
    highlight: false,
    includes: [
      "1-week promotion",
      "15 posts",
      "7 story / 8 page",
    ],
    duration: "1 Week",
  },
  {
    tier: "Second Priority Marketing",
    price: "$99",
    highlight: false,
    includes: [
      "15-day promotion",
      "30 posts",
      "15 story / 15 page",
    ],
    duration: "15 Days",
  },
  {
    tier: "First Priority Marketing",
    price: "$149",
    highlight: true,
    includes: [
      "30-day promotion",
      "60 posts",
      "30 story / 30 page",
    ],
    duration: "30 Days",
  },
  {
    tier: "High Priority Marketing",
    price: "$399",
    highlight: false,
    includes: [
      "3 months of full promotion",
      "240 posts",
      "120 story / 120 page",
    ],
    duration: "3 Months",
  },
];

export default function MarketingPackages() {
  return (
    <section className="bg-brand-black py-24 lg:py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-px bg-red" />
          <span className="text-red text-[10px] tracking-[0.35em] uppercase">
            Promotion Packages
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2
            className="font-display uppercase leading-[0.88] text-brand-white"
            style={{ fontSize: "clamp(36px, 5vw, 76px)" }}
          >
            Get promoted
            <br />
            <span className="text-red">on our platform.</span>
          </h2>
          <p className="text-brand-white/35 text-sm leading-relaxed max-w-xs md:text-right">
            We promote your brand directly on diEntertainment&apos;s pages and stories.
            <br />
            Payment via PayPal · Cash App · Zelle.
          </p>
        </div>

        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-white/5">
          {packages.map((pkg) => (
            <div
              key={pkg.tier}
              className="relative flex flex-col bg-brand-black p-8"
              style={pkg.highlight ? { borderTop: "2px solid #E50019" } : { borderTop: "2px solid transparent" }}
            >
              {pkg.highlight && (
                <span className="absolute top-0 right-6 -translate-y-full pb-2 text-[9px] tracking-[0.3em] uppercase text-red">
                  Most Popular
                </span>
              )}

              {/* Duration badge */}
              <span className="text-[9px] tracking-[0.25em] uppercase text-brand-white/30 border border-white/8 px-3 py-1.5 w-fit mb-6">
                {pkg.duration}
              </span>

              {/* Tier name */}
              <div
                className="font-display text-brand-white uppercase leading-tight mb-6"
                style={{ fontSize: "clamp(16px, 1.6vw, 20px)" }}
              >
                {pkg.tier}
              </div>

              {/* Includes */}
              <div className="flex-1 mb-6">
                <span className="text-red text-[9px] tracking-[0.3em] uppercase block mb-3">
                  Includes
                </span>
                <ul className="space-y-2">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-brand-white/55 leading-snug">
                      <span className="text-red mt-0.5 shrink-0 text-xs">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price + CTA */}
              <div className="mt-auto">
                <div
                  className="font-display text-brand-white leading-none mb-4"
                  style={{ fontSize: "clamp(36px, 4vw, 52px)" }}
                >
                  {pkg.price}
                </div>
                <a
                  href={`/contact?service=digital-marketing&package=${encodeURIComponent(pkg.tier)}&price=${encodeURIComponent(pkg.price)}`}
                  className={`flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] uppercase px-4 py-3 transition-colors duration-200 ${
                    pkg.highlight
                      ? "bg-red text-brand-white hover:bg-[#FF0022]"
                      : "border border-white/15 text-brand-white/70 hover:border-white/40 hover:text-brand-white"
                  }`}
                >
                  Get Started <span className="text-sm">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
