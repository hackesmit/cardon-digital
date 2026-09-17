# The module demos: how one is built

Three demos sit on the modules pages, one per module: Produccion wearing
`--primary`, Hospitalidad wearing `--secondary`, Restaurante wearing
`--energy`. Restaurante is built (`components/pages/demos/RestauranteDemo.tsx`)
and is the reference.

This file used to be eleven rules and an instruction to copy the reference's
measuring and clock code as it stood, with a test pinning the spellings. That
failed, and it is worth saying how, because it is the reason the file now
reads the way it does. Three generations of checks on how a demo was WRITTEN
were each defeated within the evening: a reviewer's demo two, written by
copying exactly as instructed, passed every check while it froze for the life
of the page, ran its clock backwards from 19:55 to 17:00 on every resume, grew
a box 8px with its second digit, and left twelve dead buttons on a page with
scripting off (bead hq-3pfhe.7, `state/review/s-5836`). A rule about a
spelling is satisfied by the spelling. Eleven rules for the next two authors
is what failed.

So there are no rules to follow here. There is a mechanism to call, which
makes most of those defects impossible to write, and a harness that mounts
your demo and judges what it does, which catches the rest whatever you called
things.

---

## 1. What you write

A demo is three things, and only the first two are yours.

**A pure data module** (`floor.ts` is Restaurante's; yours is a `cellar.ts` or
a `fortnight.ts`). The room, the numbers, the loop's timeline, the captions
that timeline resolves to, the composition's vertical bands. No canvas, no
DOM. Every number the payoff frame depends on is then checkable without a
browser, and `demos.test.ts` runs about seventy such assertions in under a
second.

**A scene**, which is a `DemoScene` from `stage/useDemoStage.ts`:

| field | what it is |
| --- | --- |
| `hue` | the one brand hue this demo wears |
| `clock` | `{ cycle, standing }`: the loop's length in seconds, and where in it the demo stands when it may not move |
| `height(W, phone)` | the composition's height at a width and plan |
| `layout(env)` | rebuild geometry; called when the width, height or plan changed |
| `draw(env, cycT)` | draw the loop at `cycT` seconds on a cleared canvas, and do nothing else |
| `hotspots(env)` | where each hotspot sits, as fractions of the board |
| `live` | the texts the loop rewrites in the DOM, each as a set of named values and a function from `cycT` to the name showing |

`draw` is the whole of your animation, and that is meant literally: anything
that moves is either drawn by `draw` or is a `live` text. There is no third
way. A bar in the readout strip animated by a loop of your own has asked
nobody whether it may run, and the s-2e55 review measured one doing 13.7 to
26.2 in half a second under prefers-reduced-motion. If a thing should move,
draw it on the canvas from `cycT`.

`draw` is a function of its two arguments. It is called with the clock's
reading and keeps no memory between calls, because the same call draws the
running loop, the paused board and the reduced-motion frame. It never sees the
clock itself, and it must not grow one: it is called once per frame, so a
counter in its closure is a second clock, and the same review ran a story
backwards with one. This is checked (section 3): the suite draws your scene at
the same reading twice and then backwards, and every reading has to be one
frame.

**Where the scene is built does not matter.** `RestauranteDemo.tsx` builds it
behind `useMemo` so the geometry is not rebuilt on every tap, and that is an
economy, not a rule. A scene built in the component body is a new object on
every render; the stage treats a new object as a new picture at the same
moment (it runs `layout`, places the hotspots, rewrites the words and repaints
at the reading the clock already has) and never as a new story. What a scene
cannot change after the mount is its `clock`: the stage reads `cycle` and
`standing` once.

**Markup**, through `<DemoFigure>`, `<Hotspot>` and `<PickBox>` from
`stage/DemoFigure.tsx`. You pass the title, the dictionary's honest label, the
fallback prose, the hint, your hotspots and your readout rows. Read
`RestauranteDemo.tsx` from `export default` down: it is sixty lines.

