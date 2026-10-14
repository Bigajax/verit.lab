import { useId } from "react";

/**
 * A ESTRELA DA LOGO (14/10/2026). A logo nova da vérít termina numa estrela
 * vazada, torta, de pontas compridas, com o desgaste de carimbo do "VERIT LAB".
 * Ela vem grudada no B e no T, então não sai limpa do recorte: aqui ela é
 * redesenhada em vetor, com a mesma inclinação e um desgaste por filtro.
 *
 * Usada em poucos lugares, de propósito: o gancho no fim dos títulos de
 * pincel (como na logo, a estrela morde a última letra), o centro do carimbo
 * "nothing repeat" e o separador da faixa das frases.
 *
 * `cheia` preenche (para os tamanhos pequenos, onde o vazado some);
 * `gasta` liga o desgaste (só vale nos tamanhos grandes).
 */
const PONTAS = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    /* as pontas compridas e o miolo apertado da estrela da logo */
    const r = i % 2 === 0 ? 50 : 20;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    /* um pouco mais larga que alta, como a da logo */
    pts.push(`${(60 + r * Math.cos(a) * 1.12).toFixed(2)},${(55 + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
})();

export default function Estrela({
  className,
  cheia = false,
  gasta = false,
}: {
  className?: string;
  cheia?: boolean;
  gasta?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 110" aria-hidden="true" focusable="false" className={className}>
      {gasta ? (
        <defs>
          {/* o desgaste de carimbo: riscos e falhas que comem o traço */}
          <filter id={`gasta-${id}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9 0.06" numOctaves="2" seed="7" result="ruido" />
            <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 6.4" result="falhas" />
            <feComposite in="SourceGraphic" in2="falhas" operator="in" />
          </filter>
        </defs>
      ) : null}
      <polygon
        points={PONTAS}
        transform="rotate(-16 60 55)"
        fill={cheia ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={cheia ? 0 : 12}
        strokeLinejoin="miter"
        strokeMiterlimit={8}
        filter={gasta ? `url(#gasta-${id})` : undefined}
      />
    </svg>
  );
}
