import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  VARIATIONS, SIZE, SMALL, SAFE, brandHexes, contrast, badgeSide,
  loadCactus, loadColorLogo, variationSvg, buildPack, readmeText,
} from "./pfp-pack.mjs";

test("every colour is a real brand hex from the code", () => {
  const known = brandHexes();
  for (const v of VARIATIONS) {
    for (const hex of [v.fg, v.bg].filter(Boolean)) {
      assert.ok(known.has(hex), `${v.slug}: ${hex} is not in the brand files`);
    }
  }
});

test("slugs are unique and the pack covers the asked-for kinds", () => {
  const slugs = VARIATIONS.map((v) => v.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(VARIATIONS.some((v) => v.kind === "color"), "colour logo");
  assert.ok(VARIATIONS.some((v) => v.slug === "mono-black-on-white"));
  assert.ok(VARIATIONS.some((v) => v.slug === "mono-white-on-black"));
  assert.ok(VARIATIONS.filter((v) => v.bg === null).length >= 2, "transparent");
  const light = (h) => contrast(h, "#000000") > contrast(h, "#FFFFFF");
  assert.ok(VARIATIONS.some((v) => v.kind === "line" && v.bg && light(v.fg) && !light(v.bg)), "light on dark");
  assert.ok(VARIATIONS.some((v) => v.kind === "line" && v.bg && !light(v.fg) && light(v.bg)), "dark on light");
});

test("every line mark reads on its background (3:1, graphics floor)", () => {
  for (const v of VARIATIONS.filter((x) => x.kind === "line" && x.bg)) {
    assert.ok(contrast(v.fg, v.bg) >= 3, `${v.slug}: ${contrast(v.fg, v.bg).toFixed(2)}:1`);
  }
});

test("contrast matches known WCAG values", () => {
  assert.equal(contrast("#000000", "#FFFFFF"), 21);
  assert.equal(contrast("#777777", "#777777"), 1);
});

test("the colour badge's rounded corner stays inside the safe circle", () => {
  const side = badgeSide();
  const r = side * (64 / 392);
  const reach = Math.SQRT2 * (side / 2 - r) + r;
  assert.ok(Math.abs(reach - (SIZE * SAFE) / 2) < 1e-6);
  assert.ok(side < SIZE * SAFE + 1e-9 && side > SIZE * 0.6);
});

test("art is read from the official files", () => {
  const c = loadCactus();
  assert.match(c.d, /^M228\.3,246\.3/);
  assert.equal(c.clip.w, 248);
  const logo = loadColorLogo();
  assert.deepEqual(logo.viewBox, [-2, 6, 392, 392]);
  assert.match(logo.inner, /#2B131E/);
  assert.doesNotMatch(logo.inner, /<title>/);
});

test("line svg recolours only the mark and fits the safe circle", () => {
  const art = { cactus: loadCactus(), bbox: { x: 120, y: 230, w: 200, h: 300 } };
  const v = VARIATIONS.find((x) => x.slug === "mono-white-on-black");
  const svg = variationSvg(v, art);
  assert.match(svg, /fill="#FFFFFF" stroke="#FFFFFF"/);
  assert.match(svg, /<rect width="1080" height="1080" fill="#000000"\/>/);
  const k = Number(svg.match(/scale\(([\d.]+)\)/)[1]);
  assert.ok(Math.abs(k * Math.hypot(200, 300) - SIZE * SAFE) < 0.01);
  const t = variationSvg(VARIATIONS.find((x) => x.slug === "transparent-dark"), art);
  assert.doesNotMatch(t, /<rect width="1080"/);
});

test("readme lists every variation", () => {
  const r = readmeText();
  for (const v of VARIATIONS) assert.ok(r.includes(v.slug));
});

let sharp = null;
try { sharp = (await import("sharp")).default; } catch { /* not installed: render test skips */ }

test("renders the full pack at both sizes", { skip: sharp ? false : "sharp not installed" }, async () => {
  const out = mkdtempSync(join(tmpdir(), "pfp-"));
  try {
    const files = await buildPack(sharp, out);
    assert.equal(files.length, VARIATIONS.length * 3 + 2);
    assert.equal(readdirSync(out).filter((d) => /^\d\d-/.test(d)).length, VARIATIONS.length);
    for (const [i, v] of VARIATIONS.entries()) {
      const dir = join(out, `${String(i + 1).padStart(2, "0")}-${v.slug}`);
      const big = await sharp(join(dir, `cardon-pfp-${v.slug}-1080.png`)).metadata();
      const small = await sharp(join(dir, `cardon-pfp-${v.slug}-320.png`)).metadata();
      assert.equal(big.width, SIZE); assert.equal(big.height, SIZE);
      assert.equal(small.width, SMALL); assert.equal(small.height, SMALL);
      const { data } = await sharp(join(dir, `cardon-pfp-${v.slug}-1080.png`)).ensureAlpha().extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
      if (v.bg === null) assert.equal(data[3], 0, `${v.slug} corner is transparent`);
      else {
        const hex = "#" + [...data.subarray(0, 3)].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase();
        assert.equal(hex, v.bg, `${v.slug} corner is the background`);
      }
      // Nothing drawn outside the safe circle except the background: sample the ring between the safe circle and the edge.
      const raw = await sharp(join(dir, `cardon-pfp-${v.slug}-1080.png`)).ensureAlpha().raw().toBuffer();
      const R = (SIZE * SAFE) / 2 + 4;
      for (let a = 0; a < 360; a += 3) {
        const x = Math.round(SIZE / 2 + R * Math.cos((a * Math.PI) / 180));
        const y = Math.round(SIZE / 2 + R * Math.sin((a * Math.PI) / 180));
        const o = (y * SIZE + x) * 4;
        assert.deepEqual([...raw.subarray(o, o + 4)], [...data.subarray(0, 4)], `${v.slug} drawn outside safe circle at ${a} deg`);
      }
    }
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
