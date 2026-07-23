"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  drawFlow,
  dedupe,
  fitCanvas,
  makeTrace,
  readPalette,
  type Palette,
  type Pt,
  type Trace,
} from "./canvasKit";

/**
 * Map of sectors: quiet survey stations wired into the terrain. Base terrain
 * and routes are static SVG (so labels and links work with no JS); this canvas
 * lights the active route on hover or focus, with a rare slow ambient pulse when
 * idle. Ported from the desert-tech-v2 home sectorMap IIFE. Paused offscreen and
 * when the document is hidden; static hub only under reduced motion; palette
 * re-read on the "cardon-mode" event. Only the three built stations light a
 * route; hovering a survey station clears lighting (and never throws on an
 * unknown route, which the original could).
 */

interface Core {
  full: boolean;
}
function MarkerCore({ full }: Core) {
  return (
    <span className="marker-core" aria-hidden="true">
      <svg viewBox="0 0 44 44">
        {full && (
          <circle className="mk-sonar" cx="22" cy="22" r="10" fill="none" strokeWidth="1.4" />
        )}
        <circle
          className="mk-ring-out"
          cx="22"
          cy="22"
          r="13"
          fill="none"
          strokeWidth="1.4"
          opacity={full ? "0.85" : undefined}
        />
        <circle
          className="mk-ring-in"
          cx="22"
          cy="22"
          r="7.4"
          fill="none"
          strokeWidth={full ? "1.4" : "1.3"}
        />
        {full && (
          <>
            <line className="mk-tick" x1="22" y1="4" x2="22" y2="10" strokeWidth="1.3" />
            <line className="mk-tick" x1="22" y1="34" x2="22" y2="40" strokeWidth="1.3" />
            <line className="mk-tick" x1="4" y1="22" x2="10" y2="22" strokeWidth="1.3" />
            <line className="mk-tick" x1="34" y1="22" x2="40" y2="22" strokeWidth="1.3" />
          </>
        )}
        <circle className="mk-core" cx="22" cy="22" r={full ? "2.9" : "2.6"} />
      </svg>
    </span>
  );
}

