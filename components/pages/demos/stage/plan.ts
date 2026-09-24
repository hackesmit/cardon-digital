/**
 * The demos' one breakpoint (moved here from ./floor.ts by bead hq-3pfhe.7).
 *
 * It belongs to the stage and not to any one demo's data, because demos.css
 * is one stylesheet and all three figures reflow at the same container width.
 * ./useDemoStage.ts is the only caller that decides a plan with it; a demo is
 * told which plan it got.
 */

/**
 * The one breakpoint the demos have: under this the floor reflows to the phone
 * plan. It is measured on the figure's content box, which is the box
 * demos.css makes its query container, so the stylesheet and the component
 * always pick the same plan. Round two's cross-vendor review found the old
 * pair, a canvas-width check in JS against a viewport media query in CSS,
 * disagreeing for any demo in a column narrower than the page: a phone floor
 * plan drawn under a desktop stylesheet, with hover plates and a placeholder
 * 180px short of the canvas it was holding space for.
 */
export const PHONE_MAX = 640;

/**
 * Which floor plan a container of `contentWidth` CSS pixels gets.
 *
 * The comparison is `< PHONE_MAX` and demos.css asks the same question as a
 * range query, `(width < 640px)` against `(width >= 640px)`, because those two
 * partition the number line and `(max-width: 639px)` against
 * `(min-width: 640px)` does not. Round two shipped that pair, so a content box
 * anywhere in (639, 640) matched neither query: the component drew the three
 * by four phone board with 54px hotspots under the desktop stylesheet against
 * a 422px placeholder, a 214px first layout shift in a window about half a
 * pixel wide (reviewer s-3b55, BLOCKING 2, reproduced by breakpoint.mjs).
 *
 * The other half of that bug was the measurement. A container query reads the
 * fractional content box while clientWidth is rounded, so a component asking
 * clientWidth rounds 639.25 up into the far side of its own breakpoint even
 * when the two conditions do meet. Callers must pass the fractional width;
 * demos.test.ts sweeps this function and the stylesheet's own queries in
 * quarter pixels and fails unless they agree at every step.
 */
export function isPhonePlan(contentWidth: number): boolean {
  return contentWidth < PHONE_MAX;
}
