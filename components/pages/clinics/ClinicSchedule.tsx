"use client";

import { useEffect, useRef } from "react";

/**
 * Signature visual: two inquiry streams becoming one calm week.
 *
 * Inquiry chips emit from two channels (EN, primary; ES, secondary) carrying
 * call / form / message glyph labels. They merge onto one intake line, some
 * pause at a confirm gate where a reminder ping settles them (a no-show quietly
 * prevented), then dock as appointments onto a week grid that fills evenly.
 * Docked appointments are oasis blue: two languages resolved into one schedule.
 *
 * Faithful port of the source canvas routine: DPR capped at 2, Intersection
 * Observer + visibilitychange pausing, palette re-read on the "cardon-mode"
 * window event, and a resolved full-week static composition under
 * prefers-reduced-motion.
 */

const MONO = 'ui-monospace, "SFMono-Regular", Consolas, monospace';

type RGB = [number, number, number];

type Channel = "EN" | "ES";

type Cell = { c: number; r: number };

type Chip = {
  idx: number;
  channel: Channel;
  glyph: string;
  needsConfirm: boolean;
  cell: Cell;
  spawnT: number;
  travel: number;
};

type Geo = {
  emX: number;
  enY: number;
  esY: number;
  mX: number;
  mY: number;
  gateX: number;
  railEnd: number;
  calX0: number;
  calX1: number;
  calTop: number;
  gridTop: number;
  calBot: number;
  cellW: number;
  cellH: number;
  chipW: number;
  chipH: number;
  headerH: number;
  compact: boolean;
  gateY: number;
  railEndY: number;
};

type Slot = {
  el: HTMLButtonElement;
  idx: number;
  cell: Cell;
  filled: boolean;
};

type ChipState =
  | { docked: true }
  | { docked: false; x: number; y: number; confirmProg: number };

type Palette = {
  dark: boolean;
  groundRgb: RGB;
  ground: string;
  panelRgb: RGB;
  panel: string;
  card: string;
  textRgb: RGB;
  ink: string;
  dim: string;
  faint: string;
  muted: string;
  line: string;
  lineSoft: string;
  primaryRgb: RGB;
  primary: string;
  primarySoft: string;
  primaryFaint: string;
  primaryDim: string;
  primaryBright: string;
  secondaryRgb: RGB;
  secondary: string;
  secondarySoft: string;
  secondaryBright: string;
  energyRgb: RGB;
  energy: string;
  energyBright: string;
  oasisRgb: RGB;
  oasis: string;
  oasisSoft: string;
  oasisFaint: string;
  oasisDim: string;
  oasisLine: string;
  oasisBright: string;
};

