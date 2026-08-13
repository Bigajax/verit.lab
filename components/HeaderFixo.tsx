"use client";

import { useEffect, useState, type ReactNode } from "react";

// Casca do header fixo: transparente no topo da página; a partir de
// 40px de rolagem ganha fundo escuro com blur (e encolhe ~20%) para
// nunca deixar texto ilegível por sobreposição. Vale em todo breakpoint.
export default function HeaderFixo({ children }: { children: ReactNode }) {
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY >= 40);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color] duration-200 ${
        rolou
          ? "border-b border-ambar/[0.14] bg-preto/[0.92] backdrop-blur-[12px]"
          : "border-b border-transparent bg-gradient-to-b from-preto/80 via-preto/40 to-transparent"
      }`}
    >
      <div
        className={`flex w-full items-center justify-between gap-4 px-5 transition-[padding] duration-200 sm:px-12 lg:px-20 ${
          rolou ? "py-2" : "py-4"
        }`}
      >
        {children}
      </div>
    </header>
  );
}
