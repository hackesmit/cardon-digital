import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { withoutCssComments } from "./contract/ghosts";

import {
  bands,
  CAPTION_KEYS,
  captionKeyFor,
  clockLabel,
  COV,
  CYCLE,
  cycleFrame,
  FADE,
  HOLD,
  INTRO,
  isPhonePlan,
  PEAK_T,
  PEAK_V,
  PHONE_MAX,
  READOUTS,
  RUN,
  RUSH_T,
  SERVICE,
  STANDING_CYC,
  TABLES,
} from "./floor";
import { observeOnscreen, ONSCREEN_THRESHOLD, shouldAnimate } from "./motion";
import { hexToRgb, mix, readDemoPalette, rgba, type DemoHue } from "./palette";
import { demos, type DemosDict } from "../../../lib/i18n/demos";

/**
 * The module demos' regression tests (bead hq-3pfhe.1, round two).
 *
 * Restaurante is the reference the other two demos are built to, so the three
 * failures both reviews found here would have been copied twice. Each has a
 * test below that fails if it comes back:
 *
 *   1. the animation was frozen for good on a page loaded under
 *      prefers-reduced-motion, because the IntersectionObserver was built in
 *      the else branch of the reduced-motion check;
 *   2. demos.css had no importer anywhere in the tree, so a mounted demo drew
 *      a 300px canvas with all twelve hotspots off the board;
 *   3. the loop held for five and a half seconds on minute 360 of the service,
 *      which is an empty room: every booking has ended by 295.
 *
 * Round two's own survivors (bead hq-3pfhe.6) are pinned the same way, each
 * one closed before Produccion and Hospitalidad copy this frame:
 *
 *   4. the stylesheet and the component disagreed about the floor plan in the
 *      open interval (639, 640), a 214px first-layout shift;
 *   5. the palette derived its structural hairline from --primary whatever hue
 *      the demo wore;
 *   6. the observer declared a threshold and then read isIntersecting. Both
 *      reviews called it a sliver starting the loop; in Chromium that does not
 *      reproduce, and whether the other engines agree is open. The reading now
 *      lives in @/lib/onscreen, which is the same answer in every engine, and
 *      lib/onscreen.test.ts enforces it repo-wide including Media.tsx;
 *   7. the caption strip's height followed the caption's length, so the figure
 *      reflowed 31px twice per cycle.
 *
 * The non-blocking notes that were worth fixing are pinned here too: the
 * pre-hydration canvas height, the palette's claim about the theme tokens, the
 * six hex tokens copied into JS, the standing frame agreeing with the loop's
 * clock, the board adding no box of its own, and the placeholders in the copy.
 *
 * Round two of the s-4a6c review (bead hq-3pfhe.6, fix round two) added two
 * here: the live row inside a ghost box is not stretched to the tallest
 * ghost, and the first run starts the story from the top rather than from
 * the hold. The component-side rules it also added were lexical and are gone:
 * see section 3.
 */

const here = new URL("./", import.meta.url);
const read = (rel: string, base: URL = here) => readFileSync(new URL(rel, base), "utf8");

/** The three brand hues, one per demo: Produccion, Hospitalidad, Restaurante. */
const HUES = ["primary", "secondary", "energy"] as const satisfies readonly DemoHue[];

/* -------- 1. the loop's payoff frame is a full room, not an empty one ------ */

