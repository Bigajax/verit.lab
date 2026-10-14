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
