"use client";

import { useEffect, useRef } from "react";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { enkanto } from "@/lib/i18n/enkanto";
import {
  clamp01,
  easeInOut,
  fitCanvas,
  line,
  makeTrace,
  MONO,
  pointAtLen,
  readPalette,
  strokeTraceUpTo,
  type Palette,
  type Pt,
  type Trace,
} from "../home/canvasKit";

/**
 * Signature visual for the Vinedo En'kanto case study: a quiet chart panel
 * where three labeled revenue lines (Wine sales, Stays, Restaurant) rise gently
 * against a faint, dipping backdrop line labeled "Valle visitor flow, the
 * season". The lines are drawn slowly, left to right, direction only, with no
 * y-axis numbers (the panel is labeled "direction, not scale"). Hover or focus a
 * line to raise a readout plate naming the work bound to that line: shop and
 * cross-border shipping for wine, listing and booking flow for the stays,
 * reservations and follow-up for the restaurant.
 *
 * Adjacency only: the chart states the work and states the season, side by side,
 * and claims no causation. There are no numbers because there is no scale.
 *
 * One source of truth for the composition: a single fluid layout computed from
 * the MEASURED canvas size in CSS pixels. The plot bounds track the frame at
 * every width (no reserved empty band, no letterbox), the station labels stay a
 * fixed legible size, and the backdrop caption wraps to two lines only when the
 * frame is narrow. The frame height is set in CSS (a width-driven clamp) and the
 * plot fills whatever height it is given, so there is no dead band from 320 to
 * 1440.
 *
 * Same engineering rails as the other client visuals: rAF throttled, DPR capped
 * at 2 via fitCanvas, IntersectionObserver + visibilitychange pausing, resolved
 * to a static finished frame under prefers-reduced-motion, and the palette
 * re-read on the "cardon-mode" event.
 */

type ColorKey = "primary" | "secondary" | "energy";

type SeriesKey = "wine" | "stays" | "restaurant";

type Series = {
  key: SeriesKey;
  from: number;
  to: number;
  amp: number;
  phase: number;
  colorKey: ColorKey;
};

/* Three rising lines. Values are direction only, not scale: the vertical
   position carries no magnitude, so there are no axis numbers. Each line starts
   low on the left and rises to a distinct height on the right so the labels do
   not collide. */
const SERIES: Series[] = [
  {
    key: "wine",
    from: 0.2,
    to: 0.82,
    amp: 0.028,
    phase: 0.6,
    colorKey: "primary",
  },
  {
    key: "stays",
    from: 0.15,
    to: 0.62,
    amp: 0.024,
    phase: 2.1,
    colorKey: "secondary",
  },
  {
    key: "restaurant",
    from: 0.1,
    to: 0.46,
    amp: 0.02,
    phase: 3.4,
    colorKey: "energy",
  },
];

/* faint backdrop: the Valle's overall visitor flow, dipping across the season */
const BACK_FROM = 0.72;
const BACK_TO = 0.32;

const N = 46;

const seriesValAt = (sdef: Series, t: number) =>
  sdef.from +
  (sdef.to - sdef.from) * Math.pow(clamp01(t), 0.86) +
  sdef.amp * Math.sin(t * 3.1 * Math.PI + sdef.phase) * (0.35 + 0.65 * t);

type Hot = {
  key: string;
  fx: number;
  fy: number;
  name: string;
  status: string;
  action: string;
  label: string;
};

/* SSR / pre-measure default positions; positionHots() overrides them with the
   real line ends once the fluid layout is computed. */
function buildHots(t: ThreeLinesDict): Hot[] {
  return SERIES.map((sdef) => {
    const s = t.series[sdef.key];
    return {
      key: sdef.key,
      fx: 0.8,
      fy: 0.86 - 0.6 * clamp01(sdef.to),
      name: s.label,
      status: t.status,
      action: s.work,
      label: t.hotLabel.replace("{name}", s.label).replace("{work}", s.work),
    };
  });
}

type ThreeLinesDict = (typeof enkanto)["en"]["vis"];

/* timeline (seconds): the lines draw in slowly, then settle and hold */
const DRAW_DUR = 5.0;

type Layout = {
  PLm: number;
  PRm: number;
  PTm: number;
  PBm: number;
  W: number;
  H: number;
  ym: (v: number) => number;
  traces: Trace[];
  back: Trace;
  twoLine: boolean;
};

