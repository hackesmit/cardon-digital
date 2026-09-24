"use client";

import { useEffect, useState, useMemo } from "react";
import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { DemoFigure, Hotspot, PickBox } from "./stage/DemoFigure";
import type { DemoScene } from "./stage/useDemoStage";

/* s-1ed1, from the cross-vendor review of the s-1022 fix round. Feature
   detection at the top of the file: true in every browser, and false under
   jsdom for as long as the harness only supplied animate() once a World was
   installed, so the branch below was dead under test and live in production. */
const canAnimate = typeof Element !== "undefined" && "animate" in Element.prototype;

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

export default function FeatureDetectDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  const [picked, setPicked] = useState(0);
  useEffect(() => {
    if (!canAnimate) return;
    const a = document.querySelector(".demo-readout")?.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 900, iterations: Infinity });
    return () => a?.cancel();
  }, []);
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
