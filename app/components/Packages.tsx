const packages = [
  {
    number: "01",
    name: "Starter AI Branding",
    price: "$300",
    includes: [
      "5 AI promotional pictures",
      "3 AI promotional videos",
      "Script writing",
      "Captions included",
      "1 promotional post on diEntertainment",
      "10+ years marketing experience",
    ],
    bestFor: ["Startups", "Local businesses", "Personal brands"],
    highlight: false,
  },
  {
    number: "02",
    name: "Business Boost Package",
    price: "$700",
    includes: [
      "15 AI promotional pictures",
      "5 AI videos",
      "Custom captions",
      "14-day promotion on diEntertainment",
      "Content strategy assistance",
      "AI branding consultation",
    ],
    bestFor: ["Growing brands", "Restaurants", "Clothing brands", "Beauty businesses"],
    highlight: true,
  },
  {
    number: "03",
    name: "Premium AI Takeover",
    price: "$1,000",
    includes: [
      "30 AI promotional pictures",
      "10 AI promotional videos",
      "Daily promotional posting",
      "30-day marketing campaign",
      "Premium cinematic edits",
      "Priority delivery",
      "Custom strategy planning",
      "Luxury branding package",
    ],
    bestFor: ["Serious businesses", "Music artists", "Influencers", "Large campaigns"],
    highlight: false,
  },
];

export default function Packages({ service = "" }: { service?: string }) {
  return (
    <section className="bg-[#0A0A0A] py-24 lg:py-32 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-px bg-[#E50019]" />
          <span className="text-[#E50019] text-[10px] tracking-[0.35em] uppercase">
            Packages & Pricing
          </span>
        </div>
        <h2
          className="font-display uppercase leading-[0.88] text-[#F5F5F5] mb-16 lg:mb-20"
          style={{ fontSize: "clamp(36px, 5vw, 76px)" }}
        >
          Choose your
          <br />
          <span className="text-[#E50019]">level.</span>
        </h2>

        {/* Package cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.06]">
          {packages.map((pkg) => (
            <div
              key={pkg.number}
              className="relative flex flex-col bg-[#0A0A0A] p-8 lg:p-10"
              style={pkg.highlight ? { borderTop: "2px solid #E50019" } : { borderTop: "2px solid transparent" }}
            >
              {pkg.highlight && (
                <span className="absolute top-0 right-8 -translate-y-full pb-2 text-[9px] tracking-[0.3em] uppercase text-[#E50019]">
                  Most Popular
                </span>
              )}

              {/* Number + name */}
              <div className="mb-6">
                <span className="text-[#E50019]/40 text-[10px] tracking-[0.3em] uppercase block mb-3">
                  {pkg.number}
                </span>
                <h3
                  className="font-display text-[#F5F5F5] uppercase leading-none"
                  style={{ fontSize: "clamp(20px, 2vw, 28px)" }}
                >
                  {pkg.name}
                </h3>
              </div>

              {/* Price */}
              <div className="mb-8 pb-8 border-b border-white/[0.07]">
                <span
                  className="font-display text-[#F5F5F5] leading-none"
                  style={{ fontSize: "clamp(44px, 5vw, 64px)" }}
                >
                  {pkg.price}
                </span>
              </div>

              {/* Includes */}
              <div className="mb-8 flex-1">
                <span className="text-[#E50019] text-[9px] tracking-[0.3em] uppercase block mb-4">
                  Includes
                </span>
                <ul className="space-y-3">
                  {pkg.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-[#F5F5F5]/55 leading-snug">
                      <span className="text-[#E50019] mt-0.5 shrink-0 text-xs">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best for */}
              <div className="mb-8">
                <span className="text-[#F5F5F5]/25 text-[9px] tracking-[0.3em] uppercase block mb-3">
                  Best For
                </span>
                <div className="flex flex-wrap gap-2">
                  {pkg.bestFor.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] tracking-[0.15em] uppercase text-[#F5F5F5]/35 border border-white/[0.08] px-3 py-1.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a
                href={`/contact?service=${encodeURIComponent(service)}&package=${encodeURIComponent(pkg.name)}&price=${encodeURIComponent(pkg.price)}`}
                className={`flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 transition-colors duration-200 ${
                  pkg.highlight
                    ? "bg-[#E50019] text-[#F5F5F5] hover:bg-[#FF0022]"
                    : "border border-white/[0.15] text-[#F5F5F5]/70 hover:border-white/40 hover:text-[#F5F5F5]"
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
