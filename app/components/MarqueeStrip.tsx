const items = [
  "NEWS & MEDIA",
  "DIGITAL MARKETING",
  "PHOTO PRODUCTION",
  "VIDEO PRODUCTION",
  "BRAND STRATEGY",
  "CONTENT CREATION",
  "SOCIAL MEDIA",
  "CAMPAIGN MANAGEMENT",
  "EDITORIAL",
  "PR & SYNDICATION",
];

export default function MarqueeStrip() {
  const doubled = [...items, ...items];

  return (
    <div className="bg-[#E50019] py-4 overflow-hidden select-none">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="font-display text-[#F5F5F5] text-xl tracking-[0.18em] uppercase px-6 whitespace-nowrap">
              {item}
            </span>
            <span className="text-[#F5F5F5]/35 text-[8px]">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
