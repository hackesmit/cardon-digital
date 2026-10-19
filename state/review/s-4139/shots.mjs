/**
 * The halftone sunset's screenshot run (bead hq-lgjo.10).
 *
 *   node state/review/s-4139/shots.mjs [baseUrl]
 *
 * It opens /es/precios and /es/contacto at 1440 and 390, in light and dark,
 * with 0, about half and all of the builder's boxes ticked, and writes a
 * screenshot of the builder band per combination. For each shot it also
 * measures, in the page:
 *
 *   - the canvas is painted (a count of non-transparent pixels and the mean
 *     alpha of the band, so an empty canvas cannot pass as a faint screen)
 *   - how far up the band the ink reaches, in tenths, which is the wave front
 *   - that nothing of the page's text overlaps the band's box, which is what
 *     keeps the sunset off every contrast ratio
 *   - that the band takes no pointer events (elementFromPoint at its centre)
 *   - the document's scrollWidth against its clientWidth (no new overflow)
 *   - every console message and page error
 *
 * Playwright is not a dependency of this app (see scripts/demos/capture.mjs):
 * it is resolved from this repo if it is here and otherwise from the npx
 * cache, and the browser is the system Chrome.
 */

import { readdirSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "shots");
const BASE = process.argv[2] || "http://127.0.0.1:3414";

async function playwright() {
  const require = createRequire(import.meta.url);
  try {
    return require("playwright");
  } catch {
    const cache = join(process.env.HOME || "", ".npm", "_npx");
    for (const entry of readdirSync(cache)) {
      const candidate = join(cache, entry, "node_modules", "playwright", "index.js");
      try {
        return (await import(pathToFileURL(candidate).href)).default;
      } catch {
        /* not this one */
      }
    }
    throw new Error("playwright not found; run `npx playwright@1.64 --version` once");
  }
}

const VIEWPORTS = [
  { id: "1440", width: 1440, height: 900 },
  { id: "390", width: 390, height: 844 },
];
const PAGES = [
  { id: "precios", path: "/es/precios" },
  { id: "contacto", path: "/es/contacto" },
];
/** How many boxes to tick: none, about half, all of them. */
const FILLS = [0, 3, 6];

/**
 * Open the builder's details box and tick `n` of its SLOTS, in the order a
 * client would: a website package, its care, an ads scope, then each module.
 * Slots, not inputs: the packages are radios, so clicking a second one is
 * still one pick and would leave the level short of what the shot claims.
 */
async function setFill(page, n) {
  const ticked = await page.evaluate(async (want) => {
    const wrap = document.querySelector("details.pb-wrap");
    if (wrap && !wrap.open) {
      wrap.open = true;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }
    const pb = document.querySelector(".pb");
    if (!pb) throw new Error("no .pb");
    const frame = () => new Promise((r) => requestAnimationFrame(r));
    /* Clear first: the page may arrive with a package in the query string. */
    const clear = pb.querySelector(".pb-clear");
    if (clear) clear.click();
    await frame();
    const groups = Array.from(pb.querySelectorAll("fieldset.pb-group"));
    const pick = (group, index) => {
      const opts = groups[group].querySelectorAll(".pb-opt:not(.pb-none):not(.pb-care) input");
      return opts[index] || null;
    };
    /* One action per slot, in the order they appear on screen. */
    const plan = [
      () => pick(0, 0), // the entry website package
      () => pb.querySelector(".pb-care input"), // its monthly care, revealed by the package
      () => pick(1, 0), // the entry ads scope
      () => pick(2, 0),
      () => pick(2, 1),
      () => pick(2, 2),
    ];
    let done = 0;
    for (let i = 0; i < want && i < plan.length; i++) {
      const input = plan[i]();
      if (!input) throw new Error("no input for slot " + i);
      if (!input.checked) {
        input.click();
        done++;
        await frame();
      }
    }
    /* What the builder itself now holds, counted the way builderLevel counts. */
    const on = Array.from(pb.querySelectorAll(".pb-opt.is-on:not(.pb-none)"));
    return { clicked: done, lit: on.length };
  }, n);
  /* Let the wave finish: the easing takes about 2.4s to the last hundredth. */
  await page.waitForTimeout(3200);
  return ticked;
}

