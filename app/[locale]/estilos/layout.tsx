import type { ReactNode } from "react";
import { sceneFontVariables } from "./fonts";

/**
 * The style samples' typefaces, loaded for this route and no other. They live
 * in a layout of their own, one step above the page, because next/font is a
 * build-time transform: the suites that render every page.tsx outside Next
 * (app/[locale]/ads-claim.test.ts) cannot call it, and a page that imported
 * the fonts itself would fail them. The wrapper only carries the font
 * variables down to the page; estilos.css takes it out of the layout.
 */
export default function EstilosLayout({ children }: { children: ReactNode }) {
  return <div className={"est-fonts " + sceneFontVariables}>{children}</div>;
}
