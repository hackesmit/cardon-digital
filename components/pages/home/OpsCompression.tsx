"use client";

import { useEffect, useRef } from "react";
import { clamp01, easeInOut } from "./canvasKit";

/**
 * Operations visual: an hour of manual work compressing to about two minutes,
 * a 97 percent reduction. One responsive SVG whose viewBox is the MEASURED
 * container width by the composition height (set in layout() from a ResizeObserver),
 * so it fits its content at every width with no letterbox, no dead band, and no
 * twin/CSS handoff to disagree with. JS drives a calm watchable loop (~9.5s);
 * colors stay in CSS tokens (class driven) so the mode toggle recolors it with no
 * palette read here. Paused offscreen and when hidden; resolved static frame under
 * reduced motion; ASCII and English only.
 */
export default function OpsCompression() {
  const visRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const vis = visRef.current;
    const svg = svgRef.current;
    if (!vis || !svg) return;

    const pick = (id: string) => svg.querySelector<SVGElement>("#" + id);
    const tangle = pick("opsTangle");
    const clean = pick("opsClean");
    const cleanN = pick("opsCleanNodes");
    const labM = pick("opsLabManual");
    const labA = pick("opsLabAuto");
    const timeL = pick("opsTimeLong");
    const timeS = pick("opsTimeShort");
    const track = pick("opsTrack");
    const bar = pick("opsBar");
    const barG = pick("opsBarGold");
    const badge = pick("opsBadge");
    const badgeBox = pick("opsBadgeBox");
    const badgeTx = pick("opsBadgeText");
    const foot = pick("opsFoot");
    if (
      !tangle || !clean || !cleanN || !labM || !labA || !timeL || !timeS ||
      !track || !bar || !barG || !badge || !badgeBox || !badgeTx || !foot
    ) {
      return;
    }
    const svgEl = svg;
    const cleanNodes = cleanN;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;

    const set = (el: Element | null, a: string, v: string) => {
      if (el) el.setAttribute(a, v);
    };

    // ---- geometry (px space; viewBox is 0 0 W VBH so 1 unit == 1 CSS px) ----
    let W = 0;
    let barX = 0;
    let barY = 0;
    let barH = 0;
    let barMaxW = 0;
    let barMinW = 0;
    let lastP = 0;
    let lastFo = 1;

    function layout() {
      const rect = svgEl.getBoundingClientRect();
      W = Math.max(220, Math.round(rect.width));
      const m = Math.round(Math.min(24, Math.max(10, W * 0.04)));
      const left = m;
      const right = W - m;
      const innerW = right - left;
      const wide = W >= 430;

      // line-morph region (top): tangled manual pass resolving to one clean line
      const lineMid = 56;
      const amp = 22;
      const fpts: number[][] = [
        [0.0, 0.2], [0.09, 0.2], [0.09, -0.95], [0.22, -0.95], [0.31, 0.7],
        [0.31, 1.0], [0.46, 1.0], [0.58, -0.55], [0.71, -0.55], [0.8, 0.65],
        [0.9, 0.65], [1.0, -0.15],
      ];
      let d = "";
      for (let i = 0; i < fpts.length; i++) {
        const x = left + fpts[i][0] * innerW;
        const y = lineMid + fpts[i][1] * amp;
        d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
      }
      set(tangle, "d", d.trim());
      set(clean, "x1", left.toFixed(1));
      set(clean, "y1", lineMid.toFixed(1));
      set(clean, "x2", right.toFixed(1));
      set(clean, "y2", lineMid.toFixed(1));
      const nodes = cleanNodes.querySelectorAll("circle");
      const nx = [left, (left + right) / 2, right];
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].setAttribute("cx", nx[i].toFixed(1));
        nodes[i].setAttribute("cy", lineMid.toFixed(1));
      }

      // label + time row
      const labelY = 110;
      set(labM, "x", left.toFixed(1));
      set(labM, "y", labelY.toFixed(1));
      set(labA, "x", left.toFixed(1));
      set(labA, "y", labelY.toFixed(1));
      set(timeL, "x", right.toFixed(1));
      set(timeL, "y", labelY.toFixed(1));
      set(timeS, "x", right.toFixed(1));
      set(timeS, "y", labelY.toFixed(1));

      // time bar
      barX = left;
      barY = 126;
      barH = 18;
      barMaxW = innerW;
      barMinW = Math.max(46, innerW * 0.09);
      set(track, "x", barX.toFixed(1));
      set(track, "y", barY.toFixed(1));
      set(track, "width", barMaxW.toFixed(1));
      set(track, "height", barH.toFixed(1));
      set(track, "rx", (barH / 2).toFixed(1));
      for (const b of [bar, barG]) {
        set(b, "x", barX.toFixed(1));
        set(b, "y", barY.toFixed(1));
        set(b, "height", barH.toFixed(1));
        set(b, "rx", (barH / 2).toFixed(1));
      }

      // badge (persistent) + footer caption
      const badgeY = 160;
      const badgeH = 30;
      const badgeFont = 14;
      const badgeText = "97% less time";
      const badgeW = Math.round(badgeText.length * badgeFont * 0.62) + 28;
      set(badgeBox, "x", left.toFixed(1));
      set(badgeBox, "y", badgeY.toFixed(1));
      set(badgeBox, "width", badgeW.toFixed(1));
      set(badgeBox, "height", badgeH.toFixed(1));
      set(badgeTx, "x", (left + 16).toFixed(1));
      set(badgeTx, "y", (badgeY + 20).toFixed(1));

      let vbh: number;
      if (wide) {
        // footer shares the badge row, right aligned
        set(foot, "x", right.toFixed(1));
        set(foot, "y", (badgeY + 20).toFixed(1));
        set(foot, "text-anchor", "end");
        vbh = badgeY + badgeH + 14;
      } else {
        set(foot, "x", left.toFixed(1));
        set(foot, "y", (badgeY + badgeH + 24).toFixed(1));
        set(foot, "text-anchor", "start");
        vbh = badgeY + badgeH + 24 + 10;
      }
      svgEl.setAttribute("viewBox", "0 0 " + W + " " + vbh);
    }

    function apply(p: number, fo: number) {
      lastP = p;
      lastFo = fo;
      const e = easeInOut(p);
      const w = (barMaxW + (barMinW - barMaxW) * e).toFixed(1);
      set(bar, "width", w);
      set(barG, "width", w);
      set(tangle, "opacity", (1 - clamp01((p - 0.05) / 0.5)).toFixed(3));
      set(clean, "opacity", clamp01((p - 0.35) / 0.4).toFixed(3));
      set(cleanN, "opacity", clamp01((p - 0.5) / 0.32).toFixed(3));
      set(barG, "opacity", (1 - clamp01((p - 0.2) / 0.5)).toFixed(3));
      set(labM, "opacity", (1 - clamp01((p - 0.1) / 0.35)).toFixed(3));
      set(labA, "opacity", clamp01((p - 0.55) / 0.3).toFixed(3));
      set(timeL, "opacity", (1 - clamp01((p - 0.15) / 0.3)).toFixed(3));
      set(timeS, "opacity", clamp01((p - 0.6) / 0.3).toFixed(3));
      svgEl.style.opacity = fo.toFixed(3);
    }

    const resolved = () => apply(1, 1);

    // ---- calm loop ----
    const HOLD_M = 1.1;
    const COMPRESS = 4.6;
    const HOLD_A = 3.0;
    const FADE = 0.8;
    const CYCLE = HOLD_M + COMPRESS + HOLD_A + FADE;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let tt = 0;

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
      if (tt < HOLD_M) p = 0;
      else if (tt < HOLD_M + COMPRESS) p = (tt - HOLD_M) / COMPRESS;
      else p = 1;
      let fo = 1;
      const fadeStart = HOLD_M + COMPRESS + HOLD_A;
      if (tt >= fadeStart) fo = 1 - ((tt - fadeStart) / FADE) * 0.82;
      else if (tt < 0.5) fo = 0.18 + (tt / 0.5) * 0.82;
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

    let rt = 0;
    let ro: ResizeObserver | null = null;
    const relayout = () => {
      layout();
      if (!running) apply(reduced() ? 1 : lastP, reduced() ? 1 : lastFo);
    };
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        window.clearTimeout(rt);
        rt = window.setTimeout(relayout, 120);
      });
      ro.observe(vis);
    } else {
      window.addEventListener("resize", () => {
        window.clearTimeout(rt);
        rt = window.setTimeout(relayout, 120);
      });
    }

    layout();

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
        { threshold: 0.32 }
      );
      io.observe(vis);
      apply(0, 0.22);
    } else {
      onscreen = true;
      start();
    }

    document.addEventListener("visibilitychange", onVisibility);
    reduceMQ.addEventListener("change", onReduceChange);

    return () => {
      stop();
      window.clearTimeout(rt);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, []);

  return (
    <div className="vis-frame ops-vis" ref={visRef}>
      <span className="vis-tag">an hour, compressed to two minutes</span>
      {/* Default geometry is a resolved static frame (viewBox 460x204): it is
          what renders before hydration and with no JS. On mount layout()
          recomputes every coordinate from the measured width. */}
      <svg
        className="ops-svg"
        ref={svgRef}
        viewBox="0 0 460 204"
        role="img"
        aria-label="A long tangled hour of manual work compresses into one short clean two minute automated pass, a 97 percent reduction."
      >
        <path
          className="ov-tangle"
          id="opsTangle"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 56 L442 56"
          opacity="0"
        />
        <line
          className="ov-clean"
          id="opsClean"
          x1="18"
          y1="56"
          x2="442"
          y2="56"
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity="1"
        />
        <g className="ov-clean-fill" id="opsCleanNodes" opacity="1">
          <circle cx="18" cy="56" r="4" />
          <circle cx="230" cy="56" r="3.4" />
          <circle cx="442" cy="56" r="4" />
        </g>

        <text
          className="ov-lab-manual mono"
          id="opsLabManual"
          x="18"
          y="110"
          fontSize="13"
          letterSpacing="1.2"
          opacity="0"
        >
          MANUAL, EVERY WEEK
        </text>
        <text
          className="ov-lab-auto mono"
          id="opsLabAuto"
          x="18"
          y="110"
          fontSize="13"
          letterSpacing="1.2"
          opacity="1"
        >
          AUTOMATED, RUNS ITSELF
        </text>
        <text
          className="ov-time-long mono"
          id="opsTimeLong"
          x="442"
          y="110"
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
          x="442"
          y="110"
          textAnchor="end"
          fontSize="15"
          fontWeight="600"
          opacity="1"
        >
          2 min
        </text>

        <rect className="ov-track" id="opsTrack" x="18" y="126" width="424" height="18" rx="9" />
        <rect className="ov-bar-primary" id="opsBar" x="18" y="126" width="46" height="18" rx="9" />
        <rect
          className="ov-bar-gold"
          id="opsBarGold"
          x="18"
          y="126"
          width="46"
          height="18"
          rx="9"
          opacity="0"
        />

        <g id="opsBadge" opacity="1">
          <rect className="ov-badge-box" id="opsBadgeBox" x="18" y="160" width="137" height="30" rx="8" />
          <text
            className="ov-badge-text mono"
            id="opsBadgeText"
            x="34"
            y="180"
            fontSize="14"
            fontWeight="600"
          >
            97% less time
          </text>
        </g>
        <text
          className="ov-foot mono"
          id="opsFoot"
          x="442"
          y="180"
          textAnchor="end"
          fontSize="11"
          letterSpacing="1"
        >
          REFRESHED THROUGH THE DAY
        </text>
      </svg>
    </div>
  );
}
