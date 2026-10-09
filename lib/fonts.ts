import { Onest, Quicksand, Zilla_Slab } from "next/font/google";

/** Identity, type (Daniel, 2026-10-01): Zilla Slab carries the titles and
 *  Onest carries the text. They replace Archivo, which carried both since
 *  2026-08-27, because the site read like every other grotesque-set page; the
 *  slab gives the titles a workshop character and Onest stays quiet under it.
 *  Self-hosted by next/font, so no CDN request and no layout shift. Declared
 *  once here because both the locale layout and the root 404 document mount
 *  the same html element. */
export const display = Zilla_Slab({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

export const text = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-text",
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

/** All three variables, for the html element's className. */
export const fontVariables =
  display.variable + " " + text.variable + " " + brand.variable;
