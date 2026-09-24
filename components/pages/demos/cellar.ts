/**
 * The Produccion harvest as pure data (bead hq-3pfhe.2).
 *
 * The block and its six lots, the sugar readings that climb across the
 * harvest, the day each lot is cut, the tank each one fills, the loop's
 * timeline, the captions that timeline resolves to, and the stage's vertical
 * bands. Nothing here touches a canvas or the DOM, which is the point:
 * ./cellar.test.ts checks every number the payoff frame depends on without a
 * browser, exactly as ./floor.ts is checked for the Restaurante demo.
 *
 * What the demo argues. A winemaker decides one thing across a vendimia: when
 * each lot comes off the vine. Cut early and the wine is thin, cut late and it
 * is jammy, and the window between the two is a few days wide per lot. The
 * readings that say where a lot is are taken all through the ripening, so the
 * window is legible before it arrives. So the loop is not decoration that
 * loops: the lots deepen as they ripen, each one is cut on the day its reading
 * enters the window, the fruit travels to its tank, the tank fills, and five
 * days before the LAST crossing a calm marker shows that window arriving. The
 * payoff frame the loop holds on is the full cellar with every lot cut inside
 * its window.
 *
 * Every number below is invented. The frame says so in both locales.
 */

/* ------------------------------- the block ------------------------------- */

export type LotKey = "A1" | "A2" | "A3" | "B1" | "B2" | "B3";

export type VarietyKey =
  | "sauvignonBlanc"
  | "chardonnay"
  | "merlot"
  | "tempranillo"
  | "nebbiolo"
  | "cabernet";

/**
 * The block's corners, in its own box: x across, y down, both 0 to 1.
 *
 * A map draws its lots as a contiguous block whose polygons SHARE vertices
 * with their neighbours, never as independently placed shapes with gaps
 * between them (Daniel, 2026-09-15, on this bead; the reference is the PLOTS
 * table in components/pages/case/VineyardMap.tsx). Sharing here is by
 * construction rather than by two numbers that happen to agree: a lot is
 * built from these corners by name, so A2's left edge IS A1's right edge and
 * B2's top edge IS A2's bottom edge. The rows and the columns are deliberately
 * not straight, because real lots follow the ground; cellar.test.ts adds the
 * two facts a reader cannot see by eye, that the six areas sum to the outline's
 * area (no gaps, no overlaps) and that every interior edge is shared by exactly
 * two lots.
 */
const C = {
  t0: [0.02, 0.06],
  t1: [0.35, 0.015],
  t2: [0.68, 0.05],
  t3: [0.985, 0.105],
  m0: [0.0, 0.52],
  m1: [0.335, 0.475],
  m2: [0.69, 0.505],
  m3: [1.0, 0.55],
  b0: [0.05, 0.95],
  b1: [0.355, 0.99],
  b2: [0.705, 0.955],
  b3: [0.955, 0.895],
} as const satisfies Record<string, readonly [number, number]>;

export type Corner = (typeof C)[keyof typeof C];

/** The block's outline, anticlockwise from its top left corner. The six lots
    tile exactly this. */
export const OUTLINE: readonly Corner[] = [
  C.t0,
  C.t1,
  C.t2,
  C.t3,
  C.m3,
  C.b3,
  C.b2,
  C.b1,
  C.b0,
  C.m0,
];

export interface LotDef {
  k: LotKey;
  variety: VarietyKey;
  /** Tons off the lot, which is what fills its tank. */
  tons: number;
  /** How full that tank ends up, as a fraction of its own height. */
  fill: number;
  /** The day of the harvest the lot's reading enters the picking window. */
  cross: number;
  /** The reading on day 0, and the reading it is cut on. */
  brix0: number;
  brixCut: number;
  /** The lot, from the shared corners above. */
  pts: readonly Corner[];
}

/**
 * The six lots, in the order they ripen.
 *
 * Whites first and the Cabernet last is how a Valle de Guadalupe harvest
 * actually runs, and it is what makes the block drain from the top row down
 * rather than all at once: the argument is that the winemaker sees each window
 * coming, so the windows have to arrive one at a time.
 */
export const LOTS: readonly LotDef[] = [
  { k: "A1", variety: "sauvignonBlanc", tons: 12, fill: 0.74, cross: 5, brix0: 18.2, brixCut: 24.0, pts: [C.t0, C.t1, C.m1, C.m0] },
  { k: "A2", variety: "chardonnay", tons: 15, fill: 0.82, cross: 10, brix0: 17.8, brixCut: 24.3, pts: [C.t1, C.t2, C.m2, C.m1] },
  { k: "A3", variety: "merlot", tons: 18, fill: 0.9, cross: 16, brix0: 17.4, brixCut: 24.6, pts: [C.t2, C.t3, C.m3, C.m2] },
  { k: "B1", variety: "tempranillo", tons: 16, fill: 0.78, cross: 22, brix0: 17.1, brixCut: 24.8, pts: [C.m0, C.m1, C.b1, C.b0] },
  { k: "B2", variety: "nebbiolo", tons: 20, fill: 0.86, cross: 28, brix0: 16.9, brixCut: 25.0, pts: [C.m1, C.m2, C.b2, C.b1] },
  { k: "B3", variety: "cabernet", tons: 22, fill: 0.94, cross: 34, brix0: 16.6, brixCut: 25.2, pts: [C.m2, C.m3, C.b3, C.b2] },
];

