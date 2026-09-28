import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as app/[locale]/ads-claim.test.ts: vitest compiles this
// app's JSX with the classic runtime, so React must be global before the
// component module loads (hence the dynamic import below).
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../../lib/i18n/LocaleProvider";
import { locales, type Locale } from "../../../lib/i18n/config";
import { software } from "../../../lib/i18n/software";

/**
 * FlowCompress is an SVG, not a canvas, so its no-JS fallback is the markup
 * itself: the server render is the resolved static frame. These checks hold
 * that frame to the dictionary in both locales.
 */
async function render(locale: Locale) {
  const { default: FlowCompress } = await import("./FlowCompress");
  return renderToStaticMarkup(
    React.createElement(LocaleProvider, { locale }, React.createElement(FlowCompress))
  );
}

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

describe("FlowCompress", () => {
  for (const locale of locales) {
    const t = software[locale].vis.ops;

    it(`${locale}: frame carries role=img and the dictionary aria label`, async () => {
      const html = await render(locale);
      const m = html.match(/<svg[^>]*role="img"[^>]*aria-label="([^"]*)"/);
      expect(m).not.toBeNull();
      expect(decode(m![1])).toBe(t.aria);
    });

    it(`${locale}: the static no-JS frame is the resolved state`, async () => {
      const html = await render(locale);
      expect(html).toContain('viewBox="0 0 460 204"');
      expect(html).toContain(">" + t.short + "<");
      expect(html).toContain(">" + t.badge + "<");
    });

    it(`${locale}: every visible string comes from the dictionary`, async () => {
      const html = await render(locale);
      const texts = Array.from(html.matchAll(/>([^<>]+)</g))
        .map((m) => decode(m[1]).trim())
        .filter(Boolean);
      const allowed = new Set(Object.values(t));
      expect(texts.length).toBeGreaterThan(5);
      for (const s of texts) expect(allowed.has(s), s).toBe(true);
      if (locale !== "en") {
        const en = software.en.vis.ops;
        for (const s of texts) {
          if (s === en.unit) continue; // "min" is the same word in both
          expect(Object.values(en).includes(s), s).toBe(false);
        }
      }
    });
  }
});
