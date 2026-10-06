#!/usr/bin/env node
/**
 * palette-check: measures the six theme tokens per mode in app/globals.css
 * instead of trusting the numbers written in comments.
 *
 *   node scripts/palette-check.mjs            contrast floors block, CVD advises
 *   node scripts/palette-check.mjs --strict   CVD floors block too
 *
 * Exit 0 clean, 1 when a blocking floor fails, 2 when globals.css cannot be
 * parsed.
 *
 * THE ONE IDEA. Every colour on the site derives from six tokens per mode, so
 * a palette change is six hexes and the question "does text still read" has to
 * be answered by a script that reads the stylesheet, not by a reviewer with a
 * picker. Two kinds of floor:
 *
 *   Contrast (WCAG 2.1 relative luminance). Blocking. Each row is a token the
 *   site actually sets as text on a surface (ground, panel, and card, the
 *   panel lifted 10% toward text): body text, --primary-text as small text
 *   (kickers, details, links), --primary as display text and strokes (3:1),
 *   muted captions, CTA ink on energy, and the three chart series on the panel
 *   they sit in.
 *
 *   Usage (the stylesheets themselves). Blocking. A rule that paints text
 *   with var(--primary) or var(--tertiary) is only allowed for the display
 *   and non-text selectors listed in DISPLAY_PRIMARY; every other text use
 *   must go through --primary-text, which is what keeps the two tiers honest
 *   when someone adds a rule later. Parsed with a block regex over every
 *   stylesheet under app/ and components/; a selector list is split on
 *   commas and EVERY selector in it must be allowlisted, so an allowlisted
 *   selector cannot carry a small-text one past the gate. Enough for this
 *   codebase's flat CSS; a nested-CSS rewrite would need a real parser.
 *
 *   Separation (OKLab delta E, times 100, between the three chart series as
 *   derived in modulos.css and precios.css: --primary, --series-gold,
 *   --energy-bright). Reported for normal vision and for a deuteranope
 *   (Vienot 1999 projection in linear sRGB). Blocking, except for the pairs
 *   listed in ACCEPTED with the bead that accepted them; --strict ignores
 *   that list and is for the bead that closes the gap.
 *
 * Derived tokens are recomputed here the way globals.css derives them, in
 * sRGB with the same percentages, so the check moves if those percentages do.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const strict = process.argv.includes("--strict");
let css;
try {
  css = readFileSync(join(here, "..", "app", "globals.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
} catch (e) {
  console.error(`palette-check: cannot read app/globals.css (${e.code || e.message})`);
  process.exit(2);
}

const FLOOR = { text: 4.5, large: 3.0, cvdNormal: 14, cvdDeut: 10 };

function tokens(mode) {
  const blocks = [...css.matchAll(new RegExp(`:root\\[data-mode="${mode}"\\]\\s*\\{([^}]*)\\}`, "g"))].filter((b) => /--(ground|panel|text|primary|secondary|energy):/.test(b[1]));
  if (blocks.length !== 1) fail2(`expected exactly one ${mode} token block declaring the six tokens, found ${blocks.length}`);
  const block = blocks[0];
  for (const k of ["ground", "panel", "text", "primary", "secondary", "energy"]) {
    const times = (block[1].match(new RegExp(`--${k}:`, "g")) || []).length;
    if (times !== 1) fail2(`${mode} block declares --${k} ${times} times`);
  }
  const out = {};
  for (const m of block[1].matchAll(/--([a-z]+):\s*(#[0-9A-Fa-f]{6})/g)) out[m[1]] = m[2];
  for (const k of ["ground", "panel", "text", "primary", "secondary", "energy"]) {
    if (!out[k]) fail2(`${mode} block has no --${k}`);
  }
  return out;
}
/* Every token this check reads is declared a known number of times in
   globals.css; a later redeclaration would win in the browser and leave this
   check measuring a stale value, so the count is part of the contract. */
function declaredTimes(name, times) {
  const n = (css.match(new RegExp(`(^|[^-\\w])--${name}\\s*:`, "g")) || []).length;
  if (n !== times) fail2(`--${name} is declared ${n} time(s) in globals.css, expected ${times}`);
}
/* A derived token is only trusted when BOTH operands are the ones this check
   recomputes with and the second percentage, if written, is the complement of
   the first (color-mix normalises anything else); a change there must change
   this file too. */
