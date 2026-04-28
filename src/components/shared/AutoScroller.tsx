"use client";

import React, { useEffect, useRef } from "react";

export function AutoScroller({ children, className, speed = 30 }: { children: React.ReactNode; className?: string; speed?: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  useEffect(() => {
    const el = scrollRef.current;
    let currentSpeed = speed;
    if (!el) return;

    let animationId: number;
    let isHovered = false;
    let lastTime = performance.now();

    const scroll = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (!isHovered && el && dt > 0) {
        // Move scroll position based on time passed for smooth cross-device speed
        const targetSpeed = isHoveredRef.current ? 0 : speed;
        currentSpeed += (targetSpeed - currentSpeed) * 0.05;

        el.scrollLeft += (currentSpeed * dt) / 1000;
        // Reset to beginning when reaching the end
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    const handleMouseEnter = () => (isHoveredRef.current = true);

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      lastTime = performance.now();
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("touchstart", handleMouseEnter, { passive: true });
    el.addEventListener("touchend", handleMouseLeave, { passive: true });

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("touchstart", handleMouseEnter);
      el.removeEventListener("touchend", handleMouseLeave);
    };
  }, [speed]);

  return (
    <div ref={scrollRef} className={className}>
      {children}
      {children}
    </div>
  );
}
