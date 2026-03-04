"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      rafId.current = null;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      // Clamp 0–1 (guards against iOS rubber-band negative scroll)
      const ratio =
        docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

      if (barRef.current) {
        // scaleX is GPU-composited – no layout thrashing, smooth on iOS
        barRef.current.style.transform = `scaleX(${ratio})`;
      }
      if (wrapRef.current) {
        wrapRef.current.setAttribute(
          "aria-valuenow",
          String(Math.round(ratio * 100))
        );
      }
    };

    const onScroll = () => {
      // Throttle to one update per animation frame
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // Paint initial state

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute bottom-0 left-0 right-0 h-[3px] pointer-events-none overflow-hidden"
      role="progressbar"
      aria-valuenow={0}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Lesefortschritt"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-accent origin-left will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
