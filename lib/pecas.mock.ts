// O acervo local. Entra quando o Supabase não está configurado OU não
// responde (lib/pecas.server.ts cai para cá). ATENÇÃO: desde que o projeto
// do Supabase da vérít pausou (conferido em 14/10/2026: o endereço nem
// resolve), este arquivo É o que o site no ar mostra. Peça nova entra aqui,
// e entra no banco também quando ele voltar.
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
> & {
  /** obra postada depois da v1 do site: disponível, vai para o topo e para a home */
  novidade?: boolean;
};

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
    status: "reservada",
    imagens: fotos(
      "rolling-is-love",
      ["all-we-need.jpg"],
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
      ["gratitude.jpg", "rolling-move-1.webp", "rolling-move-2.webp"],
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
      ["fear.jpg", "mickey-mapa-1.webp"],
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

  // ── As obras postadas de 20/08 a 07/10/2026 (baixadas em 14/10, originais
  // em _raw-ig/novas-2026-10). As legendas não trazem preço nem medida: fica
  // "sob consulta" e sem medida até a vérít dizer. Nunca chutar. "(vendido)"
  // na legenda vira status vendida.
  {
    slug: "always-pray",
    nome: "ALWAYS PRAY",
    categoria: "quadro",
    subtipo: null,
    frase: "Bad days: pray. Good days: pray. Every day: pray.",
    descricao: null,
    preco: null,
    dimensoes: "",
    material: null,
    acabamento: null,
    prazo: null,
    status: "vendida",
    imagens: fotos(
      "always-pray",
      ["always-pray-1.webp"],
      "Quadro de moldura preta entalhada com uma cruz laranja e a frase every day pray",
    ),
  },
  {
    slug: "good-day",
    nome: "GOOD DAY",
    categoria: "quadro",
    subtipo: null,
    frase: null,
    descricao: null,
    preco: null,
    dimensoes: "",
    material: null,
    acabamento: null,
    prazo: null,
    status: "vendida",
    imagens: fotos(
      "good-day",
      ["good-day-1.webp"],
      "Quadro preto e branco de uma escultura clássica coberto de palavras grafitadas em rosa e laranja, como good day e blessed",
    ),
  },
  {
    slug: "try-again",
    nome: "TRY AGAIN",
    categoria: "quadro",
    subtipo: null,
    frase: "Don't be afraid to try again",
    descricao: null,
    preco: null,
    dimensoes: "",
    material: null,
    acabamento: null,
    prazo: null,
    status: "disponivel",
    novidade: true,
    imagens: fotos(
      "try-again",
      ["try-again-1.webp"],
      "Quadro de moldura preta entalhada com fita de frágil vermelha ao fundo e a frase don't be afraid to try again em preto",
    ),
  },
  {
    slug: "be-authentic",
    nome: "BE AUTHENTIC",
    categoria: "quadro",
    subtipo: null,
    frase: "Be authentic",
    descricao: null,
    preco: null,
    dimensoes: "",
    material: null,
    acabamento: null,
    prazo: null,
    status: "vendida",
    imagens: fotos(
      "be-authentic",
      ["be-authentic-1.webp"],
      "Quadro de moldura preta com um rosto em close coberto de palavras grafitadas em rosa, como be authentic",
    ),
  },
  {
    slug: "life-is-now",
    nome: "LIFE IS NOW",
    categoria: "quadro",
    subtipo: null,
    frase: "Luck always finds me. Life is now.",
    descricao: null,
    preco: null,
    dimensoes: "",
    material: null,
    acabamento: null,
    prazo: null,
    status: "disponivel",
    novidade: true,
    imagens: fotos(
      "life-is-now",
      ["life-is-now-1.webp"],
      "Quadro de moldura preta com um skatista de roupa laranja no ar e as frases luck always finds me e life is now em rosa",
    ),
  },
  {
    slug: "you-love",
    nome: "YOU LOVE",
    categoria: "espelho",
    subtipo: null,
    frase: "Tell people you love them",
    descricao: null,
    preco: null,
    dimensoes: "",
    material: null,
    acabamento: null,
    prazo: null,
    status: "vendida",
    imagens: fotos(
      "you-love",
      ["you-love-1.webp", "you-love-2.webp", "you-love-3.webp"],
      "Espelho de moldura orgânica cinza com a frase tell people you love them pintada em roxo",
    ),
  },
  {
    slug: "dream-big",
    nome: "DREAM BIG",
    categoria: "quadro",
    subtipo: null,
    frase: "Dream big",
    descricao: null,
    preco: null,
    dimensoes: "",
    material: null,
    acabamento: null,
    prazo: null,
    status: "disponivel",
    novidade: true,
    imagens: fotos(
      "dream-big",
      ["dream-big-1.webp", "dream-big-2.webp"],
      "Quadro pequeno em rosa e verde neon com um rosto sorridente e a frase dream big",
    ),
  },
  {
    slug: "protect-your-peace",
    nome: "PROTECT YOUR PEACE",
    categoria: "quadro",
    subtipo: null,
    frase: "Protect your peace",
    descricao: null,
    preco: null,
    dimensoes: "",
    material: null,
    acabamento: null,
    prazo: null,
    status: "disponivel",
    novidade: true,
    imagens: fotos(
      "protect-your-peace",
      ["protect-your-peace-1.webp", "protect-your-peace-2.webp"],
      "Quadro de moldura preta com fita de frágil vermelha ao fundo e a frase protect your peace em preto",
    ),
  },
  {
    slug: "i-hope",
    nome: "I HOPE",
    categoria: "quadro",
    subtipo: null,
    frase: "I hope you feel good day",
    descricao: null,
    preco: null,
    dimensoes: "",
    material: null,
    acabamento: null,
    prazo: null,
    status: "disponivel",
    novidade: true,
    imagens: fotos(
      "i-hope",
      ["i-hope-1.webp", "i-hope-2.webp"],
      "Quadro de moldura preta entalhada com fundo preto e a frase i hope you feel good day em verde neon",
    ),
  },
];

// O número do acervo segue a ordem do array (as novas são 12 a 20): ele
// aparece no cartão e vai na mensagem do WhatsApp, então nunca renumerar.
// A ORDEM da vitrine é outra: as novidades disponíveis primeiro.
// espelho do banco em 14/10/2026
const DE_POR: Record<string, number> = { "rolling-is-love": 3000, "pernalonga-smoking": 3000 };

const ordenadas = sementes.map(({ novidade, ...semente }, i) => ({ semente, i, novidade: !!novidade }));
const primeiro = (x: (typeof ordenadas)[number]) => (x.novidade && x.semente.status === "disponivel" ? 0 : 1);

export const pecasMock: Peca[] = [...ordenadas]
  .sort((a, b) => primeiro(a) - primeiro(b) || a.i - b.i)
  .map(({ semente, i, novidade }, ordem) => ({
    ...semente,
    id: `mock-${semente.slug}`,
    numero: String(i + 1).padStart(2, "0"),
    // na home: as novidades e as seis primeiras do acervo
    destaque: novidade || i < 6,
    ordem,
    // o "de" que está no banco (gravado pelo painel), e nada inventado: o
    // "de R$ 2.200" do Not Now Mac era exemplo de teste e foi ao ar
    // (corrigido em 14/10/2026); o catálogo diz R$ 1.900
    preco_original: DE_POR[semente.slug] ?? null,
    created_at: QUANDO,
    updated_at: QUANDO,
  }));
