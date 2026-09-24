/**
 * The Hospitalidad fortnight as pure data (bead hq-3pfhe.3).
 *
 * Eight units across fourteen nights, the stays that land on them over a
 * sixty day booking window, the channel each stay came through, the occupancy
 * those stays add up to night by night, the loop's timeline, the captions it
 * resolves to, and the board's vertical bands and grid geometry. Nothing here
 * touches a canvas or the DOM, which is the point: every number the payoff
 * frame depends on is checkable without a browser, and ./fortnight.test.ts
 * does exactly that.
 *
 * ./floor.ts is the same file for Restaurante and this one follows it, with
 * one difference worth stating: the grid geometry lives here too, not in the
 * component. The hotspots sit on the stays they describe, and a 54px touch
 * target over a grid of 14 columns by 8 rows can collide with its neighbour
 * without anyone noticing in a screenshot. Geometry that a test can evaluate
 * at every width is geometry whose collisions are a red test.
 *
 * Every number below is invented. The frame says so.
 */

/* --------------------------- the room and the stays ---------------------- */

export type UnitKind =
  | "casitaJardin"
  | "casitaVinedo"
  | "suiteTerraza"
  | "loft"
  | "villa";

/** Where a booking came from. The whole argument of this demo is that these
    two are not the same thing to the owner, so they are never one series. */
export type Channel = "direct" | "ota";

export interface UnitDef {
  kind: UnitKind;
}

export interface Stay {
  /** Index into UNITS. */
  unit: number;
  /** The first night of the stay, 0 being the first night of the fortnight. */
  from: number;
  nights: number;
  channel: Channel;
  /** How many days before the fortnight opens this booking was made. The loop
      counts that number down, so a stay with a bigger number lands earlier. */
  booked: number;
}

/** Nights in the fortnight. The phone plan shows all fourteen: see board(). */
export const NIGHTS = 14;

/** The first night is a Monday, so weekday(n) indexes LMXJVSD from Monday and
    the two Friday-Saturday pairs are nights 4 and 5, 11 and 12. */
export const FIRST_DAY = 6;

export const UNITS: UnitDef[] = [
  { kind: "casitaJardin" },
  { kind: "casitaJardin" },
  { kind: "casitaVinedo" },
  { kind: "casitaVinedo" },
  { kind: "suiteTerraza" },
  { kind: "suiteTerraza" },
  { kind: "loft" },
  { kind: "villa" },
];

/**
 * The fortnight's bookings.
 *
 * Shaped the way a real fortnight books: every stay that covers a Friday or a
 * Saturday was booked early (booked 25 and up), and the midweek gaps fill in
 * late, so watching the loop is watching both weekends go first and the week
 * fill in around them. Both weekends reach eight of eight; the fortnight ends
 * at 69 of 112 unit nights, which is a good fortnight and not a full one.
 */
