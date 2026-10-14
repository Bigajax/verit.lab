-- VÉRÍT.LAB: RODAR AGORA (14/10/2026), depois do rodar-painel-pacote.sql
-- Duas partes: a 0004 (reservada no site também pela gestão) e a 0005 (o modo simples).
-- Abrir este ARQUIVO e copiar daqui. Rodar no SQL Editor do Supabase da vérít. Reexecutável.
-- No fim: presas_a_pedido = 0, documentos_de_gestao = 0, separadas = rolling-is-love.

-- ═══ 0004: "reservada" no site também pela gestão (14/10/2026) ═══
--
-- Com a opção gestao do pacote ligada (a vérít liga), separar uma obra na
-- tela Estoque grava no documento de gestao_loja, não na tabela reservas: a
-- pecas_separadas() da 0003 não via, e a obra separada aparecia VENDIDA no
-- site. Agora: está separada a obra que existe na loja (físico > 0) e não tem
-- nenhuma disponível (o resto está separado, num pedido ou indisponível).
-- Sem documento de gestão, vale a tabela reservas, como antes.
-- Continua sem expor nada da cliente: só os ids das obras.
create or replace function pecas_separadas()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select distinct (v->>'produto')::uuid
  from gestao_loja g, jsonb_array_elements(g.documento->'variacoes') v
  where g.documento is not null
    and (v->>'ativa')::boolean
    and coalesce((v->>'fisico')::int, 0) > 0
    and gestao_disponivel(g.documento, v) = 0
  union
  select produto_id from reservas
  where situacao = 'separada' and ate > now()
    and not exists (select 1 from gestao_loja where documento is not null);
$$;
revoke all on function pecas_separadas() from public;
grant execute on function pecas_separadas() to anon, authenticated;

-- a conferência: a Rolling is Love (separada na migração) tem de aparecer
select p.slug from produtos p where p.id in (select pecas_separadas());


-- ═══ 0005: a vérít no modo simples do painel (14/10/2026) ═══
--
-- O Rafael escolheu o modo simples (gestao: false no loja.config.ts):
-- "Vendi / Chegou" na lista e o Separar com nome e prazo, sem Estoque nem
-- Pedidos. Quando o painel ainda estava com a gestão ligada, a tela Estoque
-- importou a reserva da Rolling is Love para um pedido; o documento de gestão
-- já foi apagado, mas a reserva continua presa a esse pedido, e o gatilho
-- gestao_proteger_reserva recusa qualquer mudança nela ("Esta separação está
-- na área Pedidos"): a dona não conseguiria dar "Vendeu" nem "Não levou".
-- Aqui ela volta a ser uma reserva comum do Separar.
alter table reservas disable trigger gestao_proteger_reserva;
update reservas set gestao_pedido_id = null where gestao_pedido_id is not null;
alter table reservas enable trigger gestao_proteger_reserva;

-- a conferência: nenhuma reserva presa a pedido, e a Rolling is Love separada
select
  (select count(*) from reservas where gestao_pedido_id is not null) as presas_a_pedido,
  (select count(*) from gestao_loja) as documentos_de_gestao,
  (select string_agg(p.slug, ', ') from produtos p where p.id in (select pecas_separadas())) as separadas;
