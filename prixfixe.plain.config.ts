import type { PrixFixeConfig } from "@/lib/types";

/**
 * Prix Fixe — plain-copy example. Copy this file over prixfixe.config.ts to use it.
 * Every word, price and link on the page comes from here.
 * Colors live in app/theme.css.
 *
 * All names below are fictional placeholders.
 */
export const config = {
  house: {
    name: "Acme",
    tagline: "Workspace software for teams",
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
    { id: "signature", symbol: "S", label: "Core feature" },
    { id: "new", symbol: "N", label: "New feature" },
    { id: "limited", symbol: "L", label: "Usage limit" },
    { id: "beta", symbol: "B", label: "Beta feature" },
  ],

  menus: [
    {
      id: "counter",
      name: "Starter",
      blurb: "Essential tools for individuals and small projects.",
      price: 0,
      dishes: [
        { name: "Three workspaces", note: "with unlimited documents", marks: ["limited"] },
        { name: "Seven days of history", note: "restore changes from the past week", marks: ["limited"] },
        { name: "Shared links", note: "share documents with a link" },
        { name: "Community support", note: "get help from other users" },
      ],
    },
    {
      id: "tasting",
      name: "Team",
      blurb: "Advanced collaboration for growing teams.",
      price: 24,
      recommended: true,
      dishes: [
        { name: "Unlimited workspaces", note: "organize every project in one place", marks: ["signature"] },
        { name: "A year of history", note: "restore versions from the past year" },
        { name: "Automations", note: "automate recurring workflows", marks: ["new"] },
        { name: "Guest access", note: "invite external collaborators" },
        { name: "Priority support", note: "get faster support responses" },
      ],
    },
    {
      id: "chefs-table",
      name: "Enterprise",
      blurb: "Security, control, and support for larger organizations.",
      price: "market",
      dishes: [
        { name: "Everything in Team", note: "plus organization-wide administration" },
        { name: "Single sign-on", note: "use your identity provider" },
        { name: "Audit log", note: "review organization activity" },
        { name: "Regional data residency", note: "choose where your data is stored", marks: ["beta"] },
        { name: "A dedicated manager", note: "a dedicated point of contact", marks: ["signature"] },
      ],
    },
  ],

  sides: [
    { id: "storage", name: "Additional storage", note: "100 GB of additional storage", price: 12, per: "table" },
    { id: "analytics", name: "Analytics", note: "weekly usage and performance reports", price: 6, per: "seat" },
    { id: "sandbox", name: "Sandbox", note: "an isolated workspace for testing", price: 18, per: "table" },
    { id: "runs", name: "Additional runs", note: "10,000 additional automation runs", price: 30, per: "table" },
  ],

  pairings: [
    {
      id: "calendar",
      name: "Calendar",
      style: "Two-way synchronization",
      notes: "Keep events and recurring meetings synchronized.",
      pairsWith: ["counter", "tasting", "chefs-table"],
    },
    {
      id: "chat",
      name: "Team chat",
      style: "Real-time notifications",
      notes: "Receive updates when tasks and projects change.",
      pairsWith: ["tasting", "chefs-table"],
    },
    {
      id: "source",
      name: "Source control",
      style: "Linked commits",
      notes: "Connect commits and pull requests to your work.",
      pairsWith: ["tasting", "chefs-table"],
    },
    {
      id: "warehouse",
      name: "Data warehouse",
      style: "Scheduled data export",
      notes: "Export data nightly for reporting and analysis.",
      pairsWith: ["chefs-table"],
    },
  ],

  faq: [
    {
      question: "Can I change my plan?",
      answer:
        "Change plans at any time. Charges are prorated to the day.",
    },
    {
      question: "What counts as a seat?",
      answer:
        "Each active member counts as one seat. Read-only guests are free.",
    },
    {
      question: "How does annual billing work?",
      answer:
        "Annual billing includes twelve months of access for the price of ten. The discount applies to plans and add-ons.",
    },
    {
      question: "Can I cancel?",
      answer:
        "Cancel at any time in settings. Access continues until the end of the billing period, and you can export your data.",
    },
  ],

  smallPrint: [
    "Prices are per month in US dollars and exclude applicable taxes.",
    "Yearly billing is charged in advance for twelve months.",
    "Plans and features are subject to change.",
  ],

  copy: {
    meta: {
      title: "Pricing",
      description: "Clear plans for individuals, teams, and organizations.",
    },
    masthead: {
      established: "Est.",
      title: "Plans & pricing",
      intro: "Choose a plan, add the tools you need, and grow at your own pace.",
    },
    billing: {
      legend: "Billing",
      monthly: "Monthly",
      yearly: "Yearly",
      yearlyNote: "two months included",
      periodMonthly: "a month, billed monthly",
      periodYearly: "a month, billed yearly",
    },
    menus: {
      heading: "Plans",
      free: "Free",
      freePeriod: "no time limit",
      perSeat: "per seat",
      marketPrice: "Custom pricing",
      marketPeriod: "tailored to your organization",
      recommended: "Recommended",
      dishesLabel: "Features",
      order: "Choose this plan",
      book: "Contact sales",
      bookSubject: "Enterprise inquiry",
    },
    sides: {
      heading: "Add-ons",
      intro: "Available with every plan. Priced per month.",
      seatsLabel: "Seats",
      seatsHint: "Number of team members",
      addSeat: "Add a seat",
      removeSeat: "Remove a seat",
      perSeat: "per seat",
    },
    pairing: {
      heading: "Integrations",
      intro: "Connect the tools your team uses.",
      pairsWith: "Included with",
    },
    legend: { heading: "Feature key" },
    chef: {
      heading: "Frequently asked questions",
      intro: "Details about your subscription.",
      signature: "The customer success team",
    },
    smallPrint: { heading: "Small print" },
    ticket: {
      title: "Order summary",
      close: "Close order summary",
      table: "Reference",
      covers: "Members",
      server: "Contact",
      billing: "Billing",
      seats: "Seats",
      sides: "Add-ons",
      noSides: "No add-ons",
      subtotal: "Subtotal",
      houseDiscount: "Annual discount",
      total: "Total per month",
      billedMonthly: "Billed monthly",
      billedYearly: "Billed yearly at",
      send: "Continue to checkout",
      footer: "Thank you for choosing Acme",
    },
  },
} satisfies PrixFixeConfig;

export type Config = typeof config;
