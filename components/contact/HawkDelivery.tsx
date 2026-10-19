"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./hawk-delivery.css";

/**
 * What happens when a message really leaves (Daniel, 2026-10-19).
 *
 * The form shoots a letter out of its own box, the letter falls through the
 * air swaying like a leaf, and a red tailed hawk swoops in from the upper
 * right, takes it, and climbs away off the left of the screen with it. The
 * hawk is Cardon's own footage, keyed off a greenscreen and cut down to one
 * wingbeat (scripts/eggs/hawk-asset.mjs made the two files from it).
 *
 * THREE RULES IT KEEPS.
 *
 * 1. It never delays the confirmation. ContactForm renders .form-sent and
 *    moves focus to it before this component mounts; nothing here touches
 *    focus, the live region, or the document outside its own fixed overlay,
 *    which is aria-hidden and takes no pointer events. A screen reader hears
 *    the confirmation whether the bird flies or not.
 * 2. It never shows half an effect. The sprite is fetched only once a message
 *    has actually been delivered, and the flight does not start until the
 *    image has decoded. If the fetch fails, or takes longer than READY_CAP_MS,
 *    nothing is drawn at all: a letter that falls and is never collected is a
 *    worse answer than no letter.
 * 3. prefers-reduced-motion gets the end state instead: the bird already
 *    holding the letter, still, for a moment, then gone. The one thing that
 *    changes is opacity, which is the substitution a reduced motion request
 *    asks for, not movement it asks to be spared.
 *
 * The overlay is portalled to the body rather than left where it is written.
 * It is a fixed box over the whole window, and a fixed box is only measured
 * from the window while no ancestor carries a transform, a filter or paint
 * containment. The form sits inside a reveal-on-scroll wrapper that holds a
 * transform until it has been revealed, and any one of a dozen future
 * wrappers could hold one for good; the portal takes the whole question off
 * the table and puts the stacking order in one place, beside the header and
 * the consent bar rather than inside the page's own z-index 1.
 *
 * The geometry below is exported and pure so the shape of the flight can be
 * asserted without a browser (HawkDelivery.test.tsx); the component only
 * reads the clock and writes two transforms.
 */

/** Where the letter leaves from: the form's box, in viewport pixels. */
export type LaunchBox = { x: number; y: number; width: number };

/** One element at one instant. x and y are viewport pixels. */
export type Pose = { x: number; y: number; rot: number; scale: number };

/** The whole scene at one instant. */
export type Frame = {
  letter: Pose;
  hawk: Pose;
  /** False before the bird has entered, so it is not drawn parked off screen. */
  hawkOn: boolean;
  /** True once the bird and the letter are both off the screen for good. */
  done: boolean;
};

/* ============================ the clock ============================
   Daniel's budget for the whole effect is 2.5 to 3.5 seconds. These five
   numbers are it, in seconds, and the test holds the total inside that band. */

/** The letter leaving the box and reaching the top of its arc. */
export const LAUNCH_S = 0.34;
/** The fall, swaying, from that arc down to where the bird takes it. */
export const FALL_S = 1.34;
/** The bird enters, already on its way down. */
export const HAWK_IN_S = 0.52;
/** The instant of the catch. */
export const CATCH_S = LAUNCH_S + FALL_S;
/** The letter closing onto the talons, the last moment of the fall. */
export const SNAP_S = 0.13;
/** Carrying it out, climbing, to beyond the left edge. */
export const CARRY_S = 1.16;
/** The end of the effect. */
export const END_S = CATCH_S + CARRY_S;

/** How long the still version is held before it fades out. */
export const REST_HOLD_MS = 1500;
/** How long the sprite is given to arrive before the egg gives up on itself. */
export const READY_CAP_MS = 1800;

/** The sway: how many times across, how wide, how far it tips.
    The phase starts the fall at the right hand end of the swing, upright,
    which is where a thing thrown to the right and slowed to a stop actually
    is: the tip follows the sideways speed, and at the end of a swing that
    speed is zero. */
const SWAY_CYCLES = 2.15;
const SWAY_PHASE = 0.5 * Math.PI;
const SWAY_ROT = 23;

/** The shortest fall worth drawing, and the room kept below it. */
const MIN_FALL = 140;
const FLOOR_GAP = 92;
/** The room kept above it. The site header is sticky and sits over this
    overlay, so an arc that reached the top of the window would be thrown
    behind the navigation. */
