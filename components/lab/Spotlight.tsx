"use client";

/* Cursor spotlight: pointer position lands in two CSS custom properties,
   all the painting happens in CSS gradients. */

export default function Spotlight({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className={`lab-spot ${className}`} onPointerMove={onMove}>
      {children}
    </div>
  );
}
