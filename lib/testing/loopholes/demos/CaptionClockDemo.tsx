"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { demos } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { observeOnscreen } from "./motion";
import { DemoFigure, Hotspot, PickBox } from "./stage/DemoFigure";
import type { DemoScene } from "./stage/useDemoStage";

/* Stand-in review of 077a7b4, probe 2: a clock of the demo's own, honouring
   all three gates, writes the caption between the two values the ghosts
   reserve room for on its own schedule, so the words run backwards against the
   picture. No frame asked for, no attribute, no canvas call: only text inside
   a ghost box, holding a reserved value, which the write check accepted. */
const CYCLE = 22;
const STANDING = 14;

function captionScene(captions: Record<"a" | "b", string>): DemoScene {
  return {
    hue: "energy",
    clock: { cycle: CYCLE, standing: STANDING },
    height: () => 300,
    layout: () => {},
    draw(env, cycT) {
      const t = Math.min(cycT, STANDING);
      env.ctx.fillStyle = env.pal.accent;
      env.ctx.fillRect(0, 0, (env.W * t) / STANDING, 40);
    },
    hotspots: () => [{ fx: 0.3, fy: 0.5 }, { fx: 0.7, fy: 0.5 }],
    live: [{ name: "caption", values: captions, keys: ["a", "b"], initial: "a", at: (c) => (c < STANDING ? "a" : "b") }],
  };
}

function OwnClock({ words }: { words: string[] }) {
  const anchor = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const fig = anchor.current!.closest("figure")!;
    let on = false;
    const stop = observeOnscreen(fig, (v) => (on = v));
    let n = 0;
    const id = window.setInterval(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (document.hidden || !on) return;
      const cap = fig.querySelector(".demo-caption");
      n++;
      if (cap) cap.textContent = words[(n >> 1) % 2 === 0 ? 1 : 0];
    }, 400);
    return () => {
      stop();
      window.clearInterval(id);
    };
  }, [words]);
  return <span ref={anchor} />;
}

export default function CaptionClockDemo() {
  const d = useDict(demos);
  const vis = d.restaurante;
  const [picked, setPicked] = useState(0);
  const scene = useMemo(() => captionScene({ a: vis.captions.begins, b: vis.captions.peak }), [vis]);
  const words = useMemo(() => [vis.captions.begins, vis.captions.peak], [vis]);
  return (
    <DemoFigure demo="restaurante" scene={scene} title={vis.title} honest={d.honest} fallback={vis.fallback} hint={vis.hint} selection={picked}
      hotspots={[0, 1].map((i) => (
        <Hotspot key={i} picked={i === picked} onPick={() => setPicked(i)} label={"tank " + i} />
      ))}
    >
      <PickBox count={2} picked={picked} row={(i) => <span className="demo-pick-v">{"tank " + i}</span>} />
      <OwnClock words={words} />
    </DemoFigure>
  );
}
