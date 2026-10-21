import type { Locale } from "@/lib/i18n/config";
import { sitios } from "@/lib/i18n/sitios";
import {
  currencyByLocale,
  formatPrice,
  webCareMonthly,
  webPackageById,
  type WebPackageId,
} from "@/lib/pricing";
import type { Guide, GuideCopy } from "./types";

/**
 * Second guide (bead hq-i4b5.12): what a website costs a business in
 * Ensenada. The original value is our own published prices, and none of them
 * is typed here: every figure is read from lib/pricing.ts through the helpers
 * below, and the package and feature names from lib/i18n/sitios.ts, so the
 * guide, /sitios-web and /precios can never disagree. guias-page.test.ts fails
 * on a price literal in this file.
 *
 * The outside facts (how a .mx domain renews, a hosting plan's first year
 * against its renewal, email billed per user, Google not promising to index a
 * page) cite the page that says them in `sources`, fetched on 2026-10-21. The
 * guide carries no outside price: a market figure would be typed money that
 * no test can hold to its source.
 */

const from = (l: Locale, id: WebPackageId) =>
  formatPrice(l, webPackageById(id).from[currencyByLocale[l]]);
const care = (l: Locale) => formatPrice(l, webCareMonthly()[currencyByLocale[l]]);
const days = (id: WebPackageId) => webPackageById(id).deliveryDays;
const pages = (id: WebPackageId) => webPackageById(id).pages;
const name = (l: Locale, id: WebPackageId) => sitios[l].packages.names[id];
const tag = (l: Locale, id: WebPackageId) => sitios[l].packages.tags[id];
const feature = (l: Locale, id: string) => sitios[l].packages.features[id];

