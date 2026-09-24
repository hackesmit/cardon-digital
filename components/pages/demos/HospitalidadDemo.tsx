"use client";

import { useMemo, useState } from "react";
import { demos, type DemosDict } from "@/lib/i18n/demos";
import { useDict } from "@/lib/i18n/LocaleProvider";
import { line, MONO, rgba, rr, type DemoPalette } from "./palette";
import {
  bands,
  board,
  CAPTION_KEYS,
  captionKeyFor,
  cycleFrame,
  CYCLE,
  dayNumber,
  directShareAt,
  FEATURED,
  hotspotSpots,
  isWeekend,
  landed,
  LEAD,
  NIGHTS,
  occupancyAt,
  READOUTS,
  STANDING_CYC,
  STAYS,
  stayRect,
  UNITS,
  weekday,
  type Board,
  type Bands,
  type Stay,
} from "./fortnight";
import { DemoFigure, Hotspot, PickBox } from "./stage/DemoFigure";
import type { DemoScene, StageEnv } from "./stage/useDemoStage";

/**
 * Hospitalidad: a fortnight filling with direct and agency bookings (bead
 * hq-3pfhe.3), built on the stage RestauranteDemo.tsx is the reference for.
 *
 * Fourteen nights across the top, eight units down the side, and a sixty day
 * booking window closing underneath the whole thing. Stays land on the board
 * as they are booked: both weekends sell out first, the way a real fortnight
 * does, and the midweek fills in around them. The countdown in the head is the
 * story's clock; the band under the calendar stacks the nights sold per night.
 *
 * THE ARGUMENT, which is the reason this demo exists rather than a prettier
 * calendar: a booking that came direct and a booking that came through an
 * agency are not the same thing to the owner, because the commission on the
 * second one is not theirs. So they are never one series here. A direct stay
 * is drawn in the module's own hue, filled solid; an agency stay is drawn in
 * the palette's neutral with a hatch over it; and each bar with room for it
 * carries its source as a word, so the mapping is learned off the board in one
 * glance and there is no key anywhere on the figure to go and read. Three
 * separations, deliberately: hue, texture and a word. Hue alone fails a
 * colour-blind reader, and the two fills sit close in luminance in light mode.
 *
 * WHY THE SECOND SERIES IS A NEUTRAL, which bead hq-3pfhe.1's cross-vendor
 * reviewer left for this bead to settle. palette.ts gives a demo exactly one
 * accent, at five alphas, because the colour contract in modulos.css gives
 * each module one hue, and this demo needs two series that read apart. The
 * answer is neither of the two the note offered (relax the one-hue rule, or
 * add a new shared series): the palette already carries a neutral ramp for
 * exactly this kind of work, plate for a thing that is not there, muted for a
 * neutral mass, axis for a label on it. Direct wears the hue, agency wears
 * muted, an empty night is plate. Nothing is forked, nothing is invented, the
 * one-hue rule stands untouched, and Produccion can do the same if it ever
 * needs a second series. See the bead for the note this answers.
 *
 * What it costs, and when it does not run. One canvas, one rAF loop at about
 * 30fps, device pixel ratio capped at 2, paused off screen and on a hidden
 * tab, and under prefers-reduced-motion it never starts: it resolves to the
 * filled fortnight, which is also the frame the loop holds on and the frame a
 * paused instance shows. All of that is ./stage/useDemoStage.ts, not this
 * file. The fortnight, the timeline and the geometry are ./fortnight.ts, which
 * is pure and tested in ./fortnight.test.ts. This file draws.
 *
 * Every number on this board is invented. The frame says so.
 */

type Vis = DemosDict["hospitalidad"];

/* ------------------------------- THE SCENE ------------------------------ */

