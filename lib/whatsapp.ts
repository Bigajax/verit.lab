import { site } from "@/data/site.config";
import type { Peca } from "@/data/pieces";

export function waLink(mensagem: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

// As mensagens usam a voz da vérít ("nada se repete") e a formatação do
// WhatsApp (*asteriscos* viram negrito). Toda mensagem identifica a origem.
export const waGeral = () =>
  waLink(
    [
      "Oi, vérít! 🖤",
      "Vim pela galeria online e quero conhecer as peças que ainda estão disponíveis.",
    ].join("\n"),
  );

export const waPeca = (peca: Peca) => {
  const linhas = [
    "Oi, vérít! 🖤",
    "Vi essa peça na galeria e, como nada aí se repete, quero garantir a minha:",
    "",
    `*${peca.nome}*`,
    `${peca.tipo} · ${peca.medida}`,
  ];
  if (peca.preco) linhas.push(`R$ ${peca.preco.toLocaleString("pt-BR")}`);
  linhas.push("", "Ela ainda está disponível?");
  return waLink(linhas.join("\n"));
};

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
  linhas.push(
    "",
    "*Contato*",
    `✦ Nome: ${e.nome}`,
    `✦ WhatsApp: ${e.whatsapp}`,
    "",
    "Bora criar a minha?",
  );
  return waLink(linhas.join("\n"));
}
