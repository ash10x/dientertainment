const services = [
  {
    number: "01",
    title: "Digital Marketing",
    href: "/services/digital-marketing",
    description:
      "Strategic campaigns that dominate attention. From paid media to organic growth, we engineer the digital presence your brand deserves — then scale it.",
    tags: ["Social Media", "SEO", "Paid Ads", "Analytics"],
  },
  {
    number: "02",
    title: "News & Media",
    href: "/services/news-media",
    description:
      "Editorial content that shapes narratives. We create, distribute, and amplify stories that position your brand as the undisputed voice of your industry.",
    tags: ["Press Releases", "Editorial", "PR", "Syndication"],
  },
  {
    number: "03",
    title: "Photo Production",
    href: "/services/photo-production",
    description:
      "Visual identity that commands respect. High-end photography that captures the essence of your brand and stops the scroll — every single time.",
    tags: ["Brand Photography", "Product Shoots", "Lifestyle", "Editorial"],
  },
  {
    number: "04",
    title: "Video Production",
    href: "/services/video-production",
    description:
      "Cinematic storytelling at its finest. From concept to final cut, we produce video content that doesn't just entertain — it converts and stays with you.",
    tags: ["Brand Films", "Commercials", "Social Content", "Reels"],
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-[#0A0A0A] py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-[#E50019]" />
              <span className="text-[#E50019] text-[10px] tracking-[0.35em] uppercase">
                What We Do
              </span>
            </div>
            <h2
              className="font-display uppercase leading-[0.88] text-[#F5F5F5]"
              style={{ fontSize: "clamp(48px, 6.5vw, 100px)" }}
            >
              Services that
              <br />
              <span className="text-[#E50019]">move brands.</span>
            </h2>
          </div>
          <p className="text-[#F5F5F5]/40 text-sm leading-relaxed max-w-xs md:text-right">
            Every service is engineered for maximum impact and measurable results.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">
          {services.map((s) => (
            <a
              key={s.number}
              href={s.href}
              className="service-card bg-[#0A0A0A] p-8 lg:p-12 group block"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-6">
                <span className="text-[#E50019]/40 text-[10px] tracking-[0.3em] uppercase">
                  {s.number}
                </span>
                <span className="text-[#F5F5F5]/20 group-hover:text-[#E50019] transition-colors duration-300 text-lg">
                  →
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-display uppercase leading-none text-[#F5F5F5] mb-5"
                style={{ fontSize: "clamp(30px, 3vw, 48px)" }}
              >
                {s.title}
              </h3>

              {/* Description */}
              <p className="text-[#F5F5F5]/45 text-sm leading-relaxed mb-8">
                {s.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] tracking-[0.2em] uppercase text-[#F5F5F5]/30 border border-white/[0.08] px-3 py-1.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
