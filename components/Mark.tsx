/* The Cardon mark: five vertical ribs, center tallest.
   Cactus silhouette abstracted to a bar chart. */
export default function Mark({
  className = "h-6 w-auto",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 34 24" fill="none" className={className} aria-hidden="true">
      <rect x="0" y="10" width="4" height="14" fill={color} />
      <rect x="7.5" y="5" width="4" height="19" fill={color} />
      <rect x="15" y="0" width="4" height="24" fill={color} />
      <rect x="22.5" y="7" width="4" height="17" fill={color} />
      <rect x="30" y="12" width="4" height="12" fill={color} />
    </svg>
  );
}
