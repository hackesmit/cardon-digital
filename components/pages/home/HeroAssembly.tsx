"use client";

import { useEffect, useRef } from "react";
import {
  MONO,
  clamp01,
  drawFlow,
  easeInOut,
  fitCanvas,
  line,
  makeTrace,
  readPalette,
  rr,
  strokeTraceUpTo,
  type Palette,
  type Pt,
  type Trace,
} from "./canvasKit";

/**
 * Hero doc-organization canvas. Scattered document sources glide smoothly into
 * two clean columns around a central "One system" panel, eased to exactly 0
 * degrees; once a source aligns its connector fills into the center and its row
 * latches. Ported from the desert-tech-v2 home hero IIFE: requestAnimationFrame
 * loop, devicePixelRatio capped at 2, paused offscreen (IntersectionObserver)
 * and when the document is hidden, resolved static state under reduced motion,
 * palette re-read on the "cardon-mode" event.
 */

interface Doc {
  name: string;
  tag: string;
  kind: string;
  side: number;
  row: number;
  sx: number;
  sy: number;
  rot: number;
  targetX: number;
  targetY: number;
  scatterX: number;
  scatterY: number;
  port: Pt;
  conn: Trace;
  glideStart: number;
  fillStart: number;
  pulseSpawned: boolean;
}

interface Row {
  k: string;
  v: string;
  frac: number;
  col: string;
}

interface Pulse {
  di: number;
  L: number;
  spd: number;
}

interface Pose {
  x: number;
  y: number;
  rot: number;
  aligned: boolean;
}

