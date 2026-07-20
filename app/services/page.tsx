import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "The Growth Diagnostic, the Growth System retainer, and fixed-scope builds: sites, e-commerce, automation sprints, dashboards. Flat fees, never percent of spend.",
  alternates: {
    canonical: "/services",
    languages: { "en-US": "/services", "es-MX": "/es/services" },
  },
};

const builds = [
  {
    name: "Conversion site",
    from: "from $4,000",
    detail: "Marketing site, 3-5 pages, English or bilingual, 3-4 weeks.",
  },
  {
    name: "E-commerce build",
    from: "from $8,000",
    detail: "Shopify or headless Next.js with Stripe. Integration-heavy is the specialty.",
  },
  {
    name: "Automation sprint",
    from: "from $3,000",
    detail: "3-5 production workflows in 2-3 weeks, with a measured before-and-after baseline. Team training and handoff included.",
  },
  {
    name: "Dashboard / internal tool",
    from: "from $4,000",
    detail: "Analytics, prediction, operations. The Monte Xanic pattern applied to your data.",
  },
];

export default function Services() {
  return (
    <>
      <Nav lang="en" />
      <main className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-site px-5 pb-24 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">Services</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
            One system, one price. No percent of spend, no hourly, no lock-in.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
            Flat fees, fixed scopes, month to month. If our fee rose with your
            ad spend, we would profit from recommending more spend. It does
            not, so the only way we win is if the system performs.
          </p>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-y border-ink/10 py-5 font-mono text-xs uppercase tracking-wide text-haze">
            <span className="text-ink/80">The Cardon Method</span>
            <span><span className="text-cardon">01</span> Make the numbers true</span>
            <span><span className="text-cardon">02</span> Stop the waste</span>
            <span><span className="text-cardon">03</span> Build the system</span>
            <span><span className="text-cardon">04</span> Train your team</span>
            <span><span className="text-cardon">05</span> Compound</span>
          </div>

          {/* Diagnostic */}
          <Reveal>
            <section className="mt-20 bg-dune p-8 sm:p-12">
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                    Start here
                  </p>
                  <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">
                    Growth Diagnostic
                  </h2>
                  <p className="mt-5 max-w-lg leading-relaxed text-ink/75">
                    Every engagement starts here, because prescribing before
                    diagnosing is malpractice. Ten business days across your
                    ads, tracking, site, and workflows. You get a written memo:
                    what your numbers actually count, where the spend leaks
                    with dollar figures on it, what to automate first, and a
                    30-day priority plan. Paid upfront, no retainer required;
                    the memo is yours and you can hand it to any competent
                    operator. Sometimes the honest finding is that you do not
                    need us yet. You will hear that too.
                  </p>
                </div>
                <div className="flex flex-col justify-between lg:col-span-4">
                  <div>
                    <p className="font-display text-5xl font-extrabold tracking-tight text-cardon">
                      $1,500
                    </p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-wide text-haze">
                      Fixed. Credited if you continue within 30 days.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="mt-8 bg-clay px-6 py-3 text-center text-sm font-medium text-sand transition-opacity hover:opacity-90"
                  >
                    Book the diagnostic
                  </Link>
                </div>
              </div>
            </section>
          </Reveal>

          {/* Retainer */}
          <Reveal>
            <section className="mt-8 border border-ink/15 p-8 sm:p-12">
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                    The engine
                  </p>
                  <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">
                    Growth System retainer
                  </h2>
                  <p className="mt-5 max-w-lg leading-relaxed text-ink/75">
                    Ongoing ownership of the system: Google Ads management,
                    conversion tracking, one automation improvement every
                    month, site care, and a monthly report in plain language
                    with real numbers. Your team gets trained on every workflow
                    we ship.
                  </p>
                  <p className="mt-4 font-mono text-xs uppercase tracking-wide text-clay">
                    Five client slots. Small by design.
                  </p>
                </div>
                <div className="flex flex-col justify-between lg:col-span-4">
                  <div>
                    <p className="font-display text-5xl font-extrabold tracking-tight text-cardon">
                      <span className="text-2xl text-haze">from </span>$1,500
                      <span className="text-2xl text-haze">/mo</span>
                    </p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-wide text-haze">
                      Scoped to your system after the diagnostic.
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-ink/70">
                      Month to month. Flat fee at every spend level.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="mt-8 border border-ink/25 px-6 py-3 text-center text-sm font-medium transition-colors hover:border-ink"
                  >
                    Ask about a slot
                  </Link>
                </div>
              </div>
            </section>
          </Reveal>

          {/* Builds */}
          <section className="mt-24">
            <Reveal>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Fixed-scope builds
              </h2>
              <p className="mt-3 max-w-lg leading-relaxed text-ink/70">
                50 percent up front, balance at launch. Every build ships with a
                care plan option at $400/mo so it keeps working after day one.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-px bg-ink/10 sm:grid-cols-2">
              {builds.map((b, i) => (
                <Reveal key={b.name} delay={i * 80} className="bg-sand">
                  <div className="flex h-full flex-col p-7">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl font-bold">{b.name}</h3>
                      <span className="shrink-0 font-mono text-sm text-cardon">
                        {b.from}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink/65">
                      {b.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* What is not offered */}
          <Reveal>
            <section className="mt-24 max-w-2xl">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                What Cardon does not sell
              </h2>
              <p className="mt-4 leading-relaxed text-ink/70">
                Social media management, content-mill SEO packages, or ads
                billed as a percentage of your spend. If the honest answer is
                that your account is well built and your problem is somewhere
                else, the diagnostic says exactly that.
              </p>
            </section>
          </Reveal>
        </div>
      </main>
      <Footer lang="en" />
    </>
  );
}
