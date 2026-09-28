import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// vitest compiles this app's JSX with the classic runtime, so React has to be
// a global before the component module loads (same shim as ads-claim.test.ts).
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../../lib/i18n/LocaleProvider";
import { locales, type Locale } from "../../../lib/i18n/config";
import { home } from "../../../lib/i18n/home";

function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out));
  return out;
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

async function render(locale: Locale): Promise<string> {
  const { default: DigitalArc } = await import("./DigitalArc");
  return renderToStaticMarkup(
    React.createElement(LocaleProvider, { locale }, React.createElement(DigitalArc))
  );
}

describe("DigitalArc", () => {
  for (const locale of locales) {
    const arc = home[locale].vis.arc;

    it(`${locale}: frame is an img with the dictionary aria label`, async () => {
      const html = await render(locale);
      expect(html).toMatch(/class="stage-frame arc-stage"[^>]*role="img"/);
      const m = html.match(/aria-label="([^"]*)"/);
      expect(m && decode(m[1])).toBe(arc.aria);
      expect(html).toMatch(/<canvas id="arcCanvas" aria-hidden="true"/);
    });

    it(`${locale}: noscript fallback carries the dictionary sentence`, async () => {
      const html = await render(locale);
      const m = html.match(/<noscript>([\s\S]*?)<\/noscript>/);
      expect(m).not.toBeNull();
      expect(decode(m![1])).toContain(arc.fallback);
      expect(m![1]).toContain("stage-fallback");
    });

    it(`${locale}: every visible string comes from the dictionary`, async () => {
      const html = await render(locale);
      const known = new Set(strings(arc));
      const text = decode(html.replace(/<noscript>[\s\S]*?<\/noscript>/, ""))
        .split(/<[^>]+>/)
        .map((s) => s.trim())
        .filter(Boolean);
      expect(text.length).toBeGreaterThan(0);
      for (const s of text) expect(known.has(s), `hardcoded: ${s}`).toBe(true);
      expect(text).toContain(arc.tagBefore);
      expect(text).toContain(arc.tagMid);
      expect(text).toContain(arc.captionRun);
    });
  }
});
