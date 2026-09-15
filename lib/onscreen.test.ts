import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { clearsThreshold } from "./onscreen";

/**
 * The on-screen rule and its repo-wide enforcement (bead hq-3pfhe.6).
 *
 * Read @/lib/onscreen first: the reported defect, that a callback storing
 * entry.isIntersecting animates off a one pixel sliver, does not reproduce,
 * because the spec and Chromium both set isIntersecting from the threshold
 * index. What IS real is that the coupling holds only for a single scalar
 * threshold: with a threshold array starting at 0, isIntersecting tracks the
 * lowest entry and reports true at 3 percent under an observer declaring 0.35.
 *
 * The two checks below follow that, and only that. Every observer on the site
 * declares a scalar threshold today, so every one of them is correct as
 * written; a list demanding nine correct files be rewritten would be
 * make-work. What cannot be allowed to appear is the combination that IS a
 * bug, a threshold array read through isIntersecting, and that is what the
 * ratchet fails. The demos and the video slot additionally go through
 * clearsThreshold so the reference implementations say what they keep.
 */

/* A plain filesystem path, not a URL: app/ holds directories such as
   [locale], and new URL() percent-encodes the brackets, so a URL walk cannot
   even stat them. */
const root = fileURLToPath(new URL("../", import.meta.url));

/**
 * Observers that read isIntersecting rather than calling clearsThreshold.
 *
 * Every one declares a single scalar threshold, which makes isIntersecting
 * threshold-aware and each of these callbacks correct as written (measured in
 * state/review/s-0b4b/isintersecting-semantics3.mjs). They are listed so the
 * ratchet below can tell an existing reading from a new one, not because they
 * are defects: rewriting nine reviewed canvas visuals to change no behaviour
 * is not work worth doing. components/site/Nav.tsx is here too, declaring no
 * threshold at all, where "any contact" is the whole meaning.
 *
 * What the list buys: any of these that later grows a threshold array fails,
 * because that is the combination where isIntersecting stops meaning what the
 * callback wants.
 */
const READS_ISINTERSECTING = [
  "components/pages/case/BerryToBottle.tsx",
  "components/pages/case/PlayOnceVis.tsx",
  "components/pages/case/VineyardMap.tsx",
  "components/pages/home/HeroAssembly.tsx",
  "components/pages/home/PlayOnceVis.tsx",
  "components/pages/home/SectorMap.tsx",
  "components/pages/winery/AssistantDemo.tsx",
  "components/pages/winery/VineField.tsx",
  "components/site/Nav.tsx",
  "components/site/Reveal.tsx",
];

const sources = (() => {
  const out: string[] = [];
  const walk = (rel: string) => {
    for (const name of readdirSync(join(root, rel))) {
      if (name === "node_modules" || name.startsWith(".")) continue;
      const child = rel + name;
      if (statSync(join(root, child)).isDirectory()) {
        walk(child + "/");
      } else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) {
        out.push(child);
      }
    }
  };
  for (const top of ["app/", "components/", "lib/"]) walk(top);
  return out;
})();

const read = (rel: string) => readFileSync(join(root, rel), "utf8");

/**
 * The same file with its comments removed.
 *
 * These checks are lexical, and every file the rule touches now explains the
 * rule in prose, naming isIntersecting in the sentence that says not to read
 * it. Checking the raw text would fail the fixed files for describing their own
 * fix, and would pass a broken file that had commented the line out. Line
 * comments are only stripped where they start a line, so a URL in a string
 * survives.
 */
const code = (rel: string) =>
  read(rel)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

describe("clearsThreshold, the one reading of an observer entry", () => {
  const entry = (intersectionRatio: number, isIntersecting = intersectionRatio > 0) => ({
    isIntersecting,
    intersectionRatio,
  });

  it.each([
    /* ratio, threshold, on screen */
    [0, 0.12, false],
    [0.0001, 0.12, false],
    [0.119, 0.12, false],
    [0.12, 0.12, true],
    [1, 0.12, true],
    [0.34, 0.35, false],
    [0.35, 0.35, true],
  ] as const)("ratio %s against threshold %s is %s", (ratio, threshold, on) => {
    expect(clearsThreshold(entry(ratio), threshold)).toBe(on);
  });

  it("is false whenever the entry is not intersecting at all", () => {
    expect(clearsThreshold(entry(0, false), 0)).toBe(false);
    /* a ratio a stale entry still carries cannot outvote isIntersecting */
    expect(clearsThreshold({ isIntersecting: false, intersectionRatio: 1 }, 0.12)).toBe(false);
  });

  it("keeps the natural meaning of a zero threshold, any contact at all", () => {
    /* a zero-area target intersects with a ratio of 0, per spec */
    expect(clearsThreshold(entry(0, true), 0)).toBe(true);
  });
});

describe("every IntersectionObserver in the repo keeps its threshold", () => {
  const observers = sources.filter((f) => code(f).includes("new IntersectionObserver"));

  it("still finds the files it is checking", () => {
    /* the whole check is vacuous if the walk stops finding source */
    expect(sources.length).toBeGreaterThan(20);
    expect(observers.length).toBeGreaterThan(READS_ISINTERSECTING.length);
  });

  /** The one combination that is a live bug. A scalar threshold makes
      isIntersecting threshold-aware; a threshold array starting at 0 does not,
      and then isIntersecting is true at any contact while the callback means
      the number at the top of the list. */
  it.each(observers)("%s does not read isIntersecting behind a threshold list", (file) => {
    const src = code(file);
    if (!src.includes("isIntersecting")) return;
    const lists = Array.from(src.matchAll(/threshold\s*:\s*\[([^\]]*)\]/g));
    expect(
      lists.map((m) => m[1].trim()),
      "a threshold array read through isIntersecting: call clearsThreshold from @/lib/onscreen",
    ).toEqual([]);
  });

  /** The ratchet on new code. An observer that reads the entry for itself has
      to be one of the ones that already did; anything new comes through
      clearsThreshold, which is the house reading. */
  it("lets no new observer read an entry for itself", () => {
    const escaped = observers.filter(
      (f) => !code(f).includes("clearsThreshold") && !READS_ISINTERSECTING.includes(f),
    );
    expect(escaped.sort(), "call clearsThreshold from @/lib/onscreen").toEqual([]);
  });

  it("carries no listed file that has since been converted, so the list only shrinks", () => {
    const stale = READS_ISINTERSECTING.filter((f) => !code(f).includes("isIntersecting"));
    expect(stale, "converted: take these off READS_ISINTERSECTING").toEqual([]);
  });

  /* The two the reviews looked at, both now naming the threshold they keep:
     the demo loop and the video slot. Named rather than derived, so deleting
     the call from either one is a failure and not just a file dropping out of
     a filter. */
  it.each(["components/pages/demos/motion.ts", "components/site/Media.tsx"])(
    "%s gates on clearsThreshold",
    (file) => {
      const src = code(file);
      expect(src).toContain("clearsThreshold");
      expect(src).not.toContain("isIntersecting");
    },
  );
});
