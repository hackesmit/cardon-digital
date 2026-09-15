/**
 * The Restaurante floor as pure data (bead hq-3pfhe.1).
 *
 * The room and the evening's reservations, the covers curve they add up to,
 * the loop's timeline, the captions that timeline resolves to, and the stage's
 * vertical bands. Nothing here touches a canvas or the DOM, which is the
 * point: every number the demo's payoff frame depends on can be checked
 * without a browser.
 *
 * Round one kept all of this inside the component, where the loop held on
 * minute 360 of a 360 minute service: every booking has ended by 295, so the
 * frame the animation rested on for five and a half seconds was an empty cold
 * room with zero covers. Both reviews called it. The hold is now PEAK_T, the
 * fullest minute of the evening, which is also the frame reduced motion
 * resolves to, and demos.test.ts pins both facts.
 */

export type TableKind =
  | "twoWindow"
  | "fourCenter"
  | "banquette"
  | "fourLower"
  | "largeTop"
  | "twoLower";

export type Shape = "round" | "square" | "rectH" | "rectV";

/** s: the minute of the service the party is seated, 0 being 17:00. d: how
    long they hold the table. p: how many of them there are. */
export interface Reservation {
  s: number;
  d: number;
  p: number;
}

/** Where a table sits: fx as a fraction of the canvas width, fy as a fraction
    of the room band's height. Two of these per table, because a phone is not a
    narrow desktop. */
export interface Spot {
  fx: number;
  fy: number;
}

export interface TableDef {
  kind: TableKind;
  shape: Shape;
  seats: number;
  res: Reservation[];
  /** 640px and up: the room as it was drawn, a window row, a centre block, a
      banquette on the right wall and a lower room. */
  wide: Spot;
  /** Under 640px: the same twelve tables reflowed into three columns and four
      rows, with the entrance moved to the bottom of the left wall. The room
      gets taller rather than the tables getting smaller, because a floor plan
      whose tables are 9px across is a picture of a floor plan. */
  phone: Spot;
}

export const TABLES: TableDef[] = [
  { kind: "twoWindow", shape: "round", seats: 2, res: [{ s: 25, d: 80, p: 2 }, { s: 150, d: 80, p: 2 }], wide: { fx: 0.15, fy: 0.16 }, phone: { fx: 0.2, fy: 0.11 } },
  { kind: "twoWindow", shape: "round", seats: 2, res: [{ s: 55, d: 75, p: 2 }, { s: 175, d: 70, p: 2 }], wide: { fx: 0.29, fy: 0.16 }, phone: { fx: 0.5, fy: 0.11 } },
  { kind: "twoWindow", shape: "round", seats: 2, res: [{ s: 85, d: 80, p: 2 }], wide: { fx: 0.43, fy: 0.16 }, phone: { fx: 0.8, fy: 0.11 } },
  { kind: "twoWindow", shape: "round", seats: 2, res: [{ s: 110, d: 80, p: 2 }, { s: 215, d: 65, p: 2 }], wide: { fx: 0.57, fy: 0.16 }, phone: { fx: 0.2, fy: 0.33 } },
  { kind: "fourCenter", shape: "square", seats: 4, res: [{ s: 40, d: 95, p: 4 }, { s: 165, d: 90, p: 3 }], wide: { fx: 0.16, fy: 0.515 }, phone: { fx: 0.5, fy: 0.33 } },
  { kind: "fourCenter", shape: "square", seats: 4, res: [{ s: 70, d: 95, p: 4 }], wide: { fx: 0.3, fy: 0.515 }, phone: { fx: 0.2, fy: 0.55 } },
  { kind: "fourCenter", shape: "square", seats: 4, res: [{ s: 95, d: 100, p: 4 }, { s: 210, d: 85, p: 4 }], wide: { fx: 0.45, fy: 0.515 }, phone: { fx: 0.5, fy: 0.55 } },
  { kind: "fourCenter", shape: "square", seats: 4, res: [{ s: 125, d: 95, p: 4 }], wide: { fx: 0.6, fy: 0.515 }, phone: { fx: 0.8, fy: 0.55 } },
  { kind: "banquette", shape: "rectV", seats: 6, res: [{ s: 90, d: 120, p: 6 }], wide: { fx: 0.85, fy: 0.343 }, phone: { fx: 0.81, fy: 0.33 } },
  { kind: "fourLower", shape: "square", seats: 4, res: [{ s: 135, d: 95, p: 4 }], wide: { fx: 0.19, fy: 0.86 }, phone: { fx: 0.2, fy: 0.77 } },
  { kind: "largeTop", shape: "rectH", seats: 6, res: [{ s: 150, d: 110, p: 5 }], wide: { fx: 0.42, fy: 0.86 }, phone: { fx: 0.5, fy: 0.77 } },
  { kind: "twoLower", shape: "round", seats: 2, res: [{ s: 60, d: 75, p: 2 }, { s: 175, d: 72, p: 2 }], wide: { fx: 0.62, fy: 0.86 }, phone: { fx: 0.8, fy: 0.77 } },
];

/** Minutes across the service, 17:00 to 23:00. This is the width of the time
    axis, not how far the loop sweeps: see PEAK_T. */
export const SERVICE = 360;

export function clockLabel(m: number): string {
  let mm = Math.round(m / 5) * 5;
  if (mm > SERVICE) mm = SERVICE;
  const h = 17 + Math.floor(mm / 60);
  const r = mm % 60;
  return h + ":" + (r < 10 ? "0" + r : r);
}

/** The covers curve for the whole service, its peak, and the minute the calm
    marker sits on. Pure arithmetic over TABLES, so it is computed once for the
    module rather than once per mount. */
