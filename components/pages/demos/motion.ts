/**
 * When a module demo is allowed to animate, and how it learns it is on screen
 * (bead hq-3pfhe.1, threshold fixed in hq-3pfhe.6).
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

import { clearsThreshold } from "@/lib/onscreen";

/** How much of the figure has to be in view before it counts as on screen.
    Round two declared this and then stored entry.isIntersecting, which both
    reviews read as animating off a one pixel sliver. Measured, it does not:
    with a single scalar threshold the spec makes isIntersecting threshold
    aware, and the demo did not animate at 3 or 9 percent before this changed
    either. @/lib/onscreen owns the reading anyway, for the reason given there:
    the coupling breaks the moment a threshold array is used, and a callback
    that names its threshold cannot be misread by a fourth reader. */
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
 *
 * "On screen" means ONSCREEN_THRESHOLD of the figure is in view, judged on the
 * entry's ratio rather than on isIntersecting: see @/lib/onscreen.
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
    (entries) =>
      onChange(
        clearsThreshold(entries[entries.length - 1], ONSCREEN_THRESHOLD)
      ),
    { threshold: ONSCREEN_THRESHOLD }
  );
  io.observe(el);
  return () => io.disconnect();
}
