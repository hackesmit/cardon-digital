import { describe, expect, it } from "vitest";

import { quote } from "../pricing";
import { precios } from "./precios";

/**
 * Copy guards for /precios. Two claims on this page assert facts about the
 * pricing, so they are tested against lib/pricing.ts rather than trusted:
 *
 *  - the early-exit term once said "there is nothing to invoice" at the entry
 *    prices, which is false the moment the page also publishes a mix whose
 *    build the service fee is funding (red-team hq-ggot1.6 R1); and
 *  - the "nothing switches off" pause promise may not be made without naming
 *    the provider bill the winery then carries (ownership-handover.md 5.3,
 *    red-team hq-ggot1.6 R2).
 *
 * These guard both against re-introducing either claim.
 */
describe("precios early-exit term is consistent with the mix it publishes", () => {
  // The page's own worked example: all three modules at their entry size.
  const q = quote(["produccion", "hospitalidad", "restaurante"], "S");
  const funded = q.lines.reduce(
    (sum, line) => sum + Math.max(0, line.mixed - line.packagedSetup),
    0,
  );

  it("the service fee funds part of that build, so early exit is not zero", () => {
    expect(funded).toBeGreaterThan(0);
  });

  it.each(["en", "es"] as const)(
    "%s terms never claim there is nothing to invoice",
    (locale) => {
      const terms = precios[locale].terms.items.join(" ").toLowerCase();
      expect(terms).not.toContain("nothing to invoice");
      expect(terms).not.toContain("nada que facturar");
    },
  );
});

describe("precios pause promise names the provider bill", () => {
  const pausePhrases = ["nothing switches off", "no se apaga nada"];
  // Where the winery keeps running the system, the bill it then carries.
  const billMarkers = ["providers", "proveedores"];

  it.each(["en", "es"] as const)(
    "%s: every surface that makes the pause promise names the ongoing bill",
    (locale) => {
      const d = precios[locale];
      const surfaces = [d.hero.sub, d.monthly.foot];
      for (const text of surfaces) {
        const lower = text.toLowerCase();
        if (pausePhrases.some((p) => lower.includes(p))) {
          expect(
            billMarkers.some((m) => lower.includes(m)) ||
              // the hero names the components directly (hosting/assistant bills)
              lower.includes("bills") ||
              lower.includes("cuentas"),
          ).toBe(true);
        }
      }
    },
  );
});
