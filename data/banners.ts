// Os 3 banners do topo (padrão do molde, 14/10/2026). As artes moram em
// public/hero/ e saem do scripts/montar-banners.cjs, a partir das artes do
// gerador salvas em banners/. Arte nova: trocar o sufixo no script e aqui
// (cache de imagem). O texto NUNCA vai na arte: entra por cima, daqui.
//
// lado = onde fica o TEXTO no computador. Os prompts estão em banners/prompts.md.
export type Banner = {
  id: string;
  foto: string;
  celular: string;
  alt: string;
  lado: "esquerda" | "direita";
  titulo: string;
  linha: string;
  botao: string;
  href: string;
};

export const banners: Banner[] = [
  {
    id: "espelhos",
    foto: "/hero/banner-1-a1.webp",
    celular: "/hero/banner-1-a1-celular.webp",
    alt: "O espelho Rolling is Love, com a língua pintada e a frase all we need is love, numa parede escura com respingos de tinta",
    lado: "esquerda",
    titulo: "Espelho único, pintado à mão.",
    linha: "Rolling is Love: só existe um. Quando ele sair daqui, não volta.",
    botao: "Quero este espelho",
    href: "/pecas/rolling-is-love",
  },
  {
    id: "objetos",
    foto: "/hero/banner-2-a1.webp",
    celular: "/hero/banner-2-a1-celular.webp",
    alt: "O Pato Cowboy, amarelo com chapéu de couro, sobre um pedestal de concreto sob luz quente",
    lado: "direita",
    titulo: "O pato que rouba a cena.",
    linha: "Pato Cowboy, feito e pintado à mão. Um só, para quem quer uma casa com personalidade.",
    botao: "Quero o Pato Cowboy",
    href: "/pecas/pato-cowboy",
  },
  {
    id: "loja",
    foto: "/hero/banner-3-a1.webp",
    celular: "/hero/banner-3-a1-celular.webp",
    alt: "A sala da vérít.lab à noite, com o sofá de couro e os quadros e espelhos grafitados",
    lado: "esquerda",
    titulo: "Sua parede merece atitude.",
    linha: "Espelhos, quadros e objetos feitos à mão em Maringá. Cada peça existe uma vez só.",
    botao: "Ver todas as peças",
    href: "/pecas",
  },
];
