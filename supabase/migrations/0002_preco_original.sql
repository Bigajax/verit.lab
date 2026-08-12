-- vérit.lab — preço com desconto
-- `preco` segue sendo o preço de venda real; `preco_original` é o "de"
-- (aparece riscado na vitrine quando for maior que o preço atual).
alter table public.pecas
  add column if not exists preco_original numeric;
