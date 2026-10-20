import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

// vitest compiles this app's JSX with the classic runtime, so React has to be a
// global before the component module loads (same shim as ContactForm.test.tsx).
(globalThis as unknown as { React: typeof React }).React = React;

import HalftoneSunset, {
  BASE_TONE,
  LEVEL_SLOTS,
  builderLevel,
  dotBump,
  dotLayer,
  dotRadius,
  dotReach,
  dotValue,
  easeLevel,
  isStuck,
  MIN_ROWS,
  SCENE_ASPECT,
  sceneWidth,
  screenPitch,
  sunRadius,
  toneGain,
  waveFront,
} from "./HalftoneSunset";
import PackageBuilder from "./PackageBuilder";
import { EMPTY_SELECTION, type BuilderSelection } from "../../lib/builder";
import { LocaleProvider } from "../../lib/i18n/LocaleProvider";
import { moduleIds, type ModuleId } from "../../lib/pricing";

/**
 * The halftone sunset (bead hq-lgjo.10).
 *
 * The drawing itself is a screenshot matter; what is checked here is the
 * arithmetic the drawing hangs on, because each of these is a sentence in the
 * bead that a reader cannot verify by looking at one frame:
 *
 *   "with nothing picked it is a flat, faint, uniform screen"
 *   "each pick raises the contrast" and the wave only ever rises
 *   "with everything picked it is the full sunset"
 *   the loop can stop, so an idle builder costs no frames
 *   it is decoration: aria-hidden, no text of its own, no pointer events
 *
 * And from bead hq-lgjo.11, the band stays in view while the client builds:
 * it sticks under the header, shrinks to a strip without moving the groups,
 * and the strip is a re-composed sunset rather than a crop of the tall one.
 */

const css = (name: string) =>
  readFileSync(fileURLToPath(new URL(name, import.meta.url)), "utf8").replace(/\s/g, "");
/** One rule's body, whitespace stripped, so a declaration can be looked up in it. */
const rule = (sheet: string, selector: string) => {
  const at = sheet.indexOf(selector.replace(/\s/g, "") + "{");
  expect(at, selector).toBeGreaterThanOrEqual(0);
  const open = at + selector.replace(/\s/g, "").length + 1;
  return sheet.slice(open, sheet.indexOf("}", open));
};

const FULL: BuilderSelection = {
  web: "presencia",
  care: true,
  ads: "local",
  modules: [...moduleIds],
};

describe("builderLevel", () => {
  it("counts a doubled module once", () => {
    expect(
      builderLevel({ ...EMPTY_SELECTION, modules: ["produccion", "produccion"] as ModuleId[] })
    ).toBeCloseTo(1 / LEVEL_SLOTS, 12);
  });

  it("is 0 with nothing picked and 1 with everything", () => {
    expect(builderLevel(EMPTY_SELECTION)).toBe(0);
    expect(builderLevel(FULL)).toBe(1);
  });

  it("counts one slot per tick: a package, its care, an ads scope, each module", () => {
    expect(LEVEL_SLOTS).toBe(3 + moduleIds.length);
    expect(builderLevel({ ...EMPTY_SELECTION, web: "presencia" })).toBeCloseTo(1 / LEVEL_SLOTS, 12);
    expect(builderLevel({ ...EMPTY_SELECTION, ads: "local" })).toBeCloseTo(1 / LEVEL_SLOTS, 12);
    expect(builderLevel({ ...EMPTY_SELECTION, modules: ["produccion"] })).toBeCloseTo(
      1 / LEVEL_SLOTS,
      12
    );
    expect(builderLevel({ ...EMPTY_SELECTION, web: "presencia", care: true })).toBeCloseTo(
      2 / LEVEL_SLOTS,
      12
    );
  });

  it("never reads above 1, whatever the selection claims", () => {
    /* Care without a package is not offered, and a module id from an old link
       is dropped by lib/builder's parser; neither may lift the level. */
    expect(builderLevel({ ...EMPTY_SELECTION, care: true })).toBe(0);
    const bogus = [...moduleIds, "produccion", "ghost" as ModuleId] as ModuleId[];
    expect(builderLevel({ ...FULL, modules: bogus })).toBe(1);
  });
});

