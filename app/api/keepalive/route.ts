import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/server";

// Ping diário (cron em vercel.json) para o projeto Supabase do plano free
// não pausar por inatividade. Quando pausa, o Storage para de responder e
// as fotos das peças somem do site — a vitrine cai para o mock até alguém
// despausar no painel do Supabase.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Na Vercel, o cron manda `Authorization: Bearer <CRON_SECRET>` se a
  // variável existir; sem ela, a rota fica aberta (é só um select de 1 id).
  const segredo = process.env.CRON_SECRET;
  if (segredo && request.headers.get("authorization") !== `Bearer ${segredo}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ ok: true, supabase: "não configurado" });
  }

  const { error } = await supabasePublic().from("pecas").select("id").limit(1);
  if (error) {
    return NextResponse.json({ ok: false, erro: error.message }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