## 2. What you do not write, and what each piece is for

Everything below lived inside `RestauranteDemo.tsx` and was copied. It is now
in `components/pages/demos/stage/` and is called. Each entry is a defect that
shipped at least once.

**The clock (`clock.ts`).** It stands on `standing` until started and whenever
parked; the first `start()` begins the story at 0 and every later one resumes
from `standing`; it only moves forward. It has no reset and no flag to reach,
and the stage never hands it to a scene. Round two drew its standing frame
behind the clock's back, so scrolling away at 18:10 snapped the board to 19:55
and scrolling back read 18:10 again. The fix parked the clock at mount, so an
in-view load opened on the ending, held still for five and a half seconds.
The fix for that was a never-ran flag, and the s-5836 demo reset the flag in
`stop()`. A demo that does not own its clock cannot do any of the three.
Choose `standing` as the FIRST frame of your hold: the last frame draws the
same pixels, but a demo parked there dips into the loop seam the moment it
resumes.

**The stage's lifetime.** The clock, the gates and the observers are built
once per mount and live exactly as long as it. The stage's effect used to
depend on the scene object, so its lifetime was the scene's identity, and
identity belongs to the caller: the s-2e55 demo built its scene in the
component body, every tap re-rendered, the stage was torn down and the new
clock's first start told the story from the top. A visitor who tapped a tank
in the hold read 'servicio en su punto' and then 'empieza el servicio'. The
effect now has no dependencies, the clock sits in a ref besides, and a new
scene arrives through a handler that swaps the picture and does not touch the
time. One way to restart a story is left, because it is React's definition of
a new component and not the stage's to refuse: a `key` on `<DemoFigure>` that
changes. Do not key the figure on anything a visitor can change; the tap check
in section 3 fails a demo that does.

**The three motion gates.** A demo animates only when the visitor has not
asked for reduced motion, the tab is in front, and the figure is on screen.
`useDemoStage` installs the observer unconditionally, through
`observeOnscreen` in `motion.ts`, and every listener asks one question,
`shouldAnimate`, and answers it one way: run, or stand on the standing frame.
Round one built its observer in the branch reduced motion skips, so a page
loaded under reduce never learned it was on screen and stayed frozen after the
preference was turned off. The s-5836 demo did it again, behind a discarded
`observeOnscreen` call, with the suite green. A demo that does not build an
observer cannot throw one away.

**Measuring.** The plan is decided on the figure's fractional layout content
box, which is what the container query in `demos.css` reads: the
`ResizeObserver`'s `contentRect.width`, with a rect-derived value only before
the observer has spoken, and the first delivery re-running the layout
synchronously. `clientWidth` is rounded, so a 639.25px box read as 640 and
picked the wide plan under the phone stylesheet. `getBoundingClientRect` is
the painted box, wrong under any scaled ancestor. The drawing width is
`canvas.clientWidth`, which is right for a pixel grid and wrong for the plan:
two jobs, two reads. 639.6 and 640.2 round to one integer and are different
plans, so a plan change is a resize whatever the rounded width says. The stage
publishes the plan it chose as `data-plan` on `.demo-stage`. The breakpoint
itself is `stage/plan.ts`, and `demos.test.ts` sweeps every `@container`
condition in the stylesheet against it in quarter pixels.

**The device pixel ratio.** Capped at 2, and refitted when it changes with no
resize: a resolution media query re-armed each time it fires, which is the
only thing that reaches a standing demo, plus a comparison inside the running
loop, which is the half a headless browser can demonstrate.

**Every DOM write the loop makes.** A scene cannot write text. It names which
of a fixed set of values is showing (`live[n].at(cycT)` returns a key), and
the frame has already rendered every value of that set as an invisible ghost
in the same grid cell, so the box is the longest value's size at every width
and in every locale. The caption under Restaurante's board is four phases of
different lengths, and written into a wrapping row it reflowed the page 31px
twice per cycle. The s-5836 demo wrote a second value, a covers count, through
`firstChild.nodeValue` into a bare span, which no census of `textContent`
writes could see. A value with no ghost now has no way to be said. If your
demo needs a number that changes every frame, draw it on the canvas, as the
reference draws its clock.

