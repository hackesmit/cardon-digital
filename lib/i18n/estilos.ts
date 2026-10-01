import type { Dict } from "./rich";

/**
 * Style samples page copy (/estilos). Spanish is written for a Mexican owner
 * and is the authoritative version; English is a faithful version of it.
 *
 * The four businesses on the page are invented. Their names stay the same in
 * both locales, every sample says on its face that it is a sample, and
 * nothing here reads as a client, a result or a price. The words inside a
 * sample (its menu, its title, its buttons) are the mock site's own, which is
 * why they do not follow the house voice.
 */

const en = {
  meta: {
    title: "Styles",
    description:
      "Four website styles shown on invented businesses: a winery, a logistics company, a spa and a small coastal hotel. Yours is designed from scratch around your brand.",
  },
  hero: {
    aria: "Introduction",
    eyebrow: "Styles",
    title: "Your vision,",
    titleAccent: "made into a site.",
    sub: "These four businesses are invented and are here to show styles; your site is designed from scratch around your brand.",
  },
  gallery: {
    aria: "Style samples",
    sample: "Style sample. Invented business.",
    jump: "Go to a style",
    count: "of",
    menu: "Menu",
  },
  vinedo: {
    style: "Warm editorial",
    suits: "For wineries, restaurants and boutique hotels.",
    brand: "Tardeoro",
    kind: "Winery",
    nav: ["Wines", "The house", "Visits", "Club"],
    title: "The afternoon,",
    titleAccent: "bottled.",
    sub: "Single-plot reds, picked by hand and poured on the terrace facing the vineyard.",
    primary: "Book a tasting",
    secondary: "Meet the wines",
  },
  tech: {
    style: "Technical and precise",
    suits: "For software, logistics and industrial services.",
    brand: "kiloruta",
    kind: "Live logistics",
    nav: ["Platform", "Routes", "Integrations", "Company"],
    action: "Sign in",
    title: "Your whole fleet",
    titleAccent: "on one screen.",
    sub: "Routes, warehouses and deliveries coordinated in real time from a single board.",
    primary: "Request a demo",
    secondary: "See the platform",
    tags: ["Routes", "Warehouses", "Last mile", "Fleets"],
  },
  spa: {
    style: "Flowing and natural",
    suits: "For spas, wellness studios and personal care brands.",
    brand: "Brumaluz",
    kind: "Wellness studio",
    nav: ["Rituals", "The studio", "Gifts"],
    action: "Book",
    title: "Breathe",
    titleAccent: "more slowly.",
    sub: "Massages, steam baths and afternoon rituals in a quiet studio.",
    primary: "Book a ritual",
    secondary: "See the menu",
  },
  hotel: {
    style: "Calm coast",
    suits: "For small hotels, vacation rentals and seafront restaurants.",
    brand: "Marduna",
    kind: "Coastal hotel",
    nav: ["Rooms", "The beach", "Table", "Getting here"],
    action: "Book",
    title: "Between the dune",
    titleAccent: "and the sea.",
    sub: "A small hotel on the beach, with breakfast on the terrace and the sea a few steps away.",
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
      "Cuatro estilos de sitio web sobre negocios inventados: una vinícola, una empresa de logística, un spa y un hotel pequeño de costa. El suyo se diseña desde cero alrededor de su marca.",
  },
  hero: {
    aria: "Presentación",
    eyebrow: "Estilos",
    title: "Su visión,",
    titleAccent: "hecha sitio.",
    sub: "Estos cuatro negocios son inventados y están aquí para mostrar estilos; su sitio se diseña desde cero alrededor de su marca.",
  },
  gallery: {
    aria: "Muestras de estilo",
    sample: "Muestra de estilo. Negocio inventado.",
    jump: "Ir a un estilo",
    count: "de",
    menu: "Menú",
  },
  vinedo: {
    style: "Editorial cálido",
    suits: "Para vinícolas, restaurantes y hoteles boutique.",
    brand: "Tardeoro",
    kind: "Viña",
    nav: ["Vinos", "La casa", "Visitas", "Club"],
    title: "La tarde,",
    titleAccent: "embotellada.",
    sub: "Tintos de parcela, cosechados a mano y servidos en la terraza frente al viñedo.",
    primary: "Reservar una cata",
    secondary: "Conocer los vinos",
  },
  tech: {
    style: "Técnico y preciso",
    suits: "Para software, logística y servicios industriales.",
    brand: "kiloruta",
    kind: "Logística en vivo",
    nav: ["Plataforma", "Rutas", "Integraciones", "Empresa"],
    action: "Entrar",
    title: "Toda su flota",
    titleAccent: "en una pantalla.",
    sub: "Rutas, almacenes y entregas coordinados en tiempo real desde un solo tablero.",
    primary: "Solicitar demo",
    secondary: "Ver la plataforma",
    tags: ["Rutas", "Almacenes", "Última milla", "Flotillas"],
  },
  spa: {
    style: "Fluido y natural",
    suits: "Para spas, estudios de bienestar y marcas de cuidado personal.",
    brand: "Brumaluz",
    kind: "Estudio de bienestar",
    nav: ["Rituales", "El estudio", "Regalos"],
    action: "Agendar",
    title: "Respire",
    titleAccent: "más despacio.",
    sub: "Masajes, baños de vapor y rituales de una tarde en un estudio en calma.",
    primary: "Agendar un ritual",
    secondary: "Ver el menú",
  },
  hotel: {
    style: "Costa en calma",
    suits: "Para hoteles pequeños, rentas vacacionales y restaurantes frente al mar.",
    brand: "Marduna",
    kind: "Hotel de costa",
    nav: ["Habitaciones", "La playa", "Mesa", "Cómo llegar"],
    action: "Reservar",
    title: "Entre la duna",
    titleAccent: "y el mar.",
    sub: "Un hotel pequeño frente a la playa, con desayuno en la terraza y el mar a unos pasos.",
    primary: "Reservar estancia",
    secondary: "Ver habitaciones",
  },
  diagDesc:
    "Cuéntenos cómo imagina su sitio. El diagnóstico son diez días hábiles sobre su sitio, sus anuncios y su operación, y un informe escrito que es suyo.",
};

export type EstilosDict = typeof en;
export const estilos: Dict<EstilosDict> = { en, es };
