import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cta from "@/components/Cta";
import FechamentoCta from "@/components/FechamentoCta";
import GaleriaPeca from "@/components/GaleriaPeca";
import PecaCard from "@/components/PecaCard";
import RabiscoHover from "@/components/RabiscoHover";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  capa,
  formataReais,
  percentualDesconto,
  rotuloTipo,
  temDesconto,
  type Peca,
} from "@/lib/pecas";
import { getOutras, getPecaPorSlug, getPecas } from "@/lib/pecas.server";
import { waPecaPagina, waPecaVendida } from "@/lib/whatsapp";

// ISR por peça: pré-renderiza as conhecidas no build, gera as novas
// on-demand e revalida a cada 60 s (ou na hora, via admin).
export const revalidate = 60;

export async function generateStaticParams() {
  const pecas = await getPecas();
  return pecas.map((peca) => ({ slug: peca.slug }));
}

// SEO: o dono manda esse link no WhatsApp/Instagram — o preview
// precisa mostrar a foto e o nome certos.
export async function generateMetadata({
  params,
}: PageProps<"/pecas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const peca = await getPecaPorSlug(slug);
  if (!peca) return {};
  const foto = capa(peca);
  const description =
    peca.frase ??
    peca.descricao?.slice(0, 150) ??
    `${rotuloTipo(peca)} único, feito à mão. ${peca.dimensoes}. Nada aqui se repete.`;
  return {
    title: `${peca.nome} · vérit.lab`,
    description,
    alternates: { canonical: `/pecas/${peca.slug}` },
    openGraph: {
      title: `${peca.nome} · vérit.lab`,
      description,
      images: foto ? [foto.url] : [],
    },
  };
}

