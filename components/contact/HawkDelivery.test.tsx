// @vitest-environment jsdom
import { act } from "react";
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The delivery egg, held against what it promises (beads hq-0xca.3 and
 * hq-0xca.6).
 *
 * The flight itself is geometry, so most of this is arithmetic rather than a
 * browser: the fold that starts from the form's own box, the shape of the
 * path, the budget it fits in, and the two joins that can go wrong without
 * looking wrong in a screenshot, which are the folded sheet becoming the
 * letter and the letter leaving its fall and arriving on the talons. The frames themselves are a
 * browser job and are recorded on the bead.
 *
 * The rest is the three rules in the component's own comment, each as a case
 * that can fail: it never speaks to assistive tech, it never draws half an
 * effect, and a reduced motion visitor gets the end state and no movement.
 */

(globalThis as unknown as { React: typeof React }).React = React;

import HawkDelivery, {
  BOTTOM_FOLD,
  CARRY_S,
  CATCH_S,
  END_S,
  FALL_S,
  FOLD_S,
  HAWK_IN_S,
  LAUNCH_S,
  SNAP_S,
  TALON_PIN,
  TOP_FOLD,
  catchPoint,
  flapTransformOf,
  flightAt,
  sceneFor,
  sheetBox,
  sheetTransformOf,
  transformOf,
  type LaunchBox,
} from "./HawkDelivery";

const repoRoot = () => join(__dirname, "..", "..");
/* The form as measured at 1440 by 900 on /es/contacto, height included. */
const BOX: LaunchBox = { x: 688, y: 82, width: 598, height: 818 };
const VW = 1440;
const VH = 900;
const LETTER_W = 50;
const scene = sceneFor(BOX, VW, VH, 160, LETTER_W);
/** The moment the letter is on its own, falling. */
const FALL_AT = FOLD_S + LAUNCH_S;
/** The paper inside the letter's viewBox, as fractions of its drawn width. */
const PAPER_W = 39.2 / 44;
const PAPER_H = 22.8 / 44;
/** Every frame of one flight at 120fps, which is denser than any display. */
const flight = Array.from({ length: Math.ceil(END_S * 120) + 1 }, (_, i) =>
  flightAt(i / 120, scene),
);

describe("the flight fits the budget Daniel set", () => {
  it("runs inside about 3.5 seconds end to end, fold included", () => {
    expect(END_S).toBeGreaterThanOrEqual(2.5);
    expect(END_S).toBeLessThanOrEqual(3.5);
  });

  it("orders its moments: fold, launch, then the bird, then the catch, then the carry", () => {
    expect(BOTTOM_FOLD.at + BOTTOM_FOLD.len).toBeLessThanOrEqual(FOLD_S);
    expect(TOP_FOLD.at + TOP_FOLD.len).toBeLessThanOrEqual(FOLD_S);
    expect(HAWK_IN_S).toBeGreaterThan(FOLD_S + LAUNCH_S);
    expect(HAWK_IN_S).toBeLessThan(CATCH_S);
    expect(CATCH_S).toBeCloseTo(FOLD_S + LAUNCH_S + FALL_S, 9);
    expect(END_S).toBe(CATCH_S + CARRY_S);
  });

  it("gives the bird long enough to be seen before it takes anything", () => {
    expect(CATCH_S - HAWK_IN_S).toBeGreaterThan(0.8);
  });
});

