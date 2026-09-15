"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDict } from "@/lib/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";
import "./media.css";

/**
 * The one photograph and video slot on the site.
 *
 * Four rules live in the type, in the catalogue below and in the markup rather
 * than in an editor's memory:
 *
 *  1. A caption is required. Ogilvy counted captions as read by twice as many
 *     people as body copy, so an uncaptioned photograph is paid inventory
 *     carrying no argument. `caption` has no default, so a slot without one
 *     does not compile, and a blank or whitespace-only caption throws at
 *     render, which on a prerendered page is a failed build. The type is the
 *     first gate and the throw is the one that holds when a caller has reached
 *     for `any`.
 *  2. Every slot is a row in MEDIA_SLOTS, which carries its kind, its ratio and
 *     the brief. The page names the slot and nothing else: a slot that is not
 *     on the list is a type error, and the README is checked against the same
 *     table, so the shot list cannot drift from the code.
 *  3. A missing asset reads as a missing asset. The placeholder is flat, it is
 *     hatched, and it prints the path of the file that has to be produced, so
 *     Daniel can read the shot list off the page itself. A missing poster frame
 *     gets the same panel rather than a blank rectangle.
 *  4. The video is never the only carrier of a claim. It is muted, looping and
 *     inline, it carries no autoplay attribute, and the caption below it says
 *     in words whatever the footage shows.
 *
 * Playback is a decision, not a tag: videoAction() below holds the whole
 * policy and the effect only feeds it. A desktop plays quietly while the slot
 * is on screen, a phone holds the poster frame until it is tapped, and anything
 * off screen or behind a hidden tab is paused.
 *
 * prefers-reduced-motion suppresses autoplay on every device and never
 * suppresses the visitor's own press. Reduced motion is a request not to be
 * ambushed by movement, not a request to be refused the content, and the
 * caption plus the poster already carry the claim without it. public/media
 * /README.md states the same rule in the same words; if one changes, both do.
 *
 * The component is a client component because of that effect. It renders the
 * same markup on the server either way, and a visitor with no JavaScript gets
 * the poster frame and a control that is simply inert.
 *
 * It sets no cookie, loads no third party and reports nothing, so it is
 * independent of the consent and measurement stack in components/consent: a
 * muted inline video needs no consent to play and the measurement scripts do
 * not observe it.
 */

/**
 * The ratios a slot may declare, and the size to shoot each one at. Keep this
 * table and the reference in public/media/README.md together: Media.test.tsx
 * fails if a ratio here goes undocumented, or if the README quotes a different
 * size.
 */
export const MEDIA_RATIOS = {
  "21 / 9": { shoot: "3360 x 1440 px" },
  "16 / 9": { shoot: "3840 x 2160 px" },
  "3 / 2": { shoot: "3000 x 2000 px" },
  "4 / 3": { shoot: "4000 x 3000 px" },
  "1 / 1": { shoot: "2400 x 2400 px" },
  "4 / 5": { shoot: "2000 x 2500 px" },
} as const;

export type MediaRatio = keyof typeof MEDIA_RATIOS;

export type MediaKind = "photo" | "video";

/** The width to export a ratio at, which is the first number of its shoot size. */
export function exportWidth(ratio: MediaRatio): number {
  return Number(MEDIA_RATIOS[ratio].shoot.split(" ")[0]);
}

type MediaSlotSpec = {
  kind: MediaKind;
  ratio: MediaRatio;
  /** What has to be in the frame. This prose is the brief, and README.md quotes it. */
  frame: string;
};

/**
 * THE SHOT LIST, and the only place a slot may be invented.
 *
 * A slot id is also the path of its file under public/media without the
 * extension, so "winery/cellar" is public/media/winery/cellar.webp. The id has
 * to name the shot rather than a position on a page.
 *
 * This table is the single source of truth for three consumers that used to
 * hold their own copy and could disagree: the props type (a page can only name
 * a slot that is on this list, and only a video slot demands control labels),
 * the frame the component reserves, and public/media/README.md, which
 * Media.test.tsx checks against this table row for row in both directions. A
 * computed slot, a spread, or a wrapper cannot smuggle an undocumented shot
 * past a regex any more, because the shot list is now a type.
 */
