"use client";

import { useMemo, useState } from "react";
import { demos, type DemosDict } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import {
  clamp01,
  easeInOut,
  line,
  mix,
  MONO,
  rgba,
  rr,
  type DemoPalette,
} from "./palette";
import {
  bands,
  BRIX_HI,
  BRIX_LO,
  brixAt,
  CAPTION_KEYS,
  captionKeyFor,
  CENTRES,
  chart,
  climbing,
  cutDay,
  CYCLE,
  cycleFrame,
  fillAt,
  FLAG_FONT_PX,
  flagLabel,
  FLAG_D,
  harvestDate,
  HARVEST,
  inCellar,
  LAST,
  LAST_CROSS,
  LOTS,
  OUTLINE,
  READOUTS,
  STANDING_CYC,
  TICK_EVERY,
  WINDOW_HI,
  WINDOW_LO,
  type LotDef,
} from "./cellar";
import { DemoFigure, Hotspot, PickBox } from "./stage/DemoFigure";
import type { DemoScene, StageEnv } from "./stage/useDemoStage";

/**
 * Produccion: a block coming off the vine across one harvest (bead hq-3pfhe.2).
 *
 * Built to components/pages/demos/RestauranteDemo.tsx, which is the reference
 * demo, and on the shared stage it was refactored onto (./stage/), so what is
 * in this file is the picture and nothing else: the clock, the loop, the
 * measuring, the motion gates and every DOM write the loop makes belong to
 * ./stage/useDemoStage.ts, and the room, the numbers and the timeline belong
 * to ./cellar.ts. See docs/demos.md.
 *
 * What it argues. A vendimia is one decision repeated six times: when each lot
 * comes off. The sugar readings that answer it are taken all through the
 * ripening, so the window is legible days before it opens, and the module
 * sells exactly that. So the calendar strip runs 20 August to 1 October; the
 * block deepens lot by lot as the fruit ripens; a lot is cut on the day its
 * reading enters the window, its fruit travels to its own tank and the tank
 * fills; and underneath, the six readings climb into the window band. Five
 * days before the last crossing a calm marker draws where that reading is
 * going, which is the whole argument: the winemaker sees the window coming
 * rather than being told about it on the morning it opens. The loop holds on
 * the full cellar with every lot cut inside its window.
 *
 * The block is one piece of land. Its six lots share their vertices, so they
 * tile with no gaps and no overlaps, the way the nine sections of
 * components/pages/case/VineyardMap.tsx do; floating polygons read as stickers
 * on paper (Daniel, 2026-09-15). ./cellar.test.ts holds that by area.
 *
 * Colour is components/pages/demos/palette.ts, which reads the live theme
 * tokens, so the demo recolours with the mode toggle instead of sitting on the
 * page as a screenshot in last mode's colours. One hue: Produccion wears
 * --primary, which is what demos.css gives [data-demo="produccion"], and the
 * palette reader is asked for that hue and no other brand token. Light is the
 * mode this was tuned in.
 *
 * Every number on this block is invented. The frame says so.
 */

/* ------------------------------- THE SCENE ------------------------------ */

type Vis = DemosDict["produccion"];

/** The wide plan's horizontal thirds, as fractions of the canvas: the block on
    the left, the cellar on the right. Shared with the pre-hydration hotspot
    placeholders at the bottom of this file, so the two cannot drift. */
const ROOM_L = 0.045;
const ROOM_R = 0.955;
const BLOCK_SHARE = 0.55;
const CELLAR_FROM = 0.62;

/**
 * The picture, and only the picture. The stage calls layout() when the board
 * changes size and draw() with the loop's reading whenever a frame is due. The
 * same draw() is the running loop, the paused board and the reduced-motion
 * frame, so it keeps no memory between calls and reads no clock of its own.
 */
