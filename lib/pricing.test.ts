import { describe, expect, it } from "vitest";

import {
  type AddOnId,
  type ModuleId,
  type ModuleSelection,
  type Size,
  absorbedProviderCash,
  addOnAvailable,
  addOnMonthly,
  annualPrepay,
  annualPrepayRate,
  bridgeFeatures,
  buildOnly,
  bumpOffBareMultiple,
  bundleHours,
  ceilTo,
  combinations,
  featureHours,
  featureSetup,
  formatPercent,
  formatPrice,
  growerBundleHours,
  growerSetupS,
  largestSize,
  legacyWineryBundles,
  legacyWinerySetupFloor,
  mixDiscountByRank,
  moduleFloors,
  moduleIds,
  modules,
  priced,
  quote,
  round100,
  round500,
  runCost,
  runCostHours,
  scopeFactor,
  serviceRate,
  setupRate,
  sharedBuildHours,
  sharedServiceBase,
  sharedServiceBaseBreakdown,
  sharedServiceBaseHours,
  sizes,
  usdFromMxn,
  wineryBundles,
  wineryPricingPlaceholder,
  winerySetupFloor,
  workedExamples,
} from "./pricing";
import {
  bridgesSentence,
  comboName,
  comboPricingClause,
  mixRankingSentence,
  mixRules,
  precios,
} from "./i18n/precios";

/**
 * Every expected figure below is transcribed by hand from
 * research/2026-09/pricing-modules.md at commit 9dfa3b8, the approved round
 * two. Nothing is imported from the module to build an expectation, so a
 * generator that computes a wrong number cannot also assert it.
 */

/* Hours transcribed independently of lib/pricing.ts, for the floor checks. */
const memoBaseHours: Record<Size, number> = { S: 6.48, M: 7.13, L: 8.13 };
const memoRunHours: Record<ModuleId, Record<Size, number>> = {
  produccion: { S: 1.28, M: 1.65, L: 2.05 },
  hospitalidad: { S: 1.85, M: 2.35, L: 2.85 },
  restaurante: { S: 2.4, M: 3.1, L: 3.85 },
};
const memoProviderCash: Record<Size, number> = { S: 1203, M: 1712, L: 2462 };
const memoAdminHours: Record<Size, number> = { S: 0.68, M: 0.75, L: 0.85 };

const allSizes: Size[] = ["S", "M", "L"];
const allAddOnIds: AddOnId[] = [
  "google-ads-management",
  "content",
  "on-site-visit",
];

/** Every subset of a list, empty set first, in the list's own order. */
function subsetsOf(items: AddOnId[]): AddOnId[][] {
  return items.reduce<AddOnId[][]>(
    (acc, item) => acc.concat(acc.map((set) => [...set, item])),
    [[]],
  );
}

/** Daniel time plus absorbed provider cash a mix commits us to each month. */
function serviceFloorMonthly(mix: ModuleId[], size: Size): number {
  const h =
    memoBaseHours[size] + mix.reduce((sum, m) => sum + memoRunHours[m][size], 0);
  return h * 1225 * scopeFactor[size] + memoProviderCash[size];
}

/** The same amount over a year, less the eleven collection cycles prepay removes. */
function serviceFloorPrepaidYear(mix: ModuleId[], size: Size): number {
  const collection = 11 * (memoAdminHours[size] / 2) * 1225 * scopeFactor[size];
  return 12 * serviceFloorMonthly(mix, size) - collection;
}

describe("rounding", () => {
  it("takes the nearest 500 on setup, an exact half going down", () => {
    expect(round500(29750)).toBe(29500);
    expect(round500(64750)).toBe(64500);
    expect(round500(33250)).toBe(33000);
    expect(round500(46710)).toBe(46500);
    expect(round500(158760)).toBe(159000);
    expect(round500(123525)).toBe(123500);
  });

  it("takes the nearest 100 on monthly, an exact half going down", () => {
    expect(round100(6125)).toBe(6100);
    expect(round100(1837.5)).toBe(1800);
    expect(round100(612.5)).toBe(600);
    expect(round100(884.5)).toBe(900);
    expect(round100(1250.875)).toBe(1300);
  });

  it("survives float noise on an exact half (5 x 2,700 x 1.5 is a tie)", () => {
    expect(round100(5 * 2700 * 1.5)).toBe(20200);
    expect(round500(87500 * 0.74)).toBe(64500);
    expect(round500(42500 * 0.7)).toBe(29500);
  });

  it("raises to the next 500 at or above the cost-recovery amount", () => {
    expect(ceilTo(46710, 500)).toBe(47000);
    expect(ceilTo(39771, 500)).toBe(40000);
    expect(ceilTo(30726, 500)).toBe(31000);
    expect(ceilTo(40000, 500)).toBe(40000);
  });

  it("converts USD from the rounded MXN at 17.0, nearest 10 or 5 by band", () => {
    expect(usdFromMxn(47000)).toBe(2760);
    expect(usdFromMxn(53000)).toBe(3120);
    expect(usdFromMxn(72500)).toBe(4260);
    expect(usdFromMxn(141500)).toBe(8320);
    expect(usdFromMxn(264000)).toBe(15530);
    // Below 100 USD the step is 5.
    expect(usdFromMxn(100)).toBe(5);
    expect(usdFromMxn(300)).toBe(20);
    expect(usdFromMxn(1600)).toBe(95);
    expect(usdFromMxn(1700)).toBe(100);
  });

  it("never lets a negative zero or a negative bump reach the page", () => {
    // A value under half a step rounds to zero, not to -0, so Intl cannot print
    // "$-0". round100(50) is the smallest such case (red-team hq-ggot1.6 f.5).
    expect(Object.is(round100(50), 0)).toBe(true);
    expect(Object.is(round500(200), 0)).toBe(true);
    expect(Object.is(usdFromMxn(0), 0)).toBe(true);
    expect(formatPrice("es", usdFromMxn(0))).not.toContain("-");
    expect(formatPrice("es", 0)).not.toContain("-");
    expect(formatPrice("en", round100(50))).not.toContain("-");
    // A downward bump on a bare multiple refuses to cross zero, so a zero-fee
    // line or concession cannot print a minus price. 0 stays 0, not -100.
    expect(bumpOffBareMultiple(0, 1000, 100, "down")).toBe(0);
    expect(bumpOffBareMultiple(100, 100, 100, "down")).toBe(0);
    // The legitimate downward bump the annual concession relies on is untouched.
    expect(bumpOffBareMultiple(11000, 1000, 100, "down")).toBe(10900);
  });
});

