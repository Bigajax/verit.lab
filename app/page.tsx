import Image from "next/image";
import Link from "next/link";
import Cta from "@/components/Cta";
import Reveal from "@/components/Reveal";
import FormEncomenda from "@/components/FormEncomenda";
import HeaderFixo from "@/components/HeaderFixo";
import PecaCard from "@/components/PecaCard";
import RabiscoHover from "@/components/RabiscoHover";
import SiteFooter from "@/components/SiteFooter";
import { getDestaques } from "@/lib/pecas.server";
import { site } from "@/data/site.config";

// Imports estáticos das fotos de ambiente: blur automático + zero CLS.
import fotoSala from "@/public/images/ambiente/sala.jpg";
import fotoBandeja from "@/public/images/ambiente/bandeja.jpg";
import fotoPatos from "@/public/images/ambiente/patos.jpg";
import fotoEstudio from "@/public/images/ambiente/estudio.jpg";
import fotoQuarto from "@/public/images/ambiente/quarto.jpg";
import fotoCorredor from "@/public/images/ambiente/corredor.jpg";
import fotoHero from "@/public/images/ambiente/hero.jpg";
import tintaCor from "@/public/images/deco/tinta-cor.png";

// ISR: as peças vêm do Supabase e a página se reconstrói a cada 60 s
// (ou na hora, via revalidatePath, quando o admin salvar algo).
export const revalidate = 60;

