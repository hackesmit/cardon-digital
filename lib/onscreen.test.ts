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
 * It is a count per file rather than a set of filenames, because a filename
 * exemption covers observers that do not exist yet: a listed file could add a
 * second reading and be waved through (cross-vendor review, round three).
 * The count is checked for equality, so converting one without updating the
 * number fails too, and the number can only fall.
 *
 * What the list buys today: any of these that later grows a threshold array
 * fails, because that is the combination where isIntersecting stops meaning
 * what the callback wants under any reading of the spec.
 */
const READS_ISINTERSECTING: Record<string, number> = {
  "components/pages/case/BerryToBottle.tsx": 2,
  "components/pages/case/PlayOnceVis.tsx": 1,
  "components/pages/case/VineyardMap.tsx": 1,
  "components/pages/home/HeroAssembly.tsx": 1,
  "components/pages/home/PlayOnceVis.tsx": 1,
  "components/pages/home/SectorMap.tsx": 1,
  "components/pages/winery/AssistantDemo.tsx": 1,
  "components/pages/winery/VineField.tsx": 1,
  "components/site/Reveal.tsx": 1,
};

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
  /** an options argument was passed that this check could not read: a
      variable, a spread, a call. Never treated as thresholdless. */
  optionsUnresolved: boolean;
}

/** The observer sites in one file's source. Separate from the walk so a
    fixture can be checked without being on disk. */
