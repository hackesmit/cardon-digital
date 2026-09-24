import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { withoutCssComments } from "./contract/ghosts";

import {
  bands,
  board,
  CAPACITY,
  CAPTION_KEYS,
  captionKeyFor,
  CYCLE,
  cycleFrame,
  directShareAt,
  FADE,
  FEATURED,
  FINAL,
  HOLD,
  hotspotSpots,
  INTRO,
  isWeekend,
  landed,
  LEAD,
  NIGHTS,
  occupancyAt,
  PHONE_MAX,
  READOUTS,
  RUN,
  SOLD,
  SOLD_DIRECT,
  STANDING_CYC,
  STAYS,
  UNITS,
  weekday,
} from "./fortnight";
import { demos } from "../../../lib/i18n/demos";

/**
 * The Hospitalidad demo's data, its timeline and its geometry (bead
 * hq-3pfhe.3).
 *
 * Everything the payoff frame stands on, checked without a browser. The four
 * things that would break the demo quietly, in the order they matter:
 *
 *   1. the argument. Direct and OTA are two series and the copy claims a
 *      direct majority on the hold frame. Reshuffling the stays could make
 *      that sentence false with nothing else looking wrong;
 *   2. the story. The weekends fill before the midweek, which is the only
 *      reason "the weekend goes first" is a caption and not a slogan;
 *   3. the geometry. Eight 54px hotspots over a grid whose rows are 23px
 *      apart collide unless the stays they sit on are several nights apart,
 *      and a collision is a plate a visitor cannot reach;
 *   4. the frame height. demos.css carries one pre-hydration height for every
 *      demo in the family, so this composition has to measure what the
 *      stylesheet reserves at every width, exactly as floor.ts does.
 */

const here = new URL("./", import.meta.url);
const read = (rel: string) => readFileSync(new URL(rel, here), "utf8");

/* ------------------------ 1. the argument on the board -------------------- */

describe("the fortnight the loop arrives at", () => {
  it("sells more of itself direct than through the agencies", () => {
    /* The hold frame's caption says the fortnight ended up mostly direct, in
       both locales. It is a statement about invented data and it still has to
       be true of the invented data. */
    expect(SOLD_DIRECT * 2).toBeGreaterThan(SOLD);
    expect(directShareAt(0)).toBe(Math.round((SOLD_DIRECT / SOLD) * 100));
  });

  it("is a good fortnight and not a full one", () => {
    /* A board with every cell filled says nothing about which nights sell.
       A board with none says nothing either. */
    expect(SOLD).toBeLessThan(CAPACITY);
    expect(SOLD / CAPACITY).toBeGreaterThan(0.5);
  });

  it("fills both weekends to the last unit", () => {
    for (let n = 0; n < NIGHTS; n++) {
      if (!isWeekend(n)) continue;
      expect(FINAL[n].direct + FINAL[n].ota, "night " + n).toBe(UNITS.length);
    }
    /* four of them: two Fridays and two Saturdays */
    expect(Array.from({ length: NIGHTS }, (_, n) => n).filter(isWeekend)).toEqual([4, 5, 11, 12]);
    expect(weekday(0)).toBe(0);
  });

  it("books no unit twice on the same night", () => {
    const seen = new Set<string>();
    for (const s of STAYS) {
      for (let n = s.from; n < s.from + s.nights; n++) {
        expect(n, "a stay runs past the fortnight").toBeLessThan(NIGHTS);
        const key = s.unit + ":" + n;
        expect(seen.has(key), "unit " + s.unit + " is booked twice on night " + n).toBe(false);
        seen.add(key);
      }
    }
  });

  it("carries both channels on every part of the board", () => {
    /* A demo whose OTA stays were all in one corner would read as a colour
       for a place rather than a colour for a channel. */
    for (const ch of ["direct", "ota"] as const) {
      const units = new Set(STAYS.filter((s) => s.channel === ch).map((s) => s.unit));
      expect(units.size, ch + " units").toBeGreaterThan(4);
    }
  });
});

/* ------------------------- 2. the weekend goes first ---------------------- */

