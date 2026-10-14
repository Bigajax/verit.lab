import Image from "next/image";
import Cta from "@/components/Cta";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import Campanha from "@/components/Campanha";
import Beneficios from "@/components/Beneficios";
import FaixaFrases from "@/components/FaixaFrases";
import Estrela from "@/components/Estrela";
import BannerCriacao from "@/components/BannerCriacao";
import { banners } from "@/data/banners";
import PecaCard from "@/components/PecaCard";
import SiteFooter from "@/components/SiteFooter";
import { getDestaques } from "@/lib/pecas.server";
import { site } from "@/data/site.config";

// Imports estáticos das fotos de ambiente: blur automático + zero CLS.
import fotoBandeja from "@/public/images/ambiente/bandeja.jpg";
import fotoPatos from "@/public/images/ambiente/patos.jpg";
import fotoEstudio from "@/public/images/ambiente/estudio.jpg";
import fotoQuarto from "@/public/images/ambiente/quarto.jpg";
import fotoCorredor from "@/public/images/ambiente/corredor.jpg";
import fotoHero from "@/public/images/ambiente/hero.jpg";

// ISR: as peças vêm do Supabase e a página se reconstrói a cada 60 s
// (ou na hora, via revalidatePath, quando o admin salvar algo).
export const revalidate = 60;

