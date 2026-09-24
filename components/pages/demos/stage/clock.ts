/**
 * The loop's clock, shared by the three module demos (bead hq-3pfhe.7).
 *
 * A demo does not own its clock. It is handed the clock's reading, once per
 * frame, as the argument of its draw function, and that is all it ever sees of
 * it: there is no setter, no reset and no flag to reach. That is the whole
 * design. The rules this replaces were each broken by a component that owned
 * the variable the rule was about:
 *
 *   - round two drew its standing frame behind the clock's back, so scrolling
 *     away at 18:10 snapped the board to 19:55 and scrolling back read 18:10
 *     again (reviewer s-3b55);
 *   - the fix parked the clock at mount, so the first thing a visitor saw was
 *     the ending, held still for five and a half seconds (reviewer s-4a6c);
 *   - the fix for that was a never-ran flag, and the s-5836 loophole demo
 *     reset the flag in stop(), so every resume was a first run and the clock
 *     read 19:55, then 17:00, with every lexical check green.
 *
 * What it guarantees, to any caller:
 *
 *   1. It stands on `standing` until it is started and whenever it is parked.
 *      The standing frame is a frame OF the loop, the first frame of the hold.
 *   2. The first start() tells the story from the top. Every later one is a
 *      resume, and a resume carries on from `standing`.
 *   3. Between a start and the next park it only moves forward, and wraps at
 *      `cycle`. A negative step is ignored rather than applied.
 *
 * Pure: no DOM, no timers, no frames. ./useDemoStage.ts drives it.
 */

export interface ClockSpec {
  /** Seconds in one loop. */
  cycle: number;
  /** Where the loop stands when it may not run: the first frame of its hold. */
  standing: number;
}

export interface DemoClock {
  /** Start or resume. Does nothing while already running. */
  start(): void;
  /** Stop, and stand on the standing frame. */
  park(): void;
  /** Move `dt` seconds on, if running, and return the reading. */
  advance(dt: number): number;
  read(): number;
  running(): boolean;
}

export function createClock(spec: ClockSpec): DemoClock {
  const { cycle, standing } = spec;
  if (!(cycle > 0) || !(standing >= 0) || !(standing < cycle)) {
    throw new Error("a demo clock needs 0 <= standing < cycle, got " + standing + " and " + cycle);
  }
  let t = standing;
  let ran = false;
  let on = false;
  return {
    start() {
      if (on) return;
      on = true;
      if (!ran) {
        ran = true;
        t = 0;
      }
    },
    park() {
      on = false;
      t = standing;
    },
    advance(dt) {
      if (!on || !(dt > 0)) return t;
      t += dt;
      if (t >= cycle) t %= cycle;
      return t;
    },
    read: () => t,
    running: () => on,
  };
}
