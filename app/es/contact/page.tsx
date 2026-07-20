import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contacto - Cardon Digital",
  description:
    "Agenda el Diagnóstico de Crecimiento o pregunta por un lugar de retención. Español o inglés, México o Estados Unidos.",
  alternates: {
    canonical: "/es/contact",
    languages: { "en-US": "/contact", "es-MX": "/es/contact" },
  },
};

export default function ContactEs() {
  return (
    <>
      <Nav lang="es" />
      <main className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">Contacto</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Cuéntanos qué dicen tus números. Te decimos si es verdad.
          </h1>

          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="text-lg leading-relaxed text-ink/75">
                  Un correo basta para empezar. Dime qué vendes, dónde te
                  anuncias y qué se siente raro. Recibes una respuesta directa
                  sobre si el diagnóstico tiene sentido para tu negocio.
                </p>
                <a
                  href="mailto:hello@cardondigital.com?subject=Diagn%C3%B3stico%20de%20Crecimiento"
                  className="mt-10 inline-block bg-clay px-8 py-4 font-medium text-sand transition-opacity hover:opacity-90"
                >
                  hello@cardondigital.com
                </a>
                <p className="mt-6 font-mono text-xs uppercase tracking-wide text-haze">
                  Baja California / Remoto / ES + EN
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <Reveal delay={100}>
                <div className="border border-ink/15 p-7">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                    Qué sigue
                  </p>
                  <ol className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-ink/75">
                    <li className="flex gap-4">
                      <span className="font-mono text-cardon">01</span>
                      Una llamada de 30 minutos, sin presentación, sin pitch.
                      Tus números en pantalla.
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-cardon">02</span>
                      Si el diagnóstico aplica, arranca esa misma semana. Diez
                      días hábiles después tienes el memo.
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-cardon">03</span>
                      Actúas sobre él con nosotros o sin nosotros. El memo es
                      tuyo.
                    </li>
                  </ol>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
      <Footer lang="es" />
    </>
  );
}
