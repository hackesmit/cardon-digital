/**
 * Runnable proof for the CSP (bead hq-fnhrj.6): accept the consent banner,
 * assert nothing from Google loads before consent and the gtag loader reaches
 * www.googletagmanager.com after it, then visit the key
 * pages with consent and count CSP violations (securitypolicyviolation events
 * and console messages). Exit 0 only when the tag loaded and there were none.
 * Use it again before setting CSP_ENFORCE=1.
 *
 * Setup, outside the repo: mkdir /tmp/csp-e2e && cd /tmp/csp-e2e &&
 * npm init -y && npm install playwright-core, then copy this file there.
 *
 *   node csp-proof.mjs http://localhost:3917          # next start, ids set at build
 *   BYPASS=<automation bypass secret> node csp-proof.mjs https://<preview>.vercel.app
 *
 * The preview needs a Vercel protection-bypass secret (project settings,
 * Deployment Protection); revoke it afterwards.
 */
import { chromium } from "playwright-core";
const BASE = process.argv[2] || "http://localhost:3917";
const EXEC = process.env.HOME + "/.cache/ms-playwright/chromium-1237/chrome-linux64/chrome";
const PAGES = ["/es", "/en", "/es/precios", "/en/precios", "/es/contacto", "/es/anuncios", "/es/sitios-web",
  "/es/guias", "/es/guias/cuanto-cuesta-pagina-web", "/es/estilos", "/es/demos", "/en/about", "/es/privacy", "/es/no-existe"];
const browser = await chromium.launch({ executablePath: EXEC, args: ["--no-sandbox"] });
const ctx = await browser.newContext();
// The bypass header goes only to the preview's own origin: a context-wide
// extraHTTPHeaders would also send the secret to Google once consent loads gtag.
if (process.env.BYPASS) {
  const origin = new URL(BASE).origin;
  await ctx.route("**/*", (route) => {
    const req = route.request();
    if (new URL(req.url()).origin !== origin) return route.continue();
    return route.continue({ headers: { ...req.headers(), "x-vercel-protection-bypass": process.env.BYPASS } });
  });
}
await ctx.addInitScript(() => {
  window.__csp = [];
  document.addEventListener("securitypolicyviolation", (e) =>
    window.__csp.push(e.effectiveDirective + " " + (e.blockedURI || "inline") + " " + e.disposition));
});
const page = await ctx.newPage();
const consoleCsp = [];
page.on("console", (m) => { if (/Content Security Policy/i.test(m.text())) consoleCsp.push(page.url() + " :: " + m.text().slice(0, 200)); });
const google = [];
page.on("request", (r) => { const h = new URL(r.url()).hostname; if (/google|doubleclick/.test(h)) google.push(h + new URL(r.url()).pathname); });
const resp = await page.goto(BASE + "/es", { waitUntil: "networkidle" });
console.log("csp header:", (resp.headers()["content-security-policy"] ? "enforced" : resp.headers()["content-security-policy-report-only"] ? "report-only" : "none"));
const before = google.length;
await page.click(".consent-card button.cta");
await page.waitForTimeout(4000);
const gtm = google.filter((u) => u.startsWith("www.googletagmanager.com"));
console.log("google requests before consent:", before);
console.log("googletagmanager requests after consent:", gtm.length, gtm[0] || "");
console.log("other google hosts:", [...new Set(google.map((u) => u.split("/")[0]))].join(", "));
let violations = await page.evaluate(() => window.__csp);
const all = violations.map((v) => "/es(accept) " + v);
for (const p of PAGES) {
  await page.goto(BASE + p, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const v = await page.evaluate(() => window.__csp);
  all.push(...v.map((x) => p + " " + x));
}
console.log("pages visited with consent:", PAGES.length + 1);
console.log("total google requests:", google.length);
console.log("CSP violation events:", all.length); all.slice(0, 20).forEach((v) => console.log("  ", v));
console.log("CSP console messages:", consoleCsp.length); consoleCsp.slice(0, 10).forEach((v) => console.log("  ", v));
await browser.close();
// Fails when any Google request happened before consent, when the loader never
// arrived after consent, or on any CSP violation.
process.exit(before === 0 && gtm.length > 0 && all.length === 0 && consoleCsp.length === 0 ? 0 : 1);
