"use client";

import { MotionConfig } from "motion/react";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Billing } from "@/lib/types";

interface OrderContextValue {
  billing: Billing;
  setBilling: (billing: Billing) => void;
  seats: number;
  setSeats: (seats: number) => void;
  seatLimits: { min: number; max: number };
  sides: readonly string[];
  toggleSide: (id: string) => void;
  /** Menu whose ticket is open, or null. */
  ticketMenuId: string | null;
  openTicket: (menuId: string, trigger: HTMLElement | null) => void;
  closeTicket: () => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function useOrder(): OrderContextValue {
  const value = use(OrderContext);
  if (!value) throw new Error("useOrder must be used inside <OrderProvider>");
  return value;
}

export function OrderProvider({
  children,
  defaultBilling,
  seats: seatConfig,
}: {
  children: ReactNode;
  defaultBilling: Billing;
  seats: { min: number; max: number; default: number };
}) {
  const [billing, setBilling] = useState<Billing>(defaultBilling);
  const [seats, setSeatsState] = useState(seatConfig.default);
  const [sides, setSides] = useState<readonly string[]>([]);
  const [ticketMenuId, setTicketMenuId] = useState<string | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const { min, max } = seatConfig;
  const setSeats = useCallback(
    (next: number) => {
      if (!Number.isFinite(next)) return;
      setSeatsState(Math.min(max, Math.max(min, Math.round(next))));
    },
    [min, max],
  );

  const toggleSide = useCallback((id: string) => {
    setSides((current) => (current.includes(id) ? current.filter((s) => s !== id) : [...current, id]));
  }, []);

  const openTicket = useCallback((menuId: string, el: HTMLElement | null) => {
    trigger.current = el;
    setTicketMenuId(menuId);
  }, []);

  const closeTicket = useCallback(() => setTicketMenuId(null), []);

  // Return focus to the button that opened the ticket once the page is interactive again.
  useEffect(() => {
    if (ticketMenuId === null && trigger.current) {
      trigger.current.focus();
      trigger.current = null;
    }
  }, [ticketMenuId]);

  const value = useMemo<OrderContextValue>(
    () => ({
      billing,
      setBilling,
      seats,
      setSeats,
      seatLimits: { min, max },
      sides,
      toggleSide,
      ticketMenuId,
      openTicket,
      closeTicket,
    }),
    [billing, seats, setSeats, min, max, sides, toggleSide, ticketMenuId, openTicket, closeTicket],
  );

  return (
    <MotionConfig reducedMotion="user">
      <OrderContext value={value}>{children}</OrderContext>
    </MotionConfig>
  );
}

/** The page behind the ticket: inert while the ticket dialog is open. */
export function OrderMain({ children, className }: { children: ReactNode; className?: string }) {
  const { ticketMenuId } = useOrder();
  return (
    <main id="main" className={className} inert={ticketMenuId !== null}>
      {children}
    </main>
  );
}
