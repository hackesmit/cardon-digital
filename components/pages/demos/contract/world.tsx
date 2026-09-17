import React, { act, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { LocaleProvider } from "../../../../lib/i18n/LocaleProvider";

/**
 * A page a demo can be mounted on and driven from a test (bead hq-3pfhe.7).
 *
 * vitest has no viewport, no frames and no media queries, and jsdom supplies
 * none of them either, so this stands in for the five things a demo listens
 * to: the IntersectionObserver, the ResizeObserver, matchMedia, the tab's
 * visibility and requestAnimationFrame, plus a 2d context that records what
 * was drawn instead of drawing it. Every one of them is reached through the
 * GLOBAL the browser would hand over, so it makes no difference how a
 * component spells its way there: window.X, window["X"], a concatenated key
 * and Reflect.construct all arrive at the same stub. That is the point. The
 * checks built on this judge what a demo DOES, and the three generations of
 * lexical checks they replace each judged how it was written.
 */

/** Set while ./motion's observeOnscreen is on the stack; contract.test.tsx
    wraps the real function to count it. An observer constructed at depth 0
    was built by hand. */
export const provenance = { depth: 0 };

/** What the stage was last asked to draw, and on what. contract.test.tsx
    wraps the real useDemoStage to fill it in, the same way it marks
    observeOnscreen: the hook runs untouched, and the purity check in
    ./checks.tsx gets the scene a mounted demo really handed over, with the
    board the stage really built for it, instead of a copy it made up. */
export const handed: { scene: unknown; env: unknown; count: number } = { scene: null, env: null, count: 0 };

/** Set while a scene's draw() or a live text's at() is on the stack, by the
    same wrapper and by the purity check. Whatever asks the page what time it
    is, or for a random number, at depth above 0 was asked by a picture. */
export const drawing = { depth: 0 };

interface Entry {
  isIntersecting: boolean;
  intersectionRatio: number;
  target: Element | null;
}

export interface FakeIO {
  cb: (entries: Entry[]) => void;
  options: unknown;
  viaMotion: boolean;
  target: Element | null;
  live: boolean;
}

interface FakeRO {
  cb: (entries: { contentRect: { width: number } }[]) => void;
  live: boolean;
}

interface FakeMQL {
  media: string;
  listeners: Set<(e: { matches: boolean; media: string }) => void>;
}

const REDUCE = /prefers-reduced-motion/;

const show = (v: unknown): string => {
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(3);
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(show).join(",") + "]";
  if (v && typeof v === "object") return "{object}";
  return String(v);
};

/** Everything from the last clearRect on: one frame, however many times the
    component redrew inside one stimulus. */
const lastFrame = (entries: string[]): string => {
  let from = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].startsWith("clearRect(")) {
      from = i;
      break;
    }
  }
  return entries.slice(from).join(";");
};

/** Elements that cannot move by themselves, which is every element a demo
    may mount. See World.strangers for why this is a list of what is allowed
    and not of what is refused. */
const INERT = new Set(
  (
    /* html: structure, text and the two things a demo is made of */
    "figure figcaption div span p canvas button noscript style " +
    "strong em b i small sub sup br wbr abbr time ul ol li dl dt dd h1 h2 h3 h4 h5 h6 " +
    /* svg: shapes, text, structure and paint servers */
    "svg g path rect circle ellipse line polyline polygon text tspan defs title desc " +
    "clippath mask lineargradient radialgradient stop symbol use"
  ).split(" "),
);

export class World {
  /** Milliseconds since this page was opened, plus where it started: the ONE
      clock. performance.now, Date.now, new Date(), a formatter asked for
      'now', document.timeline, an event's timeStamp and the argument of a
      frame callback all read it, so a page opened at another time is another
      time by every route, and tick() moves all of them together. */
  now = 1000;
  /** What Date.now() reads when `now` is 0. */
  epoch = Date.UTC(2026, 8, 17, 18, 0, 0);
  /** Math.random and crypto are a sequence this decides. */
  seed = 1;
  /** Every time a picture asked for the time or for luck: see `drawing`. */
  asked: string[] = [];
  /** Every animation handed to the BROWSER to run: Element.animate, new
      Animation, new KeyframeEffect, a view transition. */
  declared: string[] = [];
  reduce = false;
  hidden = false;
  /** The figure's fractional layout width, which is what a container query
      and a ResizeObserver's contentRect both report. */
  layoutW = 800;
  /** A scaled ancestor: getBoundingClientRect reports the PAINTED box. */
  scale = 1;
  ios: FakeIO[] = [];
  ros: FakeRO[] = [];
  mqls: FakeMQL[] = [];
  log: string[] = [];
  /** Frames asked for, by anybody, ever. A board that may not animate asks
      for none, and the count does not care who asked or how it was spelled. */
  framesRequested = 0;
  /** scrollLeft and scrollTop set, on anything: motion with no record. */
  scrolls = 0;
  private timers = new Map<number, { cb: () => void; at: number; every: number | null }>();
  private timerId = 0;
  private rafs = new Map<number, (now: number) => void>();
  private rafId = 0;
  private restore: (() => void)[] = [];
  DateProxy: unknown = null;
  private root: Root | null = null;
  container!: HTMLElement;

