import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { showcaseEnabled } from "./flag";
import {
  ACID,
  ACID_RANGE,
  BRIX,
  BRIX_RANGE,
  DAYS,
  dayAt,
  fmtInt,
  fmtOne,
  HEAT_LINE,
  heatRuns,
  LAG,
  PHONE_MAX,
  plan,
  RESPONSE,
  TEMP_RANGE,
  TMAX,
  TMIN,
  xOf,
  xRange,
} from "./season";
import {
  allModules,
  demoHref,
  demoIsLive,
  DEMO_HOST,
} from "../../../lib/demo";
import {
  showcase,
  type ProblemItem,
  type ShowcaseModule,
} from "../../../lib/i18n/showcase";
import { modulos } from "../../../lib/i18n/modulos";
import { precios } from "../../../lib/i18n/precios";
import { site } from "../../../lib/i18n/site";
import { locales, type Locale } from "../../../lib/i18n/config";
import { moduleIds } from "../../../lib/pricing";

/**
 * The one feedback page (beads hq-wrig5.3 and hq-wrig5.15). What is worth a
 * test rather than a screenshot, because a screenshot only shows the branch
 * that was rendered:
 *
 *   1. the flag rule itself, so "unset renders the official home" is checked
 *      rather than asserted,
 *   2. the demo buttons: one per module plus all three, every one of them
 *      pointing at the live demo host with the right ?modulos= value,
 *   3. the showcase dictionary carrying no figure and no second copy of a
 *      module description, since the descriptions on the page are rendered
 *      from lib/i18n/modulos.ts and a price may not travel away from the build
 *      that produced it,
 *   4. the six problems being six, in both locales, and
 *   5. both locales staying in step, in shape and in accents, which is where
 *      an ES dictionary copied from the EN one has gone wrong on this rig
 *      before.
 */

/** Every display string in a dictionary, ignoring ids, which stay ASCII. */
function strings(value: unknown, key = ""): string[] {
  if (typeof value === "string") return key === "id" ? [] : [value];
  if (Array.isArray(value)) return value.flatMap((v) => strings(v, key));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) => strings(v, k));
  }
  return [];
}

/** The shape of a dictionary: every key path, sorted. */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => keyPaths(v, prefix + "[" + i + "]"));
  }
  if (value && typeof value === "object") {
    return Object.entries(value)
      .flatMap(([k, v]) => keyPaths(v, prefix ? prefix + "." + k : k))
      .sort();
  }
  return [prefix];
}

describe("the SHOWCASE flag", () => {
  it("renders the showcase only for the exact value 1", () => {
    expect(showcaseEnabled({ SHOWCASE: "1" })).toBe(true);
  });

  it("renders the official home when the variable is unset", () => {
    expect(showcaseEnabled({})).toBe(false);
    expect(showcaseEnabled({ SHOWCASE: undefined })).toBe(false);
  });

  it("does not treat a truthy-looking value as set", () => {
    for (const value of ["0", "", "true", "yes", "showcase", "01", " 1"]) {
      expect(showcaseEnabled({ SHOWCASE: value })).toBe(false);
    }
  });
});

