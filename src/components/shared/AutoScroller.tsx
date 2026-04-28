"use client";
import { useRef, useEffect, ReactNode } from "react";

interface AutoScrollerProps {
  children: ReactNode;
  speed?: number; // pixels per second
  className?: string;
}

export function AutoScroller({ children, speed = 40, className = "" }: AutoScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);
  const paused = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let last = 0;
    const pxPerMs = speed / 1000;

    function step(ts: number) {
      if (!paused.current && el) {
        const delta = ts - last;
        el.scrollLeft += pxPerMs * delta;
        // Reset to start for infinite feel
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0;
        }
      }
      last = ts;
      raf.current = requestAnimationFrame(step);
    }

    raf.current = requestAnimationFrame(step);

    const pause  = () => { paused.current = true; };
    const resume = () => { paused.current = false; };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause,  { passive: true });
    el.addEventListener("touchend",   resume, { passive: true });

    return () => {
      cancelAnimationFrame(raf.current);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend",   resume);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className} style={{ overflowX: "auto", cursor: "grab" }}>
      {children}
    </div>
  );
}
