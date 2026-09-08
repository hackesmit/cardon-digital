import { describe, expect, it } from "vitest";

import {
  type ModuleId,
  type Size,
  absorbedProviderCash,
  addOnAvailable,
  addOnMonthly,
  annualPrepay,
  buildOnly,
  bundleHours,
  ceilTo,
  combinations,
  featureSetup,
  growerBundleHours,
  growerSetupS,
  legacyWineryBundles,
  legacyWinerySetupFloor,
  moduleFloors,
  moduleIds,
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
    expect(q.addOns).toEqual([{ id: "google-ads-management", monthly: 5500 }]);
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

  it("publishes only the four S examples memo 8.2 allows", () => {
    const publishable = workedExamples.filter((e) => e.publishable);
    expect(publishable.map((e) => e.id).sort()).toEqual([
      "s-hospitalidad",
      "s-produccion",
      "s-produccion-hospitalidad-restaurante",
      "s-restaurante",
    ]);
    // Examples vary the mix, never the size, so no reader can rebuild a row.
    expect(publishable.every((e) => e.size === "S")).toBe(true);
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

  it("is the same concession whatever the mix, because it is 4 percent of the base", () => {
    for (const size of allSizes) {
      const concessions = combinations.map(
        (mix) => annualPrepay(size, quote(mix, size).monthly.MXN).concession.MXN,
      );
      expect(new Set(concessions).size).toBe(1);
    }
    // 4 percent of the L base year is 10,992, which rounds to a bare 11,000,
    // and a concession on a bare multiple moves down, towards the floor.
    expect(annualPrepay("L", 28100).concession.MXN).toBe(10900);
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
