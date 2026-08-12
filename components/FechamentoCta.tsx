import Cta from "@/components/Cta";

// O mesmo bloco "ENCONTROU a sua?" do rodapé da home, reutilizado
// nas páginas do catálogo. A ficha de encomenda vive na home (/#encomenda).
export default function FechamentoCta({
  mostrarVerPecas = true,
}: {
  mostrarVerPecas?: boolean;
}) {
  return (
    <section className="px-5 pb-24 sm:px-12 lg:px-20">
      <div className="border-t border-ouro/25 pt-16">
        <h2 className="font-extrabold uppercase leading-[0.9] tracking-tight">
          <span className="block text-5xl sm:text-6xl">Encontrou</span>
          <span className="font-marker block -rotate-1 pt-2 text-4xl font-normal normal-case tracking-normal text-ambar sm:text-5xl">
            a sua?
          </span>
        </h2>
        <p className="mt-5 text-osso/70">Peça única. Uma vez só.</p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Cta cta="fechamento-encomendar" href="/#encomenda" className="btn-ambar">
            Montar minha peça
          </Cta>
          {mostrarVerPecas && (
            <Cta cta="fechamento-ver-pecas" href="/pecas" className="btn-outline">
              Ver peças
            </Cta>
          )}
        </div>
      </div>
    </section>
  );
}
