"use client";
import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const update = () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      const pct      = total > 0 ? (scrolled / total) * 100 : 0;
      bar.style.width = pct + "%";
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-px pointer-events-none"
      style={{ zIndex: 100, background: "transparent" }}
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full"
        style={{
          background: "linear-gradient(90deg, #E50019, #FF4D63)",
          boxShadow: "0 0 8px rgba(229,0,25,0.55)",
          width: "0%",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}
