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

Be precise about why, because the reported reason does not survive contact with
a browser and the next person to read the code deserves the measured one. Both
reviews said a callback storing `isIntersecting` animates off a one pixel
sliver, since `isIntersecting` is true for any positive intersection. In
Chromium it is not. An element 3 percent in view, under an observer declaring
0.12 or 0.35, delivers **ratio 0.03 with `isIntersecting` false**, on the
initial observation and on a crossing that happens in a single frame. Note what
that single row proves on its own: the ratio is above zero, so the element did
intersect, and the flag was false anyway. Whatever the flag is in that engine,
it is not the geometric intersection. Measured in
`state/review/s-0b4b/isintersecting-semantics.mjs` and its two companions;
`sliver.mjs` is the behavioural control, and the demo did not animate at 3 or 9
percent before the change either.

That is one engine, and the site ships to three. A cross-vendor reviewer reads
the spec the other way and disputes the measurement itself, not just its
interpretation; this box has no Firefox or WebKit build to settle it, and bead
hq-2u86a carries the question. Do not resolve it by picking the reading you
prefer. Note that the unit test's fake observer deliberately models the
**pessimistic** reading, defaulting `isIntersecting` to `ratio > 0`: a stub that
baked in the disputed behaviour would be testing the belief rather than the
gate.

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
new observer that declares a threshold has to come through `clearsThreshold`.
It walks the TypeScript AST rather than the text, finds the constructor as
`IntersectionObserver`, `window.IntersectionObserver`,
`window["IntersectionObserver"]`, and through any identifier the file binds to
one of those, plainly or by destructuring, chased until the set stops growing.
It is not a type checker: an alias reached through a call or a parameter is
still invisible to it, which is why `demos.test.ts` adds a stricter rule for
the demos themselves, that a demo component does not name
`IntersectionObserver` at all, in any spelling. The observer a demo needs is
the one in `motion.ts`. The nine existing callsites that read
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

**The standing frame is where a resume starts, not where the story starts.**
`resolved()` runs at mount, so the clock is parked before the loop has ever
run, and a `start()` that simply carried on from the parked clock played the
ending first: on an in-view load the payoff frame sat frozen for the whole
5.5 second hold, faded to 15 percent, and only at about 7.2 seconds did 17:00
begin with an empty room. The first thing a visitor saw was the ending, held
still, on the demo the site's motion is judged by. The fix is one flag:
`start()` sets `cycT = 0` the first time it runs and never again, so the first
run tells the story from the top and every later start is the resume above.
`resolved()` still draws `STANDING_CYC`, so the reduced-motion frame, the
paused frame and the hold are still one frame, and nothing runs backwards.
`state/review/s-4a6c/firstview.mjs` samples the caption for eight seconds
after an in-view load and fails if the first caption is the peak or the
caption has not moved within three seconds.

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

Three rules, and all three are needed:

- **Render every value the box can hold, stacked in one grid cell, with all but
  the live one invisible** (`.demo-caption-box`, `visibility: hidden` on the
  ghosts). The box is then the longest value's size at every container width
  and in every locale. A reserved pixel height is right at one width, one font
  size and one language; this is right everywhere. `CAPTION_KEYS` in `floor.ts`
  is the list, so a fifth phase added to the timeline without a ghost fails the
  test rather than reflowing the page.
- **Do the same for anything the visitor changes.** The selection readout is
  not written by the loop, so the rule above does not reach it, and one of the
  twelve table names is long enough to wrap where the others are not: tapping
  it grew the figure 31px and the next tap shrank it again, at 8 of 57 widths
  in Spanish and 3 in English. `.demo-pick-box` holds all twelve readouts the
  same way: thirteen rows in one cell, the live one plus a ghost for every
  readout including the selected one, because a ghost set that changed with the
  selection would put the selection back into the box's size. Keep the ghosts
  out of the accessibility tree: the live one is the `aria-live` region, all
  twelve ghosts are `aria-hidden`, and both spellings come from one function so
  they cannot be styled apart.
- **Give the readout strip a fixed row structure**, a one-column grid rather
  than a wrapping row, so the caption cannot displace the selection or sit
  beside it depending on how long each happens to be.
- **A ghost box stretches its live child unless told not to.** The cell is
  as tall as the tallest ghost and a grid item's default alignment is stretch,
  so the live row is drawn to the tallest ghost's height whatever it holds;
  if that row is itself a wrapping flex container, `align-content: normal`
  spreads the spare height between its lines. On the phone plan that put
  13.5px of extra gap between the table name and its detail for 11 of the 12
  tables and none for the twelfth, so the figure held at 840px while the text
  inside it jumped on every tap. Pair every ghost box with `align-self: start`
  on its children (`.demo-pick-box > *` and `.demo-caption-box > *` both
  carry it; `demos.test.ts` fails either without it), and probe the live
  row's own box against its content, not only the figure height:
  `state/review/s-4a6c/pickgap.mjs` taps all twelve tables at 390 and 1440
  and fails on any spare height.

`state/review/s-0b4b/caption-box.mjs` drives the four captions at 141 widths in
both locales, and `selection.mjs` taps all twelve tables at 57 widths in both
locales; each fails on any height difference. Note what the second one taught:
a 30ms settle after changing the container width measured the board mid-resize
and reported 161 and 214px swings that were the probe's own doing. Wait past
the component's 140ms debounce before believing a number.

