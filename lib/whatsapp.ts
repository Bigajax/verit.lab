import { site } from "@/data/site.config";
import type { Peca } from "@/data/pieces";

export function waLink(mensagem: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

// As mensagens usam a formatação do WhatsApp (*asteriscos* viram negrito).
// Toda mensagem identifica a origem (galeria online).
export const waGeral = () =>
  waLink(
    [
      "Oi, vérít! 🖤",
      "Vim pela galeria online e quero conhecer as peças que ainda estão disponíveis.",
    ].join("\n"),
  );

// CTA da peça pronta: curto e direto — nome + número do card.
export const waPeca = (peca: Peca, numero: number) =>
  waLink(
    `Oi! Quero a *${peca.nome}* (nº ${String(numero).padStart(2, "0")}). Ela ainda está disponível?`,
  );

// Sticky bar mobile: intenção de encomenda, sem passar pela ficha.
export const waEncomendaDireta = () =>
  waLink(
    [
      "Oi, vérít! 🖤",
      "Vim pela galeria online e quero encomendar uma peça única. Bora criar a minha?",
    ].join("\n"),
  );

export type Encomenda = {
  tipo: string;
  ideia: string;
  local: string;
  inspiracao: string;
  nome: string;
};

export function waEncomenda(e: Encomenda) {
  const linhas = [
    "Oi, vérít! 🖤",
    "Preenchi a ficha na galeria — quero uma peça única, feita pra mim:",
    "",
    "*Ficha de encomenda*",
    `✦ Tipo de peça: ${e.tipo}`,
    `✦ Frase ou ideia: ${e.ideia}`,
    `✦ Onde vai ficar: ${e.local}`,
  ];
  if (e.inspiracao.trim())
    linhas.push(`✦ Peça que inspirou: ${e.inspiracao}`);
  if (e.nome.trim()) linhas.push(`✦ Nome: ${e.nome}`);
  linhas.push("", "Bora criar a minha?");
  return waLink(linhas.join("\n"));
}