const HEAD_GAP = 96;

/** The files, both lazy: nothing asks for either until a send has succeeded. */
const HAWK_SRC = "/media/eggs/hawk.webp";
const HAWK_STILL_SRC = "/media/eggs/hawk-still.webp";
/** The sprite's own pixels, used for the aspect ratio only. */
const HAWK_W = 240;
const HAWK_H = 273;

/* ============================ geometry ============================ */

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
/** Decelerating, for anything thrown: fast out of the box, slow at the top. */
const easeOut2 = (p: number) => 1 - (1 - p) * (1 - p);
const bez = (a: number, b: number, c: number, d: number, u: number) => {
  const m = 1 - u;
  return m * m * m * a + 3 * m * m * u * b + 3 * m * u * u * c + u * u * u * d;
};
const bezD = (a: number, b: number, c: number, d: number, u: number) => {
  const m = 1 - u;
  return 3 * m * m * (b - a) + 6 * m * u * (c - b) + 3 * u * u * (d - c);
};
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/**
 * The fixed points of one flight, measured once from the box the letter left
 * and the viewport it left into. Everything downstream is a function of this
 * and the clock, so the scene cannot drift mid flight if the page reflows.
 */
export type Scene = {
  vw: number;
  vh: number;
  /** The mouth of the box. */
  outX: number;
  outY: number;
  /** The top of the letter's arc. */
  apexX: number;
  apexY: number;
  /** Where the fall ends, which is where the catch happens. */
  fallTo: number;
  /** Half the width of the sway at the start of the fall. */
  sway: number;
  /** How wide the bird is drawn, in CSS pixels. */
  hawkW: number;
};

export function sceneFor(box: LaunchBox, vw: number, vh: number, hawkW: number): Scene {
  const outX = clamp(box.x + box.width * 0.5, 48, vw - 48);
  const outY = clamp(box.y + 14, HEAD_GAP, Math.max(HEAD_GAP, vh - 70));
  const sway = clamp(vw * 0.06, 28, 58);
  /* The arc leans to the right, towards the side the bird comes from. apexX is
     the middle of the swing, so the clamp has to keep half a swing of clear
     screen on each side of it, and apexY has to leave the fall its room: the
     ceiling here is what stops a form low in the window from asking for a fall
     that ends below the fold. */
  const apexX = clamp(outX + 20, sway + 30, Math.max(sway + 30, vw - sway - 30));
  const apexY = clamp(outY - 94, HEAD_GAP, Math.max(HEAD_GAP, vh - FLOOR_GAP - MIN_FALL));
  const drop = clamp(vh * 0.3, 170, 310);
  const fallTo = clamp(apexY + drop, apexY + MIN_FALL, Math.max(apexY + MIN_FALL, vh - FLOOR_GAP));
  return { vw, vh, outX, outY, apexX, apexY, fallTo, sway, hawkW };
}

/** The letter at a point p of its fall, 0 at the top of the arc, 1 at the catch. */
function fallPose(p: number, s: Scene): Pose {
  const phase = SWAY_PHASE + p * SWAY_CYCLES * 2 * Math.PI;
  /* A leaf keeps swinging as it comes down and the swing shrinks; the tip
     follows the sideways speed, so the paper leans into the side it is sliding
     towards rather than flapping about its own middle. */
  const amp = s.sway * (1 - 0.34 * p);
  return {
    x: s.apexX + amp * Math.sin(phase),
    y: s.apexY + (s.fallTo - s.apexY) * (0.76 * p + 0.24 * p * p),
    rot: SWAY_ROT * Math.cos(phase),
    scale: 1,
  };
}

/** The point the bird is aimed at, which is the end of the letter's fall. */
export function catchPoint(s: Scene): Pose {
  return fallPose(1, s);
}

/** The letter being shot out, 0 at the box, 1 at the top of the arc.
    It is aimed at the first frame of the fall rather than at the middle of the
    swing, so the throw and the sway are one move: aiming at the middle left a
    sway wide jump at the join, which the test at 120fps caught. */
function launchPose(p: number, s: Scene): Pose {
  const e = easeOut2(p);
  const to = fallPose(0, s);
  return {
    x: mix(s.outX, to.x, e),
    y: mix(s.outY, to.y, e),
    /* It leaves the slot turned over and rights itself into the fall, so the
       first frame of the sway continues the last frame of the throw. */
    rot: mix(-44, to.rot, e),
    scale: (0.34 + 0.66 * e) * (1 + 0.08 * Math.sin(Math.PI * p)),
  };
}

