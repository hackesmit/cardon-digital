import React, { act, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, vi } from "vitest";
import { demos } from "../../../../lib/i18n/demos";
import { LocaleProvider } from "../../../../lib/i18n/LocaleProvider";
import { GHOST_BOXES, GHOSTS } from "./ghosts";
import { World } from "./world";

/**
 * The demo contract as behaviours (bead hq-3pfhe.7).
 *
 * Each check mounts a demo on the page in ./world, does to it what a visitor
 * or a browser does, and judges what came out: frames, DOM writes, markup.
 * None of them reads the component's source, so none of them can be satisfied
 * by a spelling. They run over every demo in components/pages/demos and over
 * the reviewers' loophole fixtures, which have to FAIL them.
 *
 * What the three shared pieces in ../stage make impossible by construction,
 * these hold for a demo that does not use them, which is the only kind of
 * demo that can still get them wrong.
 */

export type Demo = ComponentType;

/* vitest compiles this app's JSX with the classic runtime, which resolves a
   global React; Next uses the automatic one and needs no import. Test only. */
(globalThis as unknown as { React: typeof React }).React = React;

const BOX = GHOST_BOXES.join(",");
const GHOST = GHOSTS.join(",");

/** Every string the dictionary files under a key named `hint`, both locales:
    the sentence that tells the visitor to operate the board. */
const HINTS = (() => {
  const out = new Set<string>();
  const walk = (v: unknown, key: string) => {
    if (typeof v === "string") {
      if (key === "hint") out.add(v);
    } else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) walk(x, k);
    }
  };
  walk(demos, "");
  return out;
})();

const withWorld = (setup: Partial<World>, body: (w: World) => void) => {
  const w = new World();
  Object.assign(w, setup);
  w.install();
  try {
    body(w);
  } finally {
    w.dispose();
  }
};

const describeEl = (el: Element) =>
  "<" + el.tagName.toLowerCase() + (el.className ? ' class="' + el.className + '"' : "") + ">";

/** No IntersectionObserver but the one ./motion builds. How the constructor
    was reached is irrelevant: every spelling lands on the world's stub. */
const expectNoHandBuiltObserver = (w: World) => {
  const byHand = w.ios.filter((io) => !io.viaMotion);
  expect(
    byHand.map((io) => "an observer built by hand with options " + JSON.stringify(io.options)),
    "a demo learns it is on screen from observeOnscreen and builds no observer of its own",
  ).toEqual([]);
  expect(
    w.ios.length,
    "the demo never asked observeOnscreen whether it is on screen",
  ).toBeGreaterThan(0);
};

/** Text written anywhere but the live child of a ghost box, or a live child
    holding a value no ghost reserves room for. */
const judgeWrites = (records: MutationRecord[], when: string) => {
  for (const r of records) {
    const el = r.target.nodeType === 1 ? (r.target as Element) : r.target.parentElement;
    if (!el || !el.isConnected) continue;
    if (r.type === "attributes") {
      throw new Error(
        "the loop changed " + r.attributeName + " on " + describeEl(el) + " " + when +
          ": a running loop writes text into ghost boxes and draws on its canvas, nothing else",
      );
    }
    const box = el.closest(BOX);
    expect(
      box,
      describeEl(el) + " was rewritten " + when + " outside any ghost box (" + BOX +
        "), so its box is as big as whatever it holds now",
    ).not.toBeNull();
    const kids = Array.from(box!.children);
    const reserved = kids.filter((k) => k.matches(GHOST)).map((k) => k.textContent);
    for (const live of kids.filter((k) => !k.matches(GHOST))) {
      expect(
        reserved,
        describeEl(box!) + " holds a value none of its ghosts reserves room for",
      ).toContain(live.textContent);
    }
  }
};

