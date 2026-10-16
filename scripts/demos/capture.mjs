/**
 * The preview images on /demos, captured from the live demo host.
 *
 *   node scripts/demos/capture.mjs            every preview
 *   node scripts/demos/capture.mjs produccion one of them
 *
 * Each preview is a real screenshot of https://demo.cardondigital.com with the
 * modules its card sells switched on, so the Demos page shows the system a
 * visitor is about to open rather than a drawing of it. Re-run this whenever
 * the demo's own shell changes, or the page advertises a screen that is gone.
 *
 * TARGETS is the single source of truth for what is captured and under which
 * name. lib/i18n/demos-index.ts names the same files, and
 * app/[locale]/demos/page.test.tsx fails if the two disagree or if a file a
 * card points at is missing from public/media/demos.
 *
 * Playwright is not a dependency of this app: it is a tool a person runs, like
 * scripts/og/render.mjs, and the build never imports it. The resolver below
 * finds it in the repo if it was installed here, and otherwise in the npx
 * cache, which is where `npx playwright` leaves it. PW_EXEC names the browser
 * binary; without it this uses the system Chrome, because the Playwright build
 * in the npx cache and the browsers on this box are usually a version apart.
 *
 * The screenshots are encoded to webp by the browser itself (canvas
 * toDataURL), because this box has no image library: no sharp, no Pillow, no
 * ImageMagick. One 1280x800 frame is about 70 KB at QUALITY, against 110 KB as
 * a png.
 */

import { readdirSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const OUT = join(ROOT, "public", "media", "demos");

/** The frame every preview is taken at. Wide enough to read on a 2x screen. */
export const SHOT = { width: 1280, height: 800 };
export const QUALITY = 0.86;

/**
 * One preview: the file it writes, the modules the demo opens with, and the
 * screen it lands on. `hash` is the demo's own route; leaving it empty takes
 * whatever that module opens on by default. `clip` takes a band of the page
 * at full scale instead of the first screen, for a screen whose top is not the
 * part that sells it.
 *
 * The screens are chosen to be the one a buyer recognises: the tank sheet, the
 * master calendar, the waiter's floor, and the property panel that only exists
 * when all three modules are on.
 */
export const TARGETS = [
  { id: "produccion", modules: ["produccion"], hash: "#fermentacion" },
  { id: "hospitalidad", modules: ["hospitalidad"], hash: "#/hospedaje/calendario" },
  { id: "restaurante", modules: ["restaurante"], hash: "#/restaurante/mesero" },
  {
    id: "todo",
    modules: ["produccion", "hospitalidad", "restaurante"],
    hash: "#/admin/panel",
    /**
     * The only clipped frame. The panel opens on its period control and a
     * total the demo's own seed cannot compute (its bookings carry no
     * amounts, so the month's revenue reads ND), and a card that sells one
     * set of numbers may not lead with the one figure the screen does not
     * have. This takes the band under it, where the three businesses stand
     * side by side with their figures. Same screen, same scale, so it is
     * still a screenshot rather than an arrangement.
     */
    clip: { x: 0, y: 716, width: 1280, height: 800 },
  },
];

export const DEMO_HOST = "https://demo.cardondigital.com";

function targetUrl(target) {
  return `${DEMO_HOST}/?modulos=${target.modules.join(",")}${target.hash}`;
}

/** Playwright from this repo if it is here, otherwise from the npx cache. */
async function playwright() {
  const require = createRequire(import.meta.url);
  try {
    return require("playwright");
  } catch (e) {
    const cache = join(process.env.HOME || "", ".npm", "_npx");
    for (const entry of readdirSync(cache)) {
      const candidate = join(cache, entry, "node_modules", "playwright", "index.js");
      try {
        return (await import(pathToFileURL(candidate).href)).default;
      } catch (err) {
        /* not this one */
      }
    }
    throw new Error(
      "playwright not found. Run `npx playwright@1.64 --version` once, or " +
        "install it here, then run this again.",
    );
  }
}

/**
 * png bytes in, webp bytes out, encoded by the browser. The canvas is sized to
 * the image rather than to SHOT so a clipped capture keeps its own size.
 */
async function toWebp(page, png) {
  const dataUrl = "data:image/png;base64," + png.toString("base64");
  const encoded = await page.evaluate(
    async ([src, quality]) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      return canvas.toDataURL("image/webp", quality);
    },
    [dataUrl, QUALITY],
  );
  if (!encoded.startsWith("data:image/webp")) {
    throw new Error("the browser did not encode webp");
  }
  return Buffer.from(encoded.split(",")[1], "base64");
}

async function main() {
  const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const wanted = only.length
    ? TARGETS.filter((t) => only.includes(t.id))
    : TARGETS;
  if (!wanted.length) {
    console.error("no target matched: " + only.join(", "));
    process.exit(2);
  }

  const { chromium } = await playwright();
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.PW_EXEC || "/usr/bin/google-chrome",
  });
  try {
    const encoder = await browser.newPage();
    await encoder.goto("about:blank");

    for (const target of wanted) {
      const page = await browser.newPage({ viewport: SHOT, deviceScaleFactor: 1 });
      await page.goto(targetUrl(target), { waitUntil: "networkidle" });
      // The demo paints its charts after the data is seeded, and Chart.js
      // animates in. networkidle is reached well before either is finished.
      await page.waitForTimeout(2500);
      const png = await page.screenshot(
        target.clip
          ? { type: "png", fullPage: true, clip: target.clip }
          : { type: "png" },
      );
      await page.close();
      const webp = await toWebp(encoder, png);
      const file = join(OUT, target.id + ".webp");
      await writeFile(file, webp);
      console.log(
        `${target.id}.webp  ${Math.round(webp.length / 1024)} KB  ${targetUrl(target)}`,
      );
    }
  } finally {
    await browser.close();
  }
}

await main();
