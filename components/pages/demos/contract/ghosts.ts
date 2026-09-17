import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * What the stylesheet calls a ghost box, read from the stylesheet, so a third
 * box added to demos.css is under the contract without being registered here.
 */

/* a path, not a URL: under jsdom the global URL is not the one node:fs accepts */
const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "..", "demos.css"),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, "");

/** A ghost box stacks its children in one grid cell: `X > * { grid-area: 1 / 1 }`. */
export const GHOST_BOXES = Array.from(
  css.matchAll(/([.][\w-]+)\s*>\s*\*\s*\{[^}]*grid-area:\s*1\s*\/\s*1/g),
).map((m) => m[1]);

/** A ghost is a child that takes up room and is not seen. */
export const GHOSTS = Array.from(
  css.matchAll(/([.][\w-]+)\s*\{[^}]*visibility:\s*hidden/g),
).map((m) => m[1]);
