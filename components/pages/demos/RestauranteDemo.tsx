"use client";

import { useEffect, useRef, useState } from "react";
import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import {
  clamp01,
  easeInOut,
  fitCanvas,
  line,
  mix,
  MONO,
  readDemoPalette,
  rgba,
  rr,
  type DemoPalette,
} from "./palette";

/**
 * Restaurante: a dining room filling across one service (bead hq-3pfhe.1).
 *
 * Recovered from components/pages/restaurants/FloorPlan.tsx, which commit
 * 1fcb7e7 deleted along with the restaurants sector page. It is the demo the
 * other two are built to, so what it does is worth stating plainly.
 *
 * A slow clock strip runs one service, 17:00 to 23:00. Reservations arrive as
 * chips that travel from the entrance and dock onto their table; a table warms
 * as it seats and cools as it turns. Underneath, a load line tracks covers
 * over the evening, and an hour before the peak a calm marker shows the rush
 * arriving, which is the whole argument the module makes: a full room is a
 * pattern you can see coming, not a surprise that lands on the floor.
 *
 * What it costs to run, and when it does not run at all. One canvas, one
 * requestAnimationFrame loop throttled to about 30fps, device pixel ratio
 * capped at 2 so a phone never rasterises four times the pixels it can show.
 * It is paused while off screen (IntersectionObserver) and while the tab is
 * hidden, and under prefers-reduced-motion it never starts: it resolves to a
 * static peak-service frame instead, which is also what a paused instance
 * shows. No dependency beyond React, no network call, no image.
 *
 * Colour comes from components/pages/demos/palette.ts, which reads the live
 * theme tokens, so the demo recolours with the mode toggle instead of sitting
 * on the page as an embedded screenshot in last mode's colours. Light is the
 * default the site ships and the mode this was tuned in.
 *
 * Every number on this floor is invented. The frame says so.
 */

/* ------------------------------ THE FLOOR ------------------------------ */

type TableKind =
  | "twoWindow"
  | "fourCenter"
  | "banquette"
  | "fourLower"
  | "largeTop"
  | "twoLower";

type Shape = "round" | "square" | "rectH" | "rectV";

/** s: the minute of the service the party is seated, 0 being 17:00. d: how
    long they hold the table. p: how many of them there are. */
interface Reservation {
  s: number;
  d: number;
  p: number;
}

/** Where a table sits: fx as a fraction of the canvas width, fy as a fraction
    of the room band's height. Two of these per table, because a phone is not a
    narrow desktop. */
interface Spot {
  fx: number;
  fy: number;
}

interface TableDef {
  kind: TableKind;
  shape: Shape;
  seats: number;
  res: Reservation[];
  /** 640px and up: the room as it was drawn, a window row, a centre block, a
      banquette on the right wall and a lower room. */
  wide: Spot;
  /** Under 640px: the same twelve tables reflowed into three columns and four
      rows, with the entrance moved to the bottom of the left wall. The room
      gets taller rather than the tables getting smaller, because a floor plan
      whose tables are 9px across is a picture of a floor plan. */
  phone: Spot;
}

