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
 *
 * Rewritten against docs/copy-doctrine.md by bead hq-4pu0q.7. Two things
 * changed beyond the wording. Every module is named by the result the owner
 * ends up with and the mechanism comes second, in the same words the home page
 * uses, so a reader who arrives from there reads one voice. And the module
 * detail a buyer needs in order to choose lands here rather than on /modulos,
 * which is being retired: each card now carries the configuration its entry
 * price buys, what moves that size up and where it stops, the one caveat that
 * changes what the entry build actually gives, and a link to that module's
 * demo. The rest of /modulos, the S/M/L feature ladder and the per-module
 * essays, is deliberately left behind.
 *
 * Emphasis is capped at three spans per locale by the doctrine and this page
 * spends two: the ownership handover in the hero, and the line that stops an
 * entry price being read as a quote. Everything else earns attention by
 * position and by being short.
 */

const en = {
  meta: {
    title: "Pricing",
    description:
      "What each module costs to build and to run, what more than one changes, and the terms. Every entry price is published.",
  },

  hero: {
    aria: "Introduction",
    eyebrow: "What it costs",
    t1: "Two fees, ",
    accent: "and then the system is yours.",
    sub: "Setup pays for the build and you own it. The monthly fee pays to run it. **End the service and nothing moves between accounts: we promote you to owner, hand over the payment method and remove our access.**",
    proof: "Built for Monte Xanic and Vinedo En'kanto.",
    ctaFloors: "See the entry prices",
  },

  media: {
    handoverCap:
      "Handover day: the accounts are in the winery's name and the team runs it.",
    handoverAlt:
      "The winery team around one screen at a training session.",
    diagCap:
      "Day one of the Diagnostic: your operation gone through module by module.",
    diagAlt: "A working session at the winery, laptop and notes on the table.",
  },

  floors: {
    kicker: "Where each module starts",
    title: "What each module starts at, and what that buys.",
    aloneLabel: "bought on its own",
    setupLabel: "To implement",
    monthlyLabel: "Every month",
    buildLabel: "The complete build",
    upLabel: "What moves it up",
    limitLabel: "Worth knowing",
    /**
     * No figures here on purpose. The shared base and a run cost are each
     * rounded to their own step in MXN and converted to USD separately, so a
     * printed split does not always add up to the printed total in either
     * currency, and a public figure that fails a reader's arithmetic is worse
     * than no figure. The rule is what sells the mix, so the rule is what runs.
     */
    monthlyNote:
      "Each monthly is the shared base, charged once per client, plus that module's run cost.",
    demoNote: "The demos run on an invented brand, in a new tab.",
    note: "An entry price only moves up, never down: more sources, more units, more tables, more vintages, a connector, a second module. Below that build there is no system, only a report. **The Diagnostic sets the final quote.**",
    /**
     * Result first, mechanism second, in the home page's own words. `up` and
     * `limit` are what came across from lib/i18n/modulos.ts: the direction the
     * size moves and where it stops, and the one thing about this module that
     * would otherwise be discovered after signing.
     */
    modules: {
      produccion: {
        name: "Produccion",
        tag: "Know what you grew, made and sold.",
        up: "More sources, more origins, more prior vintages, a model or finance automation move it up.",
        limit:
          "A grape grower gets a different set at the same rates: blocks, applications, irrigation and deliveries.",
        demo: "Open the Produccion demo",
      },
      hospitalidad: {
        name: "Hospitalidad",
        tag: "Fill the rooms two calendars left empty.",
        up: "More units, more channels or a channel manager move it up, to 40 units.",
        limit:
          "The entry build reads each channel's calendar, so names and amounts are typed in by hand until a channel manager is contracted.",
        demo: "Open the Hospitalidad demo",
      },
      restaurante: {
        name: "Restaurante",
        tag: "Close the day with the cash already counted.",
        up: "More tables, stations or covers a day move it up, to 60 tables.",
        limit:
          "Cash and a card written down work from day one. A payment link is a connector on your own provider account, quoted on top, one per provider, and your provider stamps the invoice.",
        demo: "Open the Restaurante demo",
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

  /** The configuration each published entry price buys, card by card. */
  examples: {
    produccion:
      "One production site, one brand, two data sources, one prior vintage.",
    hospitalidad: "A six-unit property on two booking channels.",
    restaurante: "Twelve tables, one station, four phones, one kitchen screen.",
  } as Record<string, string>,

  mix: {
    kicker: "More than one module",
    title: "Two modules, or three.",
    sub: "The second module is a smaller build: the training, the assistant, the report and the environment already stand.",
    /**
     * The percentages are placeholders, filled from `mixDiscountByRank` by
     * mixRules() below. A published policy figure that is typed here can drift
     * from the calculation the day the data changes, which is the whole reason
     * no figure lives in this file (Lucy 2026-09-08, seventh finding).
     */
    rules: [
      "The shared service base is charged once, whatever the mix.",
      "On the build the largest module goes at full price, the second {second} percent off, the third {third} percent off.",
      "A line inside a mix can sit below what that module costs alone, because it is priced on the hours actually built.",
    ],
    combosKicker: "The seven combinations",
    combosTitle: "What each combination costs at the entry size.",
    combosLead:
      "Most expensive first, and every row is the complete build of each module it names.",
    combosLabel: "The seven combinations at the entry size",
    /** The first block of every stacked monthly bar, named in its legend. */
    baseLabel: "Shared base",
    /** Scopes the legend to the monthly bar, so its colours are never read
     *  onto the build bar beside it (reviewer B1, bead hq-wrig5.13 round two). */
    legendNote: "The colours key the monthly blocks only. Each row's build bar draws in a shade of its own, outside these four.",
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
      "Each bridge is quoted on top of these figures, and only where both of the modules it joins are bought: {list}.",
    exampleKicker: "Worked example",
    exampleTitle: "A winery with six rooms and a restaurant.",
    // The ranking clause after the colon is composed from the quote's own
    // module order by mixRankingSentence(), never typed here, so the sentence
    // cannot name an order the table beside it does not have (bead hq-ggot1.14).
    exampleLead: "All three at their entry size, ranked by build price:",
    rankFull: "at full price",
    rankSecond: "second",
    rankThird: "third",
    figuresLabel: "The three modules together, at their entry size",
    setupLabel: "To implement",
    monthlyLabel: "Every month",
    togetherLabel: "Together",
    aloneLabel: "Bought separately",
    savingLabel: "What that saves",
    note: "This line is what this configuration costs, priced on the hours it takes, and it sets no floor.",
  },

  /**
   * The annual rule, as policy and only as policy. Memo 8.1 publishes "a year
   * paid up front costs less, because one invoice a year costs us less than
   * twelve" and then says in the same bullet: not the percentage, and not the
   * arithmetic behind it. So `annualPrepayRate` and `annualPrepay()` stay off
   * this surface on purpose, and the figure a client is quoted is the figure on
   * their quote.
   */
  annual: {
    kicker: "Paying a year up front",
    title: "A year in one payment costs less.",
    body: "Twelve months paid at the start cost less than twelve payments: one invoice a year costs us less than twelve. Service fee only, never setup and never ad spend. The paid year runs to its end: stop halfway and there is nothing more to invoice and nothing to refund. The system stays on until the anniversary and you can leave there. Your quote carries the figure.",
  },

  monthly: {
    kicker: "The monthly service fee",
    title: "What the monthly fee pays for.",
    sub: "One shared part per client, plus one run cost per module. This is the shared part.",
    lines: {
      "hosting-monitoring-and-backups": "Hosting, monitoring and backups",
      "the-assistants-provider-account":
        "The assistant's provider account, paid by us",
      "care-queue-and-judgement": "Care, corrections and the calls they need",
      "weekly-call-and-whatsapp": "A weekly call and WhatsApp",
      "report-assembly-and-readout": "The monthly report and its readout",
      "client-admin-and-case-study": "Your invoicing and account admin",
    } as Record<string, string>,
    foot: "Each module adds its own run cost: its feeds, its corrections, its part of the report and the assistant.",
  },

  ads: {
    kicker: "Ads and content",
    title: "Google Ads management and content attach to Hospitalidad and Restaurante.",
    body: "Neither attaches to Produccion: there we organise data, control and automation, and we do not build a winery's sales. Content from the entry size, ad management from the middle size up. Ad management is inside the monthly fee, never as a share of what you spend, and both are quoted on top of the figures above.",
  },

  terms: {
    kicker: "Terms",
    title: "The terms.",
    items: [
      "Setup is half on signature and half on acceptance.",
      "The signature half can go in three monthly payments at no extra cost.",
      "The service fee runs month to month, paid in advance, 30 days notice either way.",
      "Leave inside the first twelve months and we invoice the part of the build the service fee was funding, less one twelfth per month paid. How much depends on the configuration, and your quote states it.",
      "All prices are plus IVA. Your ad budget goes straight to Google, never through us.",
      "We quote and invoice in Mexican pesos. Dollar figures are rounded conversions, so a dollar column can sit a few dollars off its sum.",
    ],
  },

  close: {
    desc: "Ten business days over your sources, your channels and your floor, and a written memo that is yours either way: what is true, what is broken, and which modules to build first, at what size.",
  },
};

const es: typeof en = {
  meta: {
    title: "Precios",
    description:
      "Lo que cuesta cada módulo, construirlo y operarlo, qué cambia con más de uno, y las condiciones. Cada precio de entrada está publicado.",
  },

  hero: {
    aria: "Presentación",
    eyebrow: "Lo que cuesta",
    t1: "Dos cuotas. ",
    accent: "Después, el sistema es suyo.",
    sub: "La implementación paga la construcción, que queda suya. La mensualidad paga operarla. **Al terminar el servicio no se mueve nada entre cuentas: lo dejamos a usted como titular, le entregamos el método de pago y retiramos nuestro acceso.**",
    proof: "Construido para Monte Xanic y Viñedo En'kanto.",
    ctaFloors: "Ver los precios de entrada",
  },

  media: {
    handoverCap:
      "Día de entrega: las cuentas quedan a nombre de la bodega y el equipo opera el sistema.",
    handoverAlt:
      "El equipo de la bodega alrededor de una pantalla, en capacitación.",
    diagCap:
      "Día uno del Diagnóstico: su operación repasada módulo por módulo.",
    diagAlt: "Una sesión de trabajo en la bodega, laptop y notas sobre la mesa.",
  },

  floors: {
    kicker: "De dónde parte cada módulo",
    title: "De cuánto parte cada módulo, y qué trae.",
    aloneLabel: "comprado solo",
    setupLabel: "Implementación",
    monthlyLabel: "Cada mes",
    buildLabel: "La construcción completa",
    upLabel: "Qué lo sube",
    limitLabel: "Para tenerlo claro",
    monthlyNote:
      "Cada mensualidad es la base compartida, que se cobra una vez por cliente, más el costo del módulo.",
    demoNote: "Los demos corren sobre una marca inventada, en una pestaña nueva.",
    note: "Un precio de entrada solo sube, nunca baja: más fuentes, más unidades, más mesas, más añadas, un conector, un segundo módulo. Debajo de esa construcción no hay sistema, hay un informe. **El Diagnóstico fija la cotización final.**",
    modules: {
      produccion: {
        name: "Producción",
        tag: "Sepa qué cosechó, qué hizo y qué vendió.",
        up: "Más fuentes, más orígenes, más añadas anteriores, un modelo o automatización financiera lo suben.",
        limit:
          "Un productor de uva lleva otro conjunto de funciones a las mismas tarifas: cuadros, aplicaciones, riego y entregas.",
        demo: "Abrir el demo de Producción",
      },
      hospitalidad: {
        name: "Hospitalidad",
        tag: "Llene los cuartos que dos calendarios dejaron vacíos.",
        up: "Más unidades, más canales o un channel manager lo suben, hasta 40 unidades.",
        limit:
          "La construcción de entrada lee el calendario de cada canal, así que nombres e importes se capturan a mano hasta contratar un channel manager.",
        demo: "Abrir el demo de Hospitalidad",
      },
      restaurante: {
        name: "Restaurante",
        tag: "Cierre el día con el efectivo ya contado.",
        up: "Más mesas, estaciones o comensales al día lo suben, hasta 60 mesas.",
        limit:
          "Efectivo y tarjeta anotada a mano funcionan desde el día uno. El enlace de pago es un conector sobre su propia cuenta de proveedor, que se cotiza aparte, uno por proveedor, y su proveedor timbra la factura.",
        demo: "Abrir el demo de Restaurante",
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
      "Un sitio de producción, una marca, dos fuentes de datos, una añada anterior.",
    hospitalidad: "Una propiedad de seis unidades en dos canales de reserva.",
    restaurante:
      "Doce mesas, una estación, cuatro teléfonos, una pantalla de cocina.",
  } as Record<string, string>,

  mix: {
    kicker: "Más de un módulo",
    title: "Dos módulos, o tres.",
    sub: "El segundo módulo es una construcción más chica: la capacitación, el asistente, el informe y el ambiente ya están montados.",
    rules: [
      "La base de servicio compartida se cobra una sola vez, sea cual sea la combinación.",
      "En la construcción, el módulo más grande va a precio completo, el segundo con {second} por ciento menos, el tercero con {third} por ciento menos.",
      "Dentro de una combinación, una línea puede quedar debajo de lo que ese módulo cuesta solo, porque se cotiza sobre las horas que de verdad se construyen.",
    ],
    combosKicker: "Las siete combinaciones",
    combosTitle: "Lo que cuesta cada combinación en tamaño de entrada.",
    combosLead:
      "De mayor a menor, y cada renglón trae la construcción completa de cada módulo que nombra.",
    combosLabel: "Las siete combinaciones en el tamaño de entrada",
    baseLabel: "Base compartida",
    legendNote: "El color marca solo los bloques mensuales. La barra de arranque de cada renglón usa un tono propio, ninguno de estos cuatro.",
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
      "Cada puente se cotiza aparte, encima de estas cifras, y solo donde se compran los dos módulos que une: {list}.",
    exampleKicker: "Ejemplo trabajado",
    exampleTitle: "Una bodega con seis cuartos y restaurante.",
    exampleLead:
      "Los tres en su tamaño de entrada, ordenados por tamaño de obra:",
    rankFull: "a precio completo",
    rankSecond: "en segundo lugar",
    rankThird: "en tercer lugar",
    figuresLabel: "Los tres módulos juntos, en su tamaño de entrada",
    setupLabel: "Implementación",
    monthlyLabel: "Cada mes",
    togetherLabel: "Juntos",
    aloneLabel: "Por separado",
    savingLabel: "Lo que se ahorra",
    note: "Este renglón es lo que cuesta esta configuración, cotizada sobre las horas que toma, y no fija un piso.",
  },

  annual: {
    kicker: "Pagar el año por adelantado",
    title: "Un año en una sola exhibición cuesta menos.",
    body: "Doce meses pagados al arranque cuestan menos que doce mensualidades: una factura al año nos cuesta menos que doce. Solo la cuota del servicio, nunca la implementación ni la inversión en anuncios. El año pagado corre completo: si se detiene a la mitad no hay nada más que facturar ni nada que devolver. El sistema sigue encendido hasta el aniversario y ahí puede irse. La cifra va en su cotización.",
  },

  monthly: {
    kicker: "La cuota mensual del servicio",
    title: "Qué paga la mensualidad.",
    sub: "Una parte compartida por cliente, más un costo por módulo. Esta es la compartida.",
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
    foot: "Cada módulo agrega su propio costo de operación: sus fuentes, sus correcciones, su parte del informe y el asistente.",
  },

  ads: {
    kicker: "Anuncios y contenido",
    title: "El manejo de Google Ads y el contenido se agregan a Hospitalidad y a Restaurante.",
    body: "A Producción no se agrega ninguno de los dos: ahí organizamos datos, control y automatización, y no construimos la venta de una bodega. El contenido va desde el tamaño de entrada y el manejo de anuncios desde el mediano. El manejo de anuncios va dentro de la cuota mensual, nunca como porcentaje de lo que usted invierte, y los dos se cotizan aparte de las cifras de arriba.",
  },

  terms: {
    kicker: "Condiciones",
    title: "Las condiciones.",
    items: [
      "La implementación se paga 50 por ciento a la firma y 50 por ciento a la aceptación.",
      "La mitad de la firma se puede pagar en tres mensualidades, sin recargo.",
      "La cuota mensual va por adelantado, mes con mes, con 30 días de aviso de cualquiera de las dos partes.",
      "Si deja el servicio antes de doce mensualidades, facturamos la parte de la construcción que la cuota venía pagando, menos un doceavo por mensualidad pagada. Cuánto es depende de la configuración, y su cotización lo indica.",
      "Todos los precios son más IVA. Su presupuesto de anuncios lo paga usted directo a Google, nunca a través de nosotros.",
      "Cotizamos y facturamos en pesos mexicanos. Las cifras en dólares son conversiones redondeadas, así que una columna en dólares puede quedar a unos dólares de su propia suma.",
    ],
  },

  close: {
    desc: "Diez días hábiles sobre sus fuentes, sus canales y su piso, y un informe escrito que es suyo en cualquier caso: qué es cierto, qué está roto y qué módulos construir primero, de qué tamaño.",
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
