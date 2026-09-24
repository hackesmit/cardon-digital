import React, { act, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, vi } from "vitest";
import { demos } from "../../../../lib/i18n/demos";
import { LocaleProvider } from "../../../../lib/i18n/LocaleProvider";
import { GHOST_BOXES, GHOSTS } from "./ghosts";
import type { DemoScene, StageEnv } from "../stage/useDemoStage";
import { drawing, handed, settle, World } from "./world";

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

const flat = (text: string | null) => (text ?? "").replace(/\s+/g, " ").trim();
const HINT_TEXTS = Array.from(HINTS, flat).filter((h) => h !== "");

/** The elements that CARRY a hint sentence: the deepest one holding each, so
    the figure and the page around it are not reported for their child's text.
    This was a leaf whose whole text equalled a hint, and
    `<p>{hint} <b>1-2</b></p>` is neither a leaf nor equal to one: the sentence
    telling a visitor to tap stayed on a page with no scripting, where nothing
    can be tapped, with the suite green (stand-in review of 077a7b4, probe 4).
    A sentence is a sentence wherever inside an element it sits. */
const hintCarriers = (page: ParentNode): Element[] => {
  const holds = (el: Element) => HINT_TEXTS.some((h) => flat(el.textContent).includes(h));
  return Array.from(page.querySelectorAll("*")).filter(
    (el) => holds(el) && !Array.from(el.children).some(holds),
  );
};

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
const unchosen = (picks: HTMLElement[]) =>
  picks.find((b) => b.getAttribute("aria-pressed") === "false") ?? picks[1];

/** Everything on the mounted page a visitor can operate, which is what a
    check that taps has to tap. It was querySelectorAll("button"), and a demo
    whose hotspots were <div role="button" tabIndex={0} class="rd-btn"> found
    none of them: the tap check below returned without tapping and the write
    check tapped nothing, both green, while every tap remounted the figure and
    told the story again from the top (stand-in review of 077a7b4, probe 3).
    The selector is the one the noscript rule is held to, so what a visitor can
    operate and what the checks tap are one list. */
const controls = (root: ParentNode) => Array.from(root.querySelectorAll<HTMLElement>(OPERABLE));

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

