"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import type { Categoria, StatusPeca } from "@/lib/pecas";

const ERRO_DEMO =
  "Modo demonstração: configure o Supabase (.env.local) para salvar de verdade.";

function modoDemo() {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL;
}

// Toda escrita passa por aqui. RLS já bloqueia anônimos; o redirect é a
// camada de UX para sessão expirada.
async function clienteAutenticado() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

// A alteração precisa aparecer no site em segundos: derruba o cache da
// home, do catálogo, de todas as páginas de peça e do sitemap.
function revalidarVitrine() {
  revalidatePath("/");
  revalidatePath("/pecas");
  revalidatePath("/pecas/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin", "layout");
}

export type ImagemForm = { url: string; alt: string | null };

export type DadosPeca = {
  id?: string;
  slug: string;
  numero: string;
  nome: string;
  categoria: Categoria;
  subtipo: string | null;
  frase: string | null;
  descricao: string | null;
  preco: number | null;
  preco_original: number | null;
  dimensoes: string;
  material: string | null;
  acabamento: string | null;
  prazo: string | null;
  status: StatusPeca;
  destaque: boolean;
  imagens: ImagemForm[];
};

export type ResultadoAcao = { ok: true; id: string } | { ok: false; erro: string };

export async function salvarPeca(dados: DadosPeca): Promise<ResultadoAcao> {
  if (modoDemo()) return { ok: false, erro: ERRO_DEMO };
  const supabase = await clienteAutenticado();

  if (!dados.nome.trim()) return { ok: false, erro: "A peça precisa de um nome." };
  if (!dados.dimensoes.trim())
    return { ok: false, erro: "Preencha as dimensões da peça." };
  if (!dados.slug.trim()) return { ok: false, erro: "A peça precisa de um slug." };

  // slug único (ignorando a própria peça na edição)
  let confereSlug = supabase.from("pecas").select("id").eq("slug", dados.slug);
  if (dados.id) confereSlug = confereSlug.neq("id", dados.id);
  const { data: repetida } = await confereSlug.maybeSingle();
  if (repetida)
    return { ok: false, erro: `Já existe uma peça com o slug "${dados.slug}".` };

  const linha = {
    slug: dados.slug.trim(),
    numero: dados.numero.trim(),
    nome: dados.nome.trim(),
    categoria: dados.categoria,
    subtipo: dados.subtipo?.trim() || null,
    frase: dados.frase?.trim() || null,
    descricao: dados.descricao?.trim() || null,
    preco: dados.preco,
    preco_original: dados.preco_original,
    dimensoes: dados.dimensoes.trim(),
    material: dados.material?.trim() || null,
    acabamento: dados.acabamento?.trim() || null,
    prazo: dados.prazo?.trim() || null,
    status: dados.status,
    destaque: dados.destaque,
  };

  let id = dados.id;
  if (id) {
    const { error } = await supabase.from("pecas").update(linha).eq("id", id);
    if (error) return { ok: false, erro: error.message };
  } else {
    const { data, error } = await supabase
      .from("pecas")
      .insert(linha)
      .select("id")
      .single();
    if (error) return { ok: false, erro: error.message };
    id = data.id as string;
  }

  // imagens: substitui o conjunto inteiro na ordem enviada (0 = capa)
  const { error: erroLimpa } = await supabase
    .from("peca_imagens")
    .delete()
    .eq("peca_id", id);
  if (erroLimpa) return { ok: false, erro: erroLimpa.message };
  if (dados.imagens.length > 0) {
    const { error: erroImg } = await supabase.from("peca_imagens").insert(
      dados.imagens.map((img, i) => ({
        peca_id: id,
        url: img.url,
        alt: img.alt,
        ordem: i,
      })),
    );
    if (erroImg) return { ok: false, erro: erroImg.message };
  }

  revalidarVitrine();
  return { ok: true, id };
}

