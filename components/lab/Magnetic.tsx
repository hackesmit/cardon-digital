"use client";

/* Magnetic hover zone: the child leans toward the cursor while it is
   inside the zone, springs back on leave. Plain link/button without JS. */

import { useRef } from "react";

export default function Magnetic({
  children,
  strength = 0.32,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const inner = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = inner.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transition = "transform 0.12s ease-out";
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };

  const onLeave = () => {
    const el = inner.current;
    if (!el) return;
    el.style.transition = "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform = "";
  };

  return (
    <div
      className={`inline-block p-6 ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div ref={inner} className="inline-block">
        {children}
      </div>
    </div>
  );
}
