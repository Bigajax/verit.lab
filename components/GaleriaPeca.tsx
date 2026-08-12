"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PecaImagem } from "@/lib/pecas";

// Galeria da página da peça.
// Desktop: imagem grande + tira de thumbnails; clique amplia (lightbox).
// Mobile: carrossel com swipe (scroll-snap nativo) + indicadores de ponto.
export default function GaleriaPeca({
  imagens,
  nome,
}: {
  imagens: PecaImagem[];
  nome: string;
}) {
  const [atual, setAtual] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const trilhoRef = useRef<HTMLDivElement>(null);

  const varias = imagens.length > 1;

  // índice do carrossel mobile acompanha o scroll-snap
  function aoRolar() {
    const el = trilhoRef.current;
    if (!el) return;
    setAtual(Math.round(el.scrollLeft / el.clientWidth));
  }

  const navegar = useCallback(
    (delta: number) => {
      setAtual((i) => (i + delta + imagens.length) % imagens.length);
    },
    [imagens.length],
  );

  // lightbox: Esc fecha, setas navegam, scroll do body travado
  useEffect(() => {
    if (!ampliada) return;
    function tecla(ev: KeyboardEvent) {
      if (ev.key === "Escape") setAmpliada(false);
      if (ev.key === "ArrowRight") navegar(1);
      if (ev.key === "ArrowLeft") navegar(-1);
    }
    document.addEventListener("keydown", tecla);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tecla);
      document.documentElement.style.overflow = "";
    };
  }, [ampliada, navegar]);

  if (imagens.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center border border-ouro/25 bg-osso/[0.03]">
        <p className="font-marker -rotate-2 text-2xl text-osso/40">sem foto</p>
      </div>
    );
  }

  return (
    <div>
      {/* mobile: carrossel com swipe */}
      <div className="lg:hidden">
        <div
          ref={trilhoRef}
          onScroll={aoRolar}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {imagens.map((img, i) => (
            <button
              key={img.id}
              type="button"
              aria-label={`Ampliar foto ${i + 1} de ${imagens.length}`}
              className="relative aspect-[4/5] w-full shrink-0 snap-center"
              onClick={() => {
                setAtual(i);
                setAmpliada(true);
              }}
            >
              <Image
                src={img.url}
                alt={img.alt ?? nome}
                fill
                preload={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        {varias && (
          <div className="mt-4 flex justify-center gap-2" aria-hidden>
            {imagens.map((img, i) => (
              <span
                key={img.id}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === atual ? "bg-ambar" : "bg-osso/25"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* desktop: imagem principal + thumbnails */}
      <div className="hidden lg:block">
        <button
          type="button"
          aria-label="Ampliar foto"
          className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden border border-ouro/25 bg-osso/[0.03]"
          onClick={() => setAmpliada(true)}
        >
          <Image
            src={imagens[atual]?.url ?? imagens[0].url}
            alt={imagens[atual]?.alt ?? nome}
            fill
            preload
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        </button>
        {varias && (
          <div className="mt-4 flex flex-wrap gap-3">
            {imagens.map((img, i) => (
              <button
                key={img.id}
                type="button"
                aria-label={`Ver foto ${i + 1} de ${imagens.length}`}
                aria-current={i === atual}
                className={`relative h-20 w-16 overflow-hidden border transition-colors ${
                  i === atual
                    ? "border-ambar"
                    : "border-ouro/25 hover:border-ouro/60"
                }`}
                onClick={() => setAtual(i)}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* lightbox — leve, sem biblioteca */}
      {ampliada && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos de ${nome}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-preto/95 p-4 sm:p-10"
          onClick={() => setAmpliada(false)}
        >
          <div
            className="relative h-full w-full"
            onClick={(ev) => ev.stopPropagation()}
          >
            <Image
              src={imagens[atual]?.url ?? imagens[0].url}
              alt={imagens[atual]?.alt ?? nome}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <button
            type="button"
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center border border-osso/30 text-2xl text-osso hover:border-ambar hover:text-ambar"
            onClick={() => setAmpliada(false)}
          >
            ×
          </button>
          {varias && (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-osso/30 text-osso hover:border-ambar hover:text-ambar sm:left-6"
                onClick={(ev) => {
                  ev.stopPropagation();
                  navegar(-1);
                }}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Próxima foto"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-osso/30 text-osso hover:border-ambar hover:text-ambar sm:right-6"
                onClick={(ev) => {
                  ev.stopPropagation();
                  navegar(1);
                }}
              >
                →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
