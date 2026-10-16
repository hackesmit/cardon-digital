import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  AWAITING_MEDIA,
  SCENE_KEYS,
  SCENE_MEDIA,
  allLayers,
  armState,
  layerFiles,
  sceneLayers,
  stillPath,
  videoSources,
  type SceneKey,
} from "./sceneMedia";
import { STYLE_ROUTES, STYLE_TILES } from "@/components/pages/home/StylesPromo";

/**
 * Guards for the real material on /estilos (bead hq-lgjo.5).
 *
 * The page was drawing and type alone, and a sample that loses its photograph
 * or its clip still looks finished, which is exactly the failure a file-shaped
 * check cannot see. So every property below is pinned against something other
 * than the catalogue's own say-so: the files are read off disk, the colours
 * are read out of the stylesheet, the credits are read out of CREDITS.md, and
 * the page is read as source.
 */

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

const PAGE = read("app/[locale]/estilos/page.tsx");
const CSS = read("app/[locale]/estilos/estilos.css");
const CREDITS = read("public/media/CREDITS.md");
const COMPONENT = read("components/pages/estilos/SceneMedia.tsx");
const HOME = read("app/[locale]/page.tsx");

/** The DoD's ceiling for everything this bead adds under public/media. */
const TOTAL_BUDGET_BYTES = 40 * 1024 * 1024;
/** No single file may be heavier than this. A clip is 2 to 6 MB; a still far less. */
const FILE_BUDGET_BYTES = 6 * 1024 * 1024;

describe("every sample either carries material or says what it is waiting for", () => {
  it.each(SCENE_KEYS)("%s is in exactly one of the two states", (key) => {
    const hasMedia = sceneLayers(key).length > 0;
    const awaiting = typeof AWAITING_MEDIA[key] === "string";
    expect(hasMedia || awaiting, `${key} has neither media nor a reason`).toBe(true);
    expect(hasMedia && awaiting, `${key} claims both`).toBe(false);
  });

  it("gives a waiting sample a reason long enough to shoot from", () => {
    for (const [key, reason] of Object.entries(AWAITING_MEDIA)) {
      expect(reason!.length, key).toBeGreaterThan(40);
    }
  });

  it("names a real sample in both tables", () => {
    for (const key of [...Object.keys(SCENE_MEDIA), ...Object.keys(AWAITING_MEDIA)]) {
      expect(SCENE_KEYS).toContain(key as SceneKey);
    }
  });

  /**
   * The outcome the bead asks for, stated as a number rather than as prose:
   * on 2026-10-16 three of the four samples had material. A fourth sample
   * losing its own would pass every other case here.
   */
  it("keeps at least three samples carrying material", () => {
    const withMedia = SCENE_KEYS.filter((key) => sceneLayers(key).length > 0);
    expect(withMedia.length).toBeGreaterThanOrEqual(3);
  });
});

