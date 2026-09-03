"use client";

import { useEffect, useRef } from "react";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { monteXanic } from "@/lib/i18n/monte-xanic";

/**
 * Signature vineyard section map. Nine sections warm from cool green to deep
 * wine as they approach their own readiness point in the season; crossing that
 * point drops a harvest marker. A real labeled range input scrubs the slow
 * season loop, and hover/focus raises a readout plate that is clamped to stay
 * inside the stage (never clips). Paused off-screen and on hidden tab, resolved
 * to a mid-season static state under reduced motion, and repainted when the mode
 * toggle dispatches "cardon-mode".
 *
 * Faithful to the source: rAF throttled, DPR-independent (CSS-driven visuals),
 * IntersectionObserver + visibilitychange pausing, and the key fix that ripening
 * fills are applied via element.style.setProperty (inline style beats the
 * .plot-fill stylesheet rule; a plain fill attribute would not).
 */

type RGB = [number, number, number];
type Plot = { k: string; n: string; ready: number; water: number; pts: number[][] };

/* Each section carries an illustrative, section-fixed water reading (0-100). As
   accumulated heat drives ripeness, the section scores quality against Monte
   Xanic's own standard from more than one aspect: accumulated heat, that water
   reading, and the ripeness sample. Not client data. */
const PLOTS: Plot[] = [
  { k: "A1", n: "Section A1", ready: 0.5, water: 58, pts: [[180, 168], [392, 150], [398, 272], [168, 285]] },
  { k: "A2", n: "Section A2", ready: 0.7, water: 62, pts: [[392, 150], [612, 152], [618, 268], [398, 272]] },
  { k: "A3", n: "Section A3", ready: 0.9, water: 69, pts: [[612, 152], [824, 175], [838, 286], [618, 268]] },
  { k: "B1", n: "Section B1", ready: 0.36, water: 47, pts: [[168, 285], [398, 272], [405, 378], [182, 388]] },
  { k: "B2", n: "Section B2", ready: 0.56, water: 54, pts: [[398, 272], [618, 268], [612, 372], [405, 378]] },
  { k: "B3", n: "Section B3", ready: 0.8, water: 66, pts: [[618, 268], [838, 286], [828, 392], [612, 372]] },
  { k: "C1", n: "Section C1", ready: 0.28, water: 44, pts: [[182, 388], [405, 378], [410, 486], [200, 470]] },
  { k: "C2", n: "Section C2", ready: 0.44, water: 51, pts: [[405, 378], [612, 372], [600, 484], [410, 486]] },
  { k: "C3", n: "Section C3", ready: 0.62, water: 63, pts: [[612, 372], [828, 392], [812, 470], [600, 484]] },
];

const VBW = 1000;
const VBH = 560;

function centroidOf(pts: number[][]) {
  let cx = 0;
  let cy = 0;
  for (const p of pts) {
    cx += p[0];
    cy += p[1];
  }
  cx /= pts.length;
  cy /= pts.length;
  return { x: cx, y: cy, px: (cx / VBW) * 100, py: (cy / VBH) * 100 };
}

const CENTROIDS = PLOTS.map((p) => centroidOf(p.pts));

/* Flag anchor: pushed off the centered label toward the section's upper-right
   corner (top-right vertex is pts[1]) so a raised harvest flag never collides
   with the centered section label at any width or scrub position. */
const FLAG_ANCHORS = PLOTS.map((p, i) => {
  const c = CENTROIDS[i];
  const tr = p.pts[1];
  const fx = c.x + (tr[0] - c.x) * 0.62;
  const fy = c.y + (tr[1] - c.y) * 0.62;
  return { px: (fx / VBW) * 100, py: (fy / VBH) * 100 };
});

function pathD(pts: number[][]) {
  return (
    "M" +
    pts[0][0] +
    " " +
    pts[0][1] +
    pts
      .slice(1)
      .map((p) => " L" + p[0] + " " + p[1])
      .join("") +
    " Z"
  );
}

