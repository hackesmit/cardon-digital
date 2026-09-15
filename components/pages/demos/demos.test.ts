import { readdirSync, readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  bands,
  captionKeyFor,
  clockLabel,
  COV,
  cycleFrame,
  FADE,
  HOLD,
  INTRO,
  PEAK_T,
  PEAK_V,
  PHONE_MAX,
  READOUTS,
  RUN,
  RUSH_T,
  SERVICE,
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
 * The non-blocking notes that were worth fixing are pinned here too: the
 * pre-hydration canvas height, the palette's claim about the theme tokens, the
 * six hex tokens copied into JS, and the placeholders in the copy.
 */

const here = new URL("./", import.meta.url);
const read = (rel: string, base: URL = here) => readFileSync(new URL(rel, base), "utf8");

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
    observer.instance().report(true);
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
    observer.instance().report(true);
    observer.instance().report(false);
    observer.instance().report(true);
    expect(seen).toEqual([true, false, true]);
    expect(observer.instance().options.threshold).toBe(ONSCREEN_THRESHOLD);
    expect(observer.instance().observed).toHaveLength(1);
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
  report: (isIntersecting: boolean) => void;
}

/** An IntersectionObserver that records what it was asked to watch and lets a
    test drive it, since vitest runs in node with no viewport. */
function stubObserver(): { instance: () => FakeObserver } {
  let made: FakeObserver | null = null;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(
        cb: (entries: { isIntersecting: boolean }[]) => void,
        options: { threshold: number },
      ) {
        made = {
          observed: [],
          options,
          disconnected: false,
          report: (isIntersecting: boolean) => cb([{ isIntersecting }]),
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

/* --------- 3. the frame travels with the component that draws in it ------- */

describe("every demo component", () => {
  const components = readdirSync(new URL(here)).filter(
    (f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"),
  );

  it("exists", () => expect(components.length).toBeGreaterThan(0));

  it.each(components)("%s imports demos.css, so a mount is styled", (file) => {
    /* Round one shipped demos.css with no importer anywhere in the tree: the
       canvas fell back to its 300px intrinsic width, .demo-stage was not
       positioned, and all twelve hotspots landed off the board. The repo's
       precedent is components/consent/ConsentBanner.tsx importing
       ./consent.css. */
    expect(read(file)).toContain('import "./demos.css";');
  });

  it.each(components)("%s takes its gates from ./motion", (file) => {
    const src = read(file);
    expect(src).toContain("observeOnscreen(");
    /* An observer built by hand can be built inside a reduced-motion branch,
       which is exactly the bug. observeOnscreen has no motion argument. */
    expect(src).not.toMatch(/new IntersectionObserver/);
  });
});

/* --------- the pre-hydration canvas height is the measured height -------- */

describe("the demos stylesheet", () => {
  const css = read("demos.css");
  const phoneBlock = /@container \(max-width: 639px\) \{([\s\S]*?)\n\}/.exec(css);

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

  it("picks the floor plan on the figure, at the component's breakpoint", () => {
    /* A viewport media query and a component that reflows on the board's own
       width disagree for any demo narrower than the page it sits on, which is
       a phone plan under a desktop stylesheet (lucy, round two). Both sides
       now ask about the figure's content box, so the two numbers here are the
       same number. */
    expect(/\.demo-figure\s*\{[^}]*container-type:\s*inline-size/.test(css)).toBe(true);
    const maxima = Array.from(css.matchAll(/@container \(max-width: (\d+)px\)/g)).map((m) => Number(m[1]));
    const minima = Array.from(css.matchAll(/@container \(min-width: (\d+)px\)/g)).map((m) => Number(m[1]));
    expect(maxima.length).toBeGreaterThan(0);
    expect(minima.length).toBeGreaterThan(0);
    maxima.forEach((n) => expect(n).toBe(PHONE_MAX - 1));
    minima.forEach((n) => expect(n).toBe(PHONE_MAX));
    /* and nothing left in here decides a layout on the viewport */
    const widthMedia = Array.from(css.matchAll(/@media[^{]*\((?:min|max)-width[^{]*\{/g));
    expect(widthMedia).toHaveLength(0);
  });

  it("hides the board and its hotspots when there is no JavaScript", () => {
    const component = read("RestauranteDemo.tsx");
    const noscript = /<noscript>([\s\S]*?)<\/noscript>/.exec(component);
    expect(noscript).not.toBeNull();
    expect(noscript![1]).toMatch(/<style>\{"[^"]*\.demo-canvas[^"]*\.rd-btn[^"]*display:\s*none[^"]*"\}<\/style>/);
    expect(noscript![1]).toContain("demo-fallback");
  });
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

    it.each(["primary", "secondary", "energy"] as const)(
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
    expect(Object.keys(captions).sort()).toEqual(["begins", "filling", "flagged", "peak"]);
    const reached = new Set(
      Array.from({ length: SERVICE + 1 }, (_, t) => captionKeyFor(t)),
    );
    expect(Array.from(reached).sort()).toEqual(["begins", "filling", "flagged", "peak"]);
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
