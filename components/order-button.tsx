"use client";

import type { ReactNode } from "react";
import { useOrder } from "./order-context";

export function OrderButton({
  menuId,
  className,
  children,
}: {
  menuId: string;
  className?: string;
  children: ReactNode;
}) {
  const { openTicket } = useOrder();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={className}
      onClick={(event) => openTicket(menuId, event.currentTarget)}
    >
      {children}
    </button>
  );
}
