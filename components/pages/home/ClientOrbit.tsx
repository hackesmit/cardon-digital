"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { localePath } from "@/lib/i18n/config";
import { home } from "@/lib/i18n/home";
import { clearsThreshold } from "@/lib/onscreen";
import { fitCanvas, readPalette, rgba, type Palette } from "./canvasKit";
import { CLIENT_MARKS, CLIENT_ORDER, type ClientId } from "./clientMarks";

/**
 * The client orbit (bead hq-1cct): the five businesses that run on what we
 * built, turning slowly on an ellipse around the one action, with an empty
 * seat on the ring for the next one. Replaces the valley map, which lost its
 * stations when the site narrowed to three services.
 *
 * The medallions are real links (the two with case pages) or buttons (the
 * rest), placed each frame by transform; the canvas under them draws the
 * rings, a fading trail behind each medallion, the route from each to the
 * centre, and a soft pulse at the centre. Hover or focus on a client eases the
 * orbit to a stop, lights its route in clay and reads its one-line result in
 * the caption below the stage. Front of the ellipse is drawn larger than the
 * back for depth.
 *
 * Pointer, keyboard and touch each have their own state: hover, focus and a
 * click-pinned client, and the active one is focus, then hover, then pinned,
 * so leaving with the mouse never cancels a focus and a tap on a medallion
 * with no case page keeps its caption up (aria-pressed says so). A persistent
 * pause control sits in the stage corner, because motion that runs for more
 * than five seconds needs one a visitor can operate (WCAG 2.2.2); it starts
 * paused when the visitor asked for reduced motion. Redraws after any state
 * change come from an effect, not from the event, so a still frame is never
 * one update behind.
 *
 * Runs only on screen and while the document is visible (clearsThreshold, the
 * repo's on-screen rule), stops when paused or under reduced motion with a
 * still frame drawn once, re-reads the palette on the cardon-mode event, and
 * refits on resize. Colour comes from readPalette only: the wine for strokes
 * and the icon, the text tier for anything that reads.
 */

/* The two clients with a case page, as parallel arrays so app/routes.test.ts
   can read the paths (it audits every link call against the routes on disk). */
const CASE_IDS: ClientId[] = ["xanic", "enkanto"];
const CASE_ROUTES = ["/work/monte-xanic", "/work/enkanto"];
const routeFor = (id: ClientId): string | undefined => {
  const i = CASE_IDS.indexOf(id);
  return i >= 0 ? CASE_ROUTES[i] : undefined;
};

