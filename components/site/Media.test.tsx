import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// vitest transforms this app's JSX with the classic runtime, so the component's
// createElement calls resolve a global React; Next itself uses the automatic
// runtime and needs no import. This shim is test-only.
(globalThis as unknown as { React: typeof React }).React = React;

import Media, {
  MEDIA_RATIOS,
  mediaFile,
  posterFile,
  videoAction,
  type MediaProps,
  type MediaRatio,
  type VideoConditions,
} from "./Media";

/**
 * Guards for the photo and video slot (bead hq-4pu0q.2).
 *
 * Three of the four things this component exists for are compile-time or
 * markup facts, which is exactly what prose review is bad at holding:
 *
 *   1. A slot cannot be built without a caption. That is a type fact, so it is
 *      checked by npx tsc --noEmit through the @ts-expect-error guards below.
 *      An unused @ts-expect-error is itself an error, so the day caption goes
 *      optional the typecheck fails and names this file.
 *   2. The space is reserved from the declared ratio before the asset exists,
 *      so the page does not reflow when the file lands. Asserted by rendering
 *      the same slot pending and ready and comparing the frame.
 *   3. The video carries no autoplay attribute and is muted, looping and
 *      inline. Playback is a decision, taken in videoAction, so the policy is
 *      tested as a table rather than through a browser.
 *
 * The fourth is that public/media/README.md has to stay true for Daniel, who
 * is shooting the material. The README is checked against the ratio table in
 * the component and against every slot any page actually uses.
 */

/* ============================ compile-time guards ============================ */

// @ts-expect-error a photo without a caption must not compile
const withoutCaption: MediaProps = {
  kind: "photo",
  slot: "winery/cellar",
  alt: "El tablet en la sala de barricas",
  ratio: "3 / 2",
};

// @ts-expect-error alt text is not optional either
const withoutAlt: MediaProps = {
  kind: "photo",
  slot: "winery/cellar",
  caption: "La lectura de la barrica queda registrada en el momento.",
  ratio: "3 / 2",
};

const withUnknownRatio: MediaProps = {
  kind: "photo",
  slot: "winery/cellar",
  caption: "La lectura de la barrica queda registrada en el momento.",
  alt: "El tablet en la sala de barricas",
  // @ts-expect-error a slot declares one of the ratios the README documents
  ratio: "7 / 3",
};

// @ts-expect-error a video needs its own control labels, in the page's language
const videoWithoutLabels: MediaProps = {
  kind: "video",
  slot: "xanic/harvest-intake",
  caption: "La entrada de uva se captura una vez, en la bascula.",
  alt: "Captura de la entrada de uva",
  ratio: "16 / 9",
};

/** Keeps the four guards referenced. Their value is the compile, not the run. */
const compileGuards = [withoutCaption, withoutAlt, withUnknownRatio, videoWithoutLabels];

describe("the type refuses a slot that would waste the caption", () => {
  it("keeps the compile-time guards on file", () => {
    expect(compileGuards).toHaveLength(4);
  });
});

/* ============================ rendering ============================ */

const PHOTO: MediaProps = {
  kind: "photo",
  slot: "winery/cellar",
  caption: "La lectura de la barrica queda registrada en el momento, no al final del dia.",
  alt: "Enologo revisando una barrica con el tablet en la mano",
  ratio: "3 / 2",
};

const VIDEO: MediaProps = {
  kind: "video",
  slot: "xanic/harvest-intake",
  caption: "La entrada de uva se captura una vez, en la bascula, y ya esta en el reporte.",
  alt: "Captura de la entrada de uva en la bascula",
  ratio: "16 / 9",
  labels: { play: "Reproducir el video", pause: "Pausar el video" },
};

function render(props: MediaProps): string {
  return renderToStaticMarkup(<Media {...props} />);
}

function frameStyle(html: string): string {
  const match = html.match(/class="media-frame"[^>]*style="([^"]*)"/);
  expect(match, "the frame carries an inline style").not.toBeNull();
  return match![1];
}

describe("the caption always reaches the page", () => {
  it("renders the photo caption in a figcaption", () => {
    const html = render({ ...PHOTO, src: mediaFile("photo", PHOTO.slot) });
    expect(html).toContain("<figcaption");
    expect(html).toContain(PHOTO.caption);
  });

  it("renders the caption even while the slot is still pending", () => {
    expect(render(PHOTO)).toContain(PHOTO.caption);
  });

  it("renders the caption under a video, so the footage is never the only carrier", () => {
    const html = render({ ...VIDEO, src: mediaFile("video", VIDEO.slot) });
    expect(html).toContain("<figcaption");
    expect(html).toContain(VIDEO.caption);
  });
});

