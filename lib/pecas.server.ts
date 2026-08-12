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

function ordenaImagens<T extends { imagens: PecaImagem[] }>(peca: T): T {
  peca.imagens.sort((a, b) => a.ordem - b.ordem);
  return peca;
}

// Todas as peças do acervo, na ordenação manual do admin.
export async function getPecas(): Promise<Peca[]> {
  if (semSupabase()) return pecasMock;
  const { data, error } = await supabasePublic()
    .from("pecas")
    .select(SELECT)
    .order("ordem")
    .order("numero");
  if (error) throw new Error(`Supabase (pecas): ${error.message}`);
  return (data as Peca[]).map(ordenaImagens);
}

// Destaques da home (máx. 8, controlado pelo admin).
export async function getDestaques(): Promise<Peca[]> {
  if (semSupabase()) return pecasMock.filter((p) => p.destaque).slice(0, 8);
  const { data, error } = await supabasePublic()
    .from("pecas")
    .select(SELECT)
    .eq("destaque", true)
    .order("ordem")
    .order("numero")
    .limit(8);
  if (error) throw new Error(`Supabase (destaques): ${error.message}`);
  return (data as Peca[]).map(ordenaImagens);
}

export async function getPecaPorSlug(slug: string): Promise<Peca | null> {
  if (semSupabase()) return pecasMock.find((p) => p.slug === slug) ?? null;
  const { data, error } = await supabasePublic()
    .from("pecas")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Supabase (peca ${slug}): ${error.message}`);
  return data ? ordenaImagens(data as Peca) : null;
}

// "Outras peças" da página da peça: mesma categoria, aleatórias,
// priorizando disponíveis. Sorteio acontece a cada revalidação (60 s).
export async function getOutras(peca: Peca, quantas = 3): Promise<Peca[]> {
  let todas: Peca[];
  if (semSupabase()) {
    todas = pecasMock.filter(
      (p) => p.categoria === peca.categoria && p.id !== peca.id,
    );
  } else {
    const { data, error } = await supabasePublic()
      .from("pecas")
      .select(SELECT)
      .eq("categoria", peca.categoria)
      .neq("id", peca.id);
    if (error) throw new Error(`Supabase (outras): ${error.message}`);
    todas = (data as Peca[]).map(ordenaImagens);
  }
  const embaralha = <T,>(lista: T[]) => lista.sort(() => Math.random() - 0.5);
  const vivas = embaralha(todas.filter((p) => p.status !== "vendida"));
  const vendidas = embaralha(todas.filter((p) => p.status === "vendida"));
  return [...vivas, ...vendidas].slice(0, quantas);
}
