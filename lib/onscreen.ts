/**
 * The one place the repo turns an IntersectionObserver entry into "on screen"
 * (bead hq-3pfhe.6).
 *
 * WHAT entry.isIntersecting DOES HERE, measured rather than quoted. Both
 * reviews of the reference demo reported that a callback storing
 * entry.isIntersecting throws its threshold away, because isIntersecting is
 * true for any positive intersection, so a one pixel sliver of the figure
 * would start a 30fps canvas loop. In Chromium that does not reproduce: an
 * element 3 percent in view, under an observer declaring 0.12 or 0.35,
 * delivers ratio 0.03 with isIntersecting FALSE, both on the initial
 * observation and on a crossing that happens in one frame, and the demo did
 * not animate at 3 or 9 percent before this module existed either. Blink
 * derives the flag from the threshold index.
 *
 * That is one engine. A cross-vendor reviewer reads the spec the other way,
 * that isIntersecting is geometric and the threshold governs only when the
 * callback fires, and this box has no Firefox or WebKit build to settle it
 * with (bead hq-3pfhe.6; the open question is carried on hq-2u86a). Which is
 * the whole argument for this function: a boolean whose meaning two careful
 * readers disagree about, and which this box can only check in one of the
 * three engines the site ships to, is not a boolean to gate behaviour on.
 * A ratio comparison is the same answer in every engine.
 *
 * Measurements: state/review/s-0b4b/isintersecting-semantics.mjs and its two
 * companions; the behavioural control is sliver.mjs.
 *
 * Two more reasons, on top of the engine question:
 *
 *  1. Even in Blink the coupling holds only for a single scalar threshold.
 *     Give the same observer a threshold ARRAY that starts at 0, which is the
 *     ordinary way to ask for progress updates, and isIntersecting tracks the
 *     LOWEST entry in the list instead of the one the callback cares about:
 *     threshold [0, 0.35] at ratio 0.03 reports isIntersecting TRUE (measured,
 *     same script). A callback reading isIntersecting is therefore correct
 *     only while nobody adds a threshold, and adding one is a silent change of
 *     meaning in a file that never mentions it.
 *  2. Nothing in `if (entry.isIntersecting)` says which number it is keeping.
 *     Two authors and two reviewers read these callsites and came away with
 *     different beliefs about it, which is how this cost two review rounds.
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