const es: GuideCopy = {
  meta: {
    title: "Cuánto cuesta una página web en Ensenada",
    description: `En Cardon Digital una página web cuesta desde ${from("es", "presencia")} y una tienda en línea desde ${from("es", "tienda")}. El precio depende de las páginas y de lo que el sitio tiene que hacer.`,
  },
  eyebrow: "Guía para dueños de negocio en Ensenada y Baja California",
  title: "¿Cuánto cuesta una página web para un negocio en Ensenada?",
  lede: `El precio de una página web depende de cuántas páginas lleva y de lo que tiene que hacer: recibir mensajes, tomar reservaciones o vender en línea. En Cardon Digital una página sola cuesta desde ${from("es", "presencia")} y una tienda en línea desde ${from("es", "tienda")}. Aparte se pagan el dominio y el hosting, que hay que renovar.`,
  sections: [
    {
      id: "de-que-depende",
      h: "¿De qué depende el precio de una página web?",
      blocks: [
        {
          kind: "p",
          text: "El precio de una página web depende sobre todo de las horas que lleva hacerla, y esas horas las ponen el número de páginas, lo que el sitio tiene que hacer y quién escribe los textos. Una página que solo presenta su negocio lleva menos trabajo que un sitio que toma reservaciones o cobra con tarjeta.",
        },
        {
          kind: "list",
          ordered: false,
          title: "Lo que sube o baja el precio de un sitio web",
          items: [
            "Cuántas páginas lleva: una sola, o páginas aparte para servicios, trabajos y contacto.",
            "Lo que tiene que hacer: recibir mensajes, agendar reservaciones, vender productos o cobrar en línea.",
            "Quién escribe los textos y consigue las fotos: usted o quien hace el sitio.",
            "Si va en uno o en dos idiomas, algo común en Ensenada por el turismo.",
            "Si el diseño se hace para su negocio o sale de una plantilla.",
          ],
        },
      ],
    },
    {
      id: "precios",
      h: "¿Cuánto cuesta cada tipo de sitio web en Cardon Digital?",
      blocks: [
        {
          kind: "p",
          text: `Cardon Digital publica cuatro paquetes de sitio web, de una página a una tienda en línea. El más chico cuesta desde ${from("es", "presencia")} y el más grande desde ${from("es", "tienda")}. Cada precio sale de las horas que lleva el paquete, y lo que su sitio necesite fuera de su paquete se cotiza aparte.`,
        },
        {
          kind: "table",
          caption: "Precios de los sitios web de Cardon Digital por tipo de sitio",
          cols: ["Para qué sirve", "Desde", "Páginas", "Entrega"],
          rows: [
            {
              k: `${name("es", "presencia")}`,
              cells: [
                `${tag("es", "presencia")}`,
                `${from("es", "presencia")}`,
                `${pages("presencia")} página`,
                `${days("presencia").min} a ${days("presencia").max} días hábiles`,
              ],
            },
            {
              k: `${name("es", "negocio")}`,
              cells: [
                `${tag("es", "negocio")}`,
                `${from("es", "negocio")}`,
                `Hasta ${pages("negocio")} páginas`,
                `${days("negocio").min} a ${days("negocio").max} días hábiles`,
              ],
            },
            {
              k: `${name("es", "reservas")}`,
              cells: [
                `${tag("es", "reservas")}`,
                `${from("es", "reservas")}`,
                `Hasta ${pages("reservas")} páginas`,
                `${days("reservas").min} a ${days("reservas").max} días hábiles`,
              ],
            },
            {
              k: `${name("es", "tienda")}`,
              cells: [
                `${tag("es", "tienda")}`,
                `${from("es", "tienda")}`,
                `${pages("tienda")} páginas más las de sus productos`,
                `${days("tienda").min} a ${days("tienda").max} días hábiles`,
              ],
            },
          ],
        },
        {
          kind: "p",
          text: "Un sitio con reservaciones o con tienda tarda más que uno de una página porque lleva más funciones, y cada reservación y cada pago se prueban antes de entregarlo.",
        },
      ],
    },
    {
      id: "incluido",
      h: "¿Qué trae una página web de Cardon Digital sin costo extra?",
      blocks: [
        {
          kind: "p",
          text: "Todos los paquetes de Cardon Digital, desde el de una página, traen lo mismo de base, y el precio publicado ya lo incluye. Entre un paquete y otro cambian las páginas y lo que el sitio hace, y lo básico se queda igual.",
        },
        {
          kind: "list",
          ordered: false,
          title: "Lo que incluye cualquier sitio web de Cardon Digital",
          items: [
            `${feature("es", "custom-design")}.`,
            `${feature("es", "copy-written")}.`,
            `${feature("es", "contact-button-and-form")}.`,
            `${feature("es", "ga4-with-conversion-events")}.`,
            `${feature("es", "local-seo-basics")}.`,
            `${feature("es", "aeo-ready")}: datos estructurados, respuestas al principio de cada página, preguntas frecuentes, rastreadores de IA permitidos y páginas rápidas.`,
            "El dominio, el hosting y los accesos a su nombre.",
          ],
        },
        {
          kind: "p",
          text: "Que un sitio esté listo para ChatGPT, Gemini y Google le da más oportunidad de aparecer en sus respuestas, pero ninguno de esos motores promete nombrar a un negocio. Lo que sí se puede revisar es que su sitio los deje leer y les conteste claro.",
        },
      ],
    },
    {
      id: "pagos-despues",
      h: "¿Qué pagos tiene una página web después de entregada?",
      blocks: [
        {
          kind: "p",
          text: "Después de la entrega, una página web tiene pagos que siguen: el dominio y el hosting se renuevan, normalmente cada año, y el correo con el nombre de su negocio se paga aparte si lo quiere. Son pagos chicos, pero si alguno se olvida el sitio o el correo pueden dejar de funcionar.",
        },
        {
          kind: "list",
          ordered: false,
          title: "Los pagos de un sitio web que muchos dueños olvidan",
          items: [
            "El dominio, la dirección de su sitio. Un dominio .mx se registra por uno a diez años y se tiene que renovar; algunos registradores lo estacionan si el cobro de la renovación falla, y recuperarlo puede costar más que renovarlo a tiempo.",
            "El hosting, el servidor donde vive el sitio. Algunos proveedores publican un precio para el primer año y otro más alto para la renovación, así que conviene preguntar los dos.",
            "El correo con su dominio, como ventas@sunegocio.mx. Servicios como Google Workspace lo cobran por usuario cada mes.",
            "Los cambios después de la entrega: un horario nuevo, un precio, una foto. Si no los hace usted, se pagan aparte o dentro de un mantenimiento.",
          ],
        },
        {
          kind: "p",
          text: `En Cardon Digital el mantenimiento mensual es opcional y cuesta ${care("es")} al mes. Incluye el hosting, el dominio, las actualizaciones y dos cambios al mes, y lo puede cancelar cuando quiera, porque el dominio y el sitio siguen a su nombre.`,
        },
      ],
    },
    {
      id: "preguntas-antes",
      h: "¿Qué conviene preguntar antes de pagar una página web?",
      blocks: [
        {
          kind: "p",
          text: "Antes de pagar una página web conviene saber qué incluye el precio, a nombre de quién quedan el dominio y el sitio, y cuánto va a pagar cada año después de la entrega. Dos cotizaciones con el mismo precio pueden traer cosas muy distintas.",
        },
        {
          kind: "list",
          ordered: true,
          title: "Preguntas para comparar cotizaciones de sitios web",
          items: [
            "¿El dominio, el hosting y los accesos quedan a mi nombre?",
            "¿Cuánto cuesta renovar el hosting y el dominio el segundo año?",
            "¿Quién escribe los textos y quién consigue las fotos?",
            "¿Cuántos días tarda y desde cuándo se cuentan?",
            "¿Cuánto cuesta un cambio después de la entrega?",
            "¿Mi sitio deja entrar a los rastreadores de Google y de los motores de IA?",
          ],
        },
        {
          kind: "service",
          text: "Si quiere ver cuánto costaría su sitio, en la página de precios de Cardon Digital puede armar su paquete y mandarlo con su consulta.",
          label: "Armar mi paquete",
          path: "/precios#arme",
        },
      ],
    },
  ],
  sources: [
    {
      title: "Sobre dominios .mx",
      publisher: "Ayuda de GoDaddy México",
      url: "https://www.godaddy.com/es/help/about-mx-domains-5305",
      note: "Un dominio .mx se registra y se renueva por uno a diez años, y qué pasa si falla el cobro de la renovación.",
    },
    {
      title: "Servicio de web hosting",
      publisher: "Akky",
      url: "https://www.akky.mx/servicios/hosting",
      note: "Un ejemplo de hosting con un precio para el primer año y otro para la renovación.",
    },
    {
      title: "Compara las opciones de planes de precios",
      publisher: "Google Workspace",
      url: "https://workspace.google.com/intl/es-419/pricing.html",
      note: "El correo con su dominio se cobra por usuario al mes.",
    },
    {
      title: "Guía detallada sobre cómo funciona la Búsqueda de Google",
      publisher: "Google Search Central",
      url: "https://developers.google.com/search/docs/fundamentals/how-search-works?hl=es",
      note: "Google no garantiza que rastree, indexe o muestre una página.",
    },
  ],
  faq: {
    title: "Preguntas frecuentes sobre el costo de una página web",
    items: [
      {
        question: "¿A nombre de quién quedan el dominio y la página web?",
        answer:
          "En Cardon Digital, a nombre suyo desde el primer día: el dominio, el hosting y los accesos. Así puede hacer cambios usted mismo, cambiar de proveedor o dejar el mantenimiento cuando quiera sin perder su sitio.",
      },
      {
        question: "¿Tengo que pagar mantenimiento cada mes?",
        answer: `No. En Cardon Digital el mantenimiento es opcional y cuesta ${care("es")} al mes, con hosting, dominio, actualizaciones y dos cambios al mes. Si no lo contrata, paga usted directo el dominio y el hosting a sus proveedores.`,
      },
      {
        question: "¿Cuánto cuesta cambiar algo de mi página después de la entrega?",
        answer:
          "Con el mantenimiento de Cardon Digital, dos cambios al mes van incluidos. Sin él, los accesos son suyos y puede hacer los cambios usted mismo; todos los sitios con reservaciones incluyen una sesión para enseñarle cómo.",
      },
      {
        question: "¿Una página web nueva sale en Google desde el primer día?",
        answer:
          "No necesariamente. Google primero tiene que encontrar la página y agregarla a su índice, y dice que no garantiza hacerlo. Un sitio bien armado, con su ficha de Google al día, tiene más oportunidad de salir pronto.",
      },
    ],
  },
};

