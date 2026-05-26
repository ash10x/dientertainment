const packages = [
  {
    tier: "V.I.P Photo Shoot",
    price: "$349.99",
    deposit: "$150",
    highlight: false,
    description:
      "Recommended for Airbnb hosts, Turo hosts, small businesses, birthdays, and any professional photo shoot requirement.",
    includes: [
      "1 hour V.I.P shooting time",
      "2 high-end professional photo edits",
      "Full access to all excellent photos taken",
      "Unlimited clicks",
      "Unlimited poses",
    ],
  },
  {
    tier: "V.I.P Bronze Package",
    price: "$499.99",
    deposit: "$250",
    highlight: false,
    description:
      "For the individual looking for a birthday shoot to remember for a lifetime, the model updating their portfolio, or the influencer taking their content grid to the next level.",
    includes: [
      "2-hour V.I.P photo shoot — unlimited clicks & unlimited poses",
      "Location of choice within Miami-Dade, Palm Beach & Broward County",
      "5 excellent professional high-end photo edits (you choose which 5)",
      "Additional edits available at $50 each",
      "Email with all photos taken at shoot",
      "Delivering intense, impactful photos built to last a lifetime",
    ],
  },
  {
    tier: "V.I.P Silver Package",
    price: "$999.99",
    deposit: "$500",
    highlight: false,
    description:
      "For hairstylists, skincare gurus, Amazon sellers, and beauty influencers who want photos that elevate their brand across every platform.",
    includes: [
      "4-hour V.I.P photo shoot — unlimited clicks & unlimited poses",
      "Location of choice within Miami-Dade, Palm Beach & Broward County",
      "10 excellent professional high-end photo edits (you choose which 10)",
      "Additional edits available at $50 each",
      "Email with all photos taken at shoot",
      "Memory card with all raw photos from shoot",
      "Extra lighting, smoke machine & colorful light machine",
      "Delivering intense, impactful photos built to last a lifetime",
    ],
  },
  {
    tier: "V.I.P Gold Package",
    price: "$1,999.99",
    deposit: "$999",
    highlight: true,
    description:
      "For hairstylists, skincare gurus, Amazon sellers, and beauty influencers ready to fully refresh their website, social media, and brand presence.",
    includes: [
      "4-hour V.I.P photo shoot — unlimited clicks & unlimited poses",
      "Location of choice within Miami-Dade, Palm Beach & Broward County",
      "15 excellent professional high-end photo edits (you choose which 15)",
      "Additional edits available at $50 each",
      "Email with all photos taken at shoot",
      "Memory card with all raw photos from shoot",
      "Extra lighting, smoke machine & colorful light machine",
      "1-minute high-end edited video (raw version included)",
    ],
  },
  {
    tier: "V.I.P Diamond Package",
    price: "$2,499.99",
    deposit: "$1,000",
    highlight: false,
    description:
      "The ultimate V.I.P experience for hairstylists, skincare gurus, Amazon sellers, and beauty influencers. The best photos made to last forever.",
    includes: [
      "4-hour V.I.P photo shoot — unlimited clicks & unlimited poses",
      "Location of choice within Miami-Dade, Palm Beach & Broward County",
      "10 excellent professional high-end photo edits (you choose which 10)",
      "Additional edits available at $50 each",
      "Email with all photos taken at shoot",
      "Memory card with all raw photos from shoot",
      "Extra lighting, smoke machine & colorful light machine",
      "1-minute high-end edited video (raw version included)",
      "10 photos printed at standard picture size",
      "1 photo enlarged, printed & framed",
      "A wonderful photo printed teacup",
    ],
  },
];

export default function PhotoPackages() {
  return (
    <section className="bg-brand-black py-24 lg:py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
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

        {/* Package cards */}
        <div className="flex flex-col gap-px bg-white/5">
          {packages.map((pkg) => (
            <div
              key={pkg.tier}
              className="relative bg-brand-black p-8 lg:p-10"
              style={pkg.highlight ? { borderLeft: "3px solid #E50019" } : { borderLeft: "3px solid transparent" }}
            >
              {pkg.highlight && (
                <span className="absolute top-8 right-8 text-[9px] tracking-[0.3em] uppercase text-red border border-red/30 px-3 py-1">
                  Most Popular
                </span>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-8 lg:gap-12 items-start">
                {/* Left — name + description */}
                <div>
                  <div className="font-display text-brand-white uppercase leading-none mb-3"
                    style={{ fontSize: "clamp(18px, 2vw, 26px)" }}>
                    {pkg.tier}
                  </div>
                  <p className="text-brand-white/40 text-sm leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                {/* Middle — includes */}
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

                {/* Right — price + deposit + CTA */}
                <div className="flex flex-col items-start lg:items-end gap-4 lg:min-w-[160px]">
                  <div className="text-right">
                    <div
                      className="font-display text-brand-white leading-none"
                      style={{ fontSize: "clamp(36px, 4vw, 52px)" }}
                    >
                      {pkg.price}
                    </div>
                    <div className="text-brand-white/30 text-[10px] tracking-[0.2em] uppercase mt-1">
                      Deposit: <span className="text-red/70">{pkg.deposit}</span>
                    </div>
                  </div>
                  <a
                    href={`/contact?service=photo-production&package=${encodeURIComponent(pkg.tier)}&price=${encodeURIComponent(pkg.price)}&deposit=${encodeURIComponent(pkg.deposit)}`}
                    className={`flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase px-6 py-3 transition-colors duration-200 whitespace-nowrap ${
                      pkg.highlight
                        ? "bg-red text-brand-white hover:bg-[#FF0022]"
                        : "border border-white/15 text-brand-white/70 hover:border-white/40 hover:text-brand-white"
                    }`}
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
