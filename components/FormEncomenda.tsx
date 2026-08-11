"use client";

import { useState } from "react";
import { waEncomenda } from "@/lib/whatsapp";

const TIPOS = ["Espelho", "Quadro", "Objeto", "Ainda não sei"];
const LOCAIS = ["Sala", "Quarto", "Estúdio", "Comércio"];

function Num({ n }: { n: string }) {
  return <span className="mr-2 font-bold text-rosa">{n}</span>;
}

// Ficha de encomenda: o submit gera a mensagem formatada e abre o wa.me.
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
    <form
      onSubmit={enviar}
      data-cta="form-encomenda"
      className="border border-ouro/30 bg-osso/[0.02]"
    >
      {/* cabeçalho da ficha */}
      <div className="flex items-center justify-between gap-4 border-b border-ouro/30 px-6 py-4 sm:px-8">
        <p className="eyebrow">Ficha de encomenda</p>
        <span className="font-marker -rotate-2 text-lg text-rosa">
          peça única
        </span>
      </div>

      <div className="grid gap-9 p-6 sm:p-8">
        <fieldset>
          <legend className="eyebrow mb-4">
            <Num n="01" />
            Tipo de peça
          </legend>
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

        {/* o coração da ficha */}
        <label className="grid gap-3">
          <span className="eyebrow">
            <Num n="02" />
            Que frase ou ideia você quer na peça?
          </span>
          <textarea
            className="campo min-h-32 resize-y text-base"
            value={ideia}
            onChange={(e) => setIdeia(e.target.value)}
            placeholder={'Ex.: "nem tudo precisa fazer sentido", uma referência, um sentimento…'}
          />
          <span className="text-xs text-osso/45">
            Pode ser uma frase pronta, uma referência do feed ou só um
            sentimento — a vérít desenha a partir daí.
          </span>
        </label>

        <fieldset>
          <legend className="eyebrow mb-4">
            <Num n="03" />
            Onde vai ficar
          </legend>
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
            <Num n="04" />
            Qual peça do feed te inspirou?{" "}
            <span className="normal-case tracking-normal opacity-60">
              (opcional)
            </span>
          </span>
          <input
            className="campo"
            value={inspiracao}
            onChange={(e) => setInspiracao(e.target.value)}
            placeholder="Ex.: Rolling Is Love"
          />
        </label>

        <div>
          <p className="eyebrow mb-4">
            <Num n="05" />
            Seus contatos
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-osso/55">
                Nome
              </span>
              <input
                className="campo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.18em] text-osso/55">
                WhatsApp
              </span>
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
        </div>

        {erro && (
          <p role="alert" className="text-sm font-semibold text-rosa">
            {erro}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-5 border-t border-ouro/30 pt-6">
          <button type="submit" className="btn-rosa">
            Enviar pelo WhatsApp <span aria-hidden>→</span>
          </button>
          <p className="max-w-52 text-xs leading-relaxed text-osso/50">
            Sem cadastro: abre o seu WhatsApp com a mensagem pronta para a
            vérít.
          </p>
        </div>
      </div>
    </form>
  );
}