export const checks: Record<string, (Demo: Demo) => void> = {
  "learns it is on screen from observeOnscreen and builds no observer of its own": (Demo) => {
    /* both ways round, because the observer the s-5836 fixture built by hand
       exists only on a page that did NOT load under reduced motion */
    for (const reduce of [false, true]) {
      withWorld({ reduce }, (w) => {
        w.mount(Demo);
        act(() => w.width(800));
        act(() => w.onscreen(1));
        w.tick(200);
        expectNoHandBuiltObserver(w);
      });
    }
  },

  "stands on a drawn frame, and under reduced motion that frame never moves": (Demo) =>
    withWorld({ reduce: true }, (w) => {
      w.mount(Demo);
      act(() => w.width(800));
      expect(w.standing(), "a demo that may not animate still draws its payoff frame").not.toBe("");
      act(() => w.onscreen(1));
      expect(w.tick(1000), "frames drawn under prefers-reduced-motion").toEqual([]);
    }),

  "starts its loop when reduced motion is turned off on a page loaded under it": (Demo) =>
    withWorld({ reduce: true }, (w) => {
      /* Round one built its observer in the branch reduced motion skips, so
         this page never learned it was on screen and the loop stayed frozen
         for the life of the page. The s-5836 fixture did it again behind a
         discarded observeOnscreen call, with the suite green. */
      w.mount(Demo);
      act(() => w.width(800));
      act(() => w.onscreen(1));
      w.tick(500);
      act(() => w.setReduce(false));
      const frames = w.tick(2000);
      expect(frames.length, "frames in the two seconds after reduce was turned off").toBeGreaterThan(10);
      expect(new Set(frames).size, "distinct frames: a loop, not one redraw").toBeGreaterThan(1);
    }),

  "tells the story from the top, parks on the standing frame, and resumes from it": (Demo) =>
    withWorld({}, (w) => {
      w.mount(Demo);
      act(() => w.width(800));
      const standing = w.standing();
      expect(standing).not.toBe("");

      act(() => w.onscreen(1));
      const opening = w.tick(3000);
      expect(opening.length, "frames in the first three seconds in view").toBeGreaterThan(10);
      expect(opening, "the first thing a visitor sees is not the ending").not.toContain(standing);

      for (const [what, leave, back] of [
        ["scrolled away", () => w.onscreen(0), () => w.onscreen(1)],
        ["tab hidden", () => w.setHidden(true), () => w.setHidden(false)],
      ] as const) {
        /* paused is the same frame reduced motion shows */
        expect(w.capture(leave), what + ": the paused board").toBe(standing);
        expect(w.tick(500), what + ": frames drawn while paused").toEqual([]);
        act(back);
        /* The clock was parked on the first frame of the hold, so a resume
           holds the room the visitor came back to. A clock that restarts, or
           reads backwards to where it was stopped, draws a different frame
           here: the s-5836 fixture read 19:55, then 17:00. */
        const resumed = w.tick(1000);
        expect(resumed.length, what + ": frames in the second after coming back").toBeGreaterThan(10);
        expect(
          resumed.filter((f) => f !== standing).length,
          what + ": frames after the resume that are not the frame it was parked on",
        ).toBe(0);
        /* and it is a loop, not a still: it leaves the hold again */
        expect(w.tick(20000).some((f) => f !== standing), what + ": the loop moved on").toBe(true);
      }
    }),

  "rewrites nothing whose box is not held open by ghosts": (Demo) =>
    withWorld({}, (w) => {
      w.mount(Demo);
      act(() => w.width(800));
      const seen: MutationRecord[] = [];
      const mo = new MutationObserver((r) => seen.push(...r));
      const drain = () => seen.splice(0).concat(mo.takeRecords());

      /* a whole cycle and more, so every value the loop can write is written */
      mo.observe(w.container, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["style", "class", "hidden"],
      });
      act(() => w.onscreen(1));
      w.tick(60000);
      judgeWrites(drain(), "by the running loop");
      mo.disconnect();

      /* and everything the visitor can change */
      mo.observe(w.container, { subtree: true, childList: true, characterData: true });
      const buttons = Array.from(w.container.querySelectorAll("button"));
      for (const b of buttons.concat(buttons.slice(0, 1))) {
        act(() => b.click());
        judgeWrites(drain(), "by a tap on " + describeEl(b));
      }
      mo.disconnect();
    }),

  "keeps every live region inside a ghost box": (Demo) =>
    withWorld({}, (w) => {
      w.mount(Demo);
      const live = Array.from(
        w.container.querySelectorAll("[aria-live],[role=status],[role=alert],[role=log]"),
      );
      for (const el of live) {
        expect(
          el.parentElement?.closest(BOX) ?? null,
          describeEl(el) + " is announced when it changes, so it changes, so it needs a ghost box",
        ).not.toBeNull();
      }
    }),

  "leaves prose, the honest label and the readout with scripting off, and nothing to operate": (Demo) => {
    const html = renderToStaticMarkup(
      <LocaleProvider locale="es">
        <Demo />
      </LocaleProvider>,
    );
    /* With scripting off a parser reads noscript content as markup; jsdom
       under vitest has scripting on and would hand it back as text. React's
       serializer escapes text, so the literal tag can only be the element. */
    const page = document.createElement("div");
    page.innerHTML = html.replace(/<noscript>/g, "<div data-noscript>").replace(/<\/noscript>/g, "</div>");
    const figure = page.querySelector("figure");
    expect(figure, "a demo is a figure").not.toBeNull();
    const noscript = page.querySelector("[data-noscript]");
    expect(noscript, "a <noscript> that carries the figure").not.toBeNull();

    const hidden: string[] = [];
    for (const style of Array.from(noscript!.querySelectorAll("style"))) {
      for (const rule of (style.textContent ?? "").split("}")) {
        const [selectors, body] = rule.split("{");
        if (body && /display\s*:\s*none/.test(body)) hidden.push(...selectors.split(","));
      }
    }
    const gone = (el: Element) => hidden.some((s) => el.matches(s.trim()));

    /* The must-list is what THIS render put on the page, not a list of class
       names: the board that will never be drawn, everything that would have
       to be operated, and the sentence telling the visitor to operate it. */
    const dead = Array.from(
      page.querySelectorAll("canvas,button,[role=button],a[href],input,select,textarea,summary,[tabindex]"),
    ).concat(
      Array.from(page.querySelectorAll("*")).filter(
        (el) => el.children.length === 0 && HINTS.has((el.textContent ?? "").trim()),
      ),
    );
    expect(dead.some((el) => el.tagName === "CANVAS"), "a demo draws on a canvas").toBe(true);
    expect(
      dead.filter((el) => !noscript!.contains(el) && !gone(el)).map(describeEl),
      "still on the page with scripting off",
    ).toEqual([]);

    const fallback = noscript!.querySelector(".demo-fallback");
    expect((fallback?.textContent ?? "").trim(), "the written description").not.toBe("");
    const honest = Array.from(figure!.querySelectorAll("*")).filter(
      (el) => el.children.length === 0 && el.textContent === demos.es.honest,
    );
    expect(honest.length, "the honest label").toBeGreaterThan(0);
    for (const el of honest) expect(gone(el), "the honest label is not removable").toBe(false);
    const boxes = Array.from(figure!.querySelectorAll(BOX));
    expect(boxes.length, "a readout resolved from the first render").toBeGreaterThan(0);
    for (const el of boxes) expect(gone(el)).toBe(false);
  },

  "decides its plan on the fractional layout box and draws at the layout width": (Demo) =>
    withWorld({ scale: 2 }, (w) => {
      vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
      try {
        w.mount(Demo);
        const plan = () => w.container.querySelector("[data-plan]")?.getAttribute("data-plan");
        const canvas = () => w.container.querySelector("canvas")!;
        /* 639.6: clientWidth rounds it to 640 and the painted rect under a
           scaled ancestor says 1279, both the wide plan. The container query
           reads 639.6, which is a phone. */
        act(() => w.width(639.6));
        expect(plan(), "the plan the stage publishes at 639.6").toBe("phone");
        expect(canvas().width, "the backing store is the layout width, not the painted one").toBe(640);
        /* 640.2 rounds to the same integer and is the other plan */
        act(() => w.width(640.2));
        act(() => void vi.advanceTimersByTime(400));
        expect(plan(), "the plan the stage publishes at 640.2").toBe("wide");
        act(() => w.width(639.9));
        act(() => void vi.advanceTimersByTime(400));
        expect(plan(), "the plan the stage publishes at 639.9").toBe("phone");
      } finally {
        vi.useRealTimers();
      }
    }),
};

/** The names of the checks `Demo` fails, for the loophole fixtures. */
export const failing = (Demo: Demo): string[] =>
  Object.entries(checks)
    .filter(([, check]) => {
      try {
        check(Demo);
        return false;
      } catch {
        return true;
      }
    })
    .map(([name]) => name);
