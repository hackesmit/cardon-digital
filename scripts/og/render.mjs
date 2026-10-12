import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: process.env.PW_EXEC, headless: true });
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await p.goto("file://" + process.argv[2], { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: process.argv[3], type: "png" });
await b.close(); console.log("og done");