/** The bird's path, as the four points of a cubic and the eased parameter. */
function hawkArc(t: number, s: Scene): { pts: number[]; u: number; scale: number } {
  const to = catchPoint(s);
  if (t <= CATCH_S) {
    const p = clamp((t - HAWK_IN_S) / (CATCH_S - HAWK_IN_S), 0, 1);
    /* Mostly even, then slowing into the catch: a stoop that arrived at full
       speed would read as a collision rather than a grab. */
    const u = 0.42 * p + 0.58 * (1 - Math.pow(1 - p, 2.3));
    return {
      pts: [
        to.x + s.vw * 0.62 + 300,
        to.y - Math.min(s.vh * 0.42, 300) - 60,
        to.x + s.vw * 0.38,
        to.y - 250,
        to.x + 180,
        to.y - 16,
        to.x,
        to.y,
      ],
      u,
      /* Coming in from further away than it ends up, which is the whole of the
         depth in the shot. */
      scale: 0.8 + 0.2 * u,
    };
  }
  const p = clamp((t - CATCH_S) / CARRY_S, 0, 1);
  const u = Math.pow(p, 1.32);
  return {
    pts: [
      to.x,
      to.y,
      to.x - 170,
      to.y - 18,
      to.x - 430,
      to.y - 210,
      -s.hawkW - 80,
      to.y - Math.min(s.vh * 0.52, 380),
    ],
    u,
    scale: 1 - 0.32 * u,
  };
}

function hawkPose(t: number, s: Scene): Pose {
  const { pts, u, scale } = hawkArc(t, s);
  const [x0, y0, x1, y1, x2, y2, x3, y3] = pts;
  const dx = bezD(x0, x1, x2, x3, u);
  const dy = bezD(y0, y1, y2, y3, u);
  /* The sprite flies to the left at rest, so its nose sits at 180 degrees and
     the angle it needs is the heading less that. Banked at well under the
     heading, and capped: a bird holds its body far flatter than its path. */
  let a = (Math.atan2(dy, dx) * 180) / Math.PI - 180;
  if (a < -180) a += 360;
  return {
    x: bez(x0, x1, x2, x3, u),
    y: bez(y0, y1, y2, y3, u),
    rot: clamp(a * 0.62, -26, 26),
    scale,
  };
}

/** Where the letter rides once the bird has it, in the bird's own frame. */
const CARRY_OFFSET = { x: 5, y: 13 };

function carried(hawk: Pose, t: number): Pose {
  const r = (hawk.rot * Math.PI) / 180;
  const ox = CARRY_OFFSET.x * Math.cos(r) - CARRY_OFFSET.y * Math.sin(r);
  const oy = CARRY_OFFSET.x * Math.sin(r) + CARRY_OFFSET.y * Math.cos(r);
  /* One swing left in it from the grab, damped out inside half a second. */
  const since = Math.max(0, t - CATCH_S);
  const swing = 9 * Math.cos(10 * since) * Math.exp(-3.4 * since);
  return {
    x: hawk.x + ox * hawk.scale,
    y: hawk.y + oy * hawk.scale,
    rot: hawk.rot + swing,
    scale: hawk.scale,
  };
}

/** The whole scene at t seconds after the letter left the box. */
export function flightAt(t: number, s: Scene): Frame {
  const hawk = hawkPose(t, s);
  let letter: Pose;
  if (t < LAUNCH_S) {
    letter = launchPose(clamp(t / LAUNCH_S, 0, 1), s);
  } else if (t < CATCH_S) {
    const free = fallPose(clamp((t - LAUNCH_S) / FALL_S, 0, 1), s);
    const closing = clamp((t - (CATCH_S - SNAP_S)) / SNAP_S, 0, 1);
    if (closing <= 0) {
      letter = free;
    } else {
      /* The snap. Over the last breath of the fall the paper is pulled the
         short distance onto the talons, so the grab lands on the letter
         instead of near it. */
      const to = carried(hawk, t);
      const e = closing * closing * (3 - 2 * closing);
      letter = {
        x: mix(free.x, to.x, e),
        y: mix(free.y, to.y, e),
        rot: mix(free.rot, to.rot, e),
        scale: mix(free.scale, to.scale, e),
      };
    }
  } else {
    letter = carried(hawk, t);
  }
  return { letter, hawk, hawkOn: t >= HAWK_IN_S, done: t >= END_S };
}