export default function VineyardMap() {
  const t = useDict(monteXanic).vis.map;
  const stageRef = useRef<HTMLDivElement | null>(null);
  const plateRef = useRef<HTMLDivElement | null>(null);
  const rangeRef = useRef<HTMLInputElement | null>(null);
  const markerEls = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    const stage = stageRef.current;
    const plate = plateRef.current;
    const range = rangeRef.current;
    if (!stage || !plate) return;

    const vpName = plate.querySelector(".vp-name");
    const vpAspects = plate.querySelector(".vp-aspects");
    const vpStatus = plate.querySelector(".vp-status");
    const vpAction = plate.querySelector(".vp-action");
    if (!vpName || !vpAspects || !vpStatus || !vpAction) return;

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;
    let dark = root.getAttribute("data-mode") !== "light";

    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const smooth = (a: number, b: number, x: number) => {
      const t = clamp01((x - a) / (b - a));
      return t * t * (3 - 2 * t);
    };
    const easeInOut = (raw: number) => {
      const t = clamp01(raw);
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    const mix = (a: RGB, b: RGB, t: number): RGB => [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ];
    const rgba = (c: RGB, a: number) =>
      "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";

    const WHITE: RGB = [255, 255, 255];
    const BLACK: RGB = [12, 12, 12];
    const RAMP = 0.32;
    const COOL: RGB = [76, 160, 126];
    const WINE: RGB = [122, 34, 51];
    const SEASON = 26;
    const HOLD = 5;
    const RESET = 2.4;
    const CYCLE = SEASON + HOLD + RESET;

    const byKey: Record<string, Plot> = {};
    const centroids: Record<string, ReturnType<typeof centroidOf>> = {};
    const gEls: Record<string, SVGGElement> = {};
    const fills: Record<string, SVGElement> = {};
    const harvested: Record<string, boolean> = {};

    PLOTS.forEach((p, i) => {
      byKey[p.k] = p;
      centroids[p.k] = CENTROIDS[i];
      harvested[p.k] = false;
      const g = stage.querySelector<SVGGElement>("#plot-" + p.k);
      if (g) {
        gEls[p.k] = g;
        const f = g.querySelector(".plot-fill");
        if (f) fills[p.k] = f as SVGElement;
      }
    });

    let s = 0;
    let clock = 0;
    let userHoldUntil = 0;
    let activeKey: string | null = null;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;

    const ripeness = (p: Plot) => smooth(p.ready - RAMP, p.ready, s);

    const STANDARD = 90;
    /* Each section scores quality against Monte Xanic's own standard from more
       than one aspect: accumulated heat (relative to this section's target),
       the section water reading, and the ripeness sample. Illustrative. */
    const readFor = (p: Plot) => {
      const r = ripeness(p);
      const heat = Math.round(clamp01(s / p.ready) * 100);
      const sample = Math.round(r * 100);
      const water = p.water;
      const quality = Math.round(0.45 * heat + 0.4 * sample + 0.15 * water);
      const aspects =
        t.heat + " " + heat + " / " + t.water + " " + water + " / " + t.sample + " " + sample;
      const score = t.quality + " " + quality + " " + t.vsStandard + " " + STANDARD;
      const action = s >= p.ready ? t.meets : t.below;
      return { aspects, score, action };
    };

    const positionPlate = (key: string) => {
      const p = byKey[key];
      if (!p) {
        plate.classList.remove("show");
        return;
      }
      const rd = readFor(p);
      vpName.textContent = t.sectionWord + " " + p.k;
      vpAspects.textContent = rd.aspects;
      vpStatus.textContent = rd.score;
      vpAction.textContent = rd.action;
      const rect = stage.getBoundingClientRect();
      const c = centroids[key];
      const px = (c.x / VBW) * rect.width;
      const py = (c.y / VBH) * rect.height;
      plate.classList.add("show");
      const pw = plate.offsetWidth;
      const ph = plate.offsetHeight;
      const half = pw / 2;
      const pad = 8;
      let left = px;
      let top = py - ph - 16;
      if (left < half + pad) left = half + pad;
      if (left > rect.width - half - pad) left = rect.width - half - pad;
      if (top < pad) top = py + 18;
      if (top + ph > rect.height - pad) top = rect.height - ph - pad;
      plate.style.left = left + "px";
      plate.style.top = top + "px";
    };

    const paint = () => {
      for (const p of PLOTS) {
        const r = ripeness(p);
        const col = mix(COOL, WINE, r);
        const f = fills[p.k];
        if (!f) continue;
        const op = dark ? 0.3 + 0.3 * r : 0.4 + 0.3 * r;
        const edge = dark ? mix(col, WHITE, 0.34) : mix(col, BLACK, 0.16);
        /* inline style beats the .plot-fill stylesheet rule (a plain fill
           attribute would not), so the ripening colors actually apply */
        f.style.setProperty("fill", rgba(col, op));
        f.style.setProperty("stroke", rgba(edge, 0.85));
        const isH = s >= p.ready;
        if (isH !== harvested[p.k]) {
          harvested[p.k] = isH;
          const m = markerEls.current[p.k];
          if (m) m.classList.toggle("on", isH);
        }
      }
      if (activeKey) positionPlate(activeKey);
    };

    const setActive = (key: string) => {
      activeKey = key;
      for (const p of PLOTS) {
        const g = gEls[p.k];
        if (g) g.classList.toggle("active", p.k === key);
      }
      positionPlate(key);
    };
    const clearActive = (key: string) => {
      if (activeKey !== key) return;
      activeKey = null;
      const g = gEls[key];
      if (g) g.classList.remove("active");
      plate.classList.remove("show");
    };

    const advance = (dt: number) => {
      if (performance.now() / 1000 < userHoldUntil) return;
      clock += dt;
      if (clock > CYCLE) clock -= CYCLE;
      if (clock < SEASON) s = clock / SEASON;
      else if (clock < SEASON + HOLD) s = 1;
      else s = 1 - easeInOut((clock - (SEASON + HOLD)) / RESET);
      if (range) range.value = String(Math.round(s * 1000));
    };

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 40) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.06) dt = 0.06;
      advance(dt);
      paint();
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

    const plotCleanups: Array<() => void> = [];
    PLOTS.forEach((p) => {
      const g = gEls[p.k];
      if (!g) return;
      const onEnter = () => setActive(p.k);
      const onLeave = () => clearActive(p.k);
      const onFocus = () => setActive(p.k);
      const onBlur = () => clearActive(p.k);
      g.addEventListener("mouseenter", onEnter);
      g.addEventListener("mouseleave", onLeave);
      g.addEventListener("focus", onFocus);
      g.addEventListener("blur", onBlur);
      plotCleanups.push(() => {
        g.removeEventListener("mouseenter", onEnter);
        g.removeEventListener("mouseleave", onLeave);
        g.removeEventListener("focus", onFocus);
        g.removeEventListener("blur", onBlur);
      });
    });

    const onRangeInput = () => {
      if (!range) return;
      s = +range.value / 1000;
      clock = s * SEASON;
      userHoldUntil = performance.now() / 1000 + 3.0;
      paint();
    };
    if (range) range.addEventListener("input", onRangeInput);

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => {
        if (activeKey) positionPlate(activeKey);
      }, 140);
    };
    window.addEventListener("resize", onResize);

    const onMode = () => {
      dark = root.getAttribute("data-mode") !== "light";
      paint();
    };
    window.addEventListener("cardon-mode", onMode);

    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible && onscreen) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let io: IntersectionObserver | null = null;
    if (reduced()) {
      s = 0.7;
      clock = s * SEASON;
      if (range) range.value = "700";
      paint();
    } else {
      paint();
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (en) => {
            onscreen = en[0].isIntersecting;
            if (onscreen && docVisible) start();
            else stop();
          },
          { threshold: 0.12 }
        );
        io.observe(stage);
      } else {
        onscreen = true;
        start();
      }
    }

    const onReduceChange = () => {
      if (reduced()) {
        stop();
        s = 0.7;
        clock = s * SEASON;
        if (range) range.value = "700";
        paint();
      } else {
        start();
      }
    };
    reduceMQ.addEventListener("change", onReduceChange);

    return () => {
      stop();
      if (io) io.disconnect();
      plotCleanups.forEach((fn) => fn());
      if (range) range.removeEventListener("input", onRangeInput);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("cardon-mode", onMode);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMQ.removeEventListener("change", onReduceChange);
      window.clearTimeout(rt);
    };
  }, []);

  return (
    <div className="vine-showcase">
      <div className="vine-stage" id="vineStage" ref={stageRef}>
        <div className="vine-legend mono">
          <span className="vine-legend-main">{t.legendMain}</span>
<span className="vine-legend-sub">{t.legendSub}</span>
        </div>
        <span className="vine-honest mono">{t.honest}</span>

        <svg
          className="vine-base"
          viewBox="0 0 1000 560"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g fill="none" strokeWidth="1.2">
            <path
              className="map-contour-a"
              d="M40 250 C 240 150, 520 140, 720 180 C 900 216, 980 320, 900 410 C 780 500, 470 500, 280 460 C 110 424, 10 340, 40 250 Z"
            />
            <path
              className="map-contour-b"
              d="M150 260 C 320 180, 540 172, 700 210 C 840 244, 900 328, 820 400 C 710 470, 470 470, 320 436 C 180 404, 100 330, 150 260 Z"
            />
          </g>
          <g fill="none" strokeWidth="1.3">
            <path
              className="map-contour-c"
              d="M250 280 C 380 216, 560 210, 660 248 C 760 286, 800 348, 720 402 C 630 456, 470 448, 380 416 C 280 380, 200 336, 250 280 Z"
            />
          </g>
        </svg>

        <svg
          className="vine-plots"
          id="vinePlots"
          viewBox="0 0 1000 560"
          preserveAspectRatio="none"
          role="group"
          aria-label={t.plotsAria}
        >
          {PLOTS.map((p) => (
            <g
              className="plot"
              id={"plot-" + p.k}
              key={p.k}
              tabIndex={0}
              role="img"
              aria-label={t.sectionWord + " " + p.k}
            >
              <path className="plot-fill" d={pathD(p.pts)} />
            </g>
          ))}
        </svg>

        <div className="vine-overlay" id="vineOverlay" aria-hidden="true">
          {PLOTS.map((p, i) => (
            <span
              className="plot-key"
              key={"key-" + p.k}
              style={{ left: CENTROIDS[i].px + "%", top: CENTROIDS[i].py + "%" }}
            >
              {p.k}
            </span>
          ))}
          {PLOTS.map((p, i) => (
            <span
              className="vine-marker"
              key={"mk-" + p.k}
              ref={(el) => {
                markerEls.current[p.k] = el;
              }}
              style={{ left: FLAG_ANCHORS[i].px + "%", top: FLAG_ANCHORS[i].py + "%" }}
            >
              <svg viewBox="0 0 24 28">
                <line
                  x1="7"
                  y1="26"
                  x2="7"
                  y2="7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path d="M7 7 L19 10.5 L7 14 Z" fill="currentColor" />
                <circle cx="7" cy="26" r="2.3" fill="currentColor" />
              </svg>
            </span>
          ))}
        </div>

        <div className="vine-plate" id="vinePlate" ref={plateRef} aria-hidden="true">
          <span className="vp-name">{t.sectionWord}</span>
          <span className="vp-aspects mono">{t.plateAspects}</span>
          <span className="vp-status">{t.plateStatus}</span>
          <span className="vp-action">{t.plateAction}</span>
        </div>

        <noscript>
          <div className="vine-fallback">{t.fallback}</div>
        </noscript>
      </div>

      <div className="season-scrub">
        <span className="ss-lab mono">{t.seasonLab}</span>
        <span className="ss-end mono">{t.early}</span>
        <input
          id="seasonRange"
          className="season-range"
          type="range"
          min="0"
          max="1000"
          defaultValue="0"
          ref={rangeRef}
          aria-label={t.rangeAria}
        />
        <span className="ss-end mono">{t.harvest}</span>
      </div>
    </div>
  );
}
