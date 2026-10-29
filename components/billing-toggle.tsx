"use client";

import { motion } from "motion/react";
import { useId } from "react";
import type { Billing, Copy } from "@/lib/types";
import { useOrder } from "./order-context";

const cycles: Billing[] = ["monthly", "yearly"];

export function BillingToggle({ copy }: { copy: Copy["billing"] }) {
  const { billing, setBilling } = useOrder();
  const id = useId();
  const noteId = `${id}-note`;

  return (
    <>
      <p className="print-only print-billing">
        {billing === "yearly" ? `${copy.yearly} · ${copy.periodYearly} · ${copy.yearlyNote}` : `${copy.monthly} · ${copy.periodMonthly}`}
      </p>
      <fieldset className="screen-only mx-auto grid w-full max-w-xs grid-cols-2 justify-items-center gap-y-2">
        <legend className="sr-only">{copy.legend}</legend>
        <div className="col-span-2 grid w-full grid-cols-2 rounded-full border border-rule p-1 font-sans text-sm font-medium">
          {cycles.map((cycle) => {
            const checked = billing === cycle;
            return (
              <label
                key={cycle}
                className="relative isolate flex min-h-11 cursor-pointer select-none items-center justify-center rounded-full px-4 outline-offset-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus has-[:focus-visible]:outline-solid"
              >
                <input
                  type="radio"
                  name={`${id}-billing`}
                  value={cycle}
                  checked={checked}
                  onChange={() => setBilling(cycle)}
                  aria-describedby={cycle === "yearly" ? noteId : undefined}
                  className="sr-only"
                />
                {checked && (
                  <motion.span
                    layoutId={`${id}-pill`}
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
                  />
                )}
                <span className={`transition-colors duration-200 ${checked ? "text-on-ink" : "text-ink"}`}>
                  {cycle === "monthly" ? copy.monthly : copy.yearly}
                </span>
              </label>
            );
          })}
        </div>
        <p id={noteId} className="col-start-2 text-center text-base italic leading-tight text-accent-ink">
          {copy.yearlyNote}
        </p>
        <p className="sr-only" aria-live="polite">
          {billing === "yearly" ? copy.periodYearly : copy.periodMonthly}
        </p>
      </fieldset>
    </>
  );
}
