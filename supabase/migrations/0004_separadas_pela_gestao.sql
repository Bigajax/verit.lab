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
