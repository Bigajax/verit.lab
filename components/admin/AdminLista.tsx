"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { definirStatus, duplicarPeca, excluirPeca } from "@/app/admin/actions";
import ModalPeca from "@/components/admin/ModalPeca";
import { capa, temDesconto, type Peca, type StatusPeca } from "@/lib/pecas";

const FILTROS: { valor: StatusPeca | "todas"; rotulo: string }[] = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "disponivel", rotulo: "Disponíveis" },
  { valor: "reservada", rotulo: "Reservadas" },
  { valor: "vendida", rotulo: "Vendidas" },
];

const TOASTS: Record<string, string> = {
  salva: "Peça salva. Já está no site.",
  excluida: "Peça excluída.",
  ordem: "Ordem dos destaques salva.",
};

function corStatus(status: StatusPeca) {
  if (status === "vendida") return "text-rosa";
  if (status === "reservada") return "text-ouro";
  return "text-ambar";
}

// Lista do acervo — pensada para o celular, na oficina, com a mão suja
// de tinta: cards com alvos grandes e o toggle de vendida em 1 toque.
export default function AdminLista({ pecas: doServidor }: { pecas: Peca[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pecas, setPecas] = useState(doServidor);
  const [filtro, setFiltro] = useState<StatusPeca | "todas">("todas");
  const [busca, setBusca] = useState("");
  // toast vindo de outra tela (?toast=salva)
  const [toast, setToast] = useState(() => {
    const chave = searchParams.get("toast");
    return chave ? (TOASTS[chave] ?? "") : "";
  });
  const [, startTransition] = useTransition();
  // null = fechado; { } = nova peça; { peca } = edição
  const [modal, setModal] = useState<{ peca?: Peca } | null>(null);

  // dados novos do servidor (router.refresh) substituem a cópia otimista
  const [anterior, setAnterior] = useState(doServidor);
  if (anterior !== doServidor) {
    setAnterior(doServidor);
    setPecas(doServidor);
  }

  // limpa o ?toast= da URL depois de capturado no estado inicial
  useEffect(() => {
    if (searchParams.get("toast")) router.replace("/admin", { scroll: false });
  }, [searchParams, router]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  function alternarVendida(peca: Peca) {
    const novo: StatusPeca = peca.status === "vendida" ? "disponivel" : "vendida";
    // otimista: a lista responde na hora, o banco confirma em seguida
    setPecas((lista) =>
      lista.map((p) => (p.id === peca.id ? { ...p, status: novo } : p)),
    );
    startTransition(async () => {
      const resultado = await definirStatus(peca.id, novo);
      if (!resultado.ok) {
        setPecas((lista) =>
          lista.map((p) => (p.id === peca.id ? { ...p, status: peca.status } : p)),
        );
        setToast(`Não deu: ${resultado.erro}`);
        return;
      }
      setToast(novo === "vendida" ? "Marcada como vendida." : "De volta ao acervo.");
      router.refresh();
    });
  }

  function duplicar(peca: Peca) {
    startTransition(async () => {
      const resultado = await duplicarPeca(peca.id);
      if (!resultado.ok) {
        setToast(`Não deu: ${resultado.erro}`);
        return;
      }
      setToast("Cópia criada. Toque em editar para ajustar.");
      router.refresh();
    });
  }

  function aoSalvarNoModal() {
    setModal(null);
    setToast("Peça salva. Já está no site.");
    router.refresh();
  }

  // sugestão de número para peça nova: o próximo livre do acervo
  const numeroSugerido = String(
    Math.max(0, ...pecas.map((p) => parseInt(p.numero, 10) || 0)) + 1,
  ).padStart(2, "0");

  function excluir(peca: Peca) {
    if (!confirm(`Excluir "${peca.nome}"? Isso apaga a peça e as fotos.`)) return;
    setPecas((lista) => lista.filter((p) => p.id !== peca.id));
    startTransition(async () => {
      const resultado = await excluirPeca(peca.id);
      if (!resultado.ok) {
        setPecas(doServidor);
        setToast(`Não deu: ${resultado.erro}`);
        return;
      }
      setToast("Peça excluída.");
      router.refresh();
    });
  }

  const visiveis = pecas.filter((peca) => {
    if (filtro !== "todas" && peca.status !== filtro) return false;
    if (busca && !peca.nome.toLowerCase().includes(busca.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="pb-24 lg:pb-0">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight">
            Peças
          </h1>
          <p className="eyebrow mt-2 text-osso/55">
            {pecas.length} no acervo ·{" "}
            {pecas.filter((p) => p.status === "disponivel").length} disponíveis
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({})}
          className="btn-ambar hidden lg:inline-flex"
        >
          + Nova peça
        </button>
      </div>

      {/* filtro rápido + busca */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            type="button"
            className="pill"
            data-on={filtro === f.valor}
            aria-pressed={filtro === f.valor}
            onClick={() => setFiltro(f.valor)}
          >
            {f.rotulo}
          </button>
        ))}
        <input
          type="search"
          className="campo max-w-56 flex-1"
          placeholder="Buscar por nome…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* lista em cards — funciona igual no celular e no desktop */}
      <ul className="mt-6 grid gap-3">
        {visiveis.map((peca) => {
          const foto = capa(peca);
          const vendida = peca.status === "vendida";
          return (
            <li
              key={peca.id}
              className="border border-ouro/25 bg-osso/[0.03] p-3 sm:p-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-ouro/25">
                  {foto ? (
                    <Image
                      src={foto.url}
                      alt=""
                      fill
                      sizes="64px"
                      className={`object-cover ${vendida ? "opacity-40 saturate-50" : ""}`}
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[0.6rem] uppercase tracking-widest text-osso/40">
                      sem foto
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold uppercase tracking-[0.1em]">
                    <span className="mr-2 text-ambar">{peca.numero}</span>
                    {peca.nome}
                  </p>
                  <p className="mt-1 text-xs text-osso/55">
                    {peca.categoria}
                    {peca.preco != null &&
                      ` · R$ ${peca.preco.toLocaleString("pt-BR")}`}
                    {temDesconto(peca) && (
                      <span className="ml-1.5 font-bold uppercase tracking-widest text-rosa">
                        promo
                      </span>
                    )}
                  </p>
                  <p
                    className={`mt-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] ${corStatus(peca.status)}`}
                  >
                    {peca.status}
                    {peca.destaque && (
                      <span className="ml-2 font-normal text-osso/45">· home</span>
                    )}
                  </p>
                </div>
                {/* a operação mais frequente: 1 toque, sem confirmação */}
                <button
                  type="button"
                  onClick={() => alternarVendida(peca)}
                  className={`min-h-14 shrink-0 border px-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] transition-colors sm:px-4 ${
                    vendida
                      ? "border-osso/30 text-osso/70 hover:border-ambar hover:text-ambar"
                      : "border-rosa/60 text-rosa hover:bg-rosa hover:text-preto"
                  }`}
                >
                  {vendida ? "Voltar ao acervo" : "Marcar vendida"}
                </button>
              </div>
              <div className="mt-3 flex gap-2 border-t border-ouro/15 pt-2">
                <button
                  type="button"
                  onClick={() => setModal({ peca })}
                  className="inline-flex min-h-11 flex-1 items-center justify-center text-xs font-semibold uppercase tracking-[0.14em] text-osso/70 hover:text-ambar"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => duplicar(peca)}
                  className="inline-flex min-h-11 flex-1 items-center justify-center text-xs font-semibold uppercase tracking-[0.14em] text-osso/70 hover:text-ambar"
                >
                  Duplicar
                </button>
                <button
                  type="button"
                  onClick={() => excluir(peca)}
                  className="inline-flex min-h-11 flex-1 items-center justify-center text-xs font-semibold uppercase tracking-[0.14em] text-osso/45 hover:text-rosa"
                >
                  Excluir
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {visiveis.length === 0 && (
        <p className="mt-10 text-osso/55">
          Nenhuma peça aqui.{" "}
          <button
            type="button"
            onClick={() => setModal({})}
            className="text-ambar underline"
          >
            Cadastrar a primeira
          </button>
          .
        </p>
      )}

      {/* + NOVA PEÇA sempre à mão no celular */}
      <div className="fixed inset-x-4 bottom-4 z-30 lg:hidden">
        <button
          type="button"
          onClick={() => setModal({})}
          className="btn-ambar w-full shadow-lg"
        >
          + Nova peça
        </button>
      </div>

      {modal && (
        <ModalPeca
          peca={modal.peca}
          numeroSugerido={modal.peca ? undefined : numeroSugerido}
          aoFechar={() => setModal(null)}
          aoSalvo={aoSalvarNoModal}
        />
      )}

      {toast && (
        <p
          role="status"
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 border border-ambar bg-preto px-5 py-3 text-sm font-semibold text-ambar shadow-lg lg:bottom-8"
        >
          {toast}
        </p>
      )}
    </div>
  );
}
