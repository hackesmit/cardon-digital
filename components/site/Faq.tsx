import JsonLd from "@/components/site/JsonLd";
import { plain, rich } from "@/lib/i18n/rich";
import { faqPageLd, ldGraph, type FaqItem } from "@/lib/seo/jsonld";
import "./faq.css";

/**
 * A visible question list and its FAQPage JSON-LD, built from the same items
 * in the same render, so the markup can never say something the page does not
 * show. Every question and every answer is in the document and on screen: no
 * disclosure to open, nothing for a keyboard to reach but the links inside an
 * answer, and nothing an answer engine reads that a person cannot.
 *
 * Questions are plain text; answers take the rich() markers like any other
 * dictionary string, and the JSON-LD gets them flattened with plain().
 */
export default function Faq({
  title,
  items,
  id = "preguntas",
}: Readonly<{ title: string; items: readonly FaqItem[]; id?: string }>) {
  if (items.length === 0) return null;
  const headingId = id + "-title";
  return (
    <section className="faq" id={id} aria-labelledby={headingId}>
      <h2 id={headingId} className="faq-title">
        {plain(title)}
      </h2>
      <div className="faq-list">
        {items.map((it) => (
          <div className="faq-item" key={it.question}>
            <h3 className="faq-q">{plain(it.question)}</h3>
            <p className="faq-a">{rich(it.answer)}</p>
          </div>
        ))}
      </div>
      <JsonLd data={ldGraph([faqPageLd(items)])} />
    </section>
  );
}
