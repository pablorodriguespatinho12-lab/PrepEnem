'use client';

type Props = {
  rotulo: string;
  opcoes: readonly number[];
  valor: number;
  aoEscolher: (n: number) => void;
};

/* Escolher quantidade com botões, nunca com controle deslizante (Pablo,
   21/10/2026: "essa linha que dá para arrastar e aumentar o número é muito
   feia"). Arrastar é impreciso, cai em número quebrado (31) e no celular briga
   com a rolagem; o botão é um toque e diz as opções que fazem sentido. */
export function EscolhaDeNumero({ rotulo, opcoes, valor, aoEscolher }: Props) {
  return (
    <div role="radiogroup" aria-label={rotulo} className="flex flex-wrap gap-2">
      {opcoes.map((n) => {
        const escolhido = valor === n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={escolhido}
            data-numeric
            onClick={() => aoEscolher(n)}
            className={`min-h-11 min-w-12 px-3 rounded-full type-body font-semibold t-colors active:scale-95 ${
              escolhido
                ? 'bg-primary text-primary-foreground shadow-elev-1'
                : 'bg-primary/10 text-primary-text hover:bg-primary/15'
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
