"use client";

import { useEffect, useRef } from "react";

type Pt = { x: number; y: number };
type Cand = { stream: string; ini: string; park: number };
type Geom = {
  cw: number;
  ch: number;
  spineY: number;
  gates: Pt[];
  merge: Pt;
  enIn: Pt;
  esIn: Pt;
  trayY: number;
  roster: { x: number; y: number; w: number; h: number };
  compact: boolean;
  parkX: number;
};
type Seg = {
  d: number;
  a: Pt;
  b: Pt;
  st: string;
  k: string;
  gate?: number;
  fa?: number;
  t0: number;
  t1: number;
};
type Segs = { list: Seg[]; total: number; finalPos: Pt };
type Parked = { x: number; y: number; ini: string; stream: string; gate: number };
type RosterEntry = { ini: string; stream: string; slot: number };
type FrameCard = {
  x: number;
  y: number;
  w: number;
  h: number;
  ini: string;
  stream: string;
  st: string;
};
type Sample = {
  x: number;
  y: number;
  al: number;
  st: string;
  k: string;
  gate: number | undefined;
  u: number;
};

/**
 * Signature visual: two candidate streams (EN and ES) merge into one pipeline
 * and pass through four gates (applied, screened, interviewed, offer). One card
 * resolves at a time; at a gate some cards settle with dignity into a quiet
 * "not this role" tray (they dim and park, never turn red) while those that pass
 * dock into a team roster. Meaning: two languages, one pipeline, decisions you
 * can see. Ports the source rAF loop faithfully: DPR cap 2, IntersectionObserver
 * plus visibilitychange pausing, a reduced-motion static composition, and a
 * palette re-read on the window "cardon-mode" event. Hover or focus a gate, or
 * hover a card, to raise a readout plate.
 */