describe("the loop holds on the fullest minute of the evening", () => {
  const holdStart = INTRO + RUN;

  it("rests on the peak for the whole hold, with the room at its fullest", () => {
    for (let k = 0; k <= HOLD; k += 0.25) {
      const f = cycleFrame(holdStart + k);
      expect(f.t).toBe(PEAK_T);
      expect(f.showChips).toBe(false);
    }
    expect(COV[PEAK_T]).toBe(PEAK_V);
    expect(PEAK_V).toBeGreaterThan(0);
  });

  it("never holds minute 360, where round one held and nobody is left", () => {
    const lastBookingEnds = Math.max(
      ...TABLES.flatMap((T) => T.res.map((r) => r.s + r.d)),
    );
    expect(lastBookingEnds).toBeLessThan(SERVICE);
    expect(COV[SERVICE]).toBe(0);
    for (let cycT = 0; cycT < INTRO + RUN + HOLD + FADE; cycT += 0.1) {
      expect(cycleFrame(cycT).t).toBeLessThanOrEqual(PEAK_T);
    }
  });

  it("sweeps from the door to the peak without running past it", () => {
    expect(cycleFrame(0).t).toBe(0);
    expect(cycleFrame(INTRO - 0.01).showChips).toBe(false);
    expect(cycleFrame(INTRO).t).toBe(0);
    let previous = -1;
    for (let k = 0; k <= RUN; k += 0.25) {
      const t = cycleFrame(INTRO + k).t;
      expect(t).toBeGreaterThanOrEqual(previous);
      previous = t;
    }
    expect(cycleFrame(holdStart - 0.001).t).toBeCloseTo(PEAK_T, 1);
  });

  it("holds the same frame reduced motion resolves to, captions included", () => {
    expect(captionKeyFor(cycleFrame(holdStart + 1).t)).toBe("peak");
    expect(captionKeyFor(PEAK_T)).toBe("peak");
    expect(captionKeyFor(0)).toBe("begins");
    expect(captionKeyFor(RUSH_T - 1)).toBe("filling");
    expect(captionKeyFor(RUSH_T)).toBe("flagged");
    expect(clockLabel(PEAK_T)).toBe("19:55");
  });

  /** Reviewer s-3b55, note 4: the standing frame was drawn from PEAK_T while
      the loop's clock stayed wherever it had stopped, so scrolling away at
      18:10 snapped the board to 19:55 and scrolling back jumped it to 18:10.
      STANDING_CYC makes the standing frame a frame OF the loop, so parking and
      resuming are the same arithmetic. */
  it("stands on a frame of the loop, identical to the one the hold rests on", () => {
    expect(cycleFrame(STANDING_CYC)).toEqual({
      t: PEAK_T,
      showChips: false,
      fade: 1,
    });
    /* the FIRST frame of the hold: same pixels as the last one, but a resume
       holds the room the visitor arrived on instead of dipping straight into
       the seam, which would read as a flash */
    expect(STANDING_CYC).toBe(holdStart);
    expect(STANDING_CYC).toBeLessThan(CYCLE);
  });

  it("never runs backwards when it resumes from the standing frame", () => {
    let previous = cycleFrame(STANDING_CYC).t;
    /* the rest of the hold and the whole seam dip: the room the visitor
       arrived on stays put until the cycle restarts */
    for (let k = 0; k < HOLD + FADE; k += 0.02) {
      const t = cycleFrame(STANDING_CYC + k).t;
      expect(t, "at +" + k.toFixed(2) + "s").toBe(previous);
      previous = t;
    }
    /* and the frame after the seam is the top of the next cycle, not a jump
       back into the middle of the sweep */
    expect(cycleFrame(0).t).toBe(0);
  });

  /** Reviewer s-4a6c, BLOCKING 2: resolved() runs at mount and parks the
      clock on STANDING_CYC, and start() carried on from wherever the clock
      stood, so on an in-view load the first thing a visitor saw was the
      ending: the payoff frame frozen for the whole 5.5s hold, a fade to 15
      percent, and 17:00 beginning at about 7.2s with an empty room. The
      standing frame is where a RESUME starts. The story starts at the top,
      which is the door, and it has moved within three seconds. The other
      half, that the first start and only the first resets the clock, is
      ./stage/clock.ts, which no demo can reach into. */
  it("starts the story from the top on its first run, not from the hold", () => {
    const top = cycleFrame(0);
    expect(top.t).toBe(0);
    expect(top.showChips).toBe(false);
    expect(captionKeyFor(top.t)).toBe("begins");
    /* the top of the cycle and the standing frame are different captions,
       so a first view that reads the standing frame's caption is the hold */
    expect(captionKeyFor(top.t)).not.toBe(captionKeyFor(cycleFrame(STANDING_CYC).t));
    let movedAt = -1;
    for (let k = 0; k <= 3; k += 0.05) {
      if (captionKeyFor(cycleFrame(k).t) !== "begins") {
        movedAt = k;
        break;
      }
    }
    expect(movedAt, "the caption has to move within three seconds").toBeGreaterThan(0);
    expect(movedAt).toBeLessThanOrEqual(3);
    /* and nothing before the hold ever shows the hold's caption */
    for (let k = 0; k < STANDING_CYC; k += 0.1) {
      expect(captionKeyFor(cycleFrame(k).t), "at " + k.toFixed(1) + "s").not.toBe("peak");
    }
  });

  it("dips only at the loop seam", () => {
    expect(cycleFrame(INTRO + RUN / 2).fade).toBe(1);
    expect(cycleFrame(holdStart + HOLD / 2).fade).toBe(1);
    expect(cycleFrame(0).fade).toBeLessThan(1);
    expect(cycleFrame(INTRO + RUN + HOLD + FADE / 2).fade).toBeLessThan(1);
  });

  it("flags the rush an hour before the peak, while the room is filling", () => {
    expect(PEAK_T - RUSH_T).toBe(60);
    expect(COV[RUSH_T]).toBeGreaterThan(0);
    expect(COV[RUSH_T]).toBeLessThan(PEAK_V);
  });

  it("reads out each table's last booking, and only bookings it holds", () => {
    expect(READOUTS).toHaveLength(TABLES.length);
    READOUTS.forEach((r, i) => {
      const last = TABLES[i].res[TABLES[i].res.length - 1];
      expect(r).toEqual({ kind: TABLES[i].kind, n: last.p, time: clockLabel(last.s) });
      expect(last.p).toBeLessThanOrEqual(TABLES[i].seats);
    });
  });
});

