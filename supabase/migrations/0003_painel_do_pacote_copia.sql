-- ═══ 0003: as obras da vérít no painel do pacote (14/10/2026) ═══
--
-- Roda DEPOIS do esquema do molde (a parte de cima de rodar-painel-pacote.sql).
-- Copia as obras de pecas/peca_imagens para produtos/produto_imagens, com o
-- MESMO id: a ponte do site (lib/pecas.server.ts) junta as duas pelo id para
-- ler o que é só da vérít (frase, medidas, material, acabamento, prazo,
-- subtipo), que continua em pecas. As tabelas antigas ficam intactas: nada é
-- apagado aqui. Reexecutável: a obra já copiada não é copiada de novo.
--
-- TODA OBRA É ÚNICA: tamanho "Único", estoque 1 (disponível) ou 0 (vendida).
-- A reservada entra com estoque 0 e uma reserva aberta (o Separar do painel),
-- com 7 dias de prazo a partir de agora: a data real da reserva antiga não
-- existe no banco. Vencido o prazo sem o "Vendeu", a obra volta sozinha.

-- as três categorias que o site usa
insert into categorias (nome, slug, ordem) values
  ('Espelhos', 'espelho', 1),
  ('Quadros', 'quadro', 2),
  ('Objetos', 'objeto', 3)
on conflict (slug) do nothing;

-- as obras. O código é VL-<número do acervo> (o pacote numera VL-0021 em
-- diante); o preço cheio é o "de" quando existe, e o "por" vira promocional
insert into produtos (
  id, codigo, nome, slug, descricao, marca, preco, preco_promocional,
  categoria_id, tamanhos, cores, destaque, ativo, ordem, created_at,
  estoque, tamanhos_esgotados
)
select
  p.id,
  'VL-' || lpad(p.numero, 4, '0'),
  p.nome,
  p.slug,
  p.descricao,
  null,
  coalesce(p.preco_original, p.preco),
  case when p.preco_original is not null and p.preco is not null and p.preco_original > p.preco then p.preco end,
  (select c.id from categorias c where c.slug = p.categoria),
  array['Único'],
  '{}',
  p.destaque,
  true,
  p.ordem,
  p.created_at,
  jsonb_build_object('Único', case when p.status = 'disponivel' then 1 else 0 end),
  case when p.status = 'vendida' then array['Único'] else '{}'::text[] end
from pecas p
where not exists (select 1 from produtos x where x.id = p.id or x.slug = p.slug);

-- as fotos, na mesma ordem
insert into produto_imagens (produto_id, url, alt, ordem)
select i.peca_id, i.url, i.alt, i.ordem
from peca_imagens i
where exists (select 1 from produtos x where x.id = i.peca_id)
  and not exists (select 1 from produto_imagens j where j.produto_id = i.peca_id and j.url = i.url);

-- a reservada vira uma reserva aberta (uma vez só)
insert into reservas (produto_id, tamanho, nome, ate)
select p.id, 'Único', 'Reserva do painel antigo', now() + interval '7 days'
from pecas p
where p.status = 'reservada'
  and not exists (select 1 from reservas r where r.produto_id = p.id);

insert into estoque_movimentos (produto_id, tamanho, delta, motivo, saldo)
select p.id, 'Único', -1, 'separada', 0
from pecas p
where p.status = 'reservada'
  and not exists (select 1 from estoque_movimentos m where m.produto_id = p.id and m.motivo = 'separada');

-- O site mostra "reservada" sem ler as reservas (elas têm nome e WhatsApp de
-- cliente e são só da dona): esta função devolve só QUAIS obras estão
-- separadas agora, e nada mais.
create or replace function pecas_separadas()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select distinct produto_id from reservas where situacao = 'separada' and ate > now();
$$;
revoke all on function pecas_separadas() from public;
grant execute on function pecas_separadas() to anon, authenticated;

-- a conferência: obras_antes e obras_no_painel têm de bater
select
  (select count(*) from pecas) as obras_antes,
  (select count(*) from produtos) as obras_no_painel,
  (select count(*) from produtos where estoque->>'Único' = '1') as disponiveis,
  (select count(*) from produto_imagens) as fotos,
  (select count(*) from reservas where situacao = 'separada') as separadas,
  (select count(*) from donos) as donos;
