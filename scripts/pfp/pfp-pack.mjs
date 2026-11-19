// Cardon Digital profile picture pack for Instagram (bead hq-ljapb).
//
// Instagram shows a profile picture at 320 x 320, cropped to a circle; it
// takes a 1080 x 1080 upload and scales it down. Every variation is exported
// at both sizes, plus the SVG it was rendered from. The mark sits inside the
// circle's safe area (80 percent of the width) so the crop never cuts it.
//
// Art comes from the site's own files, nothing redrawn:
//   - the official colour logo, public/brand/cardon-icon-color.svg (traced
//     artwork with its black frame), placed whole as a badge;
//   - the saguaro line from public/brand/cardon-app-icon-dark.svg (the path
//     and clip of the official logo, thickened for small sizes), recoloured.
// Every hex is read from public/brand/*.svg or app/globals.css; the test
// fails on a colour that is not in those files.
//
// Usage: node scripts/pfp/pfp-pack.mjs <out-dir>
//   (needs sharp: resolve it from the rig's node_modules)

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SIZE = 1080;
export const SMALL = 320;
/** Diameter of the safe circle, as a share of the width. */
export const SAFE = 0.8;

const LOGO = "official colour logo (public/brand/cardon-icon-color.svg)";
const SITE_DARK = "site dark mode (app/globals.css)";
const SITE_LIGHT = "site light mode (app/globals.css)";
const APP_ICON = "app icons (public/brand/cardon-app-icon-*.svg)";

/**
 * kind "color": the official colour badge on a background.
 * kind "line": the saguaro line in fg on bg.
 * bg null: transparent PNG.
 */
export const VARIATIONS = [
  { slug: "color-on-logo-ground", kind: "color", bg: "#2B131E", label: "Colour logo on its wine ground", source: LOGO },
  { slug: "color-on-black", kind: "color", bg: "#000000", label: "Colour logo on its black frame colour", source: LOGO },
  { slug: "color-on-cream", kind: "color", bg: "#F9E4DD", label: "Colour logo on the cactus cream", source: LOGO },
  { slug: "color-on-wine", kind: "color", bg: "#B2526B", label: "Colour logo on the hill wine", source: LOGO },
  { slug: "color-on-sun", kind: "color", bg: "#F8AD48", label: "Colour logo on the sun gold", source: LOGO },
  { slug: "color-transparent", kind: "color", bg: null, label: "Colour logo, transparent background", source: LOGO },
  { slug: "cream-on-logo-ground", kind: "line", fg: "#F9E4DD", bg: "#2B131E", label: "Cream cactus on wine ground", source: LOGO },
  { slug: "logo-ground-on-cream", kind: "line", fg: "#2B131E", bg: "#F9E4DD", label: "Wine-ground cactus on cream", source: LOGO },
  { slug: "cream-on-wine", kind: "line", fg: "#F9E4DD", bg: "#B2526B", label: "Cream cactus on hill wine", source: LOGO },
  { slug: "sun-on-logo-ground", kind: "line", fg: "#F8AD48", bg: "#2B131E", label: "Sun-gold cactus on wine ground", source: LOGO },
  { slug: "logo-ground-on-sun", kind: "line", fg: "#2B131E", bg: "#F8AD48", label: "Wine-ground cactus on sun gold", source: LOGO },
  { slug: "site-text-on-dark", kind: "line", fg: "#EFE4E6", bg: "#120F12", label: "Site dark: text on ground", source: SITE_DARK },
  { slug: "site-wine-on-dark", kind: "line", fg: "#BD5268", bg: "#120F12", label: "Site dark: wine on ground", source: SITE_DARK },
  { slug: "site-brass-on-dark", kind: "line", fg: "#D1AC55", bg: "#120F12", label: "Site dark: brass on ground", source: SITE_DARK },
  { slug: "site-wine-on-light", kind: "line", fg: "#7A1F38", bg: "#F4EDEA", label: "Site light: wine on ground", source: SITE_LIGHT },
  { slug: "site-ink-on-light", kind: "line", fg: "#221418", bg: "#FFFCFB", label: "Site light: ink on panel", source: SITE_LIGHT },
  { slug: "site-white-on-wine", kind: "line", fg: "#FFFCFB", bg: "#7A1F38", label: "Site: button ink on wine", source: SITE_LIGHT },
  { slug: "site-white-on-clay", kind: "line", fg: "#FFFCFB", bg: "#B4561A", label: "Site: button ink on clay", source: SITE_LIGHT },
  { slug: "site-ink-on-brass", kind: "line", fg: "#221418", bg: "#D1AC55", label: "Site: ink on brass", source: SITE_DARK },
  { slug: "app-light-on-dark", kind: "line", fg: "#F4EFE8", bg: "#161A1B", label: "App icon dark: light on charcoal", source: APP_ICON },
  { slug: "app-dark-on-light", kind: "line", fg: "#1D1D1B", bg: "#F4EFE8", label: "App icon light: ink on off-white", source: APP_ICON },
  { slug: "mono-black-on-white", kind: "line", fg: "#000000", bg: "#FFFFFF", label: "Monochrome: black on white", source: "monochrome" },
  { slug: "mono-white-on-black", kind: "line", fg: "#FFFFFF", bg: "#000000", label: "Monochrome: white on black", source: "monochrome" },
  { slug: "transparent-dark", kind: "line", fg: "#1D1D1B", bg: null, label: "Dark cactus, transparent background", source: "line logo ink (public/brand/cardon-logo.svg)" },
  { slug: "transparent-light", kind: "line", fg: "#F4EFE8", bg: null, label: "Light cactus, transparent background", source: APP_ICON },
];

