import { site } from "@/data/site.config";
import { MAPA, PARTES, VARIAVEIS } from "@/data/conteudo.config";
import type { LojaConfig } from "@vitrine/plataforma/tipos-loja";

/**
 * A VÉRÍT NO PACOTE (14/10/2026, o Rafael: "começa a implantar o molde do
 * painel nesta loja"). O painel inteiro vem do @vitrine/plataforma: Início,
 * Peças, Desempenho, Ajuda e o contato. O admin antigo
 * (/admin) saiu e redireciona para /painel. As obras foram copiadas para as
 * tabelas do pacote com o MESMO id (supabase/rodar-painel-pacote.sql), e o
 * site lê de lá pela ponte (lib/pecas.server.ts).
 *
 * TODA OBRA É ÚNICA: o tamanho é "Único" e o estoque é 1. "Vendi" zera e a
 * obra aparece vendida; a reserva é o Separar do painel (com nome e prazo). O site não usa o
 * "última" do pacote (estoqueNoSite desligado): quem decide o que mostrar é
 * a ponte (disponível, reservada, vendida).
 *
 * Os banners, os textos e a encomenda moram no código do site
 * (data/banners.ts, app/page.tsx), não no painel.
 */
export const loja: LojaConfig = {
  site: {
    nome: site.nome,
    marca: "vérít.lab",
    logo: "/marca/logo.png",
    /* 857 x 410 (public/marca/logo.png, o recorte da foto do perfil) */
    proporcaoLogo: 2.09,
    url: site.url,
    whatsapp: site.whatsapp,
    instagram: "verit.lab",
    cidade: site.cidade,
    /* a loja não publica endereço nem horário: vazio, nunca chutado */
    endereco: "",
    horario: "",
    marcas: [],
  },
  previa: null,
  configPadrao: { whatsapp: site.whatsapp, instagram: "verit.lab" },
  grade: {
    calcados: [],
    passoRoupa: 1,
    numeracaoPergunta: null,
    extras: [{ id: "unica", nome: "Obra única", itens: ["Único"] }],
  },
  /* o Archivo é a letra do site (app/layout.tsx) */
  marca: { logo: "/marca/logo.png", proporcao: 2.09, fonte: "Archivo" },
  cookie: "vl_painel",
  codigo: "VL",
  conteudo: { partes: PARTES, mapa: MAPA, variaveis: VARIAVEIS },
  opcoes: {
    estoque: true,
    /* o modo simples (14/10/2026, o Rafael): "Vendi / Chegou" na lista e o
       Separar com nome e prazo; sem a tela Estoque nem a aba Pedidos, que são
       de loja com estoque e pedido de vários itens */
    gestao: false,
    /* o site mostra disponível, reservada ou vendida; nunca "última" */
    estoqueNoSite: false,
    /* "Mais vendida" é a chave que põe a obra na home (o destaque) */
    maisVendida: true,
    /* banners, textos, encomenda e captura são do código do site */
    banners: false,
    textosDoSite: false,
    captura: false,
    /* sem sacola: cada obra vai direto para o WhatsApp */
    sacola: false,
    paginaMaisVendidos: false,
  },
  prefixoMedir: "vl",
  /* o verit.com.br ainda é página parada da Hostinger (05/10/2026): conta no .vercel.app */
  hostsMedir: ["verit-lab.vercel.app", "verit.com.br", "www.verit.com.br"],
  nomeConfig: "Loja",
};
