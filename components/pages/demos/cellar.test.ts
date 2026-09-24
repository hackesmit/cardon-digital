import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { withoutCssComments } from "./contract/ghosts";
import {
  bands,
  BRIX_HI,
  BRIX_LO,
  brixAt,
  CAPTION_KEYS,
  captionKeyFor,
  CENTRES,
  chart,
  climbing,
  CUT_LAG,
  cutDay,
  CYCLE,
  cycleFrame,
  END_D,
  FADE,
  FILL,
  fillAt,
  flagLabel,
  FLAG_D,
  HARVEST,
  HOLD,
  inCellar,
  INTRO,
  LAST,
  LAST_CROSS,
  LEAD,
  LOTS,
  OUTLINE,
  READOUTS,
  RUN,
  STANDING_CYC,
  TICK_EVERY,
  harvestDate,
  WINDOW_HI,
  WINDOW_LO,
  type Corner,
} from "./cellar";
import { demos } from "../../../lib/i18n/demos";

/**
 * The Produccion demo's data, checked without a browser (bead hq-3pfhe.2).
 *
 * ./cellar.ts holds everything the payoff frame depends on and touches no
 * canvas, so every one of these runs in milliseconds. What the COMPONENT does
 * is not here and cannot be: contract.test.tsx mounts it and drives it, and
 * source.test.ts parses it. This file is the third leg, the arithmetic, and it
 * is written against the three things a reader cannot check by eye: that the
 * block tiles with no gaps, that the loop holds on a frame worth holding, and
 * that the copy's numbers are the data's numbers.
 */

const here = new URL("./", import.meta.url);
const read = (rel: string) => readFileSync(new URL(rel, here), "utf8");

/* --------------- 1. the block is one piece of land, not six -------------- */

const area = (pts: readonly Corner[]) => {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    a += p[0] * q[1] - q[0] * p[1];
  }
  return Math.abs(a) / 2;
};

describe("the block is contiguous", () => {
  it("tiles its own outline exactly: no gaps, no overlaps", () => {
    /* Daniel, 2026-09-15: a vineyard drawn as independently placed shapes
       reads as nine stickers on paper. Six areas summing to the outline's is
       the whole of "contiguous" in one number: a gap makes the sum smaller and
       an overlap makes it bigger. */
    const sum = LOTS.reduce((t, L) => t + area(L.pts), 0);
    expect(sum).toBeCloseTo(area(OUTLINE), 10);
  });

  it("shares every interior edge between exactly two lots", () => {
    const edges = new Map<string, number>();
    for (const L of LOTS) {
      for (let i = 0; i < L.pts.length; i++) {
        const p = L.pts[i];
        const q = L.pts[(i + 1) % L.pts.length];
        /* undirected: the two lots that share an edge walk it opposite ways */
        const key = [p, q]
          .map((v) => v[0] + "," + v[1])
          .sort()
          .join("|");
        edges.set(key, (edges.get(key) ?? 0) + 1);
      }
    }
    const counts = Array.from(edges.values());
    expect(Math.max(...counts), "an edge used by three lots").toBe(2);
    expect(counts.filter((n) => n === 2).length, "interior edges").toBe(7);
    /* and the rest are the outline's own, one lot each */
    expect(counts.filter((n) => n === 1).length).toBe(OUTLINE.length);
  });

  it("builds every lot from the shared corners, by reference", () => {
    /* Two numbers that happen to agree drift on the next edit; the same object
       cannot. Every vertex of every lot is one of the block's corners. */
    const corners = new Set<Corner>(OUTLINE);
    for (const L of LOTS) for (const p of L.pts) corners.add(p);
    for (const L of LOTS) {
      for (const p of L.pts) expect(corners.has(p), L.k + " has a corner of its own").toBe(true);
    }
    expect(corners.size, "corners in the block").toBe(12);
  });

  it("puts every lot's centre inside the block", () => {
    expect(CENTRES).toHaveLength(LOTS.length);
    for (const c of CENTRES) {
      expect(c.x).toBeGreaterThan(0.02);
      expect(c.x).toBeLessThan(0.98);
      expect(c.y).toBeGreaterThan(0.02);
      expect(c.y).toBeLessThan(0.98);
    }
  });
});

/* ------------- 2. the readings climb, and they end at the cut ------------ */