// Seta de scroll rabiscada à mão — mesmo traço do sublinhado do H1, em rosa.
function SetaRabiscada({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 60"
      fill="none"
      className={`-rotate-6 ${className ?? ""}`}
    >
      <path
        d="M21 4 C 15 18, 26 30, 19 48"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M9 40 C 12 45, 16 49, 19 52"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M31 38 C 27 43, 23 48, 19 52"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function Home() {
  // A home mostra só os destaques (máx. 8) — o acervo completo vive em /pecas.
  const pecas = await getDestaques();

  return (
    <main className="overflow-x-clip">
      {/* header fixo: transparente no topo, fundo escuro ao rolar */}
      <HeaderFixo>
          <p className="shrink-0 font-display text-2xl italic">vérít.lab</p>
          <nav
            aria-label="Categorias"
            className="hidden items-center gap-2.5 border border-ouro/40 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-osso/85 md:flex"
          >
            <Link href="/pecas?categoria=quadro" className="hover:text-ambar">
              Art
            </Link>
            <span className="text-ambar">/</span>
            <Link href="/pecas?categoria=espelho" className="hover:text-ambar">
              Mirrors
            </Link>
            <span className="text-ambar">/</span>
            <Link href="/pecas?categoria=objeto" className="hover:text-ambar">
              Objects
            </Link>
            <span className="text-ambar">·</span>
            <span>{site.cidade}</span>
          </nav>
          <nav aria-label="Principal" className="flex items-center gap-3 sm:gap-6">
            <Link
              href="/pecas"
              className="eyebrow group relative inline-flex min-h-11 items-center text-osso/85 hover:text-ambar"
            >
              Peças
              <RabiscoHover />
            </Link>
            <a
              href="#encomenda"
              className="eyebrow group relative inline-flex min-h-11 items-center text-osso/85 hover:text-ambar"
            >
              Encomendar
              <RabiscoHover />
            </a>
            {/* acesso do dono: /admin/login digitado direto */}
          </nav>
      </HeaderFixo>

      {/* ── 01. Hero — NADA AQUI SE REPETE. ─────────────────────── */}
      {/* mobile: 100svh (sem pulo da barra do Safari) menos o header em fluxo */}
      <section
        id="hero"
        className="relative flex min-h-[calc(100svh-4.75rem)] flex-col lg:min-h-[88vh]"
      >
        {/* foto: fundo inteiro no mobile; metade direita no desktop.
            -top: sobe atrás do header transparente até o topo da página */}
        <div className="absolute inset-x-0 -top-[4.75rem] bottom-0 z-0 lg:left-auto lg:right-0 lg:w-[56%]">
          <Image
            src={fotoSala}
            alt="Sala escura da vérít.lab com quadros e espelhos grafitados iluminados"
            fill
            preload
            placeholder="blur"
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="object-cover object-[62%_center] lg:object-center lg:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_28%,rgba(0,0,0,0.75)_45%,black_62%)]"
          />
          {/* scrim mobile: texto na faixa escura de cima, foto respira no meio */}
          <div
            aria-hidden
            className="absolute inset-0 lg:hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,8,6,0.94) 0%, rgba(10,8,6,0.88) 42%, rgba(10,8,6,0.55) 68%, rgba(10,8,6,0.90) 100%)",
            }}
          />
          {/* escurece o topo da foto (o watermark gravado nela some atrás do header) */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 hidden h-40 lg:block"
            style={{
              background:
                "linear-gradient(to bottom, #100d0a 0%, rgba(16,13,10,0.72) 50%, transparent 100%)",
            }}
          />
        </div>

        {/* tinta escorrendo do topo — decorativa, só no desktop: carrega lazy.
            -top: nasce atrás do header transparente, sem corte seco */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 -top-[4.75rem] z-0 hidden w-[44%] opacity-50 lg:block"
        >
          <Image
            src={tintaCor}
            alt=""
            loading="lazy"
            sizes="(min-width: 1024px) 44vw, 1px"
            className="h-auto w-full [mask-image:radial-gradient(130%_130%_at_0%_0%,black_55%,transparent_80%)]"
          />
        </div>

        <div className="relative z-10 flex w-full flex-1 flex-col px-5 pt-[5.5rem] sm:px-12 lg:justify-center lg:px-20 lg:pt-0">
          <div className="lg:max-w-[46%] lg:pl-[3vw]">
            {/* kicker: o que a vérít vende, em 1 segundo — 1 linha em 360px */}
            <p className="mb-5 flex flex-wrap items-center gap-x-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ambar sm:gap-x-2 sm:text-[0.7rem] sm:tracking-[0.18em]">
              <span>Espelhos</span>
              <span aria-hidden className="text-rosa">·</span>
              <span>Quadros</span>
              <span aria-hidden className="text-rosa">·</span>
              <span>Objetos</span>
              <span aria-hidden className="hidden text-rosa sm:inline">·</span>
              {/* o "feito à mão" escrito à mão */}
              <span className="font-marker hidden -rotate-2 text-base normal-case tracking-normal text-rosa sm:inline">
                Feitos à mão
              </span>
            </p>
            {/* H1 em 2 linhas fixas — quebra manual, nunca 4 linhas */}
            <h1 className="font-extrabold uppercase leading-[0.92] tracking-tight">
              <span className="block text-[clamp(2.7rem,12.5vw,4.8rem)] lg:text-[clamp(3.5rem,7vw,6.5rem)]">
                Nada aqui
              </span>
              {/* inline-block: o sublinhado acompanha a largura de "se repete." */}
              <span className="inline-block -rotate-1 pt-2">
                <span className="font-marker block text-[clamp(2.5rem,11.5vw,4.4rem)] font-normal tracking-normal text-ambar lg:text-[clamp(3.2rem,6.4vw,6rem)]">
                  Se repete.
                </span>
                <svg
                  aria-hidden
                  className="mt-1 block h-3 w-full text-ambar lg:h-4"
                  viewBox="0 0 300 14"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 9 C 60 3, 150 12, 296 5"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-normal text-osso/90 lg:text-xl">
              Peças únicas, feitas à mão, para espaços que também têm
              personalidade.
            </p>
            {/* CTAs compactos no mobile: empilhados, ≤120px somados */}
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Cta
                cta="hero-ver-pecas"
                href="/pecas"
                className="btn-ambar w-full py-3.5! sm:w-auto sm:py-4!"
              >
                Ver peças <span aria-hidden>→</span>
              </Cta>
              <Cta
                cta="hero-encomendar"
                href="#encomenda"
                className="btn-outline w-full py-3.5! sm:w-auto sm:py-4!"
              >
                Encomendar uma peça <span aria-hidden>→</span>
              </Cta>
            </div>
            {/* seta desktop */}
            <a
              href="#pecas"
              aria-label="Descer para a galeria"
              className="mt-14 hidden text-rosa transition-opacity [animation:flutuar_2.6s_ease-in-out_infinite] hover:opacity-75 motion-reduce:animate-none lg:inline-block"
            >
              <SetaRabiscada className="h-14 w-auto" />
            </a>
          </div>
          {/* seta mobile: ancorada no rodapé do hero */}
          <a
            href="#pecas"
            aria-label="Descer para a galeria"
            className="mb-6 mt-auto inline-block self-start text-rosa [animation:flutuar_2.6s_ease-in-out_infinite] motion-reduce:animate-none lg:hidden"
          >
            <SetaRabiscada className="h-10 w-auto" />
          </a>
        </div>
      </section>

      {/* ── Faixa rotativa — taglines do catálogo ───────────────── */}
      <div
        aria-hidden
        className="relative -rotate-1 overflow-hidden bg-rosa py-3"
        style={{ width: "104%", marginLeft: "-2%" }}
      >
        <div className="flex w-max animate-[faixa_32s_linear_infinite] motion-reduce:animate-none">
          {[0, 1].map((k) => (
            <p
              key={k}
              className="flex shrink-0 items-center text-sm font-bold uppercase tracking-[0.2em] text-preto"
            >
              {[
                "this is not just decor.",
                "made to be noticed.",
                "your wall deserves attitude.",
                "art doesn't need permission.",
                "one piece. new energy.",
              ].map((frase) => (
                <span key={frase} className="flex items-center">
                  <span className="px-5">{frase}</span>
                  <span aria-hidden>/</span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>

      {/* ── 02. Galeria — peças únicas ──────────────────────────── */}
      <section id="pecas" className="scroll-mt-10 px-5 pt-24 sm:px-12 lg:px-20 lg:pt-36">
        <div className="gap-12 lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          {/* trilho esquerdo — compacto no mobile: a primeira peça precisa
              aparecer ao final da primeira rolagem da seção */}
          <div className="mb-7 lg:sticky lg:top-16 lg:mb-0 lg:self-start">
            <h2 className="font-extrabold uppercase leading-[0.9] tracking-tight">
              <span className="block text-6xl sm:text-7xl">Peças</span>
              <span className="font-marker block -rotate-1 pt-2 text-5xl font-normal normal-case tracking-normal text-ambar sm:text-6xl">
                únicas.
              </span>
            </h2>
            <p className="mt-6 max-w-56 text-osso/70">
              Cada uma existe uma única vez. Vendeu, não volta.
            </p>
            <p className="eyebrow mt-4 hidden max-w-52 text-osso/55 lg:block">
              quantidade limitada · consulte disponibilidade
            </p>
            {/* carimbo nothing repeat */}
            <svg
              aria-hidden
              viewBox="0 0 120 120"
              className="mt-12 hidden w-40 animate-[girar_20s_linear_infinite] text-rosa motion-reduce:animate-none lg:block"
            >
              <defs>
                <path id="circ" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
              </defs>
              <text fontSize="13.5" fontWeight="800" letterSpacing="2.2" fill="currentColor">
                <textPath href="#circ">nothing repeat · nothing repeat ·</textPath>
              </text>
            </svg>
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
            <div className="mt-8 flex flex-wrap justify-end gap-4">
              <Cta cta="galeria-acervo" href="/pecas" className="btn-outline">
                Ver acervo completo <span aria-hidden>→</span>
              </Cta>
              <Cta cta="galeria-encomendar" href="#encomenda" className="btn-outline">
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
            <h2 className="font-marker -rotate-1 text-[15vw] leading-[1.05] text-ambar sm:text-7xl lg:text-8xl">
              Nothing
              <br />
              repeat.
            </h2>
            <svg
              aria-hidden
              className="mt-2 h-3 w-44 text-ambar sm:w-60"
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
            {/* rosa: uso 2 de 2 */}
            <p className="font-marker mt-6 -rotate-2 text-xl text-rosa">
              uma vez só.
            </p>
            <p className="font-display mt-8 text-2xl leading-snug sm:text-3xl">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04. Sob encomenda — você pensa, a gente cria ────────── */}
      <section
        id="encomenda"
        className="scroll-mt-10 border-y border-ouro/25 bg-osso/[0.03]"
      >
        <div className="grid gap-14 px-4 py-16 sm:px-12 sm:py-24 lg:px-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div>
            <p className="eyebrow mb-4">Peças sob encomenda</p>
            <h2 className="font-extrabold uppercase leading-[0.9] tracking-tight">
              <span className="block text-5xl sm:text-6xl">Você</span>
              <span className="block text-5xl sm:text-6xl">pensa.</span>
              <span className="font-marker block -rotate-1 pt-3 text-4xl font-normal normal-case tracking-normal text-rosa sm:text-5xl">
                a gente cria.
              </span>
            </h2>
            <p className="mt-7 max-w-sm text-osso/70">
              Você escolhe a frase, a referência ou a ideia. A vérít transforma
              isso em um objeto único.
            </p>
            <ol className="mt-10 space-y-4 text-osso/70">
              <li>
                <strong className="mr-2 text-rosa">01</strong>
                <strong className="text-osso">sua ideia.</strong> Toda peça
                começa numa conversa.
              </li>
              <li>
                <strong className="mr-2 text-rosa">02</strong>
                <strong className="text-osso">criação autoral.</strong> Moldura,
                grafite e acabamento à mão.
              </li>
              <li>
                <strong className="mr-2 text-rosa">03</strong>
                <strong className="text-osso">entrega.</strong> Assinada, única,
                sem cópia.
              </li>
            </ol>
            {/* Tarja de valor mínimo removida até a vérít definir o número real
                (nenhum placeholder pode ir pro ar). */}
          </div>
          <FormEncomenda />
        </div>
      </section>

      {/* ── 05. Essência — curta ────────────────────────────────── */}
      <section className="px-5 py-16 sm:px-12 sm:py-24 lg:px-20 lg:py-32">
        <Reveal>
          <div className="max-w-2xl border-l border-ouro/40 pl-6 sm:pl-10">
            <p className="eyebrow mb-6">Sobre a vérít</p>
            <p className="font-display text-xl leading-[1.45] sm:text-4xl sm:leading-snug">
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
            <h2 className="font-display text-4xl sm:text-5xl">
              {site.instagramHandle}
            </h2>
          </div>
          <Cta
            cta="bastidores-instagram"
            href={site.instagram}
            novaAba
            className="eyebrow inline-flex min-h-11 items-center hover:text-ambar"
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
        <div className="border-t border-ouro/25 pt-16 lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-extrabold uppercase leading-[0.9] tracking-tight">
              <span className="block text-5xl sm:text-6xl">Encontrou</span>
              <span className="font-marker block -rotate-1 pt-2 text-4xl font-normal normal-case tracking-normal text-ambar sm:text-5xl">
                a sua?
              </span>
            </h2>
            <p className="mt-5 text-osso/70">Peça única. Uma vez só.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Cta cta="final-encomendar" href="#encomenda" className="btn-ambar">
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
              <details key={item.q} className="group border-b border-ouro/25 pb-2">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between py-4 font-medium">
                  {item.q}
                  <span className="text-ouro transition-transform group-open:rotate-45">
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