describe("module catalogues", () => {
  const bundleHourTable: [ModuleId, Size, number][] = [
    ["produccion", "S", 17.3],
    ["produccion", "M", 24.55],
    ["produccion", "L", 40.5],
    ["hospitalidad", "S", 19.6],
    ["hospitalidad", "M", 30.5],
    ["hospitalidad", "L", 38.1],
    ["restaurante", "S", 26.8],
    ["restaurante", "M", 39.2],
    ["restaurante", "L", 49.2],
  ];

  it.each(bundleHourTable)(
    "%s at %s is %d Daniel hours",
    (moduleId, size, hours) => {
      expect(bundleHours(moduleId, size)).toBe(hours);
    },
  );

  const catalogueTable: [ModuleId, string, Size, number, number][] = [
    ["produccion", "production-record", "S", 9700, 570],
    ["produccion", "production-record", "M", 20200, 1190],
    ["produccion", "production-record", "L", 33200, 1950],
    ["produccion", "extra-data-source-connector", "S", 3000, 180],
    ["produccion", "extra-data-source-connector", "M", 4500, 260],
    ["produccion", "the-assistant", "M", 15200, 890],
    ["produccion", "training-and-handover-pack", "L", 41000, 2410],
    ["hospitalidad", "unit-and-stay-record", "S", 7600, 450],
    ["hospitalidad", "channel-feed-connector", "S", 2700, 160],
    ["hospitalidad", "channel-manager-connector", "M", 9700, 570],
    ["hospitalidad", "google-ads-build", "L", 50100, 2950],
    ["restaurante", "menu-categories-and-modifiers", "S", 5900, 350],
    ["restaurante", "order-taking-on-the-phone", "M", 17000, 1000],
    ["restaurante", "payment-link-and-qr-connector", "M", 7700, 450],
    ["restaurante", "card-payment-reconciliation", "L", 7700, 450],
    ["restaurante", "training-and-handover-pack", "S", 18900, 1110],
  ];

  it.each(catalogueTable)(
    "%s %s at %s is %d MXN",
    (moduleId, featureId, size, mxn, usd) => {
      expect(featureSetup(moduleId, featureId, size)).toEqual({
        MXN: mxn,
        USD: usd,
      });
    },
  );

  it("marks a feature n/a where the memo does", () => {
    expect(featureSetup("produccion", "prediction-or-classification-model", "S"))
      .toBeNull();
    expect(featureSetup("restaurante", "station-split", "S")).toBeNull();
    expect(featureSetup("restaurante", "payment-link-and-qr-connector", "S"))
      .toBeNull();
    expect(featureSetup("restaurante", "card-payment-reconciliation", "M"))
      .toBeNull();
    expect(featureSetup("hospitalidad", "brochure-or-booking-site", "L"))
      .toBeNull();
  });

  it("keeps the two cross-module features out of every standard bundle", () => {
    for (const size of allSizes) {
      const hospitalidadBundle = moduleFloors.hospitalidad.bundle.map(
        (b) => b.feature,
      );
      expect(hospitalidadBundle).not.toContain("restaurant-bridge");
      const restauranteBundle = moduleFloors.restaurante.bundle.map(
        (b) => b.feature,
      );
      expect(restauranteBundle).not.toContain("wine-list-wired-to-the-cellar");
      expect(bundleHours("restaurante", size)).toBeGreaterThan(0);
    }
  });
});

describe("the shared service base and the run costs", () => {
  it("is 9,200 / 14,800 / 22,900 MXN, charged once whatever the mix", () => {
    expect(sharedServiceBase("S")).toBe(9200);
    expect(sharedServiceBase("M")).toBe(14800);
    expect(sharedServiceBase("L")).toBe(22900);
  });

  it("carries the measured provider cash as named lines", () => {
    const s = sharedServiceBaseBreakdown("S");
    expect(s.find((l) => l.id === "hosting-monitoring-and-backups")?.monthly)
      .toBe(900);
    // 441 MXN of cash, so the line reads 500 and not the 400 nearest-100 gives.
    expect(s.find((l) => l.id === "the-assistants-provider-account")?.monthly)
      .toBe(500);
    expect(s.find((l) => l.id === "weekly-call-and-whatsapp")?.monthly).toBe(6100);
    expect(absorbedProviderCash("S")).toBe(1203);
    expect(absorbedProviderCash("M")).toBe(1712);
    expect(absorbedProviderCash("L")).toBe(2462);
  });

  it("reproduces the plan's 7.76 service hours at S, base plus Produccion", () => {
    expect(sharedServiceBaseHours("S")).toBe(6.48);
    expect(runCostHours("produccion", "S")).toBe(1.28);
    expect(sharedServiceBaseHours("S") + runCostHours("produccion", "S")).toBeCloseTo(
      7.76,
      10,
    );
  });

  const runCostTable: [ModuleId, Size, number][] = [
    ["produccion", "S", 1600],
    ["produccion", "M", 3100],
    ["produccion", "L", 5200],
    ["hospitalidad", "S", 2300],
    ["hospitalidad", "M", 4300],
    ["hospitalidad", "L", 7200],
    ["restaurante", "S", 2900],
    ["restaurante", "M", 5700],
    ["restaurante", "L", 9800],
  ];

  it.each(runCostTable)("%s run cost at %s is %d MXN", (moduleId, size, mxn) => {
    expect(runCost(moduleId, size)).toBe(mxn);
  });
});

describe("add-ons", () => {
  it("prices the three add-on lines as the memo does", () => {
    expect(addOnMonthly("google-ads-management", "S")).toBeNull();
    expect(addOnMonthly("google-ads-management", "M")).toBe(5500);
    expect(addOnMonthly("google-ads-management", "L")).toBe(8800);
    expect(addOnMonthly("content", "S")).toBe(1800);
    expect(addOnMonthly("content", "M")).toBe(3300);
    // 5,022.5 rounds to a bare 5,000, so the quote line takes its increment.
    expect(addOnMonthly("content", "L")).toBe(5100);
    expect(addOnMonthly("on-site-visit", "S")).toBeNull();
    expect(addOnMonthly("on-site-visit", "M")).toBe(1100);
    expect(addOnMonthly("on-site-visit", "L")).toBe(5500);
  });

  it("never attaches ads or content to Produccion (decision 8)", () => {
    expect(addOnAvailable("google-ads-management", ["produccion"], "M")).toBe(false);
    expect(addOnAvailable("content", ["produccion"], "S")).toBe(false);
    expect(addOnAvailable("content", ["hospitalidad"], "S")).toBe(true);
    expect(addOnAvailable("google-ads-management", ["restaurante"], "S")).toBe(false);
    expect(addOnAvailable("google-ads-management", ["restaurante"], "M")).toBe(true);
    // The visit is per client, not per module.
    expect(addOnAvailable("on-site-visit", ["produccion"], "M")).toBe(true);
    expect(() => quote(["produccion"], "M", ["google-ads-management"])).toThrow();
  });

  it("adds a chosen add-on into the quoted monthly", () => {
    const q = quote(["restaurante"], "M", ["google-ads-management"]);
    // 14,800 + 5,700 + 5,500 is a bare 26,000, so the total takes its increment.
    expect(q.addOns).toEqual([
      { id: "google-ads-management", size: "M", monthly: 5500 },
    ]);
    expect(q.monthlyBumped).toBe(true);
    expect(q.monthly.MXN).toBe(26100);
  });
});

describe("build-only prices", () => {
  const table: [ModuleId, Size, number][] = [
    ["produccion", "S", 47000],
    ["produccion", "M", 99500],
    ["produccion", "L", 224000],
    ["hospitalidad", "S", 53000],
    ["hospitalidad", "M", 123500],
    ["hospitalidad", "L", 211000],
    ["restaurante", "S", 72500],
    ["restaurante", "M", 159000],
    ["restaurante", "L", 272500],
  ];

  it.each(table)("%s at %s is %d MXN", (moduleId, size, mxn) => {
    expect(buildOnly(moduleId, size)).toBe(mxn);
  });

  it("raises off the rounded figure when it lands under cost recovery", () => {
    // 17.3 h x 2,700 = 46,710; the nearest 500 is 46,500, which is under it.
    expect(round500(17.3 * setupRate)).toBe(46500);
    expect(buildOnly("produccion", "S")).toBe(47000);
  });
});

describe("the three module floors", () => {
  const table: [ModuleId, number, number, number, number, number][] = [
    ["produccion", 17.3, 46710, 47000, 2760, 10800],
    ["hospitalidad", 19.6, 52920, 53000, 3120, 11500],
    ["restaurante", 26.8, 72360, 72500, 4260, 12100],
  ];

  it.each(table)(
    "%s: %d h, cost recovery %d, floor %d MXN",
    (moduleId, hours, costRecovery, setup, setupUsd, monthly) => {
      const floor = moduleFloors[moduleId];
      expect(floor.hours).toBe(hours);
      expect(floor.costRecovery).toBe(costRecovery);
      expect(floor.setup.MXN).toBe(setup);
      expect(floor.setup.USD).toBe(setupUsd);
      expect(floor.monthly.MXN).toBe(monthly);
      expect(floor.basis).toBe("standalone");
    },
  );

  it("is the build-only price at S, so nothing is owed on early exit", () => {
    for (const moduleId of moduleIds) {
      expect(moduleFloors[moduleId].setup.MXN).toBe(buildOnly(moduleId, "S"));
      expect(quote([moduleId], "S").lines[0].boundBy).toBe("cost-recovery");
    }
  });
});

