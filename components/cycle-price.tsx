"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { Billing } from "@/lib/types";
import { useOrder } from "./order-context";

const cycles: Billing[] = ["monthly", "yearly"];

/**
 * Shows the monthly or yearly value and cross-fades between them.
 * Both values share one grid cell, so the box is always as wide as the
 * wider one and switching never shifts the layout.
 */
export function CyclePrice({
  monthly,
  yearly,
  align = "center",
  className,
}: {
  monthly: ReactNode;
  yearly: ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}) {
  const { billing } = useOrder();
  const justify = { start: "justify-items-start", center: "justify-items-center", end: "justify-items-end" }[align];

  if (monthly === yearly) return <span className={className}>{monthly}</span>;

  return (
    <span className={`cycle-price inline-grid ${justify} ${className ?? ""}`}>
      {cycles.map((cycle) => {
        const active = billing === cycle;
        return (
          <motion.span
            key={cycle}
            className="col-start-1 row-start-1 whitespace-nowrap"
            aria-hidden={!active}
            initial={false}
            animate={{ opacity: active ? 1 : 0, y: active ? 0 : cycle === "monthly" ? -5 : 5 }}
            transition={{ duration: 0.35, ease: [0.22, 0.7, 0.2, 1] }}
          >
            {cycle === "monthly" ? monthly : yearly}
          </motion.span>
        );
      })}
    </span>
  );
}