/**
 * One pose as a transform, for an element whose transform-origin is its own
 * top left corner.
 *
 * The trailing translate is the whole reason this is a function rather than a
 * template string at the call site. A translate places an element's top left
 * corner, not the point it is pinned by, so a bird translated to the catch
 * point arrives with its top left corner there and its talons most of a
 * sprite away: measured on the first recording, the letter rode about sixty
 * pixels clear of the bird it was supposed to be hanging from. Moving the
 * element back by the pin, in its OWN percentages and after the rotation and
 * the scale, puts the pin on the point and keeps it there at any angle and
 * any size. The origin has to be 0 0 for that to be exact; pinning by
 * transform-origin instead leaves a residual that grows with both.
 */
export function transformOf(p: Pose, pinX: number, pinY: number): string {
  return (
    "translate3d(" +
    p.x.toFixed(2) +
    "px," +
    p.y.toFixed(2) +
    "px,0) rotate(" +
    p.rot.toFixed(2) +
    "deg) scale(" +
    p.scale.toFixed(3) +
    ") translate(" +
    -pinX +
    "%," +
    -pinY +
    "%)"
  );
}

/** Where each element is pinned, as a percentage of its own box. */
export const TALON_PIN = { x: 46, y: 56 };
const LETTER_PIN = { x: 50, y: 50 };

/* ============================ the component ============================ */

/** The letter itself, in the site's own line. */
function Letter({
  className,
  innerRef,
  hidden,
}: {
  className: string;
  innerRef?: (el: SVGSVGElement | null) => void;
  hidden?: boolean;
}) {
  return (
    <svg
      className={className}
      ref={innerRef}
      viewBox="0 0 44 31"
      aria-hidden="true"
      focusable="false"
      style={hidden ? { visibility: "hidden" } : undefined}
    >
      <path
        className="hawk-egg-paper"
        d="M2.4,4.7 C14.1,3.9 30.2,3.6 41.6,4.5 C42.4,12.1 42.4,21.6 41.4,27.3 C29.1,28.1 14.5,28.0 2.6,27.1 C1.7,20.3 1.8,11.7 2.4,4.7 Z"
      />
      <path
        className="hawk-egg-fold"
        d="M3.1,5.4 C10.8,11.8 17.8,16.5 22.2,16.5 C26.6,16.5 33.5,11.6 41.0,5.2"
      />
      <circle className="hawk-egg-seal" cx="22.2" cy="16.1" r="2.5" />
    </svg>
  );
}

