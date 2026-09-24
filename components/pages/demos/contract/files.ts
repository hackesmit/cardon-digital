import { readdirSync } from "node:fs";

/**
 * Which files the demo contract is about (stand-in review of 077a7b4, probe
 * 6).
 *
 * Both halves of the contract used to list one directory, non-recursively, so
 * a demo in a subfolder of components/pages/demos was neither mounted nor
 * parsed: the same component that fails two checks beside RestauranteDemo.tsx
 * passed the whole suite from components/pages/demos/sub/, and a helper that
 * rendered the hotspots from a subfolder was never read by a source rule. A
 * demo is under the contract because of where it lives, and a directory is
 * not a place to hide.
 */

/** The two subdirectories of components/pages/demos that are the machinery
    and not a demo: the shared stage every demo renders, and this contract.
    Skipped at the top only, so nobody can open a second `stage` deeper down
    and put a demo in it. */
const MACHINERY = new Set(["stage", "contract"]);

/**
 * Every demo file under `dir`, deepest last, as a path relative to `dir` with
 * forward slashes, which is both an import specifier and a readFileSync
 * argument.
 *
 * Every .tsx here is a demo, one demo to a file: it is mounted through every
 * check and read by every source rule. Shared JSX belongs in ./stage, which
 * the whole contract is built on, and shared arithmetic in a .ts module beside
 * the demo. A .tsx with no demo in it is refused, loudly, because the rule
 * that a subfolder cannot hide a demo and the rule that it cannot hide a
 * helper are the same rule.
 */
export const demoFiles = (dir: string): string[] => {
  const out: string[] = [];
  const walk = (rel: string) => {
    const entries = readdirSync(rel ? dir + "/" + rel : dir, { withFileTypes: true });
    for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const path = rel ? rel + "/" + e.name : e.name;
      if (e.isDirectory()) {
        if (!(rel === "" && MACHINERY.has(e.name))) walk(path);
      } else if (e.name.endsWith(".tsx") && !e.name.endsWith(".test.tsx")) {
        out.push(path);
      }
    }
  };
  walk("");
  return out;
};