function pct(name, from, toward, times = 1) {
  declaredTimes(name, times);
  const re = new RegExp(`--${name}:\\s*color-mix\\(in srgb, var\\(--${from}\\) (\\d+)%, var\\(--${toward}\\)(?: (\\d+)%)?\\)`, "g");
  const all = [...css.matchAll(re)];
  if (all.length !== 1) fail2(`expected exactly one --${name}: color-mix(in srgb, var(--${from}) N%, var(--${toward})), found ${all.length}`);
  const first = Number(all[0][1]);
  if (all[0][2] !== undefined && Number(all[0][2]) !== 100 - first) fail2(`--${name} mixes ${first}% with ${all[0][2]}%, which color-mix would renormalise; write the complement or omit it`);
  return first / 100;
}
function single(re, what) {
  const m = re.exec(css);
  if (!m) fail2(`no ${what} in globals.css`);
  return m[1];
}
function fail2(msg) {
  console.error(`palette-check: ${msg}`);
  process.exit(2);
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const toHex = (c) =>
  "#" + c.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
const mix = (a, b, w) => a.map((v, i) => v * w + b[i] * (1 - w));
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => {
  c = Math.max(0, Math.min(1, c));
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};
const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
function oklab([r, g, b]) {
  [r, g, b] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const dE = (a, b) => 100 * Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i]));
function deut([r, g, b]) {
  [r, g, b] = [lin(r), lin(g), lin(b)];
  return [gam(0.625 * r + 0.375 * g), gam(0.7 * r + 0.3 * g), gam(0.3 * g + 0.7 * b)];
}

