"use client";
import { useEffect, useRef } from "react";

export default function CinematicBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.background = `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(229,0,25,0.038) 0%, transparent 65%)`;
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      {/* Cursor proximity spotlight */}
      <div
        ref={spotlightRef}
        className="absolute inset-0"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Animated red orbs — screen blend so they glow on dark surfaces */}
      <div
        className="absolute inset-0"
        style={{ mixBlendMode: "screen" }}
      >
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        <div className="orb orb-5" />
        <div className="orb orb-6" />
        <div className="scan-beam" />
      </div>

      {/* Film grain — sits on top of everything for cinematic texture */}
      <div className="grain-overlay" />

      {/* Edge vignette — pulls focus to center */}
      <div className="vignette" />
    </div>
  );
}
