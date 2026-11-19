import { afterEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as winery-page.test.ts: vitest compiles this app's JSX
// with the classic runtime, so the page is loaded with a dynamic import after
// this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { locales, type Locale } from "../../../lib/i18n/config";
import { about, aboutVino } from "../../../lib/i18n/about";

/**
 * /about split by brand (bead hq-3f6ut.3): cardondigital.com tells the story
 * it tells every owner-run business, the wine brand keeps the brief's winery
 * mission. Loaded fresh under each build environment (lib/brand.ts reads it
 * at module load), the way lib/brand.test.ts does.
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

/** The winemaking words of the brief's mission. */
const WINE_MISSION = /\b(vintages?|añadas?|winemaking|hacer vino|bodegas?|wineries)\b/i;

describe.each(locales)("/about (%s) by brand", (locale) => {
  it("cardon: the story for any business, with no winery mission", async () => {
    const html = await serve("cardon", locale);
    expect(html).toContain(about[locale].hero.title);
    expect(html).toContain(about[locale].mission.title);
    for (const s of [about[locale].meta.description, about[locale].hero.sub, ...about[locale].mission.body, ...about[locale].beliefs.body]) {
      expect(s, s).not.toMatch(WINE_MISSION);
    }
  });

  it("vino: the brief's winery mission", async () => {
    const html = await serve("vino", locale);
    expect(html).toContain(aboutVino[locale].mission.title);
    expect(html).not.toContain(about[locale].mission.title);
  });
});
