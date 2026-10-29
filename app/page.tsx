import { BillingToggle } from "@/components/billing-toggle";
import { ChefNote } from "@/components/chef-note";
import { KitchenTicket } from "@/components/kitchen-ticket";
import { Legend } from "@/components/legend";
import { Divider, Masthead } from "@/components/menu-parts";
import { OrderMain, OrderProvider } from "@/components/order-context";
import { SetMenus } from "@/components/set-menus";
import { Sides } from "@/components/sides";
import { SmallPrint } from "@/components/small-print";
import { WinePairing } from "@/components/wine-pairing";
import { cycleLabels } from "@/lib/format";
import { config } from "@/prixfixe.config";

export default function PricingPage() {
  const { copy } = config;
  // Prices are formatted on the server and handed to the client as strings,
  // so the server and the browser always render the same text.
  const sides = config.sides.map((side) => ({ ...side, label: cycleLabels(side.price, config) }));

  return (
    <OrderProvider defaultBilling={config.billing.default} seats={config.seats}>
      <OrderMain className="px-3 py-6 sm:px-6 sm:py-14">
        <article className="menu-card grain @container relative mx-auto w-full max-w-[760px] rounded-[3px] px-6 py-12 sm:px-14 sm:py-16">
          <div className="double-rule" aria-hidden="true" />
          <div className="menu-content flex flex-col gap-12 sm:gap-14">
            <Masthead house={config.house} copy={copy.masthead} />
            <BillingToggle copy={copy.billing} />
            <SetMenus config={config} />
            <Divider />
            <Sides sides={sides} copy={copy.sides} />
            <WinePairing config={config} />
            <Divider />
            <Legend marks={config.marks} copy={copy} />
            <ChefNote faq={config.faq} copy={copy.chef} />
            <SmallPrint lines={config.smallPrint} copy={copy.smallPrint} />
          </div>
        </article>
      </OrderMain>
      <KitchenTicket config={config} />
    </OrderProvider>
  );
}