**The readout the visitor changes (`<PickBox>`).** The same ghost box with a
different trigger: the live row plus a ghost for every readout including the
selected one, because a ghost set that changed with the selection would put
the selection back into the box's size. The live row is the `aria-live`
region; the ghosts are `aria-hidden`. `demos.css` pairs every ghost box with
`align-self: start` on its children, or the live row is stretched to the
tallest ghost and its lines spread apart.

**The frame (`<DemoFigure>`).** It renders the honest label, which is
therefore not something a demo can leave out: every number on every board is
invented and the frame says so. It imports `demos.css`, which round one
shipped with no importer at all. And it renders the `<noscript>` block, whose
hidden list names the canvas, the hotspot class and the hint, all three of
which are rendered by the frame and by `<Hotspot>` and by nothing else. With
scripting off the board is never drawn and the hotspots never answer, so the
written description is the whole figure; the hint goes with the buttons
because it tells the visitor to choose one. The s-5836 demo kept its own
hand-written list honest by renaming its buttons and its hint out of it. The
readout strip stays: it is resolved from the first render.

## 3. What is checked, and how

Nothing below reads your source for a spelling, and there is no comment
stripper to confuse: the old one was a regex, and two string literals holding
the comment delimiters erased every line between them from the checked text.

**`contract.test.tsx`: every demo, mounted.** Every `.tsx` in
`components/pages/demos/` is found by listing the directory and mounted under
jsdom on a page (`contract/world.tsx`) whose IntersectionObserver,
ResizeObserver, matchMedia, tab visibility, requestAnimationFrame and 2d
context are stand-ins installed on the globals. However a component reaches
the observer's constructor, it arrives at the stand-in. The checks
(`contract/checks.tsx`) then do what a visitor or a browser does:

| it does | and fails if |
| --- | --- |
| mounts under reduced motion, reports the figure on screen, waits | no standing frame was drawn, or it set styles and painted nothing, or anything moved |
| loads under reduce, then turns reduce off | fewer than ten frames follow in two seconds |
| loads in view and watches three seconds | the standing frame is among the first frames: the story opened on its ending |
| scrolls away, comes back; hides the tab, comes back | the paused board is not the standing frame, or any frame in the second after the return is not the frame it was parked on, or the loop never leaves the hold again |
| counts observers at the global | one was constructed outside `observeOnscreen` |
| taps a hotspot three seconds into the story, and again inside the hold | the frames after the tap are not the frames of a visitor who made the same choice before the story began, or the hold stops being still: the tap moved time |
| loads under reduce; hides the tab; scrolls away; and each time watches the whole page for a second and a half | a frame was asked for by anybody, or any canvas was drawn on, or a scroll position was set, or anything on the page was mutated, any attribute included and a portal included; a page loaded under reduce is watched from its first moment: timers run on the page's clock, so a `setInterval` is seen as surely as a frame loop |
| takes the scene the mounted demo handed the stage and draws six readings in order, again, and backwards | any reading drew a different frame the second or third time, or a `live` text answered differently: `draw` has a memory. Also if a frame leaves state on the context, a `save()` with no `restore()` or a `translate` outside a pair, because the next frame is drawn under it |
| watches every DOM mutation across a full cycle, then taps every button | text was written outside a ghost box, or a live child holds a value no ghost reserves, or the loop changed any attribute of anything |
| looks for `aria-live` and the live roles in the mounted tree | one sits outside a ghost box |
| mounts, runs the loop, taps every button, then looks for anything operable | something operable is on the live page that the noscript rule does not name: a control that only exists once an effect has run is invisible to the static render below |
| renders to static markup and reads the noscript rule against it | a canvas, anything operable, or any string the dictionary files under `hint` is still on the page; or the fallback, the honest label or the readout is not |
| delivers 639.6, 640.2 and 639.9 under an ancestor scaled by two | `data-plan` is not phone, wide, phone, or the backing store is not the layout width |

