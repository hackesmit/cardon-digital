"use client";

import { useEffect, useRef } from "react";
import { clearsThreshold } from "@/lib/onscreen";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { home } from "@/lib/i18n/home";
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
import "./digital-arc.css";

/**
 * Home hero: a business goes digital in three acts on one canvas. Act 1, a
 * search types the query and the site assembles on a phone as the first
 * result. Act 2, people-dots arrive in the field and the matched ones travel
 * to the phone's one clay button while a messages counter climbs. Act 3, each
 * message sends a pulse down the track into a ledger whose rows latch. Hold,
 * soft fade, loop.
 *
 * The scene is a pure function of loop time t, so the loop, the reduced-motion
 * settled frame and the reset crossfade all draw from the same code and
 * nothing can drift between repeats. House pattern as HeroAssembly: rAF capped
 * at 30 fps, DPR capped at 2, paused offscreen and when hidden, palette
 * re-read on "cardon-mode", compact composition from the measured width with
 * the height set from JS.
 */

// Timeline, in seconds of loop time.
const LOOP = 15.1;
const Q_START = 1.2;
const Q_END = 2.6;
const SITE_START = 2.4;
const SITE_STAGGER = 0.25;
const SITE_DUR = 0.5;
const CARD_AT = 3.4;
const DOTS_IN = 4.0;
const DEPART0 = 4.8;
const DEPART_STEP = 0.6;
const TRAVEL = 1.1;
const UNMATCHED_OUT = 6.2;
const PULSE0 = 9.0;
const PULSE_STEP = 0.7;
const PULSE_DUR = 1.0;
const BAR_DUR = 0.6;
const HOLD_AT = 13.0;
const IDLE_PULSE = 13.1;
const FADE_AT = 14.5;
const FADE_DUR = 0.6;
const SETTLED_T = 13.0;

const arrival = (i: number) => DEPART0 + DEPART_STEP * i + TRAVEL;
const latchAt = (r: number) => PULSE0 + PULSE_STEP * r + PULSE_DUR;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
interface Label {
  x: number;
  y: number;
  center: boolean;
  lines: string[];
  kOwnLine: boolean;
  maxW: number;
}
interface Dot {
  base: Pt;
  matched: boolean;
  idx: number;
  ctrl: Pt;
}
interface Geom {
  compact: boolean;
  phone: Box;
  chip: Box;
  card: Box;
  counter: Box;
  cta: Box;
  ledger: Box;
  rowTop: number;
  rowH: number;
  labels: Label[];
  dots: Dot[];
  routes: Trace[];
  track: Trace;
  port: Pt;
  chipFont: number;
}