export const COV = new Float32Array(SERVICE + 1);
let peak = 1;
let peakAt = 0;
for (let t = 0; t <= SERVICE; t++) {
  let c = 0;
  for (const T of TABLES) {
    for (const r of T.res) if (t >= r.s && t < r.s + r.d) c += r.p;
  }
  COV[t] = c;
  if (c > peak) {
    peak = c;
    peakAt = t;
  }
}

/** The fullest the room gets, and the minute it happens on. */
export const PEAK_V = peak;
export const PEAK_T = peakAt;

/* Headroom above the peak, so the calm marker's label has somewhere to sit
   that is not on top of the curve it is describing. */
export const MAX_COV = PEAK_V * 1.34;
export const RUSH_T = Math.max(0, PEAK_T - 60);

/** What a table's readout says: its last booking of the evening. Derived here
    rather than typed out beside the geometry, so the plate can never claim a
    reservation TABLES does not hold. The copy says "last booking" in so many
    words, because the board is drawn at one minute of the evening and that
    booking is usually not the one on the table yet (reviewer note 8). */
export const READOUTS = TABLES.map((T) => {
  const last = T.res[T.res.length - 1];
  return { kind: T.kind, n: last.p, time: clockLabel(last.s) };
});

/* -------------------------------- the loop ------------------------------- */

/** A beat before the evening starts, the evening filling to its peak, a hold
    on the full room, then a short dip into the reset so the seam is not a
    jump. Seconds. */
export const INTRO = 1.8;
export const RUN = 30;
export const HOLD = 5.5;
export const FADE = 1.2;
export const CYCLE = INTRO + RUN + HOLD + FADE;

export interface CycleFrame {
  /** The minute of the service to draw. */
  t: number;
  /** Chips travel while the evening is running and are gone on the hold, so
      the payoff frame is the room rather than the arrivals. */
  showChips: boolean;
  /** 1 is the frame at full opacity; below that the loop seam is dipping. */
  fade: number;
}

/**
 * Where the loop is at `cycT` seconds into the cycle.
 *
 * The run sweeps to PEAK_T rather than to SERVICE, so the hold rests on the
 * fullest room of the evening instead of on the empty one that follows it.
 * The covers band still draws the whole evening as a ghost curve, so nothing
 * about the service after the peak is hidden by stopping the playhead there.
 */
export function cycleFrame(cycT: number): CycleFrame {
  let t: number;
  let showChips = true;
  if (cycT < INTRO) {
    t = 0;
    showChips = false;
  } else if (cycT < INTRO + RUN) {
    t = ((cycT - INTRO) / RUN) * PEAK_T;
  } else {
    t = PEAK_T;
    showChips = false;
  }

  /* a gentle dip at the loop seam so the reset is not a jump */
  let fade = 1;
  const fadeStart = INTRO + RUN + HOLD;
  if (cycT >= fadeStart) fade = 1 - ((cycT - fadeStart) / FADE) * 0.85;
  else if (cycT < 0.5) fade = 0.15 + (cycT / 0.5) * 0.85;

  return { t, showChips, fade };
}

/** Which caption the strip carries at minute `t`. The hold and the static
    reduced-motion frame are both PEAK_T, so both read "peak service": the
    words and the floor can never disagree. */
export function captionKeyFor(t: number): "begins" | "filling" | "flagged" | "peak" {
  if (t < 2) return "begins";
  if (t < RUSH_T) return "filling";
  if (t < PEAK_T) return "flagged";
  return "peak";
}

/* ------------------------------- the stage ------------------------------- */

const clampN = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export interface Bands {
  cy: number;
  ry0: number;
  ry1: number;
  roomH: number;
  lt: number;
  lb: number;
  height: number;
}

/**
 * Vertical layout as pixel bands derived from the measured width, so the frame
 * height fits the composition at every width: no fixed tall box and no
 * letterbox. One source of truth, used for the canvas height, for the
 * positions inside it, and for the pre-hydration placeholder in demos.css.
 */
export function bands(w: number, isPhone: boolean): Bands {
  const cy = 24;
  const ry0 = cy + 36; /* the gap holds the playhead time label */
  /* The phone room is taller than it is wide because it holds four rows of
     three; the wide room is a shallow band because it holds three rows. */
  const roomH = isPhone
    ? clampN(w * 0.92, 330, 380)
    : clampN(w * 0.25, 188, 280);
  const ry1 = ry0 + roomH;
  const lt = ry1 + 34; /* clear gap between the room and the covers label */
  const covH = isPhone
    ? clampN(w * 0.34, 110, 140)
    : clampN(w * 0.13, 118, 150);
  const lb = lt + covH;
  return { cy, ry0, ry1, roomH, lt, lb, height: Math.round(lb + 22) };
}

/**
 * The one breakpoint the demos have: under this the floor reflows to the phone
 * plan. It is measured on the figure's content box, which is the box
 * demos.css makes its query container, so the stylesheet and the component
 * always pick the same plan. Round two's cross-vendor review found the old
 * pair, a canvas-width check in JS against a viewport media query in CSS,
 * disagreeing for any demo in a column narrower than the page: a phone floor
 * plan drawn under a desktop stylesheet, with hover plates and a placeholder
 * 180px short of the canvas it was holding space for.
 */
export const PHONE_MAX = 640;

/*
 * demos.css carries this same arithmetic as the canvas's pre-hydration height,
 * written in cqw against the figure's content box, so the placeholder is the
 * measured height at every width instead of a single reference width that is
 * wrong everywhere else. demos.test.ts parses the stylesheet's two formulas
 * and compares them to bands() across a width sweep, which is what keeps the
 * two copies honest.
 */