describe("the story the loop tells", () => {
  const touchesWeekend = (i: number) => {
    const s = STAYS[i];
    for (let n = s.from; n < s.from + s.nights; n++) if (isWeekend(n)) return true;
    return false;
  };

  it("books every weekend stay before any midweek one", () => {
    const weekendLast = Math.min(...STAYS.map((_, i) => (touchesWeekend(i) ? STAYS[i].booked : Infinity)));
    const middayFirst = Math.max(...STAYS.map((_, i) => (touchesWeekend(i) ? -Infinity : STAYS[i].booked)));
    expect(weekendLast, "the last weekend booking is made before the first midweek one").toBeGreaterThan(
      middayFirst,
    );
  });

  it("fills the first weekend before the second", () => {
    const fullAt = (night: number) => {
      for (let d = LEAD; d >= 0; d -= 0.25) {
        const f = occupancyAt(d)[night];
        if (f.direct + f.ota === UNITS.length) return d;
      }
      return -1;
    };
    expect(fullAt(4)).toBeGreaterThan(fullAt(11));
    expect(fullAt(11)).toBeGreaterThan(0);
  });

  it("opens on an empty board and closes on the whole fortnight", () => {
    for (const f of occupancyAt(LEAD)) expect(f.direct + f.ota).toBe(0);
    expect(occupancyAt(0)).toEqual(FINAL);
  });

  it("never unbooks a night as the countdown runs", () => {
    let last = -1;
    for (let d = LEAD; d >= 0; d -= 0.5) {
      const sold = occupancyAt(d).reduce((a, f) => a + f.direct + f.ota, 0);
      expect(sold, "sold at " + d).toBeGreaterThanOrEqual(last);
      last = sold;
    }
    expect(last).toBe(SOLD);
  });

  it("lands each stay once, forwards, and holds it there", () => {
    for (const s of STAYS) {
      expect(landed(s, s.booked + 0.01)).toBe(0);
      expect(landed(s, s.booked)).toBe(0);
      expect(landed(s, 0)).toBe(1);
      let last = -1;
      for (let d = LEAD; d >= 0; d -= 0.25) {
        const u = landed(s, d);
        expect(u).toBeGreaterThanOrEqual(last);
        expect(u).toBeLessThanOrEqual(1);
        last = u;
      }
    }
  });
});

/* ---------------------------- 3. the loop's clock ------------------------- */

describe("the loop's clock", () => {
  it("stands on the first frame of the hold, which is the filled fortnight", () => {
    expect(STANDING_CYC).toBe(INTRO + RUN);
    expect(cycleFrame(STANDING_CYC).daysOut).toBe(0);
    expect(cycleFrame(STANDING_CYC).fade).toBe(1);
    /* and the hold draws that same frame for the whole of it */
    expect(cycleFrame(STANDING_CYC + HOLD - 0.01)).toEqual(cycleFrame(STANDING_CYC));
  });

  it("holds long enough to be read and leaves again well inside twenty seconds", () => {
    /* the contract harness comes back after a pause and waits twenty seconds
       for the loop to move on */
    expect(HOLD).toBeGreaterThanOrEqual(1);
    expect(HOLD + FADE).toBeLessThan(20);
    expect(CYCLE).toBeLessThan(60);
    expect(CYCLE).toBe(INTRO + RUN + HOLD + FADE);
  });

  it("never shows the standing frame in the first three seconds of the story", () => {
    for (let t = 0; t <= 3; t += 0.05) {
      expect(cycleFrame(t).daysOut, "at " + t.toFixed(2) + "s").toBeGreaterThan(0);
    }
  });

  it("counts the days down and never back up", () => {
    let last = Infinity;
    for (let t = 0; t <= CYCLE; t += 0.05) {
      const d = cycleFrame(t).daysOut;
      if (t <= STANDING_CYC) expect(d).toBeLessThanOrEqual(last);
      last = d;
    }
  });

  it("dips only at the loop seam", () => {
    for (let t = 0.5; t < INTRO + RUN + HOLD; t += 0.1) {
      expect(cycleFrame(t).fade, "at " + t.toFixed(1) + "s").toBe(1);
    }
    expect(cycleFrame(CYCLE - 0.01).fade).toBeLessThan(0.2);
    expect(cycleFrame(0).fade).toBeLessThan(0.2);
  });
});

/* ------------------------------ 4. the captions --------------------------- */