describe("the readings", () => {
  it("starts every lot under the window and cuts it inside", () => {
    for (const L of LOTS) {
      expect(L.brix0, L.k + " starts ripe").toBeLessThan(WINDOW_LO);
      expect(L.brix0, L.k + " starts off the chart").toBeGreaterThan(BRIX_LO);
      expect(L.brixCut, L.k + " is cut below its window").toBeGreaterThanOrEqual(WINDOW_LO);
      expect(L.brixCut, L.k + " is cut above its window").toBeLessThanOrEqual(WINDOW_HI);
      expect(L.brixCut, L.k + " is cut off the chart").toBeLessThan(BRIX_HI);
    }
  });

  it("never reads backwards, on any lot, on any day", () => {
    /* A sugar reading that fell would say the lot was going backwards, and the
       chart would draw it. */
    for (const L of LOTS) {
      let last = -Infinity;
      for (let d = 0; d <= HARVEST; d += 0.1) {
        const v = brixAt(L, d);
        expect(v, L.k + " at day " + d.toFixed(1)).toBeGreaterThanOrEqual(last - 1e-9);
        last = v;
      }
    }
  });

  it("enters the window on the day the lot crosses, and stops at the cut", () => {
    for (const L of LOTS) {
      expect(brixAt(L, L.cross), L.k + " at its crossing").toBeCloseTo(WINDOW_LO, 9);
      expect(brixAt(L, L.cross - 0.1), L.k + " the day before").toBeLessThan(WINDOW_LO);
      expect(brixAt(L, cutDay(L)), L.k + " at its cut").toBeCloseTo(L.brixCut, 9);
      /* the fruit is off the vine: there is nothing left to sample */
      expect(brixAt(L, cutDay(L) + 6), L.k + " after its cut").toBe(L.brixCut);
    }
  });

  it("brings the lots off one at a time, whites first", () => {
    const crossings = LOTS.map((L) => L.cross);
    expect(crossings, "the crossings in order").toEqual([...crossings].sort((a, b) => a - b));
    for (let i = 1; i < LOTS.length; i++) {
      expect(
        LOTS[i].cross - cutDay(LOTS[i - 1]),
        LOTS[i].k + " crowds " + LOTS[i - 1].k,
      ).toBeGreaterThan(1);
    }
    expect(LOTS[0].variety).toBe("sauvignonBlanc");
    expect(LOTS[LOTS.length - 1].variety).toBe("cabernet");
  });

  it("fills a tank only once its fruit is in, and fills it whole", () => {
    for (const L of LOTS) {
      expect(fillAt(L, cutDay(L) - 0.01), L.k + " before its cut").toBe(0);
      expect(fillAt(L, cutDay(L) + FILL), L.k + " when it is in").toBeCloseTo(L.fill, 9);
      expect(fillAt(L, HARVEST), L.k + " at the end").toBeCloseTo(L.fill, 9);
      let last = -1;
      for (let d = 0; d <= HARVEST; d += 0.1) {
        const v = fillAt(L, d);
        expect(v, L.k + " emptying at day " + d.toFixed(1)).toBeGreaterThanOrEqual(last - 1e-9);
        last = v;
      }
    }
  });

  it("follows the next lot to come off, and nothing once they are all in", () => {
    expect(climbing(0)?.k).toBe(LOTS[0].k);
    for (const L of LOTS) expect(climbing(L.cross)?.k, "on " + L.k + "'s crossing").toBe(L.k);
    expect(climbing(END_D), "at the hold").toBeNull();
    expect(inCellar(0)).toBe(0);
    expect(inCellar(END_D), "lots in the cellar on the payoff frame").toBe(LOTS.length);
  });
});

/* ------------- 3. the loop holds on a full cellar, not an empty one ------ */