describe("the 24 recomputation lines of memo 6.4 and 6.6", () => {
  type LineCase = {
    mix: ModuleId[];
    size: Size;
    module: ModuleId;
    buildOnly: number;
    mixDiscount: number;
    mixed: number;
    hoursBuilt: number;
    costRecovery: number;
    packagedSetup: number;
    boundBy: "cost-recovery" | "service-funded-concession";
  };

  const cases: LineCase[] = [
    // S, first module at full price: the cap binds on all three.
    { mix: ["produccion"], size: "S", module: "produccion", buildOnly: 47000, mixDiscount: 0, mixed: 47000, hoursBuilt: 17.3, costRecovery: 46710, packagedSetup: 47000, boundBy: "cost-recovery" },
    { mix: ["hospitalidad"], size: "S", module: "hospitalidad", buildOnly: 53000, mixDiscount: 0, mixed: 53000, hoursBuilt: 19.6, costRecovery: 52920, packagedSetup: 53000, boundBy: "cost-recovery" },
    { mix: ["restaurante"], size: "S", module: "restaurante", buildOnly: 72500, mixDiscount: 0, mixed: 72500, hoursBuilt: 26.8, costRecovery: 72360, packagedSetup: 72500, boundBy: "cost-recovery" },
    // S, added modules: a smaller build, bound by cost recovery on hours built.
    { mix: ["produccion", "hospitalidad"], size: "S", module: "produccion", buildOnly: 47000, mixDiscount: 0.1, mixed: 42500, hoursBuilt: 11.38, costRecovery: 30726, packagedSetup: 31000, boundBy: "cost-recovery" },
    { mix: ["produccion", "restaurante"], size: "S", module: "produccion", buildOnly: 47000, mixDiscount: 0.1, mixed: 42500, hoursBuilt: 11.38, costRecovery: 30726, packagedSetup: 31000, boundBy: "cost-recovery" },
    { mix: ["hospitalidad", "restaurante"], size: "S", module: "hospitalidad", buildOnly: 53000, mixDiscount: 0.1, mixed: 47500, hoursBuilt: 14.73, costRecovery: 39771, packagedSetup: 40000, boundBy: "cost-recovery" },
    { mix: ["produccion", "hospitalidad", "restaurante"], size: "S", module: "hospitalidad", buildOnly: 53000, mixDiscount: 0.1, mixed: 47500, hoursBuilt: 14.73, costRecovery: 39771, packagedSetup: 40000, boundBy: "cost-recovery" },
    { mix: ["produccion", "hospitalidad", "restaurante"], size: "S", module: "produccion", buildOnly: 47000, mixDiscount: 0.12, mixed: 41500, hoursBuilt: 10.15, costRecovery: 27405, packagedSetup: 29000, boundBy: "service-funded-concession" },
    // M, first module: the concession survives because there is a premium.
    { mix: ["produccion"], size: "M", module: "produccion", buildOnly: 99500, mixDiscount: 0, mixed: 99500, hoursBuilt: 24.55, costRecovery: 66285, packagedSetup: 73500, boundBy: "service-funded-concession" },
    { mix: ["hospitalidad"], size: "M", module: "hospitalidad", buildOnly: 123500, mixDiscount: 0, mixed: 123500, hoursBuilt: 30.5, costRecovery: 82350, packagedSetup: 91500, boundBy: "service-funded-concession" },
    { mix: ["restaurante"], size: "M", module: "restaurante", buildOnly: 159000, mixDiscount: 0, mixed: 159000, hoursBuilt: 39.2, costRecovery: 105840, packagedSetup: 117500, boundBy: "service-funded-concession" },
    { mix: ["produccion", "hospitalidad"], size: "M", module: "produccion", buildOnly: 99500, mixDiscount: 0.1, mixed: 89500, hoursBuilt: 17.73, costRecovery: 47871, packagedSetup: 66000, boundBy: "service-funded-concession" },
    { mix: ["produccion", "restaurante"], size: "M", module: "produccion", buildOnly: 99500, mixDiscount: 0.1, mixed: 89500, hoursBuilt: 17.73, costRecovery: 47871, packagedSetup: 66000, boundBy: "service-funded-concession" },
    { mix: ["hospitalidad", "restaurante"], size: "M", module: "hospitalidad", buildOnly: 123500, mixDiscount: 0.1, mixed: 111000, hoursBuilt: 24.9, costRecovery: 67230, packagedSetup: 82000, boundBy: "service-funded-concession" },
    { mix: ["produccion", "hospitalidad", "restaurante"], size: "M", module: "hospitalidad", buildOnly: 123500, mixDiscount: 0.1, mixed: 111000, hoursBuilt: 24.9, costRecovery: 67230, packagedSetup: 82000, boundBy: "service-funded-concession" },
    { mix: ["produccion", "hospitalidad", "restaurante"], size: "M", module: "produccion", buildOnly: 99500, mixDiscount: 0.12, mixed: 87500, hoursBuilt: 16.265, costRecovery: 43915.5, packagedSetup: 64500, boundBy: "service-funded-concession" },
  ];

  it.each(cases)(
    "$size $module inside [$mix] packages at $packagedSetup",
    (c) => {
      const line = quote(c.mix, c.size).lines.find((l) => l.module === c.module);
      expect(line).toBeDefined();
      expect(line!.buildOnly).toBe(c.buildOnly);
      expect(line!.mixDiscount).toBeCloseTo(c.mixDiscount, 10);
      expect(line!.mixed).toBe(c.mixed);
      expect(line!.hoursBuilt).toBe(c.hoursBuilt);
      expect(line!.costRecovery).toBe(c.costRecovery);
      expect(line!.packagedSetup).toBe(c.packagedSetup);
      expect(line!.boundBy).toBe(c.boundBy);
    },
  );

  it("ranks by build-only price, most expensive first", () => {
    expect(quote(["produccion", "hospitalidad", "restaurante"], "S").modules)
      .toEqual(["restaurante", "hospitalidad", "produccion"]);
    expect(quote(["produccion", "hospitalidad", "restaurante"], "M").modules)
      .toEqual(["restaurante", "hospitalidad", "produccion"]);
    // At L Hospitalidad's standard bundle is the smallest, so the order changes.
    expect(quote(["produccion", "hospitalidad", "restaurante"], "L").modules)
      .toEqual(["restaurante", "produccion", "hospitalidad"]);
  });

  it("reproduces the modelled overlap table of memo 6.2", () => {
    const overlap: [ModuleId, Size, number, number][] = [
      ["produccion", "S", 5.92, 7.15],
      ["produccion", "M", 6.82, 8.285],
      ["hospitalidad", "S", 4.87, 5.88],
      ["hospitalidad", "M", 5.6, 6.8],
      ["restaurante", "S", 5.33, 6.41],
      ["restaurante", "M", 6, 7.25],
    ];
    for (const [moduleId, size, second, third] of overlap) {
      expect(sharedBuildHours(moduleId, size, 2)).toBeCloseTo(second, 3);
      expect(sharedBuildHours(moduleId, size, 3)).toBeCloseTo(third, 3);
    }
  });
});

