import type { Dict } from "./rich";

/**
 * Site chrome: the strings that appear on every page (nav, footer, shared
 * brand lines) plus the root metadata. Page copy lives in the per-page
 * dictionary next to this file.
 */

const en = {
  skipToContent: "Skip to content",
  brandHome: "Cardon Digital home",
  brandline: "Built to hold water",
  meta: {
    title: "Cardon Digital | Growth systems built to hold water",
    titleTemplate: "%s | Cardon Digital",
    description:
      "Ads, website, and operations wired into one connected system your team ends up owning. Bilingual growth systems for owner-run businesses in the US and Mexico.",
    ogAlt: "Cardon Digital, one living system",
  },
  nav: {
    label: "Primary",
    menu: "Menu",
    closeMenu: "Close menu",
    wineries: "Wineries",
    work: "Work",
    otherIndustries: "Other industries",
    allIndustries: "All industries",
    construction: "Construction",
    hiring: "Hiring",
    restaurants: "Restaurants",
    clinics: "Clinics",
    cta: "Get the diagnostic",
    modeToggle: "Switch between light and dark mode",
    darkMode: "Dark mode",
    lightMode: "Light mode",
    /** The switch is labelled with the language it takes you to. */
    switchLabel: "Español",
    switchAria: "Ver esta página en español",
    switchShort: "ES",
  },
  /** The diagnostic block closes every page; only its body copy changes. */
  diag: {
    kicker: "Start here",
    title: "The Growth Diagnostic",
    cta: "Get the free Growth Diagnostic",
    mailSubject: "Growth Diagnostic",
    price:
      "**Free.** No retainer, no obligation. If the memo shows work worth doing, we propose the build and you decide.",
  },
  footer: {
    label: "Footer",
    legalLabel: "Legal",
    work: "Work",
    services: "Services",
    industries: "Industries",
    about: "About",
    contact: "Contact",
    line: "Built in Baja California. Working both sides of the border, in both languages.",
    bottom: "Cardon Digital, 2026. Five clients at a time, senior hands.",
    privacy: "Privacy",
    terms: "Terms",
  },
};

const es: typeof en = {
  skipToContent: "Saltar al contenido",
  brandHome: "Cardon Digital, inicio",
  brandline: "Sistemas que siguen funcionando cuando nos vamos",
  meta: {
    title: "Cardon Digital | El sistema con el que trabaja su bodega",
    titleTemplate: "%s | Cardon Digital",
    description:
      "Cosecha, lotes, tanques, laboratorio y añadas en un solo lugar, con un asistente que responde desde el registro de su bodega. Hecho en Baja California, en español, y la bodega se queda con el sistema.",
    ogAlt: "Cardon Digital, un solo sistema para la bodega",
  },
  nav: {
    label: "Principal",
    menu: "Menú",
    closeMenu: "Cerrar el menú",
    wineries: "Bodegas",
    work: "Casos",
    otherIndustries: "Otros sectores",
    allIndustries: "Todos los sectores",
    construction: "Construcción",
    hiring: "Reclutamiento",
    restaurants: "Restaurantes",
    clinics: "Clínicas",
    cta: "Pida el diagnóstico",
    modeToggle: "Cambiar entre modo claro y modo oscuro",
    darkMode: "Modo oscuro",
    lightMode: "Modo claro",
    switchLabel: "English",
    switchAria: "View this page in English",
    switchShort: "EN",
  },
  diag: {
    kicker: "Empiece aquí",
    title: "El Diagnóstico de Crecimiento",
    cta: "Pida el Diagnóstico, sin costo",
    mailSubject: "Diagnóstico de Crecimiento",
    price:
      "**Sin costo.** Sin anticipo y sin compromiso. Si el informe muestra trabajo que vale la pena, proponemos la construcción y usted decide.",
  },
  footer: {
    label: "Pie de página",
    legalLabel: "Avisos legales",
    work: "Casos",
    services: "Servicios",
    industries: "Sectores",
    about: "Quiénes somos",
    contact: "Contacto",
    line: "Hecho en Baja California. Trabajamos en el Valle y del otro lado de la línea, en los dos idiomas.",
    bottom: "Cardon Digital, 2026. Cinco clientes a la vez, atendidos por quien construye.",
    privacy: "Privacidad",
    terms: "Términos",
  },
};

export type SiteDict = typeof en;
export const site: Dict<SiteDict> = { en, es };
