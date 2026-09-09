import { localePath, type Locale } from "./i18n/config";
import { moduleIds, type ModuleId } from "./pricing";

/**
 * Where a demo button points, in one place.
 *
 * The demo host is not up yet (bead hq-ko3a0.6). Until it deploys every button
 * goes to the /demo placeholder and carries the "coming" label beside it, so a
 * reader is told the button does not open anything today. When the host
 * deploys, set DEMO_HOST to it and every button on the site moves at once,
 * each one carrying its own list of modules in the query. Nothing else changes:
 * the labels, the layout and the "coming" flag all read off this module.
 */
export const DEMO_HOST = "";

/** The placeholder path, locale prefixed, the same one /modulos uses. */
export const DEMO_PATH = "/demo";

/** True once the demo host is set, which is what hides the "coming" label. */
export const demoIsLive = DEMO_HOST !== "";

/** Every module at once, which is the fourth button in the row. */
export const allModules: readonly ModuleId[] = moduleIds;

/**
 * The href for a demo of exactly these modules. Before the host is up this is
 * the locale-prefixed placeholder, so the button still lands somewhere on our
 * own site rather than on a dead external address.
 */
export function demoHref(locale: Locale, modules: readonly ModuleId[]): string {
  if (!demoIsLive) return localePath(locale, DEMO_PATH);
  return `${DEMO_HOST}/?modulos=${modules.join(",")}`;
}