describe("the seven combinations at S and at M", () => {
  type Row = {
    size: Size;
    mix: ModuleId[];
    setup: number;
    setupUsd: number;
    monthly: number;
    monthlyUsd: number;
    setupAlone: number;
    monthlyAlone: number;
    yearOne: number;
    yearOneAlone: number;
  };

  const rows: Row[] = [
    // Memo 6.3.
    { size: "S", mix: ["produccion"], setup: 47000, setupUsd: 2760, monthly: 10800, monthlyUsd: 640, setupAlone: 47000, monthlyAlone: 10800, yearOne: 176600, yearOneAlone: 176600 },
    { size: "S", mix: ["hospitalidad"], setup: 53000, setupUsd: 3120, monthly: 11500, monthlyUsd: 680, setupAlone: 53000, monthlyAlone: 11500, yearOne: 191000, yearOneAlone: 191000 },
    { size: "S", mix: ["restaurante"], setup: 72500, setupUsd: 4260, monthly: 12100, monthlyUsd: 710, setupAlone: 72500, monthlyAlone: 12100, yearOne: 217700, yearOneAlone: 217700 },
    { size: "S", mix: ["produccion", "hospitalidad"], setup: 84000, setupUsd: 4940, monthly: 13100, monthlyUsd: 770, setupAlone: 100000, monthlyAlone: 22300, yearOne: 241200, yearOneAlone: 367600 },
    { size: "S", mix: ["produccion", "restaurante"], setup: 103500, setupUsd: 6090, monthly: 13700, monthlyUsd: 810, setupAlone: 119500, monthlyAlone: 22900, yearOne: 267900, yearOneAlone: 394300 },
    { size: "S", mix: ["hospitalidad", "restaurante"], setup: 112500, setupUsd: 6620, monthly: 14400, monthlyUsd: 850, setupAlone: 125500, monthlyAlone: 23600, yearOne: 285300, yearOneAlone: 408700 },
    { size: "S", mix: ["produccion", "hospitalidad", "restaurante"], setup: 141500, setupUsd: 8320, monthly: 16100, monthlyUsd: 950, setupAlone: 172500, monthlyAlone: 34400, yearOne: 334700, yearOneAlone: 585300 },
    // Memo 6.5.
    { size: "M", mix: ["produccion"], setup: 73500, setupUsd: 4320, monthly: 17900, monthlyUsd: 1050, setupAlone: 73500, monthlyAlone: 17900, yearOne: 288300, yearOneAlone: 288300 },
    { size: "M", mix: ["hospitalidad"], setup: 91500, setupUsd: 5380, monthly: 19100, monthlyUsd: 1120, setupAlone: 91500, monthlyAlone: 19100, yearOne: 320700, yearOneAlone: 320700 },
    { size: "M", mix: ["restaurante"], setup: 117500, setupUsd: 6910, monthly: 20500, monthlyUsd: 1210, setupAlone: 117500, monthlyAlone: 20500, yearOne: 363500, yearOneAlone: 363500 },
    { size: "M", mix: ["produccion", "hospitalidad"], setup: 157500, setupUsd: 9260, monthly: 22200, monthlyUsd: 1310, setupAlone: 165000, monthlyAlone: 37000, yearOne: 423900, yearOneAlone: 609000 },
    { size: "M", mix: ["produccion", "restaurante"], setup: 183500, setupUsd: 10790, monthly: 23600, monthlyUsd: 1390, setupAlone: 191000, monthlyAlone: 38400, yearOne: 466700, yearOneAlone: 651800 },
    { size: "M", mix: ["hospitalidad", "restaurante"], setup: 199500, setupUsd: 11740, monthly: 24800, monthlyUsd: 1460, setupAlone: 209000, monthlyAlone: 39600, yearOne: 497100, yearOneAlone: 684200 },
    { size: "M", mix: ["produccion", "hospitalidad", "restaurante"], setup: 264000, setupUsd: 15530, monthly: 27900, monthlyUsd: 1640, setupAlone: 282500, monthlyAlone: 57500, yearOne: 598800, yearOneAlone: 972500 },
  ];

  it("publishes fourteen worked examples, the seven combinations twice", () => {
    expect(workedExamples).toHaveLength(14);
    expect(combinations).toHaveLength(7);
  });

  it.each(rows)("$size $mix quotes $setup and $monthly", (row) => {
    const example = workedExamples.find(
      (e) =>
        e.size === row.size &&
        e.quote.lines.length === row.mix.length &&
        row.mix.every((m) => e.modules.includes(m)),
    );
    expect(example).toBeDefined();
    expect(example!.quote.setup).toEqual({ MXN: row.setup, USD: row.setupUsd });
    expect(example!.quote.monthly).toEqual({
      MXN: row.monthly,
      USD: row.monthlyUsd,
    });
    expect(example!.setupIfAlone.MXN).toBe(row.setupAlone);
    expect(example!.monthlyIfAlone.MXN).toBe(row.monthlyAlone);
    expect(example!.yearOneTogether.MXN).toBe(row.yearOne);
    expect(example!.yearOneAlone.MXN).toBe(row.yearOneAlone);
  });

  it("puts the extra 100 on the monthly only where the total is bare", () => {
    // 9,200 + 1,600 + 2,300 + 2,900 = 16,000, a bare multiple of 1,000.
    const all = quote(["produccion", "hospitalidad", "restaurante"], "S");
    expect(all.monthlyBumped).toBe(true);
    expect(all.monthly.MXN).toBe(16100);
    expect(quote(["produccion", "hospitalidad"], "S").monthlyBumped).toBe(false);
  });

  it("publishes the seven S combinations memo 8.1 allows, and nothing above S", () => {
    const publishable = workedExamples.filter((e) => e.publishable);
    expect(publishable.map((e) => e.id).sort()).toEqual([
      "s-hospitalidad",
      "s-hospitalidad-restaurante",
      "s-produccion",
      "s-produccion-hospitalidad",
      "s-produccion-hospitalidad-restaurante",
      "s-produccion-restaurante",
      "s-restaurante",
    ]);
    // 8.2's constraint is on the size and not on the count: examples vary the
    // mix, never the size, so no reader can rebuild a row of the S/M/L table.
    expect(publishable).toHaveLength(combinations.length);
    expect(publishable.every((e) => e.size === "S")).toBe(true);
    expect(workedExamples.filter((e) => e.size !== "S").every((e) => !e.publishable))
      .toBe(true);
  });

  it("the bought-separately row equals the sum of the entry cards in BOTH currencies", () => {
    // The /precios mix table calls its "alone" figures the sum of the three
    // entry cards above it ("the three lists above"). MixExample reads the
    // bought-separately row from setupIfAlone/monthlyIfAlone and each card from
    // the single-module quote, so the two must reconcile per currency, not only
    // in the priced MXN. Before hq-ggot1.13 the /en row converted the MXN sum
    // once (10,150 USD setup) while the cards each converted their own figure
    // (2,760 + 3,120 + 4,260 = 10,140), so the printed page did not add up.
    const combined = workedExamples.find(
      (e) => e.id === "s-produccion-hospitalidad-restaurante",
    )!;
    const cards = ["produccion", "hospitalidad", "restaurante"].map(
      (m) => workedExamples.find((e) => e.id === `s-${m}`)!,
    );
    for (const currency of ["MXN", "USD"] as const) {
      const setupCards = cards.reduce((s, c) => s + c.quote.setup[currency], 0);
      const monthlyCards = cards.reduce(
        (s, c) => s + c.quote.monthly[currency],
        0,
      );
      expect(combined.setupIfAlone[currency]).toBe(setupCards);
      expect(combined.monthlyIfAlone[currency]).toBe(monthlyCards);
    }
    // The regression this locks: the USD row now matches the USD cards.
    expect(combined.setupIfAlone.USD).toBe(10140);
    expect(combined.monthlyIfAlone.USD).toBe(2030);
    // ...while the priced MXN sum is untouched, so the ES page is unchanged.
    expect(combined.setupIfAlone.MXN).toBe(172500);
    expect(combined.monthlyIfAlone.MXN).toBe(34400);
  });
});

describe("the mix example's ranking sentence tracks the quote, not the dict", () => {
  const publishable = workedExamples.find(
    (e) => e.publishable && e.modules.length === 3,
  )!;

  // The exact prose the page rendered before hq-ggot1.14, now composed from
  // the quote's own module order instead of typed into lib/i18n/precios.ts.
  const expected = {
    en: "All three modules, each at its entry size. The complete build is the three lists above, ranked by build price: Restaurante at full price, Hospitalidad second, Produccion third.",
    es: "Los tres módulos, cada uno en su tamaño de entrada. La construcción completa son las tres listas de arriba, ordenadas por tamaño de obra: Restaurante a precio completo, Hospitalidad en segundo lugar, Producción en tercero.",
  } as const;

  it.each(["en", "es"] as const)(
    "%s reads exactly as before, built from example.modules",
    (locale) => {
      expect(mixRankingSentence(locale, publishable.modules)).toBe(
        expected[locale],
      );
    },
  );

  it.each(["en", "es"] as const)(
    "%s names the modules in the same order quote() ranks them",
    (locale) => {
      const sentence = mixRankingSentence(locale, publishable.modules);
      const names = publishable.modules.map(
        (id) => precios[locale].floors.modules[id].name,
      );
      // The names appear in build-price order, most expensive first.
      const positions = names.map((n) => sentence.indexOf(n));
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
      expect(positions.every((p) => p >= 0)).toBe(true);
      // And the ranking, not just the names, is derived: reorder the ids and
      // the sentence follows, which a hardcoded string could not do. This is
      // the perturbation the red team demonstrated (raising production-record
      // hours flips restaurante > produccion > hospitalidad); the prose now
      // moves with it instead of shipping a wrong sentence beside a right table.
      const flipped = mixRankingSentence(locale, [
        "produccion",
        "restaurante",
        "hospitalidad",
      ]);
      const prod = precios[locale].floors.modules.produccion.name;
      const rest = precios[locale].floors.modules.restaurante.name;
      expect(flipped.indexOf(prod)).toBeLessThan(flipped.indexOf(rest));
    },
  );

  it("keeps the ranking out of the dictionary entirely", () => {
    for (const locale of ["en", "es"] as const) {
      const lead = precios[locale].mix.exampleLead;
      for (const id of ["produccion", "hospitalidad", "restaurante"] as const) {
        expect(lead).not.toContain(precios[locale].floors.modules[id].name);
      }
      // The dict no longer carries a "Producción" spelled with its accent.
      expect(lead).not.toContain("Producción");
    }
  });
});