export const STAYS: Stay[] = [
  { unit: 0, from: 3, nights: 3, channel: "direct", booked: 52 },
  { unit: 0, from: 6, nights: 2, channel: "ota", booked: 7 },
  { unit: 0, from: 9, nights: 4, channel: "ota", booked: 34 },

  { unit: 1, from: 0, nights: 1, channel: "ota", booked: 12 },
  { unit: 1, from: 3, nights: 3, channel: "ota", booked: 48 },
  { unit: 1, from: 8, nights: 2, channel: "direct", booked: 22 },
  { unit: 1, from: 11, nights: 2, channel: "direct", booked: 31 },

  { unit: 2, from: 0, nights: 2, channel: "direct", booked: 16 },
  { unit: 2, from: 4, nights: 2, channel: "direct", booked: 45 },
  { unit: 2, from: 7, nights: 2, channel: "ota", booked: 9 },
  { unit: 2, from: 11, nights: 3, channel: "ota", booked: 29 },

  { unit: 3, from: 1, nights: 4, channel: "direct", booked: 41 },
  { unit: 3, from: 5, nights: 2, channel: "ota", booked: 38 },
  { unit: 3, from: 8, nights: 2, channel: "direct", booked: 11 },
  { unit: 3, from: 11, nights: 2, channel: "ota", booked: 30 },

  { unit: 4, from: 0, nights: 2, channel: "direct", booked: 15 },
  { unit: 4, from: 4, nights: 2, channel: "direct", booked: 55 },
  { unit: 4, from: 7, nights: 3, channel: "direct", booked: 23 },
  { unit: 4, from: 11, nights: 2, channel: "direct", booked: 33 },

  { unit: 5, from: 0, nights: 1, channel: "direct", booked: 17 },
  { unit: 5, from: 4, nights: 2, channel: "ota", booked: 43 },
  { unit: 5, from: 6, nights: 2, channel: "direct", booked: 10 },
  { unit: 5, from: 11, nights: 3, channel: "direct", booked: 28 },

  { unit: 6, from: 0, nights: 1, channel: "ota", booked: 8 },
  { unit: 6, from: 3, nights: 3, channel: "direct", booked: 50 },
  { unit: 6, from: 9, nights: 2, channel: "ota", booked: 14 },
  { unit: 6, from: 11, nights: 2, channel: "ota", booked: 27 },

  { unit: 7, from: 2, nights: 2, channel: "ota", booked: 6 },
  { unit: 7, from: 4, nights: 2, channel: "direct", booked: 58 },
  { unit: 7, from: 9, nights: 4, channel: "direct", booked: 25 },
];

/** Monday is 0, so 4 and 5 are the Friday and the Saturday of each week. */
export const weekday = (night: number): number => (night + FIRST_DAY - 6 + 7) % 7;
export const dayNumber = (night: number): number => FIRST_DAY + night;
export const isWeekend = (night: number): boolean => {
  const d = weekday(night);
  return d === 4 || d === 5;
};

/* ------------------------------ what it adds up to ----------------------- */

/** Unit nights sold per night, split by channel, once every stay has landed. */
export const FINAL = Array.from({ length: NIGHTS }, (_, n) => {
  let direct = 0;
  let ota = 0;
  for (const s of STAYS) {
    if (n < s.from || n >= s.from + s.nights) continue;
    if (s.channel === "direct") direct++;
    else ota++;
  }
  return { direct, ota };
});

export const CAPACITY = NIGHTS * UNITS.length;
export const SOLD = FINAL.reduce((a, f) => a + f.direct + f.ota, 0);
export const SOLD_DIRECT = FINAL.reduce((a, f) => a + f.direct, 0);

/**
 * The stay each unit's plate reads: its longest of the fortnight.
 *
 * Derived rather than listed, so the plate cannot claim a stay STAYS does not
 * hold, and unique per unit by construction of the data, which the test pins:
 * a tie would make the plate's "longest" a coin toss, and it also moves the
 * hotspot, which is what keeps the eight touch targets apart (see board()).
 */
export const FEATURED: number[] = UNITS.map((_, unit) => {
  let best = -1;
  for (let i = 0; i < STAYS.length; i++) {
    if (STAYS[i].unit !== unit) continue;
    if (best < 0 || STAYS[i].nights > STAYS[best].nights) best = i;
  }
  return best;
});

/** What a plate says, in the order the hotspots are rendered. */
export const READOUTS = FEATURED.map((i, unit) => {
  const s = STAYS[i];
  return {
    kind: UNITS[unit].kind,
    nights: s.nights,
    channel: s.channel,
    from: dayNumber(s.from),
    to: dayNumber(s.from + s.nights - 1),
  };
});

/* -------------------------------- the loop ------------------------------- */

/** How far out the booking window opens, in days before the first night. */
export const LEAD = 60;

/** How much of the countdown a stay takes to land on the board. */
export const LANDING = 2.4;

export const INTRO = 1.8;
export const RUN = 32;
export const HOLD = 5.5;
export const FADE = 1.2;
export const CYCLE = INTRO + RUN + HOLD + FADE;

