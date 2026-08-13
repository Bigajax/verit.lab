"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Cta from "@/components/Cta";
import PecaCard from "@/components/PecaCard";
import Reveal from "@/components/Reveal";
import type { Categoria, Peca } from "@/lib/pecas";

const CATEGORIAS: { valor: Categoria | "todas"; rotulo: string }[] = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "espelho", rotulo: "Espelhos" },
  { valor: "quadro", rotulo: "Quadros" },
  { valor: "objeto", rotulo: "Objetos" },
];

const STATUS: { valor: "disponivel" | "acervo"; rotulo: string }[] = [
  { valor: "disponivel", rotulo: "Disponíveis" },
  { valor: "acervo", rotulo: "Acervo completo" },
];

// Filtros client-side, sem reload. O estado vive na URL
// (?categoria=espelho&status=disponivel) para o link ser compartilhável.
export default function CatalogoPecas({ pecas }: { pecas: Peca[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoria = (searchParams.get("categoria") ?? "todas") as
    | Categoria
    | "todas";
  const status = searchParams.get("status") === "acervo" ? "acervo" : "disponivel";

  function aplicar(novaCategoria: string, novoStatus: string) {
    const qs = new URLSearchParams();
    if (novaCategoria !== "todas") qs.set("categoria", novaCategoria);
    if (novoStatus !== "disponivel") qs.set("status", novoStatus);
    router.replace(qs.size ? `/pecas?${qs}` : "/pecas", { scroll: false });
  }

  const filtradas = pecas.filter((peca) => {
    if (categoria !== "todas" && peca.categoria !== categoria) return false;
    if (status === "disponivel" && peca.status === "vendida") return false;
    return true;
  });

  return (
    <>
      {/* filtros — mesmo tratamento dos chips da ficha de encomenda */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIAS.map((c) => (
          <button
            key={c.valor}
            type="button"
            className="pill"
            data-on={categoria === c.valor}
            aria-pressed={categoria === c.valor}
            onClick={() => aplicar(c.valor, status)}
          >
            {c.rotulo}
          </button>
        ))}
        <span aria-hidden className="mx-2 hidden h-6 w-px bg-ouro/30 sm:block" />
        {STATUS.map((s) => (
          <button
            key={s.valor}
            type="button"
            className="pill"
            data-on={status === s.valor}
            aria-pressed={status === s.valor}
            onClick={() => aplicar(categoria, s.valor)}
          >
            {s.rotulo}
          </button>
        ))}
      </div>

      {filtradas.length === 0 ? (
        <div className="mt-16 max-w-md border-l border-ouro/40 py-10 pl-6 sm:pl-10">
          <p className="font-display text-3xl leading-snug">
            Nada aqui agora.
          </p>
          <p className="font-marker mt-3 -rotate-1 text-xl text-rosa">
            toda peça é única e algumas já foram.
          </p>
          <Cta
            cta="catalogo-vazio-encomendar"
            href="/#encomenda"
            className="btn-ambar mt-8"
          >
            Encomendar uma peça <span aria-hidden>→</span>
          </Cta>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-2 gap-x-2.5 gap-y-3.5 sm:gap-6 lg:grid-cols-3 [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1">
          {filtradas.map((peca, i) => (
            <Reveal key={peca.id}>
              <PecaCard
                peca={peca}
                sizes={
                  i === 0
                    ? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    : "(min-width: 1024px) 30vw, 50vw"
                }
              />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
