"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import type { Copy, FaqItem } from "@/lib/types";
import { SectionTitle } from "./menu-parts";
import { PlusIcon } from "./ornaments";

export function ChefNote({ faq, copy }: { faq: readonly FaqItem[]; copy: Copy["chef"] }) {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const id = useId();

  return (
    <section aria-labelledby="chef-heading" className="screen-only flex flex-col gap-6">
      <SectionTitle id="chef-heading">{copy.heading}</SectionTitle>
      <p className="text-center text-base italic text-muted-ink">{copy.intro}</p>
      <div className="border-y border-rule/50">
        {faq.map((item, i) => {
          const expanded = open === i;
          const buttonId = `${id}-q${i}`;
          const panelId = `${id}-a${i}`;
          return (
            <div key={item.question} className={i > 0 ? "border-t border-rule/30" : undefined}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpen(expanded ? null : i)}
                  className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left text-lg italic leading-snug"
                >
                  <span>{item.question}</span>
                  <PlusIcon
                    className={`size-4 flex-none text-muted-ink transition-transform duration-300 motion-reduce:transition-none ${
                      expanded ? "rotate-45" : ""
                    }`}
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 0.7, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-lg italic leading-snug text-muted-ink">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <p className="text-right text-lg italic">
        <span aria-hidden="true">— </span>
        {copy.signature}
      </p>
    </section>
  );
}
