/**
 * The temporary home swap (bead hq-wrig5.3). SHOWCASE=1 makes the home route
 * render the showcase; with the variable unset, or set to anything else, the
 * original home renders unchanged. Restoring the official home is therefore
 * one environment change and a redeploy, the same shape as the COMING_SOON
 * gate in middleware.ts, and the original home is never deleted.
 *
 * The env object is a parameter so the rule is testable without mutating
 * process.env from a test. It is typed as the whole environment rather than a
 * one-key object because that is what process.env is.
 */
export function showcaseEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.SHOWCASE === "1";
}
