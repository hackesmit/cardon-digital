/**
 * Which doors this build actually has, answered in one place.
 *
 * The page copy has to count the doors it renders and each door hides itself
 * when its environment value is missing, so both sides read the same answer
 * from here rather than deciding separately and disagreeing. A page that
 * promises a door it does not render is a broken promise, not a detail.
 *
 * There are always three doors at most and one at least: WhatsApp and the
 * booked call each appear only when their environment value is usable, and
 * the written door is always present but changes shape. When the site can
 * deliver mail it is the form; when it cannot it is a plain mailto, which
 * leaves the message in the visitor's own outbox rather than accepting it and
 * dropping it. That is why the variant names below say "Form": they name the
 * written door, whichever of the two shapes it is wearing.
 *
 * The environment expressions are written out in full because Next only
 * substitutes the literal form of process.env.NEXT_PUBLIC_* into the browser
 * bundle, and the click-out half of this module is read on both sides of the
 * wire. Whether the form is open is a server-side answer (it depends on
 * RESEND_API_KEY, which never reaches the browser), so it arrives as an
 * argument instead of being read here.
 */

import { EMPTY_ATTRIBUTION } from "./attribution";
import { bookingHref, whatsappNumber } from "./links";

/** The written door is always there, so the variant names what stands beside it. */
export type DoorVariant = "all" | "whatsappForm" | "bookingForm" | "formOnly";

export type ClickDoors = {
  whatsapp: boolean;
  booking: boolean;
};

export type Doors = ClickDoors & {
  /** True when the written door is the form, false when it is the mailto. */
  form: boolean;
  variant: DoorVariant;
};

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP;
const BOOKING = process.env.NEXT_PUBLIC_BOOKING_URL;

/* The same emptiness tests the doors themselves use: whatsappHref is empty
   exactly when whatsappNumber is, and bookingHref does not depend on the
   attribution for whether it resolves, only for what it carries. */
export function readClickDoors(
  whatsappValue: string | undefined = WHATSAPP,
  bookingValue: string | undefined = BOOKING,
): ClickDoors {
  return {
    whatsapp: whatsappNumber(whatsappValue) !== "",
    booking: bookingHref(bookingValue, EMPTY_ATTRIBUTION) !== "",
  };
}

/**
 * The build's click-out doors. Safe to read in the browser: both values are
 * NEXT_PUBLIC and are public by design.
 */
export const CLICK_DOORS = readClickDoors();

/**
 * The whole door set. `formOpen` comes from the server, where the delivery
 * environment can be read; see deliveryConfigured in ./mail.
 */
export function readDoors(
  formOpen: boolean,
  whatsappValue: string | undefined = WHATSAPP,
  bookingValue: string | undefined = BOOKING,
): Doors {
  const { whatsapp, booking } = readClickDoors(whatsappValue, bookingValue);
  const variant: DoorVariant =
    whatsapp && booking
      ? "all"
      : whatsapp
        ? "whatsappForm"
        : booking
          ? "bookingForm"
          : "formOnly";
  return { whatsapp, booking, form: formOpen, variant };
}
