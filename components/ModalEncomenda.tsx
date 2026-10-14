"use client";

import { useCallback, useEffect, useRef } from "react";
import FormEncomenda from "@/components/FormEncomenda";

/**
 * A FICHA DE ENCOMENDA EM MODAL (14/10/2026, pedido do Rafael: "quero que
 * abra um modal ao invés de ficar lá"). Mora no layout, então abre de
 * qualquer página: todo link que termina em "#encomenda" (o Encomendar do
 * cabeçalho, os botões da home, o fim do catálogo) abre a ficha por cima em
 * vez de levar até a seção. Um link compartilhado com #encomenda também
 * chega com ela aberta.
 *
 * É um <dialog> nativo: o Esc fecha, o foco fica preso dentro dele e volta
 * para onde estava ao fechar. Clicar fora da ficha também fecha.
 */
export default function ModalEncomenda() {
  const ref = useRef<HTMLDialogElement>(null);

  const abrir = useCallback(() => {
    const d = ref.current;
    if (d && !d.open) {
      d.showModal();
      // o foco vai para a ficha, não para o X (que ganhava o contorno ao abrir)
      d.focus();
    }
  }, []);

  const fechar = useCallback(() => ref.current?.close(), []);

  useEffect(() => {
    if (window.location.hash === "#encomenda") abrir();

    // na fase de captura: chega antes do Link do Next, que respeita o
    // preventDefault e não navega
    const aoClicar = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link || !link.getAttribute("href")?.endsWith("#encomenda")) return;
      e.preventDefault();
      abrir();
    };
    const aoMudarHash = () => {
      if (window.location.hash === "#encomenda") abrir();
    };
    document.addEventListener("click", aoClicar, true);
    window.addEventListener("hashchange", aoMudarHash);
    return () => {
      document.removeEventListener("click", aoClicar, true);
      window.removeEventListener("hashchange", aoMudarHash);
    };
  }, [abrir]);

  return (
    <dialog
      ref={ref}
      className="vt-modal"
      tabIndex={-1}
      aria-labelledby="ficha-titulo"
      onClose={() => {
        // fechou: o endereço perde o #encomenda, senão o voltar reabre
        if (window.location.hash === "#encomenda") {
          history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }}
      onClick={(e) => {
        // o clique no fundo escuro cai no próprio <dialog>
        if (e.target === e.currentTarget) fechar();
      }}
    >
      <FormEncomenda aoFechar={fechar} />
    </dialog>
  );
}
