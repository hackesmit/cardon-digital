/**
 * The three loose animations Daniel picked from the prototype page
 * (2026-10-01): Rejilla for the home, Vinedo for the wineries page, Hilos for
 * the path from an ad to a client. Each is a pure drawing: init() sizes its
 * buffers for the measured canvas, frame() advances and paints one frame from
 * the shared state. Nothing here touches the DOM, so the three can be run
 * against a recording context in a test.
 *
 * Every composition is derived from the measured width and height. `small` is
 * the phone composition, where the canvas is a band of its own under the copy
 * and never sits behind it.
 */

export type RGB = [number, number, number];

export interface FieldColors {
  agave: string;
  agaveRgb: RGB;
  gold: string;
  goldRgb: RGB;
  ground: string;
}

export interface FieldState {
  W: number;
  H: number;
  /** Seconds of animation time, and the step of this frame. */
  t: number;
  dt: number;
  /** Eased pointer, -1 to 1 from the centre. */
  mx: number;
  my: number;
  /** Eased and raw pointer in canvas pixels, and how present it is (0 to 1). */
  px: number;
  py: number;
  rpx: number;
  rpy: number;
  pin: number;
  /** Where the composition centres. */
  fx: number;
  fy: number;
  small: boolean;
  /** False while warming up: advance the state, paint nothing. */
  draw: boolean;
  dark: boolean;
  c: FieldColors;
}

export interface Field {
  /** The moment, in seconds, a still frame should show. */
  still: number;
  init(S: FieldState): void;
  frame(ctx: CanvasRenderingContext2D, S: FieldState): void;
}

export type FieldKind = "rejilla" | "vinedo" | "hilos";

const TAU = Math.PI * 2;
const rand = Math.random;
const clamp = (x: number, a: number, b: number) => (x < a ? a : x > b ? b : x);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
function sstep(a: number, b: number, x: number): number {
  x = (x - a) / (b - a);
  x = x < 0 ? 0 : x > 1 ? 1 : x;
  return x * x * (3 - 2 * x);
}
const rgba = (c: RGB, a: number) => "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";

/* ---------- simplex noise 3D (Gustavson), seeded so the hills never jump ---------- */
const perm = new Uint8Array(512);
const pm12 = new Uint8Array(512);
const grad3 = new Float32Array([
  1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1,
  0, 1, -1, 0, -1, -1,
]);
(function seed() {
  let s = 1337;
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    pm12[i] = perm[i] % 12;
  }
})();
const F3 = 1 / 3;
const G3 = 1 / 6;
export function noise3(xin: number, yin: number, zin: number): number {
  let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
  const s = (xin + yin + zin) * F3;
  const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
  const t = (i + j + k) * G3;
  const x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);
  let i1, j1, k1, i2, j2, k2;
  if (x0 >= y0) {
    if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
    else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
  } else {
    if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
    else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
    else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
  }
  const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
  const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
  const ii = i & 255, jj = j & 255, kk = k & 255;
  let g: number, tt: number;
  tt = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (tt > 0) { g = pm12[ii + perm[jj + perm[kk]]] * 3; tt *= tt; n0 = tt * tt * (grad3[g] * x0 + grad3[g + 1] * y0 + grad3[g + 2] * z0); }
  tt = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (tt > 0) { g = pm12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3; tt *= tt; n1 = tt * tt * (grad3[g] * x1 + grad3[g + 1] * y1 + grad3[g + 2] * z1); }
  tt = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (tt > 0) { g = pm12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3; tt *= tt; n2 = tt * tt * (grad3[g] * x2 + grad3[g + 1] * y2 + grad3[g + 2] * z2); }
  tt = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (tt > 0) { g = pm12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3; tt *= tt; n3 = tt * tt * (grad3[g] * x3 + grad3[g + 1] * y3 + grad3[g + 2] * z3); }
  return 32 * (n0 + n1 + n2 + n3);
}

