// Leva ao banco as obras que entraram no lib/pecas.mock.ts enquanto o
// Supabase estava pausado (14/10/2026). Só ACRESCENTA, nunca sobrescreve: a
// dona pode ter mudado preço e status pelo painel.
//
// - peça do mock que não existe no banco (pelo slug): sobe as fotos para o
//   bucket "pecas" e cria a peça, com o próximo número do acervo;
// - peça que já existe: acrescenta só as fotos do mock que ela não tem
//   (as fotos extras da Rolling Move e do Mickey Mapa);
// - as novidades disponíveis vão para o topo da ordem e para a home.
//
//   tsx scripts/semear-novas.ts            (ensaio: só mostra o plano)
//   tsx scripts/semear-novas.ts --gravar
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { pecasMock } from "../lib/pecas.mock";

for (const linha of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const i = linha.indexOf("=");
  if (i > 0 && !linha.trim().startsWith("#")) process.env[linha.slice(0, i).trim()] = linha.slice(i + 1).trim();
}
const gravar = process.argv.includes("--gravar");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

type Linha = { id: string; slug: string; numero: string; ordem: number; imagens: { url: string; ordem: number }[] };

async function subir(arquivoLocal: string): Promise<string> {
  const nome = path.basename(arquivoLocal);
  const bytes = fs.readFileSync(path.join("public", arquivoLocal));
  if (gravar) {
    const { error } = await db.storage.from("pecas").upload(nome, bytes, { contentType: "image/webp", upsert: false });
    if (error && !/exists/i.test(error.message)) throw new Error(`upload ${nome}: ${error.message}`);
  }
  return db.storage.from("pecas").getPublicUrl(nome).data.publicUrl;
}

(async () => {
  const { data, error } = await db.from("pecas").select("id, slug, numero, ordem, imagens:peca_imagens(url, ordem)");
  if (error) throw new Error(error.message);
  const banco = data as Linha[];
  const porSlug = new Map(banco.map((p) => [p.slug, p]));
  let maior = Math.max(0, ...banco.map((p) => parseInt(p.numero, 10) || 0));

  // as novas, na ordem do número do acervo do mock (a data do post)
  const novas = pecasMock.filter((p) => !porSlug.has(p.slug)).sort((a, b) => a.numero.localeCompare(b.numero));
  const novasDisponiveis = novas.filter((p) => p.status === "disponivel");
  const desloca = novasDisponiveis.length;
  const fimDaFila = Math.max(0, ...banco.map((p) => p.ordem)) + desloca + 1;

  console.log(`${gravar ? "GRAVANDO" : "ENSAIO"}: ${banco.length} peças no banco, ${novas.length} novas\n`);

  // 1) as antigas descem para abrir o topo para as novidades disponíveis
  if (desloca) {
    console.log(`ordem: as ${banco.length} peças do banco descem ${desloca} posições`);
    if (gravar)
      for (const p of banco) {
        const { error: e } = await db.from("pecas").update({ ordem: p.ordem + desloca }).eq("id", p.id);
        if (e) throw new Error(e.message);
      }
  }

  // 2) as novas
  let topo = 0;
  let fila = fimDaFila;
  for (const p of novas) {
    maior += 1;
    const numero = String(maior).padStart(2, "0");
    const disponivel = p.status === "disponivel";
    const ordem = disponivel ? topo++ : fila++;
    console.log(`+ ${numero} ${p.nome} (${p.status}, ordem ${ordem}${disponivel ? ", na home" : ""}): ${p.imagens.length} foto(s)`);
    if (!gravar) continue;
    const { data: criada, error: e } = await db
      .from("pecas")
      .insert({
        slug: p.slug,
        numero,
        nome: p.nome,
        categoria: p.categoria,
        subtipo: p.subtipo,
        frase: p.frase,
        descricao: p.descricao,
        preco: p.preco,
        dimensoes: p.dimensoes,
        material: p.material,
        acabamento: p.acabamento,
        prazo: p.prazo,
        status: p.status,
        destaque: disponivel,
        ordem,
      })
      .select("id")
      .single();
    if (e) throw new Error(`${p.slug}: ${e.message}`);
    for (const img of p.imagens) {
      const url = await subir(img.url);
      const { error: ei } = await db.from("peca_imagens").insert({ peca_id: criada.id, url, alt: img.alt, ordem: img.ordem });
      if (ei) throw new Error(`${p.slug} foto: ${ei.message}`);
    }
  }

  // 3) fotos extras das que já existem (só as .webp novas do mock)
  for (const p of pecasMock) {
    const noBanco = porSlug.get(p.slug);
    if (!noBanco) continue;
    const tem = new Set(noBanco.imagens.map((i) => path.basename(i.url)));
    const faltam = p.imagens.filter((i) => i.url.endsWith(".webp") && !tem.has(path.basename(i.url)));
    if (!faltam.length) continue;
    let ordem = Math.max(-1, ...noBanco.imagens.map((i) => i.ordem)) + 1;
    console.log(`~ ${noBanco.numero} ${p.slug}: +${faltam.length} foto(s) no fim da galeria`);
    if (!gravar) continue;
    for (const img of faltam) {
      const url = await subir(img.url);
      const { error: ei } = await db.from("peca_imagens").insert({ peca_id: noBanco.id, url, alt: img.alt, ordem: ordem++ });
      if (ei) throw new Error(`${p.slug} foto: ${ei.message}`);
    }
  }
  console.log(gravar ? "\nPronto." : "\nEnsaio. Para gravar: --gravar");
})().catch((e) => {
  console.error("ERRO:", e instanceof Error ? e.message : e);
  process.exit(1);
});
