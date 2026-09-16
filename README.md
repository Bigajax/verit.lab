# vérit.lab

Vitrine + painel admin da vérít.lab (Maringá). Next.js (App Router) + Tailwind + Supabase, deploy na Vercel. O WhatsApp é o único mecanismo de conversão — não existe carrinho nem checkout.

## Estrutura

- `/` — landing; o grid mostra só as peças com `destaque = true` (máx. 8)
- `/pecas` — catálogo com filtros por categoria e status (refletidos na URL)
- `/pecas/[slug]` — página da peça, com galeria, ficha técnica e CTA de WhatsApp
- `/admin` — painel do dono (cadastro, edição, vendida em 1 clique, destaques)

## Setup do Supabase (uma vez)

1. Crie um projeto em [supabase.com](https://supabase.com) (região `sa-east-1`).
2. **SQL Editor** → cole e rode `supabase/migrations/0001_pecas.sql` (cria as tabelas `pecas` e `peca_imagens`, RLS e o bucket público `pecas`).
3. Copie `.env.example` para `.env.local` e preencha com os valores de *Project Settings → API*.
4. Rode o seed (migra as 11 peças originais + fotos para o Storage; idempotente):

   ```bash
   node scripts/seed.mjs
   ```

5. Crie o usuário do painel: *Authentication → Users → Add user* (email + senha, um único usuário).
6. Na Vercel, cadastre as mesmas variáveis de ambiente do `.env.local`.

> **Plano free pausa o projeto após ~7 dias sem uso.** Pausado, o Storage para de responder, o otimizador de imagem da Vercel devolve 502 e as fotos das peças somem. Enquanto isso a vitrine cai sozinha para as peças de exemplo (`lib/pecas.mock.ts`, fotos em `public/images/pecas`). Para despausar: painel do Supabase → *Restore project*. O cron de `vercel.json` chama `/api/keepalive` uma vez por dia para evitar a pausa (opcional: variável `CRON_SECRET` na Vercel para proteger a rota).

## Desenvolvimento

```bash
npm run dev
```

As páginas públicas usam ISR de 60 s; qualquer salvamento no admin dispara `revalidatePath` e aparece no site em segundos.
