import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import type { Locale } from "@/lib/i18n/config";
import { modulos, type ModuleCopy } from "@/lib/i18n/modulos";
import { rich } from "@/lib/i18n/rich";

/**
 * One module, described in full: the head, the problem it solves and the
 * answer, the feature list by size, the size bands, who it is for, the policy
 * line with its exclusions, and the button to that module's own demo.
 *
 * It was the body of /modulos and it is a component because the showcase home
 * carries the same three descriptions (bead hq-wrig5.15). The copy has one
 * home, lib/i18n/modulos.ts, and both surfaces render it through here, so a
 * module description cannot say one thing on one page and another on the next.
 *
 * `alt` is the banded background of the odd rows on /modulos. The showcase
 * passes it too, so the rhythm of the three blocks is the same on both pages.
 */
export default function ModuleBlock({
  locale,
  module: m,
  alt,
  demoHref,
  sectionId,
}: {
  locale: Locale;
  module: ModuleCopy;
  alt: boolean;
  demoHref: string;
  /** Defaults to the module id, which is the anchor /modulos already uses. */
  sectionId?: string;
}) {
  const d = modulos[locale];
  const id = sectionId ?? m.id;

  return (
    <section
      className={"section mod" + (alt ? " mod-alt" : "")}
      id={id}
      aria-labelledby={id + "-title"}
    >
      <div className="container">
        <Reveal>
          <div className="mod-head">
            <span className="mod-num mono">{m.num}</span>
            <div>
              <h2 id={id + "-title"}>{m.name}</h2>
              <p className="mod-tag">{m.tag}</p>
            </div>
          </div>
        </Reveal>

        {/* the problem it solves, and the answer */}
        <Reveal delay={60}>
          <div className="mod-problem">
            <div className="mod-problem-copy">
              <h3>{m.problem.h}</h3>
              <p className="mod-body">{m.problem.body}</p>
            </div>
            <p className="mod-answer">{rich(m.problem.answer)}</p>
          </div>
        </Reveal>

        {/* the feature list, by size */}
        <Reveal delay={60}>
          <div className="mod-build">
            <h3 className="mod-h3">{m.features.h}</h3>
            <div className="mod-build-grid">
              <div className="mod-pack mod-pack-base">
                <span className="mod-pack-label mono">
                  {m.features.base.label}
                </span>
                <ul className="mod-list">
                  {m.features.base.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mod-pack-col">
                {m.features.adds.map((add) => (
                  <div className="mod-pack" key={add.label}>
                    <span className="mod-pack-label mono">{add.label}</span>
                    <ul className="mod-list">
                      {add.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="mod-pack mod-pack-also">
                  <span className="mod-pack-label mono">
                    {m.features.also.label}
                  </span>
                  <ul className="mod-list">
                    {m.features.also.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* the size bands */}
        <Reveal delay={60}>
          <div className="mod-sizes">
            <h3 className="mod-h3">{m.sizes.h}</h3>
            <p className="mod-sizes-lead">{d.sizesLead}</p>
            <dl className="size-list">
              {m.sizes.rows.map((row) => (
                <div className="size-row" key={row.key}>
                  <dt className="size-key mono">{row.key}</dt>
                  <dd className="size-body">{row.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* who it is for, with the grower set where there is one */}
        <Reveal delay={60}>
          <div className="mod-who">
            <h3 className="mod-h3">{m.who.h}</h3>
            <p className="mod-body">{m.who.body}</p>
            {m.who.grower ? (
              <div className="grower">
                <span className="mod-pack-label mono">{m.who.grower.h}</span>
                <ul className="mod-list">
                  {m.who.grower.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mod-note">{rich(m.who.grower.note)}</p>
              </div>
            ) : null}
          </div>
        </Reveal>

        {/* the policy line, and the exclusions where there are any */}
        <Reveal delay={60}>
          <div className="mod-policy">
            <p className="mod-note">{rich(m.policy)}</p>
            {m.exclusions ? (
              <div className="mod-excl">
                <h3 className="mod-h4">{m.exclusions.h}</h3>
                <p className="mod-body">{m.exclusions.body}</p>
              </div>
            ) : null}
          </div>
        </Reveal>

        {/* the demo for this module alone */}
        <Reveal delay={60}>
          <div className="mod-demo">
            <Link className="demo-btn" href={demoHref}>
              <span>{m.demo}</span>
              <span className="demo-soon mono">{d.demoSoon}</span>
            </Link>
            <p className="mod-note">{rich(d.demoNote)}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
