"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { DemoFigure, Hotspot, PickBox } from "./stage/DemoFigure";
import type { DemoScene } from "./stage/useDemoStage";

/* s-1022 loophole five. 'Anything that moves is either drawn by draw or is
   a live text. There is no third way' (docs section 1), and the stillness
   check judges 'the whole page'. It judges what jsdom can see: frames asked
   for, timers, canvas calls, mutations, scroll setters. Motion the BROWSER
   runs from a declaration is none of those: an SMIL <animate> in the readout
   and a Web Animation on a wrapper. Both run under prefers-reduced-motion,
   in a hidden tab's layout and off screen, and the lawful scene beside them
   keeps every check green. */
const CYCLE = 22;
const STANDING = 14;

function cellarScene(captions: Record<"a" | "b", string>): DemoScene {
  return {
    hue: "energy",
    clock: { cycle: CYCLE, standing: STANDING },
    height: () => 300,
    layout: () => {},
    draw(env, cycT) {
      const t = Math.min(cycT, STANDING);
      env.ctx.fillStyle = env.pal.accent;
      env.ctx.fillRect(0, 0, (env.W * t) / STANDING, 40);
      env.ctx.fillText("sel " + env.selection, 4, 60);
    },
    hotspots: () => [{ fx: 0.3, fy: 0.5 }, { fx: 0.7, fy: 0.5 }],
    live: [{ name: "caption", values: captions, keys: ["a", "b"], initial: "a", at: (c) => (c < STANDING ? "a" : "b") }],
  };
}

export default function SmilDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  const [picked, setPicked] = useState(0);
  const scene = useMemo(() => cellarScene({ a: vis.captions.begins, b: vis.captions.peak }), [vis]);
  const dot = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    /* Web Animations: not a frame request, not a timer, not a mutation, and
       the site-wide 'animation: none !important' under reduce does not reach
       it, because it is not a CSS animation. jsdom has no animate(), hence
       the guard, which is also what a careful author writes. */
    const a = dot.current?.animate?.(
      [{ transform: "translateX(0)" }, { transform: "translateX(40px)" }],
      { duration: 600, iterations: Infinity, direction: "alternate" },
    );
    return () => a?.cancel();
  }, []);
  return (
    <DemoFigure demo="cellar" scene={scene} title={vis.title} honest={d.honest} fallback={vis.fallback} hint={vis.hint} selection={picked}
      hotspots={[0, 1].map((i) => (
        <Hotspot key={i} picked={i === picked} onPick={() => setPicked(i)} label={"tank " + i} />
      ))}
    >
      <PickBox count={2} picked={picked} row={(i) => <span className="demo-pick-v">{"tank " + i}</span>} />
      <span ref={dot} className="demo-pick-v" style={{ display: "inline-block" }} data-probe="waapi">
        <svg width="120" height="8" aria-hidden="true">
          <rect data-probe="smil" x="0" y="0" width="10" height="8" fill="currentColor">
            <animate attributeName="width" from="10" to="120" dur="1s" repeatCount="indefinite" />
          </rect>
        </svg>
      </span>
    </DemoFigure>
  );
}