describe("the files the catalogue promises are on disk and weigh what they should", () => {
  const files = allLayers().flatMap((layer) => layerFiles(layer));

  it("declares a file for every layer", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("public/%s exists", (file) => {
    expect(statSync(join(ROOT, "public", file)).isFile()).toBe(true);
  });

  it.each(files)("public/%s is under the per-file ceiling", (file) => {
    expect(statSync(join(ROOT, "public", file)).size).toBeLessThanOrEqual(FILE_BUDGET_BYTES);
  });

  it("keeps the whole folder inside the page weight budget", () => {
    const total = files.reduce((sum, file) => sum + statSync(join(ROOT, "public", file)).size, 0);
    expect(total).toBeLessThanOrEqual(TOTAL_BUDGET_BYTES);
  });

  it("credits every file it ships", () => {
    for (const layer of allLayers()) {
      expect(CREDITS, `${layer.file} has no credit line`).toContain(layer.file);
    }
  });
});

describe("the paths a layer resolves to", () => {
  it("offers WebM before MP4, so the smaller cut is the one a browser takes", () => {
    expect(videoSources("estilos/x")).toEqual([
      { src: "/media/estilos/x.webm", type: "video/webm" },
      { src: "/media/estilos/x.mp4", type: "video/mp4" },
    ]);
  });

  it("gives a video its poster frame and a photograph itself", () => {
    expect(stillPath({ file: "estilos/x", kind: "video" })).toBe("/media/estilos/x-poster.webp");
    expect(stillPath({ file: "estilos/x", kind: "photo" })).toBe("/media/estilos/x.webp");
  });

  it("asks a video for three files and a photograph for one", () => {
    expect(layerFiles({ file: "estilos/x", kind: "video" })).toHaveLength(3);
    expect(layerFiles({ file: "estilos/x", kind: "photo" })).toEqual(["media/estilos/x.webp"]);
  });
});

describe("arming, which is what keeps a clip off the initial load", () => {
  it("arms when the scene comes near", () => {
    expect(armState(false, true)).toBe(true);
  });

  it("stays off while the scene is far away", () => {
    expect(armState(false, false)).toBe(false);
  });

  /** A visitor who scrolls past and back must not watch the clip reload. */
  it("never disarms once armed", () => {
    expect(armState(true, false)).toBe(true);
  });
});

describe("the component, read as source", () => {
  it("renders no source element until the scene is armed", () => {
    expect(COMPONENT).toMatch(/armed\s*\n?\s*\?\s*videoSources/);
  });

  it("asks the browser for nothing up front", () => {
    expect(COMPONENT).toContain('preload="none"');
    expect(COMPONENT, "playback is decided in JS, never by the tag").not.toContain("autoPlay");
  });

  /**
   * The policy is Media.tsx's, imported rather than copied. A second copy of
   * "when does a video play" is how a phone starts autoplaying on one surface
   * and not the other.
   */
  it("imports the playback policy instead of writing a second one", () => {
    expect(COMPONENT).toMatch(/from "@\/components\/site\/Media"/);
    expect(COMPONENT).toContain("videoAction(");
    expect(COMPONENT).toContain("pressVideo(");
  });

  it("decides on screen through lib/onscreen, never off the raw flag", () => {
    expect(COMPONENT).toContain("clearsThreshold(");
    expect(COMPONENT).not.toContain(".isIntersecting");
  });

  it("gives the clip a labelled control, which is the only action in a sample", () => {
    expect(COMPONENT).toContain("aria-label={playing ? labels.pause : labels.play}");
  });
});

describe("the page and the catalogue stay in step", () => {
  it("asks for the shots of every sample, once each", () => {
    for (const key of SCENE_KEYS) {
      const calls = PAGE.split(`shots("${key}")`).length - 1;
      expect(calls, `${key} is drawn ${calls} times`).toBe(1);
    }
  });

  it("names no sample the catalogue does not know", () => {
    const named = Array.from(PAGE.matchAll(/shots\("([^"]+)"\)/g)).map((m) => m[1]);
    for (const key of named) expect(SCENE_KEYS).toContain(key as SceneKey);
  });

  it("places every role the catalogue uses", () => {
    for (const layer of allLayers()) {
      expect(CSS, `no rule for role ${layer.role}`).toContain(`.sc-shot--${layer.role}`);
    }
  });

  /** The drawing goes on top of the material; the hybrid is the whole point. */
  it("keeps the drawing above the photograph", () => {
    expect(CSS).toMatch(/\.sc-art\{position:absolute;z-index:1;/);
    expect(CSS).toMatch(/\.sc-shot\{position:absolute;z-index:0;/);
  });

  it("stops the crates moving for a visitor who asked for less motion", () => {
    const block = CSS.slice(CSS.lastIndexOf("@media (prefers-reduced-motion:reduce)"));
    expect(block).toContain("animation:none");
  });
});

/**
 * The tiles paint themselves in somebody else's colours, so the site's own
 * palette check (scripts/palette-check.mjs, which measures the tokens) cannot
 * see them. WCAG 2.1 AA, measured here: the style name is 0.74rem, which is
 * small text and wants 4.5, and the industry line is 1.15rem and over, which
 * is still small text at that size, so both pairs are held to 4.5.
 */
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string): number {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

describe("the home page's styles section", () => {
  it.each(SCENE_KEYS)("%s reads at AA on its own ground", (key) => {
    const tile = STYLE_TILES[key];
    expect(contrast(tile.ground, tile.ink), "ink").toBeGreaterThanOrEqual(4.5);
    expect(contrast(tile.ground, tile.accent), "accent").toBeGreaterThanOrEqual(4.5);
  });

  it("is on the home page exactly once", () => {
    expect(HOME.split("<StylesPromo").length - 1).toBe(1);
  });

  it("wears the colours of the samples it opens", () => {
    for (const key of SCENE_KEYS) {
      const ground = STYLE_TILES[key].ground;
      expect(CSS, `${key} ground ${ground} is not the scene's`).toContain(`background:${ground}`);
    }
  });

  it("has a tile for every sample and no more", () => {
    expect(Object.keys(STYLE_TILES).sort()).toEqual([...SCENE_KEYS].sort());
  });

  /**
   * The routes are written out as literals so app/routes.test.ts can read
   * them, which means nothing in the type system keeps them in the order of
   * the keys. A tile that opened the wrong sample would look right.
   */
  it("opens the sample its tile names, in order", () => {
    expect(STYLE_ROUTES).toHaveLength(SCENE_KEYS.length);
    SCENE_KEYS.forEach((key, i) => {
      expect(STYLE_ROUTES[i]).toBe(`/estilos#estilo-${key}`);
    });
  });

  /**
   * Those anchors have to exist. The gallery builds every scene id as
   * "estilo-" plus the key, off the same key list the tiles use, so pinning
   * the two lines that do it covers all four at once.
   */
  it("points at anchors the gallery really builds", () => {
    expect(PAGE).toContain('id={"estilo-" + key}');
    expect(PAGE).toContain("const KEYS = SCENE_KEYS");
  });
});
