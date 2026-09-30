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
  /** The 404 page. Shown for any address that does not resolve to a route. */
  notFound: {
    metaTitle: "Page not found",
    eyebrow: "404",
    title: "That page is not here.",
    body: "The link may be old, or the address may carry a typo. The services, the cases and the diagnostic are all one step away from the home page.",
    home: "Back to the home page",
  },
  meta: {
    title: "Cardon Digital | Websites, Google Ads and software for your business",
    titleTemplate: "%s | Cardon Digital",
    description:
      "Get found, get chosen, and let the work run itself. Websites, Google Ads and custom software for owner-run businesses in Baja California, with prices published and everything in your name.",
    ogAlt: "Cardon Digital: get found, get chosen, and let the work run itself",
  },
  nav: {
    label: "Primary",
    menu: "Menu",
    closeMenu: "Close menu",
    /* Modules and pricing lead the row: they are the two pages a reader has to
       reach to know what we sell and what it costs (bead hq-wrig5.3). */
    services: "Services",
    sitios: "Websites",
    anuncios: "Google Ads",
    software: "Software",
    modules: "Modules",
    pricing: "Pricing",
    wineries: "Wineries",
    work: "Work",
    about: "About",
    contact: "Contact",
    cta: "Get the diagnostic",
    servicesMenu: "Services menu",
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
    cta: "Get the free diagnostic",
    mailSubject: "Growth Diagnostic",
    price:
      "**Free.** No retainer, no obligation. If the memo shows work worth doing, we propose the build and you decide.",
  },
  footer: {
    label: "Footer",
    legalLabel: "Legal",
    work: "Work",
    about: "About",
    contact: "Contact",
    line: "Built in Ensenada, Baja California. Working both sides of the border, in both languages.",
    privacy: "Privacy",
    terms: "Terms",
  },
};

const es: typeof en = {
  skipToContent: "Saltar al contenido",
  brandHome: "Cardon Digital, inicio",
  brandline: "Sistemas que siguen funcionando cuando nos vamos",
  /** The 404 page. Shown for any address that does not resolve to a route. */
  notFound: {
    metaTitle: "Página no encontrada",
    eyebrow: "404",
    title: "Esa página no está aquí.",
    body: "Puede que el enlace ya esté viejo o que la dirección traiga un error de dedo. Los servicios, los casos y el diagnóstico quedan a un paso desde la página de inicio.",
    home: "Volver al inicio",
  },
  meta: {
    title: "Cardon Digital | Sitios web, anuncios y software para su negocio",
    titleTemplate: "%s | Cardon Digital",
    description:
      "Que lo encuentren, que le compren, y que el trabajo se haga solo. Sitios web, anuncios en Google y software a la medida para negocios en Baja California, con precios publicados y todo a su nombre.",
    ogAlt: "Cardon Digital: que lo encuentren, que le compren, y que el trabajo se haga solo",
  },
  nav: {
    label: "Principal",
    menu: "Menú",
    closeMenu: "Cerrar el menú",
    services: "Servicios",
    sitios: "Sitios web",
    anuncios: "Anuncios",
    software: "Software",
    modules: "Módulos",
    pricing: "Precios",
    wineries: "Bodegas",
    work: "Casos",
    /* Short in the nav bar, where the items plus the switch and the CTA share
       one line above 820px; the footer keeps the full phrase. */
    about: "Nosotros",
    contact: "Contacto",
    cta: "Pedir el diagnóstico",
    servicesMenu: "Menú de servicios",
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
    cta: "Pedir el diagnóstico sin costo",
    mailSubject: "Diagnóstico de Crecimiento",
    price:
      "**Sin costo.** Sin anticipo y sin compromiso. Si el informe muestra trabajo que vale la pena, proponemos la construcción y usted decide.",
  },
  footer: {
    label: "Pie de página",
    legalLabel: "Avisos legales",
    work: "Casos",
    about: "Quiénes somos",
    contact: "Contacto",
    line: "Hecho en Ensenada, Baja California. Trabajamos en el Valle y del otro lado de la línea, en los dos idiomas.",
    privacy: "Privacidad",
    terms: "Términos",
  },
};

export type SiteDict = typeof en;
export const site: Dict<SiteDict> = { en, es };