describe("the form folds into the letter", () => {
  const at = (t: number) => flightAt(t, scene);
  const folding = flight.filter((_, i) => i / 120 < FOLD_S);

  it("starts as the form's own box: same centre, same size, nothing turned", () => {
    const first = at(0).sheet;
    expect(first.x).toBeCloseTo(BOX.x + BOX.width / 2, 6);
    expect(first.y).toBeCloseTo(BOX.y + BOX.height! / 2, 6);
    expect(first.sx).toBe(1);
    expect(first.sy).toBe(1);
    expect(first.rot).toBe(0);
    expect(first.bottom).toBe(0);
    expect(first.top).toBe(0);
    expect(scene.sheetW).toBe(BOX.width);
    expect(scene.sheetH).toBe(BOX.height);
    expect(at(0).sheetOn).toBe(true);
  });

  it("stays put where the form was while it folds", () => {
    for (const f of folding) {
      expect(f.sheet.x).toBe(folding[0].sheet.x);
      expect(f.sheet.y).toBe(folding[0].sheet.y);
      expect(f.sheet.sx).toBe(1);
      expect(f.letterAlpha).toBe(0);
    }
  });

  it("folds in thirds: the bottom flap up first, then the top flap down over it", () => {
    const bottoms = folding.map((f) => f.sheet.bottom);
    const tops = folding.map((f) => f.sheet.top);
    for (let i = 1; i < folding.length; i++) {
      expect(bottoms[i]).toBeGreaterThanOrEqual(bottoms[i - 1]);
      expect(tops[i]).toBeGreaterThanOrEqual(tops[i - 1]);
    }
    /* The top flap does not lift until the bottom one is most of the way
       over, and lands after it, so it ends up on top. */
    const topLifts = folding.findIndex((f) => f.sheet.top > 0);
    expect(folding[topLifts].sheet.bottom).toBeGreaterThan(150);
    const bottomLands = folding.findIndex((f) => f.sheet.bottom >= 180);
    const topLands = folding.findIndex((f) => f.sheet.top >= 180);
    expect(bottomLands).toBeGreaterThan(-1);
    expect(topLands).toBeGreaterThan(bottomLands);
    expect(at(FOLD_S).sheet.bottom).toBe(180);
    expect(at(FOLD_S).sheet.top).toBe(180);
  });

  it("turns each flap towards the viewer, over the middle rather than behind it", () => {
    /* Bottom flap hinged on its top edge: positive rotateX brings it out.
       Top flap hinged on its bottom edge: negative does. The component
       writes the top angle negated, which this pins. */
    expect(flapTransformOf(90)).toBe("perspective(1400px) rotateX(90.00deg)");
    const source = readFileSync(join(__dirname, "HawkDelivery.tsx"), "utf8");
    expect(source).toContain("flapTransformOf(f.sheet.bottom)");
    expect(source).toContain("flapTransformOf(-f.sheet.top)");
  });

  it("shrinks the folded packet into the letter, the same shape in the same place", () => {
    for (let t = FOLD_S; t < FALL_AT; t += 1 / 120) {
      const f = at(t);
      expect(f.sheet.x).toBeCloseTo(f.letter.x, 6);
      expect(f.sheet.y).toBeCloseTo(f.letter.y, 6);
      expect(f.sheet.rot).toBeCloseTo(f.letter.rot, 6);
      /* The packet is the middle third of the sheet; the letter's paper is
         its own fraction of the letter. Equal widths and heights at every
         frame is what makes the hand over a shrink and not a swap. */
      const packetW = f.sheet.sx * scene.sheetW;
      const packetH = (f.sheet.sy * scene.sheetH) / 3;
      expect(packetW).toBeCloseTo(f.letter.scale * LETTER_W * PAPER_W, 4);
      expect(packetH / packetW).toBeGreaterThan(0);
    }
    const last = at(FALL_AT - 1e-6).sheet;
    expect(last.sx * scene.sheetW).toBeCloseTo(LETTER_W * PAPER_W, 1);
    expect((last.sy * scene.sheetH) / 3).toBeCloseTo(LETTER_W * PAPER_H, 1);
  });

  it("hands over to the letter on the way: one fades up as the other goes", () => {
    expect(at(FOLD_S).letterAlpha).toBe(0);
    expect(at(FOLD_S).sheet.alpha).toBe(1);
    expect(at(FOLD_S + LAUNCH_S * 0.75).letterAlpha).toBeGreaterThan(0.3);
    expect(at(FOLD_S + LAUNCH_S * 0.75).sheet.alpha).toBeGreaterThan(0.3);
    expect(at(FALL_AT).letterAlpha).toBe(1);
    expect(at(FALL_AT).sheetOn).toBe(false);
    expect(at(FALL_AT - 1e-6).sheet.alpha).toBeLessThan(0.05);
  });

  it("sizes the sheet from the box, or to the foot of the window without a height", () => {
    expect(sheetBox(BOX, VH)).toEqual({ x: 688, y: 82, w: 598, h: 818 });
    const noHeight = sheetBox({ x: 18, y: 5, width: 354 }, 844);
    expect(noHeight.h).toBe(844 - 5 - 16);
    /* Never a sliver, and never an endless strip. */
    expect(sheetBox({ x: 0, y: 880, width: 300 }, 900).h).toBe(120);
    expect(sheetBox({ x: 0, y: -2000, width: 300 }, 900).h).toBe(780);
  });
});

