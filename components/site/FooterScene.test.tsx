import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SCENE_ART_D,
  SCENE_ART_TRANSFORM,
  SCENE_ART_VIEWBOX,
  SCENE_HORIZON_Y,
  SCENE_SUN_D,
  SCENE_VIEWBOX_ROWS,
  SCENE_VIEWBOX_TOP,
} from "./footer-scene-paths";
import {
  HORIZON,
  STAR_COUNT,
  STAR_FADE_DELAY,
  STAR_FADE_SECONDS,
  STARS,
  SUNSET_SECONDS,
  SUN_DRIFT,
  SUN_DROP,
  SUN_SET_X,
} from "./footer-sky";

// Same test-only shim as ReachMap.test.tsx: vitest compiles this app's JSX
// with the classic runtime, so React must be global before the component
// module loads, hence the dynamic import below.
(globalThis as unknown as { React: typeof React }).React = React;

/**
 * Guards for the sunset in the footer band (bead hq-0xca.2).
 *
 * The effect has no JavaScript in it: it is three layers whose end state is
 * written in a stylesheet against the document's data-mode. A stylesheet
 * cannot import a number, so footer-sky.ts derives the geometry and
 * footer-sky.css repeats it as literals, and the pair can drift apart with
 * nothing failing and nobody noticing until the sun cuts through the ground
 * line on a phone. Most of what follows reads both files and compares them.
 *
 * The rest guards the three properties a screenshot cannot show: that the sun
 * is the mark's own ring rather than a second one, that nothing but transform
 * and opacity moves, and that a reader who asked for no motion gets none.
 */

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");
const CSS = read("components/site/footer-sky.css");
const SCENE = read("components/site/FooterScene.tsx");
const SKY = read("components/site/footer-sky.ts");

/** The literal the stylesheet carries, where the source has an expression. */
function cssNumber(pattern: RegExp): number {
  const hit = CSS.match(pattern);
  expect(hit, `footer-sky.css has no match for ${pattern}`).not.toBeNull();
  return Number(hit![1]);
}

describe("the sun that sets is the mark's own", () => {
  it("is the open ring the artwork draws, lifted out whole", () => {
    // The ring and its hole, the two subpaths of the sun in the traced art.
    expect(SCENE_SUN_D.startsWith("M718 370")).toBe(true);
    expect(SCENE_SUN_D).toContain("m14 -14");
  });

  it("is gone from the drawing, so nothing draws it twice", () => {
    expect(SCENE_ART_D).not.toContain(SCENE_SUN_D);
    expect(SCENE_ART_D).not.toContain("M718 370");
  });

  it("leaves the saguaro, the mountain and the lettering where they were", () => {
    expect(SCENE_ART_D.startsWith("M117 455")).toBe(true);
    // Fourteen subpaths: the drawing, then the thirteen letters of the two
    // words. Fifteen means the sun came back; thirteen means a letter left.
    const subpaths = SCENE_ART_D.split(/(?=M)/).filter((s) => s.trim());
    expect(subpaths).toHaveLength(14);
  });

  it("rides the art's own box and transform, so it lands where it was", () => {
    const layer = SCENE.slice(SCENE.indexOf('className="scene-sun"'));
    expect(layer).toContain(`viewBox={SCENE_ART_VIEWBOX}`);
    expect(layer).toContain(`transform={SCENE_ART_TRANSFORM}`);
    // Not a placeholder: both are the real strings the drawing uses.
    expect(SCENE_ART_VIEWBOX).toBe("40 30 860 465");
    expect(SCENE_ART_TRANSFORM).toContain("translate(40 30)");
  });
});

describe("the stylesheet carries the geometry the source derives", () => {
  it("cuts the sun layer at the ground line", () => {
    expect(cssNumber(/height: calc\(var\(--sh\) \* ([\d.]+)\)/)).toBeCloseTo(HORIZON, 5);
  });

  it("drops the sun by its own measured fall, and drifts it west", () => {
    const drop = cssNumber(/transform: translate\([\d.]+%, ([\d.]+)%\)/) / 100;
    const drift = cssNumber(/transform: translate\(([\d.]+)%, [\d.]+%\)/) / 100;
    expect(drop).toBeCloseTo(SUN_DROP, 5);
    expect(drift).toBeCloseTo(SUN_DRIFT, 5);
  });

  it("puts the afterglow where the sun goes down", () => {
    expect(cssNumber(/var\(--aw\) \* ([\d.]+)\)/)).toBeCloseTo(SUN_SET_X, 5);
  });

  it("times the sun, the sky and the stars as the source says", () => {
    expect(cssNumber(/transition: transform ([\d.]+)s cubic-bezier/)).toBe(SUNSET_SECONDS);
    expect(cssNumber(/\.scene-sky \{[^}]*transition: opacity ([\d.]+)s ease/)).toBe(
      SUNSET_SECONDS,
    );
    expect(cssNumber(/transition: opacity ([\d.]+)s ease [\d.]+s/)).toBe(STAR_FADE_SECONDS);
    expect(cssNumber(/transition: opacity [\d.]+s ease ([\d.]+)s/)).toBe(STAR_FADE_DELAY);
  });

  it("lands the stars with the sun rather than after it", () => {
    expect(STAR_FADE_DELAY + STAR_FADE_SECONDS).toBeCloseTo(SUNSET_SECONDS, 5);
  });
});

