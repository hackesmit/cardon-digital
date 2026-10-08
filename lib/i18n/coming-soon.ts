import type { Dict } from "./rich";

/** Pre-launch holding page (served on both locales by the COMING_SOON gate). */

const en = {
  meta: {
    title: "Cardon Digital",
    description:
      "Growth systems for owner-run businesses in the US and Mexico. The full site is on its way.",
  },
  line: "Websites, ads and software for Ensenada businesses that want more clients and less work.",
  sub: "The full site is being assembled. If you would rather not wait:",
  mailSubject: "Growth Diagnostic",
};

const es: typeof en = {
  meta: {
    title: "Cardon Digital",
    description:
      "Sistemas para hacer crecer su bodega, en el Valle de Guadalupe y Ensenada. El sitio completo viene en camino.",
  },
  line: "Sitios web, anuncios y software para negocios de Ensenada que quieren más clientes y menos trabajo.",
  sub: "Estamos armando el sitio completo. Si prefiere no esperar:",
  mailSubject: "Diagnóstico de Crecimiento",
};

export type ComingSoonDict = typeof en;
export const comingSoon: Dict<ComingSoonDict> = { en, es };
