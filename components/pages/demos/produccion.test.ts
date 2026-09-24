import { describe, expect, it } from "vitest";
import { produccionScene } from "./ProduccionDemo";
import { CYCLE, bands, isPhonePlan } from "./cellar";
import { demos } from "../../../lib/i18n/demos";
import type { DemoPalette } from "./palette";
import type { StageEnv } from "./stage/useDemoStage";

/**
 * The Produccion scene's draw, judged at widths a browser reaches and the
 * mounted contract cannot fail on (bead hq-3pfhe.2, round one).
 *
 * ./contract.test.tsx mounts every demo against a recording context, which
 * writes down whatever it is handed and never objects: that is the right tool
 * for asking WHAT a demo drew, and it is why a real defect got through. In a
 * browser, a container collapsed to zero width made layout() derive negative
 * tank widths, rr() clamp the corner radius to a negative number, and Chromium
 * throw IndexSizeError from arcTo thirty-two times in a second while the
 * reference demo threw none (reviewer, 2026-09-24). So the context below is
 * the spec's: it refuses a negative radius the way the platform does, and it
 * refuses a coordinate that is not a finite number, which is the same class of
 * defect one step earlier. draw() has to be total over its inputs.
 */

class SpecViolation extends Error {}

/** The calls whose numeric arguments are all required to be finite. */
const GEOMETRY = new Set([
  "moveTo", "lineTo", "arc", "arcTo", "rect", "fillRect", "clearRect", "strokeRect",
  "fillText", "strokeText", "ellipse", "quadraticCurveTo", "bezierCurveTo",
]);

/** A 2d context that enforces what Chromium enforces, and nothing else. */
function strictCtx(): { ctx: CanvasRenderingContext2D; calls: number } {
  const state: Record<string, unknown> = { font: "10px monospace" };
  const seen = { ctx: null as unknown as CanvasRenderingContext2D, calls: 0 };
  const fontPx = () => {
    const m = /(\d+(?:\.\d+)?)px/.exec(String(state.font ?? ""));
    return m ? Number(m[1]) : 10;
  };
  const api: Record<string, (...args: never[]) => unknown> = {};
  const call = (k: string, args: number[]) => {
    seen.calls++;
    if (GEOMETRY.has(k)) {
      for (const a of args) {
        if (typeof a === "number" && !Number.isFinite(a)) {
          throw new SpecViolation(k + " got " + a);
        }
      }
    }
    /* IndexSizeError: the radius of an arc, an arcTo or an ellipse is never
       negative, and a negative one is a throw, not a no-op. */
    if (k === "arc" && args[2] < 0) throw new SpecViolation("IndexSizeError: arc r=" + args[2]);
    if (k === "arcTo" && args[4] < 0) throw new SpecViolation("IndexSizeError: arcTo r=" + args[4]);
    if (k === "ellipse" && (args[2] < 0 || args[3] < 0)) {
      throw new SpecViolation("IndexSizeError: ellipse");
    }
    if (k === "measureText") {
      /* a real width, so the label's own anchoring is exercised rather than
         collapsed to a point the way the recording context collapses it */
      return { width: String(args[0] ?? "").length * fontPx() * 0.6 };
    }
    return undefined;
  };
  const ctx = new Proxy(state, {
    get(t, k) {
      if (typeof k !== "string") return undefined;
      if (k in t) return t[k];
      return (api[k] ??= (...args: never[]) => call(k, args as unknown as number[]));
    },
    set(t, k, v) {
      if (typeof k === "string") t[k] = v;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  seen.ctx = ctx;
  return seen;
}

/** Palette fields are colour strings and rgb triples; the scene never does
    arithmetic on them, so any consistent set exercises the same draw. */
const PAL = new Proxy(
  { dark: false },
  {
    get(t, k) {
      if (k === "dark") return false;
      return typeof k === "string" && k.endsWith("Rgb") ? [40, 90, 70] : "#2E7D5C";
    },
  },
) as unknown as DemoPalette;

const env = (W: number): StageEnv => {
  const phone = isPhonePlan(W);
  const { ctx } = strictCtx();
  return { ctx, W, H: bands(W, phone).height, phone, pal: PAL, selection: 0 };
};

describe("the scene draws at every width the stage can hand it", () => {
  /* 1 is what a collapsed container measures: the stage floors the drawing
     width there (useDemoStage.resize), so it is the narrowest board that can
     exist, and 0 is the same case one pixel meaner. */
  const WIDTHS = [0, 1, 2, 3, 8, 24, 60, 180, 327, 375, 480, 640, 900, 1280];

  it.each(WIDTHS)("throws nothing at %ipx, across a whole cycle", (W) => {
    const scene = produccionScene(demos.es.produccion);
    const e = env(W);
    scene.layout(e);
    for (let t = 0; t <= CYCLE; t += 0.25) scene.draw(e, t);
    /* and the two frames a still board shows */
    scene.draw(e, scene.clock.standing);
    expect(e.W).toBe(W);
  });

  it("keeps drawing after the width collapses and comes back", () => {
    /* The case the reviewer ran: a demo in an auto grid track, or a tab that
       is hidden and shown. The board is re-laid at each width, which is what
       the stage does, and no width may poison the next. */
    const scene = produccionScene(demos.en.produccion);
    for (const W of [1280, 1, 1280, 0, 327, 1]) {
      const e = env(W);
      scene.layout(e);
      scene.draw(e, scene.clock.standing);
      scene.draw(e, 12);
    }
    expect(true).toBe(true);
  });

  it("puts every hotspot on the board it just laid out", () => {
    /* A width of zero divides, and a hotspot at 0/0 is NaN, which React would
       write into a style attribute as "NaN%". */
    const scene = produccionScene(demos.es.produccion);
    for (const W of [0, 1, 327, 1280]) {
      const e = env(W);
      scene.layout(e);
      for (const h of scene.hotspots!(e)) {
        expect(Number.isFinite(h.fx), "fx at " + W).toBe(true);
        expect(Number.isFinite(h.fy), "fy at " + W).toBe(true);
      }
    }
  });
});