declaredTimes("cta-ink", 1);
const ctaInk = hex(single(/--cta-ink:\s*(#[0-9A-Fa-f]{6})/, "--cta-ink"));
const mutedW = pct("muted", "text", "panel");
const energyBrightW = pct("energy-bright", "energy", "text");
declaredTimes("series-gold", 2);
const lightSeriesGold = single(/:root\[data-mode="light"\]\{--series-gold:(#[0-9A-Fa-f]{6});\}/, "light --series-gold override");
single(/^\s*--series-gold:\s*var\(--secondary\);/m, "--series-gold: var(--secondary) in :root");
for (const t of ["ground", "panel", "text", "primary", "secondary", "energy"]) declaredTimes(t, 2);
const cardW = pct("card", "panel", "text");
/* --primary-text is var(--primary) in :root; the dark block overrides it with a
   color-mix of primary toward text, whose percentage is read here. */
single(/^\s*--primary-text:\s*var\(--primary\);/m, "--primary-text: var(--primary) in :root");
const darkBlock = single(/:root\[data-mode="dark"\]\{([^}]*)\}/, "dark block");
if (!/--primary-text:\s*color-mix/.test(darkBlock)) fail2("dark block does not override --primary-text");
const darkPrimaryTextW = pct("primary-text", "primary", "text", 2);

/* Separation failures accepted on the record, as "mode pair vision": the
   bead names why. Everything else under the floor blocks. */
const ACCEPTED = new Map([
  ["light primary/energy-bright normal", "hq-x0h3: 13.0 against a floor of 14, a hair under; the wine and clay keep text labels"],
  ["light primary/energy-bright deuteranope", "hq-x0h3: 9.9 against a floor of 10"],
  ["dark primary/energy-bright normal", "hq-8dnn: dark series re-separation"],
  ["dark primary/energy-bright deuteranope", "hq-8dnn: dark series re-separation"],
  ["dark gold/energy-bright deuteranope", "hq-8dnn: dark series re-separation"],
]);

let blocking = 0;
let advisory = 0;
const row = (ok, kind, label, value, floor) => {
  const mark = ok ? "ok  " : kind === "block" ? "FAIL" : "warn";
  console.log(`  ${mark}  ${label.padEnd(44)} ${value.toFixed(2).padStart(6)}  floor ${floor}`);
  if (!ok) kind === "block" ? blocking++ : advisory++;
};

for (const mode of ["light", "dark"]) {
  const t = tokens(mode);
  const T = Object.fromEntries(Object.entries(t).map(([k, v]) => [k, hex(v)]));
  const muted = mix(T.text, T.panel, mutedW);
  const card = mix(T.panel, T.text, cardW);
  const energyBright = mix(T.energy, T.text, energyBrightW);
  const primaryText = mode === "dark" ? mix(T.primary, T.text, darkPrimaryTextW) : T.primary;
  const seriesGold = mode === "light" ? hex(lightSeriesGold) : T.secondary;

  console.log(`\n${mode}: ${Object.entries(t).map(([k, v]) => `${k} ${v}`).join("  ")}`);
  console.log(`  derived: primary-text ${toHex(primaryText)}  series-gold ${toHex(seriesGold)}  energy-bright ${toHex(energyBright)}  muted ${toHex(muted)}  card ${toHex(card)}`);

  const c = (a, b) => contrast(a, b);
  row(c(T.text, T.ground) >= 7, "block", "text on ground (body, AAA)", c(T.text, T.ground), 7);
  row(c(T.text, T.panel) >= 7, "block", "text on panel (card body, AAA)", c(T.text, T.panel), 7);
  row(c(primaryText, T.panel) >= FLOOR.text, "block", "primary-text on panel (details, links)", c(primaryText, T.panel), FLOOR.text);
  row(c(primaryText, T.ground) >= FLOOR.text, "block", "primary-text on ground (kickers)", c(primaryText, T.ground), FLOOR.text);
  row(c(primaryText, card) >= FLOOR.text, "block", "primary-text on card (module tags, prices)", c(primaryText, card), FLOOR.text);
  row(c(T.primary, T.panel) >= FLOOR.large, "block", "primary on panel (display, strokes, 3:1)", c(T.primary, T.panel), FLOOR.large);
  row(c(T.primary, T.ground) >= FLOOR.large, "block", "primary on ground (h1 accent, 3:1)", c(T.primary, T.ground), FLOOR.large);
  row(c(T.primary, card) >= FLOOR.large, "block", "primary on card (strokes, dots, 3:1)", c(T.primary, card), FLOOR.large);
  row(c(T.secondary, T.ground) >= FLOOR.text, "block", "secondary on ground (gold kickers)", c(T.secondary, T.ground), FLOOR.text);
  row(c(T.secondary, card) >= FLOOR.text, "block", "secondary on card (gold kickers)", c(T.secondary, card), FLOOR.text);
  row(c(muted, T.panel) >= FLOOR.large, "block", "muted on panel (mono captions, 3:1)", c(muted, T.panel), FLOOR.large);
  row(c(ctaInk, T.energy) >= FLOOR.text, "block", "cta ink on energy (buttons)", c(ctaInk, T.energy), FLOOR.text);
  row(c(energyBright, T.panel) >= FLOOR.text, "block", "energy-bright on panel (series, legend)", c(energyBright, T.panel), FLOOR.text);
  row(c(seriesGold, T.panel) >= FLOOR.large, "block", "series-gold on panel (series, 3:1)", c(seriesGold, T.panel), FLOOR.large);

  const series = { primary: T.primary, gold: seriesGold, "energy-bright": energyBright };
  const keys = Object.keys(series);
  const kindFor = (pair, vision) => (!strict && ACCEPTED.has(`${mode} ${pair} ${vision}`) ? "advise" : "block");
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const [a, b] = [series[keys[i]], series[keys[j]]];
      const pair = `${keys[i]}/${keys[j]}`;
      const n = dE(a, b);
      const d = dE(deut(a), deut(b));
      row(n >= FLOOR.cvdNormal, kindFor(pair, "normal"), `series ${pair}, normal dE`, n, FLOOR.cvdNormal);
      row(d >= FLOOR.cvdDeut, kindFor(pair, "deuteranope"), `series ${pair}, deuteranope dE`, d, FLOOR.cvdDeut);
    }
  }
}

/* Usage: text painted with the deep wine outside the display allowlist. */
const DISPLAY_PRIMARY = new Set([
  /* display text, 3:1 */
  "h1 .accent",
  ".pg-showcase .accent",
  ".pg-modulos .accent",
  ".pg-enkanto h2 .accent",
  /* icons, dots, bars and cores: SVG shapes, not text. A class here must never
     sit on an SVG <text>; the TSX scan below enforces that. */
  ".pg-winery .cap-glyph",
  ".pg-home .orbit-med",
  ".dm-knob-halo",
  ".dm-knob-core",
  ".ov-clean-fill circle",
  ".ov-bar-primary",
  ".tl-primary",
  ".map-hub-core",
  ".mk-core",
  ".map-marker:hover .mk-core",
  ".map-marker:focus-visible .mk-core",
  ".pg-home .sector-card:hover .mk-core",
  ".pg-home .sector-card:focus-visible .mk-core",
  ".pg-showcase .vc-dot[data-series=\"now\"]",
  ".pg-case .d-primary",
  ".pg-case .live-dot",
  ".pg-case .fin-bar",
  ".pg-enkanto .e-primary",
  ".pg-enkanto .e-fill",
]);
function cssFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "node_modules") continue;
    if (statSync(p).isDirectory()) cssFiles(p, out);
    else if (name.endsWith(".css")) out.push(p);
  }
  return out;
}
const root = join(here, "..");
/* color: paints HTML text, fill: paints SVG text (and shapes, which is what the
   allowlist's shape selectors are for). Property names are case-insensitive
   and may carry whitespace before the colon. */
