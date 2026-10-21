import type { Dict } from "./rich";

/**
 * AI visibility page copy (/visibilidad-ia, bead hq-i4b5.9, AEO spec in
 * bunkers/cardon-digital/research/2026-10/aeo/SPEC.md). The standalone half of
 * the AEO offer, for a business that already has a site: the check runs inside
 * the free diagnostic and the fixes are a website package at the published
 * prices, so this file carries no price and no new offer.
 *
 * Spanish is written for a Mexican owner and is the authoritative version;
 * English is written for a US owner. AEO is named and defined in the `aeo`
 * section only. Nothing here says an engine will cite anyone: we promise the
 * measurement and the work, never the engine's choice.
 */

/**
 * Our own baseline, measured on cardondigital.com on 2026-10-20 (bunkers
 * cardon-digital/research/2026-10/aeo/baseline-2026-10.md, bead hq-i4b5.4):
 * ten customer questions in ChatGPT, Perplexity, Gemini and Google, forty
 * answers, Cardon Digital named in four, and in one of the thirty-six that do
 * not carry our name. The page fills these into both locales, so the two can
 * never disagree on a figure.
 */
export const BASELINE = {
  date: "2026-10-20",
  prompts: 10,
  engines: 4,
  answers: 40,
  mentioned: 4,
  unbranded: 36,
  unbrandedMentioned: 1,
} as const;

