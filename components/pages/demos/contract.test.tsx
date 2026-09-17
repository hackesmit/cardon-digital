// @vitest-environment jsdom
import { readdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import React, { act, StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { describe, expect, it, vi } from "vitest";
import { checks, failing, type Demo } from "./contract/checks";
import { World } from "./contract/world";
import { observeOnscreen } from "./motion";
import { DemoFigure, Hotspot } from "./stage/DemoFigure";
import type { DemoScene, StageEnv } from "./stage/useDemoStage";

/**
 * Every demo in this directory, mounted and driven (bead hq-3pfhe.7).
 *
 * The checks are in ./contract/checks.tsx and the page they run on is
 * ./contract/world.tsx. This file only decides WHAT is checked: every .tsx
 * beside it, found by listing the directory, so a demo is under the contract
 * from the commit that adds it and nobody has to remember to register it.
 */

/* observeOnscreen is the one sanctioned way to an IntersectionObserver. The
   real function runs; this only marks the stack while it does, so the world
   can tell its observer from one a demo built for itself. */
vi.mock("./motion", async (original) => {
  const real = await original<typeof import("./motion")>();
  const { provenance } = await import("./contract/world");
  return {
    ...real,
    observeOnscreen: (...args: Parameters<typeof real.observeOnscreen>) => {
      provenance.depth++;
      try {
        return real.observeOnscreen(...args);
      } finally {
        provenance.depth--;
      }
    },
  };
});

/* The same for the stage: the real hook runs, and what it is handed and what
   it hands draw() are written down for the purity check. The wrapper is one
   object per scene, so it adds no identity churn of its own. */
vi.mock("./stage/useDemoStage", async (original) => {
  const real = await original<typeof import("./stage/useDemoStage")>();
  const { handed, drawing } = await import("./contract/world");
  const wrapped = new WeakMap<object, DemoScene>();
  /* while a picture is being made, the world writes down every question it
     asks about the time or about luck (./contract/world.tsx, `drawing`) */
  const marked = <A extends unknown[], R>(fn: (...a: A) => R) => (...a: A): R => {
    drawing.depth++;
    try {
      return fn(...a);
    } finally {
      drawing.depth--;
    }
  };
  return {
    ...real,
    useDemoStage: (scene: DemoScene, ...rest: [never, never]) => {
      handed.count++;
      let w = wrapped.get(scene);
      if (!w) {
        /* defined, not assigned: a frozen scene is a lawful scene, and
           assigning over an inherited read-only property throws */
        const made: DemoScene = Object.create(scene, {
          draw: {
            value: marked((env: StageEnv, t: number) => {
              handed.scene = scene;
              handed.env = env;
              scene.draw(env, t);
            }),
          },
          live: {
            value: scene.live.map((text) =>
              Object.create(text, { at: { value: marked((t: number) => text.at(t)) } }),
            ),
          },
        });
        wrapped.set(scene, (w = made));
      }
      return real.useDemoStage(w, ...rest);
    },
  };
});

const load = async (path: string): Promise<Demo> => {
  const mod = (await import(/* @vite-ignore */ path)) as { default?: Demo };
  if (typeof mod.default !== "function") throw new Error(path + " has no default export to mount");
  return mod.default;
};

const components = readdirSync(dirname(fileURLToPath(import.meta.url))).filter(
  (f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"),
);

describe("every demo component, mounted", () => {
  it("exists", () => expect(components.length).toBeGreaterThan(0));

  describe.each(components)("%s", (file) => {
    it.each(Object.keys(checks))("%s", async (name) => {
      checks[name](await load("./" + file));
    });
  });
});

/**
 * The reviewers' loophole components, verbatim from state/review/s-4a6c and
 * state/review/s-5836, each of which passed the whole suite when it was
 * written. They live in lib/testing/loopholes/demos, outside components/, because they
 * are not visuals and the visuals guard would adopt them. Dropping any of
 * them beside this file turns the run above red;
 * these are the same fact without the drop, so the checks cannot drift back
 * to describing one file.
 */
describe("the checks are load bearing", () => {
  const OBSERVER = "learns it is on screen from observeOnscreen and builds no observer of its own";
  const FROZEN = "starts its loop when reduced motion is turned off on a page loaded under it";
  const CLOCK = "tells the story from the top, parks on the standing frame, and resumes from it";
  const WRITES = "rewrites nothing whose box is not held open by ghosts";
  const LIVE = "keeps every live region inside a ghost box";
  const NOSCRIPT =
    "leaves prose, the honest label and the readout with scripting off, and nothing to operate";
  const PLAN = "decides its plan on the fractional layout box and draws at the layout width";
  const STANDS = "stands on a drawn frame, and under reduced motion that frame never moves";

  it("fails the s-5836 cellar on each of the five things it does", async () => {
    const failed = failing(await load("../../../lib/testing/loopholes/demos/CellarDemo.tsx"));
    /* an observer reached as window["Intersection" + "Observer"], frozen for
       life, the clock backwards on resume, the covers span written through
       firstChild.nodeValue and the selection row with no ghosts, a live
       region outside a box, twelve hotspots and the hint left on the page */
    expect(failed).toEqual(
      expect.arrayContaining([OBSERVER, FROZEN, CLOCK, WRITES, LIVE, NOSCRIPT]),
    );
    /* it measures the way the reference does, and the check agrees: the
       failures above are the behaviours, not the fixture's shape */
    expect(failed).not.toContain(PLAN);
  });

  it.each(["../../../lib/testing/loopholes/demos/StringDemo.tsx", "../../../lib/testing/loopholes/demos/ProduccionDemo.tsx"])(
    "fails %s, which no string can talk its way out of",
    async (path) => {
      const failed = failing(await load(path));
      expect(failed).toEqual(expect.arrayContaining([STANDS, CLOCK, WRITES, PLAN]));
    },
  );

  it("fails the s-4a6c Hospitalidad, an observer behind an alias", async () => {
    expect(failing(await load("../../../lib/testing/loopholes/demos/HospitalidadDemo.tsx"))).toEqual(
      expect.arrayContaining([OBSERVER, STANDS]),
    );
  });

  /* The s-2e55 three: each USES the shared stage, as docs/demos.md describes,
     and each passed the whole suite, 316 of 316, when it was written. */
  const TAP = "a tap changes the selection and nothing about the time";
  const STILL =
    "when it may not animate, nothing on the page moves: no frame asked for, no canvas call, no mutation";
  const PURE = "draws the same frame for the same reading, whatever it drew before";

  it("passes the s-2e55 tap demo, because a scene built on every render no longer reaches the clock", async () => {
    /* B1 is closed in the stage and not by a check, so the fixture that
       restarted its story on every tap is now simply a correct demo. The
       check it used to need is held red by the remounting demo below, and
       against the old stage by the mutation table in state/review/s-07b8. */
    expect(failing(await load("../../../lib/testing/loopholes/demos/TapRestartDemo.tsx"))).toEqual([]);
  });

  it("fails the s-2e55 SVG bar, a second loop beside the stage that asks nobody whether it may run", async () => {
    const failed = failing(await load("../../../lib/testing/loopholes/demos/SvgLoopDemo.tsx"));
    expect(failed).toEqual(expect.arrayContaining([STILL, WRITES]));
    /* its canvas is lawful, so it is the bar the checks object to */
    expect(failed).not.toContain(STANDS);
    expect(failed).not.toContain(CLOCK);
    expect(failed).not.toContain(PURE);
  });

  it("fails the s-2e55 closure clock, whose draw() counts its calls", async () => {
    const failed = failing(await load("../../../lib/testing/loopholes/demos/OwnClockDemo.tsx"));
    expect(failed).toContain(PURE);
  });

  /* Two demos that use the mechanism faithfully and still should not pass,
     found by the cross-vendor review of this harness. */
  const scene = (draw: DemoScene["draw"]): DemoScene => ({
    hue: "primary",
    clock: { cycle: 10, standing: 5 },
    height: () => 100,
    layout: () => {},
    draw,
    live: [
      { name: "caption", values: { a: "a", b: "b" }, keys: ["a", "b"], initial: "a", at: (t) => (t < 5 ? "a" : "b") },
    ],
  });
  const figure = (s: DemoScene, children?: React.ReactNode) => (
    <DemoFigure demo="fixture" scene={s} title="t" honest="vista ilustrativa, no son datos de cliente" fallback="prose">
      {children}
    </DemoFigure>
  );

  it("fails a board that sets styles and paints nothing", () => {
    const blank = scene((env, t) => {
      env.ctx.fillStyle = t >= 5 && t < 6.1 ? "standing" : String(t);
    });
    const painted = scene((env, t) => {
      env.ctx.fillStyle = t >= 5 && t < 6.1 ? "standing" : String(t);
      env.ctx.fillRect(0, 0, 10, 10);
    });
    expect(failing(() => figure(blank))).toEqual(expect.arrayContaining([STANDS, CLOCK]));
    /* the same scene with one rectangle in it passes both, so it is the
       missing paint the checks object to */
    const ok = failing(() => figure(painted));
    expect(ok).not.toContain(STANDS);
    expect(ok).not.toContain(CLOCK);
  });

  it("fails a demo that remounts its figure on every tap, the one way left to restart the story", () => {
    /* A key is React's way of saying 'a different component', so a figure
       keyed on the selection IS a new mount with a new clock, and the stage
       cannot tell it from a visitor arriving. That much is not closable by
       construction; this is the check that sees it. */
    const s = scene((env, t) => env.ctx.fillRect(0, 0, t >= 5 && t < 6.1 ? 50 : t, 10));
    function Remounts({ lead = false }: { lead?: boolean }) {
      const [picked, setPicked] = useState(0);
      return (
        <>
          {lead ? <button type="button">not a hotspot</button> : null}
          <DemoFigure
            key={picked}
            demo="fixture"
            scene={s}
            title="t"
            honest="vista ilustrativa, no son datos de cliente"
            fallback="prose"
            selection={picked}
            hotspots={[0, 1].map((i) => (
              <Hotspot key={i} picked={i === picked} onPick={() => setPicked(i)} label={"spot " + i} />
            ))}
          />
        </>
      );
    }
    expect(failing(Remounts)).toContain(TAP);
    /* with another button ahead of them, the second button on the page is
       the hotspot already chosen, and tapping it changes nothing */
    expect(failing(() => <Remounts lead />)).toContain(TAP);
  });

  it("draws a scene swapped in mid-story at the reading the clock already had", () => {
    /* the other half of B1's fix: a new scene object is a new picture, so it
       has to be DRAWN, from the old time. A stage that ignored it would keep
       a stale locale on the board for the life of the mount. */
    const make = (mark: number): DemoScene =>
      scene((env, t) => env.ctx.fillRect(mark, 0, t >= 5 && t < 6.1 ? 50 : Math.round(t * 10), 10));
    function Swaps() {
      const [picked, setPicked] = useState(0);
      return (
        <DemoFigure
          demo="fixture"
          scene={make(picked)}
          title="t"
          honest="vista ilustrativa, no son datos de cliente"
          fallback="prose"
          selection={picked}
          hotspots={[0, 1].map((i) => (
            <Hotspot key={i} picked={i === picked} onPick={() => setPicked(i)} label={"spot " + i} />
          ))}
        />
      );
    }
    expect(failing(Swaps)).toEqual([]);
    const w = new World();
    w.install();
    try {
      w.mount(Swaps);
      act(() => w.width(800));
      act(() => w.onscreen(1));
      const before = w.tick(2000);
      expect(before[before.length - 1]).toContain("fillRect(0,0,");
      act(() => w.container.querySelectorAll("button")[1].click());
      const after = w.tick(320);
      /* the new scene's mark, at widths that carry on from two seconds in */
      for (const f of after) expect(f).toMatch(/fillRect\(1,0,2\d,10\)/);
    } finally {
      w.dispose();
    }
  });

  /* STILL is three conditions and three kinds of evidence, and each has to be
     carrying weight: a second loop beside the stage that honours two of the
     three gates and ignores the third, and loops that leave only one kind of
     trace. None of them touches the 2d context of the stage's canvas, which
     is all the old motion checks read. */
  const beside = (honours: { reduce: boolean; hidden: boolean; offscreen: boolean }, act: (el: HTMLElement, n: number) => void, frames = false) =>
    function Beside() {
      const el = useRef<HTMLSpanElement>(null);
      useEffect(() => {
        let on = true;
        const stop = honours.offscreen ? observeOnscreen(el.current!.parentElement!, (v) => (on = v)) : () => {};
        let n = 0;
        let id = 0;
        const step = () => {
          if (frames) id = requestAnimationFrame(step);
          if (honours.reduce && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          if (honours.hidden && document.hidden) return;
          if (honours.offscreen && !on) return;
          act(el.current!, ++n);
        };
        if (frames) id = requestAnimationFrame(step);
        else id = window.setInterval(step, 50);
        return () => {
          stop();
          if (frames) cancelAnimationFrame(id);
          else window.clearInterval(id);
        };
      }, []);
      return <span ref={el} />;
    };
  const lawful = scene((env) => env.ctx.fillRect(0, 0, 10, 10));
  const attr = (el: HTMLElement, n: number) => el.setAttribute("data-n", String(n));

  it.each([
    ["prefers-reduced-motion", { reduce: false, hidden: true, offscreen: true }],
    ["a hidden tab", { reduce: true, hidden: false, offscreen: true }],
    ["being off screen", { reduce: true, hidden: true, offscreen: false }],
  ])("fails a timer beside the stage that ignores only %s", (_, honours) => {
    const Bar = beside(honours, attr);
    expect(failing(() => figure(lawful, <Bar />))).toContain(STILL);
  });

  it("passes a second loop that honours all three gates, so it is the motion and not the loop that fails", () => {
    const Bar = beside({ reduce: true, hidden: true, offscreen: true }, attr);
    expect(failing(() => figure(lawful, <Bar />))).not.toContain(STILL);
  });

  it("fails a timer that only scrolls, which leaves no mutation, no canvas call and no frame", () => {
    const Scroller = beside({ reduce: false, hidden: false, offscreen: false }, (el, n) => (el.scrollLeft = n));
    expect(failing(() => figure(lawful, <Scroller />))).toContain(STILL);
  });

  it("fails a bar that moves only in the first half second of a page loaded under reduce", () => {
    const Brief = beside({ reduce: false, hidden: true, offscreen: true }, (el, n) => {
      if (n < 9) attr(el, n);
    });
    expect(failing(() => figure(lawful, <Brief />))).toContain(STILL);
  });

  it("fails a bar that moves in a portal, outside the mount", () => {
    const Inner = beside({ reduce: false, hidden: false, offscreen: false }, attr);
    const Portal = () => createPortal(<Inner />, document.body);
    expect(failing(() => figure(lawful, <Portal />))).toContain(STILL);
  });

  it("fails a draw that leaves a transform on the context, and takes a frozen scene", () => {
    const drifting = scene((env) => {
      env.ctx.translate(1, 0);
      env.ctx.fillRect(0, 0, 10, 10);
    });
    expect(failing(() => figure(drifting))).toContain(PURE);
    const kept = Object.freeze(
      scene((env) => {
        env.ctx.save();
        env.ctx.translate(1, 0);
        env.ctx.fillRect(0, 0, 10, 10);
        env.ctx.restore();
      }),
    );
    expect(failing(() => figure(kept))).not.toContain(PURE);
  });

  it("fails a loop that leaves no mutation and no canvas call, only frames asked for", () => {
    /* it touches nothing the page can see, so the frame count is the only
       witness: a loop left spinning off screen is the battery, not the eye */
    const Idle = beside({ reduce: false, hidden: false, offscreen: false }, () => {}, true);
    expect(failing(() => figure(lawful, <Idle />))).toContain(STILL);
  });

  it("fails a timer that draws on a canvas of its own and changes nothing in the DOM", () => {
    function Own() {
      const c = useRef<HTMLCanvasElement>(null);
      useEffect(() => {
        const id = window.setInterval(() => c.current!.getContext("2d")!.fillRect(0, 0, 1, 1), 50);
        return () => window.clearInterval(id);
      }, []);
      return <canvas ref={c} className="demo-canvas" />;
    }
    expect(failing(() => figure(lawful, <Own />))).toContain(STILL);
  });

  it("fails a draw that remembers the furthest reading it was shown", () => {
    /* one memory per mount, the way a real scene's closure is: a memory
       shared by every mount in this file would be full before PURE ran */
    function HiWater() {
      const s = useMemo(() => {
        let hi = 0;
        return scene((env, t) => {
          hi = Math.max(hi, t);
          env.ctx.fillRect(0, 0, t >= 5 && t < 6.1 ? 50 : hi, 10);
        });
      }, []);
      return figure(s);
    }
    expect(failing(HiWater)).toContain(PURE);
  });

  /* The s-1022 four: each through the shared stage, each 345 of 345 when it
     was written, two of them the s-2e55 classes again a few lines away. The
     checks that catch them do not know them: the layers below are each held
     by a fixture of a different shape. */
  const PAGES = "tells the same story on a page opened at another time, on another day, with other luck";
  const EVENTS = "a theme change or a window resize changes the picture and nothing about the time";
  const MOVES =
    "mounts nothing that moves by itself: only elements that stand still, and no animation handed to the browser";
  const loophole = (name: string) => load("../../../lib/testing/loopholes/demos/" + name + ".tsx");

  it("fails the s-1022 wall clock, a draw() with no memory that reads the page's clock", async () => {
    const failed = failing(await loophole("WallClockDemo"));
    expect(failed).toEqual(expect.arrayContaining([PURE, PAGES]));
    expect(failed).not.toContain(MOVES);
  });

  it("fails the s-1022 SMIL and Web Animation demo, motion the browser runs and jsdom does not", async () => {
    expect(failing(await loophole("SmilDemo"))).toEqual([MOVES]);
  });

  it("fails the s-1022 figure keyed on the theme event, and the one keyed on a tap", async () => {
    expect(failing(await loophole("KeyThemeDemo"))).toEqual([EVENTS]);
    expect(failing(await loophole("KeyTapDemo"))).toContain(TAP);
  });

  it("fails the s-1022 scene that reads back the DOM the stage wrote", async () => {
    expect(failing(await loophole("DomReadDemo"))).toEqual([CLOCK]);
  });

  it("fails the s-1022 scene that is pure per reading and counts its layouts", async () => {
    expect(failing(await loophole("ResizeMemoryDemo"))).toEqual([PURE]);
  });

  const bar = (env: StageEnv, t: number, shift = 0) =>
    env.ctx.fillRect(0, 0, t >= 5 && t < 6.1 ? 50 : ((t * 10 + shift) % 97) + 1, 10);

  it.each<[string, () => number]>([
    ["Date.now()", () => Date.now()],
    ["new Date()", () => new Date().getTime()],
    ["Date() called as a function", () => Date.parse(Date())],
    ["a formatter asked for now", () => 1000 * Number(new Intl.DateTimeFormat("en", { second: "numeric" }).format())],
    ["formatToParts asked for now", () => Number(new Intl.DateTimeFormat("en", { minute: "numeric" }).formatToParts()[0].value) * 1000],
    ["document.timeline", () => Number(document.timeline.currentTime)],
    ["an event's timeStamp", () => new Event("x").timeStamp],
    ["Math.random()", () => Math.random() * 1e6],
    ["crypto.getRandomValues()", () => crypto.getRandomValues(new Uint32Array(1))[0]],
    ["crypto.randomUUID()", () => parseInt(crypto.randomUUID().slice(0, 6), 16)],
  ])("fails a draw() that moves by %s, in the sweep only", (_, read) => {
    const s = scene((env, t) => bar(env, t, t >= 5 ? 0 : Math.floor(read() / 1000)));
    expect(failing(() => figure(s))).toEqual(expect.arrayContaining([PURE, PAGES]));
  });

  it("fails a scene that noted when the page was opened and draws from that, though every draw on one page agrees", () => {
    /* the time gets in through the component body, not through draw(), and
       one page can never see it: asked twice it answers twice the same */
    function Opened() {
      const s = useMemo(() => {
        const opened = performance.now();
        return scene((env, t) => bar(env, t, Math.floor(opened / 100)));
      }, []);
      return figure(s);
    }
    const failed = failing(Opened);
    expect(failed).toContain(PAGES);
    expect(failed).not.toContain(PURE);
  });

  it("fails a draw() that reads the clock and has not used it yet", () => {
    /* every frame on every page agrees, for the first day: only the question
       itself gives it away */
    const s = scene((env, t) => bar(env, t, performance.now() > 86400000 ? 40 : 0));
    const failed = failing(() => figure(s));
    expect(failed).toContain(PURE);
    expect(failed).not.toContain(PAGES);
  });

  it("fails words chosen by the wall clock, which no frame shows", () => {
    const s: DemoScene = {
      ...scene((env, t) => bar(env, t)),
      live: [
        { name: "caption", values: { a: "a", b: "b" }, keys: ["a", "b"], initial: "a", at: () => (Math.floor(Date.now() / 1000) % 2 ? "a" : "b") },
      ],
    };
    expect(failing(() => figure(s))).toEqual(expect.arrayContaining([PURE, PAGES]));
  });

  it("passes the same bar drawn from the reading alone, so it is the clock the checks object to", () => {
    expect(failing(() => figure(scene((env, t) => bar(env, t))))).toEqual([]);
  });

  const lawfulBar = scene((env, t) => bar(env, t));
  it.each<[string, () => React.ReactNode]>([
    ["an SMIL animate", () => <svg><rect width="10" height="8"><animate attributeName="width" from="10" to="120" dur="1s" /></rect></svg>],
    ["an SMIL set", () => <svg><rect><set attributeName="x" to="9" begin="1s" /></rect></svg>],
    ["a marquee", () => React.createElement("marquee", null, "llenándose")],
    ["a video", () => <video autoPlay muted loop src="/room.mp4" />],
    ["an image, which may be animated and cannot be told from one that is not", () => <img alt="" src="/room.gif" />],
    ["an element nobody has heard of", () => React.createElement("spinner-next")],
    ["an inline animation", () => <span style={{ animation: "spin 1s infinite" }} />],
    ["an inline transition", () => <span style={{ transition: "width 1s" }} />],
    ["an inline background image", () => <span style={{ backgroundImage: "url(/room.gif)" }} />],
    ["a style element of its own", () => <style>{".x{animation:spin 1s infinite !important}"}</style>],
  ])("fails a lawful scene beside %s", (_, extra) => {
    const Extra = () => <>{extra()}</>;
    expect(failing(() => figure(lawfulBar, <Extra />))).toEqual([MOVES]);
  });

  it.each<[string, (el: HTMLElement) => void]>([
    ["Element.animate, unguarded", (el) => void el.animate([{ opacity: 0 }, { opacity: 1 }], 600)],
    ["Element.animate, only when reduce is off", (el) => {
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) el.animate?.([{ opacity: 0 }], 600);
    }],
    ["new Animation over a KeyframeEffect", (el) => new Animation(new KeyframeEffect(el, [{ opacity: 0 }], 600)).play()],
    ["a view transition", () => void (document as unknown as { startViewTransition(cb: () => void): void }).startViewTransition(() => {})],
  ])("fails a lawful scene beside %s", (_, start) => {
    function Starts() {
      const el = useRef<HTMLSpanElement>(null);
      useEffect(() => start(el.current!), []);
      return <span ref={el} />;
    }
    expect(failing(() => figure(lawfulBar, <Starts />))).toEqual([MOVES]);
  });

  it("fails an SMIL animation in a portal, outside the mount", () => {
    /* a server render has no portals, so this one arrives with the effect */
    function Portal() {
      const [on, setOn] = useState(false);
      useEffect(() => setOn(true), []);
      return on ? createPortal(<svg><circle r="2"><animateMotion path="M0 0L9 9" dur="1s" /></circle></svg>, document.body) : null;
    }
    expect(failing(() => figure(lawfulBar, <Portal />))).toEqual([MOVES]);
  });

  it("fails a Web Animation started by a tap and not at mount", () => {
    function OnTap() {
      const [picked, setPicked] = useState(0);
      const el = useRef<HTMLSpanElement>(null);
      useEffect(() => {
        if (picked) el.current!.animate?.([{ opacity: 0 }], 600);
      }, [picked]);
      return (
        <DemoFigure demo="fixture" scene={lawfulBar} title="t" honest="vista ilustrativa, no son datos de cliente" fallback="prose" selection={picked}
          hotspots={[0, 1].map((i) => <Hotspot key={i} picked={i === picked} onPick={() => setPicked(i)} label={"spot " + i} />)}>
          <span ref={el} />
        </DemoFigure>
      );
    }
    expect(failing(OnTap)).toEqual([MOVES]);
  });

  it("passes static svg and text beside a lawful scene, so it is the motion and not the markup", () => {
    const Still = () => (
      <>
        <svg width="20" height="8" aria-hidden="true"><g><rect width="10" height="8" /><path d="M0 0L1 1" /></g></svg>
        <strong>18</strong>
        <span style={{ display: "inline-block", width: 4 }} />
      </>
    );
    expect(failing(() => figure(lawfulBar, <Still />))).toEqual([]);
  });

  it("fails a button that only exists once an effect has run", () => {
    const s = scene((env) => env.ctx.fillRect(0, 0, 10, 10));
    function Late() {
      const [on, setOn] = useState(false);
      useEffect(() => setOn(true), []);
      return on ? <button type="button">late</button> : null;
    }
    const failed = failing(() => figure(s, <Late />));
    expect(failed).toContain("mounts nothing operable that the noscript rule does not name");
    /* the static render cannot see it, which is why the mounted check exists */
    expect(failed).not.toContain(NOSCRIPT);
  });

  it("passes the reference and the tap demo under StrictMode, where every effect runs twice", async () => {
    /* next.config.mjs turns it on, so in development the stage's effect is
       set up, torn down and set up again before anything has run. The clock
       in the ref lives through that, and it has still never been started. */
    for (const file of ["./RestauranteDemo.tsx", "../../../lib/testing/loopholes/demos/TapRestartDemo.tsx"]) {
      const Demo = await load(file);
      expect(
        failing(() => (
          <StrictMode>
            <Demo />
          </StrictMode>
        )),
      ).toEqual([]);
    }
  });

  it("passes the reference demo on every check, so the checks describe what ships", async () => {
    expect(failing(await load("./RestauranteDemo.tsx"))).toEqual([]);
  });
});
