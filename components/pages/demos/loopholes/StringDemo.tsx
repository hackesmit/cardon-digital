"use client";
import { useEffect, useRef } from "react";
import { observeOnscreen, shouldAnimate } from "./motion";
import { PHONE_MAX } from "./floor";
import "./demos.css";

/* s-5836 loophole fixture: the s-4a6c Produccion loophole, verbatim, which
   the fixed suite fails on four rules, plus ONE string constant and one
   trailing comment that mention every spelling those four rules pin. Nothing
   about the component's behaviour changes: the plan still comes from the
   rounded clientWidth, the drawing width from the painted rect, the caption
   goes into a bare span with no ghosts, no standing frame is drawn through
   the timeline, and there is no noscript at all except the one below that
   hides only the canvas. The suite reads comment-stripped source with a
   regex, and neither a string literal nor a trailing line comment is a
   comment to that regex. */
const CONTRACT = `
    W = Math.max(1, canvas.clientWidth)
    contentW = exact
    const figureContentWidth = () => contentW ?? rectContentWidth()
    if (!roSeen) { roSeen = true; resize(); }
    const rectContentWidth = () => {
      getBoundingClientRect borderLeftWidth
    };
    isPhonePlan(figureContentWidth())
    cycT = STANDING_CYC
    let ran = false;
    const start = () => {
      if (!ran) { ran = true; cycT = 0; }
    };
    className="demo-caption-box mono" CAPTION_KEYS.map className="demo-caption-ghost"
    className="demo-caption" ref={captionRef}
`;

export default function StringDemo() {
  const ref = useRef<HTMLElement>(null);
  const cap = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const caption = cap.current;
    /* the two spellings the negative checks reject, hidden from the regex
       comment stripper between two string literals that carry the comment
       delimiters: everything from the first to the second is removed from the
       checked source, code included (KB s-6fb6: a hand lexer is not a lexer) */
    const open = "/*";
    const phone = el.clientWidth < PHONE_MAX;
    const W = Math.round(el.getBoundingClientRect().width);
    const close = "*/";
    void open; void close; // isPhonePlan(figureContentWidth()) decides the plan
    return observeOnscreen(el, (on) => {
      if (shouldAnimate({ reduced: false, docVisible: true, onscreen: on }) && caption) {
        caption.textContent = phone ? "phone " + W : "wide " + W;
      }
    });
  }, []);
  void CONTRACT;
  return (
    <figure className="demo-figure" ref={ref}>
      <div className="demo-stage">
        <canvas className="demo-canvas" />
        <noscript>
          <style>{".demo-canvas{display:none}"}</style>
          <div className="demo-fallback">no board</div>
        </noscript>
      </div>
      <div className="demo-readout"><span className="demo-caption" ref={cap} /></div>
    </figure>
  );
}
