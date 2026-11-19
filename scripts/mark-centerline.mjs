#!/usr/bin/env node
/**
 * mark-centerline: turns the Cardon mark into the pen path that drew it.
 *
 *   node scripts/mark-centerline.mjs           rewrites components/site/markCenterline.ts
 *   node scripts/mark-centerline.mjs --check   fails when that file is out of date
 *   node scripts/mark-centerline.mjs --svg out.svg   writes a proof overlay
 *
 * WHY THIS EXISTS. DRAWING_D and SUN_D in components/site/Mark.tsx are filled
 * outlines: they trace the edge of the ink, not the path the pen took. Animate
 * stroke-dashoffset on an outline and the line crawls up one side of the
 * cactus and back down the other, which is what an outline is. A loader that
 * draws the mark the way a hand draws it needs the centerline.
 *
 * HOW. The outline is rasterised with the nonzero rule, thinned to one pixel
 * wide (Zhang-Suen), and the skeleton is walked into chains. The artwork is one
 * unbroken pen stroke that never touches itself, so the drawing's skeleton
 * comes back as a single open curve of about 2140 units, and the sun's as one
 * closed ring: no junctions, no sub-path sequencing, one continuous pen.
 *
 * The loader paints that centerline with a brush wide enough to cover the ink
 * and clips it to the outline, so what the visitor sees is the real hand-drawn
 * ink appearing under a moving pen rather than a smooth synthetic line. Two
 * measurements decide the brush width and are asserted here, because both have
 * a visible failure:
 *
 *   reach   the furthest any ink pixel sits from the centerline. A brush
 *           thinner than twice this leaves ink unpainted at the end of the
 *           draw, so the finished loader is not the mark.
 *   early   how far ahead of the pen any ink lights up. A brush wider than the
 *           gap where the stroke doubles back, at the notch between the cactus
 *           arm and the trunk, paints across the gap and reveals ink the pen
 *           has not reached. Measured in units of pen travel, against a stroke
 *           of about 1940, so a handful of units is below a frame of motion.
 *
 * Regenerate after any change to the artwork. scripts/mark-centerline.test.mjs
 * runs --check, so a changed mark with a stale centerline fails the suite.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SOURCE = join(ROOT, "components/site/Mark.tsx");
const TARGET = join(ROOT, "components/site/markCenterline.ts");

/** Raster pixels per artwork unit. Three keeps the thinning honest on a 13
    unit wide ink line and the whole run under a second. */
const SCALE = 3;
/** Flattening step for the outline curves, in artwork units. */
const FLATTEN_STEP = 0.5;
/** Douglas-Peucker tolerance, in artwork units. Under a fifth of the ink half
    width, so the simplified pen path stays inside the ink it paints. */
const SIMPLIFY = 0.6;

// ---------------------------------------------------------------- path input

function readPaths() {
  const src = readFileSync(SOURCE, "utf8");
  const grab = (name) => {
    const m = src.match(new RegExp("export const " + name + ' = "([^"]+)"'));
    if (!m) throw new Error("Mark.tsx no longer exports " + name);
    return m[1];
  };
  return { drawing: grab("DRAWING_D"), sun: grab("SUN_D") };
}

/** Flattens a path into closed polygons. The artwork uses M, C, c and z only. */
function flatten(d, step = FLATTEN_STEP) {
  const tokens = d.match(/[MmCcLlZz]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const polygons = [];
  let poly = null;
  let cur = [0, 0];
  let i = 0;
  let cmd = "";
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
    if (cmd === "M" || cmd === "m") {
      const x = num(), y = num();
      cur = cmd === "m" ? [cur[0] + x, cur[1] + y] : [x, y];
      poly = [cur.slice()];
      polygons.push(poly);
      cmd = cmd === "m" ? "l" : "L";
    } else if (cmd === "L" || cmd === "l") {
      const x = num(), y = num();
      cur = cmd === "l" ? [cur[0] + x, cur[1] + y] : [x, y];
      poly.push(cur.slice());
    } else if (cmd === "C" || cmd === "c") {
      const rel = cmd === "c";
      const p0 = cur;
      const read = () => {
        const x = num(), y = num();
        return rel ? [p0[0] + x, p0[1] + y] : [x, y];
      };
      const p1 = read(), p2 = read(), p3 = read();
      const rough = len(p0, p1) + len(p1, p2) + len(p2, p3);
      const n = Math.max(2, Math.ceil(rough / step));
      for (let k = 1; k <= n; k++) {
        const u = k / n, v = 1 - u;
        poly.push([
          v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0],
          v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1],
        ]);
      }
      cur = p3;
    } else if (cmd === "Z" || cmd === "z") {
      // The command token is already consumed above; a subpath closes by
      // returning the pen to its start, and the next M opens the next one.
      if (poly && poly.length) cur = poly[0].slice();
    } else throw new Error("unsupported path command: " + cmd);
  }
  return polygons;
}