/**
 * Where the clock stands whenever the demo may not animate: the first frame
 * of the hold, which is the filled fortnight at full opacity.
 *
 * The same reasoning as floor.ts's STANDING_CYC, and the same reason it is the
 * FIRST frame of the hold rather than the last: parked on the last, a demo
 * scrolled into view would dip into the loop seam the moment it resumed.
 */
export const STANDING_CYC = INTRO + RUN;

export interface CycleFrame {
  /** Days before the fortnight opens. Counts down from LEAD to 0. */
  daysOut: number;
  /** 1 is the frame at full opacity; below that the loop seam is dipping. */
  fade: number;
}

export function cycleFrame(cycT: number): CycleFrame {
  let daysOut: number;
  if (cycT < INTRO) {
    daysOut = LEAD;
  } else if (cycT < INTRO + RUN) {
    daysOut = LEAD * (1 - (cycT - INTRO) / RUN);
  } else {
    daysOut = 0;
  }

  let fade = 1;
  const fadeStart = INTRO + RUN + HOLD;
  if (cycT >= fadeStart) fade = 1 - ((cycT - fadeStart) / FADE) * 0.85;
  else if (cycT < 0.5) fade = 0.15 + (cycT / 0.5) * 0.85;

  return { daysOut, fade };
}

/**
 * How much of a stay is on the board at `daysOut`: 0 before it is booked, 1
 * once it has landed. The bar wipes in over LANDING days of the countdown,
 * which is the whole arrival animation: a booking appears where it belongs
 * rather than flying in from somewhere it never was.
 */
export function landed(stay: Stay, daysOut: number): number {
  const u = (stay.booked - daysOut) / LANDING;
  return u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
}

/** Unit nights sold per night at `daysOut`, split by channel. A stay counts
    from the moment it starts landing, so the columns below the grid move with
    the bars above them rather than a beat behind. */
export function occupancyAt(daysOut: number): { direct: number; ota: number }[] {
  const out = Array.from({ length: NIGHTS }, () => ({ direct: 0, ota: 0 }));
  for (const s of STAYS) {
    if (daysOut > s.booked) continue;
    for (let n = s.from; n < s.from + s.nights; n++) {
      if (s.channel === "direct") out[n].direct++;
      else out[n].ota++;
    }
  }
  return out;
}

/** The share of the nights sold so far that came direct, as a percentage. */
export function directShareAt(daysOut: number): number {
  let direct = 0;
  let total = 0;
  for (const f of occupancyAt(daysOut)) {
    direct += f.direct;
    total += f.direct + f.ota;
  }
  return total === 0 ? 0 : Math.round((direct / total) * 100);
}

/* ------------------------------- the captions ---------------------------- */

/** Every caption the timeline can resolve to, and nothing it cannot. */
export const CAPTION_KEYS = ["opens", "weekend", "filling", "full"] as const;

export type CaptionKey = (typeof CAPTION_KEYS)[number];

/** The first weekend is complete at daysOut 38 and the second at 25, so the
    weekend caption covers the stretch where that is what a visitor is
    watching, and the fortnight's midweek fills under the last one. The hold
    and the reduced-motion frame are both daysOut 0, so both read "full": the
    words and the board can never disagree. */
export function captionKeyFor(daysOut: number): CaptionKey {
  if (daysOut > 46) return "opens";
  if (daysOut > 24) return "weekend";
  if (daysOut > 0) return "filling";
  return "full";
}

/* ------------------------------- the stage ------------------------------- */

const clampN = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export interface Bands {
  /** The header band's first baseline. */
  hy: number;
  gy0: number;
  gy1: number;
  gridH: number;
  lt: number;
  lb: number;
  height: number;
}

/**
 * Vertical layout as pixel bands derived from the measured width.
 *
 * Term for term the same arithmetic as floor.ts's bands(), and that is a
 * contract rather than a coincidence: demos.css carries ONE pre-hydration
 * height for .demo-canvas, written in container query units, and this demo
 * and Restaurante both mount in it. A composition of a different total height
 * would need its own rule in a stylesheet this bead does not own, so the
 * fortnight is composed into the same three bands instead: a header where
 * Restaurante has its clock strip, the board where it has its room, and the
 * occupancy columns where it has its covers line. fortnight.test.ts rebuilds
 * the stylesheet's formula and fails if the two ever part.
 */
