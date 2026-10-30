/**
 * Runnable proof for view transitions and hit areas (bead hq-ik6v0.9).
 *
 * 1. View transitions: spies on document.startViewTransition, clicks a nav
 *    link and asserts the spy ran and an animation ran on the transition's
 *    pseudo-elements; then repeats under reducedMotion "reduce" and asserts
 *    no such animation ran.
 * 2. Hit areas at 390px: for every visible a, button, input, select and
 *    textarea on the key pages (with the mobile menu open, and the consent bar
 *    before it is answered), walks elementFromPoint outward from the centre
 *    along both axes, so a pseudo-element expansion counts, and reports any
 *    control whose hit area is under 44 by 44 CSS px. A link that shares its
 *    line with other text is inside a sentence and is listed apart as exempt
 *    (WCAG 2.5.5 and 2.5.8, inline). Exit 0 only when both pass.
 *
 * Setup, outside the repo: mkdir /tmp/ui-e2e && cd /tmp/ui-e2e &&
 * npm init -y && npm install playwright-core, then copy this file there.
 *
 *   node ui-proof.mjs http://localhost:3931          # next start
 */
import { chromium } from "playwright-core";
const BASE = process.argv[2] || "http://localhost:3931";
const EXEC = process.env.HOME + "/.cache/ms-playwright/chromium-1237/chrome-linux64/chrome";
// /es/demo is left out: it redirects to the demo host, another site.
const PAGES = ["/es", "/en", "/es/precios", "/en/precios", "/es/contacto", "/en/contacto", "/es/anuncios",
  "/es/sitios-web", "/es/software", "/es/guias", "/es/guias/cuanto-cuesta-pagina-web", "/es/estilos",
  "/es/demos", "/es/modulos", "/es/visibilidad-ia", "/es/industries/winery", "/es/work/monte-xanic",
  "/es/work/enkanto", "/en/about", "/es/privacy", "/es/terms", "/es/no-existe"];
const MIN = 44;
const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] });
let failed = false;

// ---- 1. View transitions ----------------------------------------------------
async function navWithSpy(reducedMotion) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion });
  await ctx.addInitScript(() => {
    window.__vt = 0;
    window.__anims = 0;
    const real = document.startViewTransition;
    if (real) {
      document.startViewTransition = function (cb) {
        window.__vt++;
        const t = real.call(document, cb);
        // Any animation on the transition pseudo-elements counts as animating.
        t.ready.then(() => {
          window.__anims += document.getAnimations()
            .filter((a) => String(a.effect?.pseudoElement || "").startsWith("::view-transition")).length;
        }).catch(() => {});
        return t;
      };
    }
  });
  await ctx.addCookies([{ name: "cardon-consent", value: "denied", url: BASE }]);
  const page = await ctx.newPage();
  await page.goto(BASE + "/es", { waitUntil: "networkidle" });
  const before = await page.evaluate(() => document.querySelector("h1")?.textContent);
  await page.click('.nav-list a[href="/es/precios"]');
  await page.waitForURL("**/es/precios");
  await page.waitForTimeout(800);
  const out = await page.evaluate(() => ({ vt: window.__vt, anims: window.__anims, h1: document.querySelector("h1")?.textContent }));
  out.changed = out.h1 !== before;
  await ctx.close();
  return out;
}
const motion = await navWithSpy("no-preference");
const still = await navWithSpy("reduce");
console.log("view transition, motion allowed:", JSON.stringify(motion));
console.log("view transition, reduced motion:", JSON.stringify(still));
if (!motion.changed || !still.changed) { failed = true; console.log("FAIL: the page did not change after the nav click"); }
if (motion.vt < 1 || motion.anims < 1) { failed = true; console.log("FAIL: the nav click did not run an animated view transition"); }
if (still.anims !== 0) { failed = true; console.log("FAIL: reduced motion still animated a view transition"); }