const len = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// ------------------------------------------------------------------- raster

/** Scanline fill under the nonzero rule, sampled at pixel centres. */
function raster(polygons, scale = SCALE, pad = 4) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const poly of polygons) for (const [x, y] of poly) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  minX -= pad / scale;
  minY -= pad / scale;
  const w = Math.ceil((maxX - minX) * scale) + pad * 2;
  const h = Math.ceil((maxY - minY) * scale) + pad * 2;
  const edges = [];
  for (const poly of polygons) {
    for (let k = 0; k < poly.length; k++) {
      const a = poly[k], b = poly[(k + 1) % poly.length];
      if (a[1] !== b[1]) edges.push([a[0], a[1], b[0], b[1]]);
    }
  }
  const bits = new Uint8Array(w * h);
  const hits = [];
  for (let row = 0; row < h; row++) {
    const y = minY + (row + 0.5) / scale;
    hits.length = 0;
    for (const [x1, y1, x2, y2] of edges) {
      if ((y >= y1 && y < y2) || (y >= y2 && y < y1)) {
        hits.push([x1 + ((y - y1) / (y2 - y1)) * (x2 - x1), y2 > y1 ? 1 : -1]);
      }
    }
    if (!hits.length) continue;
    hits.sort((p, q) => p[0] - q[0]);
    let wind = 0;
    for (let k = 0; k < hits.length - 1; k++) {
      wind += hits[k][1];
      if (wind === 0) continue;
      const from = Math.max(0, Math.ceil((hits[k][0] - minX) * scale - 0.5));
      const to = Math.min(w, Math.ceil((hits[k + 1][0] - minX) * scale - 0.5));
      for (let col = from; col < to; col++) bits[row * w + col] = 1;
    }
  }
  return { w, h, scale, minX, minY, bits };
}

// ------------------------------------------------------------------ thinning

/** Zhang-Suen: erode the shape to a one pixel wide skeleton. */
function thin(grid) {
  const { w, h } = grid;
  const bits = Uint8Array.from(grid.bits);
  const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : bits[y * w + x]);
  const doomed = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (let pass = 0; pass < 2; pass++) {
      doomed.length = 0;
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        if (!bits[y * w + x]) continue;
        const p = [at(x, y - 1), at(x + 1, y - 1), at(x + 1, y), at(x + 1, y + 1),
                   at(x, y + 1), at(x - 1, y + 1), at(x - 1, y), at(x - 1, y - 1)];
        let on = 0, runs = 0;
        for (let k = 0; k < 8; k++) {
          on += p[k];
          if (!p[k] && p[(k + 1) % 8]) runs++;
        }
        if (on < 2 || on > 6 || runs !== 1) continue;
        const a = pass === 0 ? p[0] && p[2] && p[4] : p[0] && p[2] && p[6];
        const b = pass === 0 ? p[2] && p[4] && p[6] : p[0] && p[4] && p[6];
        if (a || b) continue;
        doomed.push(y * w + x);
      }
      if (doomed.length) changed = true;
      for (const k of doomed) bits[k] = 0;
    }
  }
  return { ...grid, bits };
}

const N8 = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

