import { Source_Sans_3, Source_Serif_4 } from "next/font/google";

/** Identity, type (Daniel, 2026-10-09): the Source superfamily, Serif 4 for
 *  the titles and Sans 3 for the text and, since 2026-10-10, the labels too
 *  (globals.css points --mono at the text face).
 *  One system designed together (Adobe, 2012 to 2014), long established and
 *  far from the faces generated sites default to. It replaces Zilla Slab and
 *  Onest (2026-10-01), which replaced Archivo (2026-08-27); the slab argued
 *  with the rounded logo of the time and Onest had drifted into the generated
 *  cluster.
 *  Self-hosted by next/font, so no CDN request and no layout shift. Declared
 *  once here because both the locale layout and the root 404 document mount
 *  the same html element. Both are variable fonts, one file each. */
export const display = Source_Serif_4({
  subsets: ["latin"],
  // The optical size axis keeps the large titles crisp and the small ones sturdy.
  axes: ["opsz"],
  display: "swap",
  variable: "--font-display",
});

export const text = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-text",
});

/** Both variables, for the html element's className. The logo loads no
 *  font: its wordmark ships as paths (components/site/Mark.tsx). */
export const fontVariables = [display, text]
  .map((f) => f.variable)
  .join(" ");
