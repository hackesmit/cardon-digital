/* The B1 case in a browser: find the wall second the caption turns to
   "picked", then on the NEXT cycle shoot the frame just before it and the
   first frame of it, so the words can be read against the cellar's own count
   on the canvas. */
import { chromium } from "/home/daniel/hq/state/review/s-7bb5/node_modules/playwright/index.mjs";
const BASE = process.argv[2];
const OUT = new URL("./shots/", import.meta.url).pathname;
const EXE = "/home/daniel/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const CYCLE = 38.5 * 1000;
const b = await chromium.launch({ executablePath: EXE });
const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
await page.goto(BASE + "/es/rev-prod", { waitUntil: "networkidle" });
await page.waitForFunction(() => document.querySelector(".demo-canvas")?.style.height !== "");
const t0 = Date.now();
const cap = () => page.evaluate(() => document.querySelector(".demo-figure[data-demo=produccion] .demo-caption").textContent);
const shot = (n) => page.locator(".demo-figure[data-demo=produccion]").first().screenshot({ path: OUT + n + ".png" });
const at = async (ms) => { const w = t0 + ms - Date.now(); if (w > 0) await page.waitForTimeout(w); };

const PICKED = "cada lote, cortado en su ventana";
let flip = null;
for (let ms = 26000; ms <= 32000 && flip === null; ms += 100) {
  await at(ms);
  if ((await cap()) === PICKED) flip = ms;
}
console.log("the caption turns to picked at", (flip / 1000).toFixed(1) + "s");
/* the same two moments one cycle later */
await at(flip + CYCLE - 400); await shot("e-just-before-picked");
console.log("just before:", await cap());
await at(flip + CYCLE + 150); await shot("e-first-picked");
console.log("first picked:", await cap(), "errors", errors.length);
await ctx.close(); await b.close();
