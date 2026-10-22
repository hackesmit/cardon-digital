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
    title: "Business websites, built in Ensenada",
    description:
      "Cardon Digital builds websites for businesses in Ensenada and Baja California: fast on a phone, built to be found on Google and read by ChatGPT and Gemini, with the domain in your name.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Websites",
    title: "Get found on Google,",
    titleAccent: "and get written to from a phone.",
    sub: "Cardon Digital designs and builds websites for businesses in Ensenada and Baja California. Every site loads fast on a phone, is built to be found on Google and to be read and cited by ChatGPT and Gemini, and puts a call or a message one tap away. The domain and the site stay in your name.",
    proof: "Latest sites: Viñedo En'kanto and Aperta Media Co.",
  },
  /** The one link to the style samples page (/estilos). */
  styles: {
    line: "Four invented businesses, each in a style of its own: a winery, a logistics company, a spa and a coastal hotel.",
    cta: "See the styles",
  },
  /** A recent client site, shown as screenshots of the live page. */
  example: {
    kicker: "A recent site",
    title: "Aperta Media Co., a photo and video studio",
    body: "Their packages with prices, a calculator that quotes a custom package by number of videos, their work on video, and an editor where they change the text and the photos themselves, without calling us.",
    link: "See the live site",
    desktopCap: "The home page on a computer: who they are and what they sell, on the first screen.",
    desktopAlt: "Screenshot of the Aperta Media Co. home page on a computer",
    phoneCap: "The same page on a phone, with the packages one tap away.",
    phoneAlt: "Screenshot of the Aperta Media Co. home page on a phone",
  },
  gets: {
    kicker: "Four things, in this order",
    title: "What does a business website have to do?",
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
        body: "Instant messaging, the number to call and a short form, all within reach of a thumb. Every message is counted.",
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
    title: "Four packages, four prices.",
    sub: "Feature-based pricing: you pay for the functions your site carries.",
    fromLabel: "from",
    daysUnit: "business days",
    rangeJoin: " to ",
    pageUnit: "page",
    pagesUnit: "pages",
    plusLabel: "Everything in {name}, plus",
    careLabel: "Monthly care, optional",
    careBody: "Hosting, domain, updates and two changes a month. Stop it whenever you like.",
    perMonth: "a month",
    names: {
      presencia: "One page",
      negocio: "Full site",
      reservas: "Site with bookings",
      tienda: "Online store",
    } as Record<string, string>,
    tags: {
      presencia: "A full interactive page that brings in customers.",
      negocio: "The full site: your services, your work and your story, in depth.",
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
      "custom-design": "Design made for your business",
      "copy-written": "Copy written with you",
      "contact-button-and-form": "Contact button and a short form",
      "ga4-with-conversion-events": "Every message and call counted",
      "local-seo-basics": "Google and the map set up for your area",
      "services-and-about-pages": "Services and about pages",
      "work-portfolio": "Work and portfolio section",
      "automatic-follow-up": "Automatic follow-up on every enquiry",
      "lead-capture": "Every enquiry captured in one list",
      "bilingual-pages": "Spanish and English",
      "booking-path": "Bookings from the site",
      "extra-form": "One more form: quotes or events",
      "booking-confirmation": "Booking confirmation and a reminder",
      "training": "A session so you know how to change it",
      "product-catalogue": "Product catalogue",
      "checkout": "Cart and checkout",
      "payment-provider-connector": "Card payments in your own account",
      "shipping-and-pickup-rules": "Shipping and pickup rules",
      "order-notifications": "Order notices to your phone",
      "aeo-ready": "Ready for ChatGPT, Gemini and Google answers",
    } as Record<string, string>,
  },
  /** Showing up in AI answers: the one place the page names AEO. */
  ai: {
    kicker: "AI answers",
    title: "How does your business show up in ChatGPT, Gemini and Google answers?",
    lead: "Every Cardon Digital website ships ready for ChatGPT, Gemini and Google's AI answers to read it, understand it and cite it. That work is called AEO, answer engine optimization: making sure an AI can find your business and say what it does, where, and for whom.",
    listTitle: "What a site ready for AI answers carries",
    items: [
      {
        h: "Structured data",
        body: "A machine-readable profile of your business, your services and your common questions, matching what the page says word for word.",
      },
      {
        h: "The answer first",
        body: "Every page opens with a short, direct answer to the question that brings people to it, with the detail after.",
      },
      {
        h: "Common questions, answered",
        body: "The questions your customers ask an AI, each answered on its own on your site.",
      },
      {
        h: "Open to AI crawlers",
        body: "The site lets in the crawlers that ChatGPT, Gemini and the search engines send, and hands them an accurate map of its pages.",
      },
      {
        h: "Fast pages, built on the server",
        body: "Every page arrives complete from the server and loads fast, so an AI reads it without waiting on code in a browser.",
      },
    ],
    honest:
      "Which business an answer mentions is up to each engine, and nobody can promise it. What we can show you is where you stand: the free diagnostic runs your customers' questions through ChatGPT, Perplexity, Gemini and Google and shows whether your business comes up and how it is described.",
  },
  faq: {
    title: "Questions about getting a business website",
    items: [
      {
        question: "How much does a website for my business cost?",
        answer:
          "It depends on what the site has to do. Cardon Digital publishes four packages, from a single page to an online store, each with its own price, plus optional monthly care. Every price is on the pricing page.",
      },
      {
        question: "How long does it take to build a business website?",
        answer:
          "Between {min} and {max} business days, depending on the package: a single page is the fastest and an online store takes the longest. Each package lists its time next to its price.",
      },
      {
        question: "What does a website need to show up in ChatGPT or Gemini answers?",
        answer:
          "An AI has to be able to read it and understand it: structured data describing the business, pages that open with a direct answer, common questions answered, open access for AI crawlers, and fast pages that arrive complete from the server. Every Cardon Digital site comes with all of it.",
      },
      {
        question: "Can you guarantee my business will show up in ChatGPT or on Google?",
        answer:
          "No. Each engine decides which businesses its answers mention, and nobody can honestly promise that. Cardon Digital delivers the work that makes it possible and the measurement: the free diagnostic checks whether your business comes up today when your customers ask.",
      },
      {
        question: "Can I make changes to my site after it is handed over?",
        answer:
          "Yes. The domain, the hosting and the access are in your name, so you can make changes yourself. If you would rather not touch it, optional monthly care covers hosting, the domain, updates and two changes a month, and you can stop it whenever you like.",
      },
      {
        question: "How do customers get in touch from the site?",
        answer:
          "Through a contact button and a short form, one tap away on a phone. Every message and every call that comes from the site is counted, so you know how many customers it brought you.",
      },
    ],
    more: "See the price of every package",
  },
  how: {
    kicker: "How it works",
    title: "How does a site get built, from the call to the handover?",
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
      captionDone: "a new client reached you",
      aria: "A search turns up the business first, its site loads on a phone block by block, three checks pass, and a message arrives.",
      fallback: "A search, your site first, a message from a new client.",
      query: "dentist in ensenada",
      results: [
        { name: "Your business", sub: "Ensenada, open now" },
        { name: "another result", sub: "" },
        { name: "another result", sub: "" },
      ],
      site: { name: "Your business", headline: "What you do, for whom", cta: "Write on WhatsApp" },
      checks: ["loads fast", "works on any screen", "one button to write"],
      message: "Hello, I saw your site. Do you have Thursday open?",
      received: "received",
    },
  },
};

