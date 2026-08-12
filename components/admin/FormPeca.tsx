"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { salvarPeca, type ImagemForm } from "@/app/admin/actions";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { Categoria, Peca, StatusPeca } from "@/lib/pecas";

const CATEGORIAS: Categoria[] = ["espelho", "quadro", "objeto"];
const STATUS: { valor: StatusPeca; rotulo: string }[] = [
  { valor: "disponivel", rotulo: "Disponível" },
  { valor: "reservada", rotulo: "Reservada" },
  { valor: "vendida", rotulo: "Vendida" },
];
const PRAZO_PADRAO = "7 a 15 dias úteis";

function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// máscara BRL: só dígitos, exibidos como "R$ 2.800"
function formataPreco(digitos: string) {
  if (!digitos) return "";
  return `R$ ${Number(digitos).toLocaleString("pt-BR")}`;
}

// Comprime no aparelho antes de subir: máx 1600 px no lado maior, q80.
async function comprimir(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const escala = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("falha ao comprimir"))),
      "image/jpeg",
      0.8,
    ),
  );
}

function Rotulo({
  n,
  children,
  opcional,
}: {
  n: string;
  children: React.ReactNode;
  opcional?: boolean;
}) {
  return (
    <span className="eyebrow">
      <span className="mr-2 font-bold text-rosa">{n}</span>
      {children}
      {opcional && (
        <span className="ml-1 normal-case tracking-normal opacity-60">
          (opcional)
        </span>
      )}
    </span>
  );
}