/** Everything measured about one band, read in the page. */
async function measure(page) {
  return page.evaluate(() => {
    const host = document.querySelector(".pb-sunset");
    if (!host) return { error: "no .pb-sunset" };
    const canvas = host.querySelector("canvas");
    const box = host.getBoundingClientRect();
    const cs = getComputedStyle(host);
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let painted = 0;
    let alphaSum = 0;
    const rows = 10;
    const perRow = new Array(rows).fill(0);
    for (let y = 0; y < height; y++) {
      const row = Math.min(rows - 1, Math.floor((y / height) * rows));
      for (let x = 0; x < width; x++) {
        const a = data[(y * width + x) * 4 + 3];
        if (a > 8) {
          painted++;
          perRow[row]++;
        }
        alphaSum += a;
      }
    }
    /* Which text, if any, sits over the band. */
    const overlapping = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      for (const rect of Array.from(r.getClientRects())) {
        if (rect.width < 1 || rect.height < 1) continue;
        if (
          rect.right > box.left &&
          rect.left < box.right &&
          rect.bottom > box.top &&
          rect.top < box.bottom
        ) {
          overlapping.push(n.nodeValue.trim().slice(0, 40));
          break;
        }
      }
    }
    const cx = Math.round(box.left + box.width / 2);
    const cy = Math.round(box.top + box.height / 2);
    const hit = box.top >= 0 && box.bottom <= innerHeight ? document.elementFromPoint(cx, cy) : null;
    return {
      cssSize: [Math.round(box.width), Math.round(box.height)],
      deviceSize: [width, height],
      pointerEvents: cs.pointerEvents,
      ariaHidden: host.getAttribute("aria-hidden"),
      inkFraction: +(painted / (width * height)).toFixed(4),
      meanAlpha: +(alphaSum / (width * height)).toFixed(2),
      /* Ink per tenth of the band, top row first: the wave front's reach. */
      inkByRow: perRow.map((n) => +(n / ((width * height) / rows)).toFixed(3)),
      overlappingText: overlapping,
      hitTarget: hit ? hit.className || hit.tagName : null,
      overflow: {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      },
    };
  });
}

const pw = await playwright();
await mkdir(OUT, { recursive: true });
const results = [];
const browser = await pw.chromium.launch({
  executablePath: process.env.PW_EXEC || "/usr/bin/google-chrome",
  args: process.env.PW_REDUCED
    ? ["--force-prefers-reduced-motion"]
    : [
        /* Headless Chrome reports a coarse pointer by default, which is not
           the desktop this site is measured on (Knowledge.md, s-16cb). */
        "--blink-settings=primaryPointerType=4,availablePointerTypes=4,primaryHoverType=2,availableHoverTypes=2",
      ],
});

for (const vp of VIEWPORTS) {
  for (const mode of ["light", "dark"]) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      colorScheme: mode,
    });
    /* SiteShell reads this before first paint, so the mode is set with no flash. */
    await context.addInitScript(`try{localStorage.setItem("cardon-mode","${mode}")}catch(e){}`);
    for (const target of PAGES) {
      const page = await context.newPage();
      const messages = [];
      page.on("console", (m) => {
        if (m.type() === "error" || m.type() === "warning") messages.push(m.type() + ": " + m.text());
      });
      page.on("pageerror", (e) => messages.push("pageerror: " + e.message));
      await page.goto(BASE + target.path, { waitUntil: "networkidle" });
      for (const fill of FILLS) {
        const ticked = await setFill(page, fill);
        const host = await page.$(".pb-sunset");
        await host.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        const id = [vp.id, mode, target.id, fill].join("-");
        await writeFile(join(OUT, id + ".png"), await host.screenshot());
        const m = await measure(page);
        results.push({ id, fill, ticked, ...m, messages: [...messages] });
        messages.length = 0;
        console.log(
          id.padEnd(28),
          "lit " + String(ticked.lit) + "/6",
          "ink " + String(m.inkFraction).padEnd(7),
          "alpha " + String(m.meanAlpha).padEnd(7),
          "rows " + JSON.stringify(m.inkByRow),
          m.overlappingText.length ? "TEXT OVER BAND " + JSON.stringify(m.overlappingText) : "",
          m.messages && m.messages.length ? "MSG " + JSON.stringify(m.messages) : ""
        );
      }
      await page.close();
    }
    await context.close();
  }
}
await browser.close();
await writeFile(join(OUT, "measurements.json"), JSON.stringify(results, null, 2));
console.log("\nwrote", results.length, "shots to", OUT);
