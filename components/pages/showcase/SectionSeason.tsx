"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  fitCanvas,
  line,
  MONO,
  readDemoPalette,
  rgba,
  type DemoPalette,
} from "@/components/pages/demos/palette";
import type { Locale } from "@/lib/i18n/config";
import { showcase } from "@/lib/i18n/showcase";
import {
  ACID,
  ACID_RANGE,
  ACID_TICKS,
  BRIX,
  BRIX_RANGE,
  BRIX_TICKS,
  DAY_TICKS,
  DAYS,
  dayAt,
  fmtInt,
  fmtOne,
  HEAT_LINE,
  heatRuns,
  plan,
  responseOf,
  TEMP_RANGE,
  TEMP_TICKS,
  TMAX,
  TMIN,
  xOf,
  xRange,
  yOf,
  type Plan,
} from "./season";

/**
 * One section's season on two synced panels (bead hq-qd9jh): the fruit
 * above, the weather below, one clock. It stands where VintageCompare stood
 * in the problem section. VintageCompare.tsx stays in the tree, unrendered,
 * with its stylesheet block and its dictionary keys, because a visual on this
 * rig is rewired and never deleted.
 *
 * What it argues. The upper panel is Brix climbing with total acidity as its
 * counter-curve, the lower panel is the same section's daily high and low
 * with a heat line at 35 degrees and the area over it filled. A five day run
 * over the line is washed in the lower panel, and the wash leans to the
 * right as it crosses the gap into the upper panel, where it covers the
 * week, two days on, in which the sugar turns up and the acid turns down.
 * The lean is the lag: the eye follows the heat up and to the right into
 * the fruit and finds the curve bending there, so no caption is needed and
 * none is drawn. showcase.test.ts pins the window as a property of the
 * numbers in ./season.ts and the wash uses the same definition. The numbers
 * are invented and the frame says so.
 *
 * How it is drawn. One canvas, no animation loop, redrawn on demand: on
 * layout, on the mode toggle and when the scrub moves. Colour is read off
 * the live theme tokens through components/pages/demos/palette.ts, the way
 * the module demos read theirs, in two token hues and no invented colour:
 * the fruit in --primary, the heat in --energy. Light mode is the default
 * the site ships and the mode this was tuned in; dark is re-read on the
 * "cardon-mode" event.
 *
 * How it is worked. The stage over both panels is the one pointer target and
 * the one keyboard target. A hover, a drag, or a finger moving across either
 * panel moves the crosshair on both and the tiles beside them; touch-action
 * pan-y leaves a vertical swipe to the page. The stage is a slider to a
 * screen reader, arrow keys move it a day and Home and End jump, and its
 * aria-valuetext carries the whole reading on every step, so the tiles are
 * not a second live region (one made every step speak twice). The tiles are
 * resolved on the server for the last day of the season, so the reading is
 * complete before hydration, and with scripts off, or with no 2d context,
 * a written fallback replaces the canvas.
 *
 * Which box decides the plan. The stylesheet's container query and this
 * component both read the figure's content width against the same number
 * (PHONE_MAX), so the height the CSS reserves before the effect runs is the
 * height the plan draws, and the phone plan is chosen from the box the figure
 * actually has, whatever the viewport is doing.
 */

/** Crisp 1px strokes sit on the half pixel. */
const crisp = (v: number) => Math.round(v) + 0.5;

