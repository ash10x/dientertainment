"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CardMedia, isVideo } from "./CardMedia";

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
  const [selected, setSelected] = useState<Project | null>(null);

  const normalize = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, "");

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => normalize(p.category) === normalize(active));

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close]);

  return (
    <>
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
                const isVid = hasPreview && isVideo(project.previewUrl!);

                return (
                  <button
                    key={project.slug}
                    onClick={() => setSelected(project)}
                    className="work-card relative overflow-hidden cursor-pointer group aspect-square rounded-xs text-left w-full"
                    style={{ backgroundColor: project.bg }}
                    aria-label={`View ${project.title}`}
                  >
                    {/* Background media */}
                    {hasPreview && (
                      <>
                        <CardMedia url={project.previewUrl!} />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-black/5 z-[1]" />
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

                    {/* Center play / view icon — appears on hover */}
                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full border border-white/35 bg-black/35 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        {isVid ? (
                          <svg width="16" height="18" viewBox="0 0 16 18" fill="none" aria-hidden="true">
                            <path d="M1 1.5L15 9L1 16.5V1.5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
                            <ellipse cx="10" cy="7" rx="3" ry="3" fill="white" />
                            <path d="M1 7C3.5 2.5 6.5 1 10 1s6.5 1.5 9 6c-2.5 4.5-5.5 6-9 6s-6.5-1.5-9-6z" stroke="white" strokeWidth="1.5" fill="none" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Red hover tint */}
                    <div className="absolute inset-0 bg-red/0 group-hover:bg-red/10 transition-all duration-500 z-10" />

                    {/* Bottom content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 z-20">
                      <p
                        className="text-[9px] tracking-[0.18em] uppercase mb-2.5 italic line-clamp-1"
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
                  </button>
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

      {/* ─── Lightbox Modal ─── */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/88 backdrop-blur-sm" aria-hidden="true" />

          {/* Panel */}
          <div
            className="relative z-10 w-full max-w-4xl bg-[#111111] border border-white/8 rounded-xs overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
            style={{ borderTop: "1.5px solid #E50019" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center text-brand-white/40 hover:text-brand-white border border-white/10 hover:border-white/28 rounded-xs transition-all duration-200 bg-black/40 backdrop-blur-sm cursor-pointer"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* Left — media viewer */}
              <div className="relative flex-shrink-0 lg:w-[55%] aspect-video bg-black">
                {selected.previewUrl ? (
                  isVideo(selected.previewUrl) ? (
                    <video
                      src={selected.previewUrl}
                      className="absolute inset-0 w-full h-full object-contain"
                      controls
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${selected.previewUrl})` }}
                    />
                  )
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: selected.bg }}
                  >
                    <span
                      className="font-display text-white/8 leading-none select-none"
                      style={{ fontSize: "clamp(80px, 14vw, 160px)" }}
                      aria-hidden="true"
                    >
                      {selected.slug}
                    </span>
                  </div>
                )}
              </div>

              {/* Right — metadata */}
              <div className="flex-1 flex flex-col p-7 lg:p-9 border-t lg:border-t-0 lg:border-l border-white/7">
                {/* Category + year */}
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="text-red text-[9px] tracking-[0.3em] uppercase border border-red/25 px-2.5 py-1 rounded-xs"
                  >
                    {selected.category}
                  </span>
                  <span className="text-brand-white/25 text-[9px] tracking-[0.2em] uppercase">
                    {selected.year}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="font-display uppercase leading-[0.9] text-brand-white mb-4"
                  style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
                >
                  {selected.title}
                </h2>

                {/* Client */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-4 h-px bg-red/45" />
                  <span className="text-brand-white/38 text-[10px] tracking-[0.25em] uppercase">
                    {selected.client}
                  </span>
                </div>

                {/* Description / outcome caption */}
                {selected.outcome && (
                  <div className="mb-8 border-l-2 border-red/35 pl-4">
                    <p className="text-brand-white/52 text-sm leading-relaxed">
                      {selected.outcome}
                    </p>
                  </div>
                )}

                <div className="flex-1" />

                {/* CTA row */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/7">
                  <Link
                    href={`/contact?service=${encodeURIComponent(selected.category)}`}
                    className="inline-flex items-center justify-center gap-2 bg-red text-brand-white text-[11px] tracking-[0.22em] uppercase px-6 py-3 rounded-xs hover:bg-[#FF001F] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(229,0,25,0.35)] transition-all duration-250"
                    style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
                    onClick={close}
                  >
                    Start a Project <span className="text-sm">→</span>
                  </Link>
                  <button
                    onClick={close}
                    className="inline-flex items-center justify-center gap-2 border border-white/12 text-brand-white/40 text-[11px] tracking-[0.22em] uppercase px-6 py-3 rounded-xs hover:border-white/25 hover:text-brand-white/68 transition-all duration-250 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
