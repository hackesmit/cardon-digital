// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { act } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

// vitest compiles this app's JSX with the classic runtime, so the components
// below resolve a global React. Test-only, the same shim Media.test.tsx uses.
(globalThis as unknown as { React: typeof React }).React = React;

import MarkLoader from "./MarkLoader";
import RouteLoading from "./RouteLoading";
import { DRAWING_D, SUN_D } from "./Mark";
import { MARK_BRUSH, MARK_LINE_D, MARK_SUN_D } from "./markCenterline";
import ContactForm from "../contact/ContactForm";
import { LocaleProvider } from "../../lib/i18n/LocaleProvider";
import { locales } from "../../lib/i18n/config";
import { site } from "../../lib/i18n/site";
import { contact } from "../../lib/i18n/contact";

/**
 * The loader's promises, held where they can fail (bead hq-0xca.5).
 *
 * The mockup Daniel saw drew the mark by running a dash along DRAWING_D, which
 * is the outline of the ink rather than the path the pen took: it crawls up one
 * side of the cactus and back down the other. The fix is a centreline painted
 * with a wide brush and clipped to the artwork, and almost every way of
 * breaking it again looks harmless in a diff: stroking the outline "because it
 * is already there", dropping the clip, letting two loaders share a clip id,
 * animating something that costs a layout, or leaving the thing moving under
 * prefers-reduced-motion. One test each.
 */

const CSS = readFileSync(join(process.cwd(), "components/site/mark-loader.css"), "utf8");

type Stop = { at: number[]; declarations: string };

/** The stops of one @keyframes block, each with every percentage it is written
    at, so a stop declared as "0%,54.9%" counts as both. */
function stops(name: string): Stop[] {
  return Array.from(keyframeBody(name).matchAll(/([^{}]+)\{([^}]*)\}/g)).map((m) => ({
    at: Array.from(m[1].matchAll(/([\d.]+)%/g)).map((p) => Number(p[1])),
    declarations: m[2],
  }));
}

function at(name: string, declaration: RegExp, pick: "first" | "last"): number {
  const marks = stops(name)
    .filter((stop) => declaration.test(stop.declarations))
    .flatMap((stop) => stop.at);
  expect(marks.length).toBeGreaterThan(0);
  return pick === "first" ? Math.min(...marks) : Math.max(...marks);
}

/** The percentage of the cycle at which a stroke reaches its drawn state. */
const drawnBy = (name: string) => at(name, /stroke-dashoffset:0/, "first");
/** The last percentage at which a stroke is still held undrawn. */
const heldUntil = (name: string) => at(name, /stroke-dashoffset:1/, "last");

function keyframeBody(name: string): string {
  const where = CSS.indexOf("@keyframes " + name + "{");
  expect(where).toBeGreaterThan(-1);
  return keyframeBodies(CSS.slice(where))[0];
}

/** Every @keyframes body in a stylesheet, read by counting braces rather than
    by a regex, because each body holds its own braced stops. */
function keyframeBodies(css: string): string[] {
  const out: string[] = [];
  for (const m of Array.from(css.matchAll(/@keyframes\s+[\w-]+\s*\{/g))) {
    let depth = 1;
    let i = m.index! + m[0].length;
    const from = i;
    while (i < css.length && depth > 0) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") depth--;
      i++;
    }
    out.push(css.slice(from, i - 1));
  }
  return out;
}

/** The d of every path inside the first group that paints with the brush. */
function brushPaths(markup: string): string[] {
  const group = markup.slice(markup.indexOf('class="ml-brush"'));
  return Array.from(group.matchAll(/<path[^>]*\bd="([^"]+)"/g)).map((m) => m[1]);
}

function clipPaths(markup: string): string[] {
  const block = markup.slice(markup.indexOf("<clipPath"), markup.indexOf("</clipPath>"));
  return Array.from(block.matchAll(/<path[^>]*\bd="([^"]+)"/g)).map((m) => m[1]);
}

describe("the pen path", () => {
  const markup = renderToStaticMarkup(<MarkLoader />);

  it("strokes the centreline and never the filled outline", () => {
    expect(MARK_LINE_D).not.toBe(DRAWING_D);
    expect(brushPaths(markup)).toEqual([MARK_LINE_D, MARK_SUN_D]);
  });

  it("clips the brush to the artwork, so the ink that appears is the real one", () => {
    expect(clipPaths(markup)).toEqual([DRAWING_D, SUN_D]);
    const clipId = /<clipPath id="([^"]+)"/.exec(markup)![1];
    expect(markup).toContain(`clip-path="url(#${clipId})"`);
  });

  it("carries a brush wide enough to be worth clipping", () => {
    // A brush the width of a hairline would draw a thin synthetic line inside
    // the ink instead of filling it. The generator measures the number; this
    // only holds it well clear of the stroke weight an outline would use.
    expect(MARK_BRUSH).toBeGreaterThan(12);
    expect(markup).toContain(`stroke-width="${MARK_BRUSH}"`);
  });

  it("measures both strokes in fractions, so CSS never holds a length", () => {
    expect(markup.match(/pathLength="1"/g)).toHaveLength(2);
    expect(CSS).toContain("stroke-dasharray:1");
  });
});