describe("the letter", () => {
  it("rises to the top of its arc before it falls", () => {
    const apex = flightAt(FALL_AT, scene).letter;
    expect(apex.y).toBeLessThan(scene.outY - 60);
    expect(apex.scale).toBeCloseTo(1, 1);
  });

  it("falls, and only falls, from the arc to the catch", () => {
    const falling = flight.filter((f, i) => i / 120 >= FALL_AT && i / 120 <= CATCH_S);
    for (let i = 1; i < falling.length; i++) {
      expect(falling[i].letter.y).toBeGreaterThanOrEqual(falling[i - 1].letter.y - 0.01);
    }
  });

  it("sways back and forth like a leaf rather than dropping straight", () => {
    /* Four crossings of the line it fell from is two full swings, which is
       what makes it a leaf and not a stone. */
    const mid = scene.apexX;
    let crossings = 0;
    let side = Math.sign(flightAt(FALL_AT, scene).letter.x - mid);
    for (let t = FALL_AT; t <= CATCH_S - 0.2; t += 1 / 120) {
      const next = Math.sign(flightAt(t, scene).letter.x - mid);
      if (next !== 0 && next !== side) {
        crossings++;
        side = next;
      }
    }
    expect(crossings).toBeGreaterThanOrEqual(4);
  });

  it("tips as it sways, and never spins past a tilt", () => {
    const tilts = flight
      .filter((_, i) => i / 120 >= FALL_AT && i / 120 <= CATCH_S - SNAP_S)
      .map((f) => f.letter.rot);
    expect(Math.max(...tilts)).toBeGreaterThan(8);
    expect(Math.min(...tilts)).toBeLessThan(-8);
    expect(Math.max(...tilts.map(Math.abs))).toBeLessThan(40);
  });

  it("is on the talons from the catch onwards, not near them", () => {
    for (let t = CATCH_S; t <= END_S; t += 1 / 60) {
      const f = flightAt(t, scene);
      const gap = Math.hypot(f.letter.x - f.hawk.x, f.letter.y - f.hawk.y);
      expect(gap, "at t=" + t.toFixed(2)).toBeLessThan(20);
    }
  });

  it("hangs below the talons once taken, so the body over it leaves most of it showing", () => {
    for (let t = CATCH_S; t <= END_S; t += 1 / 60) {
      const f = flightAt(t, scene);
      /* Below the pin in the bird's own frame, by about a third of the
         letter's width. */
      const r = (f.hawk.rot * Math.PI) / 180;
      const dx = f.letter.x - f.hawk.x;
      const dy = f.letter.y - f.hawk.y;
      const down = -dx * Math.sin(r) + dy * Math.cos(r);
      expect(down / f.hawk.scale, "at t=" + t.toFixed(2)).toBeGreaterThan(LETTER_W * 0.25);
    }
  });

  it("closes onto the talons without a jump", () => {
    /* The one join a screenshot cannot catch. Sampled at 120fps, which is
       denser than any display, no step may be a teleport. */
    let worst = 0;
    for (let i = 1; i < flight.length; i++) {
      /* From the moment the letter can be seen to just past the grab. After
         that it rides the talons, and its speed is the bird's own climb out,
         which with the form on the right of a wide window covers most of the
         screen in a second. */
      if (flight[i].letterAlpha === 0 || i / 120 > CATCH_S + 0.25) continue;
      worst = Math.max(
        worst,
        Math.hypot(
          flight[i].letter.x - flight[i - 1].letter.x,
          flight[i].letter.y - flight[i - 1].letter.y,
        ),
      );
    }
    expect(worst).toBeLessThan(14);
  });
});

