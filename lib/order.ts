import type { Billing, PrixFixeConfig, Selection, SetMenu, Side } from "./types";

/*
 * All pricing math lives here. Every function is pure: same input, same output,
 * no I/O, no clock, no globals. Amounts are integers in the currency's minor
 * unit (cents for USD) so nothing drifts through floating point.
 */

export interface OrderLine {
  kind: "menu" | "side";
  id: string;
  name: string;
  /** Seats for per-seat items, 1 for flat items. */
  quantity: number;
  /** List price per unit per month (monthly rate), minor units. */
  unitAmount: number;
  /** unitAmount × quantity, minor units. */
  amount: number;
}

export interface Order {
  menu: SetMenu;
  billing: Billing;
  seats: number;
  /** Sides that exist in the config, in config order, without duplicates. */
  sideIds: string[];
  /** True for a "market" menu: it has no list price and is booked by email. */
  market: boolean;
  lines: OrderLine[];
  /** Sum of lines at monthly list prices, minor units. */
  subtotal: number;
  /** Yearly saving expressed per month (0 on monthly billing), minor units. */
  discount: number;
  /** What the table pays per month, minor units. */
  total: number;
  /** Amount charged each billing period: one month, or twelve months up front. */
  billedPerPeriod: number;
  /** Number of decimals in the currency's minor unit (2 for USD, 0 for JPY). */
  fractionDigits: number;
}

/** Decimals in the currency's minor unit, as Intl knows it. */
export function currencyDigits(currency: string, locale: string): number {
  return (
    new Intl.NumberFormat(locale, { style: "currency", currency }).resolvedOptions()
      .maximumFractionDigits ?? 2
  );
}

/** Major units (24) to minor units (2400). */
export function toMinor(amount: number, fractionDigits: number): number {
  return Math.round(amount * 10 ** fractionDigits);
}

/** Months actually paid on yearly billing, clamped to 0–12. */
export function paidMonths(yearlyFreeMonths: number): number {
  return 12 - Math.min(12, Math.max(0, yearlyFreeMonths));
}

/**
 * Per-month price for a billing cycle, minor units.
 * Yearly = monthly × (12 − yearlyFreeMonths) / 12, rounded to the minor unit.
 */
export function cyclePrice(monthlyMinor: number, billing: Billing, yearlyFreeMonths: number): number {
  if (billing === "monthly") return monthlyMinor;
  return Math.round((monthlyMinor * paidMonths(yearlyFreeMonths)) / 12);
}

export function clampSeats(config: PrixFixeConfig, seats: number): number {
  const { min, max } = config.seats;
  if (!Number.isFinite(seats)) return config.seats.default;
  return Math.min(max, Math.max(min, Math.round(seats)));
}

function sideQuantity(side: Side, seats: number): number {
  return side.per === "seat" ? seats : 1;
}

export function computeOrder(config: PrixFixeConfig, selection: Selection): Order {
  const menu = config.menus.find((m) => m.id === selection.menuId);
  if (!menu) throw new Error(`computeOrder: unknown menu "${selection.menuId}"`);

  const billing: Billing = selection.billing === "yearly" ? "yearly" : "monthly";
  const seats = clampSeats(config, selection.seats);
  const digits = currencyDigits(config.house.currency, config.house.locale);
  const market = menu.price === "market";

  const chosen = new Set(selection.sides);
  const sides = config.sides.filter((s) => chosen.has(s.id));

  const menuUnit = market ? 0 : toMinor(menu.price as number, digits);
  const lines: OrderLine[] = [
    {
      kind: "menu",
      id: menu.id,
      name: menu.name,
      quantity: seats,
      unitAmount: menuUnit,
      amount: menuUnit * seats,
    },
    ...sides.map((side): OrderLine => {
      const quantity = sideQuantity(side, seats);
      const unitAmount = toMinor(side.price, digits);
      return { kind: "side", id: side.id, name: side.name, quantity, unitAmount, amount: unitAmount * quantity };
    }),
  ];

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const months = paidMonths(config.billing.yearlyFreeMonths);
  // Yearly: the exact amount for twelve months is subtotal × paid months; the
  // monthly figure is derived from it so the yearly charge never picks up rounding.
  const billedPerPeriod = billing === "yearly" ? subtotal * months : subtotal;
  const total = billing === "yearly" ? Math.round(billedPerPeriod / 12) : subtotal;

  return {
    menu,
    billing,
    seats,
    sideIds: sides.map((s) => s.id),
    market,
    lines,
    subtotal,
    discount: subtotal - total,
    total,
    billedPerPeriod,
    fractionDigits: digits,
  };
}

/** checkoutUrl + ?plan, billing, seats and addons (comma-separated side ids). */
export function checkoutHref(config: PrixFixeConfig, selection: Selection): string {
  const order = computeOrder(config, selection);
  const params = new URLSearchParams({
    plan: order.menu.id,
    billing: order.billing,
    seats: String(order.seats),
    addons: order.sideIds.join(","),
  });
  const [base, hash = ""] = config.house.checkoutUrl.split("#");
  const join = base.includes("?") ? (base.endsWith("?") || base.endsWith("&") ? "" : "&") : "?";
  return `${base}${join}${params.toString()}${hash ? `#${hash}` : ""}`;
}

/** mailto: link for market-price menus. */
export function bookingHref(config: PrixFixeConfig, menu: SetMenu): string {
  const subject = encodeURIComponent(`${config.copy.menus.bookSubject}: ${menu.name}`);
  return `mailto:${config.house.salesEmail}?subject=${subject}`;
}
