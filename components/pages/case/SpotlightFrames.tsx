"use client";

import { useEffect } from "react";

/**
 * Attaches the cursor-follow spotlight handler to every framed visual on the
 * case study. On pointermove it writes --mx / --my (in px, relative to the
 * frame) so the .vis-frame::after and .vine-stage::after radial highlight
 * tracks the cursor. Effect-only: renders nothing.
 */
export default function SpotlightFrames() {
  useEffect(() => {
    const frames = Array.prototype.slice.call(
      document.querySelectorAll(".pg-case .vis-frame, .pg-case .vine-stage")
    ) as HTMLElement[];

    const handlers: Array<{
      el: HTMLElement;
      fn: (e: PointerEvent) => void;
    }> = [];

    frames.forEach((fr) => {
      const fn = (e: PointerEvent) => {
        const r = fr.getBoundingClientRect();
        fr.style.setProperty("--mx", e.clientX - r.left + "px");
        fr.style.setProperty("--my", e.clientY - r.top + "px");
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
