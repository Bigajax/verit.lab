/* a barreira do painel mora no pacote (14/10/2026: a vérít troca o admin
   próprio pelo painel do @vitrine/plataforma, e o proxy.ts do Next 16, que
   guardava o /admin, saiu junto com a volta para o Next 15); o matcher fica
   aqui, literal, porque o Next só o lê no próprio arquivo */
export { middleware } from "@vitrine/plataforma/middleware";

export const config = {
  matcher: ["/painel/:path*"],
};
