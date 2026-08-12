"use client";

import { useEffect, useState } from "react";
import { waEncomendaDireta } from "@/lib/whatsapp";

// Barra fixa de conversão, só no mobile (lg:hidden).
// Aparece depois do hero e some enquanto a ficha de encomenda está visível,
// para nunca cobrir o botão da própria ficha.
export default function StickyCta() {
  const [aposHero, setAposHero] = useState(false);
  const [fichaVisivel, setFichaVisivel] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const ficha = document.getElementById("encomenda");
    if (!hero || !ficha) return;
    // threshold 0: o hero conta como visível enquanto QUALQUER pedaço
    // dele estiver em tela — a barra só entra depois que ele sai inteiro.
    const ioHero = new IntersectionObserver(
      ([entry]) => setAposHero(!entry.isIntersecting),
      { threshold: 0 },
    );
    const ioFicha = new IntersectionObserver(([entry]) =>
      setFichaVisivel(entry.isIntersecting),
    );
    ioHero.observe(hero);
    ioFicha.observe(ficha);
    return () => {
      ioHero.disconnect();
      ioFicha.disconnect();
    };
  }, []);

  const visivel = aposHero && !fichaVisivel;

  return (
    <div
      aria-hidden={!visivel}
      className={`fixed inset-x-0 bottom-0 z-40 bg-ambar pb-[calc(12px+env(safe-area-inset-bottom))] transition-[transform,opacity] duration-300 motion-reduce:transition-none lg:hidden ${
        visivel ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <a
        href={waEncomendaDireta()}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="sticky-whatsapp"
        tabIndex={visivel ? 0 : -1}
        onClick={() => console.log("[verit-cta]", "sticky-whatsapp")}
        className="flex h-14 items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-preto"
      >
        Encomendar no WhatsApp <span aria-hidden>→</span>
      </a>
    </div>
  );
}
