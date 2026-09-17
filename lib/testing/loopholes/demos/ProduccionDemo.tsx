"use client";
import { useEffect, useRef } from "react";
import { observeOnscreen, shouldAnimate } from "./motion";
import { PHONE_MAX } from "./floor";
import "./demos.css";

/* s-4a6c loophole fixture: a demo two that keeps the letter of demos.test.ts
   (imports demos.css, calls observeOnscreen, builds no observer) and breaks
   contract rules 5, 6, 7 and 8 from docs/demos.md: the plan from the rounded
   clientWidth, the drawing width from the painted rect, the caption written
   into a bare span with no ghosts, no standing frame through a timeline. */
export default function ProduccionDemo() {
  const ref = useRef<HTMLElement>(null);
  const cap = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const phone = el.clientWidth < PHONE_MAX;
    const W = Math.round(el.getBoundingClientRect().width);
    return observeOnscreen(el, (on) => {
      if (shouldAnimate({ reduced: false, docVisible: true, onscreen: on }) && cap.current) {
        cap.current.textContent = phone ? "phone " + W : "wide " + W;
      }
    });
  }, []);
  return (
    <figure className="demo-figure" ref={ref}>
      <div className="demo-stage"><canvas className="demo-canvas" /></div>
      <div className="demo-readout"><span className="demo-caption" ref={cap} /></div>
    </figure>
  );
}
