// Node-cactus mark, geometry from bunkers/cardon-digital/brand/cardon-mark-bold.svg
// (golden-ratio construction, see that folder's README). Ink follows
// var(--primary), the same variable the old .bm-line mark read, so it flips
// with data-mode in the server HTML with no JS and no pre-hydration FOUC.
// Olive and the bloom pink are fixed brand fills, unaffected by mode.
type MarkVariant = "color" | "mono-bloom";

export default function Mark({
  variant,
  className,
}: {
  variant: MarkVariant;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="-198.59 -491.29 397.17 772.19"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="var(--primary)" strokeWidth="38.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M-130.9 -51.41 V0 H130.9 V-213.22" />
        <path d="M0 -375.02 V261.8" />
      </g>
      <g stroke="var(--primary)" strokeWidth="38.2">
        <circle cx="0" cy="-423.61" r="29.49" fill="#546B0E" />
        <circle cx="-130.9" cy="-100" r="29.49" fill="#546B0E" />
        <circle cx="130.9" cy="-261.8" r="29.49" fill="#FF2EA7" />
      </g>
    </svg>
  );
}
