// Monta as artes do topo em public/hero/ (14/10/2026).
//
// Para cada banner N:
// - se o Rafael já salvou a arte do gerador em banners/banner-N.png (e
//   banners/banner-N-celular.png), ela vira WebP: 2400 px no computador e
//   1080 px no celular;
// - senão, sai o PROVISÓRIO com foto real: a dupla de fotos lado a lado
//   (padrão Be Bless) no computador e a foto 4:5 no celular.
//
//   node scripts/montar-banners.cjs
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const saida = path.join(raiz, "public/hero");
fs.mkdirSync(saida, { recursive: true });

const P = (f) => path.join(raiz, "public/images", f);
// o provisório de cada banner: as fotos da dupla e a foto do celular
const PROVISORIO = {
  1: { dupla: [P("pecas/all-we-need.jpg"), P("pecas/not-now.jpg")], celular: P("pecas/all-we-need.jpg") },
  2: { dupla: [P("pecas/duck.jpg"), P("pecas/astro.jpg")], celular: P("pecas/duck.jpg") },
  3: { larga: P("ambiente/hero-sala.webp"), celular: P("ambiente/hero-sala.webp") },
};

// o NOME muda a cada leva de arte: o otimizador de imagem do Next (e o da
// Vercel) guarda a versão pelo endereço, e o mesmo nome com arte nova
// continuava mostrando a antiga (14/10/2026). Trocar aqui e em data/banners.ts.
const sufixo = "-a2";

const W = 2400;
const H = 1029;

async function computador(n) {
  const destino = path.join(saida, `banner-${n}${sufixo}.webp`);
  const arte = path.join(raiz, `banners/banner-${n}.png`);
  if (fs.existsSync(arte)) {
    // nunca amplia: a arte do gerador vem com ~1916 px, e esticar borra
    const { width } = await sharp(arte).metadata();
    const largura = Math.min(W, width);
    await sharp(arte).resize(largura, Math.round((largura * H) / W), { fit: "cover" }).webp({ quality: 88 }).toFile(destino);
    return { destino, origem: "arte" };
  }
  const p = PROVISORIO[n];
  if (p.larga) {
    await sharp(p.larga).resize(W, H, { fit: "cover", position: "centre" }).webp({ quality: 86 }).toFile(destino);
  } else {
    // a dupla: cada foto numa metade, cortada no meio (some a legenda do
    // topo e a marca d'água do pé do post), com um fio preto entre elas
    const metade = W / 2;
    const fotos = await Promise.all(
      p.dupla.map((f) => sharp(f).resize(metade - 2, H, { fit: "cover", position: "centre" }).toBuffer()),
    );
    await sharp({ create: { width: W, height: H, channels: 3, background: "#100d0a" } })
      .composite([
        { input: fotos[0], left: 0, top: 0 },
        { input: fotos[1], left: metade + 2, top: 0 },
      ])
      .webp({ quality: 86 })
      .toFile(destino);
  }
  return { destino, origem: "provisório" };
}

async function celular(n) {
  const destino = path.join(saida, `banner-${n}${sufixo}-celular.webp`);
  const arte = path.join(raiz, `banners/banner-${n}-celular.png`);
  if (fs.existsSync(arte)) {
    await sharp(arte).resize(1080, 1350, { fit: "cover" }).webp({ quality: 86 }).toFile(destino);
  } else {
    // o post inteiro traz a legenda no topo e a marca d'água no pé: corta
    // 12% de cada ponta antes de enquadrar
    const fonte = PROVISORIO[n].celular;
    const { width, height } = await sharp(fonte).metadata();
    const borda = Math.round(height * 0.12);
    await sharp(fonte)
      .extract({ left: 0, top: borda, width, height: height - 2 * borda })
      .resize(1080, 1350, { fit: "cover", position: "centre" })
      .webp({ quality: 86 })
      .toFile(destino);
  }
  return { destino, origem: fs.existsSync(arte) ? "arte" : "provisório" };
}

// O BANNER DE CRIAÇÃO (14/10/2026): o do meio da home, que abre a ficha de
// encomenda. 3:1 no computador (2400 x 800) e quadrado no celular (1080),
// como os banners do meio do molde. Arte em banners/banner-criacao.png e
// banner-criacao-celular.png; sem ela, o provisório é a foto da mesa de
// trabalho (o post do Dream Big, 22/09/2026) colada à direita, sumindo no
// preto do lado do texto. A bancada do estudio.jpg (640 px) o Rafael recusou.
const sufixoCriacao = "-a1";

async function criacao() {
  const arte = path.join(raiz, "banners/banner-criacao.png");
  const arteCel = path.join(raiz, "banners/banner-criacao-celular.png");
  const destino = path.join(saida, `criacao${sufixoCriacao}.webp`);
  const destinoCel = path.join(saida, `criacao${sufixoCriacao}-celular.webp`);
  const limpa = await sharp(path.join(raiz, "_raw-ig/novas-2026-10/2026-09-22-DdmLHghkZBS-1.jpg")).rotate().toBuffer();
  const sombra = (w, h, direcao) =>
    Buffer.from(
      `<svg width="${w}" height="${h}"><defs><linearGradient id="g" ${direcao}><stop offset="0" stop-color="#100d0a"/><stop offset="1" stop-color="#100d0a" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
    );

  if (fs.existsSync(arte)) {
    const { width: la } = await sharp(arte).metadata();
    const largura = Math.min(2400, la);
    await sharp(arte).resize(largura, Math.round(largura / 3), { fit: "cover" }).webp({ quality: 88 }).toFile(destino);
  } else {
    const fw = 900;
    const f = await sharp(limpa).resize(fw, 800, { fit: "cover", position: "centre" }).toBuffer();
    await sharp({ create: { width: 2400, height: 800, channels: 3, background: "#100d0a" } })
      .composite([
        { input: f, left: 2400 - fw, top: 0 },
        { input: sombra(500, 800, 'x1="0" x2="1"'), left: 2400 - fw, top: 0 },
      ])
      .webp({ quality: 86 })
      .toFile(destino);
  }

  if (fs.existsSync(arteCel)) {
    await sharp(arteCel).resize(1080, 1080, { fit: "cover" }).webp({ quality: 86 }).toFile(destinoCel);
  } else {
    const f = await sharp(limpa).resize(1080, 620, { fit: "cover", position: "centre" }).toBuffer();
    await sharp({ create: { width: 1080, height: 1080, channels: 3, background: "#100d0a" } })
      .composite([
        { input: f, left: 0, top: 0 },
        { input: sombra(1080, 260, 'x1="0" x2="0" y1="1" y2="0"'), left: 0, top: 360 },
      ])
      .webp({ quality: 86 })
      .toFile(destinoCel);
  }
  return fs.existsSync(arte) ? "arte" : "provisório";
}

(async () => {
  for (const n of [1, 2, 3]) {
    const c = await computador(n);
    const m = await celular(n);
    console.log(`banner ${n}: computador ${c.origem}, celular ${m.origem}`);
  }
  console.log(`banner de criação: ${await criacao()}`);
})();