export const MEDIA_SLOTS = {
  "home/xanic-cellar": {
    kind: "photo",
    ratio: "3 / 2",
    frame:
      "Monte Xanic, barrel room. The winemaker taking a reading with the tablet in hand, at the barrel, mid task. Not posed, not looking at the camera.",
  },
  "home/xanic-tank-log": {
    kind: "video",
    ratio: "16 / 9",
    frame:
      "The same record being written at the tank: hand, tablet, tank in frame. Steady, tripod or a rested elbow, 8 to 12 seconds.",
  },
  "home/phone-in-hand": {
    kind: "photo",
    ratio: "4 / 5",
    frame:
      "The same system on a phone, outdoors in the vineyard, screen legible in the frame. Portrait.",
  },
  "xanic/before-clipboard": {
    kind: "photo",
    ratio: "3 / 2",
    frame:
      "The old way: the paper sheet or notebook at the work station where the reading is taken. No tablet in the frame.",
  },
  "xanic/after-tablet": {
    kind: "photo",
    ratio: "3 / 2",
    frame:
      "The same station, same lens, same height, same light, with the tablet instead of the paper. The pair only works if the framing matches.",
  },
  "xanic/harvest-intake": {
    kind: "video",
    ratio: "16 / 9",
    frame:
      "Intake at the scale during harvest: the load arrives, the weight is captured once. 8 to 12 seconds, loopable.",
  },
  "winery/cellar": {
    kind: "photo",
    ratio: "3 / 2",
    frame:
      "Work in the cellar, the system present but not the subject. A person doing the job.",
  },
  "winery/vineyard": {
    kind: "photo",
    ratio: "21 / 9",
    frame:
      "The vineyard as a band: rows, horizon, Valle light. This is the one wide establishing shot.",
  },
  "winery/tasting-room": {
    kind: "photo",
    ratio: "4 / 3",
    frame:
      "The tasting room in use, a pour in progress, the room readable around it.",
  },
  "enkanto/restaurant-pass": {
    kind: "photo",
    ratio: "3 / 2",
    frame:
      "The pass at service: a ticket going out, the screen or tablet in the working position.",
  },
  "enkanto/front-desk": {
    kind: "photo",
    ratio: "3 / 2",
    frame: "Check in at the front desk, guest side of the counter visible.",
  },
  "enkanto/room-charge": {
    kind: "video",
    ratio: "16 / 9",
    frame:
      "A restaurant charge being sent to the room: the tablet at the table, then the folio. 8 to 12 seconds.",
  },
} as const satisfies Record<string, MediaSlotSpec>;

export type MediaSlot = keyof typeof MEDIA_SLOTS;

/** The slot ids of one kind, so a video slot can demand what a photo slot cannot. */
type SlotsOfKind<K extends MediaKind> = {
  [S in MediaSlot]: (typeof MEDIA_SLOTS)[S]["kind"] extends K ? S : never;
}[MediaSlot];

export type MediaPhotoSlot = SlotsOfKind<"photo">;
export type MediaVideoSlot = SlotsOfKind<"video">;

export const mediaSlots = Object.keys(MEDIA_SLOTS) as MediaSlot[];

/** The two words the video control needs, in the language of the page. */
export type VideoLabels = { play: string; pause: string };

type MediaBase = {
  /**
   * REQUIRED, and the reason this component exists. The caption carries the
   * result the picture is evidence for. It is read far more than the body copy
   * around it, so it is written as a sentence, not as a label. Blank and
   * whitespace-only are rejected at render.
   */
  caption: string;
  /** Alternative text. What is in the frame, for a reader who cannot see it. */
  alt: string;
  /** Omit until the file exists. Absent means the slot renders pending. */
  src?: string;
  /**
   * Identity v3: one full colour photograph per page, at the top. Everything
   * else is pulled toward the palette, which is the default here.
   */
  tone?: "full" | "tint";
  className?: string;
  /** Set on the one slot above the fold, which loads eagerly. */
  priority?: boolean;
};

