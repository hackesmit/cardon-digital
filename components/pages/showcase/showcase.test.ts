import { describe, expect, it } from "vitest";

import { showcaseEnabled } from "./flag";
import { showcase, type ShowcaseModule } from "../../../lib/i18n/showcase";
import { site } from "../../../lib/i18n/site";
import { locales, type Locale } from "../../../lib/i18n/config";
import { moduleIds } from "../../../lib/pricing";

/**
 * The temporary home swap (bead hq-wrig5.3). Three things are worth a test
 * rather than a screenshot, because a screenshot only shows the branch that
 * was rendered:
 *
 *   1. the flag rule itself, so "unset renders the official home" is checked
 *      rather than asserted,
 *   2. the showcase dictionary carrying no figure, since a public entry price
 *      may not travel away from the build that produced it, and
 *   3. both locales staying in step, in shape and in accents, which is where
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

describe("the showcase dictionary", () => {
  it("keeps the two locales in the same shape", () => {
    expect(keyPaths(showcase.es)).toEqual(keyPaths(showcase.en));
  });

  it("carries the same three modules as the pricing data, in order", () => {
    for (const locale of locales) {
      const mods = showcase[locale].demos.modules as ShowcaseModule[];
      expect(mods.map((m) => m.id)).toEqual([...moduleIds]);
      expect(mods.map((m) => m.num)).toEqual(["01", "02", "03"]);
      for (const m of mods) {
        expect(m.name.length).toBeGreaterThan(0);
        expect(m.tag.length).toBeGreaterThan(0);
        expect(m.line.length).toBeGreaterThan(0);
        // Each button names its own module, so three buttons on one page are
        // three distinct destinations to a screen reader.
        expect(m.demo).toContain(m.name);
      }
    }
  });

  it("prints no figure and no currency", () => {
    // An entry price never travels away from the feature list that produced
    // it (pricing-features.md 3.7 rule 3), and that list is on /precios. The
    // percentages of the combination rule and the day numbers of the
    // diagnostic are one and two digits, so any longer run of digits, any
    // grouped amount and any currency mark is a figure that must not be here.
    for (const locale of locales) {
      for (const s of strings(showcase[locale])) {
        expect(s, s).not.toMatch(/\d{3,}/);
        expect(s, s).not.toMatch(/\d[.,]\d/);
        expect(s, s).not.toMatch(/MXN|USD|\$/);
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