/**
 * Skeleton neighbours with staircase links dropped. Thinning leaves runs like
 * (0,0) (1,0) (1,1) where the diagonal pair is 8-adjacent as well as joined
 * through the pixel between them. Counted naively that reads as degree three
 * and turns every bend in the drawing into a junction. A diagonal counts only
 * when neither shared 4-neighbour already carries the connection.
 */
function neighbours(s, x, y) {
  const on = (nx, ny) => nx >= 0 && ny >= 0 && nx < s.w && ny < s.h && s.bits[ny * s.w + nx] === 1;
  const out = [];
  for (const [dx, dy] of N8) {
    const nx = x + dx, ny = y + dy;
    if (!on(nx, ny)) continue;
    if (dx !== 0 && dy !== 0 && (on(x + dx, y) || on(x, y + dy))) continue;
    out.push([nx, ny]);
  }
  return out;
}

/** Walks the skeleton into pixel chains, each running node to node. */
function chainsOf(s) {
  const { w, h, bits } = s;
  const degree = new Int8Array(w * h);
  const pixels = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!bits[y * w + x]) continue;
    degree[y * w + x] = neighbours(s, x, y).length;
    pixels.push([x, y]);
  }
  const seen = new Set();
  const edge = (x, y, nx, ny) => {
    const a = y * w + x, b = ny * w + nx;
    return Math.min(a, b) + ":" + Math.max(a, b);
  };
  const walk = (x0, y0, x1, y1) => {
    const chain = [[x0, y0]];
    let px = x0, py = y0, cx = x1, cy = y1;
    seen.add(edge(px, py, cx, cy));
    for (;;) {
      chain.push([cx, cy]);
      if (degree[cy * w + cx] !== 2) break;
      const next = neighbours(s, cx, cy).filter(([nx, ny]) => !(nx === px && ny === py));
      if (!next.length) break;
      const [nx, ny] = next[0];
      if (seen.has(edge(cx, cy, nx, ny))) break;
      seen.add(edge(cx, cy, nx, ny));
      px = cx; py = cy; cx = nx; cy = ny;
    }
    return chain;
  };
  const chains = [];
  for (const [x, y] of pixels) {
    if (degree[y * w + x] === 2) continue;
    for (const [nx, ny] of neighbours(s, x, y)) {
      if (!seen.has(edge(x, y, nx, ny))) chains.push(walk(x, y, nx, ny));
    }
  }
  // A ring has no node to start from, so pick any pixel and come back around.
  for (const [x, y] of pixels) {
    const open = neighbours(s, x, y).filter(([nx, ny]) => !seen.has(edge(x, y, nx, ny)));
    if (open.length) chains.push(walk(x, y, open[0][0], open[0][1]));
  }
  return chains;
}

// ------------------------------------------------------------- pen path shape

const pathLength = (pts) => {
  let total = 0;
  for (let k = 1; k < pts.length; k++) total += len(pts[k], pts[k - 1]);
  return total;
};

/** Douglas-Peucker, iterative so a 4000 point chain cannot blow the stack. */
function simplify(pts, tolerance) {
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [from, to] = stack.pop();
    if (to - from < 2) continue;
    const [ax, ay] = pts[from], [bx, by] = pts[to];
    const dx = bx - ax, dy = by - ay;
    const norm = Math.hypot(dx, dy) || 1;
    let worst = -1, at = -1;
    for (let k = from + 1; k < to; k++) {
      const d = Math.abs((pts[k][0] - ax) * dy - (pts[k][1] - ay) * dx) / norm;
      if (d > worst) { worst = d; at = k; }
    }
    if (worst <= tolerance) continue;
    keep[at] = 1;
    stack.push([from, at], [at, to]);
  }
  return pts.filter((_, k) => keep[k]);
}

/**
 * Rounds a polyline into a smooth path: each corner becomes the control point
 * of a quadratic that runs between the midpoints of its two segments. The curve
 * stays inside the corner it rounds, so a pen path simplified to within a fifth
 * of the ink half width cannot be smoothed out of the ink.
 */