// A operação mais frequente: 1 clique na lista, sem confirmação.
export async function definirStatus(
  id: string,
  status: StatusPeca,
): Promise<ResultadoAcao> {
  if (modoDemo()) return { ok: false, erro: ERRO_DEMO };
  const supabase = await clienteAutenticado();
  const { error } = await supabase.from("pecas").update({ status }).eq("id", id);
  if (error) return { ok: false, erro: error.message };
  revalidarVitrine();
  return { ok: true, id };
}

export async function excluirPeca(id: string): Promise<ResultadoAcao> {
  if (modoDemo()) return { ok: false, erro: ERRO_DEMO };
  const supabase = await clienteAutenticado();

  // apaga também os arquivos do bucket (o path vem depois de /public/pecas/)
  const { data: imagens } = await supabase
    .from("peca_imagens")
    .select("url")
    .eq("peca_id", id);
  const caminhos = (imagens ?? [])
    .map((img) => img.url.split("/storage/v1/object/public/pecas/")[1])
    .filter((c): c is string => Boolean(c));
  if (caminhos.length > 0) {
    await supabase.storage.from("pecas").remove(caminhos);
  }

  const { error } = await supabase.from("pecas").delete().eq("id", id);
  if (error) return { ok: false, erro: error.message };
  revalidarVitrine();
  return { ok: true, id };
}

export async function duplicarPeca(id: string): Promise<ResultadoAcao> {
  if (modoDemo()) return { ok: false, erro: ERRO_DEMO };
  const supabase = await clienteAutenticado();

  const { data: original, error: erroBusca } = await supabase
    .from("pecas")
    .select("*, imagens:peca_imagens(url, alt, ordem)")
    .eq("id", id)
    .single();
  if (erroBusca || !original)
    return { ok: false, erro: erroBusca?.message ?? "Peça não encontrada." };

  // slug livre: -copia, -copia-2, -copia-3…
  const { data: existentes } = await supabase.from("pecas").select("slug, numero");
  const slugs = new Set((existentes ?? []).map((p) => p.slug));
  let slug = `${original.slug}-copia`;
  for (let n = 2; slugs.has(slug); n++) slug = `${original.slug}-copia-${n}`;

  const maiorNumero = Math.max(
    0,
    ...(existentes ?? []).map((p) => parseInt(p.numero, 10) || 0),
  );

  const { data: copia, error: erroCopia } = await supabase
    .from("pecas")
    .insert({
      slug,
      numero: String(maiorNumero + 1).padStart(2, "0"),
      nome: `${original.nome} (cópia)`,
      categoria: original.categoria,
      subtipo: original.subtipo,
      frase: original.frase,
      descricao: original.descricao,
      preco: original.preco,
      dimensoes: original.dimensoes,
      material: original.material,
      acabamento: original.acabamento,
      prazo: original.prazo,
      status: "disponivel",
      destaque: false,
      ordem: original.ordem,
    })
    .select("id")
    .single();
  if (erroCopia) return { ok: false, erro: erroCopia.message };

  const imagens = (original.imagens ?? []) as {
    url: string;
    alt: string | null;
    ordem: number;
  }[];
  if (imagens.length > 0) {
    await supabase.from("peca_imagens").insert(
      imagens.map((img) => ({
        peca_id: copia.id,
        url: img.url,
        alt: img.alt,
        ordem: img.ordem,
      })),
    );
  }

  revalidarVitrine();
  return { ok: true, id: copia.id as string };
}

// /admin/destaques: arrastar para reordenar → salva o campo `ordem`.
export async function salvarOrdemDestaques(ids: string[]): Promise<ResultadoAcao> {
  if (modoDemo()) return { ok: false, erro: ERRO_DEMO };
  const supabase = await clienteAutenticado();
  for (const [i, id] of ids.entries()) {
    const { error } = await supabase.from("pecas").update({ ordem: i }).eq("id", id);
    if (error) return { ok: false, erro: error.message };
  }
  revalidarVitrine();
  return { ok: true, id: "" };
}

export async function sair() {
  if (modoDemo()) redirect("/");
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
