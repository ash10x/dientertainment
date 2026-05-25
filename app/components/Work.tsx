const works = [
  {
    id: "01",
    title: "Empire Brand Relaunch",
    category: "Digital Marketing",
    year: "2024",
    bg: "#111111",
    accentColor: "#E50019",
    textLight: true,
    wide: false,
  },
  {
    id: "02",
    title: "Executive Portrait Series",
    category: "Photo Production",
    year: "2024",
    bg: "#E50019",
    accentColor: "#0A0A0A",
    textLight: true,
    wide: false,
  },
  {
    id: "03",
    title: "Product Launch Film",
    category: "Video Production",
    year: "2023",
    bg: "#F5F5F5",
    accentColor: "#E50019",
    textLight: false,
    wide: false,
  },
  {
    id: "04",
    title: "Industry News Editorial",
    category: "News & Media",
    year: "2024",
    bg: "#0F0F0F",
    accentColor: "#E50019",
    textLight: true,
    wide: false,
  },
];

export default function Work() {
  return (
    <section id="work" className="bg-[#0A0A0A] py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-14 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-[#E50019]" />
              <span className="text-[#E50019] text-[10px] tracking-[0.35em] uppercase">
                Selected Work
              </span>
            </div>
            <h2
              className="font-display uppercase leading-[0.88]"
              style={{ fontSize: "clamp(48px, 6.5vw, 100px)" }}
            >
              <span className="text-[#F5F5F5]">Work that</span>
              <br />
              <span className="text-outline">speaks louder.</span>
            </h2>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-[#F5F5F5]/40 hover:text-[#F5F5F5] transition-colors duration-200 shrink-0 pb-2"
          >
            All Projects <span>→</span>
          </a>
        </div>

        {/* Grid: feature + two stacked + wide bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top-left: feature tall card */}
          <div
            className="work-card relative overflow-hidden cursor-pointer group min-h-[420px]"
            style={{ backgroundColor: works[0].bg }}
          >
            {/* Accent strip */}
            <div
              className="absolute top-0 left-0 w-1 h-full"
              style={{ backgroundColor: works[0].accentColor }}
            />
            {/* Large bg number */}
            <span
              className="font-display absolute top-6 left-8 leading-none pointer-events-none select-none text-white/[0.07]"
              style={{ fontSize: "clamp(80px, 10vw, 140px)" }}
            >
              {works[0].id}
            </span>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[#E50019]/0 group-hover:bg-[#E50019]/10 transition-all duration-500" />
            {/* Meta */}
            <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
              <span className="text-white/50 text-[9px] tracking-[0.3em] uppercase block mb-1.5">
                {works[0].category} · {works[0].year}
              </span>
              <h3 className="font-display text-white text-2xl lg:text-3xl tracking-wide uppercase">
                {works[0].title}
              </h3>
            </div>
          </div>

          {/* Top-right: two stacked cards */}
          <div className="flex flex-col gap-4">
            {[works[1], works[2]].map((work) => (
              <div
                key={work.id}
                className="work-card relative overflow-hidden cursor-pointer group flex-1 min-h-[200px]"
                style={{ backgroundColor: work.bg }}
              >
                <span
                  className="font-display absolute top-4 left-6 leading-none pointer-events-none select-none opacity-10"
                  style={{
                    fontSize: "clamp(60px, 7vw, 100px)",
                    color: work.textLight ? "#FFFFFF" : "#0A0A0A",
                  }}
                >
                  {work.id}
                </span>
                {/* Accent bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: work.accentColor }}
                />
                <div className="absolute inset-0 bg-[#E50019]/0 group-hover:bg-[#E50019]/12 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300">
                  <span
                    className="text-[9px] tracking-[0.3em] uppercase block mb-1"
                    style={{ color: work.textLight ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}
                  >
                    {work.category} · {work.year}
                  </span>
                  <h3
                    className="font-display text-xl tracking-wide uppercase"
                    style={{ color: work.textLight ? "#F5F5F5" : "#0A0A0A" }}
                  >
                    {work.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom: wide card spanning both columns */}
          <div
            className="work-card relative overflow-hidden cursor-pointer group md:col-span-2 min-h-[220px]"
            style={{ backgroundColor: works[3].bg }}
          >
            <span
              className="font-display absolute top-6 left-8 leading-none pointer-events-none select-none text-white/[0.06]"
              style={{ fontSize: "clamp(100px, 14vw, 200px)" }}
            >
              {works[3].id}
            </span>
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ backgroundColor: works[3].accentColor }}
            />
            <div className="absolute inset-0 bg-[#E50019]/0 group-hover:bg-[#E50019]/10 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-7 flex items-end justify-between translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300">
              <div>
                <span className="text-white/40 text-[9px] tracking-[0.3em] uppercase block mb-1.5">
                  {works[3].category} · {works[3].year}
                </span>
                <h3 className="font-display text-[#F5F5F5] text-2xl lg:text-3xl tracking-wide uppercase">
                  {works[3].title}
                </h3>
              </div>
              <span className="text-[#E50019] text-2xl group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
