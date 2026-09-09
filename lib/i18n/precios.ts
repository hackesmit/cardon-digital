import type { Locale } from "./config";
import type { Dict } from "./rich";
import { formatPercent, mixDiscountByRank, type QuoteLine } from "../pricing";

/**
 * Pricing page copy. Spanish is written first, as it is on every page here.
 *
 * No figure lives in this file and none may ever be typed into it. Every
 * amount on /precios comes from lib/pricing.ts through its functions, and the
 * feature lists are rendered from the standard bundles in that same module, so
 * a price and the build that produced it cannot drift apart
 * (research/2026-09/pricing-features.md 3.7 rule 3).
 *
 * What this page may carry is fixed by pricing-modules.md 8.1: one entry price
 * per module beside the feature list that produced it, worked examples, the
 * combination and annual rules stated as policy, and the line that says the
 * Diagnostico sets the quote. The per-size table, the hours, the rates, the
 * scope factor, the concession percentages and the build-only prices never
 * reach a public surface, in any locale, on any page.
 */

const en = {
  meta: {
    title: "Pricing",
    description:
      "What each module costs to implement and to run: the entry price of Produccion, Hospitalidad and Restaurante beside the build that produced it, what buying more than one changes, and the terms.",
  },

  hero: {
    aria: "Introduction",
    eyebrow: "What it costs",
    t1: "Three modules. ",
    accent: "Each one has a published entry price.",
    sub: "The setup fee pays for the build, and you own what we build. The monthly service fee pays for running it: hosting, care, corrections, the monthly report and the assistant. **When the service ends, nothing moves between accounts:** we promote you to owner, hand over the payment method and remove our access.",
    ctaFloors: "See the entry prices",
    ctaModules: "See the three modules",
  },

  floors: {
    kicker: "Where each module starts",
    title: "The lowest price of each module, and what it buys.",
    sub: "Each figure below is the whole module at its entry size, bought on its own, next to the complete build that produced it. **It is not a trimmed version.** Below that build there is no system, only a report.",
    aloneLabel: "bought on its own",
    setupLabel: "To implement",
    monthlyLabel: "Every month",
    buildLabel: "The complete build",
    /**
     * No figures here on purpose. The shared base and a run cost are each
     * rounded to their own step in MXN and converted to USD separately, so a
     * printed split does not always add up to the printed total in either
     * currency, and a public figure that fails a reader's arithmetic is worse
     * than no figure. The rule is what sells the mix, so the rule is what runs.
     */
    monthlyNote:
      "The monthly is the shared service base, charged once per client, plus this module's own run cost.",
    note: "An entry price only moves up: more sources, more units, more tables, more vintages, a connector, a second module. It never moves down. **The Growth Diagnostic sets the final quote.**",
    modules: {
      produccion: {
        name: "Produccion",
        tag: "The record of the harvest, the cellar and the sale",
      },
      hospitalidad: {
        name: "Hospitalidad",
        tag: "Every booking in one calendar, and the day the property works from",
      },
      restaurante: {
        name: "Restaurante",
        tag: "From the waiter's phone to the cash cut",
      },
    },
  },

  /**
   * Feature names, keyed by the catalogue id in lib/pricing.ts. The page reads
   * the standard bundle out of the data module and looks each id up here, so a
   * bundle that changes shape changes the printed list with it. A missing id
   * fails the build rather than printing a slug.
   */
  features: {
    "production-record": "Production record",
    "vintage-comparison": "Vintage comparison",
    "commercial-record": "Commercial record",
    "historical-vintage-load": "One historical vintage loaded",
    "unit-and-stay-record": "Unit and stay record",
    "channel-feed-connector": "Booking channel connector",
    "master-calendar": "Master calendar",
    "day-view": "Day view",
    "unit-status-board": "Unit status board and housekeeping phone view",
    "guest-record": "Guest record",
    "occupancy-and-revenue-by-channel": "Occupancy and revenue by channel",
    "menu-categories-and-modifiers": "Menu, categories and modifiers",
    "order-taking-on-the-phone": "Order taking on the waiter's phone",
    "send-to-kitchen-and-course-firing": "Send to kitchen and course firing",
    "kitchen-screen": "Kitchen screen",
    "table-map-and-host-screen": "Table map and host screen",
    "checkout-with-split-and-tip": "Checkout with split and tip",
    "cash-and-manually-recorded-card": "Cash and card recorded by hand",
    "invoice-request-capture": "Invoice request capture",
    "cancellations-and-comps-log": "Cancellations and comps log",
    "daily-summary": "Daily summary",
    "cash-cut": "Cash cut",
    "monthly-report-generator": "Monthly report generator",
    "the-assistant": "The assistant over your own records",
    "training-and-handover-pack": "Training and handover pack",
  } as Record<string, string>,

  /** Multiplicity, appended when a bundle carries a feature more than once. */
  countSuffix: " x {n}",

  /** The three entry-price cards are worked examples 1 to 3, so each one says who it is for. */
  examples: {
    produccion:
      "A winery with one production site, one brand, two data sources and one prior vintage.",
    hospitalidad: "A six-unit property on two booking channels.",
    restaurante:
      "A twelve-table restaurant, one station, four phones and one kitchen screen.",
  } as Record<string, string>,

  mix: {
    kicker: "More than one module",
    title: "Two modules, or three, and what changes.",
    sub: "The saving comes from two places and both are real. **The second module is a smaller build,** because the training, the assistant frame, the report generator and the environment are already standing. And one client is one relationship, so the shared part of the monthly fee is charged once however many modules you buy.",
    /**
     * The percentages are placeholders, filled from `mixDiscountByRank` by
     * mixRules() below. A published policy figure that is typed here can drift
     * from the calculation the day the data changes, which is the whole reason
     * no figure lives in this file (Lucy 2026-09-08, seventh finding).
     */
    rules: [
      "The shared service base is charged once, whatever the mix. Each module adds only its own run cost on top.",
      "On the build, the largest module is at full price, the second is {second} percent off and the third {third} percent off.",
      "Inside a mix each line is priced on the hours actually built, so a line can sit below what that module costs on its own. That is the point: it is less work, not a discount we invented.",
    ],
    combosKicker: "The seven combinations",
    combosTitle: "What each combination costs at the entry size.",
    /* The tail this lead used to carry, that a line inside a combination is
       priced on the hours actually built and is not the module's entry price,
       is the third of the rules rendered immediately above the table and is
       said again in the clause under every row name, so the caption no longer
       says it a third time (bead hq-wrig5.13). */
    combosLead:
      "Every module at its entry size, most expensive first. The build behind each row is the complete lists above, one for every module the row names.",
    combosLabel: "The seven combinations at the entry size",
    /** The first block of every stacked monthly bar, named in its legend. */
    baseLabel: "Shared base",
    /** Scopes the legend to the monthly bar, so its colours are never read
     *  onto the build bar beside it (reviewer B1, bead hq-wrig5.13 round two). */
    legendNote:
      "Colour keys the monthly blocks only. Each row's build bar draws in a shade of its own, not one of these four.",
    comboLabel: "What you buy",
    nameJoin: " and ",
    pricedOnLead: "Priced on the hours actually built:",
    discountFull: "{module} at full price",
    discountOff: "{module} {percent} percent off",
    /** In-sentence names for the cross-module features, keyed by catalogue id. */
    bridgeNames: {
      "restaurant-bridge": "the restaurant bridge",
      "wine-list-wired-to-the-cellar": "the wine list wired to the cellar",
    } as Record<string, string>,
    bridgesNote:
      "The bridges between modules are quoted on top of any of these figures, and only where both of the modules they join are bought: {list}. Neither one sits inside a standard build, so no figure above pays for it.",
    exampleKicker: "Worked example",
    exampleTitle: "A winery with six rooms and a restaurant.",
    // The ranking clause after the colon is composed from the quote's own
    // module order by mixRankingSentence(), never typed here, so the sentence
    // cannot name an order the table beside it does not have (bead hq-ggot1.14).
    exampleLead:
      "All three modules, each at its entry size. The complete build is the three lists above, ranked by build price:",
    rankFull: "at full price",
    rankSecond: "second",
    rankThird: "third",
    figuresLabel: "The three modules together, at their entry size",
    setupLabel: "To implement",
    monthlyLabel: "Every month",
    togetherLabel: "Together",
    aloneLabel: "Bought separately",
    savingLabel: "What that takes off",
    note: "The figures on this line are not entry prices for the modules inside them, and they are not a floor. They are what this configuration costs, priced on the hours the build actually takes.",
  },

  /**
   * The annual rule, as policy and only as policy. Memo 8.1 publishes "a year
   * paid up front costs less, because one invoice a year costs us less than
   * twelve" and then says in the same bullet: not the percentage, and not the
   * arithmetic behind it. So `annualPrepayRate` and `annualPrepay()` stay off
   * this surface on purpose, and the figure a client is quoted is the figure on
   * their quote. Lucy's sixth finding of 2026-09-08 asked for the rate and its
   * basis here; what the finding is actually right about is the claim on
   * /modulos that the rules are "written out in full", which is corrected in
   * lib/i18n/modulos.ts rather than answered by publishing a barred figure.
   */
  annual: {
    kicker: "Paying a year up front",
    title: "A year paid in one payment costs less.",
    body: "Twelve months of the service fee paid at the start of the year costs less than twelve monthly payments, because one invoice a year costs us less than twelve. It applies to the service fee only, never to the setup fee and never to ad spend. **The paid year runs to its end.** Stop halfway and there is nothing more to invoice and nothing to refund: the system stays on until the anniversary and you can leave there. The exact figure is on your quote.",
  },

  monthly: {
    kicker: "The monthly service fee",
    title: "What the monthly fee pays for.",
    sub: "One shared part per client, and one run cost per module. This is the shared part, and it is the same whether you run one module or three.",
    lines: {
      "hosting-monitoring-and-backups": "Hosting, monitoring and backups",
      "the-assistants-provider-account":
        "The assistant's provider account, paid by us",
      "care-queue-and-judgement": "Care, corrections and the calls they need",
      "weekly-call-and-whatsapp": "A weekly call and WhatsApp",
      "report-assembly-and-readout": "The monthly report and its readout",
      "client-admin-and-case-study": "Your invoicing and account admin",
    } as Record<string, string>,
    foot: "Each module adds its own run cost on top: watching its feeds, its care and corrections, its section of the report, and keeping its side of the assistant current. **When the service ends, nothing moves between accounts:** we promote you to owner, hand over the payment method and remove our access.",
  },

  ads: {
    kicker: "Ads and content",
    title: "They attach to two modules, and not to the third.",
    body: "Google Ads management and content attach to Hospitalidad and Restaurante. They never attach to Produccion: there we organise data, control and automation, and we do not build a winery's sales. Content is available from the entry size, ad management from the middle size up. **Ad management sits inside the monthly service fee, never as a percent of what you spend,** and your ad budget goes from you straight to Google.",
  },

  terms: {
    kicker: "Terms",
    title: "The terms, in full.",
    items: [
      "Setup is 50 percent on signature, 50 percent on acceptance.",
      "The signature half can be paid in three monthly payments at no extra cost.",
      "The service fee is paid in advance, month to month, 30 days notice either way.",
      "Leave the service inside the first twelve months and we invoice the part of the build the service fee was funding, less one twelfth for every month already paid. How much that is depends on the configuration, and your quote states it.",
      "All prices are plus IVA. Your ad budget goes from you straight to Google, and never through us.",
      "We quote and invoice in Mexican pesos. Every dollar figure here is converted from its own peso figure and rounded, so a dollar column can sit a few dollars off its own sum.",
    ],
  },

  close: {
    desc: "An entry price is where a quote starts, not where it lands. The Growth Diagnostic looks at your numbers and sets it: which modules, at what size, and what gets built first.",
    specs: [
      "**Day 1.** A working session over the operation you actually run, module by module.",
      "**Days 2 to 9.** We dig: the sources, the channels, the floor, the measurement and the numbers behind the numbers.",
      "**Day 10.** The memo lands: what is true, what is broken, and which module earns its place first.",
      "**Free and unattached.** Use it with us or without us. If we build, the price is agreed at the start and you own the result.",
    ],
    ctaModules: "See the three modules",
  },
};

