import type { Guide, GuideCopy } from "./types";

/**
 * First guide (bead hq-i4b5.11): how an owner gets the business into the
 * answers of ChatGPT, Gemini and Google. Written in our own words from the
 * HubSpot Academy AEO Fundamentals course Daniel holds (course-notes.txt in
 * bunkers/cardon-digital/research/2026-10/aeo), with every outside fact cited
 * to the engine's own documentation in `sources`, fetched on 2026-10-21. The
 * guide carries no outside statistic. Its one figure is our own baseline, read
 * from BASELINE in lib/i18n/visibilidad-ia.ts through the {placeholders}, so
 * the guide and /visibilidad-ia can never disagree on it.
 *
 * Spanish is authoritative and written for an owner in Baja California;
 * English is written for a US owner. AEO is named and defined once, in the
 * first section. Nothing here promises that an engine will name anyone.
 */

const es: GuideCopy = {
  meta: {
    title: "Cómo aparecer en ChatGPT, Gemini y Google",
    description:
      "Para que ChatGPT, Gemini y Google mencionen su negocio, su sitio debe dejar entrar a sus rastreadores, contestar primero lo que preguntan sus clientes y estar respaldado por su ficha de Google.",
  },
  eyebrow: "Guía para dueños de negocio en Baja California",
  title: "¿Cómo hago que mi negocio aparezca en las respuestas de ChatGPT, Gemini y Google?",
  lede: "Para que ChatGPT, Gemini y Google mencionen su negocio, su sitio tiene que dejar entrar a sus rastreadores, cada página tiene que contestar primero lo que preguntan sus clientes, su ficha de Google tiene que estar completa y otros sitios tienen que nombrarlo. Ninguna agencia puede garantizar la mención, pero todo lo demás se puede preparar y medir.",
  sections: [
    {
      id: "como-responde",
      h: "¿De dónde saca ChatGPT la información sobre un negocio?",
      blocks: [
        {
          kind: "p",
          text: "Cuando alguien le pregunta algo a ChatGPT, Gemini, Perplexity o a las respuestas con IA de Google, el motor parte la pregunta en preguntas más chicas, busca en la web pasajes cortos que contesten cada una y escribe una sola respuesta con los que considera más confiables. A veces cita y enlaza esas fuentes.",
        },
        {
          kind: "p",
          text: "Por eso el motor rara vez lee su página completa. Toma un párrafo suelto que conteste algo concreto, como «¿quién hace pasteles para boda en Ensenada?» o «¿cuánto cuesta?». Si ese párrafo existe en su sitio y se entiende solo, tiene oportunidad de entrar en la respuesta.",
        },
        {
          kind: "p",
          text: "Al trabajo de preparar un sitio para estos motores se le llama AEO, optimización para motores de respuesta. Se apoya en lo mismo que el posicionamiento en Google de siempre y agrega dos cosas: respuestas cortas que se puedan citar solas y señales claras de quién está detrás del negocio.",
        },
      ],
    },
    {
      id: "rastreadores",
      h: "¿Cómo sé si ChatGPT y Google pueden leer mi sitio?",
      blocks: [
        {
          kind: "p",
          text: "Para que un motor de IA resuma o cite las páginas de su sitio, su rastreador tiene que poder leerlas. Lo que otros sitios dicen de usted cuenta aparte. El archivo robots.txt de su sitio dice qué rastreadores pueden entrar, y un sitio puede bloquear a los de IA sin que el dueño lo sepa, por una plantilla o un plugin de seguridad.",
        },
        {
          kind: "list",
          ordered: false,
          title: "Lo que dicen los propios motores sobre sus rastreadores",
          items: [
            "OpenAI: un sitio que bloquea a OAI-SearchBot no se resume ni se cita en las respuestas de búsqueda de ChatGPT, aunque todavía puede salir como un simple enlace. GPTBot es otro rastreador, el que junta textos para entrenar modelos, y se puede bloquear por separado.",
            "Perplexity: PerplexityBot es el rastreador que muestra y enlaza sitios en sus resultados, y la empresa recomienda dejarlo entrar para aparecer en ellos.",
            "Google: no pide ningún requisito adicional para las respuestas con IA. La página tiene que estar indexada y poder mostrarse en la búsqueda con un fragmento de texto.",
          ],
        },
        {
          kind: "p",
          text: "Para revisarlo, abra su dominio seguido de /robots.txt en el navegador y busque las palabras Disallow junto a OAI-SearchBot, PerplexityBot o Googlebot. Si no entiende lo que ve, la persona que hizo su sitio lo puede confirmar en unos minutos.",
        },
      ],
    },
    {
      id: "contenido",
      h: "¿Qué tiene que decir mi página para que una IA la cite?",
      blocks: [
        {
          kind: "p",
          text: "Una página que una IA puede citar contesta primero y explica después: en las primeras 40 a 60 palabras dice qué vende, dónde y para quién, sin pedirle al lector que siga bajando. Cada sección empieza con su respuesta y se entiende aunque alguien llegue directo a ella.",
        },
        {
          kind: "list",
          ordered: true,
          title: "Cómo ordenar una página de servicio para que la IA la cite",
          items: [
            "Abra con la respuesta: qué hace su negocio, en qué ciudad y para qué tipo de cliente.",
            "Use como títulos las preguntas que hacen sus clientes, escritas como ellos las escriben.",
            "Dé los datos concretos que nadie más tiene: su zona de servicio, su horario, sus tiempos de entrega y sus precios si los publica.",
            "Agregue una sección de preguntas frecuentes, cada respuesta completa por sí sola.",
            "Ponga nombre y cara: quién atiende, qué experiencia tiene y cómo contactarlo.",
            "Ponga la fecha de la última actualización y revise la página cada tres meses.",
          ],
        },
        {
          kind: "p",
          text: "Lo que más pesa es lo que solo usted sabe. Una página que repite lo mismo que otras cien no le da al motor una razón para citarla. Su experiencia de primera mano, sus casos y sus números propios sí.",
        },
      ],
    },
    {
      id: "datos-estructurados",
      h: "¿Qué son los datos estructurados y mi sitio los necesita?",
      blocks: [
        {
          kind: "p",
          text: "Los datos estructurados son una ficha escondida en el código de la página que les dice a Google y a los motores de IA, en un formato que las máquinas leen sin adivinar, qué es su negocio, qué servicios ofrece, dónde trabaja y cuáles son sus preguntas frecuentes.",
        },
        {
          kind: "p",
          text: "Ayudan a que el motor entienda su página, pero solo funcionan si dicen lo mismo que la página. Google pide no marcar nada que el visitante no pueda ver: una ficha que promete reseñas, precios o servicios que no están en la página puede perjudicar en lugar de ayudar.",
        },
      ],
    },
    {
      id: "ficha-google",
      h: "¿Por qué importa mi ficha de Google para aparecer en las respuestas?",
      blocks: [
        {
          kind: "p",
          text: "Su Perfil de Negocio en Google, la ficha que sale en el mapa, es una de las fuentes de las que Google saca su nombre, su dirección, su horario y sus reseñas. Google explica que los resultados locales dependen sobre todo de la relevancia, la distancia y qué tan conocido es el negocio.",
        },
        {
          kind: "list",
          ordered: false,
          title: "Lo que conviene tener al día en la ficha de Google",
          items: [
            "La categoría que mejor describe su negocio y una descripción con sus servicios.",
            "El horario real, incluidos los días festivos.",
            "El mismo nombre, teléfono y dirección que en su sitio y en sus redes.",
            "Respuestas a las reseñas, buenas y malas.",
          ],
        },
      ],
    },
    {
      id: "otros-sitios",
      h: "¿Por qué ayuda que otros sitios hablen de mi negocio?",
      blocks: [
        {
          kind: "p",
          text: "Los motores de IA no se quedan con lo que su sitio dice de usted: también revisan qué dicen de su negocio otras páginas. Un negocio que aparece en directorios, en notas de la prensa local, en reseñas y en sitios de sus socios les resulta más confiable que uno que solo se describe a sí mismo.",
        },
        {
          kind: "p",
          text: "En Baja California eso puede ser la cámara de comercio de su ciudad, la asociación de su giro, un directorio turístico o la página de un proveedor que lo recomiende. Lo importante es que su nombre, su ciudad y lo que hace se lean igual en todos lados.",
        },
      ],
    },
    {
      id: "medir",
      h: "¿Cómo sé si mi negocio ya aparece en ChatGPT y Google?",
      blocks: [
        {
          kind: "p",
          text: "La forma directa de saberlo es hacerles a los motores las preguntas que haría un cliente nuevo, el servicio y la ciudad sin el nombre de su negocio, y anotar si su negocio sale, cómo lo describen y si enlazan a su sitio.",
        },
        {
          kind: "list",
          ordered: true,
          title: "Cómo hacer la prueba usted mismo",
          items: [
            "Escriba unas diez preguntas como las escribiría un cliente, por ejemplo «¿dónde reparan aire acondicionado en Mexicali?».",
            "Hágalas en ChatGPT, Gemini, Perplexity y Google, cada vez desde una ventana privada.",
            "Guarde el texto de cada respuesta y anote si aparece su negocio y quién aparece en su lugar.",
            "Repita las mismas preguntas uno o dos meses después y compare.",
          ],
        },
        {
          kind: "table",
          caption: "Qué medir para saber si las respuestas de IA le traen clientes",
          cols: ["Dónde se ve", "Qué tan confiable es"],
          rows: [
            {
              k: "Visitas que llegan desde ChatGPT o Perplexity",
              cells: ["Google Analytics, en las fuentes de tráfico", "Alta: son personas que llegaron a su sitio"],
            },
            {
              k: "Búsquedas con el nombre de su negocio",
              cells: ["Google Search Console", "Alta: más gente lo busca por su nombre"],
            },
            {
              k: "Menciones en las respuestas",
              cells: ["Preguntas de prueba en cada motor", "Media: las respuestas cambian de un día a otro"],
            },
            {
              k: "Puntajes de visibilidad en IA",
              cells: ["Herramientas de medición de pago", "Baja: muestran la tendencia de varios meses; un solo día dice poco"],
            },
          ],
        },
        {
          kind: "p",
          text: "Nosotros hicimos esta prueba con Cardon Digital el {date}: {prompts} preguntas en {engines} motores. Nuestro negocio apareció en {mentioned} de {answers} respuestas, y en {unbrandedMentioned} de {unbranded} sin contar la pregunta que llevaba nuestro nombre. Ese es el punto de partida contra el que medimos cada cambio a este sitio.",
        },
        {
          kind: "service",
          text: "Si prefiere que alguien más lo haga, en Cardon Digital esta misma revisión va incluida en el diagnóstico sin costo, con la tabla de respuestas por motor y lo que le falta a su sitio.",
          label: "Cómo es la revisión de visibilidad en IA",
          path: "/visibilidad-ia",
        },
      ],
    },
  ],
  sources: [
    {
      title: "Overview of OpenAI Crawlers",
      publisher: "OpenAI (en inglés)",
      url: "https://developers.openai.com/api/docs/bots",
      note: "Qué hacen OAI-SearchBot y GPTBot, y qué pasa si se bloquean.",
    },
    {
      title: "Perplexity Crawlers",
      publisher: "Perplexity (en inglés)",
      url: "https://docs.perplexity.ai/guides/bots",
      note: "Para qué sirve PerplexityBot.",
    },
    {
      title: "Las funciones de IA y tu sitio web",
      publisher: "Google Search Central",
      url: "https://developers.google.com/search/docs/appearance/ai-features?hl=es",
      note: "Los requisitos para aparecer en las respuestas con IA de Google.",
    },
    {
      title: "Lineamientos generales de datos estructurados",
      publisher: "Google Search Central",
      url: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies?hl=es",
      note: "La regla de no marcar contenido que el visitante no ve.",
    },
    {
      title: "Sugerencias para mejorar tu posicionamiento local en Google",
      publisher: "Ayuda de Perfil de Negocio de Google",
      url: "https://support.google.com/business/answer/7091?hl=es",
      note: "Relevancia, distancia y prominencia en los resultados locales.",
    },
  ],
  faq: {
    title: "Preguntas frecuentes sobre aparecer en las respuestas de IA",
    items: [
      {
        question: "¿Alguien me puede garantizar que mi negocio aparezca en ChatGPT?",
        answer:
          "No. Cada motor decide qué negocios nombran sus respuestas y cambia su forma de elegir sin avisar. Quien le garantice un lugar en ChatGPT le promete algo que no controla. Lo que sí se puede hacer es preparar su sitio para que lo lean y medir si aparece.",
      },
      {
        question: "¿Si bloqueo a los rastreadores de IA, protejo mi contenido?",
        answer:
          "Depende de cuál bloquee. OpenAI separa a GPTBot, que junta textos para entrenar modelos, de OAI-SearchBot, que alimenta las respuestas de búsqueda de ChatGPT. Puede bloquear el primero y dejar entrar al segundo, y así su negocio sigue pudiendo aparecer en las respuestas.",
      },
      {
        question: "¿Me basta con Facebook e Instagram, o necesito un sitio web?",
        answer:
          "Las redes ayudan a que otros sitios lo nombren. Un sitio propio es la única página donde usted decide qué se dice de su negocio, con sus precios, su zona y sus preguntas frecuentes.",
      },
      {
        question: "¿Cuánto tarda mi negocio en aparecer después de arreglar el sitio?",
        answer:
          "Nadie le puede poner fecha. Cada motor vuelve a leer los sitios y actualiza lo que sabe a su propio ritmo. Lo útil es repetir las mismas preguntas de prueba cada mes o dos y comparar con la primera vez.",
      },
      {
        question: "¿Conviene tener mi sitio también en inglés?",
        answer:
          "Si atiende a turistas o clientes de Estados Unidos, sí. Ellos le preguntan a ChatGPT en inglés, y una página escrita en inglés para ellos les da a los motores un texto que pueden citar en esa respuesta.",
      },
    ],
  },
};

