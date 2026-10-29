"use client";

import { useId, useState } from "react";
import type { Copy, Side } from "@/lib/types";
import { CyclePrice } from "./cycle-price";
import { SectionTitle } from "./menu-parts";
import { CheckIcon, MinusIcon, PlusIcon } from "./ornaments";
import { useOrder } from "./order-context";

export interface SideWithPrice extends Side {
  label: { monthly: string; yearly: string };
}

export function Sides({ sides, copy }: { sides: readonly SideWithPrice[]; copy: Copy["sides"] }) {
  const { sides: chosen, toggleSide } = useOrder();

  return (
    <section aria-labelledby="sides-heading" className="flex flex-col gap-6">
      <SectionTitle id="sides-heading">{copy.heading}</SectionTitle>
      <p className="text-center text-base italic text-muted-ink">{copy.intro}</p>

      <SeatStepper copy={copy} />

      <ul className="flex flex-col">
        {sides.map((side) => {
          const checked = chosen.includes(side.id);
          return (
            <li key={side.id}>
              <label className="side-row group flex min-h-11 cursor-pointer items-start gap-3 py-2.5">
                <span className="screen-only relative mt-1.5 grid size-5 flex-none place-items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSide(side.id)}
                    className="peer size-5 cursor-pointer appearance-none rounded-[4px] border border-ink/60 bg-card transition-colors checked:border-ink checked:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  />
                  <CheckIcon className="pointer-events-none absolute size-3.5 text-on-ink opacity-0 peer-checked:opacity-100" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex items-baseline gap-2">
                    <span className="text-lg italic leading-snug">{side.name}</span>
                    <span className="leader" aria-hidden="true" />
                    <span className="flex flex-none items-baseline gap-1.5 text-lg leading-snug">
                      <CyclePrice
                        monthly={side.label.monthly}
                        yearly={side.label.yearly}
                        align="end"
                        className="oldstyle font-medium"
                      />
                      {side.per === "seat" && (
                        <span className="text-sm italic text-muted-ink">{copy.perSeat}</span>
                      )}
                    </span>
                  </span>
                  <span className="text-base leading-snug text-muted-ink">{side.note}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SeatStepper({ copy }: { copy: Copy["sides"] }) {
  const { seats, setSeats, seatLimits } = useOrder();
  const [draft, setDraft] = useState<string | null>(null);
  const id = useId();
  const hintId = `${id}-hint`;
  const atMin = seats <= seatLimits.min;
  const atMax = seats >= seatLimits.max;

  const step = (delta: number) => {
    setDraft(null);
    setSeats(seats + delta);
  };

  // Commit what was typed, clamped to the limits; anything unparseable falls back.
  const commit = () => {
    if (draft !== null) {
      const n = Number.parseInt(draft, 10);
      if (Number.isFinite(n)) setSeats(n);
    }
    setDraft(null);
  };

  return (
    <div className="screen-only flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y border-rule/50 py-3">
      <div className="flex flex-col">
        <label htmlFor={id} className="caps text-base">
          {copy.seatsLabel}
        </label>
        <span id={hintId} className="text-base italic text-muted-ink">
          {copy.seatsHint}
        </span>
      </div>
      <div className="flex items-center rounded-full border border-ink/40 font-sans">
        <button
          type="button"
          aria-label={copy.removeSeat}
          aria-controls={id}
          aria-disabled={atMin}
          onClick={() => !atMin && step(-1)}
          className="grid size-11 place-items-center rounded-full transition-colors hover:bg-ink/[0.06] aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
        >
          <MinusIcon className="size-4" />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={seatLimits.min}
          max={seatLimits.max}
          step={1}
          value={draft ?? String(seats)}
          aria-describedby={hintId}
          onChange={(event) => {
            const value = event.target.value;
            setDraft(value);
            const n = Number.parseInt(value, 10);
            if (Number.isFinite(n) && n >= seatLimits.min && n <= seatLimits.max) setSeats(n);
          }}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === "Enter") commit();
          }}
          className="h-11 w-14 appearance-none rounded-md bg-transparent text-center text-base font-medium tabular-nums [-moz-appearance:textfield] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-focus [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={copy.addSeat}
          aria-controls={id}
          aria-disabled={atMax}
          onClick={() => !atMax && step(1)}
          className="grid size-11 place-items-center rounded-full transition-colors hover:bg-ink/[0.06] aria-disabled:cursor-not-allowed aria-disabled:opacity-40"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