export function bands(w: number, isPhone: boolean): Bands {
  const hy = 24;
  const gy0 = hy + 36; /* the gap holds the weekday letters and the dates */
  const gridH = isPhone
    ? clampN(w * 0.92, 330, 380)
    : clampN(w * 0.25, 188, 280);
  const gy1 = gy0 + gridH;
  const lt = gy1 + 34; /* clear gap between the board and the occupancy label */
  const loadH = isPhone
    ? clampN(w * 0.34, 110, 140)
    : clampN(w * 0.13, 118, 150);
  const lb = lt + loadH;
  return { hy, gy0, gy1, gridH, lt, lb, height: Math.round(lb + 22) };
}

export interface Board {
  /** The left gutter, where the unit numbers are drawn. */
  gutter: number;
  gx0: number;
  gx1: number;
  /** One night. */
  cw: number;
  gy0: number;
  gy1: number;
  /** One unit. */
  rh: number;
  /** A stay bar's height inside its row. */
  barH: number;
}

/**
 * The board's grid at a width and a plan.
 *
 * Both plans draw all fourteen nights as columns and all eight units as rows.
 * Transposing on the phone was the obvious narrow design and it is the wrong
 * one here: the occupancy band underneath reads left to right in nights, and a
 * board whose nights run down the page above a band whose nights run across it
 * asks the visitor to turn the picture over in their head. What the phone gets
 * instead is a taller board: the same fourteen columns at about 22px, which is
 * wider than a two digit date at 9px, and rows nearly twice the height of the
 * wide plan's, so a stay bar is a bar and not a hairline. No night is dropped
 * at any width, which is what the bead's stop-when is about.
 */
export function board(w: number, isPhone: boolean): Board {
  const b = bands(w, isPhone);
  const gutter = isPhone ? 24 : 30;
  const gx0 = gutter + 4;
  const gx1 = w * (isPhone ? 0.985 : 0.975);
  const rh = b.gridH / UNITS.length;
  return {
    gutter,
    gx0,
    gx1,
    cw: (gx1 - gx0) / NIGHTS,
    gy0: b.gy0,
    gy1: b.gy1,
    rh,
    barH: Math.min(rh * 0.72, isPhone ? 30 : 22),
  };
}

/** The rectangle a stay's bar occupies. */
export function stayRect(stay: Stay, bd: Board) {
  const x = bd.gx0 + stay.from * bd.cw;
  const y = bd.gy0 + stay.unit * bd.rh + (bd.rh - bd.barH) / 2;
  return { x: x + 1.5, y, w: stay.nights * bd.cw - 3, h: bd.barH };
}

/**
 * Where each unit's hotspot sits, as fractions of the board: the centre of the
 * stay its plate reads.
 *
 * The eight featured stays are spread across the fortnight on purpose. The
 * hotspots are 54px squares on the wide plan and 48px on the phone, and eight
 * rows in a 188px board are 23px apart, so two plates on neighbouring rows
 * would cover each other unless their stays are several nights apart.
 * fortnight.test.ts sweeps the widths and fails any pair that overlaps, which
 * is the only reason that spread is a fact about the data and not a hope.
 */
export function hotspotSpots(w: number, isPhone: boolean): { fx: number; fy: number }[] {
  const b = bands(w, isPhone);
  const bd = board(w, isPhone);
  return FEATURED.map((i) => {
    const s = STAYS[i];
    const r = stayRect(s, bd);
    return { fx: (r.x + r.w / 2) / w, fy: (r.y + r.h / 2) / b.height };
  });
}

/* The breakpoint is the stage's, since all three demos share one stylesheet. */
export { isPhonePlan, PHONE_MAX } from "./stage/plan";
