/**
 * Shared canvas + palette helpers for the home page client visuals.
 * Ported verbatim from the desert-tech-v2 home concept IIFE utilities so the
 * hero assembly and the sector map draw with identical geometry and colors.
 * Colors are re-read from the active CSS mode tokens; call readPalette again on
 * the "cardon-mode" event to recolor.
 */

export type RGB = [number, number, number];
export interface Pt {
  x: number;
  y: number;
}
export interface Trace {
  pts: Pt[];
  cum: number[];
  len: number;
}

export const MONO = 'ui-monospace, "SFMono-Regular", Consolas, monospace';
export const WHITE: RGB = [255, 255, 255];
export const BLACK: RGB = [12, 12, 12];

export function hexToRgb(raw: string): RGB {
  let h = raw.replace("#", "").trim();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h || "0", 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgba(c: RGB, a: number): string {
  return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
}

export function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export interface Palette {
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
  energySoft: string;
  energyBright: string;
  chipInk: string;
}

export function readPalette(root: HTMLElement): Palette {
  const cssVar = (name: string) =>
    getComputedStyle(root).getPropertyValue(name).trim();
  const ground = hexToRgb(cssVar("--ground") || "#0F1410");
  const panel = hexToRgb(cssVar("--panel") || "#16201A");
  const text = hexToRgb(cssVar("--text") || "#E4EAD9");
  const primary = hexToRgb(cssVar("--primary") || "#3FB58A");
  const secondary = hexToRgb(cssVar("--secondary") || "#D9A83A");
  const energy = hexToRgb(cssVar("--energy") || "#C3491B");
  const dark = root.getAttribute("data-mode") !== "light";
  const toward = dark ? WHITE : BLACK;
  return {
    dark,
    groundRgb: ground,
    ground: rgba(ground, 1),
    panelRgb: panel,
    panel: rgba(panel, 1),
    card: rgba(mix(panel, text, 0.08), 1),
    textRgb: text,
    ink: rgba(text, 1),
    dim: rgba(text, 0.74),
    faint: rgba(text, 0.34),
    muted: rgba(mix(text, panel, 0.5), 1),
    line: rgba(mix(primary, text, 0.35), 0.22),
    lineSoft: rgba(mix(primary, text, 0.35), 0.12),
    primaryRgb: primary,
    primary: rgba(primary, 1),
    primarySoft: rgba(primary, 0.85),
    primaryFaint: rgba(primary, 0.14),
    primaryDim: rgba(primary, 0.5),
    primaryBright: rgba(mix(primary, toward, 0.3), 1),
    secondaryRgb: secondary,
    secondary: rgba(secondary, 1),
    secondarySoft: rgba(secondary, 0.85),
    secondaryBright: rgba(mix(secondary, toward, 0.28), 1),
    energyRgb: energy,
    energy: rgba(energy, 1),
    energySoft: rgba(energy, 0.9),
    energyBright: rgba(mix(energy, toward, 0.25), 1),
    chipInk: rgba(mix(panel, BLACK, dark ? 0.35 : 0), 1),
  };
}

export function fitCanvas(
  canvas: HTMLCanvasElement,
  cssW: number,
  cssH: number
): CanvasRenderingContext2D {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.max(1, Math.round(cssW * dpr));
  canvas.height = Math.max(1, Math.round(cssH * dpr));
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

export function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  // Identity v3 (2026-08-27): corners are 2px everywhere and the pill is
  // retired, so the radius is clamped here rather than at every call site.
  r = Math.min(r, 2, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function easeInOut(t: number): number {
  t = clamp01(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function line(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function makeTrace(pts: Pt[]): Trace {
  const cum = [0];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    cum.push(total);
  }
  return { pts, cum, len: total };
}

export function dedupe(pts: Pt[]): Pt[] {
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = out[out.length - 1];
    const b = pts[i];
    if (Math.abs(a.x - b.x) > 0.01 || Math.abs(a.y - b.y) > 0.01) out.push(b);
  }
  return out;
}

export function pointAtLen(tr: Trace, L: number): Pt {
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
}

export function strokeTraceUpTo(
  ctx: CanvasRenderingContext2D,
  tr: Trace,
  L: number
): void {
  const pts = tr.pts;
  const cum = tr.cum;
  if (L <= 0) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    if (cum[i] <= L) {
      ctx.lineTo(pts[i].x, pts[i].y);
    } else {
      const seg = cum[i] - cum[i - 1];
      const t = (L - cum[i - 1]) / (seg || 1);
      ctx.lineTo(
        pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t,
        pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t
      );
      break;
    }
  }
  ctx.stroke();
}

export function drawFlow(
  ctx: CanvasRenderingContext2D,
  tr: Trace,
  L: number,
  trailCol: string,
  coreCol: string
): void {
  const trail = 40;
  const seg = 6;
  ctx.lineCap = "round";
  for (let k = 0; k < seg; k++) {
    const l1 = L - (trail * k) / seg;
    const l0 = L - (trail * (k + 1)) / seg;
    if (l1 < 0) break;
    const p0 = pointAtLen(tr, Math.max(0, l0));
    const p1 = pointAtLen(tr, Math.max(0, l1));
    ctx.globalAlpha = (1 - k / seg) * 0.85;
    ctx.strokeStyle = trailCol;
    ctx.lineWidth = 2.2 - k * 0.16;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
  const hp = pointAtLen(tr, L);
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = trailCol;
  ctx.beginPath();
  ctx.arc(hp.x, hp.y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = coreCol;
  ctx.beginPath();
  ctx.arc(hp.x, hp.y, 1.9, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}
