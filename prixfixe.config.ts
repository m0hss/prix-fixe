import type { PrixFixeConfig } from "@/lib/types";

/**
 * Prix Fixe — the only file you need to edit.
 * Every word, price and link on the page comes from here.
 * Colors live in app/theme.css.
 *
 * All names below are fictional placeholders.
 */
export const config = {
  house: {
    name: "Acme",
    tagline: "Software, prepared to order",
    established: 2019,
    monogram: "A",
    currency: "USD",
    locale: "en-US",
    salesEmail: "sales@acme.example",
    checkoutUrl: "https://acme.example/checkout",
  },

  billing: {
    default: "monthly",
    yearlyFreeMonths: 2,
  },

  seats: { min: 1, max: 250, default: 4 },

  ticket: { table: "12", server: "Team" },

  marks: [
    { id: "signature", symbol: "S", label: "House signature" },
    { id: "new", symbol: "N", label: "New this season" },
    { id: "limited", symbol: "L", label: "Served in limited portions" },
    { id: "beta", symbol: "B", label: "Still being perfected (beta)" },
  ],

  menus: [
    {
      id: "counter",
      name: "The Counter",
      blurb: "A light supper for one or two. Everything you need to start cooking.",
      price: 0,
      dishes: [
        { name: "Three workspaces", note: "served with unlimited documents", marks: ["limited"] },
        { name: "Seven days of history", note: "lightly kept, gently forgotten", marks: ["limited"] },
        { name: "Shared links", note: "for passing a plate across the table" },
        { name: "Community support", note: "from the regulars at the bar" },
      ],
    },
    {
      id: "tasting",
      name: "The Tasting Menu",
      blurb: "Our signature service for growing teams, course after course.",
      price: 24,
      recommended: true,
      dishes: [
        { name: "Unlimited workspaces", note: "plated to order, as many as the table holds", marks: ["signature"] },
        { name: "A year of history", note: "aged slowly, restored with one click" },
        { name: "Automations", note: "slow-cooked workflows that run while you sleep", marks: ["new"] },
        { name: "Guest access", note: "for friends who are only stopping by" },
        { name: "Priority support", note: "your server checks in before you ask" },
      ],
    },
    {
      id: "chefs-table",
      name: "The Chef’s Table",
      blurb: "A private kitchen for large parties, composed around your needs.",
      price: "market",
      dishes: [
        { name: "Everything on the Tasting Menu", note: "and a seat by the pass" },
        { name: "Single sign-on", note: "one key for every door in the house" },
        { name: "Audit log", note: "each course recorded by the maître d’" },
        { name: "Regional data residency", note: "sourced from the region of your choosing", marks: ["beta"] },
        { name: "A dedicated manager", note: "who remembers how you take it", marks: ["signature"] },
      ],
    },
  ],

  sides: [
    { id: "storage", name: "Extra pantry", note: "another 100 GB of storage", price: 12, per: "table" },
    { id: "analytics", name: "Insights", note: "reports plated weekly", price: 6, per: "seat" },
    { id: "sandbox", name: "Test kitchen", note: "a private sandbox workspace", price: 18, per: "table" },
    { id: "runs", name: "Second helpings", note: "ten thousand more automation runs", price: 30, per: "table" },
  ],

  pairings: [
    {
      id: "calendar",
      name: "Calendar",
      style: "Two-way sync · crisp",
      notes: "Bright and punctual, with a long finish of recurring stand-ups.",
      pairsWith: ["counter", "tasting", "chefs-table"],
    },
    {
      id: "chat",
      name: "Team chat",
      style: "Notifications · lively",
      notes: "Effervescent on the palate; pours an alert the moment a task is served.",
      pairsWith: ["tasting", "chefs-table"],
    },
    {
      id: "source",
      name: "Source control",
      style: "Linked commits · structured",
      notes: "Firm tannins, notes of pull request and a clean, merge-ready close.",
      pairsWith: ["tasting", "chefs-table"],
    },
    {
      id: "warehouse",
      name: "Data warehouse",
      style: "Nightly export · full-bodied",
      notes: "Deep and layered. Best decanted overnight and enjoyed with analysts.",
      pairsWith: ["chefs-table"],
    },
  ],

  faq: [
    {
      question: "May I change my menu later?",
      answer:
        "Of course. Move between menus whenever you like; we prorate the bill to the day, so nobody pays for a course they did not eat.",
    },
    {
      question: "What counts as a seat?",
      answer:
        "Anyone who signs in to cook. Guests who only read along sit at the counter for free.",
    },
    {
      question: "How do two months come on the house?",
      answer:
        "Choose yearly billing and you pay for ten months and dine for twelve. The saving is applied to every menu and side.",
    },
    {
      question: "Can I cancel?",
      answer:
        "At any time, from the settings page. Your table stays set until the end of the billing period, and you may take every recipe with you.",
    },
  ],

  smallPrint: [
    "Prices are per month in US dollars and exclude applicable taxes.",
    "Yearly billing is charged in advance for twelve months.",
    "Menu subject to seasonal change. Gratuity is never added.",
  ],

  copy: {
    meta: {
      title: "Pricing",
      description: "Three set menus, a few sides and a wine list. Choose your table.",
    },
    masthead: {
      established: "Est.",
      title: "Prix Fixe",
      intro: "Three set menus, priced per seat. Sides and pairings at your pleasure.",
    },
    billing: {
      legend: "Billing",
      monthly: "Monthly",
      yearly: "Yearly",
      yearlyNote: "two months on the house",
      periodMonthly: "a month, billed monthly",
      periodYearly: "a month, billed yearly",
    },
    menus: {
      heading: "The set menus",
      free: "Free",
      freePeriod: "for as long as you stay",
      perSeat: "per seat",
      marketPrice: "Market price",
      marketPeriod: "composed for your party",
      recommended: "Chef’s recommendation",
      dishesLabel: "Courses",
      order: "Order this menu",
      book: "Book the table",
      bookSubject: "Table request",
    },
    sides: {
      heading: "Sides",
      intro: "Served with any menu. Priced per month.",
      seatsLabel: "Seats",
      seatsHint: "How many at the table?",
      addSeat: "Add a seat",
      removeSeat: "Remove a seat",
      perSeat: "per seat",
    },
    pairing: {
      heading: "Wine pairing",
      intro: "Integrations, poured with the menus noted.",
      pairsWith: "Pairs with",
    },
    legend: { heading: "Marks" },
    chef: {
      heading: "A note from the chef",
      intro: "A few questions we are asked at the table.",
      signature: "The kitchen team",
    },
    smallPrint: { heading: "Small print" },
    ticket: {
      title: "Kitchen ticket",
      close: "Close the ticket",
      table: "Table",
      covers: "Covers",
      server: "Server",
      billing: "Billing",
      seats: "Seats",
      sides: "Sides",
      noSides: "No sides",
      subtotal: "Subtotal",
      houseDiscount: "Two months on the house",
      total: "Total per month",
      billedMonthly: "Billed monthly",
      billedYearly: "Billed yearly at",
      send: "Send to kitchen",
      footer: "Thank you · merci",
    },
  },
} satisfies PrixFixeConfig;

export type Config = typeof config;
