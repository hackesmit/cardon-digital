"use client";

import { useEffect } from "react";

/**
 * Attaches a cursor-follow spotlight to signature / visual frames by writing the
 * --mx / --my custom properties on pointermove. The frame CSS reads them in a
 * hover-only radial gradient, so there is zero cost when the pointer is away.
 * Renders nothing; it wires listeners onto frames already in the DOM.
 */
export default function SpotlightFrames() {
  useEffect(() => {
    const frames = Array.from(
      document.querySelectorAll<HTMLElement>(".sig-frame, .vis-frame")
    );
    const cleanups: Array<() => void> = [];
    frames.forEach((frame) => {
      const onMove = (e: PointerEvent) => {
        const r = frame.getBoundingClientRect();
        frame.style.setProperty("--mx", e.clientX - r.left + "px");
        frame.style.setProperty("--my", e.clientY - r.top + "px");
      };
      frame.addEventListener("pointermove", onMove);
      cleanups.push(() => frame.removeEventListener("pointermove", onMove));
    });
    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
