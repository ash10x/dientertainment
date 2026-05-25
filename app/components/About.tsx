const pillars = [
  { label: "Founded", value: "2016" },
  { label: "Reach", value: "Global" },
  { label: "Approach", value: "360°" },
];

export default function About() {
  return (
    <section
      id="about"
      className="bg-[#0A0A0A] py-24 lg:py-36 border-t border-white/[0.05]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-px bg-[#E50019]" />
              <span className="text-[#E50019] text-[10px] tracking-[0.35em] uppercase">
                About Us
              </span>
            </div>

            <h2
              className="font-display uppercase leading-[0.88] text-[#F5F5F5] mb-6"
              style={{ fontSize: "clamp(56px, 7vw, 110px)" }}
            >
              We are
              <br />
              <span className="text-[#E50019]">di</span>Entertainment.
            </h2>

            <p className="text-[#F5F5F5]/45 text-sm leading-relaxed max-w-sm">
              Built at the intersection of storytelling and strategy. Everything
              we make is designed to cut through noise and leave a mark.
            </p>

            {/* Pillars */}
            <div className="flex gap-8 mt-12 pt-10 border-t border-white/[0.08]">
              {pillars.map((p, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span
                    className="font-display leading-none text-[#E50019]"
                    style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
                  >
                    {p.value}
                  </span>
                  <span className="text-[#F5F5F5]/35 text-[9px] tracking-[0.25em] uppercase">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-7">
            <p className="text-[#F5F5F5]/75 text-lg leading-relaxed">
              At diEntertainment, we believe every brand has a story worth
              telling — and every story deserves to be told powerfully.
            </p>
            <p className="text-[#F5F5F5]/45 leading-relaxed">
              We&apos;re a full-service news, media, and digital marketing agency
              built for brands that want to dominate their space. From
              high-impact video production to cutting-edge digital strategy, we
              deliver work that doesn&apos;t just get noticed — it gets
              remembered.
            </p>
            <p className="text-[#F5F5F5]/45 leading-relaxed">
              Our team of creatives, strategists, and storytellers work together
              to ensure your brand&apos;s message reaches the right audience, in
              the right format, at exactly the right moment.
            </p>

            <div className="pt-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-[#E50019] text-[11px] tracking-[0.25em] uppercase hover:gap-4 transition-all duration-300"
              >
                Start a Conversation <span className="text-sm">→</span>
              </a>
            </div>

            {/* Visual accent block */}
            <div className="mt-8 border border-white/[0.07] p-6 relative">
              <div className="absolute -top-px left-6 w-12 h-px bg-[#E50019]" />
              <blockquote className="text-[#F5F5F5]/60 text-sm leading-relaxed italic">
                &ldquo;We don&apos;t make content for the algorithm. We make
                content that builds brands people actually care about.&rdquo;
              </blockquote>
              <p className="text-[#E50019] text-[10px] tracking-[0.25em] uppercase mt-3">
                — diEntertainment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
