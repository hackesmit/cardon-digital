import type { Dict } from "./rich";

/**
 * Websites service page copy (/sitios-web). Spanish is written for a Mexican
 * owner and is the authoritative version; English is written for a US owner.
 * Neither is a translation of the other.
 *
 * Every figure the page prints is read out of lib/pricing.ts (webPackages and
 * the care fee); this file carries names, feature names and the words around
 * them. The visual strings live under `vis` (docs/copy-doctrine.md section 8).
 */

const en = {
  meta: {
    title: "Websites",
    description:
      "A website that gets found on Google and gets written to from a phone. Designed for your business, copy included, price published by what it includes, and the domain and the site in your name.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Websites",
    title: "Get found on Google,",
    titleAccent: "and get written to from a phone.",
    sub: "We design and build your business's website so it loads fast, reads on a phone and takes the visitor to a call or a WhatsApp message. The price is published by what it includes, and the domain and the site stay in your name.",
    proof: "Sites built for Vinedo En'kanto and Dharma Ochoa, delivered in their names.",
  },
  gets: {
    kicker: "What your site has to do",
    title: "Four things, in this order.",
    items: [
      {
        num: "01",
        h: "Show up when they search.",
        body: "Your business on Google and on the map, with the name, the hours and the words people actually search with.",
      },
      {
        num: "02",
        h: "Convince in five seconds.",
        body: "What you sell, for whom, and why you. Copy we write with you, photographs placed well, and a page that loads before the visitor loses patience.",
      },
      {
        num: "03",
        h: "Get written to from a phone.",
        body: "A WhatsApp button, the number to call and a short form, all within reach of a thumb. Every message is counted.",
      },
      {
        num: "04",
        h: "Stay yours.",
        body: "Domain, hosting and access in your name. Change it yourself, or leave it in our care for a monthly fee.",
      },
    ],
  },
  packages: {
    kicker: "What it costs",
    title: "Four packages, priced by what they include.",
    sub: "Entry prices, quoted and invoiced in Mexican pesos plus IVA; the dollar figures are rounded conversions. A price moves up with what your site needs and never down.",
    fromLabel: "from",
    deliveryLabel: "Delivery",
    daysUnit: "business days",
    pagesLabel: "Pages",
    includesLabel: "What is in it",
    careLabel: "Monthly care, optional",
    careBody:
      "Hosting, the domain, updates and up to two changes a month. Stop it whenever you like; the site keeps running in your name.",
    perMonth: "a month",
    names: {
      presencia: "One page",
      negocio: "Full site",
      reservas: "Site with bookings",
      tienda: "Online store",
    } as Record<string, string>,
    tags: {
      presencia: "So they find you and write to you.",
      negocio: "To explain what you do and why you.",
      reservas: "So they book without calling you.",
      tienda: "To sell online.",
    } as Record<string, string>,
    /**
     * Feature names, keyed by the catalogue id in lib/pricing.ts webPackages.
     * The page reads each package's feature list out of the data module and
     * looks the id up here, so a package that changes shape changes the
     * printed list with it. A missing id fails the build rather than printing
     * a slug.
     */
    features: {
      "custom-design": "Design made for your business, on our system",
      "copy-written": "Copy written with you",
      "whatsapp-button-and-form": "WhatsApp button and a short form",
      "ga4-with-conversion-events": "Every message and call counted",
      "local-seo-basics": "Google and the map set up for your area",
      "google-business-profile-optimisation": "Google Business Profile tuned",
      "editable-section": "A section you can edit yourself",
      "bilingual-pages": "Spanish and English",
      "booking-path": "Bookings from the site, confirmed by email or WhatsApp",
      "extra-form": "One more form: quotes or events",
      "confirmation-and-follow-up": "Confirmation and a follow-up message",
      "training": "A session so you know how to change it",
      "product-catalogue": "Product catalogue",
      "checkout": "Cart and checkout",
      "payment-provider-connector": "Card payments on your own provider account",
      "shipping-and-pickup-rules": "Shipping and pickup rules",
      "order-notifications": "Order notices to your phone",
    } as Record<string, string>,
  },
  how: {
    kicker: "How it works",
    title: "From the call to the handover.",
    steps: [
      { k: "01", body: "A 30-minute call. What you sell, to whom, and what the site has to achieve." },
      { k: "02", body: "Design and copy. You review them, with two rounds of changes." },
      { k: "03", body: "Build and handover. Domain, hosting and access in your name, and a session so you know how to change it." },
    ],
  },
  familiar: {
    kicker: "Objections",
    title: "Sound familiar?",
    items: [
      {
        q: "I already have a website.",
        a: "We review it at no cost and tell you, in writing, what to change and what to keep.",
      },
      {
        q: "I have no photos and no copy.",
        a: "The copy gets written with you on the call. The photographs are yours, or licensed ones we find.",
      },
      {
        q: "The last person who built my site disappeared with it.",
        a: "That is why the domain, the hosting and the access are in your name from the first day.",
      },
      {
        q: "What about a template for a few thousand pesos?",
        a: "It gets you something on the web. A site that brings clients is designed for your business, written with you and measured. That is what the difference pays for.",
      },
    ],
  },
  diagDesc:
    "Ten business days on your site, your ads and your operation, and a written memo that is yours: what is true, what is broken, what to build first.",
  vis: {
    rise: {
      tagBefore: "one search",
      tagMid: "one message",
      captionRun: "loading",
      captionDone: "they wrote to you",
      aria: "A search turns up the business first, its site loads on a phone block by block, three checks pass, and a message arrives.",
      fallback: "A search, your site first, a message from a new client.",
      query: "dentist in ensenada",
      results: [
        { name: "Your business", sub: "Ensenada, open now" },
        { name: "another result", sub: "" },
        { name: "another result", sub: "" },
      ],
      site: { name: "Your business", headline: "What you do, for whom", cta: "Write on WhatsApp" },
      checks: ["loads fast", "reads on a phone", "one button to write"],
      message: "Hello, I saw your site. Do you have Thursday open?",
      received: "received",
    },
  },
};

