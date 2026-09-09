"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/**
 * The frame around the seven combinations and the legend that names the blocks
 * a monthly bar is made of (bead hq-wrig5.13). The table itself is passed in as
 * children and is rendered on the server, so the seven rows, their figures and
 * the sentence under every row name never travel to the browser twice and this
 * file stays the only client code the pricing page adds.
 *
 * Pressing a key holds that block up across all seven rows, which is how a
 * reader sees that the shared base really is the same width every time. Nothing
 * is hidden by it and no row is filtered away: the state is one attribute on
 * this wrapper and the dimming is a CSS rule, so the table reads exactly the
 * same whether or not anything is pressed, and the server renders the released
 * state.
 */
export default function ComboVis({
  legend,
  legendNote,
  children,
}: {
  /** The four blocks a monthly bar is made of, the shared base first. */
  legend: { key: string; label: string }[];
  /** Scopes the legend to the monthly bar so its colours are never read onto
   *  the build bar beside it, which draws in a shade of its own. */
  legendNote: string;
  children: ReactNode;
}) {
  const [held, setHeld] = useState<string | null>(null);

  return (
    <div className="combo-vis" data-held={held ?? undefined}>
      <ul className="combo-legend">
        {legend.map((entry) => (
          <li key={entry.key}>
            <button
              type="button"
              className="combo-key"
              data-part={entry.key}
              aria-pressed={held === entry.key}
              onClick={() => setHeld(held === entry.key ? null : entry.key)}
            >
              <span className="combo-swatch" aria-hidden="true" />
              <span>{entry.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="combo-legend-note">{legendNote}</p>
      {children}
    </div>
  );
}
