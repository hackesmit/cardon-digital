import { describe, expect, it } from "vitest";

import { BLOCKING_SHAPES, EM_DASH } from "../../scripts/copy-check.mjs";
import {
  addOnAvailable,
  addOnMonthly,
  bridgeFeatures,
  featureHours,
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

/**
 * The class review s-273c blocked on (B1), swept rather than patched.
 *
 * /precios publishes one figure per module and then names things that figure
 * does not buy. lib/pricing.ts 567 already carries the rule: a page that names
 * the build a worked example buys has to say the rest is quoted on top. The
 * Restaurante payment link arrived here from lib/i18n/modulos.ts with exactly
 * that clause dropped, printed under the entry price it is not part of, in the
 * same diff that deleted the page's only generic statement that a connector
 * adds to an entry price.
 *
 * Every assertion below reads the entry build out of lib/pricing.ts instead of
 * restating it, so a feature that later moves into S relaxes its own rule.
 */
describe("/precios prices everything it names outside the build it publishes", () => {
  /** A sentence that says this costs money on top of the printed figure. */
  const PRICED_ON_TOP: Record<Locale, RegExp> = {
    en: /quoted on top|quoted separately|costs extra|moves? it up|on top of the figures/i,
    es: /se cotizan?|aparte|por separado|lo suben?|encima de/i,
  };

  /**
   * Things a floor card names that its own entry build does not contain. The
   * feature id is what makes this a data check: the hours assertion below
   * fails, rather than the copy one, if a bundle changes shape.
   */
  const NAMED_OFF_THE_ENTRY_BUILD = [
    {
      module: "restaurante" as const,
      feature: "payment-link-and-qr-connector",
      words: {
        en: /payment link/i,
        es: /enlace de pago|liga de pago/i,
      } as Record<Locale, RegExp>,
    },
    {
      module: "hospitalidad" as const,
      feature: "channel-manager-connector",
      words: {
        en: /channel manager/i,
        es: /channel manager|gestor de canales/i,
      } as Record<Locale, RegExp>,
    },
  ];

  it.each(NAMED_OFF_THE_ENTRY_BUILD)(
    "$feature is genuinely outside $module's entry build",
    ({ module, feature }) => {
      expect(featureHours(module, feature, "S")).toBeNull();
      expect(featureHours(module, feature, "M")).not.toBeNull();
      expect(
        moduleFloors[module].bundle.some((item) => item.feature === feature),
      ).toBe(false);
    },
  );

  it.each(["en", "es"] as const)(
    "%s: a card that names one says it is quoted on top",
    (locale) => {
      const missing: string[] = [];
      for (const { module, words } of NAMED_OFF_THE_ENTRY_BUILD) {
        const card = precios[locale].floors.modules[module];
        // Sentence by sentence, because a card also carries "what moves it
        // up" about tables and units. That clause may not vouch for a
        // connector it never names: the sentence naming the thing is the one
        // that has to price it.
        const naming = [card.tag, card.up, card.limit]
          .join(" ")
          .split(/(?<=\.)\s+/)
          .filter((sentence) => words[locale].test(sentence));
        expect(naming.length).toBeGreaterThan(0);
        if (!naming.some((sentence) => PRICED_ON_TOP[locale].test(sentence))) {
          missing.push(`${module}: ${naming.join(" ")}`);
        }
      }
      expect(missing).toEqual([]);
    },
  );

  it.each(["en", "es"] as const)(
    "%s: the note under the cards still says what moves an entry price up",
    (locale) => {
      // Deleted by this bead's first pass: "more sources, more units, more
      // tables, more vintages, a connector, a second module". It was the only
      // sentence on the page pricing a connector generically.
      const note = precios[locale].floors.note;
      const connector = locale === "en" ? /connector/i : /conector/i;
      const second = locale === "en" ? /second module/i : /segundo m[oó]dulo/i;
      expect(note).toMatch(connector);
      expect(note).toMatch(second);
    },
  );

  it("ads and content are chargeable lines of their own, not part of a floor", () => {
    // The published monthly comes from quote() with no add-ons, so neither of
    // these is inside it, and both cost something when they are quoted.
    expect(addOnAvailable("content", ["hospitalidad"], "S")).toBe(true);
    expect(addOnMonthly("content", "S")).toBeGreaterThan(0);
    expect(addOnAvailable("google-ads-management", ["restaurante"], "S")).toBe(
      false,
    );
    expect(addOnMonthly("google-ads-management", "M")).toBeGreaterThan(0);
    expect(moduleFloors.hospitalidad.monthly).toEqual(
      quote(["hospitalidad"], "S").monthly,
    );
  });

  it.each(["en", "es"] as const)(
    "%s: the ads block prices them and keeps its two conditions",
    (locale) => {
      const { title, body } = precios[locale].ads;
      const text = `${title} ${body}`;
      expect(text).toMatch(PRICED_ON_TOP[locale]);
      // The exclusion lib/pricing.ts states, and the two size conditions.
      expect(text).toMatch(/Producci[oó]n/);
      expect(text).toMatch(/Hospitalidad/);
      expect(text).toMatch(/Restaurante/);
    },
  );
});

/**
 * Two smaller regressions from the same review, both of them a sentence that
 * an earlier round had put there on purpose.
 */
describe("/precios keeps the scoping earlier rounds added", () => {
  it.each(["en", "es"] as const)(
    "%s: the legend still says the build bar is not one of its four colours",
    (locale) => {
      // Reviewer B1, bead hq-wrig5.13 round two. The comment above this key in
      // lib/i18n/precios.ts describes the clause, so it has to be there.
      const note = precios[locale].mix.legendNote;
      const buildBar = locale === "en" ? /build bar/i : /barra de arranque/i;
      expect(note).toMatch(buildBar);
    },
  );

  it("Spanish gives the demo one gender, the one the rest of the site uses", () => {
    const d = precios.es;
    const text = [
      d.floors.demoNote,
      ...Object.values(d.floors.modules).map((m) => m.demo),
    ].join(" ");
    expect(text).not.toMatch(/\bla demo\b|\blas demos\b/i);
    expect(text).toMatch(/\bel demo\b/i);
  });
});
