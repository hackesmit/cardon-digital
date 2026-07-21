"use client";

import { useEffect } from "react";

type SpotlightFramesProps = {
  /** CSS selector for the frames that get a cursor spotlight. */
  selector?: string;
};

/**
 * Attaches a pointermove handler to each matching frame that writes the cursor
 * position into --mx / --my, driving the CSS radial-gradient spotlight on
 * ::after. Renders nothing. Faithful port of the source helper, which targeted
 * the signature frame; the shared .vis-frame spotlight in globals.css reads the
 * same custom properties, so both are covered by the default selector.
 */
export default function SpotlightFrames({
  selector = ".sig-frame, .vis-frame",
}: SpotlightFramesProps) {
  useEffect(() => {
    const frames = Array.from(
      document.querySelectorAll<HTMLElement>(selector)
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
  }, [selector]);

  return null;
}
