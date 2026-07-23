"use client";

import { useEffect, useRef } from "react";

type RGB = [number, number, number];

interface Palette {
  dark: boolean;
  groundRgb: RGB;
  panelRgb: RGB;
  cardRgb: RGB;
  mutedRgb: RGB;
  lineRgb: RGB;
  panel: string;
  muted: string;
  line: string;
  lineSoft: string;
  accent: string;
  accentRgb: RGB;
  accentSoft: string;
  accentFaint: string;
  accentLine: string;
  accentBright: string;
}

interface Reservation {
  s: number;
  d: number;
  p: number;
}

interface Table {
  fx: number;
  fy: number;
  shape: "round" | "square" | "rectH" | "rectV";
  seats: number;
  res: Reservation[];
  x: number;
  y: number;
  r: number;
  hw: number;
  hh: number;
}

interface Geo {
  x0: number;
  x1: number;
  clockY: number;
  roomX0: number;
  roomX1: number;
  roomY0: number;
  roomY1: number;
  loadTop: number;
  loadBase: number;
  door: { x: number; y: number };
  unit: number;
}

/* accessible table readouts, positioned over the floor plan. Data is generic and
   illustrative, clearly labeled as such. Fractions match the drawn TABLES below. */
const READOUTS: Array<{
  cls: string;
  left: string;
  top: string;
  aria: string;
  name: string;
  detail: string;
}> = [
  { cls: "m-left", left: "15%", top: "24.5%", aria: "Two-top by the window. Illustrative reservation: party of 2, seated 19:30.", name: "Two-top / window", detail: "party of 2, seated 19:30" },
  { cls: "", left: "29%", top: "24.5%", aria: "Two-top by the window. Illustrative reservation: party of 2, seated 19:55.", name: "Two-top / window", detail: "party of 2, seated 19:55" },
  { cls: "", left: "43%", top: "24.5%", aria: "Two-top by the window. Illustrative reservation: party of 2, seated 18:25.", name: "Two-top / window", detail: "party of 2, seated 18:25" },
  { cls: "", left: "57%", top: "24.5%", aria: "Two-top by the window. Illustrative reservation: party of 2, seated 20:35.", name: "Two-top / window", detail: "party of 2, seated 20:35" },
  { cls: "m-left", left: "16%", top: "41%", aria: "Four-top. Illustrative reservation: party of 4, seated 17:40.", name: "Four-top / center", detail: "party of 4, seated 17:40" },
  { cls: "", left: "30%", top: "41%", aria: "Four-top. Illustrative reservation: party of 4, seated 18:10.", name: "Four-top / center", detail: "party of 4, seated 18:10" },
  { cls: "", left: "45%", top: "41%", aria: "Four-top. Illustrative reservation: party of 4, seated 20:30.", name: "Four-top / center", detail: "party of 4, seated 20:30" },
  { cls: "", left: "60%", top: "41%", aria: "Four-top. Illustrative reservation: party of 4, seated 19:05.", name: "Four-top / center", detail: "party of 4, seated 19:05" },
  { cls: "m-right", left: "85%", top: "33%", aria: "Banquette, six seats. Illustrative reservation: party of 6, seated 18:30.", name: "Banquette / six seats", detail: "party of 6, seated 18:30" },
  { cls: "m-left m-up", left: "19%", top: "57%", aria: "Four-top. Illustrative reservation: party of 4, seated 19:15.", name: "Four-top / lower room", detail: "party of 4, seated 19:15" },
  { cls: "m-up", left: "42%", top: "57%", aria: "Large table, six seats. Illustrative reservation: party of 5, seated 19:30.", name: "Large top / six seats", detail: "party of 5, seated 19:30" },
  { cls: "m-up", left: "62%", top: "57%", aria: "Two-top. Illustrative reservation: party of 2, seated 19:55.", name: "Two-top / lower room", detail: "party of 2, seated 19:55" },
];

/**
 * Signature visual: a dining-room floor plan filling through one evening. A slow
 * clock strip runs one service (17:00 to 23:00). Reservations arrive as chips
 * that dock onto tables; tables warm as they seat and cool as they turn. A quiet
 * load line tracks covers, and an hour before the peak a calm marker shows the
 * rush arriving. Slow single-evening loop with long holds; recolors with the
 * mode. rAF with a DPR cap of 2, paused by IntersectionObserver and document
 * visibility, resolved to a static peak-service snapshot under reduced motion.
 */
