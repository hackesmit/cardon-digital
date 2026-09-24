/* Round-one probe for hq-3pfhe.2: the three blocking findings, in a browser.
   Usage: node probe.mjs <base-url>  (needs the uncommitted /rev-prod route) */
import { chromium } from "/home/daniel/hq/state/review/s-7bb5/node_modules/playwright/index.mjs";
const BASE = process.argv[2];
const OUT = new URL("./shots/", import.meta.url).pathname;
const EXE = "/home/daniel/.cache/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const b = await chromium.launch({ executablePath: EXE });
const say = (...a) => console.log(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" "));

const open = async (opts, path = "/es/rev-prod", dark = false) => {
  const ctx = await b.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  if (dark) await page.evaluate(() => { document.documentElement.setAttribute("data-mode", "dark"); window.dispatchEvent(new Event("cardon-mode")); });
  if (opts.javaScriptEnabled !== false) await page.waitForFunction(() => document.querySelector(".demo-canvas")?.style.height !== "");
  return { ctx, page, errors, t0: Date.now() };
};
const state = (page) => page.evaluate(() => {
  const f = document.querySelector(".demo-figure[data-demo=produccion]");
  const c = f.querySelector(".demo-canvas");
  return { plan: f.querySelector(".demo-stage").dataset.plan, caption: f.querySelector(".demo-caption").textContent,
    figW: Math.round(f.getBoundingClientRect().width * 100) / 100, figH: Math.round(f.getBoundingClientRect().height * 100) / 100,
    canvasW: c.clientWidth, canvasH: c.style.height,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
});
const pixels = (page) => page.evaluate(() => document.querySelector(".demo-figure[data-demo=produccion] .demo-canvas").toDataURL());
const shot = (page, name) => page.locator(".demo-figure[data-demo=produccion]").first().screenshot({ path: OUT + name + ".png" });
const sleepTo = async (o, ms) => { const w = o.t0 + ms - Date.now(); if (w > 0) await o.page.waitForTimeout(w); };
const WIDE = { viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 };
const PHONE = { viewport: { width: 375, height: 900 }, deviceScaleFactor: 2 };

/* A. the caption against the cellar, second by second through the window the
   reviewer found: day 34 lands at 27.95s and day 35.5 at 29.11s. */
{
  const o = await open(WIDE);
  await sleepTo(o, 14000); await shot(o.page, "a-light-1280-mid"); say("A mid", await state(o.page));
  const seen = [];
  for (let ms = 26000; ms <= 31000; ms += 300) {
    await sleepTo(o, ms);
    seen.push([(ms / 1000).toFixed(1), (await state(o.page)).caption]);
  }
  say("A captions 26.0s to 31.0s", seen);
  await sleepTo(o, 28100); /* next cycle is 38.5s later; this is the hold */
  await sleepTo(o, 34000); await shot(o.page, "a-light-1280-hold"); say("A hold", await state(o.page), "errors", o.errors);
  await o.ctx.close();
}
/* the same seconds again, with the cellar's own count read off the canvas */
{
  const o = await open(WIDE);
  const rows = [];
  for (let ms = 27000; ms <= 30000; ms += 250) {
    await sleepTo(o, ms);
    rows.push([(ms / 1000).toFixed(2), (await state(o.page)).caption]);
  }
  say("A2 captions 27.0s to 30.0s", rows);
  await sleepTo(o, 27900); await shot(o.page, "a-light-1280-27.9");
  await o.ctx.close();
}
{ const o = await open(WIDE, "/es/rev-prod", true); await sleepTo(o, 34000); await shot(o.page, "b-dark-1280-hold"); say("B dark hold", await state(o.page), "errors", o.errors); await o.ctx.close(); }
{ const o = await open(WIDE, "/en/rev-prod"); await sleepTo(o, 34000); await shot(o.page, "b-en-1280-hold"); say("B en hold", await state(o.page), "errors", o.errors); await o.ctx.close(); }

/* B. the phone plan, where the label lay on B1, B2 and B3 */
{
  const o = await open(PHONE);
  await sleepTo(o, 34000); await shot(o.page, "p-light-375-hold"); say("P es hold", await state(o.page), "errors", o.errors);
  await o.ctx.close();
}
{ const o = await open(PHONE, "/en/rev-prod"); await sleepTo(o, 34000); await shot(o.page, "p-en-375-hold"); say("P en hold", await state(o.page), "errors", o.errors); await o.ctx.close(); }
{ const o = await open(PHONE, "/es/rev-prod", true); await sleepTo(o, 34000); await shot(o.page, "p-dark-375-hold"); say("P dark hold", await state(o.page), "errors", o.errors); await o.ctx.close(); }
{ const o = await open({ ...PHONE, viewport: { width: 390, height: 900 } }); await sleepTo(o, 34000); await shot(o.page, "p-light-390-hold"); say("P 390 hold", await state(o.page), "errors", o.errors); await o.ctx.close(); }

/* C. reduced motion, which is the payoff frame and must be the hold's pixels */
{
  const o = await open({ ...WIDE, reducedMotion: "reduce" });
  await o.page.waitForTimeout(1200);
  const one = await pixels(o.page);
  await shot(o.page, "c-reduced-1280"); say("C reduced", await state(o.page), "errors", o.errors);
  await o.page.waitForTimeout(2500);
  say("C reduced still:", (await pixels(o.page)) === one ? "SAME" : "MOVED");
  const h = await open(WIDE);
  await sleepTo(h, 34000);
  say("C reduced == hold pixels:", (await pixels(h.page)) === one ? "SAME" : "DIFFERENT");
  await h.ctx.close(); await o.ctx.close();
}

/* D. the collapse: the container goes to zero width and comes back */
{
  const o = await open(WIDE);
  await sleepTo(o, 10000);
  const before = o.errors.length;
  await o.page.evaluate(() => { document.querySelector("#col").style.width = "0px"; window.dispatchEvent(new Event("resize")); });
  await o.page.waitForTimeout(1400);
  const during = o.errors.length;
  await o.page.evaluate(() => { document.querySelector("#col").style.width = "min(760px, 100%)"; window.dispatchEvent(new Event("resize")); });
  await o.page.waitForTimeout(1400);
  say("D collapse: errors before", before, "at 0 width", during - before, "restored", o.errors.length - during);
  say("D first errors", o.errors.slice(0, 3));
  say("D after restore", await state(o.page));
  await shot(o.page, "d-restored-1280");
  await o.ctx.close();
}
await b.close();
