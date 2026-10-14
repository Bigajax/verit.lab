"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/data/banners";

/**
 * A CAMPANHA DO TOPO (14/10/2026): os três banners do molde do estúdio
 * (components/Campanha.tsx do _molde), passando sozinhos a cada 6 s, no
 * lugar do hero da sala.
 *
 * No computador a arte deitada (21:9) vai de ponta a ponta, com setas finas
 * nas bordas, e título, linha e botão no pé do `lado` do banner, sobre um
 * degradê. No celular, a arte em pé (4:5) ocupa a tela, o texto vai no pé, e
 * no lugar das setas ficam as bolinhas e o arrastar com o dedo.
 *
 * O relógio é a barra invisível que enche em 6 s: quando ela termina, o
 * banner troca. Mouse ou foco em cima pausa; com movimento reduzido, a barra
 * não anda e o carrossel fica parado.
 */
export default function Campanha({ slides }: { slides: Banner[] }) {
  const [atual, setAtual] = useState(0);
  const [parado, setParado] = useState(false);
  const toque = useRef<{ x: number; y: number } | null>(null);

  const ir = (i: number) => setAtual((i + slides.length) % slides.length);
  if (!slides.length) return null;
  const varios = slides.length > 1;

  return (
    <section
      className="camp"
      aria-roledescription="carrossel"
      aria-label="Peças em destaque da vérít.lab"
      onMouseEnter={() => setParado(true)}
      onMouseLeave={() => setParado(false)}
      onFocus={() => setParado(true)}
      onBlur={() => setParado(false)}
      onTouchStart={(e) => {
        toque.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const ini = toque.current;
        toque.current = null;
        if (!ini || !varios) return;
        const dx = e.changedTouches[0].clientX - ini.x;
        const dy = e.changedTouches[0].clientY - ini.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) ir(atual + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="camp__palco">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="camp__slide"
            data-lado={s.lado}
            data-ativo={i === atual ? "true" : undefined}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${slides.length}`}
            aria-hidden={i === atual ? undefined : "true"}
          >
            <div className="camp__foto">
              {/* cada arte na própria caixa: o CSS esconde a caixa que não
                  vale naquela largura */}
              <span className="camp__arte">
                <Image src={s.foto} alt={s.alt} fill priority={i === 0} quality={86} sizes="100vw" className="object-cover" />
              </span>
              <span className="camp__arte-celular">
                <Image src={s.celular} alt={s.alt} fill priority={i === 0} quality={86} sizes="100vw" className="object-cover" />
              </span>
            </div>
            <div className="camp__texto">
              {i === 0 ? <h1 className="camp__titulo">{s.titulo}</h1> : <p className="camp__titulo">{s.titulo}</p>}
              <p className="camp__linha">{s.linha}</p>
              <Link href={s.href} className="camp__botao" tabIndex={i === atual ? undefined : -1}>
                {s.botao}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {varios ? (
        <>
          <button type="button" className="camp__seta camp__seta--antes" onClick={() => ir(atual - 1)} aria-label="Banner anterior">
            <svg viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M20 2L4 24l16 22" />
            </svg>
          </button>
          <button type="button" className="camp__seta camp__seta--depois" onClick={() => ir(atual + 1)} aria-label="Próximo banner">
            <svg viewBox="0 0 24 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M4 2l16 22L4 46" />
            </svg>
          </button>
          <div className="camp__pontos" data-parado={parado ? "true" : undefined}>
            {slides.map((s, i) => (
              <button key={s.id} type="button" className="camp__ponto" aria-label={`Ir para o banner ${i + 1}`} aria-current={i === atual ? "true" : undefined} onClick={() => ir(i)}>
                {i === atual ? <span key={atual} className="camp__enche" onAnimationEnd={() => ir(atual + 1)} /> : null}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