const en: GuideCopy = {
  meta: {
    title: "What a business website costs in Ensenada",
    description: `At Cardon Digital a one-page website starts at ${from("en", "presencia")} and an online store at ${from("en", "tienda")}. The price depends on the pages and on what the site has to do.`,
  },
  eyebrow: "A guide for business owners in Ensenada and Baja California",
  title: "How much does a website cost for a business in Ensenada?",
  lede: `What a website costs depends on how many pages it has and what it has to do: take messages, take bookings or sell online. At Cardon Digital a single page starts at ${from("en", "presencia")} and an online store at ${from("en", "tienda")}. The domain and hosting are paid on top, and both have to be renewed.`,
  sections: [
    {
      id: "de-que-depende",
      h: "What drives the price of a website?",
      blocks: [
        {
          kind: "p",
          text: "The price of a website mostly follows the hours it takes to build, and those hours come from the number of pages, what the site has to do and who writes the copy. A page that introduces your business takes less work than a site that takes bookings or card payments.",
        },
        {
          kind: "list",
          ordered: false,
          title: "What moves the price of a website up or down",
          items: [
            "How many pages: a single page, or separate pages for services, past work and contact.",
            "What it has to do: take messages, book appointments, sell products or take payments.",
            "Who writes the copy and finds the photos: you or the builder.",
            "Whether it runs in one language or two, common in Ensenada because of tourism.",
            "Whether the design is made for your business or comes from a template.",
          ],
        },
      ],
    },
    {
      id: "precios",
      h: "How much does each kind of website cost at Cardon Digital?",
      blocks: [
        {
          kind: "p",
          text: `Cardon Digital publishes four website packages, from a single page to an online store. The smallest starts at ${from("en", "presencia")} and the largest at ${from("en", "tienda")}. Each price comes from the hours the package takes, and anything your site needs beyond its package is quoted separately.`,
        },
        {
          kind: "table",
          caption: "Cardon Digital website prices by kind of site",
          cols: ["What it is for", "From", "Pages", "Delivery"],
          rows: [
            {
              k: `${name("en", "presencia")}`,
              cells: [
                `${tag("en", "presencia")}`,
                `${from("en", "presencia")}`,
                `${pages("presencia")} page`,
                `${days("presencia").min} to ${days("presencia").max} business days`,
              ],
            },
            {
              k: `${name("en", "negocio")}`,
              cells: [
                `${tag("en", "negocio")}`,
                `${from("en", "negocio")}`,
                `Up to ${pages("negocio")} pages`,
                `${days("negocio").min} to ${days("negocio").max} business days`,
              ],
            },
            {
              k: `${name("en", "reservas")}`,
              cells: [
                `${tag("en", "reservas")}`,
                `${from("en", "reservas")}`,
                `Up to ${pages("reservas")} pages`,
                `${days("reservas").min} to ${days("reservas").max} business days`,
              ],
            },
            {
              k: `${name("en", "tienda")}`,
              cells: [
                `${tag("en", "tienda")}`,
                `${from("en", "tienda")}`,
                `${pages("tienda")} pages plus your product pages`,
                `${days("tienda").min} to ${days("tienda").max} business days`,
              ],
            },
          ],
        },
        {
          kind: "p",
          text: "A booking site or a store takes longer than a one-page site because it does more, and every booking and every payment is tested before handover.",
        },
      ],
    },
    {
      id: "incluido",
      h: "What comes with a Cardon Digital website at no extra cost?",
      blocks: [
        {
          kind: "p",
          text: "Every Cardon Digital package, the one-page site included, carries the same base, and the published price already covers it. From one package to the next the pages and what the site does change, and the basics stay the same.",
        },
        {
          kind: "list",
          ordered: false,
          title: "What any Cardon Digital website includes",
          items: [
            `${feature("en", "custom-design")}.`,
            `${feature("en", "copy-written")}.`,
            `${feature("en", "contact-button-and-form")}.`,
            `${feature("en", "ga4-with-conversion-events")}.`,
            `${feature("en", "local-seo-basics")}.`,
            `${feature("en", "aeo-ready")}: structured data, answers at the top of each page, common questions, AI crawlers allowed and fast pages.`,
            "The domain, the hosting and the logins in your name.",
          ],
        },
        {
          kind: "p",
          text: "A site that is ready for ChatGPT, Gemini and Google has a better chance of turning up in their answers, but none of those engines promises to name a business. What can be checked is that your site lets them read it and answers clearly.",
        },
      ],
    },
    {
      id: "pagos-despues",
      h: "What does a website keep costing after it launches?",
      blocks: [
        {
          kind: "p",
          text: "After launch a website keeps a few bills: the domain and the hosting renew, usually every year, and email at your own domain is paid separately if you want it. They are small, but if one lapses the site or the email can stop working.",
        },
        {
          kind: "list",
          ordered: false,
          title: "The website bills owners tend to forget",
          items: [
            "The domain, your site's address. A .mx domain is registered for one to ten years and has to be renewed; some registrars park it when the renewal charge fails, and getting it back can cost more than renewing on time.",
            "The hosting, the server the site lives on. Some providers publish one price for the first year and a higher one for the renewal, so ask for both.",
            "Email at your domain, like sales@yourbusiness.com. Services such as Google Workspace charge for it per user, every month.",
            "Changes after launch: new hours, a new price, a photo. If you do not make them yourself, they are billed separately or under a care plan.",
          ],
        },
        {
          kind: "p",
          text: `At Cardon Digital monthly care is optional and costs ${care("en")} a month. It covers hosting, the domain, updates and two changes a month, and you can stop it whenever you like, because the domain and the site stay in your name.`,
        },
      ],
    },
    {
      id: "preguntas-antes",
      h: "What should you ask before paying for a website?",
      blocks: [
        {
          kind: "p",
          text: "Before paying for a website, find out what the price includes, whose name the domain and the site are in, and what you will pay each year after launch. Two quotes at the same price can cover very different things.",
        },
        {
          kind: "list",
          ordered: true,
          title: "Questions for comparing website quotes",
          items: [
            "Are the domain, the hosting and the logins in my name?",
            "What does renewing the hosting and the domain cost in year two?",
            "Who writes the copy and who finds the photos?",
            "How many days does it take, and from when?",
            "What does a change cost after launch?",
            "Does my site let in the crawlers from Google and the AI engines?",
          ],
        },
        {
          kind: "service",
          text: "To see what your site would cost, you can build your package on the Cardon Digital pricing page and send it with your enquiry.",
          label: "Build my package",
          path: "/precios#arme",
        },
      ],
    },
  ],
  sources: [
    {
      title: "Sobre dominios .mx",
      publisher: "GoDaddy Help Mexico (in Spanish)",
      url: "https://www.godaddy.com/es/help/about-mx-domains-5305",
      note: "A .mx domain registers and renews for one to ten years, and what happens when a renewal charge fails.",
    },
    {
      title: "Servicio de web hosting",
      publisher: "Akky (in Spanish)",
      url: "https://www.akky.mx/servicios/hosting",
      note: "An example of hosting with one price for the first year and another for the renewal.",
    },
    {
      title: "Compare pricing plan options",
      publisher: "Google Workspace",
      url: "https://workspace.google.com/pricing.html",
      note: "Email at your own domain is billed per user per month.",
    },
    {
      title: "In-depth guide to how Google Search works",
      publisher: "Google Search Central",
      url: "https://developers.google.com/search/docs/fundamentals/how-search-works",
      note: "Google does not guarantee that it will crawl, index or serve a page.",
    },
  ],
  faq: {
    title: "Common questions about what a website costs",
    items: [
      {
        question: "Whose name are the domain and the website in?",
        answer:
          "At Cardon Digital, yours from day one: the domain, the hosting and the logins. You can make changes yourself, switch providers or drop the monthly care whenever you like without losing your site.",
      },
      {
        question: "Do I have to pay for monthly care?",
        answer: `No. At Cardon Digital care is optional and costs ${care("en")} a month, covering hosting, the domain, updates and two changes a month. Without it, you pay for the domain and the hosting directly to your providers.`,
      },
      {
        question: "What does it cost to change something on my site after launch?",
        answer:
          "With Cardon Digital's monthly care, two changes a month are included. Without it, the logins are yours and you can make changes yourself; every booking site includes a session to show you how.",
      },
      {
        question: "Does a new website show up on Google from day one?",
        answer:
          "Not necessarily. Google first has to find the page and add it to its index, and it says it does not guarantee doing so. A well built site with an up to date Google Business Profile has a better chance of showing sooner.",
      },
    ],
  },
};

export const cuantoCuestaPaginaWeb: Guide = {
  slug: "cuanto-cuesta-pagina-web",
  datePublished: "2026-10-21",
  dateModified: "2026-10-21",
  reviewBy: "2027-01-21",
  copy: { es, en },
};
