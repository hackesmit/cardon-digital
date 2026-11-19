import type { Locale } from "@/lib/i18n/config";
import { home } from "@/lib/i18n/home";
import { CLIENT_MARKS, CLIENT_ORDER } from "./clientMarks";

/**
 * The client logo row under the proof cards: each client's own mark in its
 * own colours, with its name and trade under it. A plain row, no motion
 * (Daniel, 2026-10-23: the orbit felt like too much; show the logos the way
 * other sites do). No mark links anywhere: the two case pages went with the
 * wine brand (bead hq-3f6ut.3), and the Cardon home links that brand once.
 */
export default function ClientLogos({ locale }: { locale: Locale }) {
  const t = home[locale].vis.logos;
  return (
    <div className="logos" role="group" aria-label={t.aria}>
      <span className="logos-legend mono">{t.legend}</span>
      <ul className="logos-row">
        {CLIENT_ORDER.map((id) => {
          const c = t.clients[id];
          return (
            <li key={id}>
              <span className="logos-item">
                <span className={"orbit-med orbit-med-" + id}>{CLIENT_MARKS[id]}</span>
                <b>{c.name}</b>
                <span className="mono">{c.kind}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