describe("the pending state reads as a missing asset, never as a photograph", () => {
  const html = render(PHOTO);

  it("marks the figure pending", () => {
    expect(html).toContain('data-pending="true"');
  });

  it("renders no img at all, so nothing can be mistaken for the real shot", () => {
    expect(html).not.toContain("<img");
  });

  it("names the file Daniel has to produce", () => {
    expect(html).toContain(mediaFile("photo", PHOTO.slot));
    expect(mediaFile("photo", PHOTO.slot)).toBe("/media/winery/cellar.webp");
  });

  it("states the ratio and the size to shoot to", () => {
    expect(html).toContain(PHOTO.ratio);
    expect(html).toContain(MEDIA_RATIOS[PHOTO.ratio].shoot);
  });

  it("names the poster frame as well for a video slot", () => {
    const video = render(VIDEO);
    expect(video).toContain(mediaFile("video", VIDEO.slot));
    expect(video).toContain(posterFile(VIDEO.slot));
    expect(posterFile(VIDEO.slot)).toBe("/media/xanic/harvest-intake-poster.webp");
  });
});

describe("the slot reserves its space before the asset exists", () => {
  it("reserves the declared ratio while pending", () => {
    expect(frameStyle(render(PHOTO))).toContain("aspect-ratio:3 / 2");
  });

  it("holds the same box once the photograph lands, so nothing reflows", () => {
    const pending = frameStyle(render(PHOTO));
    const ready = frameStyle(render({ ...PHOTO, src: mediaFile("photo", PHOTO.slot) }));
    expect(ready).toBe(pending);
  });

  it("holds the same box for a video", () => {
    const pending = frameStyle(render(VIDEO));
    const ready = frameStyle(render({ ...VIDEO, src: mediaFile("video", VIDEO.slot) }));
    expect(ready).toBe(pending);
    expect(ready).toContain("aspect-ratio:16 / 9");
  });

  it.each(Object.keys(MEDIA_RATIOS) as MediaRatio[])(
    "reserves %s, the value the README documents",
    (ratio) => {
      expect(frameStyle(render({ ...PHOTO, ratio }))).toContain(`aspect-ratio:${ratio}`);
    },
  );
});

describe("the photograph", () => {
  const html = render({ ...PHOTO, src: "/media/winery/cellar.webp" });

  it("carries the alt text", () => {
    expect(html).toContain(`alt="${PHOTO.alt}"`);
  });

  it("is lazy by default and eager only where the page says it leads", () => {
    expect(html).toContain('loading="lazy"');
    const lead = render({ ...PHOTO, src: "/media/winery/cellar.webp", priority: true });
    expect(lead).toContain('loading="eager"');
  });

  it("is tinted by default and full colour only where the page asks", () => {
    expect(html).toContain("media--tint");
    expect(render({ ...PHOTO, src: "/media/winery/cellar.webp", tone: "full" })).toContain(
      "media--full",
    );
  });
});

describe("the video markup", () => {
  const html = render({ ...VIDEO, src: "/media/xanic/harvest-intake.mp4" });

  it("is muted, looping and inline", () => {
    expect(html).toContain("muted=");
    expect(html).toContain("loop=");
    expect(html).toContain("playsinline=");
  });

  it("carries no autoplay attribute: playback is decided in JS, not by the tag", () => {
    expect(html).not.toContain("autoplay");
  });

  it("holds a poster frame, which is what a phone shows until it is tapped", () => {
    expect(html).toContain('poster="/media/xanic/harvest-intake-poster.webp"');
    expect(html).toContain('preload="metadata"');
  });

  it("offers a labelled control, so the visitor can always stop it", () => {
    expect(html).toContain('aria-label="Reproducir el video"');
    expect(html).toContain('data-playing="false"');
  });

  it("takes the poster the page passes when the frame is not the default file", () => {
    const html2 = render({
      ...VIDEO,
      src: "/media/xanic/harvest-intake.mp4",
      poster: "/media/xanic/harvest-intake-frame-12.webp",
    });
    expect(html2).toContain('poster="/media/xanic/harvest-intake-frame-12.webp"');
  });
});

/* ============================ the playback policy ============================ */

const INTENTS = ["auto", "play", "pause"] as const;
const FLAGS = [false, true];

function conditions(over: Partial<VideoConditions>): VideoConditions {
  return {
    intent: "auto",
    visible: true,
    documentHidden: false,
    reduceMotion: false,
    tapToPlay: false,
    ...over,
  };
}

/** Every combination the effect can hand the policy. */
function everyCondition(): VideoConditions[] {
  const all: VideoConditions[] = [];
  for (const intent of INTENTS)
    for (const visible of FLAGS)
      for (const documentHidden of FLAGS)
        for (const reduceMotion of FLAGS)
          for (const tapToPlay of FLAGS)
            all.push({ intent, visible, documentHidden, reduceMotion, tapToPlay });
  return all;
}

