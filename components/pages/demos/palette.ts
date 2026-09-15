/**
 * The palette contract for the three module demos (bead hq-3pfhe.1).
 *
 * A demo has to look like the site, not like a screenshot embedded in it, and
 * the only way that survives a theme change is to draw with the live theme
 * tokens rather than with colours typed into the component. This module is the
 * one place that reads them, so Restaurante, Produccion and Hospitalidad
 * cannot drift apart.
 *
 * Why the tokens are re-derived here instead of read straight out of CSS. A
 * custom property like --muted or --energy-bright is declared as a color-mix(),
 * and getComputedStyle hands back the substituted token sequence, not an rgb
 * triple, so it cannot be parsed. Only the six raw hex tokens (ground, panel,
 * text, primary, secondary, energy) are readable, so everything derived is
 * mixed again here.
 *
 * Which of those mixes are the CSS value and which are deliberately not, since
 * this file is a contract the other two demos inherit and round one claimed
 * more than it kept (reviewer note 1). --muted and the three --*-bright
 * accents are the tokens: same ratios, byte-identical output, and
 * demos.test.ts reads app/globals.css and fails if either side is edited
 * alone. line and lineSoft take the alphas of --line and --line-soft, 0.22 and
 * 0.12, over the canvas kit's hairline hue, which is what every other canvas
 * visual on the site already strokes with, so the demos match the home visuals
 * rather than a CSS border. axis, floor, plate, accentInk and the accent
 * alphas have no CSS twin at all: a 9px mono label and a 1px stroke need their
 * own contrast, and each says so on its field below.
 *
 * Light mode is the design default: the shell ships data-mode="light" on the
 * html element, so the fallbacks below are the light tokens and every derived
 * value is checked against the light surface first and dark second.
 *
 * Hue per demo follows the colour contract already written into
 * app/[locale]/modulos/modulos.css: Produccion --primary, Hospitalidad
 * --secondary, Restaurante --energy. A demo wears one hue and nothing here
 * invents a colour.
 *
 * The canvas primitives (hexToRgb, mix, rgba, fitCanvas, rr, easing, line) are
 * the repo's existing canvas kit and are re-exported below so a demo has one
 * import. The kit sits under components/pages/home only because the home
 * visuals were written first; it is not home-specific and moving it is its own
 * bead, not this one's.
 */

import {
  BLACK,
  hexToRgb,
  mix,
  rgba,
  WHITE,
  type RGB,
} from "@/components/pages/home/canvasKit";

export {
  clamp01,
  easeInOut,
  fitCanvas,
  hexToRgb,
  line,
  mix,
  MONO,
  rgba,
  rr,
  type RGB,
} from "@/components/pages/home/canvasKit";

/** The three brand hues, one per module demo. */
export type DemoHue = "primary" | "secondary" | "energy";

/**
 * How far each hue is pushed toward the text colour to become its --*-bright
 * token in globals.css. Kept per hue rather than averaged so a demo's accent
 * is byte-identical to the CSS token of the same name, which is what the
 * modulos colour contract was measured on.
 */
const BRIGHT_MIX: Record<DemoHue, number> = {
  primary: 0.26,
  secondary: 0.22,
  energy: 0.2,
};

/** Token fallbacks, per mode, for the case where the element is not yet in a
    styled tree. Light first, because light is the default the site ships.
    These are the six hex tokens of app/globals.css copied into JS, which is a
    second source of truth by construction (reviewer note 2); demos.test.ts
    parses globals.css and fails if a mode's six ever drift apart. */
const FALLBACK: Record<"light" | "dark", Record<string, string>> = {
  light: {
    ground: "#EDE7D6",
    panel: "#F5F0E2",
    text: "#1B241E",
    primary: "#2E7D5C",
    secondary: "#B07E1E",
    energy: "#C3491B",
  },
  dark: {
    ground: "#0F1410",
    panel: "#16201A",
    text: "#E4EAD9",
    primary: "#3FB58A",
    secondary: "#D9A83A",
    energy: "#C3491B",
  },
};

