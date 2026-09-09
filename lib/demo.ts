import { localePath, type Locale } from "./i18n/config";
import { moduleIds, type ModuleId } from "./pricing";

/**
 * Where a demo button points, in one place.
 *
 * The demo host deployed at bead hq-ko3a0.6: https://cardon-demo.vercel.app.
 * demo.cardondigital.com follows once the domain switch lands (console command
 * c-f0a92a4ecebb); when that happens, this one constant is the only edit and
 * every button on the site moves with it. Each button carries its own list of
 * modules in the ?modulos= query, comma separated, matching enkanto-system's
 * js/demo/config.js module ids (produccion, hospitalidad, restaurante).
 */
export const DEMO_HOST: string = "https://cardon-demo.vercel.app";

/** The placeholder path, locale prefixed, the same one /modulos uses. */
export const DEMO_PATH = "/demo";

/** True once the demo host is set, which is what hides the "coming" label. */
export const demoIsLive = DEMO_HOST !== "";

/** Every module at once, which is the fourth button in the row. */
export const allModules: readonly ModuleId[] = moduleIds;

/**
 * The href for a demo of exactly these modules. Before the host is up this is
 * the locale-prefixed placeholder, so the button still lands somewhere on our
 * own site rather than on a dead external address. Once the host is set, an
 * empty module list means all three (the demo host's own default), so "all
 * three" is sent explicitly rather than relying on that default matching ours.
 */
export function demoHref(locale: Locale, modules: readonly ModuleId[]): string {
  if (!demoIsLive) return localePath(locale, DEMO_PATH);
  return `${DEMO_HOST}/?modulos=${modules.join(",")}`;
}