export default function FloorPlan() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const frameEl = frameRef.current;
    const canvas = canvasRef.current;
    const caption = captionRef.current;
    if (!frameEl || !canvas || !canvas.getContext) return;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    let ctx: CanvasRenderingContext2D = ctx0;

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;

    const MONO = 'ui-monospace, "SFMono-Regular", Consolas, monospace';

    /* ---------------- palette read from the active theme tokens ----------------
       Read from the frame element so the page-scoped --accent (declared on the
       .pg-restaurants ancestor) resolves alongside the root theme tokens. */
    const cssVar = (name: string) =>
      getComputedStyle(frameEl).getPropertyValue(name).trim();
    const hexToRgb = (raw: string): RGB => {
      let h = raw.replace("#", "").trim();
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      const n = parseInt(h || "0", 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const rgba = (c: RGB, a: number) =>
      "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
    const mix = (a: RGB, b: RGB, t: number): RGB => [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ];
    const WHITE: RGB = [255, 255, 255];
    const BLACK: RGB = [12, 12, 12];

    const readPalette = (): Palette => {
      const ground = hexToRgb(cssVar("--ground") || "#0F1410");
      const panel = hexToRgb(cssVar("--panel") || "#16201A");
      const text = hexToRgb(cssVar("--text") || "#E4EAD9");
      const primary = hexToRgb(cssVar("--primary") || "#3FB58A");
      const accent = hexToRgb(cssVar("--accent") || "#B85C38");
      const dark = root.getAttribute("data-mode") !== "light";
      const toward: RGB = dark ? WHITE : BLACK;
      const cardRgb = mix(panel, text, 0.08);
      const mutedRgb = mix(text, panel, 0.5);
      const lineRgb = mix(primary, text, 0.35);
      const accentBrightRgb = mix(accent, toward, 0.3);
      return {
        dark,
        groundRgb: ground,
        panelRgb: panel,
        cardRgb,
        mutedRgb,
        lineRgb,
        panel: rgba(panel, 1),
        muted: rgba(mutedRgb, 1),
        line: rgba(lineRgb, 0.3),
        lineSoft: rgba(lineRgb, 0.16),
        accent: rgba(accent, 1),
        accentRgb: accent,
        accentSoft: rgba(accent, 0.85),
        accentFaint: rgba(accent, 0.16),
        accentLine: rgba(accent, 0.4),
        accentBright: rgba(accentBrightRgb, 1),
      };
    };
    let PAL: Palette = readPalette();

    /* ---------------- canvas + geometry helpers ---------------- */
    const fitCanvas = (
      c: HTMLCanvasElement,
      cssW: number,
      cssH: number
    ): CanvasRenderingContext2D => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.max(1, Math.round(cssW * dpr));
      c.height = Math.max(1, Math.round(cssH * dpr));
      const cx = c.getContext("2d")!;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return cx;
    };
    const rr = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      r = Math.min(r, w / 2, h / 2);
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    };
    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const easeInOut = (t: number) => {
      t = clamp01(t);
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    const line = (
      c: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
    };

    const SERVICE = 360; /* minutes across the service, 17:00 to 23:00 */
    const INTRO = 1.8;
    const RUN = 30;
    const HOLD = 5.5;
    const FADE = 1.2;
    const CYCLE = INTRO + RUN + HOLD + FADE;

    /* tables: fx,fy are fractions of the canvas box (matched by the HTML readout
       buttons overlaid on top). res = reservations {s:seat minute, d:duration,
       p:party}. shape drives the drawn footprint and chairs. */
    const TABLES: Table[] = [
      { fx: 0.15, fy: 0.245, shape: "round", seats: 2, res: [{ s: 25, d: 80, p: 2 }, { s: 150, d: 80, p: 2 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
      { fx: 0.29, fy: 0.245, shape: "round", seats: 2, res: [{ s: 55, d: 75, p: 2 }, { s: 175, d: 70, p: 2 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
      { fx: 0.43, fy: 0.245, shape: "round", seats: 2, res: [{ s: 85, d: 80, p: 2 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
      { fx: 0.57, fy: 0.245, shape: "round", seats: 2, res: [{ s: 110, d: 80, p: 2 }, { s: 215, d: 65, p: 2 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
      { fx: 0.16, fy: 0.41, shape: "square", seats: 4, res: [{ s: 40, d: 95, p: 4 }, { s: 165, d: 90, p: 3 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
      { fx: 0.30, fy: 0.41, shape: "square", seats: 4, res: [{ s: 70, d: 95, p: 4 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
      { fx: 0.45, fy: 0.41, shape: "square", seats: 4, res: [{ s: 95, d: 100, p: 4 }, { s: 210, d: 85, p: 4 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
      { fx: 0.60, fy: 0.41, shape: "square", seats: 4, res: [{ s: 125, d: 95, p: 4 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
      { fx: 0.85, fy: 0.33, shape: "rectV", seats: 6, res: [{ s: 90, d: 120, p: 6 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
      { fx: 0.19, fy: 0.57, shape: "square", seats: 4, res: [{ s: 135, d: 95, p: 4 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
      { fx: 0.42, fy: 0.57, shape: "rectH", seats: 6, res: [{ s: 150, d: 110, p: 5 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
      { fx: 0.62, fy: 0.57, shape: "round", seats: 2, res: [{ s: 60, d: 75, p: 2 }, { s: 175, d: 72, p: 2 }], x: 0, y: 0, r: 0, hw: 0, hh: 0 },
    ];

    /* precompute the covers curve, its peak, and the rush marker time */
    const COV = new Float32Array(SERVICE + 1);
    let peakV = 1;
    let peakT = 0;
    for (let t = 0; t <= SERVICE; t++) {
      let c = 0;
      for (let i = 0; i < TABLES.length; i++) {
        const rs = TABLES[i].res;
        for (let j = 0; j < rs.length; j++) {
          if (t >= rs[j].s && t < rs[j].s + rs[j].d) c += rs[j].p;
        }
      }
      COV[t] = c;
      if (c > peakV) {
        peakV = c;
        peakT = t;
      }
    }
    const maxCov = peakV * 1.16;
    const rushT = Math.max(0, peakT - 60);

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let cycT = 0;
    let compact = false;
    let tagH = 30; /* measured height of the stage-tag, drives clock clearance */

    const clampN = (v: number, a: number, b: number) =>
      v < a ? a : v > b ? b : v;

    /* Vertical layout as pixel bands derived from the measured width, so the
       frame height fits the composition at every width (no fixed tall box, no
       letterbox). One source of truth: the same math sets the canvas height and
       positions the room + covers band. */
    const bands = () => {
      const clockY = tagH + 26; /* axis sits below the tag + its hour labels */
      const roomY0 = clockY + 36; /* gap holds the playhead time label */
      const roomH = clampN(W * 0.25, 188, 280);
      const roomY1 = roomY0 + roomH;
      const loadTop = roomY1 + 34; /* clear gap between room and covers labels */
      const covH = clampN(W * 0.13, 118, 150);
      const loadBase = loadTop + covH;
      const height = Math.round(loadBase + 34); /* clears the bottom caption */
      return { clockY, roomY0, roomY1, loadTop, loadBase, height };
    };

    let G: Geo = {
      x0: 0,
      x1: 0,
      clockY: 0,
      roomX0: 0,
      roomX1: 0,
      roomY0: 0,
      roomY1: 0,
      loadTop: 0,
      loadBase: 0,
      door: { x: 0, y: 0 },
      unit: 12,
    };

    const layout = () => {
      const b = bands();
      G.x0 = W * 0.075;
      G.x1 = W * 0.94; /* shared time axis for clock strip + load line */
      G.clockY = b.clockY;
      G.roomX0 = W * 0.045;
      G.roomX1 = W * 0.955;
      G.roomY0 = b.roomY0;
      G.roomY1 = b.roomY1;
      G.loadTop = b.loadTop;
      G.loadBase = b.loadBase;
      const roomH = G.roomY1 - G.roomY0;
      G.door = { x: W * 0.075, y: G.roomY0 + roomH * 0.84 };
      G.unit = Math.max(12, Math.min(29, W * 0.027));
      for (let i = 0; i < TABLES.length; i++) {
        const T = TABLES[i];
        const u = G.unit;
        T.x = T.fx * W;
        /* map each table's canvas-fraction fy (0.245 to 0.57) into the room
           band so tables always sit inside the room at every height */
        const ry = clampN(0.16 + 2.154 * (T.fy - 0.245), 0.08, 0.9);
        T.y = G.roomY0 + ry * roomH;
        if (T.shape === "round") {
          T.r = u * 0.72;
          T.hw = T.r;
          T.hh = T.r;
        } else if (T.shape === "square") {
          T.hw = u * 0.82;
          T.hh = u * 0.82;
        } else if (T.shape === "rectH") {
          T.hw = u * 1.5;
          T.hh = u * 0.72;
        } else if (T.shape === "rectV") {
          T.hw = u * 0.72;
          T.hh = u * 1.5;
        }
      }
    };
    const timeX = (t: number) => G.x0 + (t / SERVICE) * (G.x1 - G.x0);
    const covY = (c: number) =>
      G.loadBase - (c / maxCov) * (G.loadBase - G.loadTop);
    const covAt = (t: number) => {
      if (t <= 0) return COV[0];
      if (t >= SERVICE) return COV[SERVICE];
      const i = Math.floor(t);
      const f = t - i;
      return COV[i] + (COV[i + 1] - COV[i]) * f;
    };
    const clockLabel = (m: number) => {
      let mm = Math.round(m / 5) * 5;
      if (mm > SERVICE) mm = SERVICE;
      const h = 17 + Math.floor(mm / 60);
      const r = mm % 60;
      return h + ":" + (r < 10 ? "0" + r : r);
    };

    /* warmth of a table at minute t: rises after seating, holds, cools at turn */
    const warmth = (T: Table, t: number) => {
      let w = 0;
      const rs = T.res;
      const WI = 8;
      const CO = 11;
      for (let j = 0; j < rs.length; j++) {
        const s = rs[j].s;
        const e = s + rs[j].d;
        let c;
        if (t <= s || t >= e) c = 0;
        else if (t < s + WI) c = easeInOut((t - s) / WI);
        else if (t > e - CO) c = 1 - easeInOut((t - (e - CO)) / CO);
        else c = 1;
        if (c > w) w = c;
      }
      return w;
    };

    const drawChair = (
      cx: number,
      cy: number,
      vertical: boolean,
      warm: number
    ) => {
      const u = G.unit;
      const cw = u * 0.6;
      const ch = u * 0.34;
      const w = vertical ? ch : cw;
      const h = vertical ? cw : ch;
      rr(ctx, cx - w / 2, cy - h / 2, w, h, Math.min(w, h) * 0.4);
      const col = mix(PAL.mutedRgb, PAL.accentRgb, Math.min(1, warm));
      ctx.fillStyle = rgba(col, 0.4 + 0.5 * warm);
      ctx.fill();
    };

    const drawTable = (T: Table, t: number) => {
      const w = warmth(T, t);
      const frgb = mix(PAL.cardRgb, PAL.accentRgb, w * 0.82);
      const srgb = mix(PAL.lineRgb, PAL.accentRgb, Math.min(1, w * 1.15));
      const u = G.unit;
      const gap = u * 0.62;

      /* chairs first, tucked around the footprint */
      if (T.shape === "round") {
        drawChair(T.x, T.y - T.r - gap, false, w);
        drawChair(T.x, T.y + T.r + gap, false, w);
      } else if (T.shape === "square") {
        drawChair(T.x, T.y - T.hh - gap, false, w);
        drawChair(T.x, T.y + T.hh + gap, false, w);
        drawChair(T.x - T.hw - gap, T.y, true, w);
        drawChair(T.x + T.hw + gap, T.y, true, w);
      } else if (T.shape === "rectH") {
        const xs = [T.x - T.hw * 0.55, T.x, T.x + T.hw * 0.55];
        for (let a = 0; a < 3; a++) {
          drawChair(xs[a], T.y - T.hh - gap, false, w);
          drawChair(xs[a], T.y + T.hh + gap, false, w);
        }
      } else if (T.shape === "rectV") {
        const ys = [T.y - T.hh * 0.55, T.y, T.y + T.hh * 0.55];
        for (let b = 0; b < 3; b++) {
          drawChair(T.x - T.hw - gap, ys[b], true, w);
          drawChair(T.x + T.hw + gap, ys[b], true, w);
        }
      }

      /* the table top */
      ctx.fillStyle = rgba(frgb, 1);
      ctx.strokeStyle = rgba(srgb, 0.9);
      ctx.lineWidth = 1.4;
      if (T.shape === "round") {
        ctx.beginPath();
        ctx.arc(T.x, T.y, T.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        rr(ctx, T.x - T.hw, T.y - T.hh, T.hw * 2, T.hh * 2, Math.min(u * 0.4, 7));
        ctx.fill();
        ctx.stroke();
      }
      /* a soft warm bloom when seated */
      if (w > 0.02) {
        ctx.save();
        ctx.globalAlpha = w * 0.5;
        ctx.fillStyle = PAL.accentSoft;
        const gg = ctx.createRadialGradient(
          T.x,
          T.y,
          0,
          T.x,
          T.y,
          Math.max(T.hw, T.hh) + u * 0.4
        );
        gg.addColorStop(0, rgba(PAL.accentRgb, 0.5));
        gg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(T.x, T.y, Math.max(T.hw, T.hh) + u * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const drawRoom = () => {
      /* floor outline */
      rr(ctx, G.roomX0, G.roomY0, G.roomX1 - G.roomX0, G.roomY1 - G.roomY0, 16);
      ctx.fillStyle = rgba(PAL.panelRgb, PAL.dark ? 0.35 : 0.45);
      ctx.fill();
      ctx.strokeStyle = PAL.lineSoft;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      /* entrance mark, bottom-left */
      ctx.strokeStyle = PAL.accentLine;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(G.roomX0, G.door.y - G.unit * 0.7);
      ctx.lineTo(G.roomX0, G.door.y + G.unit * 0.7);
      ctx.stroke();
      ctx.font = "600 9px " + MONO;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillStyle = PAL.muted;
      /* keep the label inside the room so it never crowds the covers-band label
         below, even when the table unit grows on wide screens */
      ctx.fillText(
        "ENTRANCE",
        G.roomX0 + 6,
        Math.min(G.door.y + G.unit * 0.7 + 12, G.roomY1 - 16)
      );
    };

    const drawClock = (t: number) => {
      ctx.strokeStyle = PAL.line;
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      line(ctx, G.x0, G.clockY, G.x1, G.clockY);
      ctx.font = "600 " + (compact ? 10 : 9) + "px " + MONO;
      ctx.textBaseline = "alphabetic";
      /* label every hour when they fit, else every other, so labels never
         collide (independent of the composition, so nothing changes near the
         handoff width) */
      const dense = (G.x1 - G.x0) / 6 >= 52;
      for (let h = 0; h <= 6; h++) {
        const m = h * 60;
        const x = timeX(m);
        ctx.strokeStyle = PAL.lineSoft;
        ctx.lineWidth = 1.4;
        line(ctx, x, G.clockY - 4, x, G.clockY + 4);
        if (dense || h % 2 === 0) {
          ctx.fillStyle = PAL.muted;
          ctx.textAlign = "center";
          ctx.fillText(17 + h + ":00", x, G.clockY - 10);
        }
      }
      /* playhead: dot on the axis, connector down to the room, time label placed
         BELOW the axis so it can never collide with the frame tag above */
      const px = timeX(t);
      ctx.fillStyle = PAL.accent;
      ctx.beginPath();
      ctx.arc(px, G.clockY, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PAL.accentLine;
      ctx.lineWidth = 1;
      line(ctx, px, G.clockY + 5, px, G.roomY0 - 4);
      ctx.font = "600 11px " + MONO;
      ctx.fillStyle = PAL.accentBright;
      const near = px > G.x1 - 44;
      ctx.textAlign = near ? "right" : "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(clockLabel(t), near ? px - 7 : px + 7, G.clockY + 16);
    };

    const drawChips = (t: number) => {
      const lead = 16;
      const fade = 6;
      for (let i = 0; i < TABLES.length; i++) {
        const T = TABLES[i];
        const rs = T.res;
        for (let j = 0; j < rs.length; j++) {
          const s = rs[j].s;
          if (t < s - lead || t > s + fade) continue;
          let x;
          let y;
          let a;
          let sc;
          if (t <= s) {
            const u = easeInOut(clamp01((t - (s - lead)) / lead));
            x = G.door.x + (T.x - G.door.x) * u;
            y = G.door.y + (T.y - G.door.y) * u;
            a = Math.min(1, 0.35 + u);
            sc = 0.6 + 0.4 * u;
          } else {
            x = T.x;
            y = T.y;
            a = 1 - clamp01((t - s) / fade);
            sc = 1 - 0.25 * clamp01((t - s) / fade);
          }
          if (a <= 0.02) continue;
          const cw = G.unit * 1.35 * sc;
          const ch = G.unit * 0.82 * sc;
          ctx.save();
          ctx.globalAlpha = a;
          rr(ctx, x - cw / 2, y - ch / 2, cw, ch, ch * 0.3);
          ctx.fillStyle = PAL.panel;
          ctx.fill();
          ctx.strokeStyle = PAL.accentSoft;
          ctx.lineWidth = 1.3;
          ctx.stroke();
          ctx.fillStyle = PAL.accentBright;
          ctx.font = "600 " + (G.unit * 0.62).toFixed(0) + "px " + MONO;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(rs[j].p), x, y + 0.5);
          ctx.restore();
        }
      }
    };

    const drawLoad = (t: number) => {
      const n = Math.max(0, Math.min(SERVICE, Math.floor(t)));
      const plotTop = covY(peakV);
      /* label */
      ctx.font = "600 " + (compact ? 10 : 9) + "px " + MONO;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.fillStyle = PAL.muted;
      ctx.fillText("COVERS OVER THE EVENING", G.x0, G.loadTop - 8);
      ctx.textAlign = "right";
      ctx.fillText("ILLUSTRATIVE", G.x1, G.loadTop - 8);

      /* designed presence from t0: faint horizontal gridlines, hour ticks tying
         the band to the timeline, a ghost of the full evening curve, and its
         endpoints. The band reads as a chart even before the covers accumulate,
         so it never looks like an empty reserved region. */
      ctx.strokeStyle = PAL.lineSoft;
      ctx.lineWidth = 1;
      for (let gth = 1; gth <= 2; gth++) {
        const gy = covY((peakV * gth) / 3);
        line(ctx, G.x0, gy, G.x1, gy);
      }
      for (let h = 0; h <= 6; h++) {
        const gx = timeX(h * 60);
        line(ctx, gx, G.loadBase, gx, G.loadBase - (G.loadBase - plotTop) * 0.16);
      }
      ctx.strokeStyle = rgba(PAL.accentRgb, 0.17);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(timeX(0), covY(COV[0]));
      for (let k = 4; k <= SERVICE; k += 4) ctx.lineTo(timeX(k), covY(COV[k]));
      ctx.stroke();
      ctx.fillStyle = rgba(PAL.accentRgb, 0.26);
      ctx.beginPath();
      ctx.arc(timeX(0), covY(COV[0]), 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(timeX(SERVICE), covY(COV[SERVICE]), 2.4, 0, Math.PI * 2);
      ctx.fill();

      /* baseline */
      ctx.strokeStyle = PAL.line;
      ctx.lineWidth = 1;
      ctx.textAlign = "left";
      line(ctx, G.x0, G.loadBase, G.x1, G.loadBase);

      if (n >= 1) {
        let k;
        /* filled area up to the current time */
        ctx.beginPath();
        ctx.moveTo(timeX(0), G.loadBase);
        for (k = 0; k <= n; k++) ctx.lineTo(timeX(k), covY(COV[k]));
        ctx.lineTo(timeX(t), covY(covAt(t)));
        ctx.lineTo(timeX(t), G.loadBase);
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
        /* moving head */
        ctx.fillStyle = PAL.accentBright;
        ctx.beginPath();
        ctx.arc(timeX(t), covY(covAt(t)), 3, 0, Math.PI * 2);
        ctx.fill();
      }

      /* the calm rush marker: an hour before the peak, the climb is already
         legible. It is revealed as the evening reaches that point. */
      if (t >= rushT) {
        const rx = timeX(rushT);
        const topY = covY(peakV) - 6;
        ctx.save();
        ctx.setLineDash([4, 5]);
        ctx.strokeStyle = PAL.accentSoft;
        ctx.lineWidth = 1.4;
        line(ctx, rx, G.loadBase, rx, topY);
        ctx.setLineDash([]);
        /* small dot where the marker meets the covers line */
        ctx.fillStyle = PAL.accent;
        ctx.beginPath();
        ctx.arc(rx, covY(covAt(Math.min(t, rushT > 0 ? rushT : 0))), 2.6, 0, Math.PI * 2);
        ctx.fill();
        if (t >= peakT) {
          ctx.setLineDash([2, 5]);
          ctx.strokeStyle = PAL.accentLine;
          ctx.lineWidth = 1;
          line(ctx, rx, topY, timeX(peakT), topY);
          ctx.setLineDash([]);
          ctx.fillStyle = PAL.accentBright;
          ctx.beginPath();
          ctx.arc(timeX(peakT), covY(peakV), 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
        /* the calm label, kept inside the plot just above the peak marker and
           below the COVERS label row, so it never clips or collides */
        const ly = Math.max(G.loadTop + 12, topY - 4);
        ctx.font = "600 11px " + MONO;
        ctx.fillStyle = PAL.accentBright;
        const leftAnchor = rx < W * 0.5;
        ctx.textAlign = leftAnchor ? "left" : "right";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(
          compact ? "rush, an hour early" : "the rush, visible an hour early",
          leftAnchor ? rx + 7 : rx - 7,
          ly
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
      for (let i = 0; i < TABLES.length; i++) drawTable(TABLES[i], t);
      if (showChips) drawChips(t);
      drawLoad(t);
      if (fo < 1) {
        ctx.fillStyle = rgba(PAL.groundRgb, 1 - fo);
        ctx.fillRect(0, 0, W, H);
      }
    };

    const setCaption = (t: number, holding: boolean) => {
      if (!caption) return;
      let s;
      if (holding) s = "one evening";
      else if (t < 2) s = "service begins";
      else if (t < rushT) s = "filling";
      else if (t < peakT) s = "the rush, flagged early";
      else s = "peak service";
      caption.textContent = s;
    };

    const resolved = () => {
      /* static snapshot at the fullest point of the evening, curve up to the
         peak, rush marker shown. Used for reduced motion and the paused state. */
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

      /* gentle opacity dip at the loop seam so the reset is not jarring */
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

    /* keep the accessible table readouts aligned with the drawn tables at every
       width and height (positions come from the same geometry the canvas uses,
       so hotspots never drift, including near the composition handoff) */
    const btns = frameEl.querySelectorAll<HTMLElement>(".table-btn");
    const positionReadouts = () => {
      for (let i = 0; i < TABLES.length && i < btns.length; i++) {
        btns[i].style.left = ((TABLES[i].x / W) * 100).toFixed(2) + "%";
        btns[i].style.top = ((TABLES[i].y / H) * 100).toFixed(2) + "%";
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      compact = W < 520;
      const tagEl = frameEl.querySelector<HTMLElement>(".stage-tag");
      tagH = tagEl ? tagEl.offsetTop + tagEl.offsetHeight : 30;
      /* the composition sets its own height so the frame always fits it */
      H = bands().height;
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
      PAL = readPalette();
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
      if (io) io.disconnect();
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMQ.removeEventListener("change", onReduce);
      window.removeEventListener("cardon-mode", onMode);
    };
  }, []);

  return (
    <div className="stage-frame vis-frame" id="floorFrame" ref={frameRef}>
      <span className="stage-tag mono">
        one evening <span className="warm">17:00 to 23:00</span>
      </span>
      <span className="stage-caption mono" id="floorCaption" ref={captionRef}>
        service begins
      </span>
      <canvas id="floorCanvas" ref={canvasRef} aria-hidden="true" />

      {READOUTS.map((b, i) => (
        <button
          key={i}
          className={("table-btn " + b.cls).trim()}
          type="button"
          style={{ left: b.left, top: b.top }}
          aria-label={b.aria}
        >
          <span className="table-plate">
            <span className="plate-name">{b.name}</span>
            <span className="plate-detail">{b.detail}</span>
            <span className="plate-illus">illustrative</span>
          </span>
        </button>
      ))}

      <noscript>
        <div className="stage-fallback">
          A top-down floor plan of a dining room across one service, from 17:00 to
          23:00. Reservations dock onto tables as small chips, tables warm as they
          seat and cool as they turn, and a quiet load line tracks covers over the
          evening. An hour before the peak, a calm marker shows the rush arriving,
          visible early rather than as a surprise.
        </div>
      </noscript>
    </div>
  );
}
