import { describe, expect, it } from "vitest";

import { BLOCKING_SHAPES, EM_DASH } from "../../scripts/copy-check.mjs";
import {
  bridgeFeatures,
  moduleFloors,
  moduleIds,
  quote,
  workedExamples,
} from "../pricing";
import type { Locale } from "./config";
import {
  bridgesSentence,
  comboName,
  comboPricingClause,
  mixRankingSentence,
  mixRules,
  precios,
} from "./precios";

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

/**
 * The sentences a visitor reads that no lexical check can see.
 *
 * docs/copy-doctrine.md records the gap and says to read these by eye:
 * scripts/copy-check.mjs reads one dictionary string at a time, and /precios
 * composes several of its sentences at render out of dictionary parts plus
 * lib/pricing.ts data. The ranking sentence, every combination row's name and
 * its pricing clause, the bridges sentence, the filled combination rules, the
 * headline split across two elements and a repeated feature line all exist only
 * once the page runs, so the checker has never seen one of them.
 *
 * Reading them by eye is what the doctrine could ask for. This is the same read
 * done by the checker's own exported rules, so it holds for every future edit
 * instead of for the afternoon someone looked. It imports BLOCKING_SHAPES and
 * EM_DASH from the script rather than restating them, so a rule that widens
 * there widens here too.
 */
describe("the sentences /precios composes at runtime", () => {
  /** Every string the page renders that the checker never sees whole. */
  function assembled(locale: Locale): string[] {
    const d = precios[locale];
    const out: string[] = [];

    // The headline, which is one sentence split across two elements.
    out.push(d.hero.t1 + d.hero.accent);

    // The combination rules, with the percentages filled from the data.
    out.push(...mixRules(locale));

    // Every publishable row of the seven-combination table: what it is called,
    // and the clause under the name saying how it was priced.
    for (const example of workedExamples.filter((e) => e.publishable)) {
      out.push(comboName(locale, example.modules));
      out.push(comboPricingClause(locale, example.quote.lines));
      const bridges = bridgesSentence(locale, bridgeFeatures(example.modules));
      if (bridges !== "") out.push(bridges);
    }

    // The worked example's ranking sentence, lead plus composed clause.
    const three = workedExamples.find(
      (e) => e.publishable && e.modules.length === 3,
    )!;
    out.push(mixRankingSentence(locale, three.modules));

    // A card: the module name beside the result it is named for, and every
    // build line including the ones that carry a multiplicity suffix.
    for (const id of moduleIds) {
      const m = d.floors.modules[id];
      out.push(`${m.name}. ${m.tag}`);
      for (const item of moduleFloors[id].bundle) {
        const name = d.features[item.feature];
        out.push(
          item.count > 1
            ? name + d.countSuffix.replace("{n}", String(item.count))
            : name,
        );
      }
    }

    return out;
  }

  it.each(["en", "es"] as const)(
    "%s: no assembled sentence carries a shape the doctrine blocks",
    (locale) => {
      const hits: string[] = [];
      for (const sentence of assembled(locale)) {
        // The checker matches with the emphasis markers stripped, so this does.
        const text = sentence.replace(/\*\*|__/g, "").replace(/\|/g, " ");
        for (const shape of BLOCKING_SHAPES) {
          if (shape.locale !== locale) continue;
          shape.re.lastIndex = 0;
          if (shape.re.test(text)) hits.push(`${shape.id} in: ${sentence}`);
        }
        EM_DASH.lastIndex = 0;
        if (EM_DASH.test(text)) hits.push(`em dash in: ${sentence}`);
      }
      expect(hits).toEqual([]);
    },
  );

  it.each(["en", "es"] as const)(
    "%s: every assembled sentence is complete, with no placeholder left in it",
    (locale) => {
      // A brace that survives is a published sentence with {list} in it, which
      // is the failure mode the composing functions throw to avoid.
      const left = assembled(locale).filter((s) => /[{}]/.test(s));
      expect(left).toEqual([]);
    },
  );

  it("checks more than a handful, so a row dropping out is visible", () => {
    // Seven combinations, two of them carrying a bridge sentence, plus the
    // rules, the ranking sentence, the headline and three cards with their
    // build lists. If this number collapses the guard has stopped guarding.
    expect(assembled("en").length).toBeGreaterThan(40);
    expect(assembled("es").length).toBe(assembled("en").length);
  });
});
