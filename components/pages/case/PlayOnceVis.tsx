"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type PlayOnceVisProps = {
  /** stable id for the frame (pred / finance) */
  id: string;
  /** the play-once variant class: "pred-vis" or "fin-vis" */
  variant: string;
  /** the small uppercase tag pinned top-left of the frame */
  tag: string;
  /** the SVG diagram */
  children: ReactNode;
};

/**
 * Frame for a play-once "settle" diagram (prediction draw-on, finance compress).
 * The default markup is the resolved state; "pre" holds the initial state and is
 * released to "play" when the panel scrolls into view (replayed on return).
 * Under prefers-reduced-motion the diagram stays in its resolved state with no
 * data-anim attribute at all. Faithful to the source playOnce routine.
 */
export default function PlayOnceVis({
  id,
  variant,
  tag,
  children,
}: PlayOnceVisProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;

    if (reduced()) {
      el.removeAttribute("data-anim");
      return;
    }

    el.setAttribute("data-anim", "pre");

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            en.target.setAttribute(
              "data-anim",
              en.isIntersecting ? "play" : "pre"
            );
          });
        },
        { threshold: 0.4 }
      );
      io.observe(el);
    } else {
      el.removeAttribute("data-anim");
    }

    const onReduceChange = () => {
      if (reduced()) el.removeAttribute("data-anim");
    };
    reduceMQ.addEventListener("change", onReduceChange);

    return () => {
      if (io) io.disconnect();
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, []);

  return (
    <div className={"vis-frame " + variant} id={id} ref={ref}>
      <span className="vis-tag">{tag}</span>
      {children}
    </div>
  );
}
