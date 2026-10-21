import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { rich } from "@/lib/i18n/rich";
import type { GuideBlock, GuideSection } from "@/lib/guides/types";

/**
 * The body of a guide: one <section> per question heading, each block in the
 * order the guide file lists it (bead hq-i4b5.11). Lists and tables print
 * their own label as a heading or caption, so a passage an answer engine lifts
 * out alone still says what it is. `fill` resolves {placeholders} the guide
 * reads from elsewhere in the repo (our measured baseline).
 */
export default function GuideBlocks({
  sections,
  locale,
  fill,
}: {
  sections: readonly GuideSection[];
  locale: Locale;
  fill: (text: string) => string;
}) {
  return (
    <>
      {sections.map((s) => (
        <section className="guide-section" id={s.id} key={s.id} aria-labelledby={s.id + "-h"}>
          <h2 id={s.id + "-h"}>{s.h}</h2>
          {s.blocks.map((b, i) => (
            <Block block={b} locale={locale} fill={fill} key={`${s.id}-${i}`} />
          ))}
        </section>
      ))}
    </>
  );
}

function Block({
  block,
  locale,
  fill,
}: {
  block: GuideBlock;
  locale: Locale;
  fill: (text: string) => string;
}) {
  switch (block.kind) {
    case "p":
      return <p>{rich(fill(block.text))}</p>;
    case "list": {
      const items = block.items.map((it) => <li key={it}>{rich(fill(it))}</li>);
      return (
        <div className="guide-list">
          <h3>{block.title}</h3>
          {block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>}
        </div>
      );
    }
    case "table":
      return (
        <div className="guide-table-wrap">
          <table className="guide-table">
            <caption>{block.caption}</caption>
            <thead>
              <tr>
                <td />
                {block.cols.map((c) => (
                  <th scope="col" key={c}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r) => (
                <tr key={r.k}>
                  <th scope="row">{r.k}</th>
                  {r.cells.map((c, i) => (
                    <td data-label={block.cols[i]} key={i}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "service":
      return (
        <p className="guide-service">
          {fill(block.text)} <Link href={localePath(locale, block.path)}>{block.label}</Link>
        </p>
      );
  }
}
