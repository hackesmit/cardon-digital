"use client";

import { useEffect, useRef } from "react";

import "./halftone.css";
import { clearsThreshold } from "@/lib/onscreen";
import type { BuilderSelection } from "@/lib/builder";
import { moduleIds } from "@/lib/pricing";

/**
 * The builder's halftone sunset (bead hq-lgjo.10, Daniel 2026-10-19 picked
 * variant 4 "Medios tonos" from the constellation artifact).
 *
 * A fixed diagonal dot screen, like newsprint, behind the top band of the
 * package builder. With nothing picked it is a flat, faint, uniform screen.
 * Each pick raises the contrast and a sunset rises in a soft wave from the
 * bottom up: a low sun between layered headlands, its path broken on the
 * water. With everything picked it is the full sunset. A short ripple runs
 * along the wave front when the level changes.
 *
 * PORTED, not reinvented: every constant below is the one in
 * state/assets/builder-halftone/reference-constelacion.html (paintSunset at
 * line 452, stage("tonos") at 610, the presence easing in the stage engine at
 * 209). The reference eases nine per-service presences and sums them; here the
 * level arrives as ONE number so hq-lgjo.6 can later drive it from per-feature
 * ticks, so the same easing runs on the sum directly, which is the same curve
 * when the client ticks one box at a time (and the reference's own ripple is
 * measured off that sum, not off the parts).
 *
 * The level is carried in PICKS, not normalised, inside the loop: the ripple
 * amplitude is a function of d(level)/dt and the reference's 0.35 gain is
 * calibrated against a sum that moves one unit per tick. Dividing by the slot
 * count before the derivative would shrink the ripple by that count.
 *
 * Decoration only: aria-hidden, no pointer events, no text of its own, and no
 * text is laid over it, so it cannot move any contrast ratio on the page.
 */

/* ============================== PURE CORE ==============================
   The level arithmetic and the per-dot tone curve, split out so they are
   checked by a table test rather than by a screenshot. */

/** How many boxes a client can tick: a website package, its care, an ads scope, each module. */
export const LEVEL_SLOTS = 3 + moduleIds.length;

/** The builder's level: ticked boxes over every box there is, 0 to 1. */
export function builderLevel(s: BuilderSelection): number {
  let n = 0;
  if (s.web !== null) n += 1;
  /* Care is only offered with a package, and PackageBuilder clears it when the
     package goes away; this does not trust that, so an inconsistent selection
     cannot read above 1. */
  if (s.web !== null && s.care) n += 1;
  if (s.ads !== null) n += 1;
  n += s.modules.filter((m) => moduleIds.includes(m)).length;
  return clamp(n, 0, LEVEL_SLOTS) / LEVEL_SLOTS;
}

export function clamp(v: number, a: number, b: number): number {
  return v < a ? a : v > b ? b : v;
}

/** smoothstep, the reference's `smooth`. */
export function smooth(t: number): number {
  t = clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}

/** Contrast gain: the whole screen's reach toward full tone. */
export function toneGain(level: number): number {
  return Math.pow(clamp(level, 0, 1), 0.85);
}

/**
 * The wave front, as a height fraction measured from the BOTTOM (1 is the top
 * of the band). It starts just under the floor so an empty builder shows no
 * sunset at all, and ends above the band so a full one has no front left in
 * view.
 */
export function waveFront(level: number): number {
  return -0.02 + clamp(level, 0, 1) * 1.25;
}

/** The flat screen every dot wears before any pick: the reference's u0. */
export const BASE_TONE = 0.17;

/**
 * How far the sunset has reached a dot sitting `yn` of the band's height above
 * its floor: the whole screen's contrast gain, cut by the wave front passing
 * through that height. 0 below the front's arrival, up to the gain above it.
 */
export function dotReach(yn: number, level: number): number {
  return toneGain(level) * smooth((waveFront(level) - yn) / 0.34 + 0.5);
}

/**
 * One dot's ink, 0 (nothing) to about 1.15 (over-full, which the radius
 * clamps). `tone` is the sunset's own value there and `bump` the ripple.
 */
export function dotValue(tone: number, reach: number, bump: number): number {
  const full = 0.025 + 0.975 * tone;
  return BASE_TONE + (full - BASE_TONE) * reach + bump * (0.25 + tone);
}

/** The ripple at a dot: a narrow gaussian riding the wave front. */
export function dotBump(yn: number, level: number, amp: number): number {
  const dz = (yn - waveFront(level)) / 0.07;
  return amp * Math.exp(-dz * dz);
}

