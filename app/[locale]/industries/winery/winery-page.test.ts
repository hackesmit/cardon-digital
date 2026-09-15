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
import { precios } from "../../../../lib/i18n/precios";
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

/** Every ** span declared in the dictionaries this page renders from. */
function declaredSpans(): string[] {
  const out: string[] = [];
  for (const file of ["lib/i18n/winery.ts", "lib/i18n/site.ts"]) {
    const src = readFileSync(join(process.cwd(), file), "utf8");
    for (const span of captures("\\*\\*([^*]+)\\*\\*", "g", src)) out.push(span.trim());
  }
  return out;
}

/** The page as a visitor gets it: server-rendered markup, one locale. */
async function serve(locale: Locale): Promise<string> {
  const WineryPage = (await import("./page")).default;
  return renderToStaticMarkup(
    React.createElement(LocaleProvider, {
      locale,
      children: React.createElement(WineryPage, { params: { locale } }),
    }),
  );
}

/** The text inside every <b> the page serves, markup stripped. */
function servedSpans(html: string): string[] {
  return captures("<b(?: [^>]*)?>([\\s\\S]*?)</b>", "g", html).map((inner) =>
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
      const declared = declaredSpans();
      const spans = servedSpans(await serve(locale));
      expect(spans.filter((s) => declared.indexOf(s) < 0)).toEqual([]);
    });
  }

  it("writes no emphasis in the page component, where the checker is blind", () => {
    expect(pageSource).not.toMatch(/<\/?(b|strong|em)(\s|>)/);
    expect(pageSource).not.toMatch(/\*\*|__/);
  });
});

describe("the ads card carries the condition precios sets", () => {
  /** The claim, the condition that makes it true, and precios' own rule. */
  const claims: Record<Locale, { claim: RegExp; condition: RegExp; rule: RegExp }> = {
    en: {
      claim: /ads[\s\S]*inside the monthly(?: service)? fee/i,
      condition: /Hospitalidad and Restaurante/,
      rule: /never attach to Produccion/,
    },
    es: {
      claim: /[Aa]nuncios[\s\S]*dentro de la cuota mensual/,
      condition: /Hospitalidad y a? ?Restaurante/,
      rule: /A Producción nunca/,
    },
  };

  for (const locale of locales) {
    const { claim, condition, rule } = claims[locale];

    it(`${locale}: precios still states the rule this card is held to`, () => {
      expect(precios[locale].ads.body).toMatch(rule);
    });

    it(`${locale}: no card claims ads inside the fee without naming the modules`, () => {
      const bad = winery[locale].caps.cards.filter(
        (c) => claim.test(c.body) && !condition.test(c.body),
      );
      expect(bad.map((c) => c.body)).toEqual([]);
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
});
