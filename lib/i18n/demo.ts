import type { Dict } from "./rich";

/**
 * The /demo holding page. Every demo button on the site points at demoHref
 * (lib/demo.ts); while the demo host is cleared that fallback is this route,
 * so the button lands here rather than on the 404 page or, worse, in a
 * redirect loop back to itself. The page says the demos are not open yet,
 * names the three modules, and points the reader at the modules page, the
 * pricing page and the free diagnostic. It carries a noindex directive: this
 * is a holding page and not one we want found.
 */

const en = {
  meta: {
    title: "Demos",
    description:
      "The interactive demos are not open yet. See the three modules, the pricing and the free Growth Diagnostic in the meantime.",
  },
  eyebrow: "Demos",
  title: "The demos are not open yet",
  lead: "The interactive demos are being finished. Each one walks a working module with sample data, and they open here shortly. Until then, here is where to look.",
  modulesLead: "Three modules, one demo each:",
  modules: [
    {
      name: "Produccion",
      body: "The winery's record of what it grew, made and sold, dated and answered from one place.",
    },
    {
      name: "Hospitalidad",
      body: "Every booking from every channel in one calendar, with the day view the property works from.",
    },
    {
      name: "Restaurante",
      body: "The point of sale, from the waiter's phone to the cash cut that reconciles.",
    },
  ],
  linksLead: "While the demos are being finished:",
  links: {
    modules: "See the three modules",
    pricing: "See the pricing",
  },
};

const es: typeof en = {
  meta: {
    title: "Demos",
    description:
      "Los demos interactivos todavía no están abiertos. Mientras tanto, vea los tres módulos, los precios y el Diagnóstico de Crecimiento sin costo.",
  },
  eyebrow: "Demos",
  title: "Los demos todavía no están abiertos",
  lead: "Estamos terminando los demos interactivos. Cada uno recorre un módulo funcionando con datos de muestra, y abren aquí muy pronto. Mientras tanto, aquí es dónde mirar.",
  modulesLead: "Tres módulos, un demo cada uno:",
  modules: [
    {
      name: "Producción",
      body: "El registro de la bodega de lo que cultivó, produjo y vendió, con fecha y respondido desde un solo lugar.",
    },
    {
      name: "Hospitalidad",
      body: "Cada reserva de cada canal en un solo calendario, con la vista del día desde la que trabaja la propiedad.",
    },
    {
      name: "Restaurante",
      body: "El punto de venta, del teléfono del mesero al corte de caja que cuadra.",
    },
  ],
  linksLead: "Mientras terminamos los demos:",
  links: {
    modules: "Vea los tres módulos",
    pricing: "Vea los precios",
  },
};

export type DemoDict = typeof en;
export const demoPage: Dict<DemoDict> = { en, es };
