import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import RibField from "@/components/RibField";

const cases = [
  {
    slug: "monte-xanic",
    client: "Monte Xanic",
    sector: "Winery, Valle de Guadalupe",
    result: "Analytics dashboard with a harvest prediction model, plus the automations that run around it.",
    tag: "Data + Automation",
    featured: true,
  },
  {
    slug: "paid-search",
    client: "US paid search",
    sector: "10 accounts, anonymized",
    result: "Reported: 150.54 conversions. Real: 93. Finding the difference is the job.",
    tag: "Google Ads",
    featured: true,
  },
  {
    slug: "encanto",
    client: "Encanto.MX",
    sector: "E-commerce",
    result: "Full online shop build.",
    tag: "Web",
  },
  {
    slug: "brighterhire",
    client: "BrighterHire",
    sector: "HR and hiring",
    result: "Design portfolio site.",
    tag: "Web",
  },
  {
    slug: "activated-ministries",
    client: "Activated Ministries",
    sector: "Nonprofit",
    result: "Website for a working charity.",
    tag: "Web",
  },
  {
    slug: "construction-logistics",
    client: "Construction logistics",
    sector: "Internal tooling",
    result: "The logistics system a construction company runs on.",
    tag: "Systems",
  },
];

const system = [
  {
    n: "01",
    name: "Demand",
    what: "Google Ads built on forensic measurement.",
    detail:
      "Audits where every finding carries evidence and a dollar figure. Campaigns managed for a flat fee, never a percentage of your spend.",
  },
  {
    n: "02",
    name: "Conversion",
    what: "A site that keeps the promise the ad made.",
    detail:
      "Marketing sites, e-commerce, landing pages, dashboards. Built fast, built to convert, built so you own them.",
  },
  {
    n: "03",
    name: "Operations",
    what: "Automation that never drops a lead.",
    detail:
      "Follow-up, reporting, and back-office workflows that run while you sleep. The unglamorous plumbing where AI actually pays off.",
  },
];

