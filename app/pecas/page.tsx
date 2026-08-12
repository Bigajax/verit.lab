import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogoPecas from "@/components/CatalogoPecas";
import FechamentoCta from "@/components/FechamentoCta";
import PecaCard from "@/components/PecaCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getPecas } from "@/lib/pecas.server";
import type { Peca } from "@/lib/pecas";

// ISR: o catálogo se reconstrói a cada 60 s (ou na hora, via admin).
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Todas as peças · vérít.lab",
  description:
    "O acervo completo da vérít.lab: espelhos, quadros e objetos únicos com frases em grafite. Cada peça existe uma única vez.",
  alternates: { canonical: "/pecas" },
};

// Fallback do Suspense: o estado padrão (Disponíveis) renderizado no
// servidor — é isso que vai no HTML estático e no que os buscadores leem.
function GridPadrao({ pecas }: { pecas: Peca[] }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pecas
        .filter((peca) => peca.status !== "vendida")
        .map((peca) => (
          <PecaCard key={peca.id} peca={peca} />
        ))}
    </div>
  );
}

export default async function PaginaPecas() {
  const pecas = await getPecas();
  const disponiveis = pecas.filter((p) => p.status === "disponivel").length;

  return (
    <main className="overflow-x-clip">
      <SiteHeader />

      {/* header da página */}
      <section className="px-5 pt-14 sm:px-12 lg:px-20 lg:pt-20">
        <h1 className="font-extrabold uppercase leading-[0.9] tracking-tight">
          <span className="block text-6xl sm:text-7xl">Todas as</span>
          <span className="font-marker block -rotate-1 pt-2 text-5xl font-normal normal-case tracking-normal text-ambar sm:text-6xl">
            peças.
          </span>
        </h1>
        <p className="mt-6 max-w-sm text-osso/70">
          Cada uma existe uma única vez. Vendeu, não volta.
        </p>
        <p className="eyebrow mt-4 text-osso/55">
          {pecas.length} {pecas.length === 1 ? "peça" : "peças"} no acervo ·{" "}
          {disponiveis} {disponiveis === 1 ? "disponível" : "disponíveis"}
        </p>
      </section>

      {/* filtros + grid */}
      <section className="px-5 pt-12 pb-24 sm:px-12 lg:px-20">
        <Suspense fallback={<GridPadrao pecas={pecas} />}>
          <CatalogoPecas pecas={pecas} />
        </Suspense>
      </section>

      <FechamentoCta mostrarVerPecas={false} />
      <SiteFooter />
    </main>
  );
}
