import { site } from "@/data/site.config";
import type { Peca } from "@/data/pieces";

export function waLink(mensagem: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

// Toda mensagem identifica a origem (vitrine) e o que gerou o contato.
export const waGeral = () =>
  waLink(
    "Oi! Cheguei pela galeria online da vérít.lab e quero conhecer as peças disponíveis.",
  );

export const waPeca = (peca: Peca) =>
  waLink(`Oi! Vi a peça ${peca.nome} na vitrine e quero saber mais.`);

export type Encomenda = {
  tipo: string;
  ideia: string;
  local: string;
  inspiracao: string;
  nome: string;
  whatsapp: string;
};

export function waEncomenda(e: Encomenda) {
  const linhas = [
    "Oi! Quero encomendar uma peça única. (vitrine · encomenda)",
    "",
    `Tipo de peça: ${e.tipo}`,
    `Frase ou ideia: ${e.ideia}`,
    `Onde vai ficar: ${e.local}`,
  ];
  if (e.inspiracao.trim()) linhas.push(`Peça que inspirou: ${e.inspiracao}`);
  linhas.push("", `Nome: ${e.nome}`, `WhatsApp: ${e.whatsapp}`);
  return waLink(linhas.join("\n"));
}
