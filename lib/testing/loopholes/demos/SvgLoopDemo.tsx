"use client";

import { useEffect, useRef } from "react";
import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { DemoFigure } from "./stage/DemoFigure";
import type { DemoScene } from "./stage/useDemoStage";

/* s-2e55 loophole two: a demo that calls the mechanism AND animates beside
   it. The Brix curve is an SVG bar in the readout strip, driven by the demo's
   own requestAnimationFrame loop and its own clock. It never asks about
   reduced motion, the tab or the viewport, so all three gates are broken, and
   its clock restarts whenever it likes. The harness only records canvas calls
   and only watches style, class and hidden among attributes. */
const scene: DemoScene = {
  hue: "energy",
  clock: { cycle: 10, standing: 6 },
  height: () => 200,
  layout: () => {},
  draw(env, t) {
    env.ctx.fillStyle = env.pal.accent;
    env.ctx.fillRect(0, 0, (env.W * Math.min(t, 6)) / 6, 30);
  },
  live: [],
};

function Brix() {
  const bar = useRef<SVGRectElement>(null);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      bar.current?.setAttribute("width", String(((now - t0) / 40) % 200));
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <svg width="200" height="12" aria-hidden="true">
      <rect ref={bar} x="0" y="0" width="0" height="12" />
    </svg>
  );
}

export default function SvgLoopDemo() {
  const d = useDict(demos);
  return (
    <DemoFigure demo="brix" scene={scene} title="Brix" honest={d.honest} fallback={d.restaurante.fallback}>
      <span className="demo-caption-box mono">
        <span className="demo-caption">Brix</span>
        <span className="demo-caption-ghost">Brix</span>
      </span>
      <Brix />
    </DemoFigure>
  );
}
