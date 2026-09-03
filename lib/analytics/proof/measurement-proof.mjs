/**
 * Runnable proof for the consent gate and the three conversions.
 *
 * It is a script rather than a test suite because the repo carries no test
 * runner and this bead was not the place to add one: a reviewer can run it and
 * read the same lines the bead reports.
 *
 * Setup, all of it outside the repo:
 *
 *   mkdir -p /tmp/cardon-e2e && cd /tmp/cardon-e2e
 *   npm init -y && npm install playwright-core
 *   # Chromium ships with the Playwright cache but its nss libs do not:
 *   mkdir -p /tmp/debs && cd /tmp/debs
 *   apt-get download libnss3 libnspr4 libasound2t64
 *   for d in *.deb; do dpkg -x "$d" /tmp/chromelibs; done
 *
 * Run, from the rig, with the site already serving on port 3478:
 *
 *   NEXT_PUBLIC_GA4_ID=G-TEST123456 NEXT_PUBLIC_ADS_ID=AW-987654321 \
 *   NEXT_PUBLIC_ADS_LABEL_CONTACT=cTESTlabel \
 *   NEXT_PUBLIC_ADS_LABEL_WHATSAPP=wTESTlabel \
 *   NEXT_PUBLIC_ADS_LABEL_BOOKING=bTESTlabel npx next dev -p 3478
 *
 *   cp lib/analytics/proof/measurement-proof.mjs /tmp/cardon-e2e/events.mjs
 *   cd /tmp/cardon-e2e
 *   LD_LIBRARY_PATH=/tmp/chromelibs/usr/lib/x86_64-linux-gnu node events.mjs
 *
 * Expected: four no-op lines before consent, four sent lines after it, the
 * cookie written, the tag injected once, and eight dataLayer pushes.
 */

import { chromium } from "playwright-core";

const BASE = "http://localhost:3478";
const EXEC = "/home/daniel/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome";

const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] });
const ctx = await browser.newContext();
const page = await ctx.newPage();

const logs = [];
page.on("console", (m) => {
  const t = m.text();
  if (t.includes("[analytics]")) logs.push(t);
});

// Google is not reachable from this run and does not need to be: the inline
// bootstrap defines window.gtag, which is what the events actually call.
await ctx.route("**://www.googletagmanager.com/**", (r) => r.abort());

await page.goto(BASE + "/en", { waitUntil: "domcontentloaded" });
await page.waitForSelector(".consent-card", { timeout: 30000 });
// Wait for hydration: the listeners only exist once the client component mounts.
await page.waitForLoadState("networkidle");
await page.waitForTimeout(2500);

// Stop every click from navigating away, and add the two destinations the
// contact system will ship so the delegation contract can be exercised now.
await page.evaluate(() => {
  // Only links are stopped. Stopping the submit button's click would also stop
  // the submit event this test needs to observe.
  document.addEventListener("click", (e) => {
    if (e.target instanceof Element && e.target.closest("a")) e.preventDefault();
  }, true);
  document.addEventListener("submit", (e) => e.preventDefault(), true);
  const box = document.createElement("div");
  box.id = "probe";
  box.innerHTML =
    '<a id="p-wa" href="https://wa.me/526462278690">wa</a>' +
    '<a id="p-book" data-conversion="booking" href="https://calendar.app.google/abc">book</a>' +
    '<form id="contact-form"><button id="p-send" type="submit">send</button></form>';
  document.body.appendChild(box);
});

async function step(label, fn) {
  logs.length = 0;
  await fn();
  await page.waitForTimeout(250);
  console.log(label + ": " + (logs.join(" | ") || "(no log)"));
}

const mailto = 'a[href^="mailto:"]';
await step("BEFORE consent, mailto click ", () => page.click(mailto));
await step("BEFORE consent, whatsapp click", () => page.click("#p-wa"));
await step("BEFORE consent, booking click ", () => page.click("#p-book"));
await step("BEFORE consent, form submit   ", () => page.click("#p-send"));

const tagBefore = await page.evaluate(
  () => document.querySelectorAll('script[src*="googletagmanager"]').length,
);

await page.click(".consent-card .cta");
await page.waitForTimeout(400);
const bannerGone = (await page.locator(".consent-card").count()) === 0;
const cookie = (await ctx.cookies()).find((c) => c.name === "cardon-consent");
const tagAfter = await page.evaluate(
  () => document.querySelectorAll('script[src*="googletagmanager"]').length,
);

console.log("");
console.log("banner dismissed on accept : " + bannerGone);
console.log("cardon-consent cookie      : " + (cookie ? cookie.value : "(none)"));
console.log("gtag scripts before/after  : " + tagBefore + " -> " + tagAfter);
console.log("");

await step("AFTER consent, mailto click  ", () => page.click(mailto));
await step("AFTER consent, whatsapp click", () => page.click("#p-wa"));
await step("AFTER consent, booking click ", () => page.click("#p-book"));
await step("AFTER consent, form submit   ", () => page.click("#p-send"));

const sent = await page.evaluate(() =>
  (window.dataLayer || [])
    .map((a) => Array.from(a))
    .filter((a) => a[0] === "event")
    .map((a) => a[1] + " " + JSON.stringify(a[2])),
);
console.log("");
console.log("dataLayer events pushed:");
sent.forEach((s) => console.log("  " + s));

await browser.close();
