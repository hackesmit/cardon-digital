import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// vitest transforms this app's JSX with the classic runtime, so the page's
// createElement calls resolve a global React; Next itself uses the automatic
// runtime and needs no import. This shim is test-only, and it is the same one
// the sibling case page's guards use.
(globalThis as unknown as { React: typeof React }).React = React;

import MonteXanicCaseStudy from "./page";
import { monteXanic } from "../../../../lib/i18n/monte-xanic";
import { locales, type Locale } from "../../../../lib/i18n/config";
import {
  BLOCKING_SHAPES,
  EM_DASH,
  PAGES,
  countWords,
} from "../../../../scripts/copy-check.mjs";

/**
 * Guards for the three visuals Daniel brought back (hq-4pu0q.13, hq-4pu0q.32).
 *
 * His condition was not that they exist. It was that each one sells what the
 * winery ends up with, and every part of that condition is invisible to the
 * checks that were already here: scripts/visuals-check.mjs watches
 * components/pages and these three are inline SVG in a route file, and
 * scripts/copy-check.mjs reads the dictionary rather than the page, so it
 * cannot see a drawing rendered with no caption, an honesty label dropped off
 * an invented reading, or a Spanish page drawing English labels.
 *
 * So each case below pins one thing the bead promised, against what the page
 * SERVES rather than against what its source says.
 */

const here = process.cwd();
const pageSource = readFileSync(
  join(here, "app/[locale]/work/monte-xanic/page.tsx"),
  "utf8",
);
const cssSource = readFileSync(
  join(here, "app/[locale]/work/monte-xanic/case.css"),
  "utf8",
);

/** The three frames, by the id each carries in the markup. */
const FRAMES = ["viewVis", "placeVis", "aheadVis"] as const;

/** The dictionary subtree each frame draws its words from. */
const KEYS = ["view", "place", "ahead"] as const;

function serve(locale: Locale): string {
  return renderToStaticMarkup(
    React.createElement(MonteXanicCaseStudy, { params: { locale } }),
  );
}

/** HTML entities back to the characters the dictionary actually holds. */
function decodeEntities(value: string): string {
  return value
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, "/")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** Every word a visitor reads, tags stripped, entities resolved. */
function visibleText(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ");
}

/**
 * The markup of each `<figure class="case-vis...">`, walked to its own closing
 * tag. A plain lazy regex between the two tags would pair the first opening
 * with the first closing anywhere after it; these figures do not nest, so a
 * scan is both correct and shorter than arguing with the regex.
 */
function figures(html: string): string[] {
  const out: string[] = [];
  let at = html.indexOf('<figure class="case-vis');
  while (at > -1) {
    const end = html.indexOf("</figure>", at);
    out.push(html.slice(at, end + "</figure>".length));
    at = html.indexOf('<figure class="case-vis', end);
  }
  return out;
}