const es: typeof en = {
  meta: {
    title: "Sitios web",
    description:
      "Un sitio que lo encuentran en Google y por el que le escriben desde el teléfono. Diseñado para su negocio, con textos incluidos, precio publicado por lo que incluye, y el dominio y el sitio a su nombre.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Sitios web",
    title: "Que lo encuentren en Google",
    titleAccent: "y le escriban desde el teléfono.",
    sub: "Diseñamos y construimos el sitio de su negocio para que cargue rápido, se lea en el teléfono y lleve al visitante a llamarle o escribirle por WhatsApp. El precio está publicado por lo que incluye, y el dominio y el sitio quedan a su nombre.",
    proof: "Sitios hechos para Viñedo En'kanto y Dharma Ochoa, entregados a su nombre.",
  },
  gets: {
    kicker: "Lo que su sitio tiene que lograr",
    title: "Cuatro cosas, en este orden.",
    items: [
      {
        num: "01",
        h: "Aparecer cuando lo buscan.",
        body: "Su negocio en Google y en el mapa, con el nombre, el horario y las palabras con las que la gente de verdad lo busca.",
      },
      {
        num: "02",
        h: "Convencer en cinco segundos.",
        body: "Qué vende, para quién y por qué usted. Textos que escribimos con usted, fotos bien puestas y una página que carga antes de que el visitante se desespere.",
      },
      {
        num: "03",
        h: "Que le escriban desde el teléfono.",
        body: "Un botón de WhatsApp, el número para llamar y un formulario corto, al alcance del pulgar. Cada mensaje queda contado.",
      },
      {
        num: "04",
        h: "Que siga siendo suyo.",
        body: "Dominio, hosting y accesos a su nombre. Lo cambia usted, o lo deja a nuestro cuidado por una cuota mensual.",
      },
    ],
  },
  packages: {
    kicker: "Lo que cuesta",
    title: "Cuatro paquetes, por lo que incluyen.",
    sub: "Precios de entrada en pesos, más IVA, con factura. Un precio sube con lo que su sitio necesita y nunca baja.",
    fromLabel: "desde",
    deliveryLabel: "Entrega",
    daysUnit: "días hábiles",
    pagesLabel: "Páginas",
    includesLabel: "Lo que incluye",
    careLabel: "Cuidado mensual, opcional",
    careBody:
      "Hosting, dominio, actualizaciones y hasta dos cambios al mes. Lo detiene cuando quiera; el sitio sigue corriendo a su nombre.",
    perMonth: "al mes",
    names: {
      presencia: "Una página",
      negocio: "Sitio completo",
      reservas: "Sitio con reservas",
      tienda: "Tienda en línea",
    } as Record<string, string>,
    tags: {
      presencia: "Para que lo encuentren y le escriban.",
      negocio: "Para explicar lo que hace y por qué usted.",
      reservas: "Para que reserven sin llamarle.",
      tienda: "Para vender en línea.",
    } as Record<string, string>,
    features: {
      "custom-design": "Diseño hecho para su negocio, sobre nuestro sistema",
      "copy-written": "Textos escritos con usted",
      "whatsapp-button-and-form": "Botón de WhatsApp y un formulario corto",
      "ga4-with-conversion-events": "Cada mensaje y cada llamada contados",
      "local-seo-basics": "Google y el mapa configurados para su zona",
      "google-business-profile-optimisation": "Perfil de Google Business afinado",
      "editable-section": "Una sección que usted mismo edita",
      "bilingual-pages": "Español e inglés",
      "booking-path": "Reservas desde el sitio, confirmadas por correo o WhatsApp",
      "extra-form": "Un formulario más: cotizaciones o eventos",
      "confirmation-and-follow-up": "Confirmación y un mensaje de seguimiento",
      "training": "Una sesión para que sepa cambiarlo",
      "product-catalogue": "Catálogo de productos",
      "checkout": "Carrito y pago",
      "payment-provider-connector": "Pago con tarjeta en su propia cuenta del proveedor",
      "shipping-and-pickup-rules": "Reglas de envío y recolección",
      "order-notifications": "Avisos de pedido a su teléfono",
    } as Record<string, string>,
  },
  how: {
    kicker: "Cómo funciona",
    title: "De la llamada a la entrega.",
    steps: [
      { k: "01", body: "Una llamada de 30 minutos. Qué vende, a quién y qué tiene que lograr el sitio." },
      { k: "02", body: "Diseño y textos. Los revisa usted, con dos rondas de cambios." },
      { k: "03", body: "Construcción y entrega. Dominio, hosting y accesos a su nombre, y una sesión para que sepa cambiarlo." },
    ],
  },
  familiar: {
    kicker: "Objeciones",
    title: "¿Le suena?",
    items: [
      {
        q: "Ya tengo página.",
        a: "La revisamos sin costo y le decimos, por escrito, qué cambiar y qué dejar.",
      },
      {
        q: "No tengo fotos ni textos.",
        a: "Los textos los escribimos con usted en la llamada. Las fotos, las suyas o las que conseguimos con licencia.",
      },
      {
        q: "El que me hizo la página desapareció con ella.",
        a: "Por eso el dominio, el hosting y los accesos quedan a su nombre desde el primer día.",
      },
      {
        q: "¿Y una plantilla de esas de unos miles de pesos?",
        a: "Sirve para tener algo en internet. Un sitio que le trae clientes se diseña para su negocio, se escribe con usted y se mide. Eso es lo que paga la diferencia.",
      },
    ],
  },
  diagDesc:
    "Diez días hábiles sobre su sitio, sus anuncios y su operación, y un informe escrito que es suyo: qué es cierto, qué está roto y qué construir primero.",
  vis: {
    rise: {
      tagBefore: "una búsqueda",
      tagMid: "un mensaje",
      captionRun: "cargando",
      captionDone: "le escribieron",
      aria: "Una búsqueda encuentra primero al negocio, su sitio carga en un teléfono bloque por bloque, pasan tres revisiones y llega un mensaje.",
      fallback: "Una búsqueda, su sitio primero, un mensaje de un cliente nuevo.",
      query: "dentista en ensenada",
      results: [
        { name: "Su negocio", sub: "Ensenada, abierto ahora" },
        { name: "otro resultado", sub: "" },
        { name: "otro resultado", sub: "" },
      ],
      site: { name: "Su negocio", headline: "Lo que hace, para quién", cta: "Escribir por WhatsApp" },
      checks: ["carga rápido", "se lee en el teléfono", "un botón para escribir"],
      message: "Hola, vi su sitio. ¿Tienen el jueves?",
      received: "recibido",
    },
  },
};

export type SitiosDict = typeof en;
export const sitios: Dict<SitiosDict> = { en, es };
