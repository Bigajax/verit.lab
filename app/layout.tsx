import type { Metadata, Viewport } from "next";
import { Archivo, Protest_Revolution } from "next/font/google";
import "./globals.css";
import ModalEncomenda from "@/components/ModalEncomenda";
import { site } from "@/data/site.config";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const permanent = Protest_Revolution({
  variable: "--font-permanent",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "vérít.lab · Nada aqui se repete.",
  description: site.descricao,
  metadataBase: new URL(site.url),
  // og:image vem de app/opengraph-image.tsx (a marca do favicon)
  openGraph: {
    title: "vérít.lab · Nada aqui se repete.",
    description: site.descricao,
  },
};

export const viewport: Viewport = {
  themeColor: "#14100B",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${permanent.variable} antialiased`}
    >
      <body>
        {children}
        <ModalEncomenda />
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-50" />
      </body>
    </html>
  );
}