export type MediaPhotoProps = MediaBase & { slot: MediaPhotoSlot };

export type MediaVideoProps = MediaBase & {
  slot: MediaVideoSlot;
  /** Defaults to the slot's own poster file. */
  poster?: string;
  /** Required: the control is the visitor's way to stop a moving picture. */
  labels: VideoLabels;
};

export type MediaProps = MediaPhotoProps | MediaVideoProps;

/** The file a slot expects: .webp for a photograph, .mp4 for footage. */
export function mediaFile(kind: MediaKind, slot: string): string {
  return `/media/${slot}.${kind === "video" ? "mp4" : "webp"}`;
}

/** The frame a video shows before it plays, and all a phone shows until a tap. */
export function posterFile(slot: string): string {
  return `/media/${slot}-poster.webp`;
}

/**
 * The text a slot may not ship without.
 *
 * The type stops an omitted caption for every caller the typechecker can see.
 * It cannot stop `caption=""`, a wrapper that defaults a missing caption to the
 * empty string, or a call site that has reached for `any`, and all three render
 * an empty figcaption, which is the whole promise bypassed with ordinary input
 * (reviewer finding, round two). So the same rule is enforced again here where
 * the value actually is. Every page on this site is prerendered, so a blank
 * caption is a failed `next build` rather than a broken page.
 */
export function assertMediaText(slot: string, caption: string, alt: string): void {
  if (typeof caption !== "string" || caption.trim() === "") {
    throw new Error(
      `Media slot "${slot}": caption is blank. A slot exists to carry a caption, ` +
        `so a blank one is a bug, not a style. See public/media/README.md.`,
    );
  }
  if (typeof alt !== "string" || alt.trim() === "") {
    throw new Error(
      `Media slot "${slot}": alt is blank. Describe what is in the frame for a ` +
        `reader who cannot see it. See public/media/README.md.`,
    );
  }
}

/**
 * The slot has to be on the shot list. The type says so already; this catches
 * the caller that spread an `any`, which no type can.
 */
export function mediaSpec(slot: string): MediaSlotSpec {
  const spec = (MEDIA_SLOTS as Record<string, MediaSlotSpec>)[slot];
  if (!spec) {
    throw new Error(
      `Media: "${slot}" is not a slot. Add a row to MEDIA_SLOTS in ` +
        `components/site/Media.tsx and to public/media/README.md first, so the ` +
        `shot gets a brief before a page asks for it.`,
    );
  }
  return spec;
}

/**
 * Narrows the union by the slot's own row on the shot list, so the branches
 * below take a typed slot instead of a cast.
 */
export function isVideoProps(props: MediaProps): props is MediaVideoProps {
  return mediaSpec(props.slot).kind === "video";
}

/**
 * Which source the frame may show.
 *
 * A source that failed is remembered by URL and not by a boolean: a boolean
 * latched on for the life of the component, so pointing the same slot at a
 * working replacement left it hidden behind the placeholder forever (reviewer
 * finding, round two).
 */
export function visibleSrc(
  src: string | undefined,
  failedSrc: string | null,
): string | undefined {
  return src !== undefined && src !== failedSrc ? src : undefined;
}

/** What the visitor has asked for. "auto" means they have not said. */
export type VideoIntent = "auto" | "play" | "pause";

export type VideoConditions = {
  intent: VideoIntent;
  /** The slot is on screen (no IntersectionObserver is treated as on screen). */
  visible: boolean;
  /** document.hidden: another tab, or the phone locked. */
  documentHidden: boolean;
  /** prefers-reduced-motion: reduce. */
  reduceMotion: boolean;
  /** A touch screen: a phone or a tablet, where the policy is tap to play. */
  tapToPlay: boolean;
};

