import { describe, expect, it } from "vitest";
import { config as original } from "@/prixfixe.config";
import { config as plain } from "@/prixfixe.plain.config";
import { computeOrder } from "./order";
import type { Billing, PrixFixeConfig, Selection } from "./types";

const selection: Selection = { menuId: "tasting", billing: "monthly", seats: 4, sides: [] };

for (const [name, example] of [["original", original], ["plain", plain]] as const) {
  for (const [currency, locale] of [["USD", "en-US"], ["EUR", "fr-FR"]]) {
    const config: PrixFixeConfig = { ...example, house: { ...example.house, currency, locale } };
    describe(`${name} ${currency}/${locale}: exhaustive orders`, () => {
      for (const menu of config.menus) {
        for (const billing of ["monthly", "yearly"] as const) {
          it(`${menu.id}, ${billing}: all 250 seat counts × 16 side subsets`, () => {
            let cases = 0;
            for (let seats = config.seats.min; seats <= config.seats.max; seats++) {
              for (let mask = 0; mask < 2 ** config.sides.length; mask++) {
                const sides = config.sides.filter((_, i) => mask & (1 << i));
                const chosen = sides.map((side) => side.id);
                const unitAmount = menu.price === "market" ? 0 : menu.price * 100;
                const lines = [
                  { kind: "menu", id: menu.id, name: menu.name, quantity: seats, unitAmount, amount: unitAmount * seats },
                  ...sides.map((side) => ({
                    kind: "side", id: side.id, name: side.name,
                    quantity: side.per === "seat" ? seats : 1,
                    unitAmount: side.price * 100,
                    amount: side.price * 100 * (side.per === "seat" ? seats : 1),
                  })),
                ];
                const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
                // Both examples promise two free months; do not call pricing helpers for the oracle.
                const billedPerPeriod = subtotal * (billing === "yearly" ? 10 : 1);
                const total = billing === "yearly" ? Math.round(billedPerPeriod / 12) : subtotal;
                expect(computeOrder(config, { menuId: menu.id, billing, seats, sides: [...chosen].reverse() }),
                  `seats=${seats}, sides=${chosen.join(",") || "none"}`).toEqual({
                  menu, billing, seats, sideIds: chosen, market: menu.price === "market", lines,
                  subtotal, total, discount: subtotal - total, billedPerPeriod, fractionDigits: 2,
                });
                cases++;
              }
            }
            expect(cases).toBe(4000);
          });
        }
      }
    });
  }
}

describe("computeOrder boundaries", () => {
  it("rejects an unknown menu", () => {
    expect(() => computeOrder(original, { ...selection, menuId: "missing" })).toThrow('unknown menu "missing"');
  });
  it("deduplicates sides, ignores unknown IDs, and retains config order", () => {
    expect(computeOrder(original, { ...selection, sides: ["analytics", "missing", "storage", "analytics"] }).sideIds)
      .toEqual(["storage", "analytics"]);
  });
  it.each([[-5, 1], [0, 1], [251, 250], [1.49, 1], [1.5, 2], [NaN, 4], [Infinity, 4], [-Infinity, 4]])(
    "normalizes %s seats to %s", (seats, expected) => {
      const order = computeOrder(original, { ...selection, seats, sides: ["analytics", "storage"] });
      expect(order.seats).toBe(expected);
      expect(order.subtotal).toBe(3000 * expected + 1200);
    },
  );
  it("normalizes invalid runtime billing to monthly", () => {
    expect(computeOrder(original, { ...selection, billing: "invalid" as Billing }).billing).toBe("monthly");
  });
  it.each([[-2, 12], [0, 12], [2, 10], [12, 0], [15, 0]])(
    "clamps %s free months to %s paid months", (yearlyFreeMonths, paid) => {
      const config = { ...original, billing: { ...original.billing, yearlyFreeMonths } };
      const order = computeOrder(config, { ...selection, billing: "yearly" });
      expect(order.billedPerPeriod).toBe(9600 * paid);
      expect(order.total).toBe(800 * paid);
      expect(order.discount).toBe(9600 - 800 * paid);
      expect(computeOrder(config, selection).total).toBe(9600);
    },
  );
  it("rounds units before multiplication and keeps the annual charge exact", () => {
    const config: PrixFixeConfig = { ...original,
      menus: [{ ...original.menus[1], price: 0.014 }],
      sides: [{ ...original.sides[0], price: 0.025 }],
    };
    const order = computeOrder(config, { ...selection, seats: 2, billing: "yearly", sides: ["storage"] });
    expect(order.lines.map(({ unitAmount, amount }) => [unitAmount, amount])).toEqual([[1, 2], [3, 3]]);
    expect(order.subtotal).toBe(5);
    expect(order.billedPerPeriod).toBe(50);
    expect(order.total).toBe(4);
    expect(order.discount).toBe(1);
    expect(order.billedPerPeriod).not.toBe(order.total * 12);
  });
  it("supports currencies without fractional units", () => {
    const config = { ...original, house: { ...original.house, currency: "JPY", locale: "ja-JP" } };
    const order = computeOrder(config, selection);
    expect(order.fractionDigits).toBe(0);
    expect(order.total).toBe(96);
  });
  it("does not mutate config or selection", () => {
    const config = structuredClone(original);
    const input = { ...selection, sides: ["analytics", "storage", "analytics"] };
    const before = structuredClone({ config, input });
    computeOrder(config, input);
    expect({ config, input }).toEqual(before);
  });
});
