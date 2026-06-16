"use client";

import { useState } from "react";
import { CardMedia } from "./CardMedia";

export type Project = {
  id?: number;
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  outcome: string;
  bg: string;
  accentColor: string;
  textLight: boolean;
  previewUrl?: string | null;
};

const categories = [
  { label: "All", value: "all" },
  { label: "AI Branding", value: "AI Branding" },
  { label: "AI Videos", value: "AI Videos" },
  { label: "AI Commercials", value: "AI Commercials" },
  { label: "Digital Marketing", value: "Digital Marketing" },
  { label: "News & Media", value: "News & Media" },
  { label: "Photo Production", value: "Photo Production" },
  { label: "Video Production", value: "Video Production" },
  { label: "AI Video Creation", value: "AI Video Creation" },
  { label: "AI Image Generation", value: "AI Image Generation" },
  { label: "Script Writing", value: "Script Writing" },
];

export default function WorkGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("all");

  const normalize = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, "");

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => normalize(p.category) === normalize(active));

  return (
    <section className="bg-brand-black py-14 pb-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border rounded-xs transition-all duration-200 cursor-pointer ${
                active === cat.value
                  ? "bg-red border-red text-brand-white"
                  : "border-white/12 text-brand-white/38 hover:border-white/28 hover:text-brand-white/70"
              }`}
            >
              {cat.label}
            </button>
          ))}
          <span className="ml-auto self-center text-brand-white/20 text-[10px] tracking-[0.2em] uppercase hidden sm:block">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project, idx) => {
              const hasPreview = !!project.previewUrl;
              const lightText = project.textLight || hasPreview;

              return (
                <div
                  key={project.slug}
                  className="work-card relative overflow-hidden cursor-pointer group aspect-square rounded-xs"
                  style={{ backgroundColor: project.bg }}
                >
                  {/* Background media */}
                  {hasPreview && (
                    <>
                      <CardMedia url={project.previewUrl!} />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-black/5 z-1" />
                    </>
                  )}

                  {/* Bottom accent line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 z-10"
                    style={{ backgroundColor: project.accentColor }}
                  />

                  {/* Watermark number — hidden when preview shown */}
                  {!hasPreview && (
                    <span
                      className="font-display absolute top-4 right-5 leading-none pointer-events-none select-none"
                      style={{
                        fontSize: "clamp(64px, 9vw, 112px)",
                        color: project.textLight
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(0,0,0,0.05)",
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  )}

                  {/* Category pill */}
                  <div className="absolute top-5 left-5 z-10">
                    <span
                      className="text-[9px] tracking-[0.2em] uppercase border px-2.5 py-1 block"
                      style={{
                        color: lightText
                          ? "rgba(255,255,255,0.45)"
                          : "rgba(0,0,0,0.4)",
                        borderColor: lightText
                          ? "rgba(255,255,255,0.14)"
                          : "rgba(0,0,0,0.14)",
                      }}
                    >
                      {project.category}
                    </span>
                  </div>

                  {/* Red hover overlay */}
                  <div className="absolute inset-0 bg-red/0 group-hover:bg-red/12 transition-all duration-500 z-10" />

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 z-20">
                    <p
                      className="text-[9px] tracking-[0.18em] uppercase mb-2.5 italic"
                      style={{
                        color: lightText
                          ? "rgba(255,255,255,0.32)"
                          : "rgba(0,0,0,0.3)",
                      }}
                    >
                      {project.outcome}
                    </p>
                    <h3
                      className="font-display uppercase leading-none mb-1.5"
                      style={{
                        fontSize: "clamp(18px, 2.2vw, 26px)",
                        color: lightText ? "#F5F5F5" : "#0A0A0A",
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="text-[9px] tracking-[0.2em] uppercase"
                      style={{
                        color: lightText
                          ? "rgba(255,255,255,0.28)"
                          : "rgba(0,0,0,0.28)",
                      }}
                    >
                      {project.client} · {project.year}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-24">
            <p className="text-brand-white/25 text-[11px] tracking-[0.3em] uppercase">
              No projects in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