function hospitalidadScene(vis: Vis): DemoScene {
  /* the board as the stage last described it; set at the top of layout() and
     draw(), read by everything below */
  let ctx!: CanvasRenderingContext2D;
  let PAL!: DemoPalette;
  let picked = 0;

  let W = 0;
  let H = 0;
  let phone = false;
  let b!: Bands;
  let bd!: Board;

  const layout = (env: StageEnv) => {
    W = env.W;
    H = env.H;
    phone = env.phone;
    b = bands(W, phone);
    bd = board(W, phone);
  };

  /* ------------------------------ the head ----------------------------- */

  /** The fortnight's dates, and how far out the booking window is. The
      countdown is drawn rather than written into the DOM because it changes
      every frame, and a value that changes every frame has to be a picture:
      see the ghost boxes in ../demos.md. */
  const drawHead = (daysOut: number) => {
    const small = phone ? 10 : 9;
    ctx.textBaseline = "alphabetic";
    ctx.font = "600 " + small + "px " + MONO;
    ctx.textAlign = "left";
    ctx.fillStyle = PAL.axis;
    ctx.fillText(phone ? vis.datesCompact : vis.dates, bd.gx0, b.hy - 5);

    const left = Math.max(0, Math.ceil(daysOut));
    ctx.font = "600 11px " + MONO;
    ctx.fillStyle = PAL.accentInk;
    ctx.textAlign = "right";
    ctx.fillText(
      left === 0 ? vis.arrival : vis.daysOut.replace("{n}", String(left)),
      bd.gx1,
      b.hy - 5,
    );

    /* The window closing, as a short track well clear of the calendar's
       columns: an axis the width of the board would read as a date axis and
       there is already one of those directly underneath. No room for it on a
       phone, where the countdown carries the reading alone. */
    if (!phone) {
      const tw = Math.min(130, W * 0.18);
      const tx1 = bd.gx1 - 100;
      const ty = b.hy - 9;
      const at = tx1 - tw + tw * (1 - daysOut / LEAD);
      ctx.lineWidth = 2;
      ctx.strokeStyle = PAL.lineSoft;
      line(ctx, tx1 - tw, ty, tx1, ty);
      ctx.strokeStyle = PAL.accentLine;
      line(ctx, tx1 - tw, ty, at, ty);
      ctx.fillStyle = PAL.accent;
      ctx.beginPath();
      ctx.arc(at, ty, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    /* the date columns: one weekday letter and one day number each, the two
       weekend days in the full text colour so the pair reads as a block */
    ctx.textAlign = "center";
    for (let n = 0; n < NIGHTS; n++) {
      const cx = bd.gx0 + (n + 0.5) * bd.cw;
      ctx.fillStyle = isWeekend(n) ? PAL.ink : PAL.axis;
      ctx.font = "600 9px " + MONO;
      ctx.fillText(vis.weekdayLetters.charAt(weekday(n)), cx, b.gy0 - 24);
      ctx.font = "600 10px " + MONO;
      ctx.fillText(String(dayNumber(n)), cx, b.gy0 - 10);
    }
  };

  /* ----------------------------- the calendar --------------------------- */

  const drawStay = (s: Stay, arrived: number) => {
    const r = stayRect(s, bd);
    const w = r.w * arrived;
    if (w < 1) return;
    const direct = s.channel === "direct";

    rr(ctx, r.x, r.y, w, r.h, 2);
    ctx.fillStyle = direct ? PAL.accent : PAL.muted;
    ctx.fill();

    /* The hatch is the second separation, and the one that survives a
       greyscale print and a colour-blind reader: in light mode the ochre and
       the neutral sit close in luminance. */
    if (!direct) {
      ctx.save();
      rr(ctx, r.x, r.y, w, r.h, 2);
      ctx.clip();
      ctx.strokeStyle = rgba(PAL.plateRgb, 0.5);
      ctx.lineWidth = 1;
      for (let x = r.x - r.h; x < r.x + w; x += 9) {
        line(ctx, x, r.y + r.h, x + r.h, r.y);
      }
      ctx.restore();
    }

    /* the booking landing: a brighter edge that fades as the bar settles */
    if (arrived < 1) {
      ctx.save();
      ctx.globalAlpha = 1 - arrived;
      rr(ctx, r.x, r.y, w, r.h, 2);
      ctx.strokeStyle = PAL.accentInk;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    }

    /* The third separation: the source, printed on the booking, wherever the
       bar is long enough to hold it. A visitor reads one bar and knows both
       colours, which is what makes a key unnecessary rather than merely
       absent. */
    const word = direct ? vis.channelsUpper.direct : vis.channelsUpper.ota;
    const fs = Math.min(9, r.h * 0.5);
    if (r.h >= 11 && w > word.length * fs * 0.62 + 12) {
      ctx.font = "600 " + fs.toFixed(0) + "px " + MONO;
      ctx.fillStyle = PAL.panel;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(word, r.x + 5, r.y + r.h / 2 + 0.5);
      ctx.textBaseline = "alphabetic";
    }
  };

  const drawBoard = (daysOut: number) => {
    const bw = bd.gx1 - bd.gx0;
    const bh = bd.gy1 - bd.gy0;
    rr(ctx, bd.gx0, bd.gy0, bw, bh, 2);
    ctx.fillStyle = PAL.floor;
    ctx.fill();
    ctx.strokeStyle = PAL.lineSoft;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    /* the weekend columns, in a neutral wash: the two days the argument is
       about have to be findable before anything is booked on them, and a
       wash in the accent would read as a direct booking */
    ctx.fillStyle = rgba(PAL.textRgb, 0.05);
    for (let n = 0; n < NIGHTS; n++) {
      if (isWeekend(n)) ctx.fillRect(bd.gx0 + n * bd.cw, bd.gy0, bd.cw, bh);
    }

    ctx.strokeStyle = PAL.lineSoft;
    ctx.lineWidth = 1;
    for (let n = 1; n < NIGHTS; n++) {
      const x = bd.gx0 + n * bd.cw;
      line(ctx, x, bd.gy0, x, bd.gy1);
    }
    for (let u = 1; u < UNITS.length; u++) {
      const y = bd.gy0 + u * bd.rh;
      line(ctx, bd.gx0, y, bd.gx1, y);
    }

    /* the units, numbered rather than named: a name long enough to read is a
       gutter wide enough to cost the board two of its nights, and the plate
       and the strip underneath both say which unit is which */
    ctx.font = "600 9px " + MONO;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let u = 0; u < UNITS.length; u++) {
      ctx.fillStyle = u === picked ? PAL.accentInk : PAL.axis;
      ctx.fillText(String(u + 1), bd.gutter, bd.gy0 + (u + 0.5) * bd.rh);
    }
    ctx.textBaseline = "alphabetic";

    for (const s of STAYS) {
      const arrived = landed(s, daysOut);
      if (arrived > 0) drawStay(s, arrived);
    }

    /* the selection, marked on the board as well as in the strip, so a tap on
       a phone is answered where the visitor is looking */
    if (picked >= 0 && picked < FEATURED.length) {
      const s = STAYS[FEATURED[picked]];
      const r = stayRect(s, bd);
      ctx.save();
      /* The plate reads a stay that may not have been booked yet at this
         point in the window, and a solid ring around nothing reads as an
         object on the board. Dashed until it lands, solid once it has. */
      if (landed(s, daysOut) === 0) ctx.setLineDash([3, 4]);
      rr(ctx, r.x - 3, r.y - 3, r.w + 6, r.h + 6, 3);
      ctx.strokeStyle = PAL.accentSoft;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    }
  };

  /* --------------------------- the occupancy band ----------------------- */

  const drawLoad = (daysOut: number) => {
    const occ = occupancyAt(daysOut);
    const bh = b.lb - b.lt;
    const small = phone ? 10 : 9;

    ctx.font = "600 " + small + "px " + MONO;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    ctx.fillStyle = PAL.axis;
    ctx.fillText(vis.occupancy, bd.gx0, b.lt - 8);
    ctx.textAlign = "right";
    ctx.fillText(vis.illustrativeUpper, bd.gx1, b.lt - 8);

    /* The band is a chart before anything is sold: two gridlines at thirds of
       the property, hour-style ticks under every night, and a baseline. It
       never reads as an empty reserved rectangle. */
    ctx.strokeStyle = PAL.lineSoft;
    ctx.lineWidth = 1;
    for (const k of [1, 2]) {
      const y = b.lb - (bh * k) / 3;
      line(ctx, bd.gx0, y, bd.gx1, y);
    }
    ctx.strokeStyle = PAL.line;
    line(ctx, bd.gx0, b.lb, bd.gx1, b.lb);

    const cw = bd.cw * 0.66;
    for (let n = 0; n < NIGHTS; n++) {
      const x = bd.gx0 + (n + 0.5) * bd.cw - cw / 2;
      const dh = (occ[n].direct / UNITS.length) * bh;
      const oh = (occ[n].ota / UNITS.length) * bh;
      if (dh > 0) {
        ctx.fillStyle = PAL.accent;
        ctx.fillRect(x, b.lb - dh, cw, dh);
      }
      if (oh > 0) {
        const y = b.lb - dh - oh;
        ctx.fillStyle = PAL.muted;
        ctx.fillRect(x, y, cw, oh);
        /* the same hatch the bars above carry, so the two stacks read as the
           two series and not as two shades of one */
        if (oh > 5) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, cw, oh);
          ctx.clip();
          ctx.strokeStyle = rgba(PAL.plateRgb, 0.5);
          ctx.lineWidth = 1;
          for (let hx = x - oh; hx < x + cw; hx += 9) {
            line(ctx, hx, y + oh, hx + oh, y);
          }
          ctx.restore();
        }
      }
    }

    /* The reading, in the headroom over the first nights of the fortnight,
       which are the emptiest of the board at every point in the story. */
    const share = directShareAt(daysOut);
    if (share > 0) {
      ctx.font = "600 11px " + MONO;
      ctx.fillStyle = PAL.accentInk;
      ctx.textAlign = "left";
      ctx.fillText(vis.directShare.replace("{p}", String(share)), bd.gx0 + 2, b.lt + 12);
    }
  };

  return {
    hue: "secondary",
    clock: { cycle: CYCLE, standing: STANDING_CYC },
    height: (w, isPhone) => bands(w, isPhone).height,
    layout,
    draw(env, cycT) {
      ctx = env.ctx;
      PAL = env.pal;
      picked = env.selection;
      const f = cycleFrame(cycT);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      drawHead(f.daysOut);
      drawBoard(f.daysOut);
      drawLoad(f.daysOut);
      /* the dip at the loop seam */
      if (f.fade < 1) {
        ctx.fillStyle = rgba(PAL.panelRgb, 1 - f.fade);
        ctx.fillRect(0, 0, W, H);
      }
    },
    /* from the same geometry the canvas draws with, so they cannot drift */
    hotspots: (env) => hotspotSpots(env.W, env.phone),
    live: [
      {
        name: "caption",
        values: vis.captions,
        keys: CAPTION_KEYS,
        initial: "opens",
        at: (cycT) => captionKeyFor(cycleFrame(cycT).daysOut),
      },
    ],
  };
}