describe("the loop", () => {
  it("rests on the day every lot is in and every tank is full", () => {
    /* Round one of the reference held on minute 360 of 360, an empty cold
       room. The equivalent here is holding on day 0 or on an empty cellar. */
    const f = cycleFrame(STANDING_CYC);
    expect(f.d).toBe(END_D);
    expect(f.fade).toBe(1);
    for (const L of LOTS) {
      expect(f.d, L.k + " is still on the vine on the payoff frame").toBeGreaterThanOrEqual(cutDay(L) + FILL);
      expect(fillAt(L, f.d)).toBeCloseTo(L.fill, 9);
    }
    expect(captionKeyFor(f.d)).toBe("picked");
  });

  it("holds that frame unchanged for the whole hold", () => {
    const first = cycleFrame(STANDING_CYC);
    for (let t = STANDING_CYC; t < INTRO + RUN + HOLD; t += 0.05) {
      expect(cycleFrame(t), "the hold at " + t.toFixed(2)).toEqual(first);
    }
  });

  it("stands on a frame of the loop, so a resume carries straight on", () => {
    /* The standing frame is what reduced motion resolves to, what a paused
       board shows and what the running loop holds on: one number, not two
       ideas (reviewer s-3b55 on the reference). */
    expect(STANDING_CYC).toBeGreaterThanOrEqual(0);
    expect(STANDING_CYC).toBeLessThan(CYCLE);
    expect(cycleFrame(STANDING_CYC).d).toBe(cycleFrame(INTRO + RUN + 0.5).d);
  });

  it("does not open on its ending", () => {
    /* The harness fails a demo whose standing frame is among the frames of the
       first three seconds in view. */
    for (let t = 0; t <= 3; t += 0.02) {
      expect(cycleFrame(t).d, "the story at " + t.toFixed(2) + "s").toBeLessThan(END_D);
    }
  });

  it("sweeps forward only, and never past the day it stops on", () => {
    let last = -1;
    for (let t = 0; t < INTRO + RUN; t += 0.02) {
      const d = cycleFrame(t).d;
      expect(d).toBeGreaterThanOrEqual(last);
      expect(d).toBeLessThanOrEqual(END_D);
      last = d;
    }
  });

  it("dips only at the loop seam", () => {
    for (let t = 0.5; t < INTRO + RUN + HOLD; t += 0.05) {
      expect(cycleFrame(t).fade, "opacity at " + t.toFixed(2)).toBe(1);
    }
    expect(cycleFrame(CYCLE - 0.01).fade).toBeLessThan(1);
    expect(cycleFrame(0).fade).toBeLessThan(1);
  });

  it("fits the shape the mounted harness insists on", () => {
    /* docs/demos.md, section 3: one cycle inside sixty seconds, the hold at
       least a second long and over within twenty, and the standing frame not
       in the first three seconds (checked above). */
    expect(CYCLE).toBeLessThanOrEqual(60);
    expect(HOLD).toBeGreaterThanOrEqual(1);
    expect(HOLD + FADE).toBeLessThan(20);
    expect(CYCLE).toBeCloseTo(INTRO + RUN + HOLD + FADE, 9);
  });

  it("shows the fruit moving only while the harvest is running", () => {
    expect(cycleFrame(0).showFruit, "before the story starts").toBe(false);
    expect(cycleFrame(STANDING_CYC).showFruit, "on the payoff frame").toBe(false);
    expect(cycleFrame(INTRO + RUN * 0.5).showFruit, "mid harvest").toBe(true);
  });

  it("stops the playhead short of the planned window, with the cellar full", () => {
    expect(END_D).toBeLessThan(HARVEST);
    expect(END_D).toBeGreaterThan(cutDay(LOTS[LOTS.length - 1]) + FILL);
  });
});

/* ------------------- 4. the marker calls it days ahead ------------------- */

describe("the marker", () => {
  it("appears before the last crossing, by the number the copy says", () => {
    expect(LEAD).toBe(5);
    expect(FLAG_D).toBe(LAST_CROSS - LEAD);
    expect(FLAG_D).toBeGreaterThan(0);
    /* the copy names the lead in words, in both locales; if LEAD moves, one of
       these two sentences is a lie and this test is where that is found */
    expect(demos.es.produccion.flag).toContain("cinco");
    expect(demos.en.produccion.flag).toContain("five");
    expect(demos.es.produccion.flagCompact).toContain("cinco");
    expect(demos.en.produccion.flagCompact).toContain("five");
    expect(demos.es.produccion.captions.flagged).toContain("cinco");
    expect(demos.en.produccion.captions.flagged).toContain("five");
  });

  it("is on screen while the last lot is still climbing", () => {
    expect(captionKeyFor(FLAG_D)).toBe("flagged");
    expect(captionKeyFor(LAST_CROSS - 0.1)).toBe("flagged");
    expect(brixAt(LOTS[LOTS.length - 1], FLAG_D)).toBeLessThan(WINDOW_LO);
  });
});