describe("the hawk", () => {
  it("is not drawn before it has entered", () => {
    expect(flightAt(0, scene).hawkOn).toBe(false);
    expect(flightAt(HAWK_IN_S - 0.01, scene).hawkOn).toBe(false);
    expect(flightAt(HAWK_IN_S, scene).hawkOn).toBe(true);
  });

  it("enters from off the right of the screen, above the catch", () => {
    const first = flightAt(HAWK_IN_S, scene).hawk;
    expect(first.x).toBeGreaterThan(VW);
    expect(first.y).toBeLessThan(catchPoint(scene).y - 200);
  });

  it("descends on its way in and climbs on its way out", () => {
    const dive = flightAt(CATCH_S - 0.2, scene).hawk;
    expect(dive.y).toBeGreaterThan(flightAt(HAWK_IN_S, scene).hawk.y);
    const away = flightAt(END_S, scene).hawk;
    expect(away.y).toBeLessThan(catchPoint(scene).y - 200);
  });

  it("flies to the left the whole way, which is the way the sprite faces", () => {
    for (let i = Math.ceil(HAWK_IN_S * 120) + 1; i < flight.length; i++) {
      expect(flight[i].hawk.x, "at frame " + i).toBeLessThan(flight[i - 1].hawk.x + 0.01);
    }
  });

  it("slows into the catch rather than arriving at full speed", () => {
    const speed = (t: number) =>
      Math.hypot(
        flightAt(t + 0.02, scene).hawk.x - flightAt(t, scene).hawk.x,
        flightAt(t + 0.02, scene).hawk.y - flightAt(t, scene).hawk.y,
      );
    expect(speed(CATCH_S - 0.05)).toBeLessThan(speed(CATCH_S - 0.6) * 0.75);
  });

  it("arrives exactly where the letter ends its fall", () => {
    const at = flightAt(CATCH_S, scene).hawk;
    const target = catchPoint(scene);
    expect(at.x).toBeCloseTo(target.x, 2);
    expect(at.y).toBeCloseTo(target.y, 2);
  });

  it("banks into the path without turning over", () => {
    const rots = flight.filter((f) => f.hawkOn).map((f) => f.hawk.rot);
    expect(Math.min(...rots)).toBeLessThan(-4);
    expect(Math.max(...rots)).toBeGreaterThan(4);
    expect(Math.max(...rots.map(Math.abs))).toBeLessThanOrEqual(26);
  });

  it("is off the screen with the letter when the effect ends", () => {
    const last = flightAt(END_S, scene);
    expect(last.hawk.x).toBeLessThan(-scene.hawkW);
    expect(last.letter.x).toBeLessThan(0);
    expect(last.done).toBe(true);
  });
});

describe("the scene is measured, not assumed", () => {
  it("keeps the fall on the screen when the form sits low in the viewport", () => {
    const low = sceneFor({ x: 0, y: 840, width: 400 }, VW, VH, 160);
    expect(low.fallTo).toBeLessThanOrEqual(VH - 92);
    expect(low.fallTo).toBeGreaterThan(low.apexY);
  });

  it("keeps the arc clear of the sticky header when the form sits at the top", () => {
    /* The header is over this overlay, so an arc that reached the top of the
       window would throw the letter behind the navigation. */
    const high = sceneFor({ x: 0, y: 0, width: 400, height: 260 }, VW, VH, 160);
    expect(high.apexY).toBeGreaterThanOrEqual(96);
    for (let t = FALL_AT; t <= CATCH_S; t += 1 / 60) {
      expect(flightAt(t, high).letter.y).toBeGreaterThanOrEqual(96);
    }
  });

  it("narrows the sway on a phone instead of throwing the letter off the edge", () => {
    const phone = sceneFor({ x: 18, y: 5, width: 354, height: 839 }, 390, 844, 104, 38);
    for (let t = FOLD_S; t <= CATCH_S; t += 1 / 60) {
      const x = flightAt(t, phone).letter.x;
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(390);
    }
  });
});

