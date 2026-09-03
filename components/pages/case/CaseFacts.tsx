/**
 * The case study header block. Same fields, same order, every case page, so
 * two cases can be compared at a glance: client, sector, place, scale,
 * engagement, what we built, outcome, then the basis paragraph under it.
 *
 * Source: bunkers/cardon-digital/research/2026-09/case-naming.md section 6.1.
 * Two rules from that section are enforced by the caller, not here: a field
 * with no honest value is OMITTED rather than filled with a hedge, so the rows
 * are whatever the page can honestly state; and every number on the page has
 * to be accounted for in the basis paragraph (6.2), which is why the basis is
 * part of this block rather than an optional extra.
 *
 * One component for both pages on purpose. "Both case pages follow one
 * convention" is a claim that should be true of the code, not just the copy.
 */
export type CaseFact = { k: string; v: string };

export default function CaseFacts({
  aria,
  rows,
  basisK,
  basis,
}: {
  aria: string;
  rows: CaseFact[];
  basisK: string;
  basis: string;
}) {
  return (
    <section className="case-facts-band" aria-label={aria}>
      <div className="container">
        <dl className="case-facts">
          {rows.map((row, i) => (
            <div
              className={
                "case-fact" + (i === rows.length - 1 ? " case-fact-outcome" : "")
              }
              key={row.k}
            >
              <dt className="case-fact-k mono">{row.k}</dt>
              <dd className="case-fact-v">{row.v}</dd>
            </div>
          ))}
        </dl>
        <p className="case-basis">
          <span className="case-basis-k mono">{basisK}</span>
          <span className="case-basis-v">{basis}</span>
        </p>
      </div>
    </section>
  );
}