// ---- 2. Hit areas at 390px --------------------------------------------------
function measureAll(scope) {
  const sel = "a[href], button, input:not([type=hidden]), select, textarea";
  const out = [];
  for (const el of document.querySelectorAll(scope ? scope + " :is(" + sel + ")" : sel)) {
    if (!el.checkVisibility({ visibilityProperty: true, opacityProperty: false })) continue;
    const r0 = el.getBoundingClientRect();
    // The sr-only skip link is a 1px box until it takes focus.
    if (r0.width < 2 || r0.height < 2) continue;
    if (inSentence(el)) { out.push({ el: describe(el), exempt: "inline in a sentence" }); continue; }
    el.scrollIntoView({ block: "center", inline: "center" });
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const inside = (x, y) => { const h = document.elementFromPoint(x, y); return !!h && (h === el || el.contains(h)); };
    // Inputs inside a label take clicks on the label too.
    const lab = el.closest("label");
    const hits = (x, y) => inside(x, y) || (!!lab && (() => { const h = document.elementFromPoint(x, y); return !!h && lab.contains(h); })());
    if (!hits(cx, cy)) { out.push({ el: describe(el), w: 0, h: 0, note: "covered at its centre" }); continue; }
    const span = (dx, dy) => { let n = 0; while (n < 60 && hits(cx + dx * (n + 1), cy + dy * (n + 1))) n++; return n; };
    const w = span(-1, 0) + span(1, 0) + 1, h = span(0, -1) + span(0, 1) + 1;
    if (w < 44 || h < 44) out.push({ el: describe(el), w, h, box: Math.round(r.width) + "x" + Math.round(r.height) });
  }
  return out;
  // An inline link whose line boxes share a line with text outside it.
  function inSentence(el) {
    if (el.tagName !== "A" || getComputedStyle(el).display !== "inline") return false;
    let block = el.parentElement;
    while (block && getComputedStyle(block).display.startsWith("inline")) block = block.parentElement;
    const mine = Array.from(el.getClientRects());
    const walk = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      if (el.contains(n) || !n.textContent.trim()) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      for (const t of r.getClientRects())
        if (t.width > 1 && mine.some((m) => t.top < m.bottom - 2 && t.bottom > m.top + 2)) return true;
    }
    return false;
  }
  function describe(el) {
    const t = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("name") || "").trim().replace(/\s+/g, " ").slice(0, 40);
    const cls = (n) => n.tagName.toLowerCase() + (typeof n.className === "string" && n.className.trim() ? "." + n.className.trim().split(/\s+/).join(".") : "");
    return cls(el.parentElement) + " > " + cls(el) + " \"" + t + "\"";
  }
}
const small = [];
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", hasTouch: true });
const page = await ctx.newPage();
// The consent bar before it is answered.
await page.goto(BASE + "/es", { waitUntil: "networkidle" });
for (const s of await page.evaluate(measureAll, ".consent-card")) small.push("/es (consent open) " + JSON.stringify(s));
await page.click(".consent-card button.cta").catch(() => {});
for (const p of PAGES) {
  await page.goto(BASE + p, { waitUntil: "networkidle" });
  for (const s of await page.evaluate(measureAll)) small.push(p + " " + JSON.stringify(s));
}
// The mobile menu, open.
await page.goto(BASE + "/es", { waitUntil: "networkidle" });
await page.click("#menuToggle");
await page.waitForTimeout(400);
for (const s of await page.evaluate(() => {
  const menu = document.getElementById("nav-menu");
  return Array.from(menu.querySelectorAll("a, button")).map((el) => {
    const r = el.getBoundingClientRect();
    if (!el.checkVisibility() || r.width < 2) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const hits = (x, y) => { const h = document.elementFromPoint(x, y); return !!h && (h === el || el.contains(h)); };
    const span = (dx, dy) => { let n = 0; while (n < 60 && hits(cx + dx * (n + 1), cy + dy * (n + 1))) n++; return n; };
    const w = span(-1, 0) + span(1, 0) + 1, h = span(0, -1) + span(0, 1) + 1;
    return w < 44 || h < 44 ? { el: el.tagName + " " + el.textContent.trim().slice(0, 30), w, h } : null;
  }).filter(Boolean);
})) small.push("/es (menu open) " + JSON.stringify(s));
await browser.close();
const exempt = small.filter((s) => s.includes('"exempt"'));
const under = small.filter((s) => !s.includes('"exempt"'));
console.log("links inside a sentence (exempt):", exempt.length);
for (const s of exempt) console.log("  " + s);
console.log("controls under " + MIN + "px at 390:", under.length);
for (const s of under) console.log("  " + s);
if (under.length) failed = true;
process.exit(failed ? 1 : 0);
