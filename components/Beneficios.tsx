"use client";

import { useState } from "react";

/**
 * OS BENEFÍCIOS (14/10/2026, do molde do estúdio): a faixa logo abaixo dos
 * banners, só com o que a vérít.lab cumpre de verdade. Entrega e parcelamento
 * ficam de fora até a loja dizer como faz (as pendências do site.config).
 *
 * No celular, UM por vez com uma setinha de cada lado; no computador, os
 * quatro lado a lado, separados por um fio.
 */
const ITENS = [
  {
    texto: "Peça única: existe uma só",
    /* o selo de uma unidade */
    icone: <path d="M12 3.5l2.2 1.6 2.7-.1.8 2.6 2.2 1.6-.9 2.6.9 2.6-2.2 1.6-.8 2.6-2.7-.1L12 20.5l-2.2-1.6-2.7.1-.8-2.6-2.2-1.6.9-2.6-.9-2.6 2.2-1.6.8-2.6 2.7.1zM10.5 10l1.5-1v6" />,
  },
  {
    texto: "Feita e pintada à mão",
    /* a lata de spray */
    icone: <path d="M8 9.5h7v11H8zM9.5 9.5V7h4v2.5M10.5 7V5h2v2M16.5 4.5l1.5-.8M17 6.5h1.7M16.5 8.5l1.5.8" />,
  },
  {
    texto: "Encomenda do seu jeito",
    /* o lápis do rascunho */
    icone: <path d="M4.5 19.5l1-4L15.5 5.5l3 3-10 10zM13.5 7.5l3 3M4.5 19.5h15" />,
  },
  {
    texto: "Atendimento pelo WhatsApp",
    /* o balão da conversa */
    icone: <path d="M4.5 19.5l1.2-3.6A7.5 7.5 0 1 1 8.4 18.6zM9 11.5h.01M12 11.5h.01M15 11.5h.01" />,
  },
];

export default function Beneficios() {
  const [atual, setAtual] = useState(0);
  const ir = (passo: number) => setAtual((i) => (i + passo + ITENS.length) % ITENS.length);
  const seta = (passo: 1 | -1) => (
    <button type="button" className="vt-beneficios__seta" onClick={() => ir(passo)} aria-label={passo < 0 ? "Benefício anterior" : "Próximo benefício"}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d={passo < 0 ? "M14.5 5.5L8 12l6.5 6.5" : "M9.5 5.5L16 12l-6.5 6.5"} />
      </svg>
    </button>
  );
  return (
    <section className="vt-beneficios" aria-label="Por que comprar na vérít.lab">
      {seta(-1)}
      <ul className="vt-beneficios__lista" aria-live="polite">
        {ITENS.map((item, i) => (
          <li key={item.texto} className="vt-beneficios__item" data-agora={i === atual ? "true" : undefined}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="vt-beneficios__icone">
              {item.icone}
            </svg>
            <span>{item.texto}</span>
          </li>
        ))}
      </ul>
      {seta(1)}
    </section>
  );
}
