import type { ModuleId } from "../pricing";
import type { Dict } from "./rich";

/**
 * The Demos page: the index of the live demo, one card per module.
 *
 * It is a separate dictionary from lib/i18n/demos.ts, which holds the words
 * the drawn module visuals say inside their own frames. Nothing here is drawn.
 * Every card points at https://demo.cardondigital.com with its module switched
 * on, and shows a screenshot of that module taken from the running demo by
 * scripts/demos/capture.mjs.
 *
 * Two lines carry each card, because that is the whole argument: what the
 * business works with today, and what the same work looks like on the system.
 * The screen shown under them is the second line, so the second line names
 * what is on it rather than describing it twice.
 *
 * Finca Tierra Lenta is invented, and the page says so under the grid and in
 * every image's alt text, which is the site's rule for any surface that shows
 * a business we made up.
 */

/** One card: the module it opens, its file under public/media/demos, its words. */
export type DemoCard = {
  /**
   * The modules the Open button switches on. One for a module card; all three
   * for the card that shows the property panel, which only exists when the
   * demo has every module on.
   */
  modules: readonly ModuleId[];
  /** The preview file, public/media/demos/<image>.webp, written by the capture script. */
  image: string;
  /** The module's name, as the demo itself labels it. */
  name: string;
  /** What the card claims, in one line. */
  title: string;
  /** The work as it is done today, before the system. */
  before: string;
  /** The same work on the screen the card shows. */
  after: string;
  /** The Open button's own label, which names the module for a screen reader. */
  open: string;
  /** What is on the screenshot, for a reader who does not see it. */
  alt: string;
};

/** The cards in the order the page shows them, which is the pricing order plus the pair. */
export const demoCardKeys = [
  "produccion",
  "hospitalidad",
  "restaurante",
  "todo",
] as const;

export type DemoCardKey = (typeof demoCardKeys)[number];

const en = {
  meta: {
    title: "Demos: the system running, with the data of an invented winery",
    description:
      "Open the live demo of the system: production, hospitality and restaurant, each on its own screen, with an invented winery's data. No form, no sign up.",
  },

  hero: {
    eyebrow: "Demos",
    title: "Open the system and ",
    titleAccent: "use it yourself.",
    sub: "Finca Tierra Lenta is an invented winery with a restaurant and ten rooms. The data is illustrative; the system is the one we install. Nothing to fill in, nothing to install, it opens in a new tab.",
  },

  grid: {
    label: "The demos",
    beforeLabel: "Today",
    afterLabel: "On the system",
    openAll: "Open the full demo",
    openAllAria: "Open the demo with all three modules switched on",
    /** Under the grid, where a reader has just seen four screens of it. */
    honest:
      "Finca Tierra Lenta does not exist. The rooms, the tables and the lots are invented, and the screens are the real ones.",
  },

  cards: {
    produccion: {
      modules: ["produccion"],
      image: "produccion",
      name: "Production",
      title: "The cellar's record, written once.",
      before:
        "Harvest, tanks and barrels live in notebooks and spreadsheets, and a vintage is put back together from memory.",
      after:
        "Every tank with its sheet: density, temperature, pump-overs and additions, dated, on one screen.",
      open: "Open the Production demo",
      alt: "The Production module of the demo: six tanks with their lot and their volume, and below them the tank sheet of Chardonnay 2026 with its density and temperature curves. Invented winery, illustrative data.",
    },
    hospitalidad: {
      modules: ["hospitalidad"],
      image: "hospitalidad",
      name: "Hospitality",
      title: "Every channel on one calendar.",
      before:
        "Airbnb, Booking and direct bookings sit in three calendars, and the overlaps show up at the door.",
      after:
        "One master calendar for the month, by unit and by channel, with the occupancy and the revenue behind it.",
      open: "Open the Hospitality demo",
      alt: "The Hospitality module of the demo: the master calendar of October, ten units down the side and the nights of the month across, each booking a bar coloured by its channel. Invented property, illustrative data.",
    },
    restaurante: {
      modules: ["restaurante"],
      image: "restaurante",
      name: "Restaurant",
      title: "The floor, the order and the bill in one place.",
      before:
        "Orders on paper, bills added up by hand, and the day's figure known the next morning.",
      after:
        "The waiter opens the table, sends the order to the kitchen and charges at the table. The day closes itself.",
      open: "Open the Restaurant demo",
      alt: "The Restaurant module of the demo: the waiter's floor with the tables of the dining room, the terrace and the garden, each one showing its state and its minutes, and the waiter's own tables with their running totals. Invented restaurant, illustrative data.",
    },
    todo: {
      modules: ["produccion", "hospitalidad", "restaurante"],
      image: "todo",
      name: "All three together",
      title: "Three businesses, one set of numbers.",
      before:
        "The winery, the rooms and the restaurant each keep their own figures, so the property has no total.",
      after:
        "One panel: occupancy, average rate, covers, ticket and sales, by day, week or month, against the period before.",
      open: "Open the demo with all three modules",
      alt: "The property panel of the demo, which appears when all three modules are on: the month of the rooms, the restaurant and the wine one under the other, each with its own figures against the month before. Invented property, illustrative data.",
    },
  } satisfies Record<DemoCardKey, DemoCard>,

  close: {
    kicker: "After the demo",
    title: "Yours is built on your own work.",
    body: "The demo runs on an invented property so it can be opened by anyone. What we build for you starts from how you work today: your units, your lots, your menu and the people who use it.",
    diagDesc:
      "Ten working days in which we review your records, your advertising and your operation as one system. You get a written report: what works, what fails and what to build first.",
  },
};

