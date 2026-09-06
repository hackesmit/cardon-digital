import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import ContactDoors from "@/components/contact/ContactDoors";
import ContactForm from "@/components/contact/ContactForm";
import ContactMail from "@/components/contact/ContactMail";
import { readDoors } from "@/lib/contact/doors";
import { deliveryConfigured } from "@/lib/contact/mail";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/i18n/metadata";
import { contact } from "@/lib/i18n/contact";
import { rich } from "@/lib/i18n/rich";
import "./contacto.css";

/* One address in both locales. The path is a word a Spanish reader types and
   an English reader recognises, and keeping it identical means a language
   switch on this page never has to translate the URL. */

type Params = { params: { locale: string } };

function localeOf(params: { locale: string }): Locale {
  return isLocale(params.locale) ? params.locale : "es";
}

/* Which doors this build has. The written door is always one of the three,
   and it is the form only when this environment can actually deliver mail;
   otherwise it is the mailto, which cannot swallow a message. Read on the
   server, where RESEND_API_KEY is readable and stays. */
const DOORS = readDoors(deliveryConfigured());

export function generateMetadata({ params }: Params): Metadata {
  const locale = localeOf(params);
  const meta = contact[locale].meta;
  // The description names the doors this build has, never the ones it does not.
  return pageMetadata(locale, "/contacto", {
    title: meta.title,
    description: meta.description[DOORS.variant],
  });
}

export default function ContactPage({ params }: Params) {
  const d = contact[localeOf(params)];
  /* The written door's own heading, which names what it actually is. */
  const written = DOORS.form ? d.form : d.mail;
  /* The headline counts the doors that are actually on the page: three with
     WhatsApp and the booking link configured, two with one of them, and the
     written door alone when neither is. */
  const intro = d.intro[DOORS.variant];

  return (
    <main id="main" className="pg-contacto">
      <section className="hero" aria-labelledby="contact-title">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">{d.eyebrow}</p>
            <h1 id="contact-title">{rich(intro.title, { hl: "accent" })}</h1>
            <p className="hero-sub">{rich(intro.sub)}</p>
            <p className="brandline">{d.reply}</p>
          </div>
        </div>
      </section>

      <ContactDoors />

      <section className="section form-section" aria-labelledby="form-title">
        <div className="container">
          <Reveal>
            <div className="form-inner">
              <div className="form-lead">
                <span className="kicker clay">{written.kicker}</span>
                <h2 id="form-title">{written.title}</h2>
                <p className="section-sub">{rich(written.sub)}</p>
              </div>
              {DOORS.form ? <ContactForm /> : <ContactMail />}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
