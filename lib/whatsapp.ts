import { site } from "@/data/site.config";
import type { Peca } from "@/lib/pecas";

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

// Sticky bar mobile: intenção de encomenda, sem passar pela ficha.
export const waEncomendaDireta = () =>
  waLink(
    [
      "Oi, vérít! 🖤",
      "Vim pela galeria online e quero encomendar uma peça única. Bora criar a minha?",
    ].join("\n"),
  );

// Página da peça: mensagem leva o link, que vira preview no WhatsApp.
export const waPecaPagina = (peca: Pick<Peca, "nome" | "numero" | "slug">) =>
  waLink(
    [
      `Oi! Vi a peça *${peca.nome}* (acervo ${peca.numero}) no site e queria saber mais.`,
      `${site.url}/pecas/${peca.slug}`,
    ].join("\n"),
  );

export const waPecaVendida = (peca: Pick<Peca, "nome" | "slug">) =>
  waLink(
    [
      `Oi! Vi que a *${peca.nome}* já foi vendida, mas queria encomendar algo nessa linha.`,
      `${site.url}/pecas/${peca.slug}`,
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
    "Preenchi a ficha na galeria e quero uma peça única, feita pra mim:",
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
