import { createClient } from "@supabase/supabase-js";

// Leitura pública em páginas estáticas/ISR: sem cookies, então a página
// continua cacheável (revalidate). Usar para todo o conteúdo da vitrine.
// (O painel tem o próprio cliente, no pacote @vitrine/plataforma.)
export function supabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