describe("the screen fills from the bottom up", () => {
  const heights = [0, 0.17, 0.33, 0.5, 0.66, 0.83, 1];

  it("is a flat, uniform screen with nothing picked", () => {
    /* Every dot, at every height and every tone, carries exactly the base
       screen: no sunset is visible at level 0. */
    for (const yn of heights) {
      expect(dotReach(yn, 0)).toBe(0);
      for (const tone of [0, 0.4, 1]) {
        expect(dotValue(tone, dotReach(yn, 0), 0)).toBeCloseTo(BASE_TONE, 12);
      }
    }
    /* And that screen is faint: the radius is well under half a dot pitch. */
    expect(dotRadius(1, BASE_TONE)).toBeLessThan(0.45);
  });

  it("is the full sunset with everything picked", () => {
    for (const yn of heights) expect(dotReach(yn, 1)).toBe(1);
    for (const tone of [0, 0.4, 1]) {
      expect(dotValue(tone, dotReach(0.5, 1), 0)).toBeCloseTo(0.025 + 0.975 * tone, 12);
    }
  });

  it("only ever rises: more picks never un-draw a dot", () => {
    const levels = Array.from({ length: 41 }, (_, i) => i / 40);
    for (const yn of heights) {
      let prev = -1;
      for (const lv of levels) {
        const reach = dotReach(yn, lv);
        expect(reach).toBeGreaterThanOrEqual(prev - 1e-12);
        prev = reach;
      }
    }
  });

  it("raises the front past the top of the band, and the contrast with it", () => {
    expect(waveFront(0)).toBeLessThan(0);
    expect(waveFront(1)).toBeGreaterThan(1);
    expect(toneGain(0)).toBe(0);
    expect(toneGain(1)).toBe(1);
    /* Half the boxes ticked is most of the way up, which is what the reference
       screenshot at 3 of 9 shows: the wave front, not the finished sunset. */
    expect(waveFront(0.5)).toBeGreaterThan(0.5);
    expect(dotReach(0.9, 0.5)).toBeLessThan(0.05);
    expect(dotReach(0.1, 0.5)).toBeGreaterThan(0.5);
  });

  it("a half-lit band is lighter at the top than at the bottom", () => {
    expect(dotReach(0.2, 0.5)).toBeGreaterThan(dotReach(0.8, 0.5));
  });
});

describe("the ripple", () => {
  it("rides the front and dies away from it", () => {
    const lv = 0.5;
    const front = waveFront(lv);
    expect(dotBump(front, lv, 0.4)).toBeCloseTo(0.4, 12);
    expect(dotBump(front + 0.25, lv, 0.4)).toBeLessThan(1e-5);
    expect(dotBump(front - 0.25, lv, 0.4)).toBeLessThan(1e-5);
  });

  it("is nothing at all when the level is not moving", () => {
    expect(dotBump(waveFront(0.5), 0.5, 0)).toBe(0);
    expect(dotValue(0.5, 0.5, 0)).toBeCloseTo(BASE_TONE + (0.025 + 0.975 * 0.5 - BASE_TONE) * 0.5, 12);
  });
});

describe("ink layers", () => {
  it("put the ripple first, then the sun, then the sunset's own tone", () => {
    expect(dotLayer(0.9, 1, 0.3, true)).toBe(3); // the ripple wins
    expect(dotLayer(0.9, 1, 0, true)).toBe(4); // the sun and its path
    expect(dotLayer(0.9, 1, 0, false)).toBe(2); // deep tone
    expect(dotLayer(0.5, 1, 0, false)).toBe(1); // middle tone
    expect(dotLayer(0.1, 1, 0, false)).toBe(0); // the flat screen
  });

  it("holds the sun back until the wave has reached it", () => {
    expect(dotLayer(0.9, 0.3, 0, true)).not.toBe(4);
    expect(dotLayer(0.9, 0.4, 0, true)).toBe(4);
  });
});

