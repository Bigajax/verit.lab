// Dados locais de exemplo — usados SÓ quando o Supabase não está
// configurado (sem NEXT_PUBLIC_SUPABASE_URL). Espelham o seed real
// (scripts/seed.mjs) para dar para testar a vitrine sem banco.
// Em produção este arquivo nunca entra em cena.
import type { Peca, PecaImagem } from "@/lib/pecas";

const QUANDO = "2026-01-01T00:00:00Z";

function fotos(slug: string, arquivos: string[], alt: string): PecaImagem[] {
  return arquivos.map((arquivo, ordem) => ({
    id: `${slug}-img-${ordem}`,
    url: `/images/pecas/${arquivo}`,
    alt: ordem === 0 ? alt : `${alt} (foto ${ordem + 1})`,
    ordem,
  }));
}

type Semente = Omit<
  Peca,
  | "id"
  | "numero"
  | "ordem"
  | "destaque"
  | "preco_original"
  | "created_at"
  | "updated_at"
>;

const sementes: Semente[] = [
  {
    slug: "rolling-is-love",
    nome: "ROLLING IS LOVE",
    categoria: "espelho",
    subtipo: null,
    frase: "All we need is love",
    descricao:
      "Nasceu de uma conversa sobre o que sobra quando tudo passa. Ficou o amor, e ele foi para o espelho.",
    preco: 2800,
    dimensoes: "1,13 m × 82 cm",
    material: "Moldura em madeira",
    acabamento: "Pintado no espelho",
    prazo: null,
    status: "disponivel",
    // 3 fotos no mock para testar galeria, carrossel e lightbox
    imagens: fotos(
      "rolling-is-love",
      ["all-we-need.jpg", "gratitude.jpg", "time.jpg"],
      "Espelho com moldura preta entalhada e a frase all we need is love em grafite",
    ),
  },
  {
    slug: "pernalonga-smoking",
    nome: "PERNALONGA / SMOKING",
    categoria: "espelho",
    subtipo: null,
    frase: null,
    descricao: null,
    preco: 2600,
    dimensoes: "1,25 m × 65 cm",
    material: "Madeira, espelho e LED",
    acabamento: "Pintado na madeira",
    prazo: null,
    status: "disponivel",
    imagens: fotos(
      "pernalonga-smoking",
      ["toon.jpg"],
      "Espelho retroiluminado com personagem de desenho segurando um saco de dinheiro",
    ),
  },
  {
    slug: "rolling-move",
    nome: "ROLLING MOVE",
    categoria: "quadro",
    subtipo: null,
    frase: "Move with gratitude, it weighs less than ego",
    descricao: null,
    preco: 2500,
    dimensoes: "95 × 65 cm",
    material: "Moldura em madeira",
    acabamento: "Pintura no vidro com arte em mapa de NY por baixo",
    prazo: null,
    status: "disponivel",
    imagens: fotos(
      "rolling-move",
      ["gratitude.jpg"],
      "Quadro com a frase move with gratitude it weighs less than ego em grafite",
    ),
  },
  {
    slug: "normal-day",
    nome: "NORMAL DAY",
    categoria: "quadro",
    subtipo: null,
    frase: "Your normal day is someone's dream",
    descricao: null,
    preco: 2300,
    dimensoes: "1,13 m × 82 cm",
    material: "Moldura em madeira",
    acabamento: "Pintado no vidro com folhas de ouro",
    prazo: null,
    status: "disponivel",
    imagens: fotos(
      "normal-day",
      ["normal-day.jpg"],
      "Quadro em folha dourada com a frase your normal day is someone's dream",
    ),
  },
  {
    slug: "luminaria-astronauta",
    nome: "LUMINÁRIA ASTRONAUTA",
    categoria: "objeto",
    subtipo: "Luminária",
    frase: null,
    descricao: null,
    preco: 2100,
    dimensoes: "45 cm (A)",
    material: null,
    acabamento: "Feita e pintada à mão",
    prazo: null,
    status: "disponivel",
    imagens: fotos(
      "luminaria-astronauta",
      ["astro.jpg"],
      "Luminária de astronauta grafitada em cores segurando um globo iluminado",
    ),
  },
  {
    slug: "mickey-mapa",
    nome: "MICKEY MAPA",
    categoria: "quadro",
    subtipo: null,
    frase: "Everything you want is on the other side of fear",
    descricao: null,
    preco: 2100,
    dimensoes: "95 × 65 cm",
    material: "Moldura fina em madeira (podendo ser modificada)",
    acabamento: "Pintura no vidro",
    prazo: null,
    status: "disponivel",
    imagens: fotos(
      "mickey-mapa",
      ["fear.jpg"],
      "Quadro em colagem sobre mapa com a frase everything you want is on the other side of fear",
    ),
  },
  {
    slug: "not-now-mac",
    nome: "NOT NOW MAC",
    categoria: "espelho",
    subtipo: null,
    frase: "Not now",
    descricao: null,
    preco: 1900,
    dimensoes: "85 × 65 cm",
    material: "Moldura em madeira",
    acabamento: "Pintado no espelho",
    prazo: null,
    status: "disponivel",
    imagens: fotos(
      "not-now-mac",
      ["not-now.jpg"],
      "Espelho oval de moldura amarela com arte pop e a frase not now",
    ),
  },
  {
    slug: "jesus-only",
    nome: "JESUS ONLY",
    categoria: "quadro",
    subtipo: null,
    frase: "Jesus is the only way",
    descricao: null,
    preco: 1900,
    dimensoes: "55 cm × 1,00 m",
    material: "Moldura em madeira",
    acabamento: "Pintado no vidro com folhas de prata",
    prazo: null,
    status: "disponivel",
    imagens: fotos(
      "jesus-only",
      ["jesus-only.jpg"],
      "Figura carregando o quadro jesus is the only way por uma estrada ao pôr do sol",
    ),
  },
  {
    slug: "pato-cowboy",
    nome: "PATO COWBOY",
    categoria: "objeto",
    subtipo: null,
    frase: null,
    descricao: null,
    preco: 1900,
    dimensoes: "30 × 30 cm",
    material: null,
    acabamento: "Feito e pintado à mão",
    prazo: null,
    status: "disponivel",
    imagens: fotos(
      "pato-cowboy",
      ["duck.jpg"],
      "Pato de borracha gigante com chapéu de cowboy em couro",
    ),
  },
  {
    slug: "relogio-decorativo",
    nome: "RELÓGIO DECORATIVO",
    categoria: "objeto",
    subtipo: "Relógio",
    frase: "Time is precious",
    descricao: null,
    preco: 1200,
    dimensoes: "54 cm de diâmetro",
    material: null,
    acabamento: "Pintado à mão",
    prazo: null,
    status: "disponivel",
    imagens: fotos(
      "relogio-decorativo",
      ["time.jpg"],
      "Relógio autoral com time is precious grafitado em banheiro de azulejos pretos",
    ),
  },
  {
    slug: "dope-real-life",
    nome: "DOPE REAL LIFE",
    categoria: "quadro",
    subtipo: null,
    frase: null,
    descricao: null,
    preco: null,
    dimensoes: "1,10 m × 70 cm",
    material: "Moldura em madeira",
    acabamento: "Pintado no vidro com folhas de prata",
    prazo: null,
    status: "vendida",
    imagens: fotos(
      "dope-real-life",
      ["real-life.jpg"],
      "Quadro em glitter prateado com frase em grafite vermelho sobre viver a vida real",
    ),
  },
];

export const pecasMock: Peca[] = sementes.map((semente, i) => ({
  ...semente,
  id: `mock-${semente.slug}`,
  numero: String(i + 1).padStart(2, "0"),
  destaque: i < 6,
  ordem: i,
  // uma peça com desconto de exemplo, para testar o de/por sem banco
  preco_original: semente.slug === "not-now-mac" ? 2200 : null,
  created_at: QUANDO,
  updated_at: QUANDO,
}));
