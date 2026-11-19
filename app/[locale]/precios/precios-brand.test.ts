import { afterEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Same test-only shim as winery-page.test.ts: vitest compiles this app's JSX
// with the classic runtime, so the page is loaded with a dynamic import after
// this assignment.
(globalThis as unknown as { React: typeof React }).React = React;

import { locales, type Locale } from "../../../lib/i18n/config";
import { precios } from "../../../lib/i18n/precios";

/**
 * /precios split by brand (bead hq-3f6ut.3): cardondigital.com prices the
 * websites and the ads and says how custom software is quoted, with no module
 * and no module price; the wine brand prices the modules. The page reads the
 * brand at module load (lib/brand.ts), so each case loads it fresh under its
 * build environment, the way lib/brand.test.ts does.
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

const MODULE_NAMES = /\b(Produccion|Producción|Hospitalidad|Restaurante)\b/;

describe.each(locales)("/precios (%s) by brand", (locale) => {
  const d = precios[locale];

  it("cardon: websites, ads and custom software, and no module or module price", async () => {
    const html = await serve("cardon", locale);
    expect(html).toContain('id="paquetes"');
    expect(html).toContain('href="#paquetes"');
    expect(html).toContain(d.hero.adsHead.kicker);
    expect(html).toContain(d.cardon.software.title);
    expect(html).not.toMatch(MODULE_NAMES);
    expect(html).not.toMatch(/\b(modules?|módulos?)\b/i);
    expect(html).not.toContain(d.floors.title);
    expect(html).not.toContain(d.mix.title);
    expect(html).not.toContain(d.hero.softwareHead.founding.kicker);
    expect(html).not.toContain('id="arme"');
  });

  it("vino: the modules, without the website and ads sections", async () => {
    const html = await serve("vino", locale);
    expect(html).toContain(d.floors.title);
    expect(html).toMatch(MODULE_NAMES);
    expect(html).not.toContain('id="paquetes"');
    expect(html).toContain('href="#software"');
    expect(html).toContain('id="software"');
    expect(html).not.toContain(d.cardon.software.title);
  });
});

describe.each(locales)("/precios (%s) on the wine brand, hero and websites", (locale) => {
  const d = precios[locale];

  it("vino: the hero names no ads and no non-wine client; the page links the winery website page", async () => {
    const html = (await serve("vino", locale)).replace(/&#x27;/g, "'");
    expect(html).toContain(d.vino.sub);
    expect(html).not.toContain(d.cardon.sub);
    // The hero only: the builder and the terms below price the ads add-on to a module.
    const hero = html.slice(html.indexOf('class="hero"'), html.indexOf("</section>", html.indexOf('class="hero"')));
    expect(hero).toContain(d.vino.sub);
    expect(hero).not.toMatch(/Aperta|anuncios|\bads?\b|ad management|pago por contacto|fee per contact/i);
    expect(html).not.toMatch(/Aperta/);
    expect(html).toContain(`href="/${locale}/sitios-web"`);
    expect(html).toContain(d.vino.web.title);
  });

  it("cardon: keeps its hero and shows no wine website line", async () => {
    const html = await serve("cardon", locale);
    expect(html).not.toContain(d.vino.web.title);
    expect(html).not.toContain(d.vino.sub);
  });
});
