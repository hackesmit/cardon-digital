"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./media.css";

/**
 * The one photograph and video slot on the site.
 *
 * Four rules live in the type and in the markup rather than in an editor's
 * memory:
 *
 *  1. A caption is required. Ogilvy counted captions as read by twice as many
 *     people as body copy, so an uncaptioned photograph is paid inventory
 *     carrying no argument. `caption` has no default, so a slot without one
 *     does not compile.
 *  2. Every slot declares its ratio and reserves that box before the asset
 *     exists. The placeholder and the finished photograph occupy exactly the
 *     same space, so nothing on the page reflows the day the file lands.
 *  3. A missing asset reads as a missing asset. The placeholder is flat, it is
 *     hatched, and it prints the path of the file that has to be produced, so
 *     Daniel can read the shot list off the page itself.
 *  4. The video is never the only carrier of a claim. It is muted, looping and
 *     inline, it carries no autoplay attribute, and the caption below it says
 *     in words whatever the footage shows.
 *
 * Playback is a decision, not a tag: videoAction() below holds the whole
 * policy and the effect only feeds it. A desktop plays quietly while the slot
 * is on screen, a phone holds the poster frame until it is tapped,
 * prefers-reduced-motion holds the poster on both, and anything off screen or
 * behind a hidden tab is paused.
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

/** The two words the video control needs, in the language of the page. */
export type VideoLabels = { play: string; pause: string };

type MediaBase = {
  /**
   * Slot id, which is also the path of the file under public/media without an
   * extension: "winery/cellar" is public/media/winery/cellar.webp. It is what
   * the placeholder prints, so it has to name the shot, not a position on a
   * page.
   */
  slot: string;
  /**
   * REQUIRED, and the reason this component exists. The caption carries the
   * result the picture is evidence for. It is read far more than the body copy
   * around it, so it is written as a sentence, not as a label.
   */
  caption: string;
  /** Alternative text. What is in the frame, for a reader who cannot see it. */
  alt: string;
  /** The box the slot reserves, from the table above. */
  ratio: MediaRatio;
  /**
   * Identity v3: one full colour photograph per page, at the top. Everything
   * else is pulled toward the palette, which is the default here.
   */
  tone?: "full" | "tint";
  className?: string;
  /** Set on the one slot above the fold, which loads eagerly. */
  priority?: boolean;
};

export type MediaPhotoProps = MediaBase & {
  kind: "photo";
  /** Omit until the photograph exists. Absent means the slot renders pending. */
  src?: string;
};

export type MediaVideoProps = MediaBase & {
  kind: "video";
  /** Omit until the footage exists. Absent means the slot renders pending. */
  src?: string;
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
 *  - a visitor who pressed play gets play, even under reduced motion, because
 *    they asked for this one;
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

export default function Media(props: MediaProps) {
  const { slot, caption, alt, ratio, tone = "tint", className, priority = false } = props;

  // A file that 404s falls back to the placeholder rather than to a broken
  // image icon, so a wrong path looks like what it is: a slot still pending.
  const [failed, setFailed] = useState(false);
  // Stable, so the video's effect is not torn down and rebuilt on every render.
  const fail = useCallback(() => setFailed(true), []);
  // Narrowed once here, so the branches below take a string and not a cast.
  const src = failed ? undefined : props.src;

  const classes = ["media", `media--${tone}`, className].filter(Boolean).join(" ");

  return (
    <figure
      className={classes}
      data-slot={slot}
      data-pending={src === undefined ? "true" : undefined}
    >
      <div className="media-frame" style={{ aspectRatio: ratio }}>
        {src === undefined ? (
          <MediaPending kind={props.kind} slot={slot} ratio={ratio} />
        ) : props.kind === "video" ? (
          <MediaVideo
            slot={slot}
            alt={alt}
            src={src}
            poster={props.poster ?? posterFile(slot)}
            labels={props.labels}
            onFail={fail}
          />
        ) : (
          <MediaPhoto
            src={src}
            alt={alt}
            priority={priority}
            onFail={fail}
          />
        )}
      </div>
      <figcaption className="media-cap">{caption}</figcaption>
    </figure>
  );
}

/**
 * The photograph. It owns an effect for one reason: an image can finish, and
 * fail, before React hydrates the page, and the error event that happened then
 * is gone by the time the handler is attached. Asking the element directly on
 * mount catches that case, so a wrong path always reads as a pending slot and
 * never as a broken image icon.
 */
function MediaPhoto({
  src,
  alt,
  priority,
  onFail,
}: {
  src: string;
  alt: string;
  priority: boolean;
  onFail: () => void;
}) {
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) onFail();
  }, [src, onFail]);

  return (
    <img
      ref={ref}
      className="media-asset"
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={onFail}
    />
  );
}

/**
 * The pending state. Flat, hatched and technical on purpose: it is a brief, so
 * it names the file, the ratio and the size to shoot to, and it could not be
 * mistaken for a photograph at any size.
 */
function MediaPending({
  kind,
  slot,
  ratio,
}: {
  kind: MediaKind;
  slot: string;
  ratio: MediaRatio;
}) {
  return (
    <div className="media-pending">
      <span className="media-pending-tag">{kind === "video" ? "VIDEO" : "FOTO"} PENDIENTE</span>
      <span className="media-pending-file">{mediaFile(kind, slot)}</span>
      {kind === "video" ? (
        <span className="media-pending-file">{posterFile(slot)}</span>
      ) : null}
      <span className="media-pending-spec">
        {ratio}, {MEDIA_RATIOS[ratio].shoot}
      </span>
    </div>
  );
}

function MediaVideo({
  slot,
  alt,
  src,
  poster,
  labels,
  onFail,
}: {
  slot: string;
  alt: string;
  src: string;
  poster: string;
  labels: VideoLabels;
  onFail: () => void;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [intent, setIntent] = useState<VideoIntent>("auto");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Property as well as attribute: a browser that ignores the attribute on a
    // dynamically played element still gets a silent video.
    el.muted = true;

    // A source that failed before hydration fired its error event into nothing,
    // so ask the element rather than wait for one.
    if (el.error) onFail();

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
      // A browser may still refuse (low power mode, an older policy). The
      // poster stays up and the control still works, so nothing depends on it.
      const started = el.play();
      if (started && typeof started.catch === "function") started.catch(() => {});
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
  }, [intent, onFail]);

  return (
    <>
      <video
        ref={ref}
        className="media-asset"
        data-slot={slot}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={onFail}
      />
      <button
        type="button"
        className="media-play"
        data-playing={playing ? "true" : "false"}
        aria-label={playing ? labels.pause : labels.play}
        onClick={() => setIntent(playing ? "pause" : "play")}
      >
        <span className="media-play-glyph" aria-hidden="true" />
      </button>
    </>
  );
}
