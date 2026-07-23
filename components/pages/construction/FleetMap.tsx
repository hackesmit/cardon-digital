"use client";

import { useEffect, useRef } from "react";

type RGB = [number, number, number];
type Pt = { x: number; y: number };
type Trace = { pts: Pt[]; cum: number[]; len: number };
type Site = { node: number; label: string };
type Vehicle = {
  id: string;
  route: number[];
  trace: Trace;
  speed: number;
  dist: number;
  pos: Pt;
  head: number;
  trail: Pt[];
  inside: boolean[];
};
type LogRow = { veh: string; site: string; age: number; born: number };
type Pulse = { x: number; y: number; t: number };

/* road-network nodes in map-relative coordinates (0..1 across the map rect) */
const NODES: Pt[] = [
  { x: 0.16, y: 0.30 }, // 0 DEPOT
  { x: 0.44, y: 0.16 }, // 1
  { x: 0.78, y: 0.26 }, // 2 SITE A
  { x: 0.88, y: 0.62 }, // 3
  { x: 0.60, y: 0.84 }, // 4 SITE B
  { x: 0.30, y: 0.74 }, // 5
  { x: 0.10, y: 0.56 }, // 6
  { x: 0.52, y: 0.50 }, // 7 center junction
];

const ROADS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0],
  [1, 7], [7, 4], [7, 3], [5, 7],
];

const SITES: Site[] = [
  { node: 0, label: "DEPOT" },
  { node: 2, label: "SITE A" },
  { node: 4, label: "SITE B" },
];

/* each vehicle loops a route of node indices; the trace closes back to its start */
const ROUTES: Array<{ id: string; route: number[]; speed: number; start: number }> = [
  { id: "V1", route: [0, 1, 2, 3, 4, 5, 6], speed: 0.052, start: 0.0 },
  { id: "V2", route: [0, 1, 7, 4, 5, 6], speed: 0.061, start: 0.35 },
  { id: "V3", route: [2, 3, 4, 7, 1], speed: 0.047, start: 0.6 },
  { id: "V4", route: [0, 6, 5, 7, 1], speed: 0.058, start: 0.15 },
];

/**
 * Fleet tracking: every vehicle on one live map. Sites are geofenced rings on a
 * quiet road network; vehicles run their routes, and when one crosses into a
 * ring its arrival logs itself, no phone call. Two purpose-made compositions
 * live in one canvas, chosen by the measured container width (wide: map beside
 * a log; compact portrait: map above the log), so the height fits the active
 * composition and there is no dead band across the range.
 *
 * Contracts preserved: rAF loop with DPR capped at 2, IntersectionObserver plus
 * visibilitychange pausing, prefers-reduced-motion resolves to a designed static
 * frame, palette re-reads on the window "cardon-mode" event, ASCII and English
 * only.
 */
