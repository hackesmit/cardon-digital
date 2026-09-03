import type { Dict } from "./rich";

/** Pre-launch holding page (served on both locales by the COMING_SOON gate). */

const en = {
  meta: {
    title: "Cardon Digital",
    description:
      "Growth systems for owner-run businesses in the US and Mexico. The full site is on its way.",
  },
  line: "Your ads, your site, your operations. One living system.",
  sub: "The full site is being assembled. If you would rather not wait:",
  mailSubject: "Growth Diagnostic",
};

const es: typeof en = {
  meta: {
    title: "Cardon Digital",
    description:
      "Sistemas de crecimiento para bodegas del Valle de Guadalupe y Ensenada. El sitio completo va en camino.",
  },
  line: "Su cosecha, su bodega, sus cuentas. Un solo sistema.",
  sub: "Estamos armando el sitio completo. Si prefiere no esperar:",
  mailSubject: "Diagnóstico de Crecimiento",
};

export type ComingSoonDict = typeof en;
export const comingSoon: Dict<ComingSoonDict> = { en, es };
