import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as app/[locale]/ads-claim.test.ts: vitest compiles this
// app's JSX with the classic runtime, so React must be global before the
// component module loads, hence the dynamic import below.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../../lib/i18n/LocaleProvider";
import { anuncios } from "../../../lib/i18n/anuncios";
import { locales, type Locale } from "../../../lib/i18n/config";

async function render(locale: Locale): Promise<string> {
  const { default: ReachMap } = await import("./ReachMap");
  return renderToStaticMarkup(
    // LocaleProvider declares children as required, see winery-page.test.ts.
    // eslint-disable-next-line react/no-children-prop
React.createElement(LocaleProvider, { locale, children: React.createElement(ReachMap) })
  );
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

/** Every string the dictionary gives the visual, flattened. */
function dictStrings(locale: Locale): string[] {
  const r = anuncios[locale].vis.reach;
  const out: string[] = [];
  for (const v of Object.values(r)) {
    if (typeof v === "string") out.push(v);
  }
  for (const q of r.queries) out.push(q.t);
  return out;
}

describe("ReachMap", () => {
  for (const locale of locales) {
    it(`renders the frame, aria label and noscript fallback in ${locale}`, async () => {
      const html = decode(await render(locale));
      const r = anuncios[locale].vis.reach;
      expect(html).toContain('role="img"');
      expect(html).toContain(`aria-label="${r.aria}"`);
      expect(html).toContain('id="reachCanvas"');
      expect(html).toContain('aria-hidden="true"');
      expect(html).toMatch(/<noscript>.*stage-fallback/);
      expect(html).toContain(r.fallback);
      expect(html).toContain(r.tagBefore);
      expect(html).toContain(r.tagMid);
      expect(html).toContain(r.captionRun);
    });

    it(`shows no text that is not in the ${locale} dictionary`, async () => {
      const html = decode(await render(locale));
      const known = new Set(dictStrings(locale));
      const texts = html
        .replace(/<[^>]+>/g, "\n")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      expect(texts.length).toBeGreaterThan(0);
      for (const s of texts) expect(known.has(s), s).toBe(true);
      const attrs = Array.from(html.matchAll(/aria-label="([^"]*)"/g)).map((m) => m[1]);
      for (const a of attrs) expect(known.has(a), a).toBe(true);
    });
  }

  it("draws canvas text only from the dictionary (no string literal is fillText'd)", () => {
    const src = readFileSync(new URL("./ReachMap.tsx", import.meta.url), "utf8");
    const calls = Array.from(src.matchAll(/fillText\(\s*([^,]+),/g)).map((m) => m[1].trim());
    expect(calls.length).toBeGreaterThan(0);
    for (const arg of calls) {
      // The only literal allowed is the digit zero of an emptied counter.
      if (arg.startsWith('"')) expect(arg).toBe('"0"');
    }
  });
});