function smoothPath(pts, closed) {
  const f = (n) => Number(n.toFixed(1)).toString();
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if (pts.length < 3) return "M" + pts.map((p) => f(p[0]) + " " + f(p[1])).join("L");
  const out = [];
  if (closed) {
    const start = mid(pts[pts.length - 1], pts[0]);
    out.push("M" + f(start[0]) + " " + f(start[1]));
    for (let k = 0; k < pts.length; k++) {
      const end = mid(pts[k], pts[(k + 1) % pts.length]);
      out.push("Q" + f(pts[k][0]) + " " + f(pts[k][1]) + " " + f(end[0]) + " " + f(end[1]));
    }
    out.push("Z");
  } else {
    out.push("M" + f(pts[0][0]) + " " + f(pts[0][1]));
    for (let k = 1; k < pts.length - 1; k++) {
      const end = mid(pts[k], pts[k + 1]);
      out.push("Q" + f(pts[k][0]) + " " + f(pts[k][1]) + " " + f(end[0]) + " " + f(end[1]));
    }
    // From the last midpoint the only thing left is the run out to the final
    // point, and a quadratic on a two point run is that straight line.
    const tail = pts[pts.length - 1];
    out.push("L" + f(tail[0]) + " " + f(tail[1]));
  }
  return out.join("");
}

/** Samples the smoothed path back into points, for length and coverage. */
function samplePath(pts, closed, per = 6) {
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const quad = (p0, c, p1) => {
    const out = [];
    for (let k = 1; k <= per; k++) {
      const u = k / per, v = 1 - u;
      out.push([
        v * v * p0[0] + 2 * v * u * c[0] + u * u * p1[0],
        v * v * p0[1] + 2 * v * u * c[1] + u * u * p1[1],
      ]);
    }
    return out;
  };
  if (pts.length < 3) return pts.slice();
  const out = [];
  if (closed) {
    let cur = mid(pts[pts.length - 1], pts[0]);
    out.push(cur);
    for (let k = 0; k < pts.length; k++) {
      const end = mid(pts[k], pts[(k + 1) % pts.length]);
      out.push(...quad(cur, pts[k], end));
      cur = end;
    }
  } else {
    let cur = pts[0];
    out.push(cur);
    for (let k = 1; k < pts.length - 1; k++) {
      const end = mid(pts[k], pts[k + 1]);
      out.push(...quad(cur, pts[k], end));
      cur = end;
    }
    out.push(pts[pts.length - 1]);
  }
  return out;
}

// -------------------------------------------------------------- measurements

/** A grid index over the pen path, so the two measurements stay linear. */
function index(points, cell) {
  const buckets = new Map();
  points.forEach((p, i) => {
    const key = Math.floor(p[0] / cell) + ":" + Math.floor(p[1] / cell);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(i); else buckets.set(key, [i]);
  });
  return {
    near(x, y) {
      const cx = Math.floor(x / cell), cy = Math.floor(y / cell);
      const out = [];
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        const bucket = buckets.get((cx + dx) + ":" + (cy + dy));
        if (bucket) out.push(...bucket);
      }
      return out;
    },
    cell,
  };
}

/** How far the furthest ink pixel sits from the pen path, in artwork units. */
function reach(grid, samples) {
  const idx = index(samples, 24);
  let worst = 0, at = null;
  for (let row = 0; row < grid.h; row++) for (let col = 0; col < grid.w; col++) {
    if (!grid.bits[row * grid.w + col]) continue;
    const x = grid.minX + (col + 0.5) / grid.scale;
    const y = grid.minY + (row + 0.5) / grid.scale;
    let best = Infinity;
    for (const i of idx.near(x, y)) {
      const d = (samples[i][0] - x) ** 2 + (samples[i][1] - y) ** 2;
      if (d < best) best = d;
    }
    if (best === Infinity) {
      for (const p of samples) {
        const d = (p[0] - x) ** 2 + (p[1] - y) ** 2;
        if (d < best) best = d;
      }
    }
    best = Math.sqrt(best);
    if (best > worst) { worst = best; at = [x, y]; }
  }
  return { reach: worst, at };
}

