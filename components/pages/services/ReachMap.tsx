"use client";

import { useEffect, useRef } from "react";
import { clearsThreshold } from "@/lib/onscreen";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { anuncios } from "@/lib/i18n/anuncios";
import {
  MONO,
  clamp01,
  drawFlow,
  easeInOut,
  fitCanvas,
  makeTrace,
  pointAtLen,
  readPalette,
  rr,
  strokeTraceUpTo,
  type Palette,
  type Pt,
  type Trace,
} from "../home/canvasKit";
import "./reach-map.css";

/**
 * Hero visual of the Google Ads service page, the argument drawn: people
 * already searching for what the business sells reach it along the roads of a
 * local map, the searches that do not fit are struck out as negatives, every
 * arrival crosses a measured gate and lands on a calls or messages counter,
 * and the budget runs straight to Google, never through the provider.
 *
 * House pattern (HeroAssembly): rAF capped at 30 fps, DPR capped at 2, paused
 * by IntersectionObserver and visibilitychange, palette re-read on
 * "cardon-mode", compact portrait scene chosen from the MEASURED width with the
 * height set here, reduced motion draws the settled frame once. Every frame is
 * a pure function of the loop clock T, so the settled frame is just draw(T).
 */

const CYCLE = 13;
const INTRO = 1.0;
const STEP = 1.2;
const APPEAR = 0.35;
const RELEASE = 0.35;
const TRAVEL = 1.6;
const STRIKE_AT = 0.5;
const STRIKE = 0.4;
const NEG_AT = 0.9;
const FADE_AT = 1.3;
const FADE = 1.0;
const RING = 0.9;
const FLASH = 0.5;
const OUT_AT = 11.5;
const OUT = 1.3;
const FLOW_PASS = 1.2;
const SETTLED = 10.4;

interface Chip {
  t: string;
  match: boolean;
  appear: number;
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  lineW: number[];
  road: Trace | null;
  release: number;
  cross: number;
  arrive: number;
  kind: 0 | 1;
  negX: number;
  negY: number;
}

const EMPTY: Trace = makeTrace([
  { x: 0, y: 0 },
  { x: 0, y: 0 },
]);

/** The observer threshold, and what clearsThreshold checks the entry against. */
const THRESHOLD_ONSCREEN = 0.06;