describe("paying a year up front", () => {
  const table: [Size, ModuleId[], number, number, number, number][] = [
    ["S", ["produccion"], 10800, 129600, 4400, 125200],
    ["S", ["hospitalidad"], 11500, 138000, 4400, 133600],
    ["S", ["restaurante"], 12100, 145200, 4400, 140800],
    ["S", ["produccion", "hospitalidad", "restaurante"], 16100, 193200, 4400, 188800],
    ["M", ["produccion"], 17900, 214800, 7100, 207700],
    ["M", ["hospitalidad"], 19100, 229200, 7100, 222100],
    ["M", ["restaurante"], 20500, 246000, 7100, 238900],
    ["M", ["produccion", "hospitalidad", "restaurante"], 27900, 334800, 7100, 327700],
  ];

  it.each(table)(
    "%s %s: %d a month prepays at %d",
    (size, mix, monthly, twelve, concession, paid) => {
      const q = quote(mix, size);
      expect(q.monthly.MXN).toBe(monthly);
      const prepay = annualPrepay(size, q.monthly.MXN);
      expect(prepay.twelveMonths).toBe(twelve);
      expect(prepay.concession.MXN).toBe(concession);
      expect(prepay.paid.MXN).toBe(paid);
    },
  );

  it("is the same concession whatever the mix, except where the paid year lands bare", () => {
    // Memo 7.1: 4,400 at S, 7,100 at M, 10,900 at L, whatever the mix and
    // whatever the add-ons, with the two rounding exceptions below. Produccion
    // plus Restaurante at S is one of them, so it is asserted apart rather than
    // allowed to widen the set the other six share (bead hq-ggot1.9).
    const bumped: ModuleId[] = ["produccion", "restaurante"];
    const isBumped = (mix: ModuleId[]) =>
      mix.length === bumped.length && bumped.every((m) => mix.includes(m));
    const flat: Record<Size, number> = { S: 4400, M: 7100, L: 10900 };
    for (const size of allSizes) {
      const concessions = combinations
        .filter((mix) => !(size === "S" && isBumped(mix)))
        .map(
          (mix) => annualPrepay(size, quote(mix, size).monthly.MXN).concession.MXN,
        );
      expect(new Set(concessions)).toEqual(new Set([flat[size]]));
    }
    const exception = annualPrepay("S", quote(bumped, "S").monthly.MXN);
    expect(exception.concession.MXN).toBe(4300);
    // At M and L the same mix is unexceptional, which is the arithmetic 7.1
    // writes out: 7,100 and 10,900 are not multiples of gcd(1,200, 10,000).
    expect(annualPrepay("M", quote(bumped, "M").monthly.MXN).concession.MXN).toBe(7100);
    expect(annualPrepay("L", quote(bumped, "L").monthly.MXN).concession.MXN).toBe(10900);
    // 4 percent of the L base year is 10,992, which rounds to a bare 11,000,
    // and a concession on a bare multiple moves down, towards the floor.
    expect(annualPrepay("L", 28100).concession.MXN).toBe(10900);
  });

  it("(6) is 4 percent of twelve months of the shared base, and of nothing else", () => {
    // The rate and its basis live here and are pinned here. Memo 8.1 keeps both
    // off every public surface: the annual rule is publishable as policy, "not
    // the percentage, and not the arithmetic behind it" (Daniel, console
    // r-576f5fc0, on Lucy's sixth finding of 2026-09-08).
    expect(annualPrepayRate).toBe(0.04);
    for (const size of allSizes) {
      const fromRule = bumpOffBareMultiple(
        round100(sharedServiceBase(size) * 12 * annualPrepayRate),
        1000,
        100,
        "down",
      );
      const alone = annualPrepay(size, quote(["produccion"], size).monthly.MXN);
      expect(alone.concession.MXN).toBe(fromRule);
      // Never a share of the whole fee: three modules still make one invoice.
      const three = annualPrepay(
        size,
        quote(["produccion", "hospitalidad", "restaurante"], size).monthly.MXN,
      );
      expect(three.concession.MXN).toBe(fromRule);
      expect(three.paid.MXN).toBe(three.twelveMonths - fromRule);
    }
  });

  it.each(["en", "es"] as const)(
    "(6) keeps the rate and its arithmetic out of the %s copy",
    (locale) => {
      const annual = precios[locale].annual;
      expect(`${annual.kicker} ${annual.title} ${annual.body}`).not.toMatch(/\d/);
    },
  );

  it("moves the paid year off a bare multiple of 10,000, onto the concession line", () => {
    // The two cases memo 7.1 names, transcribed from the memo rather than read
    // back out of the module that has to produce them.
    const first = quote(["produccion", "restaurante"], "S");
    expect(first.monthly.MXN).toBe(13700);
    const a = annualPrepay("S", first.monthly.MXN);
    expect(a.twelveMonths).toBe(164400);
    expect(a.concession.MXN).toBe(4300);
    expect(a.paid.MXN).toBe(160100);

    const second = quote(["hospitalidad", "restaurante"], "S", ["content"]);
    expect(second.monthly.MXN).toBe(16200);
    const b = annualPrepay("S", second.monthly.MXN);
    expect(b.twelveMonths).toBe(194400);
    expect(b.concession.MXN).toBe(4300);
    expect(b.paid.MXN).toBe(190100);

    // Before Content is bought the same mix is unexceptional, which is why the
    // census has to run over add-on subsets and not over the seven mixes.
    const plain = quote(["hospitalidad", "restaurante"], "S");
    expect(plain.monthly.MXN).toBe(14400);
    const c = annualPrepay("S", plain.monthly.MXN);
    expect(c.concession.MXN).toBe(4400);
    expect(c.paid.MXN).toBe(168400);

    // The quote still adds up: paid is twelve months less the concession.
    for (const prepay of [a, b, c]) {
      expect(prepay.paid.MXN).toBe(prepay.twelveMonths - prepay.concession.MXN);
    }
  });

  it("bites exactly twice across the 113 quotable configurations, both at S", () => {
    // Memo section 1 puts add-ons inside the monthly and 7.1 prepays twelve
    // months of that monthly, so the census is mix x size x available add-on
    // subset and not the twenty-one module combinations (bead hq-ggot1.9).
    const bumps: string[] = [];
    let configurations = 0;
    for (const size of allSizes) {
      for (const mix of combinations) {
        const available = allAddOnIds.filter((id) => addOnAvailable(id, mix, size));
        for (const chosen of subsetsOf(available)) {
          configurations += 1;
          const q = quote(mix, size, chosen);
          const prepay = annualPrepay(size, q.monthly.MXN);
          // What the rule forbids, checked on the figure the client is quoted.
          expect(prepay.paid.MXN % 10000).not.toBe(0);
          // Invariant E in the same sentence: nor may the concession land bare.
          expect(prepay.concession.MXN % 1000).not.toBe(0);
          expect(prepay.paid.MXN).toBe(prepay.twelveMonths - prepay.concession.MXN);
          if (prepay.concession.MXN !== 4400 && size === "S") {
            bumps.push(`${size} ${mix.join("+")} ${chosen.join("+")}`);
          }
          if (size !== "S") {
            expect(prepay.concession.MXN).toBe(size === "M" ? 7100 : 10900);
          }
        }
      }
    }
    expect(configurations).toBe(113);
    expect(bumps).toEqual([
      "S produccion+restaurante ",
      "S hospitalidad+restaurante content",
    ]);
  });
});