/** A lot's centre, in the block's own box: where its mark sits, where its
    hotspot sits, and where its fruit leaves from. */
export const CENTRES = LOTS.map((L) => {
  let x = 0;
  let y = 0;
  for (const p of L.pts) {
    x += p[0];
    y += p[1];
  }
  return { x: x / L.pts.length, y: y / L.pts.length };
});

/* ------------------------------ the readings ----------------------------- */

/** Degrees Brix: the sugar in the juice, which is what the picking decision is
    read off. The chart's floor and ceiling, chosen so the window band has
    headroom above it for its label. */
export const BRIX_LO = 16;
export const BRIX_HI = 27;

/** The picking window. A lot is cut when its reading is inside it. */
export const WINDOW_LO = 23.5;
export const WINDOW_HI = 25.5;

/** From the reading entering the window to the fruit leaving the lot, and how
    long the tank then takes to fill. Days. */
export const CUT_LAG = 1.5;
export const FILL = 2;

/** How many days before the last crossing the marker calls it. The copy says
    "five days" in so many words, in both locales, so cellar.test.ts pins this
    number to the sentence rather than leaving the two to drift. */
export const LEAD = 5;

/** The days the calendar strip spans: 20 August to 1 October. The axis is the
    planned window and the playhead stops short of it, because the last tank
    fills three days before the window closes. */
export const HARVEST = 42;

const ramp = (u: number) => 0.35 * u + 0.65 * u * u;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** The day a lot's fruit leaves the vine. */
export const cutDay = (L: LotDef) => L.cross + CUT_LAG;

/**
 * Lot `L`'s reading on day `d`.
 *
 * It climbs from brix0 to the window's floor on the day it crosses, then on to
 * the reading it is cut on, and it ENDS there: the fruit is off the vine and
 * there is nothing left to sample. Monotone by construction, because a sugar
 * reading that fell would say the lot was going backwards.
 */
export function brixAt(L: LotDef, d: number): number {
  if (d <= 0) return L.brix0;
  const cut = cutDay(L);
  if (d >= cut) return L.brixCut;
  if (d <= L.cross) return L.brix0 + (WINDOW_LO - L.brix0) * ramp(d / L.cross);
  return WINDOW_LO + (L.brixCut - WINDOW_LO) * ((d - L.cross) / CUT_LAG);
}

/** How full lot `L`'s tank is on day `d`, 0 to its own fill. The tank starts
    filling when the fruit arrives, not when the window opens. */
export function fillAt(L: LotDef, d: number): number {
  const u = clamp01((d - cutDay(L)) / FILL);
  /* ease out: the press runs hardest when the fruit first comes in */
  return L.fill * (1 - (1 - u) * (1 - u));
}

/** The lot the story is following on day `d`: the next one to come off, or
    null once the last one is in. */
export function climbing(d: number): LotDef | null {
  for (const L of LOTS) if (d < cutDay(L)) return L;
  return null;
}

/** How many lots are in the cellar on day `d`. Drawn on the canvas beside the
    tanks, never written into the page. */
export function inCellar(d: number): number {
  let n = 0;
  for (const L of LOTS) if (d >= cutDay(L)) n++;
  return n;
}

/** The last lot to cross, which is the one the marker is about. */
export const LAST = LOTS[LOTS.length - 1];
export const LAST_CROSS = LAST.cross;
/** The day the marker appears: the crossing was legible this long before it. */
export const FLAG_D = LAST_CROSS - LEAD;
/** Where the playhead stops: the last tank full, and a day to rest on it. */
export const END_D = cutDay(LAST) + FILL + 1.5;

/** What a lot's readout says: its own cut, derived here rather than typed out
    beside the geometry, so a plate can never claim a harvest LOTS does not
    hold. */
export const READOUTS = LOTS.map((L) => ({
  k: L.k,
  variety: L.variety,
  tons: L.tons,
  brix: L.brixCut,
  day: cutDay(L),
}));

/* ------------------------------- the dates ------------------------------- */

/** August 20 is day 0, so August runs out on day 11 and October opens on day
    42. Returned as a day and a month index rather than a string: the month
    names are copy and live in the dictionary, in both locales. */
export function harvestDate(day: number): { d: number; m: number } {
  const x = Math.round(day < 0 ? 0 : day > HARVEST ? HARVEST : day);
  if (x <= 11) return { d: 20 + x, m: 0 };
  if (x <= 41) return { d: x - 11, m: 1 };
  return { d: x - 41, m: 2 };
}