export default function Home() {
  return (
    <>
      <Nav lang="en" />
      <main id="main">
        {/* 01 Hero */}
        <section className="relative overflow-hidden pt-32 sm:pt-40">
          <div className="mx-auto max-w-site px-5 sm:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
              Baja California / EN + ES / One operator
            </p>
            <h1 className="mt-6 font-display text-[11vw] font-extrabold leading-[0.98] tracking-tight sm:text-[7.5vw] lg:text-[6.2vw]">
              <span className="hero-line">
                <span style={{ animationDelay: "0.05s" }}>Your ads, your site,</span>
              </span>
              <span className="hero-line">
                <span style={{ animationDelay: "0.15s" }}>your automations.</span>
              </span>
              <span className="hero-line text-cardon">
                <span style={{ animationDelay: "0.25s" }}>One senior operator.</span>
              </span>
              <span className="hero-line text-clay">
                <span style={{ animationDelay: "0.35s" }}>No agency layers.</span>
              </span>
            </h1>
            <div className="mt-10 flex max-w-2xl flex-col gap-8 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-lg leading-relaxed text-ink/75">
                Cardon Digital builds and runs the whole growth system: campaigns
                that bring demand, a site that converts it, and automation that
                never drops a lead.
              </p>
              <div className="flex shrink-0 flex-col gap-3">
                <Link
                  href="/contact"
                  className="bg-clay px-6 py-3 text-center text-sm font-medium text-sand transition-opacity hover:opacity-90"
                >
                  Get the Growth Diagnostic
                </Link>
                <Link
                  href="/work"
                  className="border border-ink/25 px-6 py-3 text-center text-sm font-medium transition-colors hover:border-ink"
                >
                  See the work
                </Link>
              </div>
            </div>
          </div>
          <div className="h-40 w-full sm:h-56">
            <RibField />
          </div>
        </section>

        {/* Stat strip */}
        <section className="rule">
          <div className="mx-auto grid max-w-site gap-6 px-5 py-8 font-mono text-xs uppercase tracking-wide text-haze sm:grid-cols-3 sm:px-8">
            <Reveal>
              <p>10 US ad accounts audited and optimized</p>
            </Reveal>
            <Reveal delay={80}>
              <p>6 named clients across 2 countries</p>
            </Reveal>
            <Reveal delay={160}>
              <p>Both languages written natively, not translated</p>
            </Reveal>
          </div>
        </section>

        {/* 02 The problem */}
        <section className="rule">
          <div className="mx-auto max-w-site px-5 py-24 sm:px-8 sm:py-32">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <Reveal>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                    The problem
                  </p>
                </Reveal>
              </div>
              <div className="lg:col-span-9">
                <Reveal>
                  <h2 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                    Most small-business marketing runs on numbers that lie.
                  </h2>
                </Reveal>
                <div className="mt-12 grid gap-8 sm:grid-cols-3">
                  <Reveal delay={0}>
                    <div className="rule pt-5">
                      <p className="font-mono text-sm text-clay">3x</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink/70">
                        A lead counted three times looks like growth. It is one
                        customer and three receipts.
                      </p>
                    </div>
                  </Reveal>
                  <Reveal delay={100}>
                    <div className="rule pt-5">
                      <p className="font-mono text-sm text-clay">4.6x</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink/70">
                        A return on ad spend that was really a CRM pipeline
                        ratio. Nobody had checked what the number counted.
                      </p>
                    </div>
                  </Reveal>
                  <Reveal delay={200}>
                    <div className="rule pt-5">
                      <p className="font-mono text-sm text-clay">95%</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink/70">
                        of AI pilots never touch the P&amp;L. They die on
                        integration, not intelligence.
                      </p>
                    </div>
                  </Reveal>
                </div>
                <Reveal delay={150}>
                  <p className="mt-12 max-w-xl text-lg leading-relaxed">
                    Everything Cardon builds starts the same way:{" "}
                    <span className="font-semibold text-cardon">
                      make the numbers true, then compound from there.
                    </span>
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* 03 The system */}
        <section className="rule">
          <div className="mx-auto max-w-site px-5 py-24 sm:px-8 sm:py-32">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <Reveal>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                    The system
                  </p>
                </Reveal>
              </div>
              <div className="lg:col-span-9">
                <Reveal>
                  <h2 className="max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                    Three parts. One pipeline. One person accountable for all of
                    it.
                  </h2>
                </Reveal>
              </div>
            </div>
            <div className="mt-16 grid gap-px overflow-hidden bg-ink/10 sm:grid-cols-3">
              {system.map((s, i) => (
                <Reveal key={s.n} delay={i * 120} className="bg-sand">
                  <div className="flex h-full flex-col p-7">
                    <p className="font-mono text-sm text-haze">{s.n}</p>
                    <h3 className="mt-6 font-display text-2xl font-bold text-cardon">
                      {s.name}
                    </h3>
                    <p className="mt-2 font-medium leading-snug">{s.what}</p>
                    <p className="mt-4 text-sm leading-relaxed text-ink/65">
                      {s.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 04 Proof wall (night) */}
        <section className="bg-night text-sand">
          <div className="mx-auto max-w-site px-5 py-24 sm:px-8 sm:py-32">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-sand/50">
                    Proof
                  </p>
                  <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                    Real clients, real numbers.
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <Link
                  href="/work"
                  className="font-mono text-xs uppercase tracking-wide text-sand/70 underline-offset-4 hover:underline"
                >
                  All work
                </Link>
              </Reveal>
            </div>
            <div className="mt-14 grid gap-px bg-sand/10 sm:grid-cols-2 lg:grid-cols-3">
              {cases.map((c, i) => (
                <Reveal key={c.slug} delay={i * 80} className="bg-night">
                  <Link
                    href={`/work/${c.slug}`}
                    className={`group flex h-full flex-col p-7 transition-colors hover:bg-sand/5 ${
                      c.featured ? "sm:min-h-[240px]" : ""
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl font-bold">
                        {c.client}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-wide text-ochre">
                        {c.tag}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-sand/50">
                      {c.sector}
                    </p>
                    <p className="mt-5 text-sm leading-relaxed text-sand/75">
                      {c.result}
                    </p>
                    <p className="mt-auto pt-6 font-mono text-xs text-sand/40 transition-colors group-hover:text-sand/80">
                      Read the case
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 05 Method */}
        <section>
          <div className="mx-auto max-w-site px-5 py-24 sm:px-8 sm:py-32">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Reveal>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                    Method
                  </p>
                  <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                    Built to hold water.
                  </h2>
                  <p className="mt-6 max-w-md leading-relaxed text-ink/75">
                    The cardon is the largest cactus on earth. It grows slowly in
                    Baja California, lives for centuries, and stores its own
                    water. That is the standard here: work that survives harsh
                    conditions, and numbers that hold water when you check them.
                  </p>
                </Reveal>
              </div>
              <div className="lg:col-span-7">
                <div className="flex flex-col">
                  {[
                    ["Measurement first", "Tracking gets audited before anything is optimized. If the data lies, everything downstream lies."],
                    ["Evidence-cited findings", "Every recommendation carries the query, the export, or the screenshot behind it, and a dollar figure."],
                    ["Flat fees, never percent of spend", "Your budget growing should not be my raise. The incentive conflict is the industry default; refusing it is the feature."],
                    ["No lock-in", "Month to month. Accountability beats contracts."],
                    ["Five client slots", "One senior operator does the work. Scarcity is not a marketing trick, it is a calendar."],
                  ].map(([title, body], i) => (
                    <Reveal key={title} delay={i * 60}>
                      <div className="rule flex flex-col gap-2 py-6 sm:flex-row sm:gap-10">
                        <p className="shrink-0 font-mono text-xs text-haze sm:w-8 sm:pt-1">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <div>
                          <h3 className="font-display text-lg font-bold">
                            {title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-ink/65">
                            {body}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 06 About strip */}
        <section className="rule">
          <div className="mx-auto max-w-site px-5 py-16 sm:px-8">
            <Reveal>
              <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <p className="max-w-2xl font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                  I am Daniel. I build in Baja California and work on both sides
                  of the border, in both languages.
                </p>
                <Link
                  href="/about"
                  className="shrink-0 font-mono text-xs uppercase tracking-wide text-ink/70 underline-offset-4 hover:underline"
                >
                  About Cardon
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 07 Diagnostic offer */}
        <section className="rule">
          <div className="mx-auto max-w-site px-5 py-24 sm:px-8 sm:py-32">
            <Reveal>
              <div className="bg-dune p-8 sm:p-14">
                <div className="grid gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-haze">
                      The front door
                    </p>
                    <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                      The Growth Diagnostic
                    </h2>
                    <p className="mt-6 max-w-lg leading-relaxed text-ink/75">
                      Ten business days. A written memo, not a sales deck: what
                      your conversion numbers actually count, where the ad spend
                      leaks, what your conversion path drops, and which
                      automations would pay for themselves. With a 30-day
                      priority plan.
                    </p>
                    <ul className="mt-8 flex flex-col gap-3 text-sm text-ink/75">
                      <li className="flex gap-3">
                        <span className="font-mono text-cardon">a.</span>
                        Measurement truth check, in plain language
                      </li>
                      <li className="flex gap-3">
                        <span className="font-mono text-cardon">b.</span>
                        Waste analysis with dollar figures, not vibes
                      </li>
                      <li className="flex gap-3">
                        <span className="font-mono text-cardon">c.</span>
                        Automation map: what to build first and why
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col justify-between lg:col-span-5">
                    <div>
                      <p className="font-display text-6xl font-extrabold tracking-tight text-cardon">
                        $1,500
                      </p>
                      <p className="mt-2 font-mono text-xs uppercase tracking-wide text-haze">
                        Fixed. USD. No retainer required.
                      </p>
                      <p className="mt-6 text-sm leading-relaxed text-ink/70">
                        The memo is yours either way. If we keep working
                        together within 30 days, it is credited against your
                        first month.
                      </p>
                    </div>
                    <Link
                      href="/contact"
                      className="mt-10 bg-clay px-6 py-4 text-center text-sm font-medium text-sand transition-opacity hover:opacity-90"
                    >
                      Book the diagnostic
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer lang="en" />
    </>
  );
}
