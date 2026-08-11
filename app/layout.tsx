import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Protest_Revolution } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site.config";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

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
  title: "vérít.lab — Nada aqui se repete.",
  description: site.descricao,
  metadataBase: new URL(site.url),
  openGraph: {
    title: "vérít.lab — Nada aqui se repete.",
    description: site.descricao,
    images: ["/images/ambiente/sala.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#14100B",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${instrument.variable} ${archivo.variable} ${permanent.variable} antialiased`}
    >
      <body>
        {children}
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-50" />
      </body>
    </html>
  );
}