export function produccionScene(vis: Vis): DemoScene {
  /* the board as the stage last described it; set at the top of layout() and
     draw(), read by everything below */
  let ctx!: CanvasRenderingContext2D;
  let PAL!: DemoPalette;
  let picked = 0;

  const MONTHS = [vis.months.aug, vis.months.sep, vis.months.oct];
  const dateText = (day: number) => {
    const t = harvestDate(day);
    return t.d + " " + MONTHS[t.m];
  };

  /* ------------------------------ geometry ----------------------------- */

  /** Per-lot drawn geometry, rebuilt on every layout. Parallel to LOTS. */
  const geo = LOTS.map(() => ({
    pts: [] as { x: number; y: number }[],
    cx: 0,
    cy: 0,
  }));
  /** Per-lot tank, in the same order, because a lot fills its own tank. */
  const tanks = LOTS.map(() => ({ x: 0, y: 0, w: 0, h: 0 }));

  let W = 0;
  let H = 0;
  let phone = false;
  let unit = 12;
  let x0 = 0;
  let x1 = 0;
  let clockY = 0;
  let blockX0 = 0;
  let blockX1 = 0;
  let blockY0 = 0;
  let blockY1 = 0;
  let cellX0 = 0;
  let cellX1 = 0;
  let cellY0 = 0;
  let cellY1 = 0;
  let loadTop = 0;
  let loadBase = 0;

  const clampN = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

  const layout = (env: StageEnv) => {
    W = env.W;
    H = env.H;
    phone = env.phone;
    const b = bands(W, phone);
    /* the shared time axis and the chart's two scales, from ./cellar.ts, so
       the placement of the marker's label is derived from the same numbers a
       test can call rather than from a copy of them */
    const c = chart(W, phone);
    x0 = c.x0;
    x1 = c.x1;
    clockY = b.cy;
    loadTop = c.top;
    loadBase = c.base;
    unit = phone ? clampN(W * 0.05, 14, 20) : clampN(W * 0.026, 12, 26);

    /* Every width below is derived from the measured board and clamped at
       zero. A container collapsed to nothing (a hidden tab, an auto grid
       track) has the stage draw at W = 1, and round one turned that into a
       negative tank width, a negative corner radius inside rr() and thirty-two
       IndexSizeError throws a second out of arcTo, where the reference demo
       threw none (reviewer, 2026-09-24). A board too small to see still has to
       be a board draw() can finish. */
    const roomX0 = W * ROOM_L;
    const roomX1 = Math.max(roomX0, W * ROOM_R);
    /* Wide: the land and the building side by side, which is how a winemaker
       holds them. Phone: the same two, stacked, because six tanks in a row
       beside a block would be six 12px tanks. */
    blockX0 = roomX0;
    blockX1 = phone ? roomX1 : roomX0 + (roomX1 - roomX0) * BLOCK_SHARE;
    blockY0 = b.ry0 + 18;
    blockY1 = phone ? b.ry0 + b.roomH * 0.56 : b.ry1 - 4;
    cellX0 = phone ? roomX0 : roomX0 + (roomX1 - roomX0) * CELLAR_FROM;
    cellX1 = roomX1;
    cellY0 = phone ? b.ry0 + b.roomH * 0.68 : blockY0;
    cellY1 = b.ry1 - 4;

    for (let i = 0; i < LOTS.length; i++) {
      const g = geo[i];
      g.pts = LOTS[i].pts.map((p) => ({
        x: blockX0 + p[0] * (blockX1 - blockX0),
        y: blockY0 + p[1] * (blockY1 - blockY0),
      }));
      g.cx = blockX0 + CENTRES[i].x * (blockX1 - blockX0);
      g.cy = blockY0 + CENTRES[i].y * (blockY1 - blockY0);
    }

    /* the tanks, a row inside the cellar's plate with a label line under it */
    const pad = phone ? 9 : 10;
    const gap = Math.max(4, (cellX1 - cellX0) * 0.016);
    const tankW = Math.max(
      0,
      (cellX1 - cellX0 - pad * 2 - gap * (LOTS.length - 1)) / LOTS.length,
    );
    const top = cellY0 + pad;
    const bottom = cellY1 - 14;
    for (let i = 0; i < LOTS.length; i++) {
      tanks[i].x = cellX0 + pad + i * (tankW + gap);
      tanks[i].y = top;
      tanks[i].w = tankW;
      tanks[i].h = Math.max(0, bottom - top);
    }
  };

  const timeX = (d: number) => x0 + (d / HARVEST) * (x1 - x0);
  const brixY = (v: number) =>
    loadBase - ((v - BRIX_LO) / (BRIX_HI - BRIX_LO)) * (loadBase - loadTop);

  /* ------------------------- the calendar strip ------------------------ */

  const drawCalendar = (d: number) => {
    ctx.strokeStyle = PAL.line;
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";
    line(ctx, x0, clockY, x1, clockY);
    ctx.font = "600 " + (phone ? 10 : 9) + "px " + MONO;
    ctx.textBaseline = "alphabetic";
    /* label every tick when they fit, else every other, so the dates never
       collide at any width; the first and the last are anchored inward so
       neither can hang off the board */
    const ticks = HARVEST / TICK_EVERY;
    const dense = (x1 - x0) / ticks >= 62;
    for (let k = 0; k <= ticks; k++) {
      const day = k * TICK_EVERY;
      const x = timeX(day);
      ctx.strokeStyle = PAL.lineSoft;
      ctx.lineWidth = 1.4;
      line(ctx, x, clockY - 4, x, clockY + 4);
      if (dense || k % 2 === 0) {
        ctx.fillStyle = PAL.axis;
        ctx.textAlign = k === 0 ? "left" : k === ticks ? "right" : "center";
        ctx.fillText(dateText(day), x, clockY - 10);
      }
    }
    /* playhead: a dot on the axis, a connector down into the block, and the
       date below the axis where nothing can collide with it */
    const px = timeX(d);
    ctx.fillStyle = PAL.accent;
    ctx.beginPath();
    ctx.arc(px, clockY, 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PAL.accentLine;
    ctx.lineWidth = 1;
    line(ctx, px, clockY + 5, px, blockY0 - 6);
    ctx.font = "600 11px " + MONO;
    ctx.fillStyle = PAL.accentInk;
    const near = px > x1 - 52;
    ctx.textAlign = near ? "right" : "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(dateText(d), near ? px - 7 : px + 7, clockY + 16);
  };

  /* ---------------------------- the block ------------------------------ */

  /** How much fruit lot `L` is carrying on day `d`: it deepens as the sugar
      climbs and drains away over the day after the cut, when the fruit is in
      the cellar rather than on the vine. That drain is the whole picture in
      one value: the colour leaves the land and arrives in the tanks. */
  const load = (L: LotDef, d: number) => {
    const ripe = clamp01((brixAt(L, d) - L.brix0) / (L.brixCut - L.brix0));
    const gone = clamp01((d - cutDay(L)) / 1.2);
    return ripe * (1 - easeInOut(gone));
  };

  const lotPath = (i: number) => {
    const pts = geo[i].pts;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k].x, pts[k].y);
    ctx.closePath();
  };

  /** A cut lot, once its fruit is in: rows of stubble across it. Without this
      the bare lot the loop ends on is the same picture as the unripe lot it
      began with, and the payoff frame has to be legible on its own. */
  const drawStubble = (i: number, a: number) => {
    const pts = geo[i].pts;
    let x0b = Infinity;
    let x1b = -Infinity;
    let y0b = Infinity;
    let y1b = -Infinity;
    for (const p of pts) {
      if (p.x < x0b) x0b = p.x;
      if (p.x > x1b) x1b = p.x;
      if (p.y < y0b) y0b = p.y;
      if (p.y > y1b) y1b = p.y;
    }
    ctx.save();
    lotPath(i);
    ctx.clip();
    ctx.globalAlpha = a;
    ctx.strokeStyle = PAL.accentLine;
    ctx.lineWidth = 1;
    const step = Math.max(7, unit * 0.5);
    const h = y1b - y0b;
    for (let x = x0b - h; x < x1b; x += step) line(ctx, x, y1b, x + h, y0b);
    ctx.restore();
  };

  const drawBlock = (d: number) => {
    for (let i = 0; i < LOTS.length; i++) {
      const L = LOTS[i];
      const w = load(L, d);
      lotPath(i);
      ctx.fillStyle = rgba(mix(PAL.plateRgb, PAL.accentRgb, w * 0.55), 1);
      ctx.fill();
      const cut = clamp01((d - cutDay(L)) / 1.2);
      if (cut > 0.01) drawStubble(i, cut * 0.55);
      lotPath(i);
      ctx.strokeStyle = rgba(
        mix(PAL.lineRgb, PAL.accentRgb, Math.min(1, w * 1.15)),
        0.42
      );
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    /* the block's own edge, so six lots read as one piece of land */
    ctx.beginPath();
    for (let k = 0; k < OUTLINE.length; k++) {
      const p = OUTLINE[k];
      const x = blockX0 + p[0] * (blockX1 - blockX0);
      const y = blockY0 + p[1] * (blockY1 - blockY0);
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = rgba(PAL.lineRgb, 0.7);
    ctx.lineWidth = 1.4;
    ctx.stroke();

    for (let i = 0; i < LOTS.length; i++) {
      const L = LOTS[i];
      const g = geo[i];
      /* ready: the reading is in the window and the fruit is still on the
         vine. This is the hour the demo is about, so it is marked on the land
         and not only on the chart. */
      if (d >= L.cross && d < cutDay(L)) {
        ctx.strokeStyle = PAL.accentSoft;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(g.cx, g.cy, unit * 1.05, 0, Math.PI * 2);
        ctx.stroke();
      }
      /* the selected lot, so a tap on a phone is answered on the board and
         not only in the strip underneath it */
      if (i === picked) {
        lotPath(i);
        ctx.fillStyle = PAL.accentFaint;
        ctx.fill();
        ctx.strokeStyle = PAL.accent;
        ctx.lineWidth = 2.4;
        ctx.stroke();
      }
      /* The key is read off the land it is drawn on, so it cannot wear the
         muted ink the labels beside the board wear: PAL.axis on a ripe lot's
         fill measures 2.08:1 in light mode, where 4.5 is the bar for a 9px
         label (reviewer's non-blocking note, 2026-09-24). The map-maker's
         answer is a halo: the panel colour under the full text ink, which
         holds at every stage of ripening and in both modes. Picking one of two
         inks by the fill's luminance instead leaves a crossover at 3.7:1,
         which is the same defect with a smaller number. */
      ctx.font = "600 " + (phone ? 10 : 9) + "px " + MONO;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = PAL.panel;
      ctx.strokeText(L.k, g.cx, g.cy);
      ctx.fillStyle = PAL.ink;
      ctx.fillText(L.k, g.cx, g.cy);
    }

    ctx.font = "600 9px " + MONO;
    ctx.fillStyle = PAL.axis;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(vis.vineyard, geo[0].pts[0].x, blockY0 - 7);
  };

  /* ---------------------------- the cellar ----------------------------- */

  const drawCellar = (d: number) => {
    rr(ctx, cellX0, cellY0, cellX1 - cellX0, cellY1 - cellY0, 2);
    ctx.fillStyle = PAL.floor;
    ctx.fill();
    ctx.strokeStyle = PAL.lineSoft;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.font = "600 9px " + MONO;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    ctx.fillStyle = PAL.axis;
    ctx.fillText(vis.cellar, cellX0, cellY0 - 7);
    /* how many lots are in, drawn rather than written into the page: a number
       that changes every few frames belongs on the canvas (docs/demos.md) */
    ctx.textAlign = "right";
    ctx.fillStyle = PAL.accentInk;
    ctx.font = "600 10px " + MONO;
    ctx.fillText(inCellar(d) + "/" + LOTS.length, cellX1, cellY0 - 7);

    for (let i = 0; i < LOTS.length; i++) {
      const T = tanks[i];
      rr(ctx, T.x, T.y, T.w, T.h, 2);
      ctx.fillStyle = PAL.plate;
      ctx.fill();
      ctx.strokeStyle = PAL.line;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      const full = fillAt(LOTS[i], d);
      if (full > 0.004) {
        /* inset inside the tank, and the tank itself can be zero wide */
        const h = Math.max(0, T.h - 2) * full;
        const y = T.y + T.h - 1 - h;
        rr(ctx, T.x + 1, y, Math.max(0, T.w - 2), h, 2);
        ctx.fillStyle = rgba(PAL.accentRgb, 0.9);
        ctx.fill();
        /* the surface, so a tank reads as liquid and not as a bar chart */
        ctx.strokeStyle = PAL.accentInk;
        ctx.lineWidth = 1.2;
        line(ctx, T.x + 1, y, T.x + T.w - 1, y);
      }
      if (i === picked) {
        rr(ctx, T.x - 1.5, T.y - 1.5, T.w + 3, T.h + 3, 2);
        ctx.strokeStyle = PAL.accentSoft;
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }
      ctx.font = "600 9px " + MONO;
      ctx.fillStyle = PAL.axis;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(LOTS[i].k, T.x + T.w / 2, cellY1 - 4);
    }
  };

  /* ------------------- the fruit leaving for the cellar ----------------- */

  const drawFruit = (d: number) => {
    const fade = 0.6;
    for (let i = 0; i < LOTS.length; i++) {
      const L = LOTS[i];
      const cut = cutDay(L);
      if (d < L.cross || d > cut + fade) continue;
      const g = geo[i];
      const T = tanks[i];
      const tx = T.x + T.w / 2;
      const ty = T.y + T.h * 0.3;
      let x;
      let y;
      let a;
      let sc;
      if (d <= cut) {
        const u = easeInOut(clamp01((d - L.cross) / (cut - L.cross)));
        x = g.cx + (tx - g.cx) * u;
        y = g.cy + (ty - g.cy) * u;
        a = Math.min(1, 0.35 + u);
        sc = 0.6 + 0.4 * u;
      } else {
        x = tx;
        y = ty;
        a = 1 - clamp01((d - cut) / fade);
        sc = 1 - 0.25 * clamp01((d - cut) / fade);
      }
      if (a <= 0.02) continue;
      const cw = unit * 1.7 * sc;
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
      ctx.font = "600 " + (unit * 0.58).toFixed(0) + "px " + MONO;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(L.tons + " t", x, y + 0.5);
      ctx.restore();
    }
  };

  /* --------------------------- the readings ---------------------------- */

  /** One lot's line, from the first reading to whichever comes first, today or
      its cut: after the cut there is nothing left to sample. */
  const lotLine = (L: LotDef, d: number) => {
    const end = Math.min(d, cutDay(L));
    ctx.beginPath();
    ctx.moveTo(timeX(0), brixY(L.brix0));
    for (let s = 0.5; s < end; s += 0.5) ctx.lineTo(timeX(s), brixY(brixAt(L, s)));
    ctx.lineTo(timeX(end), brixY(brixAt(L, end)));
    ctx.stroke();
  };

  const drawChart = (d: number) => {
    ctx.font = "600 " + (phone ? 10 : 9) + "px " + MONO;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    ctx.fillStyle = PAL.axis;
    ctx.fillText(vis.brix, x0, loadTop - 8);
    ctx.textAlign = "right";
    ctx.fillText(vis.illustrativeUpper, x1, loadTop - 8);

    /* The chart is designed from day 0: gridlines, the calendar's own ticks
       along the base, and the window band the whole story is aimed at. It
       reads as a chart before any reading has moved, so it never looks like an
       empty reserved rectangle. */
    ctx.strokeStyle = PAL.lineSoft;
    ctx.lineWidth = 1;
    for (const v of [19, 22]) line(ctx, x0, brixY(v), x1, brixY(v));
    for (let k = 0; k <= HARVEST / TICK_EVERY; k++) {
      const gx = timeX(k * TICK_EVERY);
      line(ctx, gx, loadBase, gx, loadBase - (loadBase - loadTop) * 0.12);
    }

    const bandTop = brixY(WINDOW_HI);
    const bandBase = brixY(WINDOW_LO);
    ctx.fillStyle = PAL.accentFaint;
    ctx.fillRect(x0, bandTop, x1 - x0, bandBase - bandTop);
    ctx.strokeStyle = PAL.accentLine;
    ctx.lineWidth = 1;
    line(ctx, x0, bandTop, x1, bandTop);
    line(ctx, x0, bandBase, x1, bandBase);
    ctx.font = "600 11px " + MONO;
    ctx.fillStyle = PAL.accentInk;
    ctx.textAlign = "right";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(vis.window, x1, bandTop - 5);

    ctx.strokeStyle = PAL.line;
    ctx.lineWidth = 1;
    line(ctx, x0, loadBase, x1, loadBase);

    /* every lot's readings, with the one the story is following drawn up */
    const head = climbing(d);
    for (let i = 0; i < LOTS.length; i++) {
      const L = LOTS[i];
      const lead = i === picked || L === head;
      ctx.strokeStyle = lead ? PAL.accent : rgba(PAL.accentRgb, 0.42);
      ctx.lineWidth = i === picked ? 2.2 : lead ? 2 : 1.4;
      ctx.lineJoin = "round";
      lotLine(L, d);
      if (d >= cutDay(L)) {
        /* where it was cut: the line ends on the window band */
        ctx.fillStyle = lead ? PAL.accentInk : rgba(PAL.accentRgb, 0.55);
        ctx.beginPath();
        ctx.arc(timeX(cutDay(L)), brixY(L.brixCut), lead ? 3 : 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* the live reading, drawn on the canvas rather than written into the page,
       the way the reference draws its clock */
    if (head) {
      const hx = timeX(d);
      const hy = brixY(brixAt(head, d));
      ctx.fillStyle = PAL.accentInk;
      ctx.beginPath();
      ctx.arc(hx, hy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "600 11px " + MONO;
      ctx.textAlign = hx > x1 - 60 ? "right" : "left";
      ctx.textBaseline = "alphabetic";
      const above = hy > loadTop + (loadBase - loadTop) * 0.4;
      ctx.fillText(
        brixAt(head, d).toFixed(1) + " Bx",
        hx > x1 - 60 ? hx - 7 : hx + 7,
        above ? hy - 7 : hy + 14
      );
    }

    /* The calm marker: five days before the last lot crosses, the reading is
       already pointing into the window, and the projection says where it lands.
       It is revealed as the harvest reaches that day, and it stays on the
       payoff frame, because it is the argument the module makes. */
    if (d >= FLAG_D) {
      const rx = timeX(FLAG_D);
      const topY = bandTop - 6;
      ctx.save();
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = PAL.accentSoft;
      ctx.lineWidth = 1.4;
      /* through the floor by a few pixels, so the label under it reads as this
         day's and not as a caption of the whole chart */
      line(ctx, rx, loadBase + 5, rx, topY);
      /* where that reading was going, drawn from the day it was legible */
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = PAL.accentLine;
      ctx.lineWidth = 1.4;
      line(ctx, rx, brixY(brixAt(LAST, FLAG_D)), timeX(LAST_CROSS), brixY(WINDOW_LO));
      ctx.setLineDash([]);
      ctx.fillStyle = PAL.accent;
      ctx.beginPath();
      ctx.arc(rx, brixY(brixAt(LAST, FLAG_D)), 2.6, 0, Math.PI * 2);
      ctx.fill();
      if (d >= LAST_CROSS) {
        ctx.fillStyle = PAL.accentInk;
        ctx.beginPath();
        ctx.arc(timeX(LAST_CROSS), brixY(WINDOW_LO), 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
      /* Under the chart's floor, in the figure's own bottom margin, which is
         the one strip of the board no reading can reach: see flagLabel() in
         ./cellar.ts, which places it and is what cellar.test.ts holds against
         every lot's polyline at every width. */
      const text = phone ? vis.flagCompact : vis.flag;
      ctx.font = "600 " + FLAG_FONT_PX + "px " + MONO;
      ctx.fillStyle = PAL.accentInk;
      const label = flagLabel(W, phone, ctx.measureText(text).width);
      ctx.textAlign = label.align;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(text, label.x, label.baseline);
      ctx.restore();
    }
  };

  return {
    hue: "primary",
    clock: { cycle: CYCLE, standing: STANDING_CYC },
    height: (w, isPhone) => bands(w, isPhone).height,
    layout,
    draw(env, cycT) {
      ctx = env.ctx;
      PAL = env.pal;
      picked = env.selection;
      const f = cycleFrame(cycT);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      drawCalendar(f.d);
      drawBlock(f.d);
      drawCellar(f.d);
      if (f.showFruit) drawFruit(f.d);
      drawChart(f.d);
      /* the dip at the loop seam */
      if (f.fade < 1) {
        ctx.fillStyle = rgba(PAL.panelRgb, 1 - f.fade);
        ctx.fillRect(0, 0, W, H);
      }
    },
    /* From the same geometry the canvas draws with, so they cannot drift. A
       collapsed board divides by nothing, and the stage writes these into a
       style attribute, where NaN would land as "NaN%": there is no hotspot to
       place on a board with no width, so they go to its corner. */
    hotspots: () =>
      geo.map((g) => ({ fx: W > 0 ? g.cx / W : 0, fy: H > 0 ? g.cy / H : 0 })),
    live: [
      {
        name: "caption",
        values: vis.captions,
        keys: CAPTION_KEYS,
        initial: "begins",
        at: (cycT) => captionKeyFor(cycleFrame(cycT).d),
      },
    ],
  };
}

/* ----------------------------- THE COMPONENT ---------------------------- */

/** Where each hotspot sits before the stage has measured anything: the wide
    plan's block, at the width the figure reaches its max. The stage corrects
    every one of them from the scene's own geometry on the first layout. */
const PLACEHOLDER = (() => {
  const b = bands(760, false);
  const y0 = b.ry0 + 18;
  const y1 = b.ry1 - 4;
  return CENTRES.map((c) => ({
    left: ((ROOM_L + c.x * (ROOM_R - ROOM_L) * BLOCK_SHARE) * 100).toFixed(2) + "%",
    top: (((y0 + c.y * (y1 - y0)) / b.height) * 100).toFixed(2) + "%",
  }));
})();

export default function ProduccionDemo() {
  const d = useDict(demos);
  const vis = d.produccion;
  /* Which lot the readout strip is reading. It is resolved from the first
     render, so the strip is complete before hydration, with no JS at all, and
     under reduced motion. Selecting another lot only moves the selection. */
  const [picked, setPicked] = useState(0);
  const scene = useMemo(() => produccionScene(vis), [vis]);

  const MONTHS = [vis.months.aug, vis.months.sep, vis.months.oct];
  const name = (i: number) =>
    vis.lotName
      .replace("{k}", READOUTS[i].k)
      .replace("{variety}", vis.varieties[READOUTS[i].variety]);
  const cutOf = (i: number, template: string) => {
    const when = harvestDate(READOUTS[i].day);
    return template
      .replace("{date}", when.d + " " + MONTHS[when.m])
      .replace("{brix}", READOUTS[i].brix.toFixed(1))
      .replace("{tons}", String(READOUTS[i].tons));
  };

  return (
    <DemoFigure
      demo="produccion"
      scene={scene}
      title={
        <>
          {vis.title}
          <span className="demo-hours mono">{vis.tagSpan}</span>
        </>
      }
      honest={d.honest}
      fallback={vis.fallback}
      hint={vis.hint}
      selection={picked}
      hotspots={READOUTS.map((r, i) => (
        <Hotspot
          key={r.k}
          picked={i === picked}
          onPick={() => setPicked(i)}
          label={cutOf(i, vis.lotAria)
            .replace("{k}", r.k)
            .replace("{variety}", vis.varieties[r.variety])}
          style={PLACEHOLDER[i]}
        >
          <span className="rd-plate" aria-hidden="true">
            <span className="rd-name">{name(i)}</span>
            <span className="rd-detail">{cutOf(i, vis.cut)}</span>
            <span className="rd-illus">{vis.illustrative}</span>
          </span>
        </Hotspot>
      ))}
    >
      {/* On a phone there is no hover, so this is the whole reading: a tap
          moves the selection and the strip answers. */}
      <PickBox
        count={READOUTS.length}
        picked={picked}
        row={(i) => (
          <>
            <span className="demo-pick-k mono">{vis.readoutLabel}</span>
            <span className="demo-pick-v">{name(i)}</span>
            <span className="demo-pick-d mono">{cutOf(i, vis.cut)}</span>
          </>
        )}
      />
    </DemoFigure>
  );
}