export default function FleetMap() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas || !canvas.getContext) return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;

    const MONO = 'ui-monospace, "SFMono-Regular", Consolas, monospace';
    const WHITE: RGB = [255, 255, 255];
    const BLACK: RGB = [12, 12, 12];

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
      groundRgb: [15, 20, 16] as RGB,
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
      secondaryRgb: [217, 168, 58] as RGB,
      secondary: "",
      secondaryBright: "",
      secondaryDeep: "",
    };

    const readPalette = () => {
      const ground = hexToRgb(cssVar("--ground") || "#0F1410");
      const panel = hexToRgb(cssVar("--panel") || "#16201A");
      const text = hexToRgb(cssVar("--text") || "#E4EAD9");
      const primary = hexToRgb(cssVar("--primary") || "#3FB58A");
      const secondary = hexToRgb(cssVar("--secondary") || "#D9A83A");
      const dark = root.getAttribute("data-mode") !== "light";
      const toward: RGB = dark ? WHITE : BLACK;

      PAL.groundRgb = ground;
      PAL.panel = rgba(panel, 1);
      PAL.card = rgba(mix(panel, text, 0.08), 1);
      PAL.textRgb = text;
      PAL.ink = rgba(text, 1);
      PAL.dim = rgba(text, 0.76);
      PAL.faint = rgba(text, 0.32);
      PAL.muted = rgba(mix(text, panel, 0.5), 1);
      PAL.line = rgba(mix(primary, text, 0.35), 0.24);
      PAL.lineSoft = rgba(mix(primary, text, 0.35), 0.13);
      PAL.primaryRgb = primary;
      PAL.primary = rgba(primary, 1);
      PAL.primarySoft = rgba(primary, 0.85);
      PAL.primaryFaint = rgba(primary, 0.14);
      PAL.primaryDim = rgba(primary, 0.5);
      PAL.secondaryRgb = secondary;
      PAL.secondary = rgba(secondary, 1);
      PAL.secondaryBright = rgba(mix(secondary, toward, 0.28), 1);
      PAL.secondaryDeep = rgba(mix(secondary, BLACK, 0.42), 1);
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
      x: number, y: number, w: number, h: number, r: number
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
    const makeTrace = (pts: Pt[]): Trace => {
      const cum = [0];
      let total = 0;
      for (let i = 1; i < pts.length; i++) {
        total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        cum.push(total);
      }
      return { pts, cum, len: total };
    };
    const pointAtLen = (tr: Trace, L: number): Pt => {
      const pts = tr.pts;
      const cum = tr.cum;
      const len = tr.len || 1;
      L = ((L % len) + len) % len;
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
      return { x: pts[0].x, y: pts[0].y };
    };

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let clock = 0;
    const COMPACT_W = 520;
    let compact = false;

    // geometry, recomputed on layout
    let map = { x: 0, y: 0, w: 0, h: 0 };
    let log = { x: 0, y: 0, w: 0, h: 0 };
    let ringR = 24;
    let nodePts: Pt[] = [];
    let sitePts: Pt[] = [];
    let vehicles: Vehicle[] = [];
    let pulses: Pulse[] = [];
    let logRows: LogRow[] = [];
    let statusY = 0;
    let headY = 0;
    let maxRows = 4;
    const ROW_H = 30;

    // A live feed is kept exactly maxRows long so the panel is always full and
    // never reads as a reserved empty box; new arrivals push the oldest out.
    const SEED: Array<{ veh: string; site: string }> = [
      { veh: "V2", site: "SITE B" },
      { veh: "V1", site: "DEPOT" },
      { veh: "V3", site: "SITE A" },
      { veh: "V4", site: "DEPOT" },
    ];
    const seedLog = () => {
      logRows = SEED.slice(0, maxRows).map((s, i) => ({
        veh: s.veh,
        site: s.site,
        age: 0,
        born: -20 - i,
      }));
    };

    const nodeAt = (i: number): Pt => ({
      x: map.x + NODES[i].x * map.w,
      y: map.y + NODES[i].y * map.h,
    });

    const buildVehicles = () => {
      vehicles = ROUTES.map((r) => {
        const pts = r.route.map((n) => nodePts[n]);
        pts.push(nodePts[r.route[0]]);
        const trace = makeTrace(pts);
        return {
          id: r.id,
          route: r.route,
          trace,
          speed: r.speed,
          dist: r.start * trace.len,
          pos: pointAtLen(trace, r.start * trace.len),
          head: 0,
          trail: [],
          inside: SITES.map(() => false),
        };
      });
    };

    const layout = () => {
      compact = W < COMPACT_W;
      const P = compact ? 16 : 18;
      headY = P + 12;
      const mapTop = headY + 16;
      statusY = H - 14;
      maxRows = compact ? 3 : 4;
      const logH = 30 + maxRows * ROW_H + 14;
      if (compact) {
        // portrait: map on top, the arrivals feed sized to its content below
        map = { x: P, y: mapTop, w: W - P * 2, h: H - mapTop - logH - 34 };
        log = { x: P, y: map.y + map.h + 12, w: W - P * 2, h: logH };
      } else {
        // wide: map beside a content-sized feed card, centered in the column
        const logW = Math.max(158, W * 0.34);
        map = { x: P, y: mapTop, w: W - P * 3 - logW, h: H - mapTop - 34 };
        const logY = mapTop + Math.max(0, (map.h - logH) / 2);
        log = { x: map.x + map.w + P, y: logY, w: logW, h: logH };
      }
      ringR = Math.max(16, Math.min(map.w, map.h) * 0.11);
      nodePts = NODES.map((_, i) => nodeAt(i));
      sitePts = SITES.map((s) => nodePts[s.node]);
      buildVehicles();
    };

    const pushLog = (veh: string, site: string) => {
      logRows.unshift({ veh, site, age: 0, born: clock });
      if (logRows.length > maxRows) logRows.length = maxRows;
    };

    const drawRoads = () => {
      const c = ctx!;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.strokeStyle = PAL.lineSoft;
      c.lineWidth = 3.2;
      for (const [a, b] of ROADS) {
        c.beginPath();
        c.moveTo(nodePts[a].x, nodePts[a].y);
        c.lineTo(nodePts[b].x, nodePts[b].y);
        c.stroke();
      }
      c.strokeStyle = PAL.line;
      c.lineWidth = 1;
      for (const [a, b] of ROADS) {
        c.beginPath();
        c.moveTo(nodePts[a].x, nodePts[a].y);
        c.lineTo(nodePts[b].x, nodePts[b].y);
        c.stroke();
      }
      // quiet junction dots
      c.fillStyle = PAL.faint;
      for (let i = 0; i < nodePts.length; i++) {
        const isSite = SITES.some((s) => s.node === i);
        if (isSite) continue;
        c.beginPath();
        c.arc(nodePts[i].x, nodePts[i].y, 1.6, 0, Math.PI * 2);
        c.fill();
      }
    };

    const drawSites = () => {
      const c = ctx!;
      for (let s = 0; s < SITES.length; s++) {
        const p = sitePts[s];
        // geofence fill
        c.fillStyle = PAL.primaryFaint;
        c.beginPath();
        c.arc(p.x, p.y, ringR, 0, Math.PI * 2);
        c.fill();
        // dashed ring
        c.strokeStyle = PAL.primaryDim;
        c.lineWidth = 1.2;
        c.setLineDash([4, 4]);
        c.beginPath();
        c.arc(p.x, p.y, ringR, 0, Math.PI * 2);
        c.stroke();
        c.setLineDash([]);
        // center marker
        c.fillStyle = PAL.primary;
        c.beginPath();
        c.arc(p.x, p.y, 3, 0, Math.PI * 2);
        c.fill();
        // label
        c.font = "600 10px " + MONO;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = PAL.muted;
        c.fillText(SITES[s].label, p.x, p.y + ringR + 10);
      }
      c.textAlign = "left";
      c.textBaseline = "alphabetic";
    };

    const drawPulses = () => {
      const c = ctx!;
      for (const pu of pulses) {
        const a = 1 - pu.t;
        c.strokeStyle = PAL.primary;
        c.globalAlpha = a * 0.75;
        c.lineWidth = 2;
        c.beginPath();
        c.arc(pu.x, pu.y, ringR * (0.5 + pu.t * 0.9), 0, Math.PI * 2);
        c.stroke();
        c.globalAlpha = 1;
      }
    };

    const drawVehicle = (v: Vehicle) => {
      const c = ctx!;
      // trail
      for (let i = 0; i < v.trail.length; i++) {
        const a = (i / v.trail.length) * 0.5;
        c.fillStyle = PAL.secondary;
        c.globalAlpha = a;
        c.beginPath();
        c.arc(v.trail[i].x, v.trail[i].y, 1.8, 0, Math.PI * 2);
        c.fill();
      }
      c.globalAlpha = 1;
      // marker: a rounded chevron pointing along the heading
      c.save();
      c.translate(v.pos.x, v.pos.y);
      c.rotate(v.head);
      c.fillStyle = PAL.secondary;
      c.strokeStyle = PAL.secondaryDeep;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(6.5, 0);
      c.lineTo(-4.5, 4.2);
      c.lineTo(-2, 0);
      c.lineTo(-4.5, -4.2);
      c.closePath();
      c.fill();
      c.stroke();
      c.restore();
      // id chip
      c.font = "600 8px " + MONO;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillStyle = PAL.secondaryBright;
      c.fillText(v.id, v.pos.x, v.pos.y - 9);
      c.textAlign = "left";
      c.textBaseline = "alphabetic";
    };

    const drawLog = () => {
      const c = ctx!;
      rr(c, log.x, log.y, log.w, log.h, 10);
      c.fillStyle = PAL.card;
      c.globalAlpha = 0.5;
      c.fill();
      c.globalAlpha = 1;
      c.strokeStyle = PAL.line;
      c.lineWidth = 1;
      c.stroke();

      const px = log.x + 12;
      let y = log.y + 20;
      c.font = "600 9px " + MONO;
      c.textBaseline = "alphabetic";
      c.textAlign = "left";
      c.fillStyle = PAL.muted;
      c.fillText("ARRIVALS", px, y);
      c.textAlign = "right";
      c.fillStyle = PAL.primary;
      c.fillText("AUTO", log.x + log.w - 12, y);
      c.textAlign = "left";

      c.strokeStyle = PAL.lineSoft;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(px, y + 8);
      c.lineTo(log.x + log.w - 12, y + 8);
      c.stroke();

      y += 26;
      const rowH = ROW_H;
      for (let i = 0; i < logRows.length; i++) {
        const rw = logRows[i];
        const fresh = clamp01(1 - (clock - rw.born) / 1.1);
        const fade = i === 0 ? 1 : Math.max(0.4, 1 - i * 0.22);
        const ry = y + i * rowH;
        // check-in tick: a small green ring with a dot (the receipt)
        c.strokeStyle = PAL.primary;
        c.globalAlpha = fade;
        c.lineWidth = 1.3;
        c.beginPath();
        c.arc(px + 4, ry - 3, 4.5, 0, Math.PI * 2);
        c.stroke();
        c.fillStyle = PAL.primary;
        c.beginPath();
        c.arc(px + 4, ry - 3, 1.6, 0, Math.PI * 2);
        c.fill();
        if (fresh > 0) {
          c.globalAlpha = fresh * 0.5;
          c.beginPath();
          c.arc(px + 4, ry - 3, 4.5 + fresh * 5, 0, Math.PI * 2);
          c.stroke();
        }
        c.globalAlpha = fade;
        c.font = "600 10px " + MONO;
        c.fillStyle = i === 0 ? PAL.ink : PAL.dim;
        c.fillText(rw.veh + " at " + rw.site, px + 16, ry);
        c.font = "600 8px " + MONO;
        c.fillStyle = PAL.muted;
        c.textAlign = "right";
        c.fillText("logged", log.x + log.w - 12, ry);
        c.textAlign = "left";
        c.globalAlpha = 1;
      }
    };

    const drawChrome = (live: boolean) => {
      const c = ctx!;
      const P = compact ? 16 : 18;
      c.font = "600 11px " + MONO;
      c.textBaseline = "alphabetic";
      c.textAlign = "left";
      c.fillStyle = PAL.ink;
      c.fillText("FLEET", P, headY);
      // live dot
      const pulse = reduced() ? 0.7 : 0.5 + 0.4 * Math.sin(clock * 3);
      const dotX = P + 52;
      c.globalAlpha = pulse;
      c.fillStyle = PAL.primary;
      c.beginPath();
      c.arc(dotX, headY - 4, 3, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
      c.font = "600 9px " + MONO;
      c.fillStyle = PAL.muted;
      c.fillText(live ? "LIVE" : "READY", dotX + 8, headY);
      // status line
      c.font = "600 9px " + MONO;
      c.fillStyle = PAL.muted;
      c.fillText(
        ROUTES.length + " vehicles on one map / arrivals log themselves",
        P,
        statusY
      );
    };

    const draw = () => {
      if (!ctx || W === 0 || H === 0) return;
      ctx.clearRect(0, 0, W, H);
      drawRoads();
      drawSites();
      drawPulses();
      for (const v of vehicles) drawVehicle(v);
      drawLog();
      drawChrome(!reduced());
    };

    const step = (dt: number) => {
      clock += dt;
      for (const v of vehicles) {
        const prev = v.pos;
        v.dist += v.speed * v.trace.len * dt;
        v.pos = pointAtLen(v.trace, v.dist);
        const dx = v.pos.x - prev.x;
        const dy = v.pos.y - prev.y;
        if (dx * dx + dy * dy > 0.02) v.head = Math.atan2(dy, dx);
        v.trail.push({ x: v.pos.x, y: v.pos.y });
        if (v.trail.length > 9) v.trail.shift();
        // geofence check-in with hysteresis
        for (let s = 0; s < sitePts.length; s++) {
          const d = Math.hypot(v.pos.x - sitePts[s].x, v.pos.y - sitePts[s].y);
          if (!v.inside[s] && d < ringR) {
            v.inside[s] = true;
            pushLog(v.id, SITES[s].label);
            if (pulses.length < 6)
              pulses.push({ x: sitePts[s].x, y: sitePts[s].y, t: 0 });
          } else if (v.inside[s] && d > ringR * 1.2) {
            v.inside[s] = false;
          }
        }
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].t += dt * 0.9;
        if (pulses[i].t >= 1) pulses.splice(i, 1);
      }
    };

    const resolvedStatic = () => {
      // designed static frame: vehicles parked mid-route, sites drawn, the log
      // pre-filled (seeded in resize) so the receipt idea reads without motion
      clock = 10;
      pulses = [];
      for (const v of vehicles) {
        v.pos = pointAtLen(v.trace, v.trace.len * 0.42);
        const ahead = pointAtLen(v.trace, v.trace.len * 0.44);
        v.head = Math.atan2(ahead.y - v.pos.y, ahead.x - v.pos.x);
        v.trail = [];
      }
      draw();
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

    const resize = () => {
      let rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      compact = W < COMPACT_W;
      // The frame height derives from the active composition at this measured
      // width (single source of truth), so it always fits the content: no dead
      // band, no reserved empty box.
      const targetH = compact
        ? Math.round(Math.min(Math.max(W * 1.1, 430), 560))
        : Math.round(Math.min(Math.max(W * 0.66, 300), 430));
      canvas.style.height = targetH + "px";
      rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      ctx = fitCanvas(canvas, W, H);
      pulses = [];
      layout();
      seedLog();
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
        { threshold: 0.12 }
      );
      io.observe(frame);
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
    <div className="vis-frame fleet-frame" ref={frameRef}>
      <canvas className="fleet-canvas" ref={canvasRef} aria-hidden="true" />
      <noscript>
        <div className="sig-fallback">
          A live map of your sites and vehicles. Each site is a geofenced ring;
          when a vehicle crosses into one, its arrival is logged automatically,
          with no phone call. Every vehicle on one map.
        </div>
      </noscript>
    </div>
  );
}
