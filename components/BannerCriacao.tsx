import { getImageProps } from "next/image";
import Cta from "@/components/Cta";

/**
 * O BANNER DE CRIAÇÃO (14/10/2026, pedido do Rafael: "um banner apenas para
 * direcionar para esta parte de criação"). Entrou no lugar da seção "Você
 * pensa. a gente cria.", que tinha o texto, os três passos e a ficha. Segue
 * o banner do meio do molde: a arte 3:1 no computador, com o texto à
 * esquerda, e quadrada no celular, mostrada em 4:3 presa no topo (a metade
 * de baixo da arte é escura) e o texto num bloco logo abaixo.
 * O botão leva para #encomenda, que o ModalEncomenda (no layout) transforma
 * na ficha aberta.
 *
 * A arte sai do scripts/montar-banners.cjs (banners/banner-criacao*.png). O
 * texto nunca vai na arte.
 */
export default function BannerCriacao() {
  const comum = { alt: "", fill: true, sizes: "100vw" };
  const {
    props: { srcSet: largo },
  } = getImageProps({ ...comum, src: "/hero/criacao-a1.webp" });
  const { props: celular } = getImageProps({ ...comum, src: "/hero/criacao-a1-celular.webp" });
  return (
    <section id="encomenda" aria-labelledby="criacao-titulo" className="relative overflow-hidden bg-preto">
      <div className="relative aspect-[4/3] min-[900px]:aspect-[3/1] min-[900px]:max-h-[36rem] min-[900px]:w-full">
        {/* uma <picture> só: o navegador baixa a arte daquela largura (com duas
            <Image> e uma escondida, a do celular nunca carregava) */}
        <picture>
          <source media="(min-width: 900px)" srcSet={largo} />
          <img {...celular} alt="" className="absolute inset-0 h-full w-full object-cover object-top min-[900px]:object-center" />
        </picture>
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,#100d0a_0%,transparent_30%)] min-[900px]:bg-[linear-gradient(to_right,rgba(16,13,10,0.9)_0%,rgba(16,13,10,0.5)_40%,transparent_65%)]"
        />
      </div>

      <div className="relative -mt-16 px-5 pb-14 min-[900px]:absolute min-[900px]:inset-x-0 min-[900px]:bottom-0 min-[900px]:mt-0 min-[900px]:inset-y-0 min-[900px]:flex min-[900px]:max-w-[50%] min-[900px]:flex-col min-[900px]:justify-center min-[900px]:pb-0 min-[900px]:pl-[clamp(5rem,7vw,8rem)]">
        <h2 id="criacao-titulo" className="font-extrabold uppercase leading-[0.9] tracking-tight">
          <span className="block text-4xl sm:text-5xl lg:text-6xl">Você pensa.</span>
          <span className="font-marker block -rotate-1 pt-2 text-3xl font-normal normal-case tracking-normal text-magenta sm:text-4xl lg:text-5xl">
            a gente cria.
          </span>
        </h2>
        <p className="mt-5 max-w-md text-osso/80 sm:text-lg">
          Mande a frase ou a ideia. A vérít transforma numa peça única, pintada à mão.
        </p>
        <Cta cta="banner-criacao" href="#encomenda" className="btn-magenta mt-7 self-start">
          Encomendar a minha
        </Cta>
      </div>
    </section>
  );
}
