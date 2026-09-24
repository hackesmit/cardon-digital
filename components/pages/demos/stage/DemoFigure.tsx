"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { HOTSPOT, useDemoStage, type DemoScene } from "./useDemoStage";
import "../demos.css";

/**
 * The frame every module demo is drawn in (bead hq-3pfhe.7).
 *
 * A demo renders <DemoFigure> and hands it a scene. The markup that the
 * contract is about is all here, so a demo cannot get it wrong by copying it:
 *
 *   - the honest label, which is not a prop a demo can leave out;
 *   - the canvas and the <noscript> that replaces it. What that block hides
 *     is built from HIDDEN_WITHOUT_SCRIPT below, and the things it names are
 *     rendered by this file and by <Hotspot>, so the list and the elements
 *     cannot be renamed apart. The s-5836 loophole demo called its buttons
 *     cl-btn and its hint cl-hint, and twelve hotspots and an instruction to
 *     tap them stayed on a page where nothing could be tapped;
 *   - the ghost boxes. Every value the loop writes (scene.live) and every
 *     readout the visitor changes (<PickBox>) is rendered once live and once
 *     per possible value, invisibly, in one grid cell, so nothing that changes
 *     can change the size of its box;
 *   - the stylesheet import. Round one shipped demos.css with no importer and
 *     all twelve hotspots landed off a 300px canvas.
 */

/** What the noscript rule hides: the board that will never be drawn, every
    hotspot, and the hint that tells the visitor to use them. */
const HIDDEN_WITHOUT_SCRIPT = [".demo-canvas", "." + HOTSPOT, ".demo-hint"];

export interface DemoFigureProps {
  /** data-demo, and nothing else: the hue comes from the scene. */
  demo: string;
  scene: DemoScene;
  /** The head's left side. The honest label is the right side, always. */
  title: ReactNode;
  /** "illustrative view, not client data", from the dictionary's root. */
  honest: string;
  /** The written description that is the whole figure with scripting off. */
  fallback: string;
  /** The sentence that tells the visitor the board can be operated. */
  hint?: string;
  /** Which hotspot is selected; the board redraws when it changes. */
  selection?: number;
  /** <Hotspot> elements, in the order scene.hotspots() returns positions. */
  hotspots?: ReactNode;
  /** The readout strip's own content, above the loop's captions. */
  children?: ReactNode;
}

export function DemoFigure(props: DemoFigureProps) {
  const { scene } = props;
  const figure = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef(new Map<string, HTMLElement>());
  useDemoStage(scene, { figure, stage, canvas, live }, props.selection ?? -1);

  return (
    <figure className="demo-figure" data-demo={props.demo} ref={figure}>
      <figcaption className="demo-head">
        <span className="demo-title">{props.title}</span>
        <span className="demo-honest mono">{props.honest}</span>
      </figcaption>

      <div className="demo-stage" ref={stage}>
        <canvas className="demo-canvas" ref={canvas} aria-hidden="true" />
        {props.hotspots}
        <noscript>
          {/* Applied only when scripting is off: the parser treats noscript
              content as markup then and as text otherwise. With no JS the
              board is never drawn and the hotspots never answer, so the
              written description is the whole figure rather than a caption
              under an empty canvas. */}
          <style>{HIDDEN_WITHOUT_SCRIPT.join(",") + "{display:none}"}</style>
          <div className="demo-fallback">{props.fallback}</div>
        </noscript>
      </div>

      {/* The readout strip. It is resolved from the first render, so it is
          complete with no JS at all. */}
      <div className="demo-readout">
        {props.children}
        {scene.live.map((text) => (
          <span className="demo-caption-box mono" aria-hidden="true" key={text.name}>
            <span
              className="demo-caption"
              ref={(el) => {
                if (el) live.current.set(text.name, el);
                else live.current.delete(text.name);
              }}
            >
              {text.values[text.initial]}
            </span>
            {text.keys.map((k) => (
              <span className="demo-caption-ghost" key={k}>
                {text.values[k]}
              </span>
            ))}
          </span>
        ))}
      </div>
      {props.hint ? <p className="demo-hint mono">{props.hint}</p> : null}
    </figure>
  );
}

export interface HotspotProps {
  picked: boolean;
  onPick(): void;
  label: string;
  /** The pre-hydration position. The stage corrects it from the scene's
      geometry on the first layout. */
  style?: CSSProperties;
  children?: ReactNode;
}

/** A place on the board the visitor can choose. The only button a demo puts
    on its stage, so the noscript rule above reaches every one of them. */
export function Hotspot(props: HotspotProps) {
  return (
    <button
      type="button"
      className={HOTSPOT + (props.picked ? " is-picked" : "")}
      aria-pressed={props.picked}
      style={props.style}
      aria-label={props.label}
      onClick={props.onPick}
    >
      {props.children}
    </button>
  );
}

export interface PickBoxProps {
  /** How many readouts there are. */
  count: number;
  picked: number;
  /** The content of readout `i`, the same for the live row and its ghost. */
  row(i: number): ReactNode;
}

/**
 * The selection readout, in a box held open by every readout at once: the
 * live row plus a ghost for EVERY readout including the selected one, because
 * a ghost set that changed with the selection would put the selection back
 * into the box's size. One table name wraps where the others do not, and
 * without this the figure grew 31px on that tap and shrank on the next.
 *
 * The live row is the aria-live region and the ghosts are out of the
 * accessibility tree, so nothing is announced twice. Both come from `row`, so
 * a ghost cannot be styled apart from the value it reserves room for.
 */
export function PickBox(props: PickBoxProps) {
  const one = (i: number, ghost: boolean) => (
    <p
      key={ghost ? "ghost-" + i : "live"}
      className={"demo-pick" + (ghost ? " demo-pick-ghost" : "")}
      aria-live={ghost ? undefined : "polite"}
      aria-hidden={ghost ? true : undefined}
    >
      {props.row(i)}
    </p>
  );
  return (
    <div className="demo-pick-box">
      {one(props.picked, false)}
      {Array.from({ length: props.count }, (_, i) => one(i, true))}
    </div>
  );
}
