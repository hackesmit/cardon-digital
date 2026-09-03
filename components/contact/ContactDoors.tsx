"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/site/Reveal";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { contact } from "@/lib/i18n/contact";
import { rich } from "@/lib/i18n/rich";
import {
  EMPTY_ATTRIBUTION,
  readAttribution,
  type Attribution,
} from "@/lib/contact/attribution";
import { bookingHref, whatsappHref, whatsappText } from "@/lib/contact/links";

/* Read at build time and inlined, so the whole expression has to be written
   out: Next only substitutes the literal form. */
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP;
const BOOKING = process.env.NEXT_PUBLIC_BOOKING_URL;

/**
 * The two click-out doors. Each renders only when its environment value is
 * present and usable, so an unconfigured booking link leaves no dead button
 * behind and a missing WhatsApp number leaves the form as the only door.
 *
 * Attribution is client-only, so both links render with their plain href
 * first and pick up the campaign marks in an effect. A visitor who clicks
 * before that lands in the same conversation, one lead id short.
 */
export default function ContactDoors() {
  const locale = useLocale();
  const d = contact[locale];
  const [attribution, setAttribution] = useState<Attribution>(EMPTY_ATTRIBUTION);

  useEffect(() => {
    setAttribution(readAttribution());
  }, []);

  const waHref = whatsappHref(
    WHATSAPP,
    whatsappText(d.whatsapp.prefill, attribution),
  );
  const bookHref = bookingHref(BOOKING, attribution);

  if (!waHref && !bookHref) return null;

  return (
    <section className="section no-rule doors-section" aria-label={d.doorsAria}>
      <div className="container">
        <Reveal>
          <div className="doors">
            {waHref ? (
              <article className="door">
                <span className="kicker">{d.whatsapp.kicker}</span>
                <h2>{d.whatsapp.title}</h2>
                <p>{rich(d.whatsapp.body)}</p>
                <a
                  className="cta"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {d.whatsapp.cta}
                </a>
              </article>
            ) : null}

            {bookHref ? (
              <article className="door">
                <span className="kicker gold">{d.booking.kicker}</span>
                <h2>{d.booking.title}</h2>
                <p>{rich(d.booking.body)}</p>
                <a
                  className="btn-ghost"
                  href={bookHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {d.booking.cta}
                </a>
              </article>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