const sitesIn = (file: string, src: string): ObserverSite[] => {
  const out: ObserverSite[] = [];
  if (!src.includes("IntersectionObserver")) return out;
  {
    const sf = ts.createSourceFile(
      file,
      src,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );
    const named = (node: ts.Node): string => {
      /* the constructed name, however it is reached: IntersectionObserver,
         window.IntersectionObserver, window["IntersectionObserver"] */
      if (ts.isIdentifier(node)) return node.text;
      if (ts.isPropertyAccessExpression(node)) return node.name.text;
      if (ts.isElementAccessExpression(node)) {
        const arg = node.argumentExpression;
        return ts.isStringLiteralLike(arg) ? arg.text : "";
      }
      return "";
    };
    /* Every identifier this file binds to the constructor, so an alias is a
       site too: const IO = window.IntersectionObserver; new IO(cb, {
       threshold: [0, 0.35] }) with cb reading isIntersecting walked past a
       check that only knew the name at the new expression (reviewer s-4a6c,
       non-blocking). Plain bindings and destructuring, chased until the set
       stops growing; not a type checker, so an alias reached through a call
       or a parameter is still invisible, which is why demos.test.ts
       additionally forbids a demo component from naming the constructor at
       all. */
    const aliases = new Set<string>(["IntersectionObserver"]);
    const isAlias = (node: ts.Node) => aliases.has(named(node));
    let grew = true;
    const collect = (node: ts.Node) => {
      if (ts.isVariableDeclaration(node) && node.initializer) {
        if (ts.isIdentifier(node.name) && isAlias(node.initializer) && !aliases.has(node.name.text)) {
          aliases.add(node.name.text);
          grew = true;
        }
        if (ts.isObjectBindingPattern(node.name)) {
          for (const el of node.name.elements) {
            const prop = el.propertyName
              ? el.propertyName.getText(sf).replace(/["']/g, "")
              : ts.isIdentifier(el.name)
                ? el.name.text
                : "";
            if (prop === "IntersectionObserver" && ts.isIdentifier(el.name) && !aliases.has(el.name.text)) {
              aliases.add(el.name.text);
              grew = true;
            }
          }
        }
      }
      ts.forEachChild(node, collect);
    };
    while (grew) {
      grew = false;
      collect(sf);
    }
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
      if (ts.isNewExpression(node) && isAlias(node.expression)) {
        const args = node.arguments ?? ([] as unknown as ts.NodeArray<ts.Expression>);
        const found = { ii: false, ct: false };
        if (args[0]) scan(args[0], found);
        let thresholdIsArray = false;
        let declaresThreshold = false;
        let optionsUnresolved = false;
        if (args[1]) {
          if (ts.isObjectLiteralExpression(args[1])) {
            for (const prop of args[1].properties) {
              if (!ts.isPropertyAssignment(prop)) {
                /* a spread or a shorthand: the threshold could be in there */
                optionsUnresolved = true;
                continue;
              }
              if (prop.name.getText(sf).replace(/["']/g, "") !== "threshold") continue;
              declaresThreshold = true;
              if (ts.isArrayLiteralExpression(prop.initializer)) {
                thresholdIsArray = true;
              } else if (!ts.isNumericLiteral(prop.initializer)) {
                /* a named constant is fine and common, but this check cannot
                   see whether it is an array */
                optionsUnresolved = true;
              }
            }
          } else {
            /* options passed as a variable or a call: unreadable from here,
               and the permissive branch below must not claim it is
               thresholdless (cross-vendor review, round three) */
            optionsUnresolved = true;
          }
        }
        out.push({
          file,
          line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1,
          readsIsIntersecting: found.ii,
          callsClearsThreshold: found.ct,
          thresholdIsArray,
          declaresThreshold,
          optionsUnresolved,
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return out;
};

const observerSites = (): ObserverSite[] =>
  sources.flatMap((file) => sitesIn(file, read(file)));

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

describe("an observer is found however its constructor is spelled", () => {
  const site = (src: string) => sitesIn("components/pages/demos/Fixture.tsx", src);

  it.each([
    ["the bare name", "new IntersectionObserver(cb, { threshold: [0, 0.35] })"],
    ["window.", "new window.IntersectionObserver(cb, { threshold: [0, 0.35] })"],
    ["an element access", 'new window["IntersectionObserver"](cb, { threshold: [0, 0.35] })'],
    ["an alias", "const IO = window.IntersectionObserver; new IO(cb, { threshold: [0, 0.35] })"],
    ["an alias of an alias", "const A = IntersectionObserver; const B = A; new B(cb, { threshold: [0, 0.35] })"],
    ["a destructured alias", "const { IntersectionObserver: Obs } = window; new Obs(cb, { threshold: [0, 0.35] })"],
    ["a destructured name", "const { IntersectionObserver } = window; new IntersectionObserver(cb, { threshold: [0, 0.35] })"],
  ])("through %s", (_how, expr) => {
    const src = "const cb = (es) => { x = es[es.length - 1].isIntersecting; };\n" + expr + ";\n";
    const found = site(src);
    expect(found).toHaveLength(1);
    expect(found[0].readsIsIntersecting).toBe(false);
    expect(found[0].thresholdIsArray).toBe(true);
  });

  /* the s-4a6c loophole verbatim: the callback is inline, so the reading is
     seen, and the threshold is a list, so this is the combination the
     repo-wide check below rejects */
  it("finds the s-4a6c aliased observer and reads its callback", () => {
    const found = site(
      "const IO = window.IntersectionObserver;\n" +
        "const io = new IO((es) => { el.dataset.on = String(es[es.length - 1].isIntersecting); }, { threshold: [0, 0.35] });\n",
    );
    expect(found).toHaveLength(1);
    expect(found[0].readsIsIntersecting).toBe(true);
    expect(found[0].thresholdIsArray).toBe(true);
  });

  it("does not mistake an unrelated constructor for one", () => {
    expect(site("const RO = ResizeObserver; new RO(cb); IntersectionObserver;")).toHaveLength(0);
  });
});

describe("every IntersectionObserver in the repo keeps its threshold", () => {
  const sites = observerSites();
  const where = (o: ObserverSite) => o.file + ":" + o.line;

  it("still finds the observers it is checking", () => {
    /* the whole check is vacuous if the walk or the parse stops finding them */
    expect(sources.length).toBeGreaterThan(20);
    expect(sites.length).toBeGreaterThan(Object.keys(READS_ISINTERSECTING).length);
    /* and it finds the two this bead converted. A containment check, not an
       equality one: a new compliant observer must be able to land without
       failing the test that exists to encourage it. */
    const converted = sites.filter((o) => o.callsClearsThreshold).map((o) => o.file);
    expect(converted).toContain("components/pages/demos/motion.ts");
    expect(converted).toContain("components/site/Media.tsx");
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

  /** Compliance, per observer. Calling the helper is not enough: a callback
      can call it, drop the result and go on reading isIntersecting, which is
      exactly the behaviour the check exists to stop (cross-vendor review,
      round three). So a compliant observer calls clearsThreshold AND does not
      read isIntersecting at all. */
  const compliant = (o: ObserverSite) => o.callsClearsThreshold && !o.readsIsIntersecting;

  /** An observer with no threshold has no promise to keep: "any contact" is
      the whole policy and isIntersecting says exactly that. An options
      argument this check could not read is NOT thresholdless. */
  const thresholdless = (o: ObserverSite) => !o.declaresThreshold && !o.optionsUnresolved;

  /** What the grandfather count counts: a reading that is neither compliant
      nor exempt, and so has to be on the list to be allowed. */
  const owed = (o: ObserverSite) => !compliant(o) && !thresholdless(o);

  it("lets no new observer read an entry for itself", () => {
    const perFile: Record<string, number> = {};
    for (const o of sites.filter(owed)) {
      perFile[o.file] = (perFile[o.file] ?? 0) + 1;
    }
    const escaped: string[] = [];
    for (const [file, n] of Object.entries(perFile)) {
      const allowed = READS_ISINTERSECTING[file] ?? 0;
      if (n > allowed) escaped.push(file + ": " + n + " readings, " + allowed + " grandfathered");
    }
    expect(escaped.sort(), "call clearsThreshold from @/lib/onscreen").toEqual([]);
  });

  it("keeps the grandfather count exact, so it can only fall", () => {
    const stale: string[] = [];
    for (const [file, allowed] of Object.entries(READS_ISINTERSECTING)) {
      const n = sites.filter((o) => o.file === file && owed(o)).length;
      if (n !== allowed) stale.push(file + ": " + n + " readings against " + allowed + " listed");
    }
    expect(stale.sort(), "update READS_ISINTERSECTING to what the files now do").toEqual([]);
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
        expect(compliant(o), where(o)).toBe(true);
      }
    },
  );
});