const en = {
  meta: {
    title: "Is your business in ChatGPT and Google?",
    description:
      "Cardon Digital checks, free, whether your business comes up when customers ask ChatGPT, Perplexity, Gemini and Google, how it is described, and what your site is missing for these engines to cite it.",
  },
  crumbs: {
    aria: "Breadcrumb",
    home: "Home",
    here: "AI visibility",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Visibility in AI answers",
    title: "When your customers ask ChatGPT,",
    titleAccent: "does your business come up?",
    sub: "Cardon Digital checks whether your business comes up when your customers ask ChatGPT, Perplexity, Gemini and Google, how each answer describes it, and whether it links to your site. The check is part of the free diagnostic. Where something is missing, we fix your site so these engines can read it, understand it and cite it.",
    jump: "What the check covers",
    proof: "We ran it on our own business first: {prompts} questions in {engines} engines, results below.",
  },
  aeo: {
    kicker: "The term",
    title: "What is AEO?",
    definition:
      "AEO, answer engine optimization, is the work of preparing a website so ChatGPT, Perplexity, Gemini and Google's AI answers can find it, understand it and cite it when someone asks about what you sell.",
    table: {
      caption: "Search rankings and AI answers, side by side",
      cols: ["SEO: ranking on Google", "AEO: showing up in AI answers"],
      rows: [
        {
          k: "The goal",
          seo: "Your page near the top of the results list.",
          aeo: "The answer names your business and links to your site.",
        },
        {
          k: "What the customer sees",
          seo: "Ten links, and they pick one to open.",
          aeo: "One written answer that cites a handful of sources.",
        },
        {
          k: "What the engine reads",
          seo: "The whole page and the links pointing to it.",
          aeo: "Short passages that make sense on their own, from several sources at once.",
        },
        {
          k: "How it is measured",
          seo: "Position, visits and clicks from Google.",
          aeo: "Mentions and links in the answers, and visits that arrive from ChatGPT or Perplexity.",
        },
      ],
    },
    shared:
      "Both rest on the same base: a fast site, original content written by people who know the trade, and a business that other pages recognize.",
  },
  engines: {
    kicker: "How they choose",
    title: "How do ChatGPT and Google decide which business to mention?",
    lead: "An answer engine such as ChatGPT, Perplexity, Gemini or Google's AI answers splits a question into smaller ones, searches the web for short passages that answer each, and writes one answer out of the passages it trusts most.",
    items: [
      {
        h: "It reads in passages",
        body: "It lifts single paragraphs out of a page. A paragraph that answers the question by itself has a better chance of being used.",
      },
      {
        h: "It breaks the question apart",
        body: "“Restaurant website in Ensenada” becomes several questions: who builds them, what they cost, how long they take. Each one can be answered from a different source.",
      },
      {
        h: "It looks for signs of trust",
        body: "It favors sources with a named author, their own data and first-hand experience, and businesses that other pages, directories and reviews also mention.",
      },
      {
        h: "It has to be let in",
        body: "A site that blocks AI crawlers, loads slowly or builds its content in the browser may never be read at all.",
      },
      {
        h: "It favors what is current",
        body: "Pages with a date and up-to-date content weigh more than pages that have not changed in years.",
      },
    ],
  },
  check: {
    kicker: "In the diagnostic",
    title: "What does the diagnostic check in AI answers?",
    lead: "The Cardon Digital diagnostic includes an AI visibility check: we ask ChatGPT, Perplexity, Gemini and Google the questions your customers would ask, and record what each answer says about your business. It is free, and the results come in the written diagnostic memo.",
    stepsTitle: "How the check is done",
    steps: [
      "We write about ten questions the way a customer would: the service and the city without your business name, plus one with the name.",
      "We ask each question in ChatGPT, Perplexity, Gemini and Google, from a fresh session every time.",
      "We keep the full text of every answer, exactly as it came out.",
      "You get a table by question and by engine with what each answer said about you.",
    ],
    recordTitle: "What we record from each answer",
    record: [
      "Whether your business comes up.",
      "How it is described: what you do, where and for whom.",
      "Whether the answer links to your site.",
      "Which other businesses it names.",
    ],
    ownTitle: "We ran it on ourselves first",
    own: "On {date}, we asked {prompts} customer questions about websites, ads and software in Ensenada and Valle de Guadalupe, in {engines} engines. Cardon Digital came up in {mentioned} of {answers} answers, and in {unbrandedMentioned} of {unbranded} once the question with our name is set aside. That is our starting point, measured the same way we measure yours.",
  },
  fix: {
    kicker: "What we fix",
    title: "What changes on your site so an AI can cite it?",
    lead: "When the check shows your business missing or described wrong, these are the fixes we make. They come as one of our website packages, at the prices already published.",
    items: [
      "Structured data: a machine-readable profile of your business, your services and your common questions, matching the page word for word.",
      "The answer first: every page opens with a short, direct answer to the question that brings people to it.",
      "Common questions: what your customers ask, each answered on its own.",
      "Access for AI crawlers, and an accurate map of your pages.",
      "Your Google Business Profile and map listing, with your name, hours and service area.",
    ],
    service: "What a Cardon Digital website includes",
    prices: "Website package prices",
    honest:
      "Which business an answer mentions is up to each engine, and nobody can promise it. What we promise is the work and the measurement.",
  },
  creds: {
    kicker: "Certificate",
    title: "Who runs the check?",
    lead: "The person who runs your check holds HubSpot Academy's certificate on answer engines. Every detail below can be checked on HubSpot's own page.",
    holder: "Holder",
    issuer: "Issued by",
    valid: "Valid",
    validRange: "{from} to {until}",
    code: "Code",
    newTab: "(opens in a new tab)",
  },
  faq: {
    title: "Questions about visibility in AI answers",
    items: [
      {
        question: "Can you guarantee my business shows up in ChatGPT?",
        answer:
          "No. Each engine decides which businesses its answers mention, and nobody can honestly promise that. Cardon Digital measures where you stand today and does the work on your site that lets the engines read it, understand it and cite it.",
      },
      {
        question: "What does the AI visibility check cost?",
        answer:
          "Nothing. It is part of the free Cardon Digital diagnostic. If you then want the fixes, they come as a website package, at the prices on the pricing page.",
      },
      {
        question: "Which AI engines do you check?",
        answer:
          "Four: ChatGPT, Perplexity, Gemini and Google, where we read the AI-generated summary shown above the results. Every question is asked in all four, word for word.",
      },
      {
        question: "What questions do you use for the check?",
        answer:
          "The ones a customer who does not know you yet would ask: the service and the city, like “dentist open Saturdays in Ensenada”. One more carries your business name, to see how the engines describe you to someone already looking for you.",
      },
      {
        question: "Is the check useful if my business already has a website?",
        answer:
          "Yes, that is who it is for. The diagnostic memo says what your current site is missing for an AI to read it. The fixes come as one of our website packages, which carry all of it as standard, and you decide whether to go ahead.",
      },
      {
        question: "How long until the answers change?",
        answer:
          "Nobody can put a date on it: each engine updates what it knows about a business at its own pace. What can be done is to ask the same questions again later and compare them with the first check.",
      },
    ],
  },
  diagDesc:
    "Ten business days on your site, how your business comes up in ChatGPT, Perplexity, Gemini and Google, and your operation, and a written memo that is yours: what is true, what is broken, what to build first.",
};

