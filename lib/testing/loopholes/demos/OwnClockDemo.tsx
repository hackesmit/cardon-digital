"use client";

import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { DemoFigure } from "./stage/DemoFigure";
import type { DemoScene } from "./stage/useDemoStage";

/* s-2e55 variant three: the scene takes the clock's reading and replaces it.
   draw() is called once per frame, so it is a tick: the scene keeps its own
   clock in a closure, advances it per call, and uses the shared reading only
   to recognise the hold. Its story runs BACKWARDS (peak down to empty), which
   the shared clock 'only moves forward' cannot stop, because forward is a
   property of the number and the picture is whatever draw makes of it. */
const CYCLE = 20, STANDING = 12;
let mine = STANDING;
const scene: DemoScene = {
  hue: "energy",
  clock: { cycle: CYCLE, standing: STANDING },
  height: () => 200,
  layout: () => {},
  draw(env, t) {
    if (t >= STANDING && t < STANDING + 6) mine = STANDING;
    else mine = mine <= 0.05 ? STANDING - 0.05 : mine - 1 / 30;
    env.ctx.fillStyle = env.pal.accent;
    env.ctx.fillRect(0, 0, (env.W * mine) / STANDING, 30);
  },
  live: [],
};

export default function OwnClockDemo() {
  const d = useDict(demos);
  return (
    <DemoFigure demo="own" scene={scene} title="own" honest={d.honest} fallback={d.restaurante.fallback}>
      <span className="demo-caption-box mono">
        <span className="demo-caption">x</span>
        <span className="demo-caption-ghost">x</span>
      </span>
    </DemoFigure>
  );
}
