import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// vitest transforms this app's JSX with the classic runtime, so the page's
// createElement calls resolve a global React; Next itself uses the automatic
// runtime and needs no import. This shim is test-only.
(globalThis as unknown as { React: typeof React }).React = React;

import { showsPending } from "./pending";
import EnkantoCaseStudy from "./page";
import { enkanto } from "../../../../lib/i18n/enkanto";
import { locales, type Locale } from "../../../../lib/i18n/config";
import {
  BLOCKING_SHAPES,
  EM_DASH,
} from "../../../../scripts/copy-check.mjs";

/**
 * Guards for the En'kanto case page (beads hq-cczm.25 and hq-4pu0q.5).
 *
 * The page makes promises that prose review is bad at holding. It counts
 * things: "nineteen screens" is only honest while the three named lists still
 * add up to nineteen, and an editor adding a screen to one card would break
 * the basis paragraph silently. It carries a deliberate placeholder for the
 * result section, which must never reach the live site. And since the rewrite
 * it is held to docs/copy-doctrine.md, whose runnable half reads
 * `lib/i18n/enkanto.ts` one string at a time and therefore cannot see two
 * things: a shape split across a template substitution, and the sentence the
 * page assembles at render out of several dictionary entries. Both gaps are
 * recorded in the doctrine as known and unfixed, so they are closed here
 * instead, by rendering the page and running the checker's own shapes over
 * the text a visitor actually reads.
 */

const pageSource = readFileSync(
  join(process.cwd(), "app/[locale]/work/enkanto/page.tsx"),
  "utf8",
);

