"use client";

import { useEffect, useRef } from "react";
import { clearsThreshold } from "@/lib/onscreen";
import { fitCanvas, hexToRgb, readPalette } from "@/components/pages/home/canvasKit";
import { makeField, type FieldKind, type FieldState } from "./fieldKit";

/**
 * One of the loose animations, drawn straight onto the page with no frame
 * around it (Daniel, 2026-10-01: the animations belong to the page, they do
 * not sit in boxes).
 *
 * `behind` runs under a hero's copy on a wide screen, masked so it fades in
 * to the right of the text, and becomes a band of its own under the copy on a
 * phone, where the title goes first. `band` is always a band in the flow.
 * `fill` takes the whole of its positioned parent and leaves the placement,
 * the mask and the phone arrangement to that parent's stylesheet, which is
 * how a style sample on /estilos puts a drawing where its own design wants it.
 *
 * `colors` hands the drawing a fixed palette of its own in place of the
 * site's. A canvas given one never reads the site tokens, so it keeps its
 * colours when the visitor switches between light and dark.
 *
 * It is decoration: hidden from a screen reader, no text of its own. The
 * house canvas rules apply. The pixel ratio is capped at two, the loop stops
 * when the canvas leaves the screen or the tab is hidden, the colours are
 * read again when the mode changes, and reduced motion gets one still frame.
 */
export interface FieldPalette {
  /** The main line colour, as a hex value. */
  line: string;
  /** The accent a few marks wear, as a hex value. */
  accent: string;
  /** The colour the drawing sits on, as a hex value. Some drawings fill with it. */
  ground: string;
  /** Whether that ground is a dark one. */
  dark: boolean;
}

