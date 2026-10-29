"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { formatExact } from "@/lib/format";
import { checkoutHref, computeOrder } from "@/lib/order";
import { buttonPrimary } from "@/lib/styles";
import type { PrixFixeConfig, Selection } from "@/lib/types";
import { ArrowIcon, CloseIcon } from "./ornaments";
import { useOrder } from "./order-context";

/** The ticket dialog. Renders nothing until a menu is ordered. */
export function KitchenTicket({ config }: { config: PrixFixeConfig }) {
  const { ticketMenuId, closeTicket, billing, seats, sides } = useOrder();
  return (
    <AnimatePresence>
      {ticketMenuId !== null && (
        <TicketDialog
          key="ticket"
          config={config}
          selection={{ menuId: ticketMenuId, billing, seats, sides }}
          onClose={closeTicket}
        />
      )}
    </AnimatePresence>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
const ease = [0.22, 0.8, 0.2, 1] as const;

function TicketDialog({
  config,
  selection,
  onClose,
}: {
  config: PrixFixeConfig;
  selection: Selection;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  // Only ever rendered in the browser (after a click), so reading matchMedia here is safe.
  const [desktop] = useState(() => window.matchMedia("(min-width: 48rem)").matches);
  const [printedAt] = useState(() => new Date());
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const { copy, house } = config;
  const t = copy.ticket;
  const order = computeOrder(config, selection);
  const money = (minor: number) => formatExact(minor, house, order.fractionDigits);
  const href = checkoutHref(config, selection);
  const when = new Intl.DateTimeFormat(house.locale, { dateStyle: "medium", timeStyle: "short" }).format(printedAt);

  // Focus the dialog and lock page scroll while it is open. The scrollbar's
  // width is put back as padding so the page behind does not shift.
  useEffect(() => {
    closeRef.current?.focus();
    const root = document.documentElement;
    const body = document.body;
    const scrollbar = window.innerWidth - root.clientWidth;
    const previous = { overflow: root.style.overflow, padding: body.style.paddingRight };
    root.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      root.style.overflow = previous.overflow;
      body.style.paddingRight = previous.padding;
    };
  }, []);

  // Esc closes; Tab and Shift+Tab stay inside the dialog.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const [menuLine, ...sideLines] = order.lines;
  const billingLabel = order.billing === "yearly" ? copy.billing.yearly : copy.billing.monthly;

  const rows: ReactNode[] = [
    <p key="house" className="text-center text-base font-semibold uppercase tracking-[0.3em]">
      {house.name}
    </p>,
    <p key="tagline" className="text-center text-xs text-ticket-muted">
      {house.tagline}
    </p>,
    <Rule key="r1" />,
    <div key="meta" className="grid grid-cols-3 gap-2 text-xs uppercase">
      <Meta label={t.table} value={config.ticket.table} />
      <Meta label={t.covers} value={String(order.seats)} align="center" />
      <Meta label={t.server} value={config.ticket.server} align="end" />
    </div>,
    <p key="when" className="text-center text-xs text-ticket-muted">
      {when}
    </p>,
    <Rule key="r2" double />,
    <p key="menu" className="font-semibold uppercase">
      {menuLine.name}
    </p>,
    <Line key="billing" label={t.billing} value={billingLabel} indent />,
    <Line
      key="seats"
      label={`${t.seats} ${menuLine.quantity} × ${money(menuLine.unitAmount)}`}
      value={money(menuLine.amount)}
      indent
    />,
    <p key="sides" className="pt-2 text-xs uppercase tracking-wider text-ticket-muted">
      {sideLines.length ? t.sides : t.noSides}
    </p>,
    ...sideLines.map((line) => (
      <Line
        key={`side-${line.id}`}
        label={line.quantity > 1 ? `${line.name} ${line.quantity} × ${money(line.unitAmount)}` : line.name}
        value={money(line.amount)}
        indent
      />
    )),
    <Rule key="r3" />,
    <Line key="subtotal" label={t.subtotal} value={money(order.subtotal)} />,
    ...(order.discount > 0
      ? [<Line key="discount" label={t.houseDiscount} value={money(-order.discount)} />]
      : []),
    <Line key="total" strong large label={t.total} value={money(order.total)} />,
    <p key="billed" className="text-right text-xs text-ticket-muted">
      {order.billing === "yearly" ? `${t.billedYearly} ${money(order.billedPerPeriod)}` : t.billedMonthly}
    </p>,
    <Rule key="r4" double />,
    <p key="thanks" className="text-center text-xs uppercase tracking-[0.25em]">
      {t.footer}
    </p>,
    <div key="code" aria-hidden="true" className="mx-auto mt-1 h-8 w-4/5 bg-[repeating-linear-gradient(90deg,var(--ticket-ink)_0_2px,transparent_2px_3px,var(--ticket-ink)_3px_4px,transparent_4px_7px,var(--ticket-ink)_7px_10px,transparent_10px_12px)]" />,
  ];

  return (
    <div className="screen-only fixed inset-0 z-50">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-scrim"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        initial={desktop ? { x: "100%" } : { y: "100%" }}
        animate={{ x: 0, y: 0 }}
        exit={desktop ? { x: "100%" } : { y: "100%" }}
        transition={{ duration: 0.38, ease }}
        className="linen absolute inset-x-0 bottom-0 flex h-[88dvh] flex-col rounded-t-[1.25rem] border-t border-rule/60 shadow-[0_-12px_40px_var(--shadow)] md:inset-y-0 md:right-0 md:left-auto md:h-dvh md:w-[26rem] md:rounded-none md:border-t-0 md:border-l"
      >
        <header className="flex items-center justify-between gap-4 py-2 pr-2 pl-6">
          <h2 id={titleId} className="caps pl-[0.2em] text-lg">
            {t.title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
          >
            <CloseIcon className="size-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-1 pb-6">
          <div className="ticket-shadow mx-auto max-w-[22rem]">
            <div className="ticket font-mono text-[0.8125rem] leading-relaxed">
              {rows.map((row, i) => (
                <motion.div
                  key={i}
                  className="overflow-hidden"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ delay: 0.32 + i * 0.075, duration: 0.14, ease: "linear" }}
                >
                  <div className="py-0.5">{row}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <footer className="border-t border-rule/50 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <a href={href} className={`${buttonPrimary} w-full`}>
            {t.send}
            <ArrowIcon className="size-4" />
          </a>
        </footer>
      </motion.div>
    </div>
  );
}

function Rule({ double = false }: { double?: boolean }) {
  return <div aria-hidden="true" className={`my-1.5 ${double ? "ticket-rule-double" : "ticket-rule"}`} />;
}

function Meta({ label, value, align = "start" }: { label: string; value: string; align?: "start" | "center" | "end" }) {
  const alignment = { start: "text-left", center: "text-center", end: "text-right" }[align];
  return (
    <p className={alignment}>
      <span className="block text-ticket-muted">{label}</span>
      <span className="block font-semibold">{value}</span>
    </p>
  );
}

function Line({
  label,
  value,
  strong = false,
  large = false,
  indent = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  large?: boolean;
  indent?: boolean;
}) {
  return (
    <p
      className={`flex items-baseline justify-between gap-4 ${strong ? "font-semibold uppercase" : ""} ${
        large ? "text-[0.9375rem]" : ""
      } ${indent ? "pl-3" : ""}`}
    >
      <span className="min-w-0">{label}</span>
      <span className="flex-none tabular-nums">{value}</span>
    </p>
  );
}
