"use client";

import { useEffect } from "react";

/**
 * Cursor spotlight on the section visuals. Attaches a pointermove handler to
 * every .vis-frame that writes --mx / --my so the CSS radial highlight follows
 * the cursor (lit only while hovering, zero cost otherwise). Behavior-only:
 * renders nothing. Ported from the desert-tech-v2 home spotlight IIFE.
 */
export default function SpotlightFrames() {
  useEffect(() => {
    const frames = Array.prototype.slice.call(
      document.querySelectorAll(".vis-frame")
    ) as HTMLElement[];
    const cleanups: Array<() => void> = [];
    frames.forEach((fr) => {
      const onMove = (e: PointerEvent) => {
        const r = fr.getBoundingClientRect();
        fr.style.setProperty("--mx", e.clientX - r.left + "px");
        fr.style.setProperty("--my", e.clientY - r.top + "px");
      };
      fr.addEventListener("pointermove", onMove);
      cleanups.push(() => fr.removeEventListener("pointermove", onMove));
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
