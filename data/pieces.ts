import type { StaticImageData } from "next/image";

// Imports estáticos: o Next gera width/height e blurDataURL automáticos (zero CLS).
import fotoAllWeNeed from "@/public/images/pecas/all-we-need.jpg";
import fotoToon from "@/public/images/pecas/toon.jpg";
import fotoGratitude from "@/public/images/pecas/gratitude.jpg";
import fotoNormalDay from "@/public/images/pecas/normal-day.jpg";
import fotoAstro from "@/public/images/pecas/astro.jpg";
import fotoFear from "@/public/images/pecas/fear.jpg";
import fotoNotNow from "@/public/images/pecas/not-now.jpg";
import fotoJesusOnly from "@/public/images/pecas/jesus-only.jpg";
import fotoDuck from "@/public/images/pecas/duck.jpg";
import fotoTime from "@/public/images/pecas/time.jpg";
import fotoRealLife from "@/public/images/pecas/real-life.jpg";

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
  foto: StaticImageData;
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
    foto: fotoAllWeNeed,
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
    foto: fotoToon,
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
    foto: fotoGratitude,
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
    foto: fotoNormalDay,
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
    foto: fotoAstro,
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
    foto: fotoFear,
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
    foto: fotoNotNow,
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
    foto: fotoJesusOnly,
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
    foto: fotoDuck,
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
    foto: fotoTime,
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
    foto: fotoRealLife,
    alt: "Quadro em glitter prateado com frase em grafite vermelho sobre viver a vida real",
    estado: "vendida",
  },
];
