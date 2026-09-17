import { htmlLang, type Locale } from "@/lib/i18n/config";

/**
 * One section's season, as numbers (bead hq-qd9jh): the fruit above, the
 * weather below, on one clock. SectionSeason.tsx draws it; this file owns
 * the data, the scrub arithmetic and the two layout plans, all pure, so
 * showcase.test.ts can pin the argument the visual makes without a browser.
 *
 * The argument is in the shape. Total acidity and Brix are what a lab sheet
 * carries for a section between veraison and pick. The daily high and low are
 * what the weather feed carries for the same section. Around day 19 the high
 * crosses the heat line for five days, and from two days into that run the
 * sugar climbs and the acid falls about twice as fast for a week, then both
 * settle. That is the reading a winemaker would make of a real season, and it
 * is what the reader is meant to see without a caption. It is also invented,
 * shaped rather than measured, which is what the honest label on the frame
 * says. No claim on the page rests on these numbers.
 *
 * Decoration lives here and not in a dictionary for the same reason the old
 * vintage comparison kept its values in the component: the shape IS the
 * reading, and it is the same in both locales.
 */

/** Days from veraison, 0 to DAYS - 1, one sample a day on every series. */
export const DAYS = 46;

/** Daily high, degrees C. Five days at or over the heat line from day 19. */
export const TMAX: readonly number[] = [
  31.5, 30, 32.2, 30.5, 31.6, 29.3, 30.8, 31.7, 29.9, 30.8, 29.3, 31.8, 30.1,
  30.9, 29.4, 31.1, 28.8, 30, 30.4, 36.4, 38.6, 40.1, 39.2, 36.8, 28.1, 29.7,
  30.7, 29.1, 28.7, 30.2, 28.1, 29.6, 30.5, 34.2, 28.2, 29.5, 28.8, 27.5, 29,
  29.8, 28.1, 29.3, 27.5, 28.6, 29.6, 27.7,
];

/** Daily low, degrees C. Nights stay warm through the run, which is what a
    real heat run does and what makes the band widen there. */
export const TMIN: readonly number[] = [
  17.3, 16, 16.6, 15.5, 17.4, 16.1, 16.7, 15.5, 16.8, 15.1, 16, 16.3, 15.5,
  16.7, 15.1, 16, 16.3, 14.6, 15.7, 19.5, 21.4, 22.9, 22.1, 20, 15.7, 16.3,
  15.1, 14.6, 15.6, 15.1, 14, 15.2, 15.7, 14.5, 15.4, 14, 14.8, 15.6, 14.1,
  14.9, 13.8, 15.4, 14.2, 14.9, 13.2, 14.4,
];

/** Brix. About 0.2 a day, 0.5 a day through the response week, 0.13 after. */
export const BRIX: readonly number[] = [
  13.6, 13.8, 13.9, 14.2, 14.5, 14.6, 14.8, 14.9, 15.3, 15.4, 15.6, 15.8, 16,
  16.1, 16.4, 16.6, 16.8, 17.1, 17.2, 17.4, 17.6, 17.7, 18.3, 18.9, 19.3, 19.8,
  20.3, 20.7, 21.3, 21.5, 21.6, 21.6, 21.9, 21.9, 22, 22.2, 22.4, 22.4, 22.6,
  22.7, 22.9, 23.1, 23.1, 23.3, 23.3, 23.6,
];

/** Total acidity, g/L as tartaric. The counter-curve: down 0.09 a day, 0.29
    through the response week, 0.06 after. */
export const ACID: readonly number[] = [
  10.96, 10.8, 10.75, 10.6, 10.58, 10.39, 10.36, 10.29, 10.16, 10.14, 9.96,
  9.92, 9.86, 9.67, 9.65, 9.61, 9.45, 9.34, 9.32, 9.14, 9.12, 9.07, 8.71, 8.4,
  8.17, 7.85, 7.5, 7.28, 7.03, 6.9, 6.9, 6.76, 6.75, 6.74, 6.59, 6.58, 6.46,
  6.5, 6.37, 6.36, 6.2, 6.21, 6.19, 6.05, 6.03, 5.91,
];

/** The heat line, degrees C: a high at or over it is a heat day, drawn as
    such. The area between the high and this line is filled, so a run reads
    at a glance and one warm day that stays under it does not. */
export const HEAT_LINE = 35;

export interface Run {
  start: number;
  end: number;
}

