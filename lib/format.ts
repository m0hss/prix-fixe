import { currencyDigits, cyclePrice, toMinor } from "./order";
import type { House, PrixFixeConfig } from "./types";

/*
 * Money formatting. Every amount on the page goes through Intl.NumberFormat
 * with house.currency and house.locale. Inputs are minor units (cents).
 */

const cache = new Map<string, Intl.NumberFormat>();

function formatter(house: House, fractionDigits: number | null): Intl.NumberFormat {
  const key = `${house.locale}|${house.currency}|${fractionDigits ?? "auto"}`;
  let nf = cache.get(key);
  if (!nf) {
    nf = new Intl.NumberFormat(
      house.locale,
      fractionDigits === null
        ? { style: "currency", currency: house.currency }
        : {
            style: "currency",
            currency: house.currency,
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
          },
    );
    cache.set(key, nf);
  }
  return nf;
}

/** Menu style: "$24" for whole amounts, "$24.17" otherwise. */
export function formatMenuPrice(minor: number, house: House, fractionDigits: number): string {
  const scale = 10 ** fractionDigits;
  const whole = minor % scale === 0;
  return formatter(house, whole ? 0 : fractionDigits).format(minor / scale);
}

/** Receipt style: always every decimal, "$24.00". */
export function formatExact(minor: number, house: House, fractionDigits: number): string {
  return formatter(house, null).format(minor / 10 ** fractionDigits);
}

/** A monthly list price (major units) as menu labels for both billing cycles. */
export function cycleLabels(monthly: number, config: PrixFixeConfig): { monthly: string; yearly: string } {
  const { house } = config;
  const digits = currencyDigits(house.currency, house.locale);
  const minor = toMinor(monthly, digits);
  const free = config.billing.yearlyFreeMonths;
  return {
    monthly: formatMenuPrice(cyclePrice(minor, "monthly", free), house, digits),
    yearly: formatMenuPrice(cyclePrice(minor, "yearly", free), house, digits),
  };
}
