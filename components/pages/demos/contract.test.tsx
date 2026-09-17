// @vitest-environment jsdom
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { checks, failing, type Demo } from "./contract/checks";

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
 * written. Dropping any of them beside this file turns the run above red;
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
    const failed = failing(await load("./loopholes/CellarDemo.tsx"));
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

  it.each(["./loopholes/StringDemo.tsx", "./loopholes/ProduccionDemo.tsx"])(
    "fails %s, which no string can talk its way out of",
    async (path) => {
      const failed = failing(await load(path));
      expect(failed).toEqual(expect.arrayContaining([STANDS, CLOCK, WRITES, PLAN]));
    },
  );

  it("fails the s-4a6c Hospitalidad, an observer behind an alias", async () => {
    expect(failing(await load("./loopholes/HospitalidadDemo.tsx"))).toEqual(
      expect.arrayContaining([OBSERVER, STANDS]),
    );
  });

  it("passes the reference demo on every check, so the checks describe what ships", async () => {
    expect(failing(await load("./RestauranteDemo.tsx"))).toEqual([]);
  });
});
