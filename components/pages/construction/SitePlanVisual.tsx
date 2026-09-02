"use client";

import { useEffect, useRef } from "react";

/**
 * Signature visual: placement onto a site plan. Scattered work-order chips are
 * lifted one at a time and set into dated MON-FRI lanes on a weekly schedule.
 * As each lands, its plot on the plan lights briefly in safety amber and a
 * dependency line links it to the chip it unblocks. Slow, one placement at a
 * time, long holds, gentle loop.
 *
 * Two purpose-made compositions ship in one component: a wide desktop plan
 * (plan left, schedule right) and a portrait phone plan (plan on top, a
 * full-width vertical week below) with type sized to stay readable at ~330px.
 * CSS media queries show exactly one; the other is display:none, so its
 * IntersectionObserver never intersects and its rAF never runs. Both animate
 * from identical logic driven by a per-layout coordinate config. Colors come
 * entirely from CSS variables, so a light/dark mode change recolors either for
 * free. Pauses off-screen and on document hidden; under prefers-reduced-motion
 * it holds the static resolved state.
 */

type ChipPlace = { scatter: readonly [number, number]; rot: number };
type Conf = { LANE_Y: number[]; PLACED_X: number; CHIPS: ChipPlace[] };

const DESKTOP_CONF: Conf = {
  LANE_Y: [92, 142, 192, 242, 292],
  PLACED_X: 492,
  // scatter centers sit inside the plan body (x ~76-270, y ~80-326 once the
  // chip half-size is added) so no chip ever overlaps the SITE PLAN / SCHEDULE
  // headers or the stage tag at the top, and none is clipped at an edge. They
  // read as a staggered pile of orders on the plan that fly into the lanes.
  CHIPS: [
    { scatter: [150, 100], rot: -6 },
    { scatter: [196, 152], rot: 6 },
    { scatter: [150, 206], rot: -5 },
    { scatter: [196, 258], rot: 7 },
    { scatter: [152, 306], rot: -7 },
  ],
};

const PORTRAIT_CONF: Conf = {
  LANE_Y: [323, 373, 423, 473, 523],
  PLACED_X: 189,
  // scatter centers stay within [140,200] x so the wide chips sit fully inside
  // the plan while piled, then fly down into the lanes one at a time
  CHIPS: [
    { scatter: [156, 132], rot: -5 },
    { scatter: [190, 158], rot: 6 },
    { scatter: [150, 214], rot: -6 },
    { scatter: [194, 236], rot: 5 },
    { scatter: [160, 104], rot: 4 },
  ],
};

/* portrait plots on the plan (top block) */
const PORTRAIT_PLOTS = [
  { id: "A", d: "M40 108 L92 100 L98 132 L46 140 Z", tx: 58, ty: 126 },
  { id: "B", d: "M130 100 L182 94 L188 124 L136 130 Z", tx: 148, ty: 118 },
  { id: "C", d: "M218 138 L270 132 L276 162 L224 168 Z", tx: 236, ty: 156 },
  { id: "D", d: "M74 184 L126 178 L132 208 L80 214 Z", tx: 93, ty: 202 },
  { id: "E", d: "M178 204 L230 198 L236 228 L184 234 Z", tx: 197, ty: 222 },
];

/* portrait leaders: plot center to its lane's chip, shown on hover / focus */
const PORTRAIT_LEADERS = [
  { x1: 66, y1: 120, x2: 66, y2: 323 },
  { x1: 156, y1: 110, x2: 66, y2: 373 },
  { x1: 244, y1: 150, x2: 66, y2: 423 },
  { x1: 100, y1: 195, x2: 66, y2: 473 },
  { x1: 204, y1: 215, x2: 66, y2: 523 },
];