/**
 * The whole playback policy, in one pure function so it can be tested as a
 * table rather than through a browser. Read in order:
 *
 *  - a visitor who paused it has the last word;
 *  - nothing plays off screen or behind a hidden tab, which is the battery and
 *    the distraction rule;
 *  - a visitor who pressed play gets play, including under reduced motion,
 *    because they asked for this one. Reduced motion governs what the page does
 *    on its own, never what the visitor asked it to do;
 *  - otherwise only a pointer device that has not asked for less motion
 *    autoplays. A phone gets the poster frame and a tap.
 */
export function videoAction(c: VideoConditions): "play" | "pause" {
  if (c.intent === "pause") return "pause";
  if (!c.visible || c.documentHidden) return "pause";
  if (c.intent === "play") return "play";
  if (c.reduceMotion || c.tapToPlay) return "pause";
  return "play";
}

/** Everything one mounted video slot remembers. */
export type VideoSlotState = {
  src: string;
  poster: string;
  intent: VideoIntent;
  playing: boolean;
  posterFailed: boolean;
};

/**
 * State a slot carries into a render.
 *
 * A page can point a mounted slot at a different cut without remounting it.
 * The element pauses while it swaps the resource, so the old source's intent
 * and playback flag would otherwise leak onto the new one and a paused slot
 * would silently start (reviewer finding, round two). Identity is preserved
 * when nothing changed, so React bails out instead of looping.
 */
export function videoStateOnRender(
  prev: VideoSlotState,
  src: string,
  poster: string,
): VideoSlotState {
  if (prev.src === src && prev.poster === poster) return prev;
  return { src, poster, intent: "auto", playing: false, posterFailed: false };
}

/** What covers a video that is not playing. */
export function posterOverlay(c: {
  playing: boolean;
  posterFailed: boolean;
}): "image" | "pending" | "none" {
  if (c.playing) return "none";
  return c.posterFailed ? "pending" : "image";
}

/** The element the press handler needs. Narrow on purpose, so a test can be one. */
export type PlayableElement = {
  play(): Promise<void> | undefined;
  pause(): void;
};

/**
 * What a press does, as a value rather than as a side effect.
 *
 * The command is issued on the element inside the click handler and not from
 * the effect that a state change would schedule: a user-gesture requirement is
 * measured at the gesture, and a control whose only route to play() was a state
 * change died the first time the browser refused one (reviewer finding, round
 * two, with the failing trace).
 */
export function videoPress(playing: boolean): {
  intent: VideoIntent;
  command: "play" | "pause";
} {
  return playing
    ? { intent: "pause", command: "pause" }
    : { intent: "play", command: "play" };
}

/**
 * A refused play() gives the recorded intent back.
 *
 * Without this, intent stays "play" while the element stays paused, so the next
 * press computes "play" again, React drops the identical update, the effect
 * never re-runs and play() is never called again: the control is dead for the
 * rest of the session even after the browser stops refusing. iOS Low Power Mode
 * is exactly that state, and on a phone this control is the only way to start
 * the video.
 */
export function videoRefused(intent: VideoIntent): VideoIntent {
  return intent === "play" ? "auto" : intent;
}

export type IntentUpdate = VideoIntent | ((cur: VideoIntent) => VideoIntent);

/**
 * The press handler itself, exported so the dead-control regression can be
 * driven without a browser. Issue the command now, record the intent, and hand
 * the intent back if the browser refuses.
 */
export function pressVideo(
  el: PlayableElement | null,
  playing: boolean,
  setIntent: (update: IntentUpdate) => void,
): void {
  const { intent, command } = videoPress(playing);
  setIntent(intent);
  if (!el) return;
  if (command === "pause") {
    el.pause();
    return;
  }
  const started = el.play();
  if (started && typeof started.catch === "function") {
    started.catch(() => setIntent(videoRefused));
  }
}

/**
 * The pending panel's two words. They live with the component rather than in
 * lib/i18n because they are build chrome and not page copy: the panel only
 * exists while a file is outstanding. They were hardcoded Spanish, which put
 * FOTO PENDIENTE on the English pages of a bilingual site.
 */
