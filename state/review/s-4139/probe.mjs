/**
 * The halftone sunset's runtime contract (bead hq-lgjo.10).
 *
 *   node state/review/s-4139/probe.mjs [baseUrl]
 *
 * Four things a screenshot cannot show:
 *
 *   1. The loop stops. requestAnimationFrame is counted from before the page
 *      loads; the count is read once the builder is idle, again after two
 *      seconds of nothing, then across a tick and the two seconds after it.
 *      An idle builder must add no frames at all.
 *   2. prefers-reduced-motion jumps to the target with no animation: the
 *      canvas one frame after a tick already equals the canvas two seconds
 *      later, and no frames were asked for in between.
 *   3. the mode switch recolours the band live, for one repaint.
 *   4. devicePixelRatio is capped at 2: at deviceScaleFactor 3 the backing
 *      store is twice the CSS box, not three times.
 *
 * The canvas is compared by a cheap digest of its pixels, taken in the page.
 */

import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

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

/**
 * Count the band's OWN paints, from before anything runs.
 *
 * Not requestAnimationFrame: this page runs Lenis, whose smooth scrolling asks
 * for a frame forever, so the page-wide count rises by 60 a second whatever the
 * builder does (measured: 119 -> 239 over two idle seconds). draw() begins with
 * one clearRect on the band's own canvas, so hooking that counts this
 * component's frames and nothing else.
 */
const COUNT_FRAMES = `
  window.__paints = 0;
  const realClear = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function (...args) {
    const p = this.canvas && this.canvas.parentElement;
    if (p && p.classList && p.classList.contains("pb-sunset")) window.__paints++;
    return realClear.apply(this, args);
  };
`;

const digest = (page) =>
  page.evaluate(() => {
    const canvas = document.querySelector(".pb-sunset canvas");
    const ctx = canvas.getContext("2d");
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let h = 2166136261;
    for (let i = 0; i < d.length; i += 97) {
      h ^= d[i];
      h = Math.imul(h, 16777619);
    }
    return { hash: h >>> 0, size: [canvas.width, canvas.height] };
  });

const frames = (page) => page.evaluate(() => window.__paints);

/** Open the builder and tick the first website package. */
const tickOne = (page) =>
  page.evaluate(async () => {
    const wrap = document.querySelector("details.pb-wrap");
    if (wrap && !wrap.open) {
      wrap.open = true;
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }
    const pb = document.querySelector(".pb");
    const input = pb.querySelectorAll("fieldset.pb-group")[0].querySelectorAll(".pb-opt:not(.pb-none) input")[0];
    input.click();
  });

const pw = await playwright();
const fail = [];
const say = (ok, line) => {
  console.log((ok ? "PASS  " : "FAIL  ") + line);
  if (!ok) fail.push(line);
};

for (const reduced of [false, true]) {
  const browser = await pw.chromium.launch({
    executablePath: process.env.PW_EXEC || "/usr/bin/google-chrome",
  });
  /* Playwright's own emulation, not the --force-prefers-reduced-motion switch:
     under that switch matchMedia("(prefers-reduced-motion: reduce)") still
     answered false in this Chrome, so the probe measured the motion branch
     twice and called one of the runs reduced. The assertion below is the
     guard against that happening again silently. */
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  await context.addInitScript(COUNT_FRAMES);
  const page = await context.newPage();
  await page.goto(BASE + "/es/precios", { waitUntil: "networkidle" });
  const sees = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  say(sees === reduced, (reduced ? "reduced " : "motion  ") + "the page really is in this mode (matchMedia " + sees + ")");
  await page.evaluate(() => {
    const wrap = document.querySelector("details.pb-wrap");
    if (wrap) wrap.open = true;
  });
  /* The band has to be ON SCREEN: off screen it lands on the target without
     animating, by design, and a probe that never scrolls to it would measure
     that path and call it the animation. */
  await (await page.$(".pb-sunset")).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const tag = reduced ? "reduced " : "motion  ";

  /* 1. idle costs nothing */
  const idle0 = await frames(page);
  await page.waitForTimeout(2000);
  const idle1 = await frames(page);
  say(idle1 === idle0, tag + "idle builder paints no frames (" + idle0 + " -> " + idle1 + ")");

  /* 2. a tick */
  const before = await digest(page);
  await tickOne(page);
  await page.waitForTimeout(80);
  const justAfter = await digest(page);
  const framesAfterTick = (await frames(page)) - idle1;
  await page.waitForTimeout(2600);
  const settledD = await digest(page);
  const framesAtSettle = await frames(page);
  await page.waitForTimeout(2000);
  const framesLater = await frames(page);

  say(settledD.hash !== before.hash, tag + "a tick changes the drawing");
  say(framesLater === framesAtSettle, tag + "the loop stops once settled (" + framesAtSettle + " -> " + framesLater + ")");
  if (reduced) {
    say(
      justAfter.hash === settledD.hash,
      tag + "jumps straight to the target: the first frame already is the end state"
    );
    say(framesAfterTick <= 2, tag + "one paint for the change, no animation (" + framesAfterTick + ")");
  } else {
    say(justAfter.hash !== settledD.hash, tag + "animates: the first frame is not the end state");
    say(framesAfterTick > 2, tag + "the wave ran (" + framesAfterTick + " paints in 80ms)");
  }
  /* 3. the live mode switch, through the nav's own button */
  const beforeMode = await digest(page);
  const paintsBeforeMode = await frames(page);
  const modeWas = await page.evaluate(() => document.documentElement.getAttribute("data-mode"));
  await page.evaluate(() => {
    const b = document.querySelector("button.mode-toggle");
    if (!b) throw new Error("no mode toggle");
    b.click();
  });
  await page.waitForTimeout(260);
  const afterMode = await digest(page);
  const paintsAfterMode = await frames(page);
  say(afterMode.hash !== beforeMode.hash, tag + "the mode switch recolours the band live");
  say(
    paintsAfterMode - paintsBeforeMode === 1,
    tag + "and costs one repaint, not a loop (" + (paintsAfterMode - paintsBeforeMode) + ")"
  );
  const modeNow = await page.evaluate(() => document.documentElement.getAttribute("data-mode"));
  say(modeNow !== modeWas, tag + "the page moved from " + modeWas + " to " + modeNow + " mode");

  await context.close();
  await browser.close();
}

/* 4. the devicePixelRatio cap */
{
  const browser = await pw.chromium.launch({
    executablePath: process.env.PW_EXEC || "/usr/bin/google-chrome",
  });
  for (const dsf of [1, 2, 3]) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: dsf,
    });
    const page = await context.newPage();
    await page.goto(BASE + "/es/precios", { waitUntil: "networkidle" });
    await page.evaluate(() => {
      const wrap = document.querySelector("details.pb-wrap");
      if (wrap) wrap.open = true;
    });
    await page.waitForTimeout(900);
    const m = await page.evaluate(() => {
      const canvas = document.querySelector(".pb-sunset canvas");
      const box = canvas.getBoundingClientRect();
      return { css: Math.round(box.width), backing: canvas.width, dpr: devicePixelRatio };
    });
    const expected = Math.round(m.css * Math.min(2, dsf));
    say(
      Math.abs(m.backing - expected) <= 2,
      "dpr " + m.dpr + ": backing store " + m.backing + " for a " + m.css + "px box (expected " + expected + ")"
    );
    await context.close();
  }
  await browser.close();
}

console.log(fail.length ? "\n" + fail.length + " FAILED" : "\nall checks passed");
process.exit(fail.length ? 1 : 0);
