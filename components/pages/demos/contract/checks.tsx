import React, { act, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, vi } from "vitest";
import { demos } from "../../../../lib/i18n/demos";
import { LocaleProvider } from "../../../../lib/i18n/LocaleProvider";
import { GHOST_BOXES, GHOSTS } from "./ghosts";
import type { DemoScene, StageEnv } from "../stage/useDemoStage";
import { handed, World } from "./world";

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

const OPERABLE = "button,[role=button],a[href],input,select,textarea,summary,[tabindex]";

/** The demo as a visitor with scripting off receives it, and what its own
    noscript rule takes off the page. */
const noscriptRule = (Demo: Demo) => {
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
  const gone = (el: Element) => hidden.some((sel) => el.matches(sel.trim()));
  return { page, figure: figure!, noscript: noscript!, gone };
};

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

/** A frame that puts something on the canvas. The stage clears the board and
    a scene can set styles all day; neither is a picture, and a demo that did
    only that would satisfy every comparison below with a blank board. */
const PAINTS = /(?:^|;)(?:fill|stroke|fillRect|strokeRect|fillText|strokeText|drawImage|putImageData)\(/;
const expectPainted = (frame: string, what: string) =>
  expect(PAINTS.test(frame), what + " puts nothing on the canvas").toBe(true);

const describeEl = (el: Element) =>
  /* the attribute: an SVG element's className is an object */
  "<" + el.tagName.toLowerCase() + (el.getAttribute("class") ? ' class="' + el.getAttribute("class") + '"' : "") + ">";

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

/** Everything that can move on a page, watched at once: frames asked for,
    calls on the canvas, and every mutation under the mount, with NO attribute
    filter. The motion checks used to read the 2d context alone, so a bar
    animated by rewriting an SVG attribute from a loop of the demo's own ran
    under prefers-reduced-motion, in a hidden tab and off screen with the
    suite green (reviewer s-2e55, B2).

    WHY THIS IS A CHECK AND NOT A CONSTRUCTION. The stage can own the clock,
    the gates and the canvas because a demo has to be handed them. It cannot
    own requestAnimationFrame, setInterval or the DOM: a component is a
    function, and a function can start a loop. There is nothing to take away.
    What can be done is to judge the whole page and not the mechanism's
    corner of it, through the globals, where no spelling gets past. */
/** A button whose tap CHANGES the selection: one that says it is not pressed,
    or failing that the second on the page. The second alone can be the one
    already chosen, when something else on the page is a button too, and a
    tap that changes nothing re-renders nothing. */
const unchosen = (buttons: HTMLButtonElement[]) =>
  buttons.find((b) => b.getAttribute("aria-pressed") === "false") ?? buttons[1];

const watchPage = (w: World) => {
  const seen: MutationRecord[] = [];
  const mo = new MutationObserver((r) => seen.push(...r));
  /* the body and not the mount: a portal is one line, and it lands outside */
  mo.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
  });
  const frames = w.framesRequested;
  const scrolls = w.scrolls;
  const drawn = w.log.length;
  return () => {
    const records = seen.concat(mo.takeRecords());
    mo.disconnect();
    return {
      frames: w.framesRequested - frames,
      /* a scroll position is a property: it moves the page and leaves no
         mutation record, so the world counts the setters */
      scrolls: w.scrolls - scrolls,
      drawn: w.log.length - drawn,
      mutations: records.map(
        (r) =>
          r.type +
          (r.attributeName ? ":" + r.attributeName : "") +
          " on " +
          describeEl(r.target.nodeType === 1 ? (r.target as Element) : r.target.parentElement!),
      ),
    };
  };
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
      expectPainted(w.standing(), "the standing frame");
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
      expectPainted(opening[opening.length - 1], "the story, three seconds in,");

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

  "a tap changes the selection and nothing about the time": (Demo) => {
    /* Reviewer s-2e55, B1. The stage's effect was keyed on the scene object,
       a demo that built its scene in the component body handed over a new one
       on every tap, and each tap built a new clock whose first start tells
       the story from the top: 'servicio en su punto', one tap, 'empieza el
       servicio'. The stage now lives as long as the mount (../stage/
       useDemoStage.ts), so this cannot happen THROUGH the stage; the check is
       for a demo that keeps time some other way, and for the day somebody
       gives that effect a dependency again.

       The page is deterministic, so the judge is a second page. One visitor
       taps before the board comes into view and one taps three seconds into
       the story. From the tap on they have the same selection, so they must
       see the same frames: any difference is time the tap moved. */
    const story = (tapAfter: number) => {
      let frames: string[] = [];
      let buttons = 0;
      withWorld({}, (w) => {
        w.mount(Demo);
        act(() => w.width(800));
        const tap = () => {
          const all = Array.from(w.container.querySelectorAll("button"));
          buttons = all.length;
          if (all.length > 1) act(() => unchosen(all).click());
          /* a browser tells every NEW observer where its target is; the stub
             does not, so say it again: nothing to a stage that survived the
             tap, the first start of its clock to one the tap rebuilt */
          if (tapAfter > 0) act(() => w.onscreen(1));
        };
        if (tapAfter === 0) tap();
        act(() => w.onscreen(1));
        w.tick(tapAfter);
        if (tapAfter > 0) tap();
        frames = w.tick(3008 + 608 - tapAfter).slice(-15);
      });
      return { frames, buttons };
    };
    const control = story(0);
    if (control.buttons < 2) return;
    expect(control.frames.length).toBe(15);
    expect(
      story(3008).frames.filter((f, i) => f !== control.frames[i]).length,
      "frames in the 0.6s after a tap three seconds into the story that a visitor who tapped before it began did not see",
    ).toBe(0);

    /* and in the hold, where the reviewer measured it: the hold is still, so
       a tap that leaves time alone is followed by one frame, over and over */
    withWorld({}, (w) => {
      w.mount(Demo);
      act(() => w.width(800));
      act(() => w.onscreen(1));
      w.tick(3000);
      act(() => w.onscreen(0));
      act(() => w.onscreen(1));
      w.tick(300);
      act(() => unchosen(Array.from(w.container.querySelectorAll("button"))).click());
      act(() => w.onscreen(1));
      const after = w.tick(600);
      expect(after.length, "frames in the 0.6s after a tap inside the hold").toBeGreaterThan(5);
      expect(
        new Set(after).size,
        "distinct frames in the 0.6s after a tap inside the hold, which is still",
      ).toBe(1);
    });
  },

  "when it may not animate, nothing on the page moves: no frame asked for, no canvas call, no mutation": (Demo) => {
    const still: [string, Partial<World>, (w: World) => void][] = [
      ["under prefers-reduced-motion", { reduce: true }, () => {}],
      ["in a hidden tab", {}, (w) => w.setHidden(true)],
      ["scrolled off screen", {}, (w) => w.onscreen(0)],
    ];
    for (const [when, setup, leave] of still) {
      withWorld(setup, (w) => {
        w.mount(Demo);
        act(() => w.width(800));
        act(() => w.onscreen(1));
        /* The half second before leaving is animation a demo is allowed. A
           page loaded under reduce is never allowed any, so there it is
           watched from the first moment and not after a head start. */
        if (!setup.reduce) w.tick(500);
        act(() => leave(w));
        const stop = watchPage(w);
        w.tick(setup.reduce ? 2000 : 1500);
        const moved = stop();
        expect(moved.mutations.slice(0, 3), "DOM mutations in 1.5s " + when).toEqual([]);
        expect(moved.drawn, "canvas calls in 1.5s " + when).toBe(0);
        expect(moved.frames, "frames asked for in 1.5s " + when).toBe(0);
        expect(moved.scrolls, "scroll positions set in 1.5s " + when).toBe(0);
      });
    }
  },

  "draws the same frame for the same reading, whatever it drew before": (Demo) =>
    withWorld({}, (w) => {
      /* Reviewer s-2e55, B3: draw() is called once per frame, so it is a
         tick, and a scene can count its calls, keep a clock of its own in a
         closure and use the shared reading only to recognise the hold. Its
         story ran backwards with every check green, because 'only forward' is
         a property of the number and the picture is whatever draw makes of
         it. docs/demos.md said 'draw keeps no memory between calls' in prose.

         WHY THIS IS A CHECK AND NOT A CONSTRUCTION. A closure can hold
         anything and no type says otherwise, so the stage cannot hand draw a
         reading and also take away its memory. What it can do is ask twice:
         the scene the mounted demo really handed over, on the board the stage
         really built, drawn at the same reading twice and then out of order.
         A scene with a clock of its own cannot answer the same way twice. */
      handed.scene = null;
      const before = handed.count;
      w.mount(Demo);
      act(() => w.width(800));
      act(() => w.onscreen(1));
      w.tick(1000);
      act(() => w.onscreen(0));
      expect(
        handed.count,
        "scenes handed to useDemoStage (none: the demo draws outside the shared stage, or this test file does not wrap ./stage/useDemoStage)",
      ).toBeGreaterThan(before);
      const scene = handed.scene as DemoScene;
      const env = handed.env as StageEnv;
      expect(env, "the stage drew the scene at least once").not.toBeNull();
      const at = (t: number) => {
        const from = w.log.length;
        env.ctx.clearRect(0, 0, env.W, env.H);
        scene.draw(env, t);
        return w.log.slice(from).join(";");
      };
      /* A trace is calls, not pixels, and a transform left on the context
         moves every later frame under an identical trace. So a frame opens
         and closes its own state: save and restore balance, and nothing
         moves the origin outside a pair. */
      const leaks = (frame: string) => {
        let depth = 0;
        for (const call of frame.split(";")) {
          if (call.startsWith("save(")) depth++;
          else if (call.startsWith("restore(")) depth--;
          else if (depth <= 0 && /^(translate|rotate|scale|transform)\(/.test(call)) return call;
          if (depth < 0) return "restore() with nothing saved";
        }
        return depth === 0 ? "" : depth + " save() never restored";
      };
      const { cycle, standing } = scene.clock;
      const readings = [0, standing * 0.31, standing * 0.74, standing, (standing + cycle) / 2, cycle * 0.97];
      /* in order, in order again, then backwards, which no running loop does:
         every reading is drawn three times and each time it is one frame */
      const first = readings.map(at);
      const again = readings.map(at);
      const back = readings.slice().reverse().map(at).reverse();
      readings.forEach((t, i) => {
        const r = t.toFixed(2);
        expect(leaks(first[i]), "context state the frame at " + r + " leaves behind for the next one").toBe("");
        expect(again[i] === first[i], "the reading " + r + " drawn a second time is the frame it was the first time").toBe(true);
        expect(back[i] === first[i], "the reading " + r + " drawn out of order is the frame it was in order").toBe(true);
      });
      for (const text of scene.live) {
        const keys = readings.map((t) => text.at(t));
        expect(readings.slice().reverse().map((t) => text.at(t)).reverse(), "the words at a reading").toEqual(keys);
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
        /* every attribute: a filter here is how an SVG width animated
           by a second loop went unseen (reviewer s-2e55, B2) */
        attributes: true,
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

  "mounts nothing operable that the noscript rule does not name": (Demo) =>
    withWorld({}, (w) => {
      /* The static render below is what a visitor with scripting off gets,
         and it cannot see a control that only exists after an effect ran: a
         helper that renders null on the server and a button once mounted.
         Such a control is dead weight to nobody, but it is also a button the
         frame did not render and the source rules did not read, so the rule
         "nothing operable but a hotspot" is held here too, on the live tree,
         after the loop has run and every button has been tapped. */
      const { gone } = noscriptRule(Demo);
      w.mount(Demo);
      act(() => w.width(800));
      act(() => w.onscreen(1));
      w.tick(1000);
      for (const b of Array.from(w.container.querySelectorAll("button"))) act(() => b.click());
      expect(
        Array.from(w.container.querySelectorAll(OPERABLE)).filter((el) => !gone(el)).map(describeEl),
        "operable on the mounted page and not covered by the noscript rule",
      ).toEqual([]);
    }),

  "leaves prose, the honest label and the readout with scripting off, and nothing to operate": (Demo) => {
    const { page, figure, noscript, gone } = noscriptRule(Demo);

    /* The must-list is what THIS render put on the page, not a list of class
       names: the board that will never be drawn, everything that would have
       to be operated, and the sentence telling the visitor to operate it. */
    const dead = Array.from(page.querySelectorAll("canvas," + OPERABLE)).concat(
      Array.from(page.querySelectorAll("*")).filter(
        (el) => el.children.length === 0 && HINTS.has((el.textContent ?? "").trim()),
      ),
    );
    expect(dead.some((el) => el.tagName === "CANVAS"), "a demo draws on a canvas").toBe(true);
    expect(
      dead.filter((el) => !noscript.contains(el) && !gone(el)).map(describeEl),
      "still on the page with scripting off",
    ).toEqual([]);

    const fallback = noscript.querySelector(".demo-fallback");
    expect((fallback?.textContent ?? "").trim(), "the written description").not.toBe("");
    const honest = Array.from(figure.querySelectorAll("*")).filter(
      (el) => el.children.length === 0 && el.textContent === demos.es.honest,
    );
    expect(honest.length, "the honest label").toBeGreaterThan(0);
    for (const el of honest) expect(gone(el), "the honest label is not removable").toBe(false);
    const boxes = Array.from(figure.querySelectorAll(BOX));
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
