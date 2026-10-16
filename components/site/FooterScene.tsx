"use client";

import { useEffect, useRef } from "react";
import {
  SCENE_ART_D,
  SCENE_ART_TRANSFORM,
  SCENE_ART_VIEWBOX,
  SCENE_LINE_D,
  SCENE_LINE_TRANSFORM,
  SCENE_LINE_VIEWBOX,
} from "@/components/site/footer-scene-paths";
import { clearsThreshold } from "@/lib/onscreen";

/** How long the tumbleweed waits before it rolls again while the scene stays
    in view. */
export const TUMBLEWEED_PAUSE_MS = 25_000;
/** How much of the band must be on screen to count as in view. */
const SCENE_VISIBLE = 0.6;

/**
 * The band at the foot of every page (Daniel, 2026-10-16): the long logo in
 * the text ink, a horse on the ground line at the right that eats and then
 * stands for five seconds, and a tumbleweed that rolls in from the left,
 * passes behind the saguaro and the mountain, and bounces on until it leaves
 * the screen. It rolls each time the band comes into view and again every
 * TUMBLEWEED_PAUSE_MS while it stays there. Decorative only: hidden from
 * assistive tech, and still under prefers-reduced-motion (no tumbleweed, the
 * horse a single frame).
 */
export default function FooterScene() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let visible = false;
    let rolling = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const clearTimer = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
    };
    const roll = () => {
      timer = undefined;
      if (!visible || rolling || still.matches) return;
      rolling = true;
      el.dataset.rolling = "true";
    };
    // Reduced motion hides the track, which cancels the roll without an
    // animationend, so the state is reset here rather than left waiting.
    const onStill = () => {
      clearTimer();
      if (still.matches) {
        rolling = false;
        delete el.dataset.rolling;
      } else {
        roll();
      }
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName !== "tumbleweed-across") return;
      rolling = false;
      delete el.dataset.rolling;
      if (visible) timer = setTimeout(roll, TUMBLEWEED_PAUSE_MS);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = clearsThreshold(entry, SCENE_VISIBLE);
        if (visible) {
          if (!rolling && timer === undefined) roll();
        } else {
          clearTimer();
        }
      },
      { threshold: SCENE_VISIBLE },
    );
    el.addEventListener("animationend", onEnd);
    still.addEventListener("change", onStill);
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener("animationend", onEnd);
      still.removeEventListener("change", onStill);
      clearTimer();
    };
  }, []);

  return (
    <div className="foot-scene" ref={root} aria-hidden="true">
      <div className="scene-tw-track">
        <span className="scene-tw">
          <span className="scene-tw-bounce">
            <span className="scene-tw-spin" />
          </span>
        </span>
      </div>
      <svg className="scene-art" viewBox={SCENE_ART_VIEWBOX} focusable="false">
        <g fill="currentColor" transform={SCENE_ART_TRANSFORM}>
          <path d={SCENE_ART_D} />
        </g>
      </svg>
      <svg
        className="scene-line"
        viewBox={SCENE_LINE_VIEWBOX}
        preserveAspectRatio="none"
        focusable="false"
      >
        <g fill="currentColor" transform={SCENE_LINE_TRANSFORM}>
          <path d={SCENE_LINE_D} />
        </g>
      </svg>
      <picture>
        <source media="(prefers-reduced-motion: reduce)" srcSet="/brand/footer/horse-still.webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="scene-horse"
          src="/brand/footer/horse.webp"
          alt=""
          width={256}
          height={180}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
  );
}
