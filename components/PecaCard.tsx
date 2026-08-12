import Image from "next/image";
import Link from "next/link";
import {
  type Peca,
  capa,
  formataReais,
  percentualDesconto,
  precoFormatado,
  rotuloTipo,
  temDesconto,
} from "@/lib/pecas";

// O card da galeria — mesmo desenho na home e no catálogo.
// O card inteiro é um link para a página da peça; o "botão" no rodapé
// é visual (span), para não aninhar <a> dentro de <a>.
export default function PecaCard({ peca }: { peca: Peca }) {
  const vendida = peca.status === "vendida";
  const reservada = peca.status === "reservada";
  const foto = capa(peca);

  return (
    <Link
      href={`/pecas/${peca.slug}`}
      data-cta={`card-${peca.slug}`}
      className="group block"
    >
      <article className="border border-ouro/25 bg-osso/[0.03] transition-colors duration-300 group-hover:border-ambar/70">
        <div className="relative aspect-[4/5] overflow-hidden">
          {foto && (
            <Image
              src={foto.url}
              alt={foto.alt ?? peca.nome}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${
                vendida || reservada ? "opacity-40 saturate-50" : ""
              }`}
            />
          )}
          {(vendida || reservada) && (
            /* mesmo carimbo manuscrito: rosa = vendida, ouro = reservada */
            <p
              aria-hidden
              className={`font-marker absolute inset-0 flex -rotate-12 items-center justify-center text-4xl ${
                vendida ? "text-rosa" : "text-ouro"
              }`}
            >
              {vendida ? "vendida" : "reservada"}
            </p>
          )}
        </div>
        {/* etiqueta */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold uppercase tracking-[0.14em]">
                {peca.nome}
              </h3>
              <p className="mt-1 text-sm text-osso/55">
                {rotuloTipo(peca)} · {peca.dimensoes}
              </p>
              {temDesconto(peca) ? (
                /* de/por: original riscado + preço atual + rabisco rosa */
                <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 leading-none">
                  <span className="text-sm text-osso/45 line-through">
                    {formataReais(peca.preco_original!)}
                  </span>
                  <span className="text-lg font-bold text-ambar">
                    {formataReais(peca.preco!)}
                  </span>
                  <span className="font-marker -rotate-2 text-sm text-rosa">
                    -{percentualDesconto(peca)}%
                  </span>
                </p>
              ) : (
                <p className="mt-1.5 text-lg font-bold leading-none text-ambar">
                  {precoFormatado(peca)}
                </p>
              )}
            </div>
            <div className="shrink-0 border border-ouro/40 px-3 py-2 text-center">
              <p className="text-lg leading-none text-ambar">{peca.numero}</p>
              <p
                className={`mt-1 text-[0.6rem] uppercase tracking-[0.18em] ${
                  vendida ? "text-rosa" : reservada ? "text-ouro" : "text-osso/55"
                }`}
              >
                {vendida ? "vendida" : reservada ? "reservada" : "única"}
              </p>
            </div>
          </div>
          <span className="btn-card mt-4">
            {vendida ? (
              <>
                Encomende a sua <span aria-hidden>→</span>
              </>
            ) : (
              <>
                Quero essa <span aria-hidden>→</span>
              </>
            )}
          </span>
        </div>
      </article>
    </Link>
  );
}
