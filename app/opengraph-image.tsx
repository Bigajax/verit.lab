import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site.config";

// Imagem de compartilhamento (WhatsApp, Instagram, iMessage): a mesma
// marca do favicon (app/icon.png) — o "v." em âmbar sobre o preto do
// site — em 1200×630, com o nome embaixo. As páginas de peça sobrescrevem
// com a foto da peça (generateMetadata em app/pecas/[slug]/page.tsx).
export const alt = `${site.nome} · Nada aqui se repete.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Instrument Serif itálica, a mesma da logo no header. Satori não lê
  // woff2, por isso o TTF fica versionado em app/fonts.
  const instrument = await readFile(
    join(process.cwd(), "app/fonts/InstrumentSerif-Italic.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 80% at 50% 0%, #15110d 0%, #100d0a 60%)",
          fontFamily: "Instrument Serif",
          fontStyle: "italic",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 420,
            lineHeight: 0.8,
            color: "#e1892f",
            marginTop: -20,
          }}
        >
          v.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 64,
            color: "#ede4d7",
          }}
        >
          {site.nome}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Instrument Serif",
          data: instrument,
          style: "italic",
          weight: 400,
        },
      ],
    },
  );
}