const es: typeof en = {
  meta: {
    title: "Sitios web para negocios en Ensenada",
    description:
      "Cardon Digital hace sitios web para negocios en Ensenada y Baja California: rápidos en el teléfono, hechos para Google y para que ChatGPT y Gemini los lean, con el dominio a su nombre.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Sitios web",
    title: "Que lo encuentren en Google",
    titleAccent: "y le escriban desde el teléfono.",
    sub: "Cardon Digital diseña y desarrolla sitios web para negocios en Ensenada y Baja California. Cada sitio carga rápido en el teléfono, está hecho para que lo encuentren en Google y para que ChatGPT y Gemini lo puedan leer y citar, y deja a un toque la llamada o el mensaje. El dominio y el sitio quedan a su nombre.",
    proof: "Sitios recientes: Viñedo En'kanto y Aperta Media Co.",
  },
  styles: {
    line: "Cuatro negocios inventados, cada uno con su propio estilo: una vinícola, una empresa de logística, un spa y un hotel de playa.",
    cta: "Ver los estilos",
  },
  example: {
    kicker: "Un sitio reciente",
    title: "Aperta Media Co., estudio de foto y video",
    body: "Sus paquetes con precio, una calculadora que cotiza un paquete a la medida por número de videos, su trabajo en video y un editor donde ellos mismos cambian textos y fotos, sin llamarnos.",
    link: "Ver el sitio en vivo",
    desktopCap: "La página de inicio en computadora: quiénes son y qué venden, en la primera pantalla.",
    desktopAlt: "Captura de la página de inicio de Aperta Media Co. en computadora",
    phoneCap: "La misma página en el teléfono, con los paquetes a un toque.",
    phoneAlt: "Captura de la página de inicio de Aperta Media Co. en un teléfono",
  },
  gets: {
    kicker: "Cuatro cosas, en este orden",
    title: "¿Qué tiene que lograr el sitio de su negocio?",
    items: [
      {
        num: "01",
        h: "Aparecer cuando lo buscan.",
        body: "Su negocio en Google y en el mapa, con el nombre, el horario y las palabras que la gente sí usa para buscarlo.",
      },
      {
        num: "02",
        h: "Convencer en cinco segundos.",
        body: "Qué vende, para quién y por qué con usted. Textos que escribimos juntos, fotos bien acomodadas y una página que carga antes de que el visitante se desespere.",
      },
      {
        num: "03",
        h: "Que le escriban desde el teléfono.",
        body: "Mensaje directo, el número para llamar y un formulario corto, todo al alcance del pulgar. Y cada mensaje se cuenta.",
      },
      {
        num: "04",
        h: "Que siga siendo suyo.",
        body: "Dominio, hosting y accesos a su nombre. Los cambios los hace usted, o nos deja el mantenimiento por una cuota mensual.",
      },
    ],
  },
  packages: {
    kicker: "Lo que cuesta",
    title: "Cuatro paquetes, cuatro precios.",
    sub: "Precios por funciones: usted paga por las funciones que lleva su sitio.",
    fromLabel: "desde",
    daysUnit: "días hábiles",
    rangeJoin: " a ",
    pageUnit: "página",
    pagesUnit: "páginas",
    plusLabel: "Todo lo de {name}, más",
    careLabel: "Mantenimiento mensual, opcional",
    careBody: "Hosting, dominio, actualizaciones y dos cambios al mes. Lo cancela cuando quiera.",
    perMonth: "al mes",
    names: {
      presencia: "Una página",
      negocio: "Sitio completo",
      reservas: "Sitio con reservaciones",
      tienda: "Tienda en línea",
    } as Record<string, string>,
    tags: {
      presencia: "Una página completa e interactiva que atrae clientes.",
      negocio: "El sitio completo: sus servicios, sus trabajos y su historia, a fondo.",
      reservas: "Para que reserven sin llamarle.",
      tienda: "Para vender en línea.",
    } as Record<string, string>,
    features: {
      "custom-design": "Diseño hecho para su negocio",
      "copy-written": "Textos escritos con usted",
      "contact-button-and-form": "Botón de contacto y un formulario corto",
      "ga4-with-conversion-events": "Se cuenta cada mensaje y cada llamada",
      "local-seo-basics": "Google y el mapa configurados para su zona",
      "services-and-about-pages": "Páginas de servicios y de su negocio",
      "work-portfolio": "Sección de trabajos o portafolio",
      "automatic-follow-up": "Seguimiento automático de cada contacto",
      "lead-capture": "Cada contacto queda registrado en una lista",
      "bilingual-pages": "Español e inglés",
      "booking-path": "Reservaciones desde el sitio",
      "extra-form": "Un formulario adicional: cotizaciones o eventos",
      "booking-confirmation": "Confirmación de la reservación y un recordatorio",
      "training": "Una sesión para enseñarle a hacer cambios",
      "product-catalogue": "Catálogo de productos",
      "checkout": "Carrito y pago",
      "payment-provider-connector": "Cobro con tarjeta en su propia cuenta",
      "shipping-and-pickup-rules": "Reglas de envío y recolección en tienda",
      "order-notifications": "Avisos de cada pedido en su teléfono",
      "aeo-ready": "Listo para las respuestas de ChatGPT, Gemini y Google",
    } as Record<string, string>,
  },
  ai: {
    kicker: "Respuestas de IA",
    title: "¿Cómo aparece su negocio en las respuestas de ChatGPT, Gemini y Google?",
    lead: "Cada sitio web de Cardon Digital sale listo para que ChatGPT, Gemini y las respuestas de Google lo puedan leer, entender y citar. Ese trabajo se llama AEO, optimización para motores de respuesta: lograr que una inteligencia artificial encuentre su negocio y sepa decir qué hace, dónde y para quién.",
    listTitle: "Lo que lleva un sitio listo para las respuestas de IA",
    items: [
      {
        h: "Datos estructurados",
        body: "Una ficha que las máquinas pueden leer, con su negocio, sus servicios y sus preguntas frecuentes, igual a lo que dice la página.",
      },
      {
        h: "La respuesta primero",
        body: "Cada página abre con una respuesta corta y directa a la pregunta que trae a la gente, y el detalle va después.",
      },
      {
        h: "Preguntas frecuentes respondidas",
        body: "Las preguntas que sus clientes le hacen a una IA, respondidas una por una en su sitio.",
      },
      {
        h: "Abierto a los rastreadores de IA",
        body: "El sitio deja entrar a los rastreadores que mandan ChatGPT, Gemini y los buscadores, y les entrega un mapa fiel de sus páginas.",
      },
      {
        h: "Páginas rápidas, armadas en el servidor",
        body: "Cada página llega completa desde el servidor y carga rápido, así que una IA la lee sin esperar a que corra código en el navegador.",
      },
    ],
    honest:
      "Qué negocio menciona una respuesta lo decide cada motor, y nadie lo puede prometer. Lo que sí le podemos mostrar es dónde está hoy: en el diagnóstico sin costo hacemos las preguntas de sus clientes en ChatGPT, Perplexity, Gemini y Google y le enseñamos si su negocio aparece y cómo lo describen.",
  },
  faq: {
    title: "Preguntas frecuentes sobre sitios web",
    items: [
      {
        question: "¿Cuánto cuesta un sitio web para mi negocio?",
        answer:
          "Depende de lo que tenga que hacer el sitio. Cardon Digital publica cuatro paquetes, de una página a una tienda en línea, cada uno con su precio, y un mantenimiento mensual opcional. Todos los precios están en la página de precios.",
      },
      {
        question: "¿Cuánto tarda en estar listo un sitio web?",
        answer:
          "Entre {min} y {max} días hábiles, según el paquete: una página es lo más rápido y una tienda en línea lo que más tarda. Cada paquete tiene su plazo publicado junto a su precio.",
      },
      {
        question: "¿Qué necesita un sitio para aparecer en las respuestas de ChatGPT o Gemini?",
        answer:
          "Que una inteligencia artificial lo pueda leer y entender: datos estructurados que describen el negocio, páginas que abren con una respuesta directa, preguntas frecuentes respondidas, acceso libre para los rastreadores de IA y páginas rápidas que llegan completas desde el servidor. Todos los sitios de Cardon Digital lo traen.",
      },
      {
        question: "¿Pueden garantizar que mi negocio aparezca en ChatGPT o en Google?",
        answer:
          "No. Cada motor decide qué negocios mencionan sus respuestas, y nadie lo puede prometer con honestidad. Cardon Digital entrega el trabajo que lo hace posible y la medición: el diagnóstico sin costo revisa si su negocio aparece hoy cuando sus clientes preguntan.",
      },
      {
        question: "¿Puedo hacer cambios en mi sitio después de la entrega?",
        answer:
          "Sí. El dominio, el hosting y los accesos quedan a su nombre, así que los cambios los puede hacer usted. Si prefiere no tocarlo, el mantenimiento mensual opcional incluye hosting, dominio, actualizaciones y dos cambios al mes, y lo cancela cuando quiera.",
      },
      {
        question: "¿Cómo me contactan los clientes desde el sitio?",
        answer:
          "Con un botón de contacto y un formulario corto, a un toque desde el teléfono. Cada mensaje y cada llamada que llega desde el sitio se cuenta, así usted sabe cuántos clientes le trajo.",
      },
    ],
    more: "Ver el precio de cada paquete",
  },
  how: {
    kicker: "Cómo funciona",
    title: "¿Cómo se hace su sitio, de la llamada a la entrega?",
    steps: [
      { k: "01", body: "Una llamada de 30 minutos. Qué vende, a quién y qué tiene que lograr el sitio." },
      { k: "02", body: "Diseño y textos. Los revisa usted, con dos rondas de cambios." },
      { k: "03", body: "Desarrollo y entrega. Dominio, hosting y accesos a su nombre, y una sesión para enseñarle a hacer cambios." },
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
        a: "Los textos los escribimos con usted en la llamada. Las fotos pueden ser las suyas, o conseguimos unas con licencia.",
      },
      {
        q: "El que me hizo la página desapareció y se quedó con ella.",
        a: "Por eso el dominio, el hosting y los accesos quedan a su nombre desde el primer día.",
      },
      {
        q: "¿Y una plantilla de esas de unos miles de pesos?",
        a: "Sirve para tener algo en internet. Un sitio que le traiga clientes se diseña para su negocio, se escribe con usted y se mide. En eso está la diferencia de precio.",
      },
    ],
  },
  diagDesc:
    "Diez días hábiles para revisar el sitio, los anuncios y la operación de su negocio, y un informe por escrito que es suyo: qué funciona, qué falla y por dónde empezar.",
  vis: {
    rise: {
      tagBefore: "una búsqueda",
      tagMid: "un mensaje",
      captionRun: "cargando",
      captionDone: "le escribieron",
      aria: "En una búsqueda el negocio aparece primero, su sitio carga en un teléfono bloque por bloque, pasa tres revisiones y llega un mensaje.",
      fallback: "Una búsqueda, su sitio en primer lugar y el mensaje de un cliente nuevo.",
      query: "dentista en ensenada",
      results: [
        { name: "Su negocio", sub: "Ensenada, abierto ahora" },
        { name: "otro resultado", sub: "" },
        { name: "otro resultado", sub: "" },
      ],
      site: { name: "Su negocio", headline: "Lo que hace, para quién", cta: "Escribir por WhatsApp" },
      checks: ["carga rápido", "se ve en cualquier pantalla", "un botón para escribir"],
      message: "Hola, vi su sitio. ¿Hay cita el jueves?",
      received: "recibido",
    },
  },
};

export type SitiosDict = typeof en;
export const sitios: Dict<SitiosDict> = { en, es };
