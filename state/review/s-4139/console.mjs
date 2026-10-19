/**
 * The halftone sunset's console, with nothing reading the canvas back
 * (bead hq-lgjo.10).
 *
 *   node state/review/s-4139/console.mjs [baseUrl]
 *
 * shots.mjs and probe.mjs both call getImageData on the band's visible canvas
 * to measure it, and after the third readback of a session Chrome warns that
 * willReadFrequently would be faster. That warning belongs to the MEASUREMENT,
 * not to the page: this run exercises every path that touches the canvas
 * (first paint, three ticks, two resizes, a mode flip) and reads nothing back,
 * so what it prints is what a visitor's console shows.
 */

import { createRequire } from "node:module";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const require = createRequire(import.meta.url);
let pw;
const cache = join(process.env.HOME, ".npm", "_npx");
for (const e of readdirSync(cache)) {
  try { pw = (await import(pathToFileURL(join(cache, e, "node_modules", "playwright", "index.js")).href)).default; break; } catch {}
}
const BASE = process.argv[2] || "http://127.0.0.1:3414";
const b = await pw.chromium.launch({ executablePath: "/usr/bin/google-chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const msgs = [];
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") msgs.push(m.type() + ": " + m.text()); });
page.on("pageerror", (e) => msgs.push("pageerror: " + e.message));
await page.goto(BASE + "/es/precios", { waitUntil: "networkidle" });
await page.evaluate(() => { const w = document.querySelector("details.pb-wrap"); if (w) w.open = true; });
await (await page.$(".pb-sunset")).scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
/* Tick three boxes, resize twice, flip the mode: every path that rebuilds
   the dot field or repaints it. */
await page.evaluate(async () => {
  const pb = document.querySelector(".pb");
  const f = () => new Promise((r) => requestAnimationFrame(r));
  const g = pb.querySelectorAll("fieldset.pb-group");
  g[0].querySelectorAll(".pb-opt:not(.pb-none) input")[0].click(); await f();
  pb.querySelector(".pb-care input").click(); await f();
  g[1].querySelectorAll(".pb-opt:not(.pb-none) input")[0].click(); await f();
});
await page.waitForTimeout(3000);
await page.setViewportSize({ width: 1100, height: 900 }); await page.waitForTimeout(800);
await page.setViewportSize({ width: 1440, height: 900 }); await page.waitForTimeout(800);
await page.evaluate(() => document.querySelector("button.mode-toggle").click());
await page.waitForTimeout(600);
console.log(msgs.length ? JSON.stringify(msgs, null, 1) : "no console errors or warnings");
await b.close();
