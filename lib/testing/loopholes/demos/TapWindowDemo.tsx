"use client";

import { useMemo, useState } from "react";
import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { DemoFigure, Hotspot, PickBox } from "./stage/DemoFigure";
import type { DemoScene } from "./stage/useDemoStage";

/* Stand-in review of 077a7b4, probe 1: the scene is rebuilt per selection and
   its draw latches the FIRST reading it is shown, so a tap between four
   seconds and the hold starts the story again from that moment. The tap check
   tapped at 0 and at three seconds only, and never inside that window. */
const CYCLE = 22;
const STANDING = 14;

function windowScene(captions: Record<"a" | "b", string>): DemoScene {
  let base: number | null = null;
  return {
    hue: "energy",
    clock: { cycle: CYCLE, standing: STANDING },
    height: () => 300,
    layout: () => {},
    draw(env, cycT) {
      if (base === null) base = cycT >= 4 && cycT < STANDING ? cycT : 0;
      const u = cycT >= base ? cycT - base : cycT + CYCLE - base;
      const t = Math.min(u, STANDING);
      env.ctx.fillStyle = env.pal.accent;
      env.ctx.fillRect(0, 0, (env.W * t) / STANDING, 40);
      env.ctx.fillText("sel " + env.selection, 4, 60);
    },
    hotspots: () => [{ fx: 0.3, fy: 0.5 }, { fx: 0.7, fy: 0.5 }],
    live: [{ name: "caption", values: captions, keys: ["a", "b"], initial: "a", at: (c) => (c < STANDING ? "a" : "b") }],
  };
}

export default function TapWindowDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  const [picked, setPicked] = useState(0);
  const scene = useMemo(() => windowScene({ a: vis.captions.begins, b: vis.captions.peak }), [vis, picked]);
  return (
    <DemoFigure demo="restaurante" scene={scene} title={vis.title} honest={d.honest} fallback={vis.fallback} hint={vis.hint} selection={picked}
      hotspots={[0, 1].map((i) => (
        <Hotspot key={i} picked={i === picked} onPick={() => setPicked(i)} label={"tank " + i} />
      ))}
    >
      <PickBox count={2} picked={picked} row={(i) => <span className="demo-pick-v">{"tank " + i}</span>} />
    </DemoFigure>
  );
}