  install() {
    const g = globalThis as unknown as Record<string, unknown>;
    const put = (name: string, value: unknown) => {
      const had = Object.prototype.hasOwnProperty.call(g, name);
      const old = g[name];
      g[name] = value;
      this.restore.push(() => {
        if (had) g[name] = old;
        else delete g[name];
      });
    };
    const world = this;

    g.IS_REACT_ACT_ENVIRONMENT = true;
    /* vitest compiles this app's JSX with the classic runtime */
    put("React", React);

    put(
      "IntersectionObserver",
      class {
        private me: FakeIO;
        constructor(cb: FakeIO["cb"], options: unknown) {
          this.me = { cb, options, viaMotion: provenance.depth > 0, target: null, live: true };
          world.ios.push(this.me);
        }
        observe(el: Element) {
          this.me.target = el;
        }
        unobserve() {}
        disconnect() {
          this.me.live = false;
        }
        takeRecords() {
          return [];
        }
      },
    );
    put(
      "ResizeObserver",
      class {
        private me: FakeRO;
        constructor(cb: FakeRO["cb"]) {
          this.me = { cb, live: true };
          world.ros.push(this.me);
        }
        observe() {}
        unobserve() {}
        disconnect() {
          this.me.live = false;
        }
      },
    );
    put("matchMedia", (media: string) => {
      const me: FakeMQL = { media, listeners: new Set() };
      world.mqls.push(me);
      return {
        media,
        get matches() {
          return REDUCE.test(media) ? world.reduce : false;
        },
        addEventListener: (_: string, fn: never) => me.listeners.add(fn),
        removeEventListener: (_: string, fn: never) => me.listeners.delete(fn),
        addListener: (fn: never) => me.listeners.add(fn),
        removeListener: (fn: never) => me.listeners.delete(fn),
      };
    });
    /* Timers run on the page's clock too, so an animation driven by
       setInterval moves when tick() says time passed, not when the test
       runner's event loop gets round to it (which is after the check). */
    const timer = (every: boolean) => (cb: unknown, ms?: number, ...args: unknown[]) => {
      if (typeof cb !== "function") return 0;
      const wait = Math.max(every ? 1 : 0, Number(ms) || 0);
      world.timers.set(++world.timerId, {
        cb: () => (cb as (...a: unknown[]) => void)(...args),
        at: world.now + wait,
        every: every ? wait : null,
      });
      return world.timerId;
    };
    const untimer = (id: unknown) => void world.timers.delete(id as number);
    put("setTimeout", timer(false));
    put("setInterval", timer(true));
    put("clearTimeout", untimer);
    put("clearInterval", untimer);
    put("requestAnimationFrame", (cb: (now: number) => void) => {
      world.framesRequested++;
      world.rafs.set(++world.rafId, cb);
      return world.rafId;
    });
    put("cancelAnimationFrame", (id: number) => {
      world.rafs.delete(id);
    });

    const define = (target: object, key: string, desc: PropertyDescriptor) => {
      const old = Object.getOwnPropertyDescriptor(target, key);
      /* writable where the platform's own is: a reviewer's harness that puts
         a stub of its own over one of these has to be able to */
      Object.defineProperty(target, key, { configurable: true, ...("value" in desc ? { writable: true } : {}), ...desc });
      this.restore.push(() => {
        if (old) Object.defineProperty(target, key, old);
        else delete (target as Record<string, unknown>)[key];
      });
    };
    /* EVERY SOURCE OF TIME AND OF LUCK IS THE WORLD'S (reviewer s-1022, L4).
       performance.now alone was, so a draw() that read it was caught only if
       time happened to pass between two draws, and it did not. They are all
       one number here, and each read is written down when a picture made it.
       Date.now is replaced on the real Date as well as on the global: jsdom
       stamps its events through the real one. */
    const ask = <T,>(what: string, v: T): T => {
      if (drawing.depth > 0) world.asked.push(what);
      return v;
    };
    const wall = () => world.epoch + world.now;
    define(performance, "now", { value: () => ask("performance.now()", world.now) });
    const RealDate = Date;
    define(RealDate, "now", { value: () => ask("Date.now()", wall()) });
    put(
      "Date",
      new Proxy(RealDate, {
        construct: (D, args, target) =>
          Reflect.construct(D, args.length ? args : [ask("new Date()", wall())], target === world.DateProxy ? D : target),
        apply: () => new RealDate(ask("Date()", wall())).toString(),
      }),
    );
    world.DateProxy = g.Date;
    for (const method of ["format", "formatToParts"] as const) {
      const real = Object.getOwnPropertyDescriptor(Intl.DateTimeFormat.prototype, method)!;
      const timed = (fn: (d?: unknown) => unknown) => (d?: unknown) =>
        fn(d === undefined ? ask("Intl.DateTimeFormat " + method + "()", wall()) : d);
      define(
        Intl.DateTimeFormat.prototype,
        method,
        real.get
          ? { get(this: Intl.DateTimeFormat) { return timed(real.get!.call(this)); } }
          : { value(this: Intl.DateTimeFormat, d?: unknown) { return timed((x) => real.value.call(this, x))(d); } },
      );
    }
    let luck = world.seed >>> 0;
    const next = () => {
      /* mulberry32 */
      luck = (luck + 0x6d2b79f5) >>> 0;
      let t = luck;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    define(Math, "random", { value: () => ask("Math.random()", next()) });
    if (typeof crypto !== "undefined") {
      define(crypto, "getRandomValues", {
        value: <A extends ArrayBufferView>(a: A): A => {
          ask("crypto.getRandomValues()", 0);
          const bytes = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
          for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(next() * 256);
          return a;
        },
      });
      define(crypto, "randomUUID", {
        value: () => {
          ask("crypto.randomUUID()", 0);
          const h = Array.from({ length: 32 }, () => Math.floor(next() * 16).toString(16)).join("");
          return [h.slice(0, 8), h.slice(8, 12), h.slice(12, 16), h.slice(16, 20), h.slice(20)].join("-");
        },
      });
    }

    /* MOTION THE BROWSER RUNS BY ITSELF (reviewer s-1022, L5). A Web Animation
       is not a frame, a timer, a canvas call or a mutation, so nothing above
       can see one, and jsdom has none of these, so a careful author's ?. made
       the call vanish under test. They exist here, they do nothing, and every
       use is written down. The script side of the platform has these ways in
       and no others: Animatable.animate, the two constructors, the document's
       timeline, and a view transition. */
    const inert = () => {
      const a: Record<string, unknown> = {
        playState: "running",
        currentTime: 0,
        finished: new Promise(() => {}),
        ready: Promise.resolve(),
      };
      for (const m of ["cancel", "pause", "play", "finish", "reverse", "persist", "commitStyles", "updatePlaybackRate", "addEventListener", "removeEventListener", "skipTransition"]) {
        a[m] = () => {};
      }
      return a;
    };
    const declare = (what: string) => {
      world.declared.push(what);
      return inert();
    };
    define(Element.prototype, "animate", {
      value(this: Element) {
        return declare("<" + this.tagName.toLowerCase() + ">.animate()");
      },
    });
    put("Animation", function Animation() { return declare("new Animation()"); });
    put("KeyframeEffect", function KeyframeEffect() { return declare("new KeyframeEffect()"); });
    define(document, "startViewTransition", {
      value: (cb?: () => void) => {
        cb?.();
        return declare("document.startViewTransition()");
      },
    });
    define(document, "timeline", {
      get: () => ({ get currentTime() { return ask("document.timeline.currentTime", world.now); } }),
    });
    define(document, "hidden", { get: () => world.hidden });
    /* layout: clientWidth is the rounded layout box, the rect is the painted
       one, and only the ResizeObserver carries the fraction */
    define(HTMLElement.prototype, "clientWidth", {
      get: () => Math.round(world.layoutW),
    });
    define(Element.prototype, "getBoundingClientRect", {
      value: () => {
        const width = world.layoutW * world.scale;
        return { x: 0, y: 0, top: 0, left: 0, right: width, bottom: 0, width, height: 0 };
      },
    });
    for (const key of ["scrollLeft", "scrollTop"]) {
      const real = Object.getOwnPropertyDescriptor(Element.prototype, key);
      define(Element.prototype, key, {
        get(this: Element) {
          return real?.get?.call(this) ?? 0;
        },
        set(this: Element, v: number) {
          world.scrolls++;
          real?.set?.call(this, v);
        },
      });
    }
    const contexts = new WeakMap<object, unknown>();
    define(HTMLCanvasElement.prototype, "getContext", {
      value(this: HTMLCanvasElement) {
        if (!contexts.has(this)) contexts.set(this, world.recorder());
        return contexts.get(this);
      },
    });
  }

  /** A 2d context that writes down every call and every property set. */
  private recorder(): unknown {
    const world = this;
    const state: Record<string, unknown> = {};
    return new Proxy(state, {
      get(t, k) {
        if (typeof k !== "string") return undefined;
        if (k in t) return t[k];
        return (...args: unknown[]) => {
          world.log.push(k + "(" + args.map(show).join(",") + ")");
          if (k.startsWith("create")) return world.recorder();
          if (k === "measureText") return { width: 0 };
          return undefined;
        };
      },
      set(t, k, v) {
        if (typeof k === "string") {
          t[k] = v;
          world.log.push(k + "=" + show(v));
        }
        return true;
      },
    });
  }

  mount(Demo: ComponentType) {
    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.root = createRoot(this.container);
    act(() => {
      this.root!.render(
        <LocaleProvider locale="es">
          <Demo />
        </LocaleProvider>,
      );
    });
  }

  dispose() {
    try {
      if (this.root) act(() => this.root!.unmount());
    } finally {
      this.container?.remove();
      for (const undo of this.restore.reverse()) undo();
      this.restore = [];
    }
  }

  /**
   * Everything on the page that could move without the stage moving it.
   *
   * WHY AN ALLOW LIST. Motion the browser runs from a declaration (SMIL's
   * animate, a marquee, a video, an animated image, whatever the platform
   * adds next) is invisible to every other check here, because jsdom does not
   * run any of it. A list of the elements that move is the list the next
   * reviewer finds a gap in. So the question is asked the other way round:
   * a demo mounts only elements that CANNOT move by themselves, and anything
   * not on that list is refused without anybody having to know what it does.
   * An image is refused too: nothing on a page can tell a still from an
   * animated GIF, APNG, WebP or an SVG with SMIL inside, and a board draws
   * its pictures on the canvas.
   *
   * CSS is the declared route that stays open to a demo, because app/
   * globals.css stops every animation and transition under reduce for the
   * whole site. That is a stylesheet's job and it is held where stylesheets
   * are read (demos.test.ts: nothing in demos.css outranks that rule, and
   * source.test.ts: a demo imports no stylesheet of its own). What is judged
   * here is the part of CSS a component can carry on its own back: an inline
   * style that animates, transitions or loads an image.
   */
  strangers(): string[] {
    const out: string[] = [];
    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      const tag = el.tagName.toLowerCase();
      if (!INERT.has(tag)) out.push("<" + tag + "> is not an element known to stand still");
      else if (tag === "style" && !el.closest("noscript")) out.push("<style> outside the frame's noscript");
      const css = el.getAttribute("style") ?? "";
      for (const prop of css.split(";").map((d) => d.split(":")[0].trim().toLowerCase())) {
        if (/^(-\w+-)?(animation|transition|offset|view-transition|scroll-timeline|view-timeline)/.test(prop)) {
          out.push("<" + tag + "> carries an inline " + prop);
        }
      }
      if (/url\(/i.test(css)) out.push("<" + tag + "> loads an image from an inline style");
    }
    return out.concat(this.declared);
  }

  /** What the last stimulus left on the canvas. */
  standing(): string {
    return lastFrame(this.log);
  }

  /** Run `fn` and return the frame it left, or "" if it drew nothing. */
  capture(fn: () => void): string {
    const from = this.log.length;
    act(fn);
    const drawn = this.log.slice(from);
    return drawn.length ? lastFrame(drawn) : "";
  }

  /** Advance the page `ms` in 16ms display frames; returns every frame a
      requestAnimationFrame callback drew. */
  tick(ms: number): string[] {
    const frames: string[] = [];
    for (let spent = 0; spent < ms; spent += 16) {
      this.now += 16;
      const due = Array.from(this.rafs.values());
      this.rafs.clear();
      const from = this.log.length;
      act(() => {
        for (const [id, t] of Array.from(this.timers)) {
          if (t.at > this.now || !this.timers.has(id)) continue;
          if (t.every === null) this.timers.delete(id);
          else t.at = this.now + t.every;
          t.cb();
        }
        for (const cb of due) cb(this.now);
      });
      if (this.log.length > from) frames.push(lastFrame(this.log.slice(from)));
      /* keep one frame of history: standing() reads it */
      if (this.log.length > 20000) this.log = this.log.slice(-10000);
    }
    return frames;
  }

  /** Every live observer hears the same ratio, whoever built it. */
  onscreen(ratio: number) {
    for (const io of this.ios) {
      if (!io.live) continue;
      io.cb([{ isIntersecting: ratio > 0, intersectionRatio: ratio, target: io.target }]);
    }
  }

  width(exact: number) {
    this.layoutW = exact;
    for (const ro of this.ros) if (ro.live) ro.cb([{ contentRect: { width: exact } }]);
  }

  setReduce(on: boolean) {
    this.reduce = on;
    for (const m of this.mqls) {
      if (!REDUCE.test(m.media)) continue;
      for (const fn of Array.from(m.listeners)) fn({ matches: on, media: m.media });
    }
  }

  setHidden(on: boolean) {
    this.hidden = on;
    document.dispatchEvent(new Event("visibilitychange"));
  }
}
