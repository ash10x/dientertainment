type Stat = {
  statValue: string;
  statLabel: string;
};

export default function Stats({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;

  return (
    <section className="bg-brand-white py-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className={`grid gap-px bg-brand-black/8 ${
          stats.length === 4
            ? "grid-cols-2 lg:grid-cols-4"
            : stats.length === 3
            ? "grid-cols-1 sm:grid-cols-3"
            : "grid-cols-2"
        }`}>
          {stats.map((stat) => (
            <div
              key={stat.statLabel}
              className="stat-item bg-brand-white px-6 py-16 lg:py-22 flex flex-col items-center text-center cursor-default group"
            >
              <span
                className="font-display leading-none text-brand-black group-hover:text-red transition-colors duration-400"
                style={{
                  fontSize: "clamp(52px, 7vw, 96px)",
                  transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {stat.statValue}
              </span>
              <span className="text-brand-black/35 text-[10px] tracking-[0.28em] uppercase mt-3 group-hover:text-brand-black/55 transition-colors duration-300">
                {stat.statLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
