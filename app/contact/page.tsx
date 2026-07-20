import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book the Growth Diagnostic or ask about a retainer slot. English or Spanish, US or Mexico.",
  alternates: {
    canonical: "/contact",
    languages: { "en-US": "/contact", "es-MX": "/es/contact" },
  },
};

export default function Contact() {
  return (
    <>
      <Nav lang="en" />
      <main className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">Contact</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            Tell me what the numbers say. I will tell you if they are true.
          </h1>

          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="text-lg leading-relaxed text-ink/75">
                  One email is enough to start. Say what you sell, where you
                  advertise, and what feels off. You will get a straight answer
                  about whether the diagnostic makes sense for you, in English
                  or Spanish.
                </p>
                <a
                  href="mailto:hello@cardondigital.com?subject=Growth%20Diagnostic"
                  className="mt-10 inline-block bg-clay px-8 py-4 font-medium text-sand transition-opacity hover:opacity-90"
                >
                  hello@cardondigital.com
                </a>
                <p className="mt-6 font-mono text-xs uppercase tracking-wide text-haze">
                  Baja California / Remote / EN + ES
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <Reveal delay={100}>
                <div className="border border-ink/15 p-7">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                    What happens next
                  </p>
                  <ol className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-ink/75">
                    <li className="flex gap-4">
                      <span className="font-mono text-cardon">01</span>
                      A 30-minute call, no deck, no pitch. Your numbers on the
                      screen.
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-cardon">02</span>
                      If the diagnostic fits, it starts within the week. Ten
                      business days later you have the memo.
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-cardon">03</span>
                      You act on it with me or without me. The memo is yours.
                    </li>
                  </ol>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
      <Footer lang="en" />
    </>
  );
}
