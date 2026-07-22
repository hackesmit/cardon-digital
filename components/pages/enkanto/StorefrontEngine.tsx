"use client";

import { useEffect, useRef } from "react";
import {
  clamp01,
  dedupe,
  drawFlow,
  fitCanvas,
  makeTrace,
  MONO,
  pointAtLen,
  readPalette,
  rgba,
  rr,
  strokeTraceUpTo,
  type Palette,
  type Pt,
  type Trace,
} from "../home/canvasKit";

/**
 * Signature storefront-comes-alive visual for the Vinedo En'kanto case study.
 * A stylized shop panel where four empty product cards fill in one by one
 * (image block, name, price, weight), then a checkout path lights from the store
 * through payment and splits to two fulfillment branches (pickup and domestic
 * shipment), with a quiet order dot travelling the path to completion. Hover or
 * focus a card or a branch to raise a readout plate.
 *
 * Faithful to the home/case client visuals: rAF throttled, DPR capped at 2 via
 * fitCanvas, IntersectionObserver + visibilitychange pausing, resolved to a
 * static finished frame under prefers-reduced-motion, and the palette re-read on
 * the "cardon-mode" event. Distinct from the Monte Xanic ripening map: this is a
 * commerce flow, not a vineyard.
 */

const DW = 1000;
const DH = 560;

type Card = {
  key: string;
  name: string;
  price: string;
  weight: string;
  x: number;
  y: number;
};

const CARD_W = 196;
const CARD_H = 176;

const CARDS: Card[] = [
  { key: "tinto", name: "Tinto", price: "$ 520", weight: "750 ml", x: 68, y: 118 },
  { key: "blanco", name: "Blanco", price: "$ 480", weight: "750 ml", x: 284, y: 118 },
  { key: "rosado", name: "Rosado", price: "$ 460", weight: "750 ml", x: 68, y: 314 },
  { key: "reserva", name: "Reserva", price: "$ 890", weight: "750 ml", x: 284, y: 314 },
];

const SHOP = { x: 44, y: 64, w: 452, h: 430 };
const SHOP_OUT: Pt = { x: 496, y: 279 };
const CHECKOUT: Pt = { x: 600, y: 279 };
const PAYMENT: Pt = { x: 700, y: 279 };
const PICKUP: Pt = { x: 872, y: 168 };
const SHIPMENT: Pt = { x: 872, y: 392 };

/* readout hotspots: the four product cards plus payment and the two branches */
type Hot = {
  key: string;
  fx: number;
  fy: number;
  name: string;
  status: string;
  action: string;
  label: string;
};

const HOTS: Hot[] = [
  ...CARDS.map((c) => ({
    key: c.key,
    fx: (c.x + CARD_W / 2) / DW,
    fy: (c.y + CARD_H / 2) / DH,
    name: c.name,
    status: "name, price, weight, image",
    action: "in the store",
    label:
      "Product " + c.name + ": built out with a name, price, weight, and image.",
  })),
  {
    key: "payment",
    fx: PAYMENT.x / DW,
    fy: PAYMENT.y / DH,
    name: "Payment",
    status: "cards and cash, how Mexico pays",
    action: "checkout completes",
    label: "Payment set up for how Mexico pays, so the checkout completes.",
  },
  {
    key: "pickup",
    fx: PICKUP.x / DW,
    fy: PICKUP.y / DH,
    name: "Pickup",
    status: "at the winery, San Antonio de las Minas",
    action: "ready to collect",
    label: "Pickup at the winery in San Antonio de las Minas.",
  },
  {
    key: "shipment",
    fx: SHIPMENT.x / DW,
    fy: SHIPMENT.y / DH,
    name: "Domestic shipment",
    status: "compliant packaging, domestic carrier",
    action: "on its way",
    label: "Domestic shipment with compliant packaging.",
  },
];

/* timeline (seconds) */
const STAG = 0.5;
const FILL_DUR = 0.85;
const DOT_START = 2.9;
const DOT_DUR = 2.4;
const TRUNK_START = 2.9;
const TRUNK_DUR = 1.1;
const BRANCH_START = 4.0;
const BRANCH_DUR = 1.1;
const COMPLETE_AT = DOT_START + DOT_DUR; // 5.3
const RESET_START = 7.6;
const RESET_DUR = 1.1;
const CYCLE = RESET_START + RESET_DUR; // 8.7

