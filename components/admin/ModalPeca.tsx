"use client";

import { useEffect } from "react";
import FormPeca from "@/components/admin/FormPeca";
import type { Peca } from "@/lib/pecas";

// Modal de nova peça / edição — abre sobre a lista, sem sair dela.
// Tela cheia no celular; diálogo centrado com rolagem própria no desktop.
export default function ModalPeca({
  peca,
  numeroSugerido,
  aoFechar,
  aoSalvo,
}: {
  peca?: Peca;
  numeroSugerido?: string;
  aoFechar: () => void;
  aoSalvo: () => void;
}) {
  // Esc fecha; scroll do fundo travado enquanto o modal existe
  useEffect(() => {
    function tecla(ev: KeyboardEvent) {
      if (ev.key === "Escape") aoFechar();
    }
    document.addEventListener("keydown", tecla);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tecla);
      document.documentElement.style.overflow = "";
    };
  }, [aoFechar]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={peca ? `Editar ${peca.nome}` : "Nova peça"}
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-preto/80 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={aoFechar}
    >
      <div
        className="relative flex w-full flex-col overflow-y-auto bg-preto sm:max-h-[92dvh] sm:max-w-2xl sm:border sm:border-ouro/40"
        onClick={(ev) => ev.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Fechar"
          className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center border border-osso/25 text-xl text-osso/70 hover:border-ambar hover:text-ambar"
          onClick={aoFechar}
        >
          ×
        </button>
        <div className="px-5 pb-5 pt-6 sm:px-8 sm:pb-8">
          <FormPeca
            emModal
            inicial={peca}
            numeroSugerido={numeroSugerido}
            aoSalvo={aoSalvo}
          />
        </div>
      </div>
    </div>
  );
}
