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
    <div className="relative bg-red py-[14px] overflow-hidden select-none">
      {/* Subtle inner shadow top/bottom */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/20" />

      <div className="marquee-track">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="font-display text-brand-white text-xl lg:text-2xl tracking-[0.16em] uppercase px-6 whitespace-nowrap">
              {item}
            </span>
            <span className="text-white/30 text-[7px]">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