describe("the invariants of memo 6.7", () => {
  const everyQuote = allSizes.flatMap((size) =>
    combinations.map((mix) => ({ size, mix, q: quote(mix, size) })),
  );

  it("A. every packaged line clears the cost recovery for the hours it buys", () => {
    for (const { q } of everyQuote) {
      for (const line of q.lines) {
        expect(line.packagedSetup).toBeGreaterThanOrEqual(line.costRecovery);
        expect(line.hoursBuilt * setupRate).toBeCloseTo(line.costRecovery, 6);
      }
    }
  });

  it("B. every quoted monthly clears its service floor within one increment", () => {
    for (const { size, mix, q } of everyQuote) {
      expect(q.monthly.MXN).toBeGreaterThanOrEqual(
        serviceFloorMonthly(mix, size) - 100,
      );
    }
  });

  it("B. the largest rounding shortfall anywhere is Hospitalidad at M", () => {
    const shortfalls = everyQuote
      .map(({ size, mix, q }) => ({
        size,
        mix,
        gap: serviceFloorMonthly(mix, size) - q.monthly.MXN,
      }))
      .sort((a, b) => b.gap - a.gap);
    expect(shortfalls[0].size).toBe("M");
    expect(shortfalls[0].mix).toEqual(["hospitalidad"]);
    expect(shortfalls[0].gap).toBeLessThan(32);
    expect(shortfalls[0].gap / 19100).toBeLessThan(0.0017);
  });

  it("C. every prepaid year clears the floor recomputed on the reduced hours", () => {
    for (const { size, mix, q } of everyQuote) {
      const prepay = annualPrepay(size, q.monthly.MXN);
      expect(prepay.paid.MXN).toBeGreaterThanOrEqual(
        serviceFloorPrepaidYear(mix, size),
      );
    }
  });

  it("D. the mix pass-through stays strictly inside the modelled overlap", () => {
    const heldBack: { moduleId: ModuleId; size: Size; rank: 2 | 3; held: number }[] =
      [];
    for (const size of allSizes) {
      for (const moduleId of moduleIds) {
        const bundle = bundleHours(moduleId, size);
        for (const [rank, passed] of [
          [2, 0.1],
          [3, 0.12],
        ] as [2 | 3, number][]) {
          const overlap = sharedBuildHours(moduleId, size, rank) / bundle;
          expect(overlap).toBeGreaterThan(passed);
          heldBack.push({ moduleId, size, rank, held: (overlap - passed) / overlap });
        }
      }
    }
    // A third of the estimate is held back everywhere, and the narrowest margin
    // in the whole model is Restaurante as a second module at L.
    heldBack.sort((a, b) => a.held - b.held);
    expect(heldBack[0].moduleId).toBe("restaurante");
    expect(heldBack[0].size).toBe("L");
    expect(heldBack[0].rank).toBe(2);
    expect(heldBack[0].held).toBeGreaterThan(0.26);
  });

  it("E. no quoted figure ends in 9, 99 or 999, or sits on a bare multiple", () => {
    for (const { size, q } of everyQuote) {
      const monthlyLines = [
        q.sharedServiceBase,
        ...q.runCosts.map((r) => r.monthly),
      ];
      for (const value of [q.monthly.MXN, ...monthlyLines]) {
        expect(value % 10).not.toBe(9);
        expect(value % 100).not.toBe(99);
        expect(value % 1000).not.toBe(999);
        expect(value % 1000).not.toBe(0);
      }
      expect(q.setup.MXN % 10).not.toBe(9);
      expect(q.setup.MXN % 10000).not.toBe(0);
      expect(annualPrepay(size, q.monthly.MXN).concession.MXN % 1000).not.toBe(0);
    }
  });

  it("E. every USD figure is a conversion of the rounded MXN at 17.0", () => {
    for (const { q } of everyQuote) {
      expect(q.setup.USD).toBe(usdFromMxn(q.setup.MXN));
      expect(q.monthly.USD).toBe(usdFromMxn(q.monthly.MXN));
    }
  });

  it("F. all three together are below the sum of the three alone, at every size", () => {
    for (const size of allSizes) {
      const all = quote(["produccion", "hospitalidad", "restaurante"], size);
      const alone = moduleIds.map((m) => quote([m], size));
      const setupAlone = alone.reduce((s, a) => s + a.setup.MXN, 0);
      const monthlyAlone = alone.reduce((s, a) => s + a.monthly.MXN, 0);
      expect(all.setup.MXN).toBeLessThan(setupAlone);
      expect(all.monthly.MXN).toBeLessThan(monthlyAlone);
      expect(all.setup.MXN + all.monthly.MXN * 12).toBeLessThan(
        setupAlone + monthlyAlone * 12,
      );
    }
    // The honest headline: about 40 percent less over twelve months at S.
    const s = workedExamples.find(
      (e) => e.id === "s-produccion-hospitalidad-restaurante",
    )!;
    const saving = 1 - s.yearOneTogether.MXN / s.yearOneAlone.MXN;
    expect(saving).toBeGreaterThan(0.42);
    expect(saving).toBeLessThan(0.43);
  });
});

describe("the constraints from the memo review of 2026-09-08", () => {
  it("(a) every standalone figure is at or above its published floor", () => {
    for (const moduleId of moduleIds) {
      for (const size of allSizes) {
        const q = quote([moduleId], size);
        expect(q.setup.MXN).toBeGreaterThanOrEqual(
          moduleFloors[moduleId].setup.MXN,
        );
        expect(q.monthly.MXN).toBeGreaterThanOrEqual(
          moduleFloors[moduleId].monthly.MXN,
        );
      }
    }
  });

  it("(b) no service hour is sold below 1,225 MXN, after mix and after prepay", () => {
    for (const size of allSizes) {
      for (const mix of combinations) {
        const q = quote(mix, size);
        const hours =
          memoBaseHours[size] +
          mix.reduce((sum, m) => sum + memoRunHours[m][size], 0);
        // Net of the provider cash already out of the door, per Daniel hour of
        // scoped service time. The tolerance is rounding: the memo rounds each
        // line to the nearest 100 and does not bump a fee to chase 31 pesos.
        const monthlyRate =
          (q.monthly.MXN - memoProviderCash[size]) / (hours * scopeFactor[size]);
        expect(monthlyRate).toBeGreaterThan(serviceRate - 3);

        const prepay = annualPrepay(size, q.monthly.MXN);
        const collectionHours = 11 * (memoAdminHours[size] / 2);
        const yearHours = 12 * hours - collectionHours;
        const prepaidRate =
          (prepay.paid.MXN - 12 * memoProviderCash[size]) /
          (yearHours * scopeFactor[size]);
        expect(prepaidRate).toBeGreaterThan(serviceRate);
      }
    }
  });

  it("(c) a combination is priced on hours built, and is never called a floor", () => {
    for (const size of allSizes) {
      for (const mix of combinations) {
        const q = quote(mix, size);
        expect(q.pricedOn).toBe("hours-actually-built");
        for (const line of q.lines) {
          expect(["cost-recovery", "service-funded-concession"]).toContain(
            line.boundBy,
          );
        }
      }
    }
    // The point of holding the two apart: inside a mix a line sits below the
    // standalone floor, legitimately, because it is a smaller build.
    const all = quote(["produccion", "hospitalidad", "restaurante"], "S");
    const produccionLine = all.lines.find((l) => l.module === "produccion")!;
    expect(produccionLine.packagedSetup).toBeLessThan(
      moduleFloors.produccion.setup.MXN,
    );
    expect(produccionLine.packagedSetup).toBeGreaterThanOrEqual(
      produccionLine.costRecovery,
    );
    expect(produccionLine.hoursBuilt).toBeLessThan(
      moduleFloors.produccion.hours,
    );
  });
});

