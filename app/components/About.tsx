import Link from "next/link";

const pillars = [
  { label: "Founded", value: "2016" },
  { label: "Reach", value: "Global" },
  { label: "Approach", value: "360°" },
];

export default function About() {
  return (
    <section
      id="about"
      className="bg-brand-black py-24 lg:py-36 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
          {/* Left */}
          <div data-reveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                About Us
              </span>
            </div>

            <h2
              className="font-display uppercase leading-[0.87] text-brand-white mb-6"
              style={{ fontSize: "clamp(52px, 7vw, 110px)" }}
            >
              We are
              <br />
              <span className="text-red">di</span>Entertainment.
            </h2>

            <p className="text-brand-white/40 text-sm leading-relaxed max-w-sm">
              Built at the intersection of storytelling and strategy. Everything
              we make is designed to cut through noise and leave a mark.
            </p>

            {/* Pillars */}
            <div className="flex gap-8 mt-12 pt-10 border-t border-white/7">
              {pillars.map((p, i) => (
                <div key={i} className="flex flex-col gap-1 group">
                  <span
                    className="font-display leading-none text-red group-hover:text-brand-white transition-colors duration-300"
                    style={{ fontSize: "clamp(26px, 3.2vw, 44px)" }}
                  >
                    {p.value}
                  </span>
                  <span className="text-brand-white/30 text-[9px] tracking-[0.28em] uppercase">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div data-reveal data-delay="150" className="space-y-7">
            <p className="text-brand-white/75 text-lg leading-relaxed">
              At diEntertainment, we believe every brand has a story worth
              telling — and every story deserves to be told powerfully.
            </p>
            <p className="text-brand-white/42 leading-relaxed">
              We&apos;re a full-service news, media, and digital marketing agency
              built for brands that want to dominate their space. From
              high-impact video production to cutting-edge digital strategy, we
              deliver work that doesn&apos;t just get noticed — it gets
              remembered.
            </p>
            <p className="text-brand-white/42 leading-relaxed">
              Our team of creatives, strategists, and storytellers work together
              to ensure your brand&apos;s message reaches the right audience, in
              the right format, at exactly the right moment.
            </p>

            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-red text-[11px] tracking-[0.28em] uppercase hover:gap-4 transition-all duration-300 group"
                style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
              >
                Start a Conversation
                <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>

            {/* Visual accent block */}
            <div className="mt-8 border border-white/7 rounded-xs p-6 relative hover:border-white/12 transition-colors duration-300">
              <div className="absolute -top-px left-6 w-12 h-px bg-red" />
              <blockquote className="text-brand-white/55 text-sm leading-relaxed italic">
                &ldquo;We don&apos;t make content for the algorithm. We make
                content that builds brands people actually care about.&rdquo;
              </blockquote>
              <p className="text-red text-[10px] tracking-[0.28em] uppercase mt-3">
                — diEntertainment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