const es: typeof en = {
  meta: {
    title: "Precios",
    description:
      "Lo que cuesta cada módulo, implementación y mensualidad: el precio de entrada de Producción, Hospitalidad y Restaurante junto a la construcción que lo produjo, qué cambia al comprar más de uno, y las condiciones.",
  },

  hero: {
    aria: "Presentación",
    eyebrow: "Lo que cuesta",
    t1: "Tres módulos. ",
    accent: "Cada uno con su precio de entrada publicado.",
    sub: "La cuota de implementación paga la construcción, y lo construido queda suyo. La cuota mensual del servicio paga operarlo: hospedaje, cuidado, correcciones, el informe mensual y el asistente. **Cuando el servicio termina, no se mueve nada entre cuentas:** lo promovemos a usted como titular, le entregamos el método de pago y retiramos nuestro acceso.",
    ctaFloors: "Ver los precios de entrada",
    ctaModules: "Ver los tres módulos",
  },

  floors: {
    kicker: "De dónde parte cada módulo",
    title: "El precio más bajo de cada módulo, y lo que trae.",
    sub: "Cada cifra de abajo es el módulo completo en su tamaño de entrada, comprado solo, junto a la construcción completa que la produjo. **No es una versión recortada.** Debajo de esa construcción no hay sistema, hay un reporte.",
    aloneLabel: "comprado solo",
    setupLabel: "Implementación",
    monthlyLabel: "Cada mes",
    buildLabel: "La construcción completa",
    monthlyNote:
      "La mensualidad es la base de servicio compartida, que se cobra una sola vez por cliente, más el costo de operación propio de este módulo.",
    note: "Un precio de entrada solo se mueve hacia arriba: más fuentes, más unidades, más mesas, más añadas, un conector, un segundo módulo. Nunca hacia abajo. **El Diagnóstico fija la cotización final.**",
    modules: {
      produccion: {
        name: "Producción",
        tag: "El registro de la cosecha, la cava y la venta",
      },
      hospitalidad: {
        name: "Hospitalidad",
        tag: "Cada reserva en un calendario, y el día desde el que trabaja la propiedad",
      },
      restaurante: {
        name: "Restaurante",
        tag: "Del teléfono del mesero al corte de caja",
      },
    },
  },

  features: {
    "production-record": "Registro de producción",
    "vintage-comparison": "Comparación de añadas",
    "commercial-record": "Registro comercial",
    "historical-vintage-load": "Una añada histórica cargada",
    "unit-and-stay-record": "Registro de unidades y estancias",
    "channel-feed-connector": "Conector de canal de reservas",
    "master-calendar": "Calendario maestro",
    "day-view": "Vista del día",
    "unit-status-board": "Tablero de unidades y vista de limpieza en teléfono",
    "guest-record": "Registro del huésped",
    "occupancy-and-revenue-by-channel": "Ocupación e ingreso por canal",
    "menu-categories-and-modifiers": "Menú, categorías y modificadores",
    "order-taking-on-the-phone": "Toma de orden en el teléfono del mesero",
    "send-to-kitchen-and-course-firing": "Envío a cocina y disparo de tiempos",
    "kitchen-screen": "Pantalla de cocina",
    "table-map-and-host-screen": "Mapa de mesas y pantalla de anfitrión",
    "checkout-with-split-and-tip": "Cobro con división de cuenta y propina",
    "cash-and-manually-recorded-card": "Efectivo y tarjeta anotada a mano",
    "invoice-request-capture": "Captura de la solicitud de factura",
    "cancellations-and-comps-log": "Registro de cancelaciones y cortesías",
    "daily-summary": "Resumen del día",
    "cash-cut": "Corte de caja",
    "monthly-report-generator": "Generador del informe mensual",
    "the-assistant": "El asistente sobre sus propios registros",
    "training-and-handover-pack": "Paquete de capacitación y entrega",
  } as Record<string, string>,

  countSuffix: " x {n}",

  examples: {
    produccion:
      "Una bodega con un sitio de producción, una marca, dos fuentes de datos y una añada anterior.",
    hospitalidad: "Una propiedad de seis unidades en dos canales de reserva.",
    restaurante:
      "Un restaurante de doce mesas, una estación, cuatro teléfonos y una pantalla de cocina.",
  } as Record<string, string>,

  mix: {
    kicker: "Más de un módulo",
    title: "Dos módulos, o tres, y qué cambia.",
    sub: "El ahorro viene de dos lados y los dos son reales. **El segundo módulo es una construcción más chica,** porque la capacitación, el marco del asistente, el generador del informe y el ambiente ya están de pie. Y un cliente es una sola relación, así que la parte compartida de la mensualidad se cobra una sola vez, compre los módulos que compre.",
    rules: [
      "La base de servicio compartida se cobra una sola vez, sea cual sea la combinación. Cada módulo agrega encima nada más su propio costo de operación.",
      "En la construcción, el módulo más grande va a precio completo, el segundo lleva {second} por ciento menos y el tercero {third} por ciento menos.",
      "Dentro de una combinación cada línea se cotiza sobre las horas que de verdad se construyen, así que una línea puede quedar debajo de lo que ese módulo cuesta solo. De eso se trata: es menos trabajo, no un descuento que nos inventamos.",
    ],
    combosKicker: "Las siete combinaciones",
    combosTitle: "Lo que cuesta cada combinación en el tamaño de entrada.",
    combosLead:
      "Cada módulo en su tamaño de entrada, de mayor a menor. La construcción detrás de cada renglón son las listas completas de arriba, una por cada módulo que el renglón nombra.",
    combosLabel: "Las siete combinaciones en el tamaño de entrada",
    baseLabel: "Base compartida",
    legendNote:
      "El color marca solo los bloques mensuales. La barra de arranque de cada renglón usa un tono propio, ninguno de estos cuatro.",
    comboLabel: "Lo que compra",
    nameJoin: " y ",
    pricedOnLead: "Cotizada sobre las horas que de verdad se construyen:",
    discountFull: "{module} a precio completo",
    discountOff: "{module} con {percent} por ciento menos",
    bridgeNames: {
      "restaurant-bridge": "el puente con el restaurante",
      "wine-list-wired-to-the-cellar": "la carta de vinos conectada a la cava",
    } as Record<string, string>,
    bridgesNote:
      "Los puentes entre módulos se cotizan aparte, encima de cualquiera de estas cifras, y solo donde se compran los dos módulos que unen: {list}. Ninguno de los dos va dentro de una construcción estándar, así que ninguna cifra de arriba lo paga.",
    exampleKicker: "Ejemplo trabajado",
    exampleTitle: "Una bodega con seis cuartos y restaurante.",
    exampleLead:
      "Los tres módulos, cada uno en su tamaño de entrada. La construcción completa son las tres listas de arriba, ordenadas por tamaño de obra:",
    rankFull: "a precio completo",
    rankSecond: "en segundo lugar",
    rankThird: "en tercero",
    figuresLabel: "Los tres módulos juntos, en su tamaño de entrada",
    setupLabel: "Implementación",
    monthlyLabel: "Cada mes",
    togetherLabel: "Juntos",
    aloneLabel: "Por separado",
    savingLabel: "Lo que se ahorra",
    note: "Las cifras de esta línea no son el precio de entrada de los módulos que la componen, y no son un piso. Son lo que cuesta esta configuración, cotizada sobre las horas que la construcción de verdad toma.",
  },

  annual: {
    kicker: "Pagar el año por adelantado",
    title: "Un año pagado en una sola exhibición cuesta menos.",
    body: "Doce meses de la cuota del servicio pagados al arranque del año cuestan menos que doce mensualidades, porque una factura al año nos cuesta menos que doce. Aplica solo a la cuota del servicio, nunca a la implementación y nunca a la inversión en anuncios. **El año pagado corre completo.** Si se detiene a la mitad no hay nada más que facturar y nada que devolver: el sistema sigue encendido hasta el aniversario y ahí puede irse. La cifra exacta va en su cotización.",
  },

  monthly: {
    kicker: "La cuota mensual del servicio",
    title: "Qué paga la mensualidad.",
    sub: "Una parte compartida por cliente, y un costo de operación por módulo. Esta es la parte compartida, y es la misma con un módulo que con tres.",
    lines: {
      "hosting-monitoring-and-backups": "Hospedaje, monitoreo y respaldos",
      "the-assistants-provider-account":
        "La cuenta de proveedor del asistente, pagada por nosotros",
      "care-queue-and-judgement":
        "Cuidado, correcciones y las decisiones que piden",
      "weekly-call-and-whatsapp": "Una llamada semanal y WhatsApp",
      "report-assembly-and-readout": "El informe mensual y su lectura",
      "client-admin-and-case-study": "Su facturación y la administración de su cuenta",
    } as Record<string, string>,
    foot: "Cada módulo agrega encima su propio costo de operación: vigilar sus fuentes, su cuidado y sus correcciones, su sección del informe, y mantener al día su lado del asistente. **Cuando el servicio termina, no se mueve nada entre cuentas:** lo promovemos a usted como titular, le entregamos el método de pago y retiramos nuestro acceso.",
  },

  ads: {
    kicker: "Anuncios y contenido",
    title: "Se agregan a dos módulos, y al tercero no.",
    body: "El manejo de Google Ads y el contenido se agregan a Hospitalidad y a Restaurante. A Producción nunca: ahí organizamos datos, control y automatización, y no construimos la venta de una bodega. El contenido está disponible desde el tamaño de entrada, y el manejo de anuncios desde el tamaño mediano. **El manejo de anuncios va dentro de la cuota mensual del servicio, nunca como porcentaje de lo que usted invierte,** y su presupuesto de anuncios lo paga usted directo a Google.",
  },

  terms: {
    kicker: "Condiciones",
    title: "Las condiciones, completas.",
    items: [
      "La implementación se paga 50 por ciento a la firma y 50 por ciento a la aceptación.",
      "La mitad de la firma se puede pagar en tres mensualidades, sin recargo.",
      "La cuota mensual va por adelantado, mes con mes, con 30 días de aviso de cualquiera de las dos partes.",
      "Si deja el servicio antes de doce mensualidades, facturamos la parte de la construcción que la cuota del servicio venía pagando, menos un doceavo por cada mensualidad ya pagada. Cuánto es depende de la configuración, y su cotización lo indica.",
      "Todos los precios son más IVA. Su presupuesto de anuncios lo paga usted directo a Google, y nunca pasa por nosotros.",
      "Cotizamos y facturamos en pesos mexicanos. Cada cifra en dólares es la conversión redondeada de su propia cifra en pesos, así que una columna en dólares puede quedar a unos dólares de su propia suma.",
    ],
  },

  close: {
    desc: "Un precio de entrada es de dónde parte una cotización, no a dónde llega. El Diagnóstico revisa sus números y la fija: qué módulos, de qué tamaño, y qué se construye primero.",
    specs: [
      "**Día 1.** Una sesión de trabajo sobre la operación que de verdad corre, módulo por módulo.",
      "**Días 2 a 9.** Escarbamos: las fuentes, los canales, el piso, la medición y los números detrás de los números.",
      "**Día 10.** Llega el informe: qué es cierto, qué está roto y qué módulo se gana el primer lugar.",
      "**Sin costo y sin amarres.** Úselo con nosotros o sin nosotros. Si construimos, el precio se acuerda desde el principio y usted se queda con el resultado.",
    ],
    ctaModules: "Ver los tres módulos",
  },
};