/** How many days after a run starts the fruit starts moving faster, and for
    how many days it keeps that pace. The test reads the data against these,
    and the drawing washes the same window in the fruit panel, joined to the
    run below it by a wash that leans to the right across the gap: the lean
    is the lag, drawn, so the reader sees "later" without a caption. */
export const LAG = 2;
export const RESPONSE = 7;

/** The days the fruit answers a heat run: LAG days after it starts, for
    RESPONSE days, inclusive at both ends like the run itself. */
export function responseOf(run: Run): Run {
  return { start: run.start + LAG, end: run.start + LAG + RESPONSE - 1 };
}

/** The axis of each panel, [low, high], with the ticks drawn on it. */
export const BRIX_RANGE = [12, 25] as const;
export const BRIX_TICKS = [14, 18, 22] as const;
export const ACID_RANGE = [5, 12] as const;
export const ACID_TICKS = [6, 8, 10] as const;
export const TEMP_RANGE = [10, 42] as const;
export const TEMP_TICKS = [15, 25, 35] as const;
export const DAY_TICKS = [0, 10, 20, 30, 40] as const;

/** Every maximal stretch of consecutive days whose high is at or over `line`. */
export function heatRuns(high: readonly number[], line: number): Run[] {
  const runs: Run[] = [];
  let open: Run | null = null;
  high.forEach((v, d) => {
    if (v >= line) {
      if (open) open.end = d;
      else {
        open = { start: d, end: d };
        runs.push(open);
      }
    } else {
      open = null;
    }
  });
  return runs;
}

/** The x of a day inside the plot box [x0, x1]. */
export function xOf(day: number, x0: number, x1: number): number {
  return x0 + (day / (DAYS - 1)) * (x1 - x0);
}

/** The nearest day to a pointer x, clamped to the season. NaN reads as the
    first day rather than as an index that is not one. */
export function dayAt(x: number, x0: number, x1: number): number {
  const t = (x - x0) / (x1 - x0);
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, Math.min(DAYS - 1, Math.round(t * (DAYS - 1))));
}

/** The y of a value inside a panel [y0, y1] on an axis [lo, hi]. */
export function yOf(v: number, [lo, hi]: readonly [number, number], y0: number, y1: number): number {
  return y1 - ((v - lo) / (hi - lo)) * (y1 - y0);
}

/**
 * The figure content width under which the phone plan applies. The
 * stylesheet's container query on the figure uses the same number (639px
 * and under), and the component decides its plan on the same box, the
 * figure's content box, so the two cannot disagree.
 */
export const PHONE_MAX = 640;

export interface Panel {
  y0: number;
  y1: number;
}

export interface Plan {
  phone: boolean;
  /** The canvas height in CSS pixels. home.css reserves the same number
      per plan as --ss-h, so nothing jumps when the effect first draws. */
  height: number;
  fruit: Panel;
  temp: Panel;
  /** Left and right gutters, for the tick labels of the two y axes. */
  gutter: { l: number; r: number };
}

/** The vertical plan, decided on the figure's content width. */
export function plan(figureWidth: number): Plan {
  const phone = figureWidth < PHONE_MAX;
  const top = phone ? 24 : 26;
  const fruitH = phone ? 212 : 236;
  const gap = phone ? 28 : 30;
  const tempH = phone ? 136 : 150;
  const axis = phone ? 28 : 30;
  const fruit = { y0: top, y1: top + fruitH };
  const temp = { y0: fruit.y1 + gap, y1: fruit.y1 + gap + tempH };
  return {
    phone,
    height: temp.y1 + axis,
    fruit,
    temp,
    gutter: phone ? { l: 36, r: 40 } : { l: 44, r: 48 },
  };
}

/** The plot box across a canvas of drawing width W. */
export function xRange(p: Plan, W: number): [number, number] {
  return [p.gutter.l, W - p.gutter.r];
}

/** One decimal, written the way the locale's tag writes it. The Spanish tag
    is es-MX, and Mexico writes the decimal with a point and the thousands
    with a comma, so both locales read 21.4 here; the comma decimal is
    Spain's, and a Mexican reader would misread 21,4 beside the peso prices
    on the same page. */
export function fmtOne(locale: Locale, value: number): string {
  return new Intl.NumberFormat(htmlLang[locale], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/** A whole number, for degrees. */
export function fmtInt(locale: Locale, value: number): string {
  return new Intl.NumberFormat(htmlLang[locale], {
    maximumFractionDigits: 0,
  }).format(value);
}
