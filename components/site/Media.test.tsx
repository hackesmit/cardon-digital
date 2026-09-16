import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// vitest transforms this app's JSX with the classic runtime, so the component's
// createElement calls resolve a global React; Next itself uses the automatic
// runtime and needs no import. This shim is test-only.
(globalThis as unknown as { React: typeof React }).React = React;

import { LocaleProvider } from "../../lib/i18n/LocaleProvider";
import { locales, type Locale } from "../../lib/i18n/config";
import Media, {
  MEDIA_PENDING_LABEL,
  MEDIA_RATIOS,
  MEDIA_SLOTS,
  assertMediaText,
  assertVideoLabels,
  exportWidth,
  mediaFile,
  mediaSlots,
  mediaSpec,
  posterFile,
  posterFor,
  posterOverlay,
  pressVideo,
  videoAction,
  videoPress,
  videoRefused,
  videoStateOnRender,
  visibleSrc,
  type IntentUpdate,
  type MediaProps,
  type MediaRatio,
  type MediaSlot,
  type VideoConditions,
  type VideoIntent,
  type VideoSlotState,
} from "./Media";

/**
 * Guards for the photo and video slot (bead hq-4pu0q.2).
 *
 * Round one shipped four promises that prose review could not check and that
 * two adversarial reviews then broke with ordinary input. Every one of those
 * findings has a test here, named for what it would catch:
 *
 *   A. a refused play() left the control dead for the session;
 *   B. reduced motion and the brief disagreed about what a press does;
 *   C. the clearance template, with a person's name on it, sat in public/;
 *   D. caption="" and caption="   " compiled and rendered an empty figcaption;
 *   E. a failed src latched a boolean, so a working replacement stayed hidden;
 *
 * plus a src swap leaking intent between slots, a missing poster showing a
 * blank rectangle, a regex shot-list check a computed slot walked past, a
 * pending panel under the AA contrast floor, Spanish-only pending labels on a
 * bilingual site, and an export recipe that hard-coded one ratio's width.
 */

/* ============================ compile-time guards ============================ */

// @ts-expect-error a photo without a caption must not compile
const withoutCaption: MediaProps = {
  slot: "winery/cellar",
  alt: "El tablet en la sala de barricas",
};

// @ts-expect-error alt text is not optional either
const withoutAlt: MediaProps = {
  slot: "winery/cellar",
  caption: "La lectura de la barrica queda registrada en el momento.",
};

// @ts-expect-error a video needs its own control labels, in the page's language
const videoWithoutLabels: MediaProps = {
  slot: "xanic/harvest-intake",
  caption: "La entrada de uva se captura una vez, en la bascula.",
  alt: "Captura de la entrada de uva",
};

const undocumentedSlot: MediaProps = {
  // @ts-expect-error a slot has to be a row in MEDIA_SLOTS and in the README
  slot: "winery/undocumented-shot",
  caption: "La lectura de la barrica queda registrada en el momento.",
  alt: "El tablet en la sala de barricas",
};

/**
 * The round one shot-list check was a regex over one JSX spelling, so any slot
 * that was not a bare string literal walked past it. The slot is a type now, so
 * a computed one does not compile at all.
 */
const computed: string = "winery/cellar";
const computedSlot: MediaProps = {
  // @ts-expect-error a computed slot cannot be checked against the shot list
  slot: computed,
  caption: "La lectura de la barrica queda registrada en el momento.",
  alt: "El tablet en la sala de barricas",
};

/** Keeps the guards referenced. Their value is the compile, not the run. */
const compileGuards = [
  withoutCaption,
  withoutAlt,
  videoWithoutLabels,
  undocumentedSlot,
  computedSlot,
];

describe("the type refuses a slot that would waste the caption", () => {
  it("keeps the compile-time guards on file", () => {
    expect(compileGuards).toHaveLength(5);
  });
});

/* ============================ D: the blank caption ============================ */