export default function ClientOrbit() {
  const locale = useLocale();
  const t = home[locale].vis.orbit;
  const href = (path: string) => localePath(locale, path);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const meds = useRef<Partial<Record<ClientId, HTMLElement | null>>>({});
  const names = useRef<Partial<Record<ClientId, HTMLElement | null>>>({});
  const seatRef = useRef<HTMLDivElement | null>(null);
  const [hoverId, setHoverId] = useState<ClientId | null>(null);
  const [focusId, setFocusId] = useState<ClientId | null>(null);
  const [pinnedId, setPinnedId] = useState<ClientId | null>(null);
  const [paused, setPaused] = useState(false);
  const active: ClientId | null = focusId ?? hoverId ?? pinnedId;
  const activeRef = useRef<ClientId | null>(null);
  const pausedRef = useRef(false);
  /* The loop's draw and start/stop, exposed to the state effect below. */
  const loopRef = useRef<{ draw: () => void; sync: () => void } | null>(null);
  activeRef.current = active;
  pausedRef.current = paused;

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas || !canvas.getContext) return;
    let ctx = canvas.getContext("2d");
    if (!ctx) return;

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;
    let PAL: Palette = readPalette(root);

    let W = 0;
    let H = 0;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let t = 0;
    let speed = 1;
    if (reduced()) setPaused(true);
    const SEATS = CLIENT_ORDER.length + 1;
    const OMEGA = (Math.PI * 2) / 46;

    function geometry() {
      const cx = W / 2;
      const cy = H / 2 - 4;
      const rx = Math.min(420, W * 0.38);
      const ry = Math.min(160, H * 0.33);
      return { cx, cy, rx, ry };
    }

    function place(el: HTMLElement | null | undefined, x: number, y: number, s: number, z: number) {
      if (!el) return;
      el.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")";
      el.style.zIndex = String(z);
    }

    function draw(dt: number) {
      if (!ctx) return;
      const hovered = activeRef.current;
      const target = hovered ? 0 : 1;
      speed += (target - speed) * Math.min(1, dt * 4);
      t += dt * speed;
      const { cx, cy, rx, ry } = geometry();
      const still = reduced() || pausedRef.current;
      ctx.clearRect(0, 0, W, H);

      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(PAL.primaryRgb, 0.13);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx + 70, ry + 26, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(20, rx - 150), Math.max(12, ry - 56), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([3, 7]);
      ctx.strokeStyle = rgba(PAL.primaryRgb, 0.26);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const pulse = still ? 0.5 : 0.5 + 0.5 * Math.sin(t * 1.6);
      const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120 + 20 * pulse);
      glow.addColorStop(0, rgba(PAL.energyRgb, 0.16 + 0.06 * pulse));
      glow.addColorStop(1, rgba(PAL.energyRgb, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < SEATS; i++) {
        const a = t * OMEGA + i * ((Math.PI * 2) / SEATS) + Math.PI * 0.62;
        const bob = still ? 0 : 3 * Math.sin(t * 1.3 + i);
        const x = cx + rx * Math.cos(a);
        const y = cy + ry * Math.sin(a) + bob;
        const depth = (Math.sin(a) + 1) / 2;
        const s = 0.78 + 0.34 * depth;
        const id = i < CLIENT_ORDER.length ? CLIENT_ORDER[i] : null;
        const lit = id !== null && id === hovered;

        ctx.lineWidth = lit ? 1.6 : 1;
        ctx.strokeStyle = lit ? rgba(PAL.energyRgb, 0.9) : rgba(PAL.primaryRgb, 0.14 + 0.16 * depth);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        if (id && !still) {
          const trail = ctx.createLinearGradient(
            cx + rx * Math.cos(a - 0.5),
            cy + ry * Math.sin(a - 0.5),
            x,
            y
          );
          trail.addColorStop(0, rgba(PAL.primaryRgb, 0));
          trail.addColorStop(1, rgba(PAL.primaryRgb, 0.25 + 0.35 * depth));
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2 * s;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, a - 0.5, a);
          ctx.stroke();
        }

        const z = Math.round(10 + depth * 10);
        if (id) {
          place(meds.current[id], x, y, s, z);
          const n = names.current[id];
          if (n) {
            n.style.transform = "translate(" + x + "px," + (y + 36 * s) + "px) translateX(-50%)";
            n.style.opacity = String(Math.min(1, 0.35 + 0.65 * s));
          }
        } else {
          place(seatRef.current, x, y, s, z);
        }
      }
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      ctx = fitCanvas(canvas!, W, H);
      draw(0);
    }

    function frame(now: number) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.05) dt = 0.05;
      draw(dt);
    }
    const canRun = () => !reduced() && !pausedRef.current && docVisible && onscreen;
    function start() {
      if (running || !canRun()) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }

    /* The state effect below calls these after React has applied a change, so
       a still frame (paused, reduced motion, or before the observer fires)
       shows the new active route, and pause/resume starts or stops the loop. */
    loopRef.current = {
      draw: () => {
        if (!running) draw(0);
      },
      sync: () => {
        if (canRun()) start();
        else {
          stop();
          draw(0);
        }
      },
    };

    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(resize, 140);
    };
    const onVisibility = () => {
      docVisible = !document.hidden;
      if (docVisible && onscreen) start();
      else stop();
    };
    const onMode = () => {
      PAL = readPalette(root);
      draw(0);
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        draw(0);
      } else {
        start();
      }
    };

    const THRESHOLD = 0.08;
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          onscreen = clearsThreshold(entries[0], THRESHOLD);
          if (onscreen && docVisible) start();
          else stop();
        },
        { threshold: THRESHOLD }
      );
      io.observe(stage);
    } else {
      onscreen = true;
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("cardon-mode", onMode);
    reduceMQ.addEventListener("change", onReduceChange);

    resize();
    if (!("IntersectionObserver" in window)) start();

    return () => {
      stop();
      loopRef.current = null;
      if (io) io.disconnect();
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cardon-mode", onMode);
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, []);

  /* After every change of the active client or the pause state, one redraw
     (or a start/stop), with the refs already pointing at the new values. */
  useEffect(() => {
    loopRef.current?.draw();
  }, [active]);
  useEffect(() => {
    loopRef.current?.sync();
  }, [paused]);

  const current = active ? t.clients[active] : null;

  return (
    <>
      <div className="orbit-stage" ref={stageRef} aria-label={t.aria}>
        <span className="orbit-legend mono">{t.legend}</span>
        <canvas className="orbit-canvas" ref={canvasRef} aria-hidden="true" />
        {CLIENT_ORDER.map((id) => {
          const c = t.clients[id];
          const route = routeFor(id);
          const shared = {
            className: "orbit-med" + (active === id ? " lit" : ""),
            "aria-label": c.aria,
            onMouseEnter: () => setHoverId(id),
            onMouseLeave: () => setHoverId((h) => (h === id ? null : h)),
            onFocus: () => setFocusId(id),
            onBlur: () => setFocusId((f) => (f === id ? null : f)),
          };
          return (
            <span key={id} style={{ display: "contents" }}>
              {route ? (
                <Link
                  href={href(route)}
                  {...shared}
                  ref={(el) => {
                    meds.current[id] = el;
                  }}
                >
                  {CLIENT_MARKS[id]}
                </Link>
              ) : (
                <button
                  type="button"
                  aria-pressed={pinnedId === id}
                  onClick={() => setPinnedId((p) => (p === id ? null : id))}
                  {...shared}
                  ref={(el) => {
                    meds.current[id] = el;
                  }}
                >
                  {CLIENT_MARKS[id]}
                </button>
              )}
              <span
                className="orbit-name"
                aria-hidden="true"
                ref={(el) => {
                  names.current[id] = el;
                }}
              >
                <b>{c.name}</b>
                <span>{c.kind}</span>
              </span>
            </span>
          );
        })}
        <div className="orbit-seat" ref={seatRef} aria-hidden="true">
          +
        </div>
        <div className="orbit-core">
          <Link className="cta" href={href("/contacto")} aria-describedby="orbit-cta-note">
            {t.cta}
          </Link>
          <span className="orbit-core-note" id="orbit-cta-note">
            {t.ctaNote}
          </span>
        </div>
        <button
          type="button"
          className="orbit-pause mono"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? t.resume : t.pause}
        </button>
      </div>
      <p className="orbit-cap" aria-live="polite">
        {current ? (
          <>
            <b>{current.name}</b>
            <span>{current.result}</span>
          </>
        ) : (
          <span>{t.hint}</span>
        )}
      </p>
    </>
  );
}