describe("the Lucy findings of 2026-09-08, one test per finding", () => {
  const allThree = quote(["produccion", "hospitalidad", "restaurante"], "S");
  const allThreeExample = workedExamples.find(
    (e) => e.id === "s-produccion-hospitalidad-restaurante",
  )!;

  it("(1) makes the two bridges quotable in a mix and buys neither of them", () => {
    expect(bridgeFeatures(["produccion"])).toEqual([]);
    expect(bridgeFeatures(["hospitalidad"])).toEqual([]);
    // Produccion plus Hospitalidad share a system and no bridge feature.
    expect(bridgeFeatures(["produccion", "hospitalidad"])).toEqual([]);
    expect(bridgeFeatures(["hospitalidad", "restaurante"])).toEqual([
      {
        module: "hospitalidad",
        feature: "restaurant-bridge",
        requires: "restaurante",
      },
    ]);
    expect(bridgeFeatures(["produccion", "restaurante"])).toEqual([
      {
        module: "restaurante",
        feature: "wine-list-wired-to-the-cellar",
        requires: "produccion",
      },
    ]);
    const both = bridgeFeatures(["produccion", "hospitalidad", "restaurante"]);
    expect(both.map((b) => b.feature).sort()).toEqual([
      "restaurant-bridge",
      "wine-list-wired-to-the-cellar",
    ]);

    // The published all-three example buys the three standard bundles and no
    // bridge, which is the 141,500 of memo 6.4 and of 8.2's fourth example. So
    // the page may not say the bridges come with that figure: they are quoted
    // on top, the way 8.2's third example says it of the payment link.
    expect(allThree.setup.MXN).toBe(141500);
    const bought = allThree.lines.flatMap((line) =>
      modules[line.module].bundles[line.size].map((item) => item.feature),
    );
    for (const bridge of both) expect(bought).not.toContain(bridge.feature);
    expect(featureHours("hospitalidad", "restaurant-bridge", "S")).toBe(0.8);
    expect(featureHours("restaurante", "wine-list-wired-to-the-cellar", "S")).toBe(
      0.7,
    );
    // 17.3 + 19.6 + 26.8, the three standard bundles and not one hour more.
    expect(allThree.lines.reduce((sum, l) => sum + l.bundleHours, 0)).toBeCloseTo(
      63.7,
      10,
    );
  });

  it("(4) converts every saving from the rounded MXN saving", () => {
    for (const example of workedExamples) {
      expect(example.setupSaving).toEqual(
        priced(example.setupIfAlone.MXN - example.quote.setup.MXN),
      );
      expect(example.monthlySaving).toEqual(
        priced(example.monthlyIfAlone.MXN - example.quote.monthly.MXN),
      );
    }
    // 172,500 less 141,500 is 31,000, whose conversion at 17.0 is 1,820 USD.
    // Subtracting the printed USD totals gave 10,150 less 8,320 = 1,830, a
    // figure no peso amount produces. Since hq-ggot1.13 the alone row reads
    // 10,140, so on this one example the two agree and the /en column also
    // subtracts, which is the check the page's own reader would run.
    expect(allThreeExample.setupSaving).toEqual({ MXN: 31000, USD: 1820 });
    expect(allThreeExample.monthlySaving).toEqual({ MXN: 18300, USD: 1080 });
    for (const currency of ["MXN", "USD"] as const) {
      expect(allThreeExample.setupSaving[currency]).toBe(
        allThreeExample.setupIfAlone[currency] -
          allThreeExample.quote.setup[currency],
      );
      expect(allThreeExample.monthlySaving[currency]).toBe(
        allThreeExample.monthlyIfAlone[currency] -
          allThreeExample.quote.monthly[currency],
      );
    }
  });

  it("(5) keeps every run cost within one rounding increment of its own hours", () => {
    // Memo section 1 states the tolerance out loud: a line is the sum of its
    // own rounded lines, so a run cost can sit a little under the service-rate
    // amount for its hours, and the memo does not bump a fee to chase it.
    for (const size of allSizes) {
      for (const id of moduleIds) {
        const own = runCostHours(id, size) * serviceRate * scopeFactor[size];
        expect(runCost(id, size)).toBeGreaterThan(own - 100);
      }
    }
    // The exact line Lucy flagged, and the size of the gap.
    expect(runCostHours("restaurante", "S")).toBe(2.4);
    expect(runCost("restaurante", "S")).toBe(2900);
    expect(2.4 * serviceRate - runCost("restaurante", "S")).toBe(40);
    // What the memo makes a floor is invariant B, on the quoted monthly, and a
    // per-line floor here would move 2,900 in memo 5.2 and in worked example 3.
    const restaurante = quote(["restaurante"], "S");
    expect(restaurante.monthly.MXN).toBe(12100);
    expect(restaurante.monthly.MXN).toBeGreaterThanOrEqual(
      serviceFloorMonthly(["restaurante"], "S"),
    );
    for (const size of allSizes) {
      for (const mix of combinations) {
        expect(quote(mix, size).monthly.MXN).toBeGreaterThan(
          serviceFloorMonthly(mix, size) - 100,
        );
      }
    }
  });
});

describe("(3) a size per module, which is what the Diagnostico sets", () => {
  it("prices a mix identically whichever call shape names the size", () => {
    for (const size of allSizes) {
      for (const mix of combinations) {
        const perModule: ModuleSelection[] = mix.map((module) => ({
          module,
          size,
        }));
        expect(quote(perModule)).toEqual(quote(mix, size));
      }
    }
  });

  it("charges the shared base at the largest module's size", () => {
    const mixed = quote([
      { module: "produccion", size: "M" },
      { module: "hospitalidad", size: "S" },
    ]);
    expect(mixed.size).toBe("M");
    expect(mixed.sharedServiceBase).toBe(sharedServiceBase("M"));
    // 14,800 of base at M, 3,100 of Produccion at M, 2,300 of Hospitalidad at S.
    expect(mixed.monthly.MXN).toBe(20200);
    expect(mixed.runCosts).toEqual([
      { module: "produccion", size: "M", monthly: 3100 },
      { module: "hospitalidad", size: "S", monthly: 2300 },
    ]);
  });

  it("ranks every module on its own size, so the order can change", () => {
    // Produccion at M builds 99,500 against Hospitalidad at S on 53,000, so the
    // module that takes the discount at one size takes full price here.
    const mixed = quote([
      { module: "hospitalidad", size: "S" },
      { module: "produccion", size: "M" },
    ]);
    expect(mixed.modules).toEqual(["produccion", "hospitalidad"]);
    expect(mixed.lines.map((l) => l.size)).toEqual(["M", "S"]);
    expect(mixed.lines[0].mixDiscount).toBe(mixDiscountByRank[0]);
    expect(mixed.lines[1].mixDiscount).toBe(mixDiscountByRank[1]);
    // At one size the same pair ranks the other way round.
    expect(quote(["produccion", "hospitalidad"], "S").modules).toEqual([
      "hospitalidad",
      "produccion",
    ]);
  });

  it("holds the memo's floors on every mixed-size quote of the three", () => {
    for (const a of allSizes) {
      for (const b of allSizes) {
        for (const c of allSizes) {
          const q = quote([
            { module: "produccion", size: a },
            { module: "hospitalidad", size: b },
            { module: "restaurante", size: c },
          ]);
          expect(q.size).toBe(largestSize([a, b, c]));
          for (const line of q.lines) {
            expect(line.packagedSetup).toBeGreaterThanOrEqual(line.costRecovery);
          }
          const lines =
            sharedServiceBase(q.size) +
            runCost("produccion", a) +
            runCost("hospitalidad", b) +
            runCost("restaurante", c);
          expect(q.monthly.MXN).toBeGreaterThanOrEqual(lines);
          expect(q.setup.MXN).toBe(
            q.lines.reduce((sum, l) => sum + l.packagedSetup, 0) +
              (q.setupBumped ? 500 : 0),
          );
        }
      }
    }
  });

  it("takes an add-on at the largest size among the modules it attaches to", () => {
    const q = quote(
      [
        { module: "hospitalidad", size: "M" },
        { module: "restaurante", size: "S" },
      ],
      ["google-ads-management"],
    );
    expect(q.addOns).toEqual([
      { id: "google-ads-management", size: "M", monthly: 5500 },
    ]);
    // The visit is per client, so it takes the largest module's size instead.
    const visit = quote(
      [
        { module: "produccion", size: "L" },
        { module: "restaurante", size: "M" },
      ],
      ["on-site-visit"],
    );
    expect(visit.addOns).toEqual([
      { id: "on-site-visit", size: "L", monthly: 5500 },
    ]);
  });

  it("refuses a selection that names one module at two sizes", () => {
    // Contradictory input from a Diagnostico: picking one of the two silently
    // would quote a build nobody chose (cross-vendor review of this diff).
    expect(() =>
      quote([
        { module: "produccion", size: "S" },
        { module: "produccion", size: "L" },
      ]),
    ).toThrow("two sizes");
    // The same module at the same size twice is one selection said twice.
    const twice = quote([
      { module: "produccion", size: "M" },
      { module: "produccion", size: "M" },
    ]);
    expect(twice.lines).toHaveLength(1);
    expect(twice).toEqual(quote(["produccion"], "M"));
    // And the id form still collapses a repeat, as it did before per-module sizes.
    expect(quote(["produccion", "produccion"], "M")).toEqual(
      quote(["produccion"], "M"),
    );
  });

  it("refuses the same add-on twice, in either call shape", () => {
    // An add-on is a quote line charged once (memo 5.3), and the 113-config
    // census counts subsets, so a repeated id would bill it twice.
    expect(() =>
      quote(["restaurante"], "M", [
        "google-ads-management",
        "google-ads-management",
      ]),
    ).toThrow("chosen twice");
    expect(() =>
      quote([{ module: "restaurante", size: "M" }], ["content", "content"]),
    ).toThrow("chosen twice");
    // One of each still prices as before.
    expect(
      quote(["restaurante"], "M", ["google-ads-management", "content"]).addOns,
    ).toHaveLength(2);
  });

  it("refuses a quote of module ids with no size", () => {
    // @ts-expect-error the single-size form takes its size as its second argument
    expect(() => quote(["produccion"])).toThrow("needs a size");
    expect(() => quote([], "S")).toThrow("at least one module");
  });
});

