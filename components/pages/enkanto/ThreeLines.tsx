"use client";

import { useEffect, useRef } from "react";
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
 * Two purpose-made compositions share one canvas and one rAF loop. On wide
 * screens the desktop layout draws in a 1000x560 design space scaled to fit. On
 * narrow portrait screens (< 520px measured) a mobile layout is computed in CSS
 * pixels instead: the plot fills the taller frame, reserves the right margin for
 * phone-legible line labels, and the backdrop caption wraps to two lines. The
 * mode is chosen by matchMedia and re-evaluated on change; only one layout is
 * ever drawn or animated at a time.
 *
 * Same engineering rails as the other client visuals: rAF throttled, DPR capped
 * at 2 via fitCanvas, IntersectionObserver + visibilitychange pausing, resolved
 * to a static finished frame under prefers-reduced-motion, and the palette
 * re-read on the "cardon-mode" event.
 */

const DW = 1000;
const DH = 560;

/* plot bounds in design coordinates; the right margin leaves room for the line
   labels, and the baseline runs under them */
const PL = 112;
const PR = 806;
const PT = 104;
const PB = 452;

const xmap = (t: number) => PL + clamp01(t) * (PR - PL);
const ymap = (v: number) => PB - clamp01(v) * (PB - PT);

type ColorKey = "primary" | "secondary" | "energy";

type Series = {
  key: string;
  label: string;
  work: string;
  from: number;
  to: number;
  amp: number;
  phase: number;
  hotT: number;
  colorKey: ColorKey;
};

/* Three rising lines. Values are direction only, not scale: the vertical
   position carries no magnitude, so there are no axis numbers. Each line starts
   low on the left and rises to a distinct height on the right so the labels do
   not collide. */
const SERIES: Series[] = [
  {
    key: "wine",
    label: "Wine sales",
    work: "shop and cross-border shipping",
    from: 0.2,
    to: 0.82,
    amp: 0.028,
    phase: 0.6,
    hotT: 0.42,
    colorKey: "primary",
  },
  {
    key: "stays",
    label: "Stays",
    work: "listing and booking flow",
    from: 0.15,
    to: 0.62,
    amp: 0.024,
    phase: 2.1,
    hotT: 0.68,
    colorKey: "secondary",
  },
  {
    key: "restaurant",
    label: "Restaurant",
    work: "reservations and follow-up",
    from: 0.1,
    to: 0.46,
    amp: 0.02,
    phase: 3.4,
    hotT: 0.9,
    colorKey: "energy",
  },
];

/* faint backdrop: the Valle's overall visitor flow, dipping across the season */
const BACK_FROM = 0.72;
const BACK_TO = 0.32;

const N = 46;

const MOBILE_MQ = "(max-width: 519.98px)";

const seriesValAt = (sdef: Series, t: number) =>
  sdef.from +
  (sdef.to - sdef.from) * Math.pow(clamp01(t), 0.86) +
  sdef.amp * Math.sin(t * 3.1 * Math.PI + sdef.phase) * (0.35 + 0.65 * t);

function riseTrace(sdef: Series): Trace {
  const pts: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    pts.push({ x: xmap(t), y: ymap(seriesValAt(sdef, t)) });
  }
  return makeTrace(pts);
}

function backTrace(): Trace {
  const pts: Pt[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const base = BACK_FROM + (BACK_TO - BACK_FROM) * t;
    const wig = 0.018 * Math.sin(t * 2.2 * Math.PI + 1.2);
    pts.push({ x: xmap(t), y: ymap(base + wig) });
  }
  return makeTrace(pts);
}

const SERIES_TRACES: Trace[] = SERIES.map(riseTrace);
const BACKDROP: Trace = backTrace();

type Hot = {
  key: string;
  fx: number;
  fy: number;
  name: string;
  status: string;
  action: string;
  label: string;
};

const HOTS: Hot[] = SERIES.map((sdef) => {
  const v = seriesValAt(sdef, sdef.hotT);
  return {
    key: sdef.key,
    fx: xmap(sdef.hotT) / DW,
    fy: ymap(v) / DH,
    name: sdef.label,
    status: "kept growing through the season",
    action: sdef.work,
    label:
      sdef.label +
      " kept growing through the season. The work beside it: " +
      sdef.work +
      ".",
  };
});