/** Dots bucketed by alpha into L passes, one path per pass, so a thousand dots cost a few fills. */
function drawDots(
  ctx: CanvasRenderingContext2D, n: number,
  X: Float32Array, Y: Float32Array, R: Float32Array, A: Float32Array,
  col: string, L: number, amax: number,
): void {
  ctx.fillStyle = col;
  for (let b = 0; b < L; b++) {
    const lo = b / L, hi = (b + 1) / L;
    let any = false;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = A[i];
      if (a > lo && a <= hi) {
        const r = R[i];
        ctx.moveTo(X[i] + r, Y[i]);
        ctx.arc(X[i], Y[i], r, 0, TAU);
        any = true;
      }
    }
    if (any) {
      ctx.globalAlpha = (lo + hi) * 0.5 * amax;
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

/* =====================================================================
   Rejilla: a calm dot grid, two soft diagonal waves travel across it, the
   pointer drops ripples and one starts on its own every three seconds.
   ===================================================================== */
export function makeRejilla(): Field {
  let g = 24, n = 0, lastR = -9, lpx = 0, lpy = 0, auto = 0;
  let BX = new Float32Array(0), BY = BX, DX = BX, DY = BX, DR = BX, DA = BX, GA = BX;
  const rip: { x: number; y: number; t: number }[] = [];
  for (let q = 0; q < 7; q++) rip.push({ x: 0, y: 0, t: -99 });
  function addRip(x: number, y: number, t: number) {
    let o = rip[0];
    for (let i = 1; i < rip.length; i++) if (rip[i].t < o.t) o = rip[i];
    o.x = x; o.y = y; o.t = t;
  }
  return {
    still: 3.4,
    init(S) {
      g = S.small ? 21 : 25;
      const cols = Math.floor(S.W / g) + 2, rows = Math.floor(S.H / g) + 2;
      const ox = (S.W - (cols - 1) * g) / 2, oy = (S.H - (rows - 1) * g) / 2;
      n = cols * rows;
      BX = new Float32Array(n); BY = new Float32Array(n); DX = new Float32Array(n); DY = new Float32Array(n);
      DR = new Float32Array(n); DA = new Float32Array(n); GA = new Float32Array(n);
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { BX[j * cols + i] = ox + i * g; BY[j * cols + i] = oy + j * g; }
      for (let q = 0; q < rip.length; q++) rip[q].t = -99;
      auto = 1.6; lastR = -9;
    },
    frame(ctx, S) {
      const W = S.W, H = S.H, t = S.t;
      auto += S.dt;
      if (auto > 3.0) { auto = 0; addRip(S.fx + (rand() - 0.5) * W * 0.32, H * (0.28 + rand() * 0.44), t); }
      if (S.pin > 0.5 && t - lastR > 0.32) {
        const mdx = S.rpx - lpx, mdy = S.rpy - lpy;
        if (mdx * mdx + mdy * mdy > 900) { addRip(S.rpx, S.rpy, t); lastR = t; lpx = S.rpx; lpy = S.rpy; }
      }
      if (!S.draw) return;
      const dir = 0.42, ca = Math.cos(dir), sa = Math.sin(dir), Lp = W * ca + H * sa;
      const per = Math.max(900, Lp * 0.75 + 500), p1 = ((t * 165) % per) - 350;
      let p2 = p1 + per / 2;
      if (p2 > Lp + 350) p2 -= per;
      const sg = S.small ? 110 : 150;
      for (let i = 0; i < n; i++) {
        const x = BX[i], y = BY[i], pr = x * ca + y * sa, d1 = (pr - p1) / sg, d2 = (pr - p2) / sg;
        const e1 = Math.exp(-d1 * d1), e2 = Math.exp(-d2 * d2);
        let w = (e1 + e2) * 0.85 + 0.1 * (0.5 + 0.5 * Math.sin(pr * 0.011 - t * 0.9));
        const sh = e1 * (d1 < 0 ? -1 : 1) + e2 * (d2 < 0 ? -1 : 1);
        let ox = ca * sh * 3, oy = sa * sh * 3;
        for (let k = 0; k < 7; k++) {
          const r = rip[k], age = t - r.t;
          if (age < 0 || age > 3.4) continue;
          const dx = x - r.x, dy = y - r.y, d = Math.sqrt(dx * dx + dy * dy) + 0.001, e = (d - age * 230) / 28;
          if (e > 3 || e < -3) continue;
          const rw = Math.exp(-e * e) * (1 - age / 3.4);
          w += rw; ox += (dx / d) * rw * 5; oy += (dy / d) * rw * 5;
        }
        w = w > 1 ? 1 : w;
        DX[i] = x + ox; DY[i] = y + oy; DR[i] = 0.8 + 2.9 * w * w + 0.5 * w; DA[i] = 0.2 + 0.8 * w; GA[i] = sstep(0.8, 1, w);
      }
      drawDots(ctx, n, DX, DY, DR, DA, S.c.agave, 6, S.dark ? 0.95 : 0.85);
      for (let i = 0; i < n; i++) DR[i] *= 0.42;
      drawDots(ctx, n, DX, DY, DR, GA, S.c.gold, 3, 1);
    },
  };
}

/* =====================================================================
   Vinedo: dotted vine rows in perspective flowing toward the viewer, a low
   sun behind two ridges of hills.
   ===================================================================== */
export function makeVinedo(): Field {
  const zn = 0.85, zf = 34;
  let nR = 27, dz = 0.75, K = 0, n = 0, hY = 0, vx = 0, f = 1, OX = 0, OY = 0, T = 0;
  let DX = new Float32Array(0), DY = DX, DR = DX, DA = DX;
  const camH = 1.0;
  function P(X: number, z: number) {
    const bend = Math.sin(z * 0.075 + 0.6 + T * 0.03) * z * 0.1, gy = Math.sin(z * 0.14 - 1.0) * 0.24 * sstep(1, 6, z);
    OX = vx + ((X + bend) * f) / z;
    OY = hY + ((camH - gy) * f) / z;
  }
  return {
    still: 4,
    init(S) {
      nR = S.small ? 17 : 27;
      if (!(nR & 1)) nR++;
      dz = S.small ? 0.62 : 0.46;
      K = Math.ceil((zf - zn) / dz);
      n = nR * K;
      DX = new Float32Array(n); DY = new Float32Array(n); DR = new Float32Array(n); DA = new Float32Array(n);
    },
    frame(ctx, S) {
      if (!S.draw) return;
      const W = S.W, H = S.H, t = S.t;
      T = t;
      hY = H * (S.small ? 0.34 : 0.37) + S.my * 10;
      vx = S.fx + S.mx * 90;
      f = H * 0.8;
      const ag = S.c.agave, sp = 1.15 * (S.small ? 0.9 : 1);
      // sun glow and disc
      const gr = S.small ? W * 0.75 : W * 0.3;
      const g = ctx.createRadialGradient(vx, hY, 0, vx, hY, gr);
      g.addColorStop(0, rgba(S.c.goldRgb, S.dark ? 0.3 : 0.24));
      g.addColorStop(0.4, rgba(S.c.goldRgb, S.dark ? 0.09 : 0.07));
      g.addColorStop(1, rgba(S.c.goldRgb, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      const sr = Math.max(26, H * 0.075);
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, hY); ctx.clip();
      ctx.globalAlpha = S.dark ? 0.55 : 0.42;
      ctx.fillStyle = S.c.gold;
      ctx.beginPath(); ctx.arc(vx, hY - sr * 0.2, sr, 0, TAU); ctx.fill();
      ctx.restore();
      // two ridges of hills, the near one hides the foot of the sun
      for (let rdg = 0; rdg < 2; rdg++) {
        const amp = H * (rdg ? 0.09 : 0.15), off = rdg ? 3.7 : 11.2;
        ctx.beginPath(); ctx.moveTo(-10, hY + 1);
        for (let x = -10; x <= W + 10; x += 8) {
          const nn = noise3(x * 0.0032 + off, 0.5 + rdg, t * 0.008) * 0.5 + 0.5;
          ctx.lineTo(x, hY - (0.25 + 0.75 * nn) * amp * (0.55 + 0.45 * sstep(0, W * 0.5, Math.abs(x - vx))));
        }
        ctx.lineTo(W + 10, hY + 1); ctx.closePath();
        ctx.globalAlpha = 1; ctx.fillStyle = S.c.ground; ctx.fill();
        ctx.globalAlpha = rdg ? 0.32 : 0.16; ctx.strokeStyle = ag; ctx.lineWidth = 1; ctx.stroke();
      }
      // horizon
      const hg = ctx.createLinearGradient(0, 0, W, 0), vxn = clamp(vx / W, 0.05, 0.95);
      hg.addColorStop(0, rgba(S.c.agaveRgb, 0)); hg.addColorStop(vxn, rgba(S.c.agaveRgb, 0.45)); hg.addColorStop(1, rgba(S.c.agaveRgb, 0));
      ctx.globalAlpha = 1; ctx.strokeStyle = hg; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, hY + 0.5); ctx.lineTo(W, hY + 0.5); ctx.stroke();
      // row lines
      ctx.strokeStyle = ag;
      for (let band = 0; band < 2; band++) {
        ctx.beginPath();
        for (let j = 0; j < nR; j++) {
          const X = j - (nR - 1) / 2;
          for (let k = 0; k <= 18; k++) {
            const z = band ? 8 * Math.pow(zf / 8, k / 18) : zn * Math.pow(8 / zn, k / 18);
            P(X, z);
            if (k === 0) ctx.moveTo(OX, OY); else ctx.lineTo(OX, OY);
          }
        }
        ctx.globalAlpha = band ? 0.14 : 0.22; ctx.lineWidth = band ? 0.7 : 1; ctx.stroke();
      }
      // the vines: dots that flow toward the viewer along each row
      const span = zf - zn;
      let c = 0;
      for (let j = 0; j < nR; j++) {
        const X = j - (nR - 1) / 2;
        for (let k = 0; k < K; k++) {
          const q = (k * dz + t * sp + j * 0.37 * dz) % span, z = zf - q;
          P(X, z);
          DX[c] = OX; DY[c] = OY; DR[c] = clamp((0.03 * f) / z, 0.5, 4.2);
          DA[c] = sstep(zf, zf * 0.42, z) * sstep(zn, zn + 1.4, z);
          c++;
        }
      }
      drawDots(ctx, c, DX, DY, DR, DA, ag, 5, 0.9);
    },
  };
}

/* =====================================================================
   Hilos: thin threads run from scattered sources into one knot, then leave
   as a single slowly twisting cord. Each thread carries a travelling pulse.
   On the ads page this is the path from many searches to one client line.
   ===================================================================== */
export function makeHilos(): Field {
  const M1 = 34, M2 = 60, M = M1 + M2 + 1;
  let K = 0;
  let PX = new Float32Array(0), PY = PX, SA = PX, SR = PX, SPH = PX, BND = PX, PU = PX, PV = PX, SX = PX, SY = PX;
  let GD = new Uint8Array(0);
  const RX = new Float32Array(M2 + 1), RY = new Float32Array(M2 + 1), RNX = new Float32Array(M2 + 1), RNY = new Float32Array(M2 + 1);
  const TA = [0.22, 0.5, 0.95], TW = [1, 1.4, 1.8], TR = [[12, 7], [7, 3], [3, 0]];
  return {
    still: 6,
    init(S) {
      K = S.small ? 36 : 66;
      PX = new Float32Array(K * M); PY = new Float32Array(K * M);
      SA = new Float32Array(K); SR = new Float32Array(K); SPH = new Float32Array(K); BND = new Float32Array(K);
      PU = new Float32Array(K); PV = new Float32Array(K); SX = new Float32Array(K); SY = new Float32Array(K);
      GD = new Uint8Array(K);
      for (let i = 0; i < K; i++) {
        SA[i] = ((95 + rand() * 170) * Math.PI) / 180; SR[i] = 0.4 + Math.pow(rand(), 0.8) * 0.6; SPH[i] = rand() * TAU;
        BND[i] = rand() - 0.5; PU[i] = rand(); PV[i] = 0.07 + rand() * 0.07; GD[i] = rand() < 0.2 ? 1 : 0;
      }
    },
    frame(ctx, S) {
      const W = S.W, H = S.H, t = S.t;
      const Ax = S.small ? W * 0.46 : S.fx - W * 0.06;
      const Ay = H * 0.54 + (S.py - H * 0.5) * 0.14 * S.pin;
      const Ex = W + 40, Ey = H * 0.36 + S.my * 24, dxr = Ex - Ax;
      const q1x = Ax + dxr * 0.33, q1y = Ay - H * 0.16, q2x = Ax + dxr * 0.68, q2y = Ey + H * 0.14;
      for (let m = 0; m <= M2; m++) {
        const v = m / M2, iv = 1 - v;
        RX[m] = iv * iv * iv * Ax + 3 * iv * iv * v * q1x + 3 * iv * v * v * q2x + v * v * v * Ex;
        RY[m] = iv * iv * iv * Ay + 3 * iv * iv * v * q1y + 3 * iv * v * v * q2y + v * v * v * Ey;
        const tx = 3 * iv * iv * (q1x - Ax) + 6 * iv * v * (q2x - q1x) + 3 * v * v * (Ex - q2x);
        const ty = 3 * iv * iv * (q1y - Ay) + 6 * iv * v * (q2y - q1y) + 3 * v * v * (Ey - q2y);
        const tl = Math.sqrt(tx * tx + ty * ty) || 1;
        RNX[m] = -ty / tl; RNY[m] = tx / tl;
      }
      const rxS = S.small ? W * 0.5 : Math.min(W * 0.44, Ax - W * 0.06), ryS = H * 0.36;
      const t0x = -RNY[0], t0y = RNX[0];
      for (let i = 0; i < K; i++) {
        let sx = Ax + Math.cos(SA[i]) * SR[i] * rxS + Math.sin(t * 0.23 + SPH[i]) * 12;
        let sy = Ay + Math.sin(SA[i]) * SR[i] * ryS + Math.cos(t * 0.19 + SPH[i]) * 10;
        sx = clamp(sx, W * 0.05, W * 0.95); sy = clamp(sy, H * 0.12, H * 0.88);
        const ph = (i / K) * TAU + t * 0.45, off0 = 2.5 * Math.sin(ph), p3x = Ax + RNX[0] * off0, p3y = Ay + RNY[0] * off0;
        const lx = p3x - sx, ly = p3y - sy, len = Math.sqrt(lx * lx + ly * ly) || 1, lc = len * 0.42 + 30;
        const p1x = sx + lx * 0.35 - ly * BND[i] * 0.5, p1y = sy + ly * 0.35 + lx * BND[i] * 0.5;
        const p2x = p3x - t0x * lc, p2y = p3y - t0y * lc, b = i * M;
        for (let m = 0; m < M1; m++) {
          const u = m / M1, iu = 1 - u;
          PX[b + m] = iu * iu * iu * sx + 3 * iu * iu * u * p1x + 3 * iu * u * u * p2x + u * u * u * p3x;
          PY[b + m] = iu * iu * iu * sy + 3 * iu * iu * u * p1y + 3 * iu * u * u * p2y + u * u * u * p3y;
        }
        for (let m = 0; m <= M2; m++) {
          const vv = m / M2, h = (2.5 + 15 * vv * vv) * Math.sin(ph + vv * TAU * 2.4);
          PX[b + M1 + m] = RX[m] + RNX[m] * h; PY[b + M1 + m] = RY[m] + RNY[m] * h;
        }
        PU[i] += PV[i] * S.dt * 0.9;
        if (PU[i] > 1) PU[i] -= 1;
        SX[i] = sx; SY[i] = sy;
      }
      if (!S.draw) return;
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = S.c.agave; ctx.lineWidth = 0.9;
      ctx.globalAlpha = S.dark ? 0.42 : 0.4;
      for (let i = 0; i < K; i++) {
        const b = i * M;
        ctx.beginPath(); ctx.moveTo(PX[b], PY[b]);
        for (let m = 1; m < M; m++) ctx.lineTo(PX[b + m], PY[b + m]);
        ctx.stroke();
      }
      // sources
      ctx.globalAlpha = 0.6; ctx.fillStyle = S.c.agave; ctx.beginPath();
      for (let i = 0; i < K; i++) { ctx.moveTo(SX[i] + 1.9, SY[i]); ctx.arc(SX[i], SY[i], 1.9, 0, TAU); }
      ctx.fill();
      // pulses: a short tapered tail and a soft head
      for (let c = 0; c < 2; c++) {
        const col = c ? S.c.gold : S.c.agave;
        ctx.strokeStyle = col; ctx.fillStyle = col;
        for (let seg = 0; seg < 3; seg++) {
          ctx.beginPath();
          let any = false;
          for (let i = 0; i < K; i++) {
            if (GD[i] !== c) continue;
            const hi = Math.floor(PU[i] * (M - 1));
            let a0 = hi - TR[seg][0];
            const a1 = hi - TR[seg][1];
            if (a0 < 0) a0 = 0;
            if (a1 <= a0) continue;
            const b = i * M;
            ctx.moveTo(PX[b + a0], PY[b + a0]);
            for (let m = a0 + 1; m <= a1; m++) ctx.lineTo(PX[b + m], PY[b + m]);
            any = true;
          }
          if (any) { ctx.globalAlpha = TA[seg]; ctx.lineWidth = TW[seg]; ctx.stroke(); }
        }
        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          for (let i = 0; i < K; i++) {
            if (GD[i] !== c) continue;
            const hp = PU[i] * (M - 1), hi = Math.min(M - 2, Math.floor(hp)), fr = hp - hi, b = i * M;
            const hx = lerp(PX[b + hi], PX[b + hi + 1], fr), hy = lerp(PY[b + hi], PY[b + hi + 1], fr), rr = pass ? 1.8 : 5.5;
            ctx.moveTo(hx + rr, hy); ctx.arc(hx, hy, rr, 0, TAU);
          }
          ctx.globalAlpha = pass ? 1 : 0.16; ctx.fill();
        }
      }
      // the knot where they meet
      ctx.globalAlpha = 0.9; ctx.fillStyle = S.c.agave;
      ctx.beginPath(); ctx.arc(Ax, Ay, 3.2, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
    },
  };
}

export function makeField(kind: FieldKind): Field {
  return kind === "rejilla" ? makeRejilla() : kind === "vinedo" ? makeVinedo() : makeHilos();
}
