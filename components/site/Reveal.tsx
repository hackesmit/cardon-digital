"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** optional stagger in ms applied as a transition delay */
  delay?: number;
};

/**
 * IntersectionObserver reveal-on-scroll wrapper. Hidden state is CSS-gated on
 * the .js class (added pre-paint), so content stays visible without JS. Under
 * prefers-reduced-motion, or without IntersectionObserver, content is shown
 * instantly.
 */
export default function Reveal({ children, className, delay }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      el.classList.add("in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={"reveal" + (className ? " " + className : "")}
      style={delay ? { transitionDelay: delay + "ms" } : undefined}
    >
      {children}
    </div>
  );
}
