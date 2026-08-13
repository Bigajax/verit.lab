import Image from "next/image";
import Link from "next/link";
import {
  type Peca,
  capa,
  formataReais,
  rotuloTipo,
  temDesconto,
} from "@/lib/pecas";

// Card de peça em overlay: a informação entra por cima da foto, para
// caberem duas peças por linha no mobile. Um componente só para home
// e catálogo, em todos os breakpoints. O card inteiro é o link.
export default function PecaCard({
  peca,
  sizes = "(min-width: 1024px) 30vw, 50vw",
}: {
  peca: Peca;
  sizes?: string;
}) {
  const vendida = peca.status === "vendida";
  const reservada = peca.status === "reservada";
  const foto = capa(peca);

  return (
    <Link
      href={`/pecas/${peca.slug}`}
      data-cta={`card-${peca.slug}`}
      className="group relative block overflow-hidden border border-ouro/25 bg-osso/[0.03] transition-colors duration-300 hover:border-ambar/70"
    >
      <div className="relative aspect-[4/5]">
        {foto && (
          <Image
            src={foto.url}
            alt={foto.alt ?? peca.nome}
            fill
            sizes={sizes}
            className={`object-cover ${
              vendida ? "brightness-75 saturate-[0.45]" : ""
            }`}
          />
        )}

        {/* scrim: sem ele o texto some nas fotos claras (Normal Day) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, rgba(10,8,6,0.92) 0%, rgba(10,8,6,0.70) 32%, rgba(10,8,6,0) 62%)",
          }}
        />

        {/* badge do acervo */}
        <div className="absolute right-2.5 top-2.5 border border-ouro/40 bg-preto/55 px-1.5 py-1 text-center">
          <p className="text-sm leading-none text-ambar">{peca.numero}</p>
          <p
            className={`mt-0.5 text-[8px] uppercase tracking-[0.14em] ${
              vendida || reservada ? "text-rosa" : "text-ambar"
            }`}
          >
            {vendida ? "vendida" : reservada ? "reservada" : "única"}
          </p>
        </div>

        {/* informação sobre o scrim + botão circular */}
        <div className="absolute inset-x-3.5 bottom-3.5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[13px] font-bold uppercase tracking-[0.1em] leading-snug text-osso lg:text-[15px]">
              {peca.nome}
            </h3>
            <p className="mt-1 text-[10px] text-osso/65">
              {rotuloTipo(peca)} · {peca.dimensoes}
            </p>
            {vendida || reservada ? (
              <p className="mt-1 text-[15px] font-semibold leading-none text-rosa">
                {vendida ? "vendida" : "reservada"}
              </p>
            ) : temDesconto(peca) ? (
              <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 leading-none">
                <span className="text-[11px] text-osso/50 line-through">
                  {formataReais(peca.preco_original!)}
                </span>
                <span className="text-[15px] font-semibold text-ambar">
                  {formataReais(peca.preco!)}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-[15px] font-semibold leading-none text-ambar">
                {peca.preco != null ? formataReais(peca.preco) : "sob consulta"}
              </p>
            )}
          </div>
          <span
            aria-hidden
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors lg:h-11 lg:w-11 ${
              vendida
                ? "border border-ambar text-ambar"
                : "bg-ambar text-preto"
            }`}
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
