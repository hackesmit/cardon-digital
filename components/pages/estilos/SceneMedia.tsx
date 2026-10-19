"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clearsThreshold } from "@/lib/onscreen";
import {
  MEDIA_VISIBLE,
  pressVideo,
  videoAction,
  videoRefused,
  type VideoIntent,
  type VideoLabels,
} from "@/components/site/Media";
import {
  SCENE_ARM_MARGIN,
  armState,
  stillPath,
  videoSources,
  type SceneLayer,
} from "./sceneMedia";

/**
 * One layer of real material inside a style sample on /estilos.
 *
 * It is decoration and it is hidden from a screen reader: the sample is an
 * invented business's home page, the footage carries no claim of ours, and the
 * page already says in words that every sample is a sample. That is the
 * opposite of components/site/Media.tsx, whose whole reason for existing is
 * the caption, which is why this is a second component and not a prop on that
 * one (see components/pages/estilos/sceneMedia.ts).
 *
 * What it does NOT reimplement is the playback policy. videoAction and
 * pressVideo come from Media.tsx, so a phone holds the poster until it is
 * tapped, a visitor who asked for less motion gets the poster and an opt in,
 * nothing plays off screen or behind a hidden tab, and a refused play() hands
 * the intent back instead of killing the control. One policy, two surfaces.
 *
 * Two things are this component's own:
 *
 *  1. Arming. The <source> elements do not exist until an observer says the
 *     scene is within SCENE_ARM_MARGIN of the viewport, so a visitor who never
 *     scrolls past the hero never fetches a megabyte of video. preload="none"
 *     alone is a hint; an element with no source cannot fetch anything. The
 *     poster is a plain attribute throughout, so the frame is never empty.
 *  2. The control. A sample is otherwise inert, and deliberately so, but a
 *     moving picture needs a way to stop it, so each clip carries one labelled
 *     button. It is chrome, not part of the mock design, and it is the only
 *     thing inside a scene a pointer can reach.
 */
export default function SceneMedia({
  layer,
  labels,
}: {
  layer: SceneLayer;
  /** The control's two words, in the language of the page. */
  labels: VideoLabels;
}) {
  const className = `sc-shot sc-shot--${layer.role}`;
  const still = stillPath(layer);

  if (layer.kind === "photo") {
    return (
      <div className={className} data-shot={layer.file} aria-hidden="true">
        <img className="sc-shot-asset" src={still} alt="" loading="lazy" decoding="async" />
      </div>
    );
  }

  return <SceneVideo className={className} layer={layer} poster={still} labels={labels} />;
}

function SceneVideo({
  className,
  layer,
  poster,
  labels,
}: {
  className: string;
  layer: SceneLayer;
  poster: string;
  labels: VideoLabels;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [intent, setIntentState] = useState<VideoIntent>("auto");
  const [playing, setPlaying] = useState(false);

  const setIntent = useCallback((update: VideoIntent | ((cur: VideoIntent) => VideoIntent)) => {
    setIntentState((cur) => {
      const next = typeof update === "function" ? update(cur) : update;
      return next === cur ? cur : next;
    });
  }, []);

  // The policy's inputs live in refs so re-applying it never means rebuilding
  // the observers, which is the stutter Media.tsx records in its own comment.
  const intentRef = useRef(intent);
  intentRef.current = intent;
  const visibleRef = useRef(false);
  const armedRef = useRef(armed);
  armedRef.current = armed;

  const apply = useCallback(() => {
    const el = ref.current;
    if (!el || !armedRef.current) return;
    const action = videoAction({
      intent: intentRef.current,
      visible: visibleRef.current,
      documentHidden: document.hidden,
      reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      tapToPlay: window.matchMedia("(hover: none), (pointer: coarse)").matches,
    });
    if (action === "pause") {
      el.pause();
      return;
    }
    const started = el.play();
    if (started && typeof started.catch === "function") {
      started.catch(() => setIntent(videoRefused));
    }
  }, [setIntent]);

  // Arming, on its own observer because it needs a margin the playback
  // threshold must not have: loading starts early, playing starts on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || armed) return;
    if (!("IntersectionObserver" in window)) {
      setArmed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        let near = false;
        for (const entry of entries) near = near || clearsThreshold(entry, 0);
        setArmed((cur) => armState(cur, near));
      },
      { rootMargin: SCENE_ARM_MARGIN, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  // Children of a <video> are read when the resource is selected, so sources
  // that appear after mount do nothing until the element is told to look again.
  useEffect(() => {
    const el = ref.current;
    if (!el || !armed) return;
    el.load();
    apply();
  }, [armed, apply]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(hover: none), (pointer: coarse)");
    const observed = "IntersectionObserver" in window;
    if (!observed) visibleRef.current = true;

    let io: IntersectionObserver | null = null;
    if (observed) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) visibleRef.current = clearsThreshold(entry, MEDIA_VISIBLE);
          apply();
        },
        { threshold: MEDIA_VISIBLE },
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
  }, [apply]);

  useEffect(() => {
    apply();
  }, [intent, apply]);

  return (
    <div className={className} data-shot={layer.file} data-armed={armed ? "true" : "false"}>
      <video
        ref={ref}
        className="sc-shot-asset"
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {armed
          ? videoSources(layer.file).map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))
          : null}
      </video>
      <button
        type="button"
        className="sc-shot-play"
        data-playing={playing ? "true" : "false"}
        aria-label={playing ? labels.pause : labels.play}
        onClick={() => {
          // A press before the observer has armed the element would otherwise
          // call play() on a video with no source, which the browser refuses
          // and which hands the intent straight back. Arm it and record the
          // intent instead; the arming effect calls load() and then the
          // policy, which starts it.
          if (!armed) {
            setArmed(true);
            setIntent("play");
            return;
          }
          pressVideo(ref.current, playing, setIntent);
        }}
      >
        <span className="sc-shot-glyph" aria-hidden="true" />
      </button>
    </div>
  );
}