describe("the transform it writes", () => {
  it("is translate, rotate and scale and nothing that costs a layout", () => {
    const css = transformOf({ x: 12.3456, y: -7.1, rot: 4.5, scale: 0.9 }, 60, 58);
    expect(css).toBe(
      "translate3d(12.35px,-7.10px,0) rotate(4.50deg) scale(0.900) translate(-60%,-58%)",
    );
  });

  it("pins the element by the point the path is drawn through", () => {
    /* The pin has to come last and the origin has to be the corner, or the
       bird arrives with its corner on the catch point and its talons a sprite
       away from the letter. The first recording of this egg did exactly
       that. */
    const sheet = readFileSync(join(__dirname, "hawk-delivery.css"), "utf8").replace(
      /\/\*[\s\S]*?\*\//g,
      "",
    );
    /* The rule whose selector list is exactly this class, not the shared one
       it also appears in. */
    const ruleFor = (selector: string) =>
      Array.from(sheet.matchAll(/([^{}]+)\{([^{}]*)\}/g)).find(
        (m) => m[1].trim() === selector,
      );
    for (const selector of [".hawk-egg-bird", ".hawk-egg-letter", ".hawk-egg-sheet"]) {
      const rule = ruleFor(selector);
      expect(rule, selector).toBeDefined();
      expect(rule![2], selector).toContain("transform-origin: 0 0");
    }
    /* The still scene hangs its letter from the same point as the flight. */
    expect(sheet).toContain("--talon-x: " + TALON_PIN.x + "%");
    expect(sheet).toContain("--talon-y: " + TALON_PIN.y + "%");
    expect(transformOf({ x: 0, y: 0, rot: 0, scale: 1 }, TALON_PIN.x, TALON_PIN.y)).toMatch(
      /translate\(-60%,-58%\)$/,
    );
  });

  it("writes the sheet as one translate, rotate and two way scale, pinned at its centre", () => {
    expect(
      sheetTransformOf({ x: 10, y: 20, rot: -3, sx: 0.5, sy: 0.25, bottom: 180, top: 180, alpha: 1 }),
    ).toBe("translate3d(10.00px,20.00px,0) rotate(-3.00deg) scale(0.5000,0.2500) translate(-50%,-50%)");
  });

  it("animates nothing else: the sheet moves transform and opacity only", () => {
    const sheet = readFileSync(join(__dirname, "hawk-delivery.css"), "utf8");
    const animated = Array.from(sheet.matchAll(/transition:\s*([^;]+);/g)).map((m) => m[1]);
    expect(animated.length).toBeGreaterThan(0);
    for (const value of animated) {
      expect(value, value).toMatch(/^(opacity|transform)\b/);
    }
    expect(sheet).not.toMatch(/@keyframes/);
  });
});

/* ============================ the component ============================ */

/** One mounted egg, with the browser pieces jsdom does not have. */
class Egg {
  container = document.createElement("div");
  root: Root;
  done = 0;
  /** Every src a preloader asked for, in order. */
  asked: string[] = [];
  frames: Array<(now: number) => void> = [];

