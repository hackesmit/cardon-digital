import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// vitest transforms this app's JSX with the classic runtime, so the page's
// createElement calls resolve a global React; Next itself uses the automatic
// runtime and needs no import. This shim is test-only, and it is the same one
// components/site/Media.test.tsx uses. The page builds its card glyphs at
// module scope, so its JSX runs the moment it is imported: it is loaded with a
// dynamic import inside serve(), which happens after the assignment below,
// where a static import would have run before it.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../../../lib/i18n/LocaleProvider";
import { locales, type Locale } from "../../../../lib/i18n/config";
import { addOnAvailable, addOnMonthly } from "../../../../lib/pricing";
import { precios } from "../../../../lib/i18n/precios";
import { site } from "../../../../lib/i18n/site";
import { winery } from "../../../../lib/i18n/winery";

/**
 * Guards for the winery page (bead hq-4pu0q.6, fix round).
 *
 * Round one passed every gate the bead named and still shipped three defects
 * the gates are blind to, so each one is pinned here against what the page
 * SERVES rather than against what its dictionary declares.
 *
 *  1. Emphasis. scripts/copy-check.mjs reads lib/i18n only, so bold written as
 *     a literal <b> in page.tsx is invisible to it: the checker reported one
 *     span for a page rendering five. The doctrine caps the PAGE at three
 *     (docs/copy-doctrine.md section 7 rule 2) and says so in as many words,
 *     "Counting only ** would leave the rule one sed away from being bypassed
 *     with the page still shouting". These cases count the served markup and
 *     require every span to trace back to a marker in a dictionary, which is
 *     the only place the checker can see it.
 *  2. The ads claim. lib/i18n/precios.ts owns pricing policy and states twice
 *     in each locale that ad management attaches to Hospitalidad and
 *     Restaurante and never to Produccion. This page sells Produccion, so a
 *     card promising ads inside the monthly fee has to name the condition.
 *     Two rewrites in a row dropped that clause (the home page in s-730f, this
 *     page here), which is why it is a test and not a note.
 *  3. The notice term. "de cualquier parte" is "from anywhere"; the term has
 *     to say who may give notice, in the shape precios uses.
 *
 * hq-4pu0q.14 generalises 1 into copy-check and hq-4pu0q.15 generalises 2
 * across every page. These cases hold this page while that work is queued.
 */

/** Doctrine section 7 rule 2, and "Banned constructions": three, page-wide. */
const EMPHASIS_CAP = 3;

const pageSource = readFileSync(
  join(process.cwd(), "app/[locale]/industries/winery/page.tsx"),
  "utf8",
);

/** Every capture of a global pattern, without needing matchAll. */
function captures(pattern: string, flags: string, text: string): string[] {
  const re = new RegExp(pattern, flags.indexOf("g") < 0 ? flags + "g" : flags);
  const out: string[] = [];
  let m = re.exec(text);
  while (m !== null) {
    out.push(m[1]);
    m = re.exec(text);
  }
  return out;
}

/** Every string in a value, however deeply nested. */
function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object")
    Object.keys(value).forEach((k) =>
      strings((value as Record<string, unknown>)[k], out),
    );
  return out;
}

/**
 * Every emphasis span THIS LOCALE declares, read off the dictionary objects the
 * page renders from rather than off the file text, so the es half can never
 * vouch for a span served in en. Both markers count, because both render
 * emphasis and the doctrine counts both.
 */
function declaredSpans(locale: Locale): string[] {
  const out: string[] = [];
  for (const text of strings(winery[locale]).concat(strings(site[locale]))) {
    for (const span of captures("\\*\\*([^*]+)\\*\\*", "g", text)) out.push(span.trim());
    for (const span of captures("__([^_]+)__", "g", text)) out.push(span.trim());
  }
  return out;
}

/** The page as a visitor gets it: server-rendered markup, one locale. */
async function serve(locale: Locale): Promise<string> {
  const WineryPage = (await import("./page")).default;
  // LocaleProvider's own props declare `children` as REQUIRED, so the third
  // argument form does not typecheck (TS2769) and the prop form is the correct
  // call. react/no-children-prop is a JSX idiom rule and fires here anyway, and
  // under next/core-web-vitals it is an ERROR, which fails `next build` after a
  // clean compile (bead hq-a4sy5 R1). Suppressed by name, and the rule does
  // resolve from the lockfile: removing this line puts the error back. That is
  // the difference from hq-4h26y, where the suppressed rule did not exist.
  return renderToStaticMarkup(
    // eslint-disable-next-line react/no-children-prop
    React.createElement(LocaleProvider, {
      locale,
      children: React.createElement(WineryPage, { params: { locale } }),
    }),
  );
}

