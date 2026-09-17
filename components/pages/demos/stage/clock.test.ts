import { describe, expect, it } from "vitest";
import { createClock } from "./clock";

/**
 * The shared clock (bead hq-3pfhe.7). Each test is a defect a demo shipped
 * while it owned its own clock; see ./clock.ts for the three of them.
 */
describe("the demo clock", () => {
  const spec = { cycle: 38.5, standing: 31.8 };
  const run = (c: ReturnType<typeof createClock>, seconds: number) => {
    const seen: number[] = [];
    for (let s = 0; s < seconds; s += 0.033) seen.push(c.advance(0.033));
    return seen;
  };

  it("stands on the standing frame before it has ever run", () => {
    const c = createClock(spec);
    expect(c.read()).toBe(spec.standing);
    expect(c.running()).toBe(false);
    /* and time does not pass for a clock nobody started */
    expect(c.advance(1)).toBe(spec.standing);
  });

  it("tells the story from the top on its first start", () => {
    const c = createClock(spec);
    c.start();
    expect(c.read()).toBe(0);
    const seen = run(c, 3);
    expect(seen[0]).toBeGreaterThan(0);
    expect(seen[seen.length - 1]).toBeLessThan(spec.standing);
  });

  it("parks on the standing frame and resumes from it, never from the top again", () => {
    const c = createClock(spec);
    c.start();
    run(c, 9);
    for (let pause = 0; pause < 5; pause++) {
      c.park();
      expect(c.read()).toBe(spec.standing);
      c.start();
      /* the s-5836 fixture read 0 here, on every resume */
      expect(c.read()).toBe(spec.standing);
      let previous = c.read();
      for (const t of run(c, spec.cycle - spec.standing - 0.1)) {
        expect(t).toBeGreaterThanOrEqual(previous);
        previous = t;
      }
    }
  });

  it("only wraps at the seam, and lands at the top of the next cycle", () => {
    const c = createClock(spec);
    c.start();
    let previous = 0;
    let wraps = 0;
    for (const t of run(c, spec.cycle * 2.5)) {
      if (t < previous) {
        wraps++;
        expect(previous).toBeGreaterThan(spec.cycle - 0.04);
        expect(t).toBeLessThan(0.04);
      }
      previous = t;
    }
    expect(wraps).toBe(2);
  });

  it("cannot be pushed backwards", () => {
    const c = createClock(spec);
    c.start();
    c.advance(4);
    expect(c.advance(-3)).toBe(4);
    expect(c.advance(Number.NaN)).toBe(4);
  });

  it("a second start while running changes nothing", () => {
    const c = createClock(spec);
    c.start();
    c.advance(4);
    c.start();
    expect(c.read()).toBe(4);
  });

  it("has nothing on it that resets the first run", () => {
    expect(Object.keys(createClock(spec)).sort()).toEqual(
      ["advance", "park", "read", "running", "start"],
    );
  });

  it.each([
    { cycle: 0, standing: 0 },
    { cycle: 10, standing: 10 },
    { cycle: 10, standing: -1 },
  ])("refuses %o", (bad) => {
    expect(() => createClock(bad)).toThrow();
  });
});
