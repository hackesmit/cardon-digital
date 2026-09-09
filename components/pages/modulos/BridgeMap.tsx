import type { Locale } from "@/lib/i18n/config";

/**
 * The three modules, the two real bridges between them, and the one pair
 * (Produccion-Hospitalidad) that only shares the system and the service base,
 * drawn once at the head of the combinations section. Decoration with labels:
 * the sentences beside it carry the meaning, so the whole figure is hidden
 * from assistive technology except for its title, and it holds its shape down
 * to 360 px because the viewBox scales rather than the text reflowing.
 */

const label: Record<Locale, { p: string; h: string; r: string; title: string }> = {
  es: {
    p: "Producción",
    h: "Hospitalidad",
    r: "Restaurante",
    title: "Los tres módulos: dos puentes, una base compartida",
  },
  en: {
    p: "Produccion",
    h: "Hospitalidad",
    r: "Restaurante",
    title: "The three modules: two bridges, one shared base",
  },
};

export default function BridgeMap({ locale }: { locale: Locale }) {
  const l = label[locale];
  return (
    <figure className="bridge-map" aria-hidden="true">
      <svg viewBox="0 0 320 214" className="bridge-svg" focusable="false">
        <title>{l.title}</title>

        {/* Produccion-Hospitalidad: no bridge feature, only the shared system */}
        <line className="bg-edge-shared" x1="60" y1="58" x2="260" y2="58" />
        {/* the two real bridges, drawn under the nodes */}
        <line className="bg-edge" x1="60" y1="58" x2="160" y2="164" />
        <line className="bg-edge" x1="260" y1="58" x2="160" y2="164" />

        <circle className="bg-node" cx="60" cy="58" r="13" />
        <circle className="bg-node" cx="260" cy="58" r="13" />
        <circle className="bg-node bg-node-lit" cx="160" cy="164" r="13" />

        <text className="bg-label" x="60" y="30" textAnchor="middle">
          {l.p}
        </text>
        <text className="bg-label" x="260" y="30" textAnchor="middle">
          {l.h}
        </text>
        <text className="bg-label" x="160" y="200" textAnchor="middle">
          {l.r}
        </text>
      </svg>
    </figure>
  );
}