/**
 * The text inside every element the page serves as emphasis, markup stripped.
 * <b> is what lib/i18n/rich.tsx renders, and <strong> and <em> are here because
 * the defect this guards against was emphasis written by hand in a component,
 * where the tag is whatever the author reached for.
 */
function servedSpans(html: string): string[] {
  return captures("<(?:b|strong|em)(?: [^>]*)?>([\\s\\S]*?)</(?:b|strong|em)>", "g", html).map(
    (inner) =>
      inner
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<[^>]*>/g, "")
        .trim(),
  );
}

/** The body of every capability card, as the page serves it. */
function servedCapBodies(html: string): string[] {
  return captures('<p class="cap-body"(?: [^>]*)?>([\\s\\S]*?)</p>', "g", html).map((inner) =>
    inner
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]*>/g, "")
      .trim(),
  );
}

describe("the emphasis a visitor actually sees", () => {
  for (const locale of locales) {
    it(`${locale}: serves at most ${EMPHASIS_CAP} emphasis spans`, async () => {
      const spans = servedSpans(await serve(locale));
      expect(spans.length, `served: ${spans.join(" | ")}`).toBeLessThanOrEqual(
        EMPHASIS_CAP,
      );
    });

    it(`${locale}: every span it serves is one the copy checker can see`, async () => {
      const declared = declaredSpans(locale);
      const spans = servedSpans(await serve(locale));
      expect(spans.filter((s) => declared.indexOf(s) < 0)).toEqual([]);
    });
  }

  it("writes no emphasis in the page component, where the checker is blind", () => {
    expect(pageSource).not.toMatch(/<\/?(b|strong|em)(\s|>)/);
    expect(pageSource).not.toMatch(/\*\*|__/);
  });
});

describe("the ads card carries the policy precios sets", () => {
  /**
   * Since 2026-09-28 ad management is a standalone service at a flat fee,
   * bought on its own or with a module (Daniel's direction; bunker
   * research/2026-09/site-arc-digital-onboarding.md section 8). The card on
   * this page that mentions ads must say the fee is flat and that the budget
   * goes straight to Google, and precios' own ads block must say the same.
   * Read against the SERVED card bodies, because a claim moved into the
   * component would leave the dictionary clean and the visitor still promised
   * the thing. The retired conditions (Hospitalidad and Restaurante only, from
   * the middle size up, never on Produccion) are gone with the policy.
   */
  const words: Record<Locale, { ads: RegExp; flat: RegExp; direct: RegExp; share: RegExp }> = {
    en: {
      ads: /\bads\b|\bGoogle Ads\b/i,
      flat: /\bflat (?:monthly )?fee\b/i,
      direct: /straight to Google/i,
      share: /\b(?:percent|percentage|share) of (?:what you )?spend/i,
    },
    es: {
      ads: /\banuncios\b/i,
      flat: /\bcuota (?:mensual )?fija\b/i,
      direct: /directo a Google/i,
      share: /\bporcentaje de (?:lo que invierte|la inversi[oó]n|su presupuesto)/i,
    },
  };

  for (const locale of locales) {
    const { ads, flat, direct, share } = words[locale];

    it(`${locale}: the served page mentions ads on exactly one card, and that card states the policy`, async () => {
      const cards = servedCapBodies(await serve(locale)).filter((b) => ads.test(b));
      expect(cards).toHaveLength(1);
      expect(cards[0]).toMatch(flat);
      expect(cards[0]).toMatch(direct);
    });

    it(`${locale}: no dictionary card offers ads as a share of spend`, () => {
      const bad = winery[locale].caps.cards.filter((c) => share.test(c.body) && !/nunca|never|at no point/i.test(c.body));
      expect(bad.map((c) => c.body)).toEqual([]);
    });

    it(`${locale}: precios still states the flat fee this card is held to`, () => {
      expect(precios[locale].ads.body).toMatch(flat);
      expect(precios[locale].ads.body).toMatch(direct);
      // The standalone fee and the module add-on are one price by construction.
      expect(addOnMonthly("google-ads-management", "M")).not.toBeNull();
      expect(addOnAvailable("google-ads-management", ["hospitalidad"], "M")).toBe(true);
    });
  }
});

describe("the pricing terms say what precios says", () => {
  it("es: the 30 day notice names either of the two parties", () => {
    const notice = winery.es.pricing.terms.filter((t) =>
      /30 días de aviso/.test(t),
    )[0];
    expect(notice).toBeDefined();
    expect(notice).toMatch(/cualquiera de las dos partes/);
    expect(precios.es.terms.items.join(" ")).toMatch(/cualquiera de las dos partes/);
  });

  it("es: four feminine antecedents take las, not los", () => {
    const item = winery.es.leak.items.filter((i) => /concilia a mano/.test(i.body))[0];
    expect(item, "the leak card about reconciling by hand").toBeDefined();
    expect(item.body).toMatch(/las concilia a mano/);
  });
});
