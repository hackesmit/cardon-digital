/**
 * Whether the case page renders its marked results placeholder.
 *
 * Bead hq-cczm.25. Daniel asked for the missing results section to be left on
 * the page as a clearly marked placeholder so the gap is visible while he
 * reviews. The block is internal copy, so the question is which way the
 * decision fails when the environment is not what anyone expected.
 *
 * It fails CLOSED. The first shape of this gate hid the block when
 * VERCEL_ENV was "production", which meant any build without that variable,
 * a self-hosted production start, a preview build served from the live
 * domain, a misconfigured project, published the block (cross-vendor review
 * round two). Hiding is now the default and showing is the exception:
 *
 *   next dev              shows it. This is where the copy gets read.
 *   SHOW_CASE_PENDING=1   shows it in a build, for a preview deploy that
 *                         wants the gap visible on a real URL.
 *   anything else         hides it, including every production build and
 *                         every build with no deployment metadata at all.
 *
 * With it hidden the live page simply carries no result claim for the system,
 * which is form 4 of the outcome framing rule (case-naming.md 6.2) and an
 * allowed way to ship a case. So the fallback is a page that says less, never
 * a page that shows an editorial note to a customer.
 */
/** Takes a bare record rather than NodeJS.ProcessEnv so the tests can ask
 *  what happens in an environment with nothing set at all. */
export function showsPending(env: Record<string, string | undefined>): boolean {
  if (env.SHOW_CASE_PENDING === "1") return true;
  return env.NODE_ENV !== "production";
}