export const MEDIA_PENDING_LABEL: Record<Locale, Record<MediaKind, string>> = {
  es: { photo: "FOTO PENDIENTE", video: "VIDEO PENDIENTE" },
  en: { photo: "PHOTO PENDING", video: "VIDEO PENDING" },
};

export default function Media(props: MediaProps) {
  const { slot, caption, alt, tone = "tint", className, priority = false } = props;
  const spec = mediaSpec(slot);
  assertMediaText(slot, caption, alt);

  // A file that 404s falls back to the placeholder rather than to a broken
  // image icon, so a wrong path looks like what it is: a slot still pending.
  // The URL is remembered, never a boolean, so a replacement is not punished
  // for its predecessor.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  // Stable, so the video's effect is not torn down and rebuilt on every render.
  const fail = useCallback((bad: string) => setFailedSrc(bad), []);
  const src = visibleSrc(props.src, failedSrc);

  const classes = ["media", `media--${tone}`, className].filter(Boolean).join(" ");

  return (
    <figure
      className={classes}
      data-slot={slot}
      data-pending={src === undefined ? "true" : undefined}
    >
      <div className="media-frame" style={{ aspectRatio: spec.ratio }}>
        {src === undefined ? (
          <MediaPending
            kind={spec.kind}
            ratio={spec.ratio}
            files={
              spec.kind === "video"
                ? [mediaFile("video", slot), posterFile(slot)]
                : [mediaFile("photo", slot)]
            }
          />
        ) : isVideoProps(props) ? (
          <MediaVideo
            slot={props.slot}
            ratio={spec.ratio}
            alt={alt}
            src={src}
            poster={props.poster ?? posterFile(props.slot)}
            labels={props.labels}
            priority={priority}
            onFail={fail}
          />
        ) : (
          <FrameImage
            className="media-asset"
            src={src}
            alt={alt}
            priority={priority}
            onBroken={fail}
          />
        )}
      </div>
      <figcaption className="media-cap">{caption}</figcaption>
    </figure>
  );
}

/**
 * An image inside the frame, for the photograph and for a video's poster.
 *
 * It owns an effect for one reason: an image can finish, and fail, before React
 * hydrates the page, and the error event that happened then is gone by the time
 * the handler is attached. Asking the element directly on mount catches that
 * case, so a wrong path always reads as a pending slot and never as a broken
 * image icon or a blank rectangle.
 */
function FrameImage({
  className,
  src,
  alt,
  priority,
  onBroken,
}: {
  className: string;
  src: string;
  alt: string;
  priority: boolean;
  onBroken: (src: string) => void;
}) {
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) onBroken(src);
  }, [src, onBroken]);

  return (
    <img
      ref={ref}
      className={className}
      src={src}
      alt={alt}
      aria-hidden={alt === "" ? "true" : undefined}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => onBroken(src)}
    />
  );
}

/**
 * The pending state. Flat, hatched and technical on purpose: it is a brief, so
 * it names the files, the ratio and the size to shoot to, and it could not be
 * mistaken for a photograph at any size.
 */
function MediaPending({
  kind,
  ratio,
  files,
}: {
  kind: MediaKind;
  ratio: MediaRatio;
  files: string[];
}) {
  const label = useDict(MEDIA_PENDING_LABEL);

  return (
    <div className="media-pending">
      <span className="media-pending-tag">{label[kind]}</span>
      {files.map((file) => (
        <span className="media-pending-file" key={file}>
          {file}
        </span>
      ))}
      <span className="media-pending-spec">
        {ratio}, {MEDIA_RATIOS[ratio].shoot}
      </span>
    </div>
  );
}