describe("the sun ends under the ground and nowhere else", () => {
  /** The sun's own rows in the viewBox, measured from the traced path. */
  const SUN_TOP_ROW = 124;
  const SUN_BOTTOM_ROW = 198;

  it("starts entirely above the cut, so light mode is the artwork untouched", () => {
    expect(SUN_BOTTOM_ROW).toBeLessThan(SCENE_HORIZON_Y);
    // The light state sets no transform on the layer at all.
    const start = CSS.indexOf(".scene-sun {");
    const end = CSS.indexOf(':root[data-mode="dark"] .scene-sun {');
    expect(start).toBeGreaterThan(0);
    expect(end).toBeGreaterThan(start);
    expect(CSS.slice(start, end)).not.toContain("transform:");
  });

  it("ends entirely below it, with room to spare at any band height", () => {
    const restingTop = SUN_TOP_ROW + SUN_DROP * SCENE_VIEWBOX_ROWS;
    expect(restingTop).toBeGreaterThan(SCENE_HORIZON_Y);
    // At the smallest band the site draws, 64px, a row is a seventh of a
    // pixel; ten rows of clearance is a pixel and a half of margin.
    expect(restingTop - SCENE_HORIZON_Y).toBeGreaterThanOrEqual(10);
  });

  it("cuts inside the drawn ground line rather than beside it", () => {
    // The rows the line occupies under the sun, walked with isPointInFill in
    // a browser on 2026-10-19: 334 to 348 at x 737, 345 to 362 at x 811.
    expect(SCENE_HORIZON_Y).toBeGreaterThanOrEqual(345.75);
    expect(SCENE_HORIZON_Y).toBeLessThanOrEqual(348.25);
  });

  it("measures the horizon as a share of the band the art actually fills", () => {
    expect(HORIZON).toBeCloseTo((SCENE_HORIZON_Y - SCENE_VIEWBOX_TOP) / SCENE_VIEWBOX_ROWS, 10);
  });
});

describe("the stars are a sky, not a wallpaper and not a hydration bug", () => {
  it("is three dozen points", () => {
    expect(STARS).toHaveLength(STAR_COUNT);
    expect(STAR_COUNT).toBe(36);
  });

  it("keeps every one of them in the sky, clear of the ground line", () => {
    for (const star of STARS) {
      expect(star.y).toBeGreaterThan(0);
      expect(star.y).toBeLessThan(HORIZON * 100 - 5);
      expect(star.x).toBeGreaterThan(0);
      expect(star.x).toBeLessThan(100);
    }
  });

  it("scatters them without a knot", () => {
    // Nothing closer than this, in percent of the band, reading x and y on
    // the same scale. A free scatter of thirty-six points on a strip reliably
    // puts two inside two points of each other, which reads as a smudge.
    let closest = Infinity;
    for (let i = 0; i < STARS.length; i += 1) {
      for (let j = i + 1; j < STARS.length; j += 1) {
        const dx = STARS[i].x - STARS[j].x;
        const dy = STARS[i].y - STARS[j].y;
        closest = Math.min(closest, Math.hypot(dx, dy));
      }
    }
    expect(closest).toBeGreaterThan(3);
  });

  it("gives each one its own beat, so the sky never blinks as one", () => {
    const beats = new Set(STARS.map((s) => `${s.beat}:${s.wait}`));
    expect(beats.size).toBe(STARS.length);
    for (const star of STARS) {
      expect(star.beat).toBeGreaterThanOrEqual(2.6);
      expect(star.beat).toBeLessThanOrEqual(5.4);
      expect(star.wait).toBeLessThanOrEqual(4.2);
      expect(star.glow).toBeGreaterThan(0.4);
      expect(star.glow).toBeLessThanOrEqual(0.95);
    }
  });

  /**
   * The band is server rendered and then hydrated. A scatter drawn from
   * Math.random would give the server one sky and the browser another, and
   * React would quietly keep the server's markup with the client's numbers.
   */
  it("draws the same sky every time the module loads", async () => {
    vi.resetModules();
    const again = (await import("./footer-sky")).STARS;
    expect(again).toEqual(STARS);
    // Comments out first: footer-sky.ts says the words in prose, and a guard
    // that a comment can satisfy or break is not a guard.
    const code = (s: string) => s.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
    expect(code(SKY)).not.toContain("Math.random");
    expect(code(SCENE)).not.toContain("Math.random");
  });

  it("freezes the table, so nothing can nudge a star at runtime", () => {
    expect(Object.isFrozen(STARS)).toBe(true);
  });
});

