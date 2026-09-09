import { describe, expect, it } from "vitest";

import { showcaseEnabled } from "./flag";
import { allModules, demoHref, demoIsLive, DEMO_PATH } from "../../../lib/demo";
import {
  showcase,
  type ProblemItem,
  type ShowcaseModule,
} from "../../../lib/i18n/showcase";
import { modulos } from "../../../lib/i18n/modulos";
import { precios } from "../../../lib/i18n/precios";
import { site } from "../../../lib/i18n/site";
import { locales, type Locale } from "../../../lib/i18n/config";
import { moduleIds } from "../../../lib/pricing";

/**
 * The one feedback page (beads hq-wrig5.3 and hq-wrig5.15). What is worth a
 * test rather than a screenshot, because a screenshot only shows the branch
 * that was rendered:
 *
 *   1. the flag rule itself, so "unset renders the official home" is checked
 *      rather than asserted,
 *   2. the demo buttons: one per module plus all three, every one of them
 *      pointing somewhere real while the demo host is down,
 *   3. the showcase dictionary carrying no figure and no second copy of a
 *      module description, since the descriptions on the page are rendered
 *      from lib/i18n/modulos.ts and a price may not travel away from the build
 *      that produced it,
 *   4. the six problems being six, in both locales, and
 *   5. both locales staying in step, in shape and in accents, which is where
 *      an ES dictionary copied from the EN one has gone wrong on this rig
 *      before.
 */

/** Every display string in a dictionary, ignoring ids, which stay ASCII. */
function strings(value: unknown, key = ""): string[] {
  if (typeof value === "string") return key === "id" ? [] : [value];
  if (Array.isArray(value)) return value.flatMap((v) => strings(v, key));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => strings(v, k));
  }
  return [];
}

/** The shape of a dictionary: every key path, sorted. */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => keyPaths(v, prefix + "[" + i + "]"));
  }
  if (value && typeof value === "object") {
    return Object.entries(value)
      .flatMap(([k, v]) => keyPaths(v, prefix ? prefix + "." + k : k))
      .sort();
  }
  return [prefix];
}

describe("the SHOWCASE flag", () => {
  it("renders the showcase only for the exact value 1", () => {
    expect(showcaseEnabled({ SHOWCASE: "1" })).toBe(true);
  });

  it("renders the official home when the variable is unset", () => {
    expect(showcaseEnabled({})).toBe(false);
    expect(showcaseEnabled({ SHOWCASE: undefined })).toBe(false);
  });

  it("does not treat a truthy-looking value as set", () => {
    for (const value of ["0", "", "true", "yes", "showcase", "01", " 1"]) {
      expect(showcaseEnabled({ SHOWCASE: value })).toBe(false);
    }
  });
});

describe("the demo buttons", () => {
  it("sends every button to the locale placeholder while the host is down", () => {
    // The host is not up yet (bead hq-ko3a0.6), so a button that quietly
    // pointed at demo.cardondigital.com would be a dead link on a page we are
    // sending out for feedback.
    expect(demoIsLive).toBe(false);
    for (const locale of locales as readonly Locale[]) {
      for (const id of moduleIds) {
        expect(demoHref(locale, [id])).toBe("/" + locale + DEMO_PATH);
      }
      expect(demoHref(locale, allModules)).toBe("/" + locale + DEMO_PATH);
    }
  });

  it("offers one button per module and one for all three", () => {
    expect([...allModules]).toEqual([...moduleIds]);
    for (const locale of locales as readonly Locale[]) {
      const mods = showcase[locale].demos.modules as ShowcaseModule[];
      expect(mods.map((m) => m.id)).toEqual([...moduleIds]);
      for (const m of mods) {
        // Each button names its own module, so four buttons on one page are
        // four distinct destinations to a screen reader.
        expect(m.demo).toContain(m.name);
      }
      expect(showcase[locale].demos.all.length).toBeGreaterThan(0);
      expect(showcase[locale].demos.allAria.length).toBeGreaterThan(0);
    }
  });

  it("labels each button with the name the pricing page uses", () => {
    for (const locale of locales as readonly Locale[]) {
      const names = precios[locale].floors.modules;
      for (const m of showcase[locale].demos.modules as ShowcaseModule[]) {
        expect(m.name).toBe(names[m.id as keyof typeof names].name);
      }
    }
  });
});

