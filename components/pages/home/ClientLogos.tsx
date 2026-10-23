import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n/config";
import { home } from "@/lib/i18n/home";
import { CLIENT_MARKS, CLIENT_ORDER, type ClientId } from "./clientMarks";

/* The two clients with a case page, as parallel arrays so app/routes.test.ts
   can read the paths (it audits every link call against the routes on disk). */
const CASE_IDS: ClientId[] = ["xanic", "enkanto"];
const CASE_ROUTES = ["/work/monte-xanic", "/work/enkanto"];

/**
 * The client logo row under the proof cards: each client's own mark in its
 * own colours, with its name and trade under it. A plain row, no motion
 * (Daniel, 2026-10-23: the orbit felt like too much; show the logos the way
 * other sites do). The two clients with a case page link to it.
 */
export default function ClientLogos({ locale }: { locale: Locale }) {
  const t = home[locale].vis.logos;
  const href = (path: string) => localePath(locale, path);
  return (
    <div className="logos" role="group" aria-label={t.aria}>
      <span className="logos-legend mono">{t.legend}</span>
      <ul className="logos-row">
        {CLIENT_ORDER.map((id) => {
          const c = t.clients[id];
          const i = CASE_IDS.indexOf(id);
          const route = i >= 0 ? CASE_ROUTES[i] : undefined;
          const body = (
            <>
              <span className={"orbit-med orbit-med-" + id}>{CLIENT_MARKS[id]}</span>
              <b>{c.name}</b>
              <span className="mono">{c.kind}</span>
            </>
          );
          return (
            <li key={id}>
              {route ? (
                <Link className="logos-item" href={href(route)}>
                  {body}
                </Link>
              ) : (
                <span className="logos-item">{body}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