/**
 * How much ink lights up before the pen gets to it, in units of pen travel.
 *
 * The brush is wider than the ink, so where the stroke doubles back on itself,
 * at the notch between the cactus arm and the trunk, it can paint across the
 * gap and reveal ink that belongs to a later moment in the draw. This measures
 * that directly rather than guessing at it from clearances: for every ink
 * pixel, the earliest point along the pen path whose brush covers it, against
 * the point that actually owns it.
 */
function earlyReveal(grid, samples, radius, closed) {
  const arc = [0];
  for (let k = 1; k < samples.length; k++) arc.push(arc[k - 1] + len(samples[k], samples[k - 1]));
  // The ring closes, so its last ink sits under the pen's opening dot. That is
  // the seam, not an early reveal, and the shorter way round says so.
  const total = arc[arc.length - 1] + (closed ? len(samples[0], samples[samples.length - 1]) : 0);
  const ahead = (owner, first) => (closed ? Math.min(owner - first, total - (owner - first)) : owner - first);
  const idx = index(samples, Math.max(24, radius * 2));
  let worst = 0, at = null;
  for (let row = 0; row < grid.h; row++) for (let col = 0; col < grid.w; col++) {
    if (!grid.bits[row * grid.w + col]) continue;
    const x = grid.minX + (col + 0.5) / grid.scale;
    const y = grid.minY + (row + 0.5) / grid.scale;
    let owner = -1, best = Infinity, first = Infinity;
    for (const i of idx.near(x, y)) {
      const d = Math.hypot(samples[i][0] - x, samples[i][1] - y);
      if (d < best) { best = d; owner = i; }
      if (d <= radius && arc[i] < first) first = arc[i];
    }
    if (owner < 0 || first === Infinity) continue;
    const early = ahead(arc[owner], first);
    if (early > worst) { worst = early; at = [x, y]; }
  }
  return { early: worst, earlyAt: at };
}

// ------------------------------------------------------------------ assembly

function penPath(d, { closed, start }) {
  const grid = raster(flatten(d));
  const chains = chainsOf(thin(grid));
  chains.sort((a, b) => pathLength(b) - pathLength(a));
  if (chains.length !== 1) {
    throw new Error("expected one skeleton chain, found " + chains.length +
      ": the artwork now branches or breaks, so the loader needs a sequence of strokes");
  }
  const toUnits = ([x, y]) => [grid.minX + (x + 0.5) / grid.scale, grid.minY + (y + 0.5) / grid.scale];
  let pts = chains[0].map(toUnits);
  if (closed) {
    // One pixel of the ring is walked twice, so drop the repeat before rotating.
    if (len(pts[0], pts[pts.length - 1]) < 2 / grid.scale) pts.pop();
    let best = 0, bestD = Infinity;
    pts.forEach((p, i) => {
      const d = len(p, start);
      if (d < bestD) { bestD = d; best = i; }
    });
    pts = pts.slice(best).concat(pts.slice(0, best));
    // Draw the ring the way a hand closes a circle: away from the pen's last
    // position, which means the half nearest the start point comes last.
    const quarter = pts[Math.floor(pts.length / 4)];
    if (len(quarter, start) > len(pts[Math.floor((pts.length * 3) / 4)], start)) pts.reverse();
  } else if (len(pts[0], start) > len(pts[pts.length - 1], start)) {
    pts.reverse();
  }
  const simple = simplify(pts, SIMPLIFY);
  const samples = samplePath(simple, closed);
  return {
    d: smoothPath(simple, closed),
    points: simple,
    samples,
    length: pathLength(closed ? samples.concat([samples[0]]) : samples),
    grid,
    ...reach(grid, samples),
  };
}

function build() {
  const art = readPaths();
  // The pen starts at the foot of the cactus, the left end of the ground line,
  // and runs left to right: up and around the saguaro, east along the ground,
  // over the mountain, out to the right edge.
  const line = penPath(art.drawing, { closed: false, start: [116, 543] });
  const tail = line.points[line.points.length - 1];
  const sun = penPath(art.sun, { closed: true, start: tail });
  return { line, sun };
}