describe("the showcase dictionary", () => {
  it("keeps the two locales in the same shape", () => {
    expect(keyPaths(showcase.es)).toEqual(keyPaths(showcase.en));
  });

  it("states six problems, each with a heading and a body", () => {
    for (const locale of locales as readonly Locale[]) {
      const items = showcase[locale].problem.items as ProblemItem[];
      expect(items).toHaveLength(6);
      for (const item of items) {
        expect(item.h.length).toBeGreaterThan(0);
        expect(item.body.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps no second copy of a module description", () => {
    // The three descriptions and the seven combinations on this page are
    // rendered from lib/i18n/modulos.ts through the same components /modulos
    // renders. A sentence of that copy appearing here as well would be a
    // second thing to keep true (bead hq-wrig5.15). The diagnostic block is
    // out of this check on purpose: every page on the site carries its own
    // copy of those four lines already, which is the house idiom and not
    // something this bead introduced.
    for (const locale of locales as readonly Locale[]) {
      const mine = new Set(strings(showcase[locale]));
      const theirs = [
        ...strings(modulos[locale].modules),
        ...strings(modulos[locale].combina),
      ];
      for (const line of theirs) {
        if (line.length < 40) continue;
        expect(mine.has(line), line).toBe(false);
      }
    }
  });

  it("prints no figure and no currency", () => {
    // An entry price never travels away from the feature list that produced
    // it (pricing-features.md 3.7 rule 3), and that list is rendered by the
    // pricing components from lib/pricing.ts. The percentages of the
    // combination rule and the day numbers of the diagnostic are one and two
    // digits, so any longer run of digits, any grouped amount and any currency
    // mark is a figure that must not be here. A four-digit calendar year is
    // not a figure, so the one in the problem list is taken out first.
    const withoutYears = (s: string) => s.replace(/\b(?:19|20)\d{2}\b/g, "");
    for (const locale of locales) {
      for (const s of strings(showcase[locale])) {
        const bare = withoutYears(s);
        expect(bare, s).not.toMatch(/\d{3,}/);
        expect(bare, s).not.toMatch(/\d[.,]\d/);
        expect(bare, s).not.toMatch(/MXN|USD|\$/);
      }
    }
  });

  it("writes no em dash and no decoration glyph", () => {
    for (const locale of locales) {
      for (const s of strings(showcase[locale])) {
        // Escaped rather than literal so the rule can live in a file the
        // rule itself applies to: em dash, en dash, arrow, check, cross, bullet.
        expect(s, s).not.toMatch(/[\u2014\u2013\u2192\u2713\u2717\u2022]/);
      }
    }
  });

  it("accents the Spanish copy, including the metadata block", () => {
    // hq-wrig5.1 shipped an ES meta block copied from the EN dictionary and
    // left unaccented while its own body carried the accents, so the meta
    // block is checked first and then the whole dictionary.
    expect(showcase.es.meta.title).toContain("módulos");
    expect(showcase.es.meta.title).toContain("Producción");
    expect(showcase.es.meta.description).toContain("módulo");

    const unaccented =
      /\b(modulos|Modulos|Produccion|produccion|tamano|operacion|combinacion|anada|anadas|telefono|dias|Dia|informacion)\b/;
    for (const s of strings(showcase.es)) {
      expect(s, s).not.toMatch(unaccented);
    }
  });
});

describe("the nav", () => {
  it("carries a modules and a pricing label in both locales", () => {
    for (const locale of locales as readonly Locale[]) {
      const nav = site[locale].nav;
      expect(nav.modules.length).toBeGreaterThan(0);
      expect(nav.pricing.length).toBeGreaterThan(0);
      expect(nav.modules).not.toBe(nav.pricing);
    }
    expect(site.es.nav.modules).toBe("Módulos");
    expect(site.es.nav.pricing).toBe("Precios");
  });
});
