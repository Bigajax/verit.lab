import Image from "next/image";
import Cta from "@/components/Cta";
import Reveal from "@/components/Reveal";
import FormEncomenda from "@/components/FormEncomenda";
import { pecas } from "@/data/pieces";
import { site, definir } from "@/data/site.config";
import { waGeral, waPeca } from "@/lib/whatsapp";

// Ritmo assimétrico da galeria: a proporção da foto varia por posição.
const RITMO = [
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-square",
];

export default function Home() {
  return (
    <main className="overflow-x-clip">
      {/* linha fina de parede de galeria */}
      <div aria-hidden className="fixed inset-y-0 left-6 z-10 hidden w-px bg-ouro/10 lg:block" />

      {/* ── 01. Hero — NADA AQUI SE REPETE. ─────────────────────── */}
      <section className="relative flex flex-col lg:min-h-[94vh]">
        <header className="relative z-20 flex w-full items-center justify-between px-5 pt-6 sm:px-12 lg:px-20">
          <p className="font-display text-2xl italic">vérít.lab</p>
          <p className="eyebrow hidden md:block">
            Contemporary design lab · {site.cidade}
          </p>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow hover:text-ambar"
          >
            {site.instagramHandle}
          </a>
        </header>

        {/* foto: metade direita inteira, fundida no preto */}
        <div className="relative z-0 order-2 mt-8 h-80 sm:h-[26rem] lg:absolute lg:inset-y-0 lg:right-6 lg:order-none lg:mt-0 lg:h-full lg:w-[52%]">
          <Image
            src="/images/ambiente/sala.jpg"
            alt="Sala escura da vérít.lab com quadros e espelhos grafitados iluminados"
            fill
            priority
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="object-cover [mask-image:linear-gradient(to_bottom,black_75%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent,black_32%)]"
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

        {/* tinta escorrendo do topo — cor original da textura, fundo transparente por alfa */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-0 hidden w-[44%] opacity-50 lg:block"
        >
          <Image
            src="/images/deco/tinta-cor.png"
            alt=""
            width={1280}
            height={853}
            priority
            className="h-auto w-full [mask-image:radial-gradient(130%_130%_at_0%_0%,black_55%,transparent_80%)]"
          />
        </div>

        <div className="relative z-10 order-1 w-full flex-1 px-5 pt-12 sm:px-12 lg:px-20 lg:order-none lg:flex lg:flex-col lg:justify-center lg:pt-0">
          <div className="lg:max-w-[42%] lg:pl-[3vw]">
            <h1 className="font-extrabold uppercase leading-[0.88] tracking-tight">
              <span className="block text-[17vw] sm:text-8xl lg:text-[5.6vw]">Nada</span>
              <span className="block text-[17vw] sm:text-8xl lg:text-[5.6vw]">Aqui</span>
              <span className="block text-[17vw] sm:text-8xl lg:text-[5.6vw]">Se</span>
              <span className="font-marker block -rotate-1 pt-2 text-[16vw] font-normal tracking-normal text-ambar sm:text-8xl lg:text-[5.2vw]">
                Repete.
              </span>
            </h1>
            <svg
              aria-hidden
              className="mt-1 h-4 w-72 text-ambar sm:w-96 lg:h-5 lg:w-[19vw]"
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
            <p className="mt-8 max-w-xs text-osso/70 lg:mt-10 lg:max-w-md lg:text-lg">
              Peças únicas, feitas à mão, para espaços que também têm
              personalidade.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Cta cta="hero-ver-pecas" href="#pecas" className="btn-ambar">
                Ver peças <span aria-hidden>→</span>
              </Cta>
              <Cta cta="hero-encomendar" href="#encomenda" className="btn-outline">
                Encomendar uma peça <span aria-hidden>→</span>
              </Cta>
            </div>
            <a
              href="#pecas"
              aria-label="Descer para a galeria"
              className="mt-12 hidden h-11 w-11 items-center justify-center rounded-full border border-osso/30 text-osso/60 transition-colors hover:border-ambar hover:text-ambar lg:inline-flex"
            >
              ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── 02. Galeria — peças únicas ──────────────────────────── */}
      <section id="pecas" className="scroll-mt-10 px-5 pt-24 sm:px-12 lg:px-20 lg:pt-36">
        <div className="gap-12 lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          {/* trilho esquerdo */}
          <div className="mb-14 lg:sticky lg:top-16 lg:mb-0 lg:self-start">
            <h2 className="font-extrabold uppercase leading-[0.9] tracking-tight">
              <span className="block text-6xl sm:text-7xl">Peças</span>
              <span className="font-marker block -rotate-1 pt-2 text-5xl font-normal normal-case tracking-normal text-ambar sm:text-6xl">
                únicas.
              </span>
            </h2>
            <p className="mt-6 max-w-56 text-osso/70">
              Cada uma existe uma única vez. Vendeu, não volta.
            </p>
            <p className="eyebrow mt-4 text-osso/45">preço sob consulta</p>
            {/* carimbo nothing repeat */}
            <svg
              aria-hidden
              viewBox="0 0 120 120"
              className="mt-12 hidden w-28 animate-[girar_20s_linear_infinite] text-rosa motion-reduce:animate-none lg:block"
            >
              <defs>
                <path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text fontSize="11" letterSpacing="3" fill="currentColor">
                <textPath href="#circ">nothing repeat · nothing repeat ·</textPath>
              </text>
            </svg>
          </div>

          {/* cards */}
          <div>
            <div className="columns-1 gap-6 sm:columns-2">
              {pecas.map((peca, i) => (
                <div key={peca.slug} className="mb-6 break-inside-avoid">
                  <Reveal>
                    <article className="group border border-ouro/25 bg-osso/[0.03]">
                      <div className={`relative overflow-hidden ${RITMO[i % RITMO.length]}`}>
                        <Image
                          src={peca.foto}
                          alt={peca.alt}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                          className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
                            peca.estado === "vendida" ? "opacity-40 saturate-50" : ""
                          }`}
                        />
                        {peca.estado === "vendida" && (
                          /* rosa: uso 1 de 2 */
                          <p
                            aria-hidden
                            className="font-marker absolute inset-0 flex -rotate-12 items-center justify-center text-4xl text-rosa"
                          >
                            vendida
                          </p>
                        )}
                      </div>
                      {/* etiqueta */}
                      <div className="flex items-center justify-between gap-4 p-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold uppercase tracking-[0.14em]">
                            {peca.nome}
                          </h3>
                          <p className="mt-1 text-sm text-osso/55">
                            {peca.tipo} · {peca.medida}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-ambar">
                            {peca.estado === "vendida" ? (
                              <Cta
                                cta={`peca-vendida-${peca.slug}`}
                                href="#encomenda"
                                className="font-medium text-osso/70 underline decoration-ouro/50 underline-offset-4 hover:text-ambar"
                              >
                                Encomende a sua →
                              </Cta>
                            ) : (
                              <Cta
                                cta={`peca-${peca.slug}`}
                                href={waPeca(peca)}
                                novaAba
                                className="underline-offset-4 hover:underline"
                              >
                                Quero essa →
                              </Cta>
                            )}
                          </p>
                        </div>
                        <div className="shrink-0 border border-ouro/40 px-3 py-2 text-center">
                          <p className="text-lg leading-none text-ambar">
                            {String(i + 1).padStart(2, "0")}
                          </p>
                          <p className="mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-osso/55">
                            {peca.estado === "vendida" ? "vendida" : "única"}
                          </p>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
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
              Cada objeto nasce para existir uma única vez. Vendeu, acabou —
              fica registrado aqui como parte do acervo.
            </p>
          </div>
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[3/4] w-full lg:-mr-16">
              <Image
                src="/images/ambiente/bandeja.jpg"
                alt="Bandeja dourada nothing repeat com pratos grafitados da vérít.lab"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-6 hidden w-40 rotate-3 lg:block">
              <div className="relative aspect-[9/16] w-full">
                <Image
                  src="/images/ambiente/patos.jpg"
                  alt="Lago cheio de patos pretos idênticos e um único pato amarelo"
                  fill
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
        <div className="grid gap-14 px-5 py-24 sm:px-12 lg:px-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div>
            <p className="eyebrow mb-4">Peças sob encomenda</p>
            <h2 className="font-display text-5xl leading-[0.95] sm:text-6xl">
              Você pensa.
              <br />
              <em className="text-ambar">A gente cria.</em>
            </h2>
            <p className="mt-6 max-w-sm text-osso/70">
              Você escolhe a frase, a referência ou a ideia. A vérít transforma
              isso em um objeto único.
            </p>
            <ol className="mt-10 space-y-4 border-t border-ouro/25 pt-6 text-sm text-osso/70">
              <li>
                <strong className="text-osso">01 — sua ideia.</strong> Toda peça
                começa numa conversa.
              </li>
              <li>
                <strong className="text-osso">02 — criação autoral.</strong>{" "}
                Moldura, grafite e acabamento à mão, no estúdio.
              </li>
              <li>
                <strong className="text-osso">03 — entrega.</strong> Assinada,
                única, sem cópia.
              </li>
            </ol>
            <p className="mt-8 text-osso/80">
              Encomendas a partir de{" "}
              <strong className="text-ambar">{definir.encomendaMinima}</strong>
            </p>
          </div>
          <FormEncomenda />
        </div>
      </section>

      {/* ── 05. Essência — curta ────────────────────────────────── */}
      <section className="px-5 py-24 sm:px-12 lg:px-20 lg:py-32">
        <Reveal>
          <div className="max-w-2xl border-l border-ouro/40 pl-6 sm:pl-10">
            <p className="eyebrow mb-6">Sobre a vérít</p>
            <p className="font-display text-3xl leading-snug sm:text-4xl">
              Em um mundo de objetos produzidos em massa, escolhemos fazer
              diferente. Criamos peças para quem procura o que não se encontra
              em qualquer lugar.
            </p>
            <p className="font-display mt-6 text-3xl italic text-ambar sm:text-4xl">
              Nada aqui se repete.
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
            className="eyebrow hover:text-ambar"
          >
            ver o que está acontecendo →
          </Cta>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {[
            {
              src: "/images/ambiente/estudio.jpg",
              alt: "Mesa de criação da vérít.lab com tintas, pincéis e espelho rabiscado",
              off: "",
            },
            {
              src: "/images/ambiente/quarto.jpg",
              alt: "Quarto com espelho oval amarelo e peças pop da vérít.lab",
              off: "lg:mt-10",
            },
            {
              src: "/images/ambiente/corredor.jpg",
              alt: "Corredor escuro com quadros neon e arte urbana",
              off: "",
            },
            {
              src: "/images/ambiente/hero.jpg",
              alt: "Espelho de moldura orgânica creme com frase pintada, em corredor de apartamento",
              off: "lg:mt-10",
            },
          ].map((foto) => (
            <Reveal key={foto.src} className={foto.off}>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
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
            <h2 className="font-display text-5xl leading-[0.95] sm:text-6xl">
              Encontrou <em className="text-ambar">a sua?</em>
            </h2>
            <p className="mt-4 text-osso/70">Peça única. Uma vez só.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Cta cta="final-whatsapp" href={waGeral()} novaAba className="btn-ambar">
                Quero a minha
              </Cta>
              <Cta cta="final-encomendar" href="#encomenda" className="btn-outline">
                Montar minha peça
              </Cta>
            </div>
          </div>
          <div className="mt-14 space-y-2 lg:mt-0">
            {[
              {
                q: "Qual o prazo de uma encomenda?",
                a: `O prazo médio é de ${definir.prazoMedio}, contando da aprovação da ideia. Peças prontas saem para entrega em seguida.`,
              },
              {
                q: "Vocês enviam para onde?",
                a: `Enviamos para ${definir.envio}. O frete é combinado na conversa, junto com a embalagem adequada para a peça.`,
              },
              {
                q: "Como cuido da minha peça?",
                a: "Limpe com pano seco e macio, sem produtos abrasivos. Evite sol direto e umidade — grafite e folha dourada gostam de luz indireta.",
              },
            ].map((item) => (
              <details key={item.q} className="group border-b border-ouro/25 pb-2">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-medium">
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
      <footer className="border-t border-ouro/25">
        <div className="flex flex-wrap items-end justify-between gap-8 px-5 py-14 sm:px-12 lg:px-20">
          <div>
            <p className="font-display text-4xl italic">vérít.lab</p>
            <p className="eyebrow mt-3 text-osso/40">
              {site.cidade} · nothing repeats
            </p>
          </div>
          <nav className="flex gap-8">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-osso/70 hover:text-ambar"
            >
              Instagram
            </a>
            <a
              href={waGeral()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-osso/70 hover:text-ambar"
            >
              WhatsApp
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
