import OrdenarDestaques from "@/components/admin/OrdenarDestaques";
import { supabaseServer } from "@/lib/supabase/server";
import { pecasMock } from "@/lib/pecas.mock";
import type { Peca } from "@/lib/pecas";

export default async function AdminDestaques() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <main className="px-5 py-8 sm:px-8">
        <OrdenarDestaques pecas={pecasMock.filter((p) => p.destaque)} />
      </main>
    );
  }

  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("pecas")
    .select("*, imagens:peca_imagens(id, url, alt, ordem)")
    .eq("destaque", true)
    .order("ordem")
    .order("numero");
  if (error) throw new Error(`Supabase (destaques): ${error.message}`);

  const pecas = (data as Peca[]).map((peca) => {
    peca.imagens.sort((a, b) => a.ordem - b.ordem);
    return peca;
  });

  return (
    <main className="px-5 py-8 sm:px-8">
      <OrdenarDestaques pecas={pecas} />
    </main>
  );
}
