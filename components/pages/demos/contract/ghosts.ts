import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * What the stylesheet calls a ghost box, read from the stylesheet, so a third
 * box added to demos.css is under the contract without being registered here.
 */

/**
 * A stylesheet without its comments, read the way a CSS tokenizer reads it: a
 * comment cannot open inside a string. The regex this replaces could not tell,
 * so `content: "/*"` in one rule and `content: "*\/"` in a later one erased
 * every rule between them from the checked text, the ghost boxes included
 * (reviewer s-2e55, non-blocking 1; the same hole the s-5836 review found in
 * the component stripper, which is deleted).
 */
export const withoutCssComments = (text: string): string => {
  let out = "";
  let quote = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      out += c;
      if (c === "\\") out += text[++i] ?? "";
      else if (c === quote || c === "\n") quote = "";
    } else if (c === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2);
      i = end < 0 ? text.length : end + 1;
      out += " ";
    } else {
      if (c === '"' || c === "'") quote = c;
      out += c;
    }
  }
  return out;
};

/* a path, not a URL: under jsdom the global URL is not the one node:fs accepts */
const css = withoutCssComments(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "..", "demos.css"), "utf8"),
);

/** A ghost box stacks its children in one grid cell: `X > * { grid-area: 1 / 1 }`. */
export const GHOST_BOXES = Array.from(
  css.matchAll(/([.][\w-]+)\s*>\s*\*\s*\{[^}]*grid-area:\s*1\s*\/\s*1/g),
).map((m) => m[1]);

/** A ghost is a child that takes up room and is not seen. */
export const GHOSTS = Array.from(
  css.matchAll(/([.][\w-]+)\s*\{[^}]*visibility:\s*hidden/g),
).map((m) => m[1]);
