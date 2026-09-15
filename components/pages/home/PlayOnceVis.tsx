"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * Play-once settle visual wrapper (Demand measurement panel, Tools board).
 * The default rendered markup is the resolved state (static, works with no JS),
 * so nothing is emitted server-side. On mount we set data-anim="pre" (the before
 * state) and, when the frame scrolls into view, flip to "play" which resolves
 * with the CSS transitions; leaving view resets to "pre" so it replays. Under
 * reduced motion no data-anim is set, leaving the resolved static state.
 * Ported from the desert-tech-v2 home "playOnce" IIFE; generalized so the demand
 * and tools frames share one implementation.
 */
export default function PlayOnceVis({
  className,
  tag,
  children,
}: {
  className: string;
  tag: string;
  children: ReactNode;
}) {
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
            en.target.setAttribute("data-anim", en.isIntersecting ? "play" : "pre");
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
    <div className={"vis-frame " + className} ref={ref}>
      <span className="vis-tag">{tag}</span>
      {children}
    </div>
  );
}
