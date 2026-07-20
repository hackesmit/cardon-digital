import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Mark from "@/components/Mark";

export const metadata: Metadata = {
  title: "About",
  description:
    "Cardon Digital is Daniel: one senior operator in Baja California building growth systems for US and Mexican businesses, in English and Spanish.",
  alternates: {
    canonical: "/about",
    languages: { "en-US": "/about", "es-MX": "/es/about" },
  },
};

export default function About() {
  return (
    <>
      <Nav lang="en" />
      <main className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">About</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            One operator, both sides of the border.
          </h1>

          <div className="mt-16 grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-lg leading-relaxed text-ink/80">
                  I am Daniel. I build and run growth systems from Baja
                  California: Google Ads with forensic measurement, websites
                  and e-commerce that keep the ad's promise, and automation
                  that never drops a lead.
                </p>
                <p className="mt-6 leading-relaxed text-ink/75">
                  The recent record: ten US Google Ads accounts audited and
                  optimized alongside a US agency, a winery analytics platform
                  with a harvest prediction model for Monte Xanic, a full
                  e-commerce build for Encanto.MX, sites for BrighterHire and
                  Activated Ministries, and the logistics system a construction
                  company runs on.
                </p>
                <p className="mt-6 leading-relaxed text-ink/75">
                  Both languages are native here. The English side of this site
                  was written in English; the Spanish side was written in
                  Spanish. That is also how your campaigns get built: native
                  keyword research and native copy per market, never
                  translation.
                </p>
                <p className="mt-6 leading-relaxed text-ink/75">
                  I work with heavy AI leverage and treat it the way the work
                  deserves: every AI-generated recommendation gets verified
                  against real data before it ships. The tools are fast; the
                  judgment is the service.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <Reveal delay={100}>
                <div className="border border-ink/15 p-7">
                  <Mark className="h-8 w-auto text-cardon" />
                  <h2 className="mt-6 font-display text-xl font-bold">
                    Why Cardon
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    The cardon (Pachycereus pringlei) is the largest cactus in
                    the world. It grows slowly in Baja California, lives for
                    centuries, and stores its own water: built for conditions
                    that kill everything flashy.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    It is also the standard for the work: numbers that hold
                    water.
                  </p>
                </div>
                <div className="mt-6 border border-ink/15 p-7 font-mono text-xs leading-loose text-ink/70">
                  <p className="text-haze">Cross-border, handled</p>
                  <p className="mt-2">
                    US clients: W-8BEN on file, services performed outside the
                    US, no 1099 friction.
                  </p>
                  <p className="mt-2">
                    MX clients: factura CFDI 4.0.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal>
            <div className="mt-20 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="bg-clay px-6 py-3 text-sm font-medium text-sand transition-opacity hover:opacity-90"
              >
                Start with the diagnostic
              </Link>
              <Link
                href="/work"
                className="border border-ink/25 px-6 py-3 text-sm font-medium transition-colors hover:border-ink"
              >
                See the work first
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer lang="en" />
    </>
  );
}
