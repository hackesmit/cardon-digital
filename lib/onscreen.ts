/**
 * The one place the repo turns an IntersectionObserver entry into "on screen"
 * (bead hq-3pfhe.6).
 *
 * WHAT entry.isIntersecting ACTUALLY MEANS, measured rather than quoted. Both
 * reviews of the reference demo reported that a callback storing
 * entry.isIntersecting throws its threshold away, because isIntersecting is
 * true for any positive intersection, so a one pixel sliver of the figure
 * would start a 30fps canvas loop. That does not reproduce. The spec sets
 * isIntersecting from the threshold INDEX, not from a non-empty intersection,
 * and Chromium agrees: an element 3 percent in view, under an observer
 * declaring 0.12 or 0.35, delivers ratio 0.03 with isIntersecting FALSE, both
 * on the initial observation and on a crossing that happens in one frame.
 * state/review/s-0b4b/isintersecting-semantics{,2,3}.mjs are the measurements
 * and state/review/s-0b4b/sliver.mjs is the behavioural control: the demo did
 * not animate at 3 or 9 percent before this module existed either.
 *
 * So why the module. Two reasons, one real and one about reading:
 *
 *  1. The coupling only holds for a single scalar threshold. Give the same
 *     observer a threshold ARRAY that starts at 0, which is the ordinary way
 *     to ask for progress updates, and isIntersecting tracks the LOWEST entry
 *     in the list instead of the one the callback cares about: threshold
 *     [0, 0.35] at ratio 0.03 reports isIntersecting TRUE (measured, same
 *     script). A callback reading isIntersecting is therefore correct only
 *     while nobody adds a threshold, and adding one is a silent change of
 *     meaning in a file that never mentions it.
 *  2. Nothing in `if (entry.isIntersecting)` says which number it is keeping.
 *     Two authors and two reviewers read these callsites and came away with
 *     different beliefs about it, which is how a non-defect cost two review
 *     rounds. A callback that names its threshold cannot be misread.
 *
 * Pure, so it is a table test rather than a browser test.
 */

/** The fields of an IntersectionObserverEntry this decision needs. */
export interface OnscreenEntry {
  isIntersecting: boolean;
  intersectionRatio: number;
}

/**
 * Whether `entry` clears `threshold`, which is what the observer promised.
 *
 * isIntersecting is consulted first so a threshold of 0 keeps its natural
 * meaning, "any contact at all", including the degenerate zero-area element
 * whose ratio the spec reports as 1 while it does intersect. Above 0 the ratio
 * decides, whatever the threshold list happens to look like.
 */
export function clearsThreshold(entry: OnscreenEntry, threshold: number): boolean {
  if (!entry.isIntersecting) return false;
  return entry.intersectionRatio >= threshold;
}
