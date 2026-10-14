// A logo nova da vérít.lab (outubro de 2026), recortada da foto do perfil do
// Instagram: letra ciano #45C2FF sobre magenta #C000C7. O verde separa as
// duas (magenta tem G = 0, ciano G ~ 194): vira o alfa, e a textura gasta
// do carimbo continua, porque os riscos magenta dentro da letra viram furo.
//
//   node scripts/recortar-logo.cjs <entrada.png>
const sharp = require("sharp");
const path = require("path");

const entrada = process.argv[2] ?? path.join(__dirname, "../_raw-ig/logo-nova-ig-2026-10-14.png");
const CIANO = [0x45, 0xc2, 0xff];

(async () => {
  const { data, info } = await sharp(entrada).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const saida = Buffer.alloc(info.width * info.height * 4);
  for (let p = 0; p < info.width * info.height; p++) {
    const g = data[p * 3 + 1];
    const alfa = Math.max(0, Math.min(255, Math.round(((g - 25) / (185 - 25)) * 255)));
    saida.set([...CIANO, alfa], p * 4);
  }
  const base = sharp(saida, { raw: { width: info.width, height: info.height, channels: 4 } });
  const recortada = await base.png().toBuffer().then((b) => sharp(b).trim({ threshold: 10 }).png().toBuffer());
  await sharp(recortada).toFile(path.join(__dirname, "../public/marca/logo.png"));
  // o ícone: a logo no quadrado magenta, como a foto do perfil
  const m = await sharp(recortada).metadata();
  const lado = 512;
  const larg = Math.round(lado * 0.74);
  const logo = await sharp(recortada).resize(larg).toBuffer();
  const alt = Math.round((m.height * larg) / m.width);
  await sharp({ create: { width: lado, height: lado, channels: 4, background: "#C000C7" } })
    .composite([{ input: logo, left: Math.round((lado - larg) / 2), top: Math.round((lado - alt) / 2) }])
    .png()
    .toFile(path.join(__dirname, "../public/marca/icone.png"));
  console.log("logo", m.width, "x", m.height);
})();