function FichaTecnica({ peca }: { peca: Peca }) {
  const linhas: [string, string][] = [
    ["Tipo", rotuloTipo(peca)],
    ["Dimensões", peca.dimensoes],
    ...(peca.material ? ([["Material", peca.material]] as [string, string][]) : []),
    ...(peca.acabamento
      ? ([["Acabamento", peca.acabamento]] as [string, string][])
      : []),
    ...(peca.prazo
      ? ([["Prazo de produção", peca.prazo]] as [string, string][])
      : []),
    ["Acervo", `nº ${peca.numero}`],
  ];
  return (
    <dl className="mt-10">
      {linhas.map(([rotulo, valor]) => (
        <div
          key={rotulo}
          className="flex items-baseline justify-between gap-6 border-b border-ouro/15 py-3"
        >
          <dt className="shrink-0 text-[0.65rem] uppercase tracking-[0.24em] text-osso/50">
            {rotulo}
          </dt>
          <dd className="text-right text-sm text-osso/85">{valor}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function PaginaPeca({ params }: PageProps<"/pecas/[slug]">) {
  const { slug } = await params;
  const peca = await getPecaPorSlug(slug);
  if (!peca) notFound();

  const outras = await getOutras(peca);
  const vendida = peca.status === "vendida";
  const reservada = peca.status === "reservada";

  return (
    <main className="overflow-x-clip">
      <SiteHeader />

      <section className="px-5 pt-10 sm:px-12 lg:px-20 lg:pt-16">
        {/* migalha discreta de volta ao catálogo */}
        <Link
          href="/pecas"
          className="eyebrow group relative inline-flex min-h-11 items-center hover:text-ambar"
        >
          ← Todas as peças
          <RabiscoHover />
        </Link>

        <div className="mt-6 gap-14 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {/* coluna esquerda — galeria */}
          <GaleriaPeca imagens={peca.imagens} nome={peca.nome} />

          {/* coluna direita — informações (sticky no desktop) */}
          <div className="mt-10 lg:mt-0 lg:sticky lg:top-10 lg:self-start">
            {/* badge do acervo + status */}
            <p className="inline-flex items-center gap-3 border border-ouro/40 px-3 py-2">
              <span className="text-lg leading-none text-ambar">
                {peca.numero}
              </span>
              <span
                className={`text-[0.6rem] uppercase tracking-[0.18em] ${
                  vendida ? "text-rosa" : reservada ? "text-ouro" : "text-osso/55"
                }`}
              >
                {vendida ? "vendida" : reservada ? "reservada" : "única"}
              </span>
            </p>

            {/* nome com o sublinhado de pincel do hero, na largura do texto */}
            <h1 className="mt-5 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
              <span className="inline-block">
                {peca.nome}
                <svg
                  aria-hidden
                  viewBox="0 0 300 14"
                  fill="none"
                  preserveAspectRatio="none"
                  className="mt-2 block h-2.5 w-full text-ambar"
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

            {peca.frase && (
              <p className="font-marker mt-4 -rotate-1 text-2xl text-ambar">
                “{peca.frase}”
              </p>
            )}

            {vendida ? (
              <p className="font-marker mt-6 -rotate-1 text-4xl text-rosa">
                vendida
              </p>
            ) : reservada ? (
              /* mesmo tratamento da vendida, em ouro — reserva ainda pode cair */
              <p className="font-marker mt-6 -rotate-1 text-4xl text-ouro">
                reservada
              </p>
            ) : temDesconto(peca) ? (
              /* de/por: original riscado + preço grande + rabisco rosa */
              <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
                <span className="text-xl text-osso/45 line-through">
                  {formataReais(peca.preco_original!)}
                </span>
                <span className="text-4xl font-extrabold text-ambar">
                  {formataReais(peca.preco!)}
                </span>
                <span className="font-marker -rotate-2 text-2xl text-rosa">
                  -{percentualDesconto(peca)}%
                </span>
              </p>
            ) : (
              <p className="mt-6 text-4xl font-extrabold text-ambar">
                {peca.preco != null ? formataReais(peca.preco) : "sob consulta"}
              </p>
            )}

            {peca.descricao && (
              <p className="font-display mt-6 max-w-md text-xl leading-snug text-osso/85">
                {peca.descricao}
              </p>
            )}

            <FichaTecnica peca={peca} />

            {/* CTA principal — WhatsApp, único mecanismo de conversão */}
            <Cta
              cta={vendida ? `peca-vendida-${peca.slug}` : `peca-quero-${peca.slug}`}
              href={vendida ? waPecaVendida(peca) : waPecaPagina(peca)}
              novaAba
              className="btn-ambar mt-9 w-full -rotate-1 transition-all! duration-200 hover:rotate-0 hover:brightness-110"
            >
              {vendida ? (
                <>
                  Encomendar uma parecida <span aria-hidden>→</span>
                </>
              ) : (
                <>
                  Quero essa <span aria-hidden>→</span>
                </>
              )}
            </Cta>
            <p className="mt-3 text-xs text-osso/[0.62]">
              Sem cadastro. Abre direto no WhatsApp.
            </p>

            <Link
              href="/pecas"
              className="btn-card mt-6 rotate-1 transition-all! duration-200 hover:rotate-0"
              data-cta={`peca-ver-todas-${peca.slug}`}
            >
              Ver todas as peças <span aria-hidden>→</span>
            </Link>

            {/* selo girando preenche o respiro da coluna no desktop */}
            <svg
              aria-hidden
              viewBox="0 0 120 120"
              className="mt-10 hidden w-28 animate-[girar_20s_linear_infinite] text-rosa/70 motion-reduce:animate-none lg:block"
            >
              <defs>
                <path
                  id="circ-peca"
                  d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"
                />
              </defs>
              <text
                fontSize="13.5"
                fontWeight="800"
                letterSpacing="2.2"
                fill="currentColor"
              >
                <textPath href="#circ-peca">
                  nothing repeat · nothing repeat ·
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* outras peças da mesma categoria */}
      {outras.length > 0 && (
        <section className="px-5 pb-24 pt-24 sm:px-12 lg:px-20 lg:pt-32">
          <h2 className="font-extrabold uppercase leading-[0.9] tracking-tight">
            <span className="block text-4xl sm:text-5xl">Outras</span>
            <span className="font-marker block -rotate-1 pt-2 text-3xl font-normal normal-case tracking-normal text-ambar sm:text-4xl">
              peças.
            </span>
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-x-2.5 gap-y-3.5 sm:gap-6 lg:grid-cols-3">
            {outras.map((outra) => (
              <Reveal key={outra.id}>
                <PecaCard peca={outra} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <FechamentoCta />
      <SiteFooter />
    </main>
  );
}