/** Hex codes that may appear: every hex in the brand SVGs and the site tokens, plus pure black and white. */
export function brandHexes(root = ROOT) {
  const files = [
    "app/globals.css",
    "public/brand/cardon-icon-color.svg",
    "public/brand/cardon-app-icon-dark.svg",
    "public/brand/cardon-app-icon-light.svg",
    "public/brand/cardon-logo.svg",
  ];
  const set = new Set(["#000000", "#FFFFFF"]);
  for (const f of files) {
    for (const m of readFileSync(join(root, f), "utf8").matchAll(/#([0-9A-Fa-f]{6})\b/g)) set.add(`#${m[1].toUpperCase()}`);
    for (const m of readFileSync(join(root, f), "utf8").matchAll(/"#([0-9A-Fa-f]{3})"/g)) {
      set.add(`#${[...m[1]].map((c) => c + c).join("").toUpperCase()}`);
    }
  }
  return set;
}

function lin(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
export function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}
/** WCAG contrast ratio of two hex colours. */
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** The saguaro line: path, clip rect and stroke, read from the app icon. */
export function loadCactus(root = ROOT) {
  const svg = readFileSync(join(root, "public/brand/cardon-app-icon-dark.svg"), "utf8");
  const clip = svg.match(/<clipPath id="cactus"><rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"\/>/);
  const path = svg.match(/<path [^>]*stroke-width="([\d.]+)"[^>]*\sd="([^"]+)"/);
  if (!clip || !path) throw new Error("cactus path or clip not found in cardon-app-icon-dark.svg");
  const [x, y, w, h] = clip.slice(1).map(Number);
  return { clip: { x, y, w, h }, stroke: Number(path[1]), d: path[2] };
}

/** The colour logo's inner markup and viewBox, read from the icon file. */
export function loadColorLogo(root = ROOT) {
  const svg = readFileSync(join(root, "public/brand/cardon-icon-color.svg"), "utf8");
  const vb = svg.match(/viewBox="([-\d. ]+)"/)[1].split(/\s+/).map(Number);
  const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<title>[\s\S]*?<\/title>/, "");
  return { viewBox: vb, inner };
}

/**
 * Largest square side whose rounded-square badge (corner radius ratio r)
 * fits inside the safe circle, measured at its rounded corner.
 * Corner arc centre sits at (s/2 - rs) on both axes; the farthest point is
 * that distance times sqrt 2 plus rs.
 */
export function badgeSide(size = SIZE, safe = SAFE, rRatio = 64 / 392) {
  const radius = (size * safe) / 2;
  return (2 * radius) / (Math.SQRT2 * (1 - 2 * rRatio) + 2 * rRatio);
}

const bgRect = (bg) => (bg ? `<rect width="${SIZE}" height="${SIZE}" fill="${bg}"/>` : "");

/**
 * SVG for one variation. bbox: the saguaro's drawn extent in source units
 * ({x, y, w, h}), measured by render; it is centred and scaled so its
 * diagonal equals the safe circle's diameter.
 */
export function variationSvg(v, art) {
  const head = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" role="img" aria-label="Cardon Digital"><title>Cardon Digital</title>`;
  if (v.kind === "color") {
    const { viewBox: [vx, vy, vw, vh], inner } = art.color;
    const side = badgeSide();
    const k = side / vw;
    const off = (SIZE - side) / 2;
    return `${head}${bgRect(v.bg)}<g transform="translate(${off.toFixed(3)} ${off.toFixed(3)}) scale(${k.toFixed(6)}) translate(${-vx} ${-vy})">${inner}</g></svg>\n`;
  }
  const { clip, stroke, d } = art.cactus;
  const b = art.bbox;
  const k = (SIZE * SAFE) / Math.hypot(b.w, b.h);
  const tx = SIZE / 2 - k * (b.x + b.w / 2);
  const ty = SIZE / 2 - k * (b.y + b.h / 2);
  return (
    `${head}<defs><clipPath id="cactus"><rect x="${clip.x}" y="${clip.y}" width="${clip.w}" height="${clip.h}"/></clipPath></defs>` +
    `${bgRect(v.bg)}<g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${k.toFixed(6)})">` +
    `<path fill="${v.fg}" stroke="${v.fg}" stroke-width="${stroke}" stroke-linejoin="round" clip-path="url(#cactus)" d="${d}"/></g></svg>\n`
  );
}

/** Measure the saguaro's drawn bbox in source units by rendering it alone. */
export async function measureCactus(sharp, cactus) {
  const { clip, stroke, d } = cactus;
  const s = 4; // px per unit
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${clip.w * s}" height="${clip.h * s}" viewBox="${clip.x} ${clip.y} ${clip.w} ${clip.h}"><defs><clipPath id="c"><rect x="${clip.x}" y="${clip.y}" width="${clip.w}" height="${clip.h}"/></clipPath></defs><path fill="#000" stroke="#000" stroke-width="${stroke}" stroke-linejoin="round" clip-path="url(#c)" d="${d}"/></svg>`;
  const { info } = await sharp(Buffer.from(svg)).flatten({ background: "#ffffff" }).trim({ background: "#ffffff", threshold: 10 }).toBuffer({ resolveWithObject: true });
  return {
    x: clip.x + -info.trimOffsetLeft / s,
    y: clip.y + -info.trimOffsetTop / s,
    w: info.width / s,
    h: info.height / s,
  };
}

const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** Contact sheet: every variation as Instagram shows it (circle), with name and hex codes. */
export async function contactSheet(sharp, rendered) {
  const cell = 300, pad = 24, thumb = 200, cols = 5;
  const rows = Math.ceil(rendered.length / cols);
  const W = cols * cell + pad * 2, H = rows * cell + 120 + pad;
  const checker = `<pattern id="chk" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#CCCCCC"/><rect width="10" height="10" fill="#EEEEEE"/><rect x="10" y="10" width="10" height="10" fill="#EEEEEE"/></pattern>`;
  let body = "";
  for (const [i, r] of rendered.entries()) {
    const cx = pad + (i % cols) * cell, cy = 110 + Math.floor(i / cols) * cell;
    const png = (await sharp(r.png1080).resize(thumb).png().toBuffer()).toString("base64");
    const x = cx + (cell - thumb) / 2;
    const hex = r.v.kind === "color" ? `bg ${r.v.bg ?? "none"}` : `mark ${r.v.fg}  bg ${r.v.bg ?? "none"}`;
    body +=
      `<clipPath id="c${i}"><circle cx="${x + thumb / 2}" cy="${cy + thumb / 2}" r="${thumb / 2}"/></clipPath>` +
      `<circle cx="${x + thumb / 2}" cy="${cy + thumb / 2}" r="${thumb / 2}" fill="url(#chk)"/>` +
      `<image href="data:image/png;base64,${png}" x="${x}" y="${cy}" width="${thumb}" height="${thumb}" clip-path="url(#c${i})"/>` +
      `<circle cx="${x + thumb / 2}" cy="${cy + thumb / 2}" r="${thumb / 2}" fill="none" stroke="#BBBBBB"/>` +
      `<text x="${cx + cell / 2}" y="${cy + thumb + 26}" font-family="DejaVu Sans, sans-serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#221418">${i + 1}. ${esc(r.v.slug)}</text>` +
      `<text x="${cx + cell / 2}" y="${cy + thumb + 48}" font-family="DejaVu Sans Mono, monospace" font-size="15" text-anchor="middle" fill="#221418">${esc(hex)}</text>`;
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>${checker}</defs>` +
    `<rect width="${W}" height="${H}" fill="#FFFFFF"/>` +
    `<text x="${pad}" y="56" font-family="DejaVu Sans, sans-serif" font-size="32" font-weight="bold" fill="#221418">Cardon Digital: profile picture pack</text>` +
    `<text x="${pad}" y="88" font-family="DejaVu Sans, sans-serif" font-size="17" fill="#5A4A4E">Shown as Instagram crops it (circle). Checkerboard = transparent. Upload the 1080 x 1080 PNG.</text>` +
    `${body}</svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/** Build the pack into outDir; returns the list of files written. */
export async function buildPack(sharp, outDir, root = ROOT) {
  const cactus = loadCactus(root);
  const art = { cactus, color: loadColorLogo(root), bbox: await measureCactus(sharp, cactus) };
  const files = [];
  const rendered = [];
  for (const [i, v] of VARIATIONS.entries()) {
    const dir = join(outDir, `${String(i + 1).padStart(2, "0")}-${v.slug}`);
    mkdirSync(dir, { recursive: true });
    const svg = variationSvg(v, art);
    const png1080 = await sharp(Buffer.from(svg)).resize(SIZE, SIZE).png().toBuffer();
    const png320 = await sharp(png1080).resize(SMALL, SMALL, { kernel: "lanczos3" }).png().toBuffer();
    for (const [name, data] of [
      [`cardon-pfp-${v.slug}.svg`, svg],
      [`cardon-pfp-${v.slug}-1080.png`, png1080],
      [`cardon-pfp-${v.slug}-320.png`, png320],
    ]) {
      writeFileSync(join(dir, name), data);
      files.push(join(dir, name));
    }
    rendered.push({ v, png1080 });
  }
  const sheet = join(outDir, "cardon-pfp-contact-sheet.png");
  writeFileSync(sheet, await contactSheet(sharp, rendered));
  files.push(sheet);
  const readme = join(outDir, "README.txt");
  writeFileSync(readme, readmeText());
  files.push(readme);
  return files;
}

export function readmeText() {
  const lines = VARIATIONS.map((v, i) => {
    const hex = v.kind === "color" ? `background ${v.bg ?? "transparent"}` : `mark ${v.fg}, background ${v.bg ?? "transparent"}`;
    return `${String(i + 1).padStart(2, "0")} ${v.slug}: ${v.label}. ${hex}. Colours from ${v.source}.`;
  });
  return [
    "Cardon Digital: profile picture pack",
    "",
    "For Instagram, upload the 1080 x 1080 PNG (file ending -1080.png).",
    "Instagram shows the picture at 320 x 320 in a circle. The -320.png file is a preview at that size.",
    "The mark stays inside the centre 80 percent, so the circle does not cut it.",
    "Instagram does not keep transparency. Use the transparent files on other sites, not on Instagram.",
    "Each folder also has the SVG (vector) file.",
    "cardon-pfp-contact-sheet.png shows all variations in a circle, with their colour codes.",
    "",
    "Variations:",
    ...lines,
    "",
    "Art: the official colour logo (public/brand/cardon-icon-color.svg) and the cactus line from the official logo (public/brand/cardon-app-icon-dark.svg).",
    "Colours: only hex codes from those files and the site palette (app/globals.css).",
    "",
  ].join("\r\n");
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = process.argv[2];
  if (!out) throw new Error("usage: node scripts/pfp/pfp-pack.mjs <out-dir>");
  const sharp = (await import("sharp")).default;
  const files = await buildPack(sharp, resolve(out));
  console.log(`${files.length} files written to ${resolve(out)}`);
}
