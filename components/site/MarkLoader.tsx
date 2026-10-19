"use client";

import { useId } from "react";
import { DRAWING_D, MARK_VIEWBOX, SUN_D } from "@/components/site/Mark";
import { MARK_BRUSH, MARK_LINE_D, MARK_SUN_D } from "@/components/site/markCenterline";
import "./mark-loader.css";

/**
 * The waiting state: the Cardon mark draws itself, the way the hand that drew
 * it did. The cactus goes up from its foot, the pen runs east along the ground
 * and over the mountain, and the sun closes last.
 *
 * WHY IT IS BUILT THIS WAY. DRAWING_D and SUN_D are filled outlines: they trace
 * the edge of the ink. Running stroke-dashoffset along an outline draws up one
 * side of the cactus and back down the other, which is the first thing that was
 * tried and the reason Daniel called the mockup not smooth. So the pen path
 * underneath is the artwork's centreline, recovered from the artwork itself by
 * scripts/mark-centerline.mjs, and it is painted with a brush wide enough to
 * cover the ink and CLIPPED to the outline. What appears is the real hand-drawn
 * ink, wobble, taper and all, arriving under a moving pen. Nothing here is a
 * redrawing of the mark in a smooth synthetic line.
 *
 * The animation is stroke-dashoffset and opacity only, both off the main
 * thread, and there is no script: the whole loop is CSS, so it costs nothing
 * while it waits and runs before React hydrates. Under prefers-reduced-motion
 * the pen is already home and the mark sits there, finished and still.
 *
 * Decorative by contract. The element is aria-hidden, and every call site says
 * in words what is happening: the contact button carries "Enviando", the route
 * fallback carries its own status line. A visitor who cannot see this never
 * waits on it and never hears about it.
 */
export default function MarkLoader({ className }: { className?: string }) {
  // One document can hold two loaders (a route fallback over a form), and two
  // clipPaths cannot share an id. Colons out: useId's value is legal in an id
  // but awkward everywhere else.
  const clip = "mark-loader-" + useId().replace(/:/g, "");
  return (
    <span className={className ? "ml " + className : "ml"} aria-hidden="true">
      <svg className="ml-svg" viewBox={MARK_VIEWBOX} focusable="false">
        <defs>
          <clipPath id={clip}>
            <path d={DRAWING_D} />
            <path d={SUN_D} />
          </clipPath>
        </defs>
        <g className="ml-ink">
          {/* Where the pen is going: the finished mark, barely there. */}
          <g className="ml-ghost" fill="currentColor">
            <path d={DRAWING_D} />
            <path d={SUN_D} />
          </g>
          <g className="ml-brush" clipPath={`url(#${clip})`} strokeWidth={MARK_BRUSH}>
            <path className="ml-line" d={MARK_LINE_D} pathLength={1} />
            <path className="ml-sun" d={MARK_SUN_D} pathLength={1} />
          </g>
        </g>
      </svg>
    </span>
  );
}
