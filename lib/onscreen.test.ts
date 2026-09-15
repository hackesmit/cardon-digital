import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";

import { clearsThreshold } from "./onscreen";

/**
 * The on-screen rule and its repo-wide enforcement (bead hq-3pfhe.6).
 *
 * Read @/lib/onscreen first. The short version: the reported defect, that a
 * callback storing entry.isIntersecting animates off a one pixel sliver, does
 * not reproduce in Chromium, which derives the flag from the threshold index.
 * Whether the other two engines agree is open (hq-2u86a): this box has no
 * Firefox or WebKit build, and a cross-vendor reviewer reads the spec the
 * other way. What IS settled in every reading is that the coupling breaks with
 * a threshold array starting at 0, where isIntersecting tracks the lowest
 * entry and reports true at 3 percent under an observer declaring 0.35.
 *
 * So the checks below fail the combination that is a bug under every reading,
 * and hold the line on new code, and do not demand that nine merged canvas
 * visuals be rewritten on the strength of a single-engine measurement.
 */

/* A plain filesystem path, not a URL: app/ holds directories such as
   [locale], and new URL() percent-encodes the brackets, so a URL walk cannot
   even stat them. */
const root = fileURLToPath(new URL("../", import.meta.url));

/**
 * Observers that read isIntersecting rather than calling clearsThreshold.
 *
 * Each declares a single scalar threshold, which in Chromium makes
 * isIntersecting threshold-aware and each of these callbacks correct as
 * written (state/review/s-0b4b/isintersecting-semantics3.mjs). That is one
 * engine, and hq-2u86a carries the open question of whether Firefox and WebKit
 * agree; if they do not, the visible consequence in those browsers is a
 * visual starting a little earlier than its threshold asked, which is why this
 * is a list rather than a blocker. components/site/Nav.tsx is deliberately NOT
 * here: it declares no threshold at all, where "any contact" is the whole
 * meaning and isIntersecting is exactly the right read. That exemption is
 * derived from the parsed options below rather than listed by hand, so it
 * lapses by itself the day someone gives that observer a threshold.
 *
 * What the list buys today: any of these that later grows a threshold array
 * fails, because that is the combination where isIntersecting stops meaning
 * what the callback wants under any reading of the spec.
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
 * Every `new IntersectionObserver(...)` in the repo, one row per observer.
 *
 * Parsed rather than grepped. A substring check is bypassable three ways at
 * once and a cross-vendor reviewer produced all three: a file-level match for
 * "clearsThreshold" passes a file whose callback never calls it (a string
 * constant is enough), a compliant file can hide a second broken observer
 * behind its compliant one, and `new window.IntersectionObserver` is not
 * found at all. The repo already depends on typescript, so the parser is free.
 */
interface ObserverSite {
  file: string;
  line: number;
  /** the callback reads `.isIntersecting` off something */
  readsIsIntersecting: boolean;
  /** the callback calls clearsThreshold(...) */
  callsClearsThreshold: boolean;
  /** the options argument declares `threshold: [...]` */
  thresholdIsArray: boolean;
  /** the options argument declares a threshold at all */
  declaresThreshold: boolean;
}

const observerSites = (): ObserverSite[] => {
  const out: ObserverSite[] = [];
  for (const file of sources) {
    const src = read(file);
    if (!src.includes("IntersectionObserver")) continue;
    const sf = ts.createSourceFile(
      file,
      src,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const named = (node: ts.Node) => {
      /* the constructed name, whatever it is qualified with */
      if (ts.isIdentifier(node)) return node.text;
      if (ts.isPropertyAccessExpression(node)) return node.name.text;
      return "";
    };
    const scan = (node: ts.Node, found: { ii: boolean; ct: boolean }) => {
      if (ts.isPropertyAccessExpression(node) && node.name.text === "isIntersecting") found.ii = true;
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "clearsThreshold"
      ) {
        found.ct = true;
      }
      ts.forEachChild(node, (c) => scan(c, found));
    };
    const visit = (node: ts.Node) => {
      if (ts.isNewExpression(node) && named(node.expression) === "IntersectionObserver") {
        const args = node.arguments ?? ([] as unknown as ts.NodeArray<ts.Expression>);
        const found = { ii: false, ct: false };
        if (args[0]) scan(args[0], found);
        let thresholdIsArray = false;
        let declaresThreshold = false;
        if (args[1] && ts.isObjectLiteralExpression(args[1])) {
          for (const prop of args[1].properties) {
            if (!ts.isPropertyAssignment(prop)) continue;
            if (prop.name.getText(sf).replace(/["']/g, "") !== "threshold") continue;
            declaresThreshold = true;
            thresholdIsArray = ts.isArrayLiteralExpression(prop.initializer);
          }
        }
        out.push({
          file,
          line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1,
          readsIsIntersecting: found.ii,
          callsClearsThreshold: found.ct,
          thresholdIsArray,
          declaresThreshold,
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return out;
};

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
  const sites = observerSites();
  const where = (o: ObserverSite) => o.file + ":" + o.line;

  it("still finds the observers it is checking", () => {
    /* the whole check is vacuous if the walk or the parse stops finding them */
    expect(sources.length).toBeGreaterThan(20);
    expect(sites.length).toBeGreaterThan(READS_ISINTERSECTING.length);
    /* and it finds the two this bead converted */
    expect(sites.filter((o) => o.callsClearsThreshold).map((o) => o.file).sort()).toEqual([
      "components/pages/demos/motion.ts",
      "components/site/Media.tsx",
    ]);
  });

  /** The one combination that is a bug under either reading of the spec. A
      scalar threshold makes isIntersecting threshold-aware in Chromium; a
      threshold array starting at 0 does not, in any engine, and then
      isIntersecting is true at any contact while the callback means the number
      at the top of the list. */
  it("has no observer reading isIntersecting behind a threshold list", () => {
    const bad = sites.filter((o) => o.readsIsIntersecting && o.thresholdIsArray);
    expect(
      bad.map(where),
      "a threshold array read through isIntersecting: call clearsThreshold from @/lib/onscreen",
    ).toEqual([]);
  });

  /** The ratchet on new code, per observer rather than per file, so a
      compliant file cannot carry a second broken observer. */
  it("lets no new observer read an entry for itself", () => {
    const escaped = sites.filter(
      (o) =>
        !o.callsClearsThreshold &&
        /* an observer with no threshold has no promise to keep: "any contact"
           is the whole policy and isIntersecting says exactly that */
        o.declaresThreshold &&
        !READS_ISINTERSECTING.includes(o.file),
    );
    expect(escaped.map(where).sort(), "call clearsThreshold from @/lib/onscreen").toEqual([]);
  });

  it("carries no listed file that has since been converted, so the list only shrinks", () => {
    const stale = READS_ISINTERSECTING.filter(
      (f) => !sites.some((o) => o.file === f && !o.callsClearsThreshold && o.declaresThreshold),
    );
    expect(stale, "converted or thresholdless: take these off READS_ISINTERSECTING").toEqual([]);
  });

  /* The two the reviews looked at, both now naming the threshold they keep. */
  it.each(["components/pages/demos/motion.ts", "components/site/Media.tsx"])(
    "%s gates every observer on clearsThreshold",
    (file) => {
      const mine = sites.filter((o) => o.file === file);
      expect(mine.length).toBeGreaterThan(0);
      for (const o of mine) {
        expect(o.callsClearsThreshold, where(o)).toBe(true);
        expect(o.readsIsIntersecting, where(o)).toBe(false);
      }
    },
  );
});