/* ------------------------- 5. the captions and copy ---------------------- */

describe("the captions", () => {
  it("has a caption for every phase the loop reaches and none it cannot", () => {
    const reached = new Set<string>();
    for (let t = 0; t <= CYCLE; t += 0.02) reached.add(captionKeyFor(cycleFrame(t).d));
    expect(Array.from(reached).sort()).toEqual([...CAPTION_KEYS].sort());
    expect(CAPTION_KEYS).toHaveLength(4);
  });

  it("never says every lot is cut while one is still on the vine", () => {
    /* Round one returned "picked" from the last CROSSING, but a crossing is
       the day a reading enters the window and the fruit comes off CUT_LAG days
       later. So for 1.5 story days a loop the strip read "every lot cut inside
       its window" over a board with B3 still ringed on the vine, its tank
       empty and the cellar counting 5/6 (reviewer, 2026-09-24). The words and
       the picture are one claim: the caption may only say it once the cellar
       holds every lot. */
    const lying: string[] = [];
    for (let d = 0; d <= END_D; d += 0.05) {
      if (captionKeyFor(d) === "picked" && inCellar(d) < LOTS.length) {
        lying.push("day " + d.toFixed(2) + ", " + inCellar(d) + " of " + LOTS.length + " in");
      }
    }
    expect(lying.slice(0, 4)).toEqual([]);
    /* and it does say it, on the day the last lot comes off */
    expect(captionKeyFor(cutDay(LAST) - 0.01)).not.toBe("picked");
    expect(captionKeyFor(cutDay(LAST))).toBe("picked");
  });

  it.each(["en", "es"] as const)("%s carries exactly those captions", (locale) => {
    expect(Object.keys(demos[locale].produccion.captions).sort()).toEqual([...CAPTION_KEYS].sort());
  });

  it.each(["en", "es"] as const)("%s names every variety the block grows", (locale) => {
    const vis = demos[locale].produccion;
    expect(Object.keys(vis.varieties).sort()).toEqual(
      Array.from(new Set(LOTS.map((L) => L.variety))).sort(),
    );
    const ph = (s: string) => (s.match(/\{[a-z]+\}/g) ?? []).sort();
    expect(ph(vis.lotName)).toEqual(["{k}", "{variety}"]);
    expect(ph(vis.cut)).toEqual(["{brix}", "{date}", "{tons}"]);
    expect(ph(vis.lotAria)).toEqual(["{brix}", "{date}", "{k}", "{tons}", "{variety}"]);
    expect(Object.keys(vis.months)).toEqual(["aug", "sep", "oct"]);
  });

  it("reads out each lot's own cut, and only what LOTS holds", () => {
    expect(READOUTS).toHaveLength(LOTS.length);
    READOUTS.forEach((r, i) => {
      const L = LOTS[i];
      expect(r.k).toBe(L.k);
      expect(r.variety).toBe(L.variety);
      expect(r.tons).toBe(L.tons);
      expect(r.brix).toBe(L.brixCut);
      expect(r.day).toBe(cutDay(L));
    });
  });
});

/* ------------------------------ 6. the dates ----------------------------- */

describe("the calendar", () => {
  it("opens on 20 August and closes on 1 October", () => {
    expect(harvestDate(0)).toEqual({ d: 20, m: 0 });
    expect(harvestDate(11)).toEqual({ d: 31, m: 0 });
    expect(harvestDate(12)).toEqual({ d: 1, m: 1 });
    expect(harvestDate(41)).toEqual({ d: 30, m: 1 });
    expect(harvestDate(HARVEST)).toEqual({ d: 1, m: 2 });
  });

  it("never names a day its month does not have", () => {
    for (let d = 0; d <= HARVEST; d += 0.25) {
      const { d: day, m } = harvestDate(d);
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual([31, 30, 31][m]);
      expect(m).toBeGreaterThanOrEqual(0);
      expect(m).toBeLessThanOrEqual(2);
    }
  });

  it("puts a tick on the last day of the span", () => {
    /* the strip draws HARVEST / TICK_EVERY ticks and one more for day 0 */
    expect(HARVEST % TICK_EVERY).toBe(0);
    expect(HARVEST / TICK_EVERY).toBe(6);
  });
});

