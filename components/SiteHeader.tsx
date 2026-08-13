import Link from "next/link";
import HeaderFixo from "@/components/HeaderFixo";
import { site } from "@/data/site.config";

// Header das páginas internas (/pecas, /pecas/[slug]) — mesmo desenho
// do header da home: logo → raiz, etiqueta ART / MIRRORS / OBJECTS
// linkando as categorias, e a navegação principal sempre visível.
export default function SiteHeader() {
  return (
    <HeaderFixo>
      <Link href="/" className="shrink-0 font-display text-2xl italic">
        vérít.lab
      </Link>
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
          className="eyebrow inline-flex min-h-11 items-center text-osso/85 hover:text-ambar"
        >
          Peças
        </Link>
        <Link
          href="/#encomenda"
          className="eyebrow inline-flex min-h-11 items-center text-osso/85 hover:text-ambar"
        >
          Encomendar
        </Link>
        {/* acesso do dono: /admin/login digitado direto */}
      </nav>
    </HeaderFixo>
  );
}
