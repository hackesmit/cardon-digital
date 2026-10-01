import {
  Bodoni_Moda,
  Cormorant,
  Hanken_Grotesk,
  JetBrains_Mono,
  Josefin_Sans,
  Mulish,
  Schibsted_Grotesk,
} from "next/font/google";

/**
 * The typefaces of the four style samples on /estilos. They are declared in
 * this module and applied by that route's own layout, so no other route loads
 * them. None is preloaded: every sample sits below the page's own hero, and
 * seven preloads would compete with the fonts the hero is set in.
 *
 * Winery: a didone for the titles and a quiet grotesque under it.
 * Logistics: a tight grotesque and a monospace for the labels.
 * Spa: a light garalde with its italic and a thin humanist sans.
 * Coastal hotel: one geometric sans with a low waist, set light and wide.
 *
 * All seven are variable fonts, so each is one file whatever weights a scene
 * uses.
 */
const vinDisplay = Bodoni_Moda({
  subsets: ["latin"],
  // The optical size axis is what gives the large titles their hairlines.
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  // next/font carries no fallback metrics for this family; without this line
  // the build logs an error for it on every run.
  adjustFontFallback: false,
  variable: "--f-vin-display",
});
const vinText = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--f-vin-text",
});
const techDisplay = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--f-tech-display",
});
const techMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--f-tech-mono",
});
const spaDisplay = Cormorant({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--f-spa-display",
});
const spaText = Mulish({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--f-spa-text",
});
const hotelDisplay = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--f-hotel-display",
});

/** Every sample's font variable, for the class of the route's wrapper. */
export const sceneFontVariables = [
  vinDisplay,
  vinText,
  techDisplay,
  techMono,
  spaDisplay,
  spaText,
  hotelDisplay,
]
  .map((f) => f.variable)
  .join(" ");
