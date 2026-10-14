"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cta from "@/components/Cta";
import RabiscoHover from "@/components/RabiscoHover";
import { waGeral } from "@/lib/whatsapp";
import logo from "@/public/marca/logo.png";

/**
 * O CABEÇALHO (14/10/2026, no desenho do molde do estúdio): fino, TRAVADO no
 * topo e sólido desde o começo (não é mais transparente sobre o hero), em
 * duas linhas:
 *
 * 1. a faixa no magenta da logo com as frases do catálogo, UMA POR VEZ, a cada
 *    4 s e parando no mouse (era a faixa rotativa abaixo do hero);
 * 2. a linha da marca: o nome, as categorias por extenso e o WhatsApp.
 *
 * No celular: menu à esquerda, o nome no meio, o WhatsApp à direita, e a
 * gaveta com as categorias. A altura das duas linhas mora em --altura-topo.
 */
const FRASES = [
  "this is not just decor.",
  "made to be noticed.",
  "your wall deserves attitude.",
  "art doesn't need permission.",
  "one piece. new energy.",
];

const LINKS = [
  { href: "/pecas", nome: "Todas as peças" },
  { href: "/pecas?categoria=espelho", nome: "Espelhos" },
  { href: "/pecas?categoria=quadro", nome: "Quadros" },
  { href: "/pecas?categoria=objeto", nome: "Objetos" },
  { href: "/#encomenda", nome: "Encomendar" },
];

function IconeWhats() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 19.5l1.2-3.6A7.5 7.5 0 1 1 8.4 18.6z" />
      <path d="M9.2 9.3c.2 2.4 2.6 4.8 5 5l1.1-1.2-1.6-.9-.7.6c-.9-.4-1.7-1.2-2.1-2.1l.6-.7-.9-1.6z" />
    </svg>
  );
}

export default function SiteHeader() {
  const [aberto, setAberto] = useState(false);
  const [frase, setFrase] = useState(0);
  const [segura, setSegura] = useState(false);

  useEffect(() => {
    if (segura) return;
    const t = window.setInterval(() => setFrase((i) => (i + 1) % FRASES.length), 4000);
    return () => window.clearInterval(t);
  }, [segura]);

  useEffect(() => {
    if (!aberto) return;
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", fechar);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", fechar);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const naGaveta = aberto ? undefined : -1;

  return (
    <header className="vt-topo">
      <div className="vt-aviso" onMouseEnter={() => setSegura(true)} onMouseLeave={() => setSegura(false)}>
        <ul className="vt-aviso__trilho">
          {FRASES.map((f, i) => (
            <li
              key={f}
              className="vt-aviso__frase"
              data-agora={i === frase ? "true" : undefined}
              data-foi={i === (frase - 1 + FRASES.length) % FRASES.length ? "true" : undefined}
              aria-hidden={i === frase ? undefined : "true"}
            >
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="vt-topo__linha">
        <button type="button" onClick={() => setAberto(true)} aria-expanded={aberto} aria-controls="vt-gaveta" aria-label="Abrir o menu" className="vt-topo__icone vt-topo__abrir">
          <span aria-hidden="true" className="flex flex-col gap-[5px]">
            <span className="block h-[1.5px] w-6 bg-current" />
            <span className="block h-[1.5px] w-6 bg-current" />
            <span className="block h-[1.5px] w-4 bg-current" />
          </span>
        </button>

        <Link href="/" className="vt-topo__marca">
          {/* a logo de outubro de 2026, recortada da foto do perfil
              (scripts/recortar-logo.cjs) */}
          <Image src={logo} alt="vérít.lab, página inicial" preload className="vt-topo__logo" />
        </Link>

        <nav aria-label="Principal" className="vt-topo__menu">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="group relative">
              {l.nome}
              <RabiscoHover />
            </Link>
          ))}
        </nav>

        <Cta cta="topo-whatsapp" href={waGeral()} novaAba className="vt-topo__whats">
          <IconeWhats />
          <span className="vt-topo__whats-texto">Falar com a loja</span>
        </Cta>
      </div>

      {/* a gaveta do celular */}
      <div id="vt-gaveta" className="vt-gaveta" data-aberta={aberto ? "true" : undefined} aria-hidden={aberto ? undefined : "true"}>
        <button type="button" className="vt-gaveta__fundo" onClick={() => setAberto(false)} aria-label="Fechar o menu" tabIndex={naGaveta} />
        <nav className="vt-gaveta__painel" aria-label="Menu">
          <div className="vt-gaveta__cabeca">
            <Image src={logo} alt="vérít.lab" className="vt-gaveta__logo" />
            <button type="button" onClick={() => setAberto(false)} aria-label="Fechar o menu" className="vt-topo__icone" tabIndex={naGaveta}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} tabIndex={naGaveta} onClick={() => setAberto(false)}>
                  {l.nome}
                </Link>
              </li>
            ))}
          </ul>
          <Cta cta="gaveta-whatsapp" href={waGeral()} novaAba className="btn-ciano vt-gaveta__whats">
            Falar no WhatsApp
          </Cta>
        </nav>
      </div>
    </header>
  );
}