export default function HawkDelivery({
  from,
  onDone,
}: {
  /** The form's box at the moment it was sent, in viewport pixels. */
  from: LaunchBox;
  /** Called once, when there is nothing left on the screen. */
  onDone: () => void;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const bird = useRef<HTMLImageElement | null>(null);
  const paper = useRef<SVGSVGElement | null>(null);
  const holdPaper = (el: SVGSVGElement | null) => {
    paper.current = el;
  };
  /* "waiting" until the sprite is in the cache. "fly" and "rest" are the two
     ways it ends up on the screen; "off" is every reason not to draw at all. */
  const [mode, setMode] = useState<"waiting" | "fly" | "rest" | "off">("waiting");
  const done = useRef(false);

  /* The decision, once: which version this visitor gets, and whether the
     sprite is even there. Both files are asked for here and nowhere earlier,
     so a visitor who never sends a message never pays for them. */
  useEffect(() => {
    let live = true;
    const finish = (next: "fly" | "rest" | "off") => {
      if (live) setMode(next);
    };
    const still =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wanted = still ? HAWK_STILL_SRC : HAWK_SRC;
    if (!still && typeof window.requestAnimationFrame !== "function") {
      finish("off");
      return () => {
        live = false;
      };
    }
    const img = new window.Image();
    const cap = window.setTimeout(() => finish("off"), READY_CAP_MS);
    const ready = () => {
      window.clearTimeout(cap);
      finish(still ? "rest" : "fly");
    };
    const failed = () => {
      window.clearTimeout(cap);
      finish("off");
    };
    img.onload = ready;
    img.onerror = failed;
    img.src = wanted;
    /* decode() is the one that promises the next paint will not block. Where
       it does not exist the load event above is the answer. */
    if (typeof img.decode === "function") img.decode().then(ready, failed);
    return () => {
      live = false;
      window.clearTimeout(cap);
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  /* The flight. One loop, two transforms, no layout read or write inside it.
     The scene is measured once; a scroll during the three seconds moves the
     whole scene with the page, because the box the letter left is on the page
     and the overlay is not. */
  useEffect(() => {
    if (mode !== "fly") return;
    const el = root.current;
    const b = bird.current;
    const p = paper.current;
    if (!el || !b || !p) return;

    const drawn = b.getBoundingClientRect().width || 140;
    const scene = sceneFor(from, window.innerWidth, window.innerHeight, drawn);
    const scroll0 = window.scrollY;
    let scrolled = 0;
    const onScroll = () => {
      scrolled = window.scrollY - scroll0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    /* null, not 0: a browser is allowed to hand the first frame a timestamp of
       zero, and a falsy check would then reset the clock on every frame and
       hold the whole flight on its first instant. */
    let t0: number | null = null;
    const step = (now: number) => {
      if (t0 === null) t0 = now;
      const t = (now - t0) / 1000;
      const f = flightAt(t, scene);
      p.style.transform = transformOf(
        { ...f.letter, y: f.letter.y - scrolled },
        LETTER_PIN.x,
        LETTER_PIN.y,
      );
      b.style.transform = transformOf(
        { ...f.hawk, y: f.hawk.y - scrolled },
        TALON_PIN.x,
        TALON_PIN.y,
      );
      /* Both start hidden and are shown by the frame that first places them,
         because an element with no transform yet sits in the corner of the
         screen and one painted frame there is a flash. */
      p.style.visibility = "visible";
      b.style.visibility = f.hawkOn ? "visible" : "hidden";
      if (f.done) {
        if (!done.current) {
          done.current = true;
          onDone();
        }
        return;
      }
      raf = window.requestAnimationFrame(step);
    };
    raf = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mode, from, onDone]);

  /* The still version: in, held, out, and gone. */
  useEffect(() => {
    if (mode !== "rest") return;
    const el = root.current;
    if (!el) return;
    const fadeIn = window.setTimeout(() => el.setAttribute("data-rest", "in"), 30);
    const fadeOut = window.setTimeout(() => el.setAttribute("data-rest", "out"), REST_HOLD_MS);
    const gone = window.setTimeout(() => {
      if (!done.current) {
        done.current = true;
        onDone();
      }
    }, REST_HOLD_MS + 460);
    return () => {
      window.clearTimeout(fadeIn);
      window.clearTimeout(fadeOut);
      window.clearTimeout(gone);
    };
  }, [mode, onDone]);

  /* Nothing is in the document until there is something worth drawing, so a
     failed or slow sprite leaves the page exactly as the confirmation left
     it. */
  useEffect(() => {
    if (mode !== "off" || done.current) return;
    done.current = true;
    onDone();
  }, [mode, onDone]);

  if (mode === "waiting" || mode === "off") return null;

  if (mode === "rest") {
    /* Held where the letter would have been taken, up and to the left of the
       box, and clamped onto the screen on a narrow one. */
    const left = clamp(from.x + from.width * 0.5 - 150, 12, Math.max(12, window.innerWidth - 200));
    const top = clamp(from.y - 40, 12, Math.max(12, window.innerHeight - 220));
    return createPortal(
      <div className="hawk-egg" ref={root} aria-hidden="true">
        <div className="hawk-egg-rest" style={{ left: left + "px", top: top + "px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hawk-egg-bird"
            src={HAWK_STILL_SRC}
            alt=""
            width={HAWK_W}
            height={HAWK_H}
            decoding="async"
          />
          <Letter className="hawk-egg-letter" />
        </div>
      </div>,
      document.body,
    );
  }

  return createPortal(
    <div className="hawk-egg" ref={root} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="hawk-egg-bird"
        ref={bird}
        src={HAWK_SRC}
        alt=""
        width={HAWK_W}
        height={HAWK_H}
        decoding="async"
        style={{ visibility: "hidden" }}
      />
      <Letter className="hawk-egg-letter" innerRef={holdPaper} hidden />
    </div>,
    document.body,
  );
}
