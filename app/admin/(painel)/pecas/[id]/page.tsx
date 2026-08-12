import { notFound } from "next/navigation";
import FormPeca from "@/components/admin/FormPeca";
import { supabaseServer } from "@/lib/supabase/server";
import { pecasMock } from "@/lib/pecas.mock";
import type { Peca } from "@/lib/pecas";

export default async function EditarPeca({
  params,
}: PageProps<"/admin/pecas/[id]">) {
  const { id } = await params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const mock = pecasMock.find((p) => p.id === id);
    if (!mock) notFound();
    return (
      <main className="px-5 py-8 sm:px-8">
        <FormPeca inicial={mock} />
      </main>
    );
  }

  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("pecas")
    .select("*, imagens:peca_imagens(id, url, alt, ordem)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const peca = data as Peca;
  peca.imagens.sort((a, b) => a.ordem - b.ordem);

  return (
    <main className="px-5 py-8 sm:px-8">
      <FormPeca inicial={peca} />
    </main>
  );
}
