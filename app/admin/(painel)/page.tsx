import { Suspense } from "react";
import AdminLista from "@/components/admin/AdminLista";
import { supabaseServer } from "@/lib/supabase/server";
import { pecasMock } from "@/lib/pecas.mock";
import type { Peca } from "@/lib/pecas";

export default async function AdminPecas() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <main className="px-5 py-8 sm:px-8">
        <Suspense fallback={null}>
          <AdminLista pecas={pecasMock} />
        </Suspense>
      </main>
    );
  }

  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("pecas")
    .select("*, imagens:peca_imagens(id, url, alt, ordem)")
    .order("ordem")
    .order("numero");
  if (error) throw new Error(`Supabase (admin): ${error.message}`);

  const pecas = (data as Peca[]).map((peca) => {
    peca.imagens.sort((a, b) => a.ordem - b.ordem);
    return peca;
  });

  return (
    <main className="px-5 py-8 sm:px-8">
      <Suspense fallback={null}>
        <AdminLista pecas={pecas} />
      </Suspense>
    </main>
  );
}
