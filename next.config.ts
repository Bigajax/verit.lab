import type { NextConfig } from "next";

// Fotos das peças vêm do Storage do Supabase (bucket público 'pecas').
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    // AVIF primeiro (menor), WebP como fallback; navegador sem suporte recebe o original.
    formats: ["image/avif", "image/webp"],
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