Two of those three are checks because there is nothing to construct. The
stage owns the clock, the gates and the canvas because a demo has to be handed
them; it cannot own `requestAnimationFrame` or the DOM, and it cannot take a
closure's memory away, so the page is judged whole and `draw` is asked twice.
The tap row is different: the stage makes it true for every demo that does not
re-key its figure, and the check is there for the one that does. None of this
is a promise against an author who sets out to defeat it. It is a promise that
an author acting in good faith, who makes the mistakes the last three reviews
made on purpose, is told so by a red test.

Three consequences for your timeline, since the harness is black-box: the
standing frame must not appear in the first three seconds of the story, the
hold must draw the standing frame unchanged for at least a second and end
within twenty, and one cycle must fit in sixty seconds. The stylesheet decides
what a ghost box is (`X > *` with `grid-area: 1 / 1`), so a new box added to
`demos.css` is under the contract without being registered anywhere.

**`source.test.ts`: four AST rules**, parsed with `ts.createSourceFile`, for
what a mount cannot reach (a branch it did not take, a way around its
stand-ins):

1. No read of `window`, `globalThis` or `self` through a key that is not a
   literal, no passing them around as values, no `Reflect`, `eval` or
   `Function`, no `defaultView`, and no naming `IntersectionObserver`, as
   identifier, property or string.
2. Anything operable (`button`, `a`, `input`, `onClick`, `role="button"`,
   `tabIndex`) carries the hotspot class the noscript rule hides. Render a
   `<Hotspot>`.
3. Anything with `aria-live`, or a role of status, alert or log, or a role
   that cannot be read, sits inside a ghost box. Render a `<PickBox>`.
4. The demo renders `<DemoFigure>` and writes no `<noscript>` or `<style>` of
   its own, so the hidden list is derived from what the frame renders.

**`lib/onscreen.test.ts`: repo-wide.** No observer may read `isIntersecting`
behind a threshold array, and a new observer that declares a threshold goes
through `clearsThreshold` in `lib/onscreen.ts`. Why, briefly: in Chromium an
element 3 percent in view under a scalar threshold of 0.12 delivers ratio 0.03
with `isIntersecting` false, so the flag is not the geometric intersection
there; a cross-vendor reviewer reads the spec the other way, this box has no
Firefox or WebKit to settle it (hq-2u86a), and under a threshold array
starting at 0 the flag tracks the lowest entry in every reading. A ratio
comparison is the same answer in every engine. The nine existing callsites
that read `isIntersecting` behind a scalar threshold are counted per file and
are not a backlog to clear on your own reading of the spec. The s-5836 probe
walked around the alias resolver with `window[key]`, a concatenated name and
`Reflect.construct`; the test now refuses every use of the constructor that
is not a construction, a `typeof` or a type, refuses every computed read of a
global, and reads a callback passed by name where the file defines it.

**The loophole fixtures are in the tree.** `lib/testing/loopholes/demos/`
holds the four reviewer demos verbatim and
`lib/testing/loopholes/IndirectProbe.tsx.txt` the fifth, and each suite
asserts they fail and on what. They sit outside `components/` because they
are not visuals. A reviewer will also drop them beside your demo
and run the suite (`state/review/s-5836/loophole/run.sh`,
`state/review/s-4a6c/loophole/run.sh`). If a check genuinely does not fit your
demo, change the check and the demo in the same commit and say why in both.

## 4. What is still yours to get right

The mechanism cannot know these, and no test can know all of them.

