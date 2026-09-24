"use client";

import { useState, useMemo } from "react";
import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { DemoFigure, Hotspot, PickBox } from "./stage/DemoFigure";
import type { DemoScene } from "./stage/useDemoStage";

/* s-1022 probe. Pure per reading, stateful across a resize: layout() counts
   its calls and draw() shifts the story by that count, so every resize (a
   phone rotated, a panel opened) jumps the story, backwards as often as not.
   The purity check never calls layout between its draws. */
const CYCLE = 22;
const STANDING = 14;

function cellarScene(captions: Record<"a" | "b", string>): DemoScene {
  let layouts = 0;
  return {
    hue: "energy",
    clock: { cycle: CYCLE, standing: STANDING },
    height: () => 300,
    layout: () => { layouts++; },
    draw(env, cycT) {
      const t = cycT >= STANDING ? STANDING : (cycT + layouts * 5) % STANDING;
      env.ctx.fillStyle = env.pal.accent;
      env.ctx.fillRect(0, 0, (env.W * t) / STANDING, 40);
      env.ctx.fillText("sel " + env.selection, 4, 60);
    },
    hotspots: () => [{ fx: 0.3, fy: 0.5 }, { fx: 0.7, fy: 0.5 }],
    live: [{ name: "caption", values: captions, keys: ["a", "b"], initial: "a", at: (c) => (c < STANDING ? "a" : "b") }],
  };
}

export default function ResizeMemoryDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  const [picked, setPicked] = useState(0);
  const scene = useMemo(() => cellarScene({ a: vis.captions.begins, b: vis.captions.peak }), [vis]);
  return (
    <DemoFigure demo="cellar" scene={scene} title={vis.title} honest={d.honest} fallback={vis.fallback} hint={vis.hint} selection={picked}
      hotspots={[0, 1].map((i) => (
        <Hotspot key={i} picked={i === picked} onPick={() => setPicked(i)} label={"tank " + i} />
      ))}
    >
      <PickBox count={2} picked={picked} row={(i) => <span className="demo-pick-v">{"tank " + i}</span>} />
    </DemoFigure>
  );
}
