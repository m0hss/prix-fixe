import { ImageResponse } from "next/og";
import { config } from "@/prixfixe.config";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Keep in sync with --card, --rule, and --ink brand tokens in theme.css.
const colors = { card: "#f6f0e4", rule: "#b08d57", ink: "#1c1a17" };

const font = readFile(join(process.cwd(), "public/fonts/CormorantGaramond-OG.ttf"));

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.card,
          borderRadius: "50%",
          border: `2px solid ${colors.rule}`,
        }}
      >
        <span
          style={{
            fontFamily: "Serif",
            fontSize: 18,
            color: colors.ink,
            lineHeight: 1,
          }}
        >
          {config.house.monogram}
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Serif", data: await font, weight: 500, style: "normal" }],
    }
  );
}
