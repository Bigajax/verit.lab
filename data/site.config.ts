// Configuração central da vitrine vérít.lab.
// WhatsApp e URL vêm do ambiente (.env.local / Vercel); os fallbacks
// existem só para o build local sem env não quebrar.
export const site = {
  nome: "vérít.lab",
  cidade: "Maringá",
  descricao:
    "Laboratório de design contemporâneo. Espelhos, quadros e objetos únicos com frases em grafite. Nothing repeats.",
  // URL absoluta (og:image, sitemap, links do WhatsApp). Sem
  // NEXT_PUBLIC_SITE_URL, usa o domínio de produção que a Vercel injeta
  // (troca sozinho para o domínio próprio quando ele for configurado).
  // Um domínio que não resolve aqui = preview sem imagem no WhatsApp.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "5544997748888",
  instagram: "https://www.instagram.com/verit.lab/",
  instagramHandle: "@verit.lab",
} as const;

// Pendências de conteúdo (nada disso é renderizado até ser definido):
// - valor mínimo de encomenda → quando existir, recriar a tarja rosa na seção 04
// - prazo médio e política de envio → hoje o FAQ responde "combinado na conversa"
