"use client";

import { useEffect, useRef, useState } from "react";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { monteXanic } from "@/lib/i18n/monte-xanic";

/**
 * Berry to bottle strip. On wide screens a single wine dot travels one
 * continuous horizontal thread through four stations (berry, tank, barrel,
 * bottle), lighting each as it is reached, then loops. On narrow portrait
 * screens (< 520px measured) a purpose-made VERTICAL variant mounts instead:
 * the same thread runs top to bottom with large station names and icons, so
 * the chain reads the way a phone is held. Exactly one variant mounts and runs
 * a single rAF loop at a time (the wrapper swaps them via matchMedia).
 *
 * Both variants keep the source contracts: paused off-screen
 * (IntersectionObserver), on hidden tab (visibilitychange), resolved to the
 * finished state under reduced motion, rAF throttled to ~25fps, and the mode
 * flip restyles for free because every color comes from a CSS token class.
 */

/* One source of truth: the MEASURED host width decides the composition (not the
   viewport), and the supporting CSS keys off the same threshold via .b2b-host.
   Below this the vertical (portrait) variant mounts; at or above it the
   horizontal thread mounts. Both fit their content height at every width. */
const MOBILE_MAX = 540;

export default function BerryToBottle() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  // SSR + first client render (w === null) is the horizontal variant, so
  // hydration matches. This visual sits well below the fold, so the one-time
  // swap to the vertical variant on a phone happens before it scrolls into view.
  const [w, setW] = useState<number | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const measure = () => setW(host.clientWidth);
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => measure());
      ro.observe(host);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const mobile = w !== null && w < MOBILE_MAX;
  return (
    <div className="b2b-host" ref={hostRef}>
      {mobile ? (
        <BerryToBottleMobile width={w as number} />
      ) : (
        <BerryToBottleDesktop width={w} />
      )}
    </div>
  );
}

