"use client";

import { useMemo, useState } from "react";
import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { DemoFigure, PickBox } from "./stage/DemoFigure";
import { HOTSPOT, type DemoScene } from "./stage/useDemoStage";

/* Stand-in review of 077a7b4, probe 3: the figure is keyed on the selection,
   so every tap is a new mount and a new clock and the story starts again, the
   defect the Remounts fixture is red for. The only difference is that the
   hotspots are divs with role=button, carrying the hotspot class the noscript
   rule hides, so the checks that queried for "button" found nothing to tap and
   returned green without tapping. */
const CYCLE = 22;
const STANDING = 14;

function roleScene(captions: Record<"a" | "b", string>): DemoScene {
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

export default function RoleButtonDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  const [picked, setPicked] = useState(0);
  const scene = useMemo(() => roleScene({ a: vis.captions.begins, b: vis.captions.peak }), [vis]);
  return (
    <DemoFigure key={picked} demo="restaurante" scene={scene} title={vis.title} honest={d.honest} fallback={vis.fallback} hint={vis.hint} selection={picked}
      hotspots={[0, 1].map((i) => (
        <div
          key={i}
          role="button"
          tabIndex={0}
          aria-pressed={i === picked}
          aria-label={"tank " + i}
          className={HOTSPOT + (i === picked ? " is-picked" : "")}
          onClick={() => setPicked(i)}
        />
      ))}
    >
      <PickBox count={2} picked={picked} row={(i) => <span className="demo-pick-v">{"tank " + i}</span>} />
    </DemoFigure>
  );
}
