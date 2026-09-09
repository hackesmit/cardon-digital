import type { Dict } from "./rich";

/**
 * The temporary showcase home (bead hq-wrig5.3). While this round runs, the
 * home route shows what we are opening: the three modules, a demo per module,
 * a summary of how pricing works, and the diagnostic. The official home stays
 * in the repo and comes back when the SHOWCASE flag is unset, so this
 * dictionary is written to be deletable in one commit and shares no strings
 * with lib/i18n/home.ts.
 *
 * No figure lives in this file and none may ever be typed into it. A public
 * entry price never travels away from the feature list that produced it
 * (pricing-features.md 3.7 rule 3, restated in pricing-modules.md 8.1), and
 * that list is printed on /precios, which is the only page that carries the
 * figures. What this page may carry is the fee shape and the combination and
 * annual rules stated as policy, which is what it does.
 *
 * Module names, tags and one-line summaries are written here rather than read
 * out of the modules or pricing dictionaries, which is the house idiom: those
 * two files already carry their own copy for the same three modules, because
 * each surface says it in its own voice and at its own length.
 */

/** One module card: the name, what it is, and the button to its own demo. */
export type ShowcaseModule = {
  id: string;
  num: string;
  name: string;
  tag: string;
  line: string;
  demo: string;
};

const en = {
  meta: {
    title:
      "Cardon Digital | The three modules: Produccion, Hospitalidad and Restaurante",
    description:
      "The winery record, the lodging calendar and the point of sale, as three modules you buy one, two or three of. A demo per module, a published entry price per module, and the diagnostic that sets the quote.",
  },

  hero: {
    aria: "Introduction",
    eyebrow: "The system, module by module",
    t1: "Three modules. ",
    accent: "Produccion, Hospitalidad and Restaurante.",
    sub: "Produccion is the record of what you grew, made and sold. Hospitalidad is every booking from every channel in one calendar. Restaurante is the point of sale, from the waiter's phone to the cash cut. **You buy one, two or three, at the size of the operation in front of you.**",
    ctaDemos: "See the demos",
    ctaModules: "See the three modules",
  },

  demos: {
    kicker: "The demos",
    title: "One demo per module, with a single module switched on.",
    sub: "Each demo runs on a made-up brand with illustrative data, no signup and no password. **Nothing you see in one belongs to a client.**",
    soon: "coming",
    note: "The demos open shortly. **The buttons are here so you know where they will be.** The demo host is not live yet, so none of them opens anything today.",
    modulesLead: "Every feature, every size band and the seven ways they combine:",
    modulesCta: "See the three modules",
    modules: [
      {
        id: "produccion",
        num: "01",
        name: "Produccion",
        tag: "The record of the harvest, the cellar and the sale",
        line: "Weights, lots, tanks, lab, barrel and bottling in one record, this vintage plotted beside the prior ones, and the commercial side sitting next to it.",
        demo: "Open the Produccion demo",
      },
      {
        id: "hospitalidad",
        num: "02",
        name: "Hospitalidad",
        tag: "Every booking in one calendar, and the day the property works from",
        line: "Every channel in one calendar, the day view, the unit board with housekeeping on a phone, the guest kept between stays and revenue by channel.",
        demo: "Open the Hospitalidad demo",
      },
      {
        id: "restaurante",
        num: "03",
        name: "Restaurante",
        tag: "From the waiter's phone to the cash cut",
        line: "The order on the phone, the kitchen screen, the table map, the bill split and paid, and a day that closes with a cut.",
        demo: "Open the Restaurante demo",
      },
    ] as ShowcaseModule[],
  },

  pricing: {
    kicker: "What it costs",
    title: "Every module has a published entry price.",
    sub: "The setup fee pays for the build, and you own what we build. The monthly service fee pays for running it: hosting, care, corrections, the monthly report and the assistant. **When the service ends, nothing moves between accounts.**",
    rules: [
      "One entry price per module, printed next to the complete build that produced it. **A figure goes where its list goes, so both live on the pricing page.**",
      "The shared service base is charged once per client, whether you buy one module or three. Each module adds only its own run cost on top.",
      "In the build, the largest module goes at full price, the second is 10 percent less and the third 12 percent less. A year paid up front costs less than twelve monthly payments.",
    ],
    note: "An entry price only moves up: more sources, more units, more tables, more vintages, a connector, a second module. It never moves down. **The Growth Diagnostic sets the final quote.**",
    cta: "See the entry prices",
  },

  close: {
    desc: "Which modules, at which size, and what gets built first is what the Diagnostic answers before anybody quotes anything. **Ten working days going through your data, your bookings, your floor and your numbers as one system.**",
    specs: [
      "**Day 1.** A working session over the operation you actually run, module by module.",
      "**Days 2 to 9.** We dig: the sources, the channels, the floor, the measurement and the numbers behind the numbers.",
      "**Day 10.** The memo lands: what is true, what is broken, and which module earns its place first.",
      "**Free and unattached.** Use it with us or without us. If we build, the price is agreed at the start and you own the result.",
    ],
    ctaContact: "Other ways to reach us",
  },
};

