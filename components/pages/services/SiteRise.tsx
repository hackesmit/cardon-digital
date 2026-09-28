"use client";

import { useEffect, useRef } from "react";
import { clearsThreshold } from "@/lib/onscreen";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { sitios } from "@/lib/i18n/sitios";
import {
  MONO,
  clamp01,
  drawFlow,
  easeInOut,
  fitCanvas,
  makeTrace,
  readPalette,
  rgba,
  rr,
  strokeTraceUpTo,
  type Palette,
  type Trace,
} from "../home/canvasKit";
import "./site-rise.css";

/**
 * Websites service hero. The page's argument, drawn: a search finds the
 * business first, its site loads on a phone (and a laptop on desktop) block by
 * block, three checks pass, the visitor taps the one clay button and a message
 * arrives. House canvas pattern (HeroAssembly): rAF capped at 30 fps, DPR
 * capped at 2, paused offscreen and when hidden, palette re-read on
 * "cardon-mode", compact composition chosen from the measured width with the
 * height set here as the single source of truth, settled frame under reduced
 * motion.
 */

// Timeline, seconds into a 12 s loop.
const CYCLE = 12;
const TYPE_A = 1.0;
const TYPE_B = 2.6;
const RES_A = 2.4;
const RES_STAGGER = 0.14;
const RES_DUR = 0.45;
const LINE_A = 2.8;
const LINE_DUR = 0.7;
const LOAD_A = 3.4;
const BLOCK_STAGGER = 0.18;
const BLOCK_DUR = 0.7;
const LAPTOP_LAG = 0.35;
const CHECK_A = 5.6;
const CHECK_GAP = 0.5;
const TICK_DUR = 0.35;
const TAP_A = 7.4;
const TAP_DUR = 0.6;
const BUBBLE_A = 8.1;
const BUBBLE_DUR = 0.6;
const TAG_A = 8.8;
const HOLD_A = 9.6;
const FADE_A = 11.4;
const SETTLED = 10.4;

const LABEL = "500 11px " + MONO;
const BODY = "500 12px " + MONO;
const STRONG = "600 12px " + MONO;
const LINE_H = 16;
const SMALL_LINE_H = 14;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Screen {
  header: Box;
  hero: Box;
  headY: number;
  headLines: string[];
  muted: Box[];
  cta: Box;
  ctaLines: string[];
  nav: boolean;
}
interface Chip {
  x: number;
  y: number;
  w: number;
}
interface Geom {
  compact: boolean;
  field: Box;
  rows: Box[];
  phone: Box;
  phoneScreen: Box;
  phoneUI: Screen;
  laptop: Box | null;
  laptopUI: Screen | null;
  chips: Chip[];
  bubble: Box;
  bubbleLines: string[];
  tagX: number;
  tagY: number;
  conn: Trace[];
}

function wrap(
  c: CanvasRenderingContext2D,
  text: string,
  font: string,
  maxW: number
): string[] {
  c.font = font;
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? cur + " " + w : w;
    if (cur && c.measureText(next).width > maxW) {
      out.push(cur);
      cur = w;
    } else {
      cur = next;
    }
  }
  if (cur) out.push(cur);
  return out;
}

function widest(c: CanvasRenderingContext2D, lines: string[], font: string) {
  c.font = font;
  let m = 0;
  for (const l of lines) m = Math.max(m, c.measureText(l).width);
  return m;
}

