/** Shape of prixfixe.config.ts. Every string the page renders lives in the config. */

export type Billing = "monthly" | "yearly";

export interface House {
  /** House name, set in letterspaced small caps in the masthead. */
  name: string;
  tagline: string;
  /** Year shown as "Est. 2019". */
  established: number;
  /** One or two letters drawn inside the crest. */
  monogram: string;
  /** ISO 4217 code used by Intl.NumberFormat, e.g. "USD". */
  currency: string;
  /** BCP 47 locale used by Intl.NumberFormat and Intl.DateTimeFormat, e.g. "en-US". */
  locale: string;
  /** "Book the table" opens mailto: this address. */
  salesEmail: string;
  /** "Send to kitchen" opens this URL with ?plan, billing, seats and addons. */
  checkoutUrl: string;
}

export interface Mark {
  id: string;
  /** Glyph drawn inside the circle, usually one letter. */
  symbol: string;
  /** Meaning, read by screen readers and listed in the legend. */
  label: string;
}

export interface Dish {
  /** Feature name, set in italic. */
  name: string;
  /** Menu-prose description. */
  note: string;
  /** Ids from `marks`. */
  marks?: readonly string[];
}

export interface SetMenu {
  id: string;
  name: string;
  blurb: string;
  /** Monthly price per seat in major units (24 = $24). 0 renders "Free"; "market" renders "Market price". */
  price: number | "market";
  /** Gets the "Chef's recommendation" mark. Use on one menu at most. */
  recommended?: boolean;
  dishes: readonly Dish[];
}

export interface Side {
  id: string;
  name: string;
  note: string;
  /** Monthly price in major units. */
  price: number;
  /** "seat" multiplies by the number of seats; "table" is a flat monthly price. */
  per: "seat" | "table";
}

export interface Pairing {
  id: string;
  name: string;
  /** Short descriptor line, e.g. "Two-way sync · crisp". */
  style: string;
  /** Tasting note in menu prose. */
  notes: string;
  /** Menu ids this integration is included with. */
  pairsWith: readonly string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Copy {
  meta: { title: string; description: string };
  masthead: { established: string; title: string; intro: string };
  billing: {
    legend: string;
    monthly: string;
    yearly: string;
    yearlyNote: string;
    periodMonthly: string;
    periodYearly: string;
  };
  menus: {
    heading: string;
    free: string;
    freePeriod: string;
    perSeat: string;
    marketPrice: string;
    marketPeriod: string;
    recommended: string;
    dishesLabel: string;
    order: string;
    book: string;
    bookSubject: string;
  };
  sides: {
    heading: string;
    intro: string;
    seatsLabel: string;
    seatsHint: string;
    addSeat: string;
    removeSeat: string;
    perSeat: string;
  };
  pairing: { heading: string; intro: string; pairsWith: string };
  legend: { heading: string };
  chef: { heading: string; intro: string; signature: string };
  smallPrint: { heading: string };
  ticket: {
    title: string;
    close: string;
    table: string;
    covers: string;
    server: string;
    billing: string;
    seats: string;
    sides: string;
    noSides: string;
    subtotal: string;
    houseDiscount: string;
    total: string;
    billedMonthly: string;
    billedYearly: string;
    send: string;
    footer: string;
  };
}

export interface PrixFixeConfig {
  house: House;
  billing: {
    default: Billing;
    /** Months given free on yearly billing. Yearly per-month price = monthly × (12 − n) / 12. */
    yearlyFreeMonths: number;
  };
  seats: { min: number; max: number; default: number };
  ticket: { table: string; server: string };
  marks: readonly Mark[];
  menus: readonly SetMenu[];
  sides: readonly Side[];
  pairings: readonly Pairing[];
  faq: readonly FaqItem[];
  smallPrint: readonly string[];
  copy: Copy;
}

/** What the visitor has chosen. Everything is validated by computeOrder. */
export interface Selection {
  menuId: string;
  billing: Billing;
  seats: number;
  sides: readonly string[];
}
