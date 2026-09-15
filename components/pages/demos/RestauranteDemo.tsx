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
import {
  bands,
  CAPTION_KEYS,
  captionKeyFor,
  clockLabel,
  COV,
  CYCLE,
  cycleFrame,
  isPhonePlan,
  MAX_COV,
  PEAK_T,
  PEAK_V,
  READOUTS,
  RUSH_T,
  SERVICE,
  STANDING_CYC,
  TABLES,
  type TableDef,
} from "./floor";
import { observeOnscreen, shouldAnimate } from "./motion";
import "./demos.css";

/**
 * Restaurante: a dining room filling across one service (bead hq-3pfhe.1).
 *
 * Recovered from components/pages/restaurants/FloorPlan.tsx, which commit
 * 1fcb7e7 deleted along with the restaurants sector page. It is the demo the
 * other two are built to, so what it does is worth stating plainly.
 *
 * A slow clock strip runs one service, 17:00 to 23:00. Reservations arrive as
 * chips that travel from the entrance and dock onto their table; a table warms
 * as it seats and cools as it turns. The playhead sweeps to the fullest
 * minute of the evening and the loop holds there, on a full room: running it
 * on to 23:00 would rest the payoff frame on a floor every party has already
 * left. Underneath, a load line tracks covers over the evening, and an hour
 * before the peak a calm marker shows the rush arriving, which is the whole
 * argument the module makes: a full room is a pattern you can see coming, not
 * a surprise that lands on the floor.
 *
 * What it costs to run, and when it does not run at all. One canvas, one
 * requestAnimationFrame loop throttled to about 30fps, device pixel ratio
 * capped at 2 so a phone never rasterises four times the pixels it can show.
 * It is paused while off screen (IntersectionObserver) and while the tab is
 * hidden, and under prefers-reduced-motion it never starts: it resolves to a
 * static peak-service frame instead, which is also what a paused instance
 * shows. No dependency beyond React, no network call, no image.
 *
 * What this file is not. The room, the reservations, the covers curve, the
 * loop's timeline and the stage's bands are ./floor.ts, and the three gates
 * that decide whether it may animate are ./motion.ts. Both are pure and both
 * are tested in demos.test.ts; this file measures, draws and listens.
 *
 * Colour comes from components/pages/demos/palette.ts, which reads the live
 * theme tokens, so the demo recolours with the mode toggle instead of sitting
 * on the page as an embedded screenshot in last mode's colours. Light is the
 * default the site ships and the mode this was tuned in.
 *
 * Every number on this floor is invented. The frame says so.
 */

/* ----------------------------- THE COMPONENT ---------------------------- */

