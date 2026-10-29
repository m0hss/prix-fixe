import type { ReactNode } from "react";
import type { Copy, House, Mark as MarkType } from "@/lib/types";
import { Crest, Ornament, Toque } from "./ornaments";

export function Masthead({ house, copy }: { house: House; copy: Copy["masthead"] }) {
  return (
    <header className="masthead flex flex-col items-center text-center">
      <Crest monogram={house.monogram} className="size-20 sm:size-24" />
      <h1 className="house-caps mt-4 pl-[0.24em] text-4xl font-semibold leading-none sm:text-5xl">{house.name}</h1>
      <p className="mt-3 text-base italic text-muted-ink sm:text-lg">
        {house.tagline}
        <span aria-hidden="true" className="mx-2 not-italic text-rule">
          ·
        </span>
        <span className="oldstyle not-italic">
          {copy.established} {house.established}
        </span>
      </p>
      <Ornament className="mt-6 h-3 w-32" />
      <p className="mt-5 text-5xl font-medium italic leading-none tracking-tight sm:text-6xl">{copy.title}</p>
      <p className="mt-4 max-w-md text-lg leading-snug text-muted-ink">{copy.intro}</p>
    </header>
  );
}

export function SectionTitle({ id, children, small = false }: { id: string; children: ReactNode; small?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 id={id} className={`caps pl-[0.2em] text-center ${small ? "text-base" : "text-xl sm:text-2xl"}`}>
        {children}
      </h2>
      <Ornament className="h-3 w-28" />
    </div>
  );
}

/** Circled feature mark. The circle is decorative; the label is read aloud. */
export function Mark({ mark }: { mark: MarkType }) {
  return (
    <>
      <span className="mark" aria-hidden="true" title={mark.label}>
        {mark.symbol}
      </span>
      <span className="sr-only">({mark.label})</span>
    </>
  );
}

/** The "Chef's recommendation" mark. */
export function ChefMark({ label, className }: { label: string; className?: string }) {
  return (
    <p className={`flex items-center justify-center gap-1.5 text-base italic text-accent-ink ${className ?? ""}`}>
      <Toque className="size-5" />
      <span>{label}</span>
    </p>
  );
}

export function Divider() {
  return <hr className="mx-auto my-0 w-full border-0 border-t border-rule/50" />;
}
