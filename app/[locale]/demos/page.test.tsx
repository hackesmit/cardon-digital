import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// The same test-only shim the other page suites use: vitest compiles this
// app's JSX with the classic runtime, so the page's createElement calls
// resolve a global React. Next uses the automatic runtime and needs none.
(globalThis as unknown as { React: typeof React }).React = React;

import DemosPage, { generateMetadata } from "./page";
import { TARGETS } from "../../../scripts/demos/capture.mjs";
import { DEMO_HOST, demoIsLive } from "../../../lib/demo";
import { locales, localePath, type Locale } from "../../../lib/i18n/config";
import { demoCardKeys, demosIndex } from "../../../lib/i18n/demos-index";
import { moduleIds } from "../../../lib/pricing";
import { site } from "../../../lib/i18n/site";

/**
 * The Demos page (bead hq-lgjo.2).
 *
 * The page's whole claim is that each card shows the screen the button is
 * about to open, and that claim breaks in three quiet ways: a card pointing
 * at the wrong modules, a preview file that was never captured, and a
 * dictionary naming an image the capture script does not produce. None of
 * them fails a build and all three ship a card that lies about the demo, so
 * each has a case here.
 *
 * The preview files are checked on disk rather than mocked. They are
 * committed, they are the argument of the page, and a test that mocks them
 * away would pass on a tree where every card is a broken image.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const MEDIA = join(ROOT, "public", "media", "demos");

/** React escapes these on the way out, so a literal has to be escaped to match. */
function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

async function render(locale: string): Promise<string> {
  return renderToStaticMarkup(await DemosPage({ params: Promise.resolve({ locale }) }));
}

describe("the cards and the captured previews agree", () => {
  it("captures one preview for every card, and no card without one", () => {
    expect(TARGETS.map((t: { id: string }) => t.id).sort()).toEqual(
      demoCardKeys.map((k) => demosIndex.es.cards[k].image).sort(),
    );
  });

  it.each(demoCardKeys)("%s has a preview file that is not empty", (key) => {
    const file = join(MEDIA, demosIndex.es.cards[key].image + ".webp");
    expect(existsSync(file), file + " is missing; run scripts/demos/capture.mjs").toBe(
      true,
    );
    // A zero byte or truncated file still renders as a broken image.
    expect(statSync(file).size).toBeGreaterThan(10_000);
  });

  it.each(demoCardKeys)("%s opens the modules its capture used", (key) => {
    const card = demosIndex.es.cards[key];
    const target = TARGETS.find((t: { id: string }) => t.id === card.image);
    expect(target, card.image + " has no target in the capture script").toBeDefined();
    expect(target!.modules).toEqual([...card.modules]);
  });

  it("names only real modules, and shows every one of them", () => {
    // Array, not Set: tsc runs this project without a target, so iterating a
    // Set directly needs downlevelIteration (the same note Media.test carries).
    const named = demoCardKeys.flatMap((k) => [...demosIndex.es.cards[k].modules]);
    for (const id of named) expect(moduleIds).toContain(id);
    for (const id of moduleIds) expect(named).toContain(id);
  });
});