export const precios: Dict<typeof en> = { en, es };

/**
 * The worked example's ranking sentence, built from the quote's own module
 * order rather than transcribed into the dict. `rankedModuleIds` arrives ranked
 * by build price, most expensive first, exactly as `quote().modules` presents
 * them, so the prose names the same order the table shows and cannot be left
 * behind when the catalogue hours move (red-team hq-ggot1.6 finding 4,
 * bead hq-ggot1.14). No figure is read here, only the order and the localized
 * names; a module with no name or a position with no phrase throws at build
 * time, the same way a missing feature name already does.
 */
export function mixRankingSentence(
  locale: Locale,
  rankedModuleIds: readonly string[],
): string {
  const d = precios[locale].mix;
  const names = precios[locale].floors.modules;
  const phrases = [d.rankFull, d.rankSecond, d.rankThird];
  const clause = rankedModuleIds
    .map((id, index) => {
      const entry = names[id as keyof typeof names];
      if (!entry) {
        throw new Error(`precios: no module name for "${id}"`);
      }
      const phrase = phrases[index];
      if (!phrase) {
        throw new Error(`precios: no ranking phrase for position ${index}`);
      }
      return `${entry.name} ${phrase}`;
    })
    .join(", ");
  return `${d.exampleLead} ${clause}.`;
}