/** What the basis paragraph on the page claims, in one place. */
const CLAIMED_SCREENS = 19;
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
      // and the basis paragraph states the shape of the split, five, five, nine
      expect(d.system.modules.map((m) => m.screens.length)).toEqual([5, 5, 9]);
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
  // The first gate hid the block when VERCEL_ENV was "production", so it
  // PUBLISHED the block on any build where that variable was missing. These
  // cases are the ones that failure mode walked through; the gate now has to
  // hide by default and show only when something says so.
  type Env = Record<string, string | undefined>;
  const cases: Array<[string, Env, boolean]> = [
    ["next dev", { NODE_ENV: "development" }, true],
    ["a plain production build", { NODE_ENV: "production" }, false],
    ["a Vercel production deploy", { NODE_ENV: "production", VERCEL_ENV: "production" }, false],
    ["a Vercel preview deploy", { NODE_ENV: "production", VERCEL_ENV: "preview" }, false],
    ["a production build with no deployment metadata at all", { NODE_ENV: "production" }, false],
    ["an empty environment", {}, true],
    ["a preview asked to show the gap", { NODE_ENV: "production", SHOW_CASE_PENDING: "1" }, true],
  ];

  for (const [name, env, expected] of cases) {
    it(`${expected ? "shows" : "hides"} the placeholder on ${name}`, () => {
      expect(showsPending(env)).toBe(expected);
    });
  }

  it("hides it on every production-shaped environment, whatever else is set", () => {
    for (const vercel of [undefined, "", "production", "preview", "development", "PRODUCTION"]) {
      const env: Env = { NODE_ENV: "production" };
      if (vercel !== undefined) env.VERCEL_ENV = vercel;
      expect(showsPending(env)).toBe(false);
    }
  });

  it("the page renders the block through that gate and no other", () => {
    expect(pageSource).toContain("const showPending = showsPending(process.env);");
    expect(pageSource).toMatch(/\{showPending \? \(/);
    expect(pageSource).not.toMatch(/VERCEL_ENV/);
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

/**
 * The doctrine, checked on the sentence a visitor reads.
 *
 * `scripts/copy-check.mjs` is the gate, and it has two holes its own header
 * records as deliberate: it matches each dictionary string on its own, so a
 * banned shape split by a template substitution passes clean, and it never
 * sees a sentence the page assembles at render out of several entries. This
 * page assembles four: the headline out of `t1`, an accent span and `t2`, each
 * case fact out of a key and a value, each diagnostic line out of a day label
 * and its text, and each callout out of an index, a lead and a body. So the
 * shapes are imported from the checker itself and run over the rendered page,
 * which is the text a visitor reads and the only text that matters.
 */
describe("the copy doctrine, on the rendered page", () => {
  /** Roughly `innerText`: block elements break the line, inline ones do not. */
  const INLINE = new Set([
    "a", "b", "i", "em", "strong", "span", "small", "sub", "sup", "code", "abbr",
  ]);

  function renderedText(locale: Locale): string {
    const html = renderToStaticMarkup(
      React.createElement(EnkantoCaseStudy, { params: { locale } }),
    );
    return html
      // <svg> holds label text that is laid out, never flowed: keep each
      // label on its own line rather than running them into a sentence.
      .replace(/<(\/?)([a-z0-9-]+)[^>]*>/gi, (_m, _slash, tag: string) =>
        INLINE.has(tag.toLowerCase()) ? "" : "\n",
      )
      .replace(/&#x27;|&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&#x2F;/g, "/")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{2,}/g, "\n");
  }

  for (const locale of locales) {
    const text = renderedText(locale);

    it(`${locale}: the rendered page trips none of the blocking shapes`, () => {
      const hits: string[] = [];
      for (const shape of BLOCKING_SHAPES as Array<{
        id: string;
        locale: Locale;
        re: RegExp;
      }>) {
        if (shape.locale !== locale) continue;
        // A fresh regex: the shared ones carry /g, so lastIndex would leak
        // between locales and drop every other hit.
        const re = new RegExp(shape.re.source, shape.re.flags);
        for (const line of text.split("\n")) {
          if (re.test(line)) hits.push(`${shape.id}: ${line.trim()}`);
          re.lastIndex = 0;
        }
      }
      expect(hits).toEqual([]);
    });

    it(`${locale}: the rendered page carries no em dash`, () => {
      const re = new RegExp((EM_DASH as RegExp).source, "g");
      expect(text.match(re)).toBeNull();
    });

    it(`${locale}: the headline the page assembles is one clean sentence`, () => {
      const d = enkanto[locale];
      const headline = d.hero.t1 + d.hero.accent + d.hero.t2;
      expect(text).toContain(headline);
      expect(headline).toMatch(/[.!?]$/);
    });

    it(`${locale}: every photograph and video carries a caption`, () => {
      const html = renderToStaticMarkup(
        React.createElement(EnkantoCaseStudy, { params: { locale } }),
      );
      const figures = html.match(/<figure class="media[^]*?<\/figure>/g) ?? [];
      // the restaurant side, the lodging side, and the clip where they meet
      expect(figures).toHaveLength(3);
      for (const figure of figures) {
        const caption = figure.match(
          /<figcaption class="media-cap">([^]*?)<\/figcaption>/,
        );
        expect(caption?.[1]?.trim()).toBeTruthy();
      }
    });

    it(`${locale}: one call to action, in the site's own words, repeated`, () => {
      const cta = locale === "es" ? "Pida el Diagnóstico, sin costo" : "Get the free Growth Diagnostic";
      const occurrences = text.split(cta).length - 1;
      expect(occurrences).toBeGreaterThanOrEqual(3);
    });
  }
});

describe("the doctrine, on the dictionary", () => {
  const dictSource = readFileSync(
    join(process.cwd(), "lib/i18n/enkanto.ts"),
    "utf8",
  );

  /** Every user-visible string in a locale, flattened. */
  function strings(value: unknown, out: string[] = []): string[] {
    if (typeof value === "string") out.push(value);
    else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
    else if (value && typeof value === "object")
      Object.values(value).forEach((v) => strings(v, out));
    return out;
  }

  for (const locale of locales) {
    it(`${locale}: spends none of the three emphasis spans`, () => {
      // The page's two real labels (the case fact keys and the diagnostic day
      // markers) are labels in the markup with their own class, so a marker
      // here would be emphasis in body copy, which the doctrine bans.
      const marked = strings(enkanto[locale]).filter((s) => /\*\*|__/.test(s));
      expect(marked).toEqual([]);
    });
  }

  it("carries no template substitution, which the checker cannot match across", () => {
    // docs/copy-doctrine.md records this hole as deliberate: `This is not
    // ${x} but certainty.` reaches the matcher as two fragments and passes.
    // The rule it names is to rewrite the sentence rather than route around
    // the gate, so this file simply has no substitution to route around.
    expect(dictSource).not.toContain("${");
  });
});