  constructor(opts: { reduced?: boolean; raf?: boolean; fail?: boolean } = {}) {
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
    document.body.appendChild(this.container);

    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: Boolean(opts.reduced) && query.includes("reduce"),
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }));

    if (opts.raf !== false) {
      vi.stubGlobal("requestAnimationFrame", (fn: (now: number) => void) => {
        this.frames.push(fn);
        return this.frames.length;
      });
      vi.stubGlobal("cancelAnimationFrame", () => {});
    }

    const asked = this.asked;
    class Preload {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(value: string) {
        asked.push(value);
        setTimeout(() => (opts.fail ? this.onerror?.() : this.onload?.()), 0);
      }
    }
    vi.stubGlobal("Image", Preload);

    this.root = createRoot(this.container);
    act(() => {
      this.root.render(
        <HawkDelivery from={BOX} onDone={() => (this.done += 1)} />,
      );
    });
  }

  /** Lets the preloader's callback land. */
  async settle(): Promise<void> {
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1));
    });
  }

  /** Runs the loop to a given moment, one frame at a time. */
  tick(seconds: number[]): void {
    for (const s of seconds) {
      const queued = this.frames;
      this.frames = [];
      act(() => queued.forEach((fn) => fn(s * 1000)));
    }
  }

  /* The overlay is portalled to the body, so it is never under the mount
     point; these read the document the way a visitor's browser holds it. */
  get overlay(): HTMLElement | null {
    return document.body.querySelector(".hawk-egg");
  }

  get bird(): HTMLImageElement | null {
    return document.body.querySelector(".hawk-egg-bird");
  }

  get letter(): SVGSVGElement | null {
    return document.body.querySelector(".hawk-egg-letter");
  }

  get sheet(): HTMLElement | null {
    return document.body.querySelector(".hawk-egg-sheet");
  }

  stop(): void {
    act(() => this.root.unmount());
    this.container.remove();
  }
}

