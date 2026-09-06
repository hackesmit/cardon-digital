/**
 * Which doors this build actually has, answered in one place.
 *
 * The page copy has to count the doors it renders and each door hides itself
 * when its environment value is missing, so both sides read the same answer
 * from here rather than deciding separately and disagreeing. A page that
 * promises a door it does not render is a broken promise, not a detail.
 *
 * The environment expressions are written out in full because Next only
 * substitutes the literal form of process.env.NEXT_PUBLIC_* into the browser
 * bundle, and this module is read on both sides of the wire.
 */

import { EMPTY_ATTRIBUTION } from "./attribution";
import { bookingHref, whatsappNumber } from "./links";

/** The form is always present, so the variant names what stands beside it. */
export type DoorVariant = "all" | "whatsappForm" | "bookingForm" | "formOnly";

export type Doors = {
  whatsapp: boolean;
  booking: boolean;
  count: 1 | 2 | 3;
  variant: DoorVariant;
};

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP;
const BOOKING = process.env.NEXT_PUBLIC_BOOKING_URL;

/* The same emptiness tests the doors themselves use: whatsappHref is empty
   exactly when whatsappNumber is, and bookingHref does not depend on the
   attribution for whether it resolves, only for what it carries. */
export function readDoors(
  whatsappValue: string | undefined = WHATSAPP,
  bookingValue: string | undefined = BOOKING,
): Doors {
  const whatsapp = whatsappNumber(whatsappValue) !== "";
  const booking = bookingHref(bookingValue, EMPTY_ATTRIBUTION) !== "";
  const variant: DoorVariant =
    whatsapp && booking
      ? "all"
      : whatsapp
        ? "whatsappForm"
        : booking
          ? "bookingForm"
          : "formOnly";
  const count = (1 + (whatsapp ? 1 : 0) + (booking ? 1 : 0)) as 1 | 2 | 3;
  return { whatsapp, booking, count, variant };
}

/** The build's own answer, which is what every caller wants. */
export const DOORS = readDoors();