const textPrimary = /(^|[^-])(color|fill)\s*:\s*var\(--(primary|tertiary|primary-bright)\)/i;
console.log("\nusage: text painted with var(--primary) outside the display allowlist");
let usageHits = 0;
for (const file of [...cssFiles(join(root, "app")), ...cssFiles(join(root, "components"))]) {
  const text = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!textPrimary.test(m[2])) continue;
    /* The text before this block's brace, after the previous block or at-rule
       brace, is the selector list; every member must be on the allowlist. */
    const list = m[1].replace(/^[\s\S]*\}/, "").trim();
    const selectors = list.split(",").map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);
    const bad = selectors.filter((s) => !DISPLAY_PRIMARY.has(s));
    if (selectors.length && !bad.length) continue;
    usageHits++;
    blocking++;
    console.log(`  FAIL  ${file.slice(root.length + 1)}  ${(bad.join(", ") || list) || "(empty selector)"}  paints with var(--primary) or var(--primary-bright); text goes through var(--primary-text), a shape goes on the allowlist`);
  }
}
if (!usageHits) console.log("  ok    none outside the allowlist");

/* TSX: an allowlisted shape class on an SVG <text>, and canvas text filled with
   the raw wine. The canvas scan tracks the last fillStyle assignment before
   each fillText, which is how every canvas in this codebase paints; an
   indirection (a variable holding PAL.primary) is not followed. */
function tsxFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "node_modules") continue;
    if (statSync(p).isDirectory()) tsxFiles(p, out);
    else if (name.endsWith(".tsx")) out.push(p);
  }
  return out;
}
const shapeClasses = new Set([...DISPLAY_PRIMARY].map((s) => s.split(/[\s:]/).pop().replace(/^\./, "")).filter((c) => /^[\w-]+$/.test(c)));
console.log("\ntsx: shape classes on <text>, and canvas text filled with PAL.primary");
let tsxHits = 0;
for (const file of [...tsxFiles(join(root, "app")), ...tsxFiles(join(root, "components"))]) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/<text\b[^>]*className=\{?["'\`]([^"'\`]*)["'\`]/g)) {
    const bad = m[1].split(/\s+/).filter((c) => shapeClasses.has(c));
    if (!bad.length) continue;
    tsxHits++;
    blocking++;
    console.log(`  FAIL  ${file.slice(root.length + 1)}  <text class="${m[1]}">  wears shape class ${bad.join(", ")}; text takes a --primary-text class`);
  }
  let lastFill = null;
  let lastLine = 0;
  text.split("\n").forEach((line, i) => {
    if (/fillStyle\s*=/.test(line)) {
      lastFill = line;
      lastLine = i + 1;
    }
    if (/fillText\(/.test(line) && lastFill && /PAL\.primary(?![A-Za-z])/.test(lastFill)) {
      tsxHits++;
      blocking++;
      console.log(`  FAIL  ${file.slice(root.length + 1)}:${i + 1}  fillText after fillStyle at line ${lastLine} uses PAL.primary; canvas text takes PAL.primaryText`);
    }
  });
}
if (!tsxHits) console.log("  ok    none");

console.log("");
if (blocking) {
  console.log(`palette-check: ${blocking} blocking floor(s) failed${strict ? " (strict)" : ""}.`);
  process.exit(1);
}
console.log(
  advisory
    ? `palette-check: contrast clean; ${advisory} separation floor(s) under, each accepted on the record (ACCEPTED in this file; --strict to block).`
    : "palette-check: clean.",
);