export default function PipelineStage() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const caption = captionRef.current;
    const frame = frameRef.current;

    const root = document.documentElement;
    const MONO = 'ui-monospace, "SFMono-Regular", Consolas, monospace';
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;

    type RGB = [number, number, number];
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
      panel: "",
      card: "",
      ink: "",
      muted: "",
      line: "",
      lineSoft: "",
      primary: "",
      secondary: "",
      sage: "",
      sageDim: "",
      sageFaint: "",
    };
    const readPalette = () => {
      const panel = hexToRgb(cssVar("--panel") || "#16201A");
      const text = hexToRgb(cssVar("--text") || "#E4EAD9");
      const primary = hexToRgb(cssVar("--primary") || "#3FB58A");
      const secondary = hexToRgb(cssVar("--secondary") || "#D9A83A");
      const sage = hexToRgb(cssVar("--sage") || "#5E9E86");
      PAL.dark = root.getAttribute("data-mode") !== "light";
      PAL.panel = rgba(panel, 1);
      PAL.card = rgba(mix(panel, text, 0.08), 1);
      PAL.ink = rgba(text, 1);
      PAL.muted = rgba(mix(text, panel, 0.5), 1);
      PAL.line = rgba(mix(primary, text, 0.35), 0.22);
      PAL.lineSoft = rgba(mix(primary, text, 0.35), 0.12);
      PAL.primary = rgba(primary, 1);
      PAL.secondary = rgba(secondary, 1);
      PAL.sage = rgba(sage, 1);
      PAL.sageDim = rgba(sage, 0.5);
      PAL.sageFaint = rgba(sage, 0.18);
    };

    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const easeInOut = (t: number) => {
      t = clamp01(t);
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    const fitCanvas = (
      c: HTMLCanvasElement,
      context: CanvasRenderingContext2D,
      cssW: number,
      cssH: number
    ) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.max(1, Math.round(cssW * dpr));
      c.height = Math.max(1, Math.round(cssH * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      r = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let compact = false;

    const GATE_KEYS = ["applied", "screened", "interviewed", "offer"];
    const GATEX = [0.335, 0.455, 0.575, 0.695];
    // Portrait compact mode: a vertical spine with gates stacked top to bottom,
    // EN/ES inlets entering from the top corners, parked cards peeling to a left
    // column, the roster as a row along the bottom. The gate y-fractions are
    // fixed so the HTML gate hotspots (positioned from JS below) align exactly
    // with the drawn gate bars.
    const GATEY_C = [0.37, 0.49, 0.61, 0.73];
    const SX_C = 0.5;
    const SCRIPT: Cand[] = [
      { stream: "EN", ini: "AM", park: -1 },
      { stream: "ES", ini: "GP", park: 0 },
      { stream: "EN", ini: "LK", park: -1 },
      { stream: "ES", ini: "JR", park: 1 },
      { stream: "ES", ini: "SD", park: -1 },
      { stream: "EN", ini: "RC", park: 2 },
      { stream: "EN", ini: "TN", park: -1 },
      { stream: "ES", ini: "VH", park: 3 },
    ];
    const ROSTER_SLOTS = 4;
    const D = {
      spawn: 0.45,
      glide: 1.15,
      toGate: 0.7,
      hold: 0.75,
      park: 0.95,
      dock: 1.15,
      settle: 0.55,
      endHold: 3.2,
      reset: 1.2,
    };

    let geom: Geom | null = null;
    let activeGate: number | null = null;
    let hoverCard: FrameCard | null = null;
    const pointer = { x: -1, y: -1, on: false };
    const frameCards: FrameCard[] = [];

    let idx = 0;
    let ct = 0;
    let segs: Segs | null = null;
    let parked: Parked[] = [];
    let roster: RosterEntry[] = [];
    let trayCount = [0, 0, 0, 0];
    let rosterCount = 0;
    let mode = "run";
    let endT = 0;
    let resetT = 0;
    let globalFade = 1;

    const curCand = () => SCRIPT[Math.min(idx, SCRIPT.length - 1)];

    const layout = () => {
      if (compact) {
        layoutCompact();
        return;
      }
      const cw = Math.max(30, Math.min(44, W * 0.07));
      const ch = cw * 0.66;
      const spineY = H * 0.44;
      const gates: Pt[] = [];
      for (let i = 0; i < 4; i++) gates.push({ x: GATEX[i] * W, y: spineY });
      geom = {
        cw,
        ch,
        spineY,
        gates,
        merge: { x: W * 0.235, y: spineY },
        enIn: { x: W * 0.05, y: H * 0.25 },
        esIn: { x: W * 0.05, y: H * 0.66 },
        trayY: H * 0.795,
        roster: { x: W * 0.775, y: H * 0.13, w: Math.max(60, W * 0.18), h: H * 0.64 },
        compact: false,
        parkX: 0,
      };
    };
    // portrait composition: vertical spine, gates stacked, inlets from the top
    // corners, parked cards in a left column, roster as a bottom row.
    const layoutCompact = () => {
      const cw = Math.max(40, Math.min(54, W * 0.15));
      const ch = cw * 0.6;
      const sx = SX_C * W;
      const mergeY = H * 0.255;
      const gates: Pt[] = [];
      for (let i = 0; i < 4; i++) gates.push({ x: sx, y: GATEY_C[i] * H });
      const gap = cw * 0.34;
      const pitch = cw + gap;
      const totalW = ROSTER_SLOTS * cw + (ROSTER_SLOTS - 1) * gap;
      const slot0 = (W - totalW) / 2 + cw / 2;
      geom = {
        cw,
        ch,
        spineY: mergeY,
        gates,
        merge: { x: sx, y: mergeY },
        enIn: { x: W * 0.17, y: H * 0.15 },
        esIn: { x: W * 0.83, y: H * 0.15 },
        trayY: H * 0.9,
        roster: { x: slot0, y: H * 0.9, w: pitch, h: ch },
        compact: true,
        parkX: W * 0.135,
      };
    };
    const rosterSlot = (slot: number): Pt => {
      const g = geom as Geom;
      if (g.compact) return { x: g.roster.x + g.roster.w * slot, y: g.roster.y };
      const r = g.roster;
      const headH = 22;
      const pad = 8;
      const slotH = (r.h - headH - pad) / ROSTER_SLOTS;
      return { x: r.x + r.w * 0.5, y: r.y + headH + slotH * (slot + 0.5) };
    };
    const parkPos = (gate: number, n: number): Pt => {
      const g = geom as Geom;
      if (g.compact) return { x: g.parkX, y: g.gates[gate].y + n * g.ch * 0.5 };
      const gx = g.gates[gate].x;
      const col = (n % 3) - 1;
      const rowi = Math.floor(n / 3);
      return { x: gx + col * (g.cw * 0.72), y: g.trayY + rowi * (g.ch * 0.95) };
    };

    const buildSegs = (cand: Cand): Segs => {
      const g = geom as Geom;
      const list: Seg[] = [];
      const inlet = cand.stream === "EN" ? g.enIn : g.esIn;
      list.push({ d: D.spawn, a: inlet, b: inlet, st: "applied", k: "fade", t0: 0, t1: 0 });
      list.push({ d: D.glide, a: inlet, b: g.merge, st: "applied", k: "move", t0: 0, t1: 0 });
      let prev: Pt = g.merge;
      const reach = cand.park < 0 ? 3 : cand.park;
      for (let i = 0; i <= reach; i++) {
        const gp: Pt = { x: g.gates[i].x, y: g.gates[i].y };
        list.push({ d: D.toGate, a: prev, b: gp, st: GATE_KEYS[i], k: "move", t0: 0, t1: 0 });
        list.push({ d: D.hold, a: gp, b: gp, st: GATE_KEYS[i], k: "hold", gate: i, t0: 0, t1: 0 });
        prev = gp;
      }
      let finalPos: Pt;
      let finalA: number;
      if (cand.park >= 0) {
        finalPos = parkPos(cand.park, trayCount[cand.park]);
        finalA = 0.4;
        list.push({ d: D.park, a: prev, b: finalPos, st: "not this role", k: "park", t0: 0, t1: 0 });
      } else {
        finalPos = rosterSlot(rosterCount);
        finalA = 1;
        list.push({ d: D.dock, a: prev, b: finalPos, st: "hired", k: "dock", t0: 0, t1: 0 });
      }
      list.push({
        d: D.settle,
        a: finalPos,
        b: finalPos,
        st: cand.park >= 0 ? "not this role" : "hired",
        k: "settle",
        fa: finalA,
        t0: 0,
        t1: 0,
      });
      let t = 0;
      for (let j = 0; j < list.length; j++) {
        list[j].t0 = t;
        t += list[j].d;
        list[j].t1 = t;
      }
      return { list, total: t, finalPos };
    };

    const sampleActive = (): Sample | null => {
      if (!segs) return null;
      const t = ct;
      let seg = segs.list[segs.list.length - 1];
      for (let i = 0; i < segs.list.length; i++) {
        if (t < segs.list[i].t1) {
          seg = segs.list[i];
          break;
        }
      }
      let u = seg.d > 0 ? (t - seg.t0) / seg.d : 1;
      if (u < 0) u = 0;
      if (u > 1) u = 1;
      const e = easeInOut(u);
      let x: number;
      let y: number;
      let al = 1;
      if (seg.k === "fade") {
        x = seg.a.x;
        y = seg.a.y;
        al = e;
      } else if (seg.k === "park") {
        x = seg.a.x + (seg.b.x - seg.a.x) * e;
        y = seg.a.y + (seg.b.y - seg.a.y) * e;
        al = 1 + (0.4 - 1) * u;
      } else if (seg.k === "settle") {
        x = seg.a.x;
        y = seg.a.y;
        al = seg.fa === undefined ? 1 : seg.fa;
      } else {
        x = seg.a.x + (seg.b.x - seg.a.x) * e;
        y = seg.a.y + (seg.b.y - seg.a.y) * e;
        al = 1;
      }
      return { x, y, al, st: seg.st, k: seg.k, gate: seg.gate, u };
    };

    const step = (dt: number) => {
      if (mode === "run") {
        if (!segs) {
          segs = buildSegs(curCand());
          ct = 0;
        }
        ct += dt;
        if (ct >= segs.total) {
          const cand = curCand();
          if (cand.park >= 0) {
            parked.push({
              x: segs.finalPos.x,
              y: segs.finalPos.y,
              ini: cand.ini,
              stream: cand.stream,
              gate: cand.park,
            });
            trayCount[cand.park]++;
          } else {
            roster.push({ ini: cand.ini, stream: cand.stream, slot: rosterCount });
            rosterCount++;
          }
          idx++;
          segs = null;
          ct = 0;
          if (idx >= SCRIPT.length) {
            mode = "end";
            endT = 0;
          }
        }
      } else if (mode === "end") {
        endT += dt;
        if (endT >= D.endHold) {
          mode = "reset";
          resetT = 0;
        }
      } else if (mode === "reset") {
        resetT += dt;
        globalFade = 1 - clamp01(resetT / D.reset);
        if (resetT >= D.reset) {
          parked = [];
          roster = [];
          trayCount = [0, 0, 0, 0];
          rosterCount = 0;
          idx = 0;
          segs = null;
          ct = 0;
          mode = "run";
          globalFade = 1;
        }
      }
    };

    const dot = (x: number, y: number, r: number, col: string) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    };
    const curve = (a: Pt, b: Pt) => {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      const mx = (a.x + b.x) / 2;
      ctx.bezierCurveTo(mx, a.y, mx, b.y, b.x, b.y);
      ctx.stroke();
    };
    const register = (x: number, y: number, ini: string, stream: string, st: string) => {
      const g = geom as Geom;
      frameCards.push({ x, y, w: g.cw, h: g.ch, ini, stream, st });
    };

    const drawCard = (
      x: number,
      y: number,
      ini: string,
      stream: string,
      alpha: number,
      state: string
    ) => {
      const g = geom as Geom;
      const w = g.cw;
      const h = g.ch;
      const parkedState = state === "parked" || state === "parkmove";
      ctx.save();
      ctx.globalAlpha = alpha;
      rr(x - w / 2, y - h / 2, w, h, 6);
      ctx.fillStyle = PAL.card;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle =
        state === "active" ? PAL.sageDim : state === "hired" ? PAL.sage : PAL.line;
      ctx.stroke();
      const stripe = parkedState
        ? PAL.muted
        : state === "hired"
        ? PAL.sage
        : stream === "EN"
        ? PAL.primary
        : PAL.secondary;
      rr(x - w / 2, y - h / 2, compact ? 4.5 : 3.2, h, 2);
      ctx.fillStyle = stripe;
      ctx.fill();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = parkedState ? PAL.muted : PAL.ink;
      if (compact) {
        // bigger initials, no tiny sub-label: the coloured stripe carries stream
        ctx.font = "600 " + (h * 0.5).toFixed(1) + "px " + MONO;
        ctx.fillText(ini, x + 3, y + 0.5);
      } else {
        ctx.font = "600 " + (h * 0.42).toFixed(1) + "px " + MONO;
        ctx.fillText(ini, x + 2, y - h * 0.11);
        ctx.font = "600 " + (h * 0.26).toFixed(1) + "px " + MONO;
        ctx.fillStyle = parkedState
          ? PAL.muted
          : stream === "EN"
          ? PAL.primary
          : PAL.secondary;
        ctx.fillText(stream, x + 2, y + h * 0.3);
      }
      ctx.restore();
    };

    const curveV = (a: Pt, b: Pt) => {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      const my = (a.y + b.y) / 2;
      ctx.bezierCurveTo(a.x, my, b.x, my, b.x, b.y);
      ctx.stroke();
    };
    const inletChip = (p: Pt, label: string, col: string) => {
      const g = geom as Geom;
      const w = Math.max(32, g.cw * 0.72);
      const h = Math.max(18, g.ch * 0.64);
      rr(p.x - w / 2, p.y - h / 2, w, h, 5);
      ctx.fillStyle = PAL.card;
      ctx.fill();
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = col;
      ctx.stroke();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(p.x - w / 2 + 8, p.y, 2.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PAL.ink;
      ctx.font = "600 11px " + MONO;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label, p.x - w / 2 + 14, p.y + 0.5);
    };
    const drawStructureCompact = (g: Geom) => {
      const sx = g.merge.x;
      // two inlet feeds curving down into the merge node
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = PAL.line;
      curveV(g.enIn, g.merge);
      curveV(g.esIn, g.merge);
      inletChip(g.enIn, "EN", PAL.primary);
      inletChip(g.esIn, "ES", PAL.secondary);
      // the single vertical spine, sage
      ctx.strokeStyle = PAL.sage;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sx, g.merge.y);
      ctx.lineTo(sx, g.roster.y - g.ch * 0.95);
      ctx.stroke();
      ctx.globalAlpha = 1;
      dot(sx, g.merge.y, 4, PAL.sage);
      ctx.strokeStyle = PAL.sageFaint;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(sx, g.roster.y - g.ch * 0.95);
      ctx.lineTo(sx, g.roster.y - g.ch * 0.55);
      ctx.stroke();
      // gates: bars across the spine, name to the right
      const gh = g.cw * 0.9;
      for (let i = 0; i < 4; i++) {
        const gy = g.gates[i].y;
        const on = activeGate === i;
        if (on) {
          ctx.strokeStyle = PAL.sage;
          ctx.globalAlpha = 0.18;
          ctx.lineWidth = 12;
          ctx.beginPath();
          ctx.moveTo(sx - gh, gy);
          ctx.lineTo(sx + gh, gy);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.strokeStyle = on ? PAL.sage : PAL.secondary;
        ctx.globalAlpha = on ? 1 : 0.7;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(sx - gh, gy);
        ctx.lineTo(sx + gh, gy);
        ctx.stroke();
        ctx.globalAlpha = 1;
        dot(sx - gh, gy, 2.6, on ? PAL.sage : PAL.secondary);
        dot(sx + gh, gy, 2.6, on ? PAL.sage : PAL.secondary);
        ctx.font = "600 10px " + MONO;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = on ? PAL.sage : PAL.muted;
        ctx.fillText(GATE_KEYS[i].toUpperCase(), sx + gh + 8, gy);
      }
      // parked "not this role" column marker on the left
      ctx.font = "600 10px " + MONO;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = PAL.muted;
      ctx.fillText("NOT THIS ROLE", g.parkX - g.cw / 2, g.gates[0].y - g.ch * 0.72);
      ctx.strokeStyle = PAL.lineSoft;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(g.parkX, g.gates[0].y - g.ch * 0.4);
      ctx.lineTo(g.parkX, g.gates[3].y + g.ch * 0.5);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawStructure = () => {
      const g = geom as Geom;
      if (g.compact) {
        drawStructureCompact(g);
        return;
      }
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = PAL.line;
      curve(g.enIn, g.merge);
      curve(g.esIn, g.merge);
      dot(g.enIn.x, g.enIn.y, 3, PAL.primary);
      dot(g.esIn.x, g.esIn.y, 3, PAL.secondary);
      ctx.textAlign = "center";
      ctx.font = "600 9px " + MONO;
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = PAL.primary;
      ctx.fillText("EN", g.enIn.x, g.enIn.y - g.ch * 0.72 - 4);
      ctx.textBaseline = "hanging";
      ctx.fillStyle = PAL.secondary;
      ctx.fillText("ES", g.esIn.x, g.esIn.y + g.ch * 0.72 + 4);
      ctx.strokeStyle = PAL.sage;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(g.merge.x, g.spineY);
      ctx.lineTo(g.gates[3].x + g.cw * 0.9, g.spineY);
      ctx.stroke();
      ctx.globalAlpha = 1;
      dot(g.merge.x, g.merge.y, 4, PAL.sage);
      ctx.strokeStyle = PAL.sageFaint;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(g.gates[3].x + g.cw * 0.9, g.spineY);
      ctx.lineTo(g.roster.x, g.spineY);
      ctx.stroke();
      const halfH = g.ch * 1.15;
      for (let i = 0; i < 4; i++) {
        const gx = g.gates[i].x;
        const gy = g.spineY;
        const on = activeGate === i;
        if (on) {
          ctx.strokeStyle = PAL.sage;
          ctx.globalAlpha = 0.18;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(gx, gy - halfH);
          ctx.lineTo(gx, gy + halfH);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.strokeStyle = on ? PAL.sage : PAL.secondary;
        ctx.globalAlpha = on ? 1 : 0.7;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(gx, gy - halfH);
        ctx.lineTo(gx, gy + halfH);
        ctx.stroke();
        ctx.globalAlpha = 1;
        dot(gx, gy - halfH, 2.4, on ? PAL.sage : PAL.secondary);
        dot(gx, gy + halfH, 2.4, on ? PAL.sage : PAL.secondary);
        ctx.font = "600 8.5px " + MONO;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = PAL.muted;
        ctx.fillText(GATE_KEYS[i].toUpperCase(), gx, gy + halfH + 16);
      }
      ctx.strokeStyle = PAL.lineSoft;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(g.gates[0].x - g.cw, g.trayY - g.ch * 0.78);
      ctx.lineTo(g.gates[3].x + g.cw, g.trayY - g.ch * 0.78);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.font = "600 8px " + MONO;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = PAL.muted;
      ctx.fillText("NOT THIS ROLE", g.gates[0].x - g.cw, g.trayY - g.ch * 0.98);
    };

    const drawRoster = (GF: number) => {
      const g = geom as Geom;
      const r = g.roster;
      if (g.compact) {
        // bottom row: a label above four slots, no heavy box
        const y0 = r.y - g.ch / 2;
        ctx.font = "600 10px " + MONO;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = PAL.muted;
        ctx.fillText("TEAM ROSTER", r.x - g.cw / 2, y0 - 9);
        dot(r.x + r.w * (ROSTER_SLOTS - 1) + g.cw / 2, y0 - 12.5, 2.6, PAL.sage);
      } else {
        rr(r.x, r.y, r.w, r.h, 12);
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = PAL.panel;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = PAL.line;
        ctx.stroke();
        ctx.font = "600 8.5px " + MONO;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = PAL.muted;
        ctx.fillText("TEAM ROSTER", r.x + 10, r.y + 14);
        dot(r.x + r.w - 12, r.y + 10, 2.6, PAL.sage);
      }
      for (let i = 0; i < ROSTER_SLOTS; i++) {
        const c = rosterSlot(i);
        let filled: RosterEntry | null = null;
        for (let j = 0; j < roster.length; j++) {
          if (roster[j].slot === i) {
            filled = roster[j];
            break;
          }
        }
        if (filled) {
          drawCard(c.x, c.y, filled.ini, filled.stream, GF, "hired");
          register(c.x, c.y, filled.ini, filled.stream, "hired");
        } else {
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = PAL.line;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
          rr(c.x - g.cw / 2, c.y - g.ch / 2, g.cw, g.ch, 6);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
        }
      }
    };

    const drawPlate = (c: FrameCard) => {
      const label = c.stream + "  " + c.st;
      ctx.font = "600 9px " + MONO;
      const tw = ctx.measureText(label).width;
      const pw = tw + 16;
      const ph = 18;
      let px = c.x - pw / 2;
      let py = c.y - c.h / 2 - ph - 8;
      if (px < 4) px = 4;
      if (px + pw > W - 4) px = W - 4 - pw;
      if (py < 4) py = c.y + c.h / 2 + 8;
      rr(px, py, pw, ph, 5);
      ctx.globalAlpha = 0.97;
      ctx.fillStyle = PAL.panel;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
      ctx.strokeStyle = PAL.sageDim;
      ctx.stroke();
      ctx.fillStyle = PAL.ink;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(label, px + 8, py + ph / 2 + 0.5);
    };

    const draw = () => {
      if (W === 0 || H === 0) return;
      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      frameCards.length = 0;
      const GF = mode === "reset" ? globalFade : 1;

      drawStructure();

      for (let i = 0; i < parked.length; i++) {
        const p = parked[i];
        drawCard(p.x, p.y, p.ini, p.stream, 0.4 * GF, "parked");
        register(p.x, p.y, p.ini, p.stream, "not this role");
      }
      drawRoster(GF);

      const act = mode === "run" ? sampleActive() : null;
      if (act) {
        const cand = curCand();
        const state =
          act.k === "dock"
            ? "hired"
            : act.k === "park" || act.st === "not this role"
            ? "parkmove"
            : "active";
        drawCard(act.x, act.y, cand.ini, cand.stream, act.al, state);
        register(act.x, act.y, cand.ini, cand.stream, act.st);
        if (act.k === "hold") {
          const g = geom as Geom;
          const w = g.cw;
          const h = g.ch;
          const sx = act.x - w / 2 + w * act.u;
          ctx.strokeStyle = PAL.sage;
          ctx.globalAlpha = 0.5;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(sx, act.y - h / 2 - 3);
          ctx.lineTo(sx, act.y + h / 2 + 3);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      hoverCard = null;
      if (pointer.on) {
        for (let k = frameCards.length - 1; k >= 0; k--) {
          const fc = frameCards[k];
          if (
            pointer.x >= fc.x - fc.w / 2 &&
            pointer.x <= fc.x + fc.w / 2 &&
            pointer.y >= fc.y - fc.h / 2 &&
            pointer.y <= fc.y + fc.h / 2
          ) {
            hoverCard = fc;
            break;
          }
        }
      }
      if (hoverCard) drawPlate(hoverCard);

      if (caption) caption.textContent = act ? act.st : "one pipeline";
    };

    const resolveStatic = () => {
      parked = [];
      roster = [];
      trayCount = [0, 0, 0, 0];
      rosterCount = 0;
      for (let i = 0; i < SCRIPT.length; i++) {
        const c = SCRIPT[i];
        if (c.park >= 0) {
          const pp = parkPos(c.park, trayCount[c.park]);
          parked.push({ x: pp.x, y: pp.y, ini: c.ini, stream: c.stream, gate: c.park });
          trayCount[c.park]++;
        } else {
          roster.push({ ini: c.ini, stream: c.stream, slot: rosterCount });
          rosterCount++;
        }
      }
      segs = null;
      mode = "static";
      globalFade = 1;
      draw();
      const g = geom as Geom;
      drawCard(g.gates[2].x, g.gates[2].y, "MK", "ES", 1, "active");
      if (caption) caption.textContent = "interviewed";
    };

    const resetState = () => {
      parked = [];
      roster = [];
      trayCount = [0, 0, 0, 0];
      rosterCount = 0;
      idx = 0;
      segs = null;
      ct = 0;
      mode = "run";
      globalFade = 1;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      compact = W < 520;
      fitCanvas(canvas, ctx, W, H);
      layout();
      positionHotspots();
      if (reduced()) resolveStatic();
      else {
        resetState();
        draw();
      }
    };

    const frameLoop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frameLoop);
      if (now - last < 32) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      step(dt);
      draw();
    };
    const canRun = () => !reduced() && docVisible && onscreen;
    const start = () => {
      if (running || !canRun()) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frameLoop);
    };
    const stop = () => {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    readPalette();

    // gate hotspots: hover or focus highlights the gate and raises its plate
    const gateCleanups: Array<() => void> = [];
    const hotspots = frame
      ? Array.from(frame.querySelectorAll<HTMLAnchorElement>(".gate-hotspot"))
      : [];
    const origLeft = hotspots.map((h) => h.style.left);
    hotspots.forEach((h) => {
      const gi = parseInt(h.getAttribute("data-gate") || "0", 10);
      const on = () => {
        activeGate = gi;
        if (!running) draw();
      };
      const off = () => {
        activeGate = null;
        if (!running) draw();
      };
      h.addEventListener("mouseenter", on);
      h.addEventListener("mouseleave", off);
      h.addEventListener("focus", on);
      h.addEventListener("blur", off);
      gateCleanups.push(() => {
        h.removeEventListener("mouseenter", on);
        h.removeEventListener("mouseleave", off);
        h.removeEventListener("focus", on);
        h.removeEventListener("blur", off);
      });
    });
    // keep the anchors aligned with the drawn gates in either layout. In the
    // portrait compact mode the gates stack, so the hotspots become horizontal
    // bands crossing the vertical spine at each gate's y.
    const positionHotspots = () => {
      hotspots.forEach((h) => {
        const gi = parseInt(h.getAttribute("data-gate") || "0", 10);
        if (compact) {
          h.style.left = "50%";
          h.style.top = (GATEY_C[gi] * 100).toFixed(2) + "%";
          h.style.width = "66%";
          h.style.height = "12%";
          h.style.transform = "translate(-50%, -50%)";
        } else {
          h.style.left = origLeft[gi];
          h.style.top = "";
          h.style.width = "";
          h.style.height = "";
          h.style.transform = "";
        }
      });
    };

    // card hover: raise a readout plate for any visible card
    const onCanvasMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = true;
      if (!running) draw();
    };
    const onCanvasLeave = () => {
      pointer.on = false;
      if (!running) draw();
    };
    canvas.addEventListener("pointermove", onCanvasMove);
    canvas.addEventListener("pointerleave", onCanvasLeave);

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (en) => {
          onscreen = en[0].isIntersecting;
          if (onscreen && docVisible) start();
          else stop();
        },
        { threshold: 0.12 }
      );
      io.observe(canvas);
    } else {
      onscreen = true;
    }

    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible && onscreen) start();
      else stop();
    };
    const onMode = () => {
      readPalette();
      if (reduced()) resolveStatic();
      else draw();
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        resolveStatic();
      } else {
        resetState();
        start();
      }
    };
    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 140);
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("cardon-mode", onMode);
    window.addEventListener("resize", onResize);
    reduceMQ.addEventListener("change", onReduceChange);

    resize();
    if (!("IntersectionObserver" in window) && !reduced()) start();

    return () => {
      stop();
      window.clearTimeout(rt);
      if (io) io.disconnect();
      canvas.removeEventListener("pointermove", onCanvasMove);
      canvas.removeEventListener("pointerleave", onCanvasLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cardon-mode", onMode);
      window.removeEventListener("resize", onResize);
      reduceMQ.removeEventListener("change", onReduceChange);
      gateCleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="stage-wrap">
      <div className="stage-frame" id="pipeFrame" ref={frameRef}>
        <span className="stage-tag mono">
          <span className="before">two streams</span>{" "}
          <span className="midword">into</span>{" "}
          <span className="after">one pipeline</span>
        </span>
        <span className="stage-caption mono" id="pipeCaption" ref={captionRef}>
          one pipeline
        </span>
        <canvas id="pipeCanvas" aria-hidden="true" ref={canvasRef} />

        <a
          className="gate-hotspot"
          data-gate="0"
          href="#build"
          style={{ left: "33.5%" }}
          aria-label="Applied stage. Every applicant source arrives in one lane."
        >
          <span className="gate-label">
            <span className="gate-name">Applied</span>
            <span className="gate-note">every source, one lane</span>
          </span>
        </a>
        <a
          className="gate-hotspot"
          data-gate="1"
          href="#build"
          style={{ left: "45.5%" }}
          aria-label="Screened stage. The whole team reads where each candidate stands."
        >
          <span className="gate-label">
            <span className="gate-name">Screened</span>
            <span className="gate-note">the team reads the stage</span>
          </span>
        </a>
        <a
          className="gate-hotspot"
          data-gate="2"
          href="#build"
          style={{ left: "57.5%" }}
          aria-label="Interviewed stage. Scheduling that runs itself."
        >
          <span className="gate-label">
            <span className="gate-name">Interviewed</span>
            <span className="gate-note">scheduling runs itself</span>
          </span>
        </a>
        <a
          className="gate-hotspot"
          data-gate="3"
          href="#build"
          style={{ left: "69.5%" }}
          aria-label="Offer stage. Time to hire stays in view."
        >
          <span className="gate-label">
            <span className="gate-name">Offer</span>
            <span className="gate-note">time to hire, in view</span>
          </span>
        </a>

        <noscript>
          <div className="stage-fallback">
            Anonymous applicants enter from an English and a Spanish stream, merge
            into one pipeline, and pass through applied, screened, interviewed, and
            offer gates. Some settle into a quiet not this role tray; those who pass
            dock into a team roster.
          </div>
        </noscript>
      </div>
    </div>
  );
}
