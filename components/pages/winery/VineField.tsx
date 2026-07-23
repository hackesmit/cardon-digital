"use client";

import { useEffect, useRef } from "react";

type RGB = [number, number, number];
type Pt = { x: number; y: number };
type Trace = { pts: Pt[]; cum: number[]; len: number };
type Row = {
  line: Trace;
  report: Trace;
  endY: number;
  latch: number;
  heads: number[];
  spawn: number;
  latched: boolean;
};
type Geom = {
  xL: number;
  xC: number;
  bcx: number;
  bw: number;
  bh: number;
  bTop: number;
  CN: Pt;
  neck: Pt;
};

const VINE_ROWS = [
  {
    name: "Cabernet / Bloque A",
    aria: "Cabernet, Bloque A. Reporting to the cellar view. Highlight this row.",
  },
  {
    name: "Nebbiolo / Bloque B",
    aria: "Nebbiolo, Bloque B. Reporting to the cellar view. Highlight this row.",
  },
  {
    name: "Chenin / Bloque C",
    aria: "Chenin, Bloque C. Reporting to the cellar view. Highlight this row.",
  },
  {
    name: "Merlot / Bloque D",
    aria: "Merlot, Bloque D. Reporting to the cellar view. Highlight this row.",
  },
  {
    name: "Tempranillo / Bloque E",
    aria: "Tempranillo, Bloque E. Reporting to the cellar view. Highlight this row.",
  },
  {
    name: "Chardonnay / Bloque F",
    aria: "Chardonnay, Bloque F. Reporting to the cellar view. Highlight this row.",
  },
  {
    name: "Grenache / Bloque G",
    aria: "Grenache, Bloque G. Reporting to the cellar view. Highlight this row.",
  },
];

/**
 * Signature visual: a field of parallel vine-row lines (following the contours)
 * each carrying a slow stream of readings toward one collection channel that
 * feeds a live panel, a bottle that fills as rows report. Hover or focus lights
 * that row's full path into the panel and raises its readout plate. Every row
 * reports, one place reads.
 *
 * Ported from the approved winery concept: rAF loop, DPR cap 2,
 * IntersectionObserver plus visibilitychange pausing, prefers-reduced-motion
 * resolves to a static full bottle, and the palette re-reads on the window
 * "cardon-mode" event when the mode toggle fires.
 */
