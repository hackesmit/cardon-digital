"use client";

/* In-page View Transitions demo: each tile carries a unique
   view-transition-name, so on shuffle the browser morphs every tile
   from its old box to its new one. Falls back to an instant reorder. */

import { useState } from "react";

type Tile = { id: number; bg: string; fg: string };

const INITIAL: Tile[] = [
  { id: 1, bg: "bg-cardon", fg: "text-sand" },
  { id: 2, bg: "bg-clay", fg: "text-sand" },
  { id: 3, bg: "bg-ochre", fg: "text-ink" },
  { id: 4, bg: "bg-dune", fg: "text-ink" },
  { id: 5, bg: "bg-night", fg: "text-sand" },
  { id: 6, bg: "bg-haze", fg: "text-sand" },
];

export default function ShuffleGrid({ label }: { label: string }) {
  const [tiles, setTiles] = useState(INITIAL);

  const shuffle = () => {
    const next = [...tiles];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    const apply = () => setTiles(next);
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (
      doc.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t, i) => (
          <div
            key={t.id}
            style={{ viewTransitionName: `lab-shuffle-${t.id}` } as React.CSSProperties}
            className={`flex items-end p-3 font-mono text-xs ${t.bg} ${t.fg} ${
              i === 0 ? "col-span-2 row-span-2 min-h-36" : "min-h-16"
            }`}
          >
            0{t.id}
          </div>
        ))}
      </div>
      <button
        onClick={shuffle}
        className="mt-4 border border-ink/25 px-5 py-2 font-mono text-xs uppercase tracking-wide transition-colors hover:border-ink"
      >
        {label}
      </button>
    </div>
  );
}