describe("the captions", () => {
  it("resolves to every key it declares and to nothing else", () => {
    const reached = new Set<string>();
    for (let t = 0; t <= CYCLE; t += 0.02) reached.add(captionKeyFor(cycleFrame(t).daysOut));
    expect(Array.from(reached).sort()).toEqual([...CAPTION_KEYS].sort());
    expect(CAPTION_KEYS).toHaveLength(4);
  });

  it("says the fortnight is full exactly when the board is", () => {
    expect(captionKeyFor(cycleFrame(STANDING_CYC).daysOut)).toBe("full");
    expect(captionKeyFor(0.5)).toBe("filling");
  });

  it("calls the weekend while the weekend is what is happening", () => {
    /* the first weekend completes inside the weekend caption's stretch */
    expect(captionKeyFor(38)).toBe("weekend");
    expect(captionKeyFor(25)).toBe("weekend");
    expect(captionKeyFor(LEAD)).toBe("opens");
  });
});

/* --------------------------- 5. the plates and their stays ---------------- */

describe("what a plate reads", () => {
  it("gives every unit one longest stay, with no tie to break", () => {
    expect(FEATURED).toHaveLength(UNITS.length);
    for (let u = 0; u < UNITS.length; u++) {
      const mine = STAYS.filter((s) => s.unit === u);
      expect(mine.length, "unit " + u + " has stays").toBeGreaterThan(1);
      const longest = Math.max(...mine.map((s) => s.nights));
      expect(mine.filter((s) => s.nights === longest), "unit " + u + " ties for longest").toHaveLength(1);
      expect(STAYS[FEATURED[u]].unit).toBe(u);
      expect(STAYS[FEATURED[u]].nights).toBe(longest);
    }
  });

  it("reads the stay the board draws, dates included", () => {
    READOUTS.forEach((r, u) => {
      const s = STAYS[FEATURED[u]];
      expect(r.kind).toBe(UNITS[u].kind);
      expect(r.nights).toBe(s.nights);
      expect(r.channel).toBe(s.channel);
      expect(r.to - r.from).toBe(s.nights - 1);
    });
    /* both channels are among the plates, so a visitor tapping around reads
       the two words as well as seeing the two colours */
    expect(new Set(READOUTS.map((r) => r.channel))).toEqual(new Set(["direct", "ota"]));
  });
});

/* ------------------------------ 6. the geometry --------------------------- */

describe("the board's geometry", () => {
  const widths = (from: number, to: number) => {
    const out: number[] = [];
    for (let w = from; w <= to; w += 3) out.push(w);
    return out;
  };

  it.each([
    ["wide", 640, 1200, 54],
    ["phone", 250, 639, 48],
  ] as const)("keeps the eight %s hotspots off each other", (_plan, from, to, size) => {
    for (const w of widths(from, to)) {
      const phone = w < PHONE_MAX;
      const h = bands(w, phone).height;
      const spots = hotspotSpots(w, phone).map((s) => ({ x: s.fx * w, y: s.fy * h }));
      for (let i = 0; i < spots.length; i++) {
        for (let j = i + 1; j < spots.length; j++) {
          const dx = Math.abs(spots[i].x - spots[j].x);
          const dy = Math.abs(spots[i].y - spots[j].y);
          expect(
            dx >= size || dy >= size,
            "hotspots " + i + " and " + j + " overlap at " + w + "px (" + dx.toFixed(1) + ", " + dy.toFixed(1) + ")",
          ).toBe(true);
        }
      }
    }
  });

  it("keeps every hotspot on the board it belongs to", () => {
    for (const w of widths(250, 1200)) {
      const phone = w < PHONE_MAX;
      const b = bands(w, phone);
      const bd = board(w, phone);
      for (const s of hotspotSpots(w, phone)) {
        expect(s.fx * w).toBeGreaterThan(bd.gx0);
        expect(s.fx * w).toBeLessThan(bd.gx1);
        expect(s.fy * b.height).toBeGreaterThan(b.gy0);
        expect(s.fy * b.height).toBeLessThan(b.gy1);
      }
    }
  });

  it("draws all fourteen nights wide enough for a two digit date", () => {
    /* the phone plan keeps the whole fortnight rather than dropping days: a
       column has to hold "19" at the 9px mono the dates are drawn in */
    for (const w of widths(250, 1200)) {
      const bd = board(w, w < PHONE_MAX);
      expect(bd.cw, "a night at " + w + "px").toBeGreaterThan(11);
      expect(bd.barH, "a bar at " + w + "px").toBeGreaterThan(9);
    }
  });
});