describe("videoAction, the whole playback policy", () => {
  it("covers 48 combinations", () => {
    expect(everyCondition()).toHaveLength(48);
  });

  it("never plays off screen", () => {
    for (const c of everyCondition().filter((c) => !c.visible)) {
      expect(videoAction(c), JSON.stringify(c)).toBe("pause");
    }
  });

  it("never plays while the document is hidden", () => {
    for (const c of everyCondition().filter((c) => c.documentHidden)) {
      expect(videoAction(c), JSON.stringify(c)).toBe("pause");
    }
  });

  it("never plays against a visitor who paused it", () => {
    for (const c of everyCondition().filter((c) => c.intent === "pause")) {
      expect(videoAction(c), JSON.stringify(c)).toBe("pause");
    }
  });

  it("autoplays on a desktop that has not asked for less motion", () => {
    expect(videoAction(conditions({}))).toBe("play");
  });

  it("holds the poster on a phone until it is tapped", () => {
    expect(videoAction(conditions({ tapToPlay: true }))).toBe("pause");
    expect(videoAction(conditions({ tapToPlay: true, intent: "play" }))).toBe("play");
  });

  it("holds the poster under prefers-reduced-motion, on any device", () => {
    for (const tapToPlay of FLAGS) {
      expect(videoAction(conditions({ reduceMotion: true, tapToPlay }))).toBe("pause");
    }
  });

  it("still plays for a visitor who pressed play after asking for less motion", () => {
    expect(videoAction(conditions({ reduceMotion: true, intent: "play" }))).toBe("play");
  });

  it("pauses a playing video the moment it leaves the screen, then resumes it", () => {
    const started = conditions({ intent: "play" });
    expect(videoAction(started)).toBe("play");
    expect(videoAction({ ...started, visible: false })).toBe("pause");
    expect(videoAction({ ...started, documentHidden: true })).toBe("pause");
    expect(videoAction(started)).toBe("play");
  });
});

/* ============================ the brief Daniel shoots to ============================ */

const README = readFileSync(join(process.cwd(), "public/media/README.md"), "utf8");

/** Data rows of the slot catalogue: | `slot` | kind | `ratio` | shoot at | what. */
function slotRows(): Array<{ slot: string; kind: string; ratio: string; shoot: string }> {
  const rows: Array<{ slot: string; kind: string; ratio: string; shoot: string }> = [];
  for (const line of README.split("\n")) {
    const match = line.match(
      /^\|\s*`([^`]+)`\s*\|\s*(photo|video)\s*\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|/,
    );
    if (match) rows.push({ slot: match[1], kind: match[2], ratio: match[3], shoot: match[4] });
  }
  return rows;
}

describe("public/media/README.md, which is the shot list", () => {
  it("documents every ratio the component offers, with its size", () => {
    for (const [ratio, spec] of Object.entries(MEDIA_RATIOS)) {
      expect(README, `ratio ${ratio}`).toContain(`\`${ratio}\``);
      expect(README, `size for ${ratio}`).toContain(spec.shoot);
    }
  });

  it("lists slots", () => {
    expect(slotRows().length).toBeGreaterThanOrEqual(6);
  });

  it("gives every slot a ratio the component accepts and the matching size", () => {
    for (const row of slotRows()) {
      expect(Object.keys(MEDIA_RATIOS), `slot ${row.slot}`).toContain(row.ratio);
      expect(row.shoot, `slot ${row.slot}`).toBe(
        MEDIA_RATIOS[row.ratio as MediaRatio].shoot,
      );
    }
  });

  it("names the file for every slot it lists, photo or video", () => {
    for (const row of slotRows()) {
      const file = mediaFile(row.kind as "photo" | "video", row.slot);
      expect(file.startsWith("/media/"), file).toBe(true);
    }
  });
});

/** Every .tsx under app/ and components/, so a page cannot use an undocumented slot. */
function sourceFiles(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (entry === "node_modules" || entry === ".next") continue;
    if (statSync(path).isDirectory()) sourceFiles(path, found);
    else if (entry.endsWith(".tsx") && !entry.endsWith(".test.tsx")) found.push(path);
  }
  return found;
}

describe("the pages and the shot list stay in step", () => {
  it("uses only slots the README tells Daniel to shoot", () => {
    const documented = new Set(slotRows().map((r) => r.slot));
    for (const file of [
      ...sourceFiles(join(process.cwd(), "app")),
      ...sourceFiles(join(process.cwd(), "components")),
    ]) {
      const source = readFileSync(file, "utf8");
      if (!source.includes("<Media")) continue;
      // Array.from, not for...of: tsc runs this project without a target, so
      // iterating the matchAll iterator directly needs downlevelIteration.
      for (const match of Array.from(source.matchAll(/slot="([^"]+)"/g))) {
        expect(documented, `${file} uses slot ${match[1]}`).toContain(match[1]);
      }
    }
  });
});
