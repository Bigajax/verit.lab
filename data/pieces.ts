// Peças da galeria — dados oficiais do catálogo verit.lab 2026 (verit_lab_catalogo_INOVADOR.pdf).
// preco em reais; sem preco = sob consulta. estado "vendida" mantém a peça no grid com overlay.
// OBS. do catálogo: medidas podem ter variações por se tratar de peças artesanais.
export type Peca = {
  slug: string;
  nome: string;
  tipo: "Espelho" | "Quadro" | "Luminária" | "Relógio" | "Objeto";
  medida: string;
  descricao: string;
  preco?: number;
  foto: string;
  alt: string;
  estado: "disponivel" | "vendida";
};

export const pecas: Peca[] = [
  {
    slug: "rolling-is-love",
    nome: "Rolling Is Love",
    tipo: "Espelho",
    medida: "1,13 m × 82 cm",
    descricao: "Moldura em madeira, pintado no espelho.",
    preco: 2800,
    foto: "/images/pecas/all-we-need.jpg",
    alt: "Espelho com moldura preta entalhada e a frase all we need is love em grafite",
    estado: "disponivel",
  },
  {
    slug: "pernalonga-smoking",
    nome: "Pernalonga / Smoking",
    tipo: "Espelho",
    medida: "1,25 m × 65 cm",
    descricao: "Pintado na madeira, com espelho e LED.",
    preco: 2600,
    foto: "/images/pecas/toon.jpg",
    alt: "Espelho retroiluminado com personagem de desenho segurando um saco de dinheiro",
    estado: "disponivel",
  },
  {
    slug: "rolling-move",
    nome: "Rolling Move",
    tipo: "Quadro",
    medida: "95 × 65 cm",
    descricao: "Moldura em madeira, pintura no vidro com arte em mapa de NY por baixo.",
    preco: 2500,
    foto: "/images/pecas/gratitude.jpg",
    alt: "Quadro com a frase move with gratitude it weighs less than ego em grafite",
    estado: "disponivel",
  },
  {
    slug: "normal-day",
    nome: "Normal Day",
    tipo: "Quadro",
    medida: "1,13 m × 82 cm",
    descricao: "Moldura em madeira, pintado no vidro com folhas de ouro.",
    preco: 2300,
    foto: "/images/pecas/normal-day.jpg",
    alt: "Quadro em folha dourada com a frase your normal day is someone's dream",
    estado: "disponivel",
  },
  {
    slug: "luminaria-astronauta",
    nome: "Luminária Astronauta",
    tipo: "Luminária",
    medida: "45 cm (A)",
    descricao: "Feita e pintada à mão.",
    preco: 2100,
    foto: "/images/pecas/astro.jpg",
    alt: "Luminária de astronauta grafitada em cores segurando um globo iluminado",
    estado: "disponivel",
  },
  {
    slug: "mickey-mapa",
    nome: "Mickey Mapa",
    tipo: "Quadro",
    medida: "95 × 65 cm",
    descricao: "Pintura no vidro, moldura fina em madeira (podendo ser modificada).",
    preco: 2100,
    foto: "/images/pecas/fear.jpg",
    alt: "Quadro em colagem sobre mapa com a frase everything you want is on the other side of fear",
    estado: "disponivel",
  },
  {
    slug: "not-now-mac",
    nome: "Not Now Mac",
    tipo: "Espelho",
    medida: "85 × 65 cm",
    descricao: "Moldura em madeira, pintado no espelho.",
    preco: 1900,
    foto: "/images/pecas/not-now.jpg",
    alt: "Espelho oval de moldura amarela com arte pop e a frase not now",
    estado: "disponivel",
  },
  {
    slug: "jesus-only",
    nome: "Jesus Only",
    tipo: "Quadro",
    medida: "55 cm × 1,00 m",
    descricao: "Moldura em madeira, pintado no vidro com folhas de prata.",
    preco: 1900,
    foto: "/images/pecas/jesus-only.jpg",
    alt: "Figura carregando o quadro jesus is the only way por uma estrada ao pôr do sol",
    estado: "disponivel",
  },
  {
    slug: "pato-cowboy",
    nome: "Pato Cowboy",
    tipo: "Objeto",
    medida: "30 × 30 cm",
    descricao: "Feito e pintado à mão.",
    preco: 1900,
    foto: "/images/pecas/duck.jpg",
    alt: "Pato de borracha gigante com chapéu de cowboy em couro",
    estado: "disponivel",
  },
  {
    slug: "relogio-decorativo",
    nome: "Relógio Decorativo",
    tipo: "Relógio",
    medida: "54 cm de diâmetro",
    descricao: '"Time Is Precious" — pintado à mão.',
    preco: 1200,
    foto: "/images/pecas/time.jpg",
    alt: "Relógio autoral com time is precious grafitado em banheiro de azulejos pretos",
    estado: "disponivel",
  },
  // Fora do catálogo 2026 — inferida como vendida (ajustar se ainda estiver disponível).
  {
    slug: "dope-real-life",
    nome: "Dope Real Life",
    tipo: "Quadro",
    medida: "1,10 m × 70 cm",
    descricao: "Moldura em madeira, pintado no vidro com folhas de prata.",
    foto: "/images/pecas/real-life.jpg",
    alt: "Quadro em glitter prateado com frase em grafite vermelho sobre viver a vida real",
    estado: "vendida",
  },
];