export interface DemoPalette {
  /** True while the document is in dark mode. Drives the few places where a
      value has to go the other way (a wash lifts in dark, deepens in light). */
  dark: boolean;

  groundRgb: RGB;
  ground: string;
  panelRgb: RGB;
  panel: string;

  /** The surface a demo draws its board on: one step off the panel the figure
      already sits on, so the board reads as a plate rather than as nothing. */
  floorRgb: RGB;
  floor: string;
  /** An unoccupied object on that surface (a table, an empty tank, a free
      night), one step deeper again. */
  plateRgb: RGB;
  plate: string;

  textRgb: RGB;
  ink: string;
  /** Small labels drawn on the board. Deliberately stronger than the site's
      --muted: --muted reads at about 2.9:1 on the light ground, which is fine
      for chrome beside real text and not fine for a 9px axis label that is the
      only thing carrying the reading. This clears 5:1 in both modes. */
  axis: string;
  /** The site's --muted, for chrome that is decoration beside something else. */
  muted: string;

  lineRgb: RGB;
  /** The alphas of --line and --line-soft over the kit's hairline hue. */
  line: string;
  lineSoft: string;

  accentRgb: RGB;
  accent: string;
  accentSoft: string;
  accentFaint: string;
  accentLine: string;
  /** The accent as text. Pushed one more step away from the surface so a mono
      label on the accent clears 4.5:1 in both modes. */
  accentInk: string;
}

/**
 * Read the live theme tokens off `el` and derive the demo palette.
 *
 * Call it again on the "cardon-mode" event: the mode toggle rewrites
 * data-mode on the html element, every token changes underneath, and a demo
 * that does not re-read is the one visual on the page still wearing the old
 * mode.
 */
export function readDemoPalette(el: HTMLElement, hue: DemoHue): DemoPalette {
  const root = el.ownerDocument.documentElement;
  /* Light is the default the site ships, so only "dark" is dark. The older
     canvas visuals (canvasKit.readPalette, ContourField, VineyardMap) read
     this as !== "light" from when dark was the default, which makes an
     isolated mount with no data-mode dark against a light surface. The demos
     do not inherit that. */
  const dark = root.getAttribute("data-mode") === "dark";
  const fb = FALLBACK[dark ? "dark" : "light"];
  const style = getComputedStyle(el);
  const token = (name: string) =>
    hexToRgb(style.getPropertyValue("--" + name).trim() || fb[name]);

  const ground = token("ground");
  const panel = token("panel");
  const text = token("text");
  const primary = token("primary");
  const toward: RGB = dark ? WHITE : BLACK;

  // --<hue>-bright, mixed here exactly as globals.css mixes it.
  const accent = mix(token(hue), text, BRIGHT_MIX[hue]);
  const floor = mix(panel, text, 0.08);
  const plate = mix(panel, text, dark ? 0.18 : 0.15);
  /* the hairline hue canvasKit.readPalette strokes the home visuals with */
  const lineRgb = mix(primary, text, 0.35);

  return {
    dark,
    groundRgb: ground,
    ground: rgba(ground, 1),
    panelRgb: panel,
    panel: rgba(panel, 1),
    floorRgb: floor,
    floor: rgba(floor, 1),
    plateRgb: plate,
    plate: rgba(plate, 1),
    textRgb: text,
    ink: rgba(text, 1),
    axis: rgba(mix(text, panel, 0.28), 1),
    muted: rgba(mix(text, panel, 0.48), 1),
    lineRgb,
    line: rgba(lineRgb, 0.22),
    lineSoft: rgba(lineRgb, 0.12),
    accentRgb: accent,
    accent: rgba(accent, 1),
    accentSoft: rgba(accent, 0.85),
    accentFaint: rgba(accent, dark ? 0.16 : 0.13),
    accentLine: rgba(accent, 0.4),
    accentInk: rgba(mix(accent, toward, 0.12), 1),
  };
}