function render({ line, sun }) {
  const reach = Math.max(line.reach, sun.reach);
  const brush = Math.ceil(reach * 2 + 2);
  const lineEarly = earlyReveal(line.grid, line.samples, brush / 2, false);
  const sunEarly = earlyReveal(sun.grid, sun.samples, brush / 2, true);
  const early = Math.max(lineEarly.early, sunEarly.early);
  // A tenth of a second of pen travel at the loader's pace, which is the point
  // where a strand lighting up early stops being a rounding error and starts
  // being something the eye can follow.
  const EARLY_LIMIT = line.length / 20;
  if (early > EARLY_LIMIT) {
    throw new Error("a brush " + brush + " units wide reveals ink " + early.toFixed(1) +
      " units of pen travel early, over the limit of " + EARLY_LIMIT.toFixed(1));
  }
  const n = (x) => Number(x.toFixed(1));
  return `// GENERATED by scripts/mark-centerline.mjs. Do not edit by hand:
// run \`node scripts/mark-centerline.mjs\` after any change to the artwork in
// Mark.tsx, and scripts/mark-centerline.test.mjs will tell you when you forgot.
//
// The pen path behind the mark. DRAWING_D and SUN_D are filled outlines, so
// drawing them with stroke-dashoffset runs up one side of the ink and back down
// the other. These are their centrelines, recovered from the artwork itself,
// and MarkLoader paints them with a brush ${brush} units wide clipped to the
// outline: the visitor sees the real hand-drawn ink, with its wobble and its
// tapers, appearing under a moving pen.
//
// Measured on generation, in artwork units:
//   ink reach from the pen path   ${n(reach)}  (the brush covers it with ${n(brush / 2 - reach)} to spare)
//   ink revealed ahead of the pen ${n(early)}  of pen travel, out of ${n(line.length)}
//   pen path length               line ${n(line.length)}, sun ${n(sun.length)}
//
// Both paths carry pathLength="1" in the component, so the dash animation works
// in fractions of the stroke and nothing here has to be kept in sync with CSS.

/** The cactus, mountain and ground line, as one unbroken pen stroke. */
export const MARK_LINE_D =
  "${line.d}";

/** The sun, a closed ring drawn after the line. */
export const MARK_SUN_D =
  "${sun.d}";

/** Brush width that covers the ink, in the artwork's units. */
export const MARK_BRUSH = ${brush};

/** Pen path lengths, for pacing one stroke against the other. */
export const MARK_LINE_LENGTH = ${n(line.length)};
export const MARK_SUN_LENGTH = ${n(sun.length)};
`;
}

function overlay(art, { line, sun }) {
  const stroke = (p, colour) =>
    `<path d="${p.d}" fill="none" stroke="${colour}" stroke-width="1.4"/>` +
    `<circle cx="${p.points[0][0]}" cy="${p.points[0][1]}" r="5" fill="#1b7"/>` +
    `<circle cx="${p.points[p.points.length - 1][0]}" cy="${p.points[p.points.length - 1][1]}" r="5" fill="#d12"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="116 233 796 310" width="1592" height="620">
<rect x="0" y="0" width="1600" height="700" fill="#fff"/>
<g fill="#d8d2d4"><path d="${art.drawing}"/><path d="${art.sun}"/></g>
${stroke(line, "#b3123a")}
${stroke(sun, "#1452b8")}
</svg>`;
}

const args = process.argv.slice(2);
const built = build();
const text = render(built);
if (args.includes("--svg")) {
  const out = args[args.indexOf("--svg") + 1];
  writeFileSync(out, overlay(readPaths(), built));
  console.log("wrote " + out);
}
if (args.includes("--check")) {
  const current = readFileSync(TARGET, "utf8");
  if (current !== text) {
    console.error("components/site/markCenterline.ts is stale. Run: node scripts/mark-centerline.mjs");
    process.exit(1);
  }
  console.log("markCenterline.ts matches the artwork");
} else if (!args.includes("--svg")) {
  writeFileSync(TARGET, text);
  console.log("wrote components/site/markCenterline.ts");
}
