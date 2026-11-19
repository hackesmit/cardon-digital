import { afterEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as the other page suites: vitest compiles this app's
// JSX with the classic runtime, so the page is loaded after this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { locales, type Locale } from "../../../lib/i18n/config";
import { sitios } from "../../../lib/i18n/sitios";
import { fillSitiosVino, sitiosVino } from "../../../lib/i18n/sitios-vino";
import { currencyByLocale, formatPrice, webCareMonthly, webPackageById, webPackages } from "../../../lib/pricing";

/**
 * /sitios-web by brand (bead hq-60dkt): cardondigital.com keeps its websites
 * page; the wine brand serves websites for wineries, the page the winery
 * outreach emails link to. The brand is read at module load, so each case
 * loads the page fresh under its build environment.
 */

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function serve(site: "cardon" | "vino", locale: Locale): Promise<string> {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE", site);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_VINO_URL", "");
  const { LocaleProvider } = await import("../../../lib/i18n/LocaleProvider");
  const Page = (await import("./page")).default;
  return renderToStaticMarkup(
    // eslint-disable-next-line react/no-children-prop
    React.createElement(LocaleProvider, {
      locale,
      children: await Page({ params: Promise.resolve({ locale }) }),
    }),
  );
}

async function meta(site: "cardon" | "vino", locale: Locale) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE", site);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_VINO_URL", "");
  const { generateMetadata } = await import("./page");
  return generateMetadata({ params: Promise.resolve({ locale }) });
}

const text = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

/** Every string in a dictionary, flattened. */
function strings(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(strings);
  if (v && typeof v === "object") return Object.values(v).flatMap(strings);
  return [];
}

describe("the winery website dictionary", () => {
  it.each(locales)("%s types no figure: every amount and day count is a placeholder", (locale) => {
    // The step numbers ("01") are labels, not figures.
    for (const s of strings(sitiosVino[locale]).filter((x) => !/^\d\d$/.test(x))) {
      expect(s, s).not.toMatch(/\$|\bMXN\b|\bUSD\b|\d/);
    }
  });

  it.each(locales)("%s fills every placeholder from lib/pricing.ts", (locale) => {
    const cur = currencyByLocale[locale];
    const entry = webPackageById("presencia");
    const filled = fillSitiosVino(locale, "{name} {price} {care} {min} {max} {allMin} {allMax}", "N");
    expect(filled).toBe(
      [
        "N",
        formatPrice(locale, entry.from[cur]),
        formatPrice(locale, webCareMonthly()[cur]),
        entry.deliveryDays.min,
        entry.deliveryDays.max,
        Math.min(...webPackages.map((p) => p.deliveryDays.min)),
        Math.max(...webPackages.map((p) => p.deliveryDays.max)),
      ].join(" "),
    );
    for (const s of strings(sitiosVino[locale])) expect(fillSitiosVino(locale, s, "N")).not.toMatch(/[{}]/);
  });

  it.each(locales)("%s keeps the house rules: no em dash, no exclamation, no IVA or factura", (locale) => {
    for (const s of strings(sitiosVino[locale])) {
      expect(s, s).not.toMatch(/—|!|\bIVA\b|factura/i);
    }
  });
});

describe.each(locales)("/sitios-web (%s) by brand", (locale) => {
  const d = sitiosVino[locale];

  it("vino: the problems we fix, every package at its price, the En'kanto case, one way to answer", async () => {
    const html = await serve("vino", locale);
    const t = text(html);
    expect(t).toContain(d.hero.eyebrow);
    for (const it of d.fixes.items) {
      expect(t).toContain(it.problem);
      expect(t).toContain(it.fix);
    }
    const cur = currencyByLocale[locale];
    for (const p of webPackages) expect(t).toContain(formatPrice(locale, p.from[cur]));
    expect(t).toContain(formatPrice(locale, webCareMonthly()[cur]));
    expect(html).toContain(`href="/${locale}/work/enkanto"`);
    expect(html).toContain(`href="/${locale}/contacto"`);
    expect(t).toContain(d.close.optout.replace(/"/g, '"'));
    expect(html).toContain('"@type":"FAQPage"');
    // Cardon's own websites page is not what the wine brand shows.
    expect(t).not.toContain(sitios[locale].hero.title);
  });

  it("vino: the title and description are the winery page's, figures filled", async () => {
    const m = await meta("vino", locale);
    expect(JSON.stringify(m)).toContain(d.meta.title);
    expect(JSON.stringify(m)).not.toMatch(/\{(price|min|max)\}/);
  });

  it("cardon: the websites page as it was", async () => {
    const t = text(await serve("cardon", locale));
    expect(t).toContain(sitios[locale].hero.title);
    expect(t).not.toContain(d.fixes.title);
  });
});