export default function ClinicSchedule() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hotWrapRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hotWrap = hotWrapRef.current;
    const caption = captionRef.current;
    if (!canvas || !canvas.getContext || !hotWrap) return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let T = 0;
    let compact = false;

    /* ---------------- palette read from the active theme tokens ---------------- */
    const WHITE: RGB = [255, 255, 255];
    const BLACK: RGB = [12, 12, 12];
    const cssVar = (name: string) =>
      getComputedStyle(canvas).getPropertyValue(name).trim();
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

    const PAL: Palette = {
      dark: true,
      groundRgb: [15, 20, 16],
      ground: "",
      panelRgb: [22, 32, 26],
      panel: "",
      card: "",
      textRgb: [228, 234, 217],
      ink: "",
      dim: "",
      faint: "",
      muted: "",
      line: "",
      lineSoft: "",
      primaryRgb: [63, 181, 138],
      primary: "",
      primarySoft: "",
      primaryFaint: "",
      primaryDim: "",
      primaryBright: "",
      secondaryRgb: [217, 168, 58],
      secondary: "",
      secondarySoft: "",
      secondaryBright: "",
      energyRgb: [195, 73, 27],
      energy: "",
      energyBright: "",
      oasisRgb: [95, 166, 192],
      oasis: "",
      oasisSoft: "",
      oasisFaint: "",
      oasisDim: "",
      oasisLine: "",
      oasisBright: "",
    };

    const readPalette = () => {
      const ground = hexToRgb(cssVar("--ground") || "#0F1410");
      const panel = hexToRgb(cssVar("--panel") || "#16201A");
      const text = hexToRgb(cssVar("--text") || "#E4EAD9");
      const primary = hexToRgb(cssVar("--primary") || "#3FB58A");
      const secondary = hexToRgb(cssVar("--secondary") || "#D9A83A");
      const energy = hexToRgb(cssVar("--energy") || "#C3491B");
      const oasis = hexToRgb(cssVar("--oasis") || "#5FA6C0");
      const dark = root.getAttribute("data-mode") !== "light";
      const toward = dark ? WHITE : BLACK;

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
      PAL.oasisRgb = oasis;
      PAL.oasis = rgba(oasis, 1);
      PAL.oasisSoft = rgba(oasis, 0.85);
      PAL.oasisFaint = rgba(oasis, 0.15);
      PAL.oasisDim = rgba(oasis, 0.5);
      PAL.oasisLine = rgba(oasis, 0.3);
      PAL.oasisBright = rgba(mix(oasis, toward, 0.24), 1);
    };
    readPalette();

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
    const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, p: number) => ({
      x: a.x + (b.x - a.x) * p,
      y: a.y + (b.y - a.y) * p,
    });

    /* ---------------- schedule model ---------------- */
    const COLS = 5;
    const ROWS = 3;
    const N = COLS * ROWS;
    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const DAYLET = ["M", "T", "W", "T", "F"];
    const SLOTS = ["09:30", "12:00", "16:00"];
    const GLYPHS = ["CALL", "FORM", "MSG", "DM"];

    /* build order: row-major so the week fills evenly, left to right, top down */
    const ORDER: Cell[] = [];
    for (let rI = 0; rI < ROWS; rI++) {
      for (let cI = 0; cI < COLS; cI++) ORDER.push({ c: cI, r: rI });
    }

    const SPAWN_INT = 0.78;
    const D1 = 1.15;
    const D2 = 0.85;
    const HCONF = 0.95;
    const D2B = 0.4;
    const D3 = 1.35;
    const CHIPS: Chip[] = [];
    for (let i = 0; i < N; i++) {
      const conf = i % 4 === 2;
      CHIPS.push({
        idx: i,
        channel: i % 2 === 0 ? "EN" : "ES",
        glyph: GLYPHS[i % GLYPHS.length],
        needsConfirm: conf,
        cell: ORDER[i],
        spawnT: i * SPAWN_INT,
        travel: D1 + D2 + (conf ? HCONF : 0) + D2B + D3,
      });
    }
    let lastDock = 0;
    for (let d = 0; d < CHIPS.length; d++) {
      lastDock = Math.max(lastDock, CHIPS[d].spawnT + CHIPS[d].travel);
    }
    const FILL_DONE = lastDock;
    const HOLD = 4.6;
    const FADE = 1.3;
    const HOLD_END = FILL_DONE + HOLD;
    const CYCLE = HOLD_END + FADE;

    /* ---------------- geometry, recomputed on resize ---------------- */
    let G: Geo | null = null;
    const layout = () => {
      const headerH = Math.max(14, Math.min(22, H * 0.05));
      if (compact) {
        // portrait: two emitters at the top, a short vertical intake line with
        // the confirm gate, then the week grid uses the full width below so the
        // five day columns are wide enough to carry real EN / ES appointments.
        const emX = W * 0.265;
        const enY = H * 0.105;
        const mX = W * 0.5;
        const mY = H * 0.17;
        const gateY = H * 0.315;
        const railEndY = H * 0.39;
        const calX0 = W * 0.045;
        const calX1 = W * 0.955;
        const calTop = H * 0.435;
        const calBot = H * 0.955;
        const gridTop = calTop + headerH;
        const chipW = Math.max(40, Math.min(56, W * 0.13));
        const chipH = Math.max(16, Math.min(22, chipW * 0.4));
        G = {
          emX,
          enY,
          esY: enY,
          mX,
          mY,
          gateX: mX,
          railEnd: mX,
          calX0,
          calX1,
          calTop,
          gridTop,
          calBot,
          cellW: (calX1 - calX0) / COLS,
          cellH: (calBot - gridTop) / ROWS,
          chipW,
          chipH,
          headerH,
          compact: true,
          gateY,
          railEndY,
        };
        positionHotspots();
        return;
      }
      const emX = Math.max(26, W * 0.095);
      const enY = H * 0.3;
      const esY = H * 0.7;
      const mX = W * 0.285;
      const mY = H * 0.5;
      const gateX = W * 0.435;
      const railEnd = W * 0.505;
      const calX0 = W * 0.56;
      const calX1 = W * 0.965;
      const calTop = H * 0.135;
      const calBot = H * 0.905;
      const gridTop = calTop + headerH;
      const cellW = (calX1 - calX0) / COLS;
      const cellH = (calBot - gridTop) / ROWS;
      const chipW = Math.max(30, Math.min(48, W * 0.078));
      const chipH = Math.max(14, Math.min(18, chipW * 0.38));
      G = {
        emX,
        enY,
        esY,
        mX,
        mY,
        gateX,
        railEnd,
        calX0,
        calX1,
        calTop,
        gridTop,
        calBot,
        cellW,
        cellH,
        chipW,
        chipH,
        headerH,
        compact: false,
        gateY: mY,
        railEndY: mY,
      };
      positionHotspots();
    };
    const cellCenter = (c: number, r: number) => {
      const g = G!;
      return { x: g.calX0 + g.cellW * (c + 0.5), y: g.gridTop + g.cellH * (r + 0.5) };
    };
    const emitterPos = (ch: Channel) => {
      const g = G!;
      if (g.compact) return { x: ch === "EN" ? g.emX : W - g.emX, y: g.enY };
      return { x: g.emX, y: ch === "EN" ? g.enY : g.esY };
    };

    /* ---- accessible hotspots + readout plates (one per appointment) ---- */
    const slots: Slot[] = [];
    const buildHotspots = () => {
      for (let k = 0; k < N; k++) {
        const ch = CHIPS[k];
        const cell = ch.cell;
        const day = DAYS[cell.c];
        const time = SLOTS[cell.r];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cal-slot";
        btn.setAttribute("data-idx", String(k));
        btn.setAttribute("tabindex", "-1");
        btn.setAttribute("aria-hidden", "true");
        btn.setAttribute(
          "aria-label",
          "Appointment, illustrative. " +
            day +
            " " +
            time +
            ", " +
            ch.channel +
            " inquiry, confirmed."
        );
        if (cell.r === 0) btn.classList.add("plate-below");
        if (cell.c === 0) btn.classList.add("plate-left");
        if (cell.c === COLS - 1) btn.classList.add("plate-right");
        const plate = document.createElement("span");
        plate.className = "cal-plate";
        plate.setAttribute("aria-hidden", "true");
        const l1 = document.createElement("span");
        l1.className = "p-time";
        l1.textContent = day + " " + time;
        const l2 = document.createElement("span");
        l2.className = "p-meta";
        l2.textContent = ch.channel + " inquiry / confirmed";
        const l3 = document.createElement("span");
        l3.className = "p-illus";
        l3.textContent = "illustrative";
        plate.appendChild(l1);
        plate.appendChild(l2);
        plate.appendChild(l3);
        btn.appendChild(plate);
        hotWrap.appendChild(btn);
        slots.push({ el: btn, idx: k, cell: cell, filled: false });
      }
    };
    function positionHotspots() {
      if (!G) return;
      const g = G;
      for (let k = 0; k < slots.length; k++) {
        const cell = slots[k].cell;
        const cx = g.calX0 + g.cellW * cell.c;
        const cy = g.gridTop + g.cellH * cell.r;
        const pad = 3;
        const el = slots[k].el;
        el.style.left = cx + pad + "px";
        el.style.top = cy + pad + "px";
        el.style.width = Math.max(6, g.cellW - pad * 2) + "px";
        el.style.height = Math.max(6, g.cellH - pad * 2) + "px";
      }
    }
    const setFilled = (idx: number, on: boolean) => {
      const s = slots[idx];
      if (!s || s.filled === on) return;
      s.filled = on;
      s.el.classList.toggle("filled", on);
      s.el.setAttribute("tabindex", on ? "0" : "-1");
      s.el.setAttribute("aria-hidden", on ? "false" : "true");
    };
    const allFilled = (on: boolean) => {
      for (let k = 0; k < slots.length; k++) setFilled(k, on);
    };

    /* ---- drawing pieces ---- */
    const drawCalendar = () => {
      const g = G!;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "alphabetic";
      ctx!.font =
        "600 " + Math.max(8, Math.min(11, g.cellW * 0.24)).toFixed(0) + "px " + MONO;
      for (let c = 0; c < COLS; c++) {
        const hx = g.calX0 + g.cellW * (c + 0.5);
        ctx!.fillStyle = PAL.muted;
        ctx!.fillText(DAYLET[c], hx, g.calTop + g.headerH * 0.72);
      }
      ctx!.strokeStyle = PAL.lineSoft;
      ctx!.lineWidth = 1;
      for (let cc = 0; cc <= COLS; cc++) {
        const gx = g.calX0 + g.cellW * cc;
        ctx!.beginPath();
        ctx!.moveTo(gx, g.gridTop);
        ctx!.lineTo(gx, g.calBot);
        ctx!.stroke();
      }
      for (let rr2 = 0; rr2 <= ROWS; rr2++) {
        const gy = g.gridTop + g.cellH * rr2;
        ctx!.beginPath();
        ctx!.moveTo(g.calX0, gy);
        ctx!.lineTo(g.calX1, gy);
        ctx!.stroke();
      }
    };
    const drawEmptyCell = (c: number, r: number) => {
      const ctr = cellCenter(c, r);
      ctx!.fillStyle = PAL.faint;
      ctx!.globalAlpha = 0.5;
      ctx!.beginPath();
      ctx!.arc(ctr.x, ctr.y, 1.7, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.globalAlpha = 1;
    };
    const drawAppointment = (
      c: number,
      r: number,
      channel: Channel,
      pop: number
    ) => {
      const g = G!;
      const x = g.calX0 + g.cellW * c;
      const y = g.gridTop + g.cellH * r;
      const pad = Math.max(3, g.cellW * 0.09);
      const bw = g.cellW - pad * 2;
      const bh = g.cellH - pad * 2;
      const sc = 0.72 + 0.28 * pop;
      const cxk = x + g.cellW / 2;
      const cyk = y + g.cellH / 2;
      ctx!.save();
      ctx!.translate(cxk, cyk);
      ctx!.scale(sc, sc);
      ctx!.translate(-cxk, -cyk);
      ctx!.globalAlpha = pop;
      rr(ctx!, x + pad, y + pad, bw, bh, Math.min(7, bh / 2));
      ctx!.fillStyle = PAL.oasisFaint;
      ctx!.fill();
      ctx!.strokeStyle = PAL.oasisDim;
      ctx!.lineWidth = 1.2;
      ctx!.stroke();
      /* channel accent stripe on the left edge: keeps the EN / ES origin visible */
      ctx!.fillStyle = channel === "EN" ? PAL.primary : PAL.secondary;
      rr(ctx!, x + pad, y + pad, Math.max(2.5, bw * 0.1), bh, 2);
      ctx!.fill();
      /* a small settled tick + label if the cell is wide enough */
      if (bw > 40) {
        ctx!.fillStyle = PAL.oasisBright;
        ctx!.font =
          "600 " +
          (compact
            ? Math.max(10, Math.min(13, bw * 0.22))
            : Math.max(7, Math.min(9, bw * 0.16))
          ).toFixed(0) +
          "px " +
          MONO;
        ctx!.textAlign = "left";
        ctx!.textBaseline = "middle";
        ctx!.fillText(channel, x + pad + bw * 0.2, y + g.cellH / 2);
      } else {
        ctx!.fillStyle = PAL.oasis;
        ctx!.beginPath();
        ctx!.arc(x + pad + bw * 0.58, y + g.cellH / 2, 2.2, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
      ctx!.globalAlpha = 1;
    };
    const drawEmitter = (
      p: { x: number; y: number },
      label: string,
      col: string
    ) => {
      const g = G!;
      const w = compact ? Math.max(46, g.chipW * 0.84) : Math.max(26, g.chipW * 0.62);
      const h = compact ? Math.max(21, g.chipH + 4) : Math.max(15, g.chipH + 2);
      rr(ctx!, p.x - w / 2, p.y - h / 2, w, h, 5);
      ctx!.fillStyle = PAL.card;
      ctx!.fill();
      ctx!.strokeStyle = col;
      ctx!.lineWidth = 1.4;
      ctx!.stroke();
      ctx!.fillStyle = col;
      ctx!.beginPath();
      ctx!.arc(p.x - w / 2 + (compact ? 9 : 7), p.y, compact ? 3 : 2.6, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = PAL.ink;
      ctx!.font = "600 " + (compact ? 11 : 9) + "px " + MONO;
      ctx!.textAlign = "left";
      ctx!.textBaseline = "middle";
      ctx!.fillText(label, p.x - w / 2 + (compact ? 17 : 13), p.y + 0.5);
    };
    const drawGate = () => {
      const g = G!;
      if (g.compact) {
        const gx = g.mX;
        const gy = g.gateY;
        const gh = Math.max(15, g.chipH + 7);
        ctx!.strokeStyle = PAL.secondarySoft;
        ctx!.lineWidth = 1.6;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(gx - gh, gy);
        ctx!.lineTo(gx - 4, gy);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(gx + 4, gy);
        ctx!.lineTo(gx + gh, gy);
        ctx!.stroke();
        ctx!.fillStyle = PAL.muted;
        ctx!.font = "600 10px " + MONO;
        ctx!.textAlign = "left";
        ctx!.textBaseline = "middle";
        ctx!.fillText("confirm", gx + gh + 7, gy);
        return;
      }
      const gx = g.gateX;
      const gy = g.mY;
      const gh = Math.max(12, g.chipH + 4);
      ctx!.strokeStyle = PAL.secondarySoft;
      ctx!.lineWidth = 1.6;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(gx, gy - gh);
      ctx!.lineTo(gx, gy - 4);
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.moveTo(gx, gy + 4);
      ctx!.lineTo(gx, gy + gh);
      ctx!.stroke();
      ctx!.fillStyle = PAL.muted;
      ctx!.font = "600 8px " + MONO;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "alphabetic";
      ctx!.fillText("confirm", gx, gy + gh + 10);
    };
    const drawStreams = () => {
      const g = G!;
      const en = emitterPos("EN");
      const es = emitterPos("ES");
      const M = { x: g.mX, y: g.mY };
      if (g.compact) {
        /* two feeds from the top emitters curving down into the merge node */
        ctx!.lineWidth = 1.5;
        ctx!.lineCap = "round";
        const midY = (en.y + M.y) / 2;
        ctx!.strokeStyle = rgba(PAL.primaryRgb, 0.3);
        ctx!.beginPath();
        ctx!.moveTo(en.x, en.y + g.chipH * 0.5);
        ctx!.bezierCurveTo(en.x, midY, M.x, midY, M.x, M.y);
        ctx!.stroke();
        ctx!.strokeStyle = rgba(PAL.secondaryRgb, 0.3);
        ctx!.beginPath();
        ctx!.moveTo(es.x, es.y + g.chipH * 0.5);
        ctx!.bezierCurveTo(es.x, midY, M.x, midY, M.x, M.y);
        ctx!.stroke();
        /* the single vertical intake line down toward the week grid, oasis */
        ctx!.strokeStyle = PAL.oasisDim;
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        ctx!.moveTo(M.x, M.y);
        ctx!.lineTo(g.mX, g.railEndY);
        ctx!.stroke();
        ctx!.fillStyle = PAL.oasis;
        ctx!.beginPath();
        ctx!.arc(M.x, M.y, 3.4, 0, Math.PI * 2);
        ctx!.fill();
        drawEmitter(en, "EN", PAL.primary);
        drawEmitter(es, "ES", PAL.secondary);
        drawGate();
        return;
      }
      /* two faint feed curves from the emitters converging at the merge node */
      ctx!.lineWidth = 1.4;
      ctx!.lineCap = "round";
      ctx!.strokeStyle = rgba(PAL.primaryRgb, 0.28);
      ctx!.beginPath();
      ctx!.moveTo(en.x + g.chipW * 0.5, en.y);
      ctx!.bezierCurveTo((en.x + M.x) / 2, en.y, (en.x + M.x) / 2, M.y, M.x, M.y);
      ctx!.stroke();
      ctx!.strokeStyle = rgba(PAL.secondaryRgb, 0.28);
      ctx!.beginPath();
      ctx!.moveTo(es.x + g.chipW * 0.5, es.y);
      ctx!.bezierCurveTo((es.x + M.x) / 2, es.y, (es.x + M.x) / 2, M.y, M.x, M.y);
      ctx!.stroke();
      /* the single intake line from merge to the calendar edge, oasis */
      ctx!.strokeStyle = PAL.oasisDim;
      ctx!.lineWidth = 2;
      ctx!.beginPath();
      ctx!.moveTo(M.x, M.y);
      ctx!.lineTo(g.railEnd, M.y);
      ctx!.stroke();
      /* merge node */
      ctx!.fillStyle = PAL.oasis;
      ctx!.beginPath();
      ctx!.arc(M.x, M.y, 3.2, 0, Math.PI * 2);
      ctx!.fill();
      /* emitter tags */
      drawEmitter(en, "EN", PAL.primary);
      drawEmitter(es, "ES", PAL.secondary);
      /* confirm gate on the intake line */
      drawGate();
    };
    const drawChip = (
      x: number,
      y: number,
      channel: Channel,
      glyph: string
    ) => {
      const g = G!;
      const w = g.chipW;
      const h = g.chipH;
      const col = channel === "EN" ? PAL.primary : PAL.secondary;
      ctx!.save();
      rr(ctx!, x - w / 2, y - h / 2, w, h, 4);
      ctx!.fillStyle = PAL.card;
      ctx!.fill();
      ctx!.strokeStyle = col;
      ctx!.lineWidth = 1.2;
      ctx!.stroke();
      ctx!.fillStyle = col;
      ctx!.beginPath();
      ctx!.arc(x - w / 2 + (compact ? 8 : 6), y, compact ? 2.6 : 2.2, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = PAL.dim;
      ctx!.font = "600 " + (compact ? 9 : 7) + "px " + MONO;
      ctx!.textAlign = "left";
      ctx!.textBaseline = "middle";
      ctx!.fillText(glyph, x - w / 2 + (compact ? 14 : 11), y + 0.5);
      ctx!.restore();
    };
    const drawPing = (gx: number, gy: number, prog: number) => {
      const g = G!;
      /* an expanding reminder ring that settles the paused chip, calm */
      const e = clamp01(prog);
      const rad = 6 + e * 16;
      ctx!.strokeStyle = rgba(PAL.oasisRgb, (1 - e) * 0.7);
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.arc(gx, gy, rad, 0, Math.PI * 2);
      ctx!.stroke();
      const fade = Math.sin(e * Math.PI);
      ctx!.globalAlpha = fade;
      ctx!.fillStyle = PAL.oasisBright;
      ctx!.font = "600 " + (compact ? 10 : 8) + "px " + MONO;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "alphabetic";
      ctx!.fillText("reminder", gx, gy - g.chipH - (compact ? 10 : 8));
      ctx!.fillStyle = PAL.muted;
      ctx!.font = "600 " + (compact ? 9 : 7) + "px " + MONO;
      ctx!.fillText("no-show prevented", gx, gy - g.chipH - (compact ? 23 : 19));
      ctx!.globalAlpha = 1;
    };

    /* position of a chip at time T; returns null if not yet spawned */
    const chipState = (ch: Chip): ChipState | null => {
      const g = G!;
      const e = T - ch.spawnT;
      if (e < 0) return null;
      const M = { x: g.mX, y: g.mY };
      const gate = g.compact
        ? { x: g.mX, y: g.gateY }
        : { x: g.gateX, y: g.mY };
      const rend = g.compact
        ? { x: g.mX, y: g.railEndY }
        : { x: g.railEnd, y: g.mY };
      const start = emitterPos(ch.channel);
      const C = cellCenter(ch.cell.c, ch.cell.r);
      const t1 = D1;
      const t2 = t1 + D2;
      const hc = ch.needsConfirm ? HCONF : 0;
      const tc = t2 + hc;
      const t2b = tc + D2B;
      const t3 = t2b + D3;
      if (e >= t3) return { docked: true };
      let pos: { x: number; y: number };
      let confirmProg = -1;
      if (e < t1) {
        pos = lerp(start, M, easeInOut(e / D1));
      } else if (e < t2) {
        pos = lerp(M, gate, easeInOut((e - t1) / D2));
      } else if (e < tc) {
        pos = gate;
        confirmProg = (e - t2) / hc;
      } else if (e < t2b) {
        pos = lerp(gate, rend, easeInOut((e - tc) / D2B));
      } else {
        const p = easeInOut((e - t2b) / D3);
        const base = lerp(rend, C, p);
        pos = { x: base.x, y: base.y - Math.sin(p * Math.PI) * 10 };
      }
      return { docked: false, x: pos.x, y: pos.y, confirmProg };
    };

    const loopFo = () => {
      if (T < 0.6) return 0.12 + (T / 0.6) * 0.88;
      if (T > HOLD_END) return 1 - clamp01((T - HOLD_END) / FADE) * 0.86;
      return 1;
    };

    const render = (staticFull: boolean) => {
      if (W === 0 || H === 0 || !G) return;
      ctx!.clearRect(0, 0, W, H);
      ctx!.lineJoin = "round";
      ctx!.lineCap = "round";

      /* filled state for each cell */
      const pops = new Array<number>(N);
      for (let k = 0; k < N; k++) {
        const ch = CHIPS[k];
        if (staticFull) {
          pops[k] = 1;
          setFilled(k, true);
          continue;
        }
        const dockT = ch.spawnT + ch.travel;
        if (T >= dockT) {
          const since = T - dockT;
          pops[k] = clamp01(since / 0.45);
          setFilled(k, true);
        } else {
          pops[k] = 0;
          setFilled(k, false);
        }
      }

      drawCalendar();
      /* empty placeholders then docked appointments */
      for (let k = 0; k < N; k++) {
        const ch = CHIPS[k];
        if (pops[k] <= 0) drawEmptyCell(ch.cell.c, ch.cell.r);
      }
      for (let k = 0; k < N; k++) {
        const ch = CHIPS[k];
        if (pops[k] > 0) drawAppointment(ch.cell.c, ch.cell.r, ch.channel, pops[k]);
      }

      drawStreams();

      if (!staticFull) {
        /* travelling chips + confirm pings on top of the streams */
        for (let k = 0; k < N; k++) {
          const ch = CHIPS[k];
          const st = chipState(ch);
          if (!st || st.docked) continue;
          if (st.confirmProg >= 0)
            drawPing(G!.gateX, G!.compact ? G!.gateY : G!.mY, st.confirmProg);
          drawChip(st.x, st.y, ch.channel, ch.glyph);
        }
        /* gentle fade at the loop seam so the reset is never jarring */
        const fo = loopFo();
        if (fo < 1) {
          ctx!.fillStyle = rgba(PAL.groundRgb, (1 - fo) * 0.9);
          ctx!.fillRect(0, 0, W, H);
        }
      }

      if (caption) {
        if (staticFull || T >= FILL_DONE) caption.textContent = "one calm week";
        else caption.textContent = "filling the week";
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      compact = W < 520;
      ctx = fitCanvas(canvas, W, H);
      layout();
      if (reduced()) render(true);
      else render(false);
    };
    const frameLoop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frameLoop);
      if (now - last < 32) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      T += dt;
      if (T > CYCLE) T -= CYCLE;
      render(false);
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

    /* ---------------- listeners ---------------- */
    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 140);
    };
    const onMode = () => {
      readPalette();
      if (reduced()) render(true);
      else render(false);
    };
    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible && onscreen && !reduced()) start();
      else stop();
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        allFilled(true);
        render(true);
      } else {
        start();
      }
    };

    buildHotspots();

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          onscreen = entries[0].isIntersecting;
          if (onscreen && docVisible && !reduced()) start();
          else stop();
        },
        { threshold: 0.12 }
      );
      io.observe(canvas);
    } else {
      onscreen = true;
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("cardon-mode", onMode);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMQ.addEventListener("change", onReduceChange);

    resize();
    if (reduced()) {
      allFilled(true);
      render(true);
    } else if (!("IntersectionObserver" in window)) {
      start();
    }

    return () => {
      stop();
      window.clearTimeout(rt);
      if (io) io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("cardon-mode", onMode);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMQ.removeEventListener("change", onReduceChange);
      hotWrap.innerHTML = "";
    };
  }, []);

  return (
    <div className="stage-wrap">
      <div className="stage-frame sig-frame" id="sigFrame">
        <span className="stage-tag mono">
          <span className="before">EN + ES</span>{" "}
          <span className="midword">merge into</span>{" "}
          <span className="after">one calm week</span>
        </span>
        <span className="stage-caption mono" id="sigCaption" ref={captionRef}>
          filling the week
        </span>
        <canvas id="clinicCanvas" ref={canvasRef} aria-hidden="true" />
        <div
          className="cal-hotspots"
          id="calHotspots"
          ref={hotWrapRef}
          aria-label="Illustrative week schedule. Appointments dock from two language channels."
        />
        <noscript>
          <div className="stage-fallback">
            Inquiry chips arrive from two channels, one labeled EN and one
            labeled ES, carrying calls, forms, and messages. They merge into a
            single intake line, pause briefly at a confirm step where a reminder
            prevents a no-show, then dock as appointments onto a clean week grid
            that fills evenly. Two languages, many channels, one schedule the
            front desk can trust. Labels are illustrative.
          </div>
        </noscript>
      </div>
    </div>
  );
}