export default function RestauranteDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  const figureRef = useRef<HTMLElement | null>(null);
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
    const figureEl = figureRef.current;
    const frameEl = frameRef.current;
    const canvas = canvasRef.current;
    const caption = captionRef.current;
    if (!figureEl || !frameEl || !canvas || !canvas.getContext) return;
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
      const plotTop = covY(PEAK_V);

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
        const gy = covY((PEAK_V * k) / 3);
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
        const topY = covY(PEAK_V) - 6;
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
        if (t >= PEAK_T) {
          ctx.setLineDash([2, 5]);
          ctx.strokeStyle = PAL.accentLine;
          ctx.lineWidth = 1;
          line(ctx, rx, topY, timeX(PEAK_T), topY);
          ctx.setLineDash([]);
          ctx.fillStyle = PAL.accentInk;
          ctx.beginPath();
          ctx.arc(timeX(PEAK_T), covY(PEAK_V), 3.4, 0, Math.PI * 2);
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

    const setCaption = (t: number) => {
      /* Written straight to the DOM rather than through state: this runs about
         thirty times a second and a re-render per frame would be absurd. React
         owns this node's initial text and never rewrites it, because its
         children prop never changes. */
      if (!caption) return;
      caption.textContent = vis.captions[captionKeyFor(t)];
    };

    /** The fullest point of the evening, curve drawn up to the peak and the
        rush marker shown. This is reduced motion, it is what a paused board
        shows, and it is the same minute the running loop holds on, so the demo
        never has two different ideas of what its best frame is.

        It parks the loop's clock on the frame it draws rather than drawing
        PEAK_T behind the clock's back. Round two left cycT where the loop had
        stopped, so scrolling away at 18:10 snapped the board forward to 19:55
        and scrolling back jumped it to 18:10 again (reviewer s-3b55, note 4).
        STANDING_CYC is the first frame of the hold, so a resumed loop holds
        the room the visitor arrived on and then restarts, rather than dipping
        to 15 percent opacity the moment it resumes. */
    const resolved = () => {
      cycT = STANDING_CYC;
      const f = cycleFrame(cycT);
      setCaption(f.t);
      drawScene(f.t, f.showChips, f.fade);
    };

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 32) return;
      /* the ratio can move under a running loop with no resize and no event */
      if ((window.devicePixelRatio || 1) !== lastDpr) resize();
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      cycT += dt;
      if (cycT > CYCLE) cycT -= CYCLE;

      const f = cycleFrame(cycT);
      drawScene(f.t, f.showChips, f.fade);
      setCaption(f.t);
    };

    const canRun = () =>
      shouldAnimate({ reduced: reduced(), docVisible, onscreen });
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

    /** The figure's content box, which is exactly what demos.css queries: its
        container-type is inline-size and a size query reads the content box,
        so this is the one number both sides judge the plan by.

        Fractional, from the border box rect. clientWidth is rounded to an
        integer, which rounded a real 639.25px content box up to 640 and picked
        the wide plan while the stylesheet, reading the fractional box, stayed
        on the phone one (reviewer s-3b55, BLOCKING 2). The rect is the border
        box, so the border comes off as well as the padding. */
    const figureContentWidth = () => {
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

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      /* The plan is decided on the figure's content box and nothing else,
         because that is the box demos.css queries. The canvas rect above is
         the drawing width, and the two are the same number only because
         .demo-stage adds no padding or border: that coupling is named in
         demos.css and checked by demos.test.ts (reviewer s-3b55, note 3). */
      phone = isPhonePlan(figureContentWidth());
      /* published so a probe or a test can read which plan the component
         chose and hold it against the plan the stylesheet applied */
      frameEl.dataset.plan = phone ? "phone" : "wide";
      /* the composition sets its own height, so the frame always fits it */
      H = bands(W, phone).height;
      canvas.style.height = H + "px";
      ctx = fitCanvas(canvas, W, H);
      lastDpr = window.devicePixelRatio || 1;
      layout();
      positionReadouts();
      if (!running) resolved();
    };

    let rt = 0;

    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 140);
    };

    /* Device pixel ratio can change without the window resizing: a laptop
       moved to an external monitor, or the browser zoomed. fitCanvas caps the
       ratio at 2 and is only called from resize(), so round two rasterised the
       rest of the page's life at the old ratio, which is a blurry board on the
       new screen (lucy, round two).

       Two answers, because neither covers the other's case. A resolution media
       query is the event the platform offers, and it has to be re-armed every
       time because the query encodes the ratio it was built with; it is the
       only thing that reaches a demo standing on its static frame. And the
       running loop compares the ratio itself, which costs one property read
       per frame and is the half a headless browser can actually demonstrate:
       CDP's device metrics override moves devicePixelRatio and the media
       query's own matches, but dispatches no change event, so the listener
       path cannot be driven in a probe. state/review/s-0b4b/dpr.mjs is the
       measurement and dpr-debug.mjs is why it drives the loop rather than the
       listener. */
    let lastDpr = window.devicePixelRatio || 1;
    let dprMQ: MediaQueryList | null = null;
    const onDpr = () => {
      armDpr();
      resize();
    };
    const armDpr = () => {
      if (dprMQ) dprMQ.removeEventListener("change", onDpr);
      dprMQ = window.matchMedia(
        "(resolution: " + (window.devicePixelRatio || 1) + "dppx)"
      );
      dprMQ.addEventListener("change", onDpr);
    };
    /* Every one of these asks the same question, canRun(), and answers it the
       same way: animate, or stand on the static frame. */
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
    const onReduce = sync;
    const onMode = () => {
      PAL = readDemoPalette(frameEl, "energy");
      if (!running) resolved();
    };

    resize();
    armDpr();

    /* The observer is installed whatever the motion preference is. Being on
       screen is a fact about the page, not an animation setting, and only
       start() consults the preference, through canRun(). Building the observer
       inside the reduced-motion branch is what left a page loaded under reduce
       frozen for the rest of its life once the visitor turned reduce off: both
       round-one reviews reproduced it, and ./motion.ts now owns this so the
       mistake has nowhere to live. */
    const unobserve = observeOnscreen(frameEl, (on) => {
      onscreen = on;
      sync();
    });

    /* Width can change without the window resizing: a demo in a column that
       reflows, a panel opening beside it (reviewer note 5). Height changes are
       ignored, because resize() sets the canvas height itself and answering
       that would loop. */
    let roW = Math.round(figureContentWidth());
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        /* contentRect.width is the fractional content box, the same number
           the container query judges by. Rounding it is enough to ignore
           sub-pixel churn, except across the breakpoint, where 639.6 and
           640.2 round to the same integer and are different floor plans: so
           a plan change is a resize whatever the rounded width says. */
        const exact = entries[entries.length - 1].contentRect.width;
        const w = Math.round(exact);
        if (w === roW && isPhonePlan(exact) === phone) return;
        roW = w;
        onResize();
      });
      /* the figure, because that is the box the plan is decided on */
      ro.observe(figureEl);
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMQ.addEventListener("change", onReduce);
    window.addEventListener("cardon-mode", onMode);

    return () => {
      stop();
      redrawRef.current = null;
      unobserve();
      if (ro) ro.disconnect();
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMQ.removeEventListener("change", onReduce);
      window.removeEventListener("cardon-mode", onMode);
      if (dprMQ) dprMQ.removeEventListener("change", onDpr);
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
    <figure className="demo-figure" data-demo="restaurante" ref={figureRef}>
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
          {/* Applied only when scripting is off: the parser treats noscript
              content as markup then and as text otherwise. With no JS the
              board is never drawn and the hotspots never answer, so the
              written description below is the whole figure rather than a
              caption under an empty canvas (lucy, round two). */}
          {/* The hint goes with them: it tells the visitor to choose a table
              and this rule has just removed every table there is to choose
              (reviewer s-3b55, note 2). */}
          <style>{".demo-canvas,.rd-btn,.demo-hint{display:none}"}</style>
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
        {/* The caption box holds every caption the loop can write, stacked in
            one grid cell with all but the live one invisible, so the strip is
            as wide and as tall as the longest caption at every container width
            and in both locales. Round two wrote the live caption straight into
            a wrapping flex row, and because the four phases are different
            lengths the figure shrank 31px at one phase change and grew it back
            at the next, twice per cycle, for the life of the page (reviewer
            s-3b55, BLOCKING 1). */}
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
      </div>
      <p className="demo-hint mono">{vis.hint}</p>
    </figure>
  );
}
