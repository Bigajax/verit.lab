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

// A encomenda desde 14/10/2026: só o tipo (opcional) e a ideia. O resto
// (onde vai ficar, tamanho, prazo) a vérít pergunta na conversa.
export type Encomenda = {
  tipo: string;
  ideia: string;
};

export function waEncomenda(e: Encomenda) {
  const linhas = ["Oi, vérít! 🖤", "Quero encomendar uma peça única.", ""];
  if (e.tipo) linhas.push(`*Tipo:* ${e.tipo}`);
  linhas.push(`*Ideia:* ${e.ideia}`);
  return waLink(linhas.join("\n"));
}
