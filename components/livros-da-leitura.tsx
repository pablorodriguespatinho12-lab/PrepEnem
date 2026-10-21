'use client';
import { Minus, Plus } from 'lucide-react';
import { LEITURAS } from '@/data/leituras';

type Props = {
  paginas: Record<string, number>;
  mudarPagina: (id: string, atual: number, passo: number) => void;
};

/* Os livros, a página onde parou e o − / +. */
export function LivrosDaLeitura({ paginas, mudarPagina }: Props) {
  return (
    <ul className="space-y-3">
      {LEITURAS.map((livro) => {
        const pagina = paginas[livro.id] ?? livro.pagina;
        return (
          <li key={livro.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium leading-snug">{livro.titulo}</p>
              <p className="type-meta text-muted-foreground">
                Parou na página <span data-numeric className="text-primary-text font-semibold">{pagina}</span>
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => mudarPagina(livro.id, pagina, -1)}
                aria-label={`Voltar uma página em ${livro.titulo}`}
                className="h-10 w-10 grid place-items-center rounded-full bg-primary/10 text-primary-text hover:bg-primary/15 active:scale-95 t-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => mudarPagina(livro.id, pagina, 1)}
                aria-label={`Avançar uma página em ${livro.titulo}`}
                className="h-10 w-10 grid place-items-center rounded-full bg-primary/10 text-primary-text hover:bg-primary/15 active:scale-95 t-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
