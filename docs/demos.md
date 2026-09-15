# The module demos: the shared contract

Three demos sit on the modules pages, one per module: Produccion wearing
`--primary`, Hospitalidad wearing `--secondary`, Restaurante wearing
`--energy`. Restaurante is built (`components/pages/demos/RestauranteDemo.tsx`,
bead hq-3pfhe.1) and is the reference the other two are written to.

This file exists because of what that first build cost. Two review rounds found
three blockers, the fixes for those found four more, and every one of them
lived in the part the next two demos were about to copy. The rules below are
the survivors of that, each with the reason it is here, because a rule whose
reason is missing is a rule the next author talks themselves out of.

Nothing here is style preference. Every item is a defect that shipped once.

---

## 1. One hue, and the hue is the demo's own

A demo wears exactly one brand hue and invents no colour. The hue is set in two
places and they agree: `--demo-accent` in `demos.css` for the DOM side, and the
`DemoHue` argument to `readDemoPalette` in `palette.ts` for the canvas side.

**Every hue-bearing value is derived from that hue.** Not most of them. Round
two derived the structural hairline from `--primary` whatever hue was asked
for, so Restaurante drew the outline of its floor, its grid lines and its axis
rules in Produccion's green while its tables and curve were red. The demo wore
two brands and the file's own header claimed it wore one.

`demos.test.ts` holds this two ways: it records which custom properties
`readDemoPalette` asks for and fails if a demo reads a brand token that is not
its own, and it asserts that changing the hue moves every hue-bearing field and
leaves every neutral field alone. A new field on `DemoPalette` has to be
classified into one list or the other or the test fails, so demo two cannot add
a colour that quietly escapes the rule.

Light is the design default. The shell ships `data-mode="light"`, so a palette
is tuned on the cream ground first and checked in dark second, and an isolated
mount with no `data-mode` at all is light. The older canvas visuals read that
as `!== "light"`, which makes an unmounted demo dark against a light page; the
demos do not inherit that.

## 2. The three motion gates, and where they live

A demo animates only when all three of these say yes: the visitor has not asked
for reduced motion, the tab is in front, and the figure is on screen. They are
combined in exactly one function, `shouldAnimate` in `motion.ts`.

The observer is installed **unconditionally**, whatever the motion preference
is. Being on screen is a fact about the page, not an animation setting. Round
one built the `IntersectionObserver` inside the `else` branch of
`if (reduced())`, so a page loaded under `prefers-reduced-motion` never learned
it was on screen, and turning the preference off later called `start()` into a
gate that could never open: the demo was frozen for the life of the page. Both
reviews reproduced it.

`observeOnscreen` therefore takes no motion argument at all. The mistake cannot
be expressed through the API, and `demos.test.ts` fails any demo component that
builds its own observer instead of calling it.

## 3. An observer's threshold is a promise the callback keeps

Gate on `intersectionRatio` through `clearsThreshold` in `lib/onscreen.ts`,
never on `entry.isIntersecting` directly.

Be precise about why, because the reported reason does not survive contact
with a browser and the next person to read the code deserves the measured one.
Both reviews said a callback storing `isIntersecting` animates off a one pixel
sliver, since `isIntersecting` is true for any positive intersection. In
Chromium it is not. An element 3 percent in view, under an observer declaring
0.12 or 0.35, delivers ratio 0.03 with `isIntersecting` **false**, on the
initial observation and on a crossing that happens in a single frame; Blink
derives the flag from the threshold index. Measured in
`state/review/s-0b4b/isintersecting-semantics.mjs` and its two companions;
`sliver.mjs` confirms the demo did not animate at 3 or 9 percent before the
change either.

That is one engine, and the site ships to three. A cross-vendor reviewer reads
the spec the other way, that `isIntersecting` is geometric and the threshold
governs only when the callback fires; this box has no Firefox or WebKit build
to settle it, and bead hq-2u86a carries the open question. Do not resolve it by
picking the reading you prefer.

What is settled:

- **A ratio comparison is the same answer in every engine.** That alone is the
  argument for `clearsThreshold`: a boolean whose meaning two careful readers
  disagree about, and which we can only check in one of three engines, is not a
  boolean to gate behaviour on.
- Even in Chromium, the coupling holds only for a **single scalar threshold**.
  Give the observer a threshold array starting at 0, which is the ordinary way
  to ask for progress updates, and `isIntersecting` tracks the lowest entry in
  the list: `[0, 0.35]` reports true at ratio 0.03. A callback reading
  `isIntersecting` is correct only until someone adds a threshold, and that
  someone gets no warning.
- Nothing at the callsite says which number is being kept. Two authors and two
  reviewers read these callbacks and came away with different beliefs about
  what they did, which is how a defect nobody could reproduce cost two review
  rounds.

`lib/onscreen.test.ts` enforces the part that is genuinely a bug, repo-wide: no
observer may read `isIntersecting` while declaring a threshold array, and any
new observer has to come through `clearsThreshold`. The nine existing callsites that read
`isIntersecting` behind a scalar threshold are listed there as measured-correct
in Chromium and unverified elsewhere, which is what hq-2u86a is for. They are
not a backlog you should clear on your own reading of the spec.