export const checks: Record<string, (Demo: Demo) => void | Promise<void>> = {
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

  "tells the story from the top, parks on the standing frame, and resumes from it": (Demo) => {
    /** The opening, on a page where hotspot `pick` was chosen before the board
        came into view, which the tap check proves is the same page as one where
        it was chosen later. Returns what there was to choose from.

        EVERY SELECTION AND NOT ONLY THE ONE A PAGE OPENS WITH. This ran on the
        default pick alone, so a scene that had a story for the first tank and
        only the payoff for the others opened on its ending after one tap, and
        stood there, with the suite green (stand-in review of 077a7b4, probe 5).
        What this cannot see is the probe's own shape, a reading mapped onto
        standing minus t, which plays a real story in the wrong direction: the
        page can tell that a frame is not the payoff and that the picture moves,
        and which way a drawing is going is what it means, not what it draws. */
    const opening = (pick: number): number => {
      let count = 0;
      withWorld({}, (w) => {
        w.mount(Demo);
        act(() => w.width(800));
        const picks = controls(w.container);
        count = picks.length;
        if (pick > 0) {
          if (pick >= picks.length) return;
          act(() => picks[pick].click());
        }
        const chosen = pick > 0 ? " with hotspot " + pick + " chosen" : "";
        const standing = w.standing();
        expect(standing, "the standing frame" + chosen).not.toBe("");
        act(() => w.onscreen(1));
        const frames = w.tick(3000);
        expect(frames.length, "frames in the first three seconds in view" + chosen).toBeGreaterThan(10);
        expect(new Set(frames).size, "distinct frames in the first three seconds" + chosen + ": a story, not a still").toBeGreaterThan(1);
        expect(frames, "the first thing a visitor sees" + chosen + " is not the ending").not.toContain(standing);
        expectPainted(frames[frames.length - 1], "the story" + chosen + ", three seconds in,");
      });
      return count;
    };
    const picks = opening(0);
    for (let i = 1; i < picks; i++) opening(i);

    /* the pause and the resume, which belong to the clock and not to the
       selection, on the page a visitor opens */
    withWorld({}, (w) => {
      w.mount(Demo);
      act(() => w.width(800));
      const standing = w.standing();
      act(() => w.onscreen(1));
      w.tick(3000);

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
    });
  },

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
    /** How long every page in this check runs for, tap included: past the
        latest tap it makes, so there is a stretch of story after all of them
        to compare. It is a fixed length and not one read off the demo's clock,
        which costs an assumption: it falls inside the story for both demos
        under the contract (standing at 31.8s and at 14s). A demo whose hold
        covered the end of it would have this check compare two still frames,
        and a tap that shifted time by less than the hold is wide would hide
        there. */
    const TOTAL = 10016;
    const story = (tapAfter: number) => {
      let frames: string[] = [];
      let picks: string[] = [];
      withWorld({}, (w) => {
        w.mount(Demo);
        act(() => w.width(800));
        const tap = () => {
          const all = controls(w.container);
          picks = all.map(describeEl);
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
        frames = w.tick(TOTAL - tapAfter).slice(-15);
      });
      return { frames, picks };
    };
    const control = story(0);
    /* No silent skip. A check that returns because it found nothing to tap
       reports a pass, and a demo whose hotspots were not <button> got one
       (probe 3 again). Nothing to operate is a demo with no selection and
       there is honestly nothing to compare; ONE thing to operate is a tap
       this check cannot judge, and it says so. */
    expect(
      control.picks.length === 1 ? control.picks : [],
      "one thing to operate: a lone control has no other selection to be compared against, so no check here judges its tap",
    ).toEqual([]);
    if (control.picks.length === 0) return;
    expect(control.frames.length).toBe(15);
    /* EVERY MOMENT A TAP CAN LAND AT, and not only before the story and three
       seconds in: a scene that latched the first reading it was shown between
       four seconds and the hold told the story again from the top on every tap
       inside that window, with the suite green (stand-in review of 077a7b4,
       probe 1). Each moment is a page of its own and every page runs for the
       same length of time, so the frames at the end line up whenever the tap
       came. */
    for (const tapAfter of [3008, 6008, 9008]) {
      expect(
        story(tapAfter).frames.filter((f, i) => f !== control.frames[i]).length,
        "frames at the end of the story that a visitor who tapped " +
          (tapAfter / 1000).toFixed(1) + "s in saw and one who tapped before it began did not",
      ).toBe(0);
    }

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
      act(() => unchosen(controls(w.container)).click());
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
         A scene that counts its calls cannot answer the same way twice. One
         that reads the PAGE's clock could, while the draws were made in a
         single instant (reviewer s-1022, L4), so they no longer are: see
         at() below, and the two-page check after this one for time that got
         in by a route this one does not walk. */
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
      /* TIME PASSES BETWEEN THE DRAWS (reviewer s-1022, L4). They used to be
         made in one instant, so a draw() that kept no memory and read
         performance.now() was one frame per reading by accident: its story
         ran backwards in Chromium with this check green. Every source of time
         and of luck is the world's (./world.tsx), so an uneven stretch of all
         of them goes by before each draw, and a picture made from any of them
         is a different picture. */
      let nth = 0;
      const at = (t: number) => {
        w.now += 977 + 131 * (nth++ % 7);
        const from = w.log.length;
        env.ctx.clearRect(0, 0, env.W, env.H);
        drawing.depth++;
        try {
          scene.draw(env, t);
        } finally {
          drawing.depth--;
        }
        return w.log.slice(from).join(";");
      };
      /* and everything else the stage calls on a scene is called in between,
         as a resize, a new scene or a tap would: a draw whose answer depends
         on how often layout() ran has a memory too, kept one call further
         away (reviewer s-1022, L6) */
      const churn = () => {
        scene.height(env.W, env.phone);
        scene.layout(env);
        scene.layout(env);
        scene.hotspots?.(env);
        for (const text of scene.live) text.at(scene.clock.standing);
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
      churn();
      const again = readings.map(at);
      churn();
      const back = readings.slice().reverse().map(at).reverse();
      readings.forEach((t, i) => {
        const r = t.toFixed(2);
        expect(leaks(first[i]), "context state the frame at " + r + " leaves behind for the next one").toBe("");
        expect(again[i] === first[i], "the reading " + r + " drawn a second time is the frame it was the first time").toBe(true);
        expect(back[i] === first[i], "the reading " + r + " drawn out of order is the frame it was in order").toBe(true);
      });
      const words = (t: number) => {
        w.now += 977;
        drawing.depth++;
        try {
          return scene.live.map((text) => text.at(t));
        } finally {
          drawing.depth--;
        }
      };
      const keys = readings.map(words);
      expect(readings.slice().reverse().map(words).reverse(), "the words at a reading").toEqual(keys);
      /* The direct form of the same property, over the second of story above
         and every draw here: a picture is made from its reading, so it has no
         reason to ask the page what time it is or for a random number, and
         each time one did is on the world's list. */
      expect(
        Array.from(new Set(w.asked)),
        "what draw() or a live text asked the page for while making a picture",
      ).toEqual([]);
    }),

  "tells the same story on a page opened at another time, on another day, with other luck": (Demo) => {
    /* Reviewer s-1022, L4, as a class. The purity check above asks a scene
       the same question twice on ONE page. This asks it on two, which differ
       in everything a page can differ in without the visitor doing anything:
       when it was opened by the page's clock, what the date is, and what
       Math.random and crypto will say. The visitors do the same things at
       the same moments, so they must see the same frames and read the same
       words. It needs no knowledge of the scene and none of HOW the time got
       in: read in draw(), in layout(), in the component body or an effect,
       kept in a closure, a ref or the DOM, it shows here or it changed
       nothing anybody can see. One route is out of its reach, a value noted
       while the MODULE was evaluated, since both pages mount one evaluation;
       contract.test.tsx refuses that at the import (`importing` in
       ./world.tsx).

       WHY THIS IS A CHECK AND NOT A CONSTRUCTION. draw() is a function and
       the page's clock is a global: JavaScript has no way to call a function
       with the globals out of its reach, short of another realm, and a scene
       draws on a canvas that lives in this one. The stage cannot take the
       clock away, so the world owns every clock there is and moves them. */
    const story = (setup: Partial<World>) => {
      const seen: string[] = [];
      withWorld(setup, (w) => {
        w.mount(Demo);
        act(() => w.width(800));
        /* the words and not the markup: two pages in a browser evaluate a
           module twice, these two mount it once, so an id from a counter at
           the top of a file differs here and nowhere else */
        const page = () => w.container.textContent ?? "";
        seen.push(w.standing(), page());
        act(() => w.onscreen(1));
        /* a cycle fits in sixty seconds, so this is all of it and the seam */
        for (let s = 0; s < 61; s++) {
          seen.push(...w.tick(1008).filter((f) => f.startsWith("clearRect(")), page());
          if (s === 4) {
            const picks = controls(w.container);
            if (picks.length > 1) act(() => unchosen(picks).click());
          }
        }
        act(() => w.onscreen(0));
        seen.push(w.standing(), page());
      });
      return seen;
    };
    const one = story({ now: 1000, seed: 1 });
    const other = story({ now: 5777, epoch: Date.UTC(2031, 1, 3, 4, 5, 6, 789), seed: 20260917 });
    expect(one.length, "frames and pages recorded in sixty-one seconds in view (hardly any: the demo is not animating, so there is no story to compare)").toBeGreaterThan(100);
    expect(other.length, "frames and pages the second visitor saw, against the first").toBe(one.length);
    expect(
      other.filter((f, i) => f !== one[i]).length,
      "frames or pages, of " + one.length + ", that differ between two visitors who did the same things on pages opened at different times",
    ).toBe(0);
  },

  "a theme change or a window resize changes the picture and nothing about the time": (Demo) => {
    /* The tap check's judge, for the two other events every demo on this
       site receives (reviewer s-1022, L7). The stage answers both itself and
       touches no time doing it, so through the stage this cannot fail. It is
       for a demo that answers them as well: the reviewer's keyed its figure
       on the theme event 'so it repaints with the new palette', which is a
       new mount, and a visitor in the hold who switched theme was sent back
       to 'empieza el servicio'. One visitor gets the event before the board
       comes into view and one three seconds into the story; afterwards they
       have had the same events, so they must see the same frames. */
    const events: [string, () => void][] = [
      ["a theme change", () => window.dispatchEvent(new Event("cardon-mode"))],
      ["a window resize", () => window.dispatchEvent(new Event("resize"))],
    ];
    for (const [what, fire] of events) {
      const story = (after: number) => {
        let frames: string[] = [];
        withWorld({}, (w) => {
          w.mount(Demo);
          act(() => w.width(800));
          if (after === 0) act(fire);
          act(() => w.onscreen(1));
          w.tick(after);
          if (after > 0) {
            act(fire);
            /* as in the tap check: the stub does not tell a NEW observer
               where its target is, and a browser does */
            act(() => w.onscreen(1));
          }
          /* past the stage's 140ms resize debounce, then 0.6s */
          frames = w.tick(3008 + 1008 - after).filter((f) => f.startsWith("clearRect(")).slice(-15);
        });
        return frames;
      };
      const control = story(0);
      expect(control.length, "frames in the second after " + what + " (too few: the demo is not animating, so there is no story to compare)").toBe(15);
      const late = story(3008);
      /* a figure remounted by the event and never drawn again is no story
         at all, and an empty list differs from nothing */
      expect(late.length, "frames in the second after " + what + " three seconds into the story").toBe(15);
      expect(
        late.filter((f, i) => f !== control[i]).length,
        "frames after " + what + " three seconds into the story that a visitor who had it before the story began did not see",
      ).toBe(0);
    }
  },

  "mounts nothing that moves by itself: only elements that stand still, and no animation handed to the browser": async (Demo) => {
    /* Reviewer s-1022, L5, as a class: see World.strangers and the ambient
       layer in ./world.tsx for why this is an allow list of elements and a
       count at the platform's doors, and why it is not a gate.

       WHY THIS IS A REFUSAL AND NOT A GATE. The stage gates what it runs. It
       cannot gate what the browser runs: there is no switch on a subtree
       that stops Web Animations and SMIL, an animation started after a gate
       closed is not an event the stage hears, and patching Element.animate
       in production to hear it is not something a marketing site should do.
       So the contract's own sentence is held instead, 'anything that moves
       is drawn by draw or is a live text', and declared motion is refused
       outright, on every page, not only a reduced one.

       A declaration can arrive at any moment and for any reason, so this is
       the one check that does EVERYTHING the others do to a page, for a
       whole cycle and its seam, and looks after each thing it did. It is
       also the one check that waits: what a demo leaves for a promise or a
       dynamic import runs while the page is still here. */
    for (const reduce of [false, true]) {
      const w = new World();
      w.reduce = reduce;
      w.install();
      try {
        const seen = new Set<string>();
        const look = () => w.strangers().forEach((x) => seen.add(x));
        const wait = () => act(async () => void (await settle()));
        w.mount(Demo);
        look();
        act(() => w.width(800));
        act(() => w.onscreen(1));
        await wait();
        look();
        const stimuli: Record<number, () => void> = {
          3: () => window.dispatchEvent(new Event("cardon-mode")),
          5: () => window.dispatchEvent(new Event("resize")),
          7: () => controls(w.container).forEach((b) => b.click()),
          9: () => w.setReduce(!reduce),
          11: () => w.setReduce(reduce),
          13: () => w.setHidden(true),
          15: () => w.setHidden(false),
          17: () => w.onscreen(0),
          19: () => w.onscreen(1),
          21: () => w.width(500),
        };
        for (let s = 0; s < 62; s++) {
          if (stimuli[s]) {
            act(stimuli[s]);
            await wait();
          }
          w.tick(1008);
          look();
        }
        await wait();
        look();
        expect(
          Array.from(seen),
          "on the page" + (reduce ? " under prefers-reduced-motion" : "") + " and able to move without the stage",
        ).toEqual([]);
      } finally {
        w.dispose();
      }
    }
  },

  "rewrites nothing whose box is not held open by ghosts, and the words are the reading's": (Demo) =>
    withWorld({}, (w) => {
      handed.scene = null;
      w.mount(Demo);
      act(() => w.width(800));
      /* WHAT THE WORDS SAY, and not only that their box is held open. The
         judgement below accepts any value a ghost reserves room for, at any
         moment, so a caption driven by a clock of the demo's own passed while
         the words ran backwards against the picture: 'servicio en su punto' at
         the top of the story and 'empieza el servicio' in the hold (stand-in
         review of 077a7b4, probe 2). A live text is a function of the reading
         by its own declaration, so the word showing is the word the scene
         names AT the reading the stage last drew, and there is no other writer
         of it. */
      const words = () => {
        const scene = handed.scene as DemoScene | null;
        if (!scene) return;
        const live = Array.from(w.container.querySelectorAll(".demo-caption-box .demo-caption"));
        expect(live.length, "live captions on the page, one per scene.live").toBe(scene.live.length);
        scene.live.forEach((text, i) => {
          expect(
            live[i].textContent,
            'the word in the "' + text.name + '" box at the reading ' + handed.t.toFixed(2) +
              " the board was last drawn at",
          ).toBe(text.values[text.at(handed.t)]);
        });
      };
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
      words();
      /* a whole cycle in one-second slices, so the words are read against the
         reading about sixty times and not only at the end */
      for (let s = 0; s < 60; s++) {
        w.tick(1000);
        words();
      }
      judgeWrites(drain(), "by the running loop");
      mo.disconnect();

      /* and everything the visitor can change */
      mo.observe(w.container, { subtree: true, childList: true, characterData: true });
      const picks = controls(w.container);
      for (const b of picks.concat(picks.slice(0, 1))) {
        act(() => b.click());
        judgeWrites(drain(), "by a tap on " + describeEl(b));
        words();
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
      for (const b of controls(w.container)) act(() => b.click());
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
    const dead = Array.from(page.querySelectorAll("canvas," + OPERABLE)).concat(hintCarriers(page));
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
export const failing = async (Demo: Demo): Promise<string[]> => {
  const out: string[] = [];
  for (const [name, check] of Object.entries(checks)) {
    try {
      await check(Demo);
    } catch {
      out.push(name);
    }
  }
  return out;
};
