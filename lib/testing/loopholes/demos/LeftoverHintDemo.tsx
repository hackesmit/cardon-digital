"use client";

import { useMemo, useState } from "react";
import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { DemoFigure, Hotspot, PickBox } from "./stage/DemoFigure";
import type { DemoScene } from "./stage/useDemoStage";

/* Stand-in review of 077a7b4, probe 4: the sentence that tells the visitor to
   tap is rendered by the demo itself, as a paragraph with an inline <b> beside
   the words, so it is neither a leaf nor a whole text equal to the dictionary's
   hint. The frame's noscript rule hides .demo-hint and knows nothing of this
   one, so with scripting off the instruction stays on a page where nothing can
   be tapped. */
const CYCLE = 22;
const STANDING = 14;

function plainScene(captions: Record<"a" | "b", string>): DemoScene {
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

export default function LeftoverHintDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  const [picked, setPicked] = useState(0);
  const scene = useMemo(() => plainScene({ a: vis.captions.begins, b: vis.captions.peak }), [vis]);
  return (
    <DemoFigure demo="restaurante" scene={scene} title={vis.title} honest={d.honest} fallback={vis.fallback} selection={picked}
      hotspots={[0, 1].map((i) => (
        <Hotspot key={i} picked={i === picked} onPick={() => setPicked(i)} label={"tank " + i} />
      ))}
    >
      <PickBox count={2} picked={picked} row={(i) => <span className="demo-pick-v">{"tank " + i}</span>} />
      <p className="demo-note">
        {vis.hint} <b>1-2</b>
      </p>
    </DemoFigure>
  );
}
