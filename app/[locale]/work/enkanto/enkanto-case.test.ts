import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import React from "react";
import ts from "typescript";
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

/**
 * The same source with its comments removed, which is what every assertion
 * about the page's CODE reads.
 *
 * Its own control found the need for it: removing `<SpotlightFrames />` from
 * the JSX left the guard green, because the header comment of the diagram
 * section ends "the moment <SpotlightFrames /> is mounted" and a match against
 * raw source cannot tell a mount from a sentence about one. A comment vouching
 * for code that is no longer there is the exact failure this file exists to
 * stop, so no assertion here reads a comment.
 *
 * TypeScript does the stripping, rather than the hand-written scanner this
 * started as. That scanner tracked quotes but had no idea what a regex literal
 * is, so `/\/\//` read as the start of a line comment and silently ate the
 * rest of the line (cross-vendor review). `jsx: Preserve` keeps the JSX
 * verbatim, so a mount still looks like a mount here.
 */
export function stripComments(source: string): string {
  return ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      removeComments: true,
    },
  }).outputText;
}

/** HTML entities back to the characters the dictionary actually holds. */
export function decodeEntities(value: string): string {
  return value
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, "/")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** What the page actually does, with every sentence about it removed. */
const pageCode = stripComments(pageSource);

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
    expect(pageCode).toContain("const showPending = showsPending(process.env);");
    expect(pageCode).toMatch(/\{showPending \? \(/);
    expect(pageCode).not.toMatch(/VERCEL_ENV/);
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
    const stripped = html(locale)
      // <svg> holds label text that is laid out, never flowed: keep each
      // label on its own line rather than running them into a sentence.
      .replace(/<(\/?)([a-z0-9-]+)[^>]*>/gi, (_m, _slash, tag: string) =>
        INLINE.has(tag.toLowerCase()) ? "" : "\n",
      )
      .replace(/[ \t]+/g, " ")
      .replace(/\n{2,}/g, "\n");
    return decodeEntities(stripped);
  }

  function html(locale: Locale): string {
    return renderToStaticMarkup(
      React.createElement(EnkantoCaseStudy, { params: { locale } }),
    );
  }

  /**
   * The <figure> a picture sits in, or null. Plain scan rather than a regex
   * across the whole document: figures do not nest on this page and a lazy
   * `[^]*?` between two tags matches the wrong pair as soon as one does.
   */
  function enclosingFigure(markup: string, at: number): string | null {
    const open = markup.lastIndexOf("<figure", at);
    if (open === -1) return null;
    const close = markup.indexOf("</figure>", open);
    if (close === -1 || close < at) return null;
    return markup.slice(open, close + "</figure>".length);
  }

  /** Every alt, aria-label and title the page renders, decoded. */
  function accessibleText(locale: Locale): string[] {
    const found: string[] = [];
    // exec in a loop rather than matchAll: this project's tsconfig target
    // cannot iterate the iterator matchAll returns.
    const re = /(?:alt|aria-label|title)="([^"]*)"/g;
    const markup = html(locale);
    for (let m = re.exec(markup); m !== null; m = re.exec(markup)) {
      if (m[1].trim() !== "") found.push(decodeEntities(m[1]));
    }
    return found;
  }

  for (const locale of locales) {
    const text = renderedText(locale);

    it(`${locale}: the rendered page trips none of the blocking shapes`, () => {
      // Twice over. Per block, which is how the text reads, and then over the
      // whole page joined into one run, which catches a shape whose halves sit
      // in two neighbouring blocks: a case fact key and its value, an index and
      // a lead. Splitting on the line alone left that gap open while claiming
      // to close it (cross-vendor review, round one).
      const runs = [
        ...text.split("\n"),
        text.replace(/\n/g, " "),
        // Accessible names are copy too, and they are the one place a shape can
        // be assembled out of sight of both gates: the dictionary checker sees
        // the fragments and renderedText() throws attributes away with the tags
        // (cross-vendor review, round two).
        ...accessibleText(locale),
      ];
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
        for (const run of runs) {
          if (re.test(run)) hits.push(`${shape.id}: ${run.trim().slice(0, 120)}`);
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
      const markup = html(locale);
      const figures = markup.match(/<figure class="media[^]*?<\/figure>/g) ?? [];
      // the restaurant side, the lodging side, and the clip where they meet
      expect(figures).toHaveLength(3);
      for (const figure of figures) {
        const caption = figure.match(
          /<figcaption class="media-cap">([^]*?)<\/figcaption>/,
        );
        expect(caption?.[1]?.trim()).toBeTruthy();
      }
      // and every other picture on the page is captioned too. This used to
      // read "no <img> outside a Media figure", which is a rule against
      // photographs rather than against uncaptioned ones: it passed the page
      // that had deleted the cellar band and would have failed the page that
      // brought it back captioned (bead hq-4pu0q.5, review s-74ef). The
      // promise was always the caption, so that is what is asserted.
      // exec in a loop for the INDEX, never `markup.indexOf(picture)`: two
      // identical <img> tags serialize identically, so indexOf hands the
      // second one the first one's position and a duplicate dropped outside
      // any figure inherits the caption of the one inside it (cross-vendor
      // review). This project's tsconfig target cannot iterate matchAll.
      const pictures = /<(?:img|video|picture)\b[^>]*>/g;
      for (let m = pictures.exec(markup); m !== null; m = pictures.exec(markup)) {
        const picture = m[0];
        const figure = enclosingFigure(markup, m.index);
        expect(
          figure,
          `a picture outside any figure: ${picture.slice(0, 80)}`,
        ).toBeTruthy();
        const caption = (figure as string).match(
          /<figcaption[^>]*>([^]*?)<\/figcaption>/,
        );
        expect(
          caption?.[1]?.replace(/<[^>]*>/g, "").trim(),
          `an uncaptioned picture: ${picture.slice(0, 80)}`,
        ).toBeTruthy();
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

/**
 * THE VISUALS THIS PAGE MAY NOT LOSE.
 *
 * docs/copy-doctrine.md section 8 is binding and it has a runnable half,
 * `scripts/visuals-check.mjs`, which compares the set of files under
 * `components/pages/` at the merge base against the set on disk. That catches
 * a deleted component. It is blind to two thirds of this page's visuals,
 * because a case page draws most of them as inline <svg> in page.tsx and as an
 * <img> band, and neither is a file under `components/pages/` (review s-74ef:
 * the gate caught the one deleted component and missed four diagrams and the
 * band going with them).
 *
 * This block is the other half, and it is written against the rendered page
 * rather than the source, so a diagram that is imported and never mounted
 * fails the same way a deleted one does. The counts below are the page's
 * inventory. They may go UP freely. Lowering one is retiring a visual, which
 * is Daniel's decision alone (doctrine 8.3), and lowering the number here is
 * the diff where that decision has to be visible.
 */
describe("the visuals this page may not lose", () => {
  /** Frames that draw a diagram: the before and after card, then one per change. */
  const DRAWN_VISUALS = 5;
  /** One diagram per entry in `changed.items`. */
  const CHANGE_VISUALS = 4;
  /** The cellar band, licensed stock standing in for En'kanto's own photograph. */
  const BAND_SRC = "/media/enkanto-valle.webp";

  const spotlightPath = "components/pages/enkanto/SpotlightFrames.tsx";

  // Read inside the cases, never in the describe body. A deleted visual is
  // exactly the state these guards exist to catch, and a readFileSync at
  // collection time turns that into a suite that fails to load: one red line
  // naming a path, no test names, and every other guard in this file silently
  // not run. Lazy, each finding keeps its own failing test.
  const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

  function html(locale: Locale): string {
    return renderToStaticMarkup(
      React.createElement(EnkantoCaseStudy, { params: { locale } }),
    );
  }

  /**
   * Every `<div class="NAME">` block, walked to its own closing tag.
   *
   * Not a regex with a lookahead at the next sibling: that form needs a
   * terminator for the last block in the list, so it is written against
   * whatever markup happens to follow it today and goes quietly wrong the
   * first time a wrapper changes. Wrapping each change in a Reveal did exactly
   * that. Counting div depth works whatever encloses the block.
   */
  function blocks(markup: string, name: string): string[] {
    const open = new RegExp(`<div class="${name}"[^>]*>`, "g");
    const found: string[] = [];
    for (let m = open.exec(markup); m !== null; m = open.exec(markup)) {
      let depth = 0;
      const tag = /<\/?div\b[^>]*>/g;
      tag.lastIndex = m.index;
      for (let t = tag.exec(markup); t !== null; t = tag.exec(markup)) {
        depth += t[0].startsWith("</") ? -1 : 1;
        if (depth === 0) {
          found.push(markup.slice(m.index, tag.lastIndex));
          break;
        }
      }
    }
    return found;
  }

  /**
   * Only the parts of the page that ARE a visual: the frames with their
   * diagrams, the honesty line the invented card carries, and the cellar band
   * with its caption. This is the scope a visual's own strings have to appear
   * in, because the page's prose says several of the same things in longer
   * words and would vouch for a label that is no longer drawn.
   */
  function visualMarkup(locale: Locale): string {
    const markup = html(locale);
    return [
      ...blocks(markup, 'vis-frame[^"]*'),
      ...(markup.match(/<p class="vis-honest[^"]*">[^]*?<\/p>/g) ?? []),
      ...(markup.match(/<figure class="photoband">[^]*?<\/figure>/g) ?? []),
    ].join("\n");
  }

  for (const locale of locales) {
    it(`${locale}: draws all ${DRAWN_VISUALS} diagrams, each in a frame with a name`, () => {
      const markup = html(locale);
      const frames = markup.match(/<div class="vis-frame[^"]*">[^]*?<\/svg>/g) ?? [];
      // A FLOOR, which is what the header above promises. It said counts may
      // go up freely while asserting an exact length, so adding a sixth
      // diagram failed the guard written to protect diagrams (cross-vendor
      // review). Exact correspondence is enforced where it is real, one
      // diagram per changed.items entry, in the next case.
      expect(frames.length).toBeGreaterThanOrEqual(DRAWN_VISUALS);
      for (const frame of frames) {
        // a diagram a screen reader cannot read is decoration, so the name is
        // part of the visual and is counted with it
        const name = frame.match(/aria-label="([^"]*)"/);
        expect(name?.[1]?.trim(), `frame with no accessible name: ${frame.slice(0, 90)}`)
          .toBeTruthy();
        expect(frame).toContain('class="mini-svg"');
      }
      // and every diagram on the page is inside one of those frames, so a
      // drawing that loses its frame loses the spotlight rather than the count
      expect(markup.match(/class="mini-svg"/g) ?? []).toHaveLength(frames.length);
    });

    it(`${locale}: every change carries the diagram that argues it`, () => {
      const markup = html(locale);
      const changes = blocks(markup, "change");
      expect(changes).toHaveLength(CHANGE_VISUALS);
      expect(enkanto[locale].changed.items).toHaveLength(CHANGE_VISUALS);
      for (const change of changes) {
        expect(
          (change.match(/class="vis-frame change-vis"/g) ?? []).length,
          `a change with no diagram: ${change.slice(0, 90)}`,
        ).toBe(1);
      }
      // each one reveals on its own, staggered. The old page gave every
      // diagram a section and a reveal of its own, so folding the four into
      // one block would spend three of them without deleting anything a count
      // of diagrams would notice.
      const staggers = blocks(markup, "reveal")
        .filter((r) => r.includes('class="change"'))
        .map((r) => r.match(/transition-delay:(\d+)ms/)?.[1] ?? "0");
      expect(staggers).toEqual(["0", "60", "120", "180"]);
    });

    it(`${locale}: the cellar band's file is on disk and is a real image`, () => {
      // The markup guards below all pass while production serves a 404: an
      // <img> with a dead src renders, reserves its box and answers every
      // selector. `next build` does not check public/, and bead hq-4pu0q.11 is
      // open and says in as many words to delete this file, so the hazard is
      // scheduled rather than hypothetical (cross-vendor review).
      const file = join(process.cwd(), "public", BAND_SRC);
      expect(existsSync(file), `${BAND_SRC} is not in public/`).toBe(true);
      expect(statSync(file).size).toBeGreaterThan(1024);
      // and it is a webp rather than a renamed placeholder
      const head = readFileSync(file).subarray(0, 12);
      expect(head.subarray(0, 4).toString("latin1")).toBe("RIFF");
      expect(head.subarray(8, 12).toString("latin1")).toBe("WEBP");
    });

    it(`${locale}: the cellar band is on the page, captioned and described`, () => {
      const markup = html(locale);
      const img = markup.match(new RegExp(`<img[^>]*src="${BAND_SRC}"[^>]*>`));
      expect(img, `the band is gone: ${BAND_SRC}`).toBeTruthy();
      expect(img?.[0].match(/alt="([^"]*)"/)?.[1]?.trim()).toBeTruthy();
      const band = markup.match(/<figure class="photoband">[^]*?<\/figure>/);
      expect(band?.[0]).toContain(BAND_SRC);
      expect(
        band?.[0].match(/<figcaption[^>]*>([^]*?)<\/figcaption>/)?.[1]?.trim(),
      ).toBeTruthy();
    });
  }

  /**
   * stripComments is load bearing now, so it is checked rather than trusted:
   * it has to remove the sentence that made the mount guard vacuous, and it
   * has to leave a `//` inside a string alone, or it would quietly rewrite the
   * code every other assertion here reads.
   */
  describe("the comment stripper the code assertions depend on", () => {
    it("removes a comment that talks about the code", () => {
      const src = " * the moment <SpotlightFrames /> is mounted.\n";
      expect(stripComments(`/*${src}*/\nconst x = 1;`)).not.toContain("SpotlightFrames");
      expect(stripComments("// <SpotlightFrames />\nconst x = 1;")).toContain("const x = 1;");
    });

    it("leaves a regex literal alone, which the hand-written version did not", () => {
      // `/\/\//` ends in an escaped slash followed by the closing delimiter.
      // Reading it left to right without knowing what a regex is, that tail
      // looks like `//` and eats the rest of the line.
      const out = stripComments("const c = /\\/\\//;\nconst kept = 1; // gone\n");
      expect(out).toContain("const kept = 1");
      expect(out).not.toContain("gone");
    });

    it("leaves a slash inside a string as code", () => {
      expect(stripComments('const u = "https://example.com/a";')).toContain(
        "https://example.com/a",
      );
      expect(stripComments('const s = "/* not a comment */";')).toContain("not a comment");
    });

    it("leaves this page's own mount and imports standing", () => {
      expect(pageCode).toContain("<SpotlightFrames />");
      expect(pageCode).toContain("/media/enkanto-valle.webp");
    });
  });

  /**
   * The spotlight, which is the one class of visual a screenshot cannot check
   * (a still frame of a hover state that follows a cursor looks identical
   * whether or not anything writes the coordinates). So it is checked as the
   * contract it is: something writes --mx / --my, something reads them, and
   * what writes them reaches every frame this page draws.
   */
  describe("the cursor spotlight", () => {
    it("still has its component on disk", () => {
      expect(() => read(spotlightPath)).not.toThrow();
    });

    it("is mounted, and from this page's own component", () => {
      expect(pageCode).toContain(
        'import SpotlightFrames from "@/components/pages/enkanto/SpotlightFrames"',
      );
      // in the JSX the component returns, which is the only place a mount is
      expect(pageCode).toMatch(/<SpotlightFrames \/>\s*<\/main>/);
    });

    it("writes the two custom properties the shared frame rule reads", () => {
      expect(read(spotlightPath)).toContain('setProperty("--mx"');
      expect(read(spotlightPath)).toContain('setProperty("--my"');
      expect(read(spotlightPath)).toContain("pointermove");
      // the other end of the contract, in globals.css: without this the
      // writes go nowhere, and without the writes the glow sits at the 50%
      // fallback while the sibling case page tracks the cursor (review s-74ef)
      const rule = read("app/globals.css").match(/\.vis-frame::after\{[^}]*\}/);
      expect(rule?.[0]).toContain("var(--mx,50%)");
      expect(rule?.[0]).toContain("var(--my,50%)");
    });

    it("reaches every framed visual this page renders", () => {
      // the selector, as the component actually writes it
      const selector = read(spotlightPath).match(/querySelectorAll\(\s*"([^"]*)"/)?.[1];
      expect(selector).toBeTruthy();
      const reached = new Set(
        (selector as string)
          .split(",")
          .map((part) => part.trim())
          .filter((part) => part.startsWith(".pg-enkanto "))
          .map((part) => part.slice(".pg-enkanto ".length).replace(/^\./, "")),
      );
      expect(reached.has("vis-frame")).toBe(true);
      for (const locale of locales) {
        const classes = html(locale).match(/<div class="(vis-frame[^"]*)"/g) ?? [];
        expect(classes.length).toBeGreaterThanOrEqual(DRAWN_VISUALS);
        for (const found of classes) {
          const list = (found.match(/class="([^"]*)"/) as RegExpMatchArray)[1].split(" ");
          expect(
            list.some((name) => reached.has(name)),
            `a frame the spotlight never reaches: ${found}`,
          ).toBe(true);
        }
      }
    });
  });

  /**
   * Doctrine 8.5: a diagram's labels are its working parts, so they live under
   * the dictionary's `vis` key rather than in the prose that a word budget
   * reaches into. Two ways a rewire goes half done, both caught here: a key
   * that survives in the dictionary with nothing drawing it (the visual is
   * gone and only its vocabulary is left), and a key one locale has and the
   * other does not (one language loses the label).
   */
  describe("the visual strings, kept where the doctrine puts them", () => {
    /** Leaf paths of an object, as `a.b.c`. */
    function paths(value: unknown, prefix = "", out: string[] = []): string[] {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        for (const [k, v] of Object.entries(value)) paths(v, prefix ? `${prefix}.${k}` : k, out);
      } else {
        out.push(prefix);
      }
      return out;
    }

    it("both locales carry the same visual vocabulary", () => {
      // `vis` itself first. Without this the comparison is vacuous when the
      // key is gone in both locales, which is the state a rewrite that deleted
      // the diagrams leaves behind: two undefineds compare equal.
      for (const locale of locales) {
        const vis = enkanto[locale].vis as unknown;
        expect(vis && typeof vis === "object", `${locale} has no vis block`).toBe(true);
        expect(paths(vis).length).toBeGreaterThanOrEqual(DRAWN_VISUALS);
      }
      expect(paths(enkanto.en.vis).sort()).toEqual(paths(enkanto.es.vis).sort());
    });

    for (const locale of locales) {
      it(`${locale}: every visual string is non-empty and is drawn by the page`, () => {
        // Against the RENDERED page, never against the source. `pageCode`
        // containing `v.shipping.allowance` proves a reference survives, which
        // a dead one does too; a diagram can lose a label while the reference
        // sits somewhere else in the file and the gate stays green
        // (cross-vendor review). The source check stays as the second half,
        // because it is the one that names the key when a locale goes quiet.
        //
        // Scoped to the visuals rather than the whole page, which its own
        // control forced: "personal allowance" is a label on the shipping
        // diagram AND a phrase in the change body next to it, so deleting the
        // label left the page still containing the string.
        const rendered = decodeEntities(visualMarkup(locale));
        for (const path of paths(enkanto[locale].vis)) {
          const value = path
            .split(".")
            .reduce<unknown>((acc, k) => (acc as Record<string, unknown>)[k], enkanto[locale].vis);
          expect(typeof value, `${path} is not a string`).toBe("string");
          expect((value as string).trim(), `${path} is blank`).toBeTruthy();
          // As a JSX expression container, `{v.a.b}`, never as a mention.
          // Control H replaces a drawn <text> with `{void v.shipping.allowance}`
          // and a bare toContain passed it. The rendered half below passed it
          // too, because that diagram's accessible name quotes the same phrase,
          // which is the visual describing a label it no longer draws.
          expect(pageCode, `${path} is in the dictionary and nothing draws it`)
            .toContain(`{v.${path}}`);
          expect(rendered, `${path} is read by the page and never reaches it`)
            .toContain(value as string);
        }
      });
    }
  });
});
