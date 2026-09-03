"use client";

import { useEffect, useRef } from "react";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { winery } from "@/lib/i18n/winery";

/** Bar heights for the Brix sparkline, as a share of the plot. Decoration
 *  shaped to the illustrative reading, so it carries no dictionary strings. */
const BARS = [0.42, 0.5, 0.55, 0.66, 0.78, 0.94];

/** Which board row each exchange cites, by index into demo.rows. */
const CITED_ROW = [0, 1];

/**
 * The assistant demo: a winery dashboard beside a short transcript, with the
 * record each answer read named under the answer and the matching board row
 * marked. Self-contained, no network of any kind; every string is illustrative
 * and comes from the dictionary.
 *
 * Motion follows the house play-once idiom (see the PlayOnceVis wrappers): the
 * rendered markup IS the resolved state, so with no JS, with reduced motion,
 * or before the observer fires, the reader gets the whole exchange, still and
 * complete. On mount we set data-anim="pre", flip to "play" on scroll-in, and
 * the staged reveal is pure CSS transition-delay. Leaving view resets so it
 * replays.
 *
 * Full-range rule: this composition has no width threshold at all. The grid is
 * a repeat(auto-fit, minmax(...)) that reflows continuously and the frame
 * height is content height, so there is no width where a JS threshold and a
 * media query can disagree and no band where the layout is undesigned.
 */
export default function AssistantDemo() {
  const t = useDict(winery).assist.demo;
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    if (reduced()) return;

    el.setAttribute("data-anim", "pre");

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            en.target.setAttribute(
              "data-anim",
              en.isIntersecting ? "play" : "pre",
            );
          });
        },
        { threshold: 0.3 },
      );
      io.observe(el);
    } else {
      el.removeAttribute("data-anim");
    }

    const onReduceChange = () => {
      if (reduced()) el.removeAttribute("data-anim");
    };
    reduceMQ.addEventListener("change", onReduceChange);

    return () => {
      if (io) io.disconnect();
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, []);

  // One shared counter so the board, the questions and the answers reveal in
  // the order a reader would follow them.
  let step = 0;

  return (
    <div className="assist-demo" ref={ref} role="img" aria-label={t.aria}>
      <div className="ad-board">
        <div className="ad-board-head">
          <span className="ad-board-title">{t.boardTitle}</span>
          <span className="ad-live mono">{t.live}</span>
        </div>

        <div className="ad-chart">
          <span className="ad-chart-k mono">{t.chartK}</span>
          <div className="ad-bars" aria-hidden="true">
            {BARS.map((h, i) => (
              <span
                className="ad-bar"
                key={i}
                style={{ "--h": h, "--i": i } as React.CSSProperties}
              />
            ))}
          </div>
          <span className="ad-chart-v">{t.chartV}</span>
        </div>

        <ul className="ad-rows">
          {t.rows.map((row, i) => (
            <li
              className={"ad-row" + (CITED_ROW.includes(i) ? " ad-row-cited" : "")}
              key={row.k}
              style={
                { "--i": CITED_ROW.indexOf(i) } as React.CSSProperties
              }
            >
              <span className="ad-row-k">{row.k}</span>
              <span className="ad-row-v mono">{row.v}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="ad-chat">
        <p className="ad-label mono">{t.label}</p>
        {t.turns.map((turn, ti) => (
          <div className="ad-exchange" key={turn.q}>
            <p
              className="ad-turn ad-q"
              style={{ "--i": step++ } as React.CSSProperties}
            >
              {turn.q}
            </p>
            <div
              className="ad-turn ad-a"
              style={{ "--i": step++ } as React.CSSProperties}
            >
              {turn.a.map((linetext) => (
                <p className="ad-a-line" key={linetext}>
                  {linetext}
                </p>
              ))}
              <p className="ad-cite">
                <span className="ad-cite-k mono">{t.citeK}</span>
                <span className="ad-cite-v">{turn.cite}</span>
              </p>
            </div>
            {ti < t.turns.length - 1 ? <span className="ad-rule" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
