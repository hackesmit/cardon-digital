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
      "What a website, Google Ads management at a flat fee and each software module cost, in the open, with the terms. Every entry price is published.",
  },

  hero: {
    aria: "Introduction",
    eyebrow: "What it costs",
    t1: "Prices published. ",
    accent: "The diagnostic sets the quote.",
    sub: "Websites by what they include, ad management at a flat fee, and each software module from its entry price. Quoted and invoiced in Mexican pesos plus IVA; the dollar figures are rounded conversions. **Everything we build stays in your name: domain, accounts, code and data.**",
    proof: "Built for Monte Xanic, Vinedo En'kanto and Dharma Ochoa.",
    ctaFloors: "See the prices",
    web: { kicker: "Websites", more: "The websites page" },
    adsHead: { kicker: "Google Ads", more: "The ads page" },
    softwareHead: { kicker: "Software", title: "Software: three modules, each with its entry price.", sub: "Setup pays for the build and you own it. The monthly fee pays to run it. End the service and nothing moves between accounts: we make you the owner, hand over the payment method and remove our access.", more: "The software page", founding: { kicker: "Founding winery", lead: "**One founding winery, through 31 December 2026: the Produccion module at the mid-size build, for its entry price.**", body: "One slot, and it does not stack with anything. In exchange: a named case with the real before and after numbers, and two introductions in the Valle." } },
    notDo: { kicker: "What we do not do", title: "Four things we never do.", items: ["We never charge a percentage of what you spend on ads.", "We never charge per user, per seat, or per month forever.", "We never keep your domain, your accounts or your data in our name.", "We never manage social media on its own."] },
  },

  media: {
    handoverCap:
      "Handover day: the accounts are in the winery's name and the team runs it.",
    handoverAlt:
      "A handshake across the desk on handover day.",
    diagCap:
      "Day one of the Diagnostic: your operation gone through module by module.",
    diagAlt: "A laptop with the system open on a barrel in the cellar.",
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
          "Cash and a card written down work from day one. A payment link is a connector on your own provider account, quoted on top, one per provider, and your own invoicing provider stamps the invoice.",
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
    kicker: "Ads with a module",
    title: "Ad management is its own service, at a flat fee.",
    body: "Bought on its own or with a module, the flat fee is the same: {local} a month on the Local scope with a minimum budget of {minLocal}, or {crecimiento} a month on Growth with a minimum budget of {minCrecimiento}, always paid straight to Google, and at no point a percentage of what you spend. Content attaches to Hospitalidad and Restaurante and is quoted on top.",
  },

  terms: {
    kicker: "Terms",
    title: "The terms.",
    items: [
      "Setup is half on signature and half on acceptance.",
      "The signature half can go in three monthly payments at no extra cost.",
      "The service fee runs month to month, paid in advance, 30 days notice either way.",
      "At signing you choose how the build is paid. Pay it in full and the service can stop whenever you like, owing nothing for it. Or pay the lower setup, which twelve months of service fund: leave inside those twelve months and we invoice the part of the build the fee had not yet paid for. That part shrinks every month and reaches zero once the twelve are paid. The system stays yours either way, and your quote carries the exact amount for each month.",
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
      "Cuánto cuesta un sitio web, el manejo de anuncios en Google con cuota fija y cada módulo de software, a la vista y con sus condiciones. Todos los precios de entrada están publicados.",
  },

  hero: {
    aria: "Presentación",
    eyebrow: "Lo que cuesta",
    t1: "Precios publicados, en pesos. ",
    accent: "El diagnóstico define la cotización.",
    sub: "Sitios web según lo que incluyen, manejo de anuncios con cuota fija y cada módulo de software desde su precio de entrada. Más IVA, con factura. **Todo lo que construimos queda a su nombre: dominio, cuentas, código y datos.**",
    proof: "Hemos trabajado con Monte Xanic, Viñedo En'kanto y Dharma Ochoa.",
    ctaFloors: "Ver los precios",
    web: { kicker: "Sitios web", more: "La página de sitios web" },
    adsHead: { kicker: "Anuncios en Google", more: "La página de anuncios" },
    softwareHead: { kicker: "Software", title: "Software: tres módulos, cada uno con su precio de entrada.", sub: "La implementación paga el desarrollo, que es suyo. La mensualidad paga la operación. Al terminar el servicio no se mueve nada entre cuentas: usted queda como titular, le entregamos el método de pago y retiramos nuestro acceso.", more: "La página de software", founding: { kicker: "Bodega fundadora", lead: "**Una bodega fundadora, hasta el 31 de diciembre de 2026: el módulo de Producción en tamaño mediano, a su precio de entrada.**", body: "Un solo lugar, y no se acumula con nada más. A cambio: un caso con nombre y los números reales de antes y después, y que nos presente con dos contactos en el Valle." } },
    notDo: { kicker: "Lo que no hacemos", title: "Cuatro cosas que nunca hacemos.", items: ["Nunca cobramos un porcentaje de lo que invierte en anuncios.", "Nunca cobramos por usuario, por asiento ni mensualidades de por vida.", "Nunca nos quedamos con su dominio, sus cuentas ni sus datos.", "Nunca manejamos redes sociales como único servicio."] },
  },

  media: {
    handoverCap:
      "Día de entrega: las cuentas quedan a nombre de la bodega y el equipo opera el sistema.",
    handoverAlt:
      "Un apretón de manos sobre el escritorio el día de la entrega.",
    diagCap:
      "Primer día del Diagnóstico: revisamos su operación módulo por módulo.",
    diagAlt: "Una laptop con el sistema abierto sobre una barrica, en la cava.",
  },

  floors: {
    kicker: "De dónde parte cada módulo",
    title: "En cuánto empieza cada módulo y qué incluye.",
    aloneLabel: "contratado solo",
    setupLabel: "Implementación",
    monthlyLabel: "Cada mes",
    buildLabel: "Todo lo que incluye",
    upLabel: "Qué sube el precio",
    limitLabel: "Conviene saberlo",
    monthlyNote:
      "Cada mensualidad es la base compartida, que se cobra una vez por cliente, más el costo de operación del módulo.",
    demoNote: "Los demos usan una marca inventada y se abren en una pestaña nueva.",
    note: "Un precio de entrada solo sube, nunca baja: más fuentes, más unidades, más mesas, más añadas, un conector, un segundo módulo. Por debajo del tamaño de entrada no hay sistema, solo un informe. **El Diagnóstico define la cotización final.**",
    modules: {
      produccion: {
        name: "Producción",
        tag: "Sepa qué cosechó, qué elaboró y qué vendió.",
        up: "Lo suben más fuentes, más orígenes, más añadas anteriores, un modelo o la automatización financiera.",
        limit:
          "Un productor de uva recibe otro conjunto de funciones, con las mismas tarifas: cuadros, aplicaciones, riego y entregas.",
        demo: "Abrir el demo de Producción",
      },
      hospitalidad: {
        name: "Hospitalidad",
        tag: "Llene las habitaciones que dos calendarios dejaban vacías.",
        up: "Lo suben más unidades, más canales o un channel manager, hasta 40 unidades.",
        limit:
          "En el tamaño de entrada se lee el calendario de cada canal, así que nombres e importes se capturan a mano hasta contratar un channel manager.",
        demo: "Abrir el demo de Hospitalidad",
      },
      restaurante: {
        name: "Restaurante",
        tag: "Cierre el día con el efectivo ya contado.",
        up: "Lo suben más mesas, estaciones o comensales al día, hasta 60 mesas.",
        limit:
          "Efectivo y tarjeta anotada a mano funcionan desde el primer día. La liga de pago es un conector a su cuenta con el proveedor de pagos; se cotiza aparte, uno por proveedor, y su propio proveedor de facturación timbra la factura.",
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
    "channel-feed-connector": "Conector de canal de reservación",
    "master-calendar": "Calendario maestro",
    "day-view": "Vista del día",
    "unit-status-board": "Tablero de unidades y vista de limpieza en el teléfono",
    "guest-record": "Registro del huésped",
    "occupancy-and-revenue-by-channel": "Ocupación e ingresos por canal",
    "menu-categories-and-modifiers": "Menú, categorías y modificadores",
    "order-taking-on-the-phone": "Toma de comandas en el teléfono del mesero",
    "send-to-kitchen-and-course-firing": "Envío a cocina y control de tiempos",
    "kitchen-screen": "Pantalla de cocina",
    "table-map-and-host-screen": "Mapa de mesas y pantalla de anfitrión",
    "checkout-with-split-and-tip": "Cobro con división de cuenta y propina",
    "cash-and-manually-recorded-card": "Efectivo y tarjeta anotada a mano",
    "invoice-request-capture": "Captura de la solicitud de factura",
    "cancellations-and-comps-log": "Registro de cancelaciones y cortesías",
    "daily-summary": "Resumen del día",
    "cash-cut": "Corte de caja",
    "monthly-report-generator": "Generador del reporte mensual",
    "the-assistant": "El asistente que consulta sus propios registros",
    "training-and-handover-pack": "Paquete de capacitación y entrega",
  } as Record<string, string>,

  countSuffix: " x {n}",

  examples: {
    produccion:
      "Un lugar de producción, una marca, dos fuentes de datos y una añada anterior.",
    hospitalidad: "Una propiedad de seis unidades en dos canales de reservación.",
    restaurante:
      "Doce mesas, una estación, cuatro teléfonos, una pantalla de cocina.",
  } as Record<string, string>,

  mix: {
    kicker: "Más de un módulo",
    title: "Dos módulos, o tres.",
    sub: "Para el segundo módulo hay menos que construir: la capacitación, el asistente, el reporte y el ambiente ya están montados.",
    rules: [
      "La base de servicio compartida se cobra una sola vez, sea cual sea la combinación.",
      "En el desarrollo, el módulo más grande va a precio completo, el segundo con {second} por ciento de descuento y el tercero con {third} por ciento.",
      "Dentro de una combinación, un módulo puede quedar por debajo de lo que cuesta solo, porque se cotiza según las horas que realmente se trabajan.",
    ],
    combosKicker: "Las siete combinaciones",
    combosTitle: "Lo que cuesta cada combinación en su tamaño de entrada.",
    combosLead:
      "De mayor a menor precio, y cada renglón trae completo cada módulo que menciona.",
    combosLabel: "Las siete combinaciones en su tamaño de entrada",
    baseLabel: "Base compartida",
    legendNote: "Los colores marcan solo los bloques mensuales. La barra de arranque de cada renglón lleva un tono propio, distinto de estos cuatro.",
    comboLabel: "Lo que contrata",
    nameJoin: " y ",
    pricedOnLead: "Cotizada según las horas que realmente se trabajan:",
    discountFull: "{module} a precio completo",
    discountOff: "{module} con {percent} por ciento de descuento",
    bridgeNames: {
      "restaurant-bridge": "el puente con el restaurante",
      "wine-list-wired-to-the-cellar": "la carta de vinos conectada a la cava",
    } as Record<string, string>,
    bridgesNote:
      "Cada puente se cotiza aparte, además de estas cifras, y solo cuando se contratan los dos módulos que une: {list}.",
    exampleKicker: "Ejemplo práctico",
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
    note: "Este renglón es lo que cuesta esta configuración, cotizada según las horas que requiere, y no fija un precio mínimo.",
  },

  annual: {
    kicker: "Pagar el año por adelantado",
    title: "Un año en una sola exhibición cuesta menos.",
    body: "Doce meses pagados al inicio cuestan menos que doce mensualidades, porque una factura al año nos cuesta menos que doce. Solo la cuota del servicio, nunca la implementación ni la inversión en anuncios. El año pagado corre completo: si lo suspende a la mitad, no hay nada más que facturar ni nada que devolver. El sistema sigue encendido hasta el aniversario, y entonces puede retirarse. La cifra viene en su cotización.",
  },

  monthly: {
    kicker: "La cuota mensual del servicio",
    title: "Qué cubre la mensualidad.",
    sub: "Una parte compartida por cliente, más un costo de operación por módulo. Esta es la compartida.",
    lines: {
      "hosting-monitoring-and-backups": "Hosting, monitoreo y respaldos",
      "the-assistants-provider-account":
        "La cuenta del proveedor del asistente, que pagamos nosotros",
      "care-queue-and-judgement":
        "Mantenimiento, correcciones y las decisiones que requieren",
      "weekly-call-and-whatsapp": "Una llamada semanal y WhatsApp",
      "report-assembly-and-readout": "El reporte mensual y su revisión",
      "client-admin-and-case-study": "Su facturación y la administración de su cuenta",
    } as Record<string, string>,
    foot: "Cada módulo agrega su propio costo de operación: fuentes, correcciones, su parte del reporte y el asistente.",
  },

  ads: {
    kicker: "Anuncios con un módulo",
    title: "El manejo de anuncios es un servicio aparte, con cuota fija.",
    body: "Ya sea solo o junto con un módulo, la cuota fija es la misma: {local} al mes en el alcance Local, con presupuesto mínimo de {minLocal}, o {crecimiento} al mes en Crecimiento, con presupuesto mínimo de {minCrecimiento}. Ese presupuesto siempre se paga directo a Google, y la cuota nunca es un porcentaje de lo que invierte. El contenido se agrega a Hospitalidad y a Restaurante, y se cotiza aparte.",
  },

  terms: {
    kicker: "Condiciones",
    title: "Las condiciones.",
    items: [
      "La implementación se paga 50 por ciento a la firma y 50 por ciento a la aceptación.",
      "La mitad de la firma se puede cubrir en tres pagos mensuales, sin recargo.",
      "La cuota mensual se paga por adelantado, mes con mes, con 30 días de aviso de cualquiera de las dos partes.",
      "Al firmar, usted elige cómo pagar el desarrollo. Si lo paga completo, puede suspender el servicio cuando quiera, sin deber nada del desarrollo. O puede pagar la implementación más baja, que se financia con doce mensualidades de servicio: si deja el servicio antes de completarlas, le facturamos la parte del desarrollo que la cuota todavía no había cubierto. Esa parte baja cada mes y llega a cero al pagar las doce. En cualquier caso el sistema es suyo, y su cotización trae el monto exacto de cada mes.",
      "Todos los precios son más IVA. Su presupuesto de anuncios lo paga usted directo a Google, nunca a través de nosotros.",
      "Cotizamos y facturamos en pesos mexicanos. Las cifras en dólares son conversiones redondeadas, así que una columna en dólares puede diferir de su propia suma por unos cuantos dólares.",
    ],
  },

  close: {
    desc: "Diez días hábiles revisando las fuentes de datos, los canales y la operación de su negocio, y un informe escrito que es suyo, nos contrate o no: qué funciona, qué falla y qué módulos construir primero, de qué tamaño.",
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
