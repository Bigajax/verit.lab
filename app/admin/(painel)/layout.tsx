import Image from "next/image";
import Link from "next/link";
import logo from "@/public/marca/logo.png";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { sair } from "@/app/admin/actions";

// Casca do painel: barra de navegação enxuta, alvos de toque grandes.
// O proxy já barra anônimos; aqui é a segunda tranca.
export default async function PainelLayout({
  children,
}: LayoutProps<"/admin">) {
  // Modo demonstração: sem Supabase não há auth — o painel abre
  // com dados de exemplo e as escritas ficam desativadas.
  const demo = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!demo) {
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
  }

  return (
    <div className="min-h-dvh">
      {demo && (
        <p className="border-b border-magenta/40 bg-magenta/10 px-5 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-magenta">
          Modo demonstração: sem banco, nada aqui salva de verdade.
        </p>
      )}
      <header className="sticky top-0 z-30 border-b border-cinza/25 bg-preto/95 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src={logo} alt="vérít.lab" className="h-7 w-auto" />
            <span className="eyebrow">admin</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/admin"
              className="inline-flex min-h-11 items-center px-2 text-xs font-semibold uppercase tracking-[0.14em] text-osso/70 hover:text-ciano sm:px-3"
            >
              Peças
            </Link>
            <Link
              href="/admin/destaques"
              className="inline-flex min-h-11 items-center px-2 text-xs font-semibold uppercase tracking-[0.14em] text-osso/70 hover:text-ciano sm:px-3"
            >
              Destaques
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden min-h-11 items-center px-2 text-xs font-semibold uppercase tracking-[0.14em] text-osso/70 hover:text-ciano sm:inline-flex sm:px-3"
            >
              Ver site ↗
            </a>
            {!demo && (
              <form action={sair}>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center px-2 text-xs font-semibold uppercase tracking-[0.14em] text-osso/45 hover:text-magenta sm:px-3"
                >
                  Sair
                </button>
              </form>
            )}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
