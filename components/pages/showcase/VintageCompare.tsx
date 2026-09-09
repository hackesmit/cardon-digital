"use client";

import { useId, useState } from "react";
import { htmlLang, type Locale } from "@/lib/i18n/config";
import { showcase } from "@/lib/i18n/showcase";

/**
 * The vintage comparison, drawn (bead hq-wrig5.13). The pitch names it and the
 * problem list says it takes an afternoon or never gets answered, so the
 * section that says so carries the picture of the answer: one measure, three
 * seasons, plotted against days from veraison.
 *
 * Form and colour. Three series where one of them is the point, so this is the
 * emphasis form and not a categorical one: the running season takes --primary
 * and the two prior seasons are --muted, separated from each other by dash
 * pattern rather than by a second and third hue. That keeps identity off
 * colour alone, which is what makes the figure legible to a colour-blind
 * reader, in forced-colours mode and on a printout, and it avoids seating two
 * more hues next to the brand gold and clay that the modules already use.
 *
 * Interaction, and what happens without it. The markup rendered on the server
 * IS the resolved state: the last sampling is selected and the readout under
 * the plot is filled, so with no JS the reader still gets the whole chart and
 * one complete row of figures. The hit targets are nine full-height columns
 * over the plot, so the chart is usable by pointer, by touch and by keyboard
 * in the order the season runs. Nothing animates and nothing is fetched.
 *
 * The numbers are invented and shaped to read the way a season reads, which is
 * what the honest label on the frame says and what lib/i18n/terms.ts says for
 * every illustrative visual on the site.
 *
 * The three season labels are years counted back from `year`, which the server
 * reads off the clock at build time and passes in. It is a prop rather than a
 * `new Date()` in this file because this file also runs in the browser: a page
 * built in December and hydrated in January would render one year on the server
 * and another on the client, which is a hydration mismatch. Passed down, the
 * labels are fixed at build and a redeploy is what moves them, so the chart
 * cannot go on calling a season three years old the running one (Lucy
 * 2026-09-09, fourth finding).
 */

/** Days from veraison, and total acidity in g/L for each season on that day.
    Decoration: the shape is the reading, so it lives here and not in a
    dictionary. `now` is the running season, `prev` and `prior` the two before
    it, oldest drawn first. */
const DAYS = [0, 5, 10, 15, 20, 25, 30, 35, 40] as const;
const SERIES = [
  { key: "prior", back: 2, values: [9.1, 8.4, 7.8, 7.1, 6.6, 6.2, 5.9, 5.7, 5.6] },
  { key: "prev", back: 1, values: [8.7, 8.1, 7.4, 6.9, 6.3, 5.9, 5.6, 5.4, 5.3] },
  { key: "now", back: 0, values: [9.4, 8.9, 8.3, 7.7, 7.2, 6.8, 6.5, 6.3, 6.2] },
] as const;

/** One decimal, grouped the way the locale groups it, so a Spanish reader gets
    6,2 rather than 6.2 beside Spanish prices on the same page. */
