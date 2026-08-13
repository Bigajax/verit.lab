"use client";

import { useState } from "react";
import { waEncomenda } from "@/lib/whatsapp";

const TIPOS = ["Espelho", "Quadro", "Objeto", "Ainda não sei"];
const LOCAIS = ["Sala", "Quarto", "Estúdio", "Comércio"];

function Num({ n }: { n: string }) {
  return <span className="mr-2 font-bold text-rosa">{n}</span>;
}

// Ficha de encomenda: o submit gera a mensagem formatada e abre o wa.me.
// Sem campo de WhatsApp: a mensagem sai do WhatsApp da própria pessoa,
// o número vai junto automaticamente.
export default function FormEncomenda() {
  const [tipo, setTipo] = useState("");
  const [ideia, setIdeia] = useState("");
  const [local, setLocal] = useState("");
  const [inspiracao, setInspiracao] = useState("");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    if (!tipo) return setErro("Escolha o tipo de peça.");
    if (!ideia.trim()) return setErro("Conte a frase ou ideia da sua peça.");
    if (!local) return setErro("Diga onde a peça vai ficar.");
    setErro("");
    console.log("[verit-cta]", "form-encomenda");
    window.open(
      waEncomenda({ tipo, ideia, local, inspiracao, nome }),
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
      <div className="flex items-center justify-between gap-4 border-b border-ouro/30 px-4 py-4 sm:px-8">
        <p className="eyebrow">Ficha de encomenda</p>
        <span className="font-marker -rotate-2 text-lg text-rosa">
          peça única
        </span>
      </div>

      <div className="grid gap-8 p-4 sm:gap-9 sm:p-8">
        <fieldset>
          {/* tracking menor no mobile: label nunca quebra em 2 linhas */}
          <legend className="eyebrow mb-4 leading-[1.4] tracking-[0.08em]! sm:tracking-[0.28em]!">
            <Num n="01" />
            Tipo de peça
          </legend>
          {/* 2 colunas no mobile: sem opção órfã */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {TIPOS.map((t) => (
              <button
                key={t}
                type="button"
                className="pill min-h-12! sm:min-h-11!"
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
          <span className="eyebrow leading-[1.4] tracking-[0.08em]! sm:tracking-[0.28em]!">
            <Num n="02" />
            Que frase ou ideia você quer na peça?
          </span>
          <textarea
            className="campo min-h-[120px] resize-y text-base sm:min-h-32"
            rows={4}
            value={ideia}
            onChange={(e) => setIdeia(e.target.value)}
            placeholder={'Ex.: "nem tudo precisa fazer sentido"'}
          />
          <span className="text-xs text-osso/[0.62]">
            Pode ser uma frase pronta, uma referência do feed ou só um
            sentimento. A vérít desenha a partir daí.
          </span>
        </label>

        <fieldset>
          <legend className="eyebrow mb-4 leading-[1.4] tracking-[0.08em]! sm:tracking-[0.28em]!">
            <Num n="03" />
            Onde vai ficar
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {LOCAIS.map((l) => (
              <button
                key={l}
                type="button"
                className="pill min-h-12! sm:min-h-11!"
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
          <span className="eyebrow leading-[1.4] tracking-[0.08em]! sm:tracking-[0.28em]!">
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

        <label className="grid gap-3">
          <span className="eyebrow leading-[1.4] tracking-[0.08em]! sm:tracking-[0.28em]!">
            <Num n="05" />
            Seu nome{" "}
            <span className="normal-case tracking-normal opacity-60">
              (opcional)
            </span>
          </span>
          <input
            className="campo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            placeholder="Como a vérít te chama?"
          />
        </label>

        {erro && (
          <p role="alert" className="text-sm font-semibold text-rosa">
            {erro}
          </p>
        )}

        <div className="grid gap-5 border-t border-ouro/30 pt-6 sm:flex sm:flex-wrap sm:items-center">
          <button type="submit" className="btn-rosa w-full sm:w-auto">
            Enviar pelo WhatsApp <span aria-hidden>→</span>
          </button>
          <p className="max-w-60 text-xs leading-relaxed text-osso/[0.62]">
            Sem cadastro: abre o seu WhatsApp com a ficha pronta. Seu número
            já vai junto na mensagem.
          </p>
        </div>
      </div>
    </form>
  );
}
