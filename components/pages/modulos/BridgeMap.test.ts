import { describe, expect, it } from "vitest";

import { bridgeMask } from "./BridgeMap";
import { modulos } from "../../../lib/i18n/modulos";

/**
 * bridgeMask is the only thing tying a server-rendered row's data-combo to the
 * client picker's data-on: the match is a pure CSS selector between two
 * numbers written in two places, with nothing else pinning it (reviewer N7,
 * bead hq-wrig5.13 round two). This does not re-render anything; it pins the
 * seven masks the combinations list actually ships so a future edit to
 * bridgeMask's bit assignment or to combina.items cannot silently break the
 * marking without a red test.
 */
describe.each(["en", "es"] as const)("%s combina.items bridge masks", (locale) => {
  const masks = modulos[locale].combina.items.map((item) => bridgeMask(item.modules));

  it("are the seven combinations, each mask 1 through 7 exactly once", () => {
    expect([...masks].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
