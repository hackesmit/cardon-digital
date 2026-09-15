"use client";

import { useEffect } from "react";

/**
 * Attaches the cursor-follow spotlight handler to every framed visual on the
 * case study. On pointermove it writes --mx / --my (in px, relative to the
 * frame) so the .vis-frame::after and .vine-stage::after radial highlight
 * tracks the cursor. Effect-only: renders nothing.
 *
 * The rewrite (hq-4pu0q.4) deleted this file as decoration and Daniel reversed
 * that: a copy bead never deletes a visual, and retiring one is his decision
 * alone. Restored against the rewritten page. It needs no dictionary key,
 * because it renders no text; what it needs is a frame to attach to, and the
 * rewritten page still renders four (.vis-frame on the finance compression and
 * both berry to bottle strips, .vine-stage on the section map and the strips),
 * so every target it had still exists.
 *
 * The selector and the geometry are exported because the only way this can
 * break again without anyone noticing is silently: a page that stops mounting
 * it, a frame class that gets renamed, or a stylesheet that stops reading the
 * variables. None of those is visible in a screenshot, and no browser can be
 * launched on this box today, so SpotlightFrames.test.ts pins all three.
 */
export const SPOTLIGHT_SELECTOR = ".pg-case .vis-frame, .pg-case .vine-stage";

/** The custom properties the glow reads, in px relative to the frame's box. */
export function spotlightVars(
  rect: { left: number; top: number },
  clientX: number,
  clientY: number
): { "--mx": string; "--my": string } {
  return {
    "--mx": clientX - rect.left + "px",
    "--my": clientY - rect.top + "px",
  };
}

export default function SpotlightFrames() {
  useEffect(() => {
    const frames = Array.prototype.slice.call(
      document.querySelectorAll(SPOTLIGHT_SELECTOR)
    ) as HTMLElement[];

    const handlers: Array<{
      el: HTMLElement;
      fn: (e: PointerEvent) => void;
    }> = [];

    frames.forEach((fr) => {
      const fn = (e: PointerEvent) => {
        const vars = spotlightVars(fr.getBoundingClientRect(), e.clientX, e.clientY);
        fr.style.setProperty("--mx", vars["--mx"]);
        fr.style.setProperty("--my", vars["--my"]);
      };
      fr.addEventListener("pointermove", fn);
      handlers.push({ el: fr, fn });
    });

    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener("pointermove", fn));
    };
  }, []);

  return null;
}