describe("dot radius", () => {
  it("grows with the value and clamps at the over-full reading", () => {
    expect(dotRadius(4, 0)).toBe(0);
    expect(dotRadius(4, 1)).toBe(4);
    expect(dotRadius(4, 2)).toBeCloseTo(4 * Math.sqrt(1.15), 12);
    expect(dotRadius(4, -1)).toBe(0);
  });
});

describe("the level easing lets the loop stop", () => {
  it("reaches the target exactly, and stops within three seconds of frames", () => {
    let lv = 0;
    let frames = 0;
    while (lv !== LEVEL_SLOTS && frames < 600) {
      lv = easeLevel(lv, LEVEL_SLOTS, 1 / 60);
      frames++;
      expect(lv).toBeLessThanOrEqual(LEVEL_SLOTS);
    }
    expect(lv).toBe(LEVEL_SLOTS);
    /* The reference's rate 3.6 with its 1e-3 snap: about 2.4s to the last
       hundredth of a pick, of which the visible nine tenths is the first 0.7s. */
    expect(frames).toBeLessThan(180);
  });

  it("walks back down the same way, without overshooting", () => {
    let lv = LEVEL_SLOTS;
    for (let i = 0; i < 600 && lv !== 0; i++) {
      lv = easeLevel(lv, 0, 1 / 60);
      expect(lv).toBeGreaterThanOrEqual(0);
    }
    expect(lv).toBe(0);
  });

  it("stands still once it is there", () => {
    expect(easeLevel(2, 2, 1 / 60)).toBe(2);
  });
});

describe("the band is decoration and nothing else", () => {
  it("renders an aria-hidden canvas with no text of its own", () => {
    const html = renderToStaticMarkup(React.createElement(HalftoneSunset, { level: 0.5 }));
    expect(html).toBe('<div class="pb-sunset" aria-hidden="true"><canvas aria-hidden="true"></canvas></div>');
  });

  it("swallows clicks over hidden options and leaves no text over itself", () => {
    const raw = readFileSync(fileURLToPath(new URL("./halftone.css", import.meta.url)), "utf8");
    /* Stuck, the band covers options that scrolled under it: a click there
       must land on the band, never on a box the visitor cannot see. */
    expect(rule(css("./halftone.css"), ".pb-sunset")).toContain("pointer-events:auto");
    expect(rule(css("./halftone.css"), ".pb-sunset canvas")).toContain("pointer-events:none");
    /* The band is its own strip, so nothing is positioned on top of it. */
    expect(raw).not.toMatch(/position:\s*absolute[^}]*;\s*z-index/);
  });

  it("is mounted by the builder in both of its modes", () => {
    for (const mode of ["form", "standalone"] as const) {
      const html = renderToStaticMarkup(
        // LocaleProvider declares children as required, see winery-page.test.ts.
        // eslint-disable-next-line react/no-children-prop
        React.createElement(LocaleProvider, {
          locale: "es",
          children: React.createElement(PackageBuilder, {
            value: EMPTY_SELECTION,
            onChange: () => {},
            mode,
          }),
        })
      );
      expect(html).toContain('<div class="pb-sunset" aria-hidden="true">');
      /* First child of .pb, so the groups and the estimate sit below it. */
      expect(html).toMatch(/<div class="pb" data-mode="[a-z]+"><div class="pb-sunset"/);
    }
  });
});

