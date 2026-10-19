import RouteLoading from "@/components/site/RouteLoading";

/**
 * The fallback Next shows while a route segment is still coming. Most of this
 * site is static and prefetched, so a navigation usually resolves before this
 * ever paints; /demo is request-time and a slow connection is a slow
 * connection, and those are the waits this covers.
 *
 * It never delays anything. The segment renders the moment it arrives, and the
 * mark is held back for the first part of a second so a fast navigation does
 * not flash a loader on its way through.
 */
export default function Loading() {
  return <RouteLoading />;
}