export default async function Home() {
  // A home mostra só os destaques (máx. 8) — o acervo completo vive em /pecas.
  const pecas = await getDestaques();

  return (
    <main className="overflow-x-clip">
      <SiteHeader />

      {/* ── 01. A campanha: três banners, como no molde do estúdio ── */}
      <Campanha slides={banners} />
      <FaixaFrases />
      <Beneficios />

      {/* ── 02. Galeria — peças únicas ──────────────────────────── */}
      <section id="pecas" className="scroll-mt-10 px-5 pt-24 sm:px-12 lg:px-20 lg:pt-36">
        <div className="gap-12 lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          {/* trilho esquerdo — compacto no mobile: a primeira peça precisa
              aparecer ao final da primeira rolagem da seção */}
          <div className="mb-7 lg:sticky lg:top-16 lg:mb-0 lg:self-start">
            <h2 className="font-extrabold uppercase leading-[0.9] tracking-tight">
              <span className="block text-6xl sm:text-7xl">Peças</span>
              <span className="font-marker block -rotate-1 pt-2 text-5xl font-normal normal-case tracking-normal text-ciano sm:text-6xl">
                <span className="vl-gancho">
                  únicas.
                  <Estrela gasta className="vl-gancho__estrela" />
                </span>
              </span>
            </h2>
            <p className="mt-6 max-w-56 text-osso/70">
              Cada uma existe uma única vez. Vendeu, não volta.
            </p>
            <p className="eyebrow mt-4 hidden max-w-52 text-osso/55 lg:block">
              quantidade limitada · consulte disponibilidade
            </p>
            {/* carimbo nothing repeat, com a estrela da logo parada no meio */}
            <div className="vl-carimbo mt-12 hidden w-40 lg:block">
            <svg
              aria-hidden
              viewBox="0 0 120 120"
              className="w-full animate-[girar_20s_linear_infinite] text-magenta motion-reduce:animate-none"
            >
              <defs>
                <path id="circ" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
              </defs>
              <text fontSize="13.5" fontWeight="800" letterSpacing="2.2" fill="currentColor">
                <textPath href="#circ">nothing repeat · nothing repeat ·</textPath>
              </text>
            </svg>
            <Estrela gasta className="vl-carimbo__estrela" />
            </div>
          </div>

          {/* cards — overlay 4:5; 2 colunas no mobile (1ª peça em largura
              cheia), 3 no desktop */}
          <div>
            <div className="grid grid-cols-2 gap-x-2.5 gap-y-3.5 sm:gap-6 lg:grid-cols-3 [&>*:first-child]:col-span-2 sm:[&>*:first-child]:col-span-1">
              {pecas.map((peca, i) => (
                <Reveal key={peca.slug}>
                  <PecaCard
                    peca={peca}
                    sizes={
                      i === 0
                        ? "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        : "(min-width: 1024px) 30vw, 50vw"
                    }
                  />
                </Reveal>
              ))}
            </div>
            {/* etiquetas coladas meio tortas; no hover endireitam e pintam */}
            <div className="mt-8 flex flex-wrap justify-end gap-4">
              <Cta
                cta="galeria-acervo"
                href="/pecas"
                className="btn-outline -rotate-1 transition-all! duration-200 hover:rotate-0 hover:bg-ciano hover:border-ciano! hover:text-preto!"
              >
                Ver acervo completo <span aria-hidden>→</span>
              </Cta>
              <Cta
                cta="galeria-encomendar"
                href="#encomenda"
                className="btn-outline rotate-1 transition-all! duration-200 hover:rotate-0 hover:bg-ciano hover:border-ciano! hover:text-preto!"
              >
                Encomendar uma peça <span aria-hidden>→</span>
              </Cta>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03. NOTHING REPEAT — o conceito ─────────────────────── */}
      <section className="relative px-5 py-28 sm:px-12 lg:px-20 lg:py-40">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="relative z-10 lg:col-span-7">
            <h2 className="font-marker -rotate-1 text-[15vw] leading-[1.05] text-ciano sm:text-7xl lg:text-8xl">
              Nothing
              <br />
              repeat.
            </h2>
            <svg
              aria-hidden
              className="mt-2 h-3 w-44 text-ciano sm:w-60"
              viewBox="0 0 300 14"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M4 8 C 70 4, 160 12, 296 6"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            {/* "uma vez só." circulado à caneta, como quem insiste no ponto */}
            <p className="mt-8 inline-block">
              <span className="relative inline-block px-5 py-3">
                <svg
                  aria-hidden
                  viewBox="0 0 220 74"
                  fill="none"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full text-magenta"
                >
                  <path
                    d="M28 37 C 24 14, 120 6, 186 18 C 214 24, 210 52, 150 62 C 90 70, 20 62, 18 44 C 17 34, 40 26, 60 24"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-marker relative -rotate-2 inline-block text-2xl text-magenta sm:text-3xl">
                  uma vez só.
                </span>
              </span>
            </p>
            <p className="mt-8 text-2xl font-semibold tracking-tight leading-snug sm:text-3xl">
              Uma peça. Uma história. Uma vez.
            </p>
            <p className="mt-4 max-w-sm text-osso/70">
              Cada objeto nasce para existir uma única vez. Vendeu, acabou.
              Fica registrado aqui como parte do acervo.
            </p>
          </div>
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[3/4] w-full lg:-mr-16">
              <Image
                src={fotoBandeja}
                alt="Bandeja dourada nothing repeat com pratos grafitados da vérít.lab"
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-6 hidden w-40 rotate-3 lg:block">
              <div className="relative aspect-[9/16] w-full">
                <Image
                  src={fotoPatos}
                  alt="Lago cheio de patos pretos idênticos e um único pato amarelo"
                  fill
                  placeholder="blur"
                  sizes="160px"
                  className="object-cover"
                />
                {/* fitas adesivas segurando a foto, como colagem de atelier */}
                <span
                  aria-hidden
                  className="absolute -top-2 -left-3 h-5 w-14 -rotate-45 bg-osso/30"
                />
                <span
                  aria-hidden
                  className="absolute -bottom-2 -right-3 h-5 w-14 -rotate-45 bg-osso/30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04. Sob encomenda: o banner de criação abre a ficha (modal) ── */}
      <BannerCriacao />

      {/* ── 05. Essência — curta ────────────────────────────────── */}
      <section className="px-5 py-16 sm:px-12 sm:py-24 lg:px-20 lg:py-32">
        <Reveal>
          <div className="max-w-2xl border-l border-cinza/40 pl-6 sm:pl-10">
            <p className="eyebrow mb-6">Sobre a vérít</p>
            <p className="text-xl font-semibold tracking-tight leading-[1.45] sm:text-4xl sm:leading-snug">
              Em um mundo de objetos produzidos em massa, escolhemos fazer
              diferente. Criamos peças para quem procura o que não se encontra
              em qualquer lugar.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── 06. Instagram — o laboratório ───────────────────────── */}
      <section className="px-5 pb-24 sm:px-12 lg:px-20 lg:pb-32">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-4">O laboratório</p>
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {site.instagramHandle}
            </h2>
          </div>
          <Cta
            cta="bastidores-instagram"
            href={site.instagram}
            novaAba
            className="eyebrow inline-flex min-h-11 items-center hover:text-ciano"
          >
            ver o que está acontecendo →
          </Cta>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {[
            {
              src: fotoEstudio,
              alt: "Mesa de criação da vérít.lab com tintas, pincéis e espelho rabiscado",
              off: "",
            },
            {
              src: fotoQuarto,
              alt: "Quarto com espelho oval amarelo e peças pop da vérít.lab",
              off: "lg:mt-10",
            },
            {
              src: fotoCorredor,
              alt: "Corredor escuro com quadros neon e arte urbana",
              off: "",
            },
            {
              src: fotoHero,
              alt: "Espelho de moldura orgânica creme com frase pintada, em corredor de apartamento",
              off: "lg:mt-10",
            },
          ].map((foto) => (
            <Reveal key={foto.src.src} className={foto.off}>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-preto/85 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="eyebrow text-osso">
                      {site.instagramHandle} →
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 07. CTA final + FAQ ─────────────────────────────────── */}
      <section className="px-5 pb-24 sm:px-12 lg:px-20">
        <div className="border-t border-cinza/25 pt-16 lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-extrabold uppercase leading-[0.9] tracking-tight">
              <span className="block text-5xl sm:text-6xl">Encontrou</span>
              <span className="font-marker block -rotate-1 pt-2 text-4xl font-normal normal-case tracking-normal text-ciano sm:text-5xl">
                a sua?
              </span>
            </h2>
            <p className="mt-5 text-osso/70">Peça única. Uma vez só.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Cta cta="final-encomendar" href="#encomenda" className="btn-ciano">
                Montar minha peça
              </Cta>
              <Cta cta="final-ver-pecas" href="/pecas" className="btn-outline">
                Ver peças
              </Cta>
            </div>
          </div>
          <div className="mt-14 space-y-2 lg:mt-0">
            {[
              {
                q: "Qual o prazo de uma encomenda?",
                a: "Cada peça tem o seu tempo: o prazo é combinado na conversa, na aprovação da ideia. Peças prontas saem para entrega em seguida.",
              },
              {
                q: "Vocês enviam para onde?",
                a: "O envio, o frete e a embalagem são combinados direto na conversa, de acordo com a peça e a sua cidade.",
              },
              {
                q: "Como cuido da minha peça?",
                a: "Limpe com pano seco e macio, sem produtos abrasivos. Evite sol direto e umidade: grafite e folha dourada gostam de luz indireta.",
              },
            ].map((item) => (
              <details key={item.q} className="group border-b border-cinza/25 pb-2">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-4 font-medium">
                  {item.q}
                  <span className="text-cinza transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-4 text-osso/70">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 08. Footer ──────────────────────────────────────────── */}
      <SiteFooter />
    </main>
  );
}
