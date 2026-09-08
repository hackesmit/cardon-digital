// Node-cactus mark, geometry from bunkers/cardon-digital/brand/cardon-mark.svg
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
      viewBox="-145.49 -469.1 352.79 738.2"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke={ink} strokeWidth="14.59" strokeLinejoin="round">
        <path d="M-100 -61.8 V0 H161.8 V-223.61" />
        <path d="M0 -385.41 V261.8" />
      </g>
      <g stroke={ink} strokeWidth="14.59">
        <circle cx="0" cy="-423.61" r="30.9" fill={node} />
        <circle cx="-100" cy="-100" r="30.9" fill={node} />
        <circle cx="161.8" cy="-261.8" r="30.9" fill="#FF2EA7" />
      </g>
    </svg>
  );
}
