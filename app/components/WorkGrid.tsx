"use client";

import { useState } from "react";

type Project = {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  outcome: string;
  bg: string;
  accentColor: string;
  textLight: boolean;
};

const projects: Project[] = [
  {
    id: "01",
    title: "Empire Brand Relaunch",
    client: "Apex Corp",
    category: "Digital Marketing",
    year: "2024",
    outcome: "+187% organic reach in 90 days",
    bg: "#111111",
    accentColor: "#E50019",
    textLight: true,
  },
  {
    id: "02",
    title: "Executive Portrait Series",
    client: "Meridian Group",
    category: "Photo Production",
    year: "2024",
    outcome: "120-image brand library delivered",
    bg: "#E50019",
    accentColor: "#0A0A0A",
    textLight: true,
  },
  {
    id: "03",
    title: "Product Launch Film",
    client: "Nova Brands",
    category: "Video Production",
    year: "2023",
    outcome: "2.4M views in the first week",
    bg: "#EBEBEB",
    accentColor: "#E50019",
    textLight: false,
  },
  {
    id: "04",
    title: "Industry News Editorial",
    client: "Sterling Media",
    category: "News & Media",
    year: "2024",
    outcome: "Featured in 40+ publications",
    bg: "#0F0F0F",
    accentColor: "#E50019",
    textLight: true,
  },
  {
    id: "05",
    title: "Social Dominance Campaign",
    client: "Vanta Group",
    category: "Digital Marketing",
    year: "2024",
    outcome: "#1 trending campaign — 3 weeks",
    bg: "#1A0808",
    accentColor: "#E50019",
    textLight: true,
  },
  {
    id: "06",
    title: "CEO Brand Identity Shoot",
    client: "Crest Digital",
    category: "Photo Production",
    year: "2023",
    outcome: "Full identity system deployed",
    bg: "#1C1C1C",
    accentColor: "#E50019",
    textLight: true,
  },
  {
    id: "07",
    title: "Corporate Vision Film",
    client: "Luminary Co.",
    category: "Video Production",
    year: "2024",
    outcome: "Screened at 3 industry events",
    bg: "#0A0A14",
    accentColor: "#E50019",
    textLight: true,
  },
  {
    id: "08",
    title: "Media Strategy Rollout",
    client: "Orbit Media",
    category: "News & Media",
    year: "2023",
    outcome: "300% growth in press coverage",
    bg: "#E50019",
    accentColor: "#F5F5F5",
    textLight: true,
  },
  {
    id: "09",
    title: "E-Commerce Relaunch",
    client: "Prism Studios",
    category: "Digital Marketing",
    year: "2024",
    outcome: "4.2× ROAS across all channels",
    bg: "#EBEBEB",
    accentColor: "#E50019",
    textLight: false,
  },
  {
    id: "10",
    title: "Lifestyle Photo Collection",
    client: "Nexus",
    category: "Photo Production",
    year: "2023",
    outcome: "Campaign ran across 6 markets",
    bg: "#141414",
    accentColor: "#E50019",
    textLight: true,
  },
];

const categories = [
  { label: "All", value: "all" },
  { label: "Digital Marketing", value: "Digital Marketing" },
  { label: "News & Media", value: "News & Media" },
  { label: "Photo Production", value: "Photo Production" },
  { label: "Video Production", value: "Video Production" },
];

export default function WorkGrid() {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <section className="bg-[#0A0A0A] py-14 pb-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-200 cursor-pointer ${
                active === cat.value
                  ? "bg-[#E50019] border-[#E50019] text-[#F5F5F5]"
                  : "border-white/[0.12] text-[#F5F5F5]/40 hover:border-white/30 hover:text-[#F5F5F5]/70"
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="ml-auto self-center text-[#F5F5F5]/20 text-[10px] tracking-[0.2em] uppercase hidden sm:block">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="work-card relative overflow-hidden cursor-pointer group aspect-square"
                style={{ backgroundColor: project.bg }}
              >
                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] z-10"
                  style={{ backgroundColor: project.accentColor }}
                />

                {/* Watermark number */}
                <span
                  className="font-display absolute top-4 right-5 leading-none pointer-events-none select-none"
                  style={{
                    fontSize: "clamp(64px, 9vw, 112px)",
                    color: project.textLight
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.05)",
                  }}
                >
                  {project.id}
                </span>

                {/* Category pill — top left */}
                <div className="absolute top-5 left-5 z-10">
                  <span
                    className="text-[9px] tracking-[0.2em] uppercase border px-2.5 py-1 block"
                    style={{
                      color: project.textLight
                        ? "rgba(255,255,255,0.45)"
                        : "rgba(0,0,0,0.4)",
                      borderColor: project.textLight
                        ? "rgba(255,255,255,0.14)"
                        : "rgba(0,0,0,0.14)",
                    }}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Red hover overlay */}
                <div className="absolute inset-0 bg-[#E50019]/0 group-hover:bg-[#E50019]/12 transition-all duration-500" />

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300">
                  {/* Outcome */}
                  <p
                    className="text-[9px] tracking-[0.18em] uppercase mb-2.5 italic"
                    style={{
                      color: project.textLight
                        ? "rgba(255,255,255,0.32)"
                        : "rgba(0,0,0,0.3)",
                    }}
                  >
                    {project.outcome}
                  </p>

                  {/* Title */}
                  <h3
                    className="font-display uppercase leading-none mb-1.5"
                    style={{
                      fontSize: "clamp(18px, 2.2vw, 26px)",
                      color: project.textLight ? "#F5F5F5" : "#0A0A0A",
                    }}
                  >
                    {project.title}
                  </h3>

                  {/* Client + year */}
                  <p
                    className="text-[9px] tracking-[0.2em] uppercase"
                    style={{
                      color: project.textLight
                        ? "rgba(255,255,255,0.28)"
                        : "rgba(0,0,0,0.28)",
                    }}
                  >
                    {project.client} · {project.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-24">
            <p className="text-[#F5F5F5]/25 text-[11px] tracking-[0.3em] uppercase">
              No projects in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
