import { describe, expect, it } from "vitest";
import { makeField, type FieldKind, type FieldState } from "./fieldKit";

/**
 * The loose animations, run against a recording context. Each must draw
 * something at a phone band and at a wide hero, hand the canvas only finite
 * numbers, paint nothing while it is warming up, and never leave the canvas
 * with a transparency or a clip it set for itself.
 */

function recorder(keepArcs = false) {
  const count: Record<string, number> = {};
  const bad: string[] = [];
  const arcs: number[][] = [];
  let depth = 0;
  const gradient = { addColorStop() {} };
  const target: Record<string, unknown> = { globalAlpha: 1 };
  const fns: Record<string, (...args: number[]) => unknown> = {};
  const fn = (prop: string) => {
    if (!fns[prop]) {
      fns[prop] = (...args: number[]) => {
        count[prop] = (count[prop] || 0) + 1;
        for (let i = 0; i < args.length; i++) {
          if (typeof args[i] === "number" && !Number.isFinite(args[i])) bad.push(prop + " got " + args[i]);
        }
        if (prop === "save") depth++;
        else if (prop === "restore") depth--;
        else if (keepArcs && prop === "arc") arcs.push([args[0], args[1]]);
        return prop === "createRadialGradient" || prop === "createLinearGradient" ? gradient : undefined;
      };
    }
    return fns[prop];
  };
  const ctx = new Proxy(target, {
    get: (t, prop: string) => (prop in t ? t[prop] : fn(prop)),
    set(t, prop: string, value) {
      t[prop] = value;
      return true;
    },
  });
  return {
    ctx: ctx as unknown as CanvasRenderingContext2D,
    painted: () => (count.fill || 0) + (count.stroke || 0) + (count.fillRect || 0),
    bad,
    arcs,
    alpha: () => target.globalAlpha as number,
    depth: () => depth,
  };
}

function state(W: number, H: number, behind: boolean): FieldState {
  const small = W < 700;
  return {
    W, H, t: 0, dt: 0, mx: 0.3, my: -0.2, px: W * 0.6, py: H * 0.4, rpx: W * 0.6, rpy: H * 0.4, pin: 1,
    fx: behind && !small ? W * 0.7 : W * 0.5, fy: H * 0.5, small, draw: true, dark: false,
    c: { agave: "#23664A", agaveRgb: [35, 102, 74], gold: "#9A6A12", goldRgb: [154, 106, 18], ground: "#F3EEDF" },
  };
}

const KINDS: FieldKind[] = ["rejilla", "vinedo", "hilos", "corrientes", "constelacion", "medanos"];
const SIZES: [string, number, number, boolean][] = [
  ["a phone band", 390, 190, true],
  ["a narrow phone band", 320, 230, false],
  ["a wide hero", 1440, 620, true],
  ["a wide band", 1920, 400, false],
  ["a tall scene", 900, 760, false],
];

describe("the loose animations", () => {
  for (const kind of KINDS) {
    for (const [label, W, H, behind] of SIZES) {
      it(kind + " draws on " + label + " with finite numbers and leaves the canvas clean", () => {
        const field = makeField(kind);
        const S = state(W, H, behind);
        const rec = recorder();
        field.init(S);
        // Warm up: the state advances and nothing is painted.
        S.draw = false;
        for (let i = 0; i < 40; i++) {
          S.dt = 1 / 30;
          S.t += S.dt;
          field.frame(rec.ctx, S);
        }
        expect(rec.painted()).toBe(0);

        S.draw = true;
        for (let i = 0; i < 120; i++) {
          S.dt = 1 / 60;
          S.t += S.dt;
          field.frame(rec.ctx, S);
        }
        expect(rec.painted()).toBeGreaterThan(0);
        expect(rec.bad.slice(0, 3)).toEqual([]);
        expect(rec.alpha()).toBe(1);
        expect(rec.depth()).toBe(0);
      });
    }
  }

  it("hands back a drawing of its own for every kind", () => {
    const stills = KINDS.map((kind) => makeField(kind).still);
    expect(stills.every((s) => Number.isFinite(s) && s > 0)).toBe(true);
    // Two kinds sharing one factory would share its still moment too.
    expect(new Set(KINDS.map((kind) => makeField(kind).frame.toString())).size).toBe(KINDS.length);
  });

  it("fills the farthest dune ridge to the foot of the canvas and no other", () => {
    const field = makeField("medanos");
    const S = state(1440, 420, false);
    const ys: number[] = [];
    const rec = recorder();
    const ctx = new Proxy(rec.ctx, {
      get(t, prop: string) {
        if (prop === "lineTo") return (_x: number, y: number) => void ys.push(y);
        return (t as unknown as Record<string, unknown>)[prop];
      },
      set(t, prop: string, value) {
        (t as unknown as Record<string, unknown>)[prop] = value;
        return true;
      },
    });
    field.init(S);
    S.dt = 1 / 60;
    S.t = 5;
    field.frame(ctx, S);
    // Two closing points per ridge, and only the first ridge reaches the foot.
    expect(ys.filter((y) => y >= S.H).length).toBe(2);
  });

  it("keeps every dot of the phone grid inside a band a little larger than the canvas", () => {
    const field = makeField("rejilla");
    const S = state(390, 190, true);
    const rec = recorder(true);
    field.init(S);
    for (let i = 0; i < 200; i++) {
      S.dt = 1 / 60;
      S.t += S.dt;
      field.frame(rec.ctx, S);
    }
    expect(rec.arcs.length).toBeGreaterThan(100);
    const outside = rec.arcs.filter(([x, y]) => x < -40 || x > 430 || y < -40 || y > 230);
    expect(outside.length).toBe(0);
  });
});
