-- vérit.lab — Fase 1: catálogo de peças
-- Rodar no SQL Editor do Supabase (ou via CLI: supabase db push).

-- ── Tabela principal ──────────────────────────────────────────────
create table if not exists public.pecas (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  numero      text not null,                    -- número no acervo, ex: "01"
  nome        text not null,
  categoria   text not null check (categoria in ('espelho', 'quadro', 'objeto')),
  subtipo     text,                             -- só rótulo, ex: "Luminária"
  frase       text,                             -- a frase que está na peça
  descricao   text,                             -- história/conceito, 2-4 linhas
  preco       numeric,                          -- null = sob consulta
  dimensoes   text not null,                    -- "1,13 m × 82 cm"
  material    text,
  acabamento  text,
  prazo       text,
  status      text not null default 'disponivel'
              check (status in ('disponivel', 'reservada', 'vendida')),
  destaque    boolean not null default false,   -- aparece na home
  ordem       int not null default 0,           -- ordenação manual
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Imagens (ordem = 0 é a capa) ──────────────────────────────────
create table if not exists public.peca_imagens (
  id       uuid primary key default gen_random_uuid(),
  peca_id  uuid not null references public.pecas (id) on delete cascade,
  url      text not null,
  alt      text,
  ordem    int not null default 0
);

create index if not exists peca_imagens_peca_id_idx on public.peca_imagens (peca_id, ordem);

-- ── updated_at automático ─────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists pecas_updated_at on public.pecas;
create trigger pecas_updated_at
  before update on public.pecas
  for each row execute function public.set_updated_at();

-- ── RLS: leitura pública, escrita só autenticado ──────────────────
alter table public.pecas enable row level security;
alter table public.peca_imagens enable row level security;

drop policy if exists "leitura publica" on public.pecas;
create policy "leitura publica" on public.pecas
  for select using (true);

drop policy if exists "escrita autenticada" on public.pecas;
create policy "escrita autenticada" on public.pecas
  for all to authenticated using (true) with check (true);

drop policy if exists "leitura publica" on public.peca_imagens;
create policy "leitura publica" on public.peca_imagens
  for select using (true);

drop policy if exists "escrita autenticada" on public.peca_imagens;
create policy "escrita autenticada" on public.peca_imagens
  for all to authenticated using (true) with check (true);

-- ── Storage: bucket público 'pecas' ───────────────────────────────
insert into storage.buckets (id, name, public)
values ('pecas', 'pecas', true)
on conflict (id) do nothing;

drop policy if exists "pecas leitura publica" on storage.objects;
create policy "pecas leitura publica" on storage.objects
  for select using (bucket_id = 'pecas');

drop policy if exists "pecas upload autenticado" on storage.objects;
create policy "pecas upload autenticado" on storage.objects
  for insert to authenticated with check (bucket_id = 'pecas');

drop policy if exists "pecas update autenticado" on storage.objects;
create policy "pecas update autenticado" on storage.objects
  for update to authenticated using (bucket_id = 'pecas');

drop policy if exists "pecas delete autenticado" on storage.objects;
create policy "pecas delete autenticado" on storage.objects
  for delete to authenticated using (bucket_id = 'pecas');
