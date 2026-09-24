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
  CAPTION_KEYS,
  captionKeyFor,
  clockLabel,
  COV,
  CYCLE,
  cycleFrame,
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
import { DemoFigure, Hotspot, PickBox } from "./stage/DemoFigure";
import type { DemoScene, StageEnv } from "./stage/useDemoStage";

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

/* ------------------------------- THE SCENE ------------------------------ */

type Vis = DemosDict["restaurante"];

/**
 * The picture, and only the picture. ./stage/useDemoStage.ts owns the clock,
 * the loop, the measuring and the motion gates, and calls layout() when the
 * board changes size and draw() with the loop's reading whenever a frame is
 * due. The same draw() is the running loop, the paused board and the
 * reduced-motion frame, so it keeps no memory between calls.
 */
function restauranteScene(vis: Vis): DemoScene {
  /* the board as the stage last described it; set at the top of layout() and
     draw(), read by everything below */
  let ctx!: CanvasRenderingContext2D;
  let PAL!: DemoPalette;
  let picked = 0;

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

  const clampN = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

  const layout = (env: StageEnv) => {
    W = env.W;
    H = env.H;
    phone = env.phone;
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
    if (i === picked) {
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

  return {
    hue: "energy",
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
      drawClock(f.t);
      drawRoom();
      for (let i = 0; i < TABLES.length; i++) drawTable(i, f.t);
      if (f.showChips) drawChips(f.t);
      drawLoad(f.t);
      /* the dip at the loop seam */
      if (f.fade < 1) {
        ctx.fillStyle = rgba(PAL.panelRgb, 1 - f.fade);
        ctx.fillRect(0, 0, W, H);
      }
    },
    /* from the same geometry the canvas draws with, so they cannot drift */
    hotspots: () => geo.map((g) => ({ fx: g.x / W, fy: g.y / H })),
    live: [
      {
        name: "caption",
        values: vis.captions,
        keys: CAPTION_KEYS,
        initial: "begins",
        at: (cycT) => captionKeyFor(cycleFrame(cycT).t),
      },
    ],
  };
}

/* ----------------------------- THE COMPONENT ---------------------------- */

export default function RestauranteDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  /* Which table the readout strip is reading. It is resolved from the first
     render, so the strip is complete before hydration, with no JS at all, and
     under reduced motion. Selecting another table only moves the selection. */
  const [picked, setPicked] = useState(0);
  const scene = useMemo(() => restauranteScene(vis), [vis]);

  const detail = (i: number) =>
    vis.party
      .replace("{n}", String(READOUTS[i].n))
      .replace("{time}", READOUTS[i].time);

  return (
    <DemoFigure
      demo="restaurante"
      scene={scene}
      title={
        <>
          {vis.title}
          <span className="demo-hours mono">{vis.tagHours}</span>
        </>
      }
      honest={d.honest}
      fallback={vis.fallback}
      hint={vis.hint}
      selection={picked}
      hotspots={READOUTS.map((b, i) => (
        <Hotspot
          key={i}
          picked={i === picked}
          onPick={() => setPicked(i)}
          label={vis.tableAria[b.kind]
            .replace("{n}", String(b.n))
            .replace("{time}", b.time)}
          /* Positions are corrected from the canvas geometry on layout. These
             are the pre-hydration placeholders, drawn from the wide plan. */
          style={{
            left: (TABLES[i].wide.fx * 100).toFixed(2) + "%",
            top: (14 + TABLES[i].wide.fy * 45).toFixed(2) + "%",
          }}
        >
          <span className="rd-plate" aria-hidden="true">
            <span className="rd-name">{vis.tables[b.kind]}</span>
            <span className="rd-detail">{detail(i)}</span>
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
            <span className="demo-pick-v">{vis.tables[READOUTS[i].kind]}</span>
            <span className="demo-pick-d mono">{detail(i)}</span>
          </>
        )}
      />
    </DemoFigure>
  );
}
