// Node-cactus mark, geometry from bunkers/cardon-digital/brand/cardon-mark-bold.svg
// (golden-ratio construction, see that folder's README). "color" is the
// official palette for light grounds; "mono-bloom" takes currentColor for
// dark grounds and keeps only the bloom pink.
type MarkVariant = "color" | "mono-bloom";

export default function Mark({
  variant,
  className,
}: {
  variant: MarkVariant;
  className?: string;
}) {
  const ink = variant === "color" ? "#221C14" : "currentColor";
  const node = variant === "color" ? "#546B0E" : "currentColor";
  return (
    <svg
      className={className}
      viewBox="-167.69 -491.29 397.17 772.19"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke={ink} strokeWidth="38.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M-100 -51.41 V0 H161.8 V-213.22" />
        <path d="M0 -375.02 V261.8" />
      </g>
      <g stroke={ink} strokeWidth="38.2">
        <circle cx="0" cy="-423.61" r="29.49" fill={node} />
        <circle cx="-100" cy="-100" r="29.49" fill={node} />
        <circle cx="161.8" cy="-261.8" r="29.49" fill="#FF2EA7" />
      </g>
    </svg>
  );
}
