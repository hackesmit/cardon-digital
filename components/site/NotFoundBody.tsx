"use client";

import Link from "@/components/site/Link";
import { useEffect, useRef } from "react";
import {
  SCENE_ART_D,
  SCENE_ART_TRANSFORM,
  SCENE_LINE_D,
  SCENE_LINE_TRANSFORM,
  SCENE_LEFT_D,
  SCENE_LEFT_TRANSFORM,
} from "@/components/site/footer-scene-paths";
import { clearsThreshold } from "@/lib/onscreen";
import { localePath, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/i18n/site";
import "./not-found.css";

/**
 * The footer scene's three boxes, cut just under the ground line (row 356 of
 * the drawing's 465, so 336 rows from the top of each box): the saguaro, the
 * mountain and the sun without the CARDON DIGITAL lettering that sits below
 * the line in the footer band, and both stretches of horizon without the stray
 * ink of that lettering. Same paths and same transforms as the footer, so the
 * drawing keeps its shape and all three boxes keep one vertical scale, which
 * is what puts the whole horizon on one row.
 */
export const NF_ART_VIEWBOX = "40 30 860 336";
export const NF_LINE_VIEWBOX = "900 30 4155 336";
export const NF_LEFT_VIEWBOX = "0 30 800 336";

/** The delay before the tumbleweed rolls in, and how long it waits to roll
    again while the page stays on screen. */
const START_DELAY_MS = 700;
const REPEAT_MS = 18_000;
/** About one bounce, and the drop off the end of the line, in seconds; the
    CSS animations in not-found.css use the same numbers. */
const BOUNCE_S = 1;
const FALL_S = 0.7;
/** How much of the band must be on screen for the roll to run. */
const SCENE_VISIBLE = 0.5;

/**
 * The 404 (bead hq-0xca.1, Daniel 2026-10-19). The one page that is meant to
 * be empty gets the site's own desert: the hand-drawn Cardon line runs across
 * the foot of the page, the drawing stands on it at the left, the code sits on
 * it at the right, and the tumbleweed rolls in from the left, passes behind
 * the saguaro, nudges the code on its way past and drops off the end of the
 * line into nothing.
 *
 * This is the only place the tumbleweed falls off the line on purpose (Daniel:
 * do not abuse the tumbleweed), so the footer band's own tumbleweed is hidden
 * here and the page carries the joke once.
 *
 * The crossing is measured rather than guessed, because where the line ends,
 * how big the tumbleweed is and where the code stands all follow the width of
 * the screen: the roll gets a speed tied to the band height, a whole number of
 * bounces so the last one lands on the line just as the drop starts, a spin
 * period of one circumference per revolution so it rolls instead of sliding,
 * and the nudge gets the moment the tumbleweed actually reaches the code.
 * Decorative motion only: the scene is hidden from assistive tech, the code
 * and the copy are real text, and under prefers-reduced-motion the tumbleweed
 * is already at rest on the line with nothing moving.
 */
export default function NotFoundBody({ locale }: { locale: Locale }) {
  const t = site[locale].notFound;
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    let visible = false;
    let rolling = false;
    let rolled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const clearTimer = () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
    };
    // Measured on every start and on every width change. Written to the page
    // element, so both the scene and the code (which stands outside the
    // clipped band) read the same numbers.
    const measure = () => {
      const scene = el.querySelector<HTMLElement>(".nf-scene");
      const line = el.querySelector<SVGElement>(".nf-line");
      const tw = el.querySelector<HTMLElement>(".nf-tw");
      const code = el.querySelector<HTMLElement>(".nf-code");
      if (!scene || !line || !tw) return false;
      const band = scene.getBoundingClientRect();
      if (band.width === 0 || band.height === 0) return false;
      const size = tw.offsetWidth;
      const end = line.getBoundingClientRect().right - band.left;
      const speed = band.height * 1.05;
      // The tumbleweed starts one diameter and four pixels off the left edge
      // (the CSS resting transform), and the roll ends with its centre over
      // the end of the line.
      const seconds = (end + size / 2 + 4) / speed;
      el.style.setProperty("--roll-x", `${(end - size / 2).toFixed(1)}px`);
      el.style.setProperty("--roll-t", `${seconds.toFixed(3)}s`);
      const bounces = Math.max(1, Math.round(seconds / BOUNCE_S));
      el.style.setProperty("--bounce-n", `${bounces}`);
      el.style.setProperty("--bounce-d", `${(seconds / bounces).toFixed(3)}s`);
      // One turn per circumference of the drawn weed, which is slightly wider
      // than it is tall inside its square box.
      el.style.setProperty("--spin-t", `${((Math.PI * size * 0.93) / speed).toFixed(3)}s`);
      el.style.setProperty("--fall-dx", `${(speed * FALL_S * 0.55).toFixed(1)}px`);
      if (code) {
        const reach = code.getBoundingClientRect().left - band.left;
        el.style.setProperty("--bump-t", `${Math.max(0, (reach + 4) / speed).toFixed(3)}s`);
      }
      el.dataset.measured = "true";
      return true;
    };
    const roll = () => {
      timer = undefined;
      if (!visible || rolling || still.matches) return;
      if (!measure()) return;
      rolling = true;
      rolled = true;
      el.dataset.rolling = "true";
    };
    const stop = () => {
      rolling = false;
      delete el.dataset.rolling;
    };
    const queue = () => {
      if (rolling || timer !== undefined) return;
      timer = setTimeout(roll, rolled ? REPEAT_MS : START_DELAY_MS);
    };
    // Reduced motion hides the moving weed and shows the resting one, which
    // cancels the roll without an animationend, so the state is reset here
    // rather than left waiting.
    const onStill = () => {
      clearTimer();
      if (still.matches) {
        stop();
      } else if (visible) {
        queue();
      }
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName !== "nf-fall-y") return;
      stop();
      if (visible) queue();
    };
    const io = new IntersectionObserver(
      (entries) => {
        visible = clearsThreshold(entries[entries.length - 1], SCENE_VISIBLE);
        if (visible) {
          queue();
        } else {
          // Leaving ends the roll, so coming back rolls in from the left
          // rather than showing the tail of the old crossing.
          clearTimer();
          stop();
        }
      },
      { threshold: SCENE_VISIBLE },
    );
    // The crossing was measured for one width; if the page changes width
    // mid-roll, start again from the left with fresh numbers.
    let width = el.clientWidth;
    const ro =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(() => {
            if (el.clientWidth === width) return;
            width = el.clientWidth;
            measure();
            if (!rolling) return;
            stop();
            void el.offsetWidth; // let the removal land so the animations restart
            roll();
          });
    const scene = el.querySelector<HTMLElement>(".nf-scene");
    ro?.observe(el);
    el.addEventListener("animationend", onEnd);
    still.addEventListener("change", onStill);
    if (scene) io.observe(scene);
    // Reduced motion never rolls, so the resting weed needs the measurement
    // on its own.
    if (still.matches) measure();
    return () => {
      io.disconnect();
      ro?.disconnect();
      el.removeEventListener("animationend", onEnd);
      still.removeEventListener("change", onStill);
      clearTimer();
    };
  }, []);

  return (
    <main id="main" className="pg-404" ref={root}>
      <p className="nf-code">{t.code}</p>
      <div className="nf-copy">
        <h1>{t.title}</h1>
        <p className="nf-lede">{t.body}</p>
        <Link className="btn-ghost nf-home" href={localePath(locale, "/")}>
          {t.home}
        </Link>
      </div>
      <div className="nf-scene" aria-hidden="true">
        <div className="nf-tw-track">
          <span className="nf-tw">
            <span className="nf-tw-fall-x">
              <span className="nf-tw-fall-y">
                <span className="nf-tw-bounce">
                  <span className="nf-tw-spin" />
                </span>
              </span>
            </span>
          </span>
        </div>
        <svg
          className="nf-left"
          viewBox={NF_LEFT_VIEWBOX}
          preserveAspectRatio="none"
          focusable="false"
        >
          <g fill="currentColor" transform={SCENE_LEFT_TRANSFORM}>
            <path d={SCENE_LEFT_D} />
          </g>
        </svg>
        <svg className="nf-art" viewBox={NF_ART_VIEWBOX} focusable="false">
          <g fill="currentColor" transform={SCENE_ART_TRANSFORM}>
            <path d={SCENE_ART_D} />
          </g>
        </svg>
        <svg
          className="nf-line"
          viewBox={NF_LINE_VIEWBOX}
          preserveAspectRatio="none"
          focusable="false"
        >
          <g fill="currentColor" transform={SCENE_LINE_TRANSFORM}>
            <path d={SCENE_LINE_D} />
          </g>
        </svg>
      </div>
    </main>
  );
}
