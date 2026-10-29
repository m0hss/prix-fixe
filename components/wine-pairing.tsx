import type { PrixFixeConfig } from "@/lib/types";
import { SectionTitle } from "./menu-parts";

export function WinePairing({ config }: { config: PrixFixeConfig }) {
  const { copy, house } = config;
  const menuNames = new Map(config.menus.map((m) => [m.id, m.name]));
  const list = new Intl.ListFormat(house.locale, { style: "long", type: "conjunction" });

  return (
    <section aria-labelledby="pairing-heading" className="screen-only flex flex-col gap-6">
      <SectionTitle id="pairing-heading">{copy.pairing.heading}</SectionTitle>
      <p className="text-center text-base italic text-muted-ink">{copy.pairing.intro}</p>
      <ul className="grid gap-x-10 gap-y-7 @xl:grid-cols-2">
        {config.pairings.map((pairing) => {
          const pairs = pairing.pairsWith.map((id) => menuNames.get(id)).filter((n): n is string => Boolean(n));
          return (
            <li key={pairing.id} className="flex flex-col gap-1">
              <h3 className="text-xl font-medium italic leading-tight">{pairing.name}</h3>
              <p className="caps text-[0.9375rem] text-muted-ink">{pairing.style}</p>
              <p className="text-base leading-snug">{pairing.notes}</p>
              {pairs.length > 0 && (
                <p className="text-base italic leading-snug text-muted-ink">
                  {copy.pairing.pairsWith} {list.format(pairs)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
