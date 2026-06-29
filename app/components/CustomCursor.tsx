"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const pathname = usePathname();
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const body = document.body;
    body.classList.add("cursor-enabled");

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) {
      return () => { body.classList.remove("cursor-enabled"); };
    }

    let mx = -9999, my = -9999;
    let rx = -9999, ry = -9999;
    let raf: number;

    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const tick = () => {
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      dot.style.transform  = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      raf = requestAnimationFrame(tick);
    };

    const expand   = () => ring.classList.add("cursor-ring--hover");
    const contract = () => ring.classList.remove("cursor-ring--hover");

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) expand();
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button")) contract();
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    raf = requestAnimationFrame(tick);

    return () => {
      body.classList.remove("cursor-enabled");
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
