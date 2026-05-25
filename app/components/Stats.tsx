const stats = [
  { number: "150+", label: "Brands Elevated" },
  { number: "500+", label: "Campaigns Executed" },
  { number: "8+", label: "Years Active" },
  { number: "10M+", label: "Audience Reached" },
];

export default function Stats() {
  return (
    <section className="bg-[#F5F5F5] py-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#0A0A0A]/[0.08]">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-item bg-[#F5F5F5] px-6 py-14 lg:py-20 flex flex-col items-center text-center cursor-default"
            >
              <span
                className="font-display leading-none text-[#0A0A0A] group-hover:text-[#E50019] transition-colors duration-300"
                style={{ fontSize: "clamp(52px, 7vw, 96px)" }}
              >
                {stat.number}
              </span>
              <span className="text-[#0A0A0A]/40 text-[10px] tracking-[0.25em] uppercase mt-3">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
