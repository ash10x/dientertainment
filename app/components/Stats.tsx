type Stat = {
  statValue: string;
  statLabel: string;
};

export default function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="bg-brand-white py-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-brand-black/8">
          {stats.map((stat) => (
            <div
              key={stat.statLabel}
              className="stat-item bg-brand-white px-6 py-14 lg:py-20 flex flex-col items-center text-center cursor-default"
            >
              <span
                className="font-display leading-none text-brand-black transition-colors duration-300"
                style={{ fontSize: "clamp(52px, 7vw, 96px)" }}
              >
                {stat.statValue}
              </span>
              <span className="text-brand-black/40 text-[10px] tracking-[0.25em] uppercase mt-3">
                {stat.statLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
