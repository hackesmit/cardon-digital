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

  hospitalidad: {
    title: "The fortnight filling, channel by channel",
    tagNights: "14 nights",
    /** Drawn on the canvas. The compact form is for narrow boards, where the
        long one would run into the countdown on the same line. */
    dates: "THE FORTNIGHT, 6 TO 19",
    datesCompact: "6 TO 19",
    /** The countdown in the head: how far out the booking window is. */
    daysOut: "{n} DAYS OUT",
    arrival: "FIRST NIGHT",
    /** One letter per day of the week, Monday first, over the date columns. */
    weekdayLetters: "MTWTFSS",
    occupancy: "NIGHTS SOLD, PER NIGHT",
    illustrativeUpper: "ILLUSTRATIVE",
    illustrative: "illustrative",
    /** The live reading in the occupancy band. */
    directShare: "{p}% DIRECT",
    /** Printed inside a stay bar with room for it, which is what makes the
        two colours readable without a key anywhere on the figure. */
    channelsUpper: {
      direct: "DIRECT",
      ota: "OTA",
    },
    channels: {
      direct: "direct",
      ota: "through an agency",
    },
    /** Where the booking window has got to, read out beside the board. */
    captions: {
      opens: "the fortnight opens",
      weekend: "the weekend goes first",
      filling: "the week fills in around it",
      full: "the fortnight, mostly direct",
    },
    fallback:
      "A fourteen night calendar for the eight units of a small property, filling as the booking window closes. Every stay is a bar across the nights it holds, and the bars are drawn in two ways: the bookings that came direct in the module's own colour, the ones that came through an agency in a hatched neutral, each with its source printed on it. Both weekends sell out well before the midweek fills in around them, and a band under the calendar stacks the nights sold per night, direct at the bottom and agency above. The fortnight ends mostly sold, and most of what sold came direct.",
    /** The unit readouts overlaid on the calendar. Each is that unit's longest
        stay of the fortnight and says so, because the board is drawn at one
        moment of the booking window and the rest of its nights are elsewhere. */
    units: {
      casitaJardin: "Casita / garden",
      casitaVinedo: "Casita / vineyard",
      suiteTerraza: "Suite / terrace",
      loft: "Loft",
      villa: "Villa",
    },
    stayLine: "longest stay: {n} nights ({dates}), {channel}",
    unitAria: {
      casitaJardin:
        "Garden casita. Illustrative longest stay of the fortnight: {n} nights, {dates}, {channel}.",
      casitaVinedo:
        "Vineyard casita. Illustrative longest stay of the fortnight: {n} nights, {dates}, {channel}.",
      suiteTerraza:
        "Suite with a terrace. Illustrative longest stay of the fortnight: {n} nights, {dates}, {channel}.",
      loft:
        "Loft. Illustrative longest stay of the fortnight: {n} nights, {dates}, {channel}.",
      villa:
        "Villa. Illustrative longest stay of the fortnight: {n} nights, {dates}, {channel}.",
    },
    /** The strip under the board, which is the whole readout on a phone where
        there is no hover to open a plate. */
    readoutLabel: "Selected unit",
    hint: "Select a unit to read its longest stay of the fortnight.",
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

  hospitalidad: {
    title: "La quincena llenándose, canal por canal",
    tagNights: "14 noches",
    dates: "LA QUINCENA, DEL 6 AL 19",
    datesCompact: "DEL 6 AL 19",
    daysOut: "A {n} DÍAS",
    arrival: "PRIMERA NOCHE",
    weekdayLetters: "LMXJVSD",
    occupancy: "NOCHES VENDIDAS, POR NOCHE",
    illustrativeUpper: "ILUSTRATIVO",
    illustrative: "ilustrativo",
    directShare: "{p}% DIRECTAS",
    channelsUpper: {
      direct: "DIRECTA",
      ota: "OTA",
    },
    channels: {
      direct: "directa",
      ota: "por agencia",
    },
    captions: {
      opens: "la quincena abre",
      weekend: "el fin de semana se va primero",
      filling: "la semana se llena alrededor",
      full: "la quincena, en su mayoría directas",
    },
    fallback:
      "Un calendario de catorce noches para las ocho unidades de una propiedad pequeña, llenándose conforme se cierra la ventana de reservación. Cada estancia es una barra sobre las noches que ocupa, y las barras se dibujan de dos maneras: las reservaciones que llegaron directas en el color del módulo, las que llegaron por agencia en un neutro rayado, cada una con su origen escrito encima. Los dos fines de semana se agotan mucho antes de que la semana se llene alrededor, y una banda bajo el calendario apila las noches vendidas por noche, las directas abajo y las de agencia arriba. La quincena termina casi llena, y la mayor parte de lo vendido llegó directo.",
    units: {
      casitaJardin: "Casita / jardín",
      casitaVinedo: "Casita / viñedo",
      suiteTerraza: "Suite / terraza",
      loft: "Loft",
      villa: "Villa",
    },
    stayLine: "estancia más larga: {n} noches ({dates}), {channel}",
    unitAria: {
      casitaJardin:
        "Casita con jardín. Estancia más larga ilustrativa de la quincena: {n} noches, {dates}, {channel}.",
      casitaVinedo:
        "Casita del viñedo. Estancia más larga ilustrativa de la quincena: {n} noches, {dates}, {channel}.",
      suiteTerraza:
        "Suite con terraza. Estancia más larga ilustrativa de la quincena: {n} noches, {dates}, {channel}.",
      loft:
        "Loft. Estancia más larga ilustrativa de la quincena: {n} noches, {dates}, {channel}.",
      villa:
        "Villa. Estancia más larga ilustrativa de la quincena: {n} noches, {dates}, {channel}.",
    },
    readoutLabel: "Unidad seleccionada",
    hint: "Elige una unidad para leer su estancia más larga de la quincena.",
  },
};

export const demos: Dict<DemosDict> = { en, es };
