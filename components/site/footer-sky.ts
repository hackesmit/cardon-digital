/**
 * The night half of the footer band (bead hq-0xca.2, Daniel 2026-10-19).
 *
 * Dark mode is a sunset here: the logo's own sun, the open ring the artwork
 * already draws, falls behind the ground line and a sky of small stars comes
 * out. The mockup for this drew a second sun as a disc; Daniel's note is that
 * the mark has a sun already, so nothing new is drawn and the ring is simply
 * lifted onto a layer that can move (SCENE_SUN_D in footer-scene-paths.ts).
 *
 * The numbers here are the single source for the geometry. The stylesheet
 * cannot read them, so it carries the same values as literals with the
 * arithmetic written beside each one, and FooterScene.test.ts reads both and
 * fails when they drift apart.
 */
import {
  SCENE_HORIZON_Y,
  SCENE_VIEWBOX_ROWS,
  SCENE_VIEWBOX_TOP,
} from "@/components/site/footer-scene-paths";

/** A viewBox row as a share of the band height. The art fills the band with
    no letterboxing (its viewBox is 860 by 465 and the box is --sh * 860/465),
    so a row maps straight onto a fraction of --sh. */
const band = (row: number) => (row - SCENE_VIEWBOX_TOP) / SCENE_VIEWBOX_ROWS;

/** Where the sun layer is cut, as a share of the band height. */
export const HORIZON = band(SCENE_HORIZON_Y);

/** The sun's top row in the viewBox, and how far below the cut it has to end
    up to be gone. Thirteen rows is about a sixth of the ring: enough that no
    sliver survives a rounding of the band height at any viewport. */
const SUN_TOP_ROW = 124;
const SUN_CLEARANCE_ROWS = 13;

/** How far the sun falls, as a share of its own box height (which is the band
    height), so the CSS can write it as a percentage in a transform. */
export const SUN_DROP = (SCENE_HORIZON_Y - SUN_TOP_ROW + SUN_CLEARANCE_ROWS) / SCENE_VIEWBOX_ROWS;

/** A sun does not drop straight down, it slides west as it goes. This is a
    share of the art box width, which is 1.85 times the band height, so the
    drift reads as about a fiftieth of the fall. */
export const SUN_DRIFT = 0.012;

/** Where the sun's centre meets the horizon, as a share of the art box width.
    The afterglow in the sky sits here, so the warm light is where the sun
    went down rather than in the middle of the band. */
export const SUN_SET_X = (736.66 + 74.34 / 2 - 40) / 860;

/** How long the sun takes to set, in seconds. The sky warms over the same
    span, so the two read as one change rather than two. */
export const SUNSET_SECONDS = 1.8;

/** The stars come out after the sun is down and leave before it comes back,
    so their fade is shorter and waits. Both numbers land the arrival on the
    end of the sunset. */
export const STAR_FADE_SECONDS = 1.1;
export const STAR_FADE_DELAY = 0.7;

export type Star = {
  /** Across the band, in percent. */
  x: number;
  /** Down the band, in percent. Always above the horizon. */
  y: number;
  /** Diameter as a share of the band height. */
  size: number;
  /** How bright this star burns at the top of its beat, 0 to 1. */
  glow: number;
  /** Seconds for one half of the twinkle. */
  beat: number;
  /** Seconds before it starts, so no two stars beat together. */
  wait: number;
};

/** Three dozen: a sky, not a wallpaper. */
const COLUMNS = 9;
const ROWS = 4;
export const STAR_COUNT = COLUMNS * ROWS;

/** The top and bottom of the sky the stars may use, in percent of the band.
    The floor stops ten points short of the horizon so no star reads as a
    speck of dirt on the ground line. */
const SKY_TOP = 4;
const SKY_FLOOR = HORIZON * 100 - 10;

/** Mulberry32. The stars must be identical on the server and in the browser,
    so the scatter is a seeded sequence frozen at module load, never
    Math.random at render. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A jittered grid rather than a free scatter: thirty-six free points on a band
 * this flat clump into two or three knots and leave holes, which reads as a
 * mistake rather than as a sky. Every other row is offset half a cell, so the
 * packing is hexagonal and the grid never shows through the jitter.
 */
function scatter(): Star[] {
  const rand = seeded(0x0ca2);
  const stars: Star[] = [];
  const cellX = 100 / COLUMNS;
  const cellY = (SKY_FLOOR - SKY_TOP) / ROWS;
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLUMNS; col += 1) {
      const offset = row % 2 === 0 ? 0 : cellX / 2;
      const x = offset + (col + 0.5 + (rand() - 0.5) * 0.8) * cellX;
      const y = SKY_TOP + (row + 0.5 + (rand() - 0.5) * 0.8) * cellY;
      stars.push({
        x: round(Math.min(99.2, Math.max(0.8, x))),
        y: round(y),
        size: round(0.016 + rand() * 0.016, 4),
        glow: round(0.45 + rand() * 0.5, 3),
        beat: round(2.6 + rand() * 2.8, 2),
        wait: round(rand() * 4.2, 2),
      });
    }
  }
  return stars;
}

function round(value: number, places = 2) {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
}

export const STARS: readonly Star[] = Object.freeze(scatter());
