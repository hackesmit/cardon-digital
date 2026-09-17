import { useEffect, useRef, type RefObject } from "react";
import { observeOnscreen, shouldAnimate } from "../motion";
import { fitCanvas, readDemoPalette, type DemoHue, type DemoPalette } from "../palette";
import { createClock, type ClockSpec } from "./clock";
import { isPhonePlan } from "./plan";

/**
 * Everything a module demo has to get right that is not its picture (bead
 * hq-3pfhe.7): measuring, the three motion gates, the loop, the clock, the
 * device pixel ratio, the theme, and every write the loop makes to the DOM.
 *
 * It was all inside RestauranteDemo.tsx, and docs/demos.md told the next two
 * authors to copy it as it stood, with a test pinning the spellings. Two
 * review rounds showed what that buys: a demo written by copying passed every
 * check while freezing for the life of the page, running its clock backwards
 * and reflowing the page, because it OWNED the observer, the clock and the
 * writes, and a check on how a thing is spelled cannot see what it does. A
 * demo now owns none of them. It supplies a DemoScene, which is a picture of
 * one moment of its loop, and this file decides when that moment is, how big
 * the canvas is, and whether anything moves at all.
 *
 * Each block below carries the defect it exists for. They are not style.
 */

/** What a scene is told about the board it is drawing on. */
export interface StageEnv {
  ctx: CanvasRenderingContext2D;
  /** The canvas's layout width in CSS pixels, an integer. */
  W: number;
  H: number;
  /** Which plan the figure's container query chose. */
  phone: boolean;
  pal: DemoPalette;
  /** Which hotspot the visitor has selected, as the figure was told. */
  selection: number;
}

/**
 * A value the loop rewrites in the DOM. It names WHICH of a fixed set of
 * strings is showing, never the string, so the frame can render every one of
 * them as a ghost and the box is the size of the longest at every width and
 * in every locale. A value with no ghost cannot be written because there is
 * no way to say it.
 */
export interface LiveText<K extends string = string> {
  name: string;
  values: Readonly<Record<K, string>>;
  /** Order the ghosts are rendered in. */
  keys: readonly K[];
  /** What the server renders: the key at the top of the story. */
  initial: K;
  /** Which value shows at `cycT` seconds into the loop. */
  at(cycT: number): K;
}

export interface DemoScene {
  /** The one brand hue this demo wears. */
  hue: DemoHue;
  clock: ClockSpec;
  /** The composition's height at a width and plan; demos.css writes the same
      arithmetic as the pre-hydration placeholder. */
  height(W: number, phone: boolean): number;
  /** Rebuild geometry. Called whenever W, H or the plan changed. */
  layout(env: StageEnv): void;
  /** Draw the loop at `cycT` on a cleared canvas. Nothing else: no DOM, no
      timers, and no memory of the last frame, because the same call draws the
      running loop, the paused board and the reduced-motion frame. */
  draw(env: StageEnv, cycT: number): void;
  /** Where each hotspot sits, as fractions of W and H, parallel to the
      hotspots the figure renders. */
  hotspots?(env: StageEnv): { fx: number; fy: number }[];
  live: readonly LiveText[];
}

export interface StageRefs {
  figure: RefObject<HTMLElement>;
  stage: RefObject<HTMLDivElement>;
  canvas: RefObject<HTMLCanvasElement>;
  /** The live child of each ghost box, by LiveText name. */
  live: RefObject<Map<string, HTMLElement>>;
}

/** The class of a hotspot. The figure's noscript rule hides it and this file
    positions it, so it is declared once. */
export const HOTSPOT = "rd-btn";

/**
 * Run `scene` on the elements in `refs`. `selection` is the hotspot the
 * visitor chose; when it changes, a still board is redrawn, which is how a
 * tap gets an answer on a paused demo.
 */
