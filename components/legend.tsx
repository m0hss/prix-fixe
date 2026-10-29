import type { Copy, Mark } from "@/lib/types";
import { Toque } from "./ornaments";

/**
 * Key to the marks. Screen readers already hear each mark's meaning next to
 * the dish, so the symbols here are decorative and only the labels are read.
 */
export function Legend({ marks, copy }: { marks: readonly Mark[]; copy: Copy }) {
  return (
    <section aria-labelledby="legend-heading" className="flex flex-col items-center gap-4">
      <h2 id="legend-heading" className="caps pl-[0.2em] text-base">
        {copy.legend.heading}
      </h2>
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-base">
        <li className="flex items-center gap-2">
          <Toque className="size-5 text-accent-ink" />
          <span className="italic">{copy.menus.recommended}</span>
        </li>
        {marks.map((mark) => (
          <li key={mark.id} className="flex items-center gap-2">
            <span className="mark" aria-hidden="true">
              {mark.symbol}
            </span>
            <span className="italic">{mark.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
