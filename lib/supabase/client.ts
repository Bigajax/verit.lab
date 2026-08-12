import { createBrowserClient } from "@supabase/ssr";

// Client do navegador — usado pelo painel admin (auth + uploads).
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
