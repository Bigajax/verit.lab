"use client";

import { useState } from "react";
import { waEncomenda } from "@/lib/whatsapp";

const TIPOS = ["Espelho", "Quadro", "Objeto", "Ainda não sei"];
const LOCAIS = ["Sala", "Quarto", "Estúdio", "Comércio"];

// Form "Monte sua peça": o submit gera a mensagem formatada e abre o wa.me.
export default function FormEncomenda() {
  const [tipo, setTipo] = useState("");
  const [ideia, setIdeia] = useState("");
  const [local, setLocal] = useState("");
  const [inspiracao, setInspiracao] = useState("");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [erro, setErro] = useState("");

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    if (!tipo) return setErro("Escolha o tipo de peça.");
    if (!ideia.trim()) return setErro("Conte a frase ou ideia da sua peça.");
    if (!local) return setErro("Diga onde a peça vai ficar.");
    if (!nome.trim() || !whatsapp.trim())
      return setErro("Preencha seu nome e WhatsApp para a vérít responder.");
    setErro("");
    console.log("[verit-cta]", "form-encomenda");
    window.open(
      waEncomenda({ tipo, ideia, local, inspiracao, nome, whatsapp }),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <form onSubmit={enviar} data-cta="form-encomenda" className="grid gap-8">
      <fieldset>
        <legend className="eyebrow mb-4">Tipo de peça</legend>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              className="pill"
              data-on={tipo === t}
              aria-pressed={tipo === t}
              onClick={() => setTipo(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-3">
        <span className="eyebrow">Que frase ou ideia você quer na peça?</span>
        <textarea
          className="campo min-h-28 resize-y"
          value={ideia}
          onChange={(e) => setIdeia(e.target.value)}
          placeholder={'Ex.: "nem tudo precisa fazer sentido", uma referência, um sentimento…'}
        />
      </label>

      <fieldset>
        <legend className="eyebrow mb-4">Onde vai ficar</legend>
        <div className="flex flex-wrap gap-2">
          {LOCAIS.map((l) => (
            <button
              key={l}
              type="button"
              className="pill"
              data-on={local === l}
              aria-pressed={local === l}
              onClick={() => setLocal(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="grid gap-3">
        <span className="eyebrow">
          Qual peça do feed te inspirou?{" "}
          <span className="normal-case tracking-normal opacity-60">(opcional)</span>
        </span>
        <input
          className="campo"
          value={inspiracao}
          onChange={(e) => setInspiracao(e.target.value)}
          placeholder="Ex.: All We Need Is Love"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-3">
          <span className="eyebrow">Seu nome</span>
          <input
            className="campo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
          />
        </label>
        <label className="grid gap-3">
          <span className="eyebrow">Seu WhatsApp</span>
          <input
            className="campo"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="(44) 9…"
          />
        </label>
      </div>

      {erro && (
        <p role="alert" className="text-sm text-ambar">
          {erro}
        </p>
      )}

      <button type="submit" className="btn-ambar justify-self-start">
        Enviar pelo WhatsApp
      </button>
    </form>
  );
}
