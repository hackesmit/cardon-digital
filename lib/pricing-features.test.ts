import { describe, expect, it } from "vitest";

import { estimate, type BuilderSelection, type Priced } from "@/lib/builder";
import {
  moduleIds,
  webFeaturePrices,
  webPackageById,
  webPackagePrice,
  webPackages,
  type AdsScopeId,
  type ModuleId,
} from "@/lib/pricing";

/**
 * The website feature split (hq-lgjo.6) checked in integer cents, over every
 * combination a client can tick (review prep, hq-lgjo.12).
 *
 * Every figure is turned into cents with an exact integer check, and every sum
 * is redone in cents, so a float that drifts by a fraction of a peso (0.1 +
 * 0.2 style) fails here instead of reaching /precios or the lead email.
 */

const CURRENCIES = ["MXN", "USD"] as const;

/** Cents of a whole-unit price; throws on anything that is not a whole, safe, non-negative number. */
function cents(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error("not a whole price: " + value);
  const c = value * 100;
  if (!Number.isSafeInteger(c)) throw new Error("cents overflow: " + value);
  return c;
}

function centsOf(p: Priced): Record<"MXN" | "USD", number> {
  return { MXN: cents(p.MXN), USD: cents(p.USD) };
}

/** Every subset of a list, the empty one included. */
function subsets<T>(list: readonly T[]): T[][] {
  const out: T[][] = [];
  for (let mask = 0; mask < 1 << list.length; mask++) out.push(list.filter((_, i) => mask & (1 << i)));
  return out;
}

describe("website feature prices in integer cents", () => {
  it("every feature price is whole: pesos in steps of 50, dollars in whole dollars", () => {
    for (const p of webPackages) {
      for (const f of webFeaturePrices(p.id)) {
        const c = centsOf(f.price);
        expect(c.MXN % 5000, p.id + " " + f.id).toBe(0);
        expect(c.USD % 100, p.id + " " + f.id).toBe(0);
      }
    }
  });

  it("for every set of unticked features, the price is the cents of what stays, never above the published price", () => {
    let checked = 0;
    for (const p of webPackages) {
      const parts = webFeaturePrices(p.id);
      const optional = parts.filter((f) => !f.required).map((f) => f.id);
      const full = centsOf(p.from);
      const floor = centsOf(webPackagePrice(p.id, optional));
      for (const off of subsets(optional)) {
        const got = centsOf(webPackagePrice(p.id, off));
        const kept = parts.filter((f) => !off.includes(f.id));
        for (const cur of CURRENCIES) {
          const want = kept.reduce((a, f) => a + cents(f.price[cur]), 0);
          expect(got[cur], p.id + " without " + off.join("+")).toBe(want);
          expect(got[cur]).toBeLessThanOrEqual(full[cur]);
          expect(got[cur]).toBeGreaterThanOrEqual(floor[cur]);
          // What was taken off plus what stays is the published price, to the cent.
          const taken = parts.filter((f) => off.includes(f.id)).reduce((a, f) => a + cents(f.price[cur]), 0);
          expect(got[cur] + taken).toBe(full[cur]);
        }
        checked++;
      }
    }
    // presencia 2^4, negocio 2^8, reservas 2^13, tienda 2^13 optional subsets.
    expect(checked).toBeGreaterThan(16000);
  });

  it("the floor is the design alone, and it is a positive price", () => {
    for (const p of webPackages) {
      const parts = webFeaturePrices(p.id);
      const all = parts.map((f) => f.id);
      const design = parts.find((f) => f.id === "custom-design")!;
      expect(webPackagePrice(p.id, all)).toEqual(design.price);
      expect(design.price.MXN).toBeGreaterThan(0);
      expect(design.price.USD).toBeGreaterThan(0);
    }
  });

  it("unknown, duplicated or required ids in the omitted list never change the price", () => {
    for (const p of webPackages) {
      expect(webPackagePrice(p.id, ["custom-design", "aeo-ready", "nope", ""])).toEqual(p.from);
      const one = webFeaturePrices(p.id).find((f) => !f.required && f.price.MXN > 0)!;
      expect(webPackagePrice(p.id, [one.id, one.id, one.id])).toEqual(webPackagePrice(p.id, [one.id]));
    }
  });

  it("estimate totals stay whole and add up in cents for every feature set, with care, ads and software", () => {
    const adsChoices: (AdsScopeId | null)[] = [null, "local", "crecimiento"];
    const moduleChoices: ModuleId[][] = [[], [moduleIds[0]], [...moduleIds]];
    let checked = 0;
    for (const p of webPackages) {
      const optional = webFeaturePrices(p.id).filter((f) => !f.required).map((f) => f.id);
      // Every subset for the small packages; a stride over the large ones keeps the run short.
      const sets = subsets(optional);
      const stride = sets.length > 512 ? 37 : 1;
      for (let i = 0; i < sets.length; i += stride) {
        for (const care of [false, true]) {
          for (const ads of adsChoices) {
            for (const modules of moduleChoices) {
              const sel: BuilderSelection = { web: p.id, webOff: sets[i], care, ads, modules };
              const est = estimate(sel)!;
              const setup = centsOf(est.setup);
              const monthly = centsOf(est.monthly);
              const yearOne = centsOf(est.yearOne);
              const web = est.lines.find((l) => l.kind === "web");
              if (!web || web.kind !== "web") throw new Error("no web line");
              expect(web.full).toEqual(webPackageById(p.id).from);
              for (const cur of CURRENCIES) {
                const lineSetups = est.lines.reduce(
                  (a, l) => a + ("setup" in l ? cents(l.setup[cur]) : 0),
                  0,
                );
                const lineMonthly = est.lines.reduce(
                  (a, l) =>
                    a + (l.kind === "care" ? cents(l.monthly[cur]) : l.kind === "ads" ? cents(l.base[cur]) : l.kind === "software" ? cents(l.monthly[cur]) : 0),
                  0,
                );
                expect(setup[cur]).toBe(lineSetups);
                expect(monthly[cur]).toBe(lineMonthly);
                expect(yearOne[cur]).toBe(setup[cur] + 12 * monthly[cur]);
              }
              checked++;
            }
          }
        }
      }
    }
    expect(checked).toBeGreaterThan(1000);
  });
});
