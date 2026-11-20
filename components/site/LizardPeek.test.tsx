// @vitest-environment jsdom
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { act } from "react";
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The lizard that peeks over a card (bead hq-0xca.4).
 *
 * Two kinds of guard here, because the effect has two ways to go wrong and
 * only one of them is behaviour.
 *
 * The first is the policy: it plays ONCE per page view, it never plays at all
 * for a visitor who asked for stillness, and it never takes a pointer or a
 * place in the accessibility tree away from the offer on the card it sits on.
 * Those are driven through the mounted component against a stubbed observer
 * and a stubbed media query, because every one of them is a rule about when
 * the thing may move and a screenshot cannot show "and then it did not move
 * again".
 *
 * The second is the mask. The card's top edge hides the animal's body, and it
 * only does so because three numbers in lizard-peek.css agree with the shape
 * of the file in public/media/eggs. Re-exporting the art from a different crop
 * is the obvious next edit someone makes here, and if those numbers are not
 * moved with it the mask slides: either a flat cut floats above the card's
 * line, or the head is clipped at the top of the window. Nothing in the build
 * would say a word. So the geometry is read out of the stylesheet and checked
 * against the real WebP header on disk.
 */

(globalThis as unknown as { React: typeof React }).React = React;

import LizardPeek, {
  PEEK_DELAY_MS,
  PEEK_THRESHOLD,
  peekHost,
  peekNext,
  type PeekState,
} from "./LizardPeek";

/* ============================ the policy ============================ */

type Observed = { el: Element; fire: (ratio: number) => void; live: () => boolean };

let observed: Observed[] = [];
let root: Root | null = null;
let container: HTMLDivElement | null = null;

/** Stub IntersectionObserver so a test can decide when the card arrives. */
function stubObserver() {
  class IO {
    private cb: IntersectionObserverCallback;
    private alive = true;
    constructor(cb: IntersectionObserverCallback) {
      this.cb = cb;
    }
    observe(el: Element) {
      observed.push({
        el,
        fire: (ratio: number) =>
          act(() => {
            if (!this.alive) return;
            const entry = {
              isIntersecting: ratio > 0,
              intersectionRatio: ratio,
              target: el,
            } as IntersectionObserverEntry;
            this.cb([entry], this as never);
          }),
        live: () => this.alive,
      });
    }
    disconnect() {
      this.alive = false;
    }
    unobserve() {}
  }
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO;
}

/** Stub matchMedia for the two queries the component asks. */
function stubMedia({ reduce, hover }: { reduce: boolean; hover: boolean }) {
  (window as unknown as { matchMedia: (q: string) => MediaQueryList }).matchMedia = (q: string) =>
    ({
      matches: q.includes("prefers-reduced-motion") ? reduce : hover,
      media: q,
      addEventListener() {},
      removeEventListener() {},
    }) as unknown as MediaQueryList;
}

/** Mounts the peek inside a card, the way the precios page mounts it. */
function mountInCard(): { card: HTMLElement; peek: () => HTMLElement } {
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.appendChild(container);
  const card = document.createElement("div");
  card.className = "founding lizard-peek-host";
  container.appendChild(card);
  root = createRoot(card);
  act(() => root!.render(<LizardPeek />));
  return {
    card,
    peek: () => card.querySelector<HTMLElement>(".lizard-peek")!,
  };
}

beforeEach(() => {
  observed = [];
  vi.useFakeTimers();
  stubObserver();
  stubMedia({ reduce: false, hover: true });
});

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  container?.remove();
  container = null;
  vi.useRealTimers();
});

describe("A: the peek stays out of the reader's way", () => {
  it("is hidden from assistive technology and holds no pointer", () => {
    const { peek } = mountInCard();
    expect(peek().getAttribute("aria-hidden")).toBe("true");
    expect(peek().querySelector("img")!.getAttribute("alt")).toBe("");
    expect(peek().querySelector("img")!.getAttribute("src")).toBe("/media/eggs/lizard-peek.webp");
    // pointer-events is a stylesheet rule, so it is checked there, not here.
    expect(read("components/site/lizard-peek.css")).toMatch(/\.lizard-peek\s*\{[^}]*pointer-events:\s*none/);
  });

  it("watches the card it sits in, not itself", () => {
    const { card } = mountInCard();
    expect(observed).toHaveLength(1);
    expect(observed[0].el).toBe(card);
  });

  it("falls back to its own element when it has no card around it", () => {
    const loose = document.createElement("span");
    expect(peekHost(loose)).toBe(loose);
  });
});

