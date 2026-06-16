"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CardMedia, isVideo } from "./CardMedia";

export type WorkProject = {
  id: number;
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  outcome: string;
  bg: string;
  accentColor: string;
  textLight: boolean;
  previewUrl: string | null;
};

export default function WorkPreview({
  works,
  totalCount,
}: {
  works: WorkProject[];
  totalCount: number;
}) {
  const [selected, setSelected] = useState<WorkProject | null>(null);

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

  const [w0, w1, w2, w3] = works;
  const previewCount = works.length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Top-left: feature tall card */}
        {w0 && (
          <button
            className="work-card relative overflow-hidden cursor-pointer group min-h-140 rounded-xs text-left w-full"
            style={{ backgroundColor: w0.bg }}
            onClick={() => setSelected(w0)}
            aria-label={`View ${w0.title}`}
          >
            {w0.previewUrl && (
              <>
                <CardMedia url={w0.previewUrl} />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/5 z-1" />
              </>
            )}
            <div
              className="absolute top-0 left-0 w-1 h-full z-10"
              style={{ backgroundColor: w0.accentColor }}
            />
            {!w0.previewUrl && (
              <span
                className="font-display absolute top-6 left-8 leading-none pointer-events-none select-none text-white/6"
                style={{ fontSize: "clamp(80px, 10vw, 140px)" }}
              >
                {w0.slug}
              </span>
            )}
            {/* Center play/eye icon */}
            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full border border-white/35 bg-black/35 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                {w0.previewUrl && isVideo(w0.previewUrl) ? (
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
            <div className="absolute inset-0 bg-red/0 group-hover:bg-red/8 transition-all duration-500 z-10" />
            <div className="absolute bottom-0 left-0 right-0 p-7 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 z-20" style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}>
              <span className="text-white/45 text-[9px] tracking-[0.3em] uppercase block mb-1.5">
                {w0.category} · {w0.year}
              </span>
              <h3 className="font-display text-white leading-tight uppercase" style={{ fontSize: "clamp(20px, 2.5vw, 32px)" }}>
                {w0.title}
              </h3>
            </div>
          </button>
        )}

        {/* Top-right: two stacked cards */}
        <div className="flex flex-col gap-3">
          {[w1, w2].filter(Boolean).map((work) => (
            <button
              key={work.id}
              className="work-card relative overflow-hidden cursor-pointer group flex-1 min-h-68 rounded-xs text-left w-full"
              style={{ backgroundColor: work.bg }}
              onClick={() => setSelected(work)}
              aria-label={`View ${work.title}`}
            >
              {work.previewUrl && (
                <>
                  <CardMedia url={work.previewUrl} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-1" />
                </>
              )}
              {!work.previewUrl && (
                <span
                  className="font-display absolute top-4 left-6 leading-none pointer-events-none select-none"
                  style={{
                    fontSize: "clamp(60px, 7vw, 100px)",
                    color: work.textLight ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                  }}
                >
                  {work.slug}
                </span>
              )}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 z-10"
                style={{ backgroundColor: work.accentColor }}
              />
              {/* Center play/eye icon */}
              <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full border border-white/35 bg-black/35 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {work.previewUrl && isVideo(work.previewUrl) ? (
                    <svg width="14" height="16" viewBox="0 0 16 18" fill="none" aria-hidden="true">
                      <path d="M1 1.5L15 9L1 16.5V1.5Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="12" viewBox="0 0 20 14" fill="none" aria-hidden="true">
                      <ellipse cx="10" cy="7" rx="3" ry="3" fill="white" />
                      <path d="M1 7C3.5 2.5 6.5 1 10 1s6.5 1.5 9 6c-2.5 4.5-5.5 6-9 6s-6.5-1.5-9-6z" stroke="white" strokeWidth="1.5" fill="none" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-red/0 group-hover:bg-red/10 transition-all duration-500 z-10" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 z-20" style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}>
                <span
                  className="text-[9px] tracking-[0.3em] uppercase block mb-1"
                  style={{
                    color:
                      work.textLight || work.previewUrl
                        ? "rgba(255,255,255,0.45)"
                        : "rgba(0,0,0,0.35)",
                  }}
                >
                  {work.category} · {work.year}
                </span>
                <h3
                  className="font-display uppercase leading-tight"
                  style={{
                    fontSize: "clamp(18px, 2vw, 26px)",
                    color:
                      work.textLight || work.previewUrl ? "#F5F5F5" : "#0A0A0A",
                  }}
                >
                  {work.title}
                </h3>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom: wide card spanning both columns */}
        {w3 && (
          <button
            className="work-card relative overflow-hidden cursor-pointer group md:col-span-2 min-h-88 rounded-xs text-left w-full"
            style={{ backgroundColor: w3.bg }}
            onClick={() => setSelected(w3)}
            aria-label={`View ${w3.title}`}
          >
            {w3.previewUrl && (
              <>
                <CardMedia url={w3.previewUrl} />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent z-1" />
              </>
            )}
            {!w3.previewUrl && (
              <span
                className="font-display absolute top-6 left-8 leading-none pointer-events-none select-none text-white/5"
                style={{ fontSize: "clamp(100px, 14vw, 200px)" }}
              >
                {w3.slug}
              </span>
            )}
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 z-10"
              style={{ backgroundColor: w3.accentColor }}
            />
            {/* Center play/eye icon */}
            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-14 h-14 rounded-full border border-white/35 bg-black/35 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                {w3.previewUrl && isVideo(w3.previewUrl) ? (
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
            <div className="absolute inset-0 bg-red/0 group-hover:bg-red/8 transition-all duration-500 z-10" />
            <div className="absolute bottom-0 left-0 right-0 p-7 flex items-end justify-between translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 z-20" style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}>
              <div>
                <span className="text-white/38 text-[9px] tracking-[0.3em] uppercase block mb-1.5">
                  {w3.category} · {w3.year}
                </span>
                <h3 className="font-display text-brand-white uppercase leading-tight" style={{ fontSize: "clamp(20px, 2.5vw, 32px)" }}>
                  {w3.title}
                </h3>
              </div>
              <span className="text-red text-2xl group-hover:translate-x-1.5 transition-transform duration-300">
                →
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-10 border-t border-white/5">
        <p className="text-brand-white/28 text-[10px] tracking-[0.25em] uppercase">
          Showing {previewCount} of {totalCount}+ projects
        </p>
        <Link href="/work" className="btn-secondary">
          View All Work <span className="text-sm">→</span>
        </Link>
      </div>

      {/* ─── Lightbox Modal ─── */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <div className="absolute inset-0 bg-black/88 backdrop-blur-sm" aria-hidden="true" />

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
                  <span className="text-red text-[9px] tracking-[0.3em] uppercase border border-red/25 px-2.5 py-1 rounded-xs">
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

                {/* Outcome caption */}
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
