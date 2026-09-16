// Queries de leitura da vitrine — server-only (o client público não
// carrega cookies, então as páginas continuam cacheáveis via ISR).
import { supabasePublic } from "@/lib/supabase/server";
import { pecasMock } from "@/lib/pecas.mock";
import type { Peca, PecaImagem } from "@/lib/pecas";

const SELECT = "*, imagens:peca_imagens(id, url, alt, ordem)";

// Sem Supabase configurado (dev sem .env.local), a vitrine roda com os
// dados locais de exemplo — dá para testar tudo menos o admin.
function semSupabase() {
  const mock = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (mock)
    console.warn(
      "[verit] Supabase não configurado — servindo peças de exemplo (lib/pecas.mock.ts).",
    );
  return mock;
}

// Supabase configurado mas fora do ar (projeto pausado por inatividade
// no plano free, DNS, rede): em vez de derrubar a página — ou pior,
// deixar a ISR servir HTML velho apontando para fotos do Storage que o
// otimizador de imagem não consegue mais buscar —, a vitrine cai para os
// dados de exemplo, cujas fotos estão em /public/images/pecas. Na
// próxima revalidação (60 s) com o banco respondendo, volta ao real.
async function ouMock<T>(
  rotulo: string,
  consulta: () => Promise<T>,
  mock: () => T,
): Promise<T> {
  if (semSupabase()) return mock();
  try {
    return await consulta();
  } catch (erro) {
    console.error(
      `[verit] Supabase indisponível (${rotulo}) — servindo peças de exemplo.`,
      erro instanceof Error ? erro.message : erro,
    );
    return mock();
  }
}

function ordenaImagens<T extends { imagens: PecaImagem[] }>(peca: T): T {
  peca.imagens.sort((a, b) => a.ordem - b.ordem);
  return peca;
}

// Todas as peças do acervo, na ordenação manual do admin.
export function getPecas(): Promise<Peca[]> {
  return ouMock(
    "pecas",
    async () => {
      const { data, error } = await supabasePublic()
        .from("pecas")
        .select(SELECT)
        .order("ordem")
        .order("numero");
      if (error) throw new Error(error.message);
      return (data as Peca[]).map(ordenaImagens);
    },
    () => pecasMock,
  );
}

// Destaques da home (máx. 8, controlado pelo admin).
export function getDestaques(): Promise<Peca[]> {
  return ouMock(
    "destaques",
    async () => {
      const { data, error } = await supabasePublic()
        .from("pecas")
        .select(SELECT)
        .eq("destaque", true)
        .order("ordem")
        .order("numero")
        .limit(8);
      if (error) throw new Error(error.message);
      return (data as Peca[]).map(ordenaImagens);
    },
    () => pecasMock.filter((p) => p.destaque).slice(0, 8),
  );
}

export function getPecaPorSlug(slug: string): Promise<Peca | null> {
  return ouMock(
    `peca ${slug}`,
    async () => {
      const { data, error } = await supabasePublic()
        .from("pecas")
        .select(SELECT)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data ? ordenaImagens(data as Peca) : null;
    },
    () => pecasMock.find((p) => p.slug === slug) ?? null,
  );
}

// "Outras peças" da página da peça: mesma categoria, aleatórias,
// priorizando disponíveis. Sorteio acontece a cada revalidação (60 s).
export async function getOutras(peca: Peca, quantas = 3): Promise<Peca[]> {
  const todas = await ouMock(
    "outras",
    async () => {
      const { data, error } = await supabasePublic()
        .from("pecas")
        .select(SELECT)
        .eq("categoria", peca.categoria)
        .neq("id", peca.id);
      if (error) throw new Error(error.message);
      return (data as Peca[]).map(ordenaImagens);
    },
    () =>
      pecasMock.filter(
        (p) => p.categoria === peca.categoria && p.id !== peca.id,
      ),
  );
  const embaralha = <T,>(lista: T[]) => lista.sort(() => Math.random() - 0.5);
  const vivas = embaralha(todas.filter((p) => p.status !== "vendida"));
  const vendidas = embaralha(todas.filter((p) => p.status === "vendida"));
  return [...vivas, ...vendidas].slice(0, quantas);
}
