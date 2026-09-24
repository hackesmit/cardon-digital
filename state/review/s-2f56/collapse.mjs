/* The B3 case on its own, with the board's own width read while it is
   collapsed, so "no console errors" is not just "nothing was redrawn". */
import { chromium } from "/home/daniel/hq/state/review/s-7bb5/node_modules/playwright/index.mjs";
const BASE = process.argv[2];
const EXE = "/home/daniel/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const b = await chromium.launch({ executablePath: EXE });
const say = (...a) => console.log(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" "));
const run = async (demo) => {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE + "/es/rev-prod", { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector(".demo-canvas")?.style.height !== "");
  await page.waitForTimeout(6000);
  const before = errors.length;
  await page.evaluate(() => { document.querySelector("#col").style.width = "0px"; window.dispatchEvent(new Event("resize")); });
  await page.waitForTimeout(1600);
  const collapsed = await page.evaluate((d) => {
    const f = document.querySelector(`.demo-figure[data-demo=${d}]`);
    const c = f.querySelector(".demo-canvas");
    return { canvasClientW: c.clientWidth, backing: c.width + "x" + c.height, styleH: c.style.height,
      plan: f.querySelector(".demo-stage").dataset.plan, hotspot: f.querySelector(".rd-btn")?.getAttribute("style") };
  }, demo);
  await page.waitForTimeout(1200);
  const during = errors.length;
  await page.evaluate(() => { document.querySelector("#col").style.width = "min(760px, 100%)"; window.dispatchEvent(new Event("resize")); });
  await page.waitForTimeout(1600);
  say(demo, "collapsed board", collapsed);
  say(demo, "console errors: before", before, "while collapsed", during - before, "while restoring", errors.length - during);
  say(demo, "samples", errors.slice(0, 2));
  await ctx.close();
};
await run("produccion");
await b.close();
