import { describe, expect, it } from "vitest";
import { config } from "@/prixfixe.config";
import { cycleLabels, formatExact, formatMenuPrice } from "./format";
import { computeOrder } from "./order";

const french = { ...config, house: { ...config.house, currency: "EUR", locale: "fr-FR" } };

describe("EUR / fr-FR", () => {
  it("uses commas, nonbreaking currency spaces, and narrow nonbreaking grouping spaces", () => {
    expect(formatMenuPrice(2400, french.house, 2)).toBe("24\u00a0€");
    expect(formatMenuPrice(2417, french.house, 2)).toBe("24,17\u00a0€");
    expect(formatExact(2400, french.house, 2)).toBe("24,00\u00a0€");
    expect(formatExact(123456, french.house, 2)).toBe("1\u202f234,56\u00a0€");
    expect(formatExact(-1250, french.house, 2)).toBe("-12,50\u00a0€");
    expect(formatExact(0, french.house, 2)).toBe("0,00\u00a0€");
  });
  it("formats both billing cycle labels", () => {
    expect(cycleLabels(24, french)).toEqual({ monthly: "24\u00a0€", yearly: "20\u00a0€" });
    expect(cycleLabels(1, french)).toEqual({ monthly: "1\u00a0€", yearly: "0,83\u00a0€" });
  });
  it("formats an annual ticket without changing its arithmetic", () => {
    const order = computeOrder(french, { menuId: "tasting", billing: "yearly", seats: 4, sides: ["storage", "analytics"] });
    expect(order.subtotal).toBe(13200);
    expect(formatExact(order.total, french.house, order.fractionDigits)).toBe("110,00\u00a0€");
    expect(formatExact(order.billedPerPeriod, french.house, order.fractionDigits)).toBe("1\u202f320,00\u00a0€");
  });
  it("does not leak locale settings through the formatter cache", () => {
    expect(formatExact(2400, config.house, 2)).toBe("$24.00");
    expect(formatExact(2400, french.house, 2)).toBe("24,00\u00a0€");
    expect(formatMenuPrice(2400, french.house, 2)).toBe("24\u00a0€");
    expect(formatExact(2400, config.house, 2)).toBe("$24.00");
  });
});