/* portrait work-order chips (default state is placed in lanes) */
const PORTRAIT_CHIPS = [
  { y: 323, label: "grade site / crew 1", pill: "A", title: "GRADE SITE", meta: "crew 1 / plot A / mon", aria: "Work order: grade site, crew 1, plot A, scheduled Monday." },
  { y: 373, label: "form footings / crew 2", pill: "B", title: "FORM FOOTINGS", meta: "crew 2 / plot B / tue", aria: "Work order: form footings, crew 2, plot B, scheduled Tuesday." },
  { y: 423, label: "rebar delivery", pill: "C", title: "REBAR DELIVERY", meta: "materials / plot C / wed", aria: "Work order: rebar delivery, materials, plot C, scheduled Wednesday." },
  { y: 473, label: "pour slab / crew 2", pill: "D", title: "POUR SLAB", meta: "crew 2 / plot D / thu", aria: "Work order: pour slab, crew 2, plot D, scheduled Thursday." },
  { y: 523, label: "inspection", pill: "E", title: "INSPECTION", meta: "city / plot E / fri", aria: "Work order: inspection, city, plot E, scheduled Friday." },
];

const PORTRAIT_DAYS = ["MON", "TUE", "WED", "THU", "FRI"];

export default function SitePlanVisual() {
  const deskRef = useRef<SVGSVGElement | null>(null);
  const portRef = useRef<SVGSVGElement | null>(null);
  const captionRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const caption = captionRef.current;

    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const easeInOut = (t: number) => {
      t = clamp01(t);
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    /* wire one SVG composition to the placement animation, return its cleanup */
    const wireSvg = (svg: SVGSVGElement, conf: Conf) => {
      const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
      const reduced = () => reduceMQ.matches;
      let docVisible = !document.hidden;

      const LANE_Y = conf.LANE_Y;
      const PLACED_X = conf.PLACED_X;
      const CHIPS = conf.CHIPS;
      const N = CHIPS.length;

      const chipEls = Array.from(svg.querySelectorAll<SVGGElement>(".chip"));
      const plotEls = Array.from(svg.querySelectorAll<SVGGElement>(".plot"));
      const glowEls = plotEls.map((p) => p.querySelector<SVGElement>(".plot-glow"));
      const leaderEls = Array.from(svg.querySelectorAll<SVGLineElement>(".leader"));
      const depEls = Array.from(svg.querySelectorAll<SVGLineElement>(".dep"));

      /* dependency segment geometry: each is 50 units tall */
      const SEG_LEN = 50;
      depEls.forEach((el) => {
        el.style.strokeDasharray = SEG_LEN + " " + SEG_LEN;
      });

      const hot = [false, false, false, false, false];
      const landed = [false, false, false, false, false];

      /* timeline (seconds) */
      const INTRO = 1.4;
      const STAGGER = 2.7;
      const PLACE = 1.35;
      const PULSE = 0.95;
      const FINAL_HOLD = 4.2;
      const FADE = 1.1;
      const placeStart: number[] = [];
      const landAt: number[] = [];
      for (let q = 0; q < N; q++) {
        placeStart[q] = INTRO + q * STAGGER;
        landAt[q] = placeStart[q] + PLACE;
      }
      const lastLand = landAt[N - 1];
      const CYCLE = lastLand + FINAL_HOLD + FADE;

      let raf = 0;
      let running = false;
      let onscreen = false;
      let last = 0;
      let tt = 0;
      let clock = 0;

      const setChip = (i: number, x: number, y: number, rot: number) => {
        chipEls[i].setAttribute(
          "transform",
          "translate(" +
            x.toFixed(2) +
            "," +
            y.toFixed(2) +
            ") rotate(" +
            rot.toFixed(2) +
            ")"
        );
      };
      const setGlow = (i: number, op: number) => {
        const g = glowEls[i];
        if (g) g.setAttribute("opacity", op.toFixed(3));
      };
      const setPlotScheduled = (i: number, on: boolean) => {
        if (on) plotEls[i].classList.add("scheduled");
        else plotEls[i].classList.remove("scheduled");
      };
      const setDep = (seg: number, p: number) => {
        const d = depEls[seg];
        if (d) d.style.strokeDashoffset = (SEG_LEN * (1 - clamp01(p))).toFixed(2);
      };
      const setLeader = (i: number, on: boolean) => {
        const l = leaderEls[i];
        if (l) l.setAttribute("opacity", on ? "0.9" : "0");
      };

      /* resolved: everything placed, plots scheduled, spine drawn */
      const resolved = () => {
        for (let i = 0; i < N; i++) {
          setChip(i, PLACED_X, LANE_Y[i], 0);
          setPlotScheduled(i, true);
          setGlow(i, hot[i] ? 0.6 : 0.1);
          landed[i] = true;
        }
        for (let s = 0; s < depEls.length; s++) setDep(s, 1);
        svg.style.opacity = "1";
        if (caption) caption.textContent = "one schedule";
      };

      /* pre: chips scattered at edges, plots unlit, spine hidden */
      const setPre = () => {
        for (let i = 0; i < N; i++) {
          setChip(i, CHIPS[i].scatter[0], CHIPS[i].scatter[1], CHIPS[i].rot);
          setPlotScheduled(i, false);
          setGlow(i, hot[i] ? 0.6 : 0);
          landed[i] = false;
        }
        for (let s = 0; s < depEls.length; s++) setDep(s, 0);
        if (caption) caption.textContent = "placing";
      };

      const draw = () => {
        let placedCount = 0;
        for (let i = 0; i < N; i++) {
          const c = CHIPS[i];
          let e: number;
          if (tt < placeStart[i]) e = 0;
          else if (tt < placeStart[i] + PLACE)
            e = easeInOut((tt - placeStart[i]) / PLACE);
          else e = 1;

          const bob = e < 1 ? 1 : 0;
          const driftX = Math.sin(clock * 0.6 + i * 1.7) * 4 * (1 - e) * bob;
          const driftY = Math.cos(clock * 0.5 + i * 1.3) * 3 * (1 - e) * bob;
          const lift = -30 * Math.sin(Math.PI * e);
          const x = c.scatter[0] + (PLACED_X - c.scatter[0]) * e + driftX;
          const y = c.scatter[1] + (LANE_Y[i] - c.scatter[1]) * e + lift + driftY;
          const rot = c.rot * (1 - e);
          setChip(i, x, y, rot);

          const isLanded = e >= 1 && tt >= landAt[i];
          landed[i] = isLanded;
          if (isLanded) {
            placedCount++;
            setPlotScheduled(i, true);
            const pulse = clamp01((tt - landAt[i]) / PULSE); /* 0 at land, 1 after pulse */
            const base = 0.1 + (1 - pulse) * 0.5; /* bright then settle to faint */
            setGlow(i, hot[i] ? 0.6 : base);
            if (i >= 1) setDep(i - 1, clamp01((tt - landAt[i]) / 0.6));
          } else {
            setPlotScheduled(i, false);
            setGlow(i, hot[i] ? 0.6 : 0);
            if (i >= 1) setDep(i - 1, 0);
          }
        }

        /* gentle fade dip at the loop seam so the reset is not jarring */
        let fo = 1;
        const fadeStart = lastLand + FINAL_HOLD;
        if (tt >= fadeStart) fo = 1 - ((tt - fadeStart) / FADE) * 0.85;
        else if (tt < 0.5) fo = 0.2 + (tt / 0.5) * 0.8;
        svg.style.opacity = fo.toFixed(3);

        if (caption)
          caption.textContent = placedCount >= N ? "one schedule" : "placing";
      };

      const canRun = () => !reduced() && docVisible && onscreen;
      const frameLoop = (now: number) => {
        if (!running) return;
        raf = requestAnimationFrame(frameLoop);
        if (now - last < 32) return;
        let dt = (now - last) / 1000;
        last = now;
        if (dt > 0.05) dt = 0.05;
        clock += dt;
        tt += dt;
        if (tt >= CYCLE) tt -= CYCLE;
        draw();
      };
      const start = () => {
        if (running || !canRun()) return;
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frameLoop);
      };
      const stop = () => {
        running = false;
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };

      /* hover / focus interaction: raise a chip readout and light its plot */
      const setHot = (i: number, on: boolean) => {
        hot[i] = on;
        chipEls[i].classList.toggle("hot", on);
        setLeader(i, on);
        if (!running) setGlow(i, on ? 0.6 : landed[i] ? 0.1 : 0);
      };

      const chipCleanups: Array<() => void> = [];
      chipEls.forEach((el, i) => {
        const onEnter = () => setHot(i, true);
        const onLeave = () => setHot(i, false);
        const onFocus = () => setHot(i, true);
        const onBlur = () => setHot(i, false);
        const onKey = (ev: KeyboardEvent) => {
          if (ev.key === " " || ev.key === "Enter") {
            ev.preventDefault();
            setHot(i, !hot[i]);
          }
        };
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        el.addEventListener("focus", onFocus);
        el.addEventListener("blur", onBlur);
        el.addEventListener("keydown", onKey);
        chipCleanups.push(() => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
          el.removeEventListener("focus", onFocus);
          el.removeEventListener("blur", onBlur);
          el.removeEventListener("keydown", onKey);
        });
      });

      let io: IntersectionObserver | null = null;
      if (reduced()) {
        resolved();
      } else if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (en) => {
            onscreen = en[0].isIntersecting;
            if (onscreen && docVisible) start();
            else stop();
          },
          { threshold: 0.28 }
        );
        io.observe(svg);
        setPre();
      } else {
        onscreen = true;
        start();
      }

      const onVisibility = () => {
        docVisible = !document.hidden;
        if (docVisible && onscreen) start();
        else stop();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const onReduceChange = () => {
        if (reduced()) {
          stop();
          resolved();
        }
      };
      reduceMQ.addEventListener("change", onReduceChange);

      return () => {
        stop();
        if (io) io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        reduceMQ.removeEventListener("change", onReduceChange);
        chipCleanups.forEach((c) => c());
      };
    };

    const cleanups: Array<() => void> = [];
    if (deskRef.current) cleanups.push(wireSvg(deskRef.current, DESKTOP_CONF));
    if (portRef.current) cleanups.push(wireSvg(portRef.current, PORTRAIT_CONF));
    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <div className="sig-frame">
      <span className="sig-tag mono">
        <span className="before">scattered orders</span>{" "}
        <span className="midword">placed into</span>{" "}
        <span className="after">one schedule</span>
      </span>
      <span className="sig-caption mono" ref={captionRef}>
        one schedule
      </span>

      {/* ---- desktop composition: plan left, schedule right ---- */}
      <svg
        className="sig-svg sp-desktop"
        ref={deskRef}
        viewBox="0 0 600 380"
        role="group"
        aria-labelledby="sigTitle sigDesc"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id="sigTitle">
          Work orders placed onto a site plan and its weekly schedule
        </title>
        <desc id="sigDesc">
          A top-down site plan with five plots sits beside a weekly schedule
          strip. Scattered work-order chips are placed one at a time into dated
          lanes; as each lands its plot lights and a dependency line links it to
          the next in sequence. Focus a placed chip to raise its readout and
          light its plot.
        </desc>

        {/* decorative base: plan boundary, contours, divider, labels, lanes */}
        <g aria-hidden="true">
          <text className="sp-head" x="26" y="38">
            SITE PLAN
          </text>
          <text className="sp-head" x="372" y="38">
            SCHEDULE / THIS WEEK
          </text>

          <rect className="sp-frame" x="24" y="46" width="320" height="304" rx="2" />
          <path
            className="sp-contour"
            d="M60 150 C 120 96, 230 92, 300 132 C 340 156, 330 210, 268 250 C 196 292, 96 288, 56 232 C 30 196, 34 176, 60 150 Z"
          />
          <path
            className="sp-contour soft"
            d="M96 160 C 150 122, 232 122, 286 156 C 314 176, 300 214, 250 244 C 192 276, 116 268, 84 220 C 66 196, 72 180, 96 160 Z"
          />
          <path
            className="sp-contour soft"
            d="M132 176 C 172 150, 224 150, 260 172 C 284 188, 274 214, 240 234 C 200 258, 152 250, 130 218 C 116 198, 118 190, 132 176 Z"
          />

          <line className="sp-divider" x1="356" y1="52" x2="356" y2="346" />

          {/* weekly lanes */}
          <g>
            <rect className="lane-track" x="402" y="73" width="180" height="38" rx="2" />
            <rect className="lane-track" x="402" y="123" width="180" height="38" rx="2" />
            <rect className="lane-track" x="402" y="173" width="180" height="38" rx="2" />
            <rect className="lane-track" x="402" y="223" width="180" height="38" rx="2" />
            <rect className="lane-track" x="402" y="273" width="180" height="38" rx="2" />
            <text className="lane-date" x="372" y="95" textAnchor="start">
              MON
            </text>
            <text className="lane-date" x="372" y="145" textAnchor="start">
              TUE
            </text>
            <text className="lane-date" x="372" y="195" textAnchor="start">
              WED
            </text>
            <text className="lane-date" x="372" y="245" textAnchor="start">
              THU
            </text>
            <text className="lane-date" x="372" y="295" textAnchor="start">
              FRI
            </text>
          </g>
        </g>

        {/* plots on the site plan (default state is scheduled / faint amber) */}
        <g id="plots" aria-hidden="true">
          <g className="plot scheduled" data-plot="A">
            <path className="plot-glow" d="M72 96 L120 90 L126 120 L78 126 Z" opacity="0.10" />
            <path className="plot-face" d="M72 96 L120 90 L126 120 L78 126 Z" />
            <text className="plot-id" x="90" y="114">
              A
            </text>
          </g>
          <g className="plot scheduled" data-plot="B">
            <path className="plot-glow" d="M166 84 L214 80 L220 108 L172 112 Z" opacity="0.10" />
            <path className="plot-face" d="M166 84 L214 80 L220 108 L172 112 Z" />
            <text className="plot-id" x="184" y="102">
              B
            </text>
          </g>
          <g className="plot scheduled" data-plot="C">
            <path className="plot-glow" d="M238 138 L286 134 L292 162 L244 166 Z" opacity="0.10" />
            <path className="plot-face" d="M238 138 L286 134 L292 162 L244 166 Z" />
            <text className="plot-id" x="257" y="156">
              C
            </text>
          </g>
          <g className="plot scheduled" data-plot="D">
            <path className="plot-glow" d="M126 202 L174 198 L180 226 L132 230 Z" opacity="0.10" />
            <path className="plot-face" d="M126 202 L174 198 L180 226 L132 230 Z" />
            <text className="plot-id" x="145" y="220">
              D
            </text>
          </g>
          <g className="plot scheduled" data-plot="E">
            <path className="plot-glow" d="M208 258 L256 254 L262 282 L214 286 Z" opacity="0.10" />
            <path className="plot-face" d="M208 258 L256 254 L262 282 L214 286 Z" />
            <text className="plot-id" x="227" y="276">
              E
            </text>
          </g>
        </g>

        {/* amber leader lines (plot to placed chip), shown on hover or focus */}
        <g id="leaders" aria-hidden="true">
          <line className="leader" data-i="0" x1="99" y1="108" x2="418" y2="92" />
          <line className="leader" data-i="1" x1="193" y1="96" x2="418" y2="142" />
          <line className="leader" data-i="2" x1="265" y1="150" x2="418" y2="192" />
          <line className="leader" data-i="3" x1="153" y1="214" x2="418" y2="242" />
          <line className="leader" data-i="4" x1="235" y1="270" x2="418" y2="292" />
        </g>

        {/* dependency spine on the schedule (default fully drawn) */}
        <g id="deps" aria-hidden="true">
          <line className="dep" data-seg="0" x1="410" y1="92" x2="410" y2="142" />
          <line className="dep" data-seg="1" x1="410" y1="142" x2="410" y2="192" />
          <line className="dep" data-seg="2" x1="410" y1="192" x2="410" y2="242" />
          <line className="dep" data-seg="3" x1="410" y1="242" x2="410" y2="292" />
          <circle className="dep-node" cx="410" cy="92" r="2.6" />
          <circle className="dep-node" cx="410" cy="142" r="2.6" />
          <circle className="dep-node" cx="410" cy="192" r="2.6" />
          <circle className="dep-node" cx="410" cy="242" r="2.6" />
          <circle className="dep-node" cx="410" cy="292" r="2.6" />
        </g>

        {/* work-order chips (default state is placed in lanes) */}
        <g id="chips">
          <g
            className="chip"
            data-i="0"
            transform="translate(492,92)"
            role="button"
            tabIndex={0}
            aria-label="Work order: grade site, crew 1, plot A, scheduled Monday."
          >
            <rect className="chip-focus" x="-78" y="-20" width="156" height="40" rx="2" />
            <rect className="chip-body" x="-74" y="-16" width="148" height="32" rx="2" />
            <rect className="chip-accent" x="-74" y="-16" width="3.5" height="32" rx="1.75" />
            <text className="chip-label" x="-62" y="4">
              grade site / crew 1
            </text>
            <rect className="chip-pill" x="52" y="-9" width="16" height="18" rx="2" />
            <text className="chip-pill-id" x="60" y="4" textAnchor="middle">
              A
            </text>
            <g className="plate">
              <rect className="plate-box" x="-74" y="-52" width="150" height="30" rx="2" />
              <text className="plate-title" x="-62" y="-38">
                GRADE SITE
              </text>
              <text className="plate-meta" x="-62" y="-27">
                crew 1 / plot A / mon
              </text>
            </g>
          </g>
          <g
            className="chip"
            data-i="1"
            transform="translate(492,142)"
            role="button"
            tabIndex={0}
            aria-label="Work order: form footings, crew 2, plot B, scheduled Tuesday."
          >
            <rect className="chip-focus" x="-78" y="-20" width="156" height="40" rx="2" />
            <rect className="chip-body" x="-74" y="-16" width="148" height="32" rx="2" />
            <rect className="chip-accent" x="-74" y="-16" width="3.5" height="32" rx="1.75" />
            <text className="chip-label" x="-62" y="4">
              form footings / crew 2
            </text>
            <rect className="chip-pill" x="52" y="-9" width="16" height="18" rx="2" />
            <text className="chip-pill-id" x="60" y="4" textAnchor="middle">
              B
            </text>
            <g className="plate">
              <rect className="plate-box" x="-74" y="-52" width="150" height="30" rx="2" />
              <text className="plate-title" x="-62" y="-38">
                FORM FOOTINGS
              </text>
              <text className="plate-meta" x="-62" y="-27">
                crew 2 / plot B / tue
              </text>
            </g>
          </g>
          <g
            className="chip"
            data-i="2"
            transform="translate(492,192)"
            role="button"
            tabIndex={0}
            aria-label="Work order: rebar delivery, materials, plot C, scheduled Wednesday."
          >
            <rect className="chip-focus" x="-78" y="-20" width="156" height="40" rx="2" />
            <rect className="chip-body" x="-74" y="-16" width="148" height="32" rx="2" />
            <rect className="chip-accent" x="-74" y="-16" width="3.5" height="32" rx="1.75" />
            <text className="chip-label" x="-62" y="4">
              rebar delivery
            </text>
            <rect className="chip-pill" x="52" y="-9" width="16" height="18" rx="2" />
            <text className="chip-pill-id" x="60" y="4" textAnchor="middle">
              C
            </text>
            <g className="plate">
              <rect className="plate-box" x="-74" y="-52" width="150" height="30" rx="2" />
              <text className="plate-title" x="-62" y="-38">
                REBAR DELIVERY
              </text>
              <text className="plate-meta" x="-62" y="-27">
                materials / plot C / wed
              </text>
            </g>
          </g>
          <g
            className="chip"
            data-i="3"
            transform="translate(492,242)"
            role="button"
            tabIndex={0}
            aria-label="Work order: pour slab, crew 2, plot D, scheduled Thursday."
          >
            <rect className="chip-focus" x="-78" y="-20" width="156" height="40" rx="2" />
            <rect className="chip-body" x="-74" y="-16" width="148" height="32" rx="2" />
            <rect className="chip-accent" x="-74" y="-16" width="3.5" height="32" rx="1.75" />
            <text className="chip-label" x="-62" y="4">
              pour slab / crew 2
            </text>
            <rect className="chip-pill" x="52" y="-9" width="16" height="18" rx="2" />
            <text className="chip-pill-id" x="60" y="4" textAnchor="middle">
              D
            </text>
            <g className="plate">
              <rect className="plate-box" x="-74" y="-52" width="150" height="30" rx="2" />
              <text className="plate-title" x="-62" y="-38">
                POUR SLAB
              </text>
              <text className="plate-meta" x="-62" y="-27">
                crew 2 / plot D / thu
              </text>
            </g>
          </g>
          <g
            className="chip"
            data-i="4"
            transform="translate(492,292)"
            role="button"
            tabIndex={0}
            aria-label="Work order: inspection, city, plot E, scheduled Friday."
          >
            <rect className="chip-focus" x="-78" y="-20" width="156" height="40" rx="2" />
            <rect className="chip-body" x="-74" y="-16" width="148" height="32" rx="2" />
            <rect className="chip-accent" x="-74" y="-16" width="3.5" height="32" rx="1.75" />
            <text className="chip-label" x="-62" y="4">
              inspection
            </text>
            <rect className="chip-pill" x="52" y="-9" width="16" height="18" rx="2" />
            <text className="chip-pill-id" x="60" y="4" textAnchor="middle">
              E
            </text>
            <g className="plate">
              <rect className="plate-box" x="-74" y="-52" width="150" height="30" rx="2" />
              <text className="plate-title" x="-62" y="-38">
                INSPECTION
              </text>
              <text className="plate-meta" x="-62" y="-27">
                city / plot E / fri
              </text>
            </g>
          </g>
        </g>
      </svg>

      {/* ---- portrait composition: plan on top, vertical week below ---- */}
      <svg
        className="sig-svg sp-portrait"
        ref={portRef}
        viewBox="0 0 340 578"
        role="group"
        aria-labelledby="sigTitleP sigDescP"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id="sigTitleP">
          Work orders placed onto a site plan and its weekly schedule
        </title>
        <desc id="sigDescP">
          A top-down site plan with five plots sits above a weekly schedule of
          five dated lanes. Scattered work-order chips are placed one at a time
          into the lanes; as each lands its plot lights and a dependency line
          links it to the next in sequence. Focus a placed chip to raise its
          readout and light its plot.
        </desc>

        <g aria-hidden="true">
          <text className="sp-head" x="320" y="72" textAnchor="end">
            SITE PLAN
          </text>
          <text className="sp-head" x="18" y="292">
            SCHEDULE / THIS WEEK
          </text>

          <rect className="sp-frame" x="14" y="80" width="312" height="180" rx="2" />
          <path
            className="sp-contour"
            d="M50 150 C 110 110, 230 108, 288 148 C 312 168, 300 210, 240 236 C 170 262, 80 254, 52 210 C 36 184, 38 168, 50 150 Z"
          />
          <path
            className="sp-contour soft"
            d="M86 158 C 140 128, 226 128, 272 156 C 296 174, 286 206, 236 226 C 180 250, 108 244, 84 206 C 70 186, 74 172, 86 158 Z"
          />

          <line className="sp-divider" x1="20" y1="276" x2="320" y2="276" />

          {/* weekly lanes (full width) */}
          <g>
            {PORTRAIT_CHIPS.map((c, i) => (
              <rect
                key={"lane" + i}
                className="lane-track"
                x="52"
                y={c.y - 21}
                width="274"
                height="42"
                rx="2"
              />
            ))}
            {PORTRAIT_DAYS.map((d, i) => (
              <text
                key={"day" + i}
                className="lane-date"
                x="16"
                y={PORTRAIT_CHIPS[i].y + 4}
                textAnchor="start"
              >
                {d}
              </text>
            ))}
          </g>
        </g>

        <g id="plotsP" aria-hidden="true">
          {PORTRAIT_PLOTS.map((p) => (
            <g className="plot scheduled" data-plot={p.id} key={"plot" + p.id}>
              <path className="plot-glow" d={p.d} opacity="0.10" />
              <path className="plot-face" d={p.d} />
              <text className="plot-id" x={p.tx} y={p.ty}>
                {p.id}
              </text>
            </g>
          ))}
        </g>

        <g id="leadersP" aria-hidden="true">
          {PORTRAIT_LEADERS.map((l, i) => (
            <line
              key={"lead" + i}
              className="leader"
              data-i={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
            />
          ))}
        </g>

        <g id="depsP" aria-hidden="true">
          {PORTRAIT_CHIPS.slice(0, 4).map((c, i) => (
            <line
              key={"dep" + i}
              className="dep"
              data-seg={i}
              x1="40"
              y1={c.y}
              x2="40"
              y2={PORTRAIT_CHIPS[i + 1].y}
            />
          ))}
          {PORTRAIT_CHIPS.map((c, i) => (
            <circle key={"node" + i} className="dep-node" cx="40" cy={c.y} r="2.8" />
          ))}
        </g>

        <g id="chipsP">
          {PORTRAIT_CHIPS.map((c, i) => (
            <g
              className="chip"
              data-i={i}
              key={"chip" + i}
              transform={"translate(189," + c.y + ")"}
              role="button"
              tabIndex={0}
              aria-label={c.aria}
            >
              <rect className="chip-focus" x="-128" y="-21" width="256" height="42" rx="2" />
              <rect className="chip-body" x="-124" y="-17" width="248" height="34" rx="2" />
              <rect className="chip-accent" x="-124" y="-17" width="4" height="34" rx="2" />
              <text className="chip-label" x="-110" y="5">
                {c.label}
              </text>
              <rect className="chip-pill" x="92" y="-11" width="20" height="22" rx="2" />
              <text className="chip-pill-id" x="102" y="5" textAnchor="middle">
                {c.pill}
              </text>
              <g className="plate">
                <rect className="plate-box" x="-124" y="-54" width="250" height="34" rx="2" />
                <text className="plate-title" x="-110" y="-39">
                  {c.title}
                </text>
                <text className="plate-meta" x="-110" y="-27">
                  {c.meta}
                </text>
              </g>
            </g>
          ))}
        </g>
      </svg>

      <noscript>
        <div className="sig-fallback">
          Scattered work orders, grade site, form footings, rebar delivery, pour
          slab, and inspection, settle one at a time into dated lanes on a weekly
          schedule beside a site plan, each lighting its plot and linking to the
          next in sequence.
        </div>
      </noscript>
    </div>
  );
}
