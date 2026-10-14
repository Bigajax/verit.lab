import type { Faixa } from "@vitrine/plataforma/lib/conteudo";
import type { EscolhaDaLoja } from "@vitrine/plataforma/lib/catalogo-secoes";

/**
 * O CONTEÚDO PARA O PAINEL DO PACOTE (14/10/2026). Os textos da vitrine da
 * vérít moram no código (data/banners.ts, app/page.tsx); aqui só o mínimo que
 * o pacote lê: o mapa da página (o "onde fica" da Ajuda), as palavras que
 * viram número e o 404. Sem inventar: as frases são as do site.
 */
export const MAPA: Faixa[] = [
  { id: "avisos", nome: "Frases do topo", altura: 1, escura: true },
  { id: "menu", nome: "Menu", altura: 1, escura: true },
  { id: "abertura", nome: "Banners", altura: 4, escura: true },
  { id: "prateleiras", nome: "Peças únicas", altura: 3, escura: true },
  { id: "rodape", nome: "Rodapé", altura: 2, escura: true },
];

export const VARIAVEIS: Record<string, string> = {
  pecas: "o número de obras no site",
};

export const PARTES: EscolhaDaLoja = {
  /* o pacote exige estas partes; o site da vérít não as lê */
  avisos: { frases: ["this is not just decor."] },
  topo: { frase: "Nada aqui se repete." },
  prateleiras: { fileiras: [] },
  catalogo: { titulo: "Todas as peças", linha: "{pecas} obras no site." },
  rodape: { email: "", cnpj: "", facebook: "" },
  nao_achou: {
    titulo: "Página não encontrada",
    linha: "O endereço mudou ou a obra saiu do site. Comece pelas peças.",
    busca: "Procure pelo nome da obra",
    print: "Não achou a sua?",
    botao: "Chame no WhatsApp",
    vitrine: "No site agora",
  },
};
