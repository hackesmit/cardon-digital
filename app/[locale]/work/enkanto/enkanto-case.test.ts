import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { enkanto } from "../../../../lib/i18n/enkanto";
import { locales } from "../../../../lib/i18n/config";

/**
 * Guards for the En'kanto case page (bead hq-cczm.25).
 *
 * The page makes two kinds of promise that prose review is bad at holding.
 * First, it counts things: "twenty screens" is only honest while the three
 * named lists still add up to twenty, and an editor adding a screen to one
 * card would break the basis paragraph silently. Second, it carries a
 * deliberate placeholder for the result section, which must never reach the
 * live site. Both are cheap to assert and expensive to notice by eye.
 */

const pageSource = readFileSync(
  join(process.cwd(), "app/[locale]/work/enkanto/page.tsx"),
  "utf8",
);

/** What the basis paragraph on the page claims, in one place. */
const CLAIMED_SCREENS = 20;
const CLAIMED_MODULES = 3;

describe("the counts the basis paragraph is accountable for", () => {
  for (const locale of locales) {
    const d = enkanto[locale];

    it(`${locale}: names ${CLAIMED_MODULES} modules`, () => {
      expect(d.system.modules).toHaveLength(CLAIMED_MODULES);
    });

    it(`${locale}: the module lists add up to the ${CLAIMED_SCREENS} screens claimed`, () => {
      const named = d.system.modules.flatMap((m) => m.screens);
      expect(named).toHaveLength(CLAIMED_SCREENS);
      // and the basis paragraph states the shape of the split, five, six, nine
      expect(d.system.modules.map((m) => m.screens.length)).toEqual([5, 6, 9]);
    });

    it(`${locale}: no screen is named twice`, () => {
      const named = d.system.modules.flatMap((m) => m.screens);
      expect(new Set(named).size).toBe(named.length);
    });
  }

  it("both locales name the same screens, because the system has one set", () => {
    const es = enkanto.es.system.modules.flatMap((m) => m.screens);
    const en = enkanto.en.system.modules.flatMap((m) => m.screens);
    expect(en).toEqual(es);
  });
});

describe("the result placeholder cannot reach the live site", () => {
  it("is gated on the production deploy flag in the page", () => {
    expect(pageSource).toContain(
      'const isProductionDeploy = process.env.VERCEL_ENV === "production";',
    );
    expect(pageSource).toMatch(/isProductionDeploy \? null : \(/);
  });

  it("still carries a marker a reviewer cannot miss", () => {
    expect(enkanto.en.pending.marker).toMatch(/PLACEHOLDER/);
    expect(enkanto.es.pending.marker).toMatch(/MARCADOR/);
  });
});

describe("what the page is not allowed to say", () => {
  /** Every user-visible string in a locale, flattened. */
  function strings(value: unknown, out: string[] = []): string[] {
    if (typeof value === "string") out.push(value);
    else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
    else if (value && typeof value === "object")
      Object.values(value).forEach((v) => strings(v, out));
    return out;
  }

  for (const locale of locales) {
    const all = strings(enkanto[locale]);

    it(`${locale}: no em dash or decoration glyph (copy doctrine)`, () => {
      const bad = all.filter((s) =>
        /[—←-⇿✀-➿•✓✗]/.test(s),
      );
      expect(bad).toEqual([]);
    });

    it(`${locale}: the growth is stated beside the work, never caused by it`, () => {
      const causal =
        /\bthanks to\b|\bbecause of our\b|\bdriving the growth\b|\bgracias a[l]?\b|\bimpulsad[oa] por\b/i;
      expect(all.filter((s) => causal.test(s))).toEqual([]);
    });

    it(`${locale}: says plainly that the system is not yet in service`, () => {
      const leads = enkanto[locale].system.limits.map((l) => l.lead);
      expect(leads.some((l) => /not yet in service|no está en servicio/i.test(l))).toBe(
        true,
      );
    });

    it(`${locale}: publishes no percentage and no client money figure`, () => {
      expect(all.filter((s) => /\d\s?%|\bpor ciento\b|\bpercent\b/i.test(s))).toEqual(
        [],
      );
      expect(
        all.filter((s) => /(USD|EUR|MXN)\s?[\d.,]+|[\d.,]+\s?(USD|EUR|MXN)/.test(s)),
      ).toEqual([]);
    });
  }
});
