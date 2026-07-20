"use client";

/* Decode-on-arrival text. Renders the final string on the server so the
   content is real without JS; scrambles only with JS + motion allowed. */

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&/=+";

export default function ScrambleText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const running = useRef(false);
  const [out, setOut] = useState(text);

  const play = () => {
    if (running.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;
    const start = performance.now();
    const dur = 1000;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const solved = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        s +=
          ch === " " || i < solved
            ? ch
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setOut(text);
        running.current = false;
      }
    };
    requestAnimationFrame(tick);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es[0]?.isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className={className} aria-label={text} onPointerEnter={play}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