/* ============================ DESKTOP (horizontal thread) ============================ */
function BerryToBottleDesktop({ width }: { width: number | null }) {
  const t = useDict(monteXanic).vis.b2b;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  /* hold the station labels near a fixed rendered size (~15px) regardless of
     width: SVG text scales with the viewBox, so counter-scale the font. Keeps
     the thread legible from the handoff width up, not just on desktop. The var
     is set on the stage and inherits down to the label text. */
  const fs = width ? Math.round((15 * 1000) / width) : 15;
  const dotRef = useRef<SVGCircleElement | null>(null);
  const haloRef = useRef<SVGCircleElement | null>(null);
  const progRef = useRef<SVGLineElement | null>(null);

  useEffect(() => {
    wrapRef.current?.style.setProperty("--b2b-fs", fs + "px");
  }, [fs]);

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
      <span className="b2b-note mono">{t.note}</span>
      <svg
        className="b2b-svg"
        viewBox="0 0 1000 240"
        role="img"
        aria-label={t.ariaH}
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
          {/* Lucide "grape" (lucide-static 1.48.0, ISC) */}
          <g className="b2b-icon" transform="translate(140,80) scale(1.75) translate(-12,-12)">
            <circle className="b2b-ico" cx="16.6" cy="15.89" r="3" />
            <circle className="b2b-ico" cx="8.11" cy="7.4" r="3" />
            <circle className="b2b-ico" cx="12.35" cy="11.65" r="3" />
            <circle className="b2b-ico" cx="13.91" cy="5.85" r="3" />
            <circle className="b2b-ico" cx="18.15" cy="10.09" r="3" />
            <circle className="b2b-ico" cx="6.56" cy="13.2" r="3" />
            <circle className="b2b-ico" cx="10.8" cy="17.44" r="3" />
            <circle className="b2b-ico" cx="5" cy="19" r="3" />
            <path className="b2b-ico" d="M22 5V2l-5.89 5.89" />
          </g>
          <text className="b2b-lab" x="140" y="196" textAnchor="middle">{t.berry}</text>
        </g>

        <g className="b2b-station" id="b2b-st-1">
          <circle className="b2b-node" cx="380" cy="150" r="9" />
          {/* Lucide "cylinder" (lucide-static 1.48.0, ISC) */}
          <g className="b2b-icon" transform="translate(380,80) scale(1.75) translate(-12,-12)">
            <ellipse className="b2b-ico" cx="12" cy="5" rx="9" ry="3" />
            <path className="b2b-ico" d="M3 5v14a9 3 0 0 0 18 0V5" />
          </g>
          <text className="b2b-lab" x="380" y="196" textAnchor="middle">{t.tank}</text>
        </g>

        <g className="b2b-station" id="b2b-st-2">
          <circle className="b2b-node" cx="620" cy="150" r="9" />
          {/* Lucide "barrel" (lucide-static 1.48.0, ISC) */}
          <g className="b2b-icon" transform="translate(620,80) scale(1.75) translate(-12,-12)">
            <path className="b2b-ico" d="M10 3a41 41 0 000 18" />
            <path className="b2b-ico" d="M14 3a41 41 0 010 18" />
            <path className="b2b-ico" d="M16.997 21a2 2 0 001.68-.92 15.25 15.25 0 000-16.16 2 2 0 00-1.68-.92h-10a2 2 0 00-1.681.92 15.25 15.25 0 000 16.16 2 2 0 001.681.92z" />
            <path className="b2b-ico" d="M3.54 16h16.914" />
            <path className="b2b-ico" d="M3.54 8h16.914" />
          </g>
          <text className="b2b-lab" x="620" y="196" textAnchor="middle">{t.barrel}</text>
        </g>

        <g className="b2b-station" id="b2b-st-3">
          <circle className="b2b-node" cx="860" cy="150" r="9" />
          {/* Lucide "bottle-wine" (lucide-static 1.48.0, ISC) */}
          <g className="b2b-icon" transform="translate(860,80) scale(1.75) translate(-12,-12)">
            <path className="b2b-ico" d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a6 6 0 0 0 1.2 3.6l.6.8A6 6 0 0 1 17 13v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8a6 6 0 0 1 1.2-3.6l.6-.8A6 6 0 0 0 10 5z" />
            <path className="b2b-ico" d="M17 13h-4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h4" />
          </g>
          <text className="b2b-lab" x="860" y="196" textAnchor="middle">{t.bottle}</text>
        </g>

        <circle className="b2b-halo" id="b2bHalo" ref={haloRef} cx="140" cy="150" r="12" />
        <circle className="b2b-dot" id="b2bDot" ref={dotRef} cx="140" cy="150" r="5" />
      </svg>
      <noscript>
        <div className="vine-fallback">{t.fallback}</div>
      </noscript>
    </div>
  );
}

/* ============================ MOBILE (vertical thread) ============================
   Portrait composition designed for a phone: a single rail runs top to bottom,
   the wine dot descends it, and each station lights as it is reached. Icons and
   station names sit to the right of the rail at phone-legible sizes. The taller-
   than-wide viewBox fills the frame, so there is no dead letterbox space. */