describe("(7) the published policy percentages come from mixDiscountByRank", () => {
  const locales = ["en", "es"] as const;

  it.each(locales)("%s types no percentage into the mix rules", (locale) => {
    // The dictionary carries the sentence and the data carries the number, so
    // a change to mixDiscountByRank cannot leave a published promise behind.
    for (const rule of precios[locale].mix.rules) {
      expect(rule).not.toMatch(/\d/);
    }
    expect(precios[locale].mix.rules.join(" ")).toContain("{second}");
    expect(precios[locale].mix.rules.join(" ")).toContain("{third}");
  });

  it.each(locales)("%s renders 10 and 12 out of the data", (locale) => {
    const rendered = mixRules(locale).join(" ");
    expect(rendered).not.toContain("{");
    expect(rendered).toContain(formatPercent(locale, mixDiscountByRank[1]));
    expect(rendered).toContain(formatPercent(locale, mixDiscountByRank[2]));
    expect(formatPercent(locale, mixDiscountByRank[1])).toBe("10");
    expect(formatPercent(locale, mixDiscountByRank[2])).toBe("12");
  });

  it.each(locales)("%s follows the data when the pass-through moves", (locale) => {
    // What a hardcoded 10 and 12 could not do: the same sentence with another
    // rate reads the other rate. formatPercent is the only place that decides.
    expect(formatPercent(locale, 0.15)).toBe("15");
    expect(formatPercent(locale, 0.125)).toBe("12.5");
  });

  it.each(locales)("%s prices each combination row from its own lines", (locale) => {
    const all = workedExamples.find(
      (e) => e.id === "s-produccion-hospitalidad-restaurante",
    )!;
    const clause = comboPricingClause(locale, all.quote.lines);
    const names = all.modules.map((id) => precios[locale].floors.modules[id].name);
    // Named in the quote's own ranked order, most expensive build first.
    const positions = names.map((n) => clause.indexOf(n));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(clause).toContain(formatPercent(locale, mixDiscountByRank[1]));
    expect(clause).toContain(formatPercent(locale, mixDiscountByRank[2]));
    expect(clause).toContain(precios[locale].mix.pricedOnLead);

    // A single module carries no discount clause at all, only full price.
    const alone = workedExamples.find((e) => e.id === "s-produccion")!;
    const soloClause = comboPricingClause(locale, alone.quote.lines);
    expect(soloClause).not.toContain(formatPercent(locale, mixDiscountByRank[1]));
    expect(soloClause).toContain(
      precios[locale].mix.discountFull.replace(
        "{module}",
        precios[locale].floors.modules.produccion.name,
      ),
    );
  });

  it.each(locales)("%s names every publishable combination", (locale) => {
    for (const example of workedExamples.filter((e) => e.publishable)) {
      const name = comboName(locale, example.modules);
      for (const id of example.modules) {
        expect(name).toContain(precios[locale].floors.modules[id].name);
      }
      // Two names are joined by the locale's own word, three by comma then it.
      if (example.modules.length > 1) {
        expect(name).toContain(precios[locale].mix.nameJoin);
      }
    }
    expect(comboName(locale, ["produccion"])).toBe(
      precios[locale].floors.modules.produccion.name,
    );
  });

  it.each(locales)("%s says the bridges are quoted on top, from the data", (locale) => {
    const bridges = bridgeFeatures(["produccion", "hospitalidad", "restaurante"]);
    const sentence = bridgesSentence(locale, bridges);
    for (const bridge of bridges) {
      expect(sentence).toContain(precios[locale].mix.bridgeNames[bridge.feature]);
    }
    expect(sentence).not.toContain("{list}");
    // A mix with no bridge gets no sentence rather than an empty promise.
    expect(bridgesSentence(locale, bridgeFeatures(["produccion"]))).toBe("");
    // And an unnamed bridge fails the build instead of printing a slug.
    expect(() => bridgesSentence(locale, [{ feature: "not-a-bridge" }])).toThrow();
  });
});

describe("the grower variant", () => {
  it("is 19.7 hours and lands 6,500 above the winemaker bundle at S", () => {
    expect(growerBundleHours("S")).toBe(19.7);
    expect(growerSetupS()).toEqual({ MXN: 53500, USD: 3150 });
    expect(growerSetupS().MXN - moduleFloors.produccion.setup.MXN).toBe(6500);
  });

  it("does not lower the Produccion floor, which is a floor for the module", () => {
    expect(moduleFloors.produccion.setup.MXN).toBe(47000);
    expect(moduleFloors.produccion.monthly.MXN).toBe(10800);
  });
});

describe("the retired winery card", () => {
  it("still exports the pre-module figures the two unowned pages import", () => {
    expect(wineryPricingPlaceholder).toBe(true);
    expect(wineryBundles).toBe(legacyWineryBundles);
    expect(winerySetupFloor).toBe(legacyWinerySetupFloor);
    expect(wineryBundles.map((b) => b.id)).toEqual([
      "cava",
      "vendimia",
      "bitacora",
    ]);
  });

  it("has not moved a single published figure while being renamed", () => {
    expect(legacyWineryBundles).toEqual([
      {
        id: "cava",
        setup: { MXN: 277500, USD: 16320 },
        monthly: { MXN: 44200, USD: 2600 },
        buildOnly: { MXN: 337500, USD: 19850 },
      },
      {
        id: "vendimia",
        setup: { MXN: 113500, USD: 6680 },
        monthly: { MXN: 25600, USD: 1510 },
        buildOnly: { MXN: 153500, USD: 9030 },
      },
      {
        id: "bitacora",
        setup: { MXN: 45500, USD: 2680 },
        monthly: { MXN: 9500, USD: 560 },
        buildOnly: { MXN: 65000, USD: 3820 },
      },
    ]);
    expect(legacyWinerySetupFloor("es")).toBe(45500);
    expect(legacyWinerySetupFloor("en")).toBe(2680);
  });
});

describe("sizes", () => {
  it("exposes the three size bands the whole model is built on", () => {
    expect([...sizes]).toEqual(["S", "M", "L"]);
    expect(scopeFactor).toEqual({ S: 1.0, M: 1.5, L: 2.05 });
  });
});