**One hue, and the hue is the demo's own.** `scene.hue` for the canvas and
`--demo-accent` in `demos.css` for the DOM, and they agree. Every hue-bearing
value is derived from it: round two derived the structural hairline from
`--primary` whatever was asked, so Restaurante drew its room in Produccion's
green under red tables. `demos.test.ts` records which custom properties
`readDemoPalette` asks for and fails a brand token that is not the demo's own,
and a new field on `DemoPalette` has to be classified as hue-bearing or
neutral or the test fails. Light is the design default: tune on the cream
ground first, check dark second.

**The payoff frame.** A demo that may not animate is not a frozen first frame.
`standing` is the frame the loop exists to arrive at: for Restaurante the
fullest minute of the evening. Round one held on minute 360 of 360, where
every booking has ended, so the payoff frame was an empty cold room.

**The pre-hydration height.** `demos.css` writes your `height()` in container
query units, term for term, so the placeholder is the measured height at every
width. A flat number is right at one width and was 38 to 78px out elsewhere.
`.demo-stage` adds no padding, border or margin, which is what keeps the
drawing width, the plan's width and that `cqw` height one number, and
`demos.test.ts` fails the rule if a box-affecting property appears in it.
Write both sides of the breakpoint as a range pair, `(width < 640px)` against
`(width >= 640px)`: `(max-width: 639px)` against `(min-width: 640px)` leaves
(639, 640) matching neither. And `container-type: inline-size` contributes
nothing to intrinsic width, so in an `auto` grid track or a float the figure
collapses; that is for whoever mounts these (hq-3pfhe.4).

**Maps are contiguous, never floating shapes.** Daniel's call, 2026-09-15.
Every map a demo draws, vineyard, parcel, cellar or floor, draws its lots as a
contiguous block whose polygons share vertices with their neighbours. The
reference is the `PLOTS` table in `components/pages/case/VineyardMap.tsx`:
nine sections where A2's left edge IS A1's right edge and B1's top edge IS
A1's bottom edge. The contiguous version reads as one piece of land; the
floating one reads as nine stickers on paper.

**The copy.** Both locales, same keys, same placeholders; a caption for every
phase the timeline can reach and none it cannot. `demos.test.ts` holds the
Restaurante dictionary to that and yours needs the same.

---

## Before you call a demo done

- `npm test` and `npx tsc --noEmit` both exit 0.
- `npx next build` exits 0. It lints test files too.
- What only a browser can answer is measured in a browser, against a build of
  your branch, with the branch you started from served alongside as the
  control. jsdom has no layout: it cannot tell you that a container query and
  the stage agree at 639.25px, that a caption moved the figure 31px, or what
  `isIntersecting` does. The reference set:

  | what it checks |
  | --- |
  | both sides of the breakpoint agree, fractional widths |
  | the plan and the board geometry follow the layout box under a scaled ancestor |
  | the figure height is constant across every caption, both locales |
  | the figure height is constant across every table the visitor can tap |
  | the spacing inside the live readout row is constant across every table, both plans |
  | the hold frame is byte-identical to the reduced-motion frame |
  | the clock never runs backwards after a pause |
  | off screen and hidden tab pause, and both resume |
  | reduced motion turned off starts the loop |
  | on an in-view load the story starts within three seconds and the peak is not the first caption |
  | the backing store refits when the ratio changes |
  | no JavaScript leaves prose, not an empty frame |

  The implementations live outside the repo, in `state/review/s-3b55`,
  `s-0b4b`, `s-4a6c`, `s-4222`, `s-5836` and `s-7bb5` (this mechanism's own
  run of all of them), because each needs probe routes that are not committed:
  one mounting the demo alone, one in a resizable column, one with two demos
  on a page. Copy them into an archived build of your branch. If they have
  gone stale, the table is the contract and the scripts are one way to satisfy
  it. Note what `selection.mjs` taught: wait past the stage's 140ms debounce
  before believing a number. Headless Chromium on this box needs
  `LD_LIBRARY_PATH=/home/daniel/hq/ops/vendor/browserlibs`.
- Four screenshots captured and read back: light desktop, dark desktop, 390px,
  reduced motion. Read them. A shot nobody looked at is not evidence.