describe("the demo buttons", () => {
  it("sends every button to the live demo host with its own module list", () => {
    // The host is up (bead hq-ko3a0.6), so every button carries the modules
    // it advertises in the query the host reads (?modulos=, comma separated,
    // enkanto-system js/demo/config.js MODULOS_IDS).
    expect(demoIsLive).toBe(true);
    for (const locale of locales as readonly Locale[]) {
      for (const id of moduleIds) {
        expect(demoHref(locale, [id])).toBe(`${DEMO_HOST}/?modulos=${id}`);
      }
      expect(demoHref(locale, allModules)).toBe(
        `${DEMO_HOST}/?modulos=${moduleIds.join(",")}`,
      );
    }
  });

  it("offers one button per module and one for all three", () => {
    expect([...allModules]).toEqual([...moduleIds]);
    for (const locale of locales as readonly Locale[]) {
      const mods = showcase[locale].demos.modules as ShowcaseModule[];
      expect(mods.map((m) => m.id)).toEqual([...moduleIds]);
      for (const m of mods) {
        // Each button names its own module, so four buttons on one page are
        // four distinct destinations to a screen reader.
        expect(m.demo).toContain(m.name);
      }
      expect(showcase[locale].demos.all.length).toBeGreaterThan(0);
      expect(showcase[locale].demos.allAria.length).toBeGreaterThan(0);
    }
  });

  it("labels each button with the name the pricing page uses", () => {
    for (const locale of locales as readonly Locale[]) {
      const names = precios[locale].floors.modules;
      for (const m of showcase[locale].demos.modules as ShowcaseModule[]) {
        expect(m.name).toBe(names[m.id as keyof typeof names].name);
      }
    }
  });
});

