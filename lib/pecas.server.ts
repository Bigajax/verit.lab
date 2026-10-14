// A PONTE ENTRE O PAINEL DO PACOTE E A VITRINE (14/10/2026). Server-only.
//
// O painel (@vitrine/plataforma) grava em produtos/produto_imagens; o site
// continua falando em Peca (lib/pecas.ts). Daqui sai a tradução:
// - o estoque da obra única ("Único": 1) diz se ela está disponível;
//   zerada, ela é vendida, a menos que esteja separada no painel, e aí é
//   reservada (a função pecas_separadas() conta isso sem expor a cliente);
// - o que é só da vérít (frase, medidas, material, acabamento, prazo,
//   subtipo) continua na tabela antiga pecas, ligada pelo MESMO id;
// - o número do acervo sai do código (VL-0014 vira 14).
//
// Lê com o cliente anônimo, sem cookies, em cache com a etiqueta "catalogo",
// que o painel apaga ao salvar. Antes do SQL do painel rodar (as tabelas
// novas não existem), lê pecas do jeito antigo; com o banco fora do ar,
// serve o acervo de reserva (lib/pecas.mock.ts).
import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/lib/supabase/server";
import { pecasMock } from "@/lib/pecas.mock";
import type { Categoria, Peca, PecaImagem, StatusPeca } from "@/lib/pecas";

const CATEGORIAS: Categoria[] = ["espelho", "quadro", "objeto"];

type Produto = {
  id: string;
  codigo: string;
  nome: string;
  slug: string;
  descricao: string | null;
  preco: number | null;
  preco_promocional: number | null;
  tamanhos: string[] | null;
  estoque: Record<string, number> | null;
  destaque: boolean | null;
  ordem: number | null;
  created_at: string;
  categoria: { slug: string } | null;
  imagens: PecaImagem[];
};

type Extra = Pick<Peca, "id" | "subtipo" | "frase" | "dimensoes" | "material" | "acabamento" | "prazo">;

function ordenaImagens<T extends { imagens: PecaImagem[] }>(peca: T): T {
  peca.imagens.sort((a, b) => a.ordem - b.ordem);
  return peca;
}

function statusDe(p: Produto, separadas: Set<string>): StatusPeca {
  // obra cadastrada sem tamanho: o painel não conta estoque, então está à venda
  if (!p.tamanhos?.length || !p.estoque) return "disponivel";
  const total = Object.values(p.estoque).reduce((s, n) => s + (Number(n) || 0), 0);
  if (total > 0) return "disponivel";
  return separadas.has(p.id) ? "reservada" : "vendida";
}

function numeroDe(codigo: string): string {
  const n = Number(codigo.replace(/\D/g, ""));
  return Number.isFinite(n) && n > 0 ? String(n).padStart(2, "0") : codigo;
}

async function lerDoPainel(): Promise<Peca[] | null> {
  const db = supabasePublic();
  const { data, error } = await db
    .from("produtos")
    .select(
      "id, codigo, nome, slug, descricao, preco, preco_promocional, tamanhos, estoque, destaque, ordem, created_at, categoria:categorias(slug), imagens:produto_imagens(id, url, alt, ordem)",
    )
    .order("ordem")
    .order("codigo");
  if (error) {
    // as tabelas do painel ainda não existem: o SQL não rodou
    if (/does not exist|schema cache/i.test(error.message)) return null;
    throw new Error(error.message);
  }

  const [{ data: extras }, { data: separadasIds }] = await Promise.all([
    db.from("pecas").select("id, subtipo, frase, dimensoes, material, acabamento, prazo"),
    db.rpc("pecas_separadas"),
  ]);
  const porId = new Map(((extras ?? []) as Extra[]).map((e) => [e.id, e]));
  const separadas = new Set<string>(((separadasIds ?? []) as string[]).map(String));

  return (data as unknown as Produto[]).map((p) => {
    const extra = porId.get(p.id);
    const promocional = p.preco_promocional != null && p.preco != null && p.preco_promocional < p.preco;
    const slugCategoria = p.categoria?.slug as Categoria | undefined;
    return ordenaImagens({
      id: p.id,
      slug: p.slug,
      numero: numeroDe(p.codigo),
      nome: p.nome,
      categoria: slugCategoria && CATEGORIAS.includes(slugCategoria) ? slugCategoria : "objeto",
      subtipo: extra?.subtipo ?? null,
      frase: extra?.frase ?? null,
      descricao: p.descricao,
      preco: promocional ? Number(p.preco_promocional) : p.preco != null ? Number(p.preco) : null,
      preco_original: promocional ? Number(p.preco) : null,
      dimensoes: extra?.dimensoes ?? "",
      material: extra?.material ?? null,
      acabamento: extra?.acabamento ?? null,
      prazo: extra?.prazo ?? null,
      status: statusDe(p, separadas),
      destaque: !!p.destaque,
      ordem: p.ordem ?? 0,
      created_at: p.created_at,
      updated_at: p.created_at,
      imagens: p.imagens ?? [],
    });
  });
}

// o caminho de antes do painel (até o SQL rodar): a tabela pecas como era
async function lerDoAdminAntigo(): Promise<Peca[]> {
  const { data, error } = await supabasePublic()
    .from("pecas")
    .select("*, imagens:peca_imagens(id, url, alt, ordem)")
    .order("ordem")
    .order("numero");
  if (error) throw new Error(error.message);
  return (data as Peca[]).map(ordenaImagens);
}

const catalogoEmCache = unstable_cache(
  async () => (await lerDoPainel()) ?? (await lerDoAdminAntigo()),
  ["verit-catalogo"],
  { tags: ["catalogo"], revalidate: 60 },
);

// Todas as obras do acervo, na ordem do painel. Sem Supabase configurado
// ou com ele fora do ar, o acervo de reserva.
export async function getPecas(): Promise<Peca[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return pecasMock;
  try {
    return await catalogoEmCache();
  } catch (erro) {
    console.error(
      "[verit] Supabase indisponível: servindo o acervo de reserva.",
      erro instanceof Error ? erro.message : erro,
    );
    return pecasMock;
  }
}

// As obras da home: as marcadas como "Mais vendida" no painel (o destaque), até 8.
export async function getDestaques(): Promise<Peca[]> {
  return (await getPecas()).filter((p) => p.destaque).slice(0, 8);
}

export async function getPecaPorSlug(slug: string): Promise<Peca | null> {
  return (await getPecas()).find((p) => p.slug === slug) ?? null;
}

// "Outras peças" da página da obra: mesma categoria, aleatórias,
// priorizando disponíveis. O sorteio acontece a cada revalidação (60 s).
export async function getOutras(peca: Peca, quantas = 3): Promise<Peca[]> {
  const todas = (await getPecas()).filter((p) => p.categoria === peca.categoria && p.id !== peca.id);
  const embaralha = <T,>(lista: T[]) => lista.sort(() => Math.random() - 0.5);
  const vivas = embaralha(todas.filter((p) => p.status !== "vendida"));
  const vendidas = embaralha(todas.filter((p) => p.status === "vendida"));
  return [...vivas, ...vendidas].slice(0, quantas);
}