const TABLES: TableDef[] = [
  { kind: "twoWindow", shape: "round", seats: 2, res: [{ s: 25, d: 80, p: 2 }, { s: 150, d: 80, p: 2 }], wide: { fx: 0.15, fy: 0.16 }, phone: { fx: 0.2, fy: 0.11 } },
  { kind: "twoWindow", shape: "round", seats: 2, res: [{ s: 55, d: 75, p: 2 }, { s: 175, d: 70, p: 2 }], wide: { fx: 0.29, fy: 0.16 }, phone: { fx: 0.5, fy: 0.11 } },
  { kind: "twoWindow", shape: "round", seats: 2, res: [{ s: 85, d: 80, p: 2 }], wide: { fx: 0.43, fy: 0.16 }, phone: { fx: 0.8, fy: 0.11 } },
  { kind: "twoWindow", shape: "round", seats: 2, res: [{ s: 110, d: 80, p: 2 }, { s: 215, d: 65, p: 2 }], wide: { fx: 0.57, fy: 0.16 }, phone: { fx: 0.2, fy: 0.33 } },
  { kind: "fourCenter", shape: "square", seats: 4, res: [{ s: 40, d: 95, p: 4 }, { s: 165, d: 90, p: 3 }], wide: { fx: 0.16, fy: 0.515 }, phone: { fx: 0.5, fy: 0.33 } },
  { kind: "fourCenter", shape: "square", seats: 4, res: [{ s: 70, d: 95, p: 4 }], wide: { fx: 0.3, fy: 0.515 }, phone: { fx: 0.2, fy: 0.55 } },
  { kind: "fourCenter", shape: "square", seats: 4, res: [{ s: 95, d: 100, p: 4 }, { s: 210, d: 85, p: 4 }], wide: { fx: 0.45, fy: 0.515 }, phone: { fx: 0.5, fy: 0.55 } },
  { kind: "fourCenter", shape: "square", seats: 4, res: [{ s: 125, d: 95, p: 4 }], wide: { fx: 0.6, fy: 0.515 }, phone: { fx: 0.8, fy: 0.55 } },
  { kind: "banquette", shape: "rectV", seats: 6, res: [{ s: 90, d: 120, p: 6 }], wide: { fx: 0.85, fy: 0.343 }, phone: { fx: 0.81, fy: 0.33 } },
  { kind: "fourLower", shape: "square", seats: 4, res: [{ s: 135, d: 95, p: 4 }], wide: { fx: 0.19, fy: 0.86 }, phone: { fx: 0.2, fy: 0.77 } },
  { kind: "largeTop", shape: "rectH", seats: 6, res: [{ s: 150, d: 110, p: 5 }], wide: { fx: 0.42, fy: 0.86 }, phone: { fx: 0.5, fy: 0.77 } },
  { kind: "twoLower", shape: "round", seats: 2, res: [{ s: 60, d: 75, p: 2 }, { s: 175, d: 72, p: 2 }], wide: { fx: 0.62, fy: 0.86 }, phone: { fx: 0.8, fy: 0.77 } },
];

/** Minutes across the service, 17:00 to 23:00. */
const SERVICE = 360;

/** The loop: a beat before the evening starts, the evening itself, a hold on
    the full room, then a short dip into the reset so the seam is not a jump. */
const INTRO = 1.8;
const RUN = 30;
const HOLD = 5.5;
const FADE = 1.2;
const CYCLE = INTRO + RUN + HOLD + FADE;

function clockLabel(m: number): string {
  let mm = Math.round(m / 5) * 5;
  if (mm > SERVICE) mm = SERVICE;
  const h = 17 + Math.floor(mm / 60);
  const r = mm % 60;
  return h + ":" + (r < 10 ? "0" + r : r);
}

/** The covers curve for the whole service, its peak, and the minute the calm
    marker sits on. Pure arithmetic over TABLES, so it is computed once for the
    module rather than once per mount. */
const COV = new Float32Array(SERVICE + 1);
let peakV = 1;
let peakT = 0;
for (let t = 0; t <= SERVICE; t++) {
  let c = 0;
  for (const T of TABLES) {
    for (const r of T.res) if (t >= r.s && t < r.s + r.d) c += r.p;
  }
  COV[t] = c;
  if (c > peakV) {
    peakV = c;
    peakT = t;
  }
}
/* Headroom above the peak, so the calm marker's label has somewhere to sit
   that is not on top of the curve it is describing. */
const MAX_COV = peakV * 1.34;
const RUSH_T = Math.max(0, peakT - 60);

/** What a table's readout says: its last booking of the evening. Derived here
    rather than typed out beside the geometry, so the plate can never claim a
    reservation the floor is not drawing. */
const READOUTS = TABLES.map((T) => {
  const last = T.res[T.res.length - 1];
  return { kind: T.kind, n: last.p, time: clockLabel(last.s) };
});