export default function DigitalArc() {
  const t = useDict(home).vis.arc;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLSpanElement | null>(null);
  const tagRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;
    const caption = captionRef.current;
    const tag = tagRef.current;

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
    let captionText = "";
    let G: Geom | null = null;

    const F = (size: number, weight = 600) => weight + " " + size + "px " + MONO;
    const measure = (c: CanvasRenderingContext2D, s: string, font: string) => {
      c.font = font;
      return c.measureText(s).width;
    };
    // Greedy word wrap measured with the real font, because the Spanish
    // strings run longer than the English ones.
    const wrap = (
      c: CanvasRenderingContext2D,
      s: string,
      maxW: number,
      font: string
    ): string[] => {
      c.font = font;
      const words = s.split(" ");
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
    };

    // Dot seeds: (u, v) inside the field. In compact, side: -1/1 places the
    // dot beside the phone at fraction f of its height instead.
    const DESK_DOTS: Array<{ u: number; v: number; m: boolean }> = [
      { u: 0.15, v: 0.16, m: true },
      { u: 0.58, v: 0.08, m: true },
      { u: 0.36, v: 0.84, m: true },
      { u: 0.86, v: 0.3, m: true },
      { u: 0.24, v: 0.66, m: true },
      { u: 0.7, v: 0.92, m: true },
      { u: 0.46, v: 0.3, m: false },
      { u: 0.94, v: 0.76, m: false },
      { u: 0.04, v: 0.95, m: false },
      { u: 0.6, v: 0.66, m: false },
    ];
    const COMPACT_DOTS: Array<{ u: number; v: number; m: boolean; side?: number }> = [
      { u: 0, v: 0.62, m: true, side: -1 },
      { u: 0.72, v: 0.16, m: true },
      { u: 0.3, v: 0.1, m: true },
      { u: 0.9, v: 0.58, m: true },
      { u: 0, v: 0.42, m: true, side: 1 },
      { u: 0.64, v: 0.88, m: true },
      { u: 0.1, v: 0.04, m: false },
      { u: 0.86, v: 0.92, m: false },
      { u: 0.58, v: 0.44, m: false },
      { u: 0, v: 0.2, m: false, side: 1 },
    ];

    function control(a: Pt, b: Pt, sign: number): Pt {
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 1;
      const k = 0.22 * d * sign;
      return { x: mx - (dy / d) * k, y: my + (dx / d) * k };
    }

    function stageLines(
      c: CanvasRenderingContext2D,
      i: number,
      maxW: number
    ): { lines: string[]; kOwnLine: boolean } {
      const st = t.stages[i];
      const f = F(12);
      const one = st.k + " " + st.label;
      if (measure(c, one, f) <= maxW) return { lines: [st.label], kOwnLine: false };
      return { lines: wrap(c, st.label, maxW, f), kOwnLine: true };
    }

    function layout(c: CanvasRenderingContext2D, compact: boolean, topPad: number, botPad: number) {
      const ctaH = compact ? 32 : 28;
      const chipFont = compact ? 13 : 12;
      const chipH = compact ? 34 : 30;
      const queryW = measure(c, t.query, F(chipFont, 500));
      const chipW = Math.max(compact ? 170 : 150, queryW + 44);
      const nameW = measure(c, t.siteName, F(12));
      const tagW = measure(c, t.resultTag, F(11));
      const cardW = Math.max(chipW, Math.max(nameW, tagW) + 28);
      const cardH = 40;
      const kW = measure(c, t.messagesK, F(11));
      const numW = measure(c, "6", F(13));
      const counterW = compact ? Math.max(kW, numW) + 18 : kW + 10 + numW + 20;
      const counterH = compact ? 40 : 26;

      // Ledger width from its longest row, measured.
      let maxK = 0;
      let maxV = 0;
      for (const row of t.rows) {
        maxK = Math.max(maxK, measure(c, row.k, F(11)));
        maxV = Math.max(maxV, measure(c, row.v, F(12)));
      }
      const titleW = measure(c, t.ledgerTitle, F(13));
      const minLedgerW = Math.max(14 + maxK + 24 + maxV + 14, titleW + 28);

      const dots: Dot[] = [];
      let phone: Box;
      let chip: Box;
      let card: Box;
      let counter: Box;
      let ledger: Box;
      let rowTop: number;
      let rowH: number;
      const labels: Label[] = [];
      const routes: Trace[] = [];
      let track: Trace;
      let port: Pt;

      if (!compact) {
        const M = Math.max(20, W * 0.03);
        const phoneW = 128;
        let labelY = topPad + 12;
        const pcx = Math.max(M + counterW + 12 + phoneW / 2, M + cardW / 2, W * 0.16);
        let chipY = labelY + 16;
        let cardY = chipY + chipH + 6;
        let phoneY = cardY + cardH + 14;
        const phoneH = Math.max(160, Math.min(220, H - botPad - phoneY));
        const extra = H - botPad - phoneY - phoneH;
        if (extra > 0) {
          chipY += extra * 0.5;
          cardY += extra * 0.5;
          phoneY += extra * 0.5;
          // labels travel with the stations so they read as their headings
          labelY += extra * 0.5;
        }
        phone = { x: pcx - phoneW / 2, y: phoneY, w: phoneW, h: phoneH };
        chip = { x: pcx - chipW / 2, y: chipY, w: chipW, h: chipH };
        card = { x: pcx - cardW / 2, y: cardY, w: cardW, h: cardH };
        const ctaY = phone.y + phone.h - 12 - ctaH;
        counter = {
          x: phone.x - 12 - counterW,
          y: ctaY + ctaH / 2 - counterH / 2,
          w: counterW,
          h: counterH,
        };
        const trackY = phone.y + phone.h / 2;
        const lw = Math.max(220, minLedgerW);
        rowH = 34;
        const lh = 38 + rowH * 4 + 6;
        const lx = W - Math.max(M, W * 0.06) - lw;
        const ly = Math.max(labelY + 16, Math.min(H - botPad - lh, trackY - lh / 2));
        ledger = { x: lx, y: ly, w: lw, h: lh };
        rowTop = ly + 38;
        const spurX = lx - 22;
        const pR = phone.x + phone.w;
        for (let r = 0; r < 4; r++) {
          const my = rowTop + rowH * r + 12;
          routes.push(
            makeTrace([
              { x: pR, y: trackY },
              { x: spurX, y: trackY },
              { x: spurX, y: my },
              { x: lx, y: my },
            ])
          );
        }
        track = makeTrace([
          { x: pR, y: trackY },
          { x: spurX, y: trackY },
        ]);
        port = { x: pR, y: trackY };
        const fx0 = pR + 36;
        const fx1 = spurX - 30;
        const fcx = (pR + lx) / 2;
        const stationX = [pcx, fcx, lx + lw / 2];
        const widths = [
          Math.max(cardW, 160),
          Math.max(120, fx1 - fx0),
          lw,
        ];
        for (let i = 0; i < 3; i++) {
          const s = stageLines(c, i, widths[i]);
          labels.push({
            x: stationX[i],
            y: labelY,
            center: true,
            lines: s.lines,
            kOwnLine: s.kOwnLine,
            maxW: widths[i],
          });
        }
        const fy0 = labelY + 30;
        const fy1 = H - botPad - 8;
        const cta = { x: phone.x + 8, y: ctaY, w: phone.w - 16, h: ctaH };
        const target = { x: cta.x + cta.w / 2, y: cta.y + cta.h / 2 };
        let mi = 0;
        let ui = 0;
        for (const s of DESK_DOTS) {
          const base = { x: fx0 + s.u * (fx1 - fx0), y: fy0 + s.v * (fy1 - fy0) };
          const idx = s.m ? mi++ : ui++;
          dots.push({
            base,
            matched: s.m,
            idx,
            ctrl: control(base, target, idx % 2 ? 1 : -1),
          });
        }
        return {
          compact,
          phone,
          chip,
          card,
          counter,
          cta,
          ledger,
          rowTop,
          rowH,
          labels,
          dots,
          routes,
          track,
          port,
          chipFont,
        } as Geom;
      }

      // Compact: one column, track down the centre.
      const M = 16;
      const cx = W / 2;
      const phoneW = Math.max(120, Math.min(140, W - 2 * (M + 10 + counterW)));
      // Stage 1 sits left of the phone when its longest word fits there; on
      // the narrowest phones it becomes a heading row above the search chip.
      const side1 = (W - phoneW) / 2 - 10 - M;
      let longest1 = 0;
      for (const w of t.stages[0].label.split(" "))
        longest1 = Math.max(longest1, measure(c, w, F(12)));
      const label1Top = longest1 > side1;
      const chipTop = label1Top ? topPad + 22 : topPad;
      chip = { x: cx - chipW / 2, y: chipTop, w: chipW, h: chipH };
      card = { x: cx - cardW / 2, y: chip.y + chipH + 6, w: cardW, h: cardH };
      const phoneY = card.y + cardH + 16;
      rowH = 32;
      const lh = 38 + rowH * 4 + 6;
      const ly = H - botPad - lh;
      const halfW = cx - 14 - M;
      const s3 = stageLines(c, 2, halfW);
      const l3H = (s3.lines.length + (s3.kOwnLine ? 1 : 0)) * 15;
      const phoneH = Math.max(
        200,
        Math.min(250, ly - 12 - l3H - 110 - phoneY)
      );
      phone = { x: cx - phoneW / 2, y: phoneY, w: phoneW, h: phoneH };
      const ctaY = phone.y + phone.h - 12 - ctaH;
      // The counter sits beside the button; where it cannot fit, it tucks
      // under the phone's right corner instead of running off the canvas.
      const besideFits = phone.x + phone.w + 10 + counterW <= W - M;
      counter = besideFits
        ? { x: phone.x + phone.w + 10, y: ctaY + ctaH - counterH, w: counterW, h: counterH }
        : { x: W - M - counterW, y: phone.y + phone.h + 10, w: counterW, h: counterH };
      ledger = { x: M, y: ly, w: W - 2 * M, h: lh };
      rowTop = ly + 38;
      const pB = phone.y + phone.h;
      track = makeTrace([
        { x: cx, y: pB },
        { x: cx, y: ly },
      ]);
      for (let r = 0; r < 4; r++) routes.push(track);
      port = { x: cx, y: pB };

      const s1 = label1Top
        ? stageLines(c, 0, W - 2 * M)
        : stageLines(c, 0, phone.x - 10 - M);
      labels.push({
        x: M,
        y: label1Top ? topPad + 10 : phone.y + 12,
        center: false,
        lines: s1.lines,
        kOwnLine: s1.kOwnLine,
        maxW: label1Top ? W - 2 * M : phone.x - 10 - M,
      });
      const bandTop = pB + 16;
      const bandBot = ly - 14 - l3H;
      const s2 = stageLines(c, 1, halfW);
      const l2H = (s2.lines.length + (s2.kOwnLine ? 1 : 0)) * 15;
      labels.push({
        x: M,
        // centred in the band, but never down into stage 3's heading
        y: Math.min(
          (bandTop + bandBot) / 2 - l2H / 2 + 10,
          ly - 10 - l3H + 15 - 15 - l2H - 4
        ),
        center: false,
        lines: s2.lines,
        kOwnLine: s2.kOwnLine,
        maxW: halfW,
      });
      labels.push({
        x: M,
        y: ly - 10 - l3H + 15,
        center: false,
        lines: s3.lines,
        kOwnLine: s3.kOwnLine,
        maxW: halfW,
      });
      const cta = { x: phone.x + 8, y: ctaY, w: phone.w - 16, h: ctaH };
      const target = { x: cta.x + cta.w / 2, y: cta.y + cta.h / 2 };
      let mi = 0;
      let ui = 0;
      for (const s of COMPACT_DOTS) {
        let base: Pt;
        if (s.side) {
          const sx =
            s.side < 0
              ? (M + phone.x) / 2
              : (phone.x + phone.w + W - M) / 2;
          base = { x: sx, y: phone.y + s.v * phone.h };
        } else {
          base = {
            x: M + 8 + s.u * (W - 2 * M - 16),
            y: bandTop + s.v * Math.max(20, bandBot - bandTop),
          };
        }
        const idx = s.m ? mi++ : ui++;
        dots.push({
          base,
          matched: s.m,
          idx,
          ctrl: control(base, target, base.x < cx ? 1 : -1),
        });
      }
      return {
        compact,
        phone,
        chip,
        card,
        counter,
        cta,
        ledger,
        rowTop,
        rowH,
        labels,
        dots,
        routes,
        track,
        port,
        chipFont,
      } as Geom;
    }

    const prog = (tt: number, a: number, d: number) => clamp01((tt - a) / d);
    const ease = (tt: number, a: number, d: number) => easeInOut(prog(tt, a, d));

    function drawMagnifier(c: CanvasRenderingContext2D, x: number, y: number, col: string) {
      c.strokeStyle = col;
      c.lineWidth = 1.4;
      c.beginPath();
      c.arc(x, y, 4.5, 0, Math.PI * 2);
      c.stroke();
      line(c, x + 3.3, y + 3.3, x + 7.2, y + 7.2);
    }

    function drawLabels(c: CanvasRenderingContext2D, g: Geom, tt: number, sA: number, settled: boolean) {
      const on = [CARD_AT, arrival(0), latchAt(0)];
      c.textBaseline = "alphabetic";
      for (let i = 0; i < 3; i++) {
        const L = g.labels[i];
        const ink = settled ? 1 : ease(tt, on[i], 0.4) * sA;
        const k = t.stages[i].k;
        const f = F(12);
        c.font = f;
        const kW = c.measureText(k + " ").width;
        let y = L.y;
        const drawLine = (s: string, withK: boolean) => {
          const sW = c.measureText(s).width + (withK ? kW : 0);
          let x = L.center ? L.x - sW / 2 : L.x;
          c.textAlign = "left";
          if (withK) {
            c.fillStyle = PAL.secondary;
            c.fillText(k, x, y);
            x += kW;
          }
          c.fillStyle = PAL.muted;
          c.fillText(s, x, y);
          if (ink > 0) {
            c.globalAlpha = ink;
            c.fillStyle = PAL.ink;
            c.fillText(s, x, y);
            c.globalAlpha = 1;
          }
        };
        if (L.kOwnLine) {
          c.textAlign = L.center ? "center" : "left";
          c.fillStyle = PAL.secondary;
          c.fillText(k, L.x, y);
          y += 15;
          for (const s of L.lines) {
            drawLine(s, false);
            y += 15;
          }
        } else {
          drawLine(L.lines[0], true);
        }
      }
    }

    function drawScene(tt: number, settled: boolean) {
      const c = ctx;
      const g = G;
      if (!c || !g) return;
      c.clearRect(0, 0, W, H);
      c.lineCap = "round";
      c.lineJoin = "round";
      // Story alpha: everything the story adds fades together into the quiet
      // frame at the end of the loop, so the reset is never a hard cut.
      const sA = settled ? 1 : 1 - ease(tt, FADE_AT, FADE_DUR);
      const ph = g.phone;
      const pcx = ph.x + ph.w / 2;
      const pcy = ph.y + ph.h / 2;

      // Sonar: one ring at the start of act 2, a slow breath in the hold.
      if (!settled) {
        const sp = prog(tt, DOTS_IN + 0.1, 1.6);
        if (sp > 0 && sp < 1) {
          const e = easeInOut(sp);
          c.strokeStyle = PAL.primary;
          c.globalAlpha = 0.32 * (1 - e) * sA;
          c.lineWidth = 1.2;
          c.beginPath();
          c.arc(pcx, pcy, ph.h * 0.55 + e * (g.compact ? 90 : 170), 0, Math.PI * 2);
          c.stroke();
          c.globalAlpha = 1;
        }
        const hold = ease(tt, HOLD_AT, 0.8) * sA;
        if (hold > 0) {
          const br = 0.5 + 0.5 * Math.sin((tt - HOLD_AT) * 2.2 - Math.PI / 2);
          c.strokeStyle = PAL.primary;
          c.globalAlpha = hold * (0.08 + 0.1 * br);
          c.lineWidth = 1;
          c.beginPath();
          c.arc(pcx, pcy, ph.h * 0.55 + 8 + br * 14, 0, Math.PI * 2);
          c.stroke();
          c.globalAlpha = 1;
        }
      }

      // Track: dashed in --line; each route that has carried a message turns
      // a quiet agave.
      c.strokeStyle = PAL.line;
      c.lineWidth = 1.3;
      c.setLineDash([4, 5]);
      strokeTraceUpTo(c, g.track, g.track.len);
      if (!g.compact) {
        for (const r of g.routes) {
          c.beginPath();
          c.moveTo(r.pts[1].x, r.pts[1].y);
          c.lineTo(r.pts[2].x, r.pts[2].y);
          c.lineTo(r.pts[3].x, r.pts[3].y);
          c.stroke();
        }
      }
      c.setLineDash([]);
      for (let r = 0; r < 4; r++) {
        const lp = settled ? 1 : prog(tt, latchAt(r), 0.3) * sA;
        if (lp <= 0) continue;
        c.strokeStyle = PAL.primaryDim;
        c.globalAlpha = 0.7 * lp;
        c.lineWidth = 1.3;
        strokeTraceUpTo(c, g.routes[r], g.routes[r].len);
        c.globalAlpha = 1;
      }

      // Faint trails of the six paths already walked: the field keeps the
      // story once the dots have gone.
      const cta = g.cta;
      const target = { x: cta.x + cta.w / 2, y: cta.y + cta.h / 2 };
      for (const d of g.dots) {
        if (!d.matched) continue;
        const dep = DEPART0 + DEPART_STEP * d.idx;
        const p = settled ? 1 : ease(tt, dep, TRAVEL);
        if (p <= 0) continue;
        c.strokeStyle = PAL.primary;
        c.globalAlpha = 0.24 * sA;
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(d.base.x, d.base.y);
        const steps = 18;
        for (let s = 1; s <= steps * p; s++) {
          const u = s / steps;
          const a = (1 - u) * (1 - u);
          const b = 2 * (1 - u) * u;
          const q = u * u;
          c.lineTo(
            a * d.base.x + b * d.ctrl.x + q * target.x,
            a * d.base.y + b * d.ctrl.y + q * target.y
          );
        }
        c.stroke();
        c.globalAlpha = 1;
      }

      // Search chip, always present; the query types in.
      const ch = g.chip;
      rr(c, ch.x, ch.y, ch.w, ch.h, 2);
      c.fillStyle = PAL.panel;
      c.fill();
      c.strokeStyle = PAL.line;
      c.lineWidth = 1.2;
      c.stroke();
      drawMagnifier(c, ch.x + 15, ch.y + ch.h / 2 - 1.5, PAL.muted);
      const qp = settled ? 1 : prog(tt, Q_START, Q_END - Q_START);
      const nChars = Math.round(t.query.length * qp);
      if (nChars > 0 && sA > 0) {
        c.globalAlpha = sA;
        c.font = F(g.chipFont, 500);
        c.textAlign = "left";
        c.textBaseline = "middle";
        c.fillStyle = PAL.ink;
        const qs = t.query.slice(0, nChars);
        c.fillText(qs, ch.x + 30, ch.y + ch.h / 2 + 0.5);
        if (!settled && tt < Q_END + 0.3) {
          const cw = c.measureText(qs).width;
          c.strokeStyle = PAL.primary;
          c.lineWidth = 1.2;
          line(c, ch.x + 32 + cw, ch.y + 9, ch.x + 32 + cw, ch.y + ch.h - 9);
        }
        c.globalAlpha = 1;
      }

      // Result card docks under the chip; a thin line links it to the phone.
      const cp = settled ? 1 : ease(tt, CARD_AT, 0.5) * sA;
      if (cp > 0) {
        const cd = g.card;
        const yOff = (1 - cp) * -8;
        c.globalAlpha = cp;
        rr(c, cd.x, cd.y + yOff, cd.w, cd.h, 2);
        c.fillStyle = PAL.card;
        c.fill();
        c.strokeStyle = PAL.primaryDim;
        c.lineWidth = 1.1;
        c.stroke();
        c.fillStyle = PAL.primary;
        c.fillRect(cd.x, cd.y + yOff + 6, 2, cd.h - 12);
        c.textAlign = "left";
        c.textBaseline = "alphabetic";
        c.font = F(12);
        c.fillStyle = PAL.ink;
        c.fillText(t.siteName, cd.x + 12, cd.y + yOff + 17);
        c.font = F(11, 500);
        c.fillStyle = PAL.primary;
        c.fillText(t.resultTag, cd.x + 12, cd.y + yOff + 32);
        c.globalAlpha = 1;
        const lp = settled ? 1 : ease(tt, CARD_AT + 0.25, 0.4) * sA;
        if (lp > 0) {
          const y0 = cd.y + cd.h;
          const y1 = ph.y;
          c.strokeStyle = PAL.primaryDim;
          c.lineWidth = 1.2;
          line(c, pcx, y0, pcx, y0 + (y1 - y0) * lp);
          if (lp >= 1) {
            c.fillStyle = PAL.primary;
            c.beginPath();
            c.arc(pcx, y1, 2, 0, Math.PI * 2);
            c.fill();
          }
        }
      }

      // Phone frame: empty and dim until the site assembles.
      rr(c, ph.x, ph.y, ph.w, ph.h, 2);
      c.fillStyle = PAL.panel;
      c.fill();
      c.strokeStyle = PAL.line;
      c.lineWidth = 1.4;
      c.stroke();
      const live = settled ? 1 : ease(tt, SITE_START, 1.2) * sA;
      if (live > 0) {
        c.globalAlpha = live;
        rr(c, ph.x, ph.y, ph.w, ph.h, 2);
        c.strokeStyle = PAL.faint;
        c.stroke();
        c.globalAlpha = 1;
      }
      c.strokeStyle = PAL.line;
      c.lineWidth = 1.6;
      line(c, pcx - 14, ph.y + 9, pcx + 14, ph.y + 9);

      const ix = ph.x + 8;
      const iw = ph.w - 16;
      const blockA = (i: number) => (settled ? 1 : ease(tt, SITE_START + SITE_STAGGER * i, SITE_DUR) * sA);
      const blockY = (i: number) => (settled ? 0 : (1 - ease(tt, SITE_START + SITE_STAGGER * i, SITE_DUR)) * 8);
      // header bar with the business name
      let a = blockA(0);
      if (a > 0) {
        const y = ph.y + 18 + blockY(0);
        c.globalAlpha = a;
        rr(c, ix, y, iw, 20, 2);
        c.fillStyle = PAL.lineSoft;
        c.fill();
        c.fillStyle = PAL.primary;
        c.fillRect(ix + 6, y + 7, 6, 6);
        c.font = F(11);
        c.textAlign = "left";
        c.textBaseline = "alphabetic";
        c.fillStyle = PAL.ink;
        c.fillText(t.siteName, ix + 17, y + 14);
        c.globalAlpha = 1;
      }
      const heroY = ph.y + 44;
      const heroH = Math.round(ph.h * 0.26);
      a = blockA(1);
      if (a > 0) {
        c.globalAlpha = a;
        rr(c, ix, heroY + blockY(1), iw, heroH, 2);
        c.fillStyle = PAL.primaryFaint;
        c.fill();
        c.globalAlpha = 1;
      }
      a = blockA(2);
      if (a > 0) {
        c.globalAlpha = a;
        const lines = wrap(c, t.siteLine, iw - 4, F(11, 500));
        c.font = F(11, 500);
        c.fillStyle = PAL.dim;
        c.textAlign = "left";
        let y = heroY + heroH + 17 + blockY(2);
        for (const s of lines) {
          c.fillText(s, ix + 2, y);
          y += 14;
        }
        c.globalAlpha = 1;
      }
      a = blockA(3);
      if (a > 0) {
        c.globalAlpha = a;
        const by = cta.y + blockY(3);
        rr(c, cta.x, by, cta.w, cta.h, 2);
        // Agave, not clay: the page's own hero action is the one clay element in
        // the viewport this canvas shares with it (identity v3, clay once).
        c.fillStyle = PAL.primary;
        c.fill();
        c.font = F(g.compact ? 13 : 12);
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = "rgba(255,255,255,0.96)";
        c.fillText(t.siteCta, cta.x + cta.w / 2, by + cta.h / 2 + 0.5);
        c.textBaseline = "alphabetic";
        c.globalAlpha = 1;
      }

      // Arrival pulses on the button and the messages counter.
      let count = 0;
      for (let i = 0; i < 6; i++) {
        const at = arrival(i);
        if (settled || tt >= at) count++;
        if (settled) continue;
        const rp = prog(tt, at, 0.7);
        if (rp > 0 && rp < 1) {
          const e = easeInOut(rp);
          const grow = 3 + e * 10;
          c.strokeStyle = PAL.primary;
          c.globalAlpha = 0.6 * (1 - e) * sA;
          c.lineWidth = 1.3;
          rr(c, cta.x - grow, cta.y - grow, cta.w + grow * 2, cta.h + grow * 2, 2);
          c.stroke();
          c.globalAlpha = 1;
        }
      }
      const cntA = settled ? 1 : ease(tt, arrival(0) - 0.15, 0.35) * sA;
      if (cntA > 0) {
        const cb = g.counter;
        c.globalAlpha = cntA;
        rr(c, cb.x, cb.y, cb.w, cb.h, 2);
        c.fillStyle = PAL.panel;
        c.fill();
        c.strokeStyle = PAL.primaryDim;
        c.lineWidth = 1.1;
        c.stroke();
        c.textBaseline = "alphabetic";
        if (g.compact) {
          c.textAlign = "left";
          c.font = F(11, 500);
          c.fillStyle = PAL.muted;
          c.fillText(t.messagesK, cb.x + 9, cb.y + 16);
          c.font = F(13, 700);
          c.fillStyle = PAL.primary;
          c.fillText(String(Math.max(1, count)), cb.x + 9, cb.y + 33);
        } else {
          c.textAlign = "left";
          c.font = F(11, 500);
          c.fillStyle = PAL.muted;
          c.fillText(t.messagesK, cb.x + 10, cb.y + 17);
          c.font = F(13, 700);
          c.fillStyle = PAL.primary;
          c.textAlign = "right";
          c.fillText(String(Math.max(1, count)), cb.x + cb.w - 10, cb.y + 17.5);
        }
        c.globalAlpha = 1;
      }

      // People-dots.
      if (!settled) {
        for (let j = 0; j < g.dots.length; j++) {
          const d = g.dots[j];
          const fin = ease(tt, DOTS_IN + j * 0.08, 0.5);
          if (fin <= 0) continue;
          const drift = {
            x: Math.sin(tt * 0.7 + j * 1.7) * 3,
            y: Math.cos(tt * 0.55 + j * 2.3) * 2.5,
          };
          if (d.matched) {
            const dep = DEPART0 + DEPART_STEP * d.idx;
            const p = ease(tt, dep, TRAVEL);
            if (tt >= dep + TRAVEL) continue;
            const hold = 1 - p;
            const p0 = { x: d.base.x + drift.x * hold, y: d.base.y + drift.y * hold };
            const a0 = (1 - p) * (1 - p);
            const b0 = 2 * (1 - p) * p;
            const q0 = p * p;
            const x = a0 * p0.x + b0 * d.ctrl.x + q0 * target.x;
            const y = a0 * p0.y + b0 * d.ctrl.y + q0 * target.y;
            c.globalAlpha = fin * sA;
            c.fillStyle = PAL.primary;
            c.beginPath();
            c.arc(x, y, 3, 0, Math.PI * 2);
            c.fill();
            if (p > 0) {
              c.globalAlpha = 0.18 * fin * sA;
              c.beginPath();
              c.arc(x, y, 6.5, 0, Math.PI * 2);
              c.fill();
            }
          } else {
            const out = ease(tt, UNMATCHED_OUT + d.idx * 0.1, 0.5);
            const al = fin * (1 - out) * sA;
            if (al <= 0) continue;
            c.globalAlpha = al;
            c.fillStyle = PAL.muted;
            c.beginPath();
            c.arc(d.base.x + drift.x, d.base.y + drift.y, 3, 0, Math.PI * 2);
            c.fill();
          }
          c.globalAlpha = 1;
        }
      }

      // Pulses along the track into the ledger, plus one idle pulse in the hold.
      if (!settled) {
        for (let r = 0; r < 4; r++) {
          const s = PULSE0 + PULSE_STEP * r;
          if (tt < s || tt > s + PULSE_DUR) continue;
          const tr = g.routes[r];
          drawFlow(c, tr, tr.len * easeInOut((tt - s) / PULSE_DUR), PAL.primarySoft, PAL.primaryBright);
        }
        if (tt >= IDLE_PULSE && tt <= IDLE_PULSE + PULSE_DUR && sA > 0) {
          const tr = g.routes[2];
          c.save();
          c.globalAlpha = sA;
          drawFlow(c, tr, tr.len * easeInOut((tt - IDLE_PULSE) / PULSE_DUR), PAL.primarySoft, PAL.primaryBright);
          c.restore();
        }
        c.globalAlpha = 1;
      }
      c.fillStyle = PAL.panel;
      c.strokeStyle = count > 0 ? PAL.primaryDim : PAL.line;
      c.lineWidth = 1.3;
      c.beginPath();
      c.arc(g.port.x, g.port.y, 3, 0, Math.PI * 2);
      c.fill();
      c.stroke();

      // Ledger.
      const lg = g.ledger;
      rr(c, lg.x, lg.y, lg.w, lg.h, 2);
      c.fillStyle = PAL.panel;
      c.fill();
      const anyLatch = settled ? 1 : ease(tt, latchAt(0), 0.4) * sA;
      c.strokeStyle = PAL.line;
      c.lineWidth = 1.4;
      c.stroke();
      if (anyLatch > 0) {
        c.globalAlpha = anyLatch;
        c.strokeStyle = PAL.primaryDim;
        rr(c, lg.x, lg.y, lg.w, lg.h, 2);
        c.stroke();
        c.globalAlpha = 1;
      }
      c.textAlign = "left";
      c.textBaseline = "alphabetic";
      c.font = F(13);
      c.fillStyle = PAL.ink;
      c.fillText(t.ledgerTitle, lg.x + 14, lg.y + 22);
      c.strokeStyle = PAL.line;
      c.lineWidth = 1;
      line(c, lg.x + 12, lg.y + 32, lg.x + lg.w - 12, lg.y + 32);
      if (g.compact) {
        // the track plugs into the ledger's top edge here
        c.fillStyle = anyLatch > 0 ? PAL.primary : PAL.line;
        c.beginPath();
        c.arc(W / 2, lg.y, 2.6, 0, Math.PI * 2);
        c.fill();
      }
      for (let r = 0; r < 4; r++) {
        const row = t.rows[r];
        const y = g.rowTop + g.rowH * r;
        const lt = settled ? 1 : sA;
        const vA = settled ? 1 : ease(tt, latchAt(r), 0.3) * sA;
        const bar = settled ? 1 : ease(tt, latchAt(r), BAR_DUR);
        c.font = F(11, 500);
        c.textAlign = "left";
        c.fillStyle = PAL.muted;
        c.fillText(row.k, lg.x + 14, y + 14);
        if (vA > 0) {
          c.globalAlpha = vA;
          c.fillStyle = PAL.ink;
          c.fillText(row.k, lg.x + 14, y + 14);
          c.font = F(12);
          c.textAlign = "right";
          c.fillStyle = PAL.primary;
          c.fillText(row.v, lg.x + lg.w - 14, y + 14);
          c.globalAlpha = 1;
        }
        const bx = lg.x + 14;
        const bw = lg.w - 28;
        const byy = y + 22;
        c.strokeStyle = PAL.lineSoft;
        c.lineWidth = 2;
        c.lineCap = "butt";
        line(c, bx, byy, bx + bw, byy);
        if (bar > 0 && lt > 0) {
          c.globalAlpha = lt;
          c.strokeStyle = PAL.primary;
          line(c, bx, byy, bx + bw * bar, byy);
          c.globalAlpha = 1;
        }
        c.lineCap = "round";
      }

      drawLabels(c, g, tt, sA, settled);

      if (caption) {
        const done = settled || (tt >= latchAt(3) && tt < FADE_AT + FADE_DUR * 0.5);
        const want = done ? t.captionDone : t.captionRun;
        if (want !== captionText) {
          captionText = want;
          caption.textContent = want;
        }
      }
    }

    function draw() {
      if (!ctx || W === 0 || H === 0) return;
      if (reduced()) drawScene(SETTLED_T, true);
      else drawScene(T % LOOP, false);
    }

    function resize() {
      let rect = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      const compact = W < 780;
      // Height from the measured width: the single source of truth. The CSS
      // height is only the pre-hydration paint.
      // Clear the frame's HTML tag and caption, measured rather than guessed,
      // because the tag wraps to two lines on narrow phones.
      let topPad = 44;
      if (tag) {
        const tr = tag.getBoundingClientRect();
        topPad = Math.max(40, tr.bottom - rect.top + 12);
      }
      const botPad = caption && caption.offsetParent ? 36 : 18;
      // The compact stack needs about 690 px below the tag (chip, card, phone,
      // a band for the people, the ledger), so a wrapped tag grows the frame.
      const h = compact
        ? Math.min(760, Math.max(620, W * 2.1, topPad + 690 + botPad))
        : Math.min(540, Math.max(440, W * 0.46));
      canvas!.style.height = Math.round(h) + "px";
      rect = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      ctx = fitCanvas(canvas!, W, H);
      G = layout(ctx, compact, topPad, botPad);
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
      <div className="stage-frame arc-stage" role="img" aria-label={t.aria}>
        <span className="stage-tag mono" ref={tagRef}>
          <span className="before">{t.tagBefore}</span>{" "}
          <span className="midword">{t.tagMid}</span>
        </span>
        <span className="stage-caption mono" ref={captionRef}>
          {t.captionRun}
        </span>
        <canvas id="arcCanvas" ref={canvasRef} aria-hidden="true" />
        <noscript>
          <div className="stage-fallback">{t.fallback}</div>
        </noscript>
      </div>
    </div>
  );
}
