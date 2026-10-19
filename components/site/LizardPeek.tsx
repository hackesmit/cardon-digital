"use client";

import { useEffect, useRef, useState } from "react";
import { clearsThreshold } from "@/lib/onscreen";

/**
 * The lizard that peeks over a card (bead hq-0xca.4).
 *
 * Drop it inside the card it should peek over. The card is the containing
 * block, so it needs a position of its own; the peek is absolutely positioned
 * above the card's top border and the card's edge is what masks the animal's
 * body. The geometry, and the reason each number in it is what it is, are in
 * lizard-peek.css. On /precios it lives in the founding-winery card.
 *
 * It never takes a pointer, never takes focus and is hidden from the
 * accessibility tree: it is a joke in the margin, not content, and it must
 * not stand between a reader and the offer the card is making.
 *
 * STATE. Three values, on a data attribute the stylesheet reads, which is the
 * same shape PlayOnceVis uses for the case-page diagrams.
 *
 *   pre     the animal is below the card's edge, waiting
 *   play    the one run of the cycle
 *   still   the reduced-motion rest state: visible, not moving
 *
 * Once per page view is the whole policy and it lives in peekNext: "pre" is
 * the only state a trigger can leave. The animation has no fill mode and its
 * last keyframe is the hidden state, so a played-out "play" rests exactly
 * where "pre" did and nothing has to be unwound.
 */

export type PeekState = "pre" | "play" | "still";

/**
 * How long after the card arrives the animal comes up. The card fades in over
 * 700ms (Reveal), and a lizard that rises through a fading card reads as a
 * rendering fault rather than a joke, so it waits for most of that.
 */
export const PEEK_DELAY_MS = 520;

/** How much of the card has to be on screen before the peek is armed. */
export const PEEK_THRESHOLD = 0.4;

/**
 * The once-per-page-view rule, as a function, so it is checkable without a
 * browser. Both triggers go through here, so neither can replay the cycle or
 * disturb the reduced-motion rest state.
 */
export function peekNext(state: PeekState): PeekState {
  return state === "pre" ? "play" : state;
}

/** The card this peek belongs to: its parent, or itself if it is loose. */
export function peekHost(el: HTMLElement): HTMLElement {
  return el.parentElement ?? el;
}

export default function LizardPeek() {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [state, setState] = useState<PeekState>("pre");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = peekHost(el);

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMQ.matches) {
      setState("still");
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const start = (delay: number) => {
      if (timer !== undefined) return;
      timer = setTimeout(() => setState(peekNext), delay);
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            // clearsThreshold, never entry.isIntersecting: what "on screen"
            // means here is PEEK_THRESHOLD of the card, and the flag is not
            // that number in every engine (lib/onscreen.ts).
            if (!clearsThreshold(entry, PEEK_THRESHOLD)) continue;
            io?.disconnect();
            io = null;
            start(PEEK_DELAY_MS);
          }
        },
        { threshold: PEEK_THRESHOLD },
      );
      io.observe(host);
    } else {
      start(PEEK_DELAY_MS);
    }

    // A pointer on the card brings it up at once, for the reader who is
    // already looking at the card rather than scrolling toward it.
    const onEnter = () => {
      if (!window.matchMedia("(hover: hover)").matches) return;
      io?.disconnect();
      io = null;
      start(0);
    };
    host.addEventListener("pointerenter", onEnter);

    // Asking for stillness mid-visit stops the cycle and leaves the animal in
    // the rest state rather than halfway through a duck.
    const onReduceChange = () => {
      if (reduceMQ.matches) setState("still");
    };
    reduceMQ.addEventListener("change", onReduceChange);

    return () => {
      if (timer !== undefined) clearTimeout(timer);
      io?.disconnect();
      host.removeEventListener("pointerenter", onEnter);
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, []);

  return (
    <span className="lizard-peek" data-peek={state} aria-hidden="true" ref={ref}>
      <span className="lizard-peek-art">
        <img
          className="lizard-peek-img"
          src="/media/eggs/lizard-peek.webp"
          alt=""
          width={664}
          height={348}
          loading="lazy"
          decoding="async"
        />
      </span>
    </span>
  );
}