/**
 * The type stops a caption that was forgotten. It cannot stop one that was
 * supplied empty, which is what a wrapper defaulting a missing value, or any
 * call site holding an `any`, produces. Round one rendered that as an empty
 * figcaption, so the whole promise was one ordinary input away from gone.
 */
describe("D: a blank caption is rejected where the value actually is", () => {
  it.each(["", " ", "   ", "\n", "\t ", "  "])(
    "refuses caption %j at render",
    (caption) => {
      expect(() => assertMediaText("winery/cellar", caption, "alt")).toThrow(/caption is blank/);
    },
  );

  it.each(["", "   ", "\n"])("refuses alt %j at render", (alt) => {
    expect(() => assertMediaText("winery/cellar", "Una frase real.", alt)).toThrow(/alt is blank/);
  });

  it("accepts text that says something", () => {
    expect(() => assertMediaText("winery/cellar", "Una frase real.", "Alt real.")).not.toThrow();
  });

  it("throws out of the component itself, not only out of the helper", () => {
    expect(() =>
      renderToStaticMarkup(
        <Media slot="winery/cellar" caption="   " alt="El tablet en la sala de barricas" />,
      ),
    ).toThrow(/caption is blank/);
  });

  it("names the slot in the message, so a failed build says which one", () => {
    expect(() => assertMediaText("enkanto/front-desk", "", "alt")).toThrow(
      /enkanto\/front-desk/,
    );
  });
});

/**
 * aria-label is the whole accessible name of the only control on a video, so a
 * blank one ships a button a screen reader announces as nothing, and the `any`
 * caller that omitted labels crashed on a property of undefined instead of
 * saying what was wrong (cross-vendor review, round two).
 */
describe("the video control cannot ship without its two words", () => {
  const good = { play: "Reproducir el video", pause: "Pausar el video" };

  it("accepts a real pair", () => {
    expect(assertVideoLabels("xanic/harvest-intake", good)).toEqual(good);
  });

  it.each([
    ["missing altogether", undefined],
    ["empty play", { play: "", pause: "Pausar" }],
    ["whitespace play", { play: "  ", pause: "Pausar" }],
    ["empty pause", { play: "Reproducir", pause: "" }],
    ["whitespace pause", { play: "Reproducir", pause: "\n" }],
    ["not strings at all", { play: 1, pause: 2 } as unknown as typeof good],
  ])("refuses labels that are %s", (_name, labels) => {
    expect(() => assertVideoLabels("xanic/harvest-intake", labels)).toThrow(
      /needs a play and a pause label/,
    );
  });

  it("throws out of the component, naming the slot", () => {
    const blank = {
      slot: "xanic/harvest-intake",
      caption: "La entrada de uva se captura una vez.",
      alt: "Captura de la entrada de uva",
      labels: { play: " ", pause: "" },
    } as unknown as MediaProps;
    expect(() => renderToStaticMarkup(<Media {...blank} />)).toThrow(
      /xanic\/harvest-intake[\s\S]*needs a play and a pause label/,
    );
  });

  it("throws rather than crashing when an any-typed caller omits them", () => {
    const missing = {
      slot: "xanic/harvest-intake",
      caption: "La entrada de uva se captura una vez.",
      alt: "Captura de la entrada de uva",
    } as unknown as MediaProps;
    expect(() => renderToStaticMarkup(<Media {...missing} />)).toThrow(
      /needs a play and a pause label/,
    );
  });

  it("does not ask a photo slot for them", () => {
    expect(() =>
      renderToStaticMarkup(
        <Media slot="winery/cellar" caption="Una frase real." alt="Alt real." />,
      ),
    ).not.toThrow();
  });
});

/**
 * A caller holding `any` defeats every type in the file, including the slot.
 * The component asks the shot list directly rather than indexing into it and
 * getting `undefined`.
 */
