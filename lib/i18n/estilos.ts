import type { Dict } from "./rich";

/**
 * Style samples page copy (/estilos). Spanish is written for a Mexican owner
 * and is the authoritative version; English is a faithful version of it.
 *
 * The four businesses on the page are invented. Their names stay the same in
 * both locales, every sample says on its face that it is a sample, and
 * nothing here reads as a client, a result or a price. The big title of a
 * sample names the industry the style is for, and the line under it names who
 * else it suits (Daniel, 2026-10-02: no invented taglines, say the industry).
 * The menu and the buttons inside a sample are the mock site's own.
 */

const en = {
  meta: {
    title: "Styles",
    description:
      "Four website styles shown on invented businesses: a winery, a logistics company, a spa and a small coastal hotel. Yours is designed from scratch, starting from your brand.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Styles",
    title: "Your vision,",
    titleAccent: "made into a site.",
    sub: "These four businesses are invented and are here to show styles; your site is designed from scratch, starting from your brand.",
  },
  gallery: {
    aria: "Style samples",
    sample: "Style sample. Invented business.",
    sampleShort: "Sample",
    jump: "Go to a style",
    count: "of",
    menu: "Menu",
    /* The only control inside a sample: the two words on the button that
       stops a clip. A video slot does not render without them. */
    play: "Play the video",
    pause: "Pause the video",
  },
  vinedo: {
    style: "Warm editorial",
    brand: "Tardeoro",
    kind: "Winery",
    nav: ["Wines", "The house", "Visits", "Club"],
    title: "Wineries",
    titleAccent: "and restaurants.",
    sub: "Also for boutique hotels.",
    primary: "Book a tasting",
    secondary: "Meet the wines",
  },
  tech: {
    style: "Technical and precise",
    brand: "kiloruta",
    kind: "Live logistics",
    nav: ["Platform", "Routes", "Integrations", "Company"],
    action: "Sign in",
    title: "Software",
    titleAccent: "and logistics.",
    sub: "Also for industrial services.",
    primary: "Request a demo",
    secondary: "See the platform",
    tags: ["Routes", "Warehouses", "Last mile", "Fleet"],
  },
  spa: {
    style: "Flowing and natural",
    brand: "Brumaluz",
    kind: "Wellness studio",
    nav: ["Rituals", "The studio", "Gifts"],
    action: "Book",
    title: "Spas",
    titleAccent: "and wellness.",
    sub: "Also for personal care brands.",
    primary: "Book a ritual",
    secondary: "See the menu",
  },
  hotel: {
    style: "Calm coast",
    brand: "Sotaduna",
    kind: "Coastal hotel",
    nav: ["Rooms", "The beach", "Dining", "Getting here"],
    action: "Book",
    title: "Hotels",
    titleAccent: "by the sea.",
    sub: "Also for vacation rentals and beachfront restaurants.",
    primary: "Book a stay",
    secondary: "See the rooms",
  },
  diagDesc:
    "Tell us how you picture your site. The diagnostic is ten business days on your site, your ads and your operation, and a written memo that is yours.",
  /* The link to this page in the site header and in the footer. It lives here
     rather than in the nav block of lib/i18n/site.ts because the page owns the
     word that names it, and because two sessions were editing the shared site
     copy on 2026-10-16. */
  navLabel: "Styles",
  /**
   * The home page's section for this page. The strings live in the styles
   * dictionary, with the page they send the reader to, so the section and the
   * samples cannot drift apart. scripts/copy-check.mjs therefore counts these
   * words against /estilos and not against the home page, which is worth
   * knowing when either budget is read.
   *
   * The tiles say nothing of their own: each one takes its name, its industry
   * line and its colours from the sample it opens, so a style that is renamed
   * is renamed in one place.
   */
  promo: {
    aria: "Website styles",
    kicker: "Styles",
    title: "Your vision, built in the style you want.",
    body: "Every style mixes photography and video of your own business with the animation we draw for it. Pick the one you like and we design your site from scratch, starting from your brand.",
    cta: "See the styles",
    /* Under the four tiles, so the invented businesses are named as invented
       before anybody clicks through to them. */
    note: "The four businesses shown are invented. They are here to show styles.",
  },
};

const es: typeof en = {
  meta: {
    title: "Estilos",
    description:
      "Cuatro estilos de sitio web, mostrados con negocios inventados: una vinícola, una empresa de logística, un spa y un hotel pequeño de playa. El suyo se diseña desde cero, a partir de su marca.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Estilos",
    title: "Su sitio,",
    titleAccent: "como usted lo imagina.",
    sub: "Estos cuatro negocios son inventados y sirven para mostrar estilos. Su sitio se diseña desde cero, a partir de su marca.",
  },
  gallery: {
    aria: "Muestras de estilo",
    sample: "Muestra de estilo. Negocio inventado.",
    sampleShort: "Muestra",
    jump: "Ir a un estilo",
    count: "de",
    menu: "Menú",
    play: "Reproducir el video",
    pause: "Pausar el video",
  },
  vinedo: {
    style: "Editorial cálido",
    brand: "Tardeoro",
    kind: "Vinícola",
    nav: ["Vinos", "La casa", "Visitas", "Club"],
    title: "Vinícolas",
    titleAccent: "y restaurantes.",
    sub: "También para hoteles boutique.",
    primary: "Reservar una cata",
    secondary: "Conocer los vinos",
  },
  tech: {
    style: "Técnico y preciso",
    brand: "kiloruta",
    kind: "Logística en vivo",
    nav: ["Plataforma", "Rutas", "Integraciones", "Empresa"],
    action: "Entrar",
    title: "Software",
    titleAccent: "y logística.",
    sub: "También para servicios industriales.",
    primary: "Solicitar demo",
    secondary: "Ver la plataforma",
    tags: ["Rutas", "Almacenes", "Última milla", "Flotilla"],
  },
  spa: {
    style: "Fluido y natural",
    brand: "Brumaluz",
    kind: "Estudio de bienestar",
    nav: ["Rituales", "El estudio", "Regalos"],
    action: "Agendar",
    title: "Spas",
    titleAccent: "y bienestar.",
    sub: "También para marcas de cuidado personal.",
    primary: "Agenda tu ritual",
    secondary: "Ver el menú",
  },
  hotel: {
    style: "Costa en calma",
    brand: "Sotaduna",
    kind: "Hotel de playa",
    nav: ["Habitaciones", "La playa", "Restaurante", "Cómo llegar"],
    action: "Reservar",
    title: "Hoteles",
    titleAccent: "frente al mar.",
    sub: "También para rentas vacacionales y restaurantes de playa.",
    primary: "Reservar estancia",
    secondary: "Ver habitaciones",
  },
  diagDesc:
    "Cuéntenos cómo imagina su sitio. El diagnóstico son diez días hábiles para revisar el sitio, los anuncios y la operación de su negocio, y un informe por escrito que es suyo.",
  navLabel: "Estilos",
  promo: {
    aria: "Estilos de sitio web",
    kicker: "Estilos",
    title: "Su visión, construida en el estilo que quiera.",
    body: "Cada estilo mezcla fotos y video de su propio negocio con la animación que dibujamos para él. Elija el que le guste y diseñamos su sitio desde cero, a partir de su marca.",
    cta: "Ver los estilos",
    note: "Los cuatro negocios que se muestran son inventados. Sirven para mostrar estilos.",
  },
};

export type EstilosDict = typeof en;
export const estilos: Dict<EstilosDict> = { en, es };
