import { getWorkProjects } from "@/lib/queries";
import WorkPreview, { type WorkProject } from "./WorkPreview";

export default async function Work() {
  let works: WorkProject[] = [];
  let totalCount = 0;

  try {
    const rows = await getWorkProjects();
    totalCount = rows.length;
    works = (rows.length >= 4 ? rows.slice(0, 4) : rows) as WorkProject[];
  } catch {}

  if (works.length === 0) return null;

  return (
    <section id="work" className="bg-brand-black py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-14 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-red" />
              <span className="text-red text-[10px] tracking-[0.38em] uppercase">
                Selected Work
              </span>
            </div>
            <h2
              className="font-display uppercase leading-[0.87]"
              style={{ fontSize: "clamp(48px, 6.5vw, 100px)" }}
            >
              <span className="text-brand-white">Work that</span>
              <br />
              <span className="text-outline">speaks louder.</span>
            </h2>
          </div>
          <a
            href="/work"
            className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-brand-white/35 hover:text-brand-white transition-colors duration-200 shrink-0 pb-2 group"
          >
            All Projects
            <span className="group-hover:translate-x-1 transition-transform duration-200 text-sm">→</span>
          </a>
        </div>

        <WorkPreview works={works} totalCount={totalCount} />
      </div>
    </section>
  );
}