/* ------------------- 7. the height the stylesheet reserves ---------------- */

describe("the pre-hydration height in demos.css", () => {
  const css = withoutCssComments(read("demos.css"));
  const phoneBlock = new RegExp(
    "@container \\(width < " + PHONE_MAX + "px\\) \\{([\\s\\S]*?)\\n\\}",
  ).exec(css);

  const cssHeight = (block: string) => {
    const m = /\.demo-canvas\s*\{[^}]*height:\s*calc\((\d+)px \+ clamp\((\d+)px, (\d+)cqw, (\d+)px\) \+ (\d+)px \+ clamp\((\d+)px, (\d+)cqw, (\d+)px\) \+ (\d+)px\)/.exec(block);
    if (!m) throw new Error("no .demo-canvas calc height found");
    const n = m.slice(1).map(Number);
    const clamp = (lo: number, v: number, hi: number) => Math.min(Math.max(v, lo), hi);
    return (w: number) =>
      n[0] + clamp(n[1], (n[2] / 100) * w, n[3]) + n[4] + clamp(n[5], (n[6] / 100) * w, n[7]) + n[8];
  };

  it("is the height this composition measures, at every width", () => {
    /* One stylesheet rule serves every demo in the family, so the fortnight
       is composed to the height the placeholder already reserves. If a later
       bead gives this demo a rule of its own, this test is where it says so. */
    expect(phoneBlock).not.toBeNull();
    const wide = cssHeight(css);
    const phone = cssHeight(phoneBlock![1]);
    for (let w = 240; w <= 1200; w += 7) {
      expect(Math.round(wide(w)), "wide at " + w).toBe(bands(w, false).height);
      expect(Math.round(phone(w)), "phone at " + w).toBe(bands(w, true).height);
    }
  });

  it("leaves the bands in the order the composition draws them", () => {
    for (const phone of [false, true]) {
      const b = bands(700, phone);
      expect(b.hy).toBeLessThan(b.gy0);
      expect(b.gy0).toBeLessThan(b.gy1);
      expect(b.gy1).toBeLessThan(b.lt);
      expect(b.lt).toBeLessThan(b.lb);
      expect(b.lb).toBeLessThan(b.height);
    }
  });
});

/* ------------------------------- 8. the copy ------------------------------ */

describe("the hospitalidad dictionary", () => {
  const placeholders = (s: string) => (s.match(/\{[a-z]+\}/g) ?? []).sort();

  it.each(["en", "es"] as const)("%s carries a caption for every phase", (locale) => {
    const captions = demos[locale].hospitalidad.captions;
    expect(Object.keys(captions).sort()).toEqual([...CAPTION_KEYS].sort());
  });

  it.each(["en", "es"] as const)("%s names every unit the board draws", (locale) => {
    const vis = demos[locale].hospitalidad;
    expect(Object.keys(vis.units).sort()).toEqual(
      Array.from(new Set(UNITS.map((u) => u.kind))).sort(),
    );
    expect(Object.keys(vis.unitAria).sort()).toEqual(Object.keys(vis.units).sort());
    expect(Object.keys(vis.channels).sort()).toEqual(["direct", "ota"]);
    expect(Object.keys(vis.channelsUpper).sort()).toEqual(["direct", "ota"]);
  });

  it.each(["en", "es"] as const)("%s keeps the placeholders the plate fills", (locale) => {
    const vis = demos[locale].hospitalidad;
    expect(placeholders(vis.stayLine)).toEqual(["{channel}", "{dates}", "{n}"]);
    for (const aria of Object.values(vis.unitAria)) {
      expect(placeholders(aria)).toEqual(["{channel}", "{dates}", "{n}"]);
    }
    expect(placeholders(vis.daysOut)).toEqual(["{n}"]);
    expect(placeholders(vis.directShare)).toEqual(["{p}"]);
  });

  it.each(["en", "es"] as const)("%s has one weekday letter per day of the week", (locale) => {
    expect(demos[locale].hospitalidad.weekdayLetters).toHaveLength(7);
  });
});