export default function ReachMap() {
  const t = useDict(anuncios).vis.reach;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLSpanElement | null>(null);
  const tagRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;
    const caption = captionRef.current;

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;
    let PAL: Palette = readPalette(root);

    let W = 0;
    let H = 0;
    let compact = false;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let T = 0;

    // Geometry, rebuilt by layout() from the measured size.
    let C: Pt = { x: 0, y: 0 };
    let G: Pt = { x: 0, y: 0 };
    let gateVertical = true;
    let chips: Chip[] = [];
    let spare: Trace = EMPTY;
    let contours: Pt[][] = [];
    let budget = { x: 0, y: 0, w: 0, h: 0 };
    let goog = { x: 0, y: 0, w: 0, h: 0 };
    let budgetRoad: Trace = EMPTY;
    let crossA: Pt = { x: 0, y: 0 };
    let crossB: Pt = { x: 0, y: 0 };
    let lastArrive = 0;
    let chipFont = 12;
    let lineH = 16;

    const font = (px: number, weight = 500) => weight + " " + px + "px " + MONO;

    /** Greedy word wrap by measureText, at most two lines. A single word wider
     *  than the limit widens the chip instead of being cut. */
    function wrap(c: CanvasRenderingContext2D, text: string, maxW: number): string[] {
      if (c.measureText(text).width <= maxW) return [text];
      const words = text.split(" ");
      const lines: string[] = [];
      let cur = "";
      for (const w of words) {
        const next = cur ? cur + " " + w : w;
        if (!cur || c.measureText(next).width <= maxW || lines.length === 1) {
          cur = next;
        } else {
          lines.push(cur);
          cur = w;
        }
      }
      if (cur) lines.push(cur);
      return lines.slice(0, 2);
    }

    function makeChip(
      c: CanvasRenderingContext2D,
      i: number,
      maxW: number
    ): Chip {
      const q = t.queries[i];
      c.font = font(chipFont);
      const lines = wrap(c, q.t, maxW - 20);
      const lineW = lines.map((l) => c.measureText(l).width);
      const w = Math.ceil(Math.max(...lineW) + 20);
      const h = lines.length * lineH + 10;
      return {
        t: q.t,
        match: q.match,
        appear: INTRO + i * STEP,
        x: 0,
        y: 0,
        w,
        h,
        lines,
        lineW,
        road: null,
        release: 0,
        cross: 0,
        arrive: 0,
        kind: 0,
        negX: 0,
        negY: 0,
      };
    }

    function contourSet(cx: number, cy: number, n: number, r0: number, dr: number, seed: number) {
      for (let k = 0; k < n; k++) {
        const pts: Pt[] = [];
        const r = r0 + k * dr;
        for (let s = 0; s <= 72; s++) {
          const a = (s / 72) * Math.PI * 2;
          const rr2 =
            r *
            (1 +
              0.09 * Math.sin(3 * a + seed + k * 0.6) +
              0.05 * Math.sin(5 * a + seed * 2 - k * 0.4));
          pts.push({ x: cx + Math.cos(a) * rr2 * 1.25, y: cy + Math.sin(a) * rr2 * 0.8 });
        }
        contours.push(pts);
      }
    }

    function layoutBudget(c: CanvasRenderingContext2D, M: number, cy: number) {
      c.font = font(11);
      const bw = Math.ceil(c.measureText(t.budgetK).width + 18);
      const gw = Math.ceil(c.measureText(t.google).width + 18);
      budget = { x: M, y: cy - 11, w: bw, h: 22 };
      goog = { x: W - M - gw, y: cy - 11, w: gw, h: 22 };
      budgetRoad = makeTrace([
        { x: budget.x + bw + 4, y: cy },
        { x: goog.x - 4, y: cy },
      ]);
      // The road to the business, drawn short and crossed out.
      const p0 = { x: budget.x + bw - 6, y: budget.y - 3 };
      const dx = C.x - p0.x;
      const dy = C.y - p0.y;
      const d = Math.hypot(dx, dy) || 1;
      const len = compact ? 30 : 36;
      crossA = p0;
      crossB = { x: p0.x + (dx / d) * len, y: p0.y + (dy / d) * len };
    }

    /** Timing that depends on geometry: when each dot crosses the gate. */
    function schedule() {
      let m = 0;
      lastArrive = 0;
      for (const ch of chips) {
        if (!ch.match || !ch.road) continue;
        ch.kind = m % 2 === 0 ? 0 : 1;
        m++;
        ch.release = ch.appear + RELEASE;
        ch.arrive = ch.release + TRAVEL;
        lastArrive = Math.max(lastArrive, ch.arrive);
        const gateL = ch.road.len - Math.hypot(C.x - G.x, C.y - G.y);
        const target = clamp01(gateL / (ch.road.len || 1));
        let lo = 0;
        let hi = 1;
        for (let k = 0; k < 24; k++) {
          const mid = (lo + hi) / 2;
          if (easeInOut(mid) < target) lo = mid;
          else hi = mid;
        }
        ch.cross = ch.release + lo * TRAVEL;
      }
    }

    function layoutDesktop(c: CanvasRenderingContext2D) {
      chipFont = 12;
      lineH = 16;
      const M = 28;
      C = { x: W * 0.54, y: H * 0.47 };
      const J: Pt = { x: C.x - 112, y: C.y };
      G = { x: C.x - 56, y: C.y };
      gateVertical = true;
      chips = t.queries.map((_, i) => makeChip(c, i, 10000));
      // Matched searches come in from the left along roads that merge into one
      // approach, so every arrival crosses the one measured gate. The two that
      // do not fit sit on the right, off the roads.
      const left: Array<[number, number, number]> = [
        [0, 28, 0.18],
        [1, 62, 0.37],
        [2, 44, 0.56],
        [5, 24, 0.72],
      ];
      for (const [i, x, fy] of left) {
        chips[i] = makeChip(c, i, J.x - x - 40);
        const ch = chips[i];
        ch.x = x;
        ch.y = H * fy - ch.h / 2;
        const S = { x: ch.x + ch.w + 6, y: H * fy };
        const A = { x: S.x + Math.max(12, (J.x - S.x) * 0.4), y: S.y };
        ch.road = makeTrace([S, A, J, C]);
      }
      // Pulled in from the edge on wide frames so the right half is not a
      // dead band beside the counters.
      const rm = Math.max(M, W * 0.07);
      const right: Array<[number, number, number]> = [
        [3, rm, 0.24],
        [4, rm + 30, 0.68],
      ];
      for (const [i, m, fy] of right) {
        chips[i] = makeChip(c, i, W - m - (C.x + 90));
        const ch = chips[i];
        ch.x = W - m - ch.w;
        ch.y = H * fy - ch.h / 2;
      }
      spare = makeTrace([
        { x: W * 0.66, y: -4 },
        { x: C.x + 34, y: C.y - 96 },
        { x: C.x, y: C.y },
      ]);
      contours = [];
      contourSet(W * 0.26, H * 0.66, 5, 46, 40, 1.3);
      contourSet(W * 0.84, H * 0.16, 4, 34, 36, 4.1);
      contourSet(W * 0.7, H * 0.86, 3, 30, 30, 2.4);
      layoutBudget(c, M, H - 48);
      negSpots(c);
      schedule();
    }

    function layoutCompact(c: CanvasRenderingContext2D) {
      chipFont = 11;
      lineH = 14;
      const M = 16;
      const spineX = W / 2;
      const half = spineX - M - 14;
      chips = t.queries.map((_, i) => makeChip(c, i, half));
      // Matched searches arrive at the top edge in two staggered pairs, each on
      // a short side street into one main street (the spine) that runs down
      // through the measured gate to the business.
      // The HTML tag wraps to two lines on the narrowest phones, so the first
      // row starts under its measured bottom rather than at a fixed offset.
      let tagBottom = 34;
      const tagEl = tagRef.current;
      if (tagEl && canvas) {
        const tb = tagEl.getBoundingClientRect();
        const cb = canvas.getBoundingClientRect();
        if (tb.height > 0) tagBottom = tb.bottom - cb.top;
      }
      const top = Math.max(58, Math.round(tagBottom + 18));
      const pairs: Array<[number, number]> = [
        [0, 1],
        [2, 5],
      ];
      let y = top;
      let lastBottom = top;
      for (const [li, ri] of pairs) {
        const L = chips[li];
        const R = chips[ri];
        L.x = M;
        L.y = y;
        R.x = W - M - R.w;
        R.y = y + 18;
        lastBottom = Math.max(L.y + L.h, R.y + R.h);
        y = Math.max(L.y + L.h, R.y + R.h - 18) + 14;
      }
      C = { x: spineX, y: Math.max(H * 0.43, lastBottom + 72) };
      G = { x: spineX, y: (lastBottom + C.y - 12) / 2 };
      gateVertical = false;
      for (const i of [0, 1, 2, 5]) {
        const ch = chips[i];
        const cy = ch.y + ch.h / 2;
        const leftSide = ch.x < spineX;
        const S = { x: leftSide ? ch.x + ch.w + 5 : ch.x - 5, y: cy };
        ch.road = makeTrace([S, { x: spineX, y: cy }, C]);
      }
      spare = makeTrace([
        { x: W + 4, y: C.y - 30 },
        { x: W * 0.78, y: C.y - 30 },
        { x: C.x, y: C.y },
      ]);
      // The two searches that do not fit arrive at the bottom edge, between
      // the counters and the budget row, with room under each for its tag.
      const budgetY = H - 62;
      layoutBudget(c, M, budgetY);
      const wide = W - 2 * M - 30;
      chips[3] = makeChip(c, 3, Math.min(wide, W * 0.78));
      chips[4] = makeChip(c, 4, Math.min(wide, W * 0.78));
      const zTop = C.y + 104;
      const zBot = budgetY - 22;
      const a = chips[3];
      const b = chips[4];
      a.x = M;
      b.x = W - M - b.w;
      const need = a.h + 26 + b.h + 26;
      const gap = Math.max(8, (zBot - zTop - need) / 2);
      a.y = zTop + gap * 0.5;
      b.y = a.y + a.h + 26 + gap;
      contours = [];
      contourSet(W * 0.18, H * 0.3, 4, 30, 30, 1.7);
      contourSet(W * 0.86, H * 0.62, 4, 26, 28, 3.3);
      contourSet(W * 0.4, H * 0.9, 3, 24, 26, 5.2);
      negSpots(c);
      schedule();
    }

    function negSpots(c: CanvasRenderingContext2D) {
      c.font = font(11);
      const nw = c.measureText(t.negK).width + 14;
      for (const ch of chips) {
        if (ch.match) continue;
        ch.negY = ch.y + ch.h + 5;
        ch.negX = ch.x + ch.w - nw;
        if (ch.negX < ch.x) ch.negX = ch.x;
      }
    }

    function layout() {
      if (!ctx) return;
      if (compact) layoutCompact(ctx);
      else layoutDesktop(ctx);
    }

    /* ------------------------------ drawing ------------------------------ */

    function drawMap(c: CanvasRenderingContext2D) {
      c.strokeStyle = PAL.lineSoft;
      c.lineWidth = 1;
      for (const pts of contours) {
        c.beginPath();
        c.moveTo(pts[0].x, pts[0].y);
        for (let k = 1; k < pts.length; k++) c.lineTo(pts[k].x, pts[k].y);
        c.stroke();
      }
      const roads: Trace[] = [spare];
      for (const ch of chips) if (ch.road) roads.push(ch.road);
      c.lineCap = "round";
      c.lineJoin = "round";
      for (const r of roads) {
        c.strokeStyle = PAL.lineSoft;
        c.lineWidth = 6;
        strokeTraceUpTo(c, r, r.len);
      }
      for (const r of roads) {
        c.strokeStyle = PAL.line;
        c.lineWidth = 1.2;
        strokeTraceUpTo(c, r, r.len);
      }
    }

    function dotProgress(ch: Chip, now: number): number {
      return easeInOut((now - ch.release) / TRAVEL);
    }

    function drawLitRoads(c: CanvasRenderingContext2D, now: number, fo: number) {
      c.lineCap = "round";
      c.lineJoin = "round";
      for (const ch of chips) {
        if (!ch.road || now < ch.release) continue;
        const p = dotProgress(ch, now);
        c.globalAlpha = fo;
        c.strokeStyle = PAL.primaryDim;
        c.lineWidth = 1.5;
        strokeTraceUpTo(c, ch.road, ch.road.len * p);
      }
      c.globalAlpha = 1;
    }

    function drawGate(c: CanvasRenderingContext2D, now: number) {
      let flash = 0;
      for (const ch of chips) {
        if (!ch.road) continue;
        const d = now - ch.cross;
        if (d >= 0 && d < FLASH) flash = Math.max(flash, 1 - easeInOut(d / FLASH));
      }
      const half = compact ? 13 : 11;
      const x1 = gateVertical ? G.x : G.x - half;
      const x2 = gateVertical ? G.x : G.x + half;
      const y1 = gateVertical ? G.y - half : G.y;
      const y2 = gateVertical ? G.y + half : G.y;
      c.lineCap = "butt";
      c.lineWidth = 2;
      c.strokeStyle = PAL.secondary;
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
      if (flash > 0) {
        c.globalAlpha = flash;
        c.strokeStyle = PAL.primary;
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(x1, y1);
        c.lineTo(x2, y2);
        c.stroke();
        c.globalAlpha = 1;
      }
      c.font = font(11, 600);
      c.textBaseline = "middle";
      c.fillStyle = flash > 0.3 ? PAL.primaryText : PAL.secondary;
      if (gateVertical) {
        c.textAlign = "center";
        c.fillText(t.measuredK, G.x, G.y - half - 9);
      } else {
        c.textAlign = "left";
        c.fillText(t.measuredK, G.x + half + 8, G.y);
      }
      c.textBaseline = "alphabetic";
    }

    function drawBudget(c: CanvasRenderingContext2D, now: number, motion: boolean) {
      // The road toward the business, faint and crossed out: the budget never
      // passes through the provider.
      c.lineCap = "round";
      c.strokeStyle = PAL.muted;
      c.globalAlpha = 0.55;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(crossA.x, crossA.y);
      c.lineTo(crossB.x, crossB.y);
      c.stroke();
      const mx = crossA.x + (crossB.x - crossA.x) * 0.6;
      const my = crossA.y + (crossB.y - crossA.y) * 0.6;
      c.globalAlpha = 0.8;
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(mx - 4, my - 4);
      c.lineTo(mx + 4, my + 4);
      c.moveTo(mx + 4, my - 4);
      c.lineTo(mx - 4, my + 4);
      c.stroke();
      c.globalAlpha = 1;

      c.setLineDash([4, 5]);
      c.strokeStyle = PAL.primaryDim;
      c.lineWidth = 1.2;
      strokeTraceUpTo(c, budgetRoad, budgetRoad.len);
      c.setLineDash([]);

      if (motion && now > lastArrive + 0.2 && now < OUT_AT) {
        const s = now - (lastArrive + 0.2);
        const u = easeInOut((s % FLOW_PASS) / FLOW_PASS);
        drawFlow(c, budgetRoad, budgetRoad.len * u, PAL.primarySoft, PAL.primaryBright);
      }

      c.font = font(11);
      c.textBaseline = "middle";
      c.textAlign = "center";
      rr(c, budget.x, budget.y, budget.w, budget.h, 2);
      c.fillStyle = PAL.panel;
      c.fill();
      c.strokeStyle = PAL.line;
      c.lineWidth = 1;
      c.stroke();
      c.fillStyle = PAL.dim;
      c.fillText(t.budgetK, budget.x + budget.w / 2, budget.y + budget.h / 2 + 0.5);

      rr(c, goog.x, goog.y, goog.w, goog.h, 2);
      c.fillStyle = PAL.panel;
      c.fill();
      c.strokeStyle = PAL.primaryDim;
      c.stroke();
      c.fillStyle = PAL.ink;
      c.font = font(11, 600);
      c.fillText(t.google, goog.x + goog.w / 2, goog.y + goog.h / 2 + 0.5);
      c.textBaseline = "alphabetic";
    }

    function counts(now: number): [number, number, number, number] {
      let calls = 0;
      let msgs = 0;
      let callsAt = -99;
      let msgsAt = -99;
      for (const ch of chips) {
        if (!ch.road || now < ch.arrive) continue;
        if (ch.kind === 0) {
          calls++;
          callsAt = Math.max(callsAt, ch.arrive);
        } else {
          msgs++;
          msgsAt = Math.max(msgsAt, ch.arrive);
        }
      }
      return [calls, msgs, callsAt, msgsAt];
    }

    function drawCentre(c: CanvasRenderingContext2D, now: number, motion: boolean, fo: number) {
      const breathe = motion ? Math.sin(now * 1.1) : 0;
      const R = 30 + breathe * 4;
      const g = c.createRadialGradient(C.x, C.y, 0, C.x, C.y, R);
      g.addColorStop(0, "rgba(" + PAL.primaryRgb.join(",") + "," + (0.2 + breathe * 0.04) + ")");
      g.addColorStop(1, "rgba(" + PAL.primaryRgb.join(",") + ",0)");
      c.fillStyle = g;
      c.beginPath();
      c.arc(C.x, C.y, R, 0, Math.PI * 2);
      c.fill();

      for (const ch of chips) {
        if (!ch.road) continue;
        const d = now - ch.arrive;
        if (d < 0 || d > RING) continue;
        const e = easeInOut(d / RING);
        c.strokeStyle = PAL.primary;
        c.globalAlpha = (1 - e) * 0.8;
        c.lineWidth = 1.4;
        c.beginPath();
        c.arc(C.x, C.y, 8 + e * 22, 0, Math.PI * 2);
        c.stroke();
        c.globalAlpha = 1;
      }

      rr(c, C.x - 6, C.y - 6, 12, 12, 2);
      c.fillStyle = PAL.primary;
      c.fill();
      c.strokeStyle = PAL.panel;
      c.lineWidth = 1.5;
      c.stroke();

      c.font = font(12, 600);
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillStyle = PAL.ink;
      c.fillText(t.center, C.x, C.y + 22);

      const [calls, msgs, callsAt, msgsAt] = counts(now);
      c.font = font(11);
      const kw = Math.max(c.measureText(t.callsK).width, c.measureText(t.msgsK).width);
      c.font = font(13, 700);
      const nw = c.measureText("0").width;
      const bw = Math.ceil(kw + nw + 34);
      const bh = 46;
      const bx = compact ? C.x - bw / 2 : C.x + 26;
      const by = compact ? C.y + 36 : C.y - bh / 2 - 22;
      rr(c, bx, by, bw, bh, 2);
      c.fillStyle = PAL.panel;
      c.fill();
      c.strokeStyle = PAL.line;
      c.lineWidth = 1;
      c.stroke();
      const rows: Array<[string, number, number]> = [
        [t.callsK, calls, callsAt],
        [t.msgsK, msgs, msgsAt],
      ];
      rows.forEach(([k, v, at], r) => {
        const ry = by + 13 + r * 20;
        c.font = font(11);
        c.textAlign = "left";
        c.fillStyle = PAL.muted;
        c.fillText(k, bx + 10, ry + 0.5);
        c.font = font(13, 700);
        c.textAlign = "right";
        const hot = now - at >= 0 && now - at < 0.8 ? 1 - (now - at) / 0.8 : 0;
        // Soft fade to quiet: the totals cross-fade back to zero.
        if (fo < 1) {
          c.globalAlpha = 1 - fo;
          c.fillStyle = PAL.faint;
          c.fillText("0", bx + bw - 10, ry + 0.5);
          c.globalAlpha = fo;
        }
        c.fillStyle = v === 0 ? PAL.faint : hot > 0.2 ? PAL.primaryText : PAL.ink;
        c.fillText(String(v), bx + bw - 10, ry + 0.5);
        c.globalAlpha = 1;
      });
      c.textBaseline = "alphabetic";
    }

    function drawChip(c: CanvasRenderingContext2D, ch: Chip, now: number, fo: number) {
      const a = easeInOut((now - ch.appear) / APPEAR);
      if (a <= 0) return;
      let alpha = a * fo;
      if (!ch.match) alpha *= 1 - 0.55 * easeInOut((now - ch.appear - FADE_AT) / FADE);
      const dy = (1 - a) * 6;
      c.save();
      c.globalAlpha = alpha;
      rr(c, ch.x, ch.y + dy, ch.w, ch.h, 2);
      c.fillStyle = PAL.panel;
      c.fill();
      c.strokeStyle = PAL.line;
      c.lineWidth = 1;
      c.stroke();
      if (ch.match) {
        const b = easeInOut((now - ch.appear - 0.2) / 0.3);
        if (b > 0) {
          c.globalAlpha = alpha * b;
          rr(c, ch.x, ch.y + dy, ch.w, ch.h, 2);
          c.strokeStyle = PAL.primary;
          c.lineWidth = 1.2;
          c.stroke();
          c.globalAlpha = alpha;
        }
      }
      c.font = font(chipFont);
      c.textAlign = "left";
      c.textBaseline = "middle";
      c.fillStyle = ch.match ? PAL.ink : PAL.dim;
      for (let k = 0; k < ch.lines.length; k++) {
        c.fillText(ch.lines[k], ch.x + 10, ch.y + dy + 5 + lineH * (k + 0.5) + 0.5);
      }
      if (!ch.match) {
        const s = easeInOut((now - ch.appear - STRIKE_AT) / STRIKE);
        if (s > 0) {
          c.strokeStyle = PAL.ink;
          c.lineWidth = 1.2;
          c.lineCap = "butt";
          const total = ch.lineW.reduce((p, q) => p + q, 0);
          let left = total * s;
          for (let k = 0; k < ch.lines.length && left > 0; k++) {
            const seg = Math.min(left, ch.lineW[k]);
            const yy = ch.y + dy + 5 + lineH * (k + 0.5) + 0.5;
            c.beginPath();
            c.moveTo(ch.x + 9, yy);
            c.lineTo(ch.x + 11 + seg, yy);
            c.stroke();
            left -= seg;
          }
        }
        const n = easeInOut((now - ch.appear - NEG_AT) / 0.3);
        if (n > 0) {
          c.globalAlpha = n * fo * Math.max(0.7, alpha / Math.max(0.01, a * fo));
          c.font = font(11);
          const nw = c.measureText(t.negK).width + 14;
          rr(c, ch.negX, ch.negY, nw, 18, 2);
          c.strokeStyle = PAL.line;
          c.lineWidth = 1;
          c.stroke();
          c.fillStyle = PAL.muted;
          c.fillText(t.negK, ch.negX + 7, ch.negY + 9.5);
        }
      }
      c.restore();
    }

    function drawDots(c: CanvasRenderingContext2D, now: number) {
      for (const ch of chips) {
        if (!ch.road || now < ch.release || now > ch.arrive) continue;
        const p = pointAtLen(ch.road, ch.road.len * dotProgress(ch, now));
        const g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, 11);
        g.addColorStop(0, "rgba(" + PAL.primaryRgb.join(",") + ",0.32)");
        g.addColorStop(1, "rgba(" + PAL.primaryRgb.join(",") + ",0)");
        c.fillStyle = g;
        c.beginPath();
        c.arc(p.x, p.y, 11, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = PAL.primary;
        c.beginPath();
        c.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        c.fill();
      }
    }

    function draw(now: number, motion: boolean) {
      if (!ctx || W === 0 || H === 0) return;
      const c = ctx;
      c.clearRect(0, 0, W, H);
      const fo = now > OUT_AT ? 1 - easeInOut((now - OUT_AT) / OUT) : 1;
      drawMap(c);
      drawLitRoads(c, now, fo);
      drawBudget(c, now, motion);
      drawGate(c, now);
      drawCentre(c, now, motion, fo);
      for (const ch of chips) drawChip(c, ch, now, fo);
      drawDots(c, now);
      if (caption) {
        const done = now >= lastArrive;
        const txt = done ? t.captionDone : t.captionRun;
        if (caption.textContent !== txt) caption.textContent = txt;
        caption.setAttribute("data-done", done ? "1" : "0");
      }
    }

    const paint = () => (reduced() ? draw(SETTLED, false) : draw(T, true));

    function resize() {
      let rect = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      compact = W < 780;
      // Height from the measured width is the single source of truth; the CSS
      // height is only the pre-hydration paint.
      const h = compact
        ? Math.min(700, Math.max(560, W * 1.7))
        : Math.min(540, Math.max(440, W * 0.44));
      canvas!.style.height = Math.round(h) + "px";
      rect = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      ctx = fitCanvas(canvas!, W, H);
      layout();
      paint();
    }

    function frame(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 32) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      T += dt;
      if (T >= CYCLE) T -= CYCLE;
      draw(T, true);
    }
    const canRun = () => !reduced() && docVisible && onscreen;
    function start() {
      if (running || !canRun()) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 140);
    };
    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible && onscreen) start();
      else stop();
    };
    const onMode = () => {
      PAL = readPalette(root);
      paint();
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        paint();
      } else {
        start();
      }
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (en) => {
          onscreen = clearsThreshold(en[en.length - 1], THRESHOLD_ONSCREEN);
          if (onscreen && docVisible) start();
          else stop();
        },
        { threshold: THRESHOLD_ONSCREEN }
      );
      io.observe(canvas);
    } else {
      onscreen = true;
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("cardon-mode", onMode);
    reduceMQ.addEventListener("change", onReduceChange);

    resize();
    if (!("IntersectionObserver" in window) && !reduced()) start();

    return () => {
      stop();
      window.clearTimeout(rt);
      if (io) io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cardon-mode", onMode);
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, [t]);

  return (
    <div className="stage-wrap reach-stage">
      <div className="stage-frame" role="img" aria-label={t.aria}>
        <span className="stage-tag mono" ref={tagRef}>
          <span className="before">{t.tagBefore}</span>{" "}
          <span className="midword">{t.tagMid}</span>
        </span>
        <span className="stage-caption mono" ref={captionRef}>
          {t.captionRun}
        </span>
        <canvas id="reachCanvas" ref={canvasRef} aria-hidden="true" />
        <noscript>
          <div className="stage-fallback">{t.fallback}</div>
        </noscript>
      </div>
    </div>
  );
}