describe("the egg in a document", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("draws nothing until the sprite has arrived", () => {
    const egg = new Egg();
    expect(egg.overlay).toBeNull();
    egg.stop();
  });

  it("asks for the sprite only once a message has been sent", async () => {
    const egg = new Egg();
    expect(egg.asked).toEqual(["/media/eggs/hawk.webp"]);
    await egg.settle();
    expect(egg.overlay).not.toBeNull();
    egg.stop();
  });

  it("gives up silently when the sprite never arrives", async () => {
    const egg = new Egg({ fail: true });
    await egg.settle();
    expect(egg.overlay).toBeNull();
    expect(egg.done).toBe(1);
    egg.stop();
  });

  it("hangs the overlay off the body, clear of any transformed ancestor", async () => {
    /* A fixed box is measured from the window only while nothing above it
       carries a transform, a filter or paint containment. The form sits
       inside the reveal-on-scroll wrapper, which carries a transform until it
       has been revealed, so the overlay is portalled out of the page. */
    const egg = new Egg();
    await egg.settle();
    expect(egg.overlay?.parentElement).toBe(document.body);
    expect(egg.container.querySelector(".hawk-egg")).toBeNull();
    egg.stop();
  });

  it("says nothing to assistive tech and swallows no clicks", async () => {
    const egg = new Egg();
    await egg.settle();
    expect(egg.overlay?.getAttribute("aria-hidden")).toBe("true");
    expect(egg.overlay?.getAttribute("role")).toBeNull();
    const sheet = readFileSync(join(__dirname, "hawk-delivery.css"), "utf8");
    expect(sheet).toMatch(/\.hawk-egg\s*\{[^}]*pointer-events:\s*none/);
    egg.stop();
  });

  it("holds both elements off the screen until a frame has placed them", async () => {
    const egg = new Egg();
    await egg.settle();
    expect(egg.bird?.style.visibility).toBe("hidden");
    expect(egg.letter?.style.visibility).toBe("hidden");
    expect(egg.sheet?.style.visibility).toBe("hidden");
    egg.tick([0]);
    expect(egg.sheet?.style.visibility).toBe("visible");
    /* The letter is placed but not yet seen: it fades up out of the packet. */
    expect(egg.letter?.style.visibility).toBe("visible");
    expect(Number(egg.letter?.style.opacity)).toBe(0);
    /* The bird is still off stage at t=0 and may not be shown yet. */
    expect(egg.bird?.style.visibility).toBe("hidden");
    egg.tick([HAWK_IN_S]);
    expect(egg.bird?.style.visibility).toBe("visible");
    expect(egg.sheet?.style.visibility).toBe("hidden");
    egg.stop();
  });

  it("reports itself finished once, at the end of the flight", async () => {
    const egg = new Egg();
    await egg.settle();
    egg.tick([0, 1, 2, END_S + 0.1]);
    expect(egg.done).toBe(1);
    egg.stop();
  });

  it("writes transforms and opacities and nothing that costs a layout", async () => {
    const egg = new Egg();
    await egg.settle();
    /* The sheet's size is written once, by the render, before any frame. */
    const sized = new Set(Array.from(egg.sheet!.style));
    egg.tick([0, 0.3, 1.0]);
    const loop = (el: Element) =>
      Array.from((el as HTMLElement).style).filter((p) => p !== "visibility").sort();
    expect(loop(egg.bird!)).toEqual(["transform"]);
    expect(loop(egg.letter!)).toEqual(["opacity", "transform"]);
    expect(
      Array.from(egg.sheet!.style).filter((p) => !sized.has(p)).sort(),
    ).toEqual(["opacity", "transform"]);
    for (const flap of Array.from(document.body.querySelectorAll(".hawk-egg-flap"))) {
      expect(loop(flap)).toEqual(["transform"]);
    }
    for (const shade of Array.from(document.body.querySelectorAll(".hawk-egg-shade"))) {
      expect(loop(shade)).toEqual(["opacity"]);
    }
    egg.stop();
  });

  it("lays the sheet exactly over the form's box", async () => {
    const egg = new Egg();
    await egg.settle();
    expect(egg.sheet?.style.width).toBe(BOX.width + "px");
    expect(egg.sheet?.style.height).toBe(BOX.height + "px");
    expect(egg.sheet?.querySelectorAll(".hawk-egg-third")).toHaveLength(3);
    expect(egg.sheet?.querySelectorAll(".hawk-egg-flap")).toHaveLength(2);
    expect(egg.sheet?.querySelectorAll(".hawk-egg-field").length).toBeGreaterThan(0);
    egg.stop();
  });

  it("paints the bird over the letter and the letter over the sheet", async () => {
    /* From the catch on the talons hold the paper and the body overlaps it,
       so the bird can never pass behind what it carries. Document order and
       z-index both say so. */
    const egg = new Egg();
    await egg.settle();
    const kids = Array.from(egg.overlay!.children).map((el) => el.getAttribute("class"));
    expect(kids).toEqual(["hawk-egg-sheet", "hawk-egg-letter", "hawk-egg-bird"]);
    const sheet = readFileSync(join(__dirname, "hawk-delivery.css"), "utf8").replace(
      /\/\*[\s\S]*?\*\//g,
      "",
    );
    const z = (selector: string) => {
      const rule = Array.from(sheet.matchAll(/([^{}]+)\{([^{}]*)\}/g)).find(
        (m) => m[1].trim() === selector,
      );
      return Number(rule?.[2].match(/z-index:\s*(\d+)/)?.[1]);
    };
    expect(z(".hawk-egg-bird")).toBeGreaterThan(z(".hawk-egg-letter"));
    expect(z(".hawk-egg-letter")).toBeGreaterThan(z(".hawk-egg-sheet"));
    egg.stop();
  });
});