export default function ThreeLines() {
  const t = useDict(enkanto).vis;
  const hotSpots = buildHots(t);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const plateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const plate = plateRef.current;
    if (!stage || !canvas || !plate || !canvas.getContext) return;

    const spName = plate.querySelector(".sp-name");
    const spStatus = plate.querySelector(".sp-status");
    const spAction = plate.querySelector(".sp-action");
    if (!spName || !spStatus || !spAction) return;

    let ctx = fitCanvas(canvas, 1, 1);

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;
    let PAL: Palette = readPalette(root);

    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let clock = 0;
    let settled = false;

    const font = (px: number, weight?: number) =>
      (weight ? weight + " " : "") + px + "px " + MONO;

    const col = (k: ColorKey) =>
      k === "primary" ? PAL.primary : k === "secondary" ? PAL.secondary : PAL.energy;

    const curP = () =>
      reduced() ? 1 : settled ? 1 : clamp01(clock / DRAW_DUR);

    /* single fluid layout: bounds computed from the measured frame in CSS px, so
       the plot fills whatever width and height the frame has */
    let LB: Layout = {
      PLm: 0,
      PRm: 0,
      PTm: 0,
      PBm: 0,
      W: 0,
      H: 0,
      ym: (v) => v,
      traces: [],
      back: makeTrace([{ x: 0, y: 0 }]),
      twoLine: false,
    };

    const layout = (W: number, H: number) => {
      const PLm = Math.max(20, Math.round(W * 0.05));
      /* reserve room on the right for the longest line label ("Restaurant") at
         the fixed 15px size, clamped so it never eats the plot on a phone */
      const reserve = Math.max(116, Math.min(152, Math.round(W * 0.19)));
      const PRm = Math.max(PLm + 60, W - reserve);
      const PTm = 78; // below the two-line legend
      const PBm = H - 54; // above the bottom-right honest caption
      const xm = (t: number) => PLm + clamp01(t) * (PRm - PLm);
      const ym = (v: number) => PBm - clamp01(v) * (PBm - PTm);
      const traces = SERIES.map((sdef) => {
        const pts: Pt[] = [];
        for (let i = 0; i < N; i++) {
          const t = i / (N - 1);
          pts.push({ x: xm(t), y: ym(seriesValAt(sdef, t)) });
        }
        return makeTrace(pts);
      });
      const bpts: Pt[] = [];
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        const base = BACK_FROM + (BACK_TO - BACK_FROM) * t;
        const wig = 0.018 * Math.sin(t * 2.2 * Math.PI + 1.2);
        bpts.push({ x: xm(t), y: ym(base + wig) });
      }
      LB = {
        PLm,
        PRm,
        PTm,
        PBm,
        W,
        H,
        ym,
        traces,
        back: makeTrace(bpts),
        twoLine: W < 640,
      };
    };

    const draw = (progress: number) => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      const { PLm, PBm, PTm, W, ym, traces, back, twoLine } = LB;
      const p = easeInOut(clamp01(progress));

      ctx.lineWidth = 1.4;
      ctx.strokeStyle = PAL.lineSoft;
      line(ctx, PLm, PTm - 6, PLm, PBm);
      line(ctx, PLm, PBm, W - 8, PBm);

      ctx.save();
      ctx.setLineDash([5, 7]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = PAL.muted;
      ctx.globalAlpha = 0.55;
      strokeTraceUpTo(ctx, back, back.len * p);
      ctx.restore();

      /* backdrop caption: two lines when the frame is narrow, one when wide */
      const bla = clamp01((progress - 0.08) / 0.2);
      if (bla > 0.01) {
        ctx.globalAlpha = bla * 0.9;
        ctx.font = font(13);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = PAL.muted;
        const lx = PLm + 10;
        const ly = ym(BACK_FROM) - 12;
        if (twoLine) {
          ctx.fillText(t.backdropL1, lx, ly - 15);
          ctx.fillText(t.backdropL2, lx, ly);
        } else {
          ctx.fillText(t.backdropOne, lx, ly);
        }
        ctx.globalAlpha = 1;
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      traces.forEach((tr, i) => {
        ctx.lineWidth = 2.8;
        ctx.strokeStyle = col(SERIES[i].colorKey);
        strokeTraceUpTo(ctx, tr, tr.len * p);
      });

      if (progress < 0.999) {
        traces.forEach((tr, i) => {
          const tip = pointAtLen(tr, tr.len * p);
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, 3.6, 0, Math.PI * 2);
          ctx.fillStyle = col(SERIES[i].colorKey);
          ctx.fill();
        });
      }

      const la = clamp01((progress - 0.8) / 0.2);
      if (la > 0.01) {
        ctx.globalAlpha = la;
        traces.forEach((tr, i) => {
          const end = tr.pts[tr.pts.length - 1];
          ctx.beginPath();
          ctx.arc(end.x, end.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = col(SERIES[i].colorKey);
          ctx.fill();
          ctx.font = font(15, 600);
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillStyle = col(SERIES[i].colorKey);
          ctx.fillText(t.series[SERIES[i].key].label, end.x + 12, end.y);
        });
        ctx.globalAlpha = 1;
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 40) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.06) dt = 0.06;
      clock += dt;
      const progress = clamp01(clock / DRAW_DUR);
      draw(progress);
      if (progress >= 1) {
        settled = true;
        stop();
      }
    };

    const canRun = () => !reduced() && docVisible && onscreen;
    const start = () => {
      if (running || !canRun()) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    function stop() {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    /* keep the DOM hotspots aligned to the live line ends */
    const hots = Array.prototype.slice.call(
      stage.querySelectorAll(".tl-hot")
    ) as HTMLElement[];
    const positionHots = () => {
      hots.forEach((h, i) => {
        const tr = LB.traces[i];
        let fx: number;
        let fy: number;
        if (tr && LB.W && LB.H) {
          const end = tr.pts[tr.pts.length - 1];
          fx = end.x / LB.W;
          fy = end.y / LB.H;
        } else {
          fx = hotSpots[i].fx;
          fy = hotSpots[i].fy;
        }
        h.style.left = fx * 100 + "%";
        h.style.top = fy * 100 + "%";
        h.dataset.fx = String(fx);
        h.dataset.fy = String(fy);
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const W = Math.max(1, Math.round(rect.width));
      const H = Math.max(1, Math.round(rect.height));
      ctx = fitCanvas(canvas, W, H);
      layout(W, H);
      positionHots();
      draw(curP());
    };

    /* readout plate on hover / focus of the DOM hotspots */
    const showPlate = (hot: HTMLElement) => {
      const fx = parseFloat(hot.getAttribute("data-fx") || "0");
      const fy = parseFloat(hot.getAttribute("data-fy") || "0");
      spName.textContent = hot.getAttribute("data-name") || "";
      spStatus.textContent = hot.getAttribute("data-status") || "";
      spAction.textContent = hot.getAttribute("data-action") || "";
      const rect = stage.getBoundingClientRect();
      plate.classList.add("show");
      const pw = plate.offsetWidth;
      const ph = plate.offsetHeight;
      const px = fx * rect.width;
      const py = fy * rect.height;
      const pad = 8;
      let left = px;
      let top = py - ph - 16;
      const half = pw / 2;
      if (left < half + pad) left = half + pad;
      if (left > rect.width - half - pad) left = rect.width - half - pad;
      if (top < pad) top = py + 18;
      if (top + ph > rect.height - pad) top = rect.height - ph - pad;
      plate.style.left = left + "px";
      plate.style.top = top + "px";
    };
    const hidePlate = () => plate.classList.remove("show");

    const hotCleanups: Array<() => void> = [];
    hots.forEach((h) => {
      const on = () => showPlate(h);
      const off = () => hidePlate();
      h.addEventListener("mouseenter", on);
      h.addEventListener("mouseleave", off);
      h.addEventListener("focus", on);
      h.addEventListener("blur", off);
      hotCleanups.push(() => {
        h.removeEventListener("mouseenter", on);
        h.removeEventListener("mouseleave", off);
        h.removeEventListener("focus", on);
        h.removeEventListener("blur", off);
      });
    });

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 140);
    };
    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible && onscreen) {
        if (reduced()) draw(1);
        else start();
      } else {
        stop();
      }
    };
    const onMode = () => {
      PAL = readPalette(root);
      draw(curP());
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        draw(1);
      } else {
        clock = 0;
        settled = false;
        if (onscreen && docVisible) start();
      }
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (en) => {
          onscreen = en[0].isIntersecting;
          if (onscreen && docVisible) {
            if (reduced()) {
              draw(1);
            } else {
              /* replay the draw-in each time the panel returns to view */
              if (settled) {
                clock = 0;
                settled = false;
              }
              start();
            }
          } else {
            stop();
          }
        },
        { threshold: 0.14 }
      );
      io.observe(stage);
    } else {
      onscreen = true;
    }

    /* measured-size source of truth: relayout whenever the frame resizes */
    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(() => onResize());
      ro.observe(stage);
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("cardon-mode", onMode);
    reduceMQ.addEventListener("change", onReduceChange);

    resize();
    if (reduced()) {
      draw(1);
    } else if (!("IntersectionObserver" in window)) {
      start();
    }

    return () => {
      stop();
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      hotCleanups.forEach((fn) => fn());
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cardon-mode", onMode);
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, []);

  return (
    <div className="lines-showcase">
      <div className="tl-stage" ref={stageRef}>
        <div className="tl-legend mono">
          <span className="tl-legend-main">{t.legendMain}</span>
          <span className="tl-legend-sub">{t.legendSub}</span>
        </div>
        <span className="tl-honest mono">{t.honest}</span>

        <canvas className="tl-canvas" ref={canvasRef} aria-hidden="true" />

        {hotSpots.map((h) => (
          <button
            key={h.key}
            type="button"
            className="tl-hot"
            data-fx={h.fx}
            data-fy={h.fy}
            data-name={h.name}
            data-status={h.status}
            data-action={h.action}
            style={{ left: h.fx * 100 + "%", top: h.fy * 100 + "%" }}
            aria-label={h.label}
          >
            <span className="sr-only">{h.label}</span>
          </button>
        ))}

        <div className="tl-plate" ref={plateRef} aria-hidden="true">
          <span className="sp-name">{t.series.wine.label}</span>
          <span className="sp-status">{t.plateStatus}</span>
          <span className="sp-action">{t.plateAction}</span>
        </div>

        <noscript>
          <div className="tl-fallback">{t.fallback}</div>
        </noscript>
      </div>

      <p className="tl-caption mono">{t.caption}</p>
    </div>
  );
}
