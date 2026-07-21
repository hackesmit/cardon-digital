"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed, full-viewport topographic contour field with one very slow light wash.
 * Ported from the desert-tech-v2 home concept. Pauses on document hidden and on
 * prefers-reduced-motion, redraws on resize, and re-reads CSS variables when the
 * mode toggle dispatches the "cardon-mode" event.
 */
export default function ContourField() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !canvas.getContext) return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;

    type RGB = [number, number, number];
    const WHITE: RGB = [255, 255, 255];

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
      primaryRgb: [63, 181, 138] as RGB,
      textRgb: [228, 234, 217] as RGB,
      secondaryRgb: [217, 168, 58] as RGB,
    };
    const readPalette = () => {
      PAL.primaryRgb = hexToRgb(cssVar("--primary") || "#3FB58A");
      PAL.textRgb = hexToRgb(cssVar("--text") || "#E4EAD9");
      PAL.secondaryRgb = hexToRgb(cssVar("--secondary") || "#D9A83A");
      PAL.dark = root.getAttribute("data-mode") !== "light";
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
    const makeBuffer = (cssW: number, cssH: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const b = document.createElement("canvas");
      b.width = Math.max(1, Math.round(cssW * dpr));
      b.height = Math.max(1, Math.round(cssH * dpr));
      const bctx = b.getContext("2d")!;
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { canvas: b, ctx: bctx };
    };

    let W = 0;
    let H = 0;
    let buf: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null =
      null;
    let raf = 0;
    let running = false;
    let last = 0;
    let t0 = 0;

    const cell = 38;
    const phase = 7.3;
    const fieldAt = (nx: number, ny: number) => {
      let v = 0;
      v += Math.sin(nx * 5.6 + phase * 0.15);
      v += Math.sin(ny * 4.7 - phase * 0.12) * 0.85;
      v += Math.sin(nx * 3.1 + ny * 3.8 + phase * 0.1) * 0.7;
      v += Math.sin(nx * 4.1 - ny * 3.0 - phase * 0.08) * 0.55;
      const dx = nx - 0.5;
      const dy = ny - 0.46;
      v += -5.2 * (dx * dx * 1.25 + dy * dy);
      return v;
    };

    const bake = () => {
      if (!buf) return;
      const b = buf.ctx;
      b.clearRect(0, 0, W, H);
      b.lineJoin = "round";
      b.lineCap = "round";
      const cols = Math.max(2, Math.ceil(W / cell));
      const rows = Math.max(2, Math.ceil(H / cell));
      const grid = new Float32Array((cols + 1) * (rows + 1));
      let i = 0;
      for (let gy = 0; gy <= rows; gy++) {
        const ny = (gy * cell) / H;
        for (let gx = 0; gx <= cols; gx++) grid[i++] = fieldAt((gx * cell) / W, ny);
      }
      const stride = cols + 1;
      const LEVEL_MIN = -6.2;
      const LEVEL_STEP = 0.7;
      const LEVEL_COUNT = 15;
      const minor = new Path2D();
      const major = new Path2D();
      const padPts: { x: number; y: number }[] = [];
      for (let li = 0; li < LEVEL_COUNT; li++) {
        const L = LEVEL_MIN + li * LEVEL_STEP;
        const path = li % 5 === 0 ? major : minor;
        for (let yy = 0; yy < rows; yy++) {
          const y0 = yy * cell;
          const y1 = y0 + cell;
          const base = yy * stride;
          for (let xx = 0; xx < cols; xx++) {
            const x0 = xx * cell;
            const x1 = x0 + cell;
            const idx = base + xx;
            const a = grid[idx];
            const bb = grid[idx + 1];
            const cc = grid[idx + stride + 1];
            const dd = grid[idx + stride];
            const cs =
              (a > L ? 1 : 0) |
              (bb > L ? 2 : 0) |
              (cc > L ? 4 : 0) |
              (dd > L ? 8 : 0);
            if (cs === 0 || cs === 15) continue;
            const tx = x0 + ((L - a) / ((bb - a) || 1e-6)) * cell;
            const ry = y0 + ((L - bb) / ((cc - bb) || 1e-6)) * cell;
            const bx = x0 + ((L - dd) / ((cc - dd) || 1e-6)) * cell;
            const ly = y0 + ((L - a) / ((dd - a) || 1e-6)) * cell;
            switch (cs) {
              case 1:
              case 14:
                path.moveTo(x0, ly);
                path.lineTo(tx, y0);
                break;
              case 2:
              case 13:
                path.moveTo(tx, y0);
                path.lineTo(x1, ry);
                break;
              case 3:
              case 12:
                path.moveTo(x0, ly);
                path.lineTo(x1, ry);
                break;
              case 4:
              case 11:
                path.moveTo(x1, ry);
                path.lineTo(bx, y1);
                break;
              case 6:
              case 9:
                path.moveTo(tx, y0);
                path.lineTo(bx, y1);
                break;
              case 7:
              case 8:
                path.moveTo(bx, y1);
                path.lineTo(x0, ly);
                break;
              case 5:
                path.moveTo(x0, ly);
                path.lineTo(tx, y0);
                path.moveTo(x1, ry);
                path.lineTo(bx, y1);
                break;
              case 10:
                path.moveTo(tx, y0);
                path.lineTo(x1, ry);
                path.moveTo(bx, y1);
                path.lineTo(x0, ly);
                break;
            }
            if (li % 5 === 0 && (xx + yy) % 11 === 0 && padPts.length < 14) {
              padPts.push({ x: tx, y: y0 });
            }
          }
        }
      }
      const minorA = PAL.dark ? 0.09 : 0.14;
      const majorA = PAL.dark ? 0.17 : 0.24;
      b.strokeStyle = rgba(PAL.primaryRgb, minorA);
      b.lineWidth = 1;
      b.stroke(minor);
      b.strokeStyle = rgba(mix(PAL.primaryRgb, PAL.textRgb, 0.25), majorA);
      b.lineWidth = 1.3;
      b.stroke(major);
      for (let q = 0; q < padPts.length; q++) {
        b.fillStyle = rgba(PAL.secondaryRgb, PAL.dark ? 0.2 : 0.26);
        b.beginPath();
        b.arc(padPts[q].x, padPts[q].y, 1.8, 0, Math.PI * 2);
        b.fill();
      }
    };

    const draw = (now: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      if (buf) ctx.drawImage(buf.canvas, 0, 0, W, H);
      const t = reduced() ? 0 : (now - t0) / 1000;
      const wx = (0.5 + 0.3 * Math.sin(t * 0.045)) * W;
      const wy = (0.42 + 0.24 * Math.cos(t * 0.037)) * H;
      const g = ctx.createRadialGradient(wx, wy, 0, wx, wy, Math.max(W, H) * 0.62);
      g.addColorStop(0, rgba(PAL.primaryRgb, PAL.dark ? 0.055 : 0.06));
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    const resize = () => {
      W = Math.max(1, window.innerWidth);
      H = Math.max(1, window.innerHeight);
      ctx = fitCanvas(canvas, W, H);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      buf = makeBuffer(W, H);
      bake();
      draw(performance.now());
    };

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 55) return;
      last = now;
      draw(now);
    };
    const canRun = () => !reduced() && docVisible;
    const start = () => {
      if (running || !canRun()) return;
      running = true;
      t0 = t0 || performance.now();
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

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 150);
    };
    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible) start();
      else stop();
    };
    const onMode = () => {
      readPalette();
      bake();
      draw(performance.now());
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        draw(performance.now());
      } else {
        start();
      }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("cardon-mode", onMode);
    reduceMQ.addEventListener("change", onReduceChange);

    t0 = performance.now();
    resize();
    if (!reduced()) start();

    return () => {
      stop();
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cardon-mode", onMode);
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, []);

  return <canvas id="field" ref={ref} aria-hidden="true" />;
}
