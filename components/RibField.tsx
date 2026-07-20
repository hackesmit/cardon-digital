"use client";

/* Signature element. A field of thin vertical bars: cardon ribs and a
   bar chart at once. Bars lift toward the cursor. Deterministic heights
   so server and client render identically. */

import { useEffect, useRef } from "react";

const BARS = 64;

function heightFor(i: number) {
  // Deterministic pseudo-random profile with a desert-skyline feel.
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const r = a - Math.floor(a);
  const ridge = 0.35 + 0.3 * Math.sin((i / BARS) * Math.PI * 2.2 + 0.8);
  return 0.22 + ridge * 0.55 + r * 0.28;
}

export default function RibField({ dark = false }: { dark?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bars = Array.from(el.children) as HTMLElement[];

    const onMove = (ev: PointerEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        bars.forEach((bar, i) => {
          const bx = ((i + 0.5) / BARS) * rect.width;
          const d = Math.abs(x - bx) / rect.width;
          const lift = Math.max(0, 1 - d * 6);
          const base = heightFor(i);
          bar.style.transform = `scaleY(${base + lift * 0.35})`;
        });
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf.current);
      bars.forEach((bar, i) => {
        bar.style.transform = `scaleY(${heightFor(i)})`;
      });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-auto flex h-full w-full items-end gap-[3px] sm:gap-1"
    >
      {Array.from({ length: BARS }, (_, i) => (
        <div
          key={i}
          className={`rib rib-enter h-full flex-1 ${
            dark ? "bg-sand/20" : "bg-cardon/25"
          }`}
          style={
            {
              "--h": heightFor(i),
              transform: `scaleY(${heightFor(i)})`,
              animationDelay: `${i * 12}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
