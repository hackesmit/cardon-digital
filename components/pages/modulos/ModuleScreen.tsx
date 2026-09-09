"use client";

import { useId, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { modulos } from "@/lib/i18n/modulos";

/**
 * The visual panel that sits inside every module block: what that module's
 * screen actually looks like, rather than another paragraph describing it
 * (bead hq-wrig5.13). One component, three boards, because the frame, the
 * head, the honest label and the detail strip are the same on all three and
 * only the board differs.
 *
 *   Produccion    a lot and tank board, one row per lot
 *   Hospitalidad  the master calendar, units by days, stays coloured by channel
 *   Restaurante   the table map, one shape per table, coloured by state
 *
 * Interaction, and what happens without it. The rendered markup IS the
 * resolved state: the first row, the first stay and the first table are
 * selected server-side and the detail strip is filled, so with no JS, with
 * reduced motion, or before hydration the reader gets a complete board and a
 * complete readout. Selecting another item only moves the selection; nothing
 * animates, nothing loads, and there is no network call of any kind here.
 *
 * Every value on these boards is invented and shaped to read the way a real
 * board reads. That is why each frame carries the honest label the case-study
 * visuals carry, and why the numbers live here as decoration constants rather
 * than in the dictionary: they are not copy, they are the shape of a screen.
 * The site-wide disclaimer in lib/i18n/terms.ts covers the same ground.
 */

/* ------------------------------ THE BOARDS ------------------------------ */

/** Produccion: lots in the cellar, with the tank each one sits in. Varietal
    names are proper nouns and read the same in both locales. The Brix series
    is the last six samplings of that lot, oldest first, for the sparkline. */
const LOTS = [
  { lot: "L-12", variety: "Cabernet", tank: "T4", brix: [21.4, 22.0, 22.8, 23.5, 24.0, 24.4] },
  { lot: "L-09", variety: "Nebbiolo", tank: "T2", brix: [20.8, 21.3, 21.9, 22.4, 22.9, 23.2] },
  { lot: "L-07", variety: "Merlot", tank: "T7", brix: [22.1, 22.6, 23.4, 24.1, 24.8, 25.2] },
  { lot: "L-04", variety: "Tempranillo", tank: "T1", brix: [19.6, 20.4, 21.1, 21.8, 22.3, 22.7] },
  { lot: "L-02", variety: "Chenin", tank: "T5", brix: [18.9, 19.5, 20.2, 20.8, 21.4, 21.9] },
] as const;

/** Hospitalidad: six units across a fortnight. A stay is a start day (1 based,
    into the 14 columns), a length in nights, and which channel booked it. */
const UNITS = ["U1", "U2", "U3", "U4", "U5", "U6"] as const;
const CHANNELS = ["direct", "ota1", "ota2"] as const;
type ChannelId = (typeof CHANNELS)[number];
const STAYS: { unit: number; start: number; nights: number; channel: ChannelId }[] = [
  { unit: 0, start: 1, nights: 3, channel: "direct" },
  { unit: 0, start: 6, nights: 4, channel: "ota1" },
  { unit: 1, start: 2, nights: 5, channel: "ota2" },
  { unit: 1, start: 9, nights: 3, channel: "direct" },
  { unit: 2, start: 4, nights: 2, channel: "ota1" },
  { unit: 2, start: 8, nights: 6, channel: "ota2" },
  { unit: 3, start: 1, nights: 4, channel: "ota2" },
  { unit: 3, start: 7, nights: 3, channel: "direct" },
  { unit: 4, start: 3, nights: 6, channel: "direct" },
  { unit: 4, start: 11, nights: 4, channel: "ota1" },
  { unit: 5, start: 5, nights: 3, channel: "ota1" },
  { unit: 5, start: 10, nights: 5, channel: "ota2" },
];
const CALENDAR_DAYS = 14;

/** Restaurante: a floor of nine tables on a 300 x 190 viewBox, each with its
    covers and its state. Positions are the room, not a grid. */
const TABLES = [
  { n: 1, x: 40, y: 40, r: 20, covers: 2, state: "seated" },
  { n: 2, x: 100, y: 34, r: 18, covers: 2, state: "check" },
  { n: 3, x: 158, y: 42, r: 22, covers: 4, state: "seated" },
  { n: 4, x: 224, y: 36, r: 18, covers: 2, state: "free" },
  { n: 5, x: 268, y: 78, r: 20, covers: 4, state: "seated" },
  { n: 6, x: 46, y: 104, r: 22, covers: 4, state: "free" },
  { n: 7, x: 116, y: 110, r: 26, covers: 6, state: "seated" },
  { n: 8, x: 192, y: 116, r: 20, covers: 4, state: "check" },
  { n: 9, x: 254, y: 148, r: 18, covers: 2, state: "free" },
] as const;
type TableState = (typeof TABLES)[number]["state"];

/* ------------------------------- THE FRAME ------------------------------ */

export default function ModuleScreen({
  locale,
  id,
}: {
  locale: Locale;
  /** The module this board belongs to; anything else renders nothing. */
  id: string;
}) {
  const d = modulos[locale].screens;
  const uid = useId();

  const board =
    id === "produccion" ? (
      <LotBoard locale={locale} uid={uid} />
    ) : id === "hospitalidad" ? (
      <Calendar locale={locale} uid={uid} />
    ) : id === "restaurante" ? (
      <TableMap locale={locale} uid={uid} />
    ) : null;

  if (!board) return null;

  const title = d[id as "produccion" | "hospitalidad" | "restaurante"].title;

  return (
    <figure className="mod-screen" data-module={id}>
      <div className="ms-head">
        <span className="ms-title">{title}</span>
        <span className="ms-honest mono">{d.honest}</span>
      </div>
      {board}
    </figure>
  );
}

/* ----------------------------- PRODUCCION ------------------------------- */

function LotBoard({ locale, uid }: { locale: Locale; uid: string }) {
  const d = modulos[locale].screens.produccion;
  const [picked, setPicked] = useState(0);
  const lot = LOTS[picked];
  const panel = uid + "-lot";

  return (
    <div className="ms-body ms-lots">
      <div className="ms-cols mono" aria-hidden="true">
        <span>{d.lot}</span>
        <span>{d.variety}</span>
        <span>{d.tank}</span>
        <span>{d.brix}</span>
      </div>
      <ul className="ms-rows">
        {LOTS.map((row, i) => (
          <li key={row.lot}>
            <button
              type="button"
              className="ms-row"
              aria-pressed={i === picked}
              aria-controls={panel}
              /* The column heads are a visual row and are hidden from assistive
                 technology, so without this the button reads as four unlabelled
                 tokens, "L-12 Cabernet T4 24.4", and nothing says which one is
                 the tank (Lucy 2026-09-09, second finding). */
              aria-label={`${d.lot} ${row.lot}, ${d.variety} ${row.variety}, ${d.tank} ${row.tank}, ${d.brix} ${row.brix[row.brix.length - 1]?.toFixed(1)}`}
              onClick={() => setPicked(i)}
            >
              <span className="ms-cell mono">{row.lot}</span>
              <span className="ms-cell">{row.variety}</span>
              <span className="ms-cell mono">{row.tank}</span>
              <span className="ms-cell mono ms-num">
                {row.brix[row.brix.length - 1]?.toFixed(1)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* The selected lot's last six samplings, which is the vintage curve the
          module is built to keep. Decoration: the numbers beside it carry the
          reading, so the line itself is hidden from assistive technology. */}
      <div className="ms-detail" id={panel} aria-live="polite">
        <span className="ms-detail-k mono">
          {lot.lot} · {lot.variety} · {lot.tank}
        </span>
        <Spark values={lot.brix} className="ms-spark" />
        <span className="ms-detail-v mono">
          {d.brix} {lot.brix[lot.brix.length - 1]?.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

/** A bare sparkline over any series, normalised to its own range. */
function Spark({ values, className }: { values: readonly number[]; className: string }) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 24 - ((v - lo) / span) * 20 - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg className={className} viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <polyline className="ms-spark-line" points={points} />
    </svg>
  );
}

/* ---------------------------- HOSPITALIDAD ------------------------------ */

function Calendar({ locale, uid }: { locale: Locale; uid: string }) {
  const d = modulos[locale].screens.hospitalidad;
  const [picked, setPicked] = useState(0);
  const stay = STAYS[picked];
  const panel = uid + "-stay";
  const days = Array.from({ length: CALENDAR_DAYS }, (_, i) => i + 1);

  return (
    <div className="ms-body ms-cal">
      <div className="ms-cal-grid" style={{ "--days": CALENDAR_DAYS } as React.CSSProperties}>
        {days.map((day) => (
          <span className="ms-cal-day mono" key={day} aria-hidden="true">
            {day}
          </span>
        ))}

        {UNITS.map((unit, row) => (
          <div className="ms-cal-line" key={unit}>
            <span className="ms-cal-unit mono" aria-hidden="true">
              {unit}
            </span>
            <div className="ms-cal-track">
              {STAYS.map((s, i) =>
                s.unit === row ? (
                  <button
                    type="button"
                    key={i}
                    className="ms-stay"
                    data-channel={s.channel}
                    aria-pressed={i === picked}
                    aria-controls={panel}
                    aria-label={`${unit} ${d.channels[s.channel]} ${s.nights} ${d.nights}`}
                    onClick={() => setPicked(i)}
                    style={
                      {
                        "--start": s.start,
                        "--nights": s.nights,
                        "--days": CALENDAR_DAYS,
                      } as React.CSSProperties
                    }
                  />
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="ms-detail" id={panel} aria-live="polite">
        <span className="ms-detail-k mono">{UNITS[stay.unit]}</span>
        <span className="ms-chip" data-channel={stay.channel}>
          {d.channels[stay.channel]}
        </span>
        <span className="ms-detail-v mono">
          {stay.nights} {d.nights}
        </span>
      </div>
    </div>
  );
}

/* ----------------------------- RESTAURANTE ------------------------------ */

function TableMap({ locale, uid }: { locale: Locale; uid: string }) {
  const d = modulos[locale].screens.restaurante;
  const [picked, setPicked] = useState(0);
  const table = TABLES[picked];
  const panel = uid + "-table";

  return (
    <div className="ms-body ms-map">
      {/* The hit targets are an overlay on the tables rather than a second row
          of numbered buttons under the map: the shapes are already labelled,
          the smallest of them is 36 units across a 300 unit viewBox and so
          clears the 24 px a finger needs, and picking the table you are
          looking at is what a host does. */}
      <div className="ms-map-plot">
        <svg className="ms-map-svg" viewBox="0 0 300 190" role="presentation" focusable="false">
          <rect className="ms-floor" x="6" y="6" width="288" height="178" rx="4" />
          {TABLES.map((t, i) => (
            <g key={t.n} className="ms-table" data-state={t.state} data-on={i === picked ? "1" : undefined}>
              <circle cx={t.x} cy={t.y} r={t.r} />
              <text x={t.x} y={t.y + 5} textAnchor="middle">
                {t.n}
              </text>
            </g>
          ))}
        </svg>
        {TABLES.map((t, i) => (
          <button
            type="button"
            key={t.n}
            className="ms-hit"
            aria-pressed={i === picked}
            aria-controls={panel}
            aria-label={`${d.table} ${t.n} ${d.states[t.state as TableState]}`}
            onClick={() => setPicked(i)}
            style={
              {
                "--x": (t.x / 300) * 100 + "%",
                "--y": (t.y / 190) * 100 + "%",
                "--d": Math.max(38, t.r * 2) + "px",
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="ms-detail" id={panel} aria-live="polite">
        <span className="ms-detail-k mono">
          {d.table} {table.n}
        </span>
        <span className="ms-chip" data-state={table.state}>
          {d.states[table.state as TableState]}
        </span>
        <span className="ms-detail-v mono">
          {table.covers} {d.covers}
        </span>
      </div>
    </div>
  );
}