describe.each(locales)("the %s page", (locale: Locale) => {
  let html = "";
  beforeAll(async () => {
    html = await render(locale);
  });
  const d = demosIndex[locale];

  it("renders a card for every demo, with its two lines", () => {
    for (const key of demoCardKeys) {
      const c = d.cards[key];
      expect(html).toContain(esc(c.title));
      expect(html).toContain(esc(c.before));
      expect(html).toContain(esc(c.after));
      expect(html).toContain(esc(c.open));
    }
  });

  it("points every card at the live demo with its own modules", () => {
    for (const key of demoCardKeys) {
      const c = d.cards[key];
      const href = demoIsLive
        ? `${DEMO_HOST}/?modulos=${c.modules.join(",")}`
        : localePath(locale, "/demo");
      expect(html).toContain(`href="${href}"`);
    }
  });

  it("opens the other origin in its own tab, under noopener", () => {
    // While the host is cleared every link is this site's own holding page,
    // which must stay in this tab like any other internal link.
    const newTabs = html.match(/target="_blank"/g) || [];
    expect(newTabs.length).toBe(demoIsLive ? demoCardKeys.length : 0);
    if (demoIsLive) {
      expect(html).toContain('rel="noopener noreferrer"');
      expect(html).not.toContain(`href="${localePath(locale, "/demo")}"`);
    }
  });

  it("gives every preview an alt that says what is on the screen", () => {
    for (const key of demoCardKeys) {
      const c = d.cards[key];
      expect(c.alt.length).toBeGreaterThan(60);
      expect(html).toContain(`alt="${esc(c.alt)}"`);
      expect(html).toContain(`src="/media/demos/${c.image}.webp"`);
    }
  });

  /**
   * The site's rule for any surface showing a business we made up: it says on
   * its face that the business is invented. The demo's own data is illustrative
   * and the page may not let a reader take it for a client's numbers.
   */
  it("says the property is invented, in the hero and under the grid", () => {
    const invented = locale === "es" ? /inventad/i : /invented/i;
    expect(d.hero.sub).toMatch(invented);
    expect(d.grid.honest).toMatch(invented);
    expect(html).toContain(esc(d.grid.honest));
  });

  it("reserves the frame of every preview, so nothing jumps as they load", () => {
    const widths = html.match(/width="1280"/g) || [];
    expect(widths.length).toBe(demoCardKeys.length);
    expect((html.match(/height="800"/g) || []).length).toBe(demoCardKeys.length);
  });

  it("keeps one clay action, which is the diagnostic", () => {
    // Identity v3: a viewport holds one clay element. The four Open buttons
    // are ghosts, so the page's only .cta is the close.
    expect((html.match(/class="cta cta-lg"/g) || []).length).toBe(1);
    expect(html).toContain(site[locale].diag.cta);
  });

  it("carries the page metadata and the hreflang pair", async () => {
    const meta = (await generateMetadata({ params: Promise.resolve({ locale }) })) as {
      title: string;
      alternates: { canonical: string; languages: Record<string, string> };
    };
    expect(meta.title).toBe(d.meta.title);
    expect(meta.alternates.canonical).toBe(localePath(locale, "/demos"));
    expect(meta.alternates.languages["x-default"]).toBe("/es/demos");
  });
});

describe("the nav carries the page", () => {
  const nav = readFileSync(join(ROOT, "components", "site", "Nav.tsx"), "utf8");

  it("has a Demos item in the row", () => {
    expect(nav).toContain('href("/demos")');
    expect(nav).toContain("t.demos");
  });

  it.each(locales)("labels it in %s", (locale: Locale) => {
    expect(site[locale].nav.demos.length).toBeGreaterThan(0);
  });
});

describe("the preview motion", () => {
  const css = readFileSync(join(ROOT, "app", "[locale]", "demos", "demos.css"), "utf8");

  /**
   * The constraint on the bead: a visitor who asks for stillness gets the page
   * with the travel removed, never with the content removed. The hover
   * transforms are the only motion here, so the reduced-motion block has to
   * undo both of them.
   */
  it("parks the hover travel under prefers-reduced-motion", () => {
    const block = css.slice(css.indexOf("@media (prefers-reduced-motion:reduce)"));
    expect(block).toContain("transform:none");
    expect(block).toContain(".dm-img");
    expect(block).toContain(".dm-plate");
  });

  it("never hides a card at rest", () => {
    // The reveal is the shared one, which is gated on .js and shows instantly
    // under reduced motion. Nothing on this page may hide a card on its own.
    expect(css).not.toMatch(/\.dm-(card|body|shot)[^{]*\{[^}]*opacity:\s*0/);
    expect(css).not.toMatch(/\.dm-(card|body|shot)[^{]*\{[^}]*visibility:\s*hidden/);
  });
});
