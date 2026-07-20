/* Line-art cardon that draws itself with scroll position. Pure SVG + CSS
   (scroll-driven animations); browsers without support see it fully drawn. */

export default function CactusDraw({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      className={`lab-draw ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 60 130 L 60 32"
        pathLength={1}
        stroke="var(--cardon)"
        strokeWidth={11}
        strokeLinecap="round"
      />
      <path
        d="M 60 96 L 48 96 Q 41 96 41 89 L 41 66"
        pathLength={1}
        stroke="var(--cardon)"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 60 110 L 72 110 Q 79 110 79 103 L 79 76"
        pathLength={1}
        stroke="var(--cardon)"
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 16 133 L 104 133"
        pathLength={1}
        stroke="var(--haze)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
