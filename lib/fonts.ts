import { Onest, Zilla_Slab } from "next/font/google";

/** Identity, type (Daniel, 2026-10-01): Zilla Slab carries the titles and
 *  Onest carries the text. They replace Archivo, which carried both since
 *  2026-08-27, because the site read like every other grotesque-set page; the
 *  slab gives the titles a workshop character and Onest stays quiet under it.
 *  The Source superfamily replaced them for a week (2026-10-09) to suit the
 *  line-cactus logo; Daniel put them back on 2026-10-15 with the official,
 *  hand-drawn logo.
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

/** Both variables, for the html element's className. */
export const fontVariables = display.variable + " " + text.variable;