## 4. The device pixel ratio is capped at 2, and it is not fixed for the page

`fitCanvas` caps at 2, so a phone never rasterises four times the pixels it can
show. The cap is the easy half. The ratio also **changes** while the page is
open: a laptop moved to an external monitor, a browser zoomed. Refitting only
from `resize()` leaves the board rasterised at the old ratio for the rest of
the page's life.

Two answers, because neither covers the other's case:

- a `(resolution: Xdppx)` media query, re-armed every time it fires, because
  the query encodes the ratio it was built with. This is the only thing that
  reaches a demo standing on its static frame.
- a comparison inside the running loop, one property read per frame. This is
  the half a headless browser can demonstrate: CDP's device metrics override
  moves `devicePixelRatio` and the media query's own `matches`, but dispatches
  no `change` event (`state/review/s-0b4b/dpr-debug.mjs`).

## 5. Reduced motion resolves to the payoff frame, and the clock agrees with it

A demo that may not animate is not a frozen first frame. It draws the frame the
loop exists to arrive at: for Restaurante, the fullest minute of the evening.
Round one held on minute 360 of a 360 minute service, where every booking has
ended, so the payoff frame was an empty cold room.

Three things are the **same frame**: what reduced motion shows, what a paused
board shows, and what the running loop holds on. Check it by reading the
pixels, not by reasoning: `state/review/s-3b55/hold.mjs` compares the running
canvas' `toDataURL` at the hold against the reduced-motion frame and requires
them byte-identical.

**The standing frame is a frame of the loop, and the loop's clock is parked on
it.** Round two drew the standing frame from `PEAK_T` directly and left the
clock wherever the loop had stopped, so scrolling away at 18:10 snapped the
board to 19:55 and scrolling back ran the clock backwards to 18:10. `floor.ts`
exports `STANDING_CYC` for this; `resolved()` sets `cycT` to it and draws
`cycleFrame(cycT)`. Park on the **first** frame of the hold, not the last: both
draw the same pixels, but a demo parked at the end starts dipping toward the
loop seam the instant it resumes, so a visitor scrolling it into view watches
the payoff frame fade to 15 percent opacity and refill.

## 6. One breakpoint, owned by the data module, measured on the figure

`floor.ts` owns `PHONE_MAX` and `isPhonePlan()`. Everything else asks them.

- **The query container is the figure, not the viewport.** A demo dropped into
  a 500px column of a 1200px page is a phone board, and a viewport media query
  hands that board a desktop stylesheet. `.demo-figure` is
  `container-type: inline-size` and every layout rule is `@container`.
- **Write the two sides as a range pair**, `(width < 640px)` against
  `(width >= 640px)`. Not `(max-width: 639px)` against `(min-width: 640px)`:
  those leave the open interval (639, 640) matching neither, and a container
  query reads the fractional content box, so a figure at 639.25px drew the
  three by four phone board with 54px hotspots under the desktop stylesheet
  against a 422px placeholder. A 214px first-layout shift in a window about
  half a pixel wide.
- **Read the same box in JS, fractional and untransformed.** Two ways to get
  this wrong, and the fix has to dodge both. `clientWidth` is rounded, so a real
  639.25px box reads as 640 and picks the far side of its own breakpoint. And
  `getBoundingClientRect()` is the *painted* box: under a scaled ancestor it
  disagrees with the container query, which measures the unscaled layout box,
  and subtracting unscaled computed padding from a scaled rect is not
  arithmetic either. The authority is `ResizeObserverEntry.contentRect.width`,
  which is the fractional layout content box, exactly what the query reads.
  A rect-derived value is fine only as the reading before the observer has
  spoken, which is the synchronous mount; the observer's first callback then
  corrects it.
- **A plan change is a resize.** The `ResizeObserver` rounds the width to
  ignore sub-pixel churn, and 639.6 and 640.2 round to the same integer while
  being different floor plans, so the plan is compared as well as the number.

`demos.test.ts` parses every `@container` condition out of `demos.css`,
evaluates each one in quarter-pixel steps across the boundary, and fails unless
it agrees with `isPhonePlan()` at every step. The reviewer's browser-side
reproduction is `state/review/s-3b55/breakpoint.mjs`.

## 7. Nothing the loop rewrites may change the size of its box

The caption under the board is rewritten about thirty times a second with one
of four phases, and the four are different lengths. In a wrapping flex row that
made the figure 579px tall while the board read "llenandose" and 610px for the
other three: a 31px reflow twice per 38.5 second cycle, for the life of the
page, at every width where the figure reaches its max-width, taking everything
below it on the page with it.

Two rules, and both are needed:

- **Render every value the loop can write, stacked in one grid cell, with all
  but the live one invisible** (`.demo-caption-box`, `visibility: hidden` on
  the ghosts). The box is then the longest value's size at every container
  width and in every locale. A reserved pixel height is right at one width, one
  font size and one language; this is right everywhere. `CAPTION_KEYS` in
  `floor.ts` is the list, so a fifth phase added to the timeline without a
  ghost fails the test rather than reflowing the page.
