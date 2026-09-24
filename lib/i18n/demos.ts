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
      begins: "service begins",
      filling: "filling",
      flagged: "the rush, flagged early",
      peak: "peak service",
    },
    fallback:
      "A top-down floor plan of a dining room across one service, from 17:00 to 23:00. Reservations dock onto tables as small chips, tables warm as they seat and cool as they turn, and a quiet load line tracks covers over the evening. An hour before the peak, a calm marker shows the rush arriving, visible early rather than as a surprise.",
    /** The table readouts overlaid on the floor. Each is the table's last
        booking of the evening and says so, because the board is drawn at one
        minute and that booking is usually still to come. */
    tables: {
      twoWindow: "Two-top / window",
      fourCenter: "Four-top / center",
      banquette: "Banquette / six seats",
      fourLower: "Four-top / lower room",
      largeTop: "Large top / six seats",
      twoLower: "Two-top / lower room",
    },
    party: "last booking: party of {n} at {time}",
    tableAria: {
      twoWindow:
        "Two-top by the window. Illustrative last booking of the evening: party of {n} at {time}.",
      fourCenter:
        "Four-top. Illustrative last booking of the evening: party of {n} at {time}.",
      banquette:
        "Banquette, six seats. Illustrative last booking of the evening: party of {n} at {time}.",
      fourLower:
        "Four-top. Illustrative last booking of the evening: party of {n} at {time}.",
      largeTop:
        "Large table, six seats. Illustrative last booking of the evening: party of {n} at {time}.",
      twoLower:
        "Two-top. Illustrative last booking of the evening: party of {n} at {time}.",
    },
    /** The strip under the board, which is the whole readout on a phone where
        there is no hover to open a plate. */
    readoutLabel: "Selected table",
    hint: "Select a table to read its last booking of the evening.",
  },

  produccion: {
    title: "The block and the cellar across one harvest",
    tagSpan: "20 AUG to 1 OCT",
    /** Drawn on the canvas. */
    vineyard: "VINEYARD BLOCK",
    cellar: "CELLAR",
    brix: "DEGREES BRIX BY LOT",
    illustrativeUpper: "ILLUSTRATIVE",
    illustrative: "illustrative",
    /** The band the readings climb into, and the calm marker five days ahead
        of the last crossing. The short form is for narrow boards, where the
        long one would run off the chart. */
    window: "picking window",
    flag: "the picking window, five days early",
    flagCompact: "window, five days early",
    /** The calendar strip's months. Drawn, so they are three letters. */
    months: { aug: "AUG", sep: "SEP", oct: "OCT" },
    /** Where the harvest has got to, read out beside the block. */
    captions: {
      begins: "the harvest begins",
      ripening: "ripening",
      flagged: "the window, flagged five days early",
      picked: "every lot cut inside its window",
    },
    fallback:
      "A vineyard block of six lots seen from above with the cellar beside it, across one harvest from 20 August to 1 October. Each lot deepens as its fruit ripens and is cut on the day its sugar reading enters the picking window, and the fruit travels from the lot to its own tank, which fills. Underneath, the six lots' readings in degrees Brix climb toward that window, and five days before the last crossing a calm marker shows the window arriving, visible early rather than as a surprise.",
    /** The lot readouts overlaid on the block. Each is that lot's own cut. */
    varieties: {
      sauvignonBlanc: "Sauvignon Blanc",
      chardonnay: "Chardonnay",
      merlot: "Merlot",
      tempranillo: "Tempranillo",
      nebbiolo: "Nebbiolo",
      cabernet: "Cabernet Sauvignon",
    },
    lotName: "Lot {k}, {variety}",
    cut: "cut {date}, {brix} Bx, {tons} t",
    lotAria:
      "Lot {k}, {variety}. Illustrative cut: {date}, {brix} degrees Brix, {tons} tons.",
    /** The strip under the block, which is the whole readout on a phone where
        there is no hover to open a plate. */
    readoutLabel: "Selected lot",
    hint: "Select a lot to read its cut.",
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
    rushCompact: "hora pico, una hora antes",
    rush: "la hora pico, visible una hora antes",
    captions: {
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
    party: "última reservación: mesa de {n} a las {time}",
    tableAria: {
      twoWindow:
        "Mesa de dos junto a la ventana. Última reservación ilustrativa de la noche: mesa de {n} a las {time}.",
      fourCenter:
        "Mesa de cuatro. Última reservación ilustrativa de la noche: mesa de {n} a las {time}.",
      banquette:
        "Banca de seis lugares. Última reservación ilustrativa de la noche: mesa de {n} a las {time}.",
      fourLower:
        "Mesa de cuatro. Última reservación ilustrativa de la noche: mesa de {n} a las {time}.",
      largeTop:
        "Mesa grande de seis lugares. Última reservación ilustrativa de la noche: mesa de {n} a las {time}.",
      twoLower:
        "Mesa de dos. Última reservación ilustrativa de la noche: mesa de {n} a las {time}.",
    },
    readoutLabel: "Mesa seleccionada",
    hint: "Elige una mesa para leer su última reservación de la noche.",
  },

  produccion: {
    title: "El viñedo y la bodega a lo largo de una vendimia",
    tagSpan: "20 AGO a 1 OCT",
    vineyard: "VIÑEDO",
    cellar: "BODEGA",
    brix: "GRADOS BRIX POR LOTE",
    illustrativeUpper: "ILUSTRATIVO",
    illustrative: "ilustrativo",
    window: "ventana de corte",
    flag: "la ventana de corte, cinco días antes",
    flagCompact: "ventana, cinco días antes",
    months: { aug: "AGO", sep: "SEP", oct: "OCT" },
    captions: {
      begins: "empieza la vendimia",
      ripening: "madurando",
      flagged: "la ventana, avisada con cinco días",
      picked: "cada lote, cortado en su ventana",
    },
    fallback:
      "Un viñedo de seis lotes visto desde arriba con la bodega a un lado, a lo largo de una vendimia del 20 de agosto al 1 de octubre. Cada lote se oscurece conforme madura su fruta y se corta el día en que su lectura de azúcar entra en la ventana de corte, y la fruta viaja del lote a su propia cuba, que se va llenando. Abajo, las lecturas de los seis lotes en grados Brix suben hacia esa ventana, y cinco días antes de que el último lote entre en su ventana, una marca serena la muestra llegando, visible con tiempo y no como sorpresa.",
    varieties: {
      sauvignonBlanc: "Sauvignon Blanc",
      chardonnay: "Chardonnay",
      merlot: "Merlot",
      tempranillo: "Tempranillo",
      nebbiolo: "Nebbiolo",
      cabernet: "Cabernet Sauvignon",
    },
    lotName: "Lote {k}, {variety}",
    cut: "corte {date}, {brix} Bx, {tons} t",
    lotAria:
      "Lote {k}, {variety}. Corte ilustrativo: {date}, {brix} grados Brix, {tons} toneladas.",
    readoutLabel: "Lote seleccionado",
    hint: "Elige un lote para leer su corte.",
  },
};

export const demos: Dict<DemosDict> = { en, es };