describe("two loaders on one page", () => {
  it("do not share a clip id", () => {
    const markup = renderToStaticMarkup(
      <div>
        <MarkLoader />
        <MarkLoader />
      </div>,
    );
    const ids = Array.from(markup.matchAll(/<clipPath id="([^"]+)"/g)).map((m) => m[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
    expect(ids.every((id) => !id.includes(":"))).toBe(true);
  });
});

describe("what moves", () => {
  it("animates stroke-dashoffset and opacity and nothing that costs a layout", () => {
    const frames = keyframeBodies(CSS);
    expect(frames.length).toBeGreaterThan(2);
    const properties = new Set<string>();
    for (const body of frames) {
      for (const m of Array.from(body.matchAll(/([a-z-]+)\s*:/g))) properties.add(m[1]);
    }
    expect(Array.from(properties).sort()).toEqual(
      ["animation-timing-function", "opacity", "stroke-dashoffset"],
    );
  });

  it("lifts the pen before the sun, so the sun is drawn after the line", () => {
    // The first round overlapped them by two per cent of the cycle. It read as
    // smoothing; it is the one ordering the bead asks for by name, and a frame
    // of the sun opening while the ground line is still running is the shape
    // the loader was built to avoid.
    const lineEnd = drawnBy("ml-line");
    const sunStart = heldUntil("ml-sun");
    expect(sunStart).toBeGreaterThanOrEqual(lineEnd);
  });

  it("keeps the sun off the screen until its turn, cap and all", () => {
    // stroke-dashoffset alone does not hide a stroke: a zero length dash keeps
    // its round cap and Chrome paints it, which put a wine dot on the sun's
    // seam for the first half of every cycle. Opacity is what hides it, and it
    // has to be held flat rather than left to interpolate from the top of the
    // cycle, or the sun is half lit by the middle of the line.
    const dark = at("ml-sun", /opacity:0/, "last");
    const lit = at("ml-sun", /opacity:1/, "first");
    expect(lit).toBe(heldUntil("ml-sun"));
    expect(dark).toBeGreaterThan(lit - 1);
  });

  it("parks the mark finished and still under prefers-reduced-motion", () => {
    const at = CSS.indexOf("@media (prefers-reduced-motion:reduce)");
    expect(at).toBeGreaterThan(-1);
    const block = CSS.slice(at);
    expect(block).toMatch(/\.ml-ink,\s*\.ml-line,\s*\.ml-sun\{animation:none;\}/);
    expect(block).toMatch(/\.ml-ink\{opacity:1;\}/);
    expect(block).toMatch(/\.ml-line,\s*\.ml-sun\{stroke-dashoffset:0;\}/);
  });

  it("is hidden from assistive tech, because every call site says it in words", () => {
    const markup = renderToStaticMarkup(<MarkLoader />);
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).not.toContain("role=");
  });
});

describe("the route fallback", () => {
  for (const locale of locales) {
    it(`says it is loading in ${locale}`, () => {
      const markup = renderToStaticMarkup(
        <LocaleProvider locale={locale}>
          <RouteLoading />
        </LocaleProvider>,
      );
      expect(markup).toContain(site[locale].loading);
      expect(markup).toMatch(/class="sr-only" role="status"|role="status" class="sr-only"/);
      expect(markup).toContain("ml-route-mark");
    });
  }
});

describe("the contact button", () => {
  let cleanup: (() => void) | null = null;
  afterEach(() => {
    cleanup?.();
    cleanup = null;
    vi.unstubAllGlobals();
  });

  it("draws the mark only while the request is out, and still says Enviando", async () => {
    // A request that never settles is the sending state, held still.
    vi.stubGlobal("fetch", () => new Promise(() => {}));
    (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    cleanup = () => {
      act(() => root.unmount());
      container.remove();
    };
    act(() => {
      root.render(
        <LocaleProvider locale="es">
          <ContactForm />
        </LocaleProvider>,
      );
    });
    const button = container.querySelector("button[type=submit]") as HTMLButtonElement;
    expect(container.querySelector(".ml")).toBeNull();
    expect(button.textContent).toBe(contact.es.form.submit);

    for (const [field, value] of [
      ["name", "Ana Robles"],
      ["email", "ana@bodegaejemplo.mx"],
      ["message", "Queremos un sitio para la bodega antes de la vendimia."],
    ]) {
      const el = container.querySelector("#contact-" + field) as HTMLInputElement;
      act(() => {
        const setter = Object.getOwnPropertyDescriptor(
          el instanceof HTMLTextAreaElement
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype,
          "value",
        )!.set!;
        setter.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    await act(async () => {
      button.click();
    });

    const loader = button.querySelector(".ml.ml-cta");
    expect(loader).not.toBeNull();
    expect(loader!.getAttribute("aria-hidden")).toBe("true");
    expect(button.textContent).toBe(contact.es.form.sending);
    expect(button.disabled).toBe(true);
  });
});
