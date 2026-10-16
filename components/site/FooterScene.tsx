"use client";

import { useEffect, useRef } from "react";
import {
  SCENE_ART_D,
  SCENE_ART_TRANSFORM,
  SCENE_ART_VIEWBOX,
  SCENE_LINE_D,
  SCENE_LINE_TRANSFORM,
  SCENE_LINE_VIEWBOX,
  SCENE_LEFT_D,
  SCENE_LEFT_TRANSFORM,
  SCENE_LEFT_VIEWBOX,
} from "@/components/site/footer-scene-paths";
import { clearsThreshold } from "@/lib/onscreen";

/** How long the tumbleweed waits before it rolls again while the scene stays
    in view. */
export const TUMBLEWEED_PAUSE_MS = 25_000;
/** About one bounce, and the drop off the end of the line, in seconds; the
    CSS animations use the same numbers. */
const BOUNCE_S = 1.1;
const FALL_S = 0.7;
/** How much of the band must be on screen to count as in view. */
const SCENE_VISIBLE = 0.6;

/**
 * The band at the foot of every page (Daniel, 2026-10-16): the long logo in
 * the text ink, a horse on the ground line at the right that eats and then
 * stands for five seconds, and a tumbleweed that rolls in from the left,
 * passes behind the saguaro and the mountain, bounces along the line and
 * drops off its end (Daniel, 2026-10-16: off the end it falls, it does not
 * bounce on air). It rolls each time the band comes into view and again every
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
    // The crossing is measured each time, because where the line ends and
    // how big the tumbleweed is both follow the width of the screen. It rolls
    // at a speed tied to the band height, so a phone sees the same pace.
    const roll = () => {
      timer = undefined;
      if (!visible || rolling || still.matches) return;
      const line = el.querySelector<SVGElement>(".scene-line");
      const tw = el.querySelector<HTMLElement>(".scene-tw");
      if (!line || !tw) return;
      const band = el.getBoundingClientRect();
      const size = tw.offsetWidth;
      const end = line.getBoundingClientRect().right - band.left;
      const speed = band.height * 1.1;
      const distance = end + size / 2 + 4;
      const seconds = distance / speed;
      el.style.setProperty("--roll-x", `${end - size / 2}px`);
      el.style.setProperty("--roll-t", `${seconds.toFixed(3)}s`);
      // A whole number of bounces, so the last one lands on the line just as
      // the tumbleweed reaches its end and the drop starts from the ground.
      const bounces = Math.max(1, Math.round(seconds / BOUNCE_S));
      el.style.setProperty("--bounce-n", `${bounces}`);
      el.style.setProperty("--bounce-d", `${(seconds / bounces).toFixed(3)}s`);
      el.style.setProperty("--fall-dx", `${(speed * FALL_S * 0.6).toFixed(1)}px`);
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
      if (e.animationName !== "tumbleweed-fall-y") return;
      rolling = false;
      delete el.dataset.rolling;
      if (visible) timer = setTimeout(roll, TUMBLEWEED_PAUSE_MS);
    };
    const io = new IntersectionObserver(
      (entries) => {
        visible = clearsThreshold(entries[entries.length - 1], SCENE_VISIBLE);
        if (visible) {
          if (!rolling && timer === undefined) roll();
        } else {
          // Leaving ends the roll, so coming back rolls in from the left
          // rather than showing the tail of the old crossing.
          clearTimer();
          rolling = false;
          delete el.dataset.rolling;
        }
      },
      { threshold: SCENE_VISIBLE },
    );
    // The crossing was measured for one width; if the band changes width
    // mid-roll, start the roll again from the left with fresh numbers.
    let width = el.clientWidth;
    const ro =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(() => {
            if (el.clientWidth === width) return;
            width = el.clientWidth;
            if (!rolling) return;
            rolling = false;
            delete el.dataset.rolling;
            void el.offsetWidth; // let the removal land so the animations restart
            roll();
          });
    ro?.observe(el);
    el.addEventListener("animationend", onEnd);
    still.addEventListener("change", onStill);
    io.observe(el);
    return () => {
      io.disconnect();
      ro?.disconnect();
      el.removeEventListener("animationend", onEnd);
      still.removeEventListener("change", onStill);
      clearTimer();
    };
  }, []);

  return (
    <div className="foot-scene" ref={root} aria-hidden="true">
      <div className="scene-tw-track">
        <span className="scene-tw">
          <span className="scene-tw-fall-x">
            <span className="scene-tw-fall-y">
              <span className="scene-tw-bounce">
                <span className="scene-tw-spin" />
              </span>
            </span>
          </span>
        </span>
      </div>
      <svg
        className="scene-left"
        viewBox={SCENE_LEFT_VIEWBOX}
        preserveAspectRatio="none"
        focusable="false"
      >
        <g fill="currentColor" transform={SCENE_LEFT_TRANSFORM}>
          <path d={SCENE_LEFT_D} />
        </g>
      </svg>
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
          width={211}
          height={150}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
  );
}
