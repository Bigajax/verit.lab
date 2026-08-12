// Tipos e helpers puros das peças — importável de client e server.
// As queries (server-only) vivem em lib/pecas.server.ts.

export type Categoria = "espelho" | "quadro" | "objeto";
export type StatusPeca = "disponivel" | "reservada" | "vendida";

export type PecaImagem = {
  id: string;
  url: string;
  alt: string | null;
  ordem: number;
};

export type Peca = {
  id: string;
  slug: string;
  numero: string;
  nome: string;
  categoria: Categoria;
  subtipo: string | null;
  frase: string | null;
  descricao: string | null;
  preco: number | null;
  preco_original: number | null; // o "de" do de/por — riscado na vitrine
  dimensoes: string;
  material: string | null;
  acabamento: string | null;
  prazo: string | null;
  status: StatusPeca;
  destaque: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
  imagens: PecaImagem[];
};

// A imagem com ordem 0 é a capa (grid e OG image).
export function capa(peca: Peca): PecaImagem | undefined {
  return peca.imagens[0];
}

// Rótulo exibido nos cards: subtipo quando existe ("Luminária"),
// senão a categoria capitalizada ("Espelho").
export function rotuloTipo(peca: Peca): string {
  if (peca.subtipo) return peca.subtipo;
  return peca.categoria.charAt(0).toUpperCase() + peca.categoria.slice(1);
}

export function precoFormatado(peca: Peca): string {
  if (peca.status === "vendida") return "vendida";
  if (peca.status === "reservada") return "reservada";
  if (peca.preco == null) return "sob consulta";
  return formataReais(peca.preco);
}

export function formataReais(valor: number): string {
  return `R$ ${valor.toLocaleString("pt-BR")}`;
}

// Desconto só existe com a peça disponível e um "de" maior que o "por".
export function temDesconto(peca: Peca): boolean {
  return (
    peca.status === "disponivel" &&
    peca.preco != null &&
    peca.preco_original != null &&
    peca.preco_original > peca.preco
  );
}

export function percentualDesconto(peca: Peca): number {
  if (!temDesconto(peca)) return 0;
  return Math.round((1 - peca.preco! / peca.preco_original!) * 100);
}