/* ----------- 7. the bands are the stylesheet's placeholder height --------- */

describe("the stage's bands", () => {
  const css = withoutCssComments(read("demos.css"));

  /** The stylesheet's pre-hydration height as a function of the container
      width, straight from its own numbers, the way demos.test.ts rebuilds it
      for the reference. 100cqw is the figure's content box, which is the
      canvas width the component measures. */
  const cssHeight = (block: string) => {
    const m =
      /\.demo-canvas\s*\{[^}]*height:\s*calc\((\d+)px \+ clamp\((\d+)px, (\d+)cqw, (\d+)px\) \+ (\d+)px \+ clamp\((\d+)px, (\d+)cqw, (\d+)px\) \+ (\d+)px\)/.exec(
        block,
      );
    if (!m) throw new Error("no .demo-canvas calc height found");
    const n = m.slice(1).map(Number);
    const clamp = (lo: number, v: number, hi: number) => Math.min(Math.max(v, lo), hi);
    return (w: number) =>
      n[0] + clamp(n[1], (n[2] / 100) * w, n[3]) + n[4] + clamp(n[5], (n[6] / 100) * w, n[7]) + n[8];
  };

  it("holds exactly the height this demo will measure, at every width", () => {
    /* demos.css carries one placeholder for all three figures. A demo whose
       height() disagreed with it would jolt the page on first layout, which is
       the defect the reference's own formula was written to close. */
    const phoneBlock = /@container \(width < 640px\) \{([\s\S]*?)\n\}/.exec(css);
    expect(phoneBlock).not.toBeNull();
    const wide = cssHeight(css);
    const phone = cssHeight(phoneBlock![1]);
    for (let w = 240; w <= 1200; w += 7) {
      expect(Math.round(wide(w)), "wide at " + w).toBe(bands(w, false).height);
      expect(Math.round(phone(w)), "phone at " + w).toBe(bands(w, true).height);
    }
  });

  it("leaves every band room to draw in, at both ends of every width", () => {
    for (const phone of [false, true]) {
      for (let w = 240; w <= 1200; w += 13) {
        const b = bands(w, phone);
        expect(b.ry0, "the calendar strip at " + w).toBeGreaterThan(b.cy + 20);
        expect(b.ry1 - b.ry0, "the block and cellar band at " + w).toBeGreaterThanOrEqual(188);
        expect(b.lt - b.ry1, "the gap above the chart at " + w).toBeGreaterThanOrEqual(30);
        expect(b.lb - b.lt, "the chart at " + w).toBeGreaterThanOrEqual(110);
        expect(b.height).toBeGreaterThan(b.lb);
      }
    }
  });
});

/* -------------------- 8. the chart's own arithmetic ---------------------- */

describe("the chart's range", () => {
  it("keeps the window band inside the chart, with headroom for its label", () => {
    expect(BRIX_LO).toBeLessThan(WINDOW_LO);
    expect(WINDOW_LO).toBeLessThan(WINDOW_HI);
    expect(WINDOW_HI).toBeLessThan(BRIX_HI);
    /* the band's label sits above it: a reading of the headroom as a fraction
       of the chart, which is what stops the label landing on the band */
    expect((BRIX_HI - WINDOW_HI) / (BRIX_HI - BRIX_LO)).toBeGreaterThan(0.1);
  });

  it("holds every reading the loop can draw inside the chart", () => {
    for (const L of LOTS) {
      for (let d = 0; d <= END_D; d += 0.25) {
        const v = brixAt(L, d);
        expect(v, L.k + " at day " + d).toBeGreaterThanOrEqual(BRIX_LO);
        expect(v, L.k + " at day " + d).toBeLessThanOrEqual(BRIX_HI);
      }
    }
  });

  it("keeps the cut a day and a half after the crossing", () => {
    expect(CUT_LAG).toBeGreaterThan(0);
    for (const L of LOTS) expect(cutDay(L) - L.cross).toBeCloseTo(CUT_LAG, 9);
  });
});

/* ---------- 9. the marker's label sits on nothing the chart draws -------- */

