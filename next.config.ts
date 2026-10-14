import path from "node:path";
import type { NextConfig } from "next";

// Fotos das peças vêm do Storage do Supabase: o bucket 'pecas' (as antigas)
// e o 'produtos' (as que a dona envia pelo painel, desde 14/10/2026).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  // o dev é aberto pelo 127.0.0.1 (o localhost acumula cookies e dá 431)
  allowedDevOrigins: ["127.0.0.1"],
  /* build de conferência com o dev de pé: NEXT_DIST_DIR=.next-build; sem ela, o .next de sempre */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  /**
   * O PACOTE COMPARTILHADO (14/10/2026, a vérít troca o admin próprio pelo
   * painel do @vitrine/plataforma): o Next compila o pacote como código da
   * loja, e o pacote acha a loja pelo nome fixo @vitrine/loja (o alias
   * abaixo e o paths do tsconfig).
   */
  transpilePackages: ["@vitrine/plataforma"],
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, "@vitrine/loja": path.resolve(process.cwd(), "loja.config.ts") };
    return config;
  },
  experimental: {
    // a foto da peça enviada pelo painel
    serverActions: { bodySizeLimit: "8mb" },
  },
  async redirects() {
    return [
      // o admin próprio deu lugar ao painel do pacote (14/10/2026)
      { source: "/admin", destination: "/painel", permanent: false },
      { source: "/admin/:caminho*", destination: "/painel", permanent: false },
    ];
  },
  images: {
    // AVIF primeiro (menor), WebP como fallback; navegador sem suporte recebe o original.
    formats: ["image/avif", "image/webp"],
    // 90 só para a foto do hero, que já chega no limite da resolução
    qualities: [75, 86, 90],
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: "https",
            hostname: new URL(supabaseUrl).hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
