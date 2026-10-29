import type { Copy } from "@/lib/types";

export function SmallPrint({ lines, copy }: { lines: readonly string[]; copy: Copy["smallPrint"] }) {
  return (
    <footer aria-labelledby="small-print-heading" className="flex flex-col items-center gap-2 text-center">
      <h2 id="small-print-heading" className="caps pl-[0.2em] text-sm text-muted-ink">
        {copy.heading}
      </h2>
      <ul className="flex flex-col gap-1 text-sm italic leading-snug text-muted-ink">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </footer>
  );
}