export default function HeroAssembly() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLSpanElement | null>(null);

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
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let T = 0;
    // Portrait compact mode: recomposed vertical layout for narrow screens.
    // Two card columns feed a central spine that plugs into a full-width panel
    // below. Set from the measured canvas width in resize(); geometry branches
    // in layout(). compactInit (viewport-based) only sizes the intro timing.
    const compactInit = canvas.getBoundingClientRect().width < 780;
    let compact = false;
    let spineX = 0;
    let spineTop = 0;

    const SEED: Array<Omit<
      Doc,
      | "targetX"
      | "targetY"
      | "scatterX"
      | "scatterY"
      | "port"
      | "conn"
      | "glideStart"
      | "fillStart"
      | "pulseSpawned"
    >> = [
      { name: "sales.xlsx", tag: "XLSX", kind: "sheet", side: -1, row: 0, sx: 0.1, sy: 0.18, rot: -8 },
      { name: "leads.csv", tag: "CSV", kind: "csv", side: 1, row: 1, sx: 0.88, sy: 0.14, rot: 7 },
      { name: "expenses.xlsx", tag: "XLSX", kind: "sheet", side: -1, row: 2, sx: 0.16, sy: 0.84, rot: 6 },
      { name: "invoice.pdf", tag: "PDF", kind: "pdf", side: 1, row: 3, sx: 0.86, sy: 0.82, rot: -7 },
      { name: "receipt", tag: "RECEIPT", kind: "receipt", side: -1, row: 4, sx: 0.07, sy: 0.52, rot: 5 },
      { name: "whatsapp", tag: "MSG", kind: "chat", side: 1, row: 5, sx: 0.92, sy: 0.5, rot: -6 },
    ];
    const EMPTY: Trace = makeTrace([
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]);
    const DOCS: Doc[] = SEED.map((s) => ({
      ...s,
      targetX: 0,
      targetY: 0,
      scatterX: 0,
      scatterY: 0,
      port: { x: 0, y: 0 },
      conn: EMPTY,
      glideStart: 0,
      fillStart: 0,
      pulseSpawned: false,
    }));
    const ROWS: Row[] = [
      { k: "SALES", v: "live", frac: 0.72, col: "primary" },
      { k: "LEADS", v: "ready", frac: 0.55, col: "secondary" },
      { k: "EXPENSES", v: "matched", frac: 0.4, col: "primary" },
      { k: "PAYMENTS", v: "3 today", frac: 0.48, col: "secondary" },
      { k: "MARGIN", v: "34%", frac: 0.34, col: "primary" },
      { k: "CLOSE", v: "current", frac: 0.62, col: "secondary" },
    ];
    const rowLatched: boolean[] = [false, false, false, false, false, false];

    const INTRO = compactInit ? 0.5 : 0.8;
    const GLIDE_STAGGER = compactInit ? 0.28 : 0.5;
    const GLIDE_DUR = compactInit ? 1.1 : 1.5;
    const FILL_DUR = compactInit ? 0.8 : 1.15;
    const assembleDone =
      INTRO + (DOCS.length - 1) * GLIDE_STAGGER + GLIDE_DUR + FILL_DUR;

    interface Geom {
      cardW: number;
      cardH: number;
      pX: number;
      pY: number;
      pW: number;
      pH: number;
      cx: number;
      cy: number;
    }
    let geom: Geom = {
      cardW: 0,
      cardH: 0,
      pX: 0,
      pY: 0,
      pW: 0,
      pH: 0,
      cx: 0,
      cy: 0,
    };
    const pulses: Pulse[] = [];
    let idleAt = 0;

    function layoutCompact() {
      const M = Math.max(12, W * 0.04);
      const pW = W - M * 2;
      const pX = M;
      const pH = Math.min(H * 0.52, 250);
      const pY = H - pH - M;
      const cx = W * 0.5;
      geom = { cardW: 0, cardH: 0, pX, pY, pW, pH, cx, cy: pY * 0.5 };

      const gutter = Math.max(34, W * 0.12);
      const colW = (pW - gutter) / 2;
      const cardW = Math.min(150, colW);
      const cardH = Math.min(52, cardW * 0.42);
      geom.cardW = cardW;
      geom.cardH = cardH;

      const zoneTop = M + 22;
      const zoneBot = pY - Math.max(16, H * 0.03);
      const rows = 3;
      const rowStep = (zoneBot - zoneTop - cardH) / (rows - 1);
      const leftCenter = pX + colW / 2;
      const rightCenter = pX + colW + gutter + colW / 2;
      spineX = cx;
      spineTop = zoneTop + cardH / 2;

      let leftN = 0;
      let rightN = 0;
      for (let i = 0; i < DOCS.length; i++) {
        const d = DOCS[i];
        const isLeft = d.side < 0;
        const idx = isLeft ? leftN++ : rightN++;
        const colCenter = isLeft ? leftCenter : rightCenter;
        const ry = zoneTop + cardH / 2 + idx * rowStep;
        d.targetX = colCenter;
        d.targetY = ry;
        d.scatterX = cardW / 2 + d.sx * (W - cardW);
        d.scatterY = cardH / 2 + d.sy * Math.max(1, zoneBot - cardH);
        const innerEdgeX = isLeft ? colCenter + cardW / 2 : colCenter - cardW / 2;
        d.port = { x: spineX, y: pY };
        d.conn = makeTrace([
          { x: innerEdgeX, y: ry },
          { x: spineX, y: ry },
          { x: spineX, y: pY },
        ]);
        d.glideStart = INTRO + i * GLIDE_STAGGER;
        d.fillStart = d.glideStart + GLIDE_DUR;
        d.pulseSpawned = false;
      }
    }

    function layout() {
      if (compact) {
        layoutCompact();
        return;
      }
      const cardW = Math.max(66, Math.min(126, W * 0.155));
      const cardH = cardW * 0.64;
      const pW = Math.max(140, Math.min(248, W * 0.3));
      const pH = Math.max(168, Math.min(258, H * 0.66));
      const cx = W * 0.5;
      const cy = H * 0.5;
      const pX = cx - pW / 2;
      const pY = cy - pH / 2;
      const gap = Math.max(8, Math.min(34, W * 0.03));
      let leftColX = pX - gap - cardW / 2;
      let rightColX = pX + pW + gap + cardW / 2;
      leftColX = Math.max(cardW / 2 + 2, leftColX);
      rightColX = Math.min(W - cardW / 2 - 2, rightColX);
      geom = { cardW, cardH, pX, pY, pW, pH, cx, cy };
      for (let i = 0; i < DOCS.length; i++) {
        const d = DOCS[i];
        const rowY = pY + pH * ((d.row + 0.5) / DOCS.length);
        d.targetX = d.side < 0 ? leftColX : rightColX;
        d.targetY = rowY;
        d.scatterX = cardW / 2 + d.sx * (W - cardW);
        d.scatterY = cardH / 2 + d.sy * (H - cardH);
        const innerEdgeX = d.targetX + (d.side < 0 ? cardW / 2 : -cardW / 2);
        const portX = d.side < 0 ? pX : pX + pW;
        d.port = { x: portX, y: rowY };
        d.conn = makeTrace([
          { x: innerEdgeX, y: rowY },
          { x: portX, y: rowY },
        ]);
        d.glideStart = INTRO + i * GLIDE_STAGGER;
        d.fillStart = d.glideStart + GLIDE_DUR;
        d.pulseSpawned = false;
      }
    }

    function chipCols() {
      return { bg: PAL.primaryFaint, fg: PAL.primary };
    }

    function drawBody(
      c: CanvasRenderingContext2D,
      kind: string,
      w: number,
      h: number
    ) {
      const top = 27;
      const left = 9;
      const right = w - 9;
      const bot = h - 8;
      c.strokeStyle = PAL.faint;
      c.fillStyle = PAL.faint;
      if (kind === "sheet") {
        const colsN = 3;
        const rowsN = 3;
        const gw = (right - left) / colsN;
        const gh = (bot - top) / rowsN;
        c.lineWidth = 0.7;
        c.strokeStyle = PAL.line;
        for (let r = 0; r <= rowsN; r++) {
          c.beginPath();
          c.moveTo(left, top + gh * r);
          c.lineTo(right, top + gh * r);
          c.stroke();
        }
        for (let cc = 0; cc <= colsN; cc++) {
          c.beginPath();
          c.moveTo(left + gw * cc, top);
          c.lineTo(left + gw * cc, bot);
          c.stroke();
        }
        c.fillStyle = PAL.primarySoft;
        c.fillRect(left + 0.6, top + 0.6, gw - 1.2, gh - 1.2);
        c.fillStyle = PAL.faint;
        c.fillRect(left + gw + 0.6, top + gh + 0.6, gw - 1.2, gh - 1.2);
      } else if (kind === "csv") {
        c.lineWidth = 1.4;
        c.strokeStyle = PAL.faint;
        for (let i = 0; i < 3; i++) {
          const yy = top + 6 + i * ((bot - top - 6) / 2.4);
          c.setLineDash([4, 3]);
          c.beginPath();
          c.moveTo(left, yy);
          c.lineTo(right - 8, yy);
          c.stroke();
        }
        c.setLineDash([]);
      } else if (kind === "pdf") {
        c.lineWidth = 1.4;
        c.strokeStyle = PAL.faint;
        line(c, left, top + 5, right - 14, top + 5);
        line(c, left, top + 13, right - 6, top + 13);
        line(c, left, top + 21, right - 24, top + 21);
        c.strokeStyle = PAL.secondarySoft;
        c.lineWidth = 2;
        line(c, left, bot - 3, left + 22, bot - 3);
      } else if (kind === "chat") {
        rr(c, left, top + 2, (right - left) * 0.74, 14, 6);
        c.fillStyle = PAL.primaryFaint;
        c.fill();
        c.strokeStyle = PAL.primarySoft;
        c.lineWidth = 1;
        c.stroke();
        rr(c, left + (right - left) * 0.26, Math.min(top + 20, h - 20), (right - left) * 0.72, 12, 6);
        c.fillStyle = PAL.line;
        c.fill();
      } else if (kind === "receipt") {
        c.strokeStyle = PAL.faint;
        c.lineWidth = 1;
        for (let j = 0; j < 3; j++) {
          const ry = top + 5 + j * 7;
          line(c, left, ry, right - 10, ry);
        }
        c.strokeStyle = PAL.secondarySoft;
        c.lineWidth = 1.6;
        line(c, left, bot - 4, left + 26, bot - 4);
      }
    }

    function drawDoc(
      c: CanvasRenderingContext2D,
      d: Doc,
      x: number,
      y: number,
      rot: number,
      alpha: number,
      wired: boolean
    ) {
      const w = geom.cardW;
      const h = geom.cardH;
      c.save();
      c.globalAlpha = alpha;
      c.translate(x, y);
      c.rotate((rot * Math.PI) / 180);
      c.translate(-w / 2, -h / 2);
      rr(c, 0, 0, w, h, 9);
      c.fillStyle = PAL.card;
      c.fill();
      c.lineWidth = 1.2;
      c.strokeStyle = wired ? PAL.primarySoft : PAL.line;
      c.stroke();
      const nameFont = compact ? 10.5 : 8.5;
      const tagFont = compact ? 9 : 7.5;
      const nameY = compact ? 17 : 15;
      const chipY = compact ? 7 : 6;
      const chipH = compact ? 14 : 12;
      const dividerY = compact ? 24 : 21;
      c.textBaseline = "alphabetic";
      c.textAlign = "left";
      c.fillStyle = PAL.dim;
      c.font = "600 " + nameFont + "px " + MONO;
      c.fillText(d.name, 9, nameY);
      c.font = "600 " + tagFont + "px " + MONO;
      const tagW = c.measureText(d.tag).width + 10;
      const cc = chipCols();
      rr(c, w - 9 - tagW, chipY, tagW, chipH, 3);
      c.fillStyle = cc.bg;
      c.fill();
      c.fillStyle = cc.fg;
      c.textAlign = "center";
      c.fillText(d.tag, w - 9 - tagW / 2, nameY);
      c.textAlign = "left";
      c.strokeStyle = PAL.line;
      c.lineWidth = 0.8;
      c.beginPath();
      c.moveTo(8, dividerY);
      c.lineTo(w - 8, dividerY);
      c.stroke();
      c.save();
      rr(c, 1, 1, w - 2, h - 2, 8);
      c.clip();
      drawBody(c, d.kind, w, h);
      c.restore();
      c.fillStyle = wired ? PAL.secondarySoft : PAL.faint;
      for (let pi = 0; pi < 3; pi++) {
        const px = w * 0.28 + pi * (w * 0.22);
        c.fillRect(px - 3, h - 2, 6, 3);
      }
      c.restore();
    }

    function drawMark(c: CanvasRenderingContext2D, x: number, y: number) {
      c.save();
      c.translate(x, y);
      c.strokeStyle = PAL.primary;
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
      c.strokeStyle = PAL.primary;
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
    }

    function drawSystem(c: CanvasRenderingContext2D, live: boolean) {
      const g = geom;
      c.save();
      rr(c, g.pX, g.pY, g.pW, g.pH, 14);
      c.fillStyle = PAL.panel;
      c.fill();
      c.lineWidth = 1.4;
      c.strokeStyle = live ? PAL.primaryDim : PAL.line;
      c.stroke();
      drawMark(c, g.pX + 13, g.pY + 13);
      const titleFont = compact ? 13.5 : 12;
      const cornerFont = compact ? 10 : 9;
      const labelFont = compact ? 12 : 11;
      const padX = compact ? 18 : 16;
      const labelColW = compact ? 74 : 66;
      const valueColW = compact ? 60 : 56;
      const barLW = compact ? 7 : 6;
      c.font = "600 " + titleFont + "px " + MONO;
      c.textBaseline = "alphabetic";
      c.textAlign = "left";
      c.fillStyle = PAL.ink;
      c.fillText("One system", g.pX + 32, g.pY + 22);
      c.textAlign = "right";
      c.fillStyle = PAL.muted;
      c.font = "600 " + cornerFont + "px " + MONO;
      c.fillText("SUMMARY", g.pX + g.pW - 14, g.pY + 22);
      c.textAlign = "left";
      c.strokeStyle = PAL.line;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(g.pX + 14, g.pY + 34);
      c.lineTo(g.pX + g.pW - 14, g.pY + 34);
      c.stroke();
      const rowTop = g.pY + 44;
      const rowGap = (g.pH - 44 - 12) / ROWS.length;
      for (let i = 0; i < ROWS.length; i++) {
        const ry = rowTop + rowGap * i + rowGap * 0.5;
        const latched = rowLatched[i] || reduced();
        c.globalAlpha = latched ? 1 : 0.3;
        c.font = "600 " + labelFont + "px " + MONO;
        c.fillStyle = PAL.dim;
        c.textAlign = "left";
        c.fillText(ROWS[i].k, g.pX + padX, ry + 4);
        const barX = g.pX + padX + labelColW;
        const barW = g.pW - padX * 2 - labelColW - valueColW;
        if (barW > 20) {
          c.strokeStyle = PAL.line;
          c.lineWidth = barLW;
          c.lineCap = "round";
          c.beginPath();
          c.moveTo(barX, ry + 1);
          c.lineTo(barX + barW, ry + 1);
          c.stroke();
          if (latched) {
            c.strokeStyle =
              ROWS[i].col === "secondary" ? PAL.secondarySoft : PAL.primarySoft;
            c.lineWidth = barLW;
            c.beginPath();
            c.moveTo(barX, ry + 1);
            c.lineTo(barX + barW * ROWS[i].frac, ry + 1);
            c.stroke();
          }
        }
        c.textAlign = "right";
        c.font = "600 " + labelFont + "px " + MONO;
        c.fillStyle = latched ? PAL.ink : PAL.faint;
        c.fillText(latched ? ROWS[i].v : "...", g.pX + g.pW - padX, ry + 4);
        c.textAlign = "left";
        c.globalAlpha = 1;
      }
      c.restore();
    }

    function drawPort(c: CanvasRenderingContext2D, d: Doc, wired: boolean) {
      c.beginPath();
      c.arc(d.port.x, d.port.y, 3, 0, Math.PI * 2);
      c.strokeStyle = wired ? PAL.secondarySoft : PAL.line;
      c.lineWidth = 1.3;
      c.stroke();
      if (wired) {
        c.fillStyle = PAL.secondary;
        c.beginPath();
        c.arc(d.port.x, d.port.y, 1.4, 0, Math.PI * 2);
        c.fill();
      }
    }

    function drawSpine(c: CanvasRenderingContext2D) {
      if (!compact) return;
      c.save();
      c.strokeStyle = PAL.line;
      c.lineWidth = 1.4;
      c.lineCap = "round";
      c.beginPath();
      c.moveTo(spineX, spineTop);
      c.lineTo(spineX, geom.pY);
      c.stroke();
      c.restore();
    }

    function pose(d: Doc): Pose {
      const drift = reduced() ? 0 : 1;
      if (T < d.glideStart) {
        const dxw = Math.sin(T * 0.5 + d.row) * 5 * drift;
        const dyw = Math.cos(T * 0.42 + d.row * 1.3) * 4 * drift;
        return { x: d.scatterX + dxw, y: d.scatterY + dyw, rot: d.rot, aligned: false };
      }
      const e = easeInOut((T - d.glideStart) / GLIDE_DUR);
      if (e >= 1) {
        return { x: d.targetX, y: d.targetY, rot: 0, aligned: true };
      }
      const ddx = Math.sin(T * 0.5 + d.row) * 5 * drift * (1 - e);
      const ddy = Math.cos(T * 0.42 + d.row * 1.3) * 4 * drift * (1 - e);
      return {
        x: d.scatterX + (d.targetX - d.scatterX) * e + ddx,
        y: d.scatterY + (d.targetY - d.scatterY) * e + ddy,
        rot: d.rot * (1 - e),
        aligned: false,
      };
    }

    function draw() {
      if (!ctx || W === 0 || H === 0) return;
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (reduced()) {
        for (let r = 0; r < rowLatched.length; r++) rowLatched[r] = true;
        drawSpine(ctx);
        ctx.strokeStyle = PAL.primaryDim;
        ctx.lineWidth = 1.5;
        for (let a = 0; a < DOCS.length; a++) {
          strokeTraceUpTo(ctx, DOCS[a].conn, DOCS[a].conn.len);
          drawPort(ctx, DOCS[a], true);
        }
        drawSystem(ctx, true);
        for (let cc = 0; cc < DOCS.length; cc++) {
          drawDoc(ctx, DOCS[cc], DOCS[cc].targetX, DOCS[cc].targetY, 0, 1, true);
        }
        if (caption) caption.textContent = "one system";
        return;
      }

      const poses: Pose[] = [];
      for (let i = 0; i < DOCS.length; i++) poses.push(pose(DOCS[i]));

      drawSpine(ctx);

      for (let i = 0; i < DOCS.length; i++) {
        const d = DOCS[i];
        if (poses[i].aligned && T >= d.fillStart) {
          const fp = clamp01((T - d.fillStart) / FILL_DUR);
          ctx.strokeStyle = fp >= 1 ? PAL.primaryDim : PAL.primaryFaint;
          ctx.lineWidth = 1.5;
          strokeTraceUpTo(ctx, d.conn, d.conn.len * fp);
          if (fp < 1) {
            drawFlow(ctx, d.conn, d.conn.len * fp, PAL.primarySoft, PAL.energyBright);
          } else {
            if (!rowLatched[d.row]) rowLatched[d.row] = true;
            if (!d.pulseSpawned) d.pulseSpawned = true;
          }
        }
      }

      for (let pi = pulses.length - 1; pi >= 0; pi--) {
        const pu = pulses[pi];
        const tr = DOCS[pu.di].conn;
        drawFlow(ctx, tr, pu.L, PAL.primarySoft, PAL.energyBright);
        if (pu.L >= tr.len) pulses.splice(pi, 1);
      }

      drawSystem(ctx, T > INTRO);
      for (let i = 0; i < DOCS.length; i++) {
        drawPort(ctx, DOCS[i], poses[i].aligned && T >= DOCS[i].fillStart + FILL_DUR);
      }
      for (let i = 0; i < DOCS.length; i++) {
        drawDoc(ctx, DOCS[i], poses[i].x, poses[i].y, poses[i].rot, 1, poses[i].aligned);
      }

      if (T > assembleDone) {
        idleAt -= 1 / 30;
        if (idleAt <= 0 && pulses.length < 1) {
          const di = Math.floor(Math.random() * DOCS.length);
          pulses.push({ di, L: 0, spd: DOCS[di].conn.len / 0.95 });
          idleAt = 2.6 + Math.random() * 1.8;
        }
      }
      if (caption) {
        let allIn = true;
        for (let k = 0; k < rowLatched.length; k++) if (!rowLatched[k]) allIn = false;
        caption.textContent = allIn ? "one system" : "connecting";
      }
    }

    function resize() {
      let rect = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      // Compact (portrait, two card columns feeding a panel) serves the whole
      // one-column range up to ~780 measured; above that the scattered desktop
      // cards are wide enough that name and tag chip never collide. The compact
      // canvas needs a tall box, set here from the measured width so it is a
      // single source of truth; desktop keeps the approved CSS height (no inline
      // override) so the wide layout is unchanged.
      compact = W < 780;
      if (compact) {
        canvas!.style.height =
          Math.round(Math.min(560, Math.max(430, W * 0.9))) + "px";
      } else {
        canvas!.style.height = "";
      }
      rect = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      ctx = fitCanvas(canvas!, W, H);
      layout();
      draw();
    }

    function frame(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 32) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      T += dt;
      for (let i = 0; i < pulses.length; i++) pulses[i].L += pulses[i].spd * dt;
      draw();
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
      draw();
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        draw();
      } else {
        start();
      }
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (en) => {
          onscreen = en[0].isIntersecting;
          if (onscreen && docVisible) start();
          else stop();
        },
        { threshold: 0.06 }
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
  }, []);

  return (
    <div className="stage-wrap">
      <div className="stage-frame">
        <span className="stage-tag mono">
          <span className="before">scattered</span>{" "}
          <span className="midword">wired into</span>{" "}
          <span className="after">one system</span>
        </span>
        <span className="stage-caption mono" ref={captionRef}>
          connecting
        </span>
        <canvas id="heroCanvas" ref={canvasRef} aria-hidden="true" />
        <noscript>
          <div className="stage-fallback">
            Scattered documents, spreadsheets, invoices, email, and messages
            settle into clean rows around one connected panel your team owns.
          </div>
        </noscript>
      </div>
    </div>
  );
}
