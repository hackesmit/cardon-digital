"use client";
import { useEffect, useRef } from "react";
import { observeOnscreen } from "./motion";
import "./demos.css";

/* s-4a6c loophole fixture: an aliased constructor the AST guard cannot name,
   reading isIntersecting behind a threshold array, which docs/demos.md rule 3
   calls a bug under every reading of the spec. */
export default function HospitalidadDemo() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const IO = window.IntersectionObserver;
    const io = new IO((es) => { el.dataset.on = String(es[es.length - 1].isIntersecting); }, { threshold: [0, 0.35] });
    io.observe(el);
    const un = observeOnscreen(el, () => {});
    return () => { io.disconnect(); un(); };
  }, []);
  return <figure className="demo-figure" ref={ref} />;
}
