type Stat = {
  statValue: string;
  statLabel: string;
};

export default function Stats({ stats }: { stats: Stat[] }) {
  if (!stats.length) return null;

  return (
    <section className="bg-brand-white">
      {/* Eyebrow label above the number band */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-2 flex items-center gap-3">
        <div className="w-5 h-px bg-brand-black/20" />
        <span className="text-brand-black/30 text-[9px] tracking-[0.36em] uppercase">By the numbers</span>
      </div>
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
              className="stat-item bg-brand-white px-4 py-10 sm:px-6 sm:py-14 lg:py-20 flex flex-col items-center text-center cursor-default group"
            >
              <span
                className="font-display leading-none text-brand-black group-hover:text-red transition-colors duration-300"
                style={{
                  fontSize: "clamp(52px, 7vw, 96px)",
                  transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {stat.statValue}
              </span>
              <span className="text-brand-black/35 text-[10px] tracking-[0.28em] uppercase mt-3 group-hover:text-brand-black/60 transition-colors duration-300">
                {stat.statLabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
