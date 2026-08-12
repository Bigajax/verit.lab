import FormPeca from "@/components/admin/FormPeca";
import { supabaseServer } from "@/lib/supabase/server";
import { pecasMock } from "@/lib/pecas.mock";

export default async function NovaPeca() {
  // sugere o próximo número livre do acervo
  let numeros: string[];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    numeros = pecasMock.map((p) => p.numero);
  } else {
    const supabase = await supabaseServer();
    const { data } = await supabase.from("pecas").select("numero");
    numeros = (data ?? []).map((p) => p.numero);
  }
  const maior = Math.max(0, ...numeros.map((n) => parseInt(n, 10) || 0));
  const numeroSugerido = String(maior + 1).padStart(2, "0");

  return (
    <main className="px-5 py-8 sm:px-8">
      <FormPeca numeroSugerido={numeroSugerido} />
    </main>
  );
}