/**
 * The combination rules, with every percentage filled from `mixDiscountByRank`.
 * The dictionary carries the sentence and the calculation carries the number,
 * so changing the pass-through in lib/pricing.ts changes what both locales
 * promise instead of leaving a published policy behind (Lucy 2026-09-08,
 * seventh finding). A rule that still holds a placeholder throws at build time
 * rather than printing a brace on a public page.
 */
export function mixRules(locale: Locale): string[] {
  const second = formatPercent(locale, mixDiscountByRank[1]);
  const third = formatPercent(locale, mixDiscountByRank[2]);
  return precios[locale].mix.rules.map((rule) => {
    const filled = rule.replace("{second}", second).replace("{third}", third);
    if (filled.includes("{")) {
      throw new Error(`precios: unfilled placeholder in mix rule "${rule}"`);
    }
    return filled;
  });
}

/** The localized name of a module, or a build failure rather than a slug. */
function moduleName(locale: Locale, id: string): string {
  const names = precios[locale].floors.modules;
  const entry = names[id as keyof typeof names];
  if (!entry) throw new Error(`precios: no module name for "${id}"`);
  return entry.name;
}

/**
 * What a combination is, named from the quote's own ranked module order rather
 * than from a hand-kept list, so the row cannot name modules the figures beside
 * it do not price.
 */
