import { afterEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as the other page tests: vitest compiles this app's JSX
// with the classic runtime, so the page is loaded with a dynamic import after
// this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../../lib/i18n/LocaleProvider";
import { locales, localePath, type Locale } from "../../../lib/i18n/config";
import { negocioLocal, negocioLocalMeta } from "../../../lib/i18n/negocio-local";
import { sitios } from "../../../lib/i18n/sitios";
import {
  currencyByLocale,
  formatPrice,
  webCareMonthly,
  webPackageById,
  webPackages,
} from "../../../lib/pricing";
import { brandConfig } from "../../../lib/brand";

/**
 * Guards for /negocio-local (bead hq-4l9oj), held against what the page
 * SERVES: the offer is the one-page package and nothing else, every figure
 * comes from lib/pricing.ts, every feature it lists is that package's, the
 * doors reach Daniel, the opt-out line is there, and no placeholder, typed
 * price, invoice promise or em dash reaches the reader.
 */

async function serve(locale: Locale): Promise<string> {
  vi.resetModules();
  const Page = (await import("./page")).default;
  return renderToStaticMarkup(
    // eslint-disable-next-line react/no-children-prop
    React.createElement(LocaleProvider, {
      locale,
      children: await Page({ params: Promise.resolve({ locale }) }),
    }),
  );
}

const decode = (s: string) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const text = (html: string) =>
  decode(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

const presencia = webPackageById("presencia");

afterEach(() => {
  vi.unstubAllEnvs();
});

describe.each(locales)("/negocio-local (%s)", (locale) => {
  const cur = currencyByLocale[locale];
  const d = negocioLocal[locale];

  it("prints the one-page package's price, care fee and delivery days from lib/pricing.ts", async () => {
    const t = text(await serve(locale));
    expect(t).toContain(formatPrice(locale, presencia.from[cur]));
    expect(t).toContain(formatPrice(locale, webCareMonthly()[cur]));
    expect(t).toContain(`${presencia.deliveryDays.min}`);
    expect(t).toContain(`${presencia.deliveryDays.max}`);
    // No other package's price: the page sells one thing.
    for (const p of webPackages) {
      if (p.id === "presencia") continue;
      expect(t).not.toContain(formatPrice(locale, p.from[cur]));
    }
  });

  it("lists exactly the one-page package's features, named as on /sitios-web", async () => {
    const html = await serve(locale);
    const items = [...html.matchAll(/<ul class="local-feats">([\s\S]*?)<\/ul>/g)][0][1];
    const labels = [...items.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => decode(m[1]));
    expect(labels).toEqual(presencia.features.map((f) => sitios[locale].packages.features[f]));
  });

  it("leaves no placeholder, typed amount, em dash or invoice promise in the copy", async () => {
    const html = await serve(locale);
    const t = text(html);
    expect(t).not.toMatch(/\{(min|max|price|care)\}/);
    expect(html).not.toMatch(/\{(min|max|price|care)\}/);
    expect(t).not.toContain("—");
    expect(t).not.toMatch(/factura|IVA|invoice/i);
    // Amounts are rendered from pricing; the dictionary types none.
    expect(JSON.stringify(d)).not.toMatch(/\d[\d,.]*\s*(MXN|USD)|\$\s?\d/);
  });

  it("has one h1 and a contact door that reaches /contacto", async () => {
    const html = await serve(locale);
    expect(html.match(/<h1[\s>]/g)?.length).toBe(1);
    expect(html).toContain(`href="${localePath(locale, "/contacto")}"`);
    expect(text(html)).toContain(d.close.optout);
  });

  it("shows the WhatsApp door with the page's own prefill when the build has a number", async () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP", "+52 646 000 0000");
    const html = await serve(locale);
    expect(html).toContain(`href="https://wa.me/526460000000?text=${encodeURIComponent(d.prefill)}"`);
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP", "");
    expect(await serve(locale)).not.toContain("wa.me");
  });

  it("fills the meta description with the real figures", () => {
    const meta = negocioLocalMeta(locale);
    expect(meta.description).toContain(formatPrice(locale, presencia.from[cur]));
    expect(meta.description).not.toMatch(/\{/);
  });
});

describe("/negocio-local belongs to cardondigital.com only", () => {
  it("is on the cardon route list and not on the wine brand's", () => {
    expect(brandConfig({}).routes).toContain("/negocio-local");
    expect(brandConfig({ site: "vino" }).routes).not.toContain("/negocio-local");
  });
});
