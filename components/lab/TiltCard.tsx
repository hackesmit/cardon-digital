"use client";

/* Perspective tilt with a moving glare. Static card without JS. */

import { useRef } from "react";

export default function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.classList.add("tilting");
    el.style.transform = `perspective(760px) rotateX(${(0.5 - py) * 10}deg) rotateY(${
      (px - 0.5) * 12
    }deg)`;
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("tilting");
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={`lab-tilt relative ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
      <div className="lab-tilt-glare" aria-hidden="true" />
    </div>
  );
}
