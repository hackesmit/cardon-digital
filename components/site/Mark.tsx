// Line-cactus mark (identity 2026-10-09, "05 Rounded Tech"): one continuous
// line runs in from the left as flat ground, rises into a low dune, drops to
// the foot of a saguaro, climbs its outline (left arm high, right arm low),
// comes back down and rises again into a taller dune before running out flat
// to the right. A small sun sits off the right arm. The line is drawn in
// currentColor so the nav, the holding page and any future surface set its
// ink with plain CSS and it follows data-mode in the server HTML with no JS.
// The sun is a fixed brand tan, unaffected by mode, like the old olive dots.
// Geometry: stroke 5 on a 200 by 82 box; trunk 12 wide, arms 9 wide, trunk
// to arm gap 9, every outer corner rounded.
export const MARK_PATH =
  "M4 92H20C34 92 44 76 58 76C70 76 80 86 88 90" +
  "V70H74A4 4 0 0 1 70 66V46.5A4.5 4.5 0 0 1 79 46.5V62H88" +
  "V28A6 6 0 0 1 100 28" +
  "V70H109V54.5A4.5 4.5 0 0 1 118 54.5V74A4 4 0 0 1 114 78H100" +
  "V90C108 86 118 62 140 62C162 62 174 84 182 92H196";
export const MARK_SUN = { cx: 130, cy: 38, r: 6.5 };
export const MARK_VIEWBOX = "0 16 200 82";
export const SUN_TAN = "#C9A074";

export default function Mark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={MARK_VIEWBOX}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={MARK_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={MARK_SUN.cx} cy={MARK_SUN.cy} r={MARK_SUN.r} fill={SUN_TAN} />
    </svg>
  );
}