function BerryToBottleMobile({ width }: { width: number }) {
  const t = useDict(monteXanic).vis.b2b;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  /* counter-scale the station labels to a fixed rendered size (~25px) so the
     portrait thread reads at phone-legible size across the narrow range. */
  const fs = width ? Math.round((25 * 320) / width) : 26;
  const dotRef = useRef<SVGCircleElement | null>(null);
  const haloRef = useRef<SVGCircleElement | null>(null);
  const progRef = useRef<SVGLineElement | null>(null);

  useEffect(() => {
    wrapRef.current?.style.setProperty("--b2b-fs", fs + "px");
  }, [fs]);

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

    const Y0 = 96;
    const Y1 = 480;
    const SPAN = Y1 - Y0;
    const stationY = [96, 224, 352, 480];
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
      const y = Y0 + SPAN * clamp01(u);
      dot.setAttribute("cy", y.toFixed(1));
      halo.setAttribute("cy", y.toFixed(1));
      prog.setAttribute("y2", y.toFixed(1));
      for (let i = 0; i < sEls.length; i++) {
        if (sEls[i]) sEls[i].classList.toggle("reached", y >= stationY[i] - 1);
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
      className="vine-stage b2b-stage b2b-stage-m vis-frame"
      id="b2bStage"
      ref={wrapRef}
      style={{ aspectRatio: "auto" }}
    >
      <span className="b2b-note mono">{t.note}</span>
      <svg
        className="b2b-svg"
        viewBox="0 0 320 540"
        role="img"
        aria-label={t.ariaV}
      >
        <line className="b2b-track" x1="58" y1="96" x2="58" y2="480" />
        <line
          className="b2b-prog"
          ref={progRef}
          x1="58"
          y1="96"
          x2="58"
          y2="96"
        />

        <g className="b2b-station" id="b2b-m-0">
          <circle className="b2b-node" cx="58" cy="96" r="12" />
          {/* Lucide "grape" (lucide-static 1.48.0, ISC) */}
          <g className="b2b-icon" transform="translate(104,96) scale(2.1) translate(-12,-12)">
            <circle className="b2b-ico" cx="16.6" cy="15.89" r="3" />
            <circle className="b2b-ico" cx="8.11" cy="7.4" r="3" />
            <circle className="b2b-ico" cx="12.35" cy="11.65" r="3" />
            <circle className="b2b-ico" cx="13.91" cy="5.85" r="3" />
            <circle className="b2b-ico" cx="18.15" cy="10.09" r="3" />
            <circle className="b2b-ico" cx="6.56" cy="13.2" r="3" />
            <circle className="b2b-ico" cx="10.8" cy="17.44" r="3" />
            <circle className="b2b-ico" cx="5" cy="19" r="3" />
            <path className="b2b-ico" d="M22 5V2l-5.89 5.89" />
          </g>
          <text className="b2b-lab b2b-lab-m" x="150" y="96" dominantBaseline="middle">{t.berry}</text>
        </g>

        <g className="b2b-station" id="b2b-m-1">
          <circle className="b2b-node" cx="58" cy="224" r="12" />
          {/* Lucide "cylinder" (lucide-static 1.48.0, ISC) */}
          <g className="b2b-icon" transform="translate(104,224) scale(2.1) translate(-12,-12)">
            <ellipse className="b2b-ico" cx="12" cy="5" rx="9" ry="3" />
            <path className="b2b-ico" d="M3 5v14a9 3 0 0 0 18 0V5" />
          </g>
          <text className="b2b-lab b2b-lab-m" x="150" y="224" dominantBaseline="middle">{t.tank}</text>
        </g>

        <g className="b2b-station" id="b2b-m-2">
          <circle className="b2b-node" cx="58" cy="352" r="12" />
          {/* Lucide "barrel" (lucide-static 1.48.0, ISC) */}
          <g className="b2b-icon" transform="translate(104,352) scale(2.1) translate(-12,-12)">
            <path className="b2b-ico" d="M10 3a41 41 0 000 18" />
            <path className="b2b-ico" d="M14 3a41 41 0 010 18" />
            <path className="b2b-ico" d="M16.997 21a2 2 0 001.68-.92 15.25 15.25 0 000-16.16 2 2 0 00-1.68-.92h-10a2 2 0 00-1.681.92 15.25 15.25 0 000 16.16 2 2 0 001.681.92z" />
            <path className="b2b-ico" d="M3.54 16h16.914" />
            <path className="b2b-ico" d="M3.54 8h16.914" />
          </g>
          <text className="b2b-lab b2b-lab-m" x="150" y="352" dominantBaseline="middle">{t.barrel}</text>
        </g>

        <g className="b2b-station" id="b2b-m-3">
          <circle className="b2b-node" cx="58" cy="480" r="12" />
          {/* Lucide "bottle-wine" (lucide-static 1.48.0, ISC) */}
          <g className="b2b-icon" transform="translate(104,480) scale(2.1) translate(-12,-12)">
            <path className="b2b-ico" d="M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a6 6 0 0 0 1.2 3.6l.6.8A6 6 0 0 1 17 13v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8a6 6 0 0 1 1.2-3.6l.6-.8A6 6 0 0 0 10 5z" />
            <path className="b2b-ico" d="M17 13h-4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h4" />
          </g>
          <text className="b2b-lab b2b-lab-m" x="150" y="480" dominantBaseline="middle">{t.bottle}</text>
        </g>

        <circle className="b2b-halo" ref={haloRef} cx="58" cy="96" r="16" />
        <circle className="b2b-dot" ref={dotRef} cx="58" cy="96" r="6.5" />
      </svg>
      <noscript>
        <div className="vine-fallback">{t.fallback}</div>
      </noscript>
    </div>
  );
}