describe("B: it comes up once the card is on screen, and only once", () => {
  it("waits for the reveal to settle before it moves", () => {
    const { peek } = mountInCard();
    expect(peek().dataset.peek).toBe("pre");

    observed[0].fire(1);
    act(() => void vi.advanceTimersByTime(PEEK_DELAY_MS - 40));
    expect(peek().dataset.peek, "it must not rise through the card's fade").toBe("pre");

    act(() => void vi.advanceTimersByTime(60));
    expect(peek().dataset.peek).toBe("play");
  });

  it("plays once per page view, whatever happens next", () => {
    const { card, peek } = mountInCard();
    observed[0].fire(1);
    act(() => void vi.advanceTimersByTime(PEEK_DELAY_MS));
    expect(peek().dataset.peek).toBe("play");

    // scrolled away and back
    observed[0].fire(0);
    observed[0].fire(1);
    // and pointed at
    act(() => card.dispatchEvent(new Event("pointerenter")));
    act(() => void vi.advanceTimersByTime(10_000));
    expect(peek().dataset.peek).toBe("play");
  });

  it("is not armed by a sliver of the card", () => {
    const { peek } = mountInCard();
    observed[0].fire(PEEK_THRESHOLD / 4);
    act(() => void vi.advanceTimersByTime(10_000));
    expect(peek().dataset.peek, "a few pixels of the card is not the card").toBe("pre");
    expect(observed[0].live(), "and the observer is still watching for the rest").toBe(true);

    observed[0].fire(1);
    act(() => void vi.advanceTimersByTime(PEEK_DELAY_MS));
    expect(peek().dataset.peek).toBe("play");
  });

  it("stops watching the moment it is armed, so a long page costs nothing", () => {
    mountInCard();
    expect(observed[0].live()).toBe(true);
    observed[0].fire(1);
    expect(observed[0].live()).toBe(false);
  });

  it("comes up at once for a pointer on the card", () => {
    const { card, peek } = mountInCard();
    act(() => card.dispatchEvent(new Event("pointerenter")));
    act(() => void vi.advanceTimersByTime(0));
    expect(peek().dataset.peek).toBe("play");
  });

  it("ignores a pointerenter a touch screen synthesises from a tap", () => {
    stubMedia({ reduce: false, hover: false });
    const { card, peek } = mountInCard();
    act(() => card.dispatchEvent(new Event("pointerenter")));
    act(() => void vi.advanceTimersByTime(1000));
    expect(peek().dataset.peek).toBe("pre");
  });

  it("comes up anyway where there is no IntersectionObserver", () => {
    delete (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
    const { peek } = mountInCard();
    act(() => void vi.advanceTimersByTime(PEEK_DELAY_MS));
    expect(peek().dataset.peek).toBe("play");
  });
});

describe("C: a visitor who asked for stillness is not moved at", () => {
  it("rests in the static state and never arms the cycle", () => {
    stubMedia({ reduce: true, hover: true });
    const { card, peek } = mountInCard();
    expect(peek().dataset.peek).toBe("still");
    expect(observed, "nothing to observe: there is no cycle to arm").toHaveLength(0);

    act(() => card.dispatchEvent(new Event("pointerenter")));
    act(() => void vi.advanceTimersByTime(10_000));
    expect(peek().dataset.peek).toBe("still");
  });

  it("holds the art at the top of its rise rather than below the card", () => {
    const css = read("components/site/lizard-peek.css");
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.js \.lizard-peek\[data-peek\] \.lizard-peek-art\s*\{\s*transform: none;/,
    );
    // and the rest state the component sets has the same end, written after
    // the play rule so it wins the cascade rather than tying with it.
    expect(css.indexOf('[data-peek="still"]')).toBeGreaterThan(css.indexOf('[data-peek="play"]'));
  });

  it("is visible without JS at all, because the hidden state is gated on .js", () => {
    const css = read("components/site/lizard-peek.css");
    for (const rule of ['[data-peek="pre"]', '[data-peek="play"]']) {
      const at = css.indexOf(rule);
      expect(at, rule).toBeGreaterThan(-1);
      expect(css.slice(css.lastIndexOf("\n", at), at)).toContain(".js ");
    }
  });
});

describe("D: the once-per-page-view rule, on its own", () => {
  const states: PeekState[] = ["pre", "play", "still"];

  it.each(states)("%s only ever leaves pre", (state) => {
    expect(peekNext(state)).toBe(state === "pre" ? "play" : state);
  });

  it("arms on a fraction of the card, not on a single pixel of it", () => {
    expect(PEEK_THRESHOLD).toBeGreaterThan(0);
    expect(PEEK_THRESHOLD).toBeLessThan(1);
  });
});

/* ============================ the mask ============================ */

function read(rel: string): string {
  return readFileSync(join(process.cwd(), rel), "utf8");
}

/** The canvas size out of a WebP's VP8X header, which is where it is honest. */
function webpSize(rel: string): { w: number; h: number } {
  const b = readFileSync(join(process.cwd(), rel));
  expect(b.subarray(0, 4).toString("latin1"), `${rel} is not a RIFF file`).toBe("RIFF");
  expect(b.subarray(8, 12).toString("latin1"), `${rel} is not a WebP`).toBe("WEBP");
  expect(b.subarray(12, 16).toString("latin1"), `${rel} has no VP8X header`).toBe("VP8X");
  const u24 = (at: number) => b[at] | (b[at + 1] << 8) | (b[at + 2] << 16);
  return { w: u24(24) + 1, h: u24(27) + 1 };
}

/** The one number in a calc() of the form `calc(var(--liz-w) * A / B)`. */
function ratio(css: string, prop: string): { num: number; den: number } {
  const m = css.match(new RegExp(`${prop}:\\s*calc\\(var\\(--liz-w\\) \\* (-?\\d+) / (\\d+)\\)`));
  expect(m, `no calc() ratio for ${prop} in lizard-peek.css`).toBeTruthy();
  return { num: Number(m![1]), den: Number(m![2]) };
}

describe("E: the card's edge still masks the body", () => {
  const ART = "public/media/eggs/lizard-peek.webp";
  const css = read("components/site/lizard-peek.css");
  const size = webpSize(ART);
  const height = ratio(css, "height");
  const bottom = ratio(css, "bottom");

  it("exports the art at 2x the crop the stylesheet is written against", () => {
    // Every ratio in the stylesheet divides by the crop's width in source
    // columns; the file is a 2x export of that crop.
    expect(height.den).toBe(bottom.den);
    expect(size.w).toBe(height.den * 2);
  });

  it("keeps the same number of rows below the card's edge as the art has to spare", () => {
    const artRows = size.h / 2;
    const clip = Math.abs(bottom.num);
    const visible = artRows - clip;
    expect(clip, "nothing behind the card means the tilt opens a gap under it").toBeGreaterThan(20);
    expect(visible, "the head and the forelegs have to clear the edge").toBeGreaterThan(100);
    expect(height.num, "the window must not clip the head").toBeGreaterThanOrEqual(visible);
    expect(height.num - visible, "and must keep headroom for the tilt").toBeGreaterThanOrEqual(8);
  });

  it("sits on the card's border rather than across it", () => {
    expect(css).toMatch(/bottom: calc\(100% \+ 1px\);/);
    expect(css).toMatch(/overflow: hidden;/);
  });

  it("stays inside the page's weight budget for a joke in the margin", () => {
    expect(statSync(join(process.cwd(), ART)).size).toBeLessThan(40 * 1024);
  });

  it("wears the site's own photograph treatment, in both modes", () => {
    expect(css).toMatch(/\.lizard-peek-img\s*\{[^}]*filter: sepia\(0\.26\) saturate\(0\.82\) contrast\(1\.02\);/);
    expect(css).toMatch(/:root\[data-mode="dark"\] \.lizard-peek-img\s*\{[^}]*brightness\(/);
  });

  it("is mounted on the one card that has clear air above it at every width", () => {
    const page = read("app/[locale]/precios/page.tsx");
    expect(page).toContain('<div className="founding lizard-peek-host">');
    expect(page).toContain("<LizardPeek />");
    expect(page).toContain('import "@/components/site/lizard-peek.css";');
  });
});
