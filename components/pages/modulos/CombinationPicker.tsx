"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import BridgeMap, {
  BRIDGE_NODES,
  bridgeLabels,
  bridgeMask,
  type BridgeModuleId,
} from "@/components/pages/modulos/BridgeMap";
import type { Locale } from "@/lib/i18n/config";

/**
 * The seven combinations, picked on the map instead of read about (bead
 * hq-wrig5.13). The three nodes are toggles: switch modules on and off and the
 * figure lights the edges that exist between what you picked, while the row
 * that IS that combination is marked in the list beside it. That is the rule
 * the section states, made operable: a bridge appears only when both of the
 * modules it joins are on.
 *
 * What happens without JS. The server renders all three modules picked, which
 * is the seventh row, so the figure arrives complete and every one of the
 * seven rows is present and readable exactly as it was before this component
 * existed. Picking only moves the marking; no row is ever hidden, so the list
 * is never a thing you have to interact with to read.
 *
 * The copy stays on the server. The list arrives as children, already
 * rendered, and the only thing this component tells it is which combination is
 * switched on, as the mask on the wrapper that one CSS rule per row matches.
 * Nothing in lib/i18n/modulos.ts is shipped to the browser.
 */

const MODULE_IDS = Object.keys(BRIDGE_NODES) as BridgeModuleId[];

export default function CombinationPicker({
  locale,
  children,
}: {
  locale: Locale;
  /** The seven rows, rendered on the server. */
  children: ReactNode;
}) {
  const names = bridgeLabels(locale);
  const [on, setOn] = useState<string[]>(MODULE_IDS.slice());

  /* The last module on cannot be switched off. Zero modules is not one of the
     seven combinations, so it would leave the list with nothing marked and the
     map with nothing drawn, which is a state this section does not describe:
     you buy the modules you run on, and running none is not a purchase. The
     node stays pressed instead, which is the same shape as any "at least one"
     filter (Lucy 2026-09-09, first finding). */
  const toggle = (id: string) =>
    setOn((current) => {
      if (!current.includes(id)) return [...current, id];
      if (current.length === 1) return current;
      return current.filter((m) => m !== id);
    });

  return (
    <div className="combina-grid" data-on={bridgeMask(on)}>
      <div className="bridge-col">
        <figure className="bridge-map">
          {/* The plot is its own positioning box so the hit targets land on
              the nodes rather than on the figure's padding box. */}
          <span className="bridge-plot">
            <BridgeMap locale={locale} on={on} />
            {/* The hit targets sit over the nodes rather than being the
                circles themselves: a 13 unit circle is well under the 24 px a
                finger needs, and a button is what a keyboard reaches. The
                label under each node is the visible name, so these carry only
                an aria-label. */}
            {MODULE_IDS.map((id) => {
              const node = BRIDGE_NODES[id];
              return (
                <button
                  type="button"
                  key={id}
                  className="bg-hit"
                  aria-pressed={on.includes(id)}
                  aria-label={names[id]}
                  onClick={() => toggle(id)}
                  /* Shares of the drawing rather than pixels, for the same
                     reason the table map uses them: the svg scales and a fixed
                     size only fits at one width. */
                  style={
                    {
                      "--x": (node.x / 320) * 100 + "%",
                      "--y": (node.y / 214) * 100 + "%",
                      "--w": (26 / 320) * 100 + "%",
                      "--h": (26 / 214) * 100 + "%",
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </span>
        </figure>
      </div>

      {children}
    </div>
  );
}
