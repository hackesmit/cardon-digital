import { ldGraph, serializeLd, type LdGraph, type LdNode } from "@/lib/seo/jsonld";

/**
 * One schema.org script. The data goes through serializeLd, which escapes <, >
 * and &, so no string in it can close the tag or open a comment: copy that
 * quotes markup stays data. A bare node is wrapped in a graph first, because
 * only the graph carries @context and a script without one maps no schema.org
 * terms. Renders nothing visible.
 */
export default function JsonLd({ data }: Readonly<{ data: LdGraph | LdNode }>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeLd("@graph" in data ? data : ldGraph([data])) }}
    />
  );
}