/* ------ 2. the demo animates only behind all three gates, and resumes ----- */

describe("the motion gates", () => {
  afterEach(() => vi.unstubAllGlobals());

  const gates = [true, false];
  for (const reduced of gates) {
    for (const docVisible of gates) {
      for (const onscreen of gates) {
        it(`reduced=${reduced} visible=${docVisible} onscreen=${onscreen}`, () => {
          expect(shouldAnimate({ reduced, docVisible, onscreen })).toBe(
            !reduced && docVisible && onscreen,
          );
        });
      }
    }
  }

  /** The reviewers' CASE A: loaded under reduce, then the visitor turns it off.
      Round one never learned it was on screen, so the gate could not open
      again and the demo was frozen for the life of the page. */
  it("starts animating when reduce is turned off on a page loaded under it", () => {
    const observer = stubObserver();
    const state = { reduced: true, docVisible: true, onscreen: false };
    const stop = observeOnscreen({} as Element, (on) => {
      state.onscreen = on;
    });

    expect(shouldAnimate(state)).toBe(false);
    /* the observer is installed under reduce, which is the whole fix */
    observer.instance().report(1);
    expect(state.onscreen).toBe(true);
    expect(shouldAnimate(state)).toBe(false);

    state.reduced = false;
    expect(shouldAnimate(state)).toBe(true);

    stop();
    expect(observer.instance().disconnected).toBe(true);
  });

  it("tracks the figure leaving and re-entering the viewport", () => {
    const observer = stubObserver();
    const seen: boolean[] = [];
    observeOnscreen({} as Element, (on) => seen.push(on));
    observer.instance().report(1);
    observer.instance().report(0);
    observer.instance().report(1);
    expect(seen).toEqual([true, false, true]);
    expect(observer.instance().options.threshold).toBe(ONSCREEN_THRESHOLD);
    expect(observer.instance().observed).toHaveLength(1);
  });

  /** The gate keeps the number it declared whatever the entry looks like,
      which is what makes a threshold array safe here: see @/lib/onscreen for
      why the browser's own isIntersecting is not enough on its own. Just below
      the threshold and exactly at it are the two cases that tell them apart,
      so the stub reports ratios rather than a bare boolean. */
  it("waits for the threshold it declared, not for a sliver", () => {
    const observer = stubObserver();
    const seen: boolean[] = [];
    observeOnscreen({} as Element, (on) => seen.push(on));
    /* a sliver: intersecting, well under the threshold */
    observer.instance().report(0.001);
    observer.instance().report(ONSCREEN_THRESHOLD - 0.0001);
    expect(seen).toEqual([false, false]);
    /* exactly at it, and past it */
    observer.instance().report(ONSCREEN_THRESHOLD);
    observer.instance().report(0.9);
    expect(seen).toEqual([false, false, true, true]);
    /* gone: ratio 0 and not intersecting at all */
    observer.instance().report(0, false);
    expect(seen[4]).toBe(false);
  });

  it("assumes it is on screen where there is no IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const seen: boolean[] = [];
    const stop = observeOnscreen({} as Element, (on) => seen.push(on));
    expect(seen).toEqual([true]);
    expect(() => stop()).not.toThrow();
  });
});

interface FakeObserver {
  observed: Element[];
  options: { threshold: number };
  disconnected: boolean;
  /** Report a ratio, the way a real entry does. isIntersecting follows the
      spec rather than the threshold: it is true for any contact at all, which
      is exactly why a callback cannot read it and call it on screen. */
  report: (ratio: number, isIntersecting?: boolean) => void;
}

