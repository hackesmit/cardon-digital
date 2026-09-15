import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { SPOTLIGHT_SELECTOR, spotlightVars } from "./SpotlightFrames";

/**
 * hq-4pu0q.4. The copy rewrite deleted this visual and Daniel reversed it: a
 * copy bead never deletes a visual, and retiring one is his call alone. These
 * are the four ways the glow can die without anybody seeing it, since it only
 * exists under a moving cursor and never appears in a screenshot: the geometry
 * goes wrong, the page stops mounting the component, a stylesheet stops reading
 * the variables the handler writes, or the frame classes get renamed out from
 * under the selector.
 */
const ROOT = join(__dirname, "..", "..", "..");
const read = (...p: string[]) => readFileSync(join(ROOT, ...p), "utf8");

const PAGE = read("app", "[locale]", "work", "monte-xanic", "page.tsx");
const CASE_CSS = read("app", "[locale]", "work", "monte-xanic", "case.css");
const GLOBALS = read("app", "globals.css");

describe("spotlightVars", () => {
  it("writes the cursor's position relative to the frame, in px", () => {
    expect(spotlightVars({ left: 100, top: 40 }, 260, 190)).toEqual({
      "--mx": "160px",
      "--my": "150px",
    });
  });

  it("keeps the fraction a subpixel rect carries", () => {
    expect(spotlightVars({ left: 12.5, top: 8.25 }, 100, 100)).toEqual({
      "--mx": "87.5px",
      "--my": "91.75px",
    });
  });

  it("does not clamp a cursor that has left the frame", () => {
    // The listener is per frame, so this only happens on the pointermove that
    // leaves it. Clamping here would stick the glow to the edge instead.
    expect(spotlightVars({ left: 300, top: 300 }, 280, 290)).toEqual({
      "--mx": "-20px",
      "--my": "-10px",
    });
  });
});

describe("the case page keeps the spotlight wired", () => {
  it("mounts SpotlightFrames inside the .pg-case main", () => {
    expect(PAGE).toContain('from "@/components/pages/case/SpotlightFrames"');
    expect(PAGE).toContain("<SpotlightFrames />");
    expect(PAGE).toContain('className="pg-case"');
    // The selector is scoped to .pg-case, so a mount outside that main would
    // attach to nothing.
    const mount = PAGE.indexOf("<SpotlightFrames />");
    expect(mount).toBeGreaterThan(PAGE.indexOf('className="pg-case"'));
    expect(mount).toBeLessThan(PAGE.indexOf("</main>"));
  });

  it("still has a stylesheet rule reading both variables for every class it targets", () => {
    const classes = SPOTLIGHT_SELECTOR.split(",").map((s) => s.trim().split(".").pop());
    expect(classes).toEqual(["vis-frame", "vine-stage"]);
    const css = CASE_CSS + GLOBALS;
    for (const cls of classes) {
      const rule = new RegExp(`\\.${cls}::after\\{[^}]*var\\(--mx[^}]*var\\(--my`, "s");
      expect(rule.test(css), `no ::after rule reads --mx / --my for .${cls}`).toBe(true);
    }
  });

  it("still has a live frame for every class it targets", () => {
    const sources = [
      PAGE,
      read("components", "pages", "case", "VineyardMap.tsx"),
      read("components", "pages", "case", "BerryToBottle.tsx"),
      read("components", "pages", "case", "PlayOnceVis.tsx"),
    ].join("\n");
    for (const cls of ["vis-frame", "vine-stage"]) {
      const rendered = new RegExp(`className=[{"][^"}]*\\b${cls}\\b`);
      expect(rendered.test(sources), `nothing on the case page renders .${cls}`).toBe(true);
    }
  });
});
