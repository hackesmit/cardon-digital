// @vitest-environment jsdom
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { useEffect, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { checks, failing, type Demo } from "./contract/checks";
import { DemoFigure } from "./stage/DemoFigure";
import type { DemoScene } from "./stage/useDemoStage";

/**
 * Every demo in this directory, mounted and driven (bead hq-3pfhe.7).
 *
 * The checks are in ./contract/checks.tsx and the page they run on is
 * ./contract/world.tsx. This file only decides WHAT is checked: every .tsx
 * beside it, found by listing the directory, so a demo is under the contract
 * from the commit that adds it and nobody has to remember to register it.
 */

/* observeOnscreen is the one sanctioned way to an IntersectionObserver. The
   real function runs; this only marks the stack while it does, so the world
   can tell its observer from one a demo built for itself. */
vi.mock("./motion", async (original) => {
  const real = await original<typeof import("./motion")>();
  const { provenance } = await import("./contract/world");
  return {
    ...real,
    observeOnscreen: (...args: Parameters<typeof real.observeOnscreen>) => {
      provenance.depth++;
      try {
        return real.observeOnscreen(...args);
      } finally {
        provenance.depth--;
      }
    },
  };
});

const load = async (path: string): Promise<Demo> => {
  const mod = (await import(/* @vite-ignore */ path)) as { default?: Demo };
  if (typeof mod.default !== "function") throw new Error(path + " has no default export to mount");
  return mod.default;
};

const components = readdirSync(dirname(fileURLToPath(import.meta.url))).filter(
  (f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"),
);

describe("every demo component, mounted", () => {
  it("exists", () => expect(components.length).toBeGreaterThan(0));

  describe.each(components)("%s", (file) => {
    it.each(Object.keys(checks))("%s", async (name) => {
      checks[name](await load("./" + file));
    });
  });
});

/**
 * The reviewers' loophole components, verbatim from state/review/s-4a6c and
 * state/review/s-5836, each of which passed the whole suite when it was
 * written. They live in lib/testing/loopholes/demos, outside components/, because they
 * are not visuals and the visuals guard would adopt them. Dropping any of
 * them beside this file turns the run above red;
 * these are the same fact without the drop, so the checks cannot drift back
 * to describing one file.
 */
describe("the checks are load bearing", () => {
  const OBSERVER = "learns it is on screen from observeOnscreen and builds no observer of its own";
  const FROZEN = "starts its loop when reduced motion is turned off on a page loaded under it";
  const CLOCK = "tells the story from the top, parks on the standing frame, and resumes from it";
  const WRITES = "rewrites nothing whose box is not held open by ghosts";
  const LIVE = "keeps every live region inside a ghost box";
  const NOSCRIPT =
    "leaves prose, the honest label and the readout with scripting off, and nothing to operate";
  const PLAN = "decides its plan on the fractional layout box and draws at the layout width";
  const STANDS = "stands on a drawn frame, and under reduced motion that frame never moves";

  it("fails the s-5836 cellar on each of the five things it does", async () => {
    const failed = failing(await load("../../../lib/testing/loopholes/demos/CellarDemo.tsx"));
    /* an observer reached as window["Intersection" + "Observer"], frozen for
       life, the clock backwards on resume, the covers span written through
       firstChild.nodeValue and the selection row with no ghosts, a live
       region outside a box, twelve hotspots and the hint left on the page */
    expect(failed).toEqual(
      expect.arrayContaining([OBSERVER, FROZEN, CLOCK, WRITES, LIVE, NOSCRIPT]),
    );
    /* it measures the way the reference does, and the check agrees: the
       failures above are the behaviours, not the fixture's shape */
    expect(failed).not.toContain(PLAN);
  });

  it.each(["../../../lib/testing/loopholes/demos/StringDemo.tsx", "../../../lib/testing/loopholes/demos/ProduccionDemo.tsx"])(
    "fails %s, which no string can talk its way out of",
    async (path) => {
      const failed = failing(await load(path));
      expect(failed).toEqual(expect.arrayContaining([STANDS, CLOCK, WRITES, PLAN]));
    },
  );

  it("fails the s-4a6c Hospitalidad, an observer behind an alias", async () => {
    expect(failing(await load("../../../lib/testing/loopholes/demos/HospitalidadDemo.tsx"))).toEqual(
      expect.arrayContaining([OBSERVER, STANDS]),
    );
  });

  /* Two demos that use the mechanism faithfully and still should not pass,
     found by the cross-vendor review of this harness. */
  const scene = (draw: DemoScene["draw"]): DemoScene => ({
    hue: "primary",
    clock: { cycle: 10, standing: 5 },
    height: () => 100,
    layout: () => {},
    draw,
    live: [
      { name: "caption", values: { a: "a", b: "b" }, keys: ["a", "b"], initial: "a", at: (t) => (t < 5 ? "a" : "b") },
    ],
  });
  const figure = (s: DemoScene, children?: React.ReactNode) => (
    <DemoFigure demo="fixture" scene={s} title="t" honest="vista ilustrativa, no son datos de cliente" fallback="prose">
      {children}
    </DemoFigure>
  );

  it("fails a board that sets styles and paints nothing", () => {
    const blank = scene((env, t) => {
      env.ctx.fillStyle = t >= 5 && t < 6.1 ? "standing" : String(t);
    });
    const painted = scene((env, t) => {
      env.ctx.fillStyle = t >= 5 && t < 6.1 ? "standing" : String(t);
      env.ctx.fillRect(0, 0, 10, 10);
    });
    expect(failing(() => figure(blank))).toEqual(expect.arrayContaining([STANDS, CLOCK]));
    /* the same scene with one rectangle in it passes both, so it is the
       missing paint the checks object to */
    const ok = failing(() => figure(painted));
    expect(ok).not.toContain(STANDS);
    expect(ok).not.toContain(CLOCK);
  });

  it("fails a button that only exists once an effect has run", () => {
    const s = scene((env) => env.ctx.fillRect(0, 0, 10, 10));
    function Late() {
      const [on, setOn] = useState(false);
      useEffect(() => setOn(true), []);
      return on ? <button type="button">late</button> : null;
    }
    const failed = failing(() => figure(s, <Late />));
    expect(failed).toContain("mounts nothing operable that the noscript rule does not name");
    /* the static render cannot see it, which is why the mounted check exists */
    expect(failed).not.toContain(NOSCRIPT);
  });

  it("passes the reference demo on every check, so the checks describe what ships", async () => {
    expect(failing(await load("./RestauranteDemo.tsx"))).toEqual([]);
  });
});
