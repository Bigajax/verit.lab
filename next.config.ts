import type { NextConfig } from "next";

// Fotos das peças vêm do Storage do Supabase (bucket público 'pecas').
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  // o dev é aberto pelo 127.0.0.1 (o localhost acumula cookies e dá 431);
  // sem isto o Next 16 bloqueia o JS do dev e a página fica sem os cards
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    // AVIF primeiro (menor), WebP como fallback; navegador sem suporte recebe o original.
    formats: ["image/avif", "image/webp"],
    // 90 só para a foto do hero, que já chega no limite da resolução
    qualities: [75, 90],
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
