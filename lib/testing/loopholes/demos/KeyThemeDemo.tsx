"use client";

import { useState, useEffect, useMemo } from "react";
import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { DemoFigure, Hotspot, PickBox } from "./stage/DemoFigure";
import type { DemoScene } from "./stage/useDemoStage";

/* s-1022 probe. The escape hatch the docs name is a changing key, and the
   tap check covers a key a TAP changes. This figure is keyed on the theme
   and on a window resize, 'so it repaints with the new palette': a visitor
   who toggles dark mode in the hold reads the story start again. */
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

export default function KeyThemeDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  const [picked, setPicked] = useState(0);
  const scene = useMemo(() => cellarScene({ a: vis.captions.begins, b: vis.captions.peak }), [vis]);
  const [mode, setMode] = useState(0);
  useEffect(() => {
    const on = () => setMode((m) => m + 1);
    window.addEventListener("cardon-mode", on);
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("cardon-mode", on); window.removeEventListener("resize", on); };
  }, []);
  return (
    <DemoFigure key={mode} demo="cellar" scene={scene} title={vis.title} honest={d.honest} fallback={vis.fallback} hint={vis.hint} selection={picked}
      hotspots={[0, 1].map((i) => (
        <Hotspot key={i} picked={i === picked} onPick={() => setPicked(i)} label={"tank " + i} />
      ))}
    >
      <PickBox count={2} picked={picked} row={(i) => <span className="demo-pick-v">{"tank " + i}</span>} />
    </DemoFigure>
  );
}
