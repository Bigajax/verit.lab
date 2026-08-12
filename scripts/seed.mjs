// Seed da Fase 1 — migra as 11 peças hardcoded para o Supabase.
// Uso:  node scripts/seed.mjs
// Lê NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY de .env.local.
// Idempotente: upsert por slug; re-rodar não duplica peças nem imagens.

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

// ── env ─────────────────────────────────────────────────────────────
const raiz = path.resolve(import.meta.dirname, "..");
try {
  const env = await readFile(path.join(raiz, ".env.local"), "utf-8");
  for (const linha of env.split("\n")) {
    const m = linha.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  // sem .env.local — usa o ambiente do shell
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY (.env.local).");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

// ── catálogo 2026 (dados do antigo data/pieces.ts) ──────────────────
// destaque = true nas 6 primeiras (grid da home).
const pecas = [
  {
    slug: "rolling-is-love",
    nome: "ROLLING IS LOVE",
    categoria: "espelho",
    subtipo: null,
    frase: "All we need is love",
    preco: 2800,
    dimensoes: "1,13 m × 82 cm",
    material: "Moldura em madeira",
    acabamento: "Pintado no espelho",
    foto: "all-we-need.jpg",
    alt: "Espelho com moldura preta entalhada e a frase all we need is love em grafite",
    status: "disponivel",
  },
  {
    slug: "pernalonga-smoking",
    nome: "PERNALONGA / SMOKING",
    categoria: "espelho",
    subtipo: null,
    frase: null,
    preco: 2600,
    dimensoes: "1,25 m × 65 cm",
    material: "Madeira, espelho e LED",
    acabamento: "Pintado na madeira",
    foto: "toon.jpg",
    alt: "Espelho retroiluminado com personagem de desenho segurando um saco de dinheiro",
    status: "disponivel",
  },
  {
    slug: "rolling-move",
    nome: "ROLLING MOVE",
    categoria: "quadro",
    subtipo: null,
    frase: "Move with gratitude, it weighs less than ego",
    preco: 2500,
    dimensoes: "95 × 65 cm",
    material: "Moldura em madeira",
    acabamento: "Pintura no vidro com arte em mapa de NY por baixo",
    foto: "gratitude.jpg",
    alt: "Quadro com a frase move with gratitude it weighs less than ego em grafite",
    status: "disponivel",
  },
  {
    slug: "normal-day",
    nome: "NORMAL DAY",
    categoria: "quadro",
    subtipo: null,
    frase: "Your normal day is someone's dream",
    preco: 2300,
    dimensoes: "1,13 m × 82 cm",
    material: "Moldura em madeira",
    acabamento: "Pintado no vidro com folhas de ouro",
    foto: "normal-day.jpg",
    alt: "Quadro em folha dourada com a frase your normal day is someone's dream",
    status: "disponivel",
  },
  {
    slug: "luminaria-astronauta",
    nome: "LUMINÁRIA ASTRONAUTA",
    categoria: "objeto",
    subtipo: "Luminária",
    frase: null,
    preco: 2100,
    dimensoes: "45 cm (A)",
    material: null,
    acabamento: "Feita e pintada à mão",
    foto: "astro.jpg",
    alt: "Luminária de astronauta grafitada em cores segurando um globo iluminado",
    status: "disponivel",
  },
  {
    slug: "mickey-mapa",
    nome: "MICKEY MAPA",
    categoria: "quadro",
    subtipo: null,
    frase: "Everything you want is on the other side of fear",
    preco: 2100,
    dimensoes: "95 × 65 cm",
    material: "Moldura fina em madeira (podendo ser modificada)",
    acabamento: "Pintura no vidro",
    foto: "fear.jpg",
    alt: "Quadro em colagem sobre mapa com a frase everything you want is on the other side of fear",
    status: "disponivel",
  },
  {
    slug: "not-now-mac",
    nome: "NOT NOW MAC",
    categoria: "espelho",
    subtipo: null,
    frase: "Not now",
    preco: 1900,
    dimensoes: "85 × 65 cm",
    material: "Moldura em madeira",
    acabamento: "Pintado no espelho",
    foto: "not-now.jpg",
    alt: "Espelho oval de moldura amarela com arte pop e a frase not now",
    status: "disponivel",
  },
  {
    slug: "jesus-only",
    nome: "JESUS ONLY",
    categoria: "quadro",
    subtipo: null,
    frase: "Jesus is the only way",
    preco: 1900,
    dimensoes: "55 cm × 1,00 m",
    material: "Moldura em madeira",
    acabamento: "Pintado no vidro com folhas de prata",
    foto: "jesus-only.jpg",
    alt: "Figura carregando o quadro jesus is the only way por uma estrada ao pôr do sol",
    status: "disponivel",
  },
  {
    slug: "pato-cowboy",
    nome: "PATO COWBOY",
    categoria: "objeto",
    subtipo: null,
    frase: null,
    preco: 1900,
    dimensoes: "30 × 30 cm",
    material: null,
    acabamento: "Feito e pintado à mão",
    foto: "duck.jpg",
    alt: "Pato de borracha gigante com chapéu de cowboy em couro",
    status: "disponivel",
  },
  {
    slug: "relogio-decorativo",
    nome: "RELÓGIO DECORATIVO",
    categoria: "objeto",
    subtipo: "Relógio",
    frase: "Time is precious",
    preco: 1200,
    dimensoes: "54 cm de diâmetro",
    material: null,
    acabamento: "Pintado à mão",
    foto: "time.jpg",
    alt: "Relógio autoral com time is precious grafitado em banheiro de azulejos pretos",
    status: "disponivel",
  },
  // Fora do catálogo 2026 — inferida como vendida.
  {
    slug: "dope-real-life",
    nome: "DOPE REAL LIFE",
    categoria: "quadro",
    subtipo: null,
    frase: null,
    preco: null,
    dimensoes: "1,10 m × 70 cm",
    material: "Moldura em madeira",
    acabamento: "Pintado no vidro com folhas de prata",
    foto: "real-life.jpg",
    alt: "Quadro em glitter prateado com frase em grafite vermelho sobre viver a vida real",
    status: "vendida",
  },
];

// ── execução ────────────────────────────────────────────────────────
for (const [i, p] of pecas.entries()) {
  const numero = String(i + 1).padStart(2, "0");
  const destaque = i < 6;

  // 1. foto → Storage (bucket público 'pecas')
  const arquivo = path.join(raiz, "public", "images", "pecas", p.foto);
  const bytes = await readFile(arquivo);
  const ext = path.extname(p.foto).slice(1);
  const nomeStorage = `${p.slug}-${Date.now()}.${ext}`;
  const up = await supabase.storage.from("pecas").upload(nomeStorage, bytes, {
    contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
  });
  if (up.error) {
    console.error(`✗ upload ${p.foto}: ${up.error.message}`);
    process.exit(1);
  }
  const { data: pub } = supabase.storage.from("pecas").getPublicUrl(nomeStorage);

  // 2. peça (upsert por slug — re-rodar atualiza em vez de duplicar)
  const { data: peca, error: erroPeca } = await supabase
    .from("pecas")
    .upsert(
      {
        slug: p.slug,
        numero,
        nome: p.nome,
        categoria: p.categoria,
        subtipo: p.subtipo,
        frase: p.frase,
        preco: p.preco,
        dimensoes: p.dimensoes,
        material: p.material,
        acabamento: p.acabamento,
        status: p.status,
        destaque,
        ordem: i,
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single();
  if (erroPeca) {
    console.error(`✗ peça ${p.slug}: ${erroPeca.message}`);
    process.exit(1);
  }

  // 3. imagem de capa (substitui as anteriores para manter idempotência)
  await supabase.from("peca_imagens").delete().eq("peca_id", peca.id);
  const { error: erroImg } = await supabase.from("peca_imagens").insert({
    peca_id: peca.id,
    url: pub.publicUrl,
    alt: p.alt,
    ordem: 0,
  });
  if (erroImg) {
    console.error(`✗ imagem ${p.slug}: ${erroImg.message}`);
    process.exit(1);
  }

  console.log(`✓ ${numero} ${p.nome}${destaque ? " (destaque)" : ""}`);
}

console.log(`\nSeed concluído: ${pecas.length} peças no banco.`);
