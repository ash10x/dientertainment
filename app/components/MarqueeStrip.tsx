const items = [
  "NEWS & MEDIA",
  "DIGITAL MARKETING",
  "PHOTO PRODUCTION",
  "VIDEO PRODUCTION",
  "AI VIDEO CREATION",
  "AI IMAGE GENERATION",
  "SCRIPT WRITING",
  "BRAND STRATEGY",
  "CONTENT CREATION",
  "SOCIAL MEDIA",
  "CAMPAIGN MANAGEMENT",
  "EDITORIAL",
  "PR & SYNDICATION",
  "AI BRANDING",
  "LUXURY VISUALS",
  "AI COMMERCIALS",
];

export default function MarqueeStrip() {
  const doubled = [...items, ...items];

  return (
    <div className="relative bg-red py-[13px] overflow-hidden select-none marquee-fade">
      {/* Subtle inner shadow top/bottom */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/20" />

      <div className="marquee-track">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="font-display text-brand-white text-[18px] lg:text-[22px] tracking-[0.18em] uppercase px-5 whitespace-nowrap">
              {item}
            </span>
            <span className="text-white/25 text-[6px] shrink-0">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
