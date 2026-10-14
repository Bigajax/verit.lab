import Estrela from "@/components/Estrela";

/**
 * A FAIXA DAS FRASES (14/10/2026, o Rafael: "abaixo do hero quero uma faixa
 * rotativa de algo com personalidade"). Não é slogan de loja: são as frases
 * que estão PINTADAS nas obras, no pincel do site, passando numa faixa ciano
 * levemente torta, separadas pela estrela da logo. Quem rola lê o acervo.
 *
 * Só frases de obras que existem (o nome de cada uma no comentário). Anda
 * devagar com movimento reduzido em vez de parar (o Android em economia liga
 * o reduzir e a faixa "não rodava", Japa 01/10) e pausa só com o mouse.
 */
const FRASES = [
  "all we need is love" /* Rolling is Love */,
  "i hope you feel good day" /* I Hope */,
  "protect your peace" /* Protect Your Peace */,
  "don't be afraid to try again" /* Try Again */,
  "move with gratitude" /* Rolling Move */,
  "dream big" /* Dream Big */,
  "life is now" /* Life is Now */,
  "tell people you love them" /* You Love */,
  "everything you want is on the other side of fear" /* Mickey Mapa */,
  "nothing repeat",
];

function Fila() {
  return (
    <p className="vl-frases__fila">
      {FRASES.map((f) => (
        <span key={f} className="vl-frases__item">
          <span className="font-marker">{f}</span>
          <Estrela cheia className="vl-frases__estrela" />
        </span>
      ))}
    </p>
  );
}

export default function FaixaFrases() {
  return (
    <div className="vl-frases" aria-hidden="true">
      <div className="vl-frases__trilho">
        <Fila />
        <Fila />
      </div>
    </div>
  );
}