- **Give the readout strip a fixed row structure**, a one-column grid rather
  than a wrapping row. Otherwise the strip is one line for a short selection
  and two for a long one, and the frame moves when the visitor taps a table,
  which is the same defect with a different trigger.

`state/review/s-0b4b/caption-box.mjs` drives the four captions at 141 widths in
both locales and fails on any height difference.

## 8. The board fills its query container

`resize()` takes the drawing width from the canvas rect, the floor plan from
the figure's content box, and `demos.css` writes the pre-hydration height in
`cqw` of that same content box. All three are the same number only while
`.demo-stage` adds no padding, border or margin. Name the coupling rather than
relying on it: `demos.test.ts` fails the `.demo-stage` rule if a box-affecting
property appears in it.

The pre-hydration height itself is `bands()` written in container-query units,
term for term, not a flat number. A flat placeholder can only be right at one
width and was 38 to 78px out elsewhere. The test rebuilds the formula from the
stylesheet and compares it to `bands()` across a width sweep.

Related, for whoever mounts these (hq-3pfhe.4): `container-type: inline-size`
computes to `contain: layout style inline-size`, so the figure contributes
nothing to intrinsic width sizing. In a `grid-template-columns: auto` track or
a float it collapses.

## 9. The honest label, and the fallback that carries the figure

Every number on every board is invented, and the frame says so: the head
carries the honest label and the covers band repeats it. That is not decoration
and it is not removable.

With scripting off, the board is never drawn and the hotspots never answer, so
the component's `<noscript>` hides `.demo-canvas`, `.rd-btn` **and**
`.demo-hint` and renders a written description instead. The hint goes with the
buttons because it tells the visitor to choose a table, and the rule above it
has just removed every table there is to choose. The readout strip stays: it is
resolved from the first render, so it is complete with no JavaScript at all.

## 10. Maps are contiguous, never floating shapes

Daniel's call, 2026-09-15. **Every map a demo draws, vineyard, parcel, cellar
or floor, draws its lots as a contiguous block whose polygons share vertices
with their neighbours.** Never as independently placed shapes with gaps between
them.

The reference implementation is the `PLOTS` table in
`components/pages/case/VineyardMap.tsx`: nine sections, A1 to C3, where A2's
left edge **is** A1's right edge and B1's top edge **is** A1's bottom edge, so
the nine tile into one irregular block. Each lot keeps its own shape and size,
which is what carries the real geometry. The edges meet.

The reason, which is why the rule survives contact with a deadline: the
contiguous version reads as one piece of land. The floating one, which is what
the enkanto demo's parcel map does, reads as nine stickers on paper.

## 11. The data is a pure module, the component measures and draws

`floor.ts` holds the room, the reservations, the covers curve, the loop's
timeline, the captions that timeline resolves to, and the stage's vertical
bands. It touches no canvas and no DOM. `RestauranteDemo.tsx` measures, draws
and listens, and owns no numbers.

The point is that every number the payoff frame depends on can be checked
without a browser. `demos.test.ts` runs 70 or so assertions over `floor.ts`,
`motion.ts`, `palette.ts` and the stylesheet in under a second, and the browser
probes are reserved for what only a browser can answer: layout, paint, and what
the platform actually does.

Demos two and three copy this shape. A `cellar.ts` and a `fortnight.ts`, each
pure, each with its own tests, and a component that measures.

---

## Before you call a demo done

- `npm test` and `npx tsc --noEmit` both exit 0.
- `npx next build` exits 0, **and the demo's stylesheet is in the built
  bundle**. Round one shipped `demos.css` with no importer at all: the canvas
  fell back to its 300px intrinsic width and all twelve hotspots landed off the
  board. The component imports its own stylesheet and the test asserts it.
- Every rule above that is about layout, paint or platform behaviour is
  measured in a real browser against a build of your branch, with the branch
  you started from served alongside as the control. A unit test cannot tell you
  that a container query and a component agree at 639.25px, that a caption
  change moved the figure 31px, or what `isIntersecting` does. The reference
  set is:

  | what it checks | rule |
  | --- | --- |
  | both sides of the breakpoint agree, fractional widths | 6 |
  | the plan follows the layout box under a scaled ancestor | 6 |
  | the figure height is constant across every caption, both locales | 7 |
  | the hold frame is byte-identical to the reduced-motion frame | 5 |
  | the clock never runs backwards after a pause | 5 |
  | off screen and hidden tab pause, and both resume | 2 |
  | reduced motion turned off starts the loop | 2 |
  | the backing store refits when the ratio changes | 4 |
  | no JavaScript leaves prose, not an empty frame | 9 |

  The implementations live outside the repo, in `state/review/s-3b55` (round
  two's reviewer) and `state/review/s-0b4b` (this bead), because each needs two
  probe routes that are not committed: one mounting the demo alone, one putting
  it in a resizable column. Copy them into an archived build of your branch
  rather than writing them again. If they have gone stale, the table above is
  the contract and the scripts are only one way to satisfy it.
- Four screenshots captured and read back: light desktop, dark desktop, 390px,
  reduced motion. Read them. A shot nobody looked at is not evidence.
