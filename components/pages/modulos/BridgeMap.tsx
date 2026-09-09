import type { Locale } from "@/lib/i18n/config";

/**
 * The three modules, the two real bridges between them, and the one pair
 * (Produccion-Hospitalidad) that only shares the system and the service base,
 * drawn once at the head of the combinations section. Decoration with labels:
 * the sentences beside it carry the meaning, so the whole figure is hidden
 * from assistive technology except for its title, and it holds its shape down
 * to 360 px because the viewBox scales rather than the text reflowing.
 *
 * Since bead hq-wrig5.13 the figure takes the set of modules currently picked
 * and lights itself accordingly: a node is lit when its module is picked, and
 * an edge is lit only when BOTH of the modules it joins are picked, which is
 * the bridge rule drawn rather than described. The picking lives in
 * ./CombinationPicker, which overlays the three hit targets on the nodes; this
 * file stays a pure drawing so it renders the same on the server as it does
 * after the first click.
 */

export const BRIDGE_NODES = {
  produccion: { x: 60, y: 58, labelY: 30 },
  hospitalidad: { x: 260, y: 58, labelY: 30 },
  restaurante: { x: 160, y: 164, labelY: 200 },
} as const;

export type BridgeModuleId = keyof typeof BRIDGE_NODES;

const label: Record<Locale, Record<BridgeModuleId, string> & { title: string }> = {
  es: {
    produccion: "Producción",
    hospitalidad: "Hospitalidad",
    restaurante: "Restaurante",
    title: "Los tres módulos: dos puentes, una base compartida",
  },
  en: {
    produccion: "Produccion",
    hospitalidad: "Hospitalidad",
    restaurante: "Restaurante",
    title: "The three modules: two bridges, one shared base",
  },
};

export function bridgeLabels(locale: Locale) {
  return label[locale];
}

/**
 * A set of modules as one small number: Produccion 1, Hospitalidad 2,
 * Restaurante 4, so any combination is the sum and the empty set is 0.
 *
 * It exists so the seven rows of the combinations list can stay rendered on the
 * server and still be marked by the client-side map beside them: the picker
 * puts the mask it currently has on the wrapper, every row carries its own
 * mask, and one CSS rule per combination matches the two. The alternative was
 * to pass all seven rows and their sentences into the browser to add one
 * attribute, which is prose shipped twice to draw a border.
 */
export function bridgeMask(ids: readonly string[]): number {
  const bit: Record<string, number> = {
    produccion: 1,
    hospitalidad: 2,
    restaurante: 4,
  };
  return ids.reduce((sum, id) => sum + (bit[id] ?? 0), 0);
}

export default function BridgeMap({
  locale,
  on = [],
}: {
  locale: Locale;
  /** The modules currently picked. Empty is a legitimate state: nothing lit. */
  on?: readonly string[];
}) {
  const l = label[locale];
  const lit = (id: BridgeModuleId) => (on.includes(id) ? "1" : undefined);
  const edge = (a: BridgeModuleId, b: BridgeModuleId) =>
    on.includes(a) && on.includes(b) ? "1" : undefined;

  return (
    <svg viewBox="0 0 320 214" className="bridge-svg" focusable="false" aria-hidden="true">
      <title>{l.title}</title>

      {/* Produccion-Hospitalidad: no bridge feature, only the shared system */}
      <line
        className="bg-edge-shared"
        data-on={edge("produccion", "hospitalidad")}
        x1="60"
        y1="58"
        x2="260"
        y2="58"
      />
      {/* the two real bridges, drawn under the nodes */}
      <line
        className="bg-edge"
        data-on={edge("produccion", "restaurante")}
        x1="60"
        y1="58"
        x2="160"
        y2="164"
      />
      <line
        className="bg-edge"
        data-on={edge("hospitalidad", "restaurante")}
        x1="260"
        y1="58"
        x2="160"
        y2="164"
      />

      {(Object.keys(BRIDGE_NODES) as BridgeModuleId[]).map((id) => {
        const node = BRIDGE_NODES[id];
        return (
          <g key={id}>
            <circle className="bg-node" data-module={id} data-on={lit(id)} cx={node.x} cy={node.y} r="13" />
            <text className="bg-label" data-on={lit(id)} x={node.x} y={node.labelY} textAnchor="middle">
              {l[id]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
