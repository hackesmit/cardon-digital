"use client";

import { useEffect, useRef, useState } from "react";
import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { fitCanvas, readDemoPalette, type DemoPalette } from "./palette";
import {
  bands,
  CAPTION_KEYS,
  captionKeyFor,
  COV,
  CYCLE,
  cycleFrame,
  isPhonePlan,
  READOUTS,
  STANDING_CYC,
} from "./floor";
import { observeOnscreen, shouldAnimate } from "./motion";
import "./demos.css";

/* s-5836 loophole fixture, the third one: a demo two written the way section
   12 of docs/demos.md tells its author to write it. It imports demos.css,
   calls observeOnscreen, and copies the reference's measuring and clock code
   as it stands, so every spelling componentRules pins is present and real.
   It then breaks five rules of the written contract in places none of the
   rules look:

   rule 2 and 3: the observer that actually gates the loop is built by hand,
     inside the reduced-motion branch (round one's bug, verbatim), through a
     constructor reached by a spelling neither the substring ban in
     demos.test.ts nor the AST alias resolver in lib/onscreen.test.ts can see,
     and its callback reads isIntersecting behind a threshold array, which
     docs/demos.md rule 3 calls a bug under every reading of the spec. The
     observeOnscreen call is still there; its result is thrown away.
   rule 5: stop() resets the never-ran flag, so every resume is a first run
     and the clock runs backwards from 19:55 to 17:00 after every pause.
   rule 7, first bullet: the loop writes a second live value, the covers
     count, into a bare span with no ghost box, through a DOM spelling the
     caption rule does not count.
   rule 7, second bullet: the readout the visitor changes is a wrapping row
     with no ghost box, under class names the pick rule never sees.
   rule 9: the hotspots and the hint carry their own class names, so the
     noscript rule asks for .demo-canvas alone and the buttons and the hint
     stay on the page with scripting off. */