## 8. The board fills its query container

`resize()` takes the drawing width from `canvas.clientWidth`, the floor plan
from the figure's fractional content box, and `demos.css` writes the
pre-hydration height in `cqw` of that same content box. All three are the same
number only while `.demo-stage` adds no padding, border or margin. Name the
coupling rather than relying on it: `demos.test.ts` fails the `.demo-stage`
rule if a box-affecting property appears in it.

Both JS readings are **layout** measures, and that is the whole point.
`getBoundingClientRect()` is the painted box, so under a scaled ancestor a
642px composition would be drawn as 321px and stretched back across a 642px CSS
box, with a height `bands()` derived from the same wrong number. A transform is
paint; the canvas coordinate system is layout. `clientWidth` is right for the
drawing width, which is an integer pixel grid, and wrong for the breakpoint,
which needs the fraction: two different jobs, two different reads, and the
comment at each one says which.

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

## 12. The contract is enforced on every demo, and the spellings are the contract

Daniel's ruling, 2026-09-15, on the s-4a6c review of hq-3pfhe.6. The review
showed that rules 1, 2, 3 and the stylesheet half of 6 were enforced
generically while rules 5, 6 (component side), 7 and 9 were enforced only by
string checks pinned to `RestauranteDemo.tsx`: a demo two that imported
`demos.css` and called `observeOnscreen` passed every "every demo component"
check while taking its plan from the rounded `clientWidth`, its drawing width
from the painted rect, writing its caption into a bare span with no ghosts and
drawing no standing frame through the timeline, with the suite green and
`tsc` exit 0. The two ways to close that were to lift the checks to every
component, or to move the enforcement into the DoD of hq-3pfhe.2 and
hq-3pfhe.3. **The ruling is the first.** Generic enforcement is what
invariant 8 asks for; a future bead's DoD is a promise, and a promise is not a
mechanism.

So `demos.test.ts` holds the component-side rules as functions of a
component's source (`componentRules`) and runs every one of them over every
`.tsx` file in `components/pages/demos/`. The reviewer's two loophole
components are embedded in the test verbatim and the test asserts they FAIL
the rules they were written to dodge, so the enforcement cannot drift back to
describing one file.

The consequence for whoever writes demos two and three: **the spellings those
checks pin are part of the contract.** `W = Math.max(1, canvas.clientWidth)`,
`contentW = exact`, `figureContentWidth()`, `rectContentWidth()`, `roSeen`,
`isPhonePlan(figureContentWidth())`, `cycT`, `STANDING_CYC`, `let ran = false`
and the `if (!ran)` reset in `start()`, `captionRef` writing
`caption.textContent`, `CAPTION_KEYS.map` over `.demo-caption-ghost`,
`pickRow(i, ghost)` over `.demo-pick-ghost` if the demo has a readout the
visitor changes, and the `<noscript>` block hiding `.demo-canvas` plus every
`.rd-btn` and `.demo-hint` it renders. Copy the reference's measuring and
clock code as it stands. If a rule genuinely does not fit your demo, change
the check and the demo in the same commit and say why in both; do not route
around the check, because a reviewer will drop the loophole fixtures back in
and run the suite.

The cleaner shape, a shared measuring hook and a shared clock that the three
components call rather than copy, would make these checks structural instead
of lexical. It is a refactor of a component three review rounds have verified,
so it is not part of a fix round; if demo two's author reaches for it, that is
a bead of its own, and the tests above are what it has to keep green.

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
  | the plan and the board geometry follow the layout box under a scaled ancestor | 6, 8 |
  | the figure height is constant across every caption, both locales | 7 |
  | the figure height is constant across every table the visitor can tap | 7 |
  | the hold frame is byte-identical to the reduced-motion frame | 5 |
  | the clock never runs backwards after a pause | 5 |
  | off screen and hidden tab pause, and both resume | 2 |
  | reduced motion turned off starts the loop | 2 |
  | the backing store refits when the ratio changes | 4 |
  | no JavaScript leaves prose, not an empty frame | 9 |
  | the spacing inside the live readout row is constant across every table, both plans | 7 |
  | on an in-view load the story starts within three seconds and the peak is not the first caption | 5 |

  The implementations live outside the repo, in `state/review/s-3b55` (round
  two's reviewer), `state/review/s-0b4b` (this bead's first round),
  `state/review/s-4a6c` (its reviewer: `pickgap.mjs`, `firstview.mjs` and the
  `loophole/` fixtures) and `state/review/s-4222` (the fix round, every probe
  rerun), because each needs two probe routes that are not committed: one
  mounting the demo alone, one putting it in a resizable column. Copy them into
  an archived build of your branch rather than writing them again. If they
  have gone stale, the table above is the contract and the scripts are only
  one way to satisfy it. Headless Chromium on this box needs the vendored
  libraries: `LD_LIBRARY_PATH=/home/daniel/hq/ops/vendor/browserlibs`.
- Four screenshots captured and read back: light desktop, dark desktop, 390px,
  reduced motion. Read them. A shot nobody looked at is not evidence.