/** An IntersectionObserver that records what it was asked to watch and lets a
    test drive it, since vitest runs in node with no viewport. */
function stubObserver(): { instance: () => FakeObserver } {
  let made: FakeObserver | null = null;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(
        cb: (
          entries: { isIntersecting: boolean; intersectionRatio: number }[],
        ) => void,
        options: { threshold: number },
      ) {
        made = {
          observed: [],
          options,
          disconnected: false,
          report: (ratio: number, isIntersecting = ratio > 0) =>
            cb([{ isIntersecting, intersectionRatio: ratio }]),
        };
      }
      observe(el: Element) {
        made?.observed.push(el);
      }
      disconnect() {
        if (made) made.disconnected = true;
      }
    },
  );
  return {
    instance: () => {
      if (!made) throw new Error("no IntersectionObserver was constructed");
      return made;
    },
  };
}

/* ------ 3. the component side of the contract is not in this file ------- */

/* It was: seven functions of a component's comment-stripped source, each a
   list of spellings, run over every demo. The s-5836 review passed all of
   them with a demo that froze for life, ran its clock backwards and reflowed
   the page, satisfied the positive ones with a string constant, and erased
   the negative ones' input with two string literals holding the comment
   delimiters (bead hq-3pfhe.7). What replaced them:

     ./stage/           the clock, the measuring, the gates and the frame, which
                        the demos call instead of copying (clock.test.ts)
     contract.test.tsx  every demo mounted and driven, judged on what it does
     source.test.ts     four AST rules for what a mount cannot reach

   The reviewers' loophole components live in lib/testing/loopholes and both suites
   assert they fail. */

/* --------- the pre-hydration canvas height is the measured height -------- */

/** Declarations that animate or transition and carry !important. */
const outranksReduce = (sheet: string) =>
  sheet
    .split(/[;{}]/)
    .filter((d) => /^\s*(-\w+-)?(animation|transition)[\w-]*\s*:/i.test(d) && /!\s*important/i.test(d));