describe("the band stays in view while the client builds", () => {
  it("sticks under the measured header, above the groups, opaque", () => {
    const band = rule(css("./halftone.css"), ".pb-sunset");
    expect(band).toContain("position:sticky");
    /* The header's height is measured by the component, never a guessed px. */
    expect(band).toContain("top:var(--pb-stick-top)");
    expect(band).toMatch(/z-index:[1-9]/);
    expect(band).toContain("background:var(--ground)");
    expect(band).toContain("border-bottom:1pxsolid");
  });

  it("shrinks to a strip without moving anything below it", () => {
    const sheet = css("./halftone.css");
    const band = rule(sheet, ".pb-sunset");
    const stuck = rule(sheet, ".pb-sunset[data-stuck]");
    expect(band).toContain("height:var(--pb-band-full)");
    expect(band).toContain("2px;"); // the margin under the full band
    expect(stuck).toContain("height:var(--pb-band-short)");
    /* What the height loses goes onto what follows, not the band's own
       margin, which would push a sticky band out before the builder ends. */
    expect(stuck).not.toContain("margin-bottom");
    expect(sheet).toContain(".pb-sunset[data-stuck]+.pb-groups{margin-top:calc(var(--pb-band-full)-var(--pb-band-short));}");
    /* Focus scrolls clear of the stuck strip, not just of the header. */
    expect(sheet).toContain("scroll-margin-top:calc(var(--pb-stick-top)+var(--pb-band-short)+24px)");
    /* 64 to 90px on a desktop and 56 to 64px on a phone, sized in vw, never %. */
    expect(rule(sheet, ".pb")).toContain("--pb-band-short:clamp(56px,5.5vw,84px)");
  });

  it("sits in a flex box, because a grid item sticks only inside its own row", () => {
    const sheet = css("./builder.css");
    const pb = rule(sheet, ".pb");
    expect(pb).toContain("display:flex");
    expect(pb).not.toContain("display:grid");
    /* The standalone summary sticks below the stuck band, not behind it. */
    expect(sheet).toContain("top:calc(var(--pb-stick-top)+var(--pb-band-short)+20px)");
  });

  it("is stuck once its top reaches the header, and never while hidden", () => {
    expect(isStuck(65, 160, 65)).toBe(true);
    expect(isStuck(65.6, 160, 65)).toBe(true); // a sub-pixel stick still counts
    expect(isStuck(-40, 79, 65)).toBe(true); // the builder's end is pushing it out
    expect(isStuck(300, 160, 65)).toBe(false);
    expect(isStuck(0, 0, 65)).toBe(false); // the form's panel is folded
  });
});

describe("the strip is re-composed, not cropped", () => {
  it("leaves the full band exactly as the reference drew it", () => {
    for (const [W, H] of [
      [1440, 180],
      [1200, 150],
      [390, 118],
    ]) {
      expect(sceneWidth(W, H)).toBe(W);
      expect(sunRadius(W, H)).toBeCloseTo(H * 0.22, 9);
      expect(screenPitch(W, H)).toBe(W < 560 ? 4.6 : 5.4);
    }
  });

  it("keeps the headlands' proportions on a strip", () => {
    expect(sceneWidth(1440, 79)).toBeCloseTo(79 * SCENE_ASPECT, 9);
    expect(sceneWidth(1440, 79)).toBeLessThan(1440);
  });

  it("gives the strip a sun that reads and stays inside the band", () => {
    for (const [W, H] of [
      [1440, 79],
      [1920, 84],
      [390, 56],
    ]) {
      const sr = sunRadius(W, H);
      expect(sr).toBeGreaterThanOrEqual(H * 0.22);
      expect(sr).toBeLessThanOrEqual(H * 0.26);
      expect(H * 0.5 - sr).toBeGreaterThan(0); // its top is under the band's top
    }
    /* A 1440 strip is far wider than the scene, so its sun is the larger one. */
    expect(sunRadius(1440, 79)).toBeCloseTo(79 * 0.26, 2);
  });

  it("draws the strip with enough rows of dots to be a picture", () => {
    for (const [W, H] of [
      [1440, 79],
      [390, 56],
      [1024, 56],
    ]) {
      expect(H / screenPitch(W, H)).toBeGreaterThanOrEqual(MIN_ROWS - 1e-9);
    }
  });
});