export function comboName(
  locale: Locale,
  rankedModuleIds: readonly string[],
): string {
  const names = rankedModuleIds.map((id) => moduleName(locale, id));
  if (names.length < 2) return names.join("");
  return (
    names.slice(0, -1).join(", ") +
    precios[locale].mix.nameJoin +
    names[names.length - 1]
  );
}

/**
 * How a combination is priced, composed from its own quote lines: every line is
 * priced on the hours actually built (memo 8.3), and each module carries the
 * discount its rank earns, read out of the quote rather than typed here.
 */
export function comboPricingClause(
  locale: Locale,
  lines: readonly Pick<QuoteLine, "module" | "mixDiscount">[],
): string {
  const d = precios[locale].mix;
  const clause = lines
    .map((line) => {
      const name = moduleName(locale, line.module);
      return line.mixDiscount === 0
        ? d.discountFull.replace("{module}", name)
        : d.discountOff
            .replace("{module}", name)
            .replace("{percent}", formatPercent(locale, line.mixDiscount));
    })
    .join(", ");
  return `${d.pricedOnLead} ${clause}.`;
}

/**
 * The bridges a mix makes quotable, named as what they are: quoted on top of
 * the figures above and in no standard build (memo 2.2, 2.3 and 8.2). The list
 * comes from `bridgeFeatures()`, so a bridge that moved into a standard bundle
 * would drop out of this sentence instead of leaving the page promising work
 * the quote does not buy (Lucy 2026-09-08, first finding).
 */
export function bridgesSentence(
  locale: Locale,
  bridges: readonly { feature: string }[],
): string {
  const d = precios[locale].mix;
  const list = bridges.map((bridge) => {
    const name = d.bridgeNames[bridge.feature];
    if (!name) {
      throw new Error(`precios: no ${locale} name for bridge ${bridge.feature}`);
    }
    return name;
  });
  if (list.length === 0) return "";
  const joined =
    list.length < 2
      ? list[0]
      : list.slice(0, -1).join(", ") + d.nameJoin + list[list.length - 1];
  return d.bridgesNote.replace("{list}", joined);
}
