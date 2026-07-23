"use client";

import { useEffect, useRef } from "react";
import { clamp01, easeInOut } from "./canvasKit";

/**
 * Operations visual: an hour of manual work compressing to about two minutes,
 * a 97 percent reduction. JS driven so it plays at a calm, watchable pace and
 * loops slowly (~9.6s cycle). Colors stay in CSS tokens (class driven), so it
 * recolors with the mode toggle without any palette read here. Paused offscreen
 * and when the document is hidden; resolved static state under reduced motion.
 */
export default function OpsCompression() {
  const visRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const svgMRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const vis = visRef.current;
    const svg = svgRef.current;
    const svgM = svgMRef.current;
    if (!vis || !svg) return;

    const barP = svg.querySelector("#opsBarPrimary");
    const barG = svg.querySelector("#opsBarGold");
    const tangle = svg.querySelector("#opsTangle");
    const clean = svg.querySelector("#opsClean");
    const cleanN = svg.querySelector("#opsCleanNodes");
    const labM = svg.querySelector("#opsLabManual");
    const labA = svg.querySelector("#opsLabAuto");
    const timeL = svg.querySelector("#opsTimeLong");
    const timeS = svg.querySelector("#opsTimeShort");
    const badge = svg.querySelector("#opsBadge");
    if (
      !barP || !barG || !tangle || !clean || !cleanN ||
      !labM || !labA || !timeL || !timeS || !badge
    ) {
      return;
    }
    // Mobile-composition twins (taller viewBox, larger type). Bound alongside
    // the desktop set and driven by the same loop; CSS displays exactly one, so
    // writing both each frame is cheap (the hidden one skips layout/paint).
    const q = (id: string) => (svgM ? svgM.querySelector(id) : null);
    const barPm = q("#opsBarPrimaryM");
    const barGm = q("#opsBarGoldM");
    const tangleM = q("#opsTangleM");
    const cleanM = q("#opsCleanM");
    const cleanNm = q("#opsCleanNodesM");
    const labMm = q("#opsLabManualM");
    const labAm = q("#opsLabAutoM");
    const timeLm = q("#opsTimeLongM");
    const timeSm = q("#opsTimeShortM");
    const badgeM = q("#opsBadgeM");

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;

    const BAR_MAX = 452;
    const BAR_MIN = 40;
    const BAR_MAX_M = 312;
    const BAR_MIN_M = 44;
    const LONG = 0.7;
    const COMPRESS = 5.4;
    const HOLD = 2.8;
    const FADE = 0.7;
    const CYCLE = LONG + COMPRESS + HOLD + FADE;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let tt = 0;

    function set(el: Element | null, attr: string, val: string) {
      if (el) el.setAttribute(attr, val);
    }

    function apply(p: number, fo: number) {
      const e = easeInOut(p);
      const w = BAR_MAX + (BAR_MIN - BAR_MAX) * e;
      barP!.setAttribute("width", w.toFixed(1));
      barG!.setAttribute("width", w.toFixed(1));
      const wm = (BAR_MAX_M + (BAR_MIN_M - BAR_MAX_M) * e).toFixed(1);
      set(barPm, "width", wm);
      set(barGm, "width", wm);
      const gOp = (1 - clamp01((p - 0.3) / 0.4)).toFixed(3);
      const tOp = (1 - clamp01((p - 0.15) / 0.35)).toFixed(3);
      const cl = clamp01((p - 0.42) / 0.34).toFixed(3);
      const cnOp = clamp01((p - 0.5) / 0.3).toFixed(3);
      const lmOp = (1 - clamp01((p - 0.2) / 0.2)).toFixed(3);
      const laOp = clamp01((p - 0.6) / 0.25).toFixed(3);
      const tlOp = (1 - clamp01((p - 0.25) / 0.2)).toFixed(3);
      const tsOp = clamp01((p - 0.65) / 0.2).toFixed(3);
      const bp = clamp01((p - 0.78) / 0.22);
      const bpOp = bp.toFixed(3);
      const bpTr = "translate(0," + ((1 - bp) * 6).toFixed(2) + ")";
      barG!.setAttribute("opacity", gOp);
      tangle!.setAttribute("opacity", tOp);
      clean!.setAttribute("opacity", cl);
      cleanN!.setAttribute("opacity", cnOp);
      labM!.setAttribute("opacity", lmOp);
      labA!.setAttribute("opacity", laOp);
      timeL!.setAttribute("opacity", tlOp);
      timeS!.setAttribute("opacity", tsOp);
      badge!.setAttribute("opacity", bpOp);
      badge!.setAttribute("transform", bpTr);
      set(barGm, "opacity", gOp);
      set(tangleM, "opacity", tOp);
      set(cleanM, "opacity", cl);
      set(cleanNm, "opacity", cnOp);
      set(labMm, "opacity", lmOp);
      set(labAm, "opacity", laOp);
      set(timeLm, "opacity", tlOp);
      set(timeSm, "opacity", tsOp);
      set(badgeM, "opacity", bpOp);
      set(badgeM, "transform", bpTr);
      svg!.style.opacity = fo.toFixed(3);
      if (svgM) svgM.style.opacity = fo.toFixed(3);
    }

    const resolved = () => apply(1, 1);

    function frame(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 32) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      tt += dt;
      if (tt > CYCLE) tt -= CYCLE;
      let p: number;
      let fo = 1;
      if (tt < LONG) p = 0;
      else if (tt < LONG + COMPRESS) p = (tt - LONG) / COMPRESS;
      else p = 1;
      const fadeStart = LONG + COMPRESS + HOLD;
      if (tt >= fadeStart) fo = 1 - ((tt - fadeStart) / FADE) * 0.82;
      else if (tt < 0.45) fo = 0.18 + (tt / 0.45) * 0.82;
      apply(p, fo);
    }
    const canRun = () => !reduced() && docVisible && onscreen;
    function start() {
      if (running || !canRun()) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible && onscreen) start();
      else stop();
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        resolved();
      }
    };

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
        { threshold: 0.35 }
      );
      io.observe(vis);
      apply(0, 0.18);
    } else {
      onscreen = true;
      start();
    }

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
    <div className="vis-frame ops-vis" ref={visRef}>
      <span className="vis-tag">an hour, compressed to two minutes</span>
      <svg
        className="ops-svg ops-svg-d"
        ref={svgRef}
        viewBox="0 0 520 250"
        role="img"
        aria-label="A long tangled hour of manual work compresses into one short clean two minute automated pass, a 97 percent reduction."
      >
        <g
          className="ov-tangle"
          id="opsTangle"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0"
        >
          <path d="M34 78 L 70 78 L 70 50 L 118 50 L 150 84 L 150 108 L 206 108 L 250 66 L 300 66 L 330 100 L 384 100 L 384 62 L 440 62 L 486 90" />
          <circle cx="34" cy="78" r="4" />
          <circle cx="150" cy="84" r="3.4" />
          <circle cx="250" cy="66" r="3.4" />
          <circle cx="384" cy="62" r="3.4" />
          <circle cx="486" cy="90" r="4" />
        </g>
        <g
          className="ov-clean"
          id="opsClean"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="1"
        >
          <line x1="34" y1="82" x2="486" y2="82" />
        </g>
        <g className="ov-clean-fill" id="opsCleanNodes" opacity="1">
          <circle cx="34" cy="82" r="4" />
          <circle cx="260" cy="82" r="3.4" />
          <circle cx="486" cy="82" r="4" />
        </g>

        <text
          className="ov-lab-manual mono"
          id="opsLabManual"
          x="34"
          y="150"
          fontSize="12"
          letterSpacing="1.5"
          opacity="0"
        >
          MANUAL, EVERY WEEK
        </text>
        <text
          className="ov-lab-auto mono"
          id="opsLabAuto"
          x="34"
          y="150"
          fontSize="12"
          letterSpacing="1.5"
          opacity="1"
        >
          AUTOMATED, RUNS ITSELF
        </text>
        <rect className="ov-track" x="34" y="162" width="452" height="16" rx="8" />
        <rect
          className="ov-bar-primary"
          id="opsBarPrimary"
          x="34"
          y="162"
          width="40"
          height="16"
          rx="8"
        />
        <rect
          className="ov-bar-gold"
          id="opsBarGold"
          x="34"
          y="162"
          width="40"
          height="16"
          rx="8"
          opacity="0"
        />
        <text
          className="ov-time-long mono"
          id="opsTimeLong"
          x="486"
          y="150"
          textAnchor="end"
          fontSize="15"
          fontWeight="600"
          opacity="0"
        >
          1 hr
        </text>
        <text
          className="ov-time-short mono"
          id="opsTimeShort"
          x="486"
          y="150"
          textAnchor="end"
          fontSize="15"
          fontWeight="600"
          opacity="1"
        >
          2 min
        </text>

        <g id="opsBadge" opacity="1">
          <rect className="ov-badge-box" x="34" y="200" width="152" height="34" rx="8" />
          <text className="ov-badge-text mono" x="50" y="222" fontSize="15" fontWeight="600">
            97% less time
          </text>
        </g>
        <text
          className="ov-foot mono"
          x="486"
          y="223"
          textAnchor="end"
          fontSize="11"
          letterSpacing="1"
        >
          REFRESHED THROUGH THE DAY
        </text>
      </svg>

      <svg
        className="ops-svg ops-svg-m"
        ref={svgMRef}
        viewBox="0 0 360 300"
        role="img"
        aria-label="A long tangled hour of manual work compresses into one short clean two minute automated pass, a 97 percent reduction."
      >
        <g
          className="ov-tangle"
          id="opsTangleM"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0"
        >
          <path d="M24 72 L 58 72 L 58 44 L 104 44 L 134 80 L 134 102 L 190 102 L 232 60 L 280 60 L 308 94 L 336 78" />
          <circle cx="24" cy="72" r="4.4" />
          <circle cx="134" cy="80" r="3.6" />
          <circle cx="232" cy="60" r="3.6" />
          <circle cx="308" cy="94" r="3.6" />
          <circle cx="336" cy="78" r="4.4" />
        </g>
        <g
          className="ov-clean"
          id="opsCleanM"
          fill="none"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="1"
        >
          <line x1="24" y1="80" x2="336" y2="80" />
        </g>
        <g className="ov-clean-fill" id="opsCleanNodesM" opacity="1">
          <circle cx="24" cy="80" r="4.4" />
          <circle cx="180" cy="80" r="3.6" />
          <circle cx="336" cy="80" r="4.4" />
        </g>

        <text
          className="ov-lab-manual mono"
          id="opsLabManualM"
          x="24"
          y="150"
          fontSize="16"
          letterSpacing="1.2"
          opacity="0"
        >
          MANUAL, EVERY WEEK
        </text>
        <text
          className="ov-lab-auto mono"
          id="opsLabAutoM"
          x="24"
          y="150"
          fontSize="16"
          letterSpacing="1.2"
          opacity="1"
        >
          AUTOMATED, RUNS ITSELF
        </text>
        <rect className="ov-track" x="24" y="164" width="312" height="22" rx="11" />
        <rect
          className="ov-bar-primary"
          id="opsBarPrimaryM"
          x="24"
          y="164"
          width="44"
          height="22"
          rx="11"
        />
        <rect
          className="ov-bar-gold"
          id="opsBarGoldM"
          x="24"
          y="164"
          width="44"
          height="22"
          rx="11"
          opacity="0"
        />
        <text
          className="ov-time-long mono"
          id="opsTimeLongM"
          x="336"
          y="150"
          textAnchor="end"
          fontSize="20"
          fontWeight="600"
          opacity="0"
        >
          1 hr
        </text>
        <text
          className="ov-time-short mono"
          id="opsTimeShortM"
          x="336"
          y="150"
          textAnchor="end"
          fontSize="20"
          fontWeight="600"
          opacity="1"
        >
          2 min
        </text>

        <g id="opsBadgeM" opacity="1">
          <rect className="ov-badge-box" x="24" y="214" width="196" height="44" rx="10" />
          <text className="ov-badge-text mono" x="42" y="243" fontSize="18" fontWeight="600">
            97% less time
          </text>
        </g>
        <text
          className="ov-foot mono"
          x="24"
          y="288"
          fontSize="14"
          letterSpacing="0.8"
        >
          REFRESHED THROUGH THE DAY
        </text>
      </svg>
    </div>
  );
}