describe("the marker's label", () => {
  /** Every point the chart's polylines actually put on the canvas: the same
      half-day walk drawChart's lotLine makes, up to each lot's own cut, on the
      payoff frame where every line is complete and the label is showing. */
  const readings = (w: number, isPhone: boolean) => {
    const g = chart(w, isPhone);
    const pts: { x: number; y: number }[] = [];
    for (const L of LOTS) {
      const end = cutDay(L);
      pts.push({ x: g.timeX(0), y: g.brixY(L.brix0) });
      for (let s = 0.5; s < end; s += 0.5) pts.push({ x: g.timeX(s), y: g.brixY(brixAt(L, s)) });
      pts.push({ x: g.timeX(end), y: g.brixY(brixAt(L, end)) });
    }
    return pts;
  };

  /** 327 is the canvas inside a 375px phone, which is where the reviewer
      found the label lying across B1, B2 and B3; the rest is the range the
      figure is ever laid out in. */
  const PLANS: [number, boolean][] = [
    ...[240, 280, 327, 360, 400, 480, 600, 639].map((w) => [w, true] as [number, boolean]),
    ...[420, 520, 640, 760, 900, 1040, 1200].map((w) => [w, false] as [number, boolean]),
  ];

  /** The label is 11px mono and its two forms differ per locale, so the box is
      swept over every width the text can measure rather than pinned to one. */
  const TEXT_W = Array.from({ length: 36 }, (_, i) => i * 8);

  it("never lands on a reading, at any width or text length", () => {
    const on: string[] = [];
    for (const [w, isPhone] of PLANS) {
      const pts = readings(w, isPhone);
      for (const textW of TEXT_W) {
        const { box } = flagLabel(w, isPhone, textW);
        for (const p of pts) {
          if (p.x < box.x0 || p.x > box.x1 || p.y < box.y0 || p.y > box.y1) continue;
          on.push(
            (isPhone ? "phone " : "wide ") + w + ", text " + textW + "px: a reading at " +
              p.x.toFixed(1) + "," + p.y.toFixed(1),
          );
          break;
        }
      }
    }
    expect(on.slice(0, 4)).toEqual([]);
  });

  it("sits under the chart's floor, which is where no reading can be", () => {
    /* The structural half of the same fact: BRIX_LO is the chart's floor, so
       every reading the loop can draw is at or above it, and a label whose box
       starts below it cannot be crossed however long the text is or whatever
       the readings do next. */
    for (const [w, isPhone] of PLANS) {
      const g = chart(w, isPhone);
      const { box, baseline } = flagLabel(w, isPhone, 160);
      expect(box.y0, "the label's top at " + w).toBeGreaterThan(g.base);
      expect(baseline).toBeGreaterThan(g.base);
      for (const L of LOTS) {
        expect(g.brixY(brixAt(L, END_D)), L.k + " at " + w).toBeLessThanOrEqual(g.base);
      }
    }
  });

  it("stays on the board, at every width the text can fit on", () => {
    for (const [w, isPhone] of PLANS) {
      const g = chart(w, isPhone);
      for (const textW of TEXT_W.filter((t) => t <= g.x1 - g.x0)) {
        const { box } = flagLabel(w, isPhone, textW);
        expect(box.x0, "left edge at " + w + ", text " + textW).toBeGreaterThanOrEqual(0);
        expect(box.x1, "right edge at " + w + ", text " + textW).toBeLessThanOrEqual(w);
        expect(box.y1, "bottom edge at " + w).toBeLessThanOrEqual(bands(w, isPhone).height);
      }
    }
  });

  it("is drawn from the same scales the readings are", () => {
    /* One geometry, not two: the component reads its axis and its chart out of
       chart(), so a label placed clear here is placed clear on the canvas. */
    for (const [w, isPhone] of PLANS) {
      const g = chart(w, isPhone);
      const b = bands(w, isPhone);
      expect(g.top).toBe(b.lt);
      expect(g.base).toBe(b.lb);
      expect(g.timeX(0)).toBeCloseTo(g.x0, 9);
      expect(g.timeX(HARVEST)).toBeCloseTo(g.x1, 9);
      expect(g.brixY(BRIX_LO)).toBeCloseTo(g.base, 9);
      expect(g.brixY(BRIX_HI)).toBeCloseTo(g.top, 9);
    }
  });
});
