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
  {
    number: "05",
    title: "AI Video Creation",
    href: "/services/ai-video-creation",
    description:
      "Studio-quality video at a fraction of the cost and timeline. AI-generated commercials, product ads, cinematic reels, and digital influencers built to convert.",
    tags: ["AI Commercials", "Product Ads", "Cinematic Reels", "AI Influencers"],
  },
  {
    number: "06",
    title: "AI Image Generation",
    href: "/services/ai-image-generation",
    description:
      "Photorealistic, campaign-ready visuals produced by AI — luxury product photos, billboards, lifestyle ads, and Instagram graphics with zero studio required.",
    tags: ["Product Photos", "Billboards", "Lifestyle Ads", "Social Graphics"],
  },
  {
    number: "07",
    title: "Script Writing",
    href: "/services/script-writing",
    description:
      "Words that stop the scroll and move people to act. Viral hooks, ad scripts, captions, and brand storytelling engineered for the way modern audiences consume content.",
    tags: ["Viral Hooks", "Ad Scripts", "Captions", "Storytelling"],
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-brand-black py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-20 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                What We Do
              </span>
            </div>
            <h2
              className="font-display uppercase leading-[0.87] text-brand-white"
              style={{ fontSize: "clamp(48px, 6.5vw, 100px)" }}
            >
              Services that
              <br />
              <span className="text-red">move brands.</span>
            </h2>
          </div>
          <p className="text-brand-white/35 text-sm leading-relaxed max-w-xs md:text-right">
            Every service is engineered for maximum impact and measurable results.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
          {services.map((s, idx) => (
            <a
              key={s.number}
              href={s.href}
              className={`service-card bg-brand-black p-8 lg:p-12 group block relative overflow-hidden ${
                idx === services.length - 1 && services.length % 2 !== 0
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              {/* Subtle top accent — appears on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Top row */}
              <div className="flex items-start justify-between mb-8">
                <span className="text-red/35 text-[10px] tracking-[0.32em] uppercase font-display">
                  {s.number}
                </span>
                <span className="text-brand-white/15 group-hover:text-red group-hover:translate-x-1 transition-all duration-300 text-lg leading-none">
                  →
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-display uppercase leading-none text-brand-white group-hover:text-brand-white mb-5 transition-colors duration-200"
                style={{ fontSize: "clamp(28px, 2.8vw, 44px)" }}
              >
                {s.title}
              </h3>

              {/* Description */}
              <p className="text-brand-white/40 text-sm leading-relaxed mb-8 group-hover:text-brand-white/55 transition-colors duration-300">
                {s.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] tracking-[0.2em] uppercase text-brand-white/25 border border-white/7 px-3 py-1.5 rounded-xs group-hover:border-white/12 group-hover:text-brand-white/40 transition-all duration-300"
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
