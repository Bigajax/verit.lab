import Image from "next/image";
import { redirect } from "next/navigation";
import { FormularioLogin } from "@vitrine/plataforma/painel/FormularioLogin";
import { sessao } from "@vitrine/plataforma/lib/auth";
import { MODO } from "@vitrine/plataforma/lib/dados";
import logo from "@/public/marca/logo.png";
import "./entrada.css";

export const dynamic = "force-dynamic";

/**
 * A ENTRADA DO PAINEL COM A CARA DA VÉRÍT (14/10/2026, a loja entra no
 * pacote). O painel vem do @vitrine/plataforma, e a entrada é dela. A CAPA É
 * A LOGO DA LOJA, grande, no preto de galeria do site (regra do Rafael para
 * toda loja, nascida na Japa): o VERIT LAB em ciano, com a frase da loja. No
 * computador, a logo à esquerda e o formulário à direita; no celular, a logo
 * numa faixa em cima e o formulário logo abaixo.
 */
export default async function PaginaLogin() {
  const { autenticado } = await sessao();
  if (autenticado) redirect("/painel");

  return (
    <div className="vl-entrada">
      <div className="vl-entrada__capa">
        <Image src={logo} alt="vérít.lab" priority className="vl-entrada__logo" />
        <p className="vl-entrada__frase">Nada aqui se repete.</p>
      </div>

      <div className="vl-entrada__lado">
        <div className="vl-entrada__caixa">
          <p className="vl-entrada__rotulo">Painel da loja</p>
          <h1 className="vl-entrada__titulo">Entrar</h1>

          <FormularioLogin pedeEmail={MODO === "supabase"} />

          <p className="vl-entrada__ajuda">
            Esqueceu a senha?{" "}
            <a href="https://wa.me/5544991246187?text=Oi%20Rafael%2C%20esqueci%20a%20senha%20do%20painel%20da%20v%C3%A9r%C3%ADt.lab." target="_blank" rel="noreferrer">
              Chame o Rafael no WhatsApp
            </a>
          </p>
        </div>
        <p className="vl-entrada__assina">Painel feito por Rafael Razeira Estúdio</p>
      </div>
    </div>
  );
}
