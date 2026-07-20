"use client";

/* Scroll-velocity type: the line skews and shifts with how fast the page
   is moving, then settles. Static text without JS or with reduced motion. */

import { useEffect, useRef } from "react";

export default function VelocityType({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = 0;
    let current = 0;
    let lastY = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      const y = window.scrollY;
      target = Math.max(-42, Math.min(42, y - lastY));
      lastY = y;
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      current += (target - current) * 0.1;
      target *= 0.86;
      if (Math.abs(current) > 0.01) {
        el.style.transform = `skewX(${current * -0.5}deg) translateX(${
          current * -1.6
        }px)`;
      } else {
        el.style.transform = "";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{text}</span>
    </div>
  );
}