export default function SiteRise() {
  const t = useDict(sitios).vis.rise;
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
    let captionShown = "";
    let G: Geom | null = null;

    /* ------------------------------ layout ------------------------------ */

    // Lays the site out inside a screen box. The phone stacks everything; the
    // laptop puts the copy in a left column beside the tinted hero, the way the
    // same site reads at desktop proportions.
    function screenUI(c: CanvasRenderingContext2D, s: Box, wide: boolean): Screen {
      const pad = wide ? 10 : 8;
      const headerH = wide ? 20 : 22;
      const header = { x: s.x, y: s.y, w: s.w, h: headerH };
      if (!wide) {
        const inner = s.w - pad * 2;
        const headLines = wrap(c, t.site.headline, STRONG, inner);
        const ctaLinesP = wrap(c, t.site.cta, LABEL, inner - 16);
        // The hero takes whatever height the copy leaves, so the screen is
        // full to its foot rather than ending in an empty band.
        const below = 18 + (headLines.length - 1) * LINE_H + 12 + 26 + ctaLinesP.length * SMALL_LINE_H + 14 + 12;
        const heroH = Math.max(50, Math.min(s.h * 0.45, s.h - headerH - 8 - below));
        const hero = { x: s.x + pad, y: s.y + headerH + 8, w: inner, h: Math.round(heroH) };
        const headY = hero.y + hero.h + 18;
        const mY = headY + (headLines.length - 1) * LINE_H + 12;
        const muted = [
          { x: s.x + pad, y: mY, w: inner * 0.92, h: 3 },
          { x: s.x + pad, y: mY + 9, w: inner * 0.66, h: 3 },
        ];
        const ctaLines = wrap(c, t.site.cta, LABEL, inner - 16);
        const ctaH = ctaLines.length * SMALL_LINE_H + 14;
        const cta = { x: s.x + pad, y: mY + 26, w: inner, h: ctaH };
        return { header, hero, headY, headLines, muted, cta, ctaLines, nav: false };
      }
      const colW = s.w * 0.54 - pad * 1.5;
      const top = s.y + headerH + 14;
      const heroX = s.x + s.w * 0.56;
      const hero = { x: heroX, y: s.y + headerH + 10, w: s.x + s.w - pad - heroX, h: s.h - headerH - 20 };
      const headLines = wrap(c, t.site.headline, STRONG, colW);
      const headY = top + 10;
      const mY = headY + (headLines.length - 1) * LINE_H + 12;
      const muted = [
        { x: s.x + pad, y: mY, w: colW * 0.94, h: 3 },
        { x: s.x + pad, y: mY + 9, w: colW * 0.7, h: 3 },
      ];
      const ctaLines = wrap(c, t.site.cta, LABEL, colW - 16);
      const ctaW = Math.min(colW, widest(c, ctaLines, LABEL) + 18);
      const ctaH = ctaLines.length * SMALL_LINE_H + 12;
      const cta = { x: s.x + pad, y: mY + 24, w: ctaW, h: ctaH };
      return { header, hero, headY, headLines, muted, cta, ctaLines, nav: true };
    }

    function measureChips(c: CanvasRenderingContext2D): number[] {
      c.font = LABEL;
      return t.checks.map((s) => 13 + 8 + c.measureText(s).width);
    }

    // Widest result text plus padding, so no row ever clips its label.
    function resultTextW(c: CanvasRenderingContext2D): number {
      let m = 0;
      for (const r of t.results) {
        c.font = STRONG;
        m = Math.max(m, c.measureText(r.name).width);
        c.font = LABEL;
        m = Math.max(m, c.measureText(r.sub).width);
      }
      return m + 28;
    }

    function layoutDesktop(c: CanvasRenderingContext2D): Geom {
      const M = 24;
      const CW = Math.min(W - M * 2, 1040);
      const ox = (W - CW) / 2;
      const chipW = measureChips(c);
      const colC = Math.max(150, ...chipW);
      const sW = Math.max(Math.min(290, Math.max(200, CW * 0.26)), resultTextW(c));
      const lW = Math.max(240, Math.min(300, CW - sW - colC - 56));
      const gap = (CW - sW - colC - lW) / 2;
      const y0 = 52;

      const sX = ox;
      const field = { x: sX, y: y0 + 34, w: sW, h: 34 };
      const rows: Box[] = [];
      for (let i = 0; i < 3; i++) rows.push({ x: sX, y: field.y + field.h + 14 + i * 50, w: sW, h: 44 });

      const colX = sX + sW + gap;
      const phone = { x: colX + (colC - 150) / 2, y: y0, w: 150, h: 290 };
      const phoneScreen = { x: phone.x + 7, y: phone.y + 20, w: phone.w - 14, h: phone.h - 38 };

      // A stacked list on one shared left edge, centred as a group under the phone.
      const stackW = Math.max(...chipW);
      const chipY = phone.y + phone.h + 20;
      const chips: Chip[] = chipW.map((w, i) => ({ x: colX + (colC - stackW) / 2, y: chipY + i * 22, w }));

      const lX = colX + colC + gap;
      const lH = Math.round(lW * 0.62);
      // Header bars of phone and laptop share one height, so the connector
      // between them runs straight.
      const laptop = { x: lX, y: y0 + 20 + 11 - 12, w: lW, h: lH };

      const bubbleMax = Math.min(260, lW);
      const bubbleLines = wrap(c, t.message, BODY, bubbleMax - 24);
      const bW = Math.min(bubbleMax, widest(c, bubbleLines, BODY) + 24);
      const bH = bubbleLines.length * LINE_H + 18;
      const bubble = { x: lX + lW - bW, y: laptop.y + lH + 40, w: bW, h: bH };

      const r0 = rows[0];
      const midA = (sX + sW + phone.x) / 2;
      const pY = phoneScreen.y + 11;
      const lY = laptop.y + 12;
      const midB = (phone.x + phone.w + lX) / 2;
      const conn = [
        makeTrace([
          { x: sX + sW, y: r0.y + r0.h / 2 },
          { x: midA, y: r0.y + r0.h / 2 },
          { x: midA, y: pY },
          { x: phone.x, y: pY },
        ]),
        makeTrace([
          { x: phone.x + phone.w, y: pY },
          { x: midB, y: pY },
          { x: midB, y: lY },
          { x: lX, y: lY },
        ]),
      ];

      return {
        compact: false,
        field,
        rows,
        phone,
        phoneScreen,
        phoneUI: screenUI(c, phoneScreen, false),
        laptop,
        laptopUI: screenUI(c, { x: laptop.x + 2, y: laptop.y + 2, w: laptop.w - 4, h: laptop.h - 4 }, true),
        chips,
        bubble,
        bubbleLines,
        tagX: bubble.x + bubble.w,
        tagY: bubble.y + bubble.h + 18,
        conn,
      };
    }

    function layoutCompact(c: CanvasRenderingContext2D): Geom {
      const M = 16;
      const y0 = 48;
      const field = { x: M, y: y0, w: W - M * 2, h: 40 };
      const rows: Box[] = [];
      for (let i = 0; i < 2; i++) {
        rows.push({ x: M + 12, y: field.y + field.h + 10 + i * 52, w: W - M * 2 - 12, h: 46 });
      }
      const pTop = rows[1].y + rows[1].h + 18;
      const phone = { x: Math.round((W - 170) / 2), y: pTop, w: 170, h: 320 };
      const phoneScreen = { x: phone.x + 8, y: phone.y + 22, w: phone.w - 16, h: phone.h - 42 };

      // Chips in a row under the phone, wrapping to a second row when the
      // measured labels need it; each row centred.
      const chipW = measureChips(c);
      const avail = W - M * 2;
      const chipGap = 16;
      const lines: number[][] = [[]];
      let lineW = 0;
      for (let i = 0; i < chipW.length; i++) {
        const add = (lines[lines.length - 1].length ? chipGap : 0) + chipW[i];
        if (lines[lines.length - 1].length && lineW + add > avail) {
          lines.push([i]);
          lineW = chipW[i];
        } else {
          lines[lines.length - 1].push(i);
          lineW += add;
        }
      }
      const chips: Chip[] = new Array(chipW.length);
      const chipTop = phone.y + phone.h + 20;
      lines.forEach((ln, li) => {
        const tw = ln.reduce((a, i) => a + chipW[i], 0) + chipGap * (ln.length - 1);
        let x = (W - tw) / 2;
        for (const i of ln) {
          chips[i] = { x, y: chipTop + li * 26, w: chipW[i] };
          x += chipW[i] + chipGap;
        }
      });
      const chipsBottom = chipTop + (lines.length - 1) * 26 + 14;

      const bW = W - M * 2;
      const bubbleLines = wrap(c, t.message, BODY, bW - 24);
      const bH = bubbleLines.length * LINE_H + 18;
      const bubble = { x: M, y: chipsBottom + 22, w: bW, h: bH };

      const r0 = rows[0];
      const rail = M + 3;
      const pY = phoneScreen.y + 11;
      const conn = [
        makeTrace([
          { x: r0.x, y: r0.y + r0.h / 2 },
          { x: rail, y: r0.y + r0.h / 2 },
          { x: rail, y: pY },
          { x: phone.x, y: pY },
        ]),
      ];

      return {
        compact: true,
        field,
        rows,
        phone,
        phoneScreen,
        phoneUI: screenUI(c, phoneScreen, false),
        laptop: null,
        laptopUI: null,
        chips,
        bubble,
        bubbleLines,
        tagX: bubble.x + bubble.w,
        tagY: bubble.y + bubble.h + 18,
        conn,
      };
    }

    /* ------------------------------ drawing ----------------------------- */

    const ph = (a: number, dur: number) => easeInOut((T - a) / dur);

    function drawField(c: CanvasRenderingContext2D, g: Geom, fo: number) {
      const f = g.field;
      rr(c, f.x, f.y, f.w, f.h, 2);
      c.fillStyle = PAL.panel;
      c.fill();
      c.lineWidth = 1.4;
      c.strokeStyle = rgba(PAL.textRgb, 0.28 + 0.2 * fo * ph(TYPE_A - 0.3, 0.4));
      c.stroke();
      // Magnifier from two strokes: the lens and its handle.
      const mx = f.x + 15;
      const my = f.y + f.h / 2 - 1;
      c.strokeStyle = PAL.muted;
      c.lineWidth = 1.5;
      c.beginPath();
      c.arc(mx, my, 5, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.moveTo(mx + 3.6, my + 3.6);
      c.lineTo(mx + 7.5, my + 7.5);
      c.stroke();

      const n = Math.floor(t.query.length * clamp01((T - TYPE_A) / (TYPE_B - TYPE_A - 0.2)));
      if (n <= 0 || fo <= 0) return;
      const txt = t.query.slice(0, n);
      c.font = BODY;
      const tx = f.x + 30;
      const avail = f.w - 30 - 10;
      const tw = c.measureText(txt).width;
      // Longer than the box: scroll so the newest letters stay in view.
      const shift = Math.max(0, tw - avail);
      c.save();
      c.beginPath();
      c.rect(tx - 1, f.y + 2, avail + 2, f.h - 4);
      c.clip();
      c.globalAlpha = fo;
      c.fillStyle = PAL.ink;
      c.textBaseline = "middle";
      c.textAlign = "left";
      c.fillText(txt, tx - shift, f.y + f.h / 2 + 1);
      // Caret while typing, then it eases away.
      const caretA = T < TYPE_B ? 1 : 1 - clamp01((T - TYPE_B) / 0.4);
      if (caretA > 0) {
        c.globalAlpha = fo * caretA;
        c.strokeStyle = PAL.primary;
        c.lineWidth = 1.2;
        const cx = tx - shift + tw + 2;
        c.beginPath();
        c.moveTo(cx, f.y + 10);
        c.lineTo(cx, f.y + f.h - 10);
        c.stroke();
      }
      c.restore();
      c.textBaseline = "alphabetic";
    }

    function drawRows(c: CanvasRenderingContext2D, g: Geom, fo: number) {
      for (let i = 0; i < g.rows.length; i++) {
        const e = ph(RES_A + i * RES_STAGGER, RES_DUR);
        if (e <= 0) continue;
        const r = g.rows[i];
        const res = t.results[i];
        const dx = -10 * (1 - e);
        c.save();
        c.globalAlpha = e * fo;
        rr(c, r.x + dx, r.y, r.w, r.h, 2);
        if (i === 0) {
          c.fillStyle = PAL.primaryFaint;
          c.fill();
          const breathe =
            T > HOLD_A && !reduced() ? 0.8 + 0.2 * Math.cos((T - HOLD_A) * 1.4) : 1;
          c.globalAlpha = e * fo * breathe;
          c.strokeStyle = PAL.primary;
          c.lineWidth = 1.2;
          c.stroke();
          c.globalAlpha = e * fo;
        } else {
          c.strokeStyle = PAL.lineSoft;
          c.lineWidth = 1;
          c.stroke();
        }
        c.textAlign = "left";
        c.font = STRONG;
        c.fillStyle = i === 0 ? PAL.ink : PAL.muted;
        c.fillText(res.name, r.x + dx + 12, r.y + 19);
        if (res.sub) {
          c.font = LABEL;
          c.fillStyle = PAL.muted;
          c.fillText(res.sub, r.x + dx + 12, r.y + 35);
        } else {
          c.fillStyle = PAL.lineSoft;
          c.fillRect(r.x + dx + 12, r.y + 30, Math.min(110, r.w * 0.45), 3);
        }
        c.restore();
      }
    }

    function deviceStroke(fo: number) {
      return rgba(PAL.textRgb, 0.24 + 0.46 * fo * ph(LINE_A, LINE_DUR + 0.4));
    }

    function drawPhoneFrame(c: CanvasRenderingContext2D, g: Geom, fo: number) {
      const p = g.phone;
      rr(c, p.x, p.y, p.w, p.h, 2);
      c.fillStyle = PAL.panel;
      c.fill();
      c.lineWidth = 2;
      c.strokeStyle = deviceStroke(fo);
      c.stroke();
      c.lineWidth = 1.4;
      c.beginPath();
      c.moveTo(p.x + p.w / 2 - 14, p.y + 10);
      c.lineTo(p.x + p.w / 2 + 14, p.y + 10);
      c.moveTo(p.x + p.w / 2 - 20, p.y + p.h - 9);
      c.lineTo(p.x + p.w / 2 + 20, p.y + p.h - 9);
      c.stroke();
    }

    function drawLaptopFrame(c: CanvasRenderingContext2D, g: Geom, fo: number) {
      const l = g.laptop;
      if (!l) return;
      rr(c, l.x, l.y, l.w, l.h, 2);
      c.fillStyle = PAL.panel;
      c.fill();
      c.lineWidth = 2;
      c.strokeStyle = deviceStroke(fo);
      c.stroke();
      // Thin base line with a shallow notch where the lid hinges.
      c.lineWidth = 1.4;
      const by = l.y + l.h + 7;
      c.beginPath();
      c.moveTo(l.x - 12, by);
      c.lineTo(l.x + l.w + 12, by);
      c.moveTo(l.x + l.w / 2 - 18, by - 3);
      c.lineTo(l.x + l.w / 2 + 18, by - 3);
      c.stroke();
    }

    function drawScreen(
      c: CanvasRenderingContext2D,
      u: Screen,
      start: number,
      clay: boolean,
      fo: number,
      press: number
    ) {
      c.textAlign = "left";
      const blk = (i: number) => ph(start + i * BLOCK_STAGGER, BLOCK_DUR);
      const pad = u.nav ? 10 : 8;

      let e = blk(0);
      if (e > 0) {
        const dy = 8 * (1 - e);
        c.globalAlpha = e * fo;
        c.fillStyle = PAL.card;
        c.fillRect(u.header.x, u.header.y + dy, u.header.w, u.header.h);
        c.font = LABEL;
        c.fillStyle = PAL.ink;
        c.fillText(t.site.name, u.header.x + pad, u.header.y + dy + u.header.h / 2 + 4);
        if (u.nav) {
          c.fillStyle = PAL.faint;
          for (let k = 0; k < 3; k++) {
            c.fillRect(u.header.x + u.header.w - pad - 18 - k * 26, u.header.y + dy + u.header.h / 2 - 1, 18, 2);
          }
        }
      }
      e = blk(1);
      if (e > 0) {
        const dy = 8 * (1 - e);
        c.globalAlpha = e * fo;
        rr(c, u.hero.x, u.hero.y + dy, u.hero.w, u.hero.h, 2);
        c.fillStyle = PAL.primaryFaint;
        c.fill();
        // A soft horizon inside the tint so it reads as an image, not a void.
        c.strokeStyle = rgba(PAL.primaryRgb, 0.28);
        c.lineWidth = 1.2;
        c.beginPath();
        c.moveTo(u.hero.x + 6, u.hero.y + dy + u.hero.h * 0.72);
        c.quadraticCurveTo(
          u.hero.x + u.hero.w * 0.4,
          u.hero.y + dy + u.hero.h * 0.5,
          u.hero.x + u.hero.w - 6,
          u.hero.y + dy + u.hero.h * 0.66
        );
        c.stroke();
      }
      e = blk(2);
      if (e > 0) {
        const dy = 8 * (1 - e);
        c.globalAlpha = e * fo;
        c.font = STRONG;
        c.fillStyle = PAL.ink;
        u.headLines.forEach((ln, i) => c.fillText(ln, u.header.x + pad, u.headY + dy + i * LINE_H));
      }
      e = blk(3);
      if (e > 0) {
        const dy = 8 * (1 - e);
        c.globalAlpha = e * fo;
        c.fillStyle = PAL.faint;
        for (const m of u.muted) c.fillRect(m.x, m.y + dy, m.w, m.h);
      }
      e = blk(4);
      if (e > 0) {
        const dy = 8 * (1 - e);
        const b = u.cta;
        c.globalAlpha = e * fo;
        rr(c, b.x, b.y + dy, b.w, b.h, 2);
        if (clay) {
          c.fillStyle = press > 0 ? PAL.energyBright : PAL.energy;
          c.fill();
          c.fillStyle = PAL.panel;
        } else {
          c.strokeStyle = PAL.primary;
          c.lineWidth = 1.3;
          c.stroke();
          c.fillStyle = PAL.primary;
        }
        c.font = LABEL;
        c.textAlign = "center";
        const top = b.y + dy + (b.h - u.ctaLines.length * SMALL_LINE_H) / 2 + 10.5;
        u.ctaLines.forEach((ln, i) => c.fillText(ln, b.x + b.w / 2, top + i * SMALL_LINE_H));
        c.textAlign = "left";
      }
      c.globalAlpha = 1;
    }

    function drawTick(c: CanvasRenderingContext2D, x: number, y: number, s: number, p: number) {
      // Two strokes: the short leg, then the long one.
      const a = { x: x + s * 0.18, y: y + s * 0.52 };
      const b = { x: x + s * 0.42, y: y + s * 0.76 };
      const d = { x: x + s * 0.84, y: y + s * 0.24 };
      const p1 = clamp01(p / 0.4);
      const p2 = clamp01((p - 0.4) / 0.6);
      c.beginPath();
      c.moveTo(a.x, a.y);
      c.lineTo(a.x + (b.x - a.x) * p1, a.y + (b.y - a.y) * p1);
      if (p2 > 0) c.lineTo(b.x + (d.x - b.x) * p2, b.y + (d.y - b.y) * p2);
      c.stroke();
    }

    function drawChips(c: CanvasRenderingContext2D, g: Geom, fo: number) {
      c.font = LABEL;
      c.textAlign = "left";
      for (let i = 0; i < g.chips.length; i++) {
        const ch = g.chips[i];
        const p = fo > 0 ? ph(CHECK_A + i * CHECK_GAP, TICK_DUR) : 0;
        const on = p > 0 ? fo : 0;
        rr(c, ch.x, ch.y, 13, 13, 2);
        c.fillStyle = PAL.panel;
        c.fill();
        c.lineWidth = 1.2;
        c.strokeStyle = on > 0 ? rgba(PAL.primaryRgb, 0.35 + 0.65 * on) : PAL.line;
        c.stroke();
        c.fillStyle = PAL.dim;
        c.fillText(t.checks[i], ch.x + 21, ch.y + 10.5);
        if (p > 0) {
          c.globalAlpha = fo;
          c.strokeStyle = PAL.primary;
          c.lineWidth = 1.8;
          drawTick(c, ch.x, ch.y, 13, p);
          c.globalAlpha = 1;
        }
      }
    }

    function drawTap(c: CanvasRenderingContext2D, g: Geom) {
      const k = (T - TAP_A) / TAP_DUR;
      if (k <= 0 || k >= 1.5) return;
      const b = g.phoneUI.cta;
      const e = easeInOut(clamp01(k));
      const r = 22 - 14 * e;
      const a = k < 1 ? Math.min(1, k * 4) : 1 - easeInOut((k - 1) / 0.5);
      c.globalAlpha = a * 0.9;
      c.strokeStyle = PAL.ink;
      c.lineWidth = 1.5;
      c.beginPath();
      c.arc(b.x + b.w * 0.62, b.y + b.h / 2, r, 0, Math.PI * 2);
      c.stroke();
      c.globalAlpha = 1;
    }

    function drawBubble(c: CanvasRenderingContext2D, g: Geom, fo: number) {
      const e = ph(BUBBLE_A, BUBBLE_DUR);
      if (e <= 0 || fo <= 0) return;
      const b = g.bubble;
      const dx = 18 * (1 - e);
      const dy = 18 * (1 - e);
      c.globalAlpha = e * fo;
      rr(c, b.x + dx, b.y + dy, b.w, b.h, 2);
      c.fillStyle = PAL.panel;
      c.fill();
      c.strokeStyle = PAL.line;
      c.lineWidth = 1;
      c.stroke();
      // A short agave rule on the left edge marks it as incoming.
      c.fillStyle = PAL.primary;
      c.fillRect(b.x + dx, b.y + dy + 6, 2, b.h - 12);
      c.font = BODY;
      c.fillStyle = PAL.ink;
      c.textAlign = "left";
      g.bubbleLines.forEach((ln, i) => c.fillText(ln, b.x + dx + 12, b.y + dy + 21 + i * LINE_H));

      const te = ph(TAG_A, 0.4);
      if (te > 0) {
        c.globalAlpha = te * fo;
        c.font = LABEL;
        c.textAlign = "right";
        c.fillStyle = PAL.muted;
        const tw = c.measureText(t.received).width;
        c.fillText(t.received, g.tagX, g.tagY);
        c.strokeStyle = PAL.primary;
        c.lineWidth = 1.6;
        drawTick(c, g.tagX - tw - 16, g.tagY - 10, 12, ph(TAG_A + 0.1, 0.35));
        c.textAlign = "left";
      }
      c.globalAlpha = 1;
    }

    function draw() {
      if (!ctx || !G || W === 0 || H === 0) return;
      const c = ctx;
      const g = G;
      if (reduced()) T = SETTLED;
      c.clearRect(0, 0, W, H);
      c.lineCap = "round";
      c.lineJoin = "round";
      const fo = T < FADE_A ? 1 : 1 - easeInOut((T - FADE_A) / (CYCLE - FADE_A));

      drawField(c, g, fo);
      drawRows(c, g, fo);

      // Connector from the first result into the phone, then on to the laptop.
      const lp = ph(LINE_A, LINE_DUR);
      if (lp > 0 && fo > 0) {
        const total = g.conn.reduce((a, tr) => a + tr.len, 0);
        let L = total * lp;
        c.globalAlpha = fo;
        c.lineWidth = 1.2;
        for (const tr of g.conn) {
          const seg = Math.min(L, tr.len);
          c.strokeStyle = PAL.primaryDim;
          strokeTraceUpTo(c, tr, seg);
          if (lp < 1 && seg > 0 && seg < tr.len) drawFlow(c, tr, seg, PAL.primarySoft, PAL.primaryBright);
          L -= seg;
          if (L <= 0) break;
        }
        c.globalAlpha = 1;
      }

      drawPhoneFrame(c, g, fo);
      drawLaptopFrame(c, g, fo);
      if (fo > 0) {
        const press = T > TAP_A + TAP_DUR * 0.7 && T < TAP_A + TAP_DUR + 0.25 ? 1 : 0;
        drawScreen(c, g.phoneUI, LOAD_A, true, fo, press);
        if (g.laptopUI) drawScreen(c, g.laptopUI, LOAD_A + LAPTOP_LAG, false, fo, 0);
      }
      drawChips(c, g, fo);
      if (fo > 0 && !reduced()) drawTap(c, g);
      drawBubble(c, g, fo);

      if (caption) {
        const want = T >= TAG_A && T < FADE_A + 0.3 ? t.captionDone : t.captionRun;
        if (want !== captionShown) {
          caption.textContent = want;
          captionShown = want;
        }
      }
    }

    function resize() {
      let rect = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      const compact = W < 780;
      const m = ctx!;
      // Lay out once at a provisional height to learn what the content needs,
      // then set the canvas height from that: the single source of truth.
      H = 1;
      const probe = compact ? layoutCompact(m) : layoutDesktop(m);
      const need = Math.max(probe.tagY, probe.chips.reduce((a, ch) => Math.max(a, ch.y + 14), 0)) + 38;
      const h = compact ? Math.min(780, Math.max(640, need)) : Math.max(460, Math.min(560, need));
      canvas!.style.height = Math.round(h) + "px";
      rect = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      ctx = fitCanvas(canvas!, W, H);
      G = compact ? layoutCompact(ctx) : layoutDesktop(ctx);
      // Centre the composition vertically in any spare height.
      const spare = Math.max(0, H - need);
      if (spare > 1) shiftGeom(G, spare / 2);
      draw();
    }

    function shiftGeom(g: Geom, d: number) {
      const mv = (b: Box) => (b.y += d);
      mv(g.field);
      g.rows.forEach(mv);
      mv(g.phone);
      mv(g.phoneScreen);
      const mvUI = (u: Screen) => {
        mv(u.header);
        mv(u.hero);
        u.headY += d;
        u.muted.forEach(mv);
        mv(u.cta);
      };
      mvUI(g.phoneUI);
      if (g.laptop) mv(g.laptop);
      if (g.laptopUI) mvUI(g.laptopUI);
      g.chips.forEach((ch) => (ch.y += d));
      mv(g.bubble);
      g.tagY += d;
      g.conn = g.conn.map((tr) => makeTrace(tr.pts.map((p) => ({ x: p.x, y: p.y + d }))));
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
        T = 0;
        start();
      }
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (en) => {
          onscreen = clearsThreshold(en[en.length - 1], 0.06);
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
  }, [t]);

  return (
    <div className="stage-wrap">
      <div className="stage-frame rise-stage" role="img" aria-label={t.aria}>
        <span className="stage-tag mono">
          <span className="before">{t.tagBefore}</span>{" "}
          <span className="midword">{t.tagMid}</span>
        </span>
        <span className="stage-caption mono" ref={captionRef}>
          {t.captionRun}
        </span>
        <canvas id="riseCanvas" className="rise-canvas" ref={canvasRef} aria-hidden="true" />
        <noscript>
          <div className="stage-fallback">{t.fallback}</div>
        </noscript>
      </div>
    </div>
  );
}
