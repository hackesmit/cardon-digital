import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sitemap from "./sitemap";
import { SITE_URL } from "@/lib/i18n/metadata";
import { stripLocale } from "@/lib/i18n/config";

/**
 * The sitemap's lastModified is a date table in app/sitemap.ts, and this test
 * is what keeps the table honest (bead hq-i4b5.2).
 *
 * Why a table and not git at build time: Vercel builds from a shallow clone,
 * and in a shallow clone `git log -- <file>` answers with the clone's oldest
 * commit for any file that has not changed recently, so every quiet page would
 * be stamped with a recent date and nothing would say so. A table cannot drift
 * quietly either, because this test recomputes every date from the full local
 * history and fails on any difference, printing the line to write.
 *
 * A page's content is its page.tsx, the route's own layout if it has one, and
 * everything those import, followed through the tree. Site chrome is not page
 * content: a footer change is not a change to /precios, so the shared modules
 * below stop the walk. A date is the committer day of the last commit that
 * touched any of those files, or today when one of them has uncommitted edits.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROUTE_ROOT = join(ROOT, "app", "[locale]");

/** Modules every page shares. Reaching one ends that branch of the walk. */
const CHROME = [
  /^lib\/i18n\/(config|metadata|rich|site|LocaleProvider)\.tsx?$/,
  /^lib\/(onscreen|fonts)\.ts$/,
  /^lib\/analytics\//,
  /^components\/(site|consent)\//,
];

const EXTENSIONS = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

function resolveImport(from: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = join(ROOT, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(from), spec);
  else return null;
  for (const ext of EXTENSIONS) {
    const f = base + ext;
    if (existsSync(f) && statSync(f).isFile()) return f;
  }
  throw new Error(`cannot resolve ${spec} from ${relative(ROOT, from)}`);
}

/** Every repo file a route's page is built from, as repo-relative paths. */
function sourcesOf(path: string): string[] {
  const dir = path === "/" ? ROUTE_ROOT : join(ROUTE_ROOT, ...path.slice(1).split("/"));
  const start = [join(dir, "page.tsx")];
  if (path !== "/" && existsSync(join(dir, "layout.tsx"))) start.push(join(dir, "layout.tsx"));
  const seen = new Set<string>();
  const queue = [...start];
  while (queue.length) {
    const file = queue.pop()!;
    const rel = relative(ROOT, file);
    if (seen.has(rel) || CHROME.some((re) => re.test(rel))) continue;
    seen.add(rel);
    if (!/\.(tsx?|mjs|js)$/.test(file)) continue;
    const src = readFileSync(file, "utf8");
    for (const m of Array.from(src.matchAll(/(?:from|import)\s*\(?\s*["']([^"']+)["']/g))) {
      const next = resolveImport(file, m[1]);
      if (next) queue.push(next);
    }
  }
  return Array.from(seen).sort();
}

function git(args: string[]): string {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function today(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function changedOn(files: string[]): string {
  if (git(["status", "--porcelain", "--", ...files]) !== "") return today();
  // Merge commits are skipped: a clean merge of two branches that each
  // touched one of a page's files on an earlier day would otherwise date the
  // page to the merge, and main would go red after two green branches.
  return git(["log", "-1", "--no-merges", "--format=%cs", "--", ...files]);
}

/** The table, read back through the sitemap itself: one entry per path. */
const listed = new Map<string, string>();
for (const entry of sitemap()) {
  const path = stripLocale(new URL(entry.url).pathname) || "/";
  const lm = entry.lastModified;
  const day = lm instanceof Date ? lm.toISOString().slice(0, 10) : String(lm);
  const prior = listed.get(path);
  if (prior !== undefined && prior !== day) throw new Error(`${path} has two dates`);
  listed.set(path, day);
}

describe("sitemap lastModified", () => {
  it("is computed against full history, never a shallow clone", () => {
    // A shallow clone dates every quiet file to the clone boundary: the very
    // lie the table exists to avoid. Refuse rather than pass on bad data.
    expect(git(["rev-parse", "--is-shallow-repository"])).toBe("false");
  });

  it("is a plain calendar day on every entry", () => {
    for (const [path, day] of Array.from(listed)) {
      expect(day, path).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("is never older than the last change to each page's own sources, nor later than today", () => {
    // ISO days compare as strings. A table day after the last change is
    // allowed (a branch merged on a later day than it was written); a day
    // before it is the lie this test exists to catch, and a future day is too.
    const wrong: string[] = [];
    const now = today();
    for (const [path, day] of Array.from(listed)) {
      const actual = changedOn(sourcesOf(path));
      if (day < actual) wrong.push(`  ${path}: table says ${day}, the page changed ${actual}`);
      else if (day > now) wrong.push(`  ${path}: table says ${day}, which is after today ${now}`);
    }
    expect(wrong, "update lastModified in app/sitemap.ts:\n" + wrong.join("\n")).toEqual([]);
  });

  it("walks a page into its dictionary and its own components, not the chrome", () => {
    const precios = sourcesOf("/precios");
    expect(precios).toContain("app/[locale]/precios/page.tsx");
    expect(precios).toContain("lib/i18n/precios.ts");
    expect(precios).toContain("lib/pricing.ts");
    expect(precios.some((f) => f.startsWith("components/pages/precios/"))).toBe(true);
    expect(precios.some((f) => CHROME.some((re) => re.test(f)))).toBe(false);
    expect(sourcesOf("/estilos")).toContain("app/[locale]/estilos/layout.tsx");
  });


  it("lists absolute URLs on the production origin", () => {
    for (const entry of sitemap()) expect(entry.url.startsWith(SITE_URL + "/")).toBe(true);
  });
});