const es: typeof en = {
  meta: {
    title:
      "Cardon Digital | Los tres módulos: Producción, Hospitalidad y Restaurante",
    description:
      "El registro de la bodega, el calendario del hospedaje y el punto de venta, en tres módulos de los que se compra uno, dos o tres. Un demo por módulo, un precio de entrada publicado por módulo, y el Diagnóstico que fija la cotización.",
  },

  hero: {
    aria: "Presentación",
    eyebrow: "El sistema, módulo por módulo",
    t1: "Tres módulos. ",
    accent: "Producción, Hospitalidad y Restaurante.",
    sub: "Producción es el registro de lo que cultivó, elaboró y vendió. Hospitalidad es cada reserva de cada canal en un solo calendario. Restaurante es el punto de venta, del teléfono del mesero al corte de caja. **Se compra uno, dos o los tres, del tamaño de la operación que tiene enfrente.**",
    ctaDemos: "Ver los demos",
    ctaModules: "Ver los tres módulos",
  },

  demos: {
    kicker: "Los demos",
    title: "Un demo por módulo, con un solo módulo encendido.",
    sub: "Cada demo corre sobre una marca ficticia con datos ilustrativos, sin registro y sin contraseña. **Nada de lo que ve ahí es de un cliente.**",
    soon: "pronto",
    note: "Los demos abren en breve. **Los botones están aquí para que sepa dónde van a estar.** El demo todavía no está arriba, así que hoy ninguno abre nada.",
    modulesLead:
      "Cada función, cada banda de tamaño y las siete formas en que se combinan:",
    modulesCta: "Ver los tres módulos",
    modules: [
      {
        id: "produccion",
        num: "01",
        name: "Producción",
        tag: "El registro de la cosecha, la cava y la venta",
        line: "Pesos, lotes, tanques, laboratorio, barrica y embotellado en un solo registro, esta añada junto a las anteriores, y la parte comercial al lado.",
        demo: "Abrir el demo de Producción",
      },
      {
        id: "hospitalidad",
        num: "02",
        name: "Hospitalidad",
        tag: "Cada reserva en un calendario, y el día desde el que trabaja la propiedad",
        line: "Cada canal en un calendario, la vista del día, el tablero de unidades con la limpieza en el teléfono, el huésped guardado entre estancias y el ingreso por canal.",
        demo: "Abrir el demo de Hospitalidad",
      },
      {
        id: "restaurante",
        num: "03",
        name: "Restaurante",
        tag: "Del teléfono del mesero al corte de caja",
        line: "La orden en el teléfono, la pantalla de cocina, el mapa de mesas, la cuenta dividida y cobrada, y el día que cierra con un corte.",
        demo: "Abrir el demo de Restaurante",
      },
    ] as ShowcaseModule[],
  },

  pricing: {
    kicker: "Lo que cuesta",
    title: "Cada módulo tiene su precio de entrada publicado.",
    sub: "La cuota de implementación paga la construcción, y lo construido queda suyo. La cuota mensual del servicio paga operarlo: hospedaje, cuidado, correcciones, el informe mensual y el asistente. **Si el servicio termina, no se mueve nada entre cuentas.**",
    rules: [
      "Un precio de entrada por módulo, impreso junto a la construcción completa que lo produjo. **La cifra va a donde va su lista, así que las dos viven en la página de precios.**",
      "La base de servicio compartida se cobra una sola vez por cliente, compre un módulo o los tres. Cada módulo agrega encima nada más su propio costo de operación.",
      "En la construcción, el módulo más grande va a precio completo, el segundo lleva 10 por ciento menos y el tercero 12 por ciento menos. Y un año pagado por adelantado cuesta menos que doce mensualidades.",
    ],
    note: "Un precio de entrada solo se mueve hacia arriba: más fuentes, más unidades, más mesas, más añadas, un conector, un segundo módulo. Nunca hacia abajo. **El Diagnóstico fija la cotización final.**",
    cta: "Ver los precios de entrada",
  },

  close: {
    desc: "Qué módulos, de qué tamaño y qué se construye primero es lo que responde el Diagnóstico antes de que nadie cotice nada. **Diez días hábiles revisando sus datos, sus reservas, su piso y sus números como un solo sistema.**",
    specs: [
      "**Día 1.** Una sesión de trabajo sobre la operación que de verdad corre, módulo por módulo.",
      "**Días 2 a 9.** Nos metemos: las fuentes, los canales, el piso, la medición y los números detrás de los números.",
      "**Día 10.** Llega el informe: qué es cierto, qué está roto y qué módulo se gana el primer lugar.",
      "**Sin costo y sin amarres.** Úselo con nosotros o sin nosotros. Si construimos, el precio se acuerda al inicio y el resultado queda suyo.",
    ],
    ctaContact: "Otras formas de escribirnos",
  },
};

export type ShowcaseDict = typeof en;
export const showcase: Dict<ShowcaseDict> = { en, es };
