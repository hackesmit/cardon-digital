/**
 * When a module demo is allowed to animate, and how it learns it is on screen
 * (bead hq-3pfhe.1).
 *
 * Three gates, and all three demos share them: the visitor's motion
 * preference, whether the tab is in front, and whether the figure is in the
 * viewport. A demo animates only when all three say yes, and it draws its
 * static frame the rest of the time.
 *
 * Why the observer lives here rather than in the component. Round one built
 * the IntersectionObserver in the else branch of `if (reduced())`, so a page
 * loaded under prefers-reduced-motion never learned it was on screen, and
 * turning the preference off later called start() into a gate that could never
 * open again: the demo was frozen for the life of the page. Both reviews
 * reproduced it. observeOnscreen takes no motion preference at all, so that
 * mistake cannot be expressed through this API, and demos.test.ts fails any
 * demo component that hand-rolls its own observer instead of calling it.
 */

/** How much of the figure has to be in view before it counts as on screen. */
export const ONSCREEN_THRESHOLD = 0.12;

export interface DemoMotionState {
  /** The visitor asked for reduced motion. */
  reduced: boolean;
  /** The tab is in front. */
  docVisible: boolean;
  /** The figure is in the viewport. */
  onscreen: boolean;
}

/** The one place the three gates are combined. */
export function shouldAnimate(s: DemoMotionState): boolean {
  return !s.reduced && s.docVisible && s.onscreen;
}

/**
 * Report whether `el` is on screen, now and whenever that changes, and return
 * the teardown.
 *
 * Installed unconditionally by every demo: being on screen is a fact about the
 * page, not an animation setting, so it is tracked whatever the motion
 * preference is and only shouldAnimate() consults the preference. Where there
 * is no IntersectionObserver the demo assumes it is on screen and leans on the
 * other two gates, which is the same bargain the old fallback branch made.
 */
export function observeOnscreen(
  el: Element,
  onChange: (onscreen: boolean) => void
): () => void {
  if (typeof IntersectionObserver === "undefined") {
    onChange(true);
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => onChange(entries[entries.length - 1].isIntersecting),
    { threshold: ONSCREEN_THRESHOLD }
  );
  io.observe(el);
  return () => io.disconnect();
}
