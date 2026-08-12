// Configuração central da vitrine vérít.lab.
// WhatsApp e URL vêm do ambiente (.env.local / Vercel); os fallbacks
// existem só para o build local sem env não quebrar.
export const site = {
  nome: "vérít.lab",
  cidade: "Maringá",
  descricao:
    "Laboratório de design contemporâneo. Espelhos, quadros e objetos únicos com frases em grafite. Nothing repeats.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://veritlab.com.br",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "5544997748888",
  instagram: "https://www.instagram.com/verit.lab/",
  instagramHandle: "@verit.lab",
} as const;

// Pendências de conteúdo (nada disso é renderizado até ser definido):
// - valor mínimo de encomenda → quando existir, recriar a tarja rosa na seção 04
// - prazo médio e política de envio → hoje o FAQ responde "combinado na conversa"
