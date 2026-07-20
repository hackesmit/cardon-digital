/* The Cardon mark: a cardon cactus abstracted to a pixel grid.
   Center column plus raised arms, two greens. Recreated from
   Daniel's placeholder logo. */
export default function Mark({
  className = "h-6 w-auto",
  dark = "#47573C",
  light = "#97A77F",
}: {
  className?: string;
  dark?: string;
  light?: string;
}) {
  const r = 1.3;
  return (
    <svg viewBox="0 0 24 19" fill="none" className={className} aria-hidden="true">
      {/* center column */}
      <rect x="10" y="0" width="4" height="4" rx={r} fill={dark} />
      <rect x="10" y="5" width="4" height="4" rx={r} fill={dark} />
      <rect x="10" y="10" width="4" height="4" rx={r} fill={dark} />
      <rect x="10" y="15" width="4" height="4" rx={r} fill={dark} />
      {/* crown */}
      <rect x="5" y="0" width="4" height="4" rx={r} fill={light} />
      <rect x="15" y="0" width="4" height="4" rx={r} fill={light} />
      {/* arms */}
      <rect x="0" y="5" width="4" height="4" rx={r} fill={light} />
      <rect x="5" y="5" width="4" height="4" rx={r} fill={light} />
      <rect x="15" y="5" width="4" height="4" rx={r} fill={light} />
      <rect x="20" y="5" width="4" height="4" rx={r} fill={light} />
    </svg>
  );
}