function MediaVideo({
  slot,
  ratio,
  alt,
  src,
  poster,
  labels,
  priority,
  onFail,
}: {
  slot: MediaVideoSlot;
  ratio: MediaRatio;
  alt: string;
  src: string;
  poster: string;
  labels: VideoLabels;
  priority: boolean;
  onFail: (src: string) => void;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [stored, setStored] = useState<VideoSlotState>(() => ({
    src,
    poster,
    intent: "auto",
    playing: false,
    posterFailed: false,
  }));

  // Adjusting state while rendering, which is React's own answer to a prop that
  // invalidates state. A new source has never been played or paused by anyone.
  const state = videoStateOnRender(stored, src, poster);
  if (state !== stored) setStored(state);
  const { intent, playing, posterFailed } = state;

  // Returning the same object is the bailout, stated here rather than left to
  // React's identity check, because it is the bailout that made the control
  // inert. videoRefused is what makes the next press a different value.
  const setIntent = useCallback((update: IntentUpdate) => {
    setStored((s) => {
      const next = typeof update === "function" ? update(s.intent) : update;
      return next === s.intent ? s : { ...s, intent: next };
    });
  }, []);

  const setPlaying = useCallback((value: boolean) => {
    setStored((s) => (s.playing === value ? s : { ...s, playing: value }));
  }, []);

  const failPoster = useCallback(() => {
    setStored((s) => (s.posterFailed ? s : { ...s, posterFailed: true }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Property as well as attribute: a browser that ignores the attribute on a
    // dynamically played element still gets a silent video.
    el.muted = true;

    // A source that failed before hydration fired its error event into nothing,
    // so ask the element rather than wait for one.
    if (el.error) onFail(src);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(hover: none), (pointer: coarse)");

    // Without IntersectionObserver the slot counts as on screen, which leaves
    // the rest of the policy (reduced motion, touch, hidden tab) in force.
    const observed = "IntersectionObserver" in window;
    let visible = !observed;

    function apply() {
      const el = ref.current;
      if (!el) return;
      const action = videoAction({
        intent,
        visible,
        documentHidden: document.hidden,
        reduceMotion: reduce.matches,
        tapToPlay: touch.matches,
      });
      if (action === "pause") {
        el.pause();
        return;
      }
      const started = el.play();
      // A refusal (low power mode, an older policy) gives the intent back, so
      // the control stays live. The poster is still up, and the caption has
      // carried the claim all along.
      if (started && typeof started.catch === "function") {
        started.catch(() => setIntent(videoRefused));
      }
    }

    let io: IntersectionObserver | null = null;
    if (observed) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) visible = entry.isIntersecting;
          apply();
        },
        { threshold: 0.35 },
      );
      io.observe(el);
    }

    document.addEventListener("visibilitychange", apply);
    reduce.addEventListener("change", apply);
    touch.addEventListener("change", apply);
    apply();

    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", apply);
      reduce.removeEventListener("change", apply);
      touch.removeEventListener("change", apply);
    };
  }, [intent, src, onFail, setIntent]);

  const overlay = posterOverlay({ playing, posterFailed });

  return (
    <>
      <video
        ref={ref}
        className="media-asset"
        data-slot={slot}
        src={src}
        poster={posterFailed ? undefined : poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => onFail(src)}
      />
      {/* The poster attribute alone is not enough: a poster that 404s leaves a
          blank rectangle and fires nothing, and the poster is all a phone and
          all a reduced-motion visitor ever see. Loading it as a real element
          means a missing frame falls back to the brief that names it. */}
      {overlay === "image" ? (
        <FrameImage
          className="media-asset media-poster"
          src={poster}
          alt=""
          priority={priority}
          onBroken={failPoster}
        />
      ) : null}
      {overlay === "pending" ? (
        <div className="media-poster">
          <MediaPending kind="video" ratio={ratio} files={[poster]} />
        </div>
      ) : null}
      <button
        type="button"
        className="media-play"
        data-playing={playing ? "true" : "false"}
        aria-label={playing ? labels.pause : labels.play}
        onClick={() => pressVideo(ref.current, playing, setIntent)}
      >
        <span className="media-play-glyph" aria-hidden="true" />
      </button>
    </>
  );
}
