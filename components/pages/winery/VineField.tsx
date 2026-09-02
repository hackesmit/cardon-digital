"use client";

import { useEffect, useRef } from "react";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { winery } from "@/lib/i18n/winery";

type RGB = [number, number, number];
type Pt = { x: number; y: number };
type Trace = { pts: Pt[]; cum: number[]; len: number };
type SourceKind = "notebook" | "sheet" | "legacy";
type Source = {
  kind: SourceKind;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  feed: Trace;
  trace: Trace;
  start: number;
  end: number;
  heads: number[];
  spawn: number;
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


/**
 * Signature visual, the was-to-now absorption scene: the old records appear as
 * physical objects (field notebooks, spreadsheet cards, an unnamed legacy
 * terminal window) scattered where they used to live. One by one their
 * contents stream out along a channel into one collection node and down into
 * a bottle that fills as sources are absorbed; each emptied source fades away
 * until only the clean channel, the full bottle, and the NOW ledger remain,
 * and a cork slides in. Scattered records, wired into one view.
 *
 * Ported from the approved winery concept: rAF loop, DPR cap 2,
 * IntersectionObserver plus visibilitychange pausing, prefers-reduced-motion
 * resolves to a static full bottle, and the palette re-reads on the window
 * "cardon-mode" event when the mode toggle fires.
 */
export default function VineField() {
  const t = useDict(winery).vis;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
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
    // Single source of truth: the measured canvas width decides the composition.
    // The supporting CSS (canvas height, stage-tag) keys off the viewport width
    // at which the container crosses this measured threshold, so JS and CSS never
    // disagree across the range (no dead band, one caption at every width).
    const COMPACT_W = 560;
    let compact = false;


    let geom: Geom | null = null;
    let sources: Source[] = [];
    let fpNow = 0;
    let ledgerY = 0;
    // consume plan: kind, then per-mode fractional placement set in layout()
    const SRC_PLAN: Array<{ kind: SourceKind; start: number; end: number }> = [
      { kind: "notebook", start: 0.03, end: 0.27 },
      { kind: "sheet", start: 0.19, end: 0.43 },
      { kind: "legacy", start: 0.35, end: 0.59 },
      { kind: "notebook", start: 0.51, end: 0.75 },
      { kind: "sheet", start: 0.67, end: 0.87 },
    ];
    const SRC_DIMS: Record<SourceKind, [number, number]> = {
      notebook: [0.82, 1.0],
      sheet: [1.06, 0.72],
      legacy: [1.16, 0.8],
    };
    const buildSource = (
      i: number,
      cx: number,
      cy: number,
      rot: number,
      u: number,
      port: Pt,
      elbow: Pt,
      CN: Pt,
      neck: Pt
    ): Source => {
      const plan = SRC_PLAN[i];
      const [fw, fh] = SRC_DIMS[plan.kind];
      const feed = makeTrace(dedupe([port, elbow, { x: CN.x, y: CN.y }]));
      const trace = makeTrace(
        dedupe([port, elbow, { x: CN.x, y: CN.y }, { x: neck.x, y: neck.y }])
      );
      return {
        kind: plan.kind,
        x: cx,
        y: cy,
        w: u * fw,
        h: u * fh,
        rot,
        feed,
        trace,
        start: plan.start,
        end: plan.end,
        heads: [],
        spawn: 0.3 + i * 0.25,
      };
    };
    let ripples: { t: number }[] = [];

    const INTRO = 0.5;
    const FILL = 12.5;
    let fillLevel = 0;
    // Cork slide progress: 0 while the bottle is open (filling), eases to 1
    // once the fill completes and the cork slides into the mouth.
    let corkT = 0;
    // The was/now ledger replaces the old hover-only row plate: an always
    // visible strip that alternates between the old scattered records and the
    // live view, then settles on NOW once the bottle is full.
    const LEDGER_CYCLE = 8.2;
    const LEDGER_WAS_TEXT = t.ledgerWasText;

    const layout = () => {
      compact = W < COMPACT_W;

      if (compact) {
        // Portrait recomposition: the scattered sources sit in the top field
        // and their contents funnel down into one collection node, then a
        // vertical channel drops into a large centered bottle. Reads top to
        // bottom on a phone held upright.
        // Wine proportions: the body width derives from the height budget at
        // roughly 3:1 so the bottle reads Bordeaux-slender, never a squat jar.
        const bh = Math.min(H * 0.42, 260);
        const bw = Math.max(64, Math.min(bh / 3.0, 92));
        const bcx = W * 0.5;
        const bTop = H * 0.52;
        const CN: Pt = { x: W * 0.5, y: H * 0.445 };
        const neck: Pt = { x: bcx, y: bTop + 2 };
        const xL = W * 0.09;
        const xR = W * 0.8;
        geom = { xL, xC: CN.x, bcx, bw, bh, bTop, CN, neck };

        const u = Math.min(96, Math.max(74, W * 0.24));
        const fieldTop = H * 0.155;
        const fieldBot = H * 0.36;
        const fy = (f: number) => fieldTop + (fieldBot - fieldTop) * f;
        const spots: Array<[number, number, number]> = [
          [W * 0.26, fy(0.16), -5],
          [W * 0.73, fy(0.06), 4],
          [W * 0.48, fy(0.5), -2],
          [W * 0.79, fy(0.86), 6],
          [W * 0.21, fy(0.84), 3],
        ];
        sources = [];
        for (let i = 0; i < SRC_PLAN.length; i++) {
          const [sx, sy, rot] = spots[i];
          const [fw2, fh2] = SRC_DIMS[SRC_PLAN[i].kind];
          const port: Pt = { x: sx, y: sy + (u * fh2) / 2 + 2 };
          const elbow: Pt = {
            x: (port.x + CN.x) / 2,
            y: Math.max(port.y + 12, CN.y - 26),
          };
          sources.push(buildSource(i, sx, sy, rot, u, port, elbow, CN, neck));
        }
        ledgerY = (fieldBot + CN.y) / 2 - 4;
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

      const fw = xC - 30 - xL;
      const u = Math.min(122, Math.max(96, fw * 0.2));
      const spots: Array<[number, number, number]> = [
        [xL + fw * 0.16, H * 0.21, -5],
        [xL + fw * 0.56, H * 0.16, 3],
        [xL + fw * 0.32, H * 0.5, -2],
        [xL + fw * 0.74, H * 0.44, 5],
        [xL + fw * 0.26, H * 0.78, 2],
      ];
      sources = [];
      for (let i = 0; i < SRC_PLAN.length; i++) {
        const [sx, sy, rot] = spots[i];
        const [fw2] = SRC_DIMS[SRC_PLAN[i].kind];
        const port: Pt = { x: sx + (u * fw2) / 2 + 2, y: sy };
        const elbow: Pt = {
          x: port.x + (CN.x - port.x) * 0.55,
          y: port.y + (CN.y - port.y) * 0.6,
        };
        sources.push(buildSource(i, sx, sy, rot, u, port, elbow, CN, neck));
      }
      ledgerY = H - 16;
    };


    const srcAlpha = (sc: Source): number => {
      if (fpNow < sc.start) return 1;
      if (fpNow < sc.end)
        return 1 - 0.55 * easeInOut((fpNow - sc.start) / (sc.end - sc.start));
      return Math.max(0, 0.45 * (1 - (fpNow - sc.end) / 0.1));
    };

    const drawSpine = () => {
      if (!ctx || !geom) return;
      const g = geom;
      // feeders: each surviving source's channel into the collection node
      for (let i = 0; i < sources.length; i++) {
        const a = srcAlpha(sources[i]);
        if (a <= 0.02) continue;
        ctx.globalAlpha = Math.min(1, a + 0.15);
        ctx.strokeStyle = PAL.lineSoft;
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        strokeTrace(ctx, sources[i].feed);
      }
      ctx.globalAlpha = 1;
      // collection channel: node down to the bottle neck
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
      ctx.arc(g.CN.x, g.CN.y, compact ? 9 : 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = PAL.primaryDim;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(g.CN.x, g.CN.y, compact ? 5.5 : 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = PAL.primary;
      ctx.beginPath();
      ctx.arc(g.CN.x, g.CN.y, compact ? 2.2 : 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const LEGACY_DASH = [0.82, 0.55, 0.7, 0.42, 0.66];
    const drawSources = () => {
      if (!ctx) return;
      const c = ctx;
      for (let i = 0; i < sources.length; i++) {
        const sc = sources[i];
        const a = srcAlpha(sc);
        if (a <= 0.02) continue;
        const remain =
          1 - clamp01((fpNow - sc.start) / (sc.end - sc.start));
        c.save();
        c.globalAlpha = a;
        c.translate(sc.x, sc.y);
        c.rotate((sc.rot * Math.PI) / 180);
        const w = sc.w;
        const h = sc.h;
        const x0 = -w / 2;
        const y0 = -h / 2;
        if (sc.kind === "legacy") {
          // unnamed terminal window: darker screen, title dots, green rows
          rr(c, x0, y0, w, h, 6);
          c.fillStyle = rgba(mix(PAL.panelRgb, BLACK, 0.35), 1);
          c.fill();
          c.strokeStyle = PAL.line;
          c.lineWidth = 1.2;
          c.stroke();
          c.strokeStyle = PAL.lineSoft;
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(x0 + 2, y0 + 13);
          c.lineTo(x0 + w - 2, y0 + 13);
          c.stroke();
          c.fillStyle = PAL.energy;
          c.beginPath();
          c.arc(x0 + 8, y0 + 6.5, 2, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = PAL.secondary;
          c.beginPath();
          c.arc(x0 + 15, y0 + 6.5, 2, 0, Math.PI * 2);
          c.fill();
          const n = LEGACY_DASH.length;
          const rows2 = Math.ceil(n * remain);
          const innerW = w - 18;
          for (let r2 = 0; r2 < rows2; r2++) {
            const ly = y0 + 21 + r2 * ((h - 28) / (n - 1));
            c.strokeStyle = PAL.primaryDim;
            c.lineWidth = 1.6;
            c.beginPath();
            c.moveTo(x0 + 9, ly);
            c.lineTo(x0 + 9 + innerW * LEGACY_DASH[r2], ly);
            c.stroke();
          }
        } else if (sc.kind === "sheet") {
          // spreadsheet card: header band plus grid cells that empty out
          rr(c, x0, y0, w, h, 6);
          c.fillStyle = PAL.card;
          c.fill();
          c.strokeStyle = PAL.line;
          c.lineWidth = 1.2;
          c.stroke();
          c.fillStyle = PAL.primaryFaint;
          rr(c, x0 + 1, y0 + 1, w - 2, 9, 5);
          c.fill();
          const cols = 3;
          const rows2 = 3;
          const gx0 = x0 + 6;
          const gy0 = y0 + 15;
          const gw = w - 12;
          const gh = h - 22;
          c.strokeStyle = PAL.lineSoft;
          c.lineWidth = 1;
          for (let cc = 1; cc < cols; cc++) {
            c.beginPath();
            c.moveTo(gx0 + (gw / cols) * cc, gy0);
            c.lineTo(gx0 + (gw / cols) * cc, gy0 + gh);
            c.stroke();
          }
          for (let rr2 = 1; rr2 < rows2; rr2++) {
            c.beginPath();
            c.moveTo(gx0, gy0 + (gh / rows2) * rr2);
            c.lineTo(gx0 + gw, gy0 + (gh / rows2) * rr2);
            c.stroke();
          }
          const cells = cols * rows2;
          const filled = Math.ceil(cells * remain);
          c.fillStyle = rgba(PAL.secondaryRgb, 0.55);
          for (let k = 0; k < filled; k++) {
            const cc = k % cols;
            const rr2 = Math.floor(k / cols);
            const cw = gw / cols;
            const chh = gh / rows2;
            c.fillRect(
              gx0 + cc * cw + 3,
              gy0 + rr2 * chh + chh / 2 - 1.2,
              cw - 9,
              2.4
            );
          }
        } else {
          // field notebook: spiral rings on the left, ruled lines that empty
          rr(c, x0, y0, w, h, 6);
          c.fillStyle = PAL.card;
          c.fill();
          c.strokeStyle = PAL.line;
          c.lineWidth = 1.2;
          c.stroke();
          const ringN = 4;
          for (let k = 0; k < ringN; k++) {
            const ry = y0 + h * 0.18 + (h * 0.64 * k) / (ringN - 1);
            c.strokeStyle = PAL.faint;
            c.lineWidth = 1.2;
            c.beginPath();
            c.arc(x0 + 7, ry, 2.6, 0, Math.PI * 2);
            c.stroke();
          }
          const n = 5;
          const lines = Math.ceil(n * remain);
          for (let k = 0; k < lines; k++) {
            const ly = y0 + h * 0.2 + (h * 0.6 * k) / (n - 1);
            c.strokeStyle = k === 0 ? rgba(PAL.textRgb, 0.5) : PAL.faint;
            c.lineWidth = 1.4;
            c.beginPath();
            c.moveTo(x0 + 15, ly);
            c.lineTo(x0 + w - 9 - (k % 2) * w * 0.14, ly);
            c.stroke();
          }
        }
        c.restore();
      }
    };

    const drawStreams = () => {
      if (!ctx) return;
      for (let i = 0; i < sources.length; i++) {
        const sc = sources[i];
        for (let h = 0; h < sc.heads.length; h++) {
          drawFlow(ctx, sc.trace, sc.heads[h], PAL.primarySoft, PAL.secondaryBright);
        }
      }
    };

    const drawBottle = () => {
      if (!ctx || !geom) return;
      const g = geom;
      const bcx = g.bcx;
      const bw = g.bw;
      const bh = g.bh;
      const bTop = g.bTop;
      // Proportions traced from Daniel's reference silhouette
      // (Wine-bottle.svg): neck about a quarter of the height and a quarter of
      // the body width, a LONG sloping shoulder (~19% of height), a slight
      // lip band at the mouth, rounded base corners. Shared by both modes.
      const nw = bw * 0.26;
      const lipH = Math.max(3, bh * 0.014);
      const lipOut = Math.max(1.5, nw * 0.1);
      // Desktop's bottle box is taller-than-reference (about 4.5:1 vs 3.3:1),
      // so the reference neck ratio reads too long there; compact keeps it.
      const neckH = bh * (compact ? 0.235 : 0.195);
      const shoulderH = bh * 0.19;
      const bodyTop = bTop + lipH + neckH + shoulderH;
      const bodyBot = bTop + bh;
      const blx = bcx - bw / 2;
      const brx = bcx + bw / 2;
      const nlx = bcx - nw / 2;
      const nrx = bcx + nw / 2;
      const c = ctx;

      const bottlePath = () => {
        const lipBotY = bTop + lipH;
        const neckBotY = lipBotY + neckH;
        // Shoulder handles: tangent to the vertical neck at the top and the
        // vertical body side at the bottom; the tall shoulderH from the
        // reference gives the long sloping profile. The mouth carries a small
        // lip band flaring just past the neck line, per the reference.
        const sh = shoulderH * 0.55;
        c.beginPath();
        c.moveTo(nlx - lipOut, bTop);
        c.lineTo(nlx - lipOut, lipBotY);
        c.lineTo(nlx, lipBotY);
        c.lineTo(nlx, neckBotY);
        c.bezierCurveTo(nlx, neckBotY + sh, blx, bodyTop - sh, blx, bodyTop);
        c.lineTo(blx, bodyBot - bw * 0.16);
        c.quadraticCurveTo(blx, bodyBot, bcx - bw * 0.28, bodyBot);
        c.lineTo(bcx + bw * 0.28, bodyBot);
        c.quadraticCurveTo(brx, bodyBot, brx, bodyBot - bw * 0.16);
        c.lineTo(brx, bodyTop);
        c.bezierCurveTo(brx, bodyTop - sh, nrx, neckBotY + sh, nrx, neckBotY);
        c.lineTo(nrx, lipBotY);
        c.lineTo(nrx + lipOut, lipBotY);
        c.lineTo(nrx + lipOut, bTop);
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

      // No closure while the bottle fills: an open bottle is the honest state.
      // Once full, a cork slides into the mouth: a plain cylinder with
      // slightly rounded corners, NARROWER than the neck (the glass has
      // thickness), no bevel, no flare.
      if (corkT > 0.001) {
        const e = easeInOut(clamp01(corkT));
        const cw = nw * 0.68;
        const ch = Math.max(12, neckH * 0.32);
        const seatedTop = bTop + 1.5;
        const hoverTop = bTop - ch * 2.6;
        const top = hoverTop + (seatedTop - hoverTop) * e;
        const cl = bcx - cw / 2;
        const corkBody = PAL.dark
          ? rgba(mix(mix(PAL.secondaryRgb, WHITE, 0.3), PAL.groundRgb, 0.12), 1)
          : rgba(mix(PAL.secondaryRgb, WHITE, 0.18), 1);
        const corkEdge = rgba(mix(PAL.secondaryRgb, BLACK, 0.35), 1);
        c.save();
        c.globalAlpha = Math.min(1, corkT * 2.5);
        rr(c, cl, top, cw, ch, Math.min(3, cw * 0.14));
        c.fillStyle = corkBody;
        c.fill();
        c.strokeStyle = corkEdge;
        c.lineWidth = 1;
        c.stroke();
        c.restore();
      }

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
        ctx.fillText(full ? t.current : t.live, g.CN.x + 15, g.CN.y);
        ctx.textBaseline = "alphabetic";
        ctx.textAlign = "center";
        ctx.font = "600 11px " + MONO;
        ctx.fillStyle = PAL.dim;
        ctx.fillText(
          full ? t.captionFullCompact : t.captionPre,
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
      ctx.fillText(t.header, g.xC + 27, 21);
      ctx.textAlign = "right";
      ctx.font = "600 9px " + MONO;
      ctx.fillStyle = full ? PAL.primary : PAL.muted;
      ctx.fillText(full ? t.current : t.live, W - 10, 21);
      ctx.textAlign = "center";
      ctx.font = "600 10px " + MONO;
      ctx.fillStyle = PAL.muted;
      ctx.fillText(
        full ? t.captionFull : t.captionPre,
        g.bcx,
        Math.min(H - 8, g.bTop + g.bh + 18)
      );
      ctx.textAlign = "left";
    };

    const drawLedger = (full: boolean) => {
      if (!ctx || !geom) return;
      const g = geom;
      // Crossfade weight for the NOW entry; WAS gets the complement. Once the
      // bottle is full (or under reduced motion) the ledger holds on NOW.
      let nowA: number;
      if (full || reduced()) {
        nowA = 1;
      } else {
        const ph = T % LEDGER_CYCLE;
        if (ph < 3.4) nowA = 0;
        else if (ph < 3.85) nowA = easeInOut((ph - 3.4) / 0.45);
        else if (ph < 7.75) nowA = 1;
        else nowA = 1 - easeInOut((ph - 7.75) / 0.45);
      }
      const d = new Date();
      const hh = String(d.getHours());
      const mm = String(d.getMinutes()).padStart(2, "0");
      const nowText = t.ledgerNowText + (hh.length < 2 ? "0" + hh : hh) + ":" + mm;
      const fs = W < 380 ? 9.5 : 10.5;
      const c = ctx;
      c.font = "600 " + fs + "px " + MONO;
      c.textBaseline = "middle";
      c.textAlign = "left";
      const entries: Array<{ a: number; pre: string; body: string; preCol: string; bodyCol: string }> = [
        { a: 1 - nowA, pre: t.ledgerWas, body: LEDGER_WAS_TEXT, preCol: PAL.secondary, bodyCol: PAL.muted },
        { a: nowA, pre: t.ledgerNow, body: nowText, preCol: PAL.primary, bodyCol: PAL.dim },
      ];
      for (const en of entries) {
        if (en.a <= 0.01) continue;
        const preW = c.measureText(en.pre).width;
        const bodyW = c.measureText(en.body).width;
        const gap = 5;
        const padX = 9;
        const padY = 6;
        const chipW = padX * 2 + preW + gap + bodyW;
        let x0: number;
        let cy: number;
        if (compact) {
          // centered in the quiet band between the source field and the node
          x0 = W * 0.5 - chipW / 2;
          cy = ledgerY;
        } else {
          // quiet bottom-left strip under the row field
          x0 = g.xL;
          cy = H - 16;
        }
        c.save();
        c.globalAlpha = en.a;
        rr(c, x0, cy - fs / 2 - padY, chipW, fs + padY * 2, 7);
        c.fillStyle = PAL.panel;
        c.globalAlpha = en.a * 0.82;
        c.fill();
        c.globalAlpha = en.a;
        c.strokeStyle = PAL.lineSoft;
        c.lineWidth = 1;
        c.stroke();
        c.fillStyle = en.preCol;
        c.fillText(en.pre, x0 + padX, cy + 0.5);
        c.fillStyle = en.bodyCol;
        c.fillText(en.body, x0 + padX + preW + gap, cy + 0.5);
        c.restore();
      }
      c.textBaseline = "alphabetic";
    };

    const draw = () => {
      if (!ctx || W === 0 || H === 0) return;
      ctx.clearRect(0, 0, W, H);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      drawSpine();
      drawSources();
      drawStreams();
      const full = fillLevel > 0.97;
      drawBottle();
      // The single caption is drawn in-canvas under the bottle by
      // drawPanelChrome, so there is exactly one caption at every width (no
      // separate HTML overlay caption that could disagree with the canvas).
      drawPanelChrome(full);
      drawLedger(full);
    };

    const resolvedStatic = () => {
      fillLevel = 1;
      corkT = 1;
      fpNow = 1;
      for (let i = 0; i < sources.length; i++) sources[i].heads = [];
      draw();
    };

    const spawnHeads = (dt: number) => {
      for (let i = 0; i < sources.length; i++) {
        const sc = sources[i];
        const inWindow = fpNow >= sc.start && fpNow < sc.end + 0.03;
        sc.spawn -= dt;
        if (inWindow && sc.spawn <= 0 && sc.heads.length < 3) {
          sc.heads.push(0);
          sc.spawn = 0.55 + Math.random() * 0.5;
        }
        for (let h = sc.heads.length - 1; h >= 0; h--) {
          sc.heads[h] += (sc.trace.len / 2.6) * dt;
          if (sc.heads[h] >= sc.trace.len) {
            sc.heads.splice(h, 1);
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
      fpNow = fp;
      fillLevel = easeInOut(fp);
      if (fillLevel > 0.97) corkT = Math.min(1, corkT + dt / 0.9);
      else corkT = 0;

      spawnHeads(dt);
      for (let rp = ripples.length - 1; rp >= 0; rp--) {
        ripples[rp].t += dt * 0.7;
        if (ripples[rp].t >= 1) ripples.splice(rp, 1);
      }

      draw();
    };

    const canRun = () => !reduced() && docVisible && onscreen;
    const start = () => {
      if (running || !canRun()) return;
      T = 0;
      fillLevel = 0;
      corkT = 0;
      ripples = [];
      fpNow = 0;
      for (let i = 0; i < sources.length; i++) {
        sources[i].heads = [];
        sources[i].spawn = 0.3 + i * 0.25;
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
    };
  }, []);

  return (
    <div className="stage-frame spot" ref={stageRef}>
      <span className="stage-tag mono">
        <span className="before">{t.tagBefore}</span>{" "}
        <span className="midword">{t.tagMid}</span>{" "}
        <span className="after">{t.tagAfter}</span>
      </span>
      <canvas
        className="vine-canvas"
        ref={canvasRef}
        role="img"
        aria-label={t.aria}
      />
      <noscript>
        <div className="stage-fallback">{t.fallback}</div>
      </noscript>
    </div>
  );
}