export default function StorefrontEngine() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const plateRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const plate = plateRef.current;
    if (!stage || !canvas || !plate || !canvas.getContext) return;

    const spName = plate.querySelector(".sp-name");
    const spStatus = plate.querySelector(".sp-status");
    const spAction = plate.querySelector(".sp-action");
    if (!spName || !spStatus || !spAction) return;

    let ctx = fitCanvas(canvas, 1, 1);

    const root = document.documentElement;
    const reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = () => reduceMQ.matches;
    let docVisible = !document.hidden;
    let PAL: Palette = readPalette(root);

    let W = 0;
    let H = 0;
    let s = 1;
    let raf = 0;
    let running = false;
    let onscreen = false;
    let last = 0;
    let clock = 0;
    let loops = 0;

    /* traces are built in design coordinates; the canvas is scaled by s inside
       draw, so drawFlow/strokeTraceUpTo inherit the same scale */
    const trunk: Trace = makeTrace(dedupe([SHOP_OUT, CHECKOUT, PAYMENT]));
    const branchUp: Trace = makeTrace(dedupe([PAYMENT, PICKUP]));
    const branchDown: Trace = makeTrace(dedupe([PAYMENT, SHIPMENT]));
    const fullUp: Trace = makeTrace(dedupe([SHOP_OUT, CHECKOUT, PAYMENT, PICKUP]));
    const fullDown: Trace = makeTrace(
      dedupe([SHOP_OUT, CHECKOUT, PAYMENT, SHIPMENT])
    );

    const font = (px: number, weight?: number) =>
      (weight ? weight + " " : "") + px + "px " + MONO;

    const node = (p: Pt, r: number, lit: number) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = PAL.panel;
      ctx.fill();
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = lit > 0.02 ? PAL.primary : PAL.line;
      ctx.globalAlpha = 0.5 + 0.5 * clamp01(lit);
      ctx.stroke();
      ctx.globalAlpha = 1;
      if (lit > 0.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = PAL.primary;
        ctx.fill();
      }
    };

    const label = (
      text: string,
      p: Pt,
      dy: number,
      lit: number,
      align: CanvasTextAlign
    ) => {
      ctx.font = font(15);
      ctx.textAlign = align;
      ctx.textBaseline = "middle";
      ctx.fillStyle = lit > 0.5 ? PAL.ink : PAL.muted;
      ctx.fillText(text, p.x, p.y + dy);
      ctx.textAlign = "left";
    };

    const drawCard = (c: Card, fill: number) => {
      const x = c.x;
      const y = c.y;
      /* card frame, always present as the empty state */
      rr(ctx, x, y, CARD_W, CARD_H, 12);
      ctx.fillStyle = PAL.card;
      ctx.globalAlpha = 0.55;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = PAL.line;
      ctx.stroke();

      const sub = (a: number, b: number) => clamp01((fill - a) / (b - a));

      /* image block */
      const ia = sub(0, 0.28);
      if (ia > 0.01) {
        ctx.globalAlpha = ia;
        rr(ctx, x + 16, y + 16, 54, 54, 9);
        ctx.fillStyle = PAL.primaryFaint;
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = rgba(PAL.primaryRgb, 0.5);
        ctx.stroke();
        /* a small bottle glyph inside the image block */
        ctx.strokeStyle = rgba(PAL.primaryRgb, 0.85 * ia);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 40, y + 26);
        ctx.lineTo(x + 40, y + 34);
        ctx.lineTo(x + 34, y + 42);
        ctx.lineTo(x + 34, y + 58);
        ctx.lineTo(x + 46, y + 58);
        ctx.lineTo(x + 46, y + 42);
        ctx.lineTo(x + 40, y + 34);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      /* name */
      const na = sub(0.28, 0.52);
      if (na > 0.01) {
        ctx.globalAlpha = na;
        ctx.font = font(17, 600);
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = PAL.ink;
        ctx.fillText(c.name, x + 84, y + 38);
        ctx.globalAlpha = 1;
      }
      /* price */
      const pa = sub(0.52, 0.76);
      if (pa > 0.01) {
        ctx.globalAlpha = pa;
        ctx.font = font(15, 600);
        ctx.fillStyle = PAL.secondary;
        ctx.fillText(c.price, x + 84, y + 62);
        ctx.globalAlpha = 1;
      }
      /* divider + weight */
      const wa = sub(0.76, 1);
      if (wa > 0.01) {
        ctx.globalAlpha = wa;
        ctx.strokeStyle = PAL.lineSoft;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 16, y + 92);
        ctx.lineTo(x + CARD_W - 16, y + 92);
        ctx.stroke();
        ctx.font = font(13);
        ctx.fillStyle = PAL.muted;
        ctx.fillText(c.weight, x + 16, y + 122);
        /* add chip */
        ctx.fillStyle = rgba(PAL.primaryRgb, 0.16);
        rr(ctx, x + CARD_W - 74, y + 108, 58, 22, 11);
        ctx.fill();
        ctx.fillStyle = PAL.primary;
        ctx.font = font(11, 600);
        ctx.textAlign = "center";
        ctx.fillText("add", x + CARD_W - 45, y + 123);
        ctx.textAlign = "left";
        ctx.globalAlpha = 1;
      }
    };

    const compute = () => {
      const fade =
        clock < RESET_START ? 1 : 1 - clamp01((clock - RESET_START) / RESET_DUR);
      const fills = CARDS.map((_, i) =>
        clamp01((clock - i * STAG) / FILL_DUR) * fade
      );
      const trunkL = clamp01((clock - TRUNK_START) / TRUNK_DUR) * fade;
      const branchL = clamp01((clock - BRANCH_START) / BRANCH_DUR) * fade;
      const dotU = clamp01((clock - DOT_START) / DOT_DUR);
      const complete = clock >= COMPLETE_AT ? fade : 0;
      const toShipment = loops % 2 === 0;
      return { fade, fills, trunkL, branchL, dotU, complete, toShipment };
    };

    const draw = () => {
      /* clear in device space, then draw in design space scaled by s */
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.save();
      ctx.scale(s, s);

      const st = reduced()
        ? {
            fade: 1,
            fills: CARDS.map(() => 1),
            trunkL: 1,
            branchL: 1,
            dotU: 1,
            complete: 1,
            toShipment: true,
          }
        : compute();

      /* shop panel backdrop */
      rr(ctx, SHOP.x, SHOP.y, SHOP.w, SHOP.h, 18);
      ctx.fillStyle = rgba(PAL.panelRgb, 0.45);
      ctx.fill();
      ctx.lineWidth = 1.3;
      ctx.strokeStyle = PAL.line;
      ctx.stroke();
      ctx.font = font(12, 600);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = PAL.muted;
      ctx.fillText("STORE", SHOP.x + 20, SHOP.y + 30);

      CARDS.forEach((c, i) => drawCard(c, st.fills[i]));

      /* rails: base then lit portion */
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const baseRail = (tr: Trace) => {
        ctx.lineWidth = 2;
        ctx.strokeStyle = PAL.lineSoft;
        strokeTraceUpTo(ctx, tr, tr.len);
      };
      baseRail(trunk);
      baseRail(branchUp);
      baseRail(branchDown);

      ctx.lineWidth = 2.4;
      ctx.strokeStyle = PAL.primaryDim;
      strokeTraceUpTo(ctx, trunk, trunk.len * st.trunkL);
      strokeTraceUpTo(ctx, branchUp, branchUp.len * st.branchL);
      strokeTraceUpTo(ctx, branchDown, branchDown.len * st.branchL);

      /* nodes + labels */
      node(CHECKOUT, 8, st.trunkL);
      node(PAYMENT, 8, st.trunkL);
      node(PICKUP, 7, st.branchL);
      node(SHIPMENT, 7, st.branchL);
      label("Checkout", CHECKOUT, -18, st.trunkL, "center");
      label("Payment", PAYMENT, -18, st.trunkL, "center");
      label("Pickup", PICKUP, -16, st.branchL, "center");
      label("Domestic shipment", SHIPMENT, 26, st.branchL, "center");

      /* travelling order flow + dot */
      const path = st.toShipment ? fullDown : fullUp;
      if (!reduced() && st.dotU > 0.001 && st.dotU < 0.999) {
        drawFlow(
          ctx,
          path,
          path.len * st.dotU,
          rgba(PAL.energyRgb, 0.9),
          PAL.energyBright
        );
        ctx.globalAlpha = 1;
        const hp = pointAtLen(path, path.len * st.dotU);
        ctx.beginPath();
        ctx.arc(hp.x, hp.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = PAL.energy;
        ctx.fill();
      }

      /* completion ring at the fulfilled branch end */
      if (st.complete > 0.01) {
        const end = st.toShipment ? SHIPMENT : PICKUP;
        ctx.globalAlpha = st.complete;
        ctx.beginPath();
        ctx.arc(end.x, end.y, 12, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = PAL.energy;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(end.x, end.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = PAL.energy;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.font = font(12, 600);
        ctx.textAlign = "center";
        ctx.fillStyle = PAL.energyBright;
        ctx.globalAlpha = st.complete;
        ctx.fillText("order placed", end.x, end.y + (st.toShipment ? 44 : -22));
        ctx.globalAlpha = 1;
        ctx.textAlign = "left";
      }

      ctx.restore();
    };

    const advance = (dt: number) => {
      clock += dt;
      if (clock > CYCLE) {
        clock -= CYCLE;
        loops += 1;
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 40) return;
      let dt = (now - last) / 1000;
      last = now;
      if (dt > 0.06) dt = 0.06;
      advance(dt);
      draw();
    };
    const canRun = () => !reduced() && docVisible && onscreen;
    const start = () => {
      if (running || !canRun()) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      s = W / DW;
      ctx = fitCanvas(canvas, W, H);
      draw();
    };

    /* readout plate on hover / focus of the DOM hotspots */
    const showPlate = (hot: HTMLElement) => {
      const fx = parseFloat(hot.getAttribute("data-fx") || "0");
      const fy = parseFloat(hot.getAttribute("data-fy") || "0");
      spName.textContent = hot.getAttribute("data-name") || "";
      spStatus.textContent = hot.getAttribute("data-status") || "";
      spAction.textContent = hot.getAttribute("data-action") || "";
      const rect = stage.getBoundingClientRect();
      plate.classList.add("show");
      const pw = plate.offsetWidth;
      const ph = plate.offsetHeight;
      const px = fx * rect.width;
      const py = fy * rect.height;
      const pad = 8;
      let left = px;
      let top = py - ph - 16;
      const half = pw / 2;
      if (left < half + pad) left = half + pad;
      if (left > rect.width - half - pad) left = rect.width - half - pad;
      if (top < pad) top = py + 18;
      if (top + ph > rect.height - pad) top = rect.height - ph - pad;
      plate.style.left = left + "px";
      plate.style.top = top + "px";
    };
    const hidePlate = () => plate.classList.remove("show");

    const hots = Array.prototype.slice.call(
      stage.querySelectorAll(".shop-hot")
    ) as HTMLElement[];
    const hotCleanups: Array<() => void> = [];
    hots.forEach((h) => {
      const on = () => showPlate(h);
      const off = () => hidePlate();
      h.addEventListener("mouseenter", on);
      h.addEventListener("mouseleave", off);
      h.addEventListener("focus", on);
      h.addEventListener("blur", off);
      hotCleanups.push(() => {
        h.removeEventListener("mouseenter", on);
        h.removeEventListener("mouseleave", off);
        h.removeEventListener("focus", on);
        h.removeEventListener("blur", off);
      });
    });

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
      draw();
    };
    const onReduceChange = () => {
      if (reduced()) {
        stop();
        draw();
      } else {
        start();
      }
    };

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (en) => {
          onscreen = en[0].isIntersecting;
          if (onscreen && docVisible) start();
          else stop();
        },
        { threshold: 0.12 }
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
    if (!("IntersectionObserver" in window) && !reduced()) start();

    return () => {
      stop();
      if (io) io.disconnect();
      hotCleanups.forEach((fn) => fn());
      window.clearTimeout(rt);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("cardon-mode", onMode);
      reduceMQ.removeEventListener("change", onReduceChange);
    };
  }, []);

  return (
    <div className="shop-showcase">
      <div className="shop-stage" ref={stageRef}>
        <span className="shop-legend mono">Storefront / order path</span>
        <span className="shop-honest mono">illustrative view, not client data</span>

        <canvas className="shop-canvas" ref={canvasRef} aria-hidden="true" />

        {HOTS.map((h) => (
          <button
            key={h.key}
            type="button"
            className="shop-hot"
            data-fx={h.fx}
            data-fy={h.fy}
            data-name={h.name}
            data-status={h.status}
            data-action={h.action}
            style={{ left: h.fx * 100 + "%", top: h.fy * 100 + "%" }}
            aria-label={h.label}
          >
            <span className="sr-only">{h.label}</span>
          </button>
        ))}

        <div className="shop-plate" ref={plateRef} aria-hidden="true">
          <span className="sp-name">Product</span>
          <span className="sp-status">status</span>
          <span className="sp-action">in the store</span>
        </div>

        <noscript>
          <div className="shop-fallback">
            A stylized storefront. Four empty product cards fill in one by one
            with an image, a name, a price, and a weight, then a checkout path
            lights from the store through payment and splits to two fulfillment
            branches, pickup and domestic shipment, as an order completes.
          </div>
        </noscript>
      </div>

      <p className="shop-caption mono">
        Empty cards fill, then an order runs the path to pickup or domestic
        shipment.
      </p>
    </div>
  );
}
