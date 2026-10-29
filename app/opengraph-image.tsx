import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { config as exampleConfig } from "@/prixfixe.config";
import type { PrixFixeConfig } from "@/lib/types";
import { computeOrder } from "@/lib/order";
import { cycleLabels, formatExact } from "@/lib/format";

const config: PrixFixeConfig = exampleConfig;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${config.house.name} — ${config.copy.masthead.title}, with a ticket printing beside the menu card`;

// ImageResponse does not consume the page stylesheet. Keep these paper colors
// aligned with the light brand tokens in theme.css when customizing the palette.
const colors = { linen: "#e9e1d2", card: "#f6f0e4", ink: "#1c1a17", muted: "#7a7166", rule: "#b08d57", accent: "#7a1f2b", ticket: "#fff" };

// Read bundled assets once, independently of incoming requests.
const fonts = Promise.all([
  readFile(join(process.cwd(), "public/fonts/CormorantGaramond-OG.ttf")),
  readFile(join(process.cwd(), "public/fonts/GeistMono-OG.ttf")),
]);

export default async function OpenGraphImage() {
  const [serif, mono] = await fonts;
  const { house, copy } = config;
  const sampleMenu = config.menus.find((menu) => menu.recommended && typeof menu.price === "number")
    ?? config.menus.find((menu) => typeof menu.price === "number");
  const order = sampleMenu ? computeOrder(config, {
    menuId: sampleMenu.id, billing: config.billing.default, seats: config.seats.default, sides: [],
  }) : null;
  const billing = config.billing.default;
  const money = (amount: number) => formatExact(amount, house, order?.fractionDigits ?? 2);

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: colors.linen, color: colors.ink, fontFamily: "Menu", padding: "34px 50px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 790, height: 562, padding: "27px 35px", background: colors.card, border: `1px solid ${colors.rule}`, boxShadow: "0 12px 32px #1c1a1726", position: "relative" }}>
        <div style={{ position: "absolute", top: 7, right: 7, bottom: 7, left: 7, border: `1px solid ${colors.rule}`, display: "flex" }} />
        <div style={{ display: "flex", border: `1px solid ${colors.rule}`, borderRadius: 50, width: 42, height: 42, alignItems: "center", justifyContent: "center", fontSize: 28 }}>{house.monogram}</div>
        <div style={{ fontSize: 29, letterSpacing: 7, marginTop: 8, textTransform: "uppercase" }}>{house.name}</div>
        <div style={{ fontSize: 18, color: colors.muted, marginTop: 3 }}>{house.tagline}</div>
        <div style={{ fontSize: 56, marginTop: 7 }}>{copy.masthead.title}</div>
        <div style={{ width: 120, height: 1, background: colors.rule, margin: "10px 0 18px" }} />
        <div style={{ display: "flex", width: "100%" }}>
          {config.menus.slice(0, 3).map((menu, index) => (
            <div key={menu.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "33.333%", padding: "0 14px", ...(index ? { borderLeft: `1px solid ${colors.rule}` } : {}), textAlign: "center" }}>
              <div style={{ display: "flex", height: 28, alignItems: "center", fontSize: 15, color: colors.accent }}>{menu.recommended ? copy.menus.recommended : " "}</div>
              <div style={{ display: "flex", height: 60, fontSize: 26, alignItems: "center", justifyContent: "center" }}>{menu.name}</div>
              <div style={{ fontSize: 31, margin: "8px 0" }}>{menu.price === "market" ? copy.menus.marketPrice : menu.price === 0 ? copy.menus.free : cycleLabels(menu.price, config)[billing]}</div>
              {menu.dishes.slice(0, 3).map((dish) => <div key={dish.name} style={{ fontSize: 18, marginTop: 9 }}>{dish.name}</div>)}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 24, fontSize: 17, color: colors.muted }}>{billing === "yearly" ? copy.billing.periodYearly : copy.billing.periodMonthly}</div>
      </div>
      <div style={{ position: "absolute", right: 45, top: 178, width: 325, height: 366, display: "flex", flexDirection: "column", transform: "rotate(5deg)" }}>
        <div style={{ position: "absolute", bottom: 0, left: -12, width: 349, height: 46, borderRadius: 12, background: colors.ink, boxShadow: "0 12px 20px #1c1a1733", display: "flex" }} />
        <div style={{ display: "flex", height: 343, overflow: "hidden", background: colors.ticket, border: "1px solid #d5cec1", padding: "22px 23px", fontFamily: "Ticket", fontSize: 14, flexDirection: "column", boxShadow: "0 5px 14px #1c1a1726" }}>
          <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              {Array.from({ length: 15 }, (_, i) => <div key={i} style={{ width: 5, height: 5, borderRadius: 5, background: colors.linen }} />)}
            </div>
            <div style={{ textAlign: "center", fontSize: 22, letterSpacing: 4, textTransform: "uppercase" }}>{house.name}</div>
            <div style={{ textAlign: "center", fontSize: 12, marginTop: 9 }}>{copy.ticket.title}</div>
            <div style={{ borderTop: `1px dashed ${colors.muted}`, margin: "18px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>{`${copy.ticket.table} ${config.ticket.table}`}</span><span>{`${copy.ticket.covers} ${config.seats.default}`}</span></div>
            <div style={{ marginTop: 12 }}>{`${copy.ticket.server}: ${config.ticket.server}`}</div>
            <div style={{ borderTop: `1px solid ${colors.ink}`, borderBottom: `1px solid ${colors.ink}`, height: 4, margin: "18px 0" }} />
            <div style={{ textTransform: "uppercase", fontSize: 17 }}>{sampleMenu?.name ?? copy.menus.marketPrice}</div>
            <div style={{ marginTop: 13 }}>{billing === "yearly" ? copy.billing.yearly : copy.billing.monthly}</div>
            {order && <div style={{ display: "flex", justifyContent: "space-between", marginTop: 13 }}><span>{`${order.seats} × ${money(order.lines[0].unitAmount)}`}</span><span>{money(order.subtotal)}</span></div>}
            <div style={{ marginTop: 18 }}>{copy.ticket.noSides}</div>
            {/* The rest of the receipt is still inside the printer. */}
            {order && <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}><span>{copy.ticket.total}</span><span>{money(order.total)}</span></div>}
            <div style={{ marginTop: 18 }}>{copy.ticket.footer}</div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 16, left: -2, width: 329, height: 7, borderRadius: 4, background: colors.ink, display: "flex" }} />
      </div>
    </div>,
    { ...size, fonts: [
      { name: "Menu", data: serif, weight: 500, style: "normal" },
      { name: "Ticket", data: mono, weight: 400, style: "normal" },
    ] },
  );
}
