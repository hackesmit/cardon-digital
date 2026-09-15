import type { Dict } from "./rich";

/**
 * Copy for the three module demos (epic hq-3pfhe). Only the words live here.
 *
 * What a demo shows, the tables and their reservations, the lots, the stays,
 * is invented decoration shaped to read the way a real screen reads, so it
 * sits in the component beside the geometry it belongs to and never in a
 * dictionary. `honest` is the admission every frame carries, the same one the
 * case-study visuals make.
 */

const en = {
  honest: "illustrative view, not client data",

  restaurante: {
    title: "The floor across one service",
    tagHours: "17:00 to 23:00",
    /** Drawn on the canvas. */
    entrance: "ENTRANCE",
    covers: "COVERS OVER THE EVENING",
    illustrativeUpper: "ILLUSTRATIVE",
    illustrative: "illustrative",
    /** The calm marker an hour ahead of the peak. The short form is for narrow
        boards, where the long one would run off the plot. */
    rushCompact: "rush, an hour early",
    rush: "the rush, visible an hour early",
    /** Where the evening has got to, read out beside the board. */
    captions: {
      oneEvening: "one evening",
      begins: "service begins",
      filling: "filling",
      flagged: "the rush, flagged early",
      peak: "peak service",
    },
    fallback:
      "A top-down floor plan of a dining room across one service, from 17:00 to 23:00. Reservations dock onto tables as small chips, tables warm as they seat and cool as they turn, and a quiet load line tracks covers over the evening. An hour before the peak, a calm marker shows the rush arriving, visible early rather than as a surprise.",
    /** The table readouts overlaid on the floor. */
    tables: {
      twoWindow: "Two-top / window",
      fourCenter: "Four-top / center",
      banquette: "Banquette / six seats",
      fourLower: "Four-top / lower room",
      largeTop: "Large top / six seats",
      twoLower: "Two-top / lower room",
    },
    party: "party of {n}, seated {time}",
    tableAria: {
      twoWindow:
        "Two-top by the window. Illustrative reservation: party of {n}, seated {time}.",
      fourCenter:
        "Four-top. Illustrative reservation: party of {n}, seated {time}.",
      banquette:
        "Banquette, six seats. Illustrative reservation: party of {n}, seated {time}.",
      fourLower:
        "Four-top. Illustrative reservation: party of {n}, seated {time}.",
      largeTop:
        "Large table, six seats. Illustrative reservation: party of {n}, seated {time}.",
      twoLower:
        "Two-top. Illustrative reservation: party of {n}, seated {time}.",
    },
    /** The strip under the board, which is the whole readout on a phone where
        there is no hover to open a plate. */
    readoutLabel: "Selected table",
    hint: "Select a table to read its booking.",
  },
};

export type DemosDict = typeof en;

const es: DemosDict = {
  honest: "vista ilustrativa, no son datos de cliente",

  restaurante: {
    title: "El salón a lo largo de un servicio",
    tagHours: "17:00 a 23:00",
    entrance: "ENTRADA",
    covers: "COMENSALES DE LA NOCHE",
    illustrativeUpper: "ILUSTRATIVO",
    illustrative: "ilustrativo",
    rushCompact: "la hora pico, con una hora",
    rush: "la hora pico, visible con una hora",
    captions: {
      oneEvening: "una noche",
      begins: "empieza el servicio",
      filling: "llenándose",
      flagged: "la hora pico, avisada temprano",
      peak: "servicio en su punto",
    },
    fallback:
      "Un plano del comedor visto desde arriba a lo largo de un servicio, de las 17:00 a las 23:00. Las reservaciones se acomodan en las mesas como fichas pequeñas, las mesas se calientan cuando se sientan y se enfrían cuando se desocupan, y una línea tranquila sigue a los comensales de la noche. Una hora antes del punto más alto, una marca serena muestra la hora pico llegando, visible con tiempo y no como sorpresa.",
    tables: {
      twoWindow: "Mesa de 2 / ventana",
      fourCenter: "Mesa de 4 / centro",
      banquette: "Banca / seis lugares",
      fourLower: "Mesa de 4 / salón bajo",
      largeTop: "Mesa grande / seis lugares",
      twoLower: "Mesa de 2 / salón bajo",
    },
    party: "mesa de {n}, sentados {time}",
    tableAria: {
      twoWindow:
        "Mesa de dos junto a la ventana. Reservación ilustrativa: mesa de {n}, sentados a las {time}.",
      fourCenter:
        "Mesa de cuatro. Reservación ilustrativa: mesa de {n}, sentados a las {time}.",
      banquette:
        "Banca de seis lugares. Reservación ilustrativa: mesa de {n}, sentados a las {time}.",
      fourLower:
        "Mesa de cuatro. Reservación ilustrativa: mesa de {n}, sentados a las {time}.",
      largeTop:
        "Mesa grande de seis lugares. Reservación ilustrativa: mesa de {n}, sentados a las {time}.",
      twoLower:
        "Mesa de dos. Reservación ilustrativa: mesa de {n}, sentados a las {time}.",
    },
    readoutLabel: "Mesa seleccionada",
    hint: "Elige una mesa para leer su reservación.",
  },
};

export const demos: Dict<DemosDict> = { en, es };