export default function Field({
  kind,
  layout = "band",
  className,
  colors,
  focus,
  density,
  topInset,
  cover,
}: {
  kind: FieldKind;
  layout?: "behind" | "band" | "fill";
  className?: string;
  /** A fixed palette. Without it the drawing wears the site's and follows the mode. */
  colors?: FieldPalette;
  /** Where the composition centres on a wide canvas, 0 to 1 across its width. */
  focus?: number;
  /** How much of the drawing a wide canvas carries; 1 is the design. A phone
   *  canvas always draws at 1, where a band is already full. */
  density?: number;
  /** Pixels at the top of the window that sticky chrome covers. A canvas that
   *  only shows under that chrome counts as off screen and stops. */
  topInset?: number;
  /** Elements that cover the top of the viewport (a sticky header, a sticky
   *  caption). Their measured heights replace topInset once the page is laid
   *  out, so a caption that wraps to two lines on a phone is counted in full.
   *  Each selector is looked up inside the canvas's own section first. */
  cover?: string[];
}) {
  const coverKey = cover ? cover.join("|") : "";
  const boxRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // The palette is read by value, so a parent that builds the object again on
  // every render does not tear the canvas down.
  const fixed = colors ? [colors.line, colors.accent, colors.ground, colors.dark ? "1" : "0"].join("|") : "";

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;

    const field = makeField(kind);
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let ctx: CanvasRenderingContext2D | null = null;
    let raf = 0;
    let last = 0;
    let running = false;
    let onscreen = false;
    let docVisible = !document.hidden;
    let tpin = 0;
    let tmx = 0;
    let tmy = 0;
    let modeRaf = 0;
    let laidOut = false;
    // The ratio the backing store was sized for. Every frame draws with this
    // one, never with a fresh reading, so a window dragged to a screen of
    // another density is laid out again instead of drawing at the wrong scale.
    const capDpr = () => Math.min(2, window.devicePixelRatio || 1);
    let dpr = capDpr();

    const S: FieldState = {
      W: 1, H: 1, t: 0, dt: 0, mx: 0, my: 0, px: 0, py: 0, rpx: 0, rpy: 0, pin: 0,
      fx: 0, fy: 0, small: false, dens: 1, draw: true, dark: false,
      c: { agave: "#23664A", agaveRgb: [35, 102, 74], gold: "#9A6A12", goldRgb: [154, 106, 18], ground: "#F3EEDF" },
    };

    const readColors = () => {
      if (fixed) {
        const [line, accent, ground, dark] = fixed.split("|");
        S.dark = dark === "1";
        S.c = { agave: line, agaveRgb: hexToRgb(line), gold: accent, goldRgb: hexToRgb(accent), ground };
        return;
      }
      const p = readPalette(document.documentElement);
      S.dark = p.dark;
      S.c = { agave: p.primary, agaveRgb: p.primaryRgb, gold: p.secondary, goldRgb: p.secondaryRgb, ground: p.ground };
    };

    const render = () => {
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, S.W, S.H);
      S.draw = true;
      field.frame(ctx, S);
    };

    // Run the drawing forward without painting, so the first frame shown is a
    // settled one and a still frame is a good one.
    const warm = () => {
      if (!ctx) return;
      const steps = reduced() ? 110 : 70;
      S.t = Math.max(0, field.still - steps / 30);
      S.draw = false;
      for (let i = 0; i < steps; i++) {
        S.dt = 1 / 30;
        S.t += S.dt;
        field.frame(ctx, S);
      }
      S.draw = true;
    };

    const layoutNow = () => {
      const r = box.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      S.W = r.width;
      S.H = r.height;
      dpr = capDpr();
      // The phone composition is decided by the canvas, never by the window.
      S.small = S.W < 700;
      // Behind a hero the copy holds the left, so the drawing centres right of
      // it. The stylesheet decides when the canvas is behind the copy and when
      // it is a band under it, so ask the stylesheet.
      const behindNow = layout === "behind" && getComputedStyle(box).position === "absolute";
      // A canvas that fills a parent of its own centres in that parent: the
      // parent's stylesheet has already put the box where the drawing belongs,
      // so the hero's 0.7 rule is not inherited. `focus` moves the centre on a
      // wide canvas when a scene asks for it; a phone composition stays centred.
      S.dens = density !== undefined && !S.small ? Math.max(0.5, Math.min(2.5, density)) : 1;
      const asked = focus !== undefined && !S.small ? Math.max(0, Math.min(1, focus)) : null;
      S.fx = S.W * (asked !== null ? asked : behindNow ? 0.7 : 0.5);
      S.fy = S.H * 0.5;
      if (!S.pin) {
        S.px = S.fx;
        S.py = S.fy;
        S.rpx = S.fx;
        S.rpy = S.fy;
      }
      ctx = fitCanvas(canvas, S.W, S.H);
      field.init(S);
      // Only the first layout, and a still frame, start from the settled
      // moment. A later resize keeps the clock, so the picture does not jump
      // back every time the window settles.
      if (!laidOut || reduced()) warm();
      laidOut = true;
      render();
    };

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (capDpr() !== dpr) layoutNow();
      const rdt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const k = 1 - Math.exp(-rdt * 3.2);
      S.mx += (tmx - S.mx) * k;
      S.my += (tmy - S.my) * k;
      S.px += (S.rpx - S.px) * k * 1.4;
      S.py += (S.rpy - S.py) * k * 1.4;
      S.pin += (tpin - S.pin) * k;
      S.dt = rdt;
      S.t += rdt;
      render();
    };
    const start = () => {
      if (running || reduced() || !onscreen || !docVisible || !ctx) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // The pointer is read on the window because the canvas sits under the copy
    // and takes no pointer events of its own.
    const onMove = (e: PointerEvent) => {
      if (!onscreen || e.pointerType === "touch") return;
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) {
        tpin = 0;
        tmx = 0;
        tmy = 0;
        return;
      }
      S.rpx = x;
      S.rpy = y;
      tmx = Math.max(-1, Math.min(1, (x / r.width - 0.5) * 2));
      tmy = Math.max(-1, Math.min(1, (y / r.height - 0.5) * 2));
      tpin = 1;
    };

    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible) start();
      else stop();
    };
    const onMode = () => {
      // The attribute is set in the same tick as the event; read after it lands.
      cancelAnimationFrame(modeRaf);
      modeRaf = requestAnimationFrame(() => {
        readColors();
        if (!running) render();
      });
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        warm();
        render();
      } else {
        start();
      }
    };

    let rt = 0;
    // Set below, once the observer exists; a resize re-measures what covers the canvas.
    let watch: () => void = () => {};
    const relayout = () => {
      watch();
      const r = box.getBoundingClientRect();
      if (Math.abs(r.width - S.W) > 1 || Math.abs(r.height - S.H) > 1 || capDpr() !== dpr) layoutNow();
    };
    let ro: ResizeObserver | null = null;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(relayout, 140);
    };
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(onResize);
      ro.observe(box);
      // What covers the canvas can change height with no window resize (a
      // text-size change wraps the caption), so it is watched as well.
      if (cover) {
        const scope = box.closest("section");
        for (const sel of cover) {
          const el = (scope && scope.querySelector(sel)) || document.querySelector(sel);
          if (el) ro.observe(el);
        }
      }
    }
    // The window listener stays even with a ResizeObserver: a change of pixel
    // density leaves the box the same size, and only the window says so.
    window.addEventListener("resize", onResize);

    readColors();
    layoutNow();

    let io: IntersectionObserver | null = null;
    let inset = -1;
    const coverNow = () => {
      if (!cover || !cover.length) return Math.round(topInset || 0);
      const scope = box.closest("section");
      let sum = 0;
      for (const sel of cover) {
        const el = (scope && scope.querySelector(sel)) || document.querySelector(sel);
        if (el) sum += el.getBoundingClientRect().height;
      }
      return Math.round(sum > 0 ? sum : topInset || 0);
    };
    // The observer is rebuilt when what covers the canvas changes height, so
    // "on screen" always means below the header and the caption.
    watch = () => {
      if (!("IntersectionObserver" in window)) return;
      const next = coverNow();
      if (io && next === inset) return;
      inset = next;
      if (io) io.disconnect();
      io = new IntersectionObserver(
        (en) => {
          onscreen = clearsThreshold(en[en.length - 1], 0.04);
          if (onscreen) start();
          else stop();
        },
        inset ? { threshold: 0.04, rootMargin: "-" + inset + "px 0px 0px 0px" } : { threshold: 0.04 },
      );
      io.observe(box);
    };
    watch();
    // A browser with no IntersectionObserver cannot tell when the canvas has
    // left the screen, so it keeps the still frame layoutNow already painted
    // instead of a loop that would never stop.

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    // A canvas with a palette of its own has nothing to read on a mode change.
    if (!fixed) window.addEventListener("cardon-mode", onMode);
    // Safari before 14 has only the older addListener on a media query list,
    // and a throw here would leave every listener above installed for good.
    if (typeof reduceMQ.addEventListener === "function") reduceMQ.addEventListener("change", onReduceChange);
    else if (typeof reduceMQ.addListener === "function") reduceMQ.addListener(onReduceChange);

    return () => {
      stop();
      cancelAnimationFrame(modeRaf);
      window.clearTimeout(rt);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cardon-mode", onMode);
      if (typeof reduceMQ.removeEventListener === "function") reduceMQ.removeEventListener("change", onReduceChange);
      else if (typeof reduceMQ.removeListener === "function") reduceMQ.removeListener(onReduceChange);
    };
    // coverKey stands in for cover: the same selectors in a new array must not restart the canvas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind, layout, fixed, focus, density, topInset, coverKey]);

  return (
    <div
      ref={boxRef}
      className={"field field-" + layout + " field-" + kind + (className ? " " + className : "")}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