export default function SectorMap() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas || !canvas.getContext) return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;
    let PAL: Palette = readPalette(root);

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;

    const HUB = { x: 0.5, y: 0.5 };
    const ROUTES: Record<string, { id: string; pts: number[][] }> = {
      winery: {
        id: "route-winery",
        pts: [[0.5, 0.5], [0.32, 0.5], [0.26, 0.44], [0.26, 0.38], [0.2, 0.35]],
      },
      logistics: {
        id: "route-logistics",
        pts: [[0.5, 0.5], [0.66, 0.5], [0.72, 0.44], [0.72, 0.36], [0.8, 0.3]],
      },
      hiring: {
        id: "route-hiring",
        pts: [[0.5, 0.5], [0.5, 0.6], [0.54, 0.67], [0.52, 0.74]],
      },
    };
    const keys = ["winery", "logistics", "hiring"];
    let active: string | null = null;
    const ambient: { key: string | null; L: number; at: number; aL: number } = {
      key: null,
      L: 0,
      at: 3.0,
      aL: 0,
    };

    function traceFor(key: string): Trace {
      const r = ROUTES[key];
      const pts: Pt[] = [];
      for (let i = 0; i < r.pts.length; i++) {
        pts.push({ x: r.pts[i][0] * W, y: r.pts[i][1] * H });
      }
      return makeTrace(dedupe(pts));
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const hx = HUB.x * W;
      const hy = HUB.y * H;
      const pulseHub = reduced() ? 0.5 : 0.4 + 0.28 * Math.sin(performance.now() / 900);
      ctx.globalAlpha = 0.4 + pulseHub * 0.4;
      ctx.fillStyle = PAL.primaryFaint;
      ctx.beginPath();
      ctx.arc(hx, hy, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (reduced()) return;
      if (active && ROUTES[active]) {
        drawFlow(ctx, traceFor(active), ambient.aL, PAL.energySoft, PAL.energyBright);
      } else if (ambient.key) {
        drawFlow(ctx, traceFor(ambient.key), ambient.L, PAL.primarySoft, PAL.primaryBright);
      }
    }

    /* survey sites have no canvas flow, but their dashed SVG routes still light
       via the shared .lit class, matching the approved page */
    const SURVEY_ROUTES: Record<string, string> = {
      restaurants: "route-restaurants",
      clinics: "route-clinics",
    };

    function setActive(key: string | null) {
      for (let i = 0; i < keys.length; i++) {
        const el = stage!.querySelector("#" + ROUTES[keys[i]].id);
        if (el) el.classList.toggle("lit", key === keys[i]);
      }
      for (const sk in SURVEY_ROUTES) {
        const el = stage!.querySelector("#" + SURVEY_ROUTES[sk]);
        if (el) el.classList.toggle("lit", key === sk);
      }
      active = key && ROUTES[key] ? key : null;
      ambient.aL = 0;
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      ctx = fitCanvas(canvas!, W, H);
      draw();
    }

    function frame(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 32) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      if (active && ROUTES[active]) {
        const trA = traceFor(active);
        ambient.aL += (trA.len / 1.0) * dt;
        if (ambient.aL > trA.len + 42) ambient.aL = 0;
      } else {
        ambient.at -= dt;
        if (!ambient.key && ambient.at <= 0) {
          ambient.key = keys[Math.floor(Math.random() * keys.length)];
          ambient.L = 0;
        }
        if (ambient.key) {
          const trB = traceFor(ambient.key);
          ambient.L += (trB.len / 1.7) * dt;
          if (ambient.L > trB.len + 42) {
            ambient.key = null;
            ambient.at = 3.4 + Math.random() * 2.6;
          }
        }
      }
      draw();
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

    const markers = Array.prototype.slice.call(
      stage.querySelectorAll(".map-marker")
    ) as HTMLElement[];
    const markerCleanups: Array<() => void> = [];
    markers.forEach((m) => {
      const key = m.getAttribute("data-sector") || "";
      const on = () => {
        setActive(key);
        if (!running) draw();
      };
      const off = () => {
        setActive(null);
        if (!running) draw();
      };
      m.addEventListener("mouseenter", on);
      m.addEventListener("mouseleave", off);
      m.addEventListener("focus", on);
      m.addEventListener("blur", off);
      markerCleanups.push(() => {
        m.removeEventListener("mouseenter", on);
        m.removeEventListener("mouseleave", off);
        m.removeEventListener("focus", on);
        m.removeEventListener("blur", off);
      });
    });

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 140);
    };
    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible && onscreen) start();
      else stop();
    };
    const onMode = () => {
      PAL = readPalette(root);
      draw();
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        draw();
      } else {
        start();
      }
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (en) => {
          onscreen = en[0].isIntersecting;
          if (onscreen && docVisible) start();
          else stop();
        },
        { threshold: 0.08 }
      );
      io.observe(stage);
    } else {
      onscreen = true;
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("cardon-mode", onMode);
    reduceMQ.addEventListener("change", onReduceChange);

    resize();
    if (!("IntersectionObserver" in window)) start();

    return () => {
      stop();
      if (io) io.disconnect();
      markerCleanups.forEach((fn) => fn());
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cardon-mode", onMode);
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, []);

  return (
    <>
    <div className="map-stage" ref={stageRef}>
      <span className="map-legend mono">
        Survey of terrains: three stations, two survey sites
      </span>
      <span className="map-scale mono">Baja California and the US border</span>

      <svg
        className="map-base"
        viewBox="0 0 1000 560"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="none" strokeWidth="1.2">
          <path
            className="map-contour-a"
            d="M70 300 C 250 170, 520 150, 720 210 C 900 260, 960 350, 880 430 C 760 500, 470 480, 300 440 C 130 400, 30 380, 70 300 Z"
          />
          <path
            className="map-contour-b"
            d="M170 300 C 320 210, 520 200, 680 250 C 820 292, 862 356, 800 410 C 700 466, 480 452, 350 420 C 210 388, 120 360, 170 300 Z"
          />
        </g>
        <g fill="none" strokeWidth="1.35">
          <path
            className="map-contour-c"
            d="M260 300 C 360 244, 520 240, 630 276 C 730 308, 764 356, 712 396 C 636 442, 500 430, 404 404 C 300 376, 210 348, 260 300 Z"
          />
        </g>
        <path
          id="route-winery"
          className="map-route"
          d="M500 280 L320 280 L260 246 L260 213 L200 196"
        />
        <path
          id="route-logistics"
          className="map-route"
          d="M500 280 L660 280 L720 246 L720 202 L800 168"
        />
        <path
          id="route-hiring"
          className="map-route"
          d="M500 280 L500 336 L540 375 L520 414"
        />
        <path
          id="route-restaurants"
          className="map-route survey-route"
          d="M500 280 L440 244 L440 160 L360 100"
        />
        <path
          id="route-clinics"
          className="map-route survey-route"
          d="M500 280 L590 320 L660 320 L720 347"
        />
        <circle className="map-hub-ring" cx="500" cy="280" r="6.5" strokeWidth="1.6" />
        <circle className="map-hub-core" cx="500" cy="280" r="2.4" />
      </svg>

      <canvas id="mapCanvas" ref={canvasRef} aria-hidden="true" />

      <span className="map-hub-label" aria-hidden="true">
        <svg viewBox="0 0 26 26" focusable="false">
          <line className="bm-line" x1="13" y1="20" x2="6" y2="8" strokeWidth="1.2" opacity="0.75" />
          <line className="bm-line" x1="13" y1="20" x2="20" y2="8" strokeWidth="1.2" opacity="0.75" />
          <line className="bm-line" x1="6" y1="8" x2="20" y2="8" strokeWidth="1.2" opacity="0.55" />
          <circle className="bm-ring" cx="6" cy="8" r="3" strokeWidth="1.4" />
          <circle className="bm-ring" cx="20" cy="8" r="3" strokeWidth="1.4" />
          <circle className="bm-dot" cx="13" cy="20" r="3.4" />
        </svg>
        One system
      </span>

      <Link
        className="map-marker m-left"
        id="mk-winery"
        href="/industries/winery"
        data-sector="winery"
        data-route="route-winery"
        style={{ left: "20%", top: "34%" }}
        aria-label="Winery, Valle de Guadalupe. Harvest and finances in one view. Open the winery page."
      >
        <MarkerCore full />
        <span className="marker-label">
          <span className="marker-focus">Focus terrain</span>
          <span className="marker-name">Winery / Valle de Guadalupe</span>
          <span className="marker-detail">harvest and finances, one view</span>
        </span>
      </Link>

      <Link
        className="map-case"
        href="/work/monte-xanic"
        style={{ left: "21%", top: "62%" }}
        aria-label="Read the Monte Xanic case study, from berry to bottle."
      >
        <span className="dot" aria-hidden="true" />
        <span>
          Case study: <b>Monte Xanic</b>
        </span>
      </Link>

      <Link
        className="map-case"
        href="/work/enkanto"
        style={{ left: "33%", top: "72%" }}
        aria-label="Read the Vinedo En'kanto case study, the commerce side."
      >
        <span className="dot" aria-hidden="true" />
        <span>
          Case study: <b>En&apos;kanto</b>
        </span>
      </Link>

      <Link
        className="map-marker survey"
        id="mk-restaurants"
        href="/industries/restaurants"
        data-sector="restaurants"
        data-route="route-restaurants"
        style={{ left: "36%", top: "18%" }}
        aria-label="Restaurants and hospitality. Terrain we are surveying next. Open the restaurants page."
      >
        <MarkerCore full={false} />
        <span className="marker-label">
          <span className="marker-name">Restaurants / Hospitality</span>
          <span className="marker-detail">surveying this terrain</span>
        </span>
      </Link>

      <Link
        className="map-marker survey"
        id="mk-clinics"
        href="/industries/clinics"
        data-sector="clinics"
        data-route="route-clinics"
        style={{ left: "72%", top: "62%" }}
        aria-label="Clinics and healthcare. Focus terrain: defend and recapture patient flow. Open the clinics page."
      >
        <MarkerCore full={false} />
        <span className="marker-label">
          <span className="marker-focus">Focus terrain</span>
          <span className="marker-name">Clinics / Healthcare</span>
          <span className="marker-detail">defend and recapture patient flow</span>
        </span>
      </Link>

      <Link
        className="map-marker m-right"
        id="mk-logistics"
        href="/industries/construction"
        data-sector="logistics"
        data-route="route-logistics"
        style={{ left: "80%", top: "30%" }}
        aria-label="Construction and Logistics. Field to office, one system. Open the logistics page."
      >
        <MarkerCore full />
        <span className="marker-label">
          <span className="marker-name">Construction / Logistics</span>
          <span className="marker-detail">field to office, one system</span>
        </span>
      </Link>

      <Link
        className="map-marker m-up"
        id="mk-hiring"
        href="/industries/hiring"
        data-sector="hiring"
        data-route="route-hiring"
        style={{ left: "52%", top: "72%" }}
        aria-label="Hiring and HR. From first click to hire. Open the hiring page."
      >
        <MarkerCore full />
        <span className="marker-label">
          <span className="marker-name">Hiring / HR</span>
          <span className="marker-detail">from first click to hire</span>
        </span>
      </Link>
    </div>

    {/* Portrait-native version of the map: the geographic canvas does not
        translate to a phone (labels collide), so on narrow screens we present
        the same stations and case studies as a clean vertical list. Exactly one
        of map-stage / sector-list is displayed at a time (CSS), so there is no
        duplicate content in the accessibility tree and no hidden canvas loop
        (the hidden map-stage never intersects, so its rAF never starts). */}
    <div className="sector-list" aria-label="Terrains we know">
      <span className="sl-hub mono" aria-hidden="true">
        <svg viewBox="0 0 26 26" focusable="false">
          <line className="bm-line" x1="13" y1="20" x2="6" y2="8" strokeWidth="1.2" opacity="0.75" />
          <line className="bm-line" x1="13" y1="20" x2="20" y2="8" strokeWidth="1.2" opacity="0.75" />
          <line className="bm-line" x1="6" y1="8" x2="20" y2="8" strokeWidth="1.2" opacity="0.55" />
          <circle className="bm-ring" cx="6" cy="8" r="3" strokeWidth="1.4" />
          <circle className="bm-ring" cx="20" cy="8" r="3" strokeWidth="1.4" />
          <circle className="bm-dot" cx="13" cy="20" r="3.4" />
        </svg>
        One system
      </span>

      <span className="sl-head mono">Stations built</span>

      <Link
        className="sector-card focus"
        href="/industries/winery"
        aria-label="Winery, Valle de Guadalupe. Harvest and finances in one view. Open the winery page."
      >
        <span className="sc-mark">
          <MarkerCore full />
        </span>
        <span className="sc-body">
          <span className="sc-badge">Focus terrain</span>
          <span className="sc-name">Winery / Valle de Guadalupe</span>
          <span className="sc-detail">harvest and finances, one view</span>
        </span>
      </Link>

      <div className="sl-cases">
        <Link className="sl-case" href="/work/monte-xanic" aria-label="Read the Monte Xanic case study, from berry to bottle.">
          <span className="dot" aria-hidden="true" />
          <span>Case study: <b>Monte Xanic</b></span>
        </Link>
        <Link className="sl-case" href="/work/enkanto" aria-label="Read the Vinedo En'kanto case study, the commerce side.">
          <span className="dot" aria-hidden="true" />
          <span>Case study: <b>En&apos;kanto</b></span>
        </Link>
      </div>

      <Link
        className="sector-card"
        href="/industries/construction"
        aria-label="Construction and Logistics. Field to office, one system. Open the logistics page."
      >
        <span className="sc-mark">
          <MarkerCore full />
        </span>
        <span className="sc-body">
          <span className="sc-name">Construction / Logistics</span>
          <span className="sc-detail">field to office, one system</span>
        </span>
      </Link>

      <Link
        className="sector-card"
        href="/industries/hiring"
        aria-label="Hiring and HR. From first click to hire. Open the hiring page."
      >
        <span className="sc-mark">
          <MarkerCore full />
        </span>
        <span className="sc-body">
          <span className="sc-name">Hiring / HR</span>
          <span className="sc-detail">from first click to hire</span>
        </span>
      </Link>

      <span className="sl-head mono">Survey sites</span>

      <Link
        className="sector-card survey"
        href="/industries/clinics"
        aria-label="Clinics and healthcare. Focus terrain: defend and recapture patient flow. Open the clinics page."
      >
        <span className="sc-mark">
          <MarkerCore full={false} />
        </span>
        <span className="sc-body">
          <span className="sc-badge">Focus terrain</span>
          <span className="sc-name">Clinics / Healthcare</span>
          <span className="sc-detail">defend and recapture patient flow</span>
        </span>
      </Link>

      <Link
        className="sector-card survey"
        href="/industries/restaurants"
        aria-label="Restaurants and hospitality. Terrain we are surveying next. Open the restaurants page."
      >
        <span className="sc-mark">
          <MarkerCore full={false} />
        </span>
        <span className="sc-body">
          <span className="sc-name">Restaurants / Hospitality</span>
          <span className="sc-detail">surveying this terrain</span>
        </span>
      </Link>
    </div>
    </>
  );
}
