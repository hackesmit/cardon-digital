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
};

export type EstilosDict = typeof en;
export const estilos: Dict<EstilosDict> = { en, es };