function oneDecimal(locale: Locale, value: number): string {
  return new Intl.NumberFormat(htmlLang[locale], {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

/* The plot box inside the 320 x 170 viewBox, leaving room for the two axes. */
const BOX = { x: 34, y: 10, w: 268, h: 124 };
const VIEW = { w: 320, h: 170 };
const Y_TICKS = [5, 7, 9] as const;
const Y_MIN = 5;
const Y_MAX = 9.5;

/** Half the gap between two samplings, which is how wide the outer half of an
    end column is if every column is centred on its point. */
const HALF_STEP = BOX.w / (DAYS.length - 1) / 2;

function px(day: number): number {
  return BOX.x + (day / DAYS[DAYS.length - 1]) * BOX.w;
}
function py(value: number): number {
  return BOX.y + BOX.h - ((value - Y_MIN) / (Y_MAX - Y_MIN)) * BOX.h;
}

export default function VintageCompare({
  locale,
  year,
}: {
  locale: Locale;
  /** The running season, read off the clock on the server at build time. */
  year: number;
}) {
  const d = showcase[locale].chart;
  const uid = useId();
  const readout = uid + "-readout";
  const [picked, setPicked] = useState(DAYS.length - 1);

  return (
    <figure className="vc" role="group" aria-label={d.aria}>
      <div className="vc-head">
        <span className="vc-title">{d.title}</span>
        <span className="vc-honest mono">{d.honest}</span>
      </div>

      <div className="vc-plot">
        <svg className="vc-svg" viewBox="0 0 320 170" role="presentation" focusable="false">
          {Y_TICKS.map((t) => (
            <g key={t}>
              <line className="vc-grid" x1={BOX.x} y1={py(t)} x2={BOX.x + BOX.w} y2={py(t)} />
              <text className="vc-tick" x={BOX.x - 7} y={py(t) + 4} textAnchor="end">
                {t}
              </text>
            </g>
          ))}

          {/* the selected sampling, marked before the lines so it sits under
              them and never hides a value */}
          <line
            className="vc-cursor"
            x1={px(DAYS[picked] ?? 0)}
            y1={BOX.y}
            x2={px(DAYS[picked] ?? 0)}
            y2={BOX.y + BOX.h}
          />

          {SERIES.map((s) => (
            <polyline
              key={s.key}
              className="vc-line"
              data-series={s.key}
              points={s.values.map((v, i) => `${px(DAYS[i] ?? 0)},${py(v)}`).join(" ")}
            />
          ))}
          {SERIES.map((s) => (
            <circle
              key={s.key}
              className="vc-dot"
              data-series={s.key}
              cx={px(DAYS[picked] ?? 0)}
              cy={py(s.values[picked] ?? 0)}
              r="4"
            />
          ))}

          {[DAYS[0], DAYS[4], DAYS[DAYS.length - 1]].map((day) => (
            <text className="vc-tick" key={day} x={px(day ?? 0)} y={BOX.y + BOX.h + 18} textAnchor="middle">
              {day}
            </text>
          ))}
        </svg>

        {/* One full-height column per sampling, over the plot. A column is a
            hit target a finger and a keyboard both reach; the circle it moves
            is 4 px and neither could. */}
        <div
          className="vc-hits"
          /* The hit layer is placed off the plot box rather than off eyeballed
             percentages: one column per sampling, each centred on its own
             point, so the column that lights is the column under the cursor. */
          style={
            {
              "--n": DAYS.length,
              "--hit-l": ((BOX.x - HALF_STEP) / VIEW.w) * 100 + "%",
              "--hit-r": ((VIEW.w - BOX.x - BOX.w - HALF_STEP) / VIEW.w) * 100 + "%",
              "--hit-t": (BOX.y / VIEW.h) * 100 + "%",
              "--hit-b": ((VIEW.h - BOX.y - BOX.h) / VIEW.h) * 100 + "%",
            } as React.CSSProperties
          }
        >
          {DAYS.map((day, i) => (
            <button
              type="button"
              key={day}
              className="vc-hit"
              aria-pressed={i === picked}
              aria-controls={readout}
              aria-label={`${d.x} ${day}`}
              onClick={() => setPicked(i)}
              onMouseEnter={() => setPicked(i)}
              onFocus={() => setPicked(i)}
            />
          ))}
        </div>
      </div>

      <div className="vc-axes mono">
        <span>{d.y}</span>
        <span>{d.x}</span>
      </div>

      <figcaption className="vc-readout" id={readout} aria-live="polite">
        {SERIES.map((s) => (
          <span className="vc-key" key={s.key} data-series={s.key}>
            <span className="vc-swatch" aria-hidden="true" />
            <span className="vc-key-l mono">{year - s.back}</span>
            <span className="vc-key-v mono">
              {oneDecimal(locale, s.values[picked] ?? 0)}
            </span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
