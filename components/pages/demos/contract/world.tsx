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

export class World {
  now = 1000;
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
  private rafs = new Map<number, (now: number) => void>();
  private rafId = 0;
  private restore: (() => void)[] = [];
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
    put("requestAnimationFrame", (cb: (now: number) => void) => {
      world.rafs.set(++world.rafId, cb);
      return world.rafId;
    });
    put("cancelAnimationFrame", (id: number) => {
      world.rafs.delete(id);
    });

    const define = (target: object, key: string, desc: PropertyDescriptor) => {
      const old = Object.getOwnPropertyDescriptor(target, key);
      Object.defineProperty(target, key, { configurable: true, ...desc });
      this.restore.push(() => {
        if (old) Object.defineProperty(target, key, old);
        else delete (target as Record<string, unknown>)[key];
      });
    };
    define(performance, "now", { value: () => world.now });
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
