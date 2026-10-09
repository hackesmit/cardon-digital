import {
  Quicksand,
  Source_Code_Pro,
  Source_Sans_3,
  Source_Serif_4,
} from "next/font/google";

/** Identity, type (Daniel, 2026-10-09): the Source superfamily, Serif 4 for
 *  the titles, Sans 3 for the text and Code Pro for the labels and figures.
 *  One system designed together (Adobe, 2012 to 2014), long established and
 *  far from the faces generated sites default to. It replaces Zilla Slab and
 *  Onest (2026-10-01), which replaced Archivo (2026-08-27); the slab argued
 *  with the rounded line-cactus logo and Onest had drifted into the generated
 *  cluster. Code Pro also ends the per-OS label font: the mono stack read
 *  Cascadia, SF Mono or Consolas depending on the visitor's machine.
 *  Self-hosted by next/font, so no CDN request and no layout shift. Declared
 *  once here because both the locale layout and the root 404 document mount
 *  the same html element. All three are variable fonts, one file each. */
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

/** Labels, kickers and figures. Not preloaded: every mono line sits below the
 *  hero, and the two text faces take the preload budget. */
export const mono = Source_Code_Pro({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-mono",
});

/** Identity, logo (Daniel, 2026-10-09): the wordmark of the line-cactus logo
 *  is a rounded geometric sans, CARDON bold and tracked wide over a light,
 *  wider-tracked DIGITAL. Quicksand is the closest open face to the supplied
 *  artwork; it is used for the lockup only (nav, holding page), never for
 *  titles or text. Variable font, one file. Not preloaded: the lockup is two
 *  short words and the hero fonts take the preload budget. */
export const brand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-brand",
});

/** All four variables, for the html element's className. */
export const fontVariables = [display, text, mono, brand]
  .map((f) => f.variable)
  .join(" ");