describe("the demos stylesheet", () => {
  /* The rules, without the prose. Every check below is lexical, and this file
     now explains in comments what its queries used to get wrong, naming the
     old (max-width: 639px) pair in the sentence that rejects it. Reading the
     raw stylesheet made the header comment itself a match. */
  const css = withoutCssComments(read("demos.css"));

  it("reads a comment delimiter inside a string as a string", () => {
    const hostile = 'a::before { content: "/*" }\n.kept > * { grid-area: 1 / 1 }\nb::after { content: "*/" } /* gone */';
    const read = withoutCssComments(hostile);
    expect(read).toContain(".kept > * { grid-area: 1 / 1 }");
    expect(read).not.toContain("gone");
  });
  const phoneBlock = new RegExp(
    "@container \\(width < " + PHONE_MAX + "px\\) \\{([\\s\\S]*?)\\n\\}",
  ).exec(css);

  /** Rebuild the stylesheet's pre-hydration height as a function of the
      container width, straight from its own numbers. 100cqw is the figure's
      content box, which is the canvas width the component measures. */
  const cssHeight = (block: string) => {
    const m = /\.demo-canvas\s*\{[^}]*height:\s*calc\((\d+)px \+ clamp\((\d+)px, (\d+)cqw, (\d+)px\) \+ (\d+)px \+ clamp\((\d+)px, (\d+)cqw, (\d+)px\) \+ (\d+)px\)/.exec(block);
    if (!m) throw new Error("no .demo-canvas calc height found");
    const n = m.slice(1).map(Number);
    const clamp = (lo: number, v: number, hi: number) => Math.min(Math.max(v, lo), hi);
    return (w: number) =>
      n[0] + clamp(n[1], (n[2] / 100) * w, n[3]) + n[4] + clamp(n[5], (n[6] / 100) * w, n[7]) + n[8];
  };

  it("holds exactly the height the component will measure, at every width", () => {
    /* Round one reserved one flat number per plan, so the first layout jumped
       38px on a desktop and 44px on a phone, and a demo in a narrow column
       jumped further still (reviewer note 4, then lucy). */
    expect(phoneBlock).not.toBeNull();
    const wide = cssHeight(css);
    const phone = cssHeight(phoneBlock![1]);
    for (let w = 240; w <= 1200; w += 7) {
      expect(Math.round(wide(w)), "wide at " + w).toBe(bands(w, false).height);
      expect(Math.round(phone(w)), "phone at " + w).toBe(bands(w, true).height);
    }
  });

  it("picks the floor plan on the figure, not on the viewport", () => {
    /* A viewport media query and a component that reflows on the board's own
       width disagree for any demo narrower than the page it sits on, which is
       a phone plan under a desktop stylesheet (lucy, round two). Both sides
       now ask about the figure's content box. */
    expect(/\.demo-figure\s*\{[^}]*container-type:\s*inline-size/.test(css)).toBe(true);
    /* and nothing left in here decides a layout on the viewport */
    const widthMedia = Array.from(css.matchAll(/@media[^{]*\((?:min|max)-width[^{]*\{/g));
    expect(widthMedia).toHaveLength(0);
  });

  /**
   * Every @container condition in the file, as a predicate over the container's
   * content width, plus which side of the breakpoint it claims.
   *
   * Round two's test asserted the two sides were one apart (maxima ===
   * PHONE_MAX - 1, minima === PHONE_MAX), which is the bug written down as a
   * requirement: (max-width: 639px) and (min-width: 640px) both reject every
   * width in the open interval (639, 640), and a container query reads the
   * fractional content box, so a figure at 639.25px got the phone board under
   * the desktop stylesheet and a 214px first-layout shift (reviewer s-3b55,
   * BLOCKING 2, reproduced by state/review/s-3b55/breakpoint.mjs). This asks
   * the only thing worth asking instead: at every width, does the stylesheet
   * agree with floor.ts?
   */
  const conditions = (() => {
    const found = Array.from(css.matchAll(/@container \(([^)]*)\)/g)).map((m) => m[1].trim());
    return found.map((text) => {
      const range = /^width\s*(<=|<|>=|>)\s*([\d.]+)px$/.exec(text);
      if (range) {
        const v = Number(range[2]);
        const ops: Record<string, (w: number) => boolean> = {
          "<": (w) => w < v,
          "<=": (w) => w <= v,
          ">": (w) => w > v,
          ">=": (w) => w >= v,
        };
        return { text, holds: ops[range[1]], claims: range[1][0] === "<" ? "phone" : "wide" };
      }
      const legacy = /^(max|min)-width:\s*([\d.]+)px$/.exec(text);
      if (legacy) {
        const v = Number(legacy[2]);
        return legacy[1] === "max"
          ? { text, holds: (w: number) => w <= v, claims: "phone" }
          : { text, holds: (w: number) => w >= v, claims: "wide" };
      }
      throw new Error("unrecognised @container condition: (" + text + ")");
    });
  })();

  it("has a query for each side of the breakpoint", () => {
    expect(conditions.filter((c) => c.claims === "phone").length).toBeGreaterThan(0);
    expect(conditions.filter((c) => c.claims === "wide").length).toBeGreaterThan(0);
  });

  it.each(conditions.map((c) => [c.text, c] as const))(
    "(%s) agrees with isPhonePlan() at every fractional width",
    (_text, c) => {
      /* quarter pixels across the boundary, because the half-pixel window is
         the whole defect and an integer sweep cannot see it */
      for (let w = PHONE_MAX - 4; w <= PHONE_MAX + 4; w += 0.25) {
        const phone = isPhonePlan(w);
        expect(c.holds(w), c.text + " at " + w).toBe(c.claims === "phone" ? phone : !phone);
      }
      /* and out in the ordinary widths a demo actually gets */
      for (let w = 240; w <= 1200; w += 0.5) {
        const phone = isPhonePlan(w);
        expect(c.holds(w), c.text + " at " + w).toBe(c.claims === "phone" ? phone : !phone);
      }
    },
  );

  it("gives the board no box of its own, so three measurements stay one number", () => {
    /* resize() takes the drawing width from canvas.clientWidth and the floor
       plan from the figure's content box, and demos.css writes the
       pre-hydration height in cqw of that same content box. All three are the
       same number only while .demo-stage adds nothing (reviewer s-3b55,
       note 3). */
    const stage = /\.demo-stage\s*\{([^}]*)\}/.exec(css);
    expect(stage).not.toBeNull();
    expect(stage![1]).not.toMatch(/padding|border|margin|width|box-sizing|transform|zoom/);
  });

  /* The component halves of the two ghost-box rules are ./stage/DemoFigure.tsx
     and the write census in contract.test.tsx. These are the stylesheet
     halves. */
  it("sizes the caption box for the longest caption, not the current one", () => {
    expect(css).toMatch(/\.demo-caption-box\s*\{[^}]*display:\s*grid/);
    expect(css).toMatch(/\.demo-caption-box\s*>\s*\*\s*\{[^}]*grid-area:\s*1\s*\/\s*1/);
    expect(css).toMatch(/\.demo-caption-ghost\s*\{[^}]*visibility:\s*hidden/);
    /* display:none would collapse the ghosts and reserve nothing */
    expect(/\.demo-caption-ghost\s*\{[^}]*display:\s*none/.test(css)).toBe(false);
  });

  it("sizes the selection box for every readout, not the selected one", () => {
    expect(css).toMatch(/\.demo-pick-box\s*\{[^}]*display:\s*grid/);
    expect(css).toMatch(/\.demo-pick-box\s*>\s*\*\s*\{[^}]*grid-area:\s*1\s*\/\s*1/);
    expect(css).toMatch(/\.demo-pick-ghost\s*\{[^}]*visibility:\s*hidden/);
    expect(/\.demo-pick-ghost\s*\{[^}]*display:\s*none/.test(css)).toBe(false);
  });

  it("leaves the site's reduced-motion rule in charge of everything the stylesheet animates", () => {
    /* CSS is the one declared motion open to a demo, and it is closed under
       reduce by construction: app/globals.css stops every animation and
       transition on the site, measured by reviewer s-1022 (margin-left 0px,
       then 0px). That holds while two things do. The rule is there, and
       nothing here outranks it, which only !important can. An image is the
       other way a stylesheet moves, and nothing can tell an animated one
       from a still, so this sheet loads none and imports no other sheet. */
    const globals = withoutCssComments(read("../../../app/globals.css"));
    const reduce = Array.from(
      globals.matchAll(/@media \(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/g),
      (m) => m[1],
    );
    for (const stopped of ["animation", "transition"]) {
      const everything = new RegExp("(?:^|[};])\\s*\\*\\s*\\{[^}]*" + stopped + ":\\s*none\\s*!important");
      expect(reduce.filter((block) => everything.test(block)), "a reduce block that stops every " + stopped).toHaveLength(1);
    }
    expect(outranksReduce(css)).toEqual([]);
    expect(css).not.toMatch(/url\(|@import|image-set\(/i);
    expect(outranksReduce(".x{ transition: width 1s !important }")).toHaveLength(1);
    expect(outranksReduce(".x{ -webkit-animation-name: spin ! IMPORTANT }")).toHaveLength(1);
    expect(outranksReduce(".x{ transition: width 1s; color: red !important }")).toEqual([]);
  });

  it.each(["demo-pick-box", "demo-caption-box"])(
    ".%s does not stretch its live child to the tallest ghost",
    (box) => {
      /* A grid item's default alignment is stretch, so the live row was drawn
         to the tallest ghost's height whichever table was selected, and a
         wrapping flex row spreads that spare height between its lines: the
         figure held at 840px while the gap between the table name and its
         detail jumped 13.5px on every tap, for 11 of 12 tables at 390px
         (reviewer s-4a6c, BLOCKING 1; state/review/s-4a6c/pickgap.mjs). The
         caption box's live child is one inline span today, so nothing shows
         there; the rule is the same and the next demo's caption may not be. */
      expect(css).toMatch(
        new RegExp("\\." + box + "\\s*>\\s*\\*\\s*\\{[^}]*align-self:\\s*start"),
      );
    },
  );
});

/* ------------- the palette is the theme's tokens, not a copy -------------- */

describe("the palette contract against app/globals.css", () => {
  const globals = read("../../../app/globals.css");
  afterEach(() => vi.unstubAllGlobals());

  /** The six raw hex tokens as globals.css declares them, per mode. */
  const tokens = (mode: "light" | "dark") => {
    const block = new RegExp(`:root\\[data-mode="${mode}"\\]\\{([^}]*)\\}`).exec(globals);
    if (!block) throw new Error("no " + mode + " token block");
    const out: Record<string, string> = {};
    const found = Array.from(block[1].matchAll(/--([a-z]+):\s*(#[0-9A-Fa-f]{6})/g));
    for (const m of found) out[m[1]] = m[2];
    return out;
  };

  /** The first percentage in a color-mix() token, as a 0..1 fraction. */
  const pct = (name: string) => {
    const m = new RegExp(`--${name}:\\s*color-mix\\(in srgb, var\\(--[a-z]+\\) (\\d+)%`).exec(globals);
    if (!m) throw new Error("no --" + name + " color-mix");
    return Number(m[1]) / 100;
  };

  /** readDemoPalette with no styled tree, which is the FALLBACK path: what it
      returns is the six hex tokens this file copied out of globals.css. */
  const palette = (mode: "light" | "dark", hue: DemoHue) => {
    vi.stubGlobal("getComputedStyle", () => ({ getPropertyValue: () => "" }));
    const el = {
      ownerDocument: { documentElement: { getAttribute: () => mode } },
    } as unknown as HTMLElement;
    return readDemoPalette(el, hue);
  };

  describe.each(["light", "dark"] as const)("%s mode", (mode) => {
    const css = tokens(mode);

    it("carries the same six hex tokens the stylesheet declares", () => {
      const pal = palette(mode, "energy");
      expect(pal.dark).toBe(mode === "dark");
      expect(pal.groundRgb).toEqual(hexToRgb(css.ground));
      expect(pal.panelRgb).toEqual(hexToRgb(css.panel));
      expect(pal.textRgb).toEqual(hexToRgb(css.text));
      /* primary and secondary reach the palette through their accents below */
      expect(Object.keys(css).sort()).toEqual(
        ["energy", "ground", "panel", "primary", "secondary", "text"],
      );
    });

    it.each(HUES)(
      "mixes %s exactly as --*-bright does",
      (hue) => {
        const pal = palette(mode, hue);
        const expected = mix(hexToRgb(css[hue]), hexToRgb(css.text), 1 - pct(hue + "-bright"));
        expect(pal.accentRgb).toEqual(expected);
        expect(pal.accent).toBe(rgba(expected, 1));
      },
    );

    it("mixes muted exactly as --muted does", () => {
      const pal = palette(mode, "energy");
      const expected = mix(hexToRgb(css.text), hexToRgb(css.panel), 1 - pct("muted"));
      expect(pal.muted).toBe(rgba(expected, 1));
    });

    it("treats a document with no data-mode as light", () => {
      /* The shell ships data-mode="light", but an isolated mount has no
         attribute at all, and the older visuals read that as dark (lucy,
         round two). Light is the design default here. */
      vi.stubGlobal("getComputedStyle", () => ({ getPropertyValue: () => "" }));
      const el = {
        ownerDocument: { documentElement: { getAttribute: () => null } },
      } as unknown as HTMLElement;
      const pal = readDemoPalette(el, "energy");
      expect(pal.dark).toBe(false);
      expect(pal.groundRgb).toEqual(hexToRgb(tokens("light").ground));
    });

    it("strokes hairlines at the alphas of --line and --line-soft", () => {
      /* Round one used 0.30 and 0.16 under a header that claimed every derived
         value matched its CSS twin (reviewer note 1). */
      const pal = palette(mode, "energy");
      expect(pal.line).toBe(rgba(pal.lineRgb, pct("line")));
      expect(pal.lineSoft).toBe(rgba(pal.lineRgb, pct("line-soft")));
    });

    it.each(HUES)("strokes the %s demo's hairline in its own hue", (hue) => {
      /* Round two mixed --primary here whatever hue was asked for, so
         Restaurante drew every structural line on its floor in Produccion's
         green while its accents were red, and Hospitalidad would have
         inherited it (lucy, round two). */
      const pal = palette(mode, hue);
      expect(pal.lineRgb).toEqual(mix(hexToRgb(css[hue]), hexToRgb(css.text), 0.35));
    });
  });
});

/* ------------- one hue means one hue, across all three demos -------------- */

describe("the single-hue contract", () => {
  afterEach(() => vi.unstubAllGlobals());

  /** Which fields carry the demo's hue and which are the neutral surface.
      Every field of DemoPalette has to be in exactly one list, so a field
      added for Produccion or Hospitalidad cannot be left unclassified. */
  const HUE_BEARING = [
    "accent",
    "accentFaint",
    "accentInk",
    "accentLine",
    "accentRgb",
    "accentSoft",
    "line",
    "lineRgb",
    "lineSoft",
  ];
  const NEUTRAL = [
    "axis",
    "dark",
    "floor",
    "floorRgb",
    "ground",
    "groundRgb",
    "ink",
    "muted",
    "panel",
    "panelRgb",
    "plate",
    "plateRgb",
    "textRgb",
  ];

  /** readDemoPalette against an unstyled tree, recording every custom
      property it asks for. The FALLBACK path returns the six hex tokens, and
      the log is the evidence about which ones were even consulted. */
  const readWithLog = (mode: "light" | "dark", hue: DemoHue) => {
    const asked: string[] = [];
    vi.stubGlobal("getComputedStyle", () => ({
      getPropertyValue: (name: string) => {
        asked.push(name);
        return "";
      },
    }));
    const el = {
      ownerDocument: { documentElement: { getAttribute: () => mode } },
    } as unknown as HTMLElement;
    return { pal: readDemoPalette(el, hue), asked };
  };

  it("classifies every field of the palette as hue-bearing or neutral", () => {
    const { pal } = readWithLog("light", "energy");
    expect(Object.keys(pal).sort()).toEqual([...HUE_BEARING, ...NEUTRAL].sort());
  });

  describe.each(["light", "dark"] as const)("%s mode", (mode) => {
    it.each(HUES)("reads no brand token but the one %s asked for", (hue) => {
      const { asked } = readWithLog(mode, hue);
      expect(asked).toContain("--" + hue);
      for (const other of HUES.filter((h) => h !== hue)) {
        expect(asked, "read --" + other + " while wearing " + hue).not.toContain("--" + other);
      }
    });

    it.each([
      ["primary", "secondary"],
      ["primary", "energy"],
      ["secondary", "energy"],
    ] as [DemoHue, DemoHue][])("changing the hue from %s to %s moves every hue-bearing field", (a, b) => {
      const left = readWithLog(mode, a).pal as unknown as Record<string, unknown>;
      const right = readWithLog(mode, b).pal as unknown as Record<string, unknown>;
      for (const field of HUE_BEARING) {
        expect(JSON.stringify(right[field]), field + " did not move").not.toBe(
          JSON.stringify(left[field]),
        );
      }
      for (const field of NEUTRAL) {
        expect(JSON.stringify(right[field]), field + " should not have moved").toBe(
          JSON.stringify(left[field]),
        );
      }
    });
  });
});

/* ------------------------- the copy, both locales ------------------------- */

describe("the demos dictionary", () => {
  const placeholders = (s: string) => (s.match(/\{[a-z]+\}/g) ?? []).sort();

  const walk = (a: unknown, b: unknown, path: string) => {
    if (typeof a === "string") {
      expect(typeof b, path).toBe("string");
      /* A dropped {n} or {time} would print a sentence with a hole in it, and
         only the keys are type-enforced (reviewer note 7). */
      expect(placeholders(b as string), path).toEqual(placeholders(a));
      expect((b as string).trim(), path).not.toBe("");
      return;
    }
    const left = a as Record<string, unknown>;
    const right = b as Record<string, unknown>;
    expect(Object.keys(right).sort(), path).toEqual(Object.keys(left).sort());
    for (const k of Object.keys(left)) walk(left[k], right[k], path + "." + k);
  };

  it("says the same things in es as in en, with the same placeholders", () => {
    walk(demos.en, demos.es, "demos");
  });

  it.each(["en", "es"] as const)("%s carries a caption for every phase", (locale) => {
    const captions = demos[locale].restaurante.captions as DemosDict["restaurante"]["captions"];
    /* Every key the timeline can resolve to, and nothing the board can never
       show: the hold used to carry a fifth caption of its own. */
    expect(Object.keys(captions).sort()).toEqual([...CAPTION_KEYS].sort());
    const reached = new Set(
      Array.from({ length: SERVICE + 1 }, (_, t) => captionKeyFor(t)),
    );
    expect(Array.from(reached).sort()).toEqual([...CAPTION_KEYS].sort());
    /* CAPTION_KEYS is also what the strip reserves room for, so a fifth phase
       added to the timeline without a ghost in the box would reflow the figure
       the moment it was reached */
    expect(CAPTION_KEYS).toHaveLength(4);
  });

  it.each(["en", "es"] as const)("%s names the booking the plate reads", (locale) => {
    const vis = demos[locale].restaurante;
    expect(placeholders(vis.party)).toEqual(["{n}", "{time}"]);
    for (const aria of Object.values(vis.tableAria)) {
      expect(placeholders(aria)).toEqual(["{n}", "{time}"]);
    }
    expect(Object.keys(vis.tables).sort()).toEqual(
      Array.from(new Set(TABLES.map((T) => T.kind))).sort(),
    );
    expect(Object.keys(vis.tableAria).sort()).toEqual(Object.keys(vis.tables).sort());
  });
});