export function useDemoStage(scene: DemoScene, refs: StageRefs, selection: number): void {
  const select = useRef<((selection: number) => void) | null>(null);
  const latest = useRef(selection);

  useEffect(() => {
    const figureEl = refs.figure.current;
    const frameEl = refs.stage.current;
    const canvas = refs.canvas.current;
    if (!figureEl || !frameEl || !canvas || !canvas.getContext) return;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    let docVisible = !document.hidden;
    let onscreen = false;

    const env: StageEnv = {
      ctx: ctx0,
      W: 0,
      H: 0,
      phone: false,
      pal: readDemoPalette(frameEl, scene.hue),
      selection: latest.current,
    };

    /* The clock is built here and never leaves: a scene sees its reading and
       nothing else. See ./clock.ts for the three defects that is for. */
    const clock = createClock(scene.clock);
    let raf = 0;
    let last = 0;

    /** One frame at the clock's reading: the picture, then the words. The
        text goes straight to the DOM rather than through state, since this
        runs about thirty times a second; React owns each node's initial text
        and never rewrites it, because its children never change. */
    const shown = new Map<string, string>();
    const paint = () => {
      const t = clock.read();
      env.ctx.clearRect(0, 0, env.W, env.H);
      scene.draw(env, t);
      for (const text of scene.live) {
        const key = text.at(t);
        if (shown.get(text.name) === key) continue;
        const node = refs.live.current?.get(text.name);
        if (!node) continue;
        node.textContent = text.values[key];
        shown.set(text.name, key);
      }
    };

    /** Stand on the standing frame. This is reduced motion, it is what a
        paused board shows, and it is the frame the running loop holds on, so
        a demo never has two ideas of what its best frame is. */
    const stand = () => {
      clock.park();
      paint();
    };

    const frame = (now: number) => {
      if (!clock.running()) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 32) return;
      /* the ratio can move under a running loop with no resize and no event */
      if ((window.devicePixelRatio || 1) !== lastDpr) resize();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock.advance(dt);
      paint();
    };

    const canRun = () =>
      shouldAnimate({ reduced: reduceMQ.matches, docVisible, onscreen });
    const start = () => {
      if (clock.running() || !canRun()) return;
      clock.start();
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const halt = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    /* Every listener below asks the same question, canRun(), and answers it
       the same way: animate, or stand on the standing frame. */
    const sync = () => {
      if (canRun()) {
        start();
      } else {
        halt();
        stand();
      }
    };
    select.current = (selection) => {
      env.selection = selection;
      if (!clock.running()) stand();
    };

    /* Keep the hotspots over what they belong to at every width, from the
       geometry the canvas draws with, so they cannot drift. The edge hints
       tell the CSS which way a plate has to open to stay inside the frame. */
    const btns = frameEl.querySelectorAll<HTMLElement>("." + HOTSPOT);
    const positionHotspots = () => {
      const spots = scene.hotspots ? scene.hotspots(env) : [];
      for (let i = 0; i < spots.length && i < btns.length; i++) {
        const { fx, fy } = spots[i];
        btns[i].style.left = (fx * 100).toFixed(2) + "%";
        btns[i].style.top = (fy * 100).toFixed(2) + "%";
        btns[i].dataset.edge =
          (fx < 0.25 ? "left" : fx > 0.75 ? "right" : "") + (fy > 0.58 ? " up" : "");
      }
    };

    /** The figure's content box, which is exactly what demos.css queries: its
        container-type is inline-size and a size query reads the content box,
        so this is the one number both sides judge the plan by. It has to be
        fractional: clientWidth is rounded, which read a real 639.25px box as
        640 and picked the wide plan while the stylesheet stayed on the phone
        one (reviewer s-3b55, BLOCKING 2).

        The authority is the ResizeObserver's contentRect, the LAYOUT content
        box, unaffected by transforms. getBoundingClientRect is the painted
        box: under a scaled ancestor it disagrees with the container query,
        and subtracting unscaled padding from a scaled rect is not arithmetic
        (cross-vendor review, hq-3pfhe.6). The rect survives only as the
        reading before the observer has spoken, which is the synchronous
        mount, and the observer's first callback corrects it. */
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

    let lastDpr = window.devicePixelRatio || 1;
    const resize = () => {
      /* The drawing width is the canvas's own LAYOUT box. clientWidth is the
         right tool for exactly this and the wrong one for the plan: it is an
         integer, which is all a pixel grid needs, and it is a layout measure,
         so it is the box the canvas's coordinate system is stretched across.
         The painted width under a scaled ancestor would draw a 321px
         composition into a 642px box. A transform is paint; the coordinate
         system is layout. */
      env.W = Math.max(1, canvas.clientWidth);
      /* The plan is decided on the figure's fractional content box and nothing
         else. It is the same number as W only because .demo-stage adds no
         padding or border, which demos.test.ts holds the stylesheet to. */
      env.phone = isPhonePlan(figureContentWidth());
      /* published, so a probe or a test can hold the plan the component chose
         against the plan the stylesheet applied */
      frameEl.dataset.plan = env.phone ? "phone" : "wide";
      /* the composition sets its own height, so the frame always fits it */
      env.H = scene.height(env.W, env.phone);
      canvas.style.height = env.H + "px";
      env.ctx = fitCanvas(canvas, env.W, env.H);
      lastDpr = window.devicePixelRatio || 1;
      scene.layout(env);
      positionHotspots();
      if (!clock.running()) stand();
    };

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 140);
    };

    /* Device pixel ratio changes without the window resizing: a laptop moved
       to an external monitor, a browser zoomed. Two answers, because neither
       covers the other's case. A resolution media query is the event the
       platform offers, re-armed every time because the query encodes the
       ratio it was built with; it is the only thing that reaches a demo
       standing still. And the running loop compares the ratio itself, one
       property read per frame, which is the half a headless browser can
       demonstrate (state/review/s-0b4b/dpr.mjs and dpr-debug.mjs). */
    let dprMQ: MediaQueryList | null = null;
    const onDpr = () => {
      armDpr();
      resize();
    };
    const armDpr = () => {
      if (dprMQ) dprMQ.removeEventListener("change", onDpr);
      dprMQ = window.matchMedia("(resolution: " + (window.devicePixelRatio || 1) + "dppx)");
      dprMQ.addEventListener("change", onDpr);
    };

    const onVisibility = () => {
      docVisible = !document.hidden;
      sync();
    };
    const onMode = () => {
      env.pal = readDemoPalette(frameEl, scene.hue);
      if (!clock.running()) stand();
    };

    resize();
    armDpr();

    /* The observer is installed whatever the motion preference is. Being on
       screen is a fact about the page, not an animation setting, and only
       canRun() consults the preference. Building it inside the reduced-motion
       branch is what left a page loaded under reduce frozen for the rest of
       its life, in round one and again in the s-5836 loophole demo. */
    const unobserve = observeOnscreen(frameEl, (on) => {
      onscreen = on;
      sync();
    });

    /* Width can change without the window resizing: a demo in a column that
       reflows, a panel opening beside it. Height changes are ignored, because
       resize() sets the canvas height itself and answering that would loop. */
    let roW = Math.round(figureContentWidth());
    let roSeen = false;
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        const exact = entries[entries.length - 1].contentRect.width;
        contentW = exact;
        const w = Math.round(exact);
        /* The first delivery always re-runs the layout, synchronously. The
           mount measured through the rect, the painted box, so under a
           transformed ancestor it may have chosen the wrong plan outright;
           routing the correction through the debounce leaves the board on the
           wrong stylesheet for that long. One extra redraw per mount. */
        if (!roSeen) {
          roSeen = true;
          roW = w;
          resize();
          return;
        }
        /* After that, rounding is enough to ignore sub-pixel churn, except
           across the breakpoint, where 639.6 and 640.2 round to the same
           integer and are different plans. */
        if (w === roW && isPhonePlan(exact) === env.phone) return;
        roW = w;
        onResize();
      });
      /* the figure, because that is the box the plan is decided on */
      ro.observe(figureEl);
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMQ.addEventListener("change", sync);
    window.addEventListener("cardon-mode", onMode);

    return () => {
      halt();
      clock.park();
      select.current = null;
      unobserve();
      if (ro) ro.disconnect();
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMQ.removeEventListener("change", sync);
      window.removeEventListener("cardon-mode", onMode);
      if (dprMQ) dprMQ.removeEventListener("change", onDpr);
    };
    /* refs are stable objects; the scene is the only thing that remounts */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  /* A selection has to show on the board too, and on a still board nothing
     is going to redraw it on its own. */
  useEffect(() => {
    latest.current = selection;
    select.current?.(selection);
  }, [selection]);
}
