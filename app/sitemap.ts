import type { MetadataRoute } from "next";
import { getPecas } from "@/lib/pecas.server";
import { site } from "@/data/site.config";

// Sitemap dinâmico: home, catálogo e todas as peças.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pecas = await getPecas();
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/pecas`, changeFrequency: "daily", priority: 0.9 },
    ...pecas.map((peca) => ({
      url: `${site.url}/pecas/${peca.slug}`,
      lastModified: new Date(peca.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
