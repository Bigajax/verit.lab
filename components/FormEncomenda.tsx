"use client";

import { useState } from "react";
import { waEncomenda } from "@/lib/whatsapp";

const TIPOS = ["Espelho", "Quadro", "Objeto"];

// A ficha de encomenda, no modal (ModalEncomenda). Desde 14/10/2026 é curta,
// a pedido do Rafael ("mais simples e direto"): o tipo, que é opcional, e a
// ideia. Cabe numa tela sem rolar. O envio abre o WhatsApp da pessoa com a
// mensagem pronta, e o número dela vai junto.
export default function FormEncomenda({ aoFechar }: { aoFechar?: () => void }) {
  const [tipo, setTipo] = useState("");
  const [ideia, setIdeia] = useState("");
  const [erro, setErro] = useState("");

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    if (!ideia.trim()) return setErro("Escreva a frase ou a ideia da peça.");
    setErro("");
    console.log("[verit-cta]", "form-encomenda");
    window.open(waEncomenda({ tipo, ideia }), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={enviar} data-cta="form-encomenda" className="bg-preto p-6 sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <h2 id="ficha-titulo" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Encomende a sua peça
        </h2>
        {aoFechar ? (
          <button type="button" onClick={aoFechar} aria-label="Fechar" className="-mr-3 -mt-2 grid h-11 w-11 shrink-0 place-items-center text-osso/70 hover:text-ciano">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-osso/70">Conte a ideia. A vérít responde no WhatsApp.</p>

      <fieldset className="mt-8">
        <legend className="mb-3 text-sm font-semibold">Tipo de peça</legend>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              className="pill"
              data-on={tipo === t}
              aria-pressed={tipo === t}
              onClick={() => setTipo(tipo === t ? "" : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-7 grid gap-3">
        <span className="text-sm font-semibold">Qual a frase ou a ideia?</span>
        <textarea
          className="campo min-h-28 resize-y"
          rows={3}
          value={ideia}
          onChange={(e) => setIdeia(e.target.value)}
          placeholder={'Ex.: "nem tudo precisa fazer sentido"'}
        />
      </label>

      {erro && (
        <p role="alert" className="mt-4 text-sm font-semibold text-magenta">
          {erro}
        </p>
      )}

      <button type="submit" className="btn-magenta mt-7 w-full">
        Enviar no WhatsApp
      </button>
    </form>
  );
}