/** A dot's drawn radius. Under 0.32px the reference drops it rather than draw a smudge. */
export function dotRadius(rmax: number, value: number): number {
  return rmax * Math.sqrt(clamp(value, 0, 1.15));
}

/**
 * Which of the five ink layers a dot belongs to. The order is the reference's:
 * the ripple wins, then the sun and its path on the water, then the sunset's
 * own tone in three steps.
 */
export function dotLayer(tone: number, reach: number, bump: number, sunMask: boolean): number {
  if (bump > 0.06) return 3;
  if (sunMask && reach > 0.35) return 4;
  const m = tone * reach;
  return m > 0.6 ? 2 : m > 0.3 ? 1 : 0;
}

/** Presence easing, the reference's rate 3.6, with its snap so a loop can stop. */
export function easeLevel(cur: number, target: number, dt: number): number {
  const d = target - cur;
  return Math.abs(d) < 1e-3 ? target : cur + d * (1 - Math.exp(-dt * 3.6));
}

/* ============================== COMPONENT ============================== */

type RGB = [number, number, number];

export default function HalftoneSunset({ level }: { level: number }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const levelRef = useRef(level);
  levelRef.current = clamp(level, 0, 1) * LEVEL_SLOTS;
  /* The canvas effect owns the loop and never re-runs, so the level effect
     below reaches it through this handle rather than by restarting it. */
  const runRef = useRef<() => void>(() => {});

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas || !canvas.getContext) return;
    /* The band needs both observers, and it is checked BEFORE asking for a
       drawing context. jsdom has neither observer and a getContext that logs
       "Not implemented" to stderr, so the old order left a red Error in the
       middle of ContactForm.test.tsx, whose own header says a warning there
       would bury a real one. Leaving early also means nothing reaches the
       `new ResizeObserver` below, which would be a ReferenceError there. */
    if (typeof ResizeObserver === "undefined" || typeof IntersectionObserver === "undefined") return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;

    /* ---------------------------- palette ---------------------------- */
    const cssVar = (name: string) => getComputedStyle(root).getPropertyValue(name).trim();
    const hexToRgb = (raw: string): RGB => {
      let h = raw.replace("#", "").trim();
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      const n = parseInt(h || "0", 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const rgba = (c: RGB, a: number) => "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
    const mix = (a: RGB, b: RGB, t: number): RGB => [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ];
    /* The reference's wine, brass and clay are this site's primary, secondary
       and energy; its ink is the text colour. */
    const PAL = {
      dark: true,
      ink: [239, 228, 230] as RGB,
      wine: [189, 82, 104] as RGB,
      gold: [209, 172, 85] as RGB,
      rust: [180, 86, 26] as RGB,
    };
    const readPalette = () => {
      PAL.ink = hexToRgb(cssVar("--text") || "#EFE4E6");
      PAL.wine = hexToRgb(cssVar("--primary") || "#BD5268");
      PAL.gold = hexToRgb(cssVar("--secondary") || "#D1AC55");
      PAL.rust = hexToRgb(cssVar("--energy") || "#B4561A");
      PAL.dark = root.getAttribute("data-mode") !== "light";
    };
    readPalette();

    /* -------------------------- the sunset ---------------------------
       Alpha-only, into an offscreen canvas at half resolution: `tc` carries
       the tone (what a dot's size reads) and `mc` a mask of the sun and its
       path on the water (what turns a dot to clay). Every figure is the
       reference's paintSunset. */
    const rng = (seed: number) => () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const paintSunset = (
      tc: CanvasRenderingContext2D,
      mc: CanvasRenderingContext2D,
      W: number,
      H: number
    ) => {
      const hz = H * 0.68;
      const sx = W * 0.5;
      const sy = H * 0.5;
      const sr = H * 0.22;
      /* Lay a shape down at a flat alpha: punch what is already there out
         first, so overlapping headlands do not compound. */
      const put = (path: Path2D, a: number) => {
        tc.save();
        tc.globalCompositeOperation = "destination-out";
        tc.fillStyle = "#000";
        tc.fill(path);
        tc.restore();
        tc.fillStyle = "rgba(0,0,0," + a + ")";
        tc.fill(path);
      };
      /* sky: deeper overhead, pale at the horizon, a halo around the sun */
      const g = tc.createLinearGradient(0, 0, 0, hz);
      g.addColorStop(0, "rgba(0,0,0,.27)");
      g.addColorStop(0.6, "rgba(0,0,0,.15)");
      g.addColorStop(1, "rgba(0,0,0,.05)");
      tc.fillStyle = g;
      tc.fillRect(0, 0, W, hz);
      tc.save();
      tc.globalCompositeOperation = "destination-out";
      const hg = tc.createRadialGradient(sx, sy, sr, sx, sy, sr * 2.1);
      hg.addColorStop(0, "rgba(0,0,0,.55)");
      hg.addColorStop(1, "rgba(0,0,0,0)");
      tc.fillStyle = hg;
      tc.fillRect(0, 0, W, hz);
      tc.restore();
      /* the sphere, shaded from a high-left light */
      const sun = new Path2D();
      sun.arc(sx, sy, sr, 0, 7);
      tc.save();
      tc.globalCompositeOperation = "destination-out";
      tc.fill(sun);
      tc.restore();
      const sg = tc.createRadialGradient(sx - sr * 0.38, sy - sr * 0.42, sr * 0.05, sx, sy, sr * 1.02);
      sg.addColorStop(0, "rgba(0,0,0,.22)");
      sg.addColorStop(0.6, "rgba(0,0,0,.62)");
      sg.addColorStop(1, "rgba(0,0,0,.98)");
      tc.fillStyle = sg;
      tc.fill(sun);
      mc.fillStyle = "#000";
      mc.fill(sun);
      /* headlands, two layers on each side */
      const hill = (x0: number, x1: number, yTop: number, yBase: number, side: number) => {
        const p = new Path2D();
        p.moveTo(x0, hz + 1);
        for (let i = 0; i <= 40; i++) {
          const t = i / 40;
          const x = x0 + (x1 - x0) * t;
          const k = side < 0 ? t : 1 - t;
          const y = yBase - (yBase - yTop) * Math.pow(1 - k, 1.6) * (1 + 0.06 * Math.sin(t * 19));
          p.lineTo(x, Math.min(hz, y));
        }
        p.lineTo(x1, hz + 1);
        p.closePath();
        return p;
      };
      put(hill(0, W * 0.42, H * 0.55, hz, -1), 0.5);
      put(hill(0, W * 0.27, H * 0.615, hz, -1), 0.78);
      put(hill(W * 0.66, W, H * 0.575, hz, 1), 0.46);
      put(hill(W * 0.8, W, H * 0.63, hz, 1), 0.74);
      /* water: darker toward the viewer, cut by pale swell lines that widen with distance */
      const wp = new Path2D();
      wp.rect(0, hz, W, H - hz);
      tc.save();
      tc.globalCompositeOperation = "destination-out";
      tc.fill(wp);
      tc.restore();
      const wg = tc.createLinearGradient(0, hz, 0, H);
      wg.addColorStop(0, "rgba(0,0,0,.3)");
      wg.addColorStop(1, "rgba(0,0,0,.72)");
      tc.fillStyle = wg;
      tc.fill(wp);
      tc.save();
      tc.globalCompositeOperation = "destination-out";
      for (let i = 1; i < 12; i++) {
        const t = i / 12;
        const y = hz + (H - hz) * Math.pow(t, 1.55);
        const th = 0.6 + t * 2.6;
        tc.fillStyle = "rgba(0,0,0,.42)";
        tc.fillRect(0, y, W, th);
      }
      tc.restore();
      /* the sun path on the water: broken dashes, narrowing then widening toward the viewer */
      const R = rng(77);
      for (let y = hz + 1; y < H; y += 2.2 + ((y - hz) / (H - hz)) * 3) {
        const t2 = (y - hz) / (H - hz);
        const half = sr * (0.95 - 0.45 * Math.sin(t2 * Math.PI * 0.9)) * (0.75 + R() * 0.4);
        const off = (R() - 0.5) * sr * 0.25;
        const segs = 1 + Math.floor(R() * 3);
        for (let s = 0; s < segs; s++) {
          const a = sx + off - half + 2 * half * (s / segs) + R() * 4;
          const b = a + ((2 * half) / segs) * (0.55 + R() * 0.4);
          const th2 = 1 + t2 * 2.4;
          tc.save();
          tc.globalCompositeOperation = "destination-out";
          tc.fillRect(a, y, b - a, th2);
          tc.restore();
          tc.fillStyle = "rgba(0,0,0," + (0.62 + t2 * 0.3) + ")";
          tc.fillRect(a, y, b - a, th2);
          mc.fillRect(a, y, b - a, th2);
        }
      }
    };

    /* ---------------------------- dot field ---------------------------- */
    let W = 0;
    let H = 0;
    let pitch = 5.4;
    /** One entry per dot: x, y, its tone, its height from the bottom, and whether the sun covers it. */
    let X: Float32Array | null = null;
    let Y = new Float32Array(0);
    let TONE = new Float32Array(0);
    let YN = new Float32Array(0);
    let SUN = new Uint8Array(0);

    const build = () => {
      if (W < 2 || H < 2) {
        X = null;
        return;
      }
      pitch = W < 560 ? 4.6 : 5.4;
      const hw = Math.max(2, Math.ceil(W / 2));
      const hh = Math.max(2, Math.ceil(H / 2));
      /* Both offscreen canvases exist to be read back once and thrown away,
         which is exactly what willReadFrequently is for; without it Chrome
         warns on the third readback of a session. They are half-resolution
         and drawn once per resize, so the software path it selects costs
         nothing here. */
      const tone = document.createElement("canvas");
      tone.width = hw;
      tone.height = hh;
      const tc = tone.getContext("2d", { willReadFrequently: true });
      const maskC = document.createElement("canvas");
      maskC.width = hw;
      maskC.height = hh;
      const mc = maskC.getContext("2d", { willReadFrequently: true });
      if (!tc || !mc) {
        X = null;
        return;
      }
      paintSunset(tc, mc, hw, hh);
      const src = tc.getImageData(0, 0, hw, hh).data;
      const srcMask = mc.getImageData(0, 0, hw, hh).data;
      /* A light separable box blur, so the dot sizes step rather than jump. */
      const F = new Float32Array(hw * hh);
      const T = new Float32Array(hw * hh);
      const rb = Math.max(1, Math.round(pitch * 0.22));
      for (let i = 0; i < F.length; i++) F[i] = src[i * 4 + 3] / 255;
      for (let y = 0; y < hh; y++) {
        for (let x = 0; x < hw; x++) {
          let s = 0;
          let n = 0;
          for (let k = -rb; k <= rb; k++) {
            const xx = x + k;
            if (xx < 0 || xx >= hw) continue;
            s += F[y * hw + xx];
            n++;
          }
          T[y * hw + x] = s / n;
        }
      }
      for (let y = 0; y < hh; y++) {
        for (let x = 0; x < hw; x++) {
          let s = 0;
          let n = 0;
          for (let k = -rb; k <= rb; k++) {
            const yy = y + k;
            if (yy < 0 || yy >= hh) continue;
            s += T[yy * hw + x];
            n++;
          }
          F[y * hw + x] = s / n;
        }
      }
      /* The screen itself: a lattice at 45 degrees, like newsprint. */
      const xs: number[] = [];
      const ys: number[] = [];
      const tones: number[] = [];
      const yns: number[] = [];
      const suns: number[] = [];
      const r2 = pitch / Math.SQRT2;
      const K = Math.ceil(Math.hypot(W, H) / pitch);
      const cx = W / 2;
      const cy = H / 2;
      for (let a = -K; a <= K; a++) {
        for (let b = -K; b <= K; b++) {
          const px = cx + (a - b) * r2;
          const py = cy + (a + b) * r2;
          if (px < -2 || px > W + 2 || py < -2 || py > H + 2) continue;
          const ix = clamp(Math.round(px / 2), 0, hw - 1);
          const iy = clamp(Math.round(py / 2), 0, hh - 1);
          xs.push(px);
          ys.push(py);
          tones.push(Math.min(1, F[iy * hw + ix] * 1.08));
          yns.push((H - py) / H);
          suns.push(srcMask[(iy * hw + ix) * 4 + 3] > 128 ? 1 : 0);
        }
      }
      X = Float32Array.from(xs);
      Y = Float32Array.from(ys);
      TONE = Float32Array.from(tones);
      YN = Float32Array.from(yns);
      SUN = Uint8Array.from(suns);
      cache = null;
    };

    /* ------------------------------ paint ------------------------------ */
    let lv = reduced() ? levelRef.current : 0;
    let prevLv = lv;
    let amp = 0;
    let cache: { lv: number; layers: Path2D[] } | null = null;

    const draw = () => {
      if (!ctx || !X) return;
      ctx.clearRect(0, 0, W, H);
      const level = lv / LEVEL_SLOTS;
      const rmax = pitch * 0.64;
      let layers = cache && cache.lv === lv && amp < 0.002 ? cache.layers : null;
      if (!layers) {
        layers = [new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D()];
        if (amp < 0.002) cache = { lv, layers };
        for (let i = 0; i < X.length; i++) {
          const tone = TONE[i];
          const yn = YN[i];
          const reach = dotReach(yn, level);
          const bump = dotBump(yn, level, amp);
          const r = dotRadius(rmax, dotValue(tone, reach, bump));
          if (r < 0.32) continue;
          const p = layers[dotLayer(tone, reach, bump, SUN[i] === 1)];
          p.moveTo(X[i] + r, Y[i]);
          p.arc(X[i], Y[i], r, 0, 6.2832);
        }
      }
      ctx.fillStyle = rgba(PAL.ink, PAL.dark ? 0.4 : 0.36);
      ctx.fill(layers[0]);
      ctx.fillStyle = rgba(mix(PAL.ink, PAL.wine, 0.6), PAL.dark ? 0.7 : 0.75);
      ctx.fill(layers[1]);
      ctx.fillStyle = rgba(PAL.wine, 1);
      ctx.fill(layers[2]);
      ctx.fillStyle = rgba(PAL.rust, 1);
      ctx.fill(layers[4]);
      ctx.fillStyle = rgba(PAL.gold, 1);
      ctx.fill(layers[3]);
    };

    /* ------------------------------ loop ------------------------------
       The loop exists only to walk the level toward its target and to run the
       ripple out; an idle builder costs no frames. */
    let raf = 0;
    let last = 0;
    let onscreen = true;
    let docVisible = !document.hidden;

    const settled = () => Math.abs(lv - levelRef.current) < 1e-3 && amp < 0.002;

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      lv = easeLevel(lv, levelRef.current, dt);
      const v = dt > 0 ? Math.abs(lv - prevLv) / dt : 0;
      prevLv = lv;
      amp += (clamp(v * 0.35, 0, 0.45) - amp) * (1 - Math.exp(-dt * 6));
      if (amp < 0.002) amp = 0;
      draw();
      if (!settled()) raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    /** Reach the target. Reduced motion jumps; otherwise the loop walks there. */
    const run = () => {
      if (!X) return;
      if (reduced()) {
        stop();
        lv = levelRef.current;
        prevLv = lv;
        amp = 0;
        draw();
        return;
      }
      if (!onscreen || !docVisible) {
        /* Off screen or in a hidden tab, land on the target without animating:
           nothing is there to watch the wave rise, and the next look must not
           show a stale level. */
        stop();
        lv = levelRef.current;
        prevLv = lv;
        amp = 0;
        draw();
        return;
      }
      if (settled()) {
        draw();
        return;
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    /* ---------------------------- listeners ---------------------------- */
    const fit = (cssW: number, cssH: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cssW;
      H = cssH;
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      const c = canvas.getContext("2d");
      if (!c) return;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx = c;
    };

    const ro = new ResizeObserver((entries) => {
      const r = entries[entries.length - 1].contentRect;
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      if (w === Math.round(W) && h === Math.round(H)) return;
      fit(w, h);
      build();
      run();
    });
    ro.observe(host);

    /* Threshold through clearsThreshold, never entry.isIntersecting: see @/lib/onscreen. */
    const io = new IntersectionObserver(
      (entries) => {
        onscreen = clearsThreshold(entries[entries.length - 1], 0.05);
        if (onscreen) run();
        else stop();
      },
      { threshold: 0.05 }
    );
    io.observe(host);

    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible) run();
      else stop();
    };
    const onMode = () => {
      readPalette();
      cache = null;
      draw();
    };
    const onReduce = () => {
      cache = null;
      run();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("cardon-mode", onMode);
    reduceMQ.addEventListener("change", onReduce);
    runRef.current = run;

    const first = host.getBoundingClientRect();
    fit(Math.round(first.width), Math.round(first.height));
    build();
    run();

    return () => {
      runRef.current = () => {};
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cardon-mode", onMode);
      reduceMQ.removeEventListener("change", onReduce);
    };
  }, []);

  /* A tick changes the prop, which has to reach the loop the effect above
     started. levelRef is already current by the time this runs (it is
     assigned during render), so this only asks the loop to go again. */
  useEffect(() => {
    runRef.current();
  }, [level]);

  return (
    <div className="pb-sunset" ref={hostRef} aria-hidden="true">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
