"use client";

import { useEffect } from "react";

/**
 * Cursor spotlight helper. For every element with the .vis-frame class, it tracks
 * the pointer and writes --mx / --my custom properties on that element, which the
 * shared .vis-frame::after radial reads to light a soft glow under the cursor.
 * Ported from the source page's frame pointermove loop. Renders nothing.
 */
export default function SpotlightFrames() {
  useEffect(() => {
    const frames = Array.from(
      document.querySelectorAll<HTMLElement>(".vis-frame")
    );
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
    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