/** The calendar ticks: every seventh day, so the strip reads 20 AGO, 27 AGO,
    3 SEP and on to 1 OCT whatever the width. */
export const TICK_EVERY = 7;

/* -------------------------------- the loop ------------------------------- */

/** A beat before the harvest starts, the harvest playing out, a hold on the
    full cellar, then a short dip into the reset so the seam is not a jump.
    Seconds, and the same pacing as the Restaurante demo: the three figures
    mount on one page, and three loops of three different lengths beside each
    other read as three widgets rather than one family. */
export const INTRO = 1.8;
export const RUN = 30;
export const HOLD = 5.5;
export const FADE = 1.2;
export const CYCLE = INTRO + RUN + HOLD + FADE;

/**
 * Where the loop's clock stands whenever the demo is not animating: the FIRST
 * frame of the hold, which is the full cellar with every lot cut inside its
 * window.
 *
 * The first frame and not the last, for the reason ./floor.ts gives: both draw
 * the same pixels, and a demo parked at the end of the hold starts dipping
 * toward the loop seam the instant it resumes, so a visitor scrolling it into
 * view would watch the payoff frame fade out and refill.
 */
export const STANDING_CYC = INTRO + RUN;

export interface CycleFrame {
  /** The day of the harvest to draw. */
  d: number;
  /** Fruit travels while the harvest is running and is gone on the hold, so
      the payoff frame is the block and the cellar rather than the traffic
      between them. */
  showFruit: boolean;
  /** 1 is the frame at full opacity; below that the loop seam is dipping. */
  fade: number;
}

/**
 * Where the loop is at `cycT` seconds into the cycle.
 *
 * The run sweeps to END_D rather than to HARVEST, so the hold rests on the day
 * the cellar is full instead of on the empty fortnight that follows it. The
 * calendar strip still spans the whole planned window, so nothing about the
 * harvest is hidden by stopping the playhead there.
 */
export function cycleFrame(cycT: number): CycleFrame {
  let d: number;
  let showFruit = true;
  if (cycT < INTRO) {
    d = 0;
    showFruit = false;
  } else if (cycT < INTRO + RUN) {
    d = ((cycT - INTRO) / RUN) * END_D;
  } else {
    d = END_D;
    showFruit = false;
  }

  let fade = 1;
  const fadeStart = INTRO + RUN + HOLD;
  if (cycT >= fadeStart) fade = 1 - ((cycT - fadeStart) / FADE) * 0.85;
  else if (cycT < 0.5) fade = 0.15 + (cycT / 0.5) * 0.85;

  return { d, showFruit, fade };
}

/** Every caption the timeline can resolve to. The strip reserves room for all
    four at once, so a fifth phase added here without a ghost in the box would
    reflow the figure the moment it was reached. */
export const CAPTION_KEYS = ["begins", "ripening", "flagged", "picked"] as const;

export type CaptionKey = (typeof CAPTION_KEYS)[number];

/** Which caption the strip carries on day `d`. The hold and the static
    reduced-motion frame are both END_D, so both read "cut inside its window":
    the words and the block can never disagree. */
export function captionKeyFor(d: number): CaptionKey {
  if (d < 2) return "begins";
  if (d < FLAG_D) return "ripening";
  if (d < LAST_CROSS) return "flagged";
  return "picked";
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
 * Vertical layout as pixel bands derived from the measured width: the calendar
 * strip, the band that holds the block and the cellar, and the readings chart.
 *
 * These are the same numbers ./floor.ts derives, and that is not an oversight.
 * demos.css carries ONE pre-hydration .demo-canvas height for all three
 * figures, written in container query units so the placeholder is the measured
 * height at every width, and a demo whose height() disagreed with it would
 * jolt the page on first layout. So the arithmetic is written here, where this
 * demo's composition is designed against it, and cellar.test.ts rebuilds the
 * stylesheet's formula and fails if the two ever part company. When the third
 * demo lands, this skeleton wants to move into ./stage/ and be one copy; that
 * is a change to files this bead does not own, and it is noted on the bead.
 */
export function bands(w: number, isPhone: boolean): Bands {
  const cy = 24;
  const ry0 = cy + 36; /* the gap holds the playhead's date label */
  /* The phone band is deep because it stacks the block over the cellar; the
     wide band is shallow because the two sit side by side. */
  const roomH = isPhone ? clampN(w * 0.92, 330, 380) : clampN(w * 0.25, 188, 280);
  const ry1 = ry0 + roomH;
  const lt = ry1 + 34; /* clear gap between the cellar and the chart's label */
  const covH = isPhone ? clampN(w * 0.34, 110, 140) : clampN(w * 0.13, 118, 150);
  const lb = lt + covH;
  return { cy, ry0, ry1, roomH, lt, lb, height: Math.round(lb + 22) };
}

/* The breakpoint is the stage's, since all three demos share one stylesheet. */
export { isPhonePlan, PHONE_MAX } from "./stage/plan";
