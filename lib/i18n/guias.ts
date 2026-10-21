import type { Dict } from "./rich";

/**
 * /guias copy (bead hq-i4b5.11, AEO spec in
 * bunkers/cardon-digital/research/2026-10/aeo/SPEC.md): the index page and the
 * chrome every guide shares (trail, byline, dates, sources). A guide's own
 * words live in its file under lib/guides.
 *
 * The byline is Daniel Hack's, by his choice. The bio states only what the
 * site already states: founder of Cardon Digital, building sites and software
 * (/about), the HubSpot Academy certificate from lib/credentials.ts. Spanish is
 * authoritative and written for a Mexican owner; English for a US owner.
 */

const en = {
  /** The footer link's text. */
  navLabel: "Guides",
  meta: {
    title: "Guides for small business owners",
    description:
      "Short, dated guides by Daniel Hack of Cardon Digital that answer what owners ask about websites, Google and AI answers, with every outside fact linked to its source.",
  },
  crumbs: {
    aria: "Breadcrumb",
    home: "Home",
    index: "Guides",
  },
  index: {
    aria: "Introduction",
    eyebrow: "Guides",
    title: "Straight answers to what owners ask about their website, Google and AI.",
    sub: "Cardon Digital's guides answer the questions owners bring us about websites, Google and ChatGPT, one question per guide, with the answer up top. Each one is signed by Daniel Hack, shows when it was last updated, and links every outside fact to its source.",
    listTitle: "Published guides",
  },
  article: {
    by: "By",
    role: "Founder of Cardon Digital",
    published: "Published",
    updated: "Updated",
    bio: "Daniel Hack founded Cardon Digital in Ensenada, Baja California, where he builds websites and software for owner-run businesses. He holds HubSpot Academy's AEO Fundamentals certificate.",
    about: "About Cardon Digital",
    certificate: "Check the certificate on HubSpot",
    newTab: "(opens in a new tab)",
    tocTitle: "In this guide",
    sourcesTitle: "Sources",
    sourcesLead: "Every outside fact in this guide links to the page it comes from, read on the date the guide was last updated.",
  },
};

const es: typeof en = {
  navLabel: "Guías",
  meta: {
    title: "Guías para dueños de negocio",
    description:
      "Guías cortas y con fecha de Daniel Hack, de Cardon Digital, que contestan lo que preguntan los dueños sobre sitios web, Google y las respuestas de IA, con cada dato externo enlazado a su fuente.",
  },
  crumbs: {
    aria: "Ruta de navegación",
    home: "Inicio",
    index: "Guías",
  },
  index: {
    aria: "Introducción",
    eyebrow: "Guías",
    title: "Respuestas directas a lo que preguntan los dueños sobre su sitio, Google y la IA.",
    sub: "Las guías de Cardon Digital contestan las preguntas que nos hacen los dueños de negocio sobre sitios web, Google y ChatGPT, una pregunta por guía y con la respuesta al principio. Cada una va firmada por Daniel Hack, muestra cuándo se actualizó y enlaza cada dato externo a su fuente.",
    listTitle: "Guías publicadas",
  },
  article: {
    by: "Por",
    role: "Fundador de Cardon Digital",
    published: "Publicada",
    updated: "Actualizada",
    bio: "Daniel Hack fundó Cardon Digital en Ensenada, Baja California, donde construye sitios web y software para negocios que atienden sus dueños. Tiene la certificación AEO Fundamentals de HubSpot Academy.",
    about: "Quiénes somos",
    certificate: "Comprobar la certificación en HubSpot",
    newTab: "(se abre en otra pestaña)",
    tocTitle: "En esta guía",
    sourcesTitle: "Fuentes",
    sourcesLead: "Cada dato externo de esta guía enlaza a la página de donde sale, consultada en la fecha de la última actualización.",
  },
};

export type GuiasDict = typeof en;
export const guias: Dict<GuiasDict> = { en, es };