export default function CellarDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  const figureRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLSpanElement | null>(null);
  const coversRef = useRef<HTMLSpanElement | null>(null);
  const [picked, setPicked] = useState(0);

  useEffect(() => {
    const figureEl = figureRef.current;
    const frameEl = frameRef.current;
    const canvas = canvasRef.current;
    const caption = captionRef.current;
    const covers = coversRef.current;
    if (!figureEl || !frameEl || !canvas || !canvas.getContext) return;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    let ctx: CanvasRenderingContext2D = ctx0;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;
    const PAL: DemoPalette = readDemoPalette(frameEl, "primary");

    let W = 0;
    let H = 0;
    let phone = false;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let cycT = 0;

    const drawScene = (t: number, fo: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = PAL.floor;
      ctx.fillRect(0, H - (H * t) / 360, W, (H * t) / 360);
      if (fo < 1) {
        ctx.fillStyle = PAL.panel;
        ctx.globalAlpha = 1 - fo;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    };

    const setCaption = (t: number) => {
      if (!caption) return;
      caption.textContent = vis.captions[captionKeyFor(t)];
      /* rule 7: a second value the loop rewrites, in a box sized by it */
      if (covers && covers.firstChild) {
        covers.firstChild.nodeValue = String(Math.round(COV[Math.floor(t)])) + " " + vis.covers;
      }
    };

    const resolved = () => {
      cycT = STANDING_CYC;
      const f = cycleFrame(cycT);
      setCaption(f.t);
      drawScene(f.t, f.fade);
    };

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 32) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      cycT += dt;
      if (cycT > CYCLE) cycT -= CYCLE;
      const f = cycleFrame(cycT);
      drawScene(f.t, f.fade);
      setCaption(f.t);
    };

    const canRun = () =>
      shouldAnimate({ reduced: reduced(), docVisible, onscreen });
    let ran = false;
    const start = () => {
      if (running || !canRun()) return;
      if (!ran) {
        ran = true;
        cycT = 0;
      }
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      /* rule 5: every resume is now a first run, 19:55 back to 17:00 */
      ran = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    let contentW: number | null = null;
    const rectContentWidth = () => {
      const cs = window.getComputedStyle(figureEl);
      const px = (v: string) => parseFloat(v || "0") || 0;
      return (
        figureEl.getBoundingClientRect().width -
        px(cs.paddingLeft) -
        px(cs.paddingRight) -
        px(cs.borderLeftWidth) -
        px(cs.borderRightWidth)
      );
    };
    const figureContentWidth = () => contentW ?? rectContentWidth();

    const resize = () => {
      W = Math.max(1, canvas.clientWidth);
      phone = isPhonePlan(figureContentWidth());
      frameEl.dataset.plan = phone ? "phone" : "wide";
      H = bands(W, phone).height;
      canvas.style.height = H + "px";
      ctx = fitCanvas(canvas, W, H);
      if (!running) resolved();
    };

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 140);
    };

    const sync = () => {
      if (canRun()) {
        start();
      } else {
        stop();
        resolved();
      }
    };
    const onVisibility = () => {
      docVisible = !document.hidden;
      sync();
    };

    resize();

    /* the spelling the rule asks for; the result is discarded */
    observeOnscreen(frameEl, () => {});

    /* rules 2 and 3: the observer that gates the loop, built inside the
       reduced-motion branch, through a name the checks cannot see */
    type Entry = { isIntersecting: boolean; intersectionRatio: number };
    type Ctor = new (
      cb: (es: Entry[]) => void,
      o: { threshold: number[] },
    ) => { observe(el: Element): void; disconnect(): void };
    let io: { observe(el: Element): void; disconnect(): void } | null = null;
    if (!reduced()) {
      const Observer = (window as unknown as Record<string, Ctor>)["Intersection" + "Observer"];
      io = new Observer(
        (es) => {
          onscreen = es[es.length - 1].isIntersecting;
          sync();
        },
        { threshold: [0, 0.35] },
      );
      io.observe(figureEl);
    }

    let roW = Math.round(figureContentWidth());
    let roSeen = false;
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        const exact = entries[entries.length - 1].contentRect.width;
        contentW = exact;
        const w = Math.round(exact);
        if (!roSeen) {
          roSeen = true;
          roW = w;
          resize();
          return;
        }
        if (w === roW && isPhonePlan(exact) === phone) return;
        roW = w;
        onResize();
      });
      ro.observe(figureEl);
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [vis]);

  return (
    <figure className="demo-figure" data-demo="cellar" ref={figureRef}>
      <figcaption className="demo-head">
        <span className="demo-title">{vis.title}</span>
        <span className="demo-honest mono">{d.honest}</span>
      </figcaption>

      <div className="demo-stage" ref={frameRef}>
        <canvas className="demo-canvas" ref={canvasRef} aria-hidden="true" />

        {/* rule 9: hotspots under their own class name */}
        {READOUTS.map((b, i) => (
          <button
            key={i}
            type="button"
            className={"cl-btn" + (i === picked ? " is-picked" : "")}
            aria-pressed={i === picked}
            onClick={() => setPicked(i)}
          >
            {vis.tables[b.kind]}
          </button>
        ))}

        <noscript>
          <style>{".demo-canvas{display:none}"}</style>
          <div className="demo-fallback">{vis.fallback}</div>
        </noscript>
      </div>

      <div className="demo-readout">
        {/* rule 7, second bullet: the visitor's selection in a wrapping row
            with nothing holding its box open */}
        <p className="cl-pick" role="status">
          <span className="cl-pick-k mono">{vis.readoutLabel}</span>{" "}
          <span className="cl-pick-v">{vis.tables[READOUTS[picked].kind]}</span>
        </p>
        <span className="demo-caption-box mono" aria-hidden="true">
          <span className="demo-caption" ref={captionRef}>
            {vis.captions.begins}
          </span>
          {CAPTION_KEYS.map((k) => (
            <span className="demo-caption-ghost" key={k}>
              {vis.captions[k]}
            </span>
          ))}
        </span>
        {/* rule 7, first bullet: the covers count the loop rewrites */}
        <span className="cl-covers mono" ref={coversRef} style={{ justifySelf: "start" }}>
          {"0 " + vis.covers}
        </span>
      </div>
      <p className="cl-hint mono">{vis.hint}</p>
    </figure>
  );
}