export default function FormPeca({
  inicial,
  numeroSugerido,
  emModal,
  aoSalvo,
}: {
  inicial?: Peca;
  numeroSugerido?: string;
  // dentro do modal da lista: barra de salvar fica no rodapé do modal
  // e o pós-salvar é do chamador (fechar + toast + refresh)
  emModal?: boolean;
  aoSalvo?: () => void;
}) {
  const router = useRouter();
  const editando = Boolean(inicial);
  const inputFotos = useRef<HTMLInputElement>(null);

  const [fotos, setFotos] = useState<ImagemForm[]>(
    inicial?.imagens.map((img) => ({ url: img.url, alt: img.alt })) ?? [],
  );
  const [subindo, setSubindo] = useState(0);
  // fotos subidas nesta sessão podem ser apagadas do bucket ao remover
  const [recemSubidas] = useState(() => new Set<string>());
  const [arrastando, setArrastando] = useState<number | null>(null);

  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [slug, setSlug] = useState(inicial?.slug ?? "");
  const [slugTocado, setSlugTocado] = useState(editando);
  const [numero, setNumero] = useState(inicial?.numero ?? numeroSugerido ?? "01");
  const [categoria, setCategoria] = useState<Categoria>(
    inicial?.categoria ?? "espelho",
  );
  const [subtipo, setSubtipo] = useState(inicial?.subtipo ?? "");
  const [frase, setFrase] = useState(inicial?.frase ?? "");
  const [descricao, setDescricao] = useState(inicial?.descricao ?? "");
  const [precoDigitos, setPrecoDigitos] = useState(
    inicial?.preco != null ? String(Math.round(inicial.preco)) : "",
  );
  const [precoOriginalDigitos, setPrecoOriginalDigitos] = useState(
    inicial?.preco_original != null
      ? String(Math.round(inicial.preco_original))
      : "",
  );
  const [dimensoes, setDimensoes] = useState(inicial?.dimensoes ?? "");
  const [material, setMaterial] = useState(inicial?.material ?? "");
  const [acabamento, setAcabamento] = useState(inicial?.acabamento ?? "");
  const [prazo, setPrazo] = useState(inicial?.prazo ?? PRAZO_PADRAO);
  const [status, setStatus] = useState<StatusPeca>(inicial?.status ?? "disponivel");
  const [destaque, setDestaque] = useState(inicial?.destaque ?? false);

  const [erro, setErro] = useState("");
  const [salvando, startTransition] = useTransition();

  function aoMudarNome(valor: string) {
    setNome(valor);
    if (!slugTocado) setSlug(slugify(valor));
  }

  async function aoEscolherFotos(arquivos: FileList | null) {
    if (!arquivos?.length) return;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setErro("Modo demonstração: o upload de fotos precisa do Supabase.");
      return;
    }
    setErro("");
    setSubindo((n) => n + arquivos.length);
    const supabase = supabaseBrowser();
    for (const arquivo of Array.from(arquivos)) {
      try {
        const blob = await comprimir(arquivo);
        const nomeArquivo = `${slug || slugify(nome) || "peca"}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.jpg`;
        const { error } = await supabase.storage
          .from("pecas")
          .upload(nomeArquivo, blob, { contentType: "image/jpeg" });
        if (error) throw new Error(error.message);
        const { data } = supabase.storage.from("pecas").getPublicUrl(nomeArquivo);
        recemSubidas.add(data.publicUrl);
        setFotos((lista) => [...lista, { url: data.publicUrl, alt: null }]);
      } catch (e) {
        setErro(
          `Uma foto não subiu: ${e instanceof Error ? e.message : "erro desconhecido"}`,
        );
      } finally {
        setSubindo((n) => n - 1);
      }
    }
    if (inputFotos.current) inputFotos.current.value = "";
  }

  function moverFoto(de: number, para: number) {
    if (para < 0 || para >= fotos.length) return;
    setFotos((lista) => {
      const nova = [...lista];
      const [foto] = nova.splice(de, 1);
      nova.splice(para, 0, foto);
      return nova;
    });
  }

  function removerFoto(indice: number) {
    const foto = fotos[indice];
    setFotos((lista) => lista.filter((_, i) => i !== indice));
    // recém-subida e ainda não salva: pode sair do bucket também
    if (recemSubidas.has(foto.url)) {
      const caminho = foto.url.split("/storage/v1/object/public/pecas/")[1];
      if (caminho) supabaseBrowser().storage.from("pecas").remove([caminho]);
      recemSubidas.delete(foto.url);
    }
  }

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    setErro("");
    startTransition(async () => {
      const resultado = await salvarPeca({
        id: inicial?.id,
        slug,
        numero,
        nome,
        categoria,
        subtipo: subtipo || null,
        frase: frase || null,
        descricao: descricao || null,
        preco: precoDigitos ? Number(precoDigitos) : null,
        preco_original: precoOriginalDigitos ? Number(precoOriginalDigitos) : null,
        dimensoes,
        material: material || null,
        acabamento: acabamento || null,
        prazo: prazo || null,
        status,
        destaque,
        imagens: fotos.map((foto) => ({ url: foto.url, alt: foto.alt ?? nome })),
      });
      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }
      if (aoSalvo) {
        aoSalvo();
        return;
      }
      router.push("/admin?toast=salva");
    });
  }

  return (
    <form
      onSubmit={enviar}
      className={emModal ? "" : "mx-auto max-w-2xl pb-28 lg:pb-10"}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">
          {editando ? "Editar peça" : "Nova peça"}
        </h1>
        {editando && inicial && (
          <a
            href={`/pecas/${inicial.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow inline-flex min-h-11 items-center hover:text-ambar"
          >
            Ver no site →
          </a>
        )}
      </div>

      <div className="mt-6 grid gap-8">
        {/* 01 — fotos */}
        <fieldset>
          <legend className="mb-3">
            <Rotulo n="01">Fotos</Rotulo>
          </legend>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {fotos.map((foto, i) => (
              <div
                key={foto.url}
                draggable
                onDragStart={() => setArrastando(i)}
                onDragOver={(ev) => ev.preventDefault()}
                onDrop={() => {
                  if (arrastando !== null) moverFoto(arrastando, i);
                  setArrastando(null);
                }}
                className={`relative aspect-[4/5] cursor-grab overflow-hidden border ${
                  i === 0 ? "border-ambar" : "border-ouro/25"
                }`}
              >
                <Image src={foto.url} alt="" fill sizes="120px" className="object-cover" />
                {i === 0 && (
                  <span className="absolute left-0 top-0 bg-ambar px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-widest text-preto">
                    capa
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex bg-preto/80">
                  <button
                    type="button"
                    aria-label="Mover para a esquerda"
                    className="flex h-9 flex-1 items-center justify-center text-osso/80 hover:text-ambar disabled:opacity-30"
                    disabled={i === 0}
                    onClick={() => moverFoto(i, i - 1)}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Excluir foto"
                    className="flex h-9 flex-1 items-center justify-center text-osso/80 hover:text-rosa"
                    onClick={() => removerFoto(i)}
                  >
                    ×
                  </button>
                  <button
                    type="button"
                    aria-label="Mover para a direita"
                    className="flex h-9 flex-1 items-center justify-center text-osso/80 hover:text-ambar disabled:opacity-30"
                    disabled={i === fotos.length - 1}
                    onClick={() => moverFoto(i, i + 1)}
                  >
                    →
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => inputFotos.current?.click()}
              className="flex aspect-[4/5] flex-col items-center justify-center gap-1 border border-dashed border-ouro/40 text-osso/55 transition-colors hover:border-ambar hover:text-ambar"
            >
              <span className="text-2xl leading-none">+</span>
              <span className="text-[0.6rem] uppercase tracking-widest">
                {subindo > 0 ? `subindo ${subindo}…` : "adicionar"}
              </span>
            </button>
          </div>
          <input
            ref={inputFotos}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(ev) => aoEscolherFotos(ev.target.files)}
          />
          <p className="mt-2 text-xs text-osso/50">
            A primeira é a capa. Arraste (ou use as setas) para reordenar.
          </p>
        </fieldset>

        {/* 02 — nome */}
        <label className="grid gap-2">
          <Rotulo n="02">Nome</Rotulo>
          <input
            className="campo"
            value={nome}
            onChange={(ev) => aoMudarNome(ev.target.value)}
            placeholder="Ex.: Rolling Is Love"
            required
          />
        </label>

        {/* slug (derivado do nome, editável) */}
        <label className="grid gap-2">
          <span className="eyebrow">
            Slug{" "}
            <span className="normal-case tracking-normal opacity-60">
              (endereço da página)
            </span>
          </span>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm text-osso/45">/pecas/</span>
            <input
              className="campo"
              value={slug}
              onChange={(ev) => {
                setSlugTocado(true);
                setSlug(slugify(ev.target.value));
              }}
              required
            />
          </div>
        </label>

        {/* 03 — número do acervo */}
        <label className="grid gap-2">
          <Rotulo n="03">Número do acervo</Rotulo>
          <input
            className="campo max-w-28"
            value={numero}
            onChange={(ev) => setNumero(ev.target.value)}
            required
          />
        </label>

        {/* 04 — categoria */}
        <fieldset>
          <legend className="mb-3">
            <Rotulo n="04">Categoria</Rotulo>
          </legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                type="button"
                className="pill capitalize"
                data-on={categoria === c}
                aria-pressed={categoria === c}
                onClick={() => setCategoria(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        {/* 05 — subtipo */}
        <label className="grid gap-2">
          <Rotulo n="05" opcional>
            Subtipo
          </Rotulo>
          <input
            className="campo"
            value={subtipo}
            onChange={(ev) => setSubtipo(ev.target.value)}
            placeholder='Ex.: "Luminária", "Relógio"'
          />
        </label>

        {/* 06 — frase */}
        <label className="grid gap-2">
          <Rotulo n="06" opcional>
            Frase da peça
          </Rotulo>
          <input
            className="campo"
            value={frase}
            onChange={(ev) => setFrase(ev.target.value)}
            placeholder="A frase que está pintada na peça"
          />
        </label>

        {/* 07 — descrição */}
        <label className="grid gap-2">
          <Rotulo n="07" opcional>
            Descrição
          </Rotulo>
          <textarea
            className="campo min-h-28 resize-y"
            value={descricao}
            onChange={(ev) => setDescricao(ev.target.value)}
            placeholder="A história ou o conceito, em 2–4 linhas"
          />
        </label>

        {/* 08 — preço (com desconto opcional: de/por) */}
        <fieldset>
          <legend className="mb-3">
            <Rotulo n="08" opcional>
              Preço
            </Rotulo>
          </legend>
          <div className="flex flex-wrap gap-3">
            <label className="grid flex-1 gap-2">
              <span className="text-xs text-osso/60">Preço de venda</span>
              <input
                className="campo"
                inputMode="numeric"
                value={formataPreco(precoDigitos)}
                onChange={(ev) =>
                  setPrecoDigitos(ev.target.value.replace(/\D/g, ""))
                }
                placeholder="R$ 0"
              />
            </label>
            <label className="grid flex-1 gap-2">
              <span className="text-xs text-osso/60">
                Preço sem desconto{" "}
                <span className="text-rosa">(aparece riscado)</span>
              </span>
              <input
                className="campo"
                inputMode="numeric"
                value={formataPreco(precoOriginalDigitos)}
                onChange={(ev) =>
                  setPrecoOriginalDigitos(ev.target.value.replace(/\D/g, ""))
                }
                placeholder="R$ 0"
              />
            </label>
          </div>
          <p className="mt-2 text-xs text-osso/50">
            Preço vazio = &ldquo;sob consulta&rdquo;. O riscado só aparece na
            vitrine se for maior que o preço de venda.
          </p>
        </fieldset>

        {/* 09 — dimensões */}
        <label className="grid gap-2">
          <Rotulo n="09">Dimensões</Rotulo>
          <input
            className="campo"
            value={dimensoes}
            onChange={(ev) => setDimensoes(ev.target.value)}
            placeholder="Ex.: 1,13 m × 82 cm"
            required
          />
        </label>

        {/* 10 — material */}
        <label className="grid gap-2">
          <Rotulo n="10" opcional>
            Material
          </Rotulo>
          <input
            className="campo"
            value={material}
            onChange={(ev) => setMaterial(ev.target.value)}
            placeholder="Ex.: Moldura em madeira maciça"
          />
        </label>

        {/* 11 — acabamento */}
        <label className="grid gap-2">
          <Rotulo n="11" opcional>
            Acabamento
          </Rotulo>
          <input
            className="campo"
            value={acabamento}
            onChange={(ev) => setAcabamento(ev.target.value)}
            placeholder="Ex.: Grafite e pintura à mão"
          />
        </label>

        {/* 12 — prazo */}
        <label className="grid gap-2">
          <Rotulo n="12" opcional>
            Prazo
          </Rotulo>
          <input
            className="campo"
            value={prazo}
            onChange={(ev) => setPrazo(ev.target.value)}
          />
        </label>

        {/* 13 — status */}
        <fieldset>
          <legend className="mb-3">
            <Rotulo n="13">Status</Rotulo>
          </legend>
          <div className="flex flex-wrap gap-2">
            {STATUS.map((s) => (
              <button
                key={s.valor}
                type="button"
                className="pill"
                data-on={status === s.valor}
                aria-pressed={status === s.valor}
                onClick={() => setStatus(s.valor)}
              >
                {s.rotulo}
              </button>
            ))}
          </div>
        </fieldset>

        {/* 14 — destaque */}
        <fieldset>
          <legend className="mb-3">
            <Rotulo n="14">Destaque na home</Rotulo>
          </legend>
          <button
            type="button"
            className="pill"
            data-on={destaque}
            aria-pressed={destaque}
            onClick={() => setDestaque(!destaque)}
          >
            {destaque ? "Aparece na home" : "Só no catálogo"}
          </button>
        </fieldset>
      </div>

      {/* SALVAR fixo no rodapé da tela no mobile (ou do modal) */}
      <div
        className={
          emModal
            ? "sticky bottom-0 z-10 -mx-5 mt-8 border-t border-ouro/25 bg-preto/95 px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur sm:-mx-8 sm:px-8 sm:pb-3"
            : "fixed inset-x-0 bottom-0 z-30 border-t border-ouro/25 bg-preto/95 px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur lg:static lg:mt-10 lg:border-0 lg:bg-transparent lg:p-0"
        }
      >
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <button
            type="submit"
            className="btn-ambar flex-1 lg:flex-none"
            disabled={salvando || subindo > 0}
          >
            {salvando ? "Salvando…" : subindo > 0 ? "Subindo fotos…" : "Salvar"}
          </button>
          {erro && (
            <p role="alert" className="text-sm font-semibold text-rosa">
              {erro}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
