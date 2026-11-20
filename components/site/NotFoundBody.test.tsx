import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// vitest transforms this app's JSX with the classic runtime, so the component's
// createElement calls resolve a global React; Next itself uses the automatic
// runtime and needs no import. This shim is test-only.
(globalThis as unknown as { React: typeof React }).React = React;

import { locales, type Locale } from "../../lib/i18n/config";
import { site } from "../../lib/i18n/site";
import NotFoundBody, {
  NF_ART_VIEWBOX,
  NF_LEFT_VIEWBOX,
  NF_LINE_VIEWBOX,
} from "./NotFoundBody";
import {
  SCENE_ART_VIEWBOX,
  SCENE_LEFT_VIEWBOX,
  SCENE_LINE_VIEWBOX,
} from "./footer-scene-paths";

/**
 * Guards for the themed 404 (bead hq-0xca.1).
 *
 * The scene is three separate drawings pretending to be one horizon, and the
 * things that break it do not show up in a diff:
 *
 *   A. the three boxes drawn at different scales, which floated the line under
 *      the drawing fifty pixels below the line beside it (measured on the
 *      first build of this bead, 1440 by 900);
 *   B. the boxes cut on a different row, which hangs the stray ink of the
 *      CARDON DIGITAL lettering under the junction and puts the wordmark on
 *      the page twice;
 *   C. the footer band left standing, which repeats the drawing, the horizon
 *      and a second tumbleweed one screen below this one;
 *   D. a motion rule that reduced motion does not switch off;
 *   E. the code rendered as decoration, which takes the one word this page
 *      owes a screen reader away from it.
 */

const CSS = readFileSync(join(process.cwd(), "components/site/not-found.css"), "utf8");
const TSX = readFileSync(join(process.cwd(), "components/site/NotFoundBody.tsx"), "utf8");

/** The row the three boxes are cut on, and the rows they each start from. */
const CUT_ROWS = 336;
const rows = (viewBox: string) => viewBox.split(/\s+/).map(Number);

describe("the horizon is one line (A, B)", () => {
  it("cuts all three boxes on the same row, so one height draws one scale", () => {
    for (const box of [NF_ART_VIEWBOX, NF_LINE_VIEWBOX, NF_LEFT_VIEWBOX]) {
      const [, top, , height] = rows(box);
      expect(top, `${box} starts on a different row`).toBe(30);
      expect(height, `${box} is not the cut height`).toBe(CUT_ROWS);
    }
  });

  it("keeps the footer's own boxes otherwise, so the drawing keeps its shape", () => {
    const same = (mine: string, theirs: string) => {
      const [x, , w] = rows(mine);
      const [tx, , tw] = rows(theirs);
      expect([x, w], `${mine} is not the footer's box across`).toEqual([tx, tw]);
    };
    same(NF_ART_VIEWBOX, SCENE_ART_VIEWBOX);
    same(NF_LINE_VIEWBOX, SCENE_LINE_VIEWBOX);
    same(NF_LEFT_VIEWBOX, SCENE_LEFT_VIEWBOX);
  });

  it("draws all three at the same height, which is what puts them on one row", () => {
    expect(CSS).toMatch(/\.nf-art,\.nf-line,\.nf-left\{[^}]*height:var\(--ah\)/);
    expect(CSS, "a second height for the line would float it off the drawing").not.toMatch(
      /\.nf-line[^{]*\{[^}]*height:(?!var\(--ah\))/,
    );
  });

  it("stands the tumbleweed and the code on the row the line is drawn on", () => {
    // 0.97 is where row 356 falls inside a box cut at 336 rows: a change to
    // one of these three numbers without the others tips the whole scene.
    expect(CSS).toMatch(/--line-b:calc\(var\(--sh\) - var\(--ah\) \* 0\.97\)/);
    expect(CSS).toMatch(/\.nf-tw\{[^}]*bottom:calc\(var\(--line-b\)/);
    expect(CSS).toMatch(/\.pg-404 \.nf-code\{[^}]*bottom:calc\(var\(--line-b\)/);
  });
});

describe("one page, one tumbleweed (C)", () => {
  it("stands the footer band down under this page", () => {
    expect(CSS).toMatch(/\.pg-404 ~ \.site-footer \.foot-scene\{display:none;\}/);
  });
});

describe("reduced motion is still (D)", () => {
  const block = CSS.slice(CSS.indexOf("@media (prefers-reduced-motion:reduce)"));

  it("switches off every moving layer of the scene and the nudge", () => {
    expect(block).toBeTruthy();
    for (const layer of [".nf-tw", ".nf-tw-fall-x", ".nf-tw-fall-y", ".nf-tw-bounce", ".nf-tw-spin", ".nf-code"]) {
      expect(block, `${layer} keeps moving under reduced motion`).toContain(layer);
    }
    expect(block).toMatch(/animation:none/);
  });

  it("leaves a resting tumbleweed rather than an empty line", () => {
    expect(block).toMatch(/\[data-measured\] \.nf-tw\{[^}]*visibility:visible/);
    expect(block).toMatch(/transform:translateX\(var\(--roll-x/);
  });

  it("is the one path the driver takes without rolling, and it measures first", () => {
    expect(TSX).toMatch(/if \(still\.matches\) measure\(\);/);
    expect(TSX).toMatch(/if \(!visible \|\| rolling \|\| still\.matches\) return;/);
  });
});

describe("the page reads without the motion (E)", () => {
  const html = (locale: Locale) =>
    renderToStaticMarkup(React.createElement(NotFoundBody, { locale }) as React.ReactElement);

  it.each(locales)("%s renders the code, the sentence and the way home as text", (locale) => {
    const out = html(locale as Locale);
    const t = site[locale as Locale].notFound;
    expect(out).toContain(`>${t.code}<`);
    expect(out).toContain(t.title);
    expect(out).toContain(t.home);
    // The code carries the only "404" on the page, so it is never decoration.
    expect(out).toMatch(/<p class="nf-code">404<\/p>/);
  });

  it("hides the drawing from assistive tech and leaves nothing to click in it", () => {
    expect(html("es")).toMatch(/<div class="nf-scene" aria-hidden="true">/);
    expect(CSS).toMatch(/\.pg-404 \.nf-code\{[^}]*pointer-events:none/);
  });

  it("sets the figures lining, or the display face's 4 drops through the line", () => {
    expect(CSS).toMatch(/\.pg-404 \.nf-code\{[^}]*font-variant-numeric:lining-nums/);
  });
});

describe("the measured numbers and the CSS stay one effect", () => {
  it("drops for as long as the driver schedules the drop for", () => {
    const fall = TSX.match(/const FALL_S = ([\d.]+);/);
    expect(fall).toBeTruthy();
    const seconds = `${Number(fall![1])}s`.replace(/^0/, "");
    for (const layer of ["nf-fall-x", "nf-fall-y"]) {
      expect(CSS, `${layer} and FALL_S disagree`).toContain(`animation:${layer} ${seconds}`);
    }
  });

  it("starts both halves of the drop where the roll ends", () => {
    expect(CSS).toMatch(/animation:nf-fall-x \.7s linear var\(--roll-t,[^)]*\) forwards/);
    expect(CSS).toMatch(/animation:nf-fall-y \.7s [^ ]+ var\(--roll-t,[^)]*\) forwards/);
  });
});
