"use client";

import { useEffect, useRef, useState } from "react";

type ParsedStat = { raw: string; num: number; suffix: string; label: string };

function parseStat(raw: string): ParsedStat {
  const pipeIdx = raw.indexOf("|");
  const value = pipeIdx >= 0 ? raw.slice(0, pipeIdx).trim() : raw.trim();
  const label = pipeIdx >= 0 ? raw.slice(pipeIdx + 1).trim() : "";
  const m = value.match(/^(\d+)(.*)$/);
  return m
    ? { raw, num: parseInt(m[1], 10), suffix: m[2], label }
    : { raw, num: 0, suffix: value, label };
}

export default function StatsCounter({ stats }: { stats: string[] }) {
  const parsed = stats.map(parseStat);
  const [counts, setCounts] = useState<number[]>(parsed.map(() => 0));
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const targets = stats.map((s) => parseStat(s).num);
    const dur = 1800;
    const start = performance.now();
    let rafId: number;
    const frame = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCounts(targets.map((t) => Math.round(t * ease)));
      if (p < 1) rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [active, stats]);

  return (
    <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-white/5">
      {parsed.map((stat, i) => (
        <div key={stat.raw} className="bg-brand-black p-8 lg:p-10 text-center group hover:-translate-y-px transition-transform duration-300">
          <div className="font-display leading-none mb-3" style={{ fontSize: "clamp(36px, 4.5vw, 64px)" }}>
            <span className="text-red">{counts[i]}</span>
            <span className="text-brand-white">{stat.suffix}</span>
          </div>
          <p className="text-brand-white/40 text-[9px] tracking-[0.28em] uppercase leading-relaxed">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
