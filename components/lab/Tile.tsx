/* Lab tile frame: number + name header, tech tag, demo area, caption. */

export default function Tile({
  n,
  title,
  tech,
  desc,
  className = "",
  children,
}: {
  n: string;
  title: string;
  tech: string;
  desc: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col bg-sand ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-6 pt-5">
        <p className="font-mono text-xs text-ink/80">
          <span className="text-cardon">{n}</span> {title}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-haze">
          {tech}
        </p>
      </div>
      <div className="mt-4 flex-1">{children}</div>
      <p className="px-6 pb-6 pt-4 text-sm leading-relaxed text-ink/65">{desc}</p>
    </div>
  );
}
