"use client";

import { useEffect, useRef } from "react";

/**
 * Berry to bottle strip: a single wine dot travels the one continuous thread
 * through four stations (berry, tank, barrel, bottle), lighting each as it is
 * reached, then loops. Paused off-screen (IntersectionObserver), on hidden tab
 * (visibilitychange), and resolved to the finished state under reduced motion.
 * rAF is throttled to ~25fps to match the source.
 */
export default function BerryToBottle() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<SVGCircleElement | null>(null);
  const haloRef = useRef<SVGCircleElement | null>(null);
  const progRef = useRef<SVGLineElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const halo = haloRef.current;
    const prog = progRef.current;
    if (!wrap || !dot || !halo || !prog) return;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;

    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

    const X0 = 140;
    const X1 = 860;
    const SPAN = X1 - X0;
    const stationX = [140, 380, 620, 860];
    const sEls = Array.prototype.slice.call(
      wrap.querySelectorAll(".b2b-station")
    ) as SVGGElement[];

    const TRIP = 13;
    const HOLDB = 2.4;
    const CYC = TRIP + HOLDB;

    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let clock = 0;

    const setU = (u: number) => {
      const x = X0 + SPAN * clamp01(u);
      dot.setAttribute("cx", x.toFixed(1));
      halo.setAttribute("cx", x.toFixed(1));
      prog.setAttribute("x2", x.toFixed(1));
      for (let i = 0; i < sEls.length; i++) {
        if (sEls[i]) sEls[i].classList.toggle("reached", x >= stationX[i] - 1);
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 40) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.06) dt = 0.06;
      clock += dt;
      if (clock > CYC) clock -= CYC;
      const u = clock < TRIP ? clock / TRIP : 1;
      setU(u);
    };
    const canRun = () => !reduced() && docVisible && onscreen;
    const start = () => {
      if (running || !canRun()) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    let io: IntersectionObserver | null = null;
    if (reduced()) {
      setU(1);
    } else if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (en) => {
          onscreen = en[0].isIntersecting;
          if (onscreen && docVisible) start();
          else stop();
        },
        { threshold: 0.2 }
      );
      io.observe(wrap);
      setU(0);
    } else {
      onscreen = true;
      setU(0);
      start();
    }

    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible && onscreen) start();
      else stop();
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        setU(1);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    reduceMQ.addEventListener("change", onReduceChange);

    return () => {
      stop();
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, []);

  return (
    <div
      className="vine-stage b2b-stage vis-frame"
      id="b2bStage"
      ref={wrapRef}
      style={{ aspectRatio: "auto" }}
    >
      <span className="b2b-note mono">field to bottle, one continuous thread</span>
      <svg
        className="b2b-svg"
        viewBox="0 0 1000 240"
        role="img"
        aria-label="A continuous thread runs through four stations, berry, tank, barrel, and bottle, with wine travelling along it."
      >
        <line className="b2b-track" x1="140" y1="150" x2="860" y2="150" />
        <line
          className="b2b-prog"
          id="b2bProg"
          ref={progRef}
          x1="140"
          y1="150"
          x2="140"
          y2="150"
        />

        <g className="b2b-station" id="b2b-st-0">
          <circle className="b2b-node" cx="140" cy="150" r="9" />
          <g transform="translate(140,74)">
            <circle className="b2b-ico-fill" cx="-7" cy="4" r="6" />
            <circle className="b2b-ico-fill" cx="6" cy="2" r="6" />
            <circle className="b2b-ico-fill" cx="-1" cy="14" r="6" />
            <path className="b2b-ico" d="M0 -8 L4 -16" />
          </g>
          <text className="b2b-lab" x="140" y="196" textAnchor="middle">
            Berry
          </text>
        </g>

        <g className="b2b-station" id="b2b-st-1">
          <circle className="b2b-node" cx="380" cy="150" r="9" />
          <g transform="translate(380,66)">
            <ellipse className="b2b-ico" cx="0" cy="0" rx="14" ry="5" />
            <path className="b2b-ico" d="M-14 0 L-14 22 L14 22 L14 0" />
            <path className="b2b-ico" d="M-9 22 L0 34 L9 22" />
          </g>
          <text className="b2b-lab" x="380" y="196" textAnchor="middle">
            Tank
          </text>
        </g>

        <g className="b2b-station" id="b2b-st-2">
          <circle className="b2b-node" cx="620" cy="150" r="9" />
          <g transform="translate(620,70)">
            <rect className="b2b-ico" x="-16" y="-6" width="32" height="34" rx="12" />
            <line className="b2b-ico" x1="-16" y1="4" x2="16" y2="4" />
            <line className="b2b-ico" x1="-16" y1="18" x2="16" y2="18" />
          </g>
          <text className="b2b-lab" x="620" y="196" textAnchor="middle">
            Barrel
          </text>
        </g>

        <g className="b2b-station" id="b2b-st-3">
          <circle className="b2b-node" cx="860" cy="150" r="9" />
          <g transform="translate(860,60)">
            <path
              className="b2b-ico"
              d="M-4 -6 L-4 4 C-9 8, -9 14, -9 20 L-9 40 L9 40 L9 20 C9 14, 9 8, 4 4 L4 -6 Z"
            />
            <line className="b2b-ico" x1="-4" y1="-6" x2="4" y2="-6" />
          </g>
          <text className="b2b-lab" x="860" y="196" textAnchor="middle">
            Bottle
          </text>
        </g>

        <circle className="b2b-halo" id="b2bHalo" ref={haloRef} cx="140" cy="150" r="12" />
        <circle className="b2b-dot" id="b2bDot" ref={dotRef} cx="140" cy="150" r="5" />
      </svg>
      <noscript>
        <div className="vine-fallback">
          Berry, tank, barrel, bottle: the wine is tracked as one continuous
          thread from the vine to the finished bottle.
        </div>
      </noscript>
    </div>
  );
}