const es: typeof en = {
  meta: {
    title: "¿Aparece su negocio en ChatGPT y Google?",
    description:
      "Cardon Digital revisa sin costo si su negocio aparece cuando sus clientes preguntan en ChatGPT, Perplexity, Gemini y Google, cómo lo describen y qué le falta a su sitio para que estos motores lo puedan citar.",
  },
  crumbs: {
    aria: "Ruta de navegación",
    home: "Inicio",
    here: "Visibilidad en IA",
  },
  hero: {
    aria: "Introducción",
    eyebrow: "Visibilidad en respuestas de IA",
    title: "Cuando sus clientes le preguntan a ChatGPT,",
    titleAccent: "¿sale su negocio?",
    sub: "Cardon Digital revisa si su negocio aparece cuando sus clientes le preguntan a ChatGPT, Perplexity, Gemini y Google, cómo lo describe cada respuesta y si enlaza a su sitio. La revisión va incluida en el diagnóstico sin costo. Si falta algo, arreglamos su sitio para que estos motores lo puedan leer, entender y citar.",
    jump: "Qué revisamos",
    proof: "Primero lo probamos con nuestro propio negocio: {prompts} preguntas en {engines} motores, con los resultados más abajo.",
  },
  aeo: {
    kicker: "El término",
    title: "¿Qué es AEO?",
    definition:
      "AEO, optimización para motores de respuesta, es el trabajo de preparar un sitio web para que ChatGPT, Perplexity, Gemini y las respuestas de IA de Google lo encuentren, lo entiendan y lo citen cuando alguien pregunta por lo que usted vende.",
    table: {
      caption: "Buscadores y respuestas de IA, lado a lado",
      cols: ["SEO: posicionamiento en Google", "AEO: aparecer en respuestas de IA"],
      rows: [
        {
          k: "Lo que busca",
          seo: "Que su página salga arriba en la lista de resultados.",
          aeo: "Que la respuesta nombre su negocio y enlace a su sitio.",
        },
        {
          k: "Lo que ve el cliente",
          seo: "Diez enlaces, y escoge cuál abrir.",
          aeo: "Una sola respuesta escrita que cita unas cuantas fuentes.",
        },
        {
          k: "Lo que lee el motor",
          seo: "La página completa y los enlaces que llevan a ella.",
          aeo: "Pasajes cortos que se entienden solos, de varias fuentes a la vez.",
        },
        {
          k: "Cómo se mide",
          seo: "Posición, visitas y clics desde Google.",
          aeo: "Menciones y enlaces en las respuestas, y visitas que llegan desde ChatGPT o Perplexity.",
        },
      ],
    },
    shared:
      "Los dos se apoyan en lo mismo: un sitio rápido, contenido propio escrito por quien conoce el oficio y un negocio que otras páginas reconocen.",
  },
  engines: {
    kicker: "Cómo eligen",
    title: "¿Cómo deciden ChatGPT y Google qué negocio mencionar?",
    lead: "Un motor de respuesta, como ChatGPT, Perplexity, Gemini o las respuestas de IA de Google, parte la pregunta en preguntas más chicas, busca en la web pasajes cortos que contesten cada una y arma una sola respuesta con los que le parecen más confiables.",
    items: [
      {
        h: "Lee por pasajes",
        body: "Toma párrafos sueltos de una página. Un párrafo que contesta la pregunta por sí solo tiene más oportunidad de que lo usen.",
      },
      {
        h: "Desarma la pregunta",
        body: "«Página web para restaurante en Ensenada» se vuelve varias: quién las hace, cuánto cuestan, cuánto tardan. Cada una se puede contestar con una fuente distinta.",
      },
      {
        h: "Busca señales de confianza",
        body: "Prefiere fuentes con autor identificado, datos propios y experiencia de primera mano, y negocios que otras páginas, directorios y reseñas también nombran.",
      },
      {
        h: "Necesita poder entrar",
        body: "Un sitio que bloquea a los rastreadores de IA, carga lento o arma su contenido en el navegador puede quedarse sin leer.",
      },
      {
        h: "Prefiere lo reciente",
        body: "Las páginas con fecha y contenido al día pesan más que las que llevan años sin cambiar.",
      },
    ],
  },
  check: {
    kicker: "En el diagnóstico",
    title: "¿Qué revisa el diagnóstico en las respuestas de IA?",
    lead: "El diagnóstico de Cardon Digital incluye una revisión de visibilidad en IA: hacemos en ChatGPT, Perplexity, Gemini y Google las preguntas que harían sus clientes y anotamos qué dice cada respuesta de su negocio. Es sin costo, y los resultados van en el informe del diagnóstico.",
    stepsTitle: "Cómo se hace la revisión",
    steps: [
      "Escribimos unas diez preguntas como las escribiría un cliente: el servicio y la ciudad sin el nombre de su negocio, y una con el nombre.",
      "Hacemos cada pregunta en ChatGPT, Perplexity, Gemini y Google, cada vez desde una sesión nueva.",
      "Guardamos el texto completo de cada respuesta, tal como salió.",
      "Le entregamos una tabla por pregunta y por motor con lo que cada respuesta dijo de usted.",
    ],
    recordTitle: "Lo que anotamos de cada respuesta",
    record: [
      "Si su negocio aparece.",
      "Cómo lo describe: qué hace, dónde y para quién.",
      "Si la respuesta enlaza a su sitio.",
      "Qué otros negocios nombra.",
    ],
    ownTitle: "Primero lo hicimos con nosotros",
    own: "El {date} hicimos {prompts} preguntas de clientes sobre sitios web, anuncios y software en Ensenada y el Valle de Guadalupe, en {engines} motores. Cardon Digital apareció en {mentioned} de {answers} respuestas, y en {unbrandedMentioned} de {unbranded} sin contar la pregunta con nuestro nombre. Ese es nuestro punto de partida, medido igual que medimos el suyo.",
  },
  fix: {
    kicker: "Lo que arreglamos",
    title: "¿Qué cambia en su sitio para que una IA lo pueda citar?",
    lead: "Cuando la revisión muestra que su negocio no aparece o aparece mal descrito, estos son los arreglos que hacemos. Se contratan como uno de nuestros paquetes de sitio web, con los precios ya publicados.",
    items: [
      "Datos estructurados: una ficha que las máquinas pueden leer, con su negocio, sus servicios y sus preguntas frecuentes, igual a lo que dice la página.",
      "La respuesta primero: cada página abre con una respuesta corta y directa a la pregunta que trae a la gente.",
      "Preguntas frecuentes: las dudas de sus clientes, cada una con su respuesta.",
      "Acceso para los rastreadores de IA y un mapa fiel de sus páginas.",
      "Su perfil de negocio en Google y en el mapa, con su nombre, su horario y su zona.",
    ],
    service: "Lo que incluye un sitio web de Cardon Digital",
    prices: "Precios de los paquetes de sitio web",
    honest:
      "Qué negocio menciona una respuesta lo decide cada motor, y nadie lo puede prometer. Lo que sí prometemos es el trabajo y la medición.",
  },
  creds: {
    kicker: "Certificación",
    title: "¿Quién hace la revisión?",
    lead: "Quien hace su revisión tiene la certificación de HubSpot Academy sobre motores de respuesta. Cada dato de abajo se puede comprobar en la página de HubSpot.",
    holder: "Titular",
    issuer: "Emitida por",
    valid: "Vigencia",
    validRange: "Del {from} al {until}",
    code: "Código",
    newTab: "(se abre en otra pestaña)",
  },
  faq: {
    title: "Preguntas frecuentes sobre la visibilidad en IA",
    items: [
      {
        question: "¿Pueden garantizar que mi negocio aparezca en ChatGPT?",
        answer:
          "No. Cada motor decide qué negocios mencionan sus respuestas, y nadie lo puede prometer con honestidad. Cardon Digital mide dónde está hoy su negocio y hace en su sitio el trabajo que les permite a los motores leerlo, entenderlo y citarlo.",
      },
      {
        question: "¿Cuánto cuesta la revisión de visibilidad en IA?",
        answer:
          "Nada. Va incluida en el diagnóstico sin costo de Cardon Digital. Si después quiere los arreglos, se contratan como un paquete de sitio web, con los precios de la página de precios.",
      },
      {
        question: "¿En qué motores de IA revisan mi negocio?",
        answer:
          "En cuatro: ChatGPT, Perplexity, Gemini y Google, donde leemos el resumen creado por IA que sale arriba de los resultados. Cada pregunta se hace en los cuatro con las mismas palabras.",
      },
      {
        question: "¿Qué preguntas usan para la revisión?",
        answer:
          "Las que haría un cliente que todavía no lo conoce: el servicio y la ciudad, como «dentista que abre en sábado en Ensenada». Una más lleva el nombre de su negocio, para ver cómo lo describen los motores a quien ya lo está buscando.",
      },
      {
        question: "¿Me sirve la revisión si mi negocio ya tiene sitio web?",
        answer:
          "Sí, está pensada para eso. El informe del diagnóstico le dice qué le falta a su sitio actual para que una IA lo lea. Los arreglos se hacen como uno de nuestros paquetes de sitio web, que ya incluyen todo eso, y usted decide si los contrata.",
      },
      {
        question: "¿Cuánto tardan en cambiar las respuestas?",
        answer:
          "Nadie le puede poner fecha: cada motor actualiza a su propio ritmo lo que sabe de un negocio. Lo que sí se puede hacer es repetir las mismas preguntas más adelante y compararlas con la primera revisión.",
      },
    ],
  },
  diagDesc:
    "Diez días hábiles para revisar su sitio, cómo aparece su negocio en ChatGPT, Perplexity, Gemini y Google, y su operación, y un informe por escrito que es suyo: qué funciona, qué falla y por dónde empezar.",
};

export type VisibilidadDict = typeof en;
export const visibilidad: Dict<VisibilidadDict> = { en, es };