/* timeline (seconds): the lines draw in slowly, then settle and hold */
const DRAW_DUR = 5.0;

export default function ThreeLines() {
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
    const modeMQ = window.matchMedia(MOBILE_MQ);
    let mobile = modeMQ.matches;
    let docVisible = !document.hidden;
    let PAL: Palette = readPalette(root);

    let s = 1;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let clock = 0;
    let settled = false;

    /* mobile layout, recomputed on resize (CSS-pixel space, no design scale) */
    let mTraces: Trace[] = [];
    let mBack: Trace = BACKDROP;
    let mB = { PLm: 0, PRm: 0, PTm: 0, PBm: 0, W: 0, H: 0 };
    const mxmap = (PLm: number, PRm: number) => (t: number) =>
      PLm + clamp01(t) * (PRm - PLm);
    const mymap = (PTm: number, PBm: number) => (v: number) =>
      PBm - clamp01(v) * (PBm - PTm);

    const font = (px: number, weight?: number) =>
      (weight ? weight + " " : "") + px + "px " + MONO;

    const col = (k: ColorKey) =>
      k === "primary" ? PAL.primary : k === "secondary" ? PAL.secondary : PAL.energy;

    const curP = () =>
      reduced() ? 1 : settled ? 1 : clamp01(clock / DRAW_DUR);

    const layoutMobile = (W: number, H: number) => {
      const PLm = 22;
      const labelReserve = 116; // room for the right-side line labels
      const PRm = Math.max(PLm + 40, W - labelReserve);
      const PTm = 70; // below the top-left legend
      const PBm = H - 52; // above the bottom-right honest caption
      const xm = mxmap(PLm, PRm);
      const ym = mymap(PTm, PBm);
      mTraces = SERIES.map((sdef) => {
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
      mBack = makeTrace(bpts);
      mB = { PLm, PRm, PTm, PBm, W, H };
    };

    /* ---- desktop draw: 1000x560 design space scaled by s ---- */
    const drawDesktop = (progress: number) => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.save();
      ctx.scale(s, s);

      const p = easeInOut(clamp01(progress));

      ctx.lineWidth = 1.4;
      ctx.strokeStyle = PAL.lineSoft;
      line(ctx, PL, PT - 6, PL, PB);
      line(ctx, PL, PB, PR + 150, PB);

      ctx.save();
      ctx.setLineDash([5, 7]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = PAL.muted;
      ctx.globalAlpha = 0.55;
      strokeTraceUpTo(ctx, BACKDROP, BACKDROP.len * p);
      ctx.restore();

      const bla = clamp01((progress - 0.08) / 0.2);
      if (bla > 0.01) {
        ctx.globalAlpha = bla * 0.9;
        ctx.font = font(12.5);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = PAL.muted;
        ctx.fillText("Valle visitor flow, the season", PL + 12, ymap(BACK_FROM) - 12);
        ctx.globalAlpha = 1;
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      SERIES_TRACES.forEach((tr, i) => {
        ctx.lineWidth = 2.6;
        ctx.strokeStyle = col(SERIES[i].colorKey);
        strokeTraceUpTo(ctx, tr, tr.len * p);
      });

      if (progress < 0.999) {
        SERIES_TRACES.forEach((tr, i) => {
          const tip = pointAtLen(tr, tr.len * p);
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, 3.4, 0, Math.PI * 2);
          ctx.fillStyle = col(SERIES[i].colorKey);
          ctx.fill();
        });
      }

      const la = clamp01((progress - 0.8) / 0.2);
      if (la > 0.01) {
        ctx.globalAlpha = la;
        SERIES_TRACES.forEach((tr, i) => {
          const end = tr.pts[tr.pts.length - 1];
          ctx.beginPath();
          ctx.arc(end.x, end.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = col(SERIES[i].colorKey);
          ctx.fill();
          ctx.font = font(14, 600);
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillStyle = col(SERIES[i].colorKey);
          ctx.fillText(SERIES[i].label, end.x + 12, end.y);
        });
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    };

    /* ---- mobile draw: portrait layout in CSS pixels ---- */
    const drawMobile = (progress: number) => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      const { PLm, PRm, PTm, PBm, W } = mB;
      const ym = mymap(PTm, PBm);
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
      strokeTraceUpTo(ctx, mBack, mBack.len * p);
      ctx.restore();

      /* backdrop caption, wrapped to two lines above where the season starts */
      const bla = clamp01((progress - 0.08) / 0.2);
      if (bla > 0.01) {
        ctx.globalAlpha = bla * 0.9;
        ctx.font = font(12);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = PAL.muted;
        const lx = PLm + 10;
        const ly = ym(BACK_FROM) - 12;
        ctx.fillText("Valle visitor flow,", lx, ly - 14);
        ctx.fillText("the season", lx, ly);
        ctx.globalAlpha = 1;
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      mTraces.forEach((tr, i) => {
        ctx.lineWidth = 2.8;
        ctx.strokeStyle = col(SERIES[i].colorKey);
        strokeTraceUpTo(ctx, tr, tr.len * p);
      });

      if (progress < 0.999) {
        mTraces.forEach((tr, i) => {
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
        mTraces.forEach((tr, i) => {
          const end = tr.pts[tr.pts.length - 1];
          ctx.beginPath();
          ctx.arc(end.x, end.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = col(SERIES[i].colorKey);
          ctx.fill();
          ctx.font = font(15, 600);
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillStyle = col(SERIES[i].colorKey);
          ctx.fillText(SERIES[i].label, end.x + 12, end.y);
        });
        ctx.globalAlpha = 1;
      }
      void PRm;
    };

    const draw = (progress: number) =>
      mobile ? drawMobile(progress) : drawDesktop(progress);

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

    /* keep the DOM hotspots aligned to whichever layout is live */
    const hots = Array.prototype.slice.call(
      stage.querySelectorAll(".tl-hot")
    ) as HTMLElement[];
    const positionHots = () => {
      hots.forEach((h, i) => {
        let fx: number;
        let fy: number;
        if (mobile && mTraces[i]) {
          const end = mTraces[i].pts[mTraces[i].pts.length - 1];
          fx = mB.W ? end.x / mB.W : HOTS[i].fx;
          fy = mB.H ? end.y / mB.H : HOTS[i].fy;
        } else {
          fx = HOTS[i].fx;
          fy = HOTS[i].fy;
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
      s = W / DW;
      ctx = fitCanvas(canvas, W, H);
      if (mobile) layoutMobile(W, H);
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
    const onBreakpoint = () => {
      const next = modeMQ.matches;
      if (next === mobile) return;
      mobile = next;
      hidePlate();
      clock = 0;
      settled = false;
      resize();
      if (reduced()) draw(1);
      else if (onscreen && docVisible) start();
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

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("cardon-mode", onMode);
    reduceMQ.addEventListener("change", onReduceChange);
    modeMQ.addEventListener("change", onBreakpoint);

    resize();
    if (reduced()) {
      draw(1);
    } else if (!("IntersectionObserver" in window)) {
      start();
    }

    return () => {
      stop();
      if (io) io.disconnect();
      hotCleanups.forEach((fn) => fn());
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cardon-mode", onMode);
      reduceMQ.removeEventListener("change", onReduceChange);
      modeMQ.removeEventListener("change", onBreakpoint);
    };
  }, []);

  return (
    <div className="lines-showcase">
      <div className="tl-stage" ref={stageRef}>
        <div className="tl-legend mono">
          <span className="tl-legend-main">Three lines vs the season</span>
          <span className="tl-legend-sub">direction, not scale</span>
        </div>
        <span className="tl-honest mono">illustrative direction, not client data</span>

        <canvas className="tl-canvas" ref={canvasRef} aria-hidden="true" />

        {HOTS.map((h) => (
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
          <span className="sp-name">Wine sales</span>
          <span className="sp-status">status</span>
          <span className="sp-action">the work</span>
        </div>

        <noscript>
          <div className="tl-fallback">
            A quiet chart. Three labeled lines, wine sales, stays, and the
            restaurant, rise gently against a faint dipping backdrop line marked
            "Valle visitor flow, the season". It shows direction only, with no
            scale: the three lines grew across a season when the Valle's overall
            flow fell.
          </div>
        </noscript>
      </div>

      <p className="tl-caption mono">
        Wine, stays, and the restaurant rise; the Valle&apos;s visitor flow dips.
        Direction only, side by side, no scale.
      </p>
    </div>
  );
}