/** Every string under an object, at any depth. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(strings);
  }
  return [];
}

describe("the three restored visuals", () => {
  it.each(locales)("%s draws all three, each inside a figure", (locale) => {
    const html = serve(locale);
    for (const id of FRAMES) {
      expect(html, `#${id} is not on the page`).toContain(`id="${id}"`);
    }
    // A frame with no <figure> around it has nowhere to put a caption, which
    // is the whole of Daniel's condition. Counting figures is not enough on
    // its own: the assertion below reads each caption's words.
    const figures = html.match(/<figure class="case-vis/g) ?? [];
    expect(figures.length).toBe(FRAMES.length);
  });

  it.each(locales)("%s captions each one with the result, under the frame", (locale) => {
    const html = serve(locale);
    const d = monteXanic[locale];
    for (const key of KEYS) {
      const caption = d.vis[key].caption;
      // It has to be in the caption element, not merely somewhere on the page:
      // a result sentence parked in the frame's tag would pass a `toContain`.
      const rendered = html.match(
        new RegExp(`<figcaption class="vis-result">([^<]*)</figcaption>`, "g"),
      );
      expect(rendered, "no vis-result captions rendered").not.toBeNull();
      const texts = (rendered as string[]).map((f) =>
        decodeEntities(f.replace(/<[^>]*>/g, "")),
      );
      expect(texts, `${key} has no result caption`).toContain(caption);
    }
  });

  it.each(locales)("%s labels every one of them illustrative", (locale) => {
    const html = serve(locale);
    const honest = monteXanic[locale].vis.honest;
    // Three frames, three labels. Each draws invented readings, so a label on
    // two of them is the case the bead named: one illustrative visual a reader
    // could mistake for a measurement.
    const labels = html.match(
      new RegExp(`<span class="vis-honest mono">${honest}</span>`, "g"),
    );
    expect(labels?.length ?? 0).toBe(FRAMES.length);
  });

  it.each(locales)("%s draws them where the section states the result", (locale) => {
    const html = serve(locale);
    const d = monteXanic[locale];
    // "What changed" states three changes and now shows three pictures of
    // them, ahead of the section map that plays all three out over a season.
    // The sub carries an apostrophe in English, which renders as an entity.
    const head = decodeEntities(html).indexOf(d.changed.sub);
    const map = decodeEntities(html).indexOf('class="vine-showcase"');
    expect(head).toBeGreaterThan(-1);
    expect(map).toBeGreaterThan(-1);
    for (const id of FRAMES) {
      const at = decodeEntities(html).indexOf(`id="${id}"`);
      expect(at, `#${id} is outside the what-changed build`).toBeGreaterThan(head);
      expect(at, `#${id} sits below the section map`).toBeLessThan(map);
    }
  });

  it("draws no word it did not read from the dictionary", () => {
    // A Spanish page drawing an English label is the failure a screenshot in
    // one language never shows. Two halves, because either alone has a hole:
    // the rendered comparison below cannot see a leak into a string both
    // locales happen to share, and the key comparison here cannot see a label
    // hard coded in the markup.
    //
    // Nothing these three visuals say is the same in both languages, down to
    // "TANKS" and "TANQUES", so the pair is required to differ at every key
    // rather than at most of them. An entry that legitimately becomes shared
    // one day is a line added here with its reason, which is the point: it
    // stops being a silent English default.
    for (const key of KEYS) {
      const en = monteXanic.en.vis[key] as Record<string, string>;
      const es = monteXanic.es.vis[key] as Record<string, string>;
      for (const field of Object.keys(en)) {
        expect(
          es[field],
          `vis.${key}.${field} is the same in both locales, so one of them is a translation or a leak`,
        ).not.toBe(en[field]);
      }
    }
    expect(monteXanic.es.vis.honest).not.toBe(monteXanic.en.vis.honest);

    const pairs: Array<[Locale, Locale]> = [
      ["es", "en"],
      ["en", "es"],
    ];
    for (const [shown, source] of pairs) {
      const foreign = strings({
        honest: monteXanic[source].vis.honest,
        ...Object.fromEntries(KEYS.map((k) => [k, monteXanic[source].vis[k]])),
      });
      // Scoped to the three figures. The rest of the page holds client
      // components this bead does not own, and a server render with no locale
      // provider falls back to Spanish inside them, which would make a
      // page-wide comparison fail on text these visuals never drew.
      const drawn = visibleText(figures(serve(shown)).join(" "));
      for (const word of foreign) {
        expect(
          drawn.includes(word),
          `the ${shown} page draws the ${source} string "${word}"`,
        ).toBe(false);
      }
    }
  });
});

describe("what the restored visuals are allowed to say", () => {
  it.each(locales)("%s carries no banned shape in what it renders", (locale) => {
    // copy-check reads the dictionary one string at a time and can never see
    // a sentence the page assembles at render. These visuals assemble none,
    // and this is what keeps that true.
    const text = visibleText(serve(locale));
    for (const shape of BLOCKING_SHAPES) {
      if (shape.locale !== locale) continue;
      const re = new RegExp(shape.re.source, shape.re.flags);
      expect(re.test(text), `"${shape.id}" in the served ${locale} page`).toBe(false);
    }
    expect(EM_DASH.test(text), `em dash in the served ${locale} page`).toBe(false);
  });

  it("puts no number on a restored visual", () => {
    // The bead's constraint: no invented metric. The three drawings carry
    // section names and words, and the one thing that looks like a figure
    // ("B3") is a section name in both locales.
    for (const locale of locales) {
      for (const key of KEYS) {
        for (const value of strings(monteXanic[locale].vis[key])) {
          const digits = value.match(/\d+(?:[.,]\d+)?/g) ?? [];
          for (const found of digits) {
            expect(
              `B3 A1 C1`.includes(found) || value.includes(`B${found}`),
              `${locale}.vis.${key} carries the number "${found}"`,
            ).toBe(true);
          }
        }
      }
    }
  });
});

describe("reduced motion", () => {
  /** The rules inside case.css's own reduce block. */
  const reduceBlock = (() => {
    const at = cssSource.indexOf("@media (prefers-reduced-motion: reduce)");
    expect(at, "case.css states no reduced-motion rules of its own").toBeGreaterThan(-1);
    const open = cssSource.indexOf("{", at);
    let depth = 0;
    for (let i = open; i < cssSource.length; i++) {
      if (cssSource[i] === "{") depth++;
      else if (cssSource[i] === "}") {
        depth--;
        if (depth === 0) return cssSource.slice(open, i);
      }
    }
    return "";
  })();

  it("stops the live dot", () => {
    // globals.css carries a site-wide `* { animation: none !important }`, so
    // this could be left to it. It is not, because the dot is the one piece of
    // motion the bead names and a page-scoped rule is what a reviewer can read
    // beside the keyframes it cancels.
    expect(/\.live-dot\s*\{[^}]*animation:\s*none/.test(reduceBlock)).toBe(true);
    expect(/@keyframes livePulse/.test(cssSource)).toBe(true);
  });

  it("stops the readiness curve drawing on", () => {
    expect(/\.pred-curve[^{]*\{[^}]*transition:\s*none/.test(reduceBlock)).toBe(true);
    // And the pre state resolves, so a visitor who turns the setting on after
    // the frame is already held at "pre" sees the finished curve rather than
    // an empty axis.
    expect(/data-anim="pre"\]\s*\.pred-curve\s*\{[^}]*stroke-dashoffset:\s*0/.test(reduceBlock)).toBe(true);
  });

  it("mounts the curve through the play-once frame that honours the setting", () => {
    expect(pageSource).toMatch(/<PlayOnceVis[^>]*id="aheadVis"[^>]*variant="pred-vis"/);
  });
});

describe("the word budget Daniel authorised", () => {
  it("is raised by exactly what the three visuals add", () => {
    // hq-4pu0q.32 raised the monte-xanic line by the words the restored
    // visuals brought with them, and by nothing else. Written as arithmetic in
    // the table so the two halves stay readable; read back here so a later
    // edit to a caption cannot quietly spend prose headroom the page was never
    // given.
    const landing = { en: 684, es: 763 };
    for (const locale of locales) {
      const added = countWords(
        strings({
          honest: monteXanic[locale].vis.honest,
          ...Object.fromEntries(
            KEYS.map((k) => [k, monteXanic[locale].vis[k]]),
          ),
        }).map((value) => ({ value })),
      );
      expect(
        PAGES["monte-xanic"][locale].budget,
        `the ${locale} budget is not the landing count plus the ${added} words the visuals add`,
      ).toBe(landing[locale] + added);
    }
  });
});