describe("the showcase dictionary", () => {
  it("keeps the two locales in the same shape", () => {
    expect(keyPaths(showcase.es)).toEqual(keyPaths(showcase.en));
  });

  it("states six problems, each with a heading and a body", () => {
    for (const locale of locales as readonly Locale[]) {
      const items = showcase[locale].problem.items as ProblemItem[];
      expect(items).toHaveLength(6);
      for (const item of items) {
        expect(item.h.length).toBeGreaterThan(0);
        expect(item.body.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps no second copy of a module description", () => {
    // The three descriptions and the seven combinations on this page are
    // rendered from lib/i18n/modulos.ts through the same components /modulos
    // renders. A sentence of that copy appearing here as well would be a
    // second thing to keep true (bead hq-wrig5.15). The diagnostic block is
    // out of this check on purpose: every page on the site carries its own
    // copy of those four lines already, which is the house idiom and not
    // something this bead introduced.
    for (const locale of locales as readonly Locale[]) {
      const mine = new Set(strings(showcase[locale]));
      const theirs = [
        ...strings(modulos[locale].modules),
        ...strings(modulos[locale].combina),
      ];
      for (const line of theirs) {
        if (line.length < 40) continue;
        expect(mine.has(line), line).toBe(false);
      }
    }
  });

  it("prints no figure and no currency", () => {
    // An entry price never travels away from the feature list that produced
    // it (pricing-features.md 3.7 rule 3), and that list is rendered by the
    // pricing components from lib/pricing.ts. The percentages of the
    // combination rule and the day numbers of the diagnostic are one and two
    // digits, so any longer run of digits, any grouped amount and any currency
    // mark is a figure that must not be here. A four-digit calendar year is
    // not a figure, so the one in the problem list is taken out first.
    const withoutYears = (s: string) => s.replace(/\b(?:19|20)\d{2}\b/g, "");
    for (const locale of locales) {
      for (const s of strings(showcase[locale])) {
        const bare = withoutYears(s);
        expect(bare, s).not.toMatch(/\d{3,}/);
        expect(bare, s).not.toMatch(/\d[.,]\d/);
        expect(bare, s).not.toMatch(/MXN|USD|\$/);
      }
    }
  });

  it("writes no em dash and no decoration glyph", () => {
    for (const locale of locales) {
      for (const s of strings(showcase[locale])) {
        // Escaped rather than literal so the rule can live in a file the
        // rule itself applies to: em dash, en dash, arrow, check, cross, bullet.
        expect(s, s).not.toMatch(/[\u2014\u2013\u2192\u2713\u2717\u2022]/);
      }
    }
  });

  it("accents the Spanish copy, including the metadata block", () => {
    // hq-wrig5.1 shipped an ES meta block copied from the EN dictionary and
    // left unaccented while its own body carried the accents, so the meta
    // block is checked first and then the whole dictionary.
    expect(showcase.es.meta.title).toContain("módulos");
    expect(showcase.es.meta.title).toContain("Producción");
    expect(showcase.es.meta.description).toContain("módulo");

    const unaccented =
      /\b(modulos|Modulos|Produccion|produccion|tamano|operacion|combinacion|anada|anadas|telefono|dias|Dia|informacion)\b/;
    for (const s of strings(showcase.es)) {
      expect(s, s).not.toMatch(unaccented);
    }
  });
});

describe("the nav", () => {
  it("carries a modules and a pricing label in both locales", () => {
    for (const locale of locales as readonly Locale[]) {
      const nav = site[locale].nav;
      expect(nav.modules.length).toBeGreaterThan(0);
      expect(nav.pricing.length).toBeGreaterThan(0);
      expect(nav.modules).not.toBe(nav.pricing);
    }
    expect(site.es.nav.modules).toBe("Módulos");
    expect(site.es.nav.pricing).toBe("Precios");
  });
});

/* ------------------------------------------------------------------------ */
/* The section season (bead hq-qd9jh): two synced panels, one section's       */
/* ripening over its own temperature. What is worth a test rather than a     */
/* screenshot is the DATA, because the data is the argument: the heat run    */
/* in the lower panel has to show up in the fruit a few days later in the    */
/* upper one without a caption, and that is a property of the numbers, not   */
/* of the drawing. The pointer-to-day mapping and the two layout plans are   */
/* pure and pinned here too, and the CSS is read back so the height the      */
/* stylesheet reserves before hydration is the height the component draws.  */
/* ------------------------------------------------------------------------ */

const here = new URL("./", import.meta.url);
const readRepo = (rel: string) =>
  readFileSync(new URL("../../../" + rel, here), "utf8");

/** Mean day-to-day change of a series over [from, to). */
function slope(series: readonly number[], from: number, to: number): number {
  const a = series[from];
  const b = series[to - 1];
  if (a === undefined || b === undefined) throw new Error("slope out of range");
  return (b - a) / (to - 1 - from);
}

describe("the section season data", () => {
  it("runs one section for the same days on every series", () => {
    expect(DAYS).toBeGreaterThanOrEqual(40);
    for (const s of [BRIX, ACID, TMAX, TMIN]) expect(s).toHaveLength(DAYS);
  });

  it("reads the way a season reads: sugar up, acid down, within a day's wobble", () => {
    for (let d = 1; d < DAYS; d++) {
      expect(BRIX[d]!, `brix day ${d}`).toBeGreaterThanOrEqual(BRIX[d - 1]! - 0.05);
      expect(ACID[d]!, `acid day ${d}`).toBeLessThanOrEqual(ACID[d - 1]! + 0.05);
    }
    expect(BRIX[DAYS - 1]! - BRIX[0]!).toBeGreaterThan(8);
    expect(ACID[0]! - ACID[DAYS - 1]!).toBeGreaterThan(4);
  });

  it("keeps every value inside the axis it is drawn on", () => {
    const inside = (s: readonly number[], [lo, hi]: readonly [number, number]) => {
      for (const v of s) {
        expect(v).toBeGreaterThan(lo);
        expect(v).toBeLessThan(hi);
      }
    };
    inside(BRIX, BRIX_RANGE);
    inside(ACID, ACID_RANGE);
    inside(TMAX, TEMP_RANGE);
    inside(TMIN, TEMP_RANGE);
    for (let d = 0; d < DAYS; d++) {
      expect(TMAX[d]! - TMIN[d]!, `range day ${d}`).toBeGreaterThanOrEqual(8);
    }
    // the heat line sits on the temperature axis, where it can be drawn
    expect(HEAT_LINE).toBeGreaterThan(TEMP_RANGE[0]);
    expect(HEAT_LINE).toBeLessThan(TEMP_RANGE[1]);
  });

  it("carries exactly one heat run, three to six days long, with room either side", () => {
    const runs = heatRuns(TMAX, HEAT_LINE);
    expect(runs).toHaveLength(1);
    const run = runs[0]!;
    const len = run.end - run.start + 1;
    expect(len).toBeGreaterThanOrEqual(3);
    expect(len).toBeLessThanOrEqual(6);
    // seven quiet days before it and the whole response window after it
    expect(run.start).toBeGreaterThanOrEqual(7);
    expect(run.start + LAG + RESPONSE + 7).toBeLessThanOrEqual(DAYS);
    for (let d = run.start; d <= run.end; d++) {
      expect(TMAX[d]!).toBeGreaterThanOrEqual(HEAT_LINE);
    }
  });

  it("finds runs by contiguity and never splits or merges them", () => {
    expect(heatRuns([30, 36, 37, 30, 36, 30], 35)).toEqual([
      { start: 1, end: 2 },
      { start: 4, end: 4 },
    ]);
    expect(heatRuns([30, 31], 35)).toEqual([]);
    expect(heatRuns([36, 36], 35)).toEqual([{ start: 0, end: 1 }]);
  });

  it("shows the heat in the fruit a few days later, without a caption", () => {
    // The whole argument of the visual, as a property of the numbers: from
    // LAG days after the run starts, and for RESPONSE days, sugar climbs and
    // acid falls at least twice as fast as in the seven days before the run,
    // and both settle again in the seven days after the window.
    const run = heatRuns(TMAX, HEAT_LINE)[0]!;
    const w0 = run.start + LAG;
    const w1 = w0 + RESPONSE;
    const before = { brix: slope(BRIX, run.start - 7, run.start), acid: slope(ACID, run.start - 7, run.start) };
    const during = { brix: slope(BRIX, w0, w1), acid: slope(ACID, w0, w1) };
    const after = { brix: slope(BRIX, w1, w1 + 7), acid: slope(ACID, w1, w1 + 7) };
    expect(during.brix).toBeGreaterThanOrEqual(before.brix * 2);
    expect(during.acid).toBeLessThanOrEqual(before.acid * 2);
    expect(after.brix).toBeLessThan(during.brix / 2);
    expect(after.acid).toBeGreaterThan(during.acid / 2);
    // and nothing in the quiet stretch before the run moves that fast
    for (let d = 1; d < run.start; d++) {
      expect(BRIX[d]! - BRIX[d - 1]!, `brix day ${d}`).toBeLessThan(during.brix);
    }
  });
});

describe("the shared scrub", () => {
  const x0 = 40;
  const x1 = 700;

  it("maps a pointer to the nearest day and back", () => {
    expect(dayAt(x0, x0, x1)).toBe(0);
    expect(dayAt(x1, x0, x1)).toBe(DAYS - 1);
    for (let d = 0; d < DAYS; d++) expect(dayAt(xOf(d, x0, x1), x0, x1)).toBe(d);
    // half a step either side of a day still lands on that day
    const step = (x1 - x0) / (DAYS - 1);
    expect(dayAt(xOf(10, x0, x1) + step * 0.49, x0, x1)).toBe(10);
    expect(dayAt(xOf(10, x0, x1) - step * 0.49, x0, x1)).toBe(10);
  });

  it("clamps a pointer outside the plot to the nearest end", () => {
    expect(dayAt(x0 - 500, x0, x1)).toBe(0);
    expect(dayAt(x1 + 500, x0, x1)).toBe(DAYS - 1);
    expect(dayAt(Number.NaN, x0, x1)).toBe(0);
  });
});

describe("the two layout plans", () => {
  it("is a phone plan under the breakpoint and a wide plan at it", () => {
    expect(plan(PHONE_MAX - 1).phone).toBe(true);
    expect(plan(PHONE_MAX).phone).toBe(false);
    expect(plan(342).phone).toBe(true);
    expect(plan(1132).phone).toBe(false);
  });

  it("keeps both panels drawable at the narrowest phone", () => {
    const p = plan(342);
    const [x0, x1] = xRange(p, 342);
    expect(x1 - x0).toBeGreaterThan(200);
    expect(p.fruit.y1).toBeGreaterThan(p.fruit.y0 + 120);
    expect(p.temp.y1).toBeGreaterThan(p.temp.y0 + 80);
    expect(p.temp.y0).toBeGreaterThan(p.fruit.y1);
    expect(p.height).toBeGreaterThan(p.temp.y1);
  });

  it("reserves in CSS, before hydration, the height each plan draws", () => {
    // demos.test.ts pins the same thing for the module demos: a canvas with
    // no reserved height is a 300px box that jumps when the effect runs.
    const css = readRepo("app/[locale]/home.css");
    expect(css).toContain(`--ss-h: ${plan(1132).height}px`);
    expect(css).toContain(`--ss-h: ${plan(342).height}px`);
    expect(css).toMatch(new RegExp(`@container \\(max-width: ${PHONE_MAX - 1}px\\)`));
  });

  it("lets the figure fill its band", () => {
    // The fault Daniel named: the old card was capped at 640px inside a
    // full-bleed section. The new figure declares no max-width and is its
    // own query container, so the phone plan is decided on the box it
    // actually has.
    const css = readRepo("app/[locale]/home.css");
    const block = css.match(/\.pg-showcase \.ss \{([^}]*)\}/)?.[1] ?? "";
    expect(block).not.toContain("max-width");
    expect(block).toContain("container-type: inline-size");
  });
});

describe("the readout formatting", () => {
  it("formats the way each locale's tag reads, which for es-MX is a point", () => {
    // Mexico writes 21.4, with the comma as the thousands mark, and that is
    // what CLDR gives es-MX; the comma decimal belongs to Spain. The tag the
    // site sends is es-MX (lib/i18n/config.ts htmlLang), so a Spanish reader
    // here sees a point beside the peso prices on the same page, and a test
    // expecting the Spain comma would be asserting the wrong country.
    expect(fmtOne("es", 21.4)).toBe("21.4");
    expect(fmtOne("en", 21.4)).toBe("21.4");
    expect(fmtOne("es", 9)).toBe("9.0");
    expect(fmtOne("en", 9)).toBe("9.0");
    expect(fmtInt("es", 40.1)).toBe("40");
    expect(fmtInt("en", 36.8)).toBe("37");
  });
});

describe("the season copy", () => {
  it("is present in both locales with the day template and no emphasis", () => {
    for (const locale of locales as readonly Locale[]) {
      const s = showcase[locale].season;
      expect(s.day).toContain("{n}");
      for (const str of strings(s)) {
        // the page is already over the doctrine's three spans; this visual
        // must add none
        expect(str, str).not.toMatch(/\*\*|__/);
        expect(str.length).toBeGreaterThan(0);
      }
    }
    expect(showcase.es.season.section).toContain("sección");
    for (const str of strings(showcase.es.season)) {
      expect(str, str).not.toMatch(/\b(seccion|grafica|graficas|maxima|minima|dia|dias)\b/i);
    }
  });
});

describe("the rewire", () => {
  it("renders the season in the problem section and keeps the old chart in the tree", () => {
    // Binding rule on this rig: a visual is rewired, never deleted. The
    // showcase mounts SectionSeason where VintageCompare stood, and
    // VintageCompare.tsx, its stylesheet block and its dictionary keys stay,
    // so restoring it is one import.
    const page = readRepo("components/pages/showcase/Showcase.tsx");
    expect(page).toContain("<SectionSeason ");
    expect(page).not.toContain("<VintageCompare ");
    expect(readRepo("components/pages/showcase/VintageCompare.tsx")).toContain(
      "export default function VintageCompare",
    );
    expect(readRepo("app/[locale]/home.css")).toContain(".pg-showcase .vc {");
    for (const locale of locales as readonly Locale[]) {
      expect(showcase[locale].chart.title.length).toBeGreaterThan(0);
    }
  });
});
