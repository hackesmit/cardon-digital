"use client";

import { useEffect } from "react";

/**
 * Cursor spotlight helper. Wires pointermove on every ".spot" framed surface in
 * the winery page (the stage frame, the capability cards, and the proof card),
 * setting the --mx / --my custom properties the ".spot::after" glow reads. The
 * spotlight is lit only while hovering (CSS gated), so this costs nothing idle.
 */
export default function SpotlightFrames() {
  useEffect(() => {
    const frames = Array.from(
      document.querySelectorAll<HTMLElement>(".pg-winery .spot")
    );
    const wired: Array<[HTMLElement, (e: PointerEvent) => void]> = [];
    frames.forEach((fr) => {
      const onMove = (e: PointerEvent) => {
        const r = fr.getBoundingClientRect();
        fr.style.setProperty("--mx", e.clientX - r.left + "px");
        fr.style.setProperty("--my", e.clientY - r.top + "px");
      };
      fr.addEventListener("pointermove", onMove);
      wired.push([fr, onMove]);
    });
    return () =>
      wired.forEach(([fr, h]) => fr.removeEventListener("pointermove", h));
  }, []);

  return null;
}
