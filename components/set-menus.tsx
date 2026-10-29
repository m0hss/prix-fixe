import { cycleLabels } from "@/lib/format";
import { bookingHref } from "@/lib/order";
import { buttonPrimary, buttonSecondary } from "@/lib/styles";
import type { PrixFixeConfig, SetMenu } from "@/lib/types";
import { CyclePrice } from "./cycle-price";
import { ChefMark, Mark, SectionTitle } from "./menu-parts";
import { OrderButton } from "./order-button";


export function SetMenus({ config }: { config: PrixFixeConfig }) {
  const { copy } = config;
  return (
    <section aria-labelledby="menus-heading" className="flex flex-col gap-8">
      <SectionTitle id="menus-heading">{copy.menus.heading}</SectionTitle>
      <ul className="menu-columns grid gap-y-12 @xl:grid-cols-3 @xl:grid-rows-[repeat(6,auto)] @xl:gap-y-0">
        {config.menus.map((menu, i) => (
          <MenuColumn key={menu.id} menu={menu} config={config} first={i === 0} />
        ))}
      </ul>
    </section>
  );
}

function MenuColumn({ menu, config, first }: { menu: SetMenu; config: PrixFixeConfig; first: boolean }) {
  const { copy } = config;
  const headingId = `menu-${menu.id}`;
  const marks = new Map(config.marks.map((m) => [m.id, m]));

  return (
    <li
      className={`menu-column flex flex-col items-center gap-3 text-center @xl:row-span-6 @xl:grid @xl:grid-rows-subgrid @xl:content-start @xl:items-start @xl:gap-y-3 @xl:px-4 ${
        first ? "" : "border-t border-rule/50 pt-12 @xl:border-t-0 @xl:border-l @xl:pt-0"
      }`}
    >
      {/* Row 1: recommendation mark (kept as an empty row on the others so columns align). */}
      {menu.recommended ? (
        <ChefMark label={copy.menus.recommended} className="min-h-6 @xl:self-end" />
      ) : (
        <span aria-hidden="true" className="hidden min-h-6 @xl:block" />
      )}

      {/* Row 2: name */}
      <h3 id={headingId} className="caps text-balance pl-[0.2em] text-xl leading-tight sm:text-2xl @xl:self-end @xl:text-[1.375rem]">
        {menu.name}
      </h3>

      {/* Row 3: blurb */}
      <p className="max-w-xs text-base italic leading-snug text-muted-ink">{menu.blurb}</p>

      {/* Row 4: price */}
      <MenuPrice menu={menu} config={config} />

      {/* Row 5: dishes */}
      <ul aria-label={copy.menus.dishesLabel} className="mt-2 flex max-w-xs flex-col gap-3.5 @xl:self-start">
        {menu.dishes.map((dish) => (
          <li key={dish.name} className="leading-snug">
            <span className="text-lg italic">{dish.name}</span>
            {dish.marks?.length ? (
              <span className="ml-1.5 inline-flex gap-1 align-middle">
                {dish.marks.map((id) => {
                  const mark = marks.get(id);
                  return mark ? <Mark key={id} mark={mark} /> : null;
                })}
              </span>
            ) : null}
            <span className="block text-base text-muted-ink">{dish.note}</span>
          </li>
        ))}
      </ul>

      {/* Row 6: call to action */}
      <div className="screen-only mt-4 flex w-full justify-center @xl:mt-6 @xl:self-end">
        {menu.price === "market" ? (
          <a href={bookingHref(config, menu)} className={`${buttonSecondary} w-full max-w-xs`}>
            {copy.menus.book}
          </a>
        ) : (
          <OrderButton
            menuId={menu.id}
            className={`${menu.recommended ? buttonPrimary : buttonSecondary} w-full max-w-xs`}
          >
            {copy.menus.order}
          </OrderButton>
        )}
      </div>
    </li>
  );
}

function MenuPrice({ menu, config }: { menu: SetMenu; config: PrixFixeConfig }) {
  const { copy } = config;

  if (menu.price === "market" || menu.price === 0) {
    const market = menu.price === "market";
    return (
      <div className="flex flex-col items-center gap-1">
        <p className="text-4xl font-medium italic leading-tight sm:text-[2.5rem] @xl:text-[2.25rem]">
          {market ? copy.menus.marketPrice : copy.menus.free}
        </p>
        <p className="text-sm italic text-muted-ink">{market ? copy.menus.marketPeriod : copy.menus.freePeriod}</p>
      </div>
    );
  }

  const price = cycleLabels(menu.price, config);
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="flex items-baseline justify-center gap-2 leading-tight">
        <CyclePrice
          monthly={price.monthly}
          yearly={price.yearly}
          className="oldstyle text-4xl font-medium sm:text-[2.5rem] @xl:text-[2.25rem]"
        />
        <span className="text-base italic text-muted-ink">{copy.menus.perSeat}</span>
      </p>
      <p className="text-sm italic text-muted-ink">
        <CyclePrice monthly={copy.billing.periodMonthly} yearly={copy.billing.periodYearly} />
      </p>
    </div>
  );
}
