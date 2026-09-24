import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sitemap from "./sitemap";
import { locales, stripLocale } from "@/lib/i18n/config";
import { RETIRED_ROUTES, retiredPaths, retiredRoute } from "@/lib/routes";

/**
 * Nothing on this site links to a page it no longer has (bead hq-4pu0q.8).
 *
 * The routes are read off disk rather than listed here, because a list beside
 * the thing it describes goes stale the day someone adds a page and not the
 * entry. Three properties hold together:
 *
 *   1. A retired path has no page and its target does.
 *   2. Every internal link in app and components points at a page that exists.
 *   3. The sitemap advertises pages, never redirects.
 *
 * The scan reads source as text, so its blind spot is a link built at runtime.
 * That is closed by refusing to pass: an href() call whose argument is not a
 * string literal fails unless DYNAMIC_HREFS says which constant it reads, and
 * the constant itself is then read and checked. A new dynamic link cannot go
 * unnoticed, it can only be declared.
 */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROUTE_ROOT = join(ROOT, "app", "[locale]");

/** Every href() argument that is not a string literal, and where it reads from. */
const DYNAMIC_HREFS: Record<string, { file: string; constant: string }> = {
  "CASE_ROUTES[0]": { file: "app/[locale]/page.tsx", constant: "CASE_ROUTES" },
  "CASE_ROUTES[i]": { file: "app/[locale]/page.tsx", constant: "CASE_ROUTES" },
};

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

/** The locale-free path of every page.tsx under app/[locale]. */
const existingRoutes = new Set(
  walk(ROUTE_ROOT)
    .filter((f) => basename(f) === "page.tsx")
    .map((f) => {
      const rel = dirname(f).slice(ROUTE_ROOT.length).split(/[\\/]/).join("/");
      return rel === "" ? "/" : rel;
    }),
);

/** Source files that can carry a link. Tests are not a surface a visitor sees. */
const sourceFiles = [join(ROOT, "app"), join(ROOT, "components")]
  .flatMap((d) => walk(d))
  .filter((f) => f.endsWith(".tsx") && !f.includes(".test."));

type Link = { file: string; path: string; raw: string };

function linksIn(file: string): Link[] {
  const src = readFileSync(file, "utf8");
  const rel = file.slice(ROOT.length + 1);
  const found: Link[] = [];

  for (const m of Array.from(src.matchAll(/(?<![A-Za-z0-9_$])href\(([^)]*)\)/g))) {
    const arg = m[1].trim();
    const literal = /^"([^"]*)"$/.exec(arg);
    if (literal) {
      found.push({ file: rel, path: literal[1], raw: arg });
      continue;
    }
    const declared = DYNAMIC_HREFS[arg];
    expect(
      declared,
      `${rel}: href(${arg}) is not a string literal. Add it to DYNAMIC_HREFS ` +
        `in app/routes.test.ts with the constant it reads, or this audit is ` +
        `blind to it.`,
    ).toBeDefined();
    const source = readFileSync(join(ROOT, declared.file), "utf8");
    const array = new RegExp(
      `const ${declared.constant}\\s*(?::[^=]*)?=\\s*\\[([^\\]]*)\\]`,
    ).exec(source);
    expect(array, `${declared.file}: no const ${declared.constant} array`).not.toBeNull();
    for (const entry of Array.from(array![1].matchAll(/"([^"]*)"/g))) {
      found.push({ file: rel, path: entry[1], raw: `${arg} -> ${declared.constant}` });
    }
  }

  // A literal href attribute that is a site path rather than an anchor, a
  // mailto or an outside address.
  for (const m of Array.from(src.matchAll(/href="(\/[^"]*)"/g))) {
    found.push({ file: rel, path: m[1], raw: `href="${m[1]}"` });
  }

  return found;
}

const links = sourceFiles.flatMap(linksIn);

/** A link target, with any fragment taken off, as a locale-free route. */
function routeOf(path: string): string {
  const withoutHash = path.split("#")[0];
  return withoutHash === "" ? "/" : withoutHash;
}

describe("retired routes", () => {
  it("names at least the modules page", () => {
    expect(retiredPaths).toContain("/modulos");
    expect(RETIRED_ROUTES["/modulos"]).toEqual({ to: "/precios", status: 308 });
  });

  it.each(retiredPaths)("%s has no page left under app/[locale]", (path) => {
    expect(existingRoutes.has(path)).toBe(false);
  });

  it.each(retiredPaths)("%s lands on a page that exists", (path) => {
    expect(existingRoutes.has(RETIRED_ROUTES[path].to)).toBe(true);
  });
});

describe("internal links", () => {
  it("finds the links it is meant to be auditing", () => {
    // A scan that matched nothing would pass every case below in silence.
    expect(links.length).toBeGreaterThan(20);
    expect(new Set(links.map((l) => l.file)).size).toBeGreaterThan(5);
  });

  it("points at no retired page", () => {
    const dead = links.filter((l) => retiredRoute(routeOf(l.path)));
    expect(
      dead.map((l) => `${l.file}: ${l.raw}`),
      "these links go to a page the site no longer has",
    ).toEqual([]);
  });

  it("points at nothing that was never a page", () => {
    const missing = links.filter((l) => !existingRoutes.has(routeOf(l.path)));
    expect(missing.map((l) => `${l.file}: ${l.raw}`)).toEqual([]);
  });
});

describe("sitemap", () => {
  const entries = sitemap();

  it("lists every locale of every page it carries", () => {
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.length % locales.length).toBe(0);
  });

  it("advertises pages and never a redirect", () => {
    for (const entry of entries) {
      const path = stripLocale(new URL(entry.url).pathname);
      expect(retiredRoute(path), `${entry.url} is a retired path`).toBeUndefined();
      expect(existingRoutes.has(path), `${entry.url} has no page`).toBe(true);
    }
  });
});