export default function VineField() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    const caption = captionRef.current;
    if (!stage || !canvas || !canvas.getContext) return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;

    const MONO = 'ui-monospace, "SFMono-Regular", Consolas, monospace';

    const WHITE: RGB = [255, 255, 255];
    const BLACK: RGB = [12, 12, 12];
    const WINE: RGB = [122, 34, 51];

    const cssVar = (name: string) =>
      getComputedStyle(root).getPropertyValue(name).trim();
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

    const PAL = {
      dark: true,
      groundRgb: [15, 20, 16] as RGB,
      ground: "",
      panelRgb: [22, 32, 26] as RGB,
      panel: "",
      card: "",
      textRgb: [228, 234, 217] as RGB,
      ink: "",
      dim: "",
      faint: "",
      muted: "",
      line: "",
      lineSoft: "",
      primaryRgb: [63, 181, 138] as RGB,
      primary: "",
      primarySoft: "",
      primaryFaint: "",
      primaryDim: "",
      primaryBright: "",
      secondaryRgb: [217, 168, 58] as RGB,
      secondary: "",
      secondarySoft: "",
      secondaryBright: "",
      energyRgb: [195, 73, 27] as RGB,
      energy: "",
      energyBright: "",
      wineRgb: [122, 34, 51] as RGB,
      wine: "",
      wineLit: "",
      wineLitRgb: [122, 34, 51] as RGB,
      wineSoft: "",
      wineFaint: "",
      wineGlow: "",
      wineFillTop: "",
      wineFillBot: "",
    };

    const readPalette = () => {
      const ground = hexToRgb(cssVar("--ground") || "#0F1410");
      const panel = hexToRgb(cssVar("--panel") || "#16201A");
      const text = hexToRgb(cssVar("--text") || "#E4EAD9");
      const primary = hexToRgb(cssVar("--primary") || "#3FB58A");
      const secondary = hexToRgb(cssVar("--secondary") || "#D9A83A");
      const energy = hexToRgb(cssVar("--energy") || "#C3491B");
      const dark = root.getAttribute("data-mode") !== "light";
      const toward: RGB = dark ? WHITE : BLACK;

      PAL.dark = dark;
      PAL.groundRgb = ground;
      PAL.ground = rgba(ground, 1);
      PAL.panelRgb = panel;
      PAL.panel = rgba(panel, 1);
      PAL.card = rgba(mix(panel, text, 0.08), 1);
      PAL.textRgb = text;
      PAL.ink = rgba(text, 1);
      PAL.dim = rgba(text, 0.74);
      PAL.faint = rgba(text, 0.34);
      PAL.muted = rgba(mix(text, panel, 0.5), 1);
      PAL.line = rgba(mix(primary, text, 0.35), 0.22);
      PAL.lineSoft = rgba(mix(primary, text, 0.35), 0.12);
      PAL.primaryRgb = primary;
      PAL.primary = rgba(primary, 1);
      PAL.primarySoft = rgba(primary, 0.85);
      PAL.primaryFaint = rgba(primary, 0.14);
      PAL.primaryDim = rgba(primary, 0.5);
      PAL.primaryBright = rgba(mix(primary, toward, 0.3), 1);
      PAL.secondaryRgb = secondary;
      PAL.secondary = rgba(secondary, 1);
      PAL.secondarySoft = rgba(secondary, 0.85);
      PAL.secondaryBright = rgba(mix(secondary, toward, 0.28), 1);
      PAL.energyRgb = energy;
      PAL.energy = rgba(energy, 1);
      PAL.energyBright = rgba(mix(energy, toward, 0.25), 1);

      const wineLit = dark
        ? mix(WINE, [255, 150, 168] as RGB, 0.55)
        : mix(WINE, BLACK, 0.06);
      const wineGlow: RGB = dark ? [235, 176, 190] : mix(WINE, WHITE, 0.3);
      PAL.wineRgb = WINE;
      PAL.wine = rgba(WINE, 1);
      PAL.wineLit = rgba(wineLit, 1);
      PAL.wineLitRgb = wineLit;
      PAL.wineSoft = rgba(wineLit, 0.85);
      PAL.wineFaint = rgba(wineLit, 0.16);
      PAL.wineGlow = rgba(wineGlow, 1);
      PAL.wineFillTop = rgba(
        dark ? mix(WINE, [210, 120, 138] as RGB, 0.42) : WINE,
        0.94
      );
      PAL.wineFillBot = rgba(
        dark ? mix(WINE, BLACK, 0.3) : mix(WINE, BLACK, 0.14),
        0.96
      );
    };
    readPalette();

    const fitCanvas = (c: HTMLCanvasElement, cssW: number, cssH: number) => {
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
    const makeTrace = (pts: Pt[]): Trace => {
      const cum = [0];
      let total = 0;
      for (let i = 1; i < pts.length; i++) {
        total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        cum.push(total);
      }
      return { pts, cum, len: total };
    };
    const dedupe = (pts: Pt[]): Pt[] => {
      const out = [pts[0]];
      for (let i = 1; i < pts.length; i++) {
        const a = out[out.length - 1];
        const b = pts[i];
        if (Math.abs(a.x - b.x) > 0.01 || Math.abs(a.y - b.y) > 0.01) out.push(b);
      }
      return out;
    };
    const pointAtLen = (tr: Trace, L: number): Pt => {
      const pts = tr.pts;
      const cum = tr.cum;
      if (L <= 0) return { x: pts[0].x, y: pts[0].y };
      if (L >= tr.len)
        return { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y };
      for (let i = 1; i < pts.length; i++) {
        if (cum[i] >= L) {
          const seg = cum[i] - cum[i - 1];
          const t = (L - cum[i - 1]) / (seg || 1);
          return {
            x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t,
            y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t,
          };
        }
      }
      return { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y };
    };
    const strokeTrace = (c: CanvasRenderingContext2D, tr: Trace, L?: number) => {
      const pts = tr.pts;
      const cum = tr.cum;
      if (L === undefined) L = tr.len;
      if (L <= 0) return;
      c.beginPath();
      c.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        if (cum[i] <= L) {
          c.lineTo(pts[i].x, pts[i].y);
        } else {
          const seg = cum[i] - cum[i - 1];
          const t = (L - cum[i - 1]) / (seg || 1);
          c.lineTo(
            pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t,
            pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t
          );
          break;
        }
      }
      c.stroke();
    };
    const drawFlow = (
      c: CanvasRenderingContext2D,
      tr: Trace,
      L: number,
      trailCol: string,
      coreCol: string
    ) => {
      const trail = 42;
      const seg = 6;
      c.lineCap = "round";
      for (let k = 0; k < seg; k++) {
        const l1 = L - (trail * k) / seg;
        const l0 = L - (trail * (k + 1)) / seg;
        if (l1 < 0) break;
        const p0 = pointAtLen(tr, Math.max(0, l0));
        const p1 = pointAtLen(tr, Math.max(0, l1));
        c.globalAlpha = (1 - k / seg) * 0.85;
        c.strokeStyle = trailCol;
        c.lineWidth = 2.2 - k * 0.16;
        c.beginPath();
        c.moveTo(p0.x, p0.y);
        c.lineTo(p1.x, p1.y);
        c.stroke();
      }
      const hp = pointAtLen(tr, L);
      c.globalAlpha = 0.5;
      c.fillStyle = trailCol;
      c.beginPath();
      c.arc(hp.x, hp.y, 4, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
      c.fillStyle = coreCol;
      c.beginPath();
      c.arc(hp.x, hp.y, 1.9, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
    };
    const drawMark = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      col: string
    ) => {
      c.save();
      c.translate(x, y);
      c.strokeStyle = col;
      c.lineWidth = 1.2;
      c.globalAlpha = 0.85;
      c.beginPath();
      c.moveTo(6, 14);
      c.lineTo(1, 3);
      c.moveTo(6, 14);
      c.lineTo(11, 3);
      c.moveTo(1, 3);
      c.lineTo(11, 3);
      c.stroke();
      c.globalAlpha = 1;
      c.fillStyle = PAL.secondary;
      c.beginPath();
      c.arc(6, 14, 2.3, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = PAL.panel;
      c.strokeStyle = col;
      c.lineWidth = 1.2;
      c.beginPath();
      c.arc(1, 3, 2, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.beginPath();
      c.arc(11, 3, 2, 0, Math.PI * 2);
      c.fill();
      c.stroke();
      c.restore();
    };

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let T = 0;
    // compact portrait composition below this measured canvas width
    let compact = false;

    const ROWN = 7;
    const rowFrac: number[] = [];
    for (let ri = 0; ri < ROWN; ri++) rowFrac.push(0.15 + (0.7 * ri) / (ROWN - 1));

    let geom: Geom | null = null;
    let rows: Row[] = [];
    let active: number | null = null;
    let activeL = 0;
    let ripples: { t: number }[] = [];

    const INTRO = 0.5;
    const FILL = 12.5;
    let fillLevel = 0;

    const layout = () => {
      compact = W < 520;

      if (compact) {
        // Portrait recomposition: a field of vine rows across the top funnels
        // its readings down into one collection node, then a vertical channel
        // drops into a large centered bottle that fills as rows report. Reads
        // top to bottom on a phone held upright.
        const RN = 5;
        const bw = Math.min(Math.max(W * 0.32, 92), 132);
        const bh = Math.min(H * 0.4, 250);
        const bcx = W * 0.5;
        const bTop = H * 0.52;
        const CN: Pt = { x: W * 0.5, y: H * 0.445 };
        const neck: Pt = { x: bcx, y: bTop + 2 };
        const xL = W * 0.09;
        const xR = W * 0.8;
        geom = { xL, xC: CN.x, bcx, bw, bh, bTop, CN, neck };

        rows = [];
        const rowsTop = H * 0.16;
        const rowsBot = H * 0.375;
        const samples = 40;
        for (let i = 0; i < RN; i++) {
          const yf = rowsTop + (rowsBot - rowsTop) * (i / (RN - 1));
          const linePts: Pt[] = [];
          for (let j = 0; j <= samples; j++) {
            const xf = j / samples;
            const x = xL + (xR - xL) * xf;
            const wob =
              4.5 * Math.sin(xf * 4.4 + i * 0.5) +
              2.6 * Math.sin(xf * 2.2 - 0.4 + i * 0.3);
            linePts.push({ x, y: yf + wob });
          }
          const line = makeTrace(dedupe(linePts));
          const reportPts = linePts.concat([
            { x: CN.x, y: CN.y },
            { x: neck.x, y: neck.y },
          ]);
          const report = makeTrace(dedupe(reportPts));
          rows.push({
            line,
            report,
            endY: yf,
            latch: 0.1 + 0.82 * (i / (RN - 1)),
            heads: [],
            spawn: 0.6 + i * 0.42,
            latched: false,
          });
        }
        placeOverlays();
        return;
      }

      const xL = W * 0.055;
      const xC = W * 0.635;
      const avail = Math.max(60, W - xC);
      const bw = Math.max(30, Math.min(avail * 0.5, 66));
      let bcx = xC + avail * 0.52;
      if (bcx + bw / 2 > W - 10) bcx = W - 10 - bw / 2;
      const bh = Math.min(H * 0.66, 300);
      const bTop = H * 0.5 - bh * 0.5;
      const CN: Pt = { x: xC, y: H * 0.5 };
      const neck: Pt = { x: bcx, y: bTop + 2 };

      geom = { xL, xC, bcx, bw, bh, bTop, CN, neck };

      rows = [];
      const samples = 46;
      for (let i = 0; i < ROWN; i++) {
        const linePts: Pt[] = [];
        for (let j = 0; j <= samples; j++) {
          const xf = j / samples;
          const x = xL + (xC - xL) * xf;
          const yf =
            rowFrac[i] +
            0.034 * Math.sin(xf * 5.4 + i * 0.22) * 0.6 +
            0.034 * Math.sin(xf * 3.0 - 0.5 + i * 0.14) * 0.4;
          const y = yf * H;
          linePts.push({ x, y });
        }
        const rowEndY = linePts[linePts.length - 1].y;
        const line = makeTrace(dedupe(linePts));
        const reportPts = linePts.concat([
          { x: xC, y: CN.y },
          { x: neck.x, y: neck.y },
        ]);
        const report = makeTrace(dedupe(reportPts));
        rows.push({
          line,
          report,
          endY: rowEndY,
          latch: rowFrac[i] * 0 + (0.12 + 0.8 * (i / (ROWN - 1))),
          heads: [],
          spawn: 0.6 + i * 0.42,
          latched: false,
        });
      }
      placeOverlays();
    };

    const placeOverlays = () => {
      if (!overlay || !geom) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      const btns = overlay.querySelectorAll<HTMLButtonElement>(".vine-row");
      if (compact) {
        const band = Math.max(30, (H * 0.215) / rows.length + 8);
        for (let i = 0; i < btns.length; i++) {
          if (i >= rows.length) {
            btns[i].style.display = "none";
            continue;
          }
          btns[i].style.display = "";
          const r = rows[i];
          const lx = r.line.pts[0].x;
          const rx = r.line.pts[r.line.pts.length - 1].x;
          const top = Math.max(50, r.endY - band / 2);
          btns[i].style.left = lx.toFixed(1) + "px";
          btns[i].style.width = Math.max(60, rx - lx).toFixed(1) + "px";
          btns[i].style.top = top.toFixed(1) + "px";
          btns[i].style.height = band.toFixed(1) + "px";
        }
        return;
      }
      const band = Math.max(20, (0.7 / (ROWN - 1)) * H * 0.74);
      for (let i = 0; i < btns.length && i < ROWN; i++) {
        btns[i].style.display = "";
        const midY = rowFrac[i] * H;
        const top = Math.max(2, midY - band / 2);
        btns[i].style.left = geom.xL.toFixed(1) + "px";
        btns[i].style.width = Math.max(40, geom.xC - geom.xL).toFixed(1) + "px";
        btns[i].style.top = top.toFixed(1) + "px";
        btns[i].style.height = band.toFixed(1) + "px";
      }
    };

    const drawSpine = () => {
      if (!ctx || !geom) return;
      const g = geom;
      if (compact) {
        // faint feeders from each row end converging into the collection node
        ctx.strokeStyle = PAL.lineSoft;
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        for (let i = 0; i < rows.length; i++) {
          const e = rows[i].line.pts[rows[i].line.pts.length - 1];
          ctx.beginPath();
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(g.CN.x, g.CN.y);
          ctx.stroke();
        }
        // vertical collection channel: node down to the bottle neck
        ctx.strokeStyle = PAL.line;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(g.CN.x, g.CN.y);
        ctx.lineTo(g.neck.x, g.neck.y);
        ctx.stroke();
        const pulseC = reduced()
          ? 0.5
          : 0.45 + 0.3 * Math.sin(performance.now() / 900);
        ctx.globalAlpha = 0.5 + pulseC * 0.4;
        ctx.fillStyle = PAL.primaryFaint;
        ctx.beginPath();
        ctx.arc(g.CN.x, g.CN.y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = PAL.primaryDim;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(g.CN.x, g.CN.y, 5.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = PAL.primary;
        ctx.beginPath();
        ctx.arc(g.CN.x, g.CN.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        return;
      }
      ctx.strokeStyle = PAL.line;
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(g.xC, rowFrac[0] * H);
      ctx.lineTo(g.xC, rowFrac[ROWN - 1] * H);
      ctx.stroke();
      ctx.strokeStyle = PAL.lineSoft;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(g.CN.x, g.CN.y);
      ctx.lineTo(g.neck.x, g.neck.y);
      ctx.stroke();
      const pulse = reduced()
        ? 0.5
        : 0.45 + 0.3 * Math.sin(performance.now() / 900);
      ctx.globalAlpha = 0.5 + pulse * 0.4;
      ctx.fillStyle = PAL.primaryFaint;
      ctx.beginPath();
      ctx.arc(g.CN.x, g.CN.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = PAL.primaryDim;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(g.CN.x, g.CN.y, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = PAL.primary;
      ctx.beginPath();
      ctx.arc(g.CN.x, g.CN.y, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawRows = () => {
      if (!ctx) return;
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const isActive = active === i;
        const dim = active !== null && !isActive;
        ctx.globalAlpha = dim ? 0.4 : 1;
        ctx.strokeStyle = r.latched ? PAL.primaryDim : PAL.line;
        ctx.lineWidth = r.latched ? 1.7 : 1.3;
        strokeTrace(ctx, r.line);
        const e = r.line.pts[r.line.pts.length - 1];
        ctx.fillStyle = r.latched ? PAL.secondary : PAL.faint;
        ctx.beginPath();
        ctx.arc(e.x, e.y, r.latched ? 2.6 : 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const drawStreams = () => {
      if (!ctx) return;
      for (let i = 0; i < rows.length; i++) {
        if (active !== null && active !== i) continue;
        const r = rows[i];
        for (let h = 0; h < r.heads.length; h++) {
          drawFlow(ctx, r.report, r.heads[h], PAL.primarySoft, PAL.secondaryBright);
        }
      }
    };

    const drawActive = () => {
      if (!ctx || active === null) return;
      const r = rows[active];
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = PAL.wineSoft;
      ctx.lineWidth = 2.2;
      strokeTrace(ctx, r.report);
      ctx.globalAlpha = 1;
      const L = reduced() ? r.report.len * 0.62 : activeL;
      drawFlow(ctx, r.report, L, PAL.wineSoft, PAL.wineGlow);
    };

    const drawBottle = () => {
      if (!ctx || !geom) return;
      const g = geom;
      const bcx = g.bcx;
      const bw = g.bw;
      const bh = g.bh;
      const bTop = g.bTop;
      const nw = bw * 0.34;
      const neckH = bh * 0.17;
      const shoulderH = bh * 0.12;
      const bodyTop = bTop + neckH + shoulderH;
      const bodyBot = bTop + bh;
      const blx = bcx - bw / 2;
      const brx = bcx + bw / 2;
      const nlx = bcx - nw / 2;
      const nrx = bcx + nw / 2;
      const c = ctx;

      const bottlePath = () => {
        const neckBotY = bTop + neckH;
        // handle length for the shoulder cubics; keeps the curve tangent to the
        // straight neck (vertical) at the top and to the straight body side
        // (vertical) at the bottom, so the shoulder reads as a smooth S.
        const sh = shoulderH * 0.55;
        // small lip: a subtle collar that flares out just below the capsule and
        // rejoins the neck. Top stays flush at nlx/nrx so the cap still fits and
        // the overall bounding box is unchanged.
        const lipOut = nw * 0.14;
        const lipTop = bTop + neckH * 0.16;
        const lipMid = bTop + neckH * 0.3;
        const lipBot = bTop + neckH * 0.46;
        c.beginPath();
        c.moveTo(nlx, bTop);
        c.lineTo(nlx, lipTop);
        c.quadraticCurveTo(nlx - lipOut, lipTop, nlx - lipOut, lipMid);
        c.quadraticCurveTo(nlx - lipOut, lipBot, nlx, lipBot);
        c.lineTo(nlx, neckBotY);
        c.bezierCurveTo(nlx, neckBotY + sh, blx, bodyTop - sh, blx, bodyTop);
        c.lineTo(blx, bodyBot - bw * 0.16);
        c.quadraticCurveTo(blx, bodyBot, bcx - bw * 0.28, bodyBot);
        c.lineTo(bcx + bw * 0.28, bodyBot);
        c.quadraticCurveTo(brx, bodyBot, brx, bodyBot - bw * 0.16);
        c.lineTo(brx, bodyTop);
        c.bezierCurveTo(brx, bodyTop - sh, nrx, neckBotY + sh, nrx, neckBotY);
        c.lineTo(nrx, lipBot);
        c.quadraticCurveTo(nrx + lipOut, lipBot, nrx + lipOut, lipMid);
        c.quadraticCurveTo(nrx + lipOut, lipTop, nrx, lipTop);
        c.lineTo(nrx, bTop);
        c.closePath();
      };

      c.save();
      bottlePath();
      c.fillStyle = PAL.panel;
      c.globalAlpha = 0.55;
      c.fill();
      c.globalAlpha = 1;

      const lvl = clamp01(fillLevel);
      const fillTopY = bodyBot - lvl * (bodyBot - bodyTop);
      c.save();
      bottlePath();
      c.clip();
      const grd = c.createLinearGradient(0, fillTopY, 0, bodyBot);
      grd.addColorStop(0, PAL.wineFillTop);
      grd.addColorStop(1, PAL.wineFillBot);
      c.fillStyle = grd;
      c.fillRect(blx - 3, fillTopY, bw + 6, bodyBot - fillTopY + 2);
      if (lvl > 0.02) {
        c.strokeStyle = PAL.wineGlow;
        c.lineWidth = 1.4;
        c.globalAlpha = 0.85;
        c.beginPath();
        c.moveTo(blx - 3, fillTopY);
        c.lineTo(brx + 3, fillTopY);
        c.stroke();
        c.globalAlpha = 1;
        for (let rp = 0; rp < ripples.length; rp++) {
          const a = 1 - ripples[rp].t;
          c.strokeStyle = PAL.wineGlow;
          c.globalAlpha = a * 0.5;
          c.lineWidth = 1;
          c.beginPath();
          c.ellipse(
            bcx,
            fillTopY,
            6 + ripples[rp].t * (bw * 0.4),
            2.4 + ripples[rp].t * 3,
            0,
            0,
            Math.PI * 2
          );
          c.stroke();
          c.globalAlpha = 1;
        }
      }
      c.restore();

      bottlePath();
      c.strokeStyle = PAL.primaryDim;
      c.lineWidth = 1.5;
      c.stroke();
      c.strokeStyle = rgba(PAL.textRgb, 0.1);
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(blx + 4, bodyTop + 6);
      c.lineTo(blx + 4, bodyBot - bw * 0.2);
      c.stroke();

      rr(c, nlx, bTop - 8, nw, 10, 2);
      c.fillStyle = PAL.secondary;
      c.globalAlpha = 0.9;
      c.fill();
      c.globalAlpha = 1;

      const labW = bw * 0.84;
      const labH = bh * 0.2;
      const labX = bcx - labW / 2;
      const labY = bodyTop + (bodyBot - bodyTop) * 0.34;
      rr(c, labX, labY, labW, labH, 4);
      c.fillStyle = PAL.card;
      c.fill();
      c.strokeStyle = PAL.line;
      c.lineWidth = 1;
      c.stroke();
      if (labW > 34) {
        c.strokeStyle = PAL.wineLit;
        c.globalAlpha = 0.8;
        c.lineWidth = 1.2;
        c.beginPath();
        c.moveTo(labX + 6, labY + labH * 0.42);
        c.lineTo(labX + labW - 6, labY + labH * 0.42);
        c.stroke();
        c.strokeStyle = PAL.muted;
        c.globalAlpha = 0.6;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(labX + 6, labY + labH * 0.66);
        c.lineTo(labX + labW * 0.62, labY + labH * 0.66);
        c.stroke();
        c.globalAlpha = 1;
      }
      c.restore();
    };

    const drawPanelChrome = (full: boolean) => {
      if (!ctx || !geom) return;
      const g = geom;
      if (compact) {
        // No top header in portrait (the stage-tag overlay is the title, so
        // there is nothing to collide with). A small status sits by the node
        // and one caption reads under the bottle.
        ctx.font = "600 10px " + MONO;
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.fillStyle = full ? PAL.primary : PAL.muted;
        ctx.fillText(full ? "CURRENT" : "LIVE", g.CN.x + 15, g.CN.y);
        ctx.textBaseline = "alphabetic";
        ctx.textAlign = "center";
        ctx.font = "600 11px " + MONO;
        ctx.fillStyle = PAL.dim;
        ctx.fillText(
          full ? "one connected view" : "reporting",
          g.bcx,
          Math.min(H - 10, g.bTop + g.bh + 24)
        );
        ctx.textAlign = "left";
        return;
      }
      drawMark(ctx, g.xC + 8, 12, PAL.primary);
      ctx.font = "600 11px " + MONO;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.fillStyle = PAL.ink;
      ctx.fillText("One cellar view", g.xC + 27, 21);
      ctx.textAlign = "right";
      ctx.font = "600 9px " + MONO;
      ctx.fillStyle = full ? PAL.primary : PAL.muted;
      ctx.fillText(full ? "CURRENT" : "LIVE", W - 10, 21);
      ctx.textAlign = "center";
      ctx.font = "600 10px " + MONO;
      ctx.fillStyle = PAL.muted;
      ctx.fillText(
        full ? "todo en una vista" : "reporting",
        g.bcx,
        Math.min(H - 8, g.bTop + g.bh + 18)
      );
      ctx.textAlign = "left";
    };

    const draw = () => {
      if (!ctx || W === 0 || H === 0) return;
      ctx.clearRect(0, 0, W, H);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      drawSpine();
      drawRows();
      drawStreams();
      const full = fillLevel > 0.97;
      drawBottle();
      drawActive();
      drawPanelChrome(full);

      if (caption) {
        caption.textContent = reduced()
          ? "one view"
          : full
          ? "one view"
          : "reporting";
      }
    };

    const resolvedStatic = () => {
      fillLevel = 1;
      for (let i = 0; i < rows.length; i++) {
        rows[i].latched = true;
        rows[i].heads = [rows[i].line.len * 0.5];
      }
      draw();
    };

    const spawnHeads = (dt: number) => {
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        r.spawn -= dt;
        if (r.spawn <= 0 && r.heads.length < 2) {
          r.heads.push(0);
          r.spawn = 3.0 + Math.random() * 2.2;
        }
        for (let h = r.heads.length - 1; h >= 0; h--) {
          r.heads[h] += (r.report.len / 6.8) * dt;
          if (r.heads[h] >= r.report.len) {
            r.heads.splice(h, 1);
            if (ripples.length < 4) ripples.push({ t: 0 });
          }
        }
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 32) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      T += dt;

      const fp = clamp01((T - INTRO) / FILL);
      fillLevel = easeInOut(fp);
      for (let i = 0; i < rows.length; i++) rows[i].latched = fp >= rows[i].latch;

      spawnHeads(dt);
      for (let rp = ripples.length - 1; rp >= 0; rp--) {
        ripples[rp].t += dt * 0.7;
        if (ripples[rp].t >= 1) ripples.splice(rp, 1);
      }

      if (active !== null) {
        activeL += (rows[active].report.len / 3.4) * dt;
        if (activeL > rows[active].report.len + 40) activeL = 0;
      }

      draw();
    };

    const canRun = () => !reduced() && docVisible && onscreen;
    const start = () => {
      if (running || !canRun()) return;
      T = 0;
      fillLevel = 0;
      ripples = [];
      for (let i = 0; i < rows.length; i++) {
        rows[i].latched = false;
        rows[i].heads = [];
        rows[i].spawn = 0.6 + i * 0.42;
      }
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

    const setActive = (idx: number | null) => {
      active = idx;
      activeL = 0;
      if (!running) draw();
    };

    const btns = overlay
      ? Array.from(overlay.querySelectorAll<HTMLButtonElement>(".vine-row"))
      : [];
    const rowWiring: Array<{
      el: HTMLButtonElement;
      enter: () => void;
      leave: () => void;
      focus: () => void;
      blur: () => void;
    }> = [];
    btns.forEach((b) => {
      const idx = parseInt(b.getAttribute("data-row") || "0", 10);
      const enter = () => setActive(idx);
      const leave = () => setActive(null);
      const focus = () => setActive(idx);
      const blur = () => setActive(null);
      b.addEventListener("mouseenter", enter);
      b.addEventListener("mouseleave", leave);
      b.addEventListener("focus", focus);
      b.addEventListener("blur", blur);
      rowWiring.push({ el: b, enter, leave, focus, blur });
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      ctx = fitCanvas(canvas, W, H);
      layout();
      if (reduced()) resolvedStatic();
      else draw();
    };

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 140);
    };
    const onMode = () => {
      readPalette();
      draw();
    };
    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible && onscreen) start();
      else stop();
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        resize();
      } else {
        start();
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("cardon-mode", onMode);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMQ.addEventListener("change", onReduceChange);

    let io: IntersectionObserver | null = null;
    if (reduced()) {
      onscreen = true;
    } else if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (en) => {
          onscreen = en[0].isIntersecting;
          if (onscreen && docVisible) start();
          else stop();
        },
        { threshold: 0.08 }
      );
      io.observe(stage);
    } else {
      onscreen = true;
    }

    resize();
    if (reduced()) resolvedStatic();

    return () => {
      stop();
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("cardon-mode", onMode);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMQ.removeEventListener("change", onReduceChange);
      if (io) io.disconnect();
      rowWiring.forEach((w) => {
        w.el.removeEventListener("mouseenter", w.enter);
        w.el.removeEventListener("mouseleave", w.leave);
        w.el.removeEventListener("focus", w.focus);
        w.el.removeEventListener("blur", w.blur);
      });
    };
  }, []);

  return (
    <div className="stage-frame spot" ref={stageRef}>
      <span className="stage-tag mono">
        <span className="before">every row</span>{" "}
        <span className="midword">reports into</span>{" "}
        <span className="after">one view</span>
      </span>
      <span className="stage-caption mono" ref={captionRef}>
        reporting
      </span>
      <canvas className="vine-canvas" ref={canvasRef} aria-hidden="true" />
      <div className="vine-overlay" ref={overlayRef} aria-hidden="false">
        {VINE_ROWS.map((r, i) => (
          <button
            key={i}
            className="vine-row"
            type="button"
            data-row={i}
            aria-label={r.aria}
          >
            <span className="row-plate">
              <span className="row-name">{r.name}</span>
              <span className="row-detail">reporting to one view</span>
            </span>
          </button>
        ))}
      </div>
      <noscript>
        <div className="stage-fallback">
          A field of vine rows, each following the land, streams its readings into
          one collection channel that fills a single cellar view. Every row
          reports; one place reads.
        </div>
      </noscript>
    </div>
  );
}
