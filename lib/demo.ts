import { localePath, type Locale } from "./i18n/config";
import { moduleIds, type ModuleId } from "./pricing";

/**
 * Where a demo button points, in one place.
 *
 * The demo host is https://demo.cardondigital.com, live over TLS since bead
 * hq-c68jn. It was first deployed at hq-ko3a0.6 as
 * https://cardon-demo.vercel.app, which still serves the same demo and stays in
 * enkanto-system's HOSTS_DEMO, because links already sent to prospects point at
 * it. The switch was one edit to this constant and every button on the site
 * moved with it. Each button carries its own list of modules in the ?modulos=
 * query, comma separated, matching enkanto-system's js/demo/config.js module
 * ids (produccion, hospitalidad, restaurante).
 */
export const DEMO_HOST: string = "https://demo.cardondigital.com";

/** The placeholder path, locale prefixed. */
export const DEMO_PATH = "/demo";

/** True once the demo host is set, which is what hides the "coming" label. */
export const demoIsLive = DEMO_HOST !== "";

/** Every module at once, which is the fourth button in the row. */
export const allModules: readonly ModuleId[] = moduleIds;

/**
 * The href for a demo of exactly these modules. Before the host is up this is
 * the locale-prefixed placeholder /demo, which renders the holding page (it
 * does not redirect while the host is cleared), so the button lands on our own
 * site rather than on a dead external address or a redirect loop back to
 * itself. Once the host is set, /demo redirects there and an empty module list
 * would mean all three (the demo host's own default), so "all three" is sent
 * explicitly rather than relying on that default matching ours.
 */
export function demoHref(locale: Locale, modules: readonly ModuleId[]): string {
  if (!demoIsLive) return localePath(locale, DEMO_PATH);
  return `${DEMO_HOST}/?modulos=${modules.join(",")}`;
}