/* ----------------------------- THE COMPONENT ---------------------------- */

/** The pre-hydration hotspot positions, from the wide plan at a reference
    width. The stage corrects every one of them from the scene's geometry on
    the first layout, at the width the figure actually got. */
const PRE = hotspotSpots(700, false);

export default function HospitalidadDemo() {
  const d = useDict(demos);
  const vis = d.hospitalidad;
  /* Which unit the readout strip is reading. It is resolved from the first
     render, so the strip is complete before hydration, with no JS at all, and
     under reduced motion. Selecting another unit only moves the selection. */
  const [picked, setPicked] = useState(0);
  const scene = useMemo(() => hospitalidadScene(vis), [vis]);

  const detail = (i: number) =>
    vis.stayLine
      .replace("{n}", String(READOUTS[i].nights))
      .replace("{dates}", READOUTS[i].from + "-" + READOUTS[i].to)
      .replace("{channel}", vis.channels[READOUTS[i].channel]);

  return (
    <DemoFigure
      demo="hospitalidad"
      scene={scene}
      title={
        <>
          {vis.title}
          <span className="demo-hours mono">{vis.tagNights}</span>
        </>
      }
      honest={d.honest}
      fallback={vis.fallback}
      hint={vis.hint}
      selection={picked}
      hotspots={READOUTS.map((r, i) => (
        <Hotspot
          key={i}
          picked={i === picked}
          onPick={() => setPicked(i)}
          label={vis.unitAria[r.kind]
            .replace("{n}", String(r.nights))
            .replace("{dates}", r.from + "-" + r.to)
            .replace("{channel}", vis.channels[r.channel])}
          style={{
            left: (PRE[i].fx * 100).toFixed(2) + "%",
            top: (PRE[i].fy * 100).toFixed(2) + "%",
          }}
        >
          <span className="rd-plate" aria-hidden="true">
            <span className="rd-name">{vis.units[r.kind]}</span>
            <span className="rd-detail">{detail(i)}</span>
            <span className="rd-illus">{vis.illustrative}</span>
          </span>
        </Hotspot>
      ))}
    >
      {/* On a phone there is no hover, so this is the whole reading: a tap
          moves the selection and the strip answers. */}
      <PickBox
        count={READOUTS.length}
        picked={picked}
        row={(i) => (
          <>
            <span className="demo-pick-k mono">{vis.readoutLabel}</span>
            <span className="demo-pick-v">{vis.units[READOUTS[i].kind]}</span>
            <span className="demo-pick-d mono">{detail(i)}</span>
          </>
        )}
      />
    </DemoFigure>
  );
}