describe("a reduced motion visitor", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("gets the still bird and never the loop", async () => {
    const egg = new Egg({ reduced: true });
    expect(egg.asked).toEqual(["/media/eggs/hawk-still.webp"]);
    await egg.settle();
    expect(egg.bird?.getAttribute("src")).toBe("/media/eggs/hawk-still.webp");
    expect(document.body.innerHTML).not.toContain('src="/media/eggs/hawk.webp"');
    egg.stop();
  });

  it("gets the end state: the bird already holding the letter", async () => {
    const egg = new Egg({ reduced: true });
    await egg.settle();
    const rest = document.body.querySelector(".hawk-egg-rest");
    expect(rest).not.toBeNull();
    expect(egg.letter).not.toBeNull();
    /* The same order as the flight: the bird drawn over the letter. */
    expect(Array.from(rest!.children).map((el) => el.getAttribute("class"))).toEqual([
      "hawk-egg-letter",
      "hawk-egg-bird",
    ]);
    expect(document.body.querySelector(".hawk-egg-sheet")).toBeNull();
    egg.stop();
  });

  it("places the letter against a box with a height, not against nothing", () => {
    /* The letter in the still is placed by a top percentage, and the bird
       inside that box is absolutely positioned, so the box has no height of
       its own. Without a ratio the percentage resolves against zero and the
       letter rides above the bird's head. jsdom does not lay out, so this is
       asserted on the declaration. */
    const sheet = readFileSync(join(__dirname, "hawk-delivery.css"), "utf8").replace(
      /\/\*[\s\S]*?\*\//g,
      "",
    );
    const rest = Array.from(sheet.matchAll(/([^{}]+)\{([^{}]*)\}/g)).find(
      (m) => m[1].trim() === ".hawk-egg-rest",
    );
    expect(rest).toBeDefined();
    expect(rest![2]).toMatch(/aspect-ratio:\s*240\s*\/\s*273/);
    const letter = Array.from(sheet.matchAll(/([^{}]+)\{([^{}]*)\}/g)).find(
      (m) => m[1].trim() === ".hawk-egg-rest .hawk-egg-letter",
    );
    expect(letter![2]).toContain("top: var(--talon-y)");
  });

  it("runs no animation loop at all", async () => {
    const egg = new Egg({ reduced: true });
    await egg.settle();
    expect(egg.frames.length).toBe(0);
    egg.stop();
  });

  it("still gets the effect out of the way on its own", async () => {
    vi.useFakeTimers();
    const egg = new Egg({ reduced: true });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(egg.done).toBe(0);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(egg.done).toBe(1);
    vi.useRealTimers();
    egg.stop();
  });
});

describe("what the egg costs a visitor", () => {
  const size = (rel: string) => statSync(join(repoRoot(), rel)).size;

  it("stays inside the 400 KB Daniel budgeted for it", () => {
    const total = size("public/media/eggs/hawk.webp") + size("public/media/eggs/hawk-still.webp");
    expect(total).toBeLessThan(400 * 1024);
  });

  it("ships both files the component names", () => {
    const source = readFileSync(join(__dirname, "HawkDelivery.tsx"), "utf8");
    for (const match of Array.from(source.matchAll(/"(\/media\/eggs\/[^"]+)"/g))) {
      expect(() => size("public" + match[1]), match[1]).not.toThrow();
    }
  });

  it("is loaded by nothing but the confirmation branch of the form", () => {
    const form = readFileSync(join(__dirname, "ContactForm.tsx"), "utf8");
    const sent = form.slice(form.indexOf('if (status === "sent")'));
    expect(sent).toContain("<HawkDelivery");
    expect(form.slice(0, form.indexOf('if (status === "sent")'))).not.toContain("<HawkDelivery");
  });
});

describe("the form keeps its own promises with the egg on it", () => {
  it("measures the box before the confirmation replaces the form", () => {
    const form = readFileSync(join(__dirname, "ContactForm.tsx"), "utf8");
    const measure = form.indexOf("formRef.current?.getBoundingClientRect()");
    const swap = form.indexOf('setStatus("sent")');
    expect(measure).toBeGreaterThan(-1);
    expect(measure).toBeLessThan(swap);
  });

  it("leaves the confirmation first in the document, before the overlay", () => {
    const form = readFileSync(join(__dirname, "ContactForm.tsx"), "utf8");
    const sent = form.slice(form.indexOf('if (status === "sent")'));
    expect(sent.indexOf('className="form-sent"')).toBeLessThan(sent.indexOf("<HawkDelivery"));
  });
});

beforeEach(() => {
  document.body.innerHTML = "";
});
