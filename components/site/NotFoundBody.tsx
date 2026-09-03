import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { site } from "@/lib/i18n/site";

/** The 404 copy, styled with the shared legal-page layout so it lands inside
 *  the site rather than on a bare Next default page. */
export default function NotFoundBody({ locale }: { locale: Locale }) {
  const t = site[locale].notFound;

  return (
    <main id="main" className="pg-legal">
      <div className="legal-wrap">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <p>
          <Link href={localePath(locale, "/")}>{t.home}</Link>
        </p>
      </div>
    </main>
  );
}