const es: typeof en = {
  meta: {
    title: "Demos: el sistema funcionando, con datos de una finca inventada",
    description:
      "Abra el demo del sistema: producción, hospitalidad y restaurante, cada uno en su pantalla, con los datos de una finca inventada. Sin formulario y sin registro.",
  },

  hero: {
    eyebrow: "Demos",
    title: "Abra el sistema y ",
    titleAccent: "úselo usted mismo.",
    sub: "Finca Tierra Lenta es una finca inventada con restaurante y diez unidades de hospedaje. Los datos son ilustrativos; el sistema es el que instalamos. Nada que llenar, nada que instalar, abre en una pestaña nueva.",
  },

  grid: {
    label: "Los demos",
    beforeLabel: "Hoy",
    afterLabel: "En el sistema",
    openAll: "Abrir el demo completo",
    openAllAria: "Abrir el demo con los tres módulos encendidos",
    honest:
      "Finca Tierra Lenta no existe. Las unidades, las mesas y los lotes son inventados, y las pantallas son las reales.",
  },

  cards: {
    produccion: {
      modules: ["produccion"],
      image: "produccion",
      name: "Producción",
      title: "El registro de la bodega, escrito una sola vez.",
      before:
        "La cosecha, los tanques y las barricas viven en libretas y hojas de cálculo, y la añada se arma de memoria.",
      after:
        "Cada tanque con su hoja: densidad, temperatura, remontajes y adiciones, con fecha y en una sola pantalla.",
      open: "Abrir el demo de Producción",
      alt: "El módulo de Producción del demo: seis tanques con su lote y su volumen, y debajo la hoja de tanque del Chardonnay 2026 con sus curvas de densidad y temperatura. Finca inventada, datos ilustrativos.",
    },
    hospitalidad: {
      modules: ["hospitalidad"],
      image: "hospitalidad",
      name: "Hospitalidad",
      title: "Todos los canales en un calendario.",
      before:
        "Airbnb, Booking y las reservas directas están en tres calendarios, y los empalmes aparecen en la puerta.",
      after:
        "Un calendario maestro del mes, por unidad y por canal, con la ocupación y el ingreso detrás.",
      open: "Abrir el demo de Hospitalidad",
      alt: "El módulo de Hospitalidad del demo: el calendario maestro de octubre, diez unidades a un lado y las noches del mes a lo ancho, cada reserva una barra con el color de su canal. Propiedad inventada, datos ilustrativos.",
    },
    restaurante: {
      modules: ["restaurante"],
      image: "restaurante",
      name: "Restaurante",
      title: "El salón, la comanda y la cuenta en un solo lugar.",
      before:
        "Comandas en papel, cuentas sumadas a mano y la cifra del día hasta la mañana siguiente.",
      after:
        "El mesero abre la mesa, manda la comanda a cocina y cobra en la mesa. El día se cierra solo.",
      open: "Abrir el demo de Restaurante",
      alt: "El módulo de Restaurante del demo: el salón del mesero con las mesas del comedor, la terraza y el jardín, cada una con su estado y sus minutos, y las mesas propias del mesero con su cuenta corriente. Restaurante inventado, datos ilustrativos.",
    },
    todo: {
      modules: ["produccion", "hospitalidad", "restaurante"],
      image: "todo",
      name: "Los tres juntos",
      title: "Tres negocios, una sola cifra.",
      before:
        "La bodega, el hospedaje y el restaurante llevan cada uno sus números, y la propiedad no tiene un total.",
      after:
        "Un panel: ocupación, tarifa media, cubiertos, ticket y venta, por día, semana o mes, contra el periodo anterior.",
      open: "Abrir el demo con los tres módulos",
      alt: "El panel de la propiedad del demo, que aparece cuando los tres módulos están encendidos: el mes del hospedaje, el restaurante y el vino uno debajo de otro, cada uno con sus cifras contra el mes anterior. Propiedad inventada, datos ilustrativos.",
    },
  },

  close: {
    kicker: "Después del demo",
    title: "El suyo se construye sobre su propio trabajo.",
    body: "El demo corre sobre una propiedad inventada para que cualquiera pueda abrirlo. Lo que construimos para usted parte de cómo trabaja hoy: sus unidades, sus lotes, su carta y la gente que lo va a usar.",
    diagDesc:
      "Diez días hábiles en los que revisamos sus registros, su publicidad y su operación como un solo sistema. Usted recibe un informe escrito: qué funciona, qué falla y qué conviene construir primero.",
  },
};

export type DemosIndexDict = typeof en;
export const demosIndex: Dict<DemosIndexDict> = { en, es };