describe("the effect is the document's own mode, and costs only transform and opacity", () => {
  it("reads data-mode in CSS rather than listening for the toggle", () => {
    for (const layer of [".scene-sky", ".scene-stars", ".scene-sun", ".scene-star"]) {
      expect(CSS, layer).toContain(`:root[data-mode="dark"] ${layer}`);
    }
    // The band's only effect is the tumbleweed's; the sky adds no listener.
    expect(SCENE).not.toContain("cardon-mode");
  });

  it("transitions nothing but transform and opacity", () => {
    const moved = (CSS.match(/transition:\s*[a-z-]+/g) ?? []).map((d) =>
      d.replace(/transition:\s*/, ""),
    );
    expect(moved.length).toBeGreaterThan(0);
    for (const property of moved) {
      expect(["transform", "opacity", "none"]).toContain(property);
    }
  });

  it("animates nothing but opacity", () => {
    const frames = CSS.slice(CSS.indexOf("@keyframes star-twinkle"));
    const block = frames.slice(0, frames.indexOf("\n}") + 2);
    expect(block).toContain("opacity");
    for (const property of ["transform", "width", "height", "top", "left", "filter"]) {
      expect(block, property).not.toContain(`${property}:`);
    }
  });

  it("leaves the twinkle out of light mode entirely", () => {
    // The brace is part of the needle on purpose: ".scene-star" is a prefix
    // of ".scene-stars", and without it this slice ran backwards and read as
    // an empty string, which passes every assertion anyone puts after it.
    const start = CSS.indexOf(".scene-star {");
    const end = CSS.indexOf(':root[data-mode="dark"] .scene-star {');
    expect(start).toBeGreaterThan(0);
    expect(end).toBeGreaterThan(start);
    expect(CSS.slice(start, end)).not.toContain("animation:");
  });

  it("never takes a pointer", () => {
    expect(CSS).toContain("pointer-events: none");
  });
});

describe("prefers-reduced-motion gets the end state and no motion", () => {
  const still = CSS.slice(CSS.indexOf("@media (prefers-reduced-motion: reduce)"));

  it("switches off every transition the file declares, in both modes", () => {
    // A selector with the dark mode in it beats a bare class wherever it is
    // written, so the override has to repeat it. This is the rule that was
    // wrong on the first pass: the stars still waited 0.7s and faded in.
    for (const selector of [
      ".scene-sky",
      ".scene-stars",
      ':root[data-mode="dark"] .scene-stars',
      ".scene-sun",
      ':root[data-mode="dark"] .scene-sun',
    ]) {
      expect(still, selector).toContain(selector);
    }
    expect(still).toContain("transition: none");
  });

  it("stops the twinkle where it is actually declared", () => {
    expect(still).toContain(':root[data-mode="dark"] .scene-star');
    expect(still).toContain("animation: none");
  });
});

describe("the band renders the sky on the server", async () => {
  const { default: FooterScene } = await import("./FooterScene");
  const html = renderToStaticMarkup(React.createElement(FooterScene));

  it("draws every star, with its own beat on the element", () => {
    expect(html.match(/class="scene-star"/g) ?? []).toHaveLength(STAR_COUNT);
    expect(html).toContain("--star-beat");
    expect(html).toContain("--star-glow");
  });

  it("draws one sun, inside the layer that clips it at the ground", () => {
    expect(html.match(/class="scene-sun"/g) ?? []).toHaveLength(1);
    expect(html.indexOf('class="scene-sun-clip"')).toBeLessThan(html.indexOf('class="scene-sun"'));
    expect(html).toContain(SCENE_SUN_D);
  });

  it("puts the sky behind the drawing", () => {
    expect(html.indexOf('class="scene-sky"')).toBeLessThan(html.indexOf('class="scene-art"'));
    expect(html.indexOf('class="scene-stars"')).toBeLessThan(html.indexOf('class="scene-art"'));
    expect(html.indexOf('class="scene-sun-clip"')).toBeLessThan(html.indexOf('class="scene-art"'));
  });

  it("stays hidden from assistive tech, like the rest of the band", () => {
    expect(html).toContain('aria-hidden="true"');
  });
  // hq-o5ny1: the ground line is 0.3 of the band high at its centre. A tumbleweed
  // whose bottom sat on that centre had its lower half cut by the mask hole where
  // the saguaro's arm and the mountain's foot meet, so it rests on the line's top.
  it("keeps the tumbleweed above the centre of the ground line", () => {
    const css = read("app/globals.css");
    const hit = css.match(/\.scene-tw\{[^}]*bottom:calc\(var\(--sh\) \* ([\d.]+)\)/);
    expect(hit).not.toBeNull();
    expect(Number(hit![1])).toBeGreaterThan(0.3);
  });
});