describe("a slot off the shot list is refused at runtime too", () => {
  it("throws for a slot no row documents", () => {
    expect(() => mediaSpec("winery/undocumented-shot")).toThrow(/is not a slot/);
  });

  it("throws when an any-typed caller spreads one past the type", () => {
    const smuggled = {
      slot: "winery/undocumented-shot",
      caption: "Una frase real.",
      alt: "Alt real.",
    } as unknown as MediaProps;
    expect(() => renderToStaticMarkup(<Media {...smuggled} />)).toThrow(/is not a slot/);
  });

  it("returns the row for a slot that is on the list", () => {
    expect(mediaSpec("xanic/harvest-intake").kind).toBe("video");
  });
});

/* ============================ rendering ============================ */

const PHOTO = {
  slot: "winery/cellar",
  caption: "La lectura de la barrica queda registrada en el momento, no al final del dia.",
  alt: "Enologo revisando una barrica con el tablet en la mano",
} as const;

const VIDEO = {
  slot: "xanic/harvest-intake",
  caption: "La entrada de uva se captura una vez, en la bascula, y ya esta en el reporte.",
  alt: "Captura de la entrada de uva en la bascula",
  labels: { play: "Reproducir el video", pause: "Pausar el video" },
} as const;

function render(props: MediaProps, locale?: Locale): string {
  const element = <Media {...props} />;
  return renderToStaticMarkup(
    locale ? <LocaleProvider locale={locale}>{element}</LocaleProvider> : element,
  );
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
    const ratio = MEDIA_SLOTS[PHOTO.slot].ratio;
    expect(html).toContain(ratio);
    expect(html).toContain(MEDIA_RATIOS[ratio].shoot);
  });

  it("names the poster frame as well for a video slot", () => {
    const video = render(VIDEO);
    expect(video).toContain(mediaFile("video", VIDEO.slot));
    expect(video).toContain(posterFile(VIDEO.slot));
    expect(posterFile(VIDEO.slot)).toBe("/media/xanic/harvest-intake-poster.webp");
  });
});

/**
 * Round one hardcoded FOTO PENDIENTE and VIDEO PENDIENTE, which put Spanish on
 * the English half of a bilingual site for exactly as long as a slot is
 * outstanding, which is now.
 */
