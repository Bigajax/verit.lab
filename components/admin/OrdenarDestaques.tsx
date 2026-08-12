"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { salvarOrdemDestaques } from "@/app/admin/actions";
import { capa, type Peca } from "@/lib/pecas";

// Ordenação do grid da home: arrastar (desktop) ou setas (celular).
export default function OrdenarDestaques({ pecas: iniciais }: { pecas: Peca[] }) {
  const router = useRouter();
  const [pecas, setPecas] = useState(iniciais);
  const [arrastando, setArrastando] = useState<number | null>(null);
  const [erro, setErro] = useState("");
  const [salvando, startTransition] = useTransition();

  function mover(de: number, para: number) {
    if (para < 0 || para >= pecas.length) return;
    setPecas((lista) => {
      const nova = [...lista];
      const [peca] = nova.splice(de, 1);
      nova.splice(para, 0, peca);
      return nova;
    });
  }

  function salvar() {
    setErro("");
    startTransition(async () => {
      const resultado = await salvarOrdemDestaques(pecas.map((p) => p.id));
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      router.push("/admin?toast=ordem");
    });
  }

  return (
    <div className="mx-auto max-w-2xl pb-28 lg:pb-10">
      <h1 className="text-3xl font-extrabold uppercase tracking-tight">
        Destaques da home
      </h1>
      <p className="mt-2 text-sm text-osso/55">
        Essa é a ordem do grid da home. Arraste (ou use as setas) e salve.
      </p>

      {pecas.length === 0 ? (
        <p className="mt-10 text-osso/55">
          Nenhuma peça marcada como destaque.{" "}
          <Link href="/admin" className="text-ambar underline">
            Marque na edição da peça
          </Link>
          .
        </p>
      ) : (
        <ol className="mt-6 grid gap-2">
          {pecas.map((peca, i) => {
            const foto = capa(peca);
            return (
              <li
                key={peca.id}
                draggable
                onDragStart={() => setArrastando(i)}
                onDragOver={(ev) => ev.preventDefault()}
                onDrop={() => {
                  if (arrastando !== null) mover(arrastando, i);
                  setArrastando(null);
                }}
                className="flex cursor-grab items-center gap-4 border border-ouro/25 bg-osso/[0.03] p-3"
              >
                <span className="w-6 text-center text-lg text-ambar">{i + 1}</span>
                <div className="relative h-16 w-12 shrink-0 overflow-hidden border border-ouro/25">
                  {foto && (
                    <Image src={foto.url} alt="" fill sizes="48px" className="object-cover" />
                  )}
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-bold uppercase tracking-[0.1em]">
                  {peca.nome}
                </p>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    aria-label="Subir"
                    className="flex h-11 w-11 items-center justify-center border border-osso/25 text-osso/70 hover:border-ambar hover:text-ambar disabled:opacity-30"
                    disabled={i === 0}
                    onClick={() => mover(i, i - 1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label="Descer"
                    className="flex h-11 w-11 items-center justify-center border border-osso/25 text-osso/70 hover:border-ambar hover:text-ambar disabled:opacity-30"
                    disabled={i === pecas.length - 1}
                    onClick={() => mover(i, i + 1)}
                  >
                    ↓
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {pecas.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ouro/25 bg-preto/95 px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:static lg:mt-8 lg:border-0 lg:bg-transparent lg:p-0">
          <div className="mx-auto flex max-w-2xl items-center gap-4">
            <button
              type="button"
              className="btn-ambar flex-1 lg:flex-none"
              disabled={salvando}
              onClick={salvar}
            >
              {salvando ? "Salvando…" : "Salvar ordem"}
            </button>
            {erro && (
              <p role="alert" className="text-sm font-semibold text-rosa">
                {erro}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
