import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/data/site.config";

// Imagem de compartilhamento (WhatsApp, Instagram, iMessage): a logo de
// outubro de 2026, ciano sobre o magenta da foto do perfil, como o favicon
// (app/icon.png), em 1200×630. As páginas de peça sobrescrevem com a foto
// da peça (generateMetadata em app/pecas/[slug]/page.tsx).
export const alt = `${site.nome} · Nada aqui se repete.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/marca/logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c000c7",
        }}
      >
        {/* 857×410 é o tamanho do recorte em public/marca/logo.png */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={760} height={364} alt="" />
      </div>
    ),
    size,
  );
}
