// Peças da vitrine. Preço é sempre sob consulta (decidido com o Rafael em 11/08/2026).
// medida: trocar os [DEFINIR] pelas medidas reais de cada peça.
// estado: "disponivel" | "vendida" — peça vendida permanece no grid com overlay.
export type Peca = {
  slug: string;
  nome: string;
  tipo: "Espelho" | "Quadro" | "Luminária" | "Relógio" | "Objeto";
  medida: string;
  foto: string;
  alt: string;
  estado: "disponivel" | "vendida";
};

export const pecas: Peca[] = [
  {
    slug: "all-we-need",
    nome: "All We Need Is Love",
    tipo: "Espelho",
    medida: "[DEFINIR] cm",
    foto: "/images/pecas/all-we-need.jpg",
    alt: "Espelho com moldura preta entalhada e a frase all we need is love em grafite rosa",
    estado: "disponivel",
  },
  {
    slug: "normal-day",
    nome: "Your Normal Day",
    tipo: "Quadro",
    medida: "[DEFINIR] cm",
    foto: "/images/pecas/normal-day.jpg",
    alt: "Quadro em folha dourada com a frase your normal day is someone's dream",
    estado: "disponivel",
  },
  {
    slug: "real-life",
    nome: "Dope Real Life",
    tipo: "Quadro",
    medida: "[DEFINIR] cm",
    foto: "/images/pecas/real-life.jpg",
    alt: "Quadro em glitter prateado com frase em grafite vermelho sobre viver a vida real",
    estado: "disponivel",
  },
  {
    slug: "astro",
    nome: "Astro",
    tipo: "Luminária",
    medida: "[DEFINIR] cm",
    foto: "/images/pecas/astro.jpg",
    alt: "Luminária de astronauta grafitada em cores segurando um globo iluminado",
    estado: "disponivel",
  },
  {
    slug: "not-now",
    nome: "Not Now",
    tipo: "Espelho",
    medida: "[DEFINIR] cm",
    foto: "/images/pecas/not-now.jpg",
    alt: "Espelho oval de moldura amarela com arte pop e a frase not now",
    estado: "disponivel",
  },
  {
    slug: "toon",
    nome: "Toon Money",
    tipo: "Espelho",
    medida: "[DEFINIR] cm",
    foto: "/images/pecas/toon.jpg",
    alt: "Espelho retroiluminado com personagem de desenho segurando um saco de dinheiro",
    estado: "disponivel",
  },
  {
    slug: "gratitude",
    nome: "Move With Gratitude",
    tipo: "Quadro",
    medida: "[DEFINIR] cm",
    foto: "/images/pecas/gratitude.jpg",
    alt: "Quadro com a frase move with gratitude it weighs less than ego em grafite",
    estado: "disponivel",
  },
  {
    slug: "time",
    nome: "Time Is Precious",
    tipo: "Relógio",
    medida: "[DEFINIR] cm",
    foto: "/images/pecas/time.jpg",
    alt: "Relógio autoral dourado em banheiro de azulejos pretos",
    estado: "disponivel",
  },
  {
    slug: "fear",
    nome: "Other Side of Fear",
    tipo: "Quadro",
    medida: "[DEFINIR] cm",
    foto: "/images/pecas/fear.jpg",
    alt: "Quadro em colagem com a frase everything you want is on the other side of fear",
    estado: "disponivel",
  },
  // Vendida por último: o grid termina em "Encomende a sua", emendando na encomenda.
  {
    slug: "duck",
    nome: "Duck Cowboy",
    tipo: "Objeto",
    medida: "[DEFINIR] cm",
    foto: "/images/pecas/duck.jpg",
    alt: "Pato de borracha gigante com chapéu de cowboy em couro",
    estado: "vendida",
  },
];