describe("the pending panel speaks the language of the page", () => {
  it.each(locales)("labels a pending photo in %s", (locale) => {
    expect(render(PHOTO, locale)).toContain(MEDIA_PENDING_LABEL[locale].photo);
  });

  it.each(locales)("labels a pending video in %s", (locale) => {
    expect(render(VIDEO, locale)).toContain(MEDIA_PENDING_LABEL[locale].video);
  });

  it("says something different in each language, so neither is a copy of the other", () => {
    expect(MEDIA_PENDING_LABEL.en.photo).not.toBe(MEDIA_PENDING_LABEL.es.photo);
    expect(MEDIA_PENDING_LABEL.en.video).not.toBe(MEDIA_PENDING_LABEL.es.video);
  });

  it("defaults to Spanish, which is the site's default locale", () => {
    expect(render(PHOTO)).toContain(MEDIA_PENDING_LABEL.es.photo);
  });

  it("covers every locale the site has", () => {
    for (const locale of locales) expect(MEDIA_PENDING_LABEL[locale]).toBeTruthy();
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

  it.each(mediaSlots)("reserves the box the shot list gives %s", (slot) => {
    const spec = MEDIA_SLOTS[slot];
    const props =
      spec.kind === "video"
        ? ({ ...VIDEO, slot } as MediaProps)
        : ({ ...PHOTO, slot } as MediaProps);
    expect(frameStyle(render(props))).toContain(`aspect-ratio:${spec.ratio}`);
  });
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

/* ============================ the missing poster ============================ */

/**
 * A poster that 404s does not reliably fire anything on the video element, so
 * round one showed a blank rectangle instead of the frame. The poster is loaded
 * as a real element over the paused video, so its failure is observable and
 * falls back to the brief that names the file.
 */
describe("a missing poster falls back to the brief, never to a blank frame", () => {
  const html = render({ ...VIDEO, src: "/media/xanic/harvest-intake.mp4" });

  it("loads the poster as an element and not only as an attribute", () => {
    expect(html).toContain('class="media-asset media-poster"');
    expect(html).toContain('src="/media/xanic/harvest-intake-poster.webp"');
  });

  it("hides the poster element from a screen reader: the video carries the label", () => {
    expect(html).toMatch(/class="media-asset media-poster"[^>]*alt=""/);
    expect(html).toMatch(/class="media-asset media-poster"[^>]*aria-hidden="true"/);
  });

  it("shows the poster while paused, the brief when it fails, nothing while playing", () => {
    expect(posterOverlay({ playing: false, posterFailed: false })).toBe("image");
    expect(posterOverlay({ playing: false, posterFailed: true })).toBe("pending");
    expect(posterOverlay({ playing: true, posterFailed: false })).toBe("none");
    expect(posterOverlay({ playing: true, posterFailed: true })).toBe("none");
  });
});

/* ============================ E: the latched failure ============================ */

/**
 * Round one set failed=true and never cleared it, so pointing the same slot at
 * a working replacement left it behind the placeholder for the life of the
 * component. The failure is remembered by URL instead.
 */
describe("E: a failed source does not condemn its replacement", () => {
  it("hides the source that failed", () => {
    expect(visibleSrc("/media/winery/cellar.webp", "/media/winery/cellar.webp")).toBeUndefined();
  });

  it("shows a different source even after one has failed", () => {
    expect(visibleSrc("/media/winery/cellar-v2.webp", "/media/winery/cellar.webp")).toBe(
      "/media/winery/cellar-v2.webp",
    );
  });

  it("shows a source when nothing has failed", () => {
    expect(visibleSrc("/media/winery/cellar.webp", null)).toBe("/media/winery/cellar.webp");
  });

  it("stays pending when the page has not named a source yet", () => {
    expect(visibleSrc(undefined, null)).toBeUndefined();
    expect(visibleSrc(undefined, "/media/winery/cellar.webp")).toBeUndefined();
  });

  /**
   * A wrapper defaulting an unavailable asset to "" would otherwise clear
   * data-pending and render an empty source: neither the picture nor the brief.
   */
  it.each(["", " ", "   ", "\n"])("treats a blank src %j as no src at all", (src) => {
    expect(visibleSrc(src, null)).toBeUndefined();
  });

  it("renders the pending panel for a blank src, not an empty asset", () => {
    const html = render({ ...PHOTO, src: "   " });
    expect(html).toContain('data-pending="true"');
    expect(html).not.toContain("<img");
  });
});

describe("a blank poster falls back to the slot's own frame file", () => {
  it.each(["", "  ", undefined])("replaces %j with the slot's poster path", (poster) => {
    expect(posterFor("xanic/harvest-intake", poster)).toBe(
      posterFile("xanic/harvest-intake"),
    );
  });

  it("keeps a poster the page really named", () => {
    expect(posterFor("xanic/harvest-intake", "/media/frame-12.webp")).toBe(
      "/media/frame-12.webp",
    );
  });

  it("uses it in the markup rather than an empty poster attribute", () => {
    const html = render({ ...VIDEO, src: "/media/xanic/harvest-intake.mp4", poster: " " });
    expect(html).toContain('poster="/media/xanic/harvest-intake-poster.webp"');
  });
});

/* ============================ the src swap ============================ */

/**
 * A page can point a mounted slot at a different cut without remounting it.
 * Round one carried the old source's play/pause intent onto the new one, so a
 * slot the visitor had paused could start itself, and one they had started
 * stayed marked as playing over a video that was not.
 */
describe("a new source starts with nobody's intent on it", () => {
  const paused: VideoSlotState = {
    src: "/media/a.mp4",
    poster: "/media/a-poster.webp",
    intent: "pause",
    playing: true,
    posterFailed: true,
  };

  it("drops intent, playback and the poster failure when the source changes", () => {
    const next = videoStateOnRender(paused, "/media/b.mp4", "/media/a-poster.webp");
    expect(next.src).toBe("/media/b.mp4");
    expect(next.intent).toBe("auto");
    expect(next.playing).toBe(false);
    expect(next.posterFailed).toBe(false);
  });

  it("drops them when only the poster changes", () => {
    const next = videoStateOnRender(paused, "/media/a.mp4", "/media/b-poster.webp");
    expect(next.intent).toBe("auto");
    expect(next.posterFailed).toBe(false);
  });

  it("keeps the very same object when nothing changed, so React bails out", () => {
    expect(videoStateOnRender(paused, paused.src, paused.poster)).toBe(paused);
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

  it("pauses a playing video the moment it leaves the screen, then resumes it", () => {
    const started = conditions({ intent: "play" });
    expect(videoAction(started)).toBe("play");
    expect(videoAction({ ...started, visible: false })).toBe("pause");
    expect(videoAction({ ...started, documentHidden: true })).toBe("pause");
    expect(videoAction(started)).toBe("play");
  });
});

/* ============================ B: reduced motion ============================ */

/**
 * The code and the brief disagreed: videoAction honoured an explicit press
 * under reduced motion, and public/media/README.md told Daniel a reduced-motion
 * visitor "only ever sees the poster frame". The rule chosen is the code's,
 * because a control that refuses the visitor who reached for it is the only
 * version where that visitor cannot see the footage at all. This ties the two
 * together so neither can move alone.
 */
describe("B: reduced motion suppresses autoplay and nothing else", () => {
  it("never autoplays at a reduced-motion visitor, on any device", () => {
    for (const tapToPlay of FLAGS) {
      expect(videoAction(conditions({ reduceMotion: true, tapToPlay }))).toBe("pause");
    }
  });

  it("plays for a reduced-motion visitor who pressed play, on any device", () => {
    for (const tapToPlay of FLAGS) {
      expect(videoAction(conditions({ reduceMotion: true, tapToPlay, intent: "play" }))).toBe(
        "play",
      );
    }
  });

  it("still obeys the off screen and hidden tab rules under reduced motion", () => {
    expect(videoAction(conditions({ reduceMotion: true, intent: "play", visible: false }))).toBe(
      "pause",
    );
    expect(
      videoAction(conditions({ reduceMotion: true, intent: "play", documentHidden: true })),
    ).toBe("pause");
  });
});

/* ============================ A: the dead control ============================ */

/**
 * React drops a state update that sets the value the state already holds. Round
 * one derived the next intent from observed playback, so after a refused play()
 * the element was still paused, the press re-sent "play", the update was
 * dropped, and the effect that was the only caller of play() never ran again:
 * the control was inert for the rest of the session, including after the
 * browser stopped refusing. iOS Low Power Mode is that browser state, and on a
 * phone this control is the only way to start a video at all.
 *
 * The store below is React's bailout, stated explicitly, so the trace the
 * reviewer recorded in a browser runs here in milliseconds.
 */
function intentStore() {
  let intent: VideoIntent = "auto";
  let commits = 0;
  return {
    read: () => intent,
    commits: () => commits,
    set: (update: IntentUpdate) => {
      const next = typeof update === "function" ? update(intent) : update;
      if (next === intent) return; // React bails out on an identical value
      intent = next;
      commits += 1;
    },
  };
}

function fakeVideo(refusals: number) {
  return {
    plays: 0,
    pauses: 0,
    paused: true,
    left: refusals,
    play(): Promise<void> {
      this.plays += 1;
      if (this.left > 0) {
        this.left -= 1;
        return Promise.reject(new Error("NotAllowedError"));
      }
      this.paused = false;
      return Promise.resolve();
    },
    pause(): void {
      this.pauses += 1;
      this.paused = true;
    },
  };
}

/** Lets the rejected play() promise's handler run. */
const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("A: the control survives a browser that refuses play()", () => {
  it("calls play() on every press, including after a refusal", async () => {
    const el = fakeVideo(2);
    const store = intentStore();
    const press = async () => {
      pressVideo(el, !el.paused, store.set);
      await settle();
    };

    await press();
    expect(el.plays, "first press").toBe(1);
    expect(el.paused, "the browser refused, so it is still paused").toBe(true);
    expect(store.read(), "the refusal hands the intent back").toBe("auto");

    await press();
    expect(el.plays, "second press, still refused").toBe(2);

    await press();
    expect(el.plays, "third press, the browser has stopped refusing").toBe(3);
    expect(el.paused).toBe(false);
    expect(store.read()).toBe("play");
  });

  it("issues play() inside the press and not from a later state change", () => {
    const el = fakeVideo(0);
    const store = intentStore();
    pressVideo(el, false, store.set);
    // Synchronously, before any effect could have run.
    expect(el.plays).toBe(1);
  });

  it("pauses through the element when the visitor stops it", async () => {
    const el = fakeVideo(0);
    const store = intentStore();
    pressVideo(el, false, store.set);
    await settle();
    pressVideo(el, !el.paused, store.set);
    expect(el.pauses).toBe(1);
    expect(store.read()).toBe("pause");
  });

  /**
   * Two taps inside one frame both read the React flag, which is still false
   * because the play event has not been processed, so the second press used to
   * call play() again instead of pausing (cross-vendor review, round two).
   * el.paused is authoritative and changes synchronously.
   */
  it("reads the element, so a rapid second tap pauses instead of replaying", async () => {
    const el = fakeVideo(0);
    const store = intentStore();
    pressVideo(el, false, store.set);
    await settle();
    expect(el.paused).toBe(false);
    // React has not re-rendered yet, so the stale flag still says "not playing".
    pressVideo(el, false, store.set);
    expect(el.pauses, "the second tap pauses").toBe(1);
    expect(el.plays, "and does not ask to play again").toBe(1);
    expect(store.read()).toBe("pause");
  });

  it("falls back to the React flag only when there is no element", () => {
    const store = intentStore();
    expect(() => pressVideo(null, false, store.set)).not.toThrow();
    expect(store.read()).toBe("play");
  });

  /**
   * The control: the round one shape, which only recorded the intent. It shows
   * the trace this test would have caught, so the guard is not vacuous.
   */
  it("would have caught the old shape, which went dead on the second press", async () => {
    const el = fakeVideo(2);
    const store = intentStore();
    const oldPress = async () => {
      // setIntent(playing ? "pause" : "play") and nothing else: play() was only
      // ever reached from an effect keyed on the intent.
      const before = store.read();
      store.set(videoPress(!el.paused).intent);
      if (store.read() !== before) el.play().catch(() => {});
      await settle();
    };

    await oldPress();
    expect(el.plays).toBe(1);
    await oldPress();
    expect(el.plays, "the identical update is dropped and play() is never reached").toBe(1);
    await oldPress();
    expect(el.plays, "and it stays dead after the browser stops refusing").toBe(1);
  });
});

describe("the press and the refusal, as values", () => {
  it("asks to play what is not playing and to pause what is", () => {
    expect(videoPress(false)).toEqual({ intent: "play", command: "play" });
    expect(videoPress(true)).toEqual({ intent: "pause", command: "pause" });
  });

  it("hands back only a play the browser refused", () => {
    expect(videoRefused("play")).toBe("auto");
    expect(videoRefused("pause")).toBe("pause");
    expect(videoRefused("auto")).toBe("auto");
  });
});

/* ============================ the brief Daniel shoots to ============================ */

const README = readFileSync(join(process.cwd(), "public/media/README.md"), "utf8");
const MEDIA_CSS = readFileSync(join(process.cwd(), "components/site/media.css"), "utf8");

/** Data rows of the slot catalogue: | `slot` | kind | `ratio` | shoot at | what. */
function slotRows(): Array<{ slot: string; kind: string; ratio: string; shoot: string; frame: string }> {
  const rows: Array<{ slot: string; kind: string; ratio: string; shoot: string; frame: string }> = [];
  for (const line of README.split("\n")) {
    const match = line.match(
      /^\|\s*`([^`]+)`\s*\|\s*(photo|video)\s*\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*(.+?)\s*\|\s*$/,
    );
    if (match) {
      rows.push({
        slot: match[1],
        kind: match[2],
        ratio: match[3],
        shoot: match[4],
        frame: match[5],
      });
    }
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

  /**
   * Both directions, so neither file can grow a slot alone. This replaces the
   * round one check, which only scanned pages for one JSX spelling of the prop.
   */
  it("lists exactly the slots MEDIA_SLOTS declares", () => {
    expect(slotRows().map((r) => r.slot).sort()).toEqual([...mediaSlots].sort());
  });

  it("agrees with MEDIA_SLOTS on kind, ratio, size and the brief for every row", () => {
    for (const row of slotRows()) {
      const spec = MEDIA_SLOTS[row.slot as MediaSlot];
      expect(row.kind, `kind of ${row.slot}`).toBe(spec.kind);
      expect(row.ratio, `ratio of ${row.slot}`).toBe(spec.ratio);
      expect(row.shoot, `size of ${row.slot}`).toBe(MEDIA_RATIOS[spec.ratio].shoot);
      expect(row.frame, `brief for ${row.slot}`).toBe(spec.frame);
    }
  });

  it("gives every slot a brief long enough to shoot from", () => {
    for (const slot of mediaSlots) {
      expect(MEDIA_SLOTS[slot].frame.length, slot).toBeGreaterThan(40);
    }
  });

  it("names the file for every slot it lists, photo or video", () => {
    for (const row of slotRows()) {
      const file = mediaFile(row.kind as "photo" | "video", row.slot);
      expect(file.startsWith("/media/"), file).toBe(true);
    }
  });

  /**
   * The export recipe hard-coded -resize 3000 0, which is right for the three
   * 3 / 2 slots, wrong for the other four ratios, and would upscale 4 / 5.
   */
  it("gives an export width per ratio instead of one hard-coded number", () => {
    expect(README, "the one-size recipe is gone").not.toContain("-resize 3000 0");
    for (const ratio of Object.keys(MEDIA_RATIOS) as MediaRatio[]) {
      expect(README, `export width for ${ratio}`).toContain(
        `| \`${ratio}\` | ${exportWidth(ratio)} |`,
      );
    }
  });

  it("derives that width from the size it tells Daniel to shoot to", () => {
    expect(exportWidth("3 / 2")).toBe(3000);
    expect(exportWidth("4 / 5")).toBe(2000);
    expect(exportWidth("16 / 9")).toBe(3840);
  });

  /** B, on the documentation side: the brief has to say what the code does. */
  it("states the reduced-motion rule the code actually implements", () => {
    expect(README, "the round one overstatement").not.toContain("only ever sees the poster");
    expect(README).toContain("never autoplayed at");
    expect(README).toMatch(/own press on the control still\s+plays/);
  });

  /**
   * The brief said the rule twice and the second telling still promised the
   * poster and nothing else, which is the round one overstatement surviving in
   * another section (cross-vendor review, round two). Every sentence in the
   * file that mentions a reduced-motion visitor has to carry the opt-in.
   */
  it("says the same thing everywhere it mentions a reduced-motion visitor", () => {
    const sentences = README.replace(/\n/g, " ").split(/(?<=\.)\s+/);
    const mentions = sentences.filter((line) => /reduced.motion visitor/i.test(line));
    expect(mentions.length, "the brief mentions them at all").toBeGreaterThan(0);
    for (const line of mentions) {
      expect(line, line).toMatch(/press|until they press play/i);
    }
  });

  it("does not claim the caption guarantee is compile-time alone", () => {
    expect(README).toMatch(/refuses to render a blank or whitespace-only one/);
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

/* ============================ C: what public/ may hold ============================ */

function filesUnder(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) filesUnder(path, found);
    else found.push(path);
  }
  return found;
}

/**
 * Everything under public/ is served to anyone who asks for the path. Round one
 * put the clearance template there: it asked for the name of a person in frame,
 * the name of the client contact who approved the shot, and the location of the
 * signed release. Those are the paperwork, and the paperwork is not published.
 */
describe("C: the clearance records are not on the open web", () => {
  const CLEARANCE = [
    /^\s*-?\s*Release:/im,
    /Client clearance:/i,
    /People in frame:/i,
    /written permission held/i,
    /filed at/i,
  ];

  it.each(filesUnder(join(process.cwd(), "public")).filter((f) => f.endsWith(".md")))(
    "%s holds no clearance record",
    (file) => {
      const text = readFileSync(file, "utf8");
      for (const pattern of CLEARANCE) {
        expect(pattern.test(text), `${file} matches ${pattern}`).toBe(false);
      }
    },
  );

  it("keeps the credits file to attribution and licence", () => {
    const credits = readFileSync(join(process.cwd(), "public/media/CREDITS.md"), "utf8");
    expect(credits).toContain("Photographer:");
    expect(credits).toContain("License:");
    expect(credits).toContain("docs/media-clearances.md");
    expect(credits, "no name-shaped template for a person in frame").not.toContain("<name>");
  });

  it("keeps the clearance record in the repository, off the served tree", () => {
    const clearances = readFileSync(join(process.cwd(), "docs/media-clearances.md"), "utf8");
    expect(clearances).toMatch(/Client clearance:/);
    expect(clearances).toMatch(/Release:/);
    expect(clearances).not.toMatch(/^public\//m);
  });

  it("sends the photographer to the unserved file, not to public/", () => {
    expect(README).toContain("docs/media-clearances.md");
    expect(README).toMatch(/never in\s+this folder/);
  });
});

/* ============================ contrast ============================ */

/**
 * The pending panel ships live until the files land, so its text is real text.
 * --muted measured 3.25:1 on the light ground at 11.2px, under the 4.5:1 AA
 * floor, and --primary measured 4.39:1 at 10.9px. This pins the tokens; the
 * measurement itself is a browser job and is recorded on the bead.
 */
function ruleBody(css: string, selector: string): string {
  const match = css.match(new RegExp(`\\${selector}\\{([^}]*)\\}`));
  expect(match, `${selector} exists`).not.toBeNull();
  return match![1];
}

describe("the pending panel clears the AA contrast floor", () => {
  it("does not colour any of the panel from --muted", () => {
    for (const selector of [
      ".media-pending",
      ".media-pending-tag",
      ".media-pending-file",
      ".media-pending-spec",
    ]) {
      expect(ruleBody(MEDIA_CSS, selector), selector).not.toContain("var(--muted)");
    }
  });

  it("states a colour on every line of the panel, so none inherits a weak one", () => {
    for (const selector of [
      ".media-pending",
      ".media-pending-tag",
      ".media-pending-file",
      ".media-pending-spec",
    ]) {
      expect(ruleBody(MEDIA_CSS, selector), selector).toMatch(/color:var\(--[a-z-]+\)/);
    }
  });

  it("keeps the spec line on the same token as the caption, which measures 6:1", () => {
    expect(ruleBody(MEDIA_CSS, ".media-pending-spec")).toContain("color:var(--text-dim)");
    expect(ruleBody(MEDIA_CSS, ".media-cap")).toContain("color:var(--text-dim)");
  });

  it("keeps the control above the poster overlay, so a phone can still tap it", () => {
    expect(ruleBody(MEDIA_CSS, ".media-poster")).toContain("z-index:1");
    expect(ruleBody(MEDIA_CSS, ".media-play")).toContain("z-index:2");
  });
});
