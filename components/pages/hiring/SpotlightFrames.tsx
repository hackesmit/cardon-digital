"use client";

import { useEffect } from "react";

/**
 * Cursor-spotlight helper for signature-visual frames. On pointermove it writes
 * the cursor position into the frame's --mx / --my custom properties, which the
 * scoped `.stage-frame::after` (and the shared `.vis-frame::after`) reads to
 * light a soft radial glow that follows the pointer. Renders no DOM of its own.
 */
export default function SpotlightFrames() {
  useEffect(() => {
    const frames = Array.from(
      document.querySelectorAll<HTMLElement>(".stage-frame, .vis-frame")
    );
    const wired: Array<{ el: HTMLElement; fn: (e: PointerEvent) => void }> = [];

    frames.forEach((fr) => {
      const fn = (e: PointerEvent) => {
        const r = fr.getBoundingClientRect();
        fr.style.setProperty("--mx", e.clientX - r.left + "px");
        fr.style.setProperty("--my", e.clientY - r.top + "px");
      };
      fr.addEventListener("pointermove", fn);
      wired.push({ el: fr, fn });
    });

    return () => {
      wired.forEach(({ el, fn }) => el.removeEventListener("pointermove", fn));
    };
  }, []);

  return null;
}
