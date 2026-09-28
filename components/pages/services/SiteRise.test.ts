import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as ads-claim.test.ts: vitest compiles this app's JSX with
// the classic runtime, so React must be global before the component loads.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../../lib/i18n/LocaleProvider";
import { locales } from "../../../lib/i18n/config";
import { sitios } from "../../../lib/i18n/sitios";

/** Every string under a dictionary node, flattened. */
function strings(node: unknown, out: string[] = []): string[] {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => strings(n, out));
  else if (node && typeof node === "object") Object.values(node).forEach((n) => strings(n, out));
  return out;
}

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

describe("SiteRise renders from the sitios dictionary only", async () => {
  const { default: SiteRise } = await import("./SiteRise");
  for (const locale of locales) {
    const t = sitios[locale].vis.rise;
    const html = renderToStaticMarkup(
      React.createElement(LocaleProvider, { locale, children: React.createElement(SiteRise) })
    );

    it(locale + ": frame is an image with the dictionary aria label", () => {
      expect(html).toMatch(/class="stage-frame rise-stage" role="img"/);
      expect(decode(html)).toContain('aria-label="' + t.aria + '"');
      expect(html).toMatch(/<canvas id="riseCanvas"[^>]*aria-hidden="true"/);
    });

    it(locale + ": noscript fallback carries the fallback sentence", () => {
      const m = html.match(/<noscript>([\s\S]*?)<\/noscript>/);
      expect(m).not.toBeNull();
      expect(decode(m![1])).toContain('<div class="stage-fallback">' + t.fallback + "</div>");
    });

    it(locale + ": every visible string is a dictionary string", () => {
      const allowed = new Set(strings(t));
      const text = decode(html.replace(/<[^>]+>/g, "\n"))
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      expect(text.length).toBeGreaterThan(0);
      for (const s of text) expect(allowed.has(s), s).toBe(true);
    });
  }
});