export default function SectionSeason({ locale }: { locale: Locale }) {
  const d = showcase[locale].season;
  const honest = showcase[locale].chart.honest;

  const figureRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [day, setDay] = useState(DAYS - 1);
  const dayRef = useRef(DAYS - 1);
  /** True when the canvas cannot draw with scripts on: no 2d context (a
      browser or privacy setting that blocks canvas), or a context lost
      after the first draw. The written season then replaces the canvas,
      the same text the noscript branch carries (lucy, round one). */
  const [noCanvas, setNoCanvas] = useState(false);
  /** Set by the canvas effect: redraw for the current day. */
  const redrawRef = useRef<(() => void) | null>(null);
  /** The plot box in stage pixels, written on every draw, read by the
      pointer so a finger maps to the day the crosshair will land on. */
  const boxRef = useRef<[number, number]>([0, 1]);

  useEffect(() => {
    const figureEl = figureRef.current;
    const stageEl = stageRef.current;
    const canvas = canvasRef.current;
    if (!figureEl || !stageEl || !canvas) return;
    if (!canvas.getContext || !canvas.getContext("2d")) {
      setNoCanvas(true);
      return;
    }

    let fruit: DemoPalette = readDemoPalette(stageEl, "primary");
    let heat: DemoPalette = readDemoPalette(stageEl, "energy");

    /* The figure's content width, which is the box the container query in
       home.css measures. clientWidth is the layout box rounded to a pixel;
       the ResizeObserver below replaces it with contentRect.width, which is
       the same box unrounded, as soon as it fires. */
    const figureWidth = () => {
      const cs = getComputedStyle(figureEl);
      return (
        figureEl.clientWidth -
        (parseFloat(cs.paddingLeft) || 0) -
        (parseFloat(cs.paddingRight) || 0)
      );
    };
    let figW = figureWidth();
    let P: Plan = plan(figW);

    const draw = () => {
      const W = canvas.clientWidth;
      if (W < 10) return;
      const H = P.height;
      const c = fitCanvas(canvas, W, H);
      const [x0, x1] = xRange(P, W);
      boxRef.current = [x0, x1];
      const day = dayRef.current;
      const F = P.fruit;
      const T = P.temp;
      const X = (dd: number) => xOf(dd, x0, x1);
      const yB = (v: number) => yOf(v, BRIX_RANGE, F.y0, F.y1);
      const yA = (v: number) => yOf(v, ACID_RANGE, F.y0, F.y1);
      const yT = (v: number) => yOf(v, TEMP_RANGE, T.y0, T.y1);
      const half = (x1 - x0) / (DAYS - 1) / 2;
      const heatY = yT(HEAT_LINE);

      c.clearRect(0, 0, W, H);
      c.font = `10px ${MONO}`;
      c.textBaseline = "middle";
      c.lineJoin = "round";
      c.lineCap = "round";

      /* the two plates, one step off the panel so they read as two panels
         of one instrument */
      c.fillStyle = rgba(fruit.textRgb, fruit.dark ? 0.05 : 0.03);
      c.fillRect(x0, F.y0, x1 - x0, F.y1 - F.y0);
      c.fillRect(x0, T.y0, x1 - x0, T.y1 - T.y0);

      /* the heat run, washed over the weather, then leaning to the right
         across the gap and into the fruit, where it covers the week the
         fruit answers in. One shape through both panels says they share a
         clock; the lean says the answer comes later. It fades as it rises,
         so the heat reads as the cause and the fruit's week as the echo. */
      const wash = c.createLinearGradient(0, T.y1, 0, F.y0);
      wash.addColorStop(0, heat.accentFaint);
      wash.addColorStop(1, rgba(heat.accentRgb, heat.dark ? 0.1 : 0.08));
      for (const run of heatRuns(TMAX, HEAT_LINE)) {
        const echo = responseOf(run);
        const l = X(run.start) - half;
        const r = X(run.end) + half;
        const el = X(echo.start) - half;
        const er = X(echo.end) + half;
        c.beginPath();
        c.moveTo(l, T.y1);
        c.lineTo(r, T.y1);
        c.lineTo(r, T.y0);
        c.lineTo(er, F.y1);
        c.lineTo(er, F.y0);
        c.lineTo(el, F.y0);
        c.lineTo(el, F.y1);
        c.lineTo(l, T.y0);
        c.closePath();
        c.fillStyle = wash;
        c.fill();
      }

      /* grids and ticks */
      c.lineWidth = 1;
      c.strokeStyle = fruit.lineSoft;
      c.fillStyle = fruit.axis;
      c.textAlign = "right";
      for (const t of BRIX_TICKS) {
        line(c, x0, crisp(yB(t)), x1, crisp(yB(t)));
        c.fillText(String(t), x0 - 7, yB(t));
      }
      c.textAlign = "left";
      c.fillStyle = fruit.muted;
      for (const t of ACID_TICKS) c.fillText(String(t), x1 + 7, yA(t));
      c.textAlign = "right";
      for (const t of TEMP_TICKS) {
        if (t === HEAT_LINE) continue;
        c.strokeStyle = fruit.lineSoft;
        c.fillStyle = fruit.axis;
        line(c, x0, crisp(yT(t)), x1, crisp(yT(t)));
        c.fillText(String(t), x0 - 7, yT(t));
      }
      /* the heat line, dashed and in the heat's own colour, with its tick */
      c.save();
      c.setLineDash([4, 4]);
      c.strokeStyle = heat.accentLine;
      line(c, x0, crisp(heatY), x1, crisp(heatY));
      c.restore();
      c.fillStyle = heat.accentInk;
      c.fillText(String(HEAT_LINE), x0 - 7, heatY);

      /* the units, over each axis */
      c.fillStyle = fruit.axis;
      c.textAlign = "right";
      c.fillText("°Bx", x0 - 7, F.y0 - 11);
      c.fillText("°C", x0 - 7, T.y0 - 11);
      c.textAlign = "left";
      c.fillStyle = fruit.muted;
      c.fillText("g/L", x1 + 7, F.y0 - 11);

      /* the day axis under the lower panel; a tick label under the day pill
         is skipped rather than half covered */
      c.textAlign = "center";
      c.fillStyle = fruit.axis;
      c.strokeStyle = fruit.line;
      for (const t of DAY_TICKS) {
        line(c, crisp(X(t)), T.y1, crisp(X(t)), T.y1 + 4);
        if (Math.abs(X(t) - X(day)) > 22) c.fillText(String(t), X(t), T.y1 + 15);
      }

      /* the temperature: the day's range as a band, the high as a line, and
         the area over the heat line filled so a run reads at a glance */
      c.beginPath();
      TMAX.forEach((v, i) => (i ? c.lineTo(X(i), yT(v)) : c.moveTo(X(i), yT(v))));
      for (let i = DAYS - 1; i >= 0; i--) c.lineTo(X(i), yT(TMIN[i] ?? 0));
      c.closePath();
      c.fillStyle = heat.accentFaint;
      c.fill();

      c.save();
      c.beginPath();
      c.rect(x0, T.y0, x1 - x0, heatY - T.y0);
      c.clip();
      c.beginPath();
      c.moveTo(X(0), heatY);
      TMAX.forEach((v, i) => c.lineTo(X(i), yT(v)));
      c.lineTo(X(DAYS - 1), heatY);
      c.closePath();
      c.fillStyle = rgba(heat.accentRgb, 0.45);
      c.fill();
      c.restore();

      c.beginPath();
      TMIN.forEach((v, i) => (i ? c.lineTo(X(i), yT(v)) : c.moveTo(X(i), yT(v))));
      c.lineWidth = 1;
      c.strokeStyle = rgba(heat.accentRgb, 0.35);
      c.stroke();

      c.beginPath();
      TMAX.forEach((v, i) => (i ? c.lineTo(X(i), yT(v)) : c.moveTo(X(i), yT(v))));
      c.lineWidth = 1.75;
      c.strokeStyle = heat.accent;
      c.stroke();

      /* the peak of each run, labelled with its own number: a value, not a
         caption */
      c.textAlign = "center";
      c.fillStyle = heat.accentInk;
      for (const run of heatRuns(TMAX, HEAT_LINE)) {
        let peak = run.start;
        for (let i = run.start; i <= run.end; i++) {
          if ((TMAX[i] ?? 0) > (TMAX[peak] ?? 0)) peak = i;
        }
        c.fillText(fmtInt(locale, TMAX[peak] ?? 0) + "°", X(peak), yT(TMAX[peak] ?? 0) - 10);
      }

      /* the fruit: acid dashed and muted under, Brix solid and in the
         module's own colour over */
      c.save();
      c.setLineDash([5, 4]);
      c.beginPath();
      ACID.forEach((v, i) => (i ? c.lineTo(X(i), yA(v)) : c.moveTo(X(i), yA(v))));
      c.lineWidth = 1.5;
      c.strokeStyle = fruit.muted;
      c.stroke();
      c.restore();

      c.beginPath();
      BRIX.forEach((v, i) => (i ? c.lineTo(X(i), yB(v)) : c.moveTo(X(i), yB(v))));
      c.lineWidth = 2.25;
      c.strokeStyle = fruit.accent;
      c.stroke();

      /* the crosshair, one line through both panels, and the day it reads */
      const cx = crisp(X(day));
      c.lineWidth = 1;
      c.strokeStyle = rgba(fruit.textRgb, 0.55);
      line(c, cx, F.y0, cx, T.y1 + 4);

      const dot = (x: number, y: number, r: number, fill: string) => {
        c.beginPath();
        c.arc(x, y, r, 0, Math.PI * 2);
        c.fillStyle = fill;
        c.fill();
        c.lineWidth = 2;
        c.strokeStyle = fruit.panel;
        c.stroke();
      };
      dot(cx, yA(ACID[day] ?? 0), 3.5, fruit.muted);
      dot(cx, yB(BRIX[day] ?? 0), 4.5, fruit.accent);
      dot(cx, yT(TMIN[day] ?? 0), 3, rgba(heat.accentRgb, 0.6));
      dot(cx, yT(TMAX[day] ?? 0), 4.5, heat.accent);

      /* the day, in a pill on the axis where the tick would be */
      const label = String(day);
      const pw = Math.max(22, c.measureText(label).width + 12);
      const py = T.y1 + 7;
      c.fillStyle = fruit.ink;
      c.beginPath();
      if (typeof c.roundRect === "function") {
        c.roundRect(cx - pw / 2, py, pw, 16, 3);
      } else {
        c.rect(cx - pw / 2, py, pw, 16);
      }
      c.fill();
      c.fillStyle = fruit.panel;
      c.textAlign = "center";
      c.font = `600 10px ${MONO}`;
      c.fillText(label, cx, py + 8);
      c.font = `10px ${MONO}`;
    };
    redrawRef.current = draw;

    const relayout = (w: number) => {
      figW = w;
      P = plan(figW);
      draw();
    };

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => relayout(figureWidth()), 140);
    };
    const onMode = () => {
      fruit = readDemoPalette(stageEl, "primary");
      heat = readDemoPalette(stageEl, "energy");
      draw();
    };

    draw();

    /* Width can change without the window resizing: a column reflowing, a
       panel opening beside it. The figure is observed because that is the
       box the plan and the container query are both decided on. */
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        const w = entry.contentRect.width;
        if (Math.abs(w - figW) < 0.5) return;
        relayout(w);
      });
      ro.observe(figureEl);
    }
    /* A lost context blanks the canvas; show the written season until the
       browser hands the context back, then draw again. */
    const onLost = () => setNoCanvas(true);
    const onRestored = () => setNoCanvas(false);
    canvas.addEventListener("contextlost", onLost);
    canvas.addEventListener("contextrestored", onRestored);
    window.addEventListener("resize", onResize);
    window.addEventListener("cardon-mode", onMode);

    return () => {
      redrawRef.current = null;
      if (ro) ro.disconnect();
      window.clearTimeout(rt);
      canvas.removeEventListener("contextlost", onLost);
      canvas.removeEventListener("contextrestored", onRestored);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("cardon-mode", onMode);
    };
  }, [locale]);

  /* Back from a lost context: the canvas is visible again, so draw into it. */
  useEffect(() => {
    if (!noCanvas) redrawRef.current?.();
  }, [noCanvas]);

  /* The scrub has to show on the canvas too, and nothing redraws it on its
     own. */
  useEffect(() => {
    dayRef.current = day;
    redrawRef.current?.();
  }, [day]);

  const pick = (next: number) => {
    const clamped = Math.max(0, Math.min(DAYS - 1, next));
    if (clamped !== dayRef.current) setDay(clamped);
  };

  const scrub = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const [x0, x1] = boxRef.current;
    pick(dayAt(e.clientX - rect.left, x0, x1));
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    scrub(e);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    /* a mouse scrubs on hover; a finger or a pen scrubs while it is down */
    if (e.pointerType === "mouse" || e.buttons > 0) scrub(e);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = {
      ArrowRight: 1,
      ArrowUp: 1,
      ArrowLeft: -1,
      ArrowDown: -1,
      PageUp: 5,
      PageDown: -5,
    };
    if (e.key === "Home") pick(0);
    else if (e.key === "End") pick(DAYS - 1);
    else if (e.key in step) pick(day + (step[e.key] ?? 0));
    else return;
    e.preventDefault();
  };

  const brix = fmtOne(locale, BRIX[day] ?? 0);
  const acid = fmtOne(locale, ACID[day] ?? 0);
  const tmax = fmtInt(locale, TMAX[day] ?? 0);
  const tmin = fmtInt(locale, TMIN[day] ?? 0);
  const hot = (TMAX[day] ?? 0) >= HEAT_LINE;
  const dayLine = d.day.replace("{n}", String(day));
  const valueText = `${dayLine}. ${d.brix} ${brix}. ${d.acid} ${acid} g/L. ${d.tmax} ${tmax} °C. ${d.tmin} ${tmin} °C.`;

  return (
    <figure className="ss" ref={figureRef} role="group" aria-label={d.aria}>
      <figcaption className="ss-head">
        <span className="ss-title">
          {d.title}
          <span className="ss-section mono">{d.section}</span>
        </span>
        <span className="ss-honest mono">{honest}</span>
      </figcaption>
      <p className="ss-lead">{d.lead}</p>

      <div className="ss-body">
        <div
          className="ss-stage"
          ref={stageRef}
          role="slider"
          tabIndex={0}
          aria-label={d.x}
          aria-valuemin={0}
          aria-valuemax={DAYS - 1}
          aria-valuenow={day}
          aria-valuetext={valueText}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onKeyDown={onKeyDown}
        >
          <canvas
            className="ss-canvas"
            ref={canvasRef}
            aria-hidden="true"
            hidden={noCanvas}
          />
          {noCanvas ? <div className="ss-fallback">{d.fallback}</div> : null}
          <noscript>
            {/* Applied only when scripting is off, the same way the module
                demos do it: with no JS the canvas is never drawn, so the
                written season below is the figure.

                The declaration is !important, not merely more specific.
                Round three scoped the selector to .pg-showcase to out-specify
                the (0,2,0) rule in home.css, and round four's review (s-6d27)
                showed that is a race nobody wins: an id selector, an element-
                plus-class selector, another !important, CSS nesting, a second
                display declaration in the same block, or the same rule in
                globals.css, modulos.css or precios.css all put the 472px canvas
                back over the written season while the guard stayed green. With
                no JavaScript the canvas is never drawn at all, so there is no
                case where it should be visible here and nothing is lost by
                making the rule unbeatable rather than merely well placed. The
                scope stays so this cannot reach a canvas on another page. */}
            <style>{".pg-showcase .ss-canvas{display:none!important}"}</style>
            <div className="ss-fallback">{d.fallback}</div>
          </noscript>
        </div>

        {/* The reading, and the legend: each tile carries the swatch of the
            line it reads. Resolved on the server for the last day, so it is
            complete before hydration and with no JS. Not a live region: the
            slider's aria-valuetext already speaks every value on each step,
            and a live rail made each step speak twice (review s-4302). */}
        <div className="ss-rail">
          <p className="ss-day mono">{dayLine}</p>
          <dl className="ss-stats">
            <div className="ss-stat" data-k="brix">
              <dt>
                <span className="ss-swatch" aria-hidden="true" />
                {d.brix}
              </dt>
              <dd className="mono">
                {brix}
                <small>{"°Bx"}</small>
              </dd>
            </div>
            <div className="ss-stat" data-k="acid">
              <dt>
                <span className="ss-swatch" aria-hidden="true" />
                {d.acid}
              </dt>
              <dd className="mono">
                {acid}
                <small>g/L</small>
              </dd>
            </div>
            <div className="ss-stat" data-k="tmax" data-hot={hot ? "true" : undefined}>
              <dt>
                <span className="ss-swatch" aria-hidden="true" />
                {d.tmax}
              </dt>
              <dd className="mono">
                {tmax}
                <small>{"°C"}</small>
              </dd>
            </div>
            <div className="ss-stat" data-k="tmin">
              <dt>
                <span className="ss-swatch" aria-hidden="true" />
                {d.tmin}
              </dt>
              <dd className="mono">
                {tmin}
                <small>{"°C"}</small>
              </dd>
            </div>
          </dl>
          <p className="ss-hint mono">{d.hint}</p>
        </div>
      </div>
    </figure>
  );
}