/* ----------------------------- THE COMPONENT ---------------------------- */

export default function RestauranteDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLSpanElement | null>(null);

  /* Which table the readout strip is reading. It is resolved from the first
     render, so the strip is complete before hydration, with no JS at all, and
     under reduced motion. Selecting another table only moves the selection. */
  const [picked, setPicked] = useState(0);
  const pickedRef = useRef(0);
  /** Set by the canvas effect: redraw the static frame when nothing is
      animating, which is how a tap gets an answer on a paused board. */
  const redrawRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const frameEl = frameRef.current;
    const canvas = canvasRef.current;
    const caption = captionRef.current;
    if (!frameEl || !canvas || !canvas.getContext) return;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    let ctx: CanvasRenderingContext2D = ctx0;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;

    let PAL: DemoPalette = readDemoPalette(frameEl, "energy");

    /* ------------------------------ geometry ----------------------------- */

    /** Per-table drawn geometry, rebuilt on every layout. Parallel to TABLES. */
    const geo = TABLES.map(() => ({ x: 0, y: 0, r: 0, hw: 0, hh: 0 }));

    let W = 0;
    let H = 0;
    let phone = false;
    let unit = 12;
    let x0 = 0;
    let x1 = 0;
    let clockY = 0;
    let roomX0 = 0;
    let roomX1 = 0;
    let roomY0 = 0;
    let roomY1 = 0;
    let loadTop = 0;
    let loadBase = 0;
    let doorX = 0;
    let doorY = 0;
    /* Where an arriving chip starts. The door mark is drawn on the wall
       itself, so a chip centred on it would hang half outside the room. */
    let entryX = 0;

    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let cycT = 0;

    const clampN = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

    /* Vertical layout as pixel bands derived from the measured width, so the
       frame height fits the composition at every width: no fixed tall box and
       no letterbox. One source of truth, used for both the canvas height and
       the positions inside it. */
    const bands = (w: number, isPhone: boolean) => {
      const cy = 24;
      const ry0 = cy + 36; /* the gap holds the playhead time label */
      /* The phone room is taller than it is wide because it holds four rows of
         three; the wide room is a shallow band because it holds three rows. */
      const roomH = isPhone
        ? clampN(w * 0.92, 330, 380)
        : clampN(w * 0.25, 188, 280);
      const ry1 = ry0 + roomH;
      const lt = ry1 + 34; /* clear gap between the room and the covers label */
      const covH = isPhone
        ? clampN(w * 0.34, 110, 140)
        : clampN(w * 0.13, 118, 150);
      const lb = lt + covH;
      return { cy, ry0, ry1, roomH, lt, lb, height: Math.round(lb + 22) };
    };

    const layout = () => {
      const b = bands(W, phone);
      x0 = W * 0.075;
      x1 = W * 0.94; /* shared time axis for the clock strip and the load line */
      clockY = b.cy;
      roomX0 = W * 0.045;
      roomX1 = W * 0.955;
      roomY0 = b.ry0;
      roomY1 = b.ry1;
      loadTop = b.lt;
      loadBase = b.lb;
      unit = phone
        ? clampN(W * 0.052, 14, 21)
        : clampN(W * 0.027, 12, 29);
      doorX = phone ? roomX0 : W * 0.075;
      doorY = roomY0 + b.roomH * (phone ? 0.93 : 0.84);
      entryX = Math.max(doorX, roomX0 + unit * 0.95);

      for (let i = 0; i < TABLES.length; i++) {
        const T = TABLES[i];
        const spot = phone ? T.phone : T.wide;
        const g = geo[i];
        g.x = spot.fx * W;
        g.y = roomY0 + spot.fy * b.roomH;
        if (T.shape === "round") {
          g.r = unit * 0.72;
          g.hw = g.r;
          g.hh = g.r;
        } else if (T.shape === "square") {
          g.hw = unit * 0.82;
          g.hh = unit * 0.82;
        } else if (T.shape === "rectH") {
          g.hw = unit * 1.5;
          g.hh = unit * 0.72;
        } else {
          g.hw = unit * 0.72;
          g.hh = unit * 1.5;
        }
      }
    };

    const timeX = (t: number) => x0 + (t / SERVICE) * (x1 - x0);
    const covY = (c: number) => loadBase - (c / MAX_COV) * (loadBase - loadTop);
    const covAt = (t: number) => {
      if (t <= 0) return COV[0];
      if (t >= SERVICE) return COV[SERVICE];
      const i = Math.floor(t);
      return COV[i] + (COV[i + 1] - COV[i]) * (t - i);
    };

    /* --------------------------- drawing the room ------------------------ */

    /** How warm a table is at minute t: it rises as the party is seated, holds
        through the meal, and cools as the table turns. */
    const warmth = (T: TableDef, t: number) => {
      let w = 0;
      const WI = 8;
      const CO = 11;
      for (const r of T.res) {
        const s = r.s;
        const e = s + r.d;
        let c;
        if (t <= s || t >= e) c = 0;
        else if (t < s + WI) c = easeInOut((t - s) / WI);
        else if (t > e - CO) c = 1 - easeInOut((t - (e - CO)) / CO);
        else c = 1;
        if (c > w) w = c;
      }
      return w;
    };

    const drawChair = (cx: number, cy: number, vertical: boolean, warm: number) => {
      const cw = unit * 0.6;
      const ch = unit * 0.34;
      const w = vertical ? ch : cw;
      const h = vertical ? cw : ch;
      rr(ctx, cx - w / 2, cy - h / 2, w, h, Math.min(w, h) * 0.4);
      ctx.fillStyle = rgba(
        mix(PAL.plateRgb, PAL.accentRgb, Math.min(1, warm)),
        0.55 + 0.45 * warm
      );
      ctx.fill();
    };

    const drawTable = (i: number, t: number) => {
      const T = TABLES[i];
      const g = geo[i];
      const w = warmth(T, t);
      const gap = unit * 0.62;

      /* chairs first, tucked around the footprint */
      if (T.shape === "round") {
        drawChair(g.x, g.y - g.r - gap, false, w);
        drawChair(g.x, g.y + g.r + gap, false, w);
      } else if (T.shape === "square") {
        drawChair(g.x, g.y - g.hh - gap, false, w);
        drawChair(g.x, g.y + g.hh + gap, false, w);
        drawChair(g.x - g.hw - gap, g.y, true, w);
        drawChair(g.x + g.hw + gap, g.y, true, w);
      } else if (T.shape === "rectH") {
        for (const f of [-0.55, 0, 0.55]) {
          drawChair(g.x + g.hw * f, g.y - g.hh - gap, false, w);
          drawChair(g.x + g.hw * f, g.y + g.hh + gap, false, w);
        }
      } else {
        for (const f of [-0.55, 0, 0.55]) {
          drawChair(g.x - g.hw - gap, g.y + g.hh * f, true, w);
          drawChair(g.x + g.hw + gap, g.y + g.hh * f, true, w);
        }
      }

      /* the table top */
      ctx.fillStyle = rgba(mix(PAL.plateRgb, PAL.accentRgb, w * 0.82), 1);
      ctx.strokeStyle = rgba(
        mix(PAL.lineRgb, PAL.accentRgb, Math.min(1, w * 1.15)),
        0.9
      );
      ctx.lineWidth = 1.4;
      if (T.shape === "round") {
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        rr(ctx, g.x - g.hw, g.y - g.hh, g.hw * 2, g.hh * 2, 2);
        ctx.fill();
        ctx.stroke();
      }

      /* a soft warm bloom while the table is seated */
      if (w > 0.02) {
        const rad = Math.max(g.hw, g.hh) + unit * 0.5;
        ctx.save();
        ctx.globalAlpha = w * 0.5;
        const gg = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, rad);
        gg.addColorStop(0, rgba(PAL.accentRgb, 0.5));
        gg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(g.x, g.y, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      /* the selected table, so a tap on a phone is answered on the board and
         not only in the strip underneath it */
      if (i === pickedRef.current) {
        const rad = Math.max(g.hw, g.hh) + unit * 0.78;
        ctx.strokeStyle = PAL.accentSoft;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(g.x, g.y, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const drawRoom = () => {
      rr(ctx, roomX0, roomY0, roomX1 - roomX0, roomY1 - roomY0, 2);
      ctx.fillStyle = PAL.floor;
      ctx.fill();
      ctx.strokeStyle = PAL.lineSoft;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      /* the entrance, a break in the left wall with its label inside the room
         so it never crowds the covers label below */
      ctx.strokeStyle = PAL.accentLine;
      ctx.lineWidth = 2;
      line(ctx, roomX0, doorY - unit * 0.7, roomX0, doorY + unit * 0.7);
      ctx.font = "600 9px " + MONO;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = PAL.axis;
      ctx.fillText(
        vis.entrance,
        roomX0 + 6,
        Math.min(doorY + unit * 0.7 + 12, roomY1 - 14)
      );
    };

    const drawClock = (t: number) => {
      ctx.strokeStyle = PAL.line;
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      line(ctx, x0, clockY, x1, clockY);
      ctx.font = "600 " + (phone ? 10 : 9) + "px " + MONO;
      ctx.textBaseline = "alphabetic";
      /* label every hour when they fit, else every other, so labels never
         collide at any width */
      const dense = (x1 - x0) / 6 >= 52;
      for (let h = 0; h <= 6; h++) {
        const x = timeX(h * 60);
        ctx.strokeStyle = PAL.lineSoft;
        ctx.lineWidth = 1.4;
        line(ctx, x, clockY - 4, x, clockY + 4);
        if (dense || h % 2 === 0) {
          ctx.fillStyle = PAL.axis;
          ctx.textAlign = "center";
          ctx.fillText(17 + h + ":00", x, clockY - 10);
        }
      }
      /* playhead: a dot on the axis, a connector down into the room, and the
         time label below the axis where nothing can collide with it */
      const px = timeX(t);
      ctx.fillStyle = PAL.accent;
      ctx.beginPath();
      ctx.arc(px, clockY, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PAL.accentLine;
      ctx.lineWidth = 1;
      line(ctx, px, clockY + 5, px, roomY0 - 4);
      ctx.font = "600 11px " + MONO;
      ctx.fillStyle = PAL.accentInk;
      const near = px > x1 - 44;
      ctx.textAlign = near ? "right" : "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(clockLabel(t), near ? px - 7 : px + 7, clockY + 16);
    };

    const drawChips = (t: number) => {
      const lead = 16;
      const fade = 6;
      for (let i = 0; i < TABLES.length; i++) {
        const g = geo[i];
        for (const r of TABLES[i].res) {
          if (t < r.s - lead || t > r.s + fade) continue;
          let x;
          let y;
          let a;
          let sc;
          if (t <= r.s) {
            const u = easeInOut(clamp01((t - (r.s - lead)) / lead));
            x = entryX + (g.x - entryX) * u;
            y = doorY + (g.y - doorY) * u;
            a = Math.min(1, 0.35 + u);
            sc = 0.6 + 0.4 * u;
          } else {
            x = g.x;
            y = g.y;
            a = 1 - clamp01((t - r.s) / fade);
            sc = 1 - 0.25 * clamp01((t - r.s) / fade);
          }
          if (a <= 0.02) continue;
          const cw = unit * 1.35 * sc;
          const ch = unit * 0.82 * sc;
          ctx.save();
          ctx.globalAlpha = a;
          rr(ctx, x - cw / 2, y - ch / 2, cw, ch, 2);
          ctx.fillStyle = PAL.panel;
          ctx.fill();
          ctx.strokeStyle = PAL.accentSoft;
          ctx.lineWidth = 1.3;
          ctx.stroke();
          ctx.fillStyle = PAL.accentInk;
          ctx.font = "600 " + (unit * 0.62).toFixed(0) + "px " + MONO;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(r.p), x, y + 0.5);
          ctx.restore();
        }
      }
    };

    const drawLoad = (t: number) => {
      const n = Math.max(0, Math.min(SERVICE, Math.floor(t)));
      const plotTop = covY(peakV);

      ctx.font = "600 " + (phone ? 10 : 9) + "px " + MONO;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.fillStyle = PAL.axis;
      ctx.fillText(vis.covers, x0, loadTop - 8);
      ctx.textAlign = "right";
      ctx.fillText(vis.illustrativeUpper, x1, loadTop - 8);

      /* The band is designed from t0: faint gridlines, hour ticks tying it to
         the timeline above, a ghost of the whole evening's curve and its
         endpoints. It reads as a chart before any covers accumulate, so it
         never looks like an empty reserved rectangle. */
      ctx.strokeStyle = PAL.lineSoft;
      ctx.lineWidth = 1;
      for (let k = 1; k <= 2; k++) {
        const gy = covY((peakV * k) / 3);
        line(ctx, x0, gy, x1, gy);
      }
      for (let h = 0; h <= 6; h++) {
        const gx = timeX(h * 60);
        line(ctx, gx, loadBase, gx, loadBase - (loadBase - plotTop) * 0.16);
      }
      ctx.strokeStyle = rgba(PAL.accentRgb, 0.2);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(timeX(0), covY(COV[0]));
      for (let k = 4; k <= SERVICE; k += 4) ctx.lineTo(timeX(k), covY(COV[k]));
      ctx.stroke();
      ctx.fillStyle = rgba(PAL.accentRgb, 0.3);
      for (const k of [0, SERVICE]) {
        ctx.beginPath();
        ctx.arc(timeX(k), covY(COV[k]), 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = PAL.line;
      ctx.lineWidth = 1;
      line(ctx, x0, loadBase, x1, loadBase);

      if (n >= 1) {
        let k;
        /* the filled area up to now */
        ctx.beginPath();
        ctx.moveTo(timeX(0), loadBase);
        for (k = 0; k <= n; k++) ctx.lineTo(timeX(k), covY(COV[k]));
        ctx.lineTo(timeX(t), covY(covAt(t)));
        ctx.lineTo(timeX(t), loadBase);
        ctx.closePath();
        ctx.fillStyle = PAL.accentFaint;
        ctx.fill();
        /* the covers line */
        ctx.beginPath();
        ctx.moveTo(timeX(0), covY(COV[0]));
        for (k = 1; k <= n; k++) ctx.lineTo(timeX(k), covY(COV[k]));
        ctx.lineTo(timeX(t), covY(covAt(t)));
        ctx.strokeStyle = PAL.accent;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.stroke();
        /* the moving head */
        ctx.fillStyle = PAL.accentInk;
        ctx.beginPath();
        ctx.arc(timeX(t), covY(covAt(t)), 3, 0, Math.PI * 2);
        ctx.fill();
      }

      /* The calm marker: an hour before the peak the climb is already legible.
         It is revealed as the evening reaches that point. */
      if (t >= RUSH_T) {
        const rx = timeX(RUSH_T);
        const topY = covY(peakV) - 6;
        ctx.save();
        ctx.setLineDash([4, 5]);
        ctx.strokeStyle = PAL.accentSoft;
        ctx.lineWidth = 1.4;
        line(ctx, rx, loadBase, rx, topY);
        ctx.setLineDash([]);
        ctx.fillStyle = PAL.accent;
        ctx.beginPath();
        ctx.arc(rx, covY(covAt(Math.min(t, RUSH_T))), 2.6, 0, Math.PI * 2);
        ctx.fill();
        if (t >= peakT) {
          ctx.setLineDash([2, 5]);
          ctx.strokeStyle = PAL.accentLine;
          ctx.lineWidth = 1;
          line(ctx, rx, topY, timeX(peakT), topY);
          ctx.setLineDash([]);
          ctx.fillStyle = PAL.accentInk;
          ctx.beginPath();
          ctx.arc(timeX(peakT), covY(peakV), 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
        /* The label sits in the headroom above the peak, never on the curve.
           MAX_COV is what buys that headroom; without it this line lands on
           the plateau it is pointing at. */
        ctx.font = "600 11px " + MONO;
        ctx.fillStyle = PAL.accentInk;
        const leftAnchor = rx < W * 0.5;
        ctx.textAlign = leftAnchor ? "left" : "right";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(
          phone ? vis.rushCompact : vis.rush,
          leftAnchor ? rx + 7 : rx - 7,
          Math.max(loadTop + 11, topY - 6)
        );
        ctx.restore();
      }
    };

    const drawScene = (t: number, showChips: boolean, fo: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      drawClock(t);
      drawRoom();
      for (let i = 0; i < TABLES.length; i++) drawTable(i, t);
      if (showChips) drawChips(t);
      drawLoad(t);
      if (fo < 1) {
        ctx.fillStyle = rgba(PAL.panelRgb, 1 - fo);
        ctx.fillRect(0, 0, W, H);
      }
    };

    const setCaption = (t: number, holding: boolean) => {
      /* Written straight to the DOM rather than through state: this runs about
         thirty times a second and a re-render per frame would be absurd. React
         owns this node's initial text and never rewrites it, because its
         children prop never changes. */
      if (!caption) return;
      const c = vis.captions;
      caption.textContent = holding
        ? c.oneEvening
        : t < 2
          ? c.begins
          : t < RUSH_T
            ? c.filling
            : t < peakT
              ? c.flagged
              : c.peak;
    };

    /** The fullest point of the evening, curve drawn up to the peak and the
        rush marker shown. This is reduced motion, and it is also what a paused
        board shows. */
    const resolved = () => {
      setCaption(peakT, false);
      drawScene(peakT, false, 1);
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

      let t;
      let holding = false;
      let fo = 1;
      let showChips = true;
      if (cycT < INTRO) {
        t = 0;
        showChips = false;
      } else if (cycT < INTRO + RUN) {
        t = ((cycT - INTRO) / RUN) * SERVICE;
      } else {
        t = SERVICE;
        holding = true;
        showChips = false;
      }

      /* a gentle dip at the loop seam so the reset is not a jump */
      const fadeStart = INTRO + RUN + HOLD;
      if (cycT >= fadeStart) fo = 1 - ((cycT - fadeStart) / FADE) * 0.85;
      else if (cycT < 0.5) fo = 0.15 + (cycT / 0.5) * 0.85;

      drawScene(t, showChips, fo);
      setCaption(t, holding);
    };

    const canRun = () => !reduced() && docVisible && onscreen;
    const start = () => {
      if (running || !canRun()) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    redrawRef.current = () => {
      if (!running) resolved();
    };

    /* Keep the readout hotspots over the tables they belong to at every width,
       from the same geometry the canvas draws with, so they cannot drift. The
       edge hints tell the CSS which way a plate has to open to stay inside the
       frame, which differs between the two floor plans. */
    const btns = frameEl.querySelectorAll<HTMLElement>(".rd-btn");
    const positionReadouts = () => {
      for (let i = 0; i < geo.length && i < btns.length; i++) {
        const fx = geo[i].x / W;
        const fy = geo[i].y / H;
        btns[i].style.left = (fx * 100).toFixed(2) + "%";
        btns[i].style.top = (fy * 100).toFixed(2) + "%";
        btns[i].dataset.edge =
          (fx < 0.25 ? "left" : fx > 0.75 ? "right" : "") +
          (fy > 0.58 ? " up" : "");
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      phone = W < 640;
      /* the composition sets its own height, so the frame always fits it */
      H = bands(W, phone).height;
      canvas.style.height = H + "px";
      ctx = fitCanvas(canvas, W, H);
      layout();
      positionReadouts();
      if (reduced() || !running) resolved();
    };

    let io: IntersectionObserver | null = null;
    let rt = 0;

    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 140);
    };
    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible && onscreen) {
        start();
      } else {
        stop();
        if (!reduced()) resolved();
      }
    };
    const onReduce = () => {
      if (reduced()) {
        stop();
        resolved();
      } else {
        start();
      }
    };
    const onMode = () => {
      PAL = readDemoPalette(frameEl, "energy");
      if (reduced() || !running) resolved();
    };

    resize();

    if (reduced()) {
      resolved();
    } else if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (en) => {
          onscreen = en[0].isIntersecting;
          if (onscreen && docVisible) {
            start();
          } else {
            stop();
            resolved();
          }
        },
        { threshold: 0.12 }
      );
      io.observe(frameEl);
    } else {
      onscreen = true;
      start();
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMQ.addEventListener("change", onReduce);
    window.addEventListener("cardon-mode", onMode);

    return () => {
      stop();
      redrawRef.current = null;
      if (io) io.disconnect();
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMQ.removeEventListener("change", onReduce);
      window.removeEventListener("cardon-mode", onMode);
    };
  }, [vis]);

  /* A selection has to show on the board too, and on a still board nothing is
     going to redraw it on its own. */
  useEffect(() => {
    pickedRef.current = picked;
    redrawRef.current?.();
  }, [picked]);

  const detail = (i: number) =>
    vis.party
      .replace("{n}", String(READOUTS[i].n))
      .replace("{time}", READOUTS[i].time);

  return (
    <figure className="demo-figure" data-demo="restaurante">
      <figcaption className="demo-head">
        <span className="demo-title">
          {vis.title}
          <span className="demo-hours mono">{vis.tagHours}</span>
        </span>
        <span className="demo-honest mono">{d.honest}</span>
      </figcaption>

      <div className="demo-stage" ref={frameRef}>
        <canvas className="demo-canvas" ref={canvasRef} aria-hidden="true" />

        {READOUTS.map((b, i) => (
          <button
            key={i}
            type="button"
            className={"rd-btn" + (i === picked ? " is-picked" : "")}
            aria-pressed={i === picked}
            /* Positions are corrected from the canvas geometry on layout. These
               are the pre-hydration placeholders, drawn from the wide plan. */
            style={{
              left: (TABLES[i].wide.fx * 100).toFixed(2) + "%",
              top: (14 + TABLES[i].wide.fy * 45).toFixed(2) + "%",
            }}
            aria-label={vis.tableAria[b.kind]
              .replace("{n}", String(b.n))
              .replace("{time}", b.time)}
            onClick={() => setPicked(i)}
          >
            <span className="rd-plate" aria-hidden="true">
              <span className="rd-name">{vis.tables[b.kind]}</span>
              <span className="rd-detail">{detail(i)}</span>
              <span className="rd-illus">{vis.illustrative}</span>
            </span>
          </button>
        ))}

        <noscript>
          <div className="demo-fallback">{vis.fallback}</div>
        </noscript>
      </div>

      {/* The readout strip. On a phone there is no hover, so this is the whole
          reading: a tap moves the selection and the strip answers. It is
          resolved from the first render, so it is complete with no JS. */}
      <div className="demo-readout">
        <p className="demo-pick" aria-live="polite">
          <span className="demo-pick-k mono">{vis.readoutLabel}</span>
          <span className="demo-pick-v">{vis.tables[READOUTS[picked].kind]}</span>
          <span className="demo-pick-d mono">{detail(picked)}</span>
        </p>
        <span className="demo-caption mono" ref={captionRef} aria-hidden="true">
          {vis.captions.begins}
        </span>
      </div>
      <p className="demo-hint mono">{vis.hint}</p>
    </figure>
  );
}