const en: GuideCopy = {
  meta: {
    title: "How to get into ChatGPT and Google answers",
    description:
      "For ChatGPT, Gemini and Google to name your business, your site has to let their crawlers in, answer your customers' questions first, and be backed by your Google Business Profile.",
  },
  eyebrow: "A guide for small business owners",
  title: "How do I get my business into ChatGPT, Gemini and Google's AI answers?",
  lede: "For ChatGPT, Gemini and Google to name your business, your site has to let their crawlers in, each page has to answer your customers' questions first, your Google Business Profile has to be complete, and other sites have to mention you. No agency can guarantee the mention, but everything else can be prepared and measured.",
  sections: [
    {
      id: "como-responde",
      h: "Where does ChatGPT get its information about a business?",
      blocks: [
        {
          kind: "p",
          text: "When someone asks ChatGPT, Gemini, Perplexity or Google's AI answers a question, the engine splits it into smaller questions, searches the web for short passages that answer each one, and writes a single answer from the passages it trusts most. Sometimes it cites and links those sources.",
        },
        {
          kind: "p",
          text: "So the engine rarely reads your whole page. It lifts one paragraph that answers something specific, like “who does wedding cakes near me?” or “how much does it cost?”. If that paragraph is on your site and makes sense on its own, it has a chance of making it into the answer.",
        },
        {
          kind: "p",
          text: "Preparing a site for these engines is called AEO, answer engine optimization. It rests on the same base as ordinary Google SEO and adds two things: short answers that can be quoted on their own, and clear signs of who stands behind the business.",
        },
      ],
    },
    {
      id: "rastreadores",
      h: "How do I know if ChatGPT and Google can read my site?",
      blocks: [
        {
          kind: "p",
          text: "For an AI engine to summarize or cite your own pages, its crawler has to be able to read them. What other sites say about you counts separately. Your site's robots.txt file says which crawlers may come in, and a site can block the AI ones without the owner knowing, through a theme setting or a security plugin.",
        },
        {
          kind: "list",
          ordered: false,
          title: "What the engines themselves say about their crawlers",
          items: [
            "OpenAI: a site that blocks OAI-SearchBot is not summarized or cited in ChatGPT search answers, though it can still appear as a plain navigational link. GPTBot is a separate crawler, the one that gathers text to train models, and it can be blocked on its own.",
            "Perplexity: PerplexityBot is the crawler that surfaces and links sites in its results, and the company recommends allowing it to appear there.",
            "Google: there are no extra requirements for its AI answers. The page has to be indexed and eligible to show in Search with a snippet.",
          ],
        },
        {
          kind: "p",
          text: "To check, open your domain followed by /robots.txt in a browser and look for the word Disallow next to OAI-SearchBot, PerplexityBot or Googlebot. If it makes no sense to you, whoever built your site can confirm it in a few minutes.",
        },
      ],
    },
    {
      id: "contenido",
      h: "What does my page need to say for an AI to cite it?",
      blocks: [
        {
          kind: "p",
          text: "A page an AI can cite answers first and explains after: in its first 40 to 60 words it says what you sell, where, and for whom, without asking the reader to scroll. Every section opens with its answer and makes sense to someone who lands on it directly.",
        },
        {
          kind: "list",
          ordered: true,
          title: "How to lay out a service page so an AI can cite it",
          items: [
            "Open with the answer: what your business does, in what city, and for what kind of customer.",
            "Use your customers' questions as headings, worded the way they type them.",
            "Give the specifics nobody else has: your service area, hours, turnaround times, and prices if you publish them.",
            "Add a common questions section, each answer complete on its own.",
            "Put a name and a face on it: who does the work, what experience they bring, how to reach them.",
            "Show the date of the last update and reread the page every three months.",
          ],
        },
        {
          kind: "p",
          text: "What counts most is what only you know. A page that says what a hundred others say gives the engine no reason to cite it. Your first-hand experience, your own jobs and your own numbers do.",
        },
      ],
    },
    {
      id: "datos-estructurados",
      h: "What is structured data and does my site need it?",
      blocks: [
        {
          kind: "p",
          text: "Structured data is a profile tucked into a page's code that tells Google and AI engines, in a format machines read without guessing, what your business is, what services it offers, where it works and what its common questions are.",
        },
        {
          kind: "p",
          text: "It helps an engine understand your page, but only when it says the same thing the page says. Google asks you never to mark up anything a visitor cannot see: a profile that claims reviews, prices or services missing from the page can hurt more than help.",
        },
      ],
    },
    {
      id: "ficha-google",
      h: "Why does my Google Business Profile matter for AI answers?",
      blocks: [
        {
          kind: "p",
          text: "Your Google Business Profile, the listing that shows on the map, is one of the places Google takes your name, address, hours and reviews from. Google says local results come down mainly to relevance, distance and how well known the business is.",
        },
        {
          kind: "list",
          ordered: false,
          title: "What to keep current on your Google Business Profile",
          items: [
            "The category that best describes your business, and a description that names your services.",
            "Your real hours, holidays included.",
            "The same name, phone and address as on your site and your social pages.",
            "Replies to your reviews, good and bad.",
          ],
        },
      ],
    },
    {
      id: "otros-sitios",
      h: "Why does it help when other sites mention my business?",
      blocks: [
        {
          kind: "p",
          text: "AI engines do not stop at what your site says about you: they also check what other pages say about your business. A business that shows up in directories, local news, reviews and partners' sites reads as more trustworthy to them than one that only describes itself.",
        },
        {
          kind: "p",
          text: "For a local business that can be your chamber of commerce, your trade association, a regional directory or a supplier's page that recommends you. What matters is that your name, your city and what you do read the same everywhere.",
        },
      ],
    },
    {
      id: "medir",
      h: "How do I know if my business already shows up in ChatGPT and Google?",
      blocks: [
        {
          kind: "p",
          text: "The direct way to find out is to ask the engines what a new customer would ask, the service and the city without your business name, and write down whether your business comes up, how it is described and whether it links to your site.",
        },
        {
          kind: "list",
          ordered: true,
          title: "How to run the test yourself",
          items: [
            "Write about ten questions the way a customer would, for example “who repairs AC in Phoenix on weekends?”.",
            "Ask each one in ChatGPT, Gemini, Perplexity and Google, from a private window every time.",
            "Keep the text of every answer and note whether your business appears and who appears instead.",
            "Ask the same questions again a month or two later and compare.",
          ],
        },
        {
          kind: "table",
          caption: "What to measure to know whether AI answers bring you customers",
          cols: ["Where you see it", "How reliable it is"],
          rows: [
            {
              k: "Visits that arrive from ChatGPT or Perplexity",
              cells: ["Google Analytics, under traffic sources", "High: these are people who reached your site"],
            },
            {
              k: "Searches for your business name",
              cells: ["Google Search Console", "High: more people looking you up by name"],
            },
            {
              k: "Mentions in the answers",
              cells: ["Test questions in each engine", "Medium: answers change from one day to the next"],
            },
            {
              k: "AI visibility scores",
              cells: ["Paid tracking tools", "Low: they show the trend over months; a single day says little"],
            },
          ],
        },
        {
          kind: "p",
          text: "We ran this test on Cardon Digital on {date}: {prompts} questions in {engines} engines. Our business came up in {mentioned} of {answers} answers, and in {unbrandedMentioned} of {unbranded} once the question carrying our name is set aside. That is the starting point we measure every change to this site against.",
        },
        {
          kind: "service",
          text: "If you would rather have someone else do it, Cardon Digital runs this same check inside its free diagnostic, with the table of answers by engine and what your site is missing.",
          label: "How the AI visibility check works",
          path: "/visibilidad-ia",
        },
      ],
    },
  ],
  sources: [
    {
      title: "Overview of OpenAI Crawlers",
      publisher: "OpenAI",
      url: "https://developers.openai.com/api/docs/bots",
      note: "What OAI-SearchBot and GPTBot do, and what blocking each one means.",
    },
    {
      title: "Perplexity Crawlers",
      publisher: "Perplexity",
      url: "https://docs.perplexity.ai/guides/bots",
      note: "What PerplexityBot is for.",
    },
    {
      title: "AI Features and Your Website",
      publisher: "Google Search Central",
      url: "https://developers.google.com/search/docs/appearance/ai-features",
      note: "The requirements for showing up in Google's AI answers.",
    },
    {
      title: "General Structured Data Guidelines",
      publisher: "Google Search Central",
      url: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies",
      note: "The rule against marking up content a visitor cannot see.",
    },
    {
      title: "Tips to improve your local ranking on Google",
      publisher: "Google Business Profile Help",
      url: "https://support.google.com/business/answer/7091",
      note: "Relevance, distance and prominence in local results.",
    },
  ],
  faq: {
    title: "Common questions about showing up in AI answers",
    items: [
      {
        question: "Can anyone guarantee my business shows up in ChatGPT?",
        answer:
          "No. Each engine decides which businesses its answers name, and changes how it chooses without notice. Anyone who guarantees you a spot in ChatGPT is promising something they do not control. What can be done is to prepare your site so it gets read, and measure whether you appear.",
      },
      {
        question: "If I block AI crawlers, am I protecting my content?",
        answer:
          "It depends which one you block. OpenAI keeps GPTBot, which gathers text to train models, apart from OAI-SearchBot, which feeds ChatGPT's search answers. You can block the first and let the second in, so your business can still appear in the answers.",
      },
      {
        question: "Are Facebook and Instagram enough, or do I need a website?",
        answer:
          "Social pages help other sites mention you. Your own site is the one page where you decide what is said about your business, with your prices, your service area and your common questions.",
      },
      {
        question: "How long until my business shows up after the site is fixed?",
        answer:
          "Nobody can put a date on it. Each engine rereads sites and updates what it knows at its own pace. What helps is asking the same test questions every month or two and comparing them with the first time.",
      },
      {
        question: "Should my site also be in Spanish?",
        answer:
          "If a good share of your customers speak Spanish, yes. They ask ChatGPT in Spanish, and a page written in Spanish for them gives the engines text they can quote in that answer.",
      },
    ],
  },
};

export const aparecerEnChatgpt: Guide = {
  slug: "aparecer-en-chatgpt",
  datePublished: "2026-10-21",
  dateModified: "2026-10-21",
  reviewBy: "2027-01-21",
  copy: { es, en },
};
